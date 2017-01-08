import { Meteor } from 'meteor/meteor';

import '/imports/startup/collections/categories.js';
import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';


console.log ("-= FIRST FILE: /lib/config/fixtures.js =-");
// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/fixtures.js}

if (Meteor.isClient) {
	Meteor.subscribe('roles', {
		onReady: function() {
			if (Roles.userHasRole(Meteor.userId(), "admin")) {
				console.log("-= ADMIN: Logged In =-");

				Meteor.subscribe('listings', {
					onReady: function() {
						let max = 50;
						if (Listings.find().count() <= max) {
							console.log("-= LISTINGS Less than " + max + " =-");

							console.log("-= LISTINGS: Seeding from JSON file =-");
							let json = require('./listings.json'); //with path
							_.each(json.Listings, function(doc) { 
								Meteor.call('addListing', doc);
							});

						} else {
							console.log("-= LISTINGS: Populated =-");
						}
					} 
				});

				Meteor.subscribe('categories', {
					onReady: function() {
						if (Categories.find().count() === 0) {

							console.log("-= CATEGORIES: Seeding from JSON file =-");
							let json = require('./categories.json'); //with path
							_.each(json, function(doc) { 
								Meteor.call('addCategory', doc);
							});

						} else {
							console.log("-= CATEGORIES: Populated =-");
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
