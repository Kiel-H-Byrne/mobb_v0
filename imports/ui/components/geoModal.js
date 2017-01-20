import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './geoModal.html';

Template.geoModal.events({
  'click .geo-accept': function() {
    if (Geolocation.latLng()) {
      let latLng = Geolocation.latLng();
      console.log("client accepted. Geo is: ", latLng);
      Session.set('clientLoc', latLng);
      Session.set('geoAccepted', true);
      GoogleMaps.maps.map.instance.setCenter(latLng);
      GoogleMaps.maps.map.instance.setZoom(13);
      $('#modalGeo').closeModal();
    }
  },
  'click .geo-deny': function() {
    Session.set('geoAccepted', false);
    $('#modalGeo').closeModal();
  }
});