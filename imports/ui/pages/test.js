import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './test.html';
import './closestPage.js';
//place a search on specific name and location, on insert. 
Template.test.onCreated( function() {  
    $(document).ready(function() {
      $('.dpdwn').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: true // Stops event propagation
      });

      $('.dropdown-button').dropdown();      
    });

    GoogleMaps.ready('minimap', function(map) {
        let service = new google.maps.places.PlacesService(map.instance);
        let request = {
            placeId: 'ChIJdT5Y94TIt4kRcIAIK6khBm4'
        };
        let request2 = {
            name: 'The SpiceSuite',
            location: { lat: 39.0163, lng: -76.9799  },
            radius: 10000,
          };

        let callback = function(results,status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results[0]);    
            } else {
                console.log(status);
            }
        };

        // console.log(service);
        // service.getDetails(request, callback);
        // service.nearbySearch(request2, callback);
    });

});

Template.test.helpers({
  greview: function() {
    let review = {};
    return review;
  }, 
  mapOptions: function() {
        let mapCenter = { lat: 39.0163, lng: -76.9799  };
        if (GoogleMaps.loaded() && mapCenter) {
          console.log("Map Loaded");
            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: new google.maps.LatLng(mapCenter),
                // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
                zoom: 9,
                // mapTypeId:google.maps.MapTypeId.TERRAIN,
                backgroundColor: "#444",
                clickableIcons: false,
                disableDefaultUI: true,
                // fullscreenControl: true,
                minZoom: 2,
                streetViewControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
            };
        }
    }
});
