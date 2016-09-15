import { Template } from 'meteor/templating';

import './addForm.html';

// Template.addForm.events({
// 	'click button' : function(evt,tpl) {
// 		event.preventDefault();
// 		let l = {};
// 		l.name = tpl.find('input#listingName').value;
// 		console.log(tpl);
// 		Meteor.call('insertBiz', {
// 			name: l.name,
// 			street: l.address1,
// 			address2: l.address2,
// 			city: l.city,
// 			state: l.state,
// 			zip: l.zip,
// 			country: l.country
// 		});
		
// 		console.log("-= Form: Submitted =-");
// 	}
// });

// Template.addForm.onRendered(function() {
// //show the input form for optional fields, only if the associated checkbox is checked
// 	$('#supplied').click(function() {
// 	  $('.date')[this.checked ? "show" : "hide"]();
// 	});
// });


AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log('Just submitted form, from addform.js');
        //close modal on submit
        $('#modalAdd').closeModal();

		    this.done(); // submitted successfully, call onSuccess
		    return false
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!");
  	$('#modalAdd').closeModal();
  },
});


AutoForm.addHooks('addListingForm_af', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log('Just submitted form, from addform.js');
        //close modal on submit
        $('#modalAdd').closeModal();

		    this.done(); // submitted successfully, call onSuccess
		    return false
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!");
  	$('#modalAdd').closeModal();
  },
});