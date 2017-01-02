
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import './orionCache.js';
import './yelp.js';
//milktam:server-cache package - https://github.com/miktam/server-cache
//instantiates ApiCache obect which creates ' rest_+name+ ' upon creation, with time to live.
//ex. let cache = new ApiCache('name',ttl);

// ============================= API DATA CACHEING ==================================
// let cache = new ApiCache('rest', 120);
const OCache = new OrionCache('rest', 6000);
// ======================== GOOGLE DISTANCE API MODULE=============================
const GDistance = require('google-distance');
GDistance.apiKey = Meteor.settings.public.keys.googleServer.key;
// ======================== YELP v3 API =============================


// ============================= SET IP INFO ==================================

const apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors 
  let errorCode, errorMessage;
  try {

    let dataFromCache = OCache.get(apiUrl);
    // console.log("key: "+apiUrl);
    let response = {};

    if(dataFromCache) {
      console.log("Data from Cache...");
      response = dataFromCache;
    } else {
      console.log("Data from API...");
      response = HTTP.get(apiUrl).data;
      OCache.set(apiUrl, response);
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

const apiCall2 = function (apiUrl, headers, callback) {
  // try...catch allows you to handle errors 
  let errorCode, errorMessage;
  try {

    let dataFromCache = OCache.get(apiUrl);
    // console.log("key: "+apiUrl);
    let response = {};

    if(dataFromCache) {
      console.log("Data from Cache2...");
      response = dataFromCache;
    } else {
      console.log("Data from API2...");
        if (headers) {
          response = HTTP.get(apiUrl, {headers: headers}).data;
          console.log(response);
        }
        else {
          response = HTTP.get(apiUrl).data;
          console.log(response);
        }
      OCache.set(apiUrl, response);
    }

    // A successful API call returns no error
    // but the contents from the JSON response
    if(callback) {
      callback(null, response);
    }
    return response;
  } catch (error) {
    // If the API responded with an error message and a payload 
    if (error.response) {
      errorCode = error.response.data.error ? error.response.data.error.code : 1911;
      errorMessage = error.response.data.error ? error.response.data.error.message : error.response.data.message;
    // Otherwise use a generic error message
    } else {
      console.log(error);
      // errorCode = 500;
      // errorMessage = 'No idea what happened!';
    }
    // Create an Error object and return it via callback
    // let myError = new Meteor.Error(errorCode, errorMessage);
    // let msg = 'Error: [' + errorCode + '] ' + errorMessage ;
    // // console.log(error);
    // if(callback) {
    //   callback(myError, null);
    // }
    // return myError;
  }
};



Meteor.methods({
  addListing: function(doc) {
    Listings.insert(doc , function(err, res){
      if (err) {
        console.log(err.details);
      } else {
        // res = _id
        // console.log(res);
      }
    });
  },
  remListing: function(doc) {
    Listings.remove(doc , function(err, res){
      if (err) {
        console.log(err.details);
      } else {
        console.log(res.name+" REMOVED.");
      }
    });    
  },
  addCategory: function(doc) {
    Categories.insert(doc , function(err, res){
      if (err) {
        console.log(err.details);
      } else {
        console.log(res);
      }
    });
  },
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
    // Accounts.sendEnrollmentEmail(newUserId, o.email)
    Meteor.loginWithPassword(o.email, o.password);
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
    if (response) {
      console.log(response);
      let loc = response.results[0].geometry.location;
      //====== RETURN LAT/LONG OBJECT LITERAL ======
      // return loc;
      //====== RETURN STRINGIFIED LAT/LONG NUMBERS ======
      let arr =  _.values(loc);
      // console.log(arr.toLocaleString());
      return arr.toLocaleString();
    }

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
    // console.log("*** Calling DISTANCE API method ***");
    // let apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=' + params.units + '&origins=' + params.orig + '&destinations=' + params.dests + '&key=' + Meteor.settings.public.keys.googleServer.key;
    let apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=' + params.units + '&origins=' + params.orig + '&destinations=' + params.dests;
    console.log("--URL--"+ apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    console.log(response);
    // console.log(response.rows[0].elements);
    return response;
  },
  getDirections: function(orig,dest) {
    this.unblock();
    // origin=Disneyland&destination=Universal+Studios+Hollywood4' &key=YOUR_API_KEY' + urlParams + 
    let params = {};
    params.origin = orig;
    params.destination = dest;
    // console.log("***calling DIRECTIONS API method with "+params);
    let apiUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + params.origin + '&destination=' + params.destination + '&key=' + Meteor.settings.public.keys.googleServer.key;
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    // console.log(response);
    return response;
  },
  getYelpID: function(phone) {
    this.unblock();
    let apiUrl = "https://api.yelp.com/v3/businesses/search/phone?phone=%2B1" + phone;

    const access_token = 'BAYaQkXitLcxtW-pKp3w6p8pEMVZYv7FF5FTEUJVrtJWbtVt5YQ9k80EgQ3bVv2eJr-Hh4xXh_uG0xWmf4hYKKM4Wy-cFrz8b803Xfi--USK3Em78pgQTr9hYT1nWHYx';
    let headers = {
      Authorization: 'Bearer '+ access_token
    };
    console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall2)(apiUrl, headers);
    console.log(response);
    return response;
//node js request    
    // let request = require("request");

    // let options = { method: 'GET',
    //   url: 'https://api.yelp.com/v3/businesses/search/phone',
    //   qs: { phone: phone },
    //   headers: {
    //     authorization: 'Bearer BAYaQkXitLcxtW-pKp3w6p8pEMVZYv7FF5FTEUJVrtJWbtVt5YQ9k80EgQ3bVv2eJr-Hh4xXh_uG0xWmf4hYKKM4Wy-cFrz8b803Xfi--USK3Em78pgQTr9hYT1nWHYx' } };

    // request(options, function (error, response, body) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(body);
    //     return body;
    //   };
    // });

  }, 
  yelp_search: function(term, loc) {
    this.unblock();
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.search({
          term:'coffee',
          location: '20902'
        }).then(response => {
          console.log(response.jsonBody.businesses[0].name);
        });
      }).catch(e => {
        console.log(e);
      });
  },
  yelp_reviews: function(term, loc) {
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.search({
          term:'coffee',
          location: '20902'
        }).then(response => {
          console.log(response.jsonBody.businesses[0].name);
        });
      }).catch(e => {
        console.log(e);
      });
  },
  yelp_phoneSearch: function(phone) {
    this.unblock();
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.phoneSearch({
          phone: phone
        }).then(response => {
          let res = response.jsonBody.businesses[0];
          // console.log(res);
          return res;
        });
      }).catch(e => {
        console.log(e);
      });
  },
  yelp_getID: function(phone) {
    this.unblock();
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
      const token = response.jsonBody.access_token;
      // console.log("YELP TOKEN:" + token);
      const client = Yelp.client(token);

      //then do search 
      let yid = client.phoneSearch({
        phone: phone
      }).then(response => {
        let res = response.jsonBody.businesses[0];
        console.log(res.id);
        return res.id;
      });
    }).catch(e => {
      console.log(e);
    });

  },
  yelp_business: function(id, loc) {
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.business('id').then(response => {
          console.log(response.jsonBody.name);
        }).then(response => {
          console.log(response.jsonBody.businesses[0].name);
        });
      }).catch(e => {
        console.log(e);
      });
  },
  yelp_autocomplete: function(term, loc) {
    // FROM 'NODE YELP' : https://github.com/olalonde/node-yelp
    // Request API access: http://www.yelp.com/developers/getting_started/api_access 
     
    // See http://www.yelp.com/developers/documentation/v2/search_api 

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.search({
          term:'coffee',
          location: '20902'
        }).then(response => {
          console.log(response.jsonBody.businesses[0].name);
        });
      }).catch(e => {
        console.log(e);
      });
  },
  yelp_transaction: function(location) {
    //RECEIVES LOCATION LAT/LNG OBJECT OR STRING

    Yelp.accessToken(yelp_id, yelp_secret).then(response => {
        const token = response.jsonBody.access_token;
        // console.log("YELP TOKEN:" + token);
        const client = Yelp.client(token);

        //then do search 
        client.transactionSearch('delivery', {
          location: location
        }).then(response => {
          console.log(response.jsonBody.businesses[0].name);
        });
      }).catch(e => {
        console.log(e);
      });
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
    this.unblock();
    Gdistance.get(
      {
        origin: orig,
        destinations: dests,
        units: 'imperial'
      },
      function(err, data) {
        if (err) {return console.log(err);}
        else {
          let info = data[1];
          let obj = {};
          console.log(info);
          obj.distance = info.distance;
          obj.disValue = info.distanceValue;
          obj.duration = info.duration;
          obj.durValue = obj.durationValue;
          return obj;
        }
        // let meters = data.distanceValue;
        // let miles = meters / 1609.344s;
        // return miles;
    });
    
  }
});


// http://api-business.usa.gov/XML?keyword=healthcare&size=50&offset=1&api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q


//   http://api-business.usa.gov/data/JSON?api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q&size=50&offset=1&ownership=minority