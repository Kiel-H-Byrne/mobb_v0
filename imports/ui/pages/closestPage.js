import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { Masonry } from 'masonry-layout/masonry.js';

import './closestPage.html';
import '../components/galleryCard.js';

Template.closestPage.onCreated(function() {
  Meteor.subscribe('listings_locs', function() {
  let cursor = Listings.find({
    location: { $exists : 1}, 
    certs: {$exists: 0},
    // state: state
  });
    console.log("-= closestPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
  });
});

Template.closestPage.onRendered(function() {
  $(document).ready(function(){
    
    let msnry = new Masonry('.closestFlex', {
     itemSelector: '.closestFlex_item',
     columnWidth: '.closestFlex_sizer',
     percentPosition: true
    });

    // $('.masonflex').masonry({
    //   itemSelector: '.masonflex_item',
    //   // columnWidth: 160
    // });

  });
});

Template.closestPage.helpers({
  list: function() {
    let theList = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
    });
    return theList;
  }
});

