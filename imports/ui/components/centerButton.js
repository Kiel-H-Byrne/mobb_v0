import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

const successful = function(position) {
    let geoloc = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
    };
};

const getLocation = function(callback) {
    navigator.geolocation.getCurrentPosition(function(pos){
        successful(pos);
        typeof callback === 'function' && callback(geoloc);
    }, function(){
        console.warn("your function failed....");
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

  if (Session.equals("geoAccepted", true)) {

    

  } else {
      console.warn('GeoLocation Request not accepted.');
  }
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