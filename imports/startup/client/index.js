import './OKGAnalytics.js';
import '/imports/api/orionCache.js';

import Listings from '/imports/startup/collections/listings';

import '/imports/ui/pages/admin/orionEditForm.js';

// IMPORT EVERYTHING NEEDED FOR MATERIALIZE LIBRARY. 
// JQUERY GOES FIRST WITH INIT, THEN VELOCITY, THEN GLOBAL. 
// THEN INDIVIDUAL MATERIALIZE JS FILES
// THEN MATERIALIZE JS

window.$ = $ = require('jquery');
import 'materialize-css/js/jquery.hammer';
import 'materialize-css/dist/js/materialize.min';

// IMPORT Animate.css. 
import 'animate.css/animate.min.css';

//Import Routes & functions
import '/lib/config/routes.js';

//Import Functions
import './functions.js';

//Import Layouts
import '/imports/ui/layouts/layout.js';

//client Libraries


jQueryBridget = require('jquery-bridget');
Masonry = require('masonry-layout');
ImagesLoaded = require('imagesloaded');
// import ImagesLoaded from 'imagesloaded';
jQueryBridget( 'masonry', Masonry, $ );


// downloadImage = require('download-image');

console.log("-= imports/startup/client/index.js loaded");
Session.set('loading', true);
Session.set('thisPlace', false);
// ============================= API DATA CACHEING ==================================
// let cache = new ApiCache('rest', 120);
// 100000s = 1.16 days....

//====== STARTUP ACTIONS ======
$.getJSON(`https://ipapi.co/json`, {format: "jsonp"}).done(function(data){
  /*
  {
    "ip": "96.241.197.213",
    "city": "Silver Spring",
    "region": "Maryland",
    "region_code": "MD",
    "country": "US",
    "country_code": "US",
    "country_code_iso3": "USA",
    "country_capital": "Washington",
    "country_tld": ".us",
    "country_name": "United States",
    "continent_code": "NA",
    "in_eu": false,
    "postal": "20902",
    "latitude": 39.037,
    "longitude": -77.0412,
    "timezone": "America/New_York",
    "utc_offset": "-0400",
    "country_calling_code": "+1",
    "currency": "USD",
    "currency_name": "Dollar",
    "languages": "en-US,es-US,haw,fr",
    "country_area": 9629091.0,
    "country_population": 310232863.0,
    "asn": "AS701",
    "org": "UUNET"
  }
  */
  let lat = data.latitude;
  let lng = data.longitude;
  let browserLocation = {'lat': lat, 'lng': lng };
  // console.log("Coord from Browser: ", browserLocation);
  Session.set('browserLoc', browserLocation);
  Session.set('clientState', data.region_code);
}); 


Meteor.subscribe('userData');

Meteor.startup(function () {
  //=====  FORCE WWw REDIRECT ===== 
  // if (location.host.indexOf('mobb.kielbyrne.com') !== 0) {
  //     location = 'https://mobb.kielbyrne.com'
  // }

  //=====  CHECK IF OFFLINE ===== 
  Tracker.autorun(function() {
    let online = navigator.onLine;
    if (!online) {
      console.log('Now Offline...');
      Materialize.toast('Working Offline...', 1000, 'myToast');
    }
  });

  //=====  GoogleMaps load ===== 
  GoogleMaps.load({
    v: '3',
    key: Meteor.settings.public.keys.googleClient.key,
    libraries: ['places', 'geometry']
  });
  
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
  	    analytics.track( "Dismissed to Homescreen", {
  	      category: 'Interaction',
  	      label:  navigator.userAgent,
          value: false
  	    });
        console.log('User cancelled home screen install');
      }
      else {
  	    analytics.track( "Added to Homescreen", {
          category: 'Interaction',
          label:  navigator.userAgent,
          value: true
  	    });
      }
    });
  });



	//=====  HTML Attributes for Facebook opengraph api =====
	$('html').attr({
		'xmlns': 'https://www.w3.org/1999/xhtml',
		'xmlns:fb': 'https://ogp.me/ns/fb#',
    'lang': 'en'
	});

	//=====  ServiceWorker installation =====
  installSW();

  //=====  Global Template Helpers =====
  Template.registerHelper('loading', function() {
    return Session.get('loading');
  });

  Template.registerHelper('getImage', function(url, id) {
    // does not get inferred images, sometimes will not return image. 
    // if no image returned, call "scrapeOG" ?
    // Meteor.call('scrapeOG', url, id); 
    // console.log(url, id);
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
      let test = Meteor.userId() === this.creator;
      // console.log(test);
      return test;
    }
  });

  Template.registerHelper('getGID', function(name,loc, id) {
    if (loc) {
    let locArr = loc.split(",");
    let locObj = {'lat': Number(locArr[0]), 'lng': Number(locArr[1]) };
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

  Template.registerHelper('thisPlace',  function () {
    const place = Session.get('thisPlace');
    if (place) {
      // console.log(place);
      return place;
    }
  });

  Template.registerHelper('getDistance', function(dest) {
      //Take destination, calculate distance from my location, convert to miles, return distance string.
      if (GoogleMaps.loaded() && dest) {
        const latLng = dest.split(",");

          const lat = Number(latLng[0]);
          const lng = Number(latLng[1]);
          const latLngObj = {'lat': lat, 'lng': lng };
          
          let start = new google.maps.LatLng(Session.get('clientLoc'));
          // if (!start) return ;

          const finish = new google.maps.LatLng(latLngObj);
          // let res = Meteor.call('calcDistance', loc, dest);

          let dist = google.maps.geometry.spherical.computeDistanceBetween(start,finish);    
          // multiply meters by 0.000621371 for number of miles.
          let res = (dist * 0.000621371).toFixed(1);
          
          if (res.length > 5) {
            //3432.0 = 6, shorten to 3.4k
            res = `${res.slice(0,1)}.${res.slice(1,2)}k`; 
          } else if (res.length == 5) {
            //502.3, shorten to 3 places.
            res = res.slice(0,3);
          }
          return res;
      } 
      return 
    });

  Template.registerHelper('isClose', function(distance) {
    //if less than 3 miles, return true.
    if (distance <= 3) {
      return true;
    } else {
      return false;
    }
  });

  Template.registerHelper('isClosest', function(){
    return Session.get('closestListing')
  });

  Template.registerHelper('haveLocation', function () {
    if (Session.get('clientLoc')) {
      return true;
    } else {
      return false;
    }
  });

  Template.registerHelper('hasFavorites', function () {
    const user = Meteor.user();
    if (user && user.profile.favorites && user.profile.favorites.length > 0) {
      // console.log(user.profile.favorites); 
        return true;
      } else {
        return false;
      }
  });


  Template.registerHelper('currentDoc', function () {
    if (Session.get('openListing')) {
      let id = Session.get('openListing');
      let doc = Listings.findOne({_id: id});
      return doc;
    }
  });

  Template.registerHelper('isOpen', function(doc) {
    const check = doc.opening_hours.open_now;
    return check;
  });

  Template.registerHelper('getImgUrl', function(ref) {
    //take this photo and return whatever the result of the call is. 
    //req'd key, photoreference, & maxheight or maxwidth
    //either i place a URL in the img, or i call the request and place the response in html...

    // Meteor.call('getPlacePhotos', ref, function(err, res) {
    //   console.log(err, res);
    //   return res.result;
    // });
    const key = Meteor.settings.public.keys.googleServer.key;
    const uri = "https://maps.googleapis.com/maps/api/place/photo?";
    const apiUri = `${uri}maxwidth=300&photoreference=${ref}&sensor=false&key=${key}`;
    return apiUri;
  });

// // STILL INSIDE METEOR.STARTUP
});

Template.orionMaterializeHeaderContainer.onRendered(function() {
  $(document).ready(function () {
      $('[id="loading-wrapper"], .server_rendered').fadeOut();
  });
});

Template.orionMaterializeLogin.onRendered(function() {
  $(document).ready(function () {
      $('[id="loading-wrapper"], .server_rendered').fadeOut();
  });
});

