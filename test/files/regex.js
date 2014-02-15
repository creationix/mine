/"/;
/\//
require('a')

4 / 1
require('b')

var a = 1
a /= 1
require('c')

var tricky = require('d') /require('e')

// Currently no 'easy' way to get 'g' - but this is probably rare.
var hard = require('f') / require('g') / require('h')

// EOF before 'regex' ends
a / require('i')