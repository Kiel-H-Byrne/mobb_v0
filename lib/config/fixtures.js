import { Meteor } from 'meteor/meteor'

import '/imports/startup/collections/listings.js';
import '/imports/api/listings/insertBiz.js';

console.log ("-= FIRST FILE: /lib/config/fixtures.js =-");
// FIRST FILE LOADED, ON BOTH CLIENT AND SERVER. {/lib/config/fixtures.js}

if (Listings.find().count() === 0) {
	let now = new Date().getTime();
  // create a few listings
  
  if (Meteor.isClient) {
  	console.log("-= LISTINGS: Seeding from Client Call 'insertBiz' =-");
		Meteor.call('insertBiz', {
			name: 'Arelis Hair Salon',
			address1: '8646 Colesville Rd',
			city: 'Silver Spring',
			state: 'MD',
			zip: 20910,
			country: 'USA',
			url: 'http://arelisdominicanstyle.com/',
			img: 'http://slideshow.hibustudio.com/sliders/2015/9/56146098e4b002e5546e9ef6/5.2015_280_0_0_27.jpg',
			phone: '3014953771',
			owner: 'Eunice Jackson',
			createdBy: this.userId,
		});
	
		Meteor.call('insertBiz', {
			name: 'Salon Obsessions The Weave Institute',
			address1: '1907 Seminary Rd.',
			city: 'Silver Spring',
			state: 'MD',
			zip: '20910',
			country: 'USA',
			owner: 'Barbara Spumanto',
			phone: '(301) 641-0171',
			url: 'http://www.salonobsessions.com/index.html',
			createdBy: this.userId,
			createdAt: new Date(now - 7 * 3600 * 1000)
		});
	
	Meteor.call('insertBiz', {	
			name: 'Urban Nature',
			address1: '1903 Seminary Rd.',
			city: 'Silver Spring',
			state: 'MD',
			zip: '20910',
			country: 'USA',
			owner: 'Jessica Farncy',
			phone: '(301) 747-9090',
			createdBy: this.userId,
			createdAt: new Date(now - 7 * 3600 * 1000)
		});
	}


	// This does not run on server, and when run on client, it errors because of javascript in autovalue schema
	// if (! _.findWhere(Listings.find().fetch(), { name: "Arelis Hair Salon"}) ) {
	// 	Listings.insert({
	// 	name: 'Arelis Hair Salon',
	// 	address1: '8646 Colesville Rd',
	// 	city: 'Silver Spring',
	// 	state: 'MD',
	// 	zip: 20910,
	// 	country: 'USA',
	// 	url: 'http://arelisdominicanstyle.com/',
	// 	img: 'http://slideshow.hibustudio.com/sliders/2015/9/56146098e4b002e5546e9ef6/5.2015_280_0_0_27.jpg',
	// 	phone: '3014953771',
	// 	owner: 'Eunice Jackson',
	// 	createdBy: this.userId,
	// 	});
	// } else {
	// 	console.log("-= INSERT FAILED: Duplicate =-")
	// }
} else {
	console.log("-= Listings: Seeded =-");
} 
