import './closestPage.html';
import '../components/galleryCard.js';

Template.closestPage.onCreated(function () {
  Meteor.subscribe('listings_locs', function () {
    // console.log("-= closestPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LOCATIONS ONLY =-");
  });

});

Template.closestPage.onRendered(function () {
  
  $(document).ready(function (){
    if ($('#masonry_wrapper-close')[0]) {
      let msnry = new Masonry('#masonry_wrapper-close', {
       columnWidth: '#masonry_wrapper-close .masonry_item',
       itemSelector: '#masonry_wrapper-close .masonry_item'
      });

      ImagesLoaded( '#masonry_wrapper-close .masonry_item', function () {
        msnry.layout();

      });

      msnry.layout();

      // let cGrid = $('#masonry_wrapper-close').masonry({
      //   itemSelector: '#masonry_wrapper-close .masonry_item',
      //   columnWidth: '#masonry_wrapper-close .masonry_item',
      //   horizontalOrder: true
      // });
      // cGrid.masonry('layout');

      // cGrid.imagesLoaded( function() {
      //   console.log('c imgs loaded');
      //     cGrid.masonry('layout');
      // });
   }
  });
});

Template.closestPage.helpers({
  list: function () {
    let cursor = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
    }, {sort: {location: -1, name: 1}});
    
    return cursor;
  }
});

