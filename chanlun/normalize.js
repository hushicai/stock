/**
 * @file k线标准化
 * @author hushicai(bluthcy@gmail.com)
 */


var Direction = {
    INCLUDE: 0,
    UP: 1,
    DOWN: 2
};

var util = require('../lib/util');

// k1包含k2
function isForeInclude(k1, k2) {
    return (k1.high >= k2.high && k1.low <= k2.low);
}

// k2包含k1
function isBackInclude(k1, k2) {
    return (k1.high <= k2.high && k1.low >= k2.low);
}

/**
*
* 判断两根k线之间的方向
*
* @inner
* @param {Object} k1 数据
* @param {Object} k2 数据
* @return {number}
*/
function kDirection(k1, k2) {
    if (isForeInclude(k1, k2)) {
        return Direction.INCLUDE;
    }
    else if (isBackInclude(k1, k2)) {
        return Direction.INCLUDE;
    }
    else if (k1.high > k2.high && k1.low > k2.low) {
        return Direction.DOWN;
    }
    else if (k1.high < k2.high && k1.low < k2.low) {
        return Direction.UP;
    }
}

// 生成新的k线
function newKFactory(k1, k2) {
    var newK = {};
    if (isForeInclude(k1, k2)) {
        newK = util.extend({}, k2);
    }
    else if (isBackInclude(k1, k2)) {
        newK = util.extend({}, k1);
    }
    return newK;
}

function kUpInclude(k1, k2) {
    var newK = newKFactory(k1, k2);
    newK.high = Math.max(k1.high, k2.high);
    newK.low = Math.max(k1.low, k2.low);
    return newK;
}

function kDownInclude(k1, k2) {
    var newK = newKFactory(k1, k2);
    newK.high = Math.min(k1.high, k2.high);
    newK.low = Math.min(k1.low, k2.low);
    return newK;
}


/**
 * k线标准化
 *
 * @public
 * @param {Array.<Object>} data 数据
 * @return {Array.<Object>}
 */
exports = module.exports = function (data) {
    // 抛掉前面形势不明朗的数据
    for (var j = 1; j < data.length; j++) {
        var t = kDirection(data[j - 1], data[j]);
        if (t === Direction.INCLUDE) {
            data.splice(j - 1, 1);
            j = j - 1;
        }
        else {
            break;
        }
    }

    // 正式处理
    for (var i = 1; i < data.length - 1; i++) {
        var k1 = data[i - 1];
        var k2 = data[i];
        var d = kDirection(k1, k2);
        var k3 = data[i + 1];
        var d23 = kDirection(k2, k3);
        if (d23 !== Direction.INCLUDE) {
            continue;
        }
        if (d === Direction.UP) {
            // 向上包含
            data.splice(i, 2, kUpInclude(k2, k3));
        }
        else if (d === Direction.DOWN) {
            // 向下包含
            data.splice(i, 2, kDownInclude(k2, k3));
        }
    }

    return data;
};
