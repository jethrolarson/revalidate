// ReValidate jQuery Validation Framework
// ======================================
// Author: [Jethro Larson](http://github.com/jethrolarson) [@jethrolarson](http://twitter.com/jethrolarson)
//
// License
// -------
// Choose one: MIT, GPL, WTFPL
// As is, no warranty. Authors of the code will not be held responsible for any problems that may arise from it's use.
//
// You've tried using several different validation libraries. Many were pretty good, full-featured, and easy to use; but somehow you're always running into cases where you need some weird, specific validation rule, and hacking these plugins is often really complex and against the grain.
//
// Revalidate is a validation **Framework**. It has been written to make writing strange validation rules easy, while still having great UI.
//
// Events for validation are split into two groups: initial validation and post-error validation. That allows you to avoid giving people error messages before they've had a chance to enter valid input, while still you to remove validation error messages the *instant* that the field becomes valid.
//
// * [validation.lib.js](validation.lib.html) : An example validation library that uses the framework.
// * [Examples](../index.html)
//
// ----
//

(function($) {
	var $tooltip, $tooltipContent, FieldValidator, FormValidator, formValidator, fvIndex = 0;
	
	// ### Error Tooltip HTML
	// We only need one because only one message is shown at a time.
	$tooltipContent = $('<div id="validatorTooltipContent"/>');
	$tooltip = $('<div id="validatorTooltip"/>').append($tooltipContent).append('<div class="carrotBottom"><div></div></div>').prepend('<div class="carrotTop"><div></div></div>').appendTo('body');
	
	// Field Validator Constructor
	// -------------------------------
	// This object controlls events related to field validation
	FieldValidator = function(selector, settings) {
		// ### FieldValidator Default Settings
		this.settings = $.extend({
			// Error message to display. Can also be a function that returns a message.
			message: 'There is an error with this field',
			// List of space-separated events to validate on. e.g. "blur click mouseenter"
			validateOn: '',
			// Same as validateOn except will only validate if the field is already in error.
			// Use case: You want to immediately remove an existing error
			// message if a user enters a correct value but not show an error message until
			// they submit the form.
			revalidateOn: '',
			// If true then validation will be skipped on hidden fields
			ignoreHidden: true,
			// ### Default validator: does a falsy check on the value
			// `this` is the element
			// `fv` is the fieldValidator instance
			validator: function(fv) {
				return !!this.value;
			},
			// List of events to show the validation method on (editing this is not recommended)
			showMessageOn: 'focusin',
			hideMessageOn: 'focusout'
		}, settings);
		this.selector = selector;
		this.fvIndex = fvIndex;
		fvIndex += 1;
		if (this.settings.validator) {
			this.validator = this.settings.validator;
		}
		this.bindEvents();
		$(this.selector).trigger('init');
		return this;
	};
	// ---
	// ## FieldValidator Prototype
	FieldValidator.prototype = $.extend(FieldValidator.prototype, {
		disabled: false,
		// Calls `@check` and sets the error classes and prepares any error messages
		validate: function(field) {
			var fieldValid,
				$field = $(field),
				fvValid = this.check(field);
			if(!fvValid){
				$field.attr('aria-label', typeof this.settings.message == 'string' ? this.settings.message : this.settings.message.call(field,this));
			}
			fieldValid = true;
			$.each(($field.data('fieldvalidators') || {}),function(k,v){
				if(!v) fieldValid = false;
			});
			$field.toggleClass('invalid', !fieldValid);
			// set error message
			if(fieldValid){
				$field.removeAttr('aria-label').trigger('valid');
			}
			return fvValid;
		},
		// Trigger validation on all matching fields that are a child of `form`
		validateAll: function(form){
			var that = this;
			$(this.selector,form).each(function(){
				that.validate(this);
			});
		},
		// Checks to see if this field is valid without changing anything
		check: function(field) {
			var $field = $(field),
				fvs = $field.data('fieldvalidators') || {},
				valid = true;
			if (!(this.disabled || field.disabled || (this.settings.ignoreHidden && $field.is(':hidden')))) {
				valid = this.validator.call(field, this);
			}
			fvs[this.fvIndex] = valid;
			$field.data('fieldvalidators',fvs);
			return valid;
		},
		// Displays the fieldValidator bubble message
		showMessage: function(field) {
			var h, pos, msg,
				$field = $(field);
			if ($field.hasClass('invalid')) {
				// If message is a function call it for the value
				$tooltipContent.html($field.attr('aria-label'));
				// Position the bubble
				pos = $field.offset();
				$tooltip.show();
				h = $tooltip.outerHeight();
				// If it would be off the top of the screen put it below
				if (pos.top - h < window.scrollY) {
					$tooltip.addClass('bottom');
					pos.top += $field.outerHeight();
				} else {// Else on top of field
					$tooltip.removeClass('bottom');
					pos.top -= h;
				}
				return $tooltip.css(pos);
			}
			return true;
		},
		// Binds live events to the selector
		bindEvents: function() {
			var that = this;
			return $(this.selector).live(this.settings.showMessageOn, function(){
				return that.showMessage(this);
			})
			.live(this.settings.hideMessageOn + ' valid', function() {
				return $tooltip.hide();
			})
			.live(this.settings.validateOn + ' validate', function() {
				that.validate(this);
				return true;
			})
			.live(this.settings.revalidateOn, function() {
				if($(this).hasClass('invalid')){
					that.validate(this);
				}
				return true;
			});
		}
	});

	// ---------------------------------

	// Form Validation Constructor
	// -------------------------------
	FormValidator = function(selector, settings) {
		// ### FormValidator Default Settings
		this.settings = $.extend({
			// Flag to enable scrolling the window to the first invalid input when the form is validated
			scrollToErrorField: true,
			// How long the error animated scroll takes, 0 is instant
			scrollDuration: 100,
			throttleSubmission: true,
			scrollOffset: -45,
			// Confirms submitting the form multiple times if a request has already been sent
			confirmResubmission: true,
			confirmResubmissionMessage: 'Form is already submitting. Do you want to submit the form again?'
		}, settings);
		this.selector = selector;
		this.fieldValidators = [];
		this.bindEvents();
		return this;
	};
	
	// -------
	// ##FormValidator Prototype
	FormValidator.prototype = $.extend(FormValidator.prototype, {
		// Adds a FieldValidator instance to `this.fieldValidators`
		addFieldValidator: function(selector, settings) {
			this.fieldValidators.push(new FieldValidator(selector,settings));
			return this;
		},
		// Flag to disable submit validaion on this form validator. TODO add more obvious public api.
		disabled: false,
		// Calls validate() on all attached fieldValidators.
		validate: function(form) {
			var fv, i, len,
				$form = $(form),
				formValid = true;
			// validateAll fieldValidators
			for (i = 0, len = this.fieldValidators.length; i < len; i++) {
				this.fieldValidators[i].validateAll(form);
			}
			// check for anything with .invalid
			formValid = !$form.find('.invalid').length;
			$form.toggleClass('formInvalid',formValid);
			return formValid;
		},
		// Bind live events on the selector
		bindEvents: function() {
			var that = this;
			return $(this.selector).live('submit', function(e) {
				var $firstInvalid,
					form = this,
					$form = $(this);
				// Skip validation if formValidator is disabled
				if (that.disabled) {
					return true;
				}
				// If throttleSubmission confirm resubmission of the form.
				if (that.settings.throttleSubmission && $form.data('formSubmitting') && !confirm(that.settings.confirmResubmissionMessage)) {
					e.preventDefault();
					e.stopImmediatePropagation();
				} else {
					// Validate the form
					if (that.validate(form)) {
						$form.data('formSubmitting',true);
						$form.trigger('actuallySubmitting');// Used in IDS checkout/review
					} else {
						if (that.settings.scrollToErrorField) {
							$firstInvalid = $form.find('.invalid').eq(0);
							// Scroll to the first invalid field
							$.scrollTo($firstInvalid, {
								offset: {
									top: that.settings.scrollOffset
								},
								duration: that.settings.scrollDuration,
								onAfter: function() {
									// Focus the field
									$firstInvalid.focusin().focus();
								}
							});
						}
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				}
			});
		}
	});

	var _formValidators = {};
	
	// ---------------

	// formValidator jQuery Plugin
	//----------------------------
	// Attach a formValidator to a selector. Like jQuery.fn.live formValidator must be invoked on a selector string  
	// Usage $('form.validate').formValidator(formValidatorSettings,fieldValidators).  
	// fieldValidators are optional.
	$.fn.formValidator = function(settings,fieldValidators){
		if(!this.selector){
			throw 'Selector Required. Like jQuery.fn.live formValidator must be invoked on a selector string';
		}
		_formValidators[this.selector] = new FormValidator(this.selector,settings);
		if(fieldValidators){
			this.fieldValidator(fieldValidators);
		}
		return this;
	};

	// fieldValidator jQuery Plugin
	//-----------------------------
	// Add a field validator to a form with an existing formValidator
	//
	// * usage 1: $('form.validate').fieldValidator(selector, fieldValidatorSettings);  
	// * usage 2: $('form.validate').fieldValidator({selector: fieldValidatorSettings, ...});
	$.fn.fieldValidator = function(selector,settings){
		var formValidator = _formValidators[this.selector];
		if(!formValidator){
			throw 'formValidator "'+this.selector+'" does not exist.';
		}else{
			if(typeof selector === 'string'){
				formValidator.addFieldValidator(selector,settings);
			}else{
				$.each(selector,function(k,v){
					formValidator.addFieldValidator(k,v);
				});
			}
		}
		return this;
	};

	// Animated Page Scroll jQuery plugin
	// -------------------------------------
	// Defaults to
	// [Ariel's scrollTo Plugin](http://flesler.blogspot.com/2007/10/jqueryscrollto.html)
	// if included. This uses a subset of the same api.
	if (!$.scrollTo) {
		$.scrollTo = function(selector, settings) {
			var pos;
			settings = $.extend({
				offset: {
					top: 0
				},
				onAfter: $.noop(),
				duration: 0
			}, settings);
			pos = $(selector).offset();
			return $('html,body').animate({
				scrollTop: pos.top + settings.offset.top
			}, {
				duration: settings.duration,
				complete: settings.onAfter
			});
		};
	}
})(jQuery);
