import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import './galleryCard.html';

Template.galleryCard.onRendered(function() {
  //WORKING

  //   GoogleMaps.ready('minimap', function(map) {
  //     const params = {
  //       map: map,
  //       name: 'The Spice Suite',
  //       loc: {lat: 38.9738619, lng: -77.01829699999999},
  //     };
  //      const service = new google.maps.places.PlacesService(params.map.instance);
  //     let request2 = {
  //         //name & location & radius (meters).
  //         name: params.name,
  //         location: params.loc,
  //         radius: 100,
  //       };

  //     let callback = function(results,status) {
  //         if (status === google.maps.places.PlacesServiceStatus.OK) {
  //             console.log(results[0]);    
  //             return results[0].place_id;
  //         } else {
  //             console.log(status);
  //         }
  //     };
  //     service.radarSearch(request2,callback);  
  // });

  $(document).ready(function() {
    $('img').on('error', function () {
      console.log("on broken image", this);
      $(this).css({visibility:"hidden"});
    });
  });  
  
});

Template.galleryCard.helpers({
  getImage: function(url, id) {
    // getOGS(url);
    // Meteor.call('convertImage', url);
    Meteor.call('getOG', url, id);
  }
 
});

Template.galleryCard.events({
  // 'click': function(evt,tpl) {
  //   // Session.set('openListing', this._id);
  //   // console.log(this._id);
  // }
  'click .add-place' : function(evt,tpl) {
    Meteor.call('submitPlace',tpl.data);
  },
    'click .get-reviews' : function(evt,tpl) {
      setGReviews(tpl.data.google_id)
  }
});