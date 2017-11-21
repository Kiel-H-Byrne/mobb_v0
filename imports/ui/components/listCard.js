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
      event.stopPropagation();
      Session.set('openListing', this._id );
      $('.button-collapse').sideNav('show');
      $('.button-collapse_fav').sideNav('hide');
      $('.button-collapse_near').sideNav('hide');
  }
});