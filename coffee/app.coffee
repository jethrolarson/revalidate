$ ->
  #Attach FormValidator to an element
	$('form').formValidator()

	$(':text.required').fieldValidator
		validator: ->  $.trim this.value
		revalidateOn: 'blur keyup'
		message: 'This field is Required'

	$('.cb.required').fieldValidator
		validator: -> $(this).find(':checked').length
		revalidateOn: 'click'
		message: 'You must agree'
		
	$('.radGroup.required').fieldValidator
		validator: (fv)-> fv.$field.find(':checked').length
		revalidateOn: 'click'
		message: 'Please choose one'
		
	$('select.required').fieldValidator
		validator: -> @selectedIndex > 0

	### mm/dd/yyyy ###
	$('.date').fieldValidator
		validator: ->
			not @value.length or /\d{1,2}\/\d{1,2}\/\d{4}/.test @value
		validateOn: 'blur'
		revalidateOn: 'keyup'
		message: 'Invalid date. Use MM/DD/YYYY'
	
	$('.matches').fieldValidator
		validator: ->
			this.value == $($(this).data 'data-target')
		validateOn: 'blur'
		revalidateOn: 'keyup'
		message: "Doesn't match related field"

	$('#ridiculous').fieldValidator
		validator: (fv)->
			valid = false
			for input in fv.$field.find('input')
				val = +input.value
				valid = true if val > 5
			valid
		revalidateOn: 'focusout'
		message: "you didn't do the thing"
	@