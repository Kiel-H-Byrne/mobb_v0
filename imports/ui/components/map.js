import {Template} from 'meteor/templating';
import './map.html'


const Centers = {
  Eu : {"lat":19.9779264, "lng": -57.5665592}, 
  Nil : {"lat":32.275126, "lng":-33.977855}, 
  Na : {"lat":39.90973623453719, "lng":-105.29296875} 
};

Template.map.onCreated( function() {  
	console.log("map drawn");
    // Meteor.subscribe('listings');
  GoogleMaps.load({
      v: '3',
      key: 'AIzaSyBxkVmvipEg4D57orN-46_s6Uvaoi7OKUc'

  });
    //TODO: change api key to secure 'settings' file.

//COLLECTION DOES NOT EXIST OUT HERE YET ... FOR SOME REASON..

    GoogleMaps.ready('map', function(map) {

//SUBSCRIPTION DOES NOT WORK IN HERE!

    // console.log("map.js-subscribed to all ["+ Listings.find().count() + "] offices");

    // Add a marker to the map once it's ready
   
    // var officeArray = Officez.find().fetch();
    // console.log("-->" + officeArray.length + " offices.");
    // //--!-----How Many Offices?
   
    // //Build array of only lat/longs (for each marker)
    // var markers = [];
    // var statii = [];
    // var len = officeArray.length;
	   //  for (var i = 0; i < len; i++) {
	   //      var officeLoc = officeArray[i].loc;
	   //      var officeStat = officeArray[i].stats;
	   //      statii.push(officeStat);
	   //      markers.push(officeLoc);
	   //  }
    // console.log("-->" + markers.length + " markers.");
    // //--   list arrays
    // //   console.log( JSON.stringify(statii[0]) );

    // //--   Place Markers on map
    // var image = {
    //   url: 'img/PW-arrow-xs.png',
    //   size: new google.maps.Size(9,9),
    //   origin: new google.maps.Point(0,0),
    //   anchor: new google.maps.Point(9,0)
    // };
    
    // for (i = 0; i < len; i++) {
    //     var office = officeArray[i];
    //     var marker = new google.maps.Marker({
    //       position: office.loc,
    //       map: map.instance,
    //       icon: image,
    //       title: office.label,
    //     });
    //     var cirColor = getColor(office);
       
    //     var circle = new google.maps.Circle({
    //         strokeColor: cirColor,
    //         strokeOpacity: 0.8,
    //         strokeWeight: 1,
    //         fillColor: cirColor,
    //         fillOpacity: 0.35,
    //         map: map.instance,
    //         center: office.loc,
    //         radius: 100000,
    //     });
    //     var infoContent= Blaze.toHTMLWithData(Template.infowindow);
    //     //console.log(infoContent);        
    //     marker.info = new google.maps.InfoWindow({
    //       content: infoContent,
    //       maxWidth: 400
    //     });

    //     // Click for Status Alert
    //     google.maps.event.addListener(marker, "click", function () {
    //       marker.info.setContent(this.info.content);
    //       marker.info.open(map.instance, this);
    //       Session.set('currentOffice', this.title);
          
    //     });
    //     // Click to Zoom into region
    //     google.maps.event.addListener(marker,'click',function() {
    //       var currentZoom = map.instance.getZoom();
    //       if(currentZoom <= 4){
    //         map.instance.setZoom(17);
    //         map.instance.setCenter(this.getPosition());
    //       }
    //       else{
    //         map.instance.setZoom(2);
    //         map.instance.setCenter(this.getPosition());
    //       }
    //     });
    //     //Hover for Info-Windows
    //     google.maps.event.addListener(marker, 'mouseover', function() {     
    //       marker.info.setContent(this.title);
    //       marker.info.open(map.instance, this);
    //     });
    //     //Click to Zoom Out to default center
    //     google.maps.event.addDomListener(zoomOut, 'click', function() {
    //       map.instance.setZoom(2);
    //       map.instance.setCenter(Centers.Eu);
    //     });
    // }
    
    // //Echo lat/lng on click
    // google.maps.event.addDomListener(map.instance, 'click', function(e) {
    //   var point = [e.latLng.lat(), e.latLng.lng()];
    //   console.log(point);
    // });

  });

});


Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(Centers.Na),
        zoom: 4,
        //mapTypeId:google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        scrollwheel: true,
        // Map styles; snippets from 'Snazzy Maps'.
       
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 30
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000"
                    },
                    {
                        "lightness": 10
                    }
                ]
            },{
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fff"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 50
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            }
        ]
        
       };
    }
  }
});
