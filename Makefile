TAP=node_modules/.bin/tap
COVER=node_modules/.bin/cover
BROWSERIFY=node_modules/.bin/browserify
LINT=node_modules/.bin/jshint
#BUILDMAN=curl -F page=@- http://mantastic.herokuapp.com 
BUILDMAN=ronn -m

all: cover bundle test lint man
.PHONY : test man


man: 
	$(BUILDMAN) README.md > man/boxchareditor.1

cover: 
	$(COVER) run alltests.js
	$(COVER) report
	$(COVER) report html

test: 
	$(TAP) test/*js

bundle:
	$(BROWSERIFY) lib/main.js -o static/bundle.js

lint:
	$(LINT) lib/*.js
  
