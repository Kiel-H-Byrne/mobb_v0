import './claimForm.html';

Template.claimForm.onRendered(function () {
  $(document).ready(function () {
      
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