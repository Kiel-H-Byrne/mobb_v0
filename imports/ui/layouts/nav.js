import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Categories from '/imports/startup/collections/categories.js';

import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/infoModal.js';
import '../components/categorySelect.js';
import '../components/directionsModal.js';
import '../components/geoModal.js';
import '../components/shareModal.js';
import '../components/betaModal.js';
import '../components/corner-ribbon.js';
import './nav.html';


Template.nav2.onRendered( function() {
// ====== MOBILE VIEW NAV MENU BUTTON, CLICKING SHOWS THE SIDE NAV. ====== 
	

    // $('.modal-trigger').leanModal({
    //     dismissible: true,
    //     opacity: 0.5,
    //     in_duration: 300,
    //     out_duration: 200,
    //     starting_top: '0', // Starting top style attribute
    //     ending_top: '3%', // Ending top style attribute
    //     ready: function() {
    //       // console.log("Modal Triggered, from loggedInNav.js");
    //         if($(".lean-overlay").length > 1) {
    //             $(".lean-overlay:not(:first)").each(function() {
    //                 $(this).remove();
    //                 console.log("removed a layer");
    //             });
    //         }
    //     },
    //     complete: function() {
    //       // console.log("Modal Complete, from loggedInNav.js");
    //         $(".lean-overlay").each(function() {
    //             $(this).remove();
    //         });
    //     }
    // });

		// $(".button-collapse").sideNav({
		// 	edge: 'left',
		// 	closeOnClick: true
		// });



});

Template.nav2.onRendered(function() {
	  
  // TypeAhead autocomplete in Schema
  Meteor.typeahead.inject();
  $('.twitter-typeahead').css("display:block");


  // Google GeoComplete 
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $("input#search_mo").geocomplete({
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
	
	// 'submit #desktop_search-form': function (event, tpl) {
	// 	event.preventDefault();
    
 //    let entered = tpl.find('input#search_nav').value;
   
 //    console.log(entered);


	// 	analytics.track("Searched:", {
 //  		clientSearch: entered
	// 	});
	// },
  'click input': function() {
    // $('.dropdown-button').dropdown('open');
    document.getElementById("search_form").reset();
  },
  'mouseup form': function() {
    // console.log("mouse fired.");
    // Materialize.updateTextFields();
  },
  'click .addmodal': function() {
    $('#modalAdd').openModal();
    // console.log("open!");
  }
});

Template.nav2.helpers({
  dataset: function() {
    return [
      {
        name: 'categories',
        valueKey: 'title',
        displayKey: 'title',
        local: function() { return Categories.find().fetch(); },
        header: '<h4 class="class-name">Categories</h4>',
        template: 'results'
      },
      {
        name: 'listings',
        valueKey: 'name',
        displayKey: 'name',
        local: function() { return Listings.find().fetch(); },
        header: '<h4 class="name">Listings</h4>',
        template: 'results'
      }
    ];
  }
});