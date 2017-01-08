import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './galleryPage.html';
import '../components/galleryCard.js';

Template.galleryPage.onCreated(function() {
	Meteor.subscribe('listings_online_only', function() {
		let cursor = Listings.find({
	      url: { $exists : 1 },
	      location: {$exists: 0}
	  });
	  console.log("-= MAP.JS SUBSCRIBING: ALL ["+ cursor.count() +"] ONLINE ONLY =-");
	});
});


Template.galleryPage.helpers({
  list: function() {
		let urlList = Listings.find({
			url: { $exists : 1},
			location: {$exists: 0}
		});
		return urlList;
	}
});


