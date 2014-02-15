var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/division.js');

test('division', function (t) {
  t.plan(1);
  t.deepEqual(mine(src), [
    {name: 'a', offset: 29},
    {name: 'b', offset: 66},
    {name: 'c', offset: 112}
  ]);
});