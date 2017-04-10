$ = window.jQuery = require("jquery");
import 'materialize-css/js/initial';
import 'materialize-css/js/global';
// import 'materialize-css/js/velocity.min' ;
window.Vel = require('materialize-css/js/velocity.min');
import 'materialize-css/js/hammer.min';
import 'materialize-css/js/jquery.easing.1.3';
import 'materialize-css/js/jquery.hammer';
import 'materialize-css/js/animation';
import 'materialize-css/js/buttons';
import 'materialize-css/js/cards';
// import 'materialize-css/js/carousel';
import 'materialize-css/js/character_counter';
import 'materialize-css/js/chips';
import 'materialize-css/js/collapsible';
import 'materialize-css/js/dropdown';
import 'materialize-css/js/forms';
import 'materialize-css/js/materialbox';
import 'materialize-css/js/materialize';
import 'materialize-css/js/modal';
// import 'materialize-css/js/parallax';
// import 'materialize-css/js/prism';
// import 'materialize-css/js/pushpin';
// import 'materialize-css/js/scrollspy';
import 'materialize-css/js/sideNav';
import 'materialize-css/js/slider';
// import 'materialize-css/js/tabs';
import 'materialize-css/js/toasts';
import 'materialize-css/js/tooltip';
import 'materialize-css/js/transitions';
import 'materialize-css/js/waves';
// import 'materialize-css/js/date_picker/picker';
// import 'materialize-css/js/date_picker/picker.date';

//Import Routes
import './routes.js';

//Import Layouts
import '../../ui/layouts/layout.js';
import '../../ui/layouts/splitLayout.js';

console.log("-= imports/startup/client/index.js loaded");


const isRunningStandalone = function() {
    return (window.matchMedia('(display-mode: standalone)').matches);
};

Masonry = require('masonry-layout/masonry.js');
imagesLoaded = require('imagesLoaded/imagesLoaded.js');

Meteor.startup(function() {

  if (isRunningStandalone()) {
    // This code will be executed if app is running standalone 
  }

  Session.set('geoAccepted', false);

  //-- ANALYTICS EVENT (User dismiss/Accept Home Screen banner) --

  window.addEventListener('beforeinstallprompt', function(e) {
    // beforeinstallprompt Event fired

    // e.userChoice will return a Promise.
    // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
    e.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);

      if(choiceResult.outcome == 'dismissed') {
  	    analytics.track( "ProgressiveWebApp", {
  	      title: "Added to HomeScreen",
  	      data: 'false'
  	    });
        console.log('User cancelled home screen install');
      }
      else {
  	    analytics.track( "ProgressiveWebApp", {
  	      title: "Added to HomeScreen",
  	      data: 'true'
  	    });
      }
    });
  });

  //=====  meteor-typeAhead =====
	Meteor.typeahead.inject();

  //=====  GoogleMaps load =====	
	GoogleMaps.load({
	  v: '3',
	  key: Meteor.settings.public.keys.googleClient.key,
	  libraries: ['places', 'geometry']
	});
	//=====  HTML Attributes for Facebook opengraph api =====
	$('html').attr({
		'xmlns': 'https://www.w3.org/1999/xhtml',
		'xmlns:fb': 'https://ogp.me/ns/fb#'
	});

	//=====  ServiceWorker installation =====
	if ('serviceWorker' in navigator) {
	  window.addEventListener('load', function() {
	    navigator.serviceWorker.register('/sw.js').then(function(registration) {
	      // Registration was successful
	      console.log('ServiceWorker registration successful with scope: ', registration.scope);
	    }).catch(function(err) {
	      // registration failed :(
	      console.log('ServiceWorker registration failed: ', err);
	    });
	  });
	}
  //=====  Global Template Helpers =====

  Template.registerHelper('hasImage', function() {
      //'this' should be Listings Document
      // console.log(typeof this.image.url);
      if (this.image) {
        let test = this.image.url;
        // console.log(test);
        if (test !== "false") {
          return true; 
        } else {
          return false;
        }
      }
  });

  Template.registerHelper('isOwner', function() {
    if (Meteor.user()) {
      let test = Meteor.user()._id === this.creator;
      // console.log(test);
      return test;
    }
  });

  Template.registerHelper('getGID', function(name,loc, id) {

    let locArr = loc.split(",");
    let locObj = _.object( ['lat', 'lng'], [Number(locArr[0]), Number(locArr[1])]);
    // console.log(id);

    if (GoogleMaps.loaded() && Meteor.user()) {
      let map = GoogleMaps.maps.map;
      // const params = {
      //   map: map,
      //   name: 'The Spice Suite',
      //   loc: {lat: 38.9738619, lng: -77.018299999},
      // };

      const service = new google.maps.places.PlacesService(map.instance);
      const req = {
          //name & location & radius (meters).
          name: name,
          location: locObj,
          radius: 10,
        };

      const cbk = function(res,stat) {
          if (stat === google.maps.places.PlacesServiceStatus.OK) {
              let google_id = res[0].place_id
              console.log(`Obtained ${google_id} for ${name}.`);
              //set document
              Listings.update(
                { _id: id },
                { $set: { google_id: google_id } }
              );
              return google_id;
          } else {
              console.log(stat);
          }
      };
      return service.radarSearch(req,cbk);  

      // Meteor.call('getGoogleID', params.map, params.name, params.loc) 
    };
  });

  Template.registerHelper('getGDetails', function(gid) {
    // if (Meteor.isServer) {
    //   ID_Cache._ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } );
    // }
    if (GoogleMaps.loaded()) {
      // let dataFromCache = ID_Cache.findOne({key: name});
      // console.log(dataFromCache);
      // if(dataFromCache) {
      //   console.log("Data from Cache...");

      //   return dataFromCache;
      // } else {
      //   console.log("Data from API...");
      //   //get the response and stash it in OCache.
        let map = GoogleMaps.maps.map || GoogleMaps.maps.minimap;
        let service = new google.maps.places.PlacesService(map.instance);

        let req = {
            placeId: gid
        };

        let cbk = function(res,stat) {
            if (stat === google.maps.places.PlacesServiceStatus.OK) {
                console.log(res);
                // ID_Cache.findOne({key: key}, {$set: {value: place_id}});
                return res;
                //inject with jquery into dom?
                
            } else {
                console.log(stat);
            }
        };

        // console.log(service);
        return service.getDetails(req, cbk);

    }

  });


  Template.registerHelper('getDistance', function(dest) {
      //Get distance, convert to miles, flag as 'is_close' class if under X miles, (this class will be visible) 
      // console.log(this)

      if (GoogleMaps.loaded() && dest) {
        let latLng = dest.split(",");
        if (latLng) {
          let lat = Number(latLng[0]);
          let lng = Number(latLng[1]);
          let latLngObj = _.object( ['lat', 'lng'], [lat, lng]);
          
          let start = new google.maps.LatLng(Session.get('clientLoc') || Session.get('browserLoc'));
          let finish = new google.maps.LatLng(latLngObj);
          // let res = Meteor.call('calcDistance', loc, dest);
          
          let dist = google.maps.geometry.spherical.computeDistanceBetween(start,finish);
          // multiply meters by 0.000621371 for number of miles.
          let res = (dist * 0.000621371).toFixed(1);
          return res;
        }
      }
    });

  Template.registerHelper('isClose', function(distance) {
    if (distance <= 3) {
      return true;
    } else {
      return false;
    }
  });

  Template.registerHelper('haveLocation', function() {
    if (Session.get('clientLoc')) {
      return true;
    } else {
      return false;
    }
  });

  Template.registerHelper('hasFavorites', function() {
    if (Meteor.user() && Meteor.user().profile.favorites.length) {
      return true;
    } else {
      return false;
    }
  });


  Template.registerHelper('currentDoc', function() {
    if (Session.get('openListing')) {
      let id = Session.get('openListing');
      let doc = Listings.findOne({_id: id});
      // console.log(doc);
      return doc;
    }
  });
// STILL INSIDE METEOR.STARTUP
});





