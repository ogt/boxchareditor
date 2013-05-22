var eng = require('../lib/drawingengine.js');
var grid = require('../lib/grid_utils.js');

var test = require('tap').test;

function copySelection(input, selectionBounds) {
  var model = {
      gridRows : input.length,
      gridCols : input[0].length,
      type : 'block'
  };

  var init_state = eng.reset(model);
  init_state.lines = grid.from_string(input.join('\n'));
  
  return eng.copy(model, init_state, selectionBounds);
}

test('copy entire grid', function (t) {
  t.plan(1);
  var input = [
    '                   ',
    '          ┌┐       ',
    '          └┘       ',
    '                   '
  ];
  var selectionBounds = {fromRow: 0, fromCol: 0, toRow: input.length-1, toCol: input[0].length-1};
  var expeted_output = input;
  
  t.equal(grid.to_string(copySelection(input, selectionBounds)), expeted_output.join('\n'));
  t.end();
});

test('copy empty region', function (t) {
  t.plan(3);
  var input = [
    '                   ',
    '          ┌┐       ',
    '          └┘       ',
    '                   '
  ];
  var selectionBounds = {fromRow: 0, fromCol: 0, toRow: 3, toCol: 9};
  var expeted_output = [
    '          ',
    '          ',
    '          ',
    '          '
  ];

  var selected_region = copySelection(input, selectionBounds);

  t.equal(selected_region.length,4);
  t.equal(selected_region[0].length,10);
  t.equal(grid.to_string(selected_region), expeted_output.join('\n'));
  t.end();
});


test('copy an area enclosing a rectangle', function (t) {
  t.plan(1);
  var input = [
    '                   ',
    '          ┌┐       ',
    '          └┘       ',
    '                   '
  ];
  var selectionBounds = {fromRow: 1, fromCol: 10, toRow: 2, toCol: 11};

  var expeted_output = [
    '┌┐',
    '└┘'
  ];
  
  t.equal(grid.to_string(copySelection(input, selectionBounds)), expeted_output.join('\n'));
  t.end();
});


test('invalid selection bounds', function (t) {
  t.plan(0);
  var input = [
    '                   ',
    '          ┌┐       ',
    '          └┘       ',
    '                   '
  ];
  try {
    copySelection(input, {fromRow: 0, fromCol: 0, toRow: input.length, toCol: input[0].length-1});
    t.fail("toRow greater than gird size didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: 0, fromCol: 0, toRow: input.length-1, toCol: input[0].length});
    t.fail("toCol greater than gird size didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: 1, fromCol: 0, toRow: 0, toCol: input[0].length-1});
    t.fail("fromRow greater than toRow didn't throw error");
  } catch(error) {
    // ignore
  }
  
  try {
    copySelection(input, {fromRow: 0, fromCol: 1, toRow: 0, toCol: 0});
    t.fail("fromCol greater than toCol didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: -1, fromCol: 1, toRow: input.length-1, toCol: input.length-1});
    t.fail("negative fromRow didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: 0, fromCol: -1, toRow: input.length-1, toCol: input.length-1});
    t.fail("negative fromCol didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: 0, fromCol: 0, toRow: -1, toCol: input.length-1});
    t.fail("negative toRow didn't throw error");
  } catch(error) {
    // ignore
  }

  try {
    copySelection(input, {fromRow: 0, fromCol: 0, toRow: 0, toCol: -1});
    t.fail("negative toCol didn't throw error");
  } catch(error) {
    // ignore
  }
});


