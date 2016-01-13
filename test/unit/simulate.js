(function() {
var IE8Check = window.attachEvent && !window.addEventListener,
	key = jQuery.simulate.keyCode,
	clickOptions,
	keyEvents,
	keyOptions;

module( "mouse events" );

clickOptions = [ "ctrlKey", "altKey", "shiftKey", "metaKey" ];

test( "click on checkbox triggers change", function() {
	var input = $( "#radiocheckbox-3" ),
		checked = input.prop( "checked" );

	input.simulate( "click" );

	notEqual( checked, input.prop( "checked" ), "checkbox state changed" );
});

test( "click on radio triggers change", function() {
	var firstRadio = $( "#radiocheckbox-1" ),
		secondRadio = $( "#radiocheckbox-2" ),
		checked = firstRadio.prop( "checked" );

	if ( checked ) {
		secondRadio.simulate( "click" );
	} else {
		firstRadio.simulate( "click" );
	}

	notEqual( checked, firstRadio.prop( "checked" ), "radio state changed" );
});

test( "click", function() {
	expect( 6 );
	jQuery( "<div></div>" ).bind( "click", function( event ) {
		var value = IE8Check ? 1 : 0;

		ok( true, "click event fired" );
		equal( event.button, value, "click event was fired with left mouse button" );
		equal( event.ctrlKey, false, "click event was fired without control key" );
		equal( event.metaKey, false, "click event was fired without meta key" );
		equal( event.shiftKey, false, "click event was fired without shift key" );
		equal( event.altKey, false, "click event was fired without alt key" );
	}).appendTo( "#qunit-fixture" ).simulate( "click" );
});

test( "click with middle mouse button", function() {
	expect( 2 );
	jQuery( "<div></div>" ).bind( "click", function( event ) {
		var value = IE8Check ? 4 : 1;

		ok( true, "click event fired" );
		equal( event.button, value, "click event was fired with middle mouse button" );
	}).appendTo( "#qunit-fixture" ).simulate( "click", {
		button: 1
	});
});

test( "click with right mouse button", function() {
	expect( 2 );
	jQuery( "<div></div>" ).bind( "click", function( event ) {
		ok( true, "click event fired" );
		equal( event.button, 2, "click event was fired with right mouse button" );
	}).appendTo( "#qunit-fixture" ).simulate( "click", {
		button: 2
	});
});

function testClickEvent( clickOption ) {
	var options = {};
	options[ clickOption ] = true;

	test( "click with " + clickOption, function() {
		expect( 2 );
		jQuery( "<div></div>" ).bind( "click", function( event ) {
			ok( true, "click event fired" );
			equal( event[ clickOption ], true, "click event was fired with " + clickOption );
		}).appendTo( "#qunit-fixture" ).simulate( "click", options);
	});
}

jQuery.each(clickOptions, function( index, clickOption ) {
	testClickEvent( clickOption );
});

module( "key events" );

keyEvents = [ "keydown", "keyup", "keypress" ];
keyOptions = [ "ctrlKey", "altKey", "shiftKey", "metaKey" ];

function testKeyEvent ( keyEvent ) {
	test( keyEvent, function() {
		expect( 2 + keyOptions.length );
		jQuery("<div></div>").bind( keyEvent, function( event ) {
			var i = 0;

			ok( true, keyEvent + " event fired" );
			equal( event.keyCode, key.PAGE_UP, keyEvent + " event has correct keyCode" );

			for ( i; i < keyOptions.length; i++ ) {
				equal( event[ keyOptions[ i ] ], false, keyEvent + " event fired without " + keyOptions[ i ] );
			}
		}).appendTo("#qunit-fixture").simulate( keyEvent, {
			keyCode: key.PAGE_UP
		});
	});
}

function testKeyEventOption ( keyEvent, keyOption ) {
	test( keyEvent + " with " + keyOption, function() {
		var options = {
			keyCode: key.PAGE_UP
		};
		options[ keyOption ] = true;

		expect( 3 );
		jQuery("<div></div>").bind( keyEvent, function( event ) {
			ok( true, keyEvent + " event fired" );
			equal( event.keyCode, key.PAGE_UP, keyEvent + " event has correct keyCode" );
			equal( event[keyOption], true, keyEvent + " event fired with " + keyOption );
		}).appendTo("#qunit-fixture").simulate( keyEvent, options);
	});
}

jQuery.each(keyEvents, function( index, keyEvent ) {
	testKeyEvent( keyEvent );

	jQuery.each(keyOptions, function( index, keyOption ) {
		testKeyEventOption( keyEvent, keyOption );
	});
});


module( "complex events" );

asyncTest( "drag moves option", function() {

	var moves = 15,
		calls = 0,
		el = jQuery("<div class='top-left'></div>").appendTo("#qunit-fixture"),
		position;

	expect( moves + 2 );

	jQuery( document ).bind( "mousedown", function( event ) {
		position = {
			clientX : event.clientX,
			clientY : event.clientY
		};
	}).bind( "mousemove", function( event ) {
		ok( true, "mousemove event fired at the document" );
		if ( ++calls === moves ) {
			equal( position.clientX + 10, event.clientX, "last mousemove fired at correct clientX" );
			equal( position.clientY + 20, event.clientY, "last mousemove fired at correct clientX" );
			jQuery( document ).unbind("mousemove").unbind("mousedown");
			start();
		}
	});

	el.simulate( "drag", {
		moves: 1,
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		moves: 5,
		dx: 10,
		dy: 20
	});

	// falsey defaults to 3
	el.simulate( "drag", {
		moves: 0,
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		moves: null,
		dx: 10,
		dy: 20
	});
});

})();
