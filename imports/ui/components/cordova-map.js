
import Listings from '/imports/startup/collections/listings';
import './centerButton.js';
import './loadingScreen.html';
import './cordova-map.html';

//====== APP GLOBALS ======
MAP_ZOOM = 4;

if (Meteor.isCordova) {
  Meteor.startup(function () {
    // do i need deviceReady? 
    let map;
    document.addEventListener('deviceready', function() {
  
      let div = document.getElementById('mobile-map');
      map = plugin.google.maps.Map.getMap(div);
      map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

    }, false);
  
  function onMapReady() {
    var button = document.getElementById("button");
    button.addEventListener("click", onButtonClick);
  }

  function onButtonClick() {

    // Move to the position with animation
    map.animateCamera({
      target: {lat: 37.422359, lng: -122.084344},
      zoom: 17,
      tilt: 60,
      bearing: 140,
      duration: 5000
    }, function() {

      // Add a maker
      map.addMarker({
        position: {lat: 37.422359, lng: -122.084344},
        title: "Welecome to \n" +
               "Cordova GoogleMaps plugin for iOS and Android",
        snippet: "This plugin is awesome!",
        animation: plugin.google.maps.Animation.BOUNCE
      }, function(marker) {

        // Show the info window
        marker.showInfoWindow();

        // Catch the click event
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {

          // To do something...
          alert("Hello world!");

        });
      });
    });
  }

  });
}