import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './corner-ribbon.html';


Template.cornerRibbon.helpers({
  label() {
    const string = 'BETA';
    return string;
  },
});
