(function() {
  $(function() {
    $('form').formValidator();
    $(':text.required').fieldValidator({
      validator: function() {
        return $.trim(this.value);
      },
      revalidateOn: 'blur keyup',
      message: 'This field is Required'
    });
    $('.cb.required').fieldValidator({
      validator: function() {
        return $(this).find(':checked').length;
      },
      revalidateOn: 'click',
      message: 'You must agree'
    });
    $('.radGroup.required').fieldValidator({
      validator: function(fv) {
        return fv.$field.find(':checked').length;
      },
      revalidateOn: 'click',
      message: 'Please choose one'
    });
    $('select.required').fieldValidator({
      validator: function() {
        return this.selectedIndex > 0;
      }
    });
    /* mm/dd/yyyy */
    $('.date').fieldValidator({
      validator: function() {
        return !this.value.length || /\d{1,2}\/\d{1,2}\/\d{4}/.test(this.value);
      },
      validateOn: 'blur',
      revalidateOn: 'keyup',
      message: 'Invalid date. Use MM/DD/YYYY'
    });
    $('.matches').fieldValidator({
      validator: function() {
        return this.value === $($(this).data('data-target'));
      },
      validateOn: 'blur',
      revalidateOn: 'keyup',
      message: "Doesn't match related field"
    });
    $('#ridiculous').fieldValidator({
      validator: function(fv) {
        var input, val, valid, _i, _len, _ref;
        valid = false;
        _ref = fv.$field.find('input');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          val = +input.value;
          if (val > 5) {
            valid = true;
          }
        }
        return valid;
      },
      revalidateOn: 'focusout',
      message: "you didn't do the thing"
    });
    return this;
  });
}).call(this);
