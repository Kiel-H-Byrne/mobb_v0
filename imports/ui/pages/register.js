
import './register.html';

Template.register.events({
	'submit form': function(event, templateInstance){
	    event.preventDefault();
	    let o = {};
	    o.email = event.target.email.value;
	    o.password = event.target.password.value;
	    o.username = event.target.username.value;
	
		console.log("Register Submitted!!", o.email);

	    Meteor.call('registerMe', o);
	    
	    Router.go('/');
	}
});