
import '/imports/api/orionCache.js';
import Listings from '/imports/startup/collections/listings';

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
import 'materialize-css/js/pushpin';
// import 'materialize-css/js/scrollspy';
import 'materialize-css/js/sideNav';
import 'materialize-css/js/slider';
import 'materialize-css/js/tabs';
import 'materialize-css/js/toasts';
import 'materialize-css/js/tooltip';
import 'materialize-css/js/transitions';
import 'materialize-css/js/waves';
// import 'materialize-css/js/date_picker/picker';
// import 'materialize-css/js/date_picker/picker.date';

//Import Routes & functions
import '/lib/config/routes.js';

//Import Functions
import './functions.js'

//Import Layouts
import '/imports/ui/layouts/layout.js';
import '/imports/ui/layouts/splitLayout.js';

//client Libraries
Masonry = require('masonry-layout/masonry.js');
imagesLoaded = require('imagesLoaded/imagesLoaded.js');
GCache = new OrionCache('gids', 100000);
// downloadImage = require('download-image');

console.log("-= imports/startup/client/index.js loaded");
Session.set('loading', true);
// ============================= API DATA CACHEING ==================================
// let cache = new ApiCache('rest', 120);
// 100000s = 1.16 days....

//=====  GoogleMaps load =====  
GoogleMaps.load({
  v: '3',
  key: Meteor.settings.public.keys.googleClient.key,
  libraries: ['places', 'geometry']
});


Meteor.startup(function () {
  const isRunningStandalone = function () {
      return (window.matchMedia('(display-mode: standalone)').matches);
  };

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

	//=====  HTML Attributes for Facebook opengraph api =====
	$('html').attr({
		'xmlns': 'https://www.w3.org/1999/xhtml',
		'xmlns:fb': 'https://ogp.me/ns/fb#'
	});

	//=====  ServiceWorker installation =====
	if ('serviceWorker' in navigator) {
	  window.addEventListener('load', function () {
	    navigator.serviceWorker.register('/sw.js').then(function(registration) {
	      // Registration was successful
	      // console.log('ServiceWorker registration successful with scope: ', registration.scope);
	    }).catch(function(err) {
	      // registration failed :(
	      console.log('ServiceWorker registration failed: ', err);
	    });
	  });
	}
  //=====  Global Template Helpers =====
  Template.registerHelper('loading', function() {
    return Session.get('loading');
  });

  Template.registerHelper('getImage', function(url, id) {
    // does not get inferred images, sometimes will not return image. 
    // if no image returned, call "scrapeOG" ?
    // Meteor.call('scrapeOG', url, id); 

    Meteor.call('getOG', url, id);
    
    
  });

  Template.registerHelper('hasImage', function () {
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

  Template.registerHelper('isOwner', function () {
    if (Meteor.user()) {
      let test = Meteor.user()._id === this.creator;
      // console.log(test);
      return test;
    }
  });

  Template.registerHelper('getGID', function(name,loc, id) {
    if (loc) {
    let locArr = loc.split(",");
    let locObj = _.object( ['lat', 'lng'], [Number(locArr[0]), Number(locArr[1])]);
    // console.log(id);
    let map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];

    if (GoogleMaps.loaded() && Meteor.user() && map) {
      //WHY DO U HAVE TO BE LOGGED IN??
      const service = new google.maps.places.PlacesService(map.instance);
      const req = {
          //name & location & radius (meters).
          name: name,
          location: locObj,
          radius: 10,
        };

      const cbk = function(res,stat) {
          if (stat === google.maps.places.PlacesServiceStatus.OK) {
              let google_id = res[0].place_id;
              console.log(`Obtained ${google_id} for ${name}.`);
              //set document
              Meteor.call('setGID',id, google_id);
              return google_id;
          } else {
              // Listings.update(
              //   { _id: id },
              //   { $set: { google_id: false } }
              // );
              console.log(`Looking for google_id for: ${name}`);
              console.log(stat);
          }
      };
      return service.radarSearch(req,cbk);  
      } // ELSE MAP NOT LOADED NOR A USER
    }
  });

  // var resolvedData = new ReactiveDict();
  Template.registerHelper('thisPlace',  function () {
    const place = Session.get('thisPlace');
    if (place) {
      // console.log(place);
      return place;
    }
  });

  Template.registerHelper('getGDetails', function(gid) {
    let dataFromCache = GCache.get(gid);
    console.log(GCache.get(gid));
    const res = {};
    if(dataFromCache) {
      console.log("Details Data from GCache...");
      console.log(dataFromCache);

      return dataFromCache;
    } else {
        if (GoogleMaps.loaded()) {
        console.log("Data from API...");
      //   //get the response and stash it in GCache.
        const map = GoogleMaps.maps.map;
        const service = new google.maps.places.PlacesService(map.instance);

        const req = {
            placeId: gid
        };
        const cbk = function(res,stat) {
            if (stat === google.maps.places.PlacesServiceStatus.OK) {
                console.log(res);
                // ID_Cache.findOne({key: key}, {$set: {value: place_id}});
                 GCache.set(gid, res);
                // resolvedData.set('placeDetails', res);
                return res;
                //inject with jquery into dom?
            } else {
                console.log(stat);
            }
        };

        // console.log(service);
        return service.getDetails(req, cbk);

        // return resolvedData.get('placeDetails');
      } else {
      console.log ("Map not yet loaded..."); 
      } 
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

  Template.registerHelper('haveLocation', function () {
    if (Session.get('clientLoc')) {
      return true;
    } else {
      return false;
    }
  });

  Template.registerHelper('hasFavorites', function () {
    let user = Meteor.user();
    if (user && user.profile.favorites) {
      let profile = user.profile;
      if (profile.favorites.length) {
        return true;
      } else {
        return false;
      }
    }
  });


  Template.registerHelper('currentDoc', function () {
    if (Session.get('openListing')) {
      let id = Session.get('openListing');
      let doc = Listings.findOne({_id: id});
      // console.log(doc);
      return doc;
    }
  });
// STILL INSIDE METEOR.STARTUP
});





