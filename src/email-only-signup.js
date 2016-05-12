import defaultsDeep from 'lodash/object/defaultsDeep';
import kebabCase from 'lodash/string/kebabCase';

const defaultOptions = {
	signupUrl: '/signup/api/light-signup'
};

export default {

	init(el, options = {}) {
		defaultsDeep(options, optionsFromData(el), defaultOptions);

		const closeButton = el.querySelector('[data-o-email-only-signup-close]');
		const lightSignupForm = el.querySelector('[data-o-email-only-signup-form]');
		const displaySection = el.querySelector('[data-o-email-only-signup-completion-message]');
		const emailField = el.querySelector('input[name=email]');
		const invalidEmailMessage = el.querySelector('[data-o-email-only-signup-email-error]');

		// Keep marketing copy somewhere

		const pageLocation = window.location.href;
		const mvtPosition = document.querySelector('[data-o-email-only-signup-mvt-position]');

		const responseMsg = {
			'SUBSCRIPTION_SUCCESSFUL': 'Thanks – look out for your first briefing soon.',
			'INVALID_REQUEST': 'Sorry, something went wrong. Please try again.',
			'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043">sign up to a 4 week Trial</a>?',
			'USER_ARCHIVED': 'It looks like you’ve signed up to the daily top stories summary email before. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043">sign up to a 4 week Trial</a>?',
			'USER_NOT_ANONYMOUS': `It looks like you already have an account with us. <a href="/login?location=${pageLocation}" style="text-decoration:none;color:#27757B;">Sign in</a>.`
		};

		// postion the form and ensure it is visible

		if (mvtPosition) {
			mvtPosition.appendChild(el);
		}
		toggleVisibility(true);

		// Handle user interaction

		lightSignupForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const email = emailField.value;

			if (isValidEmail(email)) {
				const opts = {
					method: 'POST',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					credentials: 'include',
					body: `email=${formatEmail(email)}`
				};

				fetch(options.signupUrl, opts)
					.then(response => response.text())
					.then(response => {
						displaySection.innerHTML = responseMsg[response] ? responseMsg[response] : responseMsg["INVALID_REQUEST"];
					})
					.catch(err => console.log(err));

			} else {
				toggleValidationErrors();
			}
		});

		closeButton.addEventListener('click', () => {
			toggleVisibility(false);
		});

		emailField.addEventListener('click', () => {
			if (lightSignupForm.classList.contains('o-forms--error')) {
				toggleValidationErrors();
			}
		});

		// Validation helpers

		function isValidEmail(email) {
			return /(.+)@(.+)/.test(email);
		}

		function toggleValidationErrors() {
			lightSignupForm.classList.toggle('o-forms--error');
			invalidEmailMessage.classList.toggle('o-email-only-signup__visually-hidden');
		}

		function formatEmail(email) {
			return encodeURIComponent(email.trim()).replace('%20', '+');
		}

		function optionsFromData(el) {
			const options = {};
			Object.keys(defaultOptions).forEach(key => {
				// convert optionKeyLikeThis to data-o-email-only-signup-option-key-like-this
				const attr = 'data-o-email-only-signup-' + kebabCase(key);
				if(el.hasAttribute(attr)) {
					options[key] = el.getAttribute(attr);
				}
			});

			return options;
		}

		// @param {Boolean} show - true: display the component. false: hide it
		function toggleVisibility(show) {
			el.classList.toggle('o-email-only-signup__visually-hidden', !show);
			el.setAttribute('aria-hidden', !show);
		}

	}
};
