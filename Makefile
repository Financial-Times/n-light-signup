.PHONY: test

clean:
	git clean -fxd

install:
	obt install --verbose

build:
	obt build

demo:
	obt demo --runServer --updateorigami

watch:
	obt demo --runServer --updateorigami --watch

test:
	npm test

verify:
	obt verify
