import proclaim from 'proclaim';
import oEmailSignUp from '../src/email-only-signup';
import helpers from '../src/helpers';
import * as fixtures from './helpers/fixtures';

const visuallyHiddenClass = 'o-email-only-signup__visually-hidden';

describe('oEmailSignUp', () => {
	beforeEach(() => {
		fixtures.markup();
	});

	afterEach(() => {
		fixtures.reset();
	});
	
	describe('Inital setup', () => {
		beforeEach(() => {
			sinon.stub(oEmailSignUp, 'reposition');
			sinon.stub(oEmailSignUp, 'defaultOptions');
			sinon.stub(oEmailSignUp, 'enhanceExperience')
			sinon.stub(oEmailSignUp, 'makeVisible')
			sinon.stub(oEmailSignUp, 'listeners')
		});
		
		afterEach(() => {
			oEmailSignUp.reposition.restore();
			oEmailSignUp.defaultOptions.restore();
			oEmailSignUp.enhanceExperience.restore();
			oEmailSignUp.makeVisible.restore();
			oEmailSignUp.listeners.restore();
		});

		it('is defined', () => {
			proclaim.isFunction(oEmailSignUp);
		});
		
		it('calls oEmailSignUp.defaultOptions', () => {
			oEmailSignUp();
			proclaim.ok(oEmailSignUp.reposition.calledOnce);
		});

		it('calls oEmailSignUp.defaultOptions', () => {
			oEmailSignUp();
			proclaim.ok(oEmailSignUp.defaultOptions.calledOnce);
		});
		
		it('calls oEmailSignUp.enhanceExperience', () => {
			oEmailSignUp();
			proclaim.ok(oEmailSignUp.enhanceExperience.calledOnce);
		});
		
		it('calls oEmailSignUp.makeVisible', () => {
			oEmailSignUp();
			proclaim.ok(oEmailSignUp.makeVisible.calledOnce);
		});
		
		it('calls oEmailSignUp.listeners', () => {

			oEmailSignUp();
			proclaim.ok(oEmailSignUp.listeners.calledOnce);
		});
	});
	describe('oEmailSignUp.makeVisible', () => {
		it('makes the component visible', () => {
			const component = document.querySelector('.o-email-only-signup');

			oEmailSignUp.defaultOptions(component);
			oEmailSignUp.makeVisible();

			proclaim.notOk(component.classList.contains(visuallyHiddenClass))
		});
	});

	describe('oEmailSignUp.enhanceExperience', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('makes the dismiss button visible', () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');

			oEmailSignUp.enhanceExperience();
			proclaim.notOk(dismiss.classList.contains(visuallyHiddenClass));
		});
		
		it('calls oEmailSignUp.updateAria', () => {
			const spy = sinon.spy(oEmailSignUp, 'enhanceExperience')
			oEmailSignUp.enhanceExperience();

			proclaim.ok(spy.calledOnce);
			spy.restore();
		});
	});

	describe('oEmailSignUp.updateAria', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('updates the ARIA attributes', () => {
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');

			oEmailSignUp.updateAria();
			proclaim.strictEqual(dismiss.getAttribute('aria-expanded'), 'true');
		});
	});
	
	describe('oEmailSignUp.listeners', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('calls oEmailSignUp.close when the close button is clicked', () => {
			fixtures.markup(true);
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
			const event = new Event('click');
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			const spy = sinon.spy(oEmailSignUp, 'close');
			
			oEmailSignUp.listeners();
			dismiss.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it('calls oEmailSignUp.toggleCollapsibleContent when the close button is clicked and collapsible option is set', () => {
			const event = new Event('click');
			const dismiss = document.querySelector('[data-o-email-only-signup-close]');
			const spy = sinon.spy(oEmailSignUp, 'toggleCollapsibleContent');

			oEmailSignUp.listeners();
			dismiss.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it('calls oEmailSignUp.toggleCollapsibleContent when the open button is clicked', () => {
			const event = new Event('click');
			const open = document.querySelector('[data-o-email-only-signup-open]');
			const spy = sinon.spy(oEmailSignUp, 'toggleCollapsibleContent');

			oEmailSignUp.listeners();
			open.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it('calls oEmailSignUp.apiRequest when the form is submitted', () => {
			const event = new Event('submit');
			const form = document.querySelector('[data-o-email-only-signup-form]');
			const spy = sinon.spy(oEmailSignUp, 'apiRequest');

			oEmailSignUp.listeners();
			form.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it('calls oEmailSignUp.toggleValidation when the email field has focus and is displaying an error', () => {
			oEmailSignUp.listeners();
			oEmailSignUp.toggleValidation(); // Force error message to be displayed

			const event = new Event('focus');
			const input = document.querySelector('input[name=email]');
			const spy = sinon.spy(oEmailSignUp, 'toggleValidation');

			input.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});

		it('calls oEmailSignUp.toggleSelectPlaceholder when the select field has focus', () => {
			const event = new Event('focus');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(oEmailSignUp, 'toggleSelectPlaceholder');

			oEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});
		
		it('calls oEmailSignUp.toggleSelectPlaceholder when the select field has blur', () => {
			const event = new Event('blur');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(oEmailSignUp, 'toggleSelectPlaceholder');

			oEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);

			spy.restore();
		});
	});

	describe('oEmailSignUp.toggleCollapsibleContent', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component, {collapsible: true});
		});

		it('toggles the content between collapsed and expanded', () => {
			const contentEl = document.querySelector('[data-o-email-only-signup-content]');
			const discreetEl = document.querySelector('[data-o-email-only-signup-discreet-content]');

			oEmailSignUp.toggleCollapsibleContent();

			proclaim.ok(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'true');
			proclaim.notOk(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'false');

			oEmailSignUp.toggleCollapsibleContent();

			proclaim.notOk(contentEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(contentEl.getAttribute('aria-hidden'), 'false');
			proclaim.ok(discreetEl.classList.contains(visuallyHiddenClass));
			proclaim.strictEqual(discreetEl.getAttribute('aria-hidden'), 'true');
		});
	});

	describe('oEmailSignUp.close', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('hides the full component', () => {
			const component = document.querySelector('.o-email-only-signup');

			oEmailSignUp.close();
			proclaim.strictEqual(component.style.display, 'none');
		});
	});

	describe('oEmailSignUp.apiRequest', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			const res = new window.Response('SUBSCRIPTION_SUCCESSFUL', {
				status: 200,
				headers: {
					'Content-type': 'application/json'
    			}
			});
			const fetchMock = sinon.stub(window, 'fetch');
			const helperMock = sinon.stub(helpers, 'isValidEmail');
			
			oEmailSignUp.defaultOptions(component);
			window.fetch.returns(Promise.resolve(res));

		});
		afterEach(() => {
			helpers.isValidEmail.restore();
			window.fetch.restore();
		});

		it('makes a post request to the sign up api', () => {
			helpers.isValidEmail.returns(true);
			oEmailSignUp.apiRequest()
			proclaim.ok(window.fetch.calledOnce);
			proclaim.strictEqual(window.fetch.getCall(0).args[0], '/signup/api/light-signup');
			proclaim.strictEqual(window.fetch.getCall(0).args[1].method, 'POST');
		});

		it('does not make a post request when an invalid email address is entered', () => {
			helpers.isValidEmail.returns(false);
			oEmailSignUp.apiRequest()
			proclaim.notOk(window.fetch.called);
		});
	});
	describe('oEmailSignUp.toggleValidation', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('toggles the error message between hidden and visible', () => {
			const errorMessage = document.querySelector('[data-o-email-only-signup-email-error]');
			oEmailSignUp.toggleValidation()

			proclaim.notOk(errorMessage.classList.contains(visuallyHiddenClass));

			oEmailSignUp.toggleValidation()

			proclaim.ok(errorMessage.classList.contains(visuallyHiddenClass));
		});
	});

	describe('oEmailSignUp.reposition', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('will position itself as a child of a [data-o-email-only-signup-position-mvt] element if present', () => {
			const component = document.querySelector('.o-email-only-signup');
			const mvtElement = document.createElement('div');
			mvtElement.setAttribute('data-o-email-only-signup-position-mvt', 'true');
			document.body.append(mvtElement);

			oEmailSignUp.reposition(component);
			proclaim.strictEqual(component.parentElement.getAttribute('data-o-email-only-signup-position-mvt'), 'true');
		});
	});

	
	describe('oEmailSignUp.toggleSelectPlaceholder', () => {
		beforeEach(() => {
			const component = document.querySelector('.o-email-only-signup');
			oEmailSignUp.defaultOptions(component);
		});

		it('removes the inactive class when the select has focus', () => {
			const event = new Event('focus');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(oEmailSignUp, 'toggleSelectPlaceholder');

			oEmailSignUp.listeners();
			select.dispatchEvent(event);

			proclaim.ok(spy.calledOnce);
			proclaim.notOk(select.classList.contains('o-email-only-signup__select--inactive'));

			spy.restore();
		});
		
		it('adds the inactive class when the select has blur and the placeholder option is selected', () => {
			const event = new Event('blur');
			const select = document.querySelector('[data-o-email-only-signup-dropdown]');
			const spy = sinon.spy(oEmailSignUp, 'toggleSelectPlaceholder');

			select.selectedIndex = select.querySelector('[placeholder]').index;
			
			oEmailSignUp.listeners();
			select.dispatchEvent(event);
			
			proclaim.ok(spy.calledOnce);
			proclaim.ok(select.classList.contains('o-email-only-signup__select--inactive'));

			spy.restore();
		});
	});
});
