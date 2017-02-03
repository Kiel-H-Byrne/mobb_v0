import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './terms.html';

Template.terms.onRendered(function() {

  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
});