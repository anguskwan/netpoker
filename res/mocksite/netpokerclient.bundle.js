(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var PixiTextInput = require("./src/PixiTextInput");

module.exports = PixiTextInput
},{"./src/PixiTextInput":2}],2:[function(require,module,exports){
if (typeof module !== 'undefined') {
	PIXI = require("pixi.js");
}

/**
 * Text input field for pixi.js.
 * @class PixiTextInput
 */
function PixiTextInput(text, style) {
	PIXI.DisplayObjectContainer.call(this);

	if (!text)
		text = "";

	text = text.toString();

	if (style && style.wordWrap)
		throw "wordWrap is not supported for input fields";

	this._text = text;

	this.localWidth = 100;
	this._backgroundColor = 0xffffff;
	this._caretColor = 0x000000;
	this._background = true;

	this.style = style;
	this.textField = new PIXI.Text(this._text, style);

	this.localHeight =
		this.textField.determineFontHeight('font: ' + this.textField.style.font + ';') +
		this.textField.style.strokeThickness;
	this.backgroundGraphics = new PIXI.Graphics();
	this.textFieldMask = new PIXI.Graphics();
	this.caret = new PIXI.Graphics();
	this.drawElements();

	this.addChild(this.backgroundGraphics);
	this.addChild(this.textField);
	this.addChild(this.caret);
	this.addChild(this.textFieldMask);

	this.scrollIndex = 0;
	this._caretIndex = 0;
	this.caretFlashInterval = null;
	this.blur();
	this.updateCaretPosition();

	this.backgroundGraphics.interactive = true;
	this.backgroundGraphics.buttonMode = true;
	this.backgroundGraphics.defaultCursor = "text";

	this.backgroundGraphics.mousedown = this.onBackgroundMouseDown.bind(this);
	this.keyEventClosure = this.onKeyEvent.bind(this);
	this.windowBlurClosure = this.onWindowBlur.bind(this);
	this.documentMouseDownClosure = this.onDocumentMouseDown.bind(this);
	this.isFocusClick = false;

	this.updateText();

	this.textField.mask = this.textFieldMask;

	this.keypress = null;
	this.keydown = null;
	this.change = null;
}

PixiTextInput.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PixiTextInput.prototype.constructor = PixiTextInput;

/**
 * Someone clicked.
 * @method onBackgroundMouseDown
 * @private
 */
PixiTextInput.prototype.onBackgroundMouseDown = function(e) {
	var x = e.getLocalPosition(this).x;
	this._caretIndex = this.getCaretIndexByCoord(x);
	this.updateCaretPosition();

	this.focus();

	this.isFocusClick = true;
	var scope = this;
	setTimeout(function() {
		scope.isFocusClick = false;
	}, 0);
}

/**
 * Focus this input field.
 * @method focus
 */
PixiTextInput.prototype.focus = function() {
	this.blur();

	document.addEventListener("keydown", this.keyEventClosure);
	document.addEventListener("keypress", this.keyEventClosure);
	document.addEventListener("mousedown", this.documentMouseDownClosure);
	window.addEventListener("blur", this.windowBlurClosure);

	this.showCaret();
}

/**
 * Handle key event.
 * @method onKeyEvent
 * @private
 */
PixiTextInput.prototype.onKeyEvent = function(e) {
	/*console.log("key event");
	console.log(e);*/

	if (e.type == "keypress") {
		if (e.charCode < 32)
			return;

		this._text =
			this._text.substring(0, this._caretIndex) +
			String.fromCharCode(e.charCode) +
			this._text.substring(this._caretIndex);

		this._caretIndex++;
		this.ensureCaretInView();
		this.showCaret();
		this.updateText();
		this.trigger(this.keypress, e);
		this.trigger(this.change);
	}

	if (e.type == "keydown") {
		switch (e.keyCode) {
			case 8:
				if (this._caretIndex > 0) {
					this._text =
						this._text.substring(0, this._caretIndex - 1) +
						this._text.substring(this._caretIndex);

					this._caretIndex--;
					this.ensureCaretInView();
					this.showCaret();
					this.updateText();
				}
				e.preventDefault();
				this.trigger(this.change);
				break;

			case 46:
				this._text =
					this._text.substring(0, this._caretIndex) +
					this._text.substring(this._caretIndex + 1);

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
				e.preventDefault();
				this.trigger(this.change);
				break;

			case 39:
				this._caretIndex++;
				if (this._caretIndex > this._text.length)
					this._caretIndex = this._text.length;

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
				break;

			case 37:
				this._caretIndex--;
				if (this._caretIndex < 0)
					this._caretIndex = 0;

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
				break;
		}

		this.trigger(this.keydown, e);
	}
}

/**
 * Ensure the caret is not outside the bounds.
 * @method ensureCaretInView
 * @private
 */
PixiTextInput.prototype.ensureCaretInView = function() {
	this.updateCaretPosition();

	while (this.caret.position.x >= this.localWidth - 1) {
		this.scrollIndex++;
		this.updateCaretPosition();
	}

	while (this.caret.position.x < 0) {
		this.scrollIndex -= 2;
		if (this.scrollIndex < 0)
			this.scrollIndex = 0;
		this.updateCaretPosition();
	}
}

/**
 * Blur ourself.
 * @method blur
 */
PixiTextInput.prototype.blur = function() {
	document.removeEventListener("keydown", this.keyEventClosure);
	document.removeEventListener("keypress", this.keyEventClosure);
	document.removeEventListener("mousedown", this.documentMouseDownClosure);
	window.removeEventListener("blur", this.windowBlurClosure);

	this.hideCaret();
}

/**
 * Window blur.
 * @method onDocumentMouseDown
 * @private
 */
PixiTextInput.prototype.onDocumentMouseDown = function() {
	if (!this.isFocusClick)
		this.blur();
}

/**
 * Window blur.
 * @method onWindowBlur
 * @private
 */
PixiTextInput.prototype.onWindowBlur = function() {
	this.blur();
}

/**
 * Update caret Position.
 * @method updateCaretPosition
 * @private
 */
PixiTextInput.prototype.updateCaretPosition = function() {
	if (this._caretIndex < this.scrollIndex) {
		this.caret.position.x = -1;
		return;
	}

	var sub = this._text.substring(0, this._caretIndex).substring(this.scrollIndex);
	this.caret.position.x = this.textField.context.measureText(sub).width;
}

/**
 * Update text.
 * @method updateText
 * @private
 */
PixiTextInput.prototype.updateText = function() {
	this.textField.setText(this._text.substring(this.scrollIndex));
}

/**
 * Draw the background and caret.
 * @method drawElements
 * @private
 */
PixiTextInput.prototype.drawElements = function() {
	this.backgroundGraphics.clear();
	this.backgroundGraphics.beginFill(this._backgroundColor);

	if (this._background)
		this.backgroundGraphics.drawRect(0, 0, this.localWidth, this.localHeight);

	this.backgroundGraphics.endFill();
	this.backgroundGraphics.hitArea = new PIXI.Rectangle(0, 0, this.localWidth, this.localHeight);

	this.textFieldMask.clear();
	this.textFieldMask.beginFill(this._backgroundColor);
	this.textFieldMask.drawRect(0, 0, this.localWidth, this.localHeight);
	this.textFieldMask.endFill();

	this.caret.clear();
	this.caret.beginFill(this._caretColor);
	this.caret.drawRect(1, 1, 1, this.localHeight - 2);
	this.caret.endFill();
}

/**
 * Show caret.
 * @method showCaret
 * @private
 */
PixiTextInput.prototype.showCaret = function() {
	if (this.caretFlashInterval) {
		clearInterval(this.caretFlashInterval);
		this.caretFlashInterval = null;
	}

	this.caret.visible = true;
	this.caretFlashInterval = setInterval(this.onCaretFlashInterval.bind(this), 500);
}

/**
 * Hide caret.
 * @method hideCaret
 * @private
 */
PixiTextInput.prototype.hideCaret = function() {
	if (this.caretFlashInterval) {
		clearInterval(this.caretFlashInterval);
		this.caretFlashInterval = null;
	}

	this.caret.visible = false;
}

/**
 * Caret flash interval.
 * @method onCaretFlashInterval
 * @private
 */
PixiTextInput.prototype.onCaretFlashInterval = function() {
	this.caret.visible = !this.caret.visible;
}

/**
 * Map position to caret index.
 * @method getCaretIndexByCoord
 * @private
 */
PixiTextInput.prototype.getCaretIndexByCoord = function(x) {
	var smallest = 10000;
	var cand = 0;
	var visible = this._text.substring(this.scrollIndex);

	for (i = 0; i < visible.length + 1; i++) {
		var sub = visible.substring(0, i);
		var w = this.textField.context.measureText(sub).width;

		if (Math.abs(w - x) < smallest) {
			smallest = Math.abs(w - x);
			cand = i;
		}
	}

	return this.scrollIndex + cand;
}

/**
 * The width of the PixiTextInput. This is overridden to have a slightly
 * different behaivour than the other DisplayObjects. Setting the
 * width of the PixiTextInput does not change the scale, but it rather
 * makes the field larger. If you actually want to scale it,
 * use the scale property.
 * @property width
 */
Object.defineProperty(PixiTextInput.prototype, "width", {
	get: function() {
		return this.scale.x * this.getLocalBounds().width;
	},

	set: function(v) {
		this.localWidth = v;
		this.drawElements();
		this.ensureCaretInView();
		this.updateText();
	}
});

/**
 * The text in the input field. Setting will have the implicit function of resetting the scroll
 * of the input field and removing focus.
 * @property text
 */
Object.defineProperty(PixiTextInput.prototype, "text", {
	get: function() {
		return this._text;
	},

	set: function(v) {
		this._text = v.toString();
		this.scrollIndex = 0;
		this.caretIndex = 0;
		this.blur();
		this.updateText();
	}
});

/**
 * The color of the background for the input field.
 * @property backgroundColor
 */
Object.defineProperty(PixiTextInput.prototype, "backgroundColor", {
	get: function() {
		return this._backgroundColor;
	},

	set: function(v) {
		this._backgroundColor = v;
		this.drawElements();
	}
});

/**
 * The color of the caret.
 * @property caretColor
 */
Object.defineProperty(PixiTextInput.prototype, "caretColor", {
	get: function() {
		return this._caretColor;
	},

	set: function(v) {
		this._caretColor = v;
		this.drawElements();
	}
});

/**
 * Should a background be shown?
 * @property background
 */
Object.defineProperty(PixiTextInput.prototype, "background", {
	get: function() {
		return this._background;
	},

	set: function(v) {
		this._background = v;
		this.drawElements();
	}
});

/**
 * Set text.
 * @method setText
 */
PixiTextInput.prototype.setText = function(v) {
	this.text = v;
}

/**
 * Trigger an event function if it exists.
 * @method trigger
 * @private
 */
PixiTextInput.prototype.trigger = function(fn, e) {
	if (fn)
		fn(e);
}

if (typeof module !== 'undefined') {
	module.exports = PixiTextInput;
}
},{"pixi.js":3}],3:[function(require,module,exports){
/**
 * @license
 * pixi.js - v1.6.0
 * Copyright (c) 2012-2014, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2014-07-18
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(){var a=this,b=b||{};b.WEBGL_RENDERER=0,b.CANVAS_RENDERER=1,b.VERSION="v1.6.1",b.blendModes={NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},b.scaleModes={DEFAULT:0,LINEAR:0,NEAREST:1},b._UID=0,"undefined"!=typeof Float32Array?(b.Float32Array=Float32Array,b.Uint16Array=Uint16Array):(b.Float32Array=Array,b.Uint16Array=Array),b.INTERACTION_FREQUENCY=30,b.AUTO_PREVENT_DEFAULT=!0,b.RAD_TO_DEG=180/Math.PI,b.DEG_TO_RAD=Math.PI/180,b.dontSayHello=!1,b.sayHello=function(a){if(!b.dontSayHello){if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){var c=["%c %c %c Pixi.js "+b.VERSION+" - "+a+"  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ ","background: #ff66a5","background: #ff66a5","color: #ff66a5; background: #030307;","background: #ff66a5","background: #ffc3dc","background: #ff66a5","color: #ff2424; background: #fff","color: #ff2424; background: #fff","color: #ff2424; background: #fff"];console.log.apply(console,c)}else window.console&&console.log("Pixi.js "+b.VERSION+" - http://www.pixijs.com/");b.dontSayHello=!0}},b.Point=function(a,b){this.x=a||0,this.y=b||0},b.Point.prototype.clone=function(){return new b.Point(this.x,this.y)},b.Point.prototype.set=function(a,b){this.x=a||0,this.y=b||(0!==b?this.x:0)},b.Point.prototype.constructor=b.Point,b.Rectangle=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Rectangle.prototype.clone=function(){return new b.Rectangle(this.x,this.y,this.width,this.height)},b.Rectangle.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=this.x;if(a>=c&&a<=c+this.width){var d=this.y;if(b>=d&&b<=d+this.height)return!0}return!1},b.Rectangle.prototype.constructor=b.Rectangle,b.EmptyRectangle=new b.Rectangle(0,0,0,0),b.Polygon=function(a){if(a instanceof Array||(a=Array.prototype.slice.call(arguments)),"number"==typeof a[0]){for(var c=[],d=0,e=a.length;e>d;d+=2)c.push(new b.Point(a[d],a[d+1]));a=c}this.points=a},b.Polygon.prototype.clone=function(){for(var a=[],c=0;c<this.points.length;c++)a.push(this.points[c].clone());return new b.Polygon(a)},b.Polygon.prototype.contains=function(a,b){for(var c=!1,d=0,e=this.points.length-1;d<this.points.length;e=d++){var f=this.points[d].x,g=this.points[d].y,h=this.points[e].x,i=this.points[e].y,j=g>b!=i>b&&(h-f)*(b-g)/(i-g)+f>a;j&&(c=!c)}return c},b.Polygon.prototype.constructor=b.Polygon,b.Circle=function(a,b,c){this.x=a||0,this.y=b||0,this.radius=c||0},b.Circle.prototype.clone=function(){return new b.Circle(this.x,this.y,this.radius)},b.Circle.prototype.contains=function(a,b){if(this.radius<=0)return!1;var c=this.x-a,d=this.y-b,e=this.radius*this.radius;return c*=c,d*=d,e>=c+d},b.Circle.prototype.getBounds=function(){return new b.Rectangle(this.x-this.radius,this.y-this.radius,this.width,this.height)},b.Circle.prototype.constructor=b.Circle,b.Ellipse=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Ellipse.prototype.clone=function(){return new b.Ellipse(this.x,this.y,this.width,this.height)},b.Ellipse.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=(a-this.x)/this.width,d=(b-this.y)/this.height;return c*=c,d*=d,1>=c+d},b.Ellipse.prototype.getBounds=function(){return new b.Rectangle(this.x-this.width,this.y-this.height,this.width,this.height)},b.Ellipse.prototype.constructor=b.Ellipse,b.Matrix=function(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0},b.Matrix.prototype.fromArray=function(a){this.a=a[0],this.b=a[1],this.c=a[3],this.d=a[4],this.tx=a[2],this.ty=a[5]},b.Matrix.prototype.toArray=function(a){this.array||(this.array=new Float32Array(9));var b=this.array;return a?(b[0]=this.a,b[1]=this.c,b[2]=0,b[3]=this.b,b[4]=this.d,b[5]=0,b[6]=this.tx,b[7]=this.ty,b[8]=1):(b[0]=this.a,b[1]=this.b,b[2]=this.tx,b[3]=this.c,b[4]=this.d,b[5]=this.ty,b[6]=0,b[7]=0,b[8]=1),b},b.identityMatrix=new b.Matrix,b.determineMatrixArrayType=function(){return"undefined"!=typeof Float32Array?Float32Array:Array},b.Matrix2=b.determineMatrixArrayType(),b.DisplayObject=function(){this.position=new b.Point,this.scale=new b.Point(1,1),this.pivot=new b.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.hitArea=null,this.buttonMode=!1,this.renderable=!1,this.parent=null,this.stage=null,this.worldAlpha=1,this._interactive=!1,this.defaultCursor="pointer",this.worldTransform=new b.Matrix,this.color=[],this.dynamic=!0,this._sr=0,this._cr=1,this.filterArea=null,this._bounds=new b.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null,this._cacheAsBitmap=!1,this._cacheIsDirty=!1},b.DisplayObject.prototype.constructor=b.DisplayObject,b.DisplayObject.prototype.setInteractive=function(a){this.interactive=a},Object.defineProperty(b.DisplayObject.prototype,"interactive",{get:function(){return this._interactive},set:function(a){this._interactive=a,this.stage&&(this.stage.dirty=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"worldVisible",{get:function(){var a=this;do{if(!a.visible)return!1;a=a.parent}while(a);return!0}}),Object.defineProperty(b.DisplayObject.prototype,"mask",{get:function(){return this._mask},set:function(a){this._mask&&(this._mask.isMask=!1),this._mask=a,this._mask&&(this._mask.isMask=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"filters",{get:function(){return this._filters},set:function(a){if(a){for(var b=[],c=0;c<a.length;c++)for(var d=a[c].passes,e=0;e<d.length;e++)b.push(d[e]);this._filterBlock={target:this,filterPasses:b}}this._filters=a}}),Object.defineProperty(b.DisplayObject.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap!==a&&(a?this._generateCachedSprite():this._destroyCachedSprite(),this._cacheAsBitmap=a)}}),b.DisplayObject.prototype.updateTransform=function(){this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation));var a=this.parent.worldTransform,b=this.worldTransform,c=this.pivot.x,d=this.pivot.y,e=this._cr*this.scale.x,f=-this._sr*this.scale.y,g=this._sr*this.scale.x,h=this._cr*this.scale.y,i=this.position.x-e*c-d*f,j=this.position.y-h*d-c*g,k=a.a,l=a.b,m=a.c,n=a.d;b.a=k*e+l*g,b.b=k*f+l*h,b.tx=k*i+l*j+a.tx,b.c=m*e+n*g,b.d=m*f+n*h,b.ty=m*i+n*j+a.ty,this.worldAlpha=this.alpha*this.parent.worldAlpha},b.DisplayObject.prototype.getBounds=function(a){return a=a,b.EmptyRectangle},b.DisplayObject.prototype.getLocalBounds=function(){return this.getBounds(b.identityMatrix)},b.DisplayObject.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0)},b.DisplayObject.prototype.generateTexture=function(a){var c=this.getLocalBounds(),d=new b.RenderTexture(0|c.width,0|c.height,a);return d.render(this,new b.Point(-c.x,-c.y)),d},b.DisplayObject.prototype.updateCache=function(){this._generateCachedSprite()},b.DisplayObject.prototype._renderCachedSprite=function(a){this._cachedSprite.worldAlpha=this.worldAlpha,a.gl?b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a):b.Sprite.prototype._renderCanvas.call(this._cachedSprite,a)},b.DisplayObject.prototype._generateCachedSprite=function(){this._cacheAsBitmap=!1;var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.texture.resize(0|a.width,0|a.height);else{var c=new b.RenderTexture(0|a.width,0|a.height);this._cachedSprite=new b.Sprite(c),this._cachedSprite.worldTransform=this.worldTransform}var d=this._filters;this._filters=null,this._cachedSprite.filters=d,this._cachedSprite.texture.render(this,new b.Point(-a.x,-a.y)),this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._filters=d,this._cacheAsBitmap=!0},b.DisplayObject.prototype._destroyCachedSprite=function(){this._cachedSprite&&(this._cachedSprite.texture.destroy(!0),this._cachedSprite=null)},b.DisplayObject.prototype._renderWebGL=function(a){a=a},b.DisplayObject.prototype._renderCanvas=function(a){a=a},Object.defineProperty(b.DisplayObject.prototype,"x",{get:function(){return this.position.x},set:function(a){this.position.x=a}}),Object.defineProperty(b.DisplayObject.prototype,"y",{get:function(){return this.position.y},set:function(a){this.position.y=a}}),b.DisplayObjectContainer=function(){b.DisplayObject.call(this),this.children=[]},b.DisplayObjectContainer.prototype=Object.create(b.DisplayObject.prototype),b.DisplayObjectContainer.prototype.constructor=b.DisplayObjectContainer,Object.defineProperty(b.DisplayObjectContainer.prototype,"width",{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(a){var b=this.getLocalBounds().width;this.scale.x=0!==b?a/(b/this.scale.x):1,this._width=a}}),Object.defineProperty(b.DisplayObjectContainer.prototype,"height",{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(a){var b=this.getLocalBounds().height;this.scale.y=0!==b?a/(b/this.scale.y):1,this._height=a}}),b.DisplayObjectContainer.prototype.addChild=function(a){return this.addChildAt(a,this.children.length)},b.DisplayObjectContainer.prototype.addChildAt=function(a,b){if(b>=0&&b<=this.children.length)return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.splice(b,0,a),this.stage&&a.setStageReference(this.stage),a;throw new Error(a+" The index "+b+" supplied is out of bounds "+this.children.length)},b.DisplayObjectContainer.prototype.swapChildren=function(a,b){if(a!==b){var c=this.children.indexOf(a),d=this.children.indexOf(b);if(0>c||0>d)throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");this.children[c]=b,this.children[d]=a}},b.DisplayObjectContainer.prototype.getChildAt=function(a){if(a>=0&&a<this.children.length)return this.children[a];throw new Error("Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller")},b.DisplayObjectContainer.prototype.removeChild=function(a){return this.removeChildAt(this.children.indexOf(a))},b.DisplayObjectContainer.prototype.removeChildAt=function(a){var b=this.getChildAt(a);return this.stage&&b.removeStageReference(),b.parent=void 0,this.children.splice(a,1),b},b.DisplayObjectContainer.prototype.removeChildren=function(a,b){var c=a||0,d="number"==typeof b?b:this.children.length,e=d-c;if(e>0&&d>=e){for(var f=this.children.splice(c,e),g=0;g<f.length;g++){var h=f[g];this.stage&&h.removeStageReference(),h.parent=void 0}return f}throw new Error("Range Error, numeric values are outside the acceptable range")},b.DisplayObjectContainer.prototype.updateTransform=function(){if(this.visible&&(b.DisplayObject.prototype.updateTransform.call(this),!this._cacheAsBitmap))for(var a=0,c=this.children.length;c>a;a++)this.children[a].updateTransform()},b.DisplayObjectContainer.prototype.getBounds=function(a){if(0===this.children.length)return b.EmptyRectangle;if(a){var c=this.worldTransform;this.worldTransform=a,this.updateTransform(),this.worldTransform=c}for(var d,e,f,g=1/0,h=1/0,i=-1/0,j=-1/0,k=!1,l=0,m=this.children.length;m>l;l++){var n=this.children[l];n.visible&&(k=!0,d=this.children[l].getBounds(a),g=g<d.x?g:d.x,h=h<d.y?h:d.y,e=d.width+d.x,f=d.height+d.y,i=i>e?i:e,j=j>f?j:f)}if(!k)return b.EmptyRectangle;var o=this._bounds;return o.x=g,o.y=h,o.width=i-g,o.height=j-h,o},b.DisplayObjectContainer.prototype.getLocalBounds=function(){var a=this.worldTransform;this.worldTransform=b.identityMatrix;for(var c=0,d=this.children.length;d>c;c++)this.children[c].updateTransform();var e=this.getBounds();return this.worldTransform=a,e},b.DisplayObjectContainer.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d.setStageReference(a)}},b.DisplayObjectContainer.prototype.removeStageReference=function(){for(var a=0,b=this.children.length;b>a;a++){var c=this.children[a];c.removeStageReference()}this._interactive&&(this.stage.dirty=!0),this.stage=null},b.DisplayObjectContainer.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;var b,c;if(this._mask||this._filters){for(this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);a.spriteBatch.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),a.spriteBatch.start()}else for(b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.DisplayObjectContainer.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;this._mask&&a.maskManager.pushMask(this._mask,a.context);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d._renderCanvas(a)}this._mask&&a.maskManager.popMask(a.context)}},b.Sprite=function(a){b.DisplayObjectContainer.call(this),this.anchor=new b.Point,this.texture=a,this._width=0,this._height=0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL,a.baseTexture.hasLoaded?this.onTextureUpdate():(this.onTextureUpdateBind=this.onTextureUpdate.bind(this),this.texture.addEventListener("update",this.onTextureUpdateBind)),this.renderable=!0},b.Sprite.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Sprite.prototype.constructor=b.Sprite,Object.defineProperty(b.Sprite.prototype,"width",{get:function(){return this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Sprite.prototype,"height",{get:function(){return this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Sprite.prototype.setTexture=function(a){this.texture=a,this.cachedTint=16777215},b.Sprite.prototype.onTextureUpdate=function(){this._width&&(this.scale.x=this._width/this.texture.frame.width),this._height&&(this.scale.y=this._height/this.texture.frame.height)},b.Sprite.prototype.getBounds=function(a){var b=this.texture.frame.width,c=this.texture.frame.height,d=b*(1-this.anchor.x),e=b*-this.anchor.x,f=c*(1-this.anchor.y),g=c*-this.anchor.y,h=a||this.worldTransform,i=h.a,j=h.c,k=h.b,l=h.d,m=h.tx,n=h.ty,o=i*e+k*g+m,p=l*g+j*e+n,q=i*d+k*g+m,r=l*g+j*d+n,s=i*d+k*f+m,t=l*f+j*d+n,u=i*e+k*f+m,v=l*f+j*e+n,w=-1/0,x=-1/0,y=1/0,z=1/0;y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,z=z>p?p:z,z=z>r?r:z,z=z>t?t:z,z=z>v?v:z,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w,x=p>x?p:x,x=r>x?r:x,x=t>x?t:x,x=v>x?v:x;var A=this._bounds;return A.x=y,A.width=w-y,A.y=z,A.height=x-z,this._currentBounds=A,A},b.Sprite.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){var b,c;if(this._mask||this._filters){var d=a.spriteBatch;for(this._filters&&(d.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(d.stop(),a.maskManager.pushMask(this.mask,a),d.start()),d.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);d.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),d.start()}else for(a.spriteBatch.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.Sprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,a.context.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),this.texture.valid){a.context.globalAlpha=this.worldAlpha,a.roundPixels?a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,0|this.worldTransform.tx,0|this.worldTransform.ty):a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,this.worldTransform.tx,this.worldTransform.ty),a.smoothProperty&&a.scaleMode!==this.texture.baseTexture.scaleMode&&(a.scaleMode=this.texture.baseTexture.scaleMode,a.context[a.smoothProperty]=a.scaleMode===b.scaleModes.LINEAR);var c=this.texture.trim?this.texture.trim.x-this.anchor.x*this.texture.trim.width:this.anchor.x*-this.texture.frame.width,d=this.texture.trim?this.texture.trim.y-this.anchor.y*this.texture.trim.height:this.anchor.y*-this.texture.frame.height;16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=b.CanvasTinter.getTintedTexture(this,this.tint)),a.context.drawImage(this.tintedTexture,0,0,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)):a.context.drawImage(this.texture.baseTexture.source,this.texture.crop.x,this.texture.crop.y,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)}for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Sprite.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache'+this);return new b.Sprite(c)},b.Sprite.fromImage=function(a,c,d){var e=b.Texture.fromImage(a,c,d);return new b.Sprite(e)},b.SpriteBatch=function(a){b.DisplayObjectContainer.call(this),this.textureThing=a,this.ready=!1},b.SpriteBatch.prototype=Object.create(b.DisplayObjectContainer.prototype),b.SpriteBatch.constructor=b.SpriteBatch,b.SpriteBatch.prototype.initWebGL=function(a){this.fastSpriteBatch=new b.WebGLFastSpriteBatch(a),this.ready=!0},b.SpriteBatch.prototype.updateTransform=function(){b.DisplayObject.prototype.updateTransform.call(this)},b.SpriteBatch.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||!this.children.length||(this.ready||this.initWebGL(a.gl),a.spriteBatch.stop(),a.shaderManager.setShader(a.shaderManager.fastShader),this.fastSpriteBatch.begin(this,a),this.fastSpriteBatch.render(this),a.spriteBatch.start())},b.SpriteBatch.prototype._renderCanvas=function(a){var c=a.context;c.globalAlpha=this.worldAlpha,b.DisplayObject.prototype.updateTransform.call(this);for(var d=this.worldTransform,e=!0,f=0;f<this.children.length;f++){var g=this.children[f];if(g.visible){var h=g.texture,i=h.frame;if(c.globalAlpha=this.worldAlpha*g.alpha,g.rotation%(2*Math.PI)===0)e&&(c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),e=!1),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width*g.scale.x+g.position.x+.5|0,g.anchor.y*-i.height*g.scale.y+g.position.y+.5|0,i.width*g.scale.x,i.height*g.scale.y);else{e||(e=!0),b.DisplayObject.prototype.updateTransform.call(g);var j=g.worldTransform;a.roundPixels?c.setTransform(j.a,j.c,j.b,j.d,0|j.tx,0|j.ty):c.setTransform(j.a,j.c,j.b,j.d,j.tx,j.ty),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width+.5|0,g.anchor.y*-i.height+.5|0,i.width,i.height)}}}},b.MovieClip=function(a){b.Sprite.call(this,a[0]),this.textures=a,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this.currentFrame=0,this.playing=!1},b.MovieClip.prototype=Object.create(b.Sprite.prototype),b.MovieClip.prototype.constructor=b.MovieClip,Object.defineProperty(b.MovieClip.prototype,"totalFrames",{get:function(){return this.textures.length}}),b.MovieClip.prototype.stop=function(){this.playing=!1},b.MovieClip.prototype.play=function(){this.playing=!0},b.MovieClip.prototype.gotoAndStop=function(a){this.playing=!1,this.currentFrame=a;var b=this.currentFrame+.5|0;this.setTexture(this.textures[b%this.textures.length])},b.MovieClip.prototype.gotoAndPlay=function(a){this.currentFrame=a,this.playing=!0},b.MovieClip.prototype.updateTransform=function(){if(b.Sprite.prototype.updateTransform.call(this),this.playing){this.currentFrame+=this.animationSpeed;var a=this.currentFrame+.5|0;this.currentFrame=this.currentFrame%this.textures.length,this.loop||a<this.textures.length?this.setTexture(this.textures[a%this.textures.length]):a>=this.textures.length&&(this.gotoAndStop(this.textures.length-1),this.onComplete&&this.onComplete())}},b.MovieClip.fromFrames=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromFrame(a[d]));return new b.MovieClip(c)},b.MovieClip.fromImages=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromImage(a[d]));return new b.MovieClip(c)},b.FilterBlock=function(){this.visible=!0,this.renderable=!0},b.Text=function(a,c){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),b.Sprite.call(this,b.Texture.fromCanvas(this.canvas)),this.setText(a),this.setStyle(c)},b.Text.prototype=Object.create(b.Sprite.prototype),b.Text.prototype.constructor=b.Text,Object.defineProperty(b.Text.prototype,"width",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Text.prototype,"height",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Text.prototype.setStyle=function(a){a=a||{},a.font=a.font||"bold 20pt Arial",a.fill=a.fill||"black",a.align=a.align||"left",a.stroke=a.stroke||"black",a.strokeThickness=a.strokeThickness||0,a.wordWrap=a.wordWrap||!1,a.wordWrapWidth=a.wordWrapWidth||100,a.wordWrapWidth=a.wordWrapWidth||100,a.dropShadow=a.dropShadow||!1,a.dropShadowAngle=a.dropShadowAngle||Math.PI/6,a.dropShadowDistance=a.dropShadowDistance||4,a.dropShadowColor=a.dropShadowColor||"black",this.style=a,this.dirty=!0},b.Text.prototype.setText=function(a){this.text=a.toString()||" ",this.dirty=!0},b.Text.prototype.updateText=function(){this.context.font=this.style.font;var a=this.text;this.style.wordWrap&&(a=this.wordWrap(this.text));for(var b=a.split(/(?:\r\n|\r|\n)/),c=[],d=0,e=0;e<b.length;e++){var f=this.context.measureText(b[e]).width;c[e]=f,d=Math.max(d,f)}var g=d+this.style.strokeThickness;this.style.dropShadow&&(g+=this.style.dropShadowDistance),this.canvas.width=g+this.context.lineWidth;var h=this.determineFontHeight("font: "+this.style.font+";")+this.style.strokeThickness,i=h*b.length;this.style.dropShadow&&(i+=this.style.dropShadowDistance),this.canvas.height=i,navigator.isCocoonJS&&this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=this.style.font,this.context.strokeStyle=this.style.stroke,this.context.lineWidth=this.style.strokeThickness,this.context.textBaseline="top";var j,k;if(this.style.dropShadow){this.context.fillStyle=this.style.dropShadowColor;var l=Math.sin(this.style.dropShadowAngle)*this.style.dropShadowDistance,m=Math.cos(this.style.dropShadowAngle)*this.style.dropShadowDistance;for(e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.fill&&this.context.fillText(b[e],j+l,k+m)}for(this.context.fillStyle=this.style.fill,e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.stroke&&this.style.strokeThickness&&this.context.strokeText(b[e],j,k),this.style.fill&&this.context.fillText(b[e],j,k);this.updateTexture()},b.Text.prototype.updateTexture=function(){this.texture.baseTexture.width=this.canvas.width,this.texture.baseTexture.height=this.canvas.height,this.texture.crop.width=this.texture.frame.width=this.canvas.width,this.texture.crop.height=this.texture.frame.height=this.canvas.height,this._width=this.canvas.width,this._height=this.canvas.height,this.requiresUpdate=!0},b.Text.prototype._renderWebGL=function(a){this.requiresUpdate&&(this.requiresUpdate=!1,b.updateWebGLTexture(this.texture.baseTexture,a.gl)),b.Sprite.prototype._renderWebGL.call(this,a)},b.Text.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.Sprite.prototype.updateTransform.call(this)},b.Text.prototype.determineFontHeight=function(a){var c=b.Text.heightCache[a];if(!c){var d=document.getElementsByTagName("body")[0],e=document.createElement("div"),f=document.createTextNode("M");e.appendChild(f),e.setAttribute("style",a+";position:absolute;top:0;left:0"),d.appendChild(e),c=e.offsetHeight,b.Text.heightCache[a]=c,d.removeChild(e)}return c},b.Text.prototype.wordWrap=function(a){for(var b="",c=a.split("\n"),d=0;d<c.length;d++){for(var e=this.style.wordWrapWidth,f=c[d].split(" "),g=0;g<f.length;g++){var h=this.context.measureText(f[g]).width,i=h+this.context.measureText(" ").width;0===g||i>e?(g>0&&(b+="\n"),b+=f[g],e=this.style.wordWrapWidth-h):(e-=i,b+=" "+f[g])}d<c.length-1&&(b+="\n")}return b},b.Text.prototype.destroy=function(a){this.context=null,this.canvas=null,this.texture.destroy(void 0===a?!0:a)},b.Text.heightCache={},b.BitmapText=function(a,c){b.DisplayObjectContainer.call(this),this._pool=[],this.setText(a),this.setStyle(c),this.updateText(),this.dirty=!1},b.BitmapText.prototype=Object.create(b.DisplayObjectContainer.prototype),b.BitmapText.prototype.constructor=b.BitmapText,b.BitmapText.prototype.setText=function(a){this.text=a||" ",this.dirty=!0},b.BitmapText.prototype.setStyle=function(a){a=a||{},a.align=a.align||"left",this.style=a;var c=a.font.split(" ");this.fontName=c[c.length-1],this.fontSize=c.length>=2?parseInt(c[c.length-2],10):b.BitmapText.fonts[this.fontName].size,this.dirty=!0,this.tint=a.tint},b.BitmapText.prototype.updateText=function(){for(var a=b.BitmapText.fonts[this.fontName],c=new b.Point,d=null,e=[],f=0,g=[],h=0,i=this.fontSize/a.size,j=0;j<this.text.length;j++){var k=this.text.charCodeAt(j);if(/(?:\r\n|\r|\n)/.test(this.text.charAt(j)))g.push(c.x),f=Math.max(f,c.x),h++,c.x=0,c.y+=a.lineHeight,d=null;else{var l=a.chars[k];l&&(d&&l[d]&&(c.x+=l.kerning[d]),e.push({texture:l.texture,line:h,charCode:k,position:new b.Point(c.x+l.xOffset,c.y+l.yOffset)}),c.x+=l.xAdvance,d=k)}}g.push(c.x),f=Math.max(f,c.x);var m=[];for(j=0;h>=j;j++){var n=0;"right"===this.style.align?n=f-g[j]:"center"===this.style.align&&(n=(f-g[j])/2),m.push(n)}var o=this.children.length,p=e.length,q=this.tint||16777215;for(j=0;p>j;j++){var r=o>j?this.children[j]:this._pool.pop();r?r.setTexture(e[j].texture):r=new b.Sprite(e[j].texture),r.position.x=(e[j].position.x+m[e[j].line])*i,r.position.y=e[j].position.y*i,r.scale.x=r.scale.y=i,r.tint=q,r.parent||this.addChild(r)}for(;this.children.length>p;){var s=this.getChildAt(this.children.length-1);this._pool.push(s),this.removeChild(s)}this.textWidth=f*i,this.textHeight=(c.y+a.lineHeight)*i},b.BitmapText.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.BitmapText.fonts={},b.InteractionData=function(){this.global=new b.Point,this.target=null,this.originalEvent=null},b.InteractionData.prototype.getLocalPosition=function(a){var c=a.worldTransform,d=this.global,e=c.a,f=c.b,g=c.tx,h=c.c,i=c.d,j=c.ty,k=1/(e*i+f*-h);return new b.Point(i*k*d.x+-f*k*d.y+(j*f-g*i)*k,e*k*d.y+-h*k*d.x+(-j*e+g*h)*k)},b.InteractionData.prototype.constructor=b.InteractionData,b.InteractionManager=function(a){this.stage=a,this.mouse=new b.InteractionData,this.touchs={},this.tempPoint=new b.Point,this.mouseoverEnabled=!0,this.pool=[],this.interactiveItems=[],this.interactionDOMElement=null,this.onMouseMove=this.onMouseMove.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.last=0,this.currentCursorStyle="inherit",this.mouseOut=!1},b.InteractionManager.prototype.constructor=b.InteractionManager,b.InteractionManager.prototype.collectInteractiveSprite=function(a,b){for(var c=a.children,d=c.length,e=d-1;e>=0;e--){var f=c[e];f._interactive?(b.interactiveChildren=!0,this.interactiveItems.push(f),f.children.length>0&&this.collectInteractiveSprite(f,f)):(f.__iParent=null,f.children.length>0&&this.collectInteractiveSprite(f,b))}},b.InteractionManager.prototype.setTarget=function(a){this.target=a,null===this.interactionDOMElement&&this.setTargetDomElement(a.view)},b.InteractionManager.prototype.setTargetDomElement=function(a){this.removeEvents(),window.navigator.msPointerEnabled&&(a.style["-ms-content-zooming"]="none",a.style["-ms-touch-action"]="none"),this.interactionDOMElement=a,a.addEventListener("mousemove",this.onMouseMove,!0),a.addEventListener("mousedown",this.onMouseDown,!0),a.addEventListener("mouseout",this.onMouseOut,!0),a.addEventListener("touchstart",this.onTouchStart,!0),a.addEventListener("touchend",this.onTouchEnd,!0),a.addEventListener("touchmove",this.onTouchMove,!0),window.addEventListener("mouseup",this.onMouseUp,!0)},b.InteractionManager.prototype.removeEvents=function(){this.interactionDOMElement&&(this.interactionDOMElement.style["-ms-content-zooming"]="",this.interactionDOMElement.style["-ms-touch-action"]="",this.interactionDOMElement.removeEventListener("mousemove",this.onMouseMove,!0),this.interactionDOMElement.removeEventListener("mousedown",this.onMouseDown,!0),this.interactionDOMElement.removeEventListener("mouseout",this.onMouseOut,!0),this.interactionDOMElement.removeEventListener("touchstart",this.onTouchStart,!0),this.interactionDOMElement.removeEventListener("touchend",this.onTouchEnd,!0),this.interactionDOMElement.removeEventListener("touchmove",this.onTouchMove,!0),this.interactionDOMElement=null,window.removeEventListener("mouseup",this.onMouseUp,!0))},b.InteractionManager.prototype.update=function(){if(this.target){var a=Date.now(),c=a-this.last;if(c=c*b.INTERACTION_FREQUENCY/1e3,!(1>c)){this.last=a;var d=0;this.dirty&&this.rebuildInteractiveGraph();var e=this.interactiveItems.length,f="inherit",g=!1;for(d=0;e>d;d++){var h=this.interactiveItems[d];h.__hit=this.hitTest(h,this.mouse),this.mouse.target=h,h.__hit&&!g?(h.buttonMode&&(f=h.defaultCursor),h.interactiveChildren||(g=!0),h.__isOver||(h.mouseover&&h.mouseover(this.mouse),h.__isOver=!0)):h.__isOver&&(h.mouseout&&h.mouseout(this.mouse),h.__isOver=!1)}this.currentCursorStyle!==f&&(this.currentCursorStyle=f,this.interactionDOMElement.style.cursor=f)}}},b.InteractionManager.prototype.rebuildInteractiveGraph=function(){this.dirty=!1;for(var a=this.interactiveItems.length,b=0;a>b;b++)this.interactiveItems[b].interactiveChildren=!1;this.interactiveItems=[],this.stage.interactive&&this.interactiveItems.push(this.stage),this.collectInteractiveSprite(this.stage,this.stage)},b.InteractionManager.prototype.onMouseMove=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;var b=this.interactionDOMElement.getBoundingClientRect();this.mouse.global.x=(a.clientX-b.left)*(this.target.width/b.width),this.mouse.global.y=(a.clientY-b.top)*(this.target.height/b.height);for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];e.mousemove&&e.mousemove(this.mouse)}},b.InteractionManager.prototype.onMouseDown=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event,b.AUTO_PREVENT_DEFAULT&&this.mouse.originalEvent.preventDefault();for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];if((e.mousedown||e.click)&&(e.__mouseIsDown=!0,e.__hit=this.hitTest(e,this.mouse),e.__hit&&(e.mousedown&&e.mousedown(this.mouse),e.__isDown=!0,!e.interactiveChildren)))break}},b.InteractionManager.prototype.onMouseOut=function(){this.dirty&&this.rebuildInteractiveGraph();var a=this.interactiveItems.length;this.interactionDOMElement.style.cursor="inherit";for(var b=0;a>b;b++){var c=this.interactiveItems[b];c.__isOver&&(this.mouse.target=c,c.mouseout&&c.mouseout(this.mouse),c.__isOver=!1)}this.mouseOut=!0,this.mouse.global.x=-1e4,this.mouse.global.y=-1e4},b.InteractionManager.prototype.onMouseUp=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;
for(var b=this.interactiveItems.length,c=!1,d=0;b>d;d++){var e=this.interactiveItems[d];e.__hit=this.hitTest(e,this.mouse),e.__hit&&!c?(e.mouseup&&e.mouseup(this.mouse),e.__isDown&&e.click&&e.click(this.mouse),e.interactiveChildren||(c=!0)):e.__isDown&&e.mouseupoutside&&e.mouseupoutside(this.mouse),e.__isDown=!1}},b.InteractionManager.prototype.hitTest=function(a,c){var d=c.global;if(!a.worldVisible)return!1;var e=a instanceof b.Sprite,f=a.worldTransform,g=f.a,h=f.b,i=f.tx,j=f.c,k=f.d,l=f.ty,m=1/(g*k+h*-j),n=k*m*d.x+-h*m*d.y+(l*h-i*k)*m,o=g*m*d.y+-j*m*d.x+(-l*g+i*j)*m;if(c.target=a,a.hitArea&&a.hitArea.contains)return a.hitArea.contains(n,o)?(c.target=a,!0):!1;if(e){var p,q=a.texture.frame.width,r=a.texture.frame.height,s=-q*a.anchor.x;if(n>s&&s+q>n&&(p=-r*a.anchor.y,o>p&&p+r>o))return c.target=a,!0}for(var t=a.children.length,u=0;t>u;u++){var v=a.children[u],w=this.hitTest(v,c);if(w)return c.target=a,!0}return!1},b.InteractionManager.prototype.onTouchMove=function(a){this.dirty&&this.rebuildInteractiveGraph();var b,c=this.interactionDOMElement.getBoundingClientRect(),d=a.changedTouches,e=0;for(e=0;e<d.length;e++){var f=d[e];b=this.touchs[f.identifier],b.originalEvent=a||window.event,b.global.x=(f.clientX-c.left)*(this.target.width/c.width),b.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(b.global.x=f.clientX,b.global.y=f.clientY);for(var g=0;g<this.interactiveItems.length;g++){var h=this.interactiveItems[g];h.touchmove&&h.__touchData&&h.__touchData[f.identifier]&&h.touchmove(b)}}},b.InteractionManager.prototype.onTouchStart=function(a){this.dirty&&this.rebuildInteractiveGraph();var c=this.interactionDOMElement.getBoundingClientRect();b.AUTO_PREVENT_DEFAULT&&a.preventDefault();for(var d=a.changedTouches,e=0;e<d.length;e++){var f=d[e],g=this.pool.pop();g||(g=new b.InteractionData),g.originalEvent=a||window.event,this.touchs[f.identifier]=g,g.global.x=(f.clientX-c.left)*(this.target.width/c.width),g.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(g.global.x=f.clientX,g.global.y=f.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];if((j.touchstart||j.tap)&&(j.__hit=this.hitTest(j,g),j.__hit&&(j.touchstart&&j.touchstart(g),j.__isDown=!0,j.__touchData=j.__touchData||{},j.__touchData[f.identifier]=g,!j.interactiveChildren)))break}}},b.InteractionManager.prototype.onTouchEnd=function(a){this.dirty&&this.rebuildInteractiveGraph();for(var b=this.interactionDOMElement.getBoundingClientRect(),c=a.changedTouches,d=0;d<c.length;d++){var e=c[d],f=this.touchs[e.identifier],g=!1;f.global.x=(e.clientX-b.left)*(this.target.width/b.width),f.global.y=(e.clientY-b.top)*(this.target.height/b.height),navigator.isCocoonJS&&(f.global.x=e.clientX,f.global.y=e.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];j.__touchData&&j.__touchData[e.identifier]&&(j.__hit=this.hitTest(j,j.__touchData[e.identifier]),f.originalEvent=a||window.event,(j.touchend||j.tap)&&(j.__hit&&!g?(j.touchend&&j.touchend(f),j.__isDown&&j.tap&&j.tap(f),j.interactiveChildren||(g=!0)):j.__isDown&&j.touchendoutside&&j.touchendoutside(f),j.__isDown=!1),j.__touchData[e.identifier]=null)}this.pool.push(f),this.touchs[e.identifier]=null}},b.Stage=function(a){b.DisplayObjectContainer.call(this),this.worldTransform=new b.Matrix,this.interactive=!0,this.interactionManager=new b.InteractionManager(this),this.dirty=!0,this.stage=this,this.stage.hitArea=new b.Rectangle(0,0,1e5,1e5),this.setBackgroundColor(a)},b.Stage.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Stage.prototype.constructor=b.Stage,b.Stage.prototype.setInteractionDelegate=function(a){this.interactionManager.setTargetDomElement(a)},b.Stage.prototype.updateTransform=function(){this.worldAlpha=1;for(var a=0,b=this.children.length;b>a;a++)this.children[a].updateTransform();this.dirty&&(this.dirty=!1,this.interactionManager.dirty=!0),this.interactive&&this.interactionManager.update()},b.Stage.prototype.setBackgroundColor=function(a){this.backgroundColor=a||0,this.backgroundColorSplit=b.hex2rgb(this.backgroundColor);var c=this.backgroundColor.toString(16);c="000000".substr(0,6-c.length)+c,this.backgroundColorString="#"+c},b.Stage.prototype.getMousePosition=function(){return this.interactionManager.mouse.global};for(var c=0,d=["ms","moz","webkit","o"],e=0;e<d.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[d[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[d[e]+"CancelAnimationFrame"]||window[d[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var b=(new Date).getTime(),d=Math.max(0,16-(b-c)),e=window.setTimeout(function(){a(b+d)},d);return c=b+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)}),window.requestAnimFrame=window.requestAnimationFrame,b.hex2rgb=function(a){return[(a>>16&255)/255,(a>>8&255)/255,(255&a)/255]},b.rgb2hex=function(a){return(255*a[0]<<16)+(255*a[1]<<8)+255*a[2]},"function"!=typeof Function.prototype.bind&&(Function.prototype.bind=function(){var a=Array.prototype.slice;return function(b){function c(){var f=e.concat(a.call(arguments));d.apply(this instanceof c?this:b,f)}var d=this,e=a.call(arguments,1);if("function"!=typeof d)throw new TypeError;return c.prototype=function f(a){return a&&(f.prototype=a),this instanceof f?void 0:new f}(d.prototype),c}}()),b.AjaxRequest=function(){var a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Microsoft.XMLHTTP"];if(!window.ActiveXObject)return window.XMLHttpRequest?new window.XMLHttpRequest:!1;for(var b=0;b<a.length;b++)try{return new window.ActiveXObject(a[b])}catch(c){}},b.canUseNewCanvasBlendModes=function(){var a=document.createElement("canvas");a.width=1,a.height=1;var b=a.getContext("2d");return b.fillStyle="#000",b.fillRect(0,0,1,1),b.globalCompositeOperation="multiply",b.fillStyle="#fff",b.fillRect(0,0,1,1),0===b.getImageData(0,0,1,1).data[0]},b.getNextPowerOfTwo=function(a){if(a>0&&0===(a&a-1))return a;for(var b=1;a>b;)b<<=1;return b},b.EventTarget=function(){var a={};this.addEventListener=this.on=function(b,c){void 0===a[b]&&(a[b]=[]),-1===a[b].indexOf(c)&&a[b].unshift(c)},this.dispatchEvent=this.emit=function(b){if(a[b.type]&&a[b.type].length)for(var c=a[b.type].length-1;c>=0;c--)a[b.type][c](b)},this.removeEventListener=this.off=function(b,c){if(void 0!==a[b]){var d=a[b].indexOf(c);-1!==d&&a[b].splice(d,1)}},this.removeAllEventListeners=function(b){var c=a[b];c&&(c.length=0)}},b.autoDetectRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}();return g?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.autoDetectRecommendedRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}(),h=/Android/i.test(navigator.userAgent);return g&&!h?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.PolyK={},b.PolyK.Triangulate=function(a){var c=!0,d=a.length>>1;if(3>d)return[];for(var e=[],f=[],g=0;d>g;g++)f.push(g);g=0;for(var h=d;h>3;){var i=f[(g+0)%h],j=f[(g+1)%h],k=f[(g+2)%h],l=a[2*i],m=a[2*i+1],n=a[2*j],o=a[2*j+1],p=a[2*k],q=a[2*k+1],r=!1;if(b.PolyK._convex(l,m,n,o,p,q,c)){r=!0;for(var s=0;h>s;s++){var t=f[s];if(t!==i&&t!==j&&t!==k&&b.PolyK._PointInTriangle(a[2*t],a[2*t+1],l,m,n,o,p,q)){r=!1;break}}}if(r)e.push(i,j,k),f.splice((g+1)%h,1),h--,g=0;else if(g++>3*h){if(!c)return window.console.log("PIXI Warning: shape too complex to fill"),[];for(e=[],f=[],g=0;d>g;g++)f.push(g);g=0,h=d,c=!1}}return e.push(f[0],f[1],f[2]),e},b.PolyK._PointInTriangle=function(a,b,c,d,e,f,g,h){var i=g-c,j=h-d,k=e-c,l=f-d,m=a-c,n=b-d,o=i*i+j*j,p=i*k+j*l,q=i*m+j*n,r=k*k+l*l,s=k*m+l*n,t=1/(o*r-p*p),u=(r*q-p*s)*t,v=(o*s-p*q)*t;return u>=0&&v>=0&&1>u+v},b.PolyK._convex=function(a,b,c,d,e,f,g){return(b-d)*(e-c)+(c-a)*(f-d)>=0===g},b.initDefaultShaders=function(){},b.CompileVertexShader=function(a,c){return b._CompileShader(a,c,a.VERTEX_SHADER)},b.CompileFragmentShader=function(a,c){return b._CompileShader(a,c,a.FRAGMENT_SHADER)},b._CompileShader=function(a,b,c){var d=b.join("\n"),e=a.createShader(c);return a.shaderSource(e,d),a.compileShader(e),a.getShaderParameter(e,a.COMPILE_STATUS)?e:(window.console.log(a.getShaderInfoLog(e)),null)},b.compileProgram=function(a,c,d){var e=b.CompileFragmentShader(a,d),f=b.CompileVertexShader(a,c),g=a.createProgram();return a.attachShader(g,f),a.attachShader(g,e),a.linkProgram(g),a.getProgramParameter(g,a.LINK_STATUS)||window.console.log("Could not initialise shaders"),g},b.PixiShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.textureCount=0,this.attributes=[],this.init()},b.PixiShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc||b.PixiShader.defaultVertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aTextureCoord,this.colorAttribute];for(var d in this.uniforms)this.uniforms[d].uniformLocation=a.getUniformLocation(c,d);this.initUniforms(),this.program=c},b.PixiShader.prototype.initUniforms=function(){this.textureCount=1;var a,b=this.gl;for(var c in this.uniforms){a=this.uniforms[c];var d=a.type;"sampler2D"===d?(a._init=!1,null!==a.value&&this.initSampler2D(a)):"mat2"===d||"mat3"===d||"mat4"===d?(a.glMatrix=!0,a.glValueLength=1,"mat2"===d?a.glFunc=b.uniformMatrix2fv:"mat3"===d?a.glFunc=b.uniformMatrix3fv:"mat4"===d&&(a.glFunc=b.uniformMatrix4fv)):(a.glFunc=b["uniform"+d],a.glValueLength="2f"===d||"2i"===d?2:"3f"===d||"3i"===d?3:"4f"===d||"4i"===d?4:1)}},b.PixiShader.prototype.initSampler2D=function(a){if(a.value&&a.value.baseTexture&&a.value.baseTexture.hasLoaded){var b=this.gl;if(b.activeTexture(b["TEXTURE"+this.textureCount]),b.bindTexture(b.TEXTURE_2D,a.value.baseTexture._glTextures[b.id]),a.textureData){var c=a.textureData,d=c.magFilter?c.magFilter:b.LINEAR,e=c.minFilter?c.minFilter:b.LINEAR,f=c.wrapS?c.wrapS:b.CLAMP_TO_EDGE,g=c.wrapT?c.wrapT:b.CLAMP_TO_EDGE,h=c.luminance?b.LUMINANCE:b.RGBA;if(c.repeat&&(f=b.REPEAT,g=b.REPEAT),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,!!c.flipY),c.width){var i=c.width?c.width:512,j=c.height?c.height:2,k=c.border?c.border:0;b.texImage2D(b.TEXTURE_2D,0,h,i,j,k,h,b.UNSIGNED_BYTE,null)}else b.texImage2D(b.TEXTURE_2D,0,h,b.RGBA,b.UNSIGNED_BYTE,a.value.baseTexture.source);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,d),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,e),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,f),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,g)}b.uniform1i(a.uniformLocation,this.textureCount),a._init=!0,this.textureCount++}},b.PixiShader.prototype.syncUniforms=function(){this.textureCount=1;var a,c=this.gl;for(var d in this.uniforms)a=this.uniforms[d],1===a.glValueLength?a.glMatrix===!0?a.glFunc.call(c,a.uniformLocation,a.transpose,a.value):a.glFunc.call(c,a.uniformLocation,a.value):2===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y):3===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z):4===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z,a.value.w):"sampler2D"===a.type&&(a._init?(c.activeTexture(c["TEXTURE"+this.textureCount]),c.bindTexture(c.TEXTURE_2D,a.value.baseTexture._glTextures[c.id]||b.createWebGLTexture(a.value.baseTexture,c)),c.uniform1i(a.uniformLocation,this.textureCount),this.textureCount++):this.initSampler2D(a))},b.PixiShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.PixiShader.defaultVertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec2 aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","varying vec4 vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;","   vColor = vec4(color * aColor.x, aColor.x);","}"],b.PixiFastShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aPositionCoord;","attribute vec2 aScale;","attribute float aRotation;","attribute vec2 aTextureCoord;","attribute float aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform mat3 uMatrix;","varying vec2 vTextureCoord;","varying float vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   vec2 v;","   vec2 sv = aVertexPosition * aScale;","   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);","   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);","   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;","   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"],this.textureCount=0,this.init()},b.PixiFastShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.uMatrix=a.getUniformLocation(c,"uMatrix"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aPositionCoord=a.getAttribLocation(c,"aPositionCoord"),this.aScale=a.getAttribLocation(c,"aScale"),this.aRotation=a.getAttribLocation(c,"aRotation"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aPositionCoord,this.aScale,this.aRotation,this.aTextureCoord,this.colorAttribute],this.program=c},b.PixiFastShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.StripShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","uniform float alpha;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","}"],this.init()},b.StripShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.attributes=[this.aVertexPosition,this.aTextureCoord],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec4 aColor;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform float alpha;","uniform vec3 tint;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = aColor * vec4(tint * alpha, alpha);","}"],this.init()},b.PrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.ComplexPrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform vec3 tint;","uniform float alpha;","uniform vec3 color;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = vec4(color * alpha * tint, alpha);","}"],this.init()},b.ComplexPrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.color=a.getUniformLocation(c,"color"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.ComplexPrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.WebGLGraphics=function(){},b.WebGLGraphics.renderGraphics=function(a,c){var d,e=c.gl,f=c.projection,g=c.offset,h=c.shaderManager.primitiveShader;a.dirty&&b.WebGLGraphics.updateGraphics(a,e);for(var i=a._webGL[e.id],j=0;j<i.data.length;j++)1===i.data[j].mode?(d=i.data[j],c.stencilManager.pushStencil(a,d,c),e.drawElements(e.TRIANGLE_FAN,4,e.UNSIGNED_SHORT,2*(d.indices.length-4)),c.stencilManager.popStencil(a,d,c),this.last=d.mode):(d=i.data[j],c.shaderManager.setShader(h),h=c.shaderManager.primitiveShader,e.uniformMatrix3fv(h.translationMatrix,!1,a.worldTransform.toArray(!0)),e.uniform2f(h.projectionVector,f.x,-f.y),e.uniform2f(h.offsetVector,-g.x,-g.y),e.uniform3fv(h.tintColor,b.hex2rgb(a.tint)),e.uniform1f(h.alpha,a.worldAlpha),e.bindBuffer(e.ARRAY_BUFFER,d.buffer),e.vertexAttribPointer(h.aVertexPosition,2,e.FLOAT,!1,24,0),e.vertexAttribPointer(h.colorAttribute,4,e.FLOAT,!1,24,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,d.indexBuffer),e.drawElements(e.TRIANGLE_STRIP,d.indices.length,e.UNSIGNED_SHORT,0))},b.WebGLGraphics.updateGraphics=function(a,c){var d=a._webGL[c.id];d||(d=a._webGL[c.id]={lastIndex:0,data:[],gl:c}),a.dirty=!1;var e;if(a.clearDirty){for(a.clearDirty=!1,e=0;e<d.data.length;e++){var f=d.data[e];f.reset(),b.WebGLGraphics.graphicsDataPool.push(f)}d.data=[],d.lastIndex=0}var g;for(e=d.lastIndex;e<a.graphicsData.length;e++){var h=a.graphicsData[e];h.type===b.Graphics.POLY?(h.fill&&h.points.length>6&&(h.points.length>10?(g=b.WebGLGraphics.switchMode(d,1),b.WebGLGraphics.buildComplexPoly(h,g)):(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildPoly(h,g))),h.lineWidth>0&&(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildLine(h,g))):(g=b.WebGLGraphics.switchMode(d,0),h.type===b.Graphics.RECT?b.WebGLGraphics.buildRectangle(h,g):h.type===b.Graphics.CIRC||h.type===b.Graphics.ELIP?b.WebGLGraphics.buildCircle(h,g):h.type===b.Graphics.RREC&&b.WebGLGraphics.buildRoundedRectangle(h,g)),d.lastIndex++}for(e=0;e<d.data.length;e++)g=d.data[e],g.dirty&&g.upload()},b.WebGLGraphics.switchMode=function(a,c){var d;return a.data.length?(d=a.data[a.data.length-1],(d.mode!==c||1===c)&&(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d))):(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d)),d.dirty=!0,d},b.WebGLGraphics.buildRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3];if(a.fill){var i=b.hex2rgb(a.fillColor),j=a.fillAlpha,k=i[0]*j,l=i[1]*j,m=i[2]*j,n=c.points,o=c.indices,p=n.length/6;n.push(e,f),n.push(k,l,m,j),n.push(e+g,f),n.push(k,l,m,j),n.push(e,f+h),n.push(k,l,m,j),n.push(e+g,f+h),n.push(k,l,m,j),o.push(p,p,p+1,p+2,p+3,p+3)}if(a.lineWidth){var q=a.points;a.points=[e,f,e+g,f,e+g,f+h,e,f+h,e,f],b.WebGLGraphics.buildLine(a,c),a.points=q}},b.WebGLGraphics.buildRoundedRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=d[4],j=[];if(j.push(e,f+i),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e,f+h-i,e,f+h,e+i,f+h)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g-i,f+h,e+g,f+h,e+g,f+h-i)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g,f+i,e+g,f,e+g-i,f)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+i,f,e,f,e,f+i)),a.fill){var k=b.hex2rgb(a.fillColor),l=a.fillAlpha,m=k[0]*l,n=k[1]*l,o=k[2]*l,p=c.points,q=c.indices,r=p.length/6,s=b.PolyK.Triangulate(j),t=0;for(t=0;t<s.length;t+=3)q.push(s[t]+r),q.push(s[t]+r),q.push(s[t+1]+r),q.push(s[t+2]+r),q.push(s[t+2]+r);for(t=0;t<j.length;t++)p.push(j[t],j[++t],m,n,o,l)}if(a.lineWidth){var u=a.points;a.points=j,b.WebGLGraphics.buildLine(a,c),a.points=u}},b.WebGLGraphics.quadraticBezierCurve=function(a,b,c,d,e,f){function g(a,b,c){var d=b-a;return a+d*c}for(var h,i,j,k,l,m,n=20,o=[],p=0,q=0;n>=q;q++)p=q/n,h=g(a,c,p),i=g(b,d,p),j=g(c,e,p),k=g(d,f,p),l=g(h,j,p),m=g(i,k,p),o.push(l,m);return o},b.WebGLGraphics.buildCircle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=40,j=2*Math.PI/i,k=0;if(a.fill){var l=b.hex2rgb(a.fillColor),m=a.fillAlpha,n=l[0]*m,o=l[1]*m,p=l[2]*m,q=c.points,r=c.indices,s=q.length/6;for(r.push(s),k=0;i+1>k;k++)q.push(e,f,n,o,p,m),q.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h,n,o,p,m),r.push(s++,s++);r.push(s-1)}if(a.lineWidth){var t=a.points;for(a.points=[],k=0;i+1>k;k++)a.points.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h);b.WebGLGraphics.buildLine(a,c),a.points=t}},b.WebGLGraphics.buildLine=function(a,c){var d=0,e=a.points;if(0!==e.length){if(a.lineWidth%2)for(d=0;d<e.length;d++)e[d]+=.5;var f=new b.Point(e[0],e[1]),g=new b.Point(e[e.length-2],e[e.length-1]);if(f.x===g.x&&f.y===g.y){e=e.slice(),e.pop(),e.pop(),g=new b.Point(e[e.length-2],e[e.length-1]);var h=g.x+.5*(f.x-g.x),i=g.y+.5*(f.y-g.y);e.unshift(h,i),e.push(h,i)}var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=c.points,H=c.indices,I=e.length/2,J=e.length,K=G.length/6,L=a.lineWidth/2,M=b.hex2rgb(a.lineColor),N=a.lineAlpha,O=M[0]*N,P=M[1]*N,Q=M[2]*N;for(l=e[0],m=e[1],n=e[2],o=e[3],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(l-r,m-s,O,P,Q,N),G.push(l+r,m+s,O,P,Q,N),d=1;I-1>d;d++)l=e[2*(d-1)],m=e[2*(d-1)+1],n=e[2*d],o=e[2*d+1],p=e[2*(d+1)],q=e[2*(d+1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,t=-(o-q),u=n-p,F=Math.sqrt(t*t+u*u),t/=F,u/=F,t*=L,u*=L,x=-s+m-(-s+o),y=-r+n-(-r+l),z=(-r+l)*(-s+o)-(-r+n)*(-s+m),A=-u+q-(-u+o),B=-t+n-(-t+p),C=(-t+p)*(-u+o)-(-t+n)*(-u+q),D=x*B-A*y,Math.abs(D)<.1?(D+=10.1,G.push(n-r,o-s,O,P,Q,N),G.push(n+r,o+s,O,P,Q,N)):(j=(y*C-B*z)/D,k=(A*z-x*C)/D,E=(j-n)*(j-n)+(k-o)+(k-o),E>19600?(v=r-t,w=s-u,F=Math.sqrt(v*v+w*w),v/=F,w/=F,v*=L,w*=L,G.push(n-v,o-w),G.push(O,P,Q,N),G.push(n+v,o+w),G.push(O,P,Q,N),G.push(n-v,o-w),G.push(O,P,Q,N),J++):(G.push(j,k),G.push(O,P,Q,N),G.push(n-(j-n),o-(k-o)),G.push(O,P,Q,N)));for(l=e[2*(I-2)],m=e[2*(I-2)+1],n=e[2*(I-1)],o=e[2*(I-1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(n-r,o-s),G.push(O,P,Q,N),G.push(n+r,o+s),G.push(O,P,Q,N),H.push(K),d=0;J>d;d++)H.push(K++);H.push(K-1)}},b.WebGLGraphics.buildComplexPoly=function(a,c){var d=a.points.slice();if(!(d.length<6)){var e=c.indices;c.points=d,c.alpha=a.fillAlpha,c.color=b.hex2rgb(a.fillColor);for(var f,g,h=1/0,i=-1/0,j=1/0,k=-1/0,l=0;l<d.length;l+=2)f=d[l],g=d[l+1],h=h>f?f:h,i=f>i?f:i,j=j>g?g:j,k=g>k?g:k;d.push(h,j,i,j,i,k,h,k);var m=d.length/2;for(l=0;m>l;l++)e.push(l)}},b.WebGLGraphics.buildPoly=function(a,c){var d=a.points;if(!(d.length<6)){var e=c.points,f=c.indices,g=d.length/2,h=b.hex2rgb(a.fillColor),i=a.fillAlpha,j=h[0]*i,k=h[1]*i,l=h[2]*i,m=b.PolyK.Triangulate(d),n=e.length/6,o=0;for(o=0;o<m.length;o+=3)f.push(m[o]+n),f.push(m[o]+n),f.push(m[o+1]+n),f.push(m[o+2]+n),f.push(m[o+2]+n);for(o=0;g>o;o++)e.push(d[2*o],d[2*o+1],j,k,l,i)}},b.WebGLGraphics.graphicsDataPool=[],b.WebGLGraphicsData=function(a){this.gl=a,this.color=[0,0,0],this.points=[],this.indices=[],this.lastIndex=0,this.buffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.mode=1,this.alpha=1,this.dirty=!0},b.WebGLGraphicsData.prototype.reset=function(){this.points=[],this.indices=[],this.lastIndex=0},b.WebGLGraphicsData.prototype.upload=function(){var a=this.gl;this.glPoints=new Float32Array(this.points),a.bindBuffer(a.ARRAY_BUFFER,this.buffer),a.bufferData(a.ARRAY_BUFFER,this.glPoints,a.STATIC_DRAW),this.glIndicies=new Uint16Array(this.indices),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.glIndicies,a.STATIC_DRAW),this.dirty=!1},b.glContexts=[],b.WebGLRenderer=function(a,c,d,e,f,g){b.defaultRenderer||(b.sayHello("webGL"),b.defaultRenderer=this),this.type=b.WEBGL_RENDERER,this.transparent=!!e,this.preserveDrawingBuffer=g,this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.view.width=this.width,this.view.height=this.height,this.contextLost=this.handleContextLost.bind(this),this.contextRestoredLost=this.handleContextRestored.bind(this),this.view.addEventListener("webglcontextlost",this.contextLost,!1),this.view.addEventListener("webglcontextrestored",this.contextRestoredLost,!1),this.options={alpha:this.transparent,antialias:!!f,premultipliedAlpha:!!e,stencil:!0,preserveDrawingBuffer:g};var h=null;if(["experimental-webgl","webgl"].forEach(function(a){try{h=h||this.view.getContext(a,this.options)}catch(b){}},this),!h)throw new Error("This browser does not support webGL. Try using the canvas renderer"+this);this.gl=h,this.glContextId=h.id=b.WebGLRenderer.glContextId++,b.glContexts[this.glContextId]=h,b.blendModesWebGL||(b.blendModesWebGL=[],b.blendModesWebGL[b.blendModes.NORMAL]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.ADD]=[h.SRC_ALPHA,h.DST_ALPHA],b.blendModesWebGL[b.blendModes.MULTIPLY]=[h.DST_COLOR,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SCREEN]=[h.SRC_ALPHA,h.ONE],b.blendModesWebGL[b.blendModes.OVERLAY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DARKEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LIGHTEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_DODGE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_BURN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HARD_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SOFT_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DIFFERENCE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.EXCLUSION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HUE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SATURATION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LUMINOSITY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA]),this.projection=new b.Point,this.projection.x=this.width/2,this.projection.y=-this.height/2,this.offset=new b.Point(0,0),this.resize(this.width,this.height),this.contextLost=!1,this.shaderManager=new b.WebGLShaderManager(h),this.spriteBatch=new b.WebGLSpriteBatch(h),this.maskManager=new b.WebGLMaskManager(h),this.filterManager=new b.WebGLFilterManager(h,this.transparent),this.stencilManager=new b.WebGLStencilManager(h),this.blendModeManager=new b.WebGLBlendModeManager(h),this.renderSession={},this.renderSession.gl=this.gl,this.renderSession.drawCount=0,this.renderSession.shaderManager=this.shaderManager,this.renderSession.maskManager=this.maskManager,this.renderSession.filterManager=this.filterManager,this.renderSession.blendModeManager=this.blendModeManager,this.renderSession.spriteBatch=this.spriteBatch,this.renderSession.stencilManager=this.stencilManager,this.renderSession.renderer=this,h.useProgram(this.shaderManager.defaultShader.program),h.disable(h.DEPTH_TEST),h.disable(h.CULL_FACE),h.enable(h.BLEND),h.colorMask(!0,!0,!0,this.transparent)},b.WebGLRenderer.prototype.constructor=b.WebGLRenderer,b.WebGLRenderer.prototype.render=function(a){if(!this.contextLost){this.__stage!==a&&(a.interactive&&a.interactionManager.removeEvents(),this.__stage=a),b.WebGLRenderer.updateTextures(),a.updateTransform(),a._interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)));var c=this.gl;c.viewport(0,0,this.width,this.height),c.bindFramebuffer(c.FRAMEBUFFER,null),this.transparent?c.clearColor(0,0,0,0):c.clearColor(a.backgroundColorSplit[0],a.backgroundColorSplit[1],a.backgroundColorSplit[2],1),c.clear(c.COLOR_BUFFER_BIT),this.renderDisplayObject(a,this.projection),a.interactive?a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)):a._interactiveEventsAdded&&(a._interactiveEventsAdded=!1,a.interactionManager.setTarget(this))}},b.WebGLRenderer.prototype.renderDisplayObject=function(a,c,d){this.renderSession.blendModeManager.setBlendMode(b.blendModes.NORMAL),this.renderSession.drawCount=0,this.renderSession.currentBlendMode=9999,this.renderSession.projection=c,this.renderSession.offset=this.offset,this.spriteBatch.begin(this.renderSession),this.filterManager.begin(this.renderSession,d),a._renderWebGL(this.renderSession),this.spriteBatch.end()},b.WebGLRenderer.updateTextures=function(){var a=0;for(a=0;a<b.Texture.frameUpdates.length;a++)b.WebGLRenderer.updateTextureFrame(b.Texture.frameUpdates[a]);for(a=0;a<b.texturesToDestroy.length;a++)b.WebGLRenderer.destroyTexture(b.texturesToDestroy[a]);b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,b.Texture.frameUpdates.length=0},b.WebGLRenderer.destroyTexture=function(a){for(var c=a._glTextures.length-1;c>=0;c--){var d=a._glTextures[c],e=b.glContexts[c];
e&&d&&e.deleteTexture(d)}a._glTextures.length=0},b.WebGLRenderer.updateTextureFrame=function(a){a._updateWebGLuvs()},b.WebGLRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b,this.gl.viewport(0,0,this.width,this.height),this.projection.x=this.width/2,this.projection.y=-this.height/2},b.createWebGLTexture=function(a,c){return a.hasLoaded&&(a._glTextures[c.id]=c.createTexture(),c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),c.bindTexture(c.TEXTURE_2D,null),a._dirty[c.id]=!1),a._glTextures[c.id]},b.updateWebGLTexture=function(a,c){a._glTextures[c.id]&&(c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),a._dirty[c.id]=!1)},b.WebGLRenderer.prototype.handleContextLost=function(a){a.preventDefault(),this.contextLost=!0},b.WebGLRenderer.prototype.handleContextRestored=function(){try{this.gl=this.view.getContext("experimental-webgl",this.options)}catch(a){try{this.gl=this.view.getContext("webgl",this.options)}catch(c){throw new Error(" This browser does not support webGL. Try using the canvas renderer"+this)}}var d=this.gl;d.id=b.WebGLRenderer.glContextId++,this.shaderManager.setContext(d),this.spriteBatch.setContext(d),this.primitiveBatch.setContext(d),this.maskManager.setContext(d),this.filterManager.setContext(d),this.renderSession.gl=this.gl,d.disable(d.DEPTH_TEST),d.disable(d.CULL_FACE),d.enable(d.BLEND),d.colorMask(!0,!0,!0,this.transparent),this.gl.viewport(0,0,this.width,this.height);for(var e in b.TextureCache){var f=b.TextureCache[e].baseTexture;f._glTextures=[]}this.contextLost=!1},b.WebGLRenderer.prototype.destroy=function(){this.view.removeEventListener("webglcontextlost",this.contextLost),this.view.removeEventListener("webglcontextrestored",this.contextRestoredLost),b.glContexts[this.glContextId]=null,this.projection=null,this.offset=null,this.shaderManager.destroy(),this.spriteBatch.destroy(),this.primitiveBatch.destroy(),this.maskManager.destroy(),this.filterManager.destroy(),this.shaderManager=null,this.spriteBatch=null,this.maskManager=null,this.filterManager=null,this.gl=null,this.renderSession=null},b.WebGLRenderer.glContextId=0,b.WebGLBlendModeManager=function(a){this.gl=a,this.currentBlendMode=99999},b.WebGLBlendModeManager.prototype.setBlendMode=function(a){if(this.currentBlendMode===a)return!1;this.currentBlendMode=a;var c=b.blendModesWebGL[this.currentBlendMode];return this.gl.blendFunc(c[0],c[1]),!0},b.WebGLBlendModeManager.prototype.destroy=function(){this.gl=null},b.WebGLMaskManager=function(a){this.maskStack=[],this.maskPosition=0,this.setContext(a),this.reverse=!1,this.count=0},b.WebGLMaskManager.prototype.setContext=function(a){this.gl=a},b.WebGLMaskManager.prototype.pushMask=function(a,c){var d=c.gl;a.dirty&&b.WebGLGraphics.updateGraphics(a,d),a._webGL[d.id].data.length&&c.stencilManager.pushStencil(a,a._webGL[d.id].data[0],c)},b.WebGLMaskManager.prototype.popMask=function(a,b){var c=this.gl;b.stencilManager.popStencil(a,a._webGL[c.id].data[0],b)},b.WebGLMaskManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLStencilManager=function(a){this.stencilStack=[],this.setContext(a),this.reverse=!0,this.count=0},b.WebGLStencilManager.prototype.setContext=function(a){this.gl=a},b.WebGLStencilManager.prototype.pushStencil=function(a,b,c){var d=this.gl;this.bindGraphics(a,b,c),0===this.stencilStack.length&&(d.enable(d.STENCIL_TEST),d.clear(d.STENCIL_BUFFER_BIT),this.reverse=!0,this.count=0),this.stencilStack.push(b);var e=this.count;d.colorMask(!1,!1,!1,!1),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),1===b.mode?(d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),this.reverse?d.stencilFunc(d.EQUAL,255-(e+1),255):d.stencilFunc(d.EQUAL,e+1,255),this.reverse=!this.reverse):(this.reverse?(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e+1,255):d.stencilFunc(d.EQUAL,255-(e+1),255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP),this.count++},b.WebGLStencilManager.prototype.bindGraphics=function(a,c,d){this._currentGraphics=a;var e,f=this.gl,g=d.projection,h=d.offset;1===c.mode?(e=d.shaderManager.complexPrimativeShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform3fv(e.color,c.color),f.uniform1f(e.alpha,a.worldAlpha*c.alpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,8,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer)):(e=d.shaderManager.primitiveShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform1f(e.alpha,a.worldAlpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,24,0),f.vertexAttribPointer(e.colorAttribute,4,f.FLOAT,!1,24,8),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer))},b.WebGLStencilManager.prototype.popStencil=function(a,b,c){var d=this.gl;if(this.stencilStack.pop(),this.count--,0===this.stencilStack.length)d.disable(d.STENCIL_TEST);else{var e=this.count;this.bindGraphics(a,b,c),d.colorMask(!1,!1,!1,!1),1===b.mode?(this.reverse=!this.reverse,this.reverse?(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)):(this.reverse?(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP)}},b.WebGLStencilManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLShaderManager=function(a){this.maxAttibs=10,this.attribState=[],this.tempAttribState=[],this.shaderMap=[];for(var b=0;b<this.maxAttibs;b++)this.attribState[b]=!1;this.setContext(a)},b.WebGLShaderManager.prototype.setContext=function(a){this.gl=a,this.primitiveShader=new b.PrimitiveShader(a),this.complexPrimativeShader=new b.ComplexPrimitiveShader(a),this.defaultShader=new b.PixiShader(a),this.fastShader=new b.PixiFastShader(a),this.stripShader=new b.StripShader(a),this.setShader(this.defaultShader)},b.WebGLShaderManager.prototype.setAttribs=function(a){var b;for(b=0;b<this.tempAttribState.length;b++)this.tempAttribState[b]=!1;for(b=0;b<a.length;b++){var c=a[b];this.tempAttribState[c]=!0}var d=this.gl;for(b=0;b<this.attribState.length;b++)this.attribState[b]!==this.tempAttribState[b]&&(this.attribState[b]=this.tempAttribState[b],this.tempAttribState[b]?d.enableVertexAttribArray(b):d.disableVertexAttribArray(b))},b.WebGLShaderManager.prototype.setShader=function(a){return this._currentId===a._UID?!1:(this._currentId=a._UID,this.currentShader=a,this.gl.useProgram(a.program),this.setAttribs(a.attributes),!0)},b.WebGLShaderManager.prototype.destroy=function(){this.attribState=null,this.tempAttribState=null,this.primitiveShader.destroy(),this.defaultShader.destroy(),this.fastShader.destroy(),this.stripShader.destroy(),this.gl=null},b.WebGLSpriteBatch=function(a){this.vertSize=6,this.size=2e3;var b=4*this.size*this.vertSize,c=6*this.size;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.setContext(a),this.dirty=!0,this.textures=[],this.blendModes=[]},b.WebGLSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW),this.currentBlendMode=99999},b.WebGLSpriteBatch.prototype.begin=function(a){this.renderSession=a,this.shader=this.renderSession.shaderManager.defaultShader,this.start()},b.WebGLSpriteBatch.prototype.end=function(){this.flush()},b.WebGLSpriteBatch.prototype.render=function(a){var b=a.texture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=b.baseTexture);var c=b._uvs;if(c){var d,e,f,g,h=a.worldAlpha,i=a.tint,j=this.vertices,k=a.anchor.x,l=a.anchor.y;if(b.trim){var m=b.trim;e=m.x-k*m.width,d=e+b.crop.width,g=m.y-l*m.height,f=g+b.crop.height}else d=b.frame.width*(1-k),e=b.frame.width*-k,f=b.frame.height*(1-l),g=b.frame.height*-l;var n=4*this.currentBatchSize*this.vertSize,o=a.worldTransform,p=o.a,q=o.c,r=o.b,s=o.d,t=o.tx,u=o.ty;j[n++]=p*e+r*g+t,j[n++]=s*g+q*e+u,j[n++]=c.x0,j[n++]=c.y0,j[n++]=h,j[n++]=i,j[n++]=p*d+r*g+t,j[n++]=s*g+q*d+u,j[n++]=c.x1,j[n++]=c.y1,j[n++]=h,j[n++]=i,j[n++]=p*d+r*f+t,j[n++]=s*f+q*d+u,j[n++]=c.x2,j[n++]=c.y2,j[n++]=h,j[n++]=i,j[n++]=p*e+r*f+t,j[n++]=s*f+q*e+u,j[n++]=c.x3,j[n++]=c.y3,j[n++]=h,j[n++]=i,this.textures[this.currentBatchSize]=a.texture.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++}},b.WebGLSpriteBatch.prototype.renderTilingSprite=function(a){var c=a.tilingTexture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=c.baseTexture),a._uvs||(a._uvs=new b.TextureUvs);var d=a._uvs;a.tilePosition.x%=c.baseTexture.width*a.tileScaleOffset.x,a.tilePosition.y%=c.baseTexture.height*a.tileScaleOffset.y;var e=a.tilePosition.x/(c.baseTexture.width*a.tileScaleOffset.x),f=a.tilePosition.y/(c.baseTexture.height*a.tileScaleOffset.y),g=a.width/c.baseTexture.width/(a.tileScale.x*a.tileScaleOffset.x),h=a.height/c.baseTexture.height/(a.tileScale.y*a.tileScaleOffset.y);d.x0=0-e,d.y0=0-f,d.x1=1*g-e,d.y1=0-f,d.x2=1*g-e,d.y2=1*h-f,d.x3=0-e,d.y3=1*h-f;var i=a.worldAlpha,j=a.tint,k=this.vertices,l=a.width,m=a.height,n=a.anchor.x,o=a.anchor.y,p=l*(1-n),q=l*-n,r=m*(1-o),s=m*-o,t=4*this.currentBatchSize*this.vertSize,u=a.worldTransform,v=u.a,w=u.c,x=u.b,y=u.d,z=u.tx,A=u.ty;k[t++]=v*q+x*s+z,k[t++]=y*s+w*q+A,k[t++]=d.x0,k[t++]=d.y0,k[t++]=i,k[t++]=j,k[t++]=v*p+x*s+z,k[t++]=y*s+w*p+A,k[t++]=d.x1,k[t++]=d.y1,k[t++]=i,k[t++]=j,k[t++]=v*p+x*r+z,k[t++]=y*r+w*p+A,k[t++]=d.x2,k[t++]=d.y2,k[t++]=i,k[t++]=j,k[t++]=v*q+x*r+z,k[t++]=y*r+w*q+A,k[t++]=d.x3,k[t++]=d.y3,k[t++]=i,k[t++]=j,this.textures[this.currentBatchSize]=c.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++},b.WebGLSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.renderSession.shaderManager.setShader(this.renderSession.shaderManager.defaultShader),this.dirty){this.dirty=!1,a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.colorAttribute,2,a.FLOAT,!1,c,16)}if(this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var d=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,d)}for(var e,f,g=0,h=0,i=null,j=this.renderSession.blendModeManager.currentBlendMode,k=0,l=this.currentBatchSize;l>k;k++)e=this.textures[k],f=this.blendModes[k],(i!==e||j!==f)&&(this.renderBatch(i,g,h),h=k,g=0,i=e,j=f,this.renderSession.blendModeManager.setBlendMode(j)),g++;this.renderBatch(i,g,h),this.currentBatchSize=0}},b.WebGLSpriteBatch.prototype.renderBatch=function(a,c,d){if(0!==c){var e=this.gl;e.bindTexture(e.TEXTURE_2D,a._glTextures[e.id]||b.createWebGLTexture(a,e)),a._dirty[e.id]&&b.updateWebGLTexture(this.currentBaseTexture,e),e.drawElements(e.TRIANGLES,6*c,e.UNSIGNED_SHORT,6*d*2),this.renderSession.drawCount++}},b.WebGLSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLSpriteBatch.prototype.start=function(){this.dirty=!0},b.WebGLSpriteBatch.prototype.destroy=function(){this.vertices=null,this.indices=null,this.gl.deleteBuffer(this.vertexBuffer),this.gl.deleteBuffer(this.indexBuffer),this.currentBaseTexture=null,this.gl=null},b.WebGLFastSpriteBatch=function(a){this.vertSize=10,this.maxSize=6e3,this.size=this.maxSize;var b=4*this.size*this.vertSize,c=6*this.maxSize;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.vertexBuffer=null,this.indexBuffer=null,this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.currentBlendMode=0,this.renderSession=null,this.shader=null,this.matrix=null,this.setContext(a)},b.WebGLFastSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW)},b.WebGLFastSpriteBatch.prototype.begin=function(a,b){this.renderSession=b,this.shader=this.renderSession.shaderManager.fastShader,this.matrix=a.worldTransform.toArray(!0),this.start()},b.WebGLFastSpriteBatch.prototype.end=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.render=function(a){var b=a.children,c=b[0];if(c.texture._uvs){this.currentBaseTexture=c.texture.baseTexture,c.blendMode!==this.renderSession.blendModeManager.currentBlendMode&&(this.flush(),this.renderSession.blendModeManager.setBlendMode(c.blendMode));for(var d=0,e=b.length;e>d;d++)this.renderSprite(b[d]);this.flush()}},b.WebGLFastSpriteBatch.prototype.renderSprite=function(a){if(a.visible&&(a.texture.baseTexture===this.currentBaseTexture||(this.flush(),this.currentBaseTexture=a.texture.baseTexture,a.texture._uvs))){var b,c,d,e,f,g,h,i,j=this.vertices;if(b=a.texture._uvs,c=a.texture.frame.width,d=a.texture.frame.height,a.texture.trim){var k=a.texture.trim;f=k.x-a.anchor.x*k.width,e=f+a.texture.crop.width,h=k.y-a.anchor.y*k.height,g=h+a.texture.crop.height}else e=a.texture.frame.width*(1-a.anchor.x),f=a.texture.frame.width*-a.anchor.x,g=a.texture.frame.height*(1-a.anchor.y),h=a.texture.frame.height*-a.anchor.y;i=4*this.currentBatchSize*this.vertSize,j[i++]=f,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x0,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x1,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x2,j[i++]=b.y2,j[i++]=a.alpha,j[i++]=f,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x3,j[i++]=b.y3,j[i++]=a.alpha,this.currentBatchSize++,this.currentBatchSize>=this.size&&this.flush()}},b.WebGLFastSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.currentBaseTexture._glTextures[a.id]||b.createWebGLTexture(this.currentBaseTexture,a),a.bindTexture(a.TEXTURE_2D,this.currentBaseTexture._glTextures[a.id]),this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var c=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,c)}a.drawElements(a.TRIANGLES,6*this.currentBatchSize,a.UNSIGNED_SHORT,0),this.currentBatchSize=0,this.renderSession.drawCount++}},b.WebGLFastSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.start=function(){var a=this.gl;a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y),a.uniformMatrix3fv(this.shader.uMatrix,!1,this.matrix);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aPositionCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.aScale,2,a.FLOAT,!1,c,16),a.vertexAttribPointer(this.shader.aRotation,1,a.FLOAT,!1,c,24),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,28),a.vertexAttribPointer(this.shader.colorAttribute,1,a.FLOAT,!1,c,36)},b.WebGLFilterManager=function(a,b){this.transparent=b,this.filterStack=[],this.offsetX=0,this.offsetY=0,this.setContext(a)},b.WebGLFilterManager.prototype.setContext=function(a){this.gl=a,this.texturePool=[],this.initShaderBuffers()},b.WebGLFilterManager.prototype.begin=function(a,b){this.renderSession=a,this.defaultShader=a.shaderManager.defaultShader;var c=this.renderSession.projection;this.width=2*c.x,this.height=2*-c.y,this.buffer=b},b.WebGLFilterManager.prototype.pushFilter=function(a){var c=this.gl,d=this.renderSession.projection,e=this.renderSession.offset;a._filterArea=a.target.filterArea||a.target.getBounds(),this.filterStack.push(a);var f=a.filterPasses[0];this.offsetX+=a._filterArea.x,this.offsetY+=a._filterArea.y;var g=this.texturePool.pop();g?g.resize(this.width,this.height):g=new b.FilterTexture(this.gl,this.width,this.height),c.bindTexture(c.TEXTURE_2D,g.texture);var h=a._filterArea,i=f.padding;h.x-=i,h.y-=i,h.width+=2*i,h.height+=2*i,h.x<0&&(h.x=0),h.width>this.width&&(h.width=this.width),h.y<0&&(h.y=0),h.height>this.height&&(h.height=this.height),c.bindFramebuffer(c.FRAMEBUFFER,g.frameBuffer),c.viewport(0,0,h.width,h.height),d.x=h.width/2,d.y=-h.height/2,e.x=-h.x,e.y=-h.y,this.renderSession.shaderManager.setShader(this.defaultShader),c.uniform2f(this.defaultShader.projectionVector,h.width/2,-h.height/2),c.uniform2f(this.defaultShader.offsetVector,-h.x,-h.y),c.colorMask(!0,!0,!0,!0),c.clearColor(0,0,0,0),c.clear(c.COLOR_BUFFER_BIT),a._glFilterTexture=g},b.WebGLFilterManager.prototype.popFilter=function(){var a=this.gl,c=this.filterStack.pop(),d=c._filterArea,e=c._glFilterTexture,f=this.renderSession.projection,g=this.renderSession.offset;if(c.filterPasses.length>1){a.viewport(0,0,d.width,d.height),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=0,this.vertexArray[1]=d.height,this.vertexArray[2]=d.width,this.vertexArray[3]=d.height,this.vertexArray[4]=0,this.vertexArray[5]=0,this.vertexArray[6]=d.width,this.vertexArray[7]=0,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray);var h=e,i=this.texturePool.pop();i||(i=new b.FilterTexture(this.gl,this.width,this.height)),i.resize(this.width,this.height),a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.clear(a.COLOR_BUFFER_BIT),a.disable(a.BLEND);for(var j=0;j<c.filterPasses.length-1;j++){var k=c.filterPasses[j];a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,h.texture),this.applyFilterPass(k,d,d.width,d.height);var l=h;h=i,i=l}a.enable(a.BLEND),e=h,this.texturePool.push(i)}var m=c.filterPasses[c.filterPasses.length-1];this.offsetX-=d.x,this.offsetY-=d.y;var n=this.width,o=this.height,p=0,q=0,r=this.buffer;if(0===this.filterStack.length)a.colorMask(!0,!0,!0,!0);else{var s=this.filterStack[this.filterStack.length-1];d=s._filterArea,n=d.width,o=d.height,p=d.x,q=d.y,r=s._glFilterTexture.frameBuffer}f.x=n/2,f.y=-o/2,g.x=p,g.y=q,d=c._filterArea;var t=d.x-p,u=d.y-q;a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=t,this.vertexArray[1]=u+d.height,this.vertexArray[2]=t+d.width,this.vertexArray[3]=u+d.height,this.vertexArray[4]=t,this.vertexArray[5]=u,this.vertexArray[6]=t+d.width,this.vertexArray[7]=u,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray),a.viewport(0,0,n,o),a.bindFramebuffer(a.FRAMEBUFFER,r),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e.texture),this.applyFilterPass(m,d,n,o),this.renderSession.shaderManager.setShader(this.defaultShader),a.uniform2f(this.defaultShader.projectionVector,n/2,-o/2),a.uniform2f(this.defaultShader.offsetVector,-p,-q),this.texturePool.push(e),c._glFilterTexture=null},b.WebGLFilterManager.prototype.applyFilterPass=function(a,c,d,e){var f=this.gl,g=a.shaders[f.id];g||(g=new b.PixiShader(f),g.fragmentSrc=a.fragmentSrc,g.uniforms=a.uniforms,g.init(),a.shaders[f.id]=g),this.renderSession.shaderManager.setShader(g),f.uniform2f(g.projectionVector,d/2,-e/2),f.uniform2f(g.offsetVector,0,0),a.uniforms.dimensions&&(a.uniforms.dimensions.value[0]=this.width,a.uniforms.dimensions.value[1]=this.height,a.uniforms.dimensions.value[2]=this.vertexArray[0],a.uniforms.dimensions.value[3]=this.vertexArray[5]),g.syncUniforms(),f.bindBuffer(f.ARRAY_BUFFER,this.vertexBuffer),f.vertexAttribPointer(g.aVertexPosition,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.uvBuffer),f.vertexAttribPointer(g.aTextureCoord,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.colorBuffer),f.vertexAttribPointer(g.colorAttribute,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,this.indexBuffer),f.drawElements(f.TRIANGLES,6,f.UNSIGNED_SHORT,0),this.renderSession.drawCount++},b.WebGLFilterManager.prototype.initShaderBuffers=function(){var a=this.gl;this.vertexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.colorBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.vertexArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertexArray,a.STATIC_DRAW),this.uvArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),a.bufferData(a.ARRAY_BUFFER,this.uvArray,a.STATIC_DRAW),this.colorArray=new Float32Array([1,16777215,1,16777215,1,16777215,1,16777215]),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,this.colorArray,a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,3,2]),a.STATIC_DRAW)},b.WebGLFilterManager.prototype.destroy=function(){var a=this.gl;this.filterStack=null,this.offsetX=0,this.offsetY=0;for(var b=0;b<this.texturePool.length;b++)this.texturePool[b].destroy();this.texturePool=null,a.deleteBuffer(this.vertexBuffer),a.deleteBuffer(this.uvBuffer),a.deleteBuffer(this.colorBuffer),a.deleteBuffer(this.indexBuffer)},b.FilterTexture=function(a,c,d,e){this.gl=a,this.frameBuffer=a.createFramebuffer(),this.texture=a.createTexture(),e=e||b.scaleModes.DEFAULT,a.bindTexture(a.TEXTURE_2D,this.texture),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer),a.bindFramebuffer(a.FRAMEBUFFER,this.frameBuffer),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.renderBuffer=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,this.renderBuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,this.renderBuffer),this.resize(c,d)},b.FilterTexture.prototype.clear=function(){var a=this.gl;a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)},b.FilterTexture.prototype.resize=function(a,b){if(this.width!==a||this.height!==b){this.width=a,this.height=b;var c=this.gl;c.bindTexture(c.TEXTURE_2D,this.texture),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,a,b,0,c.RGBA,c.UNSIGNED_BYTE,null),c.bindRenderbuffer(c.RENDERBUFFER,this.renderBuffer),c.renderbufferStorage(c.RENDERBUFFER,c.DEPTH_STENCIL,a,b)}},b.FilterTexture.prototype.destroy=function(){var a=this.gl;a.deleteFramebuffer(this.frameBuffer),a.deleteTexture(this.texture),this.frameBuffer=null,this.texture=null},b.CanvasMaskManager=function(){},b.CanvasMaskManager.prototype.pushMask=function(a,c){c.save();var d=a.alpha,e=a.worldTransform;c.setTransform(e.a,e.c,e.b,e.d,e.tx,e.ty),b.CanvasGraphics.renderGraphicsMask(a,c),c.clip(),a.worldAlpha=d},b.CanvasMaskManager.prototype.popMask=function(a){a.restore()},b.CanvasTinter=function(){},b.CanvasTinter.getTintedTexture=function(a,c){var d=a.texture;c=b.CanvasTinter.roundColor(c);var e="#"+("00000"+(0|c).toString(16)).substr(-6);if(d.tintCache=d.tintCache||{},d.tintCache[e])return d.tintCache[e];var f=b.CanvasTinter.canvas||document.createElement("canvas");if(b.CanvasTinter.tintMethod(d,c,f),b.CanvasTinter.convertTintToImage){var g=new Image;g.src=f.toDataURL(),d.tintCache[e]=g}else d.tintCache[e]=f,b.CanvasTinter.canvas=null;return f},b.CanvasTinter.tintWithMultiply=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="multiply",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithOverlay=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.globalCompositeOperation="copy",d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithPerPixel=function(a,c,d){var e=d.getContext("2d"),f=a.frame;d.width=f.width,d.height=f.height,e.globalCompositeOperation="copy",e.drawImage(a.baseTexture.source,f.x,f.y,f.width,f.height,0,0,f.width,f.height);for(var g=b.hex2rgb(c),h=g[0],i=g[1],j=g[2],k=e.getImageData(0,0,f.width,f.height),l=k.data,m=0;m<l.length;m+=4)l[m+0]*=h,l[m+1]*=i,l[m+2]*=j;e.putImageData(k,0,0)},b.CanvasTinter.roundColor=function(a){var c=b.CanvasTinter.cacheStepsPerColorChannel,d=b.hex2rgb(a);return d[0]=Math.min(255,d[0]/c*c),d[1]=Math.min(255,d[1]/c*c),d[2]=Math.min(255,d[2]/c*c),b.rgb2hex(d)},b.CanvasTinter.cacheStepsPerColorChannel=8,b.CanvasTinter.convertTintToImage=!1,b.CanvasTinter.canUseMultiply=b.canUseNewCanvasBlendModes(),b.CanvasTinter.tintMethod=b.CanvasTinter.canUseMultiply?b.CanvasTinter.tintWithMultiply:b.CanvasTinter.tintWithPerPixel,b.CanvasRenderer=function(a,c,d,e){b.defaultRenderer||(b.sayHello("Canvas"),b.defaultRenderer=this),this.type=b.CANVAS_RENDERER,this.clearBeforeRender=!0,this.transparent=!!e,b.blendModesCanvas||(b.blendModesCanvas=[],b.canUseNewCanvasBlendModes()?(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="multiply",b.blendModesCanvas[b.blendModes.SCREEN]="screen",b.blendModesCanvas[b.blendModes.OVERLAY]="overlay",b.blendModesCanvas[b.blendModes.DARKEN]="darken",b.blendModesCanvas[b.blendModes.LIGHTEN]="lighten",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="color-dodge",b.blendModesCanvas[b.blendModes.COLOR_BURN]="color-burn",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="hard-light",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="soft-light",b.blendModesCanvas[b.blendModes.DIFFERENCE]="difference",b.blendModesCanvas[b.blendModes.EXCLUSION]="exclusion",b.blendModesCanvas[b.blendModes.HUE]="hue",b.blendModesCanvas[b.blendModes.SATURATION]="saturation",b.blendModesCanvas[b.blendModes.COLOR]="color",b.blendModesCanvas[b.blendModes.LUMINOSITY]="luminosity"):(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="source-over",b.blendModesCanvas[b.blendModes.SCREEN]="source-over",b.blendModesCanvas[b.blendModes.OVERLAY]="source-over",b.blendModesCanvas[b.blendModes.DARKEN]="source-over",b.blendModesCanvas[b.blendModes.LIGHTEN]="source-over",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="source-over",b.blendModesCanvas[b.blendModes.COLOR_BURN]="source-over",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.DIFFERENCE]="source-over",b.blendModesCanvas[b.blendModes.EXCLUSION]="source-over",b.blendModesCanvas[b.blendModes.HUE]="source-over",b.blendModesCanvas[b.blendModes.SATURATION]="source-over",b.blendModesCanvas[b.blendModes.COLOR]="source-over",b.blendModesCanvas[b.blendModes.LUMINOSITY]="source-over")),this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.context=this.view.getContext("2d",{alpha:this.transparent}),this.refresh=!0,this.view.width=this.width,this.view.height=this.height,this.count=0,this.maskManager=new b.CanvasMaskManager,this.renderSession={context:this.context,maskManager:this.maskManager,scaleMode:null,smoothProperty:null,roundPixels:!1},"imageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context&&(this.renderSession.smoothProperty="oImageSmoothingEnabled")},b.CanvasRenderer.prototype.constructor=b.CanvasRenderer,b.CanvasRenderer.prototype.render=function(a){b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,a.updateTransform(),this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,navigator.isCocoonJS&&this.view.screencanvas&&(this.context.fillStyle="black",this.context.clear()),!this.transparent&&this.clearBeforeRender?(this.context.fillStyle=a.backgroundColorString,this.context.fillRect(0,0,this.width,this.height)):this.transparent&&this.clearBeforeRender&&this.context.clearRect(0,0,this.width,this.height),this.renderDisplayObject(a),a.interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this))),b.Texture.frameUpdates.length>0&&(b.Texture.frameUpdates.length=0)
},b.CanvasRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b},b.CanvasRenderer.prototype.renderDisplayObject=function(a,b){this.renderSession.context=b||this.context,a._renderCanvas(this.renderSession)},b.CanvasRenderer.prototype.renderStripFlat=function(a){var b=this.context,c=a.verticies,d=c.length/2;this.count++,b.beginPath();for(var e=1;d-2>e;e++){var f=2*e,g=c[f],h=c[f+2],i=c[f+4],j=c[f+1],k=c[f+3],l=c[f+5];b.moveTo(g,j),b.lineTo(h,k),b.lineTo(i,l)}b.fillStyle="#FF0000",b.fill(),b.closePath()},b.CanvasRenderer.prototype.renderStrip=function(a){var b=this.context,c=a.verticies,d=a.uvs,e=c.length/2;this.count++;for(var f=1;e-2>f;f++){var g=2*f,h=c[g],i=c[g+2],j=c[g+4],k=c[g+1],l=c[g+3],m=c[g+5],n=d[g]*a.texture.width,o=d[g+2]*a.texture.width,p=d[g+4]*a.texture.width,q=d[g+1]*a.texture.height,r=d[g+3]*a.texture.height,s=d[g+5]*a.texture.height;b.save(),b.beginPath(),b.moveTo(h,k),b.lineTo(i,l),b.lineTo(j,m),b.closePath(),b.clip();var t=n*r+q*p+o*s-r*p-q*o-n*s,u=h*r+q*j+i*s-r*j-q*i-h*s,v=n*i+h*p+o*j-i*p-h*o-n*j,w=n*r*j+q*i*p+h*o*s-h*r*p-q*o*j-n*i*s,x=k*r+q*m+l*s-r*m-q*l-k*s,y=n*l+k*p+o*m-l*p-k*o-n*m,z=n*r*m+q*l*p+k*o*s-k*r*p-q*o*m-n*l*s;b.transform(u/t,x/t,v/t,y/t,w/t,z/t),b.drawImage(a.texture.baseTexture.source,0,0),b.restore()}},b.CanvasBuffer=function(a,b){this.width=a,this.height=b,this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.width=a,this.canvas.height=b},b.CanvasBuffer.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},b.CanvasBuffer.prototype.resize=function(a,b){this.width=this.canvas.width=a,this.height=this.canvas.height=b},b.CanvasGraphics=function(){},b.CanvasGraphics.renderGraphics=function(a,c){for(var d=a.worldAlpha,e="",f=0;f<a.graphicsData.length;f++){var g=a.graphicsData[f],h=g.points;if(c.strokeStyle=e="#"+("00000"+(0|g.lineColor).toString(16)).substr(-6),c.lineWidth=g.lineWidth,g.type===b.Graphics.POLY){c.beginPath(),c.moveTo(h[0],h[1]);for(var i=1;i<h.length/2;i++)c.lineTo(h[2*i],h[2*i+1]);h[0]===h[h.length-2]&&h[1]===h[h.length-1]&&c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RECT)(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fillRect(h[0],h[1],h[2],h[3])),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.strokeRect(h[0],h[1],h[2],h[3]));else if(g.type===b.Graphics.CIRC)c.beginPath(),c.arc(h[0],h[1],h[2],0,2*Math.PI),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke());else if(g.type===b.Graphics.ELIP){var j=g.points,k=2*j[2],l=2*j[3],m=j[0]-k/2,n=j[1]-l/2;c.beginPath();var o=.5522848,p=k/2*o,q=l/2*o,r=m+k,s=n+l,t=m+k/2,u=n+l/2;c.moveTo(m,u),c.bezierCurveTo(m,u-q,t-p,n,t,n),c.bezierCurveTo(t+p,n,r,u-q,r,u),c.bezierCurveTo(r,u+q,t+p,s,t,s),c.bezierCurveTo(t-p,s,m,u+q,m,u),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RREC){var v=h[0],w=h[1],x=h[2],y=h[3],z=h[4],A=Math.min(x,y)/2|0;z=z>A?A:z,c.beginPath(),c.moveTo(v,w+z),c.lineTo(v,w+y-z),c.quadraticCurveTo(v,w+y,v+z,w+y),c.lineTo(v+x-z,w+y),c.quadraticCurveTo(v+x,w+y,v+x,w+y-z),c.lineTo(v+x,w+z),c.quadraticCurveTo(v+x,w,v+x-z,w),c.lineTo(v+z,w),c.quadraticCurveTo(v,w,v,w+z),c.closePath(),(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}}},b.CanvasGraphics.renderGraphicsMask=function(a,c){var d=a.graphicsData.length;if(0!==d){d>1&&(d=1,window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));for(var e=0;1>e;e++){var f=a.graphicsData[e],g=f.points;if(f.type===b.Graphics.POLY){c.beginPath(),c.moveTo(g[0],g[1]);for(var h=1;h<g.length/2;h++)c.lineTo(g[2*h],g[2*h+1]);g[0]===g[g.length-2]&&g[1]===g[g.length-1]&&c.closePath()}else if(f.type===b.Graphics.RECT)c.beginPath(),c.rect(g[0],g[1],g[2],g[3]),c.closePath();else if(f.type===b.Graphics.CIRC)c.beginPath(),c.arc(g[0],g[1],g[2],0,2*Math.PI),c.closePath();else if(f.type===b.Graphics.ELIP){var i=f.points,j=2*i[2],k=2*i[3],l=i[0]-j/2,m=i[1]-k/2;c.beginPath();var n=.5522848,o=j/2*n,p=k/2*n,q=l+j,r=m+k,s=l+j/2,t=m+k/2;c.moveTo(l,t),c.bezierCurveTo(l,t-p,s-o,m,s,m),c.bezierCurveTo(s+o,m,q,t-p,q,t),c.bezierCurveTo(q,t+p,s+o,r,s,r),c.bezierCurveTo(s-o,r,l,t+p,l,t),c.closePath()}else if(f.type===b.Graphics.RREC){var u=g[0],v=g[1],w=g[2],x=g[3],y=g[4],z=Math.min(w,x)/2|0;y=y>z?z:y,c.beginPath(),c.moveTo(u,v+y),c.lineTo(u,v+x-y),c.quadraticCurveTo(u,v+x,u+y,v+x),c.lineTo(u+w-y,v+x),c.quadraticCurveTo(u+w,v+x,u+w,v+x-y),c.lineTo(u+w,v+y),c.quadraticCurveTo(u+w,v,u+w-y,v),c.lineTo(u+y,v),c.quadraticCurveTo(u,v,u,v+y),c.closePath()}}}},b.Graphics=function(){b.DisplayObjectContainer.call(this),this.renderable=!0,this.fillAlpha=1,this.lineWidth=0,this.lineColor="black",this.graphicsData=[],this.tint=16777215,this.blendMode=b.blendModes.NORMAL,this.currentPath={points:[]},this._webGL=[],this.isMask=!1,this.bounds=null,this.boundsPadding=10,this.dirty=!0},b.Graphics.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Graphics.prototype.constructor=b.Graphics,Object.defineProperty(b.Graphics.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap=a,this._cacheAsBitmap?this._generateCachedSprite():(this.destroyCachedSprite(),this.dirty=!0)}}),b.Graphics.prototype.lineStyle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.lineWidth=a||0,this.lineColor=c||0,this.lineAlpha=arguments.length<3?1:d,this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.moveTo=function(a,c){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.currentPath.points.push(a,c),this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.lineTo=function(a,b){return this.currentPath.points.push(a,b),this.dirty=!0,this},b.Graphics.prototype.quadraticCurveTo=function(a,b,c,d){0===this.currentPath.points.length&&this.moveTo(0,0);var e,f,g=20,h=this.currentPath.points;0===h.length&&this.moveTo(0,0);for(var i=h[h.length-2],j=h[h.length-1],k=0,l=1;g>=l;l++)k=l/g,e=i+(a-i)*k,f=j+(b-j)*k,h.push(e+(a+(c-a)*k-e)*k,f+(b+(d-b)*k-f)*k);return this.dirty=!0,this},b.Graphics.prototype.bezierCurveTo=function(a,b,c,d,e,f){0===this.currentPath.points.length&&this.moveTo(0,0);for(var g,h,i,j,k,l=20,m=this.currentPath.points,n=m[m.length-2],o=m[m.length-1],p=0,q=1;l>q;q++)p=q/l,g=1-p,h=g*g,i=h*g,j=p*p,k=j*p,m.push(i*n+3*h*p*a+3*g*j*c+k*e,i*o+3*h*p*b+3*g*j*d+k*f);return this.dirty=!0,this},b.Graphics.prototype.arcTo=function(a,b,c,d,e){0===this.currentPath.points.length&&this.moveTo(a,b);var f=this.currentPath.points,g=f[f.length-2],h=f[f.length-1],i=h-b,j=g-a,k=d-b,l=c-a,m=Math.abs(i*l-j*k);if(1e-8>m||0===e)f.push(a,b);else{var n=i*i+j*j,o=k*k+l*l,p=i*k+j*l,q=e*Math.sqrt(n)/m,r=e*Math.sqrt(o)/m,s=q*p/n,t=r*p/o,u=q*l+r*j,v=q*k+r*i,w=j*(r+s),x=i*(r+s),y=l*(q+t),z=k*(q+t),A=Math.atan2(x-v,w-u),B=Math.atan2(z-v,y-u);this.arc(u+a,v+b,e,A,B,j*k>l*i)}return this.dirty=!0,this},b.Graphics.prototype.arc=function(a,b,c,d,e,f){var g=a+Math.cos(d)*c,h=b+Math.sin(d)*c,i=this.currentPath.points;if((0!==i.length&&i[i.length-2]!==g||i[i.length-1]!==h)&&(this.moveTo(g,h),i=this.currentPath.points),d===e)return this;!f&&d>=e?e+=2*Math.PI:f&&e>=d&&(d+=2*Math.PI);var j=f?-1*(d-e):e-d,k=Math.abs(j)/(2*Math.PI)*40;if(0===j)return this;for(var l=j/(2*k),m=2*l,n=Math.cos(l),o=Math.sin(l),p=k-1,q=p%1/p,r=0;p>=r;r++){var s=r+q*r,t=l+d+m*s,u=Math.cos(t),v=-Math.sin(t);i.push((n*u+o*v)*c+a,(n*-v+o*u)*c+b)}return this.dirty=!0,this},b.Graphics.prototype.drawPath=function(a){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this.currentPath.points=this.currentPath.points.concat(a),this.dirty=!0,this},b.Graphics.prototype.beginFill=function(a,b){return this.filling=!0,this.fillColor=a||0,this.fillAlpha=arguments.length<2?1:b,this},b.Graphics.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},b.Graphics.prototype.drawRect=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.RECT},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawRoundedRect=function(a,c,d,e,f){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e,f],type:b.Graphics.RREC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawCircle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,d],type:b.Graphics.CIRC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawEllipse=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.ELIP},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.clear=function(){return this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this.bounds=null,this},b.Graphics.prototype.generateTexture=function(){var a=this.getBounds(),c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);return c.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,c.context),d},b.Graphics.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){if(this._cacheAsBitmap)return this.dirty&&(this._generateCachedSprite(),b.updateWebGLTexture(this._cachedSprite.texture.baseTexture,a.gl),this.dirty=!1),this._cachedSprite.alpha=this.alpha,b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a),void 0;if(a.spriteBatch.stop(),a.blendModeManager.setBlendMode(this.blendMode),this._mask&&a.maskManager.pushMask(this._mask,a),this._filters&&a.filterManager.pushFilter(this._filterBlock),this.blendMode!==a.spriteBatch.currentBlendMode){a.spriteBatch.currentBlendMode=this.blendMode;var c=b.blendModesWebGL[a.spriteBatch.currentBlendMode];a.spriteBatch.gl.blendFunc(c[0],c[1])}if(b.WebGLGraphics.renderGraphics(this,a),this.children.length){a.spriteBatch.start();for(var d=0,e=this.children.length;e>d;d++)this.children[d]._renderWebGL(a);a.spriteBatch.stop()}this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(this.mask,a),a.drawCount++,a.spriteBatch.start()}},b.Graphics.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){var c=a.context,d=this.worldTransform;this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),b.CanvasGraphics.renderGraphics(this,c);for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Graphics.prototype.getBounds=function(a){this.bounds||this.updateBounds();var b=this.bounds.x,c=this.bounds.width+this.bounds.x,d=this.bounds.y,e=this.bounds.height+this.bounds.y,f=a||this.worldTransform,g=f.a,h=f.c,i=f.b,j=f.d,k=f.tx,l=f.ty,m=g*c+i*e+k,n=j*e+h*c+l,o=g*b+i*e+k,p=j*e+h*b+l,q=g*b+i*d+k,r=j*d+h*b+l,s=g*c+i*d+k,t=j*d+h*c+l,u=m,v=n,w=m,x=n;w=w>o?o:w,w=w>q?q:w,w=w>s?s:w,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,u=o>u?o:u,u=q>u?q:u,u=s>u?s:u,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v;var y=this._bounds;return y.x=w,y.width=u-w,y.y=x,y.height=v-x,y},b.Graphics.prototype.updateBounds=function(){for(var a,c,d,e,f,g=1/0,h=-1/0,i=1/0,j=-1/0,k=0;k<this.graphicsData.length;k++){var l=this.graphicsData[k],m=l.type,n=l.lineWidth;if(a=l.points,m===b.Graphics.RECT)c=a[0]-n/2,d=a[1]-n/2,e=a[2]+n,f=a[3]+n,g=g>c?c:g,h=c+e>h?c+e:h,i=i>d?c:i,j=d+f>j?d+f:j;else if(m===b.Graphics.CIRC||m===b.Graphics.ELIP)c=a[0],d=a[1],e=a[2]+n/2,f=a[3]+n/2,g=g>c-e?c-e:g,h=c+e>h?c+e:h,i=i>d-f?d-f:i,j=d+f>j?d+f:j;else for(var o=0;o<a.length;o+=2)c=a[o],d=a[o+1],g=g>c-n?c-n:g,h=c+n>h?c+n:h,i=i>d-n?d-n:i,j=d+n>j?d+n:j}var p=this.boundsPadding;this.bounds=new b.Rectangle(g-p,i-p,h-g+2*p,j-i+2*p)},b.Graphics.prototype._generateCachedSprite=function(){var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.buffer.resize(a.width,a.height);else{var c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);this._cachedSprite=new b.Sprite(d),this._cachedSprite.buffer=c,this._cachedSprite.worldTransform=this.worldTransform}this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._cachedSprite.buffer.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,this._cachedSprite.buffer.context),this._cachedSprite.alpha=this.alpha},b.Graphics.prototype.destroyCachedSprite=function(){this._cachedSprite.texture.destroy(!0),this._cachedSprite=null},b.Graphics.POLY=0,b.Graphics.RECT=1,b.Graphics.CIRC=2,b.Graphics.ELIP=3,b.Graphics.RREC=4,b.Strip=function(a){b.DisplayObjectContainer.call(this),this.texture=a,this.uvs=new b.Float32Array([0,1,1,1,1,0,0,1]),this.verticies=new b.Float32Array([0,0,100,0,100,100,0,100]),this.colors=new b.Float32Array([1,1,1,1]),this.indices=new b.Uint16Array([0,1,2,3]),this.dirty=!0},b.Strip.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Strip.prototype.constructor=b.Strip,b.Strip.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||(a.spriteBatch.stop(),this._vertexBuffer||this._initWebGL(a),a.shaderManager.setShader(a.shaderManager.stripShader),this._renderStrip(a),a.spriteBatch.start())},b.Strip.prototype._initWebGL=function(a){var b=a.gl;this._vertexBuffer=b.createBuffer(),this._indexBuffer=b.createBuffer(),this._uvBuffer=b.createBuffer(),this._colorBuffer=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,this._vertexBuffer),b.bufferData(b.ARRAY_BUFFER,this.verticies,b.DYNAMIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._uvBuffer),b.bufferData(b.ARRAY_BUFFER,this.uvs,b.STATIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._colorBuffer),b.bufferData(b.ARRAY_BUFFER,this.colors,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,this._indexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,this.indices,b.STATIC_DRAW)},b.Strip.prototype._renderStrip=function(a){var c=a.gl,d=a.projection,e=a.offset,f=a.shaderManager.stripShader;c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.uniformMatrix3fv(f.translationMatrix,!1,this.worldTransform.toArray(!0)),c.uniform2f(f.projectionVector,d.x,-d.y),c.uniform2f(f.offsetVector,-e.x,-e.y),c.uniform1f(f.alpha,1),this.dirty?(this.dirty=!1,c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferData(c.ARRAY_BUFFER,this.verticies,c.STATIC_DRAW),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.bufferData(c.ARRAY_BUFFER,this.uvs,c.STATIC_DRAW),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer),c.bufferData(c.ELEMENT_ARRAY_BUFFER,this.indices,c.STATIC_DRAW)):(c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,this.verticies),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer)),c.drawElements(c.TRIANGLE_STRIP,this.indices.length,c.UNSIGNED_SHORT,0)},b.Strip.prototype._renderCanvas=function(a){var b=a.context,c=this.worldTransform;a.roundPixels?b.setTransform(c.a,c.c,c.b,c.d,0|c.tx,0|c.ty):b.setTransform(c.a,c.c,c.b,c.d,c.tx,c.ty);var d=this,e=d.verticies,f=d.uvs,g=e.length/2;this.count++;for(var h=0;g-2>h;h++){var i=2*h,j=e[i],k=e[i+2],l=e[i+4],m=e[i+1],n=e[i+3],o=e[i+5],p=(j+k+l)/3,q=(m+n+o)/3,r=j-p,s=m-q,t=Math.sqrt(r*r+s*s);j=p+r/t*(t+3),m=q+s/t*(t+3),r=k-p,s=n-q,t=Math.sqrt(r*r+s*s),k=p+r/t*(t+3),n=q+s/t*(t+3),r=l-p,s=o-q,t=Math.sqrt(r*r+s*s),l=p+r/t*(t+3),o=q+s/t*(t+3);var u=f[i]*d.texture.width,v=f[i+2]*d.texture.width,w=f[i+4]*d.texture.width,x=f[i+1]*d.texture.height,y=f[i+3]*d.texture.height,z=f[i+5]*d.texture.height;b.save(),b.beginPath(),b.moveTo(j,m),b.lineTo(k,n),b.lineTo(l,o),b.closePath(),b.clip();var A=u*y+x*w+v*z-y*w-x*v-u*z,B=j*y+x*l+k*z-y*l-x*k-j*z,C=u*k+j*w+v*l-k*w-j*v-u*l,D=u*y*l+x*k*w+j*v*z-j*y*w-x*v*l-u*k*z,E=m*y+x*o+n*z-y*o-x*n-m*z,F=u*n+m*w+v*o-n*w-m*v-u*o,G=u*y*o+x*n*w+m*v*z-m*y*w-x*v*o-u*n*z;b.transform(B/A,E/A,C/A,F/A,D/A,G/A),b.drawImage(d.texture.baseTexture.source,0,0),b.restore()}},b.Strip.prototype.onTextureUpdate=function(){this.updateFrame=!0},b.Rope=function(a,c){b.Strip.call(this,a),this.points=c,this.verticies=new b.Float32Array(4*c.length),this.uvs=new b.Float32Array(4*c.length),this.colors=new b.Float32Array(2*c.length),this.indices=new b.Uint16Array(2*c.length),this.refresh()},b.Rope.prototype=Object.create(b.Strip.prototype),b.Rope.prototype.constructor=b.Rope,b.Rope.prototype.refresh=function(){var a=this.points;if(!(a.length<1)){var b=this.uvs,c=a[0],d=this.indices,e=this.colors;this.count-=.2,b[0]=0,b[1]=0,b[2]=0,b[3]=1,e[0]=1,e[1]=1,d[0]=0,d[1]=1;for(var f,g,h,i=a.length,j=1;i>j;j++)f=a[j],g=4*j,h=j/(i-1),j%2?(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1):(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1),g=2*j,e[g]=1,e[g+1]=1,g=2*j,d[g]=g,d[g+1]=g+1,c=f}},b.Rope.prototype.updateTransform=function(){var a=this.points;if(!(a.length<1)){var c,d=a[0],e={x:0,y:0};this.count-=.2;for(var f,g,h,i,j,k=this.verticies,l=a.length,m=0;l>m;m++)f=a[m],g=4*m,c=m<a.length-1?a[m+1]:f,e.y=-(c.x-d.x),e.x=c.y-d.y,h=10*(1-m/(l-1)),h>1&&(h=1),i=Math.sqrt(e.x*e.x+e.y*e.y),j=this.texture.height/2,e.x/=i,e.y/=i,e.x*=j,e.y*=j,k[g]=f.x+e.x,k[g+1]=f.y+e.y,k[g+2]=f.x-e.x,k[g+3]=f.y-e.y,d=f;b.DisplayObjectContainer.prototype.updateTransform.call(this)}},b.Rope.prototype.setTexture=function(a){this.texture=a},b.TilingSprite=function(a,c,d){b.Sprite.call(this,a),this._width=c||100,this._height=d||100,this.tileScale=new b.Point(1,1),this.tileScaleOffset=new b.Point(1,1),this.tilePosition=new b.Point(0,0),this.renderable=!0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL},b.TilingSprite.prototype=Object.create(b.Sprite.prototype),b.TilingSprite.prototype.constructor=b.TilingSprite,Object.defineProperty(b.TilingSprite.prototype,"width",{get:function(){return this._width},set:function(a){this._width=a}}),Object.defineProperty(b.TilingSprite.prototype,"height",{get:function(){return this._height},set:function(a){this._height=a}}),b.TilingSprite.prototype.setTexture=function(a){this.texture!==a&&(this.texture=a,this.refreshTexture=!0,this.cachedTint=16777215)},b.TilingSprite.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha){var c,d;for(this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),!this.tilingTexture||this.refreshTexture?(this.generateTilingTexture(!0),this.tilingTexture&&this.tilingTexture.needsUpdate&&(b.updateWebGLTexture(this.tilingTexture.baseTexture,a.gl),this.tilingTexture.needsUpdate=!1)):a.spriteBatch.renderTilingSprite(this),c=0,d=this.children.length;d>c;c++)this.children[c]._renderWebGL(a);a.spriteBatch.stop(),this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(a),a.spriteBatch.start()}},b.TilingSprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){var c=a.context;this._mask&&a.maskManager.pushMask(this._mask,c),c.globalAlpha=this.worldAlpha;var d,e,f=this.worldTransform;if(c.setTransform(f.a,f.c,f.b,f.d,f.tx,f.ty),!this.__tilePattern||this.refreshTexture){if(this.generateTilingTexture(!1),!this.tilingTexture)return;this.__tilePattern=c.createPattern(this.tilingTexture.baseTexture.source,"repeat")}this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]);var g=this.tilePosition,h=this.tileScale;for(g.x%=this.tilingTexture.baseTexture.width,g.y%=this.tilingTexture.baseTexture.height,c.scale(h.x,h.y),c.translate(g.x,g.y),c.fillStyle=this.__tilePattern,c.fillRect(-g.x+this.anchor.x*-this._width,-g.y+this.anchor.y*-this._height,this._width/h.x,this._height/h.y),c.scale(1/h.x,1/h.y),c.translate(-g.x,-g.y),this._mask&&a.maskManager.popMask(a.context),d=0,e=this.children.length;e>d;d++)this.children[d]._renderCanvas(a)}},b.TilingSprite.prototype.getBounds=function(){var a=this._width,b=this._height,c=a*(1-this.anchor.x),d=a*-this.anchor.x,e=b*(1-this.anchor.y),f=b*-this.anchor.y,g=this.worldTransform,h=g.a,i=g.c,j=g.b,k=g.d,l=g.tx,m=g.ty,n=h*d+j*f+l,o=k*f+i*d+m,p=h*c+j*f+l,q=k*f+i*c+m,r=h*c+j*e+l,s=k*e+i*c+m,t=h*d+j*e+l,u=k*e+i*d+m,v=-1/0,w=-1/0,x=1/0,y=1/0;x=x>n?n:x,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,v=n>v?n:v,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w;var z=this._bounds;return z.x=x,z.width=v-x,z.y=y,z.height=w-y,this._currentBounds=z,z},b.TilingSprite.prototype.onTextureUpdate=function(){},b.TilingSprite.prototype.generateTilingTexture=function(a){if(this.texture.baseTexture.hasLoaded){var c,d,e=this.texture,f=e.frame,g=f.width!==e.baseTexture.width||f.height!==e.baseTexture.height,h=!1;if(a?(c=b.getNextPowerOfTwo(f.width),d=b.getNextPowerOfTwo(f.height),(f.width!==c||f.height!==d)&&(h=!0)):g&&(c=f.width,d=f.height,h=!0),h){var i;this.tilingTexture&&this.tilingTexture.isTiling?(i=this.tilingTexture.canvasBuffer,i.resize(c,d),this.tilingTexture.baseTexture.width=c,this.tilingTexture.baseTexture.height=d,this.tilingTexture.needsUpdate=!0):(i=new b.CanvasBuffer(c,d),this.tilingTexture=b.Texture.fromCanvas(i.canvas),this.tilingTexture.canvasBuffer=i,this.tilingTexture.isTiling=!0),i.context.drawImage(e.baseTexture.source,e.crop.x,e.crop.y,e.crop.width,e.crop.height,0,0,c,d),this.tileScaleOffset.x=f.width/c,this.tileScaleOffset.y=f.height/d}else this.tilingTexture&&this.tilingTexture.isTiling&&this.tilingTexture.destroy(!0),this.tileScaleOffset.x=1,this.tileScaleOffset.y=1,this.tilingTexture=e;this.refreshTexture=!1,this.tilingTexture.baseTexture._powerOf2=!0}};var f={};f.BoneData=function(a,b){this.name=a,this.parent=b},f.BoneData.prototype={length:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1},f.SlotData=function(a,b){this.name=a,this.boneData=b},f.SlotData.prototype={r:1,g:1,b:1,a:1,attachmentName:null},f.Bone=function(a,b){this.data=a,this.parent=b,this.setToSetupPose()},f.Bone.yDown=!1,f.Bone.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,m00:0,m01:0,worldX:0,m10:0,m11:0,worldY:0,worldRotation:0,worldScaleX:1,worldScaleY:1,updateWorldTransform:function(a,b){var c=this.parent;null!=c?(this.worldX=this.x*c.m00+this.y*c.m01+c.worldX,this.worldY=this.x*c.m10+this.y*c.m11+c.worldY,this.worldScaleX=c.worldScaleX*this.scaleX,this.worldScaleY=c.worldScaleY*this.scaleY,this.worldRotation=c.worldRotation+this.rotation):(this.worldX=this.x,this.worldY=this.y,this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY,this.worldRotation=this.rotation);var d=this.worldRotation*Math.PI/180,e=Math.cos(d),g=Math.sin(d);this.m00=e*this.worldScaleX,this.m10=g*this.worldScaleX,this.m01=-g*this.worldScaleY,this.m11=e*this.worldScaleY,a&&(this.m00=-this.m00,this.m01=-this.m01),b&&(this.m10=-this.m10,this.m11=-this.m11),f.Bone.yDown&&(this.m10=-this.m10,this.m11=-this.m11)},setToSetupPose:function(){var a=this.data;this.x=a.x,this.y=a.y,this.rotation=a.rotation,this.scaleX=a.scaleX,this.scaleY=a.scaleY}},f.Slot=function(a,b,c){this.data=a,this.skeleton=b,this.bone=c,this.setToSetupPose()},f.Slot.prototype={r:1,g:1,b:1,a:1,_attachmentTime:0,attachment:null,setAttachment:function(a){this.attachment=a,this._attachmentTime=this.skeleton.time},setAttachmentTime:function(a){this._attachmentTime=this.skeleton.time-a},getAttachmentTime:function(){return this.skeleton.time-this._attachmentTime},setToSetupPose:function(){var a=this.data;this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a;for(var b=this.skeleton.data.slots,c=0,d=b.length;d>c;c++)if(b[c]==a){this.setAttachment(a.attachmentName?this.skeleton.getAttachmentBySlotIndex(c,a.attachmentName):null);break}}},f.Skin=function(a){this.name=a,this.attachments={}},f.Skin.prototype={addAttachment:function(a,b,c){this.attachments[a+":"+b]=c},getAttachment:function(a,b){return this.attachments[a+":"+b]},_attachAll:function(a,b){for(var c in b.attachments){var d=c.indexOf(":"),e=parseInt(c.substring(0,d),10),f=c.substring(d+1),g=a.slots[e];if(g.attachment&&g.attachment.name==f){var h=this.getAttachment(e,f);h&&g.setAttachment(h)}}}},f.Animation=function(a,b,c){this.name=a,this.timelines=b,this.duration=c},f.Animation.prototype={apply:function(a,b,c){c&&this.duration&&(b%=this.duration);for(var d=this.timelines,e=0,f=d.length;f>e;e++)d[e].apply(a,b,1)},mix:function(a,b,c,d){c&&this.duration&&(b%=this.duration);for(var e=this.timelines,f=0,g=e.length;g>f;f++)e[f].apply(a,b,d)}},f.binarySearch=function(a,b,c){var d=0,e=Math.floor(a.length/c)-2;if(!e)return c;for(var f=e>>>1;;){if(a[(f+1)*c]<=b?d=f+1:e=f,d==e)return(d+1)*c;f=d+e>>>1}},f.linearSearch=function(a,b,c){for(var d=0,e=a.length-c;e>=d;d+=c)if(a[d]>b)return d;return-1},f.Curves=function(a){this.curves=[],this.curves.length=6*(a-1)},f.Curves.prototype={setLinear:function(a){this.curves[6*a]=0},setStepped:function(a){this.curves[6*a]=-1},setCurve:function(a,b,c,d,e){var f=.1,g=f*f,h=g*f,i=3*f,j=3*g,k=6*g,l=6*h,m=2*-b+d,n=2*-c+e,o=3*(b-d)+1,p=3*(c-e)+1,q=6*a,r=this.curves;r[q]=b*i+m*j+o*h,r[q+1]=c*i+n*j+p*h,r[q+2]=m*k+o*l,r[q+3]=n*k+p*l,r[q+4]=o*l,r[q+5]=p*l},getCurvePercent:function(a,b){b=0>b?0:b>1?1:b;var c=6*a,d=this.curves,e=d[c];if(!e)return b;if(-1==e)return 0;for(var f=d[c+1],g=d[c+2],h=d[c+3],i=d[c+4],j=d[c+5],k=e,l=f,m=8;;){if(k>=b){var n=k-e,o=l-f;return o+(l-o)*(b-n)/(k-n)}if(!m)break;m--,e+=g,f+=h,g+=i,h+=j,k+=e,l+=f}return l+(1-l)*(b-k)/(1-k)}},f.RotateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=2*a},f.RotateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c){a*=2,this.frames[a]=b,this.frames[a+1]=c},apply:function(a,b,c){var d,e=this.frames;if(!(b<e[0])){var g=a.bones[this.boneIndex];if(b>=e[e.length-2]){for(d=g.data.rotation+e[e.length-1]-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;return g.rotation+=d*c,void 0}var h=f.binarySearch(e,b,2),i=e[h-1],j=e[h],k=1-(b-j)/(e[h-2]-j);for(k=this.curves.getCurvePercent(h/2-1,k),d=e[h+1]-i;d>180;)d-=360;for(;-180>d;)d+=360;for(d=g.data.rotation+(i+d*k)-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;g.rotation+=d*c}}},f.TranslateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.TranslateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.x+=(e.data.x+d[d.length-2]-e.x)*c,e.y+=(e.data.y+d[d.length-1]-e.y)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.x+=(e.data.x+h+(d[g+1]-h)*k-e.x)*c,e.y+=(e.data.y+i+(d[g+2]-i)*k-e.y)*c}}},f.ScaleTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.ScaleTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.scaleX+=(e.data.scaleX-1+d[d.length-2]-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+d[d.length-1]-e.scaleY)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.scaleX+=(e.data.scaleX-1+h+(d[g+1]-h)*k-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+i+(d[g+2]-i)*k-e.scaleY)*c}}},f.ColorTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=5*a},f.ColorTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length/5},setFrame:function(a,b,c,d,e,f){a*=5,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d,this.frames[a+3]=e,this.frames[a+4]=f},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.slots[this.slotIndex];if(b>=d[d.length-5]){var g=d.length-1;return e.r=d[g-3],e.g=d[g-2],e.b=d[g-1],e.a=d[g],void 0}var h=f.binarySearch(d,b,5),i=d[h-4],j=d[h-3],k=d[h-2],l=d[h-1],m=d[h],n=1-(b-m)/(d[h-5]-m);n=this.curves.getCurvePercent(h/5-1,n);var o=i+(d[h+1]-i)*n,p=j+(d[h+2]-j)*n,q=k+(d[h+3]-k)*n,r=l+(d[h+4]-l)*n;1>c?(e.r+=(o-e.r)*c,e.g+=(p-e.g)*c,e.b+=(q-e.b)*c,e.a+=(r-e.a)*c):(e.r=o,e.g=p,e.b=q,e.a=r)}}},f.AttachmentTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=a,this.attachmentNames=[],this.attachmentNames.length=a},f.AttachmentTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b,this.attachmentNames[a]=c},apply:function(a,b){var c=this.frames;if(!(b<c[0])){var d;d=b>=c[c.length-1]?c.length-1:f.binarySearch(c,b,1)-1;var e=this.attachmentNames[d];a.slots[this.slotIndex].setAttachment(e?a.getAttachmentBySlotIndex(this.slotIndex,e):null)}}},f.SkeletonData=function(){this.bones=[],this.slots=[],this.skins=[],this.animations=[]},f.SkeletonData.prototype={defaultSkin:null,findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return slot[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSkin:function(a){for(var b=this.skins,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findAnimation:function(a){for(var b=this.animations,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null}},f.Skeleton=function(a){this.data=a,this.bones=[];
for(var b=0,c=a.bones.length;c>b;b++){var d=a.bones[b],e=d.parent?this.bones[a.bones.indexOf(d.parent)]:null;this.bones.push(new f.Bone(d,e))}for(this.slots=[],this.drawOrder=[],b=0,c=a.slots.length;c>b;b++){var g=a.slots[b],h=this.bones[a.bones.indexOf(g.boneData)],i=new f.Slot(g,this,h);this.slots.push(i),this.drawOrder.push(i)}},f.Skeleton.prototype={x:0,y:0,skin:null,r:1,g:1,b:1,a:1,time:0,flipX:!1,flipY:!1,updateWorldTransform:function(){for(var a=this.flipX,b=this.flipY,c=this.bones,d=0,e=c.length;e>d;d++)c[d].updateWorldTransform(a,b)},setToSetupPose:function(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()},setBonesToSetupPose:function(){for(var a=this.bones,b=0,c=a.length;c>b;b++)a[b].setToSetupPose()},setSlotsToSetupPose:function(){for(var a=this.slots,b=0,c=a.length;c>b;b++)a[b].setToSetupPose(b)},getRootBone:function(){return this.bones.length?this.bones[0]:null},findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},setSkinByName:function(a){var b=this.data.findSkin(a);if(!b)throw"Skin not found: "+a;this.setSkin(b)},setSkin:function(a){this.skin&&a&&a._attachAll(this,this.skin),this.skin=a},getAttachmentBySlotName:function(a,b){return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a),b)},getAttachmentBySlotIndex:function(a,b){if(this.skin){var c=this.skin.getAttachment(a,b);if(c)return c}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(a,b):null},setAttachment:function(a,b){for(var c=this.slots,d=0,e=c.size;e>d;d++){var f=c[d];if(f.data.name==a){var g=null;if(b&&(g=this.getAttachment(d,b),null==g))throw"Attachment not found: "+b+", for slot: "+a;return f.setAttachment(g),void 0}}throw"Slot not found: "+a},update:function(a){time+=a}},f.AttachmentType={region:0},f.RegionAttachment=function(){this.offset=[],this.offset.length=8,this.uvs=[],this.uvs.length=8},f.RegionAttachment.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,width:0,height:0,rendererObject:null,regionOffsetX:0,regionOffsetY:0,regionWidth:0,regionHeight:0,regionOriginalWidth:0,regionOriginalHeight:0,setUVs:function(a,b,c,d,e){var f=this.uvs;e?(f[2]=a,f[3]=d,f[4]=a,f[5]=b,f[6]=c,f[7]=b,f[0]=c,f[1]=d):(f[0]=a,f[1]=d,f[2]=a,f[3]=b,f[4]=c,f[5]=b,f[6]=c,f[7]=d)},updateOffset:function(){var a=this.width/this.regionOriginalWidth*this.scaleX,b=this.height/this.regionOriginalHeight*this.scaleY,c=-this.width/2*this.scaleX+this.regionOffsetX*a,d=-this.height/2*this.scaleY+this.regionOffsetY*b,e=c+this.regionWidth*a,f=d+this.regionHeight*b,g=this.rotation*Math.PI/180,h=Math.cos(g),i=Math.sin(g),j=c*h+this.x,k=c*i,l=d*h+this.y,m=d*i,n=e*h+this.x,o=e*i,p=f*h+this.y,q=f*i,r=this.offset;r[0]=j-m,r[1]=l+k,r[2]=j-q,r[3]=p+k,r[4]=n-q,r[5]=p+o,r[6]=n-m,r[7]=l+o},computeVertices:function(a,b,c,d){a+=c.worldX,b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10,h=c.m11,i=this.offset;d[0]=i[0]*e+i[1]*f+a,d[1]=i[0]*g+i[1]*h+b,d[2]=i[2]*e+i[3]*f+a,d[3]=i[2]*g+i[3]*h+b,d[4]=i[4]*e+i[5]*f+a,d[5]=i[4]*g+i[5]*h+b,d[6]=i[6]*e+i[7]*f+a,d[7]=i[6]*g+i[7]*h+b}},f.AnimationStateData=function(a){this.skeletonData=a,this.animationToMixTime={}},f.AnimationStateData.prototype={defaultMix:0,setMixByName:function(a,b,c){var d=this.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;var e=this.skeletonData.findAnimation(b);if(!e)throw"Animation not found: "+b;this.setMix(d,e,c)},setMix:function(a,b,c){this.animationToMixTime[a.name+":"+b.name]=c},getMix:function(a,b){var c=this.animationToMixTime[a.name+":"+b.name];return c?c:this.defaultMix}},f.AnimationState=function(a){this.data=a,this.queue=[]},f.AnimationState.prototype={animationSpeed:1,current:null,previous:null,currentTime:0,previousTime:0,currentLoop:!1,previousLoop:!1,mixTime:0,mixDuration:0,update:function(a){if(this.currentTime+=a*this.animationSpeed,this.previousTime+=a,this.mixTime+=a,this.queue.length>0){var b=this.queue[0];this.currentTime>=b.delay&&(this._setAnimation(b.animation,b.loop),this.queue.shift())}},apply:function(a){if(this.current)if(this.previous){this.previous.apply(a,this.previousTime,this.previousLoop);var b=this.mixTime/this.mixDuration;b>=1&&(b=1,this.previous=null),this.current.mix(a,this.currentTime,this.currentLoop,b)}else this.current.apply(a,this.currentTime,this.currentLoop)},clearAnimation:function(){this.previous=null,this.current=null,this.queue.length=0},_setAnimation:function(a,b){this.previous=null,a&&this.current&&(this.mixDuration=this.data.getMix(this.current,a),this.mixDuration>0&&(this.mixTime=0,this.previous=this.current,this.previousTime=this.currentTime,this.previousLoop=this.currentLoop)),this.current=a,this.currentLoop=b,this.currentTime=0},setAnimationByName:function(a,b){var c=this.data.skeletonData.findAnimation(a);if(!c)throw"Animation not found: "+a;this.setAnimation(c,b)},setAnimation:function(a,b){this.queue.length=0,this._setAnimation(a,b)},addAnimationByName:function(a,b,c){var d=this.data.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;this.addAnimation(d,b,c)},addAnimation:function(a,b,c){var d={};if(d.animation=a,d.loop=b,!c||0>=c){var e=this.queue.length?this.queue[this.queue.length-1].animation:this.current;c=null!=e?e.duration-this.data.getMix(e,a)+(c||0):0}d.delay=c,this.queue.push(d)},isComplete:function(){return!this.current||this.currentTime>=this.current.duration}},f.SkeletonJson=function(a){this.attachmentLoader=a},f.SkeletonJson.prototype={scale:1,readSkeletonData:function(a){for(var b,c=new f.SkeletonData,d=a.bones,e=0,g=d.length;g>e;e++){var h=d[e],i=null;if(h.parent&&(i=c.findBone(h.parent),!i))throw"Parent bone not found: "+h.parent;b=new f.BoneData(h.name,i),b.length=(h.length||0)*this.scale,b.x=(h.x||0)*this.scale,b.y=(h.y||0)*this.scale,b.rotation=h.rotation||0,b.scaleX=h.scaleX||1,b.scaleY=h.scaleY||1,c.bones.push(b)}var j=a.slots;for(e=0,g=j.length;g>e;e++){var k=j[e];if(b=c.findBone(k.bone),!b)throw"Slot bone not found: "+k.bone;var l=new f.SlotData(k.name,b),m=k.color;m&&(l.r=f.SkeletonJson.toColor(m,0),l.g=f.SkeletonJson.toColor(m,1),l.b=f.SkeletonJson.toColor(m,2),l.a=f.SkeletonJson.toColor(m,3)),l.attachmentName=k.attachment,c.slots.push(l)}var n=a.skins;for(var o in n)if(n.hasOwnProperty(o)){var p=n[o],q=new f.Skin(o);for(var r in p)if(p.hasOwnProperty(r)){var s=c.findSlotIndex(r),t=p[r];for(var u in t)if(t.hasOwnProperty(u)){var v=this.readAttachment(q,u,t[u]);null!=v&&q.addAttachment(s,u,v)}}c.skins.push(q),"default"==q.name&&(c.defaultSkin=q)}var w=a.animations;for(var x in w)w.hasOwnProperty(x)&&this.readAnimation(x,w[x],c);return c},readAttachment:function(a,b,c){b=c.name||b;var d=f.AttachmentType[c.type||"region"];if(d==f.AttachmentType.region){var e=new f.RegionAttachment;return e.x=(c.x||0)*this.scale,e.y=(c.y||0)*this.scale,e.scaleX=c.scaleX||1,e.scaleY=c.scaleY||1,e.rotation=c.rotation||0,e.width=(c.width||32)*this.scale,e.height=(c.height||32)*this.scale,e.updateOffset(),e.rendererObject={},e.rendererObject.name=b,e.rendererObject.scale={},e.rendererObject.scale.x=e.scaleX,e.rendererObject.scale.y=e.scaleY,e.rendererObject.rotation=-e.rotation*Math.PI/180,e}throw"Unknown attachment type: "+d},readAnimation:function(a,b,c){var d,e,g,h,i,j,k,l=[],m=0,n=b.bones;for(var o in n)if(n.hasOwnProperty(o)){var p=c.findBoneIndex(o);if(-1==p)throw"Bone not found: "+o;var q=n[o];for(g in q)if(q.hasOwnProperty(g))if(i=q[g],"rotate"==g){for(e=new f.RotateTimeline(i.length),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d,h.time,h.angle),f.SkeletonJson.readCurve(e,d,h),d++;l.push(e),m=Math.max(m,e.frames[2*e.getFrameCount()-2])}else{if("translate"!=g&&"scale"!=g)throw"Invalid timeline type for a bone: "+g+" ("+o+")";var r=1;for("scale"==g?e=new f.ScaleTimeline(i.length):(e=new f.TranslateTimeline(i.length),r=this.scale),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++){h=i[j];var s=(h.x||0)*r,t=(h.y||0)*r;e.setFrame(d,h.time,s,t),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[3*e.getFrameCount()-3])}}var u=b.slots;for(var v in u)if(u.hasOwnProperty(v)){var w=u[v],x=c.findSlotIndex(v);for(g in w)if(w.hasOwnProperty(g))if(i=w[g],"color"==g){for(e=new f.ColorTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++){h=i[j];var y=h.color,z=f.SkeletonJson.toColor(y,0),A=f.SkeletonJson.toColor(y,1),B=f.SkeletonJson.toColor(y,2),C=f.SkeletonJson.toColor(y,3);e.setFrame(d,h.time,z,A,B,C),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[5*e.getFrameCount()-5])}else{if("attachment"!=g)throw"Invalid timeline type for a slot: "+g+" ("+v+")";for(e=new f.AttachmentTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d++,h.time,h.name);l.push(e),m=Math.max(m,e.frames[e.getFrameCount()-1])}}c.animations.push(new f.Animation(a,l,m))}},f.SkeletonJson.readCurve=function(a,b,c){var d=c.curve;d&&("stepped"==d?a.curves.setStepped(b):d instanceof Array&&a.curves.setCurve(b,d[0],d[1],d[2],d[3]))},f.SkeletonJson.toColor=function(a,b){if(8!=a.length)throw"Color hexidecimal length must be 8, recieved: "+a;return parseInt(a.substr(2*b,2),16)/255},f.Atlas=function(a,b){this.textureLoader=b,this.pages=[],this.regions=[];var c=new f.AtlasReader(a),d=[];d.length=4;for(var e=null;;){var g=c.readLine();if(null==g)break;if(g=c.trim(g),g.length)if(e){var h=new f.AtlasRegion;h.name=g,h.page=e,h.rotate="true"==c.readValue(),c.readTuple(d);var i=parseInt(d[0],10),j=parseInt(d[1],10);c.readTuple(d);var k=parseInt(d[0],10),l=parseInt(d[1],10);h.u=i/e.width,h.v=j/e.height,h.rotate?(h.u2=(i+l)/e.width,h.v2=(j+k)/e.height):(h.u2=(i+k)/e.width,h.v2=(j+l)/e.height),h.x=i,h.y=j,h.width=Math.abs(k),h.height=Math.abs(l),4==c.readTuple(d)&&(h.splits=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],4==c.readTuple(d)&&(h.pads=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],c.readTuple(d))),h.originalWidth=parseInt(d[0],10),h.originalHeight=parseInt(d[1],10),c.readTuple(d),h.offsetX=parseInt(d[0],10),h.offsetY=parseInt(d[1],10),h.index=parseInt(c.readValue(),10),this.regions.push(h)}else{e=new f.AtlasPage,e.name=g,e.format=f.Atlas.Format[c.readValue()],c.readTuple(d),e.minFilter=f.Atlas.TextureFilter[d[0]],e.magFilter=f.Atlas.TextureFilter[d[1]];var m=c.readValue();e.uWrap=f.Atlas.TextureWrap.clampToEdge,e.vWrap=f.Atlas.TextureWrap.clampToEdge,"x"==m?e.uWrap=f.Atlas.TextureWrap.repeat:"y"==m?e.vWrap=f.Atlas.TextureWrap.repeat:"xy"==m&&(e.uWrap=e.vWrap=f.Atlas.TextureWrap.repeat),b.load(e,g),this.pages.push(e)}else e=null}},f.Atlas.prototype={findRegion:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},dispose:function(){for(var a=this.pages,b=0,c=a.length;c>b;b++)this.textureLoader.unload(a[b].rendererObject)},updateUVs:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++){var e=b[c];e.page==a&&(e.u=e.x/a.width,e.v=e.y/a.height,e.rotate?(e.u2=(e.x+e.height)/a.width,e.v2=(e.y+e.width)/a.height):(e.u2=(e.x+e.width)/a.width,e.v2=(e.y+e.height)/a.height))}}},f.Atlas.Format={alpha:0,intensity:1,luminanceAlpha:2,rgb565:3,rgba4444:4,rgb888:5,rgba8888:6},f.Atlas.TextureFilter={nearest:0,linear:1,mipMap:2,mipMapNearestNearest:3,mipMapLinearNearest:4,mipMapNearestLinear:5,mipMapLinearLinear:6},f.Atlas.TextureWrap={mirroredRepeat:0,clampToEdge:1,repeat:2},f.AtlasPage=function(){},f.AtlasPage.prototype={name:null,format:null,minFilter:null,magFilter:null,uWrap:null,vWrap:null,rendererObject:null,width:0,height:0},f.AtlasRegion=function(){},f.AtlasRegion.prototype={page:null,name:null,x:0,y:0,width:0,height:0,u:0,v:0,u2:0,v2:0,offsetX:0,offsetY:0,originalWidth:0,originalHeight:0,index:0,rotate:!1,splits:null,pads:null},f.AtlasReader=function(a){this.lines=a.split(/\r\n|\r|\n/)},f.AtlasReader.prototype={index:0,trim:function(a){return a.replace(/^\s+|\s+$/g,"")},readLine:function(){return this.index>=this.lines.length?null:this.lines[this.index++]},readValue:function(){var a=this.readLine(),b=a.indexOf(":");if(-1==b)throw"Invalid line: "+a;return this.trim(a.substring(b+1))},readTuple:function(a){var b=this.readLine(),c=b.indexOf(":");if(-1==c)throw"Invalid line: "+b;for(var d=0,e=c+1;3>d;d++){var f=b.indexOf(",",e);if(-1==f){if(!d)throw"Invalid line: "+b;break}a[d]=this.trim(b.substr(e,f-e)),e=f+1}return a[d]=this.trim(b.substring(e)),d+1}},f.AtlasAttachmentLoader=function(a){this.atlas=a},f.AtlasAttachmentLoader.prototype={newAttachment:function(a,b,c){switch(b){case f.AttachmentType.region:var d=this.atlas.findRegion(c);if(!d)throw"Region not found in atlas: "+c+" ("+b+")";var e=new f.RegionAttachment(c);return e.rendererObject=d,e.setUVs(d.u,d.v,d.u2,d.v2,d.rotate),e.regionOffsetX=d.offsetX,e.regionOffsetY=d.offsetY,e.regionWidth=d.width,e.regionHeight=d.height,e.regionOriginalWidth=d.originalWidth,e.regionOriginalHeight=d.originalHeight,e}throw"Unknown attachment type: "+b}},f.Bone.yDown=!0,b.AnimCache={},b.Spine=function(a){if(b.DisplayObjectContainer.call(this),this.spineData=b.AnimCache[a],!this.spineData)throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: "+a);this.skeleton=new f.Skeleton(this.spineData),this.skeleton.updateWorldTransform(),this.stateData=new f.AnimationStateData(this.spineData),this.state=new f.AnimationState(this.stateData),this.slotContainers=[];for(var c=0,d=this.skeleton.drawOrder.length;d>c;c++){var e=this.skeleton.drawOrder[c],g=e.attachment,h=new b.DisplayObjectContainer;if(this.slotContainers.push(h),this.addChild(h),g instanceof f.RegionAttachment){var i=g.rendererObject.name,j=this.createSprite(e,g.rendererObject);e.currentSprite=j,e.currentSpriteName=i,h.addChild(j)}}},b.Spine.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Spine.prototype.constructor=b.Spine,b.Spine.prototype.updateTransform=function(){this.lastTime=this.lastTime||Date.now();var a=.001*(Date.now()-this.lastTime);this.lastTime=Date.now(),this.state.update(a),this.state.apply(this.skeleton),this.skeleton.updateWorldTransform();for(var c=this.skeleton.drawOrder,d=0,e=c.length;e>d;d++){var g=c[d],h=g.attachment,i=this.slotContainers[d];if(h instanceof f.RegionAttachment){if(h.rendererObject&&(!g.currentSpriteName||g.currentSpriteName!=h.name)){var j=h.rendererObject.name;if(void 0!==g.currentSprite&&(g.currentSprite.visible=!1),g.sprites=g.sprites||{},void 0!==g.sprites[j])g.sprites[j].visible=!0;else{var k=this.createSprite(g,h.rendererObject);i.addChild(k)}g.currentSprite=g.sprites[j],g.currentSpriteName=j}i.visible=!0;var l=g.bone;i.position.x=l.worldX+h.x*l.m00+h.y*l.m01,i.position.y=l.worldY+h.x*l.m10+h.y*l.m11,i.scale.x=l.worldScaleX,i.scale.y=l.worldScaleY,i.rotation=-(g.bone.worldRotation*Math.PI/180),i.alpha=g.a,g.currentSprite.tint=b.rgb2hex([g.r,g.g,g.b])}else i.visible=!1}b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.Spine.prototype.createSprite=function(a,c){var d=b.TextureCache[c.name]?c.name:c.name+".png",e=new b.Sprite(b.Texture.fromFrame(d));return e.scale=c.scale,e.rotation=c.rotation,e.anchor.x=e.anchor.y=.5,a.sprites=a.sprites||{},a.sprites[c.name]=e,e},b.BaseTextureCache={},b.texturesToUpdate=[],b.texturesToDestroy=[],b.BaseTextureCacheIdGenerator=0,b.BaseTexture=function(a,c){if(b.EventTarget.call(this),this.width=100,this.height=100,this.scaleMode=c||b.scaleModes.DEFAULT,this.hasLoaded=!1,this.source=a,this.id=b.BaseTextureCacheIdGenerator++,this.premultipliedAlpha=!0,this._glTextures=[],this._dirty=[],a){if((this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)this.hasLoaded=!0,this.width=this.source.width,this.height=this.source.height,b.texturesToUpdate.push(this);else{var d=this;this.source.onload=function(){d.hasLoaded=!0,d.width=d.source.width,d.height=d.source.height;for(var a=0;a<d._glTextures.length;a++)d._dirty[a]=!0;d.dispatchEvent({type:"loaded",content:d})},this.source.onerror=function(){d.dispatchEvent({type:"error",content:d})}}this.imageUrl=null,this._powerOf2=!1}},b.BaseTexture.prototype.constructor=b.BaseTexture,b.BaseTexture.prototype.destroy=function(){this.imageUrl?(delete b.BaseTextureCache[this.imageUrl],delete b.TextureCache[this.imageUrl],this.imageUrl=null,this.source.src=null):this.source&&this.source._pixiId&&delete b.BaseTextureCache[this.source._pixiId],this.source=null,b.texturesToDestroy.push(this)},b.BaseTexture.prototype.updateSourceImage=function(a){this.hasLoaded=!1,this.source.src=null,this.source.src=a},b.BaseTexture.fromImage=function(a,c,d){var e=b.BaseTextureCache[a];if(void 0===c&&-1===a.indexOf("data:")&&(c=!0),!e){var f=new Image;c&&(f.crossOrigin=""),f.src=a,e=new b.BaseTexture(f,d),e.imageUrl=a,b.BaseTextureCache[a]=e}return e},b.BaseTexture.fromCanvas=function(a,c){a._pixiId||(a._pixiId="canvas_"+b.TextureCacheIdGenerator++);var d=b.BaseTextureCache[a._pixiId];return d||(d=new b.BaseTexture(a,c),b.BaseTextureCache[a._pixiId]=d),d},b.TextureCache={},b.FrameCache={},b.TextureCacheIdGenerator=0,b.Texture=function(a,c){if(b.EventTarget.call(this),this.noFrame=!1,c||(this.noFrame=!0,c=new b.Rectangle(0,0,1,1)),a instanceof b.Texture&&(a=a.baseTexture),this.baseTexture=a,this.frame=c,this.trim=null,this.valid=!1,this.scope=this,this._uvs=null,this.width=0,this.height=0,this.crop=new b.Rectangle(0,0,1,1),a.hasLoaded)this.noFrame&&(c=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(c);else{var d=this;a.addEventListener("loaded",function(){d.onBaseTextureLoaded()})}},b.Texture.prototype.constructor=b.Texture,b.Texture.prototype.onBaseTextureLoaded=function(){var a=this.baseTexture;a.removeEventListener("loaded",this.onLoaded),this.noFrame&&(this.frame=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(this.frame),this.scope.dispatchEvent({type:"update",content:this})},b.Texture.prototype.destroy=function(a){a&&this.baseTexture.destroy(),this.valid=!1},b.Texture.prototype.setFrame=function(a){if(this.noFrame=!1,this.frame=a,this.width=a.width,this.height=a.height,this.crop.x=a.x,this.crop.y=a.y,this.crop.width=a.width,this.crop.height=a.height,!this.trim&&(a.x+a.width>this.baseTexture.width||a.y+a.height>this.baseTexture.height))throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);this.valid=a&&a.width&&a.height&&this.baseTexture.source&&this.baseTexture.hasLoaded,this.trim&&(this.width=this.trim.width,this.height=this.trim.height,this.frame.width=this.trim.width,this.frame.height=this.trim.height),this.valid&&b.Texture.frameUpdates.push(this)},b.Texture.prototype._updateWebGLuvs=function(){this._uvs||(this._uvs=new b.TextureUvs);var a=this.crop,c=this.baseTexture.width,d=this.baseTexture.height;this._uvs.x0=a.x/c,this._uvs.y0=a.y/d,this._uvs.x1=(a.x+a.width)/c,this._uvs.y1=a.y/d,this._uvs.x2=(a.x+a.width)/c,this._uvs.y2=(a.y+a.height)/d,this._uvs.x3=a.x/c,this._uvs.y3=(a.y+a.height)/d},b.Texture.fromImage=function(a,c,d){var e=b.TextureCache[a];return e||(e=new b.Texture(b.BaseTexture.fromImage(a,c,d)),b.TextureCache[a]=e),e},b.Texture.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache ');return c},b.Texture.fromCanvas=function(a,c){var d=b.BaseTexture.fromCanvas(a,c);return new b.Texture(d)},b.Texture.addTextureToCache=function(a,c){b.TextureCache[c]=a},b.Texture.removeTextureFromCache=function(a){var c=b.TextureCache[a];return delete b.TextureCache[a],delete b.BaseTextureCache[a],c},b.Texture.frameUpdates=[],b.TextureUvs=function(){this.x0=0,this.y0=0,this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.x3=0,this.y3=0},b.RenderTexture=function(a,c,d,e){if(b.EventTarget.call(this),this.width=a||100,this.height=c||100,this.frame=new b.Rectangle(0,0,this.width,this.height),this.crop=new b.Rectangle(0,0,this.width,this.height),this.baseTexture=new b.BaseTexture,this.baseTexture.width=this.width,this.baseTexture.height=this.height,this.baseTexture._glTextures=[],this.baseTexture.scaleMode=e||b.scaleModes.DEFAULT,this.baseTexture.hasLoaded=!0,this.renderer=d||b.defaultRenderer,this.renderer.type===b.WEBGL_RENDERER){var f=this.renderer.gl;this.textureBuffer=new b.FilterTexture(f,this.width,this.height,this.baseTexture.scaleMode),this.baseTexture._glTextures[f.id]=this.textureBuffer.texture,this.render=this.renderWebGL,this.projection=new b.Point(this.width/2,-this.height/2)}else this.render=this.renderCanvas,this.textureBuffer=new b.CanvasBuffer(this.width,this.height),this.baseTexture.source=this.textureBuffer.canvas;this.valid=!0,b.Texture.frameUpdates.push(this)},b.RenderTexture.prototype=Object.create(b.Texture.prototype),b.RenderTexture.prototype.constructor=b.RenderTexture,b.RenderTexture.prototype.resize=function(a,c,d){(a!==this.width||c!==this.height)&&(this.width=this.frame.width=this.crop.width=a,this.height=this.frame.height=this.crop.height=c,d&&(this.baseTexture.width=this.width,this.baseTexture.height=this.height),this.renderer.type===b.WEBGL_RENDERER&&(this.projection.x=this.width/2,this.projection.y=-this.height/2),this.textureBuffer.resize(this.width,this.height))},b.RenderTexture.prototype.clear=function(){this.renderer.type===b.WEBGL_RENDERER&&this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER,this.textureBuffer.frameBuffer),this.textureBuffer.clear()},b.RenderTexture.prototype.renderWebGL=function(a,c,d){var e=this.renderer.gl;e.colorMask(!0,!0,!0,!0),e.viewport(0,0,this.width,this.height),e.bindFramebuffer(e.FRAMEBUFFER,this.textureBuffer.frameBuffer),d&&this.textureBuffer.clear();var f=a.children,g=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,a.worldTransform.d=-1,a.worldTransform.ty=-2*this.projection.y,c&&(a.worldTransform.tx=c.x,a.worldTransform.ty-=c.y);for(var h=0,i=f.length;i>h;h++)f[h].updateTransform();b.WebGLRenderer.updateTextures(),this.renderer.spriteBatch.dirty=!0,this.renderer.renderDisplayObject(a,this.projection,this.textureBuffer.frameBuffer),a.worldTransform=g,this.renderer.spriteBatch.dirty=!0},b.RenderTexture.prototype.renderCanvas=function(a,c,d){var e=a.children,f=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,c?(a.worldTransform.tx=c.x,a.worldTransform.ty=c.y):(a.worldTransform.tx=0,a.worldTransform.ty=0);for(var g=0,h=e.length;h>g;g++)e[g].updateTransform();d&&this.textureBuffer.clear();var i=this.textureBuffer.context;this.renderer.renderDisplayObject(a,i),i.setTransform(1,0,0,1,0,0),a.worldTransform=f},b.RenderTexture.tempMatrix=new b.Matrix,b.AssetLoader=function(a,c){b.EventTarget.call(this),this.assetURLs=a,this.crossorigin=c,this.loadersByType={jpg:b.ImageLoader,jpeg:b.ImageLoader,png:b.ImageLoader,gif:b.ImageLoader,webp:b.ImageLoader,json:b.JsonLoader,atlas:b.AtlasLoader,anim:b.SpineLoader,xml:b.BitmapFontLoader,fnt:b.BitmapFontLoader}},b.AssetLoader.prototype.constructor=b.AssetLoader,b.AssetLoader.prototype._getDataType=function(a){var b="data:",c=a.slice(0,b.length).toLowerCase();if(c===b){var d=a.slice(b.length),e=d.indexOf(",");if(-1===e)return null;var f=d.slice(0,e).split(";")[0];return f&&"text/plain"!==f.toLowerCase()?f.split("/").pop().toLowerCase():"txt"}return null},b.AssetLoader.prototype.load=function(){function a(a){b.onAssetLoaded(a.content)}var b=this;this.loadCount=this.assetURLs.length;for(var c=0;c<this.assetURLs.length;c++){var d=this.assetURLs[c],e=this._getDataType(d);e||(e=d.split("?").shift().split(".").pop().toLowerCase());var f=this.loadersByType[e];if(!f)throw new Error(e+" is an unsupported file type");var g=new f(d,this.crossorigin);g.addEventListener("loaded",a),g.load()}},b.AssetLoader.prototype.onAssetLoaded=function(a){this.loadCount--,this.dispatchEvent({type:"onProgress",content:this,loader:a}),this.onProgress&&this.onProgress(a),this.loadCount||(this.dispatchEvent({type:"onComplete",content:this}),this.onComplete&&this.onComplete())},b.JsonLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.loaded=!1},b.JsonLoader.prototype.constructor=b.JsonLoader,b.JsonLoader.prototype.load=function(){var a=this;window.XDomainRequest&&a.crossorigin?(this.ajaxRequest=new window.XDomainRequest,this.ajaxRequest.timeout=3e3,this.ajaxRequest.onerror=function(){a.onError()},this.ajaxRequest.ontimeout=function(){a.onError()},this.ajaxRequest.onprogress=function(){}):this.ajaxRequest=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP"),this.ajaxRequest.onload=function(){a.onJSONLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.send()},b.JsonLoader.prototype.onJSONLoaded=function(){if(!this.ajaxRequest.responseText)return this.onError(),void 0;if(this.json=JSON.parse(this.ajaxRequest.responseText),this.json.frames){var a=this,c=this.baseUrl+this.json.meta.image,d=new b.ImageLoader(c,this.crossorigin),e=this.json.frames;this.texture=d.texture.baseTexture,d.addEventListener("loaded",function(){a.onLoaded()});for(var g in e){var h=e[g].frame;if(h&&(b.TextureCache[g]=new b.Texture(this.texture,{x:h.x,y:h.y,width:h.w,height:h.h}),b.TextureCache[g].crop=new b.Rectangle(h.x,h.y,h.w,h.h),e[g].trimmed)){var i=e[g].sourceSize,j=e[g].spriteSourceSize;b.TextureCache[g].trim=new b.Rectangle(j.x,j.y,i.w,i.h)}}d.load()}else if(this.json.bones){var k=new f.SkeletonJson,l=k.readSkeletonData(this.json);b.AnimCache[this.url]=l,this.onLoaded()}else this.onLoaded()},b.JsonLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.JsonLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.AtlasLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.baseUrl=a.replace(/[^\/]*$/,""),this.crossorigin=c,this.loaded=!1},b.AtlasLoader.constructor=b.AtlasLoader,b.AtlasLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest,this.ajaxRequest.onreadystatechange=this.onAtlasLoaded.bind(this),this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/json"),this.ajaxRequest.send(null)},b.AtlasLoader.prototype.onAtlasLoaded=function(){if(4===this.ajaxRequest.readyState)if(200===this.ajaxRequest.status||-1===window.location.href.indexOf("http")){this.atlas={meta:{image:[]},frames:[]};var a=this.ajaxRequest.responseText.split(/\r?\n/),c=-3,d=0,e=null,f=!1,g=0,h=0,i=this.onLoaded.bind(this);for(g=0;g<a.length;g++)if(a[g]=a[g].replace(/^\s+|\s+$/g,""),""===a[g]&&(f=g+1),a[g].length>0){if(f===g)this.atlas.meta.image.push(a[g]),d=this.atlas.meta.image.length-1,this.atlas.frames.push({}),c=-3;else if(c>0)if(c%7===1)null!=e&&(this.atlas.frames[d][e.name]=e),e={name:a[g],frame:{}};else{var j=a[g].split(" ");if(c%7===3)e.frame.x=Number(j[1].replace(",","")),e.frame.y=Number(j[2]);else if(c%7===4)e.frame.w=Number(j[1].replace(",","")),e.frame.h=Number(j[2]);else if(c%7===5){var k={x:0,y:0,w:Number(j[1].replace(",","")),h:Number(j[2])};k.w>e.frame.w||k.h>e.frame.h?(e.trimmed=!0,e.realSize=k):e.trimmed=!1}}c++}if(null!=e&&(this.atlas.frames[d][e.name]=e),this.atlas.meta.image.length>0){for(this.images=[],h=0;h<this.atlas.meta.image.length;h++){var l=this.baseUrl+this.atlas.meta.image[h],m=this.atlas.frames[h];this.images.push(new b.ImageLoader(l,this.crossorigin));for(g in m){var n=m[g].frame;n&&(b.TextureCache[g]=new b.Texture(this.images[h].texture.baseTexture,{x:n.x,y:n.y,width:n.w,height:n.h}),m[g].trimmed&&(b.TextureCache[g].realSize=m[g].realSize,b.TextureCache[g].trim.x=0,b.TextureCache[g].trim.y=0))}}for(this.currentImageId=0,h=0;h<this.images.length;h++)this.images[h].addEventListener("loaded",i);this.images[this.currentImageId].load()}else this.onLoaded()}else this.onError()},b.AtlasLoader.prototype.onLoaded=function(){this.images.length-1>this.currentImageId?(this.currentImageId++,this.images[this.currentImageId].load()):(this.loaded=!0,this.dispatchEvent({type:"loaded",content:this}))},b.AtlasLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.SpriteSheetLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null,this.frames={}},b.SpriteSheetLoader.prototype.constructor=b.SpriteSheetLoader,b.SpriteSheetLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpriteSheetLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader=function(a,c){b.EventTarget.call(this),this.texture=b.Texture.fromImage(a,c),this.frames=[]},b.ImageLoader.prototype.constructor=b.ImageLoader,b.ImageLoader.prototype.load=function(){if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var a=this;this.texture.baseTexture.addEventListener("loaded",function(){a.onLoaded()})}},b.ImageLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader.prototype.loadFramedSpriteSheet=function(a,c,d){this.frames=[];for(var e=Math.floor(this.texture.width/a),f=Math.floor(this.texture.height/c),g=0,h=0;f>h;h++)for(var i=0;e>i;i++,g++){var j=new b.Texture(this.texture,{x:i*a,y:h*c,width:a,height:c});this.frames.push(j),d&&(b.TextureCache[d+"-"+g]=j)}if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var k=this;this.texture.baseTexture.addEventListener("loaded",function(){k.onLoaded()})}},b.BitmapFontLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null},b.BitmapFontLoader.prototype.constructor=b.BitmapFontLoader,b.BitmapFontLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest;var a=this;this.ajaxRequest.onreadystatechange=function(){a.onXMLLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/xml"),this.ajaxRequest.send(null)},b.BitmapFontLoader.prototype.onXMLLoaded=function(){if(4===this.ajaxRequest.readyState&&(200===this.ajaxRequest.status||-1===window.location.protocol.indexOf("http"))){var a=this.ajaxRequest.responseXML;if(!a||/MSIE 9/i.test(navigator.userAgent)||navigator.isCocoonJS)if("function"==typeof window.DOMParser){var c=new DOMParser;a=c.parseFromString(this.ajaxRequest.responseText,"text/xml")}else{var d=document.createElement("div");d.innerHTML=this.ajaxRequest.responseText,a=d}var e=this.baseUrl+a.getElementsByTagName("page")[0].getAttribute("file"),f=new b.ImageLoader(e,this.crossorigin);this.texture=f.texture.baseTexture;var g={},h=a.getElementsByTagName("info")[0],i=a.getElementsByTagName("common")[0];g.font=h.getAttribute("face"),g.size=parseInt(h.getAttribute("size"),10),g.lineHeight=parseInt(i.getAttribute("lineHeight"),10),g.chars={};for(var j=a.getElementsByTagName("char"),k=0;k<j.length;k++){var l=parseInt(j[k].getAttribute("id"),10),m=new b.Rectangle(parseInt(j[k].getAttribute("x"),10),parseInt(j[k].getAttribute("y"),10),parseInt(j[k].getAttribute("width"),10),parseInt(j[k].getAttribute("height"),10));g.chars[l]={xOffset:parseInt(j[k].getAttribute("xoffset"),10),yOffset:parseInt(j[k].getAttribute("yoffset"),10),xAdvance:parseInt(j[k].getAttribute("xadvance"),10),kerning:{},texture:b.TextureCache[l]=new b.Texture(this.texture,m)}}var n=a.getElementsByTagName("kerning");for(k=0;k<n.length;k++){var o=parseInt(n[k].getAttribute("first"),10),p=parseInt(n[k].getAttribute("second"),10),q=parseInt(n[k].getAttribute("amount"),10);g.chars[p].kerning[o]=q}b.BitmapText.fonts[g.font]=g;var r=this;f.addEventListener("loaded",function(){r.onLoaded()}),f.load()}},b.BitmapFontLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.SpineLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.loaded=!1},b.SpineLoader.prototype.constructor=b.SpineLoader,b.SpineLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);
c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpineLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.AbstractFilter=function(a,b){this.passes=[this],this.shaders=[],this.dirty=!0,this.padding=0,this.uniforms=b||{},this.fragmentSrc=a||[]},b.AlphaMaskFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={mask:{type:"sampler2D",value:a},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mask.value.x=a.width,this.uniforms.mask.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D mask;","uniform sampler2D uSampler;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   mapCords *= dimensions.xy / mapDimensions;","   vec4 original =  texture2D(uSampler, vTextureCoord);","   float maskAlpha =  texture2D(mask, mapCords).r;","   original *= maskAlpha;","   gl_FragColor =  original;","}"]},b.AlphaMaskFilter.prototype=Object.create(b.AbstractFilter.prototype),b.AlphaMaskFilter.prototype.constructor=b.AlphaMaskFilter,b.AlphaMaskFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.mask.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.mask.value.height,this.uniforms.mask.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.AlphaMaskFilter.prototype,"map",{get:function(){return this.uniforms.mask.value},set:function(a){this.uniforms.mask.value=a}}),b.ColorMatrixFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={matrix:{type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform mat4 matrix;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;","}"]},b.ColorMatrixFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorMatrixFilter.prototype.constructor=b.ColorMatrixFilter,Object.defineProperty(b.ColorMatrixFilter.prototype,"matrix",{get:function(){return this.uniforms.matrix.value},set:function(a){this.uniforms.matrix.value=a}}),b.GrayFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={gray:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float gray;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);","}"]},b.GrayFilter.prototype=Object.create(b.AbstractFilter.prototype),b.GrayFilter.prototype.constructor=b.GrayFilter,Object.defineProperty(b.GrayFilter.prototype,"gray",{get:function(){return this.uniforms.gray.value},set:function(a){this.uniforms.gray.value=a}}),b.DisplacementFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={displacementMap:{type:"sampler2D",value:a},scale:{type:"2f",value:{x:30,y:30}},offset:{type:"2f",value:{x:0,y:0}},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mapDimensions.value.x=a.width,this.uniforms.mapDimensions.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D displacementMap;","uniform sampler2D uSampler;","uniform vec2 scale;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   vec2 matSample = texture2D(displacementMap, mapCords).xy;","   matSample -= 0.5;","   matSample *= scale;","   matSample /= mapDimensions;","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);","   vec2 cord = vTextureCoord;","}"]},b.DisplacementFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DisplacementFilter.prototype.constructor=b.DisplacementFilter,b.DisplacementFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.displacementMap.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.displacementMap.value.height,this.uniforms.displacementMap.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.DisplacementFilter.prototype,"map",{get:function(){return this.uniforms.displacementMap.value},set:function(a){this.uniforms.displacementMap.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.uniforms.scale.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.uniforms.offset.value=a}}),b.PixelateFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:0},dimensions:{type:"4fv",value:new Float32Array([1e4,100,10,10])},pixelSize:{type:"2f",value:{x:10,y:10}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 testDim;","uniform vec4 dimensions;","uniform vec2 pixelSize;","uniform sampler2D uSampler;","void main(void) {","   vec2 coord = vTextureCoord;","   vec2 size = dimensions.xy/pixelSize;","   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;","   gl_FragColor = texture2D(uSampler, color);","}"]},b.PixelateFilter.prototype=Object.create(b.AbstractFilter.prototype),b.PixelateFilter.prototype.constructor=b.PixelateFilter,Object.defineProperty(b.PixelateFilter.prototype,"size",{get:function(){return this.uniforms.pixelSize.value},set:function(a){this.dirty=!0,this.uniforms.pixelSize.value=a}}),b.BlurXFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurXFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurXFilter.prototype.constructor=b.BlurXFilter,Object.defineProperty(b.BlurXFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.dirty=!0,this.uniforms.blur.value=1/7e3*a}}),b.BlurYFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurYFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurYFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.BlurYFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.BlurFilter=function(){this.blurXFilter=new b.BlurXFilter,this.blurYFilter=new b.BlurYFilter,this.passes=[this.blurXFilter,this.blurYFilter]},Object.defineProperty(b.BlurFilter.prototype,"blur",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=this.blurYFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurX",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurY",{get:function(){return this.blurYFilter.blur},set:function(a){this.blurYFilter.blur=a}}),b.InvertFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);","}"]},b.InvertFilter.prototype=Object.create(b.AbstractFilter.prototype),b.InvertFilter.prototype.constructor=b.InvertFilter,Object.defineProperty(b.InvertFilter.prototype,"invert",{get:function(){return this.uniforms.invert.value},set:function(a){this.uniforms.invert.value=a}}),b.SepiaFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={sepia:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float sepia;","uniform sampler2D uSampler;","const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);","}"]},b.SepiaFilter.prototype=Object.create(b.AbstractFilter.prototype),b.SepiaFilter.prototype.constructor=b.SepiaFilter,Object.defineProperty(b.SepiaFilter.prototype,"sepia",{get:function(){return this.uniforms.sepia.value},set:function(a){this.uniforms.sepia.value=a}}),b.TwistFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={radius:{type:"1f",value:.5},angle:{type:"1f",value:5},offset:{type:"2f",value:{x:.5,y:.5}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float radius;","uniform float angle;","uniform vec2 offset;","void main(void) {","   vec2 coord = vTextureCoord - offset;","   float distance = length(coord);","   if (distance < radius) {","       float ratio = (radius - distance) / radius;","       float angleMod = ratio * ratio * angle;","       float s = sin(angleMod);","       float c = cos(angleMod);","       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);","   }","   gl_FragColor = texture2D(uSampler, coord+offset);","}"]},b.TwistFilter.prototype=Object.create(b.AbstractFilter.prototype),b.TwistFilter.prototype.constructor=b.TwistFilter,Object.defineProperty(b.TwistFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.dirty=!0,this.uniforms.offset.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"radius",{get:function(){return this.uniforms.radius.value},set:function(a){this.dirty=!0,this.uniforms.radius.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.ColorStepFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={step:{type:"1f",value:5}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float step;","void main(void) {","   vec4 color = texture2D(uSampler, vTextureCoord);","   color = floor(color * step) / step;","   gl_FragColor = color;","}"]},b.ColorStepFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorStepFilter.prototype.constructor=b.ColorStepFilter,Object.defineProperty(b.ColorStepFilter.prototype,"step",{get:function(){return this.uniforms.step.value},set:function(a){this.uniforms.step.value=a}}),b.DotScreenFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={scale:{type:"1f",value:1},angle:{type:"1f",value:5},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float angle;","uniform float scale;","float pattern() {","   float s = sin(angle), c = cos(angle);","   vec2 tex = vTextureCoord * dimensions.xy;","   vec2 point = vec2(","       c * tex.x - s * tex.y,","       s * tex.x + c * tex.y","   ) * scale;","   return (sin(point.x) * sin(point.y)) * 4.0;","}","void main() {","   vec4 color = texture2D(uSampler, vTextureCoord);","   float average = (color.r + color.g + color.b) / 3.0;","   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);","}"]},b.DotScreenFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DotScreenFilter.prototype.constructor=b.DotScreenFilter,Object.defineProperty(b.DotScreenFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.dirty=!0,this.uniforms.scale.value=a}}),Object.defineProperty(b.DotScreenFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.CrossHatchFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);","    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);","    if (lum < 1.00) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.75) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.50) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.3) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","}"]},b.CrossHatchFilter.prototype=Object.create(b.AbstractFilter.prototype),b.CrossHatchFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.CrossHatchFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.RGBSplitFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={red:{type:"2f",value:{x:20,y:20}},green:{type:"2f",value:{x:-20,y:20}},blue:{type:"2f",value:{x:20,y:-20}},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 red;","uniform vec2 green;","uniform vec2 blue;","uniform vec4 dimensions;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;","   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;","   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;","   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;","}"]},b.RGBSplitFilter.prototype=Object.create(b.AbstractFilter.prototype),b.RGBSplitFilter.prototype.constructor=b.RGBSplitFilter,Object.defineProperty(b.RGBSplitFilter.prototype,"angle",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=b),exports.PIXI=b):"undefined"!=typeof define&&define.amd?define(b):a.PIXI=b}).call(this);
},{}],4:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

module.exports=TWEEN;
},{}],5:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var PixiApp = require("../../utils/PixiApp");
var ContentScaler = require("../../utils/ContentScaler");
var NetPokerClientView = require("../view/NetPokerClientView");
var NetPokerClientController = require("../controller/NetPokerClientController");
var MessageWebSocketConnection = require("../../utils/MessageWebSocketConnection");
var ProtoConnection = require("../../proto/ProtoConnection");
var LoadingScreen = require("../view/LoadingScreen");
var StateCompleteMessage = require("../../proto/messages/StateCompleteMessage");
var InitMessage = require("../../proto/messages/InitMessage");
var Resources = require("../resources/Resources");

/**
 * Main entry point for client.
 * @class NetPokerClient
 * @module client
 */
function NetPokerClient(domId) {
	PixiApp.call(this, domId, 960, 720);

	this.setContentAlign(ContentScaler.TOP);

	this.loadingScreen = new LoadingScreen();
	this.addChild(this.loadingScreen);
	this.loadingScreen.show("LOADING");

	this.url = null;

	this.tableId=null;
}

FunctionUtil.extend(NetPokerClient, PixiApp);

/**
 * Set url.
 * @method setUrl
 */
NetPokerClient.prototype.setUrl = function(url) {
	this.url = url;
}

/**
 * Set table id.
 * @method setTableId
 */
NetPokerClient.prototype.setTableId = function(tableId) {
	this.tableId = tableId;
}

/**
 * Set view case.
 * @method setViewCase
 */
NetPokerClient.prototype.setViewCase = function(viewCase) {
	console.log("****** running view case: "+viewCase);
	this.viewCase=viewCase;
}

/**
 * Set token.
 * @method setToken
 */
NetPokerClient.prototype.setToken = function(token) {
	this.token = token;
}

/**
 * Set token.
 * @method setSkin
 */
NetPokerClient.prototype.setSkin = function(skin) {
	Resources.getInstance().skin = skin;
}

/**
 * Run.
 * @method run
 */
NetPokerClient.prototype.run = function() {

	var assets = [
		"table.png",
		"components.png"
	];
	if((Resources.getInstance().skin != null) && (Resources.getInstance().skin.textures != null)) {
		for(var i = 0; i < Resources.getInstance().skin.textures.length; i++) {
			assets.push(Resources.getInstance().skin.textures[i].file);
			console.log("add to load list: " + Resources.getInstance().skin.textures[i].file);
		}
	}

	this.assetLoader = new PIXI.AssetLoader(assets);
	this.assetLoader.addEventListener("onComplete", this.onAssetLoaderComplete.bind(this));
	this.assetLoader.load();
}

/**
 * Assets loaded, connect.
 * @method onAssetLoaderComplete
 * @private
 */
NetPokerClient.prototype.onAssetLoaderComplete = function() {
	console.log("asset loader complete...");

	this.netPokerClientView = new NetPokerClientView();
	this.addChildAt(this.netPokerClientView, 0);

	this.netPokerClientController = new NetPokerClientController(this.netPokerClientView);
	this.connect();
}

/**
 * Connect.
 * @method connect
 * @private
 */
NetPokerClient.prototype.connect = function() {
	if (!this.url) {
		this.loadingScreen.show("NEED URL");
		return;
	}

	this.connection = new MessageWebSocketConnection();
	this.connection.on(MessageWebSocketConnection.CONNECT, this.onConnectionConnect, this);
	this.connection.on(MessageWebSocketConnection.CLOSE, this.onConnectionClose, this);
	this.connection.connect(this.url);
	this.loadingScreen.show("CONNECTING");
}

/**
 * Connection complete.
 * @method onConnectionConnect
 * @private
 */
NetPokerClient.prototype.onConnectionConnect = function() {
	console.log("**** connected");
	this.protoConnection = new ProtoConnection(this.connection);
	this.protoConnection.addMessageHandler(StateCompleteMessage, this.onStateCompleteMessage, this);
	this.netPokerClientController.setProtoConnection(this.protoConnection);
	this.loadingScreen.show("INITIALIZING");

	var initMessage=new InitMessage(this.token);

	if (this.tableId)
		initMessage.setTableId(this.tableId);

	if (this.viewCase)
		initMessage.setViewCase(this.viewCase);

	this.protoConnection.send(initMessage);
}

/**
 * State complete.
 * @method onStateCompleteMessage
 * @private
 */
NetPokerClient.prototype.onStateCompleteMessage=function() {
	this.loadingScreen.hide();
}

/**
 * Connection closed.
 * @method onConnectionClose
 * @private
 */
NetPokerClient.prototype.onConnectionClose = function() {
	console.log("**** connection closed");
	if (this.protoConnection)
		this.protoConnection.removeMessageHandler(StateCompleteMessage, this.onStateCompleteMessage, this);

	this.protoConnection = null;
	this.netPokerClientController.setProtoConnection(null);
	this.loadingScreen.show("CONNECTION ERROR");
	setTimeout(this.connect.bind(this), 3000);
}

module.exports = NetPokerClient;
},{"../../proto/ProtoConnection":32,"../../proto/messages/InitMessage":50,"../../proto/messages/StateCompleteMessage":61,"../../utils/ContentScaler":70,"../../utils/FunctionUtil":72,"../../utils/MessageWebSocketConnection":74,"../../utils/PixiApp":77,"../controller/NetPokerClientController":10,"../resources/Resources":14,"../view/LoadingScreen":23,"../view/NetPokerClientView":24,"pixi.js":3}],6:[function(require,module,exports){
/**
 * Client resources
 * @class Settings
 * @module client
 */
 function Settings() {
 	this.playAnimations = true;
 }


/**
 * Get singleton instance.
 * @method getInstance
 */
Settings.getInstance = function() {
	if (!Settings.instance)
		Settings.instance = new Settings();

	return Settings.instance;
}

module.exports = Settings;
},{}],7:[function(require,module,exports){
var ShowDialogMessage = require("../../proto/messages/ShowDialogMessage");
var ButtonsMessage = require("../../proto/messages/ButtonsMessage");
var ChatMessage = require("../../proto/messages/ChatMessage");
var TableInfoMessage = require("../../proto/messages/TableInfoMessage");

/**
 * Control user interface.
 * @class InterfaceController
 * @module client
 */
function InterfaceController(messageSequencer, view) {
	this.messageSequencer = messageSequencer;
	this.view = view;

	this.messageSequencer.addMessageHandler(ButtonsMessage.TYPE, this.onButtonsMessage, this);
	this.messageSequencer.addMessageHandler(ShowDialogMessage.TYPE, this.onShowDialogMessage, this);
	this.messageSequencer.addMessageHandler(ChatMessage.TYPE, this.onChat, this);
	this.messageSequencer.addMessageHandler(TableInfoMessage.TYPE, this.onTableInfoMessage, this);
}

/**
 * Buttons message.
 * @method onButtonsMessage
 */
InterfaceController.prototype.onButtonsMessage = function(m) {
	var buttonsView = this.view.getButtonsView();

	buttonsView.setButtons(m.getButtons(), m.sliderButtonIndex, parseInt(m.min, 10), parseInt(m.max, 10));
}

/**
 * Show dialog.
 * @method onShowDialogMessage
 */
InterfaceController.prototype.onShowDialogMessage = function(m) {
	var dialogView = this.view.getDialogView();

	dialogView.show(m.getText(), m.getButtons(), m.getDefaultValue());
}


/**
 * On chat message.
 * @method onChat
 */
InterfaceController.prototype.onChat = function(m) {
	this.view.chatView.addText(m.user, m.text);
}

/**
 * Handle table info message.
 * @method onTableInfoMessage
 */
InterfaceController.prototype.onTableInfoMessage = function(m) {
	var tableInfoView=this.view.getTableInfoView();

	tableInfoView.setTableInfoText(m.getText());
}

module.exports = InterfaceController;
},{"../../proto/messages/ButtonsMessage":40,"../../proto/messages/ChatMessage":41,"../../proto/messages/ShowDialogMessage":60,"../../proto/messages/TableInfoMessage":64}],8:[function(require,module,exports){
var EventDispatcher = require("../../utils/EventDispatcher");
var FunctionUtil = require("../../utils/FunctionUtil");
var Sequencer = require("../../utils/Sequencer");

/**
 * An item in a message sequence.
 * @class MessageSequenceItem
 * @module client
 */
function MessageSequenceItem(message) {
	EventDispatcher.call(this);
	this.message = message;
	this.waitTarget = null;
	this.waitEvent = null;
	this.waitClosure = null;
}

FunctionUtil.extend(MessageSequenceItem, EventDispatcher);

/**
 * Get message.
 * @method getMessage
 */
MessageSequenceItem.prototype.getMessage = function() {
	//console.log("getting: " + this.message.type);

	return this.message;
}

/**
 * Are we waiting for an event?
 * @method isWaiting
 */
MessageSequenceItem.prototype.isWaiting = function() {
	return this.waitEvent != null;
}

/**
 * Notify complete.
 * @method notifyComplete
 */
MessageSequenceItem.prototype.notifyComplete = function() {
	this.trigger(Sequencer.COMPLETE);
}

/**
 * Wait for event before processing next message.
 * @method waitFor
 */
MessageSequenceItem.prototype.waitFor = function(target, event) {
	this.waitTarget = target;
	this.waitEvent = event;
	this.waitClosure = this.onTargetComplete.bind(this);

	this.waitTarget.addEventListener(this.waitEvent, this.waitClosure);
}

/**
 * Wait target complete.
 * @method onTargetComplete
 * @private
 */
MessageSequenceItem.prototype.onTargetComplete = function() {
	//console.log("target is complete");
	this.waitTarget.removeEventListener(this.waitEvent, this.waitClosure);
	this.notifyComplete();
}

module.exports = MessageSequenceItem;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/Sequencer":79}],9:[function(require,module,exports){
var Sequencer = require("../../utils/Sequencer");
var EventDispatcher = require("../../utils/EventDispatcher");
var MessageSequenceItem = require("./MessageSequenceItem");

/**
 * Sequences messages.
 * @class MessageSequencer
 * @module client
 */
function MessageSequencer() {
	this.sequencer = new Sequencer();
	this.messageDispatcher = new EventDispatcher();
	this.currentItem = null;
}

/**
 * Add a message for procesing.
 * @method enqueue
 */
MessageSequencer.prototype.enqueue = function(message) {
	if (!message.type)
		throw "Message doesn't have a type";

	var sequenceItem = new MessageSequenceItem(message);

	sequenceItem.on(Sequencer.START, this.onSequenceItemStart, this);

	this.sequencer.enqueue(sequenceItem);
}

/**
 * Sequence item start.
 * @method onSequenceItemStart
 * @private
 */
MessageSequencer.prototype.onSequenceItemStart = function(e) {
	//console.log("starting item...");
	var item = e.target;

	item.off(Sequencer.START, this.onSequenceItemStart, this);

	this.currentItem = item;
	this.messageDispatcher.trigger(item.getMessage());
	this.currentItem = null;

	if (!item.isWaiting())
		item.notifyComplete();
}

/**
 * Add message handler.
 * @method addMessageHandler
 */
MessageSequencer.prototype.addMessageHandler = function(messageType, handler, scope) {
	this.messageDispatcher.on(messageType, handler, scope);
}

/**
 * Wait for the target to dispatch an event before continuing to
 * process the messages in the que.
 * @method waitFor
 */
MessageSequencer.prototype.waitFor = function(target, event) {
	if (!this.currentItem)
		throw "Not waiting for event";

	this.currentItem.waitFor(target, event);
}

module.exports = MessageSequencer;
},{"../../utils/EventDispatcher":71,"../../utils/Sequencer":79,"./MessageSequenceItem":8}],10:[function(require,module,exports){
var FunctionUtil = require("../../utils/FunctionUtil");
var MessageSequencer = require("./MessageSequencer");
var ProtoConnection = require("../../proto/ProtoConnection");
var ButtonsView = require("../view/ButtonsView");
var ButtonClickMessage = require("../../proto/messages/ButtonClickMessage");
var SeatClickMessage = require("../../proto/messages/SeatClickMessage");
var NetPokerClientView = require("../view/NetPokerClientView");
var DialogView = require("../view/DialogView");
var SettingsView = require("../view/SettingsView");
var TableController = require("./TableController");
var InterfaceController = require("./InterfaceController");
var ChatMessage = require("../../proto/messages/ChatMessage");
var ButtonData = require("../../proto/data/ButtonData");

/**
 * Main controller
 * @class NetPokerClientController
 * @module client
 */
function NetPokerClientController(view) {
	this.netPokerClientView = view;
	this.protoConnection = null;
	this.messageSequencer = new MessageSequencer();

	this.tableController = new TableController(this.messageSequencer, this.netPokerClientView);
	this.interfaceController = new InterfaceController(this.messageSequencer, this.netPokerClientView);

	console.log(this.netPokerClientView.getDialogView());

	this.netPokerClientView.getButtonsView().on(ButtonsView.BUTTON_CLICK, this.onButtonClick, this);
	this.netPokerClientView.getDialogView().on(DialogView.BUTTON_CLICK, this.onButtonClick, this);
	this.netPokerClientView.on(NetPokerClientView.SEAT_CLICK, this.onSeatClick, this);

	this.netPokerClientView.chatView.addEventListener("chat", this.onViewChat, this);

	this.netPokerClientView.settingsView.addEventListener(SettingsView.BUY_CHIPS_CLICK, this.onBuyChipsButtonClick, this);
}


/**
 * Set connection.
 * @method setProtoConnection
 */
NetPokerClientController.prototype.setProtoConnection = function(protoConnection) {
	if (this.protoConnection) {
		this.protoConnection.off(ProtoConnection.MESSAGE, this.onProtoConnectionMessage, this);
	}

	this.protoConnection = protoConnection;
	this.netPokerClientView.clear();

	if (this.protoConnection) {
		this.protoConnection.on(ProtoConnection.MESSAGE, this.onProtoConnectionMessage, this);
	}
}

/**
 * Incoming message.
 * Enqueue for processing.
 * @method onProtoConnectionMessage
 * @private
 */
NetPokerClientController.prototype.onProtoConnectionMessage = function(e) {
	this.messageSequencer.enqueue(e.message);
}

/**
 * Button click.
 * This function handles clicks from both the dialog and game play buttons.
 * @method onButtonClick
 * @private
 */
NetPokerClientController.prototype.onButtonClick = function(e) {
	if (!this.protoConnection)
		return;

	console.log("button click, v=" + e.value);

	var m = new ButtonClickMessage(e.button, e.value);
	this.protoConnection.send(m);
}

/**
 * Seat click.
 * @method onSeatClick
 * @private
 */
NetPokerClientController.prototype.onSeatClick = function(e) {
	var m = new SeatClickMessage(e.seatIndex);
	this.protoConnection.send(m);
}

/**
 * On send chat message.
 * @method onViewChat
 */
NetPokerClientController.prototype.onViewChat = function(text) {
	var message = new ChatMessage();
	message.user = "";
	message.text = text;

	this.protoConnection.send(message);
}

/**
 * On buy chips button click.
 * @method onBuyChipsButtonClick
 */
NetPokerClientController.prototype.onBuyChipsButtonClick = function() {
	console.log("buy chips click");

	this.protoConnection.send(new ButtonClickMessage(ButtonData.BUY_CHIPS));
}

module.exports = NetPokerClientController;
},{"../../proto/ProtoConnection":32,"../../proto/data/ButtonData":33,"../../proto/messages/ButtonClickMessage":39,"../../proto/messages/ChatMessage":41,"../../proto/messages/SeatClickMessage":58,"../../utils/FunctionUtil":72,"../view/ButtonsView":16,"../view/DialogView":22,"../view/NetPokerClientView":24,"../view/SettingsView":29,"./InterfaceController":7,"./MessageSequencer":9,"./TableController":11}],11:[function(require,module,exports){
var SeatInfoMessage = require("../../proto/messages/SeatInfoMessage");
var CommunityCardsMessage = require("../../proto/messages/CommunityCardsMessage");
var PocketCardsMessage = require("../../proto/messages/PocketCardsMessage");
var DealerButtonMessage = require("../../proto/messages/DealerButtonMessage");
var BetMessage = require("../../proto/messages/BetMessage");
var BetsToPotMessage = require("../../proto/messages/BetsToPotMessage");
var PotMessage = require("../../proto/messages/PotMessage");
var TimerMessage = require("../../proto/messages/TimerMessage");
var ActionMessage = require("../../proto/messages/ActionMessage");
var FoldCardsMessage = require("../../proto/messages/FoldCardsMessage");
var DelayMessage = require("../../proto/messages/DelayMessage");
var EventDispatcher = require("../../utils/EventDispatcher");
var ClearMessage = require("../../proto/messages/ClearMessage");
var PayOutMessage = require("../../proto/messages/PayOutMessage");

/**
 * Control the table
 * @class TableController
 * @module client
 */
function TableController(messageSequencer, view) {
	this.messageSequencer = messageSequencer;
	this.view = view;

	this.messageSequencer.addMessageHandler(SeatInfoMessage.TYPE, this.onSeatInfoMessage, this);
	this.messageSequencer.addMessageHandler(CommunityCardsMessage.TYPE, this.onCommunityCardsMessage, this);
	this.messageSequencer.addMessageHandler(PocketCardsMessage.TYPE, this.onPocketCardsMessage, this);
	this.messageSequencer.addMessageHandler(DealerButtonMessage.TYPE, this.onDealerButtonMessage, this);
	this.messageSequencer.addMessageHandler(BetMessage.TYPE, this.onBetMessage, this);
	this.messageSequencer.addMessageHandler(BetsToPotMessage.TYPE, this.onBetsToPot, this);
	this.messageSequencer.addMessageHandler(PotMessage.TYPE, this.onPot, this);
	this.messageSequencer.addMessageHandler(TimerMessage.TYPE, this.onTimer, this);
	this.messageSequencer.addMessageHandler(ActionMessage.TYPE, this.onAction, this);
	this.messageSequencer.addMessageHandler(FoldCardsMessage.TYPE, this.onFoldCards, this);
	this.messageSequencer.addMessageHandler(DelayMessage.TYPE, this.onDelay, this);
	this.messageSequencer.addMessageHandler(ClearMessage.TYPE, this.onClear, this);
	this.messageSequencer.addMessageHandler(PayOutMessage.TYPE, this.onPayOut, this);
}
EventDispatcher.init(TableController);

/**
 * Seat info message.
 * @method onSeatInfoMessage
 */
TableController.prototype.onSeatInfoMessage = function(m) {
	var seatView = this.view.getSeatViewByIndex(m.getSeatIndex());

	seatView.setName(m.getName());
	seatView.setChips(m.getChips());
	seatView.setActive(m.isActive());
	seatView.setSitout(m.isSitout());
}

/**
 * Seat info message.
 * @method onCommunityCardsMessage
 */
TableController.prototype.onCommunityCardsMessage = function(m) {
	var i;

	console.log("got community cards!");
	console.log(m);

	for (i = 0; i < m.getCards().length; i++) {
		var cardData = m.getCards()[i];
		var cardView = this.view.getCommunityCards()[m.getFirstIndex() + i];

		cardView.setCardData(cardData);
		cardView.show(m.animate, i * 500);
	}
	if (m.getCards().length > 0) {
		var cardData = m.getCards()[m.getCards().length - 1];
		var cardView = this.view.getCommunityCards()[m.getFirstIndex() + m.getCards().length - 1];
		if(m.animate)
			this.messageSequencer.waitFor(cardView, "animationDone");
	}
}

/**
 * Pocket cards message.
 * @method onPocketCardsMessage
 */
TableController.prototype.onPocketCardsMessage = function(m) {
	var seatView = this.view.getSeatViewByIndex(m.getSeatIndex());
	var i;

	for (i = 0; i < m.getCards().length; i++) {
		var cardData = m.getCards()[i];
		var cardView = seatView.getPocketCards()[m.getFirstIndex() + i];

		if(m.animate)
			this.messageSequencer.waitFor(cardView, "animationDone");
		cardView.setCardData(cardData);
		cardView.show(m.animate, 10);
	}
}

/**
 * Dealer button message.
 * @method onDealerButtonMessage
 */
TableController.prototype.onDealerButtonMessage = function(m) {
	var dealerButtonView = this.view.getDealerButtonView();

	if (m.seatIndex < 0) {
		dealerButtonView.hide();
	} else {
		this.messageSequencer.waitFor(dealerButtonView, "animationDone");
		dealerButtonView.show(m.getSeatIndex(), m.getAnimate());
	}
};

/**
 * Bet message.
 * @method onBetMessage
 */
TableController.prototype.onBetMessage = function(m) {
	this.view.seatViews[m.seatIndex].betChips.setValue(m.value);
};

/**
 * Bets to pot.
 * @method onBetsToPot
 */
TableController.prototype.onBetsToPot = function(m) {
	var haveChips = false;

	for (var i = 0; i < this.view.seatViews.length; i++)
		if (this.view.seatViews[i].betChips.value > 0)
			haveChips = true;

	if (!haveChips)
		return;

	for (var i = 0; i < this.view.seatViews.length; i++)
		this.view.seatViews[i].betChips.animateIn();

	this.messageSequencer.waitFor(this.view.seatViews[0].betChips, "animationDone");
}

/**
 * Pot message.
 * @method onPot
 */
TableController.prototype.onPot = function(m) {
	this.view.potView.setValues(m.values);
};

/**
 * Timer message.
 * @method onTimer
 */
TableController.prototype.onTimer = function(m) {
	if (m.seatIndex < 0)
		this.view.timerView.hide();

	else {
		this.view.timerView.show(m.seatIndex);
		this.view.timerView.countdown(m.totalTime, m.timeLeft);
	}
};

/**
 * Action message.
 * @method onAction
 */
TableController.prototype.onAction = function(m) {
	if (m.seatIndex == null)
		m.seatIndex = 0;

	this.view.seatViews[m.seatIndex].action(m.action);
};

/**
 * Fold cards message.
 * @method onFoldCards
 */
TableController.prototype.onFoldCards = function(m) {
	this.view.seatViews[m.seatIndex].foldCards();

	this.messageSequencer.waitFor(this.view.seatViews[m.seatIndex], "animationDone");
};

/**
 * Delay message.
 * @method onDelay
 */
TableController.prototype.onDelay = function(m) {
	console.log("delay for  = " + m.delay);


	this.messageSequencer.waitFor(this, "timerDone");
	setTimeout(this.dispatchEvent.bind(this, "timerDone"), m.delay);

};

/**
 * Clear message.
 * @method onClear
 */
TableController.prototype.onClear = function(m) {

	var components = m.getComponents();

	for(var i = 0; i < components.length; i++) {
		switch(components[i]) {
			case ClearMessage.POT: {
				this.view.potView.setValues([]);
				break;
			}
			case ClearMessage.BETS: {
				for(var s = 0; s < this.view.seatViews.length; s++) {
					this.view.seatViews[s].betChips.setValue(0);
				}
				break;
			}
			case ClearMessage.CARDS: {
				for(var s = 0; s < this.view.seatViews.length; s++) {
					for(var c = 0; c < this.view.seatViews[s].pocketCards.length; c++) {
						this.view.seatViews[s].pocketCards[c].hide();
					}
				}

				for(var c = 0; c < this.view.communityCards.length; c++) {
					this.view.communityCards[c].hide();
				}
				break;
			}
			case ClearMessage.CHAT: {
				this.view.chatView.clear();
				break;
			}
		}
	}
}

/**
 * Pay out message.
 * @method onPayOut
 */
TableController.prototype.onPayOut = function(m) {
	for (var i = 0; i < m.values.length; i++)
		this.view.seatViews[i].betChips.setValue(m.values[i]);

	for (var i = 0; i < this.view.seatViews.length; i++)
		this.view.seatViews[i].betChips.animateOut();

	this.messageSequencer.waitFor(this.view.seatViews[0].betChips, "animationDone");
};


module.exports = TableController;
},{"../../proto/messages/ActionMessage":36,"../../proto/messages/BetMessage":37,"../../proto/messages/BetsToPotMessage":38,"../../proto/messages/ClearMessage":43,"../../proto/messages/CommunityCardsMessage":44,"../../proto/messages/DealerButtonMessage":45,"../../proto/messages/DelayMessage":46,"../../proto/messages/FoldCardsMessage":48,"../../proto/messages/PayOutMessage":52,"../../proto/messages/PocketCardsMessage":53,"../../proto/messages/PotMessage":54,"../../proto/messages/SeatInfoMessage":59,"../../proto/messages/TimerMessage":66,"../../utils/EventDispatcher":71}],12:[function(require,module,exports){
NetPokerClient = require("./app/NetPokerClient");
//var netPokerClient = new NetPokerClient();

},{"./app/NetPokerClient":5}],13:[function(require,module,exports){
module.exports = {
	textures: [
		{
			id: "componentsTexture",
			file: "components.png"
		},
		{
			id: "tableBackground",
			file: "table.png"
		}
	],
	tableBackground: "tableBackground",
	defaultTexture: "componentsTexture",

	seatPositions: [
		[287, 118], [483, 112], [676, 118],
		[844, 247], [817, 413], [676, 490],
		[483, 495], [287, 490], [140, 413],
		[123, 247]
	],

	timerBackground: [121,200,32,32],

	seatPlate: [40, 116, 160, 70],

	communityCardsPosition: [255, 190],

	cardFrame: [498, 256, 87, 122],
	cardBack: [402, 256, 87, 122],

	dividerLine: [568, 77, 2, 170],

	suitSymbols: [
		[246, 67, 18, 19],
		[269, 67, 18, 19],
		[292, 67, 18, 19],
		[315, 67, 18, 19]
	],

	framePlate: [301, 262, 74, 76],
	bigButton: [33, 298, 95, 94],
	dialogButton: [383, 461, 82, 47],
	dealerButton: [197, 236, 41, 35],

	dealerButtonPositions: [
		[347, 133], [395, 133], [574, 133],
		[762, 267], [715, 358], [574, 434],
		[536, 432], [351, 432], [193, 362],
		[168, 266]
	],

	textScrollbarTrack: [371,50,60,10],
	textScrollbarThumb: [371,32,60,10],


	betAlign: [
		"left", "center", "right",
		"right", "right", 
		"right", "center", "left",
		"left", "left"
	],

	betPositions: [
		[225,150], [478,150], [730,150],
		[778,196], [748,322], [719,360],
		[481,360], [232,360], [199,322],
		[181,200]
	],
	chips: [
		[30, 25, 40, 30],
		[70, 25, 40, 30],
		[110, 25, 40, 30],
		[150, 25, 40, 30],
		[190, 25, 40, 30]
	],
	chipsColors: [0x404040, 0x008000, 0x808000, 0x000080, 0xff0000],
	potPosition: [485,315],
	wrenchIcon: [462,389,21,21],
	chatBackground: [301,262,74,76],
	checkboxBackground: [501,391,18,18],
	checkboxTick: [528,392,21,16],
	buttonBackground: [68,446,64,64],
	sliderBackground: [313,407,120,30],
	sliderKnob: [318,377,28,28],
	bigButtonPosition: [366,575],
	upArrow: [483,64,12,8]
}
},{}],14:[function(require,module,exports){
"use strict";

var PIXI = require("pixi.js");
var Point = require("../../utils/Point");
var DefaultSkin = require("./DefaultSkin");

/**
 * Client resources
 * @class Resources.
 * @module client
 */
function Resources() {
	var i;

	this.defaultSkin = DefaultSkin;
	this.skin = null;


	 this.Align = {
	 	Left: "left",
	 	Right: "right",
	 	Center: "center"
	 };

	 this.textures = {};
/*
	this.componentsTexture = new PIXI.Texture.fromImage("components.png");
	this.tableBackground = PIXI.Texture.fromImage("table.png");

	this.seatPositions = [
		Point(287, 118), Point(483, 112), Point(676, 118),
		Point(844, 247), Point(817, 413), Point(676, 490),
		Point(483, 495), Point(287, 490), Point(140, 413),
		Point(123, 247)
	];

	this.timerBackground = this.getComponentsPart(121,200,32,32); 

	this.seatPlate = this.getComponentsPart(40, 116, 160, 70);

	this.communityCardsPosition = Point(255, 190);

	this.cardFrame = this.getComponentsPart(498, 256, 87, 122);
	this.cardBack = this.getComponentsPart(402, 256, 87, 122);

	this.dividerLine = this.getComponentsPart(568, 77, 2, 170);

	this.suitSymbols = [];
	for (i = 0; i < 4; i++)
		this.suitSymbols.push(this.getComponentsPart(246 + i * 23, 67, 18, 19));

	this.framePlate = this.getComponentsPart(301, 262, 74, 76);
	this.bigButton = this.getComponentsPart(33, 298, 95, 94);
	this.dialogButton = this.getComponentsPart(383, 461, 82, 47);
	this.dealerButton = this.getComponentsPart(197, 236, 41, 35);

	this.dealerButtonPositions = [
		Point(347, 133), Point(395, 133), Point(574, 133),
		Point(762, 267), Point(715, 358), Point(574, 434),
		Point(536, 432), Point(351, 432), Point(193, 362),
		Point(168, 266)
	];

	this.textScrollbarTrack = this.getComponentsPart(371,50,60,10);
	this.textScrollbarThumb = this.getComponentsPart(371,32,60,10);

	 this.Align = {
	 	Left: "left",
	 	Right: "right",
	 	Center: "center",
	 };

	this.betAlign = [
			this.Align.Left, this.Align.Center, this.Align.Right,
			this.Align.Right, this.Align.Right, 
			this.Align.Right, this.Align.Center, this.Align.Left,
			this.Align.Left, this.Align.Left
		];

	this.betPositions = [
			Point(225,150), Point(478,150), Point(730,150),
			Point(778,196), Point(748,322), Point(719,360),
			Point(481,360), Point(232,360), Point(199,322),
			Point(181,200)
		];

	this.chips = new Array();
	for (var i = 0; i < 5; i++) {
		var b = this.getComponentsPart(30 + i*40, 25, 40, 30);
		this.chips.push(b);
	}

	this.chipsColors = [0x404040, 0x008000, 0x808000, 0x000080, 0xff0000];

	this.potPosition = Point(485,315);
	*/
}

/**
 * Get value from either loaded skin or default skin.
 * @method getValue
 */
Resources.prototype.getValue = function(key) {
	var value = null;

	if((this.skin != null) && (this.skin[key] != null))
		value = this.skin[key];
	else
		value = this.defaultSkin[key];

	if(value == null) {
		throw new Error("Invalid skin key: " + key);
	} 

	return value;
}

/**
 * Get point from either loaded skin or default skin.
 * @method getPoint
 */
Resources.prototype.getPoint = function(key) {
	var value = null;

	if((this.skin != null) && (this.skin[key] != null))
		value = Point(this.skin[key][0], this.skin[key][1]);
	else
		value = Point(this.defaultSkin[key][0], this.defaultSkin[key][1]);

	if(value == null) {
		throw new Error("Invalid skin key: " + key);
	} 

	return value;
}

/**
 * Get points from either loaded skin or default skin.
 * @method getPoints
 */
Resources.prototype.getPoints = function(key) {
	var values = null;

	var points = new Array();

	if((this.skin != null) && (this.skin[key] != null))
		values = this.skin[key];
	else
		values = this.defaultSkin[key];

	for(var i = 0; i < values.length; i++) {
		points.push(Point(values[i][0], values[i][1]));
	}

	if(points.length <= 0) {
		throw new Error("Invalid skin key: " + key);
	} 

	return points;
}

/**
 * Get texture from either loaded skin or default skin.
 * @method getTexture
 */
Resources.prototype.getTexture = function(key, index) {
	var value = null;
	var isDefault = false;
	var texture = null;
	var frame = null;


	if((this.skin != null) && (this.skin[key] != null)) {
		value = this.skin[key];
	}
	else {
		value = this.defaultSkin[key];
		isDefault = true;
	}
//	console.log("value = " + value + ", key = " +key);


	if(value.texture != null) {
		texture = value.texture;
	}
	else if(!isDefault && (this.skin.defaultTexture != null)) {
		texture = this.skin.defaultTexture;
	}
	else {
		texture = this.defaultSkin.defaultTexture;
	}

	if(value.coords != null) {
		frame = value.coords;
	}
	else if(typeof value === "string") {
		texture = value;
	}
	else {
		frame = value;
	}

	if(texture != null) {
		if(frame != null)
			return this.getComponentsPart(texture, frame[0], frame[1], frame[2], frame[3]);
		else
			return this.getComponentsPart(texture, frame);
	}


	
	throw new Error("Invalid skin key: " + key);
	
	return null;
}

/**
 * Get textures from either loaded skin or default skin.
 * @method getTextures
 */
Resources.prototype.getTextures = function(key) {
	var values = null;
	var isDefault = false;

	
	

	if((this.skin != null) && (this.skin[key] != null)) {
		values = this.skin[key];
	}
	else {
		values = this.defaultSkin[key];
		isDefault = true;
	}


	var frame = null;
	var texture = null;
	var textures = new Array();
	for(var i = 0; i < values.length; i++) {
		frame = null;
		texture = null;
		
		if(values[i].texture != null) {
			texture = values[i].texture;
		}
		else if(!isDefault && (this.skin.defaultTexture != null)) {
			texture = this.skin.defaultTexture;
		}
		else {
			texture = this.defaultSkin.defaultTexture;
		}

		if(values[i].coords != null) {
			frame = values[i].coords;
		}
		else if(typeof values[i] === "string") {
			texture = values[i];
		}
		else {
			frame = values[i];
		}

		if(texture != null) {
			if(frame != null)
				textures.push(this.getComponentsPart(texture, frame[0], frame[1], frame[2], frame[3]));
			else
				textures.push(this.getComponentsPart(texture, frame));
		}
	}

	
	if(textures.length <= 0)
		throw new Error("Invalid skin key: " + key);
	 

	return textures;
}

/**
 * Get part from components atlas.
 * @method getComponentsPart
 * @private
 */
Resources.prototype.getComponentsPart = function(textureid, x, y, w, h) {

	var frame;
	var texture = this.getTextureFromSkin(textureid);

	if(x === null) {
		frame = {
			x: 0,
			y: 0,
			width: texture.width,
			height: texture.height
		};
	}
	else {
		frame = {
			x: x,
			y: y,
			width: w,
			height: h
		};
	}

	return new PIXI.Texture(texture, frame);
}

/**
 * Get texture object from skin.
 * @method getTextureFromSkin
 * @private
 */
Resources.prototype.getTextureFromSkin = function(textureid) {

	var textureObject = null;

	if((this.skin != null) && (this.skin.textures != null)) {
		for(var i = 0; i < this.skin.textures.length; i++) {
			if(this.skin.textures[i].id == textureid) {
				textureObject = this.skin.textures[i];
			}
		}
	}
	if(textureObject == null) {
		for(var i = 0; i < this.defaultSkin.textures.length; i++) {
			if(this.defaultSkin.textures[i].id == textureid) {
				textureObject = this.defaultSkin.textures[i];
			}
		}
	}

	if(textureObject == null) {
		throw new Error("textureid doesn't exist: " + textureid);
	}

	if(this.textures[textureObject.id] == null)
		this.textures[textureObject.id] = new PIXI.Texture.fromImage(textureObject.file);

	return this.textures[textureObject.id];
}


/**
 * Get singleton instance.
 * @method getInstance
 */
Resources.getInstance = function() {
	if (!Resources.instance)
		Resources.instance = new Resources();

	return Resources.instance;
}

module.exports = Resources;
},{"../../utils/Point":78,"./DefaultSkin":13,"pixi.js":3}],15:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var Resources = require("../resources/Resources");

/**
 * Big button.
 * @class BigButton
 * @module client
 */
function BigButton() {
	Button.call(this);

	this.bigButtonTexture = Resources.getInstance().getTexture("bigButton");

	this.addChild(new PIXI.Sprite(this.bigButtonTexture));

	var style = {
		font: "bold 18px Arial",
		//fill: "#000000"
	};

	this.labelField = new PIXI.Text("[button]", style);
	this.labelField.position.y = 30;
	this.addChild(this.labelField);

	var style = {
		font: "bold 14px Arial"
		//fill: "#000000"
	};

	this.valueField = new PIXI.Text("[value]", style);
	this.valueField.position.y = 50;
	this.addChild(this.valueField);

	this.setLabel("TEST");
	this.setValue(123);
}

FunctionUtil.extend(BigButton, Button);

/**
 * Set label for the button.
 * @method setLabel
 */
BigButton.prototype.setLabel = function(label) {
	this.labelField.setText(label);
	this.labelField.updateTransform();
	this.labelField.x = this.bigButtonTexture.width / 2 - this.labelField.width / 2;
}

/**
 * Set value.
 * @method setValue
 */
BigButton.prototype.setValue = function(value) {
	if (!value) {
		this.valueField.visible = false;
		value = "";
	} else {
		this.valueField.visible = true;
	}

	this.valueField.setText(value);
	this.valueField.updateTransform();
	this.valueField.x = this.bigButtonTexture.width / 2 - this.valueField.width / 2;
}

module.exports = BigButton;
},{"../../utils/Button":68,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3}],16:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var EventDispatcher = require("../../utils/EventDispatcher");
var Button = require("../../utils/Button");
var Slider = require("../../utils/Slider");
var NineSlice = require("../../utils/NineSlice");
var BigButton = require("./BigButton");
var Resources = require("../resources/Resources");
var RaiseShortcutButton = require("./RaiseShortcutButton");

/**
 * Buttons
 * @class ButtonsView
 * @module client
 */
function ButtonsView() {
	PIXI.DisplayObjectContainer.call(this);

	this.buttonHolder = new PIXI.DisplayObjectContainer();
	this.addChild(this.buttonHolder);

	var sliderBackground = new NineSlice(Resources.getInstance().getTexture("sliderBackground"), 20, 0, 20, 0);
	sliderBackground.width = 300;

	var knob = new PIXI.Sprite(Resources.getInstance().getTexture("sliderKnob"));

	this.slider = new Slider(sliderBackground, knob);
	var pos = Resources.getInstance().getPoint("bigButtonPosition");
	this.slider.position.x = pos.x;
	this.slider.position.y = pos.y - 35;
	this.slider.addEventListener("change", this.onSliderChange, this);
	this.addChild(this.slider);


	this.buttonHolder.position.x = 366;
	this.buttonHolder.position.y = 575;

	this.buttons = [];

	for (var i = 0; i < 3; i++) {
		var button = new BigButton();
		button.on(Button.CLICK, this.onButtonClick, this);
		button.position.x = i * 105;
		this.buttonHolder.addChild(button);
		this.buttons.push(button);
	}

	var raiseSprite = new PIXI.Sprite(Resources.getInstance().getTexture("sliderKnob"));
	var arrowSprite = new PIXI.Sprite(Resources.getInstance().getTexture("upArrow"));
	arrowSprite.position.x = (raiseSprite.width - arrowSprite.width)*0.5 - 0.5;
	arrowSprite.position.y = (raiseSprite.height - arrowSprite.height)*0.5 - 2;
	raiseSprite.addChild(arrowSprite);

	this.raiseMenuButton = new Button(raiseSprite);
	this.raiseMenuButton.addEventListener(Button.CLICK, this.onRaiseMenuButtonClick, this);
	this.raiseMenuButton.position.x = 2*105 + 70;
	this.raiseMenuButton.position.y = -5;
	this.buttonHolder.addChild(this.raiseMenuButton);

	this.raiseMenuButton.visible = false;
	this.createRaiseAmountMenu();

	this.setButtons([], 0, -1, -1);

	this.buttonsDatas = [];
}

FunctionUtil.extend(ButtonsView, PIXI.DisplayObjectContainer);
EventDispatcher.init(ButtonsView);

ButtonsView.BUTTON_CLICK = "buttonClick";


/**
 * Create raise amount menu.
 * @method createRaiseAmountMenu
 */
ButtonsView.prototype.createRaiseAmountMenu = function() {
	this.raiseAmountMenu = new PIXI.DisplayObjectContainer();

	this.raiseMenuBackground = new NineSlice(Resources.getInstance().getTexture("chatBackground"), 10, 10, 10, 10);
	this.raiseMenuBackground.position.x = 0;
	this.raiseMenuBackground.position.y = 0;
	this.raiseMenuBackground.width = 125;
	this.raiseMenuBackground.height = 220;
	this.raiseAmountMenu.addChild(this.raiseMenuBackground);

	this.raiseAmountMenu.x = 645;
	this.raiseAmountMenu.y = 570 - this.raiseAmountMenu.height;
	this.addChild(this.raiseAmountMenu);

	var styleObject = {
		font: "bold 18px Arial",
	};

	var t = new PIXI.Text("RAISE TO", styleObject);
	t.position.x = (125 - t.width)*0.5;
	t.position.y = 10;
	this.raiseAmountMenu.addChild(t);

	this.raiseShortcutButtons = new Array();

	for(var i = 0; i < 6; i++) {
		var b = new RaiseShortcutButton();
		b.addEventListener(Button.CLICK, this.onRaiseShortcutClick, this);
		b.position.x = 10;
		b.position.y = 35 + i*30;

		this.raiseAmountMenu.addChild(b);
		this.raiseShortcutButtons.push(b);
	}

/*
	PixiTextinput should be used.
	this.raiseAmountMenuInput=new TextField();
	this.raiseAmountMenuInput.x=10;
	this.raiseAmountMenuInput.y=40+30*5;
	this.raiseAmountMenuInput.width=105;
	this.raiseAmountMenuInput.height=19;
	this.raiseAmountMenuInput.border=true;
	this.raiseAmountMenuInput.borderColor=0x404040;
	this.raiseAmountMenuInput.background=true;
	this.raiseAmountMenuInput.multiline=false;
	this.raiseAmountMenuInput.type=TextFieldType.INPUT;
	this.raiseAmountMenuInput.addEventListener(Event.CHANGE,onRaiseAmountMenuInputChange);
	this.raiseAmountMenuInput.addEventListener(KeyboardEvent.KEY_DOWN,onRaiseAmountMenuInputKeyDown);
	this.raiseAmountMenu.addChild(this.raiseAmountMenuInput);
	*/

	this.raiseAmountMenu.visible = false;
}

/**
 * Raise amount button.
 * @method onRaiseMenuButtonClick
 */
ButtonsView.prototype.onRaiseShortcutClick = function() {
	/*var b = cast e.target;

	_raiseAmountMenu.visible=false;

	buttons[_sliderIndex].value=b.value;
	_slider.value=(buttons[_sliderIndex].value-_sliderMin)/(_sliderMax-_sliderMin);
	_raiseAmountMenuInput.text=Std.string(buttons[_sliderIndex].value);

	trace("value click: "+b.value);*/
}



/**
 * Raise amount button.
 * @method onRaiseMenuButtonClick
 */
ButtonsView.prototype.onRaiseMenuButtonClick = function() {
	this.raiseAmountMenu.visible = !this.raiseAmountMenu.visible;
/*
	if(this.raiseAmountMenu.visible) {
		this.stage.mousedown = this.onStageMouseDown.bind(this);
		// this.raiseAmountMenuInput.focus();
		// this.raiseAmountMenuInput.SelectAll
	}
	else {
		this.stage.mousedown = null;
	}*/
}

/**
 * Slider change.
 * @method onSliderChange
 */
ButtonsView.prototype.onSliderChange = function() {
	var newValue = Math.round(this.sliderMin + this.slider.getValue()*(this.sliderMax - this.sliderMin));
	this.buttons[this.sliderIndex].setValue(newValue);
	this.buttonDatas[this.sliderIndex].value = newValue;
	console.log("newValue = " + newValue);

	//this.raiseAmountMenuInput.setText(buttons[_sliderIndex].value.toString());
}

/**
 * Show slider.
 * @method showSlider
 */
ButtonsView.prototype.showSlider = function(index, min, max) {
	console.log("showSlider");
	this.sliderIndex = index;
	this.sliderMin = min;
	this.sliderMax = max;

	console.log("this.buttonDatas["+index+"] = " + this.buttonDatas[index].getValue() + ", min = " + min + ", max = " + max);
	this.slider.setValue((this.buttonDatas[index].getValue() - min)/(max - min));
	console.log("this.slider.getValue() = " + this.slider.getValue());
	this.slider.visible = true;
	this.slider.show();
}

/**
 * Clear.
 * @method clear
 */
ButtonsView.prototype.clear = function(buttonDatas) {
	this.setButtons([], 0, -1, -1);
}

/**
 * Set button datas.
 * @method setButtons
 */
ButtonsView.prototype.setButtons = function(buttonDatas, sliderButtonIndex, min, max) {
	this.buttonDatas = buttonDatas;

	for (var i = 0; i < this.buttons.length; i++) {
		var button = this.buttons[i];
		if (i >= buttonDatas.length) {
			button.visible = false;
			continue;
		}

		var buttonData = buttonDatas[i];

		button.visible = true;
		button.setLabel(buttonData.getButtonString());
		button.setValue(buttonData.getValue());

	}

	if((min >= 0) && (max >= 0))
		this.showSlider(sliderButtonIndex, min, max);

	this.buttonHolder.position.x = 366;

	if (buttonDatas.length < 3)
		this.buttonHolder.position.x += 45;
}

/**
 * Button click.
 * @method onButtonClick
 * @private
 */
ButtonsView.prototype.onButtonClick = function(e) {
	var buttonIndex = -1;

	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].visible = false;
		if (e.target == this.buttons[i])
			buttonIndex = i;
	}

	this.slider.visible = false;

	//console.log("button click: " + buttonIndex);
	var buttonData = this.buttonDatas[buttonIndex];

	this.trigger({
		type: ButtonsView.BUTTON_CLICK,
		button: buttonData.getButton(),
		value: buttonData.getValue()
	});
}

module.exports = ButtonsView;
},{"../../utils/Button":68,"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/NineSlice":76,"../../utils/Slider":80,"../resources/Resources":14,"./BigButton":15,"./RaiseShortcutButton":26,"pixi.js":3}],17:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * A card view.
 * @class CardView
 * @module client
 */
function CardView() {
	PIXI.DisplayObjectContainer.call(this);
	this.targetPosition = null;




	this.frame = new PIXI.Sprite(Resources.getInstance().getTexture("cardFrame"));
	this.addChild(this.frame);

	this.suit = new PIXI.Sprite(Resources.getInstance().getTextures("suitSymbols")[0]);
	this.suit.position.x = 8;
	this.suit.position.y = 25;
	this.addChild(this.suit);

	var style = {
		font: "bold 16px Arial"
	};

	this.valueField = new PIXI.Text("[val]", style);
	this.valueField.position.x = 6;
	this.valueField.position.y = 5;
	this.addChild(this.valueField);

	this.back = new PIXI.Sprite(Resources.getInstance().getTexture("cardBack"));
	this.addChild(this.back);


	this.maskGraphics = new PIXI.Graphics();
	this.maskGraphics.beginFill(0x000000);
	this.maskGraphics.drawRect(0, 0, 87, this.height);
	this.maskGraphics.endFill();
	this.addChild(this.maskGraphics);

	this.mask = this.maskGraphics;
}

FunctionUtil.extend(CardView, PIXI.DisplayObjectContainer);
EventDispatcher.init(CardView);

/**
 * Set card data.
 * @method setCardData
 */
CardView.prototype.setCardData = function(cardData) {
	this.cardData = cardData;


	if (this.cardData.isShown()) {
		/*
		this.back.visible = false;
		this.frame.visible = true;
*/
		this.valueField.style.fill = this.cardData.getColor();

		this.valueField.setText(this.cardData.getCardValueString());
		this.valueField.updateTransform();
		this.valueField.position.x = 17 - this.valueField.canvas.width / 2;

		this.suit.setTexture(Resources.getInstance().getTextures("suitSymbols")[this.cardData.getSuitIndex()]);
	}
	this.back.visible = true;
	this.frame.visible = false;
}

/**
 * Set card data.
 * @method setCardData
 */
CardView.prototype.setTargetPosition = function(point) {
	this.targetPosition = point;

	this.position.x = point.x;
	this.position.y = point.y;
}

/**
 * Hide.
 * @method hide
 */
CardView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Show.
 * @method show
 */
CardView.prototype.show = function(animate, delay) {
	/*if(delay == undefined)
		delay = 1;
	*/
	this.maskGraphics.scale.y = 1;
	this.position.x = this.targetPosition.x;
	this.position.y = this.targetPosition.y;
	if(!animate) {
		this.visible = true;
		this.onShowComplete();
		return;
	}
	this.mask.height = this.height;

	var destination = {x: this.position.x, y: this.position.y};
	this.position.x = (this.parent.width - this.width)*0.5;
	this.position.y = -this.height;

	var diffX = this.position.x - destination.x;
	var diffY = this.position.y - destination.y;
	var diff = Math.sqrt(diffX*diffX + diffY*diffY);

	var tween = new TWEEN.Tween( this.position )
//            .delay(delay)
            .to( { x: destination.x, y: destination.y }, 500 )
            .easing( TWEEN.Easing.Quadratic.Out )
            .onStart(this.onShowStart.bind(this))
            .onComplete(this.onShowComplete.bind(this))
            .start();
}

/**
 * Show complete.
 * @method onShowComplete
 */
CardView.prototype.onShowStart = function() {
	this.visible = true;
}

/**
 * Show complete.
 * @method onShowComplete
 */
CardView.prototype.onShowComplete = function() {
	if(this.cardData.isShown()) {
		this.back.visible = false;
		this.frame.visible = true;
	}
	this.dispatchEvent("animationDone", this);
}

/**
 * Fold.
 * @method fold
 */
CardView.prototype.fold = function() {
	var o = {
		x: this.targetPosition.x,
		y: this.targetPosition.y+80
	};

	var time = 500;// Settings.instance.scaleAnimationTime(500);
	this.t0 = new TWEEN.Tween(this.position)
			.to(o, time)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(this.onFoldUpdate.bind(this))
			.onComplete(this.onFoldComplete.bind(this))
			.start();
}

/**
 * Fold animation update.
 * @method onFoldUpdate
 */
CardView.prototype.onFoldUpdate = function(progress) {
	this.maskGraphics.scale.y = 1 - progress;
}

/**
 * Fold animation complete.
 * @method onFoldComplete
 */
CardView.prototype.onFoldComplete = function() {
	this.dispatchEvent("animationDone");
}

module.exports = CardView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],18:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var NineSlice = require("../../utils/NineSlice");
var Slider = require("../../utils/Slider");
var Resources = require("../resources/Resources");
var PixiTextInput = require("PixiTextInput");
var MouseOverGroup = require("../../utils/MouseOverGroup");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * Chat view.
 * @class ChatView
 * @module client
 */
function ChatView() {
	PIXI.DisplayObjectContainer.call(this);

	this.margin = 5;

	
	var chatPlate = new NineSlice(Resources.getInstance().getTexture("framePlate"), 10);
	chatPlate.position.x = 10;
	chatPlate.position.y = 540;
	chatPlate.setLocalSize(330, 130);
	this.addChild(chatPlate);

	var s = new NineSlice(Resources.getInstance().getTexture("framePlate"), 10);
	s.position.x = 10;
	s.position.y = 675;
	s.setLocalSize(330, 35);
	this.addChild(s);

	var styleObject = {
		font: "12px Arial",
		wordWrapWidth: 310,
		height: 114,
		border: true,
		color: 0xFFFFFF,
		borderColor: 0x404040,
		wordWrap: true,
		multiline: true
	};

	this.container = new PIXI.DisplayObjectContainer();
	this.addChild(this.container);
	this.container.position.x = 20;
	this.container.position.y = 548;

	this.chatMask = new PIXI.Graphics();
	this.chatMask.beginFill(123);
	this.chatMask.drawRect(0, 0, 310, 114);
	this.chatMask.endFill();
	this.container.addChild(this.chatMask);

	this.chatText = new PIXI.Text("", styleObject);
	this.container.addChild(this.chatText);
	this.chatText.mask = this.chatMask;



	var styleObject = {
		font: "14px Arial",
		width: 310,
		height: 19,
		border: true,
		borderColor: 0x404040,
		background: true,
		multiline: true
	};
	this.inputField = new PixiTextInput("", styleObject);
	this.inputField.position.x = this.container.position.x;
	this.inputField.position.y = 683;
	this.inputField.width = 310;
	this.inputField.keydown = this.onKeyDown.bind(this);

	var inputShadow = new PIXI.Graphics();
	inputShadow.beginFill(0x000000);
	inputShadow.drawRect(-1, -1, 311, 20);
	inputShadow.position.x = this.inputField.position.x;
	inputShadow.position.y = this.inputField.position.y;
	this.addChild(inputShadow);

	var inputBackground = new PIXI.Graphics();
	inputBackground.beginFill(0xFFFFFF);
	inputBackground.drawRect(0, 0, 310, 19);
	inputBackground.position.x = this.inputField.position.x;
	inputBackground.position.y = this.inputField.position.y;
	this.addChild(inputBackground);

	this.addChild(this.inputField);



	var slideBack = new NineSlice(Resources.getInstance().getTexture("textScrollbarTrack"), 10, 0, 10, 0);
	slideBack.width = 107;
	var slideKnob = new NineSlice(Resources.getInstance().getTexture("textScrollbarThumb"), 10, 0, 10, 0);
	slideKnob.width = 30;


	this.slider = new Slider(slideBack, slideKnob);
	this.slider.rotation = Math.PI*0.5;
	this.slider.position.x = 326;
	this.slider.position.y = 552;
	this.slider.setValue(1);
	this.slider.visible = false;
	this.slider.addEventListener("change", this.onSliderChange.bind(this));
	this.addChild(this.slider);


	this.mouseOverGroup = new MouseOverGroup();
	this.mouseOverGroup.addDisplayObject(this.chatText);
	this.mouseOverGroup.addDisplayObject(this.slider);
	this.mouseOverGroup.addDisplayObject(this.chatMask);
	this.mouseOverGroup.addDisplayObject(chatPlate);
	this.mouseOverGroup.addEventListener("mouseover", this.onChatFieldMouseOver, this);
	this.mouseOverGroup.addEventListener("mouseout", this.onChatFieldMouseOut, this);

	this.clear();
}

FunctionUtil.extend(ChatView, PIXI.DisplayObjectContainer);
EventDispatcher.init(ChatView);



/**
 * Clear messages.
 * @method clear
 */
ChatView.prototype.clear = function() {
	this.chatText.setText("");
 	this.chatText.y = -Math.round(this.slider.getValue()*(this.chatText.height + this.margin - this.chatMask.height ));
	this.slider.setValue(1);
}


/**
 *  Add text.
 * @method clear
 */
ChatView.prototype.addText = function(user, text) {
	this.chatText.setText(this.chatText.text + user + ": " + text + "\n");
 	this.chatText.y = -Math.round(this.slider.getValue()*(this.chatText.height + this.margin - this.chatMask.height ));
	this.slider.setValue(1);
}

/**
 * On slider value change
 * @method onSliderChange
 */
 ChatView.prototype.onSliderChange = function() {
 	this.chatText.y = -Math.round(this.slider.getValue()*(this.chatText.height + this.margin - this.chatMask.height));
 }


/**
 * On mouse over
 * @method onChatFieldMouseOver
 */
 ChatView.prototype.onChatFieldMouseOver = function() {
	this.slider.show();
 }


/**
 * On mouse out
 * @method onChatFieldMouseOut
 */
 ChatView.prototype.onChatFieldMouseOut = function() {
	this.slider.hide();
 }


/**
 * On key down
 * @method onKeyDown
 */
 ChatView.prototype.onKeyDown = function(event) {
	if(event.keyCode == 13) {
		this.dispatchEvent("chat", this.inputField.text);
		
		this.inputField.setText("");
		
	}
 }



module.exports = ChatView;

},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/MouseOverGroup":75,"../../utils/NineSlice":76,"../../utils/Slider":80,"../resources/Resources":14,"PixiTextInput":1,"pixi.js":3}],19:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * A chips view.
 * @class ChipsView
 * @module client
 */
function ChipsView(showToolTip) {
	PIXI.DisplayObjectContainer.call(this);
	this.targetPosition = null;

	this.align = Resources.getInstance().Align.Left;

	this.value = 0;

	this.denominations = [500000, 100000, 25000, 5000, 1000, 500, 100, 25, 5, 1];

	this.stackClips = new Array();
	this.holder = new PIXI.DisplayObjectContainer();
	this.addChild(this.holder);

	this.toolTip = null;

	if (showToolTip) {
		this.toolTip = new ToolTip();
		this.addChild(this.toolTip);
	}

}

FunctionUtil.extend(ChipsView, PIXI.DisplayObjectContainer);
EventDispatcher.init(ChipsView);

/**
 * Set alignment.
 * @method setCardData
 */
ChipsView.prototype.setAlignment = function(align) {
	if (!align)
		throw new Error("unknown alignment: " + align);

	this.align = align;
}

/**
 * Set target position.
 * @method setTargetPosition
 */
ChipsView.prototype.setTargetPosition = function(position) {
	this.targetPosition = position;
	this.position.x = position.x;
	this.position.y = position.y;
}

/**
 * Set value.
 * @method setValue
 */
ChipsView.prototype.setValue = function(value) {
	this.value = value;

	var sprite;

	for (var i = 0; i < this.stackClips.length; i++)
		this.holder.removeChild(this.stackClips[i]);

	this.stackClips = new Array();

	if (this.toolTip != null)
		this.toolTip.text = "Bet: " + this.value.toString();

	var i;
	var stackClip = null;
	var stackPos = 0;
	var chipPos = 0;
	var textures = Resources.getInstance().getTextures("chips");

	for (i = 0; i < this.denominations.length; i++) {
		var denomination = this.denominations[i];

		chipPos = 0;
		stackClip = null;
		while (value >= denomination) {
			if (stackClip == null) {
				stackClip = new PIXI.DisplayObjectContainer();
				stackClip.x = stackPos;
				stackPos += 40;
				this.holder.addChild(stackClip);
				this.stackClips.push(stackClip);
			}
			var texture = textures[i % textures.length];
			var chip = new PIXI.Sprite(texture);
			chip.position.y = chipPos;
			chipPos -= 5;
			stackClip.addChild(chip);
			value -= denomination;

			var denominationString;

			if (denomination >= 1000)
				denominationString = Math.round(denomination / 1000) + "K";

			else
				denominationString = denomination;

			if ((stackClip != null) && (value < denomination)) {

				var textField = new PIXI.Text(denominationString, {
					font: "bold 12px Arial",
					align: "center",
					fill: Resources.getInstance().getValue("chipsColors")[i % Resources.getInstance().getValue("chipsColors").length]
				});
				textField.position.x = (stackClip.width - textField.width) * 0.5;
				textField.position.y = chipPos + 11;
				textField.alpha = 0.5;
				/*
				textField.width = stackClip.width - 1;
				textField.height = 20;*/

				stackClip.addChild(textField);
			}
		}
	}

	switch (this.align) {
		case Resources.getInstance().Align.Left:
			{
				this.holder.x = 0;
				break;
			}

		case Resources.getInstance().Align.Center:
			{
				this.holder.x = -this.holder.width / 2;
				break;
			}

		case Resources.getInstance().Align.Right:
			this.holder.x = -this.holder.width;
	}
}

/**
 * Hide.
 * @method hide
 */
ChipsView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Show.
 * @method show
 */
ChipsView.prototype.show = function() {
	this.visible = true;

	var destination = {
		x: this.targetPosition.x,
		y: this.targetPosition.y
	};
	this.position.x = (this.parent.width - this.width) * 0.5;
	this.position.y = -this.height;

	var diffX = this.position.x - destination.x;
	var diffY = this.position.y - destination.y;
	var diff = Math.sqrt(diffX * diffX + diffY * diffY);

	var tween = new TWEEN.Tween(this.position)
		.to({
			x: destination.x,
			y: destination.y
		}, 3 * diff)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onComplete(this.onShowComplete.bind(this))
		.start();
}

/**
 * Show complete.
 * @method onShowComplete
 */
ChipsView.prototype.onShowComplete = function() {

	this.dispatchEvent("animationDone", this);
}

/**
 * Animate in.
 * @method animateIn
 */
ChipsView.prototype.animateIn = function() {
	var o = {
		y: Resources.getInstance().getPoint("potPosition").y
	};

	switch (this.align) {
		case Resources.getInstance().Align.Left:
			o.x = Resources.getInstance().getPoint("potPosition").x - this.width / 2;

		case Resources.getInstance().Align.Center:
			o.x = Resources.getInstance().getPoint("potPosition").x;

		case Resources.getInstance().Align.Right:
			o.x = Resources.getInstance().getPoint("potPosition").x + this.width / 2;
	}

	var time = 500;
	var tween = new TWEEN.Tween(this)
		.to({
			y: Resources.getInstance().getPoint("potPosition").y,
			x: o.x
		}, time)
		.onComplete(this.onInAnimationComplete.bind(this))
		.start();
}

/**
 * In animation complete.
 * @method onInAnimationComplete
 */
ChipsView.prototype.onInAnimationComplete = function() {
	this.setValue(0);

	this.position.x = this.targetPosition.x;
	this.position.y = this.targetPosition.y;

	this.dispatchEvent("animationDone", this);
}

/**
 * Animate out.
 * @method animateOut
 */
ChipsView.prototype.animateOut = function() {
	this.position.y = Resources.getInstance().getPoint("potPosition").y;

	switch (this.align) {
		case Resources.getInstance().Align.Left:
			this.position.x = Resources.getInstance().getPoint("potPosition").x - this.width / 2;

		case Resources.getInstance().Align.Center:
			this.position.x = Resources.getInstance().getPoint("potPosition").x;

		case Resources.getInstance().Align.Right:
			this.position.x = Resources.getInstance().getPoint("potPosition").x + this.width / 2;
	}

	var o = {
		x: this.targetPosition.x,
		y: this.targetPosition.y
	};

	var time = 500;
	var tween = new TWEEN.Tween(this)
		.to(o, time)
		.onComplete(this.onOutAnimationComplete.bind(this))
		.start();

}

/**
 * Out animation complete.
 * @method onOutAnimationComplete
 */
ChipsView.prototype.onOutAnimationComplete = function() {

	var time = 500;
	var tween = new TWEEN.Tween({
			x: 0
		})
		.to({
			x: 10
		}, time)
		.onComplete(this.onOutWaitAnimationComplete.bind(this))
		.start();

	this.position.x = this.targetPosition.x;
	this.position.y = this.targetPosition.y;

}

/**
 * Out wait animation complete.
 * @method onOutWaitAnimationComplete
 */
ChipsView.prototype.onOutWaitAnimationComplete = function() {

	this.setValue(0);

	this.dispatchEvent("animationDone", this);
}

module.exports = ChipsView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],20:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * Dialog view.
 * @class DealerButtonView
 * @module client
 */
function DealerButtonView() {
	PIXI.DisplayObjectContainer.call(this);


	var dealerButtonTexture = Resources.getInstance().getTexture("dealerButton");
	this.sprite = new PIXI.Sprite(dealerButtonTexture);
	this.addChild(this.sprite);
	this.hide();
}

FunctionUtil.extend(DealerButtonView, PIXI.DisplayObjectContainer);
EventDispatcher.init(DealerButtonView);

/**
 * Set seat index
 * @method setSeatIndex
 */
DealerButtonView.prototype.setSeatIndex = function(seatIndex) {
	this.position.x = Resources.getInstance().getPoints("dealerButtonPositions")[seatIndex].x;
	this.position.y = Resources.getInstance().getPoints("dealerButtonPositions")[seatIndex].y;
	this.dispatchEvent("animationDone", this);
};

/**
 * Animate to seat index.
 * @method animateToSeatIndex
 */
DealerButtonView.prototype.animateToSeatIndex = function(seatIndex) {
	if (!this.visible) {
		this.setSeatIndex(seatIndex);
		// todo dispatch event that it's complete?
		this.dispatchEvent("animationDone", this);
		return;
	}
	var destination = Resources.getInstance().getPoints("dealerButtonPositions")[seatIndex];
	var diffX = this.position.x - destination.x;
	var diffY = this.position.y - destination.y;
	var diff = Math.sqrt(diffX * diffX + diffY * diffY);

	var tween = new TWEEN.Tween(this.position)
		.to({
			x: destination.x,
			y: destination.y
		}, 5 * diff)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onComplete(this.onShowComplete.bind(this))
		.start();
};

/**
 * Show Complete.
 * @method onShowComplete
 */
DealerButtonView.prototype.onShowComplete = function() {
	this.dispatchEvent("animationDone", this);
}

/**
 * Hide.
 * @method hide
 */
DealerButtonView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Show.
 * @method show
 */
DealerButtonView.prototype.show = function(seatIndex, animate) {
	if (this.visible && animate) {
		this.animateToSeatIndex(seatIndex);
	} else {
		this.visible = true;
		this.setSeatIndex(seatIndex);
	}
}

module.exports = DealerButtonView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],21:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var Resources = require("../resources/Resources");

/**
 * Dialog button.
 * @class DialogButton
 * @module client
 */
function DialogButton() {
	Button.call(this);

	this.buttonTexture = Resources.getInstance().getTexture("dialogButton");
	this.addChild(new PIXI.Sprite(this.buttonTexture));

	var style = {
		font: "normal 14px Arial",
		fill: "#ffffff"
	};

	this.textField = new PIXI.Text("[test]", style);
	this.textField.position.y = 15;
	this.addChild(this.textField);

	this.setText("BTN");
}

FunctionUtil.extend(DialogButton, Button);

/**
 * Set text for the button.
 * @method setText
 */
DialogButton.prototype.setText = function(text) {
	this.textField.setText(text);
	this.textField.updateTransform();
	this.textField.x = this.buttonTexture.width / 2 - this.textField.width / 2;
}

module.exports = DialogButton;
},{"../../utils/Button":68,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3}],22:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");
var DialogButton = require("./DialogButton");
var ButtonData = require("../../proto/data/ButtonData");
var PixiTextInput = require("PixiTextInput");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * Dialog view.
 * @class DialogView
 * @module client
 */
function DialogView() {
	PIXI.DisplayObjectContainer.call(this);

	var cover = new PIXI.Graphics();
	cover.beginFill(0x000000, .5);
	cover.drawRect(0, 0, 960, 720);
	cover.endFill();
	cover.interactive = true;
	//cover.buttonMode = true;
	cover.hitArea = new PIXI.Rectangle(0, 0, 960, 720);
	this.addChild(cover);

	var b = new NineSlice(Resources.getInstance().getTexture("framePlate"), 10);
	b.setLocalSize(480, 270);
	b.position.x = 480 - 480 / 2;
	b.position.y = 360 - 270 / 2;
	this.addChild(b);

	style = {
		font: "normal 14px Arial"
	};

	this.textField = new PIXI.Text("[text]", style);
	this.textField.position.x = b.position.x + 20;
	this.textField.position.y = b.position.y + 20;
	this.addChild(this.textField);

	this.buttonsHolder = new PIXI.DisplayObjectContainer();
	this.buttonsHolder.position.y = 430;
	this.addChild(this.buttonsHolder);
	this.buttons = [];

	for (var i = 0; i < 2; i++) {
		var b = new DialogButton();

		b.position.x = i * 90;
		b.on("click", this.onButtonClick, this);
		this.buttonsHolder.addChild(b);
		this.buttons.push(b);
	}

	style = {
		font: "normal 18px Arial"
	};

	this.inputField = new PixiTextInput("", style);
	this.inputField.position.x = this.textField.position.x;

	this.inputFrame = new PIXI.Graphics();
	this.inputFrame.beginFill(0x000000);
	this.inputFrame.drawRect(-1, -1, 102, 23);
	this.inputFrame.position.x = this.inputField.position.x;
	this.addChild(this.inputFrame);

	this.addChild(this.inputField);

	this.hide();
}

FunctionUtil.extend(DialogView, PIXI.DisplayObjectContainer);
EventDispatcher.init(DialogView);

DialogView.BUTTON_CLICK = "buttonClick";

/**
 * Hide.
 * @method hide
 */
DialogView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Show.
 * @method show
 */
DialogView.prototype.show = function(text, buttonIds, defaultValue) {
	this.visible = true;

	this.buttonIds = buttonIds;

	for (i = 0; i < this.buttons.length; i++) {
		if (i < buttonIds.length) {
			var button = this.buttons[i]
			button.setText(ButtonData.getButtonStringForId(buttonIds[i]));
			button.visible = true;
		} else {
			this.buttons[i].visible = false;
		}
	}

	this.buttonsHolder.x = 480 - buttonIds.length * 90 / 2;
	this.textField.setText(text);

	if (defaultValue) {
		this.inputField.position.y = this.textField.position.y + this.textField.height + 20;
		this.inputFrame.position.y = this.inputField.position.y;
		this.inputField.visible = true;
		this.inputFrame.visible = true;

		this.inputField.text = defaultValue;
		this.inputField.focus();
	} else {
		this.inputField.visible = false;
		this.inputFrame.visible = false;
	}
}

/**
 * Handle button click.
 * @method onButtonClick
 */
DialogView.prototype.onButtonClick = function(e) {
	var buttonIndex = -1;

	for (var i = 0; i < this.buttons.length; i++)
		if (e.target == this.buttons[i])
			buttonIndex = i;

	var value = null;
	if (this.inputField.visible)
		value = this.inputField.text;

	var ev = {
		type: DialogView.BUTTON_CLICK,
		button: this.buttonIds[buttonIndex],
		value: value
	};

	this.trigger(ev);
	this.hide();
}

module.exports = DialogView;
},{"../../proto/data/ButtonData":33,"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/NineSlice":76,"../resources/Resources":14,"./DialogButton":21,"PixiTextInput":1,"pixi.js":3}],23:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Gradient = require("../../utils/Gradient");

/**
 * Loading screen.
 * @class LoadingScreen
 * @module client
 */
function LoadingScreen() {
	PIXI.DisplayObjectContainer.call(this);

	var gradient = new Gradient();
	gradient.setSize(100, 100);
	gradient.addColorStop(0, "#ffffff");
	gradient.addColorStop(1, "#c0c0c0");

	var s = gradient.createSprite();
	s.position.x=-1000;
	s.position.y=-1000;
	s.width = 960+2000;
	s.height = 720+2000;
	this.addChild(s);

	var style = {
		font: "bold 20px Arial",
		fill: "#808080"
	};

	this.textField = new PIXI.Text("[text]", style);
	this.textField.position.x = 960 / 2;
	this.textField.position.y = 720 / 2 - this.textField.height / 2;
	this.addChild(this.textField);
}

FunctionUtil.extend(LoadingScreen, PIXI.DisplayObjectContainer);

/**
 * Show.
 * @method show
 */
LoadingScreen.prototype.show = function(message) {
	this.textField.setText(message);
	this.textField.updateTransform();
	this.textField.x = 960 / 2 - this.textField.width / 2;
	this.visible = true;
}

/**
 * Hide.
 * @method hide
 */
LoadingScreen.prototype.hide = function() {
	this.visible = false;
}

module.exports = LoadingScreen;
},{"../../utils/FunctionUtil":72,"../../utils/Gradient":73,"pixi.js":3}],24:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var EventDispatcher = require("../../utils/EventDispatcher");
var Resources = require("../resources/Resources");
var SeatView = require("./SeatView");
var CardView = require("./CardView");
var ChatView = require("./ChatView");
var Point = require("../../utils/Point");
var Gradient = require("../../utils/Gradient");
var ButtonsView = require("./ButtonsView");
var DialogView = require("./DialogView");
var DealerButtonView = require("./DealerButtonView");
var ChipsView = require("./ChipsView");
var PotView = require("./PotView");
var TimerView = require("./TimerView");
var SettingsView = require("../view/SettingsView");
var TableInfoView = require("../view/TableInfoView");

/**
 * Net poker client view.
 * @class NetPokerClientView
 * @module client
 */
function NetPokerClientView() {
	PIXI.DisplayObjectContainer.call(this);

	this.setupBackground();

	this.tableContainer = new PIXI.DisplayObjectContainer();
	this.addChild(this.tableContainer);

	this.tableBackground = new PIXI.Sprite(Resources.getInstance().getTexture("tableBackground"));
	this.tableContainer.addChild(this.tableBackground);

	this.setupSeats();
	this.setupCommunityCards();

	this.timerView = new TimerView();
	this.tableContainer.addChild(this.timerView);

	this.chatView = new ChatView();
	this.addChild(this.chatView);

	this.buttonsView = new ButtonsView();
	this.addChild(this.buttonsView);

	this.dealerButtonView = new DealerButtonView();
	this.addChild(this.dealerButtonView);

	this.tableInfoView = new TableInfoView();
	this.addChild(this.tableInfoView);

	this.potView = new PotView();
	this.addChild(this.potView);
	this.potView.position.x = Resources.getInstance().getPoint("potPosition").x;
	this.potView.position.y = Resources.getInstance().getPoint("potPosition").y;

	this.settingsView = new SettingsView();
	this.addChild(this.settingsView);

	this.dialogView = new DialogView();
	this.addChild(this.dialogView);

	this.setupChips();
}

FunctionUtil.extend(NetPokerClientView, PIXI.DisplayObjectContainer);
EventDispatcher.init(NetPokerClientView);

NetPokerClientView.SEAT_CLICK = "seatClick";

/**
 * Setup background.
 * @method setupBackground
 */
NetPokerClientView.prototype.setupBackground = function() {
	var g=new PIXI.Graphics();
	g.beginFill(0x05391d,1);
	g.drawRect(-1000,0,960+2000,720);
	g.endFill();
	this.addChild(g);

	var g=new PIXI.Graphics();
	g.beginFill(0x909090,1);
	g.drawRect(-1000,720,960+2000,1000);
	g.endFill();
	this.addChild(g);

	var gradient = new Gradient();
	gradient.setSize(100, 100);
	gradient.addColorStop(0, "#606060");
	gradient.addColorStop(.05, "#a0a0a0");
	gradient.addColorStop(1, "#909090");

	var s = gradient.createSprite();
	s.position.y=530;
	s.position.x=-1000;
	s.width = 960+2000;
	s.height = 190;
	this.addChild(s);

	var s = new PIXI.Sprite(Resources.getInstance().getTexture("dividerLine"));
	s.x = 345;
	s.y = 540;
	this.addChild(s);

	var s = new PIXI.Sprite(Resources.getInstance().getTexture("dividerLine"));
	s.x = 693;
	s.y = 540;
	this.addChild(s);
}

/**
 * Setup seats.
 * @method serupSeats
 */
NetPokerClientView.prototype.setupSeats = function() {
	var i, j;
	var pocketCards;

	this.seatViews = [];

	for (i = 0; i < Resources.getInstance().getPoints("seatPositions").length; i++) {
		var seatView = new SeatView(i);
		var p = seatView.position;

		for (j = 0; j < 2; j++) {
			var c = new CardView();
			c.hide();
			c.setTargetPosition(Point(p.x + j * 30 - 60, p.y - 100));
			this.tableContainer.addChild(c);
			seatView.addPocketCard(c);
			seatView.on("click", this.onSeatClick, this);
		}

		this.tableContainer.addChild(seatView);
		this.seatViews.push(seatView);
	}
}

/**
 * Setup chips.
 * @method serupSeats
 */
NetPokerClientView.prototype.setupChips = function() {
	var i;
	for (i = 0; i < Resources.getInstance().getPoints("betPositions").length; i++) {
		var chipsView = new ChipsView();
		this.seatViews[i].setBetChipsView(chipsView);

		chipsView.setAlignment(Resources.getInstance().getValue("betAlign")[i]);
		chipsView.setTargetPosition(Resources.getInstance().getPoints("betPositions")[i]);
		this.tableContainer.addChild(chipsView);
	}
}

/**
 * Seat click.
 * @method onSeatClick
 * @private
 */
NetPokerClientView.prototype.onSeatClick = function(e) {
	var seatIndex = -1;

	for (var i = 0; i < this.seatViews.length; i++)
		if (e.target == this.seatViews[i])
			seatIndex = i;

	console.log("seat click: " + seatIndex);
	this.trigger({
		type: NetPokerClientView.SEAT_CLICK,
		seatIndex: seatIndex
	});
}

/**
 * Setup community cards.
 * @method setupCommunityCards
 * @private
 */
NetPokerClientView.prototype.setupCommunityCards = function() {
	this.communityCards = [];

	var p = Resources.getInstance().getPoint("communityCardsPosition");

	for (i = 0; i < 5; i++) {
		var cardView = new CardView();
		cardView.hide();
		cardView.setTargetPosition(Point(p.x + i * 90, p.y));

		this.communityCards.push(cardView);
		this.tableContainer.addChild(cardView);
	}
}

/**
 * Get seat view by index.
 * @method getSeatViewByIndex
 */
NetPokerClientView.prototype.getSeatViewByIndex = function(index) {
	return this.seatViews[index];
}

/**
 * Get seat view by index.
 * @method getSeatViewByIndex
 */
NetPokerClientView.prototype.getCommunityCards = function() {
	return this.communityCards;
}

/**
 * Get buttons view.
 * @method getSeatViewByIndex
 */
NetPokerClientView.prototype.getButtonsView = function() {
	return this.buttonsView;
}

/**
 * Get dialog view.
 * @method getDialogView
 */
NetPokerClientView.prototype.getDialogView = function() {
	return this.dialogView;
}

/**
 * Get dialog view.
 * @method getDealerButtonView
 */
NetPokerClientView.prototype.getDealerButtonView = function() {
	return this.dealerButtonView;
}

/**
 * Get table info view.
 * @method getTableInfoView
 */
NetPokerClientView.prototype.getTableInfoView = function() {
	return this.tableInfoView;
}

/**
 * Clear everything to an empty state.
 * @method clear
 */
NetPokerClientView.prototype.clear = function() {
	var i;

	for (i = 0; i < this.communityCards.length; i++)
		this.communityCards[i].hide();

	for (i = 0; i < this.seatViews.length; i++)
		this.seatViews[i].clear();

	this.timerView.hide();
	this.potView.setValues(new Array());
	this.dealerButtonView.hide();
	this.chatView.clear();

	this.dialogView.hide();
	this.buttonsView.clear();

	this.tableInfoView.clear();
}

module.exports = NetPokerClientView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/Gradient":73,"../../utils/Point":78,"../resources/Resources":14,"../view/SettingsView":29,"../view/TableInfoView":30,"./ButtonsView":16,"./CardView":17,"./ChatView":18,"./ChipsView":19,"./DealerButtonView":20,"./DialogView":22,"./PotView":25,"./SeatView":27,"./TimerView":31,"pixi.js":3}],25:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");
var ChipsView = require("./ChipsView");

/**
 * A pot view
 * @class PotView
 * @module client
 */
function PotView() {
	PIXI.DisplayObjectContainer.call(this);
	
	this.value = 0;

	this.holder = new PIXI.DisplayObjectContainer();
	this.addChild(this.holder);

	this.stacks = new Array();
}

FunctionUtil.extend(PotView, PIXI.DisplayObjectContainer);
EventDispatcher.init(PotView);

/**
 * Set value.
 * @method setValue
 */
PotView.prototype.setValues = function(values) {
	
	for(var i = 0; i < this.stacks.length; i++)
		this.holder.removeChild(this.stacks[i]);

	this.stacks = new Array();

	var pos = 0;

	for(var i = 0; i < values.length; i++) {
		var chips = new ChipsView(false);
		this.stacks.push(chips);
		this.holder.addChild(chips);
		chips.setValue(values[i]);
		chips.x = pos;
		pos += Math.floor(chips.width + 20);

		var textField = new PIXI.Text(values[i], {
			font: "bold 12px Arial",
			align: "center",
			fill: "#ffffff"
		});

		textField.position.x = (chips.width - textField.width)*0.5;
		textField.position.y = 30;

		chips.addChild(textField);
	}

	this.holder.x = -this.holder.width*0.5;
}

/**
 * Hide.
 * @method hide
 */
PotView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Show.
 * @method show
 */
PotView.prototype.show = function() {
	this.visible = true;

}

module.exports = PotView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../resources/Resources":14,"./ChipsView":19,"pixi.js":3,"tween.js":4}],26:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");
var Settings = require("../app/Settings");
var EventDispatcher = require("../../utils/EventDispatcher");
var Checkbox = require("../../utils/Checkbox");

/**
 * Raise shortcut button
 * @class RaiseShortcutButton
 * @module client
 */
 function RaiseShortcutButton() {
 	var background = new NineSlice(Resources.getInstance().getTexture("buttonBackground"), 10, 5, 10, 5);
 	background.width = 105;
 	background.height = 25;
	Button.call(this, background);

 	var styleObject = {
 		width: 105,
 		height: 20,
 		font: "bold 14px Arial",
 		color: "white"
 	};
	this.label = new PIXI.Text("", styleObject);
	this.label.position.x = 8;
	this.label.position.y = 4;
	this.addChild(this.label);
}

FunctionUtil.extend(RaiseShortcutButton, Button);
EventDispatcher.init(RaiseShortcutButton);

/**
 * Setter.
 * @method setText
 */
RaiseShortcutButton.prototype.setText = function(string) {
	this.label.setText(string);
	return string;
}

/**
 * Set enabled.
 * @method setEnabled
 */
RaiseShortcutButton.prototype.setEnabled = function(value) {
	if(value) {
		this.alpha = 1;
		this.interactive = true;
		this.buttonMode = true;
	}
	else {
		this.alpha = 0.5;
		this.interactive = false;
		this.buttonMode = false;
	}
	return value;
}

module.exports = RaiseShortcutButton;
},{"../../utils/Button":68,"../../utils/Checkbox":69,"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/NineSlice":76,"../app/Settings":6,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],27:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var Button = require("../../utils/Button");

/**
 * A seat view.
 * @class SeatView
 * @module client
 */
function SeatView(seatIndex) {
	Button.call(this);

	this.pocketCards = [];
	this.seatIndex = seatIndex;

	var seatTexture = Resources.getInstance().getTexture("seatPlate");
	var seatSprite = new PIXI.Sprite(seatTexture);

	seatSprite.position.x = -seatTexture.width / 2;
	seatSprite.position.y = -seatTexture.height / 2;

	this.addChild(seatSprite);

	var pos = Resources.getInstance().getPoints("seatPositions")[this.seatIndex];

	this.position.x = pos.x;
	this.position.y = pos.y;

	var style;

	style = {
		font: "bold 20px Arial"
	};

	this.nameField = new PIXI.Text("[name]", style);
	this.nameField.position.y = -20;
	this.addChild(this.nameField);

	style = {
		font: "normal 12px Arial"
	};

	this.chipsField = new PIXI.Text("[name]", style);
	this.chipsField.position.y = 5;
	this.addChild(this.chipsField);

	style = {
		font: "bold 20px Arial"
	};

	this.actionField = new PIXI.Text("action", style);
	this.actionField.position.y = -13;
	this.addChild(this.actionField);
	this.actionField.alpha = 0;

	this.setName("");
	this.setChips("");

	this.betChips = null;
}

FunctionUtil.extend(SeatView, Button);

/**
 * Set reference to bet chips.
 * @method setBetChipsView
 */
SeatView.prototype.setBetChipsView = function(value) {
	this.betChips = value;
}

/**
 * Set name.
 * @method setName
 */
SeatView.prototype.setName = function(name) {
	this.nameField.setText(name);
	this.nameField.updateTransform();

	this.nameField.position.x = -this.nameField.canvas.width / 2;
}

/**
 * Set name.
 * @method setChips
 */
SeatView.prototype.setChips = function(chips) {
	this.chipsField.setText(chips);
	this.chipsField.updateTransform();

	this.chipsField.position.x = -this.chipsField.canvas.width / 2;
}

/**
 * Set sitout.
 * @method setSitout
 */
SeatView.prototype.setSitout = function(sitout) {
	if (sitout)
		this.alpha = .5;

	else
		this.alpha = 1;
}

/**
 * Set sitout.
 * @method setActive
 */
SeatView.prototype.setActive = function(active) {
	this.visible = active;
}

/**
 * Add pocket card.
 * @method addPocketCard
 */
SeatView.prototype.addPocketCard = function(cardView) {
	this.pocketCards.push(cardView);
}

/**
 * Get pocket cards.
 * @method getPocketCards
 */
SeatView.prototype.getPocketCards = function() {
	return this.pocketCards;
}

/**
 * Fold cards.
 * @method foldCards
 */
SeatView.prototype.foldCards = function() {
	this.pocketCards[0].addEventListener("animationDone", this.onFoldComplete, this);
	for (var i = 0; i < this.pocketCards.length; i++) {
		this.pocketCards[i].fold();
	}
}

/**
 * Fold complete.
 * @method onFoldComplete
 */
SeatView.prototype.onFoldComplete = function() {
	this.pocketCards[0].removeEventListener("animationDone", this.onFoldComplete, this);
	this.dispatchEvent("animationDone");
}

/**
 * Show user action.
 * @method action
 */
SeatView.prototype.action = function(action) {
	this.actionField.setText(action);
	this.actionField.position.x = -this.actionField.canvas.width / 2;

	this.actionField.alpha = 1;
	this.nameField.alpha = 0;
	this.chipsField.alpha = 0;

	setTimeout(this.onTimer.bind(this), 1000);
}

/**
 * Show user action.
 * @method action
 */
SeatView.prototype.onTimer = function(action) {

	var t1 = new TWEEN.Tween(this.actionField)
		.to({
			alpha: 0
		}, 1000)
		.start();
	var t2 = new TWEEN.Tween(this.nameField)
		.to({
			alpha: 1
		}, 1000)
		.start();
	var t3 = new TWEEN.Tween(this.chipsField)
		.to({
			alpha: 1
		}, 1000)
		.start();

}

/**
 * Clear.
 * @method clear
 */
SeatView.prototype.clear = function() {
	var i;

	this.visible = true;
	this.sitout = false;
	this.betChips.setValue(0);
	this.setName("");
	this.setChips("");

	for (i = 0; i < this.pocketCards.length; i++)
		this.pocketCards[i].hide();
}

module.exports = SeatView;
},{"../../utils/Button":68,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],28:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");
var Settings = require("../app/Settings");
var EventDispatcher = require("../../utils/EventDispatcher");
var Checkbox = require("../../utils/Checkbox");

/**
 * Checkboxes view
 * @class SettingsCheckbox
 * @module client
 */
function SettingsCheckbox(id, string) {
 	PIXI.DisplayObjectContainer.call(this);

 	this.id = id;

 	var y = 0;

 	var styleObject = {
 		width: 200,
 		height: 25,
 		font: "bold 13px Arial",
 		color: "white"
 	};
 	this.label = new PIXI.Text(string, styleObject);
 	this.label.position.x = 25;
 	this.label.position.y = y + 1;
 	this.addChild(this.label);

 	var background = new PIXI.Sprite(Resources.getInstance().getTexture("checkboxBackground"));
 	var tick = new PIXI.Sprite(Resources.getInstance().getTexture("checkboxTick"));
 	tick.x = 1;

 	this.checkbox = new Checkbox(background, tick);
 	this.checkbox.position.y = y;
 	this.addChild(this.checkbox);

 	this.checkbox.addEventListener("change", this.onCheckboxChange, this);
}

FunctionUtil.extend(SettingsCheckbox, PIXI.DisplayObjectContainer);
EventDispatcher.init(SettingsCheckbox);

/**
 * Checkbox change.
 * @method onCheckboxChange
 */
SettingsCheckbox.prototype.onCheckboxChange = function(interaction_object) {
	this.dispatchEvent("change", this);
}

/**
 * Getter.
 * @method getChecked
 */
SettingsCheckbox.prototype.getChecked = function() {
	return this.checkbox.getChecked();
}

/**
 * Setter.
 * @method setChecked
 */
SettingsCheckbox.prototype.setChecked = function(checked) {
	this.checkbox.setChecked(checked);
	return checked;
}

module.exports = SettingsCheckbox;
},{"../../utils/Button":68,"../../utils/Checkbox":69,"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/NineSlice":76,"../app/Settings":6,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],29:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");
var Settings = require("../app/Settings");
var EventDispatcher = require("../../utils/EventDispatcher");
var SettingsCheckbox = require("./SettingsCheckbox");
var RaiseShortcutButton = require("./RaiseShortcutButton");
var CheckboxMessage = require("../../proto/messages/CheckboxMessage");

/**
 * A settings view
 * @class SettingsView
 * @module client
 */
function SettingsView() {
 	PIXI.DisplayObjectContainer.call(this);

 	var object = new PIXI.DisplayObjectContainer();
 	var bg = new NineSlice(Resources.getInstance().getTexture("chatBackground"), 10, 10, 10, 10);
 	bg.width = 30;
 	bg.height = 30;
 	object.addChild(bg);

 	var sprite = new PIXI.Sprite(Resources.getInstance().getTexture("wrenchIcon"));
 	sprite.x = 5;
 	sprite.y = 5;
 	object.addChild(sprite);

 	this.settingsButton = new Button(object);
 	this.settingsButton.position.x = 960 - 10 - this.settingsButton.width;
 	this.settingsButton.position.y = 543;
 	this.settingsButton.addEventListener(Button.CLICK, this.onSettingsButtonClick, this);
 	this.addChild(this.settingsButton);

 	this.settingsMenu = new PIXI.DisplayObjectContainer();
 	
 	var mbg = new NineSlice(Resources.getInstance().getTexture("chatBackground"), 10, 10, 10, 10);
 	mbg.width = 250;
 	mbg.height = 100;
 	this.settingsMenu.addChild(mbg);

 	var styleObject = {
 		font: "bold 14px Arial",
 		color: "#FFFFFF",
 		width: 200,
 		height: 20
 	};
 	var label = new PIXI.Text("Settings", styleObject);
 	label.position.x = 16;
 	label.position.y = 10;

 	this.settingsMenu.addChild(label);
 	this.settingsMenu.position.x = 960 - 10 - this.settingsMenu.width;
 	this.settingsMenu.position.y = 538 - this.settingsMenu.height;
 	this.addChild(this.settingsMenu);

 	this.settings = {};

 	this.createMenuSetting("playAnimations", "Play animations", 40, Settings.getInstance().playAnimations);
 	this.createMenuSetting(CheckboxMessage.AUTO_MUCK_LOSING, "Muck losing hands", 65);

 	this.createSetting(CheckboxMessage.AUTO_POST_BLINDS, "Post blinds", 0);
 	this.createSetting(CheckboxMessage.SITOUT_NEXT, "Sit out", 25);

 	this.settingsMenu.visible = false;

 	this.buyChipsButton = new RaiseShortcutButton();
 	this.buyChipsButton.addEventListener("click", this.onBuyChipsClick, this);
 	this.buyChipsButton.x = 700;
 	this.buyChipsButton.y = 635;
 	this.buyChipsButton.setText("Buy chips");
 	this.addChild(this.buyChipsButton);
}

FunctionUtil.extend(SettingsView, PIXI.DisplayObjectContainer);
EventDispatcher.init(SettingsView);

SettingsView.BUY_CHIPS_CLICK = "buyChipsClick";

/**
 * On buy chips button clicked.
 * @method onBuyChipsClick
 */
SettingsView.prototype.onBuyChipsClick = function(interaction_object) {
	console.log("buy chips click");
	this.dispatchEvent(SettingsView.BUY_CHIPS_CLICK);
}

/**
 * Create checkbox.
 * @method createMenuSetting
 */
SettingsView.prototype.createMenuSetting = function(id, string, y, def) {
	var setting = new SettingsCheckbox(id, string);

	setting.y = y;
	setting.x = 16;
	this.settingsMenu.addChild(setting);

	setting.addEventListener("change", this.onCheckboxChange, this)

	this.settings[id] = setting;
	setting.setChecked(def);
}

/**
 * Create setting.
 * @method createSetting
 */
SettingsView.prototype.createSetting = function(id, string, y) {
	var setting = new SettingsCheckbox(id, string);

	setting.y = 545+y;
	setting.x = 700;
	this.addChild(setting);

	setting.addEventListener("change", this.onCheckboxChange, this)

	this.settings[id] = setting;
}

/**
 * Checkbox change.
 * @method onCheckboxChange
 */
SettingsView.prototype.onCheckboxChange = function(checkbox) {
	if(checkbox.id == "playAnimations") {
		Settings.getInstance().playAnimations = checkbox.getChecked();
		console.log("anims changed..");
	}

	this.dispatchEvent("change", checkbox.id, checkbox.getChecked());
}

/**
 * Settings button click.
 * @method onSettingsButtonClick
 */
SettingsView.prototype.onSettingsButtonClick = function(interaction_object) {
	console.log("SettingsView.prototype.onSettingsButtonClick");
	this.settingsMenu.visible = !this.settingsMenu.visible;

	if(this.settingsMenu.visible) {
		this.stage.mousedown = this.onStageMouseDown.bind(this);
	}
	else {
		this.stage.mousedown = null;
	}
}

/**
 * Stage mouse down.
 * @method onStageMouseDown
 */
SettingsView.prototype.onStageMouseDown = function(interaction_object) {
	console.log("SettingsView.prototype.onStageMouseDown");
	if((this.hitTest(this.settingsMenu, interaction_object)) || (this.hitTest(this.settingsButton, interaction_object))) {
		return;
	}

	this.stage.mousedown = null;
	this.settingsMenu.visible = false;
}

/**
 * Hit test.
 * @method hitTest
 */
SettingsView.prototype.hitTest = function(object, interaction_object) {
	if((interaction_object.global.x > object.getBounds().x ) && (interaction_object.global.x < (object.getBounds().x + object.getBounds().width)) &&
		(interaction_object.global.y > object.getBounds().y) && (interaction_object.global.y < (object.getBounds().y + object.getBounds().height))) {
		return true;		
	}
	return false;
}

/**
 * Reset.
 * @method reset
 */
SettingsView.prototype.reset = function() {
	this.buyChipsButton.enabled = true;
	this.setVisibleButtons([]);
}

/**
 * Set visible buttons.
 * @method setVisibleButtons
 */
SettingsView.prototype.setVisibleButtons = function(buttons) {
	this.buyChipsButton.visible = buttons.indexOf(ButtonData.BUY_CHIPS) != -1;
	this.settings[CheckboxMessage.AUTO_POST_BLINDS].visible = buttons.indexOf(CheckboxMessage.AUTO_POST_BLINDS);
	this.settings[CheckboxMessage.SITOUT_NEXT].visible = buttons.indexOf(CheckboxMessage.SITOUT_NEXT);

	var yp = 543;

	if(this.buyChipsButton.visible) {
		this.buyChipsButton.y = yp;
		yp += 35;
	}
	else {
		yp += 2;
	}

	if(this.settings[CheckboxMessage.AUTO_POST_BLINDS].visible) {
		this.settings[CheckboxMessage.AUTO_POST_BLINDS].y = yp;
		yp += 25;
	}

	if(this.settings[CheckboxMessage.SITOUT_NEXT].visible) {
		this.settings[CheckboxMessage.SITOUT_NEXT].y = yp;
		yp += 25;
	}
}

/**
 * Get checkbox.
 * @method getCheckboxById
 */
SettingsView.prototype.getCheckboxById = function(id) {
	return this.settings[id];
}

module.exports = SettingsView;
},{"../../proto/messages/CheckboxMessage":42,"../../utils/Button":68,"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../../utils/NineSlice":76,"../app/Settings":6,"../resources/Resources":14,"./RaiseShortcutButton":26,"./SettingsCheckbox":28,"pixi.js":3,"tween.js":4}],30:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * Show table info.
 * @class TableInfoView
 * @module client
 */
function TableInfoView() {
	PIXI.DisplayObjectContainer.call(this);

	var style = {
		font: "bold 24px Times New Roman",
		fill: "#ffffff",
		dropShadow: true,
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		stroke: "#000000",
		strokeThickness: 2,
		wordWrap: true,
		wordWrapWidth: 300
	};

	this.tableInfoText = new PIXI.Text("<TableInfoText>", style);
	this.tableInfoText.position.x = 355;
	this.tableInfoText.position.y = 540;
	this.addChild(this.tableInfoText);
}

FunctionUtil.extend(TableInfoView, PIXI.DisplayObjectContainer);
EventDispatcher.init(TableInfoView);

/**
 * Set table info text.
 * @method setTableInfoText
 */
TableInfoView.prototype.setTableInfoText = function(s) {
	if (!s)
		s="";

	this.tableInfoText.setText(s);
	console.log("setting table info text: " + s);
}

/**
 * Clear.
 * @method clear
 */
TableInfoView.prototype.clear = function() {
	this.tableInfoText.setText("");
}

module.exports = TableInfoView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"pixi.js":3}],31:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * A timer view
 * @class TimerView
 * @module client
 */
function TimerView() {
	PIXI.DisplayObjectContainer.call(this);
	
	this.timerClip = new PIXI.Sprite(Resources.getInstance().getTexture("timerBackground"));
	this.addChild(this.timerClip);


	this.canvas = new PIXI.Graphics();
	this.canvas.x = this.timerClip.width*0.5;
	this.canvas.y = this.timerClip.height*0.5;
	this.timerClip.addChild(this.canvas);

	this.timerClip.visible = false;

	this.tween = null;

	//this.showPercent(30);
}

FunctionUtil.extend(TimerView, PIXI.DisplayObjectContainer);
EventDispatcher.init(TimerView);

/**
 * Hide.
 * @method hide
 */
TimerView.prototype.hide = function() {
	this.timerClip.visible = false;
	this.stop();
}

/**
 * Show.
 * @method show
 */
TimerView.prototype.show = function(seatIndex) {
	
	this.timerClip.visible = true;
	this.timerClip.x = Resources.getInstance().getPoints("seatPositions")[seatIndex].x + 55;
	this.timerClip.y = Resources.getInstance().getPoints("seatPositions")[seatIndex].y - 30;

	this.stop();

}

/**
 * Stop.
 * @method stop
 */
TimerView.prototype.stop = function(seatIndex) {
	if(this.tween != null)
		this.tween.stop();

}

/**
 * Countdown.
 * @method countdown
 */
TimerView.prototype.countdown = function(totalTime, timeLeft) {
	this.stop();

	totalTime *= 1000;
	timeLeft *= 1000;

	var time = Date.now();
	this.startAt = time + timeLeft - totalTime;
	this.stopAt = time + timeLeft;

	this.tween = new TWEEN.Tween({time: time})
						.to({time: this.stopAt}, timeLeft)
						.onUpdate(this.onUpdate.bind(this))
						.onComplete(this.onComplete.bind(this))
						.start();

}

/**
 * On tween update.
 * @method onUpdate
 */
TimerView.prototype.onUpdate = function() {
	var time = Date.now();
	var percent = 100*(time - this.startAt)/(this.stopAt - this.startAt);

//	console.log("p = " + percent);

	this.showPercent(percent);
}

/**
 * On tween update.
 * @method onUpdate
 */
TimerView.prototype.onComplete = function() {
	var time = Date.now();
	var percent = 100;
	this.showPercent(percent);
	this.tween = null;
}

/**
 * Show percent.
 * @method showPercent
 */
TimerView.prototype.showPercent = function(value) {
	if (value < 0)
		value = 0;

	if (value > 100)
		value = 100;

	this.canvas.clear();

	this.canvas.beginFill(0xc00000);
	this.canvas.drawCircle(0,0,10);
	this.canvas.endFill();

	this.canvas.beginFill(0xffffff);
	this.canvas.moveTo(0,0);
	for(var i = 0; i < 33; i++) {
		this.canvas.lineTo(
							10*Math.cos(i*value*2*Math.PI/(32*100) - Math.PI/2),
							10*Math.sin(i*value*2*Math.PI/(32*100) - Math.PI/2)
						);
	}

	this.canvas.lineTo(0,0);
	this.canvas.endFill();

}

module.exports = TimerView;
},{"../../utils/EventDispatcher":71,"../../utils/FunctionUtil":72,"../resources/Resources":14,"pixi.js":3,"tween.js":4}],32:[function(require,module,exports){
/**
 * Protocol related stuff.
 * @module proto
 */

var EventDispatcher = require("../utils/EventDispatcher");
var FunctionUtil = require("../utils/FunctionUtil");

var InitMessage = require("./messages/InitMessage");
var StateCompleteMessage = require("./messages/StateCompleteMessage");
var SeatInfoMessage = require("./messages/SeatInfoMessage");
var CommunityCardsMessage = require("./messages/CommunityCardsMessage");
var PocketCardsMessage = require("./messages/PocketCardsMessage");
var SeatClickMessage = require("./messages/SeatClickMessage");
var ShowDialogMessage = require("./messages/ShowDialogMessage");
var ButtonClickMessage = require("./messages/ButtonClickMessage");
var ButtonsMessage = require("./messages/ButtonsMessage");
var DelayMessage = require("./messages/DelayMessage");
var ClearMessage = require("./messages/ClearMessage");
var DealerButtonMessage = require("./messages/DealerButtonMessage");
var BetMessage = require("./messages/BetMessage");
var BetsToPotMessage = require("./messages/BetsToPotMessage");

var ActionMessage = require("./messages/ActionMessage");
var ChatMessage = require("./messages/ChatMessage");
var CheckboxMessage = require("./messages/CheckboxMessage");
var FadeTableMessage = require("./messages/FadeTableMessage");
var HandInfoMessage = require("./messages/HandInfoMessage");
var InterfaceStateMessage = require("./messages/InterfaceStateMessage");
var PayOutMessage = require("./messages/PayOutMessage");
var PotMessage = require("./messages/PotMessage");
var PresetButtonClickMessage = require("./messages/PresetButtonClickMessage");
var PresetButtonsMessage = require("./messages/PresetButtonsMessage");
var PreTournamentInfoMessage = require("./messages/PreTournamentInfoMessage");
var TableButtonClickMessage = require("./messages/TableButtonClickMessage");
var TableButtonsMessage = require("./messages/TableButtonsMessage");
var TableInfoMessage = require("./messages/TableInfoMessage");
var TestCaseRequestMessage = require("./messages/TestCaseRequestMessage");
var TimerMessage = require("./messages/TimerMessage");
var TournamentResultMessage = require("./messages/TournamentResultMessage");
var FoldCardsMessage = require("./messages/FoldCardsMessage");

/**
 * A protocol connection with an underlying connection.
 *
 * There are two ways to liten for connections, the first one and most straight
 * forward is the addMessageHandler, which registers a listener for a
 * particular network message. The first argument should be the message
 * class to listen for:
 *
 *     function onSeatInfoMessage(m) {
 *         // Check if the seat is active.
 *         m.isActive();
 *     }
 *
 *     protoConnection.addMessageHandler(SeatInfoMessage, onSeatInfoMessage);
 *
 * The second method is to listen to the ProtoConnection.MESSAGE dispatched
 * by the instance of the ProtoConnection. In this case, the listener
 * will be called for all messages received on the connection.
 *
 *     function onMessage(e) {
 *         var message=e.message;
 *
 *         // Is it a SeatInfoMessage?
 *         if (message instanceof SeatInfoMessage) {
 *             // ...
 *         }
 *     }
 *
 *     protoConnection.addMessageHandler(SeatInfoMessage, onMessage);
 *
 * The underlying connection should be an object that implements an "interface"
 * of a connection. It is not an interface per se, since JavaScript doesn't support
 * it. Anyway, the signature of this interface, is that the connection object
 * should have a `send` method which receives a object to be send. It should also
 * dispatch "message" events as messages are received, and "close" events if the
 * connection is closed by the remote party.
 *
 * @class ProtoConnection
 * @extends EventDispatcher
 * @constructor
 * @param connection The underlying connection object.
 */
function ProtoConnection(connection) {
	EventDispatcher.call(this);

	this.logMessages = false;
	this.messageDispatcher = new EventDispatcher();
	this.connection = connection;
	this.connection.addEventListener("message", this.onConnectionMessage, this);
	this.connection.addEventListener("close", this.onConnectionClose, this);
}

FunctionUtil.extend(ProtoConnection, EventDispatcher);

/**
 * Triggers if the remote party closes the underlying connection.
 * @event ProtoConnection.CLOSE
 */
ProtoConnection.CLOSE = "close";

/**
 * Triggers when we receive a message from the remote party.
 * @event ProtoConnection.MESSAGE
 * @param {Object} message The message that was received.
 */
ProtoConnection.MESSAGE = "message";

ProtoConnection.MESSAGE_TYPES = {};
ProtoConnection.MESSAGE_TYPES[InitMessage.TYPE] = InitMessage;
ProtoConnection.MESSAGE_TYPES[StateCompleteMessage.TYPE] = StateCompleteMessage;
ProtoConnection.MESSAGE_TYPES[SeatInfoMessage.TYPE] = SeatInfoMessage;
ProtoConnection.MESSAGE_TYPES[CommunityCardsMessage.TYPE] = CommunityCardsMessage;
ProtoConnection.MESSAGE_TYPES[PocketCardsMessage.TYPE] = PocketCardsMessage;
ProtoConnection.MESSAGE_TYPES[SeatClickMessage.TYPE] = SeatClickMessage;
ProtoConnection.MESSAGE_TYPES[ShowDialogMessage.TYPE] = ShowDialogMessage;
ProtoConnection.MESSAGE_TYPES[ButtonClickMessage.TYPE] = ButtonClickMessage;
ProtoConnection.MESSAGE_TYPES[ButtonsMessage.TYPE] = ButtonsMessage;
ProtoConnection.MESSAGE_TYPES[DelayMessage.TYPE] = DelayMessage;
ProtoConnection.MESSAGE_TYPES[ClearMessage.TYPE] = ClearMessage;
ProtoConnection.MESSAGE_TYPES[DealerButtonMessage.TYPE] = DealerButtonMessage;
ProtoConnection.MESSAGE_TYPES[BetMessage.TYPE] = BetMessage;
ProtoConnection.MESSAGE_TYPES[BetsToPotMessage.TYPE] = BetsToPotMessage;

ProtoConnection.MESSAGE_TYPES[ActionMessage.TYPE] = ActionMessage;
ProtoConnection.MESSAGE_TYPES[ChatMessage.TYPE] = ChatMessage;
ProtoConnection.MESSAGE_TYPES[CheckboxMessage.TYPE] = CheckboxMessage;
ProtoConnection.MESSAGE_TYPES[FadeTableMessage.TYPE] = FadeTableMessage;
ProtoConnection.MESSAGE_TYPES[HandInfoMessage.TYPE] = HandInfoMessage;
ProtoConnection.MESSAGE_TYPES[InterfaceStateMessage.TYPE] = InterfaceStateMessage;
ProtoConnection.MESSAGE_TYPES[PayOutMessage.TYPE] = PayOutMessage;
ProtoConnection.MESSAGE_TYPES[PotMessage.TYPE] = PotMessage;
ProtoConnection.MESSAGE_TYPES[PresetButtonClickMessage.TYPE] = PresetButtonClickMessage;
ProtoConnection.MESSAGE_TYPES[PresetButtonsMessage.TYPE] = PresetButtonsMessage;
ProtoConnection.MESSAGE_TYPES[PreTournamentInfoMessage.TYPE] = PreTournamentInfoMessage;
ProtoConnection.MESSAGE_TYPES[TableButtonClickMessage.TYPE] = TableButtonClickMessage;
ProtoConnection.MESSAGE_TYPES[TableButtonsMessage.TYPE] = TableButtonsMessage;
ProtoConnection.MESSAGE_TYPES[TableInfoMessage.TYPE] = TableInfoMessage;
ProtoConnection.MESSAGE_TYPES[TestCaseRequestMessage.TYPE] = TestCaseRequestMessage;
ProtoConnection.MESSAGE_TYPES[TimerMessage.TYPE] = TimerMessage;
ProtoConnection.MESSAGE_TYPES[TournamentResultMessage.TYPE] = TournamentResultMessage;
ProtoConnection.MESSAGE_TYPES[FoldCardsMessage.TYPE] = FoldCardsMessage;

/**
 * Add message handler.
 * @method addMessageHandler
 */
ProtoConnection.prototype.addMessageHandler = function(messageType, handler, scope) {
	if (messageType.hasOwnProperty("TYPE"))
		messageType = messageType.TYPE;

	this.messageDispatcher.on(messageType, handler, scope);
}

/**
 * Remove message handler.
 * @method removeMessageHandler
 */
ProtoConnection.prototype.removeMessageHandler = function(messageType, handler, scope) {
	if (messageType.hasOwnProperty("TYPE"))
		messageType = messageType.TYPE;

	this.messageDispatcher.off(messageType, handler, scope);
}

/**
 * Connection message.
 * @method onConnectionMessage
 * @private
 */
ProtoConnection.prototype.onConnectionMessage = function(ev) {
	var message = ev.message;
	var constructor;

	if (this.logMessages)
		console.log("==> " + JSON.stringify(message));

	for (type in ProtoConnection.MESSAGE_TYPES) {
		if (message.type == type)
			constructor = ProtoConnection.MESSAGE_TYPES[type]
	}

	if (!constructor) {
		console.warn("unknown message: " + message.type);
		return;
	}

	var o = new constructor();
	o.unserialize(message);
	o.type = message.type;

	this.messageDispatcher.trigger(o);

	this.trigger({
		type: ProtoConnection.MESSAGE,
		message: o
	});
}

/**
 * Connection close.
 * @method onConnectionClose
 * @private
 */
ProtoConnection.prototype.onConnectionClose = function(ev) {
	this.connection.off("message", this.onConnectionMessage, this);
	this.connection.off("close", this.onConnectionClose, this);
	this.connection = null;

	this.trigger(ProtoConnection.CLOSE);
}

/**
 * Send a message.
 * @method send
 */
ProtoConnection.prototype.send = function(message) {
	var serialized = message.serialize();

	for (type in ProtoConnection.MESSAGE_TYPES) {
		if (message instanceof ProtoConnection.MESSAGE_TYPES[type])
			serialized.type = type;
	}

	if (!serialized.type)
		throw new Error("Unknown message type for send, message=" + message.constructor.name);

	//	console.log("sending: "+serialized);

	this.connection.send(serialized);
}

/**
 * Should messages be logged to console?
 * @method setLogMessages
 */
ProtoConnection.prototype.setLogMessages = function(value) {
	this.logMessages = value;
}

/**
 * Close the underlying connection.
 * @method close
 */
ProtoConnection.prototype.close = function() {
	this.connection.close();
}

/**
 * Get string representation.
 * @method toString
 */
ProtoConnection.prototype.toString = function() {
	return "<ProtoConnection>";
}

module.exports = ProtoConnection;
},{"../utils/EventDispatcher":71,"../utils/FunctionUtil":72,"./messages/ActionMessage":36,"./messages/BetMessage":37,"./messages/BetsToPotMessage":38,"./messages/ButtonClickMessage":39,"./messages/ButtonsMessage":40,"./messages/ChatMessage":41,"./messages/CheckboxMessage":42,"./messages/ClearMessage":43,"./messages/CommunityCardsMessage":44,"./messages/DealerButtonMessage":45,"./messages/DelayMessage":46,"./messages/FadeTableMessage":47,"./messages/FoldCardsMessage":48,"./messages/HandInfoMessage":49,"./messages/InitMessage":50,"./messages/InterfaceStateMessage":51,"./messages/PayOutMessage":52,"./messages/PocketCardsMessage":53,"./messages/PotMessage":54,"./messages/PreTournamentInfoMessage":55,"./messages/PresetButtonClickMessage":56,"./messages/PresetButtonsMessage":57,"./messages/SeatClickMessage":58,"./messages/SeatInfoMessage":59,"./messages/ShowDialogMessage":60,"./messages/StateCompleteMessage":61,"./messages/TableButtonClickMessage":62,"./messages/TableButtonsMessage":63,"./messages/TableInfoMessage":64,"./messages/TestCaseRequestMessage":65,"./messages/TimerMessage":66,"./messages/TournamentResultMessage":67}],33:[function(require,module,exports){
/**
 * Button data.
 * @class ButtonData
 */
function ButtonData(button, value) {
	this.button = button;
	this.value = value;
}

ButtonData.RAISE = "raise";
ButtonData.FOLD = "fold";
ButtonData.BET = "bet";
ButtonData.SIT_OUT = "sitOut";
ButtonData.SIT_IN = "sitIn";
ButtonData.CALL = "call";
ButtonData.POST_BB = "postBB";
ButtonData.POST_SB = "postSB";
ButtonData.CANCEL = "cancel";
ButtonData.CHECK = "check";
ButtonData.SHOW = "show";
ButtonData.MUCK = "muck";
ButtonData.OK = "ok";
ButtonData.IM_BACK = "imBack";
ButtonData.LEAVE = "leave";
ButtonData.CHECK_FOLD = "checkFold";
ButtonData.CALL_ANY = "callAny";
ButtonData.RAISE_ANY = "raiseAny";
ButtonData.BUY_IN = "buyIn";
ButtonData.RE_BUY = "reBuy";
ButtonData.JOIN_TOURNAMENT = "joinTournament";
ButtonData.LEAVE_TOURNAMENT = "leaveTournament";

/**
 * Get button.
 * @method getButton
 */
ButtonData.prototype.getButton = function() {
	return this.button;
}

/**
 * Get button string for this button.
 * @method getButtonString
 */
ButtonData.prototype.getButtonString = function() {
	return ButtonData.getButtonStringForId(this.button);
}

/**
 * Get value.
 * @method getValue
 */
ButtonData.prototype.getValue = function() {
	return this.value;
}

/**
 * Get button string for id.
 * @method getButtonStringForId
 * @static
 */
ButtonData.getButtonStringForId = function(b) {
	switch (b) {
		case ButtonData.FOLD:
			return "FOLD";

		case ButtonData.CALL:
			return "CALL";

		case ButtonData.RAISE:
			return "RAISE TO";

		case ButtonData.BET:
			return "BET";

		case ButtonData.SIT_OUT:
			return "SIT OUT";

		case ButtonData.POST_BB:
			return "POST BB";

		case ButtonData.POST_SB:
			return "POST SB";

		case ButtonData.SIT_IN:
			return "SIT IN";

		case ButtonData.CANCEL:
			return "CANCEL";

		case ButtonData.CHECK:
			return "CHECK";

		case ButtonData.SHOW:
			return "SHOW";

		case ButtonData.MUCK:
			return "MUCK";

		case ButtonData.OK:
			return "OK";

		case ButtonData.IM_BACK:
			return "I'M BACK";

		case ButtonData.LEAVE:
			return "LEAVE";

		case ButtonData.CHECK_FOLD:
			return "CHECK / FOLD";

		case ButtonData.CALL_ANY:
			return "CALL ANY";

		case ButtonData.RAISE_ANY:
			return "RAISE ANY";

		case ButtonData.RE_BUY:
			return "RE-BUY";

		case ButtonData.BUY_IN:
			return "BUY IN";
	}

	return "";
}

ButtonData.prototype.toString = function() {
	return "<ButtonData button=" + this.button + ", value=" + this.value + ">";
}

module.exports = ButtonData;
},{}],34:[function(require,module,exports){
/**
 * Card data.
 * @class CardData
 */
function CardData(value) {
	this.value = value;
}

CardData.CARD_VALUE_STRINGS =
	["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

CardData.SUIT_STRINGS =
	["D", "C", "H", "S"];

CardData.HIDDEN = -1;

/**
 * Does this CardData represent a show card?
 * If not it should be rendered with its backside.
 * @method isShown
 */
CardData.prototype.isShown = function() {
	return this.value >= 0;
}

/**
 * Get card value.
 * This value represents the rank of the card, but starts on 0.
 * @method getCardValue
 */
CardData.prototype.getCardValue = function() {
	return this.value % 13;
}

/**
 * Get card value string.
 * @method getCardValueString
 */
CardData.prototype.getCardValueString = function() {
	return CardData.CARD_VALUE_STRINGS[this.value % 13];
}

/**
 * Get suit index.
 * @method getSuitIndex
 */
CardData.prototype.getSuitIndex = function() {
	return Math.floor(this.value / 13);
}

/**
 * Get suit string.
 * @method getSuitString
 */
CardData.prototype.getSuitString = function() {
	return CardData.SUIT_STRINGS[this.getSuitIndex()];
}

/**
 * Get color.
 * @method getColor
 */
CardData.prototype.getColor = function() {
	if (this.getSuitIndex() % 2 != 0)
		return "#000000";

	else
		return "#ff0000";
}

/**
 * To string.
 * @method toString
 */
CardData.prototype.toString = function() {
	if (this.value < 0)
		return "XX";

	//	return "<card " + this.getCardValueString() + this.getSuitString() + ">";
	return this.getCardValueString() + this.getSuitString();
}

/**
 * Get value of the card.
 * @method getValue
 */
CardData.prototype.getValue = function() {
	return this.value;
}

/**
 * Compare with respect to value. Not really useful except for debugging!
 * @method compareValue
 * @static
 */
CardData.compareValue = function(a, b) {
	if (!(a instanceof CardData) || !(b instanceof CardData))
		throw new Error("Not comparing card data");

	if (a.getValue() > b.getValue())
		return 1;

	if (a.getValue() < b.getValue())
		return -1;

	return 0;
}

/**
 * Compare with respect to card value.
 * @method compareCardValue
 * @static
 */
CardData.compareCardValue = function(a, b) {
	if (!(a instanceof CardData) || !(b instanceof CardData))
		throw new Error("Not comparing card data");

	if (a.getCardValue() > b.getCardValue())
		return 1;

	if (a.getCardValue() < b.getCardValue())
		return -1;

	return 0;
}

/**
 * Compare with respect to suit.
 * @method compareSuit
 * @static
 */
CardData.compareSuitIndex = function(a, b) {
	if (!(a instanceof CardData) || !(b instanceof CardData))
		throw new Error("Not comparing card data");

	if (a.getSuitIndex() > b.getSuitIndex())
		return 1;

	if (a.getSuitIndex() < b.getSuitIndex())
		return -1;

	return 0;
}

/**
 * Create a card data from a string.
 * @method fromString
 * @static
 */
CardData.fromString = function(s) {
	var i;

	var cardValue = -1;
	for (i = 0; i < CardData.CARD_VALUE_STRINGS.length; i++) {
		var cand = CardData.CARD_VALUE_STRINGS[i];

		if (s.substring(0, cand.length).toUpperCase() == cand)
			cardValue = i;
	}

	if (cardValue < 0)
		throw new Error("Not a valid card string: " + s);

	var suitString = s.substring(CardData.CARD_VALUE_STRINGS[cardValue].length);

	var suitIndex = -1;
	for (i = 0; i < CardData.SUIT_STRINGS.length; i++) {
		var cand = CardData.SUIT_STRINGS[i];

		if (suitString.toUpperCase() == cand)
			suitIndex = i;
	}

	if (suitIndex < 0)
		throw new Error("Not a valid card string: " + s);

	return new CardData(suitIndex * 13 + cardValue);
}

module.exports = CardData;
},{}],35:[function(require,module,exports){
/**
 * Button data.
 * @class ButtonData
 */
function PresetButtonData(button, value) {
	this.button = button;
	this.value = value;
}

/**
 * Get button.
 * @method getButton
 */
PresetButtonData.prototype.getButton = function() {
	return this.button;
}

/**
 * Get value.
 * @method getValue
 */
PresetButtonData.prototype.getValue = function() {
	return this.value;
}

module.exports = PresetButtonData;
},{}],36:[function(require,module,exports){
/**
 * Received when player made an action.
 * @class ActionMessage
 */
function ActionMessage(seatIndex, action) {
	this.seatIndex = seatIndex;
	this.action = action;
}

ActionMessage.TYPE = "action";

ActionMessage.FOLD = "fold";
ActionMessage.CALL = "call";
ActionMessage.RAISE = "raise";
ActionMessage.CHECK = "check";
ActionMessage.BET = "bet";
ActionMessage.MUCK = "muck";
ActionMessage.ANTE = "ante";

/**
 * Seat index.
 * @method getSeatIndex
 */
ActionMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getAction
 */
ActionMessage.prototype.getAction = function() {
	return this.action;
}

/**
 * Un-serialize.
 * @method unserialize
 */
ActionMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
	this.action = data.action;
}

/**
 * Serialize message.
 * @method serialize
 */
ActionMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
		action: this.action
	};
}

module.exports = ActionMessage;
},{}],37:[function(require,module,exports){
/**
 * Received when player has placed a bet.
 * @class BetMessage
 */
function BetMessage(seatIndex, value) {
	this.seatIndex = seatIndex;
	this.value = value;
}

BetMessage.TYPE = "bet";

/**
 * Getter.
 * @method getSeatIndex
 */
BetMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getValue
 */
BetMessage.prototype.getValue = function() {
	return this.value;
}

/**
 * Un-serialize.
 * @method unserialize
 */
BetMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
	this.value = data.value;
}

/**
 * Serialize message.
 * @method serialize
 */
BetMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
		value: this.value
	};
}

module.exports = BetMessage;
},{}],38:[function(require,module,exports){
/**
 * Received when bets should be placed in pot.
 * @class BetsToPotMessage
 */
function BetsToPotMessage() {
}

BetsToPotMessage.TYPE = "betsToPot";

/**
 * Un-serialize.
 * @method unserialize
 */
BetsToPotMessage.prototype.unserialize = function(data) {
}

/**
 * Serialize message.
 * @method serialize
 */
BetsToPotMessage.prototype.serialize = function() {
	return {};
}

module.exports = BetsToPotMessage;
},{}],39:[function(require,module,exports){
/**
 * Sent when the user clicks a button, either in a dialog or
 * for a game action.
 * @class ButtonClickMessage
 */
function ButtonClickMessage(button, value) {
	this.button = button;
	this.value = value;

//	console.log("Creating button click message, value=" + value);
}

ButtonClickMessage.TYPE = "buttonClick";

/**
 * The the button that was pressed.
 * @method getButton
 */
ButtonClickMessage.prototype.getButton = function() {
	return this.button;
}

/**
 * Setter.
 * @method getValue
 */
ButtonClickMessage.prototype.getValue = function() {
	return this.value;
}

/**
 * Un-serialize.
 * @method unserialize
 */
ButtonClickMessage.prototype.unserialize = function(data) {
	this.button = data.button;
	this.value = data.value;
}

/**
 * Serialize message.
 * @method serialize
 */
ButtonClickMessage.prototype.serialize = function() {
	return {
		button: this.button,
		value: this.value
	};
}

module.exports = ButtonClickMessage;
},{}],40:[function(require,module,exports){
var ButtonData = require("../data/ButtonData");

/**
 * Message sent when the client should show game action buttons,
 * FOLD, RAISE etc.
 * @class ButtonsMessage
 */
function ButtonsMessage() {
	this.buttons = [];
	this.sliderButtonIndex = 0;
	this.min = -1;
	this.max = -1;
}

ButtonsMessage.TYPE = "buttons";

/**
 * Get an array of ButtonData indicating which buttons to show.
 * @method getButtons
 */
ButtonsMessage.prototype.getButtons = function() {
	return this.buttons;
}

/**
 * Add a button to be sent.
 * @method addButton
 */
ButtonsMessage.prototype.addButton = function(button) {
	this.buttons.push(button);
}

/**
 * Un-serialize.
 * @method unserialize.
 */
ButtonsMessage.prototype.unserialize = function(data) {
	this.buttons = [];

	for (var i = 0; i < data.buttons.length; i++) {
		var button = data.buttons[i];
		var buttonData = new ButtonData(button.button, button.value);
		this.addButton(buttonData);
	}
	this.sliderButtonIndex = data.sliderButtonIndex;
	this.min = data.min;
	this.max = data.max;
}

/**
 * Serialize message.
 * @method serialize
 */
ButtonsMessage.prototype.serialize = function() {
	var buttons = [];

	for (var i = 0; i < this.buttons.length; i++) {
		var button = {};
		button.button = this.buttons[i].getButton();
		button.value = this.buttons[i].getValue();
		buttons.push(button);
	}

	return {
		buttons: buttons,
		sliderButtonIndex: this.sliderButtonIndex,
		min: this.min,
		max: this.max
	};
}

module.exports = ButtonsMessage;
},{"../data/ButtonData":33}],41:[function(require,module,exports){
/**
 * Received when something has occurred in the chat.
 * @class ChatMessage
 */
function ChatMessage(user, text) {
	this.user = user;
	this.text = text;
}

ChatMessage.TYPE = "chat";

/**
 * Get text.
 * @method getText
 */
ChatMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Get user.
 * @method getUser
 */
ChatMessage.prototype.getUser = function() {
	return this.user;
}

/**
 * Un-serialize.
 * @method unserialize
 */
ChatMessage.prototype.unserialize = function(data) {
	this.text = data.text;
	this.user = data.user;
}

/**
 * Serialize message.
 * @method serialize
 */
ChatMessage.prototype.serialize = function() {
	return {
		text: this.text,
		user: this.user
	};
}

module.exports = ChatMessage;
},{}],42:[function(require,module,exports){
/**
 * Sent when player has checked a checkbox.
 * @class CheckboxMessage
 */
function CheckboxMessage(id, checked) {
	this.id = id;
	this.checked = checked;
}

CheckboxMessage.TYPE = "checkbox";

CheckboxMessage.AUTO_POST_BLINDS = "autoPostBlinds";
CheckboxMessage.AUTO_MUCK_LOSING = "autoMuckLosing";
CheckboxMessage.SITOUT_NEXT = "sitoutNext";

/**
 * Id of checkbox.
 * @method getId
 */
CheckboxMessage.prototype.getId = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getValue
 */
CheckboxMessage.prototype.getChecked = function() {
	return this.checked;
}

/**
 * Un-serialize.
 * @method unserialize
 */
CheckboxMessage.prototype.unserialize = function(data) {
	this.id = data.id;
	this.checked = data.checked;
}

/**
 * Serialize message.
 * @method serialize
 */
CheckboxMessage.prototype.serialize = function() {
	return {
		id: this.id,
		checked: this.checked
	};
}

module.exports = CheckboxMessage;
},{}],43:[function(require,module,exports){
/**
 * @class ClearMessage
 */
function ClearMessage(components) {
	if (!components)
		components = [];

	this.components = components;
}

ClearMessage.TYPE = "clear";

ClearMessage.CARDS = "cards";
ClearMessage.BETS = "bets";
ClearMessage.POT = "pot";
ClearMessage.CHAT = "chat";

/**
 * Getter.
 * @method getComponents
 */
ClearMessage.prototype.getComponents = function() {
	return this.components;
}

/**
 * Un-serialize.
 * @method unserialize
 */
ClearMessage.prototype.unserialize = function(data) {
	this.components = data.components;
}

/**
 * Serialize message.
 * @method serialize
 */
ClearMessage.prototype.serialize = function() {
	return {
		components: this.components
	};
}

module.exports = ClearMessage;
},{}],44:[function(require,module,exports){
var CardData = require("../data/CardData");

/**
 * Show community cards.
 * @class CommunityCardsMessage
 */
function CommunityCardsMessage(cards) {
	if (!cards)
		cards = [];

	this.animate = false;
	this.cards = cards;
	this.firstIndex = 0;
}

CommunityCardsMessage.TYPE = "communityCards";

/**
 * Animation or not?
 * @method setAnimate
 */
CommunityCardsMessage.prototype.setAnimate = function(value) {
	return this.animate = value;
}

/**
 * Set first index.
 * @method setFirstIndex
 */
CommunityCardsMessage.prototype.setFirstIndex = function(value) {
	return this.firstIndex = value;
}

/**
 * Add card.
 * @method addCard
 */
CommunityCardsMessage.prototype.addCard = function(c) {
	this.cards.push(c);
}

/**
 * Get card data.
 * @method getCards
 */
CommunityCardsMessage.prototype.getCards = function() {
	return this.cards;
}

/**
 * Get the index of the first card to be shown in the sequence.
 * @method getFirstIndex
 */
CommunityCardsMessage.prototype.getFirstIndex = function() {
	return this.firstIndex;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
CommunityCardsMessage.prototype.unserialize = function(data) {
	var i;

	this.animate = data.animate;
	this.firstIndex = parseInt(data.firstIndex);
	this.cards = [];

	for (i = 0; i < data.cards.length; i++)
		this.cards.push(new CardData(data.cards[i]));
}

/**
 * Serialize message.
 * @method serialize
 */
CommunityCardsMessage.prototype.serialize = function() {
	var cards = [];

	for (i = 0; i < this.cards.length; i++)
		cards.push(this.cards[i].getValue());

	return {
		animate: this.animate,
		firstIndex: this.firstIndex,
		cards: cards
	};
}

module.exports = CommunityCardsMessage;
},{"../data/CardData":34}],45:[function(require,module,exports){
/**
 * @class DealerButtonMessage
 */
function DealerButtonMessage(seatIndex, animate) {
	this.seatIndex = seatIndex;
	this.animate = animate;
}

DealerButtonMessage.TYPE = "dealerButton";

/**
 * Getter.
 * @method getSeatIndex
 */
DealerButtonMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getAnimate
 */
DealerButtonMessage.prototype.getAnimate = function() {
	return this.animate;
}

/**
 * Un-serialize.
 * @method unserialize
 */
DealerButtonMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
	this.animate = data.animate;
}

/**
 * Serialize message.
 * @method serialize
 */
DealerButtonMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
		animate: this.animate
	};
}

module.exports = DealerButtonMessage;
},{}],46:[function(require,module,exports){
/**
 * @class DelayMessage
 */
function DelayMessage(delay) {
	this.delay = delay;
}

DelayMessage.TYPE = "delay";

/**
 * Getter.
 * @method getDelay
 */
DelayMessage.prototype.getDelay = function() {
	return this.delay;
}

/**
 * Un-serialize.
 * @method unserialize
 */
DelayMessage.prototype.unserialize = function(data) {
	this.delay = data.delay;
}

/**
 * Serialize message.
 * @method serialize
 */
DelayMessage.prototype.serialize = function() {
	return {
		delay: this.delay
	};
}

module.exports = DelayMessage;
},{}],47:[function(require,module,exports){
/**
 * Received table should fade.
 * @class FadeTableMessage
 */
function FadeTableMessage(visible, direction) {
	this.visible = visible;
	this.direction = direction;
}

FadeTableMessage.TYPE = "fadeTable";

/**
 * Getter.
 * @method getVisible
 */
FadeTableMessage.prototype.getVisible = function() {
	return this.visible;
}

/**
 * Getter.
 * @method getDirection
 */
FadeTableMessage.prototype.getDirection = function() {
	return this.direction;
}

/**
 * Un-serialize.
 * @method unserialize
 */
FadeTableMessage.prototype.unserialize = function(data) {
	this.visible = data.visible;
	this.direction = data.direction;
}

/**
 * Serialize message.
 * @method serialize
 */
FadeTableMessage.prototype.serialize = function() {
	return {
		visible: this.visible,
		direction: this.direction
	};
}

module.exports = FadeTableMessage;
},{}],48:[function(require,module,exports){
/**
 * Received player has folded.
 * @class FoldCardsMessage
 */
function FoldCardsMessage(seatIndex) {
	this.seatIndex = seatIndex;
}

FoldCardsMessage.TYPE = "foldCards";

/**
 * Getter.
 * @method getSeatIndex
 */
FoldCardsMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Un-serialize.
 * @method unserialize
 */
FoldCardsMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
}

/**
 * Serialize message.
 * @method serialize
 */
FoldCardsMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex
	};
}

module.exports = FoldCardsMessage;
},{}],49:[function(require,module,exports){
/**
 * Received when ?.
 * @class HandInfoMessage
 */
function HandInfoMessage(text, countdown) {
	this.text = text;
	this.countdown = countdown;
}

HandInfoMessage.TYPE = "handInfo";

/**
 * Getter.
 * @method getSeatIndex
 */
HandInfoMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Getter.
 * @method getValue
 */
HandInfoMessage.prototype.getCountdown = function() {
	return this.countdown;
}

/**
 * Un-serialize.
 * @method unserialize
 */
HandInfoMessage.prototype.unserialize = function(data) {
	this.text = data.text;
	this.countdown = data.countdown;
}

/**
 * Serialize message.
 * @method serialize
 */
HandInfoMessage.prototype.serialize = function() {
	return {
		text: this.text,
		countdown: this.countdown
	};
}

module.exports = HandInfoMessage;
},{}],50:[function(require,module,exports){
/**
 * @class InitMessage
 */
function InitMessage(token) {
	this.token = token;
	this.tableId = null;
	this.viewCase = null;
}

InitMessage.TYPE = "init";

/**
 * get token.
 * @method getToken
 */
InitMessage.prototype.getToken = function() {
	return this.token;
}

/**
 * Set table id.
 * @method setTableId
 */
InitMessage.prototype.setTableId = function(id) {
	this.tableId = id;
}

/**
 * Get table id.
 * @method getTableId
 */
InitMessage.prototype.getTableId = function() {
	return this.tableId;
}

/**
 * Set view case.
 * @method setTableId
 */
InitMessage.prototype.setViewCase = function(viewCase) {
	this.viewCase = viewCase;
}

/**
 * Get view case.
 * @method getTableId
 */
InitMessage.prototype.getViewCase = function() {
	return this.viewCase;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
InitMessage.prototype.unserialize = function(data) {
	this.token = data.token;
	this.tableId = data.tableId;
	this.viewCase = data.viewCase;
}

/**
 * Serialize message.
 * @method serialize
 */
InitMessage.prototype.serialize = function() {
	return {
		token: this.token,
		tableId: this.tableId,
		viewCase: this.viewCase
	};
}

module.exports = InitMessage;
},{}],51:[function(require,module,exports){
/**
 * Received when interface state has changed.
 * @class InterfaceStateMessage
 */
function InterfaceStateMessage(visibleButtons) {
	
	this.visibleButtons = visibleButtons == null ? new Array() : visibleButtons;
}

InterfaceStateMessage.TYPE = "interfaceState";

/**
 * Getter.
 * @method getVisibleButtons
 */
InterfaceStateMessage.prototype.getVisibleButtons = function() {
	return this.seatIndex;
}

/**
 * Un-serialize.
 * @method unserialize
 */
InterfaceStateMessage.prototype.unserialize = function(data) {
	this.visibleButtons = data.visibleButtons;
}

/**
 * Serialize message.
 * @method serialize
 */
InterfaceStateMessage.prototype.serialize = function() {
	return {
		visibleButtons: this.visibleButtons
	};
}

module.exports = InterfaceStateMessage;
},{}],52:[function(require,module,exports){
/**
 * Received when player has placed a bet.
 * @class PayOutMessage
 */
function PayOutMessage() {
	this.values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

PayOutMessage.TYPE = "payOut";

/**
 * Getter.
 * @method getValues
 */
PayOutMessage.prototype.getValues = function() {
	return this.values;
}

/**
 * Set value at.
 * @method setValueAt
 */
PayOutMessage.prototype.setValueAt = function(seatIndex, value) {
	this.values[seatIndex] = value;
}

/**
 * Un-serialize.
 * @method unserialize
 */
PayOutMessage.prototype.unserialize = function(data) {
	for (var i = 0; i < data.values.length; i++) {
		this.values[i] = data.values[i];
	}
}

/**
 * Serialize message.
 * @method serialize
 */
PayOutMessage.prototype.serialize = function() {
	return {
		values: this.values
	};
}

module.exports = PayOutMessage;
},{}],53:[function(require,module,exports){
var CardData = require("../data/CardData");

/**
 * Show pocket cards.
 * @class PocketCardsMessage
 */
function PocketCardsMessage(seatIndex) {
	this.animate = false;
	this.cards = [];
	this.firstIndex = 0;
	this.seatIndex = seatIndex;
}

PocketCardsMessage.TYPE = "pocketCards";

/**
 * Animation?
 * @method setAnimate
 */
PocketCardsMessage.prototype.setAnimate = function(value) {
	this.animate = value;
}

/**
 * Set first index.
 * @method setFirstIndex
 */
PocketCardsMessage.prototype.setFirstIndex = function(index) {
	this.firstIndex = index;
}

/**
 * Get array of CardData.
 * @method getCards
 */
PocketCardsMessage.prototype.getCards = function() {
	return this.cards;
}

/**
 * Add a card.
 * @method addCard
 */
PocketCardsMessage.prototype.addCard = function(c) {
	this.cards.push(c);
}

/**
 * Get first index.
 * @method getFirstIndex
 */
PocketCardsMessage.prototype.getFirstIndex = function() {
	return this.firstIndex;
}

/**
 * Get seat index.
 * @method getSeatIndex
 */
PocketCardsMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
PocketCardsMessage.prototype.unserialize = function(data) {
	var i;

	this.animate = data.animate;
	this.firstIndex = parseInt(data.firstIndex);
	this.cards = [];
	this.seatIndex = data.seatIndex;

	for (i = 0; i < data.cards.length; i++)
		this.cards.push(new CardData(data.cards[i]));
}

/**
 * Serialize message.
 * @method serialize
 */
PocketCardsMessage.prototype.serialize = function() {
	var cards = [];

	for (i = 0; i < this.cards.length; i++)
		cards.push(this.cards[i].getValue());

	return {
		animate: this.animate,
		firstIndex: this.firstIndex,
		cards: cards,
		seatIndex: this.seatIndex
	};
}

module.exports = PocketCardsMessage;
},{"../data/CardData":34}],54:[function(require,module,exports){
/**
 * Received when player pot has changed.
 * @class PotMessage
 */
function PotMessage(values) {
	this.values = values == null ? new Array() : values;
}

PotMessage.TYPE = "pot";

/**
 * Getter.
 * @method getValues
 */
PotMessage.prototype.getValues = function() {
	return this.values;
}

/**
 * Un-serialize.
 * @method unserialize
 */
PotMessage.prototype.unserialize = function(data) {
	this.values = data.values;
}

/**
 * Serialize message.
 * @method serialize
 */
PotMessage.prototype.serialize = function() {
	return {
		values: this.values
	};
}

module.exports = PotMessage;
},{}],55:[function(require,module,exports){
/**
 * Received when Pre tournament info message is dispatched.
 * @class PreTournamentInfoMessage
 */
function PreTournamentInfoMessage(text, countdown) {
	this.text = text;
	this.countdown = countdown;
}

PreTournamentInfoMessage.TYPE = "preTournamentInfo";

/**
 * Getter.
 * @method getText
 */
PreTournamentInfoMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Getter.
 * @method getCountdown
 */
PreTournamentInfoMessage.prototype.getCountdown = function() {
	return this.countdown;
}

/**
 * Un-serialize.
 * @method unserialize
 */
PreTournamentInfoMessage.prototype.unserialize = function(data) {
	this.text = data.text;
	this.countdown = data.countdown;
}

/**
 * Serialize message.
 * @method serialize
 */
PreTournamentInfoMessage.prototype.serialize = function() {
	if(this.countdown < 0)
		this.countdown = 0;
	
	return {
		text: this.text,
		countdown: this.countdown
	};
}

module.exports = PreTournamentInfoMessage;
},{}],56:[function(require,module,exports){
/**
 * Received when ?.
 * @class PresetButtonClickMessage
 */
function PresetButtonClickMessage(button) {
	this.button = button;
	this.value = null;
}

PresetButtonClickMessage.TYPE = "presetButtonClick";

/**
 * Getter.
 * @method getButton
 */
PresetButtonClickMessage.prototype.getButton = function() {
	return this.button;
}

/**
 * Getter.
 * @method getValue
 */
PresetButtonClickMessage.prototype.getValue = function() {
	return this.value;
}

/**
 * Un-serialize.
 * @method unserialize
 */
PresetButtonClickMessage.prototype.unserialize = function(data) {
	this.button = data.button;
	this.value = data.value;
}

/**
 * Serialize message.
 * @method serialize
 */
PresetButtonClickMessage.prototype.serialize = function() {
	return {
		button: this.button,
		value: this.value
	};
}

module.exports = PresetButtonClickMessage;
},{}],57:[function(require,module,exports){
var PresetButtonData = require("../data/PresetButtonData");

/**
 * Received when ?.
 * @class PresetButtonsMessage
 */
function PresetButtonsMessage() {
	this.buttons = new Array(7);
	this.current = null;
}

PresetButtonsMessage.TYPE = "presetButtons";

/**
 * Getter.
 * @method getButtons
 */
PresetButtonsMessage.prototype.getButtons = function() {
	return this.buttons;
}

/**
 * Getter.
 * @method getCurrent
 */
PresetButtonsMessage.prototype.getCurrent = function() {
	return this.current;
}


/**
 * Un-serialize.
 * @method unserialize
 */
PresetButtonsMessage.prototype.unserialize = function(data) {
	this.current = data.current;

	this.buttons = new Array();

	for(var i = 0; i < data.buttons.length; i++) {
		var button = data.buttons[i];
		var buttonData = null;

		if(button != null) {
			buttonData = new PresetButtonData();

			buttonData.button = button.button;
			buttonData.value = button.value;
		}

		this.buttons.push(buttonData);
	}
}

/**
 * Serialize message.
 * @method serialize
 */
PresetButtonsMessage.prototype.serialize = function() {
	var object = {
		buttons: [],
		current: this.current
	};

	for(var i = 0; i < this.buttons.length; i++) {
		var buttonData = this.buttons[i];
		if(buttonData != null)
			object.buttons.push({
				button: buttonData.button,
				value: buttonData.value
			});

		else
			object.buttons.push(null);
	}

	return object;
}

module.exports = PresetButtonsMessage;
},{"../data/PresetButtonData":35}],58:[function(require,module,exports){
/**
 * Message indicating that the user has clicked a seat.
 * @class SeatClickMessage
 */
function SeatClickMessage(seatIndex) {
	this.seatIndex=seatIndex;
}

SeatClickMessage.TYPE = "seatClick";

/**
 * Getter.
 * @method getSeatIndex
 */
SeatClickMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
SeatClickMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
}

/**
 * Serialize message.
 * @method serialize
 */
SeatClickMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
	};
}

module.exports = SeatClickMessage;
},{}],59:[function(require,module,exports){
/**
 * Show username and chips on seat.
 * @class SeatInfoMessage
 */
function SeatInfoMessage(seatIndex) {
	this.seatIndex = seatIndex;
	this.active = true;
	this.sitout = false;
	this.name = "";
	this.chips = "";
}

SeatInfoMessage.TYPE = "seatInfo";

/**
 * Getter.
 * @method getSeatIndex
 */
SeatInfoMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getName
 */
SeatInfoMessage.prototype.getName = function() {
	return this.name;
}

/**
 * Getter.
 * @method getChips
 */
SeatInfoMessage.prototype.getChips = function() {
	return this.chips;
}

/**
 * Getter.
 * @method isSitout
 */
SeatInfoMessage.prototype.isSitout = function() {
	return this.sitout;
}

/**
 * Getter.
 * @method isActive
 */
SeatInfoMessage.prototype.isActive = function() {
	return this.active;
}

/**
 * Setter.
 * @method setActive
 */
SeatInfoMessage.prototype.setActive = function(v) {
	this.active = v;
}

/**
 * Set sitout.
 * @method setSitout
 */
SeatInfoMessage.prototype.setSitout = function(v) {
	this.sitout = v;
}

/**
 * Setter.
 * @method setName
 */
SeatInfoMessage.prototype.setName = function(v) {
	this.name = v;
}

/**
 * Setter.
 * @method setChips
 */
SeatInfoMessage.prototype.setChips = function(v) {
	this.chips = v;
}

/**
 * Un-serialize.
 * @method unserialize
 */
SeatInfoMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
	this.name = data.name;
	this.chips = data.chips;
	this.sitout = data.sitout;
	this.active = data.active;
}

/**
 * Serialize message.
 * @method serialize
 */
SeatInfoMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
		name: this.name,
		chips: this.chips,
		sitout: this.sitout,
		active: this.active
	};
}

module.exports = SeatInfoMessage;
},{}],60:[function(require,module,exports){
/**
 * Show dialog, for e.g. buy in.
 * @class ShowDialogMessage
 */
function ShowDialogMessage() {
	this.text = "";
	this.buttons = [];
	this.defaultValue = null;
}

ShowDialogMessage.TYPE = "showDialog";

/**
 * Add a button to the dialog.
 * @method addButton
 */
ShowDialogMessage.prototype.addButton = function(button) {
	this.buttons.push(button);
}

/**
 * Get text of the dialog.
 * @method getText
 */
ShowDialogMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Get array of ButtonData to be shown in the dialog.
 * @method getButtons
 */
ShowDialogMessage.prototype.getButtons = function() {
	return this.buttons;
}

/**
 * Get default value.
 * @method getButtons
 */
ShowDialogMessage.prototype.getDefaultValue = function() {
	return this.defaultValue;
}

/**
 * Set default value.
 * @method setDefaultValue
 */
ShowDialogMessage.prototype.setDefaultValue = function(v) {
	this.defaultValue=v;
}

/**
 * Set text in the dialog.
 * @method setText
 */
ShowDialogMessage.prototype.setText = function(text) {
	this.text = text;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
ShowDialogMessage.prototype.unserialize = function(data) {
	this.text = data.text;
	this.buttons = data.buttons;
	this.defaultValue = data.defaultValue;
}

/**
 * Serialize message.
 * @method serialize
 */
ShowDialogMessage.prototype.serialize = function() {
	return {
		text: this.text,
		buttons: this.buttons,
		defaultValue: this.defaultValue
	};
}

module.exports = ShowDialogMessage;
},{}],61:[function(require,module,exports){
/**
 * @class StateCompleteMessage
 */
function StateCompleteMessage() {}

StateCompleteMessage.TYPE = "stateComplete";

/**
 * Un-serialize.
 * @method unserialize.
 */
StateCompleteMessage.prototype.unserialize = function(data) {}

/**
 * Serialize message.
 * @method serialize
 */
StateCompleteMessage.prototype.serialize = function() {
	return {};
}

module.exports = StateCompleteMessage;
},{}],62:[function(require,module,exports){
/**
 * Received when table button clicked.
 * @class TableButtonClickMessage
 */
function TableButtonClickMessage(tableIndex) {
	this.tableIndex = tableIndex;
}

TableButtonClickMessage.TYPE = "tableButtonClick";

/**
 * Getter.
 * @method getTableIndex
 */
TableButtonClickMessage.prototype.getTableIndex = function() {
	return this.tableIndex;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TableButtonClickMessage.prototype.unserialize = function(data) {
	this.tableIndex = data.tableIndex;
}

/**
 * Serialize message.
 * @method serialize
 */
TableButtonClickMessage.prototype.serialize = function() {
	return {
		tableIndex: this.tableIndex
	};
}

module.exports = TableButtonClickMessage;
},{}],63:[function(require,module,exports){
/**
 * Received when ?.
 * @class TableButtonsMessage
 */
function TableButtonsMessage() {
	this.enabled = new Array();
	this.currentIndex = -1;
	this.playerIndex = -1;
	this.infoLink = "";
}

TableButtonsMessage.TYPE = "tableButtons";

/**
 * Getter.
 * @method getEnabled
 */
TableButtonsMessage.prototype.getEnabled = function() {
	return this.enabled;
}

/**
 * Getter.
 * @method getCurrentIndex
 */
TableButtonsMessage.prototype.getCurrentIndex = function() {
	return this.currentIndex;
}

/**
 * Getter.
 * @method getPlayerIndex
 */
TableButtonsMessage.prototype.getPlayerIndex = function() {
	return this.playerIndex;
}

/**
 * Getter.
 * @method getInfoLink
 */
TableButtonsMessage.prototype.getInfoLink = function() {
	return this.infoLink;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TableButtonsMessage.prototype.unserialize = function(data) {
	this.playerIndex = data.playerIndex;
	this.currentIndex = data.currentIndex;
	this.infoLink = data.infoLink;

	this.enabled = new Array();
	for(var i = 0; i < data.enabled.length; i++)
		this.enabled.push(data.enabled[i]);
}

/**
 * Serialize message.
 * @method serialize
 */
TableButtonsMessage.prototype.serialize = function() {
	var object = {
		currentIndex: this.currentIndex,
		playerIndex: this.playerIndex,
		enabled: [],
		infoLink: this.infoLink
	};

	for(var i = 0; i < this.enabled.length; i++)
		object.enabled.push(this.enabled[i]);

	return object;
}

module.exports = TableButtonsMessage;
},{}],64:[function(require,module,exports){
/**
 * Received when ?.
 * @class TableInfoMessage
 */
function TableInfoMessage(text, countdown) {
	this.countdown = countdown;
	this.text = text;
	this.showJoinButton = false;
	this.showLeaveButton = false;
	this.infoLink = null;
	this.infoLinkText = null;
}

TableInfoMessage.TYPE = "tableInfo";

/**
 * Getter.
 * @method getCountdown
 */
TableInfoMessage.prototype.getCountdown = function() {
	return this.countdown;
}

/**
 * Getter.
 * @method getText
 */
TableInfoMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Getter.
 * @method getShowJoinButton
 */
TableInfoMessage.prototype.getShowJoinButton = function() {
	return this.showJoinButton;
}

/**
 * Getter.
 * @method getShowLeaveButton
 */
TableInfoMessage.prototype.getShowLeaveButton = function() {
	return this.showLeaveButton;
}

/**
 * Getter.
 * @method getInfoLink
 */
TableInfoMessage.prototype.getInfoLink = function() {
	return this.infoLink;
}

/**
 * Getter.
 * @method getInfoLinkText
 */
TableInfoMessage.prototype.getInfoLinkText = function() {
	return this.infoLinkText;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TableInfoMessage.prototype.unserialize = function(data) {
	if(data.text != null)
		this.text = data.text;

	if(data.countdown != null)
		this.countdown = data.countdown;

	if(data.showJoinButton != null)
		this.showJoinButton = data.showJoinButton;

	if(data.showLeaveButton != null)
		this.showLeaveButton = data.showLeaveButton;

	if(data.infoLink != null)
		this.infoLink = data.infoLink;

	if(data.infoLinkText != null)
		this.infoLinkText = data.infoLinkText;
}

/**
 * Serialize message.
 * @method serialize
 */
TableInfoMessage.prototype.serialize = function() {
	return {
		text: this.text,
		countdown: this.countdown,
		showJoinButton: this.showJoinButton,
		showLeaveButton: this.showLeaveButton,
		infoLink: this.infoLink,
		infoLinkText: this.infoLinkText
	};
}

module.exports = TableInfoMessage;
},{}],65:[function(require,module,exports){
/**
 * Received when ?.
 * @class TestCaseRequestMessage
 */
function TestCaseRequestMessage(testCase) {
	this.testCase = testCase;
}

TestCaseRequestMessage.TYPE = "testCaseRequest";

/**
 * Getter.
 * @method getTestCase
 */
TestCaseRequestMessage.prototype.getTestCase = function() {
	return this.testCase;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TestCaseRequestMessage.prototype.unserialize = function(data) {
	this.testCase = data.testCase;
}

/**
 * Serialize message.
 * @method serialize
 */
TestCaseRequestMessage.prototype.serialize = function() {
	return {
		testCase: this.testCase
	};
}

module.exports = TestCaseRequestMessage;
},{}],66:[function(require,module,exports){
/**
 * Received when ?.
 * @class TimerMessage
 */
function TimerMessage() {
	this.seatIndex = -1;
	this.totalTime = -1;
	this.timeLeft = -1;
}

TimerMessage.TYPE = "timer";

/**
 * Getter.
 * @method getSeatIndex
 */
TimerMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 * @method getTotalTime
 */
TimerMessage.prototype.getTotalTime = function() {
	return this.totalTime;
}

/**
 * Getter.
 * @method getTimeLeft
 */
TimerMessage.prototype.getTimeLeft = function() {
	return this.timeLeft;
}

/**
 * Setter.
 * @method setSeatIndex
 */
TimerMessage.prototype.setSeatIndex = function(value) {
	this.seatIndex = value;
}

/**
 * Setter.
 * @method setTotalTime
 */
TimerMessage.prototype.setTotalTime = function(value) {
	this.totalTime = value;
}

/**
 * Setter.
 * @method setTimeLeft
 */
TimerMessage.prototype.setTimeLeft = function(value) {
	this.timeLeft = value;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TimerMessage.prototype.unserialize = function(data) {
	this.seatIndex = data.seatIndex;
	this.totalTime = data.totalTime;
	this.timeLeft = data.timeLeft;
}

/**
 * Serialize message.
 * @method serialize
 */
TimerMessage.prototype.serialize = function() {
	return {
		seatIndex: this.seatIndex,
		totalTime: this.totalTime,
		timeLeft: this.timeLeft
	};
}

module.exports = TimerMessage;
},{}],67:[function(require,module,exports){
/**
 * Received when tournament result message is dispatched.
 * @class TournamentResultMessage
 */
function TournamentResultMessage(text, rightColumnText) {
	this.text = text;
	this.rightColumnText = rightColumnText;
}

TournamentResultMessage.TYPE = "tournamentResult";

/**
 * Getter.
 * @method getText
 */
TournamentResultMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Getter.
 * @method getRightColumnText
 */
TournamentResultMessage.prototype.getRightColumnText = function() {
	return this.rightColumnText;
}

/**
 * Un-serialize.
 * @method unserialize
 */
TournamentResultMessage.prototype.unserialize = function(data) {
	this.text = data.text;
	this.rightColumnText = data.rightColumnText;
}

/**
 * Serialize message.
 * @method serialize
 */
TournamentResultMessage.prototype.serialize = function() {
	return {
		text: this.text,
		rightColumnText: this.rightColumnText
	};
}

module.exports = TournamentResultMessage;
},{}],68:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");

/**
 * Button.
 * @class Button
 * @module utils
 */
function Button(content) {
	PIXI.DisplayObjectContainer.call(this);

	if (content)
		this.addChild(content);

	this.interactive = true;
	this.buttonMode = true;

	this.mouseover = this.onMouseover.bind(this);
	this.mouseout = this.onMouseout.bind(this);
	this.mousedown = this.onMousedown.bind(this);
	this.mouseup = this.onMouseup.bind(this);
	this.click = this.onClick.bind(this);

	this.colorMatrixFilter = new PIXI.ColorMatrixFilter();
	this.colorMatrixFilter.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	this.filters = [this.colorMatrixFilter];
}

FunctionUtil.extend(Button, PIXI.DisplayObjectContainer);
EventDispatcher.init(Button);

Button.LIGHT_MATRIX = [1.5, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1];
Button.DARK_MATRIX = [.75, 0, 0, 0, 0, .75, 0, 0, 0, 0, .75, 0, 0, 0, 0, 1];
Button.DEFAULT_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

Button.CLICK = "click";

/**
 * Mouse over.
 * @method onMouseover
 * @private
 */
Button.prototype.onMouseover = function() {
	this.colorMatrixFilter.matrix = Button.LIGHT_MATRIX;
}

/**
 * Mouse out.
 * @method onMouseout
 * @private
 */
Button.prototype.onMouseout = function() {
	this.colorMatrixFilter.matrix = Button.DEFAULT_MATRIX;
}

/**
 * Mouse down.
 * @method onMousedown
 * @private
 */
Button.prototype.onMousedown = function() {
	this.colorMatrixFilter.matrix = Button.DARK_MATRIX;
}

/**
 * Mouse up.
 * @method onMouseup
 * @private
 */
Button.prototype.onMouseup = function() {
	this.colorMatrixFilter.matrix = Button.LIGHT_MATRIX;
}

/**
 * Click.
 * @method onClick
 * @private
 */
Button.prototype.onClick = function() {
	this.trigger(Button.CLICK);
}

module.exports = Button;
},{"./EventDispatcher":71,"./FunctionUtil":72,"pixi.js":3}],69:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");
var Button = require("./Button");

/**
 * Checkbox.
 * @class Checkbox
 * @module utils
 */
function Checkbox(background, tick) {
	PIXI.DisplayObjectContainer.call(this);

	this.button = new Button(background);
	this.addChild(this.button);

	this.check = tick;
	this.addChild(this.check);

	this.button.addEventListener("click", this.onButtonClick, this);

	this.setChecked(false);
}

FunctionUtil.extend(Checkbox, PIXI.DisplayObjectContainer);
EventDispatcher.init(Checkbox);

/**
 * Button click.
 * @method onButtonClick
 * @private
 */
Checkbox.prototype.onButtonClick = function() {
	this.check.visible = !this.check.visible;

	this.dispatchEvent("change");
}

/**
 * Setter.
 * @method setChecked
 */
Checkbox.prototype.setChecked = function(value) {
	this.check.visible = value;
	return value;
}

/**
 * Getter.
 * @method getChecked
 */
Checkbox.prototype.getChecked = function() {
	return this.check.visible;
}


module.exports = Checkbox;
},{"./Button":68,"./EventDispatcher":71,"./FunctionUtil":72,"pixi.js":3}],70:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../utils/FunctionUtil");

function ContentScaler(content) {
	PIXI.DisplayObjectContainer.call(this);

	this.contentWidth = 100;
	this.contentHeight = 100;

	this.screenWidth = 100;
	this.screenHeight = 100;

	this.theMask = null;

	if (content)
		this.setContent(content);

	this.align = ContentScaler.MIDDLE;
}

FunctionUtil.extend(ContentScaler, PIXI.DisplayObjectContainer);

ContentScaler.MIDDLE = "middle";
ContentScaler.TOP = "top";

ContentScaler.prototype.setContent = function(content) {
	this.content = content;

	this.addChild(this.content);

	if (this.theMask) {
		this.removeChild(this.theMask);
		this.theMask = null;
	}

	this.theMask = new PIXI.Graphics();
	//this.addChild(this.theMask);

	this.updateScale();
}

ContentScaler.prototype.setContentSize = function(contentWidth, contentHeight) {
	this.contentWidth = contentWidth;
	this.contentHeight = contentHeight;

	this.updateScale();
}

ContentScaler.prototype.setScreenSize = function(screenWidth, screenHeight) {
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;

	this.updateScale();
}

ContentScaler.prototype.setAlign = function(align) {
	this.align = align;
	this.updateScale();
}

ContentScaler.prototype.updateScale = function() {
	var scale;

	if (this.screenWidth / this.contentWidth < this.screenHeight / this.contentHeight)
		scale = this.screenWidth / this.contentWidth;

	else
		scale = this.screenHeight / this.contentHeight;

	this.content.scale.x = scale;
	this.content.scale.y = scale;

	var scaledWidth = this.contentWidth * scale;
	var scaledHeight = this.contentHeight * scale;

	this.content.position.x = (this.screenWidth - scaledWidth) / 2;

	if (this.align == ContentScaler.TOP)
		this.content.position.y = 0;

	else
		this.content.position.y = (this.screenHeight - scaledHeight) / 2;

	var r = new PIXI.Rectangle(this.content.position.x, this.content.position.y, scaledWidth, scaledHeight);
	var right = r.x + r.width;
	var bottom = r.y + r.height;

	this.theMask.clear();
	this.theMask.beginFill();
	this.theMask.drawRect(0, 0, this.screenWidth, r.y);
	this.theMask.drawRect(0, 0, r.x, this.screenHeight);
	this.theMask.drawRect(right, 0, this.screenWidth - right, this.screenHeight);
	this.theMask.drawRect(0, bottom, this.screenWidth, this.screenHeight - bottom);
	this.theMask.endFill();
}

module.exports = ContentScaler;
},{"../utils/FunctionUtil":72,"pixi.js":3}],71:[function(require,module,exports){
"use strict";

/**
 * AS3/jquery style event dispatcher. Slightly modified. The
 * jquery style on/off/trigger style of adding listeners is
 * currently the preferred one.
 * 
 * The on method for adding listeners takes an extra parameter which is the
 * scope in which listeners should be called. So this:
 *
 *     object.on("event", listener, this);
 *
 * Has the same function when adding events as:
 *
 *     object.on("event", listener.bind(this));
 *
 * However, the difference is that if we use the second method it
 * will not be possible to remove the listeners later, unless
 * the closure created by bind is stored somewhere. If the 
 * first method is used, we can remove the listener with:
 *
 *     object.off("event", listener, this);
 *
 * @class EventDispatcher
 * @module utils
 */
function EventDispatcher() {
	this.listenerMap = {};
}

/**
 * Add event listener.
 * @method addEventListener
 * @deprecated
 */
EventDispatcher.prototype.addEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!eventType)
		throw new Error("Event type required for event dispatcher");

	if (!listener)
		throw new Error("Listener required for event dispatcher");

	this.removeEventListener(eventType, listener, scope);

	if (!this.listenerMap.hasOwnProperty(eventType))
		this.listenerMap[eventType] = [];

	this.listenerMap[eventType].push({
		listener: listener,
		scope: scope
	});
}

/**
 * Remove event listener.
 * @method removeEventListener
 * @deprecated
 */
EventDispatcher.prototype.removeEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!this.listenerMap.hasOwnProperty(eventType))
		return;

	var listeners = this.listenerMap[eventType];

	for (var i = 0; i < listeners.length; i++) {
		var listenerObj = listeners[i];

		if (listener == listenerObj.listener && scope == listenerObj.scope) {
			listeners.splice(i, 1);
			i--;
		}
	}

	if (!listeners.length)
		delete this.listenerMap[eventType];
}

/**
 * Dispatch event.
 * @method dispatchEvent
 */
EventDispatcher.prototype.dispatchEvent = function(event, data) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (typeof event == "string") {
		event = {
			type: event
		};
	}

	if (!this.listenerMap.hasOwnProperty(event.type))
		return;

	if (data == undefined)
		data = event;

	data.target = this;

	for (var i in this.listenerMap[event.type]) {
		var listenerObj = this.listenerMap[event.type][i];

		listenerObj.listener.call(listenerObj.scope, data);
	}
}

/**
 * Jquery style alias for addEventListener
 * @method on
 */
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;

/**
 * Jquery style alias for removeEventListener
 * @method off
 */
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;

/**
 * Jquery style alias for dispatchEvent
 * @method trigger
 */
EventDispatcher.prototype.trigger = EventDispatcher.prototype.dispatchEvent;

/**
 * Make something an event dispatcher. Can be used for multiple inheritance.
 * @method init
 * @static
 */
EventDispatcher.init = function(cls) {
	cls.prototype.addEventListener = EventDispatcher.prototype.addEventListener;
	cls.prototype.removeEventListener = EventDispatcher.prototype.removeEventListener;
	cls.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
	cls.prototype.on = EventDispatcher.prototype.on;
	cls.prototype.off = EventDispatcher.prototype.off;
	cls.prototype.trigger = EventDispatcher.prototype.trigger;
}

module.exports = EventDispatcher;
},{}],72:[function(require,module,exports){
/**
 * Function utils.
 * @class FunctionUtil
 * @module utils
 */
function FunctionUtil() {
}

/**
 * Extend a class.
 * Don't forget to call super.
 * @method extend
 * @static
 */
FunctionUtil.extend=function(target, base) {
	target.prototype=Object.create(base.prototype);
	target.prototype.constructor=target;
}

/**
 * Create delegate function. Deprecated, use bind() instead.
 * @method createDelegate
 * @deprecated
 * @static
 */
FunctionUtil.createDelegate=function(func, scope) {
	return function() {
		func.apply(scope,arguments);
	};
}

module.exports=FunctionUtil;

},{}],73:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");

/**
 * Create a sprite with a gradient.
 * @class Gradient
 * @module utils
 */
function Gradient() {
	this.width = 100;
	this.height = 100;
	this.stops = [];
}

/**
 * Set size of the gradient.
 * @method setSize
 */
Gradient.prototype.setSize = function(w, h) {
	this.width = w;
	this.height = h;
}

/**
 * Add color stop.
 * @method addColorStop
 */
Gradient.prototype.addColorStop = function(weight, color) {
	this.stops.push({
		weight: weight,
		color: color
	});
}

/**
 * Render the sprite.
 * @method createSprite
 */
Gradient.prototype.createSprite = function() {
	console.log("rendering gradient...");
	var c = document.createElement("canvas");
	c.width = this.width;
	c.height = this.height;

	var ctx = c.getContext("2d");
	var grd = ctx.createLinearGradient(0, 0, 0, this.height);
	var i;

	for (i = 0; i < this.stops.length; i++)
		grd.addColorStop(this.stops[i].weight, this.stops[i].color);

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, this.width, this.height);

	return new PIXI.Sprite(PIXI.Texture.fromCanvas(c));
}

module.exports = Gradient;
},{"./FunctionUtil":72,"pixi.js":3}],74:[function(require,module,exports){
var EventDispatcher = require("./EventDispatcher");
var FunctionUtil = require("./FunctionUtil");
var Thenable = require("./Thenable");

/**
 * Message connection in a browser.
 * @class MessageWebSocketConnection
 * @module utils
 */
function MessageWebSocketConnection() {
	EventDispatcher.call(this);
	this.test = 1;
}

FunctionUtil.extend(MessageWebSocketConnection, EventDispatcher);

MessageWebSocketConnection.CONNECT = "connect";
MessageWebSocketConnection.MESSAGE = "message";
MessageWebSocketConnection.CLOSE = "close";

/**
 * Connect.
 * @method connect
 */
MessageWebSocketConnection.prototype.connect = function(url) {
	this.webSocket = new WebSocket(url);

	this.webSocket.onopen = this.onWebSocketOpen.bind(this);
	this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
	this.webSocket.onclose = this.onWebSocketClose.bind(this);
	this.webSocket.onerror = this.onWebSocketError.bind(this);
}

/**
 * Send.
 * @method send
 */
MessageWebSocketConnection.prototype.send = function(m) {
	this.webSocket.send(JSON.stringify(m));
}

/**
 * Web socket open.
 * @method onWebSocketOpen
 * @private
 */
MessageWebSocketConnection.prototype.onWebSocketOpen = function() {
	this.trigger(MessageWebSocketConnection.CONNECT);
}

/**
 * Web socket message.
 * @method onWebSocketMessage
 * @private
 */
MessageWebSocketConnection.prototype.onWebSocketMessage = function(e) {
	var message = JSON.parse(e.data);

	this.trigger({
		type: MessageWebSocketConnection.MESSAGE,
		message: message
	});
}

/**
 * Web socket close.
 * @method onWebSocketClose
 * @private
 */
MessageWebSocketConnection.prototype.onWebSocketClose = function() {
	console.log("web socket close, ws=" + this.webSocket + " this=" + this.test);
	this.webSocket.close();
	this.clearWebSocket();

	this.trigger(MessageWebSocketConnection.CLOSE);
}

/**
 * Web socket error.
 * @method onWebSocketError
 * @private
 */
MessageWebSocketConnection.prototype.onWebSocketError = function() {
	console.log("web socket error, ws=" + this.webSocket + " this=" + this.test);

	this.webSocket.close();
	this.clearWebSocket();

	this.trigger(MessageWebSocketConnection.CLOSE);
}

/**
 * Clear the current web socket.
 * @method clearWebSocket
 */
MessageWebSocketConnection.prototype.clearWebSocket = function() {
	this.webSocket.onopen = null;
	this.webSocket.onmessage = null;
	this.webSocket.onclose = null;
	this.webSocket.onerror = null;

	this.webSocket = null;
}

module.exports = MessageWebSocketConnection;
},{"./EventDispatcher":71,"./FunctionUtil":72,"./Thenable":81}],75:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");

/**
 * MouseOverGroup. This is the class for the MouseOverGroup.
 * @class MouseOverGroup
 * @module utils
 */
function MouseOverGroup() {
	this.objects = new Array();
	this.currentlyOver = false;
	this.mouseDown = false;

}
FunctionUtil.extend(MouseOverGroup, PIXI.DisplayObjectContainer);
EventDispatcher.init(MouseOverGroup);


/**
 * Add displayobject to watchlist.
 * @method addDisplayObject
 */
MouseOverGroup.prototype.addDisplayObject = function(displayObject) {

	displayObject.interactive = true;
	displayObject.mouseoverEnabled = true;
	displayObject.mouseover = this.onObjectMouseOver.bind(this);
	displayObject.mouseout = this.onObjectMouseOut.bind(this);
	displayObject.mousedown = this.onObjectMouseDown.bind(this);
	this.objects.push(displayObject);

}


/**
 * Mouse over object.
 * @method onObjectMouseOver
 */
MouseOverGroup.prototype.onObjectMouseOver = function(interaction_object) {
	if(this.currentlyOver)
		return;

	this.currentlyOver = true;
	this.dispatchEvent("mouseover");
}


/**
 * Mouse out object.
 * @method onObjectMouseOut
 */
MouseOverGroup.prototype.onObjectMouseOut = function(interaction_object) {
	if(!this.currentlyOver || this.mouseDown)
		return;

	for(var i = 0; i < this.objects.length; i++)
		if(this.hitTest(this.objects[i], interaction_object))
			return;

	this.currentlyOver = false;
	this.dispatchEvent("mouseout");
}


/**
 * Hit test.
 * @method hitTest
 */
MouseOverGroup.prototype.hitTest = function(object, interaction_object) {
	if((interaction_object.global.x > object.getBounds().x ) && (interaction_object.global.x < (object.getBounds().x + object.getBounds().width)) &&
		(interaction_object.global.y > object.getBounds().y) && (interaction_object.global.y < (object.getBounds().y + object.getBounds().height))) {
		return true;		
	}
	return false;
}


/**
 * Mouse down object.
 * @method onObjectMouseDown
 */
MouseOverGroup.prototype.onObjectMouseDown = function(interaction_object) {
	this.mouseDown = true;
	interaction_object.target.mouseup = interaction_object.target.mouseupoutside = this.onStageMouseUp.bind(this);
}


/**
 * Mouse up stage.
 * @method onStageMouseUp
 */
MouseOverGroup.prototype.onStageMouseUp = function(interaction_object) {
	interaction_object.target.mouseup = interaction_object.target.mouseupoutside = null;
	this.mouseDown = false;

	if(this.currentlyOver) {
		var over = false;

		for(var i = 0; i < this.objects.length; i++)
			if(this.hitTest(this.objects[i], interaction_object))
				over = true;

		if(!over) {
			this.currentlyOver = false;
			this.dispatchEvent("mouseout");
		}
	}
}


module.exports = MouseOverGroup;


},{"./EventDispatcher":71,"./FunctionUtil":72,"pixi.js":3}],76:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");

/**
 * Nine slice. This is a sprite that is a grid, and only the
 * middle part stretches when scaling.
 * @class NineSlice
 * @module utils
 */
function NineSlice(texture, left, top, right, bottom) {
	PIXI.DisplayObjectContainer.call(this);

	this.texture = texture;

	if (!top)
		top = left;

	if (!right)
		right = left;

	if (!bottom)
		bottom = top;

	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;

	this.localWidth = texture.width;
	this.localHeight = texture.height;

	this.buildParts();
	this.updateSizes();
}

FunctionUtil.extend(NineSlice, PIXI.DisplayObjectContainer);

/**
 * Build the parts for the slices.
 * @method buildParts
 * @private
 */
NineSlice.prototype.buildParts = function() {
	var xp = [0, this.left, this.texture.width - this.right, this.texture.width];
	var yp = [0, this.top, this.texture.height - this.bottom, this.texture.height];
	var hi, vi;

	this.parts = [];

	for (vi = 0; vi < 3; vi++) {
		for (hi = 0; hi < 3; hi++) {
			var w = xp[hi + 1] - xp[hi];
			var h = yp[vi + 1] - yp[vi];

			if (w != 0 && h != 0) {
				var texturePart = this.createTexturePart(xp[hi], yp[vi], w, h);
				var s = new PIXI.Sprite(texturePart);
				this.addChild(s);

				this.parts.push(s);
			} else {
				this.parts.push(null);
			}
		}
	}
}

/**
 * Update sizes.
 * @method updateSizes
 * @private
 */
NineSlice.prototype.updateSizes = function() {
	var xp = [0, this.left, this.localWidth - this.right, this.localWidth];
	var yp = [0, this.top, this.localHeight - this.bottom, this.localHeight];
	var hi, vi, i = 0;

	for (vi = 0; vi < 3; vi++) {
		for (hi = 0; hi < 3; hi++) {
			if (this.parts[i]) {
				var part = this.parts[i];

				part.position.x = xp[hi];
				part.position.y = yp[vi];
				part.width = xp[hi + 1] - xp[hi];
				part.height = yp[vi + 1] - yp[vi];
			}

			i++;
		}
	}
}

/**
 * Set local size.
 * @method setLocalSize
 */
NineSlice.prototype.setLocalSize = function(w, h) {
	this.localWidth = w;
	this.localHeight = h;
	this.updateSizes();
}

/**
 * Create texture part.
 * @method createTexturePart
 * @private
 */
NineSlice.prototype.createTexturePart = function(x, y, width, height) {
	var frame = {
		x: this.texture.frame.x + x,
		y: this.texture.frame.y + y,
		width: width,
		height: height
	};

	return new PIXI.Texture(this.texture, frame);
}

module.exports = NineSlice;
},{"./FunctionUtil":72,"pixi.js":3}],77:[function(require,module,exports){
"use strict";

var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("./FunctionUtil");
var ContentScaler = require("./ContentScaler");
//var FrameTimer = require("./FrameTimer");

/**
 * Pixi full window app.
 * Can operate using window coordinates or scaled to specific area.
 * @class PixiApp
 * @module utils
 */
function PixiApp(domId, width, height) {
	PIXI.DisplayObjectContainer.call(this);

	this.contentAlign=ContentScaler.MIDDLE;

	var view;

	if (navigator.isCocoonJS)
		view = document.createElement('screencanvas');

	else
		view = document.createElement('canvas');

	if (!domId) {
		if (PixiApp.fullScreenInstance)
			throw new Error("Only one PixiApp per app");

		PixiApp.fullScreenInstance = this;

		console.log("no dom it, attaching to body");
		this.containerEl = document.body;
		document.body.style.margin = 0;
		document.body.style.padding = 0;

		document.body.onresize = FunctionUtil.createDelegate(this.onWindowResize, this);
		window.onresize = FunctionUtil.createDelegate(this.onWindowResize, this);
	} else {
		console.log("attaching to: " + domId);
		this.containerEl = document.getElementById(domId);
	}

	this.renderer = new PIXI.autoDetectRenderer(this.containerEl.clientWidth, this.containerEl.clientHeight, view);
	this.containerEl.appendChild(this.renderer.view);

	this.contentScaler = null;

	this.appStage = new PIXI.Stage(0, true);

	if (!width || !height)
		this.useNoScaling();

	else
		this.useScaling(width, height);

//	FrameTimer.getInstance().addEventListener(FrameTimer.RENDER, this.onAnimationFrame, this);

	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

FunctionUtil.extend(PixiApp, PIXI.DisplayObjectContainer);

/**
 * Use scaling mode.
 * @method useScaling
 */
PixiApp.prototype.useScaling = function(w, h) {
	this.removeContent();

	this.contentScaler = new ContentScaler(this);
	this.contentScaler.setAlign(this.contentAlign);
	this.contentScaler.setContentSize(w, h);
	this.contentScaler.setScreenSize(this.containerEl.clientWidth, this.containerEl.clientHeight);
	this.appStage.addChild(this.contentScaler);
}

/**
 * Set content alignment.
 * @method setContentAlign
 */
PixiApp.prototype.setContentAlign = function(align) {
	this.contentAlign=align;

	if (this.contentScaler)
		this.contentScaler.setAlign(this.contentAlign);
}

/**
 * Use no scaling mode.
 * @method useNoScaling
 */
PixiApp.prototype.useNoScaling = function() {
	this.removeContent();

	this.appStage.addChild(this);
}

/**
 * Remove any content.
 * @method removeContent
 * @private
 */
PixiApp.prototype.removeContent = function() {
	if (this.appStage.children.indexOf(this) >= 0)
		this.appStage.removeChild(this);

	if (this.contentScaler) {
		this.appStage.removeChild(this.contentScaler)
		this.contentScaler = null;
	}
}

/**
 * Window resize.
 * @method onWindowResize
 * @private
 */
PixiApp.prototype.onWindowResize = function() {
	if (this.contentScaler)
		this.contentScaler.setScreenSize(this.containerEl.clientWidth, this.containerEl.clientHeight);

	this.renderer.resize(this.containerEl.clientWidth, this.containerEl.clientHeight);
	this.renderer.render(this.appStage);
}

/**
 * Animation frame.
 * @method onAnimationFrame
 * @private
 */
PixiApp.prototype.onAnimationFrame = function(time) {
	this.renderer.render(this.appStage);
	TWEEN.update(time);

	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

/**
 * Get canvas.
 * @method getCanvas
 */
PixiApp.prototype.getCanvas = function() {
	return this.renderer.view;
}

/**
 * Get stage.
 * @method getStage
 */
PixiApp.prototype.getStage = function() {
	return this.appStage;
}

module.exports = PixiApp;
},{"./ContentScaler":70,"./FunctionUtil":72,"pixi.js":3,"tween.js":4}],78:[function(require,module,exports){
/**
 * Represents a point.
 * @class Point
 * @module utils
 */
function Point(x, y) {
	if (!(this instanceof Point))
		return new Point(x, y);

	this.x = x;
	this.y = y;
}

module.exports = Point;
},{}],79:[function(require,module,exports){
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");

/**
 * Perform tasks in a sequence.
 * Tasks, which should be event dispatchers,
 * are euqueued with the enqueue function,
 * a START event is dispatcher upon task
 * start, and the task is considered complete
 * as it dispatches a COMPLETE event.
 * @class Sequencer
 * @module utils
 */
function Sequencer() {
	EventDispatcher.call(this);

	this.queue = [];
	this.currentTask = null;
	this.onTaskCompleteClosure = this.onTaskComplete.bind(this);
}

FunctionUtil.extend(Sequencer, EventDispatcher);

Sequencer.START = "start";
Sequencer.COMPLETE = "complete";

/**
 * Enqueue a task to be performed.
 * @method enqueue
 */
Sequencer.prototype.enqueue = function(task) {
	if (!this.currentTask)
		this.startTask(task)

	else
		this.queue.push(task);
}

/**
 * Start the task.
 * @method startTask
 * @private
 */
Sequencer.prototype.startTask = function(task) {
	this.currentTask = task;

	this.currentTask.addEventListener(Sequencer.COMPLETE, this.onTaskCompleteClosure);
	this.currentTask.dispatchEvent({
		type: Sequencer.START
	});
}

/**
 * The current task is complete.
 * @method onTaskComplete
 * @private
 */
Sequencer.prototype.onTaskComplete = function() {
	this.currentTask.removeEventListener(Sequencer.COMPLETE, this.onTaskCompleteClosure);
	this.currentTask = null;

	if (this.queue.length > 0)
		this.startTask(this.queue.shift());

	else
		this.trigger(Sequencer.COMPLETE);

}

/**
 * Abort the sequence.
 * @method abort
 */
Sequencer.prototype.abort = function() {
	if (this.currentTask) {
		this.currentTask.removeEventListener(Sequencer.COMPLETE, this.onTaskCompleteClosure);
		this.currentTask = null;
	}

	this.queue = [];
}

module.exports = Sequencer;
},{"./EventDispatcher":71,"./FunctionUtil":72}],80:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");

/**
 * Slider. This is the class for the slider.
 * @class Slider
 * @module utils
 */
function Slider(background, knob) {
	PIXI.DisplayObjectContainer.call(this);

	this.background = background;
	this.knob = knob;

	this.addChild(this.background);
	this.addChild(this.knob);


	this.knob.buttonMode = true;
	this.knob.interactive = true;
	this.knob.mousedown = this.onKnobMouseDown.bind(this);

	this.background.buttonMode = true;
	this.background.interactive = true;
	this.background.mousedown = this.onBackgroundMouseDown.bind(this);

	this.fadeTween = null;
	this.alpha = 0;
}

FunctionUtil.extend(Slider, PIXI.DisplayObjectContainer);
EventDispatcher.init(Slider);


/**
 * Mouse down on knob.
 * @method onKnobMouseDown
 */
Slider.prototype.onKnobMouseDown = function(interaction_object) {
	this.downPos = this.knob.position.x;
	this.downX = interaction_object.getLocalPosition(this).x;

	this.stage.mouseup = this.onStageMouseUp.bind(this);
	this.stage.mousemove = this.onStageMouseMove.bind(this);
}


/**
 * Mouse down on background.
 * @method onBackgroundMouseDown
 */
Slider.prototype.onBackgroundMouseDown = function(interaction_object) {
	this.downX = interaction_object.getLocalPosition(this).x;
	this.knob.x = interaction_object.getLocalPosition(this).x - this.knob.width*0.5;

	this.validateValue();

	this.downPos = this.knob.position.x;

	this.stage.mouseup = this.onStageMouseUp.bind(this);
	this.stage.mousemove = this.onStageMouseMove.bind(this);

	this.dispatchEvent("change");
}


/**
 * Mouse up.
 * @method onStageMouseUp
 */
Slider.prototype.onStageMouseUp = function(interaction_object) {
	this.stage.mouseup = null;
	this.stage.mousemove = null;
}


/**
 * Mouse move.
 * @method onStageMouseMove
 */
Slider.prototype.onStageMouseMove = function(interaction_object) {
	this.knob.x = this.downPos + (interaction_object.getLocalPosition(this).x - this.downX);

	this.validateValue();

	this.dispatchEvent("change");
}


/**
 * Validate position.
 * @method validateValue
 */
Slider.prototype.validateValue = function() {

	if(this.knob.x < 0)
		this.knob.x = 0;

	if(this.knob.x > (this.background.width - this.knob.width))
		this.knob.x = this.background.width - this.knob.width;
}


/**
 * Get value.
 * @method getValue
 */
Slider.prototype.getValue = function() {
	var fraction = this.knob.position.x/(this.background.width - this.knob.width);

	return fraction;
}


/**
 * Get value.
 * @method getValue
 */
Slider.prototype.setValue = function(value) {
	this.knob.x = this.background.position.x + value*(this.background.width - this.knob.width);

	this.validateValue();
	return this.getValue();
}


/**
 * Show.
 * @method show
 */
Slider.prototype.show = function() {
	this.visible = true;
	if(this.fadeTween != null)
		this.fadeTween.stop();
	this.fadeTween = new TWEEN.Tween(this)
			.to({alpha: 1}, 250)
			.start();
}

/**
 * Hide.
 * @method hide
 */
Slider.prototype.hide = function() {
	if(this.fadeTween != null)
		this.fadeTween.stop();
	this.fadeTween = new TWEEN.Tween(this)
			.to({alpha: 0}, 250)
			.onComplete(this.onHidden.bind(this))
			.start();
}

/**
 * On hidden.
 * @method onHidden
 */
Slider.prototype.onHidden = function() {
	this.visible = false;
}


module.exports = Slider;

},{"./EventDispatcher":71,"./FunctionUtil":72,"pixi.js":3,"tween.js":4}],81:[function(require,module,exports){
var EventDispatcher = require("./EventDispatcher");
var FunctionUtil = require("./FunctionUtil");

/**
 * An implementation of promises as defined here:
 * http://promises-aplus.github.io/promises-spec/
 * @class Thenable
 * @module utils
 */
function Thenable() {
	EventDispatcher.call(this)

	this.successHandlers = [];
	this.errorHandlers = [];
	this.notified = false;
	this.handlersCalled = false;
	this.notifyParam = null;
}

FunctionUtil.extend(Thenable, EventDispatcher);

/**
 * Set resolution handlers.
 * @method then
 * @param success The function called to handle success.
 * @param error The function called to handle error.
 * @return This Thenable for chaining.
 */
Thenable.prototype.then = function(success, error) {
	if (this.handlersCalled)
		throw new Error("This thenable is already used.");

	this.successHandlers.push(success);
	this.errorHandlers.push(error);

	return this;
}

/**
 * Notify success of the operation.
 * @method notifySuccess
 */
Thenable.prototype.notifySuccess = function(param) {
	if (this.handlersCalled)
		throw new Error("This thenable is already notified.");

	this.notifyParam = param;
	setTimeout(this.doNotifySuccess.bind(this), 0);
}

/**
 * Notify failure of the operation.
 * @method notifyError
 */
Thenable.prototype.notifyError = function(param) {
	if (this.handlersCalled)
		throw new Error("This thenable is already notified.");

	this.notifyParam = param;
	setTimeout(this.doNotifyError.bind(this), 0);
}

/**
 * Actually notify success.
 * @method doNotifySuccess
 * @private
 */
Thenable.prototype.doNotifySuccess = function(param) {
	if (param)
		this.notifyParam = param;

	this.callHandlers(this.successHandlers);
}

/**
 * Actually notify error.
 * @method doNotifyError
 * @private
 */
Thenable.prototype.doNotifyError = function() {
	this.callHandlers(this.errorHandlers);
}

/**
 * Call handlers.
 * @method callHandlers
 * @private
 */
Thenable.prototype.callHandlers = function(handlers) {
	if (this.handlersCalled)
		throw new Error("Should never happen.");

	this.handlersCalled = true;

	for (var i in handlers) {
		if (handlers[i]) {
			try {
				handlers[i].call(null, this.notifyParam);
			} catch (e) {
				console.error("Exception in Thenable handler: " + e);
				console.log(e.stack);
				throw e;
			}
		}
	}
}

/**
 * Resolve promise.
 * @method resolve
 */
Thenable.prototype.resolve = function(result) {
	this.notifySuccess(result);
}

/**
 * Reject promise.
 * @method reject
 */
Thenable.prototype.reject = function(reason) {
	this.notifyError(reason);
}

module.exports = Thenable;
},{"./EventDispatcher":71,"./FunctionUtil":72}]},{},[12])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9ub2RlX21vZHVsZXMvUGl4aVRleHRJbnB1dC9pbmRleC5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL25vZGVfbW9kdWxlcy9QaXhpVGV4dElucHV0L3NyYy9QaXhpVGV4dElucHV0LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvbm9kZV9tb2R1bGVzL3BpeGkuanMvYmluL3BpeGkuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9ub2RlX21vZHVsZXMvdHdlZW4uanMvaW5kZXguanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L2FwcC9OZXRQb2tlckNsaWVudC5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvYXBwL1NldHRpbmdzLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC9jb250cm9sbGVyL0ludGVyZmFjZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L2NvbnRyb2xsZXIvTWVzc2FnZVNlcXVlbmNlSXRlbS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvY29udHJvbGxlci9NZXNzYWdlU2VxdWVuY2VyLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC9jb250cm9sbGVyL05ldFBva2VyQ2xpZW50Q29udHJvbGxlci5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvY29udHJvbGxlci9UYWJsZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L25ldHBva2VyY2xpZW50LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC9yZXNvdXJjZXMvRGVmYXVsdFNraW4uanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3Jlc291cmNlcy9SZXNvdXJjZXMuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3ZpZXcvQmlnQnV0dG9uLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0J1dHRvbnNWaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0NhcmRWaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0NoYXRWaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0NoaXBzVmlldy5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9EZWFsZXJCdXR0b25WaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0RpYWxvZ0J1dHRvbi5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9EaWFsb2dWaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0xvYWRpbmdTY3JlZW4uanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3ZpZXcvTmV0UG9rZXJDbGllbnRWaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L1BvdFZpZXcuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3ZpZXcvUmFpc2VTaG9ydGN1dEJ1dHRvbi5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9TZWF0Vmlldy5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9TZXR0aW5nc0NoZWNrYm94LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L1NldHRpbmdzVmlldy5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9UYWJsZUluZm9WaWV3LmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L1RpbWVyVmlldy5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9Qcm90b0Nvbm5lY3Rpb24uanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vZGF0YS9CdXR0b25EYXRhLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL2RhdGEvQ2FyZERhdGEuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vZGF0YS9QcmVzZXRCdXR0b25EYXRhLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0FjdGlvbk1lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvQmV0TWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9CZXRzVG9Qb3RNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0J1dHRvbkNsaWNrTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9CdXR0b25zTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9DaGF0TWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9DaGVja2JveE1lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvQ2xlYXJNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0NvbW11bml0eUNhcmRzTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9EZWFsZXJCdXR0b25NZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0RlbGF5TWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9GYWRlVGFibGVNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0ZvbGRDYXJkc01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvSGFuZEluZm9NZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0luaXRNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0ludGVyZmFjZVN0YXRlTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9QYXlPdXRNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1BvY2tldENhcmRzTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9Qb3RNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1ByZVRvdXJuYW1lbnRJbmZvTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9QcmVzZXRCdXR0b25DbGlja01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvUHJlc2V0QnV0dG9uc01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvU2VhdENsaWNrTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9TZWF0SW5mb01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvU2hvd0RpYWxvZ01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvU3RhdGVDb21wbGV0ZU1lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvVGFibGVCdXR0b25DbGlja01lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvVGFibGVCdXR0b25zTWVzc2FnZS5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9wcm90by9tZXNzYWdlcy9UYWJsZUluZm9NZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1Rlc3RDYXNlUmVxdWVzdE1lc3NhZ2UuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvVGltZXJNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1RvdXJuYW1lbnRSZXN1bHRNZXNzYWdlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL0J1dHRvbi5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9DaGVja2JveC5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9Db250ZW50U2NhbGVyLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9GdW5jdGlvblV0aWwuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvR3JhZGllbnQuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvTW91c2VPdmVyR3JvdXAuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvTmluZVNsaWNlLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL1BpeGlBcHAuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvUG9pbnQuanMiLCIvVXNlcnMvbWxpbmRxdmlzdC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvU2VxdWVuY2VyLmpzIiwiL1VzZXJzL21saW5kcXZpc3QvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL1NsaWRlci5qcyIsIi9Vc2Vycy9tbGluZHF2aXN0L0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9UaGVuYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQaXhpVGV4dElucHV0ID0gcmVxdWlyZShcIi4vc3JjL1BpeGlUZXh0SW5wdXRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUGl4aVRleHRJbnB1dCIsImlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG59XG5cbi8qKlxuICogVGV4dCBpbnB1dCBmaWVsZCBmb3IgcGl4aS5qcy5cbiAqIEBjbGFzcyBQaXhpVGV4dElucHV0XG4gKi9cbmZ1bmN0aW9uIFBpeGlUZXh0SW5wdXQodGV4dCwgc3R5bGUpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0aWYgKCF0ZXh0KVxuXHRcdHRleHQgPSBcIlwiO1xuXG5cdHRleHQgPSB0ZXh0LnRvU3RyaW5nKCk7XG5cblx0aWYgKHN0eWxlICYmIHN0eWxlLndvcmRXcmFwKVxuXHRcdHRocm93IFwid29yZFdyYXAgaXMgbm90IHN1cHBvcnRlZCBmb3IgaW5wdXQgZmllbGRzXCI7XG5cblx0dGhpcy5fdGV4dCA9IHRleHQ7XG5cblx0dGhpcy5sb2NhbFdpZHRoID0gMTAwO1xuXHR0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSAweGZmZmZmZjtcblx0dGhpcy5fY2FyZXRDb2xvciA9IDB4MDAwMDAwO1xuXHR0aGlzLl9iYWNrZ3JvdW5kID0gdHJ1ZTtcblxuXHR0aGlzLnN0eWxlID0gc3R5bGU7XG5cdHRoaXMudGV4dEZpZWxkID0gbmV3IFBJWEkuVGV4dCh0aGlzLl90ZXh0LCBzdHlsZSk7XG5cblx0dGhpcy5sb2NhbEhlaWdodCA9XG5cdFx0dGhpcy50ZXh0RmllbGQuZGV0ZXJtaW5lRm9udEhlaWdodCgnZm9udDogJyArIHRoaXMudGV4dEZpZWxkLnN0eWxlLmZvbnQgKyAnOycpICtcblx0XHR0aGlzLnRleHRGaWVsZC5zdHlsZS5zdHJva2VUaGlja25lc3M7XG5cdHRoaXMuYmFja2dyb3VuZEdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0dGhpcy50ZXh0RmllbGRNYXNrID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0dGhpcy5jYXJldCA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdHRoaXMuZHJhd0VsZW1lbnRzKCk7XG5cblx0dGhpcy5hZGRDaGlsZCh0aGlzLmJhY2tncm91bmRHcmFwaGljcyk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0RmllbGQpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuY2FyZXQpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudGV4dEZpZWxkTWFzayk7XG5cblx0dGhpcy5zY3JvbGxJbmRleCA9IDA7XG5cdHRoaXMuX2NhcmV0SW5kZXggPSAwO1xuXHR0aGlzLmNhcmV0Rmxhc2hJbnRlcnZhbCA9IG51bGw7XG5cdHRoaXMuYmx1cigpO1xuXHR0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb24oKTtcblxuXHR0aGlzLmJhY2tncm91bmRHcmFwaGljcy5pbnRlcmFjdGl2ZSA9IHRydWU7XG5cdHRoaXMuYmFja2dyb3VuZEdyYXBoaWNzLmJ1dHRvbk1vZGUgPSB0cnVlO1xuXHR0aGlzLmJhY2tncm91bmRHcmFwaGljcy5kZWZhdWx0Q3Vyc29yID0gXCJ0ZXh0XCI7XG5cblx0dGhpcy5iYWNrZ3JvdW5kR3JhcGhpY3MubW91c2Vkb3duID0gdGhpcy5vbkJhY2tncm91bmRNb3VzZURvd24uYmluZCh0aGlzKTtcblx0dGhpcy5rZXlFdmVudENsb3N1cmUgPSB0aGlzLm9uS2V5RXZlbnQuYmluZCh0aGlzKTtcblx0dGhpcy53aW5kb3dCbHVyQ2xvc3VyZSA9IHRoaXMub25XaW5kb3dCbHVyLmJpbmQodGhpcyk7XG5cdHRoaXMuZG9jdW1lbnRNb3VzZURvd25DbG9zdXJlID0gdGhpcy5vbkRvY3VtZW50TW91c2VEb3duLmJpbmQodGhpcyk7XG5cdHRoaXMuaXNGb2N1c0NsaWNrID0gZmFsc2U7XG5cblx0dGhpcy51cGRhdGVUZXh0KCk7XG5cblx0dGhpcy50ZXh0RmllbGQubWFzayA9IHRoaXMudGV4dEZpZWxkTWFzaztcblxuXHR0aGlzLmtleXByZXNzID0gbnVsbDtcblx0dGhpcy5rZXlkb3duID0gbnVsbDtcblx0dGhpcy5jaGFuZ2UgPSBudWxsO1xufVxuXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSk7XG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBpeGlUZXh0SW5wdXQ7XG5cbi8qKlxuICogU29tZW9uZSBjbGlja2VkLlxuICogQG1ldGhvZCBvbkJhY2tncm91bmRNb3VzZURvd25cbiAqIEBwcml2YXRlXG4gKi9cblBpeGlUZXh0SW5wdXQucHJvdG90eXBlLm9uQmFja2dyb3VuZE1vdXNlRG93biA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIHggPSBlLmdldExvY2FsUG9zaXRpb24odGhpcykueDtcblx0dGhpcy5fY2FyZXRJbmRleCA9IHRoaXMuZ2V0Q2FyZXRJbmRleEJ5Q29vcmQoeCk7XG5cdHRoaXMudXBkYXRlQ2FyZXRQb3NpdGlvbigpO1xuXG5cdHRoaXMuZm9jdXMoKTtcblxuXHR0aGlzLmlzRm9jdXNDbGljayA9IHRydWU7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0c2NvcGUuaXNGb2N1c0NsaWNrID0gZmFsc2U7XG5cdH0sIDApO1xufVxuXG4vKipcbiAqIEZvY3VzIHRoaXMgaW5wdXQgZmllbGQuXG4gKiBAbWV0aG9kIGZvY3VzXG4gKi9cblBpeGlUZXh0SW5wdXQucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYmx1cigpO1xuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RXZlbnRDbG9zdXJlKTtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIHRoaXMua2V5RXZlbnRDbG9zdXJlKTtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLmRvY3VtZW50TW91c2VEb3duQ2xvc3VyZSk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLndpbmRvd0JsdXJDbG9zdXJlKTtcblxuXHR0aGlzLnNob3dDYXJldCgpO1xufVxuXG4vKipcbiAqIEhhbmRsZSBrZXkgZXZlbnQuXG4gKiBAbWV0aG9kIG9uS2V5RXZlbnRcbiAqIEBwcml2YXRlXG4gKi9cblBpeGlUZXh0SW5wdXQucHJvdG90eXBlLm9uS2V5RXZlbnQgPSBmdW5jdGlvbihlKSB7XG5cdC8qY29uc29sZS5sb2coXCJrZXkgZXZlbnRcIik7XG5cdGNvbnNvbGUubG9nKGUpOyovXG5cblx0aWYgKGUudHlwZSA9PSBcImtleXByZXNzXCIpIHtcblx0XHRpZiAoZS5jaGFyQ29kZSA8IDMyKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fdGV4dCA9XG5cdFx0XHR0aGlzLl90ZXh0LnN1YnN0cmluZygwLCB0aGlzLl9jYXJldEluZGV4KSArXG5cdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKGUuY2hhckNvZGUpICtcblx0XHRcdHRoaXMuX3RleHQuc3Vic3RyaW5nKHRoaXMuX2NhcmV0SW5kZXgpO1xuXG5cdFx0dGhpcy5fY2FyZXRJbmRleCsrO1xuXHRcdHRoaXMuZW5zdXJlQ2FyZXRJblZpZXcoKTtcblx0XHR0aGlzLnNob3dDYXJldCgpO1xuXHRcdHRoaXMudXBkYXRlVGV4dCgpO1xuXHRcdHRoaXMudHJpZ2dlcih0aGlzLmtleXByZXNzLCBlKTtcblx0XHR0aGlzLnRyaWdnZXIodGhpcy5jaGFuZ2UpO1xuXHR9XG5cblx0aWYgKGUudHlwZSA9PSBcImtleWRvd25cIikge1xuXHRcdHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdFx0XHRjYXNlIDg6XG5cdFx0XHRcdGlmICh0aGlzLl9jYXJldEluZGV4ID4gMCkge1xuXHRcdFx0XHRcdHRoaXMuX3RleHQgPVxuXHRcdFx0XHRcdFx0dGhpcy5fdGV4dC5zdWJzdHJpbmcoMCwgdGhpcy5fY2FyZXRJbmRleCAtIDEpICtcblx0XHRcdFx0XHRcdHRoaXMuX3RleHQuc3Vic3RyaW5nKHRoaXMuX2NhcmV0SW5kZXgpO1xuXG5cdFx0XHRcdFx0dGhpcy5fY2FyZXRJbmRleC0tO1xuXHRcdFx0XHRcdHRoaXMuZW5zdXJlQ2FyZXRJblZpZXcoKTtcblx0XHRcdFx0XHR0aGlzLnNob3dDYXJldCgpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlVGV4dCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKHRoaXMuY2hhbmdlKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNDY6XG5cdFx0XHRcdHRoaXMuX3RleHQgPVxuXHRcdFx0XHRcdHRoaXMuX3RleHQuc3Vic3RyaW5nKDAsIHRoaXMuX2NhcmV0SW5kZXgpICtcblx0XHRcdFx0XHR0aGlzLl90ZXh0LnN1YnN0cmluZyh0aGlzLl9jYXJldEluZGV4ICsgMSk7XG5cblx0XHRcdFx0dGhpcy5lbnN1cmVDYXJldEluVmlldygpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb24oKTtcblx0XHRcdFx0dGhpcy5zaG93Q2FyZXQoKTtcblx0XHRcdFx0dGhpcy51cGRhdGVUZXh0KCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKHRoaXMuY2hhbmdlKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdHRoaXMuX2NhcmV0SW5kZXgrKztcblx0XHRcdFx0aWYgKHRoaXMuX2NhcmV0SW5kZXggPiB0aGlzLl90ZXh0Lmxlbmd0aClcblx0XHRcdFx0XHR0aGlzLl9jYXJldEluZGV4ID0gdGhpcy5fdGV4dC5sZW5ndGg7XG5cblx0XHRcdFx0dGhpcy5lbnN1cmVDYXJldEluVmlldygpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb24oKTtcblx0XHRcdFx0dGhpcy5zaG93Q2FyZXQoKTtcblx0XHRcdFx0dGhpcy51cGRhdGVUZXh0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHR0aGlzLl9jYXJldEluZGV4LS07XG5cdFx0XHRcdGlmICh0aGlzLl9jYXJldEluZGV4IDwgMClcblx0XHRcdFx0XHR0aGlzLl9jYXJldEluZGV4ID0gMDtcblxuXHRcdFx0XHR0aGlzLmVuc3VyZUNhcmV0SW5WaWV3KCk7XG5cdFx0XHRcdHRoaXMudXBkYXRlQ2FyZXRQb3NpdGlvbigpO1xuXHRcdFx0XHR0aGlzLnNob3dDYXJldCgpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZVRleHQoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0dGhpcy50cmlnZ2VyKHRoaXMua2V5ZG93biwgZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBFbnN1cmUgdGhlIGNhcmV0IGlzIG5vdCBvdXRzaWRlIHRoZSBib3VuZHMuXG4gKiBAbWV0aG9kIGVuc3VyZUNhcmV0SW5WaWV3XG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5lbnN1cmVDYXJldEluVmlldyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb24oKTtcblxuXHR3aGlsZSAodGhpcy5jYXJldC5wb3NpdGlvbi54ID49IHRoaXMubG9jYWxXaWR0aCAtIDEpIHtcblx0XHR0aGlzLnNjcm9sbEluZGV4Kys7XG5cdFx0dGhpcy51cGRhdGVDYXJldFBvc2l0aW9uKCk7XG5cdH1cblxuXHR3aGlsZSAodGhpcy5jYXJldC5wb3NpdGlvbi54IDwgMCkge1xuXHRcdHRoaXMuc2Nyb2xsSW5kZXggLT0gMjtcblx0XHRpZiAodGhpcy5zY3JvbGxJbmRleCA8IDApXG5cdFx0XHR0aGlzLnNjcm9sbEluZGV4ID0gMDtcblx0XHR0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb24oKTtcblx0fVxufVxuXG4vKipcbiAqIEJsdXIgb3Vyc2VsZi5cbiAqIEBtZXRob2QgYmx1clxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5ibHVyID0gZnVuY3Rpb24oKSB7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RXZlbnRDbG9zdXJlKTtcblx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIHRoaXMua2V5RXZlbnRDbG9zdXJlKTtcblx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLmRvY3VtZW50TW91c2VEb3duQ2xvc3VyZSk7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLndpbmRvd0JsdXJDbG9zdXJlKTtcblxuXHR0aGlzLmhpZGVDYXJldCgpO1xufVxuXG4vKipcbiAqIFdpbmRvdyBibHVyLlxuICogQG1ldGhvZCBvbkRvY3VtZW50TW91c2VEb3duXG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5vbkRvY3VtZW50TW91c2VEb3duID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5pc0ZvY3VzQ2xpY2spXG5cdFx0dGhpcy5ibHVyKCk7XG59XG5cbi8qKlxuICogV2luZG93IGJsdXIuXG4gKiBAbWV0aG9kIG9uV2luZG93Qmx1clxuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUub25XaW5kb3dCbHVyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYmx1cigpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBjYXJldCBQb3NpdGlvbi5cbiAqIEBtZXRob2QgdXBkYXRlQ2FyZXRQb3NpdGlvblxuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUudXBkYXRlQ2FyZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5fY2FyZXRJbmRleCA8IHRoaXMuc2Nyb2xsSW5kZXgpIHtcblx0XHR0aGlzLmNhcmV0LnBvc2l0aW9uLnggPSAtMTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgc3ViID0gdGhpcy5fdGV4dC5zdWJzdHJpbmcoMCwgdGhpcy5fY2FyZXRJbmRleCkuc3Vic3RyaW5nKHRoaXMuc2Nyb2xsSW5kZXgpO1xuXHR0aGlzLmNhcmV0LnBvc2l0aW9uLnggPSB0aGlzLnRleHRGaWVsZC5jb250ZXh0Lm1lYXN1cmVUZXh0KHN1Yikud2lkdGg7XG59XG5cbi8qKlxuICogVXBkYXRlIHRleHQuXG4gKiBAbWV0aG9kIHVwZGF0ZVRleHRcbiAqIEBwcml2YXRlXG4gKi9cblBpeGlUZXh0SW5wdXQucHJvdG90eXBlLnVwZGF0ZVRleHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50ZXh0RmllbGQuc2V0VGV4dCh0aGlzLl90ZXh0LnN1YnN0cmluZyh0aGlzLnNjcm9sbEluZGV4KSk7XG59XG5cbi8qKlxuICogRHJhdyB0aGUgYmFja2dyb3VuZCBhbmQgY2FyZXQuXG4gKiBAbWV0aG9kIGRyYXdFbGVtZW50c1xuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUuZHJhd0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYmFja2dyb3VuZEdyYXBoaWNzLmNsZWFyKCk7XG5cdHRoaXMuYmFja2dyb3VuZEdyYXBoaWNzLmJlZ2luRmlsbCh0aGlzLl9iYWNrZ3JvdW5kQ29sb3IpO1xuXG5cdGlmICh0aGlzLl9iYWNrZ3JvdW5kKVxuXHRcdHRoaXMuYmFja2dyb3VuZEdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHRoaXMubG9jYWxXaWR0aCwgdGhpcy5sb2NhbEhlaWdodCk7XG5cblx0dGhpcy5iYWNrZ3JvdW5kR3JhcGhpY3MuZW5kRmlsbCgpO1xuXHR0aGlzLmJhY2tncm91bmRHcmFwaGljcy5oaXRBcmVhID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIHRoaXMubG9jYWxXaWR0aCwgdGhpcy5sb2NhbEhlaWdodCk7XG5cblx0dGhpcy50ZXh0RmllbGRNYXNrLmNsZWFyKCk7XG5cdHRoaXMudGV4dEZpZWxkTWFzay5iZWdpbkZpbGwodGhpcy5fYmFja2dyb3VuZENvbG9yKTtcblx0dGhpcy50ZXh0RmllbGRNYXNrLmRyYXdSZWN0KDAsIDAsIHRoaXMubG9jYWxXaWR0aCwgdGhpcy5sb2NhbEhlaWdodCk7XG5cdHRoaXMudGV4dEZpZWxkTWFzay5lbmRGaWxsKCk7XG5cblx0dGhpcy5jYXJldC5jbGVhcigpO1xuXHR0aGlzLmNhcmV0LmJlZ2luRmlsbCh0aGlzLl9jYXJldENvbG9yKTtcblx0dGhpcy5jYXJldC5kcmF3UmVjdCgxLCAxLCAxLCB0aGlzLmxvY2FsSGVpZ2h0IC0gMik7XG5cdHRoaXMuY2FyZXQuZW5kRmlsbCgpO1xufVxuXG4vKipcbiAqIFNob3cgY2FyZXQuXG4gKiBAbWV0aG9kIHNob3dDYXJldFxuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUuc2hvd0NhcmV0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmNhcmV0Rmxhc2hJbnRlcnZhbCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5jYXJldEZsYXNoSW50ZXJ2YWwpO1xuXHRcdHRoaXMuY2FyZXRGbGFzaEludGVydmFsID0gbnVsbDtcblx0fVxuXG5cdHRoaXMuY2FyZXQudmlzaWJsZSA9IHRydWU7XG5cdHRoaXMuY2FyZXRGbGFzaEludGVydmFsID0gc2V0SW50ZXJ2YWwodGhpcy5vbkNhcmV0Rmxhc2hJbnRlcnZhbC5iaW5kKHRoaXMpLCA1MDApO1xufVxuXG4vKipcbiAqIEhpZGUgY2FyZXQuXG4gKiBAbWV0aG9kIGhpZGVDYXJldFxuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUuaGlkZUNhcmV0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmNhcmV0Rmxhc2hJbnRlcnZhbCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5jYXJldEZsYXNoSW50ZXJ2YWwpO1xuXHRcdHRoaXMuY2FyZXRGbGFzaEludGVydmFsID0gbnVsbDtcblx0fVxuXG5cdHRoaXMuY2FyZXQudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIENhcmV0IGZsYXNoIGludGVydmFsLlxuICogQG1ldGhvZCBvbkNhcmV0Rmxhc2hJbnRlcnZhbFxuICogQHByaXZhdGVcbiAqL1xuUGl4aVRleHRJbnB1dC5wcm90b3R5cGUub25DYXJldEZsYXNoSW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYXJldC52aXNpYmxlID0gIXRoaXMuY2FyZXQudmlzaWJsZTtcbn1cblxuLyoqXG4gKiBNYXAgcG9zaXRpb24gdG8gY2FyZXQgaW5kZXguXG4gKiBAbWV0aG9kIGdldENhcmV0SW5kZXhCeUNvb3JkXG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5nZXRDYXJldEluZGV4QnlDb29yZCA9IGZ1bmN0aW9uKHgpIHtcblx0dmFyIHNtYWxsZXN0ID0gMTAwMDA7XG5cdHZhciBjYW5kID0gMDtcblx0dmFyIHZpc2libGUgPSB0aGlzLl90ZXh0LnN1YnN0cmluZyh0aGlzLnNjcm9sbEluZGV4KTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgdmlzaWJsZS5sZW5ndGggKyAxOyBpKyspIHtcblx0XHR2YXIgc3ViID0gdmlzaWJsZS5zdWJzdHJpbmcoMCwgaSk7XG5cdFx0dmFyIHcgPSB0aGlzLnRleHRGaWVsZC5jb250ZXh0Lm1lYXN1cmVUZXh0KHN1Yikud2lkdGg7XG5cblx0XHRpZiAoTWF0aC5hYnModyAtIHgpIDwgc21hbGxlc3QpIHtcblx0XHRcdHNtYWxsZXN0ID0gTWF0aC5hYnModyAtIHgpO1xuXHRcdFx0Y2FuZCA9IGk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRoaXMuc2Nyb2xsSW5kZXggKyBjYW5kO1xufVxuXG4vKipcbiAqIFRoZSB3aWR0aCBvZiB0aGUgUGl4aVRleHRJbnB1dC4gVGhpcyBpcyBvdmVycmlkZGVuIHRvIGhhdmUgYSBzbGlnaHRseVxuICogZGlmZmVyZW50IGJlaGFpdm91ciB0aGFuIHRoZSBvdGhlciBEaXNwbGF5T2JqZWN0cy4gU2V0dGluZyB0aGVcbiAqIHdpZHRoIG9mIHRoZSBQaXhpVGV4dElucHV0IGRvZXMgbm90IGNoYW5nZSB0aGUgc2NhbGUsIGJ1dCBpdCByYXRoZXJcbiAqIG1ha2VzIHRoZSBmaWVsZCBsYXJnZXIuIElmIHlvdSBhY3R1YWxseSB3YW50IHRvIHNjYWxlIGl0LFxuICogdXNlIHRoZSBzY2FsZSBwcm9wZXJ0eS5cbiAqIEBwcm9wZXJ0eSB3aWR0aFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUGl4aVRleHRJbnB1dC5wcm90b3R5cGUsIFwid2lkdGhcIiwge1xuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnNjYWxlLnggKiB0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0dGhpcy5sb2NhbFdpZHRoID0gdjtcblx0XHR0aGlzLmRyYXdFbGVtZW50cygpO1xuXHRcdHRoaXMuZW5zdXJlQ2FyZXRJblZpZXcoKTtcblx0XHR0aGlzLnVwZGF0ZVRleHQoKTtcblx0fVxufSk7XG5cbi8qKlxuICogVGhlIHRleHQgaW4gdGhlIGlucHV0IGZpZWxkLiBTZXR0aW5nIHdpbGwgaGF2ZSB0aGUgaW1wbGljaXQgZnVuY3Rpb24gb2YgcmVzZXR0aW5nIHRoZSBzY3JvbGxcbiAqIG9mIHRoZSBpbnB1dCBmaWVsZCBhbmQgcmVtb3ZpbmcgZm9jdXMuXG4gKiBAcHJvcGVydHkgdGV4dFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUGl4aVRleHRJbnB1dC5wcm90b3R5cGUsIFwidGV4dFwiLCB7XG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3RleHQ7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0dGhpcy5fdGV4dCA9IHYudG9TdHJpbmcoKTtcblx0XHR0aGlzLnNjcm9sbEluZGV4ID0gMDtcblx0XHR0aGlzLmNhcmV0SW5kZXggPSAwO1xuXHRcdHRoaXMuYmx1cigpO1xuXHRcdHRoaXMudXBkYXRlVGV4dCgpO1xuXHR9XG59KTtcblxuLyoqXG4gKiBUaGUgY29sb3Igb2YgdGhlIGJhY2tncm91bmQgZm9yIHRoZSBpbnB1dCBmaWVsZC5cbiAqIEBwcm9wZXJ0eSBiYWNrZ3JvdW5kQ29sb3JcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFBpeGlUZXh0SW5wdXQucHJvdG90eXBlLCBcImJhY2tncm91bmRDb2xvclwiLCB7XG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjtcblx0fSxcblxuXHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHR0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2O1xuXHRcdHRoaXMuZHJhd0VsZW1lbnRzKCk7XG5cdH1cbn0pO1xuXG4vKipcbiAqIFRoZSBjb2xvciBvZiB0aGUgY2FyZXQuXG4gKiBAcHJvcGVydHkgY2FyZXRDb2xvclxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUGl4aVRleHRJbnB1dC5wcm90b3R5cGUsIFwiY2FyZXRDb2xvclwiLCB7XG5cdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NhcmV0Q29sb3I7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0dGhpcy5fY2FyZXRDb2xvciA9IHY7XG5cdFx0dGhpcy5kcmF3RWxlbWVudHMoKTtcblx0fVxufSk7XG5cbi8qKlxuICogU2hvdWxkIGEgYmFja2dyb3VuZCBiZSBzaG93bj9cbiAqIEBwcm9wZXJ0eSBiYWNrZ3JvdW5kXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShQaXhpVGV4dElucHV0LnByb3RvdHlwZSwgXCJiYWNrZ3JvdW5kXCIsIHtcblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcblx0fSxcblxuXHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHR0aGlzLl9iYWNrZ3JvdW5kID0gdjtcblx0XHR0aGlzLmRyYXdFbGVtZW50cygpO1xuXHR9XG59KTtcblxuLyoqXG4gKiBTZXQgdGV4dC5cbiAqIEBtZXRob2Qgc2V0VGV4dFxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS5zZXRUZXh0ID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnRleHQgPSB2O1xufVxuXG4vKipcbiAqIFRyaWdnZXIgYW4gZXZlbnQgZnVuY3Rpb24gaWYgaXQgZXhpc3RzLlxuICogQG1ldGhvZCB0cmlnZ2VyXG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpVGV4dElucHV0LnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oZm4sIGUpIHtcblx0aWYgKGZuKVxuXHRcdGZuKGUpO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBQaXhpVGV4dElucHV0O1xufSIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIHBpeGkuanMgLSB2MS42LjBcbiAqIENvcHlyaWdodCAoYykgMjAxMi0yMDE0LCBNYXQgR3JvdmVzXG4gKiBodHRwOi8vZ29vZGJveWRpZ2l0YWwuY29tL1xuICpcbiAqIENvbXBpbGVkOiAyMDE0LTA3LTE4XG4gKlxuICogcGl4aS5qcyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4oZnVuY3Rpb24oKXt2YXIgYT10aGlzLGI9Ynx8e307Yi5XRUJHTF9SRU5ERVJFUj0wLGIuQ0FOVkFTX1JFTkRFUkVSPTEsYi5WRVJTSU9OPVwidjEuNi4xXCIsYi5ibGVuZE1vZGVzPXtOT1JNQUw6MCxBREQ6MSxNVUxUSVBMWToyLFNDUkVFTjozLE9WRVJMQVk6NCxEQVJLRU46NSxMSUdIVEVOOjYsQ09MT1JfRE9ER0U6NyxDT0xPUl9CVVJOOjgsSEFSRF9MSUdIVDo5LFNPRlRfTElHSFQ6MTAsRElGRkVSRU5DRToxMSxFWENMVVNJT046MTIsSFVFOjEzLFNBVFVSQVRJT046MTQsQ09MT1I6MTUsTFVNSU5PU0lUWToxNn0sYi5zY2FsZU1vZGVzPXtERUZBVUxUOjAsTElORUFSOjAsTkVBUkVTVDoxfSxiLl9VSUQ9MCxcInVuZGVmaW5lZFwiIT10eXBlb2YgRmxvYXQzMkFycmF5PyhiLkZsb2F0MzJBcnJheT1GbG9hdDMyQXJyYXksYi5VaW50MTZBcnJheT1VaW50MTZBcnJheSk6KGIuRmxvYXQzMkFycmF5PUFycmF5LGIuVWludDE2QXJyYXk9QXJyYXkpLGIuSU5URVJBQ1RJT05fRlJFUVVFTkNZPTMwLGIuQVVUT19QUkVWRU5UX0RFRkFVTFQ9ITAsYi5SQURfVE9fREVHPTE4MC9NYXRoLlBJLGIuREVHX1RPX1JBRD1NYXRoLlBJLzE4MCxiLmRvbnRTYXlIZWxsbz0hMSxiLnNheUhlbGxvPWZ1bmN0aW9uKGEpe2lmKCFiLmRvbnRTYXlIZWxsbyl7aWYobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJjaHJvbWVcIik+LTEpe3ZhciBjPVtcIiVjICVjICVjIFBpeGkuanMgXCIrYi5WRVJTSU9OK1wiIC0gXCIrYStcIiAgJWMgICVjICBodHRwOi8vd3d3LnBpeGlqcy5jb20vICAlYyAlYyDimaUlY+KZpSVj4pmlIFwiLFwiYmFja2dyb3VuZDogI2ZmNjZhNVwiLFwiYmFja2dyb3VuZDogI2ZmNjZhNVwiLFwiY29sb3I6ICNmZjY2YTU7IGJhY2tncm91bmQ6ICMwMzAzMDc7XCIsXCJiYWNrZ3JvdW5kOiAjZmY2NmE1XCIsXCJiYWNrZ3JvdW5kOiAjZmZjM2RjXCIsXCJiYWNrZ3JvdW5kOiAjZmY2NmE1XCIsXCJjb2xvcjogI2ZmMjQyNDsgYmFja2dyb3VuZDogI2ZmZlwiLFwiY29sb3I6ICNmZjI0MjQ7IGJhY2tncm91bmQ6ICNmZmZcIixcImNvbG9yOiAjZmYyNDI0OyBiYWNrZ3JvdW5kOiAjZmZmXCJdO2NvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsYyl9ZWxzZSB3aW5kb3cuY29uc29sZSYmY29uc29sZS5sb2coXCJQaXhpLmpzIFwiK2IuVkVSU0lPTitcIiAtIGh0dHA6Ly93d3cucGl4aWpzLmNvbS9cIik7Yi5kb250U2F5SGVsbG89ITB9fSxiLlBvaW50PWZ1bmN0aW9uKGEsYil7dGhpcy54PWF8fDAsdGhpcy55PWJ8fDB9LGIuUG9pbnQucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLlBvaW50KHRoaXMueCx0aGlzLnkpfSxiLlBvaW50LnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt0aGlzLng9YXx8MCx0aGlzLnk9Ynx8KDAhPT1iP3RoaXMueDowKX0sYi5Qb2ludC5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5Qb2ludCxiLlJlY3RhbmdsZT1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLng9YXx8MCx0aGlzLnk9Ynx8MCx0aGlzLndpZHRoPWN8fDAsdGhpcy5oZWlnaHQ9ZHx8MH0sYi5SZWN0YW5nbGUucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLlJlY3RhbmdsZSh0aGlzLngsdGhpcy55LHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpfSxiLlJlY3RhbmdsZS5wcm90b3R5cGUuY29udGFpbnM9ZnVuY3Rpb24oYSxiKXtpZih0aGlzLndpZHRoPD0wfHx0aGlzLmhlaWdodDw9MClyZXR1cm4hMTt2YXIgYz10aGlzLng7aWYoYT49YyYmYTw9Yyt0aGlzLndpZHRoKXt2YXIgZD10aGlzLnk7aWYoYj49ZCYmYjw9ZCt0aGlzLmhlaWdodClyZXR1cm4hMH1yZXR1cm4hMX0sYi5SZWN0YW5nbGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuUmVjdGFuZ2xlLGIuRW1wdHlSZWN0YW5nbGU9bmV3IGIuUmVjdGFuZ2xlKDAsMCwwLDApLGIuUG9seWdvbj1mdW5jdGlvbihhKXtpZihhIGluc3RhbmNlb2YgQXJyYXl8fChhPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpLFwibnVtYmVyXCI9PXR5cGVvZiBhWzBdKXtmb3IodmFyIGM9W10sZD0wLGU9YS5sZW5ndGg7ZT5kO2QrPTIpYy5wdXNoKG5ldyBiLlBvaW50KGFbZF0sYVtkKzFdKSk7YT1jfXRoaXMucG9pbnRzPWF9LGIuUG9seWdvbi5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYz0wO2M8dGhpcy5wb2ludHMubGVuZ3RoO2MrKylhLnB1c2godGhpcy5wb2ludHNbY10uY2xvbmUoKSk7cmV0dXJuIG5ldyBiLlBvbHlnb24oYSl9LGIuUG9seWdvbi5wcm90b3R5cGUuY29udGFpbnM9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9ITEsZD0wLGU9dGhpcy5wb2ludHMubGVuZ3RoLTE7ZDx0aGlzLnBvaW50cy5sZW5ndGg7ZT1kKyspe3ZhciBmPXRoaXMucG9pbnRzW2RdLngsZz10aGlzLnBvaW50c1tkXS55LGg9dGhpcy5wb2ludHNbZV0ueCxpPXRoaXMucG9pbnRzW2VdLnksaj1nPmIhPWk+YiYmKGgtZikqKGItZykvKGktZykrZj5hO2omJihjPSFjKX1yZXR1cm4gY30sYi5Qb2x5Z29uLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlBvbHlnb24sYi5DaXJjbGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMueD1hfHwwLHRoaXMueT1ifHwwLHRoaXMucmFkaXVzPWN8fDB9LGIuQ2lyY2xlLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3JldHVybiBuZXcgYi5DaXJjbGUodGhpcy54LHRoaXMueSx0aGlzLnJhZGl1cyl9LGIuQ2lyY2xlLnByb3RvdHlwZS5jb250YWlucz1mdW5jdGlvbihhLGIpe2lmKHRoaXMucmFkaXVzPD0wKXJldHVybiExO3ZhciBjPXRoaXMueC1hLGQ9dGhpcy55LWIsZT10aGlzLnJhZGl1cyp0aGlzLnJhZGl1cztyZXR1cm4gYyo9YyxkKj1kLGU+PWMrZH0sYi5DaXJjbGUucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbigpe3JldHVybiBuZXcgYi5SZWN0YW5nbGUodGhpcy54LXRoaXMucmFkaXVzLHRoaXMueS10aGlzLnJhZGl1cyx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KX0sYi5DaXJjbGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQ2lyY2xlLGIuRWxsaXBzZT1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLng9YXx8MCx0aGlzLnk9Ynx8MCx0aGlzLndpZHRoPWN8fDAsdGhpcy5oZWlnaHQ9ZHx8MH0sYi5FbGxpcHNlLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3JldHVybiBuZXcgYi5FbGxpcHNlKHRoaXMueCx0aGlzLnksdGhpcy53aWR0aCx0aGlzLmhlaWdodCl9LGIuRWxsaXBzZS5wcm90b3R5cGUuY29udGFpbnM9ZnVuY3Rpb24oYSxiKXtpZih0aGlzLndpZHRoPD0wfHx0aGlzLmhlaWdodDw9MClyZXR1cm4hMTt2YXIgYz0oYS10aGlzLngpL3RoaXMud2lkdGgsZD0oYi10aGlzLnkpL3RoaXMuaGVpZ2h0O3JldHVybiBjKj1jLGQqPWQsMT49YytkfSxiLkVsbGlwc2UucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbigpe3JldHVybiBuZXcgYi5SZWN0YW5nbGUodGhpcy54LXRoaXMud2lkdGgsdGhpcy55LXRoaXMuaGVpZ2h0LHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpfSxiLkVsbGlwc2UucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuRWxsaXBzZSxiLk1hdHJpeD1mdW5jdGlvbigpe3RoaXMuYT0xLHRoaXMuYj0wLHRoaXMuYz0wLHRoaXMuZD0xLHRoaXMudHg9MCx0aGlzLnR5PTB9LGIuTWF0cml4LnByb3RvdHlwZS5mcm9tQXJyYXk9ZnVuY3Rpb24oYSl7dGhpcy5hPWFbMF0sdGhpcy5iPWFbMV0sdGhpcy5jPWFbM10sdGhpcy5kPWFbNF0sdGhpcy50eD1hWzJdLHRoaXMudHk9YVs1XX0sYi5NYXRyaXgucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24oYSl7dGhpcy5hcnJheXx8KHRoaXMuYXJyYXk9bmV3IEZsb2F0MzJBcnJheSg5KSk7dmFyIGI9dGhpcy5hcnJheTtyZXR1cm4gYT8oYlswXT10aGlzLmEsYlsxXT10aGlzLmMsYlsyXT0wLGJbM109dGhpcy5iLGJbNF09dGhpcy5kLGJbNV09MCxiWzZdPXRoaXMudHgsYls3XT10aGlzLnR5LGJbOF09MSk6KGJbMF09dGhpcy5hLGJbMV09dGhpcy5iLGJbMl09dGhpcy50eCxiWzNdPXRoaXMuYyxiWzRdPXRoaXMuZCxiWzVdPXRoaXMudHksYls2XT0wLGJbN109MCxiWzhdPTEpLGJ9LGIuaWRlbnRpdHlNYXRyaXg9bmV3IGIuTWF0cml4LGIuZGV0ZXJtaW5lTWF0cml4QXJyYXlUeXBlPWZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZsb2F0MzJBcnJheT9GbG9hdDMyQXJyYXk6QXJyYXl9LGIuTWF0cml4Mj1iLmRldGVybWluZU1hdHJpeEFycmF5VHlwZSgpLGIuRGlzcGxheU9iamVjdD1mdW5jdGlvbigpe3RoaXMucG9zaXRpb249bmV3IGIuUG9pbnQsdGhpcy5zY2FsZT1uZXcgYi5Qb2ludCgxLDEpLHRoaXMucGl2b3Q9bmV3IGIuUG9pbnQoMCwwKSx0aGlzLnJvdGF0aW9uPTAsdGhpcy5hbHBoYT0xLHRoaXMudmlzaWJsZT0hMCx0aGlzLmhpdEFyZWE9bnVsbCx0aGlzLmJ1dHRvbk1vZGU9ITEsdGhpcy5yZW5kZXJhYmxlPSExLHRoaXMucGFyZW50PW51bGwsdGhpcy5zdGFnZT1udWxsLHRoaXMud29ybGRBbHBoYT0xLHRoaXMuX2ludGVyYWN0aXZlPSExLHRoaXMuZGVmYXVsdEN1cnNvcj1cInBvaW50ZXJcIix0aGlzLndvcmxkVHJhbnNmb3JtPW5ldyBiLk1hdHJpeCx0aGlzLmNvbG9yPVtdLHRoaXMuZHluYW1pYz0hMCx0aGlzLl9zcj0wLHRoaXMuX2NyPTEsdGhpcy5maWx0ZXJBcmVhPW51bGwsdGhpcy5fYm91bmRzPW5ldyBiLlJlY3RhbmdsZSgwLDAsMSwxKSx0aGlzLl9jdXJyZW50Qm91bmRzPW51bGwsdGhpcy5fbWFzaz1udWxsLHRoaXMuX2NhY2hlQXNCaXRtYXA9ITEsdGhpcy5fY2FjaGVJc0RpcnR5PSExfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuRGlzcGxheU9iamVjdCxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNldEludGVyYWN0aXZlPWZ1bmN0aW9uKGEpe3RoaXMuaW50ZXJhY3RpdmU9YX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsXCJpbnRlcmFjdGl2ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW50ZXJhY3RpdmV9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9pbnRlcmFjdGl2ZT1hLHRoaXMuc3RhZ2UmJih0aGlzLnN0YWdlLmRpcnR5PSEwKX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcIndvcmxkVmlzaWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Rve2lmKCFhLnZpc2libGUpcmV0dXJuITE7YT1hLnBhcmVudH13aGlsZShhKTtyZXR1cm4hMH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcIm1hc2tcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21hc2t9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9tYXNrJiYodGhpcy5fbWFzay5pc01hc2s9ITEpLHRoaXMuX21hc2s9YSx0aGlzLl9tYXNrJiYodGhpcy5fbWFzay5pc01hc2s9ITApfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGEpe2lmKGEpe2Zvcih2YXIgYj1bXSxjPTA7YzxhLmxlbmd0aDtjKyspZm9yKHZhciBkPWFbY10ucGFzc2VzLGU9MDtlPGQubGVuZ3RoO2UrKyliLnB1c2goZFtlXSk7dGhpcy5fZmlsdGVyQmxvY2s9e3RhcmdldDp0aGlzLGZpbHRlclBhc3NlczpifX10aGlzLl9maWx0ZXJzPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsXCJjYWNoZUFzQml0bWFwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jYWNoZUFzQml0bWFwfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5fY2FjaGVBc0JpdG1hcCE9PWEmJihhP3RoaXMuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlKCk6dGhpcy5fZGVzdHJveUNhY2hlZFNwcml0ZSgpLHRoaXMuX2NhY2hlQXNCaXRtYXA9YSl9fSksYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnJvdGF0aW9uIT09dGhpcy5yb3RhdGlvbkNhY2hlJiYodGhpcy5yb3RhdGlvbkNhY2hlPXRoaXMucm90YXRpb24sdGhpcy5fc3I9TWF0aC5zaW4odGhpcy5yb3RhdGlvbiksdGhpcy5fY3I9TWF0aC5jb3ModGhpcy5yb3RhdGlvbikpO3ZhciBhPXRoaXMucGFyZW50LndvcmxkVHJhbnNmb3JtLGI9dGhpcy53b3JsZFRyYW5zZm9ybSxjPXRoaXMucGl2b3QueCxkPXRoaXMucGl2b3QueSxlPXRoaXMuX2NyKnRoaXMuc2NhbGUueCxmPS10aGlzLl9zcip0aGlzLnNjYWxlLnksZz10aGlzLl9zcip0aGlzLnNjYWxlLngsaD10aGlzLl9jcip0aGlzLnNjYWxlLnksaT10aGlzLnBvc2l0aW9uLngtZSpjLWQqZixqPXRoaXMucG9zaXRpb24ueS1oKmQtYypnLGs9YS5hLGw9YS5iLG09YS5jLG49YS5kO2IuYT1rKmUrbCpnLGIuYj1rKmYrbCpoLGIudHg9ayppK2wqaithLnR4LGIuYz1tKmUrbipnLGIuZD1tKmYrbipoLGIudHk9bSppK24qaithLnR5LHRoaXMud29ybGRBbHBoYT10aGlzLmFscGhhKnRoaXMucGFyZW50LndvcmxkQWxwaGF9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZ2V0Qm91bmRzPWZ1bmN0aW9uKGEpe3JldHVybiBhPWEsYi5FbXB0eVJlY3RhbmdsZX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5nZXRMb2NhbEJvdW5kcz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEJvdW5kcyhiLmlkZW50aXR5TWF0cml4KX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zZXRTdGFnZVJlZmVyZW5jZT1mdW5jdGlvbihhKXt0aGlzLnN0YWdlPWEsdGhpcy5faW50ZXJhY3RpdmUmJih0aGlzLnN0YWdlLmRpcnR5PSEwKX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5nZW5lcmF0ZVRleHR1cmU9ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcy5nZXRMb2NhbEJvdW5kcygpLGQ9bmV3IGIuUmVuZGVyVGV4dHVyZSgwfGMud2lkdGgsMHxjLmhlaWdodCxhKTtyZXR1cm4gZC5yZW5kZXIodGhpcyxuZXcgYi5Qb2ludCgtYy54LC1jLnkpKSxkfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZUNhY2hlPWZ1bmN0aW9uKCl7dGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fcmVuZGVyQ2FjaGVkU3ByaXRlPWZ1bmN0aW9uKGEpe3RoaXMuX2NhY2hlZFNwcml0ZS53b3JsZEFscGhhPXRoaXMud29ybGRBbHBoYSxhLmdsP2IuU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyV2ViR0wuY2FsbCh0aGlzLl9jYWNoZWRTcHJpdGUsYSk6Yi5TcHJpdGUucHJvdG90eXBlLl9yZW5kZXJDYW52YXMuY2FsbCh0aGlzLl9jYWNoZWRTcHJpdGUsYSl9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlPWZ1bmN0aW9uKCl7dGhpcy5fY2FjaGVBc0JpdG1hcD0hMTt2YXIgYT10aGlzLmdldExvY2FsQm91bmRzKCk7aWYodGhpcy5fY2FjaGVkU3ByaXRlKXRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLnJlc2l6ZSgwfGEud2lkdGgsMHxhLmhlaWdodCk7ZWxzZXt2YXIgYz1uZXcgYi5SZW5kZXJUZXh0dXJlKDB8YS53aWR0aCwwfGEuaGVpZ2h0KTt0aGlzLl9jYWNoZWRTcHJpdGU9bmV3IGIuU3ByaXRlKGMpLHRoaXMuX2NhY2hlZFNwcml0ZS53b3JsZFRyYW5zZm9ybT10aGlzLndvcmxkVHJhbnNmb3JtfXZhciBkPXRoaXMuX2ZpbHRlcnM7dGhpcy5fZmlsdGVycz1udWxsLHRoaXMuX2NhY2hlZFNwcml0ZS5maWx0ZXJzPWQsdGhpcy5fY2FjaGVkU3ByaXRlLnRleHR1cmUucmVuZGVyKHRoaXMsbmV3IGIuUG9pbnQoLWEueCwtYS55KSksdGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci54PS0oYS54L2Eud2lkdGgpLHRoaXMuX2NhY2hlZFNwcml0ZS5hbmNob3IueT0tKGEueS9hLmhlaWdodCksdGhpcy5fZmlsdGVycz1kLHRoaXMuX2NhY2hlQXNCaXRtYXA9ITB9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2Rlc3Ryb3lDYWNoZWRTcHJpdGU9ZnVuY3Rpb24oKXt0aGlzLl9jYWNoZWRTcHJpdGUmJih0aGlzLl9jYWNoZWRTcHJpdGUudGV4dHVyZS5kZXN0cm95KCEwKSx0aGlzLl9jYWNoZWRTcHJpdGU9bnVsbCl9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX3JlbmRlcldlYkdMPWZ1bmN0aW9uKGEpe2E9YX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fcmVuZGVyQ2FudmFzPWZ1bmN0aW9uKGEpe2E9YX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsXCJ4XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBvc2l0aW9uLnh9LHNldDpmdW5jdGlvbihhKXt0aGlzLnBvc2l0aW9uLng9YX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcInlcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9zaXRpb24ueX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMucG9zaXRpb24ueT1hfX0pLGIuRGlzcGxheU9iamVjdENvbnRhaW5lcj1mdW5jdGlvbigpe2IuRGlzcGxheU9iamVjdC5jYWxsKHRoaXMpLHRoaXMuY2hpbGRyZW49W119LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlKSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuRGlzcGxheU9iamVjdENvbnRhaW5lcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSxcIndpZHRoXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNjYWxlLngqdGhpcy5nZXRMb2NhbEJvdW5kcygpLndpZHRofSxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5nZXRMb2NhbEJvdW5kcygpLndpZHRoO3RoaXMuc2NhbGUueD0wIT09Yj9hLyhiL3RoaXMuc2NhbGUueCk6MSx0aGlzLl93aWR0aD1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLFwiaGVpZ2h0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNjYWxlLnkqdGhpcy5nZXRMb2NhbEJvdW5kcygpLmhlaWdodH0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuZ2V0TG9jYWxCb3VuZHMoKS5oZWlnaHQ7dGhpcy5zY2FsZS55PTAhPT1iP2EvKGIvdGhpcy5zY2FsZS55KToxLHRoaXMuX2hlaWdodD1hfX0pLGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUuYWRkQ2hpbGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYWRkQ2hpbGRBdChhLHRoaXMuY2hpbGRyZW4ubGVuZ3RoKX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5hZGRDaGlsZEF0PWZ1bmN0aW9uKGEsYil7aWYoYj49MCYmYjw9dGhpcy5jaGlsZHJlbi5sZW5ndGgpcmV0dXJuIGEucGFyZW50JiZhLnBhcmVudC5yZW1vdmVDaGlsZChhKSxhLnBhcmVudD10aGlzLHRoaXMuY2hpbGRyZW4uc3BsaWNlKGIsMCxhKSx0aGlzLnN0YWdlJiZhLnNldFN0YWdlUmVmZXJlbmNlKHRoaXMuc3RhZ2UpLGE7dGhyb3cgbmV3IEVycm9yKGErXCIgVGhlIGluZGV4IFwiK2IrXCIgc3VwcGxpZWQgaXMgb3V0IG9mIGJvdW5kcyBcIit0aGlzLmNoaWxkcmVuLmxlbmd0aCl9LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUuc3dhcENoaWxkcmVuPWZ1bmN0aW9uKGEsYil7aWYoYSE9PWIpe3ZhciBjPXRoaXMuY2hpbGRyZW4uaW5kZXhPZihhKSxkPXRoaXMuY2hpbGRyZW4uaW5kZXhPZihiKTtpZigwPmN8fDA+ZCl0aHJvdyBuZXcgRXJyb3IoXCJzd2FwQ2hpbGRyZW46IEJvdGggdGhlIHN1cHBsaWVkIERpc3BsYXlPYmplY3RzIG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyLlwiKTt0aGlzLmNoaWxkcmVuW2NdPWIsdGhpcy5jaGlsZHJlbltkXT1hfX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5nZXRDaGlsZEF0PWZ1bmN0aW9uKGEpe2lmKGE+PTAmJmE8dGhpcy5jaGlsZHJlbi5sZW5ndGgpcmV0dXJuIHRoaXMuY2hpbGRyZW5bYV07dGhyb3cgbmV3IEVycm9yKFwiU3VwcGxpZWQgaW5kZXggZG9lcyBub3QgZXhpc3QgaW4gdGhlIGNoaWxkIGxpc3QsIG9yIHRoZSBzdXBwbGllZCBEaXNwbGF5T2JqZWN0IG11c3QgYmUgYSBjaGlsZCBvZiB0aGUgY2FsbGVyXCIpfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnJlbW92ZUNoaWxkPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQodGhpcy5jaGlsZHJlbi5pbmRleE9mKGEpKX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZEF0PWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuZ2V0Q2hpbGRBdChhKTtyZXR1cm4gdGhpcy5zdGFnZSYmYi5yZW1vdmVTdGFnZVJlZmVyZW5jZSgpLGIucGFyZW50PXZvaWQgMCx0aGlzLmNoaWxkcmVuLnNwbGljZShhLDEpLGJ9LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW49ZnVuY3Rpb24oYSxiKXt2YXIgYz1hfHwwLGQ9XCJudW1iZXJcIj09dHlwZW9mIGI/Yjp0aGlzLmNoaWxkcmVuLmxlbmd0aCxlPWQtYztpZihlPjAmJmQ+PWUpe2Zvcih2YXIgZj10aGlzLmNoaWxkcmVuLnNwbGljZShjLGUpLGc9MDtnPGYubGVuZ3RoO2crKyl7dmFyIGg9ZltnXTt0aGlzLnN0YWdlJiZoLnJlbW92ZVN0YWdlUmVmZXJlbmNlKCksaC5wYXJlbnQ9dm9pZCAwfXJldHVybiBmfXRocm93IG5ldyBFcnJvcihcIlJhbmdlIEVycm9yLCBudW1lcmljIHZhbHVlcyBhcmUgb3V0c2lkZSB0aGUgYWNjZXB0YWJsZSByYW5nZVwiKX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXtpZih0aGlzLnZpc2libGUmJihiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpLCF0aGlzLl9jYWNoZUFzQml0bWFwKSlmb3IodmFyIGE9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YTthKyspdGhpcy5jaGlsZHJlblthXS51cGRhdGVUcmFuc2Zvcm0oKX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5nZXRCb3VuZHM9ZnVuY3Rpb24oYSl7aWYoMD09PXRoaXMuY2hpbGRyZW4ubGVuZ3RoKXJldHVybiBiLkVtcHR5UmVjdGFuZ2xlO2lmKGEpe3ZhciBjPXRoaXMud29ybGRUcmFuc2Zvcm07dGhpcy53b3JsZFRyYW5zZm9ybT1hLHRoaXMudXBkYXRlVHJhbnNmb3JtKCksdGhpcy53b3JsZFRyYW5zZm9ybT1jfWZvcih2YXIgZCxlLGYsZz0xLzAsaD0xLzAsaT0tMS8wLGo9LTEvMCxrPSExLGw9MCxtPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO20+bDtsKyspe3ZhciBuPXRoaXMuY2hpbGRyZW5bbF07bi52aXNpYmxlJiYoaz0hMCxkPXRoaXMuY2hpbGRyZW5bbF0uZ2V0Qm91bmRzKGEpLGc9ZzxkLng/ZzpkLngsaD1oPGQueT9oOmQueSxlPWQud2lkdGgrZC54LGY9ZC5oZWlnaHQrZC55LGk9aT5lP2k6ZSxqPWo+Zj9qOmYpfWlmKCFrKXJldHVybiBiLkVtcHR5UmVjdGFuZ2xlO3ZhciBvPXRoaXMuX2JvdW5kcztyZXR1cm4gby54PWcsby55PWgsby53aWR0aD1pLWcsby5oZWlnaHQ9ai1oLG99LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUuZ2V0TG9jYWxCb3VuZHM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLndvcmxkVHJhbnNmb3JtO3RoaXMud29ybGRUcmFuc2Zvcm09Yi5pZGVudGl0eU1hdHJpeDtmb3IodmFyIGM9MCxkPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2Q+YztjKyspdGhpcy5jaGlsZHJlbltjXS51cGRhdGVUcmFuc2Zvcm0oKTt2YXIgZT10aGlzLmdldEJvdW5kcygpO3JldHVybiB0aGlzLndvcmxkVHJhbnNmb3JtPWEsZX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5zZXRTdGFnZVJlZmVyZW5jZT1mdW5jdGlvbihhKXt0aGlzLnN0YWdlPWEsdGhpcy5faW50ZXJhY3RpdmUmJih0aGlzLnN0YWdlLmRpcnR5PSEwKTtmb3IodmFyIGI9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YjtiKyspe3ZhciBkPXRoaXMuY2hpbGRyZW5bYl07ZC5zZXRTdGFnZVJlZmVyZW5jZShhKX19LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlU3RhZ2VSZWZlcmVuY2U9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MCxiPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2I+YTthKyspe3ZhciBjPXRoaXMuY2hpbGRyZW5bYV07Yy5yZW1vdmVTdGFnZVJlZmVyZW5jZSgpfXRoaXMuX2ludGVyYWN0aXZlJiYodGhpcy5zdGFnZS5kaXJ0eT0hMCksdGhpcy5zdGFnZT1udWxsfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLl9yZW5kZXJXZWJHTD1mdW5jdGlvbihhKXtpZih0aGlzLnZpc2libGUmJiEodGhpcy5hbHBoYTw9MCkpe2lmKHRoaXMuX2NhY2hlQXNCaXRtYXApcmV0dXJuIHRoaXMuX3JlbmRlckNhY2hlZFNwcml0ZShhKSx2b2lkIDA7dmFyIGIsYztpZih0aGlzLl9tYXNrfHx0aGlzLl9maWx0ZXJzKXtmb3IodGhpcy5fZmlsdGVycyYmKGEuc3ByaXRlQmF0Y2guZmx1c2goKSxhLmZpbHRlck1hbmFnZXIucHVzaEZpbHRlcih0aGlzLl9maWx0ZXJCbG9jaykpLHRoaXMuX21hc2smJihhLnNwcml0ZUJhdGNoLnN0b3AoKSxhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMubWFzayxhKSxhLnNwcml0ZUJhdGNoLnN0YXJ0KCkpLGI9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YjtiKyspdGhpcy5jaGlsZHJlbltiXS5fcmVuZGVyV2ViR0woYSk7YS5zcHJpdGVCYXRjaC5zdG9wKCksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKHRoaXMuX21hc2ssYSksdGhpcy5fZmlsdGVycyYmYS5maWx0ZXJNYW5hZ2VyLnBvcEZpbHRlcigpLGEuc3ByaXRlQmF0Y2guc3RhcnQoKX1lbHNlIGZvcihiPTAsYz10aGlzLmNoaWxkcmVuLmxlbmd0aDtjPmI7YisrKXRoaXMuY2hpbGRyZW5bYl0uX3JlbmRlcldlYkdMKGEpfX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5fcmVuZGVyQ2FudmFzPWZ1bmN0aW9uKGEpe2lmKHRoaXMudmlzaWJsZSE9PSExJiYwIT09dGhpcy5hbHBoYSl7aWYodGhpcy5fY2FjaGVBc0JpdG1hcClyZXR1cm4gdGhpcy5fcmVuZGVyQ2FjaGVkU3ByaXRlKGEpLHZvaWQgMDt0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssYS5jb250ZXh0KTtmb3IodmFyIGI9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YjtiKyspe3ZhciBkPXRoaXMuY2hpbGRyZW5bYl07ZC5fcmVuZGVyQ2FudmFzKGEpfXRoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayhhLmNvbnRleHQpfX0sYi5TcHJpdGU9ZnVuY3Rpb24oYSl7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyksdGhpcy5hbmNob3I9bmV3IGIuUG9pbnQsdGhpcy50ZXh0dXJlPWEsdGhpcy5fd2lkdGg9MCx0aGlzLl9oZWlnaHQ9MCx0aGlzLnRpbnQ9MTY3NzcyMTUsdGhpcy5ibGVuZE1vZGU9Yi5ibGVuZE1vZGVzLk5PUk1BTCxhLmJhc2VUZXh0dXJlLmhhc0xvYWRlZD90aGlzLm9uVGV4dHVyZVVwZGF0ZSgpOih0aGlzLm9uVGV4dHVyZVVwZGF0ZUJpbmQ9dGhpcy5vblRleHR1cmVVcGRhdGUuYmluZCh0aGlzKSx0aGlzLnRleHR1cmUuYWRkRXZlbnRMaXN0ZW5lcihcInVwZGF0ZVwiLHRoaXMub25UZXh0dXJlVXBkYXRlQmluZCkpLHRoaXMucmVuZGVyYWJsZT0hMH0sYi5TcHJpdGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSksYi5TcHJpdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuU3ByaXRlLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlNwcml0ZS5wcm90b3R5cGUsXCJ3aWR0aFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zY2FsZS54KnRoaXMudGV4dHVyZS5mcmFtZS53aWR0aH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuc2NhbGUueD1hL3RoaXMudGV4dHVyZS5mcmFtZS53aWR0aCx0aGlzLl93aWR0aD1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlNwcml0ZS5wcm90b3R5cGUsXCJoZWlnaHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2NhbGUueSp0aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0fSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5zY2FsZS55PWEvdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodCx0aGlzLl9oZWlnaHQ9YX19KSxiLlNwcml0ZS5wcm90b3R5cGUuc2V0VGV4dHVyZT1mdW5jdGlvbihhKXt0aGlzLnRleHR1cmU9YSx0aGlzLmNhY2hlZFRpbnQ9MTY3NzcyMTV9LGIuU3ByaXRlLnByb3RvdHlwZS5vblRleHR1cmVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLl93aWR0aCYmKHRoaXMuc2NhbGUueD10aGlzLl93aWR0aC90aGlzLnRleHR1cmUuZnJhbWUud2lkdGgpLHRoaXMuX2hlaWdodCYmKHRoaXMuc2NhbGUueT10aGlzLl9oZWlnaHQvdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodCl9LGIuU3ByaXRlLnByb3RvdHlwZS5nZXRCb3VuZHM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy50ZXh0dXJlLmZyYW1lLndpZHRoLGM9dGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodCxkPWIqKDEtdGhpcy5hbmNob3IueCksZT1iKi10aGlzLmFuY2hvci54LGY9YyooMS10aGlzLmFuY2hvci55KSxnPWMqLXRoaXMuYW5jaG9yLnksaD1hfHx0aGlzLndvcmxkVHJhbnNmb3JtLGk9aC5hLGo9aC5jLGs9aC5iLGw9aC5kLG09aC50eCxuPWgudHksbz1pKmUraypnK20scD1sKmcraiplK24scT1pKmQraypnK20scj1sKmcraipkK24scz1pKmQraypmK20sdD1sKmYraipkK24sdT1pKmUraypmK20sdj1sKmYraiplK24sdz0tMS8wLHg9LTEvMCx5PTEvMCx6PTEvMDt5PXk+bz9vOnkseT15PnE/cTp5LHk9eT5zP3M6eSx5PXk+dT91Onksej16PnA/cDp6LHo9ej5yP3I6eix6PXo+dD90Onosej16PnY/djp6LHc9bz53P286dyx3PXE+dz9xOncsdz1zPnc/czp3LHc9dT53P3U6dyx4PXA+eD9wOngseD1yPng/cjp4LHg9dD54P3Q6eCx4PXY+eD92Ong7dmFyIEE9dGhpcy5fYm91bmRzO3JldHVybiBBLng9eSxBLndpZHRoPXcteSxBLnk9eixBLmhlaWdodD14LXosdGhpcy5fY3VycmVudEJvdW5kcz1BLEF9LGIuU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlJiYhKHRoaXMuYWxwaGE8PTApKXt2YXIgYixjO2lmKHRoaXMuX21hc2t8fHRoaXMuX2ZpbHRlcnMpe3ZhciBkPWEuc3ByaXRlQmF0Y2g7Zm9yKHRoaXMuX2ZpbHRlcnMmJihkLmZsdXNoKCksYS5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGhpcy5fZmlsdGVyQmxvY2spKSx0aGlzLl9tYXNrJiYoZC5zdG9wKCksYS5tYXNrTWFuYWdlci5wdXNoTWFzayh0aGlzLm1hc2ssYSksZC5zdGFydCgpKSxkLnJlbmRlcih0aGlzKSxiPTAsYz10aGlzLmNoaWxkcmVuLmxlbmd0aDtjPmI7YisrKXRoaXMuY2hpbGRyZW5bYl0uX3JlbmRlcldlYkdMKGEpO2Quc3RvcCgpLHRoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayh0aGlzLl9tYXNrLGEpLHRoaXMuX2ZpbHRlcnMmJmEuZmlsdGVyTWFuYWdlci5wb3BGaWx0ZXIoKSxkLnN0YXJ0KCl9ZWxzZSBmb3IoYS5zcHJpdGVCYXRjaC5yZW5kZXIodGhpcyksYj0wLGM9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yz5iO2IrKyl0aGlzLmNoaWxkcmVuW2JdLl9yZW5kZXJXZWJHTChhKX19LGIuU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyQ2FudmFzPWZ1bmN0aW9uKGEpe2lmKHRoaXMudmlzaWJsZSE9PSExJiYwIT09dGhpcy5hbHBoYSl7aWYodGhpcy5ibGVuZE1vZGUhPT1hLmN1cnJlbnRCbGVuZE1vZGUmJihhLmN1cnJlbnRCbGVuZE1vZGU9dGhpcy5ibGVuZE1vZGUsYS5jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1iLmJsZW5kTW9kZXNDYW52YXNbYS5jdXJyZW50QmxlbmRNb2RlXSksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wdXNoTWFzayh0aGlzLl9tYXNrLGEuY29udGV4dCksdGhpcy50ZXh0dXJlLnZhbGlkKXthLmNvbnRleHQuZ2xvYmFsQWxwaGE9dGhpcy53b3JsZEFscGhhLGEucm91bmRQaXhlbHM/YS5jb250ZXh0LnNldFRyYW5zZm9ybSh0aGlzLndvcmxkVHJhbnNmb3JtLmEsdGhpcy53b3JsZFRyYW5zZm9ybS5jLHRoaXMud29ybGRUcmFuc2Zvcm0uYix0aGlzLndvcmxkVHJhbnNmb3JtLmQsMHx0aGlzLndvcmxkVHJhbnNmb3JtLnR4LDB8dGhpcy53b3JsZFRyYW5zZm9ybS50eSk6YS5jb250ZXh0LnNldFRyYW5zZm9ybSh0aGlzLndvcmxkVHJhbnNmb3JtLmEsdGhpcy53b3JsZFRyYW5zZm9ybS5jLHRoaXMud29ybGRUcmFuc2Zvcm0uYix0aGlzLndvcmxkVHJhbnNmb3JtLmQsdGhpcy53b3JsZFRyYW5zZm9ybS50eCx0aGlzLndvcmxkVHJhbnNmb3JtLnR5KSxhLnNtb290aFByb3BlcnR5JiZhLnNjYWxlTW9kZSE9PXRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5zY2FsZU1vZGUmJihhLnNjYWxlTW9kZT10aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuc2NhbGVNb2RlLGEuY29udGV4dFthLnNtb290aFByb3BlcnR5XT1hLnNjYWxlTW9kZT09PWIuc2NhbGVNb2Rlcy5MSU5FQVIpO3ZhciBjPXRoaXMudGV4dHVyZS50cmltP3RoaXMudGV4dHVyZS50cmltLngtdGhpcy5hbmNob3IueCp0aGlzLnRleHR1cmUudHJpbS53aWR0aDp0aGlzLmFuY2hvci54Ki10aGlzLnRleHR1cmUuZnJhbWUud2lkdGgsZD10aGlzLnRleHR1cmUudHJpbT90aGlzLnRleHR1cmUudHJpbS55LXRoaXMuYW5jaG9yLnkqdGhpcy50ZXh0dXJlLnRyaW0uaGVpZ2h0OnRoaXMuYW5jaG9yLnkqLXRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ7MTY3NzcyMTUhPT10aGlzLnRpbnQ/KHRoaXMuY2FjaGVkVGludCE9PXRoaXMudGludCYmKHRoaXMuY2FjaGVkVGludD10aGlzLnRpbnQsdGhpcy50aW50ZWRUZXh0dXJlPWIuQ2FudmFzVGludGVyLmdldFRpbnRlZFRleHR1cmUodGhpcyx0aGlzLnRpbnQpKSxhLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMudGludGVkVGV4dHVyZSwwLDAsdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGgsdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0LGMsZCx0aGlzLnRleHR1cmUuY3JvcC53aWR0aCx0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQpKTphLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5zb3VyY2UsdGhpcy50ZXh0dXJlLmNyb3AueCx0aGlzLnRleHR1cmUuY3JvcC55LHRoaXMudGV4dHVyZS5jcm9wLndpZHRoLHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCxjLGQsdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGgsdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0KX1mb3IodmFyIGU9MCxmPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2Y+ZTtlKyspdGhpcy5jaGlsZHJlbltlXS5fcmVuZGVyQ2FudmFzKGEpO3RoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayhhLmNvbnRleHQpfX0sYi5TcHJpdGUuZnJvbUZyYW1lPWZ1bmN0aW9uKGEpe3ZhciBjPWIuVGV4dHVyZUNhY2hlW2FdO2lmKCFjKXRocm93IG5ldyBFcnJvcignVGhlIGZyYW1lSWQgXCInK2ErJ1wiIGRvZXMgbm90IGV4aXN0IGluIHRoZSB0ZXh0dXJlIGNhY2hlJyt0aGlzKTtyZXR1cm4gbmV3IGIuU3ByaXRlKGMpfSxiLlNwcml0ZS5mcm9tSW1hZ2U9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWIuVGV4dHVyZS5mcm9tSW1hZ2UoYSxjLGQpO3JldHVybiBuZXcgYi5TcHJpdGUoZSl9LGIuU3ByaXRlQmF0Y2g9ZnVuY3Rpb24oYSl7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyksdGhpcy50ZXh0dXJlVGhpbmc9YSx0aGlzLnJlYWR5PSExfSxiLlNwcml0ZUJhdGNoLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUpLGIuU3ByaXRlQmF0Y2guY29uc3RydWN0b3I9Yi5TcHJpdGVCYXRjaCxiLlNwcml0ZUJhdGNoLnByb3RvdHlwZS5pbml0V2ViR0w9ZnVuY3Rpb24oYSl7dGhpcy5mYXN0U3ByaXRlQmF0Y2g9bmV3IGIuV2ViR0xGYXN0U3ByaXRlQmF0Y2goYSksdGhpcy5yZWFkeT0hMH0sYi5TcHJpdGVCYXRjaC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKCl7Yi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKX0sYi5TcHJpdGVCYXRjaC5wcm90b3R5cGUuX3JlbmRlcldlYkdMPWZ1bmN0aW9uKGEpeyF0aGlzLnZpc2libGV8fHRoaXMuYWxwaGE8PTB8fCF0aGlzLmNoaWxkcmVuLmxlbmd0aHx8KHRoaXMucmVhZHl8fHRoaXMuaW5pdFdlYkdMKGEuZ2wpLGEuc3ByaXRlQmF0Y2guc3RvcCgpLGEuc2hhZGVyTWFuYWdlci5zZXRTaGFkZXIoYS5zaGFkZXJNYW5hZ2VyLmZhc3RTaGFkZXIpLHRoaXMuZmFzdFNwcml0ZUJhdGNoLmJlZ2luKHRoaXMsYSksdGhpcy5mYXN0U3ByaXRlQmF0Y2gucmVuZGVyKHRoaXMpLGEuc3ByaXRlQmF0Y2guc3RhcnQoKSl9LGIuU3ByaXRlQmF0Y2gucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7dmFyIGM9YS5jb250ZXh0O2MuZ2xvYmFsQWxwaGE9dGhpcy53b3JsZEFscGhhLGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtLmNhbGwodGhpcyk7Zm9yKHZhciBkPXRoaXMud29ybGRUcmFuc2Zvcm0sZT0hMCxmPTA7Zjx0aGlzLmNoaWxkcmVuLmxlbmd0aDtmKyspe3ZhciBnPXRoaXMuY2hpbGRyZW5bZl07aWYoZy52aXNpYmxlKXt2YXIgaD1nLnRleHR1cmUsaT1oLmZyYW1lO2lmKGMuZ2xvYmFsQWxwaGE9dGhpcy53b3JsZEFscGhhKmcuYWxwaGEsZy5yb3RhdGlvbiUoMipNYXRoLlBJKT09PTApZSYmKGMuc2V0VHJhbnNmb3JtKGQuYSxkLmMsZC5iLGQuZCxkLnR4LGQudHkpLGU9ITEpLGMuZHJhd0ltYWdlKGguYmFzZVRleHR1cmUuc291cmNlLGkueCxpLnksaS53aWR0aCxpLmhlaWdodCxnLmFuY2hvci54Ki1pLndpZHRoKmcuc2NhbGUueCtnLnBvc2l0aW9uLngrLjV8MCxnLmFuY2hvci55Ki1pLmhlaWdodCpnLnNjYWxlLnkrZy5wb3NpdGlvbi55Ky41fDAsaS53aWR0aCpnLnNjYWxlLngsaS5oZWlnaHQqZy5zY2FsZS55KTtlbHNle2V8fChlPSEwKSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKGcpO3ZhciBqPWcud29ybGRUcmFuc2Zvcm07YS5yb3VuZFBpeGVscz9jLnNldFRyYW5zZm9ybShqLmEsai5jLGouYixqLmQsMHxqLnR4LDB8ai50eSk6Yy5zZXRUcmFuc2Zvcm0oai5hLGouYyxqLmIsai5kLGoudHgsai50eSksYy5kcmF3SW1hZ2UoaC5iYXNlVGV4dHVyZS5zb3VyY2UsaS54LGkueSxpLndpZHRoLGkuaGVpZ2h0LGcuYW5jaG9yLngqLWkud2lkdGgrLjV8MCxnLmFuY2hvci55Ki1pLmhlaWdodCsuNXwwLGkud2lkdGgsaS5oZWlnaHQpfX19fSxiLk1vdmllQ2xpcD1mdW5jdGlvbihhKXtiLlNwcml0ZS5jYWxsKHRoaXMsYVswXSksdGhpcy50ZXh0dXJlcz1hLHRoaXMuYW5pbWF0aW9uU3BlZWQ9MSx0aGlzLmxvb3A9ITAsdGhpcy5vbkNvbXBsZXRlPW51bGwsdGhpcy5jdXJyZW50RnJhbWU9MCx0aGlzLnBsYXlpbmc9ITF9LGIuTW92aWVDbGlwLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuU3ByaXRlLnByb3RvdHlwZSksYi5Nb3ZpZUNsaXAucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuTW92aWVDbGlwLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLk1vdmllQ2xpcC5wcm90b3R5cGUsXCJ0b3RhbEZyYW1lc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50ZXh0dXJlcy5sZW5ndGh9fSksYi5Nb3ZpZUNsaXAucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLnBsYXlpbmc9ITF9LGIuTW92aWVDbGlwLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKCl7dGhpcy5wbGF5aW5nPSEwfSxiLk1vdmllQ2xpcC5wcm90b3R5cGUuZ290b0FuZFN0b3A9ZnVuY3Rpb24oYSl7dGhpcy5wbGF5aW5nPSExLHRoaXMuY3VycmVudEZyYW1lPWE7dmFyIGI9dGhpcy5jdXJyZW50RnJhbWUrLjV8MDt0aGlzLnNldFRleHR1cmUodGhpcy50ZXh0dXJlc1tiJXRoaXMudGV4dHVyZXMubGVuZ3RoXSl9LGIuTW92aWVDbGlwLnByb3RvdHlwZS5nb3RvQW5kUGxheT1mdW5jdGlvbihhKXt0aGlzLmN1cnJlbnRGcmFtZT1hLHRoaXMucGxheWluZz0hMH0sYi5Nb3ZpZUNsaXAucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe2lmKGIuU3ByaXRlLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKSx0aGlzLnBsYXlpbmcpe3RoaXMuY3VycmVudEZyYW1lKz10aGlzLmFuaW1hdGlvblNwZWVkO3ZhciBhPXRoaXMuY3VycmVudEZyYW1lKy41fDA7dGhpcy5jdXJyZW50RnJhbWU9dGhpcy5jdXJyZW50RnJhbWUldGhpcy50ZXh0dXJlcy5sZW5ndGgsdGhpcy5sb29wfHxhPHRoaXMudGV4dHVyZXMubGVuZ3RoP3RoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW2EldGhpcy50ZXh0dXJlcy5sZW5ndGhdKTphPj10aGlzLnRleHR1cmVzLmxlbmd0aCYmKHRoaXMuZ290b0FuZFN0b3AodGhpcy50ZXh0dXJlcy5sZW5ndGgtMSksdGhpcy5vbkNvbXBsZXRlJiZ0aGlzLm9uQ29tcGxldGUoKSl9fSxiLk1vdmllQ2xpcC5mcm9tRnJhbWVzPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhLmxlbmd0aDtkKyspYy5wdXNoKG5ldyBiLlRleHR1cmUuZnJvbUZyYW1lKGFbZF0pKTtyZXR1cm4gbmV3IGIuTW92aWVDbGlwKGMpfSxiLk1vdmllQ2xpcC5mcm9tSW1hZ2VzPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhLmxlbmd0aDtkKyspYy5wdXNoKG5ldyBiLlRleHR1cmUuZnJvbUltYWdlKGFbZF0pKTtyZXR1cm4gbmV3IGIuTW92aWVDbGlwKGMpfSxiLkZpbHRlckJsb2NrPWZ1bmN0aW9uKCl7dGhpcy52aXNpYmxlPSEwLHRoaXMucmVuZGVyYWJsZT0hMH0sYi5UZXh0PWZ1bmN0aW9uKGEsYyl7dGhpcy5jYW52YXM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLmNvbnRleHQ9dGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLGIuU3ByaXRlLmNhbGwodGhpcyxiLlRleHR1cmUuZnJvbUNhbnZhcyh0aGlzLmNhbnZhcykpLHRoaXMuc2V0VGV4dChhKSx0aGlzLnNldFN0eWxlKGMpfSxiLlRleHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5TcHJpdGUucHJvdG90eXBlKSxiLlRleHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuVGV4dCxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5UZXh0LnByb3RvdHlwZSxcIndpZHRoXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRpcnR5JiYodGhpcy51cGRhdGVUZXh0KCksdGhpcy5kaXJ0eT0hMSksdGhpcy5zY2FsZS54KnRoaXMudGV4dHVyZS5mcmFtZS53aWR0aH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuc2NhbGUueD1hL3RoaXMudGV4dHVyZS5mcmFtZS53aWR0aCx0aGlzLl93aWR0aD1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlRleHQucHJvdG90eXBlLFwiaGVpZ2h0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRpcnR5JiYodGhpcy51cGRhdGVUZXh0KCksdGhpcy5kaXJ0eT0hMSksdGhpcy5zY2FsZS55KnRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHR9LHNldDpmdW5jdGlvbihhKXt0aGlzLnNjYWxlLnk9YS90aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0LHRoaXMuX2hlaWdodD1hfX0pLGIuVGV4dC5wcm90b3R5cGUuc2V0U3R5bGU9ZnVuY3Rpb24oYSl7YT1hfHx7fSxhLmZvbnQ9YS5mb250fHxcImJvbGQgMjBwdCBBcmlhbFwiLGEuZmlsbD1hLmZpbGx8fFwiYmxhY2tcIixhLmFsaWduPWEuYWxpZ258fFwibGVmdFwiLGEuc3Ryb2tlPWEuc3Ryb2tlfHxcImJsYWNrXCIsYS5zdHJva2VUaGlja25lc3M9YS5zdHJva2VUaGlja25lc3N8fDAsYS53b3JkV3JhcD1hLndvcmRXcmFwfHwhMSxhLndvcmRXcmFwV2lkdGg9YS53b3JkV3JhcFdpZHRofHwxMDAsYS53b3JkV3JhcFdpZHRoPWEud29yZFdyYXBXaWR0aHx8MTAwLGEuZHJvcFNoYWRvdz1hLmRyb3BTaGFkb3d8fCExLGEuZHJvcFNoYWRvd0FuZ2xlPWEuZHJvcFNoYWRvd0FuZ2xlfHxNYXRoLlBJLzYsYS5kcm9wU2hhZG93RGlzdGFuY2U9YS5kcm9wU2hhZG93RGlzdGFuY2V8fDQsYS5kcm9wU2hhZG93Q29sb3I9YS5kcm9wU2hhZG93Q29sb3J8fFwiYmxhY2tcIix0aGlzLnN0eWxlPWEsdGhpcy5kaXJ0eT0hMH0sYi5UZXh0LnByb3RvdHlwZS5zZXRUZXh0PWZ1bmN0aW9uKGEpe3RoaXMudGV4dD1hLnRvU3RyaW5nKCl8fFwiIFwiLHRoaXMuZGlydHk9ITB9LGIuVGV4dC5wcm90b3R5cGUudXBkYXRlVGV4dD1mdW5jdGlvbigpe3RoaXMuY29udGV4dC5mb250PXRoaXMuc3R5bGUuZm9udDt2YXIgYT10aGlzLnRleHQ7dGhpcy5zdHlsZS53b3JkV3JhcCYmKGE9dGhpcy53b3JkV3JhcCh0aGlzLnRleHQpKTtmb3IodmFyIGI9YS5zcGxpdCgvKD86XFxyXFxufFxccnxcXG4pLyksYz1bXSxkPTAsZT0wO2U8Yi5sZW5ndGg7ZSsrKXt2YXIgZj10aGlzLmNvbnRleHQubWVhc3VyZVRleHQoYltlXSkud2lkdGg7Y1tlXT1mLGQ9TWF0aC5tYXgoZCxmKX12YXIgZz1kK3RoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzO3RoaXMuc3R5bGUuZHJvcFNoYWRvdyYmKGcrPXRoaXMuc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlKSx0aGlzLmNhbnZhcy53aWR0aD1nK3RoaXMuY29udGV4dC5saW5lV2lkdGg7dmFyIGg9dGhpcy5kZXRlcm1pbmVGb250SGVpZ2h0KFwiZm9udDogXCIrdGhpcy5zdHlsZS5mb250K1wiO1wiKSt0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyxpPWgqYi5sZW5ndGg7dGhpcy5zdHlsZS5kcm9wU2hhZG93JiYoaSs9dGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UpLHRoaXMuY2FudmFzLmhlaWdodD1pLG5hdmlnYXRvci5pc0NvY29vbkpTJiZ0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsMCx0aGlzLmNhbnZhcy53aWR0aCx0aGlzLmNhbnZhcy5oZWlnaHQpLHRoaXMuY29udGV4dC5mb250PXRoaXMuc3R5bGUuZm9udCx0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGU9dGhpcy5zdHlsZS5zdHJva2UsdGhpcy5jb250ZXh0LmxpbmVXaWR0aD10aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyx0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lPVwidG9wXCI7dmFyIGosaztpZih0aGlzLnN0eWxlLmRyb3BTaGFkb3cpe3RoaXMuY29udGV4dC5maWxsU3R5bGU9dGhpcy5zdHlsZS5kcm9wU2hhZG93Q29sb3I7dmFyIGw9TWF0aC5zaW4odGhpcy5zdHlsZS5kcm9wU2hhZG93QW5nbGUpKnRoaXMuc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlLG09TWF0aC5jb3ModGhpcy5zdHlsZS5kcm9wU2hhZG93QW5nbGUpKnRoaXMuc3R5bGUuZHJvcFNoYWRvd0Rpc3RhbmNlO2ZvcihlPTA7ZTxiLmxlbmd0aDtlKyspaj10aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcy8yLGs9dGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MvMitlKmgsXCJyaWdodFwiPT09dGhpcy5zdHlsZS5hbGlnbj9qKz1kLWNbZV06XCJjZW50ZXJcIj09PXRoaXMuc3R5bGUuYWxpZ24mJihqKz0oZC1jW2VdKS8yKSx0aGlzLnN0eWxlLmZpbGwmJnRoaXMuY29udGV4dC5maWxsVGV4dChiW2VdLGorbCxrK20pfWZvcih0aGlzLmNvbnRleHQuZmlsbFN0eWxlPXRoaXMuc3R5bGUuZmlsbCxlPTA7ZTxiLmxlbmd0aDtlKyspaj10aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcy8yLGs9dGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MvMitlKmgsXCJyaWdodFwiPT09dGhpcy5zdHlsZS5hbGlnbj9qKz1kLWNbZV06XCJjZW50ZXJcIj09PXRoaXMuc3R5bGUuYWxpZ24mJihqKz0oZC1jW2VdKS8yKSx0aGlzLnN0eWxlLnN0cm9rZSYmdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3MmJnRoaXMuY29udGV4dC5zdHJva2VUZXh0KGJbZV0saixrKSx0aGlzLnN0eWxlLmZpbGwmJnRoaXMuY29udGV4dC5maWxsVGV4dChiW2VdLGosayk7dGhpcy51cGRhdGVUZXh0dXJlKCl9LGIuVGV4dC5wcm90b3R5cGUudXBkYXRlVGV4dHVyZT1mdW5jdGlvbigpe3RoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aD10aGlzLmNhbnZhcy53aWR0aCx0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuaGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodCx0aGlzLnRleHR1cmUuY3JvcC53aWR0aD10aGlzLnRleHR1cmUuZnJhbWUud2lkdGg9dGhpcy5jYW52YXMud2lkdGgsdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0PXRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQ9dGhpcy5jYW52YXMuaGVpZ2h0LHRoaXMuX3dpZHRoPXRoaXMuY2FudmFzLndpZHRoLHRoaXMuX2hlaWdodD10aGlzLmNhbnZhcy5oZWlnaHQsdGhpcy5yZXF1aXJlc1VwZGF0ZT0hMH0sYi5UZXh0LnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7dGhpcy5yZXF1aXJlc1VwZGF0ZSYmKHRoaXMucmVxdWlyZXNVcGRhdGU9ITEsYi51cGRhdGVXZWJHTFRleHR1cmUodGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLGEuZ2wpKSxiLlNwcml0ZS5wcm90b3R5cGUuX3JlbmRlcldlYkdMLmNhbGwodGhpcyxhKX0sYi5UZXh0LnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLmRpcnR5JiYodGhpcy51cGRhdGVUZXh0KCksdGhpcy5kaXJ0eT0hMSksYi5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpfSxiLlRleHQucHJvdG90eXBlLmRldGVybWluZUZvbnRIZWlnaHQ9ZnVuY3Rpb24oYSl7dmFyIGM9Yi5UZXh0LmhlaWdodENhY2hlW2FdO2lmKCFjKXt2YXIgZD1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0sZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGY9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJNXCIpO2UuYXBwZW5kQ2hpbGQoZiksZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLGErXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowXCIpLGQuYXBwZW5kQ2hpbGQoZSksYz1lLm9mZnNldEhlaWdodCxiLlRleHQuaGVpZ2h0Q2FjaGVbYV09YyxkLnJlbW92ZUNoaWxkKGUpfXJldHVybiBjfSxiLlRleHQucHJvdG90eXBlLndvcmRXcmFwPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cIlwiLGM9YS5zcGxpdChcIlxcblwiKSxkPTA7ZDxjLmxlbmd0aDtkKyspe2Zvcih2YXIgZT10aGlzLnN0eWxlLndvcmRXcmFwV2lkdGgsZj1jW2RdLnNwbGl0KFwiIFwiKSxnPTA7ZzxmLmxlbmd0aDtnKyspe3ZhciBoPXRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChmW2ddKS53aWR0aCxpPWgrdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KFwiIFwiKS53aWR0aDswPT09Z3x8aT5lPyhnPjAmJihiKz1cIlxcblwiKSxiKz1mW2ddLGU9dGhpcy5zdHlsZS53b3JkV3JhcFdpZHRoLWgpOihlLT1pLGIrPVwiIFwiK2ZbZ10pfWQ8Yy5sZW5ndGgtMSYmKGIrPVwiXFxuXCIpfXJldHVybiBifSxiLlRleHQucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oYSl7dGhpcy5jb250ZXh0PW51bGwsdGhpcy5jYW52YXM9bnVsbCx0aGlzLnRleHR1cmUuZGVzdHJveSh2b2lkIDA9PT1hPyEwOmEpfSxiLlRleHQuaGVpZ2h0Q2FjaGU9e30sYi5CaXRtYXBUZXh0PWZ1bmN0aW9uKGEsYyl7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyksdGhpcy5fcG9vbD1bXSx0aGlzLnNldFRleHQoYSksdGhpcy5zZXRTdHlsZShjKSx0aGlzLnVwZGF0ZVRleHQoKSx0aGlzLmRpcnR5PSExfSxiLkJpdG1hcFRleHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSksYi5CaXRtYXBUZXh0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkJpdG1hcFRleHQsYi5CaXRtYXBUZXh0LnByb3RvdHlwZS5zZXRUZXh0PWZ1bmN0aW9uKGEpe3RoaXMudGV4dD1hfHxcIiBcIix0aGlzLmRpcnR5PSEwfSxiLkJpdG1hcFRleHQucHJvdG90eXBlLnNldFN0eWxlPWZ1bmN0aW9uKGEpe2E9YXx8e30sYS5hbGlnbj1hLmFsaWdufHxcImxlZnRcIix0aGlzLnN0eWxlPWE7dmFyIGM9YS5mb250LnNwbGl0KFwiIFwiKTt0aGlzLmZvbnROYW1lPWNbYy5sZW5ndGgtMV0sdGhpcy5mb250U2l6ZT1jLmxlbmd0aD49Mj9wYXJzZUludChjW2MubGVuZ3RoLTJdLDEwKTpiLkJpdG1hcFRleHQuZm9udHNbdGhpcy5mb250TmFtZV0uc2l6ZSx0aGlzLmRpcnR5PSEwLHRoaXMudGludD1hLnRpbnR9LGIuQml0bWFwVGV4dC5wcm90b3R5cGUudXBkYXRlVGV4dD1mdW5jdGlvbigpe2Zvcih2YXIgYT1iLkJpdG1hcFRleHQuZm9udHNbdGhpcy5mb250TmFtZV0sYz1uZXcgYi5Qb2ludCxkPW51bGwsZT1bXSxmPTAsZz1bXSxoPTAsaT10aGlzLmZvbnRTaXplL2Euc2l6ZSxqPTA7ajx0aGlzLnRleHQubGVuZ3RoO2orKyl7dmFyIGs9dGhpcy50ZXh0LmNoYXJDb2RlQXQoaik7aWYoLyg/OlxcclxcbnxcXHJ8XFxuKS8udGVzdCh0aGlzLnRleHQuY2hhckF0KGopKSlnLnB1c2goYy54KSxmPU1hdGgubWF4KGYsYy54KSxoKyssYy54PTAsYy55Kz1hLmxpbmVIZWlnaHQsZD1udWxsO2Vsc2V7dmFyIGw9YS5jaGFyc1trXTtsJiYoZCYmbFtkXSYmKGMueCs9bC5rZXJuaW5nW2RdKSxlLnB1c2goe3RleHR1cmU6bC50ZXh0dXJlLGxpbmU6aCxjaGFyQ29kZTprLHBvc2l0aW9uOm5ldyBiLlBvaW50KGMueCtsLnhPZmZzZXQsYy55K2wueU9mZnNldCl9KSxjLngrPWwueEFkdmFuY2UsZD1rKX19Zy5wdXNoKGMueCksZj1NYXRoLm1heChmLGMueCk7dmFyIG09W107Zm9yKGo9MDtoPj1qO2orKyl7dmFyIG49MDtcInJpZ2h0XCI9PT10aGlzLnN0eWxlLmFsaWduP249Zi1nW2pdOlwiY2VudGVyXCI9PT10aGlzLnN0eWxlLmFsaWduJiYobj0oZi1nW2pdKS8yKSxtLnB1c2gobil9dmFyIG89dGhpcy5jaGlsZHJlbi5sZW5ndGgscD1lLmxlbmd0aCxxPXRoaXMudGludHx8MTY3NzcyMTU7Zm9yKGo9MDtwPmo7aisrKXt2YXIgcj1vPmo/dGhpcy5jaGlsZHJlbltqXTp0aGlzLl9wb29sLnBvcCgpO3I/ci5zZXRUZXh0dXJlKGVbal0udGV4dHVyZSk6cj1uZXcgYi5TcHJpdGUoZVtqXS50ZXh0dXJlKSxyLnBvc2l0aW9uLng9KGVbal0ucG9zaXRpb24ueCttW2Vbal0ubGluZV0pKmksci5wb3NpdGlvbi55PWVbal0ucG9zaXRpb24ueSppLHIuc2NhbGUueD1yLnNjYWxlLnk9aSxyLnRpbnQ9cSxyLnBhcmVudHx8dGhpcy5hZGRDaGlsZChyKX1mb3IoO3RoaXMuY2hpbGRyZW4ubGVuZ3RoPnA7KXt2YXIgcz10aGlzLmdldENoaWxkQXQodGhpcy5jaGlsZHJlbi5sZW5ndGgtMSk7dGhpcy5fcG9vbC5wdXNoKHMpLHRoaXMucmVtb3ZlQ2hpbGQocyl9dGhpcy50ZXh0V2lkdGg9ZippLHRoaXMudGV4dEhlaWdodD0oYy55K2EubGluZUhlaWdodCkqaX0sYi5CaXRtYXBUZXh0LnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLmRpcnR5JiYodGhpcy51cGRhdGVUZXh0KCksdGhpcy5kaXJ0eT0hMSksYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKX0sYi5CaXRtYXBUZXh0LmZvbnRzPXt9LGIuSW50ZXJhY3Rpb25EYXRhPWZ1bmN0aW9uKCl7dGhpcy5nbG9iYWw9bmV3IGIuUG9pbnQsdGhpcy50YXJnZXQ9bnVsbCx0aGlzLm9yaWdpbmFsRXZlbnQ9bnVsbH0sYi5JbnRlcmFjdGlvbkRhdGEucHJvdG90eXBlLmdldExvY2FsUG9zaXRpb249ZnVuY3Rpb24oYSl7dmFyIGM9YS53b3JsZFRyYW5zZm9ybSxkPXRoaXMuZ2xvYmFsLGU9Yy5hLGY9Yy5iLGc9Yy50eCxoPWMuYyxpPWMuZCxqPWMudHksaz0xLyhlKmkrZiotaCk7cmV0dXJuIG5ldyBiLlBvaW50KGkqaypkLngrLWYqaypkLnkrKGoqZi1nKmkpKmssZSprKmQueSstaCprKmQueCsoLWoqZStnKmgpKmspfSxiLkludGVyYWN0aW9uRGF0YS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5JbnRlcmFjdGlvbkRhdGEsYi5JbnRlcmFjdGlvbk1hbmFnZXI9ZnVuY3Rpb24oYSl7dGhpcy5zdGFnZT1hLHRoaXMubW91c2U9bmV3IGIuSW50ZXJhY3Rpb25EYXRhLHRoaXMudG91Y2hzPXt9LHRoaXMudGVtcFBvaW50PW5ldyBiLlBvaW50LHRoaXMubW91c2VvdmVyRW5hYmxlZD0hMCx0aGlzLnBvb2w9W10sdGhpcy5pbnRlcmFjdGl2ZUl0ZW1zPVtdLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50PW51bGwsdGhpcy5vbk1vdXNlTW92ZT10aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcyksdGhpcy5vbk1vdXNlRG93bj10aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcyksdGhpcy5vbk1vdXNlT3V0PXRoaXMub25Nb3VzZU91dC5iaW5kKHRoaXMpLHRoaXMub25Nb3VzZVVwPXRoaXMub25Nb3VzZVVwLmJpbmQodGhpcyksdGhpcy5vblRvdWNoU3RhcnQ9dGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSx0aGlzLm9uVG91Y2hFbmQ9dGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyksdGhpcy5vblRvdWNoTW92ZT10aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyksdGhpcy5sYXN0PTAsdGhpcy5jdXJyZW50Q3Vyc29yU3R5bGU9XCJpbmhlcml0XCIsdGhpcy5tb3VzZU91dD0hMX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuSW50ZXJhY3Rpb25NYW5hZ2VyLGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5jb2xsZWN0SW50ZXJhY3RpdmVTcHJpdGU9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9YS5jaGlsZHJlbixkPWMubGVuZ3RoLGU9ZC0xO2U+PTA7ZS0tKXt2YXIgZj1jW2VdO2YuX2ludGVyYWN0aXZlPyhiLmludGVyYWN0aXZlQ2hpbGRyZW49ITAsdGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLnB1c2goZiksZi5jaGlsZHJlbi5sZW5ndGg+MCYmdGhpcy5jb2xsZWN0SW50ZXJhY3RpdmVTcHJpdGUoZixmKSk6KGYuX19pUGFyZW50PW51bGwsZi5jaGlsZHJlbi5sZW5ndGg+MCYmdGhpcy5jb2xsZWN0SW50ZXJhY3RpdmVTcHJpdGUoZixiKSl9fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuc2V0VGFyZ2V0PWZ1bmN0aW9uKGEpe3RoaXMudGFyZ2V0PWEsbnVsbD09PXRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50JiZ0aGlzLnNldFRhcmdldERvbUVsZW1lbnQoYS52aWV3KX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLnNldFRhcmdldERvbUVsZW1lbnQ9ZnVuY3Rpb24oYSl7dGhpcy5yZW1vdmVFdmVudHMoKSx3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQmJihhLnN0eWxlW1wiLW1zLWNvbnRlbnQtem9vbWluZ1wiXT1cIm5vbmVcIixhLnN0eWxlW1wiLW1zLXRvdWNoLWFjdGlvblwiXT1cIm5vbmVcIiksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQ9YSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm9uTW91c2VNb3ZlLCEwKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0aGlzLm9uTW91c2VEb3duLCEwKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLHRoaXMub25Nb3VzZU91dCwhMCksYS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMub25Ub3VjaFN0YXJ0LCEwKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMub25Ub3VjaEVuZCwhMCksYS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsdGhpcy5vblRvdWNoTW92ZSwhMCksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsdGhpcy5vbk1vdXNlVXAsITApfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQmJih0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5zdHlsZVtcIi1tcy1jb250ZW50LXpvb21pbmdcIl09XCJcIix0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5zdHlsZVtcIi1tcy10b3VjaC1hY3Rpb25cIl09XCJcIix0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsdGhpcy5vbk1vdXNlTW92ZSwhMCksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMub25Nb3VzZURvd24sITApLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLHRoaXMub25Nb3VzZU91dCwhMCksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLm9uVG91Y2hTdGFydCwhMCksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy5vblRvdWNoRW5kLCEwKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsdGhpcy5vblRvdWNoTW92ZSwhMCksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQ9bnVsbCx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIix0aGlzLm9uTW91c2VVcCwhMCkpfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKCl7aWYodGhpcy50YXJnZXQpe3ZhciBhPURhdGUubm93KCksYz1hLXRoaXMubGFzdDtpZihjPWMqYi5JTlRFUkFDVElPTl9GUkVRVUVOQ1kvMWUzLCEoMT5jKSl7dGhpcy5sYXN0PWE7dmFyIGQ9MDt0aGlzLmRpcnR5JiZ0aGlzLnJlYnVpbGRJbnRlcmFjdGl2ZUdyYXBoKCk7dmFyIGU9dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLmxlbmd0aCxmPVwiaW5oZXJpdFwiLGc9ITE7Zm9yKGQ9MDtlPmQ7ZCsrKXt2YXIgaD10aGlzLmludGVyYWN0aXZlSXRlbXNbZF07aC5fX2hpdD10aGlzLmhpdFRlc3QoaCx0aGlzLm1vdXNlKSx0aGlzLm1vdXNlLnRhcmdldD1oLGguX19oaXQmJiFnPyhoLmJ1dHRvbk1vZGUmJihmPWguZGVmYXVsdEN1cnNvciksaC5pbnRlcmFjdGl2ZUNoaWxkcmVufHwoZz0hMCksaC5fX2lzT3Zlcnx8KGgubW91c2VvdmVyJiZoLm1vdXNlb3Zlcih0aGlzLm1vdXNlKSxoLl9faXNPdmVyPSEwKSk6aC5fX2lzT3ZlciYmKGgubW91c2VvdXQmJmgubW91c2VvdXQodGhpcy5tb3VzZSksaC5fX2lzT3Zlcj0hMSl9dGhpcy5jdXJyZW50Q3Vyc29yU3R5bGUhPT1mJiYodGhpcy5jdXJyZW50Q3Vyc29yU3R5bGU9Zix0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5zdHlsZS5jdXJzb3I9Zil9fX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLnJlYnVpbGRJbnRlcmFjdGl2ZUdyYXBoPWZ1bmN0aW9uKCl7dGhpcy5kaXJ0eT0hMTtmb3IodmFyIGE9dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLmxlbmd0aCxiPTA7YT5iO2IrKyl0aGlzLmludGVyYWN0aXZlSXRlbXNbYl0uaW50ZXJhY3RpdmVDaGlsZHJlbj0hMTt0aGlzLmludGVyYWN0aXZlSXRlbXM9W10sdGhpcy5zdGFnZS5pbnRlcmFjdGl2ZSYmdGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLnB1c2godGhpcy5zdGFnZSksdGhpcy5jb2xsZWN0SW50ZXJhY3RpdmVTcHJpdGUodGhpcy5zdGFnZSx0aGlzLnN0YWdlKX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLm9uTW91c2VNb3ZlPWZ1bmN0aW9uKGEpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKSx0aGlzLm1vdXNlLm9yaWdpbmFsRXZlbnQ9YXx8d2luZG93LmV2ZW50O3ZhciBiPXRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3RoaXMubW91c2UuZ2xvYmFsLng9KGEuY2xpZW50WC1iLmxlZnQpKih0aGlzLnRhcmdldC53aWR0aC9iLndpZHRoKSx0aGlzLm1vdXNlLmdsb2JhbC55PShhLmNsaWVudFktYi50b3ApKih0aGlzLnRhcmdldC5oZWlnaHQvYi5oZWlnaHQpO2Zvcih2YXIgYz10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGQ9MDtjPmQ7ZCsrKXt2YXIgZT10aGlzLmludGVyYWN0aXZlSXRlbXNbZF07ZS5tb3VzZW1vdmUmJmUubW91c2Vtb3ZlKHRoaXMubW91c2UpfX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLm9uTW91c2VEb3duPWZ1bmN0aW9uKGEpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKSx0aGlzLm1vdXNlLm9yaWdpbmFsRXZlbnQ9YXx8d2luZG93LmV2ZW50LGIuQVVUT19QUkVWRU5UX0RFRkFVTFQmJnRoaXMubW91c2Uub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO2Zvcih2YXIgYz10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGQ9MDtjPmQ7ZCsrKXt2YXIgZT10aGlzLmludGVyYWN0aXZlSXRlbXNbZF07aWYoKGUubW91c2Vkb3dufHxlLmNsaWNrKSYmKGUuX19tb3VzZUlzRG93bj0hMCxlLl9faGl0PXRoaXMuaGl0VGVzdChlLHRoaXMubW91c2UpLGUuX19oaXQmJihlLm1vdXNlZG93biYmZS5tb3VzZWRvd24odGhpcy5tb3VzZSksZS5fX2lzRG93bj0hMCwhZS5pbnRlcmFjdGl2ZUNoaWxkcmVuKSkpYnJlYWt9fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Nb3VzZU91dD1mdW5jdGlvbigpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKTt2YXIgYT10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoO3RoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnN0eWxlLmN1cnNvcj1cImluaGVyaXRcIjtmb3IodmFyIGI9MDthPmI7YisrKXt2YXIgYz10aGlzLmludGVyYWN0aXZlSXRlbXNbYl07Yy5fX2lzT3ZlciYmKHRoaXMubW91c2UudGFyZ2V0PWMsYy5tb3VzZW91dCYmYy5tb3VzZW91dCh0aGlzLm1vdXNlKSxjLl9faXNPdmVyPSExKX10aGlzLm1vdXNlT3V0PSEwLHRoaXMubW91c2UuZ2xvYmFsLng9LTFlNCx0aGlzLm1vdXNlLmdsb2JhbC55PS0xZTR9LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5vbk1vdXNlVXA9ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eSYmdGhpcy5yZWJ1aWxkSW50ZXJhY3RpdmVHcmFwaCgpLHRoaXMubW91c2Uub3JpZ2luYWxFdmVudD1hfHx3aW5kb3cuZXZlbnQ7XG5mb3IodmFyIGI9dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLmxlbmd0aCxjPSExLGQ9MDtiPmQ7ZCsrKXt2YXIgZT10aGlzLmludGVyYWN0aXZlSXRlbXNbZF07ZS5fX2hpdD10aGlzLmhpdFRlc3QoZSx0aGlzLm1vdXNlKSxlLl9faGl0JiYhYz8oZS5tb3VzZXVwJiZlLm1vdXNldXAodGhpcy5tb3VzZSksZS5fX2lzRG93biYmZS5jbGljayYmZS5jbGljayh0aGlzLm1vdXNlKSxlLmludGVyYWN0aXZlQ2hpbGRyZW58fChjPSEwKSk6ZS5fX2lzRG93biYmZS5tb3VzZXVwb3V0c2lkZSYmZS5tb3VzZXVwb3V0c2lkZSh0aGlzLm1vdXNlKSxlLl9faXNEb3duPSExfX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmhpdFRlc3Q9ZnVuY3Rpb24oYSxjKXt2YXIgZD1jLmdsb2JhbDtpZighYS53b3JsZFZpc2libGUpcmV0dXJuITE7dmFyIGU9YSBpbnN0YW5jZW9mIGIuU3ByaXRlLGY9YS53b3JsZFRyYW5zZm9ybSxnPWYuYSxoPWYuYixpPWYudHgsaj1mLmMsaz1mLmQsbD1mLnR5LG09MS8oZyprK2gqLWopLG49ayptKmQueCstaCptKmQueSsobCpoLWkqaykqbSxvPWcqbSpkLnkrLWoqbSpkLngrKC1sKmcraSpqKSptO2lmKGMudGFyZ2V0PWEsYS5oaXRBcmVhJiZhLmhpdEFyZWEuY29udGFpbnMpcmV0dXJuIGEuaGl0QXJlYS5jb250YWlucyhuLG8pPyhjLnRhcmdldD1hLCEwKTohMTtpZihlKXt2YXIgcCxxPWEudGV4dHVyZS5mcmFtZS53aWR0aCxyPWEudGV4dHVyZS5mcmFtZS5oZWlnaHQscz0tcSphLmFuY2hvci54O2lmKG4+cyYmcytxPm4mJihwPS1yKmEuYW5jaG9yLnksbz5wJiZwK3I+bykpcmV0dXJuIGMudGFyZ2V0PWEsITB9Zm9yKHZhciB0PWEuY2hpbGRyZW4ubGVuZ3RoLHU9MDt0PnU7dSsrKXt2YXIgdj1hLmNoaWxkcmVuW3VdLHc9dGhpcy5oaXRUZXN0KHYsYyk7aWYodylyZXR1cm4gYy50YXJnZXQ9YSwhMH1yZXR1cm4hMX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLm9uVG91Y2hNb3ZlPWZ1bmN0aW9uKGEpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKTt2YXIgYixjPXRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGQ9YS5jaGFuZ2VkVG91Y2hlcyxlPTA7Zm9yKGU9MDtlPGQubGVuZ3RoO2UrKyl7dmFyIGY9ZFtlXTtiPXRoaXMudG91Y2hzW2YuaWRlbnRpZmllcl0sYi5vcmlnaW5hbEV2ZW50PWF8fHdpbmRvdy5ldmVudCxiLmdsb2JhbC54PShmLmNsaWVudFgtYy5sZWZ0KSoodGhpcy50YXJnZXQud2lkdGgvYy53aWR0aCksYi5nbG9iYWwueT0oZi5jbGllbnRZLWMudG9wKSoodGhpcy50YXJnZXQuaGVpZ2h0L2MuaGVpZ2h0KSxuYXZpZ2F0b3IuaXNDb2Nvb25KUyYmKGIuZ2xvYmFsLng9Zi5jbGllbnRYLGIuZ2xvYmFsLnk9Zi5jbGllbnRZKTtmb3IodmFyIGc9MDtnPHRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGg7ZysrKXt2YXIgaD10aGlzLmludGVyYWN0aXZlSXRlbXNbZ107aC50b3VjaG1vdmUmJmguX190b3VjaERhdGEmJmguX190b3VjaERhdGFbZi5pZGVudGlmaWVyXSYmaC50b3VjaG1vdmUoYil9fX0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLm9uVG91Y2hTdGFydD1mdW5jdGlvbihhKXt0aGlzLmRpcnR5JiZ0aGlzLnJlYnVpbGRJbnRlcmFjdGl2ZUdyYXBoKCk7dmFyIGM9dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7Yi5BVVRPX1BSRVZFTlRfREVGQVVMVCYmYS5wcmV2ZW50RGVmYXVsdCgpO2Zvcih2YXIgZD1hLmNoYW5nZWRUb3VjaGVzLGU9MDtlPGQubGVuZ3RoO2UrKyl7dmFyIGY9ZFtlXSxnPXRoaXMucG9vbC5wb3AoKTtnfHwoZz1uZXcgYi5JbnRlcmFjdGlvbkRhdGEpLGcub3JpZ2luYWxFdmVudD1hfHx3aW5kb3cuZXZlbnQsdGhpcy50b3VjaHNbZi5pZGVudGlmaWVyXT1nLGcuZ2xvYmFsLng9KGYuY2xpZW50WC1jLmxlZnQpKih0aGlzLnRhcmdldC53aWR0aC9jLndpZHRoKSxnLmdsb2JhbC55PShmLmNsaWVudFktYy50b3ApKih0aGlzLnRhcmdldC5oZWlnaHQvYy5oZWlnaHQpLG5hdmlnYXRvci5pc0NvY29vbkpTJiYoZy5nbG9iYWwueD1mLmNsaWVudFgsZy5nbG9iYWwueT1mLmNsaWVudFkpO2Zvcih2YXIgaD10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGk9MDtoPmk7aSsrKXt2YXIgaj10aGlzLmludGVyYWN0aXZlSXRlbXNbaV07aWYoKGoudG91Y2hzdGFydHx8ai50YXApJiYoai5fX2hpdD10aGlzLmhpdFRlc3QoaixnKSxqLl9faGl0JiYoai50b3VjaHN0YXJ0JiZqLnRvdWNoc3RhcnQoZyksai5fX2lzRG93bj0hMCxqLl9fdG91Y2hEYXRhPWouX190b3VjaERhdGF8fHt9LGouX190b3VjaERhdGFbZi5pZGVudGlmaWVyXT1nLCFqLmludGVyYWN0aXZlQ2hpbGRyZW4pKSlicmVha319fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Ub3VjaEVuZD1mdW5jdGlvbihhKXt0aGlzLmRpcnR5JiZ0aGlzLnJlYnVpbGRJbnRlcmFjdGl2ZUdyYXBoKCk7Zm9yKHZhciBiPXRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLGM9YS5jaGFuZ2VkVG91Y2hlcyxkPTA7ZDxjLmxlbmd0aDtkKyspe3ZhciBlPWNbZF0sZj10aGlzLnRvdWNoc1tlLmlkZW50aWZpZXJdLGc9ITE7Zi5nbG9iYWwueD0oZS5jbGllbnRYLWIubGVmdCkqKHRoaXMudGFyZ2V0LndpZHRoL2Iud2lkdGgpLGYuZ2xvYmFsLnk9KGUuY2xpZW50WS1iLnRvcCkqKHRoaXMudGFyZ2V0LmhlaWdodC9iLmhlaWdodCksbmF2aWdhdG9yLmlzQ29jb29uSlMmJihmLmdsb2JhbC54PWUuY2xpZW50WCxmLmdsb2JhbC55PWUuY2xpZW50WSk7Zm9yKHZhciBoPXRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGgsaT0wO2g+aTtpKyspe3ZhciBqPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tpXTtqLl9fdG91Y2hEYXRhJiZqLl9fdG91Y2hEYXRhW2UuaWRlbnRpZmllcl0mJihqLl9faGl0PXRoaXMuaGl0VGVzdChqLGouX190b3VjaERhdGFbZS5pZGVudGlmaWVyXSksZi5vcmlnaW5hbEV2ZW50PWF8fHdpbmRvdy5ldmVudCwoai50b3VjaGVuZHx8ai50YXApJiYoai5fX2hpdCYmIWc/KGoudG91Y2hlbmQmJmoudG91Y2hlbmQoZiksai5fX2lzRG93biYmai50YXAmJmoudGFwKGYpLGouaW50ZXJhY3RpdmVDaGlsZHJlbnx8KGc9ITApKTpqLl9faXNEb3duJiZqLnRvdWNoZW5kb3V0c2lkZSYmai50b3VjaGVuZG91dHNpZGUoZiksai5fX2lzRG93bj0hMSksai5fX3RvdWNoRGF0YVtlLmlkZW50aWZpZXJdPW51bGwpfXRoaXMucG9vbC5wdXNoKGYpLHRoaXMudG91Y2hzW2UuaWRlbnRpZmllcl09bnVsbH19LGIuU3RhZ2U9ZnVuY3Rpb24oYSl7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyksdGhpcy53b3JsZFRyYW5zZm9ybT1uZXcgYi5NYXRyaXgsdGhpcy5pbnRlcmFjdGl2ZT0hMCx0aGlzLmludGVyYWN0aW9uTWFuYWdlcj1uZXcgYi5JbnRlcmFjdGlvbk1hbmFnZXIodGhpcyksdGhpcy5kaXJ0eT0hMCx0aGlzLnN0YWdlPXRoaXMsdGhpcy5zdGFnZS5oaXRBcmVhPW5ldyBiLlJlY3RhbmdsZSgwLDAsMWU1LDFlNSksdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoYSl9LGIuU3RhZ2UucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSksYi5TdGFnZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5TdGFnZSxiLlN0YWdlLnByb3RvdHlwZS5zZXRJbnRlcmFjdGlvbkRlbGVnYXRlPWZ1bmN0aW9uKGEpe3RoaXMuaW50ZXJhY3Rpb25NYW5hZ2VyLnNldFRhcmdldERvbUVsZW1lbnQoYSl9LGIuU3RhZ2UucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMud29ybGRBbHBoYT0xO2Zvcih2YXIgYT0wLGI9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yj5hO2ErKyl0aGlzLmNoaWxkcmVuW2FdLnVwZGF0ZVRyYW5zZm9ybSgpO3RoaXMuZGlydHkmJih0aGlzLmRpcnR5PSExLHRoaXMuaW50ZXJhY3Rpb25NYW5hZ2VyLmRpcnR5PSEwKSx0aGlzLmludGVyYWN0aXZlJiZ0aGlzLmludGVyYWN0aW9uTWFuYWdlci51cGRhdGUoKX0sYi5TdGFnZS5wcm90b3R5cGUuc2V0QmFja2dyb3VuZENvbG9yPWZ1bmN0aW9uKGEpe3RoaXMuYmFja2dyb3VuZENvbG9yPWF8fDAsdGhpcy5iYWNrZ3JvdW5kQ29sb3JTcGxpdD1iLmhleDJyZ2IodGhpcy5iYWNrZ3JvdW5kQ29sb3IpO3ZhciBjPXRoaXMuYmFja2dyb3VuZENvbG9yLnRvU3RyaW5nKDE2KTtjPVwiMDAwMDAwXCIuc3Vic3RyKDAsNi1jLmxlbmd0aCkrYyx0aGlzLmJhY2tncm91bmRDb2xvclN0cmluZz1cIiNcIitjfSxiLlN0YWdlLnByb3RvdHlwZS5nZXRNb3VzZVBvc2l0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaW50ZXJhY3Rpb25NYW5hZ2VyLm1vdXNlLmdsb2JhbH07Zm9yKHZhciBjPTAsZD1bXCJtc1wiLFwibW96XCIsXCJ3ZWJraXRcIixcIm9cIl0sZT0wO2U8ZC5sZW5ndGgmJiF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOysrZSl3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lPXdpbmRvd1tkW2VdK1wiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdLHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZT13aW5kb3dbZFtlXStcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdfHx3aW5kb3dbZFtlXStcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTt3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZT1mdW5jdGlvbihhKXt2YXIgYj0obmV3IERhdGUpLmdldFRpbWUoKSxkPU1hdGgubWF4KDAsMTYtKGItYykpLGU9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXthKGIrZCl9LGQpO3JldHVybiBjPWIrZCxlfSksd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lfHwod2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lPWZ1bmN0aW9uKGEpe2NsZWFyVGltZW91dChhKX0pLHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lPXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsYi5oZXgycmdiPWZ1bmN0aW9uKGEpe3JldHVyblsoYT4+MTYmMjU1KS8yNTUsKGE+PjgmMjU1KS8yNTUsKDI1NSZhKS8yNTVdfSxiLnJnYjJoZXg9ZnVuY3Rpb24oYSl7cmV0dXJuKDI1NSphWzBdPDwxNikrKDI1NSphWzFdPDw4KSsyNTUqYVsyXX0sXCJmdW5jdGlvblwiIT10eXBlb2YgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmJihGdW5jdGlvbi5wcm90b3R5cGUuYmluZD1mdW5jdGlvbigpe3ZhciBhPUFycmF5LnByb3RvdHlwZS5zbGljZTtyZXR1cm4gZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe3ZhciBmPWUuY29uY2F0KGEuY2FsbChhcmd1bWVudHMpKTtkLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBjP3RoaXM6YixmKX12YXIgZD10aGlzLGU9YS5jYWxsKGFyZ3VtZW50cywxKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBkKXRocm93IG5ldyBUeXBlRXJyb3I7cmV0dXJuIGMucHJvdG90eXBlPWZ1bmN0aW9uIGYoYSl7cmV0dXJuIGEmJihmLnByb3RvdHlwZT1hKSx0aGlzIGluc3RhbmNlb2YgZj92b2lkIDA6bmV3IGZ9KGQucHJvdG90eXBlKSxjfX0oKSksYi5BamF4UmVxdWVzdD1mdW5jdGlvbigpe3ZhciBhPVtcIk1zeG1sMi5YTUxIVFRQLjYuMFwiLFwiTXN4bWwyLlhNTEhUVFAuMy4wXCIsXCJNaWNyb3NvZnQuWE1MSFRUUFwiXTtpZighd2luZG93LkFjdGl2ZVhPYmplY3QpcmV0dXJuIHdpbmRvdy5YTUxIdHRwUmVxdWVzdD9uZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0OiExO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXRyeXtyZXR1cm4gbmV3IHdpbmRvdy5BY3RpdmVYT2JqZWN0KGFbYl0pfWNhdGNoKGMpe319LGIuY2FuVXNlTmV3Q2FudmFzQmxlbmRNb2Rlcz1mdW5jdGlvbigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7YS53aWR0aD0xLGEuaGVpZ2h0PTE7dmFyIGI9YS5nZXRDb250ZXh0KFwiMmRcIik7cmV0dXJuIGIuZmlsbFN0eWxlPVwiIzAwMFwiLGIuZmlsbFJlY3QoMCwwLDEsMSksYi5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249XCJtdWx0aXBseVwiLGIuZmlsbFN0eWxlPVwiI2ZmZlwiLGIuZmlsbFJlY3QoMCwwLDEsMSksMD09PWIuZ2V0SW1hZ2VEYXRhKDAsMCwxLDEpLmRhdGFbMF19LGIuZ2V0TmV4dFBvd2VyT2ZUd289ZnVuY3Rpb24oYSl7aWYoYT4wJiYwPT09KGEmYS0xKSlyZXR1cm4gYTtmb3IodmFyIGI9MTthPmI7KWI8PD0xO3JldHVybiBifSxiLkV2ZW50VGFyZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9e307dGhpcy5hZGRFdmVudExpc3RlbmVyPXRoaXMub249ZnVuY3Rpb24oYixjKXt2b2lkIDA9PT1hW2JdJiYoYVtiXT1bXSksLTE9PT1hW2JdLmluZGV4T2YoYykmJmFbYl0udW5zaGlmdChjKX0sdGhpcy5kaXNwYXRjaEV2ZW50PXRoaXMuZW1pdD1mdW5jdGlvbihiKXtpZihhW2IudHlwZV0mJmFbYi50eXBlXS5sZW5ndGgpZm9yKHZhciBjPWFbYi50eXBlXS5sZW5ndGgtMTtjPj0wO2MtLSlhW2IudHlwZV1bY10oYil9LHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcj10aGlzLm9mZj1mdW5jdGlvbihiLGMpe2lmKHZvaWQgMCE9PWFbYl0pe3ZhciBkPWFbYl0uaW5kZXhPZihjKTstMSE9PWQmJmFbYl0uc3BsaWNlKGQsMSl9fSx0aGlzLnJlbW92ZUFsbEV2ZW50TGlzdGVuZXJzPWZ1bmN0aW9uKGIpe3ZhciBjPWFbYl07YyYmKGMubGVuZ3RoPTApfX0sYi5hdXRvRGV0ZWN0UmVuZGVyZXI9ZnVuY3Rpb24oYSxjLGQsZSxmKXthfHwoYT04MDApLGN8fChjPTYwMCk7dmFyIGc9ZnVuY3Rpb24oKXt0cnl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtyZXR1cm4hIXdpbmRvdy5XZWJHTFJlbmRlcmluZ0NvbnRleHQmJihhLmdldENvbnRleHQoXCJ3ZWJnbFwiKXx8YS5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpKX1jYXRjaChiKXtyZXR1cm4hMX19KCk7cmV0dXJuIGc/bmV3IGIuV2ViR0xSZW5kZXJlcihhLGMsZCxlLGYpOm5ldyBiLkNhbnZhc1JlbmRlcmVyKGEsYyxkLGUpfSxiLmF1dG9EZXRlY3RSZWNvbW1lbmRlZFJlbmRlcmVyPWZ1bmN0aW9uKGEsYyxkLGUsZil7YXx8KGE9ODAwKSxjfHwoYz02MDApO3ZhciBnPWZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cmV0dXJuISF3aW5kb3cuV2ViR0xSZW5kZXJpbmdDb250ZXh0JiYoYS5nZXRDb250ZXh0KFwid2ViZ2xcIil8fGEuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKSl9Y2F0Y2goYil7cmV0dXJuITF9fSgpLGg9L0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO3JldHVybiBnJiYhaD9uZXcgYi5XZWJHTFJlbmRlcmVyKGEsYyxkLGUsZik6bmV3IGIuQ2FudmFzUmVuZGVyZXIoYSxjLGQsZSl9LGIuUG9seUs9e30sYi5Qb2x5Sy5Ucmlhbmd1bGF0ZT1mdW5jdGlvbihhKXt2YXIgYz0hMCxkPWEubGVuZ3RoPj4xO2lmKDM+ZClyZXR1cm5bXTtmb3IodmFyIGU9W10sZj1bXSxnPTA7ZD5nO2crKylmLnB1c2goZyk7Zz0wO2Zvcih2YXIgaD1kO2g+Mzspe3ZhciBpPWZbKGcrMCklaF0saj1mWyhnKzEpJWhdLGs9ZlsoZysyKSVoXSxsPWFbMippXSxtPWFbMippKzFdLG49YVsyKmpdLG89YVsyKmorMV0scD1hWzIqa10scT1hWzIqaysxXSxyPSExO2lmKGIuUG9seUsuX2NvbnZleChsLG0sbixvLHAscSxjKSl7cj0hMDtmb3IodmFyIHM9MDtoPnM7cysrKXt2YXIgdD1mW3NdO2lmKHQhPT1pJiZ0IT09aiYmdCE9PWsmJmIuUG9seUsuX1BvaW50SW5UcmlhbmdsZShhWzIqdF0sYVsyKnQrMV0sbCxtLG4sbyxwLHEpKXtyPSExO2JyZWFrfX19aWYocillLnB1c2goaSxqLGspLGYuc3BsaWNlKChnKzEpJWgsMSksaC0tLGc9MDtlbHNlIGlmKGcrKz4zKmgpe2lmKCFjKXJldHVybiB3aW5kb3cuY29uc29sZS5sb2coXCJQSVhJIFdhcm5pbmc6IHNoYXBlIHRvbyBjb21wbGV4IHRvIGZpbGxcIiksW107Zm9yKGU9W10sZj1bXSxnPTA7ZD5nO2crKylmLnB1c2goZyk7Zz0wLGg9ZCxjPSExfX1yZXR1cm4gZS5wdXNoKGZbMF0sZlsxXSxmWzJdKSxlfSxiLlBvbHlLLl9Qb2ludEluVHJpYW5nbGU9ZnVuY3Rpb24oYSxiLGMsZCxlLGYsZyxoKXt2YXIgaT1nLWMsaj1oLWQsaz1lLWMsbD1mLWQsbT1hLWMsbj1iLWQsbz1pKmkraipqLHA9aSprK2oqbCxxPWkqbStqKm4scj1rKmsrbCpsLHM9ayptK2wqbix0PTEvKG8qci1wKnApLHU9KHIqcS1wKnMpKnQsdj0obypzLXAqcSkqdDtyZXR1cm4gdT49MCYmdj49MCYmMT51K3Z9LGIuUG9seUsuX2NvbnZleD1mdW5jdGlvbihhLGIsYyxkLGUsZixnKXtyZXR1cm4oYi1kKSooZS1jKSsoYy1hKSooZi1kKT49MD09PWd9LGIuaW5pdERlZmF1bHRTaGFkZXJzPWZ1bmN0aW9uKCl7fSxiLkNvbXBpbGVWZXJ0ZXhTaGFkZXI9ZnVuY3Rpb24oYSxjKXtyZXR1cm4gYi5fQ29tcGlsZVNoYWRlcihhLGMsYS5WRVJURVhfU0hBREVSKX0sYi5Db21waWxlRnJhZ21lbnRTaGFkZXI9ZnVuY3Rpb24oYSxjKXtyZXR1cm4gYi5fQ29tcGlsZVNoYWRlcihhLGMsYS5GUkFHTUVOVF9TSEFERVIpfSxiLl9Db21waWxlU2hhZGVyPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1iLmpvaW4oXCJcXG5cIiksZT1hLmNyZWF0ZVNoYWRlcihjKTtyZXR1cm4gYS5zaGFkZXJTb3VyY2UoZSxkKSxhLmNvbXBpbGVTaGFkZXIoZSksYS5nZXRTaGFkZXJQYXJhbWV0ZXIoZSxhLkNPTVBJTEVfU1RBVFVTKT9lOih3aW5kb3cuY29uc29sZS5sb2coYS5nZXRTaGFkZXJJbmZvTG9nKGUpKSxudWxsKX0sYi5jb21waWxlUHJvZ3JhbT1mdW5jdGlvbihhLGMsZCl7dmFyIGU9Yi5Db21waWxlRnJhZ21lbnRTaGFkZXIoYSxkKSxmPWIuQ29tcGlsZVZlcnRleFNoYWRlcihhLGMpLGc9YS5jcmVhdGVQcm9ncmFtKCk7cmV0dXJuIGEuYXR0YWNoU2hhZGVyKGcsZiksYS5hdHRhY2hTaGFkZXIoZyxlKSxhLmxpbmtQcm9ncmFtKGcpLGEuZ2V0UHJvZ3JhbVBhcmFtZXRlcihnLGEuTElOS19TVEFUVVMpfHx3aW5kb3cuY29uc29sZS5sb2coXCJDb3VsZCBub3QgaW5pdGlhbGlzZSBzaGFkZXJzXCIpLGd9LGIuUGl4aVNoYWRlcj1mdW5jdGlvbihhKXt0aGlzLl9VSUQ9Yi5fVUlEKyssdGhpcy5nbD1hLHRoaXMucHJvZ3JhbT1udWxsLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIGxvd3AgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogdkNvbG9yIDtcIixcIn1cIl0sdGhpcy50ZXh0dXJlQ291bnQ9MCx0aGlzLmF0dHJpYnV0ZXM9W10sdGhpcy5pbml0KCl9LGIuUGl4aVNoYWRlci5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2wsYz1iLmNvbXBpbGVQcm9ncmFtKGEsdGhpcy52ZXJ0ZXhTcmN8fGIuUGl4aVNoYWRlci5kZWZhdWx0VmVydGV4U3JjLHRoaXMuZnJhZ21lbnRTcmMpO2EudXNlUHJvZ3JhbShjKSx0aGlzLnVTYW1wbGVyPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJ1U2FtcGxlclwiKSx0aGlzLnByb2plY3Rpb25WZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInByb2plY3Rpb25WZWN0b3JcIiksdGhpcy5vZmZzZXRWZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcIm9mZnNldFZlY3RvclwiKSx0aGlzLmRpbWVuc2lvbnM9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcImRpbWVuc2lvbnNcIiksdGhpcy5hVmVydGV4UG9zaXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVZlcnRleFBvc2l0aW9uXCIpLHRoaXMuYVRleHR1cmVDb29yZD1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVGV4dHVyZUNvb3JkXCIpLHRoaXMuY29sb3JBdHRyaWJ1dGU9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYUNvbG9yXCIpLC0xPT09dGhpcy5jb2xvckF0dHJpYnV0ZSYmKHRoaXMuY29sb3JBdHRyaWJ1dGU9MiksdGhpcy5hdHRyaWJ1dGVzPVt0aGlzLmFWZXJ0ZXhQb3NpdGlvbix0aGlzLmFUZXh0dXJlQ29vcmQsdGhpcy5jb2xvckF0dHJpYnV0ZV07Zm9yKHZhciBkIGluIHRoaXMudW5pZm9ybXMpdGhpcy51bmlmb3Jtc1tkXS51bmlmb3JtTG9jYXRpb249YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxkKTt0aGlzLmluaXRVbmlmb3JtcygpLHRoaXMucHJvZ3JhbT1jfSxiLlBpeGlTaGFkZXIucHJvdG90eXBlLmluaXRVbmlmb3Jtcz1mdW5jdGlvbigpe3RoaXMudGV4dHVyZUNvdW50PTE7dmFyIGEsYj10aGlzLmdsO2Zvcih2YXIgYyBpbiB0aGlzLnVuaWZvcm1zKXthPXRoaXMudW5pZm9ybXNbY107dmFyIGQ9YS50eXBlO1wic2FtcGxlcjJEXCI9PT1kPyhhLl9pbml0PSExLG51bGwhPT1hLnZhbHVlJiZ0aGlzLmluaXRTYW1wbGVyMkQoYSkpOlwibWF0MlwiPT09ZHx8XCJtYXQzXCI9PT1kfHxcIm1hdDRcIj09PWQ/KGEuZ2xNYXRyaXg9ITAsYS5nbFZhbHVlTGVuZ3RoPTEsXCJtYXQyXCI9PT1kP2EuZ2xGdW5jPWIudW5pZm9ybU1hdHJpeDJmdjpcIm1hdDNcIj09PWQ/YS5nbEZ1bmM9Yi51bmlmb3JtTWF0cml4M2Z2OlwibWF0NFwiPT09ZCYmKGEuZ2xGdW5jPWIudW5pZm9ybU1hdHJpeDRmdikpOihhLmdsRnVuYz1iW1widW5pZm9ybVwiK2RdLGEuZ2xWYWx1ZUxlbmd0aD1cIjJmXCI9PT1kfHxcIjJpXCI9PT1kPzI6XCIzZlwiPT09ZHx8XCIzaVwiPT09ZD8zOlwiNGZcIj09PWR8fFwiNGlcIj09PWQ/NDoxKX19LGIuUGl4aVNoYWRlci5wcm90b3R5cGUuaW5pdFNhbXBsZXIyRD1mdW5jdGlvbihhKXtpZihhLnZhbHVlJiZhLnZhbHVlLmJhc2VUZXh0dXJlJiZhLnZhbHVlLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCl7dmFyIGI9dGhpcy5nbDtpZihiLmFjdGl2ZVRleHR1cmUoYltcIlRFWFRVUkVcIit0aGlzLnRleHR1cmVDb3VudF0pLGIuYmluZFRleHR1cmUoYi5URVhUVVJFXzJELGEudmFsdWUuYmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbYi5pZF0pLGEudGV4dHVyZURhdGEpe3ZhciBjPWEudGV4dHVyZURhdGEsZD1jLm1hZ0ZpbHRlcj9jLm1hZ0ZpbHRlcjpiLkxJTkVBUixlPWMubWluRmlsdGVyP2MubWluRmlsdGVyOmIuTElORUFSLGY9Yy53cmFwUz9jLndyYXBTOmIuQ0xBTVBfVE9fRURHRSxnPWMud3JhcFQ/Yy53cmFwVDpiLkNMQU1QX1RPX0VER0UsaD1jLmx1bWluYW5jZT9iLkxVTUlOQU5DRTpiLlJHQkE7aWYoYy5yZXBlYXQmJihmPWIuUkVQRUFULGc9Yi5SRVBFQVQpLGIucGl4ZWxTdG9yZWkoYi5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCEhYy5mbGlwWSksYy53aWR0aCl7dmFyIGk9Yy53aWR0aD9jLndpZHRoOjUxMixqPWMuaGVpZ2h0P2MuaGVpZ2h0OjIsaz1jLmJvcmRlcj9jLmJvcmRlcjowO2IudGV4SW1hZ2UyRChiLlRFWFRVUkVfMkQsMCxoLGksaixrLGgsYi5VTlNJR05FRF9CWVRFLG51bGwpfWVsc2UgYi50ZXhJbWFnZTJEKGIuVEVYVFVSRV8yRCwwLGgsYi5SR0JBLGIuVU5TSUdORURfQllURSxhLnZhbHVlLmJhc2VUZXh0dXJlLnNvdXJjZSk7Yi50ZXhQYXJhbWV0ZXJpKGIuVEVYVFVSRV8yRCxiLlRFWFRVUkVfTUFHX0ZJTFRFUixkKSxiLnRleFBhcmFtZXRlcmkoYi5URVhUVVJFXzJELGIuVEVYVFVSRV9NSU5fRklMVEVSLGUpLGIudGV4UGFyYW1ldGVyaShiLlRFWFRVUkVfMkQsYi5URVhUVVJFX1dSQVBfUyxmKSxiLnRleFBhcmFtZXRlcmkoYi5URVhUVVJFXzJELGIuVEVYVFVSRV9XUkFQX1QsZyl9Yi51bmlmb3JtMWkoYS51bmlmb3JtTG9jYXRpb24sdGhpcy50ZXh0dXJlQ291bnQpLGEuX2luaXQ9ITAsdGhpcy50ZXh0dXJlQ291bnQrK319LGIuUGl4aVNoYWRlci5wcm90b3R5cGUuc3luY1VuaWZvcm1zPWZ1bmN0aW9uKCl7dGhpcy50ZXh0dXJlQ291bnQ9MTt2YXIgYSxjPXRoaXMuZ2w7Zm9yKHZhciBkIGluIHRoaXMudW5pZm9ybXMpYT10aGlzLnVuaWZvcm1zW2RdLDE9PT1hLmdsVmFsdWVMZW5ndGg/YS5nbE1hdHJpeD09PSEwP2EuZ2xGdW5jLmNhbGwoYyxhLnVuaWZvcm1Mb2NhdGlvbixhLnRyYW5zcG9zZSxhLnZhbHVlKTphLmdsRnVuYy5jYWxsKGMsYS51bmlmb3JtTG9jYXRpb24sYS52YWx1ZSk6Mj09PWEuZ2xWYWx1ZUxlbmd0aD9hLmdsRnVuYy5jYWxsKGMsYS51bmlmb3JtTG9jYXRpb24sYS52YWx1ZS54LGEudmFsdWUueSk6Mz09PWEuZ2xWYWx1ZUxlbmd0aD9hLmdsRnVuYy5jYWxsKGMsYS51bmlmb3JtTG9jYXRpb24sYS52YWx1ZS54LGEudmFsdWUueSxhLnZhbHVlLnopOjQ9PT1hLmdsVmFsdWVMZW5ndGg/YS5nbEZ1bmMuY2FsbChjLGEudW5pZm9ybUxvY2F0aW9uLGEudmFsdWUueCxhLnZhbHVlLnksYS52YWx1ZS56LGEudmFsdWUudyk6XCJzYW1wbGVyMkRcIj09PWEudHlwZSYmKGEuX2luaXQ/KGMuYWN0aXZlVGV4dHVyZShjW1wiVEVYVFVSRVwiK3RoaXMudGV4dHVyZUNvdW50XSksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsYS52YWx1ZS5iYXNlVGV4dHVyZS5fZ2xUZXh0dXJlc1tjLmlkXXx8Yi5jcmVhdGVXZWJHTFRleHR1cmUoYS52YWx1ZS5iYXNlVGV4dHVyZSxjKSksYy51bmlmb3JtMWkoYS51bmlmb3JtTG9jYXRpb24sdGhpcy50ZXh0dXJlQ291bnQpLHRoaXMudGV4dHVyZUNvdW50KyspOnRoaXMuaW5pdFNhbXBsZXIyRChhKSl9LGIuUGl4aVNoYWRlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLnByb2dyYW0pLHRoaXMudW5pZm9ybXM9bnVsbCx0aGlzLmdsPW51bGwsdGhpcy5hdHRyaWJ1dGVzPW51bGx9LGIuUGl4aVNoYWRlci5kZWZhdWx0VmVydGV4U3JjPVtcImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcIixcImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XCIsXCJhdHRyaWJ1dGUgdmVjMiBhQ29sb3I7XCIsXCJ1bmlmb3JtIHZlYzIgcHJvamVjdGlvblZlY3RvcjtcIixcInVuaWZvcm0gdmVjMiBvZmZzZXRWZWN0b3I7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJjb25zdCB2ZWMyIGNlbnRlciA9IHZlYzIoLTEuMCwgMS4wKTtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9Qb3NpdGlvbiA9IHZlYzQoICgoYVZlcnRleFBvc2l0aW9uICsgb2Zmc2V0VmVjdG9yKSAvIHByb2plY3Rpb25WZWN0b3IpICsgY2VudGVyICwgMC4wLCAxLjApO1wiLFwiICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XCIsXCIgICB2ZWMzIGNvbG9yID0gbW9kKHZlYzMoYUNvbG9yLnkvNjU1MzYuMCwgYUNvbG9yLnkvMjU2LjAsIGFDb2xvci55KSwgMjU2LjApIC8gMjU2LjA7XCIsXCIgICB2Q29sb3IgPSB2ZWM0KGNvbG9yICogYUNvbG9yLngsIGFDb2xvci54KTtcIixcIn1cIl0sYi5QaXhpRmFzdFNoYWRlcj1mdW5jdGlvbihhKXt0aGlzLl9VSUQ9Yi5fVUlEKyssdGhpcy5nbD1hLHRoaXMucHJvZ3JhbT1udWxsLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIGxvd3AgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgZmxvYXQgdkNvbG9yO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSAqIHZDb2xvciA7XCIsXCJ9XCJdLHRoaXMudmVydGV4U3JjPVtcImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcIixcImF0dHJpYnV0ZSB2ZWMyIGFQb3NpdGlvbkNvb3JkO1wiLFwiYXR0cmlidXRlIHZlYzIgYVNjYWxlO1wiLFwiYXR0cmlidXRlIGZsb2F0IGFSb3RhdGlvbjtcIixcImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XCIsXCJhdHRyaWJ1dGUgZmxvYXQgYUNvbG9yO1wiLFwidW5pZm9ybSB2ZWMyIHByb2plY3Rpb25WZWN0b3I7XCIsXCJ1bmlmb3JtIHZlYzIgb2Zmc2V0VmVjdG9yO1wiLFwidW5pZm9ybSBtYXQzIHVNYXRyaXg7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgZmxvYXQgdkNvbG9yO1wiLFwiY29uc3QgdmVjMiBjZW50ZXIgPSB2ZWMyKC0xLjAsIDEuMCk7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMiB2O1wiLFwiICAgdmVjMiBzdiA9IGFWZXJ0ZXhQb3NpdGlvbiAqIGFTY2FsZTtcIixcIiAgIHYueCA9IChzdi54KSAqIGNvcyhhUm90YXRpb24pIC0gKHN2LnkpICogc2luKGFSb3RhdGlvbik7XCIsXCIgICB2LnkgPSAoc3YueCkgKiBzaW4oYVJvdGF0aW9uKSArIChzdi55KSAqIGNvcyhhUm90YXRpb24pO1wiLFwiICAgdiA9ICggdU1hdHJpeCAqIHZlYzModiArIGFQb3NpdGlvbkNvb3JkICwgMS4wKSApLnh5IDtcIixcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNCggKCB2IC8gcHJvamVjdGlvblZlY3RvcikgKyBjZW50ZXIgLCAwLjAsIDEuMCk7XCIsXCIgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcIixcIiAgIHZDb2xvciA9IGFDb2xvcjtcIixcIn1cIl0sdGhpcy50ZXh0dXJlQ291bnQ9MCx0aGlzLmluaXQoKX0sYi5QaXhpRmFzdFNoYWRlci5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2wsYz1iLmNvbXBpbGVQcm9ncmFtKGEsdGhpcy52ZXJ0ZXhTcmMsdGhpcy5mcmFnbWVudFNyYyk7YS51c2VQcm9ncmFtKGMpLHRoaXMudVNhbXBsZXI9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInVTYW1wbGVyXCIpLHRoaXMucHJvamVjdGlvblZlY3Rvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwicHJvamVjdGlvblZlY3RvclwiKSx0aGlzLm9mZnNldFZlY3Rvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwib2Zmc2V0VmVjdG9yXCIpLHRoaXMuZGltZW5zaW9ucz1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwiZGltZW5zaW9uc1wiKSx0aGlzLnVNYXRyaXg9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInVNYXRyaXhcIiksdGhpcy5hVmVydGV4UG9zaXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVZlcnRleFBvc2l0aW9uXCIpLHRoaXMuYVBvc2l0aW9uQ29vcmQ9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVBvc2l0aW9uQ29vcmRcIiksdGhpcy5hU2NhbGU9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVNjYWxlXCIpLHRoaXMuYVJvdGF0aW9uPWEuZ2V0QXR0cmliTG9jYXRpb24oYyxcImFSb3RhdGlvblwiKSx0aGlzLmFUZXh0dXJlQ29vcmQ9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVRleHR1cmVDb29yZFwiKSx0aGlzLmNvbG9yQXR0cmlidXRlPWEuZ2V0QXR0cmliTG9jYXRpb24oYyxcImFDb2xvclwiKSwtMT09PXRoaXMuY29sb3JBdHRyaWJ1dGUmJih0aGlzLmNvbG9yQXR0cmlidXRlPTIpLHRoaXMuYXR0cmlidXRlcz1bdGhpcy5hVmVydGV4UG9zaXRpb24sdGhpcy5hUG9zaXRpb25Db29yZCx0aGlzLmFTY2FsZSx0aGlzLmFSb3RhdGlvbix0aGlzLmFUZXh0dXJlQ29vcmQsdGhpcy5jb2xvckF0dHJpYnV0ZV0sdGhpcy5wcm9ncmFtPWN9LGIuUGl4aUZhc3RTaGFkZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmdsLmRlbGV0ZVByb2dyYW0odGhpcy5wcm9ncmFtKSx0aGlzLnVuaWZvcm1zPW51bGwsdGhpcy5nbD1udWxsLHRoaXMuYXR0cmlidXRlcz1udWxsfSxiLlN0cmlwU2hhZGVyPWZ1bmN0aW9uKGEpe3RoaXMuX1VJRD1iLl9VSUQrKyx0aGlzLmdsPWEsdGhpcy5wcm9ncmFtPW51bGwsdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidW5pZm9ybSBmbG9hdCBhbHBoYTtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSkpO1wiLFwifVwiXSx0aGlzLnZlcnRleFNyYz1bXCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XCIsXCJhdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1wiLFwidW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1wiLFwidW5pZm9ybSB2ZWMyIHByb2plY3Rpb25WZWN0b3I7XCIsXCJ1bmlmb3JtIHZlYzIgb2Zmc2V0VmVjdG9yO1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMyB2ID0gdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiAsIDEuMCk7XCIsXCIgICB2IC09IG9mZnNldFZlY3Rvci54eXg7XCIsXCIgICBnbF9Qb3NpdGlvbiA9IHZlYzQoIHYueCAvIHByb2plY3Rpb25WZWN0b3IueCAtMS4wLCB2LnkgLyAtcHJvamVjdGlvblZlY3Rvci55ICsgMS4wICwgMC4wLCAxLjApO1wiLFwiICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XCIsXCJ9XCJdLHRoaXMuaW5pdCgpfSxiLlN0cmlwU2hhZGVyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPWIuY29tcGlsZVByb2dyYW0oYSx0aGlzLnZlcnRleFNyYyx0aGlzLmZyYWdtZW50U3JjKTthLnVzZVByb2dyYW0oYyksdGhpcy51U2FtcGxlcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidVNhbXBsZXJcIiksdGhpcy5wcm9qZWN0aW9uVmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJwcm9qZWN0aW9uVmVjdG9yXCIpLHRoaXMub2Zmc2V0VmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJvZmZzZXRWZWN0b3JcIiksdGhpcy5jb2xvckF0dHJpYnV0ZT1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhQ29sb3JcIiksdGhpcy5hVmVydGV4UG9zaXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVZlcnRleFBvc2l0aW9uXCIpLHRoaXMuYVRleHR1cmVDb29yZD1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVGV4dHVyZUNvb3JkXCIpLHRoaXMuYXR0cmlidXRlcz1bdGhpcy5hVmVydGV4UG9zaXRpb24sdGhpcy5hVGV4dHVyZUNvb3JkXSx0aGlzLnRyYW5zbGF0aW9uTWF0cml4PWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJ0cmFuc2xhdGlvbk1hdHJpeFwiKSx0aGlzLmFscGhhPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJhbHBoYVwiKSx0aGlzLnByb2dyYW09Y30sYi5QcmltaXRpdmVTaGFkZXI9ZnVuY3Rpb24oYSl7dGhpcy5fVUlEPWIuX1VJRCsrLHRoaXMuZ2w9YSx0aGlzLnByb2dyYW09bnVsbCx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XCIsXCJ9XCJdLHRoaXMudmVydGV4U3JjPVtcImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcIixcImF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcIixcInVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcIixcInVuaWZvcm0gdmVjMiBwcm9qZWN0aW9uVmVjdG9yO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldFZlY3RvcjtcIixcInVuaWZvcm0gZmxvYXQgYWxwaGE7XCIsXCJ1bmlmb3JtIHZlYzMgdGludDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMyB2ID0gdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiAsIDEuMCk7XCIsXCIgICB2IC09IG9mZnNldFZlY3Rvci54eXg7XCIsXCIgICBnbF9Qb3NpdGlvbiA9IHZlYzQoIHYueCAvIHByb2plY3Rpb25WZWN0b3IueCAtMS4wLCB2LnkgLyAtcHJvamVjdGlvblZlY3Rvci55ICsgMS4wICwgMC4wLCAxLjApO1wiLFwiICAgdkNvbG9yID0gYUNvbG9yICogdmVjNCh0aW50ICogYWxwaGEsIGFscGhhKTtcIixcIn1cIl0sdGhpcy5pbml0KCl9LGIuUHJpbWl0aXZlU2hhZGVyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPWIuY29tcGlsZVByb2dyYW0oYSx0aGlzLnZlcnRleFNyYyx0aGlzLmZyYWdtZW50U3JjKTthLnVzZVByb2dyYW0oYyksdGhpcy5wcm9qZWN0aW9uVmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJwcm9qZWN0aW9uVmVjdG9yXCIpLHRoaXMub2Zmc2V0VmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJvZmZzZXRWZWN0b3JcIiksdGhpcy50aW50Q29sb3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInRpbnRcIiksdGhpcy5hVmVydGV4UG9zaXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVZlcnRleFBvc2l0aW9uXCIpLHRoaXMuY29sb3JBdHRyaWJ1dGU9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYUNvbG9yXCIpLHRoaXMuYXR0cmlidXRlcz1bdGhpcy5hVmVydGV4UG9zaXRpb24sdGhpcy5jb2xvckF0dHJpYnV0ZV0sdGhpcy50cmFuc2xhdGlvbk1hdHJpeD1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidHJhbnNsYXRpb25NYXRyaXhcIiksdGhpcy5hbHBoYT1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwiYWxwaGFcIiksdGhpcy5wcm9ncmFtPWN9LGIuUHJpbWl0aXZlU2hhZGVyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5nbC5kZWxldGVQcm9ncmFtKHRoaXMucHJvZ3JhbSksdGhpcy51bmlmb3Jtcz1udWxsLHRoaXMuZ2w9bnVsbCx0aGlzLmF0dHJpYnV0ZT1udWxsfSxiLkNvbXBsZXhQcmltaXRpdmVTaGFkZXI9ZnVuY3Rpb24oYSl7dGhpcy5fVUlEPWIuX1VJRCsrLHRoaXMuZ2w9YSx0aGlzLnByb2dyYW09bnVsbCx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XCIsXCJ9XCJdLHRoaXMudmVydGV4U3JjPVtcImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcIixcInVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcIixcInVuaWZvcm0gdmVjMiBwcm9qZWN0aW9uVmVjdG9yO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldFZlY3RvcjtcIixcInVuaWZvcm0gdmVjMyB0aW50O1wiLFwidW5pZm9ybSBmbG9hdCBhbHBoYTtcIixcInVuaWZvcm0gdmVjMyBjb2xvcjtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMyB2ID0gdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiAsIDEuMCk7XCIsXCIgICB2IC09IG9mZnNldFZlY3Rvci54eXg7XCIsXCIgICBnbF9Qb3NpdGlvbiA9IHZlYzQoIHYueCAvIHByb2plY3Rpb25WZWN0b3IueCAtMS4wLCB2LnkgLyAtcHJvamVjdGlvblZlY3Rvci55ICsgMS4wICwgMC4wLCAxLjApO1wiLFwiICAgdkNvbG9yID0gdmVjNChjb2xvciAqIGFscGhhICogdGludCwgYWxwaGEpO1wiLFwifVwiXSx0aGlzLmluaXQoKX0sYi5Db21wbGV4UHJpbWl0aXZlU2hhZGVyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPWIuY29tcGlsZVByb2dyYW0oYSx0aGlzLnZlcnRleFNyYyx0aGlzLmZyYWdtZW50U3JjKTthLnVzZVByb2dyYW0oYyksdGhpcy5wcm9qZWN0aW9uVmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJwcm9qZWN0aW9uVmVjdG9yXCIpLHRoaXMub2Zmc2V0VmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJvZmZzZXRWZWN0b3JcIiksdGhpcy50aW50Q29sb3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInRpbnRcIiksdGhpcy5jb2xvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwiY29sb3JcIiksdGhpcy5hVmVydGV4UG9zaXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVZlcnRleFBvc2l0aW9uXCIpLHRoaXMuYXR0cmlidXRlcz1bdGhpcy5hVmVydGV4UG9zaXRpb24sdGhpcy5jb2xvckF0dHJpYnV0ZV0sdGhpcy50cmFuc2xhdGlvbk1hdHJpeD1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidHJhbnNsYXRpb25NYXRyaXhcIiksdGhpcy5hbHBoYT1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwiYWxwaGFcIiksdGhpcy5wcm9ncmFtPWN9LGIuQ29tcGxleFByaW1pdGl2ZVNoYWRlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLnByb2dyYW0pLHRoaXMudW5pZm9ybXM9bnVsbCx0aGlzLmdsPW51bGwsdGhpcy5hdHRyaWJ1dGU9bnVsbH0sYi5XZWJHTEdyYXBoaWNzPWZ1bmN0aW9uKCl7fSxiLldlYkdMR3JhcGhpY3MucmVuZGVyR3JhcGhpY3M9ZnVuY3Rpb24oYSxjKXt2YXIgZCxlPWMuZ2wsZj1jLnByb2plY3Rpb24sZz1jLm9mZnNldCxoPWMuc2hhZGVyTWFuYWdlci5wcmltaXRpdmVTaGFkZXI7YS5kaXJ0eSYmYi5XZWJHTEdyYXBoaWNzLnVwZGF0ZUdyYXBoaWNzKGEsZSk7Zm9yKHZhciBpPWEuX3dlYkdMW2UuaWRdLGo9MDtqPGkuZGF0YS5sZW5ndGg7aisrKTE9PT1pLmRhdGFbal0ubW9kZT8oZD1pLmRhdGFbal0sYy5zdGVuY2lsTWFuYWdlci5wdXNoU3RlbmNpbChhLGQsYyksZS5kcmF3RWxlbWVudHMoZS5UUklBTkdMRV9GQU4sNCxlLlVOU0lHTkVEX1NIT1JULDIqKGQuaW5kaWNlcy5sZW5ndGgtNCkpLGMuc3RlbmNpbE1hbmFnZXIucG9wU3RlbmNpbChhLGQsYyksdGhpcy5sYXN0PWQubW9kZSk6KGQ9aS5kYXRhW2pdLGMuc2hhZGVyTWFuYWdlci5zZXRTaGFkZXIoaCksaD1jLnNoYWRlck1hbmFnZXIucHJpbWl0aXZlU2hhZGVyLGUudW5pZm9ybU1hdHJpeDNmdihoLnRyYW5zbGF0aW9uTWF0cml4LCExLGEud29ybGRUcmFuc2Zvcm0udG9BcnJheSghMCkpLGUudW5pZm9ybTJmKGgucHJvamVjdGlvblZlY3RvcixmLngsLWYueSksZS51bmlmb3JtMmYoaC5vZmZzZXRWZWN0b3IsLWcueCwtZy55KSxlLnVuaWZvcm0zZnYoaC50aW50Q29sb3IsYi5oZXgycmdiKGEudGludCkpLGUudW5pZm9ybTFmKGguYWxwaGEsYS53b3JsZEFscGhhKSxlLmJpbmRCdWZmZXIoZS5BUlJBWV9CVUZGRVIsZC5idWZmZXIpLGUudmVydGV4QXR0cmliUG9pbnRlcihoLmFWZXJ0ZXhQb3NpdGlvbiwyLGUuRkxPQVQsITEsMjQsMCksZS52ZXJ0ZXhBdHRyaWJQb2ludGVyKGguY29sb3JBdHRyaWJ1dGUsNCxlLkZMT0FULCExLDI0LDgpLGUuYmluZEJ1ZmZlcihlLkVMRU1FTlRfQVJSQVlfQlVGRkVSLGQuaW5kZXhCdWZmZXIpLGUuZHJhd0VsZW1lbnRzKGUuVFJJQU5HTEVfU1RSSVAsZC5pbmRpY2VzLmxlbmd0aCxlLlVOU0lHTkVEX1NIT1JULDApKX0sYi5XZWJHTEdyYXBoaWNzLnVwZGF0ZUdyYXBoaWNzPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5fd2ViR0xbYy5pZF07ZHx8KGQ9YS5fd2ViR0xbYy5pZF09e2xhc3RJbmRleDowLGRhdGE6W10sZ2w6Y30pLGEuZGlydHk9ITE7dmFyIGU7aWYoYS5jbGVhckRpcnR5KXtmb3IoYS5jbGVhckRpcnR5PSExLGU9MDtlPGQuZGF0YS5sZW5ndGg7ZSsrKXt2YXIgZj1kLmRhdGFbZV07Zi5yZXNldCgpLGIuV2ViR0xHcmFwaGljcy5ncmFwaGljc0RhdGFQb29sLnB1c2goZil9ZC5kYXRhPVtdLGQubGFzdEluZGV4PTB9dmFyIGc7Zm9yKGU9ZC5sYXN0SW5kZXg7ZTxhLmdyYXBoaWNzRGF0YS5sZW5ndGg7ZSsrKXt2YXIgaD1hLmdyYXBoaWNzRGF0YVtlXTtoLnR5cGU9PT1iLkdyYXBoaWNzLlBPTFk/KGguZmlsbCYmaC5wb2ludHMubGVuZ3RoPjYmJihoLnBvaW50cy5sZW5ndGg+MTA/KGc9Yi5XZWJHTEdyYXBoaWNzLnN3aXRjaE1vZGUoZCwxKSxiLldlYkdMR3JhcGhpY3MuYnVpbGRDb21wbGV4UG9seShoLGcpKTooZz1iLldlYkdMR3JhcGhpY3Muc3dpdGNoTW9kZShkLDApLGIuV2ViR0xHcmFwaGljcy5idWlsZFBvbHkoaCxnKSkpLGgubGluZVdpZHRoPjAmJihnPWIuV2ViR0xHcmFwaGljcy5zd2l0Y2hNb2RlKGQsMCksYi5XZWJHTEdyYXBoaWNzLmJ1aWxkTGluZShoLGcpKSk6KGc9Yi5XZWJHTEdyYXBoaWNzLnN3aXRjaE1vZGUoZCwwKSxoLnR5cGU9PT1iLkdyYXBoaWNzLlJFQ1Q/Yi5XZWJHTEdyYXBoaWNzLmJ1aWxkUmVjdGFuZ2xlKGgsZyk6aC50eXBlPT09Yi5HcmFwaGljcy5DSVJDfHxoLnR5cGU9PT1iLkdyYXBoaWNzLkVMSVA/Yi5XZWJHTEdyYXBoaWNzLmJ1aWxkQ2lyY2xlKGgsZyk6aC50eXBlPT09Yi5HcmFwaGljcy5SUkVDJiZiLldlYkdMR3JhcGhpY3MuYnVpbGRSb3VuZGVkUmVjdGFuZ2xlKGgsZykpLGQubGFzdEluZGV4Kyt9Zm9yKGU9MDtlPGQuZGF0YS5sZW5ndGg7ZSsrKWc9ZC5kYXRhW2VdLGcuZGlydHkmJmcudXBsb2FkKCl9LGIuV2ViR0xHcmFwaGljcy5zd2l0Y2hNb2RlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ7cmV0dXJuIGEuZGF0YS5sZW5ndGg/KGQ9YS5kYXRhW2EuZGF0YS5sZW5ndGgtMV0sKGQubW9kZSE9PWN8fDE9PT1jKSYmKGQ9Yi5XZWJHTEdyYXBoaWNzLmdyYXBoaWNzRGF0YVBvb2wucG9wKCl8fG5ldyBiLldlYkdMR3JhcGhpY3NEYXRhKGEuZ2wpLGQubW9kZT1jLGEuZGF0YS5wdXNoKGQpKSk6KGQ9Yi5XZWJHTEdyYXBoaWNzLmdyYXBoaWNzRGF0YVBvb2wucG9wKCl8fG5ldyBiLldlYkdMR3JhcGhpY3NEYXRhKGEuZ2wpLGQubW9kZT1jLGEuZGF0YS5wdXNoKGQpKSxkLmRpcnR5PSEwLGR9LGIuV2ViR0xHcmFwaGljcy5idWlsZFJlY3RhbmdsZT1mdW5jdGlvbihhLGMpe3ZhciBkPWEucG9pbnRzLGU9ZFswXSxmPWRbMV0sZz1kWzJdLGg9ZFszXTtpZihhLmZpbGwpe3ZhciBpPWIuaGV4MnJnYihhLmZpbGxDb2xvciksaj1hLmZpbGxBbHBoYSxrPWlbMF0qaixsPWlbMV0qaixtPWlbMl0qaixuPWMucG9pbnRzLG89Yy5pbmRpY2VzLHA9bi5sZW5ndGgvNjtuLnB1c2goZSxmKSxuLnB1c2goayxsLG0saiksbi5wdXNoKGUrZyxmKSxuLnB1c2goayxsLG0saiksbi5wdXNoKGUsZitoKSxuLnB1c2goayxsLG0saiksbi5wdXNoKGUrZyxmK2gpLG4ucHVzaChrLGwsbSxqKSxvLnB1c2gocCxwLHArMSxwKzIscCszLHArMyl9aWYoYS5saW5lV2lkdGgpe3ZhciBxPWEucG9pbnRzO2EucG9pbnRzPVtlLGYsZStnLGYsZStnLGYraCxlLGYraCxlLGZdLGIuV2ViR0xHcmFwaGljcy5idWlsZExpbmUoYSxjKSxhLnBvaW50cz1xfX0sYi5XZWJHTEdyYXBoaWNzLmJ1aWxkUm91bmRlZFJlY3RhbmdsZT1mdW5jdGlvbihhLGMpe3ZhciBkPWEucG9pbnRzLGU9ZFswXSxmPWRbMV0sZz1kWzJdLGg9ZFszXSxpPWRbNF0saj1bXTtpZihqLnB1c2goZSxmK2kpLGo9ai5jb25jYXQoYi5XZWJHTEdyYXBoaWNzLnF1YWRyYXRpY0JlemllckN1cnZlKGUsZitoLWksZSxmK2gsZStpLGYraCkpLGo9ai5jb25jYXQoYi5XZWJHTEdyYXBoaWNzLnF1YWRyYXRpY0JlemllckN1cnZlKGUrZy1pLGYraCxlK2csZitoLGUrZyxmK2gtaSkpLGo9ai5jb25jYXQoYi5XZWJHTEdyYXBoaWNzLnF1YWRyYXRpY0JlemllckN1cnZlKGUrZyxmK2ksZStnLGYsZStnLWksZikpLGo9ai5jb25jYXQoYi5XZWJHTEdyYXBoaWNzLnF1YWRyYXRpY0JlemllckN1cnZlKGUraSxmLGUsZixlLGYraSkpLGEuZmlsbCl7dmFyIGs9Yi5oZXgycmdiKGEuZmlsbENvbG9yKSxsPWEuZmlsbEFscGhhLG09a1swXSpsLG49a1sxXSpsLG89a1syXSpsLHA9Yy5wb2ludHMscT1jLmluZGljZXMscj1wLmxlbmd0aC82LHM9Yi5Qb2x5Sy5Ucmlhbmd1bGF0ZShqKSx0PTA7Zm9yKHQ9MDt0PHMubGVuZ3RoO3QrPTMpcS5wdXNoKHNbdF0rcikscS5wdXNoKHNbdF0rcikscS5wdXNoKHNbdCsxXStyKSxxLnB1c2goc1t0KzJdK3IpLHEucHVzaChzW3QrMl0rcik7Zm9yKHQ9MDt0PGoubGVuZ3RoO3QrKylwLnB1c2goalt0XSxqWysrdF0sbSxuLG8sbCl9aWYoYS5saW5lV2lkdGgpe3ZhciB1PWEucG9pbnRzO2EucG9pbnRzPWosYi5XZWJHTEdyYXBoaWNzLmJ1aWxkTGluZShhLGMpLGEucG9pbnRzPXV9fSxiLldlYkdMR3JhcGhpY3MucXVhZHJhdGljQmV6aWVyQ3VydmU9ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe2Z1bmN0aW9uIGcoYSxiLGMpe3ZhciBkPWItYTtyZXR1cm4gYStkKmN9Zm9yKHZhciBoLGksaixrLGwsbSxuPTIwLG89W10scD0wLHE9MDtuPj1xO3ErKylwPXEvbixoPWcoYSxjLHApLGk9ZyhiLGQscCksaj1nKGMsZSxwKSxrPWcoZCxmLHApLGw9ZyhoLGoscCksbT1nKGksayxwKSxvLnB1c2gobCxtKTtyZXR1cm4gb30sYi5XZWJHTEdyYXBoaWNzLmJ1aWxkQ2lyY2xlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5wb2ludHMsZT1kWzBdLGY9ZFsxXSxnPWRbMl0saD1kWzNdLGk9NDAsaj0yKk1hdGguUEkvaSxrPTA7aWYoYS5maWxsKXt2YXIgbD1iLmhleDJyZ2IoYS5maWxsQ29sb3IpLG09YS5maWxsQWxwaGEsbj1sWzBdKm0sbz1sWzFdKm0scD1sWzJdKm0scT1jLnBvaW50cyxyPWMuaW5kaWNlcyxzPXEubGVuZ3RoLzY7Zm9yKHIucHVzaChzKSxrPTA7aSsxPms7aysrKXEucHVzaChlLGYsbixvLHAsbSkscS5wdXNoKGUrTWF0aC5zaW4oaiprKSpnLGYrTWF0aC5jb3MoaiprKSpoLG4sbyxwLG0pLHIucHVzaChzKysscysrKTtyLnB1c2gocy0xKX1pZihhLmxpbmVXaWR0aCl7dmFyIHQ9YS5wb2ludHM7Zm9yKGEucG9pbnRzPVtdLGs9MDtpKzE+aztrKyspYS5wb2ludHMucHVzaChlK01hdGguc2luKGoqaykqZyxmK01hdGguY29zKGoqaykqaCk7Yi5XZWJHTEdyYXBoaWNzLmJ1aWxkTGluZShhLGMpLGEucG9pbnRzPXR9fSxiLldlYkdMR3JhcGhpY3MuYnVpbGRMaW5lPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9MCxlPWEucG9pbnRzO2lmKDAhPT1lLmxlbmd0aCl7aWYoYS5saW5lV2lkdGglMilmb3IoZD0wO2Q8ZS5sZW5ndGg7ZCsrKWVbZF0rPS41O3ZhciBmPW5ldyBiLlBvaW50KGVbMF0sZVsxXSksZz1uZXcgYi5Qb2ludChlW2UubGVuZ3RoLTJdLGVbZS5sZW5ndGgtMV0pO2lmKGYueD09PWcueCYmZi55PT09Zy55KXtlPWUuc2xpY2UoKSxlLnBvcCgpLGUucG9wKCksZz1uZXcgYi5Qb2ludChlW2UubGVuZ3RoLTJdLGVbZS5sZW5ndGgtMV0pO3ZhciBoPWcueCsuNSooZi54LWcueCksaT1nLnkrLjUqKGYueS1nLnkpO2UudW5zaGlmdChoLGkpLGUucHVzaChoLGkpfXZhciBqLGssbCxtLG4sbyxwLHEscixzLHQsdSx2LHcseCx5LHosQSxCLEMsRCxFLEYsRz1jLnBvaW50cyxIPWMuaW5kaWNlcyxJPWUubGVuZ3RoLzIsSj1lLmxlbmd0aCxLPUcubGVuZ3RoLzYsTD1hLmxpbmVXaWR0aC8yLE09Yi5oZXgycmdiKGEubGluZUNvbG9yKSxOPWEubGluZUFscGhhLE89TVswXSpOLFA9TVsxXSpOLFE9TVsyXSpOO2ZvcihsPWVbMF0sbT1lWzFdLG49ZVsyXSxvPWVbM10scj0tKG0tbykscz1sLW4sRj1NYXRoLnNxcnQocipyK3Mqcyksci89RixzLz1GLHIqPUwscyo9TCxHLnB1c2gobC1yLG0tcyxPLFAsUSxOKSxHLnB1c2gobCtyLG0rcyxPLFAsUSxOKSxkPTE7SS0xPmQ7ZCsrKWw9ZVsyKihkLTEpXSxtPWVbMiooZC0xKSsxXSxuPWVbMipkXSxvPWVbMipkKzFdLHA9ZVsyKihkKzEpXSxxPWVbMiooZCsxKSsxXSxyPS0obS1vKSxzPWwtbixGPU1hdGguc3FydChyKnIrcypzKSxyLz1GLHMvPUYscio9TCxzKj1MLHQ9LShvLXEpLHU9bi1wLEY9TWF0aC5zcXJ0KHQqdCt1KnUpLHQvPUYsdS89Rix0Kj1MLHUqPUwseD0tcyttLSgtcytvKSx5PS1yK24tKC1yK2wpLHo9KC1yK2wpKigtcytvKS0oLXIrbikqKC1zK20pLEE9LXUrcS0oLXUrbyksQj0tdCtuLSgtdCtwKSxDPSgtdCtwKSooLXUrbyktKC10K24pKigtdStxKSxEPXgqQi1BKnksTWF0aC5hYnMoRCk8LjE/KEQrPTEwLjEsRy5wdXNoKG4tcixvLXMsTyxQLFEsTiksRy5wdXNoKG4rcixvK3MsTyxQLFEsTikpOihqPSh5KkMtQip6KS9ELGs9KEEqei14KkMpL0QsRT0oai1uKSooai1uKSsoay1vKSsoay1vKSxFPjE5NjAwPyh2PXItdCx3PXMtdSxGPU1hdGguc3FydCh2KnYrdyp3KSx2Lz1GLHcvPUYsdio9TCx3Kj1MLEcucHVzaChuLXYsby13KSxHLnB1c2goTyxQLFEsTiksRy5wdXNoKG4rdixvK3cpLEcucHVzaChPLFAsUSxOKSxHLnB1c2gobi12LG8tdyksRy5wdXNoKE8sUCxRLE4pLEorKyk6KEcucHVzaChqLGspLEcucHVzaChPLFAsUSxOKSxHLnB1c2gobi0oai1uKSxvLShrLW8pKSxHLnB1c2goTyxQLFEsTikpKTtmb3IobD1lWzIqKEktMildLG09ZVsyKihJLTIpKzFdLG49ZVsyKihJLTEpXSxvPWVbMiooSS0xKSsxXSxyPS0obS1vKSxzPWwtbixGPU1hdGguc3FydChyKnIrcypzKSxyLz1GLHMvPUYscio9TCxzKj1MLEcucHVzaChuLXIsby1zKSxHLnB1c2goTyxQLFEsTiksRy5wdXNoKG4rcixvK3MpLEcucHVzaChPLFAsUSxOKSxILnB1c2goSyksZD0wO0o+ZDtkKyspSC5wdXNoKEsrKyk7SC5wdXNoKEstMSl9fSxiLldlYkdMR3JhcGhpY3MuYnVpbGRDb21wbGV4UG9seT1mdW5jdGlvbihhLGMpe3ZhciBkPWEucG9pbnRzLnNsaWNlKCk7aWYoIShkLmxlbmd0aDw2KSl7dmFyIGU9Yy5pbmRpY2VzO2MucG9pbnRzPWQsYy5hbHBoYT1hLmZpbGxBbHBoYSxjLmNvbG9yPWIuaGV4MnJnYihhLmZpbGxDb2xvcik7Zm9yKHZhciBmLGcsaD0xLzAsaT0tMS8wLGo9MS8wLGs9LTEvMCxsPTA7bDxkLmxlbmd0aDtsKz0yKWY9ZFtsXSxnPWRbbCsxXSxoPWg+Zj9mOmgsaT1mPmk/ZjppLGo9aj5nP2c6aixrPWc+az9nOms7ZC5wdXNoKGgsaixpLGosaSxrLGgsayk7dmFyIG09ZC5sZW5ndGgvMjtmb3IobD0wO20+bDtsKyspZS5wdXNoKGwpfX0sYi5XZWJHTEdyYXBoaWNzLmJ1aWxkUG9seT1mdW5jdGlvbihhLGMpe3ZhciBkPWEucG9pbnRzO2lmKCEoZC5sZW5ndGg8Nikpe3ZhciBlPWMucG9pbnRzLGY9Yy5pbmRpY2VzLGc9ZC5sZW5ndGgvMixoPWIuaGV4MnJnYihhLmZpbGxDb2xvciksaT1hLmZpbGxBbHBoYSxqPWhbMF0qaSxrPWhbMV0qaSxsPWhbMl0qaSxtPWIuUG9seUsuVHJpYW5ndWxhdGUoZCksbj1lLmxlbmd0aC82LG89MDtmb3Iobz0wO288bS5sZW5ndGg7bys9MylmLnB1c2gobVtvXStuKSxmLnB1c2gobVtvXStuKSxmLnB1c2gobVtvKzFdK24pLGYucHVzaChtW28rMl0rbiksZi5wdXNoKG1bbysyXStuKTtmb3Iobz0wO2c+bztvKyspZS5wdXNoKGRbMipvXSxkWzIqbysxXSxqLGssbCxpKX19LGIuV2ViR0xHcmFwaGljcy5ncmFwaGljc0RhdGFQb29sPVtdLGIuV2ViR0xHcmFwaGljc0RhdGE9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hLHRoaXMuY29sb3I9WzAsMCwwXSx0aGlzLnBvaW50cz1bXSx0aGlzLmluZGljZXM9W10sdGhpcy5sYXN0SW5kZXg9MCx0aGlzLmJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuaW5kZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLm1vZGU9MSx0aGlzLmFscGhhPTEsdGhpcy5kaXJ0eT0hMH0sYi5XZWJHTEdyYXBoaWNzRGF0YS5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLnBvaW50cz1bXSx0aGlzLmluZGljZXM9W10sdGhpcy5sYXN0SW5kZXg9MH0sYi5XZWJHTEdyYXBoaWNzRGF0YS5wcm90b3R5cGUudXBsb2FkPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbDt0aGlzLmdsUG9pbnRzPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5wb2ludHMpLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLmJ1ZmZlciksYS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMuZ2xQb2ludHMsYS5TVEFUSUNfRFJBVyksdGhpcy5nbEluZGljaWVzPW5ldyBVaW50MTZBcnJheSh0aGlzLmluZGljZXMpLGEuYmluZEJ1ZmZlcihhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kZXhCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuZ2xJbmRpY2llcyxhLlNUQVRJQ19EUkFXKSx0aGlzLmRpcnR5PSExfSxiLmdsQ29udGV4dHM9W10sYi5XZWJHTFJlbmRlcmVyPWZ1bmN0aW9uKGEsYyxkLGUsZixnKXtiLmRlZmF1bHRSZW5kZXJlcnx8KGIuc2F5SGVsbG8oXCJ3ZWJHTFwiKSxiLmRlZmF1bHRSZW5kZXJlcj10aGlzKSx0aGlzLnR5cGU9Yi5XRUJHTF9SRU5ERVJFUix0aGlzLnRyYW5zcGFyZW50PSEhZSx0aGlzLnByZXNlcnZlRHJhd2luZ0J1ZmZlcj1nLHRoaXMud2lkdGg9YXx8ODAwLHRoaXMuaGVpZ2h0PWN8fDYwMCx0aGlzLnZpZXc9ZHx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLnZpZXcud2lkdGg9dGhpcy53aWR0aCx0aGlzLnZpZXcuaGVpZ2h0PXRoaXMuaGVpZ2h0LHRoaXMuY29udGV4dExvc3Q9dGhpcy5oYW5kbGVDb250ZXh0TG9zdC5iaW5kKHRoaXMpLHRoaXMuY29udGV4dFJlc3RvcmVkTG9zdD10aGlzLmhhbmRsZUNvbnRleHRSZXN0b3JlZC5iaW5kKHRoaXMpLHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0bG9zdFwiLHRoaXMuY29udGV4dExvc3QsITEpLHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0cmVzdG9yZWRcIix0aGlzLmNvbnRleHRSZXN0b3JlZExvc3QsITEpLHRoaXMub3B0aW9ucz17YWxwaGE6dGhpcy50cmFuc3BhcmVudCxhbnRpYWxpYXM6ISFmLHByZW11bHRpcGxpZWRBbHBoYTohIWUsc3RlbmNpbDohMCxwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6Z307dmFyIGg9bnVsbDtpZihbXCJleHBlcmltZW50YWwtd2ViZ2xcIixcIndlYmdsXCJdLmZvckVhY2goZnVuY3Rpb24oYSl7dHJ5e2g9aHx8dGhpcy52aWV3LmdldENvbnRleHQoYSx0aGlzLm9wdGlvbnMpfWNhdGNoKGIpe319LHRoaXMpLCFoKXRocm93IG5ldyBFcnJvcihcIlRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHdlYkdMLiBUcnkgdXNpbmcgdGhlIGNhbnZhcyByZW5kZXJlclwiK3RoaXMpO3RoaXMuZ2w9aCx0aGlzLmdsQ29udGV4dElkPWguaWQ9Yi5XZWJHTFJlbmRlcmVyLmdsQ29udGV4dElkKyssYi5nbENvbnRleHRzW3RoaXMuZ2xDb250ZXh0SWRdPWgsYi5ibGVuZE1vZGVzV2ViR0x8fChiLmJsZW5kTW9kZXNXZWJHTD1bXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuTk9STUFMXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuQUREXT1baC5TUkNfQUxQSEEsaC5EU1RfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5NVUxUSVBMWV09W2guRFNUX0NPTE9SLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLlNDUkVFTl09W2guU1JDX0FMUEhBLGguT05FXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuT1ZFUkxBWV09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkRBUktFTl09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkxJR0hURU5dPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5DT0xPUl9ET0RHRV09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkNPTE9SX0JVUk5dPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5IQVJEX0xJR0hUXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuU09GVF9MSUdIVF09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkRJRkZFUkVOQ0VdPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5FWENMVVNJT05dPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5IVUVdPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5TQVRVUkFUSU9OXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuQ09MT1JdPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5MVU1JTk9TSVRZXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSksdGhpcy5wcm9qZWN0aW9uPW5ldyBiLlBvaW50LHRoaXMucHJvamVjdGlvbi54PXRoaXMud2lkdGgvMix0aGlzLnByb2plY3Rpb24ueT0tdGhpcy5oZWlnaHQvMix0aGlzLm9mZnNldD1uZXcgYi5Qb2ludCgwLDApLHRoaXMucmVzaXplKHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLHRoaXMuY29udGV4dExvc3Q9ITEsdGhpcy5zaGFkZXJNYW5hZ2VyPW5ldyBiLldlYkdMU2hhZGVyTWFuYWdlcihoKSx0aGlzLnNwcml0ZUJhdGNoPW5ldyBiLldlYkdMU3ByaXRlQmF0Y2goaCksdGhpcy5tYXNrTWFuYWdlcj1uZXcgYi5XZWJHTE1hc2tNYW5hZ2VyKGgpLHRoaXMuZmlsdGVyTWFuYWdlcj1uZXcgYi5XZWJHTEZpbHRlck1hbmFnZXIoaCx0aGlzLnRyYW5zcGFyZW50KSx0aGlzLnN0ZW5jaWxNYW5hZ2VyPW5ldyBiLldlYkdMU3RlbmNpbE1hbmFnZXIoaCksdGhpcy5ibGVuZE1vZGVNYW5hZ2VyPW5ldyBiLldlYkdMQmxlbmRNb2RlTWFuYWdlcihoKSx0aGlzLnJlbmRlclNlc3Npb249e30sdGhpcy5yZW5kZXJTZXNzaW9uLmdsPXRoaXMuZ2wsdGhpcy5yZW5kZXJTZXNzaW9uLmRyYXdDb3VudD0wLHRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyPXRoaXMuc2hhZGVyTWFuYWdlcix0aGlzLnJlbmRlclNlc3Npb24ubWFza01hbmFnZXI9dGhpcy5tYXNrTWFuYWdlcix0aGlzLnJlbmRlclNlc3Npb24uZmlsdGVyTWFuYWdlcj10aGlzLmZpbHRlck1hbmFnZXIsdGhpcy5yZW5kZXJTZXNzaW9uLmJsZW5kTW9kZU1hbmFnZXI9dGhpcy5ibGVuZE1vZGVNYW5hZ2VyLHRoaXMucmVuZGVyU2Vzc2lvbi5zcHJpdGVCYXRjaD10aGlzLnNwcml0ZUJhdGNoLHRoaXMucmVuZGVyU2Vzc2lvbi5zdGVuY2lsTWFuYWdlcj10aGlzLnN0ZW5jaWxNYW5hZ2VyLHRoaXMucmVuZGVyU2Vzc2lvbi5yZW5kZXJlcj10aGlzLGgudXNlUHJvZ3JhbSh0aGlzLnNoYWRlck1hbmFnZXIuZGVmYXVsdFNoYWRlci5wcm9ncmFtKSxoLmRpc2FibGUoaC5ERVBUSF9URVNUKSxoLmRpc2FibGUoaC5DVUxMX0ZBQ0UpLGguZW5hYmxlKGguQkxFTkQpLGguY29sb3JNYXNrKCEwLCEwLCEwLHRoaXMudHJhbnNwYXJlbnQpfSxiLldlYkdMUmVuZGVyZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuV2ViR0xSZW5kZXJlcixiLldlYkdMUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihhKXtpZighdGhpcy5jb250ZXh0TG9zdCl7dGhpcy5fX3N0YWdlIT09YSYmKGEuaW50ZXJhY3RpdmUmJmEuaW50ZXJhY3Rpb25NYW5hZ2VyLnJlbW92ZUV2ZW50cygpLHRoaXMuX19zdGFnZT1hKSxiLldlYkdMUmVuZGVyZXIudXBkYXRlVGV4dHVyZXMoKSxhLnVwZGF0ZVRyYW5zZm9ybSgpLGEuX2ludGVyYWN0aXZlJiYoYS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZHx8KGEuX2ludGVyYWN0aXZlRXZlbnRzQWRkZWQ9ITAsYS5pbnRlcmFjdGlvbk1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMpKSk7dmFyIGM9dGhpcy5nbDtjLnZpZXdwb3J0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSxjLmJpbmRGcmFtZWJ1ZmZlcihjLkZSQU1FQlVGRkVSLG51bGwpLHRoaXMudHJhbnNwYXJlbnQ/Yy5jbGVhckNvbG9yKDAsMCwwLDApOmMuY2xlYXJDb2xvcihhLmJhY2tncm91bmRDb2xvclNwbGl0WzBdLGEuYmFja2dyb3VuZENvbG9yU3BsaXRbMV0sYS5iYWNrZ3JvdW5kQ29sb3JTcGxpdFsyXSwxKSxjLmNsZWFyKGMuQ09MT1JfQlVGRkVSX0JJVCksdGhpcy5yZW5kZXJEaXNwbGF5T2JqZWN0KGEsdGhpcy5wcm9qZWN0aW9uKSxhLmludGVyYWN0aXZlP2EuX2ludGVyYWN0aXZlRXZlbnRzQWRkZWR8fChhLl9pbnRlcmFjdGl2ZUV2ZW50c0FkZGVkPSEwLGEuaW50ZXJhY3Rpb25NYW5hZ2VyLnNldFRhcmdldCh0aGlzKSk6YS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZCYmKGEuX2ludGVyYWN0aXZlRXZlbnRzQWRkZWQ9ITEsYS5pbnRlcmFjdGlvbk1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMpKX19LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyRGlzcGxheU9iamVjdD1mdW5jdGlvbihhLGMsZCl7dGhpcy5yZW5kZXJTZXNzaW9uLmJsZW5kTW9kZU1hbmFnZXIuc2V0QmxlbmRNb2RlKGIuYmxlbmRNb2Rlcy5OT1JNQUwpLHRoaXMucmVuZGVyU2Vzc2lvbi5kcmF3Q291bnQ9MCx0aGlzLnJlbmRlclNlc3Npb24uY3VycmVudEJsZW5kTW9kZT05OTk5LHRoaXMucmVuZGVyU2Vzc2lvbi5wcm9qZWN0aW9uPWMsdGhpcy5yZW5kZXJTZXNzaW9uLm9mZnNldD10aGlzLm9mZnNldCx0aGlzLnNwcml0ZUJhdGNoLmJlZ2luKHRoaXMucmVuZGVyU2Vzc2lvbiksdGhpcy5maWx0ZXJNYW5hZ2VyLmJlZ2luKHRoaXMucmVuZGVyU2Vzc2lvbixkKSxhLl9yZW5kZXJXZWJHTCh0aGlzLnJlbmRlclNlc3Npb24pLHRoaXMuc3ByaXRlQmF0Y2guZW5kKCl9LGIuV2ViR0xSZW5kZXJlci51cGRhdGVUZXh0dXJlcz1mdW5jdGlvbigpe3ZhciBhPTA7Zm9yKGE9MDthPGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXMubGVuZ3RoO2ErKyliLldlYkdMUmVuZGVyZXIudXBkYXRlVGV4dHVyZUZyYW1lKGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXNbYV0pO2ZvcihhPTA7YTxiLnRleHR1cmVzVG9EZXN0cm95Lmxlbmd0aDthKyspYi5XZWJHTFJlbmRlcmVyLmRlc3Ryb3lUZXh0dXJlKGIudGV4dHVyZXNUb0Rlc3Ryb3lbYV0pO2IudGV4dHVyZXNUb1VwZGF0ZS5sZW5ndGg9MCxiLnRleHR1cmVzVG9EZXN0cm95Lmxlbmd0aD0wLGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXMubGVuZ3RoPTB9LGIuV2ViR0xSZW5kZXJlci5kZXN0cm95VGV4dHVyZT1mdW5jdGlvbihhKXtmb3IodmFyIGM9YS5fZ2xUZXh0dXJlcy5sZW5ndGgtMTtjPj0wO2MtLSl7dmFyIGQ9YS5fZ2xUZXh0dXJlc1tjXSxlPWIuZ2xDb250ZXh0c1tjXTtcbmUmJmQmJmUuZGVsZXRlVGV4dHVyZShkKX1hLl9nbFRleHR1cmVzLmxlbmd0aD0wfSxiLldlYkdMUmVuZGVyZXIudXBkYXRlVGV4dHVyZUZyYW1lPWZ1bmN0aW9uKGEpe2EuX3VwZGF0ZVdlYkdMdXZzKCl9LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKGEsYil7dGhpcy53aWR0aD1hLHRoaXMuaGVpZ2h0PWIsdGhpcy52aWV3LndpZHRoPWEsdGhpcy52aWV3LmhlaWdodD1iLHRoaXMuZ2wudmlld3BvcnQoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLHRoaXMucHJvamVjdGlvbi54PXRoaXMud2lkdGgvMix0aGlzLnByb2plY3Rpb24ueT0tdGhpcy5oZWlnaHQvMn0sYi5jcmVhdGVXZWJHTFRleHR1cmU9ZnVuY3Rpb24oYSxjKXtyZXR1cm4gYS5oYXNMb2FkZWQmJihhLl9nbFRleHR1cmVzW2MuaWRdPWMuY3JlYXRlVGV4dHVyZSgpLGMuYmluZFRleHR1cmUoYy5URVhUVVJFXzJELGEuX2dsVGV4dHVyZXNbYy5pZF0pLGMucGl4ZWxTdG9yZWkoYy5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsYS5wcmVtdWx0aXBsaWVkQWxwaGEpLGMudGV4SW1hZ2UyRChjLlRFWFRVUkVfMkQsMCxjLlJHQkEsYy5SR0JBLGMuVU5TSUdORURfQllURSxhLnNvdXJjZSksYy50ZXhQYXJhbWV0ZXJpKGMuVEVYVFVSRV8yRCxjLlRFWFRVUkVfTUFHX0ZJTFRFUixhLnNjYWxlTW9kZT09PWIuc2NhbGVNb2Rlcy5MSU5FQVI/Yy5MSU5FQVI6Yy5ORUFSRVNUKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9NSU5fRklMVEVSLGEuc2NhbGVNb2RlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9jLkxJTkVBUjpjLk5FQVJFU1QpLGEuX3Bvd2VyT2YyPyhjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1MsYy5SRVBFQVQpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfVCxjLlJFUEVBVCkpOihjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1MsYy5DTEFNUF9UT19FREdFKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1QsYy5DTEFNUF9UT19FREdFKSksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsbnVsbCksYS5fZGlydHlbYy5pZF09ITEpLGEuX2dsVGV4dHVyZXNbYy5pZF19LGIudXBkYXRlV2ViR0xUZXh0dXJlPWZ1bmN0aW9uKGEsYyl7YS5fZ2xUZXh0dXJlc1tjLmlkXSYmKGMuYmluZFRleHR1cmUoYy5URVhUVVJFXzJELGEuX2dsVGV4dHVyZXNbYy5pZF0pLGMucGl4ZWxTdG9yZWkoYy5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsYS5wcmVtdWx0aXBsaWVkQWxwaGEpLGMudGV4SW1hZ2UyRChjLlRFWFRVUkVfMkQsMCxjLlJHQkEsYy5SR0JBLGMuVU5TSUdORURfQllURSxhLnNvdXJjZSksYy50ZXhQYXJhbWV0ZXJpKGMuVEVYVFVSRV8yRCxjLlRFWFRVUkVfTUFHX0ZJTFRFUixhLnNjYWxlTW9kZT09PWIuc2NhbGVNb2Rlcy5MSU5FQVI/Yy5MSU5FQVI6Yy5ORUFSRVNUKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9NSU5fRklMVEVSLGEuc2NhbGVNb2RlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9jLkxJTkVBUjpjLk5FQVJFU1QpLGEuX3Bvd2VyT2YyPyhjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1MsYy5SRVBFQVQpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfVCxjLlJFUEVBVCkpOihjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1MsYy5DTEFNUF9UT19FREdFKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9XUkFQX1QsYy5DTEFNUF9UT19FREdFKSksYS5fZGlydHlbYy5pZF09ITEpfSxiLldlYkdMUmVuZGVyZXIucHJvdG90eXBlLmhhbmRsZUNvbnRleHRMb3N0PWZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKSx0aGlzLmNvbnRleHRMb3N0PSEwfSxiLldlYkdMUmVuZGVyZXIucHJvdG90eXBlLmhhbmRsZUNvbnRleHRSZXN0b3JlZD1mdW5jdGlvbigpe3RyeXt0aGlzLmdsPXRoaXMudmlldy5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIsdGhpcy5vcHRpb25zKX1jYXRjaChhKXt0cnl7dGhpcy5nbD10aGlzLnZpZXcuZ2V0Q29udGV4dChcIndlYmdsXCIsdGhpcy5vcHRpb25zKX1jYXRjaChjKXt0aHJvdyBuZXcgRXJyb3IoXCIgVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgd2ViR0wuIFRyeSB1c2luZyB0aGUgY2FudmFzIHJlbmRlcmVyXCIrdGhpcyl9fXZhciBkPXRoaXMuZ2w7ZC5pZD1iLldlYkdMUmVuZGVyZXIuZ2xDb250ZXh0SWQrKyx0aGlzLnNoYWRlck1hbmFnZXIuc2V0Q29udGV4dChkKSx0aGlzLnNwcml0ZUJhdGNoLnNldENvbnRleHQoZCksdGhpcy5wcmltaXRpdmVCYXRjaC5zZXRDb250ZXh0KGQpLHRoaXMubWFza01hbmFnZXIuc2V0Q29udGV4dChkKSx0aGlzLmZpbHRlck1hbmFnZXIuc2V0Q29udGV4dChkKSx0aGlzLnJlbmRlclNlc3Npb24uZ2w9dGhpcy5nbCxkLmRpc2FibGUoZC5ERVBUSF9URVNUKSxkLmRpc2FibGUoZC5DVUxMX0ZBQ0UpLGQuZW5hYmxlKGQuQkxFTkQpLGQuY29sb3JNYXNrKCEwLCEwLCEwLHRoaXMudHJhbnNwYXJlbnQpLHRoaXMuZ2wudmlld3BvcnQoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpO2Zvcih2YXIgZSBpbiBiLlRleHR1cmVDYWNoZSl7dmFyIGY9Yi5UZXh0dXJlQ2FjaGVbZV0uYmFzZVRleHR1cmU7Zi5fZ2xUZXh0dXJlcz1bXX10aGlzLmNvbnRleHRMb3N0PSExfSxiLldlYkdMUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIndlYmdsY29udGV4dGxvc3RcIix0aGlzLmNvbnRleHRMb3N0KSx0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIndlYmdsY29udGV4dHJlc3RvcmVkXCIsdGhpcy5jb250ZXh0UmVzdG9yZWRMb3N0KSxiLmdsQ29udGV4dHNbdGhpcy5nbENvbnRleHRJZF09bnVsbCx0aGlzLnByb2plY3Rpb249bnVsbCx0aGlzLm9mZnNldD1udWxsLHRoaXMuc2hhZGVyTWFuYWdlci5kZXN0cm95KCksdGhpcy5zcHJpdGVCYXRjaC5kZXN0cm95KCksdGhpcy5wcmltaXRpdmVCYXRjaC5kZXN0cm95KCksdGhpcy5tYXNrTWFuYWdlci5kZXN0cm95KCksdGhpcy5maWx0ZXJNYW5hZ2VyLmRlc3Ryb3koKSx0aGlzLnNoYWRlck1hbmFnZXI9bnVsbCx0aGlzLnNwcml0ZUJhdGNoPW51bGwsdGhpcy5tYXNrTWFuYWdlcj1udWxsLHRoaXMuZmlsdGVyTWFuYWdlcj1udWxsLHRoaXMuZ2w9bnVsbCx0aGlzLnJlbmRlclNlc3Npb249bnVsbH0sYi5XZWJHTFJlbmRlcmVyLmdsQ29udGV4dElkPTAsYi5XZWJHTEJsZW5kTW9kZU1hbmFnZXI9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hLHRoaXMuY3VycmVudEJsZW5kTW9kZT05OTk5OX0sYi5XZWJHTEJsZW5kTW9kZU1hbmFnZXIucHJvdG90eXBlLnNldEJsZW5kTW9kZT1mdW5jdGlvbihhKXtpZih0aGlzLmN1cnJlbnRCbGVuZE1vZGU9PT1hKXJldHVybiExO3RoaXMuY3VycmVudEJsZW5kTW9kZT1hO3ZhciBjPWIuYmxlbmRNb2Rlc1dlYkdMW3RoaXMuY3VycmVudEJsZW5kTW9kZV07cmV0dXJuIHRoaXMuZ2wuYmxlbmRGdW5jKGNbMF0sY1sxXSksITB9LGIuV2ViR0xCbGVuZE1vZGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5nbD1udWxsfSxiLldlYkdMTWFza01hbmFnZXI9ZnVuY3Rpb24oYSl7dGhpcy5tYXNrU3RhY2s9W10sdGhpcy5tYXNrUG9zaXRpb249MCx0aGlzLnNldENvbnRleHQoYSksdGhpcy5yZXZlcnNlPSExLHRoaXMuY291bnQ9MH0sYi5XZWJHTE1hc2tNYW5hZ2VyLnByb3RvdHlwZS5zZXRDb250ZXh0PWZ1bmN0aW9uKGEpe3RoaXMuZ2w9YX0sYi5XZWJHTE1hc2tNYW5hZ2VyLnByb3RvdHlwZS5wdXNoTWFzaz1mdW5jdGlvbihhLGMpe3ZhciBkPWMuZ2w7YS5kaXJ0eSYmYi5XZWJHTEdyYXBoaWNzLnVwZGF0ZUdyYXBoaWNzKGEsZCksYS5fd2ViR0xbZC5pZF0uZGF0YS5sZW5ndGgmJmMuc3RlbmNpbE1hbmFnZXIucHVzaFN0ZW5jaWwoYSxhLl93ZWJHTFtkLmlkXS5kYXRhWzBdLGMpfSxiLldlYkdMTWFza01hbmFnZXIucHJvdG90eXBlLnBvcE1hc2s9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmdsO2Iuc3RlbmNpbE1hbmFnZXIucG9wU3RlbmNpbChhLGEuX3dlYkdMW2MuaWRdLmRhdGFbMF0sYil9LGIuV2ViR0xNYXNrTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMubWFza1N0YWNrPW51bGwsdGhpcy5nbD1udWxsfSxiLldlYkdMU3RlbmNpbE1hbmFnZXI9ZnVuY3Rpb24oYSl7dGhpcy5zdGVuY2lsU3RhY2s9W10sdGhpcy5zZXRDb250ZXh0KGEpLHRoaXMucmV2ZXJzZT0hMCx0aGlzLmNvdW50PTB9LGIuV2ViR0xTdGVuY2lsTWFuYWdlci5wcm90b3R5cGUuc2V0Q29udGV4dD1mdW5jdGlvbihhKXt0aGlzLmdsPWF9LGIuV2ViR0xTdGVuY2lsTWFuYWdlci5wcm90b3R5cGUucHVzaFN0ZW5jaWw9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPXRoaXMuZ2w7dGhpcy5iaW5kR3JhcGhpY3MoYSxiLGMpLDA9PT10aGlzLnN0ZW5jaWxTdGFjay5sZW5ndGgmJihkLmVuYWJsZShkLlNURU5DSUxfVEVTVCksZC5jbGVhcihkLlNURU5DSUxfQlVGRkVSX0JJVCksdGhpcy5yZXZlcnNlPSEwLHRoaXMuY291bnQ9MCksdGhpcy5zdGVuY2lsU3RhY2sucHVzaChiKTt2YXIgZT10aGlzLmNvdW50O2QuY29sb3JNYXNrKCExLCExLCExLCExKSxkLnN0ZW5jaWxGdW5jKGQuQUxXQVlTLDAsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuSU5WRVJUKSwxPT09Yi5tb2RlPyhkLmRyYXdFbGVtZW50cyhkLlRSSUFOR0xFX0ZBTixiLmluZGljZXMubGVuZ3RoLTQsZC5VTlNJR05FRF9TSE9SVCwwKSx0aGlzLnJldmVyc2U/KGQuc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtZSwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5ERUNSKSk6KGQuc3RlbmNpbEZ1bmMoZC5FUVVBTCxlLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLklOQ1IpKSxkLmRyYXdFbGVtZW50cyhkLlRSSUFOR0xFX0ZBTiw0LGQuVU5TSUdORURfU0hPUlQsMiooYi5pbmRpY2VzLmxlbmd0aC00KSksdGhpcy5yZXZlcnNlP2Quc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtKGUrMSksMjU1KTpkLnN0ZW5jaWxGdW5jKGQuRVFVQUwsZSsxLDI1NSksdGhpcy5yZXZlcnNlPSF0aGlzLnJldmVyc2UpOih0aGlzLnJldmVyc2U/KGQuc3RlbmNpbEZ1bmMoZC5FUVVBTCxlLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLklOQ1IpKTooZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS1lLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLkRFQ1IpKSxkLmRyYXdFbGVtZW50cyhkLlRSSUFOR0xFX1NUUklQLGIuaW5kaWNlcy5sZW5ndGgsZC5VTlNJR05FRF9TSE9SVCwwKSx0aGlzLnJldmVyc2U/ZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUrMSwyNTUpOmQuc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtKGUrMSksMjU1KSksZC5jb2xvck1hc2soITAsITAsITAsITApLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5LRUVQKSx0aGlzLmNvdW50Kyt9LGIuV2ViR0xTdGVuY2lsTWFuYWdlci5wcm90b3R5cGUuYmluZEdyYXBoaWNzPWZ1bmN0aW9uKGEsYyxkKXt0aGlzLl9jdXJyZW50R3JhcGhpY3M9YTt2YXIgZSxmPXRoaXMuZ2wsZz1kLnByb2plY3Rpb24saD1kLm9mZnNldDsxPT09Yy5tb2RlPyhlPWQuc2hhZGVyTWFuYWdlci5jb21wbGV4UHJpbWF0aXZlU2hhZGVyLGQuc2hhZGVyTWFuYWdlci5zZXRTaGFkZXIoZSksZi51bmlmb3JtTWF0cml4M2Z2KGUudHJhbnNsYXRpb25NYXRyaXgsITEsYS53b3JsZFRyYW5zZm9ybS50b0FycmF5KCEwKSksZi51bmlmb3JtMmYoZS5wcm9qZWN0aW9uVmVjdG9yLGcueCwtZy55KSxmLnVuaWZvcm0yZihlLm9mZnNldFZlY3RvciwtaC54LC1oLnkpLGYudW5pZm9ybTNmdihlLnRpbnRDb2xvcixiLmhleDJyZ2IoYS50aW50KSksZi51bmlmb3JtM2Z2KGUuY29sb3IsYy5jb2xvciksZi51bmlmb3JtMWYoZS5hbHBoYSxhLndvcmxkQWxwaGEqYy5hbHBoYSksZi5iaW5kQnVmZmVyKGYuQVJSQVlfQlVGRkVSLGMuYnVmZmVyKSxmLnZlcnRleEF0dHJpYlBvaW50ZXIoZS5hVmVydGV4UG9zaXRpb24sMixmLkZMT0FULCExLDgsMCksZi5iaW5kQnVmZmVyKGYuRUxFTUVOVF9BUlJBWV9CVUZGRVIsYy5pbmRleEJ1ZmZlcikpOihlPWQuc2hhZGVyTWFuYWdlci5wcmltaXRpdmVTaGFkZXIsZC5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihlKSxmLnVuaWZvcm1NYXRyaXgzZnYoZS50cmFuc2xhdGlvbk1hdHJpeCwhMSxhLndvcmxkVHJhbnNmb3JtLnRvQXJyYXkoITApKSxmLnVuaWZvcm0yZihlLnByb2plY3Rpb25WZWN0b3IsZy54LC1nLnkpLGYudW5pZm9ybTJmKGUub2Zmc2V0VmVjdG9yLC1oLngsLWgueSksZi51bmlmb3JtM2Z2KGUudGludENvbG9yLGIuaGV4MnJnYihhLnRpbnQpKSxmLnVuaWZvcm0xZihlLmFscGhhLGEud29ybGRBbHBoYSksZi5iaW5kQnVmZmVyKGYuQVJSQVlfQlVGRkVSLGMuYnVmZmVyKSxmLnZlcnRleEF0dHJpYlBvaW50ZXIoZS5hVmVydGV4UG9zaXRpb24sMixmLkZMT0FULCExLDI0LDApLGYudmVydGV4QXR0cmliUG9pbnRlcihlLmNvbG9yQXR0cmlidXRlLDQsZi5GTE9BVCwhMSwyNCw4KSxmLmJpbmRCdWZmZXIoZi5FTEVNRU5UX0FSUkFZX0JVRkZFUixjLmluZGV4QnVmZmVyKSl9LGIuV2ViR0xTdGVuY2lsTWFuYWdlci5wcm90b3R5cGUucG9wU3RlbmNpbD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5nbDtpZih0aGlzLnN0ZW5jaWxTdGFjay5wb3AoKSx0aGlzLmNvdW50LS0sMD09PXRoaXMuc3RlbmNpbFN0YWNrLmxlbmd0aClkLmRpc2FibGUoZC5TVEVOQ0lMX1RFU1QpO2Vsc2V7dmFyIGU9dGhpcy5jb3VudDt0aGlzLmJpbmRHcmFwaGljcyhhLGIsYyksZC5jb2xvck1hc2soITEsITEsITEsITEpLDE9PT1iLm1vZGU/KHRoaXMucmV2ZXJzZT0hdGhpcy5yZXZlcnNlLHRoaXMucmV2ZXJzZT8oZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS0oZSsxKSwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5JTkNSKSk6KGQuc3RlbmNpbEZ1bmMoZC5FUVVBTCxlKzEsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuREVDUikpLGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfRkFOLDQsZC5VTlNJR05FRF9TSE9SVCwyKihiLmluZGljZXMubGVuZ3RoLTQpKSxkLnN0ZW5jaWxGdW5jKGQuQUxXQVlTLDAsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuSU5WRVJUKSxkLmRyYXdFbGVtZW50cyhkLlRSSUFOR0xFX0ZBTixiLmluZGljZXMubGVuZ3RoLTQsZC5VTlNJR05FRF9TSE9SVCwwKSx0aGlzLnJldmVyc2U/ZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUsMjU1KTpkLnN0ZW5jaWxGdW5jKGQuRVFVQUwsMjU1LWUsMjU1KSk6KHRoaXMucmV2ZXJzZT8oZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUrMSwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5ERUNSKSk6KGQuc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtKGUrMSksMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuSU5DUikpLGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfU1RSSVAsYi5pbmRpY2VzLmxlbmd0aCxkLlVOU0lHTkVEX1NIT1JULDApLHRoaXMucmV2ZXJzZT9kLnN0ZW5jaWxGdW5jKGQuRVFVQUwsZSwyNTUpOmQuc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtZSwyNTUpKSxkLmNvbG9yTWFzayghMCwhMCwhMCwhMCksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLktFRVApfX0sYi5XZWJHTFN0ZW5jaWxNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5tYXNrU3RhY2s9bnVsbCx0aGlzLmdsPW51bGx9LGIuV2ViR0xTaGFkZXJNYW5hZ2VyPWZ1bmN0aW9uKGEpe3RoaXMubWF4QXR0aWJzPTEwLHRoaXMuYXR0cmliU3RhdGU9W10sdGhpcy50ZW1wQXR0cmliU3RhdGU9W10sdGhpcy5zaGFkZXJNYXA9W107Zm9yKHZhciBiPTA7Yjx0aGlzLm1heEF0dGlicztiKyspdGhpcy5hdHRyaWJTdGF0ZVtiXT0hMTt0aGlzLnNldENvbnRleHQoYSl9LGIuV2ViR0xTaGFkZXJNYW5hZ2VyLnByb3RvdHlwZS5zZXRDb250ZXh0PWZ1bmN0aW9uKGEpe3RoaXMuZ2w9YSx0aGlzLnByaW1pdGl2ZVNoYWRlcj1uZXcgYi5QcmltaXRpdmVTaGFkZXIoYSksdGhpcy5jb21wbGV4UHJpbWF0aXZlU2hhZGVyPW5ldyBiLkNvbXBsZXhQcmltaXRpdmVTaGFkZXIoYSksdGhpcy5kZWZhdWx0U2hhZGVyPW5ldyBiLlBpeGlTaGFkZXIoYSksdGhpcy5mYXN0U2hhZGVyPW5ldyBiLlBpeGlGYXN0U2hhZGVyKGEpLHRoaXMuc3RyaXBTaGFkZXI9bmV3IGIuU3RyaXBTaGFkZXIoYSksdGhpcy5zZXRTaGFkZXIodGhpcy5kZWZhdWx0U2hhZGVyKX0sYi5XZWJHTFNoYWRlck1hbmFnZXIucHJvdG90eXBlLnNldEF0dHJpYnM9ZnVuY3Rpb24oYSl7dmFyIGI7Zm9yKGI9MDtiPHRoaXMudGVtcEF0dHJpYlN0YXRlLmxlbmd0aDtiKyspdGhpcy50ZW1wQXR0cmliU3RhdGVbYl09ITE7Zm9yKGI9MDtiPGEubGVuZ3RoO2IrKyl7dmFyIGM9YVtiXTt0aGlzLnRlbXBBdHRyaWJTdGF0ZVtjXT0hMH12YXIgZD10aGlzLmdsO2ZvcihiPTA7Yjx0aGlzLmF0dHJpYlN0YXRlLmxlbmd0aDtiKyspdGhpcy5hdHRyaWJTdGF0ZVtiXSE9PXRoaXMudGVtcEF0dHJpYlN0YXRlW2JdJiYodGhpcy5hdHRyaWJTdGF0ZVtiXT10aGlzLnRlbXBBdHRyaWJTdGF0ZVtiXSx0aGlzLnRlbXBBdHRyaWJTdGF0ZVtiXT9kLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGIpOmQuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGIpKX0sYi5XZWJHTFNoYWRlck1hbmFnZXIucHJvdG90eXBlLnNldFNoYWRlcj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fY3VycmVudElkPT09YS5fVUlEPyExOih0aGlzLl9jdXJyZW50SWQ9YS5fVUlELHRoaXMuY3VycmVudFNoYWRlcj1hLHRoaXMuZ2wudXNlUHJvZ3JhbShhLnByb2dyYW0pLHRoaXMuc2V0QXR0cmlicyhhLmF0dHJpYnV0ZXMpLCEwKX0sYi5XZWJHTFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmF0dHJpYlN0YXRlPW51bGwsdGhpcy50ZW1wQXR0cmliU3RhdGU9bnVsbCx0aGlzLnByaW1pdGl2ZVNoYWRlci5kZXN0cm95KCksdGhpcy5kZWZhdWx0U2hhZGVyLmRlc3Ryb3koKSx0aGlzLmZhc3RTaGFkZXIuZGVzdHJveSgpLHRoaXMuc3RyaXBTaGFkZXIuZGVzdHJveSgpLHRoaXMuZ2w9bnVsbH0sYi5XZWJHTFNwcml0ZUJhdGNoPWZ1bmN0aW9uKGEpe3RoaXMudmVydFNpemU9Nix0aGlzLnNpemU9MmUzO3ZhciBiPTQqdGhpcy5zaXplKnRoaXMudmVydFNpemUsYz02KnRoaXMuc2l6ZTt0aGlzLnZlcnRpY2VzPW5ldyBGbG9hdDMyQXJyYXkoYiksdGhpcy5pbmRpY2VzPW5ldyBVaW50MTZBcnJheShjKSx0aGlzLmxhc3RJbmRleENvdW50PTA7Zm9yKHZhciBkPTAsZT0wO2M+ZDtkKz02LGUrPTQpdGhpcy5pbmRpY2VzW2QrMF09ZSswLHRoaXMuaW5kaWNlc1tkKzFdPWUrMSx0aGlzLmluZGljZXNbZCsyXT1lKzIsdGhpcy5pbmRpY2VzW2QrM109ZSswLHRoaXMuaW5kaWNlc1tkKzRdPWUrMix0aGlzLmluZGljZXNbZCs1XT1lKzM7dGhpcy5kcmF3aW5nPSExLHRoaXMuY3VycmVudEJhdGNoU2l6ZT0wLHRoaXMuY3VycmVudEJhc2VUZXh0dXJlPW51bGwsdGhpcy5zZXRDb250ZXh0KGEpLHRoaXMuZGlydHk9ITAsdGhpcy50ZXh0dXJlcz1bXSx0aGlzLmJsZW5kTW9kZXM9W119LGIuV2ViR0xTcHJpdGVCYXRjaC5wcm90b3R5cGUuc2V0Q29udGV4dD1mdW5jdGlvbihhKXt0aGlzLmdsPWEsdGhpcy52ZXJ0ZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLmluZGV4QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRpY2VzLGEuU1RBVElDX0RSQVcpLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGljZXMsYS5EWU5BTUlDX0RSQVcpLHRoaXMuY3VycmVudEJsZW5kTW9kZT05OTk5OX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5iZWdpbj1mdW5jdGlvbihhKXt0aGlzLnJlbmRlclNlc3Npb249YSx0aGlzLnNoYWRlcj10aGlzLnJlbmRlclNlc3Npb24uc2hhZGVyTWFuYWdlci5kZWZhdWx0U2hhZGVyLHRoaXMuc3RhcnQoKX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5lbmQ9ZnVuY3Rpb24oKXt0aGlzLmZsdXNoKCl9LGIuV2ViR0xTcHJpdGVCYXRjaC5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKGEpe3ZhciBiPWEudGV4dHVyZTt0aGlzLmN1cnJlbnRCYXRjaFNpemU+PXRoaXMuc2l6ZSYmKHRoaXMuZmx1c2goKSx0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZT1iLmJhc2VUZXh0dXJlKTt2YXIgYz1iLl91dnM7aWYoYyl7dmFyIGQsZSxmLGcsaD1hLndvcmxkQWxwaGEsaT1hLnRpbnQsaj10aGlzLnZlcnRpY2VzLGs9YS5hbmNob3IueCxsPWEuYW5jaG9yLnk7aWYoYi50cmltKXt2YXIgbT1iLnRyaW07ZT1tLngtayptLndpZHRoLGQ9ZStiLmNyb3Aud2lkdGgsZz1tLnktbCptLmhlaWdodCxmPWcrYi5jcm9wLmhlaWdodH1lbHNlIGQ9Yi5mcmFtZS53aWR0aCooMS1rKSxlPWIuZnJhbWUud2lkdGgqLWssZj1iLmZyYW1lLmhlaWdodCooMS1sKSxnPWIuZnJhbWUuaGVpZ2h0Ki1sO3ZhciBuPTQqdGhpcy5jdXJyZW50QmF0Y2hTaXplKnRoaXMudmVydFNpemUsbz1hLndvcmxkVHJhbnNmb3JtLHA9by5hLHE9by5jLHI9by5iLHM9by5kLHQ9by50eCx1PW8udHk7altuKytdPXAqZStyKmcrdCxqW24rK109cypnK3EqZSt1LGpbbisrXT1jLngwLGpbbisrXT1jLnkwLGpbbisrXT1oLGpbbisrXT1pLGpbbisrXT1wKmQrcipnK3QsaltuKytdPXMqZytxKmQrdSxqW24rK109Yy54MSxqW24rK109Yy55MSxqW24rK109aCxqW24rK109aSxqW24rK109cCpkK3IqZit0LGpbbisrXT1zKmYrcSpkK3UsaltuKytdPWMueDIsaltuKytdPWMueTIsaltuKytdPWgsaltuKytdPWksaltuKytdPXAqZStyKmYrdCxqW24rK109cypmK3EqZSt1LGpbbisrXT1jLngzLGpbbisrXT1jLnkzLGpbbisrXT1oLGpbbisrXT1pLHRoaXMudGV4dHVyZXNbdGhpcy5jdXJyZW50QmF0Y2hTaXplXT1hLnRleHR1cmUuYmFzZVRleHR1cmUsdGhpcy5ibGVuZE1vZGVzW3RoaXMuY3VycmVudEJhdGNoU2l6ZV09YS5ibGVuZE1vZGUsdGhpcy5jdXJyZW50QmF0Y2hTaXplKyt9fSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLnJlbmRlclRpbGluZ1Nwcml0ZT1mdW5jdGlvbihhKXt2YXIgYz1hLnRpbGluZ1RleHR1cmU7dGhpcy5jdXJyZW50QmF0Y2hTaXplPj10aGlzLnNpemUmJih0aGlzLmZsdXNoKCksdGhpcy5jdXJyZW50QmFzZVRleHR1cmU9Yy5iYXNlVGV4dHVyZSksYS5fdXZzfHwoYS5fdXZzPW5ldyBiLlRleHR1cmVVdnMpO3ZhciBkPWEuX3V2czthLnRpbGVQb3NpdGlvbi54JT1jLmJhc2VUZXh0dXJlLndpZHRoKmEudGlsZVNjYWxlT2Zmc2V0LngsYS50aWxlUG9zaXRpb24ueSU9Yy5iYXNlVGV4dHVyZS5oZWlnaHQqYS50aWxlU2NhbGVPZmZzZXQueTt2YXIgZT1hLnRpbGVQb3NpdGlvbi54LyhjLmJhc2VUZXh0dXJlLndpZHRoKmEudGlsZVNjYWxlT2Zmc2V0LngpLGY9YS50aWxlUG9zaXRpb24ueS8oYy5iYXNlVGV4dHVyZS5oZWlnaHQqYS50aWxlU2NhbGVPZmZzZXQueSksZz1hLndpZHRoL2MuYmFzZVRleHR1cmUud2lkdGgvKGEudGlsZVNjYWxlLngqYS50aWxlU2NhbGVPZmZzZXQueCksaD1hLmhlaWdodC9jLmJhc2VUZXh0dXJlLmhlaWdodC8oYS50aWxlU2NhbGUueSphLnRpbGVTY2FsZU9mZnNldC55KTtkLngwPTAtZSxkLnkwPTAtZixkLngxPTEqZy1lLGQueTE9MC1mLGQueDI9MSpnLWUsZC55Mj0xKmgtZixkLngzPTAtZSxkLnkzPTEqaC1mO3ZhciBpPWEud29ybGRBbHBoYSxqPWEudGludCxrPXRoaXMudmVydGljZXMsbD1hLndpZHRoLG09YS5oZWlnaHQsbj1hLmFuY2hvci54LG89YS5hbmNob3IueSxwPWwqKDEtbikscT1sKi1uLHI9bSooMS1vKSxzPW0qLW8sdD00KnRoaXMuY3VycmVudEJhdGNoU2l6ZSp0aGlzLnZlcnRTaXplLHU9YS53b3JsZFRyYW5zZm9ybSx2PXUuYSx3PXUuYyx4PXUuYix5PXUuZCx6PXUudHgsQT11LnR5O2tbdCsrXT12KnEreCpzK3osa1t0KytdPXkqcyt3KnErQSxrW3QrK109ZC54MCxrW3QrK109ZC55MCxrW3QrK109aSxrW3QrK109aixrW3QrK109dipwK3gqcyt6LGtbdCsrXT15KnMrdypwK0Esa1t0KytdPWQueDEsa1t0KytdPWQueTEsa1t0KytdPWksa1t0KytdPWosa1t0KytdPXYqcCt4KnIreixrW3QrK109eSpyK3cqcCtBLGtbdCsrXT1kLngyLGtbdCsrXT1kLnkyLGtbdCsrXT1pLGtbdCsrXT1qLGtbdCsrXT12KnEreCpyK3osa1t0KytdPXkqcit3KnErQSxrW3QrK109ZC54MyxrW3QrK109ZC55MyxrW3QrK109aSxrW3QrK109aix0aGlzLnRleHR1cmVzW3RoaXMuY3VycmVudEJhdGNoU2l6ZV09Yy5iYXNlVGV4dHVyZSx0aGlzLmJsZW5kTW9kZXNbdGhpcy5jdXJyZW50QmF0Y2hTaXplXT1hLmJsZW5kTW9kZSx0aGlzLmN1cnJlbnRCYXRjaFNpemUrK30sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe2lmKDAhPT10aGlzLmN1cnJlbnRCYXRjaFNpemUpe3ZhciBhPXRoaXMuZ2w7aWYodGhpcy5yZW5kZXJTZXNzaW9uLnNoYWRlck1hbmFnZXIuc2V0U2hhZGVyKHRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLmRlZmF1bHRTaGFkZXIpLHRoaXMuZGlydHkpe3RoaXMuZGlydHk9ITEsYS5hY3RpdmVUZXh0dXJlKGEuVEVYVFVSRTApLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlcik7dmFyIGI9dGhpcy5yZW5kZXJTZXNzaW9uLnByb2plY3Rpb247YS51bmlmb3JtMmYodGhpcy5zaGFkZXIucHJvamVjdGlvblZlY3RvcixiLngsYi55KTt2YXIgYz00KnRoaXMudmVydFNpemU7YS52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuc2hhZGVyLmFWZXJ0ZXhQb3NpdGlvbiwyLGEuRkxPQVQsITEsYywwKSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVRleHR1cmVDb29yZCwyLGEuRkxPQVQsITEsYyw4KSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuY29sb3JBdHRyaWJ1dGUsMixhLkZMT0FULCExLGMsMTYpfWlmKHRoaXMuY3VycmVudEJhdGNoU2l6ZT4uNSp0aGlzLnNpemUpYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy52ZXJ0aWNlcyk7ZWxzZXt2YXIgZD10aGlzLnZlcnRpY2VzLnN1YmFycmF5KDAsNCp0aGlzLmN1cnJlbnRCYXRjaFNpemUqdGhpcy52ZXJ0U2l6ZSk7YS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsZCl9Zm9yKHZhciBlLGYsZz0wLGg9MCxpPW51bGwsaj10aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlci5jdXJyZW50QmxlbmRNb2RlLGs9MCxsPXRoaXMuY3VycmVudEJhdGNoU2l6ZTtsPms7aysrKWU9dGhpcy50ZXh0dXJlc1trXSxmPXRoaXMuYmxlbmRNb2Rlc1trXSwoaSE9PWV8fGohPT1mKSYmKHRoaXMucmVuZGVyQmF0Y2goaSxnLGgpLGg9ayxnPTAsaT1lLGo9Zix0aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlci5zZXRCbGVuZE1vZGUoaikpLGcrKzt0aGlzLnJlbmRlckJhdGNoKGksZyxoKSx0aGlzLmN1cnJlbnRCYXRjaFNpemU9MH19LGIuV2ViR0xTcHJpdGVCYXRjaC5wcm90b3R5cGUucmVuZGVyQmF0Y2g9ZnVuY3Rpb24oYSxjLGQpe2lmKDAhPT1jKXt2YXIgZT10aGlzLmdsO2UuYmluZFRleHR1cmUoZS5URVhUVVJFXzJELGEuX2dsVGV4dHVyZXNbZS5pZF18fGIuY3JlYXRlV2ViR0xUZXh0dXJlKGEsZSkpLGEuX2RpcnR5W2UuaWRdJiZiLnVwZGF0ZVdlYkdMVGV4dHVyZSh0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZSxlKSxlLmRyYXdFbGVtZW50cyhlLlRSSUFOR0xFUyw2KmMsZS5VTlNJR05FRF9TSE9SVCw2KmQqMiksdGhpcy5yZW5kZXJTZXNzaW9uLmRyYXdDb3VudCsrfX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5mbHVzaCgpfSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dGhpcy5kaXJ0eT0hMH0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy52ZXJ0aWNlcz1udWxsLHRoaXMuaW5kaWNlcz1udWxsLHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMudmVydGV4QnVmZmVyKSx0aGlzLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLmluZGV4QnVmZmVyKSx0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZT1udWxsLHRoaXMuZ2w9bnVsbH0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaD1mdW5jdGlvbihhKXt0aGlzLnZlcnRTaXplPTEwLHRoaXMubWF4U2l6ZT02ZTMsdGhpcy5zaXplPXRoaXMubWF4U2l6ZTt2YXIgYj00KnRoaXMuc2l6ZSp0aGlzLnZlcnRTaXplLGM9Nip0aGlzLm1heFNpemU7dGhpcy52ZXJ0aWNlcz1uZXcgRmxvYXQzMkFycmF5KGIpLHRoaXMuaW5kaWNlcz1uZXcgVWludDE2QXJyYXkoYyksdGhpcy52ZXJ0ZXhCdWZmZXI9bnVsbCx0aGlzLmluZGV4QnVmZmVyPW51bGwsdGhpcy5sYXN0SW5kZXhDb3VudD0wO2Zvcih2YXIgZD0wLGU9MDtjPmQ7ZCs9NixlKz00KXRoaXMuaW5kaWNlc1tkKzBdPWUrMCx0aGlzLmluZGljZXNbZCsxXT1lKzEsdGhpcy5pbmRpY2VzW2QrMl09ZSsyLHRoaXMuaW5kaWNlc1tkKzNdPWUrMCx0aGlzLmluZGljZXNbZCs0XT1lKzIsdGhpcy5pbmRpY2VzW2QrNV09ZSszO3RoaXMuZHJhd2luZz0hMSx0aGlzLmN1cnJlbnRCYXRjaFNpemU9MCx0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZT1udWxsLHRoaXMuY3VycmVudEJsZW5kTW9kZT0wLHRoaXMucmVuZGVyU2Vzc2lvbj1udWxsLHRoaXMuc2hhZGVyPW51bGwsdGhpcy5tYXRyaXg9bnVsbCx0aGlzLnNldENvbnRleHQoYSl9LGIuV2ViR0xGYXN0U3ByaXRlQmF0Y2gucHJvdG90eXBlLnNldENvbnRleHQ9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hLHRoaXMudmVydGV4QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksdGhpcy5pbmRleEJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLGEuYmluZEJ1ZmZlcihhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kZXhCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kaWNlcyxhLlNUQVRJQ19EUkFXKSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0ZXhCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRpY2VzLGEuRFlOQU1JQ19EUkFXKX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUuYmVnaW49ZnVuY3Rpb24oYSxiKXt0aGlzLnJlbmRlclNlc3Npb249Yix0aGlzLnNoYWRlcj10aGlzLnJlbmRlclNlc3Npb24uc2hhZGVyTWFuYWdlci5mYXN0U2hhZGVyLHRoaXMubWF0cml4PWEud29ybGRUcmFuc2Zvcm0udG9BcnJheSghMCksdGhpcy5zdGFydCgpfSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5lbmQ9ZnVuY3Rpb24oKXt0aGlzLmZsdXNoKCl9LGIuV2ViR0xGYXN0U3ByaXRlQmF0Y2gucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihhKXt2YXIgYj1hLmNoaWxkcmVuLGM9YlswXTtpZihjLnRleHR1cmUuX3V2cyl7dGhpcy5jdXJyZW50QmFzZVRleHR1cmU9Yy50ZXh0dXJlLmJhc2VUZXh0dXJlLGMuYmxlbmRNb2RlIT09dGhpcy5yZW5kZXJTZXNzaW9uLmJsZW5kTW9kZU1hbmFnZXIuY3VycmVudEJsZW5kTW9kZSYmKHRoaXMuZmx1c2goKSx0aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlci5zZXRCbGVuZE1vZGUoYy5ibGVuZE1vZGUpKTtmb3IodmFyIGQ9MCxlPWIubGVuZ3RoO2U+ZDtkKyspdGhpcy5yZW5kZXJTcHJpdGUoYltkXSk7dGhpcy5mbHVzaCgpfX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUucmVuZGVyU3ByaXRlPWZ1bmN0aW9uKGEpe2lmKGEudmlzaWJsZSYmKGEudGV4dHVyZS5iYXNlVGV4dHVyZT09PXRoaXMuY3VycmVudEJhc2VUZXh0dXJlfHwodGhpcy5mbHVzaCgpLHRoaXMuY3VycmVudEJhc2VUZXh0dXJlPWEudGV4dHVyZS5iYXNlVGV4dHVyZSxhLnRleHR1cmUuX3V2cykpKXt2YXIgYixjLGQsZSxmLGcsaCxpLGo9dGhpcy52ZXJ0aWNlcztpZihiPWEudGV4dHVyZS5fdXZzLGM9YS50ZXh0dXJlLmZyYW1lLndpZHRoLGQ9YS50ZXh0dXJlLmZyYW1lLmhlaWdodCxhLnRleHR1cmUudHJpbSl7dmFyIGs9YS50ZXh0dXJlLnRyaW07Zj1rLngtYS5hbmNob3IueCprLndpZHRoLGU9ZithLnRleHR1cmUuY3JvcC53aWR0aCxoPWsueS1hLmFuY2hvci55KmsuaGVpZ2h0LGc9aCthLnRleHR1cmUuY3JvcC5oZWlnaHR9ZWxzZSBlPWEudGV4dHVyZS5mcmFtZS53aWR0aCooMS1hLmFuY2hvci54KSxmPWEudGV4dHVyZS5mcmFtZS53aWR0aCotYS5hbmNob3IueCxnPWEudGV4dHVyZS5mcmFtZS5oZWlnaHQqKDEtYS5hbmNob3IueSksaD1hLnRleHR1cmUuZnJhbWUuaGVpZ2h0Ki1hLmFuY2hvci55O2k9NCp0aGlzLmN1cnJlbnRCYXRjaFNpemUqdGhpcy52ZXJ0U2l6ZSxqW2krK109ZixqW2krK109aCxqW2krK109YS5wb3NpdGlvbi54LGpbaSsrXT1hLnBvc2l0aW9uLnksaltpKytdPWEuc2NhbGUueCxqW2krK109YS5zY2FsZS55LGpbaSsrXT1hLnJvdGF0aW9uLGpbaSsrXT1iLngwLGpbaSsrXT1iLnkxLGpbaSsrXT1hLmFscGhhLGpbaSsrXT1lLGpbaSsrXT1oLGpbaSsrXT1hLnBvc2l0aW9uLngsaltpKytdPWEucG9zaXRpb24ueSxqW2krK109YS5zY2FsZS54LGpbaSsrXT1hLnNjYWxlLnksaltpKytdPWEucm90YXRpb24saltpKytdPWIueDEsaltpKytdPWIueTEsaltpKytdPWEuYWxwaGEsaltpKytdPWUsaltpKytdPWcsaltpKytdPWEucG9zaXRpb24ueCxqW2krK109YS5wb3NpdGlvbi55LGpbaSsrXT1hLnNjYWxlLngsaltpKytdPWEuc2NhbGUueSxqW2krK109YS5yb3RhdGlvbixqW2krK109Yi54MixqW2krK109Yi55MixqW2krK109YS5hbHBoYSxqW2krK109ZixqW2krK109ZyxqW2krK109YS5wb3NpdGlvbi54LGpbaSsrXT1hLnBvc2l0aW9uLnksaltpKytdPWEuc2NhbGUueCxqW2krK109YS5zY2FsZS55LGpbaSsrXT1hLnJvdGF0aW9uLGpbaSsrXT1iLngzLGpbaSsrXT1iLnkzLGpbaSsrXT1hLmFscGhhLHRoaXMuY3VycmVudEJhdGNoU2l6ZSsrLHRoaXMuY3VycmVudEJhdGNoU2l6ZT49dGhpcy5zaXplJiZ0aGlzLmZsdXNoKCl9fSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe2lmKDAhPT10aGlzLmN1cnJlbnRCYXRjaFNpemUpe3ZhciBhPXRoaXMuZ2w7aWYodGhpcy5jdXJyZW50QmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbYS5pZF18fGIuY3JlYXRlV2ViR0xUZXh0dXJlKHRoaXMuY3VycmVudEJhc2VUZXh0dXJlLGEpLGEuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELHRoaXMuY3VycmVudEJhc2VUZXh0dXJlLl9nbFRleHR1cmVzW2EuaWRdKSx0aGlzLmN1cnJlbnRCYXRjaFNpemU+LjUqdGhpcy5zaXplKWEuYnVmZmVyU3ViRGF0YShhLkFSUkFZX0JVRkZFUiwwLHRoaXMudmVydGljZXMpO2Vsc2V7dmFyIGM9dGhpcy52ZXJ0aWNlcy5zdWJhcnJheSgwLDQqdGhpcy5jdXJyZW50QmF0Y2hTaXplKnRoaXMudmVydFNpemUpO2EuYnVmZmVyU3ViRGF0YShhLkFSUkFZX0JVRkZFUiwwLGMpfWEuZHJhd0VsZW1lbnRzKGEuVFJJQU5HTEVTLDYqdGhpcy5jdXJyZW50QmF0Y2hTaXplLGEuVU5TSUdORURfU0hPUlQsMCksdGhpcy5jdXJyZW50QmF0Y2hTaXplPTAsdGhpcy5yZW5kZXJTZXNzaW9uLmRyYXdDb3VudCsrfX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuZmx1c2goKX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO2EuYWN0aXZlVGV4dHVyZShhLlRFWFRVUkUwKSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0ZXhCdWZmZXIpLGEuYmluZEJ1ZmZlcihhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kZXhCdWZmZXIpO3ZhciBiPXRoaXMucmVuZGVyU2Vzc2lvbi5wcm9qZWN0aW9uO2EudW5pZm9ybTJmKHRoaXMuc2hhZGVyLnByb2plY3Rpb25WZWN0b3IsYi54LGIueSksYS51bmlmb3JtTWF0cml4M2Z2KHRoaXMuc2hhZGVyLnVNYXRyaXgsITEsdGhpcy5tYXRyaXgpO3ZhciBjPTQqdGhpcy52ZXJ0U2l6ZTthLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVZlcnRleFBvc2l0aW9uLDIsYS5GTE9BVCwhMSxjLDApLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hUG9zaXRpb25Db29yZCwyLGEuRkxPQVQsITEsYyw4KSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVNjYWxlLDIsYS5GTE9BVCwhMSxjLDE2KSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVJvdGF0aW9uLDEsYS5GTE9BVCwhMSxjLDI0KSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVRleHR1cmVDb29yZCwyLGEuRkxPQVQsITEsYywyOCksYS52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuc2hhZGVyLmNvbG9yQXR0cmlidXRlLDEsYS5GTE9BVCwhMSxjLDM2KX0sYi5XZWJHTEZpbHRlck1hbmFnZXI9ZnVuY3Rpb24oYSxiKXt0aGlzLnRyYW5zcGFyZW50PWIsdGhpcy5maWx0ZXJTdGFjaz1bXSx0aGlzLm9mZnNldFg9MCx0aGlzLm9mZnNldFk9MCx0aGlzLnNldENvbnRleHQoYSl9LGIuV2ViR0xGaWx0ZXJNYW5hZ2VyLnByb3RvdHlwZS5zZXRDb250ZXh0PWZ1bmN0aW9uKGEpe3RoaXMuZ2w9YSx0aGlzLnRleHR1cmVQb29sPVtdLHRoaXMuaW5pdFNoYWRlckJ1ZmZlcnMoKX0sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLmJlZ2luPWZ1bmN0aW9uKGEsYil7dGhpcy5yZW5kZXJTZXNzaW9uPWEsdGhpcy5kZWZhdWx0U2hhZGVyPWEuc2hhZGVyTWFuYWdlci5kZWZhdWx0U2hhZGVyO3ZhciBjPXRoaXMucmVuZGVyU2Vzc2lvbi5wcm9qZWN0aW9uO3RoaXMud2lkdGg9MipjLngsdGhpcy5oZWlnaHQ9MiotYy55LHRoaXMuYnVmZmVyPWJ9LGIuV2ViR0xGaWx0ZXJNYW5hZ2VyLnByb3RvdHlwZS5wdXNoRmlsdGVyPWZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMuZ2wsZD10aGlzLnJlbmRlclNlc3Npb24ucHJvamVjdGlvbixlPXRoaXMucmVuZGVyU2Vzc2lvbi5vZmZzZXQ7YS5fZmlsdGVyQXJlYT1hLnRhcmdldC5maWx0ZXJBcmVhfHxhLnRhcmdldC5nZXRCb3VuZHMoKSx0aGlzLmZpbHRlclN0YWNrLnB1c2goYSk7dmFyIGY9YS5maWx0ZXJQYXNzZXNbMF07dGhpcy5vZmZzZXRYKz1hLl9maWx0ZXJBcmVhLngsdGhpcy5vZmZzZXRZKz1hLl9maWx0ZXJBcmVhLnk7dmFyIGc9dGhpcy50ZXh0dXJlUG9vbC5wb3AoKTtnP2cucmVzaXplKHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpOmc9bmV3IGIuRmlsdGVyVGV4dHVyZSh0aGlzLmdsLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLGMuYmluZFRleHR1cmUoYy5URVhUVVJFXzJELGcudGV4dHVyZSk7dmFyIGg9YS5fZmlsdGVyQXJlYSxpPWYucGFkZGluZztoLngtPWksaC55LT1pLGgud2lkdGgrPTIqaSxoLmhlaWdodCs9MippLGgueDwwJiYoaC54PTApLGgud2lkdGg+dGhpcy53aWR0aCYmKGgud2lkdGg9dGhpcy53aWR0aCksaC55PDAmJihoLnk9MCksaC5oZWlnaHQ+dGhpcy5oZWlnaHQmJihoLmhlaWdodD10aGlzLmhlaWdodCksYy5iaW5kRnJhbWVidWZmZXIoYy5GUkFNRUJVRkZFUixnLmZyYW1lQnVmZmVyKSxjLnZpZXdwb3J0KDAsMCxoLndpZHRoLGguaGVpZ2h0KSxkLng9aC53aWR0aC8yLGQueT0taC5oZWlnaHQvMixlLng9LWgueCxlLnk9LWgueSx0aGlzLnJlbmRlclNlc3Npb24uc2hhZGVyTWFuYWdlci5zZXRTaGFkZXIodGhpcy5kZWZhdWx0U2hhZGVyKSxjLnVuaWZvcm0yZih0aGlzLmRlZmF1bHRTaGFkZXIucHJvamVjdGlvblZlY3RvcixoLndpZHRoLzIsLWguaGVpZ2h0LzIpLGMudW5pZm9ybTJmKHRoaXMuZGVmYXVsdFNoYWRlci5vZmZzZXRWZWN0b3IsLWgueCwtaC55KSxjLmNvbG9yTWFzayghMCwhMCwhMCwhMCksYy5jbGVhckNvbG9yKDAsMCwwLDApLGMuY2xlYXIoYy5DT0xPUl9CVUZGRVJfQklUKSxhLl9nbEZpbHRlclRleHR1cmU9Z30sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLnBvcEZpbHRlcj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2wsYz10aGlzLmZpbHRlclN0YWNrLnBvcCgpLGQ9Yy5fZmlsdGVyQXJlYSxlPWMuX2dsRmlsdGVyVGV4dHVyZSxmPXRoaXMucmVuZGVyU2Vzc2lvbi5wcm9qZWN0aW9uLGc9dGhpcy5yZW5kZXJTZXNzaW9uLm9mZnNldDtpZihjLmZpbHRlclBhc3Nlcy5sZW5ndGg+MSl7YS52aWV3cG9ydCgwLDAsZC53aWR0aCxkLmhlaWdodCksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QnVmZmVyKSx0aGlzLnZlcnRleEFycmF5WzBdPTAsdGhpcy52ZXJ0ZXhBcnJheVsxXT1kLmhlaWdodCx0aGlzLnZlcnRleEFycmF5WzJdPWQud2lkdGgsdGhpcy52ZXJ0ZXhBcnJheVszXT1kLmhlaWdodCx0aGlzLnZlcnRleEFycmF5WzRdPTAsdGhpcy52ZXJ0ZXhBcnJheVs1XT0wLHRoaXMudmVydGV4QXJyYXlbNl09ZC53aWR0aCx0aGlzLnZlcnRleEFycmF5WzddPTAsYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy52ZXJ0ZXhBcnJheSksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudXZCdWZmZXIpLHRoaXMudXZBcnJheVsyXT1kLndpZHRoL3RoaXMud2lkdGgsdGhpcy51dkFycmF5WzVdPWQuaGVpZ2h0L3RoaXMuaGVpZ2h0LHRoaXMudXZBcnJheVs2XT1kLndpZHRoL3RoaXMud2lkdGgsdGhpcy51dkFycmF5WzddPWQuaGVpZ2h0L3RoaXMuaGVpZ2h0LGEuYnVmZmVyU3ViRGF0YShhLkFSUkFZX0JVRkZFUiwwLHRoaXMudXZBcnJheSk7dmFyIGg9ZSxpPXRoaXMudGV4dHVyZVBvb2wucG9wKCk7aXx8KGk9bmV3IGIuRmlsdGVyVGV4dHVyZSh0aGlzLmdsLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpKSxpLnJlc2l6ZSh0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSxhLmJpbmRGcmFtZWJ1ZmZlcihhLkZSQU1FQlVGRkVSLGkuZnJhbWVCdWZmZXIpLGEuY2xlYXIoYS5DT0xPUl9CVUZGRVJfQklUKSxhLmRpc2FibGUoYS5CTEVORCk7Zm9yKHZhciBqPTA7ajxjLmZpbHRlclBhc3Nlcy5sZW5ndGgtMTtqKyspe3ZhciBrPWMuZmlsdGVyUGFzc2VzW2pdO2EuYmluZEZyYW1lYnVmZmVyKGEuRlJBTUVCVUZGRVIsaS5mcmFtZUJ1ZmZlciksYS5hY3RpdmVUZXh0dXJlKGEuVEVYVFVSRTApLGEuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELGgudGV4dHVyZSksdGhpcy5hcHBseUZpbHRlclBhc3MoayxkLGQud2lkdGgsZC5oZWlnaHQpO3ZhciBsPWg7aD1pLGk9bH1hLmVuYWJsZShhLkJMRU5EKSxlPWgsdGhpcy50ZXh0dXJlUG9vbC5wdXNoKGkpfXZhciBtPWMuZmlsdGVyUGFzc2VzW2MuZmlsdGVyUGFzc2VzLmxlbmd0aC0xXTt0aGlzLm9mZnNldFgtPWQueCx0aGlzLm9mZnNldFktPWQueTt2YXIgbj10aGlzLndpZHRoLG89dGhpcy5oZWlnaHQscD0wLHE9MCxyPXRoaXMuYnVmZmVyO2lmKDA9PT10aGlzLmZpbHRlclN0YWNrLmxlbmd0aClhLmNvbG9yTWFzayghMCwhMCwhMCwhMCk7ZWxzZXt2YXIgcz10aGlzLmZpbHRlclN0YWNrW3RoaXMuZmlsdGVyU3RhY2subGVuZ3RoLTFdO2Q9cy5fZmlsdGVyQXJlYSxuPWQud2lkdGgsbz1kLmhlaWdodCxwPWQueCxxPWQueSxyPXMuX2dsRmlsdGVyVGV4dHVyZS5mcmFtZUJ1ZmZlcn1mLng9bi8yLGYueT0tby8yLGcueD1wLGcueT1xLGQ9Yy5fZmlsdGVyQXJlYTt2YXIgdD1kLngtcCx1PWQueS1xO2EuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksdGhpcy52ZXJ0ZXhBcnJheVswXT10LHRoaXMudmVydGV4QXJyYXlbMV09dStkLmhlaWdodCx0aGlzLnZlcnRleEFycmF5WzJdPXQrZC53aWR0aCx0aGlzLnZlcnRleEFycmF5WzNdPXUrZC5oZWlnaHQsdGhpcy52ZXJ0ZXhBcnJheVs0XT10LHRoaXMudmVydGV4QXJyYXlbNV09dSx0aGlzLnZlcnRleEFycmF5WzZdPXQrZC53aWR0aCx0aGlzLnZlcnRleEFycmF5WzddPXUsYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy52ZXJ0ZXhBcnJheSksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudXZCdWZmZXIpLHRoaXMudXZBcnJheVsyXT1kLndpZHRoL3RoaXMud2lkdGgsdGhpcy51dkFycmF5WzVdPWQuaGVpZ2h0L3RoaXMuaGVpZ2h0LHRoaXMudXZBcnJheVs2XT1kLndpZHRoL3RoaXMud2lkdGgsdGhpcy51dkFycmF5WzddPWQuaGVpZ2h0L3RoaXMuaGVpZ2h0LGEuYnVmZmVyU3ViRGF0YShhLkFSUkFZX0JVRkZFUiwwLHRoaXMudXZBcnJheSksYS52aWV3cG9ydCgwLDAsbixvKSxhLmJpbmRGcmFtZWJ1ZmZlcihhLkZSQU1FQlVGRkVSLHIpLGEuYWN0aXZlVGV4dHVyZShhLlRFWFRVUkUwKSxhLmJpbmRUZXh0dXJlKGEuVEVYVFVSRV8yRCxlLnRleHR1cmUpLHRoaXMuYXBwbHlGaWx0ZXJQYXNzKG0sZCxuLG8pLHRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcih0aGlzLmRlZmF1bHRTaGFkZXIpLGEudW5pZm9ybTJmKHRoaXMuZGVmYXVsdFNoYWRlci5wcm9qZWN0aW9uVmVjdG9yLG4vMiwtby8yKSxhLnVuaWZvcm0yZih0aGlzLmRlZmF1bHRTaGFkZXIub2Zmc2V0VmVjdG9yLC1wLC1xKSx0aGlzLnRleHR1cmVQb29sLnB1c2goZSksYy5fZ2xGaWx0ZXJUZXh0dXJlPW51bGx9LGIuV2ViR0xGaWx0ZXJNYW5hZ2VyLnByb3RvdHlwZS5hcHBseUZpbHRlclBhc3M9ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGY9dGhpcy5nbCxnPWEuc2hhZGVyc1tmLmlkXTtnfHwoZz1uZXcgYi5QaXhpU2hhZGVyKGYpLGcuZnJhZ21lbnRTcmM9YS5mcmFnbWVudFNyYyxnLnVuaWZvcm1zPWEudW5pZm9ybXMsZy5pbml0KCksYS5zaGFkZXJzW2YuaWRdPWcpLHRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihnKSxmLnVuaWZvcm0yZihnLnByb2plY3Rpb25WZWN0b3IsZC8yLC1lLzIpLGYudW5pZm9ybTJmKGcub2Zmc2V0VmVjdG9yLDAsMCksYS51bmlmb3Jtcy5kaW1lbnNpb25zJiYoYS51bmlmb3Jtcy5kaW1lbnNpb25zLnZhbHVlWzBdPXRoaXMud2lkdGgsYS51bmlmb3Jtcy5kaW1lbnNpb25zLnZhbHVlWzFdPXRoaXMuaGVpZ2h0LGEudW5pZm9ybXMuZGltZW5zaW9ucy52YWx1ZVsyXT10aGlzLnZlcnRleEFycmF5WzBdLGEudW5pZm9ybXMuZGltZW5zaW9ucy52YWx1ZVszXT10aGlzLnZlcnRleEFycmF5WzVdKSxnLnN5bmNVbmlmb3JtcygpLGYuYmluZEJ1ZmZlcihmLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksZi52ZXJ0ZXhBdHRyaWJQb2ludGVyKGcuYVZlcnRleFBvc2l0aW9uLDIsZi5GTE9BVCwhMSwwLDApLGYuYmluZEJ1ZmZlcihmLkFSUkFZX0JVRkZFUix0aGlzLnV2QnVmZmVyKSxmLnZlcnRleEF0dHJpYlBvaW50ZXIoZy5hVGV4dHVyZUNvb3JkLDIsZi5GTE9BVCwhMSwwLDApLGYuYmluZEJ1ZmZlcihmLkFSUkFZX0JVRkZFUix0aGlzLmNvbG9yQnVmZmVyKSxmLnZlcnRleEF0dHJpYlBvaW50ZXIoZy5jb2xvckF0dHJpYnV0ZSwyLGYuRkxPQVQsITEsMCwwKSxmLmJpbmRCdWZmZXIoZi5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGV4QnVmZmVyKSxmLmRyYXdFbGVtZW50cyhmLlRSSUFOR0xFUyw2LGYuVU5TSUdORURfU0hPUlQsMCksdGhpcy5yZW5kZXJTZXNzaW9uLmRyYXdDb3VudCsrfSxiLldlYkdMRmlsdGVyTWFuYWdlci5wcm90b3R5cGUuaW5pdFNoYWRlckJ1ZmZlcnM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO3RoaXMudmVydGV4QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksdGhpcy51dkJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuY29sb3JCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLmluZGV4QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksdGhpcy52ZXJ0ZXhBcnJheT1uZXcgRmxvYXQzMkFycmF5KFswLDAsMSwwLDAsMSwxLDFdKSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0ZXhCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEFycmF5LGEuU1RBVElDX0RSQVcpLHRoaXMudXZBcnJheT1uZXcgRmxvYXQzMkFycmF5KFswLDAsMSwwLDAsMSwxLDFdKSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy51dkJ1ZmZlciksYS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMudXZBcnJheSxhLlNUQVRJQ19EUkFXKSx0aGlzLmNvbG9yQXJyYXk9bmV3IEZsb2F0MzJBcnJheShbMSwxNjc3NzIxNSwxLDE2Nzc3MjE1LDEsMTY3NzcyMTUsMSwxNjc3NzIxNV0pLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLmNvbG9yQnVmZmVyKSxhLmJ1ZmZlckRhdGEoYS5BUlJBWV9CVUZGRVIsdGhpcy5jb2xvckFycmF5LGEuU1RBVElDX0RSQVcpLGEuYmluZEJ1ZmZlcihhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kZXhCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkVMRU1FTlRfQVJSQVlfQlVGRkVSLG5ldyBVaW50MTZBcnJheShbMCwxLDIsMSwzLDJdKSxhLlNUQVRJQ19EUkFXKX0sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO3RoaXMuZmlsdGVyU3RhY2s9bnVsbCx0aGlzLm9mZnNldFg9MCx0aGlzLm9mZnNldFk9MDtmb3IodmFyIGI9MDtiPHRoaXMudGV4dHVyZVBvb2wubGVuZ3RoO2IrKyl0aGlzLnRleHR1cmVQb29sW2JdLmRlc3Ryb3koKTt0aGlzLnRleHR1cmVQb29sPW51bGwsYS5kZWxldGVCdWZmZXIodGhpcy52ZXJ0ZXhCdWZmZXIpLGEuZGVsZXRlQnVmZmVyKHRoaXMudXZCdWZmZXIpLGEuZGVsZXRlQnVmZmVyKHRoaXMuY29sb3JCdWZmZXIpLGEuZGVsZXRlQnVmZmVyKHRoaXMuaW5kZXhCdWZmZXIpfSxiLkZpbHRlclRleHR1cmU9ZnVuY3Rpb24oYSxjLGQsZSl7dGhpcy5nbD1hLHRoaXMuZnJhbWVCdWZmZXI9YS5jcmVhdGVGcmFtZWJ1ZmZlcigpLHRoaXMudGV4dHVyZT1hLmNyZWF0ZVRleHR1cmUoKSxlPWV8fGIuc2NhbGVNb2Rlcy5ERUZBVUxULGEuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELHRoaXMudGV4dHVyZSksYS50ZXhQYXJhbWV0ZXJpKGEuVEVYVFVSRV8yRCxhLlRFWFRVUkVfTUFHX0ZJTFRFUixlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9hLkxJTkVBUjphLk5FQVJFU1QpLGEudGV4UGFyYW1ldGVyaShhLlRFWFRVUkVfMkQsYS5URVhUVVJFX01JTl9GSUxURVIsZT09PWIuc2NhbGVNb2Rlcy5MSU5FQVI/YS5MSU5FQVI6YS5ORUFSRVNUKSxhLnRleFBhcmFtZXRlcmkoYS5URVhUVVJFXzJELGEuVEVYVFVSRV9XUkFQX1MsYS5DTEFNUF9UT19FREdFKSxhLnRleFBhcmFtZXRlcmkoYS5URVhUVVJFXzJELGEuVEVYVFVSRV9XUkFQX1QsYS5DTEFNUF9UT19FREdFKSxhLmJpbmRGcmFtZWJ1ZmZlcihhLkZSQU1FQlVGRkVSLHRoaXMuZnJhbWVidWZmZXIpLGEuYmluZEZyYW1lYnVmZmVyKGEuRlJBTUVCVUZGRVIsdGhpcy5mcmFtZUJ1ZmZlciksYS5mcmFtZWJ1ZmZlclRleHR1cmUyRChhLkZSQU1FQlVGRkVSLGEuQ09MT1JfQVRUQUNITUVOVDAsYS5URVhUVVJFXzJELHRoaXMudGV4dHVyZSwwKSx0aGlzLnJlbmRlckJ1ZmZlcj1hLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpLGEuYmluZFJlbmRlcmJ1ZmZlcihhLlJFTkRFUkJVRkZFUix0aGlzLnJlbmRlckJ1ZmZlciksYS5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihhLkZSQU1FQlVGRkVSLGEuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5ULGEuUkVOREVSQlVGRkVSLHRoaXMucmVuZGVyQnVmZmVyKSx0aGlzLnJlc2l6ZShjLGQpfSxiLkZpbHRlclRleHR1cmUucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbDthLmNsZWFyQ29sb3IoMCwwLDAsMCksYS5jbGVhcihhLkNPTE9SX0JVRkZFUl9CSVQpfSxiLkZpbHRlclRleHR1cmUucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbihhLGIpe2lmKHRoaXMud2lkdGghPT1hfHx0aGlzLmhlaWdodCE9PWIpe3RoaXMud2lkdGg9YSx0aGlzLmhlaWdodD1iO3ZhciBjPXRoaXMuZ2w7Yy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsdGhpcy50ZXh0dXJlKSxjLnRleEltYWdlMkQoYy5URVhUVVJFXzJELDAsYy5SR0JBLGEsYiwwLGMuUkdCQSxjLlVOU0lHTkVEX0JZVEUsbnVsbCksYy5iaW5kUmVuZGVyYnVmZmVyKGMuUkVOREVSQlVGRkVSLHRoaXMucmVuZGVyQnVmZmVyKSxjLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoYy5SRU5ERVJCVUZGRVIsYy5ERVBUSF9TVEVOQ0lMLGEsYil9fSxiLkZpbHRlclRleHR1cmUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO2EuZGVsZXRlRnJhbWVidWZmZXIodGhpcy5mcmFtZUJ1ZmZlciksYS5kZWxldGVUZXh0dXJlKHRoaXMudGV4dHVyZSksdGhpcy5mcmFtZUJ1ZmZlcj1udWxsLHRoaXMudGV4dHVyZT1udWxsfSxiLkNhbnZhc01hc2tNYW5hZ2VyPWZ1bmN0aW9uKCl7fSxiLkNhbnZhc01hc2tNYW5hZ2VyLnByb3RvdHlwZS5wdXNoTWFzaz1mdW5jdGlvbihhLGMpe2Muc2F2ZSgpO3ZhciBkPWEuYWxwaGEsZT1hLndvcmxkVHJhbnNmb3JtO2Muc2V0VHJhbnNmb3JtKGUuYSxlLmMsZS5iLGUuZCxlLnR4LGUudHkpLGIuQ2FudmFzR3JhcGhpY3MucmVuZGVyR3JhcGhpY3NNYXNrKGEsYyksYy5jbGlwKCksYS53b3JsZEFscGhhPWR9LGIuQ2FudmFzTWFza01hbmFnZXIucHJvdG90eXBlLnBvcE1hc2s9ZnVuY3Rpb24oYSl7YS5yZXN0b3JlKCl9LGIuQ2FudmFzVGludGVyPWZ1bmN0aW9uKCl7fSxiLkNhbnZhc1RpbnRlci5nZXRUaW50ZWRUZXh0dXJlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS50ZXh0dXJlO2M9Yi5DYW52YXNUaW50ZXIucm91bmRDb2xvcihjKTt2YXIgZT1cIiNcIisoXCIwMDAwMFwiKygwfGMpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtpZihkLnRpbnRDYWNoZT1kLnRpbnRDYWNoZXx8e30sZC50aW50Q2FjaGVbZV0pcmV0dXJuIGQudGludENhY2hlW2VdO3ZhciBmPWIuQ2FudmFzVGludGVyLmNhbnZhc3x8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtpZihiLkNhbnZhc1RpbnRlci50aW50TWV0aG9kKGQsYyxmKSxiLkNhbnZhc1RpbnRlci5jb252ZXJ0VGludFRvSW1hZ2Upe3ZhciBnPW5ldyBJbWFnZTtnLnNyYz1mLnRvRGF0YVVSTCgpLGQudGludENhY2hlW2VdPWd9ZWxzZSBkLnRpbnRDYWNoZVtlXT1mLGIuQ2FudmFzVGludGVyLmNhbnZhcz1udWxsO3JldHVybiBmfSxiLkNhbnZhc1RpbnRlci50aW50V2l0aE11bHRpcGx5PWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1jLmdldENvbnRleHQoXCIyZFwiKSxlPWEuZnJhbWU7Yy53aWR0aD1lLndpZHRoLGMuaGVpZ2h0PWUuaGVpZ2h0LGQuZmlsbFN0eWxlPVwiI1wiKyhcIjAwMDAwXCIrKDB8YikudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpLGQuZmlsbFJlY3QoMCwwLGUud2lkdGgsZS5oZWlnaHQpLGQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwibXVsdGlwbHlcIixkLmRyYXdJbWFnZShhLmJhc2VUZXh0dXJlLnNvdXJjZSxlLngsZS55LGUud2lkdGgsZS5oZWlnaHQsMCwwLGUud2lkdGgsZS5oZWlnaHQpLGQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwiZGVzdGluYXRpb24tYXRvcFwiLGQuZHJhd0ltYWdlKGEuYmFzZVRleHR1cmUuc291cmNlLGUueCxlLnksZS53aWR0aCxlLmhlaWdodCwwLDAsZS53aWR0aCxlLmhlaWdodCl9LGIuQ2FudmFzVGludGVyLnRpbnRXaXRoT3ZlcmxheT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Yy5nZXRDb250ZXh0KFwiMmRcIiksZT1hLmZyYW1lO2Mud2lkdGg9ZS53aWR0aCxjLmhlaWdodD1lLmhlaWdodCxkLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cImNvcHlcIixkLmZpbGxTdHlsZT1cIiNcIisoXCIwMDAwMFwiKygwfGIpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxkLmZpbGxSZWN0KDAsMCxlLndpZHRoLGUuaGVpZ2h0KSxkLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cImRlc3RpbmF0aW9uLWF0b3BcIixkLmRyYXdJbWFnZShhLmJhc2VUZXh0dXJlLnNvdXJjZSxlLngsZS55LGUud2lkdGgsZS5oZWlnaHQsMCwwLGUud2lkdGgsZS5oZWlnaHQpfSxiLkNhbnZhc1RpbnRlci50aW50V2l0aFBlclBpeGVsPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT1kLmdldENvbnRleHQoXCIyZFwiKSxmPWEuZnJhbWU7ZC53aWR0aD1mLndpZHRoLGQuaGVpZ2h0PWYuaGVpZ2h0LGUuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwiY29weVwiLGUuZHJhd0ltYWdlKGEuYmFzZVRleHR1cmUuc291cmNlLGYueCxmLnksZi53aWR0aCxmLmhlaWdodCwwLDAsZi53aWR0aCxmLmhlaWdodCk7Zm9yKHZhciBnPWIuaGV4MnJnYihjKSxoPWdbMF0saT1nWzFdLGo9Z1syXSxrPWUuZ2V0SW1hZ2VEYXRhKDAsMCxmLndpZHRoLGYuaGVpZ2h0KSxsPWsuZGF0YSxtPTA7bTxsLmxlbmd0aDttKz00KWxbbSswXSo9aCxsW20rMV0qPWksbFttKzJdKj1qO2UucHV0SW1hZ2VEYXRhKGssMCwwKX0sYi5DYW52YXNUaW50ZXIucm91bmRDb2xvcj1mdW5jdGlvbihhKXt2YXIgYz1iLkNhbnZhc1RpbnRlci5jYWNoZVN0ZXBzUGVyQ29sb3JDaGFubmVsLGQ9Yi5oZXgycmdiKGEpO3JldHVybiBkWzBdPU1hdGgubWluKDI1NSxkWzBdL2MqYyksZFsxXT1NYXRoLm1pbigyNTUsZFsxXS9jKmMpLGRbMl09TWF0aC5taW4oMjU1LGRbMl0vYypjKSxiLnJnYjJoZXgoZCl9LGIuQ2FudmFzVGludGVyLmNhY2hlU3RlcHNQZXJDb2xvckNoYW5uZWw9OCxiLkNhbnZhc1RpbnRlci5jb252ZXJ0VGludFRvSW1hZ2U9ITEsYi5DYW52YXNUaW50ZXIuY2FuVXNlTXVsdGlwbHk9Yi5jYW5Vc2VOZXdDYW52YXNCbGVuZE1vZGVzKCksYi5DYW52YXNUaW50ZXIudGludE1ldGhvZD1iLkNhbnZhc1RpbnRlci5jYW5Vc2VNdWx0aXBseT9iLkNhbnZhc1RpbnRlci50aW50V2l0aE11bHRpcGx5OmIuQ2FudmFzVGludGVyLnRpbnRXaXRoUGVyUGl4ZWwsYi5DYW52YXNSZW5kZXJlcj1mdW5jdGlvbihhLGMsZCxlKXtiLmRlZmF1bHRSZW5kZXJlcnx8KGIuc2F5SGVsbG8oXCJDYW52YXNcIiksYi5kZWZhdWx0UmVuZGVyZXI9dGhpcyksdGhpcy50eXBlPWIuQ0FOVkFTX1JFTkRFUkVSLHRoaXMuY2xlYXJCZWZvcmVSZW5kZXI9ITAsdGhpcy50cmFuc3BhcmVudD0hIWUsYi5ibGVuZE1vZGVzQ2FudmFzfHwoYi5ibGVuZE1vZGVzQ2FudmFzPVtdLGIuY2FuVXNlTmV3Q2FudmFzQmxlbmRNb2RlcygpPyhiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk5PUk1BTF09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQUREXT1cImxpZ2h0ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk1VTFRJUExZXT1cIm11bHRpcGx5XCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5TQ1JFRU5dPVwic2NyZWVuXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5PVkVSTEFZXT1cIm92ZXJsYXlcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkRBUktFTl09XCJkYXJrZW5cIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkxJR0hURU5dPVwibGlnaHRlblwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQ09MT1JfRE9ER0VdPVwiY29sb3ItZG9kZ2VcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkNPTE9SX0JVUk5dPVwiY29sb3ItYnVyblwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuSEFSRF9MSUdIVF09XCJoYXJkLWxpZ2h0XCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5TT0ZUX0xJR0hUXT1cInNvZnQtbGlnaHRcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkRJRkZFUkVOQ0VdPVwiZGlmZmVyZW5jZVwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuRVhDTFVTSU9OXT1cImV4Y2x1c2lvblwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuSFVFXT1cImh1ZVwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuU0FUVVJBVElPTl09XCJzYXR1cmF0aW9uXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5DT0xPUl09XCJjb2xvclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTFVNSU5PU0lUWV09XCJsdW1pbm9zaXR5XCIpOihiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk5PUk1BTF09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQUREXT1cImxpZ2h0ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk1VTFRJUExZXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5TQ1JFRU5dPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk9WRVJMQVldPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkRBUktFTl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTElHSFRFTl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQ09MT1JfRE9ER0VdPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkNPTE9SX0JVUk5dPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkhBUkRfTElHSFRdPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLlNPRlRfTElHSFRdPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkRJRkZFUkVOQ0VdPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkVYQ0xVU0lPTl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuSFVFXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5TQVRVUkFUSU9OXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5DT0xPUl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTFVNSU5PU0lUWV09XCJzb3VyY2Utb3ZlclwiKSksdGhpcy53aWR0aD1hfHw4MDAsdGhpcy5oZWlnaHQ9Y3x8NjAwLHRoaXMudmlldz1kfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuY29udGV4dD10aGlzLnZpZXcuZ2V0Q29udGV4dChcIjJkXCIse2FscGhhOnRoaXMudHJhbnNwYXJlbnR9KSx0aGlzLnJlZnJlc2g9ITAsdGhpcy52aWV3LndpZHRoPXRoaXMud2lkdGgsdGhpcy52aWV3LmhlaWdodD10aGlzLmhlaWdodCx0aGlzLmNvdW50PTAsdGhpcy5tYXNrTWFuYWdlcj1uZXcgYi5DYW52YXNNYXNrTWFuYWdlcix0aGlzLnJlbmRlclNlc3Npb249e2NvbnRleHQ6dGhpcy5jb250ZXh0LG1hc2tNYW5hZ2VyOnRoaXMubWFza01hbmFnZXIsc2NhbGVNb2RlOm51bGwsc21vb3RoUHJvcGVydHk6bnVsbCxyb3VuZFBpeGVsczohMX0sXCJpbWFnZVNtb290aGluZ0VuYWJsZWRcImluIHRoaXMuY29udGV4dD90aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHk9XCJpbWFnZVNtb290aGluZ0VuYWJsZWRcIjpcIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZFwiaW4gdGhpcy5jb250ZXh0P3RoaXMucmVuZGVyU2Vzc2lvbi5zbW9vdGhQcm9wZXJ0eT1cIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZFwiOlwibW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkXCJpbiB0aGlzLmNvbnRleHQ/dGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5PVwibW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkXCI6XCJvSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCJpbiB0aGlzLmNvbnRleHQmJih0aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHk9XCJvSW1hZ2VTbW9vdGhpbmdFbmFibGVkXCIpfSxiLkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkNhbnZhc1JlbmRlcmVyLGIuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbihhKXtiLnRleHR1cmVzVG9VcGRhdGUubGVuZ3RoPTAsYi50ZXh0dXJlc1RvRGVzdHJveS5sZW5ndGg9MCxhLnVwZGF0ZVRyYW5zZm9ybSgpLHRoaXMuY29udGV4dC5zZXRUcmFuc2Zvcm0oMSwwLDAsMSwwLDApLHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYT0xLG5hdmlnYXRvci5pc0NvY29vbkpTJiZ0aGlzLnZpZXcuc2NyZWVuY2FudmFzJiYodGhpcy5jb250ZXh0LmZpbGxTdHlsZT1cImJsYWNrXCIsdGhpcy5jb250ZXh0LmNsZWFyKCkpLCF0aGlzLnRyYW5zcGFyZW50JiZ0aGlzLmNsZWFyQmVmb3JlUmVuZGVyPyh0aGlzLmNvbnRleHQuZmlsbFN0eWxlPWEuYmFja2dyb3VuZENvbG9yU3RyaW5nLHRoaXMuY29udGV4dC5maWxsUmVjdCgwLDAsdGhpcy53aWR0aCx0aGlzLmhlaWdodCkpOnRoaXMudHJhbnNwYXJlbnQmJnRoaXMuY2xlYXJCZWZvcmVSZW5kZXImJnRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLHRoaXMucmVuZGVyRGlzcGxheU9iamVjdChhKSxhLmludGVyYWN0aXZlJiYoYS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZHx8KGEuX2ludGVyYWN0aXZlRXZlbnRzQWRkZWQ9ITAsYS5pbnRlcmFjdGlvbk1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMpKSksYi5UZXh0dXJlLmZyYW1lVXBkYXRlcy5sZW5ndGg+MCYmKGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXMubGVuZ3RoPTApXG59LGIuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbihhLGIpe3RoaXMud2lkdGg9YSx0aGlzLmhlaWdodD1iLHRoaXMudmlldy53aWR0aD1hLHRoaXMudmlldy5oZWlnaHQ9Yn0sYi5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyRGlzcGxheU9iamVjdD1mdW5jdGlvbihhLGIpe3RoaXMucmVuZGVyU2Vzc2lvbi5jb250ZXh0PWJ8fHRoaXMuY29udGV4dCxhLl9yZW5kZXJDYW52YXModGhpcy5yZW5kZXJTZXNzaW9uKX0sYi5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyU3RyaXBGbGF0PWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuY29udGV4dCxjPWEudmVydGljaWVzLGQ9Yy5sZW5ndGgvMjt0aGlzLmNvdW50KyssYi5iZWdpblBhdGgoKTtmb3IodmFyIGU9MTtkLTI+ZTtlKyspe3ZhciBmPTIqZSxnPWNbZl0saD1jW2YrMl0saT1jW2YrNF0saj1jW2YrMV0saz1jW2YrM10sbD1jW2YrNV07Yi5tb3ZlVG8oZyxqKSxiLmxpbmVUbyhoLGspLGIubGluZVRvKGksbCl9Yi5maWxsU3R5bGU9XCIjRkYwMDAwXCIsYi5maWxsKCksYi5jbG9zZVBhdGgoKX0sYi5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyU3RyaXA9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5jb250ZXh0LGM9YS52ZXJ0aWNpZXMsZD1hLnV2cyxlPWMubGVuZ3RoLzI7dGhpcy5jb3VudCsrO2Zvcih2YXIgZj0xO2UtMj5mO2YrKyl7dmFyIGc9MipmLGg9Y1tnXSxpPWNbZysyXSxqPWNbZys0XSxrPWNbZysxXSxsPWNbZyszXSxtPWNbZys1XSxuPWRbZ10qYS50ZXh0dXJlLndpZHRoLG89ZFtnKzJdKmEudGV4dHVyZS53aWR0aCxwPWRbZys0XSphLnRleHR1cmUud2lkdGgscT1kW2crMV0qYS50ZXh0dXJlLmhlaWdodCxyPWRbZyszXSphLnRleHR1cmUuaGVpZ2h0LHM9ZFtnKzVdKmEudGV4dHVyZS5oZWlnaHQ7Yi5zYXZlKCksYi5iZWdpblBhdGgoKSxiLm1vdmVUbyhoLGspLGIubGluZVRvKGksbCksYi5saW5lVG8oaixtKSxiLmNsb3NlUGF0aCgpLGIuY2xpcCgpO3ZhciB0PW4qcitxKnArbypzLXIqcC1xKm8tbipzLHU9aCpyK3EqaitpKnMtcipqLXEqaS1oKnMsdj1uKmkraCpwK28qai1pKnAtaCpvLW4qaix3PW4qcipqK3EqaSpwK2gqbypzLWgqcipwLXEqbypqLW4qaSpzLHg9aypyK3EqbStsKnMtciptLXEqbC1rKnMseT1uKmwraypwK28qbS1sKnAtaypvLW4qbSx6PW4qciptK3EqbCpwK2sqbypzLWsqcipwLXEqbyptLW4qbCpzO2IudHJhbnNmb3JtKHUvdCx4L3Qsdi90LHkvdCx3L3Qsei90KSxiLmRyYXdJbWFnZShhLnRleHR1cmUuYmFzZVRleHR1cmUuc291cmNlLDAsMCksYi5yZXN0b3JlKCl9fSxiLkNhbnZhc0J1ZmZlcj1mdW5jdGlvbihhLGIpe3RoaXMud2lkdGg9YSx0aGlzLmhlaWdodD1iLHRoaXMuY2FudmFzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksdGhpcy5jb250ZXh0PXRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSx0aGlzLmNhbnZhcy53aWR0aD1hLHRoaXMuY2FudmFzLmhlaWdodD1ifSxiLkNhbnZhc0J1ZmZlci5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KX0sYi5DYW52YXNCdWZmZXIucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbihhLGIpe3RoaXMud2lkdGg9dGhpcy5jYW52YXMud2lkdGg9YSx0aGlzLmhlaWdodD10aGlzLmNhbnZhcy5oZWlnaHQ9Yn0sYi5DYW52YXNHcmFwaGljcz1mdW5jdGlvbigpe30sYi5DYW52YXNHcmFwaGljcy5yZW5kZXJHcmFwaGljcz1mdW5jdGlvbihhLGMpe2Zvcih2YXIgZD1hLndvcmxkQWxwaGEsZT1cIlwiLGY9MDtmPGEuZ3JhcGhpY3NEYXRhLmxlbmd0aDtmKyspe3ZhciBnPWEuZ3JhcGhpY3NEYXRhW2ZdLGg9Zy5wb2ludHM7aWYoYy5zdHJva2VTdHlsZT1lPVwiI1wiKyhcIjAwMDAwXCIrKDB8Zy5saW5lQ29sb3IpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxjLmxpbmVXaWR0aD1nLmxpbmVXaWR0aCxnLnR5cGU9PT1iLkdyYXBoaWNzLlBPTFkpe2MuYmVnaW5QYXRoKCksYy5tb3ZlVG8oaFswXSxoWzFdKTtmb3IodmFyIGk9MTtpPGgubGVuZ3RoLzI7aSsrKWMubGluZVRvKGhbMippXSxoWzIqaSsxXSk7aFswXT09PWhbaC5sZW5ndGgtMl0mJmhbMV09PT1oW2gubGVuZ3RoLTFdJiZjLmNsb3NlUGF0aCgpLGcuZmlsbCYmKGMuZ2xvYmFsQWxwaGE9Zy5maWxsQWxwaGEqZCxjLmZpbGxTdHlsZT1lPVwiI1wiKyhcIjAwMDAwXCIrKDB8Zy5maWxsQ29sb3IpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxjLmZpbGwoKSksZy5saW5lV2lkdGgmJihjLmdsb2JhbEFscGhhPWcubGluZUFscGhhKmQsYy5zdHJva2UoKSl9ZWxzZSBpZihnLnR5cGU9PT1iLkdyYXBoaWNzLlJFQ1QpKGcuZmlsbENvbG9yfHwwPT09Zy5maWxsQ29sb3IpJiYoYy5nbG9iYWxBbHBoYT1nLmZpbGxBbHBoYSpkLGMuZmlsbFN0eWxlPWU9XCIjXCIrKFwiMDAwMDBcIisoMHxnLmZpbGxDb2xvcikudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpLGMuZmlsbFJlY3QoaFswXSxoWzFdLGhbMl0saFszXSkpLGcubGluZVdpZHRoJiYoYy5nbG9iYWxBbHBoYT1nLmxpbmVBbHBoYSpkLGMuc3Ryb2tlUmVjdChoWzBdLGhbMV0saFsyXSxoWzNdKSk7ZWxzZSBpZihnLnR5cGU9PT1iLkdyYXBoaWNzLkNJUkMpYy5iZWdpblBhdGgoKSxjLmFyYyhoWzBdLGhbMV0saFsyXSwwLDIqTWF0aC5QSSksYy5jbG9zZVBhdGgoKSxnLmZpbGwmJihjLmdsb2JhbEFscGhhPWcuZmlsbEFscGhhKmQsYy5maWxsU3R5bGU9ZT1cIiNcIisoXCIwMDAwMFwiKygwfGcuZmlsbENvbG9yKS50b1N0cmluZygxNikpLnN1YnN0cigtNiksYy5maWxsKCkpLGcubGluZVdpZHRoJiYoYy5nbG9iYWxBbHBoYT1nLmxpbmVBbHBoYSpkLGMuc3Ryb2tlKCkpO2Vsc2UgaWYoZy50eXBlPT09Yi5HcmFwaGljcy5FTElQKXt2YXIgaj1nLnBvaW50cyxrPTIqalsyXSxsPTIqalszXSxtPWpbMF0tay8yLG49alsxXS1sLzI7Yy5iZWdpblBhdGgoKTt2YXIgbz0uNTUyMjg0OCxwPWsvMipvLHE9bC8yKm8scj1tK2sscz1uK2wsdD1tK2svMix1PW4rbC8yO2MubW92ZVRvKG0sdSksYy5iZXppZXJDdXJ2ZVRvKG0sdS1xLHQtcCxuLHQsbiksYy5iZXppZXJDdXJ2ZVRvKHQrcCxuLHIsdS1xLHIsdSksYy5iZXppZXJDdXJ2ZVRvKHIsdStxLHQrcCxzLHQscyksYy5iZXppZXJDdXJ2ZVRvKHQtcCxzLG0sdStxLG0sdSksYy5jbG9zZVBhdGgoKSxnLmZpbGwmJihjLmdsb2JhbEFscGhhPWcuZmlsbEFscGhhKmQsYy5maWxsU3R5bGU9ZT1cIiNcIisoXCIwMDAwMFwiKygwfGcuZmlsbENvbG9yKS50b1N0cmluZygxNikpLnN1YnN0cigtNiksYy5maWxsKCkpLGcubGluZVdpZHRoJiYoYy5nbG9iYWxBbHBoYT1nLmxpbmVBbHBoYSpkLGMuc3Ryb2tlKCkpfWVsc2UgaWYoZy50eXBlPT09Yi5HcmFwaGljcy5SUkVDKXt2YXIgdj1oWzBdLHc9aFsxXSx4PWhbMl0seT1oWzNdLHo9aFs0XSxBPU1hdGgubWluKHgseSkvMnwwO3o9ej5BP0E6eixjLmJlZ2luUGF0aCgpLGMubW92ZVRvKHYsdyt6KSxjLmxpbmVUbyh2LHcreS16KSxjLnF1YWRyYXRpY0N1cnZlVG8odix3K3ksdit6LHcreSksYy5saW5lVG8odit4LXosdyt5KSxjLnF1YWRyYXRpY0N1cnZlVG8odit4LHcreSx2K3gsdyt5LXopLGMubGluZVRvKHYreCx3K3opLGMucXVhZHJhdGljQ3VydmVUbyh2K3gsdyx2K3gteix3KSxjLmxpbmVUbyh2K3osdyksYy5xdWFkcmF0aWNDdXJ2ZVRvKHYsdyx2LHcreiksYy5jbG9zZVBhdGgoKSwoZy5maWxsQ29sb3J8fDA9PT1nLmZpbGxDb2xvcikmJihjLmdsb2JhbEFscGhhPWcuZmlsbEFscGhhKmQsYy5maWxsU3R5bGU9ZT1cIiNcIisoXCIwMDAwMFwiKygwfGcuZmlsbENvbG9yKS50b1N0cmluZygxNikpLnN1YnN0cigtNiksYy5maWxsKCkpLGcubGluZVdpZHRoJiYoYy5nbG9iYWxBbHBoYT1nLmxpbmVBbHBoYSpkLGMuc3Ryb2tlKCkpfX19LGIuQ2FudmFzR3JhcGhpY3MucmVuZGVyR3JhcGhpY3NNYXNrPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5ncmFwaGljc0RhdGEubGVuZ3RoO2lmKDAhPT1kKXtkPjEmJihkPTEsd2luZG93LmNvbnNvbGUubG9nKFwiUGl4aS5qcyB3YXJuaW5nOiBtYXNrcyBpbiBjYW52YXMgY2FuIG9ubHkgbWFzayB1c2luZyB0aGUgZmlyc3QgcGF0aCBpbiB0aGUgZ3JhcGhpY3Mgb2JqZWN0XCIpKTtmb3IodmFyIGU9MDsxPmU7ZSsrKXt2YXIgZj1hLmdyYXBoaWNzRGF0YVtlXSxnPWYucG9pbnRzO2lmKGYudHlwZT09PWIuR3JhcGhpY3MuUE9MWSl7Yy5iZWdpblBhdGgoKSxjLm1vdmVUbyhnWzBdLGdbMV0pO2Zvcih2YXIgaD0xO2g8Zy5sZW5ndGgvMjtoKyspYy5saW5lVG8oZ1syKmhdLGdbMipoKzFdKTtnWzBdPT09Z1tnLmxlbmd0aC0yXSYmZ1sxXT09PWdbZy5sZW5ndGgtMV0mJmMuY2xvc2VQYXRoKCl9ZWxzZSBpZihmLnR5cGU9PT1iLkdyYXBoaWNzLlJFQ1QpYy5iZWdpblBhdGgoKSxjLnJlY3QoZ1swXSxnWzFdLGdbMl0sZ1szXSksYy5jbG9zZVBhdGgoKTtlbHNlIGlmKGYudHlwZT09PWIuR3JhcGhpY3MuQ0lSQyljLmJlZ2luUGF0aCgpLGMuYXJjKGdbMF0sZ1sxXSxnWzJdLDAsMipNYXRoLlBJKSxjLmNsb3NlUGF0aCgpO2Vsc2UgaWYoZi50eXBlPT09Yi5HcmFwaGljcy5FTElQKXt2YXIgaT1mLnBvaW50cyxqPTIqaVsyXSxrPTIqaVszXSxsPWlbMF0tai8yLG09aVsxXS1rLzI7Yy5iZWdpblBhdGgoKTt2YXIgbj0uNTUyMjg0OCxvPWovMipuLHA9ay8yKm4scT1sK2oscj1tK2sscz1sK2ovMix0PW0ray8yO2MubW92ZVRvKGwsdCksYy5iZXppZXJDdXJ2ZVRvKGwsdC1wLHMtbyxtLHMsbSksYy5iZXppZXJDdXJ2ZVRvKHMrbyxtLHEsdC1wLHEsdCksYy5iZXppZXJDdXJ2ZVRvKHEsdCtwLHMrbyxyLHMsciksYy5iZXppZXJDdXJ2ZVRvKHMtbyxyLGwsdCtwLGwsdCksYy5jbG9zZVBhdGgoKX1lbHNlIGlmKGYudHlwZT09PWIuR3JhcGhpY3MuUlJFQyl7dmFyIHU9Z1swXSx2PWdbMV0sdz1nWzJdLHg9Z1szXSx5PWdbNF0sej1NYXRoLm1pbih3LHgpLzJ8MDt5PXk+ej96OnksYy5iZWdpblBhdGgoKSxjLm1vdmVUbyh1LHYreSksYy5saW5lVG8odSx2K3gteSksYy5xdWFkcmF0aWNDdXJ2ZVRvKHUsdit4LHUreSx2K3gpLGMubGluZVRvKHUrdy15LHYreCksYy5xdWFkcmF0aWNDdXJ2ZVRvKHUrdyx2K3gsdSt3LHYreC15KSxjLmxpbmVUbyh1K3csdit5KSxjLnF1YWRyYXRpY0N1cnZlVG8odSt3LHYsdSt3LXksdiksYy5saW5lVG8odSt5LHYpLGMucXVhZHJhdGljQ3VydmVUbyh1LHYsdSx2K3kpLGMuY2xvc2VQYXRoKCl9fX19LGIuR3JhcGhpY3M9ZnVuY3Rpb24oKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLnJlbmRlcmFibGU9ITAsdGhpcy5maWxsQWxwaGE9MSx0aGlzLmxpbmVXaWR0aD0wLHRoaXMubGluZUNvbG9yPVwiYmxhY2tcIix0aGlzLmdyYXBoaWNzRGF0YT1bXSx0aGlzLnRpbnQ9MTY3NzcyMTUsdGhpcy5ibGVuZE1vZGU9Yi5ibGVuZE1vZGVzLk5PUk1BTCx0aGlzLmN1cnJlbnRQYXRoPXtwb2ludHM6W119LHRoaXMuX3dlYkdMPVtdLHRoaXMuaXNNYXNrPSExLHRoaXMuYm91bmRzPW51bGwsdGhpcy5ib3VuZHNQYWRkaW5nPTEwLHRoaXMuZGlydHk9ITB9LGIuR3JhcGhpY3MucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSksYi5HcmFwaGljcy5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5HcmFwaGljcyxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5HcmFwaGljcy5wcm90b3R5cGUsXCJjYWNoZUFzQml0bWFwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jYWNoZUFzQml0bWFwfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5fY2FjaGVBc0JpdG1hcD1hLHRoaXMuX2NhY2hlQXNCaXRtYXA/dGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKToodGhpcy5kZXN0cm95Q2FjaGVkU3ByaXRlKCksdGhpcy5kaXJ0eT0hMCl9fSksYi5HcmFwaGljcy5wcm90b3R5cGUubGluZVN0eWxlPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gdGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RofHx0aGlzLmdyYXBoaWNzRGF0YS5wb3AoKSx0aGlzLmxpbmVXaWR0aD1hfHwwLHRoaXMubGluZUNvbG9yPWN8fDAsdGhpcy5saW5lQWxwaGE9YXJndW1lbnRzLmxlbmd0aDwzPzE6ZCx0aGlzLmN1cnJlbnRQYXRoPXtsaW5lV2lkdGg6dGhpcy5saW5lV2lkdGgsbGluZUNvbG9yOnRoaXMubGluZUNvbG9yLGxpbmVBbHBoYTp0aGlzLmxpbmVBbHBoYSxmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsZmlsbEFscGhhOnRoaXMuZmlsbEFscGhhLGZpbGw6dGhpcy5maWxsaW5nLHBvaW50czpbXSx0eXBlOmIuR3JhcGhpY3MuUE9MWX0sdGhpcy5ncmFwaGljc0RhdGEucHVzaCh0aGlzLmN1cnJlbnRQYXRoKSx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5tb3ZlVG89ZnVuY3Rpb24oYSxjKXtyZXR1cm4gdGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RofHx0aGlzLmdyYXBoaWNzRGF0YS5wb3AoKSx0aGlzLmN1cnJlbnRQYXRoPXRoaXMuY3VycmVudFBhdGg9e2xpbmVXaWR0aDp0aGlzLmxpbmVXaWR0aCxsaW5lQ29sb3I6dGhpcy5saW5lQ29sb3IsbGluZUFscGhhOnRoaXMubGluZUFscGhhLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcixmaWxsQWxwaGE6dGhpcy5maWxsQWxwaGEsZmlsbDp0aGlzLmZpbGxpbmcscG9pbnRzOltdLHR5cGU6Yi5HcmFwaGljcy5QT0xZfSx0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5wdXNoKGEsYyksdGhpcy5ncmFwaGljc0RhdGEucHVzaCh0aGlzLmN1cnJlbnRQYXRoKSx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG89ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5jdXJyZW50UGF0aC5wb2ludHMucHVzaChhLGIpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUucXVhZHJhdGljQ3VydmVUbz1mdW5jdGlvbihhLGIsYyxkKXswPT09dGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RoJiZ0aGlzLm1vdmVUbygwLDApO3ZhciBlLGYsZz0yMCxoPXRoaXMuY3VycmVudFBhdGgucG9pbnRzOzA9PT1oLmxlbmd0aCYmdGhpcy5tb3ZlVG8oMCwwKTtmb3IodmFyIGk9aFtoLmxlbmd0aC0yXSxqPWhbaC5sZW5ndGgtMV0saz0wLGw9MTtnPj1sO2wrKylrPWwvZyxlPWkrKGEtaSkqayxmPWorKGItaikqayxoLnB1c2goZSsoYSsoYy1hKSprLWUpKmssZisoYisoZC1iKSprLWYpKmspO3JldHVybiB0aGlzLmRpcnR5PSEwLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG89ZnVuY3Rpb24oYSxiLGMsZCxlLGYpezA9PT10aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGgmJnRoaXMubW92ZVRvKDAsMCk7Zm9yKHZhciBnLGgsaSxqLGssbD0yMCxtPXRoaXMuY3VycmVudFBhdGgucG9pbnRzLG49bVttLmxlbmd0aC0yXSxvPW1bbS5sZW5ndGgtMV0scD0wLHE9MTtsPnE7cSsrKXA9cS9sLGc9MS1wLGg9ZypnLGk9aCpnLGo9cCpwLGs9aipwLG0ucHVzaChpKm4rMypoKnAqYSszKmcqaipjK2sqZSxpKm8rMypoKnAqYiszKmcqaipkK2sqZik7cmV0dXJuIHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuYXJjVG89ZnVuY3Rpb24oYSxiLGMsZCxlKXswPT09dGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RoJiZ0aGlzLm1vdmVUbyhhLGIpO3ZhciBmPXRoaXMuY3VycmVudFBhdGgucG9pbnRzLGc9ZltmLmxlbmd0aC0yXSxoPWZbZi5sZW5ndGgtMV0saT1oLWIsaj1nLWEsaz1kLWIsbD1jLWEsbT1NYXRoLmFicyhpKmwtaiprKTtpZigxZS04Pm18fDA9PT1lKWYucHVzaChhLGIpO2Vsc2V7dmFyIG49aSppK2oqaixvPWsqaytsKmwscD1pKmsraipsLHE9ZSpNYXRoLnNxcnQobikvbSxyPWUqTWF0aC5zcXJ0KG8pL20scz1xKnAvbix0PXIqcC9vLHU9cSpsK3Iqaix2PXEqaytyKmksdz1qKihyK3MpLHg9aSoocitzKSx5PWwqKHErdCksej1rKihxK3QpLEE9TWF0aC5hdGFuMih4LXYsdy11KSxCPU1hdGguYXRhbjIoei12LHktdSk7dGhpcy5hcmModSthLHYrYixlLEEsQixqKms+bCppKX1yZXR1cm4gdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5hcmM9ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe3ZhciBnPWErTWF0aC5jb3MoZCkqYyxoPWIrTWF0aC5zaW4oZCkqYyxpPXRoaXMuY3VycmVudFBhdGgucG9pbnRzO2lmKCgwIT09aS5sZW5ndGgmJmlbaS5sZW5ndGgtMl0hPT1nfHxpW2kubGVuZ3RoLTFdIT09aCkmJih0aGlzLm1vdmVUbyhnLGgpLGk9dGhpcy5jdXJyZW50UGF0aC5wb2ludHMpLGQ9PT1lKXJldHVybiB0aGlzOyFmJiZkPj1lP2UrPTIqTWF0aC5QSTpmJiZlPj1kJiYoZCs9MipNYXRoLlBJKTt2YXIgaj1mPy0xKihkLWUpOmUtZCxrPU1hdGguYWJzKGopLygyKk1hdGguUEkpKjQwO2lmKDA9PT1qKXJldHVybiB0aGlzO2Zvcih2YXIgbD1qLygyKmspLG09MipsLG49TWF0aC5jb3MobCksbz1NYXRoLnNpbihsKSxwPWstMSxxPXAlMS9wLHI9MDtwPj1yO3IrKyl7dmFyIHM9citxKnIsdD1sK2QrbSpzLHU9TWF0aC5jb3ModCksdj0tTWF0aC5zaW4odCk7aS5wdXNoKChuKnUrbyp2KSpjK2EsKG4qLXYrbyp1KSpjK2IpfXJldHVybiB0aGlzLmRpcnR5PSEwLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGh8fHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpLHRoaXMuY3VycmVudFBhdGg9dGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W10sdHlwZTpiLkdyYXBoaWNzLlBPTFl9LHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5jdXJyZW50UGF0aCksdGhpcy5jdXJyZW50UGF0aC5wb2ludHM9dGhpcy5jdXJyZW50UGF0aC5wb2ludHMuY29uY2F0KGEpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuYmVnaW5GaWxsPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuZmlsbGluZz0hMCx0aGlzLmZpbGxDb2xvcj1hfHwwLHRoaXMuZmlsbEFscGhhPWFyZ3VtZW50cy5sZW5ndGg8Mj8xOmIsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZW5kRmlsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmZpbGxpbmc9ITEsdGhpcy5maWxsQ29sb3I9bnVsbCx0aGlzLmZpbGxBbHBoYT0xLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdSZWN0PWZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGh8fHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpLHRoaXMuY3VycmVudFBhdGg9e2xpbmVXaWR0aDp0aGlzLmxpbmVXaWR0aCxsaW5lQ29sb3I6dGhpcy5saW5lQ29sb3IsbGluZUFscGhhOnRoaXMubGluZUFscGhhLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcixmaWxsQWxwaGE6dGhpcy5maWxsQWxwaGEsZmlsbDp0aGlzLmZpbGxpbmcscG9pbnRzOlthLGMsZCxlXSx0eXBlOmIuR3JhcGhpY3MuUkVDVH0sdGhpcy5ncmFwaGljc0RhdGEucHVzaCh0aGlzLmN1cnJlbnRQYXRoKSx0aGlzLmRpcnR5PSEwLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdSb3VuZGVkUmVjdD1mdW5jdGlvbihhLGMsZCxlLGYpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGh8fHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpLHRoaXMuY3VycmVudFBhdGg9e2xpbmVXaWR0aDp0aGlzLmxpbmVXaWR0aCxsaW5lQ29sb3I6dGhpcy5saW5lQ29sb3IsbGluZUFscGhhOnRoaXMubGluZUFscGhhLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcixmaWxsQWxwaGE6dGhpcy5maWxsQWxwaGEsZmlsbDp0aGlzLmZpbGxpbmcscG9pbnRzOlthLGMsZCxlLGZdLHR5cGU6Yi5HcmFwaGljcy5SUkVDfSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZHJhd0NpcmNsZT1mdW5jdGlvbihhLGMsZCl7cmV0dXJuIHRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aHx8dGhpcy5ncmFwaGljc0RhdGEucG9wKCksdGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W2EsYyxkLGRdLHR5cGU6Yi5HcmFwaGljcy5DSVJDfSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZHJhd0VsbGlwc2U9ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIHRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aHx8dGhpcy5ncmFwaGljc0RhdGEucG9wKCksdGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W2EsYyxkLGVdLHR5cGU6Yi5HcmFwaGljcy5FTElQfSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5saW5lV2lkdGg9MCx0aGlzLmZpbGxpbmc9ITEsdGhpcy5kaXJ0eT0hMCx0aGlzLmNsZWFyRGlydHk9ITAsdGhpcy5ncmFwaGljc0RhdGE9W10sdGhpcy5ib3VuZHM9bnVsbCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5nZW5lcmF0ZVRleHR1cmU9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdldEJvdW5kcygpLGM9bmV3IGIuQ2FudmFzQnVmZmVyKGEud2lkdGgsYS5oZWlnaHQpLGQ9Yi5UZXh0dXJlLmZyb21DYW52YXMoYy5jYW52YXMpO3JldHVybiBjLmNvbnRleHQudHJhbnNsYXRlKC1hLngsLWEueSksYi5DYW52YXNHcmFwaGljcy5yZW5kZXJHcmFwaGljcyh0aGlzLGMuY29udGV4dCksZH0sYi5HcmFwaGljcy5wcm90b3R5cGUuX3JlbmRlcldlYkdMPWZ1bmN0aW9uKGEpe2lmKHRoaXMudmlzaWJsZSE9PSExJiYwIT09dGhpcy5hbHBoYSYmdGhpcy5pc01hc2shPT0hMCl7aWYodGhpcy5fY2FjaGVBc0JpdG1hcClyZXR1cm4gdGhpcy5kaXJ0eSYmKHRoaXMuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlKCksYi51cGRhdGVXZWJHTFRleHR1cmUodGhpcy5fY2FjaGVkU3ByaXRlLnRleHR1cmUuYmFzZVRleHR1cmUsYS5nbCksdGhpcy5kaXJ0eT0hMSksdGhpcy5fY2FjaGVkU3ByaXRlLmFscGhhPXRoaXMuYWxwaGEsYi5TcHJpdGUucHJvdG90eXBlLl9yZW5kZXJXZWJHTC5jYWxsKHRoaXMuX2NhY2hlZFNwcml0ZSxhKSx2b2lkIDA7aWYoYS5zcHJpdGVCYXRjaC5zdG9wKCksYS5ibGVuZE1vZGVNYW5hZ2VyLnNldEJsZW5kTW9kZSh0aGlzLmJsZW5kTW9kZSksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wdXNoTWFzayh0aGlzLl9tYXNrLGEpLHRoaXMuX2ZpbHRlcnMmJmEuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRoaXMuX2ZpbHRlckJsb2NrKSx0aGlzLmJsZW5kTW9kZSE9PWEuc3ByaXRlQmF0Y2guY3VycmVudEJsZW5kTW9kZSl7YS5zcHJpdGVCYXRjaC5jdXJyZW50QmxlbmRNb2RlPXRoaXMuYmxlbmRNb2RlO3ZhciBjPWIuYmxlbmRNb2Rlc1dlYkdMW2Euc3ByaXRlQmF0Y2guY3VycmVudEJsZW5kTW9kZV07YS5zcHJpdGVCYXRjaC5nbC5ibGVuZEZ1bmMoY1swXSxjWzFdKX1pZihiLldlYkdMR3JhcGhpY3MucmVuZGVyR3JhcGhpY3ModGhpcyxhKSx0aGlzLmNoaWxkcmVuLmxlbmd0aCl7YS5zcHJpdGVCYXRjaC5zdGFydCgpO2Zvcih2YXIgZD0wLGU9dGhpcy5jaGlsZHJlbi5sZW5ndGg7ZT5kO2QrKyl0aGlzLmNoaWxkcmVuW2RdLl9yZW5kZXJXZWJHTChhKTthLnNwcml0ZUJhdGNoLnN0b3AoKX10aGlzLl9maWx0ZXJzJiZhLmZpbHRlck1hbmFnZXIucG9wRmlsdGVyKCksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKHRoaXMubWFzayxhKSxhLmRyYXdDb3VudCsrLGEuc3ByaXRlQmF0Y2guc3RhcnQoKX19LGIuR3JhcGhpY3MucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlIT09ITEmJjAhPT10aGlzLmFscGhhJiZ0aGlzLmlzTWFzayE9PSEwKXt2YXIgYz1hLmNvbnRleHQsZD10aGlzLndvcmxkVHJhbnNmb3JtO3RoaXMuYmxlbmRNb2RlIT09YS5jdXJyZW50QmxlbmRNb2RlJiYoYS5jdXJyZW50QmxlbmRNb2RlPXRoaXMuYmxlbmRNb2RlLGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPWIuYmxlbmRNb2Rlc0NhbnZhc1thLmN1cnJlbnRCbGVuZE1vZGVdKSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssYS5jb250ZXh0KSxjLnNldFRyYW5zZm9ybShkLmEsZC5jLGQuYixkLmQsZC50eCxkLnR5KSxiLkNhbnZhc0dyYXBoaWNzLnJlbmRlckdyYXBoaWNzKHRoaXMsYyk7Zm9yKHZhciBlPTAsZj10aGlzLmNoaWxkcmVuLmxlbmd0aDtmPmU7ZSsrKXRoaXMuY2hpbGRyZW5bZV0uX3JlbmRlckNhbnZhcyhhKTt0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnBvcE1hc2soYS5jb250ZXh0KX19LGIuR3JhcGhpY3MucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbihhKXt0aGlzLmJvdW5kc3x8dGhpcy51cGRhdGVCb3VuZHMoKTt2YXIgYj10aGlzLmJvdW5kcy54LGM9dGhpcy5ib3VuZHMud2lkdGgrdGhpcy5ib3VuZHMueCxkPXRoaXMuYm91bmRzLnksZT10aGlzLmJvdW5kcy5oZWlnaHQrdGhpcy5ib3VuZHMueSxmPWF8fHRoaXMud29ybGRUcmFuc2Zvcm0sZz1mLmEsaD1mLmMsaT1mLmIsaj1mLmQsaz1mLnR4LGw9Zi50eSxtPWcqYytpKmUrayxuPWoqZStoKmMrbCxvPWcqYitpKmUrayxwPWoqZStoKmIrbCxxPWcqYitpKmQrayxyPWoqZCtoKmIrbCxzPWcqYytpKmQrayx0PWoqZCtoKmMrbCx1PW0sdj1uLHc9bSx4PW47dz13Pm8/bzp3LHc9dz5xP3E6dyx3PXc+cz9zOncseD14PnA/cDp4LHg9eD5yP3I6eCx4PXg+dD90OngsdT1vPnU/bzp1LHU9cT51P3E6dSx1PXM+dT9zOnUsdj1wPnY/cDp2LHY9cj52P3I6dix2PXQ+dj90OnY7dmFyIHk9dGhpcy5fYm91bmRzO3JldHVybiB5Lng9dyx5LndpZHRoPXUtdyx5Lnk9eCx5LmhlaWdodD12LXgseX0sYi5HcmFwaGljcy5wcm90b3R5cGUudXBkYXRlQm91bmRzPWZ1bmN0aW9uKCl7Zm9yKHZhciBhLGMsZCxlLGYsZz0xLzAsaD0tMS8wLGk9MS8wLGo9LTEvMCxrPTA7azx0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7aysrKXt2YXIgbD10aGlzLmdyYXBoaWNzRGF0YVtrXSxtPWwudHlwZSxuPWwubGluZVdpZHRoO2lmKGE9bC5wb2ludHMsbT09PWIuR3JhcGhpY3MuUkVDVCljPWFbMF0tbi8yLGQ9YVsxXS1uLzIsZT1hWzJdK24sZj1hWzNdK24sZz1nPmM/YzpnLGg9YytlPmg/YytlOmgsaT1pPmQ/YzppLGo9ZCtmPmo/ZCtmOmo7ZWxzZSBpZihtPT09Yi5HcmFwaGljcy5DSVJDfHxtPT09Yi5HcmFwaGljcy5FTElQKWM9YVswXSxkPWFbMV0sZT1hWzJdK24vMixmPWFbM10rbi8yLGc9Zz5jLWU/Yy1lOmcsaD1jK2U+aD9jK2U6aCxpPWk+ZC1mP2QtZjppLGo9ZCtmPmo/ZCtmOmo7ZWxzZSBmb3IodmFyIG89MDtvPGEubGVuZ3RoO28rPTIpYz1hW29dLGQ9YVtvKzFdLGc9Zz5jLW4/Yy1uOmcsaD1jK24+aD9jK246aCxpPWk+ZC1uP2QtbjppLGo9ZCtuPmo/ZCtuOmp9dmFyIHA9dGhpcy5ib3VuZHNQYWRkaW5nO3RoaXMuYm91bmRzPW5ldyBiLlJlY3RhbmdsZShnLXAsaS1wLGgtZysyKnAsai1pKzIqcCl9LGIuR3JhcGhpY3MucHJvdG90eXBlLl9nZW5lcmF0ZUNhY2hlZFNwcml0ZT1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2V0TG9jYWxCb3VuZHMoKTtpZih0aGlzLl9jYWNoZWRTcHJpdGUpdGhpcy5fY2FjaGVkU3ByaXRlLmJ1ZmZlci5yZXNpemUoYS53aWR0aCxhLmhlaWdodCk7ZWxzZXt2YXIgYz1uZXcgYi5DYW52YXNCdWZmZXIoYS53aWR0aCxhLmhlaWdodCksZD1iLlRleHR1cmUuZnJvbUNhbnZhcyhjLmNhbnZhcyk7dGhpcy5fY2FjaGVkU3ByaXRlPW5ldyBiLlNwcml0ZShkKSx0aGlzLl9jYWNoZWRTcHJpdGUuYnVmZmVyPWMsdGhpcy5fY2FjaGVkU3ByaXRlLndvcmxkVHJhbnNmb3JtPXRoaXMud29ybGRUcmFuc2Zvcm19dGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci54PS0oYS54L2Eud2lkdGgpLHRoaXMuX2NhY2hlZFNwcml0ZS5hbmNob3IueT0tKGEueS9hLmhlaWdodCksdGhpcy5fY2FjaGVkU3ByaXRlLmJ1ZmZlci5jb250ZXh0LnRyYW5zbGF0ZSgtYS54LC1hLnkpLGIuQ2FudmFzR3JhcGhpY3MucmVuZGVyR3JhcGhpY3ModGhpcyx0aGlzLl9jYWNoZWRTcHJpdGUuYnVmZmVyLmNvbnRleHQpLHRoaXMuX2NhY2hlZFNwcml0ZS5hbHBoYT10aGlzLmFscGhhfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5kZXN0cm95Q2FjaGVkU3ByaXRlPWZ1bmN0aW9uKCl7dGhpcy5fY2FjaGVkU3ByaXRlLnRleHR1cmUuZGVzdHJveSghMCksdGhpcy5fY2FjaGVkU3ByaXRlPW51bGx9LGIuR3JhcGhpY3MuUE9MWT0wLGIuR3JhcGhpY3MuUkVDVD0xLGIuR3JhcGhpY3MuQ0lSQz0yLGIuR3JhcGhpY3MuRUxJUD0zLGIuR3JhcGhpY3MuUlJFQz00LGIuU3RyaXA9ZnVuY3Rpb24oYSl7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyksdGhpcy50ZXh0dXJlPWEsdGhpcy51dnM9bmV3IGIuRmxvYXQzMkFycmF5KFswLDEsMSwxLDEsMCwwLDFdKSx0aGlzLnZlcnRpY2llcz1uZXcgYi5GbG9hdDMyQXJyYXkoWzAsMCwxMDAsMCwxMDAsMTAwLDAsMTAwXSksdGhpcy5jb2xvcnM9bmV3IGIuRmxvYXQzMkFycmF5KFsxLDEsMSwxXSksdGhpcy5pbmRpY2VzPW5ldyBiLlVpbnQxNkFycmF5KFswLDEsMiwzXSksdGhpcy5kaXJ0eT0hMH0sYi5TdHJpcC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLlN0cmlwLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlN0cmlwLGIuU3RyaXAucHJvdG90eXBlLl9yZW5kZXJXZWJHTD1mdW5jdGlvbihhKXshdGhpcy52aXNpYmxlfHx0aGlzLmFscGhhPD0wfHwoYS5zcHJpdGVCYXRjaC5zdG9wKCksdGhpcy5fdmVydGV4QnVmZmVyfHx0aGlzLl9pbml0V2ViR0woYSksYS5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihhLnNoYWRlck1hbmFnZXIuc3RyaXBTaGFkZXIpLHRoaXMuX3JlbmRlclN0cmlwKGEpLGEuc3ByaXRlQmF0Y2guc3RhcnQoKSl9LGIuU3RyaXAucHJvdG90eXBlLl9pbml0V2ViR0w9ZnVuY3Rpb24oYSl7dmFyIGI9YS5nbDt0aGlzLl92ZXJ0ZXhCdWZmZXI9Yi5jcmVhdGVCdWZmZXIoKSx0aGlzLl9pbmRleEJ1ZmZlcj1iLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuX3V2QnVmZmVyPWIuY3JlYXRlQnVmZmVyKCksdGhpcy5fY29sb3JCdWZmZXI9Yi5jcmVhdGVCdWZmZXIoKSxiLmJpbmRCdWZmZXIoYi5BUlJBWV9CVUZGRVIsdGhpcy5fdmVydGV4QnVmZmVyKSxiLmJ1ZmZlckRhdGEoYi5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0aWNpZXMsYi5EWU5BTUlDX0RSQVcpLGIuYmluZEJ1ZmZlcihiLkFSUkFZX0JVRkZFUix0aGlzLl91dkJ1ZmZlciksYi5idWZmZXJEYXRhKGIuQVJSQVlfQlVGRkVSLHRoaXMudXZzLGIuU1RBVElDX0RSQVcpLGIuYmluZEJ1ZmZlcihiLkFSUkFZX0JVRkZFUix0aGlzLl9jb2xvckJ1ZmZlciksYi5idWZmZXJEYXRhKGIuQVJSQVlfQlVGRkVSLHRoaXMuY29sb3JzLGIuU1RBVElDX0RSQVcpLGIuYmluZEJ1ZmZlcihiLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuX2luZGV4QnVmZmVyKSxiLmJ1ZmZlckRhdGEoYi5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGljZXMsYi5TVEFUSUNfRFJBVyl9LGIuU3RyaXAucHJvdG90eXBlLl9yZW5kZXJTdHJpcD1mdW5jdGlvbihhKXt2YXIgYz1hLmdsLGQ9YS5wcm9qZWN0aW9uLGU9YS5vZmZzZXQsZj1hLnNoYWRlck1hbmFnZXIuc3RyaXBTaGFkZXI7Yy5ibGVuZEZ1bmMoYy5PTkUsYy5PTkVfTUlOVVNfU1JDX0FMUEhBKSxjLnVuaWZvcm1NYXRyaXgzZnYoZi50cmFuc2xhdGlvbk1hdHJpeCwhMSx0aGlzLndvcmxkVHJhbnNmb3JtLnRvQXJyYXkoITApKSxjLnVuaWZvcm0yZihmLnByb2plY3Rpb25WZWN0b3IsZC54LC1kLnkpLGMudW5pZm9ybTJmKGYub2Zmc2V0VmVjdG9yLC1lLngsLWUueSksYy51bmlmb3JtMWYoZi5hbHBoYSwxKSx0aGlzLmRpcnR5Pyh0aGlzLmRpcnR5PSExLGMuYmluZEJ1ZmZlcihjLkFSUkFZX0JVRkZFUix0aGlzLl92ZXJ0ZXhCdWZmZXIpLGMuYnVmZmVyRGF0YShjLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRpY2llcyxjLlNUQVRJQ19EUkFXKSxjLnZlcnRleEF0dHJpYlBvaW50ZXIoZi5hVmVydGV4UG9zaXRpb24sMixjLkZMT0FULCExLDAsMCksYy5iaW5kQnVmZmVyKGMuQVJSQVlfQlVGRkVSLHRoaXMuX3V2QnVmZmVyKSxjLmJ1ZmZlckRhdGEoYy5BUlJBWV9CVUZGRVIsdGhpcy51dnMsYy5TVEFUSUNfRFJBVyksYy52ZXJ0ZXhBdHRyaWJQb2ludGVyKGYuYVRleHR1cmVDb29yZCwyLGMuRkxPQVQsITEsMCwwKSxjLmFjdGl2ZVRleHR1cmUoYy5URVhUVVJFMCksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsdGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLl9nbFRleHR1cmVzW2MuaWRdfHxiLmNyZWF0ZVdlYkdMVGV4dHVyZSh0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUsYykpLGMuYmluZEJ1ZmZlcihjLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuX2luZGV4QnVmZmVyKSxjLmJ1ZmZlckRhdGEoYy5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGljZXMsYy5TVEFUSUNfRFJBVykpOihjLmJpbmRCdWZmZXIoYy5BUlJBWV9CVUZGRVIsdGhpcy5fdmVydGV4QnVmZmVyKSxjLmJ1ZmZlclN1YkRhdGEoYy5BUlJBWV9CVUZGRVIsMCx0aGlzLnZlcnRpY2llcyksYy52ZXJ0ZXhBdHRyaWJQb2ludGVyKGYuYVZlcnRleFBvc2l0aW9uLDIsYy5GTE9BVCwhMSwwLDApLGMuYmluZEJ1ZmZlcihjLkFSUkFZX0JVRkZFUix0aGlzLl91dkJ1ZmZlciksYy52ZXJ0ZXhBdHRyaWJQb2ludGVyKGYuYVRleHR1cmVDb29yZCwyLGMuRkxPQVQsITEsMCwwKSxjLmFjdGl2ZVRleHR1cmUoYy5URVhUVVJFMCksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsdGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLl9nbFRleHR1cmVzW2MuaWRdfHxiLmNyZWF0ZVdlYkdMVGV4dHVyZSh0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUsYykpLGMuYmluZEJ1ZmZlcihjLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuX2luZGV4QnVmZmVyKSksYy5kcmF3RWxlbWVudHMoYy5UUklBTkdMRV9TVFJJUCx0aGlzLmluZGljZXMubGVuZ3RoLGMuVU5TSUdORURfU0hPUlQsMCl9LGIuU3RyaXAucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7dmFyIGI9YS5jb250ZXh0LGM9dGhpcy53b3JsZFRyYW5zZm9ybTthLnJvdW5kUGl4ZWxzP2Iuc2V0VHJhbnNmb3JtKGMuYSxjLmMsYy5iLGMuZCwwfGMudHgsMHxjLnR5KTpiLnNldFRyYW5zZm9ybShjLmEsYy5jLGMuYixjLmQsYy50eCxjLnR5KTt2YXIgZD10aGlzLGU9ZC52ZXJ0aWNpZXMsZj1kLnV2cyxnPWUubGVuZ3RoLzI7dGhpcy5jb3VudCsrO2Zvcih2YXIgaD0wO2ctMj5oO2grKyl7dmFyIGk9MipoLGo9ZVtpXSxrPWVbaSsyXSxsPWVbaSs0XSxtPWVbaSsxXSxuPWVbaSszXSxvPWVbaSs1XSxwPShqK2srbCkvMyxxPShtK24rbykvMyxyPWotcCxzPW0tcSx0PU1hdGguc3FydChyKnIrcypzKTtqPXArci90Kih0KzMpLG09cStzL3QqKHQrMykscj1rLXAscz1uLXEsdD1NYXRoLnNxcnQocipyK3Mqcyksaz1wK3IvdCoodCszKSxuPXErcy90Kih0KzMpLHI9bC1wLHM9by1xLHQ9TWF0aC5zcXJ0KHIqcitzKnMpLGw9cCtyL3QqKHQrMyksbz1xK3MvdCoodCszKTt2YXIgdT1mW2ldKmQudGV4dHVyZS53aWR0aCx2PWZbaSsyXSpkLnRleHR1cmUud2lkdGgsdz1mW2krNF0qZC50ZXh0dXJlLndpZHRoLHg9ZltpKzFdKmQudGV4dHVyZS5oZWlnaHQseT1mW2krM10qZC50ZXh0dXJlLmhlaWdodCx6PWZbaSs1XSpkLnRleHR1cmUuaGVpZ2h0O2Iuc2F2ZSgpLGIuYmVnaW5QYXRoKCksYi5tb3ZlVG8oaixtKSxiLmxpbmVUbyhrLG4pLGIubGluZVRvKGwsbyksYi5jbG9zZVBhdGgoKSxiLmNsaXAoKTt2YXIgQT11KnkreCp3K3Yqei15KncteCp2LXUqeixCPWoqeSt4Kmwrayp6LXkqbC14Kmstaip6LEM9dSprK2oqdyt2Kmwtayp3LWoqdi11KmwsRD11KnkqbCt4KmsqdytqKnYqei1qKnkqdy14KnYqbC11KmsqeixFPW0qeSt4Km8rbip6LXkqby14Km4tbSp6LEY9dSpuK20qdyt2Km8tbip3LW0qdi11Km8sRz11Knkqbyt4Km4qdyttKnYqei1tKnkqdy14KnYqby11Km4qejtiLnRyYW5zZm9ybShCL0EsRS9BLEMvQSxGL0EsRC9BLEcvQSksYi5kcmF3SW1hZ2UoZC50ZXh0dXJlLmJhc2VUZXh0dXJlLnNvdXJjZSwwLDApLGIucmVzdG9yZSgpfX0sYi5TdHJpcC5wcm90b3R5cGUub25UZXh0dXJlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy51cGRhdGVGcmFtZT0hMH0sYi5Sb3BlPWZ1bmN0aW9uKGEsYyl7Yi5TdHJpcC5jYWxsKHRoaXMsYSksdGhpcy5wb2ludHM9Yyx0aGlzLnZlcnRpY2llcz1uZXcgYi5GbG9hdDMyQXJyYXkoNCpjLmxlbmd0aCksdGhpcy51dnM9bmV3IGIuRmxvYXQzMkFycmF5KDQqYy5sZW5ndGgpLHRoaXMuY29sb3JzPW5ldyBiLkZsb2F0MzJBcnJheSgyKmMubGVuZ3RoKSx0aGlzLmluZGljZXM9bmV3IGIuVWludDE2QXJyYXkoMipjLmxlbmd0aCksdGhpcy5yZWZyZXNoKCl9LGIuUm9wZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLlN0cmlwLnByb3RvdHlwZSksYi5Sb3BlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlJvcGUsYi5Sb3BlLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5wb2ludHM7aWYoIShhLmxlbmd0aDwxKSl7dmFyIGI9dGhpcy51dnMsYz1hWzBdLGQ9dGhpcy5pbmRpY2VzLGU9dGhpcy5jb2xvcnM7dGhpcy5jb3VudC09LjIsYlswXT0wLGJbMV09MCxiWzJdPTAsYlszXT0xLGVbMF09MSxlWzFdPTEsZFswXT0wLGRbMV09MTtmb3IodmFyIGYsZyxoLGk9YS5sZW5ndGgsaj0xO2k+ajtqKyspZj1hW2pdLGc9NCpqLGg9ai8oaS0xKSxqJTI/KGJbZ109aCxiW2crMV09MCxiW2crMl09aCxiW2crM109MSk6KGJbZ109aCxiW2crMV09MCxiW2crMl09aCxiW2crM109MSksZz0yKmosZVtnXT0xLGVbZysxXT0xLGc9MipqLGRbZ109ZyxkW2crMV09ZysxLGM9Zn19LGIuUm9wZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5wb2ludHM7aWYoIShhLmxlbmd0aDwxKSl7dmFyIGMsZD1hWzBdLGU9e3g6MCx5OjB9O3RoaXMuY291bnQtPS4yO2Zvcih2YXIgZixnLGgsaSxqLGs9dGhpcy52ZXJ0aWNpZXMsbD1hLmxlbmd0aCxtPTA7bD5tO20rKylmPWFbbV0sZz00Km0sYz1tPGEubGVuZ3RoLTE/YVttKzFdOmYsZS55PS0oYy54LWQueCksZS54PWMueS1kLnksaD0xMCooMS1tLyhsLTEpKSxoPjEmJihoPTEpLGk9TWF0aC5zcXJ0KGUueCplLngrZS55KmUueSksaj10aGlzLnRleHR1cmUuaGVpZ2h0LzIsZS54Lz1pLGUueS89aSxlLngqPWosZS55Kj1qLGtbZ109Zi54K2UueCxrW2crMV09Zi55K2UueSxrW2crMl09Zi54LWUueCxrW2crM109Zi55LWUueSxkPWY7Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKX19LGIuUm9wZS5wcm90b3R5cGUuc2V0VGV4dHVyZT1mdW5jdGlvbihhKXt0aGlzLnRleHR1cmU9YX0sYi5UaWxpbmdTcHJpdGU9ZnVuY3Rpb24oYSxjLGQpe2IuU3ByaXRlLmNhbGwodGhpcyxhKSx0aGlzLl93aWR0aD1jfHwxMDAsdGhpcy5faGVpZ2h0PWR8fDEwMCx0aGlzLnRpbGVTY2FsZT1uZXcgYi5Qb2ludCgxLDEpLHRoaXMudGlsZVNjYWxlT2Zmc2V0PW5ldyBiLlBvaW50KDEsMSksdGhpcy50aWxlUG9zaXRpb249bmV3IGIuUG9pbnQoMCwwKSx0aGlzLnJlbmRlcmFibGU9ITAsdGhpcy50aW50PTE2Nzc3MjE1LHRoaXMuYmxlbmRNb2RlPWIuYmxlbmRNb2Rlcy5OT1JNQUx9LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuU3ByaXRlLnByb3RvdHlwZSksYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuVGlsaW5nU3ByaXRlLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUsXCJ3aWR0aFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd2lkdGh9LHNldDpmdW5jdGlvbihhKXt0aGlzLl93aWR0aD1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUsXCJoZWlnaHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2hlaWdodH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuX2hlaWdodD1hfX0pLGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5zZXRUZXh0dXJlPWZ1bmN0aW9uKGEpe3RoaXMudGV4dHVyZSE9PWEmJih0aGlzLnRleHR1cmU9YSx0aGlzLnJlZnJlc2hUZXh0dXJlPSEwLHRoaXMuY2FjaGVkVGludD0xNjc3NzIxNSl9LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlIT09ITEmJjAhPT10aGlzLmFscGhhKXt2YXIgYyxkO2Zvcih0aGlzLl9tYXNrJiYoYS5zcHJpdGVCYXRjaC5zdG9wKCksYS5tYXNrTWFuYWdlci5wdXNoTWFzayh0aGlzLm1hc2ssYSksYS5zcHJpdGVCYXRjaC5zdGFydCgpKSx0aGlzLl9maWx0ZXJzJiYoYS5zcHJpdGVCYXRjaC5mbHVzaCgpLGEuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRoaXMuX2ZpbHRlckJsb2NrKSksIXRoaXMudGlsaW5nVGV4dHVyZXx8dGhpcy5yZWZyZXNoVGV4dHVyZT8odGhpcy5nZW5lcmF0ZVRpbGluZ1RleHR1cmUoITApLHRoaXMudGlsaW5nVGV4dHVyZSYmdGhpcy50aWxpbmdUZXh0dXJlLm5lZWRzVXBkYXRlJiYoYi51cGRhdGVXZWJHTFRleHR1cmUodGhpcy50aWxpbmdUZXh0dXJlLmJhc2VUZXh0dXJlLGEuZ2wpLHRoaXMudGlsaW5nVGV4dHVyZS5uZWVkc1VwZGF0ZT0hMSkpOmEuc3ByaXRlQmF0Y2gucmVuZGVyVGlsaW5nU3ByaXRlKHRoaXMpLGM9MCxkPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2Q+YztjKyspdGhpcy5jaGlsZHJlbltjXS5fcmVuZGVyV2ViR0woYSk7YS5zcHJpdGVCYXRjaC5zdG9wKCksdGhpcy5fZmlsdGVycyYmYS5maWx0ZXJNYW5hZ2VyLnBvcEZpbHRlcigpLHRoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayhhKSxhLnNwcml0ZUJhdGNoLnN0YXJ0KCl9fSxiLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUuX3JlbmRlckNhbnZhcz1mdW5jdGlvbihhKXtpZih0aGlzLnZpc2libGUhPT0hMSYmMCE9PXRoaXMuYWxwaGEpe3ZhciBjPWEuY29udGV4dDt0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssYyksYy5nbG9iYWxBbHBoYT10aGlzLndvcmxkQWxwaGE7dmFyIGQsZSxmPXRoaXMud29ybGRUcmFuc2Zvcm07aWYoYy5zZXRUcmFuc2Zvcm0oZi5hLGYuYyxmLmIsZi5kLGYudHgsZi50eSksIXRoaXMuX190aWxlUGF0dGVybnx8dGhpcy5yZWZyZXNoVGV4dHVyZSl7aWYodGhpcy5nZW5lcmF0ZVRpbGluZ1RleHR1cmUoITEpLCF0aGlzLnRpbGluZ1RleHR1cmUpcmV0dXJuO3RoaXMuX190aWxlUGF0dGVybj1jLmNyZWF0ZVBhdHRlcm4odGhpcy50aWxpbmdUZXh0dXJlLmJhc2VUZXh0dXJlLnNvdXJjZSxcInJlcGVhdFwiKX10aGlzLmJsZW5kTW9kZSE9PWEuY3VycmVudEJsZW5kTW9kZSYmKGEuY3VycmVudEJsZW5kTW9kZT10aGlzLmJsZW5kTW9kZSxjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1iLmJsZW5kTW9kZXNDYW52YXNbYS5jdXJyZW50QmxlbmRNb2RlXSk7dmFyIGc9dGhpcy50aWxlUG9zaXRpb24saD10aGlzLnRpbGVTY2FsZTtmb3IoZy54JT10aGlzLnRpbGluZ1RleHR1cmUuYmFzZVRleHR1cmUud2lkdGgsZy55JT10aGlzLnRpbGluZ1RleHR1cmUuYmFzZVRleHR1cmUuaGVpZ2h0LGMuc2NhbGUoaC54LGgueSksYy50cmFuc2xhdGUoZy54LGcueSksYy5maWxsU3R5bGU9dGhpcy5fX3RpbGVQYXR0ZXJuLGMuZmlsbFJlY3QoLWcueCt0aGlzLmFuY2hvci54Ki10aGlzLl93aWR0aCwtZy55K3RoaXMuYW5jaG9yLnkqLXRoaXMuX2hlaWdodCx0aGlzLl93aWR0aC9oLngsdGhpcy5faGVpZ2h0L2gueSksYy5zY2FsZSgxL2gueCwxL2gueSksYy50cmFuc2xhdGUoLWcueCwtZy55KSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnBvcE1hc2soYS5jb250ZXh0KSxkPTAsZT10aGlzLmNoaWxkcmVuLmxlbmd0aDtlPmQ7ZCsrKXRoaXMuY2hpbGRyZW5bZF0uX3JlbmRlckNhbnZhcyhhKX19LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5nZXRCb3VuZHM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLl93aWR0aCxiPXRoaXMuX2hlaWdodCxjPWEqKDEtdGhpcy5hbmNob3IueCksZD1hKi10aGlzLmFuY2hvci54LGU9YiooMS10aGlzLmFuY2hvci55KSxmPWIqLXRoaXMuYW5jaG9yLnksZz10aGlzLndvcmxkVHJhbnNmb3JtLGg9Zy5hLGk9Zy5jLGo9Zy5iLGs9Zy5kLGw9Zy50eCxtPWcudHksbj1oKmQraipmK2wsbz1rKmYraSpkK20scD1oKmMraipmK2wscT1rKmYraSpjK20scj1oKmMraiplK2wscz1rKmUraSpjK20sdD1oKmQraiplK2wsdT1rKmUraSpkK20sdj0tMS8wLHc9LTEvMCx4PTEvMCx5PTEvMDt4PXg+bj9uOngseD14PnA/cDp4LHg9eD5yP3I6eCx4PXg+dD90OngseT15Pm8/bzp5LHk9eT5xP3E6eSx5PXk+cz9zOnkseT15PnU/dTp5LHY9bj52P246dix2PXA+dj9wOnYsdj1yPnY/cjp2LHY9dD52P3Q6dix3PW8+dz9vOncsdz1xPnc/cTp3LHc9cz53P3M6dyx3PXU+dz91Onc7dmFyIHo9dGhpcy5fYm91bmRzO3JldHVybiB6Lng9eCx6LndpZHRoPXYteCx6Lnk9eSx6LmhlaWdodD13LXksdGhpcy5fY3VycmVudEJvdW5kcz16LHp9LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5vblRleHR1cmVVcGRhdGU9ZnVuY3Rpb24oKXt9LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5nZW5lcmF0ZVRpbGluZ1RleHR1cmU9ZnVuY3Rpb24oYSl7aWYodGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCl7dmFyIGMsZCxlPXRoaXMudGV4dHVyZSxmPWUuZnJhbWUsZz1mLndpZHRoIT09ZS5iYXNlVGV4dHVyZS53aWR0aHx8Zi5oZWlnaHQhPT1lLmJhc2VUZXh0dXJlLmhlaWdodCxoPSExO2lmKGE/KGM9Yi5nZXROZXh0UG93ZXJPZlR3byhmLndpZHRoKSxkPWIuZ2V0TmV4dFBvd2VyT2ZUd28oZi5oZWlnaHQpLChmLndpZHRoIT09Y3x8Zi5oZWlnaHQhPT1kKSYmKGg9ITApKTpnJiYoYz1mLndpZHRoLGQ9Zi5oZWlnaHQsaD0hMCksaCl7dmFyIGk7dGhpcy50aWxpbmdUZXh0dXJlJiZ0aGlzLnRpbGluZ1RleHR1cmUuaXNUaWxpbmc/KGk9dGhpcy50aWxpbmdUZXh0dXJlLmNhbnZhc0J1ZmZlcixpLnJlc2l6ZShjLGQpLHRoaXMudGlsaW5nVGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aD1jLHRoaXMudGlsaW5nVGV4dHVyZS5iYXNlVGV4dHVyZS5oZWlnaHQ9ZCx0aGlzLnRpbGluZ1RleHR1cmUubmVlZHNVcGRhdGU9ITApOihpPW5ldyBiLkNhbnZhc0J1ZmZlcihjLGQpLHRoaXMudGlsaW5nVGV4dHVyZT1iLlRleHR1cmUuZnJvbUNhbnZhcyhpLmNhbnZhcyksdGhpcy50aWxpbmdUZXh0dXJlLmNhbnZhc0J1ZmZlcj1pLHRoaXMudGlsaW5nVGV4dHVyZS5pc1RpbGluZz0hMCksaS5jb250ZXh0LmRyYXdJbWFnZShlLmJhc2VUZXh0dXJlLnNvdXJjZSxlLmNyb3AueCxlLmNyb3AueSxlLmNyb3Aud2lkdGgsZS5jcm9wLmhlaWdodCwwLDAsYyxkKSx0aGlzLnRpbGVTY2FsZU9mZnNldC54PWYud2lkdGgvYyx0aGlzLnRpbGVTY2FsZU9mZnNldC55PWYuaGVpZ2h0L2R9ZWxzZSB0aGlzLnRpbGluZ1RleHR1cmUmJnRoaXMudGlsaW5nVGV4dHVyZS5pc1RpbGluZyYmdGhpcy50aWxpbmdUZXh0dXJlLmRlc3Ryb3koITApLHRoaXMudGlsZVNjYWxlT2Zmc2V0Lng9MSx0aGlzLnRpbGVTY2FsZU9mZnNldC55PTEsdGhpcy50aWxpbmdUZXh0dXJlPWU7dGhpcy5yZWZyZXNoVGV4dHVyZT0hMSx0aGlzLnRpbGluZ1RleHR1cmUuYmFzZVRleHR1cmUuX3Bvd2VyT2YyPSEwfX07dmFyIGY9e307Zi5Cb25lRGF0YT1mdW5jdGlvbihhLGIpe3RoaXMubmFtZT1hLHRoaXMucGFyZW50PWJ9LGYuQm9uZURhdGEucHJvdG90eXBlPXtsZW5ndGg6MCx4OjAseTowLHJvdGF0aW9uOjAsc2NhbGVYOjEsc2NhbGVZOjF9LGYuU2xvdERhdGE9ZnVuY3Rpb24oYSxiKXt0aGlzLm5hbWU9YSx0aGlzLmJvbmVEYXRhPWJ9LGYuU2xvdERhdGEucHJvdG90eXBlPXtyOjEsZzoxLGI6MSxhOjEsYXR0YWNobWVudE5hbWU6bnVsbH0sZi5Cb25lPWZ1bmN0aW9uKGEsYil7dGhpcy5kYXRhPWEsdGhpcy5wYXJlbnQ9Yix0aGlzLnNldFRvU2V0dXBQb3NlKCl9LGYuQm9uZS55RG93bj0hMSxmLkJvbmUucHJvdG90eXBlPXt4OjAseTowLHJvdGF0aW9uOjAsc2NhbGVYOjEsc2NhbGVZOjEsbTAwOjAsbTAxOjAsd29ybGRYOjAsbTEwOjAsbTExOjAsd29ybGRZOjAsd29ybGRSb3RhdGlvbjowLHdvcmxkU2NhbGVYOjEsd29ybGRTY2FsZVk6MSx1cGRhdGVXb3JsZFRyYW5zZm9ybTpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMucGFyZW50O251bGwhPWM/KHRoaXMud29ybGRYPXRoaXMueCpjLm0wMCt0aGlzLnkqYy5tMDErYy53b3JsZFgsdGhpcy53b3JsZFk9dGhpcy54KmMubTEwK3RoaXMueSpjLm0xMStjLndvcmxkWSx0aGlzLndvcmxkU2NhbGVYPWMud29ybGRTY2FsZVgqdGhpcy5zY2FsZVgsdGhpcy53b3JsZFNjYWxlWT1jLndvcmxkU2NhbGVZKnRoaXMuc2NhbGVZLHRoaXMud29ybGRSb3RhdGlvbj1jLndvcmxkUm90YXRpb24rdGhpcy5yb3RhdGlvbik6KHRoaXMud29ybGRYPXRoaXMueCx0aGlzLndvcmxkWT10aGlzLnksdGhpcy53b3JsZFNjYWxlWD10aGlzLnNjYWxlWCx0aGlzLndvcmxkU2NhbGVZPXRoaXMuc2NhbGVZLHRoaXMud29ybGRSb3RhdGlvbj10aGlzLnJvdGF0aW9uKTt2YXIgZD10aGlzLndvcmxkUm90YXRpb24qTWF0aC5QSS8xODAsZT1NYXRoLmNvcyhkKSxnPU1hdGguc2luKGQpO3RoaXMubTAwPWUqdGhpcy53b3JsZFNjYWxlWCx0aGlzLm0xMD1nKnRoaXMud29ybGRTY2FsZVgsdGhpcy5tMDE9LWcqdGhpcy53b3JsZFNjYWxlWSx0aGlzLm0xMT1lKnRoaXMud29ybGRTY2FsZVksYSYmKHRoaXMubTAwPS10aGlzLm0wMCx0aGlzLm0wMT0tdGhpcy5tMDEpLGImJih0aGlzLm0xMD0tdGhpcy5tMTAsdGhpcy5tMTE9LXRoaXMubTExKSxmLkJvbmUueURvd24mJih0aGlzLm0xMD0tdGhpcy5tMTAsdGhpcy5tMTE9LXRoaXMubTExKX0sc2V0VG9TZXR1cFBvc2U6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmRhdGE7dGhpcy54PWEueCx0aGlzLnk9YS55LHRoaXMucm90YXRpb249YS5yb3RhdGlvbix0aGlzLnNjYWxlWD1hLnNjYWxlWCx0aGlzLnNjYWxlWT1hLnNjYWxlWX19LGYuU2xvdD1mdW5jdGlvbihhLGIsYyl7dGhpcy5kYXRhPWEsdGhpcy5za2VsZXRvbj1iLHRoaXMuYm9uZT1jLHRoaXMuc2V0VG9TZXR1cFBvc2UoKX0sZi5TbG90LnByb3RvdHlwZT17cjoxLGc6MSxiOjEsYToxLF9hdHRhY2htZW50VGltZTowLGF0dGFjaG1lbnQ6bnVsbCxzZXRBdHRhY2htZW50OmZ1bmN0aW9uKGEpe3RoaXMuYXR0YWNobWVudD1hLHRoaXMuX2F0dGFjaG1lbnRUaW1lPXRoaXMuc2tlbGV0b24udGltZX0sc2V0QXR0YWNobWVudFRpbWU6ZnVuY3Rpb24oYSl7dGhpcy5fYXR0YWNobWVudFRpbWU9dGhpcy5za2VsZXRvbi50aW1lLWF9LGdldEF0dGFjaG1lbnRUaW1lOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2tlbGV0b24udGltZS10aGlzLl9hdHRhY2htZW50VGltZX0sc2V0VG9TZXR1cFBvc2U6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmRhdGE7dGhpcy5yPWEucix0aGlzLmc9YS5nLHRoaXMuYj1hLmIsdGhpcy5hPWEuYTtmb3IodmFyIGI9dGhpcy5za2VsZXRvbi5kYXRhLnNsb3RzLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXT09YSl7dGhpcy5zZXRBdHRhY2htZW50KGEuYXR0YWNobWVudE5hbWU/dGhpcy5za2VsZXRvbi5nZXRBdHRhY2htZW50QnlTbG90SW5kZXgoYyxhLmF0dGFjaG1lbnROYW1lKTpudWxsKTticmVha319fSxmLlNraW49ZnVuY3Rpb24oYSl7dGhpcy5uYW1lPWEsdGhpcy5hdHRhY2htZW50cz17fX0sZi5Ta2luLnByb3RvdHlwZT17YWRkQXR0YWNobWVudDpmdW5jdGlvbihhLGIsYyl7dGhpcy5hdHRhY2htZW50c1thK1wiOlwiK2JdPWN9LGdldEF0dGFjaG1lbnQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5hdHRhY2htZW50c1thK1wiOlwiK2JdfSxfYXR0YWNoQWxsOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjIGluIGIuYXR0YWNobWVudHMpe3ZhciBkPWMuaW5kZXhPZihcIjpcIiksZT1wYXJzZUludChjLnN1YnN0cmluZygwLGQpLDEwKSxmPWMuc3Vic3RyaW5nKGQrMSksZz1hLnNsb3RzW2VdO2lmKGcuYXR0YWNobWVudCYmZy5hdHRhY2htZW50Lm5hbWU9PWYpe3ZhciBoPXRoaXMuZ2V0QXR0YWNobWVudChlLGYpO2gmJmcuc2V0QXR0YWNobWVudChoKX19fX0sZi5BbmltYXRpb249ZnVuY3Rpb24oYSxiLGMpe3RoaXMubmFtZT1hLHRoaXMudGltZWxpbmVzPWIsdGhpcy5kdXJhdGlvbj1jfSxmLkFuaW1hdGlvbi5wcm90b3R5cGU9e2FwcGx5OmZ1bmN0aW9uKGEsYixjKXtjJiZ0aGlzLmR1cmF0aW9uJiYoYiU9dGhpcy5kdXJhdGlvbik7Zm9yKHZhciBkPXRoaXMudGltZWxpbmVzLGU9MCxmPWQubGVuZ3RoO2Y+ZTtlKyspZFtlXS5hcHBseShhLGIsMSl9LG1peDpmdW5jdGlvbihhLGIsYyxkKXtjJiZ0aGlzLmR1cmF0aW9uJiYoYiU9dGhpcy5kdXJhdGlvbik7Zm9yKHZhciBlPXRoaXMudGltZWxpbmVzLGY9MCxnPWUubGVuZ3RoO2c+ZjtmKyspZVtmXS5hcHBseShhLGIsZCl9fSxmLmJpbmFyeVNlYXJjaD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9MCxlPU1hdGguZmxvb3IoYS5sZW5ndGgvYyktMjtpZighZSlyZXR1cm4gYztmb3IodmFyIGY9ZT4+PjE7Oyl7aWYoYVsoZisxKSpjXTw9Yj9kPWYrMTplPWYsZD09ZSlyZXR1cm4oZCsxKSpjO2Y9ZCtlPj4+MX19LGYubGluZWFyU2VhcmNoPWZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9MCxlPWEubGVuZ3RoLWM7ZT49ZDtkKz1jKWlmKGFbZF0+YilyZXR1cm4gZDtyZXR1cm4tMX0sZi5DdXJ2ZXM9ZnVuY3Rpb24oYSl7dGhpcy5jdXJ2ZXM9W10sdGhpcy5jdXJ2ZXMubGVuZ3RoPTYqKGEtMSl9LGYuQ3VydmVzLnByb3RvdHlwZT17c2V0TGluZWFyOmZ1bmN0aW9uKGEpe3RoaXMuY3VydmVzWzYqYV09MH0sc2V0U3RlcHBlZDpmdW5jdGlvbihhKXt0aGlzLmN1cnZlc1s2KmFdPS0xfSxzZXRDdXJ2ZTpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmPS4xLGc9ZipmLGg9ZypmLGk9MypmLGo9MypnLGs9NipnLGw9NipoLG09MiotYitkLG49MiotYytlLG89MyooYi1kKSsxLHA9MyooYy1lKSsxLHE9NiphLHI9dGhpcy5jdXJ2ZXM7cltxXT1iKmkrbSpqK28qaCxyW3ErMV09YyppK24qaitwKmgscltxKzJdPW0qaytvKmwscltxKzNdPW4qaytwKmwscltxKzRdPW8qbCxyW3ErNV09cCpsfSxnZXRDdXJ2ZVBlcmNlbnQ6ZnVuY3Rpb24oYSxiKXtiPTA+Yj8wOmI+MT8xOmI7dmFyIGM9NiphLGQ9dGhpcy5jdXJ2ZXMsZT1kW2NdO2lmKCFlKXJldHVybiBiO2lmKC0xPT1lKXJldHVybiAwO2Zvcih2YXIgZj1kW2MrMV0sZz1kW2MrMl0saD1kW2MrM10saT1kW2MrNF0saj1kW2MrNV0saz1lLGw9ZixtPTg7Oyl7aWYoaz49Yil7dmFyIG49ay1lLG89bC1mO3JldHVybiBvKyhsLW8pKihiLW4pLyhrLW4pfWlmKCFtKWJyZWFrO20tLSxlKz1nLGYrPWgsZys9aSxoKz1qLGsrPWUsbCs9Zn1yZXR1cm4gbCsoMS1sKSooYi1rKS8oMS1rKX19LGYuUm90YXRlVGltZWxpbmU9ZnVuY3Rpb24oYSl7dGhpcy5jdXJ2ZXM9bmV3IGYuQ3VydmVzKGEpLHRoaXMuZnJhbWVzPVtdLHRoaXMuZnJhbWVzLmxlbmd0aD0yKmF9LGYuUm90YXRlVGltZWxpbmUucHJvdG90eXBlPXtib25lSW5kZXg6MCxnZXRGcmFtZUNvdW50OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZnJhbWVzLmxlbmd0aC8yfSxzZXRGcmFtZTpmdW5jdGlvbihhLGIsYyl7YSo9Mix0aGlzLmZyYW1lc1thXT1iLHRoaXMuZnJhbWVzW2ErMV09Y30sYXBwbHk6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU9dGhpcy5mcmFtZXM7aWYoIShiPGVbMF0pKXt2YXIgZz1hLmJvbmVzW3RoaXMuYm9uZUluZGV4XTtpZihiPj1lW2UubGVuZ3RoLTJdKXtmb3IoZD1nLmRhdGEucm90YXRpb24rZVtlLmxlbmd0aC0xXS1nLnJvdGF0aW9uO2Q+MTgwOylkLT0zNjA7Zm9yKDstMTgwPmQ7KWQrPTM2MDtyZXR1cm4gZy5yb3RhdGlvbis9ZCpjLHZvaWQgMH12YXIgaD1mLmJpbmFyeVNlYXJjaChlLGIsMiksaT1lW2gtMV0saj1lW2hdLGs9MS0oYi1qKS8oZVtoLTJdLWopO2ZvcihrPXRoaXMuY3VydmVzLmdldEN1cnZlUGVyY2VudChoLzItMSxrKSxkPWVbaCsxXS1pO2Q+MTgwOylkLT0zNjA7Zm9yKDstMTgwPmQ7KWQrPTM2MDtmb3IoZD1nLmRhdGEucm90YXRpb24rKGkrZCprKS1nLnJvdGF0aW9uO2Q+MTgwOylkLT0zNjA7Zm9yKDstMTgwPmQ7KWQrPTM2MDtnLnJvdGF0aW9uKz1kKmN9fX0sZi5UcmFuc2xhdGVUaW1lbGluZT1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1uZXcgZi5DdXJ2ZXMoYSksdGhpcy5mcmFtZXM9W10sdGhpcy5mcmFtZXMubGVuZ3RoPTMqYX0sZi5UcmFuc2xhdGVUaW1lbGluZS5wcm90b3R5cGU9e2JvbmVJbmRleDowLGdldEZyYW1lQ291bnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5mcmFtZXMubGVuZ3RoLzN9LHNldEZyYW1lOmZ1bmN0aW9uKGEsYixjLGQpe2EqPTMsdGhpcy5mcmFtZXNbYV09Yix0aGlzLmZyYW1lc1thKzFdPWMsdGhpcy5mcmFtZXNbYSsyXT1kfSxhcHBseTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5mcmFtZXM7aWYoIShiPGRbMF0pKXt2YXIgZT1hLmJvbmVzW3RoaXMuYm9uZUluZGV4XTtpZihiPj1kW2QubGVuZ3RoLTNdKXJldHVybiBlLngrPShlLmRhdGEueCtkW2QubGVuZ3RoLTJdLWUueCkqYyxlLnkrPShlLmRhdGEueStkW2QubGVuZ3RoLTFdLWUueSkqYyx2b2lkIDA7dmFyIGc9Zi5iaW5hcnlTZWFyY2goZCxiLDMpLGg9ZFtnLTJdLGk9ZFtnLTFdLGo9ZFtnXSxrPTEtKGItaikvKGRbZystM10taik7az10aGlzLmN1cnZlcy5nZXRDdXJ2ZVBlcmNlbnQoZy8zLTEsayksZS54Kz0oZS5kYXRhLngraCsoZFtnKzFdLWgpKmstZS54KSpjLGUueSs9KGUuZGF0YS55K2krKGRbZysyXS1pKSprLWUueSkqY319fSxmLlNjYWxlVGltZWxpbmU9ZnVuY3Rpb24oYSl7dGhpcy5jdXJ2ZXM9bmV3IGYuQ3VydmVzKGEpLHRoaXMuZnJhbWVzPVtdLHRoaXMuZnJhbWVzLmxlbmd0aD0zKmF9LGYuU2NhbGVUaW1lbGluZS5wcm90b3R5cGU9e2JvbmVJbmRleDowLGdldEZyYW1lQ291bnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5mcmFtZXMubGVuZ3RoLzN9LHNldEZyYW1lOmZ1bmN0aW9uKGEsYixjLGQpe2EqPTMsdGhpcy5mcmFtZXNbYV09Yix0aGlzLmZyYW1lc1thKzFdPWMsdGhpcy5mcmFtZXNbYSsyXT1kfSxhcHBseTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5mcmFtZXM7aWYoIShiPGRbMF0pKXt2YXIgZT1hLmJvbmVzW3RoaXMuYm9uZUluZGV4XTtpZihiPj1kW2QubGVuZ3RoLTNdKXJldHVybiBlLnNjYWxlWCs9KGUuZGF0YS5zY2FsZVgtMStkW2QubGVuZ3RoLTJdLWUuc2NhbGVYKSpjLGUuc2NhbGVZKz0oZS5kYXRhLnNjYWxlWS0xK2RbZC5sZW5ndGgtMV0tZS5zY2FsZVkpKmMsdm9pZCAwO3ZhciBnPWYuYmluYXJ5U2VhcmNoKGQsYiwzKSxoPWRbZy0yXSxpPWRbZy0xXSxqPWRbZ10saz0xLShiLWopLyhkW2crLTNdLWopO2s9dGhpcy5jdXJ2ZXMuZ2V0Q3VydmVQZXJjZW50KGcvMy0xLGspLGUuc2NhbGVYKz0oZS5kYXRhLnNjYWxlWC0xK2grKGRbZysxXS1oKSprLWUuc2NhbGVYKSpjLGUuc2NhbGVZKz0oZS5kYXRhLnNjYWxlWS0xK2krKGRbZysyXS1pKSprLWUuc2NhbGVZKSpjfX19LGYuQ29sb3JUaW1lbGluZT1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1uZXcgZi5DdXJ2ZXMoYSksdGhpcy5mcmFtZXM9W10sdGhpcy5mcmFtZXMubGVuZ3RoPTUqYX0sZi5Db2xvclRpbWVsaW5lLnByb3RvdHlwZT17c2xvdEluZGV4OjAsZ2V0RnJhbWVDb3VudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmZyYW1lcy5sZW5ndGgvNX0sc2V0RnJhbWU6ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe2EqPTUsdGhpcy5mcmFtZXNbYV09Yix0aGlzLmZyYW1lc1thKzFdPWMsdGhpcy5mcmFtZXNbYSsyXT1kLHRoaXMuZnJhbWVzW2ErM109ZSx0aGlzLmZyYW1lc1thKzRdPWZ9LGFwcGx5OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzLmZyYW1lcztpZighKGI8ZFswXSkpe3ZhciBlPWEuc2xvdHNbdGhpcy5zbG90SW5kZXhdO2lmKGI+PWRbZC5sZW5ndGgtNV0pe3ZhciBnPWQubGVuZ3RoLTE7cmV0dXJuIGUucj1kW2ctM10sZS5nPWRbZy0yXSxlLmI9ZFtnLTFdLGUuYT1kW2ddLHZvaWQgMH12YXIgaD1mLmJpbmFyeVNlYXJjaChkLGIsNSksaT1kW2gtNF0saj1kW2gtM10saz1kW2gtMl0sbD1kW2gtMV0sbT1kW2hdLG49MS0oYi1tKS8oZFtoLTVdLW0pO249dGhpcy5jdXJ2ZXMuZ2V0Q3VydmVQZXJjZW50KGgvNS0xLG4pO3ZhciBvPWkrKGRbaCsxXS1pKSpuLHA9aisoZFtoKzJdLWopKm4scT1rKyhkW2grM10taykqbixyPWwrKGRbaCs0XS1sKSpuOzE+Yz8oZS5yKz0oby1lLnIpKmMsZS5nKz0ocC1lLmcpKmMsZS5iKz0ocS1lLmIpKmMsZS5hKz0oci1lLmEpKmMpOihlLnI9byxlLmc9cCxlLmI9cSxlLmE9cil9fX0sZi5BdHRhY2htZW50VGltZWxpbmU9ZnVuY3Rpb24oYSl7dGhpcy5jdXJ2ZXM9bmV3IGYuQ3VydmVzKGEpLHRoaXMuZnJhbWVzPVtdLHRoaXMuZnJhbWVzLmxlbmd0aD1hLHRoaXMuYXR0YWNobWVudE5hbWVzPVtdLHRoaXMuYXR0YWNobWVudE5hbWVzLmxlbmd0aD1hfSxmLkF0dGFjaG1lbnRUaW1lbGluZS5wcm90b3R5cGU9e3Nsb3RJbmRleDowLGdldEZyYW1lQ291bnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5mcmFtZXMubGVuZ3RofSxzZXRGcmFtZTpmdW5jdGlvbihhLGIsYyl7dGhpcy5mcmFtZXNbYV09Yix0aGlzLmF0dGFjaG1lbnROYW1lc1thXT1jfSxhcHBseTpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuZnJhbWVzO2lmKCEoYjxjWzBdKSl7dmFyIGQ7ZD1iPj1jW2MubGVuZ3RoLTFdP2MubGVuZ3RoLTE6Zi5iaW5hcnlTZWFyY2goYyxiLDEpLTE7dmFyIGU9dGhpcy5hdHRhY2htZW50TmFtZXNbZF07YS5zbG90c1t0aGlzLnNsb3RJbmRleF0uc2V0QXR0YWNobWVudChlP2EuZ2V0QXR0YWNobWVudEJ5U2xvdEluZGV4KHRoaXMuc2xvdEluZGV4LGUpOm51bGwpfX19LGYuU2tlbGV0b25EYXRhPWZ1bmN0aW9uKCl7dGhpcy5ib25lcz1bXSx0aGlzLnNsb3RzPVtdLHRoaXMuc2tpbnM9W10sdGhpcy5hbmltYXRpb25zPVtdfSxmLlNrZWxldG9uRGF0YS5wcm90b3R5cGU9e2RlZmF1bHRTa2luOm51bGwsZmluZEJvbmU6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuYm9uZXMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGZpbmRCb25lSW5kZXg6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuYm9uZXMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIGM7cmV0dXJuLTF9LGZpbmRTbG90OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLnNsb3RzLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5uYW1lPT1hKXJldHVybiBzbG90W2NdO3JldHVybiBudWxsfSxmaW5kU2xvdEluZGV4OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLnNsb3RzLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5uYW1lPT1hKXJldHVybiBjO3JldHVybi0xfSxmaW5kU2tpbjpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5za2lucyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10ubmFtZT09YSlyZXR1cm4gYltjXTtyZXR1cm4gbnVsbH0sZmluZEFuaW1hdGlvbjpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5hbmltYXRpb25zLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5uYW1lPT1hKXJldHVybiBiW2NdO3JldHVybiBudWxsfX0sZi5Ta2VsZXRvbj1mdW5jdGlvbihhKXt0aGlzLmRhdGE9YSx0aGlzLmJvbmVzPVtdO1xuZm9yKHZhciBiPTAsYz1hLmJvbmVzLmxlbmd0aDtjPmI7YisrKXt2YXIgZD1hLmJvbmVzW2JdLGU9ZC5wYXJlbnQ/dGhpcy5ib25lc1thLmJvbmVzLmluZGV4T2YoZC5wYXJlbnQpXTpudWxsO3RoaXMuYm9uZXMucHVzaChuZXcgZi5Cb25lKGQsZSkpfWZvcih0aGlzLnNsb3RzPVtdLHRoaXMuZHJhd09yZGVyPVtdLGI9MCxjPWEuc2xvdHMubGVuZ3RoO2M+YjtiKyspe3ZhciBnPWEuc2xvdHNbYl0saD10aGlzLmJvbmVzW2EuYm9uZXMuaW5kZXhPZihnLmJvbmVEYXRhKV0saT1uZXcgZi5TbG90KGcsdGhpcyxoKTt0aGlzLnNsb3RzLnB1c2goaSksdGhpcy5kcmF3T3JkZXIucHVzaChpKX19LGYuU2tlbGV0b24ucHJvdG90eXBlPXt4OjAseTowLHNraW46bnVsbCxyOjEsZzoxLGI6MSxhOjEsdGltZTowLGZsaXBYOiExLGZsaXBZOiExLHVwZGF0ZVdvcmxkVHJhbnNmb3JtOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMuZmxpcFgsYj10aGlzLmZsaXBZLGM9dGhpcy5ib25lcyxkPTAsZT1jLmxlbmd0aDtlPmQ7ZCsrKWNbZF0udXBkYXRlV29ybGRUcmFuc2Zvcm0oYSxiKX0sc2V0VG9TZXR1cFBvc2U6ZnVuY3Rpb24oKXt0aGlzLnNldEJvbmVzVG9TZXR1cFBvc2UoKSx0aGlzLnNldFNsb3RzVG9TZXR1cFBvc2UoKX0sc2V0Qm9uZXNUb1NldHVwUG9zZTpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLmJvbmVzLGI9MCxjPWEubGVuZ3RoO2M+YjtiKyspYVtiXS5zZXRUb1NldHVwUG9zZSgpfSxzZXRTbG90c1RvU2V0dXBQb3NlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMuc2xvdHMsYj0wLGM9YS5sZW5ndGg7Yz5iO2IrKylhW2JdLnNldFRvU2V0dXBQb3NlKGIpfSxnZXRSb290Qm9uZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmJvbmVzLmxlbmd0aD90aGlzLmJvbmVzWzBdOm51bGx9LGZpbmRCb25lOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLmJvbmVzLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5kYXRhLm5hbWU9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGZpbmRCb25lSW5kZXg6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuYm9uZXMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLmRhdGEubmFtZT09YSlyZXR1cm4gYztyZXR1cm4tMX0sZmluZFNsb3Q6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuc2xvdHMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLmRhdGEubmFtZT09YSlyZXR1cm4gYltjXTtyZXR1cm4gbnVsbH0sZmluZFNsb3RJbmRleDpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5zbG90cyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10uZGF0YS5uYW1lPT1hKXJldHVybiBjO3JldHVybi0xfSxzZXRTa2luQnlOYW1lOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuZGF0YS5maW5kU2tpbihhKTtpZighYil0aHJvd1wiU2tpbiBub3QgZm91bmQ6IFwiK2E7dGhpcy5zZXRTa2luKGIpfSxzZXRTa2luOmZ1bmN0aW9uKGEpe3RoaXMuc2tpbiYmYSYmYS5fYXR0YWNoQWxsKHRoaXMsdGhpcy5za2luKSx0aGlzLnNraW49YX0sZ2V0QXR0YWNobWVudEJ5U2xvdE5hbWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5nZXRBdHRhY2htZW50QnlTbG90SW5kZXgodGhpcy5kYXRhLmZpbmRTbG90SW5kZXgoYSksYil9LGdldEF0dGFjaG1lbnRCeVNsb3RJbmRleDpmdW5jdGlvbihhLGIpe2lmKHRoaXMuc2tpbil7dmFyIGM9dGhpcy5za2luLmdldEF0dGFjaG1lbnQoYSxiKTtpZihjKXJldHVybiBjfXJldHVybiB0aGlzLmRhdGEuZGVmYXVsdFNraW4/dGhpcy5kYXRhLmRlZmF1bHRTa2luLmdldEF0dGFjaG1lbnQoYSxiKTpudWxsfSxzZXRBdHRhY2htZW50OmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPXRoaXMuc2xvdHMsZD0wLGU9Yy5zaXplO2U+ZDtkKyspe3ZhciBmPWNbZF07aWYoZi5kYXRhLm5hbWU9PWEpe3ZhciBnPW51bGw7aWYoYiYmKGc9dGhpcy5nZXRBdHRhY2htZW50KGQsYiksbnVsbD09ZykpdGhyb3dcIkF0dGFjaG1lbnQgbm90IGZvdW5kOiBcIitiK1wiLCBmb3Igc2xvdDogXCIrYTtyZXR1cm4gZi5zZXRBdHRhY2htZW50KGcpLHZvaWQgMH19dGhyb3dcIlNsb3Qgbm90IGZvdW5kOiBcIithfSx1cGRhdGU6ZnVuY3Rpb24oYSl7dGltZSs9YX19LGYuQXR0YWNobWVudFR5cGU9e3JlZ2lvbjowfSxmLlJlZ2lvbkF0dGFjaG1lbnQ9ZnVuY3Rpb24oKXt0aGlzLm9mZnNldD1bXSx0aGlzLm9mZnNldC5sZW5ndGg9OCx0aGlzLnV2cz1bXSx0aGlzLnV2cy5sZW5ndGg9OH0sZi5SZWdpb25BdHRhY2htZW50LnByb3RvdHlwZT17eDowLHk6MCxyb3RhdGlvbjowLHNjYWxlWDoxLHNjYWxlWToxLHdpZHRoOjAsaGVpZ2h0OjAscmVuZGVyZXJPYmplY3Q6bnVsbCxyZWdpb25PZmZzZXRYOjAscmVnaW9uT2Zmc2V0WTowLHJlZ2lvbldpZHRoOjAscmVnaW9uSGVpZ2h0OjAscmVnaW9uT3JpZ2luYWxXaWR0aDowLHJlZ2lvbk9yaWdpbmFsSGVpZ2h0OjAsc2V0VVZzOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGY9dGhpcy51dnM7ZT8oZlsyXT1hLGZbM109ZCxmWzRdPWEsZls1XT1iLGZbNl09YyxmWzddPWIsZlswXT1jLGZbMV09ZCk6KGZbMF09YSxmWzFdPWQsZlsyXT1hLGZbM109YixmWzRdPWMsZls1XT1iLGZbNl09YyxmWzddPWQpfSx1cGRhdGVPZmZzZXQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLndpZHRoL3RoaXMucmVnaW9uT3JpZ2luYWxXaWR0aCp0aGlzLnNjYWxlWCxiPXRoaXMuaGVpZ2h0L3RoaXMucmVnaW9uT3JpZ2luYWxIZWlnaHQqdGhpcy5zY2FsZVksYz0tdGhpcy53aWR0aC8yKnRoaXMuc2NhbGVYK3RoaXMucmVnaW9uT2Zmc2V0WCphLGQ9LXRoaXMuaGVpZ2h0LzIqdGhpcy5zY2FsZVkrdGhpcy5yZWdpb25PZmZzZXRZKmIsZT1jK3RoaXMucmVnaW9uV2lkdGgqYSxmPWQrdGhpcy5yZWdpb25IZWlnaHQqYixnPXRoaXMucm90YXRpb24qTWF0aC5QSS8xODAsaD1NYXRoLmNvcyhnKSxpPU1hdGguc2luKGcpLGo9YypoK3RoaXMueCxrPWMqaSxsPWQqaCt0aGlzLnksbT1kKmksbj1lKmgrdGhpcy54LG89ZSppLHA9ZipoK3RoaXMueSxxPWYqaSxyPXRoaXMub2Zmc2V0O3JbMF09ai1tLHJbMV09bCtrLHJbMl09ai1xLHJbM109cCtrLHJbNF09bi1xLHJbNV09cCtvLHJbNl09bi1tLHJbN109bCtvfSxjb21wdXRlVmVydGljZXM6ZnVuY3Rpb24oYSxiLGMsZCl7YSs9Yy53b3JsZFgsYis9Yy53b3JsZFk7dmFyIGU9Yy5tMDAsZj1jLm0wMSxnPWMubTEwLGg9Yy5tMTEsaT10aGlzLm9mZnNldDtkWzBdPWlbMF0qZStpWzFdKmYrYSxkWzFdPWlbMF0qZytpWzFdKmgrYixkWzJdPWlbMl0qZStpWzNdKmYrYSxkWzNdPWlbMl0qZytpWzNdKmgrYixkWzRdPWlbNF0qZStpWzVdKmYrYSxkWzVdPWlbNF0qZytpWzVdKmgrYixkWzZdPWlbNl0qZStpWzddKmYrYSxkWzddPWlbNl0qZytpWzddKmgrYn19LGYuQW5pbWF0aW9uU3RhdGVEYXRhPWZ1bmN0aW9uKGEpe3RoaXMuc2tlbGV0b25EYXRhPWEsdGhpcy5hbmltYXRpb25Ub01peFRpbWU9e319LGYuQW5pbWF0aW9uU3RhdGVEYXRhLnByb3RvdHlwZT17ZGVmYXVsdE1peDowLHNldE1peEJ5TmFtZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5za2VsZXRvbkRhdGEuZmluZEFuaW1hdGlvbihhKTtpZighZCl0aHJvd1wiQW5pbWF0aW9uIG5vdCBmb3VuZDogXCIrYTt2YXIgZT10aGlzLnNrZWxldG9uRGF0YS5maW5kQW5pbWF0aW9uKGIpO2lmKCFlKXRocm93XCJBbmltYXRpb24gbm90IGZvdW5kOiBcIitiO3RoaXMuc2V0TWl4KGQsZSxjKX0sc2V0TWl4OmZ1bmN0aW9uKGEsYixjKXt0aGlzLmFuaW1hdGlvblRvTWl4VGltZVthLm5hbWUrXCI6XCIrYi5uYW1lXT1jfSxnZXRNaXg6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmFuaW1hdGlvblRvTWl4VGltZVthLm5hbWUrXCI6XCIrYi5uYW1lXTtyZXR1cm4gYz9jOnRoaXMuZGVmYXVsdE1peH19LGYuQW5pbWF0aW9uU3RhdGU9ZnVuY3Rpb24oYSl7dGhpcy5kYXRhPWEsdGhpcy5xdWV1ZT1bXX0sZi5BbmltYXRpb25TdGF0ZS5wcm90b3R5cGU9e2FuaW1hdGlvblNwZWVkOjEsY3VycmVudDpudWxsLHByZXZpb3VzOm51bGwsY3VycmVudFRpbWU6MCxwcmV2aW91c1RpbWU6MCxjdXJyZW50TG9vcDohMSxwcmV2aW91c0xvb3A6ITEsbWl4VGltZTowLG1peER1cmF0aW9uOjAsdXBkYXRlOmZ1bmN0aW9uKGEpe2lmKHRoaXMuY3VycmVudFRpbWUrPWEqdGhpcy5hbmltYXRpb25TcGVlZCx0aGlzLnByZXZpb3VzVGltZSs9YSx0aGlzLm1peFRpbWUrPWEsdGhpcy5xdWV1ZS5sZW5ndGg+MCl7dmFyIGI9dGhpcy5xdWV1ZVswXTt0aGlzLmN1cnJlbnRUaW1lPj1iLmRlbGF5JiYodGhpcy5fc2V0QW5pbWF0aW9uKGIuYW5pbWF0aW9uLGIubG9vcCksdGhpcy5xdWV1ZS5zaGlmdCgpKX19LGFwcGx5OmZ1bmN0aW9uKGEpe2lmKHRoaXMuY3VycmVudClpZih0aGlzLnByZXZpb3VzKXt0aGlzLnByZXZpb3VzLmFwcGx5KGEsdGhpcy5wcmV2aW91c1RpbWUsdGhpcy5wcmV2aW91c0xvb3ApO3ZhciBiPXRoaXMubWl4VGltZS90aGlzLm1peER1cmF0aW9uO2I+PTEmJihiPTEsdGhpcy5wcmV2aW91cz1udWxsKSx0aGlzLmN1cnJlbnQubWl4KGEsdGhpcy5jdXJyZW50VGltZSx0aGlzLmN1cnJlbnRMb29wLGIpfWVsc2UgdGhpcy5jdXJyZW50LmFwcGx5KGEsdGhpcy5jdXJyZW50VGltZSx0aGlzLmN1cnJlbnRMb29wKX0sY2xlYXJBbmltYXRpb246ZnVuY3Rpb24oKXt0aGlzLnByZXZpb3VzPW51bGwsdGhpcy5jdXJyZW50PW51bGwsdGhpcy5xdWV1ZS5sZW5ndGg9MH0sX3NldEFuaW1hdGlvbjpmdW5jdGlvbihhLGIpe3RoaXMucHJldmlvdXM9bnVsbCxhJiZ0aGlzLmN1cnJlbnQmJih0aGlzLm1peER1cmF0aW9uPXRoaXMuZGF0YS5nZXRNaXgodGhpcy5jdXJyZW50LGEpLHRoaXMubWl4RHVyYXRpb24+MCYmKHRoaXMubWl4VGltZT0wLHRoaXMucHJldmlvdXM9dGhpcy5jdXJyZW50LHRoaXMucHJldmlvdXNUaW1lPXRoaXMuY3VycmVudFRpbWUsdGhpcy5wcmV2aW91c0xvb3A9dGhpcy5jdXJyZW50TG9vcCkpLHRoaXMuY3VycmVudD1hLHRoaXMuY3VycmVudExvb3A9Yix0aGlzLmN1cnJlbnRUaW1lPTB9LHNldEFuaW1hdGlvbkJ5TmFtZTpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuZGF0YS5za2VsZXRvbkRhdGEuZmluZEFuaW1hdGlvbihhKTtpZighYyl0aHJvd1wiQW5pbWF0aW9uIG5vdCBmb3VuZDogXCIrYTt0aGlzLnNldEFuaW1hdGlvbihjLGIpfSxzZXRBbmltYXRpb246ZnVuY3Rpb24oYSxiKXt0aGlzLnF1ZXVlLmxlbmd0aD0wLHRoaXMuX3NldEFuaW1hdGlvbihhLGIpfSxhZGRBbmltYXRpb25CeU5hbWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPXRoaXMuZGF0YS5za2VsZXRvbkRhdGEuZmluZEFuaW1hdGlvbihhKTtpZighZCl0aHJvd1wiQW5pbWF0aW9uIG5vdCBmb3VuZDogXCIrYTt0aGlzLmFkZEFuaW1hdGlvbihkLGIsYyl9LGFkZEFuaW1hdGlvbjpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9e307aWYoZC5hbmltYXRpb249YSxkLmxvb3A9YiwhY3x8MD49Yyl7dmFyIGU9dGhpcy5xdWV1ZS5sZW5ndGg/dGhpcy5xdWV1ZVt0aGlzLnF1ZXVlLmxlbmd0aC0xXS5hbmltYXRpb246dGhpcy5jdXJyZW50O2M9bnVsbCE9ZT9lLmR1cmF0aW9uLXRoaXMuZGF0YS5nZXRNaXgoZSxhKSsoY3x8MCk6MH1kLmRlbGF5PWMsdGhpcy5xdWV1ZS5wdXNoKGQpfSxpc0NvbXBsZXRlOmZ1bmN0aW9uKCl7cmV0dXJuIXRoaXMuY3VycmVudHx8dGhpcy5jdXJyZW50VGltZT49dGhpcy5jdXJyZW50LmR1cmF0aW9ufX0sZi5Ta2VsZXRvbkpzb249ZnVuY3Rpb24oYSl7dGhpcy5hdHRhY2htZW50TG9hZGVyPWF9LGYuU2tlbGV0b25Kc29uLnByb3RvdHlwZT17c2NhbGU6MSxyZWFkU2tlbGV0b25EYXRhOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjPW5ldyBmLlNrZWxldG9uRGF0YSxkPWEuYm9uZXMsZT0wLGc9ZC5sZW5ndGg7Zz5lO2UrKyl7dmFyIGg9ZFtlXSxpPW51bGw7aWYoaC5wYXJlbnQmJihpPWMuZmluZEJvbmUoaC5wYXJlbnQpLCFpKSl0aHJvd1wiUGFyZW50IGJvbmUgbm90IGZvdW5kOiBcIitoLnBhcmVudDtiPW5ldyBmLkJvbmVEYXRhKGgubmFtZSxpKSxiLmxlbmd0aD0oaC5sZW5ndGh8fDApKnRoaXMuc2NhbGUsYi54PShoLnh8fDApKnRoaXMuc2NhbGUsYi55PShoLnl8fDApKnRoaXMuc2NhbGUsYi5yb3RhdGlvbj1oLnJvdGF0aW9ufHwwLGIuc2NhbGVYPWguc2NhbGVYfHwxLGIuc2NhbGVZPWguc2NhbGVZfHwxLGMuYm9uZXMucHVzaChiKX12YXIgaj1hLnNsb3RzO2ZvcihlPTAsZz1qLmxlbmd0aDtnPmU7ZSsrKXt2YXIgaz1qW2VdO2lmKGI9Yy5maW5kQm9uZShrLmJvbmUpLCFiKXRocm93XCJTbG90IGJvbmUgbm90IGZvdW5kOiBcIitrLmJvbmU7dmFyIGw9bmV3IGYuU2xvdERhdGEoay5uYW1lLGIpLG09ay5jb2xvcjttJiYobC5yPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IobSwwKSxsLmc9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcihtLDEpLGwuYj1mLlNrZWxldG9uSnNvbi50b0NvbG9yKG0sMiksbC5hPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IobSwzKSksbC5hdHRhY2htZW50TmFtZT1rLmF0dGFjaG1lbnQsYy5zbG90cy5wdXNoKGwpfXZhciBuPWEuc2tpbnM7Zm9yKHZhciBvIGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eShvKSl7dmFyIHA9bltvXSxxPW5ldyBmLlNraW4obyk7Zm9yKHZhciByIGluIHApaWYocC5oYXNPd25Qcm9wZXJ0eShyKSl7dmFyIHM9Yy5maW5kU2xvdEluZGV4KHIpLHQ9cFtyXTtmb3IodmFyIHUgaW4gdClpZih0Lmhhc093blByb3BlcnR5KHUpKXt2YXIgdj10aGlzLnJlYWRBdHRhY2htZW50KHEsdSx0W3VdKTtudWxsIT12JiZxLmFkZEF0dGFjaG1lbnQocyx1LHYpfX1jLnNraW5zLnB1c2gocSksXCJkZWZhdWx0XCI9PXEubmFtZSYmKGMuZGVmYXVsdFNraW49cSl9dmFyIHc9YS5hbmltYXRpb25zO2Zvcih2YXIgeCBpbiB3KXcuaGFzT3duUHJvcGVydHkoeCkmJnRoaXMucmVhZEFuaW1hdGlvbih4LHdbeF0sYyk7cmV0dXJuIGN9LHJlYWRBdHRhY2htZW50OmZ1bmN0aW9uKGEsYixjKXtiPWMubmFtZXx8Yjt2YXIgZD1mLkF0dGFjaG1lbnRUeXBlW2MudHlwZXx8XCJyZWdpb25cIl07aWYoZD09Zi5BdHRhY2htZW50VHlwZS5yZWdpb24pe3ZhciBlPW5ldyBmLlJlZ2lvbkF0dGFjaG1lbnQ7cmV0dXJuIGUueD0oYy54fHwwKSp0aGlzLnNjYWxlLGUueT0oYy55fHwwKSp0aGlzLnNjYWxlLGUuc2NhbGVYPWMuc2NhbGVYfHwxLGUuc2NhbGVZPWMuc2NhbGVZfHwxLGUucm90YXRpb249Yy5yb3RhdGlvbnx8MCxlLndpZHRoPShjLndpZHRofHwzMikqdGhpcy5zY2FsZSxlLmhlaWdodD0oYy5oZWlnaHR8fDMyKSp0aGlzLnNjYWxlLGUudXBkYXRlT2Zmc2V0KCksZS5yZW5kZXJlck9iamVjdD17fSxlLnJlbmRlcmVyT2JqZWN0Lm5hbWU9YixlLnJlbmRlcmVyT2JqZWN0LnNjYWxlPXt9LGUucmVuZGVyZXJPYmplY3Quc2NhbGUueD1lLnNjYWxlWCxlLnJlbmRlcmVyT2JqZWN0LnNjYWxlLnk9ZS5zY2FsZVksZS5yZW5kZXJlck9iamVjdC5yb3RhdGlvbj0tZS5yb3RhdGlvbipNYXRoLlBJLzE4MCxlfXRocm93XCJVbmtub3duIGF0dGFjaG1lbnQgdHlwZTogXCIrZH0scmVhZEFuaW1hdGlvbjpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxnLGgsaSxqLGssbD1bXSxtPTAsbj1iLmJvbmVzO2Zvcih2YXIgbyBpbiBuKWlmKG4uaGFzT3duUHJvcGVydHkobykpe3ZhciBwPWMuZmluZEJvbmVJbmRleChvKTtpZigtMT09cCl0aHJvd1wiQm9uZSBub3QgZm91bmQ6IFwiK287dmFyIHE9bltvXTtmb3IoZyBpbiBxKWlmKHEuaGFzT3duUHJvcGVydHkoZykpaWYoaT1xW2ddLFwicm90YXRlXCI9PWcpe2ZvcihlPW5ldyBmLlJvdGF0ZVRpbWVsaW5lKGkubGVuZ3RoKSxlLmJvbmVJbmRleD1wLGQ9MCxqPTAsaz1pLmxlbmd0aDtrPmo7aisrKWg9aVtqXSxlLnNldEZyYW1lKGQsaC50aW1lLGguYW5nbGUpLGYuU2tlbGV0b25Kc29uLnJlYWRDdXJ2ZShlLGQsaCksZCsrO2wucHVzaChlKSxtPU1hdGgubWF4KG0sZS5mcmFtZXNbMiplLmdldEZyYW1lQ291bnQoKS0yXSl9ZWxzZXtpZihcInRyYW5zbGF0ZVwiIT1nJiZcInNjYWxlXCIhPWcpdGhyb3dcIkludmFsaWQgdGltZWxpbmUgdHlwZSBmb3IgYSBib25lOiBcIitnK1wiIChcIitvK1wiKVwiO3ZhciByPTE7Zm9yKFwic2NhbGVcIj09Zz9lPW5ldyBmLlNjYWxlVGltZWxpbmUoaS5sZW5ndGgpOihlPW5ldyBmLlRyYW5zbGF0ZVRpbWVsaW5lKGkubGVuZ3RoKSxyPXRoaXMuc2NhbGUpLGUuYm9uZUluZGV4PXAsZD0wLGo9MCxrPWkubGVuZ3RoO2s+ajtqKyspe2g9aVtqXTt2YXIgcz0oaC54fHwwKSpyLHQ9KGgueXx8MCkqcjtlLnNldEZyYW1lKGQsaC50aW1lLHMsdCksZi5Ta2VsZXRvbkpzb24ucmVhZEN1cnZlKGUsZCxoKSxkKyt9bC5wdXNoKGUpLG09TWF0aC5tYXgobSxlLmZyYW1lc1szKmUuZ2V0RnJhbWVDb3VudCgpLTNdKX19dmFyIHU9Yi5zbG90cztmb3IodmFyIHYgaW4gdSlpZih1Lmhhc093blByb3BlcnR5KHYpKXt2YXIgdz11W3ZdLHg9Yy5maW5kU2xvdEluZGV4KHYpO2ZvcihnIGluIHcpaWYody5oYXNPd25Qcm9wZXJ0eShnKSlpZihpPXdbZ10sXCJjb2xvclwiPT1nKXtmb3IoZT1uZXcgZi5Db2xvclRpbWVsaW5lKGkubGVuZ3RoKSxlLnNsb3RJbmRleD14LGQ9MCxqPTAsaz1pLmxlbmd0aDtrPmo7aisrKXtoPWlbal07dmFyIHk9aC5jb2xvcix6PWYuU2tlbGV0b25Kc29uLnRvQ29sb3IoeSwwKSxBPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IoeSwxKSxCPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IoeSwyKSxDPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IoeSwzKTtlLnNldEZyYW1lKGQsaC50aW1lLHosQSxCLEMpLGYuU2tlbGV0b25Kc29uLnJlYWRDdXJ2ZShlLGQsaCksZCsrfWwucHVzaChlKSxtPU1hdGgubWF4KG0sZS5mcmFtZXNbNSplLmdldEZyYW1lQ291bnQoKS01XSl9ZWxzZXtpZihcImF0dGFjaG1lbnRcIiE9Zyl0aHJvd1wiSW52YWxpZCB0aW1lbGluZSB0eXBlIGZvciBhIHNsb3Q6IFwiK2crXCIgKFwiK3YrXCIpXCI7Zm9yKGU9bmV3IGYuQXR0YWNobWVudFRpbWVsaW5lKGkubGVuZ3RoKSxlLnNsb3RJbmRleD14LGQ9MCxqPTAsaz1pLmxlbmd0aDtrPmo7aisrKWg9aVtqXSxlLnNldEZyYW1lKGQrKyxoLnRpbWUsaC5uYW1lKTtsLnB1c2goZSksbT1NYXRoLm1heChtLGUuZnJhbWVzW2UuZ2V0RnJhbWVDb3VudCgpLTFdKX19Yy5hbmltYXRpb25zLnB1c2gobmV3IGYuQW5pbWF0aW9uKGEsbCxtKSl9fSxmLlNrZWxldG9uSnNvbi5yZWFkQ3VydmU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMuY3VydmU7ZCYmKFwic3RlcHBlZFwiPT1kP2EuY3VydmVzLnNldFN0ZXBwZWQoYik6ZCBpbnN0YW5jZW9mIEFycmF5JiZhLmN1cnZlcy5zZXRDdXJ2ZShiLGRbMF0sZFsxXSxkWzJdLGRbM10pKX0sZi5Ta2VsZXRvbkpzb24udG9Db2xvcj1mdW5jdGlvbihhLGIpe2lmKDghPWEubGVuZ3RoKXRocm93XCJDb2xvciBoZXhpZGVjaW1hbCBsZW5ndGggbXVzdCBiZSA4LCByZWNpZXZlZDogXCIrYTtyZXR1cm4gcGFyc2VJbnQoYS5zdWJzdHIoMipiLDIpLDE2KS8yNTV9LGYuQXRsYXM9ZnVuY3Rpb24oYSxiKXt0aGlzLnRleHR1cmVMb2FkZXI9Yix0aGlzLnBhZ2VzPVtdLHRoaXMucmVnaW9ucz1bXTt2YXIgYz1uZXcgZi5BdGxhc1JlYWRlcihhKSxkPVtdO2QubGVuZ3RoPTQ7Zm9yKHZhciBlPW51bGw7Oyl7dmFyIGc9Yy5yZWFkTGluZSgpO2lmKG51bGw9PWcpYnJlYWs7aWYoZz1jLnRyaW0oZyksZy5sZW5ndGgpaWYoZSl7dmFyIGg9bmV3IGYuQXRsYXNSZWdpb247aC5uYW1lPWcsaC5wYWdlPWUsaC5yb3RhdGU9XCJ0cnVlXCI9PWMucmVhZFZhbHVlKCksYy5yZWFkVHVwbGUoZCk7dmFyIGk9cGFyc2VJbnQoZFswXSwxMCksaj1wYXJzZUludChkWzFdLDEwKTtjLnJlYWRUdXBsZShkKTt2YXIgaz1wYXJzZUludChkWzBdLDEwKSxsPXBhcnNlSW50KGRbMV0sMTApO2gudT1pL2Uud2lkdGgsaC52PWovZS5oZWlnaHQsaC5yb3RhdGU/KGgudTI9KGkrbCkvZS53aWR0aCxoLnYyPShqK2spL2UuaGVpZ2h0KTooaC51Mj0oaStrKS9lLndpZHRoLGgudjI9KGorbCkvZS5oZWlnaHQpLGgueD1pLGgueT1qLGgud2lkdGg9TWF0aC5hYnMoayksaC5oZWlnaHQ9TWF0aC5hYnMobCksND09Yy5yZWFkVHVwbGUoZCkmJihoLnNwbGl0cz1bcGFyc2VJbnQoZFswXSwxMCkscGFyc2VJbnQoZFsxXSwxMCkscGFyc2VJbnQoZFsyXSwxMCkscGFyc2VJbnQoZFszXSwxMCldLDQ9PWMucmVhZFR1cGxlKGQpJiYoaC5wYWRzPVtwYXJzZUludChkWzBdLDEwKSxwYXJzZUludChkWzFdLDEwKSxwYXJzZUludChkWzJdLDEwKSxwYXJzZUludChkWzNdLDEwKV0sYy5yZWFkVHVwbGUoZCkpKSxoLm9yaWdpbmFsV2lkdGg9cGFyc2VJbnQoZFswXSwxMCksaC5vcmlnaW5hbEhlaWdodD1wYXJzZUludChkWzFdLDEwKSxjLnJlYWRUdXBsZShkKSxoLm9mZnNldFg9cGFyc2VJbnQoZFswXSwxMCksaC5vZmZzZXRZPXBhcnNlSW50KGRbMV0sMTApLGguaW5kZXg9cGFyc2VJbnQoYy5yZWFkVmFsdWUoKSwxMCksdGhpcy5yZWdpb25zLnB1c2goaCl9ZWxzZXtlPW5ldyBmLkF0bGFzUGFnZSxlLm5hbWU9ZyxlLmZvcm1hdD1mLkF0bGFzLkZvcm1hdFtjLnJlYWRWYWx1ZSgpXSxjLnJlYWRUdXBsZShkKSxlLm1pbkZpbHRlcj1mLkF0bGFzLlRleHR1cmVGaWx0ZXJbZFswXV0sZS5tYWdGaWx0ZXI9Zi5BdGxhcy5UZXh0dXJlRmlsdGVyW2RbMV1dO3ZhciBtPWMucmVhZFZhbHVlKCk7ZS51V3JhcD1mLkF0bGFzLlRleHR1cmVXcmFwLmNsYW1wVG9FZGdlLGUudldyYXA9Zi5BdGxhcy5UZXh0dXJlV3JhcC5jbGFtcFRvRWRnZSxcInhcIj09bT9lLnVXcmFwPWYuQXRsYXMuVGV4dHVyZVdyYXAucmVwZWF0OlwieVwiPT1tP2UudldyYXA9Zi5BdGxhcy5UZXh0dXJlV3JhcC5yZXBlYXQ6XCJ4eVwiPT1tJiYoZS51V3JhcD1lLnZXcmFwPWYuQXRsYXMuVGV4dHVyZVdyYXAucmVwZWF0KSxiLmxvYWQoZSxnKSx0aGlzLnBhZ2VzLnB1c2goZSl9ZWxzZSBlPW51bGx9fSxmLkF0bGFzLnByb3RvdHlwZT17ZmluZFJlZ2lvbjpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5yZWdpb25zLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5uYW1lPT1hKXJldHVybiBiW2NdO3JldHVybiBudWxsfSxkaXNwb3NlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMucGFnZXMsYj0wLGM9YS5sZW5ndGg7Yz5iO2IrKyl0aGlzLnRleHR1cmVMb2FkZXIudW5sb2FkKGFbYl0ucmVuZGVyZXJPYmplY3QpfSx1cGRhdGVVVnM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMucmVnaW9ucyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKXt2YXIgZT1iW2NdO2UucGFnZT09YSYmKGUudT1lLngvYS53aWR0aCxlLnY9ZS55L2EuaGVpZ2h0LGUucm90YXRlPyhlLnUyPShlLngrZS5oZWlnaHQpL2Eud2lkdGgsZS52Mj0oZS55K2Uud2lkdGgpL2EuaGVpZ2h0KTooZS51Mj0oZS54K2Uud2lkdGgpL2Eud2lkdGgsZS52Mj0oZS55K2UuaGVpZ2h0KS9hLmhlaWdodCkpfX19LGYuQXRsYXMuRm9ybWF0PXthbHBoYTowLGludGVuc2l0eToxLGx1bWluYW5jZUFscGhhOjIscmdiNTY1OjMscmdiYTQ0NDQ6NCxyZ2I4ODg6NSxyZ2JhODg4ODo2fSxmLkF0bGFzLlRleHR1cmVGaWx0ZXI9e25lYXJlc3Q6MCxsaW5lYXI6MSxtaXBNYXA6MixtaXBNYXBOZWFyZXN0TmVhcmVzdDozLG1pcE1hcExpbmVhck5lYXJlc3Q6NCxtaXBNYXBOZWFyZXN0TGluZWFyOjUsbWlwTWFwTGluZWFyTGluZWFyOjZ9LGYuQXRsYXMuVGV4dHVyZVdyYXA9e21pcnJvcmVkUmVwZWF0OjAsY2xhbXBUb0VkZ2U6MSxyZXBlYXQ6Mn0sZi5BdGxhc1BhZ2U9ZnVuY3Rpb24oKXt9LGYuQXRsYXNQYWdlLnByb3RvdHlwZT17bmFtZTpudWxsLGZvcm1hdDpudWxsLG1pbkZpbHRlcjpudWxsLG1hZ0ZpbHRlcjpudWxsLHVXcmFwOm51bGwsdldyYXA6bnVsbCxyZW5kZXJlck9iamVjdDpudWxsLHdpZHRoOjAsaGVpZ2h0OjB9LGYuQXRsYXNSZWdpb249ZnVuY3Rpb24oKXt9LGYuQXRsYXNSZWdpb24ucHJvdG90eXBlPXtwYWdlOm51bGwsbmFtZTpudWxsLHg6MCx5OjAsd2lkdGg6MCxoZWlnaHQ6MCx1OjAsdjowLHUyOjAsdjI6MCxvZmZzZXRYOjAsb2Zmc2V0WTowLG9yaWdpbmFsV2lkdGg6MCxvcmlnaW5hbEhlaWdodDowLGluZGV4OjAscm90YXRlOiExLHNwbGl0czpudWxsLHBhZHM6bnVsbH0sZi5BdGxhc1JlYWRlcj1mdW5jdGlvbihhKXt0aGlzLmxpbmVzPWEuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyl9LGYuQXRsYXNSZWFkZXIucHJvdG90eXBlPXtpbmRleDowLHRyaW06ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKX0scmVhZExpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pbmRleD49dGhpcy5saW5lcy5sZW5ndGg/bnVsbDp0aGlzLmxpbmVzW3RoaXMuaW5kZXgrK119LHJlYWRWYWx1ZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMucmVhZExpbmUoKSxiPWEuaW5kZXhPZihcIjpcIik7aWYoLTE9PWIpdGhyb3dcIkludmFsaWQgbGluZTogXCIrYTtyZXR1cm4gdGhpcy50cmltKGEuc3Vic3RyaW5nKGIrMSkpfSxyZWFkVHVwbGU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5yZWFkTGluZSgpLGM9Yi5pbmRleE9mKFwiOlwiKTtpZigtMT09Yyl0aHJvd1wiSW52YWxpZCBsaW5lOiBcIitiO2Zvcih2YXIgZD0wLGU9YysxOzM+ZDtkKyspe3ZhciBmPWIuaW5kZXhPZihcIixcIixlKTtpZigtMT09Zil7aWYoIWQpdGhyb3dcIkludmFsaWQgbGluZTogXCIrYjticmVha31hW2RdPXRoaXMudHJpbShiLnN1YnN0cihlLGYtZSkpLGU9ZisxfXJldHVybiBhW2RdPXRoaXMudHJpbShiLnN1YnN0cmluZyhlKSksZCsxfX0sZi5BdGxhc0F0dGFjaG1lbnRMb2FkZXI9ZnVuY3Rpb24oYSl7dGhpcy5hdGxhcz1hfSxmLkF0bGFzQXR0YWNobWVudExvYWRlci5wcm90b3R5cGU9e25ld0F0dGFjaG1lbnQ6ZnVuY3Rpb24oYSxiLGMpe3N3aXRjaChiKXtjYXNlIGYuQXR0YWNobWVudFR5cGUucmVnaW9uOnZhciBkPXRoaXMuYXRsYXMuZmluZFJlZ2lvbihjKTtpZighZCl0aHJvd1wiUmVnaW9uIG5vdCBmb3VuZCBpbiBhdGxhczogXCIrYytcIiAoXCIrYitcIilcIjt2YXIgZT1uZXcgZi5SZWdpb25BdHRhY2htZW50KGMpO3JldHVybiBlLnJlbmRlcmVyT2JqZWN0PWQsZS5zZXRVVnMoZC51LGQudixkLnUyLGQudjIsZC5yb3RhdGUpLGUucmVnaW9uT2Zmc2V0WD1kLm9mZnNldFgsZS5yZWdpb25PZmZzZXRZPWQub2Zmc2V0WSxlLnJlZ2lvbldpZHRoPWQud2lkdGgsZS5yZWdpb25IZWlnaHQ9ZC5oZWlnaHQsZS5yZWdpb25PcmlnaW5hbFdpZHRoPWQub3JpZ2luYWxXaWR0aCxlLnJlZ2lvbk9yaWdpbmFsSGVpZ2h0PWQub3JpZ2luYWxIZWlnaHQsZX10aHJvd1wiVW5rbm93biBhdHRhY2htZW50IHR5cGU6IFwiK2J9fSxmLkJvbmUueURvd249ITAsYi5BbmltQ2FjaGU9e30sYi5TcGluZT1mdW5jdGlvbihhKXtpZihiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLnNwaW5lRGF0YT1iLkFuaW1DYWNoZVthXSwhdGhpcy5zcGluZURhdGEpdGhyb3cgbmV3IEVycm9yKFwiU3BpbmUgZGF0YSBtdXN0IGJlIHByZWxvYWRlZCB1c2luZyBQSVhJLlNwaW5lTG9hZGVyIG9yIFBJWEkuQXNzZXRMb2FkZXI6IFwiK2EpO3RoaXMuc2tlbGV0b249bmV3IGYuU2tlbGV0b24odGhpcy5zcGluZURhdGEpLHRoaXMuc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKSx0aGlzLnN0YXRlRGF0YT1uZXcgZi5BbmltYXRpb25TdGF0ZURhdGEodGhpcy5zcGluZURhdGEpLHRoaXMuc3RhdGU9bmV3IGYuQW5pbWF0aW9uU3RhdGUodGhpcy5zdGF0ZURhdGEpLHRoaXMuc2xvdENvbnRhaW5lcnM9W107Zm9yKHZhciBjPTAsZD10aGlzLnNrZWxldG9uLmRyYXdPcmRlci5sZW5ndGg7ZD5jO2MrKyl7dmFyIGU9dGhpcy5za2VsZXRvbi5kcmF3T3JkZXJbY10sZz1lLmF0dGFjaG1lbnQsaD1uZXcgYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyO2lmKHRoaXMuc2xvdENvbnRhaW5lcnMucHVzaChoKSx0aGlzLmFkZENoaWxkKGgpLGcgaW5zdGFuY2VvZiBmLlJlZ2lvbkF0dGFjaG1lbnQpe3ZhciBpPWcucmVuZGVyZXJPYmplY3QubmFtZSxqPXRoaXMuY3JlYXRlU3ByaXRlKGUsZy5yZW5kZXJlck9iamVjdCk7ZS5jdXJyZW50U3ByaXRlPWosZS5jdXJyZW50U3ByaXRlTmFtZT1pLGguYWRkQ2hpbGQoail9fX0sYi5TcGluZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLlNwaW5lLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlNwaW5lLGIuU3BpbmUucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMubGFzdFRpbWU9dGhpcy5sYXN0VGltZXx8RGF0ZS5ub3coKTt2YXIgYT0uMDAxKihEYXRlLm5vdygpLXRoaXMubGFzdFRpbWUpO3RoaXMubGFzdFRpbWU9RGF0ZS5ub3coKSx0aGlzLnN0YXRlLnVwZGF0ZShhKSx0aGlzLnN0YXRlLmFwcGx5KHRoaXMuc2tlbGV0b24pLHRoaXMuc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtmb3IodmFyIGM9dGhpcy5za2VsZXRvbi5kcmF3T3JkZXIsZD0wLGU9Yy5sZW5ndGg7ZT5kO2QrKyl7dmFyIGc9Y1tkXSxoPWcuYXR0YWNobWVudCxpPXRoaXMuc2xvdENvbnRhaW5lcnNbZF07aWYoaCBpbnN0YW5jZW9mIGYuUmVnaW9uQXR0YWNobWVudCl7aWYoaC5yZW5kZXJlck9iamVjdCYmKCFnLmN1cnJlbnRTcHJpdGVOYW1lfHxnLmN1cnJlbnRTcHJpdGVOYW1lIT1oLm5hbWUpKXt2YXIgaj1oLnJlbmRlcmVyT2JqZWN0Lm5hbWU7aWYodm9pZCAwIT09Zy5jdXJyZW50U3ByaXRlJiYoZy5jdXJyZW50U3ByaXRlLnZpc2libGU9ITEpLGcuc3ByaXRlcz1nLnNwcml0ZXN8fHt9LHZvaWQgMCE9PWcuc3ByaXRlc1tqXSlnLnNwcml0ZXNbal0udmlzaWJsZT0hMDtlbHNle3ZhciBrPXRoaXMuY3JlYXRlU3ByaXRlKGcsaC5yZW5kZXJlck9iamVjdCk7aS5hZGRDaGlsZChrKX1nLmN1cnJlbnRTcHJpdGU9Zy5zcHJpdGVzW2pdLGcuY3VycmVudFNwcml0ZU5hbWU9an1pLnZpc2libGU9ITA7dmFyIGw9Zy5ib25lO2kucG9zaXRpb24ueD1sLndvcmxkWCtoLngqbC5tMDAraC55KmwubTAxLGkucG9zaXRpb24ueT1sLndvcmxkWStoLngqbC5tMTAraC55KmwubTExLGkuc2NhbGUueD1sLndvcmxkU2NhbGVYLGkuc2NhbGUueT1sLndvcmxkU2NhbGVZLGkucm90YXRpb249LShnLmJvbmUud29ybGRSb3RhdGlvbipNYXRoLlBJLzE4MCksaS5hbHBoYT1nLmEsZy5jdXJyZW50U3ByaXRlLnRpbnQ9Yi5yZ2IyaGV4KFtnLnIsZy5nLGcuYl0pfWVsc2UgaS52aXNpYmxlPSExfWIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtLmNhbGwodGhpcyl9LGIuU3BpbmUucHJvdG90eXBlLmNyZWF0ZVNwcml0ZT1mdW5jdGlvbihhLGMpe3ZhciBkPWIuVGV4dHVyZUNhY2hlW2MubmFtZV0/Yy5uYW1lOmMubmFtZStcIi5wbmdcIixlPW5ldyBiLlNwcml0ZShiLlRleHR1cmUuZnJvbUZyYW1lKGQpKTtyZXR1cm4gZS5zY2FsZT1jLnNjYWxlLGUucm90YXRpb249Yy5yb3RhdGlvbixlLmFuY2hvci54PWUuYW5jaG9yLnk9LjUsYS5zcHJpdGVzPWEuc3ByaXRlc3x8e30sYS5zcHJpdGVzW2MubmFtZV09ZSxlfSxiLkJhc2VUZXh0dXJlQ2FjaGU9e30sYi50ZXh0dXJlc1RvVXBkYXRlPVtdLGIudGV4dHVyZXNUb0Rlc3Ryb3k9W10sYi5CYXNlVGV4dHVyZUNhY2hlSWRHZW5lcmF0b3I9MCxiLkJhc2VUZXh0dXJlPWZ1bmN0aW9uKGEsYyl7aWYoYi5FdmVudFRhcmdldC5jYWxsKHRoaXMpLHRoaXMud2lkdGg9MTAwLHRoaXMuaGVpZ2h0PTEwMCx0aGlzLnNjYWxlTW9kZT1jfHxiLnNjYWxlTW9kZXMuREVGQVVMVCx0aGlzLmhhc0xvYWRlZD0hMSx0aGlzLnNvdXJjZT1hLHRoaXMuaWQ9Yi5CYXNlVGV4dHVyZUNhY2hlSWRHZW5lcmF0b3IrKyx0aGlzLnByZW11bHRpcGxpZWRBbHBoYT0hMCx0aGlzLl9nbFRleHR1cmVzPVtdLHRoaXMuX2RpcnR5PVtdLGEpe2lmKCh0aGlzLnNvdXJjZS5jb21wbGV0ZXx8dGhpcy5zb3VyY2UuZ2V0Q29udGV4dCkmJnRoaXMuc291cmNlLndpZHRoJiZ0aGlzLnNvdXJjZS5oZWlnaHQpdGhpcy5oYXNMb2FkZWQ9ITAsdGhpcy53aWR0aD10aGlzLnNvdXJjZS53aWR0aCx0aGlzLmhlaWdodD10aGlzLnNvdXJjZS5oZWlnaHQsYi50ZXh0dXJlc1RvVXBkYXRlLnB1c2godGhpcyk7ZWxzZXt2YXIgZD10aGlzO3RoaXMuc291cmNlLm9ubG9hZD1mdW5jdGlvbigpe2QuaGFzTG9hZGVkPSEwLGQud2lkdGg9ZC5zb3VyY2Uud2lkdGgsZC5oZWlnaHQ9ZC5zb3VyY2UuaGVpZ2h0O2Zvcih2YXIgYT0wO2E8ZC5fZ2xUZXh0dXJlcy5sZW5ndGg7YSsrKWQuX2RpcnR5W2FdPSEwO2QuZGlzcGF0Y2hFdmVudCh7dHlwZTpcImxvYWRlZFwiLGNvbnRlbnQ6ZH0pfSx0aGlzLnNvdXJjZS5vbmVycm9yPWZ1bmN0aW9uKCl7ZC5kaXNwYXRjaEV2ZW50KHt0eXBlOlwiZXJyb3JcIixjb250ZW50OmR9KX19dGhpcy5pbWFnZVVybD1udWxsLHRoaXMuX3Bvd2VyT2YyPSExfX0sYi5CYXNlVGV4dHVyZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5CYXNlVGV4dHVyZSxiLkJhc2VUZXh0dXJlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5pbWFnZVVybD8oZGVsZXRlIGIuQmFzZVRleHR1cmVDYWNoZVt0aGlzLmltYWdlVXJsXSxkZWxldGUgYi5UZXh0dXJlQ2FjaGVbdGhpcy5pbWFnZVVybF0sdGhpcy5pbWFnZVVybD1udWxsLHRoaXMuc291cmNlLnNyYz1udWxsKTp0aGlzLnNvdXJjZSYmdGhpcy5zb3VyY2UuX3BpeGlJZCYmZGVsZXRlIGIuQmFzZVRleHR1cmVDYWNoZVt0aGlzLnNvdXJjZS5fcGl4aUlkXSx0aGlzLnNvdXJjZT1udWxsLGIudGV4dHVyZXNUb0Rlc3Ryb3kucHVzaCh0aGlzKX0sYi5CYXNlVGV4dHVyZS5wcm90b3R5cGUudXBkYXRlU291cmNlSW1hZ2U9ZnVuY3Rpb24oYSl7dGhpcy5oYXNMb2FkZWQ9ITEsdGhpcy5zb3VyY2Uuc3JjPW51bGwsdGhpcy5zb3VyY2Uuc3JjPWF9LGIuQmFzZVRleHR1cmUuZnJvbUltYWdlPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT1iLkJhc2VUZXh0dXJlQ2FjaGVbYV07aWYodm9pZCAwPT09YyYmLTE9PT1hLmluZGV4T2YoXCJkYXRhOlwiKSYmKGM9ITApLCFlKXt2YXIgZj1uZXcgSW1hZ2U7YyYmKGYuY3Jvc3NPcmlnaW49XCJcIiksZi5zcmM9YSxlPW5ldyBiLkJhc2VUZXh0dXJlKGYsZCksZS5pbWFnZVVybD1hLGIuQmFzZVRleHR1cmVDYWNoZVthXT1lfXJldHVybiBlfSxiLkJhc2VUZXh0dXJlLmZyb21DYW52YXM9ZnVuY3Rpb24oYSxjKXthLl9waXhpSWR8fChhLl9waXhpSWQ9XCJjYW52YXNfXCIrYi5UZXh0dXJlQ2FjaGVJZEdlbmVyYXRvcisrKTt2YXIgZD1iLkJhc2VUZXh0dXJlQ2FjaGVbYS5fcGl4aUlkXTtyZXR1cm4gZHx8KGQ9bmV3IGIuQmFzZVRleHR1cmUoYSxjKSxiLkJhc2VUZXh0dXJlQ2FjaGVbYS5fcGl4aUlkXT1kKSxkfSxiLlRleHR1cmVDYWNoZT17fSxiLkZyYW1lQ2FjaGU9e30sYi5UZXh0dXJlQ2FjaGVJZEdlbmVyYXRvcj0wLGIuVGV4dHVyZT1mdW5jdGlvbihhLGMpe2lmKGIuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLm5vRnJhbWU9ITEsY3x8KHRoaXMubm9GcmFtZT0hMCxjPW5ldyBiLlJlY3RhbmdsZSgwLDAsMSwxKSksYSBpbnN0YW5jZW9mIGIuVGV4dHVyZSYmKGE9YS5iYXNlVGV4dHVyZSksdGhpcy5iYXNlVGV4dHVyZT1hLHRoaXMuZnJhbWU9Yyx0aGlzLnRyaW09bnVsbCx0aGlzLnZhbGlkPSExLHRoaXMuc2NvcGU9dGhpcyx0aGlzLl91dnM9bnVsbCx0aGlzLndpZHRoPTAsdGhpcy5oZWlnaHQ9MCx0aGlzLmNyb3A9bmV3IGIuUmVjdGFuZ2xlKDAsMCwxLDEpLGEuaGFzTG9hZGVkKXRoaXMubm9GcmFtZSYmKGM9bmV3IGIuUmVjdGFuZ2xlKDAsMCxhLndpZHRoLGEuaGVpZ2h0KSksdGhpcy5zZXRGcmFtZShjKTtlbHNle3ZhciBkPXRoaXM7YS5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsZnVuY3Rpb24oKXtkLm9uQmFzZVRleHR1cmVMb2FkZWQoKX0pfX0sYi5UZXh0dXJlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlRleHR1cmUsYi5UZXh0dXJlLnByb3RvdHlwZS5vbkJhc2VUZXh0dXJlTG9hZGVkPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5iYXNlVGV4dHVyZTthLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIix0aGlzLm9uTG9hZGVkKSx0aGlzLm5vRnJhbWUmJih0aGlzLmZyYW1lPW5ldyBiLlJlY3RhbmdsZSgwLDAsYS53aWR0aCxhLmhlaWdodCkpLHRoaXMuc2V0RnJhbWUodGhpcy5mcmFtZSksdGhpcy5zY29wZS5kaXNwYXRjaEV2ZW50KHt0eXBlOlwidXBkYXRlXCIsY29udGVudDp0aGlzfSl9LGIuVGV4dHVyZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbihhKXthJiZ0aGlzLmJhc2VUZXh0dXJlLmRlc3Ryb3koKSx0aGlzLnZhbGlkPSExfSxiLlRleHR1cmUucHJvdG90eXBlLnNldEZyYW1lPWZ1bmN0aW9uKGEpe2lmKHRoaXMubm9GcmFtZT0hMSx0aGlzLmZyYW1lPWEsdGhpcy53aWR0aD1hLndpZHRoLHRoaXMuaGVpZ2h0PWEuaGVpZ2h0LHRoaXMuY3JvcC54PWEueCx0aGlzLmNyb3AueT1hLnksdGhpcy5jcm9wLndpZHRoPWEud2lkdGgsdGhpcy5jcm9wLmhlaWdodD1hLmhlaWdodCwhdGhpcy50cmltJiYoYS54K2Eud2lkdGg+dGhpcy5iYXNlVGV4dHVyZS53aWR0aHx8YS55K2EuaGVpZ2h0PnRoaXMuYmFzZVRleHR1cmUuaGVpZ2h0KSl0aHJvdyBuZXcgRXJyb3IoXCJUZXh0dXJlIEVycm9yOiBmcmFtZSBkb2VzIG5vdCBmaXQgaW5zaWRlIHRoZSBiYXNlIFRleHR1cmUgZGltZW5zaW9ucyBcIit0aGlzKTt0aGlzLnZhbGlkPWEmJmEud2lkdGgmJmEuaGVpZ2h0JiZ0aGlzLmJhc2VUZXh0dXJlLnNvdXJjZSYmdGhpcy5iYXNlVGV4dHVyZS5oYXNMb2FkZWQsdGhpcy50cmltJiYodGhpcy53aWR0aD10aGlzLnRyaW0ud2lkdGgsdGhpcy5oZWlnaHQ9dGhpcy50cmltLmhlaWdodCx0aGlzLmZyYW1lLndpZHRoPXRoaXMudHJpbS53aWR0aCx0aGlzLmZyYW1lLmhlaWdodD10aGlzLnRyaW0uaGVpZ2h0KSx0aGlzLnZhbGlkJiZiLlRleHR1cmUuZnJhbWVVcGRhdGVzLnB1c2godGhpcyl9LGIuVGV4dHVyZS5wcm90b3R5cGUuX3VwZGF0ZVdlYkdMdXZzPWZ1bmN0aW9uKCl7dGhpcy5fdXZzfHwodGhpcy5fdXZzPW5ldyBiLlRleHR1cmVVdnMpO3ZhciBhPXRoaXMuY3JvcCxjPXRoaXMuYmFzZVRleHR1cmUud2lkdGgsZD10aGlzLmJhc2VUZXh0dXJlLmhlaWdodDt0aGlzLl91dnMueDA9YS54L2MsdGhpcy5fdXZzLnkwPWEueS9kLHRoaXMuX3V2cy54MT0oYS54K2Eud2lkdGgpL2MsdGhpcy5fdXZzLnkxPWEueS9kLHRoaXMuX3V2cy54Mj0oYS54K2Eud2lkdGgpL2MsdGhpcy5fdXZzLnkyPShhLnkrYS5oZWlnaHQpL2QsdGhpcy5fdXZzLngzPWEueC9jLHRoaXMuX3V2cy55Mz0oYS55K2EuaGVpZ2h0KS9kfSxiLlRleHR1cmUuZnJvbUltYWdlPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT1iLlRleHR1cmVDYWNoZVthXTtyZXR1cm4gZXx8KGU9bmV3IGIuVGV4dHVyZShiLkJhc2VUZXh0dXJlLmZyb21JbWFnZShhLGMsZCkpLGIuVGV4dHVyZUNhY2hlW2FdPWUpLGV9LGIuVGV4dHVyZS5mcm9tRnJhbWU9ZnVuY3Rpb24oYSl7dmFyIGM9Yi5UZXh0dXJlQ2FjaGVbYV07aWYoIWMpdGhyb3cgbmV3IEVycm9yKCdUaGUgZnJhbWVJZCBcIicrYSsnXCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHRleHR1cmUgY2FjaGUgJyk7cmV0dXJuIGN9LGIuVGV4dHVyZS5mcm9tQ2FudmFzPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9Yi5CYXNlVGV4dHVyZS5mcm9tQ2FudmFzKGEsYyk7cmV0dXJuIG5ldyBiLlRleHR1cmUoZCl9LGIuVGV4dHVyZS5hZGRUZXh0dXJlVG9DYWNoZT1mdW5jdGlvbihhLGMpe2IuVGV4dHVyZUNhY2hlW2NdPWF9LGIuVGV4dHVyZS5yZW1vdmVUZXh0dXJlRnJvbUNhY2hlPWZ1bmN0aW9uKGEpe3ZhciBjPWIuVGV4dHVyZUNhY2hlW2FdO3JldHVybiBkZWxldGUgYi5UZXh0dXJlQ2FjaGVbYV0sZGVsZXRlIGIuQmFzZVRleHR1cmVDYWNoZVthXSxjfSxiLlRleHR1cmUuZnJhbWVVcGRhdGVzPVtdLGIuVGV4dHVyZVV2cz1mdW5jdGlvbigpe3RoaXMueDA9MCx0aGlzLnkwPTAsdGhpcy54MT0wLHRoaXMueTE9MCx0aGlzLngyPTAsdGhpcy55Mj0wLHRoaXMueDM9MCx0aGlzLnkzPTB9LGIuUmVuZGVyVGV4dHVyZT1mdW5jdGlvbihhLGMsZCxlKXtpZihiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy53aWR0aD1hfHwxMDAsdGhpcy5oZWlnaHQ9Y3x8MTAwLHRoaXMuZnJhbWU9bmV3IGIuUmVjdGFuZ2xlKDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSx0aGlzLmNyb3A9bmV3IGIuUmVjdGFuZ2xlKDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSx0aGlzLmJhc2VUZXh0dXJlPW5ldyBiLkJhc2VUZXh0dXJlLHRoaXMuYmFzZVRleHR1cmUud2lkdGg9dGhpcy53aWR0aCx0aGlzLmJhc2VUZXh0dXJlLmhlaWdodD10aGlzLmhlaWdodCx0aGlzLmJhc2VUZXh0dXJlLl9nbFRleHR1cmVzPVtdLHRoaXMuYmFzZVRleHR1cmUuc2NhbGVNb2RlPWV8fGIuc2NhbGVNb2Rlcy5ERUZBVUxULHRoaXMuYmFzZVRleHR1cmUuaGFzTG9hZGVkPSEwLHRoaXMucmVuZGVyZXI9ZHx8Yi5kZWZhdWx0UmVuZGVyZXIsdGhpcy5yZW5kZXJlci50eXBlPT09Yi5XRUJHTF9SRU5ERVJFUil7dmFyIGY9dGhpcy5yZW5kZXJlci5nbDt0aGlzLnRleHR1cmVCdWZmZXI9bmV3IGIuRmlsdGVyVGV4dHVyZShmLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQsdGhpcy5iYXNlVGV4dHVyZS5zY2FsZU1vZGUpLHRoaXMuYmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbZi5pZF09dGhpcy50ZXh0dXJlQnVmZmVyLnRleHR1cmUsdGhpcy5yZW5kZXI9dGhpcy5yZW5kZXJXZWJHTCx0aGlzLnByb2plY3Rpb249bmV3IGIuUG9pbnQodGhpcy53aWR0aC8yLC10aGlzLmhlaWdodC8yKX1lbHNlIHRoaXMucmVuZGVyPXRoaXMucmVuZGVyQ2FudmFzLHRoaXMudGV4dHVyZUJ1ZmZlcj1uZXcgYi5DYW52YXNCdWZmZXIodGhpcy53aWR0aCx0aGlzLmhlaWdodCksdGhpcy5iYXNlVGV4dHVyZS5zb3VyY2U9dGhpcy50ZXh0dXJlQnVmZmVyLmNhbnZhczt0aGlzLnZhbGlkPSEwLGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXMucHVzaCh0aGlzKX0sYi5SZW5kZXJUZXh0dXJlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuVGV4dHVyZS5wcm90b3R5cGUpLGIuUmVuZGVyVGV4dHVyZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5SZW5kZXJUZXh0dXJlLGIuUmVuZGVyVGV4dHVyZS5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKGEsYyxkKXsoYSE9PXRoaXMud2lkdGh8fGMhPT10aGlzLmhlaWdodCkmJih0aGlzLndpZHRoPXRoaXMuZnJhbWUud2lkdGg9dGhpcy5jcm9wLndpZHRoPWEsdGhpcy5oZWlnaHQ9dGhpcy5mcmFtZS5oZWlnaHQ9dGhpcy5jcm9wLmhlaWdodD1jLGQmJih0aGlzLmJhc2VUZXh0dXJlLndpZHRoPXRoaXMud2lkdGgsdGhpcy5iYXNlVGV4dHVyZS5oZWlnaHQ9dGhpcy5oZWlnaHQpLHRoaXMucmVuZGVyZXIudHlwZT09PWIuV0VCR0xfUkVOREVSRVImJih0aGlzLnByb2plY3Rpb24ueD10aGlzLndpZHRoLzIsdGhpcy5wcm9qZWN0aW9uLnk9LXRoaXMuaGVpZ2h0LzIpLHRoaXMudGV4dHVyZUJ1ZmZlci5yZXNpemUodGhpcy53aWR0aCx0aGlzLmhlaWdodCkpfSxiLlJlbmRlclRleHR1cmUucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5yZW5kZXJlci50eXBlPT09Yi5XRUJHTF9SRU5ERVJFUiYmdGhpcy5yZW5kZXJlci5nbC5iaW5kRnJhbWVidWZmZXIodGhpcy5yZW5kZXJlci5nbC5GUkFNRUJVRkZFUix0aGlzLnRleHR1cmVCdWZmZXIuZnJhbWVCdWZmZXIpLHRoaXMudGV4dHVyZUJ1ZmZlci5jbGVhcigpfSxiLlJlbmRlclRleHR1cmUucHJvdG90eXBlLnJlbmRlcldlYkdMPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT10aGlzLnJlbmRlcmVyLmdsO2UuY29sb3JNYXNrKCEwLCEwLCEwLCEwKSxlLnZpZXdwb3J0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSxlLmJpbmRGcmFtZWJ1ZmZlcihlLkZSQU1FQlVGRkVSLHRoaXMudGV4dHVyZUJ1ZmZlci5mcmFtZUJ1ZmZlciksZCYmdGhpcy50ZXh0dXJlQnVmZmVyLmNsZWFyKCk7dmFyIGY9YS5jaGlsZHJlbixnPWEud29ybGRUcmFuc2Zvcm07YS53b3JsZFRyYW5zZm9ybT1iLlJlbmRlclRleHR1cmUudGVtcE1hdHJpeCxhLndvcmxkVHJhbnNmb3JtLmQ9LTEsYS53b3JsZFRyYW5zZm9ybS50eT0tMip0aGlzLnByb2plY3Rpb24ueSxjJiYoYS53b3JsZFRyYW5zZm9ybS50eD1jLngsYS53b3JsZFRyYW5zZm9ybS50eS09Yy55KTtmb3IodmFyIGg9MCxpPWYubGVuZ3RoO2k+aDtoKyspZltoXS51cGRhdGVUcmFuc2Zvcm0oKTtiLldlYkdMUmVuZGVyZXIudXBkYXRlVGV4dHVyZXMoKSx0aGlzLnJlbmRlcmVyLnNwcml0ZUJhdGNoLmRpcnR5PSEwLHRoaXMucmVuZGVyZXIucmVuZGVyRGlzcGxheU9iamVjdChhLHRoaXMucHJvamVjdGlvbix0aGlzLnRleHR1cmVCdWZmZXIuZnJhbWVCdWZmZXIpLGEud29ybGRUcmFuc2Zvcm09Zyx0aGlzLnJlbmRlcmVyLnNwcml0ZUJhdGNoLmRpcnR5PSEwfSxiLlJlbmRlclRleHR1cmUucHJvdG90eXBlLnJlbmRlckNhbnZhcz1mdW5jdGlvbihhLGMsZCl7dmFyIGU9YS5jaGlsZHJlbixmPWEud29ybGRUcmFuc2Zvcm07YS53b3JsZFRyYW5zZm9ybT1iLlJlbmRlclRleHR1cmUudGVtcE1hdHJpeCxjPyhhLndvcmxkVHJhbnNmb3JtLnR4PWMueCxhLndvcmxkVHJhbnNmb3JtLnR5PWMueSk6KGEud29ybGRUcmFuc2Zvcm0udHg9MCxhLndvcmxkVHJhbnNmb3JtLnR5PTApO2Zvcih2YXIgZz0wLGg9ZS5sZW5ndGg7aD5nO2crKyllW2ddLnVwZGF0ZVRyYW5zZm9ybSgpO2QmJnRoaXMudGV4dHVyZUJ1ZmZlci5jbGVhcigpO3ZhciBpPXRoaXMudGV4dHVyZUJ1ZmZlci5jb250ZXh0O3RoaXMucmVuZGVyZXIucmVuZGVyRGlzcGxheU9iamVjdChhLGkpLGkuc2V0VHJhbnNmb3JtKDEsMCwwLDEsMCwwKSxhLndvcmxkVHJhbnNmb3JtPWZ9LGIuUmVuZGVyVGV4dHVyZS50ZW1wTWF0cml4PW5ldyBiLk1hdHJpeCxiLkFzc2V0TG9hZGVyPWZ1bmN0aW9uKGEsYyl7Yi5FdmVudFRhcmdldC5jYWxsKHRoaXMpLHRoaXMuYXNzZXRVUkxzPWEsdGhpcy5jcm9zc29yaWdpbj1jLHRoaXMubG9hZGVyc0J5VHlwZT17anBnOmIuSW1hZ2VMb2FkZXIsanBlZzpiLkltYWdlTG9hZGVyLHBuZzpiLkltYWdlTG9hZGVyLGdpZjpiLkltYWdlTG9hZGVyLHdlYnA6Yi5JbWFnZUxvYWRlcixqc29uOmIuSnNvbkxvYWRlcixhdGxhczpiLkF0bGFzTG9hZGVyLGFuaW06Yi5TcGluZUxvYWRlcix4bWw6Yi5CaXRtYXBGb250TG9hZGVyLGZudDpiLkJpdG1hcEZvbnRMb2FkZXJ9fSxiLkFzc2V0TG9hZGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkFzc2V0TG9hZGVyLGIuQXNzZXRMb2FkZXIucHJvdG90eXBlLl9nZXREYXRhVHlwZT1mdW5jdGlvbihhKXt2YXIgYj1cImRhdGE6XCIsYz1hLnNsaWNlKDAsYi5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7aWYoYz09PWIpe3ZhciBkPWEuc2xpY2UoYi5sZW5ndGgpLGU9ZC5pbmRleE9mKFwiLFwiKTtpZigtMT09PWUpcmV0dXJuIG51bGw7dmFyIGY9ZC5zbGljZSgwLGUpLnNwbGl0KFwiO1wiKVswXTtyZXR1cm4gZiYmXCJ0ZXh0L3BsYWluXCIhPT1mLnRvTG93ZXJDYXNlKCk/Zi5zcGxpdChcIi9cIikucG9wKCkudG9Mb3dlckNhc2UoKTpcInR4dFwifXJldHVybiBudWxsfSxiLkFzc2V0TG9hZGVyLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhKXtiLm9uQXNzZXRMb2FkZWQoYS5jb250ZW50KX12YXIgYj10aGlzO3RoaXMubG9hZENvdW50PXRoaXMuYXNzZXRVUkxzLmxlbmd0aDtmb3IodmFyIGM9MDtjPHRoaXMuYXNzZXRVUkxzLmxlbmd0aDtjKyspe3ZhciBkPXRoaXMuYXNzZXRVUkxzW2NdLGU9dGhpcy5fZ2V0RGF0YVR5cGUoZCk7ZXx8KGU9ZC5zcGxpdChcIj9cIikuc2hpZnQoKS5zcGxpdChcIi5cIikucG9wKCkudG9Mb3dlckNhc2UoKSk7dmFyIGY9dGhpcy5sb2FkZXJzQnlUeXBlW2VdO2lmKCFmKXRocm93IG5ldyBFcnJvcihlK1wiIGlzIGFuIHVuc3VwcG9ydGVkIGZpbGUgdHlwZVwiKTt2YXIgZz1uZXcgZihkLHRoaXMuY3Jvc3NvcmlnaW4pO2cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLGEpLGcubG9hZCgpfX0sYi5Bc3NldExvYWRlci5wcm90b3R5cGUub25Bc3NldExvYWRlZD1mdW5jdGlvbihhKXt0aGlzLmxvYWRDb3VudC0tLHRoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcIm9uUHJvZ3Jlc3NcIixjb250ZW50OnRoaXMsbG9hZGVyOmF9KSx0aGlzLm9uUHJvZ3Jlc3MmJnRoaXMub25Qcm9ncmVzcyhhKSx0aGlzLmxvYWRDb3VudHx8KHRoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcIm9uQ29tcGxldGVcIixjb250ZW50OnRoaXN9KSx0aGlzLm9uQ29tcGxldGUmJnRoaXMub25Db21wbGV0ZSgpKX0sYi5Kc29uTG9hZGVyPWZ1bmN0aW9uKGEsYyl7Yi5FdmVudFRhcmdldC5jYWxsKHRoaXMpLHRoaXMudXJsPWEsdGhpcy5jcm9zc29yaWdpbj1jLHRoaXMuYmFzZVVybD1hLnJlcGxhY2UoL1teXFwvXSokLyxcIlwiKSx0aGlzLmxvYWRlZD0hMX0sYi5Kc29uTG9hZGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkpzb25Mb2FkZXIsYi5Kc29uTG9hZGVyLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczt3aW5kb3cuWERvbWFpblJlcXVlc3QmJmEuY3Jvc3NvcmlnaW4/KHRoaXMuYWpheFJlcXVlc3Q9bmV3IHdpbmRvdy5YRG9tYWluUmVxdWVzdCx0aGlzLmFqYXhSZXF1ZXN0LnRpbWVvdXQ9M2UzLHRoaXMuYWpheFJlcXVlc3Qub25lcnJvcj1mdW5jdGlvbigpe2Eub25FcnJvcigpfSx0aGlzLmFqYXhSZXF1ZXN0Lm9udGltZW91dD1mdW5jdGlvbigpe2Eub25FcnJvcigpfSx0aGlzLmFqYXhSZXF1ZXN0Lm9ucHJvZ3Jlc3M9ZnVuY3Rpb24oKXt9KTp0aGlzLmFqYXhSZXF1ZXN0PXdpbmRvdy5YTUxIdHRwUmVxdWVzdD9uZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0Om5ldyB3aW5kb3cuQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpLHRoaXMuYWpheFJlcXVlc3Qub25sb2FkPWZ1bmN0aW9uKCl7YS5vbkpTT05Mb2FkZWQoKX0sdGhpcy5hamF4UmVxdWVzdC5vcGVuKFwiR0VUXCIsdGhpcy51cmwsITApLHRoaXMuYWpheFJlcXVlc3Quc2VuZCgpfSxiLkpzb25Mb2FkZXIucHJvdG90eXBlLm9uSlNPTkxvYWRlZD1mdW5jdGlvbigpe2lmKCF0aGlzLmFqYXhSZXF1ZXN0LnJlc3BvbnNlVGV4dClyZXR1cm4gdGhpcy5vbkVycm9yKCksdm9pZCAwO2lmKHRoaXMuanNvbj1KU09OLnBhcnNlKHRoaXMuYWpheFJlcXVlc3QucmVzcG9uc2VUZXh0KSx0aGlzLmpzb24uZnJhbWVzKXt2YXIgYT10aGlzLGM9dGhpcy5iYXNlVXJsK3RoaXMuanNvbi5tZXRhLmltYWdlLGQ9bmV3IGIuSW1hZ2VMb2FkZXIoYyx0aGlzLmNyb3Nzb3JpZ2luKSxlPXRoaXMuanNvbi5mcmFtZXM7dGhpcy50ZXh0dXJlPWQudGV4dHVyZS5iYXNlVGV4dHVyZSxkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbigpe2Eub25Mb2FkZWQoKX0pO2Zvcih2YXIgZyBpbiBlKXt2YXIgaD1lW2ddLmZyYW1lO2lmKGgmJihiLlRleHR1cmVDYWNoZVtnXT1uZXcgYi5UZXh0dXJlKHRoaXMudGV4dHVyZSx7eDpoLngseTpoLnksd2lkdGg6aC53LGhlaWdodDpoLmh9KSxiLlRleHR1cmVDYWNoZVtnXS5jcm9wPW5ldyBiLlJlY3RhbmdsZShoLngsaC55LGgudyxoLmgpLGVbZ10udHJpbW1lZCkpe3ZhciBpPWVbZ10uc291cmNlU2l6ZSxqPWVbZ10uc3ByaXRlU291cmNlU2l6ZTtiLlRleHR1cmVDYWNoZVtnXS50cmltPW5ldyBiLlJlY3RhbmdsZShqLngsai55LGkudyxpLmgpfX1kLmxvYWQoKX1lbHNlIGlmKHRoaXMuanNvbi5ib25lcyl7dmFyIGs9bmV3IGYuU2tlbGV0b25Kc29uLGw9ay5yZWFkU2tlbGV0b25EYXRhKHRoaXMuanNvbik7Yi5BbmltQ2FjaGVbdGhpcy51cmxdPWwsdGhpcy5vbkxvYWRlZCgpfWVsc2UgdGhpcy5vbkxvYWRlZCgpfSxiLkpzb25Mb2FkZXIucHJvdG90eXBlLm9uTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy5sb2FkZWQ9ITAsdGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDp0aGlzfSl9LGIuSnNvbkxvYWRlci5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbigpe3RoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcImVycm9yXCIsY29udGVudDp0aGlzfSl9LGIuQXRsYXNMb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy51cmw9YSx0aGlzLmJhc2VVcmw9YS5yZXBsYWNlKC9bXlxcL10qJC8sXCJcIiksdGhpcy5jcm9zc29yaWdpbj1jLHRoaXMubG9hZGVkPSExfSxiLkF0bGFzTG9hZGVyLmNvbnN0cnVjdG9yPWIuQXRsYXNMb2FkZXIsYi5BdGxhc0xvYWRlci5wcm90b3R5cGUubG9hZD1mdW5jdGlvbigpe3RoaXMuYWpheFJlcXVlc3Q9bmV3IGIuQWpheFJlcXVlc3QsdGhpcy5hamF4UmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U9dGhpcy5vbkF0bGFzTG9hZGVkLmJpbmQodGhpcyksdGhpcy5hamF4UmVxdWVzdC5vcGVuKFwiR0VUXCIsdGhpcy51cmwsITApLHRoaXMuYWpheFJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZSYmdGhpcy5hamF4UmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKSx0aGlzLmFqYXhSZXF1ZXN0LnNlbmQobnVsbCl9LGIuQXRsYXNMb2FkZXIucHJvdG90eXBlLm9uQXRsYXNMb2FkZWQ9ZnVuY3Rpb24oKXtpZig0PT09dGhpcy5hamF4UmVxdWVzdC5yZWFkeVN0YXRlKWlmKDIwMD09PXRoaXMuYWpheFJlcXVlc3Quc3RhdHVzfHwtMT09PXdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJodHRwXCIpKXt0aGlzLmF0bGFzPXttZXRhOntpbWFnZTpbXX0sZnJhbWVzOltdfTt2YXIgYT10aGlzLmFqYXhSZXF1ZXN0LnJlc3BvbnNlVGV4dC5zcGxpdCgvXFxyP1xcbi8pLGM9LTMsZD0wLGU9bnVsbCxmPSExLGc9MCxoPTAsaT10aGlzLm9uTG9hZGVkLmJpbmQodGhpcyk7Zm9yKGc9MDtnPGEubGVuZ3RoO2crKylpZihhW2ddPWFbZ10ucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKSxcIlwiPT09YVtnXSYmKGY9ZysxKSxhW2ddLmxlbmd0aD4wKXtpZihmPT09Zyl0aGlzLmF0bGFzLm1ldGEuaW1hZ2UucHVzaChhW2ddKSxkPXRoaXMuYXRsYXMubWV0YS5pbWFnZS5sZW5ndGgtMSx0aGlzLmF0bGFzLmZyYW1lcy5wdXNoKHt9KSxjPS0zO2Vsc2UgaWYoYz4wKWlmKGMlNz09PTEpbnVsbCE9ZSYmKHRoaXMuYXRsYXMuZnJhbWVzW2RdW2UubmFtZV09ZSksZT17bmFtZTphW2ddLGZyYW1lOnt9fTtlbHNle3ZhciBqPWFbZ10uc3BsaXQoXCIgXCIpO2lmKGMlNz09PTMpZS5mcmFtZS54PU51bWJlcihqWzFdLnJlcGxhY2UoXCIsXCIsXCJcIikpLGUuZnJhbWUueT1OdW1iZXIoalsyXSk7ZWxzZSBpZihjJTc9PT00KWUuZnJhbWUudz1OdW1iZXIoalsxXS5yZXBsYWNlKFwiLFwiLFwiXCIpKSxlLmZyYW1lLmg9TnVtYmVyKGpbMl0pO2Vsc2UgaWYoYyU3PT09NSl7dmFyIGs9e3g6MCx5OjAsdzpOdW1iZXIoalsxXS5yZXBsYWNlKFwiLFwiLFwiXCIpKSxoOk51bWJlcihqWzJdKX07ay53PmUuZnJhbWUud3x8ay5oPmUuZnJhbWUuaD8oZS50cmltbWVkPSEwLGUucmVhbFNpemU9ayk6ZS50cmltbWVkPSExfX1jKyt9aWYobnVsbCE9ZSYmKHRoaXMuYXRsYXMuZnJhbWVzW2RdW2UubmFtZV09ZSksdGhpcy5hdGxhcy5tZXRhLmltYWdlLmxlbmd0aD4wKXtmb3IodGhpcy5pbWFnZXM9W10saD0wO2g8dGhpcy5hdGxhcy5tZXRhLmltYWdlLmxlbmd0aDtoKyspe3ZhciBsPXRoaXMuYmFzZVVybCt0aGlzLmF0bGFzLm1ldGEuaW1hZ2VbaF0sbT10aGlzLmF0bGFzLmZyYW1lc1toXTt0aGlzLmltYWdlcy5wdXNoKG5ldyBiLkltYWdlTG9hZGVyKGwsdGhpcy5jcm9zc29yaWdpbikpO2ZvcihnIGluIG0pe3ZhciBuPW1bZ10uZnJhbWU7biYmKGIuVGV4dHVyZUNhY2hlW2ddPW5ldyBiLlRleHR1cmUodGhpcy5pbWFnZXNbaF0udGV4dHVyZS5iYXNlVGV4dHVyZSx7eDpuLngseTpuLnksd2lkdGg6bi53LGhlaWdodDpuLmh9KSxtW2ddLnRyaW1tZWQmJihiLlRleHR1cmVDYWNoZVtnXS5yZWFsU2l6ZT1tW2ddLnJlYWxTaXplLGIuVGV4dHVyZUNhY2hlW2ddLnRyaW0ueD0wLGIuVGV4dHVyZUNhY2hlW2ddLnRyaW0ueT0wKSl9fWZvcih0aGlzLmN1cnJlbnRJbWFnZUlkPTAsaD0wO2g8dGhpcy5pbWFnZXMubGVuZ3RoO2grKyl0aGlzLmltYWdlc1toXS5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsaSk7dGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SW1hZ2VJZF0ubG9hZCgpfWVsc2UgdGhpcy5vbkxvYWRlZCgpfWVsc2UgdGhpcy5vbkVycm9yKCl9LGIuQXRsYXNMb2FkZXIucHJvdG90eXBlLm9uTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy5pbWFnZXMubGVuZ3RoLTE+dGhpcy5jdXJyZW50SW1hZ2VJZD8odGhpcy5jdXJyZW50SW1hZ2VJZCsrLHRoaXMuaW1hZ2VzW3RoaXMuY3VycmVudEltYWdlSWRdLmxvYWQoKSk6KHRoaXMubG9hZGVkPSEwLHRoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcImxvYWRlZFwiLGNvbnRlbnQ6dGhpc30pKX0sYi5BdGxhc0xvYWRlci5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbigpe3RoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcImVycm9yXCIsY29udGVudDp0aGlzfSl9LGIuU3ByaXRlU2hlZXRMb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy51cmw9YSx0aGlzLmNyb3Nzb3JpZ2luPWMsdGhpcy5iYXNlVXJsPWEucmVwbGFjZSgvW15cXC9dKiQvLFwiXCIpLHRoaXMudGV4dHVyZT1udWxsLHRoaXMuZnJhbWVzPXt9fSxiLlNwcml0ZVNoZWV0TG9hZGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlNwcml0ZVNoZWV0TG9hZGVyLGIuU3ByaXRlU2hlZXRMb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLGM9bmV3IGIuSnNvbkxvYWRlcih0aGlzLnVybCx0aGlzLmNyb3Nzb3JpZ2luKTtjLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbihiKXthLmpzb249Yi5jb250ZW50Lmpzb24sYS5vbkxvYWRlZCgpfSksYy5sb2FkKCl9LGIuU3ByaXRlU2hlZXRMb2FkZXIucHJvdG90eXBlLm9uTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDp0aGlzfSl9LGIuSW1hZ2VMb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy50ZXh0dXJlPWIuVGV4dHVyZS5mcm9tSW1hZ2UoYSxjKSx0aGlzLmZyYW1lcz1bXX0sYi5JbWFnZUxvYWRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5JbWFnZUxvYWRlcixiLkltYWdlTG9hZGVyLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7aWYodGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCl0aGlzLm9uTG9hZGVkKCk7ZWxzZXt2YXIgYT10aGlzO3RoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsZnVuY3Rpb24oKXthLm9uTG9hZGVkKCl9KX19LGIuSW1hZ2VMb2FkZXIucHJvdG90eXBlLm9uTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDp0aGlzfSl9LGIuSW1hZ2VMb2FkZXIucHJvdG90eXBlLmxvYWRGcmFtZWRTcHJpdGVTaGVldD1mdW5jdGlvbihhLGMsZCl7dGhpcy5mcmFtZXM9W107Zm9yKHZhciBlPU1hdGguZmxvb3IodGhpcy50ZXh0dXJlLndpZHRoL2EpLGY9TWF0aC5mbG9vcih0aGlzLnRleHR1cmUuaGVpZ2h0L2MpLGc9MCxoPTA7Zj5oO2grKylmb3IodmFyIGk9MDtlPmk7aSsrLGcrKyl7dmFyIGo9bmV3IGIuVGV4dHVyZSh0aGlzLnRleHR1cmUse3g6aSphLHk6aCpjLHdpZHRoOmEsaGVpZ2h0OmN9KTt0aGlzLmZyYW1lcy5wdXNoKGopLGQmJihiLlRleHR1cmVDYWNoZVtkK1wiLVwiK2ddPWopfWlmKHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5oYXNMb2FkZWQpdGhpcy5vbkxvYWRlZCgpO2Vsc2V7dmFyIGs9dGhpczt0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLGZ1bmN0aW9uKCl7ay5vbkxvYWRlZCgpfSl9fSxiLkJpdG1hcEZvbnRMb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy51cmw9YSx0aGlzLmNyb3Nzb3JpZ2luPWMsdGhpcy5iYXNlVXJsPWEucmVwbGFjZSgvW15cXC9dKiQvLFwiXCIpLHRoaXMudGV4dHVyZT1udWxsfSxiLkJpdG1hcEZvbnRMb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQml0bWFwRm9udExvYWRlcixiLkJpdG1hcEZvbnRMb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXt0aGlzLmFqYXhSZXF1ZXN0PW5ldyBiLkFqYXhSZXF1ZXN0O3ZhciBhPXRoaXM7dGhpcy5hamF4UmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXthLm9uWE1MTG9hZGVkKCl9LHRoaXMuYWpheFJlcXVlc3Qub3BlbihcIkdFVFwiLHRoaXMudXJsLCEwKSx0aGlzLmFqYXhSZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUmJnRoaXMuYWpheFJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL3htbFwiKSx0aGlzLmFqYXhSZXF1ZXN0LnNlbmQobnVsbCl9LGIuQml0bWFwRm9udExvYWRlci5wcm90b3R5cGUub25YTUxMb2FkZWQ9ZnVuY3Rpb24oKXtpZig0PT09dGhpcy5hamF4UmVxdWVzdC5yZWFkeVN0YXRlJiYoMjAwPT09dGhpcy5hamF4UmVxdWVzdC5zdGF0dXN8fC0xPT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwXCIpKSl7dmFyIGE9dGhpcy5hamF4UmVxdWVzdC5yZXNwb25zZVhNTDtpZighYXx8L01TSUUgOS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl8fG5hdmlnYXRvci5pc0NvY29vbkpTKWlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHdpbmRvdy5ET01QYXJzZXIpe3ZhciBjPW5ldyBET01QYXJzZXI7YT1jLnBhcnNlRnJvbVN0cmluZyh0aGlzLmFqYXhSZXF1ZXN0LnJlc3BvbnNlVGV4dCxcInRleHQveG1sXCIpfWVsc2V7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmlubmVySFRNTD10aGlzLmFqYXhSZXF1ZXN0LnJlc3BvbnNlVGV4dCxhPWR9dmFyIGU9dGhpcy5iYXNlVXJsK2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwYWdlXCIpWzBdLmdldEF0dHJpYnV0ZShcImZpbGVcIiksZj1uZXcgYi5JbWFnZUxvYWRlcihlLHRoaXMuY3Jvc3NvcmlnaW4pO3RoaXMudGV4dHVyZT1mLnRleHR1cmUuYmFzZVRleHR1cmU7dmFyIGc9e30saD1hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5mb1wiKVswXSxpPWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjb21tb25cIilbMF07Zy5mb250PWguZ2V0QXR0cmlidXRlKFwiZmFjZVwiKSxnLnNpemU9cGFyc2VJbnQoaC5nZXRBdHRyaWJ1dGUoXCJzaXplXCIpLDEwKSxnLmxpbmVIZWlnaHQ9cGFyc2VJbnQoaS5nZXRBdHRyaWJ1dGUoXCJsaW5lSGVpZ2h0XCIpLDEwKSxnLmNoYXJzPXt9O2Zvcih2YXIgaj1hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY2hhclwiKSxrPTA7azxqLmxlbmd0aDtrKyspe3ZhciBsPXBhcnNlSW50KGpba10uZ2V0QXR0cmlidXRlKFwiaWRcIiksMTApLG09bmV3IGIuUmVjdGFuZ2xlKHBhcnNlSW50KGpba10uZ2V0QXR0cmlidXRlKFwieFwiKSwxMCkscGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJ5XCIpLDEwKSxwYXJzZUludChqW2tdLmdldEF0dHJpYnV0ZShcIndpZHRoXCIpLDEwKSxwYXJzZUludChqW2tdLmdldEF0dHJpYnV0ZShcImhlaWdodFwiKSwxMCkpO2cuY2hhcnNbbF09e3hPZmZzZXQ6cGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJ4b2Zmc2V0XCIpLDEwKSx5T2Zmc2V0OnBhcnNlSW50KGpba10uZ2V0QXR0cmlidXRlKFwieW9mZnNldFwiKSwxMCkseEFkdmFuY2U6cGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJ4YWR2YW5jZVwiKSwxMCksa2VybmluZzp7fSx0ZXh0dXJlOmIuVGV4dHVyZUNhY2hlW2xdPW5ldyBiLlRleHR1cmUodGhpcy50ZXh0dXJlLG0pfX12YXIgbj1hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwia2VybmluZ1wiKTtmb3Ioaz0wO2s8bi5sZW5ndGg7aysrKXt2YXIgbz1wYXJzZUludChuW2tdLmdldEF0dHJpYnV0ZShcImZpcnN0XCIpLDEwKSxwPXBhcnNlSW50KG5ba10uZ2V0QXR0cmlidXRlKFwic2Vjb25kXCIpLDEwKSxxPXBhcnNlSW50KG5ba10uZ2V0QXR0cmlidXRlKFwiYW1vdW50XCIpLDEwKTtnLmNoYXJzW3BdLmtlcm5pbmdbb109cX1iLkJpdG1hcFRleHQuZm9udHNbZy5mb250XT1nO3ZhciByPXRoaXM7Zi5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsZnVuY3Rpb24oKXtyLm9uTG9hZGVkKCl9KSxmLmxvYWQoKX19LGIuQml0bWFwRm9udExvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJsb2FkZWRcIixjb250ZW50OnRoaXN9KX0sYi5TcGluZUxvYWRlcj1mdW5jdGlvbihhLGMpe2IuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLnVybD1hLHRoaXMuY3Jvc3NvcmlnaW49Yyx0aGlzLmxvYWRlZD0hMX0sYi5TcGluZUxvYWRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5TcGluZUxvYWRlcixiLlNwaW5lTG9hZGVyLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcyxjPW5ldyBiLkpzb25Mb2FkZXIodGhpcy51cmwsdGhpcy5jcm9zc29yaWdpbik7XG5jLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbihiKXthLmpzb249Yi5jb250ZW50Lmpzb24sYS5vbkxvYWRlZCgpfSksYy5sb2FkKCl9LGIuU3BpbmVMb2FkZXIucHJvdG90eXBlLm9uTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy5sb2FkZWQ9ITAsdGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDp0aGlzfSl9LGIuQWJzdHJhY3RGaWx0ZXI9ZnVuY3Rpb24oYSxiKXt0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy5zaGFkZXJzPVtdLHRoaXMuZGlydHk9ITAsdGhpcy5wYWRkaW5nPTAsdGhpcy51bmlmb3Jtcz1ifHx7fSx0aGlzLmZyYWdtZW50U3JjPWF8fFtdfSxiLkFscGhhTWFza0ZpbHRlcj1mdW5jdGlvbihhKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLGEuYmFzZVRleHR1cmUuX3Bvd2VyT2YyPSEwLHRoaXMudW5pZm9ybXM9e21hc2s6e3R5cGU6XCJzYW1wbGVyMkRcIix2YWx1ZTphfSxtYXBEaW1lbnNpb25zOnt0eXBlOlwiMmZcIix2YWx1ZTp7eDoxLHk6NTExMn19LGRpbWVuc2lvbnM6e3R5cGU6XCI0ZnZcIix2YWx1ZTpbMCwwLDAsMF19fSxhLmJhc2VUZXh0dXJlLmhhc0xvYWRlZD8odGhpcy51bmlmb3Jtcy5tYXNrLnZhbHVlLng9YS53aWR0aCx0aGlzLnVuaWZvcm1zLm1hc2sudmFsdWUueT1hLmhlaWdodCk6KHRoaXMuYm91bmRMb2FkZWRGdW5jdGlvbj10aGlzLm9uVGV4dHVyZUxvYWRlZC5iaW5kKHRoaXMpLGEuYmFzZVRleHR1cmUub24oXCJsb2FkZWRcIix0aGlzLmJvdW5kTG9hZGVkRnVuY3Rpb24pKSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgbWFzaztcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldDtcIixcInVuaWZvcm0gdmVjNCBkaW1lbnNpb25zO1wiLFwidW5pZm9ybSB2ZWMyIG1hcERpbWVuc2lvbnM7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMiBtYXBDb3JkcyA9IHZUZXh0dXJlQ29vcmQueHk7XCIsXCIgICBtYXBDb3JkcyArPSAoZGltZW5zaW9ucy56dyArIG9mZnNldCkvIGRpbWVuc2lvbnMueHkgO1wiLFwiICAgbWFwQ29yZHMueSAqPSAtMS4wO1wiLFwiICAgbWFwQ29yZHMueSArPSAxLjA7XCIsXCIgICBtYXBDb3JkcyAqPSBkaW1lbnNpb25zLnh5IC8gbWFwRGltZW5zaW9ucztcIixcIiAgIHZlYzQgb3JpZ2luYWwgPSAgdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcIixcIiAgIGZsb2F0IG1hc2tBbHBoYSA9ICB0ZXh0dXJlMkQobWFzaywgbWFwQ29yZHMpLnI7XCIsXCIgICBvcmlnaW5hbCAqPSBtYXNrQWxwaGE7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSAgb3JpZ2luYWw7XCIsXCJ9XCJdfSxiLkFscGhhTWFza0ZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5BbHBoYU1hc2tGaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQWxwaGFNYXNrRmlsdGVyLGIuQWxwaGFNYXNrRmlsdGVyLnByb3RvdHlwZS5vblRleHR1cmVMb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLnVuaWZvcm1zLm1hcERpbWVuc2lvbnMudmFsdWUueD10aGlzLnVuaWZvcm1zLm1hc2sudmFsdWUud2lkdGgsdGhpcy51bmlmb3Jtcy5tYXBEaW1lbnNpb25zLnZhbHVlLnk9dGhpcy51bmlmb3Jtcy5tYXNrLnZhbHVlLmhlaWdodCx0aGlzLnVuaWZvcm1zLm1hc2sudmFsdWUuYmFzZVRleHR1cmUub2ZmKFwibG9hZGVkXCIsdGhpcy5ib3VuZExvYWRlZEZ1bmN0aW9uKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQWxwaGFNYXNrRmlsdGVyLnByb3RvdHlwZSxcIm1hcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5tYXNrLnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5tYXNrLnZhbHVlPWF9fSksYi5Db2xvck1hdHJpeEZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17bWF0cml4Ont0eXBlOlwibWF0NFwiLHZhbHVlOlsxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCwwLDAsMCwxXX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIGZsb2F0IGludmVydDtcIixcInVuaWZvcm0gbWF0NCBtYXRyaXg7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogbWF0cml4O1wiLFwifVwiXX0sYi5Db2xvck1hdHJpeEZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5Db2xvck1hdHJpeEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5Db2xvck1hdHJpeEZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Db2xvck1hdHJpeEZpbHRlci5wcm90b3R5cGUsXCJtYXRyaXhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubWF0cml4LnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5tYXRyaXgudmFsdWU9YX19KSxiLkdyYXlGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e2dyYXk6e3R5cGU6XCIxZlwiLHZhbHVlOjF9fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ1bmlmb3JtIGZsb2F0IGdyYXk7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcIixcIiAgIGdsX0ZyYWdDb2xvci5yZ2IgPSBtaXgoZ2xfRnJhZ0NvbG9yLnJnYiwgdmVjMygwLjIxMjYqZ2xfRnJhZ0NvbG9yLnIgKyAwLjcxNTIqZ2xfRnJhZ0NvbG9yLmcgKyAwLjA3MjIqZ2xfRnJhZ0NvbG9yLmIpLCBncmF5KTtcIixcIn1cIl19LGIuR3JheUZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5HcmF5RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkdyYXlGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuR3JheUZpbHRlci5wcm90b3R5cGUsXCJncmF5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyYXkudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLmdyYXkudmFsdWU9YX19KSxiLkRpc3BsYWNlbWVudEZpbHRlcj1mdW5jdGlvbihhKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLGEuYmFzZVRleHR1cmUuX3Bvd2VyT2YyPSEwLHRoaXMudW5pZm9ybXM9e2Rpc3BsYWNlbWVudE1hcDp7dHlwZTpcInNhbXBsZXIyRFwiLHZhbHVlOmF9LHNjYWxlOnt0eXBlOlwiMmZcIix2YWx1ZTp7eDozMCx5OjMwfX0sb2Zmc2V0Ont0eXBlOlwiMmZcIix2YWx1ZTp7eDowLHk6MH19LG1hcERpbWVuc2lvbnM6e3R5cGU6XCIyZlwiLHZhbHVlOnt4OjEseTo1MTEyfX0sZGltZW5zaW9uczp7dHlwZTpcIjRmdlwiLHZhbHVlOlswLDAsMCwwXX19LGEuYmFzZVRleHR1cmUuaGFzTG9hZGVkPyh0aGlzLnVuaWZvcm1zLm1hcERpbWVuc2lvbnMudmFsdWUueD1hLndpZHRoLHRoaXMudW5pZm9ybXMubWFwRGltZW5zaW9ucy52YWx1ZS55PWEuaGVpZ2h0KToodGhpcy5ib3VuZExvYWRlZEZ1bmN0aW9uPXRoaXMub25UZXh0dXJlTG9hZGVkLmJpbmQodGhpcyksYS5iYXNlVGV4dHVyZS5vbihcImxvYWRlZFwiLHRoaXMuYm91bmRMb2FkZWRGdW5jdGlvbikpLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCBkaXNwbGFjZW1lbnRNYXA7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInVuaWZvcm0gdmVjMiBzY2FsZTtcIixcInVuaWZvcm0gdmVjMiBvZmZzZXQ7XCIsXCJ1bmlmb3JtIHZlYzQgZGltZW5zaW9ucztcIixcInVuaWZvcm0gdmVjMiBtYXBEaW1lbnNpb25zO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIHZlYzIgbWFwQ29yZHMgPSB2VGV4dHVyZUNvb3JkLnh5O1wiLFwiICAgbWFwQ29yZHMgKz0gKGRpbWVuc2lvbnMuencgKyBvZmZzZXQpLyBkaW1lbnNpb25zLnh5IDtcIixcIiAgIG1hcENvcmRzLnkgKj0gLTEuMDtcIixcIiAgIG1hcENvcmRzLnkgKz0gMS4wO1wiLFwiICAgdmVjMiBtYXRTYW1wbGUgPSB0ZXh0dXJlMkQoZGlzcGxhY2VtZW50TWFwLCBtYXBDb3JkcykueHk7XCIsXCIgICBtYXRTYW1wbGUgLT0gMC41O1wiLFwiICAgbWF0U2FtcGxlICo9IHNjYWxlO1wiLFwiICAgbWF0U2FtcGxlIC89IG1hcERpbWVuc2lvbnM7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgbWF0U2FtcGxlLngsIHZUZXh0dXJlQ29vcmQueSArIG1hdFNhbXBsZS55KSk7XCIsXCIgICBnbF9GcmFnQ29sb3IucmdiID0gbWl4KCBnbF9GcmFnQ29sb3IucmdiLCBnbF9GcmFnQ29sb3IucmdiLCAxLjApO1wiLFwiICAgdmVjMiBjb3JkID0gdlRleHR1cmVDb29yZDtcIixcIn1cIl19LGIuRGlzcGxhY2VtZW50RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkRpc3BsYWNlbWVudEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5EaXNwbGFjZW1lbnRGaWx0ZXIsYi5EaXNwbGFjZW1lbnRGaWx0ZXIucHJvdG90eXBlLm9uVGV4dHVyZUxvYWRlZD1mdW5jdGlvbigpe3RoaXMudW5pZm9ybXMubWFwRGltZW5zaW9ucy52YWx1ZS54PXRoaXMudW5pZm9ybXMuZGlzcGxhY2VtZW50TWFwLnZhbHVlLndpZHRoLHRoaXMudW5pZm9ybXMubWFwRGltZW5zaW9ucy52YWx1ZS55PXRoaXMudW5pZm9ybXMuZGlzcGxhY2VtZW50TWFwLnZhbHVlLmhlaWdodCx0aGlzLnVuaWZvcm1zLmRpc3BsYWNlbWVudE1hcC52YWx1ZS5iYXNlVGV4dHVyZS5vZmYoXCJsb2FkZWRcIix0aGlzLmJvdW5kTG9hZGVkRnVuY3Rpb24pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGFjZW1lbnRGaWx0ZXIucHJvdG90eXBlLFwibWFwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmRpc3BsYWNlbWVudE1hcC52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuZGlzcGxhY2VtZW50TWFwLnZhbHVlPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxhY2VtZW50RmlsdGVyLnByb3RvdHlwZSxcInNjYWxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjYWxlLnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5zY2FsZS52YWx1ZT1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYWNlbWVudEZpbHRlci5wcm90b3R5cGUsXCJvZmZzZXRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub2Zmc2V0LnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5vZmZzZXQudmFsdWU9YX19KSxiLlBpeGVsYXRlRmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtpbnZlcnQ6e3R5cGU6XCIxZlwiLHZhbHVlOjB9LGRpbWVuc2lvbnM6e3R5cGU6XCI0ZnZcIix2YWx1ZTpuZXcgRmxvYXQzMkFycmF5KFsxZTQsMTAwLDEwLDEwXSl9LHBpeGVsU2l6ZTp7dHlwZTpcIjJmXCIsdmFsdWU6e3g6MTAseToxMH19fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSB2ZWMyIHRlc3REaW07XCIsXCJ1bmlmb3JtIHZlYzQgZGltZW5zaW9ucztcIixcInVuaWZvcm0gdmVjMiBwaXhlbFNpemU7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZDtcIixcIiAgIHZlYzIgc2l6ZSA9IGRpbWVuc2lvbnMueHkvcGl4ZWxTaXplO1wiLFwiICAgdmVjMiBjb2xvciA9IGZsb29yKCAoIHZUZXh0dXJlQ29vcmQgKiBzaXplICkgKSAvIHNpemUgKyBwaXhlbFNpemUvZGltZW5zaW9ucy54eSAqIDAuNTtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29sb3IpO1wiLFwifVwiXX0sYi5QaXhlbGF0ZUZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5QaXhlbGF0ZUZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5QaXhlbGF0ZUZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5QaXhlbGF0ZUZpbHRlci5wcm90b3R5cGUsXCJzaXplXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5waXhlbFNpemUudmFsdWU9YX19KSxiLkJsdXJYRmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtibHVyOnt0eXBlOlwiMWZcIix2YWx1ZToxLzUxMn19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIGZsb2F0IGJsdXI7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWM0IHN1bSA9IHZlYzQoMC4wKTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gNC4wKmJsdXIsIHZUZXh0dXJlQ29vcmQueSkpICogMC4wNTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gMy4wKmJsdXIsIHZUZXh0dXJlQ29vcmQueSkpICogMC4wOTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gMi4wKmJsdXIsIHZUZXh0dXJlQ29vcmQueSkpICogMC4xMjtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjE1O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSkpICogMC4xNjtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjE1O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyAyLjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjEyO1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyAzLjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjA5O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyA0LjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjA1O1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gc3VtO1wiLFwifVwiXX0sYi5CbHVyWEZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5CbHVyWEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5CbHVyWEZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5CbHVyWEZpbHRlci5wcm90b3R5cGUsXCJibHVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWUvKDEvN2UzKX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5ibHVyLnZhbHVlPTEvN2UzKmF9fSksYi5CbHVyWUZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17Ymx1cjp7dHlwZTpcIjFmXCIsdmFsdWU6MS81MTJ9fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBmbG9hdCBibHVyO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjNCBzdW0gPSB2ZWM0KDAuMCk7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gNC4wKmJsdXIpKSAqIDAuMDU7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gMy4wKmJsdXIpKSAqIDAuMDk7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gMi4wKmJsdXIpKSAqIDAuMTI7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gYmx1cikpICogMC4xNTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMTY7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55ICsgYmx1cikpICogMC4xNTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgKyAyLjAqYmx1cikpICogMC4xMjtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgKyAzLjAqYmx1cikpICogMC4wOTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgKyA0LjAqYmx1cikpICogMC4wNTtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHN1bTtcIixcIn1cIl19LGIuQmx1cllGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuQmx1cllGaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQmx1cllGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQmx1cllGaWx0ZXIucHJvdG90eXBlLFwiYmx1clwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVyLnZhbHVlLygxLzdlMyl9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWU9MS83ZTMqYX19KSxiLkJsdXJGaWx0ZXI9ZnVuY3Rpb24oKXt0aGlzLmJsdXJYRmlsdGVyPW5ldyBiLkJsdXJYRmlsdGVyLHRoaXMuYmx1cllGaWx0ZXI9bmV3IGIuQmx1cllGaWx0ZXIsdGhpcy5wYXNzZXM9W3RoaXMuYmx1clhGaWx0ZXIsdGhpcy5ibHVyWUZpbHRlcl19LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkJsdXJGaWx0ZXIucHJvdG90eXBlLFwiYmx1clwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPXRoaXMuYmx1cllGaWx0ZXIuYmx1cj1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkJsdXJGaWx0ZXIucHJvdG90eXBlLFwiYmx1clhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1clhGaWx0ZXIuYmx1cn0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuYmx1clhGaWx0ZXIuYmx1cj1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkJsdXJGaWx0ZXIucHJvdG90eXBlLFwiYmx1cllcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1cllGaWx0ZXIuYmx1cn0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuYmx1cllGaWx0ZXIuYmx1cj1hfX0pLGIuSW52ZXJ0RmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtpbnZlcnQ6e3R5cGU6XCIxZlwiLHZhbHVlOjF9fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBmbG9hdCBpbnZlcnQ7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1wiLFwiICAgZ2xfRnJhZ0NvbG9yLnJnYiA9IG1peCggKHZlYzMoMSktZ2xfRnJhZ0NvbG9yLnJnYikgKiBnbF9GcmFnQ29sb3IuYSwgZ2xfRnJhZ0NvbG9yLnJnYiwgMS4wIC0gaW52ZXJ0KTtcIixcIn1cIl19LGIuSW52ZXJ0RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkludmVydEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5JbnZlcnRGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuSW52ZXJ0RmlsdGVyLnByb3RvdHlwZSxcImludmVydFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5pbnZlcnQudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLmludmVydC52YWx1ZT1hfX0pLGIuU2VwaWFGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e3NlcGlhOnt0eXBlOlwiMWZcIix2YWx1ZToxfX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gZmxvYXQgc2VwaWE7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcImNvbnN0IG1hdDMgc2VwaWFNYXRyaXggPSBtYXQzKDAuMzU4OCwgMC43MDQ0LCAwLjEzNjgsIDAuMjk5MCwgMC41ODcwLCAwLjExNDAsIDAuMjM5MiwgMC40Njk2LCAwLjA5MTIpO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XCIsXCIgICBnbF9GcmFnQ29sb3IucmdiID0gbWl4KCBnbF9GcmFnQ29sb3IucmdiLCBnbF9GcmFnQ29sb3IucmdiICogc2VwaWFNYXRyaXgsIHNlcGlhKTtcIixcIn1cIl19LGIuU2VwaWFGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuU2VwaWFGaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuU2VwaWFGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuU2VwaWFGaWx0ZXIucHJvdG90eXBlLFwic2VwaWFcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2VwaWEudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLnNlcGlhLnZhbHVlPWF9fSksYi5Ud2lzdEZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17cmFkaXVzOnt0eXBlOlwiMWZcIix2YWx1ZTouNX0sYW5nbGU6e3R5cGU6XCIxZlwiLHZhbHVlOjV9LG9mZnNldDp7dHlwZTpcIjJmXCIsdmFsdWU6e3g6LjUseTouNX19fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSB2ZWM0IGRpbWVuc2lvbnM7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInVuaWZvcm0gZmxvYXQgcmFkaXVzO1wiLFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcIixcInVuaWZvcm0gdmVjMiBvZmZzZXQ7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgLSBvZmZzZXQ7XCIsXCIgICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aChjb29yZCk7XCIsXCIgICBpZiAoZGlzdGFuY2UgPCByYWRpdXMpIHtcIixcIiAgICAgICBmbG9hdCByYXRpbyA9IChyYWRpdXMgLSBkaXN0YW5jZSkgLyByYWRpdXM7XCIsXCIgICAgICAgZmxvYXQgYW5nbGVNb2QgPSByYXRpbyAqIHJhdGlvICogYW5nbGU7XCIsXCIgICAgICAgZmxvYXQgcyA9IHNpbihhbmdsZU1vZCk7XCIsXCIgICAgICAgZmxvYXQgYyA9IGNvcyhhbmdsZU1vZCk7XCIsXCIgICAgICAgY29vcmQgPSB2ZWMyKGNvb3JkLnggKiBjIC0gY29vcmQueSAqIHMsIGNvb3JkLnggKiBzICsgY29vcmQueSAqIGMpO1wiLFwiICAgfVwiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCtvZmZzZXQpO1wiLFwifVwiXX0sYi5Ud2lzdEZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5Ud2lzdEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5Ud2lzdEZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Ud2lzdEZpbHRlci5wcm90b3R5cGUsXCJvZmZzZXRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub2Zmc2V0LnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eT0hMCx0aGlzLnVuaWZvcm1zLm9mZnNldC52YWx1ZT1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlR3aXN0RmlsdGVyLnByb3RvdHlwZSxcInJhZGl1c1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXMudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLmRpcnR5PSEwLHRoaXMudW5pZm9ybXMucmFkaXVzLnZhbHVlPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuVHdpc3RGaWx0ZXIucHJvdG90eXBlLFwiYW5nbGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGUudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLmRpcnR5PSEwLHRoaXMudW5pZm9ybXMuYW5nbGUudmFsdWU9YX19KSxiLkNvbG9yU3RlcEZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17c3RlcDp7dHlwZTpcIjFmXCIsdmFsdWU6NX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInVuaWZvcm0gZmxvYXQgc3RlcDtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcIixcIiAgIGNvbG9yID0gZmxvb3IoY29sb3IgKiBzdGVwKSAvIHN0ZXA7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjtcIixcIn1cIl19LGIuQ29sb3JTdGVwRmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkNvbG9yU3RlcEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5Db2xvclN0ZXBGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQ29sb3JTdGVwRmlsdGVyLnByb3RvdHlwZSxcInN0ZXBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RlcC52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuc3RlcC52YWx1ZT1hfX0pLGIuRG90U2NyZWVuRmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtzY2FsZTp7dHlwZTpcIjFmXCIsdmFsdWU6MX0sYW5nbGU6e3R5cGU6XCIxZlwiLHZhbHVlOjV9LGRpbWVuc2lvbnM6e3R5cGU6XCI0ZnZcIix2YWx1ZTpbMCwwLDAsMF19fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSB2ZWM0IGRpbWVuc2lvbnM7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInVuaWZvcm0gZmxvYXQgYW5nbGU7XCIsXCJ1bmlmb3JtIGZsb2F0IHNjYWxlO1wiLFwiZmxvYXQgcGF0dGVybigpIHtcIixcIiAgIGZsb2F0IHMgPSBzaW4oYW5nbGUpLCBjID0gY29zKGFuZ2xlKTtcIixcIiAgIHZlYzIgdGV4ID0gdlRleHR1cmVDb29yZCAqIGRpbWVuc2lvbnMueHk7XCIsXCIgICB2ZWMyIHBvaW50ID0gdmVjMihcIixcIiAgICAgICBjICogdGV4LnggLSBzICogdGV4LnksXCIsXCIgICAgICAgcyAqIHRleC54ICsgYyAqIHRleC55XCIsXCIgICApICogc2NhbGU7XCIsXCIgICByZXR1cm4gKHNpbihwb2ludC54KSAqIHNpbihwb2ludC55KSkgKiA0LjA7XCIsXCJ9XCIsXCJ2b2lkIG1haW4oKSB7XCIsXCIgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcIixcIiAgIGZsb2F0IGF2ZXJhZ2UgPSAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMDtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhhdmVyYWdlICogMTAuMCAtIDUuMCArIHBhdHRlcm4oKSksIGNvbG9yLmEpO1wiLFwifVwiXX0sYi5Eb3RTY3JlZW5GaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuRG90U2NyZWVuRmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkRvdFNjcmVlbkZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Eb3RTY3JlZW5GaWx0ZXIucHJvdG90eXBlLFwic2NhbGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NhbGUudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLmRpcnR5PSEwLHRoaXMudW5pZm9ybXMuc2NhbGUudmFsdWU9YX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Eb3RTY3JlZW5GaWx0ZXIucHJvdG90eXBlLFwiYW5nbGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGUudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLmRpcnR5PSEwLHRoaXMudW5pZm9ybXMuYW5nbGUudmFsdWU9YX19KSxiLkNyb3NzSGF0Y2hGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e2JsdXI6e3R5cGU6XCIxZlwiLHZhbHVlOjEvNTEyfX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gZmxvYXQgYmx1cjtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgICBmbG9hdCBsdW0gPSBsZW5ndGgodGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkLnh5KS5yZ2IpO1wiLFwiICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcIixcIiAgICBpZiAobHVtIDwgMS4wMCkge1wiLFwiICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54ICsgZ2xfRnJhZ0Nvb3JkLnksIDEwLjApID09IDAuMCkge1wiLFwiICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1wiLFwiICAgICAgICB9XCIsXCIgICAgfVwiLFwiICAgIGlmIChsdW0gPCAwLjc1KSB7XCIsXCIgICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggLSBnbF9GcmFnQ29vcmQueSwgMTAuMCkgPT0gMC4wKSB7XCIsXCIgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XCIsXCIgICAgICAgIH1cIixcIiAgICB9XCIsXCIgICAgaWYgKGx1bSA8IDAuNTApIHtcIixcIiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCArIGdsX0ZyYWdDb29yZC55IC0gNS4wLCAxMC4wKSA9PSAwLjApIHtcIixcIiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcIixcIiAgICAgICAgfVwiLFwiICAgIH1cIixcIiAgICBpZiAobHVtIDwgMC4zKSB7XCIsXCIgICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggLSBnbF9GcmFnQ29vcmQueSAtIDUuMCwgMTAuMCkgPT0gMC4wKSB7XCIsXCIgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XCIsXCIgICAgICAgIH1cIixcIiAgICB9XCIsXCJ9XCJdfSxiLkNyb3NzSGF0Y2hGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuQ3Jvc3NIYXRjaEZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5CbHVyWUZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Dcm9zc0hhdGNoRmlsdGVyLnByb3RvdHlwZSxcImJsdXJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1ci52YWx1ZS8oMS83ZTMpfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5ibHVyLnZhbHVlPTEvN2UzKmF9fSksYi5SR0JTcGxpdEZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17cmVkOnt0eXBlOlwiMmZcIix2YWx1ZTp7eDoyMCx5OjIwfX0sZ3JlZW46e3R5cGU6XCIyZlwiLHZhbHVlOnt4Oi0yMCx5OjIwfX0sYmx1ZTp7dHlwZTpcIjJmXCIsdmFsdWU6e3g6MjAseTotMjB9fSxkaW1lbnNpb25zOnt0eXBlOlwiNGZ2XCIsdmFsdWU6WzAsMCwwLDBdfX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gdmVjMiByZWQ7XCIsXCJ1bmlmb3JtIHZlYzIgZ3JlZW47XCIsXCJ1bmlmb3JtIHZlYzIgYmx1ZTtcIixcInVuaWZvcm0gdmVjNCBkaW1lbnNpb25zO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgZ2xfRnJhZ0NvbG9yLnIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyByZWQvZGltZW5zaW9ucy54eSkucjtcIixcIiAgIGdsX0ZyYWdDb2xvci5nID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZ3JlZW4vZGltZW5zaW9ucy54eSkuZztcIixcIiAgIGdsX0ZyYWdDb2xvci5iID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgYmx1ZS9kaW1lbnNpb25zLnh5KS5iO1wiLFwiICAgZ2xfRnJhZ0NvbG9yLmEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XCIsXCJ9XCJdfSxiLlJHQlNwbGl0RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLlJHQlNwbGl0RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlJHQlNwbGl0RmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlJHQlNwbGl0RmlsdGVyLnByb3RvdHlwZSxcImFuZ2xlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWUvKDEvN2UzKX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuYmx1ci52YWx1ZT0xLzdlMyphfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzPyhcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9YiksZXhwb3J0cy5QSVhJPWIpOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGIpOmEuUElYST1ifSkuY2FsbCh0aGlzKTsiLCIvKipcbiAqIFR3ZWVuLmpzIC0gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc29sZS90d2Vlbi5qc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vc29sZS90d2Vlbi5qcy9ncmFwaHMvY29udHJpYnV0b3JzIGZvciB0aGUgZnVsbCBsaXN0IG9mIGNvbnRyaWJ1dG9ycy5cbiAqIFRoYW5rIHlvdSBhbGwsIHlvdSdyZSBhd2Vzb21lIVxuICovXG5cbi8vIERhdGUubm93IHNoaW0gZm9yIChhaGVtKSBJbnRlcm5ldCBFeHBsbyhkfHIpZXJcbmlmICggRGF0ZS5ub3cgPT09IHVuZGVmaW5lZCApIHtcblxuXHREYXRlLm5vdyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcblxuXHR9O1xuXG59XG5cbnZhciBUV0VFTiA9IFRXRUVOIHx8ICggZnVuY3Rpb24gKCkge1xuXG5cdHZhciBfdHdlZW5zID0gW107XG5cblx0cmV0dXJuIHtcblxuXHRcdFJFVklTSU9OOiAnMTQnLFxuXG5cdFx0Z2V0QWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHJldHVybiBfdHdlZW5zO1xuXG5cdFx0fSxcblxuXHRcdHJlbW92ZUFsbDogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRfdHdlZW5zID0gW107XG5cblx0XHR9LFxuXG5cdFx0YWRkOiBmdW5jdGlvbiAoIHR3ZWVuICkge1xuXG5cdFx0XHRfdHdlZW5zLnB1c2goIHR3ZWVuICk7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiAoIHR3ZWVuICkge1xuXG5cdFx0XHR2YXIgaSA9IF90d2VlbnMuaW5kZXhPZiggdHdlZW4gKTtcblxuXHRcdFx0aWYgKCBpICE9PSAtMSApIHtcblxuXHRcdFx0XHRfdHdlZW5zLnNwbGljZSggaSwgMSApO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0dXBkYXRlOiBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHRcdGlmICggX3R3ZWVucy5sZW5ndGggPT09IDAgKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IERhdGUubm93KCkgKTtcblxuXHRcdFx0d2hpbGUgKCBpIDwgX3R3ZWVucy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYgKCBfdHdlZW5zWyBpIF0udXBkYXRlKCB0aW1lICkgKSB7XG5cblx0XHRcdFx0XHRpKys7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdF90d2VlbnMuc3BsaWNlKCBpLCAxICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXHR9O1xuXG59ICkoKTtcblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAoIG9iamVjdCApIHtcblxuXHR2YXIgX29iamVjdCA9IG9iamVjdDtcblx0dmFyIF92YWx1ZXNTdGFydCA9IHt9O1xuXHR2YXIgX3ZhbHVlc0VuZCA9IHt9O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0UmVwZWF0ID0ge307XG5cdHZhciBfZHVyYXRpb24gPSAxMDAwO1xuXHR2YXIgX3JlcGVhdCA9IDA7XG5cdHZhciBfeW95byA9IGZhbHNlO1xuXHR2YXIgX2lzUGxheWluZyA9IGZhbHNlO1xuXHR2YXIgX3JldmVyc2VkID0gZmFsc2U7XG5cdHZhciBfZGVsYXlUaW1lID0gMDtcblx0dmFyIF9zdGFydFRpbWUgPSBudWxsO1xuXHR2YXIgX2Vhc2luZ0Z1bmN0aW9uID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXHR2YXIgX2ludGVycG9sYXRpb25GdW5jdGlvbiA9IFRXRUVOLkludGVycG9sYXRpb24uTGluZWFyO1xuXHR2YXIgX2NoYWluZWRUd2VlbnMgPSBbXTtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cdHZhciBfb25VcGRhdGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25Db21wbGV0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0b3BDYWxsYmFjayA9IG51bGw7XG5cblx0Ly8gU2V0IGFsbCBzdGFydGluZyB2YWx1ZXMgcHJlc2VudCBvbiB0aGUgdGFyZ2V0IG9iamVjdFxuXHRmb3IgKCB2YXIgZmllbGQgaW4gb2JqZWN0ICkge1xuXG5cdFx0X3ZhbHVlc1N0YXJ0WyBmaWVsZCBdID0gcGFyc2VGbG9hdChvYmplY3RbZmllbGRdLCAxMCk7XG5cblx0fVxuXG5cdHRoaXMudG8gPSBmdW5jdGlvbiAoIHByb3BlcnRpZXMsIGR1cmF0aW9uICkge1xuXG5cdFx0aWYgKCBkdXJhdGlvbiAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblxuXHRcdH1cblxuXHRcdF92YWx1ZXNFbmQgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCB0aW1lICkge1xuXG5cdFx0VFdFRU4uYWRkKCB0aGlzICk7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXG5cdFx0X3N0YXJ0VGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IERhdGUubm93KCkgKTtcblx0XHRfc3RhcnRUaW1lICs9IF9kZWxheVRpbWU7XG5cblx0XHRmb3IgKCB2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCApIHtcblxuXHRcdFx0Ly8gY2hlY2sgaWYgYW4gQXJyYXkgd2FzIHByb3ZpZGVkIGFzIHByb3BlcnR5IHZhbHVlXG5cdFx0XHRpZiAoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gaW5zdGFuY2VvZiBBcnJheSApIHtcblxuXHRcdFx0XHRpZiAoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0ubGVuZ3RoID09PSAwICkge1xuXG5cdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNyZWF0ZSBhIGxvY2FsIGNvcHkgb2YgdGhlIEFycmF5IHdpdGggdGhlIHN0YXJ0IHZhbHVlIGF0IHRoZSBmcm9udFxuXHRcdFx0XHRfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdID0gWyBfb2JqZWN0WyBwcm9wZXJ0eSBdIF0uY29uY2F0KCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdID0gX29iamVjdFsgcHJvcGVydHkgXTtcblxuXHRcdFx0aWYoICggX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIGluc3RhbmNlb2YgQXJyYXkgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3Ncblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIHx8IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggIV9pc1BsYXlpbmcgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRUV0VFTi5yZW1vdmUoIHRoaXMgKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoIF9vblN0b3BDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0X29uU3RvcENhbGxiYWNrLmNhbGwoIF9vYmplY3QgKTtcblxuXHRcdH1cblxuXHRcdHRoaXMuc3RvcENoYWluZWRUd2VlbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcENoYWluZWRUd2VlbnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKysgKSB7XG5cblx0XHRcdF9jaGFpbmVkVHdlZW5zWyBpIF0uc3RvcCgpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uICggYW1vdW50ICkge1xuXG5cdFx0X2RlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0ID0gZnVuY3Rpb24gKCB0aW1lcyApIHtcblxuXHRcdF9yZXBlYXQgPSB0aW1lcztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMueW95byA9IGZ1bmN0aW9uKCB5b3lvICkge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uICggZWFzaW5nICkge1xuXG5cdFx0X2Vhc2luZ0Z1bmN0aW9uID0gZWFzaW5nO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5pbnRlcnBvbGF0aW9uID0gZnVuY3Rpb24gKCBpbnRlcnBvbGF0aW9uICkge1xuXG5cdFx0X2ludGVycG9sYXRpb25GdW5jdGlvbiA9IGludGVycG9sYXRpb247XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmNoYWluID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2NoYWluZWRUd2VlbnMgPSBhcmd1bWVudHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RhcnQgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdG9wID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHR2YXIgcHJvcGVydHk7XG5cblx0XHRpZiAoIHRpbWUgPCBfc3RhcnRUaW1lICkge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdGlmICggX29uU3RhcnRDYWxsYmFja0ZpcmVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0aWYgKCBfb25TdGFydENhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRcdF9vblN0YXJ0Q2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IHRydWU7XG5cblx0XHR9XG5cblx0XHR2YXIgZWxhcHNlZCA9ICggdGltZSAtIF9zdGFydFRpbWUgKSAvIF9kdXJhdGlvbjtcblx0XHRlbGFwc2VkID0gZWxhcHNlZCA+IDEgPyAxIDogZWxhcHNlZDtcblxuXHRcdHZhciB2YWx1ZSA9IF9lYXNpbmdGdW5jdGlvbiggZWxhcHNlZCApO1xuXG5cdFx0Zm9yICggcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCApIHtcblxuXHRcdFx0dmFyIHN0YXJ0ID0gX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIHx8IDA7XG5cdFx0XHR2YXIgZW5kID0gX3ZhbHVlc0VuZFsgcHJvcGVydHkgXTtcblxuXHRcdFx0aWYgKCBlbmQgaW5zdGFuY2VvZiBBcnJheSApIHtcblxuXHRcdFx0XHRfb2JqZWN0WyBwcm9wZXJ0eSBdID0gX2ludGVycG9sYXRpb25GdW5jdGlvbiggZW5kLCB2YWx1ZSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKCB0eXBlb2YoZW5kKSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kLCAxMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBwcm90ZWN0IGFnYWluc3Qgbm9uIG51bWVyaWMgcHJvcGVydGllcy5cblx0XHRcdFx0aWYgKCB0eXBlb2YoZW5kKSA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0XHRfb2JqZWN0WyBwcm9wZXJ0eSBdID0gc3RhcnQgKyAoIGVuZCAtIHN0YXJ0ICkgKiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKCBfb2JqZWN0LCB2YWx1ZSApO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBlbGFwc2VkID09IDEgKSB7XG5cblx0XHRcdGlmICggX3JlcGVhdCA+IDAgKSB7XG5cblx0XHRcdFx0aWYoIGlzRmluaXRlKCBfcmVwZWF0ICkgKSB7XG5cdFx0XHRcdFx0X3JlcGVhdC0tO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVhc3NpZ24gc3RhcnRpbmcgdmFsdWVzLCByZXN0YXJ0IGJ5IG1ha2luZyBzdGFydFRpbWUgPSBub3dcblx0XHRcdFx0Zm9yKCBwcm9wZXJ0eSBpbiBfdmFsdWVzU3RhcnRSZXBlYXQgKSB7XG5cblx0XHRcdFx0XHRpZiAoIHR5cGVvZiggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSApID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdICsgcGFyc2VGbG9hdChfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdLCAxMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc0VuZFsgcHJvcGVydHkgXTtcblx0XHRcdFx0XHRcdF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRfcmV2ZXJzZWQgPSAhX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICggX29uQ29tcGxldGVDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKysgKSB7XG5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1sgaSBdLnN0YXJ0KCB0aW1lICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhZHJhdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogKCAyIC0gayApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoIC0tayAqICggayAtIDIgKSAtIDEgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEN1YmljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gKCAtLWsgKiBrICogayAqIGsgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdHJldHVybiAtIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAtIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1aW50aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrICogayArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoIGsgKiBNYXRoLlBJIC8gMiApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oIGsgKiBNYXRoLlBJIC8gMiApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAwLjUgKiAoIDEgLSBNYXRoLmNvcyggTWF0aC5QSSAqIGsgKSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RXhwb25lbnRpYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KCAxMDI0LCBrIC0gMSApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coIDIsIC0gMTAgKiBrICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAtIE1hdGgucG93KCAyLCAtIDEwICogKCBrIC0gMSApICkgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDaXJjdWxhcjoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoIDEgLSBrICogayApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KCAxIC0gKCAtLWsgKiBrICkgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gLSAwLjUgKiAoIE1hdGguc3FydCggMSAtIGsgKiBrKSAtIDEpO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gKCBrIC09IDIpICogaykgKyAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEVsYXN0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cblx0XHRcdGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG5cdFx0XHRyZXR1cm4gLSAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cblx0XHRcdGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG5cdFx0XHRyZXR1cm4gKCBhICogTWF0aC5wb3coIDIsIC0gMTAgKiBrKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKyAxICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gLSAwLjUgKiAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG5cdFx0XHRyZXR1cm4gYSAqIE1hdGgucG93KCAyLCAtMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICogMC41ICsgMTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJhY2s6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdHJldHVybiBrICogayAqICggKCBzICsgMSApICogayAtIHMgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiAoIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApICk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJvdW5jZToge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCggMSAtIGsgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrIDwgKCAxIC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiBrICogaztcblxuXHRcdFx0fSBlbHNlIGlmICggayA8ICggMiAvIDIuNzUgKSApIHtcblxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKCBrIC09ICggMS41IC8gMi43NSApICkgKiBrICsgMC43NTtcblxuXHRcdFx0fSBlbHNlIGlmICggayA8ICggMi41IC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjI1IC8gMi43NSApICkgKiBrICsgMC45Mzc1O1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjYyNSAvIDIuNzUgKSApICogayArIDAuOTg0Mzc1O1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrIDwgMC41ICkgcmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuSW4oIGsgKiAyICkgKiAwLjU7XG5cdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoIGsgKiAyIC0gMSApICogMC41ICsgMC41O1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuVFdFRU4uSW50ZXJwb2xhdGlvbiA9IHtcblxuXHRMaW5lYXI6IGZ1bmN0aW9uICggdiwgayApIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxLCBmID0gbSAqIGssIGkgPSBNYXRoLmZsb29yKCBmICksIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5MaW5lYXI7XG5cblx0XHRpZiAoIGsgPCAwICkgcmV0dXJuIGZuKCB2WyAwIF0sIHZbIDEgXSwgZiApO1xuXHRcdGlmICggayA+IDEgKSByZXR1cm4gZm4oIHZbIG0gXSwgdlsgbSAtIDEgXSwgbSAtIGYgKTtcblxuXHRcdHJldHVybiBmbiggdlsgaSBdLCB2WyBpICsgMSA+IG0gPyBtIDogaSArIDEgXSwgZiAtIGkgKTtcblxuXHR9LFxuXG5cdEJlemllcjogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIGIgPSAwLCBuID0gdi5sZW5ndGggLSAxLCBwdyA9IE1hdGgucG93LCBibiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQmVybnN0ZWluLCBpO1xuXG5cdFx0Zm9yICggaSA9IDA7IGkgPD0gbjsgaSsrICkge1xuXHRcdFx0YiArPSBwdyggMSAtIGssIG4gLSBpICkgKiBwdyggaywgaSApICogdlsgaSBdICogYm4oIG4sIGkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYjtcblxuXHR9LFxuXG5cdENhdG11bGxSb206IGZ1bmN0aW9uICggdiwgayApIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxLCBmID0gbSAqIGssIGkgPSBNYXRoLmZsb29yKCBmICksIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5DYXRtdWxsUm9tO1xuXG5cdFx0aWYgKCB2WyAwIF0gPT09IHZbIG0gXSApIHtcblxuXHRcdFx0aWYgKCBrIDwgMCApIGkgPSBNYXRoLmZsb29yKCBmID0gbSAqICggMSArIGsgKSApO1xuXG5cdFx0XHRyZXR1cm4gZm4oIHZbICggaSAtIDEgKyBtICkgJSBtIF0sIHZbIGkgXSwgdlsgKCBpICsgMSApICUgbSBdLCB2WyAoIGkgKyAyICkgJSBtIF0sIGYgLSBpICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoIGsgPCAwICkgcmV0dXJuIHZbIDAgXSAtICggZm4oIHZbIDAgXSwgdlsgMCBdLCB2WyAxIF0sIHZbIDEgXSwgLWYgKSAtIHZbIDAgXSApO1xuXHRcdFx0aWYgKCBrID4gMSApIHJldHVybiB2WyBtIF0gLSAoIGZuKCB2WyBtIF0sIHZbIG0gXSwgdlsgbSAtIDEgXSwgdlsgbSAtIDEgXSwgZiAtIG0gKSAtIHZbIG0gXSApO1xuXG5cdFx0XHRyZXR1cm4gZm4oIHZbIGkgPyBpIC0gMSA6IDAgXSwgdlsgaSBdLCB2WyBtIDwgaSArIDEgPyBtIDogaSArIDEgXSwgdlsgbSA8IGkgKyAyID8gbSA6IGkgKyAyIF0sIGYgLSBpICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRVdGlsczoge1xuXG5cdFx0TGluZWFyOiBmdW5jdGlvbiAoIHAwLCBwMSwgdCApIHtcblxuXHRcdFx0cmV0dXJuICggcDEgLSBwMCApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKCBuICwgaSApIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cdFx0XHRyZXR1cm4gZmMoIG4gKSAvIGZjKCBpICkgLyBmYyggbiAtIGkgKTtcblxuXHRcdH0sXG5cblx0XHRGYWN0b3JpYWw6ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYSA9IFsgMSBdO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuXG5cdFx0XHRcdHZhciBzID0gMSwgaTtcblx0XHRcdFx0aWYgKCBhWyBuIF0gKSByZXR1cm4gYVsgbiBdO1xuXHRcdFx0XHRmb3IgKCBpID0gbjsgaSA+IDE7IGktLSApIHMgKj0gaTtcblx0XHRcdFx0cmV0dXJuIGFbIG4gXSA9IHM7XG5cblx0XHRcdH07XG5cblx0XHR9ICkoKSxcblxuXHRcdENhdG11bGxSb206IGZ1bmN0aW9uICggcDAsIHAxLCBwMiwgcDMsIHQgKSB7XG5cblx0XHRcdHZhciB2MCA9ICggcDIgLSBwMCApICogMC41LCB2MSA9ICggcDMgLSBwMSApICogMC41LCB0MiA9IHQgKiB0LCB0MyA9IHQgKiB0Mjtcblx0XHRcdHJldHVybiAoIDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEgKSAqIHQzICsgKCAtIDMgKiBwMSArIDMgKiBwMiAtIDIgKiB2MCAtIHYxICkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHM9VFdFRU47IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIFBpeGlBcHAgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvUGl4aUFwcFwiKTtcbnZhciBDb250ZW50U2NhbGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0NvbnRlbnRTY2FsZXJcIik7XG52YXIgTmV0UG9rZXJDbGllbnRWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvTmV0UG9rZXJDbGllbnRWaWV3XCIpO1xudmFyIE5ldFBva2VyQ2xpZW50Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9jb250cm9sbGVyL05ldFBva2VyQ2xpZW50Q29udHJvbGxlclwiKTtcbnZhciBNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvblwiKTtcbnZhciBQcm90b0Nvbm5lY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vUHJvdG9Db25uZWN0aW9uXCIpO1xudmFyIExvYWRpbmdTY3JlZW4gPSByZXF1aXJlKFwiLi4vdmlldy9Mb2FkaW5nU2NyZWVuXCIpO1xudmFyIFN0YXRlQ29tcGxldGVNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL1N0YXRlQ29tcGxldGVNZXNzYWdlXCIpO1xudmFyIEluaXRNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0luaXRNZXNzYWdlXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xuXG4vKipcbiAqIE1haW4gZW50cnkgcG9pbnQgZm9yIGNsaWVudC5cbiAqIEBjbGFzcyBOZXRQb2tlckNsaWVudFxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnQoZG9tSWQpIHtcblx0UGl4aUFwcC5jYWxsKHRoaXMsIGRvbUlkLCA5NjAsIDcyMCk7XG5cblx0dGhpcy5zZXRDb250ZW50QWxpZ24oQ29udGVudFNjYWxlci5UT1ApO1xuXG5cdHRoaXMubG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nU2NyZWVuKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5sb2FkaW5nU2NyZWVuKTtcblx0dGhpcy5sb2FkaW5nU2NyZWVuLnNob3coXCJMT0FESU5HXCIpO1xuXG5cdHRoaXMudXJsID0gbnVsbDtcblxuXHR0aGlzLnRhYmxlSWQ9bnVsbDtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChOZXRQb2tlckNsaWVudCwgUGl4aUFwcCk7XG5cbi8qKlxuICogU2V0IHVybC5cbiAqIEBtZXRob2Qgc2V0VXJsXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5zZXRVcmwgPSBmdW5jdGlvbih1cmwpIHtcblx0dGhpcy51cmwgPSB1cmw7XG59XG5cbi8qKlxuICogU2V0IHRhYmxlIGlkLlxuICogQG1ldGhvZCBzZXRUYWJsZUlkXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5zZXRUYWJsZUlkID0gZnVuY3Rpb24odGFibGVJZCkge1xuXHR0aGlzLnRhYmxlSWQgPSB0YWJsZUlkO1xufVxuXG4vKipcbiAqIFNldCB2aWV3IGNhc2UuXG4gKiBAbWV0aG9kIHNldFZpZXdDYXNlXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5zZXRWaWV3Q2FzZSA9IGZ1bmN0aW9uKHZpZXdDYXNlKSB7XG5cdGNvbnNvbGUubG9nKFwiKioqKioqIHJ1bm5pbmcgdmlldyBjYXNlOiBcIit2aWV3Q2FzZSk7XG5cdHRoaXMudmlld0Nhc2U9dmlld0Nhc2U7XG59XG5cbi8qKlxuICogU2V0IHRva2VuLlxuICogQG1ldGhvZCBzZXRUb2tlblxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUuc2V0VG9rZW4gPSBmdW5jdGlvbih0b2tlbikge1xuXHR0aGlzLnRva2VuID0gdG9rZW47XG59XG5cbi8qKlxuICogU2V0IHRva2VuLlxuICogQG1ldGhvZCBzZXRTa2luXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5zZXRTa2luID0gZnVuY3Rpb24oc2tpbikge1xuXHRSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5za2luID0gc2tpbjtcbn1cblxuLyoqXG4gKiBSdW4uXG4gKiBAbWV0aG9kIHJ1blxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGFzc2V0cyA9IFtcblx0XHRcInRhYmxlLnBuZ1wiLFxuXHRcdFwiY29tcG9uZW50cy5wbmdcIlxuXHRdO1xuXHRpZigoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuc2tpbiAhPSBudWxsKSAmJiAoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuc2tpbi50ZXh0dXJlcyAhPSBudWxsKSkge1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5za2luLnRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhc3NldHMucHVzaChSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5za2luLnRleHR1cmVzW2ldLmZpbGUpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJhZGQgdG8gbG9hZCBsaXN0OiBcIiArIFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLnNraW4udGV4dHVyZXNbaV0uZmlsZSk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5hc3NldExvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKGFzc2V0cyk7XG5cdHRoaXMuYXNzZXRMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm9uQ29tcGxldGVcIiwgdGhpcy5vbkFzc2V0TG9hZGVyQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cdHRoaXMuYXNzZXRMb2FkZXIubG9hZCgpO1xufVxuXG4vKipcbiAqIEFzc2V0cyBsb2FkZWQsIGNvbm5lY3QuXG4gKiBAbWV0aG9kIG9uQXNzZXRMb2FkZXJDb21wbGV0ZVxuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLm9uQXNzZXRMb2FkZXJDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcImFzc2V0IGxvYWRlciBjb21wbGV0ZS4uLlwiKTtcblxuXHR0aGlzLm5ldFBva2VyQ2xpZW50VmlldyA9IG5ldyBOZXRQb2tlckNsaWVudFZpZXcoKTtcblx0dGhpcy5hZGRDaGlsZEF0KHRoaXMubmV0UG9rZXJDbGllbnRWaWV3LCAwKTtcblxuXHR0aGlzLm5ldFBva2VyQ2xpZW50Q29udHJvbGxlciA9IG5ldyBOZXRQb2tlckNsaWVudENvbnRyb2xsZXIodGhpcy5uZXRQb2tlckNsaWVudFZpZXcpO1xuXHR0aGlzLmNvbm5lY3QoKTtcbn1cblxuLyoqXG4gKiBDb25uZWN0LlxuICogQG1ldGhvZCBjb25uZWN0XG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMudXJsKSB7XG5cdFx0dGhpcy5sb2FkaW5nU2NyZWVuLnNob3coXCJORUVEIFVSTFwiKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLmNvbm5lY3Rpb24gPSBuZXcgTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24oKTtcblx0dGhpcy5jb25uZWN0aW9uLm9uKE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLkNPTk5FQ1QsIHRoaXMub25Db25uZWN0aW9uQ29ubmVjdCwgdGhpcyk7XG5cdHRoaXMuY29ubmVjdGlvbi5vbihNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DTE9TRSwgdGhpcy5vbkNvbm5lY3Rpb25DbG9zZSwgdGhpcyk7XG5cdHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KHRoaXMudXJsKTtcblx0dGhpcy5sb2FkaW5nU2NyZWVuLnNob3coXCJDT05ORUNUSU5HXCIpO1xufVxuXG4vKipcbiAqIENvbm5lY3Rpb24gY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uQ29ubmVjdGlvbkNvbm5lY3RcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5vbkNvbm5lY3Rpb25Db25uZWN0ID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiKioqKiBjb25uZWN0ZWRcIik7XG5cdHRoaXMucHJvdG9Db25uZWN0aW9uID0gbmV3IFByb3RvQ29ubmVjdGlvbih0aGlzLmNvbm5lY3Rpb24pO1xuXHR0aGlzLnByb3RvQ29ubmVjdGlvbi5hZGRNZXNzYWdlSGFuZGxlcihTdGF0ZUNvbXBsZXRlTWVzc2FnZSwgdGhpcy5vblN0YXRlQ29tcGxldGVNZXNzYWdlLCB0aGlzKTtcblx0dGhpcy5uZXRQb2tlckNsaWVudENvbnRyb2xsZXIuc2V0UHJvdG9Db25uZWN0aW9uKHRoaXMucHJvdG9Db25uZWN0aW9uKTtcblx0dGhpcy5sb2FkaW5nU2NyZWVuLnNob3coXCJJTklUSUFMSVpJTkdcIik7XG5cblx0dmFyIGluaXRNZXNzYWdlPW5ldyBJbml0TWVzc2FnZSh0aGlzLnRva2VuKTtcblxuXHRpZiAodGhpcy50YWJsZUlkKVxuXHRcdGluaXRNZXNzYWdlLnNldFRhYmxlSWQodGhpcy50YWJsZUlkKTtcblxuXHRpZiAodGhpcy52aWV3Q2FzZSlcblx0XHRpbml0TWVzc2FnZS5zZXRWaWV3Q2FzZSh0aGlzLnZpZXdDYXNlKTtcblxuXHR0aGlzLnByb3RvQ29ubmVjdGlvbi5zZW5kKGluaXRNZXNzYWdlKTtcbn1cblxuLyoqXG4gKiBTdGF0ZSBjb21wbGV0ZS5cbiAqIEBtZXRob2Qgb25TdGF0ZUNvbXBsZXRlTWVzc2FnZVxuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLm9uU3RhdGVDb21wbGV0ZU1lc3NhZ2U9ZnVuY3Rpb24oKSB7XG5cdHRoaXMubG9hZGluZ1NjcmVlbi5oaWRlKCk7XG59XG5cbi8qKlxuICogQ29ubmVjdGlvbiBjbG9zZWQuXG4gKiBAbWV0aG9kIG9uQ29ubmVjdGlvbkNsb3NlXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUub25Db25uZWN0aW9uQ2xvc2UgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCIqKioqIGNvbm5lY3Rpb24gY2xvc2VkXCIpO1xuXHRpZiAodGhpcy5wcm90b0Nvbm5lY3Rpb24pXG5cdFx0dGhpcy5wcm90b0Nvbm5lY3Rpb24ucmVtb3ZlTWVzc2FnZUhhbmRsZXIoU3RhdGVDb21wbGV0ZU1lc3NhZ2UsIHRoaXMub25TdGF0ZUNvbXBsZXRlTWVzc2FnZSwgdGhpcyk7XG5cblx0dGhpcy5wcm90b0Nvbm5lY3Rpb24gPSBudWxsO1xuXHR0aGlzLm5ldFBva2VyQ2xpZW50Q29udHJvbGxlci5zZXRQcm90b0Nvbm5lY3Rpb24obnVsbCk7XG5cdHRoaXMubG9hZGluZ1NjcmVlbi5zaG93KFwiQ09OTkVDVElPTiBFUlJPUlwiKTtcblx0c2V0VGltZW91dCh0aGlzLmNvbm5lY3QuYmluZCh0aGlzKSwgMzAwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0UG9rZXJDbGllbnQ7IiwiLyoqXG4gKiBDbGllbnQgcmVzb3VyY2VzXG4gKiBAY2xhc3MgU2V0dGluZ3NcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbiBmdW5jdGlvbiBTZXR0aW5ncygpIHtcbiBcdHRoaXMucGxheUFuaW1hdGlvbnMgPSB0cnVlO1xuIH1cblxuXG4vKipcbiAqIEdldCBzaW5nbGV0b24gaW5zdGFuY2UuXG4gKiBAbWV0aG9kIGdldEluc3RhbmNlXG4gKi9cblNldHRpbmdzLmdldEluc3RhbmNlID0gZnVuY3Rpb24oKSB7XG5cdGlmICghU2V0dGluZ3MuaW5zdGFuY2UpXG5cdFx0U2V0dGluZ3MuaW5zdGFuY2UgPSBuZXcgU2V0dGluZ3MoKTtcblxuXHRyZXR1cm4gU2V0dGluZ3MuaW5zdGFuY2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7IiwidmFyIFNob3dEaWFsb2dNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL1Nob3dEaWFsb2dNZXNzYWdlXCIpO1xudmFyIEJ1dHRvbnNNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0J1dHRvbnNNZXNzYWdlXCIpO1xudmFyIENoYXRNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0NoYXRNZXNzYWdlXCIpO1xudmFyIFRhYmxlSW5mb01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvVGFibGVJbmZvTWVzc2FnZVwiKTtcblxuLyoqXG4gKiBDb250cm9sIHVzZXIgaW50ZXJmYWNlLlxuICogQGNsYXNzIEludGVyZmFjZUNvbnRyb2xsZXJcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIEludGVyZmFjZUNvbnRyb2xsZXIobWVzc2FnZVNlcXVlbmNlciwgdmlldykge1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIgPSBtZXNzYWdlU2VxdWVuY2VyO1xuXHR0aGlzLnZpZXcgPSB2aWV3O1xuXG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihCdXR0b25zTWVzc2FnZS5UWVBFLCB0aGlzLm9uQnV0dG9uc01lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoU2hvd0RpYWxvZ01lc3NhZ2UuVFlQRSwgdGhpcy5vblNob3dEaWFsb2dNZXNzYWdlLCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKENoYXRNZXNzYWdlLlRZUEUsIHRoaXMub25DaGF0LCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKFRhYmxlSW5mb01lc3NhZ2UuVFlQRSwgdGhpcy5vblRhYmxlSW5mb01lc3NhZ2UsIHRoaXMpO1xufVxuXG4vKipcbiAqIEJ1dHRvbnMgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25CdXR0b25zTWVzc2FnZVxuICovXG5JbnRlcmZhY2VDb250cm9sbGVyLnByb3RvdHlwZS5vbkJ1dHRvbnNNZXNzYWdlID0gZnVuY3Rpb24obSkge1xuXHR2YXIgYnV0dG9uc1ZpZXcgPSB0aGlzLnZpZXcuZ2V0QnV0dG9uc1ZpZXcoKTtcblxuXHRidXR0b25zVmlldy5zZXRCdXR0b25zKG0uZ2V0QnV0dG9ucygpLCBtLnNsaWRlckJ1dHRvbkluZGV4LCBwYXJzZUludChtLm1pbiwgMTApLCBwYXJzZUludChtLm1heCwgMTApKTtcbn1cblxuLyoqXG4gKiBTaG93IGRpYWxvZy5cbiAqIEBtZXRob2Qgb25TaG93RGlhbG9nTWVzc2FnZVxuICovXG5JbnRlcmZhY2VDb250cm9sbGVyLnByb3RvdHlwZS5vblNob3dEaWFsb2dNZXNzYWdlID0gZnVuY3Rpb24obSkge1xuXHR2YXIgZGlhbG9nVmlldyA9IHRoaXMudmlldy5nZXREaWFsb2dWaWV3KCk7XG5cblx0ZGlhbG9nVmlldy5zaG93KG0uZ2V0VGV4dCgpLCBtLmdldEJ1dHRvbnMoKSwgbS5nZXREZWZhdWx0VmFsdWUoKSk7XG59XG5cblxuLyoqXG4gKiBPbiBjaGF0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQ2hhdFxuICovXG5JbnRlcmZhY2VDb250cm9sbGVyLnByb3RvdHlwZS5vbkNoYXQgPSBmdW5jdGlvbihtKSB7XG5cdHRoaXMudmlldy5jaGF0Vmlldy5hZGRUZXh0KG0udXNlciwgbS50ZXh0KTtcbn1cblxuLyoqXG4gKiBIYW5kbGUgdGFibGUgaW5mbyBtZXNzYWdlLlxuICogQG1ldGhvZCBvblRhYmxlSW5mb01lc3NhZ2VcbiAqL1xuSW50ZXJmYWNlQ29udHJvbGxlci5wcm90b3R5cGUub25UYWJsZUluZm9NZXNzYWdlID0gZnVuY3Rpb24obSkge1xuXHR2YXIgdGFibGVJbmZvVmlldz10aGlzLnZpZXcuZ2V0VGFibGVJbmZvVmlldygpO1xuXG5cdHRhYmxlSW5mb1ZpZXcuc2V0VGFibGVJbmZvVGV4dChtLmdldFRleHQoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJmYWNlQ29udHJvbGxlcjsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIFNlcXVlbmNlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9TZXF1ZW5jZXJcIik7XG5cbi8qKlxuICogQW4gaXRlbSBpbiBhIG1lc3NhZ2Ugc2VxdWVuY2UuXG4gKiBAY2xhc3MgTWVzc2FnZVNlcXVlbmNlSXRlbVxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTWVzc2FnZVNlcXVlbmNlSXRlbShtZXNzYWdlKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR0aGlzLndhaXRUYXJnZXQgPSBudWxsO1xuXHR0aGlzLndhaXRFdmVudCA9IG51bGw7XG5cdHRoaXMud2FpdENsb3N1cmUgPSBudWxsO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE1lc3NhZ2VTZXF1ZW5jZUl0ZW0sIEV2ZW50RGlzcGF0Y2hlcik7XG5cbi8qKlxuICogR2V0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIGdldE1lc3NhZ2VcbiAqL1xuTWVzc2FnZVNlcXVlbmNlSXRlbS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuXHQvL2NvbnNvbGUubG9nKFwiZ2V0dGluZzogXCIgKyB0aGlzLm1lc3NhZ2UudHlwZSk7XG5cblx0cmV0dXJuIHRoaXMubWVzc2FnZTtcbn1cblxuLyoqXG4gKiBBcmUgd2Ugd2FpdGluZyBmb3IgYW4gZXZlbnQ/XG4gKiBAbWV0aG9kIGlzV2FpdGluZ1xuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5pc1dhaXRpbmcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMud2FpdEV2ZW50ICE9IG51bGw7XG59XG5cbi8qKlxuICogTm90aWZ5IGNvbXBsZXRlLlxuICogQG1ldGhvZCBub3RpZnlDb21wbGV0ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5ub3RpZnlDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRyaWdnZXIoU2VxdWVuY2VyLkNPTVBMRVRFKTtcbn1cblxuLyoqXG4gKiBXYWl0IGZvciBldmVudCBiZWZvcmUgcHJvY2Vzc2luZyBuZXh0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHdhaXRGb3JcbiAqL1xuTWVzc2FnZVNlcXVlbmNlSXRlbS5wcm90b3R5cGUud2FpdEZvciA9IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQpIHtcblx0dGhpcy53YWl0VGFyZ2V0ID0gdGFyZ2V0O1xuXHR0aGlzLndhaXRFdmVudCA9IGV2ZW50O1xuXHR0aGlzLndhaXRDbG9zdXJlID0gdGhpcy5vblRhcmdldENvbXBsZXRlLmJpbmQodGhpcyk7XG5cblx0dGhpcy53YWl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodGhpcy53YWl0RXZlbnQsIHRoaXMud2FpdENsb3N1cmUpO1xufVxuXG4vKipcbiAqIFdhaXQgdGFyZ2V0IGNvbXBsZXRlLlxuICogQG1ldGhvZCBvblRhcmdldENvbXBsZXRlXG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5vblRhcmdldENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdC8vY29uc29sZS5sb2coXCJ0YXJnZXQgaXMgY29tcGxldGVcIik7XG5cdHRoaXMud2FpdFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMud2FpdEV2ZW50LCB0aGlzLndhaXRDbG9zdXJlKTtcblx0dGhpcy5ub3RpZnlDb21wbGV0ZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VTZXF1ZW5jZUl0ZW07IiwidmFyIFNlcXVlbmNlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9TZXF1ZW5jZXJcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBNZXNzYWdlU2VxdWVuY2VJdGVtID0gcmVxdWlyZShcIi4vTWVzc2FnZVNlcXVlbmNlSXRlbVwiKTtcblxuLyoqXG4gKiBTZXF1ZW5jZXMgbWVzc2FnZXMuXG4gKiBAY2xhc3MgTWVzc2FnZVNlcXVlbmNlclxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTWVzc2FnZVNlcXVlbmNlcigpIHtcblx0dGhpcy5zZXF1ZW5jZXIgPSBuZXcgU2VxdWVuY2VyKCk7XG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG5cdHRoaXMuY3VycmVudEl0ZW0gPSBudWxsO1xufVxuXG4vKipcbiAqIEFkZCBhIG1lc3NhZ2UgZm9yIHByb2Nlc2luZy5cbiAqIEBtZXRob2QgZW5xdWV1ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VyLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHRpZiAoIW1lc3NhZ2UudHlwZSlcblx0XHR0aHJvdyBcIk1lc3NhZ2UgZG9lc24ndCBoYXZlIGEgdHlwZVwiO1xuXG5cdHZhciBzZXF1ZW5jZUl0ZW0gPSBuZXcgTWVzc2FnZVNlcXVlbmNlSXRlbShtZXNzYWdlKTtcblxuXHRzZXF1ZW5jZUl0ZW0ub24oU2VxdWVuY2VyLlNUQVJULCB0aGlzLm9uU2VxdWVuY2VJdGVtU3RhcnQsIHRoaXMpO1xuXG5cdHRoaXMuc2VxdWVuY2VyLmVucXVldWUoc2VxdWVuY2VJdGVtKTtcbn1cblxuLyoqXG4gKiBTZXF1ZW5jZSBpdGVtIHN0YXJ0LlxuICogQG1ldGhvZCBvblNlcXVlbmNlSXRlbVN0YXJ0XG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VyLnByb3RvdHlwZS5vblNlcXVlbmNlSXRlbVN0YXJ0ID0gZnVuY3Rpb24oZSkge1xuXHQvL2NvbnNvbGUubG9nKFwic3RhcnRpbmcgaXRlbS4uLlwiKTtcblx0dmFyIGl0ZW0gPSBlLnRhcmdldDtcblxuXHRpdGVtLm9mZihTZXF1ZW5jZXIuU1RBUlQsIHRoaXMub25TZXF1ZW5jZUl0ZW1TdGFydCwgdGhpcyk7XG5cblx0dGhpcy5jdXJyZW50SXRlbSA9IGl0ZW07XG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIudHJpZ2dlcihpdGVtLmdldE1lc3NhZ2UoKSk7XG5cdHRoaXMuY3VycmVudEl0ZW0gPSBudWxsO1xuXG5cdGlmICghaXRlbS5pc1dhaXRpbmcoKSlcblx0XHRpdGVtLm5vdGlmeUNvbXBsZXRlKCk7XG59XG5cbi8qKlxuICogQWRkIG1lc3NhZ2UgaGFuZGxlci5cbiAqIEBtZXRob2QgYWRkTWVzc2FnZUhhbmRsZXJcbiAqL1xuTWVzc2FnZVNlcXVlbmNlci5wcm90b3R5cGUuYWRkTWVzc2FnZUhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlVHlwZSwgaGFuZGxlciwgc2NvcGUpIHtcblx0dGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5vbihtZXNzYWdlVHlwZSwgaGFuZGxlciwgc2NvcGUpO1xufVxuXG4vKipcbiAqIFdhaXQgZm9yIHRoZSB0YXJnZXQgdG8gZGlzcGF0Y2ggYW4gZXZlbnQgYmVmb3JlIGNvbnRpbnVpbmcgdG9cbiAqIHByb2Nlc3MgdGhlIG1lc3NhZ2VzIGluIHRoZSBxdWUuXG4gKiBAbWV0aG9kIHdhaXRGb3JcbiAqL1xuTWVzc2FnZVNlcXVlbmNlci5wcm90b3R5cGUud2FpdEZvciA9IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQpIHtcblx0aWYgKCF0aGlzLmN1cnJlbnRJdGVtKVxuXHRcdHRocm93IFwiTm90IHdhaXRpbmcgZm9yIGV2ZW50XCI7XG5cblx0dGhpcy5jdXJyZW50SXRlbS53YWl0Rm9yKHRhcmdldCwgZXZlbnQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VTZXF1ZW5jZXI7IiwidmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgTWVzc2FnZVNlcXVlbmNlciA9IHJlcXVpcmUoXCIuL01lc3NhZ2VTZXF1ZW5jZXJcIik7XG52YXIgUHJvdG9Db25uZWN0aW9uID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL1Byb3RvQ29ubmVjdGlvblwiKTtcbnZhciBCdXR0b25zVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L0J1dHRvbnNWaWV3XCIpO1xudmFyIEJ1dHRvbkNsaWNrTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9CdXR0b25DbGlja01lc3NhZ2VcIik7XG52YXIgU2VhdENsaWNrTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9TZWF0Q2xpY2tNZXNzYWdlXCIpO1xudmFyIE5ldFBva2VyQ2xpZW50VmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L05ldFBva2VyQ2xpZW50Vmlld1wiKTtcbnZhciBEaWFsb2dWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvRGlhbG9nVmlld1wiKTtcbnZhciBTZXR0aW5nc1ZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9TZXR0aW5nc1ZpZXdcIik7XG52YXIgVGFibGVDb250cm9sbGVyID0gcmVxdWlyZShcIi4vVGFibGVDb250cm9sbGVyXCIpO1xudmFyIEludGVyZmFjZUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9JbnRlcmZhY2VDb250cm9sbGVyXCIpO1xudmFyIENoYXRNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0NoYXRNZXNzYWdlXCIpO1xudmFyIEJ1dHRvbkRhdGEgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vZGF0YS9CdXR0b25EYXRhXCIpO1xuXG4vKipcbiAqIE1haW4gY29udHJvbGxlclxuICogQGNsYXNzIE5ldFBva2VyQ2xpZW50Q29udHJvbGxlclxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnRDb250cm9sbGVyKHZpZXcpIHtcblx0dGhpcy5uZXRQb2tlckNsaWVudFZpZXcgPSB2aWV3O1xuXHR0aGlzLnByb3RvQ29ubmVjdGlvbiA9IG51bGw7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlciA9IG5ldyBNZXNzYWdlU2VxdWVuY2VyKCk7XG5cblx0dGhpcy50YWJsZUNvbnRyb2xsZXIgPSBuZXcgVGFibGVDb250cm9sbGVyKHRoaXMubWVzc2FnZVNlcXVlbmNlciwgdGhpcy5uZXRQb2tlckNsaWVudFZpZXcpO1xuXHR0aGlzLmludGVyZmFjZUNvbnRyb2xsZXIgPSBuZXcgSW50ZXJmYWNlQ29udHJvbGxlcih0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIsIHRoaXMubmV0UG9rZXJDbGllbnRWaWV3KTtcblxuXHRjb25zb2xlLmxvZyh0aGlzLm5ldFBva2VyQ2xpZW50Vmlldy5nZXREaWFsb2dWaWV3KCkpO1xuXG5cdHRoaXMubmV0UG9rZXJDbGllbnRWaWV3LmdldEJ1dHRvbnNWaWV3KCkub24oQnV0dG9uc1ZpZXcuQlVUVE9OX0NMSUNLLCB0aGlzLm9uQnV0dG9uQ2xpY2ssIHRoaXMpO1xuXHR0aGlzLm5ldFBva2VyQ2xpZW50Vmlldy5nZXREaWFsb2dWaWV3KCkub24oRGlhbG9nVmlldy5CVVRUT05fQ0xJQ0ssIHRoaXMub25CdXR0b25DbGljaywgdGhpcyk7XG5cdHRoaXMubmV0UG9rZXJDbGllbnRWaWV3Lm9uKE5ldFBva2VyQ2xpZW50Vmlldy5TRUFUX0NMSUNLLCB0aGlzLm9uU2VhdENsaWNrLCB0aGlzKTtcblxuXHR0aGlzLm5ldFBva2VyQ2xpZW50Vmlldy5jaGF0Vmlldy5hZGRFdmVudExpc3RlbmVyKFwiY2hhdFwiLCB0aGlzLm9uVmlld0NoYXQsIHRoaXMpO1xuXG5cdHRoaXMubmV0UG9rZXJDbGllbnRWaWV3LnNldHRpbmdzVmlldy5hZGRFdmVudExpc3RlbmVyKFNldHRpbmdzVmlldy5CVVlfQ0hJUFNfQ0xJQ0ssIHRoaXMub25CdXlDaGlwc0J1dHRvbkNsaWNrLCB0aGlzKTtcbn1cblxuXG4vKipcbiAqIFNldCBjb25uZWN0aW9uLlxuICogQG1ldGhvZCBzZXRQcm90b0Nvbm5lY3Rpb25cbiAqL1xuTmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRQcm90b0Nvbm5lY3Rpb24gPSBmdW5jdGlvbihwcm90b0Nvbm5lY3Rpb24pIHtcblx0aWYgKHRoaXMucHJvdG9Db25uZWN0aW9uKSB7XG5cdFx0dGhpcy5wcm90b0Nvbm5lY3Rpb24ub2ZmKFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFLCB0aGlzLm9uUHJvdG9Db25uZWN0aW9uTWVzc2FnZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLnByb3RvQ29ubmVjdGlvbiA9IHByb3RvQ29ubmVjdGlvbjtcblx0dGhpcy5uZXRQb2tlckNsaWVudFZpZXcuY2xlYXIoKTtcblxuXHRpZiAodGhpcy5wcm90b0Nvbm5lY3Rpb24pIHtcblx0XHR0aGlzLnByb3RvQ29ubmVjdGlvbi5vbihQcm90b0Nvbm5lY3Rpb24uTUVTU0FHRSwgdGhpcy5vblByb3RvQ29ubmVjdGlvbk1lc3NhZ2UsIHRoaXMpO1xuXHR9XG59XG5cbi8qKlxuICogSW5jb21pbmcgbWVzc2FnZS5cbiAqIEVucXVldWUgZm9yIHByb2Nlc3NpbmcuXG4gKsKgQG1ldGhvZCBvblByb3RvQ29ubmVjdGlvbk1lc3NhZ2VcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50Q29udHJvbGxlci5wcm90b3R5cGUub25Qcm90b0Nvbm5lY3Rpb25NZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuZW5xdWV1ZShlLm1lc3NhZ2UpO1xufVxuXG4vKipcbiAqIEJ1dHRvbiBjbGljay5cbiAqIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyBjbGlja3MgZnJvbSBib3RoIHRoZSBkaWFsb2cgYW5kIGdhbWUgcGxheSBidXR0b25zLlxuICogQG1ldGhvZCBvbkJ1dHRvbkNsaWNrXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudENvbnRyb2xsZXIucHJvdG90eXBlLm9uQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG5cdGlmICghdGhpcy5wcm90b0Nvbm5lY3Rpb24pXG5cdFx0cmV0dXJuO1xuXG5cdGNvbnNvbGUubG9nKFwiYnV0dG9uIGNsaWNrLCB2PVwiICsgZS52YWx1ZSk7XG5cblx0dmFyIG0gPSBuZXcgQnV0dG9uQ2xpY2tNZXNzYWdlKGUuYnV0dG9uLCBlLnZhbHVlKTtcblx0dGhpcy5wcm90b0Nvbm5lY3Rpb24uc2VuZChtKTtcbn1cblxuLyoqXG4gKiBTZWF0IGNsaWNrLlxuICogQG1ldGhvZCBvblNlYXRDbGlja1xuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnByb3RvdHlwZS5vblNlYXRDbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIG0gPSBuZXcgU2VhdENsaWNrTWVzc2FnZShlLnNlYXRJbmRleCk7XG5cdHRoaXMucHJvdG9Db25uZWN0aW9uLnNlbmQobSk7XG59XG5cbi8qKlxuICogT24gc2VuZCBjaGF0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uVmlld0NoYXRcbiAqL1xuTmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnByb3RvdHlwZS5vblZpZXdDaGF0ID0gZnVuY3Rpb24odGV4dCkge1xuXHR2YXIgbWVzc2FnZSA9IG5ldyBDaGF0TWVzc2FnZSgpO1xuXHRtZXNzYWdlLnVzZXIgPSBcIlwiO1xuXHRtZXNzYWdlLnRleHQgPSB0ZXh0O1xuXG5cdHRoaXMucHJvdG9Db25uZWN0aW9uLnNlbmQobWVzc2FnZSk7XG59XG5cbi8qKlxuICogT24gYnV5IGNoaXBzIGJ1dHRvbiBjbGljay5cbiAqIEBtZXRob2Qgb25CdXlDaGlwc0J1dHRvbkNsaWNrXG4gKi9cbk5ldFBva2VyQ2xpZW50Q29udHJvbGxlci5wcm90b3R5cGUub25CdXlDaGlwc0J1dHRvbkNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiYnV5IGNoaXBzIGNsaWNrXCIpO1xuXG5cdHRoaXMucHJvdG9Db25uZWN0aW9uLnNlbmQobmV3IEJ1dHRvbkNsaWNrTWVzc2FnZShCdXR0b25EYXRhLkJVWV9DSElQUykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ldFBva2VyQ2xpZW50Q29udHJvbGxlcjsiLCJ2YXIgU2VhdEluZm9NZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL1NlYXRJbmZvTWVzc2FnZVwiKTtcbnZhciBDb21tdW5pdHlDYXJkc01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvQ29tbXVuaXR5Q2FyZHNNZXNzYWdlXCIpO1xudmFyIFBvY2tldENhcmRzTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9Qb2NrZXRDYXJkc01lc3NhZ2VcIik7XG52YXIgRGVhbGVyQnV0dG9uTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9EZWFsZXJCdXR0b25NZXNzYWdlXCIpO1xudmFyIEJldE1lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvQmV0TWVzc2FnZVwiKTtcbnZhciBCZXRzVG9Qb3RNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0JldHNUb1BvdE1lc3NhZ2VcIik7XG52YXIgUG90TWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9Qb3RNZXNzYWdlXCIpO1xudmFyIFRpbWVyTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9UaW1lck1lc3NhZ2VcIik7XG52YXIgQWN0aW9uTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9BY3Rpb25NZXNzYWdlXCIpO1xudmFyIEZvbGRDYXJkc01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvRm9sZENhcmRzTWVzc2FnZVwiKTtcbnZhciBEZWxheU1lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvRGVsYXlNZXNzYWdlXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgQ2xlYXJNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0NsZWFyTWVzc2FnZVwiKTtcbnZhciBQYXlPdXRNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL1BheU91dE1lc3NhZ2VcIik7XG5cbi8qKlxuICogQ29udHJvbCB0aGUgdGFibGVcbiAqIEBjbGFzcyBUYWJsZUNvbnRyb2xsZXJcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIFRhYmxlQ29udHJvbGxlcihtZXNzYWdlU2VxdWVuY2VyLCB2aWV3KSB7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlciA9IG1lc3NhZ2VTZXF1ZW5jZXI7XG5cdHRoaXMudmlldyA9IHZpZXc7XG5cblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKFNlYXRJbmZvTWVzc2FnZS5UWVBFLCB0aGlzLm9uU2VhdEluZm9NZXNzYWdlLCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKENvbW11bml0eUNhcmRzTWVzc2FnZS5UWVBFLCB0aGlzLm9uQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKFBvY2tldENhcmRzTWVzc2FnZS5UWVBFLCB0aGlzLm9uUG9ja2V0Q2FyZHNNZXNzYWdlLCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKERlYWxlckJ1dHRvbk1lc3NhZ2UuVFlQRSwgdGhpcy5vbkRlYWxlckJ1dHRvbk1lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoQmV0TWVzc2FnZS5UWVBFLCB0aGlzLm9uQmV0TWVzc2FnZSwgdGhpcyk7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihCZXRzVG9Qb3RNZXNzYWdlLlRZUEUsIHRoaXMub25CZXRzVG9Qb3QsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoUG90TWVzc2FnZS5UWVBFLCB0aGlzLm9uUG90LCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKFRpbWVyTWVzc2FnZS5UWVBFLCB0aGlzLm9uVGltZXIsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoQWN0aW9uTWVzc2FnZS5UWVBFLCB0aGlzLm9uQWN0aW9uLCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKEZvbGRDYXJkc01lc3NhZ2UuVFlQRSwgdGhpcy5vbkZvbGRDYXJkcywgdGhpcyk7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihEZWxheU1lc3NhZ2UuVFlQRSwgdGhpcy5vbkRlbGF5LCB0aGlzKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLmFkZE1lc3NhZ2VIYW5kbGVyKENsZWFyTWVzc2FnZS5UWVBFLCB0aGlzLm9uQ2xlYXIsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoUGF5T3V0TWVzc2FnZS5UWVBFLCB0aGlzLm9uUGF5T3V0LCB0aGlzKTtcbn1cbkV2ZW50RGlzcGF0Y2hlci5pbml0KFRhYmxlQ29udHJvbGxlcik7XG5cbi8qKlxuICogU2VhdCBpbmZvIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uU2VhdEluZm9NZXNzYWdlXG4gKi9cblRhYmxlQ29udHJvbGxlci5wcm90b3R5cGUub25TZWF0SW5mb01lc3NhZ2UgPSBmdW5jdGlvbihtKSB7XG5cdHZhciBzZWF0VmlldyA9IHRoaXMudmlldy5nZXRTZWF0Vmlld0J5SW5kZXgobS5nZXRTZWF0SW5kZXgoKSk7XG5cblx0c2VhdFZpZXcuc2V0TmFtZShtLmdldE5hbWUoKSk7XG5cdHNlYXRWaWV3LnNldENoaXBzKG0uZ2V0Q2hpcHMoKSk7XG5cdHNlYXRWaWV3LnNldEFjdGl2ZShtLmlzQWN0aXZlKCkpO1xuXHRzZWF0Vmlldy5zZXRTaXRvdXQobS5pc1NpdG91dCgpKTtcbn1cblxuLyoqXG4gKiBTZWF0IGluZm8gbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25Db21tdW5pdHlDYXJkc01lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vbkNvbW11bml0eUNhcmRzTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIGk7XG5cblx0Y29uc29sZS5sb2coXCJnb3QgY29tbXVuaXR5IGNhcmRzIVwiKTtcblx0Y29uc29sZS5sb2cobSk7XG5cblx0Zm9yIChpID0gMDsgaSA8IG0uZ2V0Q2FyZHMoKS5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjYXJkRGF0YSA9IG0uZ2V0Q2FyZHMoKVtpXTtcblx0XHR2YXIgY2FyZFZpZXcgPSB0aGlzLnZpZXcuZ2V0Q29tbXVuaXR5Q2FyZHMoKVttLmdldEZpcnN0SW5kZXgoKSArIGldO1xuXG5cdFx0Y2FyZFZpZXcuc2V0Q2FyZERhdGEoY2FyZERhdGEpO1xuXHRcdGNhcmRWaWV3LnNob3cobS5hbmltYXRlLCBpICogNTAwKTtcblx0fVxuXHRpZiAobS5nZXRDYXJkcygpLmxlbmd0aCA+IDApIHtcblx0XHR2YXIgY2FyZERhdGEgPSBtLmdldENhcmRzKClbbS5nZXRDYXJkcygpLmxlbmd0aCAtIDFdO1xuXHRcdHZhciBjYXJkVmlldyA9IHRoaXMudmlldy5nZXRDb21tdW5pdHlDYXJkcygpW20uZ2V0Rmlyc3RJbmRleCgpICsgbS5nZXRDYXJkcygpLmxlbmd0aCAtIDFdO1xuXHRcdGlmKG0uYW5pbWF0ZSlcblx0XHRcdHRoaXMubWVzc2FnZVNlcXVlbmNlci53YWl0Rm9yKGNhcmRWaWV3LCBcImFuaW1hdGlvbkRvbmVcIik7XG5cdH1cbn1cblxuLyoqXG4gKiBQb2NrZXQgY2FyZHMgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25Qb2NrZXRDYXJkc01lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vblBvY2tldENhcmRzTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIHNlYXRWaWV3ID0gdGhpcy52aWV3LmdldFNlYXRWaWV3QnlJbmRleChtLmdldFNlYXRJbmRleCgpKTtcblx0dmFyIGk7XG5cblx0Zm9yIChpID0gMDsgaSA8IG0uZ2V0Q2FyZHMoKS5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjYXJkRGF0YSA9IG0uZ2V0Q2FyZHMoKVtpXTtcblx0XHR2YXIgY2FyZFZpZXcgPSBzZWF0Vmlldy5nZXRQb2NrZXRDYXJkcygpW20uZ2V0Rmlyc3RJbmRleCgpICsgaV07XG5cblx0XHRpZihtLmFuaW1hdGUpXG5cdFx0XHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIud2FpdEZvcihjYXJkVmlldywgXCJhbmltYXRpb25Eb25lXCIpO1xuXHRcdGNhcmRWaWV3LnNldENhcmREYXRhKGNhcmREYXRhKTtcblx0XHRjYXJkVmlldy5zaG93KG0uYW5pbWF0ZSwgMTApO1xuXHR9XG59XG5cbi8qKlxuICogRGVhbGVyIGJ1dHRvbiBtZXNzYWdlLlxuICogQG1ldGhvZCBvbkRlYWxlckJ1dHRvbk1lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vbkRlYWxlckJ1dHRvbk1lc3NhZ2UgPSBmdW5jdGlvbihtKSB7XG5cdHZhciBkZWFsZXJCdXR0b25WaWV3ID0gdGhpcy52aWV3LmdldERlYWxlckJ1dHRvblZpZXcoKTtcblxuXHRpZiAobS5zZWF0SW5kZXggPCAwKSB7XG5cdFx0ZGVhbGVyQnV0dG9uVmlldy5oaWRlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLndhaXRGb3IoZGVhbGVyQnV0dG9uVmlldywgXCJhbmltYXRpb25Eb25lXCIpO1xuXHRcdGRlYWxlckJ1dHRvblZpZXcuc2hvdyhtLmdldFNlYXRJbmRleCgpLCBtLmdldEFuaW1hdGUoKSk7XG5cdH1cbn07XG5cbi8qKlxuICogQmV0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQmV0TWVzc2FnZVxuICovXG5UYWJsZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQmV0TWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dGhpcy52aWV3LnNlYXRWaWV3c1ttLnNlYXRJbmRleF0uYmV0Q2hpcHMuc2V0VmFsdWUobS52YWx1ZSk7XG59O1xuXG4vKipcbiAqIEJldHMgdG8gcG90LlxuICogQG1ldGhvZCBvbkJldHNUb1BvdFxuICovXG5UYWJsZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQmV0c1RvUG90ID0gZnVuY3Rpb24obSkge1xuXHR2YXIgaGF2ZUNoaXBzID0gZmFsc2U7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZpZXcuc2VhdFZpZXdzLmxlbmd0aDsgaSsrKVxuXHRcdGlmICh0aGlzLnZpZXcuc2VhdFZpZXdzW2ldLmJldENoaXBzLnZhbHVlID4gMClcblx0XHRcdGhhdmVDaGlwcyA9IHRydWU7XG5cblx0aWYgKCFoYXZlQ2hpcHMpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52aWV3LnNlYXRWaWV3cy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLnZpZXcuc2VhdFZpZXdzW2ldLmJldENoaXBzLmFuaW1hdGVJbigpO1xuXG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci53YWl0Rm9yKHRoaXMudmlldy5zZWF0Vmlld3NbMF0uYmV0Q2hpcHMsIFwiYW5pbWF0aW9uRG9uZVwiKTtcbn1cblxuLyoqXG4gKiBQb3QgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25Qb3RcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vblBvdCA9IGZ1bmN0aW9uKG0pIHtcblx0dGhpcy52aWV3LnBvdFZpZXcuc2V0VmFsdWVzKG0udmFsdWVzKTtcbn07XG5cbi8qKlxuICogVGltZXIgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25UaW1lclxuICovXG5UYWJsZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uVGltZXIgPSBmdW5jdGlvbihtKSB7XG5cdGlmIChtLnNlYXRJbmRleCA8IDApXG5cdFx0dGhpcy52aWV3LnRpbWVyVmlldy5oaWRlKCk7XG5cblx0ZWxzZSB7XG5cdFx0dGhpcy52aWV3LnRpbWVyVmlldy5zaG93KG0uc2VhdEluZGV4KTtcblx0XHR0aGlzLnZpZXcudGltZXJWaWV3LmNvdW50ZG93bihtLnRvdGFsVGltZSwgbS50aW1lTGVmdCk7XG5cdH1cbn07XG5cbi8qKlxuICogQWN0aW9uIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQWN0aW9uXG4gKi9cblRhYmxlQ29udHJvbGxlci5wcm90b3R5cGUub25BY3Rpb24gPSBmdW5jdGlvbihtKSB7XG5cdGlmIChtLnNlYXRJbmRleCA9PSBudWxsKVxuXHRcdG0uc2VhdEluZGV4ID0gMDtcblxuXHR0aGlzLnZpZXcuc2VhdFZpZXdzW20uc2VhdEluZGV4XS5hY3Rpb24obS5hY3Rpb24pO1xufTtcblxuLyoqXG4gKiBGb2xkIGNhcmRzIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uRm9sZENhcmRzXG4gKi9cblRhYmxlQ29udHJvbGxlci5wcm90b3R5cGUub25Gb2xkQ2FyZHMgPSBmdW5jdGlvbihtKSB7XG5cdHRoaXMudmlldy5zZWF0Vmlld3NbbS5zZWF0SW5kZXhdLmZvbGRDYXJkcygpO1xuXG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci53YWl0Rm9yKHRoaXMudmlldy5zZWF0Vmlld3NbbS5zZWF0SW5kZXhdLCBcImFuaW1hdGlvbkRvbmVcIik7XG59O1xuXG4vKipcbiAqIERlbGF5IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uRGVsYXlcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vbkRlbGF5ID0gZnVuY3Rpb24obSkge1xuXHRjb25zb2xlLmxvZyhcImRlbGF5IGZvciAgPSBcIiArIG0uZGVsYXkpO1xuXG5cblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLndhaXRGb3IodGhpcywgXCJ0aW1lckRvbmVcIik7XG5cdHNldFRpbWVvdXQodGhpcy5kaXNwYXRjaEV2ZW50LmJpbmQodGhpcywgXCJ0aW1lckRvbmVcIiksIG0uZGVsYXkpO1xuXG59O1xuXG4vKipcbiAqIENsZWFyIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQ2xlYXJcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vbkNsZWFyID0gZnVuY3Rpb24obSkge1xuXG5cdHZhciBjb21wb25lbnRzID0gbS5nZXRDb21wb25lbnRzKCk7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRzd2l0Y2goY29tcG9uZW50c1tpXSkge1xuXHRcdFx0Y2FzZSBDbGVhck1lc3NhZ2UuUE9UOiB7XG5cdFx0XHRcdHRoaXMudmlldy5wb3RWaWV3LnNldFZhbHVlcyhbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBDbGVhck1lc3NhZ2UuQkVUUzoge1xuXHRcdFx0XHRmb3IodmFyIHMgPSAwOyBzIDwgdGhpcy52aWV3LnNlYXRWaWV3cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0XHRcdHRoaXMudmlldy5zZWF0Vmlld3Nbc10uYmV0Q2hpcHMuc2V0VmFsdWUoMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIENsZWFyTWVzc2FnZS5DQVJEUzoge1xuXHRcdFx0XHRmb3IodmFyIHMgPSAwOyBzIDwgdGhpcy52aWV3LnNlYXRWaWV3cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0XHRcdGZvcih2YXIgYyA9IDA7IGMgPCB0aGlzLnZpZXcuc2VhdFZpZXdzW3NdLnBvY2tldENhcmRzLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZpZXcuc2VhdFZpZXdzW3NdLnBvY2tldENhcmRzW2NdLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IodmFyIGMgPSAwOyBjIDwgdGhpcy52aWV3LmNvbW11bml0eUNhcmRzLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdFx0dGhpcy52aWV3LmNvbW11bml0eUNhcmRzW2NdLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgQ2xlYXJNZXNzYWdlLkNIQVQ6IHtcblx0XHRcdFx0dGhpcy52aWV3LmNoYXRWaWV3LmNsZWFyKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFBheSBvdXQgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25QYXlPdXRcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vblBheU91dCA9IGZ1bmN0aW9uKG0pIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtLnZhbHVlcy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLnZpZXcuc2VhdFZpZXdzW2ldLmJldENoaXBzLnNldFZhbHVlKG0udmFsdWVzW2ldKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmlldy5zZWF0Vmlld3MubGVuZ3RoOyBpKyspXG5cdFx0dGhpcy52aWV3LnNlYXRWaWV3c1tpXS5iZXRDaGlwcy5hbmltYXRlT3V0KCk7XG5cblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLndhaXRGb3IodGhpcy52aWV3LnNlYXRWaWV3c1swXS5iZXRDaGlwcywgXCJhbmltYXRpb25Eb25lXCIpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQ29udHJvbGxlcjsiLCJOZXRQb2tlckNsaWVudCA9IHJlcXVpcmUoXCIuL2FwcC9OZXRQb2tlckNsaWVudFwiKTtcbi8vdmFyIG5ldFBva2VyQ2xpZW50ID0gbmV3IE5ldFBva2VyQ2xpZW50KCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0dGV4dHVyZXM6IFtcblx0XHR7XG5cdFx0XHRpZDogXCJjb21wb25lbnRzVGV4dHVyZVwiLFxuXHRcdFx0ZmlsZTogXCJjb21wb25lbnRzLnBuZ1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRpZDogXCJ0YWJsZUJhY2tncm91bmRcIixcblx0XHRcdGZpbGU6IFwidGFibGUucG5nXCJcblx0XHR9XG5cdF0sXG5cdHRhYmxlQmFja2dyb3VuZDogXCJ0YWJsZUJhY2tncm91bmRcIixcblx0ZGVmYXVsdFRleHR1cmU6IFwiY29tcG9uZW50c1RleHR1cmVcIixcblxuXHRzZWF0UG9zaXRpb25zOiBbXG5cdFx0WzI4NywgMTE4XSwgWzQ4MywgMTEyXSwgWzY3NiwgMTE4XSxcblx0XHRbODQ0LCAyNDddLCBbODE3LCA0MTNdLCBbNjc2LCA0OTBdLFxuXHRcdFs0ODMsIDQ5NV0sIFsyODcsIDQ5MF0sIFsxNDAsIDQxM10sXG5cdFx0WzEyMywgMjQ3XVxuXHRdLFxuXG5cdHRpbWVyQmFja2dyb3VuZDogWzEyMSwyMDAsMzIsMzJdLFxuXG5cdHNlYXRQbGF0ZTogWzQwLCAxMTYsIDE2MCwgNzBdLFxuXG5cdGNvbW11bml0eUNhcmRzUG9zaXRpb246IFsyNTUsIDE5MF0sXG5cblx0Y2FyZEZyYW1lOiBbNDk4LCAyNTYsIDg3LCAxMjJdLFxuXHRjYXJkQmFjazogWzQwMiwgMjU2LCA4NywgMTIyXSxcblxuXHRkaXZpZGVyTGluZTogWzU2OCwgNzcsIDIsIDE3MF0sXG5cblx0c3VpdFN5bWJvbHM6IFtcblx0XHRbMjQ2LCA2NywgMTgsIDE5XSxcblx0XHRbMjY5LCA2NywgMTgsIDE5XSxcblx0XHRbMjkyLCA2NywgMTgsIDE5XSxcblx0XHRbMzE1LCA2NywgMTgsIDE5XVxuXHRdLFxuXG5cdGZyYW1lUGxhdGU6IFszMDEsIDI2MiwgNzQsIDc2XSxcblx0YmlnQnV0dG9uOiBbMzMsIDI5OCwgOTUsIDk0XSxcblx0ZGlhbG9nQnV0dG9uOiBbMzgzLCA0NjEsIDgyLCA0N10sXG5cdGRlYWxlckJ1dHRvbjogWzE5NywgMjM2LCA0MSwgMzVdLFxuXG5cdGRlYWxlckJ1dHRvblBvc2l0aW9uczogW1xuXHRcdFszNDcsIDEzM10sIFszOTUsIDEzM10sIFs1NzQsIDEzM10sXG5cdFx0Wzc2MiwgMjY3XSwgWzcxNSwgMzU4XSwgWzU3NCwgNDM0XSxcblx0XHRbNTM2LCA0MzJdLCBbMzUxLCA0MzJdLCBbMTkzLCAzNjJdLFxuXHRcdFsxNjgsIDI2Nl1cblx0XSxcblxuXHR0ZXh0U2Nyb2xsYmFyVHJhY2s6IFszNzEsNTAsNjAsMTBdLFxuXHR0ZXh0U2Nyb2xsYmFyVGh1bWI6IFszNzEsMzIsNjAsMTBdLFxuXG5cblx0YmV0QWxpZ246IFtcblx0XHRcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJyaWdodFwiLFxuXHRcdFwicmlnaHRcIiwgXCJyaWdodFwiLCBcblx0XHRcInJpZ2h0XCIsIFwiY2VudGVyXCIsIFwibGVmdFwiLFxuXHRcdFwibGVmdFwiLCBcImxlZnRcIlxuXHRdLFxuXG5cdGJldFBvc2l0aW9uczogW1xuXHRcdFsyMjUsMTUwXSwgWzQ3OCwxNTBdLCBbNzMwLDE1MF0sXG5cdFx0Wzc3OCwxOTZdLCBbNzQ4LDMyMl0sIFs3MTksMzYwXSxcblx0XHRbNDgxLDM2MF0sIFsyMzIsMzYwXSwgWzE5OSwzMjJdLFxuXHRcdFsxODEsMjAwXVxuXHRdLFxuXHRjaGlwczogW1xuXHRcdFszMCwgMjUsIDQwLCAzMF0sXG5cdFx0WzcwLCAyNSwgNDAsIDMwXSxcblx0XHRbMTEwLCAyNSwgNDAsIDMwXSxcblx0XHRbMTUwLCAyNSwgNDAsIDMwXSxcblx0XHRbMTkwLCAyNSwgNDAsIDMwXVxuXHRdLFxuXHRjaGlwc0NvbG9yczogWzB4NDA0MDQwLCAweDAwODAwMCwgMHg4MDgwMDAsIDB4MDAwMDgwLCAweGZmMDAwMF0sXG5cdHBvdFBvc2l0aW9uOiBbNDg1LDMxNV0sXG5cdHdyZW5jaEljb246IFs0NjIsMzg5LDIxLDIxXSxcblx0Y2hhdEJhY2tncm91bmQ6IFszMDEsMjYyLDc0LDc2XSxcblx0Y2hlY2tib3hCYWNrZ3JvdW5kOiBbNTAxLDM5MSwxOCwxOF0sXG5cdGNoZWNrYm94VGljazogWzUyOCwzOTIsMjEsMTZdLFxuXHRidXR0b25CYWNrZ3JvdW5kOiBbNjgsNDQ2LDY0LDY0XSxcblx0c2xpZGVyQmFja2dyb3VuZDogWzMxMyw0MDcsMTIwLDMwXSxcblx0c2xpZGVyS25vYjogWzMxOCwzNzcsMjgsMjhdLFxuXHRiaWdCdXR0b25Qb3NpdGlvbjogWzM2Niw1NzVdLFxuXHR1cEFycm93OiBbNDgzLDY0LDEyLDhdXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgUG9pbnQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvUG9pbnRcIik7XG52YXIgRGVmYXVsdFNraW4gPSByZXF1aXJlKFwiLi9EZWZhdWx0U2tpblwiKTtcblxuLyoqXG4gKiBDbGllbnQgcmVzb3VyY2VzXG4gKiBAY2xhc3MgUmVzb3VyY2VzLlxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VzKCkge1xuXHR2YXIgaTtcblxuXHR0aGlzLmRlZmF1bHRTa2luID0gRGVmYXVsdFNraW47XG5cdHRoaXMuc2tpbiA9IG51bGw7XG5cblxuXHQgdGhpcy5BbGlnbiA9IHtcblx0IFx0TGVmdDogXCJsZWZ0XCIsXG5cdCBcdFJpZ2h0OiBcInJpZ2h0XCIsXG5cdCBcdENlbnRlcjogXCJjZW50ZXJcIlxuXHQgfTtcblxuXHQgdGhpcy50ZXh0dXJlcyA9IHt9O1xuLypcblx0dGhpcy5jb21wb25lbnRzVGV4dHVyZSA9IG5ldyBQSVhJLlRleHR1cmUuZnJvbUltYWdlKFwiY29tcG9uZW50cy5wbmdcIik7XG5cdHRoaXMudGFibGVCYWNrZ3JvdW5kID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInRhYmxlLnBuZ1wiKTtcblxuXHR0aGlzLnNlYXRQb3NpdGlvbnMgPSBbXG5cdFx0UG9pbnQoMjg3LCAxMTgpLCBQb2ludCg0ODMsIDExMiksIFBvaW50KDY3NiwgMTE4KSxcblx0XHRQb2ludCg4NDQsIDI0NyksIFBvaW50KDgxNywgNDEzKSwgUG9pbnQoNjc2LCA0OTApLFxuXHRcdFBvaW50KDQ4MywgNDk1KSwgUG9pbnQoMjg3LCA0OTApLCBQb2ludCgxNDAsIDQxMyksXG5cdFx0UG9pbnQoMTIzLCAyNDcpXG5cdF07XG5cblx0dGhpcy50aW1lckJhY2tncm91bmQgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDEyMSwyMDAsMzIsMzIpOyBcblxuXHR0aGlzLnNlYXRQbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoNDAsIDExNiwgMTYwLCA3MCk7XG5cblx0dGhpcy5jb21tdW5pdHlDYXJkc1Bvc2l0aW9uID0gUG9pbnQoMjU1LCAxOTApO1xuXG5cdHRoaXMuY2FyZEZyYW1lID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCg0OTgsIDI1NiwgODcsIDEyMik7XG5cdHRoaXMuY2FyZEJhY2sgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDQwMiwgMjU2LCA4NywgMTIyKTtcblxuXHR0aGlzLmRpdmlkZXJMaW5lID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCg1NjgsIDc3LCAyLCAxNzApO1xuXG5cdHRoaXMuc3VpdFN5bWJvbHMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IDQ7IGkrKylcblx0XHR0aGlzLnN1aXRTeW1ib2xzLnB1c2godGhpcy5nZXRDb21wb25lbnRzUGFydCgyNDYgKyBpICogMjMsIDY3LCAxOCwgMTkpKTtcblxuXHR0aGlzLmZyYW1lUGxhdGUgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDMwMSwgMjYyLCA3NCwgNzYpO1xuXHR0aGlzLmJpZ0J1dHRvbiA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoMzMsIDI5OCwgOTUsIDk0KTtcblx0dGhpcy5kaWFsb2dCdXR0b24gPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDM4MywgNDYxLCA4MiwgNDcpO1xuXHR0aGlzLmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoMTk3LCAyMzYsIDQxLCAzNSk7XG5cblx0dGhpcy5kZWFsZXJCdXR0b25Qb3NpdGlvbnMgPSBbXG5cdFx0UG9pbnQoMzQ3LCAxMzMpLCBQb2ludCgzOTUsIDEzMyksIFBvaW50KDU3NCwgMTMzKSxcblx0XHRQb2ludCg3NjIsIDI2NyksIFBvaW50KDcxNSwgMzU4KSwgUG9pbnQoNTc0LCA0MzQpLFxuXHRcdFBvaW50KDUzNiwgNDMyKSwgUG9pbnQoMzUxLCA0MzIpLCBQb2ludCgxOTMsIDM2MiksXG5cdFx0UG9pbnQoMTY4LCAyNjYpXG5cdF07XG5cblx0dGhpcy50ZXh0U2Nyb2xsYmFyVHJhY2sgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDM3MSw1MCw2MCwxMCk7XG5cdHRoaXMudGV4dFNjcm9sbGJhclRodW1iID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCgzNzEsMzIsNjAsMTApO1xuXG5cdCB0aGlzLkFsaWduID0ge1xuXHQgXHRMZWZ0OiBcImxlZnRcIixcblx0IFx0UmlnaHQ6IFwicmlnaHRcIixcblx0IFx0Q2VudGVyOiBcImNlbnRlclwiLFxuXHQgfTtcblxuXHR0aGlzLmJldEFsaWduID0gW1xuXHRcdFx0dGhpcy5BbGlnbi5MZWZ0LCB0aGlzLkFsaWduLkNlbnRlciwgdGhpcy5BbGlnbi5SaWdodCxcblx0XHRcdHRoaXMuQWxpZ24uUmlnaHQsIHRoaXMuQWxpZ24uUmlnaHQsIFxuXHRcdFx0dGhpcy5BbGlnbi5SaWdodCwgdGhpcy5BbGlnbi5DZW50ZXIsIHRoaXMuQWxpZ24uTGVmdCxcblx0XHRcdHRoaXMuQWxpZ24uTGVmdCwgdGhpcy5BbGlnbi5MZWZ0XG5cdFx0XTtcblxuXHR0aGlzLmJldFBvc2l0aW9ucyA9IFtcblx0XHRcdFBvaW50KDIyNSwxNTApLCBQb2ludCg0NzgsMTUwKSwgUG9pbnQoNzMwLDE1MCksXG5cdFx0XHRQb2ludCg3NzgsMTk2KSwgUG9pbnQoNzQ4LDMyMiksIFBvaW50KDcxOSwzNjApLFxuXHRcdFx0UG9pbnQoNDgxLDM2MCksIFBvaW50KDIzMiwzNjApLCBQb2ludCgxOTksMzIyKSxcblx0XHRcdFBvaW50KDE4MSwyMDApXG5cdFx0XTtcblxuXHR0aGlzLmNoaXBzID0gbmV3IEFycmF5KCk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG5cdFx0dmFyIGIgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDMwICsgaSo0MCwgMjUsIDQwLCAzMCk7XG5cdFx0dGhpcy5jaGlwcy5wdXNoKGIpO1xuXHR9XG5cblx0dGhpcy5jaGlwc0NvbG9ycyA9IFsweDQwNDA0MCwgMHgwMDgwMDAsIDB4ODA4MDAwLCAweDAwMDA4MCwgMHhmZjAwMDBdO1xuXG5cdHRoaXMucG90UG9zaXRpb24gPSBQb2ludCg0ODUsMzE1KTtcblx0Ki9cbn1cblxuLyoqXG4gKiBHZXQgdmFsdWUgZnJvbSBlaXRoZXIgbG9hZGVkIHNraW4gb3IgZGVmYXVsdCBza2luLlxuICogQG1ldGhvZCBnZXRWYWx1ZVxuICovXG5SZXNvdXJjZXMucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oa2V5KSB7XG5cdHZhciB2YWx1ZSA9IG51bGw7XG5cblx0aWYoKHRoaXMuc2tpbiAhPSBudWxsKSAmJiAodGhpcy5za2luW2tleV0gIT0gbnVsbCkpXG5cdFx0dmFsdWUgPSB0aGlzLnNraW5ba2V5XTtcblx0ZWxzZVxuXHRcdHZhbHVlID0gdGhpcy5kZWZhdWx0U2tpbltrZXldO1xuXG5cdGlmKHZhbHVlID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNraW4ga2V5OiBcIiArIGtleSk7XG5cdH0gXG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIEdldCBwb2ludCBmcm9tIGVpdGhlciBsb2FkZWQgc2tpbiBvciBkZWZhdWx0IHNraW4uXG4gKiBAbWV0aG9kIGdldFBvaW50XG4gKi9cblJlc291cmNlcy5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihrZXkpIHtcblx0dmFyIHZhbHVlID0gbnVsbDtcblxuXHRpZigodGhpcy5za2luICE9IG51bGwpICYmICh0aGlzLnNraW5ba2V5XSAhPSBudWxsKSlcblx0XHR2YWx1ZSA9IFBvaW50KHRoaXMuc2tpbltrZXldWzBdLCB0aGlzLnNraW5ba2V5XVsxXSk7XG5cdGVsc2Vcblx0XHR2YWx1ZSA9IFBvaW50KHRoaXMuZGVmYXVsdFNraW5ba2V5XVswXSwgdGhpcy5kZWZhdWx0U2tpbltrZXldWzFdKTtcblxuXHRpZih2YWx1ZSA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBza2luIGtleTogXCIgKyBrZXkpO1xuXHR9IFxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXQgcG9pbnRzIGZyb20gZWl0aGVyIGxvYWRlZCBza2luIG9yIGRlZmF1bHQgc2tpbi5cbiAqIEBtZXRob2QgZ2V0UG9pbnRzXG4gKi9cblJlc291cmNlcy5wcm90b3R5cGUuZ2V0UG9pbnRzID0gZnVuY3Rpb24oa2V5KSB7XG5cdHZhciB2YWx1ZXMgPSBudWxsO1xuXG5cdHZhciBwb2ludHMgPSBuZXcgQXJyYXkoKTtcblxuXHRpZigodGhpcy5za2luICE9IG51bGwpICYmICh0aGlzLnNraW5ba2V5XSAhPSBudWxsKSlcblx0XHR2YWx1ZXMgPSB0aGlzLnNraW5ba2V5XTtcblx0ZWxzZVxuXHRcdHZhbHVlcyA9IHRoaXMuZGVmYXVsdFNraW5ba2V5XTtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0cG9pbnRzLnB1c2goUG9pbnQodmFsdWVzW2ldWzBdLCB2YWx1ZXNbaV1bMV0pKTtcblx0fVxuXG5cdGlmKHBvaW50cy5sZW5ndGggPD0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2tpbiBrZXk6IFwiICsga2V5KTtcblx0fSBcblxuXHRyZXR1cm4gcG9pbnRzO1xufVxuXG4vKipcbiAqIEdldCB0ZXh0dXJlIGZyb20gZWl0aGVyIGxvYWRlZCBza2luIG9yIGRlZmF1bHQgc2tpbi5cbiAqIEBtZXRob2QgZ2V0VGV4dHVyZVxuICovXG5SZXNvdXJjZXMucHJvdG90eXBlLmdldFRleHR1cmUgPSBmdW5jdGlvbihrZXksIGluZGV4KSB7XG5cdHZhciB2YWx1ZSA9IG51bGw7XG5cdHZhciBpc0RlZmF1bHQgPSBmYWxzZTtcblx0dmFyIHRleHR1cmUgPSBudWxsO1xuXHR2YXIgZnJhbWUgPSBudWxsO1xuXG5cblx0aWYoKHRoaXMuc2tpbiAhPSBudWxsKSAmJiAodGhpcy5za2luW2tleV0gIT0gbnVsbCkpIHtcblx0XHR2YWx1ZSA9IHRoaXMuc2tpbltrZXldO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHZhbHVlID0gdGhpcy5kZWZhdWx0U2tpbltrZXldO1xuXHRcdGlzRGVmYXVsdCA9IHRydWU7XG5cdH1cbi8vXHRjb25zb2xlLmxvZyhcInZhbHVlID0gXCIgKyB2YWx1ZSArIFwiLCBrZXkgPSBcIiAra2V5KTtcblxuXG5cdGlmKHZhbHVlLnRleHR1cmUgIT0gbnVsbCkge1xuXHRcdHRleHR1cmUgPSB2YWx1ZS50ZXh0dXJlO1xuXHR9XG5cdGVsc2UgaWYoIWlzRGVmYXVsdCAmJiAodGhpcy5za2luLmRlZmF1bHRUZXh0dXJlICE9IG51bGwpKSB7XG5cdFx0dGV4dHVyZSA9IHRoaXMuc2tpbi5kZWZhdWx0VGV4dHVyZTtcblx0fVxuXHRlbHNlIHtcblx0XHR0ZXh0dXJlID0gdGhpcy5kZWZhdWx0U2tpbi5kZWZhdWx0VGV4dHVyZTtcblx0fVxuXG5cdGlmKHZhbHVlLmNvb3JkcyAhPSBudWxsKSB7XG5cdFx0ZnJhbWUgPSB2YWx1ZS5jb29yZHM7XG5cdH1cblx0ZWxzZSBpZih0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHR0ZXh0dXJlID0gdmFsdWU7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZnJhbWUgPSB2YWx1ZTtcblx0fVxuXG5cdGlmKHRleHR1cmUgIT0gbnVsbCkge1xuXHRcdGlmKGZyYW1lICE9IG51bGwpXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRDb21wb25lbnRzUGFydCh0ZXh0dXJlLCBmcmFtZVswXSwgZnJhbWVbMV0sIGZyYW1lWzJdLCBmcmFtZVszXSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQodGV4dHVyZSwgZnJhbWUpO1xuXHR9XG5cblxuXHRcblx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBza2luIGtleTogXCIgKyBrZXkpO1xuXHRcblx0cmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogR2V0IHRleHR1cmVzIGZyb20gZWl0aGVyIGxvYWRlZCBza2luIG9yIGRlZmF1bHQgc2tpbi5cbiAqIEBtZXRob2QgZ2V0VGV4dHVyZXNcbiAqL1xuUmVzb3VyY2VzLnByb3RvdHlwZS5nZXRUZXh0dXJlcyA9IGZ1bmN0aW9uKGtleSkge1xuXHR2YXIgdmFsdWVzID0gbnVsbDtcblx0dmFyIGlzRGVmYXVsdCA9IGZhbHNlO1xuXG5cdFxuXHRcblxuXHRpZigodGhpcy5za2luICE9IG51bGwpICYmICh0aGlzLnNraW5ba2V5XSAhPSBudWxsKSkge1xuXHRcdHZhbHVlcyA9IHRoaXMuc2tpbltrZXldO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHZhbHVlcyA9IHRoaXMuZGVmYXVsdFNraW5ba2V5XTtcblx0XHRpc0RlZmF1bHQgPSB0cnVlO1xuXHR9XG5cblxuXHR2YXIgZnJhbWUgPSBudWxsO1xuXHR2YXIgdGV4dHVyZSA9IG51bGw7XG5cdHZhciB0ZXh0dXJlcyA9IG5ldyBBcnJheSgpO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ZnJhbWUgPSBudWxsO1xuXHRcdHRleHR1cmUgPSBudWxsO1xuXHRcdFxuXHRcdGlmKHZhbHVlc1tpXS50ZXh0dXJlICE9IG51bGwpIHtcblx0XHRcdHRleHR1cmUgPSB2YWx1ZXNbaV0udGV4dHVyZTtcblx0XHR9XG5cdFx0ZWxzZSBpZighaXNEZWZhdWx0ICYmICh0aGlzLnNraW4uZGVmYXVsdFRleHR1cmUgIT0gbnVsbCkpIHtcblx0XHRcdHRleHR1cmUgPSB0aGlzLnNraW4uZGVmYXVsdFRleHR1cmU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGV4dHVyZSA9IHRoaXMuZGVmYXVsdFNraW4uZGVmYXVsdFRleHR1cmU7XG5cdFx0fVxuXG5cdFx0aWYodmFsdWVzW2ldLmNvb3JkcyAhPSBudWxsKSB7XG5cdFx0XHRmcmFtZSA9IHZhbHVlc1tpXS5jb29yZHM7XG5cdFx0fVxuXHRcdGVsc2UgaWYodHlwZW9mIHZhbHVlc1tpXSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dGV4dHVyZSA9IHZhbHVlc1tpXTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRmcmFtZSA9IHZhbHVlc1tpXTtcblx0XHR9XG5cblx0XHRpZih0ZXh0dXJlICE9IG51bGwpIHtcblx0XHRcdGlmKGZyYW1lICE9IG51bGwpXG5cdFx0XHRcdHRleHR1cmVzLnB1c2godGhpcy5nZXRDb21wb25lbnRzUGFydCh0ZXh0dXJlLCBmcmFtZVswXSwgZnJhbWVbMV0sIGZyYW1lWzJdLCBmcmFtZVszXSkpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0dXJlcy5wdXNoKHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQodGV4dHVyZSwgZnJhbWUpKTtcblx0XHR9XG5cdH1cblxuXHRcblx0aWYodGV4dHVyZXMubGVuZ3RoIDw9IDApXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBza2luIGtleTogXCIgKyBrZXkpO1xuXHQgXG5cblx0cmV0dXJuIHRleHR1cmVzO1xufVxuXG4vKipcbiAqIEdldCBwYXJ0IGZyb20gY29tcG9uZW50cyBhdGxhcy5cbiAqIEBtZXRob2QgZ2V0Q29tcG9uZW50c1BhcnRcbiAqIEBwcml2YXRlXG4gKi9cblJlc291cmNlcy5wcm90b3R5cGUuZ2V0Q29tcG9uZW50c1BhcnQgPSBmdW5jdGlvbih0ZXh0dXJlaWQsIHgsIHksIHcsIGgpIHtcblxuXHR2YXIgZnJhbWU7XG5cdHZhciB0ZXh0dXJlID0gdGhpcy5nZXRUZXh0dXJlRnJvbVNraW4odGV4dHVyZWlkKTtcblxuXHRpZih4ID09PSBudWxsKSB7XG5cdFx0ZnJhbWUgPSB7XG5cdFx0XHR4OiAwLFxuXHRcdFx0eTogMCxcblx0XHRcdHdpZHRoOiB0ZXh0dXJlLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiB0ZXh0dXJlLmhlaWdodFxuXHRcdH07XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZnJhbWUgPSB7XG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeSxcblx0XHRcdHdpZHRoOiB3LFxuXHRcdFx0aGVpZ2h0OiBoXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBuZXcgUElYSS5UZXh0dXJlKHRleHR1cmUsIGZyYW1lKTtcbn1cblxuLyoqXG4gKiBHZXQgdGV4dHVyZSBvYmplY3QgZnJvbSBza2luLlxuICogQG1ldGhvZCBnZXRUZXh0dXJlRnJvbVNraW5cbiAqIEBwcml2YXRlXG4gKi9cblJlc291cmNlcy5wcm90b3R5cGUuZ2V0VGV4dHVyZUZyb21Ta2luID0gZnVuY3Rpb24odGV4dHVyZWlkKSB7XG5cblx0dmFyIHRleHR1cmVPYmplY3QgPSBudWxsO1xuXG5cdGlmKCh0aGlzLnNraW4gIT0gbnVsbCkgJiYgKHRoaXMuc2tpbi50ZXh0dXJlcyAhPSBudWxsKSkge1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnNraW4udGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmKHRoaXMuc2tpbi50ZXh0dXJlc1tpXS5pZCA9PSB0ZXh0dXJlaWQpIHtcblx0XHRcdFx0dGV4dHVyZU9iamVjdCA9IHRoaXMuc2tpbi50ZXh0dXJlc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYodGV4dHVyZU9iamVjdCA9PSBudWxsKSB7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZGVmYXVsdFNraW4udGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmKHRoaXMuZGVmYXVsdFNraW4udGV4dHVyZXNbaV0uaWQgPT0gdGV4dHVyZWlkKSB7XG5cdFx0XHRcdHRleHR1cmVPYmplY3QgPSB0aGlzLmRlZmF1bHRTa2luLnRleHR1cmVzW2ldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmKHRleHR1cmVPYmplY3QgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInRleHR1cmVpZCBkb2Vzbid0IGV4aXN0OiBcIiArIHRleHR1cmVpZCk7XG5cdH1cblxuXHRpZih0aGlzLnRleHR1cmVzW3RleHR1cmVPYmplY3QuaWRdID09IG51bGwpXG5cdFx0dGhpcy50ZXh0dXJlc1t0ZXh0dXJlT2JqZWN0LmlkXSA9IG5ldyBQSVhJLlRleHR1cmUuZnJvbUltYWdlKHRleHR1cmVPYmplY3QuZmlsZSk7XG5cblx0cmV0dXJuIHRoaXMudGV4dHVyZXNbdGV4dHVyZU9iamVjdC5pZF07XG59XG5cblxuLyoqXG4gKiBHZXQgc2luZ2xldG9uIGluc3RhbmNlLlxuICogQG1ldGhvZCBnZXRJbnN0YW5jZVxuICovXG5SZXNvdXJjZXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcblx0aWYgKCFSZXNvdXJjZXMuaW5zdGFuY2UpXG5cdFx0UmVzb3VyY2VzLmluc3RhbmNlID0gbmV3IFJlc291cmNlcygpO1xuXG5cdHJldHVybiBSZXNvdXJjZXMuaW5zdGFuY2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VzOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBCdXR0b24gPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvQnV0dG9uXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xuXG4vKipcbiAqIEJpZyBidXR0b24uXG4gKiBAY2xhc3MgQmlnQnV0dG9uXG4gKiBAbW9kdWxlIGNsaWVudFxuICovXG5mdW5jdGlvbiBCaWdCdXR0b24oKSB7XG5cdEJ1dHRvbi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuYmlnQnV0dG9uVGV4dHVyZSA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJiaWdCdXR0b25cIik7XG5cblx0dGhpcy5hZGRDaGlsZChuZXcgUElYSS5TcHJpdGUodGhpcy5iaWdCdXR0b25UZXh0dXJlKSk7XG5cblx0dmFyIHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAxOHB4IEFyaWFsXCIsXG5cdFx0Ly9maWxsOiBcIiMwMDAwMDBcIlxuXHR9O1xuXG5cdHRoaXMubGFiZWxGaWVsZCA9IG5ldyBQSVhJLlRleHQoXCJbYnV0dG9uXVwiLCBzdHlsZSk7XG5cdHRoaXMubGFiZWxGaWVsZC5wb3NpdGlvbi55ID0gMzA7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbEZpZWxkKTtcblxuXHR2YXIgc3R5bGUgPSB7XG5cdFx0Zm9udDogXCJib2xkIDE0cHggQXJpYWxcIlxuXHRcdC8vZmlsbDogXCIjMDAwMDAwXCJcblx0fTtcblxuXHR0aGlzLnZhbHVlRmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW3ZhbHVlXVwiLCBzdHlsZSk7XG5cdHRoaXMudmFsdWVGaWVsZC5wb3NpdGlvbi55ID0gNTA7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy52YWx1ZUZpZWxkKTtcblxuXHR0aGlzLnNldExhYmVsKFwiVEVTVFwiKTtcblx0dGhpcy5zZXRWYWx1ZSgxMjMpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKEJpZ0J1dHRvbiwgQnV0dG9uKTtcblxuLyoqXG4gKiBTZXQgbGFiZWwgZm9yIHRoZSBidXR0b24uXG4gKiBAbWV0aG9kIHNldExhYmVsXG4gKi9cbkJpZ0J1dHRvbi5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuXHR0aGlzLmxhYmVsRmllbGQuc2V0VGV4dChsYWJlbCk7XG5cdHRoaXMubGFiZWxGaWVsZC51cGRhdGVUcmFuc2Zvcm0oKTtcblx0dGhpcy5sYWJlbEZpZWxkLnggPSB0aGlzLmJpZ0J1dHRvblRleHR1cmUud2lkdGggLyAyIC0gdGhpcy5sYWJlbEZpZWxkLndpZHRoIC8gMjtcbn1cblxuLyoqXG4gKiBTZXQgdmFsdWUuXG4gKiBAbWV0aG9kIHNldFZhbHVlXG4gKi9cbkJpZ0J1dHRvbi5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAoIXZhbHVlKSB7XG5cdFx0dGhpcy52YWx1ZUZpZWxkLnZpc2libGUgPSBmYWxzZTtcblx0XHR2YWx1ZSA9IFwiXCI7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy52YWx1ZUZpZWxkLnZpc2libGUgPSB0cnVlO1xuXHR9XG5cblx0dGhpcy52YWx1ZUZpZWxkLnNldFRleHQodmFsdWUpO1xuXHR0aGlzLnZhbHVlRmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cdHRoaXMudmFsdWVGaWVsZC54ID0gdGhpcy5iaWdCdXR0b25UZXh0dXJlLndpZHRoIC8gMiAtIHRoaXMudmFsdWVGaWVsZC53aWR0aCAvIDI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmlnQnV0dG9uOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIEJ1dHRvbiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9CdXR0b25cIik7XG52YXIgU2xpZGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL1NsaWRlclwiKTtcbnZhciBOaW5lU2xpY2UgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvTmluZVNsaWNlXCIpO1xudmFyIEJpZ0J1dHRvbiA9IHJlcXVpcmUoXCIuL0JpZ0J1dHRvblwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBSYWlzZVNob3J0Y3V0QnV0dG9uID0gcmVxdWlyZShcIi4vUmFpc2VTaG9ydGN1dEJ1dHRvblwiKTtcblxuLyoqXG4gKiBCdXR0b25zXG4gKiBAY2xhc3MgQnV0dG9uc1ZpZXdcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbnNWaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmJ1dHRvbkhvbGRlciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmJ1dHRvbkhvbGRlcik7XG5cblx0dmFyIHNsaWRlckJhY2tncm91bmQgPSBuZXcgTmluZVNsaWNlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJzbGlkZXJCYWNrZ3JvdW5kXCIpLCAyMCwgMCwgMjAsIDApO1xuXHRzbGlkZXJCYWNrZ3JvdW5kLndpZHRoID0gMzAwO1xuXG5cdHZhciBrbm9iID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJzbGlkZXJLbm9iXCIpKTtcblxuXHR0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIoc2xpZGVyQmFja2dyb3VuZCwga25vYik7XG5cdHZhciBwb3MgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcImJpZ0J1dHRvblBvc2l0aW9uXCIpO1xuXHR0aGlzLnNsaWRlci5wb3NpdGlvbi54ID0gcG9zLng7XG5cdHRoaXMuc2xpZGVyLnBvc2l0aW9uLnkgPSBwb3MueSAtIDM1O1xuXHR0aGlzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25TbGlkZXJDaGFuZ2UsIHRoaXMpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuc2xpZGVyKTtcblxuXG5cdHRoaXMuYnV0dG9uSG9sZGVyLnBvc2l0aW9uLnggPSAzNjY7XG5cdHRoaXMuYnV0dG9uSG9sZGVyLnBvc2l0aW9uLnkgPSA1NzU7XG5cblx0dGhpcy5idXR0b25zID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0XHR2YXIgYnV0dG9uID0gbmV3IEJpZ0J1dHRvbigpO1xuXHRcdGJ1dHRvbi5vbihCdXR0b24uQ0xJQ0ssIHRoaXMub25CdXR0b25DbGljaywgdGhpcyk7XG5cdFx0YnV0dG9uLnBvc2l0aW9uLnggPSBpICogMTA1O1xuXHRcdHRoaXMuYnV0dG9uSG9sZGVyLmFkZENoaWxkKGJ1dHRvbik7XG5cdFx0dGhpcy5idXR0b25zLnB1c2goYnV0dG9uKTtcblx0fVxuXG5cdHZhciByYWlzZVNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwic2xpZGVyS25vYlwiKSk7XG5cdHZhciBhcnJvd1Nwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwidXBBcnJvd1wiKSk7XG5cdGFycm93U3ByaXRlLnBvc2l0aW9uLnggPSAocmFpc2VTcHJpdGUud2lkdGggLSBhcnJvd1Nwcml0ZS53aWR0aCkqMC41IC0gMC41O1xuXHRhcnJvd1Nwcml0ZS5wb3NpdGlvbi55ID0gKHJhaXNlU3ByaXRlLmhlaWdodCAtIGFycm93U3ByaXRlLmhlaWdodCkqMC41IC0gMjtcblx0cmFpc2VTcHJpdGUuYWRkQ2hpbGQoYXJyb3dTcHJpdGUpO1xuXG5cdHRoaXMucmFpc2VNZW51QnV0dG9uID0gbmV3IEJ1dHRvbihyYWlzZVNwcml0ZSk7XG5cdHRoaXMucmFpc2VNZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoQnV0dG9uLkNMSUNLLCB0aGlzLm9uUmFpc2VNZW51QnV0dG9uQ2xpY2ssIHRoaXMpO1xuXHR0aGlzLnJhaXNlTWVudUJ1dHRvbi5wb3NpdGlvbi54ID0gMioxMDUgKyA3MDtcblx0dGhpcy5yYWlzZU1lbnVCdXR0b24ucG9zaXRpb24ueSA9IC01O1xuXHR0aGlzLmJ1dHRvbkhvbGRlci5hZGRDaGlsZCh0aGlzLnJhaXNlTWVudUJ1dHRvbik7XG5cblx0dGhpcy5yYWlzZU1lbnVCdXR0b24udmlzaWJsZSA9IGZhbHNlO1xuXHR0aGlzLmNyZWF0ZVJhaXNlQW1vdW50TWVudSgpO1xuXG5cdHRoaXMuc2V0QnV0dG9ucyhbXSwgMCwgLTEsIC0xKTtcblxuXHR0aGlzLmJ1dHRvbnNEYXRhcyA9IFtdO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKEJ1dHRvbnNWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoQnV0dG9uc1ZpZXcpO1xuXG5CdXR0b25zVmlldy5CVVRUT05fQ0xJQ0sgPSBcImJ1dHRvbkNsaWNrXCI7XG5cblxuLyoqXG4gKiBDcmVhdGUgcmFpc2UgYW1vdW50IG1lbnUuXG4gKiBAbWV0aG9kIGNyZWF0ZVJhaXNlQW1vdW50TWVudVxuICovXG5CdXR0b25zVmlldy5wcm90b3R5cGUuY3JlYXRlUmFpc2VBbW91bnRNZW51ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG5cdHRoaXMucmFpc2VNZW51QmFja2dyb3VuZCA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImNoYXRCYWNrZ3JvdW5kXCIpLCAxMCwgMTAsIDEwLCAxMCk7XG5cdHRoaXMucmFpc2VNZW51QmFja2dyb3VuZC5wb3NpdGlvbi54ID0gMDtcblx0dGhpcy5yYWlzZU1lbnVCYWNrZ3JvdW5kLnBvc2l0aW9uLnkgPSAwO1xuXHR0aGlzLnJhaXNlTWVudUJhY2tncm91bmQud2lkdGggPSAxMjU7XG5cdHRoaXMucmFpc2VNZW51QmFja2dyb3VuZC5oZWlnaHQgPSAyMjA7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51LmFkZENoaWxkKHRoaXMucmFpc2VNZW51QmFja2dyb3VuZCk7XG5cblx0dGhpcy5yYWlzZUFtb3VudE1lbnUueCA9IDY0NTtcblx0dGhpcy5yYWlzZUFtb3VudE1lbnUueSA9IDU3MCAtIHRoaXMucmFpc2VBbW91bnRNZW51LmhlaWdodDtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnJhaXNlQW1vdW50TWVudSk7XG5cblx0dmFyIHN0eWxlT2JqZWN0ID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAxOHB4IEFyaWFsXCIsXG5cdH07XG5cblx0dmFyIHQgPSBuZXcgUElYSS5UZXh0KFwiUkFJU0UgVE9cIiwgc3R5bGVPYmplY3QpO1xuXHR0LnBvc2l0aW9uLnggPSAoMTI1IC0gdC53aWR0aCkqMC41O1xuXHR0LnBvc2l0aW9uLnkgPSAxMDtcblx0dGhpcy5yYWlzZUFtb3VudE1lbnUuYWRkQ2hpbGQodCk7XG5cblx0dGhpcy5yYWlzZVNob3J0Y3V0QnV0dG9ucyA9IG5ldyBBcnJheSgpO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcblx0XHR2YXIgYiA9IG5ldyBSYWlzZVNob3J0Y3V0QnV0dG9uKCk7XG5cdFx0Yi5hZGRFdmVudExpc3RlbmVyKEJ1dHRvbi5DTElDSywgdGhpcy5vblJhaXNlU2hvcnRjdXRDbGljaywgdGhpcyk7XG5cdFx0Yi5wb3NpdGlvbi54ID0gMTA7XG5cdFx0Yi5wb3NpdGlvbi55ID0gMzUgKyBpKjMwO1xuXG5cdFx0dGhpcy5yYWlzZUFtb3VudE1lbnUuYWRkQ2hpbGQoYik7XG5cdFx0dGhpcy5yYWlzZVNob3J0Y3V0QnV0dG9ucy5wdXNoKGIpO1xuXHR9XG5cbi8qXG5cdFBpeGlUZXh0aW5wdXQgc2hvdWxkIGJlIHVzZWQuXG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQ9bmV3IFRleHRGaWVsZCgpO1xuXHR0aGlzLnJhaXNlQW1vdW50TWVudUlucHV0Lng9MTA7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQueT00MCszMCo1O1xuXHR0aGlzLnJhaXNlQW1vdW50TWVudUlucHV0LndpZHRoPTEwNTtcblx0dGhpcy5yYWlzZUFtb3VudE1lbnVJbnB1dC5oZWlnaHQ9MTk7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuYm9yZGVyPXRydWU7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuYm9yZGVyQ29sb3I9MHg0MDQwNDA7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuYmFja2dyb3VuZD10cnVlO1xuXHR0aGlzLnJhaXNlQW1vdW50TWVudUlucHV0Lm11bHRpbGluZT1mYWxzZTtcblx0dGhpcy5yYWlzZUFtb3VudE1lbnVJbnB1dC50eXBlPVRleHRGaWVsZFR5cGUuSU5QVVQ7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5DSEFOR0Usb25SYWlzZUFtb3VudE1lbnVJbnB1dENoYW5nZSk7XG5cdHRoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihLZXlib2FyZEV2ZW50LktFWV9ET1dOLG9uUmFpc2VBbW91bnRNZW51SW5wdXRLZXlEb3duKTtcblx0dGhpcy5yYWlzZUFtb3VudE1lbnUuYWRkQ2hpbGQodGhpcy5yYWlzZUFtb3VudE1lbnVJbnB1dCk7XG5cdCovXG5cblx0dGhpcy5yYWlzZUFtb3VudE1lbnUudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFJhaXNlIGFtb3VudCBidXR0b24uXG4gKiBAbWV0aG9kIG9uUmFpc2VNZW51QnV0dG9uQ2xpY2tcbiAqL1xuQnV0dG9uc1ZpZXcucHJvdG90eXBlLm9uUmFpc2VTaG9ydGN1dENsaWNrID0gZnVuY3Rpb24oKSB7XG5cdC8qdmFyIGIgPSBjYXN0IGUudGFyZ2V0O1xuXG5cdF9yYWlzZUFtb3VudE1lbnUudmlzaWJsZT1mYWxzZTtcblxuXHRidXR0b25zW19zbGlkZXJJbmRleF0udmFsdWU9Yi52YWx1ZTtcblx0X3NsaWRlci52YWx1ZT0oYnV0dG9uc1tfc2xpZGVySW5kZXhdLnZhbHVlLV9zbGlkZXJNaW4pLyhfc2xpZGVyTWF4LV9zbGlkZXJNaW4pO1xuXHRfcmFpc2VBbW91bnRNZW51SW5wdXQudGV4dD1TdGQuc3RyaW5nKGJ1dHRvbnNbX3NsaWRlckluZGV4XS52YWx1ZSk7XG5cblx0dHJhY2UoXCJ2YWx1ZSBjbGljazogXCIrYi52YWx1ZSk7Ki9cbn1cblxuXG5cbi8qKlxuICogUmFpc2UgYW1vdW50IGJ1dHRvbi5cbiAqIEBtZXRob2Qgb25SYWlzZU1lbnVCdXR0b25DbGlja1xuICovXG5CdXR0b25zVmlldy5wcm90b3R5cGUub25SYWlzZU1lbnVCdXR0b25DbGljayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJhaXNlQW1vdW50TWVudS52aXNpYmxlID0gIXRoaXMucmFpc2VBbW91bnRNZW51LnZpc2libGU7XG4vKlxuXHRpZih0aGlzLnJhaXNlQW1vdW50TWVudS52aXNpYmxlKSB7XG5cdFx0dGhpcy5zdGFnZS5tb3VzZWRvd24gPSB0aGlzLm9uU3RhZ2VNb3VzZURvd24uYmluZCh0aGlzKTtcblx0XHQvLyB0aGlzLnJhaXNlQW1vdW50TWVudUlucHV0LmZvY3VzKCk7XG5cdFx0Ly8gdGhpcy5yYWlzZUFtb3VudE1lbnVJbnB1dC5TZWxlY3RBbGxcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLnN0YWdlLm1vdXNlZG93biA9IG51bGw7XG5cdH0qL1xufVxuXG4vKipcbiAqIFNsaWRlciBjaGFuZ2UuXG4gKiBAbWV0aG9kIG9uU2xpZGVyQ2hhbmdlXG4gKi9cbkJ1dHRvbnNWaWV3LnByb3RvdHlwZS5vblNsaWRlckNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbmV3VmFsdWUgPSBNYXRoLnJvdW5kKHRoaXMuc2xpZGVyTWluICsgdGhpcy5zbGlkZXIuZ2V0VmFsdWUoKSoodGhpcy5zbGlkZXJNYXggLSB0aGlzLnNsaWRlck1pbikpO1xuXHR0aGlzLmJ1dHRvbnNbdGhpcy5zbGlkZXJJbmRleF0uc2V0VmFsdWUobmV3VmFsdWUpO1xuXHR0aGlzLmJ1dHRvbkRhdGFzW3RoaXMuc2xpZGVySW5kZXhdLnZhbHVlID0gbmV3VmFsdWU7XG5cdGNvbnNvbGUubG9nKFwibmV3VmFsdWUgPSBcIiArIG5ld1ZhbHVlKTtcblxuXHQvL3RoaXMucmFpc2VBbW91bnRNZW51SW5wdXQuc2V0VGV4dChidXR0b25zW19zbGlkZXJJbmRleF0udmFsdWUudG9TdHJpbmcoKSk7XG59XG5cbi8qKlxuICogU2hvdyBzbGlkZXIuXG4gKiBAbWV0aG9kIHNob3dTbGlkZXJcbiAqL1xuQnV0dG9uc1ZpZXcucHJvdG90eXBlLnNob3dTbGlkZXIgPSBmdW5jdGlvbihpbmRleCwgbWluLCBtYXgpIHtcblx0Y29uc29sZS5sb2coXCJzaG93U2xpZGVyXCIpO1xuXHR0aGlzLnNsaWRlckluZGV4ID0gaW5kZXg7XG5cdHRoaXMuc2xpZGVyTWluID0gbWluO1xuXHR0aGlzLnNsaWRlck1heCA9IG1heDtcblxuXHRjb25zb2xlLmxvZyhcInRoaXMuYnV0dG9uRGF0YXNbXCIraW5kZXgrXCJdID0gXCIgKyB0aGlzLmJ1dHRvbkRhdGFzW2luZGV4XS5nZXRWYWx1ZSgpICsgXCIsIG1pbiA9IFwiICsgbWluICsgXCIsIG1heCA9IFwiICsgbWF4KTtcblx0dGhpcy5zbGlkZXIuc2V0VmFsdWUoKHRoaXMuYnV0dG9uRGF0YXNbaW5kZXhdLmdldFZhbHVlKCkgLSBtaW4pLyhtYXggLSBtaW4pKTtcblx0Y29uc29sZS5sb2coXCJ0aGlzLnNsaWRlci5nZXRWYWx1ZSgpID0gXCIgKyB0aGlzLnNsaWRlci5nZXRWYWx1ZSgpKTtcblx0dGhpcy5zbGlkZXIudmlzaWJsZSA9IHRydWU7XG5cdHRoaXMuc2xpZGVyLnNob3coKTtcbn1cblxuLyoqXG4gKiBDbGVhci5cbiAqIEBtZXRob2QgY2xlYXJcbiAqL1xuQnV0dG9uc1ZpZXcucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oYnV0dG9uRGF0YXMpIHtcblx0dGhpcy5zZXRCdXR0b25zKFtdLCAwLCAtMSwgLTEpO1xufVxuXG4vKipcbiAqIFNldCBidXR0b24gZGF0YXMuXG4gKiBAbWV0aG9kIHNldEJ1dHRvbnNcbiAqL1xuQnV0dG9uc1ZpZXcucHJvdG90eXBlLnNldEJ1dHRvbnMgPSBmdW5jdGlvbihidXR0b25EYXRhcywgc2xpZGVyQnV0dG9uSW5kZXgsIG1pbiwgbWF4KSB7XG5cdHRoaXMuYnV0dG9uRGF0YXMgPSBidXR0b25EYXRhcztcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG5cdFx0aWYgKGkgPj0gYnV0dG9uRGF0YXMubGVuZ3RoKSB7XG5cdFx0XHRidXR0b24udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIGJ1dHRvbkRhdGEgPSBidXR0b25EYXRhc1tpXTtcblxuXHRcdGJ1dHRvbi52aXNpYmxlID0gdHJ1ZTtcblx0XHRidXR0b24uc2V0TGFiZWwoYnV0dG9uRGF0YS5nZXRCdXR0b25TdHJpbmcoKSk7XG5cdFx0YnV0dG9uLnNldFZhbHVlKGJ1dHRvbkRhdGEuZ2V0VmFsdWUoKSk7XG5cblx0fVxuXG5cdGlmKChtaW4gPj0gMCkgJiYgKG1heCA+PSAwKSlcblx0XHR0aGlzLnNob3dTbGlkZXIoc2xpZGVyQnV0dG9uSW5kZXgsIG1pbiwgbWF4KTtcblxuXHR0aGlzLmJ1dHRvbkhvbGRlci5wb3NpdGlvbi54ID0gMzY2O1xuXG5cdGlmIChidXR0b25EYXRhcy5sZW5ndGggPCAzKVxuXHRcdHRoaXMuYnV0dG9uSG9sZGVyLnBvc2l0aW9uLnggKz0gNDU7XG59XG5cbi8qKlxuICogQnV0dG9uIGNsaWNrLlxuICogQG1ldGhvZCBvbkJ1dHRvbkNsaWNrXG4gKiBAcHJpdmF0ZVxuICovXG5CdXR0b25zVmlldy5wcm90b3R5cGUub25CdXR0b25DbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIGJ1dHRvbkluZGV4ID0gLTE7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmJ1dHRvbnNbaV0udmlzaWJsZSA9IGZhbHNlO1xuXHRcdGlmIChlLnRhcmdldCA9PSB0aGlzLmJ1dHRvbnNbaV0pXG5cdFx0XHRidXR0b25JbmRleCA9IGk7XG5cdH1cblxuXHR0aGlzLnNsaWRlci52aXNpYmxlID0gZmFsc2U7XG5cblx0Ly9jb25zb2xlLmxvZyhcImJ1dHRvbiBjbGljazogXCIgKyBidXR0b25JbmRleCk7XG5cdHZhciBidXR0b25EYXRhID0gdGhpcy5idXR0b25EYXRhc1tidXR0b25JbmRleF07XG5cblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBCdXR0b25zVmlldy5CVVRUT05fQ0xJQ0ssXG5cdFx0YnV0dG9uOiBidXR0b25EYXRhLmdldEJ1dHRvbigpLFxuXHRcdHZhbHVlOiBidXR0b25EYXRhLmdldFZhbHVlKClcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uc1ZpZXc7IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBUV0VFTiA9IHJlcXVpcmUoXCJ0d2Vlbi5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG5cbi8qKlxuICogQSBjYXJkIHZpZXcuXG4gKiBAY2xhc3MgQ2FyZFZpZXdcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIENhcmRWaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblx0dGhpcy50YXJnZXRQb3NpdGlvbiA9IG51bGw7XG5cblxuXG5cblx0dGhpcy5mcmFtZSA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwiY2FyZEZyYW1lXCIpKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmZyYW1lKTtcblxuXHR0aGlzLnN1aXQgPSBuZXcgUElYSS5TcHJpdGUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZXMoXCJzdWl0U3ltYm9sc1wiKVswXSk7XG5cdHRoaXMuc3VpdC5wb3NpdGlvbi54ID0gODtcblx0dGhpcy5zdWl0LnBvc2l0aW9uLnkgPSAyNTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnN1aXQpO1xuXG5cdHZhciBzdHlsZSA9IHtcblx0XHRmb250OiBcImJvbGQgMTZweCBBcmlhbFwiXG5cdH07XG5cblx0dGhpcy52YWx1ZUZpZWxkID0gbmV3IFBJWEkuVGV4dChcIlt2YWxdXCIsIHN0eWxlKTtcblx0dGhpcy52YWx1ZUZpZWxkLnBvc2l0aW9uLnggPSA2O1xuXHR0aGlzLnZhbHVlRmllbGQucG9zaXRpb24ueSA9IDU7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy52YWx1ZUZpZWxkKTtcblxuXHR0aGlzLmJhY2sgPSBuZXcgUElYSS5TcHJpdGUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImNhcmRCYWNrXCIpKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmJhY2spO1xuXG5cblx0dGhpcy5tYXNrR3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXHR0aGlzLm1hc2tHcmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuXHR0aGlzLm1hc2tHcmFwaGljcy5kcmF3UmVjdCgwLCAwLCA4NywgdGhpcy5oZWlnaHQpO1xuXHR0aGlzLm1hc2tHcmFwaGljcy5lbmRGaWxsKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5tYXNrR3JhcGhpY3MpO1xuXG5cdHRoaXMubWFzayA9IHRoaXMubWFza0dyYXBoaWNzO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKENhcmRWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoQ2FyZFZpZXcpO1xuXG4vKipcbiAqIFNldCBjYXJkIGRhdGEuXG4gKiBAbWV0aG9kIHNldENhcmREYXRhXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5zZXRDYXJkRGF0YSA9IGZ1bmN0aW9uKGNhcmREYXRhKSB7XG5cdHRoaXMuY2FyZERhdGEgPSBjYXJkRGF0YTtcblxuXG5cdGlmICh0aGlzLmNhcmREYXRhLmlzU2hvd24oKSkge1xuXHRcdC8qXG5cdFx0dGhpcy5iYWNrLnZpc2libGUgPSBmYWxzZTtcblx0XHR0aGlzLmZyYW1lLnZpc2libGUgPSB0cnVlO1xuKi9cblx0XHR0aGlzLnZhbHVlRmllbGQuc3R5bGUuZmlsbCA9IHRoaXMuY2FyZERhdGEuZ2V0Q29sb3IoKTtcblxuXHRcdHRoaXMudmFsdWVGaWVsZC5zZXRUZXh0KHRoaXMuY2FyZERhdGEuZ2V0Q2FyZFZhbHVlU3RyaW5nKCkpO1xuXHRcdHRoaXMudmFsdWVGaWVsZC51cGRhdGVUcmFuc2Zvcm0oKTtcblx0XHR0aGlzLnZhbHVlRmllbGQucG9zaXRpb24ueCA9IDE3IC0gdGhpcy52YWx1ZUZpZWxkLmNhbnZhcy53aWR0aCAvIDI7XG5cblx0XHR0aGlzLnN1aXQuc2V0VGV4dHVyZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlcyhcInN1aXRTeW1ib2xzXCIpW3RoaXMuY2FyZERhdGEuZ2V0U3VpdEluZGV4KCldKTtcblx0fVxuXHR0aGlzLmJhY2sudmlzaWJsZSA9IHRydWU7XG5cdHRoaXMuZnJhbWUudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFNldCBjYXJkIGRhdGEuXG4gKiBAbWV0aG9kIHNldENhcmREYXRhXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5zZXRUYXJnZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHBvaW50KSB7XG5cdHRoaXMudGFyZ2V0UG9zaXRpb24gPSBwb2ludDtcblxuXHR0aGlzLnBvc2l0aW9uLnggPSBwb2ludC54O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSBwb2ludC55O1xufVxuXG4vKipcbiAqIEhpZGUuXG4gKiBAbWV0aG9kIGhpZGVcbiAqL1xuQ2FyZFZpZXcucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cbi8qKlxuICogU2hvdy5cbiAqIEBtZXRob2Qgc2hvd1xuICovXG5DYXJkVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGFuaW1hdGUsIGRlbGF5KSB7XG5cdC8qaWYoZGVsYXkgPT0gdW5kZWZpbmVkKVxuXHRcdGRlbGF5ID0gMTtcblx0Ki9cblx0dGhpcy5tYXNrR3JhcGhpY3Muc2NhbGUueSA9IDE7XG5cdHRoaXMucG9zaXRpb24ueCA9IHRoaXMudGFyZ2V0UG9zaXRpb24ueDtcblx0dGhpcy5wb3NpdGlvbi55ID0gdGhpcy50YXJnZXRQb3NpdGlvbi55O1xuXHRpZighYW5pbWF0ZSkge1xuXHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cdFx0dGhpcy5vblNob3dDb21wbGV0ZSgpO1xuXHRcdHJldHVybjtcblx0fVxuXHR0aGlzLm1hc2suaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0dmFyIGRlc3RpbmF0aW9uID0ge3g6IHRoaXMucG9zaXRpb24ueCwgeTogdGhpcy5wb3NpdGlvbi55fTtcblx0dGhpcy5wb3NpdGlvbi54ID0gKHRoaXMucGFyZW50LndpZHRoIC0gdGhpcy53aWR0aCkqMC41O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSAtdGhpcy5oZWlnaHQ7XG5cblx0dmFyIGRpZmZYID0gdGhpcy5wb3NpdGlvbi54IC0gZGVzdGluYXRpb24ueDtcblx0dmFyIGRpZmZZID0gdGhpcy5wb3NpdGlvbi55IC0gZGVzdGluYXRpb24ueTtcblx0dmFyIGRpZmYgPSBNYXRoLnNxcnQoZGlmZlgqZGlmZlggKyBkaWZmWSpkaWZmWSk7XG5cblx0dmFyIHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKCB0aGlzLnBvc2l0aW9uIClcbi8vICAgICAgICAgICAgLmRlbGF5KGRlbGF5KVxuICAgICAgICAgICAgLnRvKCB7IHg6IGRlc3RpbmF0aW9uLngsIHk6IGRlc3RpbmF0aW9uLnkgfSwgNTAwIClcbiAgICAgICAgICAgIC5lYXNpbmcoIFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuT3V0IClcbiAgICAgICAgICAgIC5vblN0YXJ0KHRoaXMub25TaG93U3RhcnQuYmluZCh0aGlzKSlcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlKHRoaXMub25TaG93Q29tcGxldGUuYmluZCh0aGlzKSlcbiAgICAgICAgICAgIC5zdGFydCgpO1xufVxuXG4vKipcbiAqIFNob3cgY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uU2hvd0NvbXBsZXRlXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5vblNob3dTdGFydCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xufVxuXG4vKipcbiAqIFNob3cgY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uU2hvd0NvbXBsZXRlXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5vblNob3dDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRpZih0aGlzLmNhcmREYXRhLmlzU2hvd24oKSkge1xuXHRcdHRoaXMuYmFjay52aXNpYmxlID0gZmFsc2U7XG5cdFx0dGhpcy5mcmFtZS52aXNpYmxlID0gdHJ1ZTtcblx0fVxuXHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJhbmltYXRpb25Eb25lXCIsIHRoaXMpO1xufVxuXG4vKipcbiAqIEZvbGQuXG4gKiBAbWV0aG9kIGZvbGRcbiAqL1xuQ2FyZFZpZXcucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbigpIHtcblx0dmFyIG8gPSB7XG5cdFx0eDogdGhpcy50YXJnZXRQb3NpdGlvbi54LFxuXHRcdHk6IHRoaXMudGFyZ2V0UG9zaXRpb24ueSs4MFxuXHR9O1xuXG5cdHZhciB0aW1lID0gNTAwOy8vIFNldHRpbmdzLmluc3RhbmNlLnNjYWxlQW5pbWF0aW9uVGltZSg1MDApO1xuXHR0aGlzLnQwID0gbmV3IFRXRUVOLlR3ZWVuKHRoaXMucG9zaXRpb24pXG5cdFx0XHQudG8obywgdGltZSlcblx0XHRcdC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5PdXQpXG5cdFx0XHQub25VcGRhdGUodGhpcy5vbkZvbGRVcGRhdGUuYmluZCh0aGlzKSlcblx0XHRcdC5vbkNvbXBsZXRlKHRoaXMub25Gb2xkQ29tcGxldGUuYmluZCh0aGlzKSlcblx0XHRcdC5zdGFydCgpO1xufVxuXG4vKipcbiAqIEZvbGQgYW5pbWF0aW9uIHVwZGF0ZS5cbiAqIEBtZXRob2Qgb25Gb2xkVXBkYXRlXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5vbkZvbGRVcGRhdGUgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuXHR0aGlzLm1hc2tHcmFwaGljcy5zY2FsZS55ID0gMSAtIHByb2dyZXNzO1xufVxuXG4vKipcbiAqIEZvbGQgYW5pbWF0aW9uIGNvbXBsZXRlLlxuICogQG1ldGhvZCBvbkZvbGRDb21wbGV0ZVxuICovXG5DYXJkVmlldy5wcm90b3R5cGUub25Gb2xkQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiYW5pbWF0aW9uRG9uZVwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXJkVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgTmluZVNsaWNlID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL05pbmVTbGljZVwiKTtcbnZhciBTbGlkZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvU2xpZGVyXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xudmFyIFBpeGlUZXh0SW5wdXQgPSByZXF1aXJlKFwiUGl4aVRleHRJbnB1dFwiKTtcbnZhciBNb3VzZU92ZXJHcm91cCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9Nb3VzZU92ZXJHcm91cFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xuXG4vKipcbiAqIENoYXQgdmlldy5cbiAqIEBjbGFzcyBDaGF0Vmlld1xuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gQ2hhdFZpZXcoKSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWFyZ2luID0gNTtcblxuXHRcblx0dmFyIGNoYXRQbGF0ZSA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImZyYW1lUGxhdGVcIiksIDEwKTtcblx0Y2hhdFBsYXRlLnBvc2l0aW9uLnggPSAxMDtcblx0Y2hhdFBsYXRlLnBvc2l0aW9uLnkgPSA1NDA7XG5cdGNoYXRQbGF0ZS5zZXRMb2NhbFNpemUoMzMwLCAxMzApO1xuXHR0aGlzLmFkZENoaWxkKGNoYXRQbGF0ZSk7XG5cblx0dmFyIHMgPSBuZXcgTmluZVNsaWNlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJmcmFtZVBsYXRlXCIpLCAxMCk7XG5cdHMucG9zaXRpb24ueCA9IDEwO1xuXHRzLnBvc2l0aW9uLnkgPSA2NzU7XG5cdHMuc2V0TG9jYWxTaXplKDMzMCwgMzUpO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xuXG5cdHZhciBzdHlsZU9iamVjdCA9IHtcblx0XHRmb250OiBcIjEycHggQXJpYWxcIixcblx0XHR3b3JkV3JhcFdpZHRoOiAzMTAsXG5cdFx0aGVpZ2h0OiAxMTQsXG5cdFx0Ym9yZGVyOiB0cnVlLFxuXHRcdGNvbG9yOiAweEZGRkZGRixcblx0XHRib3JkZXJDb2xvcjogMHg0MDQwNDAsXG5cdFx0d29yZFdyYXA6IHRydWUsXG5cdFx0bXVsdGlsaW5lOiB0cnVlXG5cdH07XG5cblx0dGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5jb250YWluZXIpO1xuXHR0aGlzLmNvbnRhaW5lci5wb3NpdGlvbi54ID0gMjA7XG5cdHRoaXMuY29udGFpbmVyLnBvc2l0aW9uLnkgPSA1NDg7XG5cblx0dGhpcy5jaGF0TWFzayA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdHRoaXMuY2hhdE1hc2suYmVnaW5GaWxsKDEyMyk7XG5cdHRoaXMuY2hhdE1hc2suZHJhd1JlY3QoMCwgMCwgMzEwLCAxMTQpO1xuXHR0aGlzLmNoYXRNYXNrLmVuZEZpbGwoKTtcblx0dGhpcy5jb250YWluZXIuYWRkQ2hpbGQodGhpcy5jaGF0TWFzayk7XG5cblx0dGhpcy5jaGF0VGV4dCA9IG5ldyBQSVhJLlRleHQoXCJcIiwgc3R5bGVPYmplY3QpO1xuXHR0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmNoYXRUZXh0KTtcblx0dGhpcy5jaGF0VGV4dC5tYXNrID0gdGhpcy5jaGF0TWFzaztcblxuXG5cblx0dmFyIHN0eWxlT2JqZWN0ID0ge1xuXHRcdGZvbnQ6IFwiMTRweCBBcmlhbFwiLFxuXHRcdHdpZHRoOiAzMTAsXG5cdFx0aGVpZ2h0OiAxOSxcblx0XHRib3JkZXI6IHRydWUsXG5cdFx0Ym9yZGVyQ29sb3I6IDB4NDA0MDQwLFxuXHRcdGJhY2tncm91bmQ6IHRydWUsXG5cdFx0bXVsdGlsaW5lOiB0cnVlXG5cdH07XG5cdHRoaXMuaW5wdXRGaWVsZCA9IG5ldyBQaXhpVGV4dElucHV0KFwiXCIsIHN0eWxlT2JqZWN0KTtcblx0dGhpcy5pbnB1dEZpZWxkLnBvc2l0aW9uLnggPSB0aGlzLmNvbnRhaW5lci5wb3NpdGlvbi54O1xuXHR0aGlzLmlucHV0RmllbGQucG9zaXRpb24ueSA9IDY4Mztcblx0dGhpcy5pbnB1dEZpZWxkLndpZHRoID0gMzEwO1xuXHR0aGlzLmlucHV0RmllbGQua2V5ZG93biA9IHRoaXMub25LZXlEb3duLmJpbmQodGhpcyk7XG5cblx0dmFyIGlucHV0U2hhZG93ID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0aW5wdXRTaGFkb3cuYmVnaW5GaWxsKDB4MDAwMDAwKTtcblx0aW5wdXRTaGFkb3cuZHJhd1JlY3QoLTEsIC0xLCAzMTEsIDIwKTtcblx0aW5wdXRTaGFkb3cucG9zaXRpb24ueCA9IHRoaXMuaW5wdXRGaWVsZC5wb3NpdGlvbi54O1xuXHRpbnB1dFNoYWRvdy5wb3NpdGlvbi55ID0gdGhpcy5pbnB1dEZpZWxkLnBvc2l0aW9uLnk7XG5cdHRoaXMuYWRkQ2hpbGQoaW5wdXRTaGFkb3cpO1xuXG5cdHZhciBpbnB1dEJhY2tncm91bmQgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXHRpbnB1dEJhY2tncm91bmQuYmVnaW5GaWxsKDB4RkZGRkZGKTtcblx0aW5wdXRCYWNrZ3JvdW5kLmRyYXdSZWN0KDAsIDAsIDMxMCwgMTkpO1xuXHRpbnB1dEJhY2tncm91bmQucG9zaXRpb24ueCA9IHRoaXMuaW5wdXRGaWVsZC5wb3NpdGlvbi54O1xuXHRpbnB1dEJhY2tncm91bmQucG9zaXRpb24ueSA9IHRoaXMuaW5wdXRGaWVsZC5wb3NpdGlvbi55O1xuXHR0aGlzLmFkZENoaWxkKGlucHV0QmFja2dyb3VuZCk7XG5cblx0dGhpcy5hZGRDaGlsZCh0aGlzLmlucHV0RmllbGQpO1xuXG5cblxuXHR2YXIgc2xpZGVCYWNrID0gbmV3IE5pbmVTbGljZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwidGV4dFNjcm9sbGJhclRyYWNrXCIpLCAxMCwgMCwgMTAsIDApO1xuXHRzbGlkZUJhY2sud2lkdGggPSAxMDc7XG5cdHZhciBzbGlkZUtub2IgPSBuZXcgTmluZVNsaWNlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJ0ZXh0U2Nyb2xsYmFyVGh1bWJcIiksIDEwLCAwLCAxMCwgMCk7XG5cdHNsaWRlS25vYi53aWR0aCA9IDMwO1xuXG5cblx0dGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHNsaWRlQmFjaywgc2xpZGVLbm9iKTtcblx0dGhpcy5zbGlkZXIucm90YXRpb24gPSBNYXRoLlBJKjAuNTtcblx0dGhpcy5zbGlkZXIucG9zaXRpb24ueCA9IDMyNjtcblx0dGhpcy5zbGlkZXIucG9zaXRpb24ueSA9IDU1Mjtcblx0dGhpcy5zbGlkZXIuc2V0VmFsdWUoMSk7XG5cdHRoaXMuc2xpZGVyLnZpc2libGUgPSBmYWxzZTtcblx0dGhpcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLm9uU2xpZGVyQ2hhbmdlLmJpbmQodGhpcykpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuc2xpZGVyKTtcblxuXG5cdHRoaXMubW91c2VPdmVyR3JvdXAgPSBuZXcgTW91c2VPdmVyR3JvdXAoKTtcblx0dGhpcy5tb3VzZU92ZXJHcm91cC5hZGREaXNwbGF5T2JqZWN0KHRoaXMuY2hhdFRleHQpO1xuXHR0aGlzLm1vdXNlT3Zlckdyb3VwLmFkZERpc3BsYXlPYmplY3QodGhpcy5zbGlkZXIpO1xuXHR0aGlzLm1vdXNlT3Zlckdyb3VwLmFkZERpc3BsYXlPYmplY3QodGhpcy5jaGF0TWFzayk7XG5cdHRoaXMubW91c2VPdmVyR3JvdXAuYWRkRGlzcGxheU9iamVjdChjaGF0UGxhdGUpO1xuXHR0aGlzLm1vdXNlT3Zlckdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgdGhpcy5vbkNoYXRGaWVsZE1vdXNlT3ZlciwgdGhpcyk7XG5cdHRoaXMubW91c2VPdmVyR3JvdXAuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMub25DaGF0RmllbGRNb3VzZU91dCwgdGhpcyk7XG5cblx0dGhpcy5jbGVhcigpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKENoYXRWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoQ2hhdFZpZXcpO1xuXG5cblxuLyoqXG4gKiBDbGVhciBtZXNzYWdlcy5cbiAqIEBtZXRob2QgY2xlYXJcbiAqL1xuQ2hhdFZpZXcucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2hhdFRleHQuc2V0VGV4dChcIlwiKTtcbiBcdHRoaXMuY2hhdFRleHQueSA9IC1NYXRoLnJvdW5kKHRoaXMuc2xpZGVyLmdldFZhbHVlKCkqKHRoaXMuY2hhdFRleHQuaGVpZ2h0ICsgdGhpcy5tYXJnaW4gLSB0aGlzLmNoYXRNYXNrLmhlaWdodCApKTtcblx0dGhpcy5zbGlkZXIuc2V0VmFsdWUoMSk7XG59XG5cblxuLyoqXG4gKiAgQWRkIHRleHQuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbkNoYXRWaWV3LnByb3RvdHlwZS5hZGRUZXh0ID0gZnVuY3Rpb24odXNlciwgdGV4dCkge1xuXHR0aGlzLmNoYXRUZXh0LnNldFRleHQodGhpcy5jaGF0VGV4dC50ZXh0ICsgdXNlciArIFwiOiBcIiArIHRleHQgKyBcIlxcblwiKTtcbiBcdHRoaXMuY2hhdFRleHQueSA9IC1NYXRoLnJvdW5kKHRoaXMuc2xpZGVyLmdldFZhbHVlKCkqKHRoaXMuY2hhdFRleHQuaGVpZ2h0ICsgdGhpcy5tYXJnaW4gLSB0aGlzLmNoYXRNYXNrLmhlaWdodCApKTtcblx0dGhpcy5zbGlkZXIuc2V0VmFsdWUoMSk7XG59XG5cbi8qKlxuICogT24gc2xpZGVyIHZhbHVlIGNoYW5nZVxuICogQG1ldGhvZCBvblNsaWRlckNoYW5nZVxuICovXG4gQ2hhdFZpZXcucHJvdG90eXBlLm9uU2xpZGVyQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gXHR0aGlzLmNoYXRUZXh0LnkgPSAtTWF0aC5yb3VuZCh0aGlzLnNsaWRlci5nZXRWYWx1ZSgpKih0aGlzLmNoYXRUZXh0LmhlaWdodCArIHRoaXMubWFyZ2luIC0gdGhpcy5jaGF0TWFzay5oZWlnaHQpKTtcbiB9XG5cblxuLyoqXG4gKiBPbiBtb3VzZSBvdmVyXG4gKiBAbWV0aG9kIG9uQ2hhdEZpZWxkTW91c2VPdmVyXG4gKi9cbiBDaGF0Vmlldy5wcm90b3R5cGUub25DaGF0RmllbGRNb3VzZU92ZXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zbGlkZXIuc2hvdygpO1xuIH1cblxuXG4vKipcbiAqIE9uIG1vdXNlIG91dFxuICogQG1ldGhvZCBvbkNoYXRGaWVsZE1vdXNlT3V0XG4gKi9cbiBDaGF0Vmlldy5wcm90b3R5cGUub25DaGF0RmllbGRNb3VzZU91dCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNsaWRlci5oaWRlKCk7XG4gfVxuXG5cbi8qKlxuICogT24ga2V5IGRvd25cbiAqIEBtZXRob2Qgb25LZXlEb3duXG4gKi9cbiBDaGF0Vmlldy5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYoZXZlbnQua2V5Q29kZSA9PSAxMykge1xuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcImNoYXRcIiwgdGhpcy5pbnB1dEZpZWxkLnRleHQpO1xuXHRcdFxuXHRcdHRoaXMuaW5wdXRGaWVsZC5zZXRUZXh0KFwiXCIpO1xuXHRcdFxuXHR9XG4gfVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0VmlldztcbiIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xuXG4vKipcbiAqIEEgY2hpcHMgdmlldy5cbiAqIEBjbGFzcyBDaGlwc1ZpZXdcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIENoaXBzVmlldyhzaG93VG9vbFRpcCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblx0dGhpcy50YXJnZXRQb3NpdGlvbiA9IG51bGw7XG5cblx0dGhpcy5hbGlnbiA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLkFsaWduLkxlZnQ7XG5cblx0dGhpcy52YWx1ZSA9IDA7XG5cblx0dGhpcy5kZW5vbWluYXRpb25zID0gWzUwMDAwMCwgMTAwMDAwLCAyNTAwMCwgNTAwMCwgMTAwMCwgNTAwLCAxMDAsIDI1LCA1LCAxXTtcblxuXHR0aGlzLnN0YWNrQ2xpcHMgPSBuZXcgQXJyYXkoKTtcblx0dGhpcy5ob2xkZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5ob2xkZXIpO1xuXG5cdHRoaXMudG9vbFRpcCA9IG51bGw7XG5cblx0aWYgKHNob3dUb29sVGlwKSB7XG5cdFx0dGhpcy50b29sVGlwID0gbmV3IFRvb2xUaXAoKTtcblx0XHR0aGlzLmFkZENoaWxkKHRoaXMudG9vbFRpcCk7XG5cdH1cblxufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKENoaXBzVmlldywgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KENoaXBzVmlldyk7XG5cbi8qKlxuICogU2V0IGFsaWdubWVudC5cbiAqIEBtZXRob2Qgc2V0Q2FyZERhdGFcbiAqL1xuQ2hpcHNWaWV3LnByb3RvdHlwZS5zZXRBbGlnbm1lbnQgPSBmdW5jdGlvbihhbGlnbikge1xuXHRpZiAoIWFsaWduKVxuXHRcdHRocm93IG5ldyBFcnJvcihcInVua25vd24gYWxpZ25tZW50OiBcIiArIGFsaWduKTtcblxuXHR0aGlzLmFsaWduID0gYWxpZ247XG59XG5cbi8qKlxuICogU2V0IHRhcmdldCBwb3NpdGlvbi5cbiAqIEBtZXRob2Qgc2V0VGFyZ2V0UG9zaXRpb25cbiAqL1xuQ2hpcHNWaWV3LnByb3RvdHlwZS5zZXRUYXJnZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdHRoaXMudGFyZ2V0UG9zaXRpb24gPSBwb3NpdGlvbjtcblx0dGhpcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0dGhpcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueTtcbn1cblxuLyoqXG4gKiBTZXQgdmFsdWUuXG4gKiBAbWV0aG9kIHNldFZhbHVlXG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0dmFyIHNwcml0ZTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhY2tDbGlwcy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLmhvbGRlci5yZW1vdmVDaGlsZCh0aGlzLnN0YWNrQ2xpcHNbaV0pO1xuXG5cdHRoaXMuc3RhY2tDbGlwcyA9IG5ldyBBcnJheSgpO1xuXG5cdGlmICh0aGlzLnRvb2xUaXAgIT0gbnVsbClcblx0XHR0aGlzLnRvb2xUaXAudGV4dCA9IFwiQmV0OiBcIiArIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcblxuXHR2YXIgaTtcblx0dmFyIHN0YWNrQ2xpcCA9IG51bGw7XG5cdHZhciBzdGFja1BvcyA9IDA7XG5cdHZhciBjaGlwUG9zID0gMDtcblx0dmFyIHRleHR1cmVzID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZXMoXCJjaGlwc1wiKTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5kZW5vbWluYXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGRlbm9taW5hdGlvbiA9IHRoaXMuZGVub21pbmF0aW9uc1tpXTtcblxuXHRcdGNoaXBQb3MgPSAwO1xuXHRcdHN0YWNrQ2xpcCA9IG51bGw7XG5cdFx0d2hpbGUgKHZhbHVlID49IGRlbm9taW5hdGlvbikge1xuXHRcdFx0aWYgKHN0YWNrQ2xpcCA9PSBudWxsKSB7XG5cdFx0XHRcdHN0YWNrQ2xpcCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0XHRcdFx0c3RhY2tDbGlwLnggPSBzdGFja1Bvcztcblx0XHRcdFx0c3RhY2tQb3MgKz0gNDA7XG5cdFx0XHRcdHRoaXMuaG9sZGVyLmFkZENoaWxkKHN0YWNrQ2xpcCk7XG5cdFx0XHRcdHRoaXMuc3RhY2tDbGlwcy5wdXNoKHN0YWNrQ2xpcCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdGV4dHVyZSA9IHRleHR1cmVzW2kgJSB0ZXh0dXJlcy5sZW5ndGhdO1xuXHRcdFx0dmFyIGNoaXAgPSBuZXcgUElYSS5TcHJpdGUodGV4dHVyZSk7XG5cdFx0XHRjaGlwLnBvc2l0aW9uLnkgPSBjaGlwUG9zO1xuXHRcdFx0Y2hpcFBvcyAtPSA1O1xuXHRcdFx0c3RhY2tDbGlwLmFkZENoaWxkKGNoaXApO1xuXHRcdFx0dmFsdWUgLT0gZGVub21pbmF0aW9uO1xuXG5cdFx0XHR2YXIgZGVub21pbmF0aW9uU3RyaW5nO1xuXG5cdFx0XHRpZiAoZGVub21pbmF0aW9uID49IDEwMDApXG5cdFx0XHRcdGRlbm9taW5hdGlvblN0cmluZyA9IE1hdGgucm91bmQoZGVub21pbmF0aW9uIC8gMTAwMCkgKyBcIktcIjtcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkZW5vbWluYXRpb25TdHJpbmcgPSBkZW5vbWluYXRpb247XG5cblx0XHRcdGlmICgoc3RhY2tDbGlwICE9IG51bGwpICYmICh2YWx1ZSA8IGRlbm9taW5hdGlvbikpIHtcblxuXHRcdFx0XHR2YXIgdGV4dEZpZWxkID0gbmV3IFBJWEkuVGV4dChkZW5vbWluYXRpb25TdHJpbmcsIHtcblx0XHRcdFx0XHRmb250OiBcImJvbGQgMTJweCBBcmlhbFwiLFxuXHRcdFx0XHRcdGFsaWduOiBcImNlbnRlclwiLFxuXHRcdFx0XHRcdGZpbGw6IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFZhbHVlKFwiY2hpcHNDb2xvcnNcIilbaSAlIFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFZhbHVlKFwiY2hpcHNDb2xvcnNcIikubGVuZ3RoXVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGV4dEZpZWxkLnBvc2l0aW9uLnggPSAoc3RhY2tDbGlwLndpZHRoIC0gdGV4dEZpZWxkLndpZHRoKSAqIDAuNTtcblx0XHRcdFx0dGV4dEZpZWxkLnBvc2l0aW9uLnkgPSBjaGlwUG9zICsgMTE7XG5cdFx0XHRcdHRleHRGaWVsZC5hbHBoYSA9IDAuNTtcblx0XHRcdFx0Lypcblx0XHRcdFx0dGV4dEZpZWxkLndpZHRoID0gc3RhY2tDbGlwLndpZHRoIC0gMTtcblx0XHRcdFx0dGV4dEZpZWxkLmhlaWdodCA9IDIwOyovXG5cblx0XHRcdFx0c3RhY2tDbGlwLmFkZENoaWxkKHRleHRGaWVsZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0c3dpdGNoICh0aGlzLmFsaWduKSB7XG5cdFx0Y2FzZSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5BbGlnbi5MZWZ0OlxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmhvbGRlci54ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLkFsaWduLkNlbnRlcjpcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5ob2xkZXIueCA9IC10aGlzLmhvbGRlci53aWR0aCAvIDI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0Y2FzZSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5BbGlnbi5SaWdodDpcblx0XHRcdHRoaXMuaG9sZGVyLnggPSAtdGhpcy5ob2xkZXIud2lkdGg7XG5cdH1cbn1cblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBTaG93LlxuICogQG1ldGhvZCBzaG93XG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXG5cdHZhciBkZXN0aW5hdGlvbiA9IHtcblx0XHR4OiB0aGlzLnRhcmdldFBvc2l0aW9uLngsXG5cdFx0eTogdGhpcy50YXJnZXRQb3NpdGlvbi55XG5cdH07XG5cdHRoaXMucG9zaXRpb24ueCA9ICh0aGlzLnBhcmVudC53aWR0aCAtIHRoaXMud2lkdGgpICogMC41O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSAtdGhpcy5oZWlnaHQ7XG5cblx0dmFyIGRpZmZYID0gdGhpcy5wb3NpdGlvbi54IC0gZGVzdGluYXRpb24ueDtcblx0dmFyIGRpZmZZID0gdGhpcy5wb3NpdGlvbi55IC0gZGVzdGluYXRpb24ueTtcblx0dmFyIGRpZmYgPSBNYXRoLnNxcnQoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkpO1xuXG5cdHZhciB0d2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0aGlzLnBvc2l0aW9uKVxuXHRcdC50byh7XG5cdFx0XHR4OiBkZXN0aW5hdGlvbi54LFxuXHRcdFx0eTogZGVzdGluYXRpb24ueVxuXHRcdH0sIDMgKiBkaWZmKVxuXHRcdC5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5PdXQpXG5cdFx0Lm9uQ29tcGxldGUodGhpcy5vblNob3dDb21wbGV0ZS5iaW5kKHRoaXMpKVxuXHRcdC5zdGFydCgpO1xufVxuXG4vKipcbiAqIFNob3cgY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uU2hvd0NvbXBsZXRlXG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUub25TaG93Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJhbmltYXRpb25Eb25lXCIsIHRoaXMpO1xufVxuXG4vKipcbiAqIEFuaW1hdGUgaW4uXG4gKiBAbWV0aG9kIGFuaW1hdGVJblxuICovXG5DaGlwc1ZpZXcucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbyA9IHtcblx0XHR5OiBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLnlcblx0fTtcblxuXHRzd2l0Y2ggKHRoaXMuYWxpZ24pIHtcblx0XHRjYXNlIFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLkFsaWduLkxlZnQ6XG5cdFx0XHRvLnggPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLnggLSB0aGlzLndpZHRoIC8gMjtcblxuXHRcdGNhc2UgUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuQWxpZ24uQ2VudGVyOlxuXHRcdFx0by54ID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnQoXCJwb3RQb3NpdGlvblwiKS54O1xuXG5cdFx0Y2FzZSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5BbGlnbi5SaWdodDpcblx0XHRcdG8ueCA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50KFwicG90UG9zaXRpb25cIikueCArIHRoaXMud2lkdGggLyAyO1xuXHR9XG5cblx0dmFyIHRpbWUgPSA1MDA7XG5cdHZhciB0d2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0aGlzKVxuXHRcdC50byh7XG5cdFx0XHR5OiBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLnksXG5cdFx0XHR4OiBvLnhcblx0XHR9LCB0aW1lKVxuXHRcdC5vbkNvbXBsZXRlKHRoaXMub25JbkFuaW1hdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpXG5cdFx0LnN0YXJ0KCk7XG59XG5cbi8qKlxuICogSW4gYW5pbWF0aW9uIGNvbXBsZXRlLlxuICogQG1ldGhvZCBvbkluQW5pbWF0aW9uQ29tcGxldGVcbiAqL1xuQ2hpcHNWaWV3LnByb3RvdHlwZS5vbkluQW5pbWF0aW9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRWYWx1ZSgwKTtcblxuXHR0aGlzLnBvc2l0aW9uLnggPSB0aGlzLnRhcmdldFBvc2l0aW9uLng7XG5cdHRoaXMucG9zaXRpb24ueSA9IHRoaXMudGFyZ2V0UG9zaXRpb24ueTtcblxuXHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJhbmltYXRpb25Eb25lXCIsIHRoaXMpO1xufVxuXG4vKipcbiAqIEFuaW1hdGUgb3V0LlxuICogQG1ldGhvZCBhbmltYXRlT3V0XG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnBvc2l0aW9uLnkgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLnk7XG5cblx0c3dpdGNoICh0aGlzLmFsaWduKSB7XG5cdFx0Y2FzZSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5BbGlnbi5MZWZ0OlxuXHRcdFx0dGhpcy5wb3NpdGlvbi54ID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnQoXCJwb3RQb3NpdGlvblwiKS54IC0gdGhpcy53aWR0aCAvIDI7XG5cblx0XHRjYXNlIFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLkFsaWduLkNlbnRlcjpcblx0XHRcdHRoaXMucG9zaXRpb24ueCA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50KFwicG90UG9zaXRpb25cIikueDtcblxuXHRcdGNhc2UgUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuQWxpZ24uUmlnaHQ6XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnggPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLnggKyB0aGlzLndpZHRoIC8gMjtcblx0fVxuXG5cdHZhciBvID0ge1xuXHRcdHg6IHRoaXMudGFyZ2V0UG9zaXRpb24ueCxcblx0XHR5OiB0aGlzLnRhcmdldFBvc2l0aW9uLnlcblx0fTtcblxuXHR2YXIgdGltZSA9IDUwMDtcblx0dmFyIHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHRoaXMpXG5cdFx0LnRvKG8sIHRpbWUpXG5cdFx0Lm9uQ29tcGxldGUodGhpcy5vbk91dEFuaW1hdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpXG5cdFx0LnN0YXJ0KCk7XG5cbn1cblxuLyoqXG4gKiBPdXQgYW5pbWF0aW9uIGNvbXBsZXRlLlxuICogQG1ldGhvZCBvbk91dEFuaW1hdGlvbkNvbXBsZXRlXG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUub25PdXRBbmltYXRpb25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciB0aW1lID0gNTAwO1xuXHR2YXIgdHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4oe1xuXHRcdFx0eDogMFxuXHRcdH0pXG5cdFx0LnRvKHtcblx0XHRcdHg6IDEwXG5cdFx0fSwgdGltZSlcblx0XHQub25Db21wbGV0ZSh0aGlzLm9uT3V0V2FpdEFuaW1hdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpXG5cdFx0LnN0YXJ0KCk7XG5cblx0dGhpcy5wb3NpdGlvbi54ID0gdGhpcy50YXJnZXRQb3NpdGlvbi54O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSB0aGlzLnRhcmdldFBvc2l0aW9uLnk7XG5cbn1cblxuLyoqXG4gKiBPdXQgd2FpdCBhbmltYXRpb24gY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uT3V0V2FpdEFuaW1hdGlvbkNvbXBsZXRlXG4gKi9cbkNoaXBzVmlldy5wcm90b3R5cGUub25PdXRXYWl0QW5pbWF0aW9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLnNldFZhbHVlKDApO1xuXG5cdHRoaXMuZGlzcGF0Y2hFdmVudChcImFuaW1hdGlvbkRvbmVcIiwgdGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hpcHNWaWV3OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xuXG4vKipcbiAqIERpYWxvZyB2aWV3LlxuICogQGNsYXNzIERlYWxlckJ1dHRvblZpZXdcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIERlYWxlckJ1dHRvblZpZXcoKSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG5cblx0dmFyIGRlYWxlckJ1dHRvblRleHR1cmUgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwiZGVhbGVyQnV0dG9uXCIpO1xuXHR0aGlzLnNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShkZWFsZXJCdXR0b25UZXh0dXJlKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnNwcml0ZSk7XG5cdHRoaXMuaGlkZSgpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKERlYWxlckJ1dHRvblZpZXcsIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChEZWFsZXJCdXR0b25WaWV3KTtcblxuLyoqXG4gKiBTZXQgc2VhdCBpbmRleFxuICogQG1ldGhvZCBzZXRTZWF0SW5kZXhcbiAqL1xuRGVhbGVyQnV0dG9uVmlldy5wcm90b3R5cGUuc2V0U2VhdEluZGV4ID0gZnVuY3Rpb24oc2VhdEluZGV4KSB7XG5cdHRoaXMucG9zaXRpb24ueCA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50cyhcImRlYWxlckJ1dHRvblBvc2l0aW9uc1wiKVtzZWF0SW5kZXhdLng7XG5cdHRoaXMucG9zaXRpb24ueSA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50cyhcImRlYWxlckJ1dHRvblBvc2l0aW9uc1wiKVtzZWF0SW5kZXhdLnk7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudChcImFuaW1hdGlvbkRvbmVcIiwgdGhpcyk7XG59O1xuXG4vKipcbiAqIEFuaW1hdGUgdG8gc2VhdCBpbmRleC5cbiAqIEBtZXRob2QgYW5pbWF0ZVRvU2VhdEluZGV4XG4gKi9cbkRlYWxlckJ1dHRvblZpZXcucHJvdG90eXBlLmFuaW1hdGVUb1NlYXRJbmRleCA9IGZ1bmN0aW9uKHNlYXRJbmRleCkge1xuXHRpZiAoIXRoaXMudmlzaWJsZSkge1xuXHRcdHRoaXMuc2V0U2VhdEluZGV4KHNlYXRJbmRleCk7XG5cdFx0Ly8gdG9kbyBkaXNwYXRjaCBldmVudCB0aGF0IGl0J3MgY29tcGxldGU/XG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiYW5pbWF0aW9uRG9uZVwiLCB0aGlzKTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIGRlc3RpbmF0aW9uID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnRzKFwiZGVhbGVyQnV0dG9uUG9zaXRpb25zXCIpW3NlYXRJbmRleF07XG5cdHZhciBkaWZmWCA9IHRoaXMucG9zaXRpb24ueCAtIGRlc3RpbmF0aW9uLng7XG5cdHZhciBkaWZmWSA9IHRoaXMucG9zaXRpb24ueSAtIGRlc3RpbmF0aW9uLnk7XG5cdHZhciBkaWZmID0gTWF0aC5zcXJ0KGRpZmZYICogZGlmZlggKyBkaWZmWSAqIGRpZmZZKTtcblxuXHR2YXIgdHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odGhpcy5wb3NpdGlvbilcblx0XHQudG8oe1xuXHRcdFx0eDogZGVzdGluYXRpb24ueCxcblx0XHRcdHk6IGRlc3RpbmF0aW9uLnlcblx0XHR9LCA1ICogZGlmZilcblx0XHQuZWFzaW5nKFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuT3V0KVxuXHRcdC5vbkNvbXBsZXRlKHRoaXMub25TaG93Q29tcGxldGUuYmluZCh0aGlzKSlcblx0XHQuc3RhcnQoKTtcbn07XG5cbi8qKlxuICogU2hvdyBDb21wbGV0ZS5cbiAqIEBtZXRob2Qgb25TaG93Q29tcGxldGVcbiAqL1xuRGVhbGVyQnV0dG9uVmlldy5wcm90b3R5cGUub25TaG93Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiYW5pbWF0aW9uRG9uZVwiLCB0aGlzKTtcbn1cblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cbkRlYWxlckJ1dHRvblZpZXcucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cbi8qKlxuICogU2hvdy5cbiAqIEBtZXRob2Qgc2hvd1xuICovXG5EZWFsZXJCdXR0b25WaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oc2VhdEluZGV4LCBhbmltYXRlKSB7XG5cdGlmICh0aGlzLnZpc2libGUgJiYgYW5pbWF0ZSkge1xuXHRcdHRoaXMuYW5pbWF0ZVRvU2VhdEluZGV4KHNlYXRJbmRleCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcblx0XHR0aGlzLnNldFNlYXRJbmRleChzZWF0SW5kZXgpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVhbGVyQnV0dG9uVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgQnV0dG9uID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0J1dHRvblwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcblxuLyoqXG4gKiBEaWFsb2cgYnV0dG9uLlxuICogQGNsYXNzIERpYWxvZ0J1dHRvblxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gRGlhbG9nQnV0dG9uKCkge1xuXHRCdXR0b24uY2FsbCh0aGlzKTtcblxuXHR0aGlzLmJ1dHRvblRleHR1cmUgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwiZGlhbG9nQnV0dG9uXCIpO1xuXHR0aGlzLmFkZENoaWxkKG5ldyBQSVhJLlNwcml0ZSh0aGlzLmJ1dHRvblRleHR1cmUpKTtcblxuXHR2YXIgc3R5bGUgPSB7XG5cdFx0Zm9udDogXCJub3JtYWwgMTRweCBBcmlhbFwiLFxuXHRcdGZpbGw6IFwiI2ZmZmZmZlwiXG5cdH07XG5cblx0dGhpcy50ZXh0RmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW3Rlc3RdXCIsIHN0eWxlKTtcblx0dGhpcy50ZXh0RmllbGQucG9zaXRpb24ueSA9IDE1O1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcblxuXHR0aGlzLnNldFRleHQoXCJCVE5cIik7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoRGlhbG9nQnV0dG9uLCBCdXR0b24pO1xuXG4vKipcbiAqIFNldCB0ZXh0IGZvciB0aGUgYnV0dG9uLlxuICogQG1ldGhvZCBzZXRUZXh0XG4gKi9cbkRpYWxvZ0J1dHRvbi5wcm90b3R5cGUuc2V0VGV4dCA9IGZ1bmN0aW9uKHRleHQpIHtcblx0dGhpcy50ZXh0RmllbGQuc2V0VGV4dCh0ZXh0KTtcblx0dGhpcy50ZXh0RmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cdHRoaXMudGV4dEZpZWxkLnggPSB0aGlzLmJ1dHRvblRleHR1cmUud2lkdGggLyAyIC0gdGhpcy50ZXh0RmllbGQud2lkdGggLyAyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZ0J1dHRvbjsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgTmluZVNsaWNlID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL05pbmVTbGljZVwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBEaWFsb2dCdXR0b24gPSByZXF1aXJlKFwiLi9EaWFsb2dCdXR0b25cIik7XG52YXIgQnV0dG9uRGF0YSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9kYXRhL0J1dHRvbkRhdGFcIik7XG52YXIgUGl4aVRleHRJbnB1dCA9IHJlcXVpcmUoXCJQaXhpVGV4dElucHV0XCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG5cbi8qKlxuICogRGlhbG9nIHZpZXcuXG4gKiBAY2xhc3MgRGlhbG9nVmlld1xuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gRGlhbG9nVmlldygpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGNvdmVyID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0Y292ZXIuYmVnaW5GaWxsKDB4MDAwMDAwLCAuNSk7XG5cdGNvdmVyLmRyYXdSZWN0KDAsIDAsIDk2MCwgNzIwKTtcblx0Y292ZXIuZW5kRmlsbCgpO1xuXHRjb3Zlci5pbnRlcmFjdGl2ZSA9IHRydWU7XG5cdC8vY292ZXIuYnV0dG9uTW9kZSA9IHRydWU7XG5cdGNvdmVyLmhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgOTYwLCA3MjApO1xuXHR0aGlzLmFkZENoaWxkKGNvdmVyKTtcblxuXHR2YXIgYiA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImZyYW1lUGxhdGVcIiksIDEwKTtcblx0Yi5zZXRMb2NhbFNpemUoNDgwLCAyNzApO1xuXHRiLnBvc2l0aW9uLnggPSA0ODAgLSA0ODAgLyAyO1xuXHRiLnBvc2l0aW9uLnkgPSAzNjAgLSAyNzAgLyAyO1xuXHR0aGlzLmFkZENoaWxkKGIpO1xuXG5cdHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwibm9ybWFsIDE0cHggQXJpYWxcIlxuXHR9O1xuXG5cdHRoaXMudGV4dEZpZWxkID0gbmV3IFBJWEkuVGV4dChcIlt0ZXh0XVwiLCBzdHlsZSk7XG5cdHRoaXMudGV4dEZpZWxkLnBvc2l0aW9uLnggPSBiLnBvc2l0aW9uLnggKyAyMDtcblx0dGhpcy50ZXh0RmllbGQucG9zaXRpb24ueSA9IGIucG9zaXRpb24ueSArIDIwO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcblxuXHR0aGlzLmJ1dHRvbnNIb2xkZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMuYnV0dG9uc0hvbGRlci5wb3NpdGlvbi55ID0gNDMwO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuYnV0dG9uc0hvbGRlcik7XG5cdHRoaXMuYnV0dG9ucyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG5cdFx0dmFyIGIgPSBuZXcgRGlhbG9nQnV0dG9uKCk7XG5cblx0XHRiLnBvc2l0aW9uLnggPSBpICogOTA7XG5cdFx0Yi5vbihcImNsaWNrXCIsIHRoaXMub25CdXR0b25DbGljaywgdGhpcyk7XG5cdFx0dGhpcy5idXR0b25zSG9sZGVyLmFkZENoaWxkKGIpO1xuXHRcdHRoaXMuYnV0dG9ucy5wdXNoKGIpO1xuXHR9XG5cblx0c3R5bGUgPSB7XG5cdFx0Zm9udDogXCJub3JtYWwgMThweCBBcmlhbFwiXG5cdH07XG5cblx0dGhpcy5pbnB1dEZpZWxkID0gbmV3IFBpeGlUZXh0SW5wdXQoXCJcIiwgc3R5bGUpO1xuXHR0aGlzLmlucHV0RmllbGQucG9zaXRpb24ueCA9IHRoaXMudGV4dEZpZWxkLnBvc2l0aW9uLng7XG5cblx0dGhpcy5pbnB1dEZyYW1lID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0dGhpcy5pbnB1dEZyYW1lLmJlZ2luRmlsbCgweDAwMDAwMCk7XG5cdHRoaXMuaW5wdXRGcmFtZS5kcmF3UmVjdCgtMSwgLTEsIDEwMiwgMjMpO1xuXHR0aGlzLmlucHV0RnJhbWUucG9zaXRpb24ueCA9IHRoaXMuaW5wdXRGaWVsZC5wb3NpdGlvbi54O1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuaW5wdXRGcmFtZSk7XG5cblx0dGhpcy5hZGRDaGlsZCh0aGlzLmlucHV0RmllbGQpO1xuXG5cdHRoaXMuaGlkZSgpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKERpYWxvZ1ZpZXcsIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChEaWFsb2dWaWV3KTtcblxuRGlhbG9nVmlldy5CVVRUT05fQ0xJQ0sgPSBcImJ1dHRvbkNsaWNrXCI7XG5cbi8qKlxuICogSGlkZS5cbiAqIEBtZXRob2QgaGlkZVxuICovXG5EaWFsb2dWaWV3LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFNob3cuXG4gKiBAbWV0aG9kIHNob3dcbiAqL1xuRGlhbG9nVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKHRleHQsIGJ1dHRvbklkcywgZGVmYXVsdFZhbHVlKSB7XG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cblx0dGhpcy5idXR0b25JZHMgPSBidXR0b25JZHM7XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChpIDwgYnV0dG9uSWRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXVxuXHRcdFx0YnV0dG9uLnNldFRleHQoQnV0dG9uRGF0YS5nZXRCdXR0b25TdHJpbmdGb3JJZChidXR0b25JZHNbaV0pKTtcblx0XHRcdGJ1dHRvbi52aXNpYmxlID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5idXR0b25zW2ldLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmJ1dHRvbnNIb2xkZXIueCA9IDQ4MCAtIGJ1dHRvbklkcy5sZW5ndGggKiA5MCAvIDI7XG5cdHRoaXMudGV4dEZpZWxkLnNldFRleHQodGV4dCk7XG5cblx0aWYgKGRlZmF1bHRWYWx1ZSkge1xuXHRcdHRoaXMuaW5wdXRGaWVsZC5wb3NpdGlvbi55ID0gdGhpcy50ZXh0RmllbGQucG9zaXRpb24ueSArIHRoaXMudGV4dEZpZWxkLmhlaWdodCArIDIwO1xuXHRcdHRoaXMuaW5wdXRGcmFtZS5wb3NpdGlvbi55ID0gdGhpcy5pbnB1dEZpZWxkLnBvc2l0aW9uLnk7XG5cdFx0dGhpcy5pbnB1dEZpZWxkLnZpc2libGUgPSB0cnVlO1xuXHRcdHRoaXMuaW5wdXRGcmFtZS52aXNpYmxlID0gdHJ1ZTtcblxuXHRcdHRoaXMuaW5wdXRGaWVsZC50ZXh0ID0gZGVmYXVsdFZhbHVlO1xuXHRcdHRoaXMuaW5wdXRGaWVsZC5mb2N1cygpO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuaW5wdXRGaWVsZC52aXNpYmxlID0gZmFsc2U7XG5cdFx0dGhpcy5pbnB1dEZyYW1lLnZpc2libGUgPSBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIEhhbmRsZSBidXR0b24gY2xpY2suXG4gKiBAbWV0aG9kIG9uQnV0dG9uQ2xpY2tcbiAqL1xuRGlhbG9nVmlldy5wcm90b3R5cGUub25CdXR0b25DbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIGJ1dHRvbkluZGV4ID0gLTE7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspXG5cdFx0aWYgKGUudGFyZ2V0ID09IHRoaXMuYnV0dG9uc1tpXSlcblx0XHRcdGJ1dHRvbkluZGV4ID0gaTtcblxuXHR2YXIgdmFsdWUgPSBudWxsO1xuXHRpZiAodGhpcy5pbnB1dEZpZWxkLnZpc2libGUpXG5cdFx0dmFsdWUgPSB0aGlzLmlucHV0RmllbGQudGV4dDtcblxuXHR2YXIgZXYgPSB7XG5cdFx0dHlwZTogRGlhbG9nVmlldy5CVVRUT05fQ0xJQ0ssXG5cdFx0YnV0dG9uOiB0aGlzLmJ1dHRvbklkc1tidXR0b25JbmRleF0sXG5cdFx0dmFsdWU6IHZhbHVlXG5cdH07XG5cblx0dGhpcy50cmlnZ2VyKGV2KTtcblx0dGhpcy5oaWRlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlhbG9nVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgR3JhZGllbnQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvR3JhZGllbnRcIik7XG5cbi8qKlxuICogTG9hZGluZyBzY3JlZW4uXG4gKiBAY2xhc3MgTG9hZGluZ1NjcmVlblxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTG9hZGluZ1NjcmVlbigpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGdyYWRpZW50ID0gbmV3IEdyYWRpZW50KCk7XG5cdGdyYWRpZW50LnNldFNpemUoMTAwLCAxMDApO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCIjZmZmZmZmXCIpO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCIjYzBjMGMwXCIpO1xuXG5cdHZhciBzID0gZ3JhZGllbnQuY3JlYXRlU3ByaXRlKCk7XG5cdHMucG9zaXRpb24ueD0tMTAwMDtcblx0cy5wb3NpdGlvbi55PS0xMDAwO1xuXHRzLndpZHRoID0gOTYwKzIwMDA7XG5cdHMuaGVpZ2h0ID0gNzIwKzIwMDA7XG5cdHRoaXMuYWRkQ2hpbGQocyk7XG5cblx0dmFyIHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAyMHB4IEFyaWFsXCIsXG5cdFx0ZmlsbDogXCIjODA4MDgwXCJcblx0fTtcblxuXHR0aGlzLnRleHRGaWVsZCA9IG5ldyBQSVhJLlRleHQoXCJbdGV4dF1cIiwgc3R5bGUpO1xuXHR0aGlzLnRleHRGaWVsZC5wb3NpdGlvbi54ID0gOTYwIC8gMjtcblx0dGhpcy50ZXh0RmllbGQucG9zaXRpb24ueSA9IDcyMCAvIDIgLSB0aGlzLnRleHRGaWVsZC5oZWlnaHQgLyAyO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChMb2FkaW5nU2NyZWVuLCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuXG4vKipcbiAqIFNob3cuXG4gKiBAbWV0aG9kIHNob3dcbiAqL1xuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblx0dGhpcy50ZXh0RmllbGQuc2V0VGV4dChtZXNzYWdlKTtcblx0dGhpcy50ZXh0RmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cdHRoaXMudGV4dEZpZWxkLnggPSA5NjAgLyAyIC0gdGhpcy50ZXh0RmllbGQud2lkdGggLyAyO1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xufVxuXG4vKipcbiAqIEhpZGUuXG4gKiBAbWV0aG9kIGhpZGVcbiAqL1xuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nU2NyZWVuOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xudmFyIFNlYXRWaWV3ID0gcmVxdWlyZShcIi4vU2VhdFZpZXdcIik7XG52YXIgQ2FyZFZpZXcgPSByZXF1aXJlKFwiLi9DYXJkVmlld1wiKTtcbnZhciBDaGF0VmlldyA9IHJlcXVpcmUoXCIuL0NoYXRWaWV3XCIpO1xudmFyIFBvaW50ID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL1BvaW50XCIpO1xudmFyIEdyYWRpZW50ID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0dyYWRpZW50XCIpO1xudmFyIEJ1dHRvbnNWaWV3ID0gcmVxdWlyZShcIi4vQnV0dG9uc1ZpZXdcIik7XG52YXIgRGlhbG9nVmlldyA9IHJlcXVpcmUoXCIuL0RpYWxvZ1ZpZXdcIik7XG52YXIgRGVhbGVyQnV0dG9uVmlldyA9IHJlcXVpcmUoXCIuL0RlYWxlckJ1dHRvblZpZXdcIik7XG52YXIgQ2hpcHNWaWV3ID0gcmVxdWlyZShcIi4vQ2hpcHNWaWV3XCIpO1xudmFyIFBvdFZpZXcgPSByZXF1aXJlKFwiLi9Qb3RWaWV3XCIpO1xudmFyIFRpbWVyVmlldyA9IHJlcXVpcmUoXCIuL1RpbWVyVmlld1wiKTtcbnZhciBTZXR0aW5nc1ZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9TZXR0aW5nc1ZpZXdcIik7XG52YXIgVGFibGVJbmZvVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L1RhYmxlSW5mb1ZpZXdcIik7XG5cbi8qKlxuICogTmV0IHBva2VyIGNsaWVudCB2aWV3LlxuICogQGNsYXNzIE5ldFBva2VyQ2xpZW50Vmlld1xuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnRWaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnNldHVwQmFja2dyb3VuZCgpO1xuXG5cdHRoaXMudGFibGVDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy50YWJsZUNvbnRhaW5lcik7XG5cblx0dGhpcy50YWJsZUJhY2tncm91bmQgPSBuZXcgUElYSS5TcHJpdGUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcInRhYmxlQmFja2dyb3VuZFwiKSk7XG5cdHRoaXMudGFibGVDb250YWluZXIuYWRkQ2hpbGQodGhpcy50YWJsZUJhY2tncm91bmQpO1xuXG5cdHRoaXMuc2V0dXBTZWF0cygpO1xuXHR0aGlzLnNldHVwQ29tbXVuaXR5Q2FyZHMoKTtcblxuXHR0aGlzLnRpbWVyVmlldyA9IG5ldyBUaW1lclZpZXcoKTtcblx0dGhpcy50YWJsZUNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnRpbWVyVmlldyk7XG5cblx0dGhpcy5jaGF0VmlldyA9IG5ldyBDaGF0VmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuY2hhdFZpZXcpO1xuXG5cdHRoaXMuYnV0dG9uc1ZpZXcgPSBuZXcgQnV0dG9uc1ZpZXcoKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNWaWV3KTtcblxuXHR0aGlzLmRlYWxlckJ1dHRvblZpZXcgPSBuZXcgRGVhbGVyQnV0dG9uVmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuZGVhbGVyQnV0dG9uVmlldyk7XG5cblx0dGhpcy50YWJsZUluZm9WaWV3ID0gbmV3IFRhYmxlSW5mb1ZpZXcoKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnRhYmxlSW5mb1ZpZXcpO1xuXG5cdHRoaXMucG90VmlldyA9IG5ldyBQb3RWaWV3KCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5wb3RWaWV3KTtcblx0dGhpcy5wb3RWaWV3LnBvc2l0aW9uLnggPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludChcInBvdFBvc2l0aW9uXCIpLng7XG5cdHRoaXMucG90Vmlldy5wb3NpdGlvbi55ID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnQoXCJwb3RQb3NpdGlvblwiKS55O1xuXG5cdHRoaXMuc2V0dGluZ3NWaWV3ID0gbmV3IFNldHRpbmdzVmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuc2V0dGluZ3NWaWV3KTtcblxuXHR0aGlzLmRpYWxvZ1ZpZXcgPSBuZXcgRGlhbG9nVmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuZGlhbG9nVmlldyk7XG5cblx0dGhpcy5zZXR1cENoaXBzKCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoTmV0UG9rZXJDbGllbnRWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoTmV0UG9rZXJDbGllbnRWaWV3KTtcblxuTmV0UG9rZXJDbGllbnRWaWV3LlNFQVRfQ0xJQ0sgPSBcInNlYXRDbGlja1wiO1xuXG4vKipcbiAqIFNldHVwIGJhY2tncm91bmQuXG4gKiBAbWV0aG9kIHNldHVwQmFja2dyb3VuZFxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLnNldHVwQmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZz1uZXcgUElYSS5HcmFwaGljcygpO1xuXHRnLmJlZ2luRmlsbCgweDA1MzkxZCwxKTtcblx0Zy5kcmF3UmVjdCgtMTAwMCwwLDk2MCsyMDAwLDcyMCk7XG5cdGcuZW5kRmlsbCgpO1xuXHR0aGlzLmFkZENoaWxkKGcpO1xuXG5cdHZhciBnPW5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdGcuYmVnaW5GaWxsKDB4OTA5MDkwLDEpO1xuXHRnLmRyYXdSZWN0KC0xMDAwLDcyMCw5NjArMjAwMCwxMDAwKTtcblx0Zy5lbmRGaWxsKCk7XG5cdHRoaXMuYWRkQ2hpbGQoZyk7XG5cblx0dmFyIGdyYWRpZW50ID0gbmV3IEdyYWRpZW50KCk7XG5cdGdyYWRpZW50LnNldFNpemUoMTAwLCAxMDApO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCIjNjA2MDYwXCIpO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoLjA1LCBcIiNhMGEwYTBcIik7XG5cdGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcIiM5MDkwOTBcIik7XG5cblx0dmFyIHMgPSBncmFkaWVudC5jcmVhdGVTcHJpdGUoKTtcblx0cy5wb3NpdGlvbi55PTUzMDtcblx0cy5wb3NpdGlvbi54PS0xMDAwO1xuXHRzLndpZHRoID0gOTYwKzIwMDA7XG5cdHMuaGVpZ2h0ID0gMTkwO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xuXG5cdHZhciBzID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJkaXZpZGVyTGluZVwiKSk7XG5cdHMueCA9IDM0NTtcblx0cy55ID0gNTQwO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xuXG5cdHZhciBzID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJkaXZpZGVyTGluZVwiKSk7XG5cdHMueCA9IDY5Mztcblx0cy55ID0gNTQwO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xufVxuXG4vKipcbiAqIFNldHVwIHNlYXRzLlxuICogQG1ldGhvZCBzZXJ1cFNlYXRzXG4gKi9cbk5ldFBva2VyQ2xpZW50Vmlldy5wcm90b3R5cGUuc2V0dXBTZWF0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgaSwgajtcblx0dmFyIHBvY2tldENhcmRzO1xuXG5cdHRoaXMuc2VhdFZpZXdzID0gW107XG5cblx0Zm9yIChpID0gMDsgaSA8IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50cyhcInNlYXRQb3NpdGlvbnNcIikubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgc2VhdFZpZXcgPSBuZXcgU2VhdFZpZXcoaSk7XG5cdFx0dmFyIHAgPSBzZWF0Vmlldy5wb3NpdGlvbjtcblxuXHRcdGZvciAoaiA9IDA7IGogPCAyOyBqKyspIHtcblx0XHRcdHZhciBjID0gbmV3IENhcmRWaWV3KCk7XG5cdFx0XHRjLmhpZGUoKTtcblx0XHRcdGMuc2V0VGFyZ2V0UG9zaXRpb24oUG9pbnQocC54ICsgaiAqIDMwIC0gNjAsIHAueSAtIDEwMCkpO1xuXHRcdFx0dGhpcy50YWJsZUNvbnRhaW5lci5hZGRDaGlsZChjKTtcblx0XHRcdHNlYXRWaWV3LmFkZFBvY2tldENhcmQoYyk7XG5cdFx0XHRzZWF0Vmlldy5vbihcImNsaWNrXCIsIHRoaXMub25TZWF0Q2xpY2ssIHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMudGFibGVDb250YWluZXIuYWRkQ2hpbGQoc2VhdFZpZXcpO1xuXHRcdHRoaXMuc2VhdFZpZXdzLnB1c2goc2VhdFZpZXcpO1xuXHR9XG59XG5cbi8qKlxuICogU2V0dXAgY2hpcHMuXG4gKiBAbWV0aG9kIHNlcnVwU2VhdHNcbiAqL1xuTmV0UG9rZXJDbGllbnRWaWV3LnByb3RvdHlwZS5zZXR1cENoaXBzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBpO1xuXHRmb3IgKGkgPSAwOyBpIDwgUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnRzKFwiYmV0UG9zaXRpb25zXCIpLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNoaXBzVmlldyA9IG5ldyBDaGlwc1ZpZXcoKTtcblx0XHR0aGlzLnNlYXRWaWV3c1tpXS5zZXRCZXRDaGlwc1ZpZXcoY2hpcHNWaWV3KTtcblxuXHRcdGNoaXBzVmlldy5zZXRBbGlnbm1lbnQoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VmFsdWUoXCJiZXRBbGlnblwiKVtpXSk7XG5cdFx0Y2hpcHNWaWV3LnNldFRhcmdldFBvc2l0aW9uKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50cyhcImJldFBvc2l0aW9uc1wiKVtpXSk7XG5cdFx0dGhpcy50YWJsZUNvbnRhaW5lci5hZGRDaGlsZChjaGlwc1ZpZXcpO1xuXHR9XG59XG5cbi8qKlxuICogU2VhdCBjbGljay5cbiAqIEBtZXRob2Qgb25TZWF0Q2xpY2tcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50Vmlldy5wcm90b3R5cGUub25TZWF0Q2xpY2sgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBzZWF0SW5kZXggPSAtMTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VhdFZpZXdzLmxlbmd0aDsgaSsrKVxuXHRcdGlmIChlLnRhcmdldCA9PSB0aGlzLnNlYXRWaWV3c1tpXSlcblx0XHRcdHNlYXRJbmRleCA9IGk7XG5cblx0Y29uc29sZS5sb2coXCJzZWF0IGNsaWNrOiBcIiArIHNlYXRJbmRleCk7XG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogTmV0UG9rZXJDbGllbnRWaWV3LlNFQVRfQ0xJQ0ssXG5cdFx0c2VhdEluZGV4OiBzZWF0SW5kZXhcblx0fSk7XG59XG5cbi8qKlxuICogU2V0dXAgY29tbXVuaXR5IGNhcmRzLlxuICogQG1ldGhvZCBzZXR1cENvbW11bml0eUNhcmRzXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLnNldHVwQ29tbXVuaXR5Q2FyZHMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jb21tdW5pdHlDYXJkcyA9IFtdO1xuXG5cdHZhciBwID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnQoXCJjb21tdW5pdHlDYXJkc1Bvc2l0aW9uXCIpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCA1OyBpKyspIHtcblx0XHR2YXIgY2FyZFZpZXcgPSBuZXcgQ2FyZFZpZXcoKTtcblx0XHRjYXJkVmlldy5oaWRlKCk7XG5cdFx0Y2FyZFZpZXcuc2V0VGFyZ2V0UG9zaXRpb24oUG9pbnQocC54ICsgaSAqIDkwLCBwLnkpKTtcblxuXHRcdHRoaXMuY29tbXVuaXR5Q2FyZHMucHVzaChjYXJkVmlldyk7XG5cdFx0dGhpcy50YWJsZUNvbnRhaW5lci5hZGRDaGlsZChjYXJkVmlldyk7XG5cdH1cbn1cblxuLyoqXG4gKiBHZXQgc2VhdCB2aWV3IGJ5IGluZGV4LlxuICogQG1ldGhvZCBnZXRTZWF0Vmlld0J5SW5kZXhcbiAqL1xuTmV0UG9rZXJDbGllbnRWaWV3LnByb3RvdHlwZS5nZXRTZWF0Vmlld0J5SW5kZXggPSBmdW5jdGlvbihpbmRleCkge1xuXHRyZXR1cm4gdGhpcy5zZWF0Vmlld3NbaW5kZXhdO1xufVxuXG4vKipcbiAqIEdldCBzZWF0IHZpZXcgYnkgaW5kZXguXG4gKiBAbWV0aG9kIGdldFNlYXRWaWV3QnlJbmRleFxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldENvbW11bml0eUNhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbW11bml0eUNhcmRzO1xufVxuXG4vKipcbiAqIEdldCBidXR0b25zIHZpZXcuXG4gKiBAbWV0aG9kIGdldFNlYXRWaWV3QnlJbmRleFxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldEJ1dHRvbnNWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmJ1dHRvbnNWaWV3O1xufVxuXG4vKipcbiAqIEdldCBkaWFsb2cgdmlldy5cbiAqIEBtZXRob2QgZ2V0RGlhbG9nVmlld1xuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldERpYWxvZ1ZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZGlhbG9nVmlldztcbn1cblxuLyoqXG4gKiBHZXQgZGlhbG9nIHZpZXcuXG4gKiBAbWV0aG9kIGdldERlYWxlckJ1dHRvblZpZXdcbiAqL1xuTmV0UG9rZXJDbGllbnRWaWV3LnByb3RvdHlwZS5nZXREZWFsZXJCdXR0b25WaWV3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmRlYWxlckJ1dHRvblZpZXc7XG59XG5cbi8qKlxuICogR2V0IHRhYmxlIGluZm8gdmlldy5cbiAqIEBtZXRob2QgZ2V0VGFibGVJbmZvVmlld1xuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldFRhYmxlSW5mb1ZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFibGVJbmZvVmlldztcbn1cblxuLyoqXG4gKiBDbGVhciBldmVyeXRoaW5nIHRvIGFuIGVtcHR5IHN0YXRlLlxuICogQG1ldGhvZCBjbGVhclxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciBpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvbW11bml0eUNhcmRzLmxlbmd0aDsgaSsrKVxuXHRcdHRoaXMuY29tbXVuaXR5Q2FyZHNbaV0uaGlkZSgpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlYXRWaWV3cy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLnNlYXRWaWV3c1tpXS5jbGVhcigpO1xuXG5cdHRoaXMudGltZXJWaWV3LmhpZGUoKTtcblx0dGhpcy5wb3RWaWV3LnNldFZhbHVlcyhuZXcgQXJyYXkoKSk7XG5cdHRoaXMuZGVhbGVyQnV0dG9uVmlldy5oaWRlKCk7XG5cdHRoaXMuY2hhdFZpZXcuY2xlYXIoKTtcblxuXHR0aGlzLmRpYWxvZ1ZpZXcuaGlkZSgpO1xuXHR0aGlzLmJ1dHRvbnNWaWV3LmNsZWFyKCk7XG5cblx0dGhpcy50YWJsZUluZm9WaWV3LmNsZWFyKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0UG9rZXJDbGllbnRWaWV3OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIENoaXBzVmlldyA9IHJlcXVpcmUoXCIuL0NoaXBzVmlld1wiKTtcblxuLyoqXG4gKiBBIHBvdCB2aWV3XG4gKiBAY2xhc3MgUG90Vmlld1xuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuZnVuY3Rpb24gUG90VmlldygpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cdFxuXHR0aGlzLnZhbHVlID0gMDtcblxuXHR0aGlzLmhvbGRlciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmhvbGRlcik7XG5cblx0dGhpcy5zdGFja3MgPSBuZXcgQXJyYXkoKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChQb3RWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoUG90Vmlldyk7XG5cbi8qKlxuICogU2V0IHZhbHVlLlxuICogQG1ldGhvZCBzZXRWYWx1ZVxuICovXG5Qb3RWaWV3LnByb3RvdHlwZS5zZXRWYWx1ZXMgPSBmdW5jdGlvbih2YWx1ZXMpIHtcblx0XG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YWNrcy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLmhvbGRlci5yZW1vdmVDaGlsZCh0aGlzLnN0YWNrc1tpXSk7XG5cblx0dGhpcy5zdGFja3MgPSBuZXcgQXJyYXkoKTtcblxuXHR2YXIgcG9zID0gMDtcblxuXHRmb3IodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNoaXBzID0gbmV3IENoaXBzVmlldyhmYWxzZSk7XG5cdFx0dGhpcy5zdGFja3MucHVzaChjaGlwcyk7XG5cdFx0dGhpcy5ob2xkZXIuYWRkQ2hpbGQoY2hpcHMpO1xuXHRcdGNoaXBzLnNldFZhbHVlKHZhbHVlc1tpXSk7XG5cdFx0Y2hpcHMueCA9IHBvcztcblx0XHRwb3MgKz0gTWF0aC5mbG9vcihjaGlwcy53aWR0aCArIDIwKTtcblxuXHRcdHZhciB0ZXh0RmllbGQgPSBuZXcgUElYSS5UZXh0KHZhbHVlc1tpXSwge1xuXHRcdFx0Zm9udDogXCJib2xkIDEycHggQXJpYWxcIixcblx0XHRcdGFsaWduOiBcImNlbnRlclwiLFxuXHRcdFx0ZmlsbDogXCIjZmZmZmZmXCJcblx0XHR9KTtcblxuXHRcdHRleHRGaWVsZC5wb3NpdGlvbi54ID0gKGNoaXBzLndpZHRoIC0gdGV4dEZpZWxkLndpZHRoKSowLjU7XG5cdFx0dGV4dEZpZWxkLnBvc2l0aW9uLnkgPSAzMDtcblxuXHRcdGNoaXBzLmFkZENoaWxkKHRleHRGaWVsZCk7XG5cdH1cblxuXHR0aGlzLmhvbGRlci54ID0gLXRoaXMuaG9sZGVyLndpZHRoKjAuNTtcbn1cblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cblBvdFZpZXcucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cbi8qKlxuICogU2hvdy5cbiAqIEBtZXRob2Qgc2hvd1xuICovXG5Qb3RWaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3RWaWV3OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBCdXR0b24gPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvQnV0dG9uXCIpO1xudmFyIE5pbmVTbGljZSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9OaW5lU2xpY2VcIik7XG52YXIgUmVzb3VyY2VzID0gcmVxdWlyZShcIi4uL3Jlc291cmNlcy9SZXNvdXJjZXNcIik7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vYXBwL1NldHRpbmdzXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgQ2hlY2tib3ggPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvQ2hlY2tib3hcIik7XG5cbi8qKlxuICogUmFpc2Ugc2hvcnRjdXQgYnV0dG9uXG4gKiBAY2xhc3MgUmFpc2VTaG9ydGN1dEJ1dHRvblxuICogQG1vZHVsZSBjbGllbnRcbiAqL1xuIGZ1bmN0aW9uIFJhaXNlU2hvcnRjdXRCdXR0b24oKSB7XG4gXHR2YXIgYmFja2dyb3VuZCA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImJ1dHRvbkJhY2tncm91bmRcIiksIDEwLCA1LCAxMCwgNSk7XG4gXHRiYWNrZ3JvdW5kLndpZHRoID0gMTA1O1xuIFx0YmFja2dyb3VuZC5oZWlnaHQgPSAyNTtcblx0QnV0dG9uLmNhbGwodGhpcywgYmFja2dyb3VuZCk7XG5cbiBcdHZhciBzdHlsZU9iamVjdCA9IHtcbiBcdFx0d2lkdGg6IDEwNSxcbiBcdFx0aGVpZ2h0OiAyMCxcbiBcdFx0Zm9udDogXCJib2xkIDE0cHggQXJpYWxcIixcbiBcdFx0Y29sb3I6IFwid2hpdGVcIlxuIFx0fTtcblx0dGhpcy5sYWJlbCA9IG5ldyBQSVhJLlRleHQoXCJcIiwgc3R5bGVPYmplY3QpO1xuXHR0aGlzLmxhYmVsLnBvc2l0aW9uLnggPSA4O1xuXHR0aGlzLmxhYmVsLnBvc2l0aW9uLnkgPSA0O1xuXHR0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKFJhaXNlU2hvcnRjdXRCdXR0b24sIEJ1dHRvbik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChSYWlzZVNob3J0Y3V0QnV0dG9uKTtcblxuLyoqXG4gKiBTZXR0ZXIuXG4gKiBAbWV0aG9kIHNldFRleHRcbiAqL1xuUmFpc2VTaG9ydGN1dEJ1dHRvbi5wcm90b3R5cGUuc2V0VGV4dCA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHR0aGlzLmxhYmVsLnNldFRleHQoc3RyaW5nKTtcblx0cmV0dXJuIHN0cmluZztcbn1cblxuLyoqXG4gKiBTZXQgZW5hYmxlZC5cbiAqIEBtZXRob2Qgc2V0RW5hYmxlZFxuICovXG5SYWlzZVNob3J0Y3V0QnV0dG9uLnByb3RvdHlwZS5zZXRFbmFibGVkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYodmFsdWUpIHtcblx0XHR0aGlzLmFscGhhID0gMTtcblx0XHR0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcblx0XHR0aGlzLmJ1dHRvbk1vZGUgPSB0cnVlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoaXMuYWxwaGEgPSAwLjU7XG5cdFx0dGhpcy5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuXHRcdHRoaXMuYnV0dG9uTW9kZSA9IGZhbHNlO1xuXHR9XG5cdHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYWlzZVNob3J0Y3V0QnV0dG9uOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBCdXR0b24gPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvQnV0dG9uXCIpO1xuXG4vKipcbiAqIEEgc2VhdCB2aWV3LlxuICogQGNsYXNzIFNlYXRWaWV3XG4gKiBAbW9kdWxlIGNsaWVudFxuICovXG5mdW5jdGlvbiBTZWF0VmlldyhzZWF0SW5kZXgpIHtcblx0QnV0dG9uLmNhbGwodGhpcyk7XG5cblx0dGhpcy5wb2NrZXRDYXJkcyA9IFtdO1xuXHR0aGlzLnNlYXRJbmRleCA9IHNlYXRJbmRleDtcblxuXHR2YXIgc2VhdFRleHR1cmUgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwic2VhdFBsYXRlXCIpO1xuXHR2YXIgc2VhdFNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShzZWF0VGV4dHVyZSk7XG5cblx0c2VhdFNwcml0ZS5wb3NpdGlvbi54ID0gLXNlYXRUZXh0dXJlLndpZHRoIC8gMjtcblx0c2VhdFNwcml0ZS5wb3NpdGlvbi55ID0gLXNlYXRUZXh0dXJlLmhlaWdodCAvIDI7XG5cblx0dGhpcy5hZGRDaGlsZChzZWF0U3ByaXRlKTtcblxuXHR2YXIgcG9zID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0UG9pbnRzKFwic2VhdFBvc2l0aW9uc1wiKVt0aGlzLnNlYXRJbmRleF07XG5cblx0dGhpcy5wb3NpdGlvbi54ID0gcG9zLng7XG5cdHRoaXMucG9zaXRpb24ueSA9IHBvcy55O1xuXG5cdHZhciBzdHlsZTtcblxuXHRzdHlsZSA9IHtcblx0XHRmb250OiBcImJvbGQgMjBweCBBcmlhbFwiXG5cdH07XG5cblx0dGhpcy5uYW1lRmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW25hbWVdXCIsIHN0eWxlKTtcblx0dGhpcy5uYW1lRmllbGQucG9zaXRpb24ueSA9IC0yMDtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLm5hbWVGaWVsZCk7XG5cblx0c3R5bGUgPSB7XG5cdFx0Zm9udDogXCJub3JtYWwgMTJweCBBcmlhbFwiXG5cdH07XG5cblx0dGhpcy5jaGlwc0ZpZWxkID0gbmV3IFBJWEkuVGV4dChcIltuYW1lXVwiLCBzdHlsZSk7XG5cdHRoaXMuY2hpcHNGaWVsZC5wb3NpdGlvbi55ID0gNTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmNoaXBzRmllbGQpO1xuXG5cdHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAyMHB4IEFyaWFsXCJcblx0fTtcblxuXHR0aGlzLmFjdGlvbkZpZWxkID0gbmV3IFBJWEkuVGV4dChcImFjdGlvblwiLCBzdHlsZSk7XG5cdHRoaXMuYWN0aW9uRmllbGQucG9zaXRpb24ueSA9IC0xMztcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmFjdGlvbkZpZWxkKTtcblx0dGhpcy5hY3Rpb25GaWVsZC5hbHBoYSA9IDA7XG5cblx0dGhpcy5zZXROYW1lKFwiXCIpO1xuXHR0aGlzLnNldENoaXBzKFwiXCIpO1xuXG5cdHRoaXMuYmV0Q2hpcHMgPSBudWxsO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKFNlYXRWaWV3LCBCdXR0b24pO1xuXG4vKipcbiAqIFNldCByZWZlcmVuY2UgdG8gYmV0IGNoaXBzLlxuICogQG1ldGhvZCBzZXRCZXRDaGlwc1ZpZXdcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLnNldEJldENoaXBzVmlldyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMuYmV0Q2hpcHMgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXQgbmFtZS5cbiAqIEBtZXRob2Qgc2V0TmFtZVxuICovXG5TZWF0Vmlldy5wcm90b3R5cGUuc2V0TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0dGhpcy5uYW1lRmllbGQuc2V0VGV4dChuYW1lKTtcblx0dGhpcy5uYW1lRmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cblx0dGhpcy5uYW1lRmllbGQucG9zaXRpb24ueCA9IC10aGlzLm5hbWVGaWVsZC5jYW52YXMud2lkdGggLyAyO1xufVxuXG4vKipcbiAqIFNldCBuYW1lLlxuICogQG1ldGhvZCBzZXRDaGlwc1xuICovXG5TZWF0Vmlldy5wcm90b3R5cGUuc2V0Q2hpcHMgPSBmdW5jdGlvbihjaGlwcykge1xuXHR0aGlzLmNoaXBzRmllbGQuc2V0VGV4dChjaGlwcyk7XG5cdHRoaXMuY2hpcHNGaWVsZC51cGRhdGVUcmFuc2Zvcm0oKTtcblxuXHR0aGlzLmNoaXBzRmllbGQucG9zaXRpb24ueCA9IC10aGlzLmNoaXBzRmllbGQuY2FudmFzLndpZHRoIC8gMjtcbn1cblxuLyoqXG4gKiBTZXQgc2l0b3V0LlxuICogQG1ldGhvZCBzZXRTaXRvdXRcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLnNldFNpdG91dCA9IGZ1bmN0aW9uKHNpdG91dCkge1xuXHRpZiAoc2l0b3V0KVxuXHRcdHRoaXMuYWxwaGEgPSAuNTtcblxuXHRlbHNlXG5cdFx0dGhpcy5hbHBoYSA9IDE7XG59XG5cbi8qKlxuICogU2V0IHNpdG91dC5cbiAqIEBtZXRob2Qgc2V0QWN0aXZlXG4gKi9cblNlYXRWaWV3LnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbihhY3RpdmUpIHtcblx0dGhpcy52aXNpYmxlID0gYWN0aXZlO1xufVxuXG4vKipcbiAqIEFkZCBwb2NrZXQgY2FyZC5cbiAqIEBtZXRob2QgYWRkUG9ja2V0Q2FyZFxuICovXG5TZWF0Vmlldy5wcm90b3R5cGUuYWRkUG9ja2V0Q2FyZCA9IGZ1bmN0aW9uKGNhcmRWaWV3KSB7XG5cdHRoaXMucG9ja2V0Q2FyZHMucHVzaChjYXJkVmlldyk7XG59XG5cbi8qKlxuICogR2V0IHBvY2tldCBjYXJkcy5cbiAqIEBtZXRob2QgZ2V0UG9ja2V0Q2FyZHNcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLmdldFBvY2tldENhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnBvY2tldENhcmRzO1xufVxuXG4vKipcbiAqIEZvbGQgY2FyZHMuXG4gKiBAbWV0aG9kIGZvbGRDYXJkc1xuICovXG5TZWF0Vmlldy5wcm90b3R5cGUuZm9sZENhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucG9ja2V0Q2FyZHNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbkRvbmVcIiwgdGhpcy5vbkZvbGRDb21wbGV0ZSwgdGhpcyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wb2NrZXRDYXJkcy5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMucG9ja2V0Q2FyZHNbaV0uZm9sZCgpO1xuXHR9XG59XG5cbi8qKlxuICogRm9sZCBjb21wbGV0ZS5cbiAqIEBtZXRob2Qgb25Gb2xkQ29tcGxldGVcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLm9uRm9sZENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucG9ja2V0Q2FyZHNbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbkRvbmVcIiwgdGhpcy5vbkZvbGRDb21wbGV0ZSwgdGhpcyk7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudChcImFuaW1hdGlvbkRvbmVcIik7XG59XG5cbi8qKlxuICogU2hvdyB1c2VyIGFjdGlvbi5cbiAqIEBtZXRob2QgYWN0aW9uXG4gKi9cblNlYXRWaWV3LnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbihhY3Rpb24pIHtcblx0dGhpcy5hY3Rpb25GaWVsZC5zZXRUZXh0KGFjdGlvbik7XG5cdHRoaXMuYWN0aW9uRmllbGQucG9zaXRpb24ueCA9IC10aGlzLmFjdGlvbkZpZWxkLmNhbnZhcy53aWR0aCAvIDI7XG5cblx0dGhpcy5hY3Rpb25GaWVsZC5hbHBoYSA9IDE7XG5cdHRoaXMubmFtZUZpZWxkLmFscGhhID0gMDtcblx0dGhpcy5jaGlwc0ZpZWxkLmFscGhhID0gMDtcblxuXHRzZXRUaW1lb3V0KHRoaXMub25UaW1lci5iaW5kKHRoaXMpLCAxMDAwKTtcbn1cblxuLyoqXG4gKiBTaG93IHVzZXIgYWN0aW9uLlxuICogQG1ldGhvZCBhY3Rpb25cbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLm9uVGltZXIgPSBmdW5jdGlvbihhY3Rpb24pIHtcblxuXHR2YXIgdDEgPSBuZXcgVFdFRU4uVHdlZW4odGhpcy5hY3Rpb25GaWVsZClcblx0XHQudG8oe1xuXHRcdFx0YWxwaGE6IDBcblx0XHR9LCAxMDAwKVxuXHRcdC5zdGFydCgpO1xuXHR2YXIgdDIgPSBuZXcgVFdFRU4uVHdlZW4odGhpcy5uYW1lRmllbGQpXG5cdFx0LnRvKHtcblx0XHRcdGFscGhhOiAxXG5cdFx0fSwgMTAwMClcblx0XHQuc3RhcnQoKTtcblx0dmFyIHQzID0gbmV3IFRXRUVOLlR3ZWVuKHRoaXMuY2hpcHNGaWVsZClcblx0XHQudG8oe1xuXHRcdFx0YWxwaGE6IDFcblx0XHR9LCAxMDAwKVxuXHRcdC5zdGFydCgpO1xuXG59XG5cbi8qKlxuICogQ2xlYXIuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cblNlYXRWaWV3LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgaTtcblxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXHR0aGlzLnNpdG91dCA9IGZhbHNlO1xuXHR0aGlzLmJldENoaXBzLnNldFZhbHVlKDApO1xuXHR0aGlzLnNldE5hbWUoXCJcIik7XG5cdHRoaXMuc2V0Q2hpcHMoXCJcIik7XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMucG9ja2V0Q2FyZHMubGVuZ3RoOyBpKyspXG5cdFx0dGhpcy5wb2NrZXRDYXJkc1tpXS5oaWRlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhdFZpZXc7IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBUV0VFTiA9IHJlcXVpcmUoXCJ0d2Vlbi5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIEJ1dHRvbiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9CdXR0b25cIik7XG52YXIgTmluZVNsaWNlID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL05pbmVTbGljZVwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuLi9hcHAvU2V0dGluZ3NcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBDaGVja2JveCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9DaGVja2JveFwiKTtcblxuLyoqXG4gKiBDaGVja2JveGVzIHZpZXdcbiAqIEBjbGFzcyBTZXR0aW5nc0NoZWNrYm94XG4gKiBAbW9kdWxlIGNsaWVudFxuICovXG5mdW5jdGlvbiBTZXR0aW5nc0NoZWNrYm94KGlkLCBzdHJpbmcpIHtcbiBcdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gXHR0aGlzLmlkID0gaWQ7XG5cbiBcdHZhciB5ID0gMDtcblxuIFx0dmFyIHN0eWxlT2JqZWN0ID0ge1xuIFx0XHR3aWR0aDogMjAwLFxuIFx0XHRoZWlnaHQ6IDI1LFxuIFx0XHRmb250OiBcImJvbGQgMTNweCBBcmlhbFwiLFxuIFx0XHRjb2xvcjogXCJ3aGl0ZVwiXG4gXHR9O1xuIFx0dGhpcy5sYWJlbCA9IG5ldyBQSVhJLlRleHQoc3RyaW5nLCBzdHlsZU9iamVjdCk7XG4gXHR0aGlzLmxhYmVsLnBvc2l0aW9uLnggPSAyNTtcbiBcdHRoaXMubGFiZWwucG9zaXRpb24ueSA9IHkgKyAxO1xuIFx0dGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuIFx0dmFyIGJhY2tncm91bmQgPSBuZXcgUElYSS5TcHJpdGUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImNoZWNrYm94QmFja2dyb3VuZFwiKSk7XG4gXHR2YXIgdGljayA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwiY2hlY2tib3hUaWNrXCIpKTtcbiBcdHRpY2sueCA9IDE7XG5cbiBcdHRoaXMuY2hlY2tib3ggPSBuZXcgQ2hlY2tib3goYmFja2dyb3VuZCwgdGljayk7XG4gXHR0aGlzLmNoZWNrYm94LnBvc2l0aW9uLnkgPSB5O1xuIFx0dGhpcy5hZGRDaGlsZCh0aGlzLmNoZWNrYm94KTtcblxuIFx0dGhpcy5jaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25DaGVja2JveENoYW5nZSwgdGhpcyk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoU2V0dGluZ3NDaGVja2JveCwgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KFNldHRpbmdzQ2hlY2tib3gpO1xuXG4vKipcbiAqIENoZWNrYm94IGNoYW5nZS5cbiAqIEBtZXRob2Qgb25DaGVja2JveENoYW5nZVxuICovXG5TZXR0aW5nc0NoZWNrYm94LnByb3RvdHlwZS5vbkNoZWNrYm94Q2hhbmdlID0gZnVuY3Rpb24oaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudChcImNoYW5nZVwiLCB0aGlzKTtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldENoZWNrZWRcbiAqL1xuU2V0dGluZ3NDaGVja2JveC5wcm90b3R5cGUuZ2V0Q2hlY2tlZCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jaGVja2JveC5nZXRDaGVja2VkKCk7XG59XG5cbi8qKlxuICogU2V0dGVyLlxuICogQG1ldGhvZCBzZXRDaGVja2VkXG4gKi9cblNldHRpbmdzQ2hlY2tib3gucHJvdG90eXBlLnNldENoZWNrZWQgPSBmdW5jdGlvbihjaGVja2VkKSB7XG5cdHRoaXMuY2hlY2tib3guc2V0Q2hlY2tlZChjaGVja2VkKTtcblx0cmV0dXJuIGNoZWNrZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3NDaGVja2JveDsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIFRXRUVOID0gcmVxdWlyZShcInR3ZWVuLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgQnV0dG9uID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0J1dHRvblwiKTtcbnZhciBOaW5lU2xpY2UgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvTmluZVNsaWNlXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xudmFyIFNldHRpbmdzID0gcmVxdWlyZShcIi4uL2FwcC9TZXR0aW5nc1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIFNldHRpbmdzQ2hlY2tib3ggPSByZXF1aXJlKFwiLi9TZXR0aW5nc0NoZWNrYm94XCIpO1xudmFyIFJhaXNlU2hvcnRjdXRCdXR0b24gPSByZXF1aXJlKFwiLi9SYWlzZVNob3J0Y3V0QnV0dG9uXCIpO1xudmFyIENoZWNrYm94TWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9DaGVja2JveE1lc3NhZ2VcIik7XG5cbi8qKlxuICogQSBzZXR0aW5ncyB2aWV3XG4gKiBAY2xhc3MgU2V0dGluZ3NWaWV3XG4gKiBAbW9kdWxlIGNsaWVudFxuICovXG5mdW5jdGlvbiBTZXR0aW5nc1ZpZXcoKSB7XG4gXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuIFx0dmFyIG9iamVjdCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiBcdHZhciBiZyA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZ2V0VGV4dHVyZShcImNoYXRCYWNrZ3JvdW5kXCIpLCAxMCwgMTAsIDEwLCAxMCk7XG4gXHRiZy53aWR0aCA9IDMwO1xuIFx0YmcuaGVpZ2h0ID0gMzA7XG4gXHRvYmplY3QuYWRkQ2hpbGQoYmcpO1xuXG4gXHR2YXIgc3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJ3cmVuY2hJY29uXCIpKTtcbiBcdHNwcml0ZS54ID0gNTtcbiBcdHNwcml0ZS55ID0gNTtcbiBcdG9iamVjdC5hZGRDaGlsZChzcHJpdGUpO1xuXG4gXHR0aGlzLnNldHRpbmdzQnV0dG9uID0gbmV3IEJ1dHRvbihvYmplY3QpO1xuIFx0dGhpcy5zZXR0aW5nc0J1dHRvbi5wb3NpdGlvbi54ID0gOTYwIC0gMTAgLSB0aGlzLnNldHRpbmdzQnV0dG9uLndpZHRoO1xuIFx0dGhpcy5zZXR0aW5nc0J1dHRvbi5wb3NpdGlvbi55ID0gNTQzO1xuIFx0dGhpcy5zZXR0aW5nc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKEJ1dHRvbi5DTElDSywgdGhpcy5vblNldHRpbmdzQnV0dG9uQ2xpY2ssIHRoaXMpO1xuIFx0dGhpcy5hZGRDaGlsZCh0aGlzLnNldHRpbmdzQnV0dG9uKTtcblxuIFx0dGhpcy5zZXR0aW5nc01lbnUgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gXHRcbiBcdHZhciBtYmcgPSBuZXcgTmluZVNsaWNlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmUoXCJjaGF0QmFja2dyb3VuZFwiKSwgMTAsIDEwLCAxMCwgMTApO1xuIFx0bWJnLndpZHRoID0gMjUwO1xuIFx0bWJnLmhlaWdodCA9IDEwMDtcbiBcdHRoaXMuc2V0dGluZ3NNZW51LmFkZENoaWxkKG1iZyk7XG5cbiBcdHZhciBzdHlsZU9iamVjdCA9IHtcbiBcdFx0Zm9udDogXCJib2xkIDE0cHggQXJpYWxcIixcbiBcdFx0Y29sb3I6IFwiI0ZGRkZGRlwiLFxuIFx0XHR3aWR0aDogMjAwLFxuIFx0XHRoZWlnaHQ6IDIwXG4gXHR9O1xuIFx0dmFyIGxhYmVsID0gbmV3IFBJWEkuVGV4dChcIlNldHRpbmdzXCIsIHN0eWxlT2JqZWN0KTtcbiBcdGxhYmVsLnBvc2l0aW9uLnggPSAxNjtcbiBcdGxhYmVsLnBvc2l0aW9uLnkgPSAxMDtcblxuIFx0dGhpcy5zZXR0aW5nc01lbnUuYWRkQ2hpbGQobGFiZWwpO1xuIFx0dGhpcy5zZXR0aW5nc01lbnUucG9zaXRpb24ueCA9IDk2MCAtIDEwIC0gdGhpcy5zZXR0aW5nc01lbnUud2lkdGg7XG4gXHR0aGlzLnNldHRpbmdzTWVudS5wb3NpdGlvbi55ID0gNTM4IC0gdGhpcy5zZXR0aW5nc01lbnUuaGVpZ2h0O1xuIFx0dGhpcy5hZGRDaGlsZCh0aGlzLnNldHRpbmdzTWVudSk7XG5cbiBcdHRoaXMuc2V0dGluZ3MgPSB7fTtcblxuIFx0dGhpcy5jcmVhdGVNZW51U2V0dGluZyhcInBsYXlBbmltYXRpb25zXCIsIFwiUGxheSBhbmltYXRpb25zXCIsIDQwLCBTZXR0aW5ncy5nZXRJbnN0YW5jZSgpLnBsYXlBbmltYXRpb25zKTtcbiBcdHRoaXMuY3JlYXRlTWVudVNldHRpbmcoQ2hlY2tib3hNZXNzYWdlLkFVVE9fTVVDS19MT1NJTkcsIFwiTXVjayBsb3NpbmcgaGFuZHNcIiwgNjUpO1xuXG4gXHR0aGlzLmNyZWF0ZVNldHRpbmcoQ2hlY2tib3hNZXNzYWdlLkFVVE9fUE9TVF9CTElORFMsIFwiUG9zdCBibGluZHNcIiwgMCk7XG4gXHR0aGlzLmNyZWF0ZVNldHRpbmcoQ2hlY2tib3hNZXNzYWdlLlNJVE9VVF9ORVhULCBcIlNpdCBvdXRcIiwgMjUpO1xuXG4gXHR0aGlzLnNldHRpbmdzTWVudS52aXNpYmxlID0gZmFsc2U7XG5cbiBcdHRoaXMuYnV5Q2hpcHNCdXR0b24gPSBuZXcgUmFpc2VTaG9ydGN1dEJ1dHRvbigpO1xuIFx0dGhpcy5idXlDaGlwc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkJ1eUNoaXBzQ2xpY2ssIHRoaXMpO1xuIFx0dGhpcy5idXlDaGlwc0J1dHRvbi54ID0gNzAwO1xuIFx0dGhpcy5idXlDaGlwc0J1dHRvbi55ID0gNjM1O1xuIFx0dGhpcy5idXlDaGlwc0J1dHRvbi5zZXRUZXh0KFwiQnV5IGNoaXBzXCIpO1xuIFx0dGhpcy5hZGRDaGlsZCh0aGlzLmJ1eUNoaXBzQnV0dG9uKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChTZXR0aW5nc1ZpZXcsIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChTZXR0aW5nc1ZpZXcpO1xuXG5TZXR0aW5nc1ZpZXcuQlVZX0NISVBTX0NMSUNLID0gXCJidXlDaGlwc0NsaWNrXCI7XG5cbi8qKlxuICogT24gYnV5IGNoaXBzIGJ1dHRvbiBjbGlja2VkLlxuICogQG1ldGhvZCBvbkJ1eUNoaXBzQ2xpY2tcbiAqL1xuU2V0dGluZ3NWaWV3LnByb3RvdHlwZS5vbkJ1eUNoaXBzQ2xpY2sgPSBmdW5jdGlvbihpbnRlcmFjdGlvbl9vYmplY3QpIHtcblx0Y29uc29sZS5sb2coXCJidXkgY2hpcHMgY2xpY2tcIik7XG5cdHRoaXMuZGlzcGF0Y2hFdmVudChTZXR0aW5nc1ZpZXcuQlVZX0NISVBTX0NMSUNLKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgY2hlY2tib3guXG4gKiBAbWV0aG9kIGNyZWF0ZU1lbnVTZXR0aW5nXG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUuY3JlYXRlTWVudVNldHRpbmcgPSBmdW5jdGlvbihpZCwgc3RyaW5nLCB5LCBkZWYpIHtcblx0dmFyIHNldHRpbmcgPSBuZXcgU2V0dGluZ3NDaGVja2JveChpZCwgc3RyaW5nKTtcblxuXHRzZXR0aW5nLnkgPSB5O1xuXHRzZXR0aW5nLnggPSAxNjtcblx0dGhpcy5zZXR0aW5nc01lbnUuYWRkQ2hpbGQoc2V0dGluZyk7XG5cblx0c2V0dGluZy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25DaGVja2JveENoYW5nZSwgdGhpcylcblxuXHR0aGlzLnNldHRpbmdzW2lkXSA9IHNldHRpbmc7XG5cdHNldHRpbmcuc2V0Q2hlY2tlZChkZWYpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBzZXR0aW5nLlxuICogQG1ldGhvZCBjcmVhdGVTZXR0aW5nXG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUuY3JlYXRlU2V0dGluZyA9IGZ1bmN0aW9uKGlkLCBzdHJpbmcsIHkpIHtcblx0dmFyIHNldHRpbmcgPSBuZXcgU2V0dGluZ3NDaGVja2JveChpZCwgc3RyaW5nKTtcblxuXHRzZXR0aW5nLnkgPSA1NDUreTtcblx0c2V0dGluZy54ID0gNzAwO1xuXHR0aGlzLmFkZENoaWxkKHNldHRpbmcpO1xuXG5cdHNldHRpbmcuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLm9uQ2hlY2tib3hDaGFuZ2UsIHRoaXMpXG5cblx0dGhpcy5zZXR0aW5nc1tpZF0gPSBzZXR0aW5nO1xufVxuXG4vKipcbiAqIENoZWNrYm94IGNoYW5nZS5cbiAqIEBtZXRob2Qgb25DaGVja2JveENoYW5nZVxuICovXG5TZXR0aW5nc1ZpZXcucHJvdG90eXBlLm9uQ2hlY2tib3hDaGFuZ2UgPSBmdW5jdGlvbihjaGVja2JveCkge1xuXHRpZihjaGVja2JveC5pZCA9PSBcInBsYXlBbmltYXRpb25zXCIpIHtcblx0XHRTZXR0aW5ncy5nZXRJbnN0YW5jZSgpLnBsYXlBbmltYXRpb25zID0gY2hlY2tib3guZ2V0Q2hlY2tlZCgpO1xuXHRcdGNvbnNvbGUubG9nKFwiYW5pbXMgY2hhbmdlZC4uXCIpO1xuXHR9XG5cblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiY2hhbmdlXCIsIGNoZWNrYm94LmlkLCBjaGVja2JveC5nZXRDaGVja2VkKCkpO1xufVxuXG4vKipcbiAqIFNldHRpbmdzIGJ1dHRvbiBjbGljay5cbiAqIEBtZXRob2Qgb25TZXR0aW5nc0J1dHRvbkNsaWNrXG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUub25TZXR0aW5nc0J1dHRvbkNsaWNrID0gZnVuY3Rpb24oaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdGNvbnNvbGUubG9nKFwiU2V0dGluZ3NWaWV3LnByb3RvdHlwZS5vblNldHRpbmdzQnV0dG9uQ2xpY2tcIik7XG5cdHRoaXMuc2V0dGluZ3NNZW51LnZpc2libGUgPSAhdGhpcy5zZXR0aW5nc01lbnUudmlzaWJsZTtcblxuXHRpZih0aGlzLnNldHRpbmdzTWVudS52aXNpYmxlKSB7XG5cdFx0dGhpcy5zdGFnZS5tb3VzZWRvd24gPSB0aGlzLm9uU3RhZ2VNb3VzZURvd24uYmluZCh0aGlzKTtcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLnN0YWdlLm1vdXNlZG93biA9IG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBTdGFnZSBtb3VzZSBkb3duLlxuICogQG1ldGhvZCBvblN0YWdlTW91c2VEb3duXG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUub25TdGFnZU1vdXNlRG93biA9IGZ1bmN0aW9uKGludGVyYWN0aW9uX29iamVjdCkge1xuXHRjb25zb2xlLmxvZyhcIlNldHRpbmdzVmlldy5wcm90b3R5cGUub25TdGFnZU1vdXNlRG93blwiKTtcblx0aWYoKHRoaXMuaGl0VGVzdCh0aGlzLnNldHRpbmdzTWVudSwgaW50ZXJhY3Rpb25fb2JqZWN0KSkgfHwgKHRoaXMuaGl0VGVzdCh0aGlzLnNldHRpbmdzQnV0dG9uLCBpbnRlcmFjdGlvbl9vYmplY3QpKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuc3RhZ2UubW91c2Vkb3duID0gbnVsbDtcblx0dGhpcy5zZXR0aW5nc01lbnUudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEhpdCB0ZXN0LlxuICogQG1ldGhvZCBoaXRUZXN0XG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUuaGl0VGVzdCA9IGZ1bmN0aW9uKG9iamVjdCwgaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdGlmKChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnggPiBvYmplY3QuZ2V0Qm91bmRzKCkueCApICYmIChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnggPCAob2JqZWN0LmdldEJvdW5kcygpLnggKyBvYmplY3QuZ2V0Qm91bmRzKCkud2lkdGgpKSAmJlxuXHRcdChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnkgPiBvYmplY3QuZ2V0Qm91bmRzKCkueSkgJiYgKGludGVyYWN0aW9uX29iamVjdC5nbG9iYWwueSA8IChvYmplY3QuZ2V0Qm91bmRzKCkueSArIG9iamVjdC5nZXRCb3VuZHMoKS5oZWlnaHQpKSkge1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVzZXQuXG4gKiBAbWV0aG9kIHJlc2V0XG4gKi9cblNldHRpbmdzVmlldy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5idXlDaGlwc0J1dHRvbi5lbmFibGVkID0gdHJ1ZTtcblx0dGhpcy5zZXRWaXNpYmxlQnV0dG9ucyhbXSk7XG59XG5cbi8qKlxuICogU2V0IHZpc2libGUgYnV0dG9ucy5cbiAqIEBtZXRob2Qgc2V0VmlzaWJsZUJ1dHRvbnNcbiAqL1xuU2V0dGluZ3NWaWV3LnByb3RvdHlwZS5zZXRWaXNpYmxlQnV0dG9ucyA9IGZ1bmN0aW9uKGJ1dHRvbnMpIHtcblx0dGhpcy5idXlDaGlwc0J1dHRvbi52aXNpYmxlID0gYnV0dG9ucy5pbmRleE9mKEJ1dHRvbkRhdGEuQlVZX0NISVBTKSAhPSAtMTtcblx0dGhpcy5zZXR0aW5nc1tDaGVja2JveE1lc3NhZ2UuQVVUT19QT1NUX0JMSU5EU10udmlzaWJsZSA9IGJ1dHRvbnMuaW5kZXhPZihDaGVja2JveE1lc3NhZ2UuQVVUT19QT1NUX0JMSU5EUyk7XG5cdHRoaXMuc2V0dGluZ3NbQ2hlY2tib3hNZXNzYWdlLlNJVE9VVF9ORVhUXS52aXNpYmxlID0gYnV0dG9ucy5pbmRleE9mKENoZWNrYm94TWVzc2FnZS5TSVRPVVRfTkVYVCk7XG5cblx0dmFyIHlwID0gNTQzO1xuXG5cdGlmKHRoaXMuYnV5Q2hpcHNCdXR0b24udmlzaWJsZSkge1xuXHRcdHRoaXMuYnV5Q2hpcHNCdXR0b24ueSA9IHlwO1xuXHRcdHlwICs9IDM1O1xuXHR9XG5cdGVsc2Uge1xuXHRcdHlwICs9IDI7XG5cdH1cblxuXHRpZih0aGlzLnNldHRpbmdzW0NoZWNrYm94TWVzc2FnZS5BVVRPX1BPU1RfQkxJTkRTXS52aXNpYmxlKSB7XG5cdFx0dGhpcy5zZXR0aW5nc1tDaGVja2JveE1lc3NhZ2UuQVVUT19QT1NUX0JMSU5EU10ueSA9IHlwO1xuXHRcdHlwICs9IDI1O1xuXHR9XG5cblx0aWYodGhpcy5zZXR0aW5nc1tDaGVja2JveE1lc3NhZ2UuU0lUT1VUX05FWFRdLnZpc2libGUpIHtcblx0XHR0aGlzLnNldHRpbmdzW0NoZWNrYm94TWVzc2FnZS5TSVRPVVRfTkVYVF0ueSA9IHlwO1xuXHRcdHlwICs9IDI1O1xuXHR9XG59XG5cbi8qKlxuICogR2V0IGNoZWNrYm94LlxuICogQG1ldGhvZCBnZXRDaGVja2JveEJ5SWRcbiAqL1xuU2V0dGluZ3NWaWV3LnByb3RvdHlwZS5nZXRDaGVja2JveEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuXHRyZXR1cm4gdGhpcy5zZXR0aW5nc1tpZF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3NWaWV3OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xuXG4vKipcbiAqIFNob3cgdGFibGUgaW5mby5cbiAqIEBjbGFzcyBUYWJsZUluZm9WaWV3XG4gKiBAbW9kdWxlIGNsaWVudFxuICovXG5mdW5jdGlvbiBUYWJsZUluZm9WaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR2YXIgc3R5bGUgPSB7XG5cdFx0Zm9udDogXCJib2xkIDI0cHggVGltZXMgTmV3IFJvbWFuXCIsXG5cdFx0ZmlsbDogXCIjZmZmZmZmXCIsXG5cdFx0ZHJvcFNoYWRvdzogdHJ1ZSxcblx0XHRkcm9wU2hhZG93Q29sb3I6IFwiIzAwMDAwMFwiLFxuXHRcdGRyb3BTaGFkb3dEaXN0YW5jZTogMixcblx0XHRzdHJva2U6IFwiIzAwMDAwMFwiLFxuXHRcdHN0cm9rZVRoaWNrbmVzczogMixcblx0XHR3b3JkV3JhcDogdHJ1ZSxcblx0XHR3b3JkV3JhcFdpZHRoOiAzMDBcblx0fTtcblxuXHR0aGlzLnRhYmxlSW5mb1RleHQgPSBuZXcgUElYSS5UZXh0KFwiPFRhYmxlSW5mb1RleHQ+XCIsIHN0eWxlKTtcblx0dGhpcy50YWJsZUluZm9UZXh0LnBvc2l0aW9uLnggPSAzNTU7XG5cdHRoaXMudGFibGVJbmZvVGV4dC5wb3NpdGlvbi55ID0gNTQwO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudGFibGVJbmZvVGV4dCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoVGFibGVJbmZvVmlldywgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KFRhYmxlSW5mb1ZpZXcpO1xuXG4vKipcbiAqIFNldCB0YWJsZSBpbmZvIHRleHQuXG4gKiBAbWV0aG9kIHNldFRhYmxlSW5mb1RleHRcbiAqL1xuVGFibGVJbmZvVmlldy5wcm90b3R5cGUuc2V0VGFibGVJbmZvVGV4dCA9IGZ1bmN0aW9uKHMpIHtcblx0aWYgKCFzKVxuXHRcdHM9XCJcIjtcblxuXHR0aGlzLnRhYmxlSW5mb1RleHQuc2V0VGV4dChzKTtcblx0Y29uc29sZS5sb2coXCJzZXR0aW5nIHRhYmxlIGluZm8gdGV4dDogXCIgKyBzKTtcbn1cblxuLyoqXG4gKiBDbGVhci5cbiAqIEBtZXRob2QgY2xlYXJcbiAqL1xuVGFibGVJbmZvVmlldy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50YWJsZUluZm9UZXh0LnNldFRleHQoXCJcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVJbmZvVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIFRXRUVOID0gcmVxdWlyZShcInR3ZWVuLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgUmVzb3VyY2VzID0gcmVxdWlyZShcIi4uL3Jlc291cmNlcy9SZXNvdXJjZXNcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBBIHRpbWVyIHZpZXdcbiAqIEBjbGFzcyBUaW1lclZpZXdcbiAqIEBtb2R1bGUgY2xpZW50XG4gKi9cbmZ1bmN0aW9uIFRpbWVyVmlldygpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cdFxuXHR0aGlzLnRpbWVyQ2xpcCA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlKFwidGltZXJCYWNrZ3JvdW5kXCIpKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnRpbWVyQ2xpcCk7XG5cblxuXHR0aGlzLmNhbnZhcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cdHRoaXMuY2FudmFzLnggPSB0aGlzLnRpbWVyQ2xpcC53aWR0aCowLjU7XG5cdHRoaXMuY2FudmFzLnkgPSB0aGlzLnRpbWVyQ2xpcC5oZWlnaHQqMC41O1xuXHR0aGlzLnRpbWVyQ2xpcC5hZGRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cblx0dGhpcy50aW1lckNsaXAudmlzaWJsZSA9IGZhbHNlO1xuXG5cdHRoaXMudHdlZW4gPSBudWxsO1xuXG5cdC8vdGhpcy5zaG93UGVyY2VudCgzMCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoVGltZXJWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoVGltZXJWaWV3KTtcblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cblRpbWVyVmlldy5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRpbWVyQ2xpcC52aXNpYmxlID0gZmFsc2U7XG5cdHRoaXMuc3RvcCgpO1xufVxuXG4vKipcbiAqIFNob3cuXG4gKiBAbWV0aG9kIHNob3dcbiAqL1xuVGltZXJWaWV3LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oc2VhdEluZGV4KSB7XG5cdFxuXHR0aGlzLnRpbWVyQ2xpcC52aXNpYmxlID0gdHJ1ZTtcblx0dGhpcy50aW1lckNsaXAueCA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmdldFBvaW50cyhcInNlYXRQb3NpdGlvbnNcIilbc2VhdEluZGV4XS54ICsgNTU7XG5cdHRoaXMudGltZXJDbGlwLnkgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5nZXRQb2ludHMoXCJzZWF0UG9zaXRpb25zXCIpW3NlYXRJbmRleF0ueSAtIDMwO1xuXG5cdHRoaXMuc3RvcCgpO1xuXG59XG5cbi8qKlxuICogU3RvcC5cbiAqIEBtZXRob2Qgc3RvcFxuICovXG5UaW1lclZpZXcucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbihzZWF0SW5kZXgpIHtcblx0aWYodGhpcy50d2VlbiAhPSBudWxsKVxuXHRcdHRoaXMudHdlZW4uc3RvcCgpO1xuXG59XG5cbi8qKlxuICogQ291bnRkb3duLlxuICogQG1ldGhvZCBjb3VudGRvd25cbiAqL1xuVGltZXJWaWV3LnByb3RvdHlwZS5jb3VudGRvd24gPSBmdW5jdGlvbih0b3RhbFRpbWUsIHRpbWVMZWZ0KSB7XG5cdHRoaXMuc3RvcCgpO1xuXG5cdHRvdGFsVGltZSAqPSAxMDAwO1xuXHR0aW1lTGVmdCAqPSAxMDAwO1xuXG5cdHZhciB0aW1lID0gRGF0ZS5ub3coKTtcblx0dGhpcy5zdGFydEF0ID0gdGltZSArIHRpbWVMZWZ0IC0gdG90YWxUaW1lO1xuXHR0aGlzLnN0b3BBdCA9IHRpbWUgKyB0aW1lTGVmdDtcblxuXHR0aGlzLnR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHt0aW1lOiB0aW1lfSlcblx0XHRcdFx0XHRcdC50byh7dGltZTogdGhpcy5zdG9wQXR9LCB0aW1lTGVmdClcblx0XHRcdFx0XHRcdC5vblVwZGF0ZSh0aGlzLm9uVXBkYXRlLmJpbmQodGhpcykpXG5cdFx0XHRcdFx0XHQub25Db21wbGV0ZSh0aGlzLm9uQ29tcGxldGUuYmluZCh0aGlzKSlcblx0XHRcdFx0XHRcdC5zdGFydCgpO1xuXG59XG5cbi8qKlxuICogT24gdHdlZW4gdXBkYXRlLlxuICogQG1ldGhvZCBvblVwZGF0ZVxuICovXG5UaW1lclZpZXcucHJvdG90eXBlLm9uVXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0aW1lID0gRGF0ZS5ub3coKTtcblx0dmFyIHBlcmNlbnQgPSAxMDAqKHRpbWUgLSB0aGlzLnN0YXJ0QXQpLyh0aGlzLnN0b3BBdCAtIHRoaXMuc3RhcnRBdCk7XG5cbi8vXHRjb25zb2xlLmxvZyhcInAgPSBcIiArIHBlcmNlbnQpO1xuXG5cdHRoaXMuc2hvd1BlcmNlbnQocGVyY2VudCk7XG59XG5cbi8qKlxuICogT24gdHdlZW4gdXBkYXRlLlxuICogQG1ldGhvZCBvblVwZGF0ZVxuICovXG5UaW1lclZpZXcucHJvdG90eXBlLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRpbWUgPSBEYXRlLm5vdygpO1xuXHR2YXIgcGVyY2VudCA9IDEwMDtcblx0dGhpcy5zaG93UGVyY2VudChwZXJjZW50KTtcblx0dGhpcy50d2VlbiA9IG51bGw7XG59XG5cbi8qKlxuICogU2hvdyBwZXJjZW50LlxuICogQG1ldGhvZCBzaG93UGVyY2VudFxuICovXG5UaW1lclZpZXcucHJvdG90eXBlLnNob3dQZXJjZW50ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlIDwgMClcblx0XHR2YWx1ZSA9IDA7XG5cblx0aWYgKHZhbHVlID4gMTAwKVxuXHRcdHZhbHVlID0gMTAwO1xuXG5cdHRoaXMuY2FudmFzLmNsZWFyKCk7XG5cblx0dGhpcy5jYW52YXMuYmVnaW5GaWxsKDB4YzAwMDAwKTtcblx0dGhpcy5jYW52YXMuZHJhd0NpcmNsZSgwLDAsMTApO1xuXHR0aGlzLmNhbnZhcy5lbmRGaWxsKCk7XG5cblx0dGhpcy5jYW52YXMuYmVnaW5GaWxsKDB4ZmZmZmZmKTtcblx0dGhpcy5jYW52YXMubW92ZVRvKDAsMCk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCAzMzsgaSsrKSB7XG5cdFx0dGhpcy5jYW52YXMubGluZVRvKFxuXHRcdFx0XHRcdFx0XHQxMCpNYXRoLmNvcyhpKnZhbHVlKjIqTWF0aC5QSS8oMzIqMTAwKSAtIE1hdGguUEkvMiksXG5cdFx0XHRcdFx0XHRcdDEwKk1hdGguc2luKGkqdmFsdWUqMipNYXRoLlBJLygzMioxMDApIC0gTWF0aC5QSS8yKVxuXHRcdFx0XHRcdFx0KTtcblx0fVxuXG5cdHRoaXMuY2FudmFzLmxpbmVUbygwLDApO1xuXHR0aGlzLmNhbnZhcy5lbmRGaWxsKCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lclZpZXc7IiwiLyoqXG4gKiBQcm90b2NvbCByZWxhdGVkIHN0dWZmLlxuICogQG1vZHVsZSBwcm90b1xuICovXG5cbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi4vdXRpbHMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG5cbnZhciBJbml0TWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0luaXRNZXNzYWdlXCIpO1xudmFyIFN0YXRlQ29tcGxldGVNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvU3RhdGVDb21wbGV0ZU1lc3NhZ2VcIik7XG52YXIgU2VhdEluZm9NZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvU2VhdEluZm9NZXNzYWdlXCIpO1xudmFyIENvbW11bml0eUNhcmRzTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0NvbW11bml0eUNhcmRzTWVzc2FnZVwiKTtcbnZhciBQb2NrZXRDYXJkc01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9Qb2NrZXRDYXJkc01lc3NhZ2VcIik7XG52YXIgU2VhdENsaWNrTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL1NlYXRDbGlja01lc3NhZ2VcIik7XG52YXIgU2hvd0RpYWxvZ01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9TaG93RGlhbG9nTWVzc2FnZVwiKTtcbnZhciBCdXR0b25DbGlja01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9CdXR0b25DbGlja01lc3NhZ2VcIik7XG52YXIgQnV0dG9uc01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9CdXR0b25zTWVzc2FnZVwiKTtcbnZhciBEZWxheU1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9EZWxheU1lc3NhZ2VcIik7XG52YXIgQ2xlYXJNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvQ2xlYXJNZXNzYWdlXCIpO1xudmFyIERlYWxlckJ1dHRvbk1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9EZWFsZXJCdXR0b25NZXNzYWdlXCIpO1xudmFyIEJldE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9CZXRNZXNzYWdlXCIpO1xudmFyIEJldHNUb1BvdE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9CZXRzVG9Qb3RNZXNzYWdlXCIpO1xuXG52YXIgQWN0aW9uTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0FjdGlvbk1lc3NhZ2VcIik7XG52YXIgQ2hhdE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9DaGF0TWVzc2FnZVwiKTtcbnZhciBDaGVja2JveE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9DaGVja2JveE1lc3NhZ2VcIik7XG52YXIgRmFkZVRhYmxlTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0ZhZGVUYWJsZU1lc3NhZ2VcIik7XG52YXIgSGFuZEluZm9NZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvSGFuZEluZm9NZXNzYWdlXCIpO1xudmFyIEludGVyZmFjZVN0YXRlTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0ludGVyZmFjZVN0YXRlTWVzc2FnZVwiKTtcbnZhciBQYXlPdXRNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvUGF5T3V0TWVzc2FnZVwiKTtcbnZhciBQb3RNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvUG90TWVzc2FnZVwiKTtcbnZhciBQcmVzZXRCdXR0b25DbGlja01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9QcmVzZXRCdXR0b25DbGlja01lc3NhZ2VcIik7XG52YXIgUHJlc2V0QnV0dG9uc01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9QcmVzZXRCdXR0b25zTWVzc2FnZVwiKTtcbnZhciBQcmVUb3VybmFtZW50SW5mb01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9QcmVUb3VybmFtZW50SW5mb01lc3NhZ2VcIik7XG52YXIgVGFibGVCdXR0b25DbGlja01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9UYWJsZUJ1dHRvbkNsaWNrTWVzc2FnZVwiKTtcbnZhciBUYWJsZUJ1dHRvbnNNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvVGFibGVCdXR0b25zTWVzc2FnZVwiKTtcbnZhciBUYWJsZUluZm9NZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvVGFibGVJbmZvTWVzc2FnZVwiKTtcbnZhciBUZXN0Q2FzZVJlcXVlc3RNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvVGVzdENhc2VSZXF1ZXN0TWVzc2FnZVwiKTtcbnZhciBUaW1lck1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9UaW1lck1lc3NhZ2VcIik7XG52YXIgVG91cm5hbWVudFJlc3VsdE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9Ub3VybmFtZW50UmVzdWx0TWVzc2FnZVwiKTtcbnZhciBGb2xkQ2FyZHNNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvRm9sZENhcmRzTWVzc2FnZVwiKTtcblxuLyoqXG4gKiBBIHByb3RvY29sIGNvbm5lY3Rpb24gd2l0aCBhbiB1bmRlcmx5aW5nIGNvbm5lY3Rpb24uXG4gKlxuICogVGhlcmUgYXJlIHR3byB3YXlzIHRvIGxpdGVuIGZvciBjb25uZWN0aW9ucywgdGhlIGZpcnN0IG9uZSBhbmQgbW9zdCBzdHJhaWdodFxuICogZm9yd2FyZCBpcyB0aGUgYWRkTWVzc2FnZUhhbmRsZXIsIHdoaWNoIHJlZ2lzdGVycyBhIGxpc3RlbmVyIGZvciBhXG4gKiBwYXJ0aWN1bGFyIG5ldHdvcmsgbWVzc2FnZS4gVGhlIGZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgbWVzc2FnZVxuICogY2xhc3MgdG8gbGlzdGVuIGZvcjpcbiAqXG4gKiAgICAgZnVuY3Rpb24gb25TZWF0SW5mb01lc3NhZ2UobSkge1xuICogICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VhdCBpcyBhY3RpdmUuXG4gKiAgICAgICAgIG0uaXNBY3RpdmUoKTtcbiAqICAgICB9XG4gKlxuICogICAgIHByb3RvQ29ubmVjdGlvbi5hZGRNZXNzYWdlSGFuZGxlcihTZWF0SW5mb01lc3NhZ2UsIG9uU2VhdEluZm9NZXNzYWdlKTtcbiAqXG4gKiBUaGUgc2Vjb25kIG1ldGhvZCBpcyB0byBsaXN0ZW4gdG8gdGhlIFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFIGRpc3BhdGNoZWRcbiAqIGJ5IHRoZSBpbnN0YW5jZSBvZiB0aGUgUHJvdG9Db25uZWN0aW9uLiBJbiB0aGlzIGNhc2UsIHRoZSBsaXN0ZW5lclxuICogd2lsbCBiZSBjYWxsZWQgZm9yIGFsbCBtZXNzYWdlcyByZWNlaXZlZCBvbiB0aGUgY29ubmVjdGlvbi5cbiAqXG4gKiAgICAgZnVuY3Rpb24gb25NZXNzYWdlKGUpIHtcbiAqICAgICAgICAgdmFyIG1lc3NhZ2U9ZS5tZXNzYWdlO1xuICpcbiAqICAgICAgICAgLy8gSXMgaXQgYSBTZWF0SW5mb01lc3NhZ2U/XG4gKiAgICAgICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgU2VhdEluZm9NZXNzYWdlKSB7XG4gKiAgICAgICAgICAgICAvLyAuLi5cbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqXG4gKiAgICAgcHJvdG9Db25uZWN0aW9uLmFkZE1lc3NhZ2VIYW5kbGVyKFNlYXRJbmZvTWVzc2FnZSwgb25NZXNzYWdlKTtcbiAqXG4gKiBUaGUgdW5kZXJseWluZyBjb25uZWN0aW9uIHNob3VsZCBiZSBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIGFuIFwiaW50ZXJmYWNlXCJcbiAqIG9mIGEgY29ubmVjdGlvbi4gSXQgaXMgbm90IGFuIGludGVyZmFjZSBwZXIgc2UsIHNpbmNlIEphdmFTY3JpcHQgZG9lc24ndCBzdXBwb3J0XG4gKiBpdC4gQW55d2F5LCB0aGUgc2lnbmF0dXJlIG9mIHRoaXMgaW50ZXJmYWNlLCBpcyB0aGF0IHRoZSBjb25uZWN0aW9uIG9iamVjdFxuICogc2hvdWxkIGhhdmUgYSBgc2VuZGAgbWV0aG9kIHdoaWNoIHJlY2VpdmVzIGEgb2JqZWN0IHRvIGJlIHNlbmQuIEl0IHNob3VsZCBhbHNvXG4gKiBkaXNwYXRjaCBcIm1lc3NhZ2VcIiBldmVudHMgYXMgbWVzc2FnZXMgYXJlIHJlY2VpdmVkLCBhbmQgXCJjbG9zZVwiIGV2ZW50cyBpZiB0aGVcbiAqIGNvbm5lY3Rpb24gaXMgY2xvc2VkIGJ5IHRoZSByZW1vdGUgcGFydHkuXG4gKlxuICogQGNsYXNzIFByb3RvQ29ubmVjdGlvblxuICogQGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBQcm90b0Nvbm5lY3Rpb24oY29ubmVjdGlvbikge1xuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmxvZ01lc3NhZ2VzID0gZmFsc2U7XG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG5cdHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG5cdHRoaXMuY29ubmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCB0aGlzLm9uQ29ubmVjdGlvbk1lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLmNvbm5lY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIHRoaXMub25Db25uZWN0aW9uQ2xvc2UsIHRoaXMpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKFByb3RvQ29ubmVjdGlvbiwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBUcmlnZ2VycyBpZiB0aGUgcmVtb3RlIHBhcnR5IGNsb3NlcyB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uLlxuICogQGV2ZW50IFByb3RvQ29ubmVjdGlvbi5DTE9TRVxuICovXG5Qcm90b0Nvbm5lY3Rpb24uQ0xPU0UgPSBcImNsb3NlXCI7XG5cbi8qKlxuICogVHJpZ2dlcnMgd2hlbiB3ZSByZWNlaXZlIGEgbWVzc2FnZSBmcm9tIHRoZSByZW1vdGUgcGFydHkuXG4gKiBAZXZlbnQgUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VcbiAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRoYXQgd2FzIHJlY2VpdmVkLlxuICovXG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRSA9IFwibWVzc2FnZVwiO1xuXG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFUyA9IHt9O1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbSW5pdE1lc3NhZ2UuVFlQRV0gPSBJbml0TWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1N0YXRlQ29tcGxldGVNZXNzYWdlLlRZUEVdID0gU3RhdGVDb21wbGV0ZU1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tTZWF0SW5mb01lc3NhZ2UuVFlQRV0gPSBTZWF0SW5mb01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tDb21tdW5pdHlDYXJkc01lc3NhZ2UuVFlQRV0gPSBDb21tdW5pdHlDYXJkc01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tQb2NrZXRDYXJkc01lc3NhZ2UuVFlQRV0gPSBQb2NrZXRDYXJkc01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tTZWF0Q2xpY2tNZXNzYWdlLlRZUEVdID0gU2VhdENsaWNrTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1Nob3dEaWFsb2dNZXNzYWdlLlRZUEVdID0gU2hvd0RpYWxvZ01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tCdXR0b25DbGlja01lc3NhZ2UuVFlQRV0gPSBCdXR0b25DbGlja01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tCdXR0b25zTWVzc2FnZS5UWVBFXSA9IEJ1dHRvbnNNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbRGVsYXlNZXNzYWdlLlRZUEVdID0gRGVsYXlNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbQ2xlYXJNZXNzYWdlLlRZUEVdID0gQ2xlYXJNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbRGVhbGVyQnV0dG9uTWVzc2FnZS5UWVBFXSA9IERlYWxlckJ1dHRvbk1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tCZXRNZXNzYWdlLlRZUEVdID0gQmV0TWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0JldHNUb1BvdE1lc3NhZ2UuVFlQRV0gPSBCZXRzVG9Qb3RNZXNzYWdlO1xuXG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tBY3Rpb25NZXNzYWdlLlRZUEVdID0gQWN0aW9uTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0NoYXRNZXNzYWdlLlRZUEVdID0gQ2hhdE1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tDaGVja2JveE1lc3NhZ2UuVFlQRV0gPSBDaGVja2JveE1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tGYWRlVGFibGVNZXNzYWdlLlRZUEVdID0gRmFkZVRhYmxlTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0hhbmRJbmZvTWVzc2FnZS5UWVBFXSA9IEhhbmRJbmZvTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0ludGVyZmFjZVN0YXRlTWVzc2FnZS5UWVBFXSA9IEludGVyZmFjZVN0YXRlTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1BheU91dE1lc3NhZ2UuVFlQRV0gPSBQYXlPdXRNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbUG90TWVzc2FnZS5UWVBFXSA9IFBvdE1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tQcmVzZXRCdXR0b25DbGlja01lc3NhZ2UuVFlQRV0gPSBQcmVzZXRCdXR0b25DbGlja01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tQcmVzZXRCdXR0b25zTWVzc2FnZS5UWVBFXSA9IFByZXNldEJ1dHRvbnNNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbUHJlVG91cm5hbWVudEluZm9NZXNzYWdlLlRZUEVdID0gUHJlVG91cm5hbWVudEluZm9NZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbVGFibGVCdXR0b25DbGlja01lc3NhZ2UuVFlQRV0gPSBUYWJsZUJ1dHRvbkNsaWNrTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1RhYmxlQnV0dG9uc01lc3NhZ2UuVFlQRV0gPSBUYWJsZUJ1dHRvbnNNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbVGFibGVJbmZvTWVzc2FnZS5UWVBFXSA9IFRhYmxlSW5mb01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tUZXN0Q2FzZVJlcXVlc3RNZXNzYWdlLlRZUEVdID0gVGVzdENhc2VSZXF1ZXN0TWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1RpbWVyTWVzc2FnZS5UWVBFXSA9IFRpbWVyTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW1RvdXJuYW1lbnRSZXN1bHRNZXNzYWdlLlRZUEVdID0gVG91cm5hbWVudFJlc3VsdE1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tGb2xkQ2FyZHNNZXNzYWdlLlRZUEVdID0gRm9sZENhcmRzTWVzc2FnZTtcblxuLyoqXG4gKiBBZGQgbWVzc2FnZSBoYW5kbGVyLlxuICogQG1ldGhvZCBhZGRNZXNzYWdlSGFuZGxlclxuICovXG5Qcm90b0Nvbm5lY3Rpb24ucHJvdG90eXBlLmFkZE1lc3NhZ2VIYW5kbGVyID0gZnVuY3Rpb24obWVzc2FnZVR5cGUsIGhhbmRsZXIsIHNjb3BlKSB7XG5cdGlmIChtZXNzYWdlVHlwZS5oYXNPd25Qcm9wZXJ0eShcIlRZUEVcIikpXG5cdFx0bWVzc2FnZVR5cGUgPSBtZXNzYWdlVHlwZS5UWVBFO1xuXG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIub24obWVzc2FnZVR5cGUsIGhhbmRsZXIsIHNjb3BlKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgbWVzc2FnZSBoYW5kbGVyLlxuICogQG1ldGhvZCByZW1vdmVNZXNzYWdlSGFuZGxlclxuICovXG5Qcm90b0Nvbm5lY3Rpb24ucHJvdG90eXBlLnJlbW92ZU1lc3NhZ2VIYW5kbGVyID0gZnVuY3Rpb24obWVzc2FnZVR5cGUsIGhhbmRsZXIsIHNjb3BlKSB7XG5cdGlmIChtZXNzYWdlVHlwZS5oYXNPd25Qcm9wZXJ0eShcIlRZUEVcIikpXG5cdFx0bWVzc2FnZVR5cGUgPSBtZXNzYWdlVHlwZS5UWVBFO1xuXG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIub2ZmKG1lc3NhZ2VUeXBlLCBoYW5kbGVyLCBzY29wZSk7XG59XG5cbi8qKlxuICogQ29ubmVjdGlvbiBtZXNzYWdlLlxuICogQG1ldGhvZCBvbkNvbm5lY3Rpb25NZXNzYWdlXG4gKiBAcHJpdmF0ZVxuICovXG5Qcm90b0Nvbm5lY3Rpb24ucHJvdG90eXBlLm9uQ29ubmVjdGlvbk1lc3NhZ2UgPSBmdW5jdGlvbihldikge1xuXHR2YXIgbWVzc2FnZSA9IGV2Lm1lc3NhZ2U7XG5cdHZhciBjb25zdHJ1Y3RvcjtcblxuXHRpZiAodGhpcy5sb2dNZXNzYWdlcylcblx0XHRjb25zb2xlLmxvZyhcIj09PiBcIiArIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcblxuXHRmb3IgKHR5cGUgaW4gUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVMpIHtcblx0XHRpZiAobWVzc2FnZS50eXBlID09IHR5cGUpXG5cdFx0XHRjb25zdHJ1Y3RvciA9IFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW3R5cGVdXG5cdH1cblxuXHRpZiAoIWNvbnN0cnVjdG9yKSB7XG5cdFx0Y29uc29sZS53YXJuKFwidW5rbm93biBtZXNzYWdlOiBcIiArIG1lc3NhZ2UudHlwZSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIG8gPSBuZXcgY29uc3RydWN0b3IoKTtcblx0by51bnNlcmlhbGl6ZShtZXNzYWdlKTtcblx0by50eXBlID0gbWVzc2FnZS50eXBlO1xuXG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIudHJpZ2dlcihvKTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFLFxuXHRcdG1lc3NhZ2U6IG9cblx0fSk7XG59XG5cbi8qKlxuICogQ29ubmVjdGlvbiBjbG9zZS5cbiAqIEBtZXRob2Qgb25Db25uZWN0aW9uQ2xvc2VcbiAqIEBwcml2YXRlXG4gKi9cblByb3RvQ29ubmVjdGlvbi5wcm90b3R5cGUub25Db25uZWN0aW9uQ2xvc2UgPSBmdW5jdGlvbihldikge1xuXHR0aGlzLmNvbm5lY3Rpb24ub2ZmKFwibWVzc2FnZVwiLCB0aGlzLm9uQ29ubmVjdGlvbk1lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLmNvbm5lY3Rpb24ub2ZmKFwiY2xvc2VcIiwgdGhpcy5vbkNvbm5lY3Rpb25DbG9zZSwgdGhpcyk7XG5cdHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG5cblx0dGhpcy50cmlnZ2VyKFByb3RvQ29ubmVjdGlvbi5DTE9TRSk7XG59XG5cbi8qKlxuICogU2VuZCBhIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlbmRcbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHR2YXIgc2VyaWFsaXplZCA9IG1lc3NhZ2Uuc2VyaWFsaXplKCk7XG5cblx0Zm9yICh0eXBlIGluIFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTKSB7XG5cdFx0aWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBQcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1t0eXBlXSlcblx0XHRcdHNlcmlhbGl6ZWQudHlwZSA9IHR5cGU7XG5cdH1cblxuXHRpZiAoIXNlcmlhbGl6ZWQudHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1lc3NhZ2UgdHlwZSBmb3Igc2VuZCwgbWVzc2FnZT1cIiArIG1lc3NhZ2UuY29uc3RydWN0b3IubmFtZSk7XG5cblx0Ly9cdGNvbnNvbGUubG9nKFwic2VuZGluZzogXCIrc2VyaWFsaXplZCk7XG5cblx0dGhpcy5jb25uZWN0aW9uLnNlbmQoc2VyaWFsaXplZCk7XG59XG5cbi8qKlxuICogU2hvdWxkIG1lc3NhZ2VzIGJlIGxvZ2dlZCB0byBjb25zb2xlP1xuICogQG1ldGhvZCBzZXRMb2dNZXNzYWdlc1xuICovXG5Qcm90b0Nvbm5lY3Rpb24ucHJvdG90eXBlLnNldExvZ01lc3NhZ2VzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5sb2dNZXNzYWdlcyA9IHZhbHVlO1xufVxuXG4vKipcbiAqIENsb3NlIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24uXG4gKiBAbWV0aG9kIGNsb3NlXG4gKi9cblByb3RvQ29ubmVjdGlvbi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG59XG5cbi8qKlxuICogR2V0IHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAqIEBtZXRob2QgdG9TdHJpbmdcbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXCI8UHJvdG9Db25uZWN0aW9uPlwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvQ29ubmVjdGlvbjsiLCIvKipcbiAqIEJ1dHRvbiBkYXRhLlxuICogQGNsYXNzIEJ1dHRvbkRhdGFcbiAqL1xuZnVuY3Rpb24gQnV0dG9uRGF0YShidXR0b24sIHZhbHVlKSB7XG5cdHRoaXMuYnV0dG9uID0gYnV0dG9uO1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbkJ1dHRvbkRhdGEuUkFJU0UgPSBcInJhaXNlXCI7XG5CdXR0b25EYXRhLkZPTEQgPSBcImZvbGRcIjtcbkJ1dHRvbkRhdGEuQkVUID0gXCJiZXRcIjtcbkJ1dHRvbkRhdGEuU0lUX09VVCA9IFwic2l0T3V0XCI7XG5CdXR0b25EYXRhLlNJVF9JTiA9IFwic2l0SW5cIjtcbkJ1dHRvbkRhdGEuQ0FMTCA9IFwiY2FsbFwiO1xuQnV0dG9uRGF0YS5QT1NUX0JCID0gXCJwb3N0QkJcIjtcbkJ1dHRvbkRhdGEuUE9TVF9TQiA9IFwicG9zdFNCXCI7XG5CdXR0b25EYXRhLkNBTkNFTCA9IFwiY2FuY2VsXCI7XG5CdXR0b25EYXRhLkNIRUNLID0gXCJjaGVja1wiO1xuQnV0dG9uRGF0YS5TSE9XID0gXCJzaG93XCI7XG5CdXR0b25EYXRhLk1VQ0sgPSBcIm11Y2tcIjtcbkJ1dHRvbkRhdGEuT0sgPSBcIm9rXCI7XG5CdXR0b25EYXRhLklNX0JBQ0sgPSBcImltQmFja1wiO1xuQnV0dG9uRGF0YS5MRUFWRSA9IFwibGVhdmVcIjtcbkJ1dHRvbkRhdGEuQ0hFQ0tfRk9MRCA9IFwiY2hlY2tGb2xkXCI7XG5CdXR0b25EYXRhLkNBTExfQU5ZID0gXCJjYWxsQW55XCI7XG5CdXR0b25EYXRhLlJBSVNFX0FOWSA9IFwicmFpc2VBbnlcIjtcbkJ1dHRvbkRhdGEuQlVZX0lOID0gXCJidXlJblwiO1xuQnV0dG9uRGF0YS5SRV9CVVkgPSBcInJlQnV5XCI7XG5CdXR0b25EYXRhLkpPSU5fVE9VUk5BTUVOVCA9IFwiam9pblRvdXJuYW1lbnRcIjtcbkJ1dHRvbkRhdGEuTEVBVkVfVE9VUk5BTUVOVCA9IFwibGVhdmVUb3VybmFtZW50XCI7XG5cbi8qKlxuICogR2V0IGJ1dHRvbi5cbiAqIEBtZXRob2QgZ2V0QnV0dG9uXG4gKi9cbkJ1dHRvbkRhdGEucHJvdG90eXBlLmdldEJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5idXR0b247XG59XG5cbi8qKlxuICogR2V0IGJ1dHRvbiBzdHJpbmcgZm9yIHRoaXMgYnV0dG9uLlxuICogQG1ldGhvZCBnZXRCdXR0b25TdHJpbmdcbiAqL1xuQnV0dG9uRGF0YS5wcm90b3R5cGUuZ2V0QnV0dG9uU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBCdXR0b25EYXRhLmdldEJ1dHRvblN0cmluZ0ZvcklkKHRoaXMuYnV0dG9uKTtcbn1cblxuLyoqXG4gKiBHZXQgdmFsdWUuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cbkJ1dHRvbkRhdGEucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnZhbHVlO1xufVxuXG4vKipcbiAqIEdldCBidXR0b24gc3RyaW5nIGZvciBpZC5cbiAqIEBtZXRob2QgZ2V0QnV0dG9uU3RyaW5nRm9ySWRcbiAqIEBzdGF0aWNcbiAqL1xuQnV0dG9uRGF0YS5nZXRCdXR0b25TdHJpbmdGb3JJZCA9IGZ1bmN0aW9uKGIpIHtcblx0c3dpdGNoIChiKSB7XG5cdFx0Y2FzZSBCdXR0b25EYXRhLkZPTEQ6XG5cdFx0XHRyZXR1cm4gXCJGT0xEXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQ0FMTDpcblx0XHRcdHJldHVybiBcIkNBTExcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5SQUlTRTpcblx0XHRcdHJldHVybiBcIlJBSVNFIFRPXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQkVUOlxuXHRcdFx0cmV0dXJuIFwiQkVUXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuU0lUX09VVDpcblx0XHRcdHJldHVybiBcIlNJVCBPVVRcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5QT1NUX0JCOlxuXHRcdFx0cmV0dXJuIFwiUE9TVCBCQlwiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLlBPU1RfU0I6XG5cdFx0XHRyZXR1cm4gXCJQT1NUIFNCXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuU0lUX0lOOlxuXHRcdFx0cmV0dXJuIFwiU0lUIElOXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQ0FOQ0VMOlxuXHRcdFx0cmV0dXJuIFwiQ0FOQ0VMXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQ0hFQ0s6XG5cdFx0XHRyZXR1cm4gXCJDSEVDS1wiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLlNIT1c6XG5cdFx0XHRyZXR1cm4gXCJTSE9XXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuTVVDSzpcblx0XHRcdHJldHVybiBcIk1VQ0tcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5PSzpcblx0XHRcdHJldHVybiBcIk9LXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuSU1fQkFDSzpcblx0XHRcdHJldHVybiBcIkknTSBCQUNLXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuTEVBVkU6XG5cdFx0XHRyZXR1cm4gXCJMRUFWRVwiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLkNIRUNLX0ZPTEQ6XG5cdFx0XHRyZXR1cm4gXCJDSEVDSyAvIEZPTERcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5DQUxMX0FOWTpcblx0XHRcdHJldHVybiBcIkNBTEwgQU5ZXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuUkFJU0VfQU5ZOlxuXHRcdFx0cmV0dXJuIFwiUkFJU0UgQU5ZXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuUkVfQlVZOlxuXHRcdFx0cmV0dXJuIFwiUkUtQlVZXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQlVZX0lOOlxuXHRcdFx0cmV0dXJuIFwiQlVZIElOXCI7XG5cdH1cblxuXHRyZXR1cm4gXCJcIjtcbn1cblxuQnV0dG9uRGF0YS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIFwiPEJ1dHRvbkRhdGEgYnV0dG9uPVwiICsgdGhpcy5idXR0b24gKyBcIiwgdmFsdWU9XCIgKyB0aGlzLnZhbHVlICsgXCI+XCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uRGF0YTsiLCIvKipcbiAqIENhcmQgZGF0YS5cbiAqIEBjbGFzcyBDYXJkRGF0YVxuICovXG5mdW5jdGlvbiBDYXJkRGF0YSh2YWx1ZSkge1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbkNhcmREYXRhLkNBUkRfVkFMVUVfU1RSSU5HUyA9XG5cdFtcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCIsIFwiMTBcIiwgXCJKXCIsIFwiUVwiLCBcIktcIiwgXCJBXCJdO1xuXG5DYXJkRGF0YS5TVUlUX1NUUklOR1MgPVxuXHRbXCJEXCIsIFwiQ1wiLCBcIkhcIiwgXCJTXCJdO1xuXG5DYXJkRGF0YS5ISURERU4gPSAtMTtcblxuLyoqXG4gKiBEb2VzIHRoaXMgQ2FyZERhdGEgcmVwcmVzZW50IGEgc2hvdyBjYXJkP1xuICogSWYgbm90IGl0IHNob3VsZCBiZSByZW5kZXJlZCB3aXRoIGl0cyBiYWNrc2lkZS5cbiAqIEBtZXRob2QgaXNTaG93blxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuaXNTaG93biA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52YWx1ZSA+PSAwO1xufVxuXG4vKipcbiAqIEdldCBjYXJkIHZhbHVlLlxuICogVGhpcyB2YWx1ZSByZXByZXNlbnRzIHRoZSByYW5rIG9mIHRoZSBjYXJkLCBidXQgc3RhcnRzIG9uIDAuXG4gKiBAbWV0aG9kIGdldENhcmRWYWx1ZVxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuZ2V0Q2FyZFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnZhbHVlICUgMTM7XG59XG5cbi8qKlxuICogR2V0IGNhcmQgdmFsdWUgc3RyaW5nLlxuICogQG1ldGhvZCBnZXRDYXJkVmFsdWVTdHJpbmdcbiAqL1xuQ2FyZERhdGEucHJvdG90eXBlLmdldENhcmRWYWx1ZVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gQ2FyZERhdGEuQ0FSRF9WQUxVRV9TVFJJTkdTW3RoaXMudmFsdWUgJSAxM107XG59XG5cbi8qKlxuICogR2V0IHN1aXQgaW5kZXguXG4gKiBAbWV0aG9kIGdldFN1aXRJbmRleFxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuZ2V0U3VpdEluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWUgLyAxMyk7XG59XG5cbi8qKlxuICogR2V0IHN1aXQgc3RyaW5nLlxuICogQG1ldGhvZCBnZXRTdWl0U3RyaW5nXG4gKi9cbkNhcmREYXRhLnByb3RvdHlwZS5nZXRTdWl0U3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBDYXJkRGF0YS5TVUlUX1NUUklOR1NbdGhpcy5nZXRTdWl0SW5kZXgoKV07XG59XG5cbi8qKlxuICogR2V0IGNvbG9yLlxuICogQG1ldGhvZCBnZXRDb2xvclxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuZ2V0Q29sb3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuZ2V0U3VpdEluZGV4KCkgJSAyICE9IDApXG5cdFx0cmV0dXJuIFwiIzAwMDAwMFwiO1xuXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIjZmYwMDAwXCI7XG59XG5cbi8qKlxuICogVG8gc3RyaW5nLlxuICogQG1ldGhvZCB0b1N0cmluZ1xuICovXG5DYXJkRGF0YS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMudmFsdWUgPCAwKVxuXHRcdHJldHVybiBcIlhYXCI7XG5cblx0Ly9cdHJldHVybiBcIjxjYXJkIFwiICsgdGhpcy5nZXRDYXJkVmFsdWVTdHJpbmcoKSArIHRoaXMuZ2V0U3VpdFN0cmluZygpICsgXCI+XCI7XG5cdHJldHVybiB0aGlzLmdldENhcmRWYWx1ZVN0cmluZygpICsgdGhpcy5nZXRTdWl0U3RyaW5nKCk7XG59XG5cbi8qKlxuICogR2V0IHZhbHVlIG9mIHRoZSBjYXJkLlxuICogQG1ldGhvZCBnZXRWYWx1ZVxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogQ29tcGFyZSB3aXRoIHJlc3BlY3QgdG8gdmFsdWUuIE5vdCByZWFsbHkgdXNlZnVsIGV4Y2VwdCBmb3IgZGVidWdnaW5nIVxuICogQG1ldGhvZCBjb21wYXJlVmFsdWVcbiAqIEBzdGF0aWNcbiAqL1xuQ2FyZERhdGEuY29tcGFyZVZhbHVlID0gZnVuY3Rpb24oYSwgYikge1xuXHRpZiAoIShhIGluc3RhbmNlb2YgQ2FyZERhdGEpIHx8ICEoYiBpbnN0YW5jZW9mIENhcmREYXRhKSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3QgY29tcGFyaW5nIGNhcmQgZGF0YVwiKTtcblxuXHRpZiAoYS5nZXRWYWx1ZSgpID4gYi5nZXRWYWx1ZSgpKVxuXHRcdHJldHVybiAxO1xuXG5cdGlmIChhLmdldFZhbHVlKCkgPCBiLmdldFZhbHVlKCkpXG5cdFx0cmV0dXJuIC0xO1xuXG5cdHJldHVybiAwO1xufVxuXG4vKipcbiAqIENvbXBhcmUgd2l0aCByZXNwZWN0IHRvIGNhcmQgdmFsdWUuXG4gKiBAbWV0aG9kIGNvbXBhcmVDYXJkVmFsdWVcbiAqIEBzdGF0aWNcbiAqL1xuQ2FyZERhdGEuY29tcGFyZUNhcmRWYWx1ZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0aWYgKCEoYSBpbnN0YW5jZW9mIENhcmREYXRhKSB8fCAhKGIgaW5zdGFuY2VvZiBDYXJkRGF0YSkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGNvbXBhcmluZyBjYXJkIGRhdGFcIik7XG5cblx0aWYgKGEuZ2V0Q2FyZFZhbHVlKCkgPiBiLmdldENhcmRWYWx1ZSgpKVxuXHRcdHJldHVybiAxO1xuXG5cdGlmIChhLmdldENhcmRWYWx1ZSgpIDwgYi5nZXRDYXJkVmFsdWUoKSlcblx0XHRyZXR1cm4gLTE7XG5cblx0cmV0dXJuIDA7XG59XG5cbi8qKlxuICogQ29tcGFyZSB3aXRoIHJlc3BlY3QgdG8gc3VpdC5cbiAqIEBtZXRob2QgY29tcGFyZVN1aXRcbiAqIEBzdGF0aWNcbiAqL1xuQ2FyZERhdGEuY29tcGFyZVN1aXRJbmRleCA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0aWYgKCEoYSBpbnN0YW5jZW9mIENhcmREYXRhKSB8fCAhKGIgaW5zdGFuY2VvZiBDYXJkRGF0YSkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGNvbXBhcmluZyBjYXJkIGRhdGFcIik7XG5cblx0aWYgKGEuZ2V0U3VpdEluZGV4KCkgPiBiLmdldFN1aXRJbmRleCgpKVxuXHRcdHJldHVybiAxO1xuXG5cdGlmIChhLmdldFN1aXRJbmRleCgpIDwgYi5nZXRTdWl0SW5kZXgoKSlcblx0XHRyZXR1cm4gLTE7XG5cblx0cmV0dXJuIDA7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FyZCBkYXRhIGZyb20gYSBzdHJpbmcuXG4gKiBAbWV0aG9kIGZyb21TdHJpbmdcbiAqIEBzdGF0aWNcbiAqL1xuQ2FyZERhdGEuZnJvbVN0cmluZyA9IGZ1bmN0aW9uKHMpIHtcblx0dmFyIGk7XG5cblx0dmFyIGNhcmRWYWx1ZSA9IC0xO1xuXHRmb3IgKGkgPSAwOyBpIDwgQ2FyZERhdGEuQ0FSRF9WQUxVRV9TVFJJTkdTLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNhbmQgPSBDYXJkRGF0YS5DQVJEX1ZBTFVFX1NUUklOR1NbaV07XG5cblx0XHRpZiAocy5zdWJzdHJpbmcoMCwgY2FuZC5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT0gY2FuZClcblx0XHRcdGNhcmRWYWx1ZSA9IGk7XG5cdH1cblxuXHRpZiAoY2FyZFZhbHVlIDwgMClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSB2YWxpZCBjYXJkIHN0cmluZzogXCIgKyBzKTtcblxuXHR2YXIgc3VpdFN0cmluZyA9IHMuc3Vic3RyaW5nKENhcmREYXRhLkNBUkRfVkFMVUVfU1RSSU5HU1tjYXJkVmFsdWVdLmxlbmd0aCk7XG5cblx0dmFyIHN1aXRJbmRleCA9IC0xO1xuXHRmb3IgKGkgPSAwOyBpIDwgQ2FyZERhdGEuU1VJVF9TVFJJTkdTLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNhbmQgPSBDYXJkRGF0YS5TVUlUX1NUUklOR1NbaV07XG5cblx0XHRpZiAoc3VpdFN0cmluZy50b1VwcGVyQ2FzZSgpID09IGNhbmQpXG5cdFx0XHRzdWl0SW5kZXggPSBpO1xuXHR9XG5cblx0aWYgKHN1aXRJbmRleCA8IDApXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGEgdmFsaWQgY2FyZCBzdHJpbmc6IFwiICsgcyk7XG5cblx0cmV0dXJuIG5ldyBDYXJkRGF0YShzdWl0SW5kZXggKiAxMyArIGNhcmRWYWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FyZERhdGE7IiwiLyoqXG4gKiBCdXR0b24gZGF0YS5cbiAqIEBjbGFzcyBCdXR0b25EYXRhXG4gKi9cbmZ1bmN0aW9uIFByZXNldEJ1dHRvbkRhdGEoYnV0dG9uLCB2YWx1ZSkge1xuXHR0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG4vKipcbiAqIEdldCBidXR0b24uXG4gKiBAbWV0aG9kIGdldEJ1dHRvblxuICovXG5QcmVzZXRCdXR0b25EYXRhLnByb3RvdHlwZS5nZXRCdXR0b24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYnV0dG9uO1xufVxuXG4vKipcbiAqIEdldCB2YWx1ZS5cbiAqIEBtZXRob2QgZ2V0VmFsdWVcbiAqL1xuUHJlc2V0QnV0dG9uRGF0YS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlc2V0QnV0dG9uRGF0YTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gcGxheWVyIG1hZGUgYW4gYWN0aW9uLlxuICogQGNsYXNzIEFjdGlvbk1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gQWN0aW9uTWVzc2FnZShzZWF0SW5kZXgsIGFjdGlvbikge1xuXHR0aGlzLnNlYXRJbmRleCA9IHNlYXRJbmRleDtcblx0dGhpcy5hY3Rpb24gPSBhY3Rpb247XG59XG5cbkFjdGlvbk1lc3NhZ2UuVFlQRSA9IFwiYWN0aW9uXCI7XG5cbkFjdGlvbk1lc3NhZ2UuRk9MRCA9IFwiZm9sZFwiO1xuQWN0aW9uTWVzc2FnZS5DQUxMID0gXCJjYWxsXCI7XG5BY3Rpb25NZXNzYWdlLlJBSVNFID0gXCJyYWlzZVwiO1xuQWN0aW9uTWVzc2FnZS5DSEVDSyA9IFwiY2hlY2tcIjtcbkFjdGlvbk1lc3NhZ2UuQkVUID0gXCJiZXRcIjtcbkFjdGlvbk1lc3NhZ2UuTVVDSyA9IFwibXVja1wiO1xuQWN0aW9uTWVzc2FnZS5BTlRFID0gXCJhbnRlXCI7XG5cbi8qKlxuICogU2VhdCBpbmRleC5cbiAqIEBtZXRob2QgZ2V0U2VhdEluZGV4XG4gKi9cbkFjdGlvbk1lc3NhZ2UucHJvdG90eXBlLmdldFNlYXRJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5zZWF0SW5kZXg7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRBY3Rpb25cbiAqL1xuQWN0aW9uTWVzc2FnZS5wcm90b3R5cGUuZ2V0QWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFjdGlvbjtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cbkFjdGlvbk1lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnNlYXRJbmRleCA9IGRhdGEuc2VhdEluZGV4O1xuXHR0aGlzLmFjdGlvbiA9IGRhdGEuYWN0aW9uO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuQWN0aW9uTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2VhdEluZGV4OiB0aGlzLnNlYXRJbmRleCxcblx0XHRhY3Rpb246IHRoaXMuYWN0aW9uXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gcGxheWVyIGhhcyBwbGFjZWQgYSBiZXQuXG4gKiBAY2xhc3MgQmV0TWVzc2FnZVxuICovXG5mdW5jdGlvbiBCZXRNZXNzYWdlKHNlYXRJbmRleCwgdmFsdWUpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBzZWF0SW5kZXg7XG5cdHRoaXMudmFsdWUgPSB2YWx1ZTtcbn1cblxuQmV0TWVzc2FnZS5UWVBFID0gXCJiZXRcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFNlYXRJbmRleFxuICovXG5CZXRNZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0VmFsdWVcbiAqL1xuQmV0TWVzc2FnZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5CZXRNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBkYXRhLnNlYXRJbmRleDtcblx0dGhpcy52YWx1ZSA9IGRhdGEudmFsdWU7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5CZXRNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRzZWF0SW5kZXg6IHRoaXMuc2VhdEluZGV4LFxuXHRcdHZhbHVlOiB0aGlzLnZhbHVlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmV0TWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gYmV0cyBzaG91bGQgYmUgcGxhY2VkIGluIHBvdC5cbiAqIEBjbGFzcyBCZXRzVG9Qb3RNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIEJldHNUb1BvdE1lc3NhZ2UoKSB7XG59XG5cbkJldHNUb1BvdE1lc3NhZ2UuVFlQRSA9IFwiYmV0c1RvUG90XCI7XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5CZXRzVG9Qb3RNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkJldHNUb1BvdE1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmV0c1RvUG90TWVzc2FnZTsiLCIvKipcbiAqIFNlbnQgd2hlbiB0aGUgdXNlciBjbGlja3MgYSBidXR0b24sIGVpdGhlciBpbiBhIGRpYWxvZyBvclxuICogZm9yIGEgZ2FtZSBhY3Rpb24uXG4gKiBAY2xhc3MgQnV0dG9uQ2xpY2tNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbkNsaWNrTWVzc2FnZShidXR0b24sIHZhbHVlKSB7XG5cdHRoaXMuYnV0dG9uID0gYnV0dG9uO1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cbi8vXHRjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGJ1dHRvbiBjbGljayBtZXNzYWdlLCB2YWx1ZT1cIiArIHZhbHVlKTtcbn1cblxuQnV0dG9uQ2xpY2tNZXNzYWdlLlRZUEUgPSBcImJ1dHRvbkNsaWNrXCI7XG5cbi8qKlxuICogVGhlIHRoZSBidXR0b24gdGhhdCB3YXMgcHJlc3NlZC5cbiAqIEBtZXRob2QgZ2V0QnV0dG9uXG4gKi9cbkJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuZ2V0QnV0dG9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmJ1dHRvbjtcbn1cblxuLyoqXG4gKiBTZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cbkJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5CdXR0b25DbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLmJ1dHRvbiA9IGRhdGEuYnV0dG9uO1xuXHR0aGlzLnZhbHVlID0gZGF0YS52YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0YnV0dG9uOiB0aGlzLmJ1dHRvbixcblx0XHR2YWx1ZTogdGhpcy52YWx1ZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbkNsaWNrTWVzc2FnZTsiLCJ2YXIgQnV0dG9uRGF0YSA9IHJlcXVpcmUoXCIuLi9kYXRhL0J1dHRvbkRhdGFcIik7XG5cbi8qKlxuICogTWVzc2FnZSBzZW50IHdoZW4gdGhlIGNsaWVudCBzaG91bGQgc2hvdyBnYW1lIGFjdGlvbiBidXR0b25zLFxuICogRk9MRCwgUkFJU0UgZXRjLlxuICogQGNsYXNzIEJ1dHRvbnNNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbnNNZXNzYWdlKCkge1xuXHR0aGlzLmJ1dHRvbnMgPSBbXTtcblx0dGhpcy5zbGlkZXJCdXR0b25JbmRleCA9IDA7XG5cdHRoaXMubWluID0gLTE7XG5cdHRoaXMubWF4ID0gLTE7XG59XG5cbkJ1dHRvbnNNZXNzYWdlLlRZUEUgPSBcImJ1dHRvbnNcIjtcblxuLyoqXG4gKiBHZXQgYW4gYXJyYXkgb2YgQnV0dG9uRGF0YSBpbmRpY2F0aW5nIHdoaWNoIGJ1dHRvbnMgdG8gc2hvdy5cbiAqIEBtZXRob2QgZ2V0QnV0dG9uc1xuICovXG5CdXR0b25zTWVzc2FnZS5wcm90b3R5cGUuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5idXR0b25zO1xufVxuXG4vKipcbiAqIEFkZCBhIGJ1dHRvbiB0byBiZSBzZW50LlxuICogQG1ldGhvZCBhZGRCdXR0b25cbiAqL1xuQnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLmFkZEJ1dHRvbiA9IGZ1bmN0aW9uKGJ1dHRvbikge1xuXHR0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cbkJ1dHRvbnNNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5idXR0b25zID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgYnV0dG9uID0gZGF0YS5idXR0b25zW2ldO1xuXHRcdHZhciBidXR0b25EYXRhID0gbmV3IEJ1dHRvbkRhdGEoYnV0dG9uLmJ1dHRvbiwgYnV0dG9uLnZhbHVlKTtcblx0XHR0aGlzLmFkZEJ1dHRvbihidXR0b25EYXRhKTtcblx0fVxuXHR0aGlzLnNsaWRlckJ1dHRvbkluZGV4ID0gZGF0YS5zbGlkZXJCdXR0b25JbmRleDtcblx0dGhpcy5taW4gPSBkYXRhLm1pbjtcblx0dGhpcy5tYXggPSBkYXRhLm1heDtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkJ1dHRvbnNNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0dmFyIGJ1dHRvbnMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSB7fTtcblx0XHRidXR0b24uYnV0dG9uID0gdGhpcy5idXR0b25zW2ldLmdldEJ1dHRvbigpO1xuXHRcdGJ1dHRvbi52YWx1ZSA9IHRoaXMuYnV0dG9uc1tpXS5nZXRWYWx1ZSgpO1xuXHRcdGJ1dHRvbnMucHVzaChidXR0b24pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRidXR0b25zOiBidXR0b25zLFxuXHRcdHNsaWRlckJ1dHRvbkluZGV4OiB0aGlzLnNsaWRlckJ1dHRvbkluZGV4LFxuXHRcdG1pbjogdGhpcy5taW4sXG5cdFx0bWF4OiB0aGlzLm1heFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbnNNZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgd2hlbiBzb21ldGhpbmcgaGFzIG9jY3VycmVkIGluIHRoZSBjaGF0LlxuICogQGNsYXNzIENoYXRNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIENoYXRNZXNzYWdlKHVzZXIsIHRleHQpIHtcblx0dGhpcy51c2VyID0gdXNlcjtcblx0dGhpcy50ZXh0ID0gdGV4dDtcbn1cblxuQ2hhdE1lc3NhZ2UuVFlQRSA9IFwiY2hhdFwiO1xuXG4vKipcbiAqIEdldCB0ZXh0LlxuICogQG1ldGhvZCBnZXRUZXh0XG4gKi9cbkNoYXRNZXNzYWdlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRleHQ7XG59XG5cbi8qKlxuICogR2V0IHVzZXIuXG4gKiBAbWV0aG9kIGdldFVzZXJcbiAqL1xuQ2hhdE1lc3NhZ2UucHJvdG90eXBlLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudXNlcjtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cbkNoYXRNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy50ZXh0ID0gZGF0YS50ZXh0O1xuXHR0aGlzLnVzZXIgPSBkYXRhLnVzZXI7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5DaGF0TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGV4dDogdGhpcy50ZXh0LFxuXHRcdHVzZXI6IHRoaXMudXNlclxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRNZXNzYWdlOyIsIi8qKlxuICogU2VudCB3aGVuIHBsYXllciBoYXMgY2hlY2tlZCBhIGNoZWNrYm94LlxuICogQGNsYXNzIENoZWNrYm94TWVzc2FnZVxuICovXG5mdW5jdGlvbiBDaGVja2JveE1lc3NhZ2UoaWQsIGNoZWNrZWQpIHtcblx0dGhpcy5pZCA9IGlkO1xuXHR0aGlzLmNoZWNrZWQgPSBjaGVja2VkO1xufVxuXG5DaGVja2JveE1lc3NhZ2UuVFlQRSA9IFwiY2hlY2tib3hcIjtcblxuQ2hlY2tib3hNZXNzYWdlLkFVVE9fUE9TVF9CTElORFMgPSBcImF1dG9Qb3N0QmxpbmRzXCI7XG5DaGVja2JveE1lc3NhZ2UuQVVUT19NVUNLX0xPU0lORyA9IFwiYXV0b011Y2tMb3NpbmdcIjtcbkNoZWNrYm94TWVzc2FnZS5TSVRPVVRfTkVYVCA9IFwic2l0b3V0TmV4dFwiO1xuXG4vKipcbiAqIElkIG9mIGNoZWNrYm94LlxuICogQG1ldGhvZCBnZXRJZFxuICovXG5DaGVja2JveE1lc3NhZ2UucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNlYXRJbmRleDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cbkNoZWNrYm94TWVzc2FnZS5wcm90b3R5cGUuZ2V0Q2hlY2tlZCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jaGVja2VkO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuQ2hlY2tib3hNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5pZCA9IGRhdGEuaWQ7XG5cdHRoaXMuY2hlY2tlZCA9IGRhdGEuY2hlY2tlZDtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkNoZWNrYm94TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0aWQ6IHRoaXMuaWQsXG5cdFx0Y2hlY2tlZDogdGhpcy5jaGVja2VkXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hNZXNzYWdlOyIsIi8qKlxuICogQGNsYXNzIENsZWFyTWVzc2FnZVxuICovXG5mdW5jdGlvbiBDbGVhck1lc3NhZ2UoY29tcG9uZW50cykge1xuXHRpZiAoIWNvbXBvbmVudHMpXG5cdFx0Y29tcG9uZW50cyA9IFtdO1xuXG5cdHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG59XG5cbkNsZWFyTWVzc2FnZS5UWVBFID0gXCJjbGVhclwiO1xuXG5DbGVhck1lc3NhZ2UuQ0FSRFMgPSBcImNhcmRzXCI7XG5DbGVhck1lc3NhZ2UuQkVUUyA9IFwiYmV0c1wiO1xuQ2xlYXJNZXNzYWdlLlBPVCA9IFwicG90XCI7XG5DbGVhck1lc3NhZ2UuQ0hBVCA9IFwiY2hhdFwiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0Q29tcG9uZW50c1xuICovXG5DbGVhck1lc3NhZ2UucHJvdG90eXBlLmdldENvbXBvbmVudHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29tcG9uZW50cztcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cbkNsZWFyTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuY29tcG9uZW50cyA9IGRhdGEuY29tcG9uZW50cztcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkNsZWFyTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Y29tcG9uZW50czogdGhpcy5jb21wb25lbnRzXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xlYXJNZXNzYWdlOyIsInZhciBDYXJkRGF0YSA9IHJlcXVpcmUoXCIuLi9kYXRhL0NhcmREYXRhXCIpO1xuXG4vKipcbiAqIFNob3cgY29tbXVuaXR5IGNhcmRzLlxuICogQGNsYXNzIENvbW11bml0eUNhcmRzTWVzc2FnZVxuICovXG5mdW5jdGlvbiBDb21tdW5pdHlDYXJkc01lc3NhZ2UoY2FyZHMpIHtcblx0aWYgKCFjYXJkcylcblx0XHRjYXJkcyA9IFtdO1xuXG5cdHRoaXMuYW5pbWF0ZSA9IGZhbHNlO1xuXHR0aGlzLmNhcmRzID0gY2FyZHM7XG5cdHRoaXMuZmlyc3RJbmRleCA9IDA7XG59XG5cbkNvbW11bml0eUNhcmRzTWVzc2FnZS5UWVBFID0gXCJjb21tdW5pdHlDYXJkc1wiO1xuXG4vKipcbiAqIEFuaW1hdGlvbiBvciBub3Q/XG4gKiBAbWV0aG9kIHNldEFuaW1hdGVcbiAqL1xuQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5zZXRBbmltYXRlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIHRoaXMuYW5pbWF0ZSA9IHZhbHVlO1xufVxuXG4vKipcbiAqIFNldCBmaXJzdCBpbmRleC5cbiAqIEBtZXRob2Qgc2V0Rmlyc3RJbmRleFxuICovXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UucHJvdG90eXBlLnNldEZpcnN0SW5kZXggPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gdGhpcy5maXJzdEluZGV4ID0gdmFsdWU7XG59XG5cbi8qKlxuICogQWRkIGNhcmQuXG4gKiBAbWV0aG9kIGFkZENhcmRcbiAqL1xuQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5hZGRDYXJkID0gZnVuY3Rpb24oYykge1xuXHR0aGlzLmNhcmRzLnB1c2goYyk7XG59XG5cbi8qKlxuICogR2V0IGNhcmQgZGF0YS5cbiAqIEBtZXRob2QgZ2V0Q2FyZHNcbiAqL1xuQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5nZXRDYXJkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jYXJkcztcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBjYXJkIHRvIGJlIHNob3duIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBtZXRob2QgZ2V0Rmlyc3RJbmRleFxuICovXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UucHJvdG90eXBlLmdldEZpcnN0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZmlyc3RJbmRleDtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplLlxuICovXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR2YXIgaTtcblxuXHR0aGlzLmFuaW1hdGUgPSBkYXRhLmFuaW1hdGU7XG5cdHRoaXMuZmlyc3RJbmRleCA9IHBhcnNlSW50KGRhdGEuZmlyc3RJbmRleCk7XG5cdHRoaXMuY2FyZHMgPSBbXTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgZGF0YS5jYXJkcy5sZW5ndGg7IGkrKylcblx0XHR0aGlzLmNhcmRzLnB1c2gobmV3IENhcmREYXRhKGRhdGEuY2FyZHNbaV0pKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkNvbW11bml0eUNhcmRzTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjYXJkcyA9IFtdO1xuXG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKVxuXHRcdGNhcmRzLnB1c2godGhpcy5jYXJkc1tpXS5nZXRWYWx1ZSgpKTtcblxuXHRyZXR1cm4ge1xuXHRcdGFuaW1hdGU6IHRoaXMuYW5pbWF0ZSxcblx0XHRmaXJzdEluZGV4OiB0aGlzLmZpcnN0SW5kZXgsXG5cdFx0Y2FyZHM6IGNhcmRzXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbXVuaXR5Q2FyZHNNZXNzYWdlOyIsIi8qKlxuICogQGNsYXNzIERlYWxlckJ1dHRvbk1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gRGVhbGVyQnV0dG9uTWVzc2FnZShzZWF0SW5kZXgsIGFuaW1hdGUpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBzZWF0SW5kZXg7XG5cdHRoaXMuYW5pbWF0ZSA9IGFuaW1hdGU7XG59XG5cbkRlYWxlckJ1dHRvbk1lc3NhZ2UuVFlQRSA9IFwiZGVhbGVyQnV0dG9uXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRTZWF0SW5kZXhcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUuZ2V0U2VhdEluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNlYXRJbmRleDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEFuaW1hdGVcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUuZ2V0QW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hbmltYXRlO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuc2VhdEluZGV4ID0gZGF0YS5zZWF0SW5kZXg7XG5cdHRoaXMuYW5pbWF0ZSA9IGRhdGEuYW5pbWF0ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkRlYWxlckJ1dHRvbk1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNlYXRJbmRleDogdGhpcy5zZWF0SW5kZXgsXG5cdFx0YW5pbWF0ZTogdGhpcy5hbmltYXRlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVhbGVyQnV0dG9uTWVzc2FnZTsiLCIvKipcbiAqIEBjbGFzcyBEZWxheU1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gRGVsYXlNZXNzYWdlKGRlbGF5KSB7XG5cdHRoaXMuZGVsYXkgPSBkZWxheTtcbn1cblxuRGVsYXlNZXNzYWdlLlRZUEUgPSBcImRlbGF5XCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXREZWxheVxuICovXG5EZWxheU1lc3NhZ2UucHJvdG90eXBlLmdldERlbGF5ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmRlbGF5O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuRGVsYXlNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5kZWxheSA9IGRhdGEuZGVsYXk7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5EZWxheU1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdGRlbGF5OiB0aGlzLmRlbGF5XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsYXlNZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgdGFibGUgc2hvdWxkIGZhZGUuXG4gKiBAY2xhc3MgRmFkZVRhYmxlTWVzc2FnZVxuICovXG5mdW5jdGlvbiBGYWRlVGFibGVNZXNzYWdlKHZpc2libGUsIGRpcmVjdGlvbikge1xuXHR0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbn1cblxuRmFkZVRhYmxlTWVzc2FnZS5UWVBFID0gXCJmYWRlVGFibGVcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZpc2libGVcbiAqL1xuRmFkZVRhYmxlTWVzc2FnZS5wcm90b3R5cGUuZ2V0VmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52aXNpYmxlO1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0RGlyZWN0aW9uXG4gKi9cbkZhZGVUYWJsZU1lc3NhZ2UucHJvdG90eXBlLmdldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5kaXJlY3Rpb247XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5GYWRlVGFibGVNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy52aXNpYmxlID0gZGF0YS52aXNpYmxlO1xuXHR0aGlzLmRpcmVjdGlvbiA9IGRhdGEuZGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuRmFkZVRhYmxlTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogdGhpcy52aXNpYmxlLFxuXHRcdGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb25cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGYWRlVGFibGVNZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgcGxheWVyIGhhcyBmb2xkZWQuXG4gKiBAY2xhc3MgRm9sZENhcmRzTWVzc2FnZVxuICovXG5mdW5jdGlvbiBGb2xkQ2FyZHNNZXNzYWdlKHNlYXRJbmRleCkge1xuXHR0aGlzLnNlYXRJbmRleCA9IHNlYXRJbmRleDtcbn1cblxuRm9sZENhcmRzTWVzc2FnZS5UWVBFID0gXCJmb2xkQ2FyZHNcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFNlYXRJbmRleFxuICovXG5Gb2xkQ2FyZHNNZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuRm9sZENhcmRzTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuc2VhdEluZGV4ID0gZGF0YS5zZWF0SW5kZXg7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Gb2xkQ2FyZHNNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRzZWF0SW5kZXg6IHRoaXMuc2VhdEluZGV4XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRm9sZENhcmRzTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gPy5cbiAqIEBjbGFzcyBIYW5kSW5mb01lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gSGFuZEluZm9NZXNzYWdlKHRleHQsIGNvdW50ZG93bikge1xuXHR0aGlzLnRleHQgPSB0ZXh0O1xuXHR0aGlzLmNvdW50ZG93biA9IGNvdW50ZG93bjtcbn1cblxuSGFuZEluZm9NZXNzYWdlLlRZUEUgPSBcImhhbmRJbmZvXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRTZWF0SW5kZXhcbiAqL1xuSGFuZEluZm9NZXNzYWdlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRleHQ7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRWYWx1ZVxuICovXG5IYW5kSW5mb01lc3NhZ2UucHJvdG90eXBlLmdldENvdW50ZG93biA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb3VudGRvd247XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5IYW5kSW5mb01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRleHQgPSBkYXRhLnRleHQ7XG5cdHRoaXMuY291bnRkb3duID0gZGF0YS5jb3VudGRvd247XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5IYW5kSW5mb01lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRleHQ6IHRoaXMudGV4dCxcblx0XHRjb3VudGRvd246IHRoaXMuY291bnRkb3duXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGFuZEluZm9NZXNzYWdlOyIsIi8qKlxuICogQGNsYXNzIEluaXRNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIEluaXRNZXNzYWdlKHRva2VuKSB7XG5cdHRoaXMudG9rZW4gPSB0b2tlbjtcblx0dGhpcy50YWJsZUlkID0gbnVsbDtcblx0dGhpcy52aWV3Q2FzZSA9IG51bGw7XG59XG5cbkluaXRNZXNzYWdlLlRZUEUgPSBcImluaXRcIjtcblxuLyoqXG4gKiBnZXQgdG9rZW4uXG4gKiBAbWV0aG9kIGdldFRva2VuXG4gKi9cbkluaXRNZXNzYWdlLnByb3RvdHlwZS5nZXRUb2tlbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50b2tlbjtcbn1cblxuLyoqXG4gKiBTZXQgdGFibGUgaWQuXG4gKiBAbWV0aG9kIHNldFRhYmxlSWRcbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLnNldFRhYmxlSWQgPSBmdW5jdGlvbihpZCkge1xuXHR0aGlzLnRhYmxlSWQgPSBpZDtcbn1cblxuLyoqXG4gKiBHZXQgdGFibGUgaWQuXG4gKiBAbWV0aG9kIGdldFRhYmxlSWRcbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLmdldFRhYmxlSWQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFibGVJZDtcbn1cblxuLyoqXG4gKiBTZXQgdmlldyBjYXNlLlxuICogQG1ldGhvZCBzZXRUYWJsZUlkXG4gKi9cbkluaXRNZXNzYWdlLnByb3RvdHlwZS5zZXRWaWV3Q2FzZSA9IGZ1bmN0aW9uKHZpZXdDYXNlKSB7XG5cdHRoaXMudmlld0Nhc2UgPSB2aWV3Q2FzZTtcbn1cblxuLyoqXG4gKiBHZXQgdmlldyBjYXNlLlxuICogQG1ldGhvZCBnZXRUYWJsZUlkXG4gKi9cbkluaXRNZXNzYWdlLnByb3RvdHlwZS5nZXRWaWV3Q2FzZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52aWV3Q2FzZTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplLlxuICovXG5Jbml0TWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMudG9rZW4gPSBkYXRhLnRva2VuO1xuXHR0aGlzLnRhYmxlSWQgPSBkYXRhLnRhYmxlSWQ7XG5cdHRoaXMudmlld0Nhc2UgPSBkYXRhLnZpZXdDYXNlO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRva2VuOiB0aGlzLnRva2VuLFxuXHRcdHRhYmxlSWQ6IHRoaXMudGFibGVJZCxcblx0XHR2aWV3Q2FzZTogdGhpcy52aWV3Q2FzZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluaXRNZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgd2hlbiBpbnRlcmZhY2Ugc3RhdGUgaGFzIGNoYW5nZWQuXG4gKiBAY2xhc3MgSW50ZXJmYWNlU3RhdGVNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIEludGVyZmFjZVN0YXRlTWVzc2FnZSh2aXNpYmxlQnV0dG9ucykge1xuXHRcblx0dGhpcy52aXNpYmxlQnV0dG9ucyA9IHZpc2libGVCdXR0b25zID09IG51bGwgPyBuZXcgQXJyYXkoKSA6IHZpc2libGVCdXR0b25zO1xufVxuXG5JbnRlcmZhY2VTdGF0ZU1lc3NhZ2UuVFlQRSA9IFwiaW50ZXJmYWNlU3RhdGVcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZpc2libGVCdXR0b25zXG4gKi9cbkludGVyZmFjZVN0YXRlTWVzc2FnZS5wcm90b3R5cGUuZ2V0VmlzaWJsZUJ1dHRvbnMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuSW50ZXJmYWNlU3RhdGVNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy52aXNpYmxlQnV0dG9ucyA9IGRhdGEudmlzaWJsZUJ1dHRvbnM7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5JbnRlcmZhY2VTdGF0ZU1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHZpc2libGVCdXR0b25zOiB0aGlzLnZpc2libGVCdXR0b25zXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJmYWNlU3RhdGVNZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgd2hlbiBwbGF5ZXIgaGFzIHBsYWNlZCBhIGJldC5cbiAqIEBjbGFzcyBQYXlPdXRNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFBheU91dE1lc3NhZ2UoKSB7XG5cdHRoaXMudmFsdWVzID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xufVxuXG5QYXlPdXRNZXNzYWdlLlRZUEUgPSBcInBheU91dFwiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0VmFsdWVzXG4gKi9cblBheU91dE1lc3NhZ2UucHJvdG90eXBlLmdldFZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52YWx1ZXM7XG59XG5cbi8qKlxuICogU2V0IHZhbHVlIGF0LlxuICogQG1ldGhvZCBzZXRWYWx1ZUF0XG4gKi9cblBheU91dE1lc3NhZ2UucHJvdG90eXBlLnNldFZhbHVlQXQgPSBmdW5jdGlvbihzZWF0SW5kZXgsIHZhbHVlKSB7XG5cdHRoaXMudmFsdWVzW3NlYXRJbmRleF0gPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cblBheU91dE1lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy52YWx1ZXNbaV0gPSBkYXRhLnZhbHVlc1tpXTtcblx0fVxufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuUGF5T3V0TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dmFsdWVzOiB0aGlzLnZhbHVlc1xuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBheU91dE1lc3NhZ2U7IiwidmFyIENhcmREYXRhID0gcmVxdWlyZShcIi4uL2RhdGEvQ2FyZERhdGFcIik7XG5cbi8qKlxuICogU2hvdyBwb2NrZXQgY2FyZHMuXG4gKiBAY2xhc3MgUG9ja2V0Q2FyZHNNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFBvY2tldENhcmRzTWVzc2FnZShzZWF0SW5kZXgpIHtcblx0dGhpcy5hbmltYXRlID0gZmFsc2U7XG5cdHRoaXMuY2FyZHMgPSBbXTtcblx0dGhpcy5maXJzdEluZGV4ID0gMDtcblx0dGhpcy5zZWF0SW5kZXggPSBzZWF0SW5kZXg7XG59XG5cblBvY2tldENhcmRzTWVzc2FnZS5UWVBFID0gXCJwb2NrZXRDYXJkc1wiO1xuXG4vKipcbiAqIEFuaW1hdGlvbj9cbiAqIEBtZXRob2Qgc2V0QW5pbWF0ZVxuICovXG5Qb2NrZXRDYXJkc01lc3NhZ2UucHJvdG90eXBlLnNldEFuaW1hdGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLmFuaW1hdGUgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXQgZmlyc3QgaW5kZXguXG4gKiBAbWV0aG9kIHNldEZpcnN0SW5kZXhcbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5zZXRGaXJzdEluZGV4ID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0dGhpcy5maXJzdEluZGV4ID0gaW5kZXg7XG59XG5cbi8qKlxuICogR2V0IGFycmF5IG9mIENhcmREYXRhLlxuICogQG1ldGhvZCBnZXRDYXJkc1xuICovXG5Qb2NrZXRDYXJkc01lc3NhZ2UucHJvdG90eXBlLmdldENhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNhcmRzO1xufVxuXG4vKipcbiAqIEFkZCBhIGNhcmQuXG4gKiBAbWV0aG9kIGFkZENhcmRcbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5hZGRDYXJkID0gZnVuY3Rpb24oYykge1xuXHR0aGlzLmNhcmRzLnB1c2goYyk7XG59XG5cbi8qKlxuICogR2V0IGZpcnN0IGluZGV4LlxuICogQG1ldGhvZCBnZXRGaXJzdEluZGV4XG4gKi9cblBvY2tldENhcmRzTWVzc2FnZS5wcm90b3R5cGUuZ2V0Rmlyc3RJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5maXJzdEluZGV4O1xufVxuXG4vKipcbiAqIEdldCBzZWF0IGluZGV4LlxuICogQG1ldGhvZCBnZXRTZWF0SW5kZXhcbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cblBvY2tldENhcmRzTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHZhciBpO1xuXG5cdHRoaXMuYW5pbWF0ZSA9IGRhdGEuYW5pbWF0ZTtcblx0dGhpcy5maXJzdEluZGV4ID0gcGFyc2VJbnQoZGF0YS5maXJzdEluZGV4KTtcblx0dGhpcy5jYXJkcyA9IFtdO1xuXHR0aGlzLnNlYXRJbmRleCA9IGRhdGEuc2VhdEluZGV4O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBkYXRhLmNhcmRzLmxlbmd0aDsgaSsrKVxuXHRcdHRoaXMuY2FyZHMucHVzaChuZXcgQ2FyZERhdGEoZGF0YS5jYXJkc1tpXSkpO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNhcmRzID0gW107XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspXG5cdFx0Y2FyZHMucHVzaCh0aGlzLmNhcmRzW2ldLmdldFZhbHVlKCkpO1xuXG5cdHJldHVybiB7XG5cdFx0YW5pbWF0ZTogdGhpcy5hbmltYXRlLFxuXHRcdGZpcnN0SW5kZXg6IHRoaXMuZmlyc3RJbmRleCxcblx0XHRjYXJkczogY2FyZHMsXG5cdFx0c2VhdEluZGV4OiB0aGlzLnNlYXRJbmRleFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvY2tldENhcmRzTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gcGxheWVyIHBvdCBoYXMgY2hhbmdlZC5cbiAqIEBjbGFzcyBQb3RNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFBvdE1lc3NhZ2UodmFsdWVzKSB7XG5cdHRoaXMudmFsdWVzID0gdmFsdWVzID09IG51bGwgPyBuZXcgQXJyYXkoKSA6IHZhbHVlcztcbn1cblxuUG90TWVzc2FnZS5UWVBFID0gXCJwb3RcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZhbHVlc1xuICovXG5Qb3RNZXNzYWdlLnByb3RvdHlwZS5nZXRWYWx1ZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWVzO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuUG90TWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMudmFsdWVzID0gZGF0YS52YWx1ZXM7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Qb3RNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR2YWx1ZXM6IHRoaXMudmFsdWVzXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG90TWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gUHJlIHRvdXJuYW1lbnQgaW5mbyBtZXNzYWdlIGlzIGRpc3BhdGNoZWQuXG4gKiBAY2xhc3MgUHJlVG91cm5hbWVudEluZm9NZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFByZVRvdXJuYW1lbnRJbmZvTWVzc2FnZSh0ZXh0LCBjb3VudGRvd24pIHtcblx0dGhpcy50ZXh0ID0gdGV4dDtcblx0dGhpcy5jb3VudGRvd24gPSBjb3VudGRvd247XG59XG5cblByZVRvdXJuYW1lbnRJbmZvTWVzc2FnZS5UWVBFID0gXCJwcmVUb3VybmFtZW50SW5mb1wiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0VGV4dFxuICovXG5QcmVUb3VybmFtZW50SW5mb01lc3NhZ2UucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGV4dDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldENvdW50ZG93blxuICovXG5QcmVUb3VybmFtZW50SW5mb01lc3NhZ2UucHJvdG90eXBlLmdldENvdW50ZG93biA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb3VudGRvd247XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5QcmVUb3VybmFtZW50SW5mb01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRleHQgPSBkYXRhLnRleHQ7XG5cdHRoaXMuY291bnRkb3duID0gZGF0YS5jb3VudGRvd247XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5QcmVUb3VybmFtZW50SW5mb01lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRpZih0aGlzLmNvdW50ZG93biA8IDApXG5cdFx0dGhpcy5jb3VudGRvd24gPSAwO1xuXHRcblx0cmV0dXJuIHtcblx0XHR0ZXh0OiB0aGlzLnRleHQsXG5cdFx0Y291bnRkb3duOiB0aGlzLmNvdW50ZG93blxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZVRvdXJuYW1lbnRJbmZvTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gPy5cbiAqIEBjbGFzcyBQcmVzZXRCdXR0b25DbGlja01lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gUHJlc2V0QnV0dG9uQ2xpY2tNZXNzYWdlKGJ1dHRvbikge1xuXHR0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcblx0dGhpcy52YWx1ZSA9IG51bGw7XG59XG5cblByZXNldEJ1dHRvbkNsaWNrTWVzc2FnZS5UWVBFID0gXCJwcmVzZXRCdXR0b25DbGlja1wiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0QnV0dG9uXG4gKi9cblByZXNldEJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuZ2V0QnV0dG9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmJ1dHRvbjtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cblByZXNldEJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5QcmVzZXRCdXR0b25DbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLmJ1dHRvbiA9IGRhdGEuYnV0dG9uO1xuXHR0aGlzLnZhbHVlID0gZGF0YS52YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblByZXNldEJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0YnV0dG9uOiB0aGlzLmJ1dHRvbixcblx0XHR2YWx1ZTogdGhpcy52YWx1ZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXNldEJ1dHRvbkNsaWNrTWVzc2FnZTsiLCJ2YXIgUHJlc2V0QnV0dG9uRGF0YSA9IHJlcXVpcmUoXCIuLi9kYXRhL1ByZXNldEJ1dHRvbkRhdGFcIik7XG5cbi8qKlxuICogUmVjZWl2ZWQgd2hlbiA/LlxuICogQGNsYXNzIFByZXNldEJ1dHRvbnNNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFByZXNldEJ1dHRvbnNNZXNzYWdlKCkge1xuXHR0aGlzLmJ1dHRvbnMgPSBuZXcgQXJyYXkoNyk7XG5cdHRoaXMuY3VycmVudCA9IG51bGw7XG59XG5cblByZXNldEJ1dHRvbnNNZXNzYWdlLlRZUEUgPSBcInByZXNldEJ1dHRvbnNcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEJ1dHRvbnNcbiAqL1xuUHJlc2V0QnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLmdldEJ1dHRvbnMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYnV0dG9ucztcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEN1cnJlbnRcbiAqL1xuUHJlc2V0QnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLmdldEN1cnJlbnQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY3VycmVudDtcbn1cblxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuUHJlc2V0QnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLmN1cnJlbnQgPSBkYXRhLmN1cnJlbnQ7XG5cblx0dGhpcy5idXR0b25zID0gbmV3IEFycmF5KCk7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IGRhdGEuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSBkYXRhLmJ1dHRvbnNbaV07XG5cdFx0dmFyIGJ1dHRvbkRhdGEgPSBudWxsO1xuXG5cdFx0aWYoYnV0dG9uICE9IG51bGwpIHtcblx0XHRcdGJ1dHRvbkRhdGEgPSBuZXcgUHJlc2V0QnV0dG9uRGF0YSgpO1xuXG5cdFx0XHRidXR0b25EYXRhLmJ1dHRvbiA9IGJ1dHRvbi5idXR0b247XG5cdFx0XHRidXR0b25EYXRhLnZhbHVlID0gYnV0dG9uLnZhbHVlO1xuXHRcdH1cblxuXHRcdHRoaXMuYnV0dG9ucy5wdXNoKGJ1dHRvbkRhdGEpO1xuXHR9XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5QcmVzZXRCdXR0b25zTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciBvYmplY3QgPSB7XG5cdFx0YnV0dG9uczogW10sXG5cdFx0Y3VycmVudDogdGhpcy5jdXJyZW50XG5cdH07XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b25EYXRhID0gdGhpcy5idXR0b25zW2ldO1xuXHRcdGlmKGJ1dHRvbkRhdGEgIT0gbnVsbClcblx0XHRcdG9iamVjdC5idXR0b25zLnB1c2goe1xuXHRcdFx0XHRidXR0b246IGJ1dHRvbkRhdGEuYnV0dG9uLFxuXHRcdFx0XHR2YWx1ZTogYnV0dG9uRGF0YS52YWx1ZVxuXHRcdFx0fSk7XG5cblx0XHRlbHNlXG5cdFx0XHRvYmplY3QuYnV0dG9ucy5wdXNoKG51bGwpO1xuXHR9XG5cblx0cmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVzZXRCdXR0b25zTWVzc2FnZTsiLCIvKipcbiAqIE1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VyIGhhcyBjbGlja2VkIGEgc2VhdC5cbiAqIEBjbGFzcyBTZWF0Q2xpY2tNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFNlYXRDbGlja01lc3NhZ2Uoc2VhdEluZGV4KSB7XG5cdHRoaXMuc2VhdEluZGV4PXNlYXRJbmRleDtcbn1cblxuU2VhdENsaWNrTWVzc2FnZS5UWVBFID0gXCJzZWF0Q2xpY2tcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFNlYXRJbmRleFxuICovXG5TZWF0Q2xpY2tNZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cblNlYXRDbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnNlYXRJbmRleCA9IGRhdGEuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuU2VhdENsaWNrTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2VhdEluZGV4OiB0aGlzLnNlYXRJbmRleCxcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWF0Q2xpY2tNZXNzYWdlOyIsIi8qKlxuICogU2hvdyB1c2VybmFtZSBhbmQgY2hpcHMgb24gc2VhdC5cbiAqIEBjbGFzcyBTZWF0SW5mb01lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gU2VhdEluZm9NZXNzYWdlKHNlYXRJbmRleCkge1xuXHR0aGlzLnNlYXRJbmRleCA9IHNlYXRJbmRleDtcblx0dGhpcy5hY3RpdmUgPSB0cnVlO1xuXHR0aGlzLnNpdG91dCA9IGZhbHNlO1xuXHR0aGlzLm5hbWUgPSBcIlwiO1xuXHR0aGlzLmNoaXBzID0gXCJcIjtcbn1cblxuU2VhdEluZm9NZXNzYWdlLlRZUEUgPSBcInNlYXRJbmZvXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRTZWF0SW5kZXhcbiAqL1xuU2VhdEluZm9NZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0TmFtZVxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMubmFtZTtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldENoaXBzXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0Q2hpcHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2hpcHM7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBpc1NpdG91dFxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLmlzU2l0b3V0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNpdG91dDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGlzQWN0aXZlXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYWN0aXZlO1xufVxuXG4vKipcbiAqIFNldHRlci5cbiAqIEBtZXRob2Qgc2V0QWN0aXZlXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odikge1xuXHR0aGlzLmFjdGl2ZSA9IHY7XG59XG5cbi8qKlxuICogU2V0IHNpdG91dC5cbiAqIEBtZXRob2Qgc2V0U2l0b3V0XG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuc2V0U2l0b3V0ID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnNpdG91dCA9IHY7XG59XG5cbi8qKlxuICogU2V0dGVyLlxuICogQG1ldGhvZCBzZXROYW1lXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuc2V0TmFtZSA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy5uYW1lID0gdjtcbn1cblxuLyoqXG4gKiBTZXR0ZXIuXG4gKiBAbWV0aG9kIHNldENoaXBzXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuc2V0Q2hpcHMgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMuY2hpcHMgPSB2O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuU2VhdEluZm9NZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBkYXRhLnNlYXRJbmRleDtcblx0dGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuXHR0aGlzLmNoaXBzID0gZGF0YS5jaGlwcztcblx0dGhpcy5zaXRvdXQgPSBkYXRhLnNpdG91dDtcblx0dGhpcy5hY3RpdmUgPSBkYXRhLmFjdGl2ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2VhdEluZGV4OiB0aGlzLnNlYXRJbmRleCxcblx0XHRuYW1lOiB0aGlzLm5hbWUsXG5cdFx0Y2hpcHM6IHRoaXMuY2hpcHMsXG5cdFx0c2l0b3V0OiB0aGlzLnNpdG91dCxcblx0XHRhY3RpdmU6IHRoaXMuYWN0aXZlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhdEluZm9NZXNzYWdlOyIsIi8qKlxuICogU2hvdyBkaWFsb2csIGZvciBlLmcuIGJ1eSBpbi5cbiAqIEBjbGFzcyBTaG93RGlhbG9nTWVzc2FnZVxuICovXG5mdW5jdGlvbiBTaG93RGlhbG9nTWVzc2FnZSgpIHtcblx0dGhpcy50ZXh0ID0gXCJcIjtcblx0dGhpcy5idXR0b25zID0gW107XG5cdHRoaXMuZGVmYXVsdFZhbHVlID0gbnVsbDtcbn1cblxuU2hvd0RpYWxvZ01lc3NhZ2UuVFlQRSA9IFwic2hvd0RpYWxvZ1wiO1xuXG4vKipcbiAqIEFkZCBhIGJ1dHRvbiB0byB0aGUgZGlhbG9nLlxuICogQG1ldGhvZCBhZGRCdXR0b25cbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLmFkZEJ1dHRvbiA9IGZ1bmN0aW9uKGJ1dHRvbikge1xuXHR0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pO1xufVxuXG4vKipcbiAqIEdldCB0ZXh0IG9mIHRoZSBkaWFsb2cuXG4gKiBAbWV0aG9kIGdldFRleHRcbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGV4dDtcbn1cblxuLyoqXG4gKiBHZXQgYXJyYXkgb2YgQnV0dG9uRGF0YSB0byBiZSBzaG93biBpbiB0aGUgZGlhbG9nLlxuICogQG1ldGhvZCBnZXRCdXR0b25zXG4gKi9cblNob3dEaWFsb2dNZXNzYWdlLnByb3RvdHlwZS5nZXRCdXR0b25zID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmJ1dHRvbnM7XG59XG5cbi8qKlxuICogR2V0IGRlZmF1bHQgdmFsdWUuXG4gKiBAbWV0aG9kIGdldEJ1dHRvbnNcbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLmdldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5kZWZhdWx0VmFsdWU7XG59XG5cbi8qKlxuICogU2V0IGRlZmF1bHQgdmFsdWUuXG4gKiBAbWV0aG9kIHNldERlZmF1bHRWYWx1ZVxuICovXG5TaG93RGlhbG9nTWVzc2FnZS5wcm90b3R5cGUuc2V0RGVmYXVsdFZhbHVlID0gZnVuY3Rpb24odikge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZT12O1xufVxuXG4vKipcbiAqIFNldCB0ZXh0IGluIHRoZSBkaWFsb2cuXG4gKiBAbWV0aG9kIHNldFRleHRcbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbih0ZXh0KSB7XG5cdHRoaXMudGV4dCA9IHRleHQ7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZS5cbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRleHQgPSBkYXRhLnRleHQ7XG5cdHRoaXMuYnV0dG9ucyA9IGRhdGEuYnV0dG9ucztcblx0dGhpcy5kZWZhdWx0VmFsdWUgPSBkYXRhLmRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblNob3dEaWFsb2dNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR0ZXh0OiB0aGlzLnRleHQsXG5cdFx0YnV0dG9uczogdGhpcy5idXR0b25zLFxuXHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5kZWZhdWx0VmFsdWVcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaG93RGlhbG9nTWVzc2FnZTsiLCIvKipcbiAqIEBjbGFzcyBTdGF0ZUNvbXBsZXRlTWVzc2FnZVxuICovXG5mdW5jdGlvbiBTdGF0ZUNvbXBsZXRlTWVzc2FnZSgpIHt9XG5cblN0YXRlQ29tcGxldGVNZXNzYWdlLlRZUEUgPSBcInN0YXRlQ29tcGxldGVcIjtcblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplLlxuICovXG5TdGF0ZUNvbXBsZXRlTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7fVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuU3RhdGVDb21wbGV0ZU1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVDb21wbGV0ZU1lc3NhZ2U7IiwiLyoqXG4gKiBSZWNlaXZlZCB3aGVuIHRhYmxlIGJ1dHRvbiBjbGlja2VkLlxuICogQGNsYXNzIFRhYmxlQnV0dG9uQ2xpY2tNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFRhYmxlQnV0dG9uQ2xpY2tNZXNzYWdlKHRhYmxlSW5kZXgpIHtcblx0dGhpcy50YWJsZUluZGV4ID0gdGFibGVJbmRleDtcbn1cblxuVGFibGVCdXR0b25DbGlja01lc3NhZ2UuVFlQRSA9IFwidGFibGVCdXR0b25DbGlja1wiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0VGFibGVJbmRleFxuICovXG5UYWJsZUJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuZ2V0VGFibGVJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50YWJsZUluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuVGFibGVCdXR0b25DbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRhYmxlSW5kZXggPSBkYXRhLnRhYmxlSW5kZXg7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5UYWJsZUJ1dHRvbkNsaWNrTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGFibGVJbmRleDogdGhpcy50YWJsZUluZGV4XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVCdXR0b25DbGlja01lc3NhZ2U7IiwiLyoqXG4gKiBSZWNlaXZlZCB3aGVuID8uXG4gKiBAY2xhc3MgVGFibGVCdXR0b25zTWVzc2FnZVxuICovXG5mdW5jdGlvbiBUYWJsZUJ1dHRvbnNNZXNzYWdlKCkge1xuXHR0aGlzLmVuYWJsZWQgPSBuZXcgQXJyYXkoKTtcblx0dGhpcy5jdXJyZW50SW5kZXggPSAtMTtcblx0dGhpcy5wbGF5ZXJJbmRleCA9IC0xO1xuXHR0aGlzLmluZm9MaW5rID0gXCJcIjtcbn1cblxuVGFibGVCdXR0b25zTWVzc2FnZS5UWVBFID0gXCJ0YWJsZUJ1dHRvbnNcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEVuYWJsZWRcbiAqL1xuVGFibGVCdXR0b25zTWVzc2FnZS5wcm90b3R5cGUuZ2V0RW5hYmxlZCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5lbmFibGVkO1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0Q3VycmVudEluZGV4XG4gKi9cblRhYmxlQnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLmdldEN1cnJlbnRJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jdXJyZW50SW5kZXg7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRQbGF5ZXJJbmRleFxuICovXG5UYWJsZUJ1dHRvbnNNZXNzYWdlLnByb3RvdHlwZS5nZXRQbGF5ZXJJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5wbGF5ZXJJbmRleDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEluZm9MaW5rXG4gKi9cblRhYmxlQnV0dG9uc01lc3NhZ2UucHJvdG90eXBlLmdldEluZm9MaW5rID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmluZm9MaW5rO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuVGFibGVCdXR0b25zTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMucGxheWVySW5kZXggPSBkYXRhLnBsYXllckluZGV4O1xuXHR0aGlzLmN1cnJlbnRJbmRleCA9IGRhdGEuY3VycmVudEluZGV4O1xuXHR0aGlzLmluZm9MaW5rID0gZGF0YS5pbmZvTGluaztcblxuXHR0aGlzLmVuYWJsZWQgPSBuZXcgQXJyYXkoKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGRhdGEuZW5hYmxlZC5sZW5ndGg7IGkrKylcblx0XHR0aGlzLmVuYWJsZWQucHVzaChkYXRhLmVuYWJsZWRbaV0pO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuVGFibGVCdXR0b25zTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciBvYmplY3QgPSB7XG5cdFx0Y3VycmVudEluZGV4OiB0aGlzLmN1cnJlbnRJbmRleCxcblx0XHRwbGF5ZXJJbmRleDogdGhpcy5wbGF5ZXJJbmRleCxcblx0XHRlbmFibGVkOiBbXSxcblx0XHRpbmZvTGluazogdGhpcy5pbmZvTGlua1xuXHR9O1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVuYWJsZWQubGVuZ3RoOyBpKyspXG5cdFx0b2JqZWN0LmVuYWJsZWQucHVzaCh0aGlzLmVuYWJsZWRbaV0pO1xuXG5cdHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVCdXR0b25zTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gPy5cbiAqIEBjbGFzcyBUYWJsZUluZm9NZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFRhYmxlSW5mb01lc3NhZ2UodGV4dCwgY291bnRkb3duKSB7XG5cdHRoaXMuY291bnRkb3duID0gY291bnRkb3duO1xuXHR0aGlzLnRleHQgPSB0ZXh0O1xuXHR0aGlzLnNob3dKb2luQnV0dG9uID0gZmFsc2U7XG5cdHRoaXMuc2hvd0xlYXZlQnV0dG9uID0gZmFsc2U7XG5cdHRoaXMuaW5mb0xpbmsgPSBudWxsO1xuXHR0aGlzLmluZm9MaW5rVGV4dCA9IG51bGw7XG59XG5cblRhYmxlSW5mb01lc3NhZ2UuVFlQRSA9IFwidGFibGVJbmZvXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRDb3VudGRvd25cbiAqL1xuVGFibGVJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0Q291bnRkb3duID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvdW50ZG93bjtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFRleHRcbiAqL1xuVGFibGVJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50ZXh0O1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0U2hvd0pvaW5CdXR0b25cbiAqL1xuVGFibGVJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0U2hvd0pvaW5CdXR0b24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2hvd0pvaW5CdXR0b247XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRTaG93TGVhdmVCdXR0b25cbiAqL1xuVGFibGVJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0U2hvd0xlYXZlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNob3dMZWF2ZUJ1dHRvbjtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEluZm9MaW5rXG4gKi9cblRhYmxlSW5mb01lc3NhZ2UucHJvdG90eXBlLmdldEluZm9MaW5rID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmluZm9MaW5rO1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0SW5mb0xpbmtUZXh0XG4gKi9cblRhYmxlSW5mb01lc3NhZ2UucHJvdG90eXBlLmdldEluZm9MaW5rVGV4dCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pbmZvTGlua1RleHQ7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuICovXG5UYWJsZUluZm9NZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0aWYoZGF0YS50ZXh0ICE9IG51bGwpXG5cdFx0dGhpcy50ZXh0ID0gZGF0YS50ZXh0O1xuXG5cdGlmKGRhdGEuY291bnRkb3duICE9IG51bGwpXG5cdFx0dGhpcy5jb3VudGRvd24gPSBkYXRhLmNvdW50ZG93bjtcblxuXHRpZihkYXRhLnNob3dKb2luQnV0dG9uICE9IG51bGwpXG5cdFx0dGhpcy5zaG93Sm9pbkJ1dHRvbiA9IGRhdGEuc2hvd0pvaW5CdXR0b247XG5cblx0aWYoZGF0YS5zaG93TGVhdmVCdXR0b24gIT0gbnVsbClcblx0XHR0aGlzLnNob3dMZWF2ZUJ1dHRvbiA9IGRhdGEuc2hvd0xlYXZlQnV0dG9uO1xuXG5cdGlmKGRhdGEuaW5mb0xpbmsgIT0gbnVsbClcblx0XHR0aGlzLmluZm9MaW5rID0gZGF0YS5pbmZvTGluaztcblxuXHRpZihkYXRhLmluZm9MaW5rVGV4dCAhPSBudWxsKVxuXHRcdHRoaXMuaW5mb0xpbmtUZXh0ID0gZGF0YS5pbmZvTGlua1RleHQ7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5UYWJsZUluZm9NZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR0ZXh0OiB0aGlzLnRleHQsXG5cdFx0Y291bnRkb3duOiB0aGlzLmNvdW50ZG93bixcblx0XHRzaG93Sm9pbkJ1dHRvbjogdGhpcy5zaG93Sm9pbkJ1dHRvbixcblx0XHRzaG93TGVhdmVCdXR0b246IHRoaXMuc2hvd0xlYXZlQnV0dG9uLFxuXHRcdGluZm9MaW5rOiB0aGlzLmluZm9MaW5rLFxuXHRcdGluZm9MaW5rVGV4dDogdGhpcy5pbmZvTGlua1RleHRcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZUluZm9NZXNzYWdlOyIsIi8qKlxuICogUmVjZWl2ZWQgd2hlbiA/LlxuICogQGNsYXNzIFRlc3RDYXNlUmVxdWVzdE1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gVGVzdENhc2VSZXF1ZXN0TWVzc2FnZSh0ZXN0Q2FzZSkge1xuXHR0aGlzLnRlc3RDYXNlID0gdGVzdENhc2U7XG59XG5cblRlc3RDYXNlUmVxdWVzdE1lc3NhZ2UuVFlQRSA9IFwidGVzdENhc2VSZXF1ZXN0XCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRUZXN0Q2FzZVxuICovXG5UZXN0Q2FzZVJlcXVlc3RNZXNzYWdlLnByb3RvdHlwZS5nZXRUZXN0Q2FzZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50ZXN0Q2FzZTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cblRlc3RDYXNlUmVxdWVzdE1lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRlc3RDYXNlID0gZGF0YS50ZXN0Q2FzZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblRlc3RDYXNlUmVxdWVzdE1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRlc3RDYXNlOiB0aGlzLnRlc3RDYXNlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdENhc2VSZXF1ZXN0TWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gPy5cbiAqIEBjbGFzcyBUaW1lck1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gVGltZXJNZXNzYWdlKCkge1xuXHR0aGlzLnNlYXRJbmRleCA9IC0xO1xuXHR0aGlzLnRvdGFsVGltZSA9IC0xO1xuXHR0aGlzLnRpbWVMZWZ0ID0gLTE7XG59XG5cblRpbWVyTWVzc2FnZS5UWVBFID0gXCJ0aW1lclwiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0U2VhdEluZGV4XG4gKi9cblRpbWVyTWVzc2FnZS5wcm90b3R5cGUuZ2V0U2VhdEluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNlYXRJbmRleDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldFRvdGFsVGltZVxuICovXG5UaW1lck1lc3NhZ2UucHJvdG90eXBlLmdldFRvdGFsVGltZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50b3RhbFRpbWU7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRUaW1lTGVmdFxuICovXG5UaW1lck1lc3NhZ2UucHJvdG90eXBlLmdldFRpbWVMZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRpbWVMZWZ0O1xufVxuXG4vKipcbiAqIFNldHRlci5cbiAqIEBtZXRob2Qgc2V0U2VhdEluZGV4XG4gKi9cblRpbWVyTWVzc2FnZS5wcm90b3R5cGUuc2V0U2VhdEluZGV4ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5zZWF0SW5kZXggPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXR0ZXIuXG4gKiBAbWV0aG9kIHNldFRvdGFsVGltZVxuICovXG5UaW1lck1lc3NhZ2UucHJvdG90eXBlLnNldFRvdGFsVGltZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMudG90YWxUaW1lID0gdmFsdWU7XG59XG5cbi8qKlxuICogU2V0dGVyLlxuICogQG1ldGhvZCBzZXRUaW1lTGVmdFxuICovXG5UaW1lck1lc3NhZ2UucHJvdG90eXBlLnNldFRpbWVMZWZ0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy50aW1lTGVmdCA9IHZhbHVlO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuVGltZXJNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBkYXRhLnNlYXRJbmRleDtcblx0dGhpcy50b3RhbFRpbWUgPSBkYXRhLnRvdGFsVGltZTtcblx0dGhpcy50aW1lTGVmdCA9IGRhdGEudGltZUxlZnQ7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5UaW1lck1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNlYXRJbmRleDogdGhpcy5zZWF0SW5kZXgsXG5cdFx0dG90YWxUaW1lOiB0aGlzLnRvdGFsVGltZSxcblx0XHR0aW1lTGVmdDogdGhpcy50aW1lTGVmdFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyTWVzc2FnZTsiLCIvKipcbiAqIFJlY2VpdmVkIHdoZW4gdG91cm5hbWVudCByZXN1bHQgbWVzc2FnZSBpcyBkaXNwYXRjaGVkLlxuICogQGNsYXNzIFRvdXJuYW1lbnRSZXN1bHRNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIFRvdXJuYW1lbnRSZXN1bHRNZXNzYWdlKHRleHQsIHJpZ2h0Q29sdW1uVGV4dCkge1xuXHR0aGlzLnRleHQgPSB0ZXh0O1xuXHR0aGlzLnJpZ2h0Q29sdW1uVGV4dCA9IHJpZ2h0Q29sdW1uVGV4dDtcbn1cblxuVG91cm5hbWVudFJlc3VsdE1lc3NhZ2UuVFlQRSA9IFwidG91cm5hbWVudFJlc3VsdFwiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0VGV4dFxuICovXG5Ub3VybmFtZW50UmVzdWx0TWVzc2FnZS5wcm90b3R5cGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50ZXh0O1xufVxuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0UmlnaHRDb2x1bW5UZXh0XG4gKi9cblRvdXJuYW1lbnRSZXN1bHRNZXNzYWdlLnByb3RvdHlwZS5nZXRSaWdodENvbHVtblRleHQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmlnaHRDb2x1bW5UZXh0O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuVG91cm5hbWVudFJlc3VsdE1lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRleHQgPSBkYXRhLnRleHQ7XG5cdHRoaXMucmlnaHRDb2x1bW5UZXh0ID0gZGF0YS5yaWdodENvbHVtblRleHQ7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Ub3VybmFtZW50UmVzdWx0TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGV4dDogdGhpcy50ZXh0LFxuXHRcdHJpZ2h0Q29sdW1uVGV4dDogdGhpcy5yaWdodENvbHVtblRleHRcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb3VybmFtZW50UmVzdWx0TWVzc2FnZTsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi9FdmVudERpc3BhdGNoZXJcIik7XG5cbi8qKlxuICogQnV0dG9uLlxuICogQGNsYXNzIEJ1dHRvblxuICogQG1vZHVsZSB1dGlsc1xuICovXG5mdW5jdGlvbiBCdXR0b24oY29udGVudCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHRpZiAoY29udGVudClcblx0XHR0aGlzLmFkZENoaWxkKGNvbnRlbnQpO1xuXG5cdHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xuXHR0aGlzLmJ1dHRvbk1vZGUgPSB0cnVlO1xuXG5cdHRoaXMubW91c2VvdmVyID0gdGhpcy5vbk1vdXNlb3Zlci5iaW5kKHRoaXMpO1xuXHR0aGlzLm1vdXNlb3V0ID0gdGhpcy5vbk1vdXNlb3V0LmJpbmQodGhpcyk7XG5cdHRoaXMubW91c2Vkb3duID0gdGhpcy5vbk1vdXNlZG93bi5iaW5kKHRoaXMpO1xuXHR0aGlzLm1vdXNldXAgPSB0aGlzLm9uTW91c2V1cC5iaW5kKHRoaXMpO1xuXHR0aGlzLmNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcyk7XG5cblx0dGhpcy5jb2xvck1hdHJpeEZpbHRlciA9IG5ldyBQSVhJLkNvbG9yTWF0cml4RmlsdGVyKCk7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gWzEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdO1xuXG5cdHRoaXMuZmlsdGVycyA9IFt0aGlzLmNvbG9yTWF0cml4RmlsdGVyXTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChCdXR0b24sIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChCdXR0b24pO1xuXG5CdXR0b24uTElHSFRfTUFUUklYID0gWzEuNSwgMCwgMCwgMCwgMCwgMS41LCAwLCAwLCAwLCAwLCAxLjUsIDAsIDAsIDAsIDAsIDFdO1xuQnV0dG9uLkRBUktfTUFUUklYID0gWy43NSwgMCwgMCwgMCwgMCwgLjc1LCAwLCAwLCAwLCAwLCAuNzUsIDAsIDAsIDAsIDAsIDFdO1xuQnV0dG9uLkRFRkFVTFRfTUFUUklYID0gWzEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdO1xuXG5CdXR0b24uQ0xJQ0sgPSBcImNsaWNrXCI7XG5cbi8qKlxuICogTW91c2Ugb3Zlci5cbiAqIEBtZXRob2Qgb25Nb3VzZW92ZXJcbiAqIEBwcml2YXRlXG4gKi9cbkJ1dHRvbi5wcm90b3R5cGUub25Nb3VzZW92ZXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jb2xvck1hdHJpeEZpbHRlci5tYXRyaXggPSBCdXR0b24uTElHSFRfTUFUUklYO1xufVxuXG4vKipcbiAqIE1vdXNlIG91dC5cbiAqIEBtZXRob2Qgb25Nb3VzZW91dFxuICogQHByaXZhdGVcbiAqL1xuQnV0dG9uLnByb3RvdHlwZS5vbk1vdXNlb3V0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gQnV0dG9uLkRFRkFVTFRfTUFUUklYO1xufVxuXG4vKipcbiAqIE1vdXNlIGRvd24uXG4gKiBAbWV0aG9kIG9uTW91c2Vkb3duXG4gKiBAcHJpdmF0ZVxuICovXG5CdXR0b24ucHJvdG90eXBlLm9uTW91c2Vkb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gQnV0dG9uLkRBUktfTUFUUklYO1xufVxuXG4vKipcbiAqIE1vdXNlIHVwLlxuICogQG1ldGhvZCBvbk1vdXNldXBcbiAqIEBwcml2YXRlXG4gKi9cbkJ1dHRvbi5wcm90b3R5cGUub25Nb3VzZXVwID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gQnV0dG9uLkxJR0hUX01BVFJJWDtcbn1cblxuLyoqXG4gKiBDbGljay5cbiAqIEBtZXRob2Qgb25DbGlja1xuICogQHByaXZhdGVcbiAqL1xuQnV0dG9uLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudHJpZ2dlcihCdXR0b24uQ0xJQ0spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbjsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwiLi9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgQnV0dG9uID0gcmVxdWlyZShcIi4vQnV0dG9uXCIpO1xuXG4vKipcbiAqIENoZWNrYm94LlxuICogQGNsYXNzIENoZWNrYm94XG4gKiBAbW9kdWxlIHV0aWxzXG4gKi9cbmZ1bmN0aW9uIENoZWNrYm94KGJhY2tncm91bmQsIHRpY2spIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dGhpcy5idXR0b24gPSBuZXcgQnV0dG9uKGJhY2tncm91bmQpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuYnV0dG9uKTtcblxuXHR0aGlzLmNoZWNrID0gdGljaztcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmNoZWNrKTtcblxuXHR0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkJ1dHRvbkNsaWNrLCB0aGlzKTtcblxuXHR0aGlzLnNldENoZWNrZWQoZmFsc2UpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKENoZWNrYm94LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoQ2hlY2tib3gpO1xuXG4vKipcbiAqIEJ1dHRvbiBjbGljay5cbiAqIEBtZXRob2Qgb25CdXR0b25DbGlja1xuICogQHByaXZhdGVcbiAqL1xuQ2hlY2tib3gucHJvdG90eXBlLm9uQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jaGVjay52aXNpYmxlID0gIXRoaXMuY2hlY2sudmlzaWJsZTtcblxuXHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJjaGFuZ2VcIik7XG59XG5cbi8qKlxuICogU2V0dGVyLlxuICogQG1ldGhvZCBzZXRDaGVja2VkXG4gKi9cbkNoZWNrYm94LnByb3RvdHlwZS5zZXRDaGVja2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5jaGVjay52aXNpYmxlID0gdmFsdWU7XG5cdHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldENoZWNrZWRcbiAqL1xuQ2hlY2tib3gucHJvdG90eXBlLmdldENoZWNrZWQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2hlY2sudmlzaWJsZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrYm94OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcblxuZnVuY3Rpb24gQ29udGVudFNjYWxlcihjb250ZW50KSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuY29udGVudFdpZHRoID0gMTAwO1xuXHR0aGlzLmNvbnRlbnRIZWlnaHQgPSAxMDA7XG5cblx0dGhpcy5zY3JlZW5XaWR0aCA9IDEwMDtcblx0dGhpcy5zY3JlZW5IZWlnaHQgPSAxMDA7XG5cblx0dGhpcy50aGVNYXNrID0gbnVsbDtcblxuXHRpZiAoY29udGVudClcblx0XHR0aGlzLnNldENvbnRlbnQoY29udGVudCk7XG5cblx0dGhpcy5hbGlnbiA9IENvbnRlbnRTY2FsZXIuTUlERExFO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKENvbnRlbnRTY2FsZXIsIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5cbkNvbnRlbnRTY2FsZXIuTUlERExFID0gXCJtaWRkbGVcIjtcbkNvbnRlbnRTY2FsZXIuVE9QID0gXCJ0b3BcIjtcblxuQ29udGVudFNjYWxlci5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0dGhpcy5jb250ZW50ID0gY29udGVudDtcblxuXHR0aGlzLmFkZENoaWxkKHRoaXMuY29udGVudCk7XG5cblx0aWYgKHRoaXMudGhlTWFzaykge1xuXHRcdHRoaXMucmVtb3ZlQ2hpbGQodGhpcy50aGVNYXNrKTtcblx0XHR0aGlzLnRoZU1hc2sgPSBudWxsO1xuXHR9XG5cblx0dGhpcy50aGVNYXNrID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0Ly90aGlzLmFkZENoaWxkKHRoaXMudGhlTWFzayk7XG5cblx0dGhpcy51cGRhdGVTY2FsZSgpO1xufVxuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS5zZXRDb250ZW50U2l6ZSA9IGZ1bmN0aW9uKGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuXHR0aGlzLmNvbnRlbnRXaWR0aCA9IGNvbnRlbnRXaWR0aDtcblx0dGhpcy5jb250ZW50SGVpZ2h0ID0gY29udGVudEhlaWdodDtcblxuXHR0aGlzLnVwZGF0ZVNjYWxlKCk7XG59XG5cbkNvbnRlbnRTY2FsZXIucHJvdG90eXBlLnNldFNjcmVlblNpemUgPSBmdW5jdGlvbihzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KSB7XG5cdHRoaXMuc2NyZWVuV2lkdGggPSBzY3JlZW5XaWR0aDtcblx0dGhpcy5zY3JlZW5IZWlnaHQgPSBzY3JlZW5IZWlnaHQ7XG5cblx0dGhpcy51cGRhdGVTY2FsZSgpO1xufVxuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS5zZXRBbGlnbiA9IGZ1bmN0aW9uKGFsaWduKSB7XG5cdHRoaXMuYWxpZ24gPSBhbGlnbjtcblx0dGhpcy51cGRhdGVTY2FsZSgpO1xufVxuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS51cGRhdGVTY2FsZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgc2NhbGU7XG5cblx0aWYgKHRoaXMuc2NyZWVuV2lkdGggLyB0aGlzLmNvbnRlbnRXaWR0aCA8IHRoaXMuc2NyZWVuSGVpZ2h0IC8gdGhpcy5jb250ZW50SGVpZ2h0KVxuXHRcdHNjYWxlID0gdGhpcy5zY3JlZW5XaWR0aCAvIHRoaXMuY29udGVudFdpZHRoO1xuXG5cdGVsc2Vcblx0XHRzY2FsZSA9IHRoaXMuc2NyZWVuSGVpZ2h0IC8gdGhpcy5jb250ZW50SGVpZ2h0O1xuXG5cdHRoaXMuY29udGVudC5zY2FsZS54ID0gc2NhbGU7XG5cdHRoaXMuY29udGVudC5zY2FsZS55ID0gc2NhbGU7XG5cblx0dmFyIHNjYWxlZFdpZHRoID0gdGhpcy5jb250ZW50V2lkdGggKiBzY2FsZTtcblx0dmFyIHNjYWxlZEhlaWdodCA9IHRoaXMuY29udGVudEhlaWdodCAqIHNjYWxlO1xuXG5cdHRoaXMuY29udGVudC5wb3NpdGlvbi54ID0gKHRoaXMuc2NyZWVuV2lkdGggLSBzY2FsZWRXaWR0aCkgLyAyO1xuXG5cdGlmICh0aGlzLmFsaWduID09IENvbnRlbnRTY2FsZXIuVE9QKVxuXHRcdHRoaXMuY29udGVudC5wb3NpdGlvbi55ID0gMDtcblxuXHRlbHNlXG5cdFx0dGhpcy5jb250ZW50LnBvc2l0aW9uLnkgPSAodGhpcy5zY3JlZW5IZWlnaHQgLSBzY2FsZWRIZWlnaHQpIC8gMjtcblxuXHR2YXIgciA9IG5ldyBQSVhJLlJlY3RhbmdsZSh0aGlzLmNvbnRlbnQucG9zaXRpb24ueCwgdGhpcy5jb250ZW50LnBvc2l0aW9uLnksIHNjYWxlZFdpZHRoLCBzY2FsZWRIZWlnaHQpO1xuXHR2YXIgcmlnaHQgPSByLnggKyByLndpZHRoO1xuXHR2YXIgYm90dG9tID0gci55ICsgci5oZWlnaHQ7XG5cblx0dGhpcy50aGVNYXNrLmNsZWFyKCk7XG5cdHRoaXMudGhlTWFzay5iZWdpbkZpbGwoKTtcblx0dGhpcy50aGVNYXNrLmRyYXdSZWN0KDAsIDAsIHRoaXMuc2NyZWVuV2lkdGgsIHIueSk7XG5cdHRoaXMudGhlTWFzay5kcmF3UmVjdCgwLCAwLCByLngsIHRoaXMuc2NyZWVuSGVpZ2h0KTtcblx0dGhpcy50aGVNYXNrLmRyYXdSZWN0KHJpZ2h0LCAwLCB0aGlzLnNjcmVlbldpZHRoIC0gcmlnaHQsIHRoaXMuc2NyZWVuSGVpZ2h0KTtcblx0dGhpcy50aGVNYXNrLmRyYXdSZWN0KDAsIGJvdHRvbSwgdGhpcy5zY3JlZW5XaWR0aCwgdGhpcy5zY3JlZW5IZWlnaHQgLSBib3R0b20pO1xuXHR0aGlzLnRoZU1hc2suZW5kRmlsbCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRlbnRTY2FsZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQVMzL2pxdWVyeSBzdHlsZSBldmVudCBkaXNwYXRjaGVyLiBTbGlnaHRseSBtb2RpZmllZC4gVGhlXG4gKiBqcXVlcnkgc3R5bGUgb24vb2ZmL3RyaWdnZXIgc3R5bGUgb2YgYWRkaW5nIGxpc3RlbmVycyBpc1xuICogY3VycmVudGx5IHRoZSBwcmVmZXJyZWQgb25lLlxuICogXG4gKiBUaGUgb24gbWV0aG9kIGZvciBhZGRpbmcgbGlzdGVuZXJzIHRha2VzIGFuIGV4dHJhIHBhcmFtZXRlciB3aGljaCBpcyB0aGVcbiAqIHNjb3BlIGluIHdoaWNoIGxpc3RlbmVycyBzaG91bGQgYmUgY2FsbGVkLiBTbyB0aGlzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogSGFzIHRoZSBzYW1lIGZ1bmN0aW9uIHdoZW4gYWRkaW5nIGV2ZW50cyBhczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gKlxuICogSG93ZXZlciwgdGhlIGRpZmZlcmVuY2UgaXMgdGhhdCBpZiB3ZSB1c2UgdGhlIHNlY29uZCBtZXRob2QgaXRcbiAqIHdpbGwgbm90IGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGxhdGVyLCB1bmxlc3NcbiAqIHRoZSBjbG9zdXJlIGNyZWF0ZWQgYnkgYmluZCBpcyBzdG9yZWQgc29tZXdoZXJlLiBJZiB0aGUgXG4gKiBmaXJzdCBtZXRob2QgaXMgdXNlZCwgd2UgY2FuIHJlbW92ZSB0aGUgbGlzdGVuZXIgd2l0aDpcbiAqXG4gKiAgICAgb2JqZWN0Lm9mZihcImV2ZW50XCIsIGxpc3RlbmVyLCB0aGlzKTtcbiAqXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKiBAbW9kdWxlIHV0aWxzXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcblx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lci5cbiAqIEBtZXRob2QgYWRkRXZlbnRMaXN0ZW5lclxuICogQGRlcHJlY2F0ZWRcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIWV2ZW50VHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdGlmICghbGlzdGVuZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTGlzdGVuZXIgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcblxuXHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG5cdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdHNjb3BlOiBzY29wZVxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIuXG4gKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAqIEBkZXByZWNhdGVkXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSBsaXN0ZW5lcnNbaV07XG5cblx0XHRpZiAobGlzdGVuZXIgPT0gbGlzdGVuZXJPYmoubGlzdGVuZXIgJiYgc2NvcGUgPT0gbGlzdGVuZXJPYmouc2NvcGUpIHtcblx0XHRcdGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFsaXN0ZW5lcnMubGVuZ3RoKVxuXHRcdGRlbGV0ZSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggZXZlbnQuXG4gKiBAbWV0aG9kIGRpc3BhdGNoRXZlbnRcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAodHlwZW9mIGV2ZW50ID09IFwic3RyaW5nXCIpIHtcblx0XHRldmVudCA9IHtcblx0XHRcdHR5cGU6IGV2ZW50XG5cdFx0fTtcblx0fVxuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudC50eXBlKSlcblx0XHRyZXR1cm47XG5cblx0aWYgKGRhdGEgPT0gdW5kZWZpbmVkKVxuXHRcdGRhdGEgPSBldmVudDtcblxuXHRkYXRhLnRhcmdldCA9IHRoaXM7XG5cblx0Zm9yICh2YXIgaSBpbiB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50LnR5cGVdKSB7XG5cdFx0dmFyIGxpc3RlbmVyT2JqID0gdGhpcy5saXN0ZW5lck1hcFtldmVudC50eXBlXVtpXTtcblxuXHRcdGxpc3RlbmVyT2JqLmxpc3RlbmVyLmNhbGwobGlzdGVuZXJPYmouc2NvcGUsIGRhdGEpO1xuXHR9XG59XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBhZGRFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9uXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9mZlxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGRpc3BhdGNoRXZlbnRcbiAqIEBtZXRob2QgdHJpZ2dlclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbi8qKlxuICogTWFrZSBzb21ldGhpbmcgYW4gZXZlbnQgZGlzcGF0Y2hlci4gQ2FuIGJlIHVzZWQgZm9yIG11bHRpcGxlIGluaGVyaXRhbmNlLlxuICogQG1ldGhvZCBpbml0XG4gKiBAc3RhdGljXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5pbml0ID0gZnVuY3Rpb24oY2xzKSB7XG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cdGNscy5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmO1xuXHRjbHMucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnREaXNwYXRjaGVyOyIsIi8qKlxuICogRnVuY3Rpb24gdXRpbHMuXG4gKiBAY2xhc3MgRnVuY3Rpb25VdGlsXG4gKiBAbW9kdWxlIHV0aWxzXG4gKi9cbmZ1bmN0aW9uIEZ1bmN0aW9uVXRpbCgpIHtcbn1cblxuLyoqXG4gKiBFeHRlbmQgYSBjbGFzcy5cbiAqIERvbid0IGZvcmdldCB0byBjYWxsIHN1cGVyLlxuICogQG1ldGhvZCBleHRlbmRcbiAqIEBzdGF0aWNcbiAqL1xuRnVuY3Rpb25VdGlsLmV4dGVuZD1mdW5jdGlvbih0YXJnZXQsIGJhc2UpIHtcblx0dGFyZ2V0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGJhc2UucHJvdG90eXBlKTtcblx0dGFyZ2V0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10YXJnZXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGRlbGVnYXRlIGZ1bmN0aW9uLiBEZXByZWNhdGVkLCB1c2UgYmluZCgpIGluc3RlYWQuXG4gKiBAbWV0aG9kIGNyZWF0ZURlbGVnYXRlXG4gKiBAZGVwcmVjYXRlZFxuICogQHN0YXRpY1xuICovXG5GdW5jdGlvblV0aWwuY3JlYXRlRGVsZWdhdGU9ZnVuY3Rpb24oZnVuYywgc2NvcGUpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGZ1bmMuYXBwbHkoc2NvcGUsYXJndW1lbnRzKTtcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHM9RnVuY3Rpb25VdGlsO1xuIiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi9GdW5jdGlvblV0aWxcIik7XG5cbi8qKlxuICogQ3JlYXRlIGEgc3ByaXRlIHdpdGggYSBncmFkaWVudC5cbiAqIEBjbGFzcyBHcmFkaWVudFxuICogQG1vZHVsZSB1dGlsc1xuICovXG5mdW5jdGlvbiBHcmFkaWVudCgpIHtcblx0dGhpcy53aWR0aCA9IDEwMDtcblx0dGhpcy5oZWlnaHQgPSAxMDA7XG5cdHRoaXMuc3RvcHMgPSBbXTtcbn1cblxuLyoqXG4gKiBTZXQgc2l6ZSBvZiB0aGUgZ3JhZGllbnQuXG4gKiBAbWV0aG9kIHNldFNpemVcbiAqL1xuR3JhZGllbnQucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3LCBoKSB7XG5cdHRoaXMud2lkdGggPSB3O1xuXHR0aGlzLmhlaWdodCA9IGg7XG59XG5cbi8qKlxuICogQWRkIGNvbG9yIHN0b3AuXG4gKiBAbWV0aG9kIGFkZENvbG9yU3RvcFxuICovXG5HcmFkaWVudC5wcm90b3R5cGUuYWRkQ29sb3JTdG9wID0gZnVuY3Rpb24od2VpZ2h0LCBjb2xvcikge1xuXHR0aGlzLnN0b3BzLnB1c2goe1xuXHRcdHdlaWdodDogd2VpZ2h0LFxuXHRcdGNvbG9yOiBjb2xvclxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIHNwcml0ZS5cbiAqIEBtZXRob2QgY3JlYXRlU3ByaXRlXG4gKi9cbkdyYWRpZW50LnByb3RvdHlwZS5jcmVhdGVTcHJpdGUgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJyZW5kZXJpbmcgZ3JhZGllbnQuLi5cIik7XG5cdHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0Yy53aWR0aCA9IHRoaXMud2lkdGg7XG5cdGMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0dmFyIGN0eCA9IGMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHR2YXIgZ3JkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuaGVpZ2h0KTtcblx0dmFyIGk7XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMuc3RvcHMubGVuZ3RoOyBpKyspXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCh0aGlzLnN0b3BzW2ldLndlaWdodCwgdGhpcy5zdG9wc1tpXS5jb2xvcik7XG5cblx0Y3R4LmZpbGxTdHlsZSA9IGdyZDtcblx0Y3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuXHRyZXR1cm4gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tQ2FudmFzKGMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFkaWVudDsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4vRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBUaGVuYWJsZSA9IHJlcXVpcmUoXCIuL1RoZW5hYmxlXCIpO1xuXG4vKipcbiAqIE1lc3NhZ2UgY29ubmVjdGlvbiBpbiBhIGJyb3dzZXIuXG4gKiBAY2xhc3MgTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb25cbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24oKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXHR0aGlzLnRlc3QgPSAxO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLCBFdmVudERpc3BhdGNoZXIpO1xuXG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DT05ORUNUID0gXCJjb25uZWN0XCI7XG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5NRVNTQUdFID0gXCJtZXNzYWdlXCI7XG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DTE9TRSA9IFwiY2xvc2VcIjtcblxuLyoqXG4gKiBDb25uZWN0LlxuICogQG1ldGhvZCBjb25uZWN0XG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24odXJsKSB7XG5cdHRoaXMud2ViU29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuXG5cdHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9IHRoaXMub25XZWJTb2NrZXRPcGVuLmJpbmQodGhpcyk7XG5cdHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMub25XZWJTb2NrZXRNZXNzYWdlLmJpbmQodGhpcyk7XG5cdHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSB0aGlzLm9uV2ViU29ja2V0Q2xvc2UuYmluZCh0aGlzKTtcblx0dGhpcy53ZWJTb2NrZXQub25lcnJvciA9IHRoaXMub25XZWJTb2NrZXRFcnJvci5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiAqIFNlbmQuXG4gKiBAbWV0aG9kIHNlbmRcbiAqL1xuTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24ucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtKSB7XG5cdHRoaXMud2ViU29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobSkpO1xufVxuXG4vKipcbiAqIFdlYiBzb2NrZXQgb3Blbi5cbiAqIEBtZXRob2Qgb25XZWJTb2NrZXRPcGVuXG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5wcm90b3R5cGUub25XZWJTb2NrZXRPcGVuID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudHJpZ2dlcihNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DT05ORUNUKTtcbn1cblxuLyoqXG4gKiBXZWIgc29ja2V0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uV2ViU29ja2V0TWVzc2FnZVxuICogQHByaXZhdGVcbiAqL1xuTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24ucHJvdG90eXBlLm9uV2ViU29ja2V0TWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG5cblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5NRVNTQUdFLFxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2Vcblx0fSk7XG59XG5cbi8qKlxuICogV2ViIHNvY2tldCBjbG9zZS5cbiAqIEBtZXRob2Qgb25XZWJTb2NrZXRDbG9zZVxuICogQHByaXZhdGVcbiAqL1xuTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24ucHJvdG90eXBlLm9uV2ViU29ja2V0Q2xvc2UgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJ3ZWIgc29ja2V0IGNsb3NlLCB3cz1cIiArIHRoaXMud2ViU29ja2V0ICsgXCIgdGhpcz1cIiArIHRoaXMudGVzdCk7XG5cdHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG5cdHRoaXMuY2xlYXJXZWJTb2NrZXQoKTtcblxuXHR0aGlzLnRyaWdnZXIoTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uQ0xPU0UpO1xufVxuXG4vKipcbiAqIFdlYiBzb2NrZXQgZXJyb3IuXG4gKiBAbWV0aG9kIG9uV2ViU29ja2V0RXJyb3JcbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5vbldlYlNvY2tldEVycm9yID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwid2ViIHNvY2tldCBlcnJvciwgd3M9XCIgKyB0aGlzLndlYlNvY2tldCArIFwiIHRoaXM9XCIgKyB0aGlzLnRlc3QpO1xuXG5cdHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG5cdHRoaXMuY2xlYXJXZWJTb2NrZXQoKTtcblxuXHR0aGlzLnRyaWdnZXIoTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uQ0xPU0UpO1xufVxuXG4vKipcbiAqIENsZWFyIHRoZSBjdXJyZW50IHdlYiBzb2NrZXQuXG4gKiBAbWV0aG9kIGNsZWFyV2ViU29ja2V0XG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5jbGVhcldlYlNvY2tldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLndlYlNvY2tldC5vbm9wZW4gPSBudWxsO1xuXHR0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuXHR0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gbnVsbDtcblx0dGhpcy53ZWJTb2NrZXQub25lcnJvciA9IG51bGw7XG5cblx0dGhpcy53ZWJTb2NrZXQgPSBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBNb3VzZU92ZXJHcm91cC4gVGhpcyBpcyB0aGUgY2xhc3MgZm9yIHRoZSBNb3VzZU92ZXJHcm91cC5cbiAqIEBjbGFzcyBNb3VzZU92ZXJHcm91cFxuICogQG1vZHVsZSB1dGlsc1xuICovXG5mdW5jdGlvbiBNb3VzZU92ZXJHcm91cCgpIHtcblx0dGhpcy5vYmplY3RzID0gbmV3IEFycmF5KCk7XG5cdHRoaXMuY3VycmVudGx5T3ZlciA9IGZhbHNlO1xuXHR0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuXG59XG5GdW5jdGlvblV0aWwuZXh0ZW5kKE1vdXNlT3Zlckdyb3VwLCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoTW91c2VPdmVyR3JvdXApO1xuXG5cbi8qKlxuICogQWRkIGRpc3BsYXlvYmplY3QgdG8gd2F0Y2hsaXN0LlxuICogQG1ldGhvZCBhZGREaXNwbGF5T2JqZWN0XG4gKi9cbk1vdXNlT3Zlckdyb3VwLnByb3RvdHlwZS5hZGREaXNwbGF5T2JqZWN0ID0gZnVuY3Rpb24oZGlzcGxheU9iamVjdCkge1xuXG5cdGRpc3BsYXlPYmplY3QuaW50ZXJhY3RpdmUgPSB0cnVlO1xuXHRkaXNwbGF5T2JqZWN0Lm1vdXNlb3ZlckVuYWJsZWQgPSB0cnVlO1xuXHRkaXNwbGF5T2JqZWN0Lm1vdXNlb3ZlciA9IHRoaXMub25PYmplY3RNb3VzZU92ZXIuYmluZCh0aGlzKTtcblx0ZGlzcGxheU9iamVjdC5tb3VzZW91dCA9IHRoaXMub25PYmplY3RNb3VzZU91dC5iaW5kKHRoaXMpO1xuXHRkaXNwbGF5T2JqZWN0Lm1vdXNlZG93biA9IHRoaXMub25PYmplY3RNb3VzZURvd24uYmluZCh0aGlzKTtcblx0dGhpcy5vYmplY3RzLnB1c2goZGlzcGxheU9iamVjdCk7XG5cbn1cblxuXG4vKipcbiAqIE1vdXNlIG92ZXIgb2JqZWN0LlxuICogQG1ldGhvZCBvbk9iamVjdE1vdXNlT3ZlclxuICovXG5Nb3VzZU92ZXJHcm91cC5wcm90b3R5cGUub25PYmplY3RNb3VzZU92ZXIgPSBmdW5jdGlvbihpbnRlcmFjdGlvbl9vYmplY3QpIHtcblx0aWYodGhpcy5jdXJyZW50bHlPdmVyKVxuXHRcdHJldHVybjtcblxuXHR0aGlzLmN1cnJlbnRseU92ZXIgPSB0cnVlO1xuXHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJtb3VzZW92ZXJcIik7XG59XG5cblxuLyoqXG4gKiBNb3VzZSBvdXQgb2JqZWN0LlxuICogQG1ldGhvZCBvbk9iamVjdE1vdXNlT3V0XG4gKi9cbk1vdXNlT3Zlckdyb3VwLnByb3RvdHlwZS5vbk9iamVjdE1vdXNlT3V0ID0gZnVuY3Rpb24oaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdGlmKCF0aGlzLmN1cnJlbnRseU92ZXIgfHwgdGhpcy5tb3VzZURvd24pXG5cdFx0cmV0dXJuO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspXG5cdFx0aWYodGhpcy5oaXRUZXN0KHRoaXMub2JqZWN0c1tpXSwgaW50ZXJhY3Rpb25fb2JqZWN0KSlcblx0XHRcdHJldHVybjtcblxuXHR0aGlzLmN1cnJlbnRseU92ZXIgPSBmYWxzZTtcblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwibW91c2VvdXRcIik7XG59XG5cblxuLyoqXG4gKiBIaXQgdGVzdC5cbiAqIEBtZXRob2QgaGl0VGVzdFxuICovXG5Nb3VzZU92ZXJHcm91cC5wcm90b3R5cGUuaGl0VGVzdCA9IGZ1bmN0aW9uKG9iamVjdCwgaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdGlmKChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnggPiBvYmplY3QuZ2V0Qm91bmRzKCkueCApICYmIChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnggPCAob2JqZWN0LmdldEJvdW5kcygpLnggKyBvYmplY3QuZ2V0Qm91bmRzKCkud2lkdGgpKSAmJlxuXHRcdChpbnRlcmFjdGlvbl9vYmplY3QuZ2xvYmFsLnkgPiBvYmplY3QuZ2V0Qm91bmRzKCkueSkgJiYgKGludGVyYWN0aW9uX29iamVjdC5nbG9iYWwueSA8IChvYmplY3QuZ2V0Qm91bmRzKCkueSArIG9iamVjdC5nZXRCb3VuZHMoKS5oZWlnaHQpKSkge1xuXHRcdHJldHVybiB0cnVlO1x0XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cblxuLyoqXG4gKiBNb3VzZSBkb3duIG9iamVjdC5cbiAqIEBtZXRob2Qgb25PYmplY3RNb3VzZURvd25cbiAqL1xuTW91c2VPdmVyR3JvdXAucHJvdG90eXBlLm9uT2JqZWN0TW91c2VEb3duID0gZnVuY3Rpb24oaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdHRoaXMubW91c2VEb3duID0gdHJ1ZTtcblx0aW50ZXJhY3Rpb25fb2JqZWN0LnRhcmdldC5tb3VzZXVwID0gaW50ZXJhY3Rpb25fb2JqZWN0LnRhcmdldC5tb3VzZXVwb3V0c2lkZSA9IHRoaXMub25TdGFnZU1vdXNlVXAuYmluZCh0aGlzKTtcbn1cblxuXG4vKipcbiAqIE1vdXNlIHVwIHN0YWdlLlxuICogQG1ldGhvZCBvblN0YWdlTW91c2VVcFxuICovXG5Nb3VzZU92ZXJHcm91cC5wcm90b3R5cGUub25TdGFnZU1vdXNlVXAgPSBmdW5jdGlvbihpbnRlcmFjdGlvbl9vYmplY3QpIHtcblx0aW50ZXJhY3Rpb25fb2JqZWN0LnRhcmdldC5tb3VzZXVwID0gaW50ZXJhY3Rpb25fb2JqZWN0LnRhcmdldC5tb3VzZXVwb3V0c2lkZSA9IG51bGw7XG5cdHRoaXMubW91c2VEb3duID0gZmFsc2U7XG5cblx0aWYodGhpcy5jdXJyZW50bHlPdmVyKSB7XG5cdFx0dmFyIG92ZXIgPSBmYWxzZTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLm9iamVjdHMubGVuZ3RoOyBpKyspXG5cdFx0XHRpZih0aGlzLmhpdFRlc3QodGhpcy5vYmplY3RzW2ldLCBpbnRlcmFjdGlvbl9vYmplY3QpKVxuXHRcdFx0XHRvdmVyID0gdHJ1ZTtcblxuXHRcdGlmKCFvdmVyKSB7XG5cdFx0XHR0aGlzLmN1cnJlbnRseU92ZXIgPSBmYWxzZTtcblx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChcIm1vdXNlb3V0XCIpO1xuXHRcdH1cblx0fVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTW91c2VPdmVyR3JvdXA7XG5cbiIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xuXG4vKipcbiAqIE5pbmUgc2xpY2UuIFRoaXMgaXMgYSBzcHJpdGUgdGhhdCBpcyBhIGdyaWQsIGFuZCBvbmx5IHRoZVxuICogbWlkZGxlIHBhcnQgc3RyZXRjaGVzIHdoZW4gc2NhbGluZy5cbiAqIEBjbGFzcyBOaW5lU2xpY2VcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gTmluZVNsaWNlKHRleHR1cmUsIGxlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbSkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuXG5cdGlmICghdG9wKVxuXHRcdHRvcCA9IGxlZnQ7XG5cblx0aWYgKCFyaWdodClcblx0XHRyaWdodCA9IGxlZnQ7XG5cblx0aWYgKCFib3R0b20pXG5cdFx0Ym90dG9tID0gdG9wO1xuXG5cdHRoaXMubGVmdCA9IGxlZnQ7XG5cdHRoaXMudG9wID0gdG9wO1xuXHR0aGlzLnJpZ2h0ID0gcmlnaHQ7XG5cdHRoaXMuYm90dG9tID0gYm90dG9tO1xuXG5cdHRoaXMubG9jYWxXaWR0aCA9IHRleHR1cmUud2lkdGg7XG5cdHRoaXMubG9jYWxIZWlnaHQgPSB0ZXh0dXJlLmhlaWdodDtcblxuXHR0aGlzLmJ1aWxkUGFydHMoKTtcblx0dGhpcy51cGRhdGVTaXplcygpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE5pbmVTbGljZSwgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBCdWlsZCB0aGUgcGFydHMgZm9yIHRoZSBzbGljZXMuXG4gKiBAbWV0aG9kIGJ1aWxkUGFydHNcbiAqIEBwcml2YXRlXG4gKi9cbk5pbmVTbGljZS5wcm90b3R5cGUuYnVpbGRQYXJ0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgeHAgPSBbMCwgdGhpcy5sZWZ0LCB0aGlzLnRleHR1cmUud2lkdGggLSB0aGlzLnJpZ2h0LCB0aGlzLnRleHR1cmUud2lkdGhdO1xuXHR2YXIgeXAgPSBbMCwgdGhpcy50b3AsIHRoaXMudGV4dHVyZS5oZWlnaHQgLSB0aGlzLmJvdHRvbSwgdGhpcy50ZXh0dXJlLmhlaWdodF07XG5cdHZhciBoaSwgdmk7XG5cblx0dGhpcy5wYXJ0cyA9IFtdO1xuXG5cdGZvciAodmkgPSAwOyB2aSA8IDM7IHZpKyspIHtcblx0XHRmb3IgKGhpID0gMDsgaGkgPCAzOyBoaSsrKSB7XG5cdFx0XHR2YXIgdyA9IHhwW2hpICsgMV0gLSB4cFtoaV07XG5cdFx0XHR2YXIgaCA9IHlwW3ZpICsgMV0gLSB5cFt2aV07XG5cblx0XHRcdGlmICh3ICE9IDAgJiYgaCAhPSAwKSB7XG5cdFx0XHRcdHZhciB0ZXh0dXJlUGFydCA9IHRoaXMuY3JlYXRlVGV4dHVyZVBhcnQoeHBbaGldLCB5cFt2aV0sIHcsIGgpO1xuXHRcdFx0XHR2YXIgcyA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlUGFydCk7XG5cdFx0XHRcdHRoaXMuYWRkQ2hpbGQocyk7XG5cblx0XHRcdFx0dGhpcy5wYXJ0cy5wdXNoKHMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJ0cy5wdXNoKG51bGwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSBzaXplcy5cbiAqIEBtZXRob2QgdXBkYXRlU2l6ZXNcbiAqIEBwcml2YXRlXG4gKi9cbk5pbmVTbGljZS5wcm90b3R5cGUudXBkYXRlU2l6ZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHhwID0gWzAsIHRoaXMubGVmdCwgdGhpcy5sb2NhbFdpZHRoIC0gdGhpcy5yaWdodCwgdGhpcy5sb2NhbFdpZHRoXTtcblx0dmFyIHlwID0gWzAsIHRoaXMudG9wLCB0aGlzLmxvY2FsSGVpZ2h0IC0gdGhpcy5ib3R0b20sIHRoaXMubG9jYWxIZWlnaHRdO1xuXHR2YXIgaGksIHZpLCBpID0gMDtcblxuXHRmb3IgKHZpID0gMDsgdmkgPCAzOyB2aSsrKSB7XG5cdFx0Zm9yIChoaSA9IDA7IGhpIDwgMzsgaGkrKykge1xuXHRcdFx0aWYgKHRoaXMucGFydHNbaV0pIHtcblx0XHRcdFx0dmFyIHBhcnQgPSB0aGlzLnBhcnRzW2ldO1xuXG5cdFx0XHRcdHBhcnQucG9zaXRpb24ueCA9IHhwW2hpXTtcblx0XHRcdFx0cGFydC5wb3NpdGlvbi55ID0geXBbdmldO1xuXHRcdFx0XHRwYXJ0LndpZHRoID0geHBbaGkgKyAxXSAtIHhwW2hpXTtcblx0XHRcdFx0cGFydC5oZWlnaHQgPSB5cFt2aSArIDFdIC0geXBbdmldO1xuXHRcdFx0fVxuXG5cdFx0XHRpKys7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogU2V0IGxvY2FsIHNpemUuXG4gKiBAbWV0aG9kIHNldExvY2FsU2l6ZVxuICovXG5OaW5lU2xpY2UucHJvdG90eXBlLnNldExvY2FsU2l6ZSA9IGZ1bmN0aW9uKHcsIGgpIHtcblx0dGhpcy5sb2NhbFdpZHRoID0gdztcblx0dGhpcy5sb2NhbEhlaWdodCA9IGg7XG5cdHRoaXMudXBkYXRlU2l6ZXMoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGV4dHVyZSBwYXJ0LlxuICogQG1ldGhvZCBjcmVhdGVUZXh0dXJlUGFydFxuICogQHByaXZhdGVcbiAqL1xuTmluZVNsaWNlLnByb3RvdHlwZS5jcmVhdGVUZXh0dXJlUGFydCA9IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblx0dmFyIGZyYW1lID0ge1xuXHRcdHg6IHRoaXMudGV4dHVyZS5mcmFtZS54ICsgeCxcblx0XHR5OiB0aGlzLnRleHR1cmUuZnJhbWUueSArIHksXG5cdFx0d2lkdGg6IHdpZHRoLFxuXHRcdGhlaWdodDogaGVpZ2h0XG5cdH07XG5cblx0cmV0dXJuIG5ldyBQSVhJLlRleHR1cmUodGhpcy50ZXh0dXJlLCBmcmFtZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmluZVNsaWNlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIFRXRUVOID0gcmVxdWlyZShcInR3ZWVuLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBDb250ZW50U2NhbGVyID0gcmVxdWlyZShcIi4vQ29udGVudFNjYWxlclwiKTtcbi8vdmFyIEZyYW1lVGltZXIgPSByZXF1aXJlKFwiLi9GcmFtZVRpbWVyXCIpO1xuXG4vKipcbiAqIFBpeGkgZnVsbCB3aW5kb3cgYXBwLlxuICogQ2FuIG9wZXJhdGUgdXNpbmcgd2luZG93IGNvb3JkaW5hdGVzIG9yIHNjYWxlZCB0byBzcGVjaWZpYyBhcmVhLlxuICogQGNsYXNzIFBpeGlBcHBcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gUGl4aUFwcChkb21JZCwgd2lkdGgsIGhlaWdodCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmNvbnRlbnRBbGlnbj1Db250ZW50U2NhbGVyLk1JRERMRTtcblxuXHR2YXIgdmlldztcblxuXHRpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMpXG5cdFx0dmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmVlbmNhbnZhcycpO1xuXG5cdGVsc2Vcblx0XHR2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cblx0aWYgKCFkb21JZCkge1xuXHRcdGlmIChQaXhpQXBwLmZ1bGxTY3JlZW5JbnN0YW5jZSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk9ubHkgb25lIFBpeGlBcHAgcGVyIGFwcFwiKTtcblxuXHRcdFBpeGlBcHAuZnVsbFNjcmVlbkluc3RhbmNlID0gdGhpcztcblxuXHRcdGNvbnNvbGUubG9nKFwibm8gZG9tIGl0LCBhdHRhY2hpbmcgdG8gYm9keVwiKTtcblx0XHR0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuYm9keTtcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbiA9IDA7XG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nID0gMDtcblxuXHRcdGRvY3VtZW50LmJvZHkub25yZXNpemUgPSBGdW5jdGlvblV0aWwuY3JlYXRlRGVsZWdhdGUodGhpcy5vbldpbmRvd1Jlc2l6ZSwgdGhpcyk7XG5cdFx0d2luZG93Lm9ucmVzaXplID0gRnVuY3Rpb25VdGlsLmNyZWF0ZURlbGVnYXRlKHRoaXMub25XaW5kb3dSZXNpemUsIHRoaXMpO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUubG9nKFwiYXR0YWNoaW5nIHRvOiBcIiArIGRvbUlkKTtcblx0XHR0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSWQpO1xuXHR9XG5cblx0dGhpcy5yZW5kZXJlciA9IG5ldyBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih0aGlzLmNvbnRhaW5lckVsLmNsaWVudFdpZHRoLCB0aGlzLmNvbnRhaW5lckVsLmNsaWVudEhlaWdodCwgdmlldyk7XG5cdHRoaXMuY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci52aWV3KTtcblxuXHR0aGlzLmNvbnRlbnRTY2FsZXIgPSBudWxsO1xuXG5cdHRoaXMuYXBwU3RhZ2UgPSBuZXcgUElYSS5TdGFnZSgwLCB0cnVlKTtcblxuXHRpZiAoIXdpZHRoIHx8ICFoZWlnaHQpXG5cdFx0dGhpcy51c2VOb1NjYWxpbmcoKTtcblxuXHRlbHNlXG5cdFx0dGhpcy51c2VTY2FsaW5nKHdpZHRoLCBoZWlnaHQpO1xuXG4vL1x0RnJhbWVUaW1lci5nZXRJbnN0YW5jZSgpLmFkZEV2ZW50TGlzdGVuZXIoRnJhbWVUaW1lci5SRU5ERVIsIHRoaXMub25BbmltYXRpb25GcmFtZSwgdGhpcyk7XG5cblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm9uQW5pbWF0aW9uRnJhbWUuYmluZCh0aGlzKSk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoUGl4aUFwcCwgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBVc2Ugc2NhbGluZyBtb2RlLlxuICogQG1ldGhvZCB1c2VTY2FsaW5nXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLnVzZVNjYWxpbmcgPSBmdW5jdGlvbih3LCBoKSB7XG5cdHRoaXMucmVtb3ZlQ29udGVudCgpO1xuXG5cdHRoaXMuY29udGVudFNjYWxlciA9IG5ldyBDb250ZW50U2NhbGVyKHRoaXMpO1xuXHR0aGlzLmNvbnRlbnRTY2FsZXIuc2V0QWxpZ24odGhpcy5jb250ZW50QWxpZ24pO1xuXHR0aGlzLmNvbnRlbnRTY2FsZXIuc2V0Q29udGVudFNpemUodywgaCk7XG5cdHRoaXMuY29udGVudFNjYWxlci5zZXRTY3JlZW5TaXplKHRoaXMuY29udGFpbmVyRWwuY2xpZW50V2lkdGgsIHRoaXMuY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0KTtcblx0dGhpcy5hcHBTdGFnZS5hZGRDaGlsZCh0aGlzLmNvbnRlbnRTY2FsZXIpO1xufVxuXG4vKipcbiAqIFNldCBjb250ZW50IGFsaWdubWVudC5cbiAqIEBtZXRob2Qgc2V0Q29udGVudEFsaWduXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLnNldENvbnRlbnRBbGlnbiA9IGZ1bmN0aW9uKGFsaWduKSB7XG5cdHRoaXMuY29udGVudEFsaWduPWFsaWduO1xuXG5cdGlmICh0aGlzLmNvbnRlbnRTY2FsZXIpXG5cdFx0dGhpcy5jb250ZW50U2NhbGVyLnNldEFsaWduKHRoaXMuY29udGVudEFsaWduKTtcbn1cblxuLyoqXG4gKiBVc2Ugbm8gc2NhbGluZyBtb2RlLlxuICogQG1ldGhvZCB1c2VOb1NjYWxpbmdcbiAqL1xuUGl4aUFwcC5wcm90b3R5cGUudXNlTm9TY2FsaW5nID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlQ29udGVudCgpO1xuXG5cdHRoaXMuYXBwU3RhZ2UuYWRkQ2hpbGQodGhpcyk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFueSBjb250ZW50LlxuICogQG1ldGhvZCByZW1vdmVDb250ZW50XG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpQXBwLnByb3RvdHlwZS5yZW1vdmVDb250ZW50ID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmFwcFN0YWdlLmNoaWxkcmVuLmluZGV4T2YodGhpcykgPj0gMClcblx0XHR0aGlzLmFwcFN0YWdlLnJlbW92ZUNoaWxkKHRoaXMpO1xuXG5cdGlmICh0aGlzLmNvbnRlbnRTY2FsZXIpIHtcblx0XHR0aGlzLmFwcFN0YWdlLnJlbW92ZUNoaWxkKHRoaXMuY29udGVudFNjYWxlcilcblx0XHR0aGlzLmNvbnRlbnRTY2FsZXIgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogV2luZG93IHJlc2l6ZS5cbiAqIEBtZXRob2Qgb25XaW5kb3dSZXNpemVcbiAqIEBwcml2YXRlXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLmNvbnRlbnRTY2FsZXIpXG5cdFx0dGhpcy5jb250ZW50U2NhbGVyLnNldFNjcmVlblNpemUodGhpcy5jb250YWluZXJFbC5jbGllbnRXaWR0aCwgdGhpcy5jb250YWluZXJFbC5jbGllbnRIZWlnaHQpO1xuXG5cdHRoaXMucmVuZGVyZXIucmVzaXplKHRoaXMuY29udGFpbmVyRWwuY2xpZW50V2lkdGgsIHRoaXMuY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0KTtcblx0dGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5hcHBTdGFnZSk7XG59XG5cbi8qKlxuICogQW5pbWF0aW9uIGZyYW1lLlxuICogQG1ldGhvZCBvbkFuaW1hdGlvbkZyYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5QaXhpQXBwLnByb3RvdHlwZS5vbkFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24odGltZSkge1xuXHR0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcFN0YWdlKTtcblx0VFdFRU4udXBkYXRlKHRpbWUpO1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vbkFuaW1hdGlvbkZyYW1lLmJpbmQodGhpcykpO1xufVxuXG4vKipcbiAqIEdldCBjYW52YXMuXG4gKiBAbWV0aG9kIGdldENhbnZhc1xuICovXG5QaXhpQXBwLnByb3RvdHlwZS5nZXRDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVuZGVyZXIudmlldztcbn1cblxuLyoqXG4gKiBHZXQgc3RhZ2UuXG4gKiBAbWV0aG9kIGdldFN0YWdlXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLmdldFN0YWdlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFwcFN0YWdlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpeGlBcHA7IiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgcG9pbnQuXG4gKiBAY2xhc3MgUG9pbnRcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgUG9pbnQpKVxuXHRcdHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG5cblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDsiLCJ2YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBQZXJmb3JtIHRhc2tzIGluIGEgc2VxdWVuY2UuXG4gKiBUYXNrcywgd2hpY2ggc2hvdWxkIGJlIGV2ZW50IGRpc3BhdGNoZXJzLFxuICogYXJlIGV1cXVldWVkIHdpdGggdGhlIGVucXVldWUgZnVuY3Rpb24sXG4gKiBhIFNUQVJUIGV2ZW50IGlzIGRpc3BhdGNoZXIgdXBvbiB0YXNrXG4gKiBzdGFydCwgYW5kIHRoZSB0YXNrIGlzIGNvbnNpZGVyZWQgY29tcGxldGVcbiAqIGFzIGl0IGRpc3BhdGNoZXMgYSBDT01QTEVURSBldmVudC5cbiAqIEBjbGFzcyBTZXF1ZW5jZXJcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gU2VxdWVuY2VyKCkge1xuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnF1ZXVlID0gW107XG5cdHRoaXMuY3VycmVudFRhc2sgPSBudWxsO1xuXHR0aGlzLm9uVGFza0NvbXBsZXRlQ2xvc3VyZSA9IHRoaXMub25UYXNrQ29tcGxldGUuYmluZCh0aGlzKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChTZXF1ZW5jZXIsIEV2ZW50RGlzcGF0Y2hlcik7XG5cblNlcXVlbmNlci5TVEFSVCA9IFwic3RhcnRcIjtcblNlcXVlbmNlci5DT01QTEVURSA9IFwiY29tcGxldGVcIjtcblxuLyoqXG4gKiBFbnF1ZXVlIGEgdGFzayB0byBiZSBwZXJmb3JtZWQuXG4gKiBAbWV0aG9kIGVucXVldWVcbiAqL1xuU2VxdWVuY2VyLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24odGFzaykge1xuXHRpZiAoIXRoaXMuY3VycmVudFRhc2spXG5cdFx0dGhpcy5zdGFydFRhc2sodGFzaylcblxuXHRlbHNlXG5cdFx0dGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xufVxuXG4vKipcbiAqIFN0YXJ0IHRoZSB0YXNrLlxuICogQG1ldGhvZCBzdGFydFRhc2tcbiAqIEBwcml2YXRlXG4gKi9cblNlcXVlbmNlci5wcm90b3R5cGUuc3RhcnRUYXNrID0gZnVuY3Rpb24odGFzaykge1xuXHR0aGlzLmN1cnJlbnRUYXNrID0gdGFzaztcblxuXHR0aGlzLmN1cnJlbnRUYXNrLmFkZEV2ZW50TGlzdGVuZXIoU2VxdWVuY2VyLkNPTVBMRVRFLCB0aGlzLm9uVGFza0NvbXBsZXRlQ2xvc3VyZSk7XG5cdHRoaXMuY3VycmVudFRhc2suZGlzcGF0Y2hFdmVudCh7XG5cdFx0dHlwZTogU2VxdWVuY2VyLlNUQVJUXG5cdH0pO1xufVxuXG4vKipcbiAqIFRoZSBjdXJyZW50IHRhc2sgaXMgY29tcGxldGUuXG4gKiBAbWV0aG9kIG9uVGFza0NvbXBsZXRlXG4gKsKgQHByaXZhdGVcbiAqL1xuU2VxdWVuY2VyLnByb3RvdHlwZS5vblRhc2tDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmN1cnJlbnRUYXNrLnJlbW92ZUV2ZW50TGlzdGVuZXIoU2VxdWVuY2VyLkNPTVBMRVRFLCB0aGlzLm9uVGFza0NvbXBsZXRlQ2xvc3VyZSk7XG5cdHRoaXMuY3VycmVudFRhc2sgPSBudWxsO1xuXG5cdGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA+IDApXG5cdFx0dGhpcy5zdGFydFRhc2sodGhpcy5xdWV1ZS5zaGlmdCgpKTtcblxuXHRlbHNlXG5cdFx0dGhpcy50cmlnZ2VyKFNlcXVlbmNlci5DT01QTEVURSk7XG5cbn1cblxuLyoqXG4gKiBBYm9ydCB0aGUgc2VxdWVuY2UuXG4gKiBAbWV0aG9kIGFib3J0XG4gKi9cblNlcXVlbmNlci5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuY3VycmVudFRhc2spIHtcblx0XHR0aGlzLmN1cnJlbnRUYXNrLnJlbW92ZUV2ZW50TGlzdGVuZXIoU2VxdWVuY2VyLkNPTVBMRVRFLCB0aGlzLm9uVGFza0NvbXBsZXRlQ2xvc3VyZSk7XG5cdFx0dGhpcy5jdXJyZW50VGFzayA9IG51bGw7XG5cdH1cblxuXHR0aGlzLnF1ZXVlID0gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VxdWVuY2VyOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgVFdFRU4gPSByZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBTbGlkZXIuIFRoaXMgaXMgdGhlIGNsYXNzIGZvciB0aGUgc2xpZGVyLlxuICogQGNsYXNzIFNsaWRlclxuICogQG1vZHVsZSB1dGlsc1xuICovXG5mdW5jdGlvbiBTbGlkZXIoYmFja2dyb3VuZCwga25vYikge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xuXHR0aGlzLmtub2IgPSBrbm9iO1xuXG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5iYWNrZ3JvdW5kKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmtub2IpO1xuXG5cblx0dGhpcy5rbm9iLmJ1dHRvbk1vZGUgPSB0cnVlO1xuXHR0aGlzLmtub2IuaW50ZXJhY3RpdmUgPSB0cnVlO1xuXHR0aGlzLmtub2IubW91c2Vkb3duID0gdGhpcy5vbktub2JNb3VzZURvd24uYmluZCh0aGlzKTtcblxuXHR0aGlzLmJhY2tncm91bmQuYnV0dG9uTW9kZSA9IHRydWU7XG5cdHRoaXMuYmFja2dyb3VuZC5pbnRlcmFjdGl2ZSA9IHRydWU7XG5cdHRoaXMuYmFja2dyb3VuZC5tb3VzZWRvd24gPSB0aGlzLm9uQmFja2dyb3VuZE1vdXNlRG93bi5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuZmFkZVR3ZWVuID0gbnVsbDtcblx0dGhpcy5hbHBoYSA9IDA7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoU2xpZGVyLCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoU2xpZGVyKTtcblxuXG4vKipcbiAqIE1vdXNlIGRvd24gb24ga25vYi5cbiAqIEBtZXRob2Qgb25Lbm9iTW91c2VEb3duXG4gKi9cblNsaWRlci5wcm90b3R5cGUub25Lbm9iTW91c2VEb3duID0gZnVuY3Rpb24oaW50ZXJhY3Rpb25fb2JqZWN0KSB7XG5cdHRoaXMuZG93blBvcyA9IHRoaXMua25vYi5wb3NpdGlvbi54O1xuXHR0aGlzLmRvd25YID0gaW50ZXJhY3Rpb25fb2JqZWN0LmdldExvY2FsUG9zaXRpb24odGhpcykueDtcblxuXHR0aGlzLnN0YWdlLm1vdXNldXAgPSB0aGlzLm9uU3RhZ2VNb3VzZVVwLmJpbmQodGhpcyk7XG5cdHRoaXMuc3RhZ2UubW91c2Vtb3ZlID0gdGhpcy5vblN0YWdlTW91c2VNb3ZlLmJpbmQodGhpcyk7XG59XG5cblxuLyoqXG4gKiBNb3VzZSBkb3duIG9uIGJhY2tncm91bmQuXG4gKiBAbWV0aG9kIG9uQmFja2dyb3VuZE1vdXNlRG93blxuICovXG5TbGlkZXIucHJvdG90eXBlLm9uQmFja2dyb3VuZE1vdXNlRG93biA9IGZ1bmN0aW9uKGludGVyYWN0aW9uX29iamVjdCkge1xuXHR0aGlzLmRvd25YID0gaW50ZXJhY3Rpb25fb2JqZWN0LmdldExvY2FsUG9zaXRpb24odGhpcykueDtcblx0dGhpcy5rbm9iLnggPSBpbnRlcmFjdGlvbl9vYmplY3QuZ2V0TG9jYWxQb3NpdGlvbih0aGlzKS54IC0gdGhpcy5rbm9iLndpZHRoKjAuNTtcblxuXHR0aGlzLnZhbGlkYXRlVmFsdWUoKTtcblxuXHR0aGlzLmRvd25Qb3MgPSB0aGlzLmtub2IucG9zaXRpb24ueDtcblxuXHR0aGlzLnN0YWdlLm1vdXNldXAgPSB0aGlzLm9uU3RhZ2VNb3VzZVVwLmJpbmQodGhpcyk7XG5cdHRoaXMuc3RhZ2UubW91c2Vtb3ZlID0gdGhpcy5vblN0YWdlTW91c2VNb3ZlLmJpbmQodGhpcyk7XG5cblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiY2hhbmdlXCIpO1xufVxuXG5cbi8qKlxuICogTW91c2UgdXAuXG4gKiBAbWV0aG9kIG9uU3RhZ2VNb3VzZVVwXG4gKi9cblNsaWRlci5wcm90b3R5cGUub25TdGFnZU1vdXNlVXAgPSBmdW5jdGlvbihpbnRlcmFjdGlvbl9vYmplY3QpIHtcblx0dGhpcy5zdGFnZS5tb3VzZXVwID0gbnVsbDtcblx0dGhpcy5zdGFnZS5tb3VzZW1vdmUgPSBudWxsO1xufVxuXG5cbi8qKlxuICogTW91c2UgbW92ZS5cbiAqIEBtZXRob2Qgb25TdGFnZU1vdXNlTW92ZVxuICovXG5TbGlkZXIucHJvdG90eXBlLm9uU3RhZ2VNb3VzZU1vdmUgPSBmdW5jdGlvbihpbnRlcmFjdGlvbl9vYmplY3QpIHtcblx0dGhpcy5rbm9iLnggPSB0aGlzLmRvd25Qb3MgKyAoaW50ZXJhY3Rpb25fb2JqZWN0LmdldExvY2FsUG9zaXRpb24odGhpcykueCAtIHRoaXMuZG93blgpO1xuXG5cdHRoaXMudmFsaWRhdGVWYWx1ZSgpO1xuXG5cdHRoaXMuZGlzcGF0Y2hFdmVudChcImNoYW5nZVwiKTtcbn1cblxuXG4vKipcbiAqIFZhbGlkYXRlIHBvc2l0aW9uLlxuICogQG1ldGhvZCB2YWxpZGF0ZVZhbHVlXG4gKi9cblNsaWRlci5wcm90b3R5cGUudmFsaWRhdGVWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKHRoaXMua25vYi54IDwgMClcblx0XHR0aGlzLmtub2IueCA9IDA7XG5cblx0aWYodGhpcy5rbm9iLnggPiAodGhpcy5iYWNrZ3JvdW5kLndpZHRoIC0gdGhpcy5rbm9iLndpZHRoKSlcblx0XHR0aGlzLmtub2IueCA9IHRoaXMuYmFja2dyb3VuZC53aWR0aCAtIHRoaXMua25vYi53aWR0aDtcbn1cblxuXG4vKipcbiAqIEdldCB2YWx1ZS5cbiAqIEBtZXRob2QgZ2V0VmFsdWVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZnJhY3Rpb24gPSB0aGlzLmtub2IucG9zaXRpb24ueC8odGhpcy5iYWNrZ3JvdW5kLndpZHRoIC0gdGhpcy5rbm9iLndpZHRoKTtcblxuXHRyZXR1cm4gZnJhY3Rpb247XG59XG5cblxuLyoqXG4gKiBHZXQgdmFsdWUuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLmtub2IueCA9IHRoaXMuYmFja2dyb3VuZC5wb3NpdGlvbi54ICsgdmFsdWUqKHRoaXMuYmFja2dyb3VuZC53aWR0aCAtIHRoaXMua25vYi53aWR0aCk7XG5cblx0dGhpcy52YWxpZGF0ZVZhbHVlKCk7XG5cdHJldHVybiB0aGlzLmdldFZhbHVlKCk7XG59XG5cblxuLyoqXG4gKiBTaG93LlxuICogQG1ldGhvZCBzaG93XG4gKi9cblNsaWRlci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXHRpZih0aGlzLmZhZGVUd2VlbiAhPSBudWxsKVxuXHRcdHRoaXMuZmFkZVR3ZWVuLnN0b3AoKTtcblx0dGhpcy5mYWRlVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odGhpcylcblx0XHRcdC50byh7YWxwaGE6IDF9LCAyNTApXG5cdFx0XHQuc3RhcnQoKTtcbn1cblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRpZih0aGlzLmZhZGVUd2VlbiAhPSBudWxsKVxuXHRcdHRoaXMuZmFkZVR3ZWVuLnN0b3AoKTtcblx0dGhpcy5mYWRlVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odGhpcylcblx0XHRcdC50byh7YWxwaGE6IDB9LCAyNTApXG5cdFx0XHQub25Db21wbGV0ZSh0aGlzLm9uSGlkZGVuLmJpbmQodGhpcykpXG5cdFx0XHQuc3RhcnQoKTtcbn1cblxuLyoqXG4gKiBPbiBoaWRkZW4uXG4gKiBAbWV0aG9kIG9uSGlkZGVuXG4gKi9cblNsaWRlci5wcm90b3R5cGUub25IaWRkZW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZXI7XG4iLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4vRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBwcm9taXNlcyBhcyBkZWZpbmVkIGhlcmU6XG4gKiBodHRwOi8vcHJvbWlzZXMtYXBsdXMuZ2l0aHViLmlvL3Byb21pc2VzLXNwZWMvXG4gKiBAY2xhc3MgVGhlbmFibGVcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuZnVuY3Rpb24gVGhlbmFibGUoKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpXG5cblx0dGhpcy5zdWNjZXNzSGFuZGxlcnMgPSBbXTtcblx0dGhpcy5lcnJvckhhbmRsZXJzID0gW107XG5cdHRoaXMubm90aWZpZWQgPSBmYWxzZTtcblx0dGhpcy5oYW5kbGVyc0NhbGxlZCA9IGZhbHNlO1xuXHR0aGlzLm5vdGlmeVBhcmFtID0gbnVsbDtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChUaGVuYWJsZSwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBTZXQgcmVzb2x1dGlvbiBoYW5kbGVycy5cbiAqIEBtZXRob2QgdGhlblxuICogQHBhcmFtIHN1Y2Nlc3MgVGhlIGZ1bmN0aW9uIGNhbGxlZCB0byBoYW5kbGUgc3VjY2Vzcy5cbiAqIEBwYXJhbSBlcnJvciBUaGUgZnVuY3Rpb24gY2FsbGVkIHRvIGhhbmRsZSBlcnJvci5cbiAqIEByZXR1cm4gVGhpcyBUaGVuYWJsZSBmb3IgY2hhaW5pbmcuXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24oc3VjY2VzcywgZXJyb3IpIHtcblx0aWYgKHRoaXMuaGFuZGxlcnNDYWxsZWQpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0aGVuYWJsZSBpcyBhbHJlYWR5IHVzZWQuXCIpO1xuXG5cdHRoaXMuc3VjY2Vzc0hhbmRsZXJzLnB1c2goc3VjY2Vzcyk7XG5cdHRoaXMuZXJyb3JIYW5kbGVycy5wdXNoKGVycm9yKTtcblxuXHRyZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBOb3RpZnkgc3VjY2VzcyBvZiB0aGUgb3BlcmF0aW9uLlxuICogQG1ldGhvZCBub3RpZnlTdWNjZXNzXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS5ub3RpZnlTdWNjZXNzID0gZnVuY3Rpb24ocGFyYW0pIHtcblx0aWYgKHRoaXMuaGFuZGxlcnNDYWxsZWQpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0aGVuYWJsZSBpcyBhbHJlYWR5IG5vdGlmaWVkLlwiKTtcblxuXHR0aGlzLm5vdGlmeVBhcmFtID0gcGFyYW07XG5cdHNldFRpbWVvdXQodGhpcy5kb05vdGlmeVN1Y2Nlc3MuYmluZCh0aGlzKSwgMCk7XG59XG5cbi8qKlxuICogTm90aWZ5IGZhaWx1cmUgb2YgdGhlIG9wZXJhdGlvbi5cbiAqIEBtZXRob2Qgbm90aWZ5RXJyb3JcbiAqL1xuVGhlbmFibGUucHJvdG90eXBlLm5vdGlmeUVycm9yID0gZnVuY3Rpb24ocGFyYW0pIHtcblx0aWYgKHRoaXMuaGFuZGxlcnNDYWxsZWQpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0aGVuYWJsZSBpcyBhbHJlYWR5IG5vdGlmaWVkLlwiKTtcblxuXHR0aGlzLm5vdGlmeVBhcmFtID0gcGFyYW07XG5cdHNldFRpbWVvdXQodGhpcy5kb05vdGlmeUVycm9yLmJpbmQodGhpcyksIDApO1xufVxuXG4vKipcbiAqIEFjdHVhbGx5IG5vdGlmeSBzdWNjZXNzLlxuICogQG1ldGhvZCBkb05vdGlmeVN1Y2Nlc3NcbiAqIEBwcml2YXRlXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS5kb05vdGlmeVN1Y2Nlc3MgPSBmdW5jdGlvbihwYXJhbSkge1xuXHRpZiAocGFyYW0pXG5cdFx0dGhpcy5ub3RpZnlQYXJhbSA9IHBhcmFtO1xuXG5cdHRoaXMuY2FsbEhhbmRsZXJzKHRoaXMuc3VjY2Vzc0hhbmRsZXJzKTtcbn1cblxuLyoqXG4gKiBBY3R1YWxseSBub3RpZnkgZXJyb3IuXG4gKiBAbWV0aG9kIGRvTm90aWZ5RXJyb3JcbiAqIEBwcml2YXRlXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS5kb05vdGlmeUVycm9yID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2FsbEhhbmRsZXJzKHRoaXMuZXJyb3JIYW5kbGVycyk7XG59XG5cbi8qKlxuICogQ2FsbCBoYW5kbGVycy5cbiAqIEBtZXRob2QgY2FsbEhhbmRsZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5UaGVuYWJsZS5wcm90b3R5cGUuY2FsbEhhbmRsZXJzID0gZnVuY3Rpb24oaGFuZGxlcnMpIHtcblx0aWYgKHRoaXMuaGFuZGxlcnNDYWxsZWQpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5ldmVyIGhhcHBlbi5cIik7XG5cblx0dGhpcy5oYW5kbGVyc0NhbGxlZCA9IHRydWU7XG5cblx0Zm9yICh2YXIgaSBpbiBoYW5kbGVycykge1xuXHRcdGlmIChoYW5kbGVyc1tpXSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aGFuZGxlcnNbaV0uY2FsbChudWxsLCB0aGlzLm5vdGlmeVBhcmFtKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkV4Y2VwdGlvbiBpbiBUaGVuYWJsZSBoYW5kbGVyOiBcIiArIGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlLnN0YWNrKTtcblx0XHRcdFx0dGhyb3cgZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBSZXNvbHZlIHByb21pc2UuXG4gKiBAbWV0aG9kIHJlc29sdmVcbiAqL1xuVGhlbmFibGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZXN1bHQpIHtcblx0dGhpcy5ub3RpZnlTdWNjZXNzKHJlc3VsdCk7XG59XG5cbi8qKlxuICogUmVqZWN0IHByb21pc2UuXG4gKiBAbWV0aG9kIHJlamVjdFxuICovXG5UaGVuYWJsZS5wcm90b3R5cGUucmVqZWN0ID0gZnVuY3Rpb24ocmVhc29uKSB7XG5cdHRoaXMubm90aWZ5RXJyb3IocmVhc29uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaGVuYWJsZTsiXX0=
