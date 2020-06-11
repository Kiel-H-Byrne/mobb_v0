    
import Listings from '/imports/startup/collections/listings';
import Categories from '/imports/startup/collections/categories';

import 'gmaps-marker-clusterer';
import './centerButton.js';
import './loadingScreen.html';
import './map.html';
import './agents.js';


//====== MAP GLOBALS ======
MAP_ZOOM = 4;
MAP_MARKERS = [];
MAP_CLUSTER = {};
AGENT_MARKERS = [];
MARKER_GROUPS = {};


Template.map.onCreated( function () {
    // console.log("-= MAP: Created =-");
    let self = this;
    // ============================= SUBSCRIPTIONS ==================================
    this.subscribe('categories', function() {
     let cursor = Categories.find()
     //each catarr, make new array from name, 0
     cursor.forEach(function(category) {
        MARKER_GROUPS[category.name] = [];
     });
    });
    //====== SET MAP VARIABLES / CONSTANTS ======
    // let clientMarker;

    const markerImage = {
      url: 'img/orange_marker_sm.png'
    };

    const closeMarkerImage = {
      url: 'img/red_marker_sm.png'
    };

    const self_icon = {
        // url: 'img/orange_marker_3_sm.png'
        url: 'img/orange_dot_sm_2.png',
    };

    const self_radius = {
        strokeColor: '#FF7733',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#FFAA00',
        fillOpacity: 0.15,
    };

    // const browser_symbol = {
    //     path: "M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z",
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.8,
    //     anchor: new google.maps.Point(0,-3),
    //     strokeWeight: 0.05,
    //     scale: 1
    // };

    // browserMarker = new google.maps.Marker({
    //     position: Session.get('browserLoc'),
    //     map: map.instance,
    //     icon: browser_symbol,
    //     title: "Approx. Location...",
    //     // animation: google.maps.Animation.BOUNCE,
    // }); 

        
        GoogleMaps.ready('map', function(map) {
           
            /*      
                const offsetCenter = (latlng, offsetx, offsety) => {

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
            */
            //Adding ALT tags to Google Images.       
            $('[id="browser-map"] > .map-canvas > div > .gm-style > div:nth-of-type(2) > a > div > img').attr( "alt", "Google Maps" );
            //Adding REL="noopener" to _blank targets
            $('[target="_blank"]').attr("rel", "noopener");

            if (clientMarker) {
                console.log('clientmarker exists... setting to map', map.instance);
                clientMarker.setMap(map.instance);
            }

            //====== watch the database for changes, draw new marker on change. ====== //
            

            let subscription = self.subscribe('listings_locs', function () {
                
                let cursor = Listings.find({
                    location: { $exists : 1 }
                });
                console.log("-= MAP.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LISTINGS WITH LOCATIONS =-");
                //find listings that match the same lat/long digits as me (first two digits)

                const calcDistances = function(pt, arr, max) {
                    let service = new google.maps.DistanceMatrixService();
                    let request = {
                        origins: [pt],
                        destinations: [],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    };

                }

                // Session.set('loading', false);
                // append "hide to loading screen div"
                $('[id="loading-wrapper"]').css({display:"none"});

                cursor.observeChanges({
                    added: function(id,doc) {
                        //add markers.
                        //For Each Listing, add a marker; every marker opens a global infoWindow and owns events.
                        //===== CONVERT DOC LOCATION FIELD FROM STRINGIFIED ARRAY TO OBJECT LITERAL =====
                        if (doc.location) {
                            //  CONVERT LAT,LNG STRING TO LAT/LNG OBJECT
                            let latLng = doc.location.split(",");
                            let lat = Number(latLng[0]);
                            let lng = Number(latLng[1]);
                            let latLngObj = {'lat': lat, 'lng': lng };
                            //===== LEAVE DOC LOCATION FIELD AS OBJECT LITERAL =====
                            // let latLngObj = doc.location;

                            //--   Place Markers on map
                            const marker = new google.maps.Marker({
                              position: latLngObj,
                              map: map.instance,
                              icon: markerImage,
                            });

                            marker.setTitle(doc.name);
                            MAP_MARKERS.push(marker);


                            marker.addListener('click', function () {
                                Session.set('openListing', id);
                                $('.button-collapse').sideNav('show');
                                // Router.go('/Listings/' + id);

                                //calculate distance 
                                // let start = new google.maps.LatLng(Session.get('clientLoc') || Session.get('browserLoc'));
                                // let finish = new google.maps.LatLng(latLngObj);
                                // console.log(start, finish);
                                // let dist = google.maps.geometry.spherical.computeDistanceBetween(start,finish);
                                // // multiply meters by 0.000621371 for number of miles.
                                // console.log(`${dist * 0.000621371} mi`);
                                // // Router.go('/', {_id: id});

                            });
                            //FOR EACH CATEGORY THAT MARKER HAS, PUSH IT TO MARKER_GROUP
                            if (doc.categories && doc.categories.length) {
                                
                                for (var i = doc.categories.length - 1; i >= 0; i--) {
                                    const element = doc.categories[i]
                                    //CREATE THE EMPTY ARRAY FOR GROUP IF DOESNT EXIST YET
                                    if (!MARKER_GROUPS[element]) MARKER_GROUPS[element] = [];
                                    MARKER_GROUPS[element].push(marker);
                                }
                            }
                            
                            return marker;
                        } // else cannot place marker on map, it does not have lat/lng yet
                    },
                    // addedBefore: function(id, fields, before) {
                    //     if (before === null) {
                    //       //stop my spinner
                    //       $('[id="loading-wrapper"]').css({display:"none"});
                    //     }
                    // }
                });
                // const microClusterOptions = {
                //     imagePath: 'img/cluster/m',
                //     gridSize: 13
                // }
                // Object.entries(MARKER_GROUPS).forEach(function(array) {
                //     if (array[1].length) {
                //         const microCluster = new MarkerClusterer(map.instance, array[1], microClusterOptions);
                //     }
                //     // let microCluster = new MarkerClusterer(map.instance, array, microClusterOptions);
                // });

                const macroClusterOptions = {
                    imagePath: 'img/cluster/m',
                    gridSize: 23
                };

                MAP_CLUSTER = new MarkerClusterer(map.instance, MAP_MARKERS, macroClusterOptions);
            });
           
       
              // as soon as session = true, let autorun proceed for  geolocate;  
              // then stop outer autorun
            // self.autorun( function(c) {
            //   let getPerm = Session.get("geoAccepted");

            //   if (getPerm === true) {
            //       self.autorun(function () {    
            //         //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
            //         //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
            //         // Materialize.toast('Locating...', 1100, 'myToast');
            //         //add class 'pulse' to button, then remove it once found
            //         $(document).ready(function (){
            //           $('[id="centerButton_button"]').addClass('pulse');
            //         });

            //         console.log("searching ...");
            //         if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
            //           console.warn("Geopositioning Error:", Geolocation.error().message);
            //           return;
            //         } else {
            //           getLocation().then((pos) => {
            //             if (pos) {
            //               Session.set('clientLoc', pos);

            //               if (!clientMarker) {
            //                 clientMarker = new google.maps.Marker({
            //                     position: new google.maps.LatLng(pos.lat, pos.lng),
            //                     map: map.instance,
            //                     icon: {url: 'img/orange_dot_sm_2.png'},
            //                     title: "My Location",
            //                     // animation: google.maps.Animation.BOUNCE,
            //                 });
                            
            //                 clientRadius = new google.maps.Circle({
            //                   map: map.instance,
            //                   center: pos,
            //                   radius: (3 * 1609.34),
            //                   strokeColor: '#FF7733',
            //                   strokeOpacity: 0.5,
            //                   strokeWeight: 2,
            //                   fillColor: '#FFAA00',
            //                   fillOpacity: 0.15,
            //                 });

            //                 // map.instance.setCenter(pos);
            //                 // map.instance.setZoom(12); 
            //                 targetClient(map,pos);

            //               } else {
            //                 clientMarker.setPosition(pos);
            //                 clientRadius.setCenter(pos);
            //               }
            //               return;
            //             }
            //           });
            //         }
            //       });
            //       c.stop();
            //     } else {
            //     console.warn('Get Geolocation: Not Accepted, Yet.');
            //   }
            // });

            // ========================= DOM Events relating to Map =========================

            // google.maps.event.addDomListener(map, 'center_changed', function () {
            //     google.maps.event.trigger(map, "resize");
            //     console.log("new center");
            // })
            // google.maps.event.addListener(map, "dblclick", function(event) {
            //     console.debug("caught double click");
            //     // reference the global event object
            //     // ignore the googleMapsEvent passed in by Google Maps!
            //     event.preventDefault();
            // });
        });

});

// let handle = LaunchScreen.hold();
Template.map.onRendered(function () {
  // handle.release();
    
    // console.log(map);
    // let pos = Session.get('clientLoc');
    // if (pos) {
    //     // console.log(map,pos);
    //     targetClient(map,pos);
    //     placeMyMarker(map,pos)
    //     console.log("location found, targeted client, loop stopped...");
    // }
    // const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    //         MAP_MARKERS.forEach(function(marker) {
    //             marker = new google.maps.Marker({
    //               position: marker.position,
    //               map: map.instance,
    //               icon: marker.getIcon(),
    //             });
    //         });

  //Materialize JQuery Effects
  $(document).ready(function (){
    $('.modal-trigger').modal({
        dismissible: true,
        opacity: 0.5,
        in_duration: 300,
        out_duration: 200,
        // ready: function () {
        //     if($(".lean-overlay").length > 1) {
        //         $(".lean-overlay:not(:first)").each(function () {
        //             $(this).remove();
        //         });
        //     }
        // },
        // complete: function () {
        //     $(".lean-overlay").each(function () {
        //         $(this).remove();
        //     });
        // }
    });
  });
});


// ============================= HELPERS ==================================

Template.map.helpers({
    mapOptions: function () {

    // / ============================= SET MAP CENTER ==================================    
    //Get Client's Location using W3C HTML5 GeoLocation Standard and set Marker/InfoWindow
    // Requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.

    //setting arbitrary map center, until 'geoAccepted is filled'
    let mapCenter = {'lat':40.017, 'lng':-99.017};
        // if (!Session.get('browserLoc')) {
            // mapCenter = {'lat':40.017, 'lng':-109.017};
            // console.log("Set mapCenter to 'Over West Coast':", mapCenter);

        // } else {
        //     mapCenter = Session.get('browserLoc');
        //     // MAP_ZOOM = 12;
        //     console.log("Got mapCenter from Browser:", mapCenter);
        // }

        if (GoogleMaps.loaded() && mapCenter) {
            let mapStyles = [
              {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#C3BBAE"
                  }
                ]
              },
              {
                "featureType": "administrative",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#565250"
                  }
                ]
              },
              {
                "featureType": "administrative.country",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#5C5A6F"
                  }
                ]
              },
              {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#FFFAF3"
                  }
                ]
              },
              {
                "featureType": "administrative.locality",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#696969"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#696969"
                  }
                ]
              },
              {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                  {
                    "color": "#FBB03B"
                  },
                  {
                    "weight": 2
                  }
                ]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#565250"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "hue": "#003300"
                  },
                  {
                    "saturation": -80
                  },
                  {
                    "lightness": -5
                  },
                  {
                    "gamma": 0.3
                  },
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "geometry",
                "stylers": [
                  {
                    "saturation": -10
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                  {
                    "saturation": -60
                  },
                  {
                    "lightness": -45
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#FBB03B"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "weight": 4
                  },
                  {
                    "color": "#484848"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "simplified"
                  },{
                    "color": "#323232"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "elementType": "all",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "elementType": "geometry",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  },
                  {
                    "hue": "#ff0000"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  },
                  {
                    "hue": "#ff2300"
                  }
                ]
              },
              {
                "featureType": "transit.station.rail",
                "elementType": "geometry",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit.station.rail",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit.station.rail",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                  {
                    "color": "#ffffff"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              }
            ];

            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: new google.maps.LatLng(mapCenter),
                zoom: MAP_ZOOM,
                // mapTypeId:google.maps.MapTypeId.TERRAIN,
                backgroundColor: "#555",
                clickableIcons: false,
                disableDefaultUI: true,
                fullscreenControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.RIGHT_CENTER,
                    // mapTypeIds: ['roadmap', 'terrain']
                },
                scaleControl: false,
                rotateControl: true,
                minZoom: 3,
                streetViewControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                //gestureHandling sets the mobile panning on a scrollable page: COOPERATIVE, GREEDY, AUTO, NONE
                gestureHandling: 'greedy',
                // Map styles; snippets from 'Snazzy Maps'.
                styles: mapStyles
                    // lightGray 
                    // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#fefefe"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#b2b2b2"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#b3b3b3"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#4f4f4f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#6a6a6a"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dbdbdb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]}]
                    // redGrayScale
                    // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#777777"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-15}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9f1f1f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":"3.76"},{"color":"#f8f8f8"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":"7.59"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
                    // customOrangeGray
                    // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#FFD89A"}]},{"featureType":"landscape","elementType":"all","stylers":[ {"color":"#FBB03B"}, {"weight": 4} ]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#565250"},{"visibility":"on"}]},{ "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"hue":"#003300"},{"saturation":-80},{"gamma":0.3}, { "visibility": "simplified" }]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":-10},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off" }]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-35}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#FBB03B"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":4},{"color":"#484848"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":7.59}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"off"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]

            };
        }
    }
});


