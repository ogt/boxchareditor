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
