import { Template } from 'meteor/templating';

import './editForm.html';

Template.editForm.onCreated(function() {

});

Template.editForm.onRendered(function() {
  $(document).ready(function() {

    $('#modalEdit').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '4%', // Ending top style attribute
    });

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
        console.log(updateDoc);
        // Listings.update(updateDoc);
        //if category is in there, increment the count by one. 
        //Categories.update(
        //   { name: ,
        //   { $inc: { : 1}}
        // })
        this.done(); // must be called; submitted successfully, call onSuccess, 
        return false; //prevents page reload
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    Materialize.toast('Thanks for Submitting!', 4000);
    console.log("Thanks for Submitting!", result);
    //close modal
      $('#modalEdit').modal('close');
      $('#modalInfo').modal('close');
    //center and zoom on new location? marker?
      const latLng = this.currentDoc.location.split(",");
      // let lat = Number(latLng[0]);
      // let lng = Number(latLng[1]);
      const latLngObj = _.object( ['lat', 'lng'], [Number(latLng[0]), Number(latLng[1])]);
      targetListing(latLngObj); 
  },
});