$.scrollTo = function(selector,settings){
	settings = $.extend({
		offsetY:0, 
		callback:$.noop(),
		speed: 0
	},settings);
	var pos = $(selector).offset();
	$('html,body').animate({ scrollTop: pos.top + settings.offset}, settings.speed, 'swing',settings.callback);
};