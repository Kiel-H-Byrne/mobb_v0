import './closestCard.html';


// Template.closestCard.onCreated(function () {
//   $(document).ready(function () {
//     console.log('new card created');
//   });
// });


Template.closestCard.onRendered(function () {
  $(document).ready(function () {
    const card = $("[id='card_closest']");
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
	'click #card_closest, touchend #card_closest': function(event,templateInstance) {
    Session.set('openListing', this._id);
    //PAN TO LOCATION ON MAP
    const map = GoogleMaps.maps[Object.keys(GoogleMaps.maps)[0]];
    const locArr = this.location.split(",");
    let locObj = { 'lat': Number(locArr[0]), 'lng': Number(locArr[1]) };
    map.instance.panTo(locObj);
    map.instance.setZoom(16);
    // SHOW SIDECARD
    $('.button-collapse').sideNav('show');
	},
  'click #card_closest button': function(event,templateInstance){ 
    event.stopPropagation();
    analytics.track("Got Directions", {
      userLocation: Session.get('clientLoc'),
      listingId: this._id,
      listingName: this.name
    });
    window.open(`https://www.google.com/maps/dir/Current+Location/${this.location}`);
  }
});
    analytics.track( "Listing Added", {
      userId: Meteor.userId(),
      listingId: self.insertDoc
    });
