import './closestCard.html';


// Template.closestCard.onCreated(function () {
//   $(document).ready(function () {
//     console.log('new card created');
//   });
// });


Template.closestCard.onRendered(function () {
  $(document).ready(function () {
    let card = $("[id='card_closest']");
    card.toggleClass('bounceIn');
  });
});

Template.closestCard.helpers({
  label(label) {
    const string = label;
    return string;
  }
});

Template.closestCard.events({
	'click [id="card_closest"], touchend [id="card_closest"]': function(event,templateInstance) {
    Session.set('openListing', this._id);
    //PAN TO LOCATION ON MAP
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    const locArr = this.location.split(",");
    let locObj = { 'lat': Number(locArr[0]), 'lng': Number(locArr[1]) };
    map.instance.panTo(locObj);
    map.instance.setZoom(16);
    // SHOW SIDECARD
    $('.button-collapse').sideNav('show');
	}
});

