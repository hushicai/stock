/**
 * @file 价值回归
 * @author hushicai(bluthcy@gmail.com)
 */

var minimist = require('minimist');

var argv = minimist(process.argv);

// 未来上市公司的盈利增长率
// 20% ~ 40%
var profit = argv.profit;
// 预期收益率
var earning = argv.earning;
// 未来5年
var year = 5;
// 估值锚，也许可以参考行业平均pe
var valuation = 10;

if (!profit || !earning) {
    help();
    process.exit(1);
}

var pe = (Math.pow(1 + profit, year) / Math.pow(1 + earning, 5) * valuation).toFixed(2);

var heads = ['refer', 'key'];
var cols = [pe, valuation];

for (var i = 1; i <= year; i++) {
    heads.push(i);
    cols.push((valuation * Math.pow(1 + profit, i)).toFixed(2));
}

var Table = require('cli-table');
var table = new Table({
    head: heads
});
table.push(cols);

console.log(table.toString());

function help() {
    console.log('Usage: node pe.js --earning 0.15 --profit 0.2');
}
