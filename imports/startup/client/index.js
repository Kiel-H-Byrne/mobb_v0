//Import Routes
import './routes.js';

//Import Layouts & Templates
import '../../ui/layouts/layout.js';

console.log("-= imports/startup/client/index.js loaded");

Meteor.startup(function() {
	GoogleMaps.load({
	  v: '3',
	  key: Meteor.settings.public.keys.googleClient.key
	});

//===============================  HTML Attributes for Facebook opengraph api ===============================  
	$('html').attr({
		'xmlns': 'http://www.w3.org/1999/xhtml',
		'xmlns:fb': 'http://ogp.me/ns/fb#'
	});
});

