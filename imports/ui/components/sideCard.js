import './sideCard.html'

Template.sideCard.onCreated( function () {
  Session.set('thisPlace', false);
});

Template.sideCard.onRendered( function () {

  $(document).ready(function() {

    $('.carousel').carousel();

    $('.button-collapse').sideNav({
      menuWidth: 320,
      edge: 'left',
      closeOnClick: true,
      draggable: true
    });
    $('.modal-trigger').modal();
    $('select').material_select();
    $('.dropdown-button').dropdown();
    $('img').on('error', function () {
      console.log("broken image", this);
      $(this).css({display:"none"});
    });
  });

  this.autorun(function(p) {

    const docId = Session.get('openListing');
    const doc = Listings.findOne({_id: docId});
    

    if (doc && !doc.google_id) {
      Meteor.call('placesSearch', doc.name, doc.location);
    } else if (doc && doc.google_id){
      console.log("Have google ID");
      // if starts with q, check again
      Meteor.call('placeDetails' , doc.google_id, function(error,result) {
      if (result && Meteor.isClient) {
        // console.log(result)
        // console.log(GCache.get(data.google_id));
        Session.set('thisPlace', result);
      } else {
        console.log('no response for place:', error);
      }
      });
    }
  });
});

Template.sideCard.helpers({
  thisDoc: function() {
    const docId = Session.get('openListing');
    const doc = Listings.findOne({_id: docId});
    
    return doc;    
  },
  getDetails: function(google_id) {
    return Meteor.call('placeDetails', google_id, function(error,result) {
      if (result && Meteor.isClient) {
        console.log(result)
        // console.log(GCache.get(data.google_id));
        Session.set('thisPlace', result);
        $('.carousel.carousel-slider').carousel({fullWidth:true});
      } else {
        console.log('no response for place:', error);
      }
      });
  },
  isOpen: function(doc) {
    let check = doc.opening_hours.open_now;
    return check;
  }
});

Template.carouselPhoto.helpers({
  getUrl: function(ref) {
    //take this photo and return whatever the result of the call is. 
    //req'd key, photoreference, & maxheight or maxwidth
    //either i place a URL in the img, or i call the request and place the response in html...

    // Meteor.call('getPlacePhotos', ref, function(err, res) {
    //   console.log(err, res);
    //   return res.result;
    // });
    const key = Meteor.settings.public.keys.googleServer.key;
    const uri = "https://maps.googleapis.com/maps/api/place/photo?";
    const apiUri = `${uri}maxwidth=300&photoreference=${ref}&sensor=false&key=${key}`;
    return apiUri;
  }
});


Template.carouselPhoto.onRendered(function() {
  $(document).ready(function() {
    console.log('boom!');
    $('.carousel.carousel-slider').carousel({fullWidth:true});
  });

})