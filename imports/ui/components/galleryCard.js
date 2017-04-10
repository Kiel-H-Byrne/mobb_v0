import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import './galleryCard.html';

Template.galleryCard.onRendered(function() {
  //WORKING

  //   GoogleMaps.ready('minimap', function(map) {
  //     const params = {
  //       map: map,
  //       name: 'The Spice Suite',
  //       loc: {lat: 38.9738619, lng: -77.01829699999999},
  //     };
  //      const service = new google.maps.places.PlacesService(params.map.instance);
  //     let request2 = {
  //         //name & location & radius (meters).
  //         name: params.name,
  //         location: params.loc,
  //         radius: 100,
  //       };

  //     let callback = function(results,status) {
  //         if (status === google.maps.places.PlacesServiceStatus.OK) {
  //             console.log(results[0]);    
  //             return results[0].place_id;
  //         } else {
  //             console.log(status);
  //         }
  //     };
  //     service.radarSearch(request2,callback);  
  // });
});

Template.galleryCard.helpers({
  greview: function(name,loc, id) {

    let locArr = loc.split(",");
    let locObj = _.object( ['lat', 'lng'], [Number(locArr[0]), Number(locArr[1])]);
    // console.log(id);

    if (GoogleMaps.loaded() && Meteor.user()) {
      let map = GoogleMaps.maps.map;
      // const params = {
      //   map: map,
      //   name: 'The Spice Suite',
      //   loc: {lat: 38.9738619, lng: -77.018299999},
      // };

      const service = new google.maps.places.PlacesService(map.instance);
      const req = {
          //name & location & radius (meters).
          name: name,
          location: locObj,
          radius: 10,
        };

      const cbk = function(res,stat) {
          if (stat === google.maps.places.PlacesServiceStatus.OK) {
              let google_id = res[0].place_id
              console.log(`Obtained ${google_id} for ${name}.`);
              //set document
              Listings.update(
                { _id: id },
                { $set: { google_id: google_id } }
              );
              return google_id;
          } else {
              console.log(stat);
          }
      };
      return service.radarSearch(req,cbk);  

      // Meteor.call('getGoogleID', params.map, params.name, params.loc) 
    };
  }, 
});

Template.galleryCard.events({
  // 'click': function(evt,tpl) {
  //   // Session.set('openListing', this._id);
  //   // console.log(this._id);
  // }
});