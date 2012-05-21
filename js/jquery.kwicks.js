/*!
	Kwicks for jQuery
	Copyright (c) 2008 Jeremy Martin
	http://www.jeremymartin.name/projects.php?project=kwicks
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	Any and all use of this script must be accompanied by this copyright/license notice in its present form.

	5/21/2012: version 2.1.3
*/
;(function($){
	$.kwicks = function(el, options){
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var o, base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el).addClass('kwicks');
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data('kwicks', base);

		base.init = function(){
			var i, j;
			base.options = o = $.extend({}, $.kwicks.defaultOptions, options);

			base.$kwicks = base.$el.children().addClass('kwick-panel');
			base.$el.addClass( (o.isVertical) ? 'vertical' : 'horizontal' );
			base.size = base.$kwicks.size();

			// Variables for events
			o.defaultKwick = parseInt(o.defaultKwick, 10);
			if (o.defaultKwick > base.size - 1) { o.defaultKwick = base.size -1; }
			o.showNext = parseInt(o.showNext, 10); // make sure we're using integers
			base.playing = false;
			base.lastActive = (o.sticky) ? o.defaultKwick : -1;
			base.active = base.lastActive;
			base.$active = base.$kwicks.eq(base.active);

			// Default variables
			base.WoH = (o.isVertical) ? 'height' : 'width'; // WoH = Width or Height
			base.LoT = (o.isVertical) ? 'top' : 'left'; // LoT = Left or Top
			base.normWoH = parseInt( base.$kwicks.eq(0).css(base.WoH), 10); // normWoH = Normal Width or Height
			base.preCalcLoTs = []; // preCalcLoTs = pre-calculated Left or Top's
			base.aniObj = {};

			if (!o.max) {
				o.max = (base.normWoH * base.size) - (o.min * (base.size - 1));
			} else {
				o.min = ((base.normWoH * base.size) - o.max) / (base.size - 1);
			}

			// set width of container ul
			if (o.isVertical) {
				base.$el.css({
					width : base.$kwicks.eq(0).css('width'),
					height : (base.normWoH * base.size) + (o.spacing * (base.size - 1))
				});
			} else {
				base.$el.css({
					width : (base.normWoH * base.size) + (o.spacing * (base.size - 1)),
					height : base.$kwicks.eq(0).css('height')
				});
			}

			// pre calculate left or top values for all kwicks but the first and last
			// i = index of currently hovered kwick, j = index of kwick we're calculating
			for (i = 0; i < base.size; i++) {
				base.preCalcLoTs[i] = [];
				// don't need to calculate values for first or last kwick
				for (j = 1; j < base.size - 1; j++) {
					if (i === j) {
						base.preCalcLoTs[i][j] = j * o.min + (j * o.spacing);
					} else {
						base.preCalcLoTs[i][j] = (j <= i ? (j * o.min) : (j-1) * o.min + o.max) + (j * o.spacing);
					}
				}
			}

			// Pause slideshow on hover
			base.$el
				.bind('mouseenter.kwicksShow', function(){
					if (base.playing) { base.pause(true); }
				})
				.bind('mouseleave.kwicksShow', function(){
					if (base.playing) { base.play(); }
				});

			// loop through all kwick elements
			base.$kwicks.each(function(i) {
				var kwick = $(this);
				$.data(this, 'index', i);

				// add unique class to each kwick
				kwick.addClass('kwick' + (i+1));
				// set initial width or height and left or top values
				// set first kwick
				if (i === 0) {
					kwick.css(base.LoT, 0);
				} else if (i === base.size - 1) {
					// set last kwick
					kwick.css(o.isVertical ? 'bottom' : 'right', 0);
				} else {
				// set all other kwicks
					if (o.sticky) {
						kwick.css(base.LoT, Math.ceil(base.preCalcLoTs[o.defaultKwick][i]));
					} else {
						kwick.css(base.LoT, Math.ceil((i * base.normWoH) + (i * o.spacing)));
					}
				}
				// correct size in sticky mode
				if (o.sticky) {
					if (o.defaultKwick === i) {
						kwick.css(base.WoH, o.max);
						kwick.addClass(o.activeClass);
					} else {
						kwick.css(base.WoH, o.min);
					}
				}
			})
			.css({
				margin: 0,
				position: 'absolute'
			})
			.bind(o.event + '.kwicks', function() {
				var indx = $.data(this, 'index');
				base.openKwick(indx);
			})
			// Reset (collapse) kwicks panel
			.bind(o.eventClose + '.kwicks', function() {
				// check time - in case both 'event' and 'eventClose' are 'click'
				// timestamp broken in jQuery 1.7+, so grabbing a date instead
				var time = (new Date()).getTime();
				if (time - base.lastEvent < 200 && o.event === o.eventClose) { return; }
				base.lastEvent = time;
				if ($(this).hasClass(o.activeClass)){
					base.closeKwick();
				}
			});

			base.triggerEvent('initialized');

		};

		base.openKwick = function(num, playing, callback){
			// I tried pulling the expansion animation out, but the event bindings are
			// inside an each loop - which doesn't look right to me, but I'm being lazy.
			// So, instead of completely rewritting it, I made this shortcut.
			if (/\d/.test(num) && !isNaN(num)) {
				var j, maxDif, prevWoHsMaxDifRatio, percentage,
					prevWoHs = [], // prevWoHs = previous Widths or Heights
					prevLoTs = [], // prevLoTs = previous Left or Tops
					i = parseInt($.trim(num),10), // accepts "  2  "
					kwick = base.$kwicks.eq(i);
				// ignore if out of range or already active
				if (i < 0 || i > base.size - 1 || kwick.hasClass(o.activeClass)) {
					if (typeof callback === 'function') { callback(base); }
					return;
				}
				// save timestamp to prevent closeKwick from running in case 'event' and 'eventClose' are the same
				base.lastEvent = (new Date()).getTime();
				// update active variables & trigger event
				base.$kwicks.stop().removeClass(o.activeClass);
				base.lastActive = base.active;
				base.$active = kwick;
				base.active = $.data(kwick[0], 'index');
				kwick.addClass(o.activeClass);
				if (playing !== true) { base.pause(); }
				base.triggerEvent('init');
				// calculate previous width or heights and left or top values
				for(j = 0; j < base.size; j++) {
					prevWoHs[j] = parseInt( base.$kwicks.eq(j).css(base.WoH), 10);
					prevLoTs[j] = parseInt( base.$kwicks.eq(j).css(base.LoT), 10);
				}
				base.aniObj[base.WoH] = o.max;
				maxDif = o.max - prevWoHs[i];
				prevWoHsMaxDifRatio = prevWoHs[i]/maxDif;

				base.triggerEvent('expanding');
				kwick.animate(base.aniObj, {
					step: function(now) {
						// calculate animation completeness as percentage
						percentage = maxDif !== 0 ? now/maxDif - prevWoHsMaxDifRatio : 1;
						// adjust other elements based on percentage
						base.$kwicks.each(function(j) {
							if (j !== i) {
								base.$kwicks.eq(j).css(base.WoH, Math.ceil(prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage)));
							}
							if (j > 0 && j < base.size - 1) { // if not the first or last kwick
								base.$kwicks.eq(j).css(base.LoT, Math.ceil(prevLoTs[j] - ((prevLoTs[j] - base.preCalcLoTs[i][j]) * percentage)));
							}
						});
					},
					duration: o.duration,
					easing: o.easing,
					complete: function(){
						base.triggerEvent('completed');
						if (typeof callback === 'function') { callback(base); }
					}
				});
			} else {
				if (typeof callback === 'function') { callback(base); }
			}
		};

		// close Kwicks - ignore num, it's just a placeholder from play function
		base.closeKwick = function(num, playing){
			if (o.sticky) { return; }
			if (!playing) { base.pause(); }
			base.triggerEvent('init');
			var i, normDif, percentage,
				prevWoHs = [],
				prevLoTs = [];
			for (i = 0; i < base.size; i++) {
				prevWoHs[i] = parseInt( base.$kwicks.eq(i).css(base.WoH), 10);
				prevLoTs[i] = parseInt( base.$kwicks.eq(i).css(base.LoT), 10);
			}
			base.aniObj[base.WoH] = base.normWoH;
			normDif = base.normWoH - prevWoHs[0];

			base.triggerEvent('collapsing');

			base.$kwicks
				.stop()
				.removeClass(o.activeClass)
				.eq(0).animate(base.aniObj, {
					step: function(now) {
						percentage = normDif !== 0 ? (now - prevWoHs[0])/normDif : 1;
						for (i = 1; i < base.size; i++) {
							base.$kwicks.eq(i).css(base.WoH, Math.ceil(prevWoHs[i] - ((prevWoHs[i] - base.normWoH) * percentage)));
							if (i < base.size - 1) {
								base.$kwicks.eq(i).css(base.LoT, Math.ceil(prevLoTs[i] - ((prevLoTs[i] - ((i * base.normWoH) + (i * o.spacing))) * percentage)));
							}
						}
					},
					duration: o.duration,
					easing: o.easing,
					complete: function(){ base.triggerEvent('completed'); }
				});
		};

		base.play = function(indx, isPlaying){
			// make sure we aren't already playing when play is called again
			if (!isPlaying) { base.pause(); }
			if (!base.playing) {
				base.triggerEvent('playing');
				base.playing = true;
			}
			indx = (typeof indx === "undefined") ? (base.active > -1) ? base.active : 0 : indx;
			// showNext: set to 1 for left-to-right, -1 for right-to-left or 0 for a random slide
			if (o.showNext === 0) {
				indx = base.active;
				while ( indx === base.active ){
					indx = Math.round( Math.random() * (base.size - 1) );
				}
				base.openKwick(indx, true);
			} else {
				base[ (indx < 0 || indx >= base.size) ? 'closeKwick' : 'openKwick'](indx, true);
				indx = (indx >= base.size) ? -1 : indx < 0 ? base.size : indx;
				indx += o.showNext;
			}
			base.timer = setTimeout(function(){
				base.play(indx, true);
			}, o.showDuration );
		};

		base.pause = function(playing){
			clearTimeout(base.timer);
			base.playing = playing || false;
			if (base.playing || playing) { base.triggerEvent('paused'); }
		};

		// Trigger Kwick events
		base.triggerEvent = function(cb){
			base.$el.trigger('kwicks-' + cb, base);
			if ($.isFunction(o[cb])) { o[cb](base); }
		};

		// Methods
		base.isActive = function(){
			return base.$kwicks.hasClass(o.activeClass);
		};
		base.getActive = function(){
			return (base.isActive()) ? base.active : -1;
		};

		// Run initializer
		base.init();
	};

	$.kwicks.defaultOptions = {
		// *** Appearance ***
		max          : null,         // The width or height of a fully expanded kwick element
		min          : null,         // The width or height of a fully collapsed kwick element
		spacing      : 0,            // The width (in pixels) separating each kwick element

		isVertical   : false,        // Kwicks will align vertically if true

		sticky       : false,        // One kwick will always be expanded if true
		defaultKwick : 0,            // The initially expanded kwick (if and only if sticky is true). zero based

		activeClass  : 'active',     // Class added to active (open) kwick

		// *** Interaction ***
		event        : 'mouseenter', // The event that triggers the expand effect
		eventClose   : 'mouseleave', // The event that triggers the collapse effect

		// *** Functionality ***
		duration     : 500,          // The number of milliseconds required for each animation to complete
		easing       : 'swing',      // Custom animation easing (requires easing plugin if anything other than 'swing' or 'linear')

		// *** Slideshow ***
		showDuration : 2000,         // Slideshow duration
		showNext     : 1             // set to 1 for left-to-right, -1 for right-to-left or 0 for a random slide

		// *** Callbacks ***         // not shown, but still available
	};

	$.fn.getkwicks = function(){
		return this.data('kwicks');
	};

	$.fn.kwicks = function(options, callback) {
		return this.each(function(){
			var action, kwicks = $(this).data('kwicks');

			// initialize the slider but prevent multiple initializations
			if (typeof(options) === 'object' && !kwicks) {
				(new $.kwicks(this, options));
			// If options is a number, process as an external link to page #: $(element).anythingSlider(#)
			} else if (kwicks) {
				if (typeof options === "string") {
					action = options.toLowerCase();
					if (action.match('play')) {
						kwicks.play();
					} else if (action.match('pause')) {
						if (kwicks.playing) { kwicks.triggerEvent('paused'); }
						kwicks.pause();
					}
				}
				action = (/\d/.test(options) && !isNaN(options)); // action is undefined
				if (action && options < 0) { // use -1 or "-1" to close kwicks
					kwicks.closeKwick();
				} else if (action) {
					kwicks.openKwick(options, false, callback); // panel#, isPlaying?, one time callback
				}
			}

		});
	};

})(jQuery);
