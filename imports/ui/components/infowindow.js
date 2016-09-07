import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infowindow.html';
import './infowindow.css';

Template.infowindow.onRendered( function() {
	Session.set('infoWindowOpen', true);
});

Template.infowindow.events({ 

});

Template.infowindow.onDestroyed( function() {
	Session.set('infoWindowOpen', false);
});