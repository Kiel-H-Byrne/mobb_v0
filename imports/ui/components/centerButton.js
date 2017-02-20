import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';
console.log("before map?");
const successful = function(position) {
    let geoloc = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
    };
};

getLocation =function(callback) {
    console.log('Attempting getLocation()');
    navigator.geolocation.getCurrentPosition(function(pos){
        successful(pos);
        let loc = {"lat": pos.longitude, "lng": pos.latitude};
        Session.set('clientLoc', loc);
        console.log("getLocation() successful...", loc);
        // typeof callback === 'function' && callback(pos);
    }, function(err){
        console.warn("getLocation() failed....", err);
    });
};

getLocation2 = async function() {
    console.log('Attempting getLocation2()');
    let pos = await Geolocation.latLng();
    return pos;
};

setCenter = function(pos) {
    GoogleMaps.maps.map.instance.setCenter(pos);
    GoogleMaps.maps.map.instance.setZoom(12);
};

placeMyMarker = function(pos) {
    if (!clientMarker) {
    clientMarker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: GoogleMaps.maps.map.instance,
        icon: {url: 'img/orange_dot_sm_2.png'},
        title: "My Location",
        // animation: google.maps.Animation.BOUNCE,
    }); 
    GoogleMaps.maps.map.instance.setCenter(clientMarker.getPosition());
    GoogleMaps.maps.map.instance.setZoom(12);
  } else {
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

        // getLocation(function(pos){
        //   console.log("Pulling from satellite...");
        //   let loc = {"lat": pos.longitude, "lng": pos.latitude};
        //   setCenter(loc);
        //   $('#modalGeo').closeModal();
        //   return;
        // });

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