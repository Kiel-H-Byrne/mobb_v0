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
  // $('.modal-trigger').leanModal({
  //   dismissible: true, // Modal can be dismissed by clicking outside of the modal
  //   opacity: 0.5, // Opacity of modal background
  //   in_duration: 300, // Transition in duration
  //   out_duration: 200, // Transition out duration
  //   starting_top: '4%', // Starting top style attribute
  //   ending_top: '10%', // Ending top style attribute
  //   ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
  //     alert("Ready");
  //     console.log(modal, trigger);
  //   },
  //   complete: function() { alert('Closed'); } // Callback for Modal close
  //   });
  
  this.autorun(function() {
    let controller = Iron.controller();
    let action = controller.getParams();
    console.log(controller);
    if (action=="modal"){
      let alertsModal = $('#infoModal');
      alertsModal.modal("open");
      controller.setParams({
        action: null
      });
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