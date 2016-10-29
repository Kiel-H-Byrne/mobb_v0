import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import Categories from '/imports/startup/collections/categories.js';
import './categorySelect.html';

Template.categorySelect.onRendered(function() {

  let subscription = this.subscribe('categories_all', function() {
    console.log(Categories.find().fetch());
  });
})

Template.categorySelect.helpers({
  get_categories: function() {
    var results = [];

    var mapChildren = function(category, level) {
      // add the appropriate number of dashes before each name
      var prefix = Array(2 * level).join('--');
      results.push({_id: category._id, name: prefix + category.name});

      // repeat for each child category
      var children = Categories.find({parentID: category._id}).fetch();
      _.each(children, function(c) {
        // make sure to increment the level for the correct prefix
        mapChildren(c, level + 1);
      });
    };

    // map each of the root categories - I'm unsure if the parent
    // selector is correct or if it should be {parentId: {$exists: false}}
    _.each(Categories.find({parentID: ''}).fetch(), function(c) {
      mapChildren(c, 0);
    });

    // results should be an array of objects like {_id: String, name: String}
    return results;
  };
});