var List;
var ListWatcherMorph;
function List(array) {
	this.contents = array || [];
	this.first = null;
	this.rest = null;
	this.isLinked = false;
	this.lastChanged = Date.now();
}

List.prototype.toString = function () {
	return 'a List [' + this.asArray() + ']';
};

List.prototype.changed = function () {
	this.lastChanged = Date.now();
};

List.prototype.cons = function (car, cdr) {
	var answer = new List();
	if (!(cdr instanceof List || isNil(cdr))) {
		throw new Error("cdr isn't a list: " + cdr);
	}
	answer.first = isNil(car) ? null : car;
	answer.rest = cdr || null;
	answer.isLinked = true;
	return answer;
};

List.prototype.cdr = function () {
	var result,
		i;
	if (this.isLinked) {
		return this.rest || new List();
	}
	if (this.contents.length < 2) {
		return new List();
	}
	result = new List();
	for (i = this.contents.length; i > 1; i -= 1) {
		result = this.cons(this.at(i), result);
	}
	return result;
};

List.prototype.add = function (element, index) {
	var idx = index || this.length() + 1,
		obj = isNil(element) ? null : element;
	this.becomeArray();
	this.contents.splice(idx - 1, 0, obj);
	this.changed();
};

List.prototype.put = function (element, index) {
	var data = element === 0 ? 0 : element === false ? false : element || null;
	this.becomeArray();
	this.contents[index - 1] = data;
	this.changed();
};

List.prototype.remove = function (index) {
	this.becomeArray();
	this.contents.splice(index - 1, 1);
	this.changed();
};

List.prototype.clear = function () {
	this.contents = [];
	this.first = null;
	this.rest = null;
	this.isLinked = false;
	this.changed();
};

List.prototype.length = function () {
	if (this.isLinked) {
		var pair = this,
			result = 0;
		while (pair && pair.isLinked) {
			result += 1;
			pair = pair.rest;
		}
		return result + (pair ? pair.contents.length : 0);
	}
	return this.contents.length;
};

List.prototype.at = function (index) {
	var value,
		idx = +index,
		pair = this;
	while (pair.isLinked) {
		if (idx > 1) {
			pair = pair.rest;
			idx -= 1;
		}
		else {
			return pair.first;
		}
	}
	value = pair.contents[idx - 1];
	return isNil(value) ? '' : value;
};

List.prototype.contains = function (element) {
	var pair = this;
	while (pair.isLinked) {
		if (snapEquals(pair.first, element)) {
			return true;
		}
		pair = pair.rest;
	}
	return pair.contents.some(function (any) {
		return snapEquals(any, element);
	});
};

List.prototype.asArray = function () {
	this.becomeArray();
	return this.contents;
};

List.prototype.asText = function () {
	var result = '',
		length,
		element,
		pair = this,
		i;
	while (pair.isLinked) {
		element = pair.first;
		if (element instanceof List) {
			result = result.concat(element.asText());
		}
		else {
			element = isNil(element) ? '' : element.toString();
			result = result.concat(element);
		}
		pair = pair.rest;
	}
	length = pair.length();
	for (i = 1; i <= length; i += 1) {
		element = pair.at(i);
		if (element instanceof List) {
			result = result.concat(element.asText());
		}
		else {
			element = isNil(element) ? '' : element.toString();
			result = result.concat(element);
		}
	}
	return result;
};

List.prototype.becomeArray = function () {
	if (this.isLinked) {
		var next = this,
			i;
		this.contents = [];
		while (next && next.isLinked) {
			this.contents.push(next.first);
			next = next.rest;
		}
		if (next) {
			for (i = 1; i <= next.contents.length; i += 1) {
				this.contents.push(next.at(i));
			}
		}
		this.isLinked = false;
		this.first = null;
		this.rest = null;
	}
};

List.prototype.becomeLinked = function () {
	var i,
		stop,
		tail = this;
	if (!this.isLinked) {
		stop = this.length();
		for (i = 0; i < stop; i += 1) {
			tail.first = this.contents[i];
			tail.rest = new List();
			tail.isLinked = true;
			tail = tail.rest;
		}
		this.contents = [];
		this.isLinked = true;
	}
};

List.prototype.equalTo = function (other) {
	var myself = this,
		it = other,
		i,
		j,
		loopcount;
	if (!(other instanceof List)) {
		return false;
	}
	while (myself.isLinked && it.isLinked) {
		if (!snapEquals(myself.first, it.first)) {
			return false;
		}
		myself = myself.rest;
		it = it.rest;
	}
	if (it.isLinked) {
		i = it;
		it = myself;
		myself = i;
	}
	j = 0;
	while (myself.isLinked) {
		if (!snapEquals(myself.first, it.contents[j])) {
			return false;
		}
		myself = myself.rest;
		j += 1;
	}
	i = 0;
	if (myself.contents.length !== (it.contents.length - j)) {
		return false;
	}
	loopcount = myself.contents.length;
	while (loopcount > 0) {
		loopcount -= 1;
		if (!snapEquals(myself.contents[i], it.contents[j])) {
			return false;
		}
		i += 1;
		j += 1;
	}
	return true;
};

ListWatcherMorph.prototype = new BoxMorph();
ListWatcherMorph.prototype.constructor = ListWatcherMorph;
ListWatcherMorph.uber = BoxMorph.prototype;
ListWatcherMorph.prototype.cellColor = SpriteMorph.prototype.blockColor.lists;
function ListWatcherMorph(list, parentCell) {
	this.init(list, parentCell);
}

ListWatcherMorph.prototype.init = function (list, parentCell) {
	var myself = this;
	this.list = list || new List();
	this.start = 1;
	this.range = 100;
	this.lastUpdated = Date.now();
	this.lastCell = null;
	this.parentCell = parentCell || null;
	this.label = new StringMorph(localize('length: ') + this.list.length(), SyntaxElementMorph.prototype.fontSize, null, false, false, false, MorphicPreferences.isFlat ? new Point() : new Point(1, 1), new Color(255, 255, 255));
	this.label.mouseClickLeft = function () {
		myself.startIndexMenu();
	};
	this.frame = new ScrollFrameMorph(null, 10);
	this.frame.alpha = 0;
	this.frame.acceptsDrops = false;
	this.frame.contents.acceptsDrops = false;
	this.handle = new HandleMorph(this, 80, 70, 3, 3);
	this.handle.setExtent(new Point(13, 13));
	this.arrow = new ArrowMorph('down', SyntaxElementMorph.prototype.fontSize);
	this.arrow.mouseClickLeft = function () {
		myself.startIndexMenu();
	};
	this.arrow.setRight(this.handle.right());
	this.arrow.setBottom(this.handle.top());
	this.handle.add(this.arrow);
	this.plusButton = new PushButtonMorph(this.list, 'add', '+');
	this.plusButton.padding = 0;
	this.plusButton.edge = 0;
	this.plusButton.outlineColor = this.color;
	this.plusButton.drawNew();
	this.plusButton.fixLayout();
	ListWatcherMorph.uber.init.call(this, SyntaxElementMorph.prototype.rounding, 1.000001, new Color(120, 120, 120));
	this.color = new Color(220, 220, 220);
	this.isDraggable = true;
	this.setExtent(new Point(80, 70).multiplyBy(SyntaxElementMorph.prototype.scale));
	this.add(this.label);
	this.add(this.frame);
	this.add(this.plusButton);
	this.add(this.handle);
	this.handle.drawNew();
	this.update();
	this.fixLayout();
};

ListWatcherMorph.prototype.update = function (anyway) {
	var i,
		idx,
		ceil,
		morphs,
		cell,
		cnts,
		label,
		button,
		max,
		starttime,
		maxtime = 1000;
	this.frame.contents.children.forEach(function (m) {
		if (m instanceof CellMorph && m.contentsMorph instanceof ListWatcherMorph) {
			m.contentsMorph.update();
		}
	});
	if (this.lastUpdated === this.list.lastChanged && !anyway) {
		return null;
	}
	this.updateLength(true);
	this.start = Math.max(Math.min(this.start, Math.floor((this.list.length() - 1) / this.range) * this.range + 1), 1);
	max = Math.min(this.start + this.range - 1, this.list.length());
	ceil = Math.min((max - this.start + 1) * 3, this.frame.contents.children.length);
	for (i = 0; i < ceil; i += 3) {
		idx = this.start + (i / 3);
		cell = this.frame.contents.children[i];
		label = this.frame.contents.children[i + 1];
		button = this.frame.contents.children[i + 2];
		cnts = this.list.at(idx);
		if (cell.contents !== cnts) {
			cell.contents = cnts;
			cell.drawNew();
			if (this.lastCell) {
				cell.setLeft(this.lastCell.left());
			}
		}
		this.lastCell = cell;
		if (label.text !== idx.toString()) {
			label.text = idx.toString();
			label.drawNew();
		}
		button.action = idx;
	}
	morphs = (max - this.start + 1) * 3;
	while (this.frame.contents.children.length > morphs) {
		this.frame.contents.children[morphs].destroy();
	}
	ceil = morphs;
	i = this.frame.contents.children.length;
	starttime = Date.now();
	if (ceil > i + 1) {
		for (i; i < ceil; i += 3) {
			if (Date.now() - starttime > maxtime) {
				this.fixLayout();
				this.frame.contents.adjustBounds();
				this.frame.contents.setLeft(this.frame.left());
				return null;
			}
			idx = this.start + (i / 3);
			label = new StringMorph(idx.toString(), SyntaxElementMorph.prototype.fontSize, null, false, false, false, MorphicPreferences.isFlat ? new Point() : new Point(1, 1), new Color(255, 255, 255));
			cell = new CellMorph(this.list.at(idx), this.cellColor, idx, this.parentCell);
			button = new PushButtonMorph(this.list.remove, idx, '-', this.list);
			button.padding = 1;
			button.edge = 0;
			button.corner = 1;
			button.outlineColor = this.color.darker();
			button.drawNew();
			button.fixLayout();
			this.frame.contents.add(cell);
			if (this.lastCell) {
				cell.setPosition(this.lastCell.bottomLeft());
			}
			else {
				cell.setTop(this.frame.contents.top());
			}
			this.lastCell = cell;
			label.setCenter(cell.center());
			label.setRight(cell.left() - 2);
			this.frame.contents.add(label);
			this.frame.contents.add(button);
		}
	}
	this.lastCell = null;
	this.fixLayout();
	this.frame.contents.adjustBounds();
	this.frame.contents.setLeft(this.frame.left());
	this.updateLength();
	this.lastUpdated = this.list.lastChanged;
};

ListWatcherMorph.prototype.updateLength = function (notDone) {
	this.label.text = localize('length: ') + this.list.length();
	if (notDone) {
		this.label.color = new Color(0, 0, 100);
	}
	else {
		this.label.color = new Color(0, 0, 0);
	}
	this.label.drawNew();
	this.label.setCenter(this.center());
	this.label.setBottom(this.bottom() - 3);
};

ListWatcherMorph.prototype.startIndexMenu = function () {
	var i,
		range,
		myself = this,
		items = Math.ceil(this.list.length() / this.range),
		menu = new MenuMorph(function (idx) {
		myself.setStartIndex(idx);
	}, null, myself);
	menu.addItem('1...', 1);
	for (i = 1; i < items; i += 1) {
		range = i * 100 + 1;
		menu.addItem(range + '...', range);
	}
	menu.popUpAtHand(this.world());
};

ListWatcherMorph.prototype.setStartIndex = function (index) {
	this.start = index;
	this.list.changed();
};

ListWatcherMorph.prototype.fixLayout = function () {
	if (!this.label) {
		return;
	}
	Morph.prototype.trackChanges = false;
	if (this.frame) {
		this.arrangeCells();
		this.frame.silentSetPosition(this.position().add(3));
		this.frame.bounds.corner = this.bounds.corner.subtract(new Point(3, 17));
		this.frame.drawNew();
		this.frame.contents.adjustBounds();
	}
	this.label.setCenter(this.center());
	this.label.setBottom(this.bottom() - 3);
	this.plusButton.setLeft(this.left() + 3);
	this.plusButton.setBottom(this.bottom() - 3);
	Morph.prototype.trackChanges = true;
	this.changed();
	if (this.parent && this.parent.fixLayout) {
		this.parent.fixLayout();
	}
};

ListWatcherMorph.prototype.arrangeCells = function () {
	var i,
		cell,
		label,
		button,
		lastCell,
		end = this.frame.contents.children.length;
	for (i = 0; i < end; i += 3) {
		cell = this.frame.contents.children[i];
		label = this.frame.contents.children[i + 1];
		button = this.frame.contents.children[i + 2];
		if (lastCell) {
			cell.setTop(lastCell.bottom());
		}
		if (label) {
			label.setTop(cell.center().y - label.height() / 2);
			label.setRight(cell.left() - 2);
		}
		if (button) {
			button.setCenter(cell.center());
			button.setLeft(cell.right() + 2);
		}
		lastCell = cell;
	}
	this.frame.contents.adjustBounds();
};

ListWatcherMorph.prototype.show = function () {
	ListWatcherMorph.uber.show.call(this);
	this.frame.contents.adjustBounds();
};

ListWatcherMorph.prototype.drawNew = function () {
	WatcherMorph.prototype.drawNew.call(this);
	this.fixLayout();
};


