### Field Validator ###
FieldValidator = (field,settings)->
	@settings = $.extend 
		position: 'after' #sting matching a jquey positioning method or a function to be called
		message: 'There is an error with this field'
		validateOn: null #list of space separated events to validate on
		revalidateOn: null #these will only cause validate() if there is already an error on the field
		messageClass: ''#extra class added to message for css needs
		messageTag: '<em class="fieldError"/>' #If you need to use a div or a ul for some reason
	, settings
	@validator = @settings.validator if @settings.validator
	@field = field
	@$field = $ field
	@$errorMessage = $(@settings.messageTag)
		.html(@settings.message)
		.data('fvField', @$field)
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
		else
			#hide Invalid Message
			@$errorMessage.removeClass 'fieldErrorOn'
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
		scrollToErrorField: true
		scrollDuration: 100
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
						if @settings.scrollToErrorField
							$firstInvalid = $('.fieldErrorOn').eq(0).data('fvField')
							$.scrollTo $firstInvalid, 
								offset: {top: -10}
								duration: @settings.scrollDuration
								onAfter: ->
									$firstInvalid.focus() #do I want to drill down to first focusable element if this isn't?
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


###
This will default to http://flesler.blogspot.com/2007/10/jqueryscrollto.html if included. I've tried to use a subset of the same api.
###
$.scrollTo ?= (selector,settings)->
	settings = $.extend
		offset: {top:0}, 
		onAfter: $.noop(),
		duration: 0
	,settings
	pos = $(selector).offset()
	$('html,body').animate {
		scrollTop: pos.top + settings.offset.top
	}
	, settings.duration
	, 'swing'
	, settings.onAfter