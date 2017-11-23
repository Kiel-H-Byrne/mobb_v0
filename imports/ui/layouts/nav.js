
import Categories from '/imports/startup/collections/categories.js';

import '../components/loadingScreen.html';
// import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/editForm.js';
import '../components/modalSplash.js';
import '../components/closestCard.js';
// import '../components/categorySelect.js';
import '../components/mapFilter.js';
// import '../components/geoModal.js';
// import '../components/corner-ribbon.js';
import '../components/favoriteStar.js';
import '../components/shareListing.js';
import '../components/mobileNav.js';
import '../components/sideCard.js';

import './nav.html';

Template.nav.onRendered( function () {
  $(document).ready(function () {
    $('[id="loading-wrapper"], .server_rendered').fadeOut();
    
    $('.dropdown-button').dropdown({
      stopPropagation: true,
      constrain_width: false
    });
  });
 // TypeAhead autocomplete in Schema
  Meteor.typeahead.inject();
  $('.twitter-typeahead').css("display:block");

  $('#modalVerify').modal();
  $('#modalClaim').modal();

});

Template.nav.events({
	'click .brand-logo img': function(event,templateInstance) {
    let route = Router.current().url;
    if (route[0] !== '/') {
      $('#modalSplash').modal('open');
      const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
      if (map) {
        map.instance.setZoom(5);
      }
      //check zoom and zoom back to normal if less than  
    }
  },
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
    const name = event.target.innerText;
    const type = event.target.parentElement.parentElement.parentElement.firstChild.innerText;
    if (type === 'Listings') {
      const id = Listings.findOne({name: name})._id;
      console.log(type,name,id);
      Router.go('/' + type + '/' + id);  
    } else {
      Router.go('/' + type + '/' + name);  
    }
    
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
        local: function () { return Listings.find().fetch(); },
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