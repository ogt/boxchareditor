module = module.exports =  updateGrid;

var brushes = require('./brushes.js');

function updateGrid(model,s,oldpos, newpos, brush) {
  function updatePos(model,s,x,y) {
    if (x < 0 || y < 0) return;
    if (y >= model.gridRows || x >=model.gridCols) return;
    if (s.lines[y][x] == '+') {
      if (   (x == 0                || ' |'.indexOf(s.lines[y][x-1]) != -1)  && 
             (x == model.gridCols-1 || ' |'.indexOf(s.lines[y][x+1]) != -1)
         )  
        s.lines[y][x] = '|';
      // check if should become '-' or '='
      if (   (y == 0                || ' -='.indexOf(s.lines[y-1][x]) != -1)  && 
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

    if (brush == ' ')
      s.lines[y][x] = line;
    else if (s.lines[y][x] == '+')
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
    line = ' '
  else if (oldpos.col != newpos.col && brush == brushes.BRUSHSINGLE)
    line = '-'
  else if (oldpos.col != newpos.col && brush == brushes.BRUSHDOUBLE)
    line = '='
  else if (oldpos.row != newpos.row)
    line = '|'
  else
    return;
  updateCursor(model,s,oldpos.col,oldpos.row, line);
  updateCursor(model,s,newpos.col,newpos.row, line);
  if (line == ' ' || s.lines[oldpos.row][oldpos.col] != '+')
    s.lines[oldpos.row][oldpos.col] = line;
  if (line == ' ' || s.lines[newpos.row][newpos.col] != '+')
    s.lines[newpos.row][newpos.col] = line;
  if (brush == brushes.BRUSHERASE) {// neighbor fixups only on erase
    for (var x = Math.min(oldpos.col,newpos.col)-1;x<=Math.max(oldpos.col,newpos.col)+1;x++ ){
      for (var y = Math.min(oldpos.row,newpos.row)-1;y<=Math.max(oldpos.row,newpos.row)+1;y++ ){
        updatePos(model,s,x,y)
      }
    }
  }
}
