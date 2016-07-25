import { Template } from 'meteor/templating';

import './addForm.html'


Template.addForm.events({
	'submit form' : function(evt,tpl) {
		event.preventDefault();
		let l = {};
		l.name = tpl.find('input#listingName').value;
		
		Meteor.call('insertBiz', {
			name: l.name,
			// address1: l.address1,
			// address2: l.address2,
			// address3: l.address3,
			// city: l.city,
			// state: l.state,
			// country: l.country
		});
		
		console.log("form submitted");
	}
})