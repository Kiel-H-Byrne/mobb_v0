import { Meteor } from 'meteor/meteor';

import '/imports/startup/collections/categories.js';
import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';

const json_listings = require('./listings.json');
const json_listings_online = require('./listings_online.json');
const json_bbb = require('./listings_bbb.json');
const json_bbb_online  = require('./listings_bbb_onlines.json');



const readJSON = function(fileName) {
			// console.log(fileName);
	let arrayName = Object.keys(fileName)[0];
	let jsonArray = fileName[Object.keys(fileName)[0]];

	console.log("-= LISTINGS: Seeding from JSON file: '"+ arrayName +"' =-");		
	_.each(jsonArray, function(doc) { 
		Meteor.call('addListing', doc);
	});
};

if (Meteor.isClient) {
	Meteor.subscribe('roles', {
		onReady: function() {
			if (Roles.userHasRole(Meteor.userId(), "admin")) {
				console.log("-= ADMIN: Logged In =-");

				Meteor.subscribe('listings', {
					onReady: function() {
						let max = 517;
						let count = Listings.find().count();
						if (count <= max) {
							console.log("-= LISTINGS Less than " + max + " =-");

							readJSON(json_listings);
							readJSON(json_listings_online);
							readJSON(json_bbb);
							readJSON(json_bbb_online);

						} else {
							// COLLECTION is full
						}
					} 
				});

				Meteor.subscribe('categories', {
					onReady: function() {
						let count = Categories.find().count();
						if ( count === 0) {

							console.log("-= CATEGORIES: Seeding from JSON file =-");
							let json = require('./categories.json'); //with path
							_.each(json, function(doc) { 
								Meteor.call('addCategory', doc);
							});

						} else {
							// COLLECTION is full
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
