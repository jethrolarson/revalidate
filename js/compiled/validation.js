(function() {
  var $tooltip, $tooltipContent, FieldValidator, FormValidator, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $tooltipContent = $('<div id="validatorTooltipContent"/>');
  $tooltip = $('<div id="validatorTooltip"/>').append($tooltipContent).append('<div class="carrotBottom"><div></div></div>').prepend('<div class="carrotTop"><div></div></div>').appendTo('html');
  FieldValidator = function(field, settings) {
    this.settings = $.extend({
      message: 'There is an error with this field',
      validateOn: '',
      revalidateOn: '',
      ignoreHidden: true,
      validator: function(fv) {
        return !!this.value;
      },
      showMessageOn: 'focusin',
      hideMessageOn: 'blur'
    }, settings);
    if (this.settings.validator) {
      this.validator = this.settings.validator;
    }
    this.field = field;
    this.$field = $(field);
    this.bindEvents();
    return this;
  };
  FieldValidator.prototype = $.extend(FieldValidator.prototype, {
    valid: true,
    disabled: false,
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
    check: function() {
      if (this.disabled || this.field.disabled || (this.settings.ignoreHidden && this.$field.is(':hidden'))) {
        return this.valid = true;
      }
      return this.valid = this.validator.call(this.field, this);
    },
    showMessage: function() {
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
    },
    bindEvents: function() {
      return this.$field.bind('validate', __bind(function() {
        return this.validate();
      }, this)).bind(this.settings.showMessageOn, __bind(function() {
        this.showMessage();
        return true;
      }, this)).bind(this.settings.hideMessageOn + ' valid', __bind(function() {
        $tooltip.hide();
        return true;
      }, this)).bind(this.settings.validateOn, __bind(function() {
        this.validate();
        return true;
      }, this)).bind(this.settings.revalidateOn, __bind(function() {
        !this.valid && this.validate();
        return true;
      }, this));
    }
  });
  FormValidator = function(form, settings) {
    this.settings = $.extend({
      scrollToErrorField: true,
      scrollDuration: 100,
      throttleSubmission: true
    }, settings);
    this.fieldValidators = [];
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
    disabled: false,
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
          if (this.disabled) {
            return true;
          }
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
  $.fn.formValidator = function() {
    return this.each(function() {
      return $(this).data('formvalidator', new FormValidator(this));
    });
  };
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
