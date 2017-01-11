import proclaim from 'proclaim';
import oEmailOnlySignup from '../src/email-only-signup';
import * as fixtures from './helpers/fixtures';

const visuallyHiddenClass = 'o-email-only-signup__visually-hidden';

describe('Email only sign up', () => {
	it('is defined', () => {
		proclaim.isFunction(oEmailOnlySignup);
	});
	
	describe("Component gets enhanced from a core experience", () => {
		afterEach(() => {
			fixtures.reset();
		});

		it("has a visible dismiss button", () => {
			fixtures.standardHtml();
			oEmailOnlySignup();
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			proclaim.notOk(dismiss.classList.contains(visuallyHiddenClass));
		});
		it("updates the ARIA attributes", () => {
			fixtures.collapsibleHtml();
			oEmailOnlySignup();
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			proclaim.strictEqual(dismiss.getAttribute('aria-expanded'), 'true');
		});
	});
	
	describe("Dismiss behaviour", () => {
		afterEach(() => {
			fixtures.reset();
		});

		it("hides the full component", () => {
			fixtures.standardHtml();
			oEmailOnlySignup();
			const componentEl = document.querySelector('[data-o-component~="o-email-only-signup"]');
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			dismiss.click();

			proclaim.strictEqual(componentEl.style.display, 'none');
		});

		it("collapses down to the discreet version when the collapsible option is set", () => {
			fixtures.collapsibleHtml();
			oEmailOnlySignup('body', {collapsible: true});
			
			const contentEl = document.querySelector('[data-o-email-only-signup-content]');
			const discreetEl = document.querySelector('[data-o-email-only-signup-discreet-content]');
			const collapse = document.querySelector('[data-o-email-only-signup-close]');
			
			collapse.click();
			
			proclaim.ok(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'true');
			proclaim.notOk(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'false');
		});
		
		it("it is possible to expand to full content version after being collapsed", () => {
			fixtures.collapsibleHtml();
			oEmailOnlySignup('body', {collapsible: true});
			
			const contentEl = document.querySelector('[data-o-email-only-signup-content]');
			const discreetEl = document.querySelector('[data-o-email-only-signup-discreet-content]');
			const collapse = document.querySelector('[data-o-email-only-signup-close]');
			const expand = document.querySelector('[data-o-email-only-signup-open]');
			
			collapse.click();
			expand.click();
			
			proclaim.notOk(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'false');
			proclaim.ok(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'true');
		});
	});
		
	describe("Submiting the form", () => {
		beforeEach(() => {
			sinon.stub(window, 'fetch');
			const res = new window.Response('SUBSCRIPTION_SUCCESSFUL', {
				status: 200,
				headers: {
					'Content-type': 'application/json'
    			}
			});

			window.fetch.returns(Promise.resolve(res));
		});

		afterEach(() => {
			window.fetch.restore();
			fixtures.reset();
		});

		it("makes a post request to the sign up api", () => {
			fixtures.standardHtml();
			oEmailOnlySignup();
			const form = document.querySelector('[data-o-email-only-signup-form]');
			const emailInput = form.querySelector('#email');
			const submit = form.querySelector('.o-email-only-signup__submit');
			const errorMessage = form.querySelector('[data-o-email-only-signup-email-error]');
			
			emailInput.value = 'person@ft.com'
			submit.click();
			
			proclaim.strictEqual(window.fetch.getCall(0).args[0], '/signup/api/light-signup');
			proclaim.strictEqual(window.fetch.getCall(0).args[1].body, 'email=person%40ft.com');
			proclaim.strictEqual(window.fetch.getCall(0).args[1].method, 'POST');
		});
		describe("Form validation", () => {
			it("does not make a post request when an invalid email address is entered", () => {
				fixtures.standardHtml();
				oEmailOnlySignup();
				const form = document.querySelector('[data-o-email-only-signup-form]');
				const emailInput = form.querySelector('#email');
				const submit = form.querySelector('.o-email-only-signup__submit');
				const errorMessage = form.querySelector('[data-o-email-only-signup-email-error]');
				
				emailInput.value = 'person£ft.com'
				submit.click();
				
				proclaim.notOk(window.fetch.called);
			});

			it("shows an error message when an invalid email address is entered", () => {
				fixtures.standardHtml();
				oEmailOnlySignup();
				const form = document.querySelector('[data-o-email-only-signup-form]');
				const emailInput = form.querySelector('#email');
				const submit = form.querySelector('.o-email-only-signup__submit');
				const errorMessage = form.querySelector('[data-o-email-only-signup-email-error]');
				
				emailInput.value = 'person£ft.com';
				submit.click();
				
				proclaim.notOk(errorMessage.classList.contains(visuallyHiddenClass));
			});
			
			it("the error message is dismissed when the input is clicked on", () => {
				fixtures.standardHtml();
				oEmailOnlySignup();
				const form = document.querySelector('[data-o-email-only-signup-form]');
				const emailInput = form.querySelector('#email');
				const submit = form.querySelector('.o-email-only-signup__submit');
				const errorMessage = form.querySelector('[data-o-email-only-signup-email-error]');
				
				emailInput.value = 'person£ft.com';
				submit.click();
				emailInput.click();			
		
				proclaim.ok(errorMessage.classList.contains(visuallyHiddenClass));
			});
		});
	});
	describe("Positioning", () => {
		beforeEach(() => {
			fixtures.standardHtml();
		});

		afterEach(() => {
			fixtures.reset();		  
		});
		
		it("will position itself as a child of a [data-o-email-only-signup-position-mvt] element if present", () => {
			const mvtElement = document.createElement('div');
			mvtElement.setAttribute('data-o-email-only-signup-position-mvt', 'true');
			document.body.append(mvtElement);
			
			oEmailOnlySignup();
			const component = document.querySelector('[data-o-component~="o-email-only-signup"]');
			proclaim.strictEqual(component.parentElement.getAttribute('data-o-email-only-signup-position-mvt'), 'true');
		});
	});
});
