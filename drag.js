/**
 * 拖拽组件
 */

function Drag(opts) {
	$.extend(this, {
		//layout
		status: 'show',

		//grid
		bgColor: '', //单元格北京颜色
		cellAmount: 4, //单元格的数量
		cellWidth:  0, //单元格的宽度
		cellHeight: 0, //单元格的高度
		spacingX: 0, //网格横向间距
		spacingY: 0, //网格纵向间距
		isWidthEqualHeight: false, //是否宽度等于高度
		isHeightEqualWidth: false //是否高度等于宽度

	}, opts);
	this.init();
}

Drag.prototype = {

	init: function() {
		this.$el = $(this.el);
		this.el = this.$el[0];
		this.cards = {};
		this.mousedown = {};
		this.mousedownCard = {};
		this.dragging = false;
		this.updating = false;
		this.dragCard = null;
		this.$grid = $('.grid', this.$el);
		this.$layout = $('.layout', this.$el);
		this.createGrid();
		this.createCore();
		this.bindEvent();
	},

	createGrid: function() {
		var grid = new Grid({
			el: this.$grid,
			cellAmount: this.cellAmount,
			cellWidth: this.cellWidth,
			cellHeight: this.cellHeight,
			spacingX: this.spacingX,
			spacingY: this.spacingY,
			bgColor: this.bgColor,
			isWidthEqualHeight: this.isWidthEqualHeight,
			isHeightEqualWidth: this.isHeightEqualWidth
		});
		this.grid = grid;
	},

	createCore: function() {
		var core = new Core({
			cellAmount: this.cellAmount,
			cards: this.cards
		});
		this.core = core;
	},

	bindEvent: function() {
		var self = this;
		this.events = {
			'mousedown': 'onMousedown',
			'mouseup': 'onMouseup',
			'mousemove': 'onMousemove'
		};
		Object.keys(this.events).forEach(function(item) {
			self.$el.on(item, function(e) {
				e.stopPropagation();
				self[self.events[item]](e);
			});
		});
	},

	add: function(list, isNew) {
		var self = this,
			core = this.core,
			cards = this.cards,
			size = this.grid.getSize(),
			docfrag = document.createDocumentFragment();
		if(Object.prototype.toString.call(list).indexOf('Object') > -1) {
			list = [list];
		}
		list.forEach(function(item) {
			var opt, loc, card;
			loc = isNew ? core.getBestLoc(item.width, item.height) : {};
			opt = $.extend({
				spacingX: self.spacingX,
				spacingY: self.spacingY,
				cellWidth: size.cellWidth,
				cellHeight: size.cellHeight,
				cellAmount: self.cellAmount
			}, item, loc);
			card = new Card(opt);
			opt.id = card.getId();
			cards[opt.id] = card;
			core.add(opt);
			docfrag.appendChild(card.$el[0]);
		});

		this.$layout[0].appendChild(docfrag);
	},

	onMousedown: function(e) {
		var $target = $(e.target),
			action = $target.data('action'),
			$card;
		this.dragging = action == 'drag';
		this.updating = action == 'update' && +$target.data('direct');
		if(!(this.dragging || this.updating)) {
			return;
		}
		this.saveDragstartData(e);
		$card = this.dragCard.$el;
		if(this.dragging) {
			$card.addClass('opacity-5');
		}
	},

	saveDragstartData: function(e) {
		var loc = this.distanceToLayout(e.clientX, e.clientY);
		this.dragCard = this.cards[$(e.target).closest('.drag-card').attr('data-id')];
		this.mousedown = {
			x: loc.x,
			y: loc.y
		};
		this.mousedownCard = {
			x: this.dragCard.x,
			y: this.dragCard.y,
			w: this.dragCard.w,
			h: this.dragCard.h
		};
	},

	onMousemove: function(e) {
		if(this.dragging) {
			this.onDragLocation(e);
		}
		if(this.updating) {
			this.onUpdateSize(e);
		}
	},

	onDragLocation: function(e) {
		var loc = this.distanceToLayout(e.clientX, e.clientY),
			delx = loc.x - this.mousedown.x,
			dely = loc.y - this.mousedown.y,
			x = this.mousedownCard.x + delx,
			y = this.mousedownCard.y + dely;
		this.dragCard.x = x;
		this.dragCard.y = y;
		this.dragCard.updateLoc();
		this.core.setLocation({
			row: this.dragCard.row,
			col: this.dragCard.col,
			width: this.dragCard.width,
			height: this.dragCard.height,
			id: this.dragCard.getId()
		});
	},

	onUpdateSize: function(e) {
		var loc = this.distanceToLayout(e.clientX, e.clientY),
			delx = loc.x - this.mousedown.x,
			dely = loc.y - this.mousedown.y,
			a = [4,6,8].indexOf(this.updating) > -1 ? 1 : [3,5,7].indexOf(this.updating) > -1 ? -1 : 0,
			b = [2,7,8].indexOf(this.updating) > -1 ? 1 : [1,5,6].indexOf(this.updating) > -1 ? -1 : 0,
			c = [3,5,7].indexOf(this.updating) > -1 ? 1 : 0,
			d = [1,5,6].indexOf(this.updating) > -1 ? 1 : 0;

		this.dragCard.x = this.mousedownCard.x + delx * c;
		this.dragCard.y = this.mousedownCard.y + dely * d;
		this.dragCard.w = this.mousedownCard.w + delx * a;
		this.dragCard.h = this.mousedownCard.h + dely * b;
		this.dragCard.update();
	},

	onMouseup: function(e) {
		if(!(this.dragging || this.updating)) {
			return;
		}
		if(this.dragCard) {
			this.dragCard.$el.removeClass('opacity-5')
		}
		this.dragCard.updateByGrid();
		this.dragging = false;
		this.updating = false;
		this.dragCard = null;
		this.mousedown = {};
		this.mousedownCard = {};
	},

	distanceToLayout: function(x, y) {
		var bbox = this.el.getBoundingClientRect();
		return {
			x: x - bbox.left,
			y: y - bbox.top
		}
	}
}