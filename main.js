import lightSignup from './src/light-signup';

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
			if(el.matches('[data-o-component~="o-light-signup"]')) {
				lightSignup.init(el, options);
			} else {
				el = el.querySelector('[data-o-component~="o-light-signup"]');
				if(el) {
					lightSignup.init(el, options);
				}
			}
		}
	}
};
