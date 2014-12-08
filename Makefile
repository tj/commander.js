
BIN := node_modules/.bin

docs: index.html

clean:
	rm -f index.{html,json}

index.html: node_modules index.json
	node compile index.json > index.html

index.json: node_modules index.js
	$(BIN)/dox < index.js > index.json

node_modules: package.json
	@npm install
	@touch node_modules

.PHONY: docs clean
