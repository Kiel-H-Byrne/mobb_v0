import './showCategories.html';


Template.showCategories.helpers({
  catName: function () {
    return Router.current().params.name;
  },
});


Template.showCategories.onRendered(function () {
  $(document).ready(function () {
    $("[id='card_closest']").toggleClass('bounceIn bounceOut');
    $('.editModal-trigger').modal();

      const $mgrid = $('.masonry_grid').masonry({
        // options
        itemSelector: '.masonry_item',
        columnWidth: '.masonry_item'
      });

      $mgrid.imagesLoaded().progress( function() {
        $mgrid.masonry('layout');
      });

    $('img').on('error', function () {
      // console.log("on broken image", this);
      $(this).css({display:"none"});

    });


  });
});
