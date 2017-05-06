import { Template } from 'meteor/templating';
import Categories from '/imports/startup/collections/categories';

import './editForm.html';

Template.editForm.onCreated(function () {

});

Template.editForm.onRendered(function () {
  $(document).ready(function () {
    $('#modalEdit').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
    });

    $('.collapsible').collapsible();
    // let state = Session.get('clientState');
    // $("li:contains("+ state +")").addClass("active selected");
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
    Materialize.toast('Thanks for Submitting!', 3300, 'myToast');
    console.log(this.currentDoc, this.updateDoc);
    //if updating categories, increment the count.
    if (this.updateDoc.$set.categories || this.currentDoc.categories) {
      let diff = _.difference(this.updateDoc.$set.categories, this.currentDoc.categories);
      let diff2 = _.difference(this.currentDoc.categories, this.updateDoc.$set.categories);
      // console.log(`added [${diff}] and removed [${diff2}]`);

      _.each(diff, function(v) {
        console.log(v);
        let id = Categories.findOne({name: v})._id;
        console.log(id);
        Categories.update(
          { _id: id },
          { $inc: { count: 1 } }
        );
      });

      _.each(diff2, function(v) {
        console.log(v);
        let id = Categories.findOne({name: v})._id;
        Categories.update(
          { _id: id },
          { $inc: { count: -1 } }
        );
      });

    }
    //close modal
    $('#modalEdit').modal('close');
    $('#modalInfo').modal('close');
    if (this.currentDoc.location) {
    //center and zoom on new location? marker?
      const latLng = this.currentDoc.location.split(",");
      // let lat = Number(latLng[0]);
      // let lng = Number(latLng[1]);
      const latLngObj = _.object( ['lat', 'lng'], [Number(latLng[0]), Number(latLng[1])]);
      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      targetListing(map,latLngObj);
    }
  },
});