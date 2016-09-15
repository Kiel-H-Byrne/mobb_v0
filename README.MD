## Description:
#### The Application is meant to educate clients on the black owned businesses in their vicinity (or search another area in USA). The intent is to drive more businesses to BoBs, who in turn will bank with Black Banks, who will reinvest in small BoBs and community projects.

Key Features: (MVP)
- Show businesses close to me, on a map.
- Show the closest business to my current location, somewhere on main page [ with a card or callout button, or ribbon, or marker symbol ]
- Insert business

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

