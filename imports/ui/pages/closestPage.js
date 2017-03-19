import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './closestPage.html';
import '../components/galleryCard.js';

Template.closestPage.onCreated(function() {
  let state = Session.get('clientState');
  Meteor.subscribe('listings_locs', function() {
  let cursor = Listings.find({
    location: { $exists : 1}, 
    certs: {$exists: 0},
    state: state
  });
    console.log("-= closestPage.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
  });
});

Template.closestPage.helpers({
  list: function() {
    let state = Session.get('clientState');
    let theList = Listings.find({
      location: { $exists : 1}, 
      certs: {$exists: 0},
      state: state
    });
    return theList;
  }
});

