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
  'click img': function(event,templateInstance) {
    console.log(templateInstance)
      // Session.set('openListing', doc._id );
      console.log(this.data, this.view.data);
      $('.button-collapse').sideNav('show');
  }
});