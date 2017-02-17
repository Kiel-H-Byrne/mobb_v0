import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

const successful = function(position) {
    let geoloc = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
    };
};

getLocation = function(callback) {
    console.log('Attempting getLocation()');
    navigator.geolocation.getCurrentPosition(function(pos){
        successful(pos);
        console.log("getLocation() successful...", pos);
        typeof callback === 'function' && callback(geoloc);
    }, function(err){
        console.warn("getLocation() failed....", err);
    });
};

const setCenter = function(pos) {
    GoogleMaps.maps.map.instance.setCenter(pos);
    GoogleMaps.maps.map.instance.setZoom(12);
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

      if (Session.equals("geoAccepted", true) && Session.get("clientLoc")) {
        let loc = Session.get("clientLoc");
        setCenter(loc);
        $('#modalGeo').closeModal();
        return;
      } else if (Session.equals("geoAccepted", true) && !Session.get("clientLoc")) {

        getLocation(function(pos){
          console.log("Pulling from satellite...");
          let loc = {"lat": pos.longitude, "lng": pos.latitude};
          console.log(loc);
          setCenter(loc);
          $('#modalGeo').closeModal();
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