import Categories from '/imports/startup/collections/categories';

import './editForm.html';


Template.editForm.onRendered(function () {
  
  $(document).ready(() => {
    $('#modalEdit').modal({
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('.collapsible').collapsible();        
      },
    });

    $('.collapsible').collapsible();

    const VTM = require('vanilla-text-mask/dist/vanillaTextMask.js');
    const telMask = ['(', /[1-9]/, /\d/, /\d/, ')',' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    const telInput = document.querySelector('#phone_input_edit');
    if (telInput) {
      const telInputMask = VTM.maskInput({
        inputElement: telInput,
        mask: telMask
      });
    }
  });
});

Template.editForm.helpers({
  formOptions: function () {
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
        this.done(); // must be called; submitted successfully, call onSuccess, 
        return false; //prevents page reload
    },
  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    //close modal
    $('#modalEdit').modal('close');
    Materialize.toast('Thanks for Updating!', 3300, 'myToast');

    // console.log(this.updateDoc);
        let self = this;
    analytics.track( "Listing Modified", {
      category: "Listings",
      label: Meteor.userId(),
      value: self.docId.name
    });
    
    if (this.currentDoc.location) {
    //center and zoom on new location? marker?
      const latLng = this.currentDoc.location.split(",");
      // let lat = Number(latLng[0]);
      // let lng = Number(latLng[1]);
      const latLngObj = {'lat': Number(latLng[0]), 'lng': Number(latLng[1]) };
      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      targetClient(map,latLngObj);
    }


    //if updating categories, increment the count.
    if (this.updateDoc.$set.categories) {
      let diff = _.difference(this.updateDoc.$set.categories, this.currentDoc.categories);
      let diff2 = _.difference(this.currentDoc.categories, this.updateDoc.$set.categories);
      // console.log(`added [${diff}] and removed [${diff2}]`);

      _.each(diff, function(v) {
        // console.log(v);
        const id = Categories.findOne({name: v})._id;
        // console.log(id);
        Categories.update(
          { _id: id },
          { $inc: { count: 1 } }
        );
      });

      _.each(diff2, function(v) {
        console.log(v);
        const id = Categories.findOne({name: v})._id;
        Categories.update(
          { _id: id },
          { $inc: { count: -1 } }
        );
      });

    }
  },
});