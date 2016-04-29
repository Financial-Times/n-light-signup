# o-email-only-signup

Experimental light sign-up form

## Installation

```shell
bower install --S o-email-only-signup
```

## Client JS

```javascript
var signUp = require('o-email-only-signup');
signUp.init();
```

### Configuration

Options can be specified imperatively by passing an object into `init`, or declaratively by `data-` attributes. Unspecified options will use the default values.

| Javascript  | Data attribute                        | Description             | Default                    |
|-------------|---------------------------------------|-------------------------|----------------------------|
| `signupUrl` | `data-o-email-only-signup-signup-url` | URL to post the form to | `/signup/api/light-signup` |

## SCSS

Only non-silent mode is supported.

```sass
@import 'o-email-only-signup/main'
```

## Markup

Some elements inside the form require specific data attributes so the JavaScript can add some behaviour correctly. These are:

- `data-o-email-only-signup-form`: Applied to the search `<form>`. Inside, it also requires an `<input>` element with `name="email"`
- `data-o-email-only-signup-close`: Applied to the close button
- `data-o-email-only-signup-completion-message`: Applied to an element that will be replaced with a message when signup is complete
- `data-o-email-only-signup-email-error`: Applied to an element containing a message to display when the entered email is invalid
