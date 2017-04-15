import Listings from '/imports/startup/collections/listings';

// meteor methods should be created on both server and client, so 'optimistic UI' 
// can take place, call runs from both, but should be called from client. 
ID_Cache = new orion.collection('id_cache', {
  singularName : 'id_cache',
  pluaralName : 'ID_Cache',
  link : {title: 'ID_Cache'}, 
  tabular : {
    columns : [
      { 
        data: "key", 
        title: "API Call" 
      },{ 
        data: "value", 
        title: "API Response" 
      },
        // orion.attributeColumn('createdAt', 'createdAt', 'Retrieved @')
        {
          data: "createdAt",
          title: "Retrieved @"
        }
    ]
  }
});  

//schema, unique keys only, response optional.


ID_Cache.allow({
  insert: function(userId, query) { return true; },
  update: function(userId, query) { return ownsDocument(userId, query); },
  remove: function(userId, query) { return ownsDocument(userId, query); },
});

const myCall = function (func, param, callback) {
  // try…catch allows you to handle errors 
  let errorCode, errorMessage;
  try {

    // let dataFromCache = ID_Cache.get(ref);
    // console.log("key: "+apiUrl);
    let response = {};

    if(dataFromCache) {
      console.log("Data from myCache...");
      response = dataFromCache;
    } else {
      console.log("Data from API...");
      //get the response and stash it in OCache.
      // response = Meteor.call(func, param);
      ID_Cache.set(ref, response);
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
  getGoogleID: function(m,n,l) {
    //map should be GoogleMaps.maps.<<name>> 
    //name is listing name
    //loc is object literal
    if (Meteor.isServer) {
      ID_Cache._ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 10600 } );
    }
    let dataFromCache = ID_Cache.findOne({key: n});
    console.log(GRCache);
      const res = {};
      if(dataFromCache) {
        console.log("Data from Cache...");
        console.log(dataFromCache);
        return dataFromCache;
      } else {
        if (GoogleMaps.loaded()) {
          console.log("Data from API...");
        //   //get the response and stash it in GRCache.
          const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
          console.log(map);
          const service = new google.maps.places.PlacesService(map.instance);

          const req = {
              placeId: gid
          };
          const cbk = function(res,stat) {
            if (stat === google.maps.places.PlacesServiceStatus.OK) {
                console.log(res);
                // ID_Cache.findOne({key: key}, {$set: {value: place_id}});
                 GRCache.set(gid, res);
                 Session.set('thisPlace', res);
                // resolvedData.set('placeDetails', res);
                return res;
                //inject with jquery into dom?
            } else {
                console.log(stat);
                Session.set('thisPlace',null);
            }
          };

        return service.getDetails(req, cbk);

      } else {
      console.log ("Map not yet loaded..."); 
      } 
    } 
  },

 getReviews: function(id) {
    // if (Meteor.isServer) {
    //   ID_Cache._ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } );
    // }
    if (Meteor.isClient && (Session.get('clientLoc') || Session.get('browserLoc')) && name) {
      // let dataFromCache = ID_Cache.findOne({key: name});
      // console.log(dataFromCache);
      // if(dataFromCache) {
      //   console.log("Data from Cache...");

      //   return dataFromCache;
      // } else {
      //   console.log("Data from API...");
      //   //get the response and stash it in OCache.
        
        let inst = GoogleMaps.maps.minimap.instance;
        let service = new google.maps.places.PlacesService(inst);

        let request = {
            placeId: 'ChIJdT5Y94TIt4kRcIAIK6khBm4'
        };

        let callback = function(results,status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
                // ID_Cache.findOne({key: key}, {$set: {value: place_id}});
                return results;
            } else {
                console.log(status);
            }
        };

        // console.log(service);
        service.getDetails(request, callback);

    }    

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
    console.log("YELP RESPONSE");
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

  }
});


