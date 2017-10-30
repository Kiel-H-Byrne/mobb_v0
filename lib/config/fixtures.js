import '/imports/startup/collections/categories.js';
import '/imports/startup/collections/listings.js';

const json_listings = require('./listings.json');
const json_bbb = require('./listings_bbb.json');
const json_iddc  = require('./listings_iddc.json');
const json_bbb2 = require('./listings_bbb2.json');
const json_categories = require('./categories.json'); //with path

const readJSON = function(fileName) {
  let arrayName = Object.keys(fileName)[0];
  let jsonArray = fileName[Object.keys(fileName)[0]];
  console.log("-= LISTINGS: Seeding from JSON file: '"+ arrayName +"' =-");
  
  _.each(jsonArray, function(doc) {
    Meteor.call('addListing', doc);
  });
};

if (Meteor.isClient) {
  Meteor.subscribe('roles', {
    onReady: function () {
      if (Roles.userHasRole(Meteor.userId(), "admin")) {
        console.log("-= ADMIN: Logged In =-");

        Meteor.subscribe('listings', {
          onReady: function () {
            let max = 180;
            let count = Listings.find().count();
            if (count <= max) {
              console.log("-= LISTINGS Less than " + max + " =-");
              readJSON(json_listings);
              readJSON(json_bbb);              
              readJSON(json_iddc);
              readJSON(json_bbb2);
            } else {
              // COLLECTION is full
            }
          }
        });

        Meteor.subscribe('categories', {
          onReady: function () {
            const count = Categories.find().count();
            if ( count === 0) {
              //TODO: make readJSON work with categories too...
              let fN = json_categories;
              let aN = Object.keys(fN)[0];
              let jA = fN[Object.keys(fN)[0]];
              
              console.log("-= CATEGORIES: Seeding from JSON file: '"+ aN +"' =-");             
              
              _.each(jA, function(doc) {
                Meteor.call('addCategory', doc);
              });

            } else {
              // COLLECTION is full
            }
          }
        });

      } else {
        // console.log("No Admin");
      return;
      }
    }
  });

}
