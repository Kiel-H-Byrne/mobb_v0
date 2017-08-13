
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

Template.verifyForm2.helpers({
  getName: function() {
    let user = Meteor.user();
    console.log(user.profile.name);
    return user.profile.name;
  }
})

Template.verifyForm2.onRendered(function () {
  $(document).ready(function () {
      $('#modalVerify').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '10%', // Starting top style attribute
        endingTop: '24%', // Ending top style attribute
      });
  });
      
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