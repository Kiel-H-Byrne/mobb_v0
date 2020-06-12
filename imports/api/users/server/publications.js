Meteor.publish("userData", function () {
  // console.log("-= PUBLISHING: USER DATA  =-");
  return Meteor.users.find({
    _id: this.userId
  },{
    fields: {
      'profile': 1, 
      'roles': 1, 
      // 'services.facebook': 1,
      // 'services.google': 1
    }
  });
});