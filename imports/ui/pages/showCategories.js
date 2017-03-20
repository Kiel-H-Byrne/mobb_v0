import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './showCategories.html';


Template.showCategories.helpers({
  catName: function() {
    return Router.current().params.name;
  }
});


Template.showCategories.onRendered(function() {
  $(document).ready(function() {
    $('.editModal-trigger').modal();
   
    let msnry = new Masonry('.categoryFlex', {
     itemSelector: '.categoryFlex_item',
     columnWidth: '.categoryFlex_item',
    });

  });
});
