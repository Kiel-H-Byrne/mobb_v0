import './centerButton.html';

Template.centerButton.helpers( function () {

});

Template.centerButton.onRendered(function () {
  $(document).ready(function (){
    $('.tooltipped').tooltip();
  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
  'click #centerButton_button' : function(event,templateInstance){


      let map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      // let clientMarker;

      if (!Session.get('clientLoc')) {
        // console.log('using browser.');
        targetBrowser(map);
        $('.tooltipped').tooltip('remove');
      } else {
        let pos = Session.get('clientLoc');
        targetClient(map, pos);

        $('.tooltipped').tooltip('remove');
        //also check if clientmarker is drawn, if not, draw it and radius. 
        //after returning to browser, marker is not shown... so check if the object still exists
        // console.log(clientMarker);
        // IF I PLACE A MARKER EVERY TIME I PRESS THIS BUTTON, WHEN I MOVE, WILL IT REPLACE ITSELF? WILL THEYS TACK UP?
        placeMyMarker(map, pos);
      }

      // zoom once i have clientPosition then stop
      templateInstance.autorun(function (c) {
        let pos = Session.get('clientLoc');
        if (pos) {
          targetClient(map, pos);
          c.stop();
        }
      });

      templateInstance.autorun(function (c) {    
        //====== AUTO CALCULATE MY LOCATION AND DRAW NEW MARKER WHEN IT CHANGES ======
        //====== AUTO CALCULATE NEW CLOSEST BUSINESS WHEN MY LOCATION CHANGES ======
        // Materialize.toast('Locating...', 1100, 'myToast');
        //add class 'pulse' to button, then remove it once found

        if (Geolocation.error() || Geolocation.latLng === null || Geolocation.latLng === "null") {
          console.warn("Geopositioning Error:", Geolocation.error().message);
          $('[id="centerButton_button"]').removeClass('pulse');          
          return;
        
        } else {
          // console.log("searching ...");
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

      // if (Session.get("clientLoc")) {
      //   //I ALREADY HAVE YOUR LOCATION -- ZOOM BACK TO MY LOCATION
      //   targetClient(map,pos);

      //   return;
      // } else {
      //   //I DON'T HAVE YOUR LOCATION, BUT YOU'RE OK WITH ME GETTING IT. -needed when Maps is already loaded so new geolocation isnt found.
      //   // I'VE ASKED FOR YOUR LOCATION, BUT YOU DON'T WANT TO GIVE IT.
        
      //   const loc = Session.get('browserLoc');

      //   $(document).ready(function (){
      //     $('[id="centerButton_button"]').addClass('pulse');
      //   });
      //   targetClient(map,loc);
      //   //CALLBACK TO GET GEOLOCATION; WILL PROMPT GEO PERMISSION FROM PHONE.
      //   getLocation().then((pos) => {
      //     Session.set('clientLoc', pos);
      //     placeMyMarker(map,pos);
      //     targetClient(map,pos);
      //     // $(document).ready(function (){
      //       $('[id="centerButton_button"]').removeClass('pulse');
      //     // });
      //       return;
      //   });
      // } 
    }

});