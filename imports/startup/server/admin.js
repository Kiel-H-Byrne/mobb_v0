import { Roles } from  'meteor/orionjs:core';

//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys.googleMaps) {
    console.log("-= Settings: FAILED. (Use 'NPM run') =-");
} else {console.log ("-= Settings: Loaded =-");}

let kiel = {};

if (Meteor.users.find().count() === 0) {
	let kielId = Accounts.createUser({
	    
	    profile: {
	      loc: '39.0046,-77.0369',
	      username: "kbyrne"
	    },
	    name: 'Kiel',
	    username: "khb",
	    email: "khb@iam.com",
	    password: "password",
	  });

	kiel = Meteor.users.findOne(kielId);
	Roles.addUserToRoles( kiel._id ,  ["admin"] );
	console.log("-= Admin: 'khb' is Admin =-");
}

// if ( Meteor.users.findOne({username: 'khb'}) ) {
// 	let kiel = Meteor.users.findOne({username: 'khb'});
	// Roles.addUserToRoles( kiel._id ,  ["admin"] );
	// console.log("-= Admin: 'khb' is Admin =-")
// } else {
// 	console.log("-= Admin: No Admin =-");
// }

// this is for handling # in verifyEmail url
(function () {
    "use strict";
    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl('verify-email/' + token);
    };
    Accounts.urls.enrollAccount = function (token) {
        return Meteor.absoluteUrl('enroll-account/' + token);
    };

})();