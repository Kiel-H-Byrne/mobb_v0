import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';

import './closestCards.html';


Template.closestCards.onCreated(function() {
	//when page loads, subscribe to the listings and filter out only the locations and ids of each listing, 
	// store them as an array of objects


	let subscription = this.subscribe('listings_locs', function() {
	    console.log('-= MAP SUBSCRIBING: All Listing Locations =-');
	    destArray = [];
	    let cursor = Listings.find({}, {_id: 1, location: 1}).map(function(l) {
	    	let obj = {};
	    	obj._id = l._id;
	    	obj.location = l.location;
	    	destArray.push(obj);
    	});
	  	Session.set('destArray', destArray);
	    // console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
	});
});


Template.closestCards.helpers({
	getClosest: function(){
		console.log("getClosest triggered");
		//return top 3 closest listings.
		//get locations, compare each to origin, return only those that pass a test.
		let latLng = Session.get('clientLoc') || Session.get('browserLoc') ;
		if (latLng) {
			let orig = latLng.lat + "," + latLng.lng;
			let locArr = Session.get('destArray');
			//this is array of all object
			let dests = _.map(locArr, function(v) {
				return v.location;
			});
			// console.log(dests.slice(0,4));
			// let res = Meteor.call('getDistances', orig, dests);
			let res = Meteor.call('getDistance2', orig, dests);

			// console.log(res);
			return res;
		}
	}
});