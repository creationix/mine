var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/word.js');

test('word', function (t) {
    t.deepEqual(mine(src), []);
    t.end();
});
