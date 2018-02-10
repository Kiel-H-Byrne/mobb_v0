import Listings from '/imports/startup/collections/listings';

import './bragBox.html';
import '/public/js/odometer-0.4.6/odometer.min.js';
// import '/public/js/odometer-0.4.6/themes/odometer-theme-digital.css';

Template.bragBox.onCreated(function () {
  let subscription = this.subscribe('listings_locs', function () {
    let cursor = Listings.find({
      location: { $exists : 1}
    });
    cursor.observeChanges({
      added: function(id,doc) {
        //update value
        $('.odometer').html(cursor.count());
        console.log(cursor.count());
      }, 
      removed: function() {
        $('.odometer').html(cursor.count());
        console.log(cursor.count());
      }
    });
  });
});

Template.bragBox.onRendered(function () {
  $(document).ready(function (){
    let bbox = document.querySelector('.odometer');
    od = new Odometer({
      el: bbox,
      value: Listings.find().count(),
      theme: 'car'
    });
  });
});



Template.bragBox.helpers({
  listingCount: function() {
    let count = Listings.find().count();
    return count;
  }
});
