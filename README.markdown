**Features**

* Updated version of [Kwicks for jQuery 1.5.1][1] by Jeremy Martin.
* Horizontal and Vertical Modes.
* Min vs. Max - Specify the width/height of all non-active kwicks instead.
* Sticky Mode - When enabled, one kwick will always be open. This allows for more of an "accordion" type experience.
* Custom Trigger Events - specify a trigger event for the opening &ampl closing animation.
* Smooth Animation.
* Get or set the active kwick, or collapse all kwicks.
* Event hooks &amp; callbacks added to allow extension of the plugin.

**Usage & Options** ([Demo][2])

Header:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>
    <script src="js/jquery.easing.1.3.js" type="text/javascript"></script>

    <link href="css/kwicks.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery.kwicks.js" type="text/javascript"></script>

HTML

    <ul id="kwicks1">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>

Script (showing all defaults):

    $('#kwicks1').kwicks({
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
    });

**Methods**

* Expanded Kwick? (if sticky is set to true, this will always return true)

        $('#kwicks1').data('kwicks').isActive(); // returns true if kwick is expanded, or false if collapsed

* Get expanded kwick (index)

        $('#kwicks1').data('kwicks').getActive(); // returns zero based index if kwick is expanded; returns -1 if collapsed

* Set expanded kwick

        $('#kwicks1').data('kwicks').openKwick(2); // opens the third kwick panel (zero based index)

* Collapse kwick (this will not work on sticky kwicks - that just sounds wrong LOL)

        $('#kwicks1').data('kwicks').closeKwick(); // collapses the kwick panel

**Extending**

* Event Hooks (callback functions)

    * <code>kwicks-init</code> (<code>init</code>) - kwick event/eventClose occured, this event occurs before expanding or collapsing the kwick.
    * <code>kwicks-expanding</code> (<code>expanding</code>) - this event occurs only when the kwick is expanding. It is triggered immediately before the animation.
    * <code>kwicks-collapsing</code> (<code>collapsing</code>) - this event occurs only when the kwick is collapsing. It is triggered immediately before the animation.
    * <code>kwicks-completed</code> (<code>completed</code>) - this event occurs after the animation has completed.

* Examples: You can bind to any of these custom event triggers as follows (see the demo page source for another example)

        $('#kwicks1').bind('kwicks-completed', function(e, kwicks){
          alert( 'kwick has completed opening panel #' + kwicks.active );
        })

* or use on of the callback functions

        $('#kwicks').kwicks({
          completed: function(){
            alert('done!'); 
          }
        });

* Callback Arguments ( if you use "kwicks" in the callback function, e.g. function(kwicks){...}, or in the trigger function, e.g. function(e, kwicks){...} these arguments will be available )

    * kwicks.active - index of the active quick (zero based index).
    * kwicks.$active - jQuery object of the active quick (the 'li.active').
    * kwicks.lastActive - index of the last active quick.
    * kwicks.$kwicks - jQuery object containing all kwicks (all the li's).
    * kwicks.$el - jQuery object of the entire kwick (the ul)

**Theming**

From the basic HTML above, classes are added to the Kwick panel as follows:

    <ul id="kwicks1" class="kwicks horizontal">
      <li class="kwick-panel kwick1 active"></li>
      <li class="kwick-panel kwick2"></li>
      <li class="kwick-panel kwick3"></li>
      <li class="kwick-panel kwick4"></li>
    </ul>

* The "horizontal" class will be replaced with "vertical" if <code>isVertical</code> is set to true in the options.
* The "active" class is only applied to expanded panels. The class name can be changed in the options using <code>activeClass</code>.

**Changelog**

Version 2.0 (11/8/2010)

* Original [Kwicks version 1.5.1][1] by Jeremy Martin.
* Made a copy from [Jeremy's google code][3] and added to github.
* Change plugin base pattern to ease use of plugin getters and setters.
* Added custom events & triggers.

  [1]: http://www.jeremymartin.name/projects.php?project=kwicks
  [2]: http://mottie.github.com/Kwicks
  [3]: http://code.google.com/p/kwicks/
