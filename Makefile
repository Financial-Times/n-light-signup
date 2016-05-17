.PHONY: test

clean:
	git clean -fxd

install:
	obt install --verbose

build:
	obt build

demo:
	obt demo --runServer

watch:
	obt demo --runServer --watch

test:
	npm test

verify:
	obt verify
