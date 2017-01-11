import defaultsDeep from 'lodash/object/defaultsDeep';
import helpers from './helpers'

let presets;
let options;

function OEmailSignUp (element = document.body, opts = {}) {
	const utmTermParam = /[?&]utm_term(=([^&#]*)|&|#|$)/i.exec(window.location.href);
	const positionMvt = document.querySelector('[data-o-email-only-signup-position-mvt]');

	let userIsFromLightSignupEmail;

	if (utmTermParam) {
		userIsFromLightSignupEmail = (utmTermParam[2] === 'lightsignup');
	}

	if(!(element instanceof HTMLElement)) {
		element = document.querySelector(element);
	}

	if (!element.matches('[data-o-component~="o-email-only-signup"]')) {
		element = element.querySelector('[data-o-component~="o-email-only-signup"]');
	}

	if (!userIsFromLightSignupEmail && element) {

		// Article Position MVT: move the component and ensure visible
		if (positionMvt) {
			positionMvt.appendChild(element);
		}
		element.classList.remove('o-email-only-signup__visually-hidden');
		element.setAttribute('aria-hidden', false);

		OEmailSignUp.defaultOptions(element, opts)	
		OEmailSignUp.enhanceExperience()
		OEmailSignUp.listeners()
	}
}

OEmailSignUp.defaultOptions = (element, opts) => {
	presets = {
		self: element,
		closeButton: element.querySelector('[data-o-email-only-signup-close]'),
		content: element.querySelector('[data-o-email-only-signup-content]') || null,
		contentFocusables: null,
		discreetContent: element.querySelector('[data-o-email-only-signup-discreet-content]') || null,
		discreetContentFocusables: null,
		displaySection: element.querySelector('[data-o-email-only-signup-completion-message]'),
		emailField: element.querySelector('input[name=email]'),
		form: element.querySelector('[data-o-email-only-signup-form]'),
		invalidEmailMessage: element.querySelector('[data-o-email-only-signup-email-error]'),
		openButton: element.querySelector('[data-o-email-only-signup-open]') || null,
		topicSelect: element.querySelector('[data-o-email-only-signup-dropdown]') || null,
		ariaControls: helpers.toArray(element.querySelectorAll('[aria-controls]')) || null,
		visuallyHiddenClass: 'o-email-only-signup__visually-hidden',
		formErrorClass: 'o-forms--error',
		selecteInactiveClass: 'o-email-only-signup__select--inactive'
	};

	const defaultOptions = {
		signupUrl: '/signup/api/light-signup',
		collapsible: (presets.openButton && presets.content && presets.discreetContent)
	};

	options = defaultsDeep(opts, helpers.optionsFromMarkUp(element, defaultOptions), defaultOptions);
}

OEmailSignUp.enhanceExperience = () => {
	if (presets.closeButton) {
		presets.closeButton.classList.remove(presets.visuallyHiddenClass);
	}
	OEmailSignUp.updateAria();
	
	if (options.collapsible) {
		presets.contentFocusables = helpers.findFocusablesInEl(presets.content);
		presets.discreetContentFocusables = helpers.findFocusablesInEl(presets.discreetContent);
	}
}

OEmailSignUp.updateAria = () => {
	if (presets.ariaControls) {
		presets.ariaControls.forEach(el => {
			const target = presets.self.querySelector('#' + el.getAttribute('aria-controls'));
			if (target) {
				const targetIsHidden = (target && target.getAttribute('aria-hidden') === 'true');
				el.setAttribute('aria-expanded', !targetIsHidden);
			}
		});
	}
}

OEmailSignUp.listeners = () => {
	if (presets.closeButton) {
		presets.closeButton.addEventListener('click', () => {
			if (options.collapsible) {
				OEmailSignUp.toggleCollapsedContent();
			} else {
				OEmailSignUp.close();
			}	
		})		
	}
	
	if (options.collapsible) {
		presets.openButton.addEventListener('click', () => {
			OEmailSignUp.toggleCollapsedContent();	
		});
	}
	
	presets.form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (helpers.isValidEmail(presets.emailField.value)) {
			OEmailSignUp.apiRequest(event);
		} else {
			OEmailSignUp.toggleValidation();		
		}
	});
	
	presets.emailField.addEventListener('click', () => {
		if (presets.emailField.classList.contains(presets.formErrorClass)) {
			OEmailSignUp.toggleValidation();
		}
	});

	if (presets.topicSelect) {
		presets.topicSelect.addEventListener('focus', OEmailSignUp.toggleSelectPlaceholder);
		presets.topicSelect.addEventListener('blur', OEmailSignUp.toggleSelectPlaceholder);
	}
}

OEmailSignUp.toggleCollapsedContent = () => {
	
	const toggledState = presets.content.getAttribute('aria-hidden') === 'true' ? false : true;

	presets.content.setAttribute('aria-hidden', toggledState);
	presets.content.classList.toggle(presets.visuallyHiddenClass);
	presets.contentFocusables.forEach(el => {
		helpers.toggleTabIndex(el, !toggledState);
	});

	presets.discreetContent.setAttribute('aria-hidden', !toggledState);
	presets.discreetContent.classList.toggle(presets.visuallyHiddenClass);
	presets.discreetContentFocusables.forEach(el => {
		helpers.toggleTabIndex(el, toggledState);
	});

	OEmailSignUp.updateAria();
}

OEmailSignUp.close = () => {
	presets.self.style.display = 'none';
	presets.self.setAttribute('aria-hidden', true);
	OEmailSignUp.updateAria();
}

OEmailSignUp.apiRequest = (event) => {
	const pageLocation = window.location.href;
	const opts = {
		method: 'POST',
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		credentials: 'include',
		body: helpers.serializeFormInputs(event.target)
	};
	fetch(options.signupUrl, opts)
		.then(response => response.text())
		.then(response => {
			presets.displaySection.innerHTM = helpers.getResponseMessage(response, pageLocation);
		})
		.catch(err => console.log(err));
}

OEmailSignUp.toggleValidation = () => {
	presets.emailField.classList.toggle(presets.formErrorClass);
	presets.invalidEmailMessage.classList.toggle(presets.visuallyHiddenClass)
}

OEmailSignUp.toggleSelectPlaceholder = (event) => {
	let isPlaceholderSelected = (event.target.options[event.target.selectedIndex].getAttribute('placeholder') !== null);

	if (event.type === 'focus') {
		presets.topicSelect.classList.remove(presets.selectInactiveClass);
	}

	if (event.type === 'blur' && isPlaceholderSelected) {
		presets.topicSelect.classList.add(presets.selectInactiveClass);
	}
}
	const SELECT_INACTIVE_CLASS = 'o-email-only-signup__select--inactive';

module.exports = OEmailSignUp;
