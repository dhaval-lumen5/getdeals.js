
// getdeals api

( function( $ ) {

	var search = {
		
		form: '',
		results: '',
		footer: '',

	};

	var api = {

		headers: {},

		search: function() {
			$.ajax( {
				method: 'GET',
				url: 'https://getdeals.co.in/api/v1/search',
				data: this.serializeData(),
				headers: this.headers,
				beforeSend: function() {
					api.state( 'load' );
				}, success: function( results ) {
					api.state( 'done' );
					var html = '', n = results.length,
						template = $( '#gd-template-result' ).html();
					for ( var i = 0; i < n; i++ ) {
						html += Mustache.render( template, results[i] );
					}
					var $items = $( html ); // jQuery object
					$( search.results ).append( $items );
					$items.find( '.title' ).trunk8( { lines: 2 } );
					if ( n ) { api.state( 'more' ); } // n > 0
					else if ( $( '.result' ).length ) { api.state( 'last' ); }
					else { api.state( 'none' ); } // no results found
				}, error: function() {
					api.state( 'error' );
				},
			} );
		},

		state: function( state ) {
			var name = 'gd-api-status-' + state,
				template = $( '#' + name ), html = '';
			if ( template.length ) {
				html = '<div class="gd-api-status ' + name + '">' + template.html() + '</div>';
			}
			$( search.footer ).html( html );
		},

		nextPage: function() {
			var input = $( search.form ).find( 'input[name="page"]' ),
		 		page = parseInt( $( input ).val() ) + 1;
			$( input ).val( page ); // update input
			api.search(); // call GetDeals API
		},

		serializeData: function() {
			var data = $( search.form ).serialize();
			return data.replace( /&?[^=&]+=(&|$)/g, '' );
		},

	};

	var results = {

		grid: function() {
			var gridWidth = $( search.results ).width(),
			noOfColumns = Math.floor( gridWidth / 240 ),
			itemWidth = ( gridWidth / noOfColumns );

			// grid stylesheet

			var id = 'result-css', style = $( '#' + id );

			if ( style.length === 0 ) {
				style = $( '<style>' ).attr( 'id', id ).appendTo( 'head' );
			}

			style.html( '.result { width:' + itemWidth + 'px; }' );
		},

	}

	$( function() {

		// extract parameters from url

		var parameters = window.location.search;
		parameters = $.unserialize( parameters.substring( 1 ) );

		// update search form with values

		$( search.form ).unserialize( parameters );

		// parse Mustache templates, just in case

		$( 'script[type="text/html"]' ).each( function() {
			Mustache.parse( $(this).html() );
		} );

		// create initial results grid

		results.grid();

		// call GetDeals API if search

		if ( parameters[ 'q' ] ) { api.search(); }

		// attach all event handlers

		$( '#gd-search' ).on( 'click', '#gd-load-more-btn', function() {
			api.nextPage(); // update page number and call GetDeals API
		} );

		$( '#gd-search' ).on( 'click', '#gd-try-again-btn', function() {
			api.search(); // use same search data and call GetDeals API
		} );

		$( search.form ).on( 'submit', function( event ) {
			event.preventDefault();
			var action = $( search.form ).attr( 'action' ),
				query = $( search.form ).find( 'input[name="q"]' ).serialize();
			if ( query.length ) { query = '?' + query; }
			window.location = action + query;
		} );

		$( window ).on( 'resize', function() {
			results.grid();
		} );

	} );

	// publicly available api

	window.getdeals = function( configuration ) {
		search.form = configuration.form;
		search.results = configuration.results;
		search.footer = configuration.footer;
		api.headers = configuration.credentials;
	};

} )( jQuery );
