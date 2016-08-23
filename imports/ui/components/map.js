import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';
import './infowindow.js';
import './map.html';

// ============================= SUBSCRIPTIONS ==================================


Template.map.onCreated( function() {  
	console.log("-= MAP: Drawn =-");

    Meteor.subscribe('listings_all', function() {
        console.log('-= MAP SUBSCRIBING: All Listings =-');
        // console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
    });

//Get Client's Location using IP INFO
//     $.getJSON("http://ipinfo.io", function(data){
//         console.log("-=IP INFO: SET=-");
//         // console.log(data);
//         Session.set('ipInfo', data);

//         if (Meteor.user()) {
//             Meteor.users.update({ 
//                 _id : Meteor.user()._id
//                 }, { 
//                 $set: { 
//                     profile : data 
//                 } 
//             });
//         }

// //      ---------------- ANALYTICS EVENT ---------------
//         analytics.track( "Browser IP Data", {
//           title: "Pulled Geo Info",
//           data: data
//         });
//         console.log("-= GA : Browser IP Data =-");

//     });
//Get Client's Location using W3C HTML5 GeoLocation Standard and set Marker/InfoWindow
      // Requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            Session.set('clientLoc', pos);
//      ---------------- ANALYTICS EVENT ---------------
            analytics.track( "Geolocation Success", {
              title: "Successfully Geolocated"
            });
            console.log("-= GA : Geo Success =-");
          }, function() {
            // handleLocationError(true, markerInfo, map.getCenter());
//      ---------------- ANALYTICS EVENT ---------------
            analytics.track( "Geolocation Fail", {
              title: "Failed Geolocate"
            });
            console.log("-= GA : Geo Fail =-");

            console.log("Could Not Get Location.");
          });
        } else {
          // Browser doesn't support Geolocation
//      ---------------- ANALYTICS EVENT ---------------
            analytics.track( "Geolocation Fail", {
              title: "Unsupported Browser Failed Geo",
            });
            console.log("-= GA : Bad Browser =-");
            console.log("Browser Does Not Support GeoLocation.");
          //get info from IP
          // handleLocationError(false, markerInfo, map.getCenter());
        }
      

      // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      //   infoWindow.setPosition(pos);
      //   infoWindow.setContent(browserHasGeolocation ?
      //                         'Error: The Geolocation service failed.' :
      //                         'Error: Your browser doesn\'t support geolocation.');
      // }

   
  GoogleMaps.load({
      v: '3',
      key: Meteor.settings.public.keys.googleClient.key
  });

//COLLECTION DOES NOT EXIST OUT HERE YET ... FOR SOME REASON..

    GoogleMaps.ready('map', function(map) {

        console.log("-= MAP SUBSCRIBED:  ["+ Listings.find().count() + "] Listings");


        let markerImage = {
          url: 'img/orange_marker_sm.png',
          // size: new google.maps.Size(50,50), 
          // origin: new google.maps.Point(0,0),
          // anchor: new google.maps.Point(0,50)
        };
        //trying to set one global infowindow and each click sets its content; a blaze template.
        let markerInfo = new google.maps.InfoWindow({
              content: "",
              maxWidth: 400
            });
//For Each Listing, add a marker; every marker opens a global infoWindow and owns events.
        Listings.find().forEach(function(doc){

            //listingLoc needs to be google latLng object literal; 
            let nums = doc.location.split(",");
            let lat = Number(nums[0]);
            let lng = Number(nums[1]);
            let listingLoc = _.object( ['lat', 'lng'], [lat, lng]);
            // console.log(listingLoc);

            //--   Place Markers on map
            let marker = new google.maps.Marker({
              position: listingLoc,
              map: map.instance,
              icon: markerImage,
            });
            marker.set('title', doc.name);
            marker.info = markerInfo;

            let clientMarker = new google.maps.Marker({
                position: Centers.User,
                map: map.instance,
                icon: {
                    url: 'img/orange_marker_4_sm.png'
                },
                animation: google.maps.Animation.BOUNCE,
                title: "Your Location"
            });

            // Click for Info Panel
            // let infoContent = Blaze.toHTMLWithData(Template.infowindow, doc);
            // //console.log(infoContent);        
            // marker.info = new google.maps.InfoWindow({
            //   content: infoContent,
            //   maxWidth: 300
            // });

            marker.addListener('click', function() {
                let infoContent = Blaze.toHTMLWithData(Template.infowindow, doc);
                this.info.setContent(infoContent);
                this.info.open(map.instance, this);
                $(".phone").text(function(i, text) {
                  text = text.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
                  return text;
                });
            });

        // google.maps.event.addListener(marker,'click',function() {
        // //   marker.info.setContent(this.info.content);
        // //   marker.info.open(map.instance, this);    
        //   let currentZoom = map.instance.getZoom();
        //   if(currentZoom <= 14){
        //     map.instance.setZoom(17);
        //     map.instance.setCenter(this.getPosition());
        //   }
        //   else{
        //     // map.instance.setZoom(14);
        //     map.instance.setCenter(this.getPosition());
        //   }
        // });

            //     var cirColor = getColor(listing);
                // var circle = new google.maps.Circle({
                //     strokeColor: "#FFeeDD",
                //     strokeOpacity: 0.8,
                //     strokeWeight: 1,
                //     fillColor: "#EEEEEE",
                //     fillOpacity: 0.05,
                //     map: map.instance,
                //     center: Centers.User,
                //     radius: 100,
                // });
                
            // Hover for Info-Windows
            // google.maps.event.addListener(marker, 'mouseover', function() {     
            //     console.log(this);
            //   marker.info.setContent(this.name);
            //   marker.info.open(map.instance, this);
            // });

        });

    
// ========================= Client Info =========================

        // Show User Location
        // var marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(Session.get('lat'), Session.get('lng')),
        //   icon: 'http://maps.gstatic.com/mapfiles/markers2/icon_green.png',
        //   map: map.instance,
        //   title: "Your Location"
        // });


// ========================= DOM Events relating to Map =========================

        /*
         * The google.maps.event.addListener() event waits for
         * the creation of the infowindow HTML structure 'domready'
         * and before the opening of the infowindow defined styles
         * are applied.
         */


        // google.maps.event.addDomListener(window, 'resize', function() {
        //     var center = GoogleMaps.maps.map.instance.getCenter();
        //     google.maps.event.trigger(map, "resize");
        //     GoogleMaps.maps.map.instance.setCenter(center);
        // })
    });

});

Template.map.onRendered(function() {
    // console.log("map rendered...");
//Materialize JQuery Effects
    $(document).ready(function(){
        $('.modal-trigger').leanModal({
            dismissible: true,
            opacity: 0.5,
            in_duration: 300,
            out_duration: 200,
            ready: function() {
                if($(".lean-overlay").length > 1) {
                    $(".lean-overlay:not(:first)").each(function() {
                        $(this).remove();
                    });
                }
            },
            complete: function() {
                $(".lean-overlay").each(function() {
                    $(this).remove();
                });
            }
        });
    });

});


// ============================= HELPERS ==================================


Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {

// / ============================= SET MAP CENTER ==================================    
        Centers = {
          Na : {"lat":39.90973623453719, "lng":-105.29296875},
        };
        
        if (Session.get('clientLoc')) {
            Centers.User = Session.get('clientLoc');
            console.log('Setting Client Location: ', Centers.User );
        }        
        // if (Meteor.user()) {
        //     let loc = Meteor.user().profile.loc;
        //     if (loc) {let userLoc = loc.split(",");
        //         Centers.User = {"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) };
        //         console.log("User location: " + userLoc);
        //     }
        // } else {
        //     let ipInfo = Session.get('ipInfo');
        //     let loc = ipInfo.loc;
        //     if (loc) {
        //         let userLoc = loc.split(",");
        //         Centers.User = {"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) } ;
        //         console.log("Browser location: "+ userLoc);
        //     }
        // }

// / ============================= RENDER MAP W/ OPTIONS ==================================    

        return {
            center: new google.maps.LatLng(Centers.User),
            // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
            zoom: 14,
            // mapTypeId:google.maps.MapTypeId.TERRAIN,
            backgroundColor: "#555555",
            clickableIcons: false,
            disableDefaultUI: true,
            // fullscreenControl: true,
            minZoom: 5,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },

            // Map styles; snippets from 'Snazzy Maps'.
           
            styles: 
            // lightGray 
            // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#fefefe"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#b2b2b2"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#b3b3b3"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#4f4f4f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#6a6a6a"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dbdbdb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]}]
            // redGrayScale
            // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#777777"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-15}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9f1f1f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":"3.76"},{"color":"#f8f8f8"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":"7.59"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
            // customOrangeGray
            [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[ {"color":"#FBB03B"}, {"weight": 4} ]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#777777"},{"visibility":"on"}]},{ "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"hue":"#003300"},{"saturation":-80},{"gamma":0.3}, { "visibility": "simple" }]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":-10},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off" }]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-35}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#FBB03B"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":4},{"color":"#484848"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":7.59}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"off"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
      };
    }
  }
});
  
