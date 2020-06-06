
//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys) {
    console.log("-= Settings: FAILED. (run w/ --settings') =-");
} else {console.log ("-= Settings: Loaded =-");}

let kiel = {};

if (Meteor.users.find().count() === 0) {
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


// if ( Meteor.users.findOne({username: 'khb'}) ) {
// 	let kiel = Meteor.users.findOne({username: 'khb'});
	// Roles.addUserToRoles( kiel._id ,  ["admin"] );
	// console.log("-= Admin: 'khb' is Admin =-")
// } else {
// 	console.log("-= Admin: No Admin =-");
// }

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