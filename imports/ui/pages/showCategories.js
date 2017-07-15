

import './showCategories.html';


Template.showCategories.helpers({
  catName: function () {
    return Router.current().params.name;
  },
});


Template.showCategories.onRendered(function () {
  $(document).ready(function () {
    $('.editModal-trigger').modal();
   
    let msnry = new Masonry('.categoryFlex', {
     itemSelector: '.categoryFlex_item',
     columnWidth: '.categoryFlex_item',
    });

    imagesLoaded( '.categoryFlex_item', function () {
      msnry.layout();
    });

    // $("img").error(function () { 
    //   // $(this).hide();
    //     $("img").each(function () {
    //       $(this).attr("src", $(this).attr("src").replace("http://", "https://")).error(function () {
    //         $(this).css({visibility:"hidden"});
    //       });
    //     });
    // });


    //   $("img").error(function () { 
    // //       $(this)
    // //       .attr("src")
    // //       .replace("http://", "https://")

    // //       // console.log('broken', this);
    // //   })
    // // //   .delay(300)
    //   // .error(function () { 
    //   console.log("broken image", this);
    //   $(this)
    //   .css({visibility:"hidden"});
    //   // console.log('still broken', this);
    // });

    $('img').on('error', function () {
      console.log("on broken image", this);
      $(this).css({visibility:"hidden"});
      // if(!$(this).hasClass('broken-image')) {
      //   $(this).addClass('broken-image');
      // });
    });


  });
});

Template.showCategories.events({
  'click .get-reviews' : function(evt,tpl) {
    Meteor.call('submitPlace',tpl.data);
  }
});