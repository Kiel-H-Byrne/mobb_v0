import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infoModal.html';
import './verifyForm.js';
import './closeButton.js';


Template.infoModal.helpers({
	'currentDoc': function() {
		let id = Session.get('openListing');
		let doc = Listings.findOne({_id: id});
		// console.log(doc);
		return doc;
	}	
});


Template.infoModal.events({
	'click #directions_button': function(evt,tpl) {
		let address = $('#address-content').text();
		
		let browserLoc = _.values(Session.get('browserLoc')).toLocaleString();
		let clientLoc = _.values(Session.get('clientLoc')).toLocaleString();
		let myLocation = clientLoc || browserLoc;
		Meteor.call('getDirections', myLocation, address, function(e,d) {
			if (e) {
				console.log("Error on getDirections Call"); 
			} else {
				// console.log(d);
				Session.set('myRoute', d.routes[0]); 
			}
		});
		// $('#modalInfo').closeModal();
		$('#modalDirections').openModal();
	}
}); 