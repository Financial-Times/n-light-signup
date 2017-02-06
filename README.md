# o-email-only-signup

Light sign-up form.

- [Usage](#usage)
	- [Markup](#markup)
	- [JavaScript](#javascript)
	- [Sass](#sass)
- [Migration guide](#migration-guide)
- [Contact](#contact)
- [Licence](#licence)

## Usage

### Markup

Some elements inside the form require specific data attributes so the JavaScript can add some behaviour correctly. These are:

- `data-o-email-only-signup-form`: Applied to the search `<form>`. Inside, it also requires an `<input>` element with `name="email"`
- `data-o-email-only-signup-close`: Applied to the close button
- `data-o-email-only-signup-completion-message`: Applied to an element that will be replaced with a message when signup is complete
- `data-o-email-only-signup-email-error`: Applied to an element containing a message to display when the entered email is invalid
- `data-o-email-only-signup-dropdown`: **[optional]** Applied to a select element containing a `placeholder` option. Mocks a inactive/placeholder text on the select element. See demo for exmaple usage.

**Collapsible state [optional]** These data attributes MUST be added to elements to enable a collapsible state (as well as `data-o-email-only-signup-close`):

- `data-o-email-only-signup-content`: Applied to the parent element of the content to display in the "open"/default state
- `data-o-email-only-signup-discreet-content`: Applied to the parent of the content to show in the collapsed aka. discreet state
- `data-o-email-only-signup-open`: Applied to the open button (this element MUST NOT be a child of `data-o-email-only-signup-content`, otherwise it will become hidden.

In the collapsed state `data-o-email-only-signup-content` will be visually hidden (and have it's children "focusable" elements `tabindex` set to `-1`) and `data-o-email-only-signup-discreet-content` will be displayed. In the "open"/default state this will be reversed.


**Positioning element [optional]** An element with this attribute MUST be present on the page:

- `data-o-email-only-signup-position-mvt`: Applied to an element to which the form will become a child [see below](#positioning-mvt) for more information.

#### Promo image
You can optionally include a responsive promo image asset in the component. See the demos for examples.


#### Positioning MVT

_**This is optional.** If no positioning element exists the form will render in place._

The position of the signup form within the article (and indeed page) can be customised. This could be used to run a MVT on how the location of the form affects its performance.

A positioning element with the data attribute `data-o-email-only-signup-position-mvt` **must** be present in the DOM.

If this element exists, the form component will become its child, thus moving the form to its position.

_NOTE:_ you **should** initially render the form in a hidden state in order to avoid a reflow. Simply add the class `o-email-only-signup__visually-hidden` to the form (the `data-o-email-only-signup-form` element), the class will be removed when the component is initialised.

### JavaScript

```javascript
var signUp = require('o-email-only-signup');
signUp.init();
```

#### Configuration

Options can be specified imperatively by passing an object into `init`, or declaratively by `data-` attributes. Unspecified options will use the default values.

| Javascript  | Data attribute                        | Description             | Default                    |
|-------------|---------------------------------------|-------------------------|----------------------------|
| `signupUrl` | `data-o-email-only-signup-signup-url` | URL to post the form to | `/signup/api/light-signup` |

### Sass

As with all Origami components, o-email-only-signup has a silent mode. To use its compiled CSS (rather than incorporating its mixins into your own Sass) set `$o-email-only-signup-is-silent: false;` in your Sass before you import the o-email-only-signup Sass:

```sass
$o-email-only-signup-is-silent: false;
@import 'o-email-only-signup/main';
```

#### Using Sass Mixins

The full o-email-only-signup styles can be access via including the `oEmailOnlySignup` mixin:

```sass
// Import the o-email-only-signup sass file
@import 'o-email-only-signup/main';

// Output the o-email-only-signup styles
@include oEmailOnlySignup;
```

## Migration guide

### Migrating from v4.x.x to v5.x.x

Version 5 adds support for silent mode. To continue including the full component in your Sass, update where you import the o-email-only-signup Sass:

```diff
+ $o-email-only-signup-is-silent: false;
@import 'o-email-only-signup/main'
```

---

## Contact

If you have any questions or comments about this component, or need help using it, please either [raise an issue](https://github.com/Financial-Times/o-component-boilerplate/issues), visit [#ft-origami](https://financialtimes.slack.com/messages/ft-origami/) or email [Origami Support](mailto:origami-support@ft.com).

----

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).


