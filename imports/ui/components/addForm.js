import { Template } from 'meteor/templating';

import './addForm.html';



// Template.addForm.onRendered(function() {
// //show the input form for optional fields, only if the associated checkbox is checked
// 	$('#supplied').click(function() {
// 	  $('.date')[this.checked ? "show" : "hide"]();
// 	});
// });

Template.addForm_af.onRendered(function() {
    $('.collapsible').collapsible();

    // let state = Session.get('clientState');
    // $("li:contains("+ state +")").addClass("active selected");
  
});

Template.addForm_af.helpers({
  getState : function() {
    let state = Session.get('clientState');
    return state;
  },
});

AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log('Just submitted form, from addform.js');
        //close modal on submit
        $('#modalAdd').closeModal();

		    this.done(); // submitted successfully, call onSuccess
		    return false;
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!", result);
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
		    return false;
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!");
  	$('#modalAdd').closeModal();
  },
});