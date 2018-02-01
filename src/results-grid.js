
// search result width

( function( $ ) {

	var make = function() {

		// calculate width

		var grid = '#gd-search-results',
				gridWidth = $( grid ).width(),
				noOfColumns = Math.floor( gridWidth / 240 ),
				itemWidth = ( gridWidth / noOfColumns );

		// grid stylesheet

		var id = grid + '-css', style = $( id );

		if ( style.length === 0 ) {
			style = $( '<style>' ).attr( 'id', id ).appendTo( 'head' );
		}

		style.html( '.result { width:' + itemWidth + 'px; }' );

	}

	$( function() { make(); } ); // dom ready

	$( window ).on( 'resize', function() { make(); } );

} )( jQuery );
