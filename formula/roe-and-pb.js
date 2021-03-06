/**
 * @file 通过ROE确定PB的合理值
 * @author hushicai(bluthcy@gmail.com)
 */

/* eslint-disable no-console */

var minimist = require('minimist');

var argv = minimist(process.argv);

var earning = argv.earning;
var year = argv.year;
var roe = argv.roe;

if (!roe || !earning || !year) {
    help();
    process.exit(1);
}

earning = +earning;
year = +year;
// 因为roe大于30%是不可持续的，所以如果roe超过30%就记为30%。
roe = Math.min(+roe, 0.3);

var increasing = Math.pow((1 + roe), year);
var increasingForEarning = Math.pow((1 + earning), year);

console.log('pb: %s', increasing / increasingForEarning);

function help() {
    console.log('Usage: node roe-and-pb.js --earning 0.15 --roe 0.18 --year 6');
}

// @see: http://blog.sina.com.cn/s/blog_67c6a2c40102va30.html
