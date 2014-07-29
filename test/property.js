var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/property.js');

test('property', function (t) {
    t.deepEqual(mine(src), [
      {name: 'abc', offset: 9},
      {name: 'def', offset: 29} ]);
    t.end();
});
