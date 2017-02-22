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

let clientMarker;
  
placeMyMarker = function(pos) {
  console.log("called");

  if (!clientMarker) {
    console.log("does not exists");
    clientMarker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.lat, pos.lng),
      map: GoogleMaps.maps.map.instance,
      icon: {url: 'img/orange_dot_sm_2.png'},
      title: "My Location",
      // animation: google.maps.Animation.BOUNCE,
    }); 
  } else {
    console.log("all set");
    clientMarker.setPosition(pos);
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
        let loc = Session.get("clientLoc");
        // console.log(loc);
        placeMyMarker(loc);
        setCenter(loc);
        $('#modalGeo').closeModal();
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
        $('#modalGeo').openModal();
        Session.set("geoAsked", true);
        let loc = Session.get('browserLoc');
        setCenter(loc);
      }

    }
});