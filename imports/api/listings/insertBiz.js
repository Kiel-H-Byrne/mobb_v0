import { Meteor } from 'meteor/meteor';


// meteor methods must be created on server, both method and call run on client. 

Meteor.methods({
	insertBiz: function(data) {
    // check(this.userId, String);
    if (! Match.test(this.userId, String)) {
    	console.log("INSERT FAILED: NO USER");
    }

		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Insert');

		if (! _.findWhere(Listings.find().fetch(), { name: data.name || data.NAME }) ) {
			// console.log(data.ADDRESS);
			
			Listings.insert({
				name: data.name || data.NAME,
				address1: data.address1 || data.ADDRESS,
				address2: data.address2,
				address3: data.address3,
				city: data.city || data.CITY,
				state: data.state || data.STATE,
				zip: data.zip || data.ZIP,
				country: data.country,
				url: data.url || data.WEBSITE,
				image: data.img,
				phone: data.phone || data.PHONE,
				owner: data.owner || data.CONTACT,
				description: data.description || data.PRODUCTS_SERVICES,
				createdBy: this.userId,
			});
		} else {console.log("INSERT FAILED: '"+ data.name + "' already exists.");}
	}
});
