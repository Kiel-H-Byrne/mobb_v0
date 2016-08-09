import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Listings from '/imports/startup/collections/listings';
import './map.html';

// ============================= SUBSCRIPTIONS ==================================


Template.map.onCreated( function() {  
	console.log("-= MAP: Drawn =-");

    Meteor.subscribe('listings_all', function() {
        console.log('-= MAP SUBSCRIBING: All Listings =-');
        console.log(Listings.find().count() + " Listings: ", Listings.find().fetch());
        // this.stop();
    })


    $.getJSON("http://ipinfo.io", function(data){
        console.log("-=IP INFO: SET=-");
        // console.log(data);
        Session.set('ipInfo', data);

        //              ---------------- ANALYTICS EVENT ---------------
        analytics.track( "Browser IP Data", {
          title: "Pulled Geo Info",
          data: data
        });
        console.log("-= GA : Browser IP Data =-");

        if (Meteor.user()) {
            Meteor.users.update({ 
                _id : Meteor.user()._id
                }, { 
                $set: { 
                    profile : data 
                } 
            });
        }
    });
    // ============================= RETURNED OBJECT ==================================
            /*
            city: "Silver Spring"
            country: "US"
            hostname: "c-69-138-161-94.hsd1.md.comcast.net"
            ip: "69.138.161.94"
            loc: "39.0261,-77.0084"
            org: "AS7922 Comcast Cable Communications, Inc."
            postal: "20901"
            region: "Maryland"
            */


    
    // Meteor.subscribe('listings');
  GoogleMaps.load({
      v: '3',
      key: Meteor.settings.public.keys.googleMaps.key
  });

//COLLECTION DOES NOT EXIST OUT HERE YET ... FOR SOME REASON..

    GoogleMaps.ready('map', function(map) {

        console.log("-= MAP SUBSCRIBED:  ["+ Listings.find().count() + "] Listings");

        // Add a marker to the map once it's ready
       
        //should be calling just geos from collection
        let listingArray = Listings.find().fetch();

        // console.log("-->" + listingArray.length + " listings.");
        // //--!-----How Many listings?
   
        // //Build array of only lat/longs (for each marker)
        let markers = [];
        // var statii = [];
    	    for (let i = 0; i < listingArray.length; i++) {
                //listingLoc needs to be google latlng object literal; 
                //listingLoc = {lat: "33" , lng: "-80"}
                let nums = listingArray[i].location.split(",");
                let lat = parseFloat(nums[0]);
                let lng = parseFloat(nums[1]);
    	        let listingLoc = _.object( ['lat', 'lng'], [lat, lng]);
    	        markers.push(listingLoc);
    	    }
        // console.log("-->" + markers.length + " markers.");

        // //--   Place Markers on map
        var image = {
          url: 'img/red_marker_1_md.png',
          // size: new google.maps.Size(50,50), 
          // origin: new google.maps.Point(0,0),
          // anchor: new google.maps.Point(0,50)
        };
    
        for (let i = 0; i < markers.length; i++) {
            // console.log(markers[i]);
            let listing = listingArray[i];
            let marker = new google.maps.Marker({
              position: markers[i],
              map: map.instance,
              icon: image,
            });
            //     var cirColor = getColor(listing);
           
            //     var circle = new google.maps.Circle({
            //         strokeColor: cirColor,
            //         strokeOpacity: 0.8,
            //         strokeWeight: 1,
            //         fillColor: cirColor,
            //         fillOpacity: 0.35,
            //         map: map.instance,
            //         center: listing.loc,
            //         radius: 100000,
            //     });
            let infoContent= Blaze.toHTMLWithData(Template.infowindow);
            //console.log(infoContent);        
            marker.info = new google.maps.InfoWindow({
              content: infoContent,
              maxWidth: 400
            });

            //     // Click for Status Alert
            //     google.maps.event.addListener(marker, "click", function () {
            //       marker.info.setContent(this.info.content);
            //       marker.info.open(map.instance, this);
            //       Session.set('currentlisting', this.title);
                  
            //     });
            //     // Click to Zoom into region
            google.maps.event.addListener(marker,'click',function() {
              let currentZoom = map.instance.getZoom();
              if(currentZoom <= 4){
                map.instance.setZoom(15);
                map.instance.setCenter(this.getPosition());
              }
              else{
                map.instance.setZoom(2);
                map.instance.setCenter(this.getPosition());
              }
            });
            
            // Hover for Info-Windows
            google.maps.event.addListener(marker, 'mouseover', function() {     
              marker.info.setContent(this.name);
              marker.info.open(map.instance, this);
            });
            //     //Click to Zoom Out to default center
        }
    
        // //Echo lat/lng on click
        // google.maps.event.addDomListener(map.instance, 'click', function(e) {
        //   var point = [e.latLng.lat(), e.latLng.lng()];
        //   console.log(point);
        // });

        google.maps.event.addDomListener(window, 'resize', function() {
            var center = GoogleMaps.maps.map.instance.getCenter();
            google.maps.event.trigger(map, "resize");
            GoogleMaps.maps.map.instance.setCenter(center);
        })

      });

});

Template.map.onRendered(function() {
    console.log("map rendered...");

});


// ============================= HELPERS ==================================


Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {

// / ============================= SET MAP CENTER ==================================    
        let Centers = {
          Na : {"lat":39.90973623453719, "lng":-105.29296875},
        };
        
        if (Meteor.user()) {
            let loc = Meteor.user().profile.loc;
            let userLoc = loc.split(",");
            console.log("User location: " + userLoc);
            Centers.User = {"lat": parseInt(userLoc[0]), "lng": parseInt(userLoc[1]) } ;
        } else {
            let ipInfo = Session.get('ipInfo');
            let loc = ipInfo.loc;
            let userLoc = loc.split(",");
            console.log("Browser location: "+ userLoc);
            
            Centers.User = {"lat": parseInt(userLoc[0]), "lng": parseInt(userLoc[1]) } ;
        }

// / ============================= RENDER MAP W/ OPTIONS ==================================    

        return {
            center: new google.maps.LatLng(Centers.User),
            zoom: 15,
            mapTypeId:google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: false,
            scrollwheel: true,
            // Map styles; snippets from 'Snazzy Maps'.
           
            styles: 
            // lightGray 
            // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#fefefe"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#b2b2b2"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#b3b3b3"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#4f4f4f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#6a6a6a"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dbdbdb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]}]
            // redGrayScale
            [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#777777"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-15}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9f1f1f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":"3.76"},{"color":"#f8f8f8"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":"7.59"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]

      };
    }
  }
});
