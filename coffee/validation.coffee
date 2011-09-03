#coffee -o js/compiled --watch coffee/
###
Revalidate - Validation framework for jQuery
License: MIT, GPL, or WTFPL
Author: @JethroLarson
###
$tooltipContent = $ '<div id="validatorTooltipContent"/>'
$tooltip = $('<div id="validatorTooltip"/>').append($tooltipContent).append('<div class="carrotBottom"><div></div></div>').prepend('<div class="carrotTop"><div></div></div>').appendTo 'html'

### 
Field Validator 
This object controlls events related to field validation
###
FieldValidator = (field,settings)->
	@settings = $.extend(FieldValidator.defaultSettings, settings)
	@validator = @settings.validator if @settings.validator
	@field = field
	@$field = $ field
	@bindEvents()
	@

### FieldValidator Default Settings ###
FieldValidator.defaultSettings = {
	### Error message to display ###
	message: 'There is an error with this field'
	
	### List of space-separated events to validate on. e.g. "blur click mouseenter" ###
	validateOn: '' 
	
	### 
	Same as validateOn except will only validate() if !this.valid. 
	Use case: You might want to immediately remove an error 
	message if a user enters a correct value but not show an error message until 
	they click submit. 
	###
	revalidateOn: '' 
	
	### If true then validation will be skipped on hidden fields ###
	ignoreHidden: true 
	
	### Default validator; just does a falsy check on the value ###
	validator: -> !!this.value 
}
FieldValidator.prototype = $.extend FieldValidator.prototype,
	valid: true
	disabled: false
	### verifies that the field is valid and shows validation messages if necessary ###
	validate: ->
		@check()
		fieldValid = true
		#check if any validators attached to this element are not @valid
		for fv in @$field.data('fieldvalidators')
			fieldValid = false if not fv.valid
		@$field.toggleClass 'invalid', not fieldValid
		
		if not @valid
			#set error message
			@$field.attr 'aria-label', @settings.message
			
		else
			#! remove error message
			@$field.removeAttr 'aria-label'
			@$field.trigger 'valid'
		
		@valid

	### checks, sets, and returns this.valid ###
	check: ->
		if @disabled or @settings.ignoreHidden and @$field.is(':hidden')
			return @valid = true 
		return @valid = @field.disabled or @validator.call(@field, @)

	### Binds events to this.$field ###
	bindEvents: ->
		@$field.bind {
			validate: =>
				@validate()
				true
			#show message
			focusin: =>
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
			'focusout valid': =>
				$tooltip.hide()
		}		
		@settings.validateOn and @$field.bind(@settings.validateOn, => 
			@validate()
			true
		)
		@settings.revalidateOn and @$field.bind(@settings.revalidateOn, => 
			not @valid and @validate()
			true
		)

### Form Validation Constructor ###
FormValidator = (form, settings)->
	@settings = $.extend
		scrollToErrorField: true
		scrollDuration: 100
		
		### Prevents submitting the form multiple times if a request has already been sent ###
		throttleSubmission: true
	, settings
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

### 
jQuery FormValidator plugin
Use this on any forms that you want to validate.
###
$.fn.formValidator = -> 
	@each ->
		#dual binding ftw
		$(this).data 'formvalidator', new FormValidator @

###
jQuery FieldValidator plugin
Use this to add new rules to your validation library
settings - See "FieldValidator Default Settings". 
### 
$.fn.fieldValidator = (settings)->
	@each ->
		fieldValidator = new FieldValidator @, settings
		$this = $(this)
		validators = $this.data('fieldvalidators') or []
		validators.push fieldValidator
		$this.data('fieldvalidators', validators)
			.closest('form').data('formvalidator').addFieldValidator fieldValidator


###
Animated Page Scroll jQuery plugin
This will default to http://flesler.blogspot.com/2007/10/jqueryscrollto.html if included. I've tried to use a subset of the same api.
###
$.scrollTo ?= (selector,settings)->
	settings = $.extend
		offset: {top:0}, 
		onAfter: $.noop(),
		duration: 0
	,settings
	pos = $(selector).offset()
	$('html,body').animate(
		{
			scrollTop: pos.top + settings.offset.top
		}
		, settings.duration
		, 'swing'
		, settings.onAfter
	)