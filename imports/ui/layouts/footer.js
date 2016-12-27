import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './footer.html';

Template.footer.events({
  // 'click .terms': function () {
  //   Router.go('/terms');
  // },
  // 'click .privacy': function () {
  //   Router.go('/terms#PrivacyPolicy');
  // },
});

