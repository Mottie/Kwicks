$(document).ready(function() {

	$('#basic').kwicks({
		event : 'click',
		eventClose: 'click',
		max : 330,
		spacing : 5,
		completed : function(){
			addMessage('<span class="hilight">something, something,' +
			 ' something... com-plete</span>');
		}
	});

	$('.controller a').click(function(){
		var val = $(this).text();
		if (val != 'Collapse') {
			$('#basic').data('kwicks').openKwick(val);
		} else {
			$('#basic').data('kwicks').closeKwick();
		}
		return false;
	})

	$('#example1').kwicks({
		max: 205,
		spacing: 5
	});

	$('#example2').kwicks({
		max: 205,
		spacing:  5
	});

	$('#example3').kwicks({
		max : 205,
		spacing : 3,
		isVertical : true
	});

	$('#example4').kwicks({
		min : 30,
		spacing : 3,
		isVertical : true
	});

	$('#example5').kwicks({
		min : 30,
		spacing : 3,
		isVertical : true,
		sticky : true,
		event : 'click'
	});

	$('#example6').kwicks({
		max: 320,
		spacing: 5,
		duration: 1500,
		easing: 'easeOutBounce'
	});

	$('#example7').kwicks({
		max: 200,
		duration: 400,
		sticky: true
	});

<!-- events for demo only --->
	$('.kwicks').bind('kwicks-init kwicks-expanding kwicks-collapsing kwicks-completed', function(e, kwicks){
		addMessage('#' + kwicks.el.id + ', panel-' + (kwicks.active + 1) + ' : ' + e.type)
	})

	addMessage = function(m){
		var events = $('.eventsWindow').append( '<li>' + m + '</li>' ).find('li');
		if (events.length > 6) { events.eq(0).remove(); }
	}

});
