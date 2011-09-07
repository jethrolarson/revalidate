# Revalidate
# ================
# Validation framework for jQuery
# -------------------------------
# License: MIT, GPL, or WTFPL  
# Author: [@JethroLarson](http://twitter.com/jethrolarson)

# ### Error Tooltip HTML. 
# We only need one because only one message is shown at a time.
$tooltipContent = $ '<div id="validatorTooltipContent"/>'
$tooltip = $('<div id="validatorTooltip"/>').append($tooltipContent).append('<div class="carrotBottom"><div></div></div>').prepend('<div class="carrotTop"><div></div></div>').appendTo 'html'

# Field Validator Constructor
# -------------------------------
# This object controlls events related to field validation
FieldValidator = (field, settings)->
	# ### FieldValidator Default Settings
	@settings = $.extend({
		# Error message to display
		message: 'There is an error with this field'

		# List of space-separated events to validate on. e.g. "blur click mouseenter"
		validateOn: '' 

		# Same as validateOn except will only validate if the field is already in error. 
		# Use case: You might want to immediately remove an error 
		# message if a user enters a correct value but not show an error message until 
		# they click submit. 
		revalidateOn: '' 

		# If true then validation will be skipped on hidden fields
		ignoreHidden: true 

		# ###Default validator: does a falsy check on the value
		# `this` is the element
		# `fv` is the fieldValidator instance
		validator: (fv)-> 
			!!this.value
		
		# List of events to show the validation method on (editing this is not recommended)
		showMessageOn: 'focusin'
		hideMessageOn: 'blur'
	}, settings)
	@validator = @settings.validator if @settings.validator
	@field = field
	@$field = $ field
	@bindEvents()
	@

FieldValidator.prototype = $.extend FieldValidator.prototype,
	valid: true
	disabled: false
	# Calls @check and sets the error classes and prepares any error messages
	validate: ->
		@check()
		fieldValid = true
		# check if any validators attached to this element are not @valid
		for fv in @$field.data('fieldvalidators')
			fieldValid = false if not fv.valid
		@$field.toggleClass 'invalid', not fieldValid
		
		if not @valid
			# set error message
			@$field.attr 'aria-label', @settings.message
			
		else
			# remove error message
			@$field.removeAttr 'aria-label'
			@$field.trigger 'valid'
		
		@valid

	# checks, sets, and returns this.valid
	check: ->
		# Assumes disabled or hidden fields are valid
		if @disabled or @field.disabled or (@settings.ignoreHidden and @$field.is(':hidden'))
			return @valid = true 
		# Calls validator
		return @valid =  @validator.call(@field, @)
	
	# Displays the fieldValidator tooltip
	showMessage: ->
		if not @valid
			$tooltipContent.html @settings.message 
			#TODO - take into consideration the body position:relative problem
			#position the tooltip
			pos = @$field.offset()
			$tooltip.show()
			h = $tooltip.outerHeight()
			#if it would be offscreen put it below
			if pos.top - h < window.scrollY
				$tooltip.addClass 'bottom'
				pos.top += @$field.outerHeight()
			else #else on top of field
				$tooltip.removeClass 'bottom'
				pos.top -= h
			$tooltip.css pos

	# Binds events to this.$field
	bindEvents: ->
		# Firing a "validate" event on the element calls the fieldValidator's validate method. 
		@$field.bind('validate', => 
			@validate()
		).bind(@settings.showMessageOn, =>
			@showMessage()
			true
		).bind(@settings.hideMessageOn+' valid', =>
			$tooltip.hide()
			true
		).bind(@settings.validateOn, => 
			@validate()
			true
		).bind(@settings.revalidateOn, => 
			not @valid and @validate()
			true
		)

# Form Validation Constructor
# -------------------------------
FormValidator = (form, settings)->
	# ### FormValidator Default Settings
	@settings = $.extend({
		scrollToErrorField: true
		# How long the error animated scroll takes, 0 is instant
		scrollDuration: 100

		# Prevents submitting the form multiple times if a request has already been sent
		throttleSubmission: true
	}, settings)
	@fieldValidators = []
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
	# Can toggle this property to disable validation
	disabled: false
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
				# Skip validation if formValidator is disabled
				if @disabled
					return true
				if @settings.throttleSubmission and @formSubmitting
					#should there be a timeout in case of error?
					alert 'Just a second; form is already submitting.'
					return false
				else
					if @validate()
						@formSubmitting = true
						return true
					else
						if @settings.scrollToErrorField
							$firstInvalid = @$form.find('.invalid').eq(0)
							$.scrollTo $firstInvalid, 
								offset: {top: -45}
								duration: @settings.scrollDuration
								onAfter: ->
									$firstInvalid.focusin().focus() #do I want to drill down to first focusable element if this isn't?
						return false

# jQuery Plugins
# ==============

# jQuery FormValidator plugin
# ---------------------------
# Use this on any forms that you want to validate.
# See [FormValidator Default Settings](#section-4)
$.fn.formValidator = -> 
	@each ->
		# FormValidator Instance is stored in jquery data
		$(this).data 'formvalidator', new FormValidator @


# jQuery FieldValidator plugin
# ----------------------------
# Use this to add new rules to your validation library
# Selector determines the element used for validator and placement of error message.
# settings - See [FieldValidator Default Settings](#section-23). 
$.fn.fieldValidator = (settings)->
	@each ->
		fieldValidator = new FieldValidator @, settings
		$this = $(this)
		validators = $this.data('fieldvalidators') or []
		validators.push fieldValidator
		$this.data('fieldvalidators', validators)
			.closest('form').data('formvalidator').addFieldValidator fieldValidator


# Animated Page Scroll jQuery plugin
# -------------------------------------
# This will default to 
# [Ariel's scrollTo Plugin](http://flesler.blogspot.com/2007/10/jqueryscrollto.html) 
# if included. I've tried to use a subset of the same api.j 
# TODO test jquery.scrollTo compatibility
$.scrollTo ?= (selector,settings)->
	settings = $.extend
		offset: {top:0}, 
		onAfter: $.noop(),
		duration: 0
	,settings
	pos = $(selector).offset()
	$('html,body').animate({
			scrollTop: pos.top + settings.offset.top
		},{
			duration: settings.duration
			complete: settings.onAfter
		}
	)