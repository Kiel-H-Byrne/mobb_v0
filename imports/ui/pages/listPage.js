import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './listPage.html';
import '../components/infoCard.js';

Template.listPage.onCreated(function() {
	Meteor.subscribe('listings_urls', function() {
		let cursor = Listings.find({
	      url: { $exists : 1 }
	  });
	  console.log("-= MAP.JS SUBSCRIBING: ALL ["+ cursor.count() +"] LISTINGS WITH URLS =-");
	});
});


Template.listPage.helpers({
  list: function() {
		let urlList = Listings.find({
	      url: { $exists : 1 }
	  });
		return urlList;
	}
});


