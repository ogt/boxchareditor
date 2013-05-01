;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(){/*global eng:true, brushes:true */
eng = require('./drawingengine.js');

brushes = require('./brushes.js');

})()
},{"./drawingengine.js":2,"./brushes.js":3}],3:[function(require,module,exports){
module = module.exports = (function () {

var _ = {};

_.NOBRUSH = ' ';
_.BRUSHSINGLE = '-';
_.BRUSHDOUBLE = '=';
_.BRUSHTHICK = '~';
_.BRUSHERASE = '#';

return _;

})();

},{}],2:[function(require,module,exports){
// engine begins
/*

  var model = {
    gridRows : 4,
    gridCols : 5,
    type : 'simple',
  }
  var state = {
    cursor ':' {
      row : 0,
      col : 0
    },
    lines : [ // rows 3 Length 5
      [ ' ',' ',' ',' ',' ' ],
      [ ' ',' ',' ',' ',' ' ],
      [ ' ',' ',' ',' ',' ' ],
    ],
  }
  var step = 'D:-:10' ; // Direction:brush:speed  ie, D/U/R/L  :   -/=/ /#  : 99
  var moves = 'D: :10,R: :20,D:-:2,R:-:2,U:-:2,L:=:2';

 */

// exported functions eng_reset and eng_move

//var printf = require('printf');
var brushes = require('./brushes.js');

module = module.exports = (function () {

var _ = {};

_.reset = function (model) {
  var state = {
    cursor : {
      row : 0,
      col : 0
    },
    lines : []
  };
  for (var i=0;i<model.gridRows;i++) {
    state.lines[i] = [];
    for (var j=0;j<model.gridCols;j++){
      state.lines[i][j] = ' ';
    }
  }
  return state;
};

_.move = function (model,s, moves) {
  //alert(moves);
  var steps = moves.split(',');
  for (var i=0;i<steps.length;i++) {
    var step = steps[i].split(':');
    var dir = step[0], 
      brush = step[1] || ' ', 
      speed = parseInt(step[2],10) || 1;
    switch (dir) {
      case 'L' : dir = left; break;
      case 'R' : dir = right; break;
      case 'U' : dir = up; break;
      case 'D' : dir = down; break;
      default : 
    }

    if (dir) move(model,s,dir, speed, brush);
  }
  return s;
};



// internal functions

function left(model,s) {
  if (s.cursor.col > 0) s.cursor.col--;
}

function right(model,s) {
  if (s.cursor.col < model.gridCols - 1) s.cursor.col++;
}

function up(model,s) {
  if (s.cursor.row > 0) s.cursor.row--;
}

function down(model,s) {
  if (s.cursor.row < model.gridRows - 1) s.cursor.row++;
}

function move(model,s,direction, speed, brush) {
  for (var i=0; i<speed; i++) {
    var oldpos = {col: s.cursor.col, row: s.cursor.row};
    direction(model,s);
    var newpos = {col: s.cursor.col, row: s.cursor.row};
//    console.log(printf('direction : %s, oldpos : %s, newpos = %s, brush = %s\n',direction,JSON.stringify(oldpos),JSON.stringify(newpos),brush));
    if (brush != brushes.NOBRUSH) {
      var updateFunction = null;
      if (!model.type || model.type == 'simple') {
          updateFunction = require('./simplelines.js');
      }
      else if (model.type == 'block') {
          updateFunction = require('./blocklines.js');
      }
      if (updateFunction) {
          updateFunction(model,s,oldpos,newpos, brush);
      }
    }
  }
}

// handle left and right arrows
// http://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript

return _;

})();
// end of engine

},{"./brushes.js":3,"./simplelines.js":4,"./blocklines.js":5}],4:[function(require,module,exports){
module = module.exports =  updateGrid;

var brushes = require('./brushes.js');

function updateGrid(model,s,oldpos, newpos, brush) {
  function updatePos(model,s,x,y) {
    if (x < 0 || y < 0) return;
    if (y >= model.gridRows || x >=model.gridCols) return;
    if (s.lines[y][x] == '+') {
      if (   (x === 0                || ' |'.indexOf(s.lines[y][x-1]) != -1)  && 
             (x == model.gridCols-1 || ' |'.indexOf(s.lines[y][x+1]) != -1)
         )  
        s.lines[y][x] = '|';
      // check if should become '-' or '='
      if (   (y === 0                || ' -='.indexOf(s.lines[y-1][x]) != -1)  && 
             (y == model.gridRows-1 || ' -='.indexOf(s.lines[y+1][x]) != -1)
         )  {
        // need to revert to - or = . Will need to look left or right to decide
        if ((x>0 && '='.indexOf(s.lines[y][x-1]) != -1 ) ||
            (       '='.indexOf(s.lines[y][x+1]) != -1)
            ) {
          s.lines[y][x] = '=';
        }
        else
          s.lines[y][x] = '-';
      }
    }
  }

  function updateCursor(model,s,x,y,line) {
    var newDir = line, oldDir = s.lines[y][x];
    if (newDir == '=') newDir = '-';
    if (oldDir == '=') oldDir = '-';

    if (s.lines[y][x] == '+')
      return; // | or - or = on +
    else if (s.lines[y][x] == ' ')
      s.lines[y][x] = line; // - or = or | on ' '
    else if (newDir != oldDir)
      s.lines[y][x] = '+'; // | on -/= or -/= on |
    else
      return; // | on | or - on -
  }
  var line;
  if (brush == brushes.BRUSHERASE)
    line = ' ';
  else if (oldpos.col != newpos.col && brush == brushes.BRUSHSINGLE)
    line = '-';
  else if (oldpos.col != newpos.col && brush == brushes.BRUSHDOUBLE)
    line = '=';
  else if (oldpos.row != newpos.row)
    line = '|';
  updateCursor(model,s,oldpos.col,oldpos.row, line);
  updateCursor(model,s,newpos.col,newpos.row, line);
  if (line == ' ' || s.lines[oldpos.row][oldpos.col] != '+')
    s.lines[oldpos.row][oldpos.col] = line;
  if (line == ' ' || s.lines[newpos.row][newpos.col] != '+')
    s.lines[newpos.row][newpos.col] = line;
  if (brush == brushes.BRUSHERASE) {// neighbor fixups only on erase
    for (var x = Math.min(oldpos.col,newpos.col)-1;x<=Math.max(oldpos.col,newpos.col)+1;x++ ){
      for (var y = Math.min(oldpos.row,newpos.row)-1;y<=Math.max(oldpos.row,newpos.row)+1;y++ ){
        updatePos(model,s,x,y);
      }
    }
  }
}

},{"./brushes.js":3}],5:[function(require,module,exports){
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
      },
      topRight: function(replace) {
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
      }
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

},{"./brushes.js":3}]},{},[1])
;