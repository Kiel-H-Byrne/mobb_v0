import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';
import './map.js';
import './shareDropdown.js';

Template.navMenu.events({
	//====== SEARCH FORM ON NAVBAR =======
	//when form is submitted, set new center. 
	
	'submit form': function (event, tpl) {
		event.preventDefault();
		$('.button-collapse').sideNav('hide');

		let entered = tpl.find('.form-control').value;
		console.log(entered);
		// Meteor.call('geoCode', entered, function(err,res) {
		// 	let userLoc = res.split(",");
		// 	GoogleMaps.maps.map.instance.setCenter({"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) });
		// 	GoogleMaps.maps.map.instance.setZoom(13);
		// 	// console.log(res); 
		// 	// Session.set('newLoc', res);
		// });

		analytics.track("Searched from Nav.", {
		clientSearch: entered
		});
	}
});

