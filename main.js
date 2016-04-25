import lightSignupHTML from './templates/form';
import lightSignup from './src/light-signup';

export default {

	init() {

		const utmTermParam = /[?&]utm_term(=([^&#]*)|&|#|$)/i.exec(window.location.href);

		let userIsFromLightSignupEmail;

		if (utmTermParam) {
			userIsFromLightSignupEmail = (utmTermParam[2] === 'lightsignup');
		}

		if (!userIsFromLightSignupEmail) {

			const lightSignupContainer = document.querySelector('.o-light-signup__container');

			lightSignupContainer.innerHTML = lightSignupHTML;

			lightSignup.init();

		}

	}

};
