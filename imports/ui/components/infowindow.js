import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infowindow.html';

Template.infowindow.onCreated( function() {
	//console.log("--infowindow.js--");
});

Template.infowindow.events({ 
  'click' : function() {
    //var label = Session.get('currentOffice');
    console.log("InfoWindow: Clicked!");
  }
});

Template.infowindow.helpers({
	'label' : function() {
		return "Label!"	;
	},
});