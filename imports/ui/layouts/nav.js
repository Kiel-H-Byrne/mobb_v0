import {Template} from 'meteor/templating';

import './nav.html';

import '../pages/register.js';
import '../components/navMenu.js';
import '../components/addForm.js';

Template.nav.onRendered( function() {
	$(document).ready(function(){
		// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	    $('.modal-trigger').leanModal();
	  });
});
