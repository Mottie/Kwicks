/*
	Kwicks for jQuery
	Copyright (c) 2008 Jeremy Martin
	http://www.jeremymartin.name/projects.php?project=kwicks
	
	Licensed under the MIT license:
		http://www.opensource.org/licenses/mit-license.php

	Any and all use of this script must be accompanied by this copyright/license notice in its present form.

	11/8/2010: version 2.0 - Changed plugin format, updated & added a github repository - Rob Garrison
*/

(function($){
	$.kwicks = function(el, options){
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el).addClass('kwicks');
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data('kwicks', base);

		base.init = function(){
			base.options = $.extend({},$.kwicks.defaultOptions, options);

			base.$kwicks = base.$el.children('li');
			base.$el.addClass( (base.options.isVertical) ? 'vertical' : 'horizontal' );
			base.size = base.$kwicks.size();

			// Variables for events
			base.lastActive = base.options.defaultKwick;
			base.active = base.options.defaultKwick;
			base.$active = base.$kwicks.eq(base.active);

			// Default variables
			base.WoH = (base.options.isVertical) ? 'height' : 'width'; // WoH = Width or Height
			base.LoT = (base.options.isVertical) ? 'top' : 'left'; // LoT = Left or Top
			base.normWoH = parseInt( base.$kwicks.eq(0).css(base.WoH), 10); // normWoH = Normal Width or Height
			base.preCalcLoTs = []; // preCalcLoTs = pre-calculated Left or Top's
			base.aniObj = {};

			if (!base.options.max) {
				base.options.max = (base.normWoH * base.size) - (base.options.min * (base.size - 1));
			} else {
				base.options.min = ((base.normWoH * base.size) - base.options.max) / (base.size - 1);
			}

			// set width of container ul
			if (base.options.isVertical) {
				base.$el.css({
					width : base.$kwicks.eq(0).css('width'),
					height : (base.normWoH * base.size) + (base.options.spacing * (base.size - 1))
				});
			} else {
				base.$el.css({
					width : (base.normWoH * base.size) + (base.options.spacing * (base.size - 1)),
					height : base.$kwicks.eq(0).css('height')
				});
			}

			// pre calculate left or top values for all kwicks but the first and last
			// i = index of currently hovered kwick, j = index of kwick we're calculating
			for(var i = 0; i < base.size; i++) {
				base.preCalcLoTs[i] = [];
				// don't need to calculate values for first or last kwick
				for(var j = 1; j < base.size - 1; j++) {
					if(i == j) {
						base.preCalcLoTs[i][j] = base.options.isVertical ? j * base.options.min + (j * base.options.spacing) : j * base.options.min + (j * base.options.spacing);
					} else {
						base.preCalcLoTs[i][j] = (j <= i ? (j * base.options.min) : (j-1) * base.options.min + base.options.max) + (j * base.options.spacing);
					}
				}
			}
			
			// loop through all kwick elements
			base.$kwicks.each(function(i) {
				var kwick = $(this);

				// add class to each kwick
				kwick.addClass('kwick-panel kwick' + (i+1));
				// set initial width or height and left or top values
				// set first kwick
				if (i === 0) {
					kwick.css(base.LoT, 0);
				} 
				// set last kwick
				else if (i == base.size - 1) {
					kwick.css(base.options.isVertical ? 'bottom' : 'right', 0);
				}
				// set all other kwicks
				else {
					if (base.options.sticky) {
						kwick.css(base.LoT, Math.ceil(base.preCalcLoTs[base.options.defaultKwick][i]));
					} else {
						kwick.css(base.LoT, Math.ceil((i * base.normWoH) + (i * base.options.spacing)));
					}
				}
				// correct size in sticky mode
				if (base.options.sticky) {
					if(base.options.defaultKwick == i) {
						kwick.css(base.WoH, base.options.max);
						kwick.addClass(base.options.activeClass);
					} else {
						kwick.css(base.WoH, base.options.min);
					}
				}
				kwick.css({
					margin: 0,
					position: 'absolute'
				});
				
				kwick.bind(base.options.event, function(e) {
					// ignore if already active
					if (kwick.is('.' + base.options.activeClass)) { return; }

					// update active variables & trigger event
					base.$kwicks.stop().removeClass(base.options.activeClass);
					base.lastActive = base.active;
					base.$active = kwick;
					base.active = base.$kwicks.index(kwick);
					kwick.addClass(base.options.activeClass);
					base.triggerEvent('init');
					base.lastEvent = e.timeStamp;

					// calculate previous width or heights and left or top values
					var prevWoHs = [], // prevWoHs = previous Widths or Heights
						prevLoTs = []; // prevLoTs = previous Left or Tops
					for(var j = 0; j < base.size; j++) {
						prevWoHs[j] = parseInt( base.$kwicks.eq(j).css(base.WoH), 10);
						prevLoTs[j] = parseInt( base.$kwicks.eq(j).css(base.LoT), 10);
					}
					base.aniObj[base.WoH] = base.options.max;
					var maxDif = base.options.max - prevWoHs[i],
						prevWoHsMaxDifRatio = prevWoHs[i]/maxDif;

					base.triggerEvent('expanding');
					kwick.animate(base.aniObj, {
						step: function(now) {
							// calculate animation completeness as percentage
							var percentage = maxDif !== 0 ? now/maxDif - prevWoHsMaxDifRatio : 1;
							// adjsut other elements based on percentage
							base.$kwicks.each(function(j) {
								if (j != i) {
									base.$kwicks.eq(j).css(base.WoH, Math.ceil(prevWoHs[j] - ((prevWoHs[j] - base.options.min) * percentage)));
								}
								if (j > 0 && j < base.size - 1) { // if not the first or last kwick
									base.$kwicks.eq(j).css(base.LoT, Math.ceil(prevLoTs[j] - ((prevLoTs[j] - base.preCalcLoTs[i][j]) * percentage)));
								}
							});
						},
						duration: base.options.duration,
						easing: base.options.easing,
						complete: function(){ base.triggerEvent('completed'); }
					});
				});
			});

			// Reset (collapse) kwicks panel
			if (!base.options.sticky) {
				base.$el.bind(base.options.eventClose, function(e) {
					// check timestamp - in case both 'event' and 'eventClose' are 'click'
					if (e.timeStamp - base.lastEvent < 200) { return; }
					base.lastEvent = e.timeStamp;
					base.triggerEvent('init');
					base.closeKwick();
				});
			}
		};

		base.openKwick = function(num){
			// I tried pulling the expansion animation out, but the event bindings are
			// inside an each loop - which doesn't look right to me, but I'm being lazy.
			// So, instead of completely rewritting it, I made this shortcut.
			if (/\d/.test(num) && !isNaN(num)) {
				var n = parseInt($.trim(num),10); // accepts "  2  "
				if (n < 0 || n > base.size - 1) { return; }
				base.$kwicks.eq(n).trigger(base.options.event);
			}
		};

		base.closeKwick = function(){
			if (base.options.sticky) { return; }
			var prevWoHs = [],
				prevLoTs = [];
			for(var i = 0; i < base.size; i++) {
				prevWoHs[i] = parseInt( base.$kwicks.eq(i).css(base.WoH), 10);
				prevLoTs[i] = parseInt( base.$kwicks.eq(i).css(base.LoT), 10);
			}
			base.aniObj[base.WoH] = base.normWoH;
			var normDif = base.normWoH - prevWoHs[0];

			base.triggerEvent('collapsing');

			base.$kwicks
				.stop()
				.removeClass(base.options.activeClass)
				.eq(0).animate(base.aniObj, {
					step: function(now) {
						var percentage = normDif !== 0 ? (now - prevWoHs[0])/normDif : 1;
						for(var i = 1; i < base.size; i++) {
							base.$kwicks.eq(i).css(base.WoH, Math.ceil(prevWoHs[i] - ((prevWoHs[i] - base.normWoH) * percentage)));
							if(i < base.size - 1) {
								base.$kwicks.eq(i).css(base.LoT, Math.ceil(prevLoTs[i] - ((prevLoTs[i] - ((i * base.normWoH) + (i * base.options.spacing))) * percentage)));
							}
						}
					},
					duration: base.options.duration,
					easing: base.options.easing,
					complete: function(){ base.triggerEvent('completed'); }
				});
		};

		// Trigger Kwick events
		base.triggerEvent = function(cb){
			base.$el.trigger('kwicks-' + cb, base);
			if ($.isFunction(base.options[cb])) { base.options[cb](base); }
		};

		// Methods
		base.isActive = function(){
			return base.$kwicks.is('.active');
		};
		base.getActive = function(){
			return (base.isActive()) ? base.active : -1;
		};

		// Run initializer
		base.init();
	};

	$.kwicks.defaultOptions = {
		isVertical   : false,        // Kwicks will align vertically if true
		sticky       : false,        // One kwick will always be expanded if true
		defaultKwick : 0,            // The initially expanded kwick (if and only if sticky is true). zero based
		activeClass  : 'active',     // 
		event        : 'mouseenter', // The event that triggers the expand effect
		eventClose   : 'mouseleave', // The event that triggers the collapse effect
		spacing      : 0,            // The width (in pixels) separating each kwick element
		duration     : 500,          // The number of milliseconds required for each animation to complete
		easing       : 'swing',      // Custom animation easing (requires easing plugin if anything other than 'swing' or 'linear')
		max          : null,         // The width or height of a fully expanded kwick element
		min          : null,         // The width or height of a fully collapsed kwick element

		init         : null,         // event called when the event occurs (click or mouseover)
		expanding    : null,         // event called before kwicks expanding animation begins
		collapsing   : null,         // event called before kwicks collapsing animation begins
		completed    : null          // event called when animation completes
	};

	$.fn.kwicks = function(options){
		return this.each(function(){
			// don't allow multiple instances
			if ($(this).data('kwicks')) { return; }
			(new $.kwicks(this, options));
		});
	};

	$.fn.getkwicks = function(){
		this.data('kwicks');
	};

})(jQuery);
