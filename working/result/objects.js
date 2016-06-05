var SpriteMorph;
var StageMorph;
var SpriteBubbleMorph;
var Costume;
var SVG_Costume;
var Sound;
var Note;
var CellMorph;
var WatcherMorph;
var StagePrompterMorph;
var Note;
var SpriteHighlightMorph;
function isSnapObject(thing) {
	return thing instanceof SpriteMorph || (thing instanceof StageMorph);
}

SpriteMorph.prototype = new PenMorph();
SpriteMorph.prototype.constructor = SpriteMorph;
SpriteMorph.uber = PenMorph.prototype;
SpriteMorph.prototype.categories = ['motion', 'control', 'looks', 'sensing', 'sound', 'operators', 'pen', 'variables', 'lists', 'other'];
SpriteMorph.prototype.blockColor = {
	motion : new Color(74, 108, 212),
	looks : new Color(143, 86, 227),
	sound : new Color(207, 74, 217),
	pen : new Color(0, 161, 120),
	control : new Color(230, 168, 34),
	sensing : new Color(4, 148, 220),
	operators : new Color(98, 194, 19),
	variables : new Color(243, 118, 29),
	lists : new Color(217, 77, 17),
	other : new Color(150, 150, 150)
};

SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor.lighter(30);
SpriteMorph.prototype.isCachingPrimitives = true;
SpriteMorph.prototype.enableNesting = true;
SpriteMorph.prototype.enableFirstClass = true;
SpriteMorph.prototype.useFlatLineEnds = false;
SpriteMorph.prototype.highlightColor = new Color(250, 200, 130);
SpriteMorph.prototype.highlightBorder = 8;
SpriteMorph.prototype.bubbleColor = new Color(255, 255, 255);
SpriteMorph.prototype.bubbleFontSize = 14;
SpriteMorph.prototype.bubbleFontIsBold = true;
SpriteMorph.prototype.bubbleCorner = 10;
SpriteMorph.prototype.bubbleBorder = 3;
SpriteMorph.prototype.bubbleBorderColor = new Color(190, 190, 190);
SpriteMorph.prototype.bubbleMaxTextWidth = 130;
SpriteMorph.prototype.initBlocks = function () {
	SpriteMorph.prototype.blocks = {
		forward : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'move %n steps',
			defaults : [10]
		},
		turn : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'turn %clockwise %n degrees',
			defaults : [15]
		},
		turnLeft : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'turn %counterclockwise %n degrees',
			defaults : [15]
		},
		setHeading : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'point in direction %dir'
		},
		doFaceTowards : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'point towards %dst'
		},
		gotoXY : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'go to x: %n y: %n',
			defaults : [0, 0]
		},
		doGotoObject : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'go to %dst'
		},
		doGlide : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'glide %n secs to x: %n y: %n',
			defaults : [1, 0, 0]
		},
		changeXPosition : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'change x by %n',
			defaults : [10]
		},
		setXPosition : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'set x to %n',
			defaults : [0]
		},
		changeYPosition : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'change y by %n',
			defaults : [10]
		},
		setYPosition : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'set y to %n',
			defaults : [0]
		},
		bounceOffEdge : {
			only : SpriteMorph,
			type : 'command',
			category : 'motion',
			spec : 'if on edge, bounce'
		},
		xPosition : {
			only : SpriteMorph,
			type : 'reporter',
			category : 'motion',
			spec : 'x position'
		},
		yPosition : {
			only : SpriteMorph,
			type : 'reporter',
			category : 'motion',
			spec : 'y position'
		},
		direction : {
			only : SpriteMorph,
			type : 'reporter',
			category : 'motion',
			spec : 'direction'
		},
		doSwitchToCostume : {
			type : 'command',
			category : 'looks',
			spec : 'switch to costume %cst'
		},
		doWearNextCostume : {
			type : 'command',
			category : 'looks',
			spec : 'next costume'
		},
		getCostumeIdx : {
			type : 'reporter',
			category : 'looks',
			spec : 'costume #'
		},
		doSayFor : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'say %s for %n secs',
			defaults : [localize('Hello!'), 2]
		},
		bubble : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'say %s',
			defaults : [localize('Hello!')]
		},
		doThinkFor : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'think %s for %n secs',
			defaults : [localize('Hmm...'), 2]
		},
		doThink : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'think %s',
			defaults : [localize('Hmm...')]
		},
		changeEffect : {
			type : 'command',
			category : 'looks',
			spec : 'change %eff effect by %n',
			defaults : [null, 25]
		},
		setEffect : {
			type : 'command',
			category : 'looks',
			spec : 'set %eff effect to %n',
			defaults : [null, 0]
		},
		clearEffects : {
			type : 'command',
			category : 'looks',
			spec : 'clear graphic effects'
		},
		changeScale : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'change size by %n',
			defaults : [10]
		},
		setScale : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'set size to %n %',
			defaults : [100]
		},
		getScale : {
			only : SpriteMorph,
			type : 'reporter',
			category : 'looks',
			spec : 'size'
		},
		show : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'show'
		},
		hide : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'hide'
		},
		comeToFront : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'go to front'
		},
		goBack : {
			only : SpriteMorph,
			type : 'command',
			category : 'looks',
			spec : 'go back %n layers',
			defaults : [1]
		},
		doScreenshot : {
			type : 'command',
			category : 'looks',
			spec : 'save %imgsource as costume named %s',
			defaults : [['pen trails'], localize('screenshot')]
		},
		reportCostumes : {
			dev : true,
			type : 'reporter',
			category : 'looks',
			spec : 'wardrobe'
		},
		alert : {
			dev : true,
			type : 'command',
			category : 'looks',
			spec : 'alert %mult%s'
		},
		log : {
			dev : true,
			type : 'command',
			category : 'looks',
			spec : 'console log %mult%s'
		},
		playSound : {
			type : 'command',
			category : 'sound',
			spec : 'play sound %snd'
		},
		doPlaySoundUntilDone : {
			type : 'command',
			category : 'sound',
			spec : 'play sound %snd until done'
		},
		doStopAllSounds : {
			type : 'command',
			category : 'sound',
			spec : 'stop all sounds'
		},
		doRest : {
			type : 'command',
			category : 'sound',
			spec : 'rest for %n beats',
			defaults : [0.2]
		},
		doPlayNote : {
			type : 'command',
			category : 'sound',
			spec : 'play note %n for %n beats',
			defaults : [60, 0.5]
		},
		doChangeTempo : {
			type : 'command',
			category : 'sound',
			spec : 'change tempo by %n',
			defaults : [20]
		},
		doSetTempo : {
			type : 'command',
			category : 'sound',
			spec : 'set tempo to %n bpm',
			defaults : [60]
		},
		getTempo : {
			type : 'reporter',
			category : 'sound',
			spec : 'tempo'
		},
		reportSounds : {
			dev : true,
			type : 'reporter',
			category : 'sound',
			spec : 'jukebox'
		},
		clear : {
			type : 'command',
			category : 'pen',
			spec : 'clear'
		},
		down : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'pen down'
		},
		up : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'pen up'
		},
		setColor : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'set pen color to %clr'
		},
		changeHue : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'change pen color by %n',
			defaults : [10]
		},
		setHue : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'set pen color to %n',
			defaults : [0]
		},
		changeBrightness : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'change pen shade by %n',
			defaults : [10]
		},
		setBrightness : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'set pen shade to %n',
			defaults : [100]
		},
		changeSize : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'change pen size by %n',
			defaults : [1]
		},
		setSize : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'set pen size to %n',
			defaults : [1]
		},
		doStamp : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'stamp'
		},
		floodFill : {
			only : SpriteMorph,
			type : 'command',
			category : 'pen',
			spec : 'fill'
		},
		receiveGo : {
			type : 'hat',
			category : 'control',
			spec : 'when %greenflag clicked'
		},
		receiveKey : {
			type : 'hat',
			category : 'control',
			spec : 'when %keyHat key pressed'
		},
		receiveInteraction : {
			type : 'hat',
			category : 'control',
			spec : 'when I am %interaction',
			defaults : ['clicked']
		},
		receiveMessage : {
			type : 'hat',
			category : 'control',
			spec : 'when I receive %msgHat'
		},
		receiveCondition : {
			type : 'hat',
			category : 'control',
			spec : 'when %b'
		},
		doBroadcast : {
			type : 'command',
			category : 'control',
			spec : 'broadcast %msg'
		},
		doBroadcastAndWait : {
			type : 'command',
			category : 'control',
			spec : 'broadcast %msg and wait'
		},
		getLastMessage : {
			type : 'reporter',
			category : 'control',
			spec : 'message'
		},
		doWait : {
			type : 'command',
			category : 'control',
			spec : 'wait %n secs',
			defaults : [1]
		},
		doWaitUntil : {
			type : 'command',
			category : 'control',
			spec : 'wait until %b'
		},
		doForever : {
			type : 'command',
			category : 'control',
			spec : 'forever %c'
		},
		doRepeat : {
			type : 'command',
			category : 'control',
			spec : 'repeat %n %c',
			defaults : [10]
		},
		doUntil : {
			type : 'command',
			category : 'control',
			spec : 'repeat until %b %c'
		},
		doIf : {
			type : 'command',
			category : 'control',
			spec : 'if %b %c'
		},
		doIfElse : {
			type : 'command',
			category : 'control',
			spec : 'if %b %c else %c'
		},
		doStopThis : {
			type : 'command',
			category : 'control',
			spec : 'stop %stopChoices'
		},
		doStopOthers : {
			type : 'command',
			category : 'control',
			spec : 'stop %stopOthersChoices'
		},
		doRun : {
			type : 'command',
			category : 'control',
			spec : 'run %cmdRing %inputs'
		},
		fork : {
			type : 'command',
			category : 'control',
			spec : 'launch %cmdRing %inputs'
		},
		evaluate : {
			type : 'reporter',
			category : 'control',
			spec : 'call %repRing %inputs'
		},
		doReport : {
			type : 'command',
			category : 'control',
			spec : 'report %s'
		},
		doCallCC : {
			type : 'command',
			category : 'control',
			spec : 'run %cmdRing w/continuation'
		},
		reportCallCC : {
			type : 'reporter',
			category : 'control',
			spec : 'call %cmdRing w/continuation'
		},
		doWarp : {
			type : 'command',
			category : 'other',
			spec : 'warp %c'
		},
		receiveOnClone : {
			type : 'hat',
			category : 'control',
			spec : 'when I start as a clone'
		},
		createClone : {
			type : 'command',
			category : 'control',
			spec : 'create a clone of %cln'
		},
		removeClone : {
			type : 'command',
			category : 'control',
			spec : 'delete this clone'
		},
		doPauseAll : {
			type : 'command',
			category : 'control',
			spec : 'pause all %pause'
		},
		reportTouchingObject : {
			only : SpriteMorph,
			type : 'predicate',
			category : 'sensing',
			spec : 'touching %col ?'
		},
		reportTouchingColor : {
			only : SpriteMorph,
			type : 'predicate',
			category : 'sensing',
			spec : 'touching %clr ?'
		},
		reportColorIsTouchingColor : {
			only : SpriteMorph,
			type : 'predicate',
			category : 'sensing',
			spec : 'color %clr is touching %clr ?'
		},
		colorFiltered : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'filtered for %clr'
		},
		reportStackSize : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'stack size'
		},
		reportFrameCount : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'frames'
		},
		reportThreadCount : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'processes'
		},
		doAsk : {
			type : 'command',
			category : 'sensing',
			spec : 'ask %s and wait',
			defaults : [localize('what\'s your name?')]
		},
		reportLastAnswer : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'answer'
		},
		getLastAnswer : {
			type : 'reporter',
			category : 'sensing',
			spec : 'answer'
		},
		reportMouseX : {
			type : 'reporter',
			category : 'sensing',
			spec : 'mouse x'
		},
		reportMouseY : {
			type : 'reporter',
			category : 'sensing',
			spec : 'mouse y'
		},
		reportMouseDown : {
			type : 'predicate',
			category : 'sensing',
			spec : 'mouse down?'
		},
		reportKeyPressed : {
			type : 'predicate',
			category : 'sensing',
			spec : 'key %key pressed?'
		},
		reportDistanceTo : {
			type : 'reporter',
			category : 'sensing',
			spec : 'distance to %dst'
		},
		doResetTimer : {
			type : 'command',
			category : 'sensing',
			spec : 'reset timer'
		},
		reportTimer : {
			dev : true,
			type : 'reporter',
			category : 'sensing',
			spec : 'timer'
		},
		getTimer : {
			type : 'reporter',
			category : 'sensing',
			spec : 'timer'
		},
		reportAttributeOf : {
			type : 'reporter',
			category : 'sensing',
			spec : '%att of %spr',
			defaults : [['costume #']]
		},
		reportURL : {
			type : 'reporter',
			category : 'sensing',
			spec : 'http:// %s',
			defaults : ['snap.berkeley.edu']
		},
		reportIsFastTracking : {
			type : 'predicate',
			category : 'sensing',
			spec : 'turbo mode?'
		},
		doSetFastTracking : {
			type : 'command',
			category : 'sensing',
			spec : 'set turbo mode to %b'
		},
		reportDate : {
			type : 'reporter',
			category : 'sensing',
			spec : 'current %dates'
		},
		reportGet : {
			type : 'reporter',
			category : 'sensing',
			spec : 'my %get',
			defaults : [['neighbors']]
		},
		reifyScript : {
			type : 'ring',
			category : 'other',
			spec : '%rc %ringparms',
			alias : 'command ring lambda'
		},
		reifyReporter : {
			type : 'ring',
			category : 'other',
			spec : '%rr %ringparms',
			alias : 'reporter ring lambda'
		},
		reifyPredicate : {
			type : 'ring',
			category : 'other',
			spec : '%rp %ringparms',
			alias : 'predicate ring lambda'
		},
		reportSum : {
			type : 'reporter',
			category : 'operators',
			spec : '%n + %n'
		},
		reportDifference : {
			type : 'reporter',
			category : 'operators',
			spec : '%n \u2212 %n',
			alias : '-'
		},
		reportProduct : {
			type : 'reporter',
			category : 'operators',
			spec : '%n \u00D7 %n',
			alias : '*'
		},
		reportQuotient : {
			type : 'reporter',
			category : 'operators',
			spec : '%n / %n'
		},
		reportRound : {
			type : 'reporter',
			category : 'operators',
			spec : 'round %n'
		},
		reportMonadic : {
			type : 'reporter',
			category : 'operators',
			spec : '%fun of %n',
			defaults : [null, 10]
		},
		reportModulus : {
			type : 'reporter',
			category : 'operators',
			spec : '%n mod %n'
		},
		reportRandom : {
			type : 'reporter',
			category : 'operators',
			spec : 'pick random %n to %n',
			defaults : [1, 10]
		},
		reportLessThan : {
			type : 'predicate',
			category : 'operators',
			spec : '%s < %s'
		},
		reportEquals : {
			type : 'predicate',
			category : 'operators',
			spec : '%s = %s'
		},
		reportGreaterThan : {
			type : 'predicate',
			category : 'operators',
			spec : '%s > %s'
		},
		reportAnd : {
			type : 'predicate',
			category : 'operators',
			spec : '%b and %b'
		},
		reportOr : {
			type : 'predicate',
			category : 'operators',
			spec : '%b or %b'
		},
		reportNot : {
			type : 'predicate',
			category : 'operators',
			spec : 'not %b'
		},
		reportTrue : {
			type : 'predicate',
			category : 'operators',
			spec : 'true'
		},
		reportFalse : {
			type : 'predicate',
			category : 'operators',
			spec : 'false'
		},
		reportJoinWords : {
			type : 'reporter',
			category : 'operators',
			spec : 'join %words',
			defaults : [localize('hello') + ' ', localize('world')]
		},
		reportLetter : {
			type : 'reporter',
			category : 'operators',
			spec : 'letter %n of %s',
			defaults : [1, localize('world')]
		},
		reportStringSize : {
			type : 'reporter',
			category : 'operators',
			spec : 'length of %s',
			defaults : [localize('world')]
		},
		reportUnicode : {
			type : 'reporter',
			category : 'operators',
			spec : 'unicode of %s',
			defaults : ['a']
		},
		reportUnicodeAsLetter : {
			type : 'reporter',
			category : 'operators',
			spec : 'unicode %n as letter',
			defaults : [65]
		},
		reportIsA : {
			type : 'predicate',
			category : 'operators',
			spec : 'is %s a %typ ?',
			defaults : [5]
		},
		reportIsIdentical : {
			type : 'predicate',
			category : 'operators',
			spec : 'is %s identical to %s ?'
		},
		reportTextSplit : {
			type : 'reporter',
			category : 'operators',
			spec : 'split %s by %delim',
			defaults : [localize('hello') + ' ' + localize('world'), " "]
		},
		reportJSFunction : {
			type : 'reporter',
			category : 'operators',
			spec : 'JavaScript function ( %mult%s ) { %code }'
		},
		reportTypeOf : {
			dev : true,
			type : 'reporter',
			category : 'operators',
			spec : 'type of %s',
			defaults : [5]
		},
		reportTextFunction : {
			dev : true,
			type : 'reporter',
			category : 'operators',
			spec : '%txtfun of %s',
			defaults : [null, "Abelson & Sussman"]
		},
		doSetVar : {
			type : 'command',
			category : 'variables',
			spec : 'set %var to %s',
			defaults : [null, 0]
		},
		doChangeVar : {
			type : 'command',
			category : 'variables',
			spec : 'change %var by %n',
			defaults : [null, 1]
		},
		doShowVar : {
			type : 'command',
			category : 'variables',
			spec : 'show variable %var'
		},
		doHideVar : {
			type : 'command',
			category : 'variables',
			spec : 'hide variable %var'
		},
		doDeclareVariables : {
			type : 'command',
			category : 'other',
			spec : 'script variables %scriptVars'
		},
		doDeleteAttr : {
			type : 'command',
			category : 'variables',
			spec : 'delete %shd'
		},
		reportNewList : {
			type : 'reporter',
			category : 'lists',
			spec : 'list %exp'
		},
		reportCONS : {
			type : 'reporter',
			category : 'lists',
			spec : '%s in front of %l'
		},
		reportListItem : {
			type : 'reporter',
			category : 'lists',
			spec : 'item %idx of %l',
			defaults : [1]
		},
		reportCDR : {
			type : 'reporter',
			category : 'lists',
			spec : 'all but first of %l'
		},
		reportListLength : {
			type : 'reporter',
			category : 'lists',
			spec : 'length of %l'
		},
		reportListContainsItem : {
			type : 'predicate',
			category : 'lists',
			spec : '%l contains %s',
			defaults : [null, localize('thing')]
		},
		doAddToList : {
			type : 'command',
			category : 'lists',
			spec : 'add %s to %l',
			defaults : [localize('thing')]
		},
		doDeleteFromList : {
			type : 'command',
			category : 'lists',
			spec : 'delete %ida of %l',
			defaults : [1]
		},
		doInsertInList : {
			type : 'command',
			category : 'lists',
			spec : 'insert %s at %idx of %l',
			defaults : [localize('thing'), 1]
		},
		doReplaceInList : {
			type : 'command',
			category : 'lists',
			spec : 'replace item %idx of %l with %s',
			defaults : [1, null, localize('thing')]
		},
		reportMap : {
			dev : true,
			type : 'reporter',
			category : 'lists',
			spec : 'map %repRing over %l'
		},
		doForEach : {
			dev : true,
			type : 'command',
			category : 'lists',
			spec : 'for %upvar in %l %cl',
			defaults : [localize('each item')]
		},
		doShowTable : {
			dev : true,
			type : 'command',
			category : 'lists',
			spec : 'show table %l'
		},
		doMapCodeOrHeader : {
			type : 'command',
			category : 'other',
			spec : 'map %cmdRing to %codeKind %code'
		},
		doMapStringCode : {
			type : 'command',
			category : 'other',
			spec : 'map String to code %code',
			defaults : ['<#1>']
		},
		doMapListCode : {
			type : 'command',
			category : 'other',
			spec : 'map %codeListPart of %codeListKind to code %code'
		},
		reportMappedCode : {
			type : 'reporter',
			category : 'other',
			spec : 'code of %cmdRing'
		}
	};
};

SpriteMorph.prototype.initBlocks();
SpriteMorph.prototype.initBlockMigrations = function () {
	SpriteMorph.prototype.blockMigrations = {
		doStopAll : {
			selector : 'doStopThis',
			inputs : [['all']]
		},
		doStop : {
			selector : 'doStopThis',
			inputs : [['this script']]
		},
		doStopBlock : {
			selector : 'doStopThis',
			inputs : [['this block']]
		},
		receiveClick : {
			selector : 'receiveInteraction',
			inputs : [['clicked']]
		}
	};
};

SpriteMorph.prototype.initBlockMigrations();
SpriteMorph.prototype.blockAlternatives = {
	turn : ['turnLeft'],
	turnLeft : ['turn'],
	changeXPosition : ['changeYPosition', 'setXPosition', 'setYPosition'],
	setXPosition : ['setYPosition', 'changeXPosition', 'changeYPosition'],
	changeYPosition : ['changeXPosition', 'setYPosition', 'setXPosition'],
	setYPosition : ['setXPosition', 'changeYPosition', 'changeXPosition'],
	xPosition : ['yPosition'],
	yPosition : ['xPosition'],
	doSayFor : ['doThinkFor', 'bubble', 'doThink', 'doAsk'],
	doThinkFor : ['doSayFor', 'doThink', 'bubble', 'doAsk'],
	bubble : ['doThink', 'doAsk', 'doSayFor', 'doThinkFor'],
	doThink : ['bubble', 'doAsk', 'doSayFor', 'doThinkFor'],
	show : ['hide'],
	hide : ['show'],
	changeEffect : ['setEffect'],
	setEffect : ['changeEffect'],
	changeScale : ['setScale'],
	setScale : ['changeScale'],
	playSound : ['doPlaySoundUntilDone'],
	doPlaySoundUntilDone : ['playSound'],
	doChangeTempo : ['doSetTempo'],
	doSetTempo : ['doChangeTempo'],
	clear : ['down', 'up', 'doStamp'],
	down : ['up', 'clear', 'doStamp'],
	up : ['down', 'clear', 'doStamp'],
	doStamp : ['clear', 'down', 'up'],
	changeHue : ['setHue', 'changeBrightness', 'setBrightness'],
	setHue : ['changeHue', 'changeBrightness', 'setBrightness'],
	changeBrightness : ['setBrightness', 'setHue', 'changeHue'],
	setBrightness : ['changeBrightness', 'setHue', 'changeHue'],
	changeSize : ['setSize'],
	setSize : ['changeSize'],
	doBroadcast : ['doBroadcastAndWait'],
	doBroadcastAndWait : ['doBroadcast'],
	doIf : ['doIfElse', 'doUntil'],
	doIfElse : ['doIf', 'doUntil'],
	doRepeat : ['doUntil'],
	doUntil : ['doRepeat', 'doIf'],
	doAsk : ['bubble', 'doThink', 'doSayFor', 'doThinkFor'],
	getLastAnswer : ['getTimer'],
	getTimer : ['getLastAnswer'],
	reportMouseX : ['reportMouseY'],
	reportMouseY : ['reportMouseX'],
	reportSum : ['reportDifference', 'reportProduct', 'reportQuotient'],
	reportDifference : ['reportSum', 'reportProduct', 'reportQuotient'],
	reportProduct : ['reportDifference', 'reportSum', 'reportQuotient'],
	reportQuotient : ['reportDifference', 'reportProduct', 'reportSum'],
	reportLessThan : ['reportEquals', 'reportGreaterThan'],
	reportEquals : ['reportLessThan', 'reportGreaterThan'],
	reportGreaterThan : ['reportEquals', 'reportLessThan'],
	reportAnd : ['reportOr'],
	reportOr : ['reportAnd'],
	reportTrue : ['reportFalse'],
	reportFalse : ['reportTrue'],
	doSetVar : ['doChangeVar'],
	doChangeVar : ['doSetVar'],
	doShowVar : ['doHideVar'],
	doHideVar : ['doShowVar']
};

function SpriteMorph(globals) {
	this.init(globals);
}

SpriteMorph.prototype.init = function (globals) {
	this.name = localize('Sprite');
	this.variables = new VariableFrame(globals || null, this);
	this.scripts = new ScriptsMorph(this);
	this.customBlocks = [];
	this.costumes = new List();
	this.costume = null;
	this.sounds = new List();
	this.normalExtent = new Point(60, 60);
	this.scale = 1;
	this.rotationStyle = 1;
	this.version = Date.now();
	this.isClone = false;
	this.isCorpse = false;
	this.cloneOriginName = '';
	this.parts = [];
	this.anchor = null;
	this.nestingScale = 1;
	this.rotatesWithAnchor = true;
	this.layers = null;
	this.blocksCache = {};
	this.paletteCache = {};
	this.rotationOffset = new Point();
	this.idx = 0;
	this.wasWarped = false;
	this.graphicsValues = {
		'negative' : 0,
		'fisheye' : 0,
		'whirl' : 0,
		'pixelate' : 0,
		'mosaic' : 0,
		'brightness' : 0,
		'color' : 0,
		'comic' : 0,
		'duplicate' : 0,
		'confetti' : 0
	};
	this.exemplar = null;
	SpriteMorph.uber.init.call(this);
	this.isDraggable = true;
	this.isDown = false;
	this.heading = 90;
	this.changed();
	this.drawNew();
	this.changed();
};

SpriteMorph.prototype.fullCopy = function (forClone) {
	var c = SpriteMorph.uber.fullCopy.call(this),
		myself = this,
		arr = [],
		cb;
	c.stopTalking();
	c.color = this.color.copy();
	c.blocksCache = {};
	c.paletteCache = {};
	c.scripts = this.scripts.fullCopy(forClone);
	c.scripts.owner = c;
	c.variables = this.variables.copy();
	c.variables.owner = c;
	c.customBlocks = [];
	if (!forClone) {
		this.customBlocks.forEach(function (def) {
			cb = def.copyAndBindTo(c);
			c.customBlocks.push(cb);
			c.allBlockInstances(def).forEach(function (block) {
				block.definition = cb;
			});
		});
	}
	this.costumes.asArray().forEach(function (costume) {
		var cst = forClone ? costume : costume.copy();
		arr.push(cst);
		if (costume === myself.costume) {
			c.costume = cst;
		}
	});
	c.costumes = new List(arr);
	arr = [];
	this.sounds.asArray().forEach(function (sound) {
		arr.push(sound);
	});
	c.sounds = new List(arr);
	c.nestingScale = 1;
	c.rotatesWithAnchor = true;
	c.anchor = null;
	c.parts = [];
	this.parts.forEach(function (part) {
		var dp = part.fullCopy(forClone);
		dp.nestingScale = part.nestingScale;
		dp.rotatesWithAnchor = part.rotatesWithAnchor;
		c.attachPart(dp);
	});
	return c;
};

SpriteMorph.prototype.setName = function (string) {
	this.name = string || this.name;
	this.version = Date.now();
};

SpriteMorph.prototype.drawNew = function () {
	var myself = this,
		currentCenter,
		facing,
		isFlipped,
		isLoadingCostume,
		cst,
		pic,
		stageScale,
		newX,
		corners = [],
		origin,
		shift,
		corner,
		costumeExtent,
		ctx,
		handle;
	if (this.isWarped) {
		this.wantsRedraw = true;
		return;
	}
	currentCenter = this.center();
	isLoadingCostume = this.costume && typeof this.costume.loaded === 'function';
	stageScale = this.parent instanceof StageMorph ? this.parent.scale : 1;
	facing = this.rotationStyle ? this.heading : 90;
	if (this.rotationStyle === 2) {
		facing = 90;
		if ((this.heading > 180 && (this.heading < 360)) || (this.heading < 0 && (this.heading > -180))) {
			isFlipped = true;
		}
	}
	if (this.costume && !isLoadingCostume) {
		pic = isFlipped ? this.costume.flipped() : this.costume;
		corners = pic.bounds().corners().map(function (point) {
			return point.rotateBy(radians(facing - 90), myself.costume.center());
		});
		origin = corners[0];
		corner = corners[0];
		corners.forEach(function (point) {
			origin = origin.min(point);
			corner = corner.max(point);
		});
		costumeExtent = origin.corner(corner).extent().multiplyBy(this.scale * stageScale);
		shift = new Point(0, 0).rotateBy(radians(-(facing - 90)), pic.center()).subtract(origin);
		this.image = newCanvas(costumeExtent, true);
		this.silentSetExtent(costumeExtent);
		ctx = this.image.getContext('2d');
		ctx.scale(this.scale * stageScale, this.scale * stageScale);
		ctx.translate(shift.x, shift.y);
		ctx.rotate(radians(facing - 90));
		ctx.drawImage(pic.contents, 0, 0);
		this.image = this.applyGraphicsEffects(this.image);
		this.setCenter(currentCenter, true);
		this.rotationOffset = shift.translateBy(pic.rotationCenter).rotateBy(radians(-(facing - 90)), shift).scaleBy(this.scale * stageScale);
	}
	else {
		facing = isFlipped ? -90 : facing;
		newX = Math.min(Math.max(this.normalExtent.x * this.scale * stageScale, 5), 1000);
		this.silentSetExtent(new Point(newX, newX));
		this.image = newCanvas(this.extent(), true);
		this.setCenter(currentCenter, true);
		SpriteMorph.uber.drawNew.call(this, facing);
		this.rotationOffset = this.extent().divideBy(2);
		this.image = this.applyGraphicsEffects(this.image);
		if (isLoadingCostume) {
			cst = this.costume;
			handle = setInterval(function () {
				myself.wearCostume(cst);
				clearInterval(handle);
			}, 100);
			return myself.wearCostume(null);
		}
	}
	this.version = Date.now();
};

SpriteMorph.prototype.endWarp = function () {
	this.isWarped = false;
	if (this.wantsRedraw) {
		var x = this.xPosition(),
			y = this.yPosition();
		this.drawNew();
		this.silentGotoXY(x, y, true);
		this.wantsRedraw = false;
	}
	this.parent.changed();
};

SpriteMorph.prototype.rotationCenter = function () {
	return this.position().add(this.rotationOffset);
};

SpriteMorph.prototype.colorFiltered = function (aColor) {
	var morph = new Morph(),
		ext = this.extent(),
		ctx,
		src,
		clr,
		i,
		dta;
	src = this.image.getContext('2d').getImageData(0, 0, ext.x, ext.y);
	morph.image = newCanvas(ext, true);
	morph.bounds = this.bounds.copy();
	ctx = morph.image.getContext('2d');
	dta = ctx.createImageData(ext.x, ext.y);
	for (i = 0; i < ext.x * ext.y * 4; i += 4) {
		clr = new Color(src.data[i], src.data[i + 1], src.data[i + 2]);
		if (clr.eq(aColor)) {
			dta.data[i] = src.data[i];
			dta.data[i + 1] = src.data[i + 1];
			dta.data[i + 2] = src.data[i + 2];
			dta.data[i + 3] = 255;
		}
	}
	ctx.putImageData(dta, 0, 0);
	return morph;
};

SpriteMorph.prototype.blockForSelector = function (selector, setDefaults) {
	var migration,
		info,
		block,
		defaults,
		inputs,
		i;
	migration = this.blockMigrations[selector];
	info = this.blocks[migration ? migration.selector : selector];
	if (!info) {
		return null;
	}
	block = info.type === 'command' ? new CommandBlockMorph() : info.type === 'hat' ? new HatBlockMorph() : info.type === 'ring' ? new RingMorph() : new ReporterBlockMorph(info.type === 'predicate');
	block.color = this.blockColor[info.category];
	block.category = info.category;
	block.selector = migration ? migration.selector : selector;
	if (contains(['reifyReporter', 'reifyPredicate'], block.selector)) {
		block.isStatic = true;
	}
	block.setSpec(localize(info.spec));
	if ((setDefaults && info.defaults) || (migration && migration.inputs)) {
		defaults = migration ? migration.inputs : info.defaults;
		block.defaults = defaults;
		inputs = block.inputs();
		if (inputs[0] instanceof MultiArgMorph) {
			inputs[0].setContents(defaults);
			inputs[0].defaults = defaults;
		}
		else {
			for (i = 0; i < defaults.length; i += 1) {
				if (defaults[i] !== null) {
					inputs[i].setContents(defaults[i]);
				}
			}
		}
	}
	return block;
};

SpriteMorph.prototype.variableBlock = function (varName) {
	var block = new ReporterBlockMorph(false);
	block.selector = 'reportGetVar';
	block.color = this.blockColor.variables;
	block.category = 'variables';
	block.setSpec(varName);
	block.isDraggable = true;
	return block;
};

SpriteMorph.prototype.addCostume = function (costume) {
	if (!costume.name) {
		costume.name = 'costume' + (this.costumes.length() + 1);
	}
	this.costumes.add(costume);
};

SpriteMorph.prototype.wearCostume = function (costume) {
	var x = this.xPosition ? this.xPosition() : null,
		y = this.yPosition ? this.yPosition() : null,
		isWarped = this.isWarped;
	if (isWarped) {
		this.endWarp();
	}
	this.changed();
	this.costume = costume;
	this.drawNew();
	this.changed();
	if (isWarped) {
		this.startWarp();
	}
	if (x !== null) {
		this.silentGotoXY(x, y, true);
	}
	if (this.positionTalkBubble) {
		this.positionTalkBubble();
	}
	this.version = Date.now();
};

SpriteMorph.prototype.getCostumeIdx = function () {
	return this.costumes.asArray().indexOf(this.costume) + 1;
};

SpriteMorph.prototype.doWearNextCostume = function () {
	var arr = this.costumes.asArray(),
		idx;
	if (arr.length > 1) {
		idx = arr.indexOf(this.costume);
		if (idx > -1) {
			idx += 1;
			if (idx > (arr.length - 1)) {
				idx = 0;
			}
			this.wearCostume(arr[idx]);
		}
	}
};

SpriteMorph.prototype.doWearPreviousCostume = function () {
	var arr = this.costumes.asArray(),
		idx;
	if (arr.length > 1) {
		idx = arr.indexOf(this.costume);
		if (idx > -1) {
			idx -= 1;
			if (idx < 0) {
				idx = arr.length - 1;
			}
			this.wearCostume(arr[idx]);
		}
	}
};

SpriteMorph.prototype.doSwitchToCostume = function (id) {
	if (id instanceof Costume) {
		this.wearCostume(id);
		return;
	}
	var num,
		arr = this.costumes.asArray(),
		costume;
	if (contains([localize('Turtle'), localize('Empty')], (id instanceof Array ? id[0] : null))) {
		costume = null;
	}
	else {
		if (id === -1) {
			this.doWearPreviousCostume();
			return;
		}
		costume = detect(arr, function (cst) {
			return cst.name === id;
		});
		if (costume === null) {
			num = parseFloat(id);
			if (num === 0) {
				costume = null;
			}
			else {
				costume = arr[num - 1] || null;
			}
		}
	}
	this.wearCostume(costume);
};

SpriteMorph.prototype.reportCostumes = function () {
	return this.costumes;
};

SpriteMorph.prototype.addSound = function (audio, name) {
	this.sounds.add(new Sound(audio, name));
};

SpriteMorph.prototype.playSound = function (name) {
	var stage = this.parentThatIsA(StageMorph),
		sound = detect(this.sounds.asArray(), function (s) {
		return s.name === name;
	}),
		active;
	if (sound) {
		active = sound.play();
		if (stage) {
			stage.activeSounds.push(active);
			stage.activeSounds = stage.activeSounds.filter(function (aud) {
				return !aud.ended && !aud.terminated;
			});
		}
		return active;
	}
};

SpriteMorph.prototype.reportSounds = function () {
	return this.sounds;
};

SpriteMorph.prototype.userMenu = function () {
	var ide = this.parentThatIsA(IDE_Morph),
		menu = new MenuMorph(this);
	if (ide && ide.isAppMode) {
		return menu;
	}
	if (!this.isClone) {
		menu.addItem("duplicate", 'duplicate');
	}
	menu.addItem("delete", 'remove');
	menu.addItem("move", 'moveCenter');
	if (!this.isClone) {
		menu.addItem("edit", 'edit');
	}
	menu.addLine();
	if (this.anchor) {
		menu.addItem(localize('detach from') + ' ' + this.anchor.name, 'detachFromAnchor');
	}
	if (this.parts.length) {
		menu.addItem('detach all parts', 'detachAllParts');
	}
	menu.addItem("export...", 'exportSprite');
	return menu;
};

SpriteMorph.prototype.showOnStage = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		this.keepWithin(stage);
		stage.add(this);
	}
	this.show();
};

SpriteMorph.prototype.createClone = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage && stage.cloneCount <= 2000) {
		this.fullCopy(true).clonify(stage);
	}
};

SpriteMorph.prototype.clonify = function (stage) {
	var hats;
	this.parts.forEach(function (part) {
		part.clonify(stage);
	});
	stage.cloneCount += 1;
	this.cloneOriginName = this.isClone ? this.cloneOriginName : this.name;
	this.isClone = true;
	this.name = '';
	stage.add(this);
	hats = this.allHatBlocksFor('__clone__init__');
	hats.forEach(function (block) {
		stage.threads.startProcess(block, stage.isThreadSafe, null, null, null, true);
	});
	this.endWarp();
};

SpriteMorph.prototype.removeClone = function () {
	if (this.isClone) {
		this.parent.threads.stopAllForReceiver(this);
		this.corpsify();
		this.destroy();
		this.parent.cloneCount -= 1;
	}
};

SpriteMorph.prototype.corpsify = function () {
	this.isCorpse = true;
	this.version = Date.now();
};

SpriteMorph.prototype.hide = function () {
	SpriteMorph.uber.hide.call(this);
	this.parts.forEach(function (part) {
		part.hide();
	});
};

SpriteMorph.prototype.show = function () {
	SpriteMorph.uber.show.call(this);
	this.parts.forEach(function (part) {
		part.show();
	});
};

SpriteMorph.prototype.setColor = function (aColor) {
	var x = this.xPosition(),
		y = this.yPosition();
	if (!this.color.eq(aColor)) {
		this.color = aColor.copy();
		this.drawNew();
		this.gotoXY(x, y);
	}
};

SpriteMorph.prototype.getHue = function () {
	return this.color.hsv()[0] * 100;
};

SpriteMorph.prototype.setHue = function (num) {
	var hsv = this.color.hsv(),
		x = this.xPosition(),
		y = this.yPosition();
	hsv[0] = Math.max(Math.min(+num || 0, 100), 0) / 100;
	hsv[1] = 1;
	this.color.set_hsv.apply(this.color, hsv);
	if (!this.costume) {
		this.drawNew();
		this.changed();
	}
	this.gotoXY(x, y);
};

SpriteMorph.prototype.changeHue = function (delta) {
	this.setHue(this.getHue() + (+delta || 0));
};

SpriteMorph.prototype.getBrightness = function () {
	return this.color.hsv()[2] * 100;
};

SpriteMorph.prototype.setBrightness = function (num) {
	var hsv = this.color.hsv(),
		x = this.xPosition(),
		y = this.yPosition();
	hsv[1] = 1;
	hsv[2] = Math.max(Math.min(+num || 0, 100), 0) / 100;
	this.color.set_hsv.apply(this.color, hsv);
	if (!this.costume) {
		this.drawNew();
		this.changed();
	}
	this.gotoXY(x, y);
};

SpriteMorph.prototype.changeBrightness = function (delta) {
	this.setBrightness(this.getBrightness() + (+delta || 0));
};

SpriteMorph.prototype.comeToFront = function () {
	if (this.parent) {
		this.parent.add(this);
		this.changed();
	}
};

SpriteMorph.prototype.goBack = function (layers) {
	var layer,
		newLayer = +layers || 0;
	if (!this.parent) {
		return null;
	}
	layer = this.parent.children.indexOf(this);
	if (layer < newLayer) {
		return null;
	}
	this.parent.removeChild(this);
	this.parent.children.splice(layer - newLayer, null, this);
	this.parent.changed();
};

SpriteMorph.prototype.overlappingImage = function (otherSprite) {
	var oRect = this.bounds.intersect(otherSprite.bounds),
		oImg = newCanvas(oRect.extent(), true),
		ctx = oImg.getContext('2d');
	if (oRect.width() < 1 || oRect.height() < 1) {
		return newCanvas(new Point(1, 1), true);
	}
	ctx.drawImage(this.image, this.left() - oRect.left(), this.top() - oRect.top());
	ctx.globalCompositeOperation = 'source-in';
	ctx.drawImage(otherSprite.image, otherSprite.left() - oRect.left(), otherSprite.top() - oRect.top());
	return oImg;
};

SpriteMorph.prototype.doStamp = function () {
	var stage = this.parent,
		context = stage.penTrails().getContext('2d'),
		isWarped = this.isWarped;
	if (isWarped) {
		this.endWarp();
	}
	context.save();
	context.scale(1 / stage.scale, 1 / stage.scale);
	context.drawImage(this.image, (this.left() - stage.left()), (this.top() - stage.top()));
	context.restore();
	this.changed();
	if (isWarped) {
		this.startWarp();
	}
};

SpriteMorph.prototype.clear = function () {
	this.parent.clearPenTrails();
};

SpriteMorph.prototype.setSize = function (size) {
	if (!isNaN(size)) {
		this.size = Math.min(Math.max(+size, 0.0001), 1000);
	}
};

SpriteMorph.prototype.changeSize = function (delta) {
	this.setSize(this.size + (+delta || 0));
};

SpriteMorph.prototype.getScale = function () {
	return this.scale * 100;
};

SpriteMorph.prototype.setScale = function (percentage) {
	var x = this.xPosition(),
		y = this.yPosition(),
		isWarped = this.isWarped,
		realScale,
		growth;
	if (isWarped) {
		this.endWarp();
	}
	realScale = (+percentage || 0) / 100;
	growth = realScale / this.nestingScale;
	this.nestingScale = realScale;
	this.scale = Math.max(realScale, 0.01);
	this.changed();
	this.drawNew();
	this.changed();
	if (isWarped) {
		this.startWarp();
	}
	this.silentGotoXY(x, y, true);
	this.positionTalkBubble();
	this.parts.forEach(function (part) {
		var xDist = part.xPosition() - x,
			yDist = part.yPosition() - y;
		part.setScale(part.scale * 100 * growth);
		part.silentGotoXY(x + (xDist * growth), y + (yDist * growth));
	});
};

SpriteMorph.prototype.changeScale = function (delta) {
	this.setScale(this.getScale() + (+delta || 0));
};

SpriteMorph.prototype.graphicsChanged = function () {
	var myself = this;
	return Object.keys(this.graphicsValues).some(function (any) {
		return myself.graphicsValues[any] < 0 || myself.graphicsValues[any] > 0;
	});
};

SpriteMorph.prototype.applyGraphicsEffects = function (canvas) {
	var ctx,
		imagedata,
		pixels,
		newimagedata;
	function transform_negative(p, value) {
		var i,
rcom,
			gcom,
			bcom;
		if (value !== 0) {
			for (i = 0; i < p.length; i += 4) {
				rcom = 255 - p[i];
				gcom = 255 - p[i + 1];
				bcom = 255 - p[i + 2];
				if (p[i] < rcom) {
					p[i] += value;
				}
				else if (p[i] > rcom) {
					p[i] -= value;
				}
				if (p[i + 1] < gcom) {
					p[i + 1] += value;
				}
				else if (p[i + 1] > gcom) {
					p[i + 1] -= value;
				}
				if (p[i + 2] < bcom) {
					p[i + 2] += value;
				}
				else if (p[i + 2] > bcom) {
					p[i + 2] -= value;
				}
			}
		}
		return p;
	}
	function transform_brightness(p, value) {
		var i;
		if (value !== 0) {
			for (i = 0; i < p.length; i += 4) {
				p[i] += value;
				p[i + 1] += value;
				p[i + 2] += value;
			}
		}
		return p;
	}
	function transform_comic(p, value) {
		var i;
		if (value !== 0) {
			for (i = 0; i < p.length; i += 4) {
				p[i] += Math.sin(i * value) * 127 + 128;
				p[i + 1] += Math.sin(i * value) * 127 + 128;
				p[i + 2] += Math.sin(i * value) * 127 + 128;
			}
		}
		return p;
	}
	function transform_duplicate(p, value) {
		var i;
		if (value !== 0) {
			for (i = 0; i < p.length; i += 4) {
				p[i] = p[i * value];
				p[i + 1] = p[i * value + 1];
				p[i + 2] = p[i * value + 2];
				p[i + 3] = p[i * value + 3];
			}
		}
		return p;
	}
	function transform_confetti(p, value) {
		var i;
		if (value !== 0) {
			for (i = 0; i < p.length; i += 1) {
				p[i] = Math.sin(value * p[i]) * 127 + p[i];
			}
		}
		return p;
	}
	if (this.graphicsChanged()) {
		ctx = canvas.getContext("2d");
		imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
		pixels = imagedata.data;
		pixels = transform_negative(pixels, this.graphicsValues.negative);
		pixels = transform_brightness(pixels, this.graphicsValues.brightness);
		pixels = transform_comic(pixels, this.graphicsValues.comic);
		pixels = transform_duplicate(pixels, this.graphicsValues.duplicate);
		pixels = transform_confetti(pixels, this.graphicsValues.confetti);
		newimagedata = ctx.createImageData(imagedata);
		newimagedata.data.set(pixels);
		ctx.putImageData(newimagedata, 0, 0);
	}
	return canvas;
};

SpriteMorph.prototype.setEffect = function (effect, value) {
	var eff = effect instanceof Array ? effect[0] : null;
	if (eff === 'ghost') {
		this.alpha = 1 - Math.min(Math.max(+value || 0, 0), 100) / 100;
	}
	else {
		this.graphicsValues[eff] = +value;
	}
	this.drawNew();
	this.changed();
};

SpriteMorph.prototype.getGhostEffect = function () {
	return (1 - this.alpha) * 100;
};

SpriteMorph.prototype.changeEffect = function (effect, value) {
	var eff = effect instanceof Array ? effect[0] : null;
	if (eff === 'ghost') {
		this.setEffect(effect, this.getGhostEffect() + (+value || 0));
	}
	else {
		this.setEffect(effect, +this.graphicsValues[eff] + (+value));
	}
};

SpriteMorph.prototype.clearEffects = function () {
	var effect;
	for (effect in this.graphicsValues) {
		if (this.graphicsValues.hasOwnProperty(effect)) {
			this.setEffect([effect], 0);
		}
	}
	this.setEffect(['ghost'], 0);
};

SpriteMorph.prototype.stopTalking = function () {
	var bubble = this.talkBubble();
	if (bubble) {
		bubble.destroy();
	}
};

SpriteMorph.prototype.doThink = function (data) {
	this.bubble(data, true);
};

SpriteMorph.prototype.bubble = function (data, isThought, isQuestion) {
	var bubble,
		stage = this.parentThatIsA(StageMorph);
	this.stopTalking();
	if (data === '' || isNil(data)) {
		return;
	}
	bubble = new SpriteBubbleMorph(data, stage, isThought, isQuestion);
	this.add(bubble);
	this.positionTalkBubble();
};

SpriteMorph.prototype.talkBubble = function () {
	return detect(this.children, function (morph) {
		return morph instanceof SpeechBubbleMorph;
	});
};

SpriteMorph.prototype.positionTalkBubble = function () {
	var stage = this.parentThatIsA(StageMorph),
		stageScale = stage ? stage.scale : 1,
		bubble = this.talkBubble(),
		middle = this.center().y;
	if (!bubble) {
		return null;
	}
	bubble.show();
	if (!bubble.isPointingRight) {
		bubble.isPointingRight = true;
		bubble.drawNew();
		bubble.changed();
	}
	bubble.setLeft(this.right());
	bubble.setBottom(this.top());
	while (!this.isTouching(bubble) && bubble.bottom() < middle) {
		bubble.silentMoveBy(new Point(-1, 1).scaleBy(stageScale));
	}
	if (!stage) {
		return null;
	}
	if (bubble.right() > stage.right()) {
		bubble.isPointingRight = false;
		bubble.drawNew();
		bubble.setRight(this.center().x);
	}
	bubble.keepWithin(stage);
	bubble.changed();
};

SpriteMorph.prototype.prepareToBeGrabbed = function (hand) {
	this.removeShadow();
	this.recordLayers();
	if (!this.bounds.containsPoint(hand.position()) && this.isCorrectingOutsideDrag()) {
		this.setCenter(hand.position());
	}
	this.addShadow();
};

SpriteMorph.prototype.isCorrectingOutsideDrag = function () {
	return !this.parts.length;
};

SpriteMorph.prototype.justDropped = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		stage.enableCustomHatBlocks = true;
	}
	this.restoreLayers();
	this.positionTalkBubble();
	this.receiveUserInteraction('dropped');
};

SpriteMorph.prototype.drawLine = function (start, dest) {
	var stagePos = this.parent.bounds.origin,
		stageScale = this.parent.scale,
		context = this.parent.penTrails().getContext('2d'),
		from = start.subtract(stagePos).divideBy(stageScale),
		to = dest.subtract(stagePos).divideBy(stageScale),
		damagedFrom = from.multiplyBy(stageScale).add(stagePos),
		damagedTo = to.multiplyBy(stageScale).add(stagePos),
		damaged = damagedFrom.rectangle(damagedTo).expandBy(Math.max(this.size * stageScale / 2, 1)).intersect(this.parent.visibleBounds()).spread();
	if (this.isDown) {
		context.lineWidth = this.size;
		context.strokeStyle = this.color.toString();
		if (this.useFlatLineEnds) {
			context.lineCap = 'butt';
			context.lineJoin = 'miter';
		}
		else {
			context.lineCap = 'round';
			context.lineJoin = 'round';
		}
		context.beginPath();
		context.moveTo(from.x, from.y);
		context.lineTo(to.x, to.y);
		context.stroke();
		if (this.isWarped === false) {
			this.world().broken.push(damaged);
		}
	}
};

SpriteMorph.prototype.moveBy = function (delta, justMe) {
	var start = this.isDown && !justMe && this.parent ? this.rotationCenter() : null;
	SpriteMorph.uber.moveBy.call(this, delta);
	if (start) {
		this.drawLine(start, this.rotationCenter());
	}
	if (!justMe) {
		this.parts.forEach(function (part) {
			part.moveBy(delta);
		});
	}
};

SpriteMorph.prototype.silentMoveBy = function (delta, justMe) {
	SpriteMorph.uber.silentMoveBy.call(this, delta);
	if (!justMe && this.parent instanceof HandMorph) {
		this.parts.forEach(function (part) {
			part.moveBy(delta);
		});
	}
};

SpriteMorph.prototype.rootForGrab = function () {
	if (this.anchor) {
		return this.anchor.rootForGrab();
	}
	return SpriteMorph.uber.rootForGrab.call(this);
};

SpriteMorph.prototype.slideBackTo = function (situation, inSteps) {
	var steps = inSteps || 5,
		xStep = -(this.left()) / steps,
		yStep = -(this.top()) / steps,
		stepCount = 0,
		oldStep = this.step,
		oldFps = this.fps,
		myself = this;
	this.fps = 0;
	this.step = function () {
		myself.moveBy(new Point(xStep, yStep));
		stepCount += 1;
		if (stepCount === steps) {
			situation.origin.add(myself);
			myself.step = oldStep;
			myself.fps = oldFps;
		}
	};
};

SpriteMorph.prototype.setCenter = function (aPoint, justMe) {
	var delta = aPoint.subtract(this.center());
	this.moveBy(delta, justMe);
};

SpriteMorph.prototype.nestingBounds = function () {
	var result = this.bounds;
	if (!this.costume && this.penBounds) {
		result = this.penBounds.translateBy(this.position());
	}
	this.parts.forEach(function (part) {
		if (part.isVisible) {
			result = result.merge(part.nestingBounds());
		}
	});
	return result;
};

SpriteMorph.prototype.setPosition = function (aPoint, justMe) {
	var delta = aPoint.subtract(this.topLeft());
	if ((delta.x !== 0) || (delta.y !== 0)) {
		this.moveBy(delta, justMe);
	}
};

SpriteMorph.prototype.forward = function (steps) {
	var dest,
		dist = steps * this.parent.scale || 0;
	if (dist >= 0) {
		dest = this.position().distanceAngle(dist, this.heading);
	}
	else {
		dest = this.position().distanceAngle(Math.abs(dist), (this.heading - 180));
	}
	this.setPosition(dest);
	this.positionTalkBubble();
};

SpriteMorph.prototype.setHeading = function (degrees) {
	var x = this.xPosition(),
		y = this.yPosition(),
		dir = (+degrees || 0),
		turn = dir - this.heading;
	if (this.rotationStyle) {
		this.changed();
		SpriteMorph.uber.setHeading.call(this, dir);
		this.silentGotoXY(x, y, true);
		this.positionTalkBubble();
	}
	else {
		this.heading = parseFloat(degrees) % 360;
	}
	this.parts.forEach(function (part) {
		var pos = new Point(part.xPosition(), part.yPosition()),
			trg = pos.rotateBy(radians(turn), new Point(x, y));
		if (part.rotatesWithAnchor) {
			part.turn(turn);
		}
		part.gotoXY(trg.x, trg.y);
	});
};

SpriteMorph.prototype.faceToXY = function (x, y) {
	var deltaX = (x - this.xPosition()) * this.parent.scale,
		deltaY = (y - this.yPosition()) * this.parent.scale,
		angle = Math.abs(deltaX) < 0.001 ? (deltaY < 0 ? 90 : 270) : Math.round((deltaX >= 0 ? 0 : 180) - (Math.atan(deltaY / deltaX) * 57.2957795131));
	this.setHeading(angle + 90);
};

SpriteMorph.prototype.turn = function (degrees) {
	this.setHeading(this.heading + (+degrees || 0));
};

SpriteMorph.prototype.turnLeft = function (degrees) {
	this.setHeading(this.heading - (+degrees || 0));
};

SpriteMorph.prototype.xPosition = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (!stage && this.parent.grabOrigin) {
		stage = this.parent.grabOrigin.origin;
	}
	if (stage) {
		return (this.rotationCenter().x - stage.center().x) / stage.scale;
	}
	return this.rotationCenter().x;
};

SpriteMorph.prototype.yPosition = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (!stage && this.parent.grabOrigin) {
		stage = this.parent.grabOrigin.origin;
	}
	if (stage) {
		return (stage.center().y - this.rotationCenter().y) / stage.scale;
	}
	return this.rotationCenter().y;
};

SpriteMorph.prototype.direction = function () {
	return this.heading;
};

SpriteMorph.prototype.penSize = function () {
	return this.size;
};

SpriteMorph.prototype.gotoXY = function (x, y, justMe) {
	var stage = this.parentThatIsA(StageMorph),
		newX,
		newY,
		dest;
	if (!stage) {
		return;
	}
	newX = stage.center().x + (+x || 0) * stage.scale;
	newY = stage.center().y - (+y || 0) * stage.scale;
	if (this.costume) {
		dest = new Point(newX, newY).subtract(this.rotationOffset);
	}
	else {
		dest = new Point(newX, newY).subtract(this.extent().divideBy(2));
	}
	this.setPosition(dest, justMe);
	this.positionTalkBubble();
};

SpriteMorph.prototype.silentGotoXY = function (x, y, justMe) {
	var penState = this.isDown;
	this.isDown = false;
	this.gotoXY(x, y, justMe);
	this.isDown = penState;
};

SpriteMorph.prototype.setXPosition = function (num) {
	this.gotoXY(+num || 0, this.yPosition());
};

SpriteMorph.prototype.changeXPosition = function (delta) {
	this.setXPosition(this.xPosition() + (+delta || 0));
};

SpriteMorph.prototype.setYPosition = function (num) {
	this.gotoXY(this.xPosition(), +num || 0);
};

SpriteMorph.prototype.changeYPosition = function (delta) {
	this.setYPosition(this.yPosition() + (+delta || 0));
};

SpriteMorph.prototype.glide = function (duration, endX, endY, elapsed, startPoint) {
	var fraction,
		endPoint,
		rPos;
	endPoint = new Point(endX, endY);
	fraction = Math.max(Math.min(elapsed / duration, 1), 0);
	rPos = startPoint.add(endPoint.subtract(startPoint).multiplyBy(fraction));
	this.gotoXY(rPos.x, rPos.y);
};

SpriteMorph.prototype.bounceOffEdge = function () {
	var stage = this.parentThatIsA(StageMorph),
		fb = this.nestingBounds(),
		dirX,
		dirY;
	if (!stage) {
		return null;
	}
	if (stage.bounds.containsRectangle(fb)) {
		return null;
	}
	dirX = Math.cos(radians(this.heading - 90));
	dirY = -(Math.sin(radians(this.heading - 90)));
	if (fb.left() < stage.left()) {
		dirX = Math.abs(dirX);
	}
	if (fb.right() > stage.right()) {
		dirX = -(Math.abs(dirX));
	}
	if (fb.top() < stage.top()) {
		dirY = -(Math.abs(dirY));
	}
	if (fb.bottom() > stage.bottom()) {
		dirY = Math.abs(dirY);
	}
	this.setHeading(degrees(Math.atan2(-dirY, dirX)) + 90);
	this.setPosition(this.position().add(fb.amountToTranslateWithin(stage.bounds)));
	this.positionTalkBubble();
};

SpriteMorph.prototype.allMessageNames = function () {
	var msgs = [];
	this.scripts.allChildren().forEach(function (morph) {
		var txt;
		if (morph.selector) {
			if (contains(['receiveMessage', 'doBroadcast', 'doBroadcastAndWait'], morph.selector)) {
				txt = morph.inputs()[0].evaluate();
				if (isString(txt) && txt !== '') {
					if (!contains(msgs, txt)) {
						msgs.push(txt);
					}
				}
			}
		}
	});
	return msgs;
};

SpriteMorph.prototype.allHatBlocksFor = function (message) {
	if (typeof message === 'number') {
		message = message.toString();
	}
	return this.scripts.children.filter(function (morph) {
		var event;
		if (morph.selector) {
			if (morph.selector === 'receiveMessage') {
				event = morph.inputs()[0].evaluate();
				return event === message || (event instanceof Array && message !== '__shout__go__' && message !== '__clone__init__');
			}
			if (morph.selector === 'receiveGo') {
				return message === '__shout__go__';
			}
			if (morph.selector === 'receiveOnClone') {
				return message === '__clone__init__';
			}
		}
		return false;
	});
};

SpriteMorph.prototype.allHatBlocksForKey = function (key) {
	return this.scripts.children.filter(function (morph) {
		if (morph.selector) {
			if (morph.selector === 'receiveKey') {
				var evt = morph.inputs()[0].evaluate()[0];
				return evt === key || evt === 'any key';
			}
		}
		return false;
	});
};

SpriteMorph.prototype.allHatBlocksForInteraction = function (interaction) {
	return this.scripts.children.filter(function (morph) {
		if (morph.selector) {
			if (morph.selector === 'receiveInteraction') {
				return morph.inputs()[0].evaluate()[0] === interaction;
			}
		}
		return false;
	});
};

SpriteMorph.prototype.allGenericHatBlocks = function () {
	return this.scripts.children.filter(function (morph) {
		if (morph.selector) {
			return morph.selector === 'receiveCondition';
		}
		return false;
	});
};

SpriteMorph.prototype.mouseClickLeft = function () {
	return this.receiveUserInteraction('clicked');
};

SpriteMorph.prototype.mouseEnter = function () {
	return this.receiveUserInteraction('mouse-entered');
};

SpriteMorph.prototype.mouseDownLeft = function () {
	return this.receiveUserInteraction('pressed');
};

SpriteMorph.prototype.receiveUserInteraction = function (interaction) {
	var stage = this.parentThatIsA(StageMorph),
		procs = [],
		hats;
	if (!stage) {
		return;
	}
	hats = this.allHatBlocksForInteraction(interaction);
	hats.forEach(function (block) {
		procs.push(stage.threads.startProcess(block, stage.isThreadSafe));
	});
	return procs;
};

SpriteMorph.prototype.getTimer = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.getTimer();
	}
	return 0;
};

SpriteMorph.prototype.getTempo = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.getTempo();
	}
	return 0;
};

SpriteMorph.prototype.getLastMessage = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.getLastMessage();
	}
	return '';
};

SpriteMorph.prototype.getLastAnswer = function () {
	return this.parentThatIsA(StageMorph).lastAnswer;
};

SpriteMorph.prototype.reportMouseX = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.reportMouseX();
	}
	return 0;
};

SpriteMorph.prototype.reportMouseY = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.reportMouseY();
	}
	return 0;
};

SpriteMorph.prototype.reportThreadCount = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (stage) {
		return stage.threads.processes.length;
	}
	return 0;
};

SpriteMorph.prototype.deleteAllBlockInstances = function (definition) {
	this.allBlockInstances(definition).forEach(function (each) {
		each.deleteBlock();
	});
	this.customBlocks.forEach(function (def) {
		if (def.body && def.body.expression.isCorpse) {
			def.body = null;
		}
	});
};

SpriteMorph.prototype.allBlockInstances = function (definition) {
	var stage,
		objects,
		blocks = [],
		inDefinitions;
	if (definition.isGlobal) {
		stage = this.parentThatIsA(StageMorph);
		objects = stage.children.filter(function (morph) {
			return morph instanceof SpriteMorph;
		});
		objects.push(stage);
		objects.forEach(function (sprite) {
			blocks = blocks.concat(sprite.allLocalBlockInstances(definition));
		});
		inDefinitions = [];
		stage.globalBlocks.forEach(function (def) {
			if (def.body) {
				def.body.expression.allChildren().forEach(function (c) {
					if (c.definition && (c.definition === definition)) {
						inDefinitions.push(c);
					}
				});
			}
		});
		return blocks.concat(inDefinitions);
	}
	return this.allLocalBlockInstances(definition);
};

SpriteMorph.prototype.allLocalBlockInstances = function (definition) {
	var inScripts,
		inDefinitions,
		inBlockEditors,
		inPalette,
		result;
	inScripts = this.scripts.allChildren().filter(function (c) {
		return c.definition && (c.definition === definition);
	});
	inDefinitions = [];
	this.customBlocks.forEach(function (def) {
		if (def.body) {
			def.body.expression.allChildren().forEach(function (c) {
				if (c.definition && (c.definition === definition)) {
					inDefinitions.push(c);
				}
			});
		}
	});
	inBlockEditors = this.allEditorBlockInstances(definition);
	result = inScripts.concat(inDefinitions).concat(inBlockEditors);
	if (inPalette) {
		result.push(inPalette);
	}
	return result;
};

SpriteMorph.prototype.allEditorBlockInstances = function (definition) {
	var inBlockEditors = [],
		world = this.world();
	if (!world) {
		return [];
	}
	return inBlockEditors;
};

SpriteMorph.prototype.thumbnail = function (extentPoint) {
	var src = this.image,
		scale = Math.min((extentPoint.x / src.width), (extentPoint.y / src.height)),
		xOffset = (extentPoint.x - (src.width * scale)) / 2,
		yOffset = (extentPoint.y - (src.height * scale)) / 2,
		trg = newCanvas(extentPoint),
		ctx = trg.getContext('2d');
	function xOut(style, alpha, width) {
		var inset = Math.min(extentPoint.x, extentPoint.y) / 10;
		ctx.strokeStyle = style;
		ctx.lineWidth = width || 1;
		ctx.moveTo(inset, inset);
		ctx.lineTo(trg.width - inset, trg.height - inset);
		ctx.moveTo(inset, trg.height - inset);
		ctx.lineTo(trg.width - inset, inset);
		ctx.stroke();
	}
	ctx.save();
	if (src.width && src.height) {
		ctx.scale(scale, scale);
		ctx.drawImage(src, Math.floor(xOffset / scale), Math.floor(yOffset / scale));
	}
	if (this.isCorpse) {
		ctx.restore();
		xOut('white', 0.8, 6);
		xOut('black', 0.8, 1);
	}
	return trg;
};

SpriteMorph.prototype.booleanMorph = function (bool) {
	var block = new ReporterBlockMorph(true);
	block.color = SpriteMorph.prototype.blockColor.operators;
	block.setSpec(localize(bool.toString()));
	return block;
};

SpriteMorph.prototype.attachPart = function (aSprite) {
	var v = Date.now();
	if (aSprite.anchor) {
		aSprite.anchor.detachPart(aSprite);
	}
	this.parts.push(aSprite);
	this.version = v;
	aSprite.anchor = this;
	this.allParts().forEach(function (part) {
		part.nestingScale = part.scale;
	});
	aSprite.version = v;
};

SpriteMorph.prototype.detachPart = function (aSprite) {
	var idx = this.parts.indexOf(aSprite),
		v;
	if (idx !== -1) {
		v = Date.now();
		this.parts.splice(idx, 1);
		this.version = v;
		aSprite.anchor = null;
		aSprite.version = v;
	}
};

SpriteMorph.prototype.detachAllParts = function () {
	var v = Date.now();
	this.parts.forEach(function (part) {
		part.anchor = null;
		part.version = v;
	});
	this.parts = [];
	this.version = v;
};

SpriteMorph.prototype.detachFromAnchor = function () {
	if (this.anchor) {
		this.anchor.detachPart(this);
	}
};

SpriteMorph.prototype.allParts = function () {
	var result = [this];
	this.parts.forEach(function (part) {
		result = result.concat(part.allParts());
	});
	return result;
};

SpriteMorph.prototype.allAnchors = function () {
	var result = [this];
	if (this.anchor !== null) {
		result = result.concat(this.anchor.allAnchors());
	}
	return result;
};

SpriteMorph.prototype.recordLayers = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (!stage) {
		return;
	}
	this.layers = this.allParts();
	this.layers.forEach(function (part) {
		var bubble = part.talkBubble();
		if (bubble) {
			bubble.hide();
		}
	});
	this.layers.sort(function (x, y) {
		return stage.children.indexOf(x) < stage.children.indexOf(y) ? -1 : 1;
	});
};

SpriteMorph.prototype.restoreLayers = function () {
	if (this.layers && this.layers.length > 1) {
		this.layers.forEach(function (sprite) {
			sprite.comeToFront();
			sprite.positionTalkBubble();
		});
	}
	this.layers = null;
};

SpriteMorph.prototype.addHighlight = function (oldHighlight) {
	var isHidden = !this.isVisible,
		highlight;
	if (isHidden) {
		this.show();
	}
	highlight = this.highlight(oldHighlight ? oldHighlight.color : this.highlightColor, this.highlightBorder);
	this.addBack(highlight);
	this.fullChanged();
	if (isHidden) {
		this.hide();
	}
	return highlight;
};

SpriteMorph.prototype.removeHighlight = function () {
	var highlight = this.getHighlight();
	if (highlight !== null) {
		this.fullChanged();
		this.removeChild(highlight);
	}
	return highlight;
};

SpriteMorph.prototype.toggleHighlight = function () {
	if (this.getHighlight()) {
		this.removeHighlight();
	}
	else {
		this.addHighlight();
	}
};

SpriteMorph.prototype.highlight = function (color, border) {
	var highlight = new SpriteHighlightMorph(),
		fb = this.bounds,
		edge = border,
		ctx;
	highlight.setExtent(fb.extent().add(edge * 2));
	highlight.color = color;
	highlight.image = this.highlightImage(color, border);
	ctx = highlight.image.getContext('2d');
	ctx.drawImage(this.highlightImage(new Color(255, 255, 255), 4), border - 4, border - 4);
	ctx.drawImage(this.highlightImage(new Color(50, 50, 50), 2), border - 2, border - 2);
	ctx.drawImage(this.highlightImage(new Color(255, 255, 255), 1), border - 1, border - 1);
	highlight.setPosition(fb.origin.subtract(new Point(edge, edge)));
	return highlight;
};

SpriteMorph.prototype.highlightImage = function (color, border) {
	var fb,
		img,
		hi,
		ctx,
		out;
	fb = this.extent();
	img = this.image;
	hi = newCanvas(fb.add(border * 2));
	ctx = hi.getContext('2d');
	ctx.drawImage(img, 0, 0);
	ctx.drawImage(img, border, 0);
	ctx.drawImage(img, border * 2, 0);
	ctx.drawImage(img, border * 2, border);
	ctx.drawImage(img, border * 2, border * 2);
	ctx.drawImage(img, border, border * 2);
	ctx.drawImage(img, 0, border * 2);
	ctx.drawImage(img, 0, border);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.drawImage(img, border, border);
	out = newCanvas(fb.add(border * 2));
	ctx = out.getContext('2d');
	ctx.drawImage(hi, 0, 0);
	ctx.globalCompositeOperation = 'source-atop';
	ctx.fillStyle = color.toString();
	ctx.fillRect(0, 0, out.width, out.height);
	return out;
};

SpriteMorph.prototype.getHighlight = function () {
	var highlights;
	highlights = this.children.slice(0).reverse().filter(function (child) {
		return child instanceof SpriteHighlightMorph;
	});
	if (highlights.length !== 0) {
		return highlights[0];
	}
	return null;
};

SpriteHighlightMorph.prototype = new Morph();
SpriteHighlightMorph.prototype.constructor = SpriteHighlightMorph;
function SpriteHighlightMorph() {
	this.init();
}

StageMorph.prototype = new FrameMorph();
StageMorph.prototype.constructor = StageMorph;
StageMorph.uber = FrameMorph.prototype;
StageMorph.prototype.dimensions = new Point(480, 360);
StageMorph.prototype.frameRate = 0;
StageMorph.prototype.isCachingPrimitives = SpriteMorph.prototype.isCachingPrimitives;
StageMorph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
StageMorph.prototype.paletteTextColor = SpriteMorph.prototype.paletteTextColor;
StageMorph.prototype.hiddenPrimitives = {};

StageMorph.prototype.codeMappings = {};

StageMorph.prototype.codeHeaders = {};

StageMorph.prototype.enableCodeMapping = false;
StageMorph.prototype.enableInheritance = false;
function StageMorph(globals) {
	this.init(globals);
}

StageMorph.prototype.init = function (globals) {
	this.name = localize('Stage');
	this.threads = new ThreadManager();
	this.variables = new VariableFrame(globals || null, this);
	this.scripts = new ScriptsMorph(this);
	this.customBlocks = [];
	this.globalBlocks = [];
	this.costumes = new List();
	this.costume = null;
	this.sounds = new List();
	this.version = Date.now();
	this.isFastTracked = false;
	this.enableCustomHatBlocks = true;
	this.cloneCount = 0;
	this.timerStart = Date.now();
	this.tempo = 60;
	this.lastMessage = '';
	this.watcherUpdateFrequency = 2;
	this.lastWatcherUpdate = Date.now();
	this.scale = 1;
	this.keysPressed = {};
	this.blocksCache = {};
	this.paletteCache = {};
	this.lastAnswer = '';
	this.activeSounds = [];
	this.trailsCanvas = null;
	this.isThreadSafe = false;
	this.graphicsValues = {
		'negative' : 0,
		'fisheye' : 0,
		'whirl' : 0,
		'pixelate' : 0,
		'mosaic' : 0,
		'brightness' : 0,
		'color' : 0,
		'comic' : 0,
		'duplicate' : 0,
		'confetti' : 0
	};
	StageMorph.uber.init.call(this);
	this.acceptsDrops = false;
	this.setColor(new Color(255, 255, 255));
	this.fps = this.frameRate;
};

StageMorph.prototype.setScale = function (number) {
	var delta = number / this.scale,
		pos = this.position(),
		relativePos,
		bubble,
		oldFlag = Morph.prototype.trackChanges,
		myself = this;
	if (delta === 1) {
		return;
	}
	Morph.prototype.trackChanges = false;
	this.scale = number;
	this.setExtent(this.dimensions.multiplyBy(number));
	this.children.forEach(function (morph) {
		relativePos = morph.position().subtract(pos);
		morph.drawNew();
		morph.setPosition(relativePos.multiplyBy(delta).add(pos), true);
		if (morph instanceof SpriteMorph) {
			bubble = morph.talkBubble();
			if (bubble) {
				bubble.setScale(number);
				morph.positionTalkBubble();
			}
		}
		else if (morph instanceof StagePrompterMorph) {
			if (myself.scale < 1) {
				morph.setWidth(myself.width() - 10);
			}
			else {
				morph.setWidth(myself.dimensions.x - 20);
			}
			morph.fixLayout();
			morph.setCenter(myself.center());
			morph.setBottom(myself.bottom());
		}
	});
	Morph.prototype.trackChanges = oldFlag;
	this.changed();
};

StageMorph.prototype.drawNew = function () {
	var ctx;
	StageMorph.uber.drawNew.call(this);
	if (this.costume) {
		ctx = this.image.getContext('2d');
		ctx.scale(this.scale, this.scale);
		ctx.drawImage(this.costume.contents, (this.width() / this.scale - this.costume.width()) / 2, (this.height() / this.scale - this.costume.height()) / 2);
		this.image = this.applyGraphicsEffects(this.image);
	}
	this.version = Date.now();
};

StageMorph.prototype.drawOn = function (aCanvas, aRect) {
	var rectangle,
		area,
		delta,
		src,
		context,
		w,
		h,
		sl,
		st,
		ws,
		hs;
	if (!this.isVisible) {
		return null;
	}
	rectangle = aRect || this.bounds;
	area = rectangle.intersect(this.bounds);
	if (area.extent().gt(new Point(0, 0))) {
		delta = this.position().neg();
		src = area.copy().translateBy(delta);
		context = aCanvas.getContext('2d');
		sl = src.left();
		st = src.top();
		w = Math.min(src.width(), this.image.width - sl);
		h = Math.min(src.height(), this.image.height - st);
		if (w < 1 || h < 1) {
			return null;
		}
		context.drawImage(this.image, sl, st, w, h, area.left(), area.top(), w, h);
		ws = w / this.scale;
		hs = h / this.scale;
		context.save();
		context.scale(this.scale, this.scale);
		try {
			context.drawImage(this.penTrails(), sl / this.scale, st / this.scale, ws, hs, area.left() / this.scale, area.top() / this.scale, ws, hs);
		}
		catch (err) {
			context.restore();
			context.drawImage(this.penTrails(), 0, 0, this.dimensions.x, this.dimensions.y, this.left(), this.top(), this.dimensions.x * this.scale, this.dimensions.y * this.scale);
		}
		context.restore();
	}
};

StageMorph.prototype.clearPenTrails = function () {
	this.trailsCanvas = newCanvas(this.dimensions);
	this.changed();
};

StageMorph.prototype.penTrails = function () {
	if (!this.trailsCanvas) {
		this.trailsCanvas = newCanvas(this.dimensions);
	}
	return this.trailsCanvas;
};

StageMorph.prototype.penTrailsMorph = function () {
	var morph = new Morph(),
		trails = this.penTrails(),
		ctx;
	morph.bounds = this.bounds.copy();
	morph.image = newCanvas(this.extent());
	ctx = morph.image.getContext('2d');
	ctx.drawImage(trails, 0, 0, trails.width, trails.height, 0, 0, this.image.width, this.image.height);
	return morph;
};

StageMorph.prototype.colorFiltered = function (aColor, excludedSprite) {
	var morph = new Morph(),
		ext = this.extent(),
		ctx,
		src,
		clr,
		i,
		dta;
	morph.bounds = this.bounds.copy();
	morph.image = newCanvas(ext, true);
	ctx = morph.image.getContext('2d');
	dta = ctx.createImageData(ext.x, ext.y);
	ctx.putImageData(dta, 0, 0);
	return morph;
};

StageMorph.prototype.watchers = function (leftPos) {
	return this.children.filter(function (morph) {
		if (morph instanceof WatcherMorph) {
			if (leftPos) {
				return morph.left() === leftPos;
			}
			return morph.isVisible;
		}
		return false;
	});
};

StageMorph.prototype.resetTimer = function () {
	this.timerStart = Date.now();
};

StageMorph.prototype.getTimer = function () {
	var elapsed = Math.floor((Date.now() - this.timerStart) / 100);
	return elapsed / 10;
};

StageMorph.prototype.setTempo = function (bpm) {
	this.tempo = Math.max(20, (+bpm || 0));
};

StageMorph.prototype.changeTempo = function (delta) {
	this.setTempo(this.getTempo() + (+delta || 0));
};

StageMorph.prototype.getTempo = function () {
	return +this.tempo;
};

StageMorph.prototype.getLastMessage = function () {
	return this.lastMessage || '';
};

StageMorph.prototype.reportMouseX = function () {
	var world = this.world();
	if (world) {
		return (world.hand.position().x - this.center().x) / this.scale;
	}
	return 0;
};

StageMorph.prototype.reportMouseY = function () {
	var world = this.world();
	if (world) {
		return (this.center().y - world.hand.position().y) / this.scale;
	}
	return 0;
};

StageMorph.prototype.wantsDropOf = function (aMorph) {
	return aMorph instanceof SpriteMorph || aMorph instanceof WatcherMorph || aMorph instanceof ListWatcherMorph;
};

StageMorph.prototype.step = function () {
	var current,
		elapsed,
		leftover,
		world = this.world();
	if (world.keyboardReceiver === null) {
		world.keyboardReceiver = this;
	}
	if (world.currentKey === null) {
		this.keyPressed = null;
	}
	if (this.enableCustomHatBlocks) {
		this.stepGenericConditions();
	}
	if (this.isFastTracked && this.threads.processes.length) {
		this.children.forEach(function (morph) {
			if (morph instanceof SpriteMorph) {
				morph.wasWarped = morph.isWarped;
				if (!morph.isWarped) {
					morph.startWarp();
				}
			}
		});
		while ((Date.now() - this.lastTime) < 100) {
			this.threads.step();
		}
		this.children.forEach(function (morph) {
			if (morph instanceof SpriteMorph) {
				if (!morph.wasWarped) {
					morph.endWarp();
				}
			}
		});
		this.changed();
	}
	else {
		this.threads.step();
	}
	current = Date.now();
	elapsed = current - this.lastWatcherUpdate;
	leftover = (1000 / this.watcherUpdateFrequency) - elapsed;
	if (leftover < 1) {
		this.watchers().forEach(function (w) {
			w.update();
		});
		this.lastWatcherUpdate = Date.now();
	}
};

StageMorph.prototype.stepGenericConditions = function (stopAll) {
	var hats = [],
		myself = this,
		ide;
	this.children.concat(this).forEach(function (morph) {
		if (morph instanceof SpriteMorph || morph instanceof StageMorph) {
			hats = hats.concat(morph.allGenericHatBlocks());
		}
	});
	if (!hats.length) {
		this.enableCustomHatBlocks = false;
		ide = this.parentThatIsA(IDE_Morph);
		return;
	}
	hats.forEach(function (block) {
		myself.threads.doWhen(block, stopAll);
	});
};

StageMorph.prototype.processKeyDown = function (event) {
	this.processKeyEvent(event, this.fireKeyEvent);
};

StageMorph.prototype.processKeyUp = function (event) {
	this.processKeyEvent(event, this.removePressedKey);
};

StageMorph.prototype.processKeyEvent = function (event, action) {
	var keyName;
	switch (event.keyCode) {
		case 13:
			keyName = 'enter';
			if (event.ctrlKey || event.metaKey) {
				keyName = 'ctrl enter';
			}
			else if (event.shiftKey) {
				keyName = 'shift enter';
			}
			break;
		case 27:
			keyName = 'esc';
			break;
		case 32:
			keyName = 'space';
			break;
		case 37:
			keyName = 'left arrow';
			break;
		case 39:
			keyName = 'right arrow';
			break;
		case 38:
			keyName = 'up arrow';
			break;
		case 40:
			keyName = 'down arrow';
			break;
		default:
			keyName = String.fromCharCode(event.keyCode);
			if (event.ctrlKey || event.metaKey) {
				keyName = 'ctrl ' + (event.shiftKey ? 'shift ' : '') + keyName;
			}
	}
	action.call(this, keyName);
};

StageMorph.prototype.fireKeyEvent = function (key) {
	var evt = key.toLowerCase(),
		hats = [],
		procs = [],
		ide = this.parentThatIsA(IDE_Morph),
		myself = this;
	this.keysPressed[evt] = true;
	if (evt === 'ctrl enter') {
		return this.fireGreenFlagEvent();
	}
	if (evt === 'ctrl f') {
		return;
	}
	if (evt === 'ctrl n') {
		return;
	}
	if (evt === 'ctrl o') {
		return;
	}
	if (evt === 'ctrl s') {
		return;
	}
	if (evt === 'ctrl shift s') {
		return;
	}
	this.children.concat(this).forEach(function (morph) {
		if (isSnapObject(morph)) {
			hats = hats.concat(morph.allHatBlocksForKey(evt));
		}
	});
	hats.forEach(function (block) {
		procs.push(myself.threads.startProcess(block, myself.isThreadSafe));
	});
	return procs;
};

StageMorph.prototype.removePressedKey = function (key) {
	delete this.keysPressed[key.toLowerCase()];
};

StageMorph.prototype.processKeyPress = function (event) {
	nop(event);
};

StageMorph.prototype.inspectKeyEvent = CursorMorph.prototype.inspectKeyEvent;
StageMorph.prototype.fireGreenFlagEvent = function () {
	var procs = [],
		hats = [],
		ide = this.parentThatIsA(IDE_Morph),
		myself = this;
	this.children.concat(this).forEach(function (morph) {
		if (isSnapObject(morph)) {
			hats = hats.concat(morph.allHatBlocksFor('__shout__go__'));
		}
	});
	hats.forEach(function (block) {
		procs.push(myself.threads.startProcess(block, myself.isThreadSafe));
	});
	return procs;
};

StageMorph.prototype.removeAllClones = function () {
	var myself = this,
		clones = this.children.filter(function (morph) {
		return morph.isClone;
	});
	clones.forEach(function (clone) {
		myself.threads.stopAllForReceiver(clone);
		clone.detachFromAnchor();
		clone.corpsify();
		clone.destroy();
	});
	this.cloneCount = 0;
};

StageMorph.prototype.clear = function () {
	this.clearPenTrails();
};

StageMorph.prototype.userMenu = function () {
	var ide = this.parentThatIsA(IDE_Morph),
		menu = new MenuMorph(this),
		shiftClicked = this.world().currentKey === 16,
		myself = this;
	if (ide && ide.isAppMode) {
		return menu;
	}
	menu.addItem("edit", 'edit');
	menu.addItem("show all", 'showAll');
	if (shiftClicked) {
		menu.addLine();
		menu.addItem("turn pen trails into new costume...", function () {
			var costume = new Costume(myself.trailsCanvas, Date.now().toString()).copy();
		}, 'turn all pen trails and stamps\n' + 'into a new costume for the\ncurrently selected sprite', new Color(100, 0, 0));
	}
	return menu;
};

StageMorph.prototype.showAll = function () {
	var myself = this;
	this.children.forEach(function (m) {
		if (m instanceof SpriteMorph) {
			if (!m.anchor) {
				m.show();
				m.keepWithin(myself);
			}
		}
		else {
			m.show();
			m.keepWithin(myself);
			if (m.fixLayout) {
				m.fixLayout();
			}
		}
	});
};

StageMorph.prototype.hide = function () {
	this.isVisible = false;
	this.changed();
};

StageMorph.prototype.show = function () {
	this.isVisible = true;
	this.changed();
};

StageMorph.prototype.createClone = nop;
StageMorph.prototype.addCostume = SpriteMorph.prototype.addCostume;
StageMorph.prototype.wearCostume = SpriteMorph.prototype.wearCostume;
StageMorph.prototype.getCostumeIdx = SpriteMorph.prototype.getCostumeIdx;
StageMorph.prototype.doWearNextCostume = SpriteMorph.prototype.doWearNextCostume;
StageMorph.prototype.doWearPreviousCostume = SpriteMorph.prototype.doWearPreviousCostume;
StageMorph.prototype.doSwitchToCostume = SpriteMorph.prototype.doSwitchToCostume;
StageMorph.prototype.reportCostumes = SpriteMorph.prototype.reportCostumes;
StageMorph.prototype.graphicsChanged = SpriteMorph.prototype.graphicsChanged;
StageMorph.prototype.applyGraphicsEffects = SpriteMorph.prototype.applyGraphicsEffects;
StageMorph.prototype.setEffect = SpriteMorph.prototype.setEffect;
StageMorph.prototype.getGhostEffect = SpriteMorph.prototype.getGhostEffect;
StageMorph.prototype.changeEffect = SpriteMorph.prototype.changeEffect;
StageMorph.prototype.clearEffects = SpriteMorph.prototype.clearEffects;
StageMorph.prototype.addSound = SpriteMorph.prototype.addSound;
StageMorph.prototype.playSound = SpriteMorph.prototype.playSound;
StageMorph.prototype.stopAllActiveSounds = function () {
	this.activeSounds.forEach(function (audio) {
		audio.pause();
	});
	this.activeSounds = [];
};

StageMorph.prototype.pauseAllActiveSounds = function () {
	this.activeSounds.forEach(function (audio) {
		audio.pause();
	});
};

StageMorph.prototype.resumeAllActiveSounds = function () {
	this.activeSounds.forEach(function (audio) {
		audio.play();
	});
};

StageMorph.prototype.reportSounds = SpriteMorph.prototype.reportSounds;
StageMorph.prototype.allHatBlocksFor = SpriteMorph.prototype.allHatBlocksFor;
StageMorph.prototype.allHatBlocksForKey = SpriteMorph.prototype.allHatBlocksForKey;
StageMorph.prototype.allHatBlocksForInteraction = SpriteMorph.prototype.allHatBlocksForInteraction;
StageMorph.prototype.allGenericHatBlocks = SpriteMorph.prototype.allGenericHatBlocks;
StageMorph.prototype.mouseClickLeft = SpriteMorph.prototype.mouseClickLeft;
StageMorph.prototype.mouseEnter = SpriteMorph.prototype.mouseEnter;
StageMorph.prototype.mouseDownLeft = SpriteMorph.prototype.mouseDownLeft;
StageMorph.prototype.receiveUserInteraction = SpriteMorph.prototype.receiveUserInteraction;
SpriteBubbleMorph.prototype = new SpeechBubbleMorph();
SpriteBubbleMorph.prototype.constructor = SpriteBubbleMorph;
SpriteBubbleMorph.uber = SpeechBubbleMorph.prototype;
function SpriteBubbleMorph(data, stage, isThought, isQuestion) {
	this.init(data, stage, isThought, isQuestion);
}

SpriteBubbleMorph.prototype.init = function (data, stage, isThought, isQuestion) {
	var sprite = SpriteMorph.prototype;
	this.stage = stage;
	this.scale = stage ? stage.scale : 1;
	this.data = data;
	this.isQuestion = isQuestion;
	SpriteBubbleMorph.uber.init.call(this, this.dataAsMorph(data), sprite.bubbleColor, null, null, isQuestion ? sprite.blockColor.sensing : sprite.bubbleBorderColor, null, isThought);
};

SpriteBubbleMorph.prototype.dataAsMorph = function (data, toggle) {
	var contents,
		isTable,
		sprite = SpriteMorph.prototype,
		isText,
		img,
		scaledImg,
		width;
	if (data instanceof Morph) {
		if (isSnapObject(data)) {
			img = data.thumbnail(new Point(40, 40));
			contents = new Morph();
			contents.silentSetWidth(img.width);
			contents.silentSetHeight(img.height);
			contents.image = img;
			contents.version = data.version;
			contents.step = function () {
				if (this.version !== data.version) {
					img = data.thumbnail(new Point(40, 40));
					this.image = img;
					this.version = data.version;
					this.changed();
				}
			};
		}
		else {
			contents = data;
		}
	}
	else if (isString(data)) {
		isText = true;
		contents = new TextMorph(data, sprite.bubbleFontSize * this.scale, null, sprite.bubbleFontIsBold, false, 'center');
	}
	else if (typeof data === 'boolean') {
		img = sprite.booleanMorph(data).fullImage();
		contents = new Morph();
		contents.silentSetWidth(img.width);
		contents.silentSetHeight(img.height);
		contents.image = img;
	}
	else if (data instanceof Costume) {
		img = data.thumbnail(new Point(40, 40));
		contents = new Morph();
		contents.silentSetWidth(img.width);
		contents.silentSetHeight(img.height);
		contents.image = img;
	}
	else if (data instanceof HTMLCanvasElement) {
		contents = new Morph();
		contents.silentSetWidth(data.width);
		contents.silentSetHeight(data.height);
		contents.image = data;
	}
	else if (data instanceof List) {
		if (toggle && this.contentsMorph) {
			isTable = (this.contentsMorph instanceof ListWatcherMorph);
		}
		else {
			isTable = data.isTable();
		}
		if (isTable) {
			contents = new TableFrameMorph(new TableMorph(data, 10));
			if (this.stage) {
				contents.expand(this.stage.extent().translateBy(-2 * (this.edge + this.border + this.padding)));
			}
		}
		else {
			contents = new ListWatcherMorph(data);
			contents.update(true);
			contents.step = contents.update;
			if (this.stage) {
				contents.expand(this.stage.extent().translateBy(-2 * (this.edge + this.border + this.padding)));
			}
		}
		contents.isDraggable = false;
	}
	else if (data instanceof Context) {
		img = data.image();
		contents = new Morph();
		contents.silentSetWidth(img.width);
		contents.silentSetHeight(img.height);
		contents.image = img;
	}
	else {
		contents = new TextMorph(data.toString(), sprite.bubbleFontSize * this.scale, null, sprite.bubbleFontIsBold, false, 'center');
	}
	if (contents instanceof TextMorph) {
		width = Math.max(contents.width(), sprite.bubbleCorner * 2 * this.scale);
		if (isText) {
			width = Math.min(width, sprite.bubbleMaxTextWidth * this.scale);
		}
		contents.setWidth(width);
	}
	else if (!(data instanceof List)) {
		scaledImg = newCanvas(contents.extent().multiplyBy(this.scale));
		scaledImg.getContext('2d').drawImage(contents.image, 0, 0, scaledImg.width, scaledImg.height);
		contents.image = scaledImg;
		contents.bounds = contents.bounds.scaleBy(this.scale);
	}
	return contents;
};

SpriteBubbleMorph.prototype.setScale = function (scale) {
	this.scale = scale;
	this.changed();
	this.drawNew();
	this.changed();
};

SpriteBubbleMorph.prototype.drawNew = function (toggle) {
	var sprite = SpriteMorph.prototype;
	this.edge = sprite.bubbleCorner * this.scale;
	this.border = sprite.bubbleBorder * this.scale;
	this.padding = sprite.bubbleCorner / 2 * this.scale;
	if (this.contentsMorph) {
		this.contentsMorph.destroy();
	}
	this.contentsMorph = this.dataAsMorph(this.data, toggle);
	this.add(this.contentsMorph);
	this.silentSetWidth(this.contentsMorph.width() + (this.padding ? this.padding * 2 : this.edge * 2));
	this.silentSetHeight(this.contentsMorph.height() + this.edge + this.border * 2 + this.padding * 2 + 2);
	SpeechBubbleMorph.uber.drawNew.call(this);
	this.contentsMorph.setPosition(this.position().add(new Point(this.padding || this.edge, this.border + this.padding + 1)));
};

SpriteBubbleMorph.prototype.fixLayout = function () {
	var sprite = SpriteMorph.prototype;
	this.changed();
	this.edge = sprite.bubbleCorner * this.scale;
	this.border = sprite.bubbleBorder * this.scale;
	this.padding = sprite.bubbleCorner / 2 * this.scale;
	this.silentSetWidth(this.contentsMorph.width() + (this.padding ? this.padding * 2 : this.edge * 2));
	this.silentSetHeight(this.contentsMorph.height() + this.edge + this.border * 2 + this.padding * 2 + 2);
	SpeechBubbleMorph.uber.drawNew.call(this);
	this.contentsMorph.setPosition(this.position().add(new Point(this.padding || this.edge, this.border + this.padding + 1)));
	this.changed();
};

function Costume(canvas, name, rotationCenter) {
	this.contents = canvas ? normalizeCanvas(canvas, true) : newCanvas(null, true);
	this.name = name || null;
	this.rotationCenter = rotationCenter || this.center();
	this.version = Date.now();
	this.loaded = null;
}

Costume.prototype.maxExtent = function () {
	return StageMorph.prototype.dimensions;
};

Costume.prototype.toString = function () {
	return 'a Costume(' + this.name + ')';
};

Costume.prototype.extent = function () {
	return new Point(this.contents.width, this.contents.height);
};

Costume.prototype.center = function () {
	return this.extent().divideBy(2);
};

Costume.prototype.width = function () {
	return this.contents.width;
};

Costume.prototype.height = function () {
	return this.contents.height;
};

Costume.prototype.bounds = function () {
	return new Rectangle(0, 0, this.width(), this.height());
};

Costume.prototype.shrinkWrap = function () {
	var bb = this.boundingBox(),
		ext = bb.extent(),
		pic = newCanvas(ext, true),
		ctx = pic.getContext('2d');
	ctx.drawImage(this.contents, bb.origin.x, bb.origin.y, ext.x, ext.y, 0, 0, ext.x, ext.y);
	this.rotationCenter = this.rotationCenter.subtract(bb.origin);
	this.contents = pic;
	this.version = Date.now();
};

Costume.prototype.copy = function () {
	var canvas = newCanvas(this.extent(), true),
		cpy,
		ctx;
	ctx = canvas.getContext('2d');
	ctx.drawImage(this.contents, 0, 0);
	cpy = new Costume(canvas, this.name ? copy(this.name) : null);
	cpy.rotationCenter = this.rotationCenter.copy();
	return cpy;
};

Costume.prototype.flipped = function () {
	var canvas = newCanvas(this.extent(), true),
		ctx = canvas.getContext('2d'),
		flipped;
	ctx.translate(this.width(), 0);
	ctx.scale(-1, 1);
	ctx.drawImage(this.contents, 0, 0);
	flipped = new Costume(canvas, new Point(this.width() - this.rotationCenter.x, this.rotationCenter.y));
	return flipped;
};

Costume.prototype.thumbnail = function (extentPoint) {
	var src = this.contents,
		scale = Math.min((extentPoint.x / src.width), (extentPoint.y / src.height)),
		xOffset = (extentPoint.x - (src.width * scale)) / 2,
		yOffset = (extentPoint.y - (src.height * scale)) / 2,
		trg = newCanvas(extentPoint),
		ctx = trg.getContext('2d');
	if (!src || src.width + src.height === 0) {
		return trg;
	}
	ctx.scale(scale, scale);
	ctx.drawImage(src, Math.floor(xOffset / scale), Math.floor(yOffset / scale));
	return trg;
};

Costume.prototype.isTainted = function () {
	try {
		this.contents.getContext('2d').getImageData(0, 0, this.contents.width, this.contents.height);
	}
	catch (err) {
		return true;
	}
	return false;
};

SVG_Costume.prototype = new Costume();
SVG_Costume.prototype.constructor = SVG_Costume;
SVG_Costume.uber = Costume.prototype;
function SVG_Costume(svgImage, name, rotationCenter) {
	this.contents = svgImage;
	this.name = name || null;
	this.rotationCenter = rotationCenter || this.center();
	this.version = Date.now();
	this.loaded = null;
}

SVG_Costume.prototype.toString = function () {
	return 'an SVG_Costume(' + this.name + ')';
};

SVG_Costume.prototype.copy = function () {
	var img = new Image(),
		cpy;
	img.src = this.contents.src;
	cpy = new SVG_Costume(img, this.name ? copy(this.name) : null);
	cpy.rotationCenter = this.rotationCenter.copy();
	return cpy;
};

function Sound(audio, name) {
	this.audio = audio;
	this.name = name || "Sound";
}

Sound.prototype.play = function () {
	var aud = document.createElement('audio');
	aud.src = this.audio.src;
	aud.play();
	return aud;
};

Sound.prototype.copy = function () {
	var snd = document.createElement('audio'),
		cpy;
	snd.src = this.audio.src;
	cpy = new Sound(snd, this.name ? copy(this.name) : null);
	return cpy;
};

Sound.prototype.toDataURL = function () {
	return this.audio.src;
};

function Note(pitch) {
	this.pitch = pitch === 0 ? 0 : pitch || 69;
	this.setupContext();
	this.oscillator = null;
}

Note.prototype.audioContext = null;
Note.prototype.gainNode = null;
Note.prototype.setupContext = function () {
	if (this.audioContext) {
		return;
	}
	var AudioContext = (function () {
		var ctx = window.AudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext || window.webkitAudioContext;
		if (!ctx.prototype.hasOwnProperty('createGain')) {
			ctx.prototype.createGain = ctx.prototype.createGainNode;
		}
		return ctx;
	}());
	if (!AudioContext) {
		throw new Error('Web Audio API is not supported\nin this browser');
	}
	Note.prototype.audioContext = new AudioContext();
	Note.prototype.gainNode = Note.prototype.audioContext.createGain();
	Note.prototype.gainNode.gain.value = 0.25;
};

Note.prototype.play = function () {
	this.oscillator = this.audioContext.createOscillator();
	if (!this.oscillator.start) {
		this.oscillator.start = this.oscillator.noteOn;
	}
	if (!this.oscillator.stop) {
		this.oscillator.stop = this.oscillator.noteOff;
	}
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = Math.pow(2, (this.pitch - 69) / 12) * 440;
	this.oscillator.connect(this.gainNode);
	this.gainNode.connect(this.audioContext.destination);
	this.oscillator.start(0);
};

Note.prototype.stop = function () {
	if (this.oscillator) {
		this.oscillator.stop(0);
		this.oscillator = null;
	}
};

CellMorph.prototype = new BoxMorph();
CellMorph.prototype.constructor = CellMorph;
CellMorph.uber = BoxMorph.prototype;
function CellMorph(contents, color, idx, parentCell) {
	this.init(contents, color, idx, parentCell);
}

CellMorph.prototype.init = function (contents, color, idx, parentCell) {
	this.contents = (contents === 0 ? 0 : contents === false ? false : contents || '');
	this.isEditable = isNil(idx) ? false : true;
	this.idx = idx || null;
	this.parentCell = parentCell || null;
	CellMorph.uber.init.call(this, SyntaxElementMorph.prototype.corner, 1.000001, new Color(255, 255, 255));
	this.color = color || new Color(255, 140, 0);
	this.isBig = false;
	this.version = null;
	this.drawNew();
};

CellMorph.prototype.big = function () {
	this.isBig = true;
	this.changed();
	this.drawNew();
	this.changed();
};

CellMorph.prototype.normal = function () {
	this.isBig = false;
	this.changed();
	this.drawNew();
	this.changed();
};

CellMorph.prototype.isCircular = function (list) {
	if (!this.parentCell) {
		return false;
	}
	if (list instanceof List) {
		return this.contents === list || this.parentCell.isCircular(list);
	}
	return this.parentCell.isCircular(this.contents);
};

CellMorph.prototype.fixLayout = function () {
	var listwatcher;
	this.changed();
	this.drawNew();
	this.changed();
	if (this.parent && this.parent.fixLayout) {
		this.parent.fixLayout();
	}
	else {
		listwatcher = this.parentThatIsA(ListWatcherMorph);
		if (listwatcher) {
			listwatcher.fixLayout();
		}
	}
};

CellMorph.prototype.drawNew = function (toggle, type) {
	var context,
		txt,
		img,
		fontSize = SyntaxElementMorph.prototype.fontSize,
		isSameList = this.contentsMorph instanceof ListWatcherMorph && (this.contentsMorph.list === this.contents),
		isSameTable = this.contentsMorph instanceof TableFrameMorph && (this.contentsMorph.tableMorph.table === this.contents);
	if (this.isBig) {
		fontSize = fontSize * 1.5;
	}
	if (toggle || (this.contentsMorph && !isSameList && !isSameTable)) {
		this.contentsMorph.destroy();
		this.version = null;
	}
	if (toggle || (!isSameList && !isSameTable)) {
		if (this.contents instanceof Morph) {
			if (isSnapObject(this.contents)) {
				img = this.contents.thumbnail(new Point(40, 40));
				this.contentsMorph = new Morph();
				this.contentsMorph.silentSetWidth(img.width);
				this.contentsMorph.silentSetHeight(img.height);
				this.contentsMorph.image = img;
				this.version = this.contents.version;
			}
			else {
				this.contentsMorph = this.contents;
			}
		}
		else if (isString(this.contents)) {
			txt = this.contents.length > 500 ? this.contents.slice(0, 500) + '...' : this.contents;
			this.contentsMorph = new TextMorph(txt, fontSize, null, true, false, 'left');
			if (this.isEditable) {
				this.contentsMorph.isEditable = true;
				this.contentsMorph.enableSelecting();
			}
			this.contentsMorph.setColor(new Color(255, 255, 255));
		}
		else if (typeof this.contents === 'boolean') {
			img = SpriteMorph.prototype.booleanMorph.call(null, this.contents).fullImage();
			this.contentsMorph = new Morph();
			this.contentsMorph.silentSetWidth(img.width);
			this.contentsMorph.silentSetHeight(img.height);
			this.contentsMorph.image = img;
		}
		else if (this.contents instanceof HTMLCanvasElement) {
			this.contentsMorph = new Morph();
			this.contentsMorph.silentSetWidth(this.contents.width);
			this.contentsMorph.silentSetHeight(this.contents.height);
			this.contentsMorph.image = this.contents;
		}
		else if (this.contents instanceof Context) {
			img = this.contents.image();
			this.contentsMorph = new Morph();
			this.contentsMorph.silentSetWidth(img.width);
			this.contentsMorph.silentSetHeight(img.height);
			this.contentsMorph.image = img;
		}
		else if (this.contents instanceof Costume) {
			img = this.contents.thumbnail(new Point(40, 40));
			this.contentsMorph = new Morph();
			this.contentsMorph.silentSetWidth(img.width);
			this.contentsMorph.silentSetHeight(img.height);
			this.contentsMorph.image = img;
		}
		else if (this.contents instanceof List) {
			if ('table' === type || (!toggle && this.contents.isTable())) {
				this.contentsMorph = new TableFrameMorph(new TableMorph(this.contents, 10));
				this.contentsMorph.expand(new Point(200, 150));
			}
			else {
				if (this.isCircular()) {
					this.contentsMorph = new TextMorph('(...)', fontSize, null, false, true, 'center');
					this.contentsMorph.setColor(new Color(255, 255, 255));
				}
				else {
					this.contentsMorph = new ListWatcherMorph(this.contents, this);
				}
			}
			this.contentsMorph.isDraggable = false;
		}
		else {
			this.contentsMorph = new TextMorph(!isNil(this.contents) ? this.contents.toString() : '', fontSize, null, true, false, 'center');
			if (this.isEditable) {
				this.contentsMorph.isEditable = true;
				this.contentsMorph.enableSelecting();
			}
			this.contentsMorph.setColor(new Color(255, 255, 255));
		}
		this.add(this.contentsMorph);
	}
	this.silentSetHeight(this.contentsMorph.height() + this.edge + this.border * 2);
	this.silentSetWidth(Math.max(this.contentsMorph.width() + this.edge * 2, (this.contents instanceof Context || this.contents instanceof List ? 0 : SyntaxElementMorph.prototype.fontSize * 3.5)));
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	if ((this.edge === 0) && (this.border === 0)) {
		BoxMorph.uber.drawNew.call(this);
		return null;
	}
	context.fillStyle = this.color.toString();
	context.beginPath();
	this.outlinePath(context, Math.max(this.edge - this.border, 0), this.border);
	context.closePath();
	context.fill();
	if (this.border > 0 && !MorphicPreferences.isFlat) {
		context.lineWidth = this.border;
		context.strokeStyle = this.borderColor.toString();
		context.beginPath();
		this.outlinePath(context, this.edge, this.border / 2);
		context.closePath();
		context.stroke();
		context.shadowOffsetX = this.border;
		context.shadowOffsetY = this.border;
		context.shadowBlur = this.border;
		context.shadowColor = this.color.darker(80).toString();
		this.drawShadow(context, this.edge, this.border / 2);
	}
	if (toggle || (!isSameList && !isSameTable)) {
		this.contentsMorph.setCenter(this.center());
	}
};

CellMorph.prototype.drawShadow = function (context, radius, inset) {
	var offset = radius + inset,
		w = this.width(),
		h = this.height();
	context.beginPath();
	context.moveTo(0, h - offset);
	context.lineTo(0, offset);
	context.stroke();
	context.beginPath();
	context.arc(offset, offset, radius, radians(-180), radians(-90), false);
	context.stroke();
	context.beginPath();
	context.moveTo(offset, 0);
	context.lineTo(w - offset, 0);
	context.stroke();
};

CellMorph.prototype.layoutChanged = function () {
	var context,
		fontSize = SyntaxElementMorph.prototype.fontSize,
		listWatcher = this.parentThatIsA(ListWatcherMorph);
	if (this.isBig) {
		fontSize = fontSize * 1.5;
	}
	this.silentSetHeight(this.contentsMorph.height() + this.edge + this.border * 2);
	this.silentSetWidth(Math.max(this.contentsMorph.width() + this.edge * 2, (this.contents instanceof Context || this.contents instanceof List ? 0 : this.height() * 2)));
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	if ((this.edge === 0) && (this.border === 0)) {
		BoxMorph.uber.drawNew.call(this);
		return null;
	}
	context.fillStyle = this.color.toString();
	context.beginPath();
	this.outlinePath(context, Math.max(this.edge - this.border, 0), this.border);
	context.closePath();
	context.fill();
	if (this.border > 0 && !MorphicPreferences.isFlat) {
		context.lineWidth = this.border;
		context.strokeStyle = this.borderColor.toString();
		context.beginPath();
		this.outlinePath(context, this.edge, this.border / 2);
		context.closePath();
		context.stroke();
		context.shadowOffsetX = this.border;
		context.shadowOffsetY = this.border;
		context.shadowBlur = this.border;
		context.shadowColor = this.color.darker(80).toString();
		this.drawShadow(context, this.edge, this.border / 2);
	}
	this.contentsMorph.setCenter(this.center());
	if (listWatcher) {
		listWatcher.fixLayout();
	}
};

CellMorph.prototype.reactToEdit = function (textMorph) {
	var listWatcher;
	if (!isNil(this.idx)) {
		listWatcher = this.parentThatIsA(ListWatcherMorph);
		if (listWatcher) {
			listWatcher.list.put(textMorph.text, this.idx);
		}
	}
};

CellMorph.prototype.mouseClickLeft = function (pos) {
	if (this.isEditable && this.contentsMorph instanceof TextMorph) {
		this.contentsMorph.selectAllAndEdit();
	}
	else {
		this.escalateEvent('mouseClickLeft', pos);
	}
};

WatcherMorph.prototype = new BoxMorph();
WatcherMorph.prototype.constructor = WatcherMorph;
WatcherMorph.uber = BoxMorph.prototype;
function WatcherMorph(label, color, target, getter, isHidden) {
	this.init(label, color, target, getter, isHidden);
}

WatcherMorph.prototype.init = function (label, color, target, getter, isHidden) {
	this.labelText = label || '';
	this.version = null;
	this.objName = '';
	WatcherMorph.uber.init.call(this, SyntaxElementMorph.prototype.rounding, 1.000001, new Color(120, 120, 120));
	this.color = new Color(220, 220, 220);
	this.readoutColor = color;
	this.style = 'normal';
	this.target = target || null;
	this.getter = getter || null;
	this.currentValue = null;
	this.labelMorph = null;
	this.sliderMorph = null;
	this.cellMorph = null;
	this.isDraggable = true;
	this.fixLayout();
	this.update();
	if (isHidden) {
		this.hide();
	}
};

WatcherMorph.prototype.isTemporary = function () {
	var stage = this.parentThatIsA(StageMorph);
	if (this.target instanceof VariableFrame) {
		if (stage) {
			if (this.target === stage.variables.parentFrame) {
				return false;
			}
		}
		return this.target.owner === null;
	}
	return false;
};

WatcherMorph.prototype.object = function () {
	return this.target instanceof VariableFrame ? this.target.owner : this.target;
};

WatcherMorph.prototype.isGlobal = function (selector) {
	return contains(['getLastAnswer', 'getLastMessage', 'getTempo', 'getTimer', 'reportMouseX', 'reportMouseY', 'reportThreadCount'], selector);
};

WatcherMorph.prototype.setSliderMin = function (num, noUpdate) {
	if (this.target instanceof VariableFrame) {
		this.sliderMorph.setSize(1, noUpdate);
		this.sliderMorph.setStart(num, noUpdate);
		this.sliderMorph.setSize(this.sliderMorph.rangeSize() / 5, noUpdate);
	}
};

WatcherMorph.prototype.setSliderMax = function (num, noUpdate) {
	if (this.target instanceof VariableFrame) {
		this.sliderMorph.setSize(1, noUpdate);
		this.sliderMorph.setStop(num, noUpdate);
		this.sliderMorph.setSize(this.sliderMorph.rangeSize() / 5, noUpdate);
	}
};

WatcherMorph.prototype.update = function () {
	var newValue,
		sprite,
		num;
	if (this.target && this.getter) {
		this.updateLabel();
		if (this.target instanceof VariableFrame) {
			newValue = this.target.vars[this.getter] ? this.target.vars[this.getter].value : undefined;
			if (newValue === undefined && this.target.owner) {
				sprite = this.target.owner;
				if (contains(sprite.inheritedVariableNames(), this.getter)) {
					newValue = this.target.getVar(this.getter);
					this.cellMorph.setColor(SpriteMorph.prototype.blockColor.variables.lighter(35));
				}
				else {
					this.destroy();
					return;
				}
			}
			else {
				this.cellMorph.setColor(SpriteMorph.prototype.blockColor.variables);
			}
		}
		else {
			newValue = this.target[this.getter]();
		}
		if (newValue !== '' && !isNil(newValue)) {
			num = +newValue;
			if (typeof newValue !== 'boolean' && !isNaN(num)) {
				newValue = Math.round(newValue * 1000000000) / 1000000000;
			}
		}
		if (newValue !== this.currentValue) {
			this.changed();
			this.cellMorph.contents = newValue;
			this.cellMorph.drawNew();
			if (!isNaN(newValue)) {
				this.sliderMorph.value = newValue;
				this.sliderMorph.drawNew();
			}
			this.fixLayout();
			this.currentValue = newValue;
		}
	}
	if (this.cellMorph.contentsMorph instanceof ListWatcherMorph) {
		this.cellMorph.contentsMorph.update();
	}
};

WatcherMorph.prototype.updateLabel = function () {
	var obj = this.object();
	if (!obj || this.isGlobal(this.getter)) {
		return;
	}
	if (obj.version !== this.version) {
		this.objName = obj.name ? obj.name + ' ' : ' ';
		if (this.labelMorph) {
			this.labelMorph.destroy();
			this.labelMorph = null;
			this.fixLayout();
		}
	}
};

WatcherMorph.prototype.fixLayout = function () {
	var fontSize = SyntaxElementMorph.prototype.fontSize,
		isList,
		myself = this;
	this.changed();
	if (this.labelMorph === null) {
		this.labelMorph = new StringMorph(this.objName + this.labelText, fontSize, null, true, false, false, MorphicPreferences.isFlat ? new Point() : new Point(1, 1), new Color(255, 255, 255));
		this.add(this.labelMorph);
	}
	if (this.cellMorph === null) {
		this.cellMorph = new CellMorph('', this.readoutColor);
		this.add(this.cellMorph);
	}
	if (this.sliderMorph === null) {
		this.sliderMorph = new SliderMorph(0, 100, 0, 20, 'horizontal');
		this.sliderMorph.alpha = 1;
		this.sliderMorph.button.color = this.color.darker();
		this.sliderMorph.color = this.color.lighter(60);
		this.sliderMorph.button.highlightColor = this.color.darker();
		this.sliderMorph.button.highlightColor.b += 50;
		this.sliderMorph.button.pressColor = this.color.darker();
		this.sliderMorph.button.pressColor.b += 100;
		this.sliderMorph.setHeight(fontSize);
		this.sliderMorph.action = function (num) {
			myself.target.setVar(myself.getter, Math.round(num), myself.target.owner);
		};
		this.add(this.sliderMorph);
	}
	isList = this.cellMorph.contents instanceof List;
	if (isList) {
		this.style = 'normal';
	}
	if (this.style === 'large') {
		this.labelMorph.hide();
		this.sliderMorph.hide();
		this.cellMorph.big();
		this.cellMorph.setPosition(this.position());
		this.setExtent(this.cellMorph.extent().subtract(1));
		return;
	}
	this.labelMorph.show();
	this.sliderMorph.show();
	this.cellMorph.normal();
	this.labelMorph.setPosition(this.position().add(new Point(this.edge, this.border + SyntaxElementMorph.prototype.typeInPadding)));
	if (isList) {
		this.cellMorph.setPosition(this.labelMorph.bottomLeft().add(new Point(0, SyntaxElementMorph.prototype.typeInPadding)));
	}
	else {
		this.cellMorph.setPosition(this.labelMorph.topRight().add(new Point(fontSize / 3, 0)));
		this.labelMorph.setTop(this.cellMorph.top() + (this.cellMorph.height() - this.labelMorph.height()) / 2);
	}
	if (this.style === 'slider') {
		this.sliderMorph.silentSetPosition(new Point(this.labelMorph.left(), this.cellMorph.bottom() + SyntaxElementMorph.prototype.typeInPadding));
		this.sliderMorph.setWidth(this.cellMorph.right() - this.labelMorph.left());
		this.silentSetHeight(this.cellMorph.height() + this.sliderMorph.height() + this.border * 2 + SyntaxElementMorph.prototype.typeInPadding * 3);
	}
	else {
		this.sliderMorph.hide();
		this.bounds.corner.y = this.cellMorph.bottom() + this.border + SyntaxElementMorph.prototype.typeInPadding;
	}
	this.bounds.corner.x = Math.max(this.cellMorph.right(), this.labelMorph.right()) + this.edge + SyntaxElementMorph.prototype.typeInPadding;
	this.drawNew();
	this.changed();
};

WatcherMorph.prototype.userMenu = function () {
	var myself = this,
		menu = new MenuMorph(this),
		on = '\u25CF',
		off = '\u25CB',
		vNames;
	function monitor(vName) {
		var stage = myself.parentThatIsA(StageMorph),
			varFrame = myself.currentValue.outerContext.variables;
		menu.addItem(vName + '...', function () {
			var watcher = detect(stage.children, function (morph) {
				return morph instanceof WatcherMorph && morph.target === varFrame && morph.getter === vName;
			}),
				others;
			if (watcher !== null) {
				watcher.show();
				watcher.fixLayout();
				return;
			}
			watcher = new WatcherMorph(vName + ' ' + localize('(temporary)'), SpriteMorph.prototype.blockColor.variables, varFrame, vName);
			watcher.setPosition(stage.position().add(10));
			others = stage.watchers(watcher.left());
			if (others.length > 0) {
				watcher.setTop(others[others.length - 1].bottom());
			}
			stage.add(watcher);
			watcher.fixLayout();
		});
	}
	menu.addItem((this.style === 'normal' ? on : off) + ' ' + localize('normal'), 'styleNormal');
	menu.addItem((this.style === 'large' ? on : off) + ' ' + localize('large'), 'styleLarge');
	if (this.target instanceof VariableFrame) {
		menu.addItem((this.style === 'slider' ? on : off) + ' ' + localize('slider'), 'styleSlider');
		menu.addLine();
		menu.addItem('slider min...', 'userSetSliderMin');
		menu.addItem('slider max...', 'userSetSliderMax');
		menu.addLine();
		menu.addItem('import...', function () {
			var inp = document.createElement('input'),
				ide = myself.parentThatIsA(IDE_Morph);
			inp.type = 'file';
			inp.style.color = "transparent";
			inp.style.backgroundColor = "transparent";
			inp.style.border = "none";
			inp.style.outline = "none";
			inp.style.position = "absolute";
			inp.style.top = "0px";
			inp.style.left = "0px";
			inp.style.width = "0px";
			inp.style.height = "0px";
			inp.addEventListener("change", function () {
				var file;
				function txtOnlyMsg(ftype) {
					ide.inform('Unable to import', 'Snap! can only import "text" files.\n' + 'You selected a file of type "' + ftype + '".');
				}
				function readText(aFile) {
					var frd = new FileReader();
					frd.onloadend = function (e) {
						myself.target.setVar(myself.getter, e.target.result);
					};
					if (aFile.type.indexOf("text") === 0) {
						frd.readAsText(aFile);
					}
					else {
						txtOnlyMsg(aFile.type);
					}
				}
				if (inp.files.length > 0) {
					file = inp.files[inp.files.length - 1];
					readText(file);
				}
			}, false);
			inp.click();
		});
		if (this.currentValue && (isString(this.currentValue) || !isNaN(+this.currentValue))) {
			menu.addItem('export...', function () {
				var ide = myself.parentThatIsA(IDE_Morph);
			});
		}
		else if (this.currentValue instanceof Context) {
			vNames = this.currentValue.outerContext.variables.names();
			if (vNames.length) {
				menu.addLine();
				vNames.forEach(function (vName) {
					monitor(vName);
				});
			}
		}
	}
	return menu;
};

WatcherMorph.prototype.setStyle = function (style) {
	this.style = style;
	this.fixLayout();
};

WatcherMorph.prototype.styleNormal = function () {
	this.setStyle('normal');
};

WatcherMorph.prototype.styleLarge = function () {
	this.setStyle('large');
};

WatcherMorph.prototype.styleSlider = function () {
	this.setStyle('slider');
};

WatcherMorph.prototype.userSetSliderMin = function () {
	new DialogBoxMorph(this, this.setSliderMin, this).prompt("Slider minimum value", this.sliderMorph.start.toString(), this.world(), null, null, null, true);
};

WatcherMorph.prototype.userSetSliderMax = function () {
	new DialogBoxMorph(this, this.setSliderMax, this).prompt("Slider maximum value", this.sliderMorph.stop.toString(), this.world(), null, null, null, true);
};

WatcherMorph.prototype.drawNew = function () {
	var context,
		gradient;
	this.image = newCanvas(this.extent());
	context = this.image.getContext('2d');
	if (MorphicPreferences.isFlat || (this.edge === 0 && this.border === 0)) {
		BoxMorph.uber.drawNew.call(this);
		return;
	}
	gradient = context.createLinearGradient(0, 0, 0, this.height());
	gradient.addColorStop(0, this.color.lighter().toString());
	gradient.addColorStop(1, this.color.darker().toString());
	context.fillStyle = gradient;
	context.beginPath();
	this.outlinePath(context, Math.max(this.edge - this.border, 0), this.border);
	context.closePath();
	context.fill();
	if (this.border > 0) {
		gradient = context.createLinearGradient(0, 0, 0, this.height());
		gradient.addColorStop(0, this.borderColor.lighter().toString());
		gradient.addColorStop(1, this.borderColor.darker().toString());
		context.lineWidth = this.border;
		context.strokeStyle = gradient;
		context.beginPath();
		this.outlinePath(context, this.edge, this.border / 2);
		context.closePath();
		context.stroke();
	}
};

StagePrompterMorph.prototype = new BoxMorph();
StagePrompterMorph.prototype.constructor = StagePrompterMorph;
StagePrompterMorph.uber = BoxMorph.prototype;
function StagePrompterMorph(question) {
	this.init(question);
}

StagePrompterMorph.prototype.init = function (question) {
	var myself = this;
	this.isDone = false;
	if (question) {
		this.label = new StringMorph(question, SpriteMorph.prototype.bubbleFontSize, null, SpriteMorph.prototype.bubbleFontIsBold, false, 'left');
	}
	else {
		this.label = null;
	}
	this.inputField = new InputFieldMorph();
	this.button = new PushButtonMorph(null, function () {
		myself.accept();
	}, '\u2713');
	StagePrompterMorph.uber.init.call(this, SyntaxElementMorph.prototype.rounding, SpriteMorph.prototype.bubbleBorder, SpriteMorph.prototype.blockColor.sensing);
	this.color = new Color(255, 255, 255);
	if (this.label) {
		this.add(this.label);
	}
	this.add(this.inputField);
	this.add(this.button);
	this.setWidth(StageMorph.prototype.dimensions.x - 20);
	this.fixLayout();
};

StagePrompterMorph.prototype.fixLayout = function () {
	var y = 0;
	if (this.label) {
		this.label.setPosition(new Point(this.left() + this.edge, this.top() + this.edge));
		y = this.label.bottom() - this.top();
	}
	this.inputField.setPosition(new Point(this.left() + this.edge, this.top() + y + this.edge));
	this.inputField.setWidth(this.width() - this.edge * 2 - this.button.width() - this.border);
	this.button.setCenter(this.inputField.center());
	this.button.setLeft(this.inputField.right() + this.border);
	this.setHeight(this.inputField.bottom() - this.top() + this.edge);
};

StagePrompterMorph.prototype.mouseClickLeft = function () {
	this.inputField.edit();
};

StagePrompterMorph.prototype.accept = function () {
	this.isDone = true;
};


