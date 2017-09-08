import './sideCard.html'

Template.sideCard.onRendered( function () {
  $(document).ready(function() {
    $('.button-collapse').sideNav({
      edge: 'left',
      closeOnClick: true,
      draggable: true
    });
  });
});