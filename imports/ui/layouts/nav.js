import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Categories from '/imports/startup/collections/categories.js';

import '../components/navMenu.js';
import '../components/loggedInNav.js';
import '../components/addForm.js';
import '../components/infoModal.js';
import '../components/categorySelect.js';

import './nav.html';



Template.nav.onRendered( function() {
// ====== MOBILE VIEW NAV MENU BUTTON, CLICKING SHOWS THE SIDE NAV. ====== 
	$(document).ready(function(){

		// lastX = window.innerWidth;
		// lastY = window.innerHeight;

		// function shadowOnResize() {
		//    let x = window.innerWidth;
		//    let y = window.innerHeight;
		//    if (lastX >= 995 && 995 > x) {
	 //        $('.button-collapse').sideNav('hide');
		//    }
		//    lastX = x;
		//    lastY = y;
		// };

		// window.addEventListener("resize", shadowOnResize);


		$(".button-collapse").sideNav({
			edge: 'left',
			closeOnClick: true
		});

	});
});

