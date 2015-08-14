/**
 * @file unit test
 * @author hushicai(bluthcy@gmail.com)
 */

var expect = require('chai').expect;
var normalize = require('../chanlun/normalize');

describe('chanlun', function () {
    describe('#normalize', function () {
        it('k up include', function () {
            var data = [
                {high: 0.8, low: 0.2}, // 应该被丢弃的数据
                {high: 1, low: 0},
                {high: 1.5, low: 0.5},
                {high: 2, low: 0.2}
            ];

            var newData = normalize(data);

            expect(newData).to.have.length(2);
            expect(newData[1].high).to.equal(2);
            expect(newData[1].low).to.equal(0.5);
        });
        it('k down include', function () {
            var data = [
                {high: 2, low: 0.8},
                {high: 1.5, low: 0.2},
                {high: 1, low: 0.4}
            ];
            var newData = normalize(data);
            expect(newData).to.have.length(2);
            expect(newData[1].high).to.equal(1);
            expect(newData[1].low).to.equal(0.2);
        });
    });
});
