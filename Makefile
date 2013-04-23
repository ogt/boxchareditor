COVER=node_modules/.bin/cover
BROWSERIFY=node_modules/.bin/browserify

cover: 
	$(COVER) run test/test1.js
	$(COVER) report
	$(COVER) report html

bundle:
	$(BROWSERIFY) lib/main.js -o static/bundle.js

all: cover, bundle
