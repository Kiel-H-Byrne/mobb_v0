import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullCard.html';

Template.fullCard.onRendered(function() {
  let tpl = this;
  $(document).ready(function() {
    $('.editModal-trigger').modal();
    $('ul.tabs').tabs({
      onShow: function(tab) {
        if (tab.selector === '#tab2') {
          setGReviews(tpl.data.google_id);
        }
      }
    });
  });
});

Template.fullCard.events({
  'click .get-reviews' : function(evt,tpl) {
    setGReviews(tpl.data.google_id)
  }
});

Template.fullCard.helpers({
  microMapOptions: function() {
    // console.log(this.location);
    let locArr = this.location.split(",");
    // console.log(locArr);
    let mapCenter = {
      "lat": Number(locArr[0]),
      "lng": Number(locArr[1])
    };
      GoogleMaps.ready('microMap', function() {
        let marker = new google.maps.Marker({
          position: mapCenter,
          map: GoogleMaps.maps.microMap.instance,
        });
      });

        if (GoogleMaps.loaded() && mapCenter) {

          return {
            // ============================= RETURN MAP OPTIONS ==================================    
            center: new google.maps.LatLng(mapCenter),
            // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
            zoom: 15,
            // mapTypeId:google.maps.MapTypeId.TERRAIN,
            backgroundColor: "#444",
            clickableIcons: false,
            disableDefaultUI: true,
            // fullscreenControl: true,
            minZoom: 2,
            streetViewControl: false,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
          }
       }
    }
});