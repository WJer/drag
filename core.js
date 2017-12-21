/**
 * 核心控制器
 */

function Core(opts) {
	$.extend(this, {
		cellAmount: 4,
		cards: {}
	}, opts);

	this._locArray = [];
	this._firstNullArray = [];
}

Core.prototype = {

	add: function(data) {
		if(!data.id) {
			throw new Error('请为卡片设置id');
		}
		this.setLocation(data);
		this.updateFirstNullArray();
	},

	//分配位置
	allot: function(move) {
		this.setLocation({
			row: move.row,
			col: move.col,
			width: move.width,
			height: move.height,
			id: move.id
		});
		move = this.getRuleLoc();

	},

	setLocation: function(data) {
		var self = this,
			array = this._locArray;
		self.iterateArray(
			array,
			data.row,
			data.row + data.height,
			undefined,
			data.col,
			data.col + data.width,
			function(val, i, j) {
				array[i][j] = data.id;
			}
		);
	},

	//获取最佳位置
	getBestLoc: function(width, height) {
		var arr = this._firstNullArray,
			stack = [],
			tempArr = [],
			loc,
			temp,
			delArr,
			result,
			pushStack = function(row, col, len) {
				stack.push({
					col: col,
					row: row,
					len: (len || 0) + 1
				});
			};
		
		for(var i = 0, arr_len = arr.length; i < arr_len; i++) {
			loc = arr[i];
			if(i == 0) {
				pushStack(loc.row, loc.col);
				continue;
			}
			for(var j = 0, st_length = stack.length; j < st_length; j++) {
				temp = stack[j];
				if(loc.row > temp.row) {
					delArr = stack.splice(j);
					tempArr = tempArr.concat(delArr);
					pushStack(loc.row, loc.col - delArr[0].len, delArr[0].len);
					break;
				}else{
					if(loc.row < temp.row && j == st_length - 1) {
						pushStack(loc.row, loc.col);
					}
					temp.len++;
				}
			}
		}
		tempArr = tempArr.concat(stack);

		tempArr.forEach(function(item) {
			if(item.len < width) {
				return;
			}
			if(!result || item.row < result.row) {
				result = item;
			}
		});
		return result || {
			col: 0,
			row: 0,
			len: this.cellAmount
		};
	},

	fill: function() {
		var self = this,
			cards = this.cards,
			card,
			amount;
		this.iterateArray(this._locArray, 0, this._locArray.length, undefined, 0, this.cellAmount, function(id) {
			if(!id) {
				return;
			}
			card = cards[id];
			amount = self.getAboveEmptyLine(card);
			if(amount > 0) {
				self.setLocation(card, 0);
				card.row -= amount;
				self.setLocation(card, card.id);
			}
		});
	},

	getAboveEmptyLine: function(data) {
		var count = 0,
			i = 0,
			arr = this._locArray,
			isExit = data.row == 0 ? true : false;
		
		while(!isExit && i > -1) {
			var line = data.row - i - 1,
				j = data.col;
			for(; j < data.col + data.width; j++) {
				if(arr[i][j]) {
					isExit = true;
					break;
				}
			}
			if(!isExit) {
				count++;
			}
			i++;
		}
		return count;
	},

	iterateArray: function(array, i_i, len_i, cb_i, j_j, len_j, cb_j) {
		var self = this,
			amount = this.cellAmount;

		for(var i = i_i; i < len_i; i++) {
			if(!array[i]) {
				array[i] = self.getZeroArray();
			}
			cb_i && cb_i(array[i], i);
			for(var j = j_j; j < len_j; j++) {
				cb_j && cb_j(array[i][j], i, j);
			}
		}
	},

	getZeroArray: function() {
		var result = [],
			amount = this.cellAmount;

		for(var index = 0; index < amount; index++) {
			result.push(0);
		}
		return result;
	},

	//更新每一列空行的起始行数
	updateFirstNullArray: function() {
		var arr = this._firstNullArray,
			locArr = this._locArray,
			amount = this.cellAmount,
			i = 0,
			j, flag;

		while(i < amount){
			flag = true;
			j = locArr.length - 1;

			if(!arr[i]) {
				arr[i] = {
					row: 0,
					col: i
				}
			}
			while(flag && j > -1){
				if(locArr[j][i]) {
					arr[i] = {
						row: j + 1,
						col: i
					};
					flag = false;
					break;
				}
				j--;
			}
			i++;
		}
	},

	/**
	 * 获取位置
	 * 规则：
	 * 移动卡片占据目标位置上的原有卡片的第一行才会将它挤到下方，否则目标卡片移动到原卡片的下方
	 */
	getRuleLoc: function(move) {
		var	self = this,
			arr = this.locArr,
			temp = [];
		if(!arr[move.row]) {
			return move;
		}
		for(var j = move.toCol; j < move.toCol + move.width; j++) {
			var id = arr[move.row][j];
			if(id && !~temp.indexOf(id)) {
				var card = self.cards[id];
				temp.push(id);
				if(move.toRow !== card.row) {
					move.toRow = card.row + card.height;
				}
			}
		}
		return move;
	}
}