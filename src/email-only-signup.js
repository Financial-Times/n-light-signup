import defaultsDeep from 'lodash/object/defaultsDeep';
import kebabCase from 'lodash/string/kebabCase';

const defaultOptions = {
	signupUrl: '/signup/api/light-signup'
};

export function getResponseMsg(response, pageLocation) {
	// Keep marketing copy somewhere
	const responseMsg = {
		'SUBSCRIPTION_SUCCESSFUL': 'Thanks – look out for your first briefing soon.',
		'INVALID_REQUEST': 'Sorry, something went wrong. Please try again.',
		'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043" data-trackable="trial-existing">sign up to a 4 week Trial</a>?',
		'USER_ARCHIVED': 'It looks like you’ve signed up to the daily top stories summary email before. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043" data-trackable="trial-archived">sign up to a 4 week Trial</a>?',
		'USER_NOT_ANONYMOUS': `It looks like you already have an account with us. <a href="/login?location=${pageLocation}" style="text-decoration:none;color:#27757B;" data-trackable="sign-in">Sign in</a>.`
	};

	return responseMsg[response] ? responseMsg[response] : responseMsg.INVALID_REQUEST;
}

export default {
	init(el, options = {}) {
		defaultsDeep(options, optionsFromData(el), defaultOptions);

		const component = {
			closeButton: el.querySelector('[data-o-email-only-signup-close]'),
			content: el.querySelector('[data-o-email-only-signup-content]') || null,
			contentFocusables: null,
			discreetContent: el.querySelector('[data-o-email-only-signup-discreet-content]') || null,
			discreetContentFocusables: null,
			displaySection: el.querySelector('[data-o-email-only-signup-completion-message]'),
			emailField: el.querySelector('input[name=email]'),
			form: el.querySelector('[data-o-email-only-signup-form]'),
			invalidEmailMessage: el.querySelector('[data-o-email-only-signup-email-error]'),
			openButton: el.querySelector('[data-o-email-only-signup-open]') || null,
			topicSelect: el.querySelector('[data-o-email-only-signup-dropdown]') || null,
			ariaControls: el.querySelectorAll('[aria-controls]') || null
		};

		const VISUALLY_HIDDEN_CLASS = 'o-email-only-signup__visually-hidden';
		const FORM_ERROR_CLASS = 'o-forms--error';
		const SELECT_INACTIVE_CLASS = 'o-email-only-signup__select--inactive';

		const pageLocation = window.location.href;
		const discreetMode = (component.openButton && component.content && component.discreetContent);

		enhanceForm();

		// Handle user interaction
		component.form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (isValidEmail(component.emailField.value)) {
				const opts = {
					method: 'POST',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					credentials: 'include',
					body: serializeFormInputs(e.target)
				};

				fetch(options.signupUrl, opts)
					.then(response => response.text())
					.then(response => {
				component.displaySection.innerHTML = getResponseMsg(response, pageLocation);
					})
					.catch(err => console.log(err));

			} else {
				toggleEmailValidationErrors();
			}
		});

		component.emailField.addEventListener('click', () => {
			if (component.emailField.classList.contains(FORM_ERROR_CLASS)) {
				toggleEmailValidationErrors();
			}
		});

		if (component.topicSelect) {
			component.topicSelect.addEventListener('focus', toggleSelectInactive);
			component.topicSelect.addEventListener('blur', toggleSelectInactive);
		}

		component.closeButton.addEventListener('click', () => {
			if (discreetMode) {
				showDiscreetState(true);
			} else {
				el.style.display = 'none';
				el.setAttribute('aria-hidden', true);
				updateAriaControls();
			}
		});

		if (discreetMode) {
			component.openButton.addEventListener('click', () => {
				showDiscreetState(false);
			});
		}

		// transfrom core to enhanced experience
		function enhanceForm () {
			removeClass(VISUALLY_HIDDEN_CLASS, component.closeButton);
			updateAriaControls();
			if (discreetMode) {
				component.contentFocusables = findFoucsablesInEl(component.content);
				component.discreetContentFocusables = findFoucsablesInEl(component.discreetContent);
			}
		}

		function updateAriaControls () {
			if (component.ariaControls) {
				for (let i=0; i<component.ariaControls.length; i++) {
					let self = component.ariaControls[i];
					let targetId = self.getAttribute('aria-controls');
					let target = el.querySelector('#' + targetId);
					let targetIsHidden = (target.getAttribute('aria-hidden') === 'true');
					self.setAttribute('aria-expanded', !targetIsHidden);
				}
			}
		}

		function findFoucsablesInEl (element) {
			let arr = [];
			const tabEls = [
				'input',
				'button',
				'a'
			];
			tabEls.forEach(function (selector) {
				let nodelist = element.querySelectorAll(selector);
				// let arr = [];
				// for (var i = nodelist.length; i--; arr.unshift(nodelist[i]));
				// tabs = tabs.concat(arr);
				arr = arr.concat(Array.prototype.slice.call(nodelist));
			});
			return arr;
		}

		// Validation helpers

		function isValidEmail(email) {
			return /(.+)@(.+)/.test(email);
		}

		function toggleEmailValidationErrors() {
			toggleClass(FORM_ERROR_CLASS, component.emailField);
			toggleClass(VISUALLY_HIDDEN_CLASS, component.invalidEmailMessage);
		}

		function showDiscreetState(showCollapsed) {

			component.content.setAttribute('aria-hidden', showCollapsed);
			toggleClass(VISUALLY_HIDDEN_CLASS, component.content, showCollapsed);
			component.contentFocusables.forEach(function (el) {
				toggleTabIndex(el, showCollapsed);
			});
			// make all focus els -1 inside content


			component.discreetContent.setAttribute('aria-hidden', !showCollapsed);
			toggleClass(VISUALLY_HIDDEN_CLASS, component.discreetContent, !showCollapsed);
			component.contentFocusables.forEach(function (el) {
				toggleTabIndex(el, !showCollapsed);
			});

			updateAriaControls();
		}

		function encodeComponent(string) {
			return encodeURIComponent(string.trim()).replace('%20', '+');
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

		function serializeFormInputs(form) {
			const inputs = form.elements;
			let str = [];

			for (let i=0; i<inputs.length; i++) {
				let field = form.elements[i];
				if (field.name && field.type !== 'submit' && field.type !== 'button') {
					str.push(`${encodeComponent(field.name)}=${encodeComponent(field.value)}`);
				}
			}

			return str.join("&");
		}

		function toggleSelectInactive (event) {
			let isPlaceholderSelected = (event.target.options[event.target.selectedIndex].getAttribute('placeholder') !== null);

			if (event.type === 'focus') {
				removeClass(SELECT_INACTIVE_CLASS, component.topicSelect);
			}

			if (event.type === 'blur' && isPlaceholderSelected) {
				addClass(SELECT_INACTIVE_CLASS, component.topicSelect);
			}
		}

		/* helper functions */
		function addClass (cssClass, el) {
			el.classList.add(cssClass);
		}

		function removeClass (cssClass, el) {
			el.classList.remove(cssClass);
		}

		function toggleClass (cssClass, el, force) {
			if (force === false) {
				removeClass(cssClass, el);
			} else if (force || el.classList.contains(cssClass) === false) {
				addClass(cssClass, el);
			} else {
				removeClass(cssClass, el);
			}
		}

		function toggleTabIndex (el, boolean) {
			let index = boolean ? 0 : -1;
			el.setAttribute('tabindex', index);
		}

	}
};
