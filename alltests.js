require("fs").readdirSync("./test").forEach(function(file) {
  require("./test/" + file);
});
