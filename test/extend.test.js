'use strict'

var rootDir = __dirname + '../..' ;

var test = require('tape');
var extend = require(rootDir + '/lib/extend.js');

test('Should return a copy of the first argument', function(t){

  var obj = {will:'bes'};

  var test = extend(obj);

  t.deepEquals(obj, test, 'clones the argument');

  test.will = 'will';

  t.equals(obj.will, 'bes', 'obj is not changed');

  t.end();

});


test('Should return an extended copy of the first argument', function(t){

  var obj = {one: 'one'};
  var ext = {two: 'two'};

  var test = extend(obj, ext);

  t.equals(test.two, 'two', 'property has been copied');
  t.equals(test.one, 'one', 'property has been copied');

  t.end();
});

test('Should not overwrite properties of original', function(t){

  var obj = {one:'one',two:'two'};
  var ext = {two: 'three'};

  var test = extend(obj, ext);

  t.equals(test.two, 'two', 'property has not been copied');

  t.end();

});