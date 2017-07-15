// import { Request } from 'request/request';

import Listings from '/imports/startup/collections/listings';

import '../../api/orionCache.js';

//milktam:server-cache package - https://github.com/miktam/server-cache
//instantiates ApiCache obect which creates ' rest_+name+ ' upon creation, with time to live.
//ex. let cache = new ApiCache('name',ttl);

const OCache = new OrionCache('rest', 100000);

apiCall = function (apiUrl, callback) {
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
      errorMessage = error.response || error.response.data.error_message;
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

apiCall2 = function (apiUrl, headers, callback) {
  // try...catch allows you to handle errors 

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
  
};


Meteor.methods({
  addListing: function(doc) {
    Listings.insert(doc , function(err, res){
      if (err) {
        console.log("INSERT FAILED:");
        console.log(doc.name + ": " + err);
      } else {
        // console.log(doc.name + ": Success");
      }
    });
  },
  addCategory: function(doc) {
    Categories.insert(doc , function(err, res){
      if (err) {
        console.log(err.sanitizedError.message);
      } else {
        // console.log(res);
      }
    });
  },
  addToCategory: function(name,str){
    this.unblock();
// Listings.update({_id: "4JSojEdYpF3W4MFv6" },{$addToSet: { categories: "Barber" }});
    Listings.update({
      name: name
    },{
      $addToSet: {
         categories: str
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
    // console.log("--URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    // console.log(response);
    if (response) {
      // console.log("Geo RESPONSE:");
      // console.log(response);
      return response;
    }
    return;
  },
  submitPlace: function(doc) {
    this.unblock();
/*
      "location": {
        "lat": -33.8669710,
        "lng": 151.1958750
      }, [REQ'D]
      "accuracy": 50,
      "name": "Google Shoes!", [REQ'D]
      "phone_number": "(02) 9374 4000", [RECC'D]
      "address": "48 Pirrama Road, Pyrmont, NSW 2009, Australia", [RECC'D]
      "types": ["OTHER"], [REQ'D (ONLY ONE )]
      "website": "http://www.google.com.au/", [RECC'D]
      "language": "en-AU"
      };
*/
    if (doc.location) {
      const apiUrl = 'https://maps.googleapis.com/maps/api/place/add/json?key=' + Meteor.settings.public.keys.googleServer.key;
      const params = {};
      let locArr = doc.location.split(",");
      let locObj = {
        "lat": Number(locArr[0]),
        "lng": Number(locArr[1])
      };
      params.location = locObj;
      params.name = doc.name;
      params.phone_number = doc.phone;
      params.address = doc.street + ' ' + doc.state + ', ' + doc.zip;
      params.types = ["store"];
      params.accuracy = 20;
      params.website = doc.url;
      params.language = "en-US";
      // console.log(params);
      // console.log("***calling PLACES API method with "+params);
      try {
        const result = HTTP.post(apiUrl, {data: params});
        if (result.data) {
          console.log("OBTAINED NEW PLACE_ID FOR "+ doc.name);
          Listings.update({
            _id: doc._id 
          },{
            $set: { google_id: result.data.place_id } 
          });
        }
        return true;
      } catch(e) {
        console.log(e);
        return false;
      }
    } else {
      console.log("NO ADDRESS FOR "+ doc.name);
    }
  },
  getOG: function(url, id) {
    // this.unblock();
    if (!url) {
      console.log(`No URL for ${id}, so no OpenGraph.`);
      return false;
    } else {
      let param = encodeURIComponent(url);
      // console.log(param);
      console.log(`***calling OPENGRAPH API method with URL ${param} and ID ${Meteor.settings.public.keys.openGraph.key}`);
      let apiUrl = `https://opengraph.io/api/1.0/site/${param}?app_id=${Meteor.settings.public.keys.openGraph.key}` ;
      // console.log("--URL--"+apiUrl);
      const response = Meteor.wrapAsync(apiCall)(apiUrl);
      let obj = {};
      let images = [];
// console.log(response);
      obj = (!response.openGraph.error && response.openGraph.image) ? !response.openGraph : {};
      obj = (response.hybridGraph.image)? response.hybridGraph : {};
      obj = response.htmlInferred;

      if (response.error) {
        console.log(response.error.message);
        return false;
      }
      
      let img, uri, description;

      img = (obj.images && obj.images.length) ? obj.images[0] : (obj.image) ? obj.image : console.log(obj);

      description = (obj.description) ? obj.description : (obj.title) ? obj.title;

      let status = response.requestInfo.responseCode;
      // console.log(status);
      if (img) {
        uri = encodeURIComponent(img); 
        console.log(uri);
        // if (uri.includes('http://')) {
        if (img.includes('http://')) {  
          uri = img.replace("http://", "https://images.weserv.nl/?url=");
          console.log(uri);
        } 
        // else if (img.includes('https://')) {
        // else if (img.includes('https://')) {  
        //   uri = img.replace("https://", "https://images.weserv.nl/?url=ssl:");
        //   console.log(uri);
        // }
      }

      Listings.update({
        _id: id 
      },{
        $set: { 
          "image.url": uri,
          description: description,
      } });

      console.log(uri);
      return uri;
    }
  },
  bizSearch: function () {
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
  calcDistance: function(start,finish) {
    if (Meteor.isClient) {
      let dist = google.maps.geometry.spherical.computeDistanceBetween(start,finish);
      console.log(dist);
      return dist;
    }
  },
  convertImage: function(imageUrl) {
    console.log(imageUrl);
    try {
      console.log(Request);
      // let result = request.getSync(imageUrl, {encoding: null});
      // return 'data:image/png;base64,' + new Buffer(result.body).toString('base64');
      // console.log(result);
    } catch(e) {
      throw new Meteor.Error("cant-download", "Error: Can't download image." + e);
    }
  }
});


// http://api-business.usa.gov/XML?keyword=healthcare&size=50&offset=1&api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q


//   http://api-business.usa.gov/data/JSON?api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q&size=50&offset=1&ownership=minority