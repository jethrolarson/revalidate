### Field Validator ###
FieldValidator = (field,settings)->
	@settings = $.extend 
		position: 'after' #sting matching a jquey positioning method or a function to be called
		message: 'There is an error with this field'
		validateOn: null #list of space separated events to validate on
		revalidateOn: null #these will only cause validate() if there is already an error on the field
	, settings
	@validator = @settings.validator if @settings.validator
	@field = field
	@$field = $ field
	@$errorMessage = $ '<em/>',
		'class':'fieldError'
		'html': @settings.message
	if typeof @settings.position is 'string'
		@$field[@settings.position] @$errorMessage
	else
		@settings.position.call @field, @
	@bindEvents()
	@
FieldValidator.prototype = $.extend FieldValidator.prototype,
	valid: true
	validate: ->
		@check()
		if not @valid
			#show Invalid Message
			@$errorMessage.addClass 'fieldErrorOn'
			@$field.addClass 'invalid'
		else
			#hide Invalid Message
			@$errorMessage.removeClass 'fieldErrorOn'
			@$field.addClass 'valid'
		@valid
	check: -> @valid = @field.disabled or @validator.call @field, @
	validator: -> !!this.value 
	bindEvents: ->
		@settings.validateOn and @$field.bind @settings.validateOn, => 
			@validate()
			true
		@settings.revalidateOn and @$field.bind @settings.revalidateOn, => 
			not @valid and @validate()
			true
			

### Form Validation Constructor ###
FormValidator = (form, settings)->
	@settings = $.extend 
		showSummary: true
		summaryText: 'There were 1 or more errors on the form, check your input and try again.'
		skipToErrorField: true
	,settings
	@form = form
	@$form = $ form
	if @settings.showSummary
		@$submit = @$form.find ':submit:last'
		@$summary = $('<div/>', class: 'formSummary', text: @settings.summaryText).hide().insertAfter @$submit
	@bindEvents()
	@
FormValidator.prototype = $.extend FormValidator.prototype,
	addFieldValidator: (fv)->
		@fieldValidators.push fv
		@
	valid: false
	formSubmitting: false
	fieldValidators:[]
	validate: ->
		@valid = true
		for field in @fieldValidators
			if not field.validate()
				@valid = false 
		@valid
	bindEvents: ->
		@$form.bind
			submit: =>
				if @formSubmitting
					#should there be a timeout in case of error?
					alert 'Just a second; form is already submitting.'
					return false
				else
					if @validate()
						@formSubmitting = true
						alert 'submiting'
						return true
					else
						if @settings.skipToErrorField
							$firstInvalid = $('.invalid').eq(0)
							$.scrollTo $firstInvalid, offsetY: -10
							$firstInvalid.focus()
						if @settings.showSummary
							@$summary.show()
						return false

### jQuery pluginize ###
$.fn.formValidator = -> #TODO add settings
	@each ->
		#dual binding ftw
		$(this).data 'formvalidator', new FormValidator @
		
$.fn.fieldValidator = (settings)->
	@each ->
		fieldValidator = new FieldValidator @, settings
		$(this).data('fieldvalidator', fieldValidator)
			.closest('form').data('formvalidator').addFieldValidator fieldValidator
		