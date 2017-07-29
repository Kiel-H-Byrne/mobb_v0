import './listCard.html';

Template.listCard.onRendered( function () {
  $(document).ready(function() {
    $(".button-collapse_fav").sideNav({
      closeOnClick: true,
      draggable: true
    });
    $(".button-collapse_near").sideNav({
      closeOnClick: true,
      draggable: true
    });
  });
});