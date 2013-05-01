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
