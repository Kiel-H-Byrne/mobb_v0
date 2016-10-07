import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './infoModal.html';
import './verifyForm.js';
import './closeButton.js';


Template.infoModal.helpers({
	'currentDoc': function() {
		let id = Session.get('openListing');
		let doc = Listings.findOne({_id: id});
		// console.log(doc);
		return doc;
	}	
});