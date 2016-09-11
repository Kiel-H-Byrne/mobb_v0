import { Template } from 'meteor/templating';

import './verifyForm.html';

Template.verifyForm.events({
	'submit form' : function(evt,tpl) {
		event.preventDefault();
		
		let comment = tpl.find('input#Comment').value;
		console.log(comment);
		let user = Meteor.userId();
		let date = new Date();
    Listings.update({
		    _id: doc._id 
		},{
		    $addToSet: {
		        upVotes: {
		        	voter: user,
		        	date: date,
		        	comment: comment
		        }
        }
		});
		console.log("-= Form: Submitted =-");
	}
});

Template.verifyForm.onRendered(function() {

      
});