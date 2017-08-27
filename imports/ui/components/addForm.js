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

Template.addForm.onRendered(function() {

  // Google GeoComplete 
  this.autorun(function (c) {

    if (GoogleMaps.loaded()) {
      let componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name'
      };


      geocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        document.getElementById('geocomplete'),
        {types: ['address']},
        {components: {country:'us'}}
      );

      const fillInAddress = function() {
        let place = geocomplete.getPlace();
        for (let component in componentForm) {
          if (document.getElementById(component)){
            document.getElementById(component).value = '';
            document.getElementById(component).disabled = false;
          }
        }
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        let num;
        for (let i = 0; i < place.address_components.length; i++) {
        
          let addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
   
            if (addressType == 'street_number') {
              let val = place.address_components[i][componentForm[addressType]];
              // document.getElementById('route').value = val;
              num = val;
            } else if (addressType == 'route') {
              let val = place.address_components[i][componentForm[addressType]];
              // document.getElementById('route').value = `${document.getElementById('route').value}  ${val}`;
              if (num) {
                document.getElementById('route').value = `${num}  ${val}`;
              } else {
                document.getElementById(addressType).value = val;
              }
            } else {

            let val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
            }
            Materialize.updateTextFields();
          }
        }
      };
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      geocomplete.addListener('place_changed', function() {
        fillInAddress();
      });
    }
  });

  $(document).ready(() => {

    $('#modalAdd').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.6, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '10%' // Ending top style attribute
    });

    $('.collapsible').collapsible();

      //mask is array of strings and regex
    const VTM = require('vanilla-text-mask/dist/vanillaTextMask.js');

    let telMask = ['(', /[1-9]/, /\d/, /\d/, ')',' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    let telInput = document.querySelector('#phone_input_add');
    let telInputMask = VTM.maskInput({
      inputElement: telInput,
      mask: telMask
    });
      
    // let state = Session.get('clientState');
    // $("li:contains("+ state +")").addClass("active selected");
  
  });

});

Template.addForm.helpers({
  // getState() {
  //   let state = Session.get('clientState');
  //   return state;
  // },
  formOptions() {
    // return Categories.find().map(c => ({ label: c.name, value: c.name }));
    return Categories.find().map(function(c) {
      // console.log(c.name);
      return {label: c.name, value: c.name};
    });
  },
});

Template.addForm.events({
  'focus #geocomplete': function() {

    if (Session.get('clientLoc')) {
      const circle = new google.maps.Circle({
          center: Session.get('clientLoc'),
          radius: (25 * 1609.34)
      });
      // console.log(circle);
      geocomplete.setBounds(circle.getBounds());
    }
  }
});

AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
  onSubmit(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault(); // prevents page reload
    // console.log(insertDoc);
    // console.log('Just submitted form, from addform.js');
        // close modal on submit
        // $('#modalAdd').modal('close');
    Meteor.call('addListing', insertDoc, function(error, result) {
      if (insertDoc.url) {
        Meteor.call('getOG', insertDoc.url, result);
      }
    });

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
