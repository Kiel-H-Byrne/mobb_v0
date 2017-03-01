import { Template } from 'meteor/templating';
import Listings from '/imports/startup/collections/listings';

import './verifyForm.html';

Template.verifyForm.events({
	// 'submit form' : function(evt,tpl) {
	// 	event.preventDefault();
	// 	// let comment = tpl.find('input#Comment');
	// 	// let comment = evt.target.elements[0].value;
	// 	let comment = evt.target.elements.Comment.value;
	// 	console.log(comment);
	// 	let docId = Session.get('openListing');
	// 	let user = Meteor.userId();
 //    Listings.update({
	// 	    _id: docId
	// 	},{
	// 	    $addToSet: {
	// 	        upVotes: {
	// 	        	voter: user,
	// 	        	date: new Date(),
	// 	        	comment: comment
	// 	        }
 //        }
	// 	});
	// 	console.log("-= Form: Submitted =-");
	// }
});

Template.verifyForm.onRendered(function() {

      
});

AutoForm.addHooks('upVoteForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log('Just submitted form, from verifyForm.js');
        //close modal on submit
        $('#modalVerify').modal('close');

		    this.done(); // submitted successfully, call onSuccess
		    return false;
    },

  // Called when any submit (type=insert or update) operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!", result);
  	$('#modalVerify').modal('close');
  },
});