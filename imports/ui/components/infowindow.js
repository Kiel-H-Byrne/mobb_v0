import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infowindow.html';
import './infowindow.css';

Template.infowindow.onCreated( function() {
	
	Session.set('infoWindowOpen', true);
});

Template.infowindow.events({ 

});
