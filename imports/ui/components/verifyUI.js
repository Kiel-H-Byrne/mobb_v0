import './verifyUI.html';

Template.verifyUI.events({
  'click .verify': function(event,templateInstance) {
    event.stopPropagation();

    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      // Meteor.users.update({
      //   _id: userId
      // },{
      //   $addToSet: {"profile.verifiedListings" : docId}
      // });
      const updateDoc = {
        $addToSet: {
           verifiers: userId
        },
        $pull: {
          deverifiers: userId
        }
      };
      Meteor.call('editListing', docId, updateDoc);
      // Listings.update({
      //   _id: docId
      // },{
      //   $addToSet: {
      //      verifiers: userId
      //   },
      //   $pull: {
      //     deverifiers: userId
      //   }
      // });

      analytics.track( "Verified Listing", {
        category: "Listings",
        label: this.name,
        value: this._id
      });

      analytics.track( "Verified Listing", {
        category: "Listings",
        label: "User Id",
        value: userId
      });

    } else {
      Materialize.toast('Log In Before Verifying A Listing', 3000, 'myToast');
    }
  },
  'click .deverify': function(event,templateInstance) {
    event.stopPropagation();
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      // Meteor.users.update({
      //   _id: userId
      // },{
      //   $pull: {"profile.verifiedListings" : docId}
      // });
      const updateDoc = {
        $addToSet: {
           deverifiers: userId
        },
        $pull: {
          verifiers: userId
        }
      };
      Meteor.call('editListing', docId, updateDoc);

      // Listings.update({
      //   _id: docId
      // },{
      //   $addToSet: {
      //     deverifiers: userId
      //   },
      //   $pull: {
      //     verifiers: userId
      //   }
      // });

      analytics.track( "Untrusted Listing", {
        category: "Listings",
        label: this.name,
        value: this._id
      });

      analytics.track( "Untrusted Listing", {
        category: "Listings",
        label: "User Id",
        value: userId
      });
      
    } else {
      Materialize.toast('Log In Before Verifying A Listing', 3000, 'myToast');
    }
  },
  'click .verified': function(event,templateInstance) {
    event.stopPropagation();
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      // Meteor.users.update({
      //   _id: userId
      // },{
      //   $addToSet: {"profile.verifiedListings" : docId}
      // });
      const updateDoc = {
        $pull: {
           verifiers: userId
        }
      };
      Meteor.call('editListing', docId, updateDoc);

      // Listings.update({
      //   _id: docId
      // },{
      //   $pull: {
      //      verifiers: userId
      //   }
      // });
    } else {
      Materialize.toast('Log In Before Verifying A Listing', 3000, 'myToast');
    }
  },
  'click .deverified': function(event,templateInstance) {
    event.stopPropagation();
    if (Meteor.user()) {
      let docId = this._id;
      let userId = Meteor.userId();
      // Meteor.users.update({
      //   _id: userId
      // },{
      //   $pull: {"profile.verifiedListings" : docId}
      // });
      const updateDoc = {
        $pull: {
           deverifiers: userId
        }
      }
      Meteor.call('editListing', docId, updateDoc);
      // Listings.update({
      //   _id: docId
      // },{
      //   $pull: {
      //      deverifiers: userId
      //   }
      // });
    }
  }  
});


Template.verifyUI.helpers({
  in_verified: function () {
    //if id matches in verifiedListings array, return true.
    let id = this._id;
    let userId = Meteor.userId();
    let array = this.verifiers || [];
    if (Meteor.user() && array.length > 0) {
      // let array = Meteor.user().profile.verifiedListings;
      let inArray = !_.isEmpty(_.where(array, userId));
      return inArray;
    } else {
      return false;
    }
  },
  in_deverified: function() {
    let id = this._id;
    let userId = Meteor.userId();
    let array = this.deverifiers || [];
    if (Meteor.user() && array.length > 0) {
      // let array = Meteor.user().profile.deverifiedListings;
      let inArray = !_.isEmpty(_.where(array, userId));
      return inArray;
    } else {
      return false;
    }
  },
  verifiedCount: function() {
    let array = this.verifiers || [];
    let count = array.length;
    return count;
  }
});




// click .verify -> add userId to listing.verifiers, add listingID to profile.verified?, add class '.verified'; 
// click .verified -> remove userId from listing.verifiers; add class .verify;

// click .deverify -> add userId to listings.deverifiers
// click .deverified -> 