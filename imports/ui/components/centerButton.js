import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './centerButton.html';

Template.centerButton.helpers( function() {

});

Template.centerButton.onRendered(function() {
  $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });

  //as soon as geoaccepted is true, ask for geolocation and set to session variable
 
});

Template.centerButton.events({
    'click #centerButton_button' : function(evt,tpl){
      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      if (Session.get("clientLoc")) {
        //I ALREADY HAVE YOUR LOCATION
        const loc = Session.get("clientLoc");
        placeMyMarker(map,loc);
        targetListing(map,loc);
        return;
      } else if ( !Session.get("clientLoc") && Session.equals("geoAccepted", true) ) {
        //I DON'T HAVE YOUR LOCATION, BUT YOU'RE OK WITH ME GETTING IT.
        
        // getLocation().then((pos) => {
        //   Session.set('clientLoc', pos);
        //   placeMyMarker(map,loc);
        //   targetListing(map,loc);
        //   return;
        // });
          placeMyMarker(map,loc);
          targetListing(map,loc);
      } else if (Session.equals("geoAccepted", false) && Session.equals("geoAsked", true)){ 
        // I'VE ASKED FOR YOUR LOCATION, BUT YOU DON'T WANT TO GIVE IT.
        const loc = Session.get('browserLoc');
        targetListing(map,loc);
        return;
      } else {
        //I HAVE NOTHING, ASK IF I CAN DO SOMETHING.
        $('#modalGeo').modal('open');
      }
    }
});