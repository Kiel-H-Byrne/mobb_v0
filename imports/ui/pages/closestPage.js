import './closestPage.html';
import '../components/galleryCard.js';

Template.closestPage.onCreated(function () {


});

Template.closestPage.onRendered(function () {
  Meteor.subscribe('listings_locs', function () {
    // console.log("-= closestPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LOCATIONS ONLY =-");
  });
    
  $(document).ready(function (){
    if ($('.closestFlex')[0]) {
      // let msnry = new Masonry('.closestFlex', {
      //  itemSelector: '.closestFlex_item',
      //  columnWidth: '.closestFlex_item',
      //  horizontalOrder: true,
      //  percentPosition: true,
      //  gutter: 10
      // });

      // ImagesLoaded( '.closestFlex_item', function () {
      //   msnry.layout();
      // });

      // function onLayout() {
      //   console.log('layout done');
      // }
      // // bind event listener
      // msnry.on( 'layoutComplete', onLayout );

      $('.closestFlex').masonry({
        itemSelector: '.closestFlex_item',
        columnWidth: 160,
        gutter: 10,
        horizontalOrder: true
      });
   }
   
  });
});

Template.closestPage.helpers({
  list: function () {
    let theList = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
    }, {sort: {location: -1, name: 1}});
    
    return theList;
  }
});

