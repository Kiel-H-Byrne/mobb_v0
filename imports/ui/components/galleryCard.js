import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './galleryCard.html';

Template.galleryCard.helpers({
  hasImage: function() {
    // console.log(typeof this.image.url);
    if (this.image) {
      if (this.image.url !== "false") {
        return true; 
      } else {
        return false;
      }
    }
  }
});

import './fullCard.html';

Template.fullCard.helpers({
  hasImage: function() {
    // console.log(typeof this.image.url);
    if (this.image && (this.image.url !== "false")) {
      return true; 
    } else {
      return false;
    }
  }
});