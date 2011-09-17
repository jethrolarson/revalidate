ReValidate jQuery Framework
===========================
Author: [Jethro Larson](http://github.com/jethrolarson) [@jethrolarson](http://twitter.com/jethrolarson)

License
-------
Choose one: MIT, GPL, WTFPL
As is, no warranty. Authors of the code will not be held responsible for any problems that may arise from it's use.

Intro
-----
After trying several different validation libraries I was unable to find one that worked well for obtuse validation cases while still having a good UI. I've attempted to create a validation framework that will allow you to write any new strange rules easilly and without pain. 

I also wanted to separate events for initial form validation from post-error validation. That allows me to avoid telling people they are doing it wrong before they've had a chance to enter valid input, while still allowing me to remove validation error messages the instant that the field becomes valid.

* `validation.coffee` : The validation framework used to create your own validation rules.  
* `app.coffee` : An example validation library that uses the framework.

[Annotated Source](docs/validation.html)
----------------------------------------

Brief docs
----------
## $.fn.formValidator
Set up validation on a form element.  
[FormValidator Settings](http://jethrolarson.github.com/revalidate/docs/validation.html#section-23)

### Example: 

    $('form').formValidator();

## $.fn.fieldValidator (settings)
Create field validation rules and attach them to elements.  
[FieldValidator Settings](http://jethrolarson.github.com/revalidate/docs/validation.html#section-4)

### Example:

    $(':text.required').fieldValidator({
      validator: function() {
        return $.trim(this.value);
      },
      revalidateOn: 'blur keyup',
      message: 'This field is Required'
    });

UX Specifications
-----------------
* Validation should not affect the appearance of the form by default
* Server-side validation is not yet integrated so if the form starts in an invalid state when page loads there will be no indication. However this is a planned feature.
* Fields are not limited to only form inputs. Rules can be attached to any html. This is specified by the selector in the field validators.
* Rules for when to test and show validation messages are set by the `fieldValidator`.

### On form submit:
1. All fields are validated.
2. An animated scroll of the window is initiated to the location of the first invalid field, in document order. 
3. That field is then focused.

### When a field is validated:
* If a validator fails validation then a class of 'invalid' is added to the field. By default this sets the background of the field to a light yellow.
* If it passes then any error indicators are removed. 
* If multiple validators are applied to the same field then they all must pass to remove the invalid indicator.

### When an invalid field is focused:

* Error message is displayed above the field. This message is in a bubble with a carrot at the bottom.
* If there is no room above the field for the error message then the message should show below the field with the carrot at the top of the bubble.
* Carrots are not displayed in IE6. In other older versions of IE the carrot is a little jaggy, and appears slightly to the right of where it shows in modern browsers.

### Other events:
* Events listed in `fieldValidator.validateOn` will validate the field, hiding or showing indicators.
* Events listed in `fieldValidator.revalidateOn` will validate the field ONLY if the field is currently displayed as invalid.
* Events listed in `fieldValidator.showMessageOn` will show validation message bubble. (`default: focusin`) †
* Events listed in `fieldValidator.hideMessageOn` will hide validation message bubble. (`default: focusout`) †

Contribute
----------
This is a new library so please report any bugs you find.

Original source is written in [CoffeeScript](http://jashkenas.github.com/coffee-script) so I wont merge pull requests that only change the generated js; However I may rewrite them in the coffee if I feel they are important or cool.

Here's the coffee-script watch command for convenience:

    coffee -o js/compiled --watch coffee/

TODO
----
* Set up QUnit for all the settings
* Ease integration with server-side validation

Other Projects
--------------
[HTML5 Placeholder Augment and Polyfill](http://github.com/jethrolarson/placeholder-augment) - It's HTML5 Placeholder Attribute except accessible, better, and cross-browser; while still being just as easy to use.

†: Editing this is not recommended. 