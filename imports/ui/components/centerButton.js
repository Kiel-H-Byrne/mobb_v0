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
    $("[id='card_closest']").toggleClass('bounceIn bounceOut');

  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
  'click #centerButton_button' : function(event,templateInstance){

      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      let oldMarker = {};
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
        //DISPLAY 'LOCATING' TOAST WHILE I DON'T HAVE THE LOCATION
        if (!Session.get('clientLoc')) {
          Materialize.toast('Locating...', 3330, 'myToast');
        } else {
          // const toastElement = $('.myToast')[0];
          // if (toastElement) {
            // toastElement.M_Toast.remove();
            // toastElement.toggleClass('fadeOutDown');
          // }
            
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
          // PLACE MY_MARKER ON MAP & 
          // DETERMINE CLOSEST BUSINESS & STORE ID AS SESSION VAR
          // MAKE THE CLOSEST MARKER A DIFFERENT COLOR OR ANIMATE?

          // console.log("searching ...");

          getLocation().then((pos) => {
            // START ANIMATION
            $('[id="centerButton_button"]').toggleClass('pulse');
            if (pos) {
              Session.set('clientLoc', pos);
              // END ANIMATION
              $('[id="centerButton_button"]').toggleClass('pulse');
              // ISOLATE CLIENT
              placeMyMarker(map,pos);
              // ISOLATE CLOSEST BUSINESS
              let closestMarker = find_closest_marker(MAP_MARKERS, pos);
              // CHECK IF NEW CLOSEST BUSINESS, DO SOMETHING ELSE
              if (oldMarker == closestMarker) {
                // NOT A NEW CLOSEST, DO NOTHING.
              } else if (!_.isEmpty(oldMarker)){
                // NEW CLOSEST, CHANGE OLD MARKER BACK TO REGULAR ICON
                oldMarker.setIcon({
                  url: "img/orange_marker_sm.png"  
                });
              }
              closestMarker.setIcon({
                url: "img/red_marker_sm.png"
              });
              oldMarker = closestMarker;
              return;
            }
            return;
          });
        }
      });

      $("[id='card_closest']").toggleClass('bounceIn bounceOut'); 
    }

});