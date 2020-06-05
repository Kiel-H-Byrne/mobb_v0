## Description:
#### The Application is meant to educate clients on the black owned businesses in their vicinity (or search another area in USA). The intent is to drive more businesses to BoBs, who in turn will bank with Black Banks, who will reinvest in small BoBs and community projects.

Key Features: (MVP)
- Show businesses close to me, on a map.
- Show the closest business to my current location, somewhere on main page [ with a card or callout button, or ribbon, or marker symbol ]
- Insert business

#### Infrastructure:
- This is a legacy `meteor` application, build in version 1.6. Alongside MongoDB
- Google Maps API 
- opengraph.io API
- Google / Facebook oAuth packages (meteorite)
- Materialize-CSS (v.0.1.0)
- Orion CMS package (meteorite)

#### Branches:
`master` is to merge before production
`ft-dirs` branch is to implement the 'closest business' feature w/ directions from current location.
`production` is untouched, only  merge and deploy.

#### Templates: 
template file with closest card. 
template renders when map renders, 

### Load Order:
##### Server 
the server starts
the server checks if any Users exist in the database
if no users, the admin user and a random user are created and given roles
the server creates its methods.
the server creates a scheme for Listings collection.

##### Client 
the client creates its routes
the window loads
the client determines if there is a user or not
the Google map loads
the autorun for geolocation and change in position fires
if no geolocation, the IP info is used to find search area.
the 'Listings_all' publication is subscribed to. (in future, just publish a certain radius of listings based on either user input, or geolocation.)
for each listing, markers are placed at lat/long point
for each marker, events are placed on each marker
infowindow loads on click event of each marker

##### User Experience
- a client signs in
- a client is granted the ability to add a listing
- a client is granted the ability to log off


##### Events

##### Device Colors
<!-- 
+Entity   Hex Description 
+&_COLOR_AQUA; 0xFF00FFFF  Light blue
+&_COLOR_BLACK;  0xFF000000  Pure black
+&_COLOR_BLUE; 0xFF0000FF  Pure blue
+&_COLOR_FUCHSIA;  0xFFFF00FF  Light purple
+&_COLOR_DARKGRAY; 0xFF404040  Dark gray
+&_COLOR_GRAY; 0xFF808080  Pure gray
+&_COLOR_GREEN;  0xFF008000  Pure green
+&_COLOR_LIME; 0xFF00FF00  Light green
+&_COLOR_MAROON; 0xFF800000  Dark red
+&_COLOR_NAVY; 0xFF000080  Dark blue
+&_COLOR_OLIVE;  0xFF808000  Green-brown
+&_COLOR_PURPLE; 0xFF800080  Pure purple
+&_COLOR_RED;  0xFFFF0000  Pure red
+&_COLOR_SILVER; 0xFFC0C0C0  Light gray
+&_COLOR_TEAL; 0xFF008080  Blue-green
+&_COLOR_WHITE;  0xFFFFFFFF  Pure white
+&_COLOR_YELLOW; 0xFFFFFF00  Pure yellow
+&_COLOR_TRANSPARENT;  0x00000000  Completely transparent; the background shows through
+-->
