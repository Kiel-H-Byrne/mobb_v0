
Listings = new orion.collection('listings', {
  singularName: 'listing', // The name of one of these items
  pluralName: 'listings', // The name of more than one of these items
  link: {
    // *
    //  * The text that you want to show in the sidebar.
    //  * The default value is the name of the collection, so
    //  * in this case it is not necessary.

    title: 'Listings' 
  },
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
        title: "zip" 
      },{ 
        data: "country", 
        title: "Country" 
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
			address1: data.address1,
			address2: data.address2,
			address3: data.address3,
			city: data.city,
			state: data.state,
			zip: data.zip,
			country: data.country,
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
