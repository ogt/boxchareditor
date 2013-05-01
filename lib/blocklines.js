/**
 * Created with JetBrains WebStorm.
 * User: http://github.com/GulinSS
 * Date: 25.03.13
 * Time: 2:22
 * Solution for http://github.com/ogt/boxchareditor/issues/2
 */

/* │ ─ ┼ */

/* ┤ ┐ └ ┴ ┬ ├ ┐ ┘ ┌ */

module = module.exports =  updateGrid;

var brushes = require('./brushes.js');

function updateGrid(model,s,oldpos, newpos, brush) {

  /*function eraseNeighbors() {
    function updatePos(model,s,x,y) {
      if (x < 0 || y < 0) return;
      if (y >= model.gridRows || x >=model.gridCols) return;

      if (s.lines[y][x] == '┼') {
        if ((x === 0 || ' │'.indexOf(s.lines[y][x-1]) != -1)  &&
          (x == model.gridCols-1 || ' │'.indexOf(s.lines[y][x+1]) != -1))
          s.lines[y][x] = '│';

        if ((y === 0 || ' ─'.indexOf(s.lines[y-1][x]) != -1)  &&
          (y == model.gridRows-1 || ' ─'.indexOf(s.lines[y+1][x]) != -1))  {

          s.lines[y][x] = '─';
        }
      }
    }

    for (var x = Math.min(oldpos.col, newpos.col) - 1; x <= Math.max(oldpos.col, newpos.col) + 1; x++) {
      for (var y = Math.min(oldpos.row, newpos.row) - 1; y <= Math.max(oldpos.row, newpos.row) + 1; y++) {
        updatePos(model, s, x, y);
      }
    }
  }*/

  /*function updateCursor(model,s,x,y,line) {
    var newDir = line, oldDir = s.lines[y][x];

    if ('┤┐└┴┬├┼'.indexOf(s.lines[y][x-1]) != -1) {

    }
    else if (s.lines[y][x] == ' ')
      s.lines[y][x] = line; // - or = or | on ' '
    else if (newDir != oldDir) {
      console.log(arguments);

      if ((x === 0 || ' │'.indexOf(s.lines[y][x-1]) != -1)  &&
        (x == model.gridCols-1 || ' │'.indexOf(s.lines[y][x+1]) != -1)) {

        s.lines[y][x] = '┐';
      }

      else if ((y === 0 || ' ─'.indexOf(s.lines[y-1][x]) != -1)  &&
        (y == model.gridRows-1 || ' ─'.indexOf(s.lines[y+1][x]) != -1))  {

        s.lines[y][x] = '└';
      }

      else s.lines[y][x] = '┼'; // | on -/= or -/= on |

    }
  }*/

  function extract3x3(screen, oldpos) {
    function getValue(offset) {
      var
        x = oldpos.col + offset.x,
        y = oldpos.row + offset.y;

      if (x < 0 || y < 0 || x >= model.gridCols || y >= model.gridRows)
        return ' ';

      return screen.lines[y][x];
    }

    return [
      [getValue({x: -1, y: -1}), getValue({x: 0, y: -1}), getValue({x: 1, y: -1})],
      [getValue({x: -1, y:  0}), getValue({x: 0, y:  0}), getValue({x: 1, y:  0})],
      [getValue({x: -1, y:  1}), getValue({x: 0, y:  1}), getValue({x: 1, y:  1})]
    ];
  }

  function apply3x3(matrix, screen, oldpos) {
    function setValue(offset, value) {
      var
        x = oldpos.col + offset.x,
        y = oldpos.row + offset.y;

      if (x < 0 || y < 0 || x >= model.gridCols || y >= model.gridRows)
        return;

      screen.lines[y][x] = value;
    }

    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        setValue({x: x-1, y: y-1}, matrix[y][x]);
      }
    }
  }

  function executeTransform(screen, oldpos, lineToWrite) {
    function applyMixin(obj, target) {
      var result = {};
      for (var key in obj) {
        result[key] = (function(key) {
          return function() {
            return obj[key].apply(target, arguments);
          };
        })(key);
      }
      return result;
    }

    var MatrixMixin = {
      top: function(replace) {
        if (replace != undefined)
          this[0][1] = replace;

        return this[0][1];
      },
      bottom: function(replace) {
        if (replace != undefined)
          this[2][1] = replace;

        return this[2][1];
      },
      left: function(replace) {
        if (replace != undefined)
          this[1][0] = replace;

        return this[1][0];
      },
      right: function(replace) {
        if (replace != undefined)
          this[1][2] = replace;

        return this[1][2];
      },
      center: function(replace) {
        if (replace != undefined)
          this[1][1] = replace;

        return this[1][1];
      }
      /*topRight: function(replace) {
        if (replace != undefined)
          this[0][2] = replace;

        return this[0][2];
      },
      bottomRight: function(replace) {
        if (replace != undefined)
          this[2][2] = replace;

        return this[2][2];
      },
      bottomLeft: function(replace) {
        if (replace != undefined)
          this[2][0] = replace;

        return this[2][0];
      },
      topLeft: function(replace) {
        if (replace != undefined)
          this[0][0] = replace;

        return this[0][0];
      }*/
    };

    function onMoveX(matrix) {
      matrix.center('─');

      if (matrix.top() !== '│' && matrix.bottom() === '│')
        matrix.center('┐');
      if (matrix.top() === '│' && matrix.bottom() !== '│')
        matrix.center('┘');
      if (matrix.top() === '│' && matrix.bottom() === '│')
        matrix.center('┤');

      if (matrix.left() === '┤')
        matrix.left('┼');

      if (matrix.right() === '├')
        matrix.right('┼');
    }

    function onMoveY(matrix) {
      matrix.center('│')
    }

    function onErase(matrix) {
      matrix.center(' ')
    }

    var matrix = extract3x3(screen, oldpos);
    var matrixExt = applyMixin(MatrixMixin, matrix);

    if (lineToWrite === ' ') onErase(matrixExt);
    if (lineToWrite === '─') onMoveX(matrixExt);
    if (lineToWrite === '│') onMoveY(matrixExt);

    apply3x3(matrix, screen, oldpos);
  }

  var line;
  if (brush == brushes.BRUSHERASE)
    line = ' ';
  else if (oldpos.col != newpos.col && brush == brushes.BRUSHSINGLE)
    line = '─';
  else if (oldpos.row != newpos.row)
    line = '│';

  executeTransform(s, oldpos, line);
}
