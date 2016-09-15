import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import '../components/navMenu.js';
import '../components/loggedInNav.js';
import '../components/addForm.js';
import './nav.html';


Template.nav.onRendered( function() {
// ====== WHAT IS THIS FOR? 
	// $(document).ready(function(){
	// 	$(".button-collapse").sideNav();
	// });
});

