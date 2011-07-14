(function() {
  /* Field Validator */  var FieldValidator, FormValidator;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  FieldValidator = function(field, settings) {
    this.settings = $.extend({
      position: 'after',
      message: 'There is an error with this field',
      validateOn: null,
      revalidateOn: null,
      messageClass: ''
    }, settings);
    if (this.settings.validator) {
      this.validator = this.settings.validator;
    }
    this.field = field;
    this.$field = $(field);
    this.$errorMessage = $('<em/>', {
      'class': 'fieldError ' + this.settings.messageClass,
      'html': this.settings.message
    });
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
        this.$field.addClass('invalid');
      } else {
        this.$errorMessage.removeClass('fieldErrorOn');
        this.$field.addClass('valid');
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
      skipToErrorField: true
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
              if (this.settings.skipToErrorField) {
                $firstInvalid = $('.invalid').eq(0);
                $.scrollTo($firstInvalid, {
                  offsetY: -10,
                  speed: 100,
                  callback: function() {
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
}).call(this);
