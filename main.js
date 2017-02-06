import EmailSignUp from './src/js/email-only-signup';

const constructAll = function() {
	EmailSignUp.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);

export default EmailSignUp;
