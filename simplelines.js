function updateTablesSimple(oldpos, newpos, brush) {
  function updatePos(x,y) {
    if (x < 0 || y < 0) return;
    if (y >= model.bufferRows || x >=model.bufferLength) return;
    if (lines[y][x] == '|')
      if (lines[y][x-1] == '-' || lines[y][x+1] == '-') lines[y][x] = '+';
    if (lines[y][x] == '-')
      if ((y>0 && lines[y-1][x] == '|') || lines[y+1][x] == '|') lines[y][x] = '+';
    if (lines[y][x] == '+') {
      if ( (  (y>0 && lines[y-1][x] == ' ') || (y>0 && lines[y-1][x] == '-'))  && (lines[y+1][x] == ' ' || lines[y+1][x] == '-') )  lines[y][x] = '-';
      if ( (lines[y][x-1] == ' ' || lines[y][x-1] == '|') && (lines[y][x+1] == ' ' || lines[y][x+1] == '|') )  lines[y][x] = '|';
    }
  }
  function updateCursor(x,y,line) {
    var newDir = line, oldDir = lines[y][x];
    if (newDir == '=') newDir = '-';
    if (oldDir == '=') oldDir = '-';

    if (brush == ' ')
      lines[y][x] = line;
    else if (lines[y][x] == '+')
      return; // | or - or = on +
    else if (lines[y][x] == ' ')
      lines[y][x] = line; // - or = or | on ' '
    else if (newDir != oldDir)
      lines[y][x] = '+'; // | on -/= or -/= on |
    else
      return; // | on | or - on -
  }
  var line;
  if (brush == BRUSHERASE)
    line = ' '
  else if (oldpos.col != newpos.col && brush == BRUSHSINGLE)
    line = '-'
  else if (oldpos.col != newpos.col && brush == BRUSHDOUBLE)
    line = '='
  else if (oldpos.row != newpos.row)
    line = '|'
  else
    return;
  updateCursor(oldpos.col,oldpos.row, line);
  updateCursor(newpos.col,newpos.row, line);
  if (line == ' ' || lines[oldpos.row][oldpos.col] != '+')
    lines[oldpos.row][oldpos.col] = line;
  if (line == ' ' || lines[newpos.row][newpos.col] != '+')
    lines[newpos.row][newpos.col] = line;
  if (brush == BRUSHERASE) {// neighbor fixups only on erase
    for (var x = Math.min(oldpos.col,newpos.col)-1;x<=Math.max(oldpos.col,newpos.col)+1;x++ ){
      for (var y = Math.min(oldpos.row,newpos.row)-1;y<=Math.max(oldpos.row,newpos.row)+1;y++ ){
        updatePos(x,y)
      }
    }
  }
}
