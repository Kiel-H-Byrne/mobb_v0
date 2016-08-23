// import { Meteor } from 'meteor/meteor';
// import { Roles } from  'meteor/orionjs:core';


// meteor methods should be created on both server and client, so 'optimistic UI' 
// can take place, call runs from both, but should be called from client. 

Meteor.methods({
	insertBiz: function(data) {
		
	    // check(this.userId, String);
	    
	    // IF UserID does NOT exist. (Not a String)
	    // if (! Match.test(this.userId, String)) {
	    // 	console.log("INSERT FAILED: NO USER");
	    // } 


	    // IF user role is NOT ADMIN
	    if(!Roles.userHasRole(Meteor.userId(), "admin")) {
  			console.log(Roles.userHasRole(Meteor.userId(), "admin"));
  		// if(!this.userId) {
  	
  			// If listing does NOT exist, 
		    if (! _.findWhere(Listings.find().fetch(), { name: data.name || data.NAME }) ) {
				let name = data.name || data.NAME;
				let address = data.address1 || data.ADDRESS;
				let city = data.city || data.CITY;
				let state = data.state || data.STATE;
				let zip = data.zip || data.ZIP;
				let url = data.url || data.WEBSITE;
				let phone = data.phone || data.PHONE;
				let owner = data.owner || data.CONTACT;
				let description = data.description || data.PRODUCTS_SERVICES;

				Listings.insert({
					name: name,
					address1: address,
					address2: data.address2,
					address3: data.address3,
					city: city,
					state: state,
					zip: zip,
					country: data.country,
					url: url,
					image: data.img,
					phone: phone,
					owner: owner,
					description: description,
					createdBy: this.userId,
				});
				console.log("Inserted: "+ name);
			} else {
				let name = data.name || data.NAME;
				console.log("INSERT FAILED: '"+ name + "' exists.");
			}
		} else {
			throw new Meteor.Error('Unauthorized for Insert');
		}
	}
});


