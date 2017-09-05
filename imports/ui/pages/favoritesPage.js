import './favoritesPage.html';
import '../components/galleryCard.js';

Template.favoritesPage.onCreated(function () {
  Meteor.subscribe('listings_favorites', function () {
    // console.log("-= favoritesPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] FAVORITES =-");
  });
});

Template.favoritesPage.onRendered(function () {
  $(document).ready(function (){
    if ($('#masonry_wrapper-fave .masonry_item')) {
      let msnry = new Masonry('#masonry_wrapper-fave', {
       columnWidth: '#masonry_wrapper-fave .masonry_item',
       itemSelector: '#masonry_wrapper-fave .masonry_item'
      });

      ImagesLoaded( '#masonry_wrapper-fave .masonry_item', function () {
        msnry.layout();
      });

      msnry.layout();


      // let fGrid = $('#masonry_wrapper-fave').masonry({
      //   itemSelector: '#masonry_wrapper-fave .masonry_item',
      //   columnWidth: '#masonry_wrapper-fave .masonry_item',
      //   horizontalOrder: true
      // });

      // fGrid.masonry('layout');

      // fGrid.imagesLoaded( function() {
      //   console.log('f imgs loaded');
      //     fGrid.masonry('layout');
      // });

    }
  });
});

Template.favoritesPage.helpers({
  favorites: function () {
    // get the array of ids
    let arr = Meteor.user().profile.favorites;
    // for some reason the favorites array has one entry: 'NeQChWMre5Yh4ooBq'
    // so it's nevery truly 'empty'; if greater than one, return list.
    if (arr.length >= 1) {
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

