// import { Roles } from  'meteor/orionjs:core';

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

	Roles.addUserToRoles( kiel , ["admin"] );
};