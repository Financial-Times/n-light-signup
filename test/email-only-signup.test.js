import proclaim from 'proclaim';
import OEmailSignUp from '../src/email-only-signup';
import helpers from '../src/helpers';
import * as fixtures from './helpers/fixtures';

const visuallyHiddenClass = 'o-email-only-signup__visually-hidden';

describe('OEmailSignUp', () => {
	beforeEach(() => {
		fixtures.collapsibleHtml();
	});

	afterEach(() => {
		fixtures.reset();
	});

	it('is defined', () => {
		proclaim.isFunction(OEmailSignUp);
	});
	
	it("calls OEmailSignUp.defaultOptions", () => {
		const spy = sinon.spy(OEmailSignUp, 'defaultOptions')
		OEmailSignUp();

		proclaim.ok(spy.calledOnce);
		spy.restore();
	});
	
	it("calls OEmailSignUp.enhanceExperience", () => {
		const spy = sinon.spy(OEmailSignUp, 'enhanceExperience')
		OEmailSignUp();

		proclaim.ok(spy.calledOnce);
		spy.restore();
	});
	
	it("calls OEmailSignUp.makeVisible", () => {
		const spy = sinon.spy(OEmailSignUp, 'makeVisible')
		OEmailSignUp();

		proclaim.ok(spy.calledOnce);
		spy.restore();
	});
	
	it("calls OEmailSignUp.listeners", () => {
		const spy = sinon.spy(OEmailSignUp, 'listeners')
		OEmailSignUp();

		proclaim.ok(spy.calledOnce);
		spy.restore();
	});

	describe('OEmailSignUp.makeVisible', () => {
		it("makes the component visible", () => {
			const component = document.querySelector('.o-email-only-signup');

			OEmailSignUp.defaultOptions(component);
			OEmailSignUp.makeVisible();

			proclaim.notOk(component.classList.contains(visuallyHiddenClass))
		});
	});

	describe('OEmailSignUp.enhanceExperience', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		it("makes the dismiss button visible", () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');

			OEmailSignUp.enhanceExperience();
			proclaim.notOk(dismiss.classList.contains(visuallyHiddenClass));
		});
		
		it("calls OEmailSignUp.updateAria", () => {
			const spy = sinon.spy(OEmailSignUp, 'enhanceExperience')
			OEmailSignUp.enhanceExperience();

			proclaim.ok(spy.calledOnce);
			spy.restore();
		});
	});

	describe('OEmailSignUp.updateAria', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		it("updates the ARIA attributes", () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');

			OEmailSignUp.updateAria();
			proclaim.strictEqual(dismiss.getAttribute('aria-expanded'), 'true');
		});
	});

	describe("OEmailSignUp.toggleCollapsibleContent", () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component, {collapsible: true});
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
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		it("hides the full component", () => {
			const component = document.querySelector('.o-email-only-signup');

			OEmailSignUp.close();
			proclaim.strictEqual(component.style.display, 'none');
		});
	});

	describe("OEmailSignUp.apiRequest", () => {
		beforeEach(() => {
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
			sinon.stub(helpers, 'isValidEmail');
			window.fetch.returns(Promise.resolve(res));

		});
		afterEach(() => {
			helpers.isValidEmail.restore();
			window.fetch.restore();
		});

		it("makes a post request to the sign up api", () => {
			helpers.isValidEmail.returns(true);
			OEmailSignUp.apiRequest()
			proclaim.ok(window.fetch.calledOnce);
			proclaim.strictEqual(window.fetch.getCall(0).args[0], '/signup/api/light-signup');
			proclaim.strictEqual(window.fetch.getCall(0).args[1].method, 'POST');
		});

		it("does not make a post request when an invalid email address is entered", () => {
			helpers.isValidEmail.returns(false);
			OEmailSignUp.apiRequest()
			proclaim.notOk(window.fetch.called);
		});
	});
	describe("OEmailSignUp.toggleValidation", () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
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
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
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

	describe("OEmailSignUp.listeners", () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		it("calls OEmailSignUp.toggleCollapsibleContent when the close button is clicked", () => {
			const event = new Event('click');
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			const spy = sinon.spy(OEmailSignUp, 'toggleCollapsibleContent');

			OEmailSignUp.listeners();
			dismiss.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it("calls OEmailSignUp.toggleCollapsibleContent when the open button is clicked", () => {
			const event = new Event('click');
			const open = document.querySelector('[data-o-email-only-signup-open]');
			const spy = sinon.spy(OEmailSignUp, 'toggleCollapsibleContent');

			OEmailSignUp.listeners();
			open.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it("calls OEmailSignUp.apiRequest when the form is submitted", () => {
			const event = new Event('submit');
			const form = document.querySelector('[data-o-email-only-signup-form]');
			const spy = sinon.spy(OEmailSignUp, 'apiRequest');

			OEmailSignUp.listeners();
			form.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it("calls OEmailSignUp.toggleValidation when the email field has focus and is displaying an error", () => {
			OEmailSignUp.listeners();
			OEmailSignUp.toggleValidation(); // Force error message to be displayed

			const event = new Event('focus');
			const input = document.querySelector('input[name=email]');
			const spy = sinon.spy(OEmailSignUp, 'toggleValidation');

			input.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it("calls OEmailSignUp.toggleSelectPlaceholder when the select field has focus", () => {
			const event = new Event('focus');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(OEmailSignUp, 'toggleSelectPlaceholder');

			OEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});
		
		it("calls OEmailSignUp.toggleSelectPlaceholder when the select field has blur", () => {
			const event = new Event('blur');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(OEmailSignUp, 'toggleSelectPlaceholder');

			OEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});
	});
	
	describe("OEmailSignUp.toggleSelectPlaceholder", () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			OEmailSignUp.defaultOptions(component);
		});

		it("removes the inactive class when the select has focus", () => {
			const event = new Event('focus');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(OEmailSignUp, 'toggleSelectPlaceholder');

			OEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);
			proclaim.notOk(select.classList.contains('o-email-only-signup__select--inactive'));

			spy.restore();
		});
		
		it("adds the inactive class when the select has blur and the placeholder option is selected", () => {
			const event = new Event('blur');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(OEmailSignUp, 'toggleSelectPlaceholder');

			select.selectedIndex = select.querySelector('[placeholder]').index;
			
			OEmailSignUp.listeners();
			select.dispatchEvent(event);
			
			proclaim.ok(spy.calledOnce);
			proclaim.ok(select.classList.contains('o-email-only-signup__select--inactive'));

			spy.restore();
		});
	});
});
