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
    console.log("key: "+apiUrl);
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
  geoCode: function(address) {
    this.unblock();
    console.log("***calling geoCode API method with "+address);
    // var key = Meteor.settings.public.govSettings.zipCodeAPI.key;
    var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address;
    console.log("--URL--"+apiUrl);
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response.results[0];
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