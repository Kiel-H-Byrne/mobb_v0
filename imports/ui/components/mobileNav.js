import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './mobileNav.html';


Template.mobileNav.onRendered( function () {
  $(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.collapsible').collapsible();
  });
});