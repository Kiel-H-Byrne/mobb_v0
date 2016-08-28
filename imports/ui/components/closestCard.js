import { Template } from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';
import './closestCard.html';
import './closestCard.css';

//find user location, compare with all listings, return closest
//when user location changes, compare again.

	//Calculate the route of the shortest distance we found.
	// function calculateRoute(start, end) {
	//     let request = {
	//         origin: start,
	//         destination: end,
	//         travelMode: google.maps.TravelMode.DRIVING
	//     };
	//     directionsService.route(request, function (result, status) {
	//         if (status == google.maps.DirectionsStatus.OK) {
	//             directionsDisplay.setDirections(result);
	//         }
	//     });
	// }

Template.closestCard.onRendered(function() {
	Meteor.subscribe('listings_locs', function() {
	    console.log('-= MAP SUBSCRIBING: All Listing Locations =-');
	    // console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
	});
});

Template.closestCard.helpers({

	getClosest: function(){
		// let latLng = Session.get('clientLoc');
		// console.log(latLng);
		
		GoogleMaps.ready('map', function(map){
				if (Session.get('clientLoc')) {
					let latLng = Session.get('clientLoc');
					let origins = latLng.lat + "," + latLng.lng;
			  // let destinations = ["catonsville, md", "takoma park, md", "bowie, md", "washington, dc", "wheaton, md"];
			  //destinations = array of listing latlngs or addresses

			  
				  let destinations = [];
			  //find only those listings where first two digits of lat/long match the clients first two digits of lat/long
				  Listings.find({}, {limit:25}).forEach(function(doc){
			      destinations.push(doc.location);
				  });
				  console.log(destinations);
				  let service = new google.maps.DistanceMatrixService();
				  service.getDistanceMatrix({
				      origins: [origins], //array of origins
				      destinations: destinations, //array of destinations
				      travelMode: google.maps.TravelMode.DRIVING,
				      unitSystem: google.maps.UnitSystem.IMPERIAL,
				      avoidHighways: false,
				      avoidTolls: false
				  }, function(res, status) {
				      if (status != google.maps.DistanceMatrixStatus.OK) {
			          console.log('Google DistanceMatrixStatus was: ' + status);
				      } else {
		  	        //we only have one origin so there should only be one row
				        let routes = res.rows[0];
				        // console.log(routes);
				        //need to find the shortest 
				        let lowest = Number.POSITIVE_INFINITY;
				        let tmp;
				        let shortestRouteIdx;
				        for (let i = routes.elements.length - 1; i >= 0; i--) {
				            tmp = routes.elements[i].duration.value;
				            if (tmp < lowest) {
				                lowest = tmp;
				                shortestRouteIdx = i;
				            }
				        }
				        //log the routes and duration.
				        // $('#results').html(resultText);
				        
				        // console.log(res.destinationAddresses, routes.elements);
				        let resArray = _.object(res.destinationAddresses, routes.elements);
				        console.log(resArray);
				        //get the shortest route
				        let shortestRoute = resArray[shortestRouteIdx];
				        Session.set('closestListing', shortestRoute);

				        //now we need to map the route.
				        // calculateRoute(origins, shortestRoute)

				      }
				  });
			}
		});
		return true;
	},
	closestName: function() {
		if (Session.get('closestListing')) {
			return Session.get('closestListing')[0];
		}
	},
	closestStats: function() {
		if (Session.get('closestListing')) {
			return Session.get('closestListing')[1];
		}
	},
});


// https://maps.googleapis.com/maps/api/distancematrix/json?origins=38.9972572,-77.02769669999999&destinations=38.951662,-76.766398%7C39.2392145,-77.2795405%7C39.3819982,-76.7830569&key=AIzaSyDQ3ws3vaEiPsRNbEoSZz5-TiabIlcRxRA