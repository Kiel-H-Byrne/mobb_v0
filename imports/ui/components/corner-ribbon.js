import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './corner-ribbon.html';


Template.corner_ribbon.helpers ({
	label: function() {
		let string = "BETA";
		return string;
	}
});
