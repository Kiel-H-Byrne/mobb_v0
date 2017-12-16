
import './test.html';
import './favoritesPage.js';
//place a search on specific name and location, on insert. 
// Template.test.onCreated( function () {  
//     this.subscribe('listings_locs');
// });
const VTM = require('vanilla-text-mask/dist/vanillaTextMask.js');


Template.test.onRendered(function () {
    $(document).ready(function () {
      GoogleMaps.ready('map', function(map) {
        const placeService = new google.maps.places.PlacesService;
        console.log(placeService);
      // let search = placeService.nearbySearch({

      // }, function() {

      // });

      });

    });
});


Template.test.helpers({
  
});
