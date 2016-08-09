import defaultsDeep from 'lodash/object/defaultsDeep';
import kebabCase from 'lodash/string/kebabCase';

/*
 * convert a response 'code' to html message
 * @param {String} response
 * @param {String} pageLocation
 * @returns {HTMLString}
 */
export function getResponseMsg (response, pageLocation) {
	const responseMsg = {
		'SUBSCRIPTION_SUCCESSFUL': 'Thanks – look out for your first briefing soon.',
		'INVALID_REQUEST': 'Sorry, something went wrong. Please try again.',
		'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043" data-trackable="trial-existing">sign up to a 4 week Trial</a>?',
		'USER_ARCHIVED': 'It looks like you’ve signed up to the daily top stories summary email before. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043" data-trackable="trial-archived">sign up to a 4 week Trial</a>?',
		'USER_NOT_ANONYMOUS': `It looks like you already have an account with us. <a target="_blank" href="/login?location=${pageLocation}" style="text-decoration:none;color:#27757B;" data-trackable="sign-in">Sign in</a>.`,
		'USER_CONTRACT_FOUND': 'It looks like you\'re already an FT subscriber. To sign up to exclusive newsletters go to <a target="_blank" href="/newsletters" style="text-decoration:none;color:#27757B;" data-trackable="newsletters">ft.com/newsletters</a>'
	};
	return responseMsg[response] ? responseMsg[response] : responseMsg.INVALID_REQUEST;
}

/*
 * Init component
 * @param {Element} element - the element containing the form
 * @options {Object} options - custom options
 */
export function init (element, options={}) {

	const pageLocation = window.location.href;

	const VISUALLY_HIDDEN_CLASS = 'o-email-only-signup__visually-hidden';
	const FORM_ERROR_CLASS = 'o-forms--error';
	const SELECT_INACTIVE_CLASS = 'o-email-only-signup__select--inactive';

	const o = {
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
		ariaControls: toArray(element.querySelectorAll('[aria-controls]')) || null
	};

	const defaultOptions = {
		signupUrl: '/signup/api/light-signup',
		collapsible: (o.openButton && o.content && o.discreetContent)
	};

	defaultsDeep(options, optionsFromData(element, defaultOptions), defaultOptions);

	enhanceComponent();

	// Event Listeners
	o.form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (isValidEmail(o.emailField.value)) {
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
					displayComponentMessage(getResponseMsg(response, pageLocation));
				})
				.catch(err => console.log(err));

		} else {
			toggleComponentValidationErrors();
		}
	});

	o.emailField.addEventListener('click', () => {
		if (o.emailField.classList.contains(FORM_ERROR_CLASS)) {
			toggleComponentValidationErrors();
		}
	});

	if (o.closeButton) {
		o.closeButton.addEventListener('click', () => {
			if (options.collapsible) {
				showComponentCollapsed(true);
			} else {
				o.self.style.display = 'none';
				o.self.setAttribute('aria-hidden', true);
				updateComponentAriaControls();
			}
		});
	}

	if (o.topicSelect) {
		o.topicSelect.addEventListener('focus', toggleComponentSelectInactive);
		o.topicSelect.addEventListener('blur', toggleComponentSelectInactive);
	}

	if (options.collapsible) {
		o.openButton.addEventListener('click', () => {
			showComponentCollapsed(false);
		});
	}

	// transfrom core to enhanced experience
	function enhanceComponent () {
		if (o.closeButton) {
			removeClass(VISUALLY_HIDDEN_CLASS, o.closeButton);
		}
		updateComponentAriaControls();
		if (options.collapsible) {
			o.contentFocusables = findFocusablesInEl(o.content);
			o.discreetContentFocusables = findFocusablesInEl(o.discreetContent);
		}
	}

	// toggle the email validation errors
	function toggleComponentValidationErrors () {
		toggleClass(FORM_ERROR_CLASS, o.emailField);
		toggleClass(VISUALLY_HIDDEN_CLASS, o.invalidEmailMessage);
	}

	// collapse component, aka. show discreet state
	function showComponentCollapsed (showCollapsed) {

		o.content.setAttribute('aria-hidden', showCollapsed);
		toggleClass(VISUALLY_HIDDEN_CLASS, o.content, showCollapsed);
		o.contentFocusables.forEach(el => {
			toggleTabIndex(el, !showCollapsed);
		});

		o.discreetContent.setAttribute('aria-hidden', !showCollapsed);
		toggleClass(VISUALLY_HIDDEN_CLASS, o.discreetContent, !showCollapsed);
		o.discreetContentFocusables.forEach(el => {
			toggleTabIndex(el, showCollapsed);
		});

		updateComponentAriaControls();
	}

	// toggle the inactive styles on dropdown component to allow mock 'placeholder'
	function toggleComponentSelectInactive (event) {
		let isPlaceholderSelected = (event.target.options[event.target.selectedIndex].getAttribute('placeholder') !== null);

		if (event.type === 'focus') {
			removeClass(SELECT_INACTIVE_CLASS, o.topicSelect);
		}

		if (event.type === 'blur' && isPlaceholderSelected) {
			addClass(SELECT_INACTIVE_CLASS, o.topicSelect);
		}
	}

	/*
	 * display a message in the component
	 * @param {HTML String} message - content to inject
	 */
	function displayComponentMessage (message) {
		o.displaySection.innerHTML = message;
	}

	//update 'aria-expanded' attr to match an 'aria-controls' element target state
	function updateComponentAriaControls () {
		if (o.ariaControls) {
			o.ariaControls.forEach(el => {
				const target = o.self.querySelector('#' + el.getAttribute('aria-controls'));
				if (target) {
					const targetIsHidden = (target && target.getAttribute('aria-hidden') === 'true');
					el.setAttribute('aria-expanded', !targetIsHidden);
				}
			});
		}
	}
};

/*
 * Extract options from element data attributes
 * @param {Element} el
 * @param {Object} options - Containing keys to match attrs
 * @returns {Object}
 */
function optionsFromData (el, opts) {
	const options = {};
	Object.keys(opts).forEach(key => {
		// convert optionKeyLikeThis to data-o-email-only-signup-option-key-like-this
		const attr = 'data-o-email-only-signup-' + kebabCase(key);
		if (el.hasAttribute(attr)) {
			options[key] = el.getAttribute(attr);
		}
	});
	return options;
}

/*
 * find and return an array of 'focusable' elements in a given element
 * @param {Element} el
 * @returns {Array} - Array of Elements, can be empty
 */
function findFocusablesInEl (el) {
	let arr = [];
	['input', 'button', 'a'].forEach(selector => {
		let nodeList = el.querySelectorAll(selector);
		if (nodeList && nodeList.length > 0) {
			arr = arr.concat(toArray(nodeList));
		}
	});
	return arr;
}

/*
 * regex from: https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 * @param {String} email - string to validate as email
 * @returns {Boolean} - true: string is a valid email, false: not valid
 */
function isValidEmail (email) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}

/*
 * For application/x-www-form-urlencoded, spaces are to be replaced by '+',
 * so follow with an additional replacement of "%20" with "+"
 * @param {String} string - string to encode
 * @returns {String}
 */
function encodeComponent (string) {
	return encodeURIComponent(string.trim()).replace('%20', '+');
}

/*
 * serialize a forms inputs
 * @param {Element} form - the form Element to serialize
 * @returns {String}
 */
function serializeFormInputs (form) {
	const inputs = toArray(form.elements);
	let str = [];
	inputs.forEach(el => {
		if (el.name && el.type !== 'submit' && el.type !== 'button') {
			str.push(`${encodeComponent(el.name)}=${encodeComponent(el.value)}`);
		}
	});
	return str.join('&');
}

// add css class to element
function addClass (cssClass, el) {
	el.classList.add(cssClass);
}

// remove css class from element
function removeClass (cssClass, el) {
	el.classList.remove(cssClass);
}

/*
 * toggle css class on element
 * @param {Boolean} force - true: add the class, false: remove the class
 */
function toggleClass (cssClass, el, force) {
	if (force === false) {
		removeClass(cssClass, el);
	} else if (force === true || el.classList.contains(cssClass) === false) {
		addClass(cssClass, el);
	} else {
		removeClass(cssClass, el);
	}
}

// toggle tabindex on element
function toggleTabIndex (el, boolean) {
	let index = boolean ? 0 : -1;
	el.setAttribute('tabindex', index);
}

// check array-like and return converted array
function toArray (arrayLike) {
	if (arrayLike && arrayLike.length > 0) {
		return Array.from(arrayLike);
	}
}
