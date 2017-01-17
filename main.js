import oEmailSignUp from './src/js/email-only-signup';

export default {
	init(element = document.body, options = {}) {
		const utmTermParam = /[?&]utm_term(=([^&#]*)|&|#|$)/i.exec(window.location.href);

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
			oEmailSignUp(element, options);
		}
	}
}
