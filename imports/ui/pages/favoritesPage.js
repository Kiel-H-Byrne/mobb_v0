import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './favoritesPage.html';
import '../components/galleryCard.js';

Template.favoritesPage.onCreated(function() {
  Meteor.subscribe('listings_locs', function() {
  let cursor = Listings.find({
    location: { $exists : 1}, 
    certs: {$exists: 0},
    // state: state
  });
    console.log("-= favoritesPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
  });
});

Template.favoritesPage.onRendered(function() {
  $(document).ready(function(){
    if ($('.favoritesFlex')[0]) {
      let msnry = new Masonry('.favoritesFlex', {
       itemSelector: '.favoritesFlex_item',
       columnWidth: '.favoritesFlex_sizer',
       percentPosition: true
      });

      imagesLoaded( 'favoritesFlex_item', function() {
        msnry.layout();
      })
    }
    
  });
});

Template.favoritesPage.helpers({
  favorites: function() {
    // get the array of ids
    let arr = Meteor.user().profile.favorites;
    let cursor = Listings.find({
      _id : {$in : arr}
    }, {
      sort: {name: 1, location: -1 }
    });
    return cursor;
  }
});

