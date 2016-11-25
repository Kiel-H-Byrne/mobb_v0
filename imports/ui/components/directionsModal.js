import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './directionsModal.html';

Template.directionsModal.events({
	'click #closeButton_button' : function(evt,tpl){
	    //close modal
	    this.closeModal();
	  }
});

Template.directionsModal.helpers({
	'route': function() {
		let route = Session.get('myRoute');
		if (route) {
			let leg = route.legs[0];
			return leg;
		}
	}
})