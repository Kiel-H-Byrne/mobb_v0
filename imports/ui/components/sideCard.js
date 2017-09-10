import './sideCard.html'

Template.sideCard.onRendered( function () {

  // $(document).ready(function() {
    this.$('.button-collapse').sideNav({
      edge: 'left',
      closeOnClick: true,
      draggable: true
    });
    
    this.$('.modal-trigger').modal();
    
    this.$('select').material_select();
    
    this.$('.dropdown-button').dropdown({
    });

    this.$('img').on('error', function () {
      console.log("broken image", this);
      $(this).css({display:"none"});
    });

  // });
  console.log(this);
  this.autorun(function(p) {
    const docId = Session.get('openListing');
    const doc = Listings.findOne({_id: docId});
    
    if (!doc.google_id) {
      Meteor.call('placesSearch', doc.name, doc.location);
    } else if (doc.google_id){
      console.log("Have google ID");
      // if starts with q, check again
      Meteor.call('placeDetails' , doc.google_id, function(error,result) {
      if (result && Meteor.isClient) {
        console.log(result)
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
      } else {
        console.log('no response for place:', error);
      }
      });
  },
  isOpen: function(doc) {
    let check = doc.opening_hours.open_now;
    return check;
  },
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
    const apiUri = `${uri}maxwidth=150&photoreference=${ref}&sensor=false&key=${key}`;
    return apiUri;
    
  }
});

