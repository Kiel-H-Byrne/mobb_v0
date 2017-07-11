
import Categories from '/imports/startup/collections/categories.js';

import '../components/loadingScreen.html';
// import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/editForm.js';
import '../components/infoModal.js';
import '../components/categorySelect.js';
import '../components/geoModal.js';
import '../components/betaModal.js';
import '../components/corner-ribbon.js';
import '../components/favoriteStar.js';
import '../components/shareListing.js';
import '../components/mobileNav.js';

import './nav.html';



Template.nav2.onRendered( function () {
  $(document).ready(function () {
    $('.dropdown-button').dropdown({
      stopPropagation: true
      // inDuration: 200,
      // outDuration: 225,
      // constrain_width: false, // Does not change width of dropdown to that of the activator
      // hover: false, // Activate on hover
      // gutter: 3, // Spacing from edge
      // belowOrigin: true, // Displays dropdown below the button
      // alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    $('.tooltipped').tooltip({delay: 50});

    $('.addModal-trigger').modal({
        dismissible: true,
        opacity: 0.5,
        in_duration: 300,
        out_duration: 200,
        // starting_top: '0', // Starting top style attribute
        // ending_top: '0', // Ending top style attribute
        // ready: function () {
          // console.log("Modal Triggered, from loggedInNav.js");
            // if($(".lean-overlay").length > 1) {
            //     $(".lean-overlay:not(:first)").each(function () {
            //         $(this).remove();
            //         console.log("removed a layer");
            //     });
            // }
        // },
        // complete: function () {
        //   // console.log("Modal Complete, from loggedInNav.js");
        //     $(".lean-overlay").each(function () {
        //         $(this).remove();
        //     });
        // }
    });

  });
 // TypeAhead autocomplete in Schema
  Meteor.typeahead.inject();
  $('.twitter-typeahead').css("display:block");


  // Google GeoComplete 
  // console.log(this);
  
  this.autorun(function (c) {

    if (GoogleMaps.loaded() && GoogleMaps.maps.map) {

      $("input#search_mo").geocomplete({
        map: GoogleMaps.maps.map.instance,
        mapOptions: GoogleMaps.maps.map.options,
        country: 'US',
        type: ['(regions)'],
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
    
    const entered = tpl.find('input#search_nav').value;
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
  'click input': function () {
    // $('.dropdown-button').dropdown('open');
    document.getElementById("mobile_search-form").reset();
  },
  'mouseup form, touchend form': function () {
    // Materialize.updateTextFields();
  },
  'click .signout_btn': function () {
    AccountsTemplates.logout();
  },
  'mouseup .tt-suggestion>ul>li': function(evt,tpl) {
    let name = evt.target.innerText;
    let type = evt.target.parentElement.parentElement.parentElement.firstChild.innerText
    Router.go('/' + type + '/' + name);
  }
  // 'click .addmodal': function () {
  //   $('#modalAdd').modal('open');
  //   // console.log("open!");
  // }
  // 'click .tt-suggestion': function(evt, tpl) {
  //   // console.log(evt, tpl);
  // }
});

Template.nav2.helpers({
  dataset: function () {
    return [
      {
        name: 'categories',
        valueKey: 'name',
        displayKey: 'name',
        local: function () { return Categories.find().fetch(); },
        header: '<h4 class="tt-header">Categories</h4>',
        template: 'results'
      },
      {
        name: 'listings',
        valueKey: 'name',
        displayKey: 'name',
        local: function () { return Listings.find().fetch(); },
        header: '<h4 class="tt-header">Listings</h4>',
        template: 'results'
      }
    ];
  }
});