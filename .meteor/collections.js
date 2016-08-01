import './listings.js';


if (Listings.find().count() === 0) {
var now = new Date().getTime();
  // create two listings

Listings.insert({
			name: 'Arelis Hair Salon',
			address1: '8646 Colesville Rd',
			city: 'Silver Spring',
			state: 'MD',
			zip: 20910,
			country: 'USA',
			url: 'http://arelisdominicanstyle.com/',
			img: 'http://slideshow.hibustudio.com/sliders/2015/9/56146098e4b002e5546e9ef6/5.2015_280_0_0_27.jpg',
			phone: 3014953771,
			owner: 'Eunice Jackson',
			createdBy: this.userId,
			createdAt: new Date(now - 7 * 3600 * 1000)
		});

Listings.insert({
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

Listings.insert({
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

// for each listing in Listings, call geocode API and upsert location. 
// console.log(Listings);
// _.each(Listings, function () {
// console.log (this.name);
// });

// let params = {};
// 		params.address1 = this.address1;
// 		params.city = this.city;
// 		params.zip = this.zip;
// let urlParams = jQuery.param(params);  
// let res = ReactiveMethod.call('geoCode', urlParams);