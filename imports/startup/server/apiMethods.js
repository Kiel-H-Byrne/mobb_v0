import { Meteor } from 'meteor/meteor';

//milktam:server-cache package - https://github.com/miktam/server-cache
//instantiates ApiCache obect which creates ' rest_+name+ ' upon creation, with time to live.
//ex. var cache = new ApiCache('name',ttl);

// ============================= API DATA CACHEING ==================================

// var cache = new ApiCache('rest', 120);
import './orionCache.js';

var cache = new OrionCache('rest', 120);
// console.log(cache);

// ============================= SET IP INFO ==================================

var apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors 
  var errorCode, errorMessage;
  try {

    var dataFromCache = cache.get(apiUrl);
    // console.log("key: "+apiUrl);
    var response = {};

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
    Accounts.createUser({
        username: o.username,
        email: o.email,
        password: o.password
      });
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
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    let loc = response.results[0].geometry.location;
    let arr =  _.values(loc);
    return arr.toLocaleString();
  },
  yelpQuery: function(search, isCategory, longitude, latitude) {
    console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lng, lat) with vals (', search, isCategory, longitude, latitude, ')');

    // Query OAUTH credentials (these are set manually)
    var auth = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});

    // Add auth signature manually
    auth['serviceProvider'] = { signatureMethod: "HMAC-SHA1" };

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    },
    parameters = {};

    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available (SF is default location)
    if(longitude && latitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'San+Francisco';

    // Results limited to 5
    parameters.limit = 5;

    // Configure OAUTH parameters for REST call
    parameters.oauth_consumer_key = auth.consumerKey;
    parameters.oauth_consumer_secret = auth.consumerSecret;
    parameters.oauth_token = auth.accessToken;
    parameters.oauth_signature_method = auth.serviceProvider.signatureMethod;

    // Create OAUTH1 headers to make request to Yelp API
    var oauthBinding = new OAuth1Binding(auth.consumerKey, auth.consumerSecret, 'http://api.yelp.com/v2/search');
    oauthBinding.accessTokenSecret = auth.accessTokenSecret;
    var headers = oauthBinding._buildHeader();

    // Return data results only
    return oauthBinding._call('GET', 'http://api.yelp.com/v2/search', headers, parameters).data;
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