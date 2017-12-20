/**
 * 网格
 */
function Grid(opts) {
	$.extend(this, {
		el: '',
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

Grid.prototype = {

	init: function() {
		this.$el = $(this.el);
		this._rectsInPattern = [];
		this._svg = null;
		this._rect = null;
		this._pattern = null;
		this.innerWidth = this.cellWidth;
		this.outerWidth = this.cellWidth + this.spacingX;
		this.innerHeight= this.cellHeight;
		this.outerHeight = this.cellHeight + this.spacingY;
		this.createSvg();
		this.updateSize();
		this.$el.get(0).appendChild(this._svg);
	},

	createSvg: function() {
		var svg,
			defs,
			rect,
			pattern;

		this._svg = svg = this.createSvgElement('svg', {
			'xmls': 'http://www.w3.org/2000/svg'
		});
		defs = this.createSvgElement('defs');
		this._pattern = pattern = this.createSvgElement('pattern', {
			'x': 0,
			'y': 0,
			'id': this.getRandomId()
		});
		for(var i = 0; i < this.cellAmount; i++) {
			var p_rect = this.createSvgElement('rect', {
				'fill': this.bgColor
			});
			this._rectsInPattern.push(p_rect);
			pattern.appendChild(p_rect);
		}
		this._rect = rect = this.createSvgElement('rect', {
			'x': 0,
			'y': 0,
			'fill': 'url(#' + this.getRandomId() + ')'
		});
		defs.appendChild(pattern);
		svg.appendChild(defs);
		svg.appendChild(rect);
	},

	updateSize: function() {
		var self = this,
			width = this.$el.width(),
			height = this.$el.height();

		self.outerWidth = Math.floor(width / self.cellAmount);
		self.innerWidth = self.outerWidth - self.spacingX;

		if(self.isHeightEqualWidth) {
			self.innerHeight = self.innerWidth;
			self.outerHeight = self.innerHeight + self.spacingY;
		}

		self.setDomAttribute(self._svg, {
			width: width,
			height: height
		});
		self.setDomAttribute(self._rect, {
			width: width,
			height: height
		});
		self.setDomAttribute(self._pattern, {
			width: 1,
			height: (self.innerHeight + self.spacingY) / height
		});
		self._rectsInPattern.forEach(function(rect, index) {
			self.setDomAttribute(rect, {
				width: self.innerWidth,
				height: self.innerHeight,
				x: self.outerWidth * index + self.spacingX,
				y: self.spacingY
			});
		});
	},

	createSvgElement: function(nodeName, attr) {
		var element = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
		if(attr) {
			this.setDomAttribute(element, attr);
		}
		return element
	},

	setDomAttribute: function(dom, key, value){
		var isRect = dom.nodeName == 'rect',
			isObject = Object.prototype.toString.call(key).slice(8, -1) == 'Object';

		if(isObject) {
			Object.keys(key).forEach(function(v, k) {
				//rect 负值不允许设置
				if(isRect && v < 0) return;
				dom.setAttribute(v, key[v]);
			});
		}else{
			if(isRect && value < 0) return;
			dom.setAttribute(key, value);
		}
	},

	getRandomId: function() {
		var max = 10000;
		if(!this.patternId) {
			this.patternId = 'pattern' + Math.floor(Math.random() * max + 1);
		}
		return this.patternId;
	},

	getSize: function() {
		return {
			cellWidth: this.innerWidth,
			cellHeight: this.innerHeight
		}
	}
}