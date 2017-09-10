import './listCard.html';

Template.listCard.onRendered( function () {
  $(document).ready(function() {
    $(".button-collapse_fav").sideNav({
      edge: 'right',
      closeOnClick: true,
      draggable: true
    });
    $(".button-collapse_near").sideNav({
      edge: 'right',
      closeOnClick: true,
      draggable: true
    });
  });
});

Template.listCard.events({
  'click': function(event,templateInstance) {
      Session.set('openListing', this.data._id );
      $('.button-collapse').sideNav('show');
  }
});