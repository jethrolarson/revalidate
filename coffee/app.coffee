$ ->
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
		message: 'You must not agree'
		
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
		message: 'Please date format: MM/DD/YYYY'
	@
