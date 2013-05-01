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

  function executeTransform(screen, oldpos, changes) {
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
    };

    var MatrixConnectorsMixin = {
      all: function() {
        var result = {};

        if ('┼│┤├┌┬┐'.indexOf(this.top()) != -1) {
          result.top = true;
        }

        if ('┼│┤├└┴┘'.indexOf(this.bottom()) != -1) {
          result.bottom = true;
        }

        if ('┼─┴┬┤┐┘'.indexOf(this.right()) != -1) {
          result.right = true;
        }

        if ('┼─┴┬├┌└'.indexOf(this.left()) != -1) {
          result.left = true;
        }

        return result;
      },
      link: function(connectors) {
        if (Object.keys(connectors).length < 2) return;

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
        }
      }
    };

    function onMoveX(matrix, matrixConnectors, changes) {
      var connectorsCurrent = matrixConnectors.all();
      if (Object.keys(connectorsCurrent).length === 0) {
        matrix.center('─');
        return;
      }

      if (changes.direction === directionEnum.POSITIVE) {
        connectorsCurrent.right = true;
      } else connectorsCurrent.left = true;

      matrix.center(matrixConnectors.link(connectorsCurrent));

      var connectorsPrevious = null;
      if (changes.direction === directionEnum.POSITIVE) {
        if (matrix.left() === ' ') return;

        connectorsPrevious = matrixConnectors.linkInfo(matrix.left());
        connectorsPrevious.right = matrixConnectors.linkInfo(matrix.center()).left;
        matrix.left(matrixConnectors.link(connectorsPrevious));
      } else {
        if (matrix.right() === ' ') return;

        connectorsPrevious = matrixConnectors.linkInfo(matrix.right());
        connectorsPrevious.left = matrixConnectors.linkInfo(matrix.center()).right;
        matrix.right(matrixConnectors.link(connectorsPrevious));
      }
    }

    function onMoveY(matrix, matrixConnectors, changes) {
      var connectorsCurrent = matrixConnectors.all();
      if (Object.keys(connectorsCurrent).length === 0) {
        matrix.center('│');
        return;
      }

      if (changes.direction === directionEnum.POSITIVE) {
        connectorsCurrent.bottom = true;
      } else connectorsCurrent.top = true;

      matrix.center(matrixConnectors.link(connectorsCurrent));

      var connectorsPrevious = null;
      if (changes.direction === directionEnum.POSITIVE) {
        if (matrix.top() === ' ') return;

        connectorsPrevious = matrixConnectors.linkInfo(matrix.top());
        connectorsPrevious.bottom = matrixConnectors.linkInfo(matrix.center()).top;
        matrix.top(matrixConnectors.link(connectorsPrevious));
      } else {
        if (matrix.bottom() === ' ') return;

        connectorsPrevious = matrixConnectors.linkInfo(matrix.bottom());
        connectorsPrevious.top = matrixConnectors.linkInfo(matrix.center()).bottom;
        matrix.bottom(matrixConnectors.link(connectorsPrevious));
      }
    }

    function onErase(matrix, changes) {
      matrix.center(' ')
    }

    var matrix = extract3x3(screen, oldpos);
    var matrixExt = applyMixin(MatrixMixin, matrix);
    var matrixConnectorsExt = applyMixin(MatrixConnectorsMixin, matrixExt);

    if (changes.isErase === true)
      onErase(matrixExt, changes);
    else {
      if (changes.axis === axisEnum.X) {
        onMoveX(matrixExt, matrixConnectorsExt, changes)
      }
      else onMoveY(matrixExt, matrixConnectorsExt, changes);
    }

    apply3x3(matrix, screen, oldpos);
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

  executeTransform(s, oldpos, changes);
}
