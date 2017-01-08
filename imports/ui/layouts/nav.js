import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Categories from '/imports/startup/collections/categories.js';

import '../components/navMenu.js';
import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/infoModal.js';
import '../components/categorySelect.js';
import '../components/directionsModal.js';
import '../components/shareModal.js';
import '../components/betaModal.js';
import '../components/corner-ribbon.js';
import './nav.html';



Template.nav.onRendered( function() {
// ====== MOBILE VIEW NAV MENU BUTTON, CLICKING SHOWS THE SIDE NAV. ====== 
	$(document).ready(function(){

		$(".button-collapse").sideNav({
			edge: 'left',
			closeOnClick: true
		});

	});
});

Template.nav2.onRendered(function() {
	
  $('.twitter-typeahead').css("display:block");
	
  // TypeAhead autocomplete in Schema
  // Meteor.typeahead.inject();
  // GeoComplete 
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $("input#search_loc").geocomplete({
      	map: GoogleMaps.maps.map.instance,
      	mapOptions: GoogleMaps.maps.map.options,
        markerOptions: {
          disabled: true
        }
      });
    }
  });

});

Template.nav2.events({
	//====== SEARCH FORM ON NAVBAR =======
	//when form is submitted, set new center. 
	
	'submit form': function (event, tpl) {
		event.preventDefault();
		let entered = tpl.find('input#search_loc').value;
		console.log("Search Fired! with " + entered);

		Meteor.call('geoCode', entered, function(err,res) {
			let userLoc = res.split(",");
			GoogleMaps.maps.map.instance.setCenter({"lat": Number(userLoc[0]), "lng": Number(userLoc[1]) });
			GoogleMaps.maps.map.instance.setZoom(13);
			// console.log(res); 
			// Session.set('newLoc', res);
		});
    document.getElementByClassName("search_form").reset();

		analytics.track("Searched for New Location.", {
  		clientSearch: entered
		});
	},
  'click input': function() {
    // $('.dropdown-button').dropdown('open');
    document.getElementById("search_form").reset();
  },
  'mouseup form': function() {
    console.log("mouse fired.");
    Materialize.updateTextFields();
  }
});

Template.nav2.helpers({
  // dataset: function() {
  //   return [
  //     {
  //       name: 'categories',
  //       valueKey: 'name',
  //       local: function() { return Categories.find().fetch(); },
  //       header: '<h4 class="class-name">Categories</h4>',
  //       template: 'results'
  //     },
  //     {
  //       name: 'listings',
  //       valueKey: 'name',
  //       local: function() { return Listings.find().fetch(); },
  //       header: '<h4 class="name">Listings</h4>',
  //       template: 'results'
  //     }
  //   ];
  // }
});