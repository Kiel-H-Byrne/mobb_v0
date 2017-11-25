import Categories from '/imports/startup/collections/categories';
import './orionEditForm.html';


Template.orionEditForm.onRendered(function() {
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
            $(".address_group label").css('hide');
          }
        }
      };
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      geocomplete.addListener('place_changed', function() {
        fillInAddress();
        const place = this.getPlace();
        console.log(place);
        // const el_placeID = $('input[name="google_id"]')[0];
        // if (!el_placeID.value) {
        //   el_placeID.value = place.place_id;
        //   Materialize.updateTextFields();
        // }
      });
      
    }
  });

  $(document).ready(function () {
      $('[id="loading-wrapper"], .server_rendered').fadeOut();
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

Template.orionEditForm.helpers({
  formOptions: function () {
    return Categories.find().map(function(c) {
      // console.log(c.name);
      return {label: c.name, value: c.name};
    });
  }, 
  thisDoc: function() {
    const id =  Router.current().params._id;
    const doc = Listings.findOne({_id: id});
    return doc
  }
});

