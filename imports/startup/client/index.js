//Import Routes
import './routes.js';

//Import Layouts
import '../../ui/layouts/layout.js';

console.log("-= imports/startup/client/index.js loaded");

Meteor.startup(function() {

	// AccountsTemplates.configure({
	//   defaultLayout: 'AppLayout',
	// });


	Meteor.typeahead.inject();
	
	GoogleMaps.load({
	  v: '3',
	  key: Meteor.settings.public.keys.googleClient.key,
	  libraries: ['places', 'geometry']
	});

	//=====  HTML Attributes for Facebook opengraph api =====
	$('html').attr({
		'xmlns': 'http://www.w3.org/1999/xhtml',
		'xmlns:fb': 'http://ogp.me/ns/fb#'
	});

	//=====  ServiceWorker installation =====
	if ('serviceWorker' in navigator) {
	  window.addEventListener('load', function() {
	    navigator.serviceWorker.register('/sw.js').then(function(registration) {
	      // Registration was successful
	      console.log('ServiceWorker registration successful with scope: ', registration.scope);
	    }).catch(function(err) {
	      // registration failed :(
	      console.log('ServiceWorker registration failed: ', err);
	    });
	  });
	}

});


