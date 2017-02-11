import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Categories from '/imports/startup/collections/categories.js';

import '../components/loadingScreen.html';
// import '../components/loggedInNav.js';
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
  $(document).ready(function() {
    $('.addModal-trigger').leanModal({
        dismissible: true,
        opacity: 0.5,
        in_duration: 300,
        out_duration: 200,
        starting_top: '0', // Starting top style attribute
        ending_top: '3%', // Ending top style attribute
        ready: function() {
          // console.log("Modal Triggered, from loggedInNav.js");
            if($(".lean-overlay").length > 1) {
                $(".lean-overlay:not(:first)").each(function() {
                    $(this).remove();
                    console.log("removed a layer");
                });
            }
        },
        complete: function() {
          // console.log("Modal Complete, from loggedInNav.js");
            $(".lean-overlay").each(function() {
                $(this).remove();
            });
        }
    });

  });
 // TypeAhead autocomplete in Schema
  Meteor.typeahead.inject();
  $('.twitter-typeahead').css("display:block");


  // Google GeoComplete 
  this.autorun(function () {

    if (GoogleMaps.loaded() && GoogleMaps.maps.map) {

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
	
	'submit #desktop_search-form': function (event, tpl) {
		event.preventDefault();
    
    let entered = tpl.find('input#search_nav').value;
    if (Listings.findOne({name: entered})) {
      // console.log(doc._id);
      Router.go("/listings/" + Listings.findOne({name: entered}).name);
    } else if (Categories.findOne({name: entered})) {
      Router.go("/categories/" + Categories.findOne({name: entered}).name);
    } else {
      console.warn("No Match");
    }

		analytics.track("Searched:", {
  		clientSearch: entered
		});
	},
  'click input': function() {
    // $('.dropdown-button').dropdown('open');
    document.getElementById("mobile_search-form").reset();
  },
  'mouseup form': function() {
    // console.log("mouse fired.");
    Materialize.updateTextFields();
  },
  // 'click .addmodal': function() {
  //   $('#modalAdd').openModal();
  //   // console.log("open!");
  // }
});

Template.nav2.helpers({
  dataset: function() {
    return [
      {
        name: 'categories',
        valueKey: 'name',
        displayKey: 'name',
        local: function() { return Categories.find().fetch(); },
        header: '<h4 class="tt-header">Categories</h4>',
        template: 'results'
      },
      {
        name: 'listings',
        valueKey: 'name',
        displayKey: 'name',
        local: function() { return Listings.find().fetch(); },
        header: '<h4 class="tt-header">Listings</h4>',
        template: 'results'
      }
    ];
  }
});