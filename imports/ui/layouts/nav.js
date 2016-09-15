import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import '../components/navMenu.js';
import '../components/loggedInNav.js';
import '../components/addForm.js';
import './nav.html';


Template.nav.onRendered( function() {
// ====== MOBILE VIEW NAV MENU BUTTON, CLICKING SHOWS THE SIDE NAV. ====== 
	$(document).ready(function(){
		$(".button-collapse").sideNav();
	});
});

