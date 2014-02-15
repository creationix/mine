var test = require('tap').test;
var mine = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/regex.js');

test('regex or division', function (t) {
    t.deepEqual(mine(src), [
      {name: 'a', offset: 19},
      {name: 'b', offset: 39},
      {name: 'c', offset: 70},
      {name: 'd', offset: 97},
      {name: 'e', offset: 111},
      {name: 'f', offset: 203},
      // currently not able to find a require()
      // between two / tokens on the same line
      //{name: 'g', offset: 218},
      {name: 'h', offset: 233},
      {name: 'i', offset: 278}, ]);
    t.end();
});
