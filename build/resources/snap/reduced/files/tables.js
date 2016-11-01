var Table;
var TableCellMorph;
var TableMorph;
var TableFrameMorph;
function Table(cols, rows) {
	this.colCount = +cols;
	this.rowCount = +rows;
	this.colNames = [];
	this.rowNames = [];
	this.contents = new Array(+rows);
	for (var i = 0; i < rows; i += 1) {
		this.contents[i] = new Array(+cols);
	}
	this.lastChanged = Date.now();
}

Table.prototype.changed = function () {
	this.lastChanged = Date.now();
};

Table.prototype.get = function (col, row) {
	if (!col) {
		if (!row) {
			return [this.rowCount];
		}
		return this.rowName(row);
	}
	else if (!row) {
		return this.colName(col);
	}
	if (col > this.colCount || row > this.rowCount) {
		return null;
	}
	return (this.contents[row - 1] || [])[col - 1];
};

Table.prototype.row = function (row) {
	return this.contents[row - 1];
};

Table.prototype.col = function (col) {
	var dta = [],
		c = col - 1,
		i;
	for (i = 0; i < this.rowCount; i += 1) {
		dta.push(this.contents[i][c]);
	}
	return dta;
};

Table.prototype.colName = function (col) {
	if (col > this.colCount) {
		return null;
	}
	var name = this.colNames[col - 1];
	if (name !== undefined) {
		return name;
	}
	return String.fromCharCode(64 + ((col % 26) || 26)).repeat(Math.floor((col - 1) / 26) + 1);
};

Table.prototype.rowName = function (row) {
	if (row > this.rowCount) {
		return null;
	}
	return this.rowNames[row - 1] || row;
};

Table.prototype.rows = function () {
	return this.rowCount;
};

Table.prototype.cols = function () {
	return this.colCount;
};

Table.prototype.columnNames = function () {
	return this.colNames;
};

Table.prototype.set = function (data, col, row) {
	this.contents[row - 1][col - 1] = data;
	this.changed();
};

Table.prototype.setRows = function (rowsArray, colNames, rowNames) {
	this.contents = rowsArray;
	if (colNames) {
		this.colNames = colNames;
	}
	if (rowNames) {
		this.rowNames = rowNames;
	}
	this.changed();
};

Table.prototype.setCols = function (colsArray, colNames, rowNames) {
	var r,
		c;
	for (c = 0; c < this.colCount; c += 1) {
		for (r = 0; r < this.rowCount; r += 1) {
			this.contents[r][c] = colsArray[c][r];
		}
	}
	if (colNames) {
		this.colNames = colNames;
	}
	if (rowNames) {
		this.rowNames = rowNames;
	}
	this.changed();
};

Table.prototype.setColNames = function (array) {
	this.colNames = array || [];
	this.changed();
};

Table.prototype.setRowNames = function (array) {
	this.rowNames = array || [];
	this.changed();
};

Table.prototype.setColName = function (col, name) {
	this.colNames[col + 1] = name;
	this.changed();
};

Table.prototype.setRowName = function (row, name) {
	this.rowNames[row + 1] = name;
	this.changed();
};

Table.prototype.addRow = function (array, name) {
	if (array) {
		this.contents[this.rowCount] = array;
	}
	else {
		this.contents[this.rowCount] = new Array(this.rowCount);
	}
	this.rowNames[this.rowCount] = name;
	this.rowCount += 1;
	this.changed();
};

Table.prototype.addCol = function (array, name) {
	var i;
	if (array) {
		for (i = 0; i < this.col; i += 1) {
			this.contents[i][this.colCount] = array[i];
		}
	}
	this.colNames[this.colCount] = name;
	this.colCount += 1;
	this.changed();
};

Table.prototype.toList = function () {
	return new List(this.contents.map(function (eachRow) {
		return new List(eachRow);
	}));
};

TableCellMorph.prototype = new Morph();
TableCellMorph.prototype.constructor = TableCellMorph;
TableCellMorph.uber = Morph.prototype;
TableCellMorph.prototype.listSymbol = ArgMorph.prototype.listIcon();
function TableCellMorph(data, extent, isLabel) {
	this.init(data, extent, isLabel);
}

TableCellMorph.prototype.init = function (data, extent, isLabel) {
	this.data = data;
	this.isLabel = isLabel || false;
	TableCellMorph.uber.init.call(this, true);
	this.noticesTransparentClick = true;
	if (extent) {
		this.silentSetExtent(extent);
	}
	this.drawNew();
};

TableCellMorph.prototype.setData = function (data, extent) {
	this.data = data;
	if (extent && (!extent.eq(this.extent()))) {
		this.silentSetExtent(extent);
		this.drawNew();
	}
	else {
		this.drawData();
	}
};

TableCellMorph.prototype.getData = function () {
	return this.data instanceof Array ? this.data[0] : this.data;
};

TableCellMorph.prototype.drawNew = function () {
	this.image = newCanvas(this.extent());
	this.drawData();
};

TableCellMorph.prototype.drawData = function (lbl, bg) {
	var dta = lbl || this.dataRepresentation(this.data),
		context = this.image.getContext('2d'),
		fontSize = SyntaxElementMorph.prototype.fontSize,
		empty = TableMorph.prototype.highContrast ? 'rgb(220, 220, 220)' : 'transparent',
		orphaned = 'rgb(217, 77, 17)',
		fontStyle = this.isLabel ? (this.data instanceof Array ? 'italic' : '') : this.shouldBeList() ? 'bold' : '',
		font = fontStyle + ' ' + fontSize + 'px Helvetica, Arial, sans-serif',
		background = bg || (this.isLabel ? empty : (this.shouldBeList() ? orphaned : (this.isOvershooting() ? 'white' : (isNil(this.data) ? empty : 'white')))),
		foreground = !this.isLabel && this.shouldBeList() ? 'white' : 'black',
		width = this.width(),
		height = this.height(),
		txtWidth,
		txtHeight,
		x,
		y;
	context.clearRect(0, 0, width, height);
	context.fillStyle = background;
	if (this.shouldBeList()) {
		BoxMorph.prototype.outlinePath.call(this, context, SyntaxElementMorph.prototype.corner + 1, 0);
		context.fill();
	}
	else if (this.isOvershooting()) {
		this.raggedBoxPath(context);
		context.fill();
	}
	else {
		context.fillRect(0, 0, width, height);
	}
	if (!dta) {
		return;
	}
	if (dta instanceof HTMLCanvasElement) {
		x = Math.max((width - dta.width) / 2, 0);
		y = Math.max((height - dta.height) / 2, 0);
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowBlur = 4;
		context.shadowColor = 'lightgray';
		context.drawImage(dta, x, y);
	}
	else {
		context.font = font;
		context.textAlign = 'left';
		context.textBaseline = 'bottom';
		txtWidth = context.measureText(dta).width;
		txtHeight = fontHeight(fontSize);
		context.fillStyle = foreground;
		x = Math.max((width - txtWidth) / 2, 0);
		y = Math.max((height - txtHeight) / 2, 0);
		context.fillText(dta, x, txtHeight + y);
	}
};

TableCellMorph.prototype.dataRepresentation = function (dta) {
	if (dta instanceof Morph) {
		if (isSnapObject(dta)) {
			return dta.thumbnail(new Point(40, 40));
		}
		else {
			return dta.fullImageClassic();
		}
	}
	else if (isString(dta)) {
		return dta.length > 100 ? dta.slice(0, 100) + '...' : dta;
	}
	else if (typeof dta === 'number') {
		return dta.toString();
	}
	else if (typeof dta === 'boolean') {
		return SpriteMorph.prototype.booleanMorph.call(null, dta).fullImage();
	}
	else if (dta instanceof Array) {
		return this.dataRepresentation(dta[0]);
	}
	else if (dta instanceof Variable) {
		return this.dataRepresentation(dta.value);
	}
	else if (dta instanceof HTMLCanvasElement) {
		return dta;
	}
	else if (dta instanceof Context) {
		return dta.image();
	}
	else if (dta instanceof Costume) {
		return dta.thumbnail(new Point(40, 40));
	}
	else if (dta instanceof List) {
		return this.listSymbol;
	}
	else {
		return dta ? dta.toString() : (dta === 0 ? '0' : null);
	}
};

TableCellMorph.prototype.raggedBoxPath = function (context) {
	var width = this.width(),
		height = this.height(),
		x = width * 0.75,
		step = height / 6,
		y = 0;
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(width, 0);
	for (y = 0; y < height; y += (step * 2)) {
		context.lineTo(x, y + step);
		context.lineTo(width, y + (step * 2));
	}
	context.lineTo(width, height);
	context.lineTo(0, height);
	context.closePath();
};

TableCellMorph.prototype.shouldBeList = function () {
	return this.data instanceof Array;
};

TableCellMorph.prototype.isOvershooting = function () {
	return this.data instanceof Variable;
};

TableCellMorph.prototype.mouseDoubleClick = function (pos) {
	if (this.data instanceof Table || this.data instanceof List) {
		new TableDialogMorph(this.data).popUp(this.world());
	}
	else if (this.data instanceof Array && this.data[0] instanceof List) {
		new TableDialogMorph(this.data[0]).popUp(this.world());
	}
	else {
		this.escalateEvent('mouseDoubleClick', pos);
	}
};

TableCellMorph.prototype.mouseEnter = function () {
	var tm,
		x,
		c;
	if (this.isLabel) {
		tm = this.parentThatIsA(TableMorph);
		x = tm.world().hand.left() - tm.left();
		c = tm.columnAt(x);
		if (c > 0) {
			this.drawData(c, 'rgb(220, 220, 250)');
			this.changed();
		}
	}
};

TableCellMorph.prototype.mouseLeave = function () {
	if (this.isLabel) {
		this.drawData();
		this.changed();
	}
};

TableMorph.prototype = new FrameMorph();
TableMorph.prototype.constructor = TableMorph;
TableMorph.uber = FrameMorph.prototype;
TableMorph.prototype.highContrast = false;
function TableMorph(table, scrollBarSize, extent, startRow, startCol, globalColWidth, colWidths, rowHeight, colLabelHeight, padding) {
	this.init(table, scrollBarSize, extent, startRow, startCol, globalColWidth, colWidths, rowHeight, colLabelHeight, padding);
}

TableMorph.prototype.init = function (table, scrollBarSize, extent, startRow, startCol, globalColWidth, colWidths, rowHeight, colLabelHeight, padding) {
	this.table = table;
	this.scrollBarSize = scrollBarSize || MorphicPreferences.scrollBarSize;
	this.startRow = startRow || 1;
	this.startCol = startCol || 1;
	this.textHeight = Math.ceil(fontHeight(SyntaxElementMorph.prototype.fontSize) * 1.3);
	this.rowHeight = rowHeight || this.textHeight;
	this.colWidths = colWidths || [];
	this.globalColWidth = globalColWidth || Math.ceil(this.textHeight * 3.5);
	this.colLabelHeight = colLabelHeight || this.textHeight;
	this.padding = padding || SyntaxElementMorph.prototype.scale;
	this.tableVersion = this.table.lastChanged;
	this.hBar = null;
	this.vBar = null;
	this.rowLabelWidth = 0;
	this.columns = [];
	this.rows = 0;
	this.maxStartRow = null;
	this.maxStartCol = null;
	this.dragAnchor = null;
	this.resizeAnchor = null;
	this.resizeCol = null;
	this.resizeRow = null;
	this.wantsUpdate = false;
	Morph.prototype.init.call(this, true);
	if (extent) {
		this.silentSetExtent(extent);
	}
	this.initScrollBars();
	this.drawNew();
};

TableMorph.prototype.initScrollBars = function () {
	var myself = this;
	this.hBar = new SliderMorph(1, null, null, null, 'horizontal');
	this.hBar.setHeight(this.scrollBarSize);
	this.hBar.action = function (num) {
		myself.showData(num, null, true);
	};
	this.hBar.isDraggable = false;
	this.add(this.hBar);
	this.vBar = new SliderMorph(1, null, null, null, 'vertical');
	this.vBar.setWidth(this.scrollBarSize);
	this.vBar.action = function (num) {
		myself.showData(null, num, true);
	};
	this.vBar.isDraggable = false;
	this.add(this.vBar);
};

TableMorph.prototype.updateScrollBars = function () {
	if (this.maxStartCol === 1) {
		this.hBar.hide();
	}
	else {
		this.hBar.show();
		this.hBar.stop = this.maxStartCol;
		this.hBar.value = this.startCol;
		this.hBar.size = Math.max(this.hBar.rangeSize() * this.columns.length / this.table.cols(), this.hBar.rangeSize() / 10);
		this.hBar.drawNew();
	}
	this.vBar.stop = this.maxStartRow;
	this.vBar.value = this.startRow;
	if (this.maxStartRow === 1) {
		this.vBar.hide();
	}
	else {
		this.vBar.show();
		this.vBar.size = Math.max(this.vBar.rangeSize() * this.rows / this.table.rows(), this.vBar.rangeSize() / 10);
		this.vBar.drawNew();
	}
};

TableMorph.prototype.drawNew = function () {
	var context,
		w,
		i;
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	context.fillStyle = 'rgb(220, 220, 220)';
	BoxMorph.prototype.outlinePath.call(this, context, SyntaxElementMorph.prototype.corner + 1, 0);
	context.fill();
	this.rowLabelWidth = this.rowLabelsWidth();
	this.columns = this.columnsLayout();
	this.rows = this.visibleRows();
	if (this.highContrast && this.table.cols() > 1) {
		w = this.padding;
		for (i = this.startCol; i <= this.table.cols(); i += 1) {
			w += (this.colWidth(i) + this.padding);
		}
		context.fillStyle = 'darkGray';
		context.fillRect(this.padding + this.rowLabelWidth, this.padding + this.colLabelHeight, w, (this.rowHeight + this.padding) * (this.table.rows() + 1 - this.startRow) + this.padding);
	}
	this.buildCells();
	this.hBar.setWidth(this.width() - this.vBar.width());
	this.hBar.setLeft(this.left());
	this.hBar.setBottom(this.bottom());
	this.vBar.setHeight(this.height() - this.hBar.height());
	this.vBar.setRight(this.right());
	this.vBar.setTop(this.top());
};

TableMorph.prototype.buildCells = function () {
	var cell,
		r,
		c,
		pos = this.position();
	this.children = [];
	for (c = 0; c <= this.columns.length; c += 1) {
		for (r = 0; r <= this.rows; r += 1) {
			cell = new TableCellMorph(this.table.get(!c ? c : c + this.startCol - 1, !r ? r : r + this.startRow - 1), new Point(!c ? this.rowLabelWidth : this.colWidth(c + this.startCol - 1), !r ? this.colLabelHeight : this.rowHeight), !(r && c), false);
			cell.setPosition(new Point(!c ? this.padding : this.columns[c - 1], !r ? this.padding : this.padding * 2 + this.colLabelHeight + ((r - 1) * (this.rowHeight + this.padding))).add(pos));
			this.add(cell);
			if (isSnapObject(cell.getData())) {
				this.wantsUpdate = true;
			}
		}
	}
	this.add(this.hBar);
	this.add(this.vBar);
	this.updateScrollBars();
	this.changed();
};

TableMorph.prototype.drawData = function (noScrollUpdate) {
	var cell,
		cellIdx = 0,
		r,
		c;
	for (c = 0; c <= this.columns.length; c += 1) {
		for (r = 0; r <= this.rows; r += 1) {
			cell = this.children[cellIdx];
			cellIdx += 1;
			cell.setData(this.table.get(!c ? c : c + this.startCol - 1, !r ? r : r + this.startRow - 1));
			if (isSnapObject(cell.getData())) {
				this.wantsUpdate = true;
			}
		}
	}
	if (!noScrollUpdate) {
		this.updateScrollBars();
	}
	this.changed();
};

TableMorph.prototype.scroll = function (xSteps, ySteps) {
	this.showData(Math.min(this.maxStartCol, Math.max(1, this.startCol + Math.round(xSteps))), Math.min(this.maxStartRow, Math.max(1, this.startRow + Math.round(ySteps))));
	this.updateScrollBars();
};

TableMorph.prototype.showData = function (startCol, startRow, noScrollUpdate) {
	var c = startCol || this.startCol,
		r = startRow || this.startRow;
	if (c === this.startCol) {
		if (r === this.startRow) {
			return;
		}
		this.startRow = r;
		this.rows = this.visibleRows();
		this.drawData(noScrollUpdate);
	}
	else {
		this.startCol = c;
		this.startRow = r;
		this.rows = this.visibleRows();
		if (this.colWidths.length) {
			this.columns = this.columnsLayout();
			this.buildCells();
		}
		else {
			this.drawData(noScrollUpdate);
		}
	}
};

TableMorph.prototype.step = function () {
	if (this.dragAnchor) {
		this.shiftCells(this.world().hand.position());
	}
	else if (this.resizeAnchor) {
		this.resizeCells(this.world().hand.position());
	}
	this.update();
};

TableMorph.prototype.update = function () {
	var oldCols,
		oldRows,
		version = this.table instanceof List ? this.table.version(this.startRow, this.rows) : this.table.lastChanged;
	if (this.tableVersion === version && !this.wantsUpdate) {
		return;
	}
	this.wantsUpdate = false;
	if (this.table instanceof List) {
		oldCols = this.columns.length;
		oldRows = this.rows;
		this.rowLabelWidth = this.rowLabelsWidth();
		this.columns = this.columnsLayout();
		this.rows = this.visibleRows();
		if (this.columns.length !== oldCols || (this.rows !== oldRows)) {
			this.buildCells();
		}
		else {
			this.drawData();
		}
	}
	else {
		this.drawData();
	}
	this.tableVersion = version;
};

TableMorph.prototype.rowLabelsWidth = function () {
	var ctx = newCanvas().getContext('2d');
	ctx.font = 'italic ' + SyntaxElementMorph.prototype.fontSize + 'px Helvetica, Arial, sans-serif';
	return Math.max(0, Math.max.apply(null, this.table.columnNames().map(function (name) {
		return name ? ctx.measureText(name).width : 0;
	}))) || ctx.measureText(this.table.rows().toString()).width + (6 * SyntaxElementMorph.prototype.scale);
};

TableMorph.prototype.columnsLayout = function () {
	var c = [],
		x = this.padding * 2 + this.rowLabelWidth,
		colNum,
		w;
	colNum = this.table.cols();
	w = x;
	while (w < this.width() && colNum > 0) {
		w += this.colWidth(colNum);
		colNum -= 1;
	}
	if (colNum === 0 && (w < this.width())) {
		this.maxStartCol = 1;
	}
	else {
		this.maxStartCol = Math.min(colNum + 2, this.table.cols());
	}
	this.startCol = Math.min(this.startCol, this.maxStartCol);
	colNum = this.startCol;
	while (x < this.width() && (colNum < (this.table.cols() + this.startCol))) {
		w = this.colWidth(colNum);
		c.push(x);
		x += w;
		x += this.padding;
		colNum += 1;
	}
	return c;
};

TableMorph.prototype.colWidth = function (col) {
	return this.colWidths[col - 1] || this.globalColWidth;
};

TableMorph.prototype.visibleRows = function () {
	var rest = this.height() - this.colLabelHeight - this.padding,
		possible;
	if (rest < 0) {
		return 0;
	}
	possible = Math.ceil(rest / (this.rowHeight + this.padding));
	this.maxStartRow = Math.max(1, this.table.rows() - possible + 2);
	this.startRow = Math.min(this.startRow, this.maxStartRow);
	return Math.min(this.table.rows(), possible);
};

TableMorph.prototype.globalExtent = function () {
	var i,
		w = this.rowLabelsWidth() + 2,
		cols = this.table.cols();
	for (i = 0; i < cols; i += 1) {
		w += this.colWidth(i + 1);
		w += this.padding;
	}
	if (cols === 1) {
		w += this.scrollBarSize;
		w += this.padding * 2;
	}
	return new Point(w + this.padding, this.colLabelHeight + (this.padding * 2) + ((this.rowHeight + this.padding) * this.table.rows()));
};

TableMorph.prototype.mouseScroll = function (y, x) {
	this.scroll(-(+x * MorphicPreferences.mouseScrollAmount / 4), -(+y * MorphicPreferences.mouseScrollAmount));
};

TableMorph.prototype.mouseDownLeft = function (pos) {
	var rel = pos.subtract(this.position());
	if (rel.x <= this.rowLabelWidth || (rel.y <= this.colLabelHeight)) {
		if (this.world().currentKey === 16) {
			this.resizeCol = 0;
		}
		else {
			this.resizeCol = this.columnAt(rel.x);
		}
		this.resizeRow = (rel.y > (this.colLabelHeight));
		this.resizeAnchor = pos;
	}
	else {
		this.resizeRow = null;
		this.dragAnchor = pos;
	}
};

TableMorph.prototype.mouseClickLeft = function (pos) {
	this.dragAnchor = null;
	this.resizeAnchor = null;
	this.resizeRow = null;
};

TableMorph.prototype.mouseLeaveDragging = function (pos) {
	this.dragAnchor = null;
	this.resizeAnchor = null;
	this.resizeRow = null;
};

TableMorph.prototype.mouseDoubleClick = function (pos) {
	if (this.parentThatIsA(TableDialogMorph)) {
		this.escalateEvent('mouseDoubleClick', pos);
	}
	else {
		new TableDialogMorph(this.table, this.globalColWidth, this.colWidths, this.rowHeight).popUp(this.world());
	}
};

TableMorph.prototype.shiftCells = function (pos) {
	var delta = this.dragAnchor.subtract(pos),
		scrollX = Math.round(delta.x / this.globalColWidth),
		scrollY = Math.round(delta.y / this.rowHeight);
	if (scrollX || scrollY) {
		this.scroll(scrollX, scrollY);
		this.dragAnchor = pos;
	}
};

TableMorph.prototype.resizeCells = function (pos) {
	var i;
	if (this.resizeCol) {
		this.colWidths[this.resizeCol - 1] = Math.max(16, (this.colWidths[this.resizeCol - 1] || this.globalColWidth));
	}
	else if (this.resizeRow) {
		this.rowHeight = Math.max(16, this.rowHeight);
	}
	else {
		this.globalColWidth = Math.max(16, this.globalColWidth);
		for (i = 0; i < this.colWidths.length; i += 1) {
			if (this.colWidths[i]) {
				this.colWidths[i] = Math.max(16, this.colWidths[i]);
			}
		}
	}
	if (this.highContrast) {
		this.drawNew();
	}
	else {
		this.rowLabelWidth = this.rowLabelsWidth();
		this.columns = this.columnsLayout();
		this.rows = this.visibleRows();
		this.buildCells();
	}
	this.resizeAnchor = pos;
};

TableMorph.prototype.columnAt = function (relativeX) {
	var c = 0;
	if (relativeX < (this.columns[0])) {
		return 0;
	}
	while (relativeX > this.columns[c]) {
		c += 1;
	}
	return c + this.startCol - 1;
};

TableMorph.prototype.resetColumns = function () {
	this.colWidths = [];
	if (this.highContrast) {
		this.drawNew();
	}
	else {
		this.rowLabelWidth = this.rowLabelsWidth();
		this.columns = this.columnsLayout();
		this.rows = this.visibleRows();
		this.buildCells();
	}
};

TableMorph.prototype.openInDialog = function () {
	new TableDialogMorph(this.table, this.globalColWidth, this.colWidths, this.rowHeight).popUp(this.world());
};

TableMorph.prototype.showListView = function () {
	var view = this.parentThatIsAnyOf([SpriteBubbleMorph, SpeechBubbleMorph, CellMorph]);
	if (!view) {
		return;
	}
	if (view instanceof SpriteBubbleMorph) {
		view.changed();
		view.drawNew(true);
	}
	else if (view instanceof SpeechBubbleMorph) {
		view.contents = new ListWatcherMorph(this.table);
		view.contents.expand(this.extent());
		view.drawNew(true);
	}
	else {
		view.drawNew(true);
		view.contentsMorph.expand(this.extent());
	}
	view.fixLayout();
};

TableMorph.prototype.show = function () {
	TableMorph.uber.show.call(this);
	this.updateScrollBars();
};

TableFrameMorph.prototype = new Morph();
TableFrameMorph.prototype.constructor = TableFrameMorph;
TableFrameMorph.uber = Morph.prototype;
function TableFrameMorph(tableMorph, noResize) {
	this.init(tableMorph, noResize);
}

TableFrameMorph.prototype.init = function (tableMorph, noResize) {
	this.tableMorph = tableMorph;
	this.handle = null;
	TableFrameMorph.uber.init.call(this, true);
	this.color = 'transparent';
	this.noticesTransparentClick = false;
	this.bounds = this.tableMorph.bounds.copy();
	this.add(this.tableMorph);
	if (!noResize) {
		this.handle = new HandleMorph(this, 80, 25, null, null);
	}
	this.drawNew();
};

TableFrameMorph.prototype.fixLayout = function () {
	var ext = this.extent();
	if (this.tableMorph.extent().eq(ext)) {
		return;
	}
	this.tableMorph.setExtent(this.extent());
	if (this.parent && this.parent.fixLayout) {
		this.parent.fixLayout();
	}
};

TableFrameMorph.prototype.setExtent = function (aPoint, silently) {
	TableFrameMorph.uber.setExtent.call(this, aPoint, silently);
	this.fixLayout();
};

TableFrameMorph.prototype.expand = function (maxExtent) {
	var ext = this.tableMorph.globalExtent();
	if (maxExtent) {
		ext = ext.min(maxExtent);
	}
	this.setExtent(ext);
	this.handle.setRight(this.right());
	this.handle.setBottom(this.bottom());
};

TableDialogMorph.prototype = new DialogBoxMorph();
TableDialogMorph.prototype.constructor = TableDialogMorph;
TableDialogMorph.uber = DialogBoxMorph.prototype;
function TableDialogMorph(data, globalColWidth, colWidths, rowHeight) {
	this.init(data, globalColWidth, colWidths, rowHeight);
}

TableDialogMorph.prototype.init = function (data, globalColWidth, colWidths, rowHeight) {
	this.handle = null;
	this.data = data;
	this.tableView = null;
	TableDialogMorph.uber.init.call(this);
	this.labelString = 'Table view';
	this.createLabel();
	this.buildContents(data, globalColWidth, colWidths, rowHeight);
};

TableDialogMorph.prototype.buildContents = function (data, globalColWidth, colWidths, rowHeight) {
	this.tableView = new TableMorph(data, null, null, null, null, globalColWidth, colWidths, rowHeight, null, null);
	this.addBody(new TableFrameMorph(this.tableView, true));
	this.addButton('ok', 'OK');
};

TableDialogMorph.prototype.setInitialDimensions = function () {
	var world = this.world(),
		mex = world.extent().subtract(new Point(this.padding, this.padding)),
		th = fontHeight(this.titleFontSize) + this.titlePadding * 3,
		bh = this.buttons.height();
	this.setExtent(this.tableView.globalExtent().add(new Point(this.padding * 2, this.padding * 2 + th + bh)).min(mex).max(new Point(100, 100)));
	this.setCenter(this.world().center());
};

TableDialogMorph.prototype.popUp = function (world) {
	if (world) {
		TableDialogMorph.uber.popUp.call(this, world);
		this.setInitialDimensions();
		this.handle = new HandleMorph(this, 100, 100, this.corner, this.corner);
	}
};

TableDialogMorph.prototype.fixLayout = function () {
	var th = fontHeight(this.titleFontSize) + this.titlePadding * 2;
	if (this.buttons && (this.buttons.children.length > 0)) {
		this.buttons.fixLayout();
	}
	if (this.body) {
		this.body.setPosition(this.position().add(new Point(this.padding, th + this.padding)));
		this.body.setExtent(new Point(this.width() - this.padding * 2, this.height() - this.padding * 3 - th - this.buttons.height()));
	}
	if (this.label) {
		this.label.setCenter(this.center());
		this.label.setTop(this.top() + (th - this.label.height()) / 2);
	}
	if (this.buttons && (this.buttons.children.length > 0)) {
		this.buttons.setCenter(this.center());
		this.buttons.setBottom(this.bottom() - this.padding);
	}
};


