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
          componentRestrictions: {country:'US'}
        }
      );

      completeName = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        document.getElementById('name'),{
          types: ['establishment'],
          componentRestrictions: {country:'US'}
        }
      );

      const fillInAddress = function(autocomplete) {
        let place = autocomplete.getPlace();
        console.log(place);
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
        const type = place.types[0];
        if (type != 'street_address' || type != 'premise' || type != 'route') {
          console.log(type);
          document.getElementById('name').value = place.name;
        }
        if (place.formatted_phone_number) document.getElementById('formatted_phone_number').value = place.formatted_phone_number;
        if (place.website) {
          document.getElementById('website').value = place.website;
        } else {
          //wipe away "http://" prefill
          document.getElementById('website').value = '';
        }

        if (place.place_id) document.getElementById('place_id').value = place.place_id;
        //if type = restaurant, add category 'food & beverage'; etc...
        //   let types = place.types;
        //   console.log(types);
        //   if (types.includes('bakery' || 'food' || 'restaurant' || 'bar' || 'cafe' || 'grocery_or_supermarket'|| 'meal_delivery'|| 'meal_takeaway'   )) {
        //     $('[value="Food & Beverage"]').prop('checked',true);
        //   };
        //   if (types.includes('accounting' || 'bank' || 'dentist' || 'doctor' || 'electrician' || 'funeral_home' || 'insurance_agency' || 'lawyer' || 'painter' || 'pharmacy' || 'physiotherapist' || 'plumber' || 'real_estate_agency' || 'veterinary_care')) {
        //     $('[value="Professional Services"]').prop('checked',true);
        //     console.log('hello dere');
        //   };
        //   if (types.includes('amusement_park' || 'art_gallery' || 'book_store' || 'casino' ||'bowling_alley' || 'zoo' || 'stadium' || 'park' || 'nigh_club' || 'museum' || 'movie_theater'|| 'aquarium')) {
        //     $('[value="Entertainment & Media"]').prop('checked',true);
        //   };
        //   if (types.includes('beauty_salon' || 'hair_care' || 'spa' )) {
        //     $('[value="Beauty & Lifestyle"]').prop('checked',true);
        //   };  
        //   if (types.includes('clothing_store' || 'shopping_mall' || 'shoe_store' || 'jewelry_store')) {
        //     $('[value="Apparel & Accessories"]').prop('checked',true);
        //   };         
        //   if (types.includes('art_gallery' || 'book_store' || 'museum' || 'school' || 'university' )) {
        //     $('[value="Education & Child Care"]').prop('checked',true);
        //   };   
        //   if (types.includes('hospital' || 'spa' || 'physiotherapist' || 'doctor' || 'gym' || 'veterinary_care'|| 'pharmacy' || 'health')) {
        //     $('[value="Health & Wellness"]').prop('checked',true);
        //   };   
        // const compareObj = [{
        //   'terms': ['hospital' , 'spa' , 'physiotherapist' , 'doctor' , 'gym' , 'veterinary_care', 'pharmacy' , 'health'],
        //   'value': 'Health & Wellness'
        // }, {
        //   "value": "Apparel & Accessories",
        //   "terms": ['clothing_store' , 'shopping_mall' , 'shoe_store' , 'jewelry_store']
        // }]


      };

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.

      completeName.addListener('place_changed', function() {
        fillInAddress(this);
        Materialize.updateTextFields();
        // $(".address_group label").css('hide');
      });

      completeAddress.addListener('place_changed', function() {
        fillInAddress(this);
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
      startingTop: '0', // Starting top style attribute
      endingTop: '5%', // Ending top style attribute
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
    let self = this;
    analytics.track( "Listing Added", {
      category: 'Listings',
      label: self.insertDoc._id,
      value: self.insertDoc.name
    });
    Materialize.toast('Thanks for Submitting!', 3300, 'myToast');

  },
});
