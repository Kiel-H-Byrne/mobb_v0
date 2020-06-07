import Listings from '/imports/startup/collections/listings';
import Categories from '/imports/startup/collections/categories';

import './addForm.html';


Template.addForm.onCreated(function () {
  Meteor.subscribe('categories');
});

Template.addForm.onRendered(function() {

  // Google GeoComplete 
  this.autorun(function (c) {
    if (GoogleMaps.loaded()) {
      let componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        sublocality_level_1: 'short_name',        
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name',
      };

      completeAddress = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        document.getElementById('formatted_address'),{
          types: ['address'],
          componentRestrictions: { country:['US', 'CA', 'TT'] }
          /**
           * {country: string | string[]}
           * componentRestrictions can be used to restrict results to specific groups. 
           * Currently, you can use componentRestrictions to filter by up to 5 countries. 
           * Countries must be passed as as a two-character, ISO 3166-1 Alpha-2 compatible country code. 
           * Multiple countries must be passed as a list of country codes.
          **/
        }
      );

      completeName = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        document.getElementById('name'),{
          types: ['establishment'],
          componentRestrictions: { country: ['US', 'CA', 'TT'] }
        }
      );

      const fillInAddress = function(autocomplete) {
        const place = autocomplete.getPlace();
        // console.log(place);
        const placeLoc = {'lat': place.geometry.location.lat(), 'lng': place.geometry.location.lng()}
        Session.set('placeLoc', placeLoc);
        // console.log(placeLoc); 
        for (let component in componentForm) {
          // CLEAR ALL VALUES AND SET 'DISABLED' FIELDS TO FALSE SO WE CAN POPULATE THEM
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
            let val = place.address_components[i][componentForm[addressType]];
            if (addressType == 'street_number') {
              // document.getElementById('route').value = val;
              num = val;
            } else if (addressType == 'route') {
              // document.getElementById('route').value = `${document.getElementById('route').value}  ${val}`;
              if (num) {
                document.getElementById('route').value = `${num}  ${val}`;
              } else {
                document.getElementById(addressType).value = val;
              }
            } else if (addressType == 'sublocality_level_1') {
                document.getElementById('locality').value = val;
            } else {
              document.getElementById(addressType).value = val;
            }
            //
          }
        }
        // SET OTHER INPUT VALUES AUTOMATICALLY
        if (place.formatted_address) document.getElementById('formatted_address').value = place.formatted_address;
        const types = place.types;
        const preview_button = document.getElementById('button_website-preview');
        console.log(types);

        if (types.includes('route') || types.includes('street_address') || types.includes('premise')) {
          console.log("don't fill")
        } else {
          document.getElementById('name').value = place.name;
        }

        if (place.formatted_phone_number) document.getElementById('formatted_phone_number').value = place.formatted_phone_number;
        
        if (place.website) {
          document.getElementById('website').value = place.website;
          preview_button.href = place.website;
          preview_button.classList.remove("hide");
          preview_button.classList.add("rubberBand");
        } else {
          //wipe away "http://" prefill
          document.getElementById('website').value = '';
          if (preview_button) {
            preview_button.classList.add("hide");
            preview_button.classList.remove("rubberBand");
          }
        }

        if (place.place_id) document.getElementById('place_id').value = place.place_id;

         //PREFILL FORM WHEN THE TYPE IS restaurant, add category 'food & beverage'; etc...

          if (types.includes('bakery') || 
              types.includes('food') || 
              types.includes('restaurant')  || 
              types.includes('bar')  || 
              types.includes('cafe')  || 
              types.includes('grocery_or_supermarket') || 
              types.includes('meal_delivery') || 
              types.includes('meal_takeaway') ) {
            $('[value="Food & Beverage"]').prop('checked',true);
          };
          if (types.includes('accounting') || 
              types.includes('bank')  || 
              types.includes('dentist')  || 
              types.includes('doctor')  || 
              types.includes('electrician')  || 
              types.includes('funeral_home')  || 
              types.includes('insurance_agency')  || 
              types.includes('lawyer')  || 
              types.includes('painter')  || 
              types.includes('pharmacy')  || 
              types.includes('physiotherapist')  || 
              types.includes('plumber')  || 
              types.includes('real_estate_agency')  || 
              types.includes('veterinary_care')) {
            $('[value="Professional Services"]').prop('checked',true);
          };
          if (types.includes('amusement_park') || 
              types.includes('art_gallery') || 
              types.includes('book_store') || 
              types.includes('casino') || 
              types.includes('bowling_alley') || 
              types.includes('zoo') || 
              types.includes('stadium') || 
              types.includes('park') || 
              types.includes('night_club') || 
              types.includes('museum') || 
              types.includes('movie_theater') || 
              types.includes('aquarium') ) {
            $('[value="Entertainment & Media"]').prop('checked',true);
          };
          if (types.includes('beauty_salon') || 
              types.includes('hair_care') || 
              types.includes('spa') ) {
            $('[value="Beauty & Lifestyle"]').prop('checked',true);
          };  
          if (types.includes('clothing_store') || 
              types.includes('shopping_mall') || 
              types.includes('shoe_store') || 
              types.includes('jewelry_store') ){
            $('[value="Apparel & Accessories"]').prop('checked',true);
          };         
          if (types.includes('art_gallery') || 
              types.includes('book_store') || 
              types.includes('museum') || 
              types.includes('school') || 
              types.includes('university') ) {
            $('[value="Education & Child Care"]').prop('checked',true);
          };   
          if (types.includes('hospital') || 
              types.includes('spa') || 
              types.includes('physiotherapist') || 
              types.includes('doctor') || 
              types.includes('gym') || 
              types.includes('veterinary_care') || 
              types.includes('pharmacy') || 
              types.includes('health') ) {
            $('[value="Health & Wellness"]').prop('checked',true);
          };   
      };

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.

      completeName.addListener('place_changed', function() {
        fillInAddress(this);
        Materialize.updateTextFields();
        // $(".address_group label").css('hide');
      });

      completeAddress.addListener('place_changed', function() {
        // fillInAddress(this); // this is obnoxious, if i enter a businesses and try to modify the address and pick the google one, it clears the other fields...
        Materialize.updateTextFields();
        // $(".input-field label").css('hide');
      });

    }
  });

  $(document).ready(() => {
    $('#modalAdd').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '15%', // Starting top style attribute
      endingTop: '2%', // Ending top style attribute
      ready: function(modal, trigger) {
        $('#name')[0].focus();
      }
    });
        
    // $('.collapsible').collapsible();

      //mask is array of strings and regex
    const VTM = require('vanilla-text-mask/dist/vanillaTextMask.js');

    let telMask = ['(', /[1-9]/, /\d/, /\d/, ')',' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    let telInput = document.querySelector('#formatted_phone_number');

    let telInputMask = VTM.maskInput({
      inputElement: telInput,
      mask: telMask
    });

  });

});

Template.addForm.helpers({
  // getState() {
  //   let state = Session.get('clientState');
  //   return state;
  // },
  formOptions() {
    return Categories.find().map(function(c) {
      // console.log(c.name);
      return {label: c.name, value: c.name};
    });
  },
});

Template.addForm.events({
  // 'focus #geocomplete': function() {

  //   if (Session.get('clientLoc')) {
  //     const circle = new google.maps.Circle({
  //         center: Session.get('clientLoc'),
  //         radius: (25 * 1609.34)
  //     });
  //     // console.log(circle);
  //     geocomplete.setBounds(circle.getBounds());
  //   }
  // }
});

AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
  onSubmit(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault(); // prevents page reload
    // console.log(insertDoc);
    // console.log('Just submitted form, from addform.js');
        // close modal on submit
        // $('#modalAdd').modal('close');
    //clear form
    document.getElementById('website').value = '';
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
  },
  
  onError(formType, error){
    console.log(error)
  },

  endSubmit: function() {
    Materialize.toast('Thanks for Submitting!', 3300, 'myToast');
    
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    // const doc = Listings.findOne({street: this.insertDoc.street});
    // console.log(this, doc);
    // const locArr = doc.location.split(",");
    // const locObj = { 'lat': Number(locArr[0]), 'lng': Number(locArr[1]) };
    const locObj = Session.get('placeLoc');
    console.log(locObj);
    map.instance.panTo(locObj);
    map.instance.setZoom(16);

    analytics.track( "Listing Added", {
      category: 'Listings',
      label: this.google_id,
      value: this.name
    });
  }
});
