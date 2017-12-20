/**
 * 卡片
 */
function Card(opts) {
	$.extend(this, {
		row: 0,
		col: 0,
		x: 0,
		y: 0,

		width: 0,
		height: 0,
		w: 0,
		h: 0,

		toRow: 0,
		toCol: 0

	}, opts);
	this.init();
}

Card.prototype = {

	init: function() {
		if(!this._id) {
			this._id = Card.getRandomId();
		}
		this.outerWidth = (this.cellWidth + this.spacingX);
		this.outerHeight = (this.cellHeight + this.spacingY);
		this.createDom();
	},

	getId: function() {
		return this._id;
	},

	createDom: function() {
		var width = this.width * this.outerWidth - this.spacingX,
			height = this.height * this.outerHeight - this.spacingY,
			x = this.spacingX + this.col * this.outerWidth,
			y = this.spacingY + this.row * this.outerHeight;

		this.$el = $(this.getHtml()).attr('data-id', this._id);
		this.updateLoc(x, y);
		this.updateSize(width, height);
	},

	getHtml: function() {
		return [
			'<div class="drag-card">',
				'<div class="drag-card-size">',
					'<span class="top size-btn" data-direct="1"></span>',
					'<span class="bottom size-btn" data-direct="2"></span>',
					'<span class="left size-btn" data-direct="3"></span>',
					'<span class="right size-btn" data-direct="4"></span>',
					'<span class="top-left size-btn" data-direct="5"></span>',
					'<span class="top-right size-btn" data-direct="6"></span>',
					'<span class="bottom-left size-btn" data-direct="7"></span>',
					'<span class="bottom-right size-btn" data-direct="8"></span>',
				'</div>',
			'</div>'
		].join('');
	},

	setStatus: function(status) {

	},

	updateLoc: function(x, y) {
		this.x = x;
		this.y = y;
		this.$el.css({
			top: this.y,
			left: this.x
		});
	},

	updateSize: function(w, h) {
		this.w = w;
		this.h = h;
		this.$el.css({
			'width': w,
			'height': h
		});
	}
}

Card.getRandomId = (function() {
	var max = 100,
		cache = {};
	return function() {
		var id;
		while(!id) {
			id = Math.floor(Math.random() * max + 1);
			if(cache[id]) {
				id = '';
			}else{
				cache[id] = true;
			}
		}
		return id;
	}
})();