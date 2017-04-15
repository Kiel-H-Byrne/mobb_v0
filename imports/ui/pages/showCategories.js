import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './showCategories.html';


Template.showCategories.helpers({
  catName: function() {
    return Router.current().params.name;
  },
});


Template.showCategories.onRendered(function() {
  $(document).ready(function() {
    $('.editModal-trigger').modal();
   
    let msnry = new Masonry('.categoryFlex', {
     itemSelector: '.categoryFlex_item',
     columnWidth: '.categoryFlex_item',
    });

    imagesLoaded( 'categoryFlex_item', function() {
      msnry.layout();
    });

  });
});

Template.showCategories.events({
  'click .get-reviews' : function(evt,tpl) {
    Meteor.call('submitPlace',tpl.data);
  }
})