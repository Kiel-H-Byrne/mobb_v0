import { Meteor } from 'meteor/meteor';
import Listings from '/imports/startup/collections/listings';

Meteor.publish('listings_all', function() {
	console.log("-= PUBLISHING: All =-");
	return Listings.find();
});

