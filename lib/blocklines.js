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

var directionEnum = {
  POSITIVE: 1,
  NEGATIVE: 0
};

var axisEnum = {
  X: 1,
  Y: 0
};

function updateGrid(model, s, oldpos, newpos, brush) {

  var MatrixMixin = {
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

  var MatrixConnectorsMixin = {
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

  function applyMixin(obj, target) {
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
  }

  function drawLine(screen, oldpos, changes) {

    function updateLinks(matrix, matrixConnectors, line, side, aside) {
      function postLinking() {
        //TODO: kill doubles

        if (matrix[side]() === ' ') return;

        var connectorsNext = matrixConnectors.linkInfo(matrix[side]());
        connectorsNext[aside] = matrixConnectors.linkInfo(matrix.center())[side];
        matrix[side](matrixConnectors.link(connectorsNext));

        if (matrix[aside]() === ' ') return;

        var connectorsPrevious = matrixConnectors.linkInfo(matrix[aside]());
        connectorsPrevious[side] = matrixConnectors.linkInfo(matrix.center())[aside];
        matrix[aside](matrixConnectors.link(connectorsPrevious));
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

    var matrix = extract3x3(screen, oldpos);
    var matrixExt = applyMixin(MatrixMixin, matrix);
    var matrixConnectorsExt = applyMixin(MatrixConnectorsMixin, matrixExt);
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

    apply3x3(matrix, screen, oldpos);
  }

  function eraseLine(screen, oldpos) {
    function eraseLink(matrix, matrixConnectors) {
      function removeTail(side, aside) {
        var connectors = matrixConnectors.linkInfo(matrix[aside]());
        delete connectors[side];
        matrix[aside](matrixConnectors.link(connectors));
      }

      matrixExt.center(' ');

      //TODO: kill doubles
      removeTail('bottom', 'top');
      removeTail('top', 'bottom');
      removeTail('left', 'right');
      removeTail('right', 'left');
    }

    var matrix = extract3x3(screen, oldpos);
    var matrixExt = applyMixin(MatrixMixin, matrix);
    var matrixConnectorsExt = applyMixin(MatrixConnectorsMixin, matrixExt);

    eraseLink(matrixExt, matrixConnectorsExt);

    apply3x3(matrix, screen, oldpos);
  }

  function clearLook(screen) {
    var matrix = extract3x3(screen, screen.cursor);
    var matrixExt = applyMixin(MatrixMixin, matrix);
    var matrixConnectorsExt = applyMixin(MatrixConnectorsMixin, matrixExt);

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

    apply3x3(matrix, screen, screen.cursor);
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
