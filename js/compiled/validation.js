(function() {
  /*
  Revalidate - Validation framework for jQuery
  License: MIT, GPL, or WTFPL
  Author: @JethroLarson
  */
  var $tooltip, $tooltipContent, FieldValidator, FormValidator, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $tooltipContent = $('<div id="validatorTooltipContent"/>');
  $tooltip = $('<div id="validatorTooltip"/>').append($tooltipContent).append('<div class="carrotBottom"><div></div></div>').prepend('<div class="carrotTop"><div></div></div>').appendTo('html');
  /* 
  Field Validator 
  This object controlls events related to field validation
  */
  FieldValidator = function(field, settings) {
    this.settings = $.extend(FieldValidator.defaultSettings, settings);
    if (this.settings.validator) {
      this.validator = this.settings.validator;
    }
    this.field = field;
    this.$field = $(field);
    this.bindEvents();
    return this;
  };
  /* FieldValidator Default Settings */
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
  FieldValidator.prototype = $.extend(FieldValidator.prototype, {
    valid: true,
    disabled: false,
    /* verifies that the field is valid and shows validation messages if necessary */
    validate: function() {
      var fieldValid, fv, _i, _len, _ref;
      this.check();
      fieldValid = true;
      _ref = this.$field.data('fieldvalidators');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fv = _ref[_i];
        if (!fv.valid) {
          fieldValid = false;
        }
      }
      this.$field.toggleClass('invalid', !fieldValid);
      if (!this.valid) {
        this.$field.attr('aria-label', this.settings.message);
      } else {
        this.$field.removeAttr('aria-label');
        this.$field.trigger('valid');
      }
      return this.valid;
    },
    /* checks, sets, and returns this.valid */
    check: function() {
      if (this.disabled || this.settings.ignoreHidden && this.$field.is(':hidden')) {
        return this.valid = true;
      }
      return this.valid = this.field.disabled || this.validator.call(this.field, this);
    },
    /* Binds events to this.$field */
    bindEvents: function() {
      this.$field.bind({
        validate: __bind(function() {
          this.validate();
          return true;
        }, this),
        focusin: __bind(function() {
          var h, pos;
          if (!this.valid) {
            $tooltipContent.html(this.settings.message);
            pos = this.$field.offset();
            $tooltip.show();
            h = $tooltip.outerHeight();
            if (pos.top - h < window.scrollY) {
              $tooltip.addClass('bottom');
              pos.top += this.$field.outerHeight();
            } else {
              $tooltip.removeClass('bottom');
              pos.top -= h;
            }
            return $tooltip.css(pos);
          }
        }, this),
        'focusout valid': __bind(function() {
          return $tooltip.hide();
        }, this)
      });
      this.settings.validateOn && this.$field.bind(this.settings.validateOn, __bind(function() {
        this.validate();
        return true;
      }, this));
      return this.settings.revalidateOn && this.$field.bind(this.settings.revalidateOn, __bind(function() {
        !this.valid && this.validate();
        return true;
      }, this));
    }
  });
  /* 
  Form Validation Constructor 
  */
  FormValidator = function(form, settings) {
    this.settings = $.extend(FormValidator.defaultSettings, settings);
    this.fieldValidators = [];
    this.form = form;
    this.$form = $(form);
    this.bindEvents();
    return this;
  };
  FormValidator.defaultSettings = {
    scrollToErrorField: true,
    /* How long the error animated scroll takes, 0 is instant */
    scrollDuration: 100,
    /* Prevents submitting the form multiple times if a request has already been sent */
    throttleSubmission: true
  };
  FormValidator.prototype = $.extend(FormValidator.prototype, {
    addFieldValidator: function(fv) {
      this.fieldValidators.push(fv);
      return this;
    },
    valid: false,
    formSubmitting: false,
    validate: function() {
      var field, _i, _len, _ref;
      this.valid = true;
      _ref = this.fieldValidators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (!field.validate()) {
          this.valid = false;
        }
      }
      return this.valid;
    },
    checkAll: function() {
      var field, _i, _len, _ref;
      this.valid = true;
      _ref = this.fieldValidators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (!field.check()) {
          this.valid = false;
          break;
        }
      }
      return this.valid;
    },
    bindEvents: function() {
      return this.$form.bind({
        submit: __bind(function() {
          var $firstInvalid;
          if (this.settings.throttleSubmission && this.formSubmitting) {
            alert('Just a second; form is already submitting.');
            return false;
          } else {
            if (this.validate()) {
              this.formSubmitting = true;
              return true;
            } else {
              if (this.settings.scrollToErrorField) {
                $firstInvalid = this.$form.find('.invalid').eq(0);
                $.scrollTo($firstInvalid, {
                  offset: {
                    top: -45
                  },
                  duration: this.settings.scrollDuration,
                  onAfter: function() {
                    return $firstInvalid.focusin().focus();
                  }
                });
              }
              return false;
            }
          }
        }, this)
      });
    }
  });
  /* 
  jQuery FormValidator plugin
  Use this on any forms that you want to validate.
  */
  $.fn.formValidator = function() {
    return this.each(function() {
      return $(this).data('formvalidator', new FormValidator(this));
    });
  };
  /*
  jQuery FieldValidator plugin
  Use this to add new rules to your validation library
  settings - See "FieldValidator Default Settings". 
  */
  $.fn.fieldValidator = function(settings) {
    return this.each(function() {
      var $this, fieldValidator, validators;
      fieldValidator = new FieldValidator(this, settings);
      $this = $(this);
      validators = $this.data('fieldvalidators') || [];
      validators.push(fieldValidator);
      return $this.data('fieldvalidators', validators).closest('form').data('formvalidator').addFieldValidator(fieldValidator);
    });
  };
  /*
  Animated Page Scroll jQuery plugin
  This will default to http://flesler.blogspot.com/2007/10/jqueryscrollto.html if included. I've tried to use a subset of the same api.j TODO test jquery.scrollTo compatibility
  */
  if ((_ref = $.scrollTo) == null) {
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
}).call(this);
