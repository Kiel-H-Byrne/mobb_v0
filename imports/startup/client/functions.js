  
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
    map.instance.setCenter(pos);
    google.maps.event.trigger(map, 'resize');
    map.instance.setZoom(12);
};

targetBrowser = function(map) {
  let pos = Session.get('browserLoc');
  map.instance.setCenter(pos);
  map.instance.setZoom(8);
};

// let clientMarker;
  
placeMyMarker = function(map,pos) {
  google.maps.event.trigger(map, 'resize');
  //would only not exist if the template reloaded and the browser didn't...(dev mode)
  if (!clientMarker) {
    const radius = 3;
    clientMarker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.lat, pos.lng),
      map: map.instance,
      icon: {url: 'img/orange_dot_sm_2.png'},
      title: "My Location",
      // animation: google.maps.Animation.BOUNCE,
    }); 
    clientRadius = new google.maps.Circle({
      map: map.instance,
      center: pos,
      radius: (radius * 1609.34),
      strokeColor: '#FF7733',
      strokeOpacity: 0.2,
      strokeWeight: 2,
      fillColor: '#FFAA00',
      fillOpacity: 0.10,
    });
  } else {
    //MARKER EXISTS, SO WE MOVE IT.
    clientMarker.setPosition(pos);
    clientRadius.setCenter(pos);
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
        console.log("Data from API...");
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
    //NO GOOGLE ID
    return false;
  }
};

