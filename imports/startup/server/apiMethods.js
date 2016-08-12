import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


//milktam:server-cache package - https://github.com/miktam/server-cache
//instantiates ApiCache obect which creates ' rest_+name+ ' upon creation, with time to live.
//ex. var cache = new ApiCache('name',ttl);

// ============================= API DATA CACHEING ==================================

// var cache = new ApiCache('rest', 120);
import './orionCache.js';

const cache = new OrionCache('rest', 120);
// console.log(cache);

// ============================= SET IP INFO ==================================

let apiCall = function (apiUrl, callback) {
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
      errorCode = error.response.data.error.code || error.response.data.error_code;
      errorMessage = error.response.data.error.message || error.response.data.error_msg;
      console.log({errorCode, errorMessage});
    // Otherwise use a generic error message
    } else {
      errorCode = 500;
      errorMessage = 'No idea what happened!';
    }
    // Create an Error object and return it via callback
    // var myError = new Meteor.Error(errorCode, errorMessage);
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
    if (typeof address === "object") {
      urlParams = _.values(address);
    } else {
      urlParams = address;
    }

    console.log("***calling GEOCODE API method with "+urlParams);
    var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + urlParams;
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    let loc = response.results[0].geometry.location;
    let arr =  _.values(loc);
    return arr.toLocaleString();
  },
  yelpSearch: function() {
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
// Request API access: http://www.yelp.com/developers/getting_started/api_access 
    const Yelp = require('yelp');
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

  }

});




//https://www.googleapis.com/civicinfo/v2/
//http://politicalpartytime.org/api/v1/event/?beneficiaries__state=md&start_date__gt=2015-12-25&format=json&apikey="+Meteor.settings.public.govSettings.sunlight.apikey
//http://politicalpartytime.org/api/v1/event/?beneficiaries__state=md&start_date__gt=2015-01-01&format=json&apikey=345a8f0b36114bde89222326b8b1e1af
//console.log("http://api.nytimes.com/svc/politics/v3/us/legislative/congress/114/senate/members/current.json?api-key="+ Meteor.settings.public.govSettings.nytimes.key);

//"http://api.nytimes.com/svc/politics/v3/us/legislative/congress/114/nominees/state/md.json?api-key=557b2bfde68793e7d49ca5a2daf77602:14:28561524"
//"http://api.nytimes.com/svc/politics/v3/us/legislative/congress/states/members/party.json?api-key=557b2bfde68793e7d49ca5a2daf77602:14:28561524"

/* Methods 
/legislators
/legislators/locate 
/districts/locate 
/committees 
/bills  
/bills/search
/amendments 
/nominations
/votes  
/floor_updates
/hearings 
/upcoming_bills
/congressional_documents/search
/documents/search

*/