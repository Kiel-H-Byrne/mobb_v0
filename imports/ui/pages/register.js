import {Template} from 'meteor/templating';

import './register.html'

Template.register.events({
	'submit form': function(event){
		
	    event.preventDefault();
	    let email = event.target.email.value;
	    let password = event.target.password.value;
	    let username = event.target.username.value;
	
	console.log("Register Submitted!!", email);

	    Meteor.call('registerMe', {username, email, password});

	    // Meteor.call('loginWith', email, password);
	    
	    Router.go('/');
	}
});