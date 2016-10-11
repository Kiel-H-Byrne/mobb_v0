import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';
import './centerButton.js';
import './closestCard.js';
import './map.html';

//====== GLOBALS ======

let MAP_ZOOM = 4;

// ============================= SUBSCRIPTIONS ==================================


Template.map.onCreated( function() {  
	console.log("-= MAP: Created =-");
    let self = this;

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
        analytics.track( "Browser IP Data", {
          title: "Pulled Geo Info",
          data: browserLocation
        });
        console.log("-= GA : Browser IP Data =-");
    });

    
    GoogleMaps.ready('map', function(map) {
        console.log("-= MAP: Drawn =-");        

        //====== SET MAP VARIABLES / CONSTANTS ======
        let clientMarker;

        let markerImage = {
          url: 'img/orange_marker_sm.png'
        };
        let closeMarkerImage = {
          url: 'img/red_marker_sm.png'
        };

        let self_icon = {
            // url: 'img/orange_marker_3_sm.png'
            url: 'img/orange_dot_sm_2.png'
        };
        let self_symbol = {
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
                location: { $exists : 1}, 
                certs: {$exists: 0}
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
                            // $(".phone").text(function(i, text) {
                            //   // text = text.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
                            //   console.log(text);
                            //   text = text.replace(/(\+?\d?)\-?\(?(\d{3})\)?\s?\-?\.?(\d{3})\-?\.?(\d{4})/gi, "$2.$3.$4");
                            //   return text;
                            // });
                            
                            $("#verify_button").click(function() {
                                console.log("Clicked Verify button!");
                                //open modal verify form.
                                $('#modalVerify').openModal();

                            });
                            // Session.set('infoWindowOpen', true);
                        });
                    } // else cannot place marker on map, it does not have lat/lng yet


                }
            });
        });

        self.autorun(function(){
            //====== AUTO-RESUBSCRIBE TO NEW LISTINGS WHEN MY LOCATION CHANGES ====== //
            // ====== GET THE FIRST TWO DIGITS OF EACH LAT/LONG AND COMPARE IT WITH A REGEX SEARCH AGAINST LISTINGS COLLECTION //
            // replace string with 2 digits of each
            // (\-?\d{2}(\.\d+)?),\s*(\-?\d{2}\.(\d+)?) REGEX search FOR ANY LAT/LONG STRING (use for mongodb search)
            // Listings.find({"location" : {$regex : /PATTERN/ }});

            if (Session.get('clientLoc')) {
                let loc = Session.get('clientLoc');
                //if it were lat/long string
                // let trimmed = (loc.replace(/(\.\d+)/,''));
                //lat/long object
                let arr = [];
                _.each(loc, function(v) {
                    // let n = Math.trunc(v);
                    // let n = Math.floor(v);
                    let n = v.toFixed();
                    // let n = v.toPrecision(4);
                    // n = parseInt(n);
                    m = n-1;
                    o = n++;
                    arr.push(m,o,n);
                    // console.log(arr);
                    //orig coord is arr[1], arr[4]                    
                });
                // console.log(arr);
                // = CLIENT LOCATION
                let str = "((" +arr[1]+ ")(\\.\\d+)?),\\s*((" +arr[4]+ ")(\\.\\d+)?)";                
                // = CLIENT LOCATION & LOCATION -1
                // let str = "((" +arr[0]+ "," +arr[1]+ ")(\\.?\\d+)?),\\s*((" +arr[5]+ "," +arr[4]+")(\\.?\\d+)?)";
                // = CLIENT LOCATION & LOCATION +1
                // let str = "((" +arr[2]+ "|" +arr[1]+ ")(\\.\\d+)?),\\s*((" +arr[3]+ "|" +arr[4]+")(\\.\\d+)?)";
                // = CLIENT LOCATION & LOCATION +1 AND -1
                // let str = "((" +arr[0]+ "|" +arr[1]+ "|" +arr[2]+ ")(\\.\\d+)?),\\s*((" +arr[3]+ "|" +arr[4]+ "|" +arr[5]+")(\\.\\d+)?)";
                let regex = new RegExp(str);
                // console.log(regex);
                let subscription = self.subscribe('listings_loc', function() {
                    let cursor = Listings.find({location : {$regex : regex}});
                    console.log("-= MAP SUBSCRIBED:  [" + cursor.count() + "] Local Listings");
                    //find listings that match the same lat/long digits as me (first two digits)
                    // return Listings.find({state: state});
                    cursor.forEach(function(doc){
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
                              icon: closeMarkerImage,
                            });
                            marker.set('title', doc.name);

                            marker.addListener('click', function() {

                                //Info Bottom-Modal
                                // let infoContent = Blaze.toHTMLWithData(Template.infomodal, doc);
                                Session.set('openListing', doc._id);
                                $('#modalInfo').openModal();

                                //Scan and reformat phone numbers
                                // $(".phone").text(function(i, text) {
                                //   // text = text.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
                                //   console.log(text);
                                //   text = text.replace(/(\+?\d?)\-?\(?(\d{3})\)?\s?\-?\.?(\d{3})\-?\.?(\d{4})/gi, "$2.$3.$4");
                                //   return text;
                                // });
                                //Click to open Verify Modal
                                $("#verify_button").click(function() {
                                    console.log("Clicked Verify button!");
                                    //open modal verify form.
                                    $('#modalVerify').openModal();
                                });
                                // Session.set('infoWindowOpen', true);
                            });
                        } // else cannot place marker on map, it does not have lat/lng yet
                    });
                });

                if (subscription.ready()) {
                    return;
                } 
            }
        });            
        
        self.autorun(function(){    
            //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
            //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
            if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
                console.log("Geo Error:", Geolocation.error().message);
                return;
            } else {
                let latLng = Geolocation.latLng();
                // console.log("clientLoc is Geo: ", latLng);
           
                Session.set('clientLoc', latLng);
                //              ---------------- ANALYTICS EVENT ---------------
                analytics.track( "Browser IP Data", {
                  title: "Pulled Geo Info",
                  data: Session.get('clientLoc')
                });
                console.log("-= GA : Geolocation Obtained =-");

                if (!latLng)
                    return;
                if (!clientMarker) {

                    clientMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(latLng.lat, latLng.lng),
                        map: map.instance,
                        icon: self_icon,
                        title: "Your Location",
                        // animation: google.maps.Animation.BOUNCE,
                    }); 
                
                } else {
                    clientMarker.setPosition(latLng);
                    //Google Maps does not recenter or rezoom
                    // map.instance.setCenter(clientMarker.getPosition());
                    // map.instance.setZoom(MAP_ZOOM);

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
        if (!Session.get('browserLoc')) {
            mapCenter = {'lat':39.833, 'lng':-98.583};
            console.log("set mapCenter, no sesh:", mapCenter);
        } else {
            mapCenter = Session.get('browserLoc');
            MAP_ZOOM = 14;
            
            console.log("got mapCenter sesh", mapCenter);
        }

        if (GoogleMaps.loaded() && mapCenter) {
            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: new google.maps.LatLng(mapCenter),
                // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
                zoom: MAP_ZOOM,
                // mapTypeId:google.maps.MapTypeId.TERRAIN,
                backgroundColor: "#555555",
                clickableIcons: false,
                disableDefaultUI: true,
                // fullscreenControl: true,
                minZoom: 5,
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