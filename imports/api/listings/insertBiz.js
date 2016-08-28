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
  			// console.log(Roles.userHasRole(Meteor.userId(), "admin"));
  		// if(!this.userId) {
  	
  			// If listing does NOT exist, 
		    if (! _.findWhere(Listings.find().fetch(), { name: data.name }) ) {
				let name = data.name;
				let address = data.address1;
				let city = data.city;
				let state = data.state;
				let zip = data.zip ;
				let url = data.url ;
				let phone = data.phone;
				let owner = data.owner || data.contact;
				let description = data.description;

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
				// let name = data.name;
				// console.log("INSERT FAILED: '"+ name + "' exists.");
				return
			}
		} else {
			throw new Meteor.Error('Unauthorized for Insert');
		}
	}
});


