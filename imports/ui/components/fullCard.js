import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './fullCard.html';

Template.fullCard.onRendered(function() {
  $(document).ready(function() {
    $('.editModal-trigger').modal();
  });
});