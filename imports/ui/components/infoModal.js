import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import Listings from '/imports/startup/collections/listings';

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

Template.infoModal.onRendered(function() {
  
  this.autorun(function() {
    let controller = Iron.controller();
    let params = controller.getParams();
    console.log(params);
    if (params.query.results) {
      let result = params.query.results;
      let listing = Listings.findOne({
        name: result
      });
      if (listing) {
        console.log(listing._id);
        Session.set('openListing', listing._id);  
        $('html, body').animate({
          scrollTop: $('#' + listing._id).offset().top
        }, 1000);
      } else {
        console.log(result);
        let category = Categories.findOne({
          title: result
        });
        console.log(category);
        // Router.go('/categories/' + category._id);
      }      
    }
  });

});

Template.infoModal.events({
	'click #directions_button': function(evt,tpl) {
		let address = $('#address-content').text();
		
		let browserLoc = _.values(Session.get('browserLoc')).toLocaleString();
		let clientLoc;
		if (Session.get('clientLoc')) {
			clientLoc = _.values(Session.get('clientLoc')).toLocaleString();
			}
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
	}, 
	'click #verify_button': function(evt,tpl) {
		console.log("Clicked Verify button!");
		//open modal verify form.
		$('#modalVerify').openModal();
		}
}); 