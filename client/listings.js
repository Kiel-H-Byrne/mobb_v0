import Listings from '/imports/startup/collections/listings';

Meteor.subscribe('listings', function() {
	console.log('-= Subscription: "Listings" =-');
	console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
	this.stop();
})
