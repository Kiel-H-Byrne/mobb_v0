import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './shareListing.html';


Template.shareListing.onRendered( function () {
  $(document).ready(function () {
    $('.share-drop').dropdown({
      // inDuration: 200,
      stopPropagation: true,
      gutter: 0,
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
  });
});