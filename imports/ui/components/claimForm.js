
import './claimForm.html';

Template.claimForm.events({

});

Template.claimForm.onRendered(function () {
  $(document).ready(function () {
      $('#modalClaim').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '10%', // Starting top style attribute
        endingTop: '24%', // Ending top style attribute
      });
  });
      
});

AutoForm.addHooks('claimForm', {
    // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        console.log('Just submitted form, from claimForm.js');
        //close modal on submit
        $('#modalClaim').modal('close');

        this.done(); // submitted successfully, call onSuccess
        return false;
    },

  // Called when any submit (type=insert or update) operation succeeds
  onSuccess: function(formType, result) {
    console.log("Thanks for Submitting!", result);
    $('#modalClaim').modal('close');
  },
});