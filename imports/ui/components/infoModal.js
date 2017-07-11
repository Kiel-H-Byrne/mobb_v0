import Listings from '/imports/startup/collections/listings';

import './infoModal.html';
import './verifyForm.js';
import './closeButton.js';

Template.infoModal.onRendered(function () {
  $(document).ready(function () {
    $('#modalInfo').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '4%', // Ending top style attribute
    });    
  });
});

Template.infoModal.events({
	'click #verify_button': function(evt,tpl) {
		// console.log("Clicked Verify button!");
		//open modal verify form.
		$('#modalVerify').modal('open');
	},
  'click #edit_button': function(evt,tpl) {
    //open modal verify form.
    $('#modalEdit').modal('open');
    $('.collapsible').collapsible();
    }
}); 