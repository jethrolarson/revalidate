(function() {
  $(function() {
    $('form').formValidator();
    $(':text.required').fieldValidator({
      validator: function() {
        return $.trim(this.value).length;
      },
      revalidateOn: 'blur keyup',
      message: 'This field is Required'
    });
    $(':checkbox.required').fieldValidator({
      validator: function() {
        return this.checked;
      },
      position: function(fv) {
        return fv.$field.parent().append(fv.$errorMessage);
      },
      revalidateOn: 'click',
      message: 'You must not agree'
    });
    $('.radGroup.required').fieldValidator({
      validator: function(fv) {
        return fv.$field.find(':checked').length;
      },
      revalidateOn: 'click',
      position: 'after',
      message: 'Please choose one'
    });
    $('select.required').fieldValidator({
      validator: function() {
        return this.selectedIndex > 0;
      }
    });
    $('.date').fieldValidator({
      validator: function() {
        return !this.value.length || /\d{1,2}\/\d{1,2}\/\d{4}/.test(this.value);
      },
      validateOn: 'blur',
      message: 'Please date format: MM/DD/YYYY'
    });
    return this;
  });
}).call(this);
