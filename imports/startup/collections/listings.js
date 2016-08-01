
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


Meteor.methods({
	insertBiz(data) {
    check(this.userId, String);

		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Insert');

		Listings.insert({
			name: data.name,
      loc: data.loc,
			address1: data.address1,
			address2: data.address2,
			address3: data.address3,
			city: data.city,
			state: data.state,
			zip: data.zip,
			country: data.country,
      url: data.url,
      image: data.img,
      phone: data.phone,
			owner: data.owner,
			createdBy: this.userId,
			createdAt: Date.now()
		})
	},
	removeBiz(id) {
		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Remove');
		if(!id)
			throw new Meteor.Error('Invalid ID');
		
		Listings.remove({
			_id: id,
			createdBy: this.userId
		})
	}
});



export default Listings;
