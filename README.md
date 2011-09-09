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
