TAP=node_modules/.bin/tap
COVER=node_modules/.bin/cover
BROWSERIFY=node_modules/.bin/browserify

always:

cover: 
	$(COVER) run test/test1.js
	$(COVER) report
	$(COVER) report html

test: always
	$(TAP) test/*js

bundle:
	$(BROWSERIFY) lib/main.js -o static/bundle.js

all: cover, bundle, test
