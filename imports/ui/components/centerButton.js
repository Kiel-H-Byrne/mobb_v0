import './centerButton.html';

Template.centerButton.helpers( function () {

});

Template.centerButton.onRendered(function () {

  // zoom once i have clientPosition 
  // calculate closest listing
  // stop 
  this.autorun(function (c) {
    let pos = Session.get('clientLoc');
    if (pos) {
      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      if (map) {
        targetClient(map, pos);
        //find closest listing?
        //get array of all destinations
        c.stop();
      }
    }
  });

  $(document).ready(function (){
    $('.tooltipped').tooltip();
  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
  'click #centerButton_button' : function(event,templateInstance){

      let map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    
      // let clientMarker;
      const cl = Session.get('clientLoc');
      if (cl) {
        targetClient(map, cl);

        $('.tooltipped').tooltip('remove');
        //also check if clientmarker is drawn, if not, draw it and radius. 
        //after returning to browser, marker is not shown... so check if the object still exists
        // console.log(clientMarker);
        // IF I PLACE A MARKER EVERY TIME I PRESS THIS BUTTON, WHEN I MOVE, WILL IT REPLACE ITSELF? WILL THEYS TACK UP?
        placeMyMarker(map, cl);
      } else {
        // console.log('using browser.');
        targetBrowser(map);
        $('.tooltipped').tooltip('remove');
      }

      templateInstance.autorun(function(l) {
        if (!Session.get('clientLoc')) {
          Materialize.toast('Locating...', 1300, 'myToast');
        } else {
          l.stop();
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
          // c.stop();
        } else {
          // GET LOCATION AND THEN....
          // MAKE BUTTON PULSE UNTIL I HAVE IT... THEN
          // STORE POSITION IN SESSION VAR &
          // REMOVE PULSE CLASS &
          // PLACE MARKER ON MAP & 
          // DETERMINE CLOSEST BUSINESS & STORE ID AS SESSION VAR

          // console.log("searching ...");
          getLocation().then((pos) => {
            $('[id="centerButton_button"]').addClass('pulse');
            if (pos) {
              Session.set('clientLoc', pos);
              $('[id="centerButton_button"]').removeClass('pulse');
              find_closest_marker(MAP_MARKERS, pos);
              placeMyMarker(map,pos);
              $(document).ready(function() {
                $("[id='card_closest']").removeClass('bounceIn');
                $("[id='card_closest']").css('visibility', 'visible').toggleClass('bounceIn');
              });
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