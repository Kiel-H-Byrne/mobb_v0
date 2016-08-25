import { Template } from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';
import './closestCard.html';
import './closestCard.css';

//find user location, compare with all listings, return closest
//when user location changes, compare again.
Meteor.subscribe('listings_all');
let checkDistance = function() {
	//origins = user geolocation
	if (Geolocation.latLng()) {
		let latLng = Geolocation.latLng();
			let origins = latLng.lat + "," + latLng.lng;
			//destinations = array of listing latlngs or addresses
			let destinations = [];
			Listings.find().forEach(function(doc){
				destinations.push(doc.location);
			});
			console.log(origins, destinations);	

			let service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix({
			    origins: [origins], //array of origins
		        destinations: destinations, //array of destinations
		        travelMode: google.maps.TravelMode.DRIVING,
		        unitSystem: google.maps.UnitSystem.METRIC,
		        avoidHighways: false,
		        avoidTolls: false
		    });

		// Meteor.call('getDistance', orig, dest, function(err, res) {
		// 
		// });
	}
};

Template.closestCard.onRendered(function() {
	checkDistance();
});


// https://maps.googleapis.com/maps/api/distancematrix/json?origins=38.9972572,-77.02769669999999&destinations=38.951662,-76.766398%7C39.2392145,-77.2795405%7C39.3819982,-76.7830569&key=AIzaSyDQ3ws3vaEiPsRNbEoSZz5-TiabIlcRxRA