/**
 * @file main
 * @author hushicai(bluthcy@gmail.com)
 */

var data = require('./input.json');
var result = [];
for (var date in data) {
    if (data.hasOwnProperty(date)) {
        var item = data[date];
        item.date = date;
        result.push(item);
    }
}

var normalize = require('../../chanlun/normalize');
var newData = normalize(result);

var option = {
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            var res = params[0].seriesName + ' ' + params[0].name;
            res += '<br/>  开盘: ' + params[0].value[0] + '  最高: ' + params[0].value[3];
            res += '<br/>  收盘: ' + params[0].value[1] + '  最低: ' + params[0].value[2];
            return res;
        }
    },
    dataZoom: {
        show: true,
        realtime: true,
        start: 50,
        end: 100
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            axisTick: {onGap: false},
            splitLine: {show: false},
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            boundaryGap: [0.01, 0.01]
        }
    ],
    series: [
        {
            name: 'test',
            type: 'k',
            data: []
        }
    ]
};

newData.forEach(function (item, i) {
    option.xAxis[0].data.push(item.date);
    option.series[0].data.push(
        [item.open, item.close, item.low, item.high]
    );
});

var fs = require('fs');
var path = require('path');

fs.writeFileSync(path.resolve(__dirname, 'output.json'), JSON.stringify(option), 'utf8');

