import './verifyUI.html';

Template.verifyUI.events({
  'click .upVote': function(event,templateInstance) {
    event.stopPropagation();
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      Meteor.users.update({
        _id: userId
      },{
        $addToSet: {"profile.verifiedListings" : docId}
      });
    } else {
      Materialize.toast('Log In Before Adding Favorites', 3000, 'myToast');
    }
  },
  'click .downVote': function(event,templateInstance) {
    event.stopPropagation();
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      Meteor.users.update({
        _id: userId
      },{
        $pull: {"profile.verifiedListings" : docId}
      });
    }
  }
});


Template.verifyUI.helpers({
  in_favorites: function () {
    //if id matches in verifiedListings array, return true.
    let id = this._id;
    if (Meteor.user()) {
      let favArray = Meteor.user().profile.verifiedListings;
      // console.log(favArray);
      let inArray = !_.isEmpty(_.where(favArray, id));
      return inArray;
    } else {
      return false;
    }
  }
});