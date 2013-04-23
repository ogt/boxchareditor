var eng = require('../lib/drawingengine.js');
var grid = require('../lib/grid_utils.js');

var test = require('tap').test;

function do_test(input,output,moves) {
  var model = {
    gridRows : input.length,
    gridCols : input[0].length,
    type : 'simple'
  };
  var init_state = eng.reset(model);
  init_state.lines = grid.from_string(input.join('\n'))
  var state = eng.move(model,init_state, moves);
  return [grid.to_string(state.lines) , output.join('\n')];
}

test('drawing a 2x2 square', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '                   ',
    '                   ',
    '                   ',
    '                   '
    ];
  var output = [
    '                   ',
    '          ++       ',
    '          ++       ',
    '                   '
    ];
  var moves = 'D: :1,R: :10,R:-:1,D:-:1,L:-:1,U:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('drawing a 3x3 square with double line', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '                   ',
    '                   ',
    '                   ',
    '                   ',
    '                   ',
    '                   '
    ];
  var output = [
    '                   ',
    '     +====+        ',
    '     |    |        ',
    '     |    |        ',
    '     +----+        ',
    '                   '
    ];
  var moves = 'D: :1,R: :5,R:=:5,D:-:3,L:-:5,U:-:3';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('overwriting a single line with double line', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '  -------          ',
    ];
  var output = [
    '  -===---          ',
    ];
  var moves = 'R: :3,R:=:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('erasing top half a 2x2 square', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '                   ',
    '          ++       ',
    '          ++       ',
    '                   '
    ];
  var output = [
    '                   ',
    '                   ',
    '          --       ',
    '                   '
    ];
  var moves = 'D: :1,R: :10,R:#:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('erasing left half a 2x2 square', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '                   ',
    '          ++       ',
    '          ++       ',
    '                   '
     ];
  var output = [
    '                   ',
    '           |       ',
    '           |       ',
    '                   '
    ];
  var moves = 'D: :1,R: :10,D:#:2';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('writing/erasing at edge of buffer', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    '++',
    '++'
     ];
  var output = [
    '+-',
    '| ',
    ];
  var moves = 'R: :1,D:#:1,U: :1,L:-:1';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});

test('testing erasing and reverting to simple or double line', function (t) {
  t.plan(1);

//   0123456789012345678901234567890123456789012345678901234567890123456789
  var input = [ 
    ' |  +--+  ',
    '-+--+==+==',
  ];
  var output = [
    '          ',
    '----======'
  ];
  var moves = 'R:#:20';

  var l = do_test(input,output,moves);
  t.equal(l[0],l[1]);
  t.end();
});
