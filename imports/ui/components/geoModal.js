import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './geoModal.html';

Template.geoModal.events({
  'click .geo-accept': function(evt,tpl) {

// --------------- ANALYTICS EVENT ---------------
    analytics.track( "User Accepts", {
      title: "Accepted GeoLocation",
      data: true
    });
    
    Session.set('clientLoc', Geolocation.latLng());
    Session.set('geoAccepted', true);
    $('#modalGeo').modal('close');
  },
  'click .geo-deny': function(evt,tpl) {
    // evt.preventDefault();
    analytics.track( "User Accepts", {
      title: "Accepted GeoLocation",
      data: false
    });

    Session.set('geoAccepted', false);
    $('#modalGeo').modal('close');
  }
});
