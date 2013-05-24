// Tests for grid_utils.copy
var grid = require('../lib/grid_utils.js');
var test = require('tap').test;

test('copy normal', function(t) {
  t.plan(1);
  var src = [['b']];
  var dst = [['a']];
  grid.copy(dst, src, {row: 0, col: 0});
  t.deepEqual(dst, src);
  t.end();
});

test('copy ragged src', function(t) {
  t.plan(1);
  var src = [['b'], ['b', 'b']];
  var dst = [['a', 'a'], ['a', 'a']];
  grid.copy(dst, src, {row: 0, col: 0});
  t.deepEqual([['b', 'a'], ['b', 'b']], dst);
  t.end();
});

test('copy string src', function(t) {
  t.plan(1);
  var src = ['bb'];
  var dst = [['a', 'a']];
  grid.copy(dst, src, {row: 0, col: 0});
  t.deepEqual([['b', 'b']], dst);
  t.end();
});

test('copy clip rows', function(t) {
  t.plan(1);
  var src = [['b'], ['c']];
  var dst = [['a']];
  grid.copy(dst, src, {row: 0, col: 0});
  t.deepEqual([['b']], dst);
  t.end();
});

test('copy clip cols', function(t) {
  t.plan(1);
  var src = [['b', 'c']];
  var dst = [['a']];
  grid.copy(dst, src, {row: 0, col: 0});
  t.deepEqual([['b']], dst);
  t.end();
});

test('copy offset row', function(t) {
  t.plan(1);
  var src = [['b']];
  var dst = [['a'], ['a']];
  grid.copy(dst, src, {row: 1, col: 0});
  t.deepEqual(grid.to_string(dst), 'a\nb');
  t.end();
});

test('copy offset col', function(t) {
  t.plan(1);
  var src = [['b']];
  var dst = [['a', 'a']];
  grid.copy(dst, src, {row: 0, col: 1});
  t.deepEqual([['a', 'b']], dst);
  t.end();
});
