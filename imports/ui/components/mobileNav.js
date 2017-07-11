
import './mobileNav.html';


Template.listCard.onRendered( function () {
  $(document).ready(function() {
    $(".button-collapse_fav").sideNav();
    $(".button-collapse_near").sideNav();
  });
});


Template.mobileNav.onCreated(function () {
  Meteor.subscribe('listings_locs', function () {
  let cursor = Listings.find({
    location: { $exists : 1}, 
    certs: {$exists: 0},
    // state: state
  });
    console.log("-= closestPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
  });
});


Template.mobileNav.helpers({
  list: function () {
    let theList = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
    }, {sort: {location: -1, name: 1}});
    
    return theList;
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
