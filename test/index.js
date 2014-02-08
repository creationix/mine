var test = require('tap').test;
var mine = require('../');
var fs = require('fs');

fs.readdirSync(__dirname + '/cases').forEach(function(name){
  if (/\.json$/.test(name)) return;
  name = name.slice(0, -3);
  test(name, function(t){
    t.plan(1);
    var path = __dirname + '/cases/' + name;
    var actual = mine(fs.readFileSync(path + '.js', 'utf8'));
    var expect = JSON.parse(fs.readFileSync(path + '.json', 'utf8'));
    t.deepEqual(actual, expect);
  });
});
