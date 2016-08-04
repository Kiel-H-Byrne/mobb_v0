// import { Roles } from  'meteor/orionjs:core';

//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys.googleMaps) {
    console.log("-= Settings: FAILED. (Use 'NPM run') =-");
} else {console.log ("-= Settings: Loaded =-")}

let kiel = {};

if (Meteor.users.find().count() === 0) {
	let kielId = Accounts.createUser({
	    profile: {
	      name: 'Kiel',
	      loc: '39.0046,-77.0369'
	    },
	    username: "khb",
	    email: "khb@iam.com",
	    password: "password",
	  });

	kiel = Meteor.users.findOne(kielId);
};

if ( Meteor.users.findOne({username: 'khb'}) ) {
	let kiel = Meteor.users.findOne({username: 'khb'});
	Roles.addUserToRoles( kiel._id ,  ["admin"] );
	console.log("-= Admin: 'khb' is Admin =-")
} else {
	console.log("-= Admin: No Admin =-");
}
