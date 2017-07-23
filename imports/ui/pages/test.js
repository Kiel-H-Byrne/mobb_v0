
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
