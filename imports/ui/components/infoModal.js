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
  
//   this.autorun(function() {
//     //When url changes to '/listings/:name' or '/categories/:name', open modal with listing data, or filter list to show only those cards in category..
//     let controller = Iron.controller();
//     let params = controller.getParams();
    
//     // console.log(params);
//     if (params.name) {
//       // let doc = Listings.findOne({
//       //   name: params.name
//       // });
//       // console.log(doc);
//       // $('#modalFull').modal('open');

//     // } else if (params.title) {
//     //   // console.log(result);
//     //   let category = Categories.findOne({
//     //     title: result
//     //   });
//     //   console.log(category);
//     //   Router.go('/categories/' + category._id);
//     }
//   });

});

Template.infoModal.events({
	'click #directions_button, touchstart #directions_button': function(evt,tpl) {
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
		// $('#modalInfo').modal('close');
		$('#modalDirections').modal('open');
	}, 
	'click #verify_button, touchstart #verify_button': function(evt,tpl) {
		console.log("Clicked Verify button!");
		//open modal verify form.
		$('#modalVerify').modal('open');
		}
}); 