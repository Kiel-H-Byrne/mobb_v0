
import './test.html';
import './favoritesPage.js';
//place a search on specific name and location, on insert. 
Template.test.onCreated( function () {  
    this.subscribe('listings_locs');
    $(document).ready(function () {
      

      $('.dpdwn').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: true // Stops event propagation
      });

      $('.dropdown-button').dropdown();      
    });

});

Template.test.onRendered(function () {
  
  this.autorun(function (c) {
    if ( GoogleMaps.loaded() ) {

      console.log('now loaded for autocomplete');
      let componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

      autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        document.getElementById('autocomplete_test'),
        {types: ['geocode']}
      );
      console.log(autocomplete);

      const fillInAddress = function() {
        let place = autocomplete.getPlace();

        for (let component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            let val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
      };
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', function() {
        fillInAddress();
      });
    }
  });

    // self.autorun(function () {
    //    let mmap  = Session.get('currentMap');
    // })

  
});


Template.test.helpers({
  randomDoc: function () {
    const doc =  Listings.findOne();
    return doc;
  },
  mapOptions: function () {
        let mapCenter = { lat: 39.0163, lng: -76.9799  };
        if (GoogleMaps.loaded() && mapCenter) {
            return {
                // ============================= RETURN MAP OPTIONS ==================================    
                center: mapCenter,
                // center: new google.maps.LatLng(Centers.User[0], Centers.User[1]),
                zoom: 9,
                // mapTypeId:google.maps.MapTypeId.TERRAIN,
                backgroundColor: "#444",
                clickableIcons: false,
                disableDefaultUI: true,
                // fullscreenControl: true,
                minZoom: 2,
                streetViewControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
            };
        }
    }
});
