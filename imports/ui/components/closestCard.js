
import './closestCard.html';
import 'animate.css/animate.min.css';



Template.closestCard.onRendered(function () {
  $(document).ready(function () {
    $('.share-drop').dropdown();
  });
});

Template.closestCard.helpers({
  label(label) {
    const string = label;
    return string;
  }
});

Template.closestCard.events({
	'click [id="card_closest"]': function(event,templateInstance) {
    Session.set('openListing', this._id);
    $('.button-collapse').sideNav('show');
	},
  'click #edit_button': function(event,templateInstance) {
    //open modal verify form.
    $('#modalEdit').modal('open');
    $('.collapsible').collapsible();
  }
});