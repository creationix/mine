var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/weird_regex.js');

test('weird_regex', function (t) {
    t.deepEqual(mine(src), [
      {name: 'buffer', offset: 707}
    ]);
    t.end();
});
