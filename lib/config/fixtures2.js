import { Meteor } from 'meteor/meteor';

import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';


console.log ("-= FIRST FILE: /lib/config/fixtures2.js =-");
// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/fixtures.js}
	if (Listings.find().count() === 0) {
		let now = new Date().getTime();
	  // create a few listings
    
		// console.log(jsonArr);
		if (Meteor.isClient) {
	  	console.log("-= LISTINGS: Seeding from Client Call 'insertBiz' =-");
			let json = require('./mdbiz.json'); //with path
			_.each(json.Listings, function(doc) { 
			  Meteor.call('insertBiz', doc);
			});
		}
	} else {
		console.log("-= Listings: Seeded =-");
	}