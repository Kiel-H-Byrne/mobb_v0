import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

getLocation = async function() {
    const pos = await Geolocation.latLng();
    return pos;
};

targetListing = function(pos) {
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    map.instance.setCenter(pos);
    map.instance.setZoom(12);
};

// let clientMarker;
  
placeMyMarker = function(pos) {
  //would only not exist if the template reloaded and the browser didn't...(dev mode)
  if (!clientMarker) {
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    clientMarker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.lat, pos.lng),
      map: map.instance,
      icon: {url: 'img/orange_dot_sm_2.png'},
      title: "My Location",
      // animation: google.maps.Animation.BOUNCE,
    }); 
    clientRadius = new google.maps.Circle({
      map: map.instance,
      center: pos,
      radius: (3 * 1609.34),
      strokeColor: '#FF7733',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FFAA00',
      fillOpacity: 0.15,
    });
  } else {
    clientMarker.setPosition(pos);
    clientRadius.setCenter(pos);
  }
};


Template.centerButton.helpers( function() {

});

Template.centerButton.onRendered(function() {
  $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
    'click #centerButton_button' : function(evt,tpl){
      if (Session.get("clientLoc")) {
        //I ALREADY HAVE YOUR LOCATION
        const loc = Session.get("clientLoc");
        // console.log(loc);
        placeMyMarker(loc);
        targetListing(loc);
        return;
      } else if ( !Session.get("clientLoc") && Session.equals("geoAccepted", true) ) {
        //I DON'T HAVE YOUR LOCATION, BUT YOU'RE OK WITH ME GETTING IT.
        getLocation().then((pos) => {
          Session.set('clientLoc', pos);
          placeMyMarker(pos);
          targetListing(pos);
          return;
        });
      } else if (Session.equals("geoAccepted", false) && Session.equals("geoAsked", true)){ 
        // I'VE ASKED FOR YOUR LOCATION, BUT YOU DON'T WANT TO GIVE IT.
        const loc = Session.get('browserLoc');
        targetListing(loc);
        return;
      } else {
        //I HAVE NOTHING, ASK IF I CAN DO SOMETHING.
        $('#modalGeo').modal('open');
      }
    }
});