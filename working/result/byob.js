var CustomBlockDefinition;
var CustomCommandBlockMorph;
var CustomReporterBlockMorph;
function CustomBlockDefinition(spec, receiver) {
	this.body = null;
	this.scripts = [];
	this.category = null;
	this.isGlobal = false;
	this.type = 'command';
	this.spec = spec || '';
	this.declarations = {};
	this.comment = null;
	this.codeMapping = null;
	this.codeHeader = null;
	this.receiver = receiver || null;
}

CustomBlockDefinition.prototype.copyAndBindTo = function (sprite) {
	var c = copy(this);
	c.receiver = sprite;
	c.declarations = copy(this.declarations);
	if (c.body) {
		c.body = Process.prototype.reify.call(null, this.body.expression, new List(this.inputNames()));
		c.body.outerContext = null;
	}
	return c;
};

CustomBlockDefinition.prototype.blockSpec = function () {
	var myself = this,
		ans = [],
		parts = this.parseSpec(this.spec),
		spec;
	parts.forEach(function (part) {
		if (part[0] === '%' && part.length > 1) {
			spec = myself.typeOf(part.slice(1));
		}
		else {
			spec = part;
		}
		ans.push(spec);
		ans.push(' ');
	});
	return ''.concat.apply('', ans).trim();
};

CustomBlockDefinition.prototype.typeOf = function (inputName) {
	if (this.declarations[inputName]) {
		return this.declarations[inputName][0];
	}
	return '%s';
};

CustomBlockDefinition.prototype.isReadOnlyInputIdx = function (idx) {
	var inputName = this.inputNames()[idx];
	return this.isReadOnlyInput(inputName);
};

CustomBlockDefinition.prototype.inputOptionsOfIdx = function (idx) {
	var inputName = this.inputNames()[idx];
	return this.inputOptionsOf(inputName);
};

CustomBlockDefinition.prototype.dropDownMenuOf = function (inputName) {
	var dict = {};
	if (this.declarations[inputName] && this.declarations[inputName][2]) {
		this.declarations[inputName][2].split('\n').forEach(function (line) {
			var pair = line.split('=');
			dict[pair[0]] = isNil(pair[1]) ? pair[0] : pair[1];
		});
		return dict;
	}
	return null;
};

CustomBlockDefinition.prototype.isReadOnlyInput = function (inputName) {
	return this.declarations[inputName] && this.declarations[inputName][3] === true;
};

CustomBlockDefinition.prototype.inputOptionsOf = function (inputName) {
	return [this.dropDownMenuOf(inputName), this.isReadOnlyInput(inputName)];
};

CustomBlockDefinition.prototype.inputNames = function () {
	var vNames = [],
		parts = this.parseSpec(this.spec);
	parts.forEach(function (part) {
		if (part[0] === '%' && part.length > 1) {
			vNames.push(part.slice(1));
		}
	});
	return vNames;
};

CustomBlockDefinition.prototype.parseSpec = function (spec) {
	var parts = [],
		word = '',
		i,
		quoted = false,
		c;
	for (i = 0; i < spec.length; i += 1) {
		c = spec[i];
		if (c === "'") {
			quoted = !quoted;
		}
		else if (c === ' ' && !quoted) {
			parts.push(word);
			word = '';
		}
		else {
			word = word.concat(c);
		}
	}
	parts.push(word);
	return parts;
};

CustomCommandBlockMorph.prototype = new CommandBlockMorph();
CustomCommandBlockMorph.prototype.constructor = CustomCommandBlockMorph;
CustomCommandBlockMorph.uber = CommandBlockMorph.prototype;
function CustomCommandBlockMorph(definition, isProto) {
	this.init(definition, isProto);
}

CustomCommandBlockMorph.prototype.init = function (definition, isProto) {
	this.definition = definition;
	this.isPrototype = isProto || false;
	CustomCommandBlockMorph.uber.init.call(this);
	this.category = definition.category;
	this.selector = 'evaluateCustomBlock';
	if (definition) {
		this.refresh();
	}
};

CustomCommandBlockMorph.prototype.refresh = function () {
	var def = this.definition,
		newSpec = this.isPrototype ? def.spec : def.blockSpec(),
		oldInputs;
	this.setCategory(def.category);
	if (this.blockSpec !== newSpec) {
		oldInputs = this.inputs();
		if (!this.zebraContrast) {
			this.forceNormalColoring();
		}
		else {
			this.fixBlockColor();
		}
		this.setSpec(newSpec);
		this.fixLabelColor();
		this.restoreInputs(oldInputs);
	}
	else {
		this.inputs().forEach(function (inp, i) {
			if (inp instanceof InputSlotMorph) {
				inp.setChoices.apply(inp, def.inputOptionsOfIdx(i));
			}
		});
	}
	this.cachedInputs = null;
};

CustomCommandBlockMorph.prototype.upvarFragmentNames = function () {
	var ans = [];
	this.parts().forEach(function (part) {
		if (!part.fragment.isDeleted && (part.fragment.type === '%upvar')) {
			ans.push(part.fragment.labelString);
		}
	});
	return ans;
};

CustomCommandBlockMorph.prototype.upvarFragmentName = function (idx) {
	return this.upvarFragmentNames()[idx] || '\u2191';
};

CustomCommandBlockMorph.prototype.specFromFragments = function () {
	var ans = '';
	this.parts().forEach(function (part) {
		if (!part.fragment.isDeleted) {
			ans = ans + part.fragment.defSpecFragment() + ' ';
		}
	});
	return ans.trim();
};

CustomCommandBlockMorph.prototype.blockSpecFromFragments = function () {
	var ans = '';
	this.parts().forEach(function (part) {
		if (!part.fragment.isDeleted) {
			ans = ans + part.fragment.blockSpecFragment() + ' ';
		}
	});
	return ans.trim();
};

CustomCommandBlockMorph.prototype.parseSpec = function (spec) {
	if (!this.isPrototype) {
		return CustomCommandBlockMorph.uber.parseSpec.call(this, spec);
	}
	return this.definition.parseSpec.call(this, spec);
};

CustomCommandBlockMorph.prototype.labelPart = function (spec) {
	var part;
	if (!this.isPrototype) {
		return CustomCommandBlockMorph.uber.labelPart.call(this, spec);
	}
	return part;
};

CustomCommandBlockMorph.prototype.attachTargets = function () {
	if (this.isPrototype) {
		return [];
	}
	return CustomCommandBlockMorph.uber.attachTargets.call(this);
};

CustomReporterBlockMorph.prototype = new ReporterBlockMorph();
CustomReporterBlockMorph.prototype.constructor = CustomReporterBlockMorph;
CustomReporterBlockMorph.uber = ReporterBlockMorph.prototype;
function CustomReporterBlockMorph(definition, isPredicate, isProto) {
	this.init(definition, isPredicate, isProto);
}

CustomReporterBlockMorph.prototype.init = function (definition, isPredicate, isProto) {
	this.definition = definition;
	this.isPrototype = isProto || false;
	CustomReporterBlockMorph.uber.init.call(this, isPredicate);
	this.category = definition.category;
	this.selector = 'evaluateCustomBlock';
	if (definition) {
		this.refresh();
	}
};

CustomReporterBlockMorph.prototype.refresh = function () {
	CustomCommandBlockMorph.prototype.refresh.call(this);
	if (!this.isPrototype) {
		this.isPredicate = (this.definition.type === 'predicate');
	}
	this.drawNew();
};

CustomReporterBlockMorph.prototype.parseSpec = CustomCommandBlockMorph.prototype.parseSpec;
CustomReporterBlockMorph.prototype.labelPart = CustomCommandBlockMorph.prototype.labelPart;
CustomReporterBlockMorph.prototype.upvarFragmentNames = CustomCommandBlockMorph.prototype.upvarFragmentNames;
CustomReporterBlockMorph.prototype.upvarFragmentName = CustomCommandBlockMorph.prototype.upvarFragmentName;
CustomReporterBlockMorph.prototype.specFromFragments = CustomCommandBlockMorph.prototype.specFromFragments;
CustomReporterBlockMorph.prototype.blockSpecFromFragments = CustomCommandBlockMorph.prototype.blockSpecFromFragments;
CustomReporterBlockMorph.prototype.isInUse = CustomCommandBlockMorph.prototype.isInUse;

