---
layout: default
title: Revalidate UX Specifications
---

UX Specifications
-----------------
* Validation should not affect the appearance of the form by default
* Server-side validation is now functional. Add data-error="message" to the html of an element to force an error message on page load.
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
