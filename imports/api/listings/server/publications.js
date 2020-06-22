import Listings from '/imports/startup/collections/listings';

Meteor.publish('listings', function () {
	let cursor = Listings.find({});
	console.log("-= PUBLISHING ENTIRE COLLECTION: ["+ cursor.count() +"] =-");
	return cursor;
});

Meteor.publish('listings_one', function (id) {
	check(id, String);
	let cursor = Listings.find({_id: id});
	console.log(`-= PUBLISHING SINGLE LISTING: [${id}] =-`);
	return cursor;
});

Meteor.publish('listings_locs', function () {
	let cursor = Listings.find({
		location: { $exists : 1}
	});
	// console.log("-= PUBLISHING: ALL ["+ cursor.count() +"] LISTINGS WITH LOCATIONS =-");
	return cursor;
});

Meteor.publish('listings_category', function (categories) {
	check(categories, Array);
	return Listings.find({
      categories: {$in: categories}
    },{
      sort: {location: -1, name: 1}
    });
});

Meteor.publish('listings_urls', function () {
	let cursor = Listings.find({url: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] LISTINGS W/ URLS =-");
	return cursor;
});

Meteor.publish('listings_social', function () {
	let cursor = Listings.find({social: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] SOCIAL LISTINGS =-");
	return cursor;
});

Meteor.publish('listings_images', function () {
	let cursor = Listings.find({image: { $exists : 1}});
	console.log("-= PUBLISHING: ["+ cursor.count() +"] LISTINGS W/ IMAGES =-");
	return cursor;
});

Meteor.publish('listings_favorites', function () {
	if (Meteor.user() && Meteor.user().profile.favorites) {
		let arr = Meteor.user().profile.favorites;
	  let cursor = Listings.find({
	    _id : {$in : arr}
	  }, {
	    sort: {name: 1, location: -1 }
	  });

		// console.log("-= PUBLISHING: ["+ cursor.count() +"] FAVORITE LISTINGS =-");
		return cursor;
	}
});

Meteor.publish('listings_close', function (loc) {
	check(loc, Object);
	// console.log(loc);
	let lat = Number(loc.lat).slice(0,2);
	let lng = Number(loc.lng).slice(0,2);
	let rgxLat = new RegExp('^'+lat);
	// // let rgxLng = new RegExp('^'+lng);
	let cursor = Listings.find({ location: rgxLat });
	console.log("-= PUBLISHING: ["+ cursor.count() +"] AREA LISTINGS =-");
	console.log(cursor);
	return cursor;
});