import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './closeButton.html';

Template.closeButton.events({
	'click, touchstart #closeButton_button' : function(evt,tpl){
	    //close modal
	    let modalName = tpl.firstNode.parentNode.id;
	    $('#'+ modalName ).modal('close');
	  }
});