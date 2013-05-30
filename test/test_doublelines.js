/**
 * Test for double lines
 */

var eng = require('../lib/drawingengine.js');
var grid = require('../lib/grid_utils.js');

var test = require('tap').test;

function do_test(input,output,moves) {
  var model = {
    gridRows : input.length,
    gridCols : input[0].length,
    type : 'block'
  };
  var init_state = eng.reset(model);
  init_state.lines = grid.from_string(input.join('\n'));
  var state = eng.move(model,init_state, moves);
  return [grid.to_string(state.lines) , output.join('\n')];
}

test('drawing for top-bottom middle connection', function (t) {
  t.plan(1);

  var input = [
    '    ',
    '    ',
    '    '
  ];
  var output = [
    '    ',
    ' ╩╦ ',
    '    '
  ];

  var moves = 'R: :1,D: :1,R:=:2,L:=:1,D:=:1,U: :1,D:=:1,U: :1,L: :1,U:=:1,D: :1,U:=:1';

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
    ' ║',
    '╔╣',
    '╚╝'
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
    ' ╔╦╗ ',
    ' ╠╬╣ ',
    ' ╚╩╝ '
  ];
  var moves = 'R: :1,R:=:2,D:=:2,L:=:2,U:=:2,R: :1,D:=:2,L: :1,U: :1,R:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross', function(t) {
  t.plan(1);

  var input = [
    ' ║ '
  ];
  var output = [
    ' ╬ '
  ];
  var moves = 'R: :1,R:=:1,L:=:1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross single with double', function(t) {
  t.plan(1);

  var input = [
    ' ║ '
  ];
  var output = [
    ' ╫ '
  ];
  var moves = 'R: :1,R:-:1,L: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('test cross single with double', function(t) {
  t.plan(1);

  var input = [
    '   ║   ',
    '  ─╫─  ',
    '   ║   '
  ];
  var output = [
    '   ║   ',
    '  ─╫── ',
    '   ║   '
  ];
  var moves = 'R: :1,D: :1,R:-:5';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross double with single top', function(t) {
  t.plan(1);

  var input = [
    ' │ '
  ];
  var output = [
    ' ╪ '
  ];
  var moves = 'R: :1,R:=:1,L: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross double with single right', function(t) {
  t.plan(1);

  var input = [
    '   │   '
  ];
  var output = [
    '  ═╪══ '
  ];
  var moves = 'R: :5,L:=:4';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross double with single right 2', function(t) {
  t.plan(1);

  var input = [
    '   │   '
  ];
  var output = [
    '  ═╪═  '
  ];
  var moves = 'R: :2,R:=:3';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('test cross double with single right symbol', function(t) {
  t.plan(1);

  var input = [
    '  ║  ',
    ' ─╫─ ',
    '  ║  '
  ];
  var output = [
    '  ║  ',
    ' ─╫─ ',
    '  ║  '
  ];
  var moves = 'R: :2,D:=:3';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('test cross double with single top symbol', function(t) {
  t.plan(1);

  var input = [
    ' │ ',
    '═╪═',
    ' │ '
  ];
  var output = [
    ' │ ',
    '═╪═',
    ' │ '
  ];
  var moves = 'R: :1,D:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross single with single', function(t) {
  t.plan(1);

  var input = [
    ' │ '
  ];
  var output = [
    ' ┼ '
  ];
  var moves = 'R: :1,R:-:1,L: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross double with single', function(t) {
  t.plan(1);

  var input = [
    ' ║ '
  ];
  var output = [
    ' ╫ '
  ];
  var moves = 'R: :1,R:-:1,L: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing cross double with single', function(t) {
  t.plan(1);

  var input = [
    '   ',
    ' ─ ',
    '   '
  ];
  var output = [
    '   ',
    ' ╫ ',
    '   '
  ];
  var moves = 'R: :1,D: :1,U:=:1,D: :1,D:=:1';

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
    ' ┌╥┐ ',
    ' ╞╬╡ ',
    ' └╨┘ '
  ];
  var moves = 'R: :1,R:-:2,D:-:2,L:-:2,U:-:2,R: :1,D:=:2,L: :1,U: :1,R:=:2,L: :1,U:=:1';

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
    ' ╔╤╗ ',
    ' ╟┼╢ ',
    ' ╚╧╝ '
  ];
  var moves = 'R: :1,R:=:2,D:=:2,L:=:2,U:=:2,R: :1,D:-:2,L: :1,U: :1,R:-:2,L:-:2,R:-:1,D:-:1,U:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing bottom single - right double', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '     '
  ];
  var output = [
    ' ╒═  ',
    ' │   '
  ];
  var moves = 'R: :2,L:=:1,D:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing left double - bottom single', function(t) {
  t.plan(1);

  var input = [
    '    ',
    '    '
  ];
  var output = [
    ' ═╕ ',
    '  │ '
  ];
  var moves = 'R: :1,R:=:1,D:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing left single - bottom double', function(t) {
  t.plan(1);

  var input = [
    '    ',
    '    '
  ];
  var output = [
    ' ─╖ ',
    '  ║ '
  ];
  var moves = 'R: :2,D: :1,U:=:1,L:-:2,R:-:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing window', function(t) {
  t.plan(1);

  var input = [
    ' └─┘ ',
    '     '
  ];
  var output = [
    ' ├─┤ ',
    '     '
  ];
  var moves = 'R: :1,D:-:1,U: :1,R: :2,D:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing single and double top left angle crossing', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ══ '
  ];
  var output = [
    '  │  ',
    '  ╘═ '
  ];
  var moves = 'R: :2,D:-:1,R: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing single and double top right angle crossing', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ══ '
  ];
  var output = [
    '   │ ',
    '  ═╛ '
  ];
  var moves = 'R: :3,D:-:1,L: :1,R:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});


test('drawing single and double top crossing', function(t) {
  t.plan(1);

  var input = [
    '   ',
    '   ',
    ' ║ '
  ];
  var output = [
    ' │ ',
    ' │ ',
    ' ║ '
  ];
  var moves = 'R: :1,D:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing double and single top crossing', function(t) {
  t.plan(1);

  var input = [
    '   ',
    '   ',
    ' │ '
  ];
  var output = [
    ' ║ ',
    ' ║ ',
    ' │ '
  ];
  var moves = 'R: :1,D:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing double and single top left angle crossing', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ── '
  ];
  var output = [
    '  ║  ',
    '  ╙─ '
  ];
  var moves = 'R: :2,D:=:1,R: :1,L:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing double and single top right angle crossing', function(t) {
  t.plan(1);

  var input = [
    '     ',
    '  ── '
  ];
  var output = [
    '   ║ ',
    '  ─╜ '
  ];
  var moves = 'R: :3,D:=:1,L: :1,R:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing double right crossing', function(t) {
  t.plan(1);

  var input = [
    '   ═  '
  ];
  var output = [
    ' ─══  '
  ];
  var moves = 'R: :1,R:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing single right crossing', function(t) {
  t.plan(1);

  var input = [
    '   ─  '
  ];
  var output = [
    ' ═──  '
  ];
  var moves = 'R: :1,R:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing double and single right top angle crossing', function(t) {
  t.plan(1);

  var input = [
    '  ── ',
    '     '
  ];
  var output = [
    ' ╓── ',
    ' ║   ',
  ];
  var moves = 'R: :1,D:=:2';

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
    '          ╔╗       ',
    '          ╚╝       ',
    '                   '
  ];
  var moves = 'D: :1,R: :10,R:=:1,D:=:1,L:=:1,U:=:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('erasing top half a 2x2 square', function (t) {
  t.plan(1);

  var input = [
    '                   ',
    '          ╔╗       ',
    '          ╚╝       ',
    '                   '
  ];
  var output = [
    '                   ',
    '                   ',
    '          ╚╝       ',
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
    '          ╔╗       ',
    '          ╚╝       ',
    '                   '
  ];
  var output = [
    '                   ',
    '           ╗       ',
    '           ╝       ',
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
    '╔╗',
    '╚╝'
  ];
  var output = [
    '╔ ',
    '╚╝'
  ];
  var moves = 'R: :1,D:#:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});
