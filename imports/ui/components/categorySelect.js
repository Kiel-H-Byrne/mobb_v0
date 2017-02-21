import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import Categories from '/imports/startup/collections/categories';

import './categorySelect.html';


Template.catSelect.onRendered(function() {
  $(document).ready(function() {
    $('.dropdown-button').dropdown({
      // inDuration: 200,
      // outDuration: 225,
      // constrain_width: false, // Does not change width of dropdown to that of the activator
      // hover: false, // Activate on hover
      // gutter: 3, // Spacing from edge
      // belowOrigin: true, // Displays dropdown below the button
      // alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  });
});

Template.catSelect.onCreated(function() {
  this.subscribe('categories');
});

Template.catSelect.helpers({
  categories: function() {
    let categories = Categories.find();
    return categories;
  }
});


// Template.catSelect.helpers({
//   get_categories: function() {
//     var results = [];

//     var mapChildren = function(category, level) {
//       // add the appropriate number of dashes before each name
//       var prefix = Array(2 * level).join('--');
//       results.push({_id: category._id, name: prefix + category.name});

//       // repeat for each child category
//       var children = Categories.find({parentID: category._id}).fetch();
//       _.each(children, function(c) {
//         // make sure to increment the level for the correct prefix
//         mapChildren(c, level + 1);
//       });
//     };

//     // map each of the root categories - I'm unsure if the parent
//     // selector is correct or if it should be {parentId: {$exists: false}}
//     _.each(Categories.find({parentID: ''}).fetch(), function(c) {
//       mapChildren(c, 0);
//     });

//     // results should be an array of objects like {_id: String, name: String}
    
//     // let cursor = Session.get('categories');
//     // let cursor = Categories.find({});
//     return results;
//   },
// });