$ ->
  #Attach FormValidator to an element
	$('form').formValidator()

	$(':text.required').fieldValidator 
		validator: -> $.trim(@value).length
		revalidateOn: 'blur keyup'
		message: 'This field is Required'

	$(':checkbox.required').fieldValidator
		validator: -> @checked
		position: (fv)->
			fv.$field.parent().append fv.$errorMessage
		revalidateOn: 'click'
		message: 'You must agree'
		
	$('.radGroup.required').fieldValidator
		validator: (fv)->
			fv.$field.find(':checked').length
		revalidateOn: 'click'
		position: 'after'
		message: 'Please choose one'
		
	$('select.required').fieldValidator
		validator: ->
			@selectedIndex > 0
			
	$('.date').fieldValidator
		validator: ->
			not @value.length or /\d{1,2}\/\d{1,2}\/\d{4}/.test @value
		validateOn: 'blur'
		revalidateOn: 'keyup'
		message: 'Invalid date. Use MM/DD/YYYY'
	
	$('#ridiculous').fieldValidator
		validator: (fv)->
			valid = false
			for input in fv.$field.find('input')
				val = +input.value
				valid = true if val > 5
			valid
		position: 'append'
		revalidateOn: 'focusout'
		message: "you didn't do the thing"
	@