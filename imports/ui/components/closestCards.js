import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';

import './closestCards.html';


Template.closestCards.onRendered(function() {
	let subscription = this.subscribe('listings_locs', function() {
	    console.log('-= MAP SUBSCRIBING: All Listing Locations =-');
	    let cursor = Listings.find({}, {_id: 1, location: 1});
	    Session.set('destArray', cursor.fetch());

	    // console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
	});
});


Template.closestCards.helpers({
	getClosest: function(){
		let latLng = Session.get('clientLoc');
		let orig = latLng.lat + "," + latLng.lng;
		let destArray = Session.get('destArray');
		let dests = []

		let res = Meteor.call('getDistances', orig, dests);
		console.log(res);
	}
});