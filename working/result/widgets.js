var PushButtonMorph;
var DialogBoxMorph;
var AlignmentMorph;
var InputFieldMorph;
PushButtonMorph.prototype = new TriggerMorph();
PushButtonMorph.prototype.constructor = PushButtonMorph;
PushButtonMorph.uber = TriggerMorph.prototype;
PushButtonMorph.prototype.fontSize = 10;
PushButtonMorph.prototype.fontStyle = 'sans-serif';
PushButtonMorph.prototype.labelColor = new Color(0, 0, 0);
PushButtonMorph.prototype.labelShadowColor = new Color(255, 255, 255);
PushButtonMorph.prototype.labelShadowOffset = new Point(1, 1);
PushButtonMorph.prototype.color = new Color(220, 220, 220);
PushButtonMorph.prototype.pressColor = new Color(115, 180, 240);
PushButtonMorph.prototype.highlightColor = PushButtonMorph.prototype.pressColor.lighter(50);
PushButtonMorph.prototype.outlineColor = new Color(30, 30, 30);
PushButtonMorph.prototype.outlineGradient = false;
PushButtonMorph.prototype.contrast = 60;
PushButtonMorph.prototype.edge = 2;
PushButtonMorph.prototype.corner = 5;
PushButtonMorph.prototype.outline = 1.00001;
PushButtonMorph.prototype.padding = 3;
function PushButtonMorph(target, action, labelString, environment, hint, template) {
	this.init(target, action, labelString, environment, hint, template);
}

PushButtonMorph.prototype.init = function (target, action, labelString, environment, hint, template) {
	this.is3D = false;
	this.target = target || null;
	this.action = action || null;
	this.environment = environment || null;
	this.labelString = labelString || null;
	this.label = null;
	this.labelMinExtent = new Point(0, 0);
	this.hint = hint || null;
	this.template = template || null;
	TriggerMorph.uber.init.call(this);
	this.color = PushButtonMorph.prototype.color;
	this.drawNew();
	this.fixLayout();
};

PushButtonMorph.prototype.fixLayout = function () {
	if (this.label !== null) {
		var padding = this.padding * 2 + this.outline * 2 + this.edge * 2;
		this.setExtent(new Point(Math.max(this.label.width(), this.labelMinExtent.x) + padding, Math.max(this.label instanceof StringMorph ? this.label.rawHeight() : this.label.height(), this.labelMinExtent.y) + padding));
		this.label.setCenter(this.center());
	}
};

PushButtonMorph.prototype.mouseDownLeft = function () {
	PushButtonMorph.uber.mouseDownLeft.call(this);
	if (this.label) {
		this.label.setCenter(this.center().add(1));
	}
};

PushButtonMorph.prototype.mouseClickLeft = function () {
	PushButtonMorph.uber.mouseClickLeft.call(this);
	if (this.label) {
		this.label.setCenter(this.center());
	}
};

PushButtonMorph.prototype.mouseLeave = function () {
	PushButtonMorph.uber.mouseLeave.call(this);
	if (this.label) {
		this.label.setCenter(this.center());
	}
};

PushButtonMorph.prototype.outlinePath = BoxMorph.prototype.outlinePath;
PushButtonMorph.prototype.drawOutline = function (context) {
	var outlineStyle,
		isFlat = MorphicPreferences.isFlat && !this.is3D;
	if (!this.outline || isFlat) {
		return null;
	}
	if (this.outlineGradient) {
		outlineStyle = context.createLinearGradient(0, 0, 0, this.height());
		outlineStyle.addColorStop(1, 'white');
		outlineStyle.addColorStop(0, this.outlineColor.darker().toString());
	}
	else {
		outlineStyle = this.outlineColor.toString();
	}
	context.fillStyle = outlineStyle;
	context.beginPath();
	this.outlinePath(context, isFlat ? 0 : this.corner, 0);
	context.closePath();
	context.fill();
};

PushButtonMorph.prototype.drawBackground = function (context, color) {
	var isFlat = MorphicPreferences.isFlat && !this.is3D;
	context.fillStyle = color.toString();
	context.beginPath();
	this.outlinePath(context, isFlat ? 0 : Math.max(this.corner - this.outline, 0), this.outline);
	context.closePath();
	context.fill();
	context.lineWidth = this.outline;
};

PushButtonMorph.prototype.drawEdges = function (context, color, topColor, bottomColor) {
	if (MorphicPreferences.isFlat && !this.is3D) {
		return;
	}
	var minInset = Math.max(this.corner, this.outline + this.edge),
		w = this.width(),
		h = this.height(),
		gradient;
	gradient = context.createLinearGradient(0, this.outline, 0, this.outline + this.edge);
	gradient.addColorStop(0, topColor.toString());
	gradient.addColorStop(1, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.moveTo(minInset, this.outline + this.edge / 2);
	context.lineTo(w - minInset, this.outline + this.edge / 2);
	context.stroke();
	gradient = context.createRadialGradient(this.corner, this.corner, Math.max(this.corner - this.outline - this.edge, 0), this.corner, this.corner, Math.max(this.corner - this.outline, 0));
	gradient.addColorStop(1, topColor.toString());
	gradient.addColorStop(0, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.arc(this.corner, this.corner, Math.max(this.corner - this.outline - this.edge / 2, 0), radians(180), radians(270), false);
	context.stroke();
	gradient = context.createLinearGradient(this.outline, 0, this.outline + this.edge, 0);
	gradient.addColorStop(0, topColor.toString());
	gradient.addColorStop(1, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.moveTo(this.outline + this.edge / 2, minInset);
	context.lineTo(this.outline + this.edge / 2, h - minInset);
	context.stroke();
	gradient = context.createLinearGradient(0, h - this.outline, 0, h - this.outline - this.edge);
	gradient.addColorStop(0, bottomColor.toString());
	gradient.addColorStop(1, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.moveTo(minInset, h - this.outline - this.edge / 2);
	context.lineTo(w - minInset, h - this.outline - this.edge / 2);
	context.stroke();
	gradient = context.createRadialGradient(w - this.corner, h - this.corner, Math.max(this.corner - this.outline - this.edge, 0), w - this.corner, h - this.corner, Math.max(this.corner - this.outline, 0));
	gradient.addColorStop(1, bottomColor.toString());
	gradient.addColorStop(0, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.arc(w - this.corner, h - this.corner, Math.max(this.corner - this.outline - this.edge / 2, 0), radians(0), radians(90), false);
	context.stroke();
	gradient = context.createLinearGradient(w - this.outline, 0, w - this.outline - this.edge, 0);
	gradient.addColorStop(0, bottomColor.toString());
	gradient.addColorStop(1, color.toString());
	context.strokeStyle = gradient;
	context.lineCap = 'round';
	context.lineWidth = this.edge;
	context.beginPath();
	context.moveTo(w - this.outline - this.edge / 2, minInset);
	context.lineTo(w - this.outline - this.edge / 2, h - minInset);
	context.stroke();
};

PushButtonMorph.prototype.createBackgrounds = function () {
	var context,
		ext = this.extent();
	if (this.template) {
		this.image = this.template.image;
		this.normalImage = this.template.normalImage;
		this.highlightImage = this.template.highlightImage;
		this.pressImage = this.template.pressImage;
		return null;
	}
	this.normalImage = newCanvas(ext);
	context = this.normalImage.getContext('2d');
	this.drawOutline(context);
	this.drawBackground(context, this.color);
	this.drawEdges(context, this.color, this.color.lighter(this.contrast), this.color.darker(this.contrast));
	this.highlightImage = newCanvas(ext);
	context = this.highlightImage.getContext('2d');
	this.drawOutline(context);
	this.drawBackground(context, this.highlightColor);
	this.drawEdges(context, this.highlightColor, this.highlightColor.lighter(this.contrast), this.highlightColor.darker(this.contrast));
	this.pressImage = newCanvas(ext);
	context = this.pressImage.getContext('2d');
	this.drawOutline(context);
	this.drawBackground(context, this.pressColor);
	this.drawEdges(context, this.pressColor, this.pressColor.darker(this.contrast), this.pressColor.lighter(this.contrast));
	this.image = this.normalImage;
};

PushButtonMorph.prototype.createLabel = function () {
	var shading = !MorphicPreferences.isFlat || this.is3D;
	if (this.label !== null) {
		this.label.destroy();
	}
	if (this.labelString instanceof SymbolMorph) {
		if (shading) {
			this.label.shadowOffset = this.labelShadowOffset;
			this.label.shadowColor = this.labelShadowColor;
		}
		this.label.color = this.labelColor;
		this.label.drawNew();
	}
	else {
		this.label = new StringMorph(localize(this.labelString), this.fontSize, this.fontStyle, true, false, false, shading ? this.labelShadowOffset : null, this.labelShadowColor, this.labelColor);
	}
	this.add(this.label);
};

DialogBoxMorph.prototype = new Morph();
DialogBoxMorph.prototype.constructor = DialogBoxMorph;
DialogBoxMorph.uber = Morph.prototype;
DialogBoxMorph.prototype.fontSize = 12;
DialogBoxMorph.prototype.titleFontSize = 14;
DialogBoxMorph.prototype.fontStyle = 'sans-serif';
DialogBoxMorph.prototype.color = PushButtonMorph.prototype.color;
DialogBoxMorph.prototype.titleTextColor = new Color(255, 255, 255);
DialogBoxMorph.prototype.titleBarColor = PushButtonMorph.prototype.pressColor;
DialogBoxMorph.prototype.contrast = 40;
DialogBoxMorph.prototype.corner = 12;
DialogBoxMorph.prototype.padding = 14;
DialogBoxMorph.prototype.titlePadding = 6;
DialogBoxMorph.prototype.buttonContrast = 50;
DialogBoxMorph.prototype.buttonFontSize = 12;
DialogBoxMorph.prototype.buttonCorner = 12;
DialogBoxMorph.prototype.buttonEdge = 6;
DialogBoxMorph.prototype.buttonPadding = 0;
DialogBoxMorph.prototype.buttonOutline = 3;
DialogBoxMorph.prototype.buttonOutlineColor = PushButtonMorph.prototype.color;
DialogBoxMorph.prototype.buttonOutlineGradient = true;
DialogBoxMorph.prototype.instances = {};

function DialogBoxMorph(target, action, environment) {
	this.init(target, action, environment);
}

DialogBoxMorph.prototype.init = function (target, action, environment) {
	this.is3D = false;
	this.target = target || null;
	this.action = action || null;
	this.environment = environment || null;
	this.key = null;
	this.labelString = null;
	this.label = null;
	this.head = null;
	this.body = null;
	this.buttons = null;
	DialogBoxMorph.uber.init.call(this);
	this.isDraggable = true;
	this.color = PushButtonMorph.prototype.color;
	this.createLabel();
	this.createButtons();
	this.setExtent(new Point(300, 150));
};

DialogBoxMorph.prototype.inform = function (title, textString, world, pic) {
	var txt = new TextMorph(textString, this.fontSize, this.fontStyle, true, false, 'center', null, null, MorphicPreferences.isFlat ? null : new Point(1, 1), new Color(255, 255, 255));
	if (!this.key) {
		this.key = 'inform' + title + textString;
	}
	this.labelString = title;
	this.createLabel();
	if (pic) {
		this.setPicture(pic);
	}
	if (textString) {
		this.addBody(txt);
	}
	this.addButton('ok', 'OK');
	this.drawNew();
	this.fixLayout();
	this.popUp(world);
};

DialogBoxMorph.prototype.askYesNo = function (title, textString, world, pic) {
	var txt = new TextMorph(textString, this.fontSize, this.fontStyle, true, false, 'center', null, null, MorphicPreferences.isFlat ? null : new Point(1, 1), new Color(255, 255, 255));
	if (!this.key) {
		this.key = 'decide' + title + textString;
	}
	this.labelString = title;
	this.createLabel();
	if (pic) {
		this.setPicture(pic);
	}
	this.addBody(txt);
	this.addButton('ok', 'Yes');
	this.addButton('cancel', 'No');
	this.fixLayout();
	this.drawNew();
	this.fixLayout();
	this.popUp(world);
};

DialogBoxMorph.prototype.prompt = function (title, defaultString, world, pic, choices, isReadOnly, isNumeric, sliderMin, sliderMax, sliderAction) {
	var sld,
		head,
		txt = new InputFieldMorph(defaultString, isNumeric || false, choices || null, choices ? isReadOnly || false : false);
	txt.setWidth(250);
	if (isNumeric) {
		if (pic) {
			head = new AlignmentMorph('column', this.padding);
			pic.setPosition(head.position());
			head.add(pic);
		}
		if (!isNil(sliderMin) && !isNil(sliderMax)) {
			sld = new SliderMorph(sliderMin * 100, sliderMax * 100, parseFloat(defaultString) * 100, (sliderMax - sliderMin) / 10 * 100, 'horizontal');
			sld.alpha = 1;
			sld.color = this.color.lighter(50);
			sld.setHeight(txt.height() * 0.7);
			sld.setWidth(txt.width());
			sld.action = function (num) {
				if (sliderAction) {
					sliderAction(num / 100);
				}
				txt.setContents(num / 100);
				txt.edit();
			};
			if (!head) {
				head = new AlignmentMorph('column', this.padding);
			}
			head.add(sld);
		}
		if (head) {
			head.fixLayout();
			this.setPicture(head);
			head.fixLayout();
		}
	}
	else {
		if (pic) {
			this.setPicture(pic);
		}
	}
	this.reactToChoice = function (inp) {
		if (sld) {
			sld.value = inp * 100;
			sld.drawNew();
			sld.changed();
		}
		if (sliderAction) {
			sliderAction(inp);
		}
	};
	txt.reactToKeystroke = function () {
		var inp = txt.getValue();
		if (sld) {
			inp = Math.max(inp, sliderMin);
			sld.value = inp * 100;
			sld.drawNew();
			sld.changed();
		}
		if (sliderAction) {
			sliderAction(inp);
		}
	};
	this.labelString = title;
	this.createLabel();
	if (!this.key) {
		this.key = 'prompt' + title + defaultString;
	}
	this.addBody(txt);
	txt.drawNew();
	this.addButton('ok', 'OK');
	this.addButton('cancel', 'Cancel');
	this.fixLayout();
	this.drawNew();
	this.fixLayout();
	this.popUp(world);
};

DialogBoxMorph.prototype.promptCode = function (title, defaultString, world, pic, instructions) {
	var frame = new ScrollFrameMorph(),
		text = new TextMorph(defaultString || ''),
		bdy = new AlignmentMorph('column', this.padding),
		size = pic ? Math.max(pic.width, 400) : 400;
	this.getInput = function () {
		return text.text;
	};
	function remarkText(string) {
		return new TextMorph(localize(string), 10, null, false, null, null, null, null, MorphicPreferences.isFlat ? null : new Point(1, 1), new Color(255, 255, 255));
	}
	frame.padding = 6;
	frame.setWidth(size);
	frame.acceptsDrops = false;
	frame.contents.acceptsDrops = false;
	text.fontName = 'monospace';
	text.fontSize = 11;
	text.setPosition(frame.topLeft().add(frame.padding));
	text.enableSelecting();
	text.isEditable = true;
	frame.setHeight(size / 4);
	frame.drawNew = InputFieldMorph.prototype.drawNew;
	frame.addContents(text);
	text.drawNew();
	if (pic) {
		this.setPicture(pic);
	}
	this.labelString = title;
	this.createLabel();
	if (!this.key) {
		this.key = 'promptCode' + title + defaultString;
	}
	bdy.setColor(this.color);
	bdy.add(frame);
	if (instructions) {
		bdy.add(remarkText(instructions));
	}
	bdy.fixLayout();
	this.addBody(bdy);
	frame.drawNew();
	bdy.drawNew();
	this.addButton('ok', 'OK');
	this.addButton('cancel', 'Cancel');
	this.fixLayout();
	this.drawNew();
	this.fixLayout();
	this.popUp(world);
	text.edit();
};

DialogBoxMorph.prototype.promptVector = function (title, point, deflt, xLabel, yLabel, world, pic, msg) {
	var vec = new AlignmentMorph('row', 4),
		xInp = new InputFieldMorph(point.x.toString(), true),
		yInp = new InputFieldMorph(point.y.toString(), true),
		xCol = new AlignmentMorph('column', 2),
		yCol = new AlignmentMorph('column', 2),
		inp = new AlignmentMorph('column', 2),
		bdy = new AlignmentMorph('column', this.padding);
	function labelText(string) {
		return new TextMorph(localize(string), 10, null, false, null, null, null, null, MorphicPreferences.isFlat ? null : new Point(1, 1), new Color(255, 255, 255));
	}
	inp.alignment = 'left';
	inp.setColor(this.color);
	bdy.setColor(this.color);
	xCol.alignment = 'left';
	xCol.setColor(this.color);
	yCol.alignment = 'left';
	yCol.setColor(this.color);
	xCol.add(labelText(xLabel));
	xCol.add(xInp);
	yCol.add(labelText(yLabel));
	yCol.add(yInp);
	vec.add(xCol);
	vec.add(yCol);
	inp.add(vec);
	if (msg) {
		bdy.add(labelText(msg));
	}
	bdy.add(inp);
	vec.fixLayout();
	xCol.fixLayout();
	yCol.fixLayout();
	inp.fixLayout();
	bdy.fixLayout();
	this.labelString = title;
	this.createLabel();
	if (pic) {
		this.setPicture(pic);
	}
	this.addBody(bdy);
	vec.drawNew();
	xCol.drawNew();
	xInp.drawNew();
	yCol.drawNew();
	yInp.drawNew();
	bdy.fixLayout();
	this.addButton('ok', 'OK');
	if (deflt instanceof Point) {
		this.addButton(function () {
			xInp.setContents(deflt.x.toString());
			yInp.setContents(deflt.y.toString());
		}, 'Default');
	}
	this.addButton('cancel', 'Cancel');
	this.fixLayout();
	this.drawNew();
	this.fixLayout();
	this.edit = function () {
		xInp.edit();
	};
	this.getInput = function () {
		return new Point(xInp.getValue(), yInp.getValue());
	};
	if (!this.key) {
		this.key = 'vector' + title;
	}
	this.popUp(world);
};

DialogBoxMorph.prototype.accept = function () {
	if (this.action) {
		if (typeof this.target === 'function') {
			if (typeof this.action === 'function') {
				this.target.call(this.environment, this.action.call());
			}
			else {
				this.target.call(this.environment, this.action);
			}
		}
		else {
			if (typeof this.action === 'function') {
				this.action.call(this.target, this.getInput());
			}
			else {
				this.target[this.action](this.getInput());
			}
		}
	}
	this.destroy();
};

DialogBoxMorph.prototype.withKey = function (key) {
	this.key = key;
	return this;
};

DialogBoxMorph.prototype.popUp = function (world) {
	if (world) {
		if (this.key) {
			if (this.instances[world.stamp]) {
				if (this.instances[world.stamp][this.key]) {
					this.instances[world.stamp][this.key].destroy();
				}
				this.instances[world.stamp][this.key] = this;
			}
			else {
				this.instances[world.stamp] = {};
				this.instances[world.stamp][this.key] = this;
			}
		}
		world.add(this);
		world.keyboardReceiver = this;
		this.setCenter(world.center());
		this.edit();
	}
};

DialogBoxMorph.prototype.destroy = function () {
	DialogBoxMorph.uber.destroy.call(this);
	if (this.key) {
		delete this.instances[this.key];
	}
};

DialogBoxMorph.prototype.ok = function () {
	this.accept();
};

DialogBoxMorph.prototype.cancel = function () {
	this.destroy();
};

DialogBoxMorph.prototype.edit = function () {
	this.children.forEach(function (c) {
		if (c.edit) {
			return c.edit();
		}
	});
};

DialogBoxMorph.prototype.getInput = function () {
	if (this.body instanceof InputFieldMorph) {
		return this.body.getValue();
	}
	return null;
};

DialogBoxMorph.prototype.justDropped = function (hand) {
	hand.world.keyboardReceiver = this;
	this.edit();
};

DialogBoxMorph.prototype.destroy = function () {
	var world = this.world();
	world.keyboardReceiver = null;
	world.hand.destroyTemporaries();
	DialogBoxMorph.uber.destroy.call(this);
};

DialogBoxMorph.prototype.normalizeSpaces = function (string) {
	var ans = '',
		i,
		c,
		flag = false;
	for (i = 0; i < string.length; i += 1) {
		c = string[i];
		if (c === ' ') {
			if (flag) {
				ans += c;
				flag = false;
			}
		}
		else {
			ans += c;
			flag = true;
		}
	}
	return ans.trim();
};

DialogBoxMorph.prototype.createLabel = function () {
	var shading = !MorphicPreferences.isFlat || this.is3D;
	if (this.label) {
		this.label.destroy();
	}
	if (this.labelString) {
		this.label = new StringMorph(localize(this.labelString), this.titleFontSize, this.fontStyle, true, false, false, shading ? new Point(2, 1) : null, this.titleBarColor.darker(this.contrast));
		this.label.color = this.titleTextColor;
		this.label.drawNew();
		this.add(this.label);
	}
};

DialogBoxMorph.prototype.createButtons = function () {
	if (this.buttons) {
		this.buttons.destroy();
	}
	this.buttons = new AlignmentMorph('row', this.padding);
	this.add(this.buttons);
};

DialogBoxMorph.prototype.addButton = function (action, label) {
	var button = new PushButtonMorph(this, action || 'ok', '  ' + localize((label || 'OK')) + '  ');
	button.fontSize = this.buttonFontSize;
	button.corner = this.buttonCorner;
	button.edge = this.buttonEdge;
	button.outline = this.buttonOutline;
	button.outlineColor = this.buttonOutlineColor;
	button.outlineGradient = this.buttonOutlineGradient;
	button.padding = this.buttonPadding;
	button.contrast = this.buttonContrast;
	button.drawNew();
	button.fixLayout();
	this.buttons.add(button);
	return button;
};

DialogBoxMorph.prototype.setPicture = function (aMorphOrCanvas) {
	var morph;
	if (aMorphOrCanvas instanceof Morph) {
		morph = aMorphOrCanvas;
	}
	else {
		morph = new Morph();
		morph.image = aMorphOrCanvas;
		morph.silentSetWidth(aMorphOrCanvas.width);
		morph.silentSetHeight(aMorphOrCanvas.height);
	}
	this.addHead(morph);
};

DialogBoxMorph.prototype.addHead = function (aMorph) {
	if (this.head) {
		this.head.destroy();
	}
	this.head = aMorph;
	this.add(this.head);
};

DialogBoxMorph.prototype.addBody = function (aMorph) {
	if (this.body) {
		this.body.destroy();
	}
	this.body = aMorph;
	this.add(this.body);
};

DialogBoxMorph.prototype.addShadow = function () {
	nop();
};

DialogBoxMorph.prototype.removeShadow = function () {
	nop();
};

DialogBoxMorph.prototype.fixLayout = function () {
	var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
		w;
	if (this.head) {
		this.head.setPosition(this.position().add(new Point(this.padding, th + this.padding)));
		this.silentSetWidth(this.head.width() + this.padding * 2);
		this.silentSetHeight(this.head.height() + this.padding * 2 + th);
	}
	if (this.body) {
		if (this.head) {
			this.body.setPosition(this.head.bottomLeft().add(new Point(0, this.padding)));
			this.silentSetWidth(Math.max(this.width(), this.body.width() + this.padding * 2));
			this.silentSetHeight(this.height() + this.body.height() + this.padding);
			w = this.width();
			this.head.setLeft(this.left() + Math.round((w - this.head.width()) / 2));
			this.body.setLeft(this.left() + Math.round((w - this.body.width()) / 2));
		}
		else {
			this.body.setPosition(this.position().add(new Point(this.padding, th + this.padding)));
			this.silentSetWidth(this.body.width() + this.padding * 2);
			this.silentSetHeight(this.body.height() + this.padding * 2 + th);
		}
	}
	if (this.label) {
		this.label.setCenter(this.center());
		this.label.setTop(this.top() + (th - this.label.height()) / 2);
	}
	if (this.buttons && (this.buttons.children.length > 0)) {
		this.buttons.fixLayout();
		this.silentSetHeight(this.height() + this.buttons.height() + this.padding);
		this.buttons.setCenter(this.center());
		this.buttons.setBottom(this.bottom() - this.padding);
	}
};

DialogBoxMorph.prototype.shadowImage = function (off, color) {
	var fb,
		img,
		outline,
		sha,
		ctx,
		offset = off || new Point(7, 7),
		clr = color || new Color(0, 0, 0);
	fb = this.extent();
	img = this.image;
	outline = newCanvas(fb);
	ctx = outline.getContext('2d');
	ctx.drawImage(img, 0, 0);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.drawImage(img, -offset.x, -offset.y);
	sha = newCanvas(fb);
	ctx = sha.getContext('2d');
	ctx.drawImage(outline, 0, 0);
	ctx.globalCompositeOperation = 'source-atop';
	ctx.fillStyle = clr.toString();
	ctx.fillRect(0, 0, fb.x, fb.y);
	return sha;
};

DialogBoxMorph.prototype.shadowImageBlurred = function (off, color) {
	var fb,
		img,
		sha,
		ctx,
		offset = off || new Point(7, 7),
		blur = this.shadowBlur,
		clr = color || new Color(0, 0, 0);
	fb = this.extent().add(blur * 2);
	img = this.image;
	sha = newCanvas(fb);
	ctx = sha.getContext('2d');
	ctx.shadowOffsetX = offset.x;
	ctx.shadowOffsetY = offset.y;
	ctx.shadowBlur = blur;
	ctx.shadowColor = clr.toString();
	ctx.drawImage(img, blur - offset.x, blur - offset.y);
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	ctx.globalCompositeOperation = 'destination-out';
	ctx.drawImage(img, blur - offset.x, blur - offset.y);
	return sha;
};

DialogBoxMorph.prototype.processKeyPress = function () {
	nop();
};

DialogBoxMorph.prototype.processKeyDown = function (event) {
	switch (event.keyCode) {
		case 13:
			this.ok();
			break;
		case 27:
			this.cancel();
			break;
		default:
			nop();
	}
};

DialogBoxMorph.prototype.drawNew = function () {
	this.fullChanged();
	Morph.prototype.trackChanges = false;
	DialogBoxMorph.uber.removeShadow.call(this);
	this.fixLayout();
	var context,
		gradient,
		w = this.width(),
		h = this.height(),
		th = Math.floor(fontHeight(this.titleFontSize) + this.titlePadding * 2),
		shift = this.corner / 2,
		x,
		y,
		isFlat = MorphicPreferences.isFlat && !this.is3D;
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	if (isFlat) {
		context.fillStyle = this.titleBarColor.toString();
	}
	else {
		gradient = context.createLinearGradient(0, 0, 0, th);
		gradient.addColorStop(0, this.titleBarColor.lighter(this.contrast / 2).toString());
		gradient.addColorStop(1, this.titleBarColor.darker(this.contrast).toString());
		context.fillStyle = gradient;
	}
	context.beginPath();
	this.outlinePathTitle(context, isFlat ? 0 : this.corner);
	context.closePath();
	context.fill();
	context.fillStyle = this.color.toString();
	context.beginPath();
	this.outlinePathBody(context, isFlat ? 0 : this.corner);
	context.closePath();
	context.fill();
	if (isFlat) {
		DialogBoxMorph.uber.addShadow.call(this);
		Morph.prototype.trackChanges = true;
		this.fullChanged();
		return;
	}
	gradient = context.createLinearGradient(0, h - this.corner, 0, h);
	gradient.addColorStop(0, this.color.toString());
	gradient.addColorStop(1, this.color.darker(this.contrast.toString()));
	context.lineWidth = this.corner;
	context.lineCap = 'round';
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(this.corner, h - shift);
	context.lineTo(this.corner + 1, h - shift);
	context.stroke();
	gradient = context.createLinearGradient(0, h - this.corner, 0, h);
	gradient.addColorStop(0, this.color.toString());
	gradient.addColorStop(1, this.color.darker(this.contrast.toString()));
	context.lineWidth = this.corner;
	context.lineCap = 'butt';
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(this.corner, h - shift);
	context.lineTo(w - this.corner, h - shift);
	context.stroke();
	gradient = context.createLinearGradient(w - this.corner, 0, w, 0);
	gradient.addColorStop(0, this.color.toString());
	gradient.addColorStop(1, this.color.darker(this.contrast).toString());
	context.lineWidth = this.corner;
	context.lineCap = 'butt';
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(w - shift, th);
	context.lineTo(w - shift, h - this.corner);
	context.stroke();
	x = w - this.corner;
	y = h - this.corner;
	gradient = context.createRadialGradient(x, y, 0, x, y, this.corner);
	gradient.addColorStop(0, this.color.toString());
	gradient.addColorStop(1, this.color.darker(this.contrast.toString()));
	context.lineCap = 'butt';
	context.strokeStyle = gradient;
	context.beginPath();
	context.arc(x, y, shift, radians(90), radians(0), true);
	context.stroke();
	gradient = context.createLinearGradient(0, 0, this.corner, 0);
	gradient.addColorStop(1, this.color.toString());
	gradient.addColorStop(0, this.color.lighter(this.contrast).toString());
	context.lineCap = 'butt';
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(shift, th);
	context.lineTo(shift, h - this.corner * 2);
	context.stroke();
	gradient = context.createLinearGradient(0, 0, this.corner, 0);
	gradient.addColorStop(1, this.color.toString());
	gradient.addColorStop(0, this.color.lighter(this.contrast).toString());
	context.lineCap = 'round';
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(shift, h - this.corner * 2);
	context.lineTo(shift, h - this.corner - shift);
	context.stroke();
	DialogBoxMorph.uber.addShadow.call(this);
	Morph.prototype.trackChanges = true;
	this.fullChanged();
};

DialogBoxMorph.prototype.outlinePathTitle = function (context, radius) {
	var w = this.width(),
		h = Math.ceil(fontHeight(this.titleFontSize)) + this.titlePadding * 2;
	context.arc(radius, radius, radius, radians(-180), radians(-90), false);
	context.arc(w - radius, radius, radius, radians(-90), radians(-0), false);
	context.lineTo(w, h);
	context.lineTo(0, h);
};

DialogBoxMorph.prototype.outlinePathBody = function (context, radius) {
	var w = this.width(),
		h = this.height(),
		th = Math.floor(fontHeight(this.titleFontSize)) + this.titlePadding * 2;
	context.moveTo(0, th);
	context.lineTo(w, th);
	context.arc(w - radius, h - radius, radius, radians(0), radians(90), false);
	context.arc(radius, h - radius, radius, radians(90), radians(180), false);
};

AlignmentMorph.prototype = new Morph();
AlignmentMorph.prototype.constructor = AlignmentMorph;
AlignmentMorph.uber = Morph.prototype;
function AlignmentMorph(orientation, padding) {
	this.init(orientation, padding);
}

AlignmentMorph.prototype.init = function (orientation, padding) {
	this.orientation = orientation || 'row';
	this.alignment = 'center';
	this.padding = padding || 0;
	this.respectHiddens = false;
	AlignmentMorph.uber.init.call(this);
};

AlignmentMorph.prototype.drawNew = function () {
	this.image = newCanvas(new Point(1, 1));
	this.fixLayout();
};

AlignmentMorph.prototype.fixLayout = function () {
	var myself = this,
		last = null,
		newBounds;
	if (this.children.length === 0) {
		return null;
	}
	this.children.forEach(function (c) {
		var cfb = c.fullBounds(),
			lfb;
		if (c.isVisible || myself.respectHiddens) {
			if (last) {
				lfb = last.fullBounds();
				if (myself.orientation === 'row') {
					c.setPosition(lfb.topRight().add(new Point(myself.padding, (lfb.height() - cfb.height()) / 2)));
				}
				else {
					c.setPosition(lfb.bottomLeft().add(new Point(myself.alignment === 'center' ? (lfb.width() - cfb.width()) / 2 : 0, myself.padding)));
				}
			}
			else {
				newBounds = cfb;
			}
			last = c;
		}
	});
	this.bounds = newBounds;
};

InputFieldMorph.prototype = new Morph();
InputFieldMorph.prototype.constructor = InputFieldMorph;
InputFieldMorph.uber = Morph.prototype;
InputFieldMorph.prototype.edge = 2;
InputFieldMorph.prototype.fontSize = 12;
InputFieldMorph.prototype.typeInPadding = 2;
InputFieldMorph.prototype.contrast = 65;
function InputFieldMorph(text, isNumeric, choiceDict, isReadOnly) {
	this.init(text, isNumeric, choiceDict, isReadOnly);
}

InputFieldMorph.prototype.init = function (text, isNumeric, choiceDict, isReadOnly) {
	var contents = new StringFieldMorph(text || ''),
		arrow = new ArrowMorph('down', 0, Math.max(Math.floor(this.fontSize / 6), 1));
	this.choices = choiceDict || null;
	this.isReadOnly = isReadOnly || false;
	this.isNumeric = isNumeric || false;
	contents.alpha = 0;
	contents.fontSize = this.fontSize;
	contents.drawNew();
	this.oldContentsExtent = contents.extent();
	this.isNumeric = isNumeric || false;
	InputFieldMorph.uber.init.call(this);
	this.color = new Color(255, 255, 255);
	this.add(contents);
	this.add(arrow);
	contents.isDraggable = false;
	this.drawNew();
};

InputFieldMorph.prototype.contents = function () {
	return detect(this.children, function (child) {
		return (child instanceof StringFieldMorph);
	});
};

InputFieldMorph.prototype.arrow = function () {
	return detect(this.children, function (child) {
		return (child instanceof ArrowMorph);
	});
};

InputFieldMorph.prototype.setChoice = function (aStringOrFloat) {
	this.setContents(aStringOrFloat);
	this.escalateEvent('reactToChoice', aStringOrFloat);
};

InputFieldMorph.prototype.setContents = function (aStringOrFloat) {
	var cnts = this.contents();
	cnts.text.text = aStringOrFloat;
	if (aStringOrFloat === undefined) {
		return null;
	}
	if (aStringOrFloat === null) {
		cnts.text.text = '';
	}
	else if (aStringOrFloat.toString) {
		cnts.text.text = aStringOrFloat.toString();
	}
	cnts.drawNew();
	cnts.changed();
};

InputFieldMorph.prototype.edit = function () {
	var c = this.contents();
	c.text.edit();
	c.text.selectAll();
};

InputFieldMorph.prototype.setIsNumeric = function (bool) {
	var value;
	this.isNumeric = bool;
	this.contents().isNumeric = bool;
	this.contents().text.isNumeric = bool;
	value = this.getValue();
	if (this.isNumeric) {
		value = parseFloat(value);
		if (isNaN(value)) {
			value = null;
		}
	}
	this.setContents(value);
};

InputFieldMorph.prototype.dropDownMenu = function () {
	var choices = this.choices,
		key,
		menu = new MenuMorph(this.setChoice, null, this, this.fontSize);
	if (choices instanceof Function) {
		choices = choices.call(this);
	}
	else if (isString(choices)) {
		choices = this[choices]();
	}
	if (!choices) {
		return null;
	}
	menu.addItem(' ', null);
	if (choices instanceof Array) {
		choices.forEach(function (choice) {
			menu.addItem(choice[0], choice[1]);
		});
	}
	else {
		for (key in choices) {
			if (Object.prototype.hasOwnProperty.call(choices, key)) {
				if (key[0] === '~') {
					menu.addLine();
				}
				else {
					menu.addItem(key, choices[key]);
				}
			}
		}
	}
	if (menu.items.length > 0) {
		menu.popUpAtHand(this.world());
	}
	else {
		return null;
	}
};

InputFieldMorph.prototype.fixLayout = function () {
	var contents = this.contents(),
		arrow = this.arrow();
	if (!contents) {
		return null;
	}
	contents.isNumeric = this.isNumeric;
	contents.isEditable = (!this.isReadOnly);
	if (this.choices) {
		arrow.setSize(this.fontSize);
		arrow.show();
	}
	else {
		arrow.setSize(0);
		arrow.hide();
	}
	this.silentSetHeight(contents.height() + this.edge * 2 + this.typeInPadding * 2);
	this.silentSetWidth(Math.max(contents.minWidth + this.edge * 2 + this.typeInPadding * 2, this.width()));
	contents.setWidth(this.width() - this.edge - this.typeInPadding - (this.choices ? arrow.width() + this.typeInPadding : 0));
	contents.silentSetPosition(new Point(this.edge, this.edge).add(this.typeInPadding).add(this.position()));
	arrow.silentSetPosition(new Point(this.right() - arrow.width() - this.edge, contents.top()));
};

InputFieldMorph.prototype.mouseClickLeft = function (pos) {
	if (this.arrow().bounds.containsPoint(pos)) {
		this.dropDownMenu();
	}
	else if (this.isReadOnly) {
		this.dropDownMenu();
	}
	else {
		this.escalateEvent('mouseClickLeft', pos);
	}
};

InputFieldMorph.prototype.getValue = function () {
	var num,
		contents = this.contents();
	if (this.isNumeric) {
		num = parseFloat(contents.text);
		if (!isNaN(num)) {
			return num;
		}
	}
	return this.normalizeSpaces(contents.string());
};

InputFieldMorph.prototype.normalizeSpaces = DialogBoxMorph.prototype.normalizeSpaces;
InputFieldMorph.prototype.drawNew = function () {
	var context,
		borderColor;
	this.fixLayout();
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	if (this.parent) {
		if (this.parent.color.eq(new Color(255, 255, 255))) {
			this.color = this.parent.color.darker(this.contrast * 0.1);
		}
		else {
			this.color = this.parent.color.lighter(this.contrast * 0.75);
		}
		borderColor = this.parent.color;
	}
	else {
		borderColor = new Color(120, 120, 120);
	}
	context.fillStyle = this.color.toString();
	this.cachedClr = borderColor.toString();
	this.cachedClrBright = borderColor.lighter(this.contrast).toString();
	this.cachedClrDark = borderColor.darker(this.contrast).toString();
	context.fillRect(this.edge, this.edge, this.width() - this.edge * 2, this.height() - this.edge * 2);
	this.drawRectBorder(context);
};

InputFieldMorph.prototype.drawRectBorder = function (context) {
	var shift = this.edge * 0.5,
		gradient;
	context.lineWidth = this.edge;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.shadowOffsetY = shift;
	context.shadowBlur = this.edge * 4;
	context.shadowColor = this.cachedClrDark;
	gradient = context.createLinearGradient(0, 0, 0, this.edge);
	gradient.addColorStop(0, this.cachedClr);
	gradient.addColorStop(1, this.cachedClrDark);
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(this.edge, shift);
	context.lineTo(this.width() - this.edge - shift, shift);
	context.stroke();
	context.shadowOffsetY = 0;
	gradient = context.createLinearGradient(0, 0, this.edge, 0);
	gradient.addColorStop(0, this.cachedClr);
	gradient.addColorStop(1, this.cachedClrDark);
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(shift, this.edge);
	context.lineTo(shift, this.height() - this.edge - shift);
	context.stroke();
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	gradient = context.createLinearGradient(0, this.height() - this.edge, 0, this.height());
	gradient.addColorStop(0, this.cachedClrBright);
	gradient.addColorStop(1, this.cachedClr);
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(this.edge, this.height() - shift);
	context.lineTo(this.width() - this.edge, this.height() - shift);
	context.stroke();
	gradient = context.createLinearGradient(this.width() - this.edge, 0, this.width(), 0);
	gradient.addColorStop(0, this.cachedClrBright);
	gradient.addColorStop(1, this.cachedClr);
	context.strokeStyle = gradient;
	context.beginPath();
	context.moveTo(this.width() - shift, this.edge);
	context.lineTo(this.width() - shift, this.height() - this.edge);
	context.stroke();
};


