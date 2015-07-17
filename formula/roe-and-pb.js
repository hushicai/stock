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
    return help();
}

earning = +earning;
year = +year;
roe = +roe;

var increasing = Math.pow((1 + roe), year);
var increasingForEarning = Math.pow((1 + earning), year);

console.log('合理的pb值: %s', increasing / increasingForEarning);

function help() {
    console.log('Usage: node roe-and-pb --earning 0.15 --roe 0.18 --year 6');
}

// @see: http://blog.sina.com.cn/s/blog_67c6a2c40102va30.html
