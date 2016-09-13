import { Meteor } from 'meteor/meteor';

import '/imports/startup/collections/categories.js';

import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';


console.log ("-= FIRST FILE: /lib/config/fixtures2.js =-");
// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/fixtures.js}


if (Meteor.isClient) {
	Meteor.subscribe('roles', {
		onReady: function() {
			if (Roles.userHasRole(Meteor.userId(), "admin")) {
				console.log("-= ADMIN: Loggin In =-");

				Meteor.subscribe('listings_all', {
					onReady: function() {
						if (Listings.find().count() === 0) {
			  // create a few listings
			  	// console.log(jsonArr);
					  	console.log("-= LISTINGS: Seeding from Client Call 'insertBiz' =-");
							let json = require('./listings.json'); //with path
							_.each(json.Listings, function(doc) { 
							  // Meteor.call('insertBiz', doc);
							  Listings.insert(doc , function(err, res){
							  	// console.log(err + "," + res);
							  });
							});
						} else {
							console.log("-= Listings: Seeded =-");
						}
					} 
				});

			} else { 
			//No Admin
			return;
			}
		}
	});

}	




if (Meteor.isServer && Categories.find().count() === 0 && Listings.find().count() !== 0) {
  // create the categories
  		
	console.log("-= CATEGORIES: Seeding from 'categories' JSON File=-");
	// console.log(Listings.find({categories: {$elemMatch: {$in: [ "Business Services" ]}}}).count());
	// console.log(Listings.find().count());

	let json = require('./categories.json'); //with path
	_.each(json, function(doc) { 
	  Categories.insert(doc);
	});
} else {
	console.log("-= Categories: Already Seeded =-");
}