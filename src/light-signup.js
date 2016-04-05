const form = document.querySelector('.n-light-signup__form');
const checkbox = document.querySelector('input[type=checkbox]');

form.addEventListener('submit', (e) => {
	e.preventDefault();

    if (checkbox.checked) {

        // TODO: if checkbox was previously red, unreddify it

        // TODO: XHR works, fetch doesn't...

	    /** fetch('/signup/api/light-signup', {
		    method: 'POST',
            redirect: 'follow',
		    body: 'email=test@test.com'
	    })
	    .then(response => console.log(response))
        .catch(err => console.log(err)); **/


        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/signup/api/light-signup', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) console.log(xhr.responseText);
        };
        xhr.send('email=test@testtesttesttest.com');

    } else {

        document.querySelector('.n-light-signup__checkbox').style = 'background: red';

    }
});
