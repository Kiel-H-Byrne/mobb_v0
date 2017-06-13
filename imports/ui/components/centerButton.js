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

        // Tracker.autorun( function(c) {
        //   let getPerm = Session.get("geoAccepted");

        //   if (getPerm === true) {
        //       Tracker.autorun(function () {    
        //         //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
        //         //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
        //         // Materialize.toast('Locating...', 1100, 'myToast');
        //         //add class 'pulse' to button, then remove it once found
        //         $(document).ready(function (){
        //           $('[id="centerButton_button"]').addClass('pulse');
        //         });

        //         console.log("searching ...");
        //         if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
        //           console.warn("Geo Error:", Geolocation.error().message);
        //             Materialize.toast('Geolocation Error.', 1000, 'myBadToast');                  
        //           return;
        //         } else {
        //           getLocation().then((pos) => {
        //             if (pos) {
        //               Session.set('clientLoc', pos);

        //               if (!clientMarker) {
        //                 clientMarker = new google.maps.Marker({
        //                     position: new google.maps.LatLng(pos.lat, pos.lng),
        //                     map: map.instance,
        //                     icon: {url: 'img/orange_dot_sm_2.png'},
        //                     title: "My Location",
        //                     // animation: google.maps.Animation.BOUNCE,
        //                 });
                        
        //                 clientRadius = new google.maps.Circle({
        //                   map: map.instance,
        //                   center: pos,
        //                   radius: (3 * 1609.34),
        //                   strokeColor: '#FF7733',
        //                   strokeOpacity: 0.5,
        //                   strokeWeight: 2,
        //                   fillColor: '#FFAA00',
        //                   fillOpacity: 0.15,
        //                 });

        //                 // map.instance.setCenter(pos);
        //                 // map.instance.setZoom(12); 
        //                 targetListing(map,pos);

        //               } else {
        //                 clientMarker.setPosition(pos);
        //                 clientRadius.setCenter(pos);
        //               }
        //               return;
        //             }
        //           });
        //         }
        //       });
        //       c.stop();
        //     } else {
        //     console.warn('Get Geolocation: Not Accepted, Yet.');
        //   }
        // });


      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];

      if (Session.get("clientLoc")) {
        //I ALREADY HAVE YOUR LOCATION


        const loc = Session.get("clientLoc");

        placeMyMarker(map,loc);
        targetListing(map,loc);
        return;
      } else {
        //I DON'T HAVE YOUR LOCATION, BUT YOU'RE OK WITH ME GETTING IT. -needed when Maps is already loaded so new geolocation isnt found.
        // I'VE ASKED FOR YOUR LOCATION, BUT YOU DON'T WANT TO GIVE IT.
        Session.set('geoAccepted', true);
        const loc = Session.get('browserLoc');

        $(document).ready(function (){
          $('[id="centerButton_button"]').addClass('pulse');
        });
        targetListing(map,loc);

        getLocation().then((pos) => {
          Session.set('clientLoc', pos);
          placeMyMarker(map,pos);
          targetListing(map,pos);
          // $(document).ready(function (){
            $('[id="centerButton_button"]').removeClass('pulse');
          // });
            return;
        });
      } 
    }
});