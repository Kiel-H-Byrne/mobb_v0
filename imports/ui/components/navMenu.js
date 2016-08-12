import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';
import './map.js';

Template.navMenu.events({
	//when form is submitted, set new center. 
	//should accept zipcode and full address.
	'submit form': function (event, tpl) {
		event.preventDefault();

		var entered = tpl.find('input#search_loc').value;
	
	  Meteor.call('geoCode', entered, function(err,res) {
			let userLoc = res.split(",");
			GoogleMaps.maps.map.instance.setCenter({"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) });
			// google.maps.event.trigger(GoogleMaps.maps.map, 'resize');
			GoogleMaps.maps.map.instance.setZoom(13);
			// console.log(res); 
			// Session.set('newLoc', res);
	  });

		

	  analytics.track("Searched for New Location.", {
	    zip: entered
	  });
	}
});

Template.navMenu.onRendered( function() {
	// $(document).ready(function(){
		$(".button-collapse").sideNav();
		$('.modal-trigger').leanModal({
			dismissible: true,
			complete: function() {
				$('.lean-overlay').remove();
			}
		});
	// })
});

// $('.modal-trigger').leanModal({
//     dismissible: true,
//     opacity: 0.5,
//     in_duration: 300,
//     out_duration: 200,
//     ready: function() {
//         if($(".lean-overlay").length > 1) {
//             $(".lean-overlay:not(:first)").each(function() {
//                 $(this).remove();
//             });
//         }
//     },
//     complete: function() {
//         $(".lean-overlay").each(function() {
//             $(this).remove();
//         });
//     }
// });