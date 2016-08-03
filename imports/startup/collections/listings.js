Listings = new orion.collection('listings', {
  singularName: 'listing', // The name of one of these items
  pluralName: 'listings', // The name of more than one of these items
  link: { title: 'Listings' },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "name", 
        title: "Name" 
      },{ 
        data: "owner", 
        title: "Owner" 
      },{ 
        data: "loc", 
        title: "Location" 
      },{ 
        data: "address1", 
        title: "Address" 
      },{ 
        data: "address2", 
        title: "Address2" 
      },{ 
        data: "address3", 
        title: "Address3" 
      },{ 
        data: "city", 
        title: "City" 
      },{ 
        data: "state", 
        title: "State" 
      },{ 
        data: "zip", 
        title: "Zip" 
      },{ 
        data: "country", 
        title: "Country" 
      },{ 
        data: "url", 
        title: "URL" 
      },{ 
        data: "img", 
        title: "Image" 
      },{ 
        data: "phone", 
        title: "Phone" 
      },{
        data: "createdBy", 
        title: "Created By" 
      },{ 
        data: "createdAt", 
        title: "Created @" 
      },
    ]
  }
});

Listings.allow({
  // update: function(userId, post) { return ownsDocument(userId, post); },
  // remove: function(userId, post) { return ownsDocument(userId, post); },
});


export default Listings;
