export default {

	init() {

		const lightSignupComponent = document.querySelector('.n-light-signup');
		const closeButton = document.querySelector('.n-light-signup__close');
		const lightSignupForm = document.querySelector('.n-light-signup__form');
		const displaySection = document.querySelector('.n-light-signup__secondary');
		const emailField = document.querySelector('.n-light-signup__email');
		const invalidEmailMessage = document.querySelector('.n-light-signup__email-error-msg');

		// Keep marketing copy somewhere

		const pageLocation = window.location.href;

		const responseMsg = {
			'SUBSCRIPTION_SUCCESSFUL': 'Thanks – look out for your first briefing soon.',
			'INVALID_REQUEST': 'Sorry, something went wrong. Please try again.',
			'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products">sign up to a 4 week Trial</a>?',
			'USER_ARCHIVED': 'It looks like you’ve signed up to the daily top stories summary email before. If you’re interested in getting access to more FT content, why not <a target="_blank" style="text-decoration:none;color:#27757B;" href="/products">sign up to a 4 week Trial</a>?',
			'USER_NOT_ANONYMOUS': `It looks like you already have an account with us. <a href="/login?location=${pageLocation}" style="text-decoration:none;color:#27757B;">Sign in</a>.`
		};

		// Handle user interaction

		lightSignupForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const email = emailField.value;

			if (isValidEmail(email)) {

				const url = '/signup/api/light-signup';

				const opts = {
					method: 'POST',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					credentials: 'include',
					body: `email=${email}`
				};

				fetch(url, opts)
					.then(response => response.text())
					.then(response => {
						displaySection.innerHTML = responseMsg[response] ? responseMsg[response] : responseMsg["INVALID_REQUEST"];
					})
					.catch(err => console.log(err));

			} else {

				toggleValidationErrors();

			}
		});

		closeButton.addEventListener('click', () => {
			lightSignupComponent.style.display = 'none';
		});

		emailField.addEventListener('click', () => {
			if (lightSignupForm.classList.contains('o-forms--error')) {
				toggleValidationErrors();
			}
		});

		// Validation helpers

		function isValidEmail(email) {
			return /(.+)@(.+)/.test(email);
		}

		function toggleValidationErrors() {
			lightSignupForm.classList.toggle('o-forms--error');
			invalidEmailMessage.classList.toggle('n-light-signup__visually-hidden');
		}

	}

};
