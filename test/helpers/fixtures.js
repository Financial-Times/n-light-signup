let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}


function standardHtml () {
	const html = `
		<div class="o-email-only-signup o-email-only-signup--inline" data-o-component="o-email-only-signup" data-trackable="light-signup">
			<div class="o-email-only-signup__inner">
				<button class="o-email-only-signup__close o-email-only-signup__visually-hidden" data-o-email-only-signup-close><span class="o-email-only-signup__visually-hidden">Close</span></button>
				<h3 class="o-email-only-signup__heading">Sample the FT, with the top stories sent <span class="o-email-only-signup__highlight">free</span> to your inbox every morning</h3>
				<p class="o-email-only-signup__text">For 1 week, you’ll get an email with free access to the 3 most read FT stories.</p>
				<div class="o-email-only-signup__secondary" data-o-email-only-signup-completion-message>
					<form class="o-email-only-signup__form" data-o-email-only-signup-form>

						<div class="o-email-only-signup__form-group">
							<label for="email" class="o-email-only-signup__visually-hidden">Enter your email address:</label>
							<input type="text" id="email" name="email" class="o-email-only-signup__email" data-trackable="email" placeholder="Enter your email address">
							<p class="o-email-only-signup__email-error-msg o-email-only-signup__visually-hidden" data-o-email-only-signup-email-error>Invalid email</p>
						</div>

						<button type="submit" class="o-email-only-signup__submit" data-trackable="submit">Send me free stories for 1 week</button>

						<p class="o-email-only-signup__no-spam">By clicking Sign up you confirm that you have read and agree to the <a target="_blank" href="http://help.ft.com/tools-services/ft-com-terms-and-conditions">terms and conditions</a>, <a target="_blank" href="http://help.ft.com/tools-services/how-the-ft-manages-cookies-on-its-websites">cookie policy</a> and <a target="_blank" href="http://help.ft.com/tools-services/financial-times-privacy-policy">privacy policy</a>.<br /><strong>Unsubscribe at any time.</strong></p>
					</form>
				</div>
			</div>
		</div>
	`;
	insert(html);
}

function collapsibleHtml () {
	const html = `
<div class="o-email-only-signup o-grid-container" data-o-component="o-email-only-signup" data-trackable="light-signup">
	<div class="o-email-only-signup__discreet o-email-only-signup__visually-hidden" aria-hidden="true" data-o-email-only-signup-discreet-content>
		<button class="o-email-only-signup__open" aria-controls="o-email-only-signup-content" data-o-email-only-signup-open>show more</button>
		<h3 class="o-email-only-signup__heading"><span class="o-email-only-signup__highlight">free</span> stories to your inbox every morning</h3>
	</div>
	<div class="o-grid-row o-email-only-signup__inner" aria-hidden="false" id="o-email-only-signup-content" data-o-email-only-signup-content>
		<div data-o-grid-colspan="hide S5" class="o-email-only-signup__promo">
			<img src="https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fwww.ft.com%2F__assets%2Fcreatives%2Fproduct%2Ftop-three-newsletter-2.png?source=o-email-only-signup" class="o-email-only-signup__promo-image" alt="Alt Text"/>
		</div>
		<div data-o-grid-colspan="12 S7">
			<button class="o-email-only-signup__close o-email-only-signup__visually-hidden" aria-controls="o-email-only-signup-content" data-o-email-only-signup-close><span class="o-email-only-signup__visually-hidden">Close</span></button>
			<h3 class="o-email-only-signup__heading"><span class="o-email-only-signup__highlight">free</span> stories to your inbox every morning</h3>
			<p class="o-email-only-signup__text">Recieve a daily email containing the 3 top stories from a popular news topic of your choice.</p>
			<div class="o-email-only-signup__secondary" data-o-email-only-signup-completion-message>
				<form class="o-email-only-signup__form" data-o-email-only-signup-form>

					<div class="o-email-only-signup__form-group">
						<label for="topics" class="o-email-only-signup__visually-hidden">Select the topic you are interested in:</label>
						<select id="topics" name="topics" class="o-email-only-signup__select o-email-only-signup__select--inactive" data-o-email-only-signup-dropdown>
							<option value="default" disabled selected hidden placeholder>Select the topic you're interested in</option>
							<option value="default">Top Stories</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
							<option value="option4">Option 4</option>
						</select>
					</div>

					<div class="o-email-only-signup__form-group">
						<label for="email" class="o-email-only-signup__visually-hidden">Enter your email address:</label>
						<input type="text" id="email" name="email" class="o-email-only-signup__email" data-trackable="email" placeholder="Enter your email address">
						<p class="o-email-only-signup__email-error-msg o-email-only-signup__visually-hidden" data-o-email-only-signup-email-error>Invalid email</p>
					</div>

					<button type="submit" class="o-email-only-signup__submit" data-trackable="submit">Send me free stories for 1 week</button>

					<p class="o-email-only-signup__no-spam">By clicking Sign up you confirm that you have read and agree to the <a target="_blank" href="http://help.ft.com/tools-services/ft-com-terms-and-conditions">terms and conditions</a>, <a target="_blank" href="http://help.ft.com/tools-services/how-the-ft-manages-cookies-on-its-websites">cookie policy</a> and <a target="_blank" href="http://help.ft.com/tools-services/financial-times-privacy-policy">privacy policy</a>.<br /><strong>Unsubscribe at any time. Free stories only last for 1 week.</strong></p>
				</form>
			</div>
		</div>
	</div>
</div>
	`;
	insert(html);
}
export {
	standardHtml,
	collapsibleHtml,
	reset
 };
