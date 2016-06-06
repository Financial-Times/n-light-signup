import * as emailOnlySignup from './src/email-only-signup';

export default {

	init(el = document.body, options = {}) {
		const utmTermParam = /[?&]utm_term(=([^&#]*)|&|#|$)/i.exec(window.location.href);
		const positionMvt = document.querySelector('[data-o-email-only-signup-position-mvt]');

		let userIsFromLightSignupEmail;

		if (utmTermParam) {
			userIsFromLightSignupEmail = (utmTermParam[2] === 'lightsignup');
		}

		if(!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}

		if (!el.matches('[data-o-component~="o-email-only-signup"]')) {
			el = el.querySelector('[data-o-component~="o-email-only-signup"]');
		}

		if (!userIsFromLightSignupEmail && el) {

			// Article Position MVT: move the component and ensure visible
			if (positionMvt) {
				positionMvt.appendChild(el);
			}
			el.classList.remove('o-email-only-signup__visually-hidden');
			el.setAttribute('aria-hidden', false);

			emailOnlySignup.init(el, options);
		}
	}
};
