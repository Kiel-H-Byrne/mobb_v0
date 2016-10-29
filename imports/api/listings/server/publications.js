import { Meteor } from 'meteor/meteor';
import Listings from '/imports/startup/collections/listings';

Meteor.publish('listings_locs', function() {
	let cursor = Listings.find({location: { $exists : 1}, certs: {$exists: 0}});
	console.log("-= PUBLISHING: ALL ["+ cursor.count() +"] LISTINGS WITH LOCATIONS =-");
	return cursor;
});


Meteor.publish('listings_cbes', function() {
	let cursor = Listings.find({certs: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] CBE LISTINGS =-");
	return cursor;
});

Meteor.publish('listings_urls', function() {
	let cursor = Listings.find({url: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] LISTINGS W/ URLS =-");
	return cursor;
});

Meteor.publish('listings_social', function() {
	let cursor = Listings.find({social: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] SOCIAL LISTINGS =-");
	return cursor;
});