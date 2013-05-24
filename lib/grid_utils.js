// grid operations
module = module.exports = (function () {
var _ = {};

_.from_string = function (s) {
	var list = s.split('\n');
    var lines = [];
    for (var i=0;i< list.length;i++) {
      lines[i] = list[i].split('');
    }
    return lines;
};
_.to_string = function (g) {
	var list = [];
	for (var i=0;i<g.length;i++) {
    list[i] = g[i].join('');
	}
	return list.join('\n');
};

/** Copy one grid onto another
 * dst: destination grid
 * src: source grid; may be ragged (row lengths not equal)
 * offset: from the origin of the destination grid {row: #, col: #}
 */
_.copy = function(dst, src, offset) {
    var rows = Math.min(src.length, dst.length - offset.row);
    for (var row_i=0; row_i < rows; row_i++) {
      var dst_row = dst[row_i + offset.row];
      var cols = Math.min(src[row_i].length, dst_row.length - offset.col);
      for (var col_i=0; col_i < cols; col_i++)
        dst_row[col_i + offset.col] = src[row_i][col_i];
    }
    return dst;
};

return _;
})();
