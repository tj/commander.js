
TESTS = $(shell find test/test.*.js)

test:
	@./test/run $(TESTS)

index.html: index.json
	node compile $< > $@

index.json: lib/commander.js
	dox < $< > $@

.PHONY: test