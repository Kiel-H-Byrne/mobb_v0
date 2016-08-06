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

		if (! _.findWhere(Listings.find().fetch(), { name: data.name }) ) {
			Listings.insert({
				name: data.name,
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
			});
		} else {console.log("INSERT FAILED: '"+ data.name + "' already exists.");}
	}
});
