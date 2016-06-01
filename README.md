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

**[optional]** If a positioning element exists on the page the form will render as a child of it:

- `data-o-email-only-signup-position-mvt`: Applied to an element to which the form will become a child [see below](#positioning-mvt) for more information.
- `data-o-email-only-signup-dropdown`: Applied to a select element containing a `placeholder` option. Mocks a inactive/placeholder text on the select element. See demo for exmaple usage.

## Promo image
You can optionally include a responsive promo image asset in the component. See the demos for examples.


## Positioning MVT

_**This is optional.** If no positioning element exists the form will render in place._

The position of the signup form within the article (and indeed page) can be customised. This could be used to run a MVT on how the location of the form affects its performance.

A positioning element with the data attribute `data-o-email-only-signup-position-mvt` **must** be present in the DOM.

If this element exists, the form component will become its child, thus moving the form to its position.

_NOTE:_ you **should** initially render the form in a hidden state in order to avoid a reflow. Simply add the class `o-email-only-signup__visually-hidden` to the form (the `data-o-email-only-signup-form` element), the class will be removed when the component is initialised.




