//Validator Library
//==========================
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
	
	$(function() {
		window.formValidator = new FormValidator('form.validate');
		
		//Field Validator Definitions
		formValidator.addFieldValidator('input[type=text].required, textarea.required, input[type=password].required',{
			validator: function() {
				var val = $(this).val();
				return $.trim(val).length;
			},
			validateOn: 'blur keyup',
			message: 'Required'
		});
		// Required Checkbox
		formValidator.addFieldValidator('.cb.required',{
			validator: function() {
				return $(this).find(":checked").length;
			},
			revalidateOn: 'click',
			message: 'Required'
		});
		//Group of radio buttons, one must be selected.
		formValidator.addFieldValidator('.radGroup.required',{
			validator: function() {
				return $(this).find(':checked').length;
			},
			revalidateOn: 'click',
			message: 'Please choose one'
		});
		// Required dropdown must not be set to the first item in the list.
		formValidator.addFieldValidator('select.required',{
			validator: function() {
				return this.selectedIndex > 0;
			},
			message: 'Please choose one',
			revalidateOn: 'change'
		});
		// Input must be a positive integer.
		formValidator.addFieldValidator('input.quantity',{
			validator: function(){
				return isPositiveInteger(this.value);
			},
			message: 'Invalid quantity',
			validateOn: 'blur'
		});
		//input must contain an email. Required. 
		formValidator.addFieldValidator('input.email',{
			validator: function(){
				return isEmail(this.value); // TODO make this optional
			},
			message: 'Invalid email',
			revalidateOn: 'blur keyup input'
		});
		//Phone number. Assumes that it's optional. You can add a required validator to the field if desired.
		formValidator.addFieldValidator('input.phone',{
			validator: function(){
				return $.trim(this.value)=="" || isPhoneNumber(this.value);
			},
			message: 'Invalid phone',
			revalidateOn: 'blur keyup input'
		});
		//Postal code. Can be Canadian or US. 
		//Does not validate against our db so anything that fulfills the "a1a 1a1" or "99999" or "99999-9999" pattern is valid
		formValidator.addFieldValidator('input.postalCode',{
			validator: function(){
				return $.trim(this.value) === '' || isPostalCode(this.value);
			},
			message: 'Invalid ZIP/Postal Code',
			revalidateOn: 'keyup'
		});
		//positive integer
		formValidator.addFieldValidator('input.positiveInt',{
			validator: function(){
				return isPositiveInteger(this.value);
			},
			message: 'Invalid number',
			revalidateOn: 'keyup'
		});
		//cvv or card security code must be 3 or 4 digit positive integer.
		formValidator.addFieldValidator('input.securityCode',{
			validator: function(){
				//Could check to see if it's the proper length
				return isPositiveInteger(this.value) && this.value < 10000;
			},
			message: 'Invalid security code',
			validateOn: 'blur'
		});
		//Email matches - see matchesValidator()
		formValidator.addFieldValidator('.emailMatches',{
			validator: matchesValidator,
			message: 'Email does not match',
			revalidateOn: 'blur'
		});
		//Password matches- see matchesValidator()
		formValidator.addFieldValidator('.passwordMatches',{
			validator: matchesValidator,
			message: 'Password does not match',
			revalidateOn: 'blur'
		});
		//if target radio or select box is checked then this field must not be ""
		formValidator.addFieldValidator('.requiredIfTargetChecked',{
			validator: function (){
				var t = $($(this).data('target'))[0];
				return !t.checked || $.trim(this.value) !== '';
			},
			message: 'Required',
			revalidateOn: 'keyup'
		});
		
		// Hack for integrating server-side errors
		$('.validate [data-error]').each(function(){
			formValidator.addFieldValidator(this.selector,{
				validator: function(){
					var hasError = $(this).attr('data-error');
					$(this).removeAttr('data-error').die('init');
					return !hasError;
				},
				validateOn: 'init',
				revalidateOn: '',
				message: $(this).data('error')
			});
		});
	});