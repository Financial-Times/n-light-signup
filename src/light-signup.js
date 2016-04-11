const lightSignupComponent = document.querySelector('.n-light-signup');
const lightSignupForm = document.querySelector('.n-light-signup__form');
const formSubmit = document.querySelector('.n-light-signup__submit');
const emailField = document.querySelector('.n-light-signup__email');
const displaySection = document.querySelector('.n-light-signup__secondary');
const closeButton = document.querySelector('.n-light-signup__close');
const invalidEmailMessage = document.querySelector('.n-light-signup__email-error-msg');

const thankYouHTML = '<p class="n-light-signup__heading">Thanks – look out for your first briefing tomorrow morning.</p>';
const errorMessage = {
	'INVALID_EMAIL': 'Please enter a valid email address',
	'INVALID_REQUEST': 'That request was invalid',
	'ALREADY_SUBSCRIBED': 'It looks like you’re currently receiving the daily top stories summary email, if you’re interested in getting access to more FT content, why not sign up for a £1 Trial for 4 weeks.',
	'USER_ARCHIVED': 'It looks like you\'ve signed up to the daily top stories summary email before. If you\’re interested in getting access to more FT content, why not sign up for a £1 Trial for 4 weeks.'
};

formSubmit.addEventListener('click', (e) => {
	e.preventDefault();

	const email = emailField.value;

	if (isValidEmail(email)) {

		// TODO: There is an issue with using the production signup app (goes away when running a local version):

		const url = '/signup/api/light-signup';

		const opts = {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			redirect: 'follow',
			credentials: 'include',
			body: `email=${email}`
		};

		fetch(url, opts)
			.then(response => updateComponent(response))
			.catch(err => console.log(err));

	} else {

		toggleValidationErrors();

	}

});

closeButton.addEventListener('click', () => {
	lightSignupComponent.style.display = 'none';
});

emailField.addEventListener('click', () => {
	if (lightSignupForm.classList.contains('o-forms--error')) toggleValidationErrors();
});

function isValidEmail(email) {
	return /(.+)@(.+)/.test(email);
}

function toggleValidationErrors () {
	lightSignupForm.classList.toggle('o-forms--error');
	invalidEmailMessage.classList.toggle('n-light-signup__visually-hidden');
}

function updateComponent(response) {
	if (response.ok) {
		displaySection.innerHTML = thankYouHTML;
	} else {
		response.text().then(errorType => {
			displaySection.innerHTML = errorMessage[errorType];
		});
	}
}
