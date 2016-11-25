import { Meteor } from 'meteor/meteor';
import Categories from '/imports/startup/collections/categories';

Meteor.publish('categories_all', function() {
	let cursor = Categories.find({title: { $exists : 1}});
	console.log("-= PUBLISHING: ALL ["+ cursor.count() +"] CATEGORIES WITH TITLES =-");
	return cursor;
});
