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


AutoForm.addHooks('addListingForm_af', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault(); //prevents page reload
        console.log('Just submitted form, from addform.js');
        //close modal on submit
        Listings.insert(insertDoc);
		    this.done(); // must be called; submitted successfully, call onSuccess, 
		    // return false; //prevents page reload
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!");
    //draw marker?
    //change content(inner html) of addForm template.
    $('#modalAdd').html(
      '<h3> Thank You! </h3>'
      ).delay(800).closeModal();
  },
});