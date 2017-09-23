import './sideCard.html'

Template.sideCard.onCreated( function () {
  Session.set('thisPlace', false);
});

Template.sideCard.onRendered( function () {

  $(document).ready(function() {
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

  // ImagesLoaded( '.place_photo', function () {
  //   console.log('finished')
  //   $('.carousel.carousel-slider').carousel({fullWidth:true});
  // });

});

Template.carouselPhoto.onRendered(function() {
  $(document).ready(function() {
    $('.carousel.carousel-slider').carousel();
  });
});
