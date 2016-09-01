// import { Meteor } from 'meteor/meteor';
// import { Roles } from  'meteor/orionjs:core';


// meteor methods should be created on both server and client, so 'optimistic UI' 
// can take place, call runs from both, but should be called from client. 

Meteor.methods({
	insertBiz: function(doc) {

		let obj = {};  	
		obj.name = doc.name;
		obj.street = doc.street;
		obj.street2 = doc.street2;
		obj.city = doc.city;
		obj.state = doc.state;
		obj.zip = doc.zip;
		obj.url = doc.url;
		obj.phone = doc.phone;
		obj.img = doc.img;
		obj.owner = doc.owner || doc.contact;
		obj.description = doc.description;

		Listings.insert({
			name: obj.name,
			street: obj.street,
			address2: obj.street2,
			city: obj.city,
			state: obj.state,
			zip: obj.zip,
			url: obj.url,
			image: obj.img,
			phone: obj.phone,
			owner: obj.owner,
			description: obj.description,
			createdBy: this.userId,
		});
		console.log("Inserted: "+ name);
		return;
	},
	newListing: function(doc) {
		Listings.insert(doc);
	},
});


