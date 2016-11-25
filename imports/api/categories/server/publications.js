import { Meteor } from 'meteor/meteor';
import Categories from '/imports/startup/collections/categories';

Meteor.publish('categories_all', function() {
	let cursor = Categories.find();
	console.log("-= PUBLISHING: ALL ["+ cursor.count() +"] CATEGORIES =-");
	return cursor;
});
