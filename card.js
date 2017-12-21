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
		maxWidth: -1,
		maxHeight: -1,
		minWidth: 1,
		minHeight: 1 

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

	createDom: function() {
		var html = this.getHtml();
		this.$el = $(html).attr('data-id', this._id);
		this.updateByGrid();
		
	},

	//从单元格坐标来计算位置大小信息
	updateByGrid: function() {
		var loc = this.calcaulateLoc(),
			size = this.calculateSize();
		$.extend(this,loc, size);
		this.updateLoc();
		this.updateSize();
	},

	update: function(type) {
		if(!type || type == 1) {
			this.updateLoc();
		}
		if(!type || type == 2) {
			this.updateSize();
		}
	},

	updateLoc: function() {
		var toLoc = this.convertLocToRC();
		this.row = toLoc.row;
		this.col = toLoc.col;
		this.$el.css({
			top: this.y,
			left: this.x
		});

	},

	updateSize: function() {
		var toSize = this.convertSizeToRC();
		this.width = toSize.width;
		this.height = toSize.height;
		this.$el.css({
			width: this.w,
			height: this.h
		});
	},

	getHtml: function() {
		return [
			'<div class="drag-card" data-action="drag">',
				'<div class="drag-card-size">',
					'<span class="top size-btn" data-direct="1" data-action="update"></span>',
					'<span class="bottom size-btn" data-direct="2" data-action="update"></span>',
					'<span class="left size-btn" data-direct="3" data-action="update"></span>',
					'<span class="right size-btn" data-direct="4" data-action="update"></span>',
					'<span class="top-left size-btn" data-direct="5" data-action="update"></span>',
					'<span class="top-right size-btn" data-direct="6" data-action="update"></span>',
					'<span class="bottom-left size-btn" data-direct="7" data-action="update"></span>',
					'<span class="bottom-right size-btn" data-direct="8" data-action="update"></span>',
				'</div>',
			'</div>'
		].join('');
	},

	calcaulateLoc: function() {
		return {
			x: this.spacingX + this.col * this.outerWidth,
			y: this.spacingY + this.row * this.outerHeight
		}
	},

	calculateSize: function() {
		return {
			w: this.width * this.outerWidth - this.spacingX,
			h: this.height * this.outerHeight - this.spacingY
		}
	},

	convertLocToRC: function() {
		var row = (this.y - this.spacingY / 2) / this.outerHeight,
			col = (this.x - this.spacingX / 2) / this.outerWidth;
		row = row < 0 ? 0 : Math.floor(row);
		col = col < 0 ? 0 : Math.floor(col);
		col = col > this.cellAmount - this.width ? this.cellAmount - this.width : col;
		return {
			row: row,
			col: col
		}
	},

	convertSizeToRC: function() {
		var width = this.w / this.outerWidth,
			height = this.h / this.outerHeight;
		width = width < 1 ? 1 : Math.ceil(width);
		height = height < 1 ? 1 : Math.ceil(height);
		return {
			width: width,
			height: height
		}
	},

	getId: function() {
		return this._id;
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