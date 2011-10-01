---
layout: default
title: ReValidate - jQuery Validation Framework
---

Author: [Jethro Larson](http://github.com/jethrolarson) [@jethrolarson](http://twitter.com/jethrolarson)

License
-------
Choose one: MIT, GPL, WTFPL  
As is, no warranty. Authors of the code will not be held responsible for any problems that may arise from it's use.

You've tried using several different validation libraries. Many were pretty good, full-featured, and easy to use; but somehow you're always running into cases where you need some weird specific validation rule, and hacking these plugins is often really complex and against the grain.

Revalidate is a validation **Framework**. It has been designed to make writing strange validation rules easy while still having great UI.

* **[Demo](examples/index.html)**
* **[Revalidate Framework](docs/validation.html)**
  The validation framework used to create your own validation rules.  
* **[Revalidate Sample Library](docs/validation.lib.html)**
  An example validation library that uses the framework.
* **[UX Specifications](docs/ux-specs.html)**



Example Usage:
--------------

### Set up validation on a form:

    var formValidator = new FormValidator('form');

### Create and attache a validation rule:

    formValidator.addFieldValidator('.requiredTextbox',{
      validator: function() {
        return $.trim(this.value);
      },
      revalidateOn: 'blur keyup',
      message: 'This field is Required'
    });


Contribute
----------
This is a new library so please report any bugs you find.

TODO
----
* Set up QUnit for all the settings

Other Projects
--------------
[HTML5 Placeholder Augment and Polyfill](http://jethrolarson.github.com/placeholder-augment/) - It's HTML5 Placeholder Attribute except accessible, better, and cross-browser; while still being just as easy to use.

†: Editing this is not recommended. 
