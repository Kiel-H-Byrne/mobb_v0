import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './centerButton.html';
import './centerButton.css';

Template.centerButton.helpers( function() {

});

Template.centerButton.events({
	'click #centerButton_button' : function(evt,tpl){
	    //if an infowindow is not open, do something
	    //like recenter, but this got annoying, adding UI button instead
	    // if (!Session.get('infoWindowOpen')) {
	        GoogleMaps.maps.map.instance.setCenter(Session.get('clientLoc') || Session.get('browserLoc'));
	        GoogleMaps.maps.map.instance.setZoom(12);
	    // } else {
	    //     console.log('InfoWindow OpeN, not shifting position!');
	    //     GoogleMaps.maps.map.instance.setZoom(8);
	    // }
	}
});