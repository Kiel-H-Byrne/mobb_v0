import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullCard.html';

Template.fullCard.onRendered(function() {
  let tpl = this;

    if (!tpl.data.google_id) {
      //submit to google places
      Meteor.call('submitPlace',tpl.data);
    } 

    $(document).ready(function() {
      $('.editModal-trigger').modal();
      $('ul.tabs').tabs({
        onShow: function(tab) {
          if (tab.selector === '#tab2') {
            setGReviews(tpl.data.google_id);
          }
          if (tab.selector === '#tab3') {
            //get images
        }
      }
    });
  });
});

Template.fullCard.events({

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
            zoom: 16,
            mapTypeId:google.maps.MapTypeId.TERRAIN,
            backgroundColor: "#444",
            clickableIcons: false,
            disableDefaultUI: true,
            // fullscreenControl: true,
            minZoom: 15,
            maxZoom: 20,
            scrollwheel: false,
            streetViewControl: false,
            draggable: false,
            gestureHandling: 'none'
          }
       }
    },
    isPhoto: function() {
      console.log(this);
      let options = {'maxWidth': 150, 'maxHeight': 150}
      return options;

    },
    getPhoto: function() {
      console.log(this);
    },
});