import proclaim from 'proclaim';
import mockery from 'mockery';
import OEmailSignUp from '../src/email-only-signup';
import * as fixtures from './helpers/fixtures';

const visuallyHiddenClass = 'o-email-only-signup__visually-hidden';

describe('OEmailSignUp', () => {
	beforeEach(() => {
		mockery.enable();
	});

	beforeEach(() => {
		mockery.disable();
	});

	it('is defined', () => {
		proclaim.isFunction(OEmailSignUp);
	});
	
	describe('OEmailSignUp.makeVisible', () => {
		it("makes the component visible", () => {
			fixtures.standardHtml();
			const component = document.querySelector('.o-email-only-signup');
			
			OEmailSignUp.defaultOptions(component);
			OEmailSignUp.makeVisible();
			
			proclaim.notOk(component.classList.contains(visuallyHiddenClass))
		});
	});

	describe('OEmailSignUp.enhanceExperience', () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("makes the dismiss button visible", () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			
			OEmailSignUp.enhanceExperience();
			proclaim.notOk(dismiss.classList.contains(visuallyHiddenClass));
		});


		it("updates the ARIA attributes", () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			
			OEmailSignUp.enhanceExperience();
			proclaim.strictEqual(dismiss.getAttribute('aria-expanded'), 'true');
		});
	});
	
	describe("OEmailSignUp.toggleCollapsibleContent", () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component, {collapsible: true});
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("toggles the content between collapsed and expanded", () => {
			const contentEl = document.querySelector('[data-o-email-only-signup-content]');
			const discreetEl = document.querySelector('[data-o-email-only-signup-discreet-content]');
			
			OEmailSignUp.toggleCollapsibleContent();
			
			proclaim.ok(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'true');
			proclaim.notOk(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'false');
			
			OEmailSignUp.toggleCollapsibleContent();
			
			proclaim.notOk(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'false');
			proclaim.ok(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'true');
		});
	});
		
	describe("OEmailSignUp.close", () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("hides the full component", () => {
			const component = document.querySelector('.o-email-only-signup');

			OEmailSignUp.close();
			proclaim.strictEqual(component.style.display, 'none');
		});
	});
	
	describe("OEmailSignUp.apiRequest", () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			const res = new window.Response('SUBSCRIPTION_SUCCESSFUL', {
				status: 200,
				headers: {
					'Content-type': 'application/json'
    			}
			});
			const helpersMock = {};
			OEmailSignUp.defaultOptions(component);
			sinon.stub(window, 'fetch');
			window.fetch.returns(Promise.resolve(res));
			

			mockery.registerMock('helpers', helpersMock)
		});
		
		afterEach(() => {
			window.fetch.restore();
			fixtures.reset();
		});

		it.only("makes a post request to the sign up api", () => {
			helpersMock.isValidEmail = true;
			OEmailSignUp.apiRequest()	
			proclaim.ok(window.fetch.calledOnce);
			proclaim.strictEqual(window.fetch.getCall(0).args[0], '/signup/api/light-signup');
			proclaim.strictEqual(window.fetch.getCall(0).args[1].method, 'POST');
		});
		
		it("does not make a post request when an invalid email address is entered", () => {
			const presets = {
				emailField: {
					value: sinon.stub().returns('foo')
				}
			};
			OEmailSignUp.apiRequest()	
			proclaim.notOk(window.fetch.called);
		});
	});
	describe("OEmailSignUp.toggleValidation", () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		afterEach(() => {
			fixtures.reset();
		});
		
		it("toggles the error message between hidden and visible", () => {
			const errorMessage = document.querySelector('[data-o-email-only-signup-email-error]');
			OEmailSignUp.toggleValidation()
			
			proclaim.notOk(errorMessage.classList.contains(visuallyHiddenClass));
			
			OEmailSignUp.toggleValidation()
			
			proclaim.ok(errorMessage.classList.contains(visuallyHiddenClass));
		});
	});
	
	describe("OEmailSignUp.reposition", () => {
		beforeEach(() => {
			fixtures.collapsibleHtml();
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		afterEach(() => {
			fixtures.reset();
		});
		
		it("will position itself as a child of a [data-o-email-only-signup-position-mvt] element if present", () => {
			const component = document.querySelector('.o-email-only-signup');
			const mvtElement = document.createElement('div');
			mvtElement.setAttribute('data-o-email-only-signup-position-mvt', 'true');
			document.body.append(mvtElement);
			
			OEmailSignUp.reposition(mvtElement, component);
			proclaim.strictEqual(component.parentElement.getAttribute('data-o-email-only-signup-position-mvt'), 'true');
		});
	});
});
