import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './galleryPage.html';
import '../components/galleryCard.js';

Template.galleryPage.onCreated(function() {
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

Template.galleryPage.onRendered(function() {
	$(document).ready(function(){
		// const msnry = new Masonry('.card-wrapper', {
		// 	// columnWidth: 200,
		// 	itemSelector: '.info-card'
		// });

		// $('.card-wrapper').masonry({
		//   itemSelector: '.info-card',
		//   // columnWidth: 160
		// });

	});
});
Template.galleryPage.helpers({
  list: function() {
		let urlList = Listings.find({
			url: { $exists : 1}, 
			street: {$exists: 0}
		}, {
			sort: { name: 1}
		});
		return urlList;
	}
});

