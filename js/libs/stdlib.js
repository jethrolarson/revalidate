$.scrollTo = function(selector,settings){
	settings = $.extend({offsetY:0},settings);
	var pos = $(selector).offset();
	window.scrollTo(pos.left,pos.top+settings.offsetY);
};