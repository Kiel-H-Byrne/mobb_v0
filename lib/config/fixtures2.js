import { Meteor } from 'meteor/meteor';

import '/imports/startup/collections/categories.js';
import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';


console.log ("-= FIRST FILE: /lib/config/fixtures2.js =-");
// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/fixtures.js}

const readData = function() {
	console.log("-= LISTINGS: Seeding from JSON file =-");
	let json = require('./listings.json'); //with path
	_.each(json.Listings, function(doc) { 
	  Listings.insert(doc , function(err, res){
	  	console.log(err + "," + res, doc.name);
	  });
	});
};

if (Meteor.isClient) {
	Meteor.subscribe('roles', {
		onReady: function() {
			if (Roles.userHasRole(Meteor.userId(), "admin")) {
				console.log("-= ADMIN: Loggin In =-");

				Meteor.subscribe('listings_locs', {
					onReady: function() {
						let max = 60;
						if (Listings.find().count() <= max) {
							console.log("-= LISTINGS Less than " + max + " =-");

							readData();

						} else {
							// console.log("-= Listings: Already Populated =-");
						}
					} 
				});

			} else { 
				// console.log("No Admin");
			return;
			}
		}
	});

}	



if (Meteor.isServer && Categories.find().count() === 0 ) {
// if (Meteor.isServer && Categories.find().count() === 0 && Listings.find().count() !== 0) {
  // create the categories
  		
	console.log("-= CATEGORIES: Seeding from 'categories' JSON File=-");
	// console.log(Listings.find({categories: {$elemMatch: {$in: [ "Business Services" ]}}}).count());
	console.log(Categories.find().count());

	let json = require('./categories.json'); //with path
	_.each(json, function(doc) { 
	  Categories.insert(doc);
	});
} else {
		// console.log("-= Categories: Already Seeded =-");
}