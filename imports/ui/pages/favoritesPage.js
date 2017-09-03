import './favoritesPage.html';
import '../components/galleryCard.js';

Template.favoritesPage.onCreated(function () {
  Meteor.subscribe('listings_favorites', function () {
    // console.log("-= favoritesPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] FAVORITES =-");
  });
});

Template.favoritesPage.onRendered(function () {
  $(document).ready(function (){
    if ($('.favoritesFlex')[0]) {
      let msnry = new Masonry('.favoritesFlex', {
       itemSelector: '.favoritesFlex_item',
       columnWidth: '.favoritesFlex_sizer',
       percentPosition: true
      });

      ImagesLoaded( '.favoritesFlex_item', function () {
        msnry.layout();
      });
    }
    
  });
});

Template.favoritesPage.helpers({
  favorites: function () {
    // get the array of ids
    let arr = Meteor.user().profile.favorites;
    // for some reason the favorites array has one entry: 'NeQChWMre5Yh4ooBq'
    // so it's nevery truly 'empty'; if greater than one, return list.
    if (arr.length > 1) {
      let cursor = Listings.find({
        _id : {$in : arr}
      }, {
        sort: {name: 1, location: -1 }
      });
      return cursor;
    } else {
      return false;
    }
  }
});

