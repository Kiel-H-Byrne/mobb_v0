import { Template } from 'meteor/templating';

import './addForm.html';

Template.addForm.events({
	'click button' : function(evt,tpl) {
		event.preventDefault();
		let l = {};
		l.name = tpl.find('input#listingName').value;
		console.log(tpl);
		Meteor.call('insertBiz', {
			name: l.name,
			address1: l.address1,
			address2: l.address2,
			address3: l.address3,
			city: l.city,
			state: l.state,
			country: l.country
		});
		
		console.log("-= Form: Submitted =-");
	}
});

Template.addForm.onRendered(function() {
//show the input form for optional fields, only if the associated checkbox is checked
	$('#supplied').click(function() {
	  $('.date')[this.checked ? "show" : "hide"]();
	});
})