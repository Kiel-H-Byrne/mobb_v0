import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';
import './map.js';
import './shareDropdown.js';

Template.navMenu.events({
	//====== SEARCH FORM ON NAVBAR =======
	//when form is submitted, set new center. 
	
	'submit form': function (event, tpl) {
		event.preventDefault();
		$('.button-collapse').sideNav('hide');

		let entered = tpl.find('.form-control').value;
		console.log(entered);

		analytics.track("Searched from Nav.", {
		clientSearch: entered
		});
	}
});

