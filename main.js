import emailOnlySignup from './src/email-only-signup';

export default {

	init(el = document.body, options = {}) {
		const utmTermParam = /[?&]utm_term(=([^&#]*)|&|#|$)/i.exec(window.location.href);

		let userIsFromLightSignupEmail;

		if (utmTermParam) {
			userIsFromLightSignupEmail = (utmTermParam[2] === 'lightsignup');
		}

		if(!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}

		if (!userIsFromLightSignupEmail) {
			if(el.matches('[data-o-component~="o-email-only-signup"]')) {
				emailOnlySignup.init(el, options);
			} else {
				el = el.querySelector('[data-o-component~="o-email-only-signup"]');
				if(el) {
					emailOnlySignup.init(el, options);
				}
			}
		}
	}
};
