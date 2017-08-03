
import './mobileNav.html';
import './listCard.js';



Template.mobileNav.onCreated(function () {
  Meteor.subscribe('listings_locs', function () {
  let cursor = Listings.find({
    location: { $exists : 1}, 
    certs: {$exists: 0},
    // state: state
  });
    console.log("-= mobileNav.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LOCATIONS ONLY =-");
  });
});


Template.mobileNav.helpers({
  list: function () {
    let cursor = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
    }, {sort: {location: -1, name: 1}});
    
    return cursor;
  },
  favorites: function () {
  // get the array of ids
  let arr = Meteor.user().profile.favorites;
  let cursor = Listings.find({
    _id : {$in : arr}
  }, {
    sort: {name: 1, location: -1 }
  });
  return cursor;
  },
});
