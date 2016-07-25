import Listings from '/imports/startup/collections/listings';

Meteor.subscribe('listings', function() {
	console.log('subscribing...');
	console.log(Listings.find().fetch());
	this.stop();
})
