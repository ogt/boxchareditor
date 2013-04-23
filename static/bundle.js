;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
eng = require('./drawingengine.js');
brushes = require('./brushes.js')

},{"./drawingengine.js":2,"./brushes.js":3}],3:[function(require,module,exports){
var module = module.exports = (function () {

var _ = {}

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

var printf = require('printf');
var brushes = require('./brushes.js')

var module = module.exports = (function () {

var _ = {}

_.reset = function (model) {
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

_.move = function (model,s, moves) {
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

var simpleUpdate = require('./simplelines.js');

function move(model,s,direction, speed, brush) {
  for (var i=0; i<speed; i++) {
    var oldpos = {col: s.cursor.col, row: s.cursor.row};
    direction(model,s);
    var newpos = {col: s.cursor.col, row: s.cursor.row};
//    console.log(printf('direction : %s, oldpos : %s, newpos = %s, brush = %s\n',direction,JSON.stringify(oldpos),JSON.stringify(newpos),brush));
    if (brush != brushes.NOBRUSH) {
      if (!model.type || model.type == 'simple') {
        simpleUpdate(model,s,oldpos,newpos, brush);
      }
    }
  }
}

// handle left and right arrows
// http://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript

return _;

})();

// end of engine
},{"./brushes.js":3,"./simplelines.js":4,"printf":5}],4:[function(require,module,exports){
module = module.exports =  updateGrid;

var brushes = require('./brushes.js');

function updateGrid(model,s,oldpos, newpos, brush) {
  function updatePos(model,s,x,y) {
    if (x < 0 || y < 0) return;
    if (y >= model.gridRows || x >=model.gridCols) return;
    if (s.lines[y][x] == '+') {
      // check if should become '|'
      if (   (x == 0                || ' |'.indexOf(s.lines[y][x-1]) != -1)  && 
             (x == model.gridCols-1 || ' |'.indexOf(s.lines[y][x+1]) != -1)
         )  
        s.lines[y][x] = '|';
      // check if should become '-' or '='
      if (   (y == 0                || ' -='.indexOf(s.lines[y-1][x]) != -1)  && 
             (y == model.gridRows-1 || ' -='.indexOf(s.lines[y+1][x]) != -1)
         )  {
        // need to revert to - or = . Will need to look left or right to decide
        if (x>0 && s.lines[y][x-1] != ' ') {
          s.lines[y][x] = s.lines[y][x-1];
        }
        else if (s.lines[y][x+1] != ' ') {
          s.lines[y][x] = s.lines[y][x+1];
        }
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

},{"./brushes.js":3}],5:[function(require,module,exports){

var util = require('util');

var tokenize = function(/*String*/ str, /*RegExp*/ re, /*Function?*/ parseDelim, /*Object?*/ instance){
  // summary:
  //    Split a string by a regular expression with the ability to capture the delimeters
  // parseDelim:
  //    Each group (excluding the 0 group) is passed as a parameter. If the function returns
  //    a value, it's added to the list of tokens.
  // instance:
  //    Used as the "this' instance when calling parseDelim
  var tokens = [];
  var match, content, lastIndex = 0;
  while(match = re.exec(str)){
    content = str.slice(lastIndex, re.lastIndex - match[0].length);
    if(content.length){
      tokens.push(content);
    }
    if(parseDelim){
      var parsed = parseDelim.apply(instance, match.slice(1).concat(tokens.length));
      if(typeof parsed != 'undefined'){
        if(parsed.specifier === '%'){
          tokens.push('%');
        }else{
          tokens.push(parsed);
        }
      }
    }
    lastIndex = re.lastIndex;
  }
  content = str.slice(lastIndex);
  if(content.length){
    tokens.push(content);
  }
  return tokens;
}

var Formatter = function(/*String*/ format){
  var tokens = [];
  this._mapped = false;
  this._format = format;
  this._tokens = tokenize(format, this._re, this._parseDelim, this);
}

Formatter.prototype._re = /\%(?:\(([\w_]+)\)|([1-9]\d*)\$)?([0 +\-\#]*)(\*|\d+)?(\.)?(\*|\d+)?[hlL]?([\%AbscdeEfFgGioOuxX])/g;
Formatter.prototype._parseDelim = function(mapping, intmapping, flags, minWidth, period, precision, specifier){
  if(mapping){
    this._mapped = true;
  }
  return {
    mapping: mapping,
    intmapping: intmapping,
    flags: flags,
    _minWidth: minWidth, // May be dependent on parameters
    period: period,
    _precision: precision, // May be dependent on parameters
    specifier: specifier
  };
};
Formatter.prototype._specifiers = {
  b: {
    base: 2,
    isInt: true
  },
  o: {
    base: 8,
    isInt: true
  },
  x: {
    base: 16,
    isInt: true
  },
  X: {
    extend: ['x'],
    toUpper: true
  },
  d: {
    base: 10,
    isInt: true
  },
  i: {
    extend: ['d']
  },
  u: {
    extend: ['d'],
    isUnsigned: true
  },
  c: {
    setArg: function(token){
      if(!isNaN(token.arg)){
        var num = parseInt(token.arg);
        if(num < 0 || num > 127){
          throw new Error('invalid character code passed to %c in printf');
        }
        token.arg = isNaN(num) ? '' + num : String.fromCharCode(num);
      }
    }
  },
  s: {
    setMaxWidth: function(token){
      token.maxWidth = (token.period == '.') ? token.precision : -1;
    }
  },
  e: {
    isDouble: true,
    doubleNotation: 'e'
  },
  E: {
    extend: ['e'],
    toUpper: true
  },
  f: {
    isDouble: true,
    doubleNotation: 'f'
  },
  F: {
    extend: ['f']
  },
  g: {
    isDouble: true,
    doubleNotation: 'g'
  },
  G: {
    extend: ['g'],
    toUpper: true
  },
  O: {
    isObject: true,
    showNonEnumerable: true
  },
  A: {
    isObject: true,
    showNonEnumerable: false
  },
};
Formatter.prototype.format = function(/*mixed...*/ filler){
  if(this._mapped && typeof filler != 'object'){
    throw new Error('format requires a mapping');
  }

  var str = '';
  var position = 0;
  for(var i = 0, token; i < this._tokens.length; i++){
    token = this._tokens[i];
    
    if(typeof token == 'string'){
      str += token;
    }else{
      if(this._mapped){
        if(typeof filler[token.mapping] == 'undefined'){
          throw new Error('missing key ' + token.mapping);
        }
        token.arg = filler[token.mapping];
      }else{
        if(token.intmapping){
          var position = parseInt(token.intmapping) - 1;
        }
        if(position >= arguments.length){
          throw new Error('got ' + arguments.length + ' printf arguments, insufficient for \'' + this._format + '\'');
        }
        token.arg = arguments[position++];
      }

      if(!token.compiled){
        token.compiled = true;
        token.sign = '';
        token.zeroPad = false;
        token.rightJustify = false;
        token.alternative = false;

        var flags = {};
        for(var fi = token.flags.length; fi--;){
          var flag = token.flags.charAt(fi);
          flags[flag] = true;
          switch(flag){
            case ' ':
              token.sign = ' ';
              break;
            case '+':
              token.sign = '+';
              break;
            case '0':
              token.zeroPad = (flags['-']) ? false : true;
              break;
            case '-':
              token.rightJustify = true;
              token.zeroPad = false;
              break;
            case '\#':
              token.alternative = true;
              break;
            default:
              throw Error('bad formatting flag \'' + token.flags.charAt(fi) + '\'');
          }
        }

        token.minWidth = (token._minWidth) ? parseInt(token._minWidth) : 0;
        token.maxWidth = -1;
        token.toUpper = false;
        token.isUnsigned = false;
        token.isInt = false;
        token.isDouble = false;
        token.isObject = false;
        token.precision = 1;
        if(token.period == '.'){
          if(token._precision){
            token.precision = parseInt(token._precision);
          }else{
            token.precision = 0;
          }
        }

        var mixins = this._specifiers[token.specifier];
        if(typeof mixins == 'undefined'){
          throw new Error('unexpected specifier \'' + token.specifier + '\'');
        }
        if(mixins.extend){
          var s = this._specifiers[mixins.extend];
          for(var k in s){
            mixins[k] = s[k]
          }
          delete mixins.extend;
        }
        for(var k in mixins){
          token[k] = mixins[k];
        }
      }

      if(typeof token.setArg == 'function'){
        token.setArg(token);
      }

      if(typeof token.setMaxWidth == 'function'){
        token.setMaxWidth(token);
      }

      if(token._minWidth == '*'){
        if(this._mapped){
          throw new Error('* width not supported in mapped formats');
        }
        token.minWidth = parseInt(arguments[position++]);
        if(isNaN(token.minWidth)){
          throw new Error('the argument for * width at position ' + position + ' is not a number in ' + this._format);
        }
        // negative width means rightJustify
        if (token.minWidth < 0) {
          token.rightJustify = true;
          token.minWidth = -token.minWidth;
        }
      }

      if(token._precision == '*' && token.period == '.'){
        if(this._mapped){
          throw new Error('* precision not supported in mapped formats');
        }
        token.precision = parseInt(arguments[position++]);
        if(isNaN(token.precision)){
          throw Error('the argument for * precision at position ' + position + ' is not a number in ' + this._format);
        }
        // negative precision means unspecified
        if (token.precision < 0) {
          token.precision = 1;
          token.period = '';
        }
      }
      if(token.isInt){
        // a specified precision means no zero padding
        if(token.period == '.'){
          token.zeroPad = false;
        }
        this.formatInt(token);
      }else if(token.isDouble){
        if(token.period != '.'){
          token.precision = 6;
        }
        this.formatDouble(token); 
      }else if(token.isObject){
        this.formatObject(token);
      }
      this.fitField(token);

      str += '' + token.arg;
    }
  }

  return str;
};
Formatter.prototype._zeros10 = '0000000000';
Formatter.prototype._spaces10 = '          ';
Formatter.prototype.formatInt = function(token) {
  var i = parseInt(token.arg);
  if(!isFinite(i)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not an integer; parseInt returned ' + i);
    }
    //return '' + i;
    i = 0;
  }

  // if not base 10, make negatives be positive
  // otherwise, (-10).toString(16) is '-a' instead of 'fffffff6'
  if(i < 0 && (token.isUnsigned || token.base != 10)){
    i = 0xffffffff + i + 1;
  } 

  if(i < 0){
    token.arg = (- i).toString(token.base);
    this.zeroPad(token);
    token.arg = '-' + token.arg;
  }else{
    token.arg = i.toString(token.base);
    // need to make sure that argument 0 with precision==0 is formatted as ''
    if(!i && !token.precision){
      token.arg = '';
    }else{
      this.zeroPad(token);
    }
    if(token.sign){
      token.arg = token.sign + token.arg;
    }
  }
  if(token.base == 16){
    if(token.alternative){
      token.arg = '0x' + token.arg;
    }
    token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
  }
  if(token.base == 8){
    if(token.alternative && token.arg.charAt(0) != '0'){
      token.arg = '0' + token.arg;
    }
  }
};
Formatter.prototype.formatDouble = function(token) {
  var f = parseFloat(token.arg);
  if(!isFinite(f)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not a float; parseFloat returned ' + f);
    }
    // C99 says that for 'f':
    //   infinity -> '[-]inf' or '[-]infinity' ('[-]INF' or '[-]INFINITY' for 'F')
    //   NaN -> a string  starting with 'nan' ('NAN' for 'F')
    // this is not commonly implemented though.
    //return '' + f;
    f = 0;
  }

  switch(token.doubleNotation) {
    case 'e': {
      token.arg = f.toExponential(token.precision); 
      break;
    }
    case 'f': {
      token.arg = f.toFixed(token.precision); 
      break;
    }
    case 'g': {
      // C says use 'e' notation if exponent is < -4 or is >= prec
      // ECMAScript for toPrecision says use exponential notation if exponent is >= prec,
      // though step 17 of toPrecision indicates a test for < -6 to force exponential.
      if(Math.abs(f) < 0.0001){
        //print('forcing exponential notation for f=' + f);
        token.arg = f.toExponential(token.precision > 0 ? token.precision - 1 : token.precision);
      }else{
        token.arg = f.toPrecision(token.precision); 
      }

      // In C, unlike 'f', 'gG' removes trailing 0s from fractional part, unless alternative format flag ('#').
      // But ECMAScript formats toPrecision as 0.00100000. So remove trailing 0s.
      if(!token.alternative){ 
        //print('replacing trailing 0 in \'' + s + '\'');
        token.arg = token.arg.replace(/(\..*[^0])0*/, '$1');
        // if fractional part is entirely 0, remove it and decimal point
        token.arg = token.arg.replace(/\.0*e/, 'e').replace(/\.0$/,'');
      }
      break;
    }
    default: throw new Error('unexpected double notation \'' + token.doubleNotation + '\'');
  }

  // C says that exponent must have at least two digits.
  // But ECMAScript does not; toExponential results in things like '1.000000e-8' and '1.000000e+8'.
  // Note that s.replace(/e([\+\-])(\d)/, 'e$10$2') won't work because of the '$10' instead of '$1'.
  // And replace(re, func) isn't supported on IE50 or Safari1.
  token.arg = token.arg.replace(/e\+(\d)$/, 'e+0$1').replace(/e\-(\d)$/, 'e-0$1');

  // if alt, ensure a decimal point
  if(token.alternative){
    token.arg = token.arg.replace(/^(\d+)$/,'$1.');
    token.arg = token.arg.replace(/^(\d+)e/,'$1.e');
  }

  if(f >= 0 && token.sign){
    token.arg = token.sign + token.arg;
  }

  token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
};
Formatter.prototype.formatObject = function(token) {
  // If no precision is specified, then reset it to null (infinite depth).
  var precision = (token.period === '.') ? token.precision : null;
  token.arg = util.inspect(token.arg, token.showNonEnumerable, precision);
};
Formatter.prototype.zeroPad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.precision;
  var negative = false;
  if(typeof token.arg != "string"){
    token.arg = "" + token.arg;
  }
  if (token.arg.substr(0,1) === '-') {
    negative = true;
    token.arg = token.arg.substr(1);
  }

  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._zeros10 : this._zeros10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._zeros10.substring(0, pad) : this._zeros10.substring(0, pad) + token.arg;
  if (negative) token.arg = '-' + token.arg;
};
Formatter.prototype.fitField = function(token) {
  if(token.maxWidth >= 0 && token.arg.length > token.maxWidth){
    return token.arg.substring(0, token.maxWidth);
  }
  if(token.zeroPad){
    this.zeroPad(token, token.minWidth);
    return;
  }
  this.spacePad(token);
};
Formatter.prototype.spacePad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.minWidth;
  if(typeof token.arg != 'string'){
    token.arg = '' + token.arg;
  }
  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._spaces10 : this._spaces10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._spaces10.substring(0, pad) : this._spaces10.substring(0, pad) + token.arg;
};


module.exports = function(){
  var args = Array.prototype.slice.call(arguments),
    stream, format;
  if(args[0] instanceof require('stream').Stream){
    stream = args.shift();
  }
  format = args.shift();
  var formatter = new Formatter(format);
  var string = formatter.format.apply(formatter, args);
  if(stream){
    stream.write(string);
  }else{
    return string;
  }
};

module.exports.Formatter = Formatter;


},{"util":6,"stream":7}],6:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":8}],7:[function(require,module,exports){
var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once, and
  // only when all sources have ended.
  if (!dest._isStdio && (!options || options.end !== false)) {
    dest._pipeCount = dest._pipeCount || 0;
    dest._pipeCount++;

    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":8,"util":6}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],8:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":9}]},{},[1])
;