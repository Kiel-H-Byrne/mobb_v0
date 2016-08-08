import {Template} from 'meteor/templating';

import './nav.html'

import '../pages/login.js';
import '../pages/register.js';
import '../components/navMenu.js';
import '../components/addForm.js';

Template.nav.onRendered( function() {
	$(document).ready(function(){
		$(".button-collapse").sideNav();
		// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
	  });
});
