import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infowindow.html';
import './infowindow.css';

Template.infowindow.onCreated( function() {
	// Session.set('infoWindowOpen', true);
	// console.log("Window Rendered!");
});

Template.infowindow.events({ 

});

Template.infowindow.onDestroyed( function() {
	// Session.set('infoWindowOpen', false);
	// console.log("Window Destroyed!");
});