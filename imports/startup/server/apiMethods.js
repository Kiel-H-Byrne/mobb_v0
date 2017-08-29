// import { Request } from 'request/request';

import Listings from '/imports/startup/collections/listings';
import { OCache } from '/imports/startup/collections/caches';
import { GCache } from '/imports/startup/collections/caches';

// import '../../api/orionCache.js';

apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors 
  let errorCode, errorMessage;
  try {

    let dataFromCache = OCache.get(apiUrl);
    console.log("CHECKING CACHE: "+apiUrl);
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

Meteor.methods({
  addListing: function(doc) {
    check(doc, Object);
    return Listings.insert(doc , function(err, res){
      if (err) {
        console.log("INSERT FAILED:");
        console.log(doc.name + ": " + err);
      } else {
        // console.log(doc.name + ": Success");
        return res;
      }
    });
  },
  editListing: function(doc) {
    check(doc, Object);
    Listings.update(doc , function(err, res){
      if (err) {
        console.log("UPDATE FAILED:");
        console.log(doc.name + ": " + err);
      } else {
        // console.log(doc.name + ": Success");
      }
    });
  },
  addCategory: function(doc) {
    check(doc, Object);
    Categories.insert(doc , function(err, res){
      if (err) {
        console.log(err.sanitizedError.message);
      } else {
        // console.log(res);
      }
    });
  },
  addToCategory: function(name,str){
    check(name, String);
    check(str, String);
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
    check(u, String);
    check(p, String);
    Meteor.loginWithPassword(u, p);
  },
  setCache: function(cache, key, val) {
    check(cache, Object);
    check(key, String);
    check(val, Object);
    // check(val, String);
    return cache.set(key,val);
  },
  getCache: function(cache, key) {
    check(cache, Object);
    check(key, String);
    return cache.get(key);
  },
  registerMe: function(o) {
    check(o, Object);
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
    check(address, String);
   
    let apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + Meteor.settings.public.keys.googleServer.key;
    console.log("--'geoCode()' URL--"+apiUrl);
    let response = Meteor.wrapAsync(apiCall)(apiUrl);
    // console.log(response);
    if (response) {
      // console.log("Geo RESPONSE:");
      // console.log(response);
      return response;
    }
    return;
  },
  checkGDetails: function(gid) {
    this.unblock();
    check(gid, String);
    let dataFromCache = GCache.get(gid);
    if(dataFromCache) {
      console.log("Details Data from GCache...");
      // console.log(dataFromCache);
      return dataFromCache;
    } else {
// this runs when i have google ID already and nothing in cache
      if (Meteor.isClient) {
        console.log("nothing in cache");
        getGDetails(gid);
      }
      return;
    }
  },
  placeDetails: function(google_id) {
    this.unblock();
    check(google_id, String);
    const key = Meteor.settings.public.keys.googleAPI.key;
    const apiUri = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${google_id}&key=${key}`;
    // console.log("--GOOGLE PLACES: DETAILS SEARCH URL--" + apiUri);
    let response = Meteor.wrapAsync(apiCall)(apiUri);
    if (response) {
      // console.log(response);
      return response.result; 
    }
    return;
  },
  placesSearch: function (name, loc) {
    // SEARCHES FOR A GOOGLE PLACE_ID GIVEN NAME AND LOCATION (CAN ALSO USE ADDRESS, NAME, LOCATION)
    // UPDATES RELATED DOCUMENTs GOOGLE_ID
    // CALLED FROM SCHEMA (LOCATION FIELD)
    this.unblock();
    check(name, String);
    check(loc, String);
    //requ'd: key, location, radius (meters), 
    // optional: keyword ()
    const key = Meteor.settings.public.keys.googleServer.key;

    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc}&radius=20&keyword=${name}&key=${key}`;
    // console.log("--GOOGLE PLACES: NEARBY SEARCH URL--"+apiUrl);
    const response = Meteor.wrapAsync(apiCall)(apiUrl, function(n,r) {
      if (r.status === "ZERO_RESULTS") {
        //no place_id exists in google, so return false and submit one on their behalf.
        console.log("no results");
        return false;
      } else {
        let result = r.results[0];
        console.log(result);  
        const doc = Listings.findOne({"name": name});
        if (result.name) {
          let firstours = result.name.split(/\W/, 1)[0];
          let firsttheirs = result.name.split(/\W/, 1)[0];
          console.log(firstours, firsttheirs);
          if (firstours == firsttheirs) {
            console.log("MATCH!");
            Listings.update({
              _id: doc._id 
            },{
              $set: { google_id: result.place_id } 
            });
            return result.place_id;
          } else {
            console.log(`${result.name}(googles) and ${name}(ours) are not a match`);
            return false;
          }
        } else {
          console.log("no name to check against");
          return false;
        }
      }
    });
    // console.log("still running");
    return response;
  },
  getPlacePhotos: function(photoref) {
    check(photoref,String);
    console.log(photoref);
    let uri = "https://maps.googleapis.com/maps/api/place/photo?";
    let key = Meteor.settings.public.keys.googleServer.key;
    let options = {maxwidth: 100};
    const apiUri = `${uri}maxwidth=100&reference=${photoref}&key=${key}`;
    let response = Meteor.wrapAsync(apiCall)(apiUri);
    if (response) {
      console.log(response);
      return response.result; 
    }
    return;


// https://maps.googleapis.com/maps/api/place/photo?reference=CmRaAAAAIhZlz7AzBuXRVNqLTYHTR3-mRm7qJsrJzNMAyatu0FA-_-N43pG7OVkUUf26_xaqIYYVDIfQT_uvDJT1g9AsorUTkTiQIUqv9_XhqBOvzUGOfKeGS9SNF2Cc0DYo_3tuEhCedP0FW5EZw-7iiIoTgPegGhSxA0PGScR3BEPhcxagdSRwvXZayg&maxwidth=100&key=AIzaSyAuvQtaNuOF1phJQcTv3ytk9VyNCrlrOO4
  },
  submitPlace: function(doc) {
    //THIS METHOD SUBMITS THE ADDRESS TO GOOGLE, AND GOOGLE RETURNS A "GOOGLE_ID"
    check(doc, Object);
    
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
    let gidFromCache = OCache.get(doc.address);
    if (gidFromCache && !doc.google_id) {
      // console.log(gidFromCache);
      Listings.update({
        _id: doc._id 
      },{
        $set: { google_id: gidFromCache } 
      });
      console.log('RETURNING PLACE_ID FROM OCACHE...');
      return gidFromCache;
    } else {
      let apiUrl = 'https://maps.googleapis.com/maps/api/place/add/json?key=' + Meteor.settings.public.keys.googleServer.key;
      const params = {};
      let locArr = doc.location.split(",");
      let locObj = {
        "lat": Number(locArr[0]),
        "lng": Number(locArr[1])
      };
      params.location = locObj;
      params.name = doc.name;
      params.phone_number = doc.phone;
      params.address = doc.address;
      params.types = ["establishment"];
      params.accuracy = 20;
      params.website = doc.url;
      params.language = "en-US";
      // console.log(params);
      // console.log("***calling PLACES API method", params);
      try {
        let result = HTTP.post(apiUrl, {data: params});
        if (result.data) {
          console.log("OBTAINED NEW PLACE_ID FOR "+ doc.name);
          Listings.update({
            _id: doc._id 
          },{
            $set: { google_id: result.data.place_id } 
          });

          OCache.set(doc.address, result.data.place_id);
        return result.data.place_id;
        }
      } catch(e) {
        console.log(e);
        // return false;
      }
    }
  },
  getOG: function(url, id) {
    check(url, String);
    check(id, String);
    
    if (!url) {
      console.log(`No URL for ${id}, so no OpenGraph Data.`);
      return false;
    } else {
      let param = encodeURIComponent(url);
      // console.log(param);
      // console.log(`***calling OPENGRAPH API method with URL ${param} and KEY ${Meteor.settings.public.keys.openGraph.key}`);
      let apiUrl = `https://opengraph.io/api/1.0/site/${param}?app_id=${Meteor.settings.public.keys.openGraph.key}` ;
      // console.log("--URL--"+apiUrl);
      const response = Meteor.wrapAsync(apiCall)(apiUrl);
      // console.log(response);
      if (response.error) {
        console.log(response.error.message);
        return false ;
      }

      const res = {};
      // console.log(response);

      let hiObj = response.htmlInferred;
      let hgObj = (response.hybridGraph.image) ? response.hybridGraph : null;
      let ogObj = (!response.openGraph.error && response.openGraph.image) ? response.openGraph : null;
      
      res.obj = hgObj || ogObj || hiObj;
      // console.log(res.obj);

      // img = (ogObj) ? ogObj.image.url : (hgObj) ? hiObj.image : (hiObj) ? hiObj.image_guess : console.log("no img");
      let img = (res.obj.image) ? res.obj.image || res.obj.image.url : (res.obj.image_guess) ? res.obj.image_guess : res.obj.images[0];

      // description = (ogObj) ? ogObj.description || ogObj.title : (hgObj) ? hgObj.description || hgObj.title : (hiObj) ? hiObj.description || hiObj.title : console.log("no descr");;
      const description = res.obj.description || res.obj.title || null;
    

      const status = response.requestInfo.responseCode;
      // console.log(status);
      if (img) {
        // uri = encodeURIComponent(img); 
        // console.log(img);
        // if (uri.includes('http://')) {
        if (img.includes('http://')) {  
          img = img.replace("http://", "https://images.weserv.nl/?url=");
          // console.log(img);
        } 
        // else if (img.includes('https://')) {
        // else if (img.includes('https://')) {  
        //   uri = img.replace("https://", "https://images.weserv.nl/?url=ssl:");
        //   console.log(uri);
        // }
        //this was causing schema to balk; had to add "if this.isInsert" to location autovalue.
        //sibling fields were returning undefined in schemas during update process.

        Listings.update({
          _id: id 
        },{
          $set: { 
            "image.url": img,
            description: description,
          } 
        });

      console.log(img);
      return img;
      }
    }
  },
  setGID: function(id, google_id) {
    check(id, String);
    check(google_id, String);
    Listings.update(
      { _id: id },
      { $set: { google_id: google_id } }
    );
  },
  calcDistance: function(start,finish) {
    check(start, Object);
    check(finish, Object);
    if (Meteor.isClient) {
      let dist = google.maps.geometry.spherical.computeDistanceBetween(start,finish);
      console.log(dist);
      return dist;
    }
  }
});


// http://api-business.usa.gov/XML?keyword=healthcare&size=50&offset=1&api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q


//   http://api-business.usa.gov/data/JSON?api_key=RC6NXt4BfjScFhF5s3LFldxNyrgiQkog0Be9xI8q&size=50&offset=1&ownership=minority