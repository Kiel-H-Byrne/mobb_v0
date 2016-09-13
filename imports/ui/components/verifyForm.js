import { Template } from 'meteor/templating';

import './verifyForm.html';

Template.verifyForm.events({
	'submit form' : function(evt,tpl) {
		event.preventDefault();
		// let comment = tpl.find('input#Comment');
		// let comment = evt.target.elements[0].value;
		let comment = evt.target.elements['Comment'].value;
		console.log(comment);
		let docId = Session.get('openListing');
		let user = Meteor.userId();
    Listings.update({
		    _id: docId
		},{
		    $addToSet: {
		        upVotes: {
		        	voter: user,
		        	date: new Date(),
		        	comment: comment
		        }
        }
		});
		console.log("-= Form: Submitted =-");
	}
});

Template.verifyForm.onRendered(function() {

      
});