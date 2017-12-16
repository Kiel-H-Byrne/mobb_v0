import Listings from '/imports/startup/collections/listings';

import './bragBox.html';

Template.bragBox.onCreated(function () {
  Meteor.subscribe('listings_locs');
});

Template.bragBox.helpers({
  listingCount: function() {
    let count = Listings.find().count();
    return count;
  }
});