import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


//milktam:server-cache package - https://github.com/miktam/server-cache
//instantiates ApiCache obect which creates ' rest_+name+ ' upon creation, with time to live.
//ex. let cache = new ApiCache('name',ttl);

// ============================= API DATA CACHEING ==================================

// let cache = new ApiCache('rest', 120);
import './orionCache.js';

const cache = new OrionCache('rest', 6000);
const distance = require('google-distance');
distance.apiKey = Meteor.settings.public.keys.googleServer.key;

const Yelp = require('yelp');
// console.log(cache);

// ============================= SET IP INFO ==================================

const apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors 
  let errorCode, errorMessage;
  try {

    let dataFromCache = cache.get(apiUrl);
    // console.log("key: "+apiUrl);
    let response = {};

    if(dataFromCache) {
      console.log("Data from Cache...");
      response = dataFromCache;
    } else {
      console.log("Data from API...");
      response = HTTP.get(apiUrl).data;
      cache.set(apiUrl, response);
    }

    // A successful API call returns no error
    // but the contents from the JSON response
    if(callback) {
      callback(null, response);
    }
    
  } catch (error) {
    // If the API responded with an error message and a payload 
    if (error.response) {

      // console.log(error.response);
      errorCode = error.response.statusCode;
      errorMessage = error.response.data.error_message;
      console.log({errorCode, errorMessage});
    // Otherwise use a generic error message
    } else {
      errorCode = 500;
      errorMessage = 'No idea what happened!';
    }
    // Create an Error object and return it via callback
    // let myError = new Meteor.Error(errorCode, errorMessage);
    // callback(myError, null);
  }
};


Meteor.methods({
  loginWith: function(u,p) {
    Meteor.loginWithPassword(u, p);
  },
  registerMe: function(o) {
    let newUserId = Accounts.createUser({
        username: o.username,
        email: o.email,
        password: o.password
      });
    // console.log("Signing Up: " + newUserId);
    Accounts.setPassword(newUserId, o.password);
    // Set ROLE
    // userReg = Roles.Role('user');
    // const userOwns = Roles.Role('owner');
    
    // SEND Enrollment Email
    // Accounts.sendEnrollmentEmail(newUserId)
    Meteor.loginWithPassword(o.username, o.password);
  },
  geoCode: function(address) {
    this.unblock();
    
    let urlParams;
    if (typeof address === "object" && ! _.isEmpty(address))  {
      urlParams = _.values(address);
    } else {
      // console.log(address);
      urlParams = address;
    }
    let apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + urlParams + '&key=' + Meteor.settings.public.keys.googleServer.key;
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    // console.log(response);
    let loc = response.results[0].geometry.location;
    //====== RETURN LAT/LONG OBJECT LITERAL ======
    // return loc;
    //====== RETURN STRINGIFIED LAT/LONG NUMBERS ======
    let arr =  _.values(loc);
    // console.log(arr.toLocaleString());
    return arr.toLocaleString();

  },
  browserGeo: function(address) {
    this.unblock();
    
    let apiUrl = 'https://freegeoip.net/json/';
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    console.log(response);
    let lat = response.latitude;
    let lng = response.longitude;
    //====== RETURN LAT/LONG OBJECT LITERAL ======
    let browserLoc = _.object( ['lat', 'lng'], [lat, lng]);
    return browserLoc;   
    //====== RETURN STRINGIFIED LAT/LONG NUMBERS ======
    // let arr =  _.values(loc);
    // console.log(arr.toLocaleString());
    // return arr.toLocaleString();    
  },
  getDistance2: function(orig, dests) {
    this.unblock();
    let params = {};
    //needs sring like '34,-55'
    //and destinations need '34,-55 | 24,-85 ' etc...
    let joined = dests.join("|");
    params.units = "imperial";
    params.orig = orig;
    params.dests = joined;
    console.log("***calling DISTANCE API method");
    // let apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=' + params.units + '&origins=' + params.orig + '&destinations=' + params.dests + '&key=' + Meteor.settings.public.keys.googleServer.key;
    let apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=' + params.units + '&origins=' + params.orig + '&destinations=' + params.dests;
    // console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    console.log(response.rows[0].elements);
    return response;
  },
  getDirections: function(orig, dests) {
    this.unblock();
    let urlParams;
    console.log("***calling DIRECTIONS API method with "+urlParams);
    let apiUrl = 'https://maps.googleapis.com/maps/api/directions/json?' + urlParams + '&key=' + Meteor.settings.public.keys.googleServer.key;
    // origin=Disneyland&destination=Universal+Studios+Hollywood4' &key=YOUR_API_KEY' + urlParams + 
    
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    // console.log(response);
    let loc = response.results[0].geometry.location;
    let arr =  _.values(loc);
    return arr.toLocaleString();
  },
  yelpSearch: function() {
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
    let yelp = new Yelp({
      consumer_key: Meteor.settings.public.keys.yelp.key,
      consumer_secret: Meteor.settings.public.keys.yelp.secret,
      token: Meteor.settings.public.keys.yelp.token,
      token_secret: Meteor.settings.public.keys.yelp.t_secret,
    });
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 
    yelp.search({ term: 'food', location: 'Silver Spring, Maryland' })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error(err);
    });

    // A callback based API is also available:
    // yelp.business('yelp-san-francisco', function(err, data) {
    //   if (err) return console.log(error);
    //   console.log(data);
    // });
  },
  bizSearch: function() {
    // https://api.business.usa.gov/{ReturnType}?keyword={KeyWordSearch}&page={PageNumber}&api_key={YourAPIKey}
    this.unblock();
    let urlParams;
    if (typeof address === "object") {
      urlParams = _.values(address);
    } else {
      urlParams = address;
    }

    console.log("***calling GEOCODE API method with "+urlParams);
    let apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + urlParams;
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
  }, 
  getRoute: function(orig,dest) {
    this.unblock();

  },
  getDistances: function(orig,dests) {
    distance.get(
      {
        origin: orig,
        destinations: dests,
        units: 'imperial'
      },
      function(err, data) {
        if (err) return console.log(err);
        else {
          let info = data[1];
          let obj = {};
          console.log(info);
          obj.distance = info.distance;
          obj.disValue = info.distanceValue;
          obj.duration = info.duration;
          obj.durValue = obj.durationValue;
          return obj;
        };
        // let meters = data.distanceValue;
        // let miles = meters / 1609.344s;
        // return miles;
    });
    
  }
});


// http://api-business.usa.gov/XML?keyword=healthcare&size=50&offset=1&api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q


//   http://api-business.usa.gov/data/JSON?api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q&size=50&offset=1&ownership=minority