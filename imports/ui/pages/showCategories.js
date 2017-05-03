import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';


import './showCategories.html';


Template.showCategories.helpers({
  catName: function() {
    return Router.current().params.name;
  },
  getImage: function(url, id) {
    // getOGS(url);
    // Meteor.call('convertImage', url);
    Meteor.call('getOG', url, id);
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

    // $("img").error(function() { 
    //   // $(this).hide();
    //     $("img").each(function() {
    //       $(this).attr("src", $(this).attr("src").replace("http://", "https://")).error(function() {
    //         $(this).css({visibility:"hidden"});
    //       });
    //     });
    // });


      $("img").error(function() { 
        try {
          $(this).attr("src").replace("http://", "https://");
          console.log('broken');
        }
        catch {
          $(this).css({visibility:"hidden"});
          console.log('still broken');

        }
      });

  });
});

Template.showCategories.events({
  'click .get-reviews' : function(evt,tpl) {
    Meteor.call('submitPlace',tpl.data);
  }
})