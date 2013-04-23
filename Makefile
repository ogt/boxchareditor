all:
	node_modules/.bin/browserify lib/main.js -o static/bundle.js
	cover run test/test1.js;cover report;cover report html
