import { Template } from 'meteor/templating';

import './editForm.html';

Template.editForm.onCreated(function() {

});

Template.editForm.onRendered(function() {
  $(document).ready(function() {
    $('.collapsible').collapsible();

    // let state = Session.get('clientState');
    // $("li:contains("+ state +")").addClass("active selected");
  });
});

Template.editForm.helpers({
  formOptions: function() {
    return Categories.find().map(function(c) {
      // console.log(c.name);
      return {label: c.name, value: c.name};
    });
  }
});


AutoForm.addHooks('editListingForm', {
    // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault(); //prevents page reload
        console.log('Just submitted form, from editForm.js');
        //close modal on submit
        // $('#modalAdd').closeModal();
        Listings.insert(insertDoc);
        this.done(); // must be called; submitted successfully, call onSuccess, 
        return false; //prevents page reload
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    console.log("Thanks for Submitting!");
    //draw marker?
    //change content(inner html) of editForm template.
    $('#modalEdit').html(
      ' <div id="submitMsg" class="modal-content"> ' +
      ' <h3 class="centered"> Thank You! </h3> ' +
      ' </div> '
      );
    $('#modalEdit').delay(1100).closeModal();
  },
});