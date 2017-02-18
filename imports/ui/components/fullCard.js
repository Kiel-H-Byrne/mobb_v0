import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullCard.html';

Template.fullCard.helpers({
  isOwner: function() {
    if (Meteor.user()) {
      let test = Meteor.user()._id === this.creator;
      // console.log(test);
      return test;
    }
  }
});

Template.fullCard.onRendered(function() {
  $(document).ready(function() {
    $('.editModal-trigger').leanModal();
  });
});