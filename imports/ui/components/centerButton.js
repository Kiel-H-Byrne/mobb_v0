import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './centerButton.html';

Template.centerButton.helpers( function () {

});

Template.centerButton.onRendered(function () {
  $(document).ready(function (){
    $('.tooltipped').tooltip({delay: 50});
  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
  'click #centerButton_button' : function(evt,tpl){

      let map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      let clientMarker;
      console.log(clientMarker);

      tpl.autorun(function () {    
        //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
        //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
        // Materialize.toast('Locating...', 1100, 'myToast');
        //add class 'pulse' to button, then remove it once found

        console.log("searching ...");
        if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
          console.warn("Geopositioning Error:", Geolocation.error().message);
          $('[id="centerButton_button"]').removeClass('pulse');          
          return;
        
        } else {
          getLocation().then((pos) => {
            $('[id="centerButton_button"]').addClass('pulse');

            if (pos) {
              Session.set('clientLoc', pos);

              $('[id="centerButton_button"]').removeClass('pulse');
 
              placeMyMarker(map,pos);

              return;
            }
          });
        }
      });
      if (Session.get('clientLoc');) {
        let pos = Session.get('clientLoc');
        targetListing(map,pos);
      } else {
        targetBrowser(map);
      }

      
      console.log(map,pos);
      // if (Session.get("clientLoc")) {
      //   //I ALREADY HAVE YOUR LOCATION -- ZOOM BACK TO MY LOCATION
      //   targetListing(map,pos);

      //   return;
      // } else {
      //   //I DON'T HAVE YOUR LOCATION, BUT YOU'RE OK WITH ME GETTING IT. -needed when Maps is already loaded so new geolocation isnt found.
      //   // I'VE ASKED FOR YOUR LOCATION, BUT YOU DON'T WANT TO GIVE IT.
        
      //   const loc = Session.get('browserLoc');

      //   $(document).ready(function (){
      //     $('[id="centerButton_button"]').addClass('pulse');
      //   });
      //   targetListing(map,loc);
      //   //CALLBACK TO GET GEOLOCATION; WILL PROMPT GEO PERMISSION FROM PHONE.
      //   getLocation().then((pos) => {
      //     Session.set('clientLoc', pos);
      //     placeMyMarker(map,pos);
      //     targetListing(map,pos);
      //     // $(document).ready(function (){
      //       $('[id="centerButton_button"]').removeClass('pulse');
      //     // });
      //       return;
      //   });
      // } 
    }



});