import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullPage.html';

Template.fullPage.onCreated(function() {
  if (!this.data.google_id) {
    //submit to google places
    Meteor.call('submitPlace',this.data);
  } 
});

Template.fullPage.onRendered(function() {
  let tpl = this;

    $(document).ready(function() {
      $('.editModal-trigger').modal();
      $('select').material_select();
    // $('pinned').pushpin({
    //   top: 0,
    //   offset: 0
    // });

      setGReviews(tpl.data.google_id);

      $("img").error(function() { 
        // $(this).hide();
        try {
          $("img").each(function() {
            $(this).attr("src", $(this).attr("src").replace("http://", "https://"));
          });
        } catch (e) {
          $(this).css({visibility:"hidden", display:"none"});   
        }
        
      });
    


    });
});

Template.fullPage.events({

});

Template.fullPage.helpers({
  isPlace: function() {
    let check1 = this.google_id;
    if (check1) {
      let check2 = check1.charAt(0) === 'C'; //is from google
      if (check1 && check2) {
        return true;
      }
    }
  },
  isOpen: function(doc) {
    let check = doc.opening_hours.open_now;
    return check;
  },
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
          // icon: { url: 'img/orange_marker_sm.png' }
        });
      });

        if (GoogleMaps.loaded() && mapCenter) {

          return {
            // ============================= RETURN MAP OPTIONS ==================================    
            center: new google.maps.LatLng(mapCenter),
            zoom: 14,
            // mapTypeId:google.maps.MapTypeId.TERRAIN,
            backgroundColor: "#444",
            clickableIcons: false,
            disableDefaultUI: true,
            // fullscreenControl: true,
            minZoom: 15,
            maxZoom: 20,
            scrollwheel: false,
            streetViewControl: false,
            draggable: false,
            gestureHandling: 'none',
            styles: 
              // customOrangeGray
              [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[ {"color":"#FBB03B"}, {"weight": 4} ]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#777777"},{"visibility":"on"}]},{ "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"hue":"#003300"},{"saturation":-80},{"gamma":0.3}, { "visibility": "simple" }]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":-10},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off" }]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-35}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#FBB03B"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":4},{"color":"#484848"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":7.59}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"off"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
          }
       }
    },
    isPhoto: function(doc) {
      let options = {'maxWidth': 150, 'maxHeight': 150}
      // let url = doc.getUrl(options);
      let photos = Session.get('thisPlace').photos;
      if (photos) {
        console.log(photos);
      }
      // return options;

    },
    getImage: function(url, id) {
      // getOGS(url);
      Meteor.call('convertImage', url);
      Meteor.call('getOG', url, id);
    },
});

