import './verifyUI.js';
import './sideCard.html';
import './mPreloader.html';

Template.sideCard.onCreated( function () {
 
});

Template.sideCard.onRendered( function () {

  $(document).ready(function() {
  GoogleMaps.ready('map', function(map) {
    //GLOBAL SERVICES
    placesService = new google.maps.places.PlacesService(map.instance);
  });
    $('.button-collapse').sideNav({
      edge: 'left',
      closeOnClick: true,
      draggable: false,
      onClose: function() {
        Session.set('carouselInit', false);
        // Session.set('thisPlace', false);
      }
    });
    $('.modal-trigger').modal();
    $('select').material_select();
    $('img').on('error', function () {
      $(this).css({display:"none"});
    });
    $('.tooltipped').tooltip();
  });

  this.autorun(function(p) {

    let docId = Session.get('openListing');
    const doc = Listings.findOne({_id: docId});

    if (doc && !doc.google_id) {
      //GET ID, UPDATE DOCUMENT
      Meteor.call('placesSearch', doc.name, doc.location, function(error,result) {
        if (result) {
          Listings.update(
            { _id: docId },
            { $set: { google_id: result } }
          );
        }
      });
    } else if (doc && doc.google_id){
      // console.log("Have google ID");
      Meteor.call('placeDetails' , doc.google_id, function(error,result) {
      if (result && Meteor.isClient) {
        // console.log(result)
        // console.log(GCache.get(data.google_id));
        Session.set('thisPlace', result);
      } else {
        console.log('No response for place:', error);
      }
      });
    }
  });

  // ImagesLoaded( '.slides li', function () {
  //   // hide preloader
  //   $('.spinner-layer').css('hide');
    
  // });

  // ImagesLoaded( '.carousel', { background: '.carousel-item' }, function () {
  //   console.log('imageLoaded!');
  //   if (!Session.get('carouselInit')) {
  //     console.log('carousel Loaded');
  //     $('.carousel.carousel-slider').carousel({
  //       // fullWidth: true,
  //       indicators: true
  //     });
  //     Session.set('carouselInit', true);
  //   }
  // });

});

Template.sliderPhoto.onRendered(function() {
  $(document).ready(function() {
  if (!Session.get('carouselInit')) {
      $('.slider').slider({
        height: 250,
        interval: 2500
      });
      Session.set('carouselInit', true);
    }

  });
});
Template.sideCard.events({
  'click .claim_link': function(event,templateInstance){ 
    event.stopPropagation();
    event.preventDefault();
    if (Meteor.user()) {
      //open modal #modalClaim
      $('#modalClaim').modal('open');
    } else {
      Materialize.toast('Log In Before Claiming A Business', 3000, 'myToast');
    }
  },
  'click button.button_get-directions': function(event,templateInstance){ 
    event.stopPropagation();
    analytics.track("Got Directions", {
      category: "Listings",
      label: this.name,
      value: this._id
    });
    window.open(`https://www.google.com/maps/dir/Current+Location/${this.location}`);
  }, 
  'click a.button_leave-review': function(event,templateInstance) {
    event.stopPropagation();
    analytics.track("Left Review", {
      category: "Listings",
      label: this.name,
      value: this._id
    });
  }
});

Template.sideCard.helpers({
  photoarray: function(google_id) {
    
    const req = {
        placeId: google_id
    };
    const cbk = function(res,stat) {
        if (stat === google.maps.places.PlacesServiceStatus.OK && res.photos.length) {
            
            console.log(res.photos);
            let urlArray = [];
            for (var i = res.photos.length - 1; i >= 0; i--) {
              const el = res.photos[i];
              let str = el.getUrl({
                maxWidth: 300
              });
              urlArray.push(str);
            }
            // console.log(urlArray);
            return urlArray;
        } else {
            console.log(stat);
        }
    };
    // // console.log(service);
    return placesService.getDetails(req, cbk);
  }
});