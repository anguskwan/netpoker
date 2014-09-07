(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var PixiApp = require("../../utils/PixiApp");
var NetPokerClientView = require("../view/NetPokerClientView");
var NetPokerClientController = require("../controller/NetPokerClientController");
var MessageWebSocketConnection = require("../../utils/MessageWebSocketConnection");
var ProtoConnection = require("../../proto/ProtoConnection");
var LoadingScreen = require("../view/LoadingScreen");
var StateCompleteMessage = require("../../proto/messages/StateCompleteMessage");
var InitMessage = require("../../proto/messages/InitMessage");

/**
 * Main entry point for client.
 * @class NetPokerClient
 */
function NetPokerClient() {
	PixiApp.call(this, 960, 720);

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
 * Run.
 * @method run
 */
NetPokerClient.prototype.run = function() {
	var assets = [
		"table.png",
		"components.png"
	];

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
},{"../../proto/ProtoConnection":21,"../../proto/messages/InitMessage":30,"../../proto/messages/StateCompleteMessage":35,"../../utils/FunctionUtil":41,"../../utils/MessageWebSocketConnection":43,"../../utils/PixiApp":45,"../controller/NetPokerClientController":7,"../view/LoadingScreen":18,"../view/NetPokerClientView":19,"pixi.js":1}],4:[function(require,module,exports){
var ShowDialogMessage = require("../../proto/messages/ShowDialogMessage");
var ButtonsMessage = require("../../proto/messages/ButtonsMessage");

/**
 * Control user interface.
 * @class InterfaceController
 */
function InterfaceController(messageSequencer, view) {
	this.messageSequencer = messageSequencer;
	this.view = view;

	this.messageSequencer.addMessageHandler(ButtonsMessage.TYPE, this.onButtonsMessage, this);
	this.messageSequencer.addMessageHandler(ShowDialogMessage.TYPE, this.onShowDialogMessage, this);
}

/**
 * Buttons message.
 * @method onButtonsMessage
 */
InterfaceController.prototype.onButtonsMessage = function(m) {
	var buttonsView = this.view.getButtonsView();

	buttonsView.setButtons(m.getButtons());
}

/**
 * Show dialog.
 * @method onShowDialogMessage
 */
InterfaceController.prototype.onShowDialogMessage = function(m) {
	var dialogView = this.view.getDialogView();

	dialogView.show(m.getText(), m.getButtons());
}

module.exports = InterfaceController;
},{"../../proto/messages/ButtonsMessage":25,"../../proto/messages/ShowDialogMessage":34}],5:[function(require,module,exports){
var EventDispatcher = require("../../utils/EventDispatcher");
var FunctionUtil = require("../../utils/FunctionUtil");
var Sequencer = require("../../utils/Sequencer");

/**
 * An item in a message sequence.
 * @class MessageSequenceItem
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
},{"../../utils/EventDispatcher":38,"../../utils/FunctionUtil":41,"../../utils/Sequencer":47}],6:[function(require,module,exports){
var Sequencer = require("../../utils/Sequencer");
var EventDispatcher = require("../../utils/Eventdispatcher");
var MessageSequenceItem = require("./MessageSequenceItem");

/**
 * Sequences messages.
 * @class MessageSequencer
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
},{"../../utils/Eventdispatcher":39,"../../utils/Sequencer":47,"./MessageSequenceItem":5}],7:[function(require,module,exports){
var FunctionUtil = require("../../utils/FunctionUtil");
var MessageSequencer = require("./MessageSequencer");
var ProtoConnection = require("../../proto/ProtoConnection");
var ButtonsView = require("../view/ButtonsView");
var ButtonClickMessage = require("../../proto/messages/ButtonClickMessage");
var SeatClickMessage = require("../../proto/messages/SeatClickMessage");
var NetPokerClientView = require("../view/NetPokerClientView");
var TableController = require("./TableController");
var InterfaceController = require("./InterfaceController");

/**
 * Main controller
 * @class NetPokerClientController
 */
function NetPokerClientController(view) {
	this.netPokerClientView = view;
	this.protoConnection = null;
	this.messageSequencer = new MessageSequencer();

	this.tableController = new TableController(this.messageSequencer, this.netPokerClientView);
	this.interfaceController = new InterfaceController(this.messageSequencer, this.netPokerClientView);

	this.netPokerClientView.getButtonsView().on(ButtonsView.BUTTON_CLICK, this.onButtonClick, this);
	this.netPokerClientView.on(NetPokerClientView.SEAT_CLICK, this.onSeatClick, this);
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
 * @method onButtonClick
 * @private
 */
NetPokerClientController.prototype.onButtonClick = function(e) {
	if (!this.protoConnection)
		return;

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

module.exports = NetPokerClientController;
},{"../../proto/ProtoConnection":21,"../../proto/messages/ButtonClickMessage":24,"../../proto/messages/SeatClickMessage":32,"../../utils/FunctionUtil":41,"../view/ButtonsView":12,"../view/NetPokerClientView":19,"./InterfaceController":4,"./MessageSequencer":6,"./TableController":8}],8:[function(require,module,exports){
var SeatInfoMessage = require("../../proto/messages/SeatInfoMessage");
var CommunityCardsMessage = require("../../proto/messages/CommunityCardsMessage");
var PocketCardsMessage = require("../../proto/messages/PocketCardsMessage");
var DealerButtonMessage = require("../../proto/messages/DealerButtonMessage");

/**
 * Control the table
 * @class TableController
 */
function TableController(messageSequencer, view) {
	this.messageSequencer = messageSequencer;
	this.view = view;

	this.messageSequencer.addMessageHandler(SeatInfoMessage.TYPE, this.onSeatInfoMessage, this);
	this.messageSequencer.addMessageHandler(CommunityCardsMessage.TYPE, this.onCommunityCardsMessage, this);
	this.messageSequencer.addMessageHandler(PocketCardsMessage.TYPE, this.onPocketCardsMessage, this);
	this.messageSequencer.addMessageHandler(DealerButtonMessage.TYPE, this.onDealerButtonMessage, this);
}

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

	for (i = 0; i < m.getCards().length; i++) {
		var cardData = m.getCards()[i];
		var cardView = this.view.getCommunityCards()[m.getFirstIndex() + i];

		cardView.setCardData(cardData);
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

		cardView.setCardData(cardData);
		cardView.show();
	}
}

/**
 * Dealer button message.
 * @method onDealerButtonMessage
 */
TableController.prototype.onDealerButtonMessage = function(m) {
	var dealerButtonView = this.view.getDealerButtonView();
	this.messageSequencer.waitFor(dealerButtonView, "animationDone");
	dealerButtonView.show(m.getSeatIndex(), m.getAnimate());
};

module.exports = TableController;
},{"../../proto/messages/CommunityCardsMessage":27,"../../proto/messages/DealerButtonMessage":28,"../../proto/messages/PocketCardsMessage":31,"../../proto/messages/SeatInfoMessage":33}],9:[function(require,module,exports){
NetPokerClient = require("./app/NetPokerClient");
//var netPokerClient = new NetPokerClient();

},{"./app/NetPokerClient":3}],10:[function(require,module,exports){
"use strict";

var PIXI = require("pixi.js");
var Point = require("../../utils/Point");

/**
 * Client resources
 * @class Resources.
 */
function Resources() {
	var i;

	this.componentsTexture = new PIXI.Texture.fromImage("components.png");
	this.tableBackground = PIXI.Sprite.fromImage("table.png");

	this.seatPositions = [
		Point(287, 118), Point(483, 112), Point(676, 118),
		Point(844, 247), Point(817, 413), Point(676, 490),
		Point(483, 495), Point(287, 490), Point(140, 413),
		Point(123, 247)
	];

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
}

/**
 * Get part from components atlas.
 * @method getComponentsPart
 * @private
 */
Resources.prototype.getComponentsPart = function(x, y, w, h) {
	var frame = {
		x: x,
		y: y,
		width: w,
		height: h
	};

	return new PIXI.Texture(this.componentsTexture, frame);
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
},{"../../utils/Point":46,"pixi.js":1}],11:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var Resources = require("../resources/Resources");

/**
 * Big button.
 * @class BigButton
 */
function BigButton() {
	Button.call(this);

	this.bigButtonTexture = Resources.getInstance().bigButton;

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
	if (!value)
		this.valueField.visible=false;

	else
		this.valueField.visible=true;

	this.valueField.setText(value);
	this.valueField.updateTransform();
	this.valueField.x = this.bigButtonTexture.width / 2 - this.valueField.width / 2;
}

module.exports = BigButton;
},{"../../utils/Button":36,"../../utils/FunctionUtil":41,"../resources/Resources":10,"pixi.js":1}],12:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var EventDispatcher = require("../../utils/EventDispatcher");
var Button = require("../../utils/Button");
var BigButton = require("./BigButton");

/**
 * Buttons
 * @class ButtonsView
 */
function ButtonsView() {
	PIXI.DisplayObjectContainer.call(this);

	this.buttonHolder = new PIXI.DisplayObjectContainer();
	this.addChild(this.buttonHolder);

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

	this.setButtons([]);

	this.buttonsDatas = [];
}

FunctionUtil.extend(ButtonsView, PIXI.DisplayObjectContainer);
EventDispatcher.init(ButtonsView);

ButtonsView.BUTTON_CLICK = "buttonClick";

/**
 * Set button datas.
 * @method setButtons
 */
ButtonsView.prototype.setButtons = function(buttonDatas) {
	this.buttonDatas = buttonDatas;

	for (var i = 0; i < this.buttons.length; i++) {
		var button = this.buttons[i];
		if (i >= buttonDatas.length) {
			button.visible = false;
			continue;
		}

		var buttonData = buttonDatas[i];

		button.visible = true;
		button.setLabel(buttonData.getButton());
		button.setValue(buttonData.getValue());
	}

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

	//console.log("button click: " + buttonIndex);
	var buttonData = this.buttonDatas[buttonIndex];

	this.trigger({
		type: ButtonsView.BUTTON_CLICK,
		button: buttonData.getButton(),
		value: buttonData.getValue()
	});
}

module.exports = ButtonsView;
},{"../../utils/Button":36,"../../utils/EventDispatcher":38,"../../utils/FunctionUtil":41,"./BigButton":11,"pixi.js":1}],13:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");

/**
 * A card view.
 * @class CardView
 */
function CardView() {
	PIXI.DisplayObjectContainer.call(this);
	this.targetPosition = null;

	this.frame = new PIXI.Sprite(Resources.getInstance().cardFrame);
	this.addChild(this.frame);

	this.suit = new PIXI.Sprite(Resources.getInstance().suitSymbols[0]);
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

	this.back = new PIXI.Sprite(Resources.getInstance().cardBack);
	this.addChild(this.back);
}

FunctionUtil.extend(CardView, PIXI.DisplayObjectContainer);

/**
 * Set card data.
 * @method setCardData
 */
CardView.prototype.setCardData = function(cardData) {
	this.cardData = cardData;

	if (this.cardData.isShown()) {
		this.back.visible = false;
		this.frame.visible = true;

		this.valueField.style.fill = this.cardData.getColor();

		this.valueField.setText(this.cardData.getCardValueString());
		this.valueField.updateTransform();
		this.valueField.position.x = 17 - this.valueField.canvas.width / 2;

		this.suit.setTexture(Resources.getInstance().suitSymbols[this.cardData.getSuitIndex()]);
	} else {
		this.back.visible = true;
		this.frame.visible = false;
	}
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
CardView.prototype.show = function() {
	this.visible = true;
}

module.exports = CardView;
},{"../../utils/FunctionUtil":41,"../resources/Resources":10,"pixi.js":1}],14:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");

/**
 * Chat view.
 * @class ChatView
 */
function ChatView() {
	PIXI.DisplayObjectContainer.call(this);

	var s;

	s = new NineSlice(Resources.getInstance().framePlate, 10);
	s.position.x = 10;
	s.position.y = 540;
	s.setLocalSize(330, 130);
	this.addChild(s);

	s = new NineSlice(Resources.getInstance().framePlate, 10);
	s.position.x = 10;
	s.position.y = 675;
	s.setLocalSize(330, 35);
	this.addChild(s);
}

FunctionUtil.extend(ChatView, PIXI.DisplayObjectContainer);

module.exports = ChatView;
},{"../../utils/FunctionUtil":41,"../../utils/NineSlice":44,"../resources/Resources":10,"pixi.js":1}],15:[function(require,module,exports){
var PIXI = require("pixi.js");
var TWEEN = require("tween.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var EventDispatcher = require("../../utils/EventDispatcher");

/**
 * Dialog view.
 * @class DealerButtonView
 */
function DealerButtonView() {
	PIXI.DisplayObjectContainer.call(this);


	var dealerButtonTexture = Resources.getInstance().dealerButton;
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
	this.position.x = Resources.getInstance().dealerButtonPositions[seatIndex].x;
	this.position.y = Resources.getInstance().dealerButtonPositions[seatIndex].y;
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

	var thisPtr = this;
	var tween = new TWEEN.Tween( this.position )
            .to( { 
				x: Resources.getInstance().dealerButtonPositions[seatIndex].x, 
				y: Resources.getInstance().dealerButtonPositions[seatIndex].y
             }, 500 )/*
            .easing( TWEEN.Easing.Elastic.InOut )*/
            .onComplete(function()
			{
				thisPtr.dispatchEvent("animationDone", thisPtr);
			})
            .start();
};

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
	this.visible = true;
	if(animate) {
		this.animateToSeatIndex(seatIndex);
	}
	else {
		this.setSeatIndex(seatIndex);
	}
}

module.exports = DealerButtonView;
},{"../../utils/EventDispatcher":38,"../../utils/FunctionUtil":41,"../resources/Resources":10,"pixi.js":1,"tween.js":2}],16:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Button = require("../../utils/Button");
var Resources = require("../resources/Resources");

/**
 * Dialog button.
 * @class DialogButton
 */
function DialogButton() {
	Button.call(this);

	this.buttonTexture = Resources.getInstance().dialogButton;
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
},{"../../utils/Button":36,"../../utils/FunctionUtil":41,"../resources/Resources":10,"pixi.js":1}],17:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var NineSlice = require("../../utils/NineSlice");
var Resources = require("../resources/Resources");
var DialogButton = require("./DialogButton");
var ButtonData = require("../../proto/data/ButtonData");

/**
 * Dialog view.
 * @class DialogView
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

	var b = new NineSlice(Resources.getInstance().framePlate, 10);
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
		this.buttonsHolder.addChild(b);
		this.buttons.push(b);
	}

	this.hide();

	var input=document.createElement("input");
	input.type="text";
	input.style.position="absolute";
	input.style.zIndex=1;
	document.body.appendChild(input);
}

FunctionUtil.extend(DialogView, PIXI.DisplayObjectContainer);

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
}

module.exports = DialogView;
},{"../../proto/data/ButtonData":22,"../../utils/FunctionUtil":41,"../../utils/NineSlice":44,"../resources/Resources":10,"./DialogButton":16,"pixi.js":1}],18:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Gradient = require("../../utils/Gradient");

/**
 * Loading screen.
 * @class LoadingScreen
 */
function LoadingScreen() {
	PIXI.DisplayObjectContainer.call(this);

	var gradient = new Gradient();
	gradient.setSize(100, 100);
	gradient.addColorStop(0, "#ffffff");
	gradient.addColorStop(1, "#c0c0c0");

	var s = gradient.createSprite();
	s.width = 960;
	s.height = 720;
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
},{"../../utils/FunctionUtil":41,"../../utils/Gradient":42,"pixi.js":1}],19:[function(require,module,exports){
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

/**
 * Net poker client view.
 * @class NetPokerClientView
 */
function NetPokerClientView() {
	PIXI.DisplayObjectContainer.call(this);

	this.setupBackground();

	this.tableContainer = new PIXI.DisplayObjectContainer();
	this.addChild(this.tableContainer);

	this.tableContainer.addChild(Resources.getInstance().tableBackground);

	this.setupSeats();
	this.setupCommunityCards();

	this.chatView = new ChatView();
	this.addChild(this.chatView);

	this.buttonsView = new ButtonsView();
	this.addChild(this.buttonsView);

	this.dialogView = new DialogView();
	this.addChild(this.dialogView);

	this.dealerButtonView = new DealerButtonView();
	this.addChild(this.dealerButtonView);
}

FunctionUtil.extend(NetPokerClientView, PIXI.DisplayObjectContainer);
EventDispatcher.init(NetPokerClientView);

NetPokerClientView.SEAT_CLICK = "seatClick";

/**
 * Setup background.
 * @method setupBackground
 */
NetPokerClientView.prototype.setupBackground = function() {
	var gradient = new Gradient();
	gradient.setSize(100, 100);
	gradient.addColorStop(0, "#606060");
	gradient.addColorStop(.5, "#a0a0a0");
	gradient.addColorStop(1, "#909090");

	var s = gradient.createSprite();
	s.width = 960;
	s.height = 720;
	this.addChild(s);

	var s = new PIXI.Sprite(Resources.getInstance().dividerLine);
	s.x = 345;
	s.y = 540;
	this.addChild(s);

	var s = new PIXI.Sprite(Resources.getInstance().dividerLine);
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

	for (i = 0; i < Resources.getInstance().seatPositions.length; i++) {
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

	var p = Resources.getInstance().communityCardsPosition;

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
 * @method getDialogView
 */
NetPokerClientView.prototype.getDealerButtonView = function() {
	return this.dealerButtonView;
}

module.exports = NetPokerClientView;
},{"../../utils/EventDispatcher":38,"../../utils/FunctionUtil":41,"../../utils/Gradient":42,"../../utils/Point":46,"../resources/Resources":10,"./ButtonsView":12,"./CardView":13,"./ChatView":14,"./DealerButtonView":15,"./DialogView":17,"./SeatView":20,"pixi.js":1}],20:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("../../utils/FunctionUtil");
var Resources = require("../resources/Resources");
var Button=require("../../utils/Button");

/**
 * A seat view.
 * @class SeatView
 */
function SeatView(seatIndex) {
	Button.call(this);

	this.pocketCards = [];
	this.seatIndex = seatIndex;

	var seatTexture = Resources.getInstance().seatPlate;
	var seatSprite = new PIXI.Sprite(seatTexture);

	seatSprite.position.x = -seatTexture.width / 2;
	seatSprite.position.y = -seatTexture.height / 2;

	this.addChild(seatSprite);

	var pos = Resources.getInstance().seatPositions[this.seatIndex];

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

	this.setName("");
	this.setChips("");
}

FunctionUtil.extend(SeatView, Button);

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

module.exports = SeatView;
},{"../../utils/Button":36,"../../utils/FunctionUtil":41,"../resources/Resources":10,"pixi.js":1}],21:[function(require,module,exports){
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

/**
 * @class ProtoConnection
 * A protocol connection with an underlying connection.
 */
function ProtoConnection(connection) {
	EventDispatcher.call(this);

	this.messageDispatcher = new EventDispatcher();
	this.connection = connection;
	this.connection.addEventListener("message", this.onConnectionMessage, this);
	this.connection.addEventListener("close", this.onConnectionClose, this);
}

FunctionUtil.extend(ProtoConnection, EventDispatcher);

ProtoConnection.CLOSE = "close";
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

/**
 * Add message handler.
 */
ProtoConnection.prototype.addMessageHandler = function(messageType, handler, scope) {
	if (messageType.hasOwnProperty("TYPE"))
		messageType = messageType.TYPE;

	this.messageDispatcher.on(messageType, handler, scope);
}

/**
 * Remove message handler.
 */
ProtoConnection.prototype.removeMessageHandler = function(messageType, handler, scope) {
	if (messageType.hasOwnProperty("TYPE"))
		messageType = messageType.TYPE;

	this.messageDispatcher.off(messageType, handler, scope);
}

/**
 * Connection message.
 * @method onConnectionMessage
 */
ProtoConnection.prototype.onConnectionMessage = function(ev) {
	var message = ev.message;
	var constructor;

	console.log("incoming connection message: " + message.type);

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
 */
ProtoConnection.prototype.onConnectionClose = function(ev) {
	this.connection.off("message", this.onConnectionMessage, this);
	this.connection.off("close", this.onConnectionClose, this);
	this.connection = null;

	this.trigger(ProtoConnection.CLOSE);
}

/**
 * Send a message.
 */
ProtoConnection.prototype.send = function(message) {
	var serialized = message.serialize();

	for (type in ProtoConnection.MESSAGE_TYPES) {
		if (message instanceof ProtoConnection.MESSAGE_TYPES[type])
			serialized.type = type;
	}

	if (!serialized.type)
		throw new Error("Unknown message type for send, message="+message.constructor.name);

//	console.log("sending: "+serialized);

	this.connection.send(serialized);
}

/**
 * Close the connection.
 * @method close
 */
ProtoConnection.prototype.close = function() {
	this.connection.close();
}

module.exports = ProtoConnection;
},{"../utils/EventDispatcher":38,"../utils/FunctionUtil":41,"./messages/ButtonClickMessage":24,"./messages/ButtonsMessage":25,"./messages/ClearMessage":26,"./messages/CommunityCardsMessage":27,"./messages/DealerButtonMessage":28,"./messages/DelayMessage":29,"./messages/InitMessage":30,"./messages/PocketCardsMessage":31,"./messages/SeatClickMessage":32,"./messages/SeatInfoMessage":33,"./messages/ShowDialogMessage":34,"./messages/StateCompleteMessage":35}],22:[function(require,module,exports){
/**
 * Button data.
 * @class ButtonData
 */
function ButtonData(button, value) {
	this.button = button;
	this.value = value;
	/*	this.min = -1;
	this.max = -1;*/
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

/*ButtonData.prototype.getMin = function() {
	return this.min;
}*/

/*ButtonData.prototype.getMax = function() {
	return this.max;
}*/

module.exports = ButtonData;
},{}],23:[function(require,module,exports){
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

/**
 * Shown?
 */
CardData.prototype.isShown = function() {
	return this.value >= 0;
}

/**
 * Get card value string.
 */
CardData.prototype.getCardValueString = function() {
	return CardData.CARD_VALUE_STRINGS[this.value % 13];
}

/**
 * Get suit index.
 */
CardData.prototype.getSuitIndex = function() {
	return Math.floor(this.value / 13);
}

/**
 * Get suit string.
 */
CardData.prototype.getSuitString = function() {
	return CardData.SUIT_STRINGS[this.getSuitIndex()];
}

/**
 * Get color.
 */
CardData.prototype.getColor = function() {
	if (this.getSuitIndex() % 2 != 0)
		return "#000000";

	else
		return "#ff0000";
}

/**
 * To string.
 */
CardData.prototype.toString = function() {
	return this.getCardValueString() + this.getSuitString();
}

module.exports = CardData;
},{}],24:[function(require,module,exports){
/**
 * @class ShowDialogMessage
 */
function ButtonClickMessage(button, value) {
	this.button=button;
	this.value=value;
}

ButtonClickMessage.TYPE = "buttonClick";

/**
 * Getter.
 */
ButtonClickMessage.prototype.getButton = function() {
	return this.button;
}

/**
 * Setter.
 */
ButtonClickMessage.prototype.getValue = function() {
	return this.value;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
ButtonClickMessage.prototype.unserialize = function(data) {
	this.button=data.button;
	this.value=data.value;
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
},{}],25:[function(require,module,exports){
var ButtonData = require("../data/ButtonData");

/**
 * @class ButtonsMessage
 */
function ButtonsMessage() {
	this.buttons = [];
}

ButtonsMessage.TYPE = "buttons";

/**
 * Getter.
 */
ButtonsMessage.prototype.getButtons = function() {
	return this.buttons;
}

/**
 * Add button.
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
		buttons: buttons
	};
}

module.exports = ButtonsMessage;
},{"../data/ButtonData":22}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
var CardData=require("../data/CardData");

/**
 * @class SeatInfoMessage
 */
function CommunityCardsMessage() {
	this.animate = false;
	this.cards = [];
	this.firstIndex = 0;
}

CommunityCardsMessage.TYPE = "communityCards";

/**
 * Get card data.
 */
CommunityCardsMessage.prototype.getCards = function() {
	return this.cards;
}

/**
 * Get first index.
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
	this.cards=[];

	for (i=0; i<data.cards.length; i++)
		this.cards.push(new CardData(data.cards[i]));
}

/**
 * Serialize message.
 * @method serialize
 */
CommunityCardsMessage.prototype.serialize = function() {
	var cards=[];

	for (i=0; i<this.cards.length; i++)
		cards.push(this.cards[i].getValue());

	return {
		animate: this.seatIndex,
		firstIndex: this.firstIndex,
		cards: cards
	};
}

module.exports = CommunityCardsMessage;
},{"../data/CardData":23}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
/**
 * @class DelayMessage
 */
function DelayMessage(delay) {
	this.delay=delay;
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
	this.delay=data.delay;
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
var CardData = require("../data/CardData");

/**
 * @class SeatInfoMessage
 */
function PocketCardsMessage() {
	this.animate = false;
	this.cards = [];
	this.firstIndex = 0;
	this.seatIndex = 0;
}

PocketCardsMessage.TYPE = "pocketCards";

/**
 * Get card data.
 */
PocketCardsMessage.prototype.getCards = function() {
	return this.cards;
}

/**
 * Get first index.
 */
PocketCardsMessage.prototype.getFirstIndex = function() {
	return this.firstIndex;
}

/**
 * Get seat index.
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
		animate: this.seatIndex,
		firstIndex: this.firstIndex,
		cards: cards,
		seatIndex: this.seatIndex
	};
}

module.exports = PocketCardsMessage;
},{"../data/CardData":23}],32:[function(require,module,exports){
/**
 * @class SeatClickMessage
 */
function SeatClickMessage(seatIndex) {
	this.seatIndex=seatIndex;
}

SeatClickMessage.TYPE = "seatClick";

/**
 * Getter.
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
},{}],33:[function(require,module,exports){
/**
 * @class SeatInfoMessage
 */
function SeatInfoMessage() {
	this.active = true;
}

SeatInfoMessage.TYPE = "seatInfo";

/**
 * Getter.
 */
SeatInfoMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Getter.
 */
SeatInfoMessage.prototype.getName = function() {
	return this.name;
}

/**
 * Getter.
 */
SeatInfoMessage.prototype.getChips = function() {
	return this.chips;
}

/**
 * Getter.
 */
SeatInfoMessage.prototype.isSitout = function() {
	return this.sitout;
}

/**
 * Getter.
 */
SeatInfoMessage.prototype.isActive = function() {
	return this.active;
}

/**
 * Un-serialize.
 * @method unserialize.
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
},{}],34:[function(require,module,exports){
/**
 * @class ShowDialogMessage
 */
function ShowDialogMessage() {
	this.text = "";
	this.buttons = [];
}

ShowDialogMessage.TYPE = "showDialog";

/**
 * Getter.
 */
ShowDialogMessage.prototype.addButton = function(button) {
	this.buttons.push(button);
}

/**
 * Getter.
 */
ShowDialogMessage.prototype.getText = function() {
	return this.text;
}

/**
 * Getter.
 */
ShowDialogMessage.prototype.getButtons = function() {
	return this.buttons;
}

/**
 * Setter.
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
}

/**
 * Serialize message.
 * @method serialize
 */
ShowDialogMessage.prototype.serialize = function() {
	return {
		text: this.text,
		buttons: this.buttons
	};
}

module.exports = ShowDialogMessage;
},{}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");
var EventDispatcher = require("./EventDispatcher");

/**
 * Button.
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
 */
Button.prototype.onMouseover = function() {
	this.colorMatrixFilter.matrix = Button.LIGHT_MATRIX;
}

/**
 * Mouse out.
 */
Button.prototype.onMouseout = function() {
	this.colorMatrixFilter.matrix = Button.DEFAULT_MATRIX;
}

/**
 * Mouse down.
 */
Button.prototype.onMousedown = function() {
	this.colorMatrixFilter.matrix = Button.DARK_MATRIX;
}

/**
 * Mouse up.
 */
Button.prototype.onMouseup = function() {
	this.colorMatrixFilter.matrix = Button.LIGHT_MATRIX;
}

/**
 * Click.
 */
Button.prototype.onClick = function() {
	this.trigger(Button.CLICK);
}

module.exports = Button;
},{"./EventDispatcher":38,"./FunctionUtil":41,"pixi.js":1}],37:[function(require,module,exports){
var PIXI=require("pixi.js");
var FunctionUtil=require("../utils/FunctionUtil");

function ContentScaler(content) {
	PIXI.DisplayObjectContainer.call(this);

	this.contentWidth=100;
	this.contentHeight=100;

	this.screenWidth=100;
	this.screenHeight=100;

	this.theMask=null;

	if (content)
		this.setContent(content);
}

FunctionUtil.extend(ContentScaler,PIXI.DisplayObjectContainer);

ContentScaler.prototype.setContent=function(content) {
	this.content=content;

	this.addChild(this.content);

	if (this.theMask) {
		this.removeChild(this.theMask);
		this.theMask=null;
	}

	this.theMask=new PIXI.Graphics();
	//this.addChild(this.theMask);

	this.updateScale();
}

ContentScaler.prototype.setContentSize=function(contentWidth, contentHeight) {
	this.contentWidth=contentWidth;
	this.contentHeight=contentHeight;

	this.updateScale();
}

ContentScaler.prototype.setScreenSize=function(screenWidth, screenHeight) {
	this.screenWidth=screenWidth;
	this.screenHeight=screenHeight;

	this.updateScale();
}

ContentScaler.prototype.updateScale=function() {
	var scale;

	if (this.screenWidth/this.contentWidth<this.screenHeight/this.contentHeight)
		scale=this.screenWidth/this.contentWidth;

	else
		scale=this.screenHeight/this.contentHeight;

	this.content.scale.x=scale;
	this.content.scale.y=scale;

	var scaledWidth=this.contentWidth*scale;
	var scaledHeight=this.contentHeight*scale;

	this.content.position.x=(this.screenWidth-scaledWidth)/2;
	this.content.position.y=(this.screenHeight-scaledHeight)/2;

	var r=new PIXI.Rectangle(this.content.position.x,this.content.position.y,scaledWidth,scaledHeight);
	var right=r.x+r.width;
	var bottom=r.y+r.height;

	this.theMask.clear();
	this.theMask.beginFill();
	this.theMask.drawRect(0,0,this.screenWidth,r.y);
	this.theMask.drawRect(0,0,r.x,this.screenHeight);
	this.theMask.drawRect(right,0,this.screenWidth-right,this.screenHeight);
	this.theMask.drawRect(0,bottom,this.screenWidth,this.screenHeight-bottom);
	this.theMask.endFill();
}

module.exports=ContentScaler;
},{"../utils/FunctionUtil":41,"pixi.js":1}],38:[function(require,module,exports){
"use strict";

/**
 * AS3 style event dispatcher.
 */
function EventDispatcher() {
	this.listenerMap = {};
}

/**
 * Add event listener.
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
 * Jquery style alias.
 */
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;
EventDispatcher.prototype.trigger = EventDispatcher.prototype.dispatchEvent;

/**
 * Make something an event dispatcher.
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
},{}],39:[function(require,module,exports){
module.exports=require(38)
},{"/Users/mikael/Documents/repo/netpoker/src/js/utils/EventDispatcher.js":38}],40:[function(require,module,exports){
"use strict";

var EventDispatcher=require("./EventDispatcher");
var FunctionUtil=require("./FunctionUtil");

/**
 * Frame timer.
 */
function FrameTimer() {
	EventDispatcher.call(this);

	this.intervalId=setInterval(FunctionUtil.createDelegate(this.onInterval,this),1000/60);
}

FunctionUtil.extend(FrameTimer,EventDispatcher);

FrameTimer.TIMER="timer";
FrameTimer.RENDER="render";

/**
 * On interval.
 */
FrameTimer.prototype.onInterval=function() {
	this.dispatchEvent(FrameTimer.TIMER);
	this.dispatchEvent(FrameTimer.RENDER);
}

/**
 * Get singleton instance.
 */
FrameTimer.getInstance=function() {
	if (!FrameTimer.instance)
		FrameTimer.instance=new FrameTimer();

	return FrameTimer.instance;
}

module.exports=FrameTimer;
},{"./EventDispatcher":38,"./FunctionUtil":41}],41:[function(require,module,exports){
/**
 * Function utils.
 */
function FunctionUtil() {
}

/**
 * Extend a class.
 * Don't forget to call super.
 */
FunctionUtil.extend=function(target, base) {
	target.prototype=Object.create(base.prototype);
	target.prototype.constructor=target;
}

/**
 * Create delegate function.
 */
FunctionUtil.createDelegate=function(func, scope) {
	return function() {
		func.apply(scope,arguments);
	};
}

module.exports=FunctionUtil;

},{}],42:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");

/**
 * A sprite with a gradient.
 */
function Gradient() {
	this.width = 100;
	this.height = 100;
	this.stops = [];
}

/**
 * Set size of the gradient.
 */
Gradient.prototype.setSize = function(w, h) {
	this.width = w;
	this.height = h;
}

/**
 * Add color stop.
 */
Gradient.prototype.addColorStop = function(weight, color) {
	this.stops.push({
		weight: weight,
		color: color
	});
}

/**
 * Render the sprite.
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
},{"./FunctionUtil":41,"pixi.js":1}],43:[function(require,module,exports){
var EventDispatcher = require("./EventDispatcher");
var FunctionUtil = require("./FunctionUtil");
var Thenable = require("./Thenable");

/**
 * Message connection in a browser.
 * @class MessageWebSocketConnection
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
 * @private
 */
MessageWebSocketConnection.prototype.onWebSocketOpen = function() {
	this.trigger(MessageWebSocketConnection.CONNECT);
}

/**
 * Web socket message.
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
 */
MessageWebSocketConnection.prototype.clearWebSocket = function() {
	this.webSocket.onopen = null;
	this.webSocket.onmessage = null;
	this.webSocket.onclose = null;
	this.webSocket.onerror = null;

	this.webSocket = null;
}

module.exports = MessageWebSocketConnection;
},{"./EventDispatcher":38,"./FunctionUtil":41,"./Thenable":48}],44:[function(require,module,exports){
var PIXI = require("pixi.js");
var FunctionUtil = require("./FunctionUtil");

/**
 * Nine slice.
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
 * Build parts.
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
 */
NineSlice.prototype.setLocalSize = function(w, h) {
	this.localWidth = w;
	this.localHeight = h;
	this.updateSizes();
}

/**
 * Create texture part.
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
},{"./FunctionUtil":41,"pixi.js":1}],45:[function(require,module,exports){
"use strict";

var PIXI=require("pixi.js");
var TWEEN=require("tween.js");
var FunctionUtil=require("./FunctionUtil");
var ContentScaler=require("./ContentScaler");
var FrameTimer=require("./FrameTimer");

/**
 * Pixi full window app.
 * Can operate using window coordinates or scaled to specific area.
 */
function PixiApp(width, height) {
	if (PixiApp.instance)
		throw new Error("Only one PixiApp per app");

	PixiApp.instance=this;

	PIXI.DisplayObjectContainer.call(this);

	var view;

	if (navigator.isCocoonJS)
		view=document.createElement('screencanvas');

	else
		view=document.createElement('canvas');

//	this.renderer=new PIXI.WebGLRenderer(window.innerWidth,window.innerHeight,view);
	this.renderer=new PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight,view);

	console.log("appending child, document: "+document);
	console.log("appending child, document.body: "+document.body);

	document.body.appendChild(this.renderer.view);

	document.body.style.margin=0;
	document.body.style.padding=0;

	document.body.onresize=FunctionUtil.createDelegate(this.onWindowResize,this);
	window.onresize=FunctionUtil.createDelegate(this.onWindowResize,this);

/*	var s=document.createElement("div");
	s.innerHTML="hello";
	s.style.background="#ffffff";
	s.style.position="absolute";
	s.style.left="0";
	s.style.top="30px";

	document.body.appendChild(s);*/

	this.contentScaler=null;

	this.appStage=new PIXI.Stage(0,true);

	//console.log("im: "+this.appStage.interactionManager);

	if (!width || !height)
		this.useNoScaling();

	else
		this.useScaling(width,height);

	FrameTimer.getInstance().addEventListener(FrameTimer.RENDER,this.onAnimationFrame,this);
}

FunctionUtil.extend(PixiApp,PIXI.DisplayObjectContainer);

/**
 * Use scaling mode.
 */
PixiApp.prototype.useScaling=function(w, h) {
	this.removeContent();

	this.contentScaler=new ContentScaler(this);
	this.contentScaler.setContentSize(w,h);
	this.contentScaler.setScreenSize(window.innerWidth,window.innerHeight);
	this.appStage.addChild(this.contentScaler);
}

/**
 * Use no scaling mode.
 */
PixiApp.prototype.useNoScaling=function() {
	this.removeContent();

	this.appStage.addChild(this);
}

/**
 * Remove any content.
 * Internal.
 */
PixiApp.prototype.removeContent=function() {
	if (this.appStage.children.indexOf(this)>=0)
		this.appStage.removeChild(this);

	if (this.contentScaler) {
		this.appStage.removeChild(this.contentScaler)
		this.contentScaler=null;
	}
}

/**
 * Window resize.
 */
PixiApp.prototype.onWindowResize=function() {
	if (this.contentScaler)
		this.contentScaler.setScreenSize(window.innerWidth,window.innerHeight);

	this.renderer.resize(window.innerWidth,window.innerHeight);

	this.renderer.render(this.appStage);
}

/**
 * Animation frame.
 */
PixiApp.prototype.onAnimationFrame=function() {
	this.renderer.render(this.appStage);
	TWEEN.update();
}

/**
 * Get canvas.
 */
PixiApp.prototype.getCanvas=function() {
	return this.renderer.view;
}

/**
 * Get stage.
 */
PixiApp.prototype.getStage=function() {
	return this.appStage;
}

module.exports=PixiApp;
},{"./ContentScaler":37,"./FrameTimer":40,"./FunctionUtil":41,"pixi.js":1,"tween.js":2}],46:[function(require,module,exports){
/**
 * Represents a point.
 * @class Point
 */
function Point(x, y) {
	if (!(this instanceof Point))
		return new Point(x, y);

	this.x = x;
	this.y = y;
}

module.exports = Point;
},{}],47:[function(require,module,exports){
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
},{"./EventDispatcher":38,"./FunctionUtil":41}],48:[function(require,module,exports){
var EventDispatcher = require("./EventDispatcher");
var FunctionUtil = require("./FunctionUtil");

/**
 * An implementation of promises as defined here:
 * http://promises-aplus.github.io/promises-spec/
 * @class Thenable
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
},{"./EventDispatcher":38,"./FunctionUtil":41}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvbm9kZV9tb2R1bGVzL3BpeGkuanMvYmluL3BpeGkuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL25vZGVfbW9kdWxlcy90d2Vlbi5qcy9pbmRleC5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC9hcHAvTmV0UG9rZXJDbGllbnQuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvY29udHJvbGxlci9JbnRlcmZhY2VDb250cm9sbGVyLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L2NvbnRyb2xsZXIvTWVzc2FnZVNlcXVlbmNlSXRlbS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC9jb250cm9sbGVyL01lc3NhZ2VTZXF1ZW5jZXIuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvY29udHJvbGxlci9OZXRQb2tlckNsaWVudENvbnRyb2xsZXIuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvY29udHJvbGxlci9UYWJsZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvbmV0cG9rZXJjbGllbnQuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvcmVzb3VyY2VzL1Jlc291cmNlcy5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0JpZ0J1dHRvbi5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0J1dHRvbnNWaWV3LmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3ZpZXcvQ2FyZFZpZXcuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9DaGF0Vmlldy5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L0RlYWxlckJ1dHRvblZpZXcuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9EaWFsb2dCdXR0b24uanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy9jbGllbnQvdmlldy9EaWFsb2dWaWV3LmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvY2xpZW50L3ZpZXcvTG9hZGluZ1NjcmVlbi5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L05ldFBva2VyQ2xpZW50Vmlldy5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL2NsaWVudC92aWV3L1NlYXRWaWV3LmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vUHJvdG9Db25uZWN0aW9uLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vZGF0YS9CdXR0b25EYXRhLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vZGF0YS9DYXJkRGF0YS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0J1dHRvbkNsaWNrTWVzc2FnZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0J1dHRvbnNNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvQ2xlYXJNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvRGVhbGVyQnV0dG9uTWVzc2FnZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0RlbGF5TWVzc2FnZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL0luaXRNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvUG9ja2V0Q2FyZHNNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvU2VhdENsaWNrTWVzc2FnZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1NlYXRJbmZvTWVzc2FnZS5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3Byb3RvL21lc3NhZ2VzL1Nob3dEaWFsb2dNZXNzYWdlLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvcHJvdG8vbWVzc2FnZXMvU3RhdGVDb21wbGV0ZU1lc3NhZ2UuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9CdXR0b24uanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9Db250ZW50U2NhbGVyLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvRXZlbnREaXNwYXRjaGVyLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvRnJhbWVUaW1lci5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL0Z1bmN0aW9uVXRpbC5qcyIsIi9Vc2Vycy9taWthZWwvRG9jdW1lbnRzL3JlcG8vbmV0cG9rZXIvc3JjL2pzL3V0aWxzL0dyYWRpZW50LmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9OaW5lU2xpY2UuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9QaXhpQXBwLmpzIiwiL1VzZXJzL21pa2FlbC9Eb2N1bWVudHMvcmVwby9uZXRwb2tlci9zcmMvanMvdXRpbHMvUG9pbnQuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9TZXF1ZW5jZXIuanMiLCIvVXNlcnMvbWlrYWVsL0RvY3VtZW50cy9yZXBvL25ldHBva2VyL3NyYy9qcy91dGlscy9UaGVuYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBAbGljZW5zZVxuICogcGl4aS5qcyAtIHYxLjYuMFxuICogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQsIE1hdCBHcm92ZXNcbiAqIGh0dHA6Ly9nb29kYm95ZGlnaXRhbC5jb20vXG4gKlxuICogQ29tcGlsZWQ6IDIwMTQtMDctMThcbiAqXG4gKiBwaXhpLmpzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbihmdW5jdGlvbigpe3ZhciBhPXRoaXMsYj1ifHx7fTtiLldFQkdMX1JFTkRFUkVSPTAsYi5DQU5WQVNfUkVOREVSRVI9MSxiLlZFUlNJT049XCJ2MS42LjFcIixiLmJsZW5kTW9kZXM9e05PUk1BTDowLEFERDoxLE1VTFRJUExZOjIsU0NSRUVOOjMsT1ZFUkxBWTo0LERBUktFTjo1LExJR0hURU46NixDT0xPUl9ET0RHRTo3LENPTE9SX0JVUk46OCxIQVJEX0xJR0hUOjksU09GVF9MSUdIVDoxMCxESUZGRVJFTkNFOjExLEVYQ0xVU0lPTjoxMixIVUU6MTMsU0FUVVJBVElPTjoxNCxDT0xPUjoxNSxMVU1JTk9TSVRZOjE2fSxiLnNjYWxlTW9kZXM9e0RFRkFVTFQ6MCxMSU5FQVI6MCxORUFSRVNUOjF9LGIuX1VJRD0wLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBGbG9hdDMyQXJyYXk/KGIuRmxvYXQzMkFycmF5PUZsb2F0MzJBcnJheSxiLlVpbnQxNkFycmF5PVVpbnQxNkFycmF5KTooYi5GbG9hdDMyQXJyYXk9QXJyYXksYi5VaW50MTZBcnJheT1BcnJheSksYi5JTlRFUkFDVElPTl9GUkVRVUVOQ1k9MzAsYi5BVVRPX1BSRVZFTlRfREVGQVVMVD0hMCxiLlJBRF9UT19ERUc9MTgwL01hdGguUEksYi5ERUdfVE9fUkFEPU1hdGguUEkvMTgwLGIuZG9udFNheUhlbGxvPSExLGIuc2F5SGVsbG89ZnVuY3Rpb24oYSl7aWYoIWIuZG9udFNheUhlbGxvKXtpZihuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImNocm9tZVwiKT4tMSl7dmFyIGM9W1wiJWMgJWMgJWMgUGl4aS5qcyBcIitiLlZFUlNJT04rXCIgLSBcIithK1wiICAlYyAgJWMgIGh0dHA6Ly93d3cucGl4aWpzLmNvbS8gICVjICVjIOKZpSVj4pmlJWPimaUgXCIsXCJiYWNrZ3JvdW5kOiAjZmY2NmE1XCIsXCJiYWNrZ3JvdW5kOiAjZmY2NmE1XCIsXCJjb2xvcjogI2ZmNjZhNTsgYmFja2dyb3VuZDogIzAzMDMwNztcIixcImJhY2tncm91bmQ6ICNmZjY2YTVcIixcImJhY2tncm91bmQ6ICNmZmMzZGNcIixcImJhY2tncm91bmQ6ICNmZjY2YTVcIixcImNvbG9yOiAjZmYyNDI0OyBiYWNrZ3JvdW5kOiAjZmZmXCIsXCJjb2xvcjogI2ZmMjQyNDsgYmFja2dyb3VuZDogI2ZmZlwiLFwiY29sb3I6ICNmZjI0MjQ7IGJhY2tncm91bmQ6ICNmZmZcIl07Y29uc29sZS5sb2cuYXBwbHkoY29uc29sZSxjKX1lbHNlIHdpbmRvdy5jb25zb2xlJiZjb25zb2xlLmxvZyhcIlBpeGkuanMgXCIrYi5WRVJTSU9OK1wiIC0gaHR0cDovL3d3dy5waXhpanMuY29tL1wiKTtiLmRvbnRTYXlIZWxsbz0hMH19LGIuUG9pbnQ9ZnVuY3Rpb24oYSxiKXt0aGlzLng9YXx8MCx0aGlzLnk9Ynx8MH0sYi5Qb2ludC5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGIuUG9pbnQodGhpcy54LHRoaXMueSl9LGIuUG9pbnQucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3RoaXMueD1hfHwwLHRoaXMueT1ifHwoMCE9PWI/dGhpcy54OjApfSxiLlBvaW50LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlBvaW50LGIuUmVjdGFuZ2xlPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMueD1hfHwwLHRoaXMueT1ifHwwLHRoaXMud2lkdGg9Y3x8MCx0aGlzLmhlaWdodD1kfHwwfSxiLlJlY3RhbmdsZS5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGIuUmVjdGFuZ2xlKHRoaXMueCx0aGlzLnksdGhpcy53aWR0aCx0aGlzLmhlaWdodCl9LGIuUmVjdGFuZ2xlLnByb3RvdHlwZS5jb250YWlucz1mdW5jdGlvbihhLGIpe2lmKHRoaXMud2lkdGg8PTB8fHRoaXMuaGVpZ2h0PD0wKXJldHVybiExO3ZhciBjPXRoaXMueDtpZihhPj1jJiZhPD1jK3RoaXMud2lkdGgpe3ZhciBkPXRoaXMueTtpZihiPj1kJiZiPD1kK3RoaXMuaGVpZ2h0KXJldHVybiEwfXJldHVybiExfSxiLlJlY3RhbmdsZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5SZWN0YW5nbGUsYi5FbXB0eVJlY3RhbmdsZT1uZXcgYi5SZWN0YW5nbGUoMCwwLDAsMCksYi5Qb2x5Z29uPWZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBBcnJheXx8KGE9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSksXCJudW1iZXJcIj09dHlwZW9mIGFbMF0pe2Zvcih2YXIgYz1bXSxkPTAsZT1hLmxlbmd0aDtlPmQ7ZCs9MiljLnB1c2gobmV3IGIuUG9pbnQoYVtkXSxhW2QrMV0pKTthPWN9dGhpcy5wb2ludHM9YX0sYi5Qb2x5Z29uLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxjPTA7Yzx0aGlzLnBvaW50cy5sZW5ndGg7YysrKWEucHVzaCh0aGlzLnBvaW50c1tjXS5jbG9uZSgpKTtyZXR1cm4gbmV3IGIuUG9seWdvbihhKX0sYi5Qb2x5Z29uLnByb3RvdHlwZS5jb250YWlucz1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0hMSxkPTAsZT10aGlzLnBvaW50cy5sZW5ndGgtMTtkPHRoaXMucG9pbnRzLmxlbmd0aDtlPWQrKyl7dmFyIGY9dGhpcy5wb2ludHNbZF0ueCxnPXRoaXMucG9pbnRzW2RdLnksaD10aGlzLnBvaW50c1tlXS54LGk9dGhpcy5wb2ludHNbZV0ueSxqPWc+YiE9aT5iJiYoaC1mKSooYi1nKS8oaS1nKStmPmE7aiYmKGM9IWMpfXJldHVybiBjfSxiLlBvbHlnb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuUG9seWdvbixiLkNpcmNsZT1mdW5jdGlvbihhLGIsYyl7dGhpcy54PWF8fDAsdGhpcy55PWJ8fDAsdGhpcy5yYWRpdXM9Y3x8MH0sYi5DaXJjbGUucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLkNpcmNsZSh0aGlzLngsdGhpcy55LHRoaXMucmFkaXVzKX0sYi5DaXJjbGUucHJvdG90eXBlLmNvbnRhaW5zPWZ1bmN0aW9uKGEsYil7aWYodGhpcy5yYWRpdXM8PTApcmV0dXJuITE7dmFyIGM9dGhpcy54LWEsZD10aGlzLnktYixlPXRoaXMucmFkaXVzKnRoaXMucmFkaXVzO3JldHVybiBjKj1jLGQqPWQsZT49YytkfSxiLkNpcmNsZS5wcm90b3R5cGUuZ2V0Qm91bmRzPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLlJlY3RhbmdsZSh0aGlzLngtdGhpcy5yYWRpdXMsdGhpcy55LXRoaXMucmFkaXVzLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpfSxiLkNpcmNsZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5DaXJjbGUsYi5FbGxpcHNlPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMueD1hfHwwLHRoaXMueT1ifHwwLHRoaXMud2lkdGg9Y3x8MCx0aGlzLmhlaWdodD1kfHwwfSxiLkVsbGlwc2UucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLkVsbGlwc2UodGhpcy54LHRoaXMueSx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KX0sYi5FbGxpcHNlLnByb3RvdHlwZS5jb250YWlucz1mdW5jdGlvbihhLGIpe2lmKHRoaXMud2lkdGg8PTB8fHRoaXMuaGVpZ2h0PD0wKXJldHVybiExO3ZhciBjPShhLXRoaXMueCkvdGhpcy53aWR0aCxkPShiLXRoaXMueSkvdGhpcy5oZWlnaHQ7cmV0dXJuIGMqPWMsZCo9ZCwxPj1jK2R9LGIuRWxsaXBzZS5wcm90b3R5cGUuZ2V0Qm91bmRzPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBiLlJlY3RhbmdsZSh0aGlzLngtdGhpcy53aWR0aCx0aGlzLnktdGhpcy5oZWlnaHQsdGhpcy53aWR0aCx0aGlzLmhlaWdodCl9LGIuRWxsaXBzZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5FbGxpcHNlLGIuTWF0cml4PWZ1bmN0aW9uKCl7dGhpcy5hPTEsdGhpcy5iPTAsdGhpcy5jPTAsdGhpcy5kPTEsdGhpcy50eD0wLHRoaXMudHk9MH0sYi5NYXRyaXgucHJvdG90eXBlLmZyb21BcnJheT1mdW5jdGlvbihhKXt0aGlzLmE9YVswXSx0aGlzLmI9YVsxXSx0aGlzLmM9YVszXSx0aGlzLmQ9YVs0XSx0aGlzLnR4PWFbMl0sdGhpcy50eT1hWzVdfSxiLk1hdHJpeC5wcm90b3R5cGUudG9BcnJheT1mdW5jdGlvbihhKXt0aGlzLmFycmF5fHwodGhpcy5hcnJheT1uZXcgRmxvYXQzMkFycmF5KDkpKTt2YXIgYj10aGlzLmFycmF5O3JldHVybiBhPyhiWzBdPXRoaXMuYSxiWzFdPXRoaXMuYyxiWzJdPTAsYlszXT10aGlzLmIsYls0XT10aGlzLmQsYls1XT0wLGJbNl09dGhpcy50eCxiWzddPXRoaXMudHksYls4XT0xKTooYlswXT10aGlzLmEsYlsxXT10aGlzLmIsYlsyXT10aGlzLnR4LGJbM109dGhpcy5jLGJbNF09dGhpcy5kLGJbNV09dGhpcy50eSxiWzZdPTAsYls3XT0wLGJbOF09MSksYn0sYi5pZGVudGl0eU1hdHJpeD1uZXcgYi5NYXRyaXgsYi5kZXRlcm1pbmVNYXRyaXhBcnJheVR5cGU9ZnVuY3Rpb24oKXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgRmxvYXQzMkFycmF5P0Zsb2F0MzJBcnJheTpBcnJheX0sYi5NYXRyaXgyPWIuZGV0ZXJtaW5lTWF0cml4QXJyYXlUeXBlKCksYi5EaXNwbGF5T2JqZWN0PWZ1bmN0aW9uKCl7dGhpcy5wb3NpdGlvbj1uZXcgYi5Qb2ludCx0aGlzLnNjYWxlPW5ldyBiLlBvaW50KDEsMSksdGhpcy5waXZvdD1uZXcgYi5Qb2ludCgwLDApLHRoaXMucm90YXRpb249MCx0aGlzLmFscGhhPTEsdGhpcy52aXNpYmxlPSEwLHRoaXMuaGl0QXJlYT1udWxsLHRoaXMuYnV0dG9uTW9kZT0hMSx0aGlzLnJlbmRlcmFibGU9ITEsdGhpcy5wYXJlbnQ9bnVsbCx0aGlzLnN0YWdlPW51bGwsdGhpcy53b3JsZEFscGhhPTEsdGhpcy5faW50ZXJhY3RpdmU9ITEsdGhpcy5kZWZhdWx0Q3Vyc29yPVwicG9pbnRlclwiLHRoaXMud29ybGRUcmFuc2Zvcm09bmV3IGIuTWF0cml4LHRoaXMuY29sb3I9W10sdGhpcy5keW5hbWljPSEwLHRoaXMuX3NyPTAsdGhpcy5fY3I9MSx0aGlzLmZpbHRlckFyZWE9bnVsbCx0aGlzLl9ib3VuZHM9bmV3IGIuUmVjdGFuZ2xlKDAsMCwxLDEpLHRoaXMuX2N1cnJlbnRCb3VuZHM9bnVsbCx0aGlzLl9tYXNrPW51bGwsdGhpcy5fY2FjaGVBc0JpdG1hcD0hMSx0aGlzLl9jYWNoZUlzRGlydHk9ITF9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5EaXNwbGF5T2JqZWN0LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2V0SW50ZXJhY3RpdmU9ZnVuY3Rpb24oYSl7dGhpcy5pbnRlcmFjdGl2ZT1hfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcImludGVyYWN0aXZlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnRlcmFjdGl2ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuX2ludGVyYWN0aXZlPWEsdGhpcy5zdGFnZSYmKHRoaXMuc3RhZ2UuZGlydHk9ITApfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLFwid29ybGRWaXNpYmxlXCIse2dldDpmdW5jdGlvbigpe3ZhciBhPXRoaXM7ZG97aWYoIWEudmlzaWJsZSlyZXR1cm4hMTthPWEucGFyZW50fXdoaWxlKGEpO3JldHVybiEwfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLFwibWFza1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWFza30sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuX21hc2smJih0aGlzLl9tYXNrLmlzTWFzaz0hMSksdGhpcy5fbWFzaz1hLHRoaXMuX21hc2smJih0aGlzLl9tYXNrLmlzTWFzaz0hMCl9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oYSl7aWYoYSl7Zm9yKHZhciBiPVtdLGM9MDtjPGEubGVuZ3RoO2MrKylmb3IodmFyIGQ9YVtjXS5wYXNzZXMsZT0wO2U8ZC5sZW5ndGg7ZSsrKWIucHVzaChkW2VdKTt0aGlzLl9maWx0ZXJCbG9jaz17dGFyZ2V0OnRoaXMsZmlsdGVyUGFzc2VzOmJ9fXRoaXMuX2ZpbHRlcnM9YX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcImNhY2hlQXNCaXRtYXBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NhY2hlQXNCaXRtYXB9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9jYWNoZUFzQml0bWFwIT09YSYmKGE/dGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKTp0aGlzLl9kZXN0cm95Q2FjaGVkU3ByaXRlKCksdGhpcy5fY2FjaGVBc0JpdG1hcD1hKX19KSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMucm90YXRpb24hPT10aGlzLnJvdGF0aW9uQ2FjaGUmJih0aGlzLnJvdGF0aW9uQ2FjaGU9dGhpcy5yb3RhdGlvbix0aGlzLl9zcj1NYXRoLnNpbih0aGlzLnJvdGF0aW9uKSx0aGlzLl9jcj1NYXRoLmNvcyh0aGlzLnJvdGF0aW9uKSk7dmFyIGE9dGhpcy5wYXJlbnQud29ybGRUcmFuc2Zvcm0sYj10aGlzLndvcmxkVHJhbnNmb3JtLGM9dGhpcy5waXZvdC54LGQ9dGhpcy5waXZvdC55LGU9dGhpcy5fY3IqdGhpcy5zY2FsZS54LGY9LXRoaXMuX3NyKnRoaXMuc2NhbGUueSxnPXRoaXMuX3NyKnRoaXMuc2NhbGUueCxoPXRoaXMuX2NyKnRoaXMuc2NhbGUueSxpPXRoaXMucG9zaXRpb24ueC1lKmMtZCpmLGo9dGhpcy5wb3NpdGlvbi55LWgqZC1jKmcsaz1hLmEsbD1hLmIsbT1hLmMsbj1hLmQ7Yi5hPWsqZStsKmcsYi5iPWsqZitsKmgsYi50eD1rKmkrbCpqK2EudHgsYi5jPW0qZStuKmcsYi5kPW0qZituKmgsYi50eT1tKmkrbipqK2EudHksdGhpcy53b3JsZEFscGhhPXRoaXMuYWxwaGEqdGhpcy5wYXJlbnQud29ybGRBbHBoYX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5nZXRCb3VuZHM9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9YSxiLkVtcHR5UmVjdGFuZ2xlfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmdldExvY2FsQm91bmRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0Qm91bmRzKGIuaWRlbnRpdHlNYXRyaXgpfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNldFN0YWdlUmVmZXJlbmNlPWZ1bmN0aW9uKGEpe3RoaXMuc3RhZ2U9YSx0aGlzLl9pbnRlcmFjdGl2ZSYmKHRoaXMuc3RhZ2UuZGlydHk9ITApfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmdlbmVyYXRlVGV4dHVyZT1mdW5jdGlvbihhKXt2YXIgYz10aGlzLmdldExvY2FsQm91bmRzKCksZD1uZXcgYi5SZW5kZXJUZXh0dXJlKDB8Yy53aWR0aCwwfGMuaGVpZ2h0LGEpO3JldHVybiBkLnJlbmRlcih0aGlzLG5ldyBiLlBvaW50KC1jLngsLWMueSkpLGR9LGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlQ2FjaGU9ZnVuY3Rpb24oKXt0aGlzLl9nZW5lcmF0ZUNhY2hlZFNwcml0ZSgpfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9yZW5kZXJDYWNoZWRTcHJpdGU9ZnVuY3Rpb24oYSl7dGhpcy5fY2FjaGVkU3ByaXRlLndvcmxkQWxwaGE9dGhpcy53b3JsZEFscGhhLGEuZ2w/Yi5TcHJpdGUucHJvdG90eXBlLl9yZW5kZXJXZWJHTC5jYWxsKHRoaXMuX2NhY2hlZFNwcml0ZSxhKTpiLlNwcml0ZS5wcm90b3R5cGUuX3JlbmRlckNhbnZhcy5jYWxsKHRoaXMuX2NhY2hlZFNwcml0ZSxhKX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fZ2VuZXJhdGVDYWNoZWRTcHJpdGU9ZnVuY3Rpb24oKXt0aGlzLl9jYWNoZUFzQml0bWFwPSExO3ZhciBhPXRoaXMuZ2V0TG9jYWxCb3VuZHMoKTtpZih0aGlzLl9jYWNoZWRTcHJpdGUpdGhpcy5fY2FjaGVkU3ByaXRlLnRleHR1cmUucmVzaXplKDB8YS53aWR0aCwwfGEuaGVpZ2h0KTtlbHNle3ZhciBjPW5ldyBiLlJlbmRlclRleHR1cmUoMHxhLndpZHRoLDB8YS5oZWlnaHQpO3RoaXMuX2NhY2hlZFNwcml0ZT1uZXcgYi5TcHJpdGUoYyksdGhpcy5fY2FjaGVkU3ByaXRlLndvcmxkVHJhbnNmb3JtPXRoaXMud29ybGRUcmFuc2Zvcm19dmFyIGQ9dGhpcy5fZmlsdGVyczt0aGlzLl9maWx0ZXJzPW51bGwsdGhpcy5fY2FjaGVkU3ByaXRlLmZpbHRlcnM9ZCx0aGlzLl9jYWNoZWRTcHJpdGUudGV4dHVyZS5yZW5kZXIodGhpcyxuZXcgYi5Qb2ludCgtYS54LC1hLnkpKSx0aGlzLl9jYWNoZWRTcHJpdGUuYW5jaG9yLng9LShhLngvYS53aWR0aCksdGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci55PS0oYS55L2EuaGVpZ2h0KSx0aGlzLl9maWx0ZXJzPWQsdGhpcy5fY2FjaGVBc0JpdG1hcD0hMH0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fZGVzdHJveUNhY2hlZFNwcml0ZT1mdW5jdGlvbigpe3RoaXMuX2NhY2hlZFNwcml0ZSYmKHRoaXMuX2NhY2hlZFNwcml0ZS50ZXh0dXJlLmRlc3Ryb3koITApLHRoaXMuX2NhY2hlZFNwcml0ZT1udWxsKX0sYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7YT1hfSxiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7YT1hfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZSxcInhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9zaXRpb24ueH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMucG9zaXRpb24ueD1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLFwieVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wb3NpdGlvbi55fSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5wb3NpdGlvbi55PWF9fSksYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyPWZ1bmN0aW9uKCl7Yi5EaXNwbGF5T2JqZWN0LmNhbGwodGhpcyksdGhpcy5jaGlsZHJlbj1bXX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUpLGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLFwid2lkdGhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2NhbGUueCp0aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGh9LHNldDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLmdldExvY2FsQm91bmRzKCkud2lkdGg7dGhpcy5zY2FsZS54PTAhPT1iP2EvKGIvdGhpcy5zY2FsZS54KToxLHRoaXMuX3dpZHRoPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUsXCJoZWlnaHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2NhbGUueSp0aGlzLmdldExvY2FsQm91bmRzKCkuaGVpZ2h0fSxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5nZXRMb2NhbEJvdW5kcygpLmhlaWdodDt0aGlzLnNjYWxlLnk9MCE9PWI/YS8oYi90aGlzLnNjYWxlLnkpOjEsdGhpcy5faGVpZ2h0PWF9fSksYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5hZGRDaGlsZD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5hZGRDaGlsZEF0KGEsdGhpcy5jaGlsZHJlbi5sZW5ndGgpfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLmFkZENoaWxkQXQ9ZnVuY3Rpb24oYSxiKXtpZihiPj0wJiZiPD10aGlzLmNoaWxkcmVuLmxlbmd0aClyZXR1cm4gYS5wYXJlbnQmJmEucGFyZW50LnJlbW92ZUNoaWxkKGEpLGEucGFyZW50PXRoaXMsdGhpcy5jaGlsZHJlbi5zcGxpY2UoYiwwLGEpLHRoaXMuc3RhZ2UmJmEuc2V0U3RhZ2VSZWZlcmVuY2UodGhpcy5zdGFnZSksYTt0aHJvdyBuZXcgRXJyb3IoYStcIiBUaGUgaW5kZXggXCIrYitcIiBzdXBwbGllZCBpcyBvdXQgb2YgYm91bmRzIFwiK3RoaXMuY2hpbGRyZW4ubGVuZ3RoKX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5zd2FwQ2hpbGRyZW49ZnVuY3Rpb24oYSxiKXtpZihhIT09Yil7dmFyIGM9dGhpcy5jaGlsZHJlbi5pbmRleE9mKGEpLGQ9dGhpcy5jaGlsZHJlbi5pbmRleE9mKGIpO2lmKDA+Y3x8MD5kKXRocm93IG5ldyBFcnJvcihcInN3YXBDaGlsZHJlbjogQm90aCB0aGUgc3VwcGxpZWQgRGlzcGxheU9iamVjdHMgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBjYWxsZXIuXCIpO3RoaXMuY2hpbGRyZW5bY109Yix0aGlzLmNoaWxkcmVuW2RdPWF9fSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLmdldENoaWxkQXQ9ZnVuY3Rpb24oYSl7aWYoYT49MCYmYTx0aGlzLmNoaWxkcmVuLmxlbmd0aClyZXR1cm4gdGhpcy5jaGlsZHJlblthXTt0aHJvdyBuZXcgRXJyb3IoXCJTdXBwbGllZCBpbmRleCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgY2hpbGQgbGlzdCwgb3IgdGhlIHN1cHBsaWVkIERpc3BsYXlPYmplY3QgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBjYWxsZXJcIil9LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlQ2hpbGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdCh0aGlzLmNoaWxkcmVuLmluZGV4T2YoYSkpfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnJlbW92ZUNoaWxkQXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5nZXRDaGlsZEF0KGEpO3JldHVybiB0aGlzLnN0YWdlJiZiLnJlbW92ZVN0YWdlUmVmZXJlbmNlKCksYi5wYXJlbnQ9dm9pZCAwLHRoaXMuY2hpbGRyZW4uc3BsaWNlKGEsMSksYn0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZHJlbj1mdW5jdGlvbihhLGIpe3ZhciBjPWF8fDAsZD1cIm51bWJlclwiPT10eXBlb2YgYj9iOnRoaXMuY2hpbGRyZW4ubGVuZ3RoLGU9ZC1jO2lmKGU+MCYmZD49ZSl7Zm9yKHZhciBmPXRoaXMuY2hpbGRyZW4uc3BsaWNlKGMsZSksZz0wO2c8Zi5sZW5ndGg7ZysrKXt2YXIgaD1mW2ddO3RoaXMuc3RhZ2UmJmgucmVtb3ZlU3RhZ2VSZWZlcmVuY2UoKSxoLnBhcmVudD12b2lkIDB9cmV0dXJuIGZ9dGhyb3cgbmV3IEVycm9yKFwiUmFuZ2UgRXJyb3IsIG51bWVyaWMgdmFsdWVzIGFyZSBvdXRzaWRlIHRoZSBhY2NlcHRhYmxlIHJhbmdlXCIpfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe2lmKHRoaXMudmlzaWJsZSYmKGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtLmNhbGwodGhpcyksIXRoaXMuX2NhY2hlQXNCaXRtYXApKWZvcih2YXIgYT0wLGM9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yz5hO2ErKyl0aGlzLmNoaWxkcmVuW2FdLnVwZGF0ZVRyYW5zZm9ybSgpfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbihhKXtpZigwPT09dGhpcy5jaGlsZHJlbi5sZW5ndGgpcmV0dXJuIGIuRW1wdHlSZWN0YW5nbGU7aWYoYSl7dmFyIGM9dGhpcy53b3JsZFRyYW5zZm9ybTt0aGlzLndvcmxkVHJhbnNmb3JtPWEsdGhpcy51cGRhdGVUcmFuc2Zvcm0oKSx0aGlzLndvcmxkVHJhbnNmb3JtPWN9Zm9yKHZhciBkLGUsZixnPTEvMCxoPTEvMCxpPS0xLzAsaj0tMS8wLGs9ITEsbD0wLG09dGhpcy5jaGlsZHJlbi5sZW5ndGg7bT5sO2wrKyl7dmFyIG49dGhpcy5jaGlsZHJlbltsXTtuLnZpc2libGUmJihrPSEwLGQ9dGhpcy5jaGlsZHJlbltsXS5nZXRCb3VuZHMoYSksZz1nPGQueD9nOmQueCxoPWg8ZC55P2g6ZC55LGU9ZC53aWR0aCtkLngsZj1kLmhlaWdodCtkLnksaT1pPmU/aTplLGo9aj5mP2o6Zil9aWYoIWspcmV0dXJuIGIuRW1wdHlSZWN0YW5nbGU7dmFyIG89dGhpcy5fYm91bmRzO3JldHVybiBvLng9ZyxvLnk9aCxvLndpZHRoPWktZyxvLmhlaWdodD1qLWgsb30sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5nZXRMb2NhbEJvdW5kcz1mdW5jdGlvbigpe3ZhciBhPXRoaXMud29ybGRUcmFuc2Zvcm07dGhpcy53b3JsZFRyYW5zZm9ybT1iLmlkZW50aXR5TWF0cml4O2Zvcih2YXIgYz0wLGQ9dGhpcy5jaGlsZHJlbi5sZW5ndGg7ZD5jO2MrKyl0aGlzLmNoaWxkcmVuW2NdLnVwZGF0ZVRyYW5zZm9ybSgpO3ZhciBlPXRoaXMuZ2V0Qm91bmRzKCk7cmV0dXJuIHRoaXMud29ybGRUcmFuc2Zvcm09YSxlfSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnNldFN0YWdlUmVmZXJlbmNlPWZ1bmN0aW9uKGEpe3RoaXMuc3RhZ2U9YSx0aGlzLl9pbnRlcmFjdGl2ZSYmKHRoaXMuc3RhZ2UuZGlydHk9ITApO2Zvcih2YXIgYj0wLGM9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yz5iO2IrKyl7dmFyIGQ9dGhpcy5jaGlsZHJlbltiXTtkLnNldFN0YWdlUmVmZXJlbmNlKGEpfX0sYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmVTdGFnZVJlZmVyZW5jZT1mdW5jdGlvbigpe2Zvcih2YXIgYT0wLGI9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yj5hO2ErKyl7dmFyIGM9dGhpcy5jaGlsZHJlblthXTtjLnJlbW92ZVN0YWdlUmVmZXJlbmNlKCl9dGhpcy5faW50ZXJhY3RpdmUmJih0aGlzLnN0YWdlLmRpcnR5PSEwKSx0aGlzLnN0YWdlPW51bGx9LGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUuX3JlbmRlcldlYkdMPWZ1bmN0aW9uKGEpe2lmKHRoaXMudmlzaWJsZSYmISh0aGlzLmFscGhhPD0wKSl7aWYodGhpcy5fY2FjaGVBc0JpdG1hcClyZXR1cm4gdGhpcy5fcmVuZGVyQ2FjaGVkU3ByaXRlKGEpLHZvaWQgMDt2YXIgYixjO2lmKHRoaXMuX21hc2t8fHRoaXMuX2ZpbHRlcnMpe2Zvcih0aGlzLl9maWx0ZXJzJiYoYS5zcHJpdGVCYXRjaC5mbHVzaCgpLGEuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRoaXMuX2ZpbHRlckJsb2NrKSksdGhpcy5fbWFzayYmKGEuc3ByaXRlQmF0Y2guc3RvcCgpLGEubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5tYXNrLGEpLGEuc3ByaXRlQmF0Y2guc3RhcnQoKSksYj0wLGM9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yz5iO2IrKyl0aGlzLmNoaWxkcmVuW2JdLl9yZW5kZXJXZWJHTChhKTthLnNwcml0ZUJhdGNoLnN0b3AoKSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnBvcE1hc2sodGhpcy5fbWFzayxhKSx0aGlzLl9maWx0ZXJzJiZhLmZpbHRlck1hbmFnZXIucG9wRmlsdGVyKCksYS5zcHJpdGVCYXRjaC5zdGFydCgpfWVsc2UgZm9yKGI9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YjtiKyspdGhpcy5jaGlsZHJlbltiXS5fcmVuZGVyV2ViR0woYSl9fSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlIT09ITEmJjAhPT10aGlzLmFscGhhKXtpZih0aGlzLl9jYWNoZUFzQml0bWFwKXJldHVybiB0aGlzLl9yZW5kZXJDYWNoZWRTcHJpdGUoYSksdm9pZCAwO3RoaXMuX21hc2smJmEubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5fbWFzayxhLmNvbnRleHQpO2Zvcih2YXIgYj0wLGM9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Yz5iO2IrKyl7dmFyIGQ9dGhpcy5jaGlsZHJlbltiXTtkLl9yZW5kZXJDYW52YXMoYSl9dGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKGEuY29udGV4dCl9fSxiLlNwcml0ZT1mdW5jdGlvbihhKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLmFuY2hvcj1uZXcgYi5Qb2ludCx0aGlzLnRleHR1cmU9YSx0aGlzLl93aWR0aD0wLHRoaXMuX2hlaWdodD0wLHRoaXMudGludD0xNjc3NzIxNSx0aGlzLmJsZW5kTW9kZT1iLmJsZW5kTW9kZXMuTk9STUFMLGEuYmFzZVRleHR1cmUuaGFzTG9hZGVkP3RoaXMub25UZXh0dXJlVXBkYXRlKCk6KHRoaXMub25UZXh0dXJlVXBkYXRlQmluZD10aGlzLm9uVGV4dHVyZVVwZGF0ZS5iaW5kKHRoaXMpLHRoaXMudGV4dHVyZS5hZGRFdmVudExpc3RlbmVyKFwidXBkYXRlXCIsdGhpcy5vblRleHR1cmVVcGRhdGVCaW5kKSksdGhpcy5yZW5kZXJhYmxlPSEwfSxiLlNwcml0ZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLlNwcml0ZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5TcHJpdGUsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuU3ByaXRlLnByb3RvdHlwZSxcIndpZHRoXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNjYWxlLngqdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRofSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5zY2FsZS54PWEvdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRoLHRoaXMuX3dpZHRoPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuU3ByaXRlLnByb3RvdHlwZSxcImhlaWdodFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zY2FsZS55KnRoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHR9LHNldDpmdW5jdGlvbihhKXt0aGlzLnNjYWxlLnk9YS90aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0LHRoaXMuX2hlaWdodD1hfX0pLGIuU3ByaXRlLnByb3RvdHlwZS5zZXRUZXh0dXJlPWZ1bmN0aW9uKGEpe3RoaXMudGV4dHVyZT1hLHRoaXMuY2FjaGVkVGludD0xNjc3NzIxNX0sYi5TcHJpdGUucHJvdG90eXBlLm9uVGV4dHVyZVVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuX3dpZHRoJiYodGhpcy5zY2FsZS54PXRoaXMuX3dpZHRoL3RoaXMudGV4dHVyZS5mcmFtZS53aWR0aCksdGhpcy5faGVpZ2h0JiYodGhpcy5zY2FsZS55PXRoaXMuX2hlaWdodC90aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0KX0sYi5TcHJpdGUucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnRleHR1cmUuZnJhbWUud2lkdGgsYz10aGlzLnRleHR1cmUuZnJhbWUuaGVpZ2h0LGQ9YiooMS10aGlzLmFuY2hvci54KSxlPWIqLXRoaXMuYW5jaG9yLngsZj1jKigxLXRoaXMuYW5jaG9yLnkpLGc9YyotdGhpcy5hbmNob3IueSxoPWF8fHRoaXMud29ybGRUcmFuc2Zvcm0saT1oLmEsaj1oLmMsaz1oLmIsbD1oLmQsbT1oLnR4LG49aC50eSxvPWkqZStrKmcrbSxwPWwqZytqKmUrbixxPWkqZCtrKmcrbSxyPWwqZytqKmQrbixzPWkqZCtrKmYrbSx0PWwqZitqKmQrbix1PWkqZStrKmYrbSx2PWwqZitqKmUrbix3PS0xLzAseD0tMS8wLHk9MS8wLHo9MS8wO3k9eT5vP286eSx5PXk+cT9xOnkseT15PnM/czp5LHk9eT51P3U6eSx6PXo+cD9wOnosej16PnI/cjp6LHo9ej50P3Q6eix6PXo+dj92Onosdz1vPnc/bzp3LHc9cT53P3E6dyx3PXM+dz9zOncsdz11Pnc/dTp3LHg9cD54P3A6eCx4PXI+eD9yOngseD10Png/dDp4LHg9dj54P3Y6eDt2YXIgQT10aGlzLl9ib3VuZHM7cmV0dXJuIEEueD15LEEud2lkdGg9dy15LEEueT16LEEuaGVpZ2h0PXgteix0aGlzLl9jdXJyZW50Qm91bmRzPUEsQX0sYi5TcHJpdGUucHJvdG90eXBlLl9yZW5kZXJXZWJHTD1mdW5jdGlvbihhKXtpZih0aGlzLnZpc2libGUmJiEodGhpcy5hbHBoYTw9MCkpe3ZhciBiLGM7aWYodGhpcy5fbWFza3x8dGhpcy5fZmlsdGVycyl7dmFyIGQ9YS5zcHJpdGVCYXRjaDtmb3IodGhpcy5fZmlsdGVycyYmKGQuZmx1c2goKSxhLmZpbHRlck1hbmFnZXIucHVzaEZpbHRlcih0aGlzLl9maWx0ZXJCbG9jaykpLHRoaXMuX21hc2smJihkLnN0b3AoKSxhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMubWFzayxhKSxkLnN0YXJ0KCkpLGQucmVuZGVyKHRoaXMpLGI9MCxjPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2M+YjtiKyspdGhpcy5jaGlsZHJlbltiXS5fcmVuZGVyV2ViR0woYSk7ZC5zdG9wKCksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKHRoaXMuX21hc2ssYSksdGhpcy5fZmlsdGVycyYmYS5maWx0ZXJNYW5hZ2VyLnBvcEZpbHRlcigpLGQuc3RhcnQoKX1lbHNlIGZvcihhLnNwcml0ZUJhdGNoLnJlbmRlcih0aGlzKSxiPTAsYz10aGlzLmNoaWxkcmVuLmxlbmd0aDtjPmI7YisrKXRoaXMuY2hpbGRyZW5bYl0uX3JlbmRlcldlYkdMKGEpfX0sYi5TcHJpdGUucHJvdG90eXBlLl9yZW5kZXJDYW52YXM9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlIT09ITEmJjAhPT10aGlzLmFscGhhKXtpZih0aGlzLmJsZW5kTW9kZSE9PWEuY3VycmVudEJsZW5kTW9kZSYmKGEuY3VycmVudEJsZW5kTW9kZT10aGlzLmJsZW5kTW9kZSxhLmNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPWIuYmxlbmRNb2Rlc0NhbnZhc1thLmN1cnJlbnRCbGVuZE1vZGVdKSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssYS5jb250ZXh0KSx0aGlzLnRleHR1cmUudmFsaWQpe2EuY29udGV4dC5nbG9iYWxBbHBoYT10aGlzLndvcmxkQWxwaGEsYS5yb3VuZFBpeGVscz9hLmNvbnRleHQuc2V0VHJhbnNmb3JtKHRoaXMud29ybGRUcmFuc2Zvcm0uYSx0aGlzLndvcmxkVHJhbnNmb3JtLmMsdGhpcy53b3JsZFRyYW5zZm9ybS5iLHRoaXMud29ybGRUcmFuc2Zvcm0uZCwwfHRoaXMud29ybGRUcmFuc2Zvcm0udHgsMHx0aGlzLndvcmxkVHJhbnNmb3JtLnR5KTphLmNvbnRleHQuc2V0VHJhbnNmb3JtKHRoaXMud29ybGRUcmFuc2Zvcm0uYSx0aGlzLndvcmxkVHJhbnNmb3JtLmMsdGhpcy53b3JsZFRyYW5zZm9ybS5iLHRoaXMud29ybGRUcmFuc2Zvcm0uZCx0aGlzLndvcmxkVHJhbnNmb3JtLnR4LHRoaXMud29ybGRUcmFuc2Zvcm0udHkpLGEuc21vb3RoUHJvcGVydHkmJmEuc2NhbGVNb2RlIT09dGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLnNjYWxlTW9kZSYmKGEuc2NhbGVNb2RlPXRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5zY2FsZU1vZGUsYS5jb250ZXh0W2Euc21vb3RoUHJvcGVydHldPWEuc2NhbGVNb2RlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUik7dmFyIGM9dGhpcy50ZXh0dXJlLnRyaW0/dGhpcy50ZXh0dXJlLnRyaW0ueC10aGlzLmFuY2hvci54KnRoaXMudGV4dHVyZS50cmltLndpZHRoOnRoaXMuYW5jaG9yLngqLXRoaXMudGV4dHVyZS5mcmFtZS53aWR0aCxkPXRoaXMudGV4dHVyZS50cmltP3RoaXMudGV4dHVyZS50cmltLnktdGhpcy5hbmNob3IueSp0aGlzLnRleHR1cmUudHJpbS5oZWlnaHQ6dGhpcy5hbmNob3IueSotdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodDsxNjc3NzIxNSE9PXRoaXMudGludD8odGhpcy5jYWNoZWRUaW50IT09dGhpcy50aW50JiYodGhpcy5jYWNoZWRUaW50PXRoaXMudGludCx0aGlzLnRpbnRlZFRleHR1cmU9Yi5DYW52YXNUaW50ZXIuZ2V0VGludGVkVGV4dHVyZSh0aGlzLHRoaXMudGludCkpLGEuY29udGV4dC5kcmF3SW1hZ2UodGhpcy50aW50ZWRUZXh0dXJlLDAsMCx0aGlzLnRleHR1cmUuY3JvcC53aWR0aCx0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQsYyxkLHRoaXMudGV4dHVyZS5jcm9wLndpZHRoLHRoaXMudGV4dHVyZS5jcm9wLmhlaWdodCkpOmEuY29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLnNvdXJjZSx0aGlzLnRleHR1cmUuY3JvcC54LHRoaXMudGV4dHVyZS5jcm9wLnksdGhpcy50ZXh0dXJlLmNyb3Aud2lkdGgsdGhpcy50ZXh0dXJlLmNyb3AuaGVpZ2h0LGMsZCx0aGlzLnRleHR1cmUuY3JvcC53aWR0aCx0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQpfWZvcih2YXIgZT0wLGY9dGhpcy5jaGlsZHJlbi5sZW5ndGg7Zj5lO2UrKyl0aGlzLmNoaWxkcmVuW2VdLl9yZW5kZXJDYW52YXMoYSk7dGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKGEuY29udGV4dCl9fSxiLlNwcml0ZS5mcm9tRnJhbWU9ZnVuY3Rpb24oYSl7dmFyIGM9Yi5UZXh0dXJlQ2FjaGVbYV07aWYoIWMpdGhyb3cgbmV3IEVycm9yKCdUaGUgZnJhbWVJZCBcIicrYSsnXCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHRleHR1cmUgY2FjaGUnK3RoaXMpO3JldHVybiBuZXcgYi5TcHJpdGUoYyl9LGIuU3ByaXRlLmZyb21JbWFnZT1mdW5jdGlvbihhLGMsZCl7dmFyIGU9Yi5UZXh0dXJlLmZyb21JbWFnZShhLGMsZCk7cmV0dXJuIG5ldyBiLlNwcml0ZShlKX0sYi5TcHJpdGVCYXRjaD1mdW5jdGlvbihhKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLnRleHR1cmVUaGluZz1hLHRoaXMucmVhZHk9ITF9LGIuU3ByaXRlQmF0Y2gucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZSksYi5TcHJpdGVCYXRjaC5jb25zdHJ1Y3Rvcj1iLlNwcml0ZUJhdGNoLGIuU3ByaXRlQmF0Y2gucHJvdG90eXBlLmluaXRXZWJHTD1mdW5jdGlvbihhKXt0aGlzLmZhc3RTcHJpdGVCYXRjaD1uZXcgYi5XZWJHTEZhc3RTcHJpdGVCYXRjaChhKSx0aGlzLnJlYWR5PSEwfSxiLlNwcml0ZUJhdGNoLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXtiLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpfSxiLlNwcml0ZUJhdGNoLnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7IXRoaXMudmlzaWJsZXx8dGhpcy5hbHBoYTw9MHx8IXRoaXMuY2hpbGRyZW4ubGVuZ3RofHwodGhpcy5yZWFkeXx8dGhpcy5pbml0V2ViR0woYS5nbCksYS5zcHJpdGVCYXRjaC5zdG9wKCksYS5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihhLnNoYWRlck1hbmFnZXIuZmFzdFNoYWRlciksdGhpcy5mYXN0U3ByaXRlQmF0Y2guYmVnaW4odGhpcyxhKSx0aGlzLmZhc3RTcHJpdGVCYXRjaC5yZW5kZXIodGhpcyksYS5zcHJpdGVCYXRjaC5zdGFydCgpKX0sYi5TcHJpdGVCYXRjaC5wcm90b3R5cGUuX3JlbmRlckNhbnZhcz1mdW5jdGlvbihhKXt2YXIgYz1hLmNvbnRleHQ7Yy5nbG9iYWxBbHBoYT10aGlzLndvcmxkQWxwaGEsYi5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKTtmb3IodmFyIGQ9dGhpcy53b3JsZFRyYW5zZm9ybSxlPSEwLGY9MDtmPHRoaXMuY2hpbGRyZW4ubGVuZ3RoO2YrKyl7dmFyIGc9dGhpcy5jaGlsZHJlbltmXTtpZihnLnZpc2libGUpe3ZhciBoPWcudGV4dHVyZSxpPWguZnJhbWU7aWYoYy5nbG9iYWxBbHBoYT10aGlzLndvcmxkQWxwaGEqZy5hbHBoYSxnLnJvdGF0aW9uJSgyKk1hdGguUEkpPT09MCllJiYoYy5zZXRUcmFuc2Zvcm0oZC5hLGQuYyxkLmIsZC5kLGQudHgsZC50eSksZT0hMSksYy5kcmF3SW1hZ2UoaC5iYXNlVGV4dHVyZS5zb3VyY2UsaS54LGkueSxpLndpZHRoLGkuaGVpZ2h0LGcuYW5jaG9yLngqLWkud2lkdGgqZy5zY2FsZS54K2cucG9zaXRpb24ueCsuNXwwLGcuYW5jaG9yLnkqLWkuaGVpZ2h0Kmcuc2NhbGUueStnLnBvc2l0aW9uLnkrLjV8MCxpLndpZHRoKmcuc2NhbGUueCxpLmhlaWdodCpnLnNjYWxlLnkpO2Vsc2V7ZXx8KGU9ITApLGIuRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtLmNhbGwoZyk7dmFyIGo9Zy53b3JsZFRyYW5zZm9ybTthLnJvdW5kUGl4ZWxzP2Muc2V0VHJhbnNmb3JtKGouYSxqLmMsai5iLGouZCwwfGoudHgsMHxqLnR5KTpjLnNldFRyYW5zZm9ybShqLmEsai5jLGouYixqLmQsai50eCxqLnR5KSxjLmRyYXdJbWFnZShoLmJhc2VUZXh0dXJlLnNvdXJjZSxpLngsaS55LGkud2lkdGgsaS5oZWlnaHQsZy5hbmNob3IueCotaS53aWR0aCsuNXwwLGcuYW5jaG9yLnkqLWkuaGVpZ2h0Ky41fDAsaS53aWR0aCxpLmhlaWdodCl9fX19LGIuTW92aWVDbGlwPWZ1bmN0aW9uKGEpe2IuU3ByaXRlLmNhbGwodGhpcyxhWzBdKSx0aGlzLnRleHR1cmVzPWEsdGhpcy5hbmltYXRpb25TcGVlZD0xLHRoaXMubG9vcD0hMCx0aGlzLm9uQ29tcGxldGU9bnVsbCx0aGlzLmN1cnJlbnRGcmFtZT0wLHRoaXMucGxheWluZz0hMX0sYi5Nb3ZpZUNsaXAucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5TcHJpdGUucHJvdG90eXBlKSxiLk1vdmllQ2xpcC5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5Nb3ZpZUNsaXAsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuTW92aWVDbGlwLnByb3RvdHlwZSxcInRvdGFsRnJhbWVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRleHR1cmVzLmxlbmd0aH19KSxiLk1vdmllQ2xpcC5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMucGxheWluZz0hMX0sYi5Nb3ZpZUNsaXAucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oKXt0aGlzLnBsYXlpbmc9ITB9LGIuTW92aWVDbGlwLnByb3RvdHlwZS5nb3RvQW5kU3RvcD1mdW5jdGlvbihhKXt0aGlzLnBsYXlpbmc9ITEsdGhpcy5jdXJyZW50RnJhbWU9YTt2YXIgYj10aGlzLmN1cnJlbnRGcmFtZSsuNXwwO3RoaXMuc2V0VGV4dHVyZSh0aGlzLnRleHR1cmVzW2IldGhpcy50ZXh0dXJlcy5sZW5ndGhdKX0sYi5Nb3ZpZUNsaXAucHJvdG90eXBlLmdvdG9BbmRQbGF5PWZ1bmN0aW9uKGEpe3RoaXMuY3VycmVudEZyYW1lPWEsdGhpcy5wbGF5aW5nPSEwfSxiLk1vdmllQ2xpcC5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKCl7aWYoYi5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpLHRoaXMucGxheWluZyl7dGhpcy5jdXJyZW50RnJhbWUrPXRoaXMuYW5pbWF0aW9uU3BlZWQ7dmFyIGE9dGhpcy5jdXJyZW50RnJhbWUrLjV8MDt0aGlzLmN1cnJlbnRGcmFtZT10aGlzLmN1cnJlbnRGcmFtZSV0aGlzLnRleHR1cmVzLmxlbmd0aCx0aGlzLmxvb3B8fGE8dGhpcy50ZXh0dXJlcy5sZW5ndGg/dGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZXNbYSV0aGlzLnRleHR1cmVzLmxlbmd0aF0pOmE+PXRoaXMudGV4dHVyZXMubGVuZ3RoJiYodGhpcy5nb3RvQW5kU3RvcCh0aGlzLnRleHR1cmVzLmxlbmd0aC0xKSx0aGlzLm9uQ29tcGxldGUmJnRoaXMub25Db21wbGV0ZSgpKX19LGIuTW92aWVDbGlwLmZyb21GcmFtZXM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGEubGVuZ3RoO2QrKyljLnB1c2gobmV3IGIuVGV4dHVyZS5mcm9tRnJhbWUoYVtkXSkpO3JldHVybiBuZXcgYi5Nb3ZpZUNsaXAoYyl9LGIuTW92aWVDbGlwLmZyb21JbWFnZXM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGEubGVuZ3RoO2QrKyljLnB1c2gobmV3IGIuVGV4dHVyZS5mcm9tSW1hZ2UoYVtkXSkpO3JldHVybiBuZXcgYi5Nb3ZpZUNsaXAoYyl9LGIuRmlsdGVyQmxvY2s9ZnVuY3Rpb24oKXt0aGlzLnZpc2libGU9ITAsdGhpcy5yZW5kZXJhYmxlPSEwfSxiLlRleHQ9ZnVuY3Rpb24oYSxjKXt0aGlzLmNhbnZhcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuY29udGV4dD10aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksYi5TcHJpdGUuY2FsbCh0aGlzLGIuVGV4dHVyZS5mcm9tQ2FudmFzKHRoaXMuY2FudmFzKSksdGhpcy5zZXRUZXh0KGEpLHRoaXMuc2V0U3R5bGUoYyl9LGIuVGV4dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLlNwcml0ZS5wcm90b3R5cGUpLGIuVGV4dC5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5UZXh0LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlRleHQucHJvdG90eXBlLFwid2lkdGhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGlydHkmJih0aGlzLnVwZGF0ZVRleHQoKSx0aGlzLmRpcnR5PSExKSx0aGlzLnNjYWxlLngqdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRofSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5zY2FsZS54PWEvdGhpcy50ZXh0dXJlLmZyYW1lLndpZHRoLHRoaXMuX3dpZHRoPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuVGV4dC5wcm90b3R5cGUsXCJoZWlnaHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGlydHkmJih0aGlzLnVwZGF0ZVRleHQoKSx0aGlzLmRpcnR5PSExKSx0aGlzLnNjYWxlLnkqdGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuc2NhbGUueT1hL3RoaXMudGV4dHVyZS5mcmFtZS5oZWlnaHQsdGhpcy5faGVpZ2h0PWF9fSksYi5UZXh0LnByb3RvdHlwZS5zZXRTdHlsZT1mdW5jdGlvbihhKXthPWF8fHt9LGEuZm9udD1hLmZvbnR8fFwiYm9sZCAyMHB0IEFyaWFsXCIsYS5maWxsPWEuZmlsbHx8XCJibGFja1wiLGEuYWxpZ249YS5hbGlnbnx8XCJsZWZ0XCIsYS5zdHJva2U9YS5zdHJva2V8fFwiYmxhY2tcIixhLnN0cm9rZVRoaWNrbmVzcz1hLnN0cm9rZVRoaWNrbmVzc3x8MCxhLndvcmRXcmFwPWEud29yZFdyYXB8fCExLGEud29yZFdyYXBXaWR0aD1hLndvcmRXcmFwV2lkdGh8fDEwMCxhLndvcmRXcmFwV2lkdGg9YS53b3JkV3JhcFdpZHRofHwxMDAsYS5kcm9wU2hhZG93PWEuZHJvcFNoYWRvd3x8ITEsYS5kcm9wU2hhZG93QW5nbGU9YS5kcm9wU2hhZG93QW5nbGV8fE1hdGguUEkvNixhLmRyb3BTaGFkb3dEaXN0YW5jZT1hLmRyb3BTaGFkb3dEaXN0YW5jZXx8NCxhLmRyb3BTaGFkb3dDb2xvcj1hLmRyb3BTaGFkb3dDb2xvcnx8XCJibGFja1wiLHRoaXMuc3R5bGU9YSx0aGlzLmRpcnR5PSEwfSxiLlRleHQucHJvdG90eXBlLnNldFRleHQ9ZnVuY3Rpb24oYSl7dGhpcy50ZXh0PWEudG9TdHJpbmcoKXx8XCIgXCIsdGhpcy5kaXJ0eT0hMH0sYi5UZXh0LnByb3RvdHlwZS51cGRhdGVUZXh0PWZ1bmN0aW9uKCl7dGhpcy5jb250ZXh0LmZvbnQ9dGhpcy5zdHlsZS5mb250O3ZhciBhPXRoaXMudGV4dDt0aGlzLnN0eWxlLndvcmRXcmFwJiYoYT10aGlzLndvcmRXcmFwKHRoaXMudGV4dCkpO2Zvcih2YXIgYj1hLnNwbGl0KC8oPzpcXHJcXG58XFxyfFxcbikvKSxjPVtdLGQ9MCxlPTA7ZTxiLmxlbmd0aDtlKyspe3ZhciBmPXRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChiW2VdKS53aWR0aDtjW2VdPWYsZD1NYXRoLm1heChkLGYpfXZhciBnPWQrdGhpcy5zdHlsZS5zdHJva2VUaGlja25lc3M7dGhpcy5zdHlsZS5kcm9wU2hhZG93JiYoZys9dGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UpLHRoaXMuY2FudmFzLndpZHRoPWcrdGhpcy5jb250ZXh0LmxpbmVXaWR0aDt2YXIgaD10aGlzLmRldGVybWluZUZvbnRIZWlnaHQoXCJmb250OiBcIit0aGlzLnN0eWxlLmZvbnQrXCI7XCIpK3RoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzLGk9aCpiLmxlbmd0aDt0aGlzLnN0eWxlLmRyb3BTaGFkb3cmJihpKz10aGlzLnN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZSksdGhpcy5jYW52YXMuaGVpZ2h0PWksbmF2aWdhdG9yLmlzQ29jb29uSlMmJnRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzLndpZHRoLHRoaXMuY2FudmFzLmhlaWdodCksdGhpcy5jb250ZXh0LmZvbnQ9dGhpcy5zdHlsZS5mb250LHRoaXMuY29udGV4dC5zdHJva2VTdHlsZT10aGlzLnN0eWxlLnN0cm9rZSx0aGlzLmNvbnRleHQubGluZVdpZHRoPXRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzLHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmU9XCJ0b3BcIjt2YXIgaixrO2lmKHRoaXMuc3R5bGUuZHJvcFNoYWRvdyl7dGhpcy5jb250ZXh0LmZpbGxTdHlsZT10aGlzLnN0eWxlLmRyb3BTaGFkb3dDb2xvcjt2YXIgbD1NYXRoLnNpbih0aGlzLnN0eWxlLmRyb3BTaGFkb3dBbmdsZSkqdGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UsbT1NYXRoLmNvcyh0aGlzLnN0eWxlLmRyb3BTaGFkb3dBbmdsZSkqdGhpcy5zdHlsZS5kcm9wU2hhZG93RGlzdGFuY2U7Zm9yKGU9MDtlPGIubGVuZ3RoO2UrKylqPXRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzLzIsaz10aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcy8yK2UqaCxcInJpZ2h0XCI9PT10aGlzLnN0eWxlLmFsaWduP2orPWQtY1tlXTpcImNlbnRlclwiPT09dGhpcy5zdHlsZS5hbGlnbiYmKGorPShkLWNbZV0pLzIpLHRoaXMuc3R5bGUuZmlsbCYmdGhpcy5jb250ZXh0LmZpbGxUZXh0KGJbZV0saitsLGsrbSl9Zm9yKHRoaXMuY29udGV4dC5maWxsU3R5bGU9dGhpcy5zdHlsZS5maWxsLGU9MDtlPGIubGVuZ3RoO2UrKylqPXRoaXMuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzLzIsaz10aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcy8yK2UqaCxcInJpZ2h0XCI9PT10aGlzLnN0eWxlLmFsaWduP2orPWQtY1tlXTpcImNlbnRlclwiPT09dGhpcy5zdHlsZS5hbGlnbiYmKGorPShkLWNbZV0pLzIpLHRoaXMuc3R5bGUuc3Ryb2tlJiZ0aGlzLnN0eWxlLnN0cm9rZVRoaWNrbmVzcyYmdGhpcy5jb250ZXh0LnN0cm9rZVRleHQoYltlXSxqLGspLHRoaXMuc3R5bGUuZmlsbCYmdGhpcy5jb250ZXh0LmZpbGxUZXh0KGJbZV0saixrKTt0aGlzLnVwZGF0ZVRleHR1cmUoKX0sYi5UZXh0LnByb3RvdHlwZS51cGRhdGVUZXh0dXJlPWZ1bmN0aW9uKCl7dGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLndpZHRoPXRoaXMuY2FudmFzLndpZHRoLHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5oZWlnaHQ9dGhpcy5jYW52YXMuaGVpZ2h0LHRoaXMudGV4dHVyZS5jcm9wLndpZHRoPXRoaXMudGV4dHVyZS5mcmFtZS53aWR0aD10aGlzLmNhbnZhcy53aWR0aCx0aGlzLnRleHR1cmUuY3JvcC5oZWlnaHQ9dGhpcy50ZXh0dXJlLmZyYW1lLmhlaWdodD10aGlzLmNhbnZhcy5oZWlnaHQsdGhpcy5fd2lkdGg9dGhpcy5jYW52YXMud2lkdGgsdGhpcy5faGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodCx0aGlzLnJlcXVpcmVzVXBkYXRlPSEwfSxiLlRleHQucHJvdG90eXBlLl9yZW5kZXJXZWJHTD1mdW5jdGlvbihhKXt0aGlzLnJlcXVpcmVzVXBkYXRlJiYodGhpcy5yZXF1aXJlc1VwZGF0ZT0hMSxiLnVwZGF0ZVdlYkdMVGV4dHVyZSh0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUsYS5nbCkpLGIuU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyV2ViR0wuY2FsbCh0aGlzLGEpfSxiLlRleHQucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMuZGlydHkmJih0aGlzLnVwZGF0ZVRleHQoKSx0aGlzLmRpcnR5PSExKSxiLlNwcml0ZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtLmNhbGwodGhpcyl9LGIuVGV4dC5wcm90b3R5cGUuZGV0ZXJtaW5lRm9udEhlaWdodD1mdW5jdGlvbihhKXt2YXIgYz1iLlRleHQuaGVpZ2h0Q2FjaGVbYV07aWYoIWMpe3ZhciBkPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSxlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksZj1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIk1cIik7ZS5hcHBlbmRDaGlsZChmKSxlLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsYStcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjBcIiksZC5hcHBlbmRDaGlsZChlKSxjPWUub2Zmc2V0SGVpZ2h0LGIuVGV4dC5oZWlnaHRDYWNoZVthXT1jLGQucmVtb3ZlQ2hpbGQoZSl9cmV0dXJuIGN9LGIuVGV4dC5wcm90b3R5cGUud29yZFdyYXA9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVwiXCIsYz1hLnNwbGl0KFwiXFxuXCIpLGQ9MDtkPGMubGVuZ3RoO2QrKyl7Zm9yKHZhciBlPXRoaXMuc3R5bGUud29yZFdyYXBXaWR0aCxmPWNbZF0uc3BsaXQoXCIgXCIpLGc9MDtnPGYubGVuZ3RoO2crKyl7dmFyIGg9dGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KGZbZ10pLndpZHRoLGk9aCt0aGlzLmNvbnRleHQubWVhc3VyZVRleHQoXCIgXCIpLndpZHRoOzA9PT1nfHxpPmU/KGc+MCYmKGIrPVwiXFxuXCIpLGIrPWZbZ10sZT10aGlzLnN0eWxlLndvcmRXcmFwV2lkdGgtaCk6KGUtPWksYis9XCIgXCIrZltnXSl9ZDxjLmxlbmd0aC0xJiYoYis9XCJcXG5cIil9cmV0dXJuIGJ9LGIuVGV4dC5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbihhKXt0aGlzLmNvbnRleHQ9bnVsbCx0aGlzLmNhbnZhcz1udWxsLHRoaXMudGV4dHVyZS5kZXN0cm95KHZvaWQgMD09PWE/ITA6YSl9LGIuVGV4dC5oZWlnaHRDYWNoZT17fSxiLkJpdG1hcFRleHQ9ZnVuY3Rpb24oYSxjKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLl9wb29sPVtdLHRoaXMuc2V0VGV4dChhKSx0aGlzLnNldFN0eWxlKGMpLHRoaXMudXBkYXRlVGV4dCgpLHRoaXMuZGlydHk9ITF9LGIuQml0bWFwVGV4dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLkJpdG1hcFRleHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQml0bWFwVGV4dCxiLkJpdG1hcFRleHQucHJvdG90eXBlLnNldFRleHQ9ZnVuY3Rpb24oYSl7dGhpcy50ZXh0PWF8fFwiIFwiLHRoaXMuZGlydHk9ITB9LGIuQml0bWFwVGV4dC5wcm90b3R5cGUuc2V0U3R5bGU9ZnVuY3Rpb24oYSl7YT1hfHx7fSxhLmFsaWduPWEuYWxpZ258fFwibGVmdFwiLHRoaXMuc3R5bGU9YTt2YXIgYz1hLmZvbnQuc3BsaXQoXCIgXCIpO3RoaXMuZm9udE5hbWU9Y1tjLmxlbmd0aC0xXSx0aGlzLmZvbnRTaXplPWMubGVuZ3RoPj0yP3BhcnNlSW50KGNbYy5sZW5ndGgtMl0sMTApOmIuQml0bWFwVGV4dC5mb250c1t0aGlzLmZvbnROYW1lXS5zaXplLHRoaXMuZGlydHk9ITAsdGhpcy50aW50PWEudGludH0sYi5CaXRtYXBUZXh0LnByb3RvdHlwZS51cGRhdGVUZXh0PWZ1bmN0aW9uKCl7Zm9yKHZhciBhPWIuQml0bWFwVGV4dC5mb250c1t0aGlzLmZvbnROYW1lXSxjPW5ldyBiLlBvaW50LGQ9bnVsbCxlPVtdLGY9MCxnPVtdLGg9MCxpPXRoaXMuZm9udFNpemUvYS5zaXplLGo9MDtqPHRoaXMudGV4dC5sZW5ndGg7aisrKXt2YXIgaz10aGlzLnRleHQuY2hhckNvZGVBdChqKTtpZigvKD86XFxyXFxufFxccnxcXG4pLy50ZXN0KHRoaXMudGV4dC5jaGFyQXQoaikpKWcucHVzaChjLngpLGY9TWF0aC5tYXgoZixjLngpLGgrKyxjLng9MCxjLnkrPWEubGluZUhlaWdodCxkPW51bGw7ZWxzZXt2YXIgbD1hLmNoYXJzW2tdO2wmJihkJiZsW2RdJiYoYy54Kz1sLmtlcm5pbmdbZF0pLGUucHVzaCh7dGV4dHVyZTpsLnRleHR1cmUsbGluZTpoLGNoYXJDb2RlOmsscG9zaXRpb246bmV3IGIuUG9pbnQoYy54K2wueE9mZnNldCxjLnkrbC55T2Zmc2V0KX0pLGMueCs9bC54QWR2YW5jZSxkPWspfX1nLnB1c2goYy54KSxmPU1hdGgubWF4KGYsYy54KTt2YXIgbT1bXTtmb3Ioaj0wO2g+PWo7aisrKXt2YXIgbj0wO1wicmlnaHRcIj09PXRoaXMuc3R5bGUuYWxpZ24/bj1mLWdbal06XCJjZW50ZXJcIj09PXRoaXMuc3R5bGUuYWxpZ24mJihuPShmLWdbal0pLzIpLG0ucHVzaChuKX12YXIgbz10aGlzLmNoaWxkcmVuLmxlbmd0aCxwPWUubGVuZ3RoLHE9dGhpcy50aW50fHwxNjc3NzIxNTtmb3Ioaj0wO3A+ajtqKyspe3ZhciByPW8+aj90aGlzLmNoaWxkcmVuW2pdOnRoaXMuX3Bvb2wucG9wKCk7cj9yLnNldFRleHR1cmUoZVtqXS50ZXh0dXJlKTpyPW5ldyBiLlNwcml0ZShlW2pdLnRleHR1cmUpLHIucG9zaXRpb24ueD0oZVtqXS5wb3NpdGlvbi54K21bZVtqXS5saW5lXSkqaSxyLnBvc2l0aW9uLnk9ZVtqXS5wb3NpdGlvbi55Kmksci5zY2FsZS54PXIuc2NhbGUueT1pLHIudGludD1xLHIucGFyZW50fHx0aGlzLmFkZENoaWxkKHIpfWZvcig7dGhpcy5jaGlsZHJlbi5sZW5ndGg+cDspe3ZhciBzPXRoaXMuZ2V0Q2hpbGRBdCh0aGlzLmNoaWxkcmVuLmxlbmd0aC0xKTt0aGlzLl9wb29sLnB1c2gocyksdGhpcy5yZW1vdmVDaGlsZChzKX10aGlzLnRleHRXaWR0aD1mKmksdGhpcy50ZXh0SGVpZ2h0PShjLnkrYS5saW5lSGVpZ2h0KSppfSxiLkJpdG1hcFRleHQucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMuZGlydHkmJih0aGlzLnVwZGF0ZVRleHQoKSx0aGlzLmRpcnR5PSExKSxiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpfSxiLkJpdG1hcFRleHQuZm9udHM9e30sYi5JbnRlcmFjdGlvbkRhdGE9ZnVuY3Rpb24oKXt0aGlzLmdsb2JhbD1uZXcgYi5Qb2ludCx0aGlzLnRhcmdldD1udWxsLHRoaXMub3JpZ2luYWxFdmVudD1udWxsfSxiLkludGVyYWN0aW9uRGF0YS5wcm90b3R5cGUuZ2V0TG9jYWxQb3NpdGlvbj1mdW5jdGlvbihhKXt2YXIgYz1hLndvcmxkVHJhbnNmb3JtLGQ9dGhpcy5nbG9iYWwsZT1jLmEsZj1jLmIsZz1jLnR4LGg9Yy5jLGk9Yy5kLGo9Yy50eSxrPTEvKGUqaStmKi1oKTtyZXR1cm4gbmV3IGIuUG9pbnQoaSprKmQueCstZiprKmQueSsoaipmLWcqaSkqayxlKmsqZC55Ky1oKmsqZC54KygtaiplK2cqaCkqayl9LGIuSW50ZXJhY3Rpb25EYXRhLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkludGVyYWN0aW9uRGF0YSxiLkludGVyYWN0aW9uTWFuYWdlcj1mdW5jdGlvbihhKXt0aGlzLnN0YWdlPWEsdGhpcy5tb3VzZT1uZXcgYi5JbnRlcmFjdGlvbkRhdGEsdGhpcy50b3VjaHM9e30sdGhpcy50ZW1wUG9pbnQ9bmV3IGIuUG9pbnQsdGhpcy5tb3VzZW92ZXJFbmFibGVkPSEwLHRoaXMucG9vbD1bXSx0aGlzLmludGVyYWN0aXZlSXRlbXM9W10sdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQ9bnVsbCx0aGlzLm9uTW91c2VNb3ZlPXRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSx0aGlzLm9uTW91c2VEb3duPXRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSx0aGlzLm9uTW91c2VPdXQ9dGhpcy5vbk1vdXNlT3V0LmJpbmQodGhpcyksdGhpcy5vbk1vdXNlVXA9dGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSx0aGlzLm9uVG91Y2hTdGFydD10aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpLHRoaXMub25Ub3VjaEVuZD10aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSx0aGlzLm9uVG91Y2hNb3ZlPXRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSx0aGlzLmxhc3Q9MCx0aGlzLmN1cnJlbnRDdXJzb3JTdHlsZT1cImluaGVyaXRcIix0aGlzLm1vdXNlT3V0PSExfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5JbnRlcmFjdGlvbk1hbmFnZXIsYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLmNvbGxlY3RJbnRlcmFjdGl2ZVNwcml0ZT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1hLmNoaWxkcmVuLGQ9Yy5sZW5ndGgsZT1kLTE7ZT49MDtlLS0pe3ZhciBmPWNbZV07Zi5faW50ZXJhY3RpdmU/KGIuaW50ZXJhY3RpdmVDaGlsZHJlbj0hMCx0aGlzLmludGVyYWN0aXZlSXRlbXMucHVzaChmKSxmLmNoaWxkcmVuLmxlbmd0aD4wJiZ0aGlzLmNvbGxlY3RJbnRlcmFjdGl2ZVNwcml0ZShmLGYpKTooZi5fX2lQYXJlbnQ9bnVsbCxmLmNoaWxkcmVuLmxlbmd0aD4wJiZ0aGlzLmNvbGxlY3RJbnRlcmFjdGl2ZVNwcml0ZShmLGIpKX19LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5zZXRUYXJnZXQ9ZnVuY3Rpb24oYSl7dGhpcy50YXJnZXQ9YSxudWxsPT09dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQmJnRoaXMuc2V0VGFyZ2V0RG9tRWxlbWVudChhLnZpZXcpfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuc2V0VGFyZ2V0RG9tRWxlbWVudD1mdW5jdGlvbihhKXt0aGlzLnJlbW92ZUV2ZW50cygpLHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCYmKGEuc3R5bGVbXCItbXMtY29udGVudC16b29taW5nXCJdPVwibm9uZVwiLGEuc3R5bGVbXCItbXMtdG91Y2gtYWN0aW9uXCJdPVwibm9uZVwiKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudD1hLGEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMub25Nb3VzZU1vdmUsITApLGEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMub25Nb3VzZURvd24sITApLGEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsdGhpcy5vbk1vdXNlT3V0LCEwKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy5vblRvdWNoU3RhcnQsITApLGEuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy5vblRvdWNoRW5kLCEwKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLm9uVG91Y2hNb3ZlLCEwKSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIix0aGlzLm9uTW91c2VVcCwhMCl9LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVFdmVudHM9ZnVuY3Rpb24oKXt0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudCYmKHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnN0eWxlW1wiLW1zLWNvbnRlbnQtem9vbWluZ1wiXT1cIlwiLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnN0eWxlW1wiLW1zLXRvdWNoLWFjdGlvblwiXT1cIlwiLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm9uTW91c2VNb3ZlLCEwKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdGhpcy5vbk1vdXNlRG93biwhMCksdGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsdGhpcy5vbk1vdXNlT3V0LCEwKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMub25Ub3VjaFN0YXJ0LCEwKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLm9uVG91Y2hFbmQsITApLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLm9uVG91Y2hNb3ZlLCEwKSx0aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudD1udWxsLHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLHRoaXMub25Nb3VzZVVwLCEwKSl9LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oKXtpZih0aGlzLnRhcmdldCl7dmFyIGE9RGF0ZS5ub3coKSxjPWEtdGhpcy5sYXN0O2lmKGM9YypiLklOVEVSQUNUSU9OX0ZSRVFVRU5DWS8xZTMsISgxPmMpKXt0aGlzLmxhc3Q9YTt2YXIgZD0wO3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKTt2YXIgZT10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGY9XCJpbmhlcml0XCIsZz0hMTtmb3IoZD0wO2U+ZDtkKyspe3ZhciBoPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tkXTtoLl9faGl0PXRoaXMuaGl0VGVzdChoLHRoaXMubW91c2UpLHRoaXMubW91c2UudGFyZ2V0PWgsaC5fX2hpdCYmIWc/KGguYnV0dG9uTW9kZSYmKGY9aC5kZWZhdWx0Q3Vyc29yKSxoLmludGVyYWN0aXZlQ2hpbGRyZW58fChnPSEwKSxoLl9faXNPdmVyfHwoaC5tb3VzZW92ZXImJmgubW91c2VvdmVyKHRoaXMubW91c2UpLGguX19pc092ZXI9ITApKTpoLl9faXNPdmVyJiYoaC5tb3VzZW91dCYmaC5tb3VzZW91dCh0aGlzLm1vdXNlKSxoLl9faXNPdmVyPSExKX10aGlzLmN1cnJlbnRDdXJzb3JTdHlsZSE9PWYmJih0aGlzLmN1cnJlbnRDdXJzb3JTdHlsZT1mLHRoaXMuaW50ZXJhY3Rpb25ET01FbGVtZW50LnN0eWxlLmN1cnNvcj1mKX19fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUucmVidWlsZEludGVyYWN0aXZlR3JhcGg9ZnVuY3Rpb24oKXt0aGlzLmRpcnR5PSExO2Zvcih2YXIgYT10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGI9MDthPmI7YisrKXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tiXS5pbnRlcmFjdGl2ZUNoaWxkcmVuPSExO3RoaXMuaW50ZXJhY3RpdmVJdGVtcz1bXSx0aGlzLnN0YWdlLmludGVyYWN0aXZlJiZ0aGlzLmludGVyYWN0aXZlSXRlbXMucHVzaCh0aGlzLnN0YWdlKSx0aGlzLmNvbGxlY3RJbnRlcmFjdGl2ZVNwcml0ZSh0aGlzLnN0YWdlLHRoaXMuc3RhZ2UpfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Nb3VzZU1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eSYmdGhpcy5yZWJ1aWxkSW50ZXJhY3RpdmVHcmFwaCgpLHRoaXMubW91c2Uub3JpZ2luYWxFdmVudD1hfHx3aW5kb3cuZXZlbnQ7dmFyIGI9dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7dGhpcy5tb3VzZS5nbG9iYWwueD0oYS5jbGllbnRYLWIubGVmdCkqKHRoaXMudGFyZ2V0LndpZHRoL2Iud2lkdGgpLHRoaXMubW91c2UuZ2xvYmFsLnk9KGEuY2xpZW50WS1iLnRvcCkqKHRoaXMudGFyZ2V0LmhlaWdodC9iLmhlaWdodCk7Zm9yKHZhciBjPXRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGgsZD0wO2M+ZDtkKyspe3ZhciBlPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tkXTtlLm1vdXNlbW92ZSYmZS5tb3VzZW1vdmUodGhpcy5tb3VzZSl9fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Nb3VzZURvd249ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eSYmdGhpcy5yZWJ1aWxkSW50ZXJhY3RpdmVHcmFwaCgpLHRoaXMubW91c2Uub3JpZ2luYWxFdmVudD1hfHx3aW5kb3cuZXZlbnQsYi5BVVRPX1BSRVZFTlRfREVGQVVMVCYmdGhpcy5tb3VzZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7Zm9yKHZhciBjPXRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGgsZD0wO2M+ZDtkKyspe3ZhciBlPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tkXTtpZigoZS5tb3VzZWRvd258fGUuY2xpY2spJiYoZS5fX21vdXNlSXNEb3duPSEwLGUuX19oaXQ9dGhpcy5oaXRUZXN0KGUsdGhpcy5tb3VzZSksZS5fX2hpdCYmKGUubW91c2Vkb3duJiZlLm1vdXNlZG93bih0aGlzLm1vdXNlKSxlLl9faXNEb3duPSEwLCFlLmludGVyYWN0aXZlQ2hpbGRyZW4pKSlicmVha319LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5vbk1vdXNlT3V0PWZ1bmN0aW9uKCl7dGhpcy5kaXJ0eSYmdGhpcy5yZWJ1aWxkSW50ZXJhY3RpdmVHcmFwaCgpO3ZhciBhPXRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGg7dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQuc3R5bGUuY3Vyc29yPVwiaW5oZXJpdFwiO2Zvcih2YXIgYj0wO2E+YjtiKyspe3ZhciBjPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tiXTtjLl9faXNPdmVyJiYodGhpcy5tb3VzZS50YXJnZXQ9YyxjLm1vdXNlb3V0JiZjLm1vdXNlb3V0KHRoaXMubW91c2UpLGMuX19pc092ZXI9ITEpfXRoaXMubW91c2VPdXQ9ITAsdGhpcy5tb3VzZS5nbG9iYWwueD0tMWU0LHRoaXMubW91c2UuZ2xvYmFsLnk9LTFlNH0sYi5JbnRlcmFjdGlvbk1hbmFnZXIucHJvdG90eXBlLm9uTW91c2VVcD1mdW5jdGlvbihhKXt0aGlzLmRpcnR5JiZ0aGlzLnJlYnVpbGRJbnRlcmFjdGl2ZUdyYXBoKCksdGhpcy5tb3VzZS5vcmlnaW5hbEV2ZW50PWF8fHdpbmRvdy5ldmVudDtcbmZvcih2YXIgYj10aGlzLmludGVyYWN0aXZlSXRlbXMubGVuZ3RoLGM9ITEsZD0wO2I+ZDtkKyspe3ZhciBlPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tkXTtlLl9faGl0PXRoaXMuaGl0VGVzdChlLHRoaXMubW91c2UpLGUuX19oaXQmJiFjPyhlLm1vdXNldXAmJmUubW91c2V1cCh0aGlzLm1vdXNlKSxlLl9faXNEb3duJiZlLmNsaWNrJiZlLmNsaWNrKHRoaXMubW91c2UpLGUuaW50ZXJhY3RpdmVDaGlsZHJlbnx8KGM9ITApKTplLl9faXNEb3duJiZlLm1vdXNldXBvdXRzaWRlJiZlLm1vdXNldXBvdXRzaWRlKHRoaXMubW91c2UpLGUuX19pc0Rvd249ITF9fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUuaGl0VGVzdD1mdW5jdGlvbihhLGMpe3ZhciBkPWMuZ2xvYmFsO2lmKCFhLndvcmxkVmlzaWJsZSlyZXR1cm4hMTt2YXIgZT1hIGluc3RhbmNlb2YgYi5TcHJpdGUsZj1hLndvcmxkVHJhbnNmb3JtLGc9Zi5hLGg9Zi5iLGk9Zi50eCxqPWYuYyxrPWYuZCxsPWYudHksbT0xLyhnKmsraCotaiksbj1rKm0qZC54Ky1oKm0qZC55KyhsKmgtaSprKSptLG89ZyptKmQueSstaiptKmQueCsoLWwqZytpKmopKm07aWYoYy50YXJnZXQ9YSxhLmhpdEFyZWEmJmEuaGl0QXJlYS5jb250YWlucylyZXR1cm4gYS5oaXRBcmVhLmNvbnRhaW5zKG4sbyk/KGMudGFyZ2V0PWEsITApOiExO2lmKGUpe3ZhciBwLHE9YS50ZXh0dXJlLmZyYW1lLndpZHRoLHI9YS50ZXh0dXJlLmZyYW1lLmhlaWdodCxzPS1xKmEuYW5jaG9yLng7aWYobj5zJiZzK3E+biYmKHA9LXIqYS5hbmNob3IueSxvPnAmJnArcj5vKSlyZXR1cm4gYy50YXJnZXQ9YSwhMH1mb3IodmFyIHQ9YS5jaGlsZHJlbi5sZW5ndGgsdT0wO3Q+dTt1Kyspe3ZhciB2PWEuY2hpbGRyZW5bdV0sdz10aGlzLmhpdFRlc3QodixjKTtpZih3KXJldHVybiBjLnRhcmdldD1hLCEwfXJldHVybiExfSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Ub3VjaE1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eSYmdGhpcy5yZWJ1aWxkSW50ZXJhY3RpdmVHcmFwaCgpO3ZhciBiLGM9dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksZD1hLmNoYW5nZWRUb3VjaGVzLGU9MDtmb3IoZT0wO2U8ZC5sZW5ndGg7ZSsrKXt2YXIgZj1kW2VdO2I9dGhpcy50b3VjaHNbZi5pZGVudGlmaWVyXSxiLm9yaWdpbmFsRXZlbnQ9YXx8d2luZG93LmV2ZW50LGIuZ2xvYmFsLng9KGYuY2xpZW50WC1jLmxlZnQpKih0aGlzLnRhcmdldC53aWR0aC9jLndpZHRoKSxiLmdsb2JhbC55PShmLmNsaWVudFktYy50b3ApKih0aGlzLnRhcmdldC5oZWlnaHQvYy5oZWlnaHQpLG5hdmlnYXRvci5pc0NvY29vbkpTJiYoYi5nbG9iYWwueD1mLmNsaWVudFgsYi5nbG9iYWwueT1mLmNsaWVudFkpO2Zvcih2YXIgZz0wO2c8dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLmxlbmd0aDtnKyspe3ZhciBoPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tnXTtoLnRvdWNobW92ZSYmaC5fX3RvdWNoRGF0YSYmaC5fX3RvdWNoRGF0YVtmLmlkZW50aWZpZXJdJiZoLnRvdWNobW92ZShiKX19fSxiLkludGVyYWN0aW9uTWFuYWdlci5wcm90b3R5cGUub25Ub3VjaFN0YXJ0PWZ1bmN0aW9uKGEpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKTt2YXIgYz10aGlzLmludGVyYWN0aW9uRE9NRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtiLkFVVE9fUFJFVkVOVF9ERUZBVUxUJiZhLnByZXZlbnREZWZhdWx0KCk7Zm9yKHZhciBkPWEuY2hhbmdlZFRvdWNoZXMsZT0wO2U8ZC5sZW5ndGg7ZSsrKXt2YXIgZj1kW2VdLGc9dGhpcy5wb29sLnBvcCgpO2d8fChnPW5ldyBiLkludGVyYWN0aW9uRGF0YSksZy5vcmlnaW5hbEV2ZW50PWF8fHdpbmRvdy5ldmVudCx0aGlzLnRvdWNoc1tmLmlkZW50aWZpZXJdPWcsZy5nbG9iYWwueD0oZi5jbGllbnRYLWMubGVmdCkqKHRoaXMudGFyZ2V0LndpZHRoL2Mud2lkdGgpLGcuZ2xvYmFsLnk9KGYuY2xpZW50WS1jLnRvcCkqKHRoaXMudGFyZ2V0LmhlaWdodC9jLmhlaWdodCksbmF2aWdhdG9yLmlzQ29jb29uSlMmJihnLmdsb2JhbC54PWYuY2xpZW50WCxnLmdsb2JhbC55PWYuY2xpZW50WSk7Zm9yKHZhciBoPXRoaXMuaW50ZXJhY3RpdmVJdGVtcy5sZW5ndGgsaT0wO2g+aTtpKyspe3ZhciBqPXRoaXMuaW50ZXJhY3RpdmVJdGVtc1tpXTtpZigoai50b3VjaHN0YXJ0fHxqLnRhcCkmJihqLl9faGl0PXRoaXMuaGl0VGVzdChqLGcpLGouX19oaXQmJihqLnRvdWNoc3RhcnQmJmoudG91Y2hzdGFydChnKSxqLl9faXNEb3duPSEwLGouX190b3VjaERhdGE9ai5fX3RvdWNoRGF0YXx8e30sai5fX3RvdWNoRGF0YVtmLmlkZW50aWZpZXJdPWcsIWouaW50ZXJhY3RpdmVDaGlsZHJlbikpKWJyZWFrfX19LGIuSW50ZXJhY3Rpb25NYW5hZ2VyLnByb3RvdHlwZS5vblRvdWNoRW5kPWZ1bmN0aW9uKGEpe3RoaXMuZGlydHkmJnRoaXMucmVidWlsZEludGVyYWN0aXZlR3JhcGgoKTtmb3IodmFyIGI9dGhpcy5pbnRlcmFjdGlvbkRPTUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksYz1hLmNoYW5nZWRUb3VjaGVzLGQ9MDtkPGMubGVuZ3RoO2QrKyl7dmFyIGU9Y1tkXSxmPXRoaXMudG91Y2hzW2UuaWRlbnRpZmllcl0sZz0hMTtmLmdsb2JhbC54PShlLmNsaWVudFgtYi5sZWZ0KSoodGhpcy50YXJnZXQud2lkdGgvYi53aWR0aCksZi5nbG9iYWwueT0oZS5jbGllbnRZLWIudG9wKSoodGhpcy50YXJnZXQuaGVpZ2h0L2IuaGVpZ2h0KSxuYXZpZ2F0b3IuaXNDb2Nvb25KUyYmKGYuZ2xvYmFsLng9ZS5jbGllbnRYLGYuZ2xvYmFsLnk9ZS5jbGllbnRZKTtmb3IodmFyIGg9dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zLmxlbmd0aCxpPTA7aD5pO2krKyl7dmFyIGo9dGhpcy5pbnRlcmFjdGl2ZUl0ZW1zW2ldO2ouX190b3VjaERhdGEmJmouX190b3VjaERhdGFbZS5pZGVudGlmaWVyXSYmKGouX19oaXQ9dGhpcy5oaXRUZXN0KGosai5fX3RvdWNoRGF0YVtlLmlkZW50aWZpZXJdKSxmLm9yaWdpbmFsRXZlbnQ9YXx8d2luZG93LmV2ZW50LChqLnRvdWNoZW5kfHxqLnRhcCkmJihqLl9faGl0JiYhZz8oai50b3VjaGVuZCYmai50b3VjaGVuZChmKSxqLl9faXNEb3duJiZqLnRhcCYmai50YXAoZiksai5pbnRlcmFjdGl2ZUNoaWxkcmVufHwoZz0hMCkpOmouX19pc0Rvd24mJmoudG91Y2hlbmRvdXRzaWRlJiZqLnRvdWNoZW5kb3V0c2lkZShmKSxqLl9faXNEb3duPSExKSxqLl9fdG91Y2hEYXRhW2UuaWRlbnRpZmllcl09bnVsbCl9dGhpcy5wb29sLnB1c2goZiksdGhpcy50b3VjaHNbZS5pZGVudGlmaWVyXT1udWxsfX0sYi5TdGFnZT1mdW5jdGlvbihhKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLndvcmxkVHJhbnNmb3JtPW5ldyBiLk1hdHJpeCx0aGlzLmludGVyYWN0aXZlPSEwLHRoaXMuaW50ZXJhY3Rpb25NYW5hZ2VyPW5ldyBiLkludGVyYWN0aW9uTWFuYWdlcih0aGlzKSx0aGlzLmRpcnR5PSEwLHRoaXMuc3RhZ2U9dGhpcyx0aGlzLnN0YWdlLmhpdEFyZWE9bmV3IGIuUmVjdGFuZ2xlKDAsMCwxZTUsMWU1KSx0aGlzLnNldEJhY2tncm91bmRDb2xvcihhKX0sYi5TdGFnZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLlN0YWdlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlN0YWdlLGIuU3RhZ2UucHJvdG90eXBlLnNldEludGVyYWN0aW9uRGVsZWdhdGU9ZnVuY3Rpb24oYSl7dGhpcy5pbnRlcmFjdGlvbk1hbmFnZXIuc2V0VGFyZ2V0RG9tRWxlbWVudChhKX0sYi5TdGFnZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy53b3JsZEFscGhhPTE7Zm9yKHZhciBhPTAsYj10aGlzLmNoaWxkcmVuLmxlbmd0aDtiPmE7YSsrKXRoaXMuY2hpbGRyZW5bYV0udXBkYXRlVHJhbnNmb3JtKCk7dGhpcy5kaXJ0eSYmKHRoaXMuZGlydHk9ITEsdGhpcy5pbnRlcmFjdGlvbk1hbmFnZXIuZGlydHk9ITApLHRoaXMuaW50ZXJhY3RpdmUmJnRoaXMuaW50ZXJhY3Rpb25NYW5hZ2VyLnVwZGF0ZSgpfSxiLlN0YWdlLnByb3RvdHlwZS5zZXRCYWNrZ3JvdW5kQ29sb3I9ZnVuY3Rpb24oYSl7dGhpcy5iYWNrZ3JvdW5kQ29sb3I9YXx8MCx0aGlzLmJhY2tncm91bmRDb2xvclNwbGl0PWIuaGV4MnJnYih0aGlzLmJhY2tncm91bmRDb2xvcik7dmFyIGM9dGhpcy5iYWNrZ3JvdW5kQ29sb3IudG9TdHJpbmcoMTYpO2M9XCIwMDAwMDBcIi5zdWJzdHIoMCw2LWMubGVuZ3RoKStjLHRoaXMuYmFja2dyb3VuZENvbG9yU3RyaW5nPVwiI1wiK2N9LGIuU3RhZ2UucHJvdG90eXBlLmdldE1vdXNlUG9zaXRpb249ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pbnRlcmFjdGlvbk1hbmFnZXIubW91c2UuZ2xvYmFsfTtmb3IodmFyIGM9MCxkPVtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXSxlPTA7ZTxkLmxlbmd0aCYmIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7KytlKXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU9d2luZG93W2RbZV0rXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl0sd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lPXdpbmRvd1tkW2VdK1wiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl18fHdpbmRvd1tkW2VdK1wiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lPWZ1bmN0aW9uKGEpe3ZhciBiPShuZXcgRGF0ZSkuZ2V0VGltZSgpLGQ9TWF0aC5tYXgoMCwxNi0oYi1jKSksZT13aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2EoYitkKX0sZCk7cmV0dXJuIGM9YitkLGV9KSx3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWV8fCh3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU9ZnVuY3Rpb24oYSl7Y2xlYXJUaW1lb3V0KGEpfSksd2luZG93LnJlcXVlc3RBbmltRnJhbWU9d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxiLmhleDJyZ2I9ZnVuY3Rpb24oYSl7cmV0dXJuWyhhPj4xNiYyNTUpLzI1NSwoYT4+OCYyNTUpLzI1NSwoMjU1JmEpLzI1NV19LGIucmdiMmhleD1mdW5jdGlvbihhKXtyZXR1cm4oMjU1KmFbMF08PDE2KSsoMjU1KmFbMV08PDgpKzI1NSphWzJdfSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCYmKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kPWZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnNsaWNlO3JldHVybiBmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7dmFyIGY9ZS5jb25jYXQoYS5jYWxsKGFyZ3VtZW50cykpO2QuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGM/dGhpczpiLGYpfXZhciBkPXRoaXMsZT1hLmNhbGwoYXJndW1lbnRzLDEpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGQpdGhyb3cgbmV3IFR5cGVFcnJvcjtyZXR1cm4gYy5wcm90b3R5cGU9ZnVuY3Rpb24gZihhKXtyZXR1cm4gYSYmKGYucHJvdG90eXBlPWEpLHRoaXMgaW5zdGFuY2VvZiBmP3ZvaWQgMDpuZXcgZn0oZC5wcm90b3R5cGUpLGN9fSgpKSxiLkFqYXhSZXF1ZXN0PWZ1bmN0aW9uKCl7dmFyIGE9W1wiTXN4bWwyLlhNTEhUVFAuNi4wXCIsXCJNc3htbDIuWE1MSFRUUC4zLjBcIixcIk1pY3Jvc29mdC5YTUxIVFRQXCJdO2lmKCF3aW5kb3cuQWN0aXZlWE9iamVjdClyZXR1cm4gd2luZG93LlhNTEh0dHBSZXF1ZXN0P25ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q6ITE7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspdHJ5e3JldHVybiBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoYVtiXSl9Y2F0Y2goYyl7fX0sYi5jYW5Vc2VOZXdDYW52YXNCbGVuZE1vZGVzPWZ1bmN0aW9uKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTthLndpZHRoPTEsYS5oZWlnaHQ9MTt2YXIgYj1hLmdldENvbnRleHQoXCIyZFwiKTtyZXR1cm4gYi5maWxsU3R5bGU9XCIjMDAwXCIsYi5maWxsUmVjdCgwLDAsMSwxKSxiLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cIm11bHRpcGx5XCIsYi5maWxsU3R5bGU9XCIjZmZmXCIsYi5maWxsUmVjdCgwLDAsMSwxKSwwPT09Yi5nZXRJbWFnZURhdGEoMCwwLDEsMSkuZGF0YVswXX0sYi5nZXROZXh0UG93ZXJPZlR3bz1mdW5jdGlvbihhKXtpZihhPjAmJjA9PT0oYSZhLTEpKXJldHVybiBhO2Zvcih2YXIgYj0xO2E+YjspYjw8PTE7cmV0dXJuIGJ9LGIuRXZlbnRUYXJnZXQ9ZnVuY3Rpb24oKXt2YXIgYT17fTt0aGlzLmFkZEV2ZW50TGlzdGVuZXI9dGhpcy5vbj1mdW5jdGlvbihiLGMpe3ZvaWQgMD09PWFbYl0mJihhW2JdPVtdKSwtMT09PWFbYl0uaW5kZXhPZihjKSYmYVtiXS51bnNoaWZ0KGMpfSx0aGlzLmRpc3BhdGNoRXZlbnQ9dGhpcy5lbWl0PWZ1bmN0aW9uKGIpe2lmKGFbYi50eXBlXSYmYVtiLnR5cGVdLmxlbmd0aClmb3IodmFyIGM9YVtiLnR5cGVdLmxlbmd0aC0xO2M+PTA7Yy0tKWFbYi50eXBlXVtjXShiKX0sdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyPXRoaXMub2ZmPWZ1bmN0aW9uKGIsYyl7aWYodm9pZCAwIT09YVtiXSl7dmFyIGQ9YVtiXS5pbmRleE9mKGMpOy0xIT09ZCYmYVtiXS5zcGxpY2UoZCwxKX19LHRoaXMucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnM9ZnVuY3Rpb24oYil7dmFyIGM9YVtiXTtjJiYoYy5sZW5ndGg9MCl9fSxiLmF1dG9EZXRlY3RSZW5kZXJlcj1mdW5jdGlvbihhLGMsZCxlLGYpe2F8fChhPTgwMCksY3x8KGM9NjAwKTt2YXIgZz1mdW5jdGlvbigpe3RyeXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiEhd2luZG93LldlYkdMUmVuZGVyaW5nQ29udGV4dCYmKGEuZ2V0Q29udGV4dChcIndlYmdsXCIpfHxhLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIikpfWNhdGNoKGIpe3JldHVybiExfX0oKTtyZXR1cm4gZz9uZXcgYi5XZWJHTFJlbmRlcmVyKGEsYyxkLGUsZik6bmV3IGIuQ2FudmFzUmVuZGVyZXIoYSxjLGQsZSl9LGIuYXV0b0RldGVjdFJlY29tbWVuZGVkUmVuZGVyZXI9ZnVuY3Rpb24oYSxjLGQsZSxmKXthfHwoYT04MDApLGN8fChjPTYwMCk7dmFyIGc9ZnVuY3Rpb24oKXt0cnl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtyZXR1cm4hIXdpbmRvdy5XZWJHTFJlbmRlcmluZ0NvbnRleHQmJihhLmdldENvbnRleHQoXCJ3ZWJnbFwiKXx8YS5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpKX1jYXRjaChiKXtyZXR1cm4hMX19KCksaD0vQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7cmV0dXJuIGcmJiFoP25ldyBiLldlYkdMUmVuZGVyZXIoYSxjLGQsZSxmKTpuZXcgYi5DYW52YXNSZW5kZXJlcihhLGMsZCxlKX0sYi5Qb2x5Sz17fSxiLlBvbHlLLlRyaWFuZ3VsYXRlPWZ1bmN0aW9uKGEpe3ZhciBjPSEwLGQ9YS5sZW5ndGg+PjE7aWYoMz5kKXJldHVybltdO2Zvcih2YXIgZT1bXSxmPVtdLGc9MDtkPmc7ZysrKWYucHVzaChnKTtnPTA7Zm9yKHZhciBoPWQ7aD4zOyl7dmFyIGk9ZlsoZyswKSVoXSxqPWZbKGcrMSklaF0saz1mWyhnKzIpJWhdLGw9YVsyKmldLG09YVsyKmkrMV0sbj1hWzIqal0sbz1hWzIqaisxXSxwPWFbMiprXSxxPWFbMiprKzFdLHI9ITE7aWYoYi5Qb2x5Sy5fY29udmV4KGwsbSxuLG8scCxxLGMpKXtyPSEwO2Zvcih2YXIgcz0wO2g+cztzKyspe3ZhciB0PWZbc107aWYodCE9PWkmJnQhPT1qJiZ0IT09ayYmYi5Qb2x5Sy5fUG9pbnRJblRyaWFuZ2xlKGFbMip0XSxhWzIqdCsxXSxsLG0sbixvLHAscSkpe3I9ITE7YnJlYWt9fX1pZihyKWUucHVzaChpLGosayksZi5zcGxpY2UoKGcrMSklaCwxKSxoLS0sZz0wO2Vsc2UgaWYoZysrPjMqaCl7aWYoIWMpcmV0dXJuIHdpbmRvdy5jb25zb2xlLmxvZyhcIlBJWEkgV2FybmluZzogc2hhcGUgdG9vIGNvbXBsZXggdG8gZmlsbFwiKSxbXTtmb3IoZT1bXSxmPVtdLGc9MDtkPmc7ZysrKWYucHVzaChnKTtnPTAsaD1kLGM9ITF9fXJldHVybiBlLnB1c2goZlswXSxmWzFdLGZbMl0pLGV9LGIuUG9seUsuX1BvaW50SW5UcmlhbmdsZT1mdW5jdGlvbihhLGIsYyxkLGUsZixnLGgpe3ZhciBpPWctYyxqPWgtZCxrPWUtYyxsPWYtZCxtPWEtYyxuPWItZCxvPWkqaStqKmoscD1pKmsraipsLHE9aSptK2oqbixyPWsqaytsKmwscz1rKm0rbCpuLHQ9MS8obypyLXAqcCksdT0ocipxLXAqcykqdCx2PShvKnMtcCpxKSp0O3JldHVybiB1Pj0wJiZ2Pj0wJiYxPnUrdn0sYi5Qb2x5Sy5fY29udmV4PWZ1bmN0aW9uKGEsYixjLGQsZSxmLGcpe3JldHVybihiLWQpKihlLWMpKyhjLWEpKihmLWQpPj0wPT09Z30sYi5pbml0RGVmYXVsdFNoYWRlcnM9ZnVuY3Rpb24oKXt9LGIuQ29tcGlsZVZlcnRleFNoYWRlcj1mdW5jdGlvbihhLGMpe3JldHVybiBiLl9Db21waWxlU2hhZGVyKGEsYyxhLlZFUlRFWF9TSEFERVIpfSxiLkNvbXBpbGVGcmFnbWVudFNoYWRlcj1mdW5jdGlvbihhLGMpe3JldHVybiBiLl9Db21waWxlU2hhZGVyKGEsYyxhLkZSQUdNRU5UX1NIQURFUil9LGIuX0NvbXBpbGVTaGFkZXI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWIuam9pbihcIlxcblwiKSxlPWEuY3JlYXRlU2hhZGVyKGMpO3JldHVybiBhLnNoYWRlclNvdXJjZShlLGQpLGEuY29tcGlsZVNoYWRlcihlKSxhLmdldFNoYWRlclBhcmFtZXRlcihlLGEuQ09NUElMRV9TVEFUVVMpP2U6KHdpbmRvdy5jb25zb2xlLmxvZyhhLmdldFNoYWRlckluZm9Mb2coZSkpLG51bGwpfSxiLmNvbXBpbGVQcm9ncmFtPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT1iLkNvbXBpbGVGcmFnbWVudFNoYWRlcihhLGQpLGY9Yi5Db21waWxlVmVydGV4U2hhZGVyKGEsYyksZz1hLmNyZWF0ZVByb2dyYW0oKTtyZXR1cm4gYS5hdHRhY2hTaGFkZXIoZyxmKSxhLmF0dGFjaFNoYWRlcihnLGUpLGEubGlua1Byb2dyYW0oZyksYS5nZXRQcm9ncmFtUGFyYW1ldGVyKGcsYS5MSU5LX1NUQVRVUyl8fHdpbmRvdy5jb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBpbml0aWFsaXNlIHNoYWRlcnNcIiksZ30sYi5QaXhpU2hhZGVyPWZ1bmN0aW9uKGEpe3RoaXMuX1VJRD1iLl9VSUQrKyx0aGlzLmdsPWEsdGhpcy5wcm9ncmFtPW51bGwsdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbG93cCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKiB2Q29sb3IgO1wiLFwifVwiXSx0aGlzLnRleHR1cmVDb3VudD0wLHRoaXMuYXR0cmlidXRlcz1bXSx0aGlzLmluaXQoKX0sYi5QaXhpU2hhZGVyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPWIuY29tcGlsZVByb2dyYW0oYSx0aGlzLnZlcnRleFNyY3x8Yi5QaXhpU2hhZGVyLmRlZmF1bHRWZXJ0ZXhTcmMsdGhpcy5mcmFnbWVudFNyYyk7YS51c2VQcm9ncmFtKGMpLHRoaXMudVNhbXBsZXI9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInVTYW1wbGVyXCIpLHRoaXMucHJvamVjdGlvblZlY3Rvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwicHJvamVjdGlvblZlY3RvclwiKSx0aGlzLm9mZnNldFZlY3Rvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwib2Zmc2V0VmVjdG9yXCIpLHRoaXMuZGltZW5zaW9ucz1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwiZGltZW5zaW9uc1wiKSx0aGlzLmFWZXJ0ZXhQb3NpdGlvbj1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVmVydGV4UG9zaXRpb25cIiksdGhpcy5hVGV4dHVyZUNvb3JkPWEuZ2V0QXR0cmliTG9jYXRpb24oYyxcImFUZXh0dXJlQ29vcmRcIiksdGhpcy5jb2xvckF0dHJpYnV0ZT1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhQ29sb3JcIiksLTE9PT10aGlzLmNvbG9yQXR0cmlidXRlJiYodGhpcy5jb2xvckF0dHJpYnV0ZT0yKSx0aGlzLmF0dHJpYnV0ZXM9W3RoaXMuYVZlcnRleFBvc2l0aW9uLHRoaXMuYVRleHR1cmVDb29yZCx0aGlzLmNvbG9yQXR0cmlidXRlXTtmb3IodmFyIGQgaW4gdGhpcy51bmlmb3Jtcyl0aGlzLnVuaWZvcm1zW2RdLnVuaWZvcm1Mb2NhdGlvbj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLGQpO3RoaXMuaW5pdFVuaWZvcm1zKCksdGhpcy5wcm9ncmFtPWN9LGIuUGl4aVNoYWRlci5wcm90b3R5cGUuaW5pdFVuaWZvcm1zPWZ1bmN0aW9uKCl7dGhpcy50ZXh0dXJlQ291bnQ9MTt2YXIgYSxiPXRoaXMuZ2w7Zm9yKHZhciBjIGluIHRoaXMudW5pZm9ybXMpe2E9dGhpcy51bmlmb3Jtc1tjXTt2YXIgZD1hLnR5cGU7XCJzYW1wbGVyMkRcIj09PWQ/KGEuX2luaXQ9ITEsbnVsbCE9PWEudmFsdWUmJnRoaXMuaW5pdFNhbXBsZXIyRChhKSk6XCJtYXQyXCI9PT1kfHxcIm1hdDNcIj09PWR8fFwibWF0NFwiPT09ZD8oYS5nbE1hdHJpeD0hMCxhLmdsVmFsdWVMZW5ndGg9MSxcIm1hdDJcIj09PWQ/YS5nbEZ1bmM9Yi51bmlmb3JtTWF0cml4MmZ2OlwibWF0M1wiPT09ZD9hLmdsRnVuYz1iLnVuaWZvcm1NYXRyaXgzZnY6XCJtYXQ0XCI9PT1kJiYoYS5nbEZ1bmM9Yi51bmlmb3JtTWF0cml4NGZ2KSk6KGEuZ2xGdW5jPWJbXCJ1bmlmb3JtXCIrZF0sYS5nbFZhbHVlTGVuZ3RoPVwiMmZcIj09PWR8fFwiMmlcIj09PWQ/MjpcIjNmXCI9PT1kfHxcIjNpXCI9PT1kPzM6XCI0ZlwiPT09ZHx8XCI0aVwiPT09ZD80OjEpfX0sYi5QaXhpU2hhZGVyLnByb3RvdHlwZS5pbml0U2FtcGxlcjJEPWZ1bmN0aW9uKGEpe2lmKGEudmFsdWUmJmEudmFsdWUuYmFzZVRleHR1cmUmJmEudmFsdWUuYmFzZVRleHR1cmUuaGFzTG9hZGVkKXt2YXIgYj10aGlzLmdsO2lmKGIuYWN0aXZlVGV4dHVyZShiW1wiVEVYVFVSRVwiK3RoaXMudGV4dHVyZUNvdW50XSksYi5iaW5kVGV4dHVyZShiLlRFWFRVUkVfMkQsYS52YWx1ZS5iYXNlVGV4dHVyZS5fZ2xUZXh0dXJlc1tiLmlkXSksYS50ZXh0dXJlRGF0YSl7dmFyIGM9YS50ZXh0dXJlRGF0YSxkPWMubWFnRmlsdGVyP2MubWFnRmlsdGVyOmIuTElORUFSLGU9Yy5taW5GaWx0ZXI/Yy5taW5GaWx0ZXI6Yi5MSU5FQVIsZj1jLndyYXBTP2Mud3JhcFM6Yi5DTEFNUF9UT19FREdFLGc9Yy53cmFwVD9jLndyYXBUOmIuQ0xBTVBfVE9fRURHRSxoPWMubHVtaW5hbmNlP2IuTFVNSU5BTkNFOmIuUkdCQTtpZihjLnJlcGVhdCYmKGY9Yi5SRVBFQVQsZz1iLlJFUEVBVCksYi5waXhlbFN0b3JlaShiLlVOUEFDS19GTElQX1lfV0VCR0wsISFjLmZsaXBZKSxjLndpZHRoKXt2YXIgaT1jLndpZHRoP2Mud2lkdGg6NTEyLGo9Yy5oZWlnaHQ/Yy5oZWlnaHQ6MixrPWMuYm9yZGVyP2MuYm9yZGVyOjA7Yi50ZXhJbWFnZTJEKGIuVEVYVFVSRV8yRCwwLGgsaSxqLGssaCxiLlVOU0lHTkVEX0JZVEUsbnVsbCl9ZWxzZSBiLnRleEltYWdlMkQoYi5URVhUVVJFXzJELDAsaCxiLlJHQkEsYi5VTlNJR05FRF9CWVRFLGEudmFsdWUuYmFzZVRleHR1cmUuc291cmNlKTtiLnRleFBhcmFtZXRlcmkoYi5URVhUVVJFXzJELGIuVEVYVFVSRV9NQUdfRklMVEVSLGQpLGIudGV4UGFyYW1ldGVyaShiLlRFWFRVUkVfMkQsYi5URVhUVVJFX01JTl9GSUxURVIsZSksYi50ZXhQYXJhbWV0ZXJpKGIuVEVYVFVSRV8yRCxiLlRFWFRVUkVfV1JBUF9TLGYpLGIudGV4UGFyYW1ldGVyaShiLlRFWFRVUkVfMkQsYi5URVhUVVJFX1dSQVBfVCxnKX1iLnVuaWZvcm0xaShhLnVuaWZvcm1Mb2NhdGlvbix0aGlzLnRleHR1cmVDb3VudCksYS5faW5pdD0hMCx0aGlzLnRleHR1cmVDb3VudCsrfX0sYi5QaXhpU2hhZGVyLnByb3RvdHlwZS5zeW5jVW5pZm9ybXM9ZnVuY3Rpb24oKXt0aGlzLnRleHR1cmVDb3VudD0xO3ZhciBhLGM9dGhpcy5nbDtmb3IodmFyIGQgaW4gdGhpcy51bmlmb3JtcylhPXRoaXMudW5pZm9ybXNbZF0sMT09PWEuZ2xWYWx1ZUxlbmd0aD9hLmdsTWF0cml4PT09ITA/YS5nbEZ1bmMuY2FsbChjLGEudW5pZm9ybUxvY2F0aW9uLGEudHJhbnNwb3NlLGEudmFsdWUpOmEuZ2xGdW5jLmNhbGwoYyxhLnVuaWZvcm1Mb2NhdGlvbixhLnZhbHVlKToyPT09YS5nbFZhbHVlTGVuZ3RoP2EuZ2xGdW5jLmNhbGwoYyxhLnVuaWZvcm1Mb2NhdGlvbixhLnZhbHVlLngsYS52YWx1ZS55KTozPT09YS5nbFZhbHVlTGVuZ3RoP2EuZ2xGdW5jLmNhbGwoYyxhLnVuaWZvcm1Mb2NhdGlvbixhLnZhbHVlLngsYS52YWx1ZS55LGEudmFsdWUueik6ND09PWEuZ2xWYWx1ZUxlbmd0aD9hLmdsRnVuYy5jYWxsKGMsYS51bmlmb3JtTG9jYXRpb24sYS52YWx1ZS54LGEudmFsdWUueSxhLnZhbHVlLnosYS52YWx1ZS53KTpcInNhbXBsZXIyRFwiPT09YS50eXBlJiYoYS5faW5pdD8oYy5hY3RpdmVUZXh0dXJlKGNbXCJURVhUVVJFXCIrdGhpcy50ZXh0dXJlQ291bnRdKSxjLmJpbmRUZXh0dXJlKGMuVEVYVFVSRV8yRCxhLnZhbHVlLmJhc2VUZXh0dXJlLl9nbFRleHR1cmVzW2MuaWRdfHxiLmNyZWF0ZVdlYkdMVGV4dHVyZShhLnZhbHVlLmJhc2VUZXh0dXJlLGMpKSxjLnVuaWZvcm0xaShhLnVuaWZvcm1Mb2NhdGlvbix0aGlzLnRleHR1cmVDb3VudCksdGhpcy50ZXh0dXJlQ291bnQrKyk6dGhpcy5pbml0U2FtcGxlcjJEKGEpKX0sYi5QaXhpU2hhZGVyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5nbC5kZWxldGVQcm9ncmFtKHRoaXMucHJvZ3JhbSksdGhpcy51bmlmb3Jtcz1udWxsLHRoaXMuZ2w9bnVsbCx0aGlzLmF0dHJpYnV0ZXM9bnVsbH0sYi5QaXhpU2hhZGVyLmRlZmF1bHRWZXJ0ZXhTcmM9W1wiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1wiLFwiYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcIixcImF0dHJpYnV0ZSB2ZWMyIGFDb2xvcjtcIixcInVuaWZvcm0gdmVjMiBwcm9qZWN0aW9uVmVjdG9yO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldFZlY3RvcjtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcImNvbnN0IHZlYzIgY2VudGVyID0gdmVjMigtMS4wLCAxLjApO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNCggKChhVmVydGV4UG9zaXRpb24gKyBvZmZzZXRWZWN0b3IpIC8gcHJvamVjdGlvblZlY3RvcikgKyBjZW50ZXIgLCAwLjAsIDEuMCk7XCIsXCIgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcIixcIiAgIHZlYzMgY29sb3IgPSBtb2QodmVjMyhhQ29sb3IueS82NTUzNi4wLCBhQ29sb3IueS8yNTYuMCwgYUNvbG9yLnkpLCAyNTYuMCkgLyAyNTYuMDtcIixcIiAgIHZDb2xvciA9IHZlYzQoY29sb3IgKiBhQ29sb3IueCwgYUNvbG9yLngpO1wiLFwifVwiXSxiLlBpeGlGYXN0U2hhZGVyPWZ1bmN0aW9uKGEpe3RoaXMuX1VJRD1iLl9VSUQrKyx0aGlzLmdsPWEsdGhpcy5wcm9ncmFtPW51bGwsdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbG93cCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyBmbG9hdCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogdkNvbG9yIDtcIixcIn1cIl0sdGhpcy52ZXJ0ZXhTcmM9W1wiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1wiLFwiYXR0cmlidXRlIHZlYzIgYVBvc2l0aW9uQ29vcmQ7XCIsXCJhdHRyaWJ1dGUgdmVjMiBhU2NhbGU7XCIsXCJhdHRyaWJ1dGUgZmxvYXQgYVJvdGF0aW9uO1wiLFwiYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcIixcImF0dHJpYnV0ZSBmbG9hdCBhQ29sb3I7XCIsXCJ1bmlmb3JtIHZlYzIgcHJvamVjdGlvblZlY3RvcjtcIixcInVuaWZvcm0gdmVjMiBvZmZzZXRWZWN0b3I7XCIsXCJ1bmlmb3JtIG1hdDMgdU1hdHJpeDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyBmbG9hdCB2Q29sb3I7XCIsXCJjb25zdCB2ZWMyIGNlbnRlciA9IHZlYzIoLTEuMCwgMS4wKTtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMyIHY7XCIsXCIgICB2ZWMyIHN2ID0gYVZlcnRleFBvc2l0aW9uICogYVNjYWxlO1wiLFwiICAgdi54ID0gKHN2LngpICogY29zKGFSb3RhdGlvbikgLSAoc3YueSkgKiBzaW4oYVJvdGF0aW9uKTtcIixcIiAgIHYueSA9IChzdi54KSAqIHNpbihhUm90YXRpb24pICsgKHN2LnkpICogY29zKGFSb3RhdGlvbik7XCIsXCIgICB2ID0gKCB1TWF0cml4ICogdmVjMyh2ICsgYVBvc2l0aW9uQ29vcmQgLCAxLjApICkueHkgO1wiLFwiICAgZ2xfUG9zaXRpb24gPSB2ZWM0KCAoIHYgLyBwcm9qZWN0aW9uVmVjdG9yKSArIGNlbnRlciAsIDAuMCwgMS4wKTtcIixcIiAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1wiLFwiICAgdkNvbG9yID0gYUNvbG9yO1wiLFwifVwiXSx0aGlzLnRleHR1cmVDb3VudD0wLHRoaXMuaW5pdCgpfSxiLlBpeGlGYXN0U2hhZGVyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPWIuY29tcGlsZVByb2dyYW0oYSx0aGlzLnZlcnRleFNyYyx0aGlzLmZyYWdtZW50U3JjKTthLnVzZVByb2dyYW0oYyksdGhpcy51U2FtcGxlcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidVNhbXBsZXJcIiksdGhpcy5wcm9qZWN0aW9uVmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJwcm9qZWN0aW9uVmVjdG9yXCIpLHRoaXMub2Zmc2V0VmVjdG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJvZmZzZXRWZWN0b3JcIiksdGhpcy5kaW1lbnNpb25zPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJkaW1lbnNpb25zXCIpLHRoaXMudU1hdHJpeD1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidU1hdHJpeFwiKSx0aGlzLmFWZXJ0ZXhQb3NpdGlvbj1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVmVydGV4UG9zaXRpb25cIiksdGhpcy5hUG9zaXRpb25Db29yZD1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhUG9zaXRpb25Db29yZFwiKSx0aGlzLmFTY2FsZT1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhU2NhbGVcIiksdGhpcy5hUm90YXRpb249YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYVJvdGF0aW9uXCIpLHRoaXMuYVRleHR1cmVDb29yZD1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVGV4dHVyZUNvb3JkXCIpLHRoaXMuY29sb3JBdHRyaWJ1dGU9YS5nZXRBdHRyaWJMb2NhdGlvbihjLFwiYUNvbG9yXCIpLC0xPT09dGhpcy5jb2xvckF0dHJpYnV0ZSYmKHRoaXMuY29sb3JBdHRyaWJ1dGU9MiksdGhpcy5hdHRyaWJ1dGVzPVt0aGlzLmFWZXJ0ZXhQb3NpdGlvbix0aGlzLmFQb3NpdGlvbkNvb3JkLHRoaXMuYVNjYWxlLHRoaXMuYVJvdGF0aW9uLHRoaXMuYVRleHR1cmVDb29yZCx0aGlzLmNvbG9yQXR0cmlidXRlXSx0aGlzLnByb2dyYW09Y30sYi5QaXhpRmFzdFNoYWRlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLnByb2dyYW0pLHRoaXMudW5pZm9ybXM9bnVsbCx0aGlzLmdsPW51bGwsdGhpcy5hdHRyaWJ1dGVzPW51bGx9LGIuU3RyaXBTaGFkZXI9ZnVuY3Rpb24oYSl7dGhpcy5fVUlEPWIuX1VJRCsrLHRoaXMuZ2w9YSx0aGlzLnByb2dyYW09bnVsbCx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ1bmlmb3JtIGZsb2F0IGFscGhhO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55KSk7XCIsXCJ9XCJdLHRoaXMudmVydGV4U3JjPVtcImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcIixcImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XCIsXCJ1bmlmb3JtIG1hdDMgdHJhbnNsYXRpb25NYXRyaXg7XCIsXCJ1bmlmb3JtIHZlYzIgcHJvamVjdGlvblZlY3RvcjtcIixcInVuaWZvcm0gdmVjMiBvZmZzZXRWZWN0b3I7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMzIHYgPSB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uICwgMS4wKTtcIixcIiAgIHYgLT0gb2Zmc2V0VmVjdG9yLnh5eDtcIixcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNCggdi54IC8gcHJvamVjdGlvblZlY3Rvci54IC0xLjAsIHYueSAvIC1wcm9qZWN0aW9uVmVjdG9yLnkgKyAxLjAgLCAwLjAsIDEuMCk7XCIsXCIgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcIixcIn1cIl0sdGhpcy5pbml0KCl9LGIuU3RyaXBTaGFkZXIucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsLGM9Yi5jb21waWxlUHJvZ3JhbShhLHRoaXMudmVydGV4U3JjLHRoaXMuZnJhZ21lbnRTcmMpO2EudXNlUHJvZ3JhbShjKSx0aGlzLnVTYW1wbGVyPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJ1U2FtcGxlclwiKSx0aGlzLnByb2plY3Rpb25WZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInByb2plY3Rpb25WZWN0b3JcIiksdGhpcy5vZmZzZXRWZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcIm9mZnNldFZlY3RvclwiKSx0aGlzLmNvbG9yQXR0cmlidXRlPWEuZ2V0QXR0cmliTG9jYXRpb24oYyxcImFDb2xvclwiKSx0aGlzLmFWZXJ0ZXhQb3NpdGlvbj1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVmVydGV4UG9zaXRpb25cIiksdGhpcy5hVGV4dHVyZUNvb3JkPWEuZ2V0QXR0cmliTG9jYXRpb24oYyxcImFUZXh0dXJlQ29vcmRcIiksdGhpcy5hdHRyaWJ1dGVzPVt0aGlzLmFWZXJ0ZXhQb3NpdGlvbix0aGlzLmFUZXh0dXJlQ29vcmRdLHRoaXMudHJhbnNsYXRpb25NYXRyaXg9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInRyYW5zbGF0aW9uTWF0cml4XCIpLHRoaXMuYWxwaGE9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcImFscGhhXCIpLHRoaXMucHJvZ3JhbT1jfSxiLlByaW1pdGl2ZVNoYWRlcj1mdW5jdGlvbihhKXt0aGlzLl9VSUQ9Yi5fVUlEKyssdGhpcy5nbD1hLHRoaXMucHJvZ3JhbT1udWxsLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHZDb2xvcjtcIixcIn1cIl0sdGhpcy52ZXJ0ZXhTcmM9W1wiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1wiLFwiYXR0cmlidXRlIHZlYzQgYUNvbG9yO1wiLFwidW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1wiLFwidW5pZm9ybSB2ZWMyIHByb2plY3Rpb25WZWN0b3I7XCIsXCJ1bmlmb3JtIHZlYzIgb2Zmc2V0VmVjdG9yO1wiLFwidW5pZm9ybSBmbG9hdCBhbHBoYTtcIixcInVuaWZvcm0gdmVjMyB0aW50O1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMzIHYgPSB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uICwgMS4wKTtcIixcIiAgIHYgLT0gb2Zmc2V0VmVjdG9yLnh5eDtcIixcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNCggdi54IC8gcHJvamVjdGlvblZlY3Rvci54IC0xLjAsIHYueSAvIC1wcm9qZWN0aW9uVmVjdG9yLnkgKyAxLjAgLCAwLjAsIDEuMCk7XCIsXCIgICB2Q29sb3IgPSBhQ29sb3IgKiB2ZWM0KHRpbnQgKiBhbHBoYSwgYWxwaGEpO1wiLFwifVwiXSx0aGlzLmluaXQoKX0sYi5QcmltaXRpdmVTaGFkZXIucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsLGM9Yi5jb21waWxlUHJvZ3JhbShhLHRoaXMudmVydGV4U3JjLHRoaXMuZnJhZ21lbnRTcmMpO2EudXNlUHJvZ3JhbShjKSx0aGlzLnByb2plY3Rpb25WZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInByb2plY3Rpb25WZWN0b3JcIiksdGhpcy5vZmZzZXRWZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcIm9mZnNldFZlY3RvclwiKSx0aGlzLnRpbnRDb2xvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidGludFwiKSx0aGlzLmFWZXJ0ZXhQb3NpdGlvbj1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVmVydGV4UG9zaXRpb25cIiksdGhpcy5jb2xvckF0dHJpYnV0ZT1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhQ29sb3JcIiksdGhpcy5hdHRyaWJ1dGVzPVt0aGlzLmFWZXJ0ZXhQb3NpdGlvbix0aGlzLmNvbG9yQXR0cmlidXRlXSx0aGlzLnRyYW5zbGF0aW9uTWF0cml4PWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJ0cmFuc2xhdGlvbk1hdHJpeFwiKSx0aGlzLmFscGhhPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJhbHBoYVwiKSx0aGlzLnByb2dyYW09Y30sYi5QcmltaXRpdmVTaGFkZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmdsLmRlbGV0ZVByb2dyYW0odGhpcy5wcm9ncmFtKSx0aGlzLnVuaWZvcm1zPW51bGwsdGhpcy5nbD1udWxsLHRoaXMuYXR0cmlidXRlPW51bGx9LGIuQ29tcGxleFByaW1pdGl2ZVNoYWRlcj1mdW5jdGlvbihhKXt0aGlzLl9VSUQ9Yi5fVUlEKyssdGhpcy5nbD1hLHRoaXMucHJvZ3JhbT1udWxsLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHZDb2xvcjtcIixcIn1cIl0sdGhpcy52ZXJ0ZXhTcmM9W1wiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1wiLFwidW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1wiLFwidW5pZm9ybSB2ZWMyIHByb2plY3Rpb25WZWN0b3I7XCIsXCJ1bmlmb3JtIHZlYzIgb2Zmc2V0VmVjdG9yO1wiLFwidW5pZm9ybSB2ZWMzIHRpbnQ7XCIsXCJ1bmlmb3JtIGZsb2F0IGFscGhhO1wiLFwidW5pZm9ybSB2ZWMzIGNvbG9yO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMzIHYgPSB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uICwgMS4wKTtcIixcIiAgIHYgLT0gb2Zmc2V0VmVjdG9yLnh5eDtcIixcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNCggdi54IC8gcHJvamVjdGlvblZlY3Rvci54IC0xLjAsIHYueSAvIC1wcm9qZWN0aW9uVmVjdG9yLnkgKyAxLjAgLCAwLjAsIDEuMCk7XCIsXCIgICB2Q29sb3IgPSB2ZWM0KGNvbG9yICogYWxwaGEgKiB0aW50LCBhbHBoYSk7XCIsXCJ9XCJdLHRoaXMuaW5pdCgpfSxiLkNvbXBsZXhQcmltaXRpdmVTaGFkZXIucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsLGM9Yi5jb21waWxlUHJvZ3JhbShhLHRoaXMudmVydGV4U3JjLHRoaXMuZnJhZ21lbnRTcmMpO2EudXNlUHJvZ3JhbShjKSx0aGlzLnByb2plY3Rpb25WZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcInByb2plY3Rpb25WZWN0b3JcIiksdGhpcy5vZmZzZXRWZWN0b3I9YS5nZXRVbmlmb3JtTG9jYXRpb24oYyxcIm9mZnNldFZlY3RvclwiKSx0aGlzLnRpbnRDb2xvcj1hLmdldFVuaWZvcm1Mb2NhdGlvbihjLFwidGludFwiKSx0aGlzLmNvbG9yPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJjb2xvclwiKSx0aGlzLmFWZXJ0ZXhQb3NpdGlvbj1hLmdldEF0dHJpYkxvY2F0aW9uKGMsXCJhVmVydGV4UG9zaXRpb25cIiksdGhpcy5hdHRyaWJ1dGVzPVt0aGlzLmFWZXJ0ZXhQb3NpdGlvbix0aGlzLmNvbG9yQXR0cmlidXRlXSx0aGlzLnRyYW5zbGF0aW9uTWF0cml4PWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJ0cmFuc2xhdGlvbk1hdHJpeFwiKSx0aGlzLmFscGhhPWEuZ2V0VW5pZm9ybUxvY2F0aW9uKGMsXCJhbHBoYVwiKSx0aGlzLnByb2dyYW09Y30sYi5Db21wbGV4UHJpbWl0aXZlU2hhZGVyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5nbC5kZWxldGVQcm9ncmFtKHRoaXMucHJvZ3JhbSksdGhpcy51bmlmb3Jtcz1udWxsLHRoaXMuZ2w9bnVsbCx0aGlzLmF0dHJpYnV0ZT1udWxsfSxiLldlYkdMR3JhcGhpY3M9ZnVuY3Rpb24oKXt9LGIuV2ViR0xHcmFwaGljcy5yZW5kZXJHcmFwaGljcz1mdW5jdGlvbihhLGMpe3ZhciBkLGU9Yy5nbCxmPWMucHJvamVjdGlvbixnPWMub2Zmc2V0LGg9Yy5zaGFkZXJNYW5hZ2VyLnByaW1pdGl2ZVNoYWRlcjthLmRpcnR5JiZiLldlYkdMR3JhcGhpY3MudXBkYXRlR3JhcGhpY3MoYSxlKTtmb3IodmFyIGk9YS5fd2ViR0xbZS5pZF0saj0wO2o8aS5kYXRhLmxlbmd0aDtqKyspMT09PWkuZGF0YVtqXS5tb2RlPyhkPWkuZGF0YVtqXSxjLnN0ZW5jaWxNYW5hZ2VyLnB1c2hTdGVuY2lsKGEsZCxjKSxlLmRyYXdFbGVtZW50cyhlLlRSSUFOR0xFX0ZBTiw0LGUuVU5TSUdORURfU0hPUlQsMiooZC5pbmRpY2VzLmxlbmd0aC00KSksYy5zdGVuY2lsTWFuYWdlci5wb3BTdGVuY2lsKGEsZCxjKSx0aGlzLmxhc3Q9ZC5tb2RlKTooZD1pLmRhdGFbal0sYy5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihoKSxoPWMuc2hhZGVyTWFuYWdlci5wcmltaXRpdmVTaGFkZXIsZS51bmlmb3JtTWF0cml4M2Z2KGgudHJhbnNsYXRpb25NYXRyaXgsITEsYS53b3JsZFRyYW5zZm9ybS50b0FycmF5KCEwKSksZS51bmlmb3JtMmYoaC5wcm9qZWN0aW9uVmVjdG9yLGYueCwtZi55KSxlLnVuaWZvcm0yZihoLm9mZnNldFZlY3RvciwtZy54LC1nLnkpLGUudW5pZm9ybTNmdihoLnRpbnRDb2xvcixiLmhleDJyZ2IoYS50aW50KSksZS51bmlmb3JtMWYoaC5hbHBoYSxhLndvcmxkQWxwaGEpLGUuYmluZEJ1ZmZlcihlLkFSUkFZX0JVRkZFUixkLmJ1ZmZlciksZS52ZXJ0ZXhBdHRyaWJQb2ludGVyKGguYVZlcnRleFBvc2l0aW9uLDIsZS5GTE9BVCwhMSwyNCwwKSxlLnZlcnRleEF0dHJpYlBvaW50ZXIoaC5jb2xvckF0dHJpYnV0ZSw0LGUuRkxPQVQsITEsMjQsOCksZS5iaW5kQnVmZmVyKGUuRUxFTUVOVF9BUlJBWV9CVUZGRVIsZC5pbmRleEJ1ZmZlciksZS5kcmF3RWxlbWVudHMoZS5UUklBTkdMRV9TVFJJUCxkLmluZGljZXMubGVuZ3RoLGUuVU5TSUdORURfU0hPUlQsMCkpfSxiLldlYkdMR3JhcGhpY3MudXBkYXRlR3JhcGhpY3M9ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLl93ZWJHTFtjLmlkXTtkfHwoZD1hLl93ZWJHTFtjLmlkXT17bGFzdEluZGV4OjAsZGF0YTpbXSxnbDpjfSksYS5kaXJ0eT0hMTt2YXIgZTtpZihhLmNsZWFyRGlydHkpe2ZvcihhLmNsZWFyRGlydHk9ITEsZT0wO2U8ZC5kYXRhLmxlbmd0aDtlKyspe3ZhciBmPWQuZGF0YVtlXTtmLnJlc2V0KCksYi5XZWJHTEdyYXBoaWNzLmdyYXBoaWNzRGF0YVBvb2wucHVzaChmKX1kLmRhdGE9W10sZC5sYXN0SW5kZXg9MH12YXIgZztmb3IoZT1kLmxhc3RJbmRleDtlPGEuZ3JhcGhpY3NEYXRhLmxlbmd0aDtlKyspe3ZhciBoPWEuZ3JhcGhpY3NEYXRhW2VdO2gudHlwZT09PWIuR3JhcGhpY3MuUE9MWT8oaC5maWxsJiZoLnBvaW50cy5sZW5ndGg+NiYmKGgucG9pbnRzLmxlbmd0aD4xMD8oZz1iLldlYkdMR3JhcGhpY3Muc3dpdGNoTW9kZShkLDEpLGIuV2ViR0xHcmFwaGljcy5idWlsZENvbXBsZXhQb2x5KGgsZykpOihnPWIuV2ViR0xHcmFwaGljcy5zd2l0Y2hNb2RlKGQsMCksYi5XZWJHTEdyYXBoaWNzLmJ1aWxkUG9seShoLGcpKSksaC5saW5lV2lkdGg+MCYmKGc9Yi5XZWJHTEdyYXBoaWNzLnN3aXRjaE1vZGUoZCwwKSxiLldlYkdMR3JhcGhpY3MuYnVpbGRMaW5lKGgsZykpKTooZz1iLldlYkdMR3JhcGhpY3Muc3dpdGNoTW9kZShkLDApLGgudHlwZT09PWIuR3JhcGhpY3MuUkVDVD9iLldlYkdMR3JhcGhpY3MuYnVpbGRSZWN0YW5nbGUoaCxnKTpoLnR5cGU9PT1iLkdyYXBoaWNzLkNJUkN8fGgudHlwZT09PWIuR3JhcGhpY3MuRUxJUD9iLldlYkdMR3JhcGhpY3MuYnVpbGRDaXJjbGUoaCxnKTpoLnR5cGU9PT1iLkdyYXBoaWNzLlJSRUMmJmIuV2ViR0xHcmFwaGljcy5idWlsZFJvdW5kZWRSZWN0YW5nbGUoaCxnKSksZC5sYXN0SW5kZXgrK31mb3IoZT0wO2U8ZC5kYXRhLmxlbmd0aDtlKyspZz1kLmRhdGFbZV0sZy5kaXJ0eSYmZy51cGxvYWQoKX0sYi5XZWJHTEdyYXBoaWNzLnN3aXRjaE1vZGU9ZnVuY3Rpb24oYSxjKXt2YXIgZDtyZXR1cm4gYS5kYXRhLmxlbmd0aD8oZD1hLmRhdGFbYS5kYXRhLmxlbmd0aC0xXSwoZC5tb2RlIT09Y3x8MT09PWMpJiYoZD1iLldlYkdMR3JhcGhpY3MuZ3JhcGhpY3NEYXRhUG9vbC5wb3AoKXx8bmV3IGIuV2ViR0xHcmFwaGljc0RhdGEoYS5nbCksZC5tb2RlPWMsYS5kYXRhLnB1c2goZCkpKTooZD1iLldlYkdMR3JhcGhpY3MuZ3JhcGhpY3NEYXRhUG9vbC5wb3AoKXx8bmV3IGIuV2ViR0xHcmFwaGljc0RhdGEoYS5nbCksZC5tb2RlPWMsYS5kYXRhLnB1c2goZCkpLGQuZGlydHk9ITAsZH0sYi5XZWJHTEdyYXBoaWNzLmJ1aWxkUmVjdGFuZ2xlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5wb2ludHMsZT1kWzBdLGY9ZFsxXSxnPWRbMl0saD1kWzNdO2lmKGEuZmlsbCl7dmFyIGk9Yi5oZXgycmdiKGEuZmlsbENvbG9yKSxqPWEuZmlsbEFscGhhLGs9aVswXSpqLGw9aVsxXSpqLG09aVsyXSpqLG49Yy5wb2ludHMsbz1jLmluZGljZXMscD1uLmxlbmd0aC82O24ucHVzaChlLGYpLG4ucHVzaChrLGwsbSxqKSxuLnB1c2goZStnLGYpLG4ucHVzaChrLGwsbSxqKSxuLnB1c2goZSxmK2gpLG4ucHVzaChrLGwsbSxqKSxuLnB1c2goZStnLGYraCksbi5wdXNoKGssbCxtLGopLG8ucHVzaChwLHAscCsxLHArMixwKzMscCszKX1pZihhLmxpbmVXaWR0aCl7dmFyIHE9YS5wb2ludHM7YS5wb2ludHM9W2UsZixlK2csZixlK2csZitoLGUsZitoLGUsZl0sYi5XZWJHTEdyYXBoaWNzLmJ1aWxkTGluZShhLGMpLGEucG9pbnRzPXF9fSxiLldlYkdMR3JhcGhpY3MuYnVpbGRSb3VuZGVkUmVjdGFuZ2xlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5wb2ludHMsZT1kWzBdLGY9ZFsxXSxnPWRbMl0saD1kWzNdLGk9ZFs0XSxqPVtdO2lmKGoucHVzaChlLGYraSksaj1qLmNvbmNhdChiLldlYkdMR3JhcGhpY3MucXVhZHJhdGljQmV6aWVyQ3VydmUoZSxmK2gtaSxlLGYraCxlK2ksZitoKSksaj1qLmNvbmNhdChiLldlYkdMR3JhcGhpY3MucXVhZHJhdGljQmV6aWVyQ3VydmUoZStnLWksZitoLGUrZyxmK2gsZStnLGYraC1pKSksaj1qLmNvbmNhdChiLldlYkdMR3JhcGhpY3MucXVhZHJhdGljQmV6aWVyQ3VydmUoZStnLGYraSxlK2csZixlK2ctaSxmKSksaj1qLmNvbmNhdChiLldlYkdMR3JhcGhpY3MucXVhZHJhdGljQmV6aWVyQ3VydmUoZStpLGYsZSxmLGUsZitpKSksYS5maWxsKXt2YXIgaz1iLmhleDJyZ2IoYS5maWxsQ29sb3IpLGw9YS5maWxsQWxwaGEsbT1rWzBdKmwsbj1rWzFdKmwsbz1rWzJdKmwscD1jLnBvaW50cyxxPWMuaW5kaWNlcyxyPXAubGVuZ3RoLzYscz1iLlBvbHlLLlRyaWFuZ3VsYXRlKGopLHQ9MDtmb3IodD0wO3Q8cy5sZW5ndGg7dCs9MylxLnB1c2goc1t0XStyKSxxLnB1c2goc1t0XStyKSxxLnB1c2goc1t0KzFdK3IpLHEucHVzaChzW3QrMl0rcikscS5wdXNoKHNbdCsyXStyKTtmb3IodD0wO3Q8ai5sZW5ndGg7dCsrKXAucHVzaChqW3RdLGpbKyt0XSxtLG4sbyxsKX1pZihhLmxpbmVXaWR0aCl7dmFyIHU9YS5wb2ludHM7YS5wb2ludHM9aixiLldlYkdMR3JhcGhpY3MuYnVpbGRMaW5lKGEsYyksYS5wb2ludHM9dX19LGIuV2ViR0xHcmFwaGljcy5xdWFkcmF0aWNCZXppZXJDdXJ2ZT1mdW5jdGlvbihhLGIsYyxkLGUsZil7ZnVuY3Rpb24gZyhhLGIsYyl7dmFyIGQ9Yi1hO3JldHVybiBhK2QqY31mb3IodmFyIGgsaSxqLGssbCxtLG49MjAsbz1bXSxwPTAscT0wO24+PXE7cSsrKXA9cS9uLGg9ZyhhLGMscCksaT1nKGIsZCxwKSxqPWcoYyxlLHApLGs9ZyhkLGYscCksbD1nKGgsaixwKSxtPWcoaSxrLHApLG8ucHVzaChsLG0pO3JldHVybiBvfSxiLldlYkdMR3JhcGhpY3MuYnVpbGRDaXJjbGU9ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLnBvaW50cyxlPWRbMF0sZj1kWzFdLGc9ZFsyXSxoPWRbM10saT00MCxqPTIqTWF0aC5QSS9pLGs9MDtpZihhLmZpbGwpe3ZhciBsPWIuaGV4MnJnYihhLmZpbGxDb2xvciksbT1hLmZpbGxBbHBoYSxuPWxbMF0qbSxvPWxbMV0qbSxwPWxbMl0qbSxxPWMucG9pbnRzLHI9Yy5pbmRpY2VzLHM9cS5sZW5ndGgvNjtmb3Ioci5wdXNoKHMpLGs9MDtpKzE+aztrKyspcS5wdXNoKGUsZixuLG8scCxtKSxxLnB1c2goZStNYXRoLnNpbihqKmspKmcsZitNYXRoLmNvcyhqKmspKmgsbixvLHAsbSksci5wdXNoKHMrKyxzKyspO3IucHVzaChzLTEpfWlmKGEubGluZVdpZHRoKXt2YXIgdD1hLnBvaW50cztmb3IoYS5wb2ludHM9W10saz0wO2krMT5rO2srKylhLnBvaW50cy5wdXNoKGUrTWF0aC5zaW4oaiprKSpnLGYrTWF0aC5jb3MoaiprKSpoKTtiLldlYkdMR3JhcGhpY3MuYnVpbGRMaW5lKGEsYyksYS5wb2ludHM9dH19LGIuV2ViR0xHcmFwaGljcy5idWlsZExpbmU9ZnVuY3Rpb24oYSxjKXt2YXIgZD0wLGU9YS5wb2ludHM7aWYoMCE9PWUubGVuZ3RoKXtpZihhLmxpbmVXaWR0aCUyKWZvcihkPTA7ZDxlLmxlbmd0aDtkKyspZVtkXSs9LjU7dmFyIGY9bmV3IGIuUG9pbnQoZVswXSxlWzFdKSxnPW5ldyBiLlBvaW50KGVbZS5sZW5ndGgtMl0sZVtlLmxlbmd0aC0xXSk7aWYoZi54PT09Zy54JiZmLnk9PT1nLnkpe2U9ZS5zbGljZSgpLGUucG9wKCksZS5wb3AoKSxnPW5ldyBiLlBvaW50KGVbZS5sZW5ndGgtMl0sZVtlLmxlbmd0aC0xXSk7dmFyIGg9Zy54Ky41KihmLngtZy54KSxpPWcueSsuNSooZi55LWcueSk7ZS51bnNoaWZ0KGgsaSksZS5wdXNoKGgsaSl9dmFyIGosayxsLG0sbixvLHAscSxyLHMsdCx1LHYsdyx4LHkseixBLEIsQyxELEUsRixHPWMucG9pbnRzLEg9Yy5pbmRpY2VzLEk9ZS5sZW5ndGgvMixKPWUubGVuZ3RoLEs9Ry5sZW5ndGgvNixMPWEubGluZVdpZHRoLzIsTT1iLmhleDJyZ2IoYS5saW5lQ29sb3IpLE49YS5saW5lQWxwaGEsTz1NWzBdKk4sUD1NWzFdKk4sUT1NWzJdKk47Zm9yKGw9ZVswXSxtPWVbMV0sbj1lWzJdLG89ZVszXSxyPS0obS1vKSxzPWwtbixGPU1hdGguc3FydChyKnIrcypzKSxyLz1GLHMvPUYscio9TCxzKj1MLEcucHVzaChsLXIsbS1zLE8sUCxRLE4pLEcucHVzaChsK3IsbStzLE8sUCxRLE4pLGQ9MTtJLTE+ZDtkKyspbD1lWzIqKGQtMSldLG09ZVsyKihkLTEpKzFdLG49ZVsyKmRdLG89ZVsyKmQrMV0scD1lWzIqKGQrMSldLHE9ZVsyKihkKzEpKzFdLHI9LShtLW8pLHM9bC1uLEY9TWF0aC5zcXJ0KHIqcitzKnMpLHIvPUYscy89RixyKj1MLHMqPUwsdD0tKG8tcSksdT1uLXAsRj1NYXRoLnNxcnQodCp0K3UqdSksdC89Rix1Lz1GLHQqPUwsdSo9TCx4PS1zK20tKC1zK28pLHk9LXIrbi0oLXIrbCksej0oLXIrbCkqKC1zK28pLSgtcituKSooLXMrbSksQT0tdStxLSgtdStvKSxCPS10K24tKC10K3ApLEM9KC10K3ApKigtdStvKS0oLXQrbikqKC11K3EpLEQ9eCpCLUEqeSxNYXRoLmFicyhEKTwuMT8oRCs9MTAuMSxHLnB1c2gobi1yLG8tcyxPLFAsUSxOKSxHLnB1c2gobityLG8rcyxPLFAsUSxOKSk6KGo9KHkqQy1CKnopL0Qsaz0oQSp6LXgqQykvRCxFPShqLW4pKihqLW4pKyhrLW8pKyhrLW8pLEU+MTk2MDA/KHY9ci10LHc9cy11LEY9TWF0aC5zcXJ0KHYqdit3KncpLHYvPUYsdy89Rix2Kj1MLHcqPUwsRy5wdXNoKG4tdixvLXcpLEcucHVzaChPLFAsUSxOKSxHLnB1c2gobit2LG8rdyksRy5wdXNoKE8sUCxRLE4pLEcucHVzaChuLXYsby13KSxHLnB1c2goTyxQLFEsTiksSisrKTooRy5wdXNoKGosayksRy5wdXNoKE8sUCxRLE4pLEcucHVzaChuLShqLW4pLG8tKGstbykpLEcucHVzaChPLFAsUSxOKSkpO2ZvcihsPWVbMiooSS0yKV0sbT1lWzIqKEktMikrMV0sbj1lWzIqKEktMSldLG89ZVsyKihJLTEpKzFdLHI9LShtLW8pLHM9bC1uLEY9TWF0aC5zcXJ0KHIqcitzKnMpLHIvPUYscy89RixyKj1MLHMqPUwsRy5wdXNoKG4tcixvLXMpLEcucHVzaChPLFAsUSxOKSxHLnB1c2gobityLG8rcyksRy5wdXNoKE8sUCxRLE4pLEgucHVzaChLKSxkPTA7Sj5kO2QrKylILnB1c2goSysrKTtILnB1c2goSy0xKX19LGIuV2ViR0xHcmFwaGljcy5idWlsZENvbXBsZXhQb2x5PWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5wb2ludHMuc2xpY2UoKTtpZighKGQubGVuZ3RoPDYpKXt2YXIgZT1jLmluZGljZXM7Yy5wb2ludHM9ZCxjLmFscGhhPWEuZmlsbEFscGhhLGMuY29sb3I9Yi5oZXgycmdiKGEuZmlsbENvbG9yKTtmb3IodmFyIGYsZyxoPTEvMCxpPS0xLzAsaj0xLzAsaz0tMS8wLGw9MDtsPGQubGVuZ3RoO2wrPTIpZj1kW2xdLGc9ZFtsKzFdLGg9aD5mP2Y6aCxpPWY+aT9mOmksaj1qPmc/ZzpqLGs9Zz5rP2c6aztkLnB1c2goaCxqLGksaixpLGssaCxrKTt2YXIgbT1kLmxlbmd0aC8yO2ZvcihsPTA7bT5sO2wrKyllLnB1c2gobCl9fSxiLldlYkdMR3JhcGhpY3MuYnVpbGRQb2x5PWZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5wb2ludHM7aWYoIShkLmxlbmd0aDw2KSl7dmFyIGU9Yy5wb2ludHMsZj1jLmluZGljZXMsZz1kLmxlbmd0aC8yLGg9Yi5oZXgycmdiKGEuZmlsbENvbG9yKSxpPWEuZmlsbEFscGhhLGo9aFswXSppLGs9aFsxXSppLGw9aFsyXSppLG09Yi5Qb2x5Sy5Ucmlhbmd1bGF0ZShkKSxuPWUubGVuZ3RoLzYsbz0wO2ZvcihvPTA7bzxtLmxlbmd0aDtvKz0zKWYucHVzaChtW29dK24pLGYucHVzaChtW29dK24pLGYucHVzaChtW28rMV0rbiksZi5wdXNoKG1bbysyXStuKSxmLnB1c2gobVtvKzJdK24pO2ZvcihvPTA7Zz5vO28rKyllLnB1c2goZFsyKm9dLGRbMipvKzFdLGosayxsLGkpfX0sYi5XZWJHTEdyYXBoaWNzLmdyYXBoaWNzRGF0YVBvb2w9W10sYi5XZWJHTEdyYXBoaWNzRGF0YT1mdW5jdGlvbihhKXt0aGlzLmdsPWEsdGhpcy5jb2xvcj1bMCwwLDBdLHRoaXMucG9pbnRzPVtdLHRoaXMuaW5kaWNlcz1bXSx0aGlzLmxhc3RJbmRleD0wLHRoaXMuYnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksdGhpcy5pbmRleEJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLHRoaXMubW9kZT0xLHRoaXMuYWxwaGE9MSx0aGlzLmRpcnR5PSEwfSxiLldlYkdMR3JhcGhpY3NEYXRhLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMucG9pbnRzPVtdLHRoaXMuaW5kaWNlcz1bXSx0aGlzLmxhc3RJbmRleD0wfSxiLldlYkdMR3JhcGhpY3NEYXRhLnByb3RvdHlwZS51cGxvYWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO3RoaXMuZ2xQb2ludHM9bmV3IEZsb2F0MzJBcnJheSh0aGlzLnBvaW50cyksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMuYnVmZmVyKSxhLmJ1ZmZlckRhdGEoYS5BUlJBWV9CVUZGRVIsdGhpcy5nbFBvaW50cyxhLlNUQVRJQ19EUkFXKSx0aGlzLmdsSW5kaWNpZXM9bmV3IFVpbnQxNkFycmF5KHRoaXMuaW5kaWNlcyksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5nbEluZGljaWVzLGEuU1RBVElDX0RSQVcpLHRoaXMuZGlydHk9ITF9LGIuZ2xDb250ZXh0cz1bXSxiLldlYkdMUmVuZGVyZXI9ZnVuY3Rpb24oYSxjLGQsZSxmLGcpe2IuZGVmYXVsdFJlbmRlcmVyfHwoYi5zYXlIZWxsbyhcIndlYkdMXCIpLGIuZGVmYXVsdFJlbmRlcmVyPXRoaXMpLHRoaXMudHlwZT1iLldFQkdMX1JFTkRFUkVSLHRoaXMudHJhbnNwYXJlbnQ9ISFlLHRoaXMucHJlc2VydmVEcmF3aW5nQnVmZmVyPWcsdGhpcy53aWR0aD1hfHw4MDAsdGhpcy5oZWlnaHQ9Y3x8NjAwLHRoaXMudmlldz1kfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMudmlldy53aWR0aD10aGlzLndpZHRoLHRoaXMudmlldy5oZWlnaHQ9dGhpcy5oZWlnaHQsdGhpcy5jb250ZXh0TG9zdD10aGlzLmhhbmRsZUNvbnRleHRMb3N0LmJpbmQodGhpcyksdGhpcy5jb250ZXh0UmVzdG9yZWRMb3N0PXRoaXMuaGFuZGxlQ29udGV4dFJlc3RvcmVkLmJpbmQodGhpcyksdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJnbGNvbnRleHRsb3N0XCIsdGhpcy5jb250ZXh0TG9zdCwhMSksdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJnbGNvbnRleHRyZXN0b3JlZFwiLHRoaXMuY29udGV4dFJlc3RvcmVkTG9zdCwhMSksdGhpcy5vcHRpb25zPXthbHBoYTp0aGlzLnRyYW5zcGFyZW50LGFudGlhbGlhczohIWYscHJlbXVsdGlwbGllZEFscGhhOiEhZSxzdGVuY2lsOiEwLHByZXNlcnZlRHJhd2luZ0J1ZmZlcjpnfTt2YXIgaD1udWxsO2lmKFtcImV4cGVyaW1lbnRhbC13ZWJnbFwiLFwid2ViZ2xcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt0cnl7aD1ofHx0aGlzLnZpZXcuZ2V0Q29udGV4dChhLHRoaXMub3B0aW9ucyl9Y2F0Y2goYil7fX0sdGhpcyksIWgpdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgd2ViR0wuIFRyeSB1c2luZyB0aGUgY2FudmFzIHJlbmRlcmVyXCIrdGhpcyk7dGhpcy5nbD1oLHRoaXMuZ2xDb250ZXh0SWQ9aC5pZD1iLldlYkdMUmVuZGVyZXIuZ2xDb250ZXh0SWQrKyxiLmdsQ29udGV4dHNbdGhpcy5nbENvbnRleHRJZF09aCxiLmJsZW5kTW9kZXNXZWJHTHx8KGIuYmxlbmRNb2Rlc1dlYkdMPVtdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5OT1JNQUxdPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5BRERdPVtoLlNSQ19BTFBIQSxoLkRTVF9BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLk1VTFRJUExZXT1baC5EU1RfQ09MT1IsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuU0NSRUVOXT1baC5TUkNfQUxQSEEsaC5PTkVdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5PVkVSTEFZXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuREFSS0VOXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuTElHSFRFTl09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkNPTE9SX0RPREdFXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuQ09MT1JfQlVSTl09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkhBUkRfTElHSFRdPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5TT0ZUX0xJR0hUXT1baC5PTkUsaC5PTkVfTUlOVVNfU1JDX0FMUEhBXSxiLmJsZW5kTW9kZXNXZWJHTFtiLmJsZW5kTW9kZXMuRElGRkVSRU5DRV09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkVYQ0xVU0lPTl09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkhVRV09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLlNBVFVSQVRJT05dPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdLGIuYmxlbmRNb2Rlc1dlYkdMW2IuYmxlbmRNb2Rlcy5DT0xPUl09W2guT05FLGguT05FX01JTlVTX1NSQ19BTFBIQV0sYi5ibGVuZE1vZGVzV2ViR0xbYi5ibGVuZE1vZGVzLkxVTUlOT1NJVFldPVtoLk9ORSxoLk9ORV9NSU5VU19TUkNfQUxQSEFdKSx0aGlzLnByb2plY3Rpb249bmV3IGIuUG9pbnQsdGhpcy5wcm9qZWN0aW9uLng9dGhpcy53aWR0aC8yLHRoaXMucHJvamVjdGlvbi55PS10aGlzLmhlaWdodC8yLHRoaXMub2Zmc2V0PW5ldyBiLlBvaW50KDAsMCksdGhpcy5yZXNpemUodGhpcy53aWR0aCx0aGlzLmhlaWdodCksdGhpcy5jb250ZXh0TG9zdD0hMSx0aGlzLnNoYWRlck1hbmFnZXI9bmV3IGIuV2ViR0xTaGFkZXJNYW5hZ2VyKGgpLHRoaXMuc3ByaXRlQmF0Y2g9bmV3IGIuV2ViR0xTcHJpdGVCYXRjaChoKSx0aGlzLm1hc2tNYW5hZ2VyPW5ldyBiLldlYkdMTWFza01hbmFnZXIoaCksdGhpcy5maWx0ZXJNYW5hZ2VyPW5ldyBiLldlYkdMRmlsdGVyTWFuYWdlcihoLHRoaXMudHJhbnNwYXJlbnQpLHRoaXMuc3RlbmNpbE1hbmFnZXI9bmV3IGIuV2ViR0xTdGVuY2lsTWFuYWdlcihoKSx0aGlzLmJsZW5kTW9kZU1hbmFnZXI9bmV3IGIuV2ViR0xCbGVuZE1vZGVNYW5hZ2VyKGgpLHRoaXMucmVuZGVyU2Vzc2lvbj17fSx0aGlzLnJlbmRlclNlc3Npb24uZ2w9dGhpcy5nbCx0aGlzLnJlbmRlclNlc3Npb24uZHJhd0NvdW50PTAsdGhpcy5yZW5kZXJTZXNzaW9uLnNoYWRlck1hbmFnZXI9dGhpcy5zaGFkZXJNYW5hZ2VyLHRoaXMucmVuZGVyU2Vzc2lvbi5tYXNrTWFuYWdlcj10aGlzLm1hc2tNYW5hZ2VyLHRoaXMucmVuZGVyU2Vzc2lvbi5maWx0ZXJNYW5hZ2VyPXRoaXMuZmlsdGVyTWFuYWdlcix0aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlcj10aGlzLmJsZW5kTW9kZU1hbmFnZXIsdGhpcy5yZW5kZXJTZXNzaW9uLnNwcml0ZUJhdGNoPXRoaXMuc3ByaXRlQmF0Y2gsdGhpcy5yZW5kZXJTZXNzaW9uLnN0ZW5jaWxNYW5hZ2VyPXRoaXMuc3RlbmNpbE1hbmFnZXIsdGhpcy5yZW5kZXJTZXNzaW9uLnJlbmRlcmVyPXRoaXMsaC51c2VQcm9ncmFtKHRoaXMuc2hhZGVyTWFuYWdlci5kZWZhdWx0U2hhZGVyLnByb2dyYW0pLGguZGlzYWJsZShoLkRFUFRIX1RFU1QpLGguZGlzYWJsZShoLkNVTExfRkFDRSksaC5lbmFibGUoaC5CTEVORCksaC5jb2xvck1hc2soITAsITAsITAsdGhpcy50cmFuc3BhcmVudCl9LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5XZWJHTFJlbmRlcmVyLGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKGEpe2lmKCF0aGlzLmNvbnRleHRMb3N0KXt0aGlzLl9fc3RhZ2UhPT1hJiYoYS5pbnRlcmFjdGl2ZSYmYS5pbnRlcmFjdGlvbk1hbmFnZXIucmVtb3ZlRXZlbnRzKCksdGhpcy5fX3N0YWdlPWEpLGIuV2ViR0xSZW5kZXJlci51cGRhdGVUZXh0dXJlcygpLGEudXBkYXRlVHJhbnNmb3JtKCksYS5faW50ZXJhY3RpdmUmJihhLl9pbnRlcmFjdGl2ZUV2ZW50c0FkZGVkfHwoYS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZD0hMCxhLmludGVyYWN0aW9uTWFuYWdlci5zZXRUYXJnZXQodGhpcykpKTt2YXIgYz10aGlzLmdsO2Mudmlld3BvcnQoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLGMuYmluZEZyYW1lYnVmZmVyKGMuRlJBTUVCVUZGRVIsbnVsbCksdGhpcy50cmFuc3BhcmVudD9jLmNsZWFyQ29sb3IoMCwwLDAsMCk6Yy5jbGVhckNvbG9yKGEuYmFja2dyb3VuZENvbG9yU3BsaXRbMF0sYS5iYWNrZ3JvdW5kQ29sb3JTcGxpdFsxXSxhLmJhY2tncm91bmRDb2xvclNwbGl0WzJdLDEpLGMuY2xlYXIoYy5DT0xPUl9CVUZGRVJfQklUKSx0aGlzLnJlbmRlckRpc3BsYXlPYmplY3QoYSx0aGlzLnByb2plY3Rpb24pLGEuaW50ZXJhY3RpdmU/YS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZHx8KGEuX2ludGVyYWN0aXZlRXZlbnRzQWRkZWQ9ITAsYS5pbnRlcmFjdGlvbk1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMpKTphLl9pbnRlcmFjdGl2ZUV2ZW50c0FkZGVkJiYoYS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZD0hMSxhLmludGVyYWN0aW9uTWFuYWdlci5zZXRUYXJnZXQodGhpcykpfX0sYi5XZWJHTFJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJEaXNwbGF5T2JqZWN0PWZ1bmN0aW9uKGEsYyxkKXt0aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlci5zZXRCbGVuZE1vZGUoYi5ibGVuZE1vZGVzLk5PUk1BTCksdGhpcy5yZW5kZXJTZXNzaW9uLmRyYXdDb3VudD0wLHRoaXMucmVuZGVyU2Vzc2lvbi5jdXJyZW50QmxlbmRNb2RlPTk5OTksdGhpcy5yZW5kZXJTZXNzaW9uLnByb2plY3Rpb249Yyx0aGlzLnJlbmRlclNlc3Npb24ub2Zmc2V0PXRoaXMub2Zmc2V0LHRoaXMuc3ByaXRlQmF0Y2guYmVnaW4odGhpcy5yZW5kZXJTZXNzaW9uKSx0aGlzLmZpbHRlck1hbmFnZXIuYmVnaW4odGhpcy5yZW5kZXJTZXNzaW9uLGQpLGEuX3JlbmRlcldlYkdMKHRoaXMucmVuZGVyU2Vzc2lvbiksdGhpcy5zcHJpdGVCYXRjaC5lbmQoKX0sYi5XZWJHTFJlbmRlcmVyLnVwZGF0ZVRleHR1cmVzPWZ1bmN0aW9uKCl7dmFyIGE9MDtmb3IoYT0wO2E8Yi5UZXh0dXJlLmZyYW1lVXBkYXRlcy5sZW5ndGg7YSsrKWIuV2ViR0xSZW5kZXJlci51cGRhdGVUZXh0dXJlRnJhbWUoYi5UZXh0dXJlLmZyYW1lVXBkYXRlc1thXSk7Zm9yKGE9MDthPGIudGV4dHVyZXNUb0Rlc3Ryb3kubGVuZ3RoO2ErKyliLldlYkdMUmVuZGVyZXIuZGVzdHJveVRleHR1cmUoYi50ZXh0dXJlc1RvRGVzdHJveVthXSk7Yi50ZXh0dXJlc1RvVXBkYXRlLmxlbmd0aD0wLGIudGV4dHVyZXNUb0Rlc3Ryb3kubGVuZ3RoPTAsYi5UZXh0dXJlLmZyYW1lVXBkYXRlcy5sZW5ndGg9MH0sYi5XZWJHTFJlbmRlcmVyLmRlc3Ryb3lUZXh0dXJlPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1hLl9nbFRleHR1cmVzLmxlbmd0aC0xO2M+PTA7Yy0tKXt2YXIgZD1hLl9nbFRleHR1cmVzW2NdLGU9Yi5nbENvbnRleHRzW2NdO1xuZSYmZCYmZS5kZWxldGVUZXh0dXJlKGQpfWEuX2dsVGV4dHVyZXMubGVuZ3RoPTB9LGIuV2ViR0xSZW5kZXJlci51cGRhdGVUZXh0dXJlRnJhbWU9ZnVuY3Rpb24oYSl7YS5fdXBkYXRlV2ViR0x1dnMoKX0sYi5XZWJHTFJlbmRlcmVyLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oYSxiKXt0aGlzLndpZHRoPWEsdGhpcy5oZWlnaHQ9Yix0aGlzLnZpZXcud2lkdGg9YSx0aGlzLnZpZXcuaGVpZ2h0PWIsdGhpcy5nbC52aWV3cG9ydCgwLDAsdGhpcy53aWR0aCx0aGlzLmhlaWdodCksdGhpcy5wcm9qZWN0aW9uLng9dGhpcy53aWR0aC8yLHRoaXMucHJvamVjdGlvbi55PS10aGlzLmhlaWdodC8yfSxiLmNyZWF0ZVdlYkdMVGV4dHVyZT1mdW5jdGlvbihhLGMpe3JldHVybiBhLmhhc0xvYWRlZCYmKGEuX2dsVGV4dHVyZXNbYy5pZF09Yy5jcmVhdGVUZXh0dXJlKCksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsYS5fZ2xUZXh0dXJlc1tjLmlkXSksYy5waXhlbFN0b3JlaShjLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCxhLnByZW11bHRpcGxpZWRBbHBoYSksYy50ZXhJbWFnZTJEKGMuVEVYVFVSRV8yRCwwLGMuUkdCQSxjLlJHQkEsYy5VTlNJR05FRF9CWVRFLGEuc291cmNlKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9NQUdfRklMVEVSLGEuc2NhbGVNb2RlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9jLkxJTkVBUjpjLk5FQVJFU1QpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX01JTl9GSUxURVIsYS5zY2FsZU1vZGU9PT1iLnNjYWxlTW9kZXMuTElORUFSP2MuTElORUFSOmMuTkVBUkVTVCksYS5fcG93ZXJPZjI/KGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfUyxjLlJFUEVBVCksYy50ZXhQYXJhbWV0ZXJpKGMuVEVYVFVSRV8yRCxjLlRFWFRVUkVfV1JBUF9ULGMuUkVQRUFUKSk6KGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfUyxjLkNMQU1QX1RPX0VER0UpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfVCxjLkNMQU1QX1RPX0VER0UpKSxjLmJpbmRUZXh0dXJlKGMuVEVYVFVSRV8yRCxudWxsKSxhLl9kaXJ0eVtjLmlkXT0hMSksYS5fZ2xUZXh0dXJlc1tjLmlkXX0sYi51cGRhdGVXZWJHTFRleHR1cmU9ZnVuY3Rpb24oYSxjKXthLl9nbFRleHR1cmVzW2MuaWRdJiYoYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsYS5fZ2xUZXh0dXJlc1tjLmlkXSksYy5waXhlbFN0b3JlaShjLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCxhLnByZW11bHRpcGxpZWRBbHBoYSksYy50ZXhJbWFnZTJEKGMuVEVYVFVSRV8yRCwwLGMuUkdCQSxjLlJHQkEsYy5VTlNJR05FRF9CWVRFLGEuc291cmNlKSxjLnRleFBhcmFtZXRlcmkoYy5URVhUVVJFXzJELGMuVEVYVFVSRV9NQUdfRklMVEVSLGEuc2NhbGVNb2RlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9jLkxJTkVBUjpjLk5FQVJFU1QpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX01JTl9GSUxURVIsYS5zY2FsZU1vZGU9PT1iLnNjYWxlTW9kZXMuTElORUFSP2MuTElORUFSOmMuTkVBUkVTVCksYS5fcG93ZXJPZjI/KGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfUyxjLlJFUEVBVCksYy50ZXhQYXJhbWV0ZXJpKGMuVEVYVFVSRV8yRCxjLlRFWFRVUkVfV1JBUF9ULGMuUkVQRUFUKSk6KGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfUyxjLkNMQU1QX1RPX0VER0UpLGMudGV4UGFyYW1ldGVyaShjLlRFWFRVUkVfMkQsYy5URVhUVVJFX1dSQVBfVCxjLkNMQU1QX1RPX0VER0UpKSxhLl9kaXJ0eVtjLmlkXT0hMSl9LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUuaGFuZGxlQ29udGV4dExvc3Q9ZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuY29udGV4dExvc3Q9ITB9LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUuaGFuZGxlQ29udGV4dFJlc3RvcmVkPWZ1bmN0aW9uKCl7dHJ5e3RoaXMuZ2w9dGhpcy52aWV3LmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIix0aGlzLm9wdGlvbnMpfWNhdGNoKGEpe3RyeXt0aGlzLmdsPXRoaXMudmlldy5nZXRDb250ZXh0KFwid2ViZ2xcIix0aGlzLm9wdGlvbnMpfWNhdGNoKGMpe3Rocm93IG5ldyBFcnJvcihcIiBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTC4gVHJ5IHVzaW5nIHRoZSBjYW52YXMgcmVuZGVyZXJcIit0aGlzKX19dmFyIGQ9dGhpcy5nbDtkLmlkPWIuV2ViR0xSZW5kZXJlci5nbENvbnRleHRJZCsrLHRoaXMuc2hhZGVyTWFuYWdlci5zZXRDb250ZXh0KGQpLHRoaXMuc3ByaXRlQmF0Y2guc2V0Q29udGV4dChkKSx0aGlzLnByaW1pdGl2ZUJhdGNoLnNldENvbnRleHQoZCksdGhpcy5tYXNrTWFuYWdlci5zZXRDb250ZXh0KGQpLHRoaXMuZmlsdGVyTWFuYWdlci5zZXRDb250ZXh0KGQpLHRoaXMucmVuZGVyU2Vzc2lvbi5nbD10aGlzLmdsLGQuZGlzYWJsZShkLkRFUFRIX1RFU1QpLGQuZGlzYWJsZShkLkNVTExfRkFDRSksZC5lbmFibGUoZC5CTEVORCksZC5jb2xvck1hc2soITAsITAsITAsdGhpcy50cmFuc3BhcmVudCksdGhpcy5nbC52aWV3cG9ydCgwLDAsdGhpcy53aWR0aCx0aGlzLmhlaWdodCk7Zm9yKHZhciBlIGluIGIuVGV4dHVyZUNhY2hlKXt2YXIgZj1iLlRleHR1cmVDYWNoZVtlXS5iYXNlVGV4dHVyZTtmLl9nbFRleHR1cmVzPVtdfXRoaXMuY29udGV4dExvc3Q9ITF9LGIuV2ViR0xSZW5kZXJlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0bG9zdFwiLHRoaXMuY29udGV4dExvc3QpLHRoaXMudmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0cmVzdG9yZWRcIix0aGlzLmNvbnRleHRSZXN0b3JlZExvc3QpLGIuZ2xDb250ZXh0c1t0aGlzLmdsQ29udGV4dElkXT1udWxsLHRoaXMucHJvamVjdGlvbj1udWxsLHRoaXMub2Zmc2V0PW51bGwsdGhpcy5zaGFkZXJNYW5hZ2VyLmRlc3Ryb3koKSx0aGlzLnNwcml0ZUJhdGNoLmRlc3Ryb3koKSx0aGlzLnByaW1pdGl2ZUJhdGNoLmRlc3Ryb3koKSx0aGlzLm1hc2tNYW5hZ2VyLmRlc3Ryb3koKSx0aGlzLmZpbHRlck1hbmFnZXIuZGVzdHJveSgpLHRoaXMuc2hhZGVyTWFuYWdlcj1udWxsLHRoaXMuc3ByaXRlQmF0Y2g9bnVsbCx0aGlzLm1hc2tNYW5hZ2VyPW51bGwsdGhpcy5maWx0ZXJNYW5hZ2VyPW51bGwsdGhpcy5nbD1udWxsLHRoaXMucmVuZGVyU2Vzc2lvbj1udWxsfSxiLldlYkdMUmVuZGVyZXIuZ2xDb250ZXh0SWQ9MCxiLldlYkdMQmxlbmRNb2RlTWFuYWdlcj1mdW5jdGlvbihhKXt0aGlzLmdsPWEsdGhpcy5jdXJyZW50QmxlbmRNb2RlPTk5OTk5fSxiLldlYkdMQmxlbmRNb2RlTWFuYWdlci5wcm90b3R5cGUuc2V0QmxlbmRNb2RlPWZ1bmN0aW9uKGEpe2lmKHRoaXMuY3VycmVudEJsZW5kTW9kZT09PWEpcmV0dXJuITE7dGhpcy5jdXJyZW50QmxlbmRNb2RlPWE7dmFyIGM9Yi5ibGVuZE1vZGVzV2ViR0xbdGhpcy5jdXJyZW50QmxlbmRNb2RlXTtyZXR1cm4gdGhpcy5nbC5ibGVuZEZ1bmMoY1swXSxjWzFdKSwhMH0sYi5XZWJHTEJsZW5kTW9kZU1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmdsPW51bGx9LGIuV2ViR0xNYXNrTWFuYWdlcj1mdW5jdGlvbihhKXt0aGlzLm1hc2tTdGFjaz1bXSx0aGlzLm1hc2tQb3NpdGlvbj0wLHRoaXMuc2V0Q29udGV4dChhKSx0aGlzLnJldmVyc2U9ITEsdGhpcy5jb3VudD0wfSxiLldlYkdMTWFza01hbmFnZXIucHJvdG90eXBlLnNldENvbnRleHQ9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hfSxiLldlYkdMTWFza01hbmFnZXIucHJvdG90eXBlLnB1c2hNYXNrPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9Yy5nbDthLmRpcnR5JiZiLldlYkdMR3JhcGhpY3MudXBkYXRlR3JhcGhpY3MoYSxkKSxhLl93ZWJHTFtkLmlkXS5kYXRhLmxlbmd0aCYmYy5zdGVuY2lsTWFuYWdlci5wdXNoU3RlbmNpbChhLGEuX3dlYkdMW2QuaWRdLmRhdGFbMF0sYyl9LGIuV2ViR0xNYXNrTWFuYWdlci5wcm90b3R5cGUucG9wTWFzaz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuZ2w7Yi5zdGVuY2lsTWFuYWdlci5wb3BTdGVuY2lsKGEsYS5fd2ViR0xbYy5pZF0uZGF0YVswXSxiKX0sYi5XZWJHTE1hc2tNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5tYXNrU3RhY2s9bnVsbCx0aGlzLmdsPW51bGx9LGIuV2ViR0xTdGVuY2lsTWFuYWdlcj1mdW5jdGlvbihhKXt0aGlzLnN0ZW5jaWxTdGFjaz1bXSx0aGlzLnNldENvbnRleHQoYSksdGhpcy5yZXZlcnNlPSEwLHRoaXMuY291bnQ9MH0sYi5XZWJHTFN0ZW5jaWxNYW5hZ2VyLnByb3RvdHlwZS5zZXRDb250ZXh0PWZ1bmN0aW9uKGEpe3RoaXMuZ2w9YX0sYi5XZWJHTFN0ZW5jaWxNYW5hZ2VyLnByb3RvdHlwZS5wdXNoU3RlbmNpbD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5nbDt0aGlzLmJpbmRHcmFwaGljcyhhLGIsYyksMD09PXRoaXMuc3RlbmNpbFN0YWNrLmxlbmd0aCYmKGQuZW5hYmxlKGQuU1RFTkNJTF9URVNUKSxkLmNsZWFyKGQuU1RFTkNJTF9CVUZGRVJfQklUKSx0aGlzLnJldmVyc2U9ITAsdGhpcy5jb3VudD0wKSx0aGlzLnN0ZW5jaWxTdGFjay5wdXNoKGIpO3ZhciBlPXRoaXMuY291bnQ7ZC5jb2xvck1hc2soITEsITEsITEsITEpLGQuc3RlbmNpbEZ1bmMoZC5BTFdBWVMsMCwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5JTlZFUlQpLDE9PT1iLm1vZGU/KGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfRkFOLGIuaW5kaWNlcy5sZW5ndGgtNCxkLlVOU0lHTkVEX1NIT1JULDApLHRoaXMucmV2ZXJzZT8oZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS1lLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLkRFQ1IpKTooZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuSU5DUikpLGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfRkFOLDQsZC5VTlNJR05FRF9TSE9SVCwyKihiLmluZGljZXMubGVuZ3RoLTQpKSx0aGlzLnJldmVyc2U/ZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS0oZSsxKSwyNTUpOmQuc3RlbmNpbEZ1bmMoZC5FUVVBTCxlKzEsMjU1KSx0aGlzLnJldmVyc2U9IXRoaXMucmV2ZXJzZSk6KHRoaXMucmV2ZXJzZT8oZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuSU5DUikpOihkLnN0ZW5jaWxGdW5jKGQuRVFVQUwsMjU1LWUsMjU1KSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuREVDUikpLGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfU1RSSVAsYi5pbmRpY2VzLmxlbmd0aCxkLlVOU0lHTkVEX1NIT1JULDApLHRoaXMucmV2ZXJzZT9kLnN0ZW5jaWxGdW5jKGQuRVFVQUwsZSsxLDI1NSk6ZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS0oZSsxKSwyNTUpKSxkLmNvbG9yTWFzayghMCwhMCwhMCwhMCksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLktFRVApLHRoaXMuY291bnQrK30sYi5XZWJHTFN0ZW5jaWxNYW5hZ2VyLnByb3RvdHlwZS5iaW5kR3JhcGhpY3M9ZnVuY3Rpb24oYSxjLGQpe3RoaXMuX2N1cnJlbnRHcmFwaGljcz1hO3ZhciBlLGY9dGhpcy5nbCxnPWQucHJvamVjdGlvbixoPWQub2Zmc2V0OzE9PT1jLm1vZGU/KGU9ZC5zaGFkZXJNYW5hZ2VyLmNvbXBsZXhQcmltYXRpdmVTaGFkZXIsZC5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcihlKSxmLnVuaWZvcm1NYXRyaXgzZnYoZS50cmFuc2xhdGlvbk1hdHJpeCwhMSxhLndvcmxkVHJhbnNmb3JtLnRvQXJyYXkoITApKSxmLnVuaWZvcm0yZihlLnByb2plY3Rpb25WZWN0b3IsZy54LC1nLnkpLGYudW5pZm9ybTJmKGUub2Zmc2V0VmVjdG9yLC1oLngsLWgueSksZi51bmlmb3JtM2Z2KGUudGludENvbG9yLGIuaGV4MnJnYihhLnRpbnQpKSxmLnVuaWZvcm0zZnYoZS5jb2xvcixjLmNvbG9yKSxmLnVuaWZvcm0xZihlLmFscGhhLGEud29ybGRBbHBoYSpjLmFscGhhKSxmLmJpbmRCdWZmZXIoZi5BUlJBWV9CVUZGRVIsYy5idWZmZXIpLGYudmVydGV4QXR0cmliUG9pbnRlcihlLmFWZXJ0ZXhQb3NpdGlvbiwyLGYuRkxPQVQsITEsOCwwKSxmLmJpbmRCdWZmZXIoZi5FTEVNRU5UX0FSUkFZX0JVRkZFUixjLmluZGV4QnVmZmVyKSk6KGU9ZC5zaGFkZXJNYW5hZ2VyLnByaW1pdGl2ZVNoYWRlcixkLnNoYWRlck1hbmFnZXIuc2V0U2hhZGVyKGUpLGYudW5pZm9ybU1hdHJpeDNmdihlLnRyYW5zbGF0aW9uTWF0cml4LCExLGEud29ybGRUcmFuc2Zvcm0udG9BcnJheSghMCkpLGYudW5pZm9ybTJmKGUucHJvamVjdGlvblZlY3RvcixnLngsLWcueSksZi51bmlmb3JtMmYoZS5vZmZzZXRWZWN0b3IsLWgueCwtaC55KSxmLnVuaWZvcm0zZnYoZS50aW50Q29sb3IsYi5oZXgycmdiKGEudGludCkpLGYudW5pZm9ybTFmKGUuYWxwaGEsYS53b3JsZEFscGhhKSxmLmJpbmRCdWZmZXIoZi5BUlJBWV9CVUZGRVIsYy5idWZmZXIpLGYudmVydGV4QXR0cmliUG9pbnRlcihlLmFWZXJ0ZXhQb3NpdGlvbiwyLGYuRkxPQVQsITEsMjQsMCksZi52ZXJ0ZXhBdHRyaWJQb2ludGVyKGUuY29sb3JBdHRyaWJ1dGUsNCxmLkZMT0FULCExLDI0LDgpLGYuYmluZEJ1ZmZlcihmLkVMRU1FTlRfQVJSQVlfQlVGRkVSLGMuaW5kZXhCdWZmZXIpKX0sYi5XZWJHTFN0ZW5jaWxNYW5hZ2VyLnByb3RvdHlwZS5wb3BTdGVuY2lsPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzLmdsO2lmKHRoaXMuc3RlbmNpbFN0YWNrLnBvcCgpLHRoaXMuY291bnQtLSwwPT09dGhpcy5zdGVuY2lsU3RhY2subGVuZ3RoKWQuZGlzYWJsZShkLlNURU5DSUxfVEVTVCk7ZWxzZXt2YXIgZT10aGlzLmNvdW50O3RoaXMuYmluZEdyYXBoaWNzKGEsYixjKSxkLmNvbG9yTWFzayghMSwhMSwhMSwhMSksMT09PWIubW9kZT8odGhpcy5yZXZlcnNlPSF0aGlzLnJldmVyc2UsdGhpcy5yZXZlcnNlPyhkLnN0ZW5jaWxGdW5jKGQuRVFVQUwsMjU1LShlKzEpLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLklOQ1IpKTooZC5zdGVuY2lsRnVuYyhkLkVRVUFMLGUrMSwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5ERUNSKSksZC5kcmF3RWxlbWVudHMoZC5UUklBTkdMRV9GQU4sNCxkLlVOU0lHTkVEX1NIT1JULDIqKGIuaW5kaWNlcy5sZW5ndGgtNCkpLGQuc3RlbmNpbEZ1bmMoZC5BTFdBWVMsMCwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5JTlZFUlQpLGQuZHJhd0VsZW1lbnRzKGQuVFJJQU5HTEVfRkFOLGIuaW5kaWNlcy5sZW5ndGgtNCxkLlVOU0lHTkVEX1NIT1JULDApLHRoaXMucmV2ZXJzZT9kLnN0ZW5jaWxGdW5jKGQuRVFVQUwsZSwyNTUpOmQuc3RlbmNpbEZ1bmMoZC5FUVVBTCwyNTUtZSwyNTUpKToodGhpcy5yZXZlcnNlPyhkLnN0ZW5jaWxGdW5jKGQuRVFVQUwsZSsxLDI1NSksZC5zdGVuY2lsT3AoZC5LRUVQLGQuS0VFUCxkLkRFQ1IpKTooZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS0oZSsxKSwyNTUpLGQuc3RlbmNpbE9wKGQuS0VFUCxkLktFRVAsZC5JTkNSKSksZC5kcmF3RWxlbWVudHMoZC5UUklBTkdMRV9TVFJJUCxiLmluZGljZXMubGVuZ3RoLGQuVU5TSUdORURfU0hPUlQsMCksdGhpcy5yZXZlcnNlP2Quc3RlbmNpbEZ1bmMoZC5FUVVBTCxlLDI1NSk6ZC5zdGVuY2lsRnVuYyhkLkVRVUFMLDI1NS1lLDI1NSkpLGQuY29sb3JNYXNrKCEwLCEwLCEwLCEwKSxkLnN0ZW5jaWxPcChkLktFRVAsZC5LRUVQLGQuS0VFUCl9fSxiLldlYkdMU3RlbmNpbE1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLm1hc2tTdGFjaz1udWxsLHRoaXMuZ2w9bnVsbH0sYi5XZWJHTFNoYWRlck1hbmFnZXI9ZnVuY3Rpb24oYSl7dGhpcy5tYXhBdHRpYnM9MTAsdGhpcy5hdHRyaWJTdGF0ZT1bXSx0aGlzLnRlbXBBdHRyaWJTdGF0ZT1bXSx0aGlzLnNoYWRlck1hcD1bXTtmb3IodmFyIGI9MDtiPHRoaXMubWF4QXR0aWJzO2IrKyl0aGlzLmF0dHJpYlN0YXRlW2JdPSExO3RoaXMuc2V0Q29udGV4dChhKX0sYi5XZWJHTFNoYWRlck1hbmFnZXIucHJvdG90eXBlLnNldENvbnRleHQ9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hLHRoaXMucHJpbWl0aXZlU2hhZGVyPW5ldyBiLlByaW1pdGl2ZVNoYWRlcihhKSx0aGlzLmNvbXBsZXhQcmltYXRpdmVTaGFkZXI9bmV3IGIuQ29tcGxleFByaW1pdGl2ZVNoYWRlcihhKSx0aGlzLmRlZmF1bHRTaGFkZXI9bmV3IGIuUGl4aVNoYWRlcihhKSx0aGlzLmZhc3RTaGFkZXI9bmV3IGIuUGl4aUZhc3RTaGFkZXIoYSksdGhpcy5zdHJpcFNoYWRlcj1uZXcgYi5TdHJpcFNoYWRlcihhKSx0aGlzLnNldFNoYWRlcih0aGlzLmRlZmF1bHRTaGFkZXIpfSxiLldlYkdMU2hhZGVyTWFuYWdlci5wcm90b3R5cGUuc2V0QXR0cmlicz1mdW5jdGlvbihhKXt2YXIgYjtmb3IoYj0wO2I8dGhpcy50ZW1wQXR0cmliU3RhdGUubGVuZ3RoO2IrKyl0aGlzLnRlbXBBdHRyaWJTdGF0ZVtiXT0hMTtmb3IoYj0wO2I8YS5sZW5ndGg7YisrKXt2YXIgYz1hW2JdO3RoaXMudGVtcEF0dHJpYlN0YXRlW2NdPSEwfXZhciBkPXRoaXMuZ2w7Zm9yKGI9MDtiPHRoaXMuYXR0cmliU3RhdGUubGVuZ3RoO2IrKyl0aGlzLmF0dHJpYlN0YXRlW2JdIT09dGhpcy50ZW1wQXR0cmliU3RhdGVbYl0mJih0aGlzLmF0dHJpYlN0YXRlW2JdPXRoaXMudGVtcEF0dHJpYlN0YXRlW2JdLHRoaXMudGVtcEF0dHJpYlN0YXRlW2JdP2QuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYik6ZC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoYikpfSxiLldlYkdMU2hhZGVyTWFuYWdlci5wcm90b3R5cGUuc2V0U2hhZGVyPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9jdXJyZW50SWQ9PT1hLl9VSUQ/ITE6KHRoaXMuX2N1cnJlbnRJZD1hLl9VSUQsdGhpcy5jdXJyZW50U2hhZGVyPWEsdGhpcy5nbC51c2VQcm9ncmFtKGEucHJvZ3JhbSksdGhpcy5zZXRBdHRyaWJzKGEuYXR0cmlidXRlcyksITApfSxiLldlYkdMU2hhZGVyTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuYXR0cmliU3RhdGU9bnVsbCx0aGlzLnRlbXBBdHRyaWJTdGF0ZT1udWxsLHRoaXMucHJpbWl0aXZlU2hhZGVyLmRlc3Ryb3koKSx0aGlzLmRlZmF1bHRTaGFkZXIuZGVzdHJveSgpLHRoaXMuZmFzdFNoYWRlci5kZXN0cm95KCksdGhpcy5zdHJpcFNoYWRlci5kZXN0cm95KCksdGhpcy5nbD1udWxsfSxiLldlYkdMU3ByaXRlQmF0Y2g9ZnVuY3Rpb24oYSl7dGhpcy52ZXJ0U2l6ZT02LHRoaXMuc2l6ZT0yZTM7dmFyIGI9NCp0aGlzLnNpemUqdGhpcy52ZXJ0U2l6ZSxjPTYqdGhpcy5zaXplO3RoaXMudmVydGljZXM9bmV3IEZsb2F0MzJBcnJheShiKSx0aGlzLmluZGljZXM9bmV3IFVpbnQxNkFycmF5KGMpLHRoaXMubGFzdEluZGV4Q291bnQ9MDtmb3IodmFyIGQ9MCxlPTA7Yz5kO2QrPTYsZSs9NCl0aGlzLmluZGljZXNbZCswXT1lKzAsdGhpcy5pbmRpY2VzW2QrMV09ZSsxLHRoaXMuaW5kaWNlc1tkKzJdPWUrMix0aGlzLmluZGljZXNbZCszXT1lKzAsdGhpcy5pbmRpY2VzW2QrNF09ZSsyLHRoaXMuaW5kaWNlc1tkKzVdPWUrMzt0aGlzLmRyYXdpbmc9ITEsdGhpcy5jdXJyZW50QmF0Y2hTaXplPTAsdGhpcy5jdXJyZW50QmFzZVRleHR1cmU9bnVsbCx0aGlzLnNldENvbnRleHQoYSksdGhpcy5kaXJ0eT0hMCx0aGlzLnRleHR1cmVzPVtdLHRoaXMuYmxlbmRNb2Rlcz1bXX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5zZXRDb250ZXh0PWZ1bmN0aW9uKGEpe3RoaXMuZ2w9YSx0aGlzLnZlcnRleEJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuaW5kZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSxhLmJpbmRCdWZmZXIoYS5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGV4QnVmZmVyKSxhLmJ1ZmZlckRhdGEoYS5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGljZXMsYS5TVEFUSUNfRFJBVyksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QnVmZmVyKSxhLmJ1ZmZlckRhdGEoYS5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0aWNlcyxhLkRZTkFNSUNfRFJBVyksdGhpcy5jdXJyZW50QmxlbmRNb2RlPTk5OTk5fSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLmJlZ2luPWZ1bmN0aW9uKGEpe3RoaXMucmVuZGVyU2Vzc2lvbj1hLHRoaXMuc2hhZGVyPXRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLmRlZmF1bHRTaGFkZXIsdGhpcy5zdGFydCgpfSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLmVuZD1mdW5jdGlvbigpe3RoaXMuZmx1c2goKX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24oYSl7dmFyIGI9YS50ZXh0dXJlO3RoaXMuY3VycmVudEJhdGNoU2l6ZT49dGhpcy5zaXplJiYodGhpcy5mbHVzaCgpLHRoaXMuY3VycmVudEJhc2VUZXh0dXJlPWIuYmFzZVRleHR1cmUpO3ZhciBjPWIuX3V2cztpZihjKXt2YXIgZCxlLGYsZyxoPWEud29ybGRBbHBoYSxpPWEudGludCxqPXRoaXMudmVydGljZXMsaz1hLmFuY2hvci54LGw9YS5hbmNob3IueTtpZihiLnRyaW0pe3ZhciBtPWIudHJpbTtlPW0ueC1rKm0ud2lkdGgsZD1lK2IuY3JvcC53aWR0aCxnPW0ueS1sKm0uaGVpZ2h0LGY9ZytiLmNyb3AuaGVpZ2h0fWVsc2UgZD1iLmZyYW1lLndpZHRoKigxLWspLGU9Yi5mcmFtZS53aWR0aCotayxmPWIuZnJhbWUuaGVpZ2h0KigxLWwpLGc9Yi5mcmFtZS5oZWlnaHQqLWw7dmFyIG49NCp0aGlzLmN1cnJlbnRCYXRjaFNpemUqdGhpcy52ZXJ0U2l6ZSxvPWEud29ybGRUcmFuc2Zvcm0scD1vLmEscT1vLmMscj1vLmIscz1vLmQsdD1vLnR4LHU9by50eTtqW24rK109cCplK3IqZyt0LGpbbisrXT1zKmcrcSplK3UsaltuKytdPWMueDAsaltuKytdPWMueTAsaltuKytdPWgsaltuKytdPWksaltuKytdPXAqZCtyKmcrdCxqW24rK109cypnK3EqZCt1LGpbbisrXT1jLngxLGpbbisrXT1jLnkxLGpbbisrXT1oLGpbbisrXT1pLGpbbisrXT1wKmQrcipmK3QsaltuKytdPXMqZitxKmQrdSxqW24rK109Yy54MixqW24rK109Yy55MixqW24rK109aCxqW24rK109aSxqW24rK109cCplK3IqZit0LGpbbisrXT1zKmYrcSplK3UsaltuKytdPWMueDMsaltuKytdPWMueTMsaltuKytdPWgsaltuKytdPWksdGhpcy50ZXh0dXJlc1t0aGlzLmN1cnJlbnRCYXRjaFNpemVdPWEudGV4dHVyZS5iYXNlVGV4dHVyZSx0aGlzLmJsZW5kTW9kZXNbdGhpcy5jdXJyZW50QmF0Y2hTaXplXT1hLmJsZW5kTW9kZSx0aGlzLmN1cnJlbnRCYXRjaFNpemUrK319LGIuV2ViR0xTcHJpdGVCYXRjaC5wcm90b3R5cGUucmVuZGVyVGlsaW5nU3ByaXRlPWZ1bmN0aW9uKGEpe3ZhciBjPWEudGlsaW5nVGV4dHVyZTt0aGlzLmN1cnJlbnRCYXRjaFNpemU+PXRoaXMuc2l6ZSYmKHRoaXMuZmx1c2goKSx0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZT1jLmJhc2VUZXh0dXJlKSxhLl91dnN8fChhLl91dnM9bmV3IGIuVGV4dHVyZVV2cyk7dmFyIGQ9YS5fdXZzO2EudGlsZVBvc2l0aW9uLnglPWMuYmFzZVRleHR1cmUud2lkdGgqYS50aWxlU2NhbGVPZmZzZXQueCxhLnRpbGVQb3NpdGlvbi55JT1jLmJhc2VUZXh0dXJlLmhlaWdodCphLnRpbGVTY2FsZU9mZnNldC55O3ZhciBlPWEudGlsZVBvc2l0aW9uLngvKGMuYmFzZVRleHR1cmUud2lkdGgqYS50aWxlU2NhbGVPZmZzZXQueCksZj1hLnRpbGVQb3NpdGlvbi55LyhjLmJhc2VUZXh0dXJlLmhlaWdodCphLnRpbGVTY2FsZU9mZnNldC55KSxnPWEud2lkdGgvYy5iYXNlVGV4dHVyZS53aWR0aC8oYS50aWxlU2NhbGUueCphLnRpbGVTY2FsZU9mZnNldC54KSxoPWEuaGVpZ2h0L2MuYmFzZVRleHR1cmUuaGVpZ2h0LyhhLnRpbGVTY2FsZS55KmEudGlsZVNjYWxlT2Zmc2V0LnkpO2QueDA9MC1lLGQueTA9MC1mLGQueDE9MSpnLWUsZC55MT0wLWYsZC54Mj0xKmctZSxkLnkyPTEqaC1mLGQueDM9MC1lLGQueTM9MSpoLWY7dmFyIGk9YS53b3JsZEFscGhhLGo9YS50aW50LGs9dGhpcy52ZXJ0aWNlcyxsPWEud2lkdGgsbT1hLmhlaWdodCxuPWEuYW5jaG9yLngsbz1hLmFuY2hvci55LHA9bCooMS1uKSxxPWwqLW4scj1tKigxLW8pLHM9bSotbyx0PTQqdGhpcy5jdXJyZW50QmF0Y2hTaXplKnRoaXMudmVydFNpemUsdT1hLndvcmxkVHJhbnNmb3JtLHY9dS5hLHc9dS5jLHg9dS5iLHk9dS5kLHo9dS50eCxBPXUudHk7a1t0KytdPXYqcSt4KnMreixrW3QrK109eSpzK3cqcStBLGtbdCsrXT1kLngwLGtbdCsrXT1kLnkwLGtbdCsrXT1pLGtbdCsrXT1qLGtbdCsrXT12KnAreCpzK3osa1t0KytdPXkqcyt3KnArQSxrW3QrK109ZC54MSxrW3QrK109ZC55MSxrW3QrK109aSxrW3QrK109aixrW3QrK109dipwK3gqcit6LGtbdCsrXT15KnIrdypwK0Esa1t0KytdPWQueDIsa1t0KytdPWQueTIsa1t0KytdPWksa1t0KytdPWosa1t0KytdPXYqcSt4KnIreixrW3QrK109eSpyK3cqcStBLGtbdCsrXT1kLngzLGtbdCsrXT1kLnkzLGtbdCsrXT1pLGtbdCsrXT1qLHRoaXMudGV4dHVyZXNbdGhpcy5jdXJyZW50QmF0Y2hTaXplXT1jLmJhc2VUZXh0dXJlLHRoaXMuYmxlbmRNb2Rlc1t0aGlzLmN1cnJlbnRCYXRjaFNpemVdPWEuYmxlbmRNb2RlLHRoaXMuY3VycmVudEJhdGNoU2l6ZSsrfSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7aWYoMCE9PXRoaXMuY3VycmVudEJhdGNoU2l6ZSl7dmFyIGE9dGhpcy5nbDtpZih0aGlzLnJlbmRlclNlc3Npb24uc2hhZGVyTWFuYWdlci5zZXRTaGFkZXIodGhpcy5yZW5kZXJTZXNzaW9uLnNoYWRlck1hbmFnZXIuZGVmYXVsdFNoYWRlciksdGhpcy5kaXJ0eSl7dGhpcy5kaXJ0eT0hMSxhLmFjdGl2ZVRleHR1cmUoYS5URVhUVVJFMCksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QnVmZmVyKSxhLmJpbmRCdWZmZXIoYS5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLmluZGV4QnVmZmVyKTt2YXIgYj10aGlzLnJlbmRlclNlc3Npb24ucHJvamVjdGlvbjthLnVuaWZvcm0yZih0aGlzLnNoYWRlci5wcm9qZWN0aW9uVmVjdG9yLGIueCxiLnkpO3ZhciBjPTQqdGhpcy52ZXJ0U2l6ZTthLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuYVZlcnRleFBvc2l0aW9uLDIsYS5GTE9BVCwhMSxjLDApLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hVGV4dHVyZUNvb3JkLDIsYS5GTE9BVCwhMSxjLDgpLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5jb2xvckF0dHJpYnV0ZSwyLGEuRkxPQVQsITEsYywxNil9aWYodGhpcy5jdXJyZW50QmF0Y2hTaXplPi41KnRoaXMuc2l6ZSlhLmJ1ZmZlclN1YkRhdGEoYS5BUlJBWV9CVUZGRVIsMCx0aGlzLnZlcnRpY2VzKTtlbHNle3ZhciBkPXRoaXMudmVydGljZXMuc3ViYXJyYXkoMCw0KnRoaXMuY3VycmVudEJhdGNoU2l6ZSp0aGlzLnZlcnRTaXplKTthLmJ1ZmZlclN1YkRhdGEoYS5BUlJBWV9CVUZGRVIsMCxkKX1mb3IodmFyIGUsZixnPTAsaD0wLGk9bnVsbCxqPXRoaXMucmVuZGVyU2Vzc2lvbi5ibGVuZE1vZGVNYW5hZ2VyLmN1cnJlbnRCbGVuZE1vZGUsaz0wLGw9dGhpcy5jdXJyZW50QmF0Y2hTaXplO2w+aztrKyspZT10aGlzLnRleHR1cmVzW2tdLGY9dGhpcy5ibGVuZE1vZGVzW2tdLChpIT09ZXx8aiE9PWYpJiYodGhpcy5yZW5kZXJCYXRjaChpLGcsaCksaD1rLGc9MCxpPWUsaj1mLHRoaXMucmVuZGVyU2Vzc2lvbi5ibGVuZE1vZGVNYW5hZ2VyLnNldEJsZW5kTW9kZShqKSksZysrO3RoaXMucmVuZGVyQmF0Y2goaSxnLGgpLHRoaXMuY3VycmVudEJhdGNoU2l6ZT0wfX0sYi5XZWJHTFNwcml0ZUJhdGNoLnByb3RvdHlwZS5yZW5kZXJCYXRjaD1mdW5jdGlvbihhLGMsZCl7aWYoMCE9PWMpe3ZhciBlPXRoaXMuZ2w7ZS5iaW5kVGV4dHVyZShlLlRFWFRVUkVfMkQsYS5fZ2xUZXh0dXJlc1tlLmlkXXx8Yi5jcmVhdGVXZWJHTFRleHR1cmUoYSxlKSksYS5fZGlydHlbZS5pZF0mJmIudXBkYXRlV2ViR0xUZXh0dXJlKHRoaXMuY3VycmVudEJhc2VUZXh0dXJlLGUpLGUuZHJhd0VsZW1lbnRzKGUuVFJJQU5HTEVTLDYqYyxlLlVOU0lHTkVEX1NIT1JULDYqZCoyKSx0aGlzLnJlbmRlclNlc3Npb24uZHJhd0NvdW50Kyt9fSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLmZsdXNoKCl9LGIuV2ViR0xTcHJpdGVCYXRjaC5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt0aGlzLmRpcnR5PSEwfSxiLldlYkdMU3ByaXRlQmF0Y2gucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnZlcnRpY2VzPW51bGwsdGhpcy5pbmRpY2VzPW51bGwsdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy52ZXJ0ZXhCdWZmZXIpLHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuaW5kZXhCdWZmZXIpLHRoaXMuY3VycmVudEJhc2VUZXh0dXJlPW51bGwsdGhpcy5nbD1udWxsfSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoPWZ1bmN0aW9uKGEpe3RoaXMudmVydFNpemU9MTAsdGhpcy5tYXhTaXplPTZlMyx0aGlzLnNpemU9dGhpcy5tYXhTaXplO3ZhciBiPTQqdGhpcy5zaXplKnRoaXMudmVydFNpemUsYz02KnRoaXMubWF4U2l6ZTt0aGlzLnZlcnRpY2VzPW5ldyBGbG9hdDMyQXJyYXkoYiksdGhpcy5pbmRpY2VzPW5ldyBVaW50MTZBcnJheShjKSx0aGlzLnZlcnRleEJ1ZmZlcj1udWxsLHRoaXMuaW5kZXhCdWZmZXI9bnVsbCx0aGlzLmxhc3RJbmRleENvdW50PTA7Zm9yKHZhciBkPTAsZT0wO2M+ZDtkKz02LGUrPTQpdGhpcy5pbmRpY2VzW2QrMF09ZSswLHRoaXMuaW5kaWNlc1tkKzFdPWUrMSx0aGlzLmluZGljZXNbZCsyXT1lKzIsdGhpcy5pbmRpY2VzW2QrM109ZSswLHRoaXMuaW5kaWNlc1tkKzRdPWUrMix0aGlzLmluZGljZXNbZCs1XT1lKzM7dGhpcy5kcmF3aW5nPSExLHRoaXMuY3VycmVudEJhdGNoU2l6ZT0wLHRoaXMuY3VycmVudEJhc2VUZXh0dXJlPW51bGwsdGhpcy5jdXJyZW50QmxlbmRNb2RlPTAsdGhpcy5yZW5kZXJTZXNzaW9uPW51bGwsdGhpcy5zaGFkZXI9bnVsbCx0aGlzLm1hdHJpeD1udWxsLHRoaXMuc2V0Q29udGV4dChhKX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUuc2V0Q29udGV4dD1mdW5jdGlvbihhKXt0aGlzLmdsPWEsdGhpcy52ZXJ0ZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLmluZGV4QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRpY2VzLGEuU1RBVElDX0RSQVcpLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGljZXMsYS5EWU5BTUlDX0RSQVcpfSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5iZWdpbj1mdW5jdGlvbihhLGIpe3RoaXMucmVuZGVyU2Vzc2lvbj1iLHRoaXMuc2hhZGVyPXRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLmZhc3RTaGFkZXIsdGhpcy5tYXRyaXg9YS53b3JsZFRyYW5zZm9ybS50b0FycmF5KCEwKSx0aGlzLnN0YXJ0KCl9LGIuV2ViR0xGYXN0U3ByaXRlQmF0Y2gucHJvdG90eXBlLmVuZD1mdW5jdGlvbigpe3RoaXMuZmx1c2goKX0sYi5XZWJHTEZhc3RTcHJpdGVCYXRjaC5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKGEpe3ZhciBiPWEuY2hpbGRyZW4sYz1iWzBdO2lmKGMudGV4dHVyZS5fdXZzKXt0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZT1jLnRleHR1cmUuYmFzZVRleHR1cmUsYy5ibGVuZE1vZGUhPT10aGlzLnJlbmRlclNlc3Npb24uYmxlbmRNb2RlTWFuYWdlci5jdXJyZW50QmxlbmRNb2RlJiYodGhpcy5mbHVzaCgpLHRoaXMucmVuZGVyU2Vzc2lvbi5ibGVuZE1vZGVNYW5hZ2VyLnNldEJsZW5kTW9kZShjLmJsZW5kTW9kZSkpO2Zvcih2YXIgZD0wLGU9Yi5sZW5ndGg7ZT5kO2QrKyl0aGlzLnJlbmRlclNwcml0ZShiW2RdKTt0aGlzLmZsdXNoKCl9fSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5yZW5kZXJTcHJpdGU9ZnVuY3Rpb24oYSl7aWYoYS52aXNpYmxlJiYoYS50ZXh0dXJlLmJhc2VUZXh0dXJlPT09dGhpcy5jdXJyZW50QmFzZVRleHR1cmV8fCh0aGlzLmZsdXNoKCksdGhpcy5jdXJyZW50QmFzZVRleHR1cmU9YS50ZXh0dXJlLmJhc2VUZXh0dXJlLGEudGV4dHVyZS5fdXZzKSkpe3ZhciBiLGMsZCxlLGYsZyxoLGksaj10aGlzLnZlcnRpY2VzO2lmKGI9YS50ZXh0dXJlLl91dnMsYz1hLnRleHR1cmUuZnJhbWUud2lkdGgsZD1hLnRleHR1cmUuZnJhbWUuaGVpZ2h0LGEudGV4dHVyZS50cmltKXt2YXIgaz1hLnRleHR1cmUudHJpbTtmPWsueC1hLmFuY2hvci54Kmsud2lkdGgsZT1mK2EudGV4dHVyZS5jcm9wLndpZHRoLGg9ay55LWEuYW5jaG9yLnkqay5oZWlnaHQsZz1oK2EudGV4dHVyZS5jcm9wLmhlaWdodH1lbHNlIGU9YS50ZXh0dXJlLmZyYW1lLndpZHRoKigxLWEuYW5jaG9yLngpLGY9YS50ZXh0dXJlLmZyYW1lLndpZHRoKi1hLmFuY2hvci54LGc9YS50ZXh0dXJlLmZyYW1lLmhlaWdodCooMS1hLmFuY2hvci55KSxoPWEudGV4dHVyZS5mcmFtZS5oZWlnaHQqLWEuYW5jaG9yLnk7aT00KnRoaXMuY3VycmVudEJhdGNoU2l6ZSp0aGlzLnZlcnRTaXplLGpbaSsrXT1mLGpbaSsrXT1oLGpbaSsrXT1hLnBvc2l0aW9uLngsaltpKytdPWEucG9zaXRpb24ueSxqW2krK109YS5zY2FsZS54LGpbaSsrXT1hLnNjYWxlLnksaltpKytdPWEucm90YXRpb24saltpKytdPWIueDAsaltpKytdPWIueTEsaltpKytdPWEuYWxwaGEsaltpKytdPWUsaltpKytdPWgsaltpKytdPWEucG9zaXRpb24ueCxqW2krK109YS5wb3NpdGlvbi55LGpbaSsrXT1hLnNjYWxlLngsaltpKytdPWEuc2NhbGUueSxqW2krK109YS5yb3RhdGlvbixqW2krK109Yi54MSxqW2krK109Yi55MSxqW2krK109YS5hbHBoYSxqW2krK109ZSxqW2krK109ZyxqW2krK109YS5wb3NpdGlvbi54LGpbaSsrXT1hLnBvc2l0aW9uLnksaltpKytdPWEuc2NhbGUueCxqW2krK109YS5zY2FsZS55LGpbaSsrXT1hLnJvdGF0aW9uLGpbaSsrXT1iLngyLGpbaSsrXT1iLnkyLGpbaSsrXT1hLmFscGhhLGpbaSsrXT1mLGpbaSsrXT1nLGpbaSsrXT1hLnBvc2l0aW9uLngsaltpKytdPWEucG9zaXRpb24ueSxqW2krK109YS5zY2FsZS54LGpbaSsrXT1hLnNjYWxlLnksaltpKytdPWEucm90YXRpb24saltpKytdPWIueDMsaltpKytdPWIueTMsaltpKytdPWEuYWxwaGEsdGhpcy5jdXJyZW50QmF0Y2hTaXplKyssdGhpcy5jdXJyZW50QmF0Y2hTaXplPj10aGlzLnNpemUmJnRoaXMuZmx1c2goKX19LGIuV2ViR0xGYXN0U3ByaXRlQmF0Y2gucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7aWYoMCE9PXRoaXMuY3VycmVudEJhdGNoU2l6ZSl7dmFyIGE9dGhpcy5nbDtpZih0aGlzLmN1cnJlbnRCYXNlVGV4dHVyZS5fZ2xUZXh0dXJlc1thLmlkXXx8Yi5jcmVhdGVXZWJHTFRleHR1cmUodGhpcy5jdXJyZW50QmFzZVRleHR1cmUsYSksYS5iaW5kVGV4dHVyZShhLlRFWFRVUkVfMkQsdGhpcy5jdXJyZW50QmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbYS5pZF0pLHRoaXMuY3VycmVudEJhdGNoU2l6ZT4uNSp0aGlzLnNpemUpYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy52ZXJ0aWNlcyk7ZWxzZXt2YXIgYz10aGlzLnZlcnRpY2VzLnN1YmFycmF5KDAsNCp0aGlzLmN1cnJlbnRCYXRjaFNpemUqdGhpcy52ZXJ0U2l6ZSk7YS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsYyl9YS5kcmF3RWxlbWVudHMoYS5UUklBTkdMRVMsNip0aGlzLmN1cnJlbnRCYXRjaFNpemUsYS5VTlNJR05FRF9TSE9SVCwwKSx0aGlzLmN1cnJlbnRCYXRjaFNpemU9MCx0aGlzLnJlbmRlclNlc3Npb24uZHJhd0NvdW50Kyt9fSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5mbHVzaCgpfSxiLldlYkdMRmFzdFNwcml0ZUJhdGNoLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2w7YS5hY3RpdmVUZXh0dXJlKGEuVEVYVFVSRTApLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlcik7dmFyIGI9dGhpcy5yZW5kZXJTZXNzaW9uLnByb2plY3Rpb247YS51bmlmb3JtMmYodGhpcy5zaGFkZXIucHJvamVjdGlvblZlY3RvcixiLngsYi55KSxhLnVuaWZvcm1NYXRyaXgzZnYodGhpcy5zaGFkZXIudU1hdHJpeCwhMSx0aGlzLm1hdHJpeCk7dmFyIGM9NCp0aGlzLnZlcnRTaXplO2EudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hVmVydGV4UG9zaXRpb24sMixhLkZMT0FULCExLGMsMCksYS52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuc2hhZGVyLmFQb3NpdGlvbkNvb3JkLDIsYS5GTE9BVCwhMSxjLDgpLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hU2NhbGUsMixhLkZMT0FULCExLGMsMTYpLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hUm90YXRpb24sMSxhLkZMT0FULCExLGMsMjQpLGEudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlci5hVGV4dHVyZUNvb3JkLDIsYS5GTE9BVCwhMSxjLDI4KSxhLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXIuY29sb3JBdHRyaWJ1dGUsMSxhLkZMT0FULCExLGMsMzYpfSxiLldlYkdMRmlsdGVyTWFuYWdlcj1mdW5jdGlvbihhLGIpe3RoaXMudHJhbnNwYXJlbnQ9Yix0aGlzLmZpbHRlclN0YWNrPVtdLHRoaXMub2Zmc2V0WD0wLHRoaXMub2Zmc2V0WT0wLHRoaXMuc2V0Q29udGV4dChhKX0sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLnNldENvbnRleHQ9ZnVuY3Rpb24oYSl7dGhpcy5nbD1hLHRoaXMudGV4dHVyZVBvb2w9W10sdGhpcy5pbml0U2hhZGVyQnVmZmVycygpfSxiLldlYkdMRmlsdGVyTWFuYWdlci5wcm90b3R5cGUuYmVnaW49ZnVuY3Rpb24oYSxiKXt0aGlzLnJlbmRlclNlc3Npb249YSx0aGlzLmRlZmF1bHRTaGFkZXI9YS5zaGFkZXJNYW5hZ2VyLmRlZmF1bHRTaGFkZXI7dmFyIGM9dGhpcy5yZW5kZXJTZXNzaW9uLnByb2plY3Rpb247dGhpcy53aWR0aD0yKmMueCx0aGlzLmhlaWdodD0yKi1jLnksdGhpcy5idWZmZXI9Yn0sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLnB1c2hGaWx0ZXI9ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcy5nbCxkPXRoaXMucmVuZGVyU2Vzc2lvbi5wcm9qZWN0aW9uLGU9dGhpcy5yZW5kZXJTZXNzaW9uLm9mZnNldDthLl9maWx0ZXJBcmVhPWEudGFyZ2V0LmZpbHRlckFyZWF8fGEudGFyZ2V0LmdldEJvdW5kcygpLHRoaXMuZmlsdGVyU3RhY2sucHVzaChhKTt2YXIgZj1hLmZpbHRlclBhc3Nlc1swXTt0aGlzLm9mZnNldFgrPWEuX2ZpbHRlckFyZWEueCx0aGlzLm9mZnNldFkrPWEuX2ZpbHRlckFyZWEueTt2YXIgZz10aGlzLnRleHR1cmVQb29sLnBvcCgpO2c/Zy5yZXNpemUodGhpcy53aWR0aCx0aGlzLmhlaWdodCk6Zz1uZXcgYi5GaWx0ZXJUZXh0dXJlKHRoaXMuZ2wsdGhpcy53aWR0aCx0aGlzLmhlaWdodCksYy5iaW5kVGV4dHVyZShjLlRFWFRVUkVfMkQsZy50ZXh0dXJlKTt2YXIgaD1hLl9maWx0ZXJBcmVhLGk9Zi5wYWRkaW5nO2gueC09aSxoLnktPWksaC53aWR0aCs9MippLGguaGVpZ2h0Kz0yKmksaC54PDAmJihoLng9MCksaC53aWR0aD50aGlzLndpZHRoJiYoaC53aWR0aD10aGlzLndpZHRoKSxoLnk8MCYmKGgueT0wKSxoLmhlaWdodD50aGlzLmhlaWdodCYmKGguaGVpZ2h0PXRoaXMuaGVpZ2h0KSxjLmJpbmRGcmFtZWJ1ZmZlcihjLkZSQU1FQlVGRkVSLGcuZnJhbWVCdWZmZXIpLGMudmlld3BvcnQoMCwwLGgud2lkdGgsaC5oZWlnaHQpLGQueD1oLndpZHRoLzIsZC55PS1oLmhlaWdodC8yLGUueD0taC54LGUueT0taC55LHRoaXMucmVuZGVyU2Vzc2lvbi5zaGFkZXJNYW5hZ2VyLnNldFNoYWRlcih0aGlzLmRlZmF1bHRTaGFkZXIpLGMudW5pZm9ybTJmKHRoaXMuZGVmYXVsdFNoYWRlci5wcm9qZWN0aW9uVmVjdG9yLGgud2lkdGgvMiwtaC5oZWlnaHQvMiksYy51bmlmb3JtMmYodGhpcy5kZWZhdWx0U2hhZGVyLm9mZnNldFZlY3RvciwtaC54LC1oLnkpLGMuY29sb3JNYXNrKCEwLCEwLCEwLCEwKSxjLmNsZWFyQ29sb3IoMCwwLDAsMCksYy5jbGVhcihjLkNPTE9SX0JVRkZFUl9CSVQpLGEuX2dsRmlsdGVyVGV4dHVyZT1nfSxiLldlYkdMRmlsdGVyTWFuYWdlci5wcm90b3R5cGUucG9wRmlsdGVyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nbCxjPXRoaXMuZmlsdGVyU3RhY2sucG9wKCksZD1jLl9maWx0ZXJBcmVhLGU9Yy5fZ2xGaWx0ZXJUZXh0dXJlLGY9dGhpcy5yZW5kZXJTZXNzaW9uLnByb2plY3Rpb24sZz10aGlzLnJlbmRlclNlc3Npb24ub2Zmc2V0O2lmKGMuZmlsdGVyUGFzc2VzLmxlbmd0aD4xKXthLnZpZXdwb3J0KDAsMCxkLndpZHRoLGQuaGVpZ2h0KSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy52ZXJ0ZXhCdWZmZXIpLHRoaXMudmVydGV4QXJyYXlbMF09MCx0aGlzLnZlcnRleEFycmF5WzFdPWQuaGVpZ2h0LHRoaXMudmVydGV4QXJyYXlbMl09ZC53aWR0aCx0aGlzLnZlcnRleEFycmF5WzNdPWQuaGVpZ2h0LHRoaXMudmVydGV4QXJyYXlbNF09MCx0aGlzLnZlcnRleEFycmF5WzVdPTAsdGhpcy52ZXJ0ZXhBcnJheVs2XT1kLndpZHRoLHRoaXMudmVydGV4QXJyYXlbN109MCxhLmJ1ZmZlclN1YkRhdGEoYS5BUlJBWV9CVUZGRVIsMCx0aGlzLnZlcnRleEFycmF5KSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy51dkJ1ZmZlciksdGhpcy51dkFycmF5WzJdPWQud2lkdGgvdGhpcy53aWR0aCx0aGlzLnV2QXJyYXlbNV09ZC5oZWlnaHQvdGhpcy5oZWlnaHQsdGhpcy51dkFycmF5WzZdPWQud2lkdGgvdGhpcy53aWR0aCx0aGlzLnV2QXJyYXlbN109ZC5oZWlnaHQvdGhpcy5oZWlnaHQsYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy51dkFycmF5KTt2YXIgaD1lLGk9dGhpcy50ZXh0dXJlUG9vbC5wb3AoKTtpfHwoaT1uZXcgYi5GaWx0ZXJUZXh0dXJlKHRoaXMuZ2wsdGhpcy53aWR0aCx0aGlzLmhlaWdodCkpLGkucmVzaXplKHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLGEuYmluZEZyYW1lYnVmZmVyKGEuRlJBTUVCVUZGRVIsaS5mcmFtZUJ1ZmZlciksYS5jbGVhcihhLkNPTE9SX0JVRkZFUl9CSVQpLGEuZGlzYWJsZShhLkJMRU5EKTtmb3IodmFyIGo9MDtqPGMuZmlsdGVyUGFzc2VzLmxlbmd0aC0xO2orKyl7dmFyIGs9Yy5maWx0ZXJQYXNzZXNbal07YS5iaW5kRnJhbWVidWZmZXIoYS5GUkFNRUJVRkZFUixpLmZyYW1lQnVmZmVyKSxhLmFjdGl2ZVRleHR1cmUoYS5URVhUVVJFMCksYS5iaW5kVGV4dHVyZShhLlRFWFRVUkVfMkQsaC50ZXh0dXJlKSx0aGlzLmFwcGx5RmlsdGVyUGFzcyhrLGQsZC53aWR0aCxkLmhlaWdodCk7dmFyIGw9aDtoPWksaT1sfWEuZW5hYmxlKGEuQkxFTkQpLGU9aCx0aGlzLnRleHR1cmVQb29sLnB1c2goaSl9dmFyIG09Yy5maWx0ZXJQYXNzZXNbYy5maWx0ZXJQYXNzZXMubGVuZ3RoLTFdO3RoaXMub2Zmc2V0WC09ZC54LHRoaXMub2Zmc2V0WS09ZC55O3ZhciBuPXRoaXMud2lkdGgsbz10aGlzLmhlaWdodCxwPTAscT0wLHI9dGhpcy5idWZmZXI7aWYoMD09PXRoaXMuZmlsdGVyU3RhY2subGVuZ3RoKWEuY29sb3JNYXNrKCEwLCEwLCEwLCEwKTtlbHNle3ZhciBzPXRoaXMuZmlsdGVyU3RhY2tbdGhpcy5maWx0ZXJTdGFjay5sZW5ndGgtMV07ZD1zLl9maWx0ZXJBcmVhLG49ZC53aWR0aCxvPWQuaGVpZ2h0LHA9ZC54LHE9ZC55LHI9cy5fZ2xGaWx0ZXJUZXh0dXJlLmZyYW1lQnVmZmVyfWYueD1uLzIsZi55PS1vLzIsZy54PXAsZy55PXEsZD1jLl9maWx0ZXJBcmVhO3ZhciB0PWQueC1wLHU9ZC55LXE7YS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QnVmZmVyKSx0aGlzLnZlcnRleEFycmF5WzBdPXQsdGhpcy52ZXJ0ZXhBcnJheVsxXT11K2QuaGVpZ2h0LHRoaXMudmVydGV4QXJyYXlbMl09dCtkLndpZHRoLHRoaXMudmVydGV4QXJyYXlbM109dStkLmhlaWdodCx0aGlzLnZlcnRleEFycmF5WzRdPXQsdGhpcy52ZXJ0ZXhBcnJheVs1XT11LHRoaXMudmVydGV4QXJyYXlbNl09dCtkLndpZHRoLHRoaXMudmVydGV4QXJyYXlbN109dSxhLmJ1ZmZlclN1YkRhdGEoYS5BUlJBWV9CVUZGRVIsMCx0aGlzLnZlcnRleEFycmF5KSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy51dkJ1ZmZlciksdGhpcy51dkFycmF5WzJdPWQud2lkdGgvdGhpcy53aWR0aCx0aGlzLnV2QXJyYXlbNV09ZC5oZWlnaHQvdGhpcy5oZWlnaHQsdGhpcy51dkFycmF5WzZdPWQud2lkdGgvdGhpcy53aWR0aCx0aGlzLnV2QXJyYXlbN109ZC5oZWlnaHQvdGhpcy5oZWlnaHQsYS5idWZmZXJTdWJEYXRhKGEuQVJSQVlfQlVGRkVSLDAsdGhpcy51dkFycmF5KSxhLnZpZXdwb3J0KDAsMCxuLG8pLGEuYmluZEZyYW1lYnVmZmVyKGEuRlJBTUVCVUZGRVIsciksYS5hY3RpdmVUZXh0dXJlKGEuVEVYVFVSRTApLGEuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELGUudGV4dHVyZSksdGhpcy5hcHBseUZpbHRlclBhc3MobSxkLG4sbyksdGhpcy5yZW5kZXJTZXNzaW9uLnNoYWRlck1hbmFnZXIuc2V0U2hhZGVyKHRoaXMuZGVmYXVsdFNoYWRlciksYS51bmlmb3JtMmYodGhpcy5kZWZhdWx0U2hhZGVyLnByb2plY3Rpb25WZWN0b3Isbi8yLC1vLzIpLGEudW5pZm9ybTJmKHRoaXMuZGVmYXVsdFNoYWRlci5vZmZzZXRWZWN0b3IsLXAsLXEpLHRoaXMudGV4dHVyZVBvb2wucHVzaChlKSxjLl9nbEZpbHRlclRleHR1cmU9bnVsbH0sYi5XZWJHTEZpbHRlck1hbmFnZXIucHJvdG90eXBlLmFwcGx5RmlsdGVyUGFzcz1mdW5jdGlvbihhLGMsZCxlKXt2YXIgZj10aGlzLmdsLGc9YS5zaGFkZXJzW2YuaWRdO2d8fChnPW5ldyBiLlBpeGlTaGFkZXIoZiksZy5mcmFnbWVudFNyYz1hLmZyYWdtZW50U3JjLGcudW5pZm9ybXM9YS51bmlmb3JtcyxnLmluaXQoKSxhLnNoYWRlcnNbZi5pZF09ZyksdGhpcy5yZW5kZXJTZXNzaW9uLnNoYWRlck1hbmFnZXIuc2V0U2hhZGVyKGcpLGYudW5pZm9ybTJmKGcucHJvamVjdGlvblZlY3RvcixkLzIsLWUvMiksZi51bmlmb3JtMmYoZy5vZmZzZXRWZWN0b3IsMCwwKSxhLnVuaWZvcm1zLmRpbWVuc2lvbnMmJihhLnVuaWZvcm1zLmRpbWVuc2lvbnMudmFsdWVbMF09dGhpcy53aWR0aCxhLnVuaWZvcm1zLmRpbWVuc2lvbnMudmFsdWVbMV09dGhpcy5oZWlnaHQsYS51bmlmb3Jtcy5kaW1lbnNpb25zLnZhbHVlWzJdPXRoaXMudmVydGV4QXJyYXlbMF0sYS51bmlmb3Jtcy5kaW1lbnNpb25zLnZhbHVlWzNdPXRoaXMudmVydGV4QXJyYXlbNV0pLGcuc3luY1VuaWZvcm1zKCksZi5iaW5kQnVmZmVyKGYuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QnVmZmVyKSxmLnZlcnRleEF0dHJpYlBvaW50ZXIoZy5hVmVydGV4UG9zaXRpb24sMixmLkZMT0FULCExLDAsMCksZi5iaW5kQnVmZmVyKGYuQVJSQVlfQlVGRkVSLHRoaXMudXZCdWZmZXIpLGYudmVydGV4QXR0cmliUG9pbnRlcihnLmFUZXh0dXJlQ29vcmQsMixmLkZMT0FULCExLDAsMCksZi5iaW5kQnVmZmVyKGYuQVJSQVlfQlVGRkVSLHRoaXMuY29sb3JCdWZmZXIpLGYudmVydGV4QXR0cmliUG9pbnRlcihnLmNvbG9yQXR0cmlidXRlLDIsZi5GTE9BVCwhMSwwLDApLGYuYmluZEJ1ZmZlcihmLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kZXhCdWZmZXIpLGYuZHJhd0VsZW1lbnRzKGYuVFJJQU5HTEVTLDYsZi5VTlNJR05FRF9TSE9SVCwwKSx0aGlzLnJlbmRlclNlc3Npb24uZHJhd0NvdW50Kyt9LGIuV2ViR0xGaWx0ZXJNYW5hZ2VyLnByb3RvdHlwZS5pbml0U2hhZGVyQnVmZmVycz1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2w7dGhpcy52ZXJ0ZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLnV2QnVmZmVyPWEuY3JlYXRlQnVmZmVyKCksdGhpcy5jb2xvckJ1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuaW5kZXhCdWZmZXI9YS5jcmVhdGVCdWZmZXIoKSx0aGlzLnZlcnRleEFycmF5PW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwxLDAsMCwxLDEsMV0pLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMudmVydGV4QXJyYXksYS5TVEFUSUNfRFJBVyksdGhpcy51dkFycmF5PW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwxLDAsMCwxLDEsMV0pLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLnV2QnVmZmVyKSxhLmJ1ZmZlckRhdGEoYS5BUlJBWV9CVUZGRVIsdGhpcy51dkFycmF5LGEuU1RBVElDX0RSQVcpLHRoaXMuY29sb3JBcnJheT1uZXcgRmxvYXQzMkFycmF5KFsxLDE2Nzc3MjE1LDEsMTY3NzcyMTUsMSwxNjc3NzIxNSwxLDE2Nzc3MjE1XSksYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMuY29sb3JCdWZmZXIpLGEuYnVmZmVyRGF0YShhLkFSUkFZX0JVRkZFUix0aGlzLmNvbG9yQXJyYXksYS5TVEFUSUNfRFJBVyksYS5iaW5kQnVmZmVyKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5pbmRleEJ1ZmZlciksYS5idWZmZXJEYXRhKGEuRUxFTUVOVF9BUlJBWV9CVUZGRVIsbmV3IFVpbnQxNkFycmF5KFswLDEsMiwxLDMsMl0pLGEuU1RBVElDX0RSQVcpfSxiLldlYkdMRmlsdGVyTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2w7dGhpcy5maWx0ZXJTdGFjaz1udWxsLHRoaXMub2Zmc2V0WD0wLHRoaXMub2Zmc2V0WT0wO2Zvcih2YXIgYj0wO2I8dGhpcy50ZXh0dXJlUG9vbC5sZW5ndGg7YisrKXRoaXMudGV4dHVyZVBvb2xbYl0uZGVzdHJveSgpO3RoaXMudGV4dHVyZVBvb2w9bnVsbCxhLmRlbGV0ZUJ1ZmZlcih0aGlzLnZlcnRleEJ1ZmZlciksYS5kZWxldGVCdWZmZXIodGhpcy51dkJ1ZmZlciksYS5kZWxldGVCdWZmZXIodGhpcy5jb2xvckJ1ZmZlciksYS5kZWxldGVCdWZmZXIodGhpcy5pbmRleEJ1ZmZlcil9LGIuRmlsdGVyVGV4dHVyZT1mdW5jdGlvbihhLGMsZCxlKXt0aGlzLmdsPWEsdGhpcy5mcmFtZUJ1ZmZlcj1hLmNyZWF0ZUZyYW1lYnVmZmVyKCksdGhpcy50ZXh0dXJlPWEuY3JlYXRlVGV4dHVyZSgpLGU9ZXx8Yi5zY2FsZU1vZGVzLkRFRkFVTFQsYS5iaW5kVGV4dHVyZShhLlRFWFRVUkVfMkQsdGhpcy50ZXh0dXJlKSxhLnRleFBhcmFtZXRlcmkoYS5URVhUVVJFXzJELGEuVEVYVFVSRV9NQUdfRklMVEVSLGU9PT1iLnNjYWxlTW9kZXMuTElORUFSP2EuTElORUFSOmEuTkVBUkVTVCksYS50ZXhQYXJhbWV0ZXJpKGEuVEVYVFVSRV8yRCxhLlRFWFRVUkVfTUlOX0ZJTFRFUixlPT09Yi5zY2FsZU1vZGVzLkxJTkVBUj9hLkxJTkVBUjphLk5FQVJFU1QpLGEudGV4UGFyYW1ldGVyaShhLlRFWFRVUkVfMkQsYS5URVhUVVJFX1dSQVBfUyxhLkNMQU1QX1RPX0VER0UpLGEudGV4UGFyYW1ldGVyaShhLlRFWFRVUkVfMkQsYS5URVhUVVJFX1dSQVBfVCxhLkNMQU1QX1RPX0VER0UpLGEuYmluZEZyYW1lYnVmZmVyKGEuRlJBTUVCVUZGRVIsdGhpcy5mcmFtZWJ1ZmZlciksYS5iaW5kRnJhbWVidWZmZXIoYS5GUkFNRUJVRkZFUix0aGlzLmZyYW1lQnVmZmVyKSxhLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGEuRlJBTUVCVUZGRVIsYS5DT0xPUl9BVFRBQ0hNRU5UMCxhLlRFWFRVUkVfMkQsdGhpcy50ZXh0dXJlLDApLHRoaXMucmVuZGVyQnVmZmVyPWEuY3JlYXRlUmVuZGVyYnVmZmVyKCksYS5iaW5kUmVuZGVyYnVmZmVyKGEuUkVOREVSQlVGRkVSLHRoaXMucmVuZGVyQnVmZmVyKSxhLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGEuRlJBTUVCVUZGRVIsYS5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQsYS5SRU5ERVJCVUZGRVIsdGhpcy5yZW5kZXJCdWZmZXIpLHRoaXMucmVzaXplKGMsZCl9LGIuRmlsdGVyVGV4dHVyZS5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdsO2EuY2xlYXJDb2xvcigwLDAsMCwwKSxhLmNsZWFyKGEuQ09MT1JfQlVGRkVSX0JJVCl9LGIuRmlsdGVyVGV4dHVyZS5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKGEsYil7aWYodGhpcy53aWR0aCE9PWF8fHRoaXMuaGVpZ2h0IT09Yil7dGhpcy53aWR0aD1hLHRoaXMuaGVpZ2h0PWI7dmFyIGM9dGhpcy5nbDtjLmJpbmRUZXh0dXJlKGMuVEVYVFVSRV8yRCx0aGlzLnRleHR1cmUpLGMudGV4SW1hZ2UyRChjLlRFWFRVUkVfMkQsMCxjLlJHQkEsYSxiLDAsYy5SR0JBLGMuVU5TSUdORURfQllURSxudWxsKSxjLmJpbmRSZW5kZXJidWZmZXIoYy5SRU5ERVJCVUZGRVIsdGhpcy5yZW5kZXJCdWZmZXIpLGMucmVuZGVyYnVmZmVyU3RvcmFnZShjLlJFTkRFUkJVRkZFUixjLkRFUFRIX1NURU5DSUwsYSxiKX19LGIuRmlsdGVyVGV4dHVyZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2w7YS5kZWxldGVGcmFtZWJ1ZmZlcih0aGlzLmZyYW1lQnVmZmVyKSxhLmRlbGV0ZVRleHR1cmUodGhpcy50ZXh0dXJlKSx0aGlzLmZyYW1lQnVmZmVyPW51bGwsdGhpcy50ZXh0dXJlPW51bGx9LGIuQ2FudmFzTWFza01hbmFnZXI9ZnVuY3Rpb24oKXt9LGIuQ2FudmFzTWFza01hbmFnZXIucHJvdG90eXBlLnB1c2hNYXNrPWZ1bmN0aW9uKGEsYyl7Yy5zYXZlKCk7dmFyIGQ9YS5hbHBoYSxlPWEud29ybGRUcmFuc2Zvcm07Yy5zZXRUcmFuc2Zvcm0oZS5hLGUuYyxlLmIsZS5kLGUudHgsZS50eSksYi5DYW52YXNHcmFwaGljcy5yZW5kZXJHcmFwaGljc01hc2soYSxjKSxjLmNsaXAoKSxhLndvcmxkQWxwaGE9ZH0sYi5DYW52YXNNYXNrTWFuYWdlci5wcm90b3R5cGUucG9wTWFzaz1mdW5jdGlvbihhKXthLnJlc3RvcmUoKX0sYi5DYW52YXNUaW50ZXI9ZnVuY3Rpb24oKXt9LGIuQ2FudmFzVGludGVyLmdldFRpbnRlZFRleHR1cmU9ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLnRleHR1cmU7Yz1iLkNhbnZhc1RpbnRlci5yb3VuZENvbG9yKGMpO3ZhciBlPVwiI1wiKyhcIjAwMDAwXCIrKDB8YykudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpO2lmKGQudGludENhY2hlPWQudGludENhY2hlfHx7fSxkLnRpbnRDYWNoZVtlXSlyZXR1cm4gZC50aW50Q2FjaGVbZV07dmFyIGY9Yi5DYW52YXNUaW50ZXIuY2FudmFzfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO2lmKGIuQ2FudmFzVGludGVyLnRpbnRNZXRob2QoZCxjLGYpLGIuQ2FudmFzVGludGVyLmNvbnZlcnRUaW50VG9JbWFnZSl7dmFyIGc9bmV3IEltYWdlO2cuc3JjPWYudG9EYXRhVVJMKCksZC50aW50Q2FjaGVbZV09Z31lbHNlIGQudGludENhY2hlW2VdPWYsYi5DYW52YXNUaW50ZXIuY2FudmFzPW51bGw7cmV0dXJuIGZ9LGIuQ2FudmFzVGludGVyLnRpbnRXaXRoTXVsdGlwbHk9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMuZ2V0Q29udGV4dChcIjJkXCIpLGU9YS5mcmFtZTtjLndpZHRoPWUud2lkdGgsYy5oZWlnaHQ9ZS5oZWlnaHQsZC5maWxsU3R5bGU9XCIjXCIrKFwiMDAwMDBcIisoMHxiKS50b1N0cmluZygxNikpLnN1YnN0cigtNiksZC5maWxsUmVjdCgwLDAsZS53aWR0aCxlLmhlaWdodCksZC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249XCJtdWx0aXBseVwiLGQuZHJhd0ltYWdlKGEuYmFzZVRleHR1cmUuc291cmNlLGUueCxlLnksZS53aWR0aCxlLmhlaWdodCwwLDAsZS53aWR0aCxlLmhlaWdodCksZC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249XCJkZXN0aW5hdGlvbi1hdG9wXCIsZC5kcmF3SW1hZ2UoYS5iYXNlVGV4dHVyZS5zb3VyY2UsZS54LGUueSxlLndpZHRoLGUuaGVpZ2h0LDAsMCxlLndpZHRoLGUuaGVpZ2h0KX0sYi5DYW52YXNUaW50ZXIudGludFdpdGhPdmVybGF5PWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1jLmdldENvbnRleHQoXCIyZFwiKSxlPWEuZnJhbWU7Yy53aWR0aD1lLndpZHRoLGMuaGVpZ2h0PWUuaGVpZ2h0LGQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwiY29weVwiLGQuZmlsbFN0eWxlPVwiI1wiKyhcIjAwMDAwXCIrKDB8YikudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpLGQuZmlsbFJlY3QoMCwwLGUud2lkdGgsZS5oZWlnaHQpLGQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwiZGVzdGluYXRpb24tYXRvcFwiLGQuZHJhd0ltYWdlKGEuYmFzZVRleHR1cmUuc291cmNlLGUueCxlLnksZS53aWR0aCxlLmhlaWdodCwwLDAsZS53aWR0aCxlLmhlaWdodCl9LGIuQ2FudmFzVGludGVyLnRpbnRXaXRoUGVyUGl4ZWw9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWQuZ2V0Q29udGV4dChcIjJkXCIpLGY9YS5mcmFtZTtkLndpZHRoPWYud2lkdGgsZC5oZWlnaHQ9Zi5oZWlnaHQsZS5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249XCJjb3B5XCIsZS5kcmF3SW1hZ2UoYS5iYXNlVGV4dHVyZS5zb3VyY2UsZi54LGYueSxmLndpZHRoLGYuaGVpZ2h0LDAsMCxmLndpZHRoLGYuaGVpZ2h0KTtmb3IodmFyIGc9Yi5oZXgycmdiKGMpLGg9Z1swXSxpPWdbMV0saj1nWzJdLGs9ZS5nZXRJbWFnZURhdGEoMCwwLGYud2lkdGgsZi5oZWlnaHQpLGw9ay5kYXRhLG09MDttPGwubGVuZ3RoO20rPTQpbFttKzBdKj1oLGxbbSsxXSo9aSxsW20rMl0qPWo7ZS5wdXRJbWFnZURhdGEoaywwLDApfSxiLkNhbnZhc1RpbnRlci5yb3VuZENvbG9yPWZ1bmN0aW9uKGEpe3ZhciBjPWIuQ2FudmFzVGludGVyLmNhY2hlU3RlcHNQZXJDb2xvckNoYW5uZWwsZD1iLmhleDJyZ2IoYSk7cmV0dXJuIGRbMF09TWF0aC5taW4oMjU1LGRbMF0vYypjKSxkWzFdPU1hdGgubWluKDI1NSxkWzFdL2MqYyksZFsyXT1NYXRoLm1pbigyNTUsZFsyXS9jKmMpLGIucmdiMmhleChkKX0sYi5DYW52YXNUaW50ZXIuY2FjaGVTdGVwc1BlckNvbG9yQ2hhbm5lbD04LGIuQ2FudmFzVGludGVyLmNvbnZlcnRUaW50VG9JbWFnZT0hMSxiLkNhbnZhc1RpbnRlci5jYW5Vc2VNdWx0aXBseT1iLmNhblVzZU5ld0NhbnZhc0JsZW5kTW9kZXMoKSxiLkNhbnZhc1RpbnRlci50aW50TWV0aG9kPWIuQ2FudmFzVGludGVyLmNhblVzZU11bHRpcGx5P2IuQ2FudmFzVGludGVyLnRpbnRXaXRoTXVsdGlwbHk6Yi5DYW52YXNUaW50ZXIudGludFdpdGhQZXJQaXhlbCxiLkNhbnZhc1JlbmRlcmVyPWZ1bmN0aW9uKGEsYyxkLGUpe2IuZGVmYXVsdFJlbmRlcmVyfHwoYi5zYXlIZWxsbyhcIkNhbnZhc1wiKSxiLmRlZmF1bHRSZW5kZXJlcj10aGlzKSx0aGlzLnR5cGU9Yi5DQU5WQVNfUkVOREVSRVIsdGhpcy5jbGVhckJlZm9yZVJlbmRlcj0hMCx0aGlzLnRyYW5zcGFyZW50PSEhZSxiLmJsZW5kTW9kZXNDYW52YXN8fChiLmJsZW5kTW9kZXNDYW52YXM9W10sYi5jYW5Vc2VOZXdDYW52YXNCbGVuZE1vZGVzKCk/KGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTk9STUFMXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5BRERdPVwibGlnaHRlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTVVMVElQTFldPVwibXVsdGlwbHlcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLlNDUkVFTl09XCJzY3JlZW5cIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLk9WRVJMQVldPVwib3ZlcmxheVwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuREFSS0VOXT1cImRhcmtlblwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTElHSFRFTl09XCJsaWdodGVuXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5DT0xPUl9ET0RHRV09XCJjb2xvci1kb2RnZVwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQ09MT1JfQlVSTl09XCJjb2xvci1idXJuXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5IQVJEX0xJR0hUXT1cImhhcmQtbGlnaHRcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLlNPRlRfTElHSFRdPVwic29mdC1saWdodFwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuRElGRkVSRU5DRV09XCJkaWZmZXJlbmNlXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5FWENMVVNJT05dPVwiZXhjbHVzaW9uXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5IVUVdPVwiaHVlXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5TQVRVUkFUSU9OXT1cInNhdHVyYXRpb25cIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkNPTE9SXT1cImNvbG9yXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5MVU1JTk9TSVRZXT1cImx1bWlub3NpdHlcIik6KGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTk9STUFMXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5BRERdPVwibGlnaHRlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuTVVMVElQTFldPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLlNDUkVFTl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuT1ZFUkxBWV09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuREFSS0VOXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5MSUdIVEVOXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5DT0xPUl9ET0RHRV09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuQ09MT1JfQlVSTl09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuSEFSRF9MSUdIVF09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuU09GVF9MSUdIVF09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuRElGRkVSRU5DRV09XCJzb3VyY2Utb3ZlclwiLGIuYmxlbmRNb2Rlc0NhbnZhc1tiLmJsZW5kTW9kZXMuRVhDTFVTSU9OXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5IVUVdPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLlNBVFVSQVRJT05dPVwic291cmNlLW92ZXJcIixiLmJsZW5kTW9kZXNDYW52YXNbYi5ibGVuZE1vZGVzLkNPTE9SXT1cInNvdXJjZS1vdmVyXCIsYi5ibGVuZE1vZGVzQ2FudmFzW2IuYmxlbmRNb2Rlcy5MVU1JTk9TSVRZXT1cInNvdXJjZS1vdmVyXCIpKSx0aGlzLndpZHRoPWF8fDgwMCx0aGlzLmhlaWdodD1jfHw2MDAsdGhpcy52aWV3PWR8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksdGhpcy5jb250ZXh0PXRoaXMudmlldy5nZXRDb250ZXh0KFwiMmRcIix7YWxwaGE6dGhpcy50cmFuc3BhcmVudH0pLHRoaXMucmVmcmVzaD0hMCx0aGlzLnZpZXcud2lkdGg9dGhpcy53aWR0aCx0aGlzLnZpZXcuaGVpZ2h0PXRoaXMuaGVpZ2h0LHRoaXMuY291bnQ9MCx0aGlzLm1hc2tNYW5hZ2VyPW5ldyBiLkNhbnZhc01hc2tNYW5hZ2VyLHRoaXMucmVuZGVyU2Vzc2lvbj17Y29udGV4dDp0aGlzLmNvbnRleHQsbWFza01hbmFnZXI6dGhpcy5tYXNrTWFuYWdlcixzY2FsZU1vZGU6bnVsbCxzbW9vdGhQcm9wZXJ0eTpudWxsLHJvdW5kUGl4ZWxzOiExfSxcImltYWdlU21vb3RoaW5nRW5hYmxlZFwiaW4gdGhpcy5jb250ZXh0P3RoaXMucmVuZGVyU2Vzc2lvbi5zbW9vdGhQcm9wZXJ0eT1cImltYWdlU21vb3RoaW5nRW5hYmxlZFwiOlwid2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkXCJpbiB0aGlzLmNvbnRleHQ/dGhpcy5yZW5kZXJTZXNzaW9uLnNtb290aFByb3BlcnR5PVwid2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkXCI6XCJtb3pJbWFnZVNtb290aGluZ0VuYWJsZWRcImluIHRoaXMuY29udGV4dD90aGlzLnJlbmRlclNlc3Npb24uc21vb3RoUHJvcGVydHk9XCJtb3pJbWFnZVNtb290aGluZ0VuYWJsZWRcIjpcIm9JbWFnZVNtb290aGluZ0VuYWJsZWRcImluIHRoaXMuY29udGV4dCYmKHRoaXMucmVuZGVyU2Vzc2lvbi5zbW9vdGhQcm9wZXJ0eT1cIm9JbWFnZVNtb290aGluZ0VuYWJsZWRcIil9LGIuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQ2FudmFzUmVuZGVyZXIsYi5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKGEpe2IudGV4dHVyZXNUb1VwZGF0ZS5sZW5ndGg9MCxiLnRleHR1cmVzVG9EZXN0cm95Lmxlbmd0aD0wLGEudXBkYXRlVHJhbnNmb3JtKCksdGhpcy5jb250ZXh0LnNldFRyYW5zZm9ybSgxLDAsMCwxLDAsMCksdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhPTEsbmF2aWdhdG9yLmlzQ29jb29uSlMmJnRoaXMudmlldy5zY3JlZW5jYW52YXMmJih0aGlzLmNvbnRleHQuZmlsbFN0eWxlPVwiYmxhY2tcIix0aGlzLmNvbnRleHQuY2xlYXIoKSksIXRoaXMudHJhbnNwYXJlbnQmJnRoaXMuY2xlYXJCZWZvcmVSZW5kZXI/KHRoaXMuY29udGV4dC5maWxsU3R5bGU9YS5iYWNrZ3JvdW5kQ29sb3JTdHJpbmcsdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSk6dGhpcy50cmFuc3BhcmVudCYmdGhpcy5jbGVhckJlZm9yZVJlbmRlciYmdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLDAsdGhpcy53aWR0aCx0aGlzLmhlaWdodCksdGhpcy5yZW5kZXJEaXNwbGF5T2JqZWN0KGEpLGEuaW50ZXJhY3RpdmUmJihhLl9pbnRlcmFjdGl2ZUV2ZW50c0FkZGVkfHwoYS5faW50ZXJhY3RpdmVFdmVudHNBZGRlZD0hMCxhLmludGVyYWN0aW9uTWFuYWdlci5zZXRUYXJnZXQodGhpcykpKSxiLlRleHR1cmUuZnJhbWVVcGRhdGVzLmxlbmd0aD4wJiYoYi5UZXh0dXJlLmZyYW1lVXBkYXRlcy5sZW5ndGg9MClcbn0sYi5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKGEsYil7dGhpcy53aWR0aD1hLHRoaXMuaGVpZ2h0PWIsdGhpcy52aWV3LndpZHRoPWEsdGhpcy52aWV3LmhlaWdodD1ifSxiLkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJEaXNwbGF5T2JqZWN0PWZ1bmN0aW9uKGEsYil7dGhpcy5yZW5kZXJTZXNzaW9uLmNvbnRleHQ9Ynx8dGhpcy5jb250ZXh0LGEuX3JlbmRlckNhbnZhcyh0aGlzLnJlbmRlclNlc3Npb24pfSxiLkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJTdHJpcEZsYXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5jb250ZXh0LGM9YS52ZXJ0aWNpZXMsZD1jLmxlbmd0aC8yO3RoaXMuY291bnQrKyxiLmJlZ2luUGF0aCgpO2Zvcih2YXIgZT0xO2QtMj5lO2UrKyl7dmFyIGY9MiplLGc9Y1tmXSxoPWNbZisyXSxpPWNbZis0XSxqPWNbZisxXSxrPWNbZiszXSxsPWNbZis1XTtiLm1vdmVUbyhnLGopLGIubGluZVRvKGgsayksYi5saW5lVG8oaSxsKX1iLmZpbGxTdHlsZT1cIiNGRjAwMDBcIixiLmZpbGwoKSxiLmNsb3NlUGF0aCgpfSxiLkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJTdHJpcD1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmNvbnRleHQsYz1hLnZlcnRpY2llcyxkPWEudXZzLGU9Yy5sZW5ndGgvMjt0aGlzLmNvdW50Kys7Zm9yKHZhciBmPTE7ZS0yPmY7ZisrKXt2YXIgZz0yKmYsaD1jW2ddLGk9Y1tnKzJdLGo9Y1tnKzRdLGs9Y1tnKzFdLGw9Y1tnKzNdLG09Y1tnKzVdLG49ZFtnXSphLnRleHR1cmUud2lkdGgsbz1kW2crMl0qYS50ZXh0dXJlLndpZHRoLHA9ZFtnKzRdKmEudGV4dHVyZS53aWR0aCxxPWRbZysxXSphLnRleHR1cmUuaGVpZ2h0LHI9ZFtnKzNdKmEudGV4dHVyZS5oZWlnaHQscz1kW2crNV0qYS50ZXh0dXJlLmhlaWdodDtiLnNhdmUoKSxiLmJlZ2luUGF0aCgpLGIubW92ZVRvKGgsayksYi5saW5lVG8oaSxsKSxiLmxpbmVUbyhqLG0pLGIuY2xvc2VQYXRoKCksYi5jbGlwKCk7dmFyIHQ9bipyK3EqcCtvKnMtcipwLXEqby1uKnMsdT1oKnIrcSpqK2kqcy1yKmotcSppLWgqcyx2PW4qaStoKnArbypqLWkqcC1oKm8tbipqLHc9bipyKmorcSppKnAraCpvKnMtaCpyKnAtcSpvKmotbippKnMseD1rKnIrcSptK2wqcy1yKm0tcSpsLWsqcyx5PW4qbCtrKnArbyptLWwqcC1rKm8tbiptLHo9bipyKm0rcSpsKnAraypvKnMtaypyKnAtcSpvKm0tbipsKnM7Yi50cmFuc2Zvcm0odS90LHgvdCx2L3QseS90LHcvdCx6L3QpLGIuZHJhd0ltYWdlKGEudGV4dHVyZS5iYXNlVGV4dHVyZS5zb3VyY2UsMCwwKSxiLnJlc3RvcmUoKX19LGIuQ2FudmFzQnVmZmVyPWZ1bmN0aW9uKGEsYil7dGhpcy53aWR0aD1hLHRoaXMuaGVpZ2h0PWIsdGhpcy5jYW52YXM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLmNvbnRleHQ9dGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLHRoaXMuY2FudmFzLndpZHRoPWEsdGhpcy5jYW52YXMuaGVpZ2h0PWJ9LGIuQ2FudmFzQnVmZmVyLnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMuY29udGV4dC5jbGVhclJlY3QoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpfSxiLkNhbnZhc0J1ZmZlci5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKGEsYil7dGhpcy53aWR0aD10aGlzLmNhbnZhcy53aWR0aD1hLHRoaXMuaGVpZ2h0PXRoaXMuY2FudmFzLmhlaWdodD1ifSxiLkNhbnZhc0dyYXBoaWNzPWZ1bmN0aW9uKCl7fSxiLkNhbnZhc0dyYXBoaWNzLnJlbmRlckdyYXBoaWNzPWZ1bmN0aW9uKGEsYyl7Zm9yKHZhciBkPWEud29ybGRBbHBoYSxlPVwiXCIsZj0wO2Y8YS5ncmFwaGljc0RhdGEubGVuZ3RoO2YrKyl7dmFyIGc9YS5ncmFwaGljc0RhdGFbZl0saD1nLnBvaW50cztpZihjLnN0cm9rZVN0eWxlPWU9XCIjXCIrKFwiMDAwMDBcIisoMHxnLmxpbmVDb2xvcikudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpLGMubGluZVdpZHRoPWcubGluZVdpZHRoLGcudHlwZT09PWIuR3JhcGhpY3MuUE9MWSl7Yy5iZWdpblBhdGgoKSxjLm1vdmVUbyhoWzBdLGhbMV0pO2Zvcih2YXIgaT0xO2k8aC5sZW5ndGgvMjtpKyspYy5saW5lVG8oaFsyKmldLGhbMippKzFdKTtoWzBdPT09aFtoLmxlbmd0aC0yXSYmaFsxXT09PWhbaC5sZW5ndGgtMV0mJmMuY2xvc2VQYXRoKCksZy5maWxsJiYoYy5nbG9iYWxBbHBoYT1nLmZpbGxBbHBoYSpkLGMuZmlsbFN0eWxlPWU9XCIjXCIrKFwiMDAwMDBcIisoMHxnLmZpbGxDb2xvcikudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpLGMuZmlsbCgpKSxnLmxpbmVXaWR0aCYmKGMuZ2xvYmFsQWxwaGE9Zy5saW5lQWxwaGEqZCxjLnN0cm9rZSgpKX1lbHNlIGlmKGcudHlwZT09PWIuR3JhcGhpY3MuUkVDVCkoZy5maWxsQ29sb3J8fDA9PT1nLmZpbGxDb2xvcikmJihjLmdsb2JhbEFscGhhPWcuZmlsbEFscGhhKmQsYy5maWxsU3R5bGU9ZT1cIiNcIisoXCIwMDAwMFwiKygwfGcuZmlsbENvbG9yKS50b1N0cmluZygxNikpLnN1YnN0cigtNiksYy5maWxsUmVjdChoWzBdLGhbMV0saFsyXSxoWzNdKSksZy5saW5lV2lkdGgmJihjLmdsb2JhbEFscGhhPWcubGluZUFscGhhKmQsYy5zdHJva2VSZWN0KGhbMF0saFsxXSxoWzJdLGhbM10pKTtlbHNlIGlmKGcudHlwZT09PWIuR3JhcGhpY3MuQ0lSQyljLmJlZ2luUGF0aCgpLGMuYXJjKGhbMF0saFsxXSxoWzJdLDAsMipNYXRoLlBJKSxjLmNsb3NlUGF0aCgpLGcuZmlsbCYmKGMuZ2xvYmFsQWxwaGE9Zy5maWxsQWxwaGEqZCxjLmZpbGxTdHlsZT1lPVwiI1wiKyhcIjAwMDAwXCIrKDB8Zy5maWxsQ29sb3IpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxjLmZpbGwoKSksZy5saW5lV2lkdGgmJihjLmdsb2JhbEFscGhhPWcubGluZUFscGhhKmQsYy5zdHJva2UoKSk7ZWxzZSBpZihnLnR5cGU9PT1iLkdyYXBoaWNzLkVMSVApe3ZhciBqPWcucG9pbnRzLGs9MipqWzJdLGw9MipqWzNdLG09alswXS1rLzIsbj1qWzFdLWwvMjtjLmJlZ2luUGF0aCgpO3ZhciBvPS41NTIyODQ4LHA9ay8yKm8scT1sLzIqbyxyPW0rayxzPW4rbCx0PW0ray8yLHU9bitsLzI7Yy5tb3ZlVG8obSx1KSxjLmJlemllckN1cnZlVG8obSx1LXEsdC1wLG4sdCxuKSxjLmJlemllckN1cnZlVG8odCtwLG4scix1LXEscix1KSxjLmJlemllckN1cnZlVG8ocix1K3EsdCtwLHMsdCxzKSxjLmJlemllckN1cnZlVG8odC1wLHMsbSx1K3EsbSx1KSxjLmNsb3NlUGF0aCgpLGcuZmlsbCYmKGMuZ2xvYmFsQWxwaGE9Zy5maWxsQWxwaGEqZCxjLmZpbGxTdHlsZT1lPVwiI1wiKyhcIjAwMDAwXCIrKDB8Zy5maWxsQ29sb3IpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxjLmZpbGwoKSksZy5saW5lV2lkdGgmJihjLmdsb2JhbEFscGhhPWcubGluZUFscGhhKmQsYy5zdHJva2UoKSl9ZWxzZSBpZihnLnR5cGU9PT1iLkdyYXBoaWNzLlJSRUMpe3ZhciB2PWhbMF0sdz1oWzFdLHg9aFsyXSx5PWhbM10sej1oWzRdLEE9TWF0aC5taW4oeCx5KS8yfDA7ej16PkE/QTp6LGMuYmVnaW5QYXRoKCksYy5tb3ZlVG8odix3K3opLGMubGluZVRvKHYsdyt5LXopLGMucXVhZHJhdGljQ3VydmVUbyh2LHcreSx2K3osdyt5KSxjLmxpbmVUbyh2K3gteix3K3kpLGMucXVhZHJhdGljQ3VydmVUbyh2K3gsdyt5LHYreCx3K3kteiksYy5saW5lVG8odit4LHcreiksYy5xdWFkcmF0aWNDdXJ2ZVRvKHYreCx3LHYreC16LHcpLGMubGluZVRvKHYreix3KSxjLnF1YWRyYXRpY0N1cnZlVG8odix3LHYsdyt6KSxjLmNsb3NlUGF0aCgpLChnLmZpbGxDb2xvcnx8MD09PWcuZmlsbENvbG9yKSYmKGMuZ2xvYmFsQWxwaGE9Zy5maWxsQWxwaGEqZCxjLmZpbGxTdHlsZT1lPVwiI1wiKyhcIjAwMDAwXCIrKDB8Zy5maWxsQ29sb3IpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KSxjLmZpbGwoKSksZy5saW5lV2lkdGgmJihjLmdsb2JhbEFscGhhPWcubGluZUFscGhhKmQsYy5zdHJva2UoKSl9fX0sYi5DYW52YXNHcmFwaGljcy5yZW5kZXJHcmFwaGljc01hc2s9ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLmdyYXBoaWNzRGF0YS5sZW5ndGg7aWYoMCE9PWQpe2Q+MSYmKGQ9MSx3aW5kb3cuY29uc29sZS5sb2coXCJQaXhpLmpzIHdhcm5pbmc6IG1hc2tzIGluIGNhbnZhcyBjYW4gb25seSBtYXNrIHVzaW5nIHRoZSBmaXJzdCBwYXRoIGluIHRoZSBncmFwaGljcyBvYmplY3RcIikpO2Zvcih2YXIgZT0wOzE+ZTtlKyspe3ZhciBmPWEuZ3JhcGhpY3NEYXRhW2VdLGc9Zi5wb2ludHM7aWYoZi50eXBlPT09Yi5HcmFwaGljcy5QT0xZKXtjLmJlZ2luUGF0aCgpLGMubW92ZVRvKGdbMF0sZ1sxXSk7Zm9yKHZhciBoPTE7aDxnLmxlbmd0aC8yO2grKyljLmxpbmVUbyhnWzIqaF0sZ1syKmgrMV0pO2dbMF09PT1nW2cubGVuZ3RoLTJdJiZnWzFdPT09Z1tnLmxlbmd0aC0xXSYmYy5jbG9zZVBhdGgoKX1lbHNlIGlmKGYudHlwZT09PWIuR3JhcGhpY3MuUkVDVCljLmJlZ2luUGF0aCgpLGMucmVjdChnWzBdLGdbMV0sZ1syXSxnWzNdKSxjLmNsb3NlUGF0aCgpO2Vsc2UgaWYoZi50eXBlPT09Yi5HcmFwaGljcy5DSVJDKWMuYmVnaW5QYXRoKCksYy5hcmMoZ1swXSxnWzFdLGdbMl0sMCwyKk1hdGguUEkpLGMuY2xvc2VQYXRoKCk7ZWxzZSBpZihmLnR5cGU9PT1iLkdyYXBoaWNzLkVMSVApe3ZhciBpPWYucG9pbnRzLGo9MippWzJdLGs9MippWzNdLGw9aVswXS1qLzIsbT1pWzFdLWsvMjtjLmJlZ2luUGF0aCgpO3ZhciBuPS41NTIyODQ4LG89ai8yKm4scD1rLzIqbixxPWwraixyPW0rayxzPWwrai8yLHQ9bStrLzI7Yy5tb3ZlVG8obCx0KSxjLmJlemllckN1cnZlVG8obCx0LXAscy1vLG0scyxtKSxjLmJlemllckN1cnZlVG8ocytvLG0scSx0LXAscSx0KSxjLmJlemllckN1cnZlVG8ocSx0K3AscytvLHIscyxyKSxjLmJlemllckN1cnZlVG8ocy1vLHIsbCx0K3AsbCx0KSxjLmNsb3NlUGF0aCgpfWVsc2UgaWYoZi50eXBlPT09Yi5HcmFwaGljcy5SUkVDKXt2YXIgdT1nWzBdLHY9Z1sxXSx3PWdbMl0seD1nWzNdLHk9Z1s0XSx6PU1hdGgubWluKHcseCkvMnwwO3k9eT56P3o6eSxjLmJlZ2luUGF0aCgpLGMubW92ZVRvKHUsdit5KSxjLmxpbmVUbyh1LHYreC15KSxjLnF1YWRyYXRpY0N1cnZlVG8odSx2K3gsdSt5LHYreCksYy5saW5lVG8odSt3LXksdit4KSxjLnF1YWRyYXRpY0N1cnZlVG8odSt3LHYreCx1K3csdit4LXkpLGMubGluZVRvKHUrdyx2K3kpLGMucXVhZHJhdGljQ3VydmVUbyh1K3csdix1K3cteSx2KSxjLmxpbmVUbyh1K3ksdiksYy5xdWFkcmF0aWNDdXJ2ZVRvKHUsdix1LHYreSksYy5jbG9zZVBhdGgoKX19fX0sYi5HcmFwaGljcz1mdW5jdGlvbigpe2IuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpLHRoaXMucmVuZGVyYWJsZT0hMCx0aGlzLmZpbGxBbHBoYT0xLHRoaXMubGluZVdpZHRoPTAsdGhpcy5saW5lQ29sb3I9XCJibGFja1wiLHRoaXMuZ3JhcGhpY3NEYXRhPVtdLHRoaXMudGludD0xNjc3NzIxNSx0aGlzLmJsZW5kTW9kZT1iLmJsZW5kTW9kZXMuTk9STUFMLHRoaXMuY3VycmVudFBhdGg9e3BvaW50czpbXX0sdGhpcy5fd2ViR0w9W10sdGhpcy5pc01hc2s9ITEsdGhpcy5ib3VuZHM9bnVsbCx0aGlzLmJvdW5kc1BhZGRpbmc9MTAsdGhpcy5kaXJ0eT0hMH0sYi5HcmFwaGljcy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlKSxiLkdyYXBoaWNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkdyYXBoaWNzLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkdyYXBoaWNzLnByb3RvdHlwZSxcImNhY2hlQXNCaXRtYXBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NhY2hlQXNCaXRtYXB9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9jYWNoZUFzQml0bWFwPWEsdGhpcy5fY2FjaGVBc0JpdG1hcD90aGlzLl9nZW5lcmF0ZUNhY2hlZFNwcml0ZSgpOih0aGlzLmRlc3Ryb3lDYWNoZWRTcHJpdGUoKSx0aGlzLmRpcnR5PSEwKX19KSxiLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lU3R5bGU9ZnVuY3Rpb24oYSxjLGQpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGh8fHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpLHRoaXMubGluZVdpZHRoPWF8fDAsdGhpcy5saW5lQ29sb3I9Y3x8MCx0aGlzLmxpbmVBbHBoYT1hcmd1bWVudHMubGVuZ3RoPDM/MTpkLHRoaXMuY3VycmVudFBhdGg9e2xpbmVXaWR0aDp0aGlzLmxpbmVXaWR0aCxsaW5lQ29sb3I6dGhpcy5saW5lQ29sb3IsbGluZUFscGhhOnRoaXMubGluZUFscGhhLGZpbGxDb2xvcjp0aGlzLmZpbGxDb2xvcixmaWxsQWxwaGE6dGhpcy5maWxsQWxwaGEsZmlsbDp0aGlzLmZpbGxpbmcscG9pbnRzOltdLHR5cGU6Yi5HcmFwaGljcy5QT0xZfSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLm1vdmVUbz1mdW5jdGlvbihhLGMpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGh8fHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpLHRoaXMuY3VycmVudFBhdGg9dGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W10sdHlwZTpiLkdyYXBoaWNzLlBPTFl9LHRoaXMuY3VycmVudFBhdGgucG9pbnRzLnB1c2goYSxjKSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmxpbmVUbz1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5wdXNoKGEsYiksdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvPWZ1bmN0aW9uKGEsYixjLGQpezA9PT10aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGgmJnRoaXMubW92ZVRvKDAsMCk7dmFyIGUsZixnPTIwLGg9dGhpcy5jdXJyZW50UGF0aC5wb2ludHM7MD09PWgubGVuZ3RoJiZ0aGlzLm1vdmVUbygwLDApO2Zvcih2YXIgaT1oW2gubGVuZ3RoLTJdLGo9aFtoLmxlbmd0aC0xXSxrPTAsbD0xO2c+PWw7bCsrKWs9bC9nLGU9aSsoYS1pKSprLGY9aisoYi1qKSprLGgucHVzaChlKyhhKyhjLWEpKmstZSkqayxmKyhiKyhkLWIpKmstZikqayk7cmV0dXJuIHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuYmV6aWVyQ3VydmVUbz1mdW5jdGlvbihhLGIsYyxkLGUsZil7MD09PXRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aCYmdGhpcy5tb3ZlVG8oMCwwKTtmb3IodmFyIGcsaCxpLGosayxsPTIwLG09dGhpcy5jdXJyZW50UGF0aC5wb2ludHMsbj1tW20ubGVuZ3RoLTJdLG89bVttLmxlbmd0aC0xXSxwPTAscT0xO2w+cTtxKyspcD1xL2wsZz0xLXAsaD1nKmcsaT1oKmcsaj1wKnAsaz1qKnAsbS5wdXNoKGkqbiszKmgqcCphKzMqZypqKmMrayplLGkqbyszKmgqcCpiKzMqZypqKmQraypmKTtyZXR1cm4gdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5hcmNUbz1mdW5jdGlvbihhLGIsYyxkLGUpezA9PT10aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5sZW5ndGgmJnRoaXMubW92ZVRvKGEsYik7dmFyIGY9dGhpcy5jdXJyZW50UGF0aC5wb2ludHMsZz1mW2YubGVuZ3RoLTJdLGg9ZltmLmxlbmd0aC0xXSxpPWgtYixqPWctYSxrPWQtYixsPWMtYSxtPU1hdGguYWJzKGkqbC1qKmspO2lmKDFlLTg+bXx8MD09PWUpZi5wdXNoKGEsYik7ZWxzZXt2YXIgbj1pKmkraipqLG89ayprK2wqbCxwPWkqaytqKmwscT1lKk1hdGguc3FydChuKS9tLHI9ZSpNYXRoLnNxcnQobykvbSxzPXEqcC9uLHQ9cipwL28sdT1xKmwrcipqLHY9cSprK3IqaSx3PWoqKHIrcykseD1pKihyK3MpLHk9bCoocSt0KSx6PWsqKHErdCksQT1NYXRoLmF0YW4yKHgtdix3LXUpLEI9TWF0aC5hdGFuMih6LXYseS11KTt0aGlzLmFyYyh1K2EsditiLGUsQSxCLGoqaz5sKmkpfXJldHVybiB0aGlzLmRpcnR5PSEwLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmFyYz1mdW5jdGlvbihhLGIsYyxkLGUsZil7dmFyIGc9YStNYXRoLmNvcyhkKSpjLGg9YitNYXRoLnNpbihkKSpjLGk9dGhpcy5jdXJyZW50UGF0aC5wb2ludHM7aWYoKDAhPT1pLmxlbmd0aCYmaVtpLmxlbmd0aC0yXSE9PWd8fGlbaS5sZW5ndGgtMV0hPT1oKSYmKHRoaXMubW92ZVRvKGcsaCksaT10aGlzLmN1cnJlbnRQYXRoLnBvaW50cyksZD09PWUpcmV0dXJuIHRoaXM7IWYmJmQ+PWU/ZSs9MipNYXRoLlBJOmYmJmU+PWQmJihkKz0yKk1hdGguUEkpO3ZhciBqPWY/LTEqKGQtZSk6ZS1kLGs9TWF0aC5hYnMoaikvKDIqTWF0aC5QSSkqNDA7aWYoMD09PWopcmV0dXJuIHRoaXM7Zm9yKHZhciBsPWovKDIqayksbT0yKmwsbj1NYXRoLmNvcyhsKSxvPU1hdGguc2luKGwpLHA9ay0xLHE9cCUxL3Ascj0wO3A+PXI7cisrKXt2YXIgcz1yK3Eqcix0PWwrZCttKnMsdT1NYXRoLmNvcyh0KSx2PS1NYXRoLnNpbih0KTtpLnB1c2goKG4qdStvKnYpKmMrYSwobiotditvKnUpKmMrYil9cmV0dXJuIHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1BhdGg9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aHx8dGhpcy5ncmFwaGljc0RhdGEucG9wKCksdGhpcy5jdXJyZW50UGF0aD10aGlzLmN1cnJlbnRQYXRoPXtsaW5lV2lkdGg6dGhpcy5saW5lV2lkdGgsbGluZUNvbG9yOnRoaXMubGluZUNvbG9yLGxpbmVBbHBoYTp0aGlzLmxpbmVBbHBoYSxmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsZmlsbEFscGhhOnRoaXMuZmlsbEFscGhhLGZpbGw6dGhpcy5maWxsaW5nLHBvaW50czpbXSx0eXBlOmIuR3JhcGhpY3MuUE9MWX0sdGhpcy5ncmFwaGljc0RhdGEucHVzaCh0aGlzLmN1cnJlbnRQYXRoKSx0aGlzLmN1cnJlbnRQYXRoLnBvaW50cz10aGlzLmN1cnJlbnRQYXRoLnBvaW50cy5jb25jYXQoYSksdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5iZWdpbkZpbGw9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5maWxsaW5nPSEwLHRoaXMuZmlsbENvbG9yPWF8fDAsdGhpcy5maWxsQWxwaGE9YXJndW1lbnRzLmxlbmd0aDwyPzE6Yix0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5lbmRGaWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZmlsbGluZz0hMSx0aGlzLmZpbGxDb2xvcj1udWxsLHRoaXMuZmlsbEFscGhhPTEsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1JlY3Q9ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIHRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aHx8dGhpcy5ncmFwaGljc0RhdGEucG9wKCksdGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W2EsYyxkLGVdLHR5cGU6Yi5HcmFwaGljcy5SRUNUfSx0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuY3VycmVudFBhdGgpLHRoaXMuZGlydHk9ITAsdGhpc30sYi5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1JvdW5kZWRSZWN0PWZ1bmN0aW9uKGEsYyxkLGUsZil7cmV0dXJuIHRoaXMuY3VycmVudFBhdGgucG9pbnRzLmxlbmd0aHx8dGhpcy5ncmFwaGljc0RhdGEucG9wKCksdGhpcy5jdXJyZW50UGF0aD17bGluZVdpZHRoOnRoaXMubGluZVdpZHRoLGxpbmVDb2xvcjp0aGlzLmxpbmVDb2xvcixsaW5lQWxwaGE6dGhpcy5saW5lQWxwaGEsZmlsbENvbG9yOnRoaXMuZmlsbENvbG9yLGZpbGxBbHBoYTp0aGlzLmZpbGxBbHBoYSxmaWxsOnRoaXMuZmlsbGluZyxwb2ludHM6W2EsYyxkLGUsZl0sdHlwZTpiLkdyYXBoaWNzLlJSRUN9LHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5jdXJyZW50UGF0aCksdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3Q2lyY2xlPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gdGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RofHx0aGlzLmdyYXBoaWNzRGF0YS5wb3AoKSx0aGlzLmN1cnJlbnRQYXRoPXtsaW5lV2lkdGg6dGhpcy5saW5lV2lkdGgsbGluZUNvbG9yOnRoaXMubGluZUNvbG9yLGxpbmVBbHBoYTp0aGlzLmxpbmVBbHBoYSxmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsZmlsbEFscGhhOnRoaXMuZmlsbEFscGhhLGZpbGw6dGhpcy5maWxsaW5nLHBvaW50czpbYSxjLGQsZF0sdHlwZTpiLkdyYXBoaWNzLkNJUkN9LHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5jdXJyZW50UGF0aCksdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3RWxsaXBzZT1mdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gdGhpcy5jdXJyZW50UGF0aC5wb2ludHMubGVuZ3RofHx0aGlzLmdyYXBoaWNzRGF0YS5wb3AoKSx0aGlzLmN1cnJlbnRQYXRoPXtsaW5lV2lkdGg6dGhpcy5saW5lV2lkdGgsbGluZUNvbG9yOnRoaXMubGluZUNvbG9yLGxpbmVBbHBoYTp0aGlzLmxpbmVBbHBoYSxmaWxsQ29sb3I6dGhpcy5maWxsQ29sb3IsZmlsbEFscGhhOnRoaXMuZmlsbEFscGhhLGZpbGw6dGhpcy5maWxsaW5nLHBvaW50czpbYSxjLGQsZV0sdHlwZTpiLkdyYXBoaWNzLkVMSVB9LHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5jdXJyZW50UGF0aCksdGhpcy5kaXJ0eT0hMCx0aGlzfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxpbmVXaWR0aD0wLHRoaXMuZmlsbGluZz0hMSx0aGlzLmRpcnR5PSEwLHRoaXMuY2xlYXJEaXJ0eT0hMCx0aGlzLmdyYXBoaWNzRGF0YT1bXSx0aGlzLmJvdW5kcz1udWxsLHRoaXN9LGIuR3JhcGhpY3MucHJvdG90eXBlLmdlbmVyYXRlVGV4dHVyZT1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2V0Qm91bmRzKCksYz1uZXcgYi5DYW52YXNCdWZmZXIoYS53aWR0aCxhLmhlaWdodCksZD1iLlRleHR1cmUuZnJvbUNhbnZhcyhjLmNhbnZhcyk7cmV0dXJuIGMuY29udGV4dC50cmFuc2xhdGUoLWEueCwtYS55KSxiLkNhbnZhc0dyYXBoaWNzLnJlbmRlckdyYXBoaWNzKHRoaXMsYy5jb250ZXh0KSxkfSxiLkdyYXBoaWNzLnByb3RvdHlwZS5fcmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSl7aWYodGhpcy52aXNpYmxlIT09ITEmJjAhPT10aGlzLmFscGhhJiZ0aGlzLmlzTWFzayE9PSEwKXtpZih0aGlzLl9jYWNoZUFzQml0bWFwKXJldHVybiB0aGlzLmRpcnR5JiYodGhpcy5fZ2VuZXJhdGVDYWNoZWRTcHJpdGUoKSxiLnVwZGF0ZVdlYkdMVGV4dHVyZSh0aGlzLl9jYWNoZWRTcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZSxhLmdsKSx0aGlzLmRpcnR5PSExKSx0aGlzLl9jYWNoZWRTcHJpdGUuYWxwaGE9dGhpcy5hbHBoYSxiLlNwcml0ZS5wcm90b3R5cGUuX3JlbmRlcldlYkdMLmNhbGwodGhpcy5fY2FjaGVkU3ByaXRlLGEpLHZvaWQgMDtpZihhLnNwcml0ZUJhdGNoLnN0b3AoKSxhLmJsZW5kTW9kZU1hbmFnZXIuc2V0QmxlbmRNb2RlKHRoaXMuYmxlbmRNb2RlKSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMuX21hc2ssYSksdGhpcy5fZmlsdGVycyYmYS5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGhpcy5fZmlsdGVyQmxvY2spLHRoaXMuYmxlbmRNb2RlIT09YS5zcHJpdGVCYXRjaC5jdXJyZW50QmxlbmRNb2RlKXthLnNwcml0ZUJhdGNoLmN1cnJlbnRCbGVuZE1vZGU9dGhpcy5ibGVuZE1vZGU7dmFyIGM9Yi5ibGVuZE1vZGVzV2ViR0xbYS5zcHJpdGVCYXRjaC5jdXJyZW50QmxlbmRNb2RlXTthLnNwcml0ZUJhdGNoLmdsLmJsZW5kRnVuYyhjWzBdLGNbMV0pfWlmKGIuV2ViR0xHcmFwaGljcy5yZW5kZXJHcmFwaGljcyh0aGlzLGEpLHRoaXMuY2hpbGRyZW4ubGVuZ3RoKXthLnNwcml0ZUJhdGNoLnN0YXJ0KCk7Zm9yKHZhciBkPTAsZT10aGlzLmNoaWxkcmVuLmxlbmd0aDtlPmQ7ZCsrKXRoaXMuY2hpbGRyZW5bZF0uX3JlbmRlcldlYkdMKGEpO2Euc3ByaXRlQmF0Y2guc3RvcCgpfXRoaXMuX2ZpbHRlcnMmJmEuZmlsdGVyTWFuYWdlci5wb3BGaWx0ZXIoKSx0aGlzLl9tYXNrJiZhLm1hc2tNYW5hZ2VyLnBvcE1hc2sodGhpcy5tYXNrLGEpLGEuZHJhd0NvdW50KyssYS5zcHJpdGVCYXRjaC5zdGFydCgpfX0sYi5HcmFwaGljcy5wcm90b3R5cGUuX3JlbmRlckNhbnZhcz1mdW5jdGlvbihhKXtpZih0aGlzLnZpc2libGUhPT0hMSYmMCE9PXRoaXMuYWxwaGEmJnRoaXMuaXNNYXNrIT09ITApe3ZhciBjPWEuY29udGV4dCxkPXRoaXMud29ybGRUcmFuc2Zvcm07dGhpcy5ibGVuZE1vZGUhPT1hLmN1cnJlbnRCbGVuZE1vZGUmJihhLmN1cnJlbnRCbGVuZE1vZGU9dGhpcy5ibGVuZE1vZGUsYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249Yi5ibGVuZE1vZGVzQ2FudmFzW2EuY3VycmVudEJsZW5kTW9kZV0pLHRoaXMuX21hc2smJmEubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5fbWFzayxhLmNvbnRleHQpLGMuc2V0VHJhbnNmb3JtKGQuYSxkLmMsZC5iLGQuZCxkLnR4LGQudHkpLGIuQ2FudmFzR3JhcGhpY3MucmVuZGVyR3JhcGhpY3ModGhpcyxjKTtmb3IodmFyIGU9MCxmPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2Y+ZTtlKyspdGhpcy5jaGlsZHJlbltlXS5fcmVuZGVyQ2FudmFzKGEpO3RoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayhhLmNvbnRleHQpfX0sYi5HcmFwaGljcy5wcm90b3R5cGUuZ2V0Qm91bmRzPWZ1bmN0aW9uKGEpe3RoaXMuYm91bmRzfHx0aGlzLnVwZGF0ZUJvdW5kcygpO3ZhciBiPXRoaXMuYm91bmRzLngsYz10aGlzLmJvdW5kcy53aWR0aCt0aGlzLmJvdW5kcy54LGQ9dGhpcy5ib3VuZHMueSxlPXRoaXMuYm91bmRzLmhlaWdodCt0aGlzLmJvdW5kcy55LGY9YXx8dGhpcy53b3JsZFRyYW5zZm9ybSxnPWYuYSxoPWYuYyxpPWYuYixqPWYuZCxrPWYudHgsbD1mLnR5LG09ZypjK2kqZStrLG49aiplK2gqYytsLG89ZypiK2kqZStrLHA9aiplK2gqYitsLHE9ZypiK2kqZCtrLHI9aipkK2gqYitsLHM9ZypjK2kqZCtrLHQ9aipkK2gqYytsLHU9bSx2PW4sdz1tLHg9bjt3PXc+bz9vOncsdz13PnE/cTp3LHc9dz5zP3M6dyx4PXg+cD9wOngseD14PnI/cjp4LHg9eD50P3Q6eCx1PW8+dT9vOnUsdT1xPnU/cTp1LHU9cz51P3M6dSx2PXA+dj9wOnYsdj1yPnY/cjp2LHY9dD52P3Q6djt2YXIgeT10aGlzLl9ib3VuZHM7cmV0dXJuIHkueD13LHkud2lkdGg9dS13LHkueT14LHkuaGVpZ2h0PXYteCx5fSxiLkdyYXBoaWNzLnByb3RvdHlwZS51cGRhdGVCb3VuZHM9ZnVuY3Rpb24oKXtmb3IodmFyIGEsYyxkLGUsZixnPTEvMCxoPS0xLzAsaT0xLzAsaj0tMS8wLGs9MDtrPHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDtrKyspe3ZhciBsPXRoaXMuZ3JhcGhpY3NEYXRhW2tdLG09bC50eXBlLG49bC5saW5lV2lkdGg7aWYoYT1sLnBvaW50cyxtPT09Yi5HcmFwaGljcy5SRUNUKWM9YVswXS1uLzIsZD1hWzFdLW4vMixlPWFbMl0rbixmPWFbM10rbixnPWc+Yz9jOmcsaD1jK2U+aD9jK2U6aCxpPWk+ZD9jOmksaj1kK2Y+aj9kK2Y6ajtlbHNlIGlmKG09PT1iLkdyYXBoaWNzLkNJUkN8fG09PT1iLkdyYXBoaWNzLkVMSVApYz1hWzBdLGQ9YVsxXSxlPWFbMl0rbi8yLGY9YVszXStuLzIsZz1nPmMtZT9jLWU6ZyxoPWMrZT5oP2MrZTpoLGk9aT5kLWY/ZC1mOmksaj1kK2Y+aj9kK2Y6ajtlbHNlIGZvcih2YXIgbz0wO288YS5sZW5ndGg7bys9MiljPWFbb10sZD1hW28rMV0sZz1nPmMtbj9jLW46ZyxoPWMrbj5oP2MrbjpoLGk9aT5kLW4/ZC1uOmksaj1kK24+aj9kK246an12YXIgcD10aGlzLmJvdW5kc1BhZGRpbmc7dGhpcy5ib3VuZHM9bmV3IGIuUmVjdGFuZ2xlKGctcCxpLXAsaC1nKzIqcCxqLWkrMipwKX0sYi5HcmFwaGljcy5wcm90b3R5cGUuX2dlbmVyYXRlQ2FjaGVkU3ByaXRlPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nZXRMb2NhbEJvdW5kcygpO2lmKHRoaXMuX2NhY2hlZFNwcml0ZSl0aGlzLl9jYWNoZWRTcHJpdGUuYnVmZmVyLnJlc2l6ZShhLndpZHRoLGEuaGVpZ2h0KTtlbHNle3ZhciBjPW5ldyBiLkNhbnZhc0J1ZmZlcihhLndpZHRoLGEuaGVpZ2h0KSxkPWIuVGV4dHVyZS5mcm9tQ2FudmFzKGMuY2FudmFzKTt0aGlzLl9jYWNoZWRTcHJpdGU9bmV3IGIuU3ByaXRlKGQpLHRoaXMuX2NhY2hlZFNwcml0ZS5idWZmZXI9Yyx0aGlzLl9jYWNoZWRTcHJpdGUud29ybGRUcmFuc2Zvcm09dGhpcy53b3JsZFRyYW5zZm9ybX10aGlzLl9jYWNoZWRTcHJpdGUuYW5jaG9yLng9LShhLngvYS53aWR0aCksdGhpcy5fY2FjaGVkU3ByaXRlLmFuY2hvci55PS0oYS55L2EuaGVpZ2h0KSx0aGlzLl9jYWNoZWRTcHJpdGUuYnVmZmVyLmNvbnRleHQudHJhbnNsYXRlKC1hLngsLWEueSksYi5DYW52YXNHcmFwaGljcy5yZW5kZXJHcmFwaGljcyh0aGlzLHRoaXMuX2NhY2hlZFNwcml0ZS5idWZmZXIuY29udGV4dCksdGhpcy5fY2FjaGVkU3ByaXRlLmFscGhhPXRoaXMuYWxwaGF9LGIuR3JhcGhpY3MucHJvdG90eXBlLmRlc3Ryb3lDYWNoZWRTcHJpdGU9ZnVuY3Rpb24oKXt0aGlzLl9jYWNoZWRTcHJpdGUudGV4dHVyZS5kZXN0cm95KCEwKSx0aGlzLl9jYWNoZWRTcHJpdGU9bnVsbH0sYi5HcmFwaGljcy5QT0xZPTAsYi5HcmFwaGljcy5SRUNUPTEsYi5HcmFwaGljcy5DSVJDPTIsYi5HcmFwaGljcy5FTElQPTMsYi5HcmFwaGljcy5SUkVDPTQsYi5TdHJpcD1mdW5jdGlvbihhKXtiLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKSx0aGlzLnRleHR1cmU9YSx0aGlzLnV2cz1uZXcgYi5GbG9hdDMyQXJyYXkoWzAsMSwxLDEsMSwwLDAsMV0pLHRoaXMudmVydGljaWVzPW5ldyBiLkZsb2F0MzJBcnJheShbMCwwLDEwMCwwLDEwMCwxMDAsMCwxMDBdKSx0aGlzLmNvbG9ycz1uZXcgYi5GbG9hdDMyQXJyYXkoWzEsMSwxLDFdKSx0aGlzLmluZGljZXM9bmV3IGIuVWludDE2QXJyYXkoWzAsMSwyLDNdKSx0aGlzLmRpcnR5PSEwfSxiLlN0cmlwLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUpLGIuU3RyaXAucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuU3RyaXAsYi5TdHJpcC5wcm90b3R5cGUuX3JlbmRlcldlYkdMPWZ1bmN0aW9uKGEpeyF0aGlzLnZpc2libGV8fHRoaXMuYWxwaGE8PTB8fChhLnNwcml0ZUJhdGNoLnN0b3AoKSx0aGlzLl92ZXJ0ZXhCdWZmZXJ8fHRoaXMuX2luaXRXZWJHTChhKSxhLnNoYWRlck1hbmFnZXIuc2V0U2hhZGVyKGEuc2hhZGVyTWFuYWdlci5zdHJpcFNoYWRlciksdGhpcy5fcmVuZGVyU3RyaXAoYSksYS5zcHJpdGVCYXRjaC5zdGFydCgpKX0sYi5TdHJpcC5wcm90b3R5cGUuX2luaXRXZWJHTD1mdW5jdGlvbihhKXt2YXIgYj1hLmdsO3RoaXMuX3ZlcnRleEJ1ZmZlcj1iLmNyZWF0ZUJ1ZmZlcigpLHRoaXMuX2luZGV4QnVmZmVyPWIuY3JlYXRlQnVmZmVyKCksdGhpcy5fdXZCdWZmZXI9Yi5jcmVhdGVCdWZmZXIoKSx0aGlzLl9jb2xvckJ1ZmZlcj1iLmNyZWF0ZUJ1ZmZlcigpLGIuYmluZEJ1ZmZlcihiLkFSUkFZX0JVRkZFUix0aGlzLl92ZXJ0ZXhCdWZmZXIpLGIuYnVmZmVyRGF0YShiLkFSUkFZX0JVRkZFUix0aGlzLnZlcnRpY2llcyxiLkRZTkFNSUNfRFJBVyksYi5iaW5kQnVmZmVyKGIuQVJSQVlfQlVGRkVSLHRoaXMuX3V2QnVmZmVyKSxiLmJ1ZmZlckRhdGEoYi5BUlJBWV9CVUZGRVIsdGhpcy51dnMsYi5TVEFUSUNfRFJBVyksYi5iaW5kQnVmZmVyKGIuQVJSQVlfQlVGRkVSLHRoaXMuX2NvbG9yQnVmZmVyKSxiLmJ1ZmZlckRhdGEoYi5BUlJBWV9CVUZGRVIsdGhpcy5jb2xvcnMsYi5TVEFUSUNfRFJBVyksYi5iaW5kQnVmZmVyKGIuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5faW5kZXhCdWZmZXIpLGIuYnVmZmVyRGF0YShiLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kaWNlcyxiLlNUQVRJQ19EUkFXKX0sYi5TdHJpcC5wcm90b3R5cGUuX3JlbmRlclN0cmlwPWZ1bmN0aW9uKGEpe3ZhciBjPWEuZ2wsZD1hLnByb2plY3Rpb24sZT1hLm9mZnNldCxmPWEuc2hhZGVyTWFuYWdlci5zdHJpcFNoYWRlcjtjLmJsZW5kRnVuYyhjLk9ORSxjLk9ORV9NSU5VU19TUkNfQUxQSEEpLGMudW5pZm9ybU1hdHJpeDNmdihmLnRyYW5zbGF0aW9uTWF0cml4LCExLHRoaXMud29ybGRUcmFuc2Zvcm0udG9BcnJheSghMCkpLGMudW5pZm9ybTJmKGYucHJvamVjdGlvblZlY3RvcixkLngsLWQueSksYy51bmlmb3JtMmYoZi5vZmZzZXRWZWN0b3IsLWUueCwtZS55KSxjLnVuaWZvcm0xZihmLmFscGhhLDEpLHRoaXMuZGlydHk/KHRoaXMuZGlydHk9ITEsYy5iaW5kQnVmZmVyKGMuQVJSQVlfQlVGRkVSLHRoaXMuX3ZlcnRleEJ1ZmZlciksYy5idWZmZXJEYXRhKGMuQVJSQVlfQlVGRkVSLHRoaXMudmVydGljaWVzLGMuU1RBVElDX0RSQVcpLGMudmVydGV4QXR0cmliUG9pbnRlcihmLmFWZXJ0ZXhQb3NpdGlvbiwyLGMuRkxPQVQsITEsMCwwKSxjLmJpbmRCdWZmZXIoYy5BUlJBWV9CVUZGRVIsdGhpcy5fdXZCdWZmZXIpLGMuYnVmZmVyRGF0YShjLkFSUkFZX0JVRkZFUix0aGlzLnV2cyxjLlNUQVRJQ19EUkFXKSxjLnZlcnRleEF0dHJpYlBvaW50ZXIoZi5hVGV4dHVyZUNvb3JkLDIsYy5GTE9BVCwhMSwwLDApLGMuYWN0aXZlVGV4dHVyZShjLlRFWFRVUkUwKSxjLmJpbmRUZXh0dXJlKGMuVEVYVFVSRV8yRCx0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbYy5pZF18fGIuY3JlYXRlV2ViR0xUZXh0dXJlKHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZSxjKSksYy5iaW5kQnVmZmVyKGMuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5faW5kZXhCdWZmZXIpLGMuYnVmZmVyRGF0YShjLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuaW5kaWNlcyxjLlNUQVRJQ19EUkFXKSk6KGMuYmluZEJ1ZmZlcihjLkFSUkFZX0JVRkZFUix0aGlzLl92ZXJ0ZXhCdWZmZXIpLGMuYnVmZmVyU3ViRGF0YShjLkFSUkFZX0JVRkZFUiwwLHRoaXMudmVydGljaWVzKSxjLnZlcnRleEF0dHJpYlBvaW50ZXIoZi5hVmVydGV4UG9zaXRpb24sMixjLkZMT0FULCExLDAsMCksYy5iaW5kQnVmZmVyKGMuQVJSQVlfQlVGRkVSLHRoaXMuX3V2QnVmZmVyKSxjLnZlcnRleEF0dHJpYlBvaW50ZXIoZi5hVGV4dHVyZUNvb3JkLDIsYy5GTE9BVCwhMSwwLDApLGMuYWN0aXZlVGV4dHVyZShjLlRFWFRVUkUwKSxjLmJpbmRUZXh0dXJlKGMuVEVYVFVSRV8yRCx0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuX2dsVGV4dHVyZXNbYy5pZF18fGIuY3JlYXRlV2ViR0xUZXh0dXJlKHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZSxjKSksYy5iaW5kQnVmZmVyKGMuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5faW5kZXhCdWZmZXIpKSxjLmRyYXdFbGVtZW50cyhjLlRSSUFOR0xFX1NUUklQLHRoaXMuaW5kaWNlcy5sZW5ndGgsYy5VTlNJR05FRF9TSE9SVCwwKX0sYi5TdHJpcC5wcm90b3R5cGUuX3JlbmRlckNhbnZhcz1mdW5jdGlvbihhKXt2YXIgYj1hLmNvbnRleHQsYz10aGlzLndvcmxkVHJhbnNmb3JtO2Eucm91bmRQaXhlbHM/Yi5zZXRUcmFuc2Zvcm0oYy5hLGMuYyxjLmIsYy5kLDB8Yy50eCwwfGMudHkpOmIuc2V0VHJhbnNmb3JtKGMuYSxjLmMsYy5iLGMuZCxjLnR4LGMudHkpO3ZhciBkPXRoaXMsZT1kLnZlcnRpY2llcyxmPWQudXZzLGc9ZS5sZW5ndGgvMjt0aGlzLmNvdW50Kys7Zm9yKHZhciBoPTA7Zy0yPmg7aCsrKXt2YXIgaT0yKmgsaj1lW2ldLGs9ZVtpKzJdLGw9ZVtpKzRdLG09ZVtpKzFdLG49ZVtpKzNdLG89ZVtpKzVdLHA9KGoraytsKS8zLHE9KG0rbitvKS8zLHI9ai1wLHM9bS1xLHQ9TWF0aC5zcXJ0KHIqcitzKnMpO2o9cCtyL3QqKHQrMyksbT1xK3MvdCoodCszKSxyPWstcCxzPW4tcSx0PU1hdGguc3FydChyKnIrcypzKSxrPXArci90Kih0KzMpLG49cStzL3QqKHQrMykscj1sLXAscz1vLXEsdD1NYXRoLnNxcnQocipyK3MqcyksbD1wK3IvdCoodCszKSxvPXErcy90Kih0KzMpO3ZhciB1PWZbaV0qZC50ZXh0dXJlLndpZHRoLHY9ZltpKzJdKmQudGV4dHVyZS53aWR0aCx3PWZbaSs0XSpkLnRleHR1cmUud2lkdGgseD1mW2krMV0qZC50ZXh0dXJlLmhlaWdodCx5PWZbaSszXSpkLnRleHR1cmUuaGVpZ2h0LHo9ZltpKzVdKmQudGV4dHVyZS5oZWlnaHQ7Yi5zYXZlKCksYi5iZWdpblBhdGgoKSxiLm1vdmVUbyhqLG0pLGIubGluZVRvKGssbiksYi5saW5lVG8obCxvKSxiLmNsb3NlUGF0aCgpLGIuY2xpcCgpO3ZhciBBPXUqeSt4Kncrdip6LXkqdy14KnYtdSp6LEI9aip5K3gqbCtrKnoteSpsLXgqay1qKnosQz11Kmsraip3K3YqbC1rKnctaip2LXUqbCxEPXUqeSpsK3gqayp3K2oqdip6LWoqeSp3LXgqdipsLXUqayp6LEU9bSp5K3gqbytuKnoteSpvLXgqbi1tKnosRj11Km4rbSp3K3Yqby1uKnctbSp2LXUqbyxHPXUqeSpvK3gqbip3K20qdip6LW0qeSp3LXgqdipvLXUqbip6O2IudHJhbnNmb3JtKEIvQSxFL0EsQy9BLEYvQSxEL0EsRy9BKSxiLmRyYXdJbWFnZShkLnRleHR1cmUuYmFzZVRleHR1cmUuc291cmNlLDAsMCksYi5yZXN0b3JlKCl9fSxiLlN0cmlwLnByb3RvdHlwZS5vblRleHR1cmVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLnVwZGF0ZUZyYW1lPSEwfSxiLlJvcGU9ZnVuY3Rpb24oYSxjKXtiLlN0cmlwLmNhbGwodGhpcyxhKSx0aGlzLnBvaW50cz1jLHRoaXMudmVydGljaWVzPW5ldyBiLkZsb2F0MzJBcnJheSg0KmMubGVuZ3RoKSx0aGlzLnV2cz1uZXcgYi5GbG9hdDMyQXJyYXkoNCpjLmxlbmd0aCksdGhpcy5jb2xvcnM9bmV3IGIuRmxvYXQzMkFycmF5KDIqYy5sZW5ndGgpLHRoaXMuaW5kaWNlcz1uZXcgYi5VaW50MTZBcnJheSgyKmMubGVuZ3RoKSx0aGlzLnJlZnJlc2goKX0sYi5Sb3BlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuU3RyaXAucHJvdG90eXBlKSxiLlJvcGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuUm9wZSxiLlJvcGUucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnBvaW50cztpZighKGEubGVuZ3RoPDEpKXt2YXIgYj10aGlzLnV2cyxjPWFbMF0sZD10aGlzLmluZGljZXMsZT10aGlzLmNvbG9yczt0aGlzLmNvdW50LT0uMixiWzBdPTAsYlsxXT0wLGJbMl09MCxiWzNdPTEsZVswXT0xLGVbMV09MSxkWzBdPTAsZFsxXT0xO2Zvcih2YXIgZixnLGgsaT1hLmxlbmd0aCxqPTE7aT5qO2orKylmPWFbal0sZz00KmosaD1qLyhpLTEpLGolMj8oYltnXT1oLGJbZysxXT0wLGJbZysyXT1oLGJbZyszXT0xKTooYltnXT1oLGJbZysxXT0wLGJbZysyXT1oLGJbZyszXT0xKSxnPTIqaixlW2ddPTEsZVtnKzFdPTEsZz0yKmosZFtnXT1nLGRbZysxXT1nKzEsYz1mfX0sYi5Sb3BlLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm09ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnBvaW50cztpZighKGEubGVuZ3RoPDEpKXt2YXIgYyxkPWFbMF0sZT17eDowLHk6MH07dGhpcy5jb3VudC09LjI7Zm9yKHZhciBmLGcsaCxpLGosaz10aGlzLnZlcnRpY2llcyxsPWEubGVuZ3RoLG09MDtsPm07bSsrKWY9YVttXSxnPTQqbSxjPW08YS5sZW5ndGgtMT9hW20rMV06ZixlLnk9LShjLngtZC54KSxlLng9Yy55LWQueSxoPTEwKigxLW0vKGwtMSkpLGg+MSYmKGg9MSksaT1NYXRoLnNxcnQoZS54KmUueCtlLnkqZS55KSxqPXRoaXMudGV4dHVyZS5oZWlnaHQvMixlLngvPWksZS55Lz1pLGUueCo9aixlLnkqPWosa1tnXT1mLngrZS54LGtbZysxXT1mLnkrZS55LGtbZysyXT1mLngtZS54LGtbZyszXT1mLnktZS55LGQ9ZjtiLkRpc3BsYXlPYmplY3RDb250YWluZXIucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybS5jYWxsKHRoaXMpfX0sYi5Sb3BlLnByb3RvdHlwZS5zZXRUZXh0dXJlPWZ1bmN0aW9uKGEpe3RoaXMudGV4dHVyZT1hfSxiLlRpbGluZ1Nwcml0ZT1mdW5jdGlvbihhLGMsZCl7Yi5TcHJpdGUuY2FsbCh0aGlzLGEpLHRoaXMuX3dpZHRoPWN8fDEwMCx0aGlzLl9oZWlnaHQ9ZHx8MTAwLHRoaXMudGlsZVNjYWxlPW5ldyBiLlBvaW50KDEsMSksdGhpcy50aWxlU2NhbGVPZmZzZXQ9bmV3IGIuUG9pbnQoMSwxKSx0aGlzLnRpbGVQb3NpdGlvbj1uZXcgYi5Qb2ludCgwLDApLHRoaXMucmVuZGVyYWJsZT0hMCx0aGlzLnRpbnQ9MTY3NzcyMTUsdGhpcy5ibGVuZE1vZGU9Yi5ibGVuZE1vZGVzLk5PUk1BTH0sYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5TcHJpdGUucHJvdG90eXBlKSxiLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5UaWxpbmdTcHJpdGUsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZSxcIndpZHRoXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl93aWR0aH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuX3dpZHRoPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZSxcImhlaWdodFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faGVpZ2h0fSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5faGVpZ2h0PWF9fSksYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLnNldFRleHR1cmU9ZnVuY3Rpb24oYSl7dGhpcy50ZXh0dXJlIT09YSYmKHRoaXMudGV4dHVyZT1hLHRoaXMucmVmcmVzaFRleHR1cmU9ITAsdGhpcy5jYWNoZWRUaW50PTE2Nzc3MjE1KX0sYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLl9yZW5kZXJXZWJHTD1mdW5jdGlvbihhKXtpZih0aGlzLnZpc2libGUhPT0hMSYmMCE9PXRoaXMuYWxwaGEpe3ZhciBjLGQ7Zm9yKHRoaXMuX21hc2smJihhLnNwcml0ZUJhdGNoLnN0b3AoKSxhLm1hc2tNYW5hZ2VyLnB1c2hNYXNrKHRoaXMubWFzayxhKSxhLnNwcml0ZUJhdGNoLnN0YXJ0KCkpLHRoaXMuX2ZpbHRlcnMmJihhLnNwcml0ZUJhdGNoLmZsdXNoKCksYS5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGhpcy5fZmlsdGVyQmxvY2spKSwhdGhpcy50aWxpbmdUZXh0dXJlfHx0aGlzLnJlZnJlc2hUZXh0dXJlPyh0aGlzLmdlbmVyYXRlVGlsaW5nVGV4dHVyZSghMCksdGhpcy50aWxpbmdUZXh0dXJlJiZ0aGlzLnRpbGluZ1RleHR1cmUubmVlZHNVcGRhdGUmJihiLnVwZGF0ZVdlYkdMVGV4dHVyZSh0aGlzLnRpbGluZ1RleHR1cmUuYmFzZVRleHR1cmUsYS5nbCksdGhpcy50aWxpbmdUZXh0dXJlLm5lZWRzVXBkYXRlPSExKSk6YS5zcHJpdGVCYXRjaC5yZW5kZXJUaWxpbmdTcHJpdGUodGhpcyksYz0wLGQ9dGhpcy5jaGlsZHJlbi5sZW5ndGg7ZD5jO2MrKyl0aGlzLmNoaWxkcmVuW2NdLl9yZW5kZXJXZWJHTChhKTthLnNwcml0ZUJhdGNoLnN0b3AoKSx0aGlzLl9maWx0ZXJzJiZhLmZpbHRlck1hbmFnZXIucG9wRmlsdGVyKCksdGhpcy5fbWFzayYmYS5tYXNrTWFuYWdlci5wb3BNYXNrKGEpLGEuc3ByaXRlQmF0Y2guc3RhcnQoKX19LGIuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS5fcmVuZGVyQ2FudmFzPWZ1bmN0aW9uKGEpe2lmKHRoaXMudmlzaWJsZSE9PSExJiYwIT09dGhpcy5hbHBoYSl7dmFyIGM9YS5jb250ZXh0O3RoaXMuX21hc2smJmEubWFza01hbmFnZXIucHVzaE1hc2sodGhpcy5fbWFzayxjKSxjLmdsb2JhbEFscGhhPXRoaXMud29ybGRBbHBoYTt2YXIgZCxlLGY9dGhpcy53b3JsZFRyYW5zZm9ybTtpZihjLnNldFRyYW5zZm9ybShmLmEsZi5jLGYuYixmLmQsZi50eCxmLnR5KSwhdGhpcy5fX3RpbGVQYXR0ZXJufHx0aGlzLnJlZnJlc2hUZXh0dXJlKXtpZih0aGlzLmdlbmVyYXRlVGlsaW5nVGV4dHVyZSghMSksIXRoaXMudGlsaW5nVGV4dHVyZSlyZXR1cm47dGhpcy5fX3RpbGVQYXR0ZXJuPWMuY3JlYXRlUGF0dGVybih0aGlzLnRpbGluZ1RleHR1cmUuYmFzZVRleHR1cmUuc291cmNlLFwicmVwZWF0XCIpfXRoaXMuYmxlbmRNb2RlIT09YS5jdXJyZW50QmxlbmRNb2RlJiYoYS5jdXJyZW50QmxlbmRNb2RlPXRoaXMuYmxlbmRNb2RlLGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPWIuYmxlbmRNb2Rlc0NhbnZhc1thLmN1cnJlbnRCbGVuZE1vZGVdKTt2YXIgZz10aGlzLnRpbGVQb3NpdGlvbixoPXRoaXMudGlsZVNjYWxlO2ZvcihnLnglPXRoaXMudGlsaW5nVGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aCxnLnklPXRoaXMudGlsaW5nVGV4dHVyZS5iYXNlVGV4dHVyZS5oZWlnaHQsYy5zY2FsZShoLngsaC55KSxjLnRyYW5zbGF0ZShnLngsZy55KSxjLmZpbGxTdHlsZT10aGlzLl9fdGlsZVBhdHRlcm4sYy5maWxsUmVjdCgtZy54K3RoaXMuYW5jaG9yLngqLXRoaXMuX3dpZHRoLC1nLnkrdGhpcy5hbmNob3IueSotdGhpcy5faGVpZ2h0LHRoaXMuX3dpZHRoL2gueCx0aGlzLl9oZWlnaHQvaC55KSxjLnNjYWxlKDEvaC54LDEvaC55KSxjLnRyYW5zbGF0ZSgtZy54LC1nLnkpLHRoaXMuX21hc2smJmEubWFza01hbmFnZXIucG9wTWFzayhhLmNvbnRleHQpLGQ9MCxlPXRoaXMuY2hpbGRyZW4ubGVuZ3RoO2U+ZDtkKyspdGhpcy5jaGlsZHJlbltkXS5fcmVuZGVyQ2FudmFzKGEpfX0sYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLmdldEJvdW5kcz1mdW5jdGlvbigpe3ZhciBhPXRoaXMuX3dpZHRoLGI9dGhpcy5faGVpZ2h0LGM9YSooMS10aGlzLmFuY2hvci54KSxkPWEqLXRoaXMuYW5jaG9yLngsZT1iKigxLXRoaXMuYW5jaG9yLnkpLGY9YiotdGhpcy5hbmNob3IueSxnPXRoaXMud29ybGRUcmFuc2Zvcm0saD1nLmEsaT1nLmMsaj1nLmIsaz1nLmQsbD1nLnR4LG09Zy50eSxuPWgqZCtqKmYrbCxvPWsqZitpKmQrbSxwPWgqYytqKmYrbCxxPWsqZitpKmMrbSxyPWgqYytqKmUrbCxzPWsqZStpKmMrbSx0PWgqZCtqKmUrbCx1PWsqZStpKmQrbSx2PS0xLzAsdz0tMS8wLHg9MS8wLHk9MS8wO3g9eD5uP246eCx4PXg+cD9wOngseD14PnI/cjp4LHg9eD50P3Q6eCx5PXk+bz9vOnkseT15PnE/cTp5LHk9eT5zP3M6eSx5PXk+dT91Onksdj1uPnY/bjp2LHY9cD52P3A6dix2PXI+dj9yOnYsdj10PnY/dDp2LHc9bz53P286dyx3PXE+dz9xOncsdz1zPnc/czp3LHc9dT53P3U6dzt2YXIgej10aGlzLl9ib3VuZHM7cmV0dXJuIHoueD14LHoud2lkdGg9di14LHoueT15LHouaGVpZ2h0PXcteSx0aGlzLl9jdXJyZW50Qm91bmRzPXosen0sYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLm9uVGV4dHVyZVVwZGF0ZT1mdW5jdGlvbigpe30sYi5UaWxpbmdTcHJpdGUucHJvdG90eXBlLmdlbmVyYXRlVGlsaW5nVGV4dHVyZT1mdW5jdGlvbihhKXtpZih0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuaGFzTG9hZGVkKXt2YXIgYyxkLGU9dGhpcy50ZXh0dXJlLGY9ZS5mcmFtZSxnPWYud2lkdGghPT1lLmJhc2VUZXh0dXJlLndpZHRofHxmLmhlaWdodCE9PWUuYmFzZVRleHR1cmUuaGVpZ2h0LGg9ITE7aWYoYT8oYz1iLmdldE5leHRQb3dlck9mVHdvKGYud2lkdGgpLGQ9Yi5nZXROZXh0UG93ZXJPZlR3byhmLmhlaWdodCksKGYud2lkdGghPT1jfHxmLmhlaWdodCE9PWQpJiYoaD0hMCkpOmcmJihjPWYud2lkdGgsZD1mLmhlaWdodCxoPSEwKSxoKXt2YXIgaTt0aGlzLnRpbGluZ1RleHR1cmUmJnRoaXMudGlsaW5nVGV4dHVyZS5pc1RpbGluZz8oaT10aGlzLnRpbGluZ1RleHR1cmUuY2FudmFzQnVmZmVyLGkucmVzaXplKGMsZCksdGhpcy50aWxpbmdUZXh0dXJlLmJhc2VUZXh0dXJlLndpZHRoPWMsdGhpcy50aWxpbmdUZXh0dXJlLmJhc2VUZXh0dXJlLmhlaWdodD1kLHRoaXMudGlsaW5nVGV4dHVyZS5uZWVkc1VwZGF0ZT0hMCk6KGk9bmV3IGIuQ2FudmFzQnVmZmVyKGMsZCksdGhpcy50aWxpbmdUZXh0dXJlPWIuVGV4dHVyZS5mcm9tQ2FudmFzKGkuY2FudmFzKSx0aGlzLnRpbGluZ1RleHR1cmUuY2FudmFzQnVmZmVyPWksdGhpcy50aWxpbmdUZXh0dXJlLmlzVGlsaW5nPSEwKSxpLmNvbnRleHQuZHJhd0ltYWdlKGUuYmFzZVRleHR1cmUuc291cmNlLGUuY3JvcC54LGUuY3JvcC55LGUuY3JvcC53aWR0aCxlLmNyb3AuaGVpZ2h0LDAsMCxjLGQpLHRoaXMudGlsZVNjYWxlT2Zmc2V0Lng9Zi53aWR0aC9jLHRoaXMudGlsZVNjYWxlT2Zmc2V0Lnk9Zi5oZWlnaHQvZH1lbHNlIHRoaXMudGlsaW5nVGV4dHVyZSYmdGhpcy50aWxpbmdUZXh0dXJlLmlzVGlsaW5nJiZ0aGlzLnRpbGluZ1RleHR1cmUuZGVzdHJveSghMCksdGhpcy50aWxlU2NhbGVPZmZzZXQueD0xLHRoaXMudGlsZVNjYWxlT2Zmc2V0Lnk9MSx0aGlzLnRpbGluZ1RleHR1cmU9ZTt0aGlzLnJlZnJlc2hUZXh0dXJlPSExLHRoaXMudGlsaW5nVGV4dHVyZS5iYXNlVGV4dHVyZS5fcG93ZXJPZjI9ITB9fTt2YXIgZj17fTtmLkJvbmVEYXRhPWZ1bmN0aW9uKGEsYil7dGhpcy5uYW1lPWEsdGhpcy5wYXJlbnQ9Yn0sZi5Cb25lRGF0YS5wcm90b3R5cGU9e2xlbmd0aDowLHg6MCx5OjAscm90YXRpb246MCxzY2FsZVg6MSxzY2FsZVk6MX0sZi5TbG90RGF0YT1mdW5jdGlvbihhLGIpe3RoaXMubmFtZT1hLHRoaXMuYm9uZURhdGE9Yn0sZi5TbG90RGF0YS5wcm90b3R5cGU9e3I6MSxnOjEsYjoxLGE6MSxhdHRhY2htZW50TmFtZTpudWxsfSxmLkJvbmU9ZnVuY3Rpb24oYSxiKXt0aGlzLmRhdGE9YSx0aGlzLnBhcmVudD1iLHRoaXMuc2V0VG9TZXR1cFBvc2UoKX0sZi5Cb25lLnlEb3duPSExLGYuQm9uZS5wcm90b3R5cGU9e3g6MCx5OjAscm90YXRpb246MCxzY2FsZVg6MSxzY2FsZVk6MSxtMDA6MCxtMDE6MCx3b3JsZFg6MCxtMTA6MCxtMTE6MCx3b3JsZFk6MCx3b3JsZFJvdGF0aW9uOjAsd29ybGRTY2FsZVg6MSx3b3JsZFNjYWxlWToxLHVwZGF0ZVdvcmxkVHJhbnNmb3JtOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5wYXJlbnQ7bnVsbCE9Yz8odGhpcy53b3JsZFg9dGhpcy54KmMubTAwK3RoaXMueSpjLm0wMStjLndvcmxkWCx0aGlzLndvcmxkWT10aGlzLngqYy5tMTArdGhpcy55KmMubTExK2Mud29ybGRZLHRoaXMud29ybGRTY2FsZVg9Yy53b3JsZFNjYWxlWCp0aGlzLnNjYWxlWCx0aGlzLndvcmxkU2NhbGVZPWMud29ybGRTY2FsZVkqdGhpcy5zY2FsZVksdGhpcy53b3JsZFJvdGF0aW9uPWMud29ybGRSb3RhdGlvbit0aGlzLnJvdGF0aW9uKToodGhpcy53b3JsZFg9dGhpcy54LHRoaXMud29ybGRZPXRoaXMueSx0aGlzLndvcmxkU2NhbGVYPXRoaXMuc2NhbGVYLHRoaXMud29ybGRTY2FsZVk9dGhpcy5zY2FsZVksdGhpcy53b3JsZFJvdGF0aW9uPXRoaXMucm90YXRpb24pO3ZhciBkPXRoaXMud29ybGRSb3RhdGlvbipNYXRoLlBJLzE4MCxlPU1hdGguY29zKGQpLGc9TWF0aC5zaW4oZCk7dGhpcy5tMDA9ZSp0aGlzLndvcmxkU2NhbGVYLHRoaXMubTEwPWcqdGhpcy53b3JsZFNjYWxlWCx0aGlzLm0wMT0tZyp0aGlzLndvcmxkU2NhbGVZLHRoaXMubTExPWUqdGhpcy53b3JsZFNjYWxlWSxhJiYodGhpcy5tMDA9LXRoaXMubTAwLHRoaXMubTAxPS10aGlzLm0wMSksYiYmKHRoaXMubTEwPS10aGlzLm0xMCx0aGlzLm0xMT0tdGhpcy5tMTEpLGYuQm9uZS55RG93biYmKHRoaXMubTEwPS10aGlzLm0xMCx0aGlzLm0xMT0tdGhpcy5tMTEpfSxzZXRUb1NldHVwUG9zZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZGF0YTt0aGlzLng9YS54LHRoaXMueT1hLnksdGhpcy5yb3RhdGlvbj1hLnJvdGF0aW9uLHRoaXMuc2NhbGVYPWEuc2NhbGVYLHRoaXMuc2NhbGVZPWEuc2NhbGVZfX0sZi5TbG90PWZ1bmN0aW9uKGEsYixjKXt0aGlzLmRhdGE9YSx0aGlzLnNrZWxldG9uPWIsdGhpcy5ib25lPWMsdGhpcy5zZXRUb1NldHVwUG9zZSgpfSxmLlNsb3QucHJvdG90eXBlPXtyOjEsZzoxLGI6MSxhOjEsX2F0dGFjaG1lbnRUaW1lOjAsYXR0YWNobWVudDpudWxsLHNldEF0dGFjaG1lbnQ6ZnVuY3Rpb24oYSl7dGhpcy5hdHRhY2htZW50PWEsdGhpcy5fYXR0YWNobWVudFRpbWU9dGhpcy5za2VsZXRvbi50aW1lfSxzZXRBdHRhY2htZW50VGltZTpmdW5jdGlvbihhKXt0aGlzLl9hdHRhY2htZW50VGltZT10aGlzLnNrZWxldG9uLnRpbWUtYX0sZ2V0QXR0YWNobWVudFRpbWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5za2VsZXRvbi50aW1lLXRoaXMuX2F0dGFjaG1lbnRUaW1lfSxzZXRUb1NldHVwUG9zZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZGF0YTt0aGlzLnI9YS5yLHRoaXMuZz1hLmcsdGhpcy5iPWEuYix0aGlzLmE9YS5hO2Zvcih2YXIgYj10aGlzLnNrZWxldG9uLmRhdGEuc2xvdHMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdPT1hKXt0aGlzLnNldEF0dGFjaG1lbnQoYS5hdHRhY2htZW50TmFtZT90aGlzLnNrZWxldG9uLmdldEF0dGFjaG1lbnRCeVNsb3RJbmRleChjLGEuYXR0YWNobWVudE5hbWUpOm51bGwpO2JyZWFrfX19LGYuU2tpbj1mdW5jdGlvbihhKXt0aGlzLm5hbWU9YSx0aGlzLmF0dGFjaG1lbnRzPXt9fSxmLlNraW4ucHJvdG90eXBlPXthZGRBdHRhY2htZW50OmZ1bmN0aW9uKGEsYixjKXt0aGlzLmF0dGFjaG1lbnRzW2ErXCI6XCIrYl09Y30sZ2V0QXR0YWNobWVudDpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmF0dGFjaG1lbnRzW2ErXCI6XCIrYl19LF9hdHRhY2hBbGw6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGMgaW4gYi5hdHRhY2htZW50cyl7dmFyIGQ9Yy5pbmRleE9mKFwiOlwiKSxlPXBhcnNlSW50KGMuc3Vic3RyaW5nKDAsZCksMTApLGY9Yy5zdWJzdHJpbmcoZCsxKSxnPWEuc2xvdHNbZV07aWYoZy5hdHRhY2htZW50JiZnLmF0dGFjaG1lbnQubmFtZT09Zil7dmFyIGg9dGhpcy5nZXRBdHRhY2htZW50KGUsZik7aCYmZy5zZXRBdHRhY2htZW50KGgpfX19fSxmLkFuaW1hdGlvbj1mdW5jdGlvbihhLGIsYyl7dGhpcy5uYW1lPWEsdGhpcy50aW1lbGluZXM9Yix0aGlzLmR1cmF0aW9uPWN9LGYuQW5pbWF0aW9uLnByb3RvdHlwZT17YXBwbHk6ZnVuY3Rpb24oYSxiLGMpe2MmJnRoaXMuZHVyYXRpb24mJihiJT10aGlzLmR1cmF0aW9uKTtmb3IodmFyIGQ9dGhpcy50aW1lbGluZXMsZT0wLGY9ZC5sZW5ndGg7Zj5lO2UrKylkW2VdLmFwcGx5KGEsYiwxKX0sbWl4OmZ1bmN0aW9uKGEsYixjLGQpe2MmJnRoaXMuZHVyYXRpb24mJihiJT10aGlzLmR1cmF0aW9uKTtmb3IodmFyIGU9dGhpcy50aW1lbGluZXMsZj0wLGc9ZS5sZW5ndGg7Zz5mO2YrKyllW2ZdLmFwcGx5KGEsYixkKX19LGYuYmluYXJ5U2VhcmNoPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD0wLGU9TWF0aC5mbG9vcihhLmxlbmd0aC9jKS0yO2lmKCFlKXJldHVybiBjO2Zvcih2YXIgZj1lPj4+MTs7KXtpZihhWyhmKzEpKmNdPD1iP2Q9ZisxOmU9ZixkPT1lKXJldHVybihkKzEpKmM7Zj1kK2U+Pj4xfX0sZi5saW5lYXJTZWFyY2g9ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD0wLGU9YS5sZW5ndGgtYztlPj1kO2QrPWMpaWYoYVtkXT5iKXJldHVybiBkO3JldHVybi0xfSxmLkN1cnZlcz1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1bXSx0aGlzLmN1cnZlcy5sZW5ndGg9NiooYS0xKX0sZi5DdXJ2ZXMucHJvdG90eXBlPXtzZXRMaW5lYXI6ZnVuY3Rpb24oYSl7dGhpcy5jdXJ2ZXNbNiphXT0wfSxzZXRTdGVwcGVkOmZ1bmN0aW9uKGEpe3RoaXMuY3VydmVzWzYqYV09LTF9LHNldEN1cnZlOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGY9LjEsZz1mKmYsaD1nKmYsaT0zKmYsaj0zKmcsaz02KmcsbD02KmgsbT0yKi1iK2Qsbj0yKi1jK2Usbz0zKihiLWQpKzEscD0zKihjLWUpKzEscT02KmEscj10aGlzLmN1cnZlcztyW3FdPWIqaSttKmorbypoLHJbcSsxXT1jKmkrbipqK3AqaCxyW3ErMl09bSprK28qbCxyW3ErM109biprK3AqbCxyW3ErNF09bypsLHJbcSs1XT1wKmx9LGdldEN1cnZlUGVyY2VudDpmdW5jdGlvbihhLGIpe2I9MD5iPzA6Yj4xPzE6Yjt2YXIgYz02KmEsZD10aGlzLmN1cnZlcyxlPWRbY107aWYoIWUpcmV0dXJuIGI7aWYoLTE9PWUpcmV0dXJuIDA7Zm9yKHZhciBmPWRbYysxXSxnPWRbYysyXSxoPWRbYyszXSxpPWRbYys0XSxqPWRbYys1XSxrPWUsbD1mLG09ODs7KXtpZihrPj1iKXt2YXIgbj1rLWUsbz1sLWY7cmV0dXJuIG8rKGwtbykqKGItbikvKGstbil9aWYoIW0pYnJlYWs7bS0tLGUrPWcsZis9aCxnKz1pLGgrPWosays9ZSxsKz1mfXJldHVybiBsKygxLWwpKihiLWspLygxLWspfX0sZi5Sb3RhdGVUaW1lbGluZT1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1uZXcgZi5DdXJ2ZXMoYSksdGhpcy5mcmFtZXM9W10sdGhpcy5mcmFtZXMubGVuZ3RoPTIqYX0sZi5Sb3RhdGVUaW1lbGluZS5wcm90b3R5cGU9e2JvbmVJbmRleDowLGdldEZyYW1lQ291bnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5mcmFtZXMubGVuZ3RoLzJ9LHNldEZyYW1lOmZ1bmN0aW9uKGEsYixjKXthKj0yLHRoaXMuZnJhbWVzW2FdPWIsdGhpcy5mcmFtZXNbYSsxXT1jfSxhcHBseTpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZT10aGlzLmZyYW1lcztpZighKGI8ZVswXSkpe3ZhciBnPWEuYm9uZXNbdGhpcy5ib25lSW5kZXhdO2lmKGI+PWVbZS5sZW5ndGgtMl0pe2ZvcihkPWcuZGF0YS5yb3RhdGlvbitlW2UubGVuZ3RoLTFdLWcucm90YXRpb247ZD4xODA7KWQtPTM2MDtmb3IoOy0xODA+ZDspZCs9MzYwO3JldHVybiBnLnJvdGF0aW9uKz1kKmMsdm9pZCAwfXZhciBoPWYuYmluYXJ5U2VhcmNoKGUsYiwyKSxpPWVbaC0xXSxqPWVbaF0saz0xLShiLWopLyhlW2gtMl0taik7Zm9yKGs9dGhpcy5jdXJ2ZXMuZ2V0Q3VydmVQZXJjZW50KGgvMi0xLGspLGQ9ZVtoKzFdLWk7ZD4xODA7KWQtPTM2MDtmb3IoOy0xODA+ZDspZCs9MzYwO2ZvcihkPWcuZGF0YS5yb3RhdGlvbisoaStkKmspLWcucm90YXRpb247ZD4xODA7KWQtPTM2MDtmb3IoOy0xODA+ZDspZCs9MzYwO2cucm90YXRpb24rPWQqY319fSxmLlRyYW5zbGF0ZVRpbWVsaW5lPWZ1bmN0aW9uKGEpe3RoaXMuY3VydmVzPW5ldyBmLkN1cnZlcyhhKSx0aGlzLmZyYW1lcz1bXSx0aGlzLmZyYW1lcy5sZW5ndGg9MyphfSxmLlRyYW5zbGF0ZVRpbWVsaW5lLnByb3RvdHlwZT17Ym9uZUluZGV4OjAsZ2V0RnJhbWVDb3VudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmZyYW1lcy5sZW5ndGgvM30sc2V0RnJhbWU6ZnVuY3Rpb24oYSxiLGMsZCl7YSo9Myx0aGlzLmZyYW1lc1thXT1iLHRoaXMuZnJhbWVzW2ErMV09Yyx0aGlzLmZyYW1lc1thKzJdPWR9LGFwcGx5OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzLmZyYW1lcztpZighKGI8ZFswXSkpe3ZhciBlPWEuYm9uZXNbdGhpcy5ib25lSW5kZXhdO2lmKGI+PWRbZC5sZW5ndGgtM10pcmV0dXJuIGUueCs9KGUuZGF0YS54K2RbZC5sZW5ndGgtMl0tZS54KSpjLGUueSs9KGUuZGF0YS55K2RbZC5sZW5ndGgtMV0tZS55KSpjLHZvaWQgMDt2YXIgZz1mLmJpbmFyeVNlYXJjaChkLGIsMyksaD1kW2ctMl0saT1kW2ctMV0saj1kW2ddLGs9MS0oYi1qKS8oZFtnKy0zXS1qKTtrPXRoaXMuY3VydmVzLmdldEN1cnZlUGVyY2VudChnLzMtMSxrKSxlLngrPShlLmRhdGEueCtoKyhkW2crMV0taCkqay1lLngpKmMsZS55Kz0oZS5kYXRhLnkraSsoZFtnKzJdLWkpKmstZS55KSpjfX19LGYuU2NhbGVUaW1lbGluZT1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1uZXcgZi5DdXJ2ZXMoYSksdGhpcy5mcmFtZXM9W10sdGhpcy5mcmFtZXMubGVuZ3RoPTMqYX0sZi5TY2FsZVRpbWVsaW5lLnByb3RvdHlwZT17Ym9uZUluZGV4OjAsZ2V0RnJhbWVDb3VudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmZyYW1lcy5sZW5ndGgvM30sc2V0RnJhbWU6ZnVuY3Rpb24oYSxiLGMsZCl7YSo9Myx0aGlzLmZyYW1lc1thXT1iLHRoaXMuZnJhbWVzW2ErMV09Yyx0aGlzLmZyYW1lc1thKzJdPWR9LGFwcGx5OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzLmZyYW1lcztpZighKGI8ZFswXSkpe3ZhciBlPWEuYm9uZXNbdGhpcy5ib25lSW5kZXhdO2lmKGI+PWRbZC5sZW5ndGgtM10pcmV0dXJuIGUuc2NhbGVYKz0oZS5kYXRhLnNjYWxlWC0xK2RbZC5sZW5ndGgtMl0tZS5zY2FsZVgpKmMsZS5zY2FsZVkrPShlLmRhdGEuc2NhbGVZLTErZFtkLmxlbmd0aC0xXS1lLnNjYWxlWSkqYyx2b2lkIDA7dmFyIGc9Zi5iaW5hcnlTZWFyY2goZCxiLDMpLGg9ZFtnLTJdLGk9ZFtnLTFdLGo9ZFtnXSxrPTEtKGItaikvKGRbZystM10taik7az10aGlzLmN1cnZlcy5nZXRDdXJ2ZVBlcmNlbnQoZy8zLTEsayksZS5zY2FsZVgrPShlLmRhdGEuc2NhbGVYLTEraCsoZFtnKzFdLWgpKmstZS5zY2FsZVgpKmMsZS5zY2FsZVkrPShlLmRhdGEuc2NhbGVZLTEraSsoZFtnKzJdLWkpKmstZS5zY2FsZVkpKmN9fX0sZi5Db2xvclRpbWVsaW5lPWZ1bmN0aW9uKGEpe3RoaXMuY3VydmVzPW5ldyBmLkN1cnZlcyhhKSx0aGlzLmZyYW1lcz1bXSx0aGlzLmZyYW1lcy5sZW5ndGg9NSphfSxmLkNvbG9yVGltZWxpbmUucHJvdG90eXBlPXtzbG90SW5kZXg6MCxnZXRGcmFtZUNvdW50OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZnJhbWVzLmxlbmd0aC81fSxzZXRGcmFtZTpmdW5jdGlvbihhLGIsYyxkLGUsZil7YSo9NSx0aGlzLmZyYW1lc1thXT1iLHRoaXMuZnJhbWVzW2ErMV09Yyx0aGlzLmZyYW1lc1thKzJdPWQsdGhpcy5mcmFtZXNbYSszXT1lLHRoaXMuZnJhbWVzW2ErNF09Zn0sYXBwbHk6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPXRoaXMuZnJhbWVzO2lmKCEoYjxkWzBdKSl7dmFyIGU9YS5zbG90c1t0aGlzLnNsb3RJbmRleF07aWYoYj49ZFtkLmxlbmd0aC01XSl7dmFyIGc9ZC5sZW5ndGgtMTtyZXR1cm4gZS5yPWRbZy0zXSxlLmc9ZFtnLTJdLGUuYj1kW2ctMV0sZS5hPWRbZ10sdm9pZCAwfXZhciBoPWYuYmluYXJ5U2VhcmNoKGQsYiw1KSxpPWRbaC00XSxqPWRbaC0zXSxrPWRbaC0yXSxsPWRbaC0xXSxtPWRbaF0sbj0xLShiLW0pLyhkW2gtNV0tbSk7bj10aGlzLmN1cnZlcy5nZXRDdXJ2ZVBlcmNlbnQoaC81LTEsbik7dmFyIG89aSsoZFtoKzFdLWkpKm4scD1qKyhkW2grMl0taikqbixxPWsrKGRbaCszXS1rKSpuLHI9bCsoZFtoKzRdLWwpKm47MT5jPyhlLnIrPShvLWUucikqYyxlLmcrPShwLWUuZykqYyxlLmIrPShxLWUuYikqYyxlLmErPShyLWUuYSkqYyk6KGUucj1vLGUuZz1wLGUuYj1xLGUuYT1yKX19fSxmLkF0dGFjaG1lbnRUaW1lbGluZT1mdW5jdGlvbihhKXt0aGlzLmN1cnZlcz1uZXcgZi5DdXJ2ZXMoYSksdGhpcy5mcmFtZXM9W10sdGhpcy5mcmFtZXMubGVuZ3RoPWEsdGhpcy5hdHRhY2htZW50TmFtZXM9W10sdGhpcy5hdHRhY2htZW50TmFtZXMubGVuZ3RoPWF9LGYuQXR0YWNobWVudFRpbWVsaW5lLnByb3RvdHlwZT17c2xvdEluZGV4OjAsZ2V0RnJhbWVDb3VudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmZyYW1lcy5sZW5ndGh9LHNldEZyYW1lOmZ1bmN0aW9uKGEsYixjKXt0aGlzLmZyYW1lc1thXT1iLHRoaXMuYXR0YWNobWVudE5hbWVzW2FdPWN9LGFwcGx5OmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5mcmFtZXM7aWYoIShiPGNbMF0pKXt2YXIgZDtkPWI+PWNbYy5sZW5ndGgtMV0/Yy5sZW5ndGgtMTpmLmJpbmFyeVNlYXJjaChjLGIsMSktMTt2YXIgZT10aGlzLmF0dGFjaG1lbnROYW1lc1tkXTthLnNsb3RzW3RoaXMuc2xvdEluZGV4XS5zZXRBdHRhY2htZW50KGU/YS5nZXRBdHRhY2htZW50QnlTbG90SW5kZXgodGhpcy5zbG90SW5kZXgsZSk6bnVsbCl9fX0sZi5Ta2VsZXRvbkRhdGE9ZnVuY3Rpb24oKXt0aGlzLmJvbmVzPVtdLHRoaXMuc2xvdHM9W10sdGhpcy5za2lucz1bXSx0aGlzLmFuaW1hdGlvbnM9W119LGYuU2tlbGV0b25EYXRhLnByb3RvdHlwZT17ZGVmYXVsdFNraW46bnVsbCxmaW5kQm9uZTpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5ib25lcyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10ubmFtZT09YSlyZXR1cm4gYltjXTtyZXR1cm4gbnVsbH0sZmluZEJvbmVJbmRleDpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5ib25lcyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10ubmFtZT09YSlyZXR1cm4gYztyZXR1cm4tMX0sZmluZFNsb3Q6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuc2xvdHMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIHNsb3RbY107cmV0dXJuIG51bGx9LGZpbmRTbG90SW5kZXg6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuc2xvdHMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIGM7cmV0dXJuLTF9LGZpbmRTa2luOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLnNraW5zLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5uYW1lPT1hKXJldHVybiBiW2NdO3JldHVybiBudWxsfSxmaW5kQW5pbWF0aW9uOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLmFuaW1hdGlvbnMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9fSxmLlNrZWxldG9uPWZ1bmN0aW9uKGEpe3RoaXMuZGF0YT1hLHRoaXMuYm9uZXM9W107XG5mb3IodmFyIGI9MCxjPWEuYm9uZXMubGVuZ3RoO2M+YjtiKyspe3ZhciBkPWEuYm9uZXNbYl0sZT1kLnBhcmVudD90aGlzLmJvbmVzW2EuYm9uZXMuaW5kZXhPZihkLnBhcmVudCldOm51bGw7dGhpcy5ib25lcy5wdXNoKG5ldyBmLkJvbmUoZCxlKSl9Zm9yKHRoaXMuc2xvdHM9W10sdGhpcy5kcmF3T3JkZXI9W10sYj0wLGM9YS5zbG90cy5sZW5ndGg7Yz5iO2IrKyl7dmFyIGc9YS5zbG90c1tiXSxoPXRoaXMuYm9uZXNbYS5ib25lcy5pbmRleE9mKGcuYm9uZURhdGEpXSxpPW5ldyBmLlNsb3QoZyx0aGlzLGgpO3RoaXMuc2xvdHMucHVzaChpKSx0aGlzLmRyYXdPcmRlci5wdXNoKGkpfX0sZi5Ta2VsZXRvbi5wcm90b3R5cGU9e3g6MCx5OjAsc2tpbjpudWxsLHI6MSxnOjEsYjoxLGE6MSx0aW1lOjAsZmxpcFg6ITEsZmxpcFk6ITEsdXBkYXRlV29ybGRUcmFuc2Zvcm06ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5mbGlwWCxiPXRoaXMuZmxpcFksYz10aGlzLmJvbmVzLGQ9MCxlPWMubGVuZ3RoO2U+ZDtkKyspY1tkXS51cGRhdGVXb3JsZFRyYW5zZm9ybShhLGIpfSxzZXRUb1NldHVwUG9zZTpmdW5jdGlvbigpe3RoaXMuc2V0Qm9uZXNUb1NldHVwUG9zZSgpLHRoaXMuc2V0U2xvdHNUb1NldHVwUG9zZSgpfSxzZXRCb25lc1RvU2V0dXBQb3NlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMuYm9uZXMsYj0wLGM9YS5sZW5ndGg7Yz5iO2IrKylhW2JdLnNldFRvU2V0dXBQb3NlKCl9LHNldFNsb3RzVG9TZXR1cFBvc2U6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5zbG90cyxiPTAsYz1hLmxlbmd0aDtjPmI7YisrKWFbYl0uc2V0VG9TZXR1cFBvc2UoYil9LGdldFJvb3RCb25lOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYm9uZXMubGVuZ3RoP3RoaXMuYm9uZXNbMF06bnVsbH0sZmluZEJvbmU6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXRoaXMuYm9uZXMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLmRhdGEubmFtZT09YSlyZXR1cm4gYltjXTtyZXR1cm4gbnVsbH0sZmluZEJvbmVJbmRleDpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5ib25lcyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10uZGF0YS5uYW1lPT1hKXJldHVybiBjO3JldHVybi0xfSxmaW5kU2xvdDpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5zbG90cyxjPTAsZD1iLmxlbmd0aDtkPmM7YysrKWlmKGJbY10uZGF0YS5uYW1lPT1hKXJldHVybiBiW2NdO3JldHVybiBudWxsfSxmaW5kU2xvdEluZGV4OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLnNsb3RzLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspaWYoYltjXS5kYXRhLm5hbWU9PWEpcmV0dXJuIGM7cmV0dXJuLTF9LHNldFNraW5CeU5hbWU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5kYXRhLmZpbmRTa2luKGEpO2lmKCFiKXRocm93XCJTa2luIG5vdCBmb3VuZDogXCIrYTt0aGlzLnNldFNraW4oYil9LHNldFNraW46ZnVuY3Rpb24oYSl7dGhpcy5za2luJiZhJiZhLl9hdHRhY2hBbGwodGhpcyx0aGlzLnNraW4pLHRoaXMuc2tpbj1hfSxnZXRBdHRhY2htZW50QnlTbG90TmFtZTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmdldEF0dGFjaG1lbnRCeVNsb3RJbmRleCh0aGlzLmRhdGEuZmluZFNsb3RJbmRleChhKSxiKX0sZ2V0QXR0YWNobWVudEJ5U2xvdEluZGV4OmZ1bmN0aW9uKGEsYil7aWYodGhpcy5za2luKXt2YXIgYz10aGlzLnNraW4uZ2V0QXR0YWNobWVudChhLGIpO2lmKGMpcmV0dXJuIGN9cmV0dXJuIHRoaXMuZGF0YS5kZWZhdWx0U2tpbj90aGlzLmRhdGEuZGVmYXVsdFNraW4uZ2V0QXR0YWNobWVudChhLGIpOm51bGx9LHNldEF0dGFjaG1lbnQ6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9dGhpcy5zbG90cyxkPTAsZT1jLnNpemU7ZT5kO2QrKyl7dmFyIGY9Y1tkXTtpZihmLmRhdGEubmFtZT09YSl7dmFyIGc9bnVsbDtpZihiJiYoZz10aGlzLmdldEF0dGFjaG1lbnQoZCxiKSxudWxsPT1nKSl0aHJvd1wiQXR0YWNobWVudCBub3QgZm91bmQ6IFwiK2IrXCIsIGZvciBzbG90OiBcIithO3JldHVybiBmLnNldEF0dGFjaG1lbnQoZyksdm9pZCAwfX10aHJvd1wiU2xvdCBub3QgZm91bmQ6IFwiK2F9LHVwZGF0ZTpmdW5jdGlvbihhKXt0aW1lKz1hfX0sZi5BdHRhY2htZW50VHlwZT17cmVnaW9uOjB9LGYuUmVnaW9uQXR0YWNobWVudD1mdW5jdGlvbigpe3RoaXMub2Zmc2V0PVtdLHRoaXMub2Zmc2V0Lmxlbmd0aD04LHRoaXMudXZzPVtdLHRoaXMudXZzLmxlbmd0aD04fSxmLlJlZ2lvbkF0dGFjaG1lbnQucHJvdG90eXBlPXt4OjAseTowLHJvdGF0aW9uOjAsc2NhbGVYOjEsc2NhbGVZOjEsd2lkdGg6MCxoZWlnaHQ6MCxyZW5kZXJlck9iamVjdDpudWxsLHJlZ2lvbk9mZnNldFg6MCxyZWdpb25PZmZzZXRZOjAscmVnaW9uV2lkdGg6MCxyZWdpb25IZWlnaHQ6MCxyZWdpb25PcmlnaW5hbFdpZHRoOjAscmVnaW9uT3JpZ2luYWxIZWlnaHQ6MCxzZXRVVnM6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj10aGlzLnV2cztlPyhmWzJdPWEsZlszXT1kLGZbNF09YSxmWzVdPWIsZls2XT1jLGZbN109YixmWzBdPWMsZlsxXT1kKTooZlswXT1hLGZbMV09ZCxmWzJdPWEsZlszXT1iLGZbNF09YyxmWzVdPWIsZls2XT1jLGZbN109ZCl9LHVwZGF0ZU9mZnNldDpmdW5jdGlvbigpe3ZhciBhPXRoaXMud2lkdGgvdGhpcy5yZWdpb25PcmlnaW5hbFdpZHRoKnRoaXMuc2NhbGVYLGI9dGhpcy5oZWlnaHQvdGhpcy5yZWdpb25PcmlnaW5hbEhlaWdodCp0aGlzLnNjYWxlWSxjPS10aGlzLndpZHRoLzIqdGhpcy5zY2FsZVgrdGhpcy5yZWdpb25PZmZzZXRYKmEsZD0tdGhpcy5oZWlnaHQvMip0aGlzLnNjYWxlWSt0aGlzLnJlZ2lvbk9mZnNldFkqYixlPWMrdGhpcy5yZWdpb25XaWR0aCphLGY9ZCt0aGlzLnJlZ2lvbkhlaWdodCpiLGc9dGhpcy5yb3RhdGlvbipNYXRoLlBJLzE4MCxoPU1hdGguY29zKGcpLGk9TWF0aC5zaW4oZyksaj1jKmgrdGhpcy54LGs9YyppLGw9ZCpoK3RoaXMueSxtPWQqaSxuPWUqaCt0aGlzLngsbz1lKmkscD1mKmgrdGhpcy55LHE9ZippLHI9dGhpcy5vZmZzZXQ7clswXT1qLW0sclsxXT1sK2ssclsyXT1qLXEsclszXT1wK2sscls0XT1uLXEscls1XT1wK28scls2XT1uLW0scls3XT1sK299LGNvbXB1dGVWZXJ0aWNlczpmdW5jdGlvbihhLGIsYyxkKXthKz1jLndvcmxkWCxiKz1jLndvcmxkWTt2YXIgZT1jLm0wMCxmPWMubTAxLGc9Yy5tMTAsaD1jLm0xMSxpPXRoaXMub2Zmc2V0O2RbMF09aVswXSplK2lbMV0qZithLGRbMV09aVswXSpnK2lbMV0qaCtiLGRbMl09aVsyXSplK2lbM10qZithLGRbM109aVsyXSpnK2lbM10qaCtiLGRbNF09aVs0XSplK2lbNV0qZithLGRbNV09aVs0XSpnK2lbNV0qaCtiLGRbNl09aVs2XSplK2lbN10qZithLGRbN109aVs2XSpnK2lbN10qaCtifX0sZi5BbmltYXRpb25TdGF0ZURhdGE9ZnVuY3Rpb24oYSl7dGhpcy5za2VsZXRvbkRhdGE9YSx0aGlzLmFuaW1hdGlvblRvTWl4VGltZT17fX0sZi5BbmltYXRpb25TdGF0ZURhdGEucHJvdG90eXBlPXtkZWZhdWx0TWl4OjAsc2V0TWl4QnlOYW1lOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzLnNrZWxldG9uRGF0YS5maW5kQW5pbWF0aW9uKGEpO2lmKCFkKXRocm93XCJBbmltYXRpb24gbm90IGZvdW5kOiBcIithO3ZhciBlPXRoaXMuc2tlbGV0b25EYXRhLmZpbmRBbmltYXRpb24oYik7aWYoIWUpdGhyb3dcIkFuaW1hdGlvbiBub3QgZm91bmQ6IFwiK2I7dGhpcy5zZXRNaXgoZCxlLGMpfSxzZXRNaXg6ZnVuY3Rpb24oYSxiLGMpe3RoaXMuYW5pbWF0aW9uVG9NaXhUaW1lW2EubmFtZStcIjpcIitiLm5hbWVdPWN9LGdldE1peDpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuYW5pbWF0aW9uVG9NaXhUaW1lW2EubmFtZStcIjpcIitiLm5hbWVdO3JldHVybiBjP2M6dGhpcy5kZWZhdWx0TWl4fX0sZi5BbmltYXRpb25TdGF0ZT1mdW5jdGlvbihhKXt0aGlzLmRhdGE9YSx0aGlzLnF1ZXVlPVtdfSxmLkFuaW1hdGlvblN0YXRlLnByb3RvdHlwZT17YW5pbWF0aW9uU3BlZWQ6MSxjdXJyZW50Om51bGwscHJldmlvdXM6bnVsbCxjdXJyZW50VGltZTowLHByZXZpb3VzVGltZTowLGN1cnJlbnRMb29wOiExLHByZXZpb3VzTG9vcDohMSxtaXhUaW1lOjAsbWl4RHVyYXRpb246MCx1cGRhdGU6ZnVuY3Rpb24oYSl7aWYodGhpcy5jdXJyZW50VGltZSs9YSp0aGlzLmFuaW1hdGlvblNwZWVkLHRoaXMucHJldmlvdXNUaW1lKz1hLHRoaXMubWl4VGltZSs9YSx0aGlzLnF1ZXVlLmxlbmd0aD4wKXt2YXIgYj10aGlzLnF1ZXVlWzBdO3RoaXMuY3VycmVudFRpbWU+PWIuZGVsYXkmJih0aGlzLl9zZXRBbmltYXRpb24oYi5hbmltYXRpb24sYi5sb29wKSx0aGlzLnF1ZXVlLnNoaWZ0KCkpfX0sYXBwbHk6ZnVuY3Rpb24oYSl7aWYodGhpcy5jdXJyZW50KWlmKHRoaXMucHJldmlvdXMpe3RoaXMucHJldmlvdXMuYXBwbHkoYSx0aGlzLnByZXZpb3VzVGltZSx0aGlzLnByZXZpb3VzTG9vcCk7dmFyIGI9dGhpcy5taXhUaW1lL3RoaXMubWl4RHVyYXRpb247Yj49MSYmKGI9MSx0aGlzLnByZXZpb3VzPW51bGwpLHRoaXMuY3VycmVudC5taXgoYSx0aGlzLmN1cnJlbnRUaW1lLHRoaXMuY3VycmVudExvb3AsYil9ZWxzZSB0aGlzLmN1cnJlbnQuYXBwbHkoYSx0aGlzLmN1cnJlbnRUaW1lLHRoaXMuY3VycmVudExvb3ApfSxjbGVhckFuaW1hdGlvbjpmdW5jdGlvbigpe3RoaXMucHJldmlvdXM9bnVsbCx0aGlzLmN1cnJlbnQ9bnVsbCx0aGlzLnF1ZXVlLmxlbmd0aD0wfSxfc2V0QW5pbWF0aW9uOmZ1bmN0aW9uKGEsYil7dGhpcy5wcmV2aW91cz1udWxsLGEmJnRoaXMuY3VycmVudCYmKHRoaXMubWl4RHVyYXRpb249dGhpcy5kYXRhLmdldE1peCh0aGlzLmN1cnJlbnQsYSksdGhpcy5taXhEdXJhdGlvbj4wJiYodGhpcy5taXhUaW1lPTAsdGhpcy5wcmV2aW91cz10aGlzLmN1cnJlbnQsdGhpcy5wcmV2aW91c1RpbWU9dGhpcy5jdXJyZW50VGltZSx0aGlzLnByZXZpb3VzTG9vcD10aGlzLmN1cnJlbnRMb29wKSksdGhpcy5jdXJyZW50PWEsdGhpcy5jdXJyZW50TG9vcD1iLHRoaXMuY3VycmVudFRpbWU9MH0sc2V0QW5pbWF0aW9uQnlOYW1lOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5kYXRhLnNrZWxldG9uRGF0YS5maW5kQW5pbWF0aW9uKGEpO2lmKCFjKXRocm93XCJBbmltYXRpb24gbm90IGZvdW5kOiBcIithO3RoaXMuc2V0QW5pbWF0aW9uKGMsYil9LHNldEFuaW1hdGlvbjpmdW5jdGlvbihhLGIpe3RoaXMucXVldWUubGVuZ3RoPTAsdGhpcy5fc2V0QW5pbWF0aW9uKGEsYil9LGFkZEFuaW1hdGlvbkJ5TmFtZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcy5kYXRhLnNrZWxldG9uRGF0YS5maW5kQW5pbWF0aW9uKGEpO2lmKCFkKXRocm93XCJBbmltYXRpb24gbm90IGZvdW5kOiBcIithO3RoaXMuYWRkQW5pbWF0aW9uKGQsYixjKX0sYWRkQW5pbWF0aW9uOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD17fTtpZihkLmFuaW1hdGlvbj1hLGQubG9vcD1iLCFjfHwwPj1jKXt2YXIgZT10aGlzLnF1ZXVlLmxlbmd0aD90aGlzLnF1ZXVlW3RoaXMucXVldWUubGVuZ3RoLTFdLmFuaW1hdGlvbjp0aGlzLmN1cnJlbnQ7Yz1udWxsIT1lP2UuZHVyYXRpb24tdGhpcy5kYXRhLmdldE1peChlLGEpKyhjfHwwKTowfWQuZGVsYXk9Yyx0aGlzLnF1ZXVlLnB1c2goZCl9LGlzQ29tcGxldGU6ZnVuY3Rpb24oKXtyZXR1cm4hdGhpcy5jdXJyZW50fHx0aGlzLmN1cnJlbnRUaW1lPj10aGlzLmN1cnJlbnQuZHVyYXRpb259fSxmLlNrZWxldG9uSnNvbj1mdW5jdGlvbihhKXt0aGlzLmF0dGFjaG1lbnRMb2FkZXI9YX0sZi5Ta2VsZXRvbkpzb24ucHJvdG90eXBlPXtzY2FsZToxLHJlYWRTa2VsZXRvbkRhdGE6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGM9bmV3IGYuU2tlbGV0b25EYXRhLGQ9YS5ib25lcyxlPTAsZz1kLmxlbmd0aDtnPmU7ZSsrKXt2YXIgaD1kW2VdLGk9bnVsbDtpZihoLnBhcmVudCYmKGk9Yy5maW5kQm9uZShoLnBhcmVudCksIWkpKXRocm93XCJQYXJlbnQgYm9uZSBub3QgZm91bmQ6IFwiK2gucGFyZW50O2I9bmV3IGYuQm9uZURhdGEoaC5uYW1lLGkpLGIubGVuZ3RoPShoLmxlbmd0aHx8MCkqdGhpcy5zY2FsZSxiLng9KGgueHx8MCkqdGhpcy5zY2FsZSxiLnk9KGgueXx8MCkqdGhpcy5zY2FsZSxiLnJvdGF0aW9uPWgucm90YXRpb258fDAsYi5zY2FsZVg9aC5zY2FsZVh8fDEsYi5zY2FsZVk9aC5zY2FsZVl8fDEsYy5ib25lcy5wdXNoKGIpfXZhciBqPWEuc2xvdHM7Zm9yKGU9MCxnPWoubGVuZ3RoO2c+ZTtlKyspe3ZhciBrPWpbZV07aWYoYj1jLmZpbmRCb25lKGsuYm9uZSksIWIpdGhyb3dcIlNsb3QgYm9uZSBub3QgZm91bmQ6IFwiK2suYm9uZTt2YXIgbD1uZXcgZi5TbG90RGF0YShrLm5hbWUsYiksbT1rLmNvbG9yO20mJihsLnI9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcihtLDApLGwuZz1mLlNrZWxldG9uSnNvbi50b0NvbG9yKG0sMSksbC5iPWYuU2tlbGV0b25Kc29uLnRvQ29sb3IobSwyKSxsLmE9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcihtLDMpKSxsLmF0dGFjaG1lbnROYW1lPWsuYXR0YWNobWVudCxjLnNsb3RzLnB1c2gobCl9dmFyIG49YS5za2lucztmb3IodmFyIG8gaW4gbilpZihuLmhhc093blByb3BlcnR5KG8pKXt2YXIgcD1uW29dLHE9bmV3IGYuU2tpbihvKTtmb3IodmFyIHIgaW4gcClpZihwLmhhc093blByb3BlcnR5KHIpKXt2YXIgcz1jLmZpbmRTbG90SW5kZXgociksdD1wW3JdO2Zvcih2YXIgdSBpbiB0KWlmKHQuaGFzT3duUHJvcGVydHkodSkpe3ZhciB2PXRoaXMucmVhZEF0dGFjaG1lbnQocSx1LHRbdV0pO251bGwhPXYmJnEuYWRkQXR0YWNobWVudChzLHUsdil9fWMuc2tpbnMucHVzaChxKSxcImRlZmF1bHRcIj09cS5uYW1lJiYoYy5kZWZhdWx0U2tpbj1xKX12YXIgdz1hLmFuaW1hdGlvbnM7Zm9yKHZhciB4IGluIHcpdy5oYXNPd25Qcm9wZXJ0eSh4KSYmdGhpcy5yZWFkQW5pbWF0aW9uKHgsd1t4XSxjKTtyZXR1cm4gY30scmVhZEF0dGFjaG1lbnQ6ZnVuY3Rpb24oYSxiLGMpe2I9Yy5uYW1lfHxiO3ZhciBkPWYuQXR0YWNobWVudFR5cGVbYy50eXBlfHxcInJlZ2lvblwiXTtpZihkPT1mLkF0dGFjaG1lbnRUeXBlLnJlZ2lvbil7dmFyIGU9bmV3IGYuUmVnaW9uQXR0YWNobWVudDtyZXR1cm4gZS54PShjLnh8fDApKnRoaXMuc2NhbGUsZS55PShjLnl8fDApKnRoaXMuc2NhbGUsZS5zY2FsZVg9Yy5zY2FsZVh8fDEsZS5zY2FsZVk9Yy5zY2FsZVl8fDEsZS5yb3RhdGlvbj1jLnJvdGF0aW9ufHwwLGUud2lkdGg9KGMud2lkdGh8fDMyKSp0aGlzLnNjYWxlLGUuaGVpZ2h0PShjLmhlaWdodHx8MzIpKnRoaXMuc2NhbGUsZS51cGRhdGVPZmZzZXQoKSxlLnJlbmRlcmVyT2JqZWN0PXt9LGUucmVuZGVyZXJPYmplY3QubmFtZT1iLGUucmVuZGVyZXJPYmplY3Quc2NhbGU9e30sZS5yZW5kZXJlck9iamVjdC5zY2FsZS54PWUuc2NhbGVYLGUucmVuZGVyZXJPYmplY3Quc2NhbGUueT1lLnNjYWxlWSxlLnJlbmRlcmVyT2JqZWN0LnJvdGF0aW9uPS1lLnJvdGF0aW9uKk1hdGguUEkvMTgwLGV9dGhyb3dcIlVua25vd24gYXR0YWNobWVudCB0eXBlOiBcIitkfSxyZWFkQW5pbWF0aW9uOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGcsaCxpLGosayxsPVtdLG09MCxuPWIuYm9uZXM7Zm9yKHZhciBvIGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eShvKSl7dmFyIHA9Yy5maW5kQm9uZUluZGV4KG8pO2lmKC0xPT1wKXRocm93XCJCb25lIG5vdCBmb3VuZDogXCIrbzt2YXIgcT1uW29dO2ZvcihnIGluIHEpaWYocS5oYXNPd25Qcm9wZXJ0eShnKSlpZihpPXFbZ10sXCJyb3RhdGVcIj09Zyl7Zm9yKGU9bmV3IGYuUm90YXRlVGltZWxpbmUoaS5sZW5ndGgpLGUuYm9uZUluZGV4PXAsZD0wLGo9MCxrPWkubGVuZ3RoO2s+ajtqKyspaD1pW2pdLGUuc2V0RnJhbWUoZCxoLnRpbWUsaC5hbmdsZSksZi5Ta2VsZXRvbkpzb24ucmVhZEN1cnZlKGUsZCxoKSxkKys7bC5wdXNoKGUpLG09TWF0aC5tYXgobSxlLmZyYW1lc1syKmUuZ2V0RnJhbWVDb3VudCgpLTJdKX1lbHNle2lmKFwidHJhbnNsYXRlXCIhPWcmJlwic2NhbGVcIiE9Zyl0aHJvd1wiSW52YWxpZCB0aW1lbGluZSB0eXBlIGZvciBhIGJvbmU6IFwiK2crXCIgKFwiK28rXCIpXCI7dmFyIHI9MTtmb3IoXCJzY2FsZVwiPT1nP2U9bmV3IGYuU2NhbGVUaW1lbGluZShpLmxlbmd0aCk6KGU9bmV3IGYuVHJhbnNsYXRlVGltZWxpbmUoaS5sZW5ndGgpLHI9dGhpcy5zY2FsZSksZS5ib25lSW5kZXg9cCxkPTAsaj0wLGs9aS5sZW5ndGg7az5qO2orKyl7aD1pW2pdO3ZhciBzPShoLnh8fDApKnIsdD0oaC55fHwwKSpyO2Uuc2V0RnJhbWUoZCxoLnRpbWUscyx0KSxmLlNrZWxldG9uSnNvbi5yZWFkQ3VydmUoZSxkLGgpLGQrK31sLnB1c2goZSksbT1NYXRoLm1heChtLGUuZnJhbWVzWzMqZS5nZXRGcmFtZUNvdW50KCktM10pfX12YXIgdT1iLnNsb3RzO2Zvcih2YXIgdiBpbiB1KWlmKHUuaGFzT3duUHJvcGVydHkodikpe3ZhciB3PXVbdl0seD1jLmZpbmRTbG90SW5kZXgodik7Zm9yKGcgaW4gdylpZih3Lmhhc093blByb3BlcnR5KGcpKWlmKGk9d1tnXSxcImNvbG9yXCI9PWcpe2ZvcihlPW5ldyBmLkNvbG9yVGltZWxpbmUoaS5sZW5ndGgpLGUuc2xvdEluZGV4PXgsZD0wLGo9MCxrPWkubGVuZ3RoO2s+ajtqKyspe2g9aVtqXTt2YXIgeT1oLmNvbG9yLHo9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcih5LDApLEE9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcih5LDEpLEI9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcih5LDIpLEM9Zi5Ta2VsZXRvbkpzb24udG9Db2xvcih5LDMpO2Uuc2V0RnJhbWUoZCxoLnRpbWUseixBLEIsQyksZi5Ta2VsZXRvbkpzb24ucmVhZEN1cnZlKGUsZCxoKSxkKyt9bC5wdXNoKGUpLG09TWF0aC5tYXgobSxlLmZyYW1lc1s1KmUuZ2V0RnJhbWVDb3VudCgpLTVdKX1lbHNle2lmKFwiYXR0YWNobWVudFwiIT1nKXRocm93XCJJbnZhbGlkIHRpbWVsaW5lIHR5cGUgZm9yIGEgc2xvdDogXCIrZytcIiAoXCIrditcIilcIjtmb3IoZT1uZXcgZi5BdHRhY2htZW50VGltZWxpbmUoaS5sZW5ndGgpLGUuc2xvdEluZGV4PXgsZD0wLGo9MCxrPWkubGVuZ3RoO2s+ajtqKyspaD1pW2pdLGUuc2V0RnJhbWUoZCsrLGgudGltZSxoLm5hbWUpO2wucHVzaChlKSxtPU1hdGgubWF4KG0sZS5mcmFtZXNbZS5nZXRGcmFtZUNvdW50KCktMV0pfX1jLmFuaW1hdGlvbnMucHVzaChuZXcgZi5BbmltYXRpb24oYSxsLG0pKX19LGYuU2tlbGV0b25Kc29uLnJlYWRDdXJ2ZT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Yy5jdXJ2ZTtkJiYoXCJzdGVwcGVkXCI9PWQ/YS5jdXJ2ZXMuc2V0U3RlcHBlZChiKTpkIGluc3RhbmNlb2YgQXJyYXkmJmEuY3VydmVzLnNldEN1cnZlKGIsZFswXSxkWzFdLGRbMl0sZFszXSkpfSxmLlNrZWxldG9uSnNvbi50b0NvbG9yPWZ1bmN0aW9uKGEsYil7aWYoOCE9YS5sZW5ndGgpdGhyb3dcIkNvbG9yIGhleGlkZWNpbWFsIGxlbmd0aCBtdXN0IGJlIDgsIHJlY2lldmVkOiBcIithO3JldHVybiBwYXJzZUludChhLnN1YnN0cigyKmIsMiksMTYpLzI1NX0sZi5BdGxhcz1mdW5jdGlvbihhLGIpe3RoaXMudGV4dHVyZUxvYWRlcj1iLHRoaXMucGFnZXM9W10sdGhpcy5yZWdpb25zPVtdO3ZhciBjPW5ldyBmLkF0bGFzUmVhZGVyKGEpLGQ9W107ZC5sZW5ndGg9NDtmb3IodmFyIGU9bnVsbDs7KXt2YXIgZz1jLnJlYWRMaW5lKCk7aWYobnVsbD09ZylicmVhaztpZihnPWMudHJpbShnKSxnLmxlbmd0aClpZihlKXt2YXIgaD1uZXcgZi5BdGxhc1JlZ2lvbjtoLm5hbWU9ZyxoLnBhZ2U9ZSxoLnJvdGF0ZT1cInRydWVcIj09Yy5yZWFkVmFsdWUoKSxjLnJlYWRUdXBsZShkKTt2YXIgaT1wYXJzZUludChkWzBdLDEwKSxqPXBhcnNlSW50KGRbMV0sMTApO2MucmVhZFR1cGxlKGQpO3ZhciBrPXBhcnNlSW50KGRbMF0sMTApLGw9cGFyc2VJbnQoZFsxXSwxMCk7aC51PWkvZS53aWR0aCxoLnY9ai9lLmhlaWdodCxoLnJvdGF0ZT8oaC51Mj0oaStsKS9lLndpZHRoLGgudjI9KGoraykvZS5oZWlnaHQpOihoLnUyPShpK2spL2Uud2lkdGgsaC52Mj0oaitsKS9lLmhlaWdodCksaC54PWksaC55PWosaC53aWR0aD1NYXRoLmFicyhrKSxoLmhlaWdodD1NYXRoLmFicyhsKSw0PT1jLnJlYWRUdXBsZShkKSYmKGguc3BsaXRzPVtwYXJzZUludChkWzBdLDEwKSxwYXJzZUludChkWzFdLDEwKSxwYXJzZUludChkWzJdLDEwKSxwYXJzZUludChkWzNdLDEwKV0sND09Yy5yZWFkVHVwbGUoZCkmJihoLnBhZHM9W3BhcnNlSW50KGRbMF0sMTApLHBhcnNlSW50KGRbMV0sMTApLHBhcnNlSW50KGRbMl0sMTApLHBhcnNlSW50KGRbM10sMTApXSxjLnJlYWRUdXBsZShkKSkpLGgub3JpZ2luYWxXaWR0aD1wYXJzZUludChkWzBdLDEwKSxoLm9yaWdpbmFsSGVpZ2h0PXBhcnNlSW50KGRbMV0sMTApLGMucmVhZFR1cGxlKGQpLGgub2Zmc2V0WD1wYXJzZUludChkWzBdLDEwKSxoLm9mZnNldFk9cGFyc2VJbnQoZFsxXSwxMCksaC5pbmRleD1wYXJzZUludChjLnJlYWRWYWx1ZSgpLDEwKSx0aGlzLnJlZ2lvbnMucHVzaChoKX1lbHNle2U9bmV3IGYuQXRsYXNQYWdlLGUubmFtZT1nLGUuZm9ybWF0PWYuQXRsYXMuRm9ybWF0W2MucmVhZFZhbHVlKCldLGMucmVhZFR1cGxlKGQpLGUubWluRmlsdGVyPWYuQXRsYXMuVGV4dHVyZUZpbHRlcltkWzBdXSxlLm1hZ0ZpbHRlcj1mLkF0bGFzLlRleHR1cmVGaWx0ZXJbZFsxXV07dmFyIG09Yy5yZWFkVmFsdWUoKTtlLnVXcmFwPWYuQXRsYXMuVGV4dHVyZVdyYXAuY2xhbXBUb0VkZ2UsZS52V3JhcD1mLkF0bGFzLlRleHR1cmVXcmFwLmNsYW1wVG9FZGdlLFwieFwiPT1tP2UudVdyYXA9Zi5BdGxhcy5UZXh0dXJlV3JhcC5yZXBlYXQ6XCJ5XCI9PW0/ZS52V3JhcD1mLkF0bGFzLlRleHR1cmVXcmFwLnJlcGVhdDpcInh5XCI9PW0mJihlLnVXcmFwPWUudldyYXA9Zi5BdGxhcy5UZXh0dXJlV3JhcC5yZXBlYXQpLGIubG9hZChlLGcpLHRoaXMucGFnZXMucHVzaChlKX1lbHNlIGU9bnVsbH19LGYuQXRsYXMucHJvdG90eXBlPXtmaW5kUmVnaW9uOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLnJlZ2lvbnMsYz0wLGQ9Yi5sZW5ndGg7ZD5jO2MrKylpZihiW2NdLm5hbWU9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGRpc3Bvc2U6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5wYWdlcyxiPTAsYz1hLmxlbmd0aDtjPmI7YisrKXRoaXMudGV4dHVyZUxvYWRlci51bmxvYWQoYVtiXS5yZW5kZXJlck9iamVjdCl9LHVwZGF0ZVVWczpmdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5yZWdpb25zLGM9MCxkPWIubGVuZ3RoO2Q+YztjKyspe3ZhciBlPWJbY107ZS5wYWdlPT1hJiYoZS51PWUueC9hLndpZHRoLGUudj1lLnkvYS5oZWlnaHQsZS5yb3RhdGU/KGUudTI9KGUueCtlLmhlaWdodCkvYS53aWR0aCxlLnYyPShlLnkrZS53aWR0aCkvYS5oZWlnaHQpOihlLnUyPShlLngrZS53aWR0aCkvYS53aWR0aCxlLnYyPShlLnkrZS5oZWlnaHQpL2EuaGVpZ2h0KSl9fX0sZi5BdGxhcy5Gb3JtYXQ9e2FscGhhOjAsaW50ZW5zaXR5OjEsbHVtaW5hbmNlQWxwaGE6MixyZ2I1NjU6MyxyZ2JhNDQ0NDo0LHJnYjg4ODo1LHJnYmE4ODg4OjZ9LGYuQXRsYXMuVGV4dHVyZUZpbHRlcj17bmVhcmVzdDowLGxpbmVhcjoxLG1pcE1hcDoyLG1pcE1hcE5lYXJlc3ROZWFyZXN0OjMsbWlwTWFwTGluZWFyTmVhcmVzdDo0LG1pcE1hcE5lYXJlc3RMaW5lYXI6NSxtaXBNYXBMaW5lYXJMaW5lYXI6Nn0sZi5BdGxhcy5UZXh0dXJlV3JhcD17bWlycm9yZWRSZXBlYXQ6MCxjbGFtcFRvRWRnZToxLHJlcGVhdDoyfSxmLkF0bGFzUGFnZT1mdW5jdGlvbigpe30sZi5BdGxhc1BhZ2UucHJvdG90eXBlPXtuYW1lOm51bGwsZm9ybWF0Om51bGwsbWluRmlsdGVyOm51bGwsbWFnRmlsdGVyOm51bGwsdVdyYXA6bnVsbCx2V3JhcDpudWxsLHJlbmRlcmVyT2JqZWN0Om51bGwsd2lkdGg6MCxoZWlnaHQ6MH0sZi5BdGxhc1JlZ2lvbj1mdW5jdGlvbigpe30sZi5BdGxhc1JlZ2lvbi5wcm90b3R5cGU9e3BhZ2U6bnVsbCxuYW1lOm51bGwseDowLHk6MCx3aWR0aDowLGhlaWdodDowLHU6MCx2OjAsdTI6MCx2MjowLG9mZnNldFg6MCxvZmZzZXRZOjAsb3JpZ2luYWxXaWR0aDowLG9yaWdpbmFsSGVpZ2h0OjAsaW5kZXg6MCxyb3RhdGU6ITEsc3BsaXRzOm51bGwscGFkczpudWxsfSxmLkF0bGFzUmVhZGVyPWZ1bmN0aW9uKGEpe3RoaXMubGluZXM9YS5zcGxpdCgvXFxyXFxufFxccnxcXG4vKX0sZi5BdGxhc1JlYWRlci5wcm90b3R5cGU9e2luZGV4OjAsdHJpbTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpfSxyZWFkTGluZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmluZGV4Pj10aGlzLmxpbmVzLmxlbmd0aD9udWxsOnRoaXMubGluZXNbdGhpcy5pbmRleCsrXX0scmVhZFZhbHVlOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5yZWFkTGluZSgpLGI9YS5pbmRleE9mKFwiOlwiKTtpZigtMT09Yil0aHJvd1wiSW52YWxpZCBsaW5lOiBcIithO3JldHVybiB0aGlzLnRyaW0oYS5zdWJzdHJpbmcoYisxKSl9LHJlYWRUdXBsZTpmdW5jdGlvbihhKXt2YXIgYj10aGlzLnJlYWRMaW5lKCksYz1iLmluZGV4T2YoXCI6XCIpO2lmKC0xPT1jKXRocm93XCJJbnZhbGlkIGxpbmU6IFwiK2I7Zm9yKHZhciBkPTAsZT1jKzE7Mz5kO2QrKyl7dmFyIGY9Yi5pbmRleE9mKFwiLFwiLGUpO2lmKC0xPT1mKXtpZighZCl0aHJvd1wiSW52YWxpZCBsaW5lOiBcIitiO2JyZWFrfWFbZF09dGhpcy50cmltKGIuc3Vic3RyKGUsZi1lKSksZT1mKzF9cmV0dXJuIGFbZF09dGhpcy50cmltKGIuc3Vic3RyaW5nKGUpKSxkKzF9fSxmLkF0bGFzQXR0YWNobWVudExvYWRlcj1mdW5jdGlvbihhKXt0aGlzLmF0bGFzPWF9LGYuQXRsYXNBdHRhY2htZW50TG9hZGVyLnByb3RvdHlwZT17bmV3QXR0YWNobWVudDpmdW5jdGlvbihhLGIsYyl7c3dpdGNoKGIpe2Nhc2UgZi5BdHRhY2htZW50VHlwZS5yZWdpb246dmFyIGQ9dGhpcy5hdGxhcy5maW5kUmVnaW9uKGMpO2lmKCFkKXRocm93XCJSZWdpb24gbm90IGZvdW5kIGluIGF0bGFzOiBcIitjK1wiIChcIitiK1wiKVwiO3ZhciBlPW5ldyBmLlJlZ2lvbkF0dGFjaG1lbnQoYyk7cmV0dXJuIGUucmVuZGVyZXJPYmplY3Q9ZCxlLnNldFVWcyhkLnUsZC52LGQudTIsZC52MixkLnJvdGF0ZSksZS5yZWdpb25PZmZzZXRYPWQub2Zmc2V0WCxlLnJlZ2lvbk9mZnNldFk9ZC5vZmZzZXRZLGUucmVnaW9uV2lkdGg9ZC53aWR0aCxlLnJlZ2lvbkhlaWdodD1kLmhlaWdodCxlLnJlZ2lvbk9yaWdpbmFsV2lkdGg9ZC5vcmlnaW5hbFdpZHRoLGUucmVnaW9uT3JpZ2luYWxIZWlnaHQ9ZC5vcmlnaW5hbEhlaWdodCxlfXRocm93XCJVbmtub3duIGF0dGFjaG1lbnQgdHlwZTogXCIrYn19LGYuQm9uZS55RG93bj0hMCxiLkFuaW1DYWNoZT17fSxiLlNwaW5lPWZ1bmN0aW9uKGEpe2lmKGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpLHRoaXMuc3BpbmVEYXRhPWIuQW5pbUNhY2hlW2FdLCF0aGlzLnNwaW5lRGF0YSl0aHJvdyBuZXcgRXJyb3IoXCJTcGluZSBkYXRhIG11c3QgYmUgcHJlbG9hZGVkIHVzaW5nIFBJWEkuU3BpbmVMb2FkZXIgb3IgUElYSS5Bc3NldExvYWRlcjogXCIrYSk7dGhpcy5za2VsZXRvbj1uZXcgZi5Ta2VsZXRvbih0aGlzLnNwaW5lRGF0YSksdGhpcy5za2VsZXRvbi51cGRhdGVXb3JsZFRyYW5zZm9ybSgpLHRoaXMuc3RhdGVEYXRhPW5ldyBmLkFuaW1hdGlvblN0YXRlRGF0YSh0aGlzLnNwaW5lRGF0YSksdGhpcy5zdGF0ZT1uZXcgZi5BbmltYXRpb25TdGF0ZSh0aGlzLnN0YXRlRGF0YSksdGhpcy5zbG90Q29udGFpbmVycz1bXTtmb3IodmFyIGM9MCxkPXRoaXMuc2tlbGV0b24uZHJhd09yZGVyLmxlbmd0aDtkPmM7YysrKXt2YXIgZT10aGlzLnNrZWxldG9uLmRyYXdPcmRlcltjXSxnPWUuYXR0YWNobWVudCxoPW5ldyBiLkRpc3BsYXlPYmplY3RDb250YWluZXI7aWYodGhpcy5zbG90Q29udGFpbmVycy5wdXNoKGgpLHRoaXMuYWRkQ2hpbGQoaCksZyBpbnN0YW5jZW9mIGYuUmVnaW9uQXR0YWNobWVudCl7dmFyIGk9Zy5yZW5kZXJlck9iamVjdC5uYW1lLGo9dGhpcy5jcmVhdGVTcHJpdGUoZSxnLnJlbmRlcmVyT2JqZWN0KTtlLmN1cnJlbnRTcHJpdGU9aixlLmN1cnJlbnRTcHJpdGVOYW1lPWksaC5hZGRDaGlsZChqKX19fSxiLlNwaW5lLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuRGlzcGxheU9iamVjdENvbnRhaW5lci5wcm90b3R5cGUpLGIuU3BpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuU3BpbmUsYi5TcGluZS5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy5sYXN0VGltZT10aGlzLmxhc3RUaW1lfHxEYXRlLm5vdygpO3ZhciBhPS4wMDEqKERhdGUubm93KCktdGhpcy5sYXN0VGltZSk7dGhpcy5sYXN0VGltZT1EYXRlLm5vdygpLHRoaXMuc3RhdGUudXBkYXRlKGEpLHRoaXMuc3RhdGUuYXBwbHkodGhpcy5za2VsZXRvbiksdGhpcy5za2VsZXRvbi51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO2Zvcih2YXIgYz10aGlzLnNrZWxldG9uLmRyYXdPcmRlcixkPTAsZT1jLmxlbmd0aDtlPmQ7ZCsrKXt2YXIgZz1jW2RdLGg9Zy5hdHRhY2htZW50LGk9dGhpcy5zbG90Q29udGFpbmVyc1tkXTtpZihoIGluc3RhbmNlb2YgZi5SZWdpb25BdHRhY2htZW50KXtpZihoLnJlbmRlcmVyT2JqZWN0JiYoIWcuY3VycmVudFNwcml0ZU5hbWV8fGcuY3VycmVudFNwcml0ZU5hbWUhPWgubmFtZSkpe3ZhciBqPWgucmVuZGVyZXJPYmplY3QubmFtZTtpZih2b2lkIDAhPT1nLmN1cnJlbnRTcHJpdGUmJihnLmN1cnJlbnRTcHJpdGUudmlzaWJsZT0hMSksZy5zcHJpdGVzPWcuc3ByaXRlc3x8e30sdm9pZCAwIT09Zy5zcHJpdGVzW2pdKWcuc3ByaXRlc1tqXS52aXNpYmxlPSEwO2Vsc2V7dmFyIGs9dGhpcy5jcmVhdGVTcHJpdGUoZyxoLnJlbmRlcmVyT2JqZWN0KTtpLmFkZENoaWxkKGspfWcuY3VycmVudFNwcml0ZT1nLnNwcml0ZXNbal0sZy5jdXJyZW50U3ByaXRlTmFtZT1qfWkudmlzaWJsZT0hMDt2YXIgbD1nLmJvbmU7aS5wb3NpdGlvbi54PWwud29ybGRYK2gueCpsLm0wMCtoLnkqbC5tMDEsaS5wb3NpdGlvbi55PWwud29ybGRZK2gueCpsLm0xMCtoLnkqbC5tMTEsaS5zY2FsZS54PWwud29ybGRTY2FsZVgsaS5zY2FsZS55PWwud29ybGRTY2FsZVksaS5yb3RhdGlvbj0tKGcuYm9uZS53b3JsZFJvdGF0aW9uKk1hdGguUEkvMTgwKSxpLmFscGhhPWcuYSxnLmN1cnJlbnRTcHJpdGUudGludD1iLnJnYjJoZXgoW2cucixnLmcsZy5iXSl9ZWxzZSBpLnZpc2libGU9ITF9Yi5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm0uY2FsbCh0aGlzKX0sYi5TcGluZS5wcm90b3R5cGUuY3JlYXRlU3ByaXRlPWZ1bmN0aW9uKGEsYyl7dmFyIGQ9Yi5UZXh0dXJlQ2FjaGVbYy5uYW1lXT9jLm5hbWU6Yy5uYW1lK1wiLnBuZ1wiLGU9bmV3IGIuU3ByaXRlKGIuVGV4dHVyZS5mcm9tRnJhbWUoZCkpO3JldHVybiBlLnNjYWxlPWMuc2NhbGUsZS5yb3RhdGlvbj1jLnJvdGF0aW9uLGUuYW5jaG9yLng9ZS5hbmNob3IueT0uNSxhLnNwcml0ZXM9YS5zcHJpdGVzfHx7fSxhLnNwcml0ZXNbYy5uYW1lXT1lLGV9LGIuQmFzZVRleHR1cmVDYWNoZT17fSxiLnRleHR1cmVzVG9VcGRhdGU9W10sYi50ZXh0dXJlc1RvRGVzdHJveT1bXSxiLkJhc2VUZXh0dXJlQ2FjaGVJZEdlbmVyYXRvcj0wLGIuQmFzZVRleHR1cmU9ZnVuY3Rpb24oYSxjKXtpZihiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy53aWR0aD0xMDAsdGhpcy5oZWlnaHQ9MTAwLHRoaXMuc2NhbGVNb2RlPWN8fGIuc2NhbGVNb2Rlcy5ERUZBVUxULHRoaXMuaGFzTG9hZGVkPSExLHRoaXMuc291cmNlPWEsdGhpcy5pZD1iLkJhc2VUZXh0dXJlQ2FjaGVJZEdlbmVyYXRvcisrLHRoaXMucHJlbXVsdGlwbGllZEFscGhhPSEwLHRoaXMuX2dsVGV4dHVyZXM9W10sdGhpcy5fZGlydHk9W10sYSl7aWYoKHRoaXMuc291cmNlLmNvbXBsZXRlfHx0aGlzLnNvdXJjZS5nZXRDb250ZXh0KSYmdGhpcy5zb3VyY2Uud2lkdGgmJnRoaXMuc291cmNlLmhlaWdodCl0aGlzLmhhc0xvYWRlZD0hMCx0aGlzLndpZHRoPXRoaXMuc291cmNlLndpZHRoLHRoaXMuaGVpZ2h0PXRoaXMuc291cmNlLmhlaWdodCxiLnRleHR1cmVzVG9VcGRhdGUucHVzaCh0aGlzKTtlbHNle3ZhciBkPXRoaXM7dGhpcy5zb3VyY2Uub25sb2FkPWZ1bmN0aW9uKCl7ZC5oYXNMb2FkZWQ9ITAsZC53aWR0aD1kLnNvdXJjZS53aWR0aCxkLmhlaWdodD1kLnNvdXJjZS5oZWlnaHQ7Zm9yKHZhciBhPTA7YTxkLl9nbFRleHR1cmVzLmxlbmd0aDthKyspZC5fZGlydHlbYV09ITA7ZC5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDpkfSl9LHRoaXMuc291cmNlLm9uZXJyb3I9ZnVuY3Rpb24oKXtkLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJlcnJvclwiLGNvbnRlbnQ6ZH0pfX10aGlzLmltYWdlVXJsPW51bGwsdGhpcy5fcG93ZXJPZjI9ITF9fSxiLkJhc2VUZXh0dXJlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkJhc2VUZXh0dXJlLGIuQmFzZVRleHR1cmUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmltYWdlVXJsPyhkZWxldGUgYi5CYXNlVGV4dHVyZUNhY2hlW3RoaXMuaW1hZ2VVcmxdLGRlbGV0ZSBiLlRleHR1cmVDYWNoZVt0aGlzLmltYWdlVXJsXSx0aGlzLmltYWdlVXJsPW51bGwsdGhpcy5zb3VyY2Uuc3JjPW51bGwpOnRoaXMuc291cmNlJiZ0aGlzLnNvdXJjZS5fcGl4aUlkJiZkZWxldGUgYi5CYXNlVGV4dHVyZUNhY2hlW3RoaXMuc291cmNlLl9waXhpSWRdLHRoaXMuc291cmNlPW51bGwsYi50ZXh0dXJlc1RvRGVzdHJveS5wdXNoKHRoaXMpfSxiLkJhc2VUZXh0dXJlLnByb3RvdHlwZS51cGRhdGVTb3VyY2VJbWFnZT1mdW5jdGlvbihhKXt0aGlzLmhhc0xvYWRlZD0hMSx0aGlzLnNvdXJjZS5zcmM9bnVsbCx0aGlzLnNvdXJjZS5zcmM9YX0sYi5CYXNlVGV4dHVyZS5mcm9tSW1hZ2U9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWIuQmFzZVRleHR1cmVDYWNoZVthXTtpZih2b2lkIDA9PT1jJiYtMT09PWEuaW5kZXhPZihcImRhdGE6XCIpJiYoYz0hMCksIWUpe3ZhciBmPW5ldyBJbWFnZTtjJiYoZi5jcm9zc09yaWdpbj1cIlwiKSxmLnNyYz1hLGU9bmV3IGIuQmFzZVRleHR1cmUoZixkKSxlLmltYWdlVXJsPWEsYi5CYXNlVGV4dHVyZUNhY2hlW2FdPWV9cmV0dXJuIGV9LGIuQmFzZVRleHR1cmUuZnJvbUNhbnZhcz1mdW5jdGlvbihhLGMpe2EuX3BpeGlJZHx8KGEuX3BpeGlJZD1cImNhbnZhc19cIitiLlRleHR1cmVDYWNoZUlkR2VuZXJhdG9yKyspO3ZhciBkPWIuQmFzZVRleHR1cmVDYWNoZVthLl9waXhpSWRdO3JldHVybiBkfHwoZD1uZXcgYi5CYXNlVGV4dHVyZShhLGMpLGIuQmFzZVRleHR1cmVDYWNoZVthLl9waXhpSWRdPWQpLGR9LGIuVGV4dHVyZUNhY2hlPXt9LGIuRnJhbWVDYWNoZT17fSxiLlRleHR1cmVDYWNoZUlkR2VuZXJhdG9yPTAsYi5UZXh0dXJlPWZ1bmN0aW9uKGEsYyl7aWYoYi5FdmVudFRhcmdldC5jYWxsKHRoaXMpLHRoaXMubm9GcmFtZT0hMSxjfHwodGhpcy5ub0ZyYW1lPSEwLGM9bmV3IGIuUmVjdGFuZ2xlKDAsMCwxLDEpKSxhIGluc3RhbmNlb2YgYi5UZXh0dXJlJiYoYT1hLmJhc2VUZXh0dXJlKSx0aGlzLmJhc2VUZXh0dXJlPWEsdGhpcy5mcmFtZT1jLHRoaXMudHJpbT1udWxsLHRoaXMudmFsaWQ9ITEsdGhpcy5zY29wZT10aGlzLHRoaXMuX3V2cz1udWxsLHRoaXMud2lkdGg9MCx0aGlzLmhlaWdodD0wLHRoaXMuY3JvcD1uZXcgYi5SZWN0YW5nbGUoMCwwLDEsMSksYS5oYXNMb2FkZWQpdGhpcy5ub0ZyYW1lJiYoYz1uZXcgYi5SZWN0YW5nbGUoMCwwLGEud2lkdGgsYS5oZWlnaHQpKSx0aGlzLnNldEZyYW1lKGMpO2Vsc2V7dmFyIGQ9dGhpczthLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbigpe2Qub25CYXNlVGV4dHVyZUxvYWRlZCgpfSl9fSxiLlRleHR1cmUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuVGV4dHVyZSxiLlRleHR1cmUucHJvdG90eXBlLm9uQmFzZVRleHR1cmVMb2FkZWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmJhc2VUZXh0dXJlO2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLHRoaXMub25Mb2FkZWQpLHRoaXMubm9GcmFtZSYmKHRoaXMuZnJhbWU9bmV3IGIuUmVjdGFuZ2xlKDAsMCxhLndpZHRoLGEuaGVpZ2h0KSksdGhpcy5zZXRGcmFtZSh0aGlzLmZyYW1lKSx0aGlzLnNjb3BlLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJ1cGRhdGVcIixjb250ZW50OnRoaXN9KX0sYi5UZXh0dXJlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKGEpe2EmJnRoaXMuYmFzZVRleHR1cmUuZGVzdHJveSgpLHRoaXMudmFsaWQ9ITF9LGIuVGV4dHVyZS5wcm90b3R5cGUuc2V0RnJhbWU9ZnVuY3Rpb24oYSl7aWYodGhpcy5ub0ZyYW1lPSExLHRoaXMuZnJhbWU9YSx0aGlzLndpZHRoPWEud2lkdGgsdGhpcy5oZWlnaHQ9YS5oZWlnaHQsdGhpcy5jcm9wLng9YS54LHRoaXMuY3JvcC55PWEueSx0aGlzLmNyb3Aud2lkdGg9YS53aWR0aCx0aGlzLmNyb3AuaGVpZ2h0PWEuaGVpZ2h0LCF0aGlzLnRyaW0mJihhLngrYS53aWR0aD50aGlzLmJhc2VUZXh0dXJlLndpZHRofHxhLnkrYS5oZWlnaHQ+dGhpcy5iYXNlVGV4dHVyZS5oZWlnaHQpKXRocm93IG5ldyBFcnJvcihcIlRleHR1cmUgRXJyb3I6IGZyYW1lIGRvZXMgbm90IGZpdCBpbnNpZGUgdGhlIGJhc2UgVGV4dHVyZSBkaW1lbnNpb25zIFwiK3RoaXMpO3RoaXMudmFsaWQ9YSYmYS53aWR0aCYmYS5oZWlnaHQmJnRoaXMuYmFzZVRleHR1cmUuc291cmNlJiZ0aGlzLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCx0aGlzLnRyaW0mJih0aGlzLndpZHRoPXRoaXMudHJpbS53aWR0aCx0aGlzLmhlaWdodD10aGlzLnRyaW0uaGVpZ2h0LHRoaXMuZnJhbWUud2lkdGg9dGhpcy50cmltLndpZHRoLHRoaXMuZnJhbWUuaGVpZ2h0PXRoaXMudHJpbS5oZWlnaHQpLHRoaXMudmFsaWQmJmIuVGV4dHVyZS5mcmFtZVVwZGF0ZXMucHVzaCh0aGlzKX0sYi5UZXh0dXJlLnByb3RvdHlwZS5fdXBkYXRlV2ViR0x1dnM9ZnVuY3Rpb24oKXt0aGlzLl91dnN8fCh0aGlzLl91dnM9bmV3IGIuVGV4dHVyZVV2cyk7dmFyIGE9dGhpcy5jcm9wLGM9dGhpcy5iYXNlVGV4dHVyZS53aWR0aCxkPXRoaXMuYmFzZVRleHR1cmUuaGVpZ2h0O3RoaXMuX3V2cy54MD1hLngvYyx0aGlzLl91dnMueTA9YS55L2QsdGhpcy5fdXZzLngxPShhLngrYS53aWR0aCkvYyx0aGlzLl91dnMueTE9YS55L2QsdGhpcy5fdXZzLngyPShhLngrYS53aWR0aCkvYyx0aGlzLl91dnMueTI9KGEueSthLmhlaWdodCkvZCx0aGlzLl91dnMueDM9YS54L2MsdGhpcy5fdXZzLnkzPShhLnkrYS5oZWlnaHQpL2R9LGIuVGV4dHVyZS5mcm9tSW1hZ2U9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWIuVGV4dHVyZUNhY2hlW2FdO3JldHVybiBlfHwoZT1uZXcgYi5UZXh0dXJlKGIuQmFzZVRleHR1cmUuZnJvbUltYWdlKGEsYyxkKSksYi5UZXh0dXJlQ2FjaGVbYV09ZSksZX0sYi5UZXh0dXJlLmZyb21GcmFtZT1mdW5jdGlvbihhKXt2YXIgYz1iLlRleHR1cmVDYWNoZVthXTtpZighYyl0aHJvdyBuZXcgRXJyb3IoJ1RoZSBmcmFtZUlkIFwiJythKydcIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgdGV4dHVyZSBjYWNoZSAnKTtyZXR1cm4gY30sYi5UZXh0dXJlLmZyb21DYW52YXM9ZnVuY3Rpb24oYSxjKXt2YXIgZD1iLkJhc2VUZXh0dXJlLmZyb21DYW52YXMoYSxjKTtyZXR1cm4gbmV3IGIuVGV4dHVyZShkKX0sYi5UZXh0dXJlLmFkZFRleHR1cmVUb0NhY2hlPWZ1bmN0aW9uKGEsYyl7Yi5UZXh0dXJlQ2FjaGVbY109YX0sYi5UZXh0dXJlLnJlbW92ZVRleHR1cmVGcm9tQ2FjaGU9ZnVuY3Rpb24oYSl7dmFyIGM9Yi5UZXh0dXJlQ2FjaGVbYV07cmV0dXJuIGRlbGV0ZSBiLlRleHR1cmVDYWNoZVthXSxkZWxldGUgYi5CYXNlVGV4dHVyZUNhY2hlW2FdLGN9LGIuVGV4dHVyZS5mcmFtZVVwZGF0ZXM9W10sYi5UZXh0dXJlVXZzPWZ1bmN0aW9uKCl7dGhpcy54MD0wLHRoaXMueTA9MCx0aGlzLngxPTAsdGhpcy55MT0wLHRoaXMueDI9MCx0aGlzLnkyPTAsdGhpcy54Mz0wLHRoaXMueTM9MH0sYi5SZW5kZXJUZXh0dXJlPWZ1bmN0aW9uKGEsYyxkLGUpe2lmKGIuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLndpZHRoPWF8fDEwMCx0aGlzLmhlaWdodD1jfHwxMDAsdGhpcy5mcmFtZT1uZXcgYi5SZWN0YW5nbGUoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLHRoaXMuY3JvcD1uZXcgYi5SZWN0YW5nbGUoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLHRoaXMuYmFzZVRleHR1cmU9bmV3IGIuQmFzZVRleHR1cmUsdGhpcy5iYXNlVGV4dHVyZS53aWR0aD10aGlzLndpZHRoLHRoaXMuYmFzZVRleHR1cmUuaGVpZ2h0PXRoaXMuaGVpZ2h0LHRoaXMuYmFzZVRleHR1cmUuX2dsVGV4dHVyZXM9W10sdGhpcy5iYXNlVGV4dHVyZS5zY2FsZU1vZGU9ZXx8Yi5zY2FsZU1vZGVzLkRFRkFVTFQsdGhpcy5iYXNlVGV4dHVyZS5oYXNMb2FkZWQ9ITAsdGhpcy5yZW5kZXJlcj1kfHxiLmRlZmF1bHRSZW5kZXJlcix0aGlzLnJlbmRlcmVyLnR5cGU9PT1iLldFQkdMX1JFTkRFUkVSKXt2YXIgZj10aGlzLnJlbmRlcmVyLmdsO3RoaXMudGV4dHVyZUJ1ZmZlcj1uZXcgYi5GaWx0ZXJUZXh0dXJlKGYsdGhpcy53aWR0aCx0aGlzLmhlaWdodCx0aGlzLmJhc2VUZXh0dXJlLnNjYWxlTW9kZSksdGhpcy5iYXNlVGV4dHVyZS5fZ2xUZXh0dXJlc1tmLmlkXT10aGlzLnRleHR1cmVCdWZmZXIudGV4dHVyZSx0aGlzLnJlbmRlcj10aGlzLnJlbmRlcldlYkdMLHRoaXMucHJvamVjdGlvbj1uZXcgYi5Qb2ludCh0aGlzLndpZHRoLzIsLXRoaXMuaGVpZ2h0LzIpfWVsc2UgdGhpcy5yZW5kZXI9dGhpcy5yZW5kZXJDYW52YXMsdGhpcy50ZXh0dXJlQnVmZmVyPW5ldyBiLkNhbnZhc0J1ZmZlcih0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSx0aGlzLmJhc2VUZXh0dXJlLnNvdXJjZT10aGlzLnRleHR1cmVCdWZmZXIuY2FudmFzO3RoaXMudmFsaWQ9ITAsYi5UZXh0dXJlLmZyYW1lVXBkYXRlcy5wdXNoKHRoaXMpfSxiLlJlbmRlclRleHR1cmUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5UZXh0dXJlLnByb3RvdHlwZSksYi5SZW5kZXJUZXh0dXJlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlJlbmRlclRleHR1cmUsYi5SZW5kZXJUZXh0dXJlLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oYSxjLGQpeyhhIT09dGhpcy53aWR0aHx8YyE9PXRoaXMuaGVpZ2h0KSYmKHRoaXMud2lkdGg9dGhpcy5mcmFtZS53aWR0aD10aGlzLmNyb3Aud2lkdGg9YSx0aGlzLmhlaWdodD10aGlzLmZyYW1lLmhlaWdodD10aGlzLmNyb3AuaGVpZ2h0PWMsZCYmKHRoaXMuYmFzZVRleHR1cmUud2lkdGg9dGhpcy53aWR0aCx0aGlzLmJhc2VUZXh0dXJlLmhlaWdodD10aGlzLmhlaWdodCksdGhpcy5yZW5kZXJlci50eXBlPT09Yi5XRUJHTF9SRU5ERVJFUiYmKHRoaXMucHJvamVjdGlvbi54PXRoaXMud2lkdGgvMix0aGlzLnByb2plY3Rpb24ueT0tdGhpcy5oZWlnaHQvMiksdGhpcy50ZXh0dXJlQnVmZmVyLnJlc2l6ZSh0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KSl9LGIuUmVuZGVyVGV4dHVyZS5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLnJlbmRlcmVyLnR5cGU9PT1iLldFQkdMX1JFTkRFUkVSJiZ0aGlzLnJlbmRlcmVyLmdsLmJpbmRGcmFtZWJ1ZmZlcih0aGlzLnJlbmRlcmVyLmdsLkZSQU1FQlVGRkVSLHRoaXMudGV4dHVyZUJ1ZmZlci5mcmFtZUJ1ZmZlciksdGhpcy50ZXh0dXJlQnVmZmVyLmNsZWFyKCl9LGIuUmVuZGVyVGV4dHVyZS5wcm90b3R5cGUucmVuZGVyV2ViR0w9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPXRoaXMucmVuZGVyZXIuZ2w7ZS5jb2xvck1hc2soITAsITAsITAsITApLGUudmlld3BvcnQoMCwwLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpLGUuYmluZEZyYW1lYnVmZmVyKGUuRlJBTUVCVUZGRVIsdGhpcy50ZXh0dXJlQnVmZmVyLmZyYW1lQnVmZmVyKSxkJiZ0aGlzLnRleHR1cmVCdWZmZXIuY2xlYXIoKTt2YXIgZj1hLmNoaWxkcmVuLGc9YS53b3JsZFRyYW5zZm9ybTthLndvcmxkVHJhbnNmb3JtPWIuUmVuZGVyVGV4dHVyZS50ZW1wTWF0cml4LGEud29ybGRUcmFuc2Zvcm0uZD0tMSxhLndvcmxkVHJhbnNmb3JtLnR5PS0yKnRoaXMucHJvamVjdGlvbi55LGMmJihhLndvcmxkVHJhbnNmb3JtLnR4PWMueCxhLndvcmxkVHJhbnNmb3JtLnR5LT1jLnkpO2Zvcih2YXIgaD0wLGk9Zi5sZW5ndGg7aT5oO2grKylmW2hdLnVwZGF0ZVRyYW5zZm9ybSgpO2IuV2ViR0xSZW5kZXJlci51cGRhdGVUZXh0dXJlcygpLHRoaXMucmVuZGVyZXIuc3ByaXRlQmF0Y2guZGlydHk9ITAsdGhpcy5yZW5kZXJlci5yZW5kZXJEaXNwbGF5T2JqZWN0KGEsdGhpcy5wcm9qZWN0aW9uLHRoaXMudGV4dHVyZUJ1ZmZlci5mcmFtZUJ1ZmZlciksYS53b3JsZFRyYW5zZm9ybT1nLHRoaXMucmVuZGVyZXIuc3ByaXRlQmF0Y2guZGlydHk9ITB9LGIuUmVuZGVyVGV4dHVyZS5wcm90b3R5cGUucmVuZGVyQ2FudmFzPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT1hLmNoaWxkcmVuLGY9YS53b3JsZFRyYW5zZm9ybTthLndvcmxkVHJhbnNmb3JtPWIuUmVuZGVyVGV4dHVyZS50ZW1wTWF0cml4LGM/KGEud29ybGRUcmFuc2Zvcm0udHg9Yy54LGEud29ybGRUcmFuc2Zvcm0udHk9Yy55KTooYS53b3JsZFRyYW5zZm9ybS50eD0wLGEud29ybGRUcmFuc2Zvcm0udHk9MCk7Zm9yKHZhciBnPTAsaD1lLmxlbmd0aDtoPmc7ZysrKWVbZ10udXBkYXRlVHJhbnNmb3JtKCk7ZCYmdGhpcy50ZXh0dXJlQnVmZmVyLmNsZWFyKCk7dmFyIGk9dGhpcy50ZXh0dXJlQnVmZmVyLmNvbnRleHQ7dGhpcy5yZW5kZXJlci5yZW5kZXJEaXNwbGF5T2JqZWN0KGEsaSksaS5zZXRUcmFuc2Zvcm0oMSwwLDAsMSwwLDApLGEud29ybGRUcmFuc2Zvcm09Zn0sYi5SZW5kZXJUZXh0dXJlLnRlbXBNYXRyaXg9bmV3IGIuTWF0cml4LGIuQXNzZXRMb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy5hc3NldFVSTHM9YSx0aGlzLmNyb3Nzb3JpZ2luPWMsdGhpcy5sb2FkZXJzQnlUeXBlPXtqcGc6Yi5JbWFnZUxvYWRlcixqcGVnOmIuSW1hZ2VMb2FkZXIscG5nOmIuSW1hZ2VMb2FkZXIsZ2lmOmIuSW1hZ2VMb2FkZXIsd2VicDpiLkltYWdlTG9hZGVyLGpzb246Yi5Kc29uTG9hZGVyLGF0bGFzOmIuQXRsYXNMb2FkZXIsYW5pbTpiLlNwaW5lTG9hZGVyLHhtbDpiLkJpdG1hcEZvbnRMb2FkZXIsZm50OmIuQml0bWFwRm9udExvYWRlcn19LGIuQXNzZXRMb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuQXNzZXRMb2FkZXIsYi5Bc3NldExvYWRlci5wcm90b3R5cGUuX2dldERhdGFUeXBlPWZ1bmN0aW9uKGEpe3ZhciBiPVwiZGF0YTpcIixjPWEuc2xpY2UoMCxiLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtpZihjPT09Yil7dmFyIGQ9YS5zbGljZShiLmxlbmd0aCksZT1kLmluZGV4T2YoXCIsXCIpO2lmKC0xPT09ZSlyZXR1cm4gbnVsbDt2YXIgZj1kLnNsaWNlKDAsZSkuc3BsaXQoXCI7XCIpWzBdO3JldHVybiBmJiZcInRleHQvcGxhaW5cIiE9PWYudG9Mb3dlckNhc2UoKT9mLnNwbGl0KFwiL1wiKS5wb3AoKS50b0xvd2VyQ2FzZSgpOlwidHh0XCJ9cmV0dXJuIG51bGx9LGIuQXNzZXRMb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe2Iub25Bc3NldExvYWRlZChhLmNvbnRlbnQpfXZhciBiPXRoaXM7dGhpcy5sb2FkQ291bnQ9dGhpcy5hc3NldFVSTHMubGVuZ3RoO2Zvcih2YXIgYz0wO2M8dGhpcy5hc3NldFVSTHMubGVuZ3RoO2MrKyl7dmFyIGQ9dGhpcy5hc3NldFVSTHNbY10sZT10aGlzLl9nZXREYXRhVHlwZShkKTtlfHwoZT1kLnNwbGl0KFwiP1wiKS5zaGlmdCgpLnNwbGl0KFwiLlwiKS5wb3AoKS50b0xvd2VyQ2FzZSgpKTt2YXIgZj10aGlzLmxvYWRlcnNCeVR5cGVbZV07aWYoIWYpdGhyb3cgbmV3IEVycm9yKGUrXCIgaXMgYW4gdW5zdXBwb3J0ZWQgZmlsZSB0eXBlXCIpO3ZhciBnPW5ldyBmKGQsdGhpcy5jcm9zc29yaWdpbik7Zy5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsYSksZy5sb2FkKCl9fSxiLkFzc2V0TG9hZGVyLnByb3RvdHlwZS5vbkFzc2V0TG9hZGVkPWZ1bmN0aW9uKGEpe3RoaXMubG9hZENvdW50LS0sdGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwib25Qcm9ncmVzc1wiLGNvbnRlbnQ6dGhpcyxsb2FkZXI6YX0pLHRoaXMub25Qcm9ncmVzcyYmdGhpcy5vblByb2dyZXNzKGEpLHRoaXMubG9hZENvdW50fHwodGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwib25Db21wbGV0ZVwiLGNvbnRlbnQ6dGhpc30pLHRoaXMub25Db21wbGV0ZSYmdGhpcy5vbkNvbXBsZXRlKCkpfSxiLkpzb25Mb2FkZXI9ZnVuY3Rpb24oYSxjKXtiLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyksdGhpcy51cmw9YSx0aGlzLmNyb3Nzb3JpZ2luPWMsdGhpcy5iYXNlVXJsPWEucmVwbGFjZSgvW15cXC9dKiQvLFwiXCIpLHRoaXMubG9hZGVkPSExfSxiLkpzb25Mb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuSnNvbkxvYWRlcixiLkpzb25Mb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO3dpbmRvdy5YRG9tYWluUmVxdWVzdCYmYS5jcm9zc29yaWdpbj8odGhpcy5hamF4UmVxdWVzdD1uZXcgd2luZG93LlhEb21haW5SZXF1ZXN0LHRoaXMuYWpheFJlcXVlc3QudGltZW91dD0zZTMsdGhpcy5hamF4UmVxdWVzdC5vbmVycm9yPWZ1bmN0aW9uKCl7YS5vbkVycm9yKCl9LHRoaXMuYWpheFJlcXVlc3Qub250aW1lb3V0PWZ1bmN0aW9uKCl7YS5vbkVycm9yKCl9LHRoaXMuYWpheFJlcXVlc3Qub25wcm9ncmVzcz1mdW5jdGlvbigpe30pOnRoaXMuYWpheFJlcXVlc3Q9d2luZG93LlhNTEh0dHBSZXF1ZXN0P25ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q6bmV3IHdpbmRvdy5BY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIiksdGhpcy5hamF4UmVxdWVzdC5vbmxvYWQ9ZnVuY3Rpb24oKXthLm9uSlNPTkxvYWRlZCgpfSx0aGlzLmFqYXhSZXF1ZXN0Lm9wZW4oXCJHRVRcIix0aGlzLnVybCwhMCksdGhpcy5hamF4UmVxdWVzdC5zZW5kKCl9LGIuSnNvbkxvYWRlci5wcm90b3R5cGUub25KU09OTG9hZGVkPWZ1bmN0aW9uKCl7aWYoIXRoaXMuYWpheFJlcXVlc3QucmVzcG9uc2VUZXh0KXJldHVybiB0aGlzLm9uRXJyb3IoKSx2b2lkIDA7aWYodGhpcy5qc29uPUpTT04ucGFyc2UodGhpcy5hamF4UmVxdWVzdC5yZXNwb25zZVRleHQpLHRoaXMuanNvbi5mcmFtZXMpe3ZhciBhPXRoaXMsYz10aGlzLmJhc2VVcmwrdGhpcy5qc29uLm1ldGEuaW1hZ2UsZD1uZXcgYi5JbWFnZUxvYWRlcihjLHRoaXMuY3Jvc3NvcmlnaW4pLGU9dGhpcy5qc29uLmZyYW1lczt0aGlzLnRleHR1cmU9ZC50ZXh0dXJlLmJhc2VUZXh0dXJlLGQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLGZ1bmN0aW9uKCl7YS5vbkxvYWRlZCgpfSk7Zm9yKHZhciBnIGluIGUpe3ZhciBoPWVbZ10uZnJhbWU7aWYoaCYmKGIuVGV4dHVyZUNhY2hlW2ddPW5ldyBiLlRleHR1cmUodGhpcy50ZXh0dXJlLHt4OmgueCx5OmgueSx3aWR0aDpoLncsaGVpZ2h0OmguaH0pLGIuVGV4dHVyZUNhY2hlW2ddLmNyb3A9bmV3IGIuUmVjdGFuZ2xlKGgueCxoLnksaC53LGguaCksZVtnXS50cmltbWVkKSl7dmFyIGk9ZVtnXS5zb3VyY2VTaXplLGo9ZVtnXS5zcHJpdGVTb3VyY2VTaXplO2IuVGV4dHVyZUNhY2hlW2ddLnRyaW09bmV3IGIuUmVjdGFuZ2xlKGoueCxqLnksaS53LGkuaCl9fWQubG9hZCgpfWVsc2UgaWYodGhpcy5qc29uLmJvbmVzKXt2YXIgaz1uZXcgZi5Ta2VsZXRvbkpzb24sbD1rLnJlYWRTa2VsZXRvbkRhdGEodGhpcy5qc29uKTtiLkFuaW1DYWNoZVt0aGlzLnVybF09bCx0aGlzLm9uTG9hZGVkKCl9ZWxzZSB0aGlzLm9uTG9hZGVkKCl9LGIuSnNvbkxvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmxvYWRlZD0hMCx0aGlzLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJsb2FkZWRcIixjb250ZW50OnRoaXN9KX0sYi5Kc29uTG9hZGVyLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKCl7dGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwiZXJyb3JcIixjb250ZW50OnRoaXN9KX0sYi5BdGxhc0xvYWRlcj1mdW5jdGlvbihhLGMpe2IuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLnVybD1hLHRoaXMuYmFzZVVybD1hLnJlcGxhY2UoL1teXFwvXSokLyxcIlwiKSx0aGlzLmNyb3Nzb3JpZ2luPWMsdGhpcy5sb2FkZWQ9ITF9LGIuQXRsYXNMb2FkZXIuY29uc3RydWN0b3I9Yi5BdGxhc0xvYWRlcixiLkF0bGFzTG9hZGVyLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7dGhpcy5hamF4UmVxdWVzdD1uZXcgYi5BamF4UmVxdWVzdCx0aGlzLmFqYXhSZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZT10aGlzLm9uQXRsYXNMb2FkZWQuYmluZCh0aGlzKSx0aGlzLmFqYXhSZXF1ZXN0Lm9wZW4oXCJHRVRcIix0aGlzLnVybCwhMCksdGhpcy5hamF4UmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlJiZ0aGlzLmFqYXhSZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIpLHRoaXMuYWpheFJlcXVlc3Quc2VuZChudWxsKX0sYi5BdGxhc0xvYWRlci5wcm90b3R5cGUub25BdGxhc0xvYWRlZD1mdW5jdGlvbigpe2lmKDQ9PT10aGlzLmFqYXhSZXF1ZXN0LnJlYWR5U3RhdGUpaWYoMjAwPT09dGhpcy5hamF4UmVxdWVzdC5zdGF0dXN8fC0xPT09d2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImh0dHBcIikpe3RoaXMuYXRsYXM9e21ldGE6e2ltYWdlOltdfSxmcmFtZXM6W119O3ZhciBhPXRoaXMuYWpheFJlcXVlc3QucmVzcG9uc2VUZXh0LnNwbGl0KC9cXHI/XFxuLyksYz0tMyxkPTAsZT1udWxsLGY9ITEsZz0wLGg9MCxpPXRoaXMub25Mb2FkZWQuYmluZCh0aGlzKTtmb3IoZz0wO2c8YS5sZW5ndGg7ZysrKWlmKGFbZ109YVtnXS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpLFwiXCI9PT1hW2ddJiYoZj1nKzEpLGFbZ10ubGVuZ3RoPjApe2lmKGY9PT1nKXRoaXMuYXRsYXMubWV0YS5pbWFnZS5wdXNoKGFbZ10pLGQ9dGhpcy5hdGxhcy5tZXRhLmltYWdlLmxlbmd0aC0xLHRoaXMuYXRsYXMuZnJhbWVzLnB1c2goe30pLGM9LTM7ZWxzZSBpZihjPjApaWYoYyU3PT09MSludWxsIT1lJiYodGhpcy5hdGxhcy5mcmFtZXNbZF1bZS5uYW1lXT1lKSxlPXtuYW1lOmFbZ10sZnJhbWU6e319O2Vsc2V7dmFyIGo9YVtnXS5zcGxpdChcIiBcIik7aWYoYyU3PT09MyllLmZyYW1lLng9TnVtYmVyKGpbMV0ucmVwbGFjZShcIixcIixcIlwiKSksZS5mcmFtZS55PU51bWJlcihqWzJdKTtlbHNlIGlmKGMlNz09PTQpZS5mcmFtZS53PU51bWJlcihqWzFdLnJlcGxhY2UoXCIsXCIsXCJcIikpLGUuZnJhbWUuaD1OdW1iZXIoalsyXSk7ZWxzZSBpZihjJTc9PT01KXt2YXIgaz17eDowLHk6MCx3Ok51bWJlcihqWzFdLnJlcGxhY2UoXCIsXCIsXCJcIikpLGg6TnVtYmVyKGpbMl0pfTtrLnc+ZS5mcmFtZS53fHxrLmg+ZS5mcmFtZS5oPyhlLnRyaW1tZWQ9ITAsZS5yZWFsU2l6ZT1rKTplLnRyaW1tZWQ9ITF9fWMrK31pZihudWxsIT1lJiYodGhpcy5hdGxhcy5mcmFtZXNbZF1bZS5uYW1lXT1lKSx0aGlzLmF0bGFzLm1ldGEuaW1hZ2UubGVuZ3RoPjApe2Zvcih0aGlzLmltYWdlcz1bXSxoPTA7aDx0aGlzLmF0bGFzLm1ldGEuaW1hZ2UubGVuZ3RoO2grKyl7dmFyIGw9dGhpcy5iYXNlVXJsK3RoaXMuYXRsYXMubWV0YS5pbWFnZVtoXSxtPXRoaXMuYXRsYXMuZnJhbWVzW2hdO3RoaXMuaW1hZ2VzLnB1c2gobmV3IGIuSW1hZ2VMb2FkZXIobCx0aGlzLmNyb3Nzb3JpZ2luKSk7Zm9yKGcgaW4gbSl7dmFyIG49bVtnXS5mcmFtZTtuJiYoYi5UZXh0dXJlQ2FjaGVbZ109bmV3IGIuVGV4dHVyZSh0aGlzLmltYWdlc1toXS50ZXh0dXJlLmJhc2VUZXh0dXJlLHt4Om4ueCx5Om4ueSx3aWR0aDpuLncsaGVpZ2h0Om4uaH0pLG1bZ10udHJpbW1lZCYmKGIuVGV4dHVyZUNhY2hlW2ddLnJlYWxTaXplPW1bZ10ucmVhbFNpemUsYi5UZXh0dXJlQ2FjaGVbZ10udHJpbS54PTAsYi5UZXh0dXJlQ2FjaGVbZ10udHJpbS55PTApKX19Zm9yKHRoaXMuY3VycmVudEltYWdlSWQ9MCxoPTA7aDx0aGlzLmltYWdlcy5sZW5ndGg7aCsrKXRoaXMuaW1hZ2VzW2hdLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixpKTt0aGlzLmltYWdlc1t0aGlzLmN1cnJlbnRJbWFnZUlkXS5sb2FkKCl9ZWxzZSB0aGlzLm9uTG9hZGVkKCl9ZWxzZSB0aGlzLm9uRXJyb3IoKX0sYi5BdGxhc0xvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmltYWdlcy5sZW5ndGgtMT50aGlzLmN1cnJlbnRJbWFnZUlkPyh0aGlzLmN1cnJlbnRJbWFnZUlkKyssdGhpcy5pbWFnZXNbdGhpcy5jdXJyZW50SW1hZ2VJZF0ubG9hZCgpKToodGhpcy5sb2FkZWQ9ITAsdGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwibG9hZGVkXCIsY29udGVudDp0aGlzfSkpfSxiLkF0bGFzTG9hZGVyLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKCl7dGhpcy5kaXNwYXRjaEV2ZW50KHt0eXBlOlwiZXJyb3JcIixjb250ZW50OnRoaXN9KX0sYi5TcHJpdGVTaGVldExvYWRlcj1mdW5jdGlvbihhLGMpe2IuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLnVybD1hLHRoaXMuY3Jvc3NvcmlnaW49Yyx0aGlzLmJhc2VVcmw9YS5yZXBsYWNlKC9bXlxcL10qJC8sXCJcIiksdGhpcy50ZXh0dXJlPW51bGwsdGhpcy5mcmFtZXM9e319LGIuU3ByaXRlU2hlZXRMb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuU3ByaXRlU2hlZXRMb2FkZXIsYi5TcHJpdGVTaGVldExvYWRlci5wcm90b3R5cGUubG9hZD1mdW5jdGlvbigpe3ZhciBhPXRoaXMsYz1uZXcgYi5Kc29uTG9hZGVyKHRoaXMudXJsLHRoaXMuY3Jvc3NvcmlnaW4pO2MuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLGZ1bmN0aW9uKGIpe2EuanNvbj1iLmNvbnRlbnQuanNvbixhLm9uTG9hZGVkKCl9KSxjLmxvYWQoKX0sYi5TcHJpdGVTaGVldExvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJsb2FkZWRcIixjb250ZW50OnRoaXN9KX0sYi5JbWFnZUxvYWRlcj1mdW5jdGlvbihhLGMpe2IuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLnRleHR1cmU9Yi5UZXh0dXJlLmZyb21JbWFnZShhLGMpLHRoaXMuZnJhbWVzPVtdfSxiLkltYWdlTG9hZGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkltYWdlTG9hZGVyLGIuSW1hZ2VMb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXtpZih0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuaGFzTG9hZGVkKXRoaXMub25Mb2FkZWQoKTtlbHNle3ZhciBhPXRoaXM7dGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbigpe2Eub25Mb2FkZWQoKX0pfX0sYi5JbWFnZUxvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJsb2FkZWRcIixjb250ZW50OnRoaXN9KX0sYi5JbWFnZUxvYWRlci5wcm90b3R5cGUubG9hZEZyYW1lZFNwcml0ZVNoZWV0PWZ1bmN0aW9uKGEsYyxkKXt0aGlzLmZyYW1lcz1bXTtmb3IodmFyIGU9TWF0aC5mbG9vcih0aGlzLnRleHR1cmUud2lkdGgvYSksZj1NYXRoLmZsb29yKHRoaXMudGV4dHVyZS5oZWlnaHQvYyksZz0wLGg9MDtmPmg7aCsrKWZvcih2YXIgaT0wO2U+aTtpKyssZysrKXt2YXIgaj1uZXcgYi5UZXh0dXJlKHRoaXMudGV4dHVyZSx7eDppKmEseTpoKmMsd2lkdGg6YSxoZWlnaHQ6Y30pO3RoaXMuZnJhbWVzLnB1c2goaiksZCYmKGIuVGV4dHVyZUNhY2hlW2QrXCItXCIrZ109ail9aWYodGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCl0aGlzLm9uTG9hZGVkKCk7ZWxzZXt2YXIgaz10aGlzO3RoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkXCIsZnVuY3Rpb24oKXtrLm9uTG9hZGVkKCl9KX19LGIuQml0bWFwRm9udExvYWRlcj1mdW5jdGlvbihhLGMpe2IuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKSx0aGlzLnVybD1hLHRoaXMuY3Jvc3NvcmlnaW49Yyx0aGlzLmJhc2VVcmw9YS5yZXBsYWNlKC9bXlxcL10qJC8sXCJcIiksdGhpcy50ZXh0dXJlPW51bGx9LGIuQml0bWFwRm9udExvYWRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5CaXRtYXBGb250TG9hZGVyLGIuQml0bWFwRm9udExvYWRlci5wcm90b3R5cGUubG9hZD1mdW5jdGlvbigpe3RoaXMuYWpheFJlcXVlc3Q9bmV3IGIuQWpheFJlcXVlc3Q7dmFyIGE9dGhpczt0aGlzLmFqYXhSZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2Eub25YTUxMb2FkZWQoKX0sdGhpcy5hamF4UmVxdWVzdC5vcGVuKFwiR0VUXCIsdGhpcy51cmwsITApLHRoaXMuYWpheFJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZSYmdGhpcy5hamF4UmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24veG1sXCIpLHRoaXMuYWpheFJlcXVlc3Quc2VuZChudWxsKX0sYi5CaXRtYXBGb250TG9hZGVyLnByb3RvdHlwZS5vblhNTExvYWRlZD1mdW5jdGlvbigpe2lmKDQ9PT10aGlzLmFqYXhSZXF1ZXN0LnJlYWR5U3RhdGUmJigyMDA9PT10aGlzLmFqYXhSZXF1ZXN0LnN0YXR1c3x8LTE9PT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZihcImh0dHBcIikpKXt2YXIgYT10aGlzLmFqYXhSZXF1ZXN0LnJlc3BvbnNlWE1MO2lmKCFhfHwvTVNJRSA5L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KXx8bmF2aWdhdG9yLmlzQ29jb29uSlMpaWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygd2luZG93LkRPTVBhcnNlcil7dmFyIGM9bmV3IERPTVBhcnNlcjthPWMucGFyc2VGcm9tU3RyaW5nKHRoaXMuYWpheFJlcXVlc3QucmVzcG9uc2VUZXh0LFwidGV4dC94bWxcIil9ZWxzZXt2YXIgZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuaW5uZXJIVE1MPXRoaXMuYWpheFJlcXVlc3QucmVzcG9uc2VUZXh0LGE9ZH12YXIgZT10aGlzLmJhc2VVcmwrYS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhZ2VcIilbMF0uZ2V0QXR0cmlidXRlKFwiZmlsZVwiKSxmPW5ldyBiLkltYWdlTG9hZGVyKGUsdGhpcy5jcm9zc29yaWdpbik7dGhpcy50ZXh0dXJlPWYudGV4dHVyZS5iYXNlVGV4dHVyZTt2YXIgZz17fSxoPWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbmZvXCIpWzBdLGk9YS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNvbW1vblwiKVswXTtnLmZvbnQ9aC5nZXRBdHRyaWJ1dGUoXCJmYWNlXCIpLGcuc2l6ZT1wYXJzZUludChoLmdldEF0dHJpYnV0ZShcInNpemVcIiksMTApLGcubGluZUhlaWdodD1wYXJzZUludChpLmdldEF0dHJpYnV0ZShcImxpbmVIZWlnaHRcIiksMTApLGcuY2hhcnM9e307Zm9yKHZhciBqPWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjaGFyXCIpLGs9MDtrPGoubGVuZ3RoO2srKyl7dmFyIGw9cGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwxMCksbT1uZXcgYi5SZWN0YW5nbGUocGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJ4XCIpLDEwKSxwYXJzZUludChqW2tdLmdldEF0dHJpYnV0ZShcInlcIiksMTApLHBhcnNlSW50KGpba10uZ2V0QXR0cmlidXRlKFwid2lkdGhcIiksMTApLHBhcnNlSW50KGpba10uZ2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIpLDEwKSk7Zy5jaGFyc1tsXT17eE9mZnNldDpwYXJzZUludChqW2tdLmdldEF0dHJpYnV0ZShcInhvZmZzZXRcIiksMTApLHlPZmZzZXQ6cGFyc2VJbnQoaltrXS5nZXRBdHRyaWJ1dGUoXCJ5b2Zmc2V0XCIpLDEwKSx4QWR2YW5jZTpwYXJzZUludChqW2tdLmdldEF0dHJpYnV0ZShcInhhZHZhbmNlXCIpLDEwKSxrZXJuaW5nOnt9LHRleHR1cmU6Yi5UZXh0dXJlQ2FjaGVbbF09bmV3IGIuVGV4dHVyZSh0aGlzLnRleHR1cmUsbSl9fXZhciBuPWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJrZXJuaW5nXCIpO2ZvcihrPTA7azxuLmxlbmd0aDtrKyspe3ZhciBvPXBhcnNlSW50KG5ba10uZ2V0QXR0cmlidXRlKFwiZmlyc3RcIiksMTApLHA9cGFyc2VJbnQobltrXS5nZXRBdHRyaWJ1dGUoXCJzZWNvbmRcIiksMTApLHE9cGFyc2VJbnQobltrXS5nZXRBdHRyaWJ1dGUoXCJhbW91bnRcIiksMTApO2cuY2hhcnNbcF0ua2VybmluZ1tvXT1xfWIuQml0bWFwVGV4dC5mb250c1tnLmZvbnRdPWc7dmFyIHI9dGhpcztmLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRcIixmdW5jdGlvbigpe3Iub25Mb2FkZWQoKX0pLGYubG9hZCgpfX0sYi5CaXRtYXBGb250TG9hZGVyLnByb3RvdHlwZS5vbkxvYWRlZD1mdW5jdGlvbigpe3RoaXMuZGlzcGF0Y2hFdmVudCh7dHlwZTpcImxvYWRlZFwiLGNvbnRlbnQ6dGhpc30pfSxiLlNwaW5lTG9hZGVyPWZ1bmN0aW9uKGEsYyl7Yi5FdmVudFRhcmdldC5jYWxsKHRoaXMpLHRoaXMudXJsPWEsdGhpcy5jcm9zc29yaWdpbj1jLHRoaXMubG9hZGVkPSExfSxiLlNwaW5lTG9hZGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlNwaW5lTG9hZGVyLGIuU3BpbmVMb2FkZXIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLGM9bmV3IGIuSnNvbkxvYWRlcih0aGlzLnVybCx0aGlzLmNyb3Nzb3JpZ2luKTtcbmMuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZFwiLGZ1bmN0aW9uKGIpe2EuanNvbj1iLmNvbnRlbnQuanNvbixhLm9uTG9hZGVkKCl9KSxjLmxvYWQoKX0sYi5TcGluZUxvYWRlci5wcm90b3R5cGUub25Mb2FkZWQ9ZnVuY3Rpb24oKXt0aGlzLmxvYWRlZD0hMCx0aGlzLmRpc3BhdGNoRXZlbnQoe3R5cGU6XCJsb2FkZWRcIixjb250ZW50OnRoaXN9KX0sYi5BYnN0cmFjdEZpbHRlcj1mdW5jdGlvbihhLGIpe3RoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnNoYWRlcnM9W10sdGhpcy5kaXJ0eT0hMCx0aGlzLnBhZGRpbmc9MCx0aGlzLnVuaWZvcm1zPWJ8fHt9LHRoaXMuZnJhZ21lbnRTcmM9YXx8W119LGIuQWxwaGFNYXNrRmlsdGVyPWZ1bmN0aW9uKGEpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sYS5iYXNlVGV4dHVyZS5fcG93ZXJPZjI9ITAsdGhpcy51bmlmb3Jtcz17bWFzazp7dHlwZTpcInNhbXBsZXIyRFwiLHZhbHVlOmF9LG1hcERpbWVuc2lvbnM6e3R5cGU6XCIyZlwiLHZhbHVlOnt4OjEseTo1MTEyfX0sZGltZW5zaW9uczp7dHlwZTpcIjRmdlwiLHZhbHVlOlswLDAsMCwwXX19LGEuYmFzZVRleHR1cmUuaGFzTG9hZGVkPyh0aGlzLnVuaWZvcm1zLm1hc2sudmFsdWUueD1hLndpZHRoLHRoaXMudW5pZm9ybXMubWFzay52YWx1ZS55PWEuaGVpZ2h0KToodGhpcy5ib3VuZExvYWRlZEZ1bmN0aW9uPXRoaXMub25UZXh0dXJlTG9hZGVkLmJpbmQodGhpcyksYS5iYXNlVGV4dHVyZS5vbihcImxvYWRlZFwiLHRoaXMuYm91bmRMb2FkZWRGdW5jdGlvbikpLHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCBtYXNrO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ1bmlmb3JtIHZlYzIgb2Zmc2V0O1wiLFwidW5pZm9ybSB2ZWM0IGRpbWVuc2lvbnM7XCIsXCJ1bmlmb3JtIHZlYzIgbWFwRGltZW5zaW9ucztcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMyIG1hcENvcmRzID0gdlRleHR1cmVDb29yZC54eTtcIixcIiAgIG1hcENvcmRzICs9IChkaW1lbnNpb25zLnp3ICsgb2Zmc2V0KS8gZGltZW5zaW9ucy54eSA7XCIsXCIgICBtYXBDb3Jkcy55ICo9IC0xLjA7XCIsXCIgICBtYXBDb3Jkcy55ICs9IDEuMDtcIixcIiAgIG1hcENvcmRzICo9IGRpbWVuc2lvbnMueHkgLyBtYXBEaW1lbnNpb25zO1wiLFwiICAgdmVjNCBvcmlnaW5hbCA9ICB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1wiLFwiICAgZmxvYXQgbWFza0FscGhhID0gIHRleHR1cmUyRChtYXNrLCBtYXBDb3JkcykucjtcIixcIiAgIG9yaWdpbmFsICo9IG1hc2tBbHBoYTtcIixcIiAgIGdsX0ZyYWdDb2xvciA9ICBvcmlnaW5hbDtcIixcIn1cIl19LGIuQWxwaGFNYXNrRmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkFscGhhTWFza0ZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5BbHBoYU1hc2tGaWx0ZXIsYi5BbHBoYU1hc2tGaWx0ZXIucHJvdG90eXBlLm9uVGV4dHVyZUxvYWRlZD1mdW5jdGlvbigpe3RoaXMudW5pZm9ybXMubWFwRGltZW5zaW9ucy52YWx1ZS54PXRoaXMudW5pZm9ybXMubWFzay52YWx1ZS53aWR0aCx0aGlzLnVuaWZvcm1zLm1hcERpbWVuc2lvbnMudmFsdWUueT10aGlzLnVuaWZvcm1zLm1hc2sudmFsdWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMubWFzay52YWx1ZS5iYXNlVGV4dHVyZS5vZmYoXCJsb2FkZWRcIix0aGlzLmJvdW5kTG9hZGVkRnVuY3Rpb24pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5BbHBoYU1hc2tGaWx0ZXIucHJvdG90eXBlLFwibWFwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm1hc2sudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLm1hc2sudmFsdWU9YX19KSxiLkNvbG9yTWF0cml4RmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXttYXRyaXg6e3R5cGU6XCJtYXQ0XCIsdmFsdWU6WzEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDFdfX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gZmxvYXQgaW52ZXJ0O1wiLFwidW5pZm9ybSBtYXQ0IG1hdHJpeDtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKiBtYXRyaXg7XCIsXCJ9XCJdfSxiLkNvbG9yTWF0cml4RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkNvbG9yTWF0cml4RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkNvbG9yTWF0cml4RmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkNvbG9yTWF0cml4RmlsdGVyLnByb3RvdHlwZSxcIm1hdHJpeFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5tYXRyaXgudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLm1hdHJpeC52YWx1ZT1hfX0pLGIuR3JheUZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17Z3JheTp7dHlwZTpcIjFmXCIsdmFsdWU6MX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInVuaWZvcm0gZmxvYXQgZ3JheTtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1wiLFwiICAgZ2xfRnJhZ0NvbG9yLnJnYiA9IG1peChnbF9GcmFnQ29sb3IucmdiLCB2ZWMzKDAuMjEyNipnbF9GcmFnQ29sb3IuciArIDAuNzE1MipnbF9GcmFnQ29sb3IuZyArIDAuMDcyMipnbF9GcmFnQ29sb3IuYiksIGdyYXkpO1wiLFwifVwiXX0sYi5HcmF5RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkdyYXlGaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuR3JheUZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5HcmF5RmlsdGVyLnByb3RvdHlwZSxcImdyYXlcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ3JheS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuZ3JheS52YWx1ZT1hfX0pLGIuRGlzcGxhY2VtZW50RmlsdGVyPWZ1bmN0aW9uKGEpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sYS5iYXNlVGV4dHVyZS5fcG93ZXJPZjI9ITAsdGhpcy51bmlmb3Jtcz17ZGlzcGxhY2VtZW50TWFwOnt0eXBlOlwic2FtcGxlcjJEXCIsdmFsdWU6YX0sc2NhbGU6e3R5cGU6XCIyZlwiLHZhbHVlOnt4OjMwLHk6MzB9fSxvZmZzZXQ6e3R5cGU6XCIyZlwiLHZhbHVlOnt4OjAseTowfX0sbWFwRGltZW5zaW9uczp7dHlwZTpcIjJmXCIsdmFsdWU6e3g6MSx5OjUxMTJ9fSxkaW1lbnNpb25zOnt0eXBlOlwiNGZ2XCIsdmFsdWU6WzAsMCwwLDBdfX0sYS5iYXNlVGV4dHVyZS5oYXNMb2FkZWQ/KHRoaXMudW5pZm9ybXMubWFwRGltZW5zaW9ucy52YWx1ZS54PWEud2lkdGgsdGhpcy51bmlmb3Jtcy5tYXBEaW1lbnNpb25zLnZhbHVlLnk9YS5oZWlnaHQpOih0aGlzLmJvdW5kTG9hZGVkRnVuY3Rpb249dGhpcy5vblRleHR1cmVMb2FkZWQuYmluZCh0aGlzKSxhLmJhc2VUZXh0dXJlLm9uKFwibG9hZGVkXCIsdGhpcy5ib3VuZExvYWRlZEZ1bmN0aW9uKSksdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gc2FtcGxlcjJEIGRpc3BsYWNlbWVudE1hcDtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidW5pZm9ybSB2ZWMyIHNjYWxlO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldDtcIixcInVuaWZvcm0gdmVjNCBkaW1lbnNpb25zO1wiLFwidW5pZm9ybSB2ZWMyIG1hcERpbWVuc2lvbnM7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgdmVjMiBtYXBDb3JkcyA9IHZUZXh0dXJlQ29vcmQueHk7XCIsXCIgICBtYXBDb3JkcyArPSAoZGltZW5zaW9ucy56dyArIG9mZnNldCkvIGRpbWVuc2lvbnMueHkgO1wiLFwiICAgbWFwQ29yZHMueSAqPSAtMS4wO1wiLFwiICAgbWFwQ29yZHMueSArPSAxLjA7XCIsXCIgICB2ZWMyIG1hdFNhbXBsZSA9IHRleHR1cmUyRChkaXNwbGFjZW1lbnRNYXAsIG1hcENvcmRzKS54eTtcIixcIiAgIG1hdFNhbXBsZSAtPSAwLjU7XCIsXCIgICBtYXRTYW1wbGUgKj0gc2NhbGU7XCIsXCIgICBtYXRTYW1wbGUgLz0gbWFwRGltZW5zaW9ucztcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyBtYXRTYW1wbGUueCwgdlRleHR1cmVDb29yZC55ICsgbWF0U2FtcGxlLnkpKTtcIixcIiAgIGdsX0ZyYWdDb2xvci5yZ2IgPSBtaXgoIGdsX0ZyYWdDb2xvci5yZ2IsIGdsX0ZyYWdDb2xvci5yZ2IsIDEuMCk7XCIsXCIgICB2ZWMyIGNvcmQgPSB2VGV4dHVyZUNvb3JkO1wiLFwifVwiXX0sYi5EaXNwbGFjZW1lbnRGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuRGlzcGxhY2VtZW50RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkRpc3BsYWNlbWVudEZpbHRlcixiLkRpc3BsYWNlbWVudEZpbHRlci5wcm90b3R5cGUub25UZXh0dXJlTG9hZGVkPWZ1bmN0aW9uKCl7dGhpcy51bmlmb3Jtcy5tYXBEaW1lbnNpb25zLnZhbHVlLng9dGhpcy51bmlmb3Jtcy5kaXNwbGFjZW1lbnRNYXAudmFsdWUud2lkdGgsdGhpcy51bmlmb3Jtcy5tYXBEaW1lbnNpb25zLnZhbHVlLnk9dGhpcy51bmlmb3Jtcy5kaXNwbGFjZW1lbnRNYXAudmFsdWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMuZGlzcGxhY2VtZW50TWFwLnZhbHVlLmJhc2VUZXh0dXJlLm9mZihcImxvYWRlZFwiLHRoaXMuYm91bmRMb2FkZWRGdW5jdGlvbil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRpc3BsYWNlbWVudEZpbHRlci5wcm90b3R5cGUsXCJtYXBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZGlzcGxhY2VtZW50TWFwLnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5kaXNwbGFjZW1lbnRNYXAudmFsdWU9YX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5EaXNwbGFjZW1lbnRGaWx0ZXIucHJvdG90eXBlLFwic2NhbGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NhbGUudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLnNjYWxlLnZhbHVlPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuRGlzcGxhY2VtZW50RmlsdGVyLnByb3RvdHlwZSxcIm9mZnNldFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vZmZzZXQudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLm9mZnNldC52YWx1ZT1hfX0pLGIuUGl4ZWxhdGVGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e2ludmVydDp7dHlwZTpcIjFmXCIsdmFsdWU6MH0sZGltZW5zaW9uczp7dHlwZTpcIjRmdlwiLHZhbHVlOm5ldyBGbG9hdDMyQXJyYXkoWzFlNCwxMDAsMTAsMTBdKX0scGl4ZWxTaXplOnt0eXBlOlwiMmZcIix2YWx1ZTp7eDoxMCx5OjEwfX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHZlYzIgdGVzdERpbTtcIixcInVuaWZvcm0gdmVjNCBkaW1lbnNpb25zO1wiLFwidW5pZm9ybSB2ZWMyIHBpeGVsU2l6ZTtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkO1wiLFwiICAgdmVjMiBzaXplID0gZGltZW5zaW9ucy54eS9waXhlbFNpemU7XCIsXCIgICB2ZWMyIGNvbG9yID0gZmxvb3IoICggdlRleHR1cmVDb29yZCAqIHNpemUgKSApIC8gc2l6ZSArIHBpeGVsU2l6ZS9kaW1lbnNpb25zLnh5ICogMC41O1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb2xvcik7XCIsXCJ9XCJdfSxiLlBpeGVsYXRlRmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLlBpeGVsYXRlRmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlBpeGVsYXRlRmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlBpeGVsYXRlRmlsdGVyLnByb3RvdHlwZSxcInNpemVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucGl4ZWxTaXplLnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eT0hMCx0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZS52YWx1ZT1hfX0pLGIuQmx1clhGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e2JsdXI6e3R5cGU6XCIxZlwiLHZhbHVlOjEvNTEyfX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gZmxvYXQgYmx1cjtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIHZlYzQgc3VtID0gdmVjNCgwLjApO1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSA0LjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjA1O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSAzLjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjA5O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSAyLjAqYmx1ciwgdlRleHR1cmVDb29yZC55KSkgKiAwLjEyO1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSBibHVyLCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMTU7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55KSkgKiAwLjE2O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyBibHVyLCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMTU7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIDIuMCpibHVyLCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMTI7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIDMuMCpibHVyLCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMDk7XCIsXCIgICBzdW0gKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIDQuMCpibHVyLCB2VGV4dHVyZUNvb3JkLnkpKSAqIDAuMDU7XCIsXCIgICBnbF9GcmFnQ29sb3IgPSBzdW07XCIsXCJ9XCJdfSxiLkJsdXJYRmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLkJsdXJYRmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkJsdXJYRmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkJsdXJYRmlsdGVyLnByb3RvdHlwZSxcImJsdXJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1ci52YWx1ZS8oMS83ZTMpfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5kaXJ0eT0hMCx0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWU9MS83ZTMqYX19KSxiLkJsdXJZRmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtibHVyOnt0eXBlOlwiMWZcIix2YWx1ZToxLzUxMn19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIGZsb2F0IGJsdXI7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWM0IHN1bSA9IHZlYzQoMC4wKTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSA0LjAqYmx1cikpICogMC4wNTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSAzLjAqYmx1cikpICogMC4wOTtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSAyLjAqYmx1cikpICogMC4xMjtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSBibHVyKSkgKiAwLjE1O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSkpICogMC4xNjtcIixcIiAgIHN1bSArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgKyBibHVyKSkgKiAwLjE1O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIDIuMCpibHVyKSkgKiAwLjEyO1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIDMuMCpibHVyKSkgKiAwLjA5O1wiLFwiICAgc3VtICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIDQuMCpibHVyKSkgKiAwLjA1O1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gc3VtO1wiLFwifVwiXX0sYi5CbHVyWUZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5CbHVyWUZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5CbHVyWUZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5CbHVyWUZpbHRlci5wcm90b3R5cGUsXCJibHVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWUvKDEvN2UzKX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuYmx1ci52YWx1ZT0xLzdlMyphfX0pLGIuQmx1ckZpbHRlcj1mdW5jdGlvbigpe3RoaXMuYmx1clhGaWx0ZXI9bmV3IGIuQmx1clhGaWx0ZXIsdGhpcy5ibHVyWUZpbHRlcj1uZXcgYi5CbHVyWUZpbHRlcix0aGlzLnBhc3Nlcz1bdGhpcy5ibHVyWEZpbHRlcix0aGlzLmJsdXJZRmlsdGVyXX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQmx1ckZpbHRlci5wcm90b3R5cGUsXCJibHVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJYRmlsdGVyLmJsdXJ9LHNldDpmdW5jdGlvbihhKXt0aGlzLmJsdXJYRmlsdGVyLmJsdXI9dGhpcy5ibHVyWUZpbHRlci5ibHVyPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQmx1ckZpbHRlci5wcm90b3R5cGUsXCJibHVyWFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuQmx1ckZpbHRlci5wcm90b3R5cGUsXCJibHVyWVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWUZpbHRlci5ibHVyfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5ibHVyWUZpbHRlci5ibHVyPWF9fSksYi5JbnZlcnRGaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e2ludmVydDp7dHlwZTpcIjFmXCIsdmFsdWU6MX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIGZsb2F0IGludmVydDtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XCIsXCIgICBnbF9GcmFnQ29sb3IucmdiID0gbWl4KCAodmVjMygxKS1nbF9GcmFnQ29sb3IucmdiKSAqIGdsX0ZyYWdDb2xvci5hLCBnbF9GcmFnQ29sb3IucmdiLCAxLjAgLSBpbnZlcnQpO1wiLFwifVwiXX0sYi5JbnZlcnRGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuSW52ZXJ0RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkludmVydEZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5JbnZlcnRGaWx0ZXIucHJvdG90eXBlLFwiaW52ZXJ0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmludmVydC52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuaW52ZXJ0LnZhbHVlPWF9fSksYi5TZXBpYUZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17c2VwaWE6e3R5cGU6XCIxZlwiLHZhbHVlOjF9fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBmbG9hdCBzZXBpYTtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwiY29uc3QgbWF0MyBzZXBpYU1hdHJpeCA9IG1hdDMoMC4zNTg4LCAwLjcwNDQsIDAuMTM2OCwgMC4yOTkwLCAwLjU4NzAsIDAuMTE0MCwgMC4yMzkyLCAwLjQ2OTYsIDAuMDkxMik7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcIixcIiAgIGdsX0ZyYWdDb2xvci5yZ2IgPSBtaXgoIGdsX0ZyYWdDb2xvci5yZ2IsIGdsX0ZyYWdDb2xvci5yZ2IgKiBzZXBpYU1hdHJpeCwgc2VwaWEpO1wiLFwifVwiXX0sYi5TZXBpYUZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5TZXBpYUZpbHRlci5wcm90b3R5cGUuY29uc3RydWN0b3I9Yi5TZXBpYUZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5TZXBpYUZpbHRlci5wcm90b3R5cGUsXCJzZXBpYVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zZXBpYS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMudW5pZm9ybXMuc2VwaWEudmFsdWU9YX19KSxiLlR3aXN0RmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtyYWRpdXM6e3R5cGU6XCIxZlwiLHZhbHVlOi41fSxhbmdsZTp7dHlwZTpcIjFmXCIsdmFsdWU6NX0sb2Zmc2V0Ont0eXBlOlwiMmZcIix2YWx1ZTp7eDouNSx5Oi41fX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHZlYzQgZGltZW5zaW9ucztcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidW5pZm9ybSBmbG9hdCByYWRpdXM7XCIsXCJ1bmlmb3JtIGZsb2F0IGFuZ2xlO1wiLFwidW5pZm9ybSB2ZWMyIG9mZnNldDtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAtIG9mZnNldDtcIixcIiAgIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKGNvb3JkKTtcIixcIiAgIGlmIChkaXN0YW5jZSA8IHJhZGl1cykge1wiLFwiICAgICAgIGZsb2F0IHJhdGlvID0gKHJhZGl1cyAtIGRpc3RhbmNlKSAvIHJhZGl1cztcIixcIiAgICAgICBmbG9hdCBhbmdsZU1vZCA9IHJhdGlvICogcmF0aW8gKiBhbmdsZTtcIixcIiAgICAgICBmbG9hdCBzID0gc2luKGFuZ2xlTW9kKTtcIixcIiAgICAgICBmbG9hdCBjID0gY29zKGFuZ2xlTW9kKTtcIixcIiAgICAgICBjb29yZCA9IHZlYzIoY29vcmQueCAqIGMgLSBjb29yZC55ICogcywgY29vcmQueCAqIHMgKyBjb29yZC55ICogYyk7XCIsXCIgICB9XCIsXCIgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNvb3JkK29mZnNldCk7XCIsXCJ9XCJdfSxiLlR3aXN0RmlsdGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIuQWJzdHJhY3RGaWx0ZXIucHJvdG90eXBlKSxiLlR3aXN0RmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLlR3aXN0RmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLlR3aXN0RmlsdGVyLnByb3RvdHlwZSxcIm9mZnNldFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vZmZzZXQudmFsdWV9LHNldDpmdW5jdGlvbihhKXt0aGlzLmRpcnR5PSEwLHRoaXMudW5pZm9ybXMub2Zmc2V0LnZhbHVlPWF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuVHdpc3RGaWx0ZXIucHJvdG90eXBlLFwicmFkaXVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1cy52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5yYWRpdXMudmFsdWU9YX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Ud2lzdEZpbHRlci5wcm90b3R5cGUsXCJhbmdsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbmdsZS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5hbmdsZS52YWx1ZT1hfX0pLGIuQ29sb3JTdGVwRmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtzdGVwOnt0eXBlOlwiMWZcIix2YWx1ZTo1fX0sdGhpcy5mcmFnbWVudFNyYz1bXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcIixcInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1wiLFwidmFyeWluZyB2ZWM0IHZDb2xvcjtcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidW5pZm9ybSBmbG9hdCBzdGVwO1wiLFwidm9pZCBtYWluKHZvaWQpIHtcIixcIiAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1wiLFwiICAgY29sb3IgPSBmbG9vcihjb2xvciAqIHN0ZXApIC8gc3RlcDtcIixcIiAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1wiLFwifVwiXX0sYi5Db2xvclN0ZXBGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuQ29sb3JTdGVwRmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkNvbG9yU3RlcEZpbHRlcixPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5Db2xvclN0ZXBGaWx0ZXIucHJvdG90eXBlLFwic3RlcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdGVwLnZhbHVlfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5zdGVwLnZhbHVlPWF9fSksYi5Eb3RTY3JlZW5GaWx0ZXI9ZnVuY3Rpb24oKXtiLkFic3RyYWN0RmlsdGVyLmNhbGwodGhpcyksdGhpcy5wYXNzZXM9W3RoaXNdLHRoaXMudW5pZm9ybXM9e3NjYWxlOnt0eXBlOlwiMWZcIix2YWx1ZToxfSxhbmdsZTp7dHlwZTpcIjFmXCIsdmFsdWU6NX0sZGltZW5zaW9uczp7dHlwZTpcIjRmdlwiLHZhbHVlOlswLDAsMCwwXX19LHRoaXMuZnJhZ21lbnRTcmM9W1wicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XCIsXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcIixcInZhcnlpbmcgdmVjNCB2Q29sb3I7XCIsXCJ1bmlmb3JtIHZlYzQgZGltZW5zaW9ucztcIixcInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1wiLFwidW5pZm9ybSBmbG9hdCBhbmdsZTtcIixcInVuaWZvcm0gZmxvYXQgc2NhbGU7XCIsXCJmbG9hdCBwYXR0ZXJuKCkge1wiLFwiICAgZmxvYXQgcyA9IHNpbihhbmdsZSksIGMgPSBjb3MoYW5nbGUpO1wiLFwiICAgdmVjMiB0ZXggPSB2VGV4dHVyZUNvb3JkICogZGltZW5zaW9ucy54eTtcIixcIiAgIHZlYzIgcG9pbnQgPSB2ZWMyKFwiLFwiICAgICAgIGMgKiB0ZXgueCAtIHMgKiB0ZXgueSxcIixcIiAgICAgICBzICogdGV4LnggKyBjICogdGV4LnlcIixcIiAgICkgKiBzY2FsZTtcIixcIiAgIHJldHVybiAoc2luKHBvaW50LngpICogc2luKHBvaW50LnkpKSAqIDQuMDtcIixcIn1cIixcInZvaWQgbWFpbigpIHtcIixcIiAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1wiLFwiICAgZmxvYXQgYXZlcmFnZSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1wiLFwiICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2ZWMzKGF2ZXJhZ2UgKiAxMC4wIC0gNS4wICsgcGF0dGVybigpKSwgY29sb3IuYSk7XCIsXCJ9XCJdfSxiLkRvdFNjcmVlbkZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5Eb3RTY3JlZW5GaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuRG90U2NyZWVuRmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRvdFNjcmVlbkZpbHRlci5wcm90b3R5cGUsXCJzY2FsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY2FsZS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5zY2FsZS52YWx1ZT1hfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkRvdFNjcmVlbkZpbHRlci5wcm90b3R5cGUsXCJhbmdsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbmdsZS52YWx1ZX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuZGlydHk9ITAsdGhpcy51bmlmb3Jtcy5hbmdsZS52YWx1ZT1hfX0pLGIuQ3Jvc3NIYXRjaEZpbHRlcj1mdW5jdGlvbigpe2IuQWJzdHJhY3RGaWx0ZXIuY2FsbCh0aGlzKSx0aGlzLnBhc3Nlcz1bdGhpc10sdGhpcy51bmlmb3Jtcz17Ymx1cjp7dHlwZTpcIjFmXCIsdmFsdWU6MS81MTJ9fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSBmbG9hdCBibHVyO1wiLFwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XCIsXCJ2b2lkIG1haW4odm9pZCkge1wiLFwiICAgIGZsb2F0IGx1bSA9IGxlbmd0aCh0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQueHkpLnJnYik7XCIsXCIgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1wiLFwiICAgIGlmIChsdW0gPCAxLjAwKSB7XCIsXCIgICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSwgMTAuMCkgPT0gMC4wKSB7XCIsXCIgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XCIsXCIgICAgICAgIH1cIixcIiAgICB9XCIsXCIgICAgaWYgKGx1bSA8IDAuNzUpIHtcIixcIiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApIHtcIixcIiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcIixcIiAgICAgICAgfVwiLFwiICAgIH1cIixcIiAgICBpZiAobHVtIDwgMC41MCkge1wiLFwiICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54ICsgZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMCkge1wiLFwiICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1wiLFwiICAgICAgICB9XCIsXCIgICAgfVwiLFwiICAgIGlmIChsdW0gPCAwLjMpIHtcIixcIiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55IC0gNS4wLCAxMC4wKSA9PSAwLjApIHtcIixcIiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcIixcIiAgICAgICAgfVwiLFwiICAgIH1cIixcIn1cIl19LGIuQ3Jvc3NIYXRjaEZpbHRlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiLkFic3RyYWN0RmlsdGVyLnByb3RvdHlwZSksYi5Dcm9zc0hhdGNoRmlsdGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1iLkJsdXJZRmlsdGVyLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLkNyb3NzSGF0Y2hGaWx0ZXIucHJvdG90eXBlLFwiYmx1clwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVyLnZhbHVlLygxLzdlMyl9LHNldDpmdW5jdGlvbihhKXt0aGlzLnVuaWZvcm1zLmJsdXIudmFsdWU9MS83ZTMqYX19KSxiLlJHQlNwbGl0RmlsdGVyPWZ1bmN0aW9uKCl7Yi5BYnN0cmFjdEZpbHRlci5jYWxsKHRoaXMpLHRoaXMucGFzc2VzPVt0aGlzXSx0aGlzLnVuaWZvcm1zPXtyZWQ6e3R5cGU6XCIyZlwiLHZhbHVlOnt4OjIwLHk6MjB9fSxncmVlbjp7dHlwZTpcIjJmXCIsdmFsdWU6e3g6LTIwLHk6MjB9fSxibHVlOnt0eXBlOlwiMmZcIix2YWx1ZTp7eDoyMCx5Oi0yMH19LGRpbWVuc2lvbnM6e3R5cGU6XCI0ZnZcIix2YWx1ZTpbMCwwLDAsMF19fSx0aGlzLmZyYWdtZW50U3JjPVtcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiLFwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIsXCJ2YXJ5aW5nIHZlYzQgdkNvbG9yO1wiLFwidW5pZm9ybSB2ZWMyIHJlZDtcIixcInVuaWZvcm0gdmVjMiBncmVlbjtcIixcInVuaWZvcm0gdmVjMiBibHVlO1wiLFwidW5pZm9ybSB2ZWM0IGRpbWVuc2lvbnM7XCIsXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcIixcInZvaWQgbWFpbih2b2lkKSB7XCIsXCIgICBnbF9GcmFnQ29sb3IuciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHJlZC9kaW1lbnNpb25zLnh5KS5yO1wiLFwiICAgZ2xfRnJhZ0NvbG9yLmcgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBncmVlbi9kaW1lbnNpb25zLnh5KS5nO1wiLFwiICAgZ2xfRnJhZ0NvbG9yLmIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBibHVlL2RpbWVuc2lvbnMueHkpLmI7XCIsXCIgICBnbF9GcmFnQ29sb3IuYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcIixcIn1cIl19LGIuUkdCU3BsaXRGaWx0ZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYi5BYnN0cmFjdEZpbHRlci5wcm90b3R5cGUpLGIuUkdCU3BsaXRGaWx0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPWIuUkdCU3BsaXRGaWx0ZXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGIuUkdCU3BsaXRGaWx0ZXIucHJvdG90eXBlLFwiYW5nbGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1ci52YWx1ZS8oMS83ZTMpfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy51bmlmb3Jtcy5ibHVyLnZhbHVlPTEvN2UzKmF9fSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHM/KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYoZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1iKSxleHBvcnRzLlBJWEk9Yik6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5QSVhJPWJ9KS5jYWxsKHRoaXMpOyIsIi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xlL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xlL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxuLy8gRGF0ZS5ub3cgc2hpbSBmb3IgKGFoZW0pIEludGVybmV0IEV4cGxvKGR8cillclxuaWYgKCBEYXRlLm5vdyA9PT0gdW5kZWZpbmVkICkge1xuXG5cdERhdGUubm93ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpO1xuXG5cdH07XG5cbn1cblxudmFyIFRXRUVOID0gVFdFRU4gfHwgKCBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIF90d2VlbnMgPSBbXTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0UkVWSVNJT046ICcxNCcsXG5cblx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdF90d2VlbnMgPSBbXTtcblxuXHRcdH0sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uICggdHdlZW4gKSB7XG5cblx0XHRcdF90d2VlbnMucHVzaCggdHdlZW4gKTtcblxuXHRcdH0sXG5cblx0XHRyZW1vdmU6IGZ1bmN0aW9uICggdHdlZW4gKSB7XG5cblx0XHRcdHZhciBpID0gX3R3ZWVucy5pbmRleE9mKCB0d2VlbiApO1xuXG5cdFx0XHRpZiAoIGkgIT09IC0xICkge1xuXG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKCBpLCAxICk7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICggdGltZSApIHtcblxuXHRcdFx0aWYgKCBfdHdlZW5zLmxlbmd0aCA9PT0gMCApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHR0aW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkID8gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogRGF0ZS5ub3coKSApO1xuXG5cdFx0XHR3aGlsZSAoIGkgPCBfdHdlZW5zLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiAoIF90d2VlbnNbIGkgXS51cGRhdGUoIHRpbWUgKSApIHtcblxuXHRcdFx0XHRcdGkrKztcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoIGksIDEgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cdH07XG5cbn0gKSgpO1xuXG5UV0VFTi5Ud2VlbiA9IGZ1bmN0aW9uICggb2JqZWN0ICkge1xuXG5cdHZhciBfb2JqZWN0ID0gb2JqZWN0O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0ID0ge307XG5cdHZhciBfdmFsdWVzRW5kID0ge307XG5cdHZhciBfdmFsdWVzU3RhcnRSZXBlYXQgPSB7fTtcblx0dmFyIF9kdXJhdGlvbiA9IDEwMDA7XG5cdHZhciBfcmVwZWF0ID0gMDtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHQvLyBTZXQgYWxsIHN0YXJ0aW5nIHZhbHVlcyBwcmVzZW50IG9uIHRoZSB0YXJnZXQgb2JqZWN0XG5cdGZvciAoIHZhciBmaWVsZCBpbiBvYmplY3QgKSB7XG5cblx0XHRfdmFsdWVzU3RhcnRbIGZpZWxkIF0gPSBwYXJzZUZsb2F0KG9iamVjdFtmaWVsZF0sIDEwKTtcblxuXHR9XG5cblx0dGhpcy50byA9IGZ1bmN0aW9uICggcHJvcGVydGllcywgZHVyYXRpb24gKSB7XG5cblx0XHRpZiAoIGR1cmF0aW9uICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdF9kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG5cdFx0fVxuXG5cdFx0X3ZhbHVlc0VuZCA9IHByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHRUV0VFTi5hZGQoIHRoaXMgKTtcblxuXHRcdF9pc1BsYXlpbmcgPSB0cnVlO1xuXG5cdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cblx0XHRfc3RhcnRUaW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkID8gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogRGF0ZS5ub3coKSApO1xuXHRcdF9zdGFydFRpbWUgKz0gX2RlbGF5VGltZTtcblxuXHRcdGZvciAoIHZhciBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kICkge1xuXG5cdFx0XHQvLyBjaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmICggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSBpbnN0YW5jZW9mIEFycmF5ICkge1xuXG5cdFx0XHRcdGlmICggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXS5sZW5ndGggPT09IDAgKSB7XG5cblx0XHRcdFx0XHRjb250aW51ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gPSBbIF9vYmplY3RbIHByb3BlcnR5IF0gXS5jb25jYXQoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gPSBfb2JqZWN0WyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRpZiggKCBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gaW5zdGFuY2VvZiBBcnJheSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gfHwgMDtcblxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhX2lzUGxheWluZyApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSggdGhpcyApO1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmICggX29uU3RvcENhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucygpO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAoIHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKyApIHtcblxuXHRcdFx0X2NoYWluZWRUd2VlbnNbIGkgXS5zdG9wKCk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmRlbGF5ID0gZnVuY3Rpb24gKCBhbW91bnQgKSB7XG5cblx0XHRfZGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXQgPSBmdW5jdGlvbiAoIHRpbWVzICkge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy55b3lvID0gZnVuY3Rpb24oIHlveW8gKSB7XG5cblx0XHRfeW95byA9IHlveW87XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXG5cdHRoaXMuZWFzaW5nID0gZnVuY3Rpb24gKCBlYXNpbmcgKSB7XG5cblx0XHRfZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmludGVycG9sYXRpb24gPSBmdW5jdGlvbiAoIGludGVycG9sYXRpb24gKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uVXBkYXRlID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uQ29tcGxldGUgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uU3RvcENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICggdGltZSApIHtcblxuXHRcdHZhciBwcm9wZXJ0eTtcblxuXHRcdGlmICggdGltZSA8IF9zdGFydFRpbWUgKSB7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBfb25TdGFydENhbGxiYWNrRmlyZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHRpZiAoIF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKCBfb2JqZWN0ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdHZhciBlbGFwc2VkID0gKCB0aW1lIC0gX3N0YXJ0VGltZSApIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFyIHZhbHVlID0gX2Vhc2luZ0Z1bmN0aW9uKCBlbGFwc2VkICk7XG5cblx0XHRmb3IgKCBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kICkge1xuXG5cdFx0XHR2YXIgc3RhcnQgPSBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRpZiAoIGVuZCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXG5cdFx0XHRcdF9vYmplY3RbIHByb3BlcnR5IF0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKCBlbmQsIHZhbHVlICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gUGFyc2VzIHJlbGF0aXZlIGVuZCB2YWx1ZXMgd2l0aCBzdGFydCBhcyBiYXNlIChlLmcuOiArMTAsIC0zKVxuXHRcdFx0XHRpZiAoIHR5cGVvZihlbmQpID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAoIHR5cGVvZihlbmQpID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRcdF9vYmplY3RbIHByb3BlcnR5IF0gPSBzdGFydCArICggZW5kIC0gc3RhcnQgKSAqIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggX29uVXBkYXRlQ2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdF9vblVwZGF0ZUNhbGxiYWNrLmNhbGwoIF9vYmplY3QsIHZhbHVlICk7XG5cblx0XHR9XG5cblx0XHRpZiAoIGVsYXBzZWQgPT0gMSApIHtcblxuXHRcdFx0aWYgKCBfcmVwZWF0ID4gMCApIHtcblxuXHRcdFx0XHRpZiggaXNGaW5pdGUoIF9yZXBlYXQgKSApIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IoIHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCApIHtcblxuXHRcdFx0XHRcdGlmICggdHlwZW9mKCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdICkgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbIHByb3BlcnR5IF0sIDEwKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF07XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc0VuZFsgcHJvcGVydHkgXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF07XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdF9yZXZlcnNlZCA9ICFfcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9kZWxheVRpbWU7XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKCBfb25Db21wbGV0ZUNhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0X29uQ29tcGxldGVDYWxsYmFjay5jYWxsKCBfb2JqZWN0ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKyApIHtcblxuXHRcdFx0XHRcdF9jaGFpbmVkVHdlZW5zWyBpIF0uc3RhcnQoIHRpbWUgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblxuXHR9O1xuXG59O1xuXG5cblRXRUVOLkVhc2luZyA9IHtcblxuXHRMaW5lYXI6IHtcblxuXHRcdE5vbmU6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGs7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFkcmF0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiAoIDIgLSBrICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogaztcblx0XHRcdHJldHVybiAtIDAuNSAqICggLS1rICogKCBrIC0gMiApIC0gMSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q3ViaWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFydGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoIC0tayAqIGsgKiBrICogayApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIC0gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrIC0gMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVpbnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogayAqIGsgKiBrICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0U2ludXNvaWRhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLmNvcyggayAqIE1hdGguUEkgLyAyICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNpbiggayAqIE1hdGguUEkgLyAyICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICggMSAtIE1hdGguY29zKCBNYXRoLlBJICogayApICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFeHBvbmVudGlhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdyggMiwgLSAxMCAqIGsgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBNYXRoLnBvdyggMTAyNCwgayAtIDEgKTtcblx0XHRcdHJldHVybiAwLjUgKiAoIC0gTWF0aC5wb3coIDIsIC0gMTAgKiAoIGsgLSAxICkgKSArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguc3FydCggMSAtIGsgKiBrICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoIDEgLSAoIC0tayAqIGsgKSApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAtIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gayAqIGspIC0gMSk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCBNYXRoLnNxcnQoIDEgLSAoIGsgLT0gMikgKiBrKSArIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RWxhc3RpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdHJldHVybiAtICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdHJldHVybiAoIGEgKiBNYXRoLnBvdyggMiwgLSAxMCAqIGspICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSArIDEgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcblx0XHRcdGlmICggayA9PT0gMCApIHJldHVybiAwO1xuXHRcdFx0aWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG5cdFx0XHRpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG5cdFx0XHRlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAtIDAuNSAqICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcblx0XHRcdHJldHVybiBhICogTWF0aC5wb3coIDIsIC0xMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKiAwLjUgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0cmV0dXJuIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRyZXR1cm4gLS1rICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4ICogMS41MjU7XG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqICggayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICkgKTtcblx0XHRcdHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Qm91bmNlOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KCAxIC0gayApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPCAoIDEgLyAyLjc1ICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBrIDwgKCAyIC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAxLjUgLyAyLjc1ICkgKSAqIGsgKyAwLjc1O1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBrIDwgKCAyLjUgLyAyLjc1ICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuMjUgLyAyLjc1ICkgKSAqIGsgKyAwLjkzNzU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuNjI1IC8gMi43NSApICkgKiBrICsgMC45ODQzNzU7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPCAwLjUgKSByZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5JbiggayAqIDIgKSAqIDAuNTtcblx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCggayAqIDIgLSAxICkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDEsIGYgPSBtICogaywgaSA9IE1hdGguZmxvb3IoIGYgKSwgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkxpbmVhcjtcblxuXHRcdGlmICggayA8IDAgKSByZXR1cm4gZm4oIHZbIDAgXSwgdlsgMSBdLCBmICk7XG5cdFx0aWYgKCBrID4gMSApIHJldHVybiBmbiggdlsgbSBdLCB2WyBtIC0gMSBdLCBtIC0gZiApO1xuXG5cdFx0cmV0dXJuIGZuKCB2WyBpIF0sIHZbIGkgKyAxID4gbSA/IG0gOiBpICsgMSBdLCBmIC0gaSApO1xuXG5cdH0sXG5cblx0QmV6aWVyOiBmdW5jdGlvbiAoIHYsIGsgKSB7XG5cblx0XHR2YXIgYiA9IDAsIG4gPSB2Lmxlbmd0aCAtIDEsIHB3ID0gTWF0aC5wb3csIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW4sIGk7XG5cblx0XHRmb3IgKCBpID0gMDsgaSA8PSBuOyBpKysgKSB7XG5cdFx0XHRiICs9IHB3KCAxIC0gaywgbiAtIGkgKSAqIHB3KCBrLCBpICkgKiB2WyBpIF0gKiBibiggbiwgaSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDEsIGYgPSBtICogaywgaSA9IE1hdGguZmxvb3IoIGYgKSwgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkNhdG11bGxSb207XG5cblx0XHRpZiAoIHZbIDAgXSA9PT0gdlsgbSBdICkge1xuXG5cdFx0XHRpZiAoIGsgPCAwICkgaSA9IE1hdGguZmxvb3IoIGYgPSBtICogKCAxICsgayApICk7XG5cblx0XHRcdHJldHVybiBmbiggdlsgKCBpIC0gMSArIG0gKSAlIG0gXSwgdlsgaSBdLCB2WyAoIGkgKyAxICkgJSBtIF0sIHZbICggaSArIDIgKSAlIG0gXSwgZiAtIGkgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmICggayA8IDAgKSByZXR1cm4gdlsgMCBdIC0gKCBmbiggdlsgMCBdLCB2WyAwIF0sIHZbIDEgXSwgdlsgMSBdLCAtZiApIC0gdlsgMCBdICk7XG5cdFx0XHRpZiAoIGsgPiAxICkgcmV0dXJuIHZbIG0gXSAtICggZm4oIHZbIG0gXSwgdlsgbSBdLCB2WyBtIC0gMSBdLCB2WyBtIC0gMSBdLCBmIC0gbSApIC0gdlsgbSBdICk7XG5cblx0XHRcdHJldHVybiBmbiggdlsgaSA/IGkgLSAxIDogMCBdLCB2WyBpIF0sIHZbIG0gPCBpICsgMSA/IG0gOiBpICsgMSBdLCB2WyBtIDwgaSArIDIgPyBtIDogaSArIDIgXSwgZiAtIGkgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFV0aWxzOiB7XG5cblx0XHRMaW5lYXI6IGZ1bmN0aW9uICggcDAsIHAxLCB0ICkge1xuXG5cdFx0XHRyZXR1cm4gKCBwMSAtIHAwICkgKiB0ICsgcDA7XG5cblx0XHR9LFxuXG5cdFx0QmVybnN0ZWluOiBmdW5jdGlvbiAoIG4gLCBpICkge1xuXG5cdFx0XHR2YXIgZmMgPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkZhY3RvcmlhbDtcblx0XHRcdHJldHVybiBmYyggbiApIC8gZmMoIGkgKSAvIGZjKCBuIC0gaSApO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBhID0gWyAxIF07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG5cblx0XHRcdFx0dmFyIHMgPSAxLCBpO1xuXHRcdFx0XHRpZiAoIGFbIG4gXSApIHJldHVybiBhWyBuIF07XG5cdFx0XHRcdGZvciAoIGkgPSBuOyBpID4gMTsgaS0tICkgcyAqPSBpO1xuXHRcdFx0XHRyZXR1cm4gYVsgbiBdID0gcztcblxuXHRcdFx0fTtcblxuXHRcdH0gKSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKCBwMCwgcDEsIHAyLCBwMywgdCApIHtcblxuXHRcdFx0dmFyIHYwID0gKCBwMiAtIHAwICkgKiAwLjUsIHYxID0gKCBwMyAtIHAxICkgKiAwLjUsIHQyID0gdCAqIHQsIHQzID0gdCAqIHQyO1xuXHRcdFx0cmV0dXJuICggMiAqIHAxIC0gMiAqIHAyICsgdjAgKyB2MSApICogdDMgKyAoIC0gMyAqIHAxICsgMyAqIHAyIC0gMiAqIHYwIC0gdjEgKSAqIHQyICsgdjAgKiB0ICsgcDE7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cz1UV0VFTjsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgUGl4aUFwcCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9QaXhpQXBwXCIpO1xudmFyIE5ldFBva2VyQ2xpZW50VmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L05ldFBva2VyQ2xpZW50Vmlld1wiKTtcbnZhciBOZXRQb2tlckNsaWVudENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vY29udHJvbGxlci9OZXRQb2tlckNsaWVudENvbnRyb2xsZXJcIik7XG52YXIgTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb25cIik7XG52YXIgUHJvdG9Db25uZWN0aW9uID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL1Byb3RvQ29ubmVjdGlvblwiKTtcbnZhciBMb2FkaW5nU2NyZWVuID0gcmVxdWlyZShcIi4uL3ZpZXcvTG9hZGluZ1NjcmVlblwiKTtcbnZhciBTdGF0ZUNvbXBsZXRlTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9TdGF0ZUNvbXBsZXRlTWVzc2FnZVwiKTtcbnZhciBJbml0TWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9Jbml0TWVzc2FnZVwiKTtcblxuLyoqXG4gKiBNYWluIGVudHJ5IHBvaW50IGZvciBjbGllbnQuXG4gKiBAY2xhc3MgTmV0UG9rZXJDbGllbnRcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnQoKSB7XG5cdFBpeGlBcHAuY2FsbCh0aGlzLCA5NjAsIDcyMCk7XG5cblx0dGhpcy5sb2FkaW5nU2NyZWVuID0gbmV3IExvYWRpbmdTY3JlZW4oKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmxvYWRpbmdTY3JlZW4pO1xuXHR0aGlzLmxvYWRpbmdTY3JlZW4uc2hvdyhcIkxPQURJTkdcIik7XG5cblx0dGhpcy51cmwgPSBudWxsO1xuXG5cdHRoaXMudGFibGVJZD1udWxsO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE5ldFBva2VyQ2xpZW50LCBQaXhpQXBwKTtcblxuLyoqXG4gKiBTZXQgdXJsLlxuICogQG1ldGhvZCBzZXRVcmxcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLnNldFVybCA9IGZ1bmN0aW9uKHVybCkge1xuXHR0aGlzLnVybCA9IHVybDtcbn1cblxuLyoqXG4gKiBTZXQgdGFibGUgaWQuXG4gKiBAbWV0aG9kIHNldFRhYmxlSWRcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLnNldFRhYmxlSWQgPSBmdW5jdGlvbih0YWJsZUlkKSB7XG5cdHRoaXMudGFibGVJZCA9IHRhYmxlSWQ7XG59XG5cbi8qKlxuICogU2V0IHZpZXcgY2FzZS5cbiAqIEBtZXRob2Qgc2V0Vmlld0Nhc2VcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLnNldFZpZXdDYXNlID0gZnVuY3Rpb24odmlld0Nhc2UpIHtcblx0Y29uc29sZS5sb2coXCIqKioqKiogcnVubmluZyB2aWV3IGNhc2U6IFwiK3ZpZXdDYXNlKTtcblx0dGhpcy52aWV3Q2FzZT12aWV3Q2FzZTtcbn1cblxuLyoqXG4gKiBTZXQgdG9rZW4uXG4gKiBAbWV0aG9kIHNldFRva2VuXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5zZXRUb2tlbiA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdHRoaXMudG9rZW4gPSB0b2tlbjtcbn1cblxuLyoqXG4gKiBSdW4uXG4gKiBAbWV0aG9kIHJ1blxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhc3NldHMgPSBbXG5cdFx0XCJ0YWJsZS5wbmdcIixcblx0XHRcImNvbXBvbmVudHMucG5nXCJcblx0XTtcblxuXHR0aGlzLmFzc2V0TG9hZGVyID0gbmV3IFBJWEkuQXNzZXRMb2FkZXIoYXNzZXRzKTtcblx0dGhpcy5hc3NldExvYWRlci5hZGRFdmVudExpc3RlbmVyKFwib25Db21wbGV0ZVwiLCB0aGlzLm9uQXNzZXRMb2FkZXJDb21wbGV0ZS5iaW5kKHRoaXMpKTtcblx0dGhpcy5hc3NldExvYWRlci5sb2FkKCk7XG59XG5cbi8qKlxuICogQXNzZXRzIGxvYWRlZCwgY29ubmVjdC5cbiAqIEBtZXRob2Qgb25Bc3NldExvYWRlckNvbXBsZXRlXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUub25Bc3NldExvYWRlckNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiYXNzZXQgbG9hZGVyIGNvbXBsZXRlLi4uXCIpO1xuXG5cdHRoaXMubmV0UG9rZXJDbGllbnRWaWV3ID0gbmV3IE5ldFBva2VyQ2xpZW50VmlldygpO1xuXHR0aGlzLmFkZENoaWxkQXQodGhpcy5uZXRQb2tlckNsaWVudFZpZXcsIDApO1xuXG5cdHRoaXMubmV0UG9rZXJDbGllbnRDb250cm9sbGVyID0gbmV3IE5ldFBva2VyQ2xpZW50Q29udHJvbGxlcih0aGlzLm5ldFBva2VyQ2xpZW50Vmlldyk7XG5cdHRoaXMuY29ubmVjdCgpO1xufVxuXG4vKipcbiAqIENvbm5lY3QuXG4gKiBAbWV0aG9kIGNvbm5lY3RcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy51cmwpIHtcblx0XHR0aGlzLmxvYWRpbmdTY3JlZW4uc2hvdyhcIk5FRUQgVVJMXCIpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuY29ubmVjdGlvbiA9IG5ldyBNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbigpO1xuXHR0aGlzLmNvbm5lY3Rpb24ub24oTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uQ09OTkVDVCwgdGhpcy5vbkNvbm5lY3Rpb25Db25uZWN0LCB0aGlzKTtcblx0dGhpcy5jb25uZWN0aW9uLm9uKE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLkNMT1NFLCB0aGlzLm9uQ29ubmVjdGlvbkNsb3NlLCB0aGlzKTtcblx0dGhpcy5jb25uZWN0aW9uLmNvbm5lY3QodGhpcy51cmwpO1xuXHR0aGlzLmxvYWRpbmdTY3JlZW4uc2hvdyhcIkNPTk5FQ1RJTkdcIik7XG59XG5cbi8qKlxuICogQ29ubmVjdGlvbiBjb21wbGV0ZS5cbiAqIEBtZXRob2Qgb25Db25uZWN0aW9uQ29ubmVjdFxuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnQucHJvdG90eXBlLm9uQ29ubmVjdGlvbkNvbm5lY3QgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCIqKioqIGNvbm5lY3RlZFwiKTtcblx0dGhpcy5wcm90b0Nvbm5lY3Rpb24gPSBuZXcgUHJvdG9Db25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbik7XG5cdHRoaXMucHJvdG9Db25uZWN0aW9uLmFkZE1lc3NhZ2VIYW5kbGVyKFN0YXRlQ29tcGxldGVNZXNzYWdlLCB0aGlzLm9uU3RhdGVDb21wbGV0ZU1lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLm5ldFBva2VyQ2xpZW50Q29udHJvbGxlci5zZXRQcm90b0Nvbm5lY3Rpb24odGhpcy5wcm90b0Nvbm5lY3Rpb24pO1xuXHR0aGlzLmxvYWRpbmdTY3JlZW4uc2hvdyhcIklOSVRJQUxJWklOR1wiKTtcblxuXHR2YXIgaW5pdE1lc3NhZ2U9bmV3IEluaXRNZXNzYWdlKHRoaXMudG9rZW4pO1xuXG5cdGlmICh0aGlzLnRhYmxlSWQpXG5cdFx0aW5pdE1lc3NhZ2Uuc2V0VGFibGVJZCh0aGlzLnRhYmxlSWQpO1xuXG5cdGlmICh0aGlzLnZpZXdDYXNlKVxuXHRcdGluaXRNZXNzYWdlLnNldFZpZXdDYXNlKHRoaXMudmlld0Nhc2UpO1xuXG5cdHRoaXMucHJvdG9Db25uZWN0aW9uLnNlbmQoaW5pdE1lc3NhZ2UpO1xufVxuXG4vKipcbiAqIFN0YXRlIGNvbXBsZXRlLlxuICogQG1ldGhvZCBvblN0YXRlQ29tcGxldGVNZXNzYWdlXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudC5wcm90b3R5cGUub25TdGF0ZUNvbXBsZXRlTWVzc2FnZT1mdW5jdGlvbigpIHtcblx0dGhpcy5sb2FkaW5nU2NyZWVuLmhpZGUoKTtcbn1cblxuLyoqXG4gKiBDb25uZWN0aW9uIGNsb3NlZC5cbiAqIEBtZXRob2Qgb25Db25uZWN0aW9uQ2xvc2VcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50LnByb3RvdHlwZS5vbkNvbm5lY3Rpb25DbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIioqKiogY29ubmVjdGlvbiBjbG9zZWRcIik7XG5cdGlmICh0aGlzLnByb3RvQ29ubmVjdGlvbilcblx0XHR0aGlzLnByb3RvQ29ubmVjdGlvbi5yZW1vdmVNZXNzYWdlSGFuZGxlcihTdGF0ZUNvbXBsZXRlTWVzc2FnZSwgdGhpcy5vblN0YXRlQ29tcGxldGVNZXNzYWdlLCB0aGlzKTtcblxuXHR0aGlzLnByb3RvQ29ubmVjdGlvbiA9IG51bGw7XG5cdHRoaXMubmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnNldFByb3RvQ29ubmVjdGlvbihudWxsKTtcblx0dGhpcy5sb2FkaW5nU2NyZWVuLnNob3coXCJDT05ORUNUSU9OIEVSUk9SXCIpO1xuXHRzZXRUaW1lb3V0KHRoaXMuY29ubmVjdC5iaW5kKHRoaXMpLCAzMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXRQb2tlckNsaWVudDsiLCJ2YXIgU2hvd0RpYWxvZ01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvU2hvd0RpYWxvZ01lc3NhZ2VcIik7XG52YXIgQnV0dG9uc01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvQnV0dG9uc01lc3NhZ2VcIik7XG5cbi8qKlxuICogQ29udHJvbCB1c2VyIGludGVyZmFjZS5cbiAqIEBjbGFzcyBJbnRlcmZhY2VDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIEludGVyZmFjZUNvbnRyb2xsZXIobWVzc2FnZVNlcXVlbmNlciwgdmlldykge1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIgPSBtZXNzYWdlU2VxdWVuY2VyO1xuXHR0aGlzLnZpZXcgPSB2aWV3O1xuXG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihCdXR0b25zTWVzc2FnZS5UWVBFLCB0aGlzLm9uQnV0dG9uc01lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuYWRkTWVzc2FnZUhhbmRsZXIoU2hvd0RpYWxvZ01lc3NhZ2UuVFlQRSwgdGhpcy5vblNob3dEaWFsb2dNZXNzYWdlLCB0aGlzKTtcbn1cblxuLyoqXG4gKiBCdXR0b25zIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQnV0dG9uc01lc3NhZ2VcbiAqL1xuSW50ZXJmYWNlQ29udHJvbGxlci5wcm90b3R5cGUub25CdXR0b25zTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIGJ1dHRvbnNWaWV3ID0gdGhpcy52aWV3LmdldEJ1dHRvbnNWaWV3KCk7XG5cblx0YnV0dG9uc1ZpZXcuc2V0QnV0dG9ucyhtLmdldEJ1dHRvbnMoKSk7XG59XG5cbi8qKlxuICogU2hvdyBkaWFsb2cuXG4gKiBAbWV0aG9kIG9uU2hvd0RpYWxvZ01lc3NhZ2VcbiAqL1xuSW50ZXJmYWNlQ29udHJvbGxlci5wcm90b3R5cGUub25TaG93RGlhbG9nTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIGRpYWxvZ1ZpZXcgPSB0aGlzLnZpZXcuZ2V0RGlhbG9nVmlldygpO1xuXG5cdGRpYWxvZ1ZpZXcuc2hvdyhtLmdldFRleHQoKSwgbS5nZXRCdXR0b25zKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyZmFjZUNvbnRyb2xsZXI7IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBTZXF1ZW5jZXIgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvU2VxdWVuY2VyXCIpO1xuXG4vKipcbiAqIEFuIGl0ZW0gaW4gYSBtZXNzYWdlIHNlcXVlbmNlLlxuICogQGNsYXNzIE1lc3NhZ2VTZXF1ZW5jZUl0ZW1cbiAqL1xuZnVuY3Rpb24gTWVzc2FnZVNlcXVlbmNlSXRlbShtZXNzYWdlKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR0aGlzLndhaXRUYXJnZXQgPSBudWxsO1xuXHR0aGlzLndhaXRFdmVudCA9IG51bGw7XG5cdHRoaXMud2FpdENsb3N1cmUgPSBudWxsO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE1lc3NhZ2VTZXF1ZW5jZUl0ZW0sIEV2ZW50RGlzcGF0Y2hlcik7XG5cbi8qKlxuICogR2V0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIGdldE1lc3NhZ2VcbiAqL1xuTWVzc2FnZVNlcXVlbmNlSXRlbS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuXHQvL2NvbnNvbGUubG9nKFwiZ2V0dGluZzogXCIgKyB0aGlzLm1lc3NhZ2UudHlwZSk7XG5cblx0cmV0dXJuIHRoaXMubWVzc2FnZTtcbn1cblxuLyoqXG4gKiBBcmUgd2Ugd2FpdGluZyBmb3IgYW4gZXZlbnQ/XG4gKiBAbWV0aG9kIGlzV2FpdGluZ1xuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5pc1dhaXRpbmcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMud2FpdEV2ZW50ICE9IG51bGw7XG59XG5cbi8qKlxuICogTm90aWZ5IGNvbXBsZXRlLlxuICogQG1ldGhvZCBub3RpZnlDb21wbGV0ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5ub3RpZnlDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRyaWdnZXIoU2VxdWVuY2VyLkNPTVBMRVRFKTtcbn1cblxuLyoqXG4gKiBXYWl0IGZvciBldmVudCBiZWZvcmUgcHJvY2Vzc2luZyBuZXh0IG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHdhaXRGb3JcbiAqL1xuTWVzc2FnZVNlcXVlbmNlSXRlbS5wcm90b3R5cGUud2FpdEZvciA9IGZ1bmN0aW9uKHRhcmdldCwgZXZlbnQpIHtcblx0dGhpcy53YWl0VGFyZ2V0ID0gdGFyZ2V0O1xuXHR0aGlzLndhaXRFdmVudCA9IGV2ZW50O1xuXHR0aGlzLndhaXRDbG9zdXJlID0gdGhpcy5vblRhcmdldENvbXBsZXRlLmJpbmQodGhpcyk7XG5cblx0dGhpcy53YWl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodGhpcy53YWl0RXZlbnQsIHRoaXMud2FpdENsb3N1cmUpO1xufVxuXG4vKipcbiAqIFdhaXQgdGFyZ2V0IGNvbXBsZXRlLlxuICogQG1ldGhvZCBvblRhcmdldENvbXBsZXRlXG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlU2VxdWVuY2VJdGVtLnByb3RvdHlwZS5vblRhcmdldENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdC8vY29uc29sZS5sb2coXCJ0YXJnZXQgaXMgY29tcGxldGVcIik7XG5cdHRoaXMud2FpdFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMud2FpdEV2ZW50LCB0aGlzLndhaXRDbG9zdXJlKTtcblx0dGhpcy5ub3RpZnlDb21wbGV0ZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VTZXF1ZW5jZUl0ZW07IiwidmFyIFNlcXVlbmNlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9TZXF1ZW5jZXJcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50ZGlzcGF0Y2hlclwiKTtcbnZhciBNZXNzYWdlU2VxdWVuY2VJdGVtID0gcmVxdWlyZShcIi4vTWVzc2FnZVNlcXVlbmNlSXRlbVwiKTtcblxuLyoqXG4gKiBTZXF1ZW5jZXMgbWVzc2FnZXMuXG4gKiBAY2xhc3MgTWVzc2FnZVNlcXVlbmNlclxuICovXG5mdW5jdGlvbiBNZXNzYWdlU2VxdWVuY2VyKCkge1xuXHR0aGlzLnNlcXVlbmNlciA9IG5ldyBTZXF1ZW5jZXIoKTtcblx0dGhpcy5tZXNzYWdlRGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcblx0dGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG59XG5cbi8qKlxuICogQWRkIGEgbWVzc2FnZSBmb3IgcHJvY2VzaW5nLlxuICogQG1ldGhvZCBlbnF1ZXVlXG4gKi9cbk1lc3NhZ2VTZXF1ZW5jZXIucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdGlmICghbWVzc2FnZS50eXBlKVxuXHRcdHRocm93IFwiTWVzc2FnZSBkb2Vzbid0IGhhdmUgYSB0eXBlXCI7XG5cblx0dmFyIHNlcXVlbmNlSXRlbSA9IG5ldyBNZXNzYWdlU2VxdWVuY2VJdGVtKG1lc3NhZ2UpO1xuXG5cdHNlcXVlbmNlSXRlbS5vbihTZXF1ZW5jZXIuU1RBUlQsIHRoaXMub25TZXF1ZW5jZUl0ZW1TdGFydCwgdGhpcyk7XG5cblx0dGhpcy5zZXF1ZW5jZXIuZW5xdWV1ZShzZXF1ZW5jZUl0ZW0pO1xufVxuXG4vKipcbiAqIFNlcXVlbmNlIGl0ZW0gc3RhcnQuXG4gKiBAbWV0aG9kIG9uU2VxdWVuY2VJdGVtU3RhcnRcbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VTZXF1ZW5jZXIucHJvdG90eXBlLm9uU2VxdWVuY2VJdGVtU3RhcnQgPSBmdW5jdGlvbihlKSB7XG5cdC8vY29uc29sZS5sb2coXCJzdGFydGluZyBpdGVtLi4uXCIpO1xuXHR2YXIgaXRlbSA9IGUudGFyZ2V0O1xuXG5cdGl0ZW0ub2ZmKFNlcXVlbmNlci5TVEFSVCwgdGhpcy5vblNlcXVlbmNlSXRlbVN0YXJ0LCB0aGlzKTtcblxuXHR0aGlzLmN1cnJlbnRJdGVtID0gaXRlbTtcblx0dGhpcy5tZXNzYWdlRGlzcGF0Y2hlci50cmlnZ2VyKGl0ZW0uZ2V0TWVzc2FnZSgpKTtcblx0dGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG5cblx0aWYgKCFpdGVtLmlzV2FpdGluZygpKVxuXHRcdGl0ZW0ubm90aWZ5Q29tcGxldGUoKTtcbn1cblxuLyoqXG4gKiBBZGQgbWVzc2FnZSBoYW5kbGVyLlxuICogQG1ldGhvZCBhZGRNZXNzYWdlSGFuZGxlclxuICovXG5NZXNzYWdlU2VxdWVuY2VyLnByb3RvdHlwZS5hZGRNZXNzYWdlSGFuZGxlciA9IGZ1bmN0aW9uKG1lc3NhZ2VUeXBlLCBoYW5kbGVyLCBzY29wZSkge1xuXHR0aGlzLm1lc3NhZ2VEaXNwYXRjaGVyLm9uKG1lc3NhZ2VUeXBlLCBoYW5kbGVyLCBzY29wZSk7XG59XG5cbi8qKlxuICogV2FpdCBmb3IgdGhlIHRhcmdldCB0byBkaXNwYXRjaCBhbiBldmVudCBiZWZvcmUgY29udGludWluZyB0b1xuICogcHJvY2VzcyB0aGUgbWVzc2FnZXMgaW4gdGhlIHF1ZS5cbiAqIEBtZXRob2Qgd2FpdEZvclxuICovXG5NZXNzYWdlU2VxdWVuY2VyLnByb3RvdHlwZS53YWl0Rm9yID0gZnVuY3Rpb24odGFyZ2V0LCBldmVudCkge1xuXHRpZiAoIXRoaXMuY3VycmVudEl0ZW0pXG5cdFx0dGhyb3cgXCJOb3Qgd2FpdGluZyBmb3IgZXZlbnRcIjtcblxuXHR0aGlzLmN1cnJlbnRJdGVtLndhaXRGb3IodGFyZ2V0LCBldmVudCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVNlcXVlbmNlcjsiLCJ2YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBNZXNzYWdlU2VxdWVuY2VyID0gcmVxdWlyZShcIi4vTWVzc2FnZVNlcXVlbmNlclwiKTtcbnZhciBQcm90b0Nvbm5lY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vUHJvdG9Db25uZWN0aW9uXCIpO1xudmFyIEJ1dHRvbnNWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvQnV0dG9uc1ZpZXdcIik7XG52YXIgQnV0dG9uQ2xpY2tNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0J1dHRvbkNsaWNrTWVzc2FnZVwiKTtcbnZhciBTZWF0Q2xpY2tNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL1NlYXRDbGlja01lc3NhZ2VcIik7XG52YXIgTmV0UG9rZXJDbGllbnRWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvTmV0UG9rZXJDbGllbnRWaWV3XCIpO1xudmFyIFRhYmxlQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1RhYmxlQ29udHJvbGxlclwiKTtcbnZhciBJbnRlcmZhY2VDb250cm9sbGVyID0gcmVxdWlyZShcIi4vSW50ZXJmYWNlQ29udHJvbGxlclwiKTtcblxuLyoqXG4gKiBNYWluIGNvbnRyb2xsZXJcbiAqIEBjbGFzcyBOZXRQb2tlckNsaWVudENvbnRyb2xsZXJcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnRDb250cm9sbGVyKHZpZXcpIHtcblx0dGhpcy5uZXRQb2tlckNsaWVudFZpZXcgPSB2aWV3O1xuXHR0aGlzLnByb3RvQ29ubmVjdGlvbiA9IG51bGw7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlciA9IG5ldyBNZXNzYWdlU2VxdWVuY2VyKCk7XG5cblx0dGhpcy50YWJsZUNvbnRyb2xsZXIgPSBuZXcgVGFibGVDb250cm9sbGVyKHRoaXMubWVzc2FnZVNlcXVlbmNlciwgdGhpcy5uZXRQb2tlckNsaWVudFZpZXcpO1xuXHR0aGlzLmludGVyZmFjZUNvbnRyb2xsZXIgPSBuZXcgSW50ZXJmYWNlQ29udHJvbGxlcih0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIsIHRoaXMubmV0UG9rZXJDbGllbnRWaWV3KTtcblxuXHR0aGlzLm5ldFBva2VyQ2xpZW50Vmlldy5nZXRCdXR0b25zVmlldygpLm9uKEJ1dHRvbnNWaWV3LkJVVFRPTl9DTElDSywgdGhpcy5vbkJ1dHRvbkNsaWNrLCB0aGlzKTtcblx0dGhpcy5uZXRQb2tlckNsaWVudFZpZXcub24oTmV0UG9rZXJDbGllbnRWaWV3LlNFQVRfQ0xJQ0ssIHRoaXMub25TZWF0Q2xpY2ssIHRoaXMpO1xufVxuXG4vKipcbiAqIFNldCBjb25uZWN0aW9uLlxuICogQG1ldGhvZCBzZXRQcm90b0Nvbm5lY3Rpb25cbiAqL1xuTmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRQcm90b0Nvbm5lY3Rpb24gPSBmdW5jdGlvbihwcm90b0Nvbm5lY3Rpb24pIHtcblx0aWYgKHRoaXMucHJvdG9Db25uZWN0aW9uKSB7XG5cdFx0dGhpcy5wcm90b0Nvbm5lY3Rpb24ub2ZmKFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFLCB0aGlzLm9uUHJvdG9Db25uZWN0aW9uTWVzc2FnZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLnByb3RvQ29ubmVjdGlvbiA9IHByb3RvQ29ubmVjdGlvbjtcblxuXHRpZiAodGhpcy5wcm90b0Nvbm5lY3Rpb24pIHtcblx0XHR0aGlzLnByb3RvQ29ubmVjdGlvbi5vbihQcm90b0Nvbm5lY3Rpb24uTUVTU0FHRSwgdGhpcy5vblByb3RvQ29ubmVjdGlvbk1lc3NhZ2UsIHRoaXMpO1xuXHR9XG59XG5cbi8qKlxuICogSW5jb21pbmcgbWVzc2FnZS5cbiAqIEVucXVldWUgZm9yIHByb2Nlc3NpbmcuXG4gKsKgQG1ldGhvZCBvblByb3RvQ29ubmVjdGlvbk1lc3NhZ2VcbiAqIEBwcml2YXRlXG4gKi9cbk5ldFBva2VyQ2xpZW50Q29udHJvbGxlci5wcm90b3R5cGUub25Qcm90b0Nvbm5lY3Rpb25NZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIuZW5xdWV1ZShlLm1lc3NhZ2UpO1xufVxuXG4vKipcbiAqIEJ1dHRvbiBjbGljay5cbiAqIEBtZXRob2Qgb25CdXR0b25DbGlja1xuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnRDb250cm9sbGVyLnByb3RvdHlwZS5vbkJ1dHRvbkNsaWNrID0gZnVuY3Rpb24oZSkge1xuXHRpZiAoIXRoaXMucHJvdG9Db25uZWN0aW9uKVxuXHRcdHJldHVybjtcblxuXHR2YXIgbSA9IG5ldyBCdXR0b25DbGlja01lc3NhZ2UoZS5idXR0b24sIGUudmFsdWUpO1xuXHR0aGlzLnByb3RvQ29ubmVjdGlvbi5zZW5kKG0pO1xufVxuXG4vKipcbiAqIFNlYXQgY2xpY2suXG4gKiBAbWV0aG9kIG9uU2VhdENsaWNrXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudENvbnRyb2xsZXIucHJvdG90eXBlLm9uU2VhdENsaWNrID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgbSA9IG5ldyBTZWF0Q2xpY2tNZXNzYWdlKGUuc2VhdEluZGV4KTtcblx0dGhpcy5wcm90b0Nvbm5lY3Rpb24uc2VuZChtKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXRQb2tlckNsaWVudENvbnRyb2xsZXI7IiwidmFyIFNlYXRJbmZvTWVzc2FnZSA9IHJlcXVpcmUoXCIuLi8uLi9wcm90by9tZXNzYWdlcy9TZWF0SW5mb01lc3NhZ2VcIik7XG52YXIgQ29tbXVuaXR5Q2FyZHNNZXNzYWdlID0gcmVxdWlyZShcIi4uLy4uL3Byb3RvL21lc3NhZ2VzL0NvbW11bml0eUNhcmRzTWVzc2FnZVwiKTtcbnZhciBQb2NrZXRDYXJkc01lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvUG9ja2V0Q2FyZHNNZXNzYWdlXCIpO1xudmFyIERlYWxlckJ1dHRvbk1lc3NhZ2UgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vbWVzc2FnZXMvRGVhbGVyQnV0dG9uTWVzc2FnZVwiKTtcblxuLyoqXG4gKiBDb250cm9sIHRoZSB0YWJsZVxuICogQGNsYXNzIFRhYmxlQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBUYWJsZUNvbnRyb2xsZXIobWVzc2FnZVNlcXVlbmNlciwgdmlldykge1xuXHR0aGlzLm1lc3NhZ2VTZXF1ZW5jZXIgPSBtZXNzYWdlU2VxdWVuY2VyO1xuXHR0aGlzLnZpZXcgPSB2aWV3O1xuXG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihTZWF0SW5mb01lc3NhZ2UuVFlQRSwgdGhpcy5vblNlYXRJbmZvTWVzc2FnZSwgdGhpcyk7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihDb21tdW5pdHlDYXJkc01lc3NhZ2UuVFlQRSwgdGhpcy5vbkNvbW11bml0eUNhcmRzTWVzc2FnZSwgdGhpcyk7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihQb2NrZXRDYXJkc01lc3NhZ2UuVFlQRSwgdGhpcy5vblBvY2tldENhcmRzTWVzc2FnZSwgdGhpcyk7XG5cdHRoaXMubWVzc2FnZVNlcXVlbmNlci5hZGRNZXNzYWdlSGFuZGxlcihEZWFsZXJCdXR0b25NZXNzYWdlLlRZUEUsIHRoaXMub25EZWFsZXJCdXR0b25NZXNzYWdlLCB0aGlzKTtcbn1cblxuLyoqXG4gKiBTZWF0IGluZm8gbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25TZWF0SW5mb01lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vblNlYXRJbmZvTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIHNlYXRWaWV3ID0gdGhpcy52aWV3LmdldFNlYXRWaWV3QnlJbmRleChtLmdldFNlYXRJbmRleCgpKTtcblxuXHRzZWF0Vmlldy5zZXROYW1lKG0uZ2V0TmFtZSgpKTtcblx0c2VhdFZpZXcuc2V0Q2hpcHMobS5nZXRDaGlwcygpKTtcblx0c2VhdFZpZXcuc2V0QWN0aXZlKG0uaXNBY3RpdmUoKSk7XG5cdHNlYXRWaWV3LnNldFNpdG91dChtLmlzU2l0b3V0KCkpO1xufVxuXG4vKipcbiAqIFNlYXQgaW5mbyBtZXNzYWdlLlxuICogQG1ldGhvZCBvbkNvbW11bml0eUNhcmRzTWVzc2FnZVxuICovXG5UYWJsZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ29tbXVuaXR5Q2FyZHNNZXNzYWdlID0gZnVuY3Rpb24obSkge1xuXHR2YXIgaTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgbS5nZXRDYXJkcygpLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNhcmREYXRhID0gbS5nZXRDYXJkcygpW2ldO1xuXHRcdHZhciBjYXJkVmlldyA9IHRoaXMudmlldy5nZXRDb21tdW5pdHlDYXJkcygpW20uZ2V0Rmlyc3RJbmRleCgpICsgaV07XG5cblx0XHRjYXJkVmlldy5zZXRDYXJkRGF0YShjYXJkRGF0YSk7XG5cdH1cbn1cblxuLyoqXG4gKiBQb2NrZXQgY2FyZHMgbWVzc2FnZS5cbiAqIEBtZXRob2Qgb25Qb2NrZXRDYXJkc01lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vblBvY2tldENhcmRzTWVzc2FnZSA9IGZ1bmN0aW9uKG0pIHtcblx0dmFyIHNlYXRWaWV3ID0gdGhpcy52aWV3LmdldFNlYXRWaWV3QnlJbmRleChtLmdldFNlYXRJbmRleCgpKTtcblx0dmFyIGk7XG5cblx0Zm9yIChpID0gMDsgaSA8IG0uZ2V0Q2FyZHMoKS5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjYXJkRGF0YSA9IG0uZ2V0Q2FyZHMoKVtpXTtcblx0XHR2YXIgY2FyZFZpZXcgPSBzZWF0Vmlldy5nZXRQb2NrZXRDYXJkcygpW20uZ2V0Rmlyc3RJbmRleCgpICsgaV07XG5cblx0XHRjYXJkVmlldy5zZXRDYXJkRGF0YShjYXJkRGF0YSk7XG5cdFx0Y2FyZFZpZXcuc2hvdygpO1xuXHR9XG59XG5cbi8qKlxuICogRGVhbGVyIGJ1dHRvbiBtZXNzYWdlLlxuICogQG1ldGhvZCBvbkRlYWxlckJ1dHRvbk1lc3NhZ2VcbiAqL1xuVGFibGVDb250cm9sbGVyLnByb3RvdHlwZS5vbkRlYWxlckJ1dHRvbk1lc3NhZ2UgPSBmdW5jdGlvbihtKSB7XG5cdHZhciBkZWFsZXJCdXR0b25WaWV3ID0gdGhpcy52aWV3LmdldERlYWxlckJ1dHRvblZpZXcoKTtcblx0dGhpcy5tZXNzYWdlU2VxdWVuY2VyLndhaXRGb3IoZGVhbGVyQnV0dG9uVmlldywgXCJhbmltYXRpb25Eb25lXCIpO1xuXHRkZWFsZXJCdXR0b25WaWV3LnNob3cobS5nZXRTZWF0SW5kZXgoKSwgbS5nZXRBbmltYXRlKCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZUNvbnRyb2xsZXI7IiwiTmV0UG9rZXJDbGllbnQgPSByZXF1aXJlKFwiLi9hcHAvTmV0UG9rZXJDbGllbnRcIik7XG4vL3ZhciBuZXRQb2tlckNsaWVudCA9IG5ldyBOZXRQb2tlckNsaWVudCgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgUG9pbnQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvUG9pbnRcIik7XG5cbi8qKlxuICogQ2xpZW50IHJlc291cmNlc1xuICogQGNsYXNzIFJlc291cmNlcy5cbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VzKCkge1xuXHR2YXIgaTtcblxuXHR0aGlzLmNvbXBvbmVudHNUZXh0dXJlID0gbmV3IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJjb21wb25lbnRzLnBuZ1wiKTtcblx0dGhpcy50YWJsZUJhY2tncm91bmQgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoXCJ0YWJsZS5wbmdcIik7XG5cblx0dGhpcy5zZWF0UG9zaXRpb25zID0gW1xuXHRcdFBvaW50KDI4NywgMTE4KSwgUG9pbnQoNDgzLCAxMTIpLCBQb2ludCg2NzYsIDExOCksXG5cdFx0UG9pbnQoODQ0LCAyNDcpLCBQb2ludCg4MTcsIDQxMyksIFBvaW50KDY3NiwgNDkwKSxcblx0XHRQb2ludCg0ODMsIDQ5NSksIFBvaW50KDI4NywgNDkwKSwgUG9pbnQoMTQwLCA0MTMpLFxuXHRcdFBvaW50KDEyMywgMjQ3KVxuXHRdO1xuXG5cdHRoaXMuc2VhdFBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCg0MCwgMTE2LCAxNjAsIDcwKTtcblxuXHR0aGlzLmNvbW11bml0eUNhcmRzUG9zaXRpb24gPSBQb2ludCgyNTUsIDE5MCk7XG5cblx0dGhpcy5jYXJkRnJhbWUgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDQ5OCwgMjU2LCA4NywgMTIyKTtcblx0dGhpcy5jYXJkQmFjayA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoNDAyLCAyNTYsIDg3LCAxMjIpO1xuXG5cdHRoaXMuZGl2aWRlckxpbmUgPSB0aGlzLmdldENvbXBvbmVudHNQYXJ0KDU2OCwgNzcsIDIsIDE3MCk7XG5cblx0dGhpcy5zdWl0U3ltYm9scyA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKVxuXHRcdHRoaXMuc3VpdFN5bWJvbHMucHVzaCh0aGlzLmdldENvbXBvbmVudHNQYXJ0KDI0NiArIGkgKiAyMywgNjcsIDE4LCAxOSkpO1xuXG5cdHRoaXMuZnJhbWVQbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoMzAxLCAyNjIsIDc0LCA3Nik7XG5cdHRoaXMuYmlnQnV0dG9uID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCgzMywgMjk4LCA5NSwgOTQpO1xuXHR0aGlzLmRpYWxvZ0J1dHRvbiA9IHRoaXMuZ2V0Q29tcG9uZW50c1BhcnQoMzgzLCA0NjEsIDgyLCA0Nyk7XG5cdHRoaXMuZGVhbGVyQnV0dG9uID0gdGhpcy5nZXRDb21wb25lbnRzUGFydCgxOTcsIDIzNiwgNDEsIDM1KTtcblxuXHR0aGlzLmRlYWxlckJ1dHRvblBvc2l0aW9ucyA9IFtcblx0XHRQb2ludCgzNDcsIDEzMyksIFBvaW50KDM5NSwgMTMzKSwgUG9pbnQoNTc0LCAxMzMpLFxuXHRcdFBvaW50KDc2MiwgMjY3KSwgUG9pbnQoNzE1LCAzNTgpLCBQb2ludCg1NzQsIDQzNCksXG5cdFx0UG9pbnQoNTM2LCA0MzIpLCBQb2ludCgzNTEsIDQzMiksIFBvaW50KDE5MywgMzYyKSxcblx0XHRQb2ludCgxNjgsIDI2Nilcblx0XTtcbn1cblxuLyoqXG4gKiBHZXQgcGFydCBmcm9tIGNvbXBvbmVudHMgYXRsYXMuXG4gKiBAbWV0aG9kIGdldENvbXBvbmVudHNQYXJ0XG4gKiBAcHJpdmF0ZVxuICovXG5SZXNvdXJjZXMucHJvdG90eXBlLmdldENvbXBvbmVudHNQYXJ0ID0gZnVuY3Rpb24oeCwgeSwgdywgaCkge1xuXHR2YXIgZnJhbWUgPSB7XG5cdFx0eDogeCxcblx0XHR5OiB5LFxuXHRcdHdpZHRoOiB3LFxuXHRcdGhlaWdodDogaFxuXHR9O1xuXG5cdHJldHVybiBuZXcgUElYSS5UZXh0dXJlKHRoaXMuY29tcG9uZW50c1RleHR1cmUsIGZyYW1lKTtcbn1cblxuLyoqXG4gKiBHZXQgc2luZ2xldG9uIGluc3RhbmNlLlxuICogQG1ldGhvZCBnZXRJbnN0YW5jZVxuICovXG5SZXNvdXJjZXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcblx0aWYgKCFSZXNvdXJjZXMuaW5zdGFuY2UpXG5cdFx0UmVzb3VyY2VzLmluc3RhbmNlID0gbmV3IFJlc291cmNlcygpO1xuXG5cdHJldHVybiBSZXNvdXJjZXMuaW5zdGFuY2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VzOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBCdXR0b24gPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvQnV0dG9uXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xuXG4vKipcbiAqIEJpZyBidXR0b24uXG4gKiBAY2xhc3MgQmlnQnV0dG9uXG4gKi9cbmZ1bmN0aW9uIEJpZ0J1dHRvbigpIHtcblx0QnV0dG9uLmNhbGwodGhpcyk7XG5cblx0dGhpcy5iaWdCdXR0b25UZXh0dXJlID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuYmlnQnV0dG9uO1xuXG5cdHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuU3ByaXRlKHRoaXMuYmlnQnV0dG9uVGV4dHVyZSkpO1xuXG5cdHZhciBzdHlsZSA9IHtcblx0XHRmb250OiBcImJvbGQgMThweCBBcmlhbFwiLFxuXHRcdC8vZmlsbDogXCIjMDAwMDAwXCJcblx0fTtcblxuXHR0aGlzLmxhYmVsRmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW2J1dHRvbl1cIiwgc3R5bGUpO1xuXHR0aGlzLmxhYmVsRmllbGQucG9zaXRpb24ueSA9IDMwO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMubGFiZWxGaWVsZCk7XG5cblx0dmFyIHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAxNHB4IEFyaWFsXCJcblx0XHQvL2ZpbGw6IFwiIzAwMDAwMFwiXG5cdH07XG5cblx0dGhpcy52YWx1ZUZpZWxkID0gbmV3IFBJWEkuVGV4dChcIlt2YWx1ZV1cIiwgc3R5bGUpO1xuXHR0aGlzLnZhbHVlRmllbGQucG9zaXRpb24ueSA9IDUwO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMudmFsdWVGaWVsZCk7XG5cblx0dGhpcy5zZXRMYWJlbChcIlRFU1RcIik7XG5cdHRoaXMuc2V0VmFsdWUoMTIzKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChCaWdCdXR0b24sIEJ1dHRvbik7XG5cbi8qKlxuICogU2V0IGxhYmVsIGZvciB0aGUgYnV0dG9uLlxuICogQG1ldGhvZCBzZXRMYWJlbFxuICovXG5CaWdCdXR0b24ucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcblx0dGhpcy5sYWJlbEZpZWxkLnNldFRleHQobGFiZWwpO1xuXHR0aGlzLmxhYmVsRmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cdHRoaXMubGFiZWxGaWVsZC54ID0gdGhpcy5iaWdCdXR0b25UZXh0dXJlLndpZHRoIC8gMiAtIHRoaXMubGFiZWxGaWVsZC53aWR0aCAvIDI7XG59XG5cbi8qKlxuICogU2V0IHZhbHVlLlxuICogQG1ldGhvZCBzZXRWYWx1ZVxuICovXG5CaWdCdXR0b24ucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKCF2YWx1ZSlcblx0XHR0aGlzLnZhbHVlRmllbGQudmlzaWJsZT1mYWxzZTtcblxuXHRlbHNlXG5cdFx0dGhpcy52YWx1ZUZpZWxkLnZpc2libGU9dHJ1ZTtcblxuXHR0aGlzLnZhbHVlRmllbGQuc2V0VGV4dCh2YWx1ZSk7XG5cdHRoaXMudmFsdWVGaWVsZC51cGRhdGVUcmFuc2Zvcm0oKTtcblx0dGhpcy52YWx1ZUZpZWxkLnggPSB0aGlzLmJpZ0J1dHRvblRleHR1cmUud2lkdGggLyAyIC0gdGhpcy52YWx1ZUZpZWxkLndpZHRoIC8gMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCaWdCdXR0b247IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgQnV0dG9uID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0J1dHRvblwiKTtcbnZhciBCaWdCdXR0b24gPSByZXF1aXJlKFwiLi9CaWdCdXR0b25cIik7XG5cbi8qKlxuICogQnV0dG9uc1xuICogQGNsYXNzIEJ1dHRvbnNWaWV3XG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbnNWaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmJ1dHRvbkhvbGRlciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLmJ1dHRvbkhvbGRlcik7XG5cblx0dGhpcy5idXR0b25Ib2xkZXIucG9zaXRpb24ueCA9IDM2Njtcblx0dGhpcy5idXR0b25Ib2xkZXIucG9zaXRpb24ueSA9IDU3NTtcblxuXHR0aGlzLmJ1dHRvbnMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSBuZXcgQmlnQnV0dG9uKCk7XG5cdFx0YnV0dG9uLm9uKEJ1dHRvbi5DTElDSywgdGhpcy5vbkJ1dHRvbkNsaWNrLCB0aGlzKTtcblx0XHRidXR0b24ucG9zaXRpb24ueCA9IGkgKiAxMDU7XG5cdFx0dGhpcy5idXR0b25Ib2xkZXIuYWRkQ2hpbGQoYnV0dG9uKTtcblx0XHR0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pO1xuXHR9XG5cblx0dGhpcy5zZXRCdXR0b25zKFtdKTtcblxuXHR0aGlzLmJ1dHRvbnNEYXRhcyA9IFtdO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKEJ1dHRvbnNWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoQnV0dG9uc1ZpZXcpO1xuXG5CdXR0b25zVmlldy5CVVRUT05fQ0xJQ0sgPSBcImJ1dHRvbkNsaWNrXCI7XG5cbi8qKlxuICogU2V0IGJ1dHRvbiBkYXRhcy5cbiAqIEBtZXRob2Qgc2V0QnV0dG9uc1xuICovXG5CdXR0b25zVmlldy5wcm90b3R5cGUuc2V0QnV0dG9ucyA9IGZ1bmN0aW9uKGJ1dHRvbkRhdGFzKSB7XG5cdHRoaXMuYnV0dG9uRGF0YXMgPSBidXR0b25EYXRhcztcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG5cdFx0aWYgKGkgPj0gYnV0dG9uRGF0YXMubGVuZ3RoKSB7XG5cdFx0XHRidXR0b24udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIGJ1dHRvbkRhdGEgPSBidXR0b25EYXRhc1tpXTtcblxuXHRcdGJ1dHRvbi52aXNpYmxlID0gdHJ1ZTtcblx0XHRidXR0b24uc2V0TGFiZWwoYnV0dG9uRGF0YS5nZXRCdXR0b24oKSk7XG5cdFx0YnV0dG9uLnNldFZhbHVlKGJ1dHRvbkRhdGEuZ2V0VmFsdWUoKSk7XG5cdH1cblxuXHR0aGlzLmJ1dHRvbkhvbGRlci5wb3NpdGlvbi54ID0gMzY2O1xuXG5cdGlmIChidXR0b25EYXRhcy5sZW5ndGggPCAzKVxuXHRcdHRoaXMuYnV0dG9uSG9sZGVyLnBvc2l0aW9uLnggKz0gNDU7XG59XG5cbi8qKlxuICogQnV0dG9uIGNsaWNrLlxuICogQG1ldGhvZCBvbkJ1dHRvbkNsaWNrXG4gKiBAcHJpdmF0ZVxuICovXG5CdXR0b25zVmlldy5wcm90b3R5cGUub25CdXR0b25DbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIGJ1dHRvbkluZGV4ID0gLTE7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmJ1dHRvbnNbaV0udmlzaWJsZSA9IGZhbHNlO1xuXHRcdGlmIChlLnRhcmdldCA9PSB0aGlzLmJ1dHRvbnNbaV0pXG5cdFx0XHRidXR0b25JbmRleCA9IGk7XG5cdH1cblxuXHQvL2NvbnNvbGUubG9nKFwiYnV0dG9uIGNsaWNrOiBcIiArIGJ1dHRvbkluZGV4KTtcblx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbkRhdGFzW2J1dHRvbkluZGV4XTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IEJ1dHRvbnNWaWV3LkJVVFRPTl9DTElDSyxcblx0XHRidXR0b246IGJ1dHRvbkRhdGEuZ2V0QnV0dG9uKCksXG5cdFx0dmFsdWU6IGJ1dHRvbkRhdGEuZ2V0VmFsdWUoKVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b25zVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgUmVzb3VyY2VzID0gcmVxdWlyZShcIi4uL3Jlc291cmNlcy9SZXNvdXJjZXNcIik7XG5cbi8qKlxuICogQSBjYXJkIHZpZXcuXG4gKiBAY2xhc3MgQ2FyZFZpZXdcbiAqL1xuZnVuY3Rpb24gQ2FyZFZpZXcoKSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXHR0aGlzLnRhcmdldFBvc2l0aW9uID0gbnVsbDtcblxuXHR0aGlzLmZyYW1lID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmNhcmRGcmFtZSk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5mcmFtZSk7XG5cblx0dGhpcy5zdWl0ID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLnN1aXRTeW1ib2xzWzBdKTtcblx0dGhpcy5zdWl0LnBvc2l0aW9uLnggPSA4O1xuXHR0aGlzLnN1aXQucG9zaXRpb24ueSA9IDI1O1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuc3VpdCk7XG5cblx0dmFyIHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwiYm9sZCAxNnB4IEFyaWFsXCJcblx0fTtcblxuXHR0aGlzLnZhbHVlRmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW3ZhbF1cIiwgc3R5bGUpO1xuXHR0aGlzLnZhbHVlRmllbGQucG9zaXRpb24ueCA9IDY7XG5cdHRoaXMudmFsdWVGaWVsZC5wb3NpdGlvbi55ID0gNTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnZhbHVlRmllbGQpO1xuXG5cdHRoaXMuYmFjayA9IG5ldyBQSVhJLlNwcml0ZShSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5jYXJkQmFjayk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5iYWNrKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChDYXJkVmlldywgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBTZXQgY2FyZCBkYXRhLlxuICogQG1ldGhvZCBzZXRDYXJkRGF0YVxuICovXG5DYXJkVmlldy5wcm90b3R5cGUuc2V0Q2FyZERhdGEgPSBmdW5jdGlvbihjYXJkRGF0YSkge1xuXHR0aGlzLmNhcmREYXRhID0gY2FyZERhdGE7XG5cblx0aWYgKHRoaXMuY2FyZERhdGEuaXNTaG93bigpKSB7XG5cdFx0dGhpcy5iYWNrLnZpc2libGUgPSBmYWxzZTtcblx0XHR0aGlzLmZyYW1lLnZpc2libGUgPSB0cnVlO1xuXG5cdFx0dGhpcy52YWx1ZUZpZWxkLnN0eWxlLmZpbGwgPSB0aGlzLmNhcmREYXRhLmdldENvbG9yKCk7XG5cblx0XHR0aGlzLnZhbHVlRmllbGQuc2V0VGV4dCh0aGlzLmNhcmREYXRhLmdldENhcmRWYWx1ZVN0cmluZygpKTtcblx0XHR0aGlzLnZhbHVlRmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cdFx0dGhpcy52YWx1ZUZpZWxkLnBvc2l0aW9uLnggPSAxNyAtIHRoaXMudmFsdWVGaWVsZC5jYW52YXMud2lkdGggLyAyO1xuXG5cdFx0dGhpcy5zdWl0LnNldFRleHR1cmUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuc3VpdFN5bWJvbHNbdGhpcy5jYXJkRGF0YS5nZXRTdWl0SW5kZXgoKV0pO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuYmFjay52aXNpYmxlID0gdHJ1ZTtcblx0XHR0aGlzLmZyYW1lLnZpc2libGUgPSBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIFNldCBjYXJkIGRhdGEuXG4gKiBAbWV0aG9kIHNldENhcmREYXRhXG4gKi9cbkNhcmRWaWV3LnByb3RvdHlwZS5zZXRUYXJnZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHBvaW50KSB7XG5cdHRoaXMudGFyZ2V0UG9zaXRpb24gPSBwb2ludDtcblxuXHR0aGlzLnBvc2l0aW9uLnggPSBwb2ludC54O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSBwb2ludC55O1xufVxuXG4vKipcbiAqIEhpZGUuXG4gKiBAbWV0aG9kIGhpZGVcbiAqL1xuQ2FyZFZpZXcucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cbi8qKlxuICogU2hvdy5cbiAqIEBtZXRob2Qgc2hvd1xuICovXG5DYXJkVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRWaWV3OyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBOaW5lU2xpY2UgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvTmluZVNsaWNlXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xuXG4vKipcbiAqIENoYXQgdmlldy5cbiAqIEBjbGFzcyBDaGF0Vmlld1xuICovXG5mdW5jdGlvbiBDaGF0VmlldygpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dmFyIHM7XG5cblx0cyA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZnJhbWVQbGF0ZSwgMTApO1xuXHRzLnBvc2l0aW9uLnggPSAxMDtcblx0cy5wb3NpdGlvbi55ID0gNTQwO1xuXHRzLnNldExvY2FsU2l6ZSgzMzAsIDEzMCk7XG5cdHRoaXMuYWRkQ2hpbGQocyk7XG5cblx0cyA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZnJhbWVQbGF0ZSwgMTApO1xuXHRzLnBvc2l0aW9uLnggPSAxMDtcblx0cy5wb3NpdGlvbi55ID0gNjc1O1xuXHRzLnNldExvY2FsU2l6ZSgzMzAsIDM1KTtcblx0dGhpcy5hZGRDaGlsZChzKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChDaGF0VmlldywgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0VmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIFRXRUVOID0gcmVxdWlyZShcInR3ZWVuLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgUmVzb3VyY2VzID0gcmVxdWlyZShcIi4uL3Jlc291cmNlcy9SZXNvdXJjZXNcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBEaWFsb2cgdmlldy5cbiAqIEBjbGFzcyBEZWFsZXJCdXR0b25WaWV3XG4gKi9cbmZ1bmN0aW9uIERlYWxlckJ1dHRvblZpZXcoKSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG5cblx0dmFyIGRlYWxlckJ1dHRvblRleHR1cmUgPSBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5kZWFsZXJCdXR0b247XG5cdHRoaXMuc3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKGRlYWxlckJ1dHRvblRleHR1cmUpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuc3ByaXRlKTtcblx0dGhpcy5oaWRlKCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoRGVhbGVyQnV0dG9uVmlldywgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KERlYWxlckJ1dHRvblZpZXcpO1xuXG4vKipcbiAqIFNldCBzZWF0IGluZGV4XG4gKiBAbWV0aG9kIHNldFNlYXRJbmRleFxuICovXG5EZWFsZXJCdXR0b25WaWV3LnByb3RvdHlwZS5zZXRTZWF0SW5kZXggPSBmdW5jdGlvbihzZWF0SW5kZXgpIHtcblx0dGhpcy5wb3NpdGlvbi54ID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZGVhbGVyQnV0dG9uUG9zaXRpb25zW3NlYXRJbmRleF0ueDtcblx0dGhpcy5wb3NpdGlvbi55ID0gUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZGVhbGVyQnV0dG9uUG9zaXRpb25zW3NlYXRJbmRleF0ueTtcblx0dGhpcy5kaXNwYXRjaEV2ZW50KFwiYW5pbWF0aW9uRG9uZVwiLCB0aGlzKTtcbn07XG5cbi8qKlxuICogQW5pbWF0ZSB0byBzZWF0IGluZGV4LlxuICogQG1ldGhvZCBhbmltYXRlVG9TZWF0SW5kZXhcbiAqL1xuRGVhbGVyQnV0dG9uVmlldy5wcm90b3R5cGUuYW5pbWF0ZVRvU2VhdEluZGV4ID0gZnVuY3Rpb24oc2VhdEluZGV4KSB7XG5cdGlmICghdGhpcy52aXNpYmxlKSB7XG5cdFx0dGhpcy5zZXRTZWF0SW5kZXgoc2VhdEluZGV4KTtcblx0XHQvLyB0b2RvIGRpc3BhdGNoIGV2ZW50IHRoYXQgaXQncyBjb21wbGV0ZT9cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQoXCJhbmltYXRpb25Eb25lXCIsIHRoaXMpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciB0aGlzUHRyID0gdGhpcztcblx0dmFyIHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKCB0aGlzLnBvc2l0aW9uIClcbiAgICAgICAgICAgIC50byggeyBcblx0XHRcdFx0eDogUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZGVhbGVyQnV0dG9uUG9zaXRpb25zW3NlYXRJbmRleF0ueCwgXG5cdFx0XHRcdHk6IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmRlYWxlckJ1dHRvblBvc2l0aW9uc1tzZWF0SW5kZXhdLnlcbiAgICAgICAgICAgICB9LCA1MDAgKS8qXG4gICAgICAgICAgICAuZWFzaW5nKCBUV0VFTi5FYXNpbmcuRWxhc3RpYy5Jbk91dCApKi9cbiAgICAgICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKClcblx0XHRcdHtcblx0XHRcdFx0dGhpc1B0ci5kaXNwYXRjaEV2ZW50KFwiYW5pbWF0aW9uRG9uZVwiLCB0aGlzUHRyKTtcblx0XHRcdH0pXG4gICAgICAgICAgICAuc3RhcnQoKTtcbn07XG5cbi8qKlxuICogSGlkZS5cbiAqIEBtZXRob2QgaGlkZVxuICovXG5EZWFsZXJCdXR0b25WaWV3LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFNob3cuXG4gKiBAbWV0aG9kIHNob3dcbiAqL1xuRGVhbGVyQnV0dG9uVmlldy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKHNlYXRJbmRleCwgYW5pbWF0ZSkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXHRpZihhbmltYXRlKSB7XG5cdFx0dGhpcy5hbmltYXRlVG9TZWF0SW5kZXgoc2VhdEluZGV4KTtcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLnNldFNlYXRJbmRleChzZWF0SW5kZXgpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVhbGVyQnV0dG9uVmlldzsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgQnV0dG9uID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0J1dHRvblwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcblxuLyoqXG4gKiBEaWFsb2cgYnV0dG9uLlxuICogQGNsYXNzIERpYWxvZ0J1dHRvblxuICovXG5mdW5jdGlvbiBEaWFsb2dCdXR0b24oKSB7XG5cdEJ1dHRvbi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuYnV0dG9uVGV4dHVyZSA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmRpYWxvZ0J1dHRvbjtcblx0dGhpcy5hZGRDaGlsZChuZXcgUElYSS5TcHJpdGUodGhpcy5idXR0b25UZXh0dXJlKSk7XG5cblx0dmFyIHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwibm9ybWFsIDE0cHggQXJpYWxcIixcblx0XHRmaWxsOiBcIiNmZmZmZmZcIlxuXHR9O1xuXG5cdHRoaXMudGV4dEZpZWxkID0gbmV3IFBJWEkuVGV4dChcIlt0ZXN0XVwiLCBzdHlsZSk7XG5cdHRoaXMudGV4dEZpZWxkLnBvc2l0aW9uLnkgPSAxNTtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG5cblx0dGhpcy5zZXRUZXh0KFwiQlROXCIpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKERpYWxvZ0J1dHRvbiwgQnV0dG9uKTtcblxuLyoqXG4gKiBTZXQgdGV4dCBmb3IgdGhlIGJ1dHRvbi5cbiAqIEBtZXRob2Qgc2V0VGV4dFxuICovXG5EaWFsb2dCdXR0b24ucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbih0ZXh0KSB7XG5cdHRoaXMudGV4dEZpZWxkLnNldFRleHQodGV4dCk7XG5cdHRoaXMudGV4dEZpZWxkLnVwZGF0ZVRyYW5zZm9ybSgpO1xuXHR0aGlzLnRleHRGaWVsZC54ID0gdGhpcy5idXR0b25UZXh0dXJlLndpZHRoIC8gMiAtIHRoaXMudGV4dEZpZWxkLndpZHRoIC8gMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEaWFsb2dCdXR0b247IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIE5pbmVTbGljZSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9OaW5lU2xpY2VcIik7XG52YXIgUmVzb3VyY2VzID0gcmVxdWlyZShcIi4uL3Jlc291cmNlcy9SZXNvdXJjZXNcIik7XG52YXIgRGlhbG9nQnV0dG9uID0gcmVxdWlyZShcIi4vRGlhbG9nQnV0dG9uXCIpO1xudmFyIEJ1dHRvbkRhdGEgPSByZXF1aXJlKFwiLi4vLi4vcHJvdG8vZGF0YS9CdXR0b25EYXRhXCIpO1xuXG4vKipcbiAqIERpYWxvZyB2aWV3LlxuICogQGNsYXNzIERpYWxvZ1ZpZXdcbiAqL1xuZnVuY3Rpb24gRGlhbG9nVmlldygpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGNvdmVyID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0Y292ZXIuYmVnaW5GaWxsKDB4MDAwMDAwLCAuNSk7XG5cdGNvdmVyLmRyYXdSZWN0KDAsIDAsIDk2MCwgNzIwKTtcblx0Y292ZXIuZW5kRmlsbCgpO1xuXHRjb3Zlci5pbnRlcmFjdGl2ZSA9IHRydWU7XG5cdC8vY292ZXIuYnV0dG9uTW9kZSA9IHRydWU7XG5cdGNvdmVyLmhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgOTYwLCA3MjApO1xuXHR0aGlzLmFkZENoaWxkKGNvdmVyKTtcblxuXHR2YXIgYiA9IG5ldyBOaW5lU2xpY2UoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZnJhbWVQbGF0ZSwgMTApO1xuXHRiLnNldExvY2FsU2l6ZSg0ODAsIDI3MCk7XG5cdGIucG9zaXRpb24ueCA9IDQ4MCAtIDQ4MCAvIDI7XG5cdGIucG9zaXRpb24ueSA9IDM2MCAtIDI3MCAvIDI7XG5cdHRoaXMuYWRkQ2hpbGQoYik7XG5cblx0c3R5bGUgPSB7XG5cdFx0Zm9udDogXCJub3JtYWwgMTRweCBBcmlhbFwiXG5cdH07XG5cblx0dGhpcy50ZXh0RmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW3RleHRdXCIsIHN0eWxlKTtcblx0dGhpcy50ZXh0RmllbGQucG9zaXRpb24ueCA9IGIucG9zaXRpb24ueCArIDIwO1xuXHR0aGlzLnRleHRGaWVsZC5wb3NpdGlvbi55ID0gYi5wb3NpdGlvbi55ICsgMjA7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0RmllbGQpO1xuXG5cdHRoaXMuYnV0dG9uc0hvbGRlciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dGhpcy5idXR0b25zSG9sZGVyLnBvc2l0aW9uLnkgPSA0MzA7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5idXR0b25zSG9sZGVyKTtcblx0dGhpcy5idXR0b25zID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcblx0XHR2YXIgYiA9IG5ldyBEaWFsb2dCdXR0b24oKTtcblxuXHRcdGIucG9zaXRpb24ueCA9IGkgKiA5MDtcblx0XHR0aGlzLmJ1dHRvbnNIb2xkZXIuYWRkQ2hpbGQoYik7XG5cdFx0dGhpcy5idXR0b25zLnB1c2goYik7XG5cdH1cblxuXHR0aGlzLmhpZGUoKTtcblxuXHR2YXIgaW5wdXQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuXHRpbnB1dC50eXBlPVwidGV4dFwiO1xuXHRpbnB1dC5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XG5cdGlucHV0LnN0eWxlLnpJbmRleD0xO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChEaWFsb2dWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuXG4vKipcbiAqIEhpZGUuXG4gKiBAbWV0aG9kIGhpZGVcbiAqL1xuRGlhbG9nVmlldy5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnZpc2libGUgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBTaG93LlxuICogQG1ldGhvZCBzaG93XG4gKi9cbkRpYWxvZ1ZpZXcucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbih0ZXh0LCBidXR0b25JZHMsIGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xuXG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoaSA8IGJ1dHRvbklkcy5sZW5ndGgpIHtcblx0XHRcdHZhciBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaV1cblx0XHRcdGJ1dHRvbi5zZXRUZXh0KEJ1dHRvbkRhdGEuZ2V0QnV0dG9uU3RyaW5nRm9ySWQoYnV0dG9uSWRzW2ldKSk7XG5cdFx0XHRidXR0b24udmlzaWJsZSA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYnV0dG9uc1tpXS52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5idXR0b25zSG9sZGVyLnggPSA0ODAgLSBidXR0b25JZHMubGVuZ3RoICogOTAgLyAyO1xuXHR0aGlzLnRleHRGaWVsZC5zZXRUZXh0KHRleHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZ1ZpZXc7IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIEdyYWRpZW50ID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0dyYWRpZW50XCIpO1xuXG4vKipcbiAqIExvYWRpbmcgc2NyZWVuLlxuICogQGNsYXNzIExvYWRpbmdTY3JlZW5cbiAqL1xuZnVuY3Rpb24gTG9hZGluZ1NjcmVlbigpIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dmFyIGdyYWRpZW50ID0gbmV3IEdyYWRpZW50KCk7XG5cdGdyYWRpZW50LnNldFNpemUoMTAwLCAxMDApO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCIjZmZmZmZmXCIpO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCIjYzBjMGMwXCIpO1xuXG5cdHZhciBzID0gZ3JhZGllbnQuY3JlYXRlU3ByaXRlKCk7XG5cdHMud2lkdGggPSA5NjA7XG5cdHMuaGVpZ2h0ID0gNzIwO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xuXG5cdHZhciBzdHlsZSA9IHtcblx0XHRmb250OiBcImJvbGQgMjBweCBBcmlhbFwiLFxuXHRcdGZpbGw6IFwiIzgwODA4MFwiXG5cdH07XG5cblx0dGhpcy50ZXh0RmllbGQgPSBuZXcgUElYSS5UZXh0KFwiW3RleHRdXCIsIHN0eWxlKTtcblx0dGhpcy50ZXh0RmllbGQucG9zaXRpb24ueCA9IDk2MCAvIDI7XG5cdHRoaXMudGV4dEZpZWxkLnBvc2l0aW9uLnkgPSA3MjAgLyAyIC0gdGhpcy50ZXh0RmllbGQuaGVpZ2h0IC8gMjtcblx0dGhpcy5hZGRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoTG9hZGluZ1NjcmVlbiwgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBTaG93LlxuICogQG1ldGhvZCBzaG93XG4gKi9cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdHRoaXMudGV4dEZpZWxkLnNldFRleHQobWVzc2FnZSk7XG5cdHRoaXMudGV4dEZpZWxkLnVwZGF0ZVRyYW5zZm9ybSgpO1xuXHR0aGlzLnRleHRGaWVsZC54ID0gOTYwIC8gMiAtIHRoaXMudGV4dEZpZWxkLndpZHRoIC8gMjtcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBIaWRlLlxuICogQG1ldGhvZCBoaWRlXG4gKi9cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1NjcmVlbjsiLCJ2YXIgUElYSSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBSZXNvdXJjZXMgPSByZXF1aXJlKFwiLi4vcmVzb3VyY2VzL1Jlc291cmNlc1wiKTtcbnZhciBTZWF0VmlldyA9IHJlcXVpcmUoXCIuL1NlYXRWaWV3XCIpO1xudmFyIENhcmRWaWV3ID0gcmVxdWlyZShcIi4vQ2FyZFZpZXdcIik7XG52YXIgQ2hhdFZpZXcgPSByZXF1aXJlKFwiLi9DaGF0Vmlld1wiKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9Qb2ludFwiKTtcbnZhciBHcmFkaWVudCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9HcmFkaWVudFwiKTtcbnZhciBCdXR0b25zVmlldyA9IHJlcXVpcmUoXCIuL0J1dHRvbnNWaWV3XCIpO1xudmFyIERpYWxvZ1ZpZXcgPSByZXF1aXJlKFwiLi9EaWFsb2dWaWV3XCIpO1xudmFyIERlYWxlckJ1dHRvblZpZXcgPSByZXF1aXJlKFwiLi9EZWFsZXJCdXR0b25WaWV3XCIpO1xuXG4vKipcbiAqIE5ldCBwb2tlciBjbGllbnQgdmlldy5cbiAqIEBjbGFzcyBOZXRQb2tlckNsaWVudFZpZXdcbiAqL1xuZnVuY3Rpb24gTmV0UG9rZXJDbGllbnRWaWV3KCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnNldHVwQmFja2dyb3VuZCgpO1xuXG5cdHRoaXMudGFibGVDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy50YWJsZUNvbnRhaW5lcik7XG5cblx0dGhpcy50YWJsZUNvbnRhaW5lci5hZGRDaGlsZChSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS50YWJsZUJhY2tncm91bmQpO1xuXG5cdHRoaXMuc2V0dXBTZWF0cygpO1xuXHR0aGlzLnNldHVwQ29tbXVuaXR5Q2FyZHMoKTtcblxuXHR0aGlzLmNoYXRWaWV3ID0gbmV3IENoYXRWaWV3KCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5jaGF0Vmlldyk7XG5cblx0dGhpcy5idXR0b25zVmlldyA9IG5ldyBCdXR0b25zVmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuYnV0dG9uc1ZpZXcpO1xuXG5cdHRoaXMuZGlhbG9nVmlldyA9IG5ldyBEaWFsb2dWaWV3KCk7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5kaWFsb2dWaWV3KTtcblxuXHR0aGlzLmRlYWxlckJ1dHRvblZpZXcgPSBuZXcgRGVhbGVyQnV0dG9uVmlldygpO1xuXHR0aGlzLmFkZENoaWxkKHRoaXMuZGVhbGVyQnV0dG9uVmlldyk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoTmV0UG9rZXJDbGllbnRWaWV3LCBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuRXZlbnREaXNwYXRjaGVyLmluaXQoTmV0UG9rZXJDbGllbnRWaWV3KTtcblxuTmV0UG9rZXJDbGllbnRWaWV3LlNFQVRfQ0xJQ0sgPSBcInNlYXRDbGlja1wiO1xuXG4vKipcbiAqIFNldHVwIGJhY2tncm91bmQuXG4gKiBAbWV0aG9kIHNldHVwQmFja2dyb3VuZFxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLnNldHVwQmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZ3JhZGllbnQgPSBuZXcgR3JhZGllbnQoKTtcblx0Z3JhZGllbnQuc2V0U2l6ZSgxMDAsIDEwMCk7XG5cdGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBcIiM2MDYwNjBcIik7XG5cdGdyYWRpZW50LmFkZENvbG9yU3RvcCguNSwgXCIjYTBhMGEwXCIpO1xuXHRncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCIjOTA5MDkwXCIpO1xuXG5cdHZhciBzID0gZ3JhZGllbnQuY3JlYXRlU3ByaXRlKCk7XG5cdHMud2lkdGggPSA5NjA7XG5cdHMuaGVpZ2h0ID0gNzIwO1xuXHR0aGlzLmFkZENoaWxkKHMpO1xuXG5cdHZhciBzID0gbmV3IFBJWEkuU3ByaXRlKFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmRpdmlkZXJMaW5lKTtcblx0cy54ID0gMzQ1O1xuXHRzLnkgPSA1NDA7XG5cdHRoaXMuYWRkQ2hpbGQocyk7XG5cblx0dmFyIHMgPSBuZXcgUElYSS5TcHJpdGUoUmVzb3VyY2VzLmdldEluc3RhbmNlKCkuZGl2aWRlckxpbmUpO1xuXHRzLnggPSA2OTM7XG5cdHMueSA9IDU0MDtcblx0dGhpcy5hZGRDaGlsZChzKTtcbn1cblxuLyoqXG4gKiBTZXR1cCBzZWF0cy5cbiAqIEBtZXRob2Qgc2VydXBTZWF0c1xuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLnNldHVwU2VhdHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGksIGo7XG5cdHZhciBwb2NrZXRDYXJkcztcblxuXHR0aGlzLnNlYXRWaWV3cyA9IFtdO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBSZXNvdXJjZXMuZ2V0SW5zdGFuY2UoKS5zZWF0UG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIHNlYXRWaWV3ID0gbmV3IFNlYXRWaWV3KGkpO1xuXHRcdHZhciBwID0gc2VhdFZpZXcucG9zaXRpb247XG5cblx0XHRmb3IgKGogPSAwOyBqIDwgMjsgaisrKSB7XG5cdFx0XHR2YXIgYyA9IG5ldyBDYXJkVmlldygpO1xuXHRcdFx0Yy5oaWRlKCk7XG5cdFx0XHRjLnNldFRhcmdldFBvc2l0aW9uKFBvaW50KHAueCArIGogKiAzMCAtIDYwLCBwLnkgLSAxMDApKTtcblx0XHRcdHRoaXMudGFibGVDb250YWluZXIuYWRkQ2hpbGQoYyk7XG5cdFx0XHRzZWF0Vmlldy5hZGRQb2NrZXRDYXJkKGMpO1xuXHRcdFx0c2VhdFZpZXcub24oXCJjbGlja1wiLCB0aGlzLm9uU2VhdENsaWNrLCB0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLnRhYmxlQ29udGFpbmVyLmFkZENoaWxkKHNlYXRWaWV3KTtcblx0XHR0aGlzLnNlYXRWaWV3cy5wdXNoKHNlYXRWaWV3KTtcblx0fVxufVxuXG4vKipcbiAqIFNlYXQgY2xpY2suXG4gKiBAbWV0aG9kIG9uU2VhdENsaWNrXG4gKiBAcHJpdmF0ZVxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLm9uU2VhdENsaWNrID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgc2VhdEluZGV4ID0gLTE7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlYXRWaWV3cy5sZW5ndGg7IGkrKylcblx0XHRpZiAoZS50YXJnZXQgPT0gdGhpcy5zZWF0Vmlld3NbaV0pXG5cdFx0XHRzZWF0SW5kZXggPSBpO1xuXG5cdGNvbnNvbGUubG9nKFwic2VhdCBjbGljazogXCIgKyBzZWF0SW5kZXgpO1xuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IE5ldFBva2VyQ2xpZW50Vmlldy5TRUFUX0NMSUNLLFxuXHRcdHNlYXRJbmRleDogc2VhdEluZGV4XG5cdH0pO1xufVxuXG4vKipcbiAqIFNldHVwIGNvbW11bml0eSBjYXJkcy5cbiAqIEBtZXRob2Qgc2V0dXBDb21tdW5pdHlDYXJkc1xuICogQHByaXZhdGVcbiAqL1xuTmV0UG9rZXJDbGllbnRWaWV3LnByb3RvdHlwZS5zZXR1cENvbW11bml0eUNhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29tbXVuaXR5Q2FyZHMgPSBbXTtcblxuXHR2YXIgcCA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLmNvbW11bml0eUNhcmRzUG9zaXRpb247XG5cblx0Zm9yIChpID0gMDsgaSA8IDU7IGkrKykge1xuXHRcdHZhciBjYXJkVmlldyA9IG5ldyBDYXJkVmlldygpO1xuXHRcdGNhcmRWaWV3LmhpZGUoKTtcblx0XHRjYXJkVmlldy5zZXRUYXJnZXRQb3NpdGlvbihQb2ludChwLnggKyBpICogOTAsIHAueSkpO1xuXG5cdFx0dGhpcy5jb21tdW5pdHlDYXJkcy5wdXNoKGNhcmRWaWV3KTtcblx0XHR0aGlzLnRhYmxlQ29udGFpbmVyLmFkZENoaWxkKGNhcmRWaWV3KTtcblx0fVxufVxuXG4vKipcbiAqIEdldCBzZWF0IHZpZXcgYnkgaW5kZXguXG4gKiBAbWV0aG9kIGdldFNlYXRWaWV3QnlJbmRleFxuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldFNlYXRWaWV3QnlJbmRleCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdHJldHVybiB0aGlzLnNlYXRWaWV3c1tpbmRleF07XG59XG5cbi8qKlxuICogR2V0IHNlYXQgdmlldyBieSBpbmRleC5cbiAqIEBtZXRob2QgZ2V0U2VhdFZpZXdCeUluZGV4XG4gKi9cbk5ldFBva2VyQ2xpZW50Vmlldy5wcm90b3R5cGUuZ2V0Q29tbXVuaXR5Q2FyZHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29tbXVuaXR5Q2FyZHM7XG59XG5cbi8qKlxuICogR2V0IGJ1dHRvbnMgdmlldy5cbiAqIEBtZXRob2QgZ2V0U2VhdFZpZXdCeUluZGV4XG4gKi9cbk5ldFBva2VyQ2xpZW50Vmlldy5wcm90b3R5cGUuZ2V0QnV0dG9uc1ZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYnV0dG9uc1ZpZXc7XG59XG5cbi8qKlxuICogR2V0IGRpYWxvZyB2aWV3LlxuICogQG1ldGhvZCBnZXREaWFsb2dWaWV3XG4gKi9cbk5ldFBva2VyQ2xpZW50Vmlldy5wcm90b3R5cGUuZ2V0RGlhbG9nVmlldyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5kaWFsb2dWaWV3O1xufVxuXG4vKipcbiAqIEdldCBkaWFsb2cgdmlldy5cbiAqIEBtZXRob2QgZ2V0RGlhbG9nVmlld1xuICovXG5OZXRQb2tlckNsaWVudFZpZXcucHJvdG90eXBlLmdldERlYWxlckJ1dHRvblZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZGVhbGVyQnV0dG9uVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXRQb2tlckNsaWVudFZpZXc7IiwidmFyIFBJWEkgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xudmFyIFJlc291cmNlcyA9IHJlcXVpcmUoXCIuLi9yZXNvdXJjZXMvUmVzb3VyY2VzXCIpO1xudmFyIEJ1dHRvbj1yZXF1aXJlKFwiLi4vLi4vdXRpbHMvQnV0dG9uXCIpO1xuXG4vKipcbiAqIEEgc2VhdCB2aWV3LlxuICogQGNsYXNzIFNlYXRWaWV3XG4gKi9cbmZ1bmN0aW9uIFNlYXRWaWV3KHNlYXRJbmRleCkge1xuXHRCdXR0b24uY2FsbCh0aGlzKTtcblxuXHR0aGlzLnBvY2tldENhcmRzID0gW107XG5cdHRoaXMuc2VhdEluZGV4ID0gc2VhdEluZGV4O1xuXG5cdHZhciBzZWF0VGV4dHVyZSA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLnNlYXRQbGF0ZTtcblx0dmFyIHNlYXRTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoc2VhdFRleHR1cmUpO1xuXG5cdHNlYXRTcHJpdGUucG9zaXRpb24ueCA9IC1zZWF0VGV4dHVyZS53aWR0aCAvIDI7XG5cdHNlYXRTcHJpdGUucG9zaXRpb24ueSA9IC1zZWF0VGV4dHVyZS5oZWlnaHQgLyAyO1xuXG5cdHRoaXMuYWRkQ2hpbGQoc2VhdFNwcml0ZSk7XG5cblx0dmFyIHBvcyA9IFJlc291cmNlcy5nZXRJbnN0YW5jZSgpLnNlYXRQb3NpdGlvbnNbdGhpcy5zZWF0SW5kZXhdO1xuXG5cdHRoaXMucG9zaXRpb24ueCA9IHBvcy54O1xuXHR0aGlzLnBvc2l0aW9uLnkgPSBwb3MueTtcblxuXHR2YXIgc3R5bGU7XG5cblx0c3R5bGUgPSB7XG5cdFx0Zm9udDogXCJib2xkIDIwcHggQXJpYWxcIlxuXHR9O1xuXG5cdHRoaXMubmFtZUZpZWxkID0gbmV3IFBJWEkuVGV4dChcIltuYW1lXVwiLCBzdHlsZSk7XG5cdHRoaXMubmFtZUZpZWxkLnBvc2l0aW9uLnkgPSAtMjA7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5uYW1lRmllbGQpO1xuXG5cdHN0eWxlID0ge1xuXHRcdGZvbnQ6IFwibm9ybWFsIDEycHggQXJpYWxcIlxuXHR9O1xuXG5cdHRoaXMuY2hpcHNGaWVsZCA9IG5ldyBQSVhJLlRleHQoXCJbbmFtZV1cIiwgc3R5bGUpO1xuXHR0aGlzLmNoaXBzRmllbGQucG9zaXRpb24ueSA9IDU7XG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5jaGlwc0ZpZWxkKTtcblxuXHR0aGlzLnNldE5hbWUoXCJcIik7XG5cdHRoaXMuc2V0Q2hpcHMoXCJcIik7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoU2VhdFZpZXcsIEJ1dHRvbik7XG5cbi8qKlxuICogU2V0IG5hbWUuXG4gKiBAbWV0aG9kIHNldE5hbWVcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLnNldE5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHRoaXMubmFtZUZpZWxkLnNldFRleHQobmFtZSk7XG5cdHRoaXMubmFtZUZpZWxkLnVwZGF0ZVRyYW5zZm9ybSgpO1xuXG5cdHRoaXMubmFtZUZpZWxkLnBvc2l0aW9uLnggPSAtdGhpcy5uYW1lRmllbGQuY2FudmFzLndpZHRoIC8gMjtcbn1cblxuLyoqXG4gKiBTZXQgbmFtZS5cbiAqIEBtZXRob2Qgc2V0Q2hpcHNcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLnNldENoaXBzID0gZnVuY3Rpb24oY2hpcHMpIHtcblx0dGhpcy5jaGlwc0ZpZWxkLnNldFRleHQoY2hpcHMpO1xuXHR0aGlzLmNoaXBzRmllbGQudXBkYXRlVHJhbnNmb3JtKCk7XG5cblx0dGhpcy5jaGlwc0ZpZWxkLnBvc2l0aW9uLnggPSAtdGhpcy5jaGlwc0ZpZWxkLmNhbnZhcy53aWR0aCAvIDI7XG59XG5cbi8qKlxuICogU2V0IHNpdG91dC5cbiAqIEBtZXRob2Qgc2V0U2l0b3V0XG4gKi9cblNlYXRWaWV3LnByb3RvdHlwZS5zZXRTaXRvdXQgPSBmdW5jdGlvbihzaXRvdXQpIHtcblx0aWYgKHNpdG91dClcblx0XHR0aGlzLmFscGhhID0gLjU7XG5cblx0ZWxzZVxuXHRcdHRoaXMuYWxwaGEgPSAxO1xufVxuXG4vKipcbiAqIFNldCBzaXRvdXQuXG4gKiBAbWV0aG9kIHNldEFjdGl2ZVxuICovXG5TZWF0Vmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdHRoaXMudmlzaWJsZSA9IGFjdGl2ZTtcbn1cblxuLyoqXG4gKiBBZGQgcG9ja2V0IGNhcmQuXG4gKiBAbWV0aG9kIGFkZFBvY2tldENhcmRcbiAqL1xuU2VhdFZpZXcucHJvdG90eXBlLmFkZFBvY2tldENhcmQgPSBmdW5jdGlvbihjYXJkVmlldykge1xuXHR0aGlzLnBvY2tldENhcmRzLnB1c2goY2FyZFZpZXcpO1xufVxuXG4vKipcbiAqIEdldCBwb2NrZXQgY2FyZHMuXG4gKiBAbWV0aG9kIGdldFBvY2tldENhcmRzXG4gKi9cblNlYXRWaWV3LnByb3RvdHlwZS5nZXRQb2NrZXRDYXJkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5wb2NrZXRDYXJkcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWF0VmlldzsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4uL3V0aWxzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbHMvRnVuY3Rpb25VdGlsXCIpO1xuXG52YXIgSW5pdE1lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9Jbml0TWVzc2FnZVwiKTtcbnZhciBTdGF0ZUNvbXBsZXRlTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL1N0YXRlQ29tcGxldGVNZXNzYWdlXCIpO1xudmFyIFNlYXRJbmZvTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL1NlYXRJbmZvTWVzc2FnZVwiKTtcbnZhciBDb21tdW5pdHlDYXJkc01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9Db21tdW5pdHlDYXJkc01lc3NhZ2VcIik7XG52YXIgUG9ja2V0Q2FyZHNNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvUG9ja2V0Q2FyZHNNZXNzYWdlXCIpO1xudmFyIFNlYXRDbGlja01lc3NhZ2UgPSByZXF1aXJlKFwiLi9tZXNzYWdlcy9TZWF0Q2xpY2tNZXNzYWdlXCIpO1xudmFyIFNob3dEaWFsb2dNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvU2hvd0RpYWxvZ01lc3NhZ2VcIik7XG52YXIgQnV0dG9uQ2xpY2tNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvQnV0dG9uQ2xpY2tNZXNzYWdlXCIpO1xudmFyIEJ1dHRvbnNNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvQnV0dG9uc01lc3NhZ2VcIik7XG52YXIgRGVsYXlNZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvRGVsYXlNZXNzYWdlXCIpO1xudmFyIENsZWFyTWVzc2FnZSA9IHJlcXVpcmUoXCIuL21lc3NhZ2VzL0NsZWFyTWVzc2FnZVwiKTtcbnZhciBEZWFsZXJCdXR0b25NZXNzYWdlID0gcmVxdWlyZShcIi4vbWVzc2FnZXMvRGVhbGVyQnV0dG9uTWVzc2FnZVwiKTtcblxuLyoqXG4gKiBAY2xhc3MgUHJvdG9Db25uZWN0aW9uXG4gKiBBIHByb3RvY29sIGNvbm5lY3Rpb24gd2l0aCBhbiB1bmRlcmx5aW5nIGNvbm5lY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIFByb3RvQ29ubmVjdGlvbihjb25uZWN0aW9uKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG5cdHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG5cdHRoaXMuY29ubmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCB0aGlzLm9uQ29ubmVjdGlvbk1lc3NhZ2UsIHRoaXMpO1xuXHR0aGlzLmNvbm5lY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIHRoaXMub25Db25uZWN0aW9uQ2xvc2UsIHRoaXMpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKFByb3RvQ29ubmVjdGlvbiwgRXZlbnREaXNwYXRjaGVyKTtcblxuUHJvdG9Db25uZWN0aW9uLkNMT1NFID0gXCJjbG9zZVwiO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0UgPSBcIm1lc3NhZ2VcIjtcblxuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVMgPSB7fTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0luaXRNZXNzYWdlLlRZUEVdID0gSW5pdE1lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tTdGF0ZUNvbXBsZXRlTWVzc2FnZS5UWVBFXSA9IFN0YXRlQ29tcGxldGVNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbU2VhdEluZm9NZXNzYWdlLlRZUEVdID0gU2VhdEluZm9NZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLlRZUEVdID0gQ29tbXVuaXR5Q2FyZHNNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbUG9ja2V0Q2FyZHNNZXNzYWdlLlRZUEVdID0gUG9ja2V0Q2FyZHNNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbU2VhdENsaWNrTWVzc2FnZS5UWVBFXSA9IFNlYXRDbGlja01lc3NhZ2U7XG5Qcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1tTaG93RGlhbG9nTWVzc2FnZS5UWVBFXSA9IFNob3dEaWFsb2dNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbQnV0dG9uQ2xpY2tNZXNzYWdlLlRZUEVdID0gQnV0dG9uQ2xpY2tNZXNzYWdlO1xuUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVNbQnV0dG9uc01lc3NhZ2UuVFlQRV0gPSBCdXR0b25zTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0RlbGF5TWVzc2FnZS5UWVBFXSA9IERlbGF5TWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0NsZWFyTWVzc2FnZS5UWVBFXSA9IENsZWFyTWVzc2FnZTtcblByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW0RlYWxlckJ1dHRvbk1lc3NhZ2UuVFlQRV0gPSBEZWFsZXJCdXR0b25NZXNzYWdlO1xuXG4vKipcbiAqIEFkZCBtZXNzYWdlIGhhbmRsZXIuXG4gKi9cblByb3RvQ29ubmVjdGlvbi5wcm90b3R5cGUuYWRkTWVzc2FnZUhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlVHlwZSwgaGFuZGxlciwgc2NvcGUpIHtcblx0aWYgKG1lc3NhZ2VUeXBlLmhhc093blByb3BlcnR5KFwiVFlQRVwiKSlcblx0XHRtZXNzYWdlVHlwZSA9IG1lc3NhZ2VUeXBlLlRZUEU7XG5cblx0dGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5vbihtZXNzYWdlVHlwZSwgaGFuZGxlciwgc2NvcGUpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBtZXNzYWdlIGhhbmRsZXIuXG4gKi9cblByb3RvQ29ubmVjdGlvbi5wcm90b3R5cGUucmVtb3ZlTWVzc2FnZUhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlVHlwZSwgaGFuZGxlciwgc2NvcGUpIHtcblx0aWYgKG1lc3NhZ2VUeXBlLmhhc093blByb3BlcnR5KFwiVFlQRVwiKSlcblx0XHRtZXNzYWdlVHlwZSA9IG1lc3NhZ2VUeXBlLlRZUEU7XG5cblx0dGhpcy5tZXNzYWdlRGlzcGF0Y2hlci5vZmYobWVzc2FnZVR5cGUsIGhhbmRsZXIsIHNjb3BlKTtcbn1cblxuLyoqXG4gKiBDb25uZWN0aW9uIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIG9uQ29ubmVjdGlvbk1lc3NhZ2VcbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS5vbkNvbm5lY3Rpb25NZXNzYWdlID0gZnVuY3Rpb24oZXYpIHtcblx0dmFyIG1lc3NhZ2UgPSBldi5tZXNzYWdlO1xuXHR2YXIgY29uc3RydWN0b3I7XG5cblx0Y29uc29sZS5sb2coXCJpbmNvbWluZyBjb25uZWN0aW9uIG1lc3NhZ2U6IFwiICsgbWVzc2FnZS50eXBlKTtcblxuXHRmb3IgKHR5cGUgaW4gUHJvdG9Db25uZWN0aW9uLk1FU1NBR0VfVFlQRVMpIHtcblx0XHRpZiAobWVzc2FnZS50eXBlID09IHR5cGUpXG5cdFx0XHRjb25zdHJ1Y3RvciA9IFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTW3R5cGVdXG5cdH1cblxuXHRpZiAoIWNvbnN0cnVjdG9yKSB7XG5cdFx0Y29uc29sZS53YXJuKFwidW5rbm93biBtZXNzYWdlOiBcIiArIG1lc3NhZ2UudHlwZSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIG8gPSBuZXcgY29uc3RydWN0b3IoKTtcblx0by51bnNlcmlhbGl6ZShtZXNzYWdlKTtcblx0by50eXBlID0gbWVzc2FnZS50eXBlO1xuXG5cdHRoaXMubWVzc2FnZURpc3BhdGNoZXIudHJpZ2dlcihvKTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFLFxuXHRcdG1lc3NhZ2U6IG9cblx0fSk7XG59XG5cbi8qKlxuICogQ29ubmVjdGlvbiBjbG9zZS5cbiAqIEBtZXRob2Qgb25Db25uZWN0aW9uQ2xvc2VcbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS5vbkNvbm5lY3Rpb25DbG9zZSA9IGZ1bmN0aW9uKGV2KSB7XG5cdHRoaXMuY29ubmVjdGlvbi5vZmYoXCJtZXNzYWdlXCIsIHRoaXMub25Db25uZWN0aW9uTWVzc2FnZSwgdGhpcyk7XG5cdHRoaXMuY29ubmVjdGlvbi5vZmYoXCJjbG9zZVwiLCB0aGlzLm9uQ29ubmVjdGlvbkNsb3NlLCB0aGlzKTtcblx0dGhpcy5jb25uZWN0aW9uID0gbnVsbDtcblxuXHR0aGlzLnRyaWdnZXIoUHJvdG9Db25uZWN0aW9uLkNMT1NFKTtcbn1cblxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZS5cbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHR2YXIgc2VyaWFsaXplZCA9IG1lc3NhZ2Uuc2VyaWFsaXplKCk7XG5cblx0Zm9yICh0eXBlIGluIFByb3RvQ29ubmVjdGlvbi5NRVNTQUdFX1RZUEVTKSB7XG5cdFx0aWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBQcm90b0Nvbm5lY3Rpb24uTUVTU0FHRV9UWVBFU1t0eXBlXSlcblx0XHRcdHNlcmlhbGl6ZWQudHlwZSA9IHR5cGU7XG5cdH1cblxuXHRpZiAoIXNlcmlhbGl6ZWQudHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1lc3NhZ2UgdHlwZSBmb3Igc2VuZCwgbWVzc2FnZT1cIittZXNzYWdlLmNvbnN0cnVjdG9yLm5hbWUpO1xuXG4vL1x0Y29uc29sZS5sb2coXCJzZW5kaW5nOiBcIitzZXJpYWxpemVkKTtcblxuXHR0aGlzLmNvbm5lY3Rpb24uc2VuZChzZXJpYWxpemVkKTtcbn1cblxuLyoqXG4gKiBDbG9zZSB0aGUgY29ubmVjdGlvbi5cbiAqIEBtZXRob2QgY2xvc2VcbiAqL1xuUHJvdG9Db25uZWN0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm90b0Nvbm5lY3Rpb247IiwiLyoqXG4gKiBCdXR0b24gZGF0YS5cbiAqIEBjbGFzcyBCdXR0b25EYXRhXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbkRhdGEoYnV0dG9uLCB2YWx1ZSkge1xuXHR0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHQvKlx0dGhpcy5taW4gPSAtMTtcblx0dGhpcy5tYXggPSAtMTsqL1xufVxuXG5CdXR0b25EYXRhLlJBSVNFID0gXCJyYWlzZVwiO1xuQnV0dG9uRGF0YS5GT0xEID0gXCJmb2xkXCI7XG5CdXR0b25EYXRhLkJFVCA9IFwiYmV0XCI7XG5CdXR0b25EYXRhLlNJVF9PVVQgPSBcInNpdE91dFwiO1xuQnV0dG9uRGF0YS5TSVRfSU4gPSBcInNpdEluXCI7XG5CdXR0b25EYXRhLkNBTEwgPSBcImNhbGxcIjtcbkJ1dHRvbkRhdGEuUE9TVF9CQiA9IFwicG9zdEJCXCI7XG5CdXR0b25EYXRhLlBPU1RfU0IgPSBcInBvc3RTQlwiO1xuQnV0dG9uRGF0YS5DQU5DRUwgPSBcImNhbmNlbFwiO1xuQnV0dG9uRGF0YS5DSEVDSyA9IFwiY2hlY2tcIjtcbkJ1dHRvbkRhdGEuU0hPVyA9IFwic2hvd1wiO1xuQnV0dG9uRGF0YS5NVUNLID0gXCJtdWNrXCI7XG5CdXR0b25EYXRhLk9LID0gXCJva1wiO1xuQnV0dG9uRGF0YS5JTV9CQUNLID0gXCJpbUJhY2tcIjtcbkJ1dHRvbkRhdGEuTEVBVkUgPSBcImxlYXZlXCI7XG5CdXR0b25EYXRhLkNIRUNLX0ZPTEQgPSBcImNoZWNrRm9sZFwiO1xuQnV0dG9uRGF0YS5DQUxMX0FOWSA9IFwiY2FsbEFueVwiO1xuQnV0dG9uRGF0YS5SQUlTRV9BTlkgPSBcInJhaXNlQW55XCI7XG5CdXR0b25EYXRhLkJVWV9JTiA9IFwiYnV5SW5cIjtcbkJ1dHRvbkRhdGEuUkVfQlVZID0gXCJyZUJ1eVwiO1xuQnV0dG9uRGF0YS5KT0lOX1RPVVJOQU1FTlQgPSBcImpvaW5Ub3VybmFtZW50XCI7XG5CdXR0b25EYXRhLkxFQVZFX1RPVVJOQU1FTlQgPSBcImxlYXZlVG91cm5hbWVudFwiO1xuXG4vKipcbiAqIEdldCBidXR0b24uXG4gKiBAbWV0aG9kIGdldEJ1dHRvblxuICovXG5CdXR0b25EYXRhLnByb3RvdHlwZS5nZXRCdXR0b24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYnV0dG9uO1xufVxuXG4vKipcbiAqIEdldCB2YWx1ZS5cbiAqIEBtZXRob2QgZ2V0VmFsdWVcbiAqL1xuQnV0dG9uRGF0YS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGJ1dHRvbiBzdHJpbmcgZm9yIGlkLlxuICogQG1ldGhvZCBnZXRCdXR0b25TdHJpbmdGb3JJZFxuICogQHN0YXRpY1xuICovXG5CdXR0b25EYXRhLmdldEJ1dHRvblN0cmluZ0ZvcklkID0gZnVuY3Rpb24oYikge1xuXHRzd2l0Y2ggKGIpIHtcblx0XHRjYXNlIEJ1dHRvbkRhdGEuRk9MRDpcblx0XHRcdHJldHVybiBcIkZPTERcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5DQUxMOlxuXHRcdFx0cmV0dXJuIFwiQ0FMTFwiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLlJBSVNFOlxuXHRcdFx0cmV0dXJuIFwiUkFJU0UgVE9cIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5CRVQ6XG5cdFx0XHRyZXR1cm4gXCJCRVRcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5TSVRfT1VUOlxuXHRcdFx0cmV0dXJuIFwiU0lUIE9VVFwiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLlBPU1RfQkI6XG5cdFx0XHRyZXR1cm4gXCJQT1NUIEJCXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuUE9TVF9TQjpcblx0XHRcdHJldHVybiBcIlBPU1QgU0JcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5TSVRfSU46XG5cdFx0XHRyZXR1cm4gXCJTSVQgSU5cIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5DQU5DRUw6XG5cdFx0XHRyZXR1cm4gXCJDQU5DRUxcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5DSEVDSzpcblx0XHRcdHJldHVybiBcIkNIRUNLXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuU0hPVzpcblx0XHRcdHJldHVybiBcIlNIT1dcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5NVUNLOlxuXHRcdFx0cmV0dXJuIFwiTVVDS1wiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLk9LOlxuXHRcdFx0cmV0dXJuIFwiT0tcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5JTV9CQUNLOlxuXHRcdFx0cmV0dXJuIFwiSSdNIEJBQ0tcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5MRUFWRTpcblx0XHRcdHJldHVybiBcIkxFQVZFXCI7XG5cblx0XHRjYXNlIEJ1dHRvbkRhdGEuQ0hFQ0tfRk9MRDpcblx0XHRcdHJldHVybiBcIkNIRUNLIC8gRk9MRFwiO1xuXG5cdFx0Y2FzZSBCdXR0b25EYXRhLkNBTExfQU5ZOlxuXHRcdFx0cmV0dXJuIFwiQ0FMTCBBTllcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5SQUlTRV9BTlk6XG5cdFx0XHRyZXR1cm4gXCJSQUlTRSBBTllcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5SRV9CVVk6XG5cdFx0XHRyZXR1cm4gXCJSRS1CVVlcIjtcblxuXHRcdGNhc2UgQnV0dG9uRGF0YS5CVVlfSU46XG5cdFx0XHRyZXR1cm4gXCJCVVkgSU5cIjtcblx0fVxuXG5cdHJldHVybiBcIlwiO1xufVxuXG4vKkJ1dHRvbkRhdGEucHJvdG90eXBlLmdldE1pbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5taW47XG59Ki9cblxuLypCdXR0b25EYXRhLnByb3RvdHlwZS5nZXRNYXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMubWF4O1xufSovXG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uRGF0YTsiLCIvKipcbiAqIENhcmQgZGF0YS5cbiAqIEBjbGFzcyBDYXJkRGF0YVxuICovXG5mdW5jdGlvbiBDYXJkRGF0YSh2YWx1ZSkge1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbkNhcmREYXRhLkNBUkRfVkFMVUVfU1RSSU5HUyA9XG5cdFtcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCIsIFwiMTBcIiwgXCJKXCIsIFwiUVwiLCBcIktcIiwgXCJBXCJdO1xuXG5DYXJkRGF0YS5TVUlUX1NUUklOR1MgPVxuXHRbXCJEXCIsIFwiQ1wiLCBcIkhcIiwgXCJTXCJdO1xuXG4vKipcbiAqIFNob3duP1xuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuaXNTaG93biA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52YWx1ZSA+PSAwO1xufVxuXG4vKipcbiAqIEdldCBjYXJkIHZhbHVlIHN0cmluZy5cbiAqL1xuQ2FyZERhdGEucHJvdG90eXBlLmdldENhcmRWYWx1ZVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gQ2FyZERhdGEuQ0FSRF9WQUxVRV9TVFJJTkdTW3RoaXMudmFsdWUgJSAxM107XG59XG5cbi8qKlxuICogR2V0IHN1aXQgaW5kZXguXG4gKi9cbkNhcmREYXRhLnByb3RvdHlwZS5nZXRTdWl0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy52YWx1ZSAvIDEzKTtcbn1cblxuLyoqXG4gKiBHZXQgc3VpdCBzdHJpbmcuXG4gKi9cbkNhcmREYXRhLnByb3RvdHlwZS5nZXRTdWl0U3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBDYXJkRGF0YS5TVUlUX1NUUklOR1NbdGhpcy5nZXRTdWl0SW5kZXgoKV07XG59XG5cbi8qKlxuICogR2V0IGNvbG9yLlxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUuZ2V0Q29sb3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuZ2V0U3VpdEluZGV4KCkgJSAyICE9IDApXG5cdFx0cmV0dXJuIFwiIzAwMDAwMFwiO1xuXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIjZmYwMDAwXCI7XG59XG5cbi8qKlxuICogVG8gc3RyaW5nLlxuICovXG5DYXJkRGF0YS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2V0Q2FyZFZhbHVlU3RyaW5nKCkgKyB0aGlzLmdldFN1aXRTdHJpbmcoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXJkRGF0YTsiLCIvKipcbiAqIEBjbGFzcyBTaG93RGlhbG9nTWVzc2FnZVxuICovXG5mdW5jdGlvbiBCdXR0b25DbGlja01lc3NhZ2UoYnV0dG9uLCB2YWx1ZSkge1xuXHR0aGlzLmJ1dHRvbj1idXR0b247XG5cdHRoaXMudmFsdWU9dmFsdWU7XG59XG5cbkJ1dHRvbkNsaWNrTWVzc2FnZS5UWVBFID0gXCJidXR0b25DbGlja1wiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqL1xuQnV0dG9uQ2xpY2tNZXNzYWdlLnByb3RvdHlwZS5nZXRCdXR0b24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYnV0dG9uO1xufVxuXG4vKipcbiAqIFNldHRlci5cbiAqL1xuQnV0dG9uQ2xpY2tNZXNzYWdlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52YWx1ZTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplLlxuICovXG5CdXR0b25DbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLmJ1dHRvbj1kYXRhLmJ1dHRvbjtcblx0dGhpcy52YWx1ZT1kYXRhLnZhbHVlO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuQnV0dG9uQ2xpY2tNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRidXR0b246IHRoaXMuYnV0dG9uLFxuXHRcdHZhbHVlOiB0aGlzLnZhbHVlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uQ2xpY2tNZXNzYWdlOyIsInZhciBCdXR0b25EYXRhID0gcmVxdWlyZShcIi4uL2RhdGEvQnV0dG9uRGF0YVwiKTtcblxuLyoqXG4gKiBAY2xhc3MgQnV0dG9uc01lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gQnV0dG9uc01lc3NhZ2UoKSB7XG5cdHRoaXMuYnV0dG9ucyA9IFtdO1xufVxuXG5CdXR0b25zTWVzc2FnZS5UWVBFID0gXCJidXR0b25zXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5CdXR0b25zTWVzc2FnZS5wcm90b3R5cGUuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5idXR0b25zO1xufVxuXG4vKipcbiAqIEFkZCBidXR0b24uXG4gKi9cbkJ1dHRvbnNNZXNzYWdlLnByb3RvdHlwZS5hZGRCdXR0b24gPSBmdW5jdGlvbihidXR0b24pIHtcblx0dGhpcy5idXR0b25zLnB1c2goYnV0dG9uKTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplLlxuICovXG5CdXR0b25zTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuYnV0dG9ucyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5idXR0b25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGJ1dHRvbiA9IGRhdGEuYnV0dG9uc1tpXTtcblx0XHR2YXIgYnV0dG9uRGF0YSA9IG5ldyBCdXR0b25EYXRhKGJ1dHRvbi5idXR0b24sIGJ1dHRvbi52YWx1ZSk7XG5cdFx0dGhpcy5hZGRCdXR0b24oYnV0dG9uRGF0YSk7XG5cdH1cbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkJ1dHRvbnNNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0dmFyIGJ1dHRvbnMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBidXR0b24gPSB7fTtcblx0XHRidXR0b24uYnV0dG9uID0gdGhpcy5idXR0b25zW2ldLmdldEJ1dHRvbigpO1xuXHRcdGJ1dHRvbi52YWx1ZSA9IHRoaXMuYnV0dG9uc1tpXS5nZXRWYWx1ZSgpO1xuXHRcdGJ1dHRvbnMucHVzaChidXR0b24pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRidXR0b25zOiBidXR0b25zXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uc01lc3NhZ2U7IiwiLyoqXG4gKiBAY2xhc3MgQ2xlYXJNZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIENsZWFyTWVzc2FnZShjb21wb25lbnRzKSB7XG5cdGlmICghY29tcG9uZW50cylcblx0XHRjb21wb25lbnRzID0gW107XG5cblx0dGhpcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcbn1cblxuQ2xlYXJNZXNzYWdlLlRZUEUgPSBcImNsZWFyXCI7XG5cbkNsZWFyTWVzc2FnZS5DQVJEUyA9IFwiY2FyZHNcIjtcbkNsZWFyTWVzc2FnZS5CRVRTID0gXCJiZXRzXCI7XG5DbGVhck1lc3NhZ2UuUE9UID0gXCJwb3RcIjtcbkNsZWFyTWVzc2FnZS5DSEFUID0gXCJjaGF0XCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRDb21wb25lbnRzXG4gKi9cbkNsZWFyTWVzc2FnZS5wcm90b3R5cGUuZ2V0Q29tcG9uZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb21wb25lbnRzO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuQ2xlYXJNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy5jb21wb25lbnRzID0gZGF0YS5jb21wb25lbnRzO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuQ2xlYXJNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHNcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDbGVhck1lc3NhZ2U7IiwidmFyIENhcmREYXRhPXJlcXVpcmUoXCIuLi9kYXRhL0NhcmREYXRhXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBTZWF0SW5mb01lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gQ29tbXVuaXR5Q2FyZHNNZXNzYWdlKCkge1xuXHR0aGlzLmFuaW1hdGUgPSBmYWxzZTtcblx0dGhpcy5jYXJkcyA9IFtdO1xuXHR0aGlzLmZpcnN0SW5kZXggPSAwO1xufVxuXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UuVFlQRSA9IFwiY29tbXVuaXR5Q2FyZHNcIjtcblxuLyoqXG4gKiBHZXQgY2FyZCBkYXRhLlxuICovXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UucHJvdG90eXBlLmdldENhcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNhcmRzO1xufVxuXG4vKipcbiAqIEdldCBmaXJzdCBpbmRleC5cbiAqL1xuQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5nZXRGaXJzdEluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmZpcnN0SW5kZXg7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZS5cbiAqL1xuQ29tbXVuaXR5Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dmFyIGk7XG5cblx0dGhpcy5hbmltYXRlID0gZGF0YS5hbmltYXRlO1xuXHR0aGlzLmZpcnN0SW5kZXggPSBwYXJzZUludChkYXRhLmZpcnN0SW5kZXgpO1xuXHR0aGlzLmNhcmRzPVtdO1xuXG5cdGZvciAoaT0wOyBpPGRhdGEuY2FyZHMubGVuZ3RoOyBpKyspXG5cdFx0dGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkRGF0YShkYXRhLmNhcmRzW2ldKSk7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Db21tdW5pdHlDYXJkc01lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY2FyZHM9W107XG5cblx0Zm9yIChpPTA7IGk8dGhpcy5jYXJkcy5sZW5ndGg7IGkrKylcblx0XHRjYXJkcy5wdXNoKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSk7XG5cblx0cmV0dXJuIHtcblx0XHRhbmltYXRlOiB0aGlzLnNlYXRJbmRleCxcblx0XHRmaXJzdEluZGV4OiB0aGlzLmZpcnN0SW5kZXgsXG5cdFx0Y2FyZHM6IGNhcmRzXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbXVuaXR5Q2FyZHNNZXNzYWdlOyIsIi8qKlxuICogQGNsYXNzIERlYWxlckJ1dHRvbk1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gRGVhbGVyQnV0dG9uTWVzc2FnZShzZWF0SW5kZXgsIGFuaW1hdGUpIHtcblx0dGhpcy5zZWF0SW5kZXggPSBzZWF0SW5kZXg7XG5cdHRoaXMuYW5pbWF0ZSA9IGFuaW1hdGU7XG59XG5cbkRlYWxlckJ1dHRvbk1lc3NhZ2UuVFlQRSA9IFwiZGVhbGVyQnV0dG9uXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICogQG1ldGhvZCBnZXRTZWF0SW5kZXhcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUuZ2V0U2VhdEluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNlYXRJbmRleDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKiBAbWV0aG9kIGdldEFuaW1hdGVcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUuZ2V0QW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hbmltYXRlO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemVcbiAqL1xuRGVhbGVyQnV0dG9uTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuc2VhdEluZGV4ID0gZGF0YS5zZWF0SW5kZXg7XG5cdHRoaXMuYW5pbWF0ZSA9IGRhdGEuYW5pbWF0ZTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkRlYWxlckJ1dHRvbk1lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNlYXRJbmRleDogdGhpcy5zZWF0SW5kZXgsXG5cdFx0YW5pbWF0ZTogdGhpcy5hbmltYXRlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVhbGVyQnV0dG9uTWVzc2FnZTsiLCIvKipcbiAqIEBjbGFzcyBEZWxheU1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gRGVsYXlNZXNzYWdlKGRlbGF5KSB7XG5cdHRoaXMuZGVsYXk9ZGVsYXk7XG59XG5cbkRlbGF5TWVzc2FnZS5UWVBFID0gXCJkZWxheVwiO1xuXG4vKipcbiAqIEdldHRlci5cbiAqIEBtZXRob2QgZ2V0RGVsYXlcbiAqL1xuRGVsYXlNZXNzYWdlLnByb3RvdHlwZS5nZXREZWxheSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5kZWxheTtcbn1cblxuLyoqXG4gKiBVbi1zZXJpYWxpemUuXG4gKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gKi9cbkRlbGF5TWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuZGVsYXk9ZGF0YS5kZWxheTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cbkRlbGF5TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0ZGVsYXk6IHRoaXMuZGVsYXlcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZWxheU1lc3NhZ2U7IiwiLyoqXG4gKiBAY2xhc3MgSW5pdE1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gSW5pdE1lc3NhZ2UodG9rZW4pIHtcblx0dGhpcy50b2tlbiA9IHRva2VuO1xuXHR0aGlzLnRhYmxlSWQgPSBudWxsO1xuXHR0aGlzLnZpZXdDYXNlID0gbnVsbDtcbn1cblxuSW5pdE1lc3NhZ2UuVFlQRSA9IFwiaW5pdFwiO1xuXG4vKipcbiAqIGdldCB0b2tlbi5cbiAqIEBtZXRob2QgZ2V0VG9rZW5cbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLmdldFRva2VuID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRva2VuO1xufVxuXG4vKipcbiAqIFNldCB0YWJsZSBpZC5cbiAqIEBtZXRob2Qgc2V0VGFibGVJZFxuICovXG5Jbml0TWVzc2FnZS5wcm90b3R5cGUuc2V0VGFibGVJZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdHRoaXMudGFibGVJZCA9IGlkO1xufVxuXG4vKipcbiAqIEdldCB0YWJsZSBpZC5cbiAqIEBtZXRob2QgZ2V0VGFibGVJZFxuICovXG5Jbml0TWVzc2FnZS5wcm90b3R5cGUuZ2V0VGFibGVJZCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50YWJsZUlkO1xufVxuXG4vKipcbiAqIFNldCB2aWV3IGNhc2UuXG4gKiBAbWV0aG9kIHNldFRhYmxlSWRcbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLnNldFZpZXdDYXNlID0gZnVuY3Rpb24odmlld0Nhc2UpIHtcblx0dGhpcy52aWV3Q2FzZSA9IHZpZXdDYXNlO1xufVxuXG4vKipcbiAqIEdldCB2aWV3IGNhc2UuXG4gKiBAbWV0aG9kIGdldFRhYmxlSWRcbiAqL1xuSW5pdE1lc3NhZ2UucHJvdG90eXBlLmdldFZpZXdDYXNlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnZpZXdDYXNlO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cbkluaXRNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dGhpcy50b2tlbiA9IGRhdGEudG9rZW47XG5cdHRoaXMudGFibGVJZCA9IGRhdGEudGFibGVJZDtcblx0dGhpcy52aWV3Q2FzZSA9IGRhdGEudmlld0Nhc2U7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Jbml0TWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dG9rZW46IHRoaXMudG9rZW4sXG5cdFx0dGFibGVJZDogdGhpcy50YWJsZUlkLFxuXHRcdHZpZXdDYXNlOiB0aGlzLnZpZXdDYXNlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5pdE1lc3NhZ2U7IiwidmFyIENhcmREYXRhID0gcmVxdWlyZShcIi4uL2RhdGEvQ2FyZERhdGFcIik7XG5cbi8qKlxuICogQGNsYXNzIFNlYXRJbmZvTWVzc2FnZVxuICovXG5mdW5jdGlvbiBQb2NrZXRDYXJkc01lc3NhZ2UoKSB7XG5cdHRoaXMuYW5pbWF0ZSA9IGZhbHNlO1xuXHR0aGlzLmNhcmRzID0gW107XG5cdHRoaXMuZmlyc3RJbmRleCA9IDA7XG5cdHRoaXMuc2VhdEluZGV4ID0gMDtcbn1cblxuUG9ja2V0Q2FyZHNNZXNzYWdlLlRZUEUgPSBcInBvY2tldENhcmRzXCI7XG5cbi8qKlxuICogR2V0IGNhcmQgZGF0YS5cbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS5nZXRDYXJkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jYXJkcztcbn1cblxuLyoqXG4gKiBHZXQgZmlyc3QgaW5kZXguXG4gKi9cblBvY2tldENhcmRzTWVzc2FnZS5wcm90b3R5cGUuZ2V0Rmlyc3RJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5maXJzdEluZGV4O1xufVxuXG4vKipcbiAqIEdldCBzZWF0IGluZGV4LlxuICovXG5Qb2NrZXRDYXJkc01lc3NhZ2UucHJvdG90eXBlLmdldFNlYXRJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5zZWF0SW5kZXg7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZS5cbiAqL1xuUG9ja2V0Q2FyZHNNZXNzYWdlLnByb3RvdHlwZS51bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dmFyIGk7XG5cblx0dGhpcy5hbmltYXRlID0gZGF0YS5hbmltYXRlO1xuXHR0aGlzLmZpcnN0SW5kZXggPSBwYXJzZUludChkYXRhLmZpcnN0SW5kZXgpO1xuXHR0aGlzLmNhcmRzID0gW107XG5cdHRoaXMuc2VhdEluZGV4ID0gZGF0YS5zZWF0SW5kZXg7XG5cblx0Zm9yIChpID0gMDsgaSA8IGRhdGEuY2FyZHMubGVuZ3RoOyBpKyspXG5cdFx0dGhpcy5jYXJkcy5wdXNoKG5ldyBDYXJkRGF0YShkYXRhLmNhcmRzW2ldKSk7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5Qb2NrZXRDYXJkc01lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY2FyZHMgPSBbXTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKylcblx0XHRjYXJkcy5wdXNoKHRoaXMuY2FyZHNbaV0uZ2V0VmFsdWUoKSk7XG5cblx0cmV0dXJuIHtcblx0XHRhbmltYXRlOiB0aGlzLnNlYXRJbmRleCxcblx0XHRmaXJzdEluZGV4OiB0aGlzLmZpcnN0SW5kZXgsXG5cdFx0Y2FyZHM6IGNhcmRzLFxuXHRcdHNlYXRJbmRleDogdGhpcy5zZWF0SW5kZXhcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2NrZXRDYXJkc01lc3NhZ2U7IiwiLyoqXG4gKiBAY2xhc3MgU2VhdENsaWNrTWVzc2FnZVxuICovXG5mdW5jdGlvbiBTZWF0Q2xpY2tNZXNzYWdlKHNlYXRJbmRleCkge1xuXHR0aGlzLnNlYXRJbmRleD1zZWF0SW5kZXg7XG59XG5cblNlYXRDbGlja01lc3NhZ2UuVFlQRSA9IFwic2VhdENsaWNrXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5TZWF0Q2xpY2tNZXNzYWdlLnByb3RvdHlwZS5nZXRTZWF0SW5kZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cblNlYXRDbGlja01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnNlYXRJbmRleCA9IGRhdGEuc2VhdEluZGV4O1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBtZXNzYWdlLlxuICogQG1ldGhvZCBzZXJpYWxpemVcbiAqL1xuU2VhdENsaWNrTWVzc2FnZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2VhdEluZGV4OiB0aGlzLnNlYXRJbmRleCxcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWF0Q2xpY2tNZXNzYWdlOyIsIi8qKlxuICogQGNsYXNzIFNlYXRJbmZvTWVzc2FnZVxuICovXG5mdW5jdGlvbiBTZWF0SW5mb01lc3NhZ2UoKSB7XG5cdHRoaXMuYWN0aXZlID0gdHJ1ZTtcbn1cblxuU2VhdEluZm9NZXNzYWdlLlRZUEUgPSBcInNlYXRJbmZvXCI7XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLmdldFNlYXRJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5zZWF0SW5kZXg7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMubmFtZTtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuZ2V0Q2hpcHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2hpcHM7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLmlzU2l0b3V0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnNpdG91dDtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYWN0aXZlO1xufVxuXG4vKipcbiAqIFVuLXNlcmlhbGl6ZS5cbiAqIEBtZXRob2QgdW5zZXJpYWxpemUuXG4gKi9cblNlYXRJbmZvTWVzc2FnZS5wcm90b3R5cGUudW5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuc2VhdEluZGV4ID0gZGF0YS5zZWF0SW5kZXg7XG5cdHRoaXMubmFtZSA9IGRhdGEubmFtZTtcblx0dGhpcy5jaGlwcyA9IGRhdGEuY2hpcHM7XG5cdHRoaXMuc2l0b3V0ID0gZGF0YS5zaXRvdXQ7XG5cdHRoaXMuYWN0aXZlID0gZGF0YS5hY3RpdmU7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIG1lc3NhZ2UuXG4gKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICovXG5TZWF0SW5mb01lc3NhZ2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNlYXRJbmRleDogdGhpcy5zZWF0SW5kZXgsXG5cdFx0bmFtZTogdGhpcy5uYW1lLFxuXHRcdGNoaXBzOiB0aGlzLmNoaXBzLFxuXHRcdHNpdG91dDogdGhpcy5zaXRvdXQsXG5cdFx0YWN0aXZlOiB0aGlzLmFjdGl2ZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXRJbmZvTWVzc2FnZTsiLCIvKipcbiAqIEBjbGFzcyBTaG93RGlhbG9nTWVzc2FnZVxuICovXG5mdW5jdGlvbiBTaG93RGlhbG9nTWVzc2FnZSgpIHtcblx0dGhpcy50ZXh0ID0gXCJcIjtcblx0dGhpcy5idXR0b25zID0gW107XG59XG5cblNob3dEaWFsb2dNZXNzYWdlLlRZUEUgPSBcInNob3dEaWFsb2dcIjtcblxuLyoqXG4gKiBHZXR0ZXIuXG4gKi9cblNob3dEaWFsb2dNZXNzYWdlLnByb3RvdHlwZS5hZGRCdXR0b24gPSBmdW5jdGlvbihidXR0b24pIHtcblx0dGhpcy5idXR0b25zLnB1c2goYnV0dG9uKTtcbn1cblxuLyoqXG4gKiBHZXR0ZXIuXG4gKi9cblNob3dEaWFsb2dNZXNzYWdlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRleHQ7XG59XG5cbi8qKlxuICogR2V0dGVyLlxuICovXG5TaG93RGlhbG9nTWVzc2FnZS5wcm90b3R5cGUuZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5idXR0b25zO1xufVxuXG4vKipcbiAqIFNldHRlci5cbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLnNldFRleHQgPSBmdW5jdGlvbih0ZXh0KSB7XG5cdHRoaXMudGV4dCA9IHRleHQ7XG59XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZS5cbiAqL1xuU2hvd0RpYWxvZ01lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHR0aGlzLnRleHQgPSBkYXRhLnRleHQ7XG5cdHRoaXMuYnV0dG9ucyA9IGRhdGEuYnV0dG9ucztcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblNob3dEaWFsb2dNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR0ZXh0OiB0aGlzLnRleHQsXG5cdFx0YnV0dG9uczogdGhpcy5idXR0b25zXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hvd0RpYWxvZ01lc3NhZ2U7IiwiLyoqXG4gKiBAY2xhc3MgU3RhdGVDb21wbGV0ZU1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gU3RhdGVDb21wbGV0ZU1lc3NhZ2UoKSB7fVxuXG5TdGF0ZUNvbXBsZXRlTWVzc2FnZS5UWVBFID0gXCJzdGF0ZUNvbXBsZXRlXCI7XG5cbi8qKlxuICogVW4tc2VyaWFsaXplLlxuICogQG1ldGhvZCB1bnNlcmlhbGl6ZS5cbiAqL1xuU3RhdGVDb21wbGV0ZU1lc3NhZ2UucHJvdG90eXBlLnVuc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge31cblxuLyoqXG4gKiBTZXJpYWxpemUgbWVzc2FnZS5cbiAqIEBtZXRob2Qgc2VyaWFsaXplXG4gKi9cblN0YXRlQ29tcGxldGVNZXNzYWdlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlQ29tcGxldGVNZXNzYWdlOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBCdXR0b24uXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbihjb250ZW50KSB7XG5cdFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG5cdGlmIChjb250ZW50KVxuXHRcdHRoaXMuYWRkQ2hpbGQoY29udGVudCk7XG5cblx0dGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XG5cdHRoaXMuYnV0dG9uTW9kZSA9IHRydWU7XG5cblx0dGhpcy5tb3VzZW92ZXIgPSB0aGlzLm9uTW91c2VvdmVyLmJpbmQodGhpcyk7XG5cdHRoaXMubW91c2VvdXQgPSB0aGlzLm9uTW91c2VvdXQuYmluZCh0aGlzKTtcblx0dGhpcy5tb3VzZWRvd24gPSB0aGlzLm9uTW91c2Vkb3duLmJpbmQodGhpcyk7XG5cdHRoaXMubW91c2V1cCA9IHRoaXMub25Nb3VzZXVwLmJpbmQodGhpcyk7XG5cdHRoaXMuY2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcblxuXHR0aGlzLmNvbG9yTWF0cml4RmlsdGVyID0gbmV3IFBJWEkuQ29sb3JNYXRyaXhGaWx0ZXIoKTtcblx0dGhpcy5jb2xvck1hdHJpeEZpbHRlci5tYXRyaXggPSBbMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV07XG5cblx0dGhpcy5maWx0ZXJzID0gW3RoaXMuY29sb3JNYXRyaXhGaWx0ZXJdO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKEJ1dHRvbiwgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KEJ1dHRvbik7XG5cbkJ1dHRvbi5MSUdIVF9NQVRSSVggPSBbMS41LCAwLCAwLCAwLCAwLCAxLjUsIDAsIDAsIDAsIDAsIDEuNSwgMCwgMCwgMCwgMCwgMV07XG5CdXR0b24uREFSS19NQVRSSVggPSBbLjc1LCAwLCAwLCAwLCAwLCAuNzUsIDAsIDAsIDAsIDAsIC43NSwgMCwgMCwgMCwgMCwgMV07XG5CdXR0b24uREVGQVVMVF9NQVRSSVggPSBbMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV07XG5cbkJ1dHRvbi5DTElDSyA9IFwiY2xpY2tcIjtcblxuLyoqXG4gKiBNb3VzZSBvdmVyLlxuICovXG5CdXR0b24ucHJvdG90eXBlLm9uTW91c2VvdmVyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gQnV0dG9uLkxJR0hUX01BVFJJWDtcbn1cblxuLyoqXG4gKiBNb3VzZSBvdXQuXG4gKi9cbkJ1dHRvbi5wcm90b3R5cGUub25Nb3VzZW91dCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNvbG9yTWF0cml4RmlsdGVyLm1hdHJpeCA9IEJ1dHRvbi5ERUZBVUxUX01BVFJJWDtcbn1cblxuLyoqXG4gKiBNb3VzZSBkb3duLlxuICovXG5CdXR0b24ucHJvdG90eXBlLm9uTW91c2Vkb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY29sb3JNYXRyaXhGaWx0ZXIubWF0cml4ID0gQnV0dG9uLkRBUktfTUFUUklYO1xufVxuXG4vKipcbiAqIE1vdXNlIHVwLlxuICovXG5CdXR0b24ucHJvdG90eXBlLm9uTW91c2V1cCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNvbG9yTWF0cml4RmlsdGVyLm1hdHJpeCA9IEJ1dHRvbi5MSUdIVF9NQVRSSVg7XG59XG5cbi8qKlxuICogQ2xpY2suXG4gKi9cbkJ1dHRvbi5wcm90b3R5cGUub25DbGljayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRyaWdnZXIoQnV0dG9uLkNMSUNLKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b247IiwidmFyIFBJWEk9cmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsPXJlcXVpcmUoXCIuLi91dGlscy9GdW5jdGlvblV0aWxcIik7XG5cbmZ1bmN0aW9uIENvbnRlbnRTY2FsZXIoY29udGVudCkge1xuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmNvbnRlbnRXaWR0aD0xMDA7XG5cdHRoaXMuY29udGVudEhlaWdodD0xMDA7XG5cblx0dGhpcy5zY3JlZW5XaWR0aD0xMDA7XG5cdHRoaXMuc2NyZWVuSGVpZ2h0PTEwMDtcblxuXHR0aGlzLnRoZU1hc2s9bnVsbDtcblxuXHRpZiAoY29udGVudClcblx0XHR0aGlzLnNldENvbnRlbnQoY29udGVudCk7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoQ29udGVudFNjYWxlcixQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIpO1xuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0dGhpcy5jb250ZW50PWNvbnRlbnQ7XG5cblx0dGhpcy5hZGRDaGlsZCh0aGlzLmNvbnRlbnQpO1xuXG5cdGlmICh0aGlzLnRoZU1hc2spIHtcblx0XHR0aGlzLnJlbW92ZUNoaWxkKHRoaXMudGhlTWFzayk7XG5cdFx0dGhpcy50aGVNYXNrPW51bGw7XG5cdH1cblxuXHR0aGlzLnRoZU1hc2s9bmV3IFBJWEkuR3JhcGhpY3MoKTtcblx0Ly90aGlzLmFkZENoaWxkKHRoaXMudGhlTWFzayk7XG5cblx0dGhpcy51cGRhdGVTY2FsZSgpO1xufVxuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS5zZXRDb250ZW50U2l6ZT1mdW5jdGlvbihjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQpIHtcblx0dGhpcy5jb250ZW50V2lkdGg9Y29udGVudFdpZHRoO1xuXHR0aGlzLmNvbnRlbnRIZWlnaHQ9Y29udGVudEhlaWdodDtcblxuXHR0aGlzLnVwZGF0ZVNjYWxlKCk7XG59XG5cbkNvbnRlbnRTY2FsZXIucHJvdG90eXBlLnNldFNjcmVlblNpemU9ZnVuY3Rpb24oc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCkge1xuXHR0aGlzLnNjcmVlbldpZHRoPXNjcmVlbldpZHRoO1xuXHR0aGlzLnNjcmVlbkhlaWdodD1zY3JlZW5IZWlnaHQ7XG5cblx0dGhpcy51cGRhdGVTY2FsZSgpO1xufVxuXG5Db250ZW50U2NhbGVyLnByb3RvdHlwZS51cGRhdGVTY2FsZT1mdW5jdGlvbigpIHtcblx0dmFyIHNjYWxlO1xuXG5cdGlmICh0aGlzLnNjcmVlbldpZHRoL3RoaXMuY29udGVudFdpZHRoPHRoaXMuc2NyZWVuSGVpZ2h0L3RoaXMuY29udGVudEhlaWdodClcblx0XHRzY2FsZT10aGlzLnNjcmVlbldpZHRoL3RoaXMuY29udGVudFdpZHRoO1xuXG5cdGVsc2Vcblx0XHRzY2FsZT10aGlzLnNjcmVlbkhlaWdodC90aGlzLmNvbnRlbnRIZWlnaHQ7XG5cblx0dGhpcy5jb250ZW50LnNjYWxlLng9c2NhbGU7XG5cdHRoaXMuY29udGVudC5zY2FsZS55PXNjYWxlO1xuXG5cdHZhciBzY2FsZWRXaWR0aD10aGlzLmNvbnRlbnRXaWR0aCpzY2FsZTtcblx0dmFyIHNjYWxlZEhlaWdodD10aGlzLmNvbnRlbnRIZWlnaHQqc2NhbGU7XG5cblx0dGhpcy5jb250ZW50LnBvc2l0aW9uLng9KHRoaXMuc2NyZWVuV2lkdGgtc2NhbGVkV2lkdGgpLzI7XG5cdHRoaXMuY29udGVudC5wb3NpdGlvbi55PSh0aGlzLnNjcmVlbkhlaWdodC1zY2FsZWRIZWlnaHQpLzI7XG5cblx0dmFyIHI9bmV3IFBJWEkuUmVjdGFuZ2xlKHRoaXMuY29udGVudC5wb3NpdGlvbi54LHRoaXMuY29udGVudC5wb3NpdGlvbi55LHNjYWxlZFdpZHRoLHNjYWxlZEhlaWdodCk7XG5cdHZhciByaWdodD1yLngrci53aWR0aDtcblx0dmFyIGJvdHRvbT1yLnkrci5oZWlnaHQ7XG5cblx0dGhpcy50aGVNYXNrLmNsZWFyKCk7XG5cdHRoaXMudGhlTWFzay5iZWdpbkZpbGwoKTtcblx0dGhpcy50aGVNYXNrLmRyYXdSZWN0KDAsMCx0aGlzLnNjcmVlbldpZHRoLHIueSk7XG5cdHRoaXMudGhlTWFzay5kcmF3UmVjdCgwLDAsci54LHRoaXMuc2NyZWVuSGVpZ2h0KTtcblx0dGhpcy50aGVNYXNrLmRyYXdSZWN0KHJpZ2h0LDAsdGhpcy5zY3JlZW5XaWR0aC1yaWdodCx0aGlzLnNjcmVlbkhlaWdodCk7XG5cdHRoaXMudGhlTWFzay5kcmF3UmVjdCgwLGJvdHRvbSx0aGlzLnNjcmVlbldpZHRoLHRoaXMuc2NyZWVuSGVpZ2h0LWJvdHRvbSk7XG5cdHRoaXMudGhlTWFzay5lbmRGaWxsKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzPUNvbnRlbnRTY2FsZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQVMzIHN0eWxlIGV2ZW50IGRpc3BhdGNoZXIuXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcblx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lci5cbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIWV2ZW50VHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdGlmICghbGlzdGVuZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTGlzdGVuZXIgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcblxuXHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG5cdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdHNjb3BlOiBzY29wZVxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIuXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSBsaXN0ZW5lcnNbaV07XG5cblx0XHRpZiAobGlzdGVuZXIgPT0gbGlzdGVuZXJPYmoubGlzdGVuZXIgJiYgc2NvcGUgPT0gbGlzdGVuZXJPYmouc2NvcGUpIHtcblx0XHRcdGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFsaXN0ZW5lcnMubGVuZ3RoKVxuXHRcdGRlbGV0ZSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggZXZlbnQuXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKHR5cGVvZiBldmVudCA9PSBcInN0cmluZ1wiKSB7XG5cdFx0ZXZlbnQgPSB7XG5cdFx0XHR0eXBlOiBldmVudFxuXHRcdH07XG5cdH1cblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnQudHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdGlmIChkYXRhID09IHVuZGVmaW5lZClcblx0XHRkYXRhID0gZXZlbnQ7XG5cblx0ZGF0YS50YXJnZXQgPSB0aGlzO1xuXG5cdGZvciAodmFyIGkgaW4gdGhpcy5saXN0ZW5lck1hcFtldmVudC50eXBlXSkge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnQudHlwZV1baV07XG5cblx0XHRsaXN0ZW5lck9iai5saXN0ZW5lci5jYWxsKGxpc3RlbmVyT2JqLnNjb3BlLCBkYXRhKTtcblx0fVxufVxuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcy5cbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50O1xuXG4vKipcbiAqIE1ha2Ugc29tZXRoaW5nIGFuIGV2ZW50IGRpc3BhdGNoZXIuXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5pbml0ID0gZnVuY3Rpb24oY2xzKSB7XG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cdGNscy5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmO1xuXHRjbHMucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnREaXNwYXRjaGVyOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnREaXNwYXRjaGVyPXJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBGdW5jdGlvblV0aWw9cmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xuXG4vKipcbiAqIEZyYW1lIHRpbWVyLlxuICovXG5mdW5jdGlvbiBGcmFtZVRpbWVyKCkge1xuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmludGVydmFsSWQ9c2V0SW50ZXJ2YWwoRnVuY3Rpb25VdGlsLmNyZWF0ZURlbGVnYXRlKHRoaXMub25JbnRlcnZhbCx0aGlzKSwxMDAwLzYwKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChGcmFtZVRpbWVyLEV2ZW50RGlzcGF0Y2hlcik7XG5cbkZyYW1lVGltZXIuVElNRVI9XCJ0aW1lclwiO1xuRnJhbWVUaW1lci5SRU5ERVI9XCJyZW5kZXJcIjtcblxuLyoqXG4gKiBPbiBpbnRlcnZhbC5cbiAqL1xuRnJhbWVUaW1lci5wcm90b3R5cGUub25JbnRlcnZhbD1mdW5jdGlvbigpIHtcblx0dGhpcy5kaXNwYXRjaEV2ZW50KEZyYW1lVGltZXIuVElNRVIpO1xuXHR0aGlzLmRpc3BhdGNoRXZlbnQoRnJhbWVUaW1lci5SRU5ERVIpO1xufVxuXG4vKipcbiAqIEdldCBzaW5nbGV0b24gaW5zdGFuY2UuXG4gKi9cbkZyYW1lVGltZXIuZ2V0SW5zdGFuY2U9ZnVuY3Rpb24oKSB7XG5cdGlmICghRnJhbWVUaW1lci5pbnN0YW5jZSlcblx0XHRGcmFtZVRpbWVyLmluc3RhbmNlPW5ldyBGcmFtZVRpbWVyKCk7XG5cblx0cmV0dXJuIEZyYW1lVGltZXIuaW5zdGFuY2U7XG59XG5cbm1vZHVsZS5leHBvcnRzPUZyYW1lVGltZXI7IiwiLyoqXG4gKiBGdW5jdGlvbiB1dGlscy5cbiAqL1xuZnVuY3Rpb24gRnVuY3Rpb25VdGlsKCkge1xufVxuXG4vKipcbiAqIEV4dGVuZCBhIGNsYXNzLlxuICogRG9uJ3QgZm9yZ2V0IHRvIGNhbGwgc3VwZXIuXG4gKi9cbkZ1bmN0aW9uVXRpbC5leHRlbmQ9ZnVuY3Rpb24odGFyZ2V0LCBiYXNlKSB7XG5cdHRhcmdldC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG5cdHRhcmdldC5wcm90b3R5cGUuY29uc3RydWN0b3I9dGFyZ2V0O1xufVxuXG4vKipcbiAqIENyZWF0ZSBkZWxlZ2F0ZSBmdW5jdGlvbi5cbiAqL1xuRnVuY3Rpb25VdGlsLmNyZWF0ZURlbGVnYXRlPWZ1bmN0aW9uKGZ1bmMsIHNjb3BlKSB7XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRmdW5jLmFwcGx5KHNjb3BlLGFyZ3VtZW50cyk7XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzPUZ1bmN0aW9uVXRpbDtcbiIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xuXG4vKipcbiAqIEEgc3ByaXRlIHdpdGggYSBncmFkaWVudC5cbiAqL1xuZnVuY3Rpb24gR3JhZGllbnQoKSB7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLnN0b3BzID0gW107XG59XG5cbi8qKlxuICogU2V0IHNpemUgb2YgdGhlIGdyYWRpZW50LlxuICovXG5HcmFkaWVudC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHcsIGgpIHtcblx0dGhpcy53aWR0aCA9IHc7XG5cdHRoaXMuaGVpZ2h0ID0gaDtcbn1cblxuLyoqXG4gKiBBZGQgY29sb3Igc3RvcC5cbiAqL1xuR3JhZGllbnQucHJvdG90eXBlLmFkZENvbG9yU3RvcCA9IGZ1bmN0aW9uKHdlaWdodCwgY29sb3IpIHtcblx0dGhpcy5zdG9wcy5wdXNoKHtcblx0XHR3ZWlnaHQ6IHdlaWdodCxcblx0XHRjb2xvcjogY29sb3Jcblx0fSk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBzcHJpdGUuXG4gKi9cbkdyYWRpZW50LnByb3RvdHlwZS5jcmVhdGVTcHJpdGUgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJyZW5kZXJpbmcgZ3JhZGllbnQuLi5cIik7XG5cdHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0Yy53aWR0aCA9IHRoaXMud2lkdGg7XG5cdGMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cblx0dmFyIGN0eCA9IGMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHR2YXIgZ3JkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuaGVpZ2h0KTtcblx0dmFyIGk7XG5cblx0Zm9yIChpID0gMDsgaSA8IHRoaXMuc3RvcHMubGVuZ3RoOyBpKyspXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCh0aGlzLnN0b3BzW2ldLndlaWdodCwgdGhpcy5zdG9wc1tpXS5jb2xvcik7XG5cblx0Y3R4LmZpbGxTdHlsZSA9IGdyZDtcblx0Y3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuXHRyZXR1cm4gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tQ2FudmFzKGMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFkaWVudDsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcIi4vRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIEZ1bmN0aW9uVXRpbCA9IHJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBUaGVuYWJsZSA9IHJlcXVpcmUoXCIuL1RoZW5hYmxlXCIpO1xuXG4vKipcbiAqIE1lc3NhZ2UgY29ubmVjdGlvbiBpbiBhIGJyb3dzZXIuXG4gKiBAY2xhc3MgTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb25cbiAqL1xuZnVuY3Rpb24gTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24oKSB7XG5cdEV2ZW50RGlzcGF0Y2hlci5jYWxsKHRoaXMpO1xuXHR0aGlzLnRlc3QgPSAxO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLCBFdmVudERpc3BhdGNoZXIpO1xuXG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DT05ORUNUID0gXCJjb25uZWN0XCI7XG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5NRVNTQUdFID0gXCJtZXNzYWdlXCI7XG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DTE9TRSA9IFwiY2xvc2VcIjtcblxuLyoqXG4gKiBDb25uZWN0LlxuICogQG1ldGhvZCBjb25uZWN0XG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24odXJsKSB7XG5cdHRoaXMud2ViU29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuXG5cdHRoaXMud2ViU29ja2V0Lm9ub3BlbiA9IHRoaXMub25XZWJTb2NrZXRPcGVuLmJpbmQodGhpcyk7XG5cdHRoaXMud2ViU29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMub25XZWJTb2NrZXRNZXNzYWdlLmJpbmQodGhpcyk7XG5cdHRoaXMud2ViU29ja2V0Lm9uY2xvc2UgPSB0aGlzLm9uV2ViU29ja2V0Q2xvc2UuYmluZCh0aGlzKTtcblx0dGhpcy53ZWJTb2NrZXQub25lcnJvciA9IHRoaXMub25XZWJTb2NrZXRFcnJvci5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiAqIFNlbmQuXG4gKiBAbWV0aG9kIHNlbmRcbiAqL1xuTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24ucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtKSB7XG5cdHRoaXMud2ViU29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobSkpO1xufVxuXG4vKipcbiAqIFdlYiBzb2NrZXQgb3Blbi5cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5vbldlYlNvY2tldE9wZW4gPSBmdW5jdGlvbigpIHtcblx0dGhpcy50cmlnZ2VyKE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLkNPTk5FQ1QpO1xufVxuXG4vKipcbiAqIFdlYiBzb2NrZXQgbWVzc2FnZS5cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5vbldlYlNvY2tldE1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuXG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uTUVTU0FHRSxcblx0XHRtZXNzYWdlOiBtZXNzYWdlXG5cdH0pO1xufVxuXG4vKipcbiAqIFdlYiBzb2NrZXQgY2xvc2UuXG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5wcm90b3R5cGUub25XZWJTb2NrZXRDbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyhcIndlYiBzb2NrZXQgY2xvc2UsIHdzPVwiICsgdGhpcy53ZWJTb2NrZXQgKyBcIiB0aGlzPVwiICsgdGhpcy50ZXN0KTtcblx0dGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcblx0dGhpcy5jbGVhcldlYlNvY2tldCgpO1xuXG5cdHRoaXMudHJpZ2dlcihNZXNzYWdlV2ViU29ja2V0Q29ubmVjdGlvbi5DTE9TRSk7XG59XG5cbi8qKlxuICogV2ViIHNvY2tldCBlcnJvci5cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5vbldlYlNvY2tldEVycm9yID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwid2ViIHNvY2tldCBlcnJvciwgd3M9XCIgKyB0aGlzLndlYlNvY2tldCArIFwiIHRoaXM9XCIgKyB0aGlzLnRlc3QpO1xuXG5cdHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG5cdHRoaXMuY2xlYXJXZWJTb2NrZXQoKTtcblxuXHR0aGlzLnRyaWdnZXIoTWVzc2FnZVdlYlNvY2tldENvbm5lY3Rpb24uQ0xPU0UpO1xufVxuXG4vKipcbiAqIENsZWFyIHRoZSBjdXJyZW50IHdlYiBzb2NrZXQuXG4gKi9cbk1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uLnByb3RvdHlwZS5jbGVhcldlYlNvY2tldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLndlYlNvY2tldC5vbm9wZW4gPSBudWxsO1xuXHR0aGlzLndlYlNvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuXHR0aGlzLndlYlNvY2tldC5vbmNsb3NlID0gbnVsbDtcblx0dGhpcy53ZWJTb2NrZXQub25lcnJvciA9IG51bGw7XG5cblx0dGhpcy53ZWJTb2NrZXQgPSBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VXZWJTb2NrZXRDb25uZWN0aW9uOyIsInZhciBQSVhJID0gcmVxdWlyZShcInBpeGkuanNcIik7XG52YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xuXG4vKipcbiAqIE5pbmUgc2xpY2UuXG4gKi9cbmZ1bmN0aW9uIE5pbmVTbGljZSh0ZXh0dXJlLCBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20pIHtcblx0UElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyLmNhbGwodGhpcyk7XG5cblx0dGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcblxuXHRpZiAoIXRvcClcblx0XHR0b3AgPSBsZWZ0O1xuXG5cdGlmICghcmlnaHQpXG5cdFx0cmlnaHQgPSBsZWZ0O1xuXG5cdGlmICghYm90dG9tKVxuXHRcdGJvdHRvbSA9IHRvcDtcblxuXHR0aGlzLmxlZnQgPSBsZWZ0O1xuXHR0aGlzLnRvcCA9IHRvcDtcblx0dGhpcy5yaWdodCA9IHJpZ2h0O1xuXHR0aGlzLmJvdHRvbSA9IGJvdHRvbTtcblxuXHR0aGlzLmxvY2FsV2lkdGggPSB0ZXh0dXJlLndpZHRoO1xuXHR0aGlzLmxvY2FsSGVpZ2h0ID0gdGV4dHVyZS5oZWlnaHQ7XG5cblx0dGhpcy5idWlsZFBhcnRzKCk7XG5cdHRoaXMudXBkYXRlU2l6ZXMoKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChOaW5lU2xpY2UsIFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcik7XG5cbi8qKlxuICogQnVpbGQgcGFydHMuXG4gKi9cbk5pbmVTbGljZS5wcm90b3R5cGUuYnVpbGRQYXJ0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgeHAgPSBbMCwgdGhpcy5sZWZ0LCB0aGlzLnRleHR1cmUud2lkdGggLSB0aGlzLnJpZ2h0LCB0aGlzLnRleHR1cmUud2lkdGhdO1xuXHR2YXIgeXAgPSBbMCwgdGhpcy50b3AsIHRoaXMudGV4dHVyZS5oZWlnaHQgLSB0aGlzLmJvdHRvbSwgdGhpcy50ZXh0dXJlLmhlaWdodF07XG5cdHZhciBoaSwgdmk7XG5cblx0dGhpcy5wYXJ0cyA9IFtdO1xuXG5cdGZvciAodmkgPSAwOyB2aSA8IDM7IHZpKyspIHtcblx0XHRmb3IgKGhpID0gMDsgaGkgPCAzOyBoaSsrKSB7XG5cdFx0XHR2YXIgdyA9IHhwW2hpICsgMV0gLSB4cFtoaV07XG5cdFx0XHR2YXIgaCA9IHlwW3ZpICsgMV0gLSB5cFt2aV07XG5cblx0XHRcdGlmICh3ICE9IDAgJiYgaCAhPSAwKSB7XG5cdFx0XHRcdHZhciB0ZXh0dXJlUGFydCA9IHRoaXMuY3JlYXRlVGV4dHVyZVBhcnQoeHBbaGldLCB5cFt2aV0sIHcsIGgpO1xuXHRcdFx0XHR2YXIgcyA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlUGFydCk7XG5cdFx0XHRcdHRoaXMuYWRkQ2hpbGQocyk7XG5cblx0XHRcdFx0dGhpcy5wYXJ0cy5wdXNoKHMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJ0cy5wdXNoKG51bGwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFVwZGF0ZSBzaXplcy5cbiAqL1xuTmluZVNsaWNlLnByb3RvdHlwZS51cGRhdGVTaXplcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgeHAgPSBbMCwgdGhpcy5sZWZ0LCB0aGlzLmxvY2FsV2lkdGggLSB0aGlzLnJpZ2h0LCB0aGlzLmxvY2FsV2lkdGhdO1xuXHR2YXIgeXAgPSBbMCwgdGhpcy50b3AsIHRoaXMubG9jYWxIZWlnaHQgLSB0aGlzLmJvdHRvbSwgdGhpcy5sb2NhbEhlaWdodF07XG5cdHZhciBoaSwgdmksIGkgPSAwO1xuXG5cdGZvciAodmkgPSAwOyB2aSA8IDM7IHZpKyspIHtcblx0XHRmb3IgKGhpID0gMDsgaGkgPCAzOyBoaSsrKSB7XG5cdFx0XHRpZiAodGhpcy5wYXJ0c1tpXSkge1xuXHRcdFx0XHR2YXIgcGFydCA9IHRoaXMucGFydHNbaV07XG5cblx0XHRcdFx0cGFydC5wb3NpdGlvbi54ID0geHBbaGldO1xuXHRcdFx0XHRwYXJ0LnBvc2l0aW9uLnkgPSB5cFt2aV07XG5cdFx0XHRcdHBhcnQud2lkdGggPSB4cFtoaSArIDFdIC0geHBbaGldO1xuXHRcdFx0XHRwYXJ0LmhlaWdodCA9IHlwW3ZpICsgMV0gLSB5cFt2aV07XG5cdFx0XHR9XG5cblx0XHRcdGkrKztcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBTZXQgbG9jYWwgc2l6ZS5cbiAqL1xuTmluZVNsaWNlLnByb3RvdHlwZS5zZXRMb2NhbFNpemUgPSBmdW5jdGlvbih3LCBoKSB7XG5cdHRoaXMubG9jYWxXaWR0aCA9IHc7XG5cdHRoaXMubG9jYWxIZWlnaHQgPSBoO1xuXHR0aGlzLnVwZGF0ZVNpemVzKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRleHR1cmUgcGFydC5cbiAqL1xuTmluZVNsaWNlLnByb3RvdHlwZS5jcmVhdGVUZXh0dXJlUGFydCA9IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcblx0dmFyIGZyYW1lID0ge1xuXHRcdHg6IHRoaXMudGV4dHVyZS5mcmFtZS54ICsgeCxcblx0XHR5OiB0aGlzLnRleHR1cmUuZnJhbWUueSArIHksXG5cdFx0d2lkdGg6IHdpZHRoLFxuXHRcdGhlaWdodDogaGVpZ2h0XG5cdH07XG5cblx0cmV0dXJuIG5ldyBQSVhJLlRleHR1cmUodGhpcy50ZXh0dXJlLCBmcmFtZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmluZVNsaWNlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUElYST1yZXF1aXJlKFwicGl4aS5qc1wiKTtcbnZhciBUV0VFTj1yZXF1aXJlKFwidHdlZW4uanNcIik7XG52YXIgRnVuY3Rpb25VdGlsPXJlcXVpcmUoXCIuL0Z1bmN0aW9uVXRpbFwiKTtcbnZhciBDb250ZW50U2NhbGVyPXJlcXVpcmUoXCIuL0NvbnRlbnRTY2FsZXJcIik7XG52YXIgRnJhbWVUaW1lcj1yZXF1aXJlKFwiLi9GcmFtZVRpbWVyXCIpO1xuXG4vKipcbiAqIFBpeGkgZnVsbCB3aW5kb3cgYXBwLlxuICogQ2FuIG9wZXJhdGUgdXNpbmcgd2luZG93IGNvb3JkaW5hdGVzIG9yIHNjYWxlZCB0byBzcGVjaWZpYyBhcmVhLlxuICovXG5mdW5jdGlvbiBQaXhpQXBwKHdpZHRoLCBoZWlnaHQpIHtcblx0aWYgKFBpeGlBcHAuaW5zdGFuY2UpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiT25seSBvbmUgUGl4aUFwcCBwZXIgYXBwXCIpO1xuXG5cdFBpeGlBcHAuaW5zdGFuY2U9dGhpcztcblxuXHRQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIuY2FsbCh0aGlzKTtcblxuXHR2YXIgdmlldztcblxuXHRpZiAobmF2aWdhdG9yLmlzQ29jb29uSlMpXG5cdFx0dmlldz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JlZW5jYW52YXMnKTtcblxuXHRlbHNlXG5cdFx0dmlldz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuLy9cdHRoaXMucmVuZGVyZXI9bmV3IFBJWEkuV2ViR0xSZW5kZXJlcih3aW5kb3cuaW5uZXJXaWR0aCx3aW5kb3cuaW5uZXJIZWlnaHQsdmlldyk7XG5cdHRoaXMucmVuZGVyZXI9bmV3IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLHdpbmRvdy5pbm5lckhlaWdodCx2aWV3KTtcblxuXHRjb25zb2xlLmxvZyhcImFwcGVuZGluZyBjaGlsZCwgZG9jdW1lbnQ6IFwiK2RvY3VtZW50KTtcblx0Y29uc29sZS5sb2coXCJhcHBlbmRpbmcgY2hpbGQsIGRvY3VtZW50LmJvZHk6IFwiK2RvY3VtZW50LmJvZHkpO1xuXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci52aWV3KTtcblxuXHRkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbj0wO1xuXHRkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmc9MDtcblxuXHRkb2N1bWVudC5ib2R5Lm9ucmVzaXplPUZ1bmN0aW9uVXRpbC5jcmVhdGVEZWxlZ2F0ZSh0aGlzLm9uV2luZG93UmVzaXplLHRoaXMpO1xuXHR3aW5kb3cub25yZXNpemU9RnVuY3Rpb25VdGlsLmNyZWF0ZURlbGVnYXRlKHRoaXMub25XaW5kb3dSZXNpemUsdGhpcyk7XG5cbi8qXHR2YXIgcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRzLmlubmVySFRNTD1cImhlbGxvXCI7XG5cdHMuc3R5bGUuYmFja2dyb3VuZD1cIiNmZmZmZmZcIjtcblx0cy5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCI7XG5cdHMuc3R5bGUubGVmdD1cIjBcIjtcblx0cy5zdHlsZS50b3A9XCIzMHB4XCI7XG5cblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKTsqL1xuXG5cdHRoaXMuY29udGVudFNjYWxlcj1udWxsO1xuXG5cdHRoaXMuYXBwU3RhZ2U9bmV3IFBJWEkuU3RhZ2UoMCx0cnVlKTtcblxuXHQvL2NvbnNvbGUubG9nKFwiaW06IFwiK3RoaXMuYXBwU3RhZ2UuaW50ZXJhY3Rpb25NYW5hZ2VyKTtcblxuXHRpZiAoIXdpZHRoIHx8ICFoZWlnaHQpXG5cdFx0dGhpcy51c2VOb1NjYWxpbmcoKTtcblxuXHRlbHNlXG5cdFx0dGhpcy51c2VTY2FsaW5nKHdpZHRoLGhlaWdodCk7XG5cblx0RnJhbWVUaW1lci5nZXRJbnN0YW5jZSgpLmFkZEV2ZW50TGlzdGVuZXIoRnJhbWVUaW1lci5SRU5ERVIsdGhpcy5vbkFuaW1hdGlvbkZyYW1lLHRoaXMpO1xufVxuXG5GdW5jdGlvblV0aWwuZXh0ZW5kKFBpeGlBcHAsUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKTtcblxuLyoqXG4gKiBVc2Ugc2NhbGluZyBtb2RlLlxuICovXG5QaXhpQXBwLnByb3RvdHlwZS51c2VTY2FsaW5nPWZ1bmN0aW9uKHcsIGgpIHtcblx0dGhpcy5yZW1vdmVDb250ZW50KCk7XG5cblx0dGhpcy5jb250ZW50U2NhbGVyPW5ldyBDb250ZW50U2NhbGVyKHRoaXMpO1xuXHR0aGlzLmNvbnRlbnRTY2FsZXIuc2V0Q29udGVudFNpemUodyxoKTtcblx0dGhpcy5jb250ZW50U2NhbGVyLnNldFNjcmVlblNpemUod2luZG93LmlubmVyV2lkdGgsd2luZG93LmlubmVySGVpZ2h0KTtcblx0dGhpcy5hcHBTdGFnZS5hZGRDaGlsZCh0aGlzLmNvbnRlbnRTY2FsZXIpO1xufVxuXG4vKipcbiAqIFVzZSBubyBzY2FsaW5nIG1vZGUuXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLnVzZU5vU2NhbGluZz1mdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVDb250ZW50KCk7XG5cblx0dGhpcy5hcHBTdGFnZS5hZGRDaGlsZCh0aGlzKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW55IGNvbnRlbnQuXG4gKiBJbnRlcm5hbC5cbiAqL1xuUGl4aUFwcC5wcm90b3R5cGUucmVtb3ZlQ29udGVudD1mdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuYXBwU3RhZ2UuY2hpbGRyZW4uaW5kZXhPZih0aGlzKT49MClcblx0XHR0aGlzLmFwcFN0YWdlLnJlbW92ZUNoaWxkKHRoaXMpO1xuXG5cdGlmICh0aGlzLmNvbnRlbnRTY2FsZXIpIHtcblx0XHR0aGlzLmFwcFN0YWdlLnJlbW92ZUNoaWxkKHRoaXMuY29udGVudFNjYWxlcilcblx0XHR0aGlzLmNvbnRlbnRTY2FsZXI9bnVsbDtcblx0fVxufVxuXG4vKipcbiAqIFdpbmRvdyByZXNpemUuXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLm9uV2luZG93UmVzaXplPWZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5jb250ZW50U2NhbGVyKVxuXHRcdHRoaXMuY29udGVudFNjYWxlci5zZXRTY3JlZW5TaXplKHdpbmRvdy5pbm5lcldpZHRoLHdpbmRvdy5pbm5lckhlaWdodCk7XG5cblx0dGhpcy5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsd2luZG93LmlubmVySGVpZ2h0KTtcblxuXHR0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLmFwcFN0YWdlKTtcbn1cblxuLyoqXG4gKiBBbmltYXRpb24gZnJhbWUuXG4gKi9cblBpeGlBcHAucHJvdG90eXBlLm9uQW5pbWF0aW9uRnJhbWU9ZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuYXBwU3RhZ2UpO1xuXHRUV0VFTi51cGRhdGUoKTtcbn1cblxuLyoqXG4gKiBHZXQgY2FudmFzLlxuICovXG5QaXhpQXBwLnByb3RvdHlwZS5nZXRDYW52YXM9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnJlbmRlcmVyLnZpZXc7XG59XG5cbi8qKlxuICogR2V0IHN0YWdlLlxuICovXG5QaXhpQXBwLnByb3RvdHlwZS5nZXRTdGFnZT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYXBwU3RhZ2U7XG59XG5cbm1vZHVsZS5leHBvcnRzPVBpeGlBcHA7IiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgcG9pbnQuXG4gKiBAY2xhc3MgUG9pbnRcbiAqL1xuZnVuY3Rpb24gUG9pbnQoeCwgeSkge1xuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgUG9pbnQpKVxuXHRcdHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG5cblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDsiLCJ2YXIgRnVuY3Rpb25VdGlsID0gcmVxdWlyZShcIi4vRnVuY3Rpb25VdGlsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBQZXJmb3JtIHRhc2tzIGluIGEgc2VxdWVuY2UuXG4gKiBUYXNrcywgd2hpY2ggc2hvdWxkIGJlIGV2ZW50IGRpc3BhdGNoZXJzLFxuICogYXJlIGV1cXVldWVkIHdpdGggdGhlIGVucXVldWUgZnVuY3Rpb24sXG4gKiBhIFNUQVJUIGV2ZW50IGlzIGRpc3BhdGNoZXIgdXBvbiB0YXNrXG4gKiBzdGFydCwgYW5kIHRoZSB0YXNrIGlzIGNvbnNpZGVyZWQgY29tcGxldGVcbiAqIGFzIGl0IGRpc3BhdGNoZXMgYSBDT01QTEVURSBldmVudC5cbiAqIEBjbGFzcyBTZXF1ZW5jZXJcbiAqL1xuZnVuY3Rpb24gU2VxdWVuY2VyKCkge1xuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnF1ZXVlID0gW107XG5cdHRoaXMuY3VycmVudFRhc2sgPSBudWxsO1xuXHR0aGlzLm9uVGFza0NvbXBsZXRlQ2xvc3VyZSA9IHRoaXMub25UYXNrQ29tcGxldGUuYmluZCh0aGlzKTtcbn1cblxuRnVuY3Rpb25VdGlsLmV4dGVuZChTZXF1ZW5jZXIsIEV2ZW50RGlzcGF0Y2hlcik7XG5cblNlcXVlbmNlci5TVEFSVCA9IFwic3RhcnRcIjtcblNlcXVlbmNlci5DT01QTEVURSA9IFwiY29tcGxldGVcIjtcblxuLyoqXG4gKiBFbnF1ZXVlIGEgdGFzayB0byBiZSBwZXJmb3JtZWQuXG4gKiBAbWV0aG9kIGVucXVldWVcbiAqL1xuU2VxdWVuY2VyLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24odGFzaykge1xuXHRpZiAoIXRoaXMuY3VycmVudFRhc2spXG5cdFx0dGhpcy5zdGFydFRhc2sodGFzaylcblxuXHRlbHNlXG5cdFx0dGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xufVxuXG4vKipcbiAqIFN0YXJ0IHRoZSB0YXNrLlxuICogQHByaXZhdGVcbiAqL1xuU2VxdWVuY2VyLnByb3RvdHlwZS5zdGFydFRhc2sgPSBmdW5jdGlvbih0YXNrKSB7XG5cdHRoaXMuY3VycmVudFRhc2sgPSB0YXNrO1xuXG5cdHRoaXMuY3VycmVudFRhc2suYWRkRXZlbnRMaXN0ZW5lcihTZXF1ZW5jZXIuQ09NUExFVEUsIHRoaXMub25UYXNrQ29tcGxldGVDbG9zdXJlKTtcblx0dGhpcy5jdXJyZW50VGFzay5kaXNwYXRjaEV2ZW50KHtcblx0XHR0eXBlOiBTZXF1ZW5jZXIuU1RBUlRcblx0fSk7XG59XG5cbi8qKlxuICogVGhlIGN1cnJlbnQgdGFzayBpcyBjb21wbGV0ZS5cbiAqwqBAcHJpdmF0ZVxuICovXG5TZXF1ZW5jZXIucHJvdG90eXBlLm9uVGFza0NvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY3VycmVudFRhc2sucmVtb3ZlRXZlbnRMaXN0ZW5lcihTZXF1ZW5jZXIuQ09NUExFVEUsIHRoaXMub25UYXNrQ29tcGxldGVDbG9zdXJlKTtcblx0dGhpcy5jdXJyZW50VGFzayA9IG51bGw7XG5cblx0aWYgKHRoaXMucXVldWUubGVuZ3RoID4gMClcblx0XHR0aGlzLnN0YXJ0VGFzayh0aGlzLnF1ZXVlLnNoaWZ0KCkpO1xuXG5cdGVsc2Vcblx0XHR0aGlzLnRyaWdnZXIoU2VxdWVuY2VyLkNPTVBMRVRFKTtcblxufVxuXG4vKipcbiAqIEFib3J0IHRoZSBzZXF1ZW5jZS5cbiAqIEBtZXRob2QgYWJvcnRcbiAqL1xuU2VxdWVuY2VyLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5jdXJyZW50VGFzaykge1xuXHRcdHRoaXMuY3VycmVudFRhc2sucmVtb3ZlRXZlbnRMaXN0ZW5lcihTZXF1ZW5jZXIuQ09NUExFVEUsIHRoaXMub25UYXNrQ29tcGxldGVDbG9zdXJlKTtcblx0XHR0aGlzLmN1cnJlbnRUYXNrID0gbnVsbDtcblx0fVxuXG5cdHRoaXMucXVldWUgPSBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXF1ZW5jZXI7IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCIuL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBGdW5jdGlvblV0aWwgPSByZXF1aXJlKFwiLi9GdW5jdGlvblV0aWxcIik7XG5cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2YgcHJvbWlzZXMgYXMgZGVmaW5lZCBoZXJlOlxuICogaHR0cDovL3Byb21pc2VzLWFwbHVzLmdpdGh1Yi5pby9wcm9taXNlcy1zcGVjL1xuICogQGNsYXNzIFRoZW5hYmxlXG4gKi9cbmZ1bmN0aW9uIFRoZW5hYmxlKCkge1xuXHRFdmVudERpc3BhdGNoZXIuY2FsbCh0aGlzKVxuXG5cdHRoaXMuc3VjY2Vzc0hhbmRsZXJzID0gW107XG5cdHRoaXMuZXJyb3JIYW5kbGVycyA9IFtdO1xuXHR0aGlzLm5vdGlmaWVkID0gZmFsc2U7XG5cdHRoaXMuaGFuZGxlcnNDYWxsZWQgPSBmYWxzZTtcblx0dGhpcy5ub3RpZnlQYXJhbSA9IG51bGw7XG59XG5cbkZ1bmN0aW9uVXRpbC5leHRlbmQoVGhlbmFibGUsIEV2ZW50RGlzcGF0Y2hlcik7XG5cbi8qKlxuICogU2V0IHJlc29sdXRpb24gaGFuZGxlcnMuXG4gKiBAbWV0aG9kIHRoZW5cbiAqIEBwYXJhbSBzdWNjZXNzIFRoZSBmdW5jdGlvbiBjYWxsZWQgdG8gaGFuZGxlIHN1Y2Nlc3MuXG4gKiBAcGFyYW0gZXJyb3IgVGhlIGZ1bmN0aW9uIGNhbGxlZCB0byBoYW5kbGUgZXJyb3IuXG4gKiBAcmV0dXJuIFRoaXMgVGhlbmFibGUgZm9yIGNoYWluaW5nLlxuICovXG5UaGVuYWJsZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7XG5cdGlmICh0aGlzLmhhbmRsZXJzQ2FsbGVkKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgdGhlbmFibGUgaXMgYWxyZWFkeSB1c2VkLlwiKTtcblxuXHR0aGlzLnN1Y2Nlc3NIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpO1xuXHR0aGlzLmVycm9ySGFuZGxlcnMucHVzaChlcnJvcik7XG5cblx0cmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogTm90aWZ5IHN1Y2Nlc3Mgb2YgdGhlIG9wZXJhdGlvbi5cbiAqIEBtZXRob2Qgbm90aWZ5U3VjY2Vzc1xuICovXG5UaGVuYWJsZS5wcm90b3R5cGUubm90aWZ5U3VjY2VzcyA9IGZ1bmN0aW9uKHBhcmFtKSB7XG5cdGlmICh0aGlzLmhhbmRsZXJzQ2FsbGVkKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgdGhlbmFibGUgaXMgYWxyZWFkeSBub3RpZmllZC5cIik7XG5cblx0dGhpcy5ub3RpZnlQYXJhbSA9IHBhcmFtO1xuXHRzZXRUaW1lb3V0KHRoaXMuZG9Ob3RpZnlTdWNjZXNzLmJpbmQodGhpcyksIDApO1xufVxuXG4vKipcbiAqIE5vdGlmeSBmYWlsdXJlIG9mIHRoZSBvcGVyYXRpb24uXG4gKiBAbWV0aG9kIG5vdGlmeUVycm9yXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS5ub3RpZnlFcnJvciA9IGZ1bmN0aW9uKHBhcmFtKSB7XG5cdGlmICh0aGlzLmhhbmRsZXJzQ2FsbGVkKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgdGhlbmFibGUgaXMgYWxyZWFkeSBub3RpZmllZC5cIik7XG5cblx0dGhpcy5ub3RpZnlQYXJhbSA9IHBhcmFtO1xuXHRzZXRUaW1lb3V0KHRoaXMuZG9Ob3RpZnlFcnJvci5iaW5kKHRoaXMpLCAwKTtcbn1cblxuLyoqXG4gKiBBY3R1YWxseSBub3RpZnkgc3VjY2Vzcy5cbiAqIEBtZXRob2QgZG9Ob3RpZnlTdWNjZXNzXG4gKiBAcHJpdmF0ZVxuICovXG5UaGVuYWJsZS5wcm90b3R5cGUuZG9Ob3RpZnlTdWNjZXNzID0gZnVuY3Rpb24ocGFyYW0pIHtcblx0aWYgKHBhcmFtKVxuXHRcdHRoaXMubm90aWZ5UGFyYW0gPSBwYXJhbTtcblxuXHR0aGlzLmNhbGxIYW5kbGVycyh0aGlzLnN1Y2Nlc3NIYW5kbGVycyk7XG59XG5cbi8qKlxuICogQWN0dWFsbHkgbm90aWZ5IGVycm9yLlxuICogQG1ldGhvZCBkb05vdGlmeUVycm9yXG4gKiBAcHJpdmF0ZVxuICovXG5UaGVuYWJsZS5wcm90b3R5cGUuZG9Ob3RpZnlFcnJvciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhbGxIYW5kbGVycyh0aGlzLmVycm9ySGFuZGxlcnMpO1xufVxuXG4vKipcbiAqIENhbGwgaGFuZGxlcnMuXG4gKiBAbWV0aG9kIGNhbGxIYW5kbGVyc1xuICogQHByaXZhdGVcbiAqL1xuVGhlbmFibGUucHJvdG90eXBlLmNhbGxIYW5kbGVycyA9IGZ1bmN0aW9uKGhhbmRsZXJzKSB7XG5cdGlmICh0aGlzLmhhbmRsZXJzQ2FsbGVkKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBuZXZlciBoYXBwZW4uXCIpO1xuXG5cdHRoaXMuaGFuZGxlcnNDYWxsZWQgPSB0cnVlO1xuXG5cdGZvciAodmFyIGkgaW4gaGFuZGxlcnMpIHtcblx0XHRpZiAoaGFuZGxlcnNbaV0pIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGhhbmRsZXJzW2ldLmNhbGwobnVsbCwgdGhpcy5ub3RpZnlQYXJhbSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFeGNlcHRpb24gaW4gVGhlbmFibGUgaGFuZGxlcjogXCIgKyBlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZS5zdGFjayk7XG5cdFx0XHRcdHRocm93IGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogUmVzb2x2ZSBwcm9taXNlLlxuICogQG1ldGhvZCByZXNvbHZlXG4gKi9cblRoZW5hYmxlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVzdWx0KSB7XG5cdHRoaXMubm90aWZ5U3VjY2VzcyhyZXN1bHQpO1xufVxuXG4vKipcbiAqIFJlamVjdCBwcm9taXNlLlxuICogQG1ldGhvZCByZWplY3RcbiAqL1xuVGhlbmFibGUucHJvdG90eXBlLnJlamVjdCA9IGZ1bmN0aW9uKHJlYXNvbikge1xuXHR0aGlzLm5vdGlmeUVycm9yKHJlYXNvbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGhlbmFibGU7Il19
