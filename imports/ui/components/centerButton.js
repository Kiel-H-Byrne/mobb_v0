import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

Template.centerButton.helpers( function() {

});

Template.centerButton.events({
	'click #centerButton_button' : function(evt,tpl){
	    //if an infowindow is not open, do something
	    //like recenter, but this got annoying, adding UI button instead
	    if (Session.get('geoAccepted') === true) {
        GoogleMaps.maps.map.instance.setCenter(Session.get('clientLoc'));
        GoogleMaps.maps.map.instance.setZoom(14);
        $('#modalGeo').closeModal();
        // if (!clientMarker) {
        // const self_icon = {
        //     // url: 'img/orange_marker_3_sm.png'
        //     url: 'img/orange_dot_sm_2.png'
        // };
        // let latLng = Session.get('clientLoc');
        //   clientMarker = new google.maps.Marker({
        //       position: new google.maps.LatLng(latLng.lat, latLng.lng),
        //       map: map.instance,
        //       icon: self_icon,
        //       title: "My Location",
        //       // animation: google.maps.Animation.BOUNCE,
        //   }); 

        
        // } else {
        //     clientMarker.setPosition(latLng);
        //     //Google Maps does not recenter or rezoom
        //     // map.instance.setCenter(clientMarker.getPosition());
        //     // map.instance.setZoom(MAP_ZOOM);

        // }
        // const resize = new google.maps.event.trigger(map.instance,'resize');

	    } else {
        $('#modalGeo').openModal();
	    }

	}
});