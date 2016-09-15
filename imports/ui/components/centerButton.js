import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';

Template.centerButton.helpers( function() {
    //if an infowindow is not open, do something
    //like recenter, but this got annoying, adding UI button instead
    if (!Session.get('infoWindowOpen')) {
        // map.instance.setCenter(clientMarker.getPosition());
        // map.instance.setZoom(15);
    } else {
        // console.log('InfoWindow OpeN, not shifting position!');
    }
	// map.instance.setZoom(MAP_ZOOM);
});

Template.centerButton.events({
	'click #centerButton_button' : function(evt,tpl){
	    //if an infowindow is not open, do something
	    //like recenter, but this got annoying, adding UI button instead
	    if (!Session.get('infoWindowOpen')) {
	        GoogleMaps.maps.map.instance.setCenter(clientMarker.getPosition());
	        GoogleMaps.maps.map.instance.setZoom(15);
	    } else {
	        console.log('InfoWindow OpeN, not shifting position!');
	        map.instance.setZoom(MAP_ZOOM);
	    }
	}
});