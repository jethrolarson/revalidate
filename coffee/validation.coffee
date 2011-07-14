### Field Validator ###
FieldValidator = (field,settings)->
	@settings = $.extend 
		position: 'after' #sting matching a jquey positioning method or a function to be called
		message: 'There is an error with this field'
		validateOn: null #list of space separated events to validate on
		revalidateOn: null #these will only cause validate() if there is already an error on the field
		messageClass: ''#extra class added to message for css needs
	, settings
	@validator = @settings.validator if @settings.validator
	@field = field
	@$field = $ field
	@$errorMessage = $ '<em/>',
		'class':'fieldError '+@settings.messageClass
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
		@$field.bind 'validate', =>
			@validate()
			true
		@settings.validateOn and @$field.bind @settings.validateOn, => 
			@$field.trigger 'validate'
			true
		@settings.revalidateOn and @$field.bind @settings.revalidateOn, => 
			not @valid and @$field.trigger 'validate'
			true
			

### Form Validation Constructor ###
FormValidator = (form, settings)->
	@settings = $.extend
		skipToErrorField: true
	, settings
	@form = form
	@$form = $ form
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
	checkAll: ->
		@valid = true
		for field in @fieldValidators
			if not field.check()
				@valid = false
				break
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
							$.scrollTo $firstInvalid, 
								offsetY: -10
								speed: 100
								callback: ->
									$firstInvalid.focus()
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
		