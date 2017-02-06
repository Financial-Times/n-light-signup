import kebabCase from 'lodash/string/kebabCase';

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
 * regex from: https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 * @param {String} email - string to validate as email
 * @returns {Boolean} - true: string is a valid email, false: not valid
 */
function isValidEmail (email) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
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
 * Extract options from element data attributes
 * @param {Element} el
 * @param {Object} options - Containing keys to match attrs
 * @returns {Object}
 */
function optionsFromMarkUp (el, opts) {
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

// check array-like and return converted array
function toArray (arrayLike) {
	if (arrayLike && arrayLike.length > 0) {
		return Array.from(arrayLike);
	}
}

function toggleTabIndex (el, boolean) {
	let index = boolean ? 0 : -1;
	el.setAttribute('tabindex', index);
}

/*
 * convert a response 'code' to html message
 * @param {String} response
 * @param {String} pageLocation
 * @returns {HTMLString}
 */
export function getResponseMessage (response, pageLocation) {
	const responseMsg = {
		'SUBSCRIPTION_SUCCESSFUL': 'Thanks – look out for your first briefing soon.',
		'INVALID_REQUEST': 'Sorry, something went wrong. Please try again.',
		'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043&amp;segmentID=a5d15097-05ed-e096-2ac0-d693e4ece928" data-trackable="trial-existing">sign up to a 4 week trial</a>?',
		'USER_ARCHIVED': 'It looks like you’ve signed up to the daily top stories summary email before. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products?segID=0801043&amp;segmentID=a5d15097-05ed-e096-2ac0-d693e4ece928" data-trackable="trial-archived">sign up to a 4 week trial</a>?',
		'USER_NOT_ANONYMOUS': `It looks like you already have an account with us. <a target="_blank" href="/login?location=${pageLocation}" style="text-decoration:none;color:#27757B;" data-trackable="sign-in">Sign in</a>.`,
		'USER_CONTRACT_FOUND': 'It looks like you\'re already an FT subscriber. To sign up to exclusive newsletters go to <a target="_blank" href="/newsletters" style="text-decoration:none;color:#27757B;" data-trackable="newsletters">ft.com/newsletters</a>'
	};
	return responseMsg[response] ? responseMsg[response] : responseMsg.INVALID_REQUEST;
}
module.exports = {
	serializeFormInputs,
	toArray,
	optionsFromMarkUp,
	findFocusablesInEl,
	toggleTabIndex,
	isValidEmail,
	getResponseMessage
};
