import './loginModal.html';

//when submit, close modal
Template.loginModal.onRendered(function() {
  Accounts.onLogin(function() {
    // $('#loginModal').modal('close');
    analytics.track( "User Login", {
      userId: Meteor.userId()
    });
  });
});
