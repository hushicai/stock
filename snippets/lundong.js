/**
 * @file 分级基金轮动策略
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-disable */

(function () {
    var t = +new Date();
    var URL_FUND_A = '/data/sfnew/funda_list/?_t=' + t;

    var promiseForA = $.ajax({
        url: URL_FUND_A,
        type: 'POST',
        dataType: 'json',
        data: {
            is_funda_search: 1,
            fundavolume: 200,
            maturity: 'forever',
            amarket: ['sh', 'sz'],
            coupon_descr: ['+3.0%'/*, '+3.2%', '+3.5%', '+4.0%'*/],
            rp: 50
        }
    });


    function toFloat(v) {
        return parseFloat(v, 10);
    }

    // 有下折保护
    function hasDownDiscount(id) {
        var blacklist = [
            '150175',
            '150022'
        ];
        return blacklist.indexOf(id) === -1;
    }

    // 整体折价
    function isMuDt(v) {
        return toFloat(v) <= 0;
    }

    // 折价率大于5%
    function isDt(v) {
        return toFloat(v) >= 5;
    }

    promiseForA.done(callback);

    function callback(a) {
        var data = a.rows;

        data = data.filter(function (v) {
            v = v.cell;
            return hasDownDiscount(v.funda_id)
//                 && isMuDt(v.funda_base_est_dis_rt)
                && isDt(v.funda_discount_rt);
        });

        // 按修正收益率倒排
        data = data.sort(function (v1, v2) {
            var t1 = toFloat(v1.funda_profit_rt_next);
            var t2 = toFloat(v2.funda_profit_rt_next);

            if (t1 > t2) {
                return -1;
            }
            
            if (t1 < t2) {
                return 1;
            }

            return 0;
        }).slice(0, 3);

        var result = [];

        data.forEach(function (v) {
            v = v.cell;
            result.push({
                '基金代码': v.funda_id,
                '基金名称': v.funda_name,
                '折价率': v.funda_discount_rt,
                '整体溢价率': v.funda_base_est_dis_rt,
                '修正收益率': v.funda_profit_rt_next
            });
        });

        console.table(result);
    }
})();
