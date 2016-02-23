/**
 * Integration JavaScript for PayPal's inline checkout
 *
 * @author jeharrell
 */
if (typeof PAYPAL == 'undefined' || !PAYPAL) {
    var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {
	
	
	var defaultConfigMini = {
		// DOM element which triggers the flow
		trigger: null,
		// Experience for the flow; set to 'mini' to force a popup flow
		expType: 'mini',
		// Merchant can control the NameOnButton feature by setting boolean values		
		sole: 'true',
		// To set stage environment
		stage: null,
		//Merchant/call back function to be called
		callbackFunction: null
	};


	
	/**
	 * Creates an instance of the in-context UI for the Digital Goods flow
	 *
	 * @param {Object} userConfig Overrides to the default configuration 
	 */
	PAYPAL.apps.DGFlowMini = function (userConfig) {
		var that = this;
				
		// storage object for UI elements
		that.UI = {};		
				
		// setup
		that._init(userConfig);
				
		return {
			/**
			 * Public method to add a trigger outside of the constructor
			 *
			 * @param {HTMLElement|String} el The element to set the click event on
			 */
			setTrigger: function (el) {
				that._setTrigger(el);
			},
			
			/** 
			 * Public method to start the flow without a triggering element, e.g. in a Flash movie
			 *
			 * @param {String} url The URL which starts the flow
			 */
			startFlow: function (url) {
				var win = that._render();
                
                if (win.location) {
                    win.location = url;
                } else {
                    win.src = url;
                }
			},
			
			/** 
			 * Public method to close the flow's lightbox
			 */
			closeFlow: function () {
				that._destroy();
			},
			
			/**
			 * Public method to determine if the flow is active
			 */
			 isOpen: function () {
				return that.isOpen;
			 },
			
			getCallbackFunction: function(){
				 return that.callbackFunction;
			 }
		};
	};
	
	
	PAYPAL.apps.DGFlowMini.prototype = {
		
		/**
		 * Name of the iframe that's created
		 */
		name: 'PPDGFrame',
		
		/**
		 * Boolean; true if the flow is active
		 */
		isOpen: false,
		

		/**
		 * Boolean; true if NameOnButton feature is active
		 */
		NoB: true,		
		
		
		/**
		 * Initial setup
		 *
		 * @param {Object} userConfig Overrides to the default configuration: see defaultConfigMini.
		 */
		_init: function (userConfig) {	
			if (userConfig) {
				for (var key in defaultConfigMini) {
					if (typeof userConfig[key] !== 'undefined') {
						this[key] = userConfig[key];
					} else {
						this[key] = defaultConfigMini[key];
					}
				}
			}
			
			
			this.stage = (this.stage == null) ? "www.paypal.com" : "www."+this.stage+".paypal.com:8443";			
			
			if (this.trigger) {
				this._setTrigger(this.trigger);
			}
			
			this._addCSS();
			
			// NoB is started
			if(this.NoB == true && this.sole == 'true'){
				var url = "https://"+ this.stage + "/webapps/checkout/nameOnButton.gif";				
				this._getImage(url, this._addImage);
			}			
		},
		
		
		/**
         * Renders and displays the UI
         *
         * @return {HTMLElement} The window the flow will appear in
         */
		_render: function () {
			var ua = navigator.userAgent,
                win;
			var pollingInterval = 0;
            var winOpened = false;
            // mobile exerience
            if (ua.match(/iPhone|iPod|Android|Blackberry.*WebKit/i)) {
                win = window.open('', this.name);
                winOpened = true;
            //    return win;
            // popup experience
            } else if (this.expType == 'mini') {
                var width = 400,
                    height = 550,
                    left,
                    top;
        
                if (window.outerWidth) {
                    left = Math.round((window.outerWidth - width) / 2) + window.screenX;
                    top = Math.round((window.outerHeight - height) / 2) + window.screenY;
                } else if (window.screen.width) {
                    left = Math.round((window.screen.width - width) / 2);
                    top = Math.round((window.screen.height - height) / 2);
                }

                win = window.open('', this.name, 'top=' + top + ', left=' + left + 
                				                 ', width=' + width + ', height=' + height + 
                				                 ', location=0, status=0, toolbar=0, menubar=0, resizable=0, scrollbars=1');
                winOpened = true;
            }
            if(winOpened){
                pollingInterval = setInterval(function() { 
	                 if (win && win.closed) {
	                     clearInterval(pollingInterval);
	                     if(typeof dgFlowMini != 'undefined' && dgFlowMini != null){	
	                    	 var callbackFunction = dgFlowMini.getCallbackFunction;
	                    	 if(typeof callbackFunction != 'undefined' && callbackFunction != null){
	                    		 var runCallbackFunction = eval(callbackFunction());
	                    		 runCallbackFunction();
	                    	 }
	                     }
	                 }
                 } , 100);	
                
                return win;
            // default experience
            } 
		},
		/**
		 * Embeds the CSS for the UI into the document head
		 */
		_addCSS: function () {
			var css = '',
				styleEl = document.createElement('style');

			// write the styles into the page
			css += '#' + this.name + ' { position:absolute; top:0; left:0; }';
			css += '#' + this.name + ' .panel { z-index:9999; position:relative; }';
			css += '#' + this.name + ' .panel iframe { width:385px; height:550px; border:0; }';
			css += '#' + this.name + ' .mask { z-index:9998; position:absolute; top:0; left:0; background-color:#000; opacity:0.2; filter:alpha(opacity=20); }';
			css += '.nameOnButton { display: inline-block; text-align: center; }';
			css += '.nameOnButton img { border:none; }';

			styleEl.type = 'text/css';
			
			if (styleEl.styleSheet) {
				styleEl.styleSheet.cssText = css;
			} else {
				styleEl.appendChild(document.createTextNode(css));
			}
			
			document.getElementsByTagName('head')[0].appendChild(styleEl);
		},
   
		/**
		 * Adds a click event to an element which initiates the flow
		 *
		 * @param {HTMLElement[]|String[]} el The element to attach the click event to
		 * @return {Boolean} True if the trigger is active and false if it failed
		 */
		_setTrigger: function(el) {
			// process an array if passed 
			if (el.constructor.toString().indexOf('Array') > -1) {
				for (var i = 0; i < el.length; i++) {
					this._setTrigger(el[i]);
				}
		
			// otherwise process a single element	
			} else {	
				el = (typeof el == 'string') ? document.getElementById(el) : el;

				// forms
				if (el && el.form) {
					el.form.target = this.name;
				// links
				} else if (el && el.tagName.toLowerCase() == 'a') {
					el.target = this.name;
				} 
				addEvent(el, 'click', this._triggerClickEvent, this);
								
			}
			
		},
		
		/**
		 * To load the NameOnButton image
		 *
		 * @param {Element} el The trigger is passed
		 */
		
		_getImage: function(url, callback){
		
			// Can be used for addEvent case
			if(typeof this.callback != 'undefined'){
				url = this.url;
				callback = this.callback;				
			}
		
			var self = this;
			var imgElement = new Image();		
			imgElement.src = "";
	
			if(imgElement.readyState){				
				imgElement.onreadystatechange= function(){					
					if (imgElement.readyState == 'complete' || imgElement.readyState == 'loaded'){
						callback(imgElement, self);												
					}				
					
				};		
			}
			else{
				imgElement.onload= function(){					
					callback(imgElement, self);
				};
				
			}
			
			imgElement.src = url;
			
		},		
		
		/**
		 * Place NameOnButton image in on top of the Checkout button
		 *		 
		 * @param {Image} img NameOnButton image is passed
		 * @param {Object} obj Contains config parameters and functions
		 * @param {Element} el The trigger element
		 */			
		
		_addImage: function(img, obj){
		
			if(checkEmptyImage(img)){
			
				var url = "https://"+ obj.stage + "/webapps/checkout/clearNob.gif";				
				
				var wrapperObj = {};			
				wrapperObj.callback = obj._removeImage;
				wrapperObj.url = url;
				wrapperObj.outer = obj;				
			
				var el = obj.trigger;
				
				if(el.constructor.toString().indexOf('Array') > -1){
					for (var i = 0; i < el.length; i++) {
						var tempImg = img.cloneNode(true);
						obj._placeImage(el[i], tempImg, wrapperObj);
					}
				}
				else{
					obj._placeImage(el, img, wrapperObj);
				}
			}
		
		},
		
		/**
		 * Place NameOnButton image in on top of the Checkout button
		 *	
		 * @param {Element} el The trigger element
		 * @param {Image} img NameOnButton image is passed
		 * @param {Object} obj Contains config parameters and logout link		 
		 */		
		
		
		_placeImage: function(el, img, obj){			
			
			el = (typeof el == 'string') ? document.getElementById(el) : el;
			var root = getParent(el);
			
			var spanElement = document.createElement("span");
			spanElement.className = "nameOnButton";
			var lineBreak = document.createElement("br");
			var link = document.createElement("a");
			link.href = "javascript:";

			link.appendChild(img);
			root.insertBefore(spanElement,el);
			spanElement.appendChild(el);
			spanElement.insertBefore(link,el);
			spanElement.insertBefore(lineBreak,el);
			
			obj.span = spanElement;
			obj.link = link;
			obj.lbreak = lineBreak;			
					
			addEvent(link, 'click', obj.outer._getImage, obj);		
		
		},
		
		/**
		 * Place NameOnButton image in on top of the Checkout button
		 *		 
		 * @param {Image} img NameOnButton image is passed
		 * @param {Object} obj Contains config parameters and logout link
		 * @param {Element} el The trigger element
		 */		
		
		_removeImage: function(img, obj){
			if(!checkEmptyImage(img)){
				var el = obj.outer.trigger;				
				if(el.constructor.toString().indexOf('Array') > -1){
					obj.outer._removeMultiImages(obj.outer.trigger);
				}
				else{
					spanElement = obj.span;
					link = obj.link;
					lineBreak = obj.lbreak;
					spanElement.removeChild(link);
					spanElement.removeChild(lineBreak);
				}
			}
		},
		
	
		/**
		 * Place NameOnButton image in on top of the Checkout button
		 *		 
		 * @param {Image} img NameOnButton image is passed
		 */		
		
		_removeMultiImages: function(obj){
		
			for (var i = 0; i < obj.length; i++) {
				obj[i] = (typeof obj[i] == 'string') ? document.getElementById(obj[i]) : obj[i];
				rootNode = getParent(obj[i]);				
				
				if(rootNode.className == 'nameOnButton'){
					lineBreak = getPreviousSibling(obj[i]);
					linkNode = getPreviousSibling(lineBreak);				
					rootNode.removeChild(linkNode);
					rootNode.removeChild(lineBreak);
				}
			}
		},
		
				
		/**
		 * Custom event which fires on click of the trigger element(s)
		 *
		 * @param {Event} e The event object
		 */	
		_triggerClickEvent: function (e) {
			 this._render();
		},
		
		
		/**
		 * Custom event which does some cleanup: all UI DOM nodes, custom events,
		 * and intervals are removed from the current page
		 *
		 * @param {Event} e The event object
		 */
		_destroy: function (e) {
			if (this.isOpen && this.UI.wrapper.parentNode) {
				this.UI.wrapper.parentNode.removeChild(this.UI.wrapper);
			}
			
			if (this.interval) {
				clearInterval(this.interval);
			}			
			
			removeEvent(window, 'unload', this._destroy);
			removeEvent(window, 'message', this._windowMessageEvent);
			
			this.isOpen = false;
		}
	};
	
	/* Helper Methods */
	
	
	/**
	 * Storage object for all events; used to obtain exact signature when 
	 * removing events
	 */
	var eventCache = [];
	
	
	/**
	 * Normalized method of adding an event to an element
	 *
	 * @param {HTMLElement} obj The object to attach the event to
	 * @param {String} type The type of event minus the "on"
	 * @param {Function} fn The callback function to add
	 * @param {Object} scope A custom scope to use in the callback (optional)
	 */
	function addEvent(obj, type, fn, scope) {
		scope = scope || obj; 
		
		var wrappedFn;
		
		if (obj.addEventListener) {
			wrappedFn = function (e) { fn.call(scope, e); };
			obj.addEventListener(type, wrappedFn, false);
		} else if (obj.attachEvent) {
			wrappedFn = function () {
				var e = window.event;
				e.target = e.target || e.srcElement;
				
				e.preventDefault = function () {
					window.event.returnValue = false;
				};
				
				fn.call(scope, e);
			};
			
			obj.attachEvent('on' + type, wrappedFn);
		}
		
		eventCache.push([obj, type, fn, wrappedFn]);
	}
	
	
	/**
	 * Normalized method of removing an event from an element
	 *
	 * @param {HTMLElement} obj The object to attach the event to
	 * @param {String} type The type of event minus the "on"
	 * @param {Function} fn The callback function to remove
	 */
	function removeEvent(obj, type, fn) {
		var wrappedFn, item, len, i;
	
		for (i = 0; i < eventCache.length; i++) {
			item = eventCache[i];
			
			if (item[0] == obj && item[1] == type && item[2] == fn) {
				wrappedFn = item[3];
				
				if (wrappedFn) {
					if (obj.removeEventListener) {
						obj.removeEventListener(type, wrappedFn, false);
					} else if (obj.detachEvent) {
						obj.detachEvent('on' + type, wrappedFn);
					}
				}
			}
		}
	}
	
	/**
	 * Normalized method of getting the corresponding parent element for an element
	 *
	 * @param {HTMLElement} obj The object to get the corresponding parent element
	 */
	
	function getParent(el) {
		do {
			el = el.parentNode;
		} while (el && el.nodeType != 1);
		return el;
	}
	
	/**
	 * Normalized method of getting the corresponding previous sibling element for an element
	 *
	 * @param {HTMLElement} obj The object to get the corresponding previous sibling element
	 */
	
	function getPreviousSibling(el) {
		do {
			el = el.previousSibling;
		} while (el && el.nodeType != 1);
		return el;
	}	
	
	/**
	 * Normalized method of checking empty image
	 *
	 * @param {HTMLElement} obj The object should be an image object
	 */
	
	function checkEmptyImage(img){		
		return (img.width > 1 || img.height > 1);
	}
	
}());

