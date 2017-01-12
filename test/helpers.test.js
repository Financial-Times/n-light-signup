import proclaim from 'proclaim';
import helpers from '../src/helpers';
import * as fixtures from './helpers/fixtures';

describe('Helpers', () => {
	describe('isValidEmail', () => {
		it('returns true for a valid email', () => {
			const isValidEmail = helpers.isValidEmail('person@ft.com');
			proclaim.ok(isValidEmail);
		});
		
		it('returns false for a invalid email', () => {
			const isValidEmail = helpers.isValidEmail('person');
			proclaim.notOk(isValidEmail);
		});
	});
	
	describe('serializeFormInputs', () => {
		it('returns a string constructed from the form inputs', () => {
			fixtures.markup();
			const form = document.querySelector('[data-o-email-only-signup-form]');
			form.querySelector('#email').value = 'person@ft.com';	

			const serializedForm = helpers.serializeFormInputs(form);
			
			proclaim.strictEqual(serializedForm, 'topics=default&email=person%40ft.com');
			fixtures.reset();
		});
	});
	
	describe('getResponseMessage', () => {
		it('returns the relevant response message', () => {
			
			const successMessage = helpers.getResponseMessage('SUBSCRIPTION_SUCCESSFUL');
			const invalidMessage = helpers.getResponseMessage('INVALID_REQUEST');
			
			proclaim.strictEqual(successMessage, 'Thanks – look out for your first briefing soon.');
			proclaim.strictEqual(invalidMessage, 'Sorry, something went wrong. Please try again.');
		});
	});
	
	describe('optionsFromMarkup', () => {
		it('returns an object containing options set via data attributes', () => {
			const defaultOptions = {foo: null};
			const element = document.createElement('div');
			element.setAttribute('data-o-email-only-signup-foo', 'bar');	
			const options = helpers.optionsFromMarkUp(element, defaultOptions);
			
			proclaim.strictEqual(options.foo, 'bar');	
		});
	});

	describe('findFocusablesInEl', () => {
		it('returns an array containing focusable elements that are within an element', () => {
			const parentElement = document.createElement('div');
			const focusableElement = document.createElement('input');
			const nonFocusableElement = document.createElement('div');

			parentElement.appendChild(focusableElement);
			parentElement.appendChild(nonFocusableElement);

			const focusableElements = helpers.findFocusablesInEl(parentElement);
			
			proclaim.include(focusableElements, focusableElement);	
			proclaim.doesNotInclude(focusableElements, nonFocusableElement);	
		});
		
		it('returns an iempty array if no focusable elements that are within an element', () => {
			const parentElement = document.createElement('div');
			const nonFocusableElement = document.createElement('div');

			parentElement.appendChild(nonFocusableElement);

			const focusableElements = helpers.findFocusablesInEl(parentElement);
			
			proclaim.lengthEquals(focusableElements, 0);	
		});
	});
});
