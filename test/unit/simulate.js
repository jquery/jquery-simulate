module( "all" );

test( "keyboard events", function() {
	expect( 1 );
	jQuery("<div></div>")
		.appendTo("#qunit-fixture")
		.simulate("keydown", { keyCode: jQuery.simulate.keyCode.PAGE_UP });
	ok( true, "key events do not throw an error" );
});
