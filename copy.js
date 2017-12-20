function Copy(opts) {
	$.extend(this, {
		
	}, opts);
	this.init();
}

Copy.prototype = {

	init: function() {
		var html = [
			'<div class="drag-card-copy">',
			'</div>'
		].join('');
		this.$el = $(html);
		this.el = this.$el[0];
	},

	updateLoc: function() {

	},

	destroy: function() {

	}

};