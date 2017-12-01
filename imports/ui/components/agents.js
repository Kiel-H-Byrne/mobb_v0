const speedFactor = 3; // 10x faster animated drive

const agentMarkers = [{
    'marker': {},
    'origin': {'lat': 39.032381, 'lng': -77.031515},
    'destination': {'lat': 38.992996, 'lng': -77.025974},
    'routeSteps': []
    },{
    'marker': {},
    'origin': {'lat': 40.758895, 'lng': -73.985131},
    'destination': {'lat': 40.864492, 'lng': -73.883199},
    'routeSteps': []
}];

function setAnimatedRoute(marker, map) {
    // init routing services
    let directionsService = new google.maps.DirectionsService;
    let directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    //calculate route
    directionsService.route({
            origin: marker.origin,
            destination: marker.destination,
            travelMode: google.maps.TravelMode.DRIVING
        },
        function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // display the route
                // directionsRenderer.setDirections(response);

                // calculate positions for the animation steps
                // the result is an array of LatLng, stored in autoDriveSteps
                marker.routeSteps = [];
                let remainingSeconds = 0;
                let leg = response.routes[0].legs[0]; // supporting single route, single legs currently
                leg.steps.forEach(function(step) {
                    let stepSeconds = step.duration.value;
                    let nextStopSeconds = speedFactor - remainingSeconds;
                    while (nextStopSeconds <= stepSeconds) {
                        let nextStopLatLng = getPointBetween(step.start_location, step.end_location, nextStopSeconds / stepSeconds);
                        marker.routeSteps.push(nextStopLatLng);
                        nextStopSeconds += speedFactor;
                    }
                    remainingSeconds = stepSeconds + speedFactor - nextStopSeconds;
                });
                if (remainingSeconds > 0) {
                    marker.routeSteps.push(leg.end_location);
                }
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
}

// helper method to calculate a point between A and B at some ratio
function getPointBetween(a, b, ratio) {
    return new google.maps.LatLng(a.lat() + (b.lat() - a.lat()) * ratio, a.lng() + (b.lng() - a.lng()) * ratio);
}

// start the route simulation   
function startRouteAnimation(marker) {
    let autoDriveTimer = setInterval(function () {
            // stop the timer if the route is finished
            if (marker.routeSteps.length === 0) {
                clearInterval(autoDriveTimer);
            } else {
                // move marker to the next position (always the first in the array)
                marker.marker.setPosition(marker.routeSteps[0]);
                // remove the processed position
                marker.routeSteps.shift();
            }
        },
        1000);
}


// start simulation on button click...
// $("#simulateRouteButton").click(function() {
//     startRouteAnimation(agentMarker);
// });


//make marker, 
GoogleMaps.ready('map', function(map) {
    agentMarkers.forEach(function(element) {
        element.marker = new google.maps.Marker({
          position: element.origin,
          map: map.instance,
          icon: {url: 'img/orange_marker_3_sm.png'},
        });
        // AGENT_MARKERS.push(marker);

        setAnimatedRoute(element, map.instance);
        // console.log('animating route');
        startRouteAnimation(element);
    });
});