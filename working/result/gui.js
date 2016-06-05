var IDE_Morph;
IDE_Morph.prototype = new Morph();
IDE_Morph.prototype.constructor = IDE_Morph;
IDE_Morph.uber = Morph.prototype;
IDE_Morph.prototype.setDefaultDesign = function () {
	MorphicPreferences.isFlat = false;
	SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
	SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
	StageMorph.prototype.paletteTextColor = SpriteMorph.prototype.paletteTextColor;
	SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor.lighter(30);
	IDE_Morph.prototype.backgroundColor = new Color(40, 40, 40);
	IDE_Morph.prototype.appModeColor = new Color();
	IDE_Morph.prototype.padding = 5;
};

IDE_Morph.prototype.setDefaultDesign();
function IDE_Morph(isAutoFill) {
	this.init(isAutoFill);
}

IDE_Morph.prototype.init = function (isAutoFill) {
	MorphicPreferences.globalFontFamily = 'Helvetica, Arial';
	this.applySavedSettings();
	this.serializer = new SnapSerializer();
	this.globalVariables = new VariableFrame();
	this.stage = null;
	this.isAutoFill = isAutoFill === undefined ? true : isAutoFill;
	this.isAppMode = false;
	this.isSmallStage = false;
	this.isAnimating = true;
	this.stageRatio = 1;
	this.shield = null;
	IDE_Morph.uber.init.call(this);
	this.color = this.backgroundColor;
};

IDE_Morph.prototype.buildPanes = function () {
	this.createStage();
};

IDE_Morph.prototype.createStage = function () {
	if (this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.frameRate = 0;
	this.stage = new StageMorph(this.globalVariables);
	this.stage.setExtent(this.stage.dimensions);
	this.add(this.stage);
};

IDE_Morph.prototype.fixLayout = function (situation) {
	var padding = this.padding;
	Morph.prototype.trackChanges = false;
	if (situation !== 'refreshPalette') {
		if (this.isAppMode) {
			this.stage.setScale(Math.floor(Math.min((this.width() - padding * 2) / this.stage.dimensions.x, (this.height() - 2 - padding * 2) / this.stage.dimensions.y) * 10) / 10);
			this.stage.setCenter(this.center());
		}
		else {
			this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
			this.stage.setTop(padding);
			this.stage.setRight(this.right());
		}
	}
	Morph.prototype.trackChanges = true;
	this.changed();
};

IDE_Morph.prototype.setExtent = function (point) {
	var padding = new Point(430, 110),
		minExt,
		ext,
		maxWidth,
		minWidth,
		maxHeight,
		minRatio,
		maxRatio;
	if (this.isAppMode) {
		minExt = StageMorph.prototype.dimensions.add(10);
	}
	else {
		if (this.stageRatio > 1) {
			minExt = padding.add(StageMorph.prototype.dimensions);
		}
		else {
			minExt = padding.add(StageMorph.prototype.dimensions.multiplyBy(this.stageRatio));
		}
	}
	ext = point.max(minExt);
	maxWidth = ext.x - (this.left());
	minWidth = 3;
	maxHeight = (ext.y - 3.5);
	minRatio = minWidth / this.stage.dimensions.x;
	maxRatio = Math.min((maxWidth / this.stage.dimensions.x), (maxHeight / this.stage.dimensions.y));
	this.stageRatio = Math.min(maxRatio, Math.max(minRatio, this.stageRatio));
	IDE_Morph.uber.setExtent.call(this, ext);
	this.fixLayout();
};

IDE_Morph.prototype.reactToWorldResize = function (rect) {
	if (this.isAutoFill) {
		this.setPosition(rect.origin);
		this.setExtent(rect.extent());
	}
};

IDE_Morph.prototype.startFastTracking = function () {
	this.stage.isFastTracked = true;
	this.stage.fps = 0;
};

IDE_Morph.prototype.stopFastTracking = function () {
	this.stage.isFastTracked = false;
	this.stage.fps = this.stage.frameRate;
};

IDE_Morph.prototype.runScripts = function () {
	this.stage.fireGreenFlagEvent();
};

IDE_Morph.prototype.isPaused = function () {
	if (!this.stage) {
		return false;
	}
	return this.stage.threads.isPaused();
};

IDE_Morph.prototype.refreshIDE = function () {
	var projectData;
	SpriteMorph.prototype.initBlocks();
	this.buildPanes();
	this.fixLayout();
};

IDE_Morph.prototype.applySavedSettings = function () {
	var design = this.getSetting('design'),
		zoom = this.getSetting('zoom'),
		language = this.getSetting('language'),
		click = this.getSetting('click'),
		longform = this.getSetting('longform'),
		longurls = this.getSetting('longurls'),
		plainprototype = this.getSetting('plainprototype'),
		keyboard = this.getSetting('keyboard'),
		tables = this.getSetting('tables'),
		tableLines = this.getSetting('tableLines');
	if (!(design === 'flat')) {
		this.setDefaultDesign();
	}
	if (zoom) {
		SyntaxElementMorph.prototype.setScale(Math.min(zoom, 12));
		SpriteMorph.prototype.initBlocks();
	}
	if (click && !BlockMorph.prototype.snapSound) {
		BlockMorph.prototype.toggleSnapSound();
	}
	if (tables) {
		List.prototype.enableTables = true;
	}
	else {
		List.prototype.enableTables = false;
	}
	if (tableLines) {
		TableMorph.prototype.highContrast = true;
	}
	else {
		TableMorph.prototype.highContrast = false;
	}
};

IDE_Morph.prototype.getSetting = function (key) {
	return null;
};

IDE_Morph.prototype.rawOpenProjectString = function (str) {
	this.toggleAppMode(false);
	StageMorph.prototype.hiddenPrimitives = {};
	StageMorph.prototype.codeMappings = {};
	StageMorph.prototype.codeHeaders = {};
	StageMorph.prototype.enableCodeMapping = false;
	StageMorph.prototype.enableInheritance = false;
	if (Process.prototype.isCatchingErrors) {
		try {
			this.serializer.openProject(this.serializer.load(str, this), this);
		}
		catch (e) {

		}
	}
	else {
		this.serializer.openProject(this.serializer.load(str, this), this);
	}
	this.stopFastTracking();
};

IDE_Morph.prototype.toggleZebraColoring = function () {
	var scripts = [];
	if (!BlockMorph.prototype.zebraContrast) {
		BlockMorph.prototype.zebraContrast = 40;
	}
	else {
		BlockMorph.prototype.zebraContrast = 0;
	}
	this.stage.children.concat(this.stage).forEach(function (morph) {
		if (isSnapObject(morph)) {
			scripts = scripts.concat(morph.scripts.children.filter(function (morph) {
				return morph instanceof BlockMorph;
			}));
		}
	});
	scripts.forEach(function (topBlock) {
		topBlock.fixBlockColor(null, true);
	});
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
	var world = this.world();
	this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;
	Morph.prototype.trackChanges = false;
	if (this.isAppMode) {
		this.setColor(this.appModeColor);
		world.children.forEach(function (morph) {
			if (morph instanceof DialogBoxMorph) {
				morph.hide();
			}
		});
	}
	else {
		this.setColor(this.backgroundColor);
		this.stage.setScale(1);
		world.children.forEach(function (morph) {
			if (morph instanceof DialogBoxMorph) {
				morph.show();
			}
		});
		world.allChildren().filter(function (c) {
			return c instanceof ScrollFrameMorph;
		}).forEach(function (s) {
			s.adjustScrollBars();
		});
	}
	this.setExtent(this.world().extent());
};

IDE_Morph.prototype.openIn = function (world) {
	var hash,
		usr,
		myself = this,
		urlLanguage = null;
	this.buildPanes();
	world.add(this);
	world.userMenu = this.userMenu;
	this.reactToWorldResize(world.bounds);
	this.rawOpenProjectString(this.snapproject);
	this.toggleAppMode(true);
	var handle = setInterval(
		function () {
			var allSpritesDone = true;
			myself.stage.children.forEach(
				function (child) {
					var allCostumesLoaded = true;
					if (child.costumes) {
						child.costumes.contents.forEach(
							function (costume) {
								if (typeof costume.loaded === "function") allCostumesLoaded = false;
							}
						);
					}
					if (!allCostumesLoaded || (child.costumes && child.costumes.length > 0 && !child.costume)) {
						allSpritesDone = false;
					}
				}
			);
			if (allSpritesDone) {
				clearInterval(handle);
				myself.runScripts();
			}
		},
		100
	);
};

