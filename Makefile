TAP=node_modules/.bin/tap
COVER=node_modules/.bin/cover
BROWSERIFY=node_modules/.bin/browserify
LINT=node_modules/.bin/jshint
#BUILDMAN=curl -F page=@- http://mantastic.herokuapp.com 
BUILDMAN=ronn

all: cover bundle test lint
.PHONY : test, man


man: 
	$(BUILDMAN)  < README.md > man/boxchareditor.1

cover: 
	$(COVER) run test/test1.js
	$(COVER) report
	$(COVER) report html

test: 
	$(TAP) test/*js

bundle:
	$(BROWSERIFY) lib/main.js -o static/bundle.js

lint:
	$(LINT) lib/*.js
  
