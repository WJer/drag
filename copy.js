function Copy(opts) {
	$.extend(this, {
		
	}, opts);
	this.init();
}

Copy.prototype = {

	init: function() {
		var html = this.getHtml();
		this.$el = $(html);
		this.el = this.$el[0];
	},

	getHtml: function() {
		return [
			'<div class="drag-card-copy">',
			'</div>'
		].join('')
	},

	updateLoc: function(x, y) {

	},

	destroy: function() {

	}

};