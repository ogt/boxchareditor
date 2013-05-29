/**
 * Test for orglines
 */

var eng = require('../lib/drawingengine.js');
var grid = require('../lib/grid_utils.js');

var test = require('tap').test;

function do_test(input,output,moves) {
  var model = {
    gridRows : input.length,
    gridCols : input[0].length,
    type : 'org'
  };
  var init_state = eng.reset(model);
  init_state.lines = grid.from_string(input.join('\n'));
  var state = eng.move(model,init_state, moves);
  return [grid.to_string(state.lines) , output.join('\n')];
}

test('drawing for top-bottom middle connection', function (t) {
  t.plan(1);

  var input = [
    '  ┃    ',
    ' ━┻┳━  ',
    '       '
  ];
  var output = [
    '  ┃    ',
    ' ━┻┳━  ',
    '       '
  ];

  var moves = 'R: :1,D: :1,R:=:4,L: :2,D:=:1,U: :1,L: :1,U:=:2,D:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();

});

test('drawing for left detection', function(t) {
  t.plan(1);

  var input = [
    '  ',
    '  ',
    '  '
  ];
  var output = [
    ' ┃',
    '┏┫',
    '┗┛'
  ];
  var moves = 'R: :1,D:=:1,L:=:1,D:=:1,R:=:1,U:=:1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing window', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '     ',
    '     '
  ];
  var output = [
    ' ┏┳┓ ',
    ' ┣╋┫ ',
    ' ┗┻┛ '
  ];
  var moves = 'R: :1,R:=:2,D:=:2,L:=:2,U:=:2,R: :1,D:=:2,L: :1,U: :1,R:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 1', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┟─┾━┪ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:-:2,D:-:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:=:2,U:-:1,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 2', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┟─╁─┧ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:-:4,D:=:1,L:=:2,U:=:1,D: :1,L:=:2,U:=:1,R:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 3', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┝━┽─┧ ',
    ' ┕━┷━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:=:2,D:-:1,L:=:2,U:-:1,D: :1,R: :2,R:=:2,U:=:1,L:-:2,R:-:2,L:-:1,L: :1,L:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 4', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┢━┿━┪ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:=:4,D:=:1,L:=:4,U:=:1,D: :1,R: :2,U:-:1,L:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 5', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┢━╈━┪ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:=:4,D:=:1,L:=:4,U:=:1,D: :1,R: :2,U:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 6', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┌─┬─┐ ',
    ' ┢━╅─┧ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:-:1,D:-:1,U: :1,R:-:2,D:-:1,U: :1,L: :3,L:-:1,D:-:1,R:=:4,D:=:1,L:=:4,U:=:1,D: :1,R: :2,U:=:1,R:-:2,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 7', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┯━┓ ',
    ' ┠─╆━┫ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:-:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:-:2,D:=:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:=:2,U: :1,D:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 8', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┠─╀─┨ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:-:2,D:-:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:-:2,R:-:2,L: :2,D: :1,U:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 9', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┠─╄━┫ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:-:2,D:-:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:=:2,L: :2,R:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 10', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┣━╃─┨ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:=:2,D:-:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:-:2,R:-:2,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 11', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┠─╂─┨ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:-:2,D:=:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:-:2,R:-:2,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 12', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┣━╇━┫ ',
    ' ┗━┷━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:=:2,D:-:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:=:2,D: :1,U:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 13', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┣━╉─┨ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:=:2,D:=:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:-:2,R:-:2,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 14', function(t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    ' ┏━┳━┓ ',
    ' ┠─╊━┫ ',
    ' ┗━┻━┛ '
  ];
  var moves = 'R: :2,R:=:1,D:=:1,U: :1,R:=:2,D:=:1,U: :1,L: :3,L:=:1,D:=:1,R:-:2,D:=:1,L:=:2,U:=:1,D: :1,R: :2,R:=:2,U:=:1,L:=:2,L: :2,R:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing window 15', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '     ',
    '     '
  ];
  var output = [
    ' ┍━┑ ',
    ' │ │ ',
    ' ┕━┙ '
  ];
  var moves = 'R: :1,R:=:2,D:-:2,L:=:2,U:-:2,R:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 1', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  │  ',
    ' ─┶━ ',
    '     '
  ];
  var output = [
    '     ',
    '  │  ',
    ' ─┶━ ',
    '     '
  ];
  var moves = 'R: :1,D: :2,R:-:1,U:-:2,D: :2,R:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 2', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  │  ',
    ' ━┵─ ',
    '     '
  ];
  var output = [
    '     ',
    '  │  ',
    ' ━┵─ ',
    '     '
  ];
  var moves = 'R: :3,D: :2,L:-:1,U:-:2,D: :2,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 3', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ┃  ',
    ' ─┸─ ',
    '     '
  ];
  var output = [
    '     ',
    '  ┃  ',
    ' ─┸─ ',
    '     '
  ];
  var moves = 'R: :1,D: :2,R:-:3,L: :2,U:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 4', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ┃  ',
    ' ━┹─ ',
    '     '
  ];
  var output = [
    '     ',
    '  ┃  ',
    ' ━┹─ ',
    '     '
  ];
  var moves = 'R: :1,D: :2,R:=:1,U:=:2,D: :2,R: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 5', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ┃  ',
    ' ─┺━ ',
    '     '
  ];
  var output = [
    '     ',
    '  ┃  ',
    ' ─┺━ ',
    '     '
  ];
  var moves = 'R: :1,D: :2,R:-:1,U:=:2,D: :2,R: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 6', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ┃   ',
    ' ┞─  ',
    ' │   '
  ];
  var output = [
    '     ',
    ' ┃   ',
    ' ┞─  ',
    ' │   '
  ];
  var moves = 'R: :1,D: :1,D:=:1,R:-:1,L: :1,D: :1,U:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 7', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ┃   ',
    ' ┡━  ',
    ' │   '
  ];
  var output = [
    '     ',
    ' ┃   ',
    ' ┡━  ',
    ' │   '
  ];
  var moves = 'R: :1,D: :1,D:=:1,R:=:1,L: :1,D: :1,U:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 8', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ┃   ',
    ' ┣━  ',
    ' ┃   '
  ];
  var output = [
    '     ',
    ' ┃   ',
    ' ┣━  ',
    ' ┃   '
  ];
  var moves = 'R: :1,D: :1,D:=:1,R:=:1,L: :1,D:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 9', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ┃   ',
    ' ┠─  ',
    ' ┃   '
  ];
  var output = [
    '     ',
    ' ┃   ',
    ' ┠─  ',
    ' ┃   '
  ];
  var moves = 'R: :1,D: :1,D:=:1,R: :1,L:-:1,D: :1,U:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 10', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ━┭─ ',
    '  │  ',
    '     '
  ];
  var output = [
    '     ',
    ' ━┭─ ',
    '  │  ',
    '     '
  ];
  var moves = 'R: :1,D: :1,R:=:1,D:-:1,U: :1,R: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 11', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ─┮━ ',
    '  │  ',
    '     '
  ];
  var output = [
    '     ',
    ' ─┮━ ',
    '  │  ',
    '     '
  ];
  var moves = 'R: :1,D: :1,R:-:1,D:-:1,U: :1,R: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 12', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ━┱─ ',
    '  ┃  ',
    '     '
  ];
  var output = [
    '     ',
    ' ━┱─ ',
    '  ┃  ',
    '     '
  ];
  var moves = 'R: :1,D: :1,R:=:1,D:=:1,U: :1,R: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 13', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ─┲━ ',
    '  ┃  ',
    '     '
  ];
  var output = [
    '     ',
    ' ─┲━ ',
    '  ┃  ',
    '     '
  ];
  var moves = 'R: :1,D: :1,R:-:1,D:=:1,U: :1,R: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing mixing cross 13', function(t) {
  t.plan(1);

  var input = [
    '     ',
    ' ─┰─ ',
    '  ┃  ',
    '     '
  ];
  var output = [
    '     ',
    ' ─┰─ ',
    '  ┃  ',
    '     '
  ];
  var moves = 'R: :1,D: :1,R:-:1,D:=:1,U: :1,R: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross single vertical with single', function(t) {
  t.plan(1);

  var input = [
    ' │ '
  ];
  var output = [
    ' ┼ '
  ];
  var moves = 'R: :1,R:-:1,L: :1,L:-:1,R:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross single horizontal with single', function(t) {
  t.plan(1);

  var input = [ 
    '   ',
    ' ─ ',
    '   '
  ];
  var output = [
    '   ',
    ' ┼ ',
    '   '
  ];
  var moves = 'R: :1,D: :1,U:-:1,D: :1,D:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing a 2x2 square', function (t) {
  t.plan(1);

  var input = [
    '                   ',
    '                   ',
    '                   ',
    '                   '
  ];
  var output = [
    '                   ',
    '          ┏┓       ',
    '          ┗┛       ',
    '                   '
  ];
  var moves = 'D: :1,R: :10,R:=:1,D:=:1,L:=:1,U:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing a 2x2 square mixing', function (t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       ',
    '       '
  ];
  var output = [
    '       ',
    '  ┎─┒  ',
    '  ┖─┚  ',
    '       '
  ];
  var moves = 'D: :2,R: :2,U:=:1,R:-:2,D:=:1,L:-:2,U:=:1,R:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing bottom half a 2x2 square mixing', function (t) {
  t.plan(1);

  var input = [
    '       ',
    '       ',
    '       '
  ];
  var output = [
    '  ┃ ┃  ',
    '  ┖─┚  ',
    '       '
  ];
  var moves = 'R: :2,D:=:1,U: :1,R: :2,D:=:1,L:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('erasing top half a 2x2 square', function (t) {
  t.plan(1);

  var input = [
    '                   ',
    '          ┏┓       ',
    '          ┗┛       ',
    '                   '
  ];
  var output = [
    '                   ',
    '                   ',
    '          ┗┛       ',
    '                   '
  ];
  var moves = 'D: :1,R: :10,R:#:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('erasing left half a 2x2 square', function (t) {
  t.plan(1);

  var input = [
    '                   ',
    '          ┏┓       ',
    '          ┗┛       ',
    '                   '
  ];
  var output = [
    '                   ',
    '           ┓       ',
    '           ┛       ',
    '                   '
  ];
  var moves = 'D: :1,R: :10,D:#:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

 test('writing/erasing at edge of buffer', function (t) {
  t.plan(1);

  var input = [
    '┏┓',
    '┗┛'
  ];
  var output = [
    '┏ ',
    '┗┛'
  ];
  var moves = 'R: :1,D:#:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});