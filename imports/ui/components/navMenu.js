import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './navMenu.html';

Template.navMenu.events({
	//when form is submitted, change the 'found' state to the one entered.
	//should accept zipcode and full address.
	'submit form': function (event, tpl) {
		event.preventDefault();
		console.log(tpl);
		//if entered is a string, set value to state
		var entered = tpl.find('input#search_loc').value;
		console.log(entered);
		if (entered.length === 5  && $.isNumeric(entered) ) {
			//user has entered their zipcode
	
			Session.set('searchVal', entered);
			
			//convert zipcode to state.
      let response = Meteor.call('geoCode', entered);
      console.log(response);

		// } else if (entered.length > 5) {
		// 	//if they enter an address, store as search address, verify as user's address.
		// 	Session.set('newAddress', entered);
		// 	// throwError("I can't search addresses right now...");
		// } else {
		// 	// throwError("Did not enter a valid zipcode or address!");
		}
	    
	
    analytics.track("Entered Zipcode", {
      zip: entered
    });

	}
});