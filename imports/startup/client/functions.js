import { GCache } from '/imports/startup/collections/caches';

//====== APP GLOBALS ======
clientMarker = null;
clientRadius = null;

// getOGS = function(url) {
//   let options = {
//     'url': url,
//     'timeout': 4000
//   };
//   ogs(options, function (err, results) {
//     if (err) {
//       console.log('OGS Error:', err); // This is returns true or false. True if there was a error. The error it self is inside the results object.
//       console.log('OGS Results:', results);  
//     } else {
//       console.log('OGS Results:', results);  
//     }
//   });
// };

// dlImage = async function(url) {

//   const options = {
//     "url": url,
//     "dest": '/public/img'
//   };

//   try {
//     const { filename, image } = await download.image(options);
//     console.log(filename) // => /path/to/dest/image.jpg;
//   } catch (e) {
//     throw e;
//   }

// }

getLocation = async function() {
  //const or let??
    let pos = await Geolocation.latLng();
    return pos;
};

targetClient = function(map,pos) {
  // SET CENTER, 
  // ZOOM TO CERTAIN LEVEL
  if (!Meteor.isCordova) {
    map.instance.setCenter(pos);
    google.maps.event.trigger(map, 'resize');
    map.instance.setZoom(10);
  } else {
    console.log('from client:');
    console.log(pos);
    map.animateCamera({
      target: {
    lat: 35.13,
    lng: 137.33
  },
      zoom: 10
    });
  }
};

targetBrowser = function(map) {
  // SET CENTER, 
  // ZOOM TO CERTAIN LEVEL
  let pos = Session.get('browserLoc');
  if (!Meteor.isCordova) {
    map.instance.setCenter(pos);
    map.instance.setZoom(8);
  } else {
    console.log('from browser: '+ pos);
    map.setCameraTarget(pos);
    map.setCameraZoom(8);
  }
};

// let clientMarker;
  
placeMyMarker = function(map,pos) {
  // CREATE MARKER IF IT DOESN'T ALREADY EXIST, 
  //SET MARKER POSITION

  // google.maps.event.trigger(map, 'resize');
  //would only not exist if the template reloaded and the browser didn't...(dev mode)
  if (!clientMarker) {
    if (!Meteor.isCordova) {
      // const radius = 3;
      clientMarker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map.instance,
        icon: {url: 'img/orange_dot_sm_2.png'},
        title: "My Location",
        // animation: google.maps.Animation.BOUNCE,
      }); 
      // clientRadius = new google.maps.Circle({
      //   map: map.instance,
      //   center: pos,
      //   radius: (radius * 1609.34),
      //   strokeColor: '#FF7733',
      //   strokeOpacity: 0.2,
      //   strokeWeight: 2,
      //   fillColor: '#FFAA00',
      //   fillOpacity: 0.10,
      // });
    } else {
      clientMarker = map.addMarker({'position': pos});
      console.log(clientMarker);
  }
  } else {
    //MARKER EXISTS, SO WE MOVE IT.
    clientMarker.setPosition(pos);
    // clientRadius.setCenter(pos);
  }

  $(document).ready(function (){
    $('[id="centerButton_button"]').removeClass('pulse');
  });
};

hideImg = function() {
  $(this).css({display:"none"});
  console.log('img broken');
};


setGReviews = function(gid) {
  if (gid) {
    let dataFromCache = GCache.get(gid);
    const res = {};
    if(dataFromCache) {
      console.log("Reviews Data from GCache...");
      console.log(dataFromCache);
      return dataFromCache;
    } else {
        if (GoogleMaps.loaded()) {
        console.log("Reviews Data from API...");
      //   //get the response and stash it in GCache.
        const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
        // console.log(map);
        const service = new google.maps.places.PlacesService(map.instance);

        const req = {
            placeId: gid
        };
        const cbk = function(res,stat) {
            if (stat === google.maps.places.PlacesServiceStatus.OK) {
                Session.set('thisPlace', res);
                console.log(res);
                GCache.set(gid, res);
                return res;
                //inject with jquery into dom?
            } else {
                console.log(stat);
            }
        };

        // console.log(service);
        service.getDetails(req, cbk);

        // return resolvedData.get('placeDetails');
      } else {
      console.log ("Map not yet loaded..."); 
      } 
    }
  } else {
    console.log("no Google ID");
    //NO GOOGLE ID
    return false;
  }
};

getGDetails = function(gid) {
    if (GoogleMaps.loaded()) {
    console.log("Details Data from API...");
    //   //get the response and stash it in GCache.
    const map = GoogleMaps.maps.map;
    console.log(map);
    const service = new google.maps.places.PlacesService(map.instance);
    const req = {
      placeId: gid
    };
    const cbk = function(res,stat) {
      if (stat === google.maps.places.PlacesServiceStatus.OK) {
        console.log(res);
        // ID_Cache.findOne({key: key}, {$set: {value: place_id}});
        Meteor.call('setGCache', gid, res);
        // resolvedData.set('placeDetails', res);
        Session.set('thisPlace', res);
        return res;
        //inject with jquery into dom?
      } else {
        console.log(stat);
      }
    };
    return service.getDetails(req, cbk);
  } else {
    console.log("no map laoded");
  }
};