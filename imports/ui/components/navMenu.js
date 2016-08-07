import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';

Template.navMenu.events({
	//when form is submitted, set new center. 
	//should accept zipcode and full address.
	'submit form': function (event, tpl) {
		event.preventDefault();

		var entered = tpl.find('input#search_loc').value;
	
	  Meteor.call('geoCode', entered, function(err,res) {
			let userLoc = res.split(",");
			GoogleMaps.maps.map.instance.setZoom(15);
			GoogleMaps.maps.map.instance.setCenter({"lat": parseInt(userLoc[0]), "lng": parseInt(userLoc[1]) });
	  });
		
	  analytics.track("Searched for New Location.", {
	    zip: entered
	  });
	}
});