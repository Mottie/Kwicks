# Kwicks 2.0.0 Released

* Jeremy Martin has released an [offical Kwicks update of version 2.0.0](http://devsmash.com/blog/kwicks-2-dot-0-dot-0).
* Please use his [Kwicks](https://github.com/jmar777/kwicks) Github repository, as I will stop development on this fork.

## Forked version (no longer in development)

###**Features**

* Updated version of [Kwicks for jQuery 1.5.1](http://www.jeremymartin.name/projects.php?project=kwicks) by Jeremy Martin.
* Horizontal and Vertical Modes.
* Min vs. Max - Specify the width/height of all non-active kwicks instead.
* Sticky Mode - When enabled, one kwick will always be open. This allows for more of an "accordion" type experience.
* Custom Trigger Events - specify a trigger event for the opening &ampl closing animation.
* Smooth Animation.
* Get or set the active kwick, or collapse all kwicks.
* Event hooks &amp; callbacks added to allow extension of the plugin.
* Run a slideshow of the panels.

###**Demos &amp; Documentation**
* [Demo](http://mottie.github.com/Kwicks)
* [Basic Demo](http://mottie.github.com/Kwicks/basic.html)
* [Playground](http://jsfiddle.net/Mottie/DGEQn/)
* [Home](https://github.com/Mottie/Kwicks/wiki)
* [Setup](https://github.com/Mottie/Kwicks/wiki/Setup)
* [Methods](https://github.com/Mottie/Kwicks/wiki/Methods)
* [Callbacks](https://github.com/Mottie/Kwicks/wiki/Callbacks)
* [Theming](https://github.com/Mottie/Kwicks/wiki/Theming)
* [Change](https://github.com/Mottie/Kwicks/wiki/Change)

###**Recent Changes**

#### Version 2.1.3 (5/21/2012)

* Modified how kwick panels are indexed. This should fix [issue #6](https://github.com/Mottie/Kwicks/issues/6) which involves using kwicks with [PIE](http://css3pie.com/).
* Added `package.json` file for registration with jQuery plugins. 

#### Version 2.1.2 (2/16/2012)

* Added an `initialized` callback which is triggered/called after Kwicks has initialized.
* Fixed an issue with setting options `showNext` to `-1` and `sticky` to `true` not showing the last kwick.

#### Version 2.1.1 (11/28/2011)

* Kwick no longer opens if you mouseenter & mouseleave quickly. Fix for [issue #2](https://github.com/Mottie/Kwicks/issues/2).

#### Version 2.1 (11/24/2011)

* Fixed a problem that was happening in jQuery v1.7+ ([bug report](https://github.com/Mottie/Kwicks/issues/1)) where the kwicks would not collapse. Fix for [issue #1](https://github.com/Mottie/Kwicks/issues/1).
* Added slideshow options:
 * `showDuration` - Slideshow duration in milliseconds (default is 2000 ms).
 * `showNext` - Slideshow method; `1` goes forward, `-1` goes backwards and `0` shows a random panel (default is 1).
 * Start or stop the slideshow as follows:

        ```javascript
        // start slideshow
        $('#kwick').kwicks('play');
        // stop slideshow
        $('#kwick').kwicks('pause');
        ```

 * Included `playing` and `paused` callbacks
 * Included `kwicks-playing` and `kwicks-paused` events.
 * Hovering over the kwicks will pause the slideshow. If `event` and `eventClose` are set to `click`, then the slideshow will resume when unhovered.
* Added shortcut method to open and close kwicks:
 * Open Kwick example (zero based index): `$('#kwick').kwicks(1);`.
 * Close Kwick example (use any negative number): `$('#kwick').kwicks(-1);`.
* Added shortcut callback method:
 * Open or close Kwicks with a callback

        ```javascript
        $('#kwicks').kwicks(1, function(obj){ // obj = kwicks object
          alert('Now on panel #' + obj.active);
        });
        ```

* The `<ul>` and `<li>` structure is no longer required - use any elements.
* Added a ".kwicks" namespace to internal events (event, eventClose, etc) - this doesn't change the callback/events that are triggered.
* Updated demo page to follow HTML5 formatting.
* General script cleanup.
* Moved documentation to the wiki pages.
