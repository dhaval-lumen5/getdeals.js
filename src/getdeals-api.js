
// getdeals api

( function( $ ) {

	var GDSearch = {
		basic: '[form="gd-search-form"]',
		advanced: '[form^="gd-search-field-"]',
	};

	var GDAPI = {

		headers: {},

		search: function() {
			$.ajax( {
				method: 'GET',
				url: 'https://getdeals.co.in/api/v1/search',
				data: this.serializeData(),
				headers: this.headers,
				beforeSend: function() {
					GDAPI.state( 'load' );
				}, success: function( results ) {
					GDAPI.state( 'done' );
					var html = '', n = results.length,
						template = $( '#gd-template-result' ).html();
					for ( var i = 0; i < n; i++ ) {
						html += Mustache.render( template, results[i] );
					}
					var $items = $( html ); // jQuery object
					$( '#gd-search-results' ).append( $items );
					$items.find( '.title' ).trunk8( { lines: 2 } );
					if ( n ) { GDAPI.state( 'more' ); } // n > 0
					else if ( $( '.result' ).length ) { GDAPI.state( 'last' ); }
					else { GDAPI.state( 'none' ); } // no results found
				}, error: function() {
					GDAPI.state( 'error' );
				},
			} );
		},

		state: function( state ) {
			var name = 'gd-api-status-' + state,
				template = $( '#' + name ), html = '';
			if ( template.length ) {
				html = '<div class="gd-api-status ' + name + '">' + template.html() + '</div>';
			}
			$( '#gd-search-footer' ).html( html );
		},

		serializeData: function() {
			var data = [];
			for ( var form in GDSearch ) {
			    if ( GDSearch.hasOwnProperty( form ) ) {
						data.push( $( GDSearch[ form ] ).serialize() );
			    }
			}
			data = data.join( '&' ).replace( /&?[^=&]+=(&|$)/g, '' );
			return data;
		},

		nextPage: function() {
			var input = '[form="gd-search-field-page"]',
		 		page = parseInt( $( input ).val() ) + 1;
			$( input ).val( page ); // update input
			GDAPI.search(); // call GetDeals API
		},

	};

	$( function() {

		// extract parameters from url

		var parameters = window.location.search;
		parameters = $.unserialize( parameters.substring( 1 ) );

		// update search form with values

		for ( var form in GDSearch ) {
	    if ( GDSearch.hasOwnProperty( form ) ) {
				$( GDSearch[ form ] ).unserialize( parameters );
	    }
		}

		// parse Mustache templates, just in case

		$( 'script[type="text/html"]' ).each( function() {
			Mustache.parse( $(this).html() );
		} );

		// call GetDeals API if search

		if ( parameters[ 'q' ] ) { GDAPI.search(); }

		// attach all event handlers

		$( '#gd-app' ).on( 'click', '#gd-load-more-btn', function() {
			GDAPI.nextPage(); // update page number and call GetDeals API
		} );

		$( '#gd-app' ).on( 'click', '#gd-try-again-btn', function() {
			GDAPI.search(); // use same search data and call GetDeals API
		} );

		$( '#footer a[href="#about-getdeals"]' ).on( 'click', function( event ) {
			event.preventDefault(); // prevent default link behaviour
			$( '#gd-search' ).hide(); // hide search section
			$( '#gd-about' ).show(); // show about section
		} );

	} );

	// public function for API credentials

	window.getdeals = function( credentials ) {
		GDAPI.headers = credentials; // credentials used as headers
	};

} )( jQuery );
