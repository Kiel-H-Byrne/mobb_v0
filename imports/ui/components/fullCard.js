import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullCard.html';

Template.fullCard.helpers({
  isOwner: function() {
    let test = Meteor.user()._id === this.creator;
    console.log(test);
    return test;
  }
});