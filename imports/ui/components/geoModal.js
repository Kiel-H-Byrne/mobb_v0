import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './geoModal.html';

Template.geoModal.events({
  'click .geo-accept': async function(evt,tpl) {
    evt.preventDefault();

// --------------- ANALYTICS EVENT ---------------
    analytics.track( "User Accept", {
      title: "Accepted GeoLocation",
      data: true
    });
    
    Session.set('geoAccepted', true);
    $('#modalGeo').closeModal();
  
  },
  'click .geo-deny': function(evt,tpl) {
    // evt.preventDefault();
    analytics.track( "User Accept", {
      title: "Accepted GeoLocation",
      data: false
    });
    Session.set('geoAccepted', false);
    $('#modalGeo').closeModal();
  }
});
