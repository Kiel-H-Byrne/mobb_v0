import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

getLocation2 = async function() {
    let pos = await Geolocation.latLng();
    return pos;
};

setCenter = function(pos) {
    GoogleMaps.maps.map.instance.setCenter(pos);
    GoogleMaps.maps.map.instance.setZoom(12);
};

// let clientMarker;
  
placeMyMarker = function(pos) {
  //would only not exist if the template reloaded and the browser didn't...(dev mode)
  if (!clientMarker) {
    clientMarker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.lat, pos.lng),
      map: GoogleMaps.maps.map.instance,
      icon: {url: 'img/orange_dot_sm_2.png'},
      title: "My Location",
      animation: google.maps.Animation.BOUNCE,
    }); 
    clientRadius = new google.maps.Circle({
      map: GoogleMaps.maps.map.instance,
      center: pos,
      radius: (5 * 1609.34),
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
    'touchstart, click' : function(evt,tpl){
      if (Session.get("clientLoc")) {
        let loc = Session.get("clientLoc");
        // console.log(loc);
        placeMyMarker(loc);
        setCenter(loc);
        // $('#modalGeo').modal('close');
        return;
      } else if (Session.equals("geoAccepted", true) && !Session.get("clientLoc")) {

        getLocation2().then((pos) => {
          Session.set('clientLoc', pos);
          placeMyMarker(pos);
          setCenter(pos);
          return;
        });

      } else if (Session.equals("geoAccepted", false) && Session.equals("geoAsked", true)){ 
        let loc = Session.get('browserLoc');
        setCenter(loc);
        return;
      } else {
        $('#modalGeo').modal('open');
        let loc = Session.get('browserLoc');
        setCenter(loc);
      }
    }
});