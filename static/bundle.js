;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(){/*global eng:true, brushes:true, grid_utils:true */
eng = require('./drawingengine.js');

brushes = require('./brushes.js');

grid_utils = require('./grid_utils.js');

})()
},{"./drawingengine.js":2,"./brushes.js":3,"./grid_utils.js":4}],3:[function(require,module,exports){
module = module.exports = (function () {

var _ = {};

_.NOBRUSH = ' ';
_.BRUSHSINGLE = '-';
_.BRUSHDOUBLE = '=';
_.BRUSHTHICK = '~';
_.BRUSHERASE = '#';

return _;

})();

},{}],4:[function(require,module,exports){
// grid operations
module = module.exports = (function () {
var _ = {};

_.from_string = function (s) {
	var list = s.split('\n');
    var lines = [];
    for (var i=0;i< list.length;i++) {
      lines[i] = list[i].split('');
    }
    return lines;
};
_.to_string = function (g) {
	var list = [];
	for (var i=0;i<g.length;i++) {
    list[i] = g[i].join('');
	}
	return list.join('\n');
};

/** Copy one grid onto another
 * dst: destination grid
 * src: source grid; may be ragged (row lengths not equal)
 * offset: from the origin of the destination grid {row: #, col: #}
 */
_.copy = function(dst, src, offset) {
    var rows = Math.min(src.length, dst.length - offset.row);
    for (var row_i=0; row_i < rows; row_i++) {
      var dst_row = dst[row_i + offset.row];
      var cols = Math.min(src[row_i].length, dst_row.length - offset.col);
      for (var col_i=0; col_i < cols; col_i++)
        dst_row[col_i + offset.col] = src[row_i][col_i];
    }
    return dst;
};

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

// Copys the data within the selected bounds
// and returns it as a new grid.
_.copy = function(model, s, selectionBounds) {
  if (!isValidSelection(model, selectionBounds)){
    throw {name: "InvalidBounds", message: "Bounds for selection not valid"};
  }
  var selectedContent = [];
  for (var i=selectionBounds.fromRow; i<= selectionBounds.toRow;i++) {
    var copy = [].concat(s.lines[i]);
    selectedContent.push(copy.splice(selectionBounds.fromCol, selectionBounds.toCol - selectionBounds.fromCol + 1));
  }
  return selectedContent;
};

function isValidSelection(model, selectionBounds) {
  return isValidRow(model, selectionBounds.fromRow) && isValidCol(model, selectionBounds.fromCol) && 
    isValidRow(model, selectionBounds.toRow) && isValidCol(model, selectionBounds.toCol) && 
    selectionBounds.fromRow <= selectionBounds.toRow && selectionBounds.fromCol <= selectionBounds.toCol;
}

function isValidRow(model, row) {
  return row >= 0 && row < model.gridRows;
}

function isValidCol(model, col) {
  return col >= 0 && col < model.gridCols;
}


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

},{"./brushes.js":3,"./simplelines.js":5,"./blocklines.js":6}],5:[function(require,module,exports){
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

},{"./brushes.js":3}],6:[function(require,module,exports){
/**
 * Created with JetBrains WebStorm.
 * User: http://github.com/GulinSS
 * Date: 25.03.13
 * Time: 2:22
 * Solution for http://github.com/ogt/boxchareditor/issues/2
 */

/* │ ─ ┼ */

/* ┤ ┐ └ ┴ ┬ ├ ┘ ┌ */

module = module.exports =  updateGrid;

var brushes = require('./brushes.js');
var mixins = require('./mixins.js');
var matrix3x3 = require('./matrix3x3.js');

var directionEnum = {
  POSITIVE: 1,
  NEGATIVE: 0
};

var axisEnum = {
  X: 1,
  Y: 0
};

function updateGrid(model, s, oldpos, newpos, brush) {

  function drawLine(screen, oldpos, changes) {

    function updateLinks(matrix, matrixConnectors, line, side, aside) {
      function postLinking() {
        //TODO: kill doubles

        if (matrix[side]() === ' ') return;

        var connectorsNext = matrixConnectors.linkInfo(matrix[side]());
        connectorsNext[aside] = matrixConnectors.linkInfo(matrix.center())[side];
        matrix[side](matrixConnectors.link(connectorsNext));
      }

      var linkCurrent = matrixConnectors.linkInfo(matrix.center());
      var connectorsCurrent = matrixConnectors.all(linkCurrent);

      if (Object.keys(connectorsCurrent).length === 0) {
        matrix.center(line);
      } else {
        connectorsCurrent[side] = true;
        matrix.center(matrixConnectors.link(connectorsCurrent));
      }

      postLinking();
    }

    var matrix = matrix3x3.extract3x3(model, screen, oldpos);
    var matrixExt = mixins.apply(mixins.Matrix, matrix);
    var matrixConnectorsExt = mixins.apply(mixins.MatrixConnectors, matrixExt);
    var line = changes.axis === axisEnum.X ? '─' : '│';
    var link = {
      from: null,
      to: null
    };

    if (changes.axis === axisEnum.X)
      if (changes.direction === directionEnum.POSITIVE) {
        link.to = 'right';
        link.from = 'left';
      }
      else {
        link.to = 'left';
        link.from = 'right';
      }
    else
    if (changes.direction === directionEnum.POSITIVE) {
      link.to = 'bottom';
      link.from = 'top';
    }
    else {
      link.to = 'top';
      link.from = 'bottom';
    }

    updateLinks(matrixExt, matrixConnectorsExt, line, link.to, link.from);

    matrix3x3.apply3x3(model, matrix, screen, oldpos);
  }

  function eraseLine(screen, oldpos) {
    function eraseLink(matrix, matrixConnectors) {
      function removeTail(side, aside) {
        var connectors = matrixConnectors.linkInfo(matrix[aside]());
        delete connectors[side];
        matrix[aside](matrixConnectors.link(connectors));
      }

      matrixExt.center(' ');

      removeTail('bottom', 'top');
      removeTail('top', 'bottom');
      removeTail('left', 'right');
      removeTail('right', 'left');
    }

    var matrix = matrix3x3.extract3x3(model, screen, oldpos);
    var matrixExt = mixins.apply(mixins.Matrix, matrix);
    var matrixConnectorsExt = mixins.apply(mixins.MatrixConnectors, matrixExt);

    eraseLink(matrixExt, matrixConnectorsExt);

    matrix3x3.apply3x3(model, matrix, screen, oldpos);
  }

  function clearLook(screen) {
    var matrix = matrix3x3.extract3x3(model, screen, screen.cursor);
    var matrixExt = mixins.apply(mixins.Matrix, matrix);
    var matrixConnectorsExt = mixins.apply(mixins.MatrixConnectors, matrixExt);

    // TODO: for delete like classic algo
    // if (matrixExt.center() === ' ') return;

    var connectors = matrixConnectorsExt.all();
    if (matrixExt.top() === ' ')
      delete connectors.top;

    if (matrixExt.bottom() === ' ')
      delete connectors.bottom;

    if (matrixExt.left() === ' ')
      delete connectors.left;

    if (matrixExt.right() === ' ')
      delete connectors.right;

    matrixExt.center(matrixConnectorsExt.link(connectors));

    matrix3x3.apply3x3(model, matrix, screen, screen.cursor);
  }

  var changes = {
    isErase: false,
    direction: null,
    axis: null
  };

  if (brush == brushes.BRUSHERASE)
    changes.isErase = true;
  if (oldpos.col != newpos.col) {
    changes.axis = axisEnum.X;

    if (newpos.col - oldpos.col > 0)
      changes.direction = directionEnum.POSITIVE;
    else changes.direction = directionEnum.NEGATIVE;
  }
  else {
    changes.axis = axisEnum.Y;

    if (newpos.row - oldpos.row > 0)
      changes.direction = directionEnum.POSITIVE;
    else changes.direction = directionEnum.NEGATIVE;
  }

  if (changes.isErase) {
    eraseLine(s, oldpos);
  } else
    drawLine(s, oldpos, changes);

  clearLook(s);
}

},{"./brushes.js":3,"./mixins.js":7,"./matrix3x3.js":8}],7:[function(require,module,exports){
module = module.exports = (function () {
  var _ = {};

  _.apply = function (obj, target) {
    var result = {};

    var fn = function(key) {
      return function() {
        return obj[key].apply(target, arguments);
      };
    };

    for (var key in obj) {
      result[key] = fn(key);
    }
    return result;
  };

  _.Matrix = {
    top: function(replace) {
      if (replace !== undefined)
        this[0][1] = replace;

      return this[0][1];
    },
    bottom: function(replace) {
      if (replace !== undefined)
        this[2][1] = replace;

      return this[2][1];
    },
    left: function(replace) {
      if (replace !== undefined)
        this[1][0] = replace;

      return this[1][0];
    },
    right: function(replace) {
      if (replace !== undefined)
        this[1][2] = replace;

      return this[1][2];
    },
    center: function(replace) {
      if (replace !== undefined)
        this[1][1] = replace;

      return this[1][1];
    }
  };

  _.MatrixConnectors = {
    all: function(current) {
      current = current || {};

      if ('┼│┤├┌┬┐'.indexOf(this.top()) != -1) {
        current.top = true;
      }

      if ('┼│┤├└┴┘'.indexOf(this.bottom()) != -1) {
        current.bottom = true;
      }

      if ('┼─┴┬┤┐┘'.indexOf(this.right()) != -1) {
        current.right = true;
      }

      if ('┼─┴┬├┌└'.indexOf(this.left()) != -1) {
        current.left = true;
      }

      return current;
    },
    link: function(connectors) {
      if (Object.keys(connectors).length === 4) return '┼';

      if (Object.keys(connectors).length === 2) {
        if (connectors.top) {
          if (connectors.right) return '└';
          if (connectors.bottom) return '│';
          if (connectors.left) return '┘';
        }

        if (connectors.right) {
          if (connectors.bottom) return '┌';
          if (connectors.left) return '─';
        }

        if (connectors.bottom) {
          if (connectors.left) return '┐';
        }
      }

      if (Object.keys(connectors).length === 3) {
        if (connectors.top) {
          if (connectors.right) {
            if (connectors.bottom) return "├";
            if (connectors.left) return "┴";
          }

          if (connectors.bottom) {
            if (connectors.left) return "┤";
          }
        }

        if (connectors.right) {
          if (connectors.bottom) {
            if (connectors.left) return "┬";
          }
        }
      }
    },
    linkInfo: function(line) {
      if (line === ' ') return {};

      if (line === '│') return {
        top: true,
        bottom: true
      };

      if (line === '─') return {
        left: true,
        right: true
      };

      if (line === '┼') return {
        top: true,
        left: true,
        right: true,
        bottom: true
      };

      if (line === '┤') return {
        top: true,
        left: true,
        bottom: true
      };

      if (line === '┐') return {
        bottom: true,
        left: true
      };

      if (line === '└') return {
        top: true,
        right: true
      };

      if (line === '┴') return {
        top: true,
        right: true,
        left: true
      };

      if (line === '┬') return {
        left: true,
        right: true,
        bottom: true
      };

      if (line === '├') return {
        right: true,
        top: true,
        bottom: true
      };

      if (line === '┘') return {
        top: true,
        left: true
      };

      if (line === '┌') return {
        right: true,
        bottom: true
      };
    }
  };

  return _;
})();

},{}],8:[function(require,module,exports){
module = module.exports = (function () {
  var _ = {};

  _.extract3x3 = function (model, screen, oldpos) {
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
  };

  _.apply3x3 = function (model, matrix, screen, oldpos) {
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
  };

  return _;
})();

},{}]},{},[1])
;