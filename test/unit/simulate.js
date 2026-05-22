"use strict";

var key = jQuery.simulate.keyCode,
	clickOptions,
	keyEvents,
	keyOptions;

QUnit.module( "mouse events" );

clickOptions = [ "ctrlKey", "altKey", "shiftKey", "metaKey" ];

QUnit.test( "click on checkbox triggers change", function( assert ) {
	var input = jQuery( "#radiocheckbox-3" ),
		checked = input.prop( "checked" );

	input.simulate( "click" );

	assert.notEqual( checked, input.prop( "checked" ), "checkbox state changed" );
} );

QUnit.test( "click on radio triggers change", function( assert ) {
	var firstRadio = jQuery( "#radiocheckbox-1" ),
		secondRadio = jQuery( "#radiocheckbox-2" ),
		checked = firstRadio.prop( "checked" );

	if ( checked ) {
		secondRadio.simulate( "click" );
	} else {
		firstRadio.simulate( "click" );
	}

	assert.notEqual( checked, firstRadio.prop( "checked" ),
		"radio state changed" );
} );

QUnit.test( "click", function( assert ) {
	assert.expect( 6 );
	jQuery( "<div></div>" ).on( "click", function( event ) {
		assert.ok( true, "click event fired" );
		assert.equal( event.button, 0,
			"click event was fired with left mouse button" );
		assert.equal( event.ctrlKey, false,
			"click event was fired without control key" );
		assert.equal( event.metaKey, false,
			"click event was fired without meta key" );
		assert.equal( event.shiftKey, false,
			"click event was fired without shift key" );
		assert.equal( event.altKey, false,
			"click event was fired without alt key" );
	} ).appendTo( "#qunit-fixture" ).simulate( "click" );
} );

QUnit.test( "click with middle mouse button", function( assert ) {
	assert.expect( 2 );
	jQuery( "<div></div>" ).on( "click", function( event ) {
		assert.ok( true, "click event fired" );
		assert.equal( event.button, 1,
			"click event was fired with middle mouse button" );
	} ).appendTo( "#qunit-fixture" ).simulate( "click", {
		button: 1
	} );
} );

QUnit.test( "click with right mouse button", function( assert ) {
	assert.expect( 2 );
	jQuery( "<div></div>" ).on( "click", function( event ) {
		assert.ok( true, "click event fired" );
		assert.equal( event.button, 2,
			"click event was fired with right mouse button" );
	} ).appendTo( "#qunit-fixture" ).simulate( "click", {
		button: 2
	} );
} );

function testClickEvent( clickOption ) {
	var options = {};
	options[ clickOption ] = true;

	QUnit.test( "click with " + clickOption, function( assert ) {
		assert.expect( 2 );
		jQuery( "<div></div>" ).on( "click", function( event ) {
			assert.ok( true, "click event fired" );
			assert.equal( event[ clickOption ], true,
				"click event was fired with " + clickOption );
		} ).appendTo( "#qunit-fixture" ).simulate( "click", options );
	} );
}

jQuery.each( clickOptions, function( _index, clickOption ) {
	testClickEvent( clickOption );
} );

QUnit.module( "key events" );

keyEvents = [ "keydown", "keyup", "keypress" ];
keyOptions = [ "ctrlKey", "altKey", "shiftKey", "metaKey" ];

function testKeyEvent( keyEvent ) {
	QUnit.test( keyEvent, function( assert ) {
		assert.expect( 2 + keyOptions.length );
		jQuery( "<div></div>" ).on( keyEvent, function( event ) {
			var i = 0;

			assert.ok( true, keyEvent + " event fired" );
			assert.equal( event.keyCode, key.PAGE_UP,
				keyEvent + " event has correct keyCode" );

			for ( i; i < keyOptions.length; i++ ) {
				assert.equal( event[ keyOptions[ i ] ], false,
					keyEvent + " event fired without " +
					keyOptions[ i ] );
			}
		} ).appendTo( "#qunit-fixture" ).simulate( keyEvent, {
			keyCode: key.PAGE_UP
		} );
	} );
}

function testKeyEventOption( keyEvent, keyOption ) {
	QUnit.test( keyEvent + " with " + keyOption, function( assert ) {
		var options = {
			keyCode: key.PAGE_UP
		};
		options[ keyOption ] = true;

		assert.expect( 3 );
		jQuery( "<div></div>" ).on( keyEvent, function( event ) {
			assert.ok( true, keyEvent + " event fired" );
			assert.equal( event.keyCode, key.PAGE_UP,
				keyEvent + " event has correct keyCode" );
			assert.equal( event[ keyOption ], true,
				keyEvent + " event fired with " + keyOption );
		} ).appendTo( "#qunit-fixture" ).simulate( keyEvent, options );
	} );
}

jQuery.each( keyEvents, function( _index, keyEvent ) {
	testKeyEvent( keyEvent );

	jQuery.each( keyOptions, function( _index, keyOption ) {
		testKeyEventOption( keyEvent, keyOption );
	} );
} );


QUnit.module( "complex events" );

QUnit.test( "drag moves option", function( assert ) {

	var done = assert.async(),
		moves = 15,
		calls = 0,
		el = jQuery( "<div class='top-left'></div>" )
			.appendTo( "#qunit-fixture" ),
		position;

	assert.expect( moves + 2 );

	jQuery( document ).on( "mousedown", function( event ) {
		position = {
			clientX: event.clientX,
			clientY: event.clientY
		};
	} ).on( "mousemove", function( event ) {
		assert.ok( true, "mousemove event fired at the document" );
		if ( ++calls === moves ) {
			assert.equal( position.clientX + 10, event.clientX,
				"last mousemove fired at correct clientX" );
			assert.equal( position.clientY + 20, event.clientY,
				"last mousemove fired at correct clientX" );
			jQuery( document ).off( "mousemove" ).off( "mousedown" );
			done();
		}
	} );

	el.simulate( "drag", {
		moves: 1,
		dx: 10,
		dy: 20
	} ).simulate( "drag", {
		moves: 5,
		dx: 10,
		dy: 20
	} );

	// falsey defaults to 3
	el.simulate( "drag", {
		moves: 0,
		dx: 10,
		dy: 20
	} ).simulate( "drag", {
		dx: 10,
		dy: 20
	} ).simulate( "drag", {
		moves: null,
		dx: 10,
		dy: 20
	} );
} );
