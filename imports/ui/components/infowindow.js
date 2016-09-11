import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infowindow.html';
import './infowindow.css';

Template.infowindow.onCreated( function() {
	// console.log("Template Created...");
	// Session.set('infoWindowOpen', true);
});

Template.infowindow.events({
	'click'(event){
		console.log("hey!");
	},
	'click a'(event) {
		event.preventDefault();
		// console.log(this);
		console.log(event);
	}
});

Template.infowindow.onDestroyed(function() {
	// console.log("Template Destroyed...");
})