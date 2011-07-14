(function() {
  /* Field Validator */  var FieldValidator, FormValidator, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  FieldValidator = function(field, settings) {
    this.settings = $.extend({
      position: 'after',
      message: 'There is an error with this field',
      validateOn: null,
      revalidateOn: null,
      messageClass: '',
      messageTag: '<em class="fieldError"/>'
    }, settings);
    if (this.settings.validator) {
      this.validator = this.settings.validator;
    }
    this.field = field;
    this.$field = $(field);
    this.$errorMessage = $(this.settings.messageTag).html(this.settings.message).data('fvField', this.$field);
    if (typeof this.settings.position === 'string') {
      this.$field[this.settings.position](this.$errorMessage);
    } else {
      this.settings.position.call(this.field, this);
    }
    this.bindEvents();
    return this;
  };
  FieldValidator.prototype = $.extend(FieldValidator.prototype, {
    valid: true,
    validate: function() {
      this.check();
      if (!this.valid) {
        this.$errorMessage.addClass('fieldErrorOn');
      } else {
        this.$errorMessage.removeClass('fieldErrorOn');
      }
      return this.valid;
    },
    check: function() {
      return this.valid = this.field.disabled || this.validator.call(this.field, this);
    },
    validator: function() {
      return !!this.value;
    },
    bindEvents: function() {
      this.$field.bind('validate', __bind(function() {
        this.validate();
        return true;
      }, this));
      this.settings.validateOn && this.$field.bind(this.settings.validateOn, __bind(function() {
        this.$field.trigger('validate');
        return true;
      }, this));
      return this.settings.revalidateOn && this.$field.bind(this.settings.revalidateOn, __bind(function() {
        !this.valid && this.$field.trigger('validate');
        return true;
      }, this));
    }
  });
  /* Form Validation Constructor */
  FormValidator = function(form, settings) {
    this.settings = $.extend({
      scrollToErrorField: true,
      scrollDuration: 100
    }, settings);
    this.form = form;
    this.$form = $(form);
    this.bindEvents();
    return this;
  };
  FormValidator.prototype = $.extend(FormValidator.prototype, {
    addFieldValidator: function(fv) {
      this.fieldValidators.push(fv);
      return this;
    },
    valid: false,
    formSubmitting: false,
    fieldValidators: [],
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
          if (this.formSubmitting) {
            alert('Just a second; form is already submitting.');
            return false;
          } else {
            if (this.validate()) {
              this.formSubmitting = true;
              alert('submiting');
              return true;
            } else {
              if (this.settings.scrollToErrorField) {
                $firstInvalid = $('.fieldErrorOn').eq(0).data('fvField');
                $.scrollTo($firstInvalid, {
                  offset: {
                    top: -10
                  },
                  duration: this.settings.scrollDuration,
                  onAfter: function() {
                    return $firstInvalid.focus();
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
  /* jQuery pluginize */
  $.fn.formValidator = function() {
    return this.each(function() {
      return $(this).data('formvalidator', new FormValidator(this));
    });
  };
  $.fn.fieldValidator = function(settings) {
    return this.each(function() {
      var fieldValidator;
      fieldValidator = new FieldValidator(this, settings);
      return $(this).data('fieldvalidator', fieldValidator).closest('form').data('formvalidator').addFieldValidator(fieldValidator);
    });
  };
  /*
  This will default to http://flesler.blogspot.com/2007/10/jqueryscrollto.html if included. I've tried to use a subset of the same api.
  */
    if ((_ref = $.scrollTo) != null) {
    _ref;
  } else {
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
      }, settings.duration, 'swing', settings.onAfter);
    };
  };
}).call(this);
