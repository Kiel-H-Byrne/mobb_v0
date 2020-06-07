
//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys) {
    console.log("-= Settings: FAILED. (run w/ --settings') =-");
} else {console.log ("-= Settings: Loaded =-");}

let ADMIN_USER = {};

if (Meteor.users.find().count() === 0) {
	let adminId = Accounts.createUser({  
	    profile: {
	      // loc: '39.0046,-77.0369',
	      name: "MoBB Admin",
	      favorites: []
	    },
	    name: 'MoBB Admin',
	    username: "mobb_admin_user",
	    email: "mobb@iam.com",
	    password: "mobbword",
	  });

	ADMIN_USER = Meteor.users.findOne(adminId);
	Roles.addUserToRoles( ADMIN_USER._id ,  ["admin"] );
	console.log("-= Admin: 'mobb_admin_user' is Admin =-");

	let randoId = Accounts.createUser({
	    
	    profile: {
	      loc: '38.0046,-76.0369',
	      name: "Rando Ralph Rohnson",
	      favorites: []
	    },
	    name: 'Rando Rohnson',
	    username: "rnr",
	    email: "rnr@iam.com",
	    password: "password",
	  });

	rando = Meteor.users.findOne(randoId);
	Roles.addUserToRoles( rando._id ,  ["fan"] );
	console.log("-= Admin: 'RnR' is User =-");	
}

Meteor.publish('roles', function (){
    return Roles._collection.find();
});

Meteor.users.allow({
	update: (uid, doc) => {return uid === userId;},
	remove: () => true,
});


Accounts.onCreateUser(function(options, user) {
	const myUser = Object.assign({}, user);

	if (options.profile) {
		myUser.profile = options.profile;
	}

	if (user.services.facebook) {
		myUser.username = user.services.facebook.name;
		myUser.emails = [{address: user.services.facebook.email, verified: true}];
	
		if (options.profile) {
			myUser.profile.picture = `https://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`;
			myUser.avatar = `https://graph.facebook.com/${user.services.facebook.id}/picture/?type=small`;
		}
	}

	if (user.services.google) {
		myUser.username = user.services.google.name;
		myUser.emails = [{address: user.services.google.email, verified: true}];
	
		if (options.profile) {
			myUser.profile.picture = user.services.google.picture;
			myUser.avatar = user.services.google.picture;
		}
	}
	return myUser;
});

// // this is for handling # in verifyEmail url
// (function () {
//     "use strict";
//     Accounts.urls.resetPassword = function (token) {
//         return Meteor.absoluteUrl('reset-password/' + token);
//     };
//     Accounts.urls.verifyEmail = function (token) {
//         return Meteor.absoluteUrl('verify-email/' + token);
//     };
//     Accounts.urls.enrollAccount = function (token) {
//         return Meteor.absoluteUrl('enroll-account/' + token);
//     };

// })();