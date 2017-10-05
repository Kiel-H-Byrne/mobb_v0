
import './mobileNav.html';
import './listCard.js';



Template.mobileNav.onCreated(function () {
  Meteor.subscribe('listings_favorites');
});


Template.mobileNav.helpers({
  list: function () {
    let cursor = Listings.find({
      location: { $exists : 1}
    }, {sort: {location: -1}});
    
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
