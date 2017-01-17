import defaultsDeep from 'lodash/object/defaultsDeep';
import helpers from './helpers';

let presets;
let options;

function oEmailSignUp (element, opts) {
	oEmailSignUp.defaultOptions(element, opts);
	oEmailSignUp.reposition(element);
	oEmailSignUp.enhanceExperience();
	oEmailSignUp.makeVisible();
	oEmailSignUp.listeners();
}

oEmailSignUp.reposition = (element) => {
	const positionMvt = document.querySelector('[data-o-email-only-signup-position-mvt]');
	if (positionMvt) {
		positionMvt.appendChild(element);
	}
};

oEmailSignUp.makeVisible = () => {
	presets.self.classList.remove('o-email-only-signup__visually-hidden');
	presets.self.setAttribute('aria-hidden', false);
};

oEmailSignUp.defaultOptions = (element, opts = {}) => {
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
		selectInactiveClass: 'o-email-only-signup__select--inactive'
	};

	const defaultOptions = {
		signupUrl: '/signup/api/light-signup',
		collapsible: (presets.openButton && presets.content && presets.discreetContent)
	};

	options = defaultsDeep(opts, helpers.optionsFromMarkUp(element, defaultOptions), defaultOptions);

	if (options.collapsible) {
		presets.contentFocusables = helpers.findFocusablesInEl(presets.content);
		presets.discreetContentFocusables = helpers.findFocusablesInEl(presets.discreetContent);
	}
};

oEmailSignUp.enhanceExperience = () => {
	if (presets.closeButton) {
		presets.closeButton.classList.remove(presets.visuallyHiddenClass);
	}
	oEmailSignUp.updateAria();
};

oEmailSignUp.updateAria = () => {
	if (presets.ariaControls) {
		presets.ariaControls.forEach(el => {
			const target = presets.self.querySelector('#' + el.getAttribute('aria-controls'));
			if (target) {
				const targetIsHidden = (target && target.getAttribute('aria-hidden') === 'true');
				el.setAttribute('aria-expanded', !targetIsHidden);
			}
		});
	}
};

oEmailSignUp.listeners = () => {
	if (presets.closeButton) {
		presets.closeButton.addEventListener('click', () => {
			if (options.collapsible) {
				oEmailSignUp.toggleCollapsibleContent();
			} else {
				oEmailSignUp.close();
			}
		});
	}

	if (options.collapsible) {
		presets.openButton.addEventListener('click', () => {
			oEmailSignUp.toggleCollapsibleContent();
		});
	}

	presets.form.addEventListener('submit', (event) => {
		event.preventDefault();
		const formData = helpers.serializeFormInputs(event.target);
		oEmailSignUp.apiRequest(formData);
	});

	presets.emailField.addEventListener('focus', () => {
		if (presets.emailField.classList.contains(presets.formErrorClass)) {
			oEmailSignUp.toggleValidation();
		}
	});

	if (presets.topicSelect) {
		presets.topicSelect.addEventListener('focus', oEmailSignUp.toggleSelectPlaceholder);
		presets.topicSelect.addEventListener('blur', oEmailSignUp.toggleSelectPlaceholder);
	}
};

oEmailSignUp.toggleCollapsibleContent = () => {

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

	oEmailSignUp.updateAria();
};

oEmailSignUp.close = () => {
	presets.self.style.display = 'none';
	presets.self.setAttribute('aria-hidden', true);
	oEmailSignUp.updateAria();
};

oEmailSignUp.apiRequest = (formData) => {
	if (helpers.isValidEmail(presets.emailField.value)) {
		const pageLocation = window.location.href;
		const opts = {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			credentials: 'include',
			body: formData
		};
		fetch(options.signupUrl, opts)
			.then(response => response.text())
			.then(response => {
				presets.displaySection.innerHTML = helpers.getResponseMessage(response, pageLocation);
			})
			.catch(err => console.log(err));
	} else {
		oEmailSignUp.toggleValidation();
	}
};

oEmailSignUp.toggleValidation = () => {
	presets.emailField.classList.toggle(presets.formErrorClass);
	presets.invalidEmailMessage.classList.toggle(presets.visuallyHiddenClass);
};

oEmailSignUp.toggleSelectPlaceholder = (event) => {
	let isPlaceholderSelected = (event.target.options[event.target.selectedIndex].getAttribute('placeholder') !== null);

	if (event.type === 'focus') {
		presets.topicSelect.classList.remove(presets.selectInactiveClass);
	}
	if (event.type === 'blur' && isPlaceholderSelected) {
		presets.topicSelect.classList.add(presets.selectInactiveClass);
	}
};

module.exports = oEmailSignUp;
