import Categories from '/imports/startup/collections/categories';
import Listings from '/imports/startup/collections/listings';

import './mapFilter.html';

Template.mapFilter.onCreated(function () {
  this.subscribe('categories');
  this.subscribe('listings_locs');
});

Template.mapFilter.helpers({
  categories: function () {
    return Categories.find();
  },
  catCount: function(cat) {
    return Listings.find({categories: {$elemMatch: {$in: [ cat ]}}}).count();
  }
});

Template.mapFilter.events({
  'click .switch label': function(event,templateInstance) {
    event.preventDefault();
  },
  'click .main-switch': function(event,templateInstance) {
    event.stopPropagation();
    const el = $(event.currentTarget.firstElementChild.children[0]);
    if (el.prop('checked')) {
      el.prop('checked', false);
      //hide all markers
    } else {
      el.prop('checked', true);
      //show all markers
    }
  },
  'click .cat_item .switch': function(event,templateInstance) {
    // event.preventDefault();
    event.stopPropagation();

    const el = $(event.currentTarget.firstElementChild.children[0]);
    if (el.prop('checked')) {
      el.prop('checked', false);
      el.css('background-color', '#e34');
    } else {
      el.prop('checked', true);
      el.css('background-color', '#3af');
    }

    if (event.currentTarget.title) {
      //make sure this runs only once!
      toggleGroup(event.currentTarget.title);
      // $('.dropdown-button').dropdown('close');
    }

  }
});