ReValidate jQuery Framework
===========================
Author: [@jethrolarson](http://twitter.com/jethrolarson)

License
-------
Choose one: MIT, GPL, WTFPL
As is, no warranty. Authors of the code will not be held responsible for any problems that may arise from it's use.

Intro
-----
After trying several different validation libraries I was unable to find one that worked well for obtuse validation cases while still having a good UI. I've attempted to create a validation framework that will allow you to write any new strange rules easilly without pain. I also wanted to separate events for initial form validation from post-error validation. That allows me to avoid telling people they are doing it wrong before they've had a chance to enter valid input, while still allowing me to remove validation error messages the instant that the field becomes valid.

Since the goal is to be a framework not a library, validation.coffee doesn't do anything by itself.
app.coffee has some example validation rules and usage, but you may want to adapt that to your application's needs.

Brief docs
----------
## $.fn.fieldValidator (settings)

    FieldValidator.defaultSettings = {
      /* Error message to display */
      message: 'There is an error with this field',
      /* List of space-separated events to validate on. e.g. "blur click mouseenter" */
      validateOn: '',
      /* 
      	Same as validateOn except will only validate if the field is already in error. 
      	Use case: You might want to immediately remove an error 
      	message if a user enters a correct value but not show an error message until 
      	they click submit. 
      	*/
      revalidateOn: '',
      /* If true then validation will be skipped on hidden fields */
      ignoreHidden: true,
      /* Default validator: does a falsy check on the value */
      validator: function() {
        return !!this.value;
      }
    };

### Example:

    $(':text.required').fieldValidator({
      validator: function() {
        return $.trim(this.value);
      },
      revalidateOn: 'blur keyup',
      message: 'This field is Required'
    });


## $.fn.formValidator

    FormValidator.defaultSettings = {
    	scrollToErrorField: true
    	### How long the error animated scroll takes, 0 is instant ###
    	scrollDuration: 100

    	### Prevents submitting the form multiple times if a request has already been sent ###
    	throttleSubmission: true
    }

### Example: 

    $('form').formValidator();

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
