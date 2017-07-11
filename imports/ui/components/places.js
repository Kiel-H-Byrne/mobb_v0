
import Listings from '/imports/startup/collections/listings';
import './centerButton.js';
import './map.html';



//place a search on specific name and location, on insert. 
Template.test.onCreated( function () {  
    // GoogleMaps.ready('map', function(map) {
    //     let service = new google.maps.places.PlaceService(map);
    //     service.nearbySearch({
    //         location: {lat: 34,lng: 34 },
    //         radius: ,
    //         type: ['store']
    //     }, callback);
    // });

    // let callback = function(results,status) {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         console.log(results);    
    //     }
    // };
});

Template.test.helpers({  
    mapOptions: function () {
        let mapCenter = {'lat':39.833, 'lng':-98.583};
        if (GoogleMaps.loaded() && mapCenter) {
            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: new google.maps.LatLng(mapCenter),
                // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
                zoom: 15,
                // mapTypeId:google.`maps.MapTypeId.TERRAIN,
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