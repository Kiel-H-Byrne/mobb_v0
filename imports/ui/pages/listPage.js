import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './listPage.html';

Template.listPage.onCreated(function() {
  Meteor.subscribe('listings_online_only', function() {
    let cursor = Listings.find({
      url: { $exists : 1}, 
      street: {$exists: 0}
    }, {
      sort: { name: 1}
    });
    console.log("-= MAP.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
  });
});


Template.listPage.helpers({
  list: function() {
    let urlList = Listings.find({
      url: { $exists : 1}, 
      street: {$exists: 0}
    }, {
      sort: { name: 1}
    });
    return urlList;
  },
  in_favorites: function() {
    //if id matches in favorites array, return true.
    let id = this._id;
    let favArray = Meteor.user().profile.favorites;
    // console.log(favArray);
    let inArray = !_.isEmpty(_.where(favArray, id));
    return inArray;
  }
});

Template.listPage.events({
  'click .add_favorite': function(evt,tpl) {
    if (Meteor.user) {
      let docId = this._id;
      let userId = Meteor.user()._id;
      // Meteor.user().profile.favorites.push(id);
      Meteor.users.update({
        _id: userId
      },{
        $addToSet: {"profile.favorites" : docId}
      });
    }
  },
  'click .remove_favorite': function(evt,tpl) {
    if (Meteor.user) {
      let docId = this._id;
      let userId = Meteor.user()._id;
      Meteor.users.update({
        _id: userId
      },{
        $pull: {"profile.favorites" : docId}
      });
    }
  }
});
