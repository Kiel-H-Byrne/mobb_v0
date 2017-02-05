import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';

import './centerButton.js';
import './closestCards.js';
import './closestCard.js';
import './map.html';

//====== GLOBALS ======

let MAP_ZOOM = 4;

$.getJSON("https://freegeoip.net/json/", {
    format: "jsonp"
}).done(function(data){
    
    //  {"ip":"69.138.161.94","country_code":"US","country_name":"United States","region_code":"MD",
    //  "region_name":"Maryland","city":"Silver Spring","zip_code":"20902","time_zone":"America/New_York",
    //  "latitude":39.0409,"longitude":-77.0445,"metro_code":511}
    let lat = data.latitude;
    let lng = data.longitude;
    let browserLocation = _.object( ['lat', 'lng'], [lat, lng]);
    // console.log("clientLoc is Browser: ", browserLocation);
    Session.set('browserLoc', browserLocation);
    Session.set('clientState', data.region_code);

    //              ---------------- ANALYTICS EVENT ---------------
    // analytics.track( "Browser IP Data", {
    //   title: "Pulled Geo Info",
    //   data: browserLocation
    // });
    // console.log("-= GA : Browser IP Data =-");
});



// ============================= SUBSCRIPTIONS ==================================


Template.map.onCreated( function() {  
    // console.log("-= MAP: Created =-");
    let self = this;
  
    GoogleMaps.ready('map', function(map) {
        
        const offsetCenter = function(latlng, offsetx, offsety) {

        // latlng is the apparent centre-point
        // offsetx is the distance you want that point to move to the right, in pixels
        // offsety is the distance you want that point to move upwards, in pixels
        // offset can be negative
        // offsetx and offsety are both optional

            const scale = Math.pow(2, map.instance.getZoom());

            let worldCoordinateCenter = map.instance.getProjection().fromLatLngToPoint(latlng);
            let pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0);

            let worldCoordinateNewCenter = new google.maps.Point(
                worldCoordinateCenter.x - pixelOffset.x,
                worldCoordinateCenter.y + pixelOffset.y
            );

            let newCenter = map.instance.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

            map.instance.setCenter(newCenter);
            // google.maps.event.trigger(map, "resize");
        };

        //Adding ALT tags to Google Images.       
        $('#googleMap > .map-canvas > div > .gm-style > div:nth-of-type(2) > a > div > img').attr( "alt", "Google Maps" );
        //Adding REL="noopener" to _blank targets
        $('[target="_blank"]').attr("rel", "noopener");
        // console.log("-= MAP: Drawn =-");        
        //====== SET MAP VARIABLES / CONSTANTS ======
 
        // map.instance.setCenter(Session.get('clientLoc') || Session.get('browserLoc'));


        // offsetCenter(Geolocation.latLng(), 50, 0);
        // console.log(Session.get('browserLoc'));

        let clientMarker;

        let markerImage = {
          url: 'img/orange_marker_sm.png'
        };
        let closeMarkerImage = {
          url: 'img/red_marker_sm.png'
        };

        const self_icon = {
            // url: 'img/orange_marker_3_sm.png'
            url: 'img/orange_dot_sm_2.png'
        };
        const self_symbol = {
            path: "M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z",
            fillColor: '#FF0000',
            fillOpacity: 0.8,
            anchor: new google.maps.Point(0,-3),
            strokeWeight: 1,
            scale: 1.3
        };

        //====== watch the database for changes, draw new marker on change. ====== //

        let subscription = self.subscribe('listings_locs', function() {
            let cursor = Listings.find({
                location: { $exists : 1 }, 
                certs: { $exists: 0 }
            });
            console.log("-= MAP.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LISTINGS WITH LOCATIONS =-");
            //find listings that match the same lat/long digits as me (first two digits)

            cursor.observeChanges({
                added: function(id,doc) {
                    //add markers.
                    //For Each Listing, add a marker; every marker opens a global infoWindow and owns events.
                    //===== CONVERT DOC LOCATION FIELD FROM STRINGIFIED ARRAY TO OBJECT LITERAL =====
                    if (doc.location) {
                        let latLng = doc.location.split(",");
                        let lat = Number(latLng[0]);
                        let lng = Number(latLng[1]);
                        let latLngObj = _.object( ['lat', 'lng'], [lat, lng]);

                        //===== LEAVE DOC LOCATION FIELD AS OBJECT LITERAL =====
                        // let latLngObj = doc.location;

                        //--   Place Markers on map
                        let marker = new google.maps.Marker({
                          position: latLngObj,
                          map: map.instance,
                          icon: markerImage,
                        });
                        marker.set('title', doc.name);

                        marker.addListener('click', function() {
                            Session.set('openListing', id);
                            $('#modalInfo').openModal();

                            // Router.go('/', {_id: id});

                        });
                    } // else cannot place marker on map, it does not have lat/lng yet


                }
            });
        });
        // as soon as session = true, let autorun proceed for  geolocate;  
        // then stop outer autorun   

                self.autorun(async () =>{    
                    //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
                    //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
                    if (Session.equals("geoAccepted", true)) {
                      if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
                          console.warn("Geo Error:", Geolocation.error().message);
                          return;
                      } else {
                          let latLng = await Geolocation.latLng();
                          //ofset by a few in x direction, due to split screen. 
                          //want 'center' to be at 3/4th point of screen.
                          // let offsetX = -0.02;
                          // let offsetY = 0.00;
                          // let lat = (latLng.lat + offsetX);
                          // let lng = (latLng.lng + offsetY);
                          // let latLng_offset = {lat: lat , lng: lng};
                          Session.set('clientLoc', latLng);
                          console.log("-= New Geo Coord: ", latLng);

                          //              ---------------- ANALYTICS EVENT ---------------
                          // analytics.track( "Browser IP Data", {
                          //   title: "Pulled Geo Info",
                          //   data: Session.get('clientLoc')
                          // });
                          // console.log("-= GA : Geolocation Obtained =-");

                          if (!latLng)
                              // show spinner?

                              return;

                          if (!clientMarker) {

                              clientMarker = new google.maps.Marker({
                                  position: new google.maps.LatLng(latLng.lat, latLng.lng),
                                  map: map.instance,
                                  icon: self_icon,
                                  title: "My Location",
                                  // animation: google.maps.Animation.BOUNCE,
                              }); 
                              map.instance.setCenter(clientMarker.getPosition());
                              map.instance.setZoom(12);
                          
                          } else {
                              clientMarker.setPosition(latLng);
                              // console.log("set Marker...");
                              //Google Maps does not recenter or rezoom
                              // map.instance.setCenter(clientMarker.getPosition());
                              // map.instance.setZoom(MAP_ZOOM);

                          }

                          // let infoWindow = new google.maps.InfoWindow({
                          //     content: "Here I Am!"
                          // });

                          // clientMarker.addListener('click', function() {
                          //     infoWindow.setContent("Here I Am!");
                          //     infoWindow.open(map, clientMarker);
                          // });
                      }
                    }
                });   
            


        // ========================= DOM Events relating to Map =========================

        // google.maps.event.addDomListener(map, 'center_changed', function() {
        //     google.maps.event.trigger(map, "resize");
        //     console.log("new center");
        // })
    });

});

Template.map.onRendered(function() {
    
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
    geolocationError: function() {
    let error = Geolocation.error();
    // return error && error.message;
    return ;
    },
    mapOptions: function() {

    // / ============================= SET MAP CENTER ==================================    
    //Get Client's Location using W3C HTML5 GeoLocation Standard and set Marker/InfoWindow
    // Requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    let mapCenter;
        // if (!Session.get('browserLoc')) {
            mapCenter = {'lat':39.8333, 'lng':-129.023};
            // console.log("Set mapCenter to 'Off-West Coast':", mapCenter);

        // } else {
        //     mapCenter = Session.get('browserLoc');
        //     // MAP_ZOOM = 12;
        //     console.log("Got mapCenter from Browser:", mapCenter);
        // }

        if (GoogleMaps.loaded() && mapCenter) {
            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: new google.maps.LatLng(mapCenter),
                // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
                zoom: MAP_ZOOM,
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

                // Map styles; snippets from 'Snazzy Maps'.
                styles: 
                    // lightGray 
                    [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#fefefe"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#b2b2b2"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#b3b3b3"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#4f4f4f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#6a6a6a"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dbdbdb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]}]
                    // redGrayScale
                    // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#777777"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-15}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9f1f1f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":"3.76"},{"color":"#f8f8f8"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":"7.59"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
                    // customOrangeGray
                    // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[ {"color":"#FBB03B"}, {"weight": 4} ]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#777777"},{"visibility":"on"}]},{ "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"hue":"#003300"},{"saturation":-80},{"gamma":0.3}, { "visibility": "simple" }]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":-10},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off" }]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-35}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#FBB03B"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":4},{"color":"#484848"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":7.59}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"off"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
            };
        }
    }
});