import Listings from '/imports/startup/collections/listings';
import Info from '/imports/startup/collections/info';

Meteor.publish('listings', function() {
	return Listings.find();
})

Meteor.publish('info', function() {
	return Info.find();
})