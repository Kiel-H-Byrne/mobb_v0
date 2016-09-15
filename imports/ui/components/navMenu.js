import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';
import './map.js';

Template.navMenu.events({
	//====== SEARCH FORM ON NAVBAR =======
	//when form is submitted, set new center. 
	
	'submit form': function (event, tpl) {
		event.preventDefault();
		$('.button-collapse').sideNav('hide');

		var entered = tpl.find('input#search_loc').value;
	
		Meteor.call('geoCode', entered, function(err,res) {
			let userLoc = res.split(",");
			GoogleMaps.maps.map.instance.setCenter({"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) });
			GoogleMaps.maps.map.instance.setZoom(13);
			// console.log(res); 
			// Session.set('newLoc', res);
		});

		analytics.track("Searched for New Location.", {
		clientSearch: entered
		});
	}, 
	'click .modal-trigger': function() {
		$('.button-collapse').sideNav('hide');
	}
});
