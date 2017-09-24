
import Categories from '/imports/startup/collections/categories.js';

import '../components/loadingScreen.html';
// import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/editForm.js';
import '../components/infoModal.js';
import '../components/categorySelect.js';
import '../components/geoModal.js';
import '../components/corner-ribbon.js';
import '../components/favoriteStar.js';
import '../components/shareListing.js';
import '../components/mobileNav.js';
import '../components/sideCard.js';

import './nav.html';

Template.nav.onRendered( function () {
  $(document).ready(function () {
    $('[id="loading-wrapper"], .server_rendered').fadeOut();
    
    $('.dropdown-button').dropdown({
      stopPropagation: true
      // inDuration: 200,
      // outDuration: 225,
      // constrain_width: false, // Does not change width of dropdown to that of the activator
      // hover: false, // Activate on hover
      // gutter: 3, // Spacing from edge
      // belowOrigin: false, // Displays dropdown below the button
      // alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    $('#modalAdd').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '5%', // Starting top style attribute
      endingTop: '10%' // Ending top style attribute
    });

  });
 // TypeAhead autocomplete in Schema
  Meteor.typeahead.inject();
  $('.twitter-typeahead').css("display:block");

});

Template.nav.events({
	//====== SEARCH FORM ON NAVBAR =======
	//when form is submitted, set new center. 
	
	'submit #desktop_search-form': function (event, templateInstance) {
		event.preventDefault();
    
    const entered = templateInstance.find('input#search_nav').value;
    const doc = Listings.findOne({name: entered});
    if (doc) {
      // console.log(doc._id);
      // Router.go("/listings/" + Listings.findOne({name: entered}).name);
      //open sidenav, set 'openlisting' to this listings _id
      Session.set('openListing', doc._id );
      $('.button-collapse').sideNav('show');
    } else if (Categories.findOne({name: entered})) {
      Router.go("/categories/" + Categories.findOne({name: entered}).name);
    } else {
      console.warn("No Match");
    }

		analytics.track("Searched:", {
  		clientSearch: entered
		});
	},
  'click .signout_btn': function () {
    AccountsTemplates.logout();
  },
  'mouseup .tt-suggestion>ul>li': function(event,templateInstance) {
    let name = event.target.innerText;
    let type = event.target.parentElement.parentElement.parentElement.firstChild.innerText;
    Router.go('/' + type + '/' + name);
  },
  'click #desktop_search-form': function() {
    // $('#search_nav').focus();
  }
  // 'click .addmodal': function () {
  //   $('#modalAdd').modal('open');
  //   // console.log("open!");
  // }
  // 'click .tt-suggestion': function(event, templateInstance) {
  //   // console.log(event, templateInstance);
  // }
});

Template.nav.helpers({
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
        local: function () { return Listings.find({
          location: { $exists : 1}, 
          certs: {$exists: 0}
        }).fetch(); },
        header: '<h4 class="tt-header">Listings</h4>',
        template: 'results'
      // },{
        // name: 'listings',
        // valueKey: 'city',
        // displayKey: 'city',
        // local: function () { return Listings.find().fetch(); },
        // header: '<h4 class="tt-header">Cities</h4>',
        // template: 'results'
      }
    ];
  }
});