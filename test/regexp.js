var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/regexp.js');

test('regexp', function (t) {
    t.plan(1);
    t.deepEqual(mine(src), [
      {name: 'b', offset: 44}
    ]);
});
