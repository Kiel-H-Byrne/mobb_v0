
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
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    const locArr = this.location.split(",");
    let locObj = {'lat': Number(locArr[0]), 'lng': Number(locArr[1]) };
    map.instance.panTo(locObj);
    $('.button-collapse').sideNav('show');
	},
  'click #edit_button': function(event,templateInstance) {
    //open modal verify form.
    $('#modalEdit').modal('open');
    $('.collapsible').collapsible();
  }
});