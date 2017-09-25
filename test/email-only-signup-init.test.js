/* eslint-env mocha, sinon, proclaim */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';

import oEmailSignUp from './../main';

describe("ComponentBoilerplate", () => {
	it('is defined', () => {
		proclaim.equal(typeof oEmailSignUp, 'function');
	});

	it('has a static init method', () => {
		proclaim.equal(typeof oEmailSignUp.init, 'function');
	});

	it("should autoinitialize", (done) => {
		const initSpy = sinon.spy(oEmailSignUp, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function(){
			proclaim.equal(initSpy.called, true);
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.spy(oEmailSignUp, 'init');
		proclaim.equal(initSpy.called, false);
	});

	describe("should create a new", () => {
		beforeEach(() => {
			fixtures.markup();
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("single component when initialized with a root element", () => {
			const boilerplate = oEmailSignUp.init('#element');
			proclaim.equal(boilerplate instanceof oEmailSignUp, true);
		});
	});
});
