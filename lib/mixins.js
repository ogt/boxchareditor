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

      if ('╬║╣╠╔╦╗'.indexOf(this.top()) != -1) {
        current.top = 'double';
      }

      if ('╬║╣╠╚╩╝'.indexOf(this.bottom()) != -1) {
        current.bottom = 'double';
      }

      if ('╬═╩╦╣╗╝'.indexOf(this.right()) != -1) {
        current.right = 'double';
      }

      if ('╬═╩╦╠╔╚'.indexOf(this.left()) != -1) {
        current.left = 'double';
      }

      if ('┼│┤├┌┬┐'.indexOf(this.top()) != -1) {
        current.top = 'single';
      }

      if ('┼│┤├└┴┘'.indexOf(this.bottom()) != -1) {
        current.bottom = 'single';
      }

      if ('┼─┴┬┤┐┘'.indexOf(this.right()) != -1) {
        current.right = 'single';
      }

      if ('┼─┴┬├┌└'.indexOf(this.left()) != -1) {
        current.left = 'single';
      }

      return current;
    },
    link: function(connectors) {
      if (Object.keys(connectors).length === 4) {
        if (connectors.top === 'single') {
          if (connectors.left === 'single' && connectors.right === 'single' && connectors.bottom === 'single') return '┼';

          if (connectors.left === 'double' && connectors.right === 'double' && connectors.bottom === 'single') return '╪';

        } else if (connectors.top === 'double') {
          if (connectors.left === 'single' && connectors.right === 'single' && connectors.bottom === 'double') return '╫';
          if (connectors.left === 'double' && connectors.right === 'double' && connectors.bottom === 'double') return '╬';
        }
      }

      if (Object.keys(connectors).length === 3) {
        if (connectors.top === 'single') {
          if (connectors.left === 'single' && connectors.bottom === 'single') return '┤';

          if (connectors.right === 'single' && connectors.bottom === 'single') return '├';

          if (connectors.right === 'single' && connectors.left === 'single') return '┴';

          if (connectors.right === 'double' && connectors.left === 'double') return '╧';
          if (connectors.right === 'double' && connectors.bottom === 'single') return '╞';
          if (connectors.left === 'double' && connectors.bottom === 'single') return '╡';  

        } else if (connectors.top === 'double') {
          if (connectors.left === 'double' && connectors.bottom === 'double') return '╣';
          if (connectors.left === 'single' && connectors.bottom === 'double') return '╢';
          if (connectors.right === 'single' && connectors.bottom === 'double') return '╟';
          if (connectors.right === 'double' && connectors.bottom === 'double') return '╠';
          if (connectors.right === 'single' && connectors.left === 'single') return '╨';
          if (connectors.right === 'double' && connectors.left === 'double') return '╩';
        }
        if (connectors.bottom === 'single') {
          if (connectors.left === 'single' && connectors.right === 'single') return '┬';
          if (connectors.left === 'double' && connectors.right === 'double') return '╤';

        } else if (connectors.bottom === 'double') {
          if (connectors.left === 'single' && connectors.right === 'single') return '╥';
          if (connectors.left === 'double' && connectors.right === 'double') return '╦';
        }
      }
  
      if (Object.keys(connectors).length === 2) {
// console.log('test',connectors)
        if (connectors.top === 'single') {
// console.log('connectors.top single', connectors)
          if (connectors.right === 'single') return '└';
          if (connectors.bottom === 'single') return '│';
          if (connectors.bottom === 'double') return '│'; // there is no suitable symbol
          if (connectors.left === 'single') return '┘';
          if (connectors.right === 'double') return '╘';
          if (connectors.left === 'double') return '╛';

        } else if (connectors.top === 'double') {
          if (connectors.right === 'single') return '╙';
          if (connectors.right === 'double') return '╚';
          if (connectors.bottom === 'single') return '║'; // there is no suitable symbol
          if (connectors.bottom === 'double') return '║';
          if (connectors.left === 'single') return '╜';
          if (connectors.left === 'double') return '╝';
        }

        if (connectors.right === 'single') {
          if (connectors.bottom === 'single') return '┌';
          if (connectors.left === 'single') return '─';
          if (connectors.left === 'double') return '─'; // there is no suitable symbol
          if (connectors.top === 'single') return '└';
          if (connectors.bottom === 'double') return '╓';
          if (connectors.top === 'double') return '╙';
    
        } else if (connectors.right === 'double'){
          if (connectors.bottom === 'single') return '╒';
          if (connectors.bottom === 'double') return '╔';
          if (connectors.left === 'single') return '═'; // there is no suitable symbol
          if (connectors.left === 'double') return '═';
          if (connectors.top === 'single') return '╘';
          if (connectors.top === 'double') return '╚';
        }
   
        if (connectors.bottom === 'single') {
          if (connectors.left === 'single') return '┐';
          if (connectors.right === 'single') return '┌';
          if (connectors.top === 'single') return '│';
          if (connectors.top === 'double') return '│'; // there is no suitable symbol
          if (connectors.right === 'double') return '╒';
          if (connectors.left === 'double') return '╕';

        } else if (connectors.bottom === 'double') {
          if (connectors.left === 'single') return '╖';
          if (connectors.left === 'double') return '╗';
          if (connectors.right === 'single') return '╓';
          if (connectors.right === 'double') return '╔';
          if (connectors.top === 'single') return '║'; // there is no suitable symbol
          if (connectors.top === 'double') return '║';
        }

        if (connectors.left === 'single') {
          if (connectors.bottom === 'single') return '┐';
          if (connectors.right === 'single') return '─';
          if (connectors.right === 'double') return '─'; // there is no suitable symbol
          if (connectors.top === 'single') return '┘';
          if (connectors.bottom === 'double') return '╖';
          if (connectors.top === 'double') return '╜';

        } else if (connectors.left === 'double') {
          if (connectors.bottom === 'single') return '╕';
          if (connectors.bottom === 'double') return '╗';
          if (connectors.right === 'single') return '═'; // there is no suitable symbol
          if (connectors.right === 'double') return '═';
          if (connectors.top === 'single') return '╛';
          if (connectors.top === 'double') return '╝';
        }
      }

    },

    linkInfo: function(line) {
      if (line === ' ') return {};

      if (line === '│') return {
        top: 'single',
        bottom: 'single'
      };

      if (line === '─') return {
        left: 'single',
        right: 'single'
      };

      if (line === '┼') return {
        top: 'single',
        left: 'single',
        right: 'single',
        bottom: 'single'
      };

      if (line === '┤') return {
        top: 'single',
        left: 'single',
        bottom: 'single'
      };

      if (line === '┐') return {
        bottom: 'single',
        left: 'single'
      };

      if (line === '└') return {
        top: 'single',
        right: 'single'
      };

      if (line === '┴') return {
        top: 'single',
        right: 'single',
        left: 'single'
      };

      if (line === '┬') return {
        left: 'single',
        right: 'single',
        bottom: 'single'
      };

      if (line === '├') return {
        right: 'single',
        top: 'single',
        bottom: 'single'
      };

      if (line === '┘') return {
        top: 'single',
        left: 'single'
      };

      if (line === '┌') return {
        right: 'single',
        bottom: 'single'
      };


      // double
      if (line === '║') return {
        top: 'double',
        bottom: 'double'
      };

      if (line === '═') return {
        left: 'double',
        right: 'double'
      };

      if (line === '╬') return {
        top: 'double',
        left: 'double',
        right: 'double',
        bottom: 'double'
      };

      if (line === '╣') return {
        top: 'double',
        left: 'double',
        bottom: 'double'
      };

      if (line === '╗') return {
        bottom: 'double',
        left: 'double'
      };

      if (line === '╚') return {
        top: 'double',
        right: 'double'
      };

      if (line === '╩') return {
        top: 'double',
        right: 'double',
        left: 'double'
      };

      if (line === '╦') return {
        left: 'double',
        right: 'double',
        bottom: 'double'
      };

      if (line === '╠') return {
        right: 'double',
        top: 'double',
        bottom: 'double'
      };

      if (line === '╝') return {
        top: 'double',
        left: 'double'
      };

      if (line === '╔') return {
        right: 'double',
        bottom: 'double'
      };

      // cross
      if (line === '╒') return {
        right: 'double',
        bottom: 'single'
      };

      if (line === '╓') return {
        right: 'single',
        bottom: 'double'
      };

      if (line === '╪') return {
        top: 'single',
        left: 'double',
        right: 'double',
        bottom: 'single'
      };

      if (line === '╫') return {
        top: 'double',
        left: 'single',
        right: 'single',
        bottom: 'double'
      };

      if (line === '╢') return {
        top: 'double',
        left: 'single',
        bottom: 'double'
      };
   
      if (line === '╡') return {
        top: 'single',
        left: 'double',
        bottom: 'single'
      };

      if (line === '╕') return {
        bottom: 'single',
        left: 'double'
      };
      
      if (line === '╖') return {
        bottom: 'double',
        left: 'single'
      };

      if (line === '╘') return {
        top: 'single',
        right: 'double'
      };

      if (line === '╙') return {
        top: 'double',
        right: 'single'
      };

      if (line === '╧') return {
        top: 'single',
        right: 'double',
        left: 'double'
      };

      if (line === '╨') return {
        top: 'double',
        right: 'single',
        left: 'single'
      };
      
      if (line === '╤') return {
        left: 'double',
        right: 'double',
        bottom: 'single'
      };

      if (line === '╥') return {
        left: 'single',
        right: 'single',
        bottom: 'double'
      };

      if (line === '╟') return {
        right: 'single',
        top: 'double',
        bottom: 'double'
      };

      if (line === '╞') return {
        right: 'double',
        top: 'single',
        bottom: 'single'
      };

      if (line === '╛') return {
        top: 'single',
        left: 'double'
      };

      if (line === '╜') return {
        top: 'double',
        left: 'single'
      };
      
    }
  };

  return _;
})();
