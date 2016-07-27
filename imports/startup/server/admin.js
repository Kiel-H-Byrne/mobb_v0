// import { Roles } from  'meteor/orionjs:core';

//check for settings file
console.log("...checking for settings file...");
if (!Meteor.settings.public.googleMaps) {
    console.log(" No Settings File! start server with 'NPM RuN' ");
}

let kiel = {};

if (Meteor.users.find().count() === 0) {
	let kielId = Accounts.createUser({
	    profile: {
	      name: 'Kiel',
	    },
	    username: "khb",
	    email: "khb@iam.com",
	    password: "password",
	  });

	kiel = Meteor.users.findOne(kielId);
};

if ( Meteor.users.findOne({username: 'kiel'}) ) {
	let kiel = Meteor.users.findOne({username: 'kiel'});
	Roles.addUserToRoles( kiel._id ,  ["admin"] );
} else {
	console.log("No Admin Yet");
}
