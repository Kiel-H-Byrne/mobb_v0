import { Template } from 'meteor/templating';
import Listings from '/imports/startup/collections/listings';
import Categories from '/imports/startup/collections/categories';

import './addForm.html';


// Template.addForm.onRendered(function () {
// //show the input form for optional fields, only if the associated checkbox is checked
// 	$('#supplied').click(function () {
// 	  $('.date')[this.checked ? "show" : "hide"]();
// 	});
// });

Template.addForm.onCreated(function () {
  this.subscribe('categories');
});

Template.addForm.onRendered(() => {
  $(document).ready(() => {

    $('#modalAdd').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.6, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('.collapsible').collapsible();        
      },
    });

    $('.collapsible').collapsible();

    $('input[name="phone"]').characterCounter();

    // $('input[name="phone"]').keydown(function(){
    //  let self = $(this);
    //  let removedText = self.val().replace(/\D/, '');
    //  self.val(removedText);
    // });
    
    // let state = Session.get('clientState');
    // $("li:contains("+ state +")").addClass("active selected");
  });
});

Template.addForm.helpers({
  getState() {
    let state = Session.get('clientState');
    return state;
  },
  formOptions() {
    // return Categories.find().map(c => ({ label: c.name, value: c.name }));
    return Categories.find().map(function(c) {
      // console.log(c.name);
      return {label: c.name, value: c.name};
    });
  },
});


AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
  onSubmit(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault(); // prevents page reload
    // console.log('Just submitted form, from addform.js');
        // close modal on submit
        // $('#modalAdd').modal('close');
      Meteor.call('addListing', insertDoc);
	    this.done(); // must be called; submitted successfully, call onSuccess,
	    return false; // prevents page reload
  },

  // Called when any submit operation succeeds
  onSuccess(formType, result) {
    $('#modalAdd').modal('close');
    Materialize.toast('Thanks for Submitting!', 3300, 'myToast');
  	// console.log("Thanks for Submitting!");
    // console.log(result);
    // draw marker?
    // change content(inner html) of addForm template.
    // $('#modalAdd').html(
    //   ` <div id="submitMsg" class="modal-content">
    //    <h3 class="centered"> Thank You! </h3>
    //    {{{> closeButton}}}
    //    </div>
    //   );
  },
});
