
//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys) {
    console.log("-= Settings: FAILED. (run w/ --settings') =-");
} else {console.log ("-= Settings: Loaded =-");}

let kiel = {};

if (Meteor.users.find().count() === 0) {
	let kielId = Accounts.createUser({
	    
	    profile: {
	      loc: '39.0046,-77.0369',
	      name: "Kiel H. Byrne",
	      favorites: []
	    },
	    name: 'Kiel Hamilton Byrne',
	    username: "khb",
	    email: "khb@iam.com",
	    password: "password",
	  });

	kiel = Meteor.users.findOne(kielId);
	Roles.addUserToRoles( kiel._id ,  ["admin"] );
	console.log("-= Admin: 'khb' is Admin =-");

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
	if (user.services.facebook) {
		user.username = user.services.facebook.name;
		user.emails = [{address: user.services.facebook.email, verified: true}];
	
		if (options.profile) {
			options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "picture/?type=large";
		}
		return user;
	}

		if (user.services.google) {
		user.username = user.services.google.name;
		user.emails = [{address: user.services.google.email, verified: true}];
	
		if (options.profile) {
			options.profile.picture = user.services.google.picture;
		}
		return user;
	}

	return user
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