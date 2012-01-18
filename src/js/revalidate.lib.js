
// Validator Library for jQuery Revalidate
//========================================
// Feel free to add/remove these as needed for your application
(function($){
	function isDate(val){
		// mm/dd/yyyy or m/d/yyyy
		return (/\d{1,2}\/\d{1,2}\/\d{4}/).test(val);
	}
	function isTime(val){
		return (/[0-9]{1,2}:[0-9]{2} [apm]{2}/i).test(val);
	}
	function isPositiveInteger(val){
		return (/^\d+$/).test(val) && +val >= 0;
	}

	function isEmail(val){
		return (/^['_a-z\d-]+(\.[_a-z\d-]+)*@[a-z\d-]+(\.[a-z\d-]+)*\.(([a-z]{2,3})|(aero|coop|info|museum|name))$/i).test(val);
	}

	function isPhoneNumber(val){
		//copied from checkout/validate.cfc
		//strip spaces and -
		val = val.replace(/[\s\-]*/g,'');
		return (/^1?(?:\d{3})\d{7}(?:(?:x|ext)?\d{1,5})?$/i).test(val);
	}

	//US or Canada postalCode
	//Partially copied from validate.cfc
	function isPostalCode(val){
		return (
			//US ZIP
			(/^\d{5}(?:[\-\s]*\d{4})?$/).test(val)
			//CA postalCode
			|| (/^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i).test(val)
		);
	}

	//this input must match value of targeted input
	function matchesValidator(){
		var t = $($(this).data('target'));
		return this.value === t[0].value;
	}
	
	function isUrl(s) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(s);
	}
	
	//Instantiate form validator
	$('form.validate').formValidator({},{
		'input[type=text].required, textarea.required, input[type=password].required': {
			validator: function() {
				var val = $(this).val();
				return $.trim(val).length;
			},
			revalidateOn: 'blur keyup',
			message: 'Required'
		},
		// Required Checkbox
		'.cb.required':{
			validator: function() {
				return $(this).find(":checked").length;
			},
			revalidateOn: 'click',
			message: 'Required'
		},
		//Group of radio buttons, one must be selected.
		'.radGroup.required':{
			validator: function() {
				return $(this).find(':checked').length;
			},
			revalidateOn: 'click',
			message: 'Please choose one'
		},
		// Required dropdown must not be set to the first item in the list.
		'select.required':{
			validator: function() {
				return this.selectedIndex > 0;
			},
			message: 'Please choose one',
			revalidateOn: 'change'
		},
		// Input must be a positive integer.
		'input.quantity':{
			validator: function(){
				return isPositiveInteger(this.value);
			},
			message: 'Invalid quantity',
			validateOn: 'blur'
		},
		//input must contain an email. Required.
		'input.email':{
			validator: function(){
				return isEmail(this.value); // TODO make this optional
			},
			message: 'Invalid email',
			revalidateOn: 'blur keyup input'
		},
		//input must contain a URL.
		'input.url':{
			validator: function(){
				return $.trim(this.value) === '' || isUrl(this.value);
			},
			message: 'Invalid url',
			revalidateOn: 'blur keyup input'
		},
		//Phone number. Assumes that it's optional. You can add a required validator to the field if desired.
		'input.phone':{
			validator: function(){
				return $.trim(this.value)==='' || isPhoneNumber(this.value);
			},
			message: 'Invalid phone',
			revalidateOn: 'blur keyup input'
		},
		//Postal code. Can be Canadian or US.
		//Does not validate against our db so anything that fulfills the "a1a 1a1" or "99999" or "99999-9999" pattern is valid
		'input.postalCode':{
			validator: function(){
				return $.trim(this.value) === '' || isPostalCode(this.value);
			},
			message: 'Invalid ZIP/Postal Code',
			revalidateOn: 'keyup'
		},
		//positive integer
		'input.positiveInt':{
			validator: function(){
				return isPositiveInteger(this.value);
			},
			message: 'Invalid number',
			revalidateOn: 'keyup'
		},
		//positive dollars.
		'input.dollars':{
			validator: function(){
				//999999.99
				return (/^\d{0,6}\.?\d{0,2}$/).test($.trim(this.value)) && +this.value >= 0;
			},
			message: 'Invalid dollar value',
			revalidateOn: 'keyup'
		},
		//Email matches - see matchesValidator()
		'.emailMatches':{
			validator: matchesValidator,
			message: 'Email does not match',
			revalidateOn: 'blur'
		},
		//Password matches- see matchesValidator()
		'.passwordMatches':{
			validator: matchesValidator,
			message: 'Password does not match',
			revalidateOn: 'blur'
		},
		//if target radio or select box is checked then this field must not be ""
		'.requiredIfTargetChecked':{
			validator: function (){
				var t = $($(this).data('target'))[0];
				return !t.checked || $.trim(this.value) !== '';
			},
			message: 'Required',
			revalidateOn: 'keyup'
		},
		// Date mm/dd/yyyy
		'input.date':{
			validator: function(){
				return $.trim(this.value) === '' || isDate(this.value);
			},
			message: 'Invalid date (mm/dd/yyyy)',
			revalidateOn:'keyup'
		},
		//Time hh:mm pm
		'input.time':{
			validator: function(){
				return $.trim(this.value) === '' || isTime(this.value);
			},
			message: 'Invalid time (hh:mm pm)',
			revalidateOn:'keyup'
		},
		// Hack for integrating server-side errors
		'.validate [data-error]':{
			validator: function(){
				var hasError = $(this).attr('data-error');
				$(this).attr('data-error','').data('serverErrorMessage',hasError).die('init');
				return !hasError;
			},
			validateOn: 'init',
			revalidateOn: 'focusout',
			message: function(){
				return $(this).data('serverErrorMessage');
			}
		}
	});
})(jQuery);
