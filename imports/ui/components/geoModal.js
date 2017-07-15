
import './geoModal.html';

Template.geoModal.onRendered(function () {
  $(document).ready(function (){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('#modalGeo').modal();
  });

});

Template.geoModal.events({
  'click .geo-accept': function(event,templateInstance) {

// --------------- ANALYTICS EVENT ---------------
    analytics.track( "User Accepts", {
      title: "Accepted GeoLocation",
      data: true
    });
    
    Session.set('clientLoc', Geolocation.latLng());
    Session.set('geoAsked', true);
    Session.set('geoAccepted', true);
    $('#modalGeo').modal('close');
  },
  'click .geo-deny': function(event,templateInstance) {
    // evt.preventDefault();
    analytics.track( "User Accepts", {
      title: "Accepted GeoLocation",
      data: false
    });
    Session.set('geoAsked', true);
    Session.set('geoAccepted', false);

    $('#modalGeo').modal('close');
  }
});
