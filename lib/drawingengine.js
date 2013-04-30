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
      // else if .... other types of chars 
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
