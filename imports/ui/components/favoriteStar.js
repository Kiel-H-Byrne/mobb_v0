
import './favoriteStar.html';

Template.favoriteStar.events({
  'click .add_favorite': function(event,templateInstance) {
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.user()._id;
      // Meteor.user().profile.favorites.push(id);
      Meteor.users.update({
        _id: userId
      },{
        $addToSet: {"profile.favorites" : docId}
      });
    } else {
      Materialize.toast('Log In Before Adding Favorites', 4000, 'myToast');
    }
  },
  'click .remove_favorite': function(event,templateInstance) {
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.user()._id;
      Meteor.users.update({
        _id: userId
      },{
        $pull: {"profile.favorites" : docId}
      });
    }
  }
});


Template.favoriteStar.helpers({
  in_favorites: function () {
    //if id matches in favorites array, return true.
    let id = this._id;
    if (Meteor.user()) {
      let favArray = Meteor.user().profile.favorites;
      // console.log(favArray);
      let inArray = !_.isEmpty(_.where(favArray, id));
      return inArray;
    } else {
      return false;
    }
  }
});