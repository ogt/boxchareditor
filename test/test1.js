var eng = require('../drawingengine.js');
var grid = require('../grid_utils.js');

var test = require('tap').test;

function do_test(t,input,output,moves) {
  var model = {
    gridRows : input.length,
    gridCols : input[0].length,
  }
  var state = eng.move(model,eng.reset(model), moves);
  t.equal(grid.to_string(state.lines) , output.join('\n'));
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
  do_test(t,input,output,moves);
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
  do_test(t,input,output,moves);
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
  var moves = 'R: :2,R:-:6,L:-:5,R:=:2';
  do_test(t,input,output,moves);
});

test('erasing top half a 2x2 square', function (t) {
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
    '                   ',
    '          --       ',
    '                   '
    ];
  var moves = 'D: :1,R: :10,R:-:1,D:-:1,L:-:1,U:-:1,L: :1,R:#:5';
  do_test(t,input,output,moves);
});

test('erasing left half a 2x2 square', function (t) {
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
    '           |       ',
    '           |       ',
    '                   '
    ];
  var moves = 'D: :1,R: :10,R:-:1,D:-:1,L:-:1,U:-:1,U: :1,D:#:5';
  do_test(t,input,output,moves);
});

