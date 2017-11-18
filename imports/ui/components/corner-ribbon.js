import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './corner-ribbon.html';


Template.cornerRibbon.helpers({
  label(label) {
    const string = label;
    return string;
  },
});
