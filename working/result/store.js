function XML_Serializer() {
	this.contents = [];
	this.media = [];
	this.isCollectingMedia = false;
}

XML_Serializer.prototype.idProperty = 'serializationID';
XML_Serializer.prototype.mediaIdProperty = 'serializationMediaID';
XML_Serializer.prototype.mediaDetectionProperty = 'isMedia';
XML_Serializer.prototype.version = 1;
XML_Serializer.prototype.load = function (xmlString) {
	nop(xmlString);
	throw new Error('loading should be implemented in heir of XML_Serializer');
};

XML_Serializer.prototype.parse = function (xmlString) {
	var element = new XML_Element();
	element.parseString(xmlString);
	return element;
};

var SnapSerializer;
SnapSerializer.prototype = new XML_Serializer();
SnapSerializer.prototype.constructor = SnapSerializer;
SnapSerializer.uber = XML_Serializer.prototype;
SnapSerializer.prototype.watcherLabels = {
	xPosition : 'x position',
	yPosition : 'y position',
	direction : 'direction',
	getScale : 'size',
	getTempo : 'tempo',
	getLastAnswer : 'answer',
	getLastMessage : 'message',
	getTimer : 'timer',
	getCostumeIdx : 'costume #',
	reportMouseX : 'mouse x',
	reportMouseY : 'mouse y',
	reportThreadCount : 'processes'
};

function SnapSerializer() {
	this.init();
}

SnapSerializer.prototype.init = function () {
	this.project = {};
	this.objects = {};
	this.mediaDict = {};
};

SnapSerializer.prototype.load = function (xmlString, ide) {
	return this.loadProjectModel(this.parse(xmlString), ide);
};

SnapSerializer.prototype.loadProjectModel = function (xmlNode, ide) {
	return this.rawLoadProjectModel(xmlNode);
};

SnapSerializer.prototype.rawLoadProjectModel = function (xmlNode) {
	var myself = this,
		project = {
		sprites : {
		}
	},
		model,
		nameID;
	this.project = project;
	model = {
		project : xmlNode
	};
	this.objects = {};
	model.notes = model.project.childNamed('notes');
	model.globalVariables = model.project.childNamed('variables');
	project.globalVariables = new VariableFrame();
	model.stage = model.project.require('stage');
	StageMorph.prototype.frameRate = 0;
	project.stage = new StageMorph(project.globalVariables);
	if (Object.prototype.hasOwnProperty.call(model.stage.attributes, 'id')) {
		this.objects[model.stage.attributes.id] = project.stage;
	}
	if (model.stage.attributes.name) {
		project.stage.name = model.stage.attributes.name;
	}
	if (model.stage.attributes.scheduled === 'true') {
		project.stage.fps = 30;
		StageMorph.prototype.frameRate = 30;
	}
	project.stage.setTempo(model.stage.attributes.tempo);
	StageMorph.prototype.dimensions = new Point(480, 360);
	if (model.stage.attributes.width) {
		StageMorph.prototype.dimensions.x = Math.max(+model.stage.attributes.width, 480);
	}
	if (model.stage.attributes.height) {
		StageMorph.prototype.dimensions.y = Math.max(+model.stage.attributes.height, 180);
	}
	project.stage.setExtent(StageMorph.prototype.dimensions);
	SpriteMorph.prototype.useFlatLineEnds = model.stage.attributes.lines === 'flat';
	project.stage.isThreadSafe = model.stage.attributes.threadsafe === 'true';
	StageMorph.prototype.enableCodeMapping = model.stage.attributes.codify === 'true';
	StageMorph.prototype.enableInheritance = model.stage.attributes.inheritance === 'true';
	model.hiddenPrimitives = model.project.childNamed('hidden');
	if (model.hiddenPrimitives) {
		model.hiddenPrimitives.contents.split(' ').forEach(function (sel) {
			if (sel) {
				StageMorph.prototype.hiddenPrimitives[sel] = true;
			}
		});
	}
	model.codeHeaders = model.project.childNamed('headers');
	if (model.codeHeaders) {
		model.codeHeaders.children.forEach(function (xml) {
			StageMorph.prototype.codeHeaders[xml.tag] = xml.contents;
		});
	}
	model.codeMappings = model.project.childNamed('code');
	if (model.codeMappings) {
		model.codeMappings.children.forEach(function (xml) {
			StageMorph.prototype.codeMappings[xml.tag] = xml.contents;
		});
	}
	model.globalBlocks = model.project.childNamed('blocks');
	if (model.globalBlocks) {
		this.loadCustomBlocks(project.stage, model.globalBlocks, true);
		this.populateCustomBlocks(project.stage, model.globalBlocks, true);
	}
	this.loadObject(project.stage, model.stage);
	model.sprites = model.stage.require('sprites');
	project.sprites[project.stage.name] = project.stage;
	model.sprites.childrenNamed('sprite').forEach(function (model) {
		myself.loadValue(model);
	});
	myself.project.stage.children.forEach(function (sprite) {
		var exemplar,
			anchor;
		if (sprite.inheritanceInfo) {
			exemplar = myself.project.sprites[sprite.inheritanceInfo.exemplar];
			if (exemplar) {
				sprite.setExemplar(exemplar);
			}
		}
		if (sprite.nestingInfo) {
			anchor = myself.project.sprites[sprite.nestingInfo.anchor];
			if (anchor) {
				anchor.attachPart(sprite);
			}
			sprite.rotatesWithAnchor = (sprite.nestingInfo.synch === 'true');
		}
	});
	myself.project.stage.children.forEach(function (sprite) {
		delete sprite.inheritanceInfo;
		if (sprite.nestingInfo) {
			sprite.nestingScale = +(sprite.nestingInfo.scale || sprite.scale);
			delete sprite.nestingInfo;
		}
	});
	if (model.globalVariables) {
		this.loadVariables(project.globalVariables, model.globalVariables);
	}
	this.objects = {};
	model.sprites.childrenNamed('watcher').forEach(function (model) {
		var watcher,
			color,
			target,
			hidden,
			extX,
			extY;
		color = myself.loadColor(model.attributes.color);
		target = Object.prototype.hasOwnProperty.call(model.attributes, 'scope') ? project.sprites[model.attributes.scope] : null;
		hidden = Object.prototype.hasOwnProperty.call(model.attributes, 'hidden') && (model.attributes.hidden !== 'false');
		if (Object.prototype.hasOwnProperty.call(model.attributes, 'var')) {
			watcher = new WatcherMorph(model.attributes['var'], color, isNil(target) ? project.globalVariables : target.variables, model.attributes['var'], hidden);
		}
		else {
			watcher = new WatcherMorph(localize(myself.watcherLabels[model.attributes.s]), color, target, model.attributes.s, hidden);
		}
		watcher.setStyle(model.attributes.style || 'normal');
		if (watcher.style === 'slider') {
			watcher.setSliderMin(model.attributes.min || '1', true);
			watcher.setSliderMax(model.attributes.max || '100', true);
		}
		watcher.setPosition(project.stage.topLeft().add(new Point(+model.attributes.x || 0, +model.attributes.y || 0)));
		project.stage.add(watcher);
		watcher.onNextStep = function () {
			this.currentValue = null;
		};
		if (watcher.currentValue instanceof List) {
			extX = model.attributes.extX;
			if (extX) {
				watcher.cellMorph.contentsMorph.setWidth(+extX);
			}
			extY = model.attributes.extY;
			if (extY) {
				watcher.cellMorph.contentsMorph.setHeight(+extY);
			}
			watcher.cellMorph.contentsMorph.handle.drawNew();
		}
	});
	this.objects = {};
	return project;
};

SnapSerializer.prototype.loadObject = function (object, model) {
	var blocks = model.require('blocks');
	this.loadNestingInfo(object, model);
	this.loadCostumes(object, model);
	this.loadSounds(object, model);
	this.loadCustomBlocks(object, blocks);
	this.populateCustomBlocks(object, blocks);
	this.loadVariables(object.variables, model.require('variables'));
	this.loadScripts(object.scripts, model.require('scripts'));
};

SnapSerializer.prototype.loadNestingInfo = function (object, model) {
	var info = model.childNamed('nest');
	if (info) {
		object.nestingInfo = info.attributes;
	}
};

SnapSerializer.prototype.loadCostumes = function (object, model) {
	var costumes = model.childNamed('costumes'),
		costume;
	if (costumes) {
		object.costumes = this.loadValue(costumes.require('list'));
	}
	if (Object.prototype.hasOwnProperty.call(model.attributes, 'costume')) {
		costume = object.costumes.asArray()[model.attributes.costume - 1];
		if (costume) {
			if (costume.loaded) {
				object.wearCostume(costume);
			}
			else {
				costume.loaded = function () {
					object.wearCostume(costume);
					this.loaded = true;
				};
			}
		}
	}
};

SnapSerializer.prototype.loadSounds = function (object, model) {
	var sounds = model.childNamed('sounds');
	if (sounds) {
		object.sounds = this.loadValue(sounds.require('list'));
	}
};

SnapSerializer.prototype.loadVariables = function (varFrame, element) {
	var myself = this;
	element.children.forEach(function (child) {
		var value;
		if (child.tag !== 'variable') {
			return;
		}
		value = child.children[0];
		varFrame.vars[child.attributes.name] = new Variable(value ? myself.loadValue(value) : 0);
	});
};

SnapSerializer.prototype.loadCustomBlocks = function (object, element, isGlobal) {
	var myself = this;
	element.children.forEach(function (child) {
		var definition,
			names,
			inputs,
			header,
			code,
			comment,
			i;
		if (child.tag !== 'block-definition') {
			return;
		}
		definition = new CustomBlockDefinition(child.attributes.s || '', object);
		definition.category = child.attributes.category || 'other';
		definition.type = child.attributes.type || 'command';
		definition.isGlobal = (isGlobal === true);
		if (definition.isGlobal) {
			object.globalBlocks.push(definition);
		}
		else {
			object.customBlocks.push(definition);
		}
		names = definition.parseSpec(definition.spec).filter(function (str) {
			return str.charAt(0) === '%' && str.length > 1;
		}).map(function (str) {
			return str.substr(1);
		});
		definition.names = names;
		inputs = child.childNamed('inputs');
		if (inputs) {
			i = -1;
			inputs.children.forEach(function (child) {
				var options = child.childNamed('options');
				if (child.tag !== 'input') {
					return;
				}
				i += 1;
				definition.declarations[names[i]] = [child.attributes.type, child.contents, options ? options.contents : undefined, child.attributes.readonly === 'true'];
			});
		}
		header = child.childNamed('header');
		if (header) {
			definition.codeHeader = header.contents;
		}
		code = child.childNamed('code');
		if (code) {
			definition.codeMapping = code.contents;
		}
		comment = child.childNamed('comment');
	});
};

SnapSerializer.prototype.populateCustomBlocks = function (object, element, isGlobal) {
	var myself = this;
	element.children.forEach(function (child, index) {
		var definition,
			script,
			scripts;
		if (child.tag !== 'block-definition') {
			return;
		}
		definition = isGlobal ? object.globalBlocks[index] : object.customBlocks[index];
		script = child.childNamed('script');
		if (script) {
			definition.body = new Context(null, script ? myself.loadScript(script) : null, null, object);
			definition.body.inputs = definition.names.slice(0);
		}
		scripts = child.childNamed('scripts');
		if (scripts) {
			definition.scripts = myself.loadScriptsArray(scripts);
		}
		delete definition.names;
	});
};

SnapSerializer.prototype.loadScripts = function (scripts, model) {
	var myself = this,
		scale = SyntaxElementMorph.prototype.scale;
	model.children.forEach(function (child) {
		var element;
		if (child.tag === 'script') {
			element = myself.loadScript(child);
			if (!element) {
				return;
			}
			element.setPosition(new Point((+child.attributes.x || 0) * scale, (+child.attributes.y || 0) * scale).add(scripts.topLeft()));
			scripts.add(element);
			element.fixBlockColor(null, true);
		}
		else if (child.tag === 'comment') {
			if (!element) {
				return;
			}
			element.setPosition(new Point((+child.attributes.x || 0) * scale, (+child.attributes.y || 0) * scale).add(scripts.topLeft()));
			scripts.add(element);
		}
	});
};

SnapSerializer.prototype.loadScriptsArray = function (model) {
	var myself = this,
		scale = SyntaxElementMorph.prototype.scale,
		scripts = [];
	model.children.forEach(function (child) {
		var element;
		if (child.tag === 'script') {
			element = myself.loadScript(child);
			if (!element) {
				return;
			}
			element.setPosition(new Point((+child.attributes.x || 0) * scale, (+child.attributes.y || 0) * scale));
			scripts.push(element);
			element.fixBlockColor(null, true);
		}
		else if (child.tag === 'comment') {
			if (!element) {
				return;
			}
			element.setPosition(new Point((+child.attributes.x || 0) * scale, (+child.attributes.y || 0) * scale));
			scripts.push(element);
		}
	});
	return scripts;
};

SnapSerializer.prototype.loadScript = function (model) {
	var topBlock,
		block,
		nextBlock,
		myself = this;
	model.children.forEach(function (child) {
		nextBlock = myself.loadBlock(child);
		if (!nextBlock) {
			return;
		}
		if (block) {
			block.nextBlock(nextBlock);
		}
		else {
			topBlock = nextBlock;
		}
		block = nextBlock;
	});
	return topBlock;
};

SnapSerializer.prototype.loadBlock = function (model, isReporter) {
	var block,
		info,
		inputs,
		isGlobal,
		rm,
		receiver;
	if (model.tag === 'block') {
		if (Object.prototype.hasOwnProperty.call(model.attributes, 'var')) {
			return SpriteMorph.prototype.variableBlock(model.attributes['var']);
		}
		block = SpriteMorph.prototype.blockForSelector(model.attributes.s);
	}
	else if (model.tag === 'custom-block') {
		isGlobal = model.attributes.scope ? false : true;
		receiver = isGlobal ? this.project.stage : this.project.sprites[model.attributes.scope];
		rm = model.childNamed('receiver');
		if (rm && rm.children[0]) {
			receiver = this.loadValue(model.childNamed('receiver').children[0]);
		}
		if (!receiver) {
			if (!isGlobal) {
				receiver = this.project.stage;
			}
			else {
				return this.obsoleteBlock(isReporter);
			}
		}
		if (isGlobal) {
			info = detect(receiver.globalBlocks, function (block) {
				return block.blockSpec() === model.attributes.s;
			});
		}
		else {
			info = detect(receiver.customBlocks, function (block) {
				return block.blockSpec() === model.attributes.s;
			});
		}
		if (!info) {
			return this.obsoleteBlock(isReporter);
		}
		block = info.type === 'command' ? new CustomCommandBlockMorph(info, false) : new CustomReporterBlockMorph(info, info.type === 'predicate', false);
	}
	if (block === null) {
		block = this.obsoleteBlock(isReporter);
	}
	block.isDraggable = true;
	inputs = block.inputs();
	model.children.forEach(function (child, i) {
		if (!(child.tag === 'comment')) if (child.tag === 'receiver') {
			nop();
		}
		else {
			this.loadInput(child, inputs[i], block);
		}
	}, this);
	block.cachedInputs = null;
	return block;
};

SnapSerializer.prototype.obsoleteBlock = function (isReporter) {
	var block = isReporter ? new ReporterBlockMorph() : new CommandBlockMorph();
	block.selector = 'nop';
	block.color = new Color(200, 0, 20);
	block.setSpec('Obsolete!');
	block.isDraggable = true;
	return block;
};

SnapSerializer.prototype.loadInput = function (model, input, block) {
	var inp,
		val,
		myself = this;
	if (model.tag === 'script') {
		inp = this.loadScript(model);
		if (inp) {
			input.add(inp);
			input.fixLayout();
		}
	}
	else if (model.tag === 'autolambda' && model.children[0]) {
		inp = this.loadBlock(model.children[0], true);
		if (inp) {
			input.silentReplaceInput(input.children[0], inp);
			input.fixLayout();
		}
	}
	else if (model.tag === 'list') {
		while (input.inputs().length > 0) {
			input.removeInput();
		}
		model.children.forEach(function (item) {
			input.addInput();
			myself.loadInput(item, input.children[input.children.length - 2], input);
		});
		input.fixLayout();
	}
	else if (model.tag === 'block' || model.tag === 'custom-block') {
		block.silentReplaceInput(input, this.loadBlock(model, true));
	}
	else if (model.tag === 'color') {
		input.setColor(this.loadColor(model.contents));
	}
	else {
		val = this.loadValue(model);
		if (!isNil(val) && input.setContents) {
			input.setContents(this.loadValue(model));
		}
	}
};

SnapSerializer.prototype.loadValue = function (model) {
	var v,
		items,
		el,
		center,
		image,
		name,
		audio,
		option,
		myself = this;
	function record() {
		if (Object.prototype.hasOwnProperty.call(model.attributes, 'id')) {
			myself.objects[model.attributes.id] = v;
		}
		if (Object.prototype.hasOwnProperty.call(model.attributes, 'mediaID')) {
			myself.mediaDict[model.attributes.mediaID] = v;
		}
	}
	switch (model.tag) {
		case 'ref':
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'id')) {
				return this.objects[model.attributes.id];
			}
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'mediaID')) {
				return this.mediaDict[model.attributes.mediaID];
			}
			throw new Error('expecting a reference id');
		case 'l':
			option = model.childNamed('option');
			return option ? [option.contents] : model.contents;
		case 'bool':
			return model.contents === 'true';
		case 'list':
			if (model.attributes.hasOwnProperty('linked')) {
				items = model.childrenNamed('item');
				if (items.length === 0) {
					v = new List();
					record();
					return v;
				}
				items.forEach(function (item) {
					var value = item.children[0];
					if (v === undefined) {
						v = new List();
						record();
					}
					else {
						v = v.rest = new List();
					}
					v.isLinked = true;
					if (!value) {
						v.first = 0;
					}
					else {
						v.first = myself.loadValue(value);
					}
				});
				return v;
			}
			v = new List();
			record();
			v.contents = model.childrenNamed('item').map(function (item) {
				var value = item.children[0];
				if (!value) {
					return 0;
				}
				return myself.loadValue(value);
			});
			return v;
		case 'sprite':
			v = new SpriteMorph(myself.project.globalVariables);
			if (model.attributes.id) {
				myself.objects[model.attributes.id] = v;
			}
			if (model.attributes.name) {
				v.name = model.attributes.name;
				myself.project.sprites[model.attributes.name] = v;
			}
			if (model.attributes.idx) {
				v.idx = +model.attributes.idx;
			}
			if (model.attributes.color) {
				v.color = myself.loadColor(model.attributes.color);
			}
			if (model.attributes.pen) {
				v.penPoint = model.attributes.pen;
			}
			myself.project.stage.add(v);
			v.scale = parseFloat(model.attributes.scale || '1');
			v.rotationStyle = parseFloat(model.attributes.rotation || '1');
			v.isDraggable = model.attributes.draggable !== 'false';
			v.isVisible = model.attributes.hidden !== 'true';
			v.heading = parseFloat(model.attributes.heading) || 0;
			v.drawNew();
			v.gotoXY(+model.attributes.x || 0, +model.attributes.y || 0);
			myself.loadObject(v, model);
			return v;
		case 'context':
			v = new Context(null);
			record();
			el = model.childNamed('script');
			if (el) {
				v.expression = this.loadScript(el);
			}
			else {
				el = model.childNamed('block') || model.childNamed('custom-block');
				if (el) {
					v.expression = this.loadBlock(el);
				}
				else {
					el = model.childNamed('l');
					if (el) {
						v.expression = new InputSlotMorph(el.contents);
					}
				}
			}
			el = model.childNamed('receiver');
			if (el) {
				el = el.childNamed('ref') || el.childNamed('sprite');
				if (el) {
					v.receiver = this.loadValue(el);
				}
			}
			el = model.childNamed('inputs');
			if (el) {
				el.children.forEach(function (item) {
					if (item.tag === 'input') {
						v.inputs.push(item.contents);
					}
				});
			}
			el = model.childNamed('variables');
			if (el) {
				this.loadVariables(v.variables, el);
			}
			el = model.childNamed('context');
			if (el) {
				v.outerContext = this.loadValue(el);
			}
			if (v.outerContext && v.receiver && !v.outerContext.variables.parentFrame) {
				v.outerContext.variables.parentFrame = v.receiver.variables;
			}
			return v;
		case 'costume':
			center = new Point();
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'center-x')) {
				center.x = parseFloat(model.attributes['center-x']);
			}
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'center-y')) {
				center.y = parseFloat(model.attributes['center-y']);
			}
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'name')) {
				name = model.attributes.name;
			}
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'image')) {
				image = new Image();
				if (model.attributes.image.indexOf('data:image/svg+xml') === 0 && !MorphicPreferences.rasterizeSVGs) {
					v = new SVG_Costume(null, name, center);
					image.onload = function () {
						v.contents = image;
						v.version = +new Date();
						if (typeof v.loaded === 'function') {
							v.loaded();
						}
						else {
							v.loaded = true;
						}
					};
				}
				else {
					v = new Costume(null, name, center);
					image.onload = function () {
						var canvas = newCanvas(new Point(image.width, image.height)),
							context = canvas.getContext('2d');
						context.drawImage(image, 0, 0);
						v.contents = canvas;
						v.version = +new Date();
						if (typeof v.loaded === 'function') {
							v.loaded();
						}
						else {
							v.loaded = true;
						}
					};
				}
				image.src = model.attributes.image;
			}
			record();
			return v;
		case 'sound':
			audio = new Audio();
			audio.src = model.attributes.sound;
			v = new Sound(audio, model.attributes.name);
			if (Object.prototype.hasOwnProperty.call(model.attributes, 'mediaID')) {
				myself.mediaDict[model.attributes.mediaID] = v;
			}
			return v;
	}
	return undefined;
};

SnapSerializer.prototype.loadColor = function (colorString) {
	var c = (colorString || '').split(',');
	return new Color(parseFloat(c[0]), parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3]));
};

SnapSerializer.prototype.openProject = function (project, ide) {
	var stage = ide.stage,
		sprites = [],
		sprite;
	if (!project || !project.stage) {
		return;
	}
	if (ide.globalVariables) {
		ide.globalVariables = project.globalVariables;
	}
	if (stage) {
		stage.destroy();
	}
	ide.add(project.stage);
	ide.stage = project.stage;
	sprites = ide.stage.children.filter(function (child) {
		return child instanceof SpriteMorph;
	});
	sprites.sort(function (x, y) {
		return x.idx - y.idx;
	});
	sprite = sprites[0] || project.stage;
	if (sizeOf(this.mediaDict) > 0) {
		this.mediaDict = {};
	}
	project.stage.drawNew();
	ide.fixLayout();
	ide.world().keyboardReceiver = project.stage;
};

Costume.prototype[XML_Serializer.prototype.mediaDetectionProperty] = true;
Sound.prototype[XML_Serializer.prototype.mediaDetectionProperty] = true;

