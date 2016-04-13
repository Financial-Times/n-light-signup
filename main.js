import lightSignupHTML from './templates/form';
import lightSignup from './src/light-signup';

export default {

	init() {

		const lightSignupContainer = document.querySelector('.n-light-signup__container');

		lightSignupContainer.innerHTML = lightSignupHTML;

		lightSignup.init();

	}

}
