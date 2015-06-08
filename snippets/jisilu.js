/**
 * @file jisilu
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-disable */

(function () {
    var t = +new Date();
    var URL_FUND_A = '/data/sfnew/funda_list/?_t=' + t;
    var URL_FUND_B = '/data/sfnew/fundb_list/?_t=' + t;
    var URL_FUND_M = '/jisiludata/sfnew.php?_t=' + t;

    var promiseForA = $.ajax({
        url: URL_FUND_A,
        type: 'POST',
        dataType: 'json',
        data: {
            is_funda_search: 1,
            fundavolume: 1000,
            maturity: 'forever',
            amarket: ['sh', 'sz'],
            coupon_descr: ['+3.0%', '+3.2%', '+3.5%', '+4.0%', 'other'],
            rp: 50
        }
    });

    var promiseForB = $.ajax({
        url: URL_FUND_B,
        type: 'POST',
        dataType: 'json',
        data: {
            is_fundb_search: 1,
            rp: 50
        }
    });

    var promiseForM = $.ajax({
        url: URL_FUND_M,
        type: 'POST',
        dataType: 'json',
        data: {
            rp: 50
        }
    });

    function toFloat(v) {
        return parseFloat(v, 10);
    }

    $.when(promiseForA, promiseForB, promiseForM).done(function (a, b, m) {
        a = a[0];
        b = b[0];
        m = m[0];

        var sumForVolumnAndProfitRtNext = 0;
        var sumForVolumn = 0;

        a.rows.forEach(function (row) {
            var id = row.id;
            var cell = row.cell;

            sumForVolumnAndProfitRtNext += toFloat(cell.funda_volume) * toFloat(cell.funda_profit_rt_next);
            sumForVolumn += toFloat(cell.funda_volume);
        });

        // 隐含收益率加权平均值
        var averageProfitRtNext = sumForVolumnAndProfitRtNext / sumForVolumn;

        var fundA = [];

        var fundAIndex = {};

        a.rows.forEach(function (row) {
            var cell = row.cell;
            var id = cell.funda_id;

            cell.funda_reasonable_price = cell.funda_coupon / averageProfitRtNext + toFloat(cell.funda_value) - 1;

            if (toFloat(cell.funda_profit_rt_next) >= averageProfitRtNext
            && toFloat(cell.funda_base_est_dis_rt) < 0
            && toFloat(cell.funda_current_price) <  cell.funda_reasonable_price
            ) {
                fundA.push({
                    '代码': id,
                    '名称': cell.funda_name,
                    '现价': cell.funda_current_price,
                    '合理交易价': cell.funda_reasonable_price
                });
            }

            fundAIndex[id] = cell;
        });

        console.table(fundA);

        var b2aMap = {};

        m.rows.forEach(function (row) {
            var cell = row.cell;

            b2aMap[cell.fundB_id] = cell.fundA_id;
        });

        var fundB = [];

        b.rows.forEach(function (row) {
            var cell = row.cell;
            var id = cell.fundb_id;

            var fundAId = b2aMap[id];

            var fundA = fundAIndex[fundAId];

            if (!fundA) {
                return;
            }

            var abrate = cell.abrate.split(':');
            abrate = abrate.map(function (v, i) {
                return toFloat(abrate[i]) / (toFloat(abrate[0]) + toFloat(abrate[1]));
            });

            cell.fundb_reasonable_price = (toFloat(cell.fundb_base_price) - abrate[0] * fundA.funda_reasonable_price) / abrate[1];

            if (toFloat(cell.fundb_current_price) < cell.fundb_reasonable_price
            && toFloat(cell.fundb_base_est_dis_rt) < 0
            ) {
                fundB.push({
                    '代码': id,
                    '名称': cell.fundb_name,
                    '现价': cell.fundb_current_price,
                    '合理交易价': cell.fundb_reasonable_price
                });
            }
        });

        console.table(fundB);
    });
})();
