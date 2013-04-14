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

function eng_reset(model) {
  var state = {
    cursor : {
      row : 0,
      col : 0
    },
    lines : [],
  }
  for (var i=0;i<model.gridRows;i++) {
    state.lines[i] = []
    for (var j=0;j<model.gridCols;j++){
      state.lines[i][j] = ' ';
    }
  }
  return state;
}

function eng_move(model,s, moves) {
  //alert(moves);
  var steps = moves.split(',')
  for (var i=0;i<steps.length;i++) {
    var step = steps[i].split(':');
    var dir = step[0], 
      brush = step[1] || ' ', 
      speed = parseInt(step[2]) || 1;
    switch (dir) {
      case 'L' : dir = left; break;
      case 'R' : dir = right; break;
      case 'U' : dir = up; break;
      case 'D' : dir = down; break;
      default : 
    }

    if (dir) move(model,s,dir, speed, brush)
  }
  return s;
}

// internal functions

function left(model,s) {
  if (s.cursor.col > 0) s.cursor.col--
}

function right(model,s) {
  if (s.cursor.col < model.gridCols - 1) s.cursor.col++
}

function up(model,s) {
  if (s.cursor.row > 0) s.cursor.row--
}

function down(model,s) {
  if (s.cursor.row < model.gridRows - 1) s.cursor.row++
}

function move(model,s,direction, speed, brush) {
  for (var i=0; i<speed; i++) {
    var oldpos = {col: s.cursor.col, row: s.cursor.row};
    direction(model,s);
    var newpos = {col: s.cursor.col, row: s.cursor.row};
//    alert('direction : '+direction+' oldpos : '+JSON.stringify(oldpos) + ' newpos : '+JSON.stringify(newpos) + ' brush : '+brush)
    if (brush != NOBRUSH) {
      if (model.type == 'simple') {
        updateTablesSimple(model,s,oldpos,newpos, brush);
      }
    }
  }
}

// handle left and right arrows
// http://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript



// end of engine