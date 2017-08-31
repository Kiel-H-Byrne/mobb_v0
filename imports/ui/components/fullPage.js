
import './fullPage.html';
import './verifyForm.js';
import './claimForm.js';

Template.fullPage.onCreated(function () {

});

Template.fullPage.onRendered(function () {
  let tpl = this;

  // if (this.data.location && !this.data.google_id ) {
  //   // submit to google places
  //   // console.log("getting google ID ");
  //   let id = Meteor.call('placesSearch', this.data.name, this.data.location); 
  //   console.log(id); 
  //   if (id) {
  //     Meteor.call('placeDetails',this.data.google_id, function(error, result) {
  //       if (error) {
  //         console.log(error);
  //       } else if (result) {
  //         Session.set('thisPlace', result);
  //       }
  //     });  
  //   }

  // } else 
  // if (this.data.google_id) {
  //   console.log("Have google ID");
  //   // if starts with q, check again
  //   Meteor.call('placeDetails',this.data.google_id, function(error, result) {
  //     if (error) {
  //       console.log(error);
  //     } else if (result) {
  //       Session.set('thisPlace', result);
  //     }
  //   });
  // }

  $(document).ready(function () {
    $('.modal-trigger').modal();
    $('select').material_select();
    $('.dropdown-button').dropdown({
    // stopPropagation: true
    });
    $('img').on('error', function () {
      console.log("broken image", this);
      $(this).css({display:"none"});
      // if(!$(this).hasClass('broken-image')) {
      //   $(this).addClass('broken-image');
      // }
    });

    // $('pinned').pushpin({
    //   top: 0,
    //   offset: 0
    // });

    // setGReviews(tpl.data.google_id);


      // $("img").error(function () { 
      //   // $(this).hide();
      //   $("img").each(function () {
      //     $(this).attr("src", $(this).attr("src").replace("http://", "https://")).css({display:"none"}); ;
      //   });
      // });

      // $("img").error(function () { 
      //   // $(this).hide();
      //     console.log(this);
      //     // $("img").each(function () {
      //       // $(this)
      //       // .attr("src", $(this).attr("src").replace("http://", "https://"));
      //       // .error(function () {
      //       //   $(this).css({display:"none"});
      //       // });
      //     // });
      // }).attr("src").replace("http://", "https://");

    });

});

Template.fullPage.events({

});

Template.fullPage.helpers({
  isPlace: function () {
    let id = this.google_id;
    if (id) {
      let startswC = id.charAt(0) !== 'q'; //is from google
      if (id && startswC) {
        return true;
      }
    }
  },
  isOpen: function(doc) {
    let check = doc.opening_hours.open_now;
    return check;
  },
  microMapOptions: function () {
    // console.log(this.location);
    let locArr = this.location.split(",");
    // console.log(locArr);
    let mapCenter = {
      "lat": Number(locArr[0]),
      "lng": Number(locArr[1])
    };
      GoogleMaps.ready('microMap', function () {
        let marker = new google.maps.Marker({
          position: mapCenter,
          map: GoogleMaps.maps.microMap.instance,
          // icon: { url: 'img/orange_marker_sm.png' }
        });
      });

        if (GoogleMaps.loaded() && mapCenter) {

          return {
            // ============================= RETURN MAP OPTIONS ==================================    
            center: new google.maps.LatLng(mapCenter),
            zoom: 14,
            // mapTypeId:google.maps.MapTypeId.TERRAIN,
            backgroundColor: "#444",
            clickableIcons: false,
            disableDefaultUI: true,
            // fullscreenControl: true,
            minZoom: 15,
            maxZoom: 20,
            scrollwheel: false,
            streetViewControl: false,
            draggable: false,
            gestureHandling: 'none',
            styles: 
              // customOrangeGray
              [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[ {"color":"#FBB03B"}, {"weight": 4} ]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#777777"},{"visibility":"on"}]},{ "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"hue":"#003300"},{"saturation":-80},{"gamma":0.3}, { "visibility": "simple" }]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"saturation":-10},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off" }]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-50},{"lightness":-35}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#FBB03B"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"weight":4},{"color":"#484848"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"weight":7.59}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"labels","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"transit.station.bus","elementType":"labels.icon","stylers":[{"visibility":"off"},{"hue":"#ff2300"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]}]
          };
       }
    },
    isPhoto: function(doc) {
      let options = {'maxWidth': 150, 'maxHeight': 150};
      // let uri = doc.getUrl(options);
      // console.log(uri);
      let photos = Session.get('thisPlace').photos;
      if (photos) {
        console.log(photos.getUrl(options));
      }
      // return options;
    },
    getUrl: function(pic) {
      //take this photo and return whatever the result of the call is. 
      //req'd key, photoreference, & maxheight or maxwidth
      // Meteor.wrapAsync(apiCall)(apiUrl);
// https://maps.googleapis.com/maps/api/place/photo?parameters

    return Meteor.call('getPlacePhotos', pic);
      // console.log(this,pic);
    }
});

