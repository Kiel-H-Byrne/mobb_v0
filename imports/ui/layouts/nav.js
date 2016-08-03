import {Template} from 'meteor/templating';

import '../components/addForm.html';
import '../components/loginForm.html';
import '../components/navMenu.html';
import './nav.html'


Template.nav.onRendered( function() {
	console.log("modal trigger ready");
    

	$(document).ready(function(){

		$(".button-collapse").sideNav();

		// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	    $('.modal-trigger').leanModal();
	  });

});
