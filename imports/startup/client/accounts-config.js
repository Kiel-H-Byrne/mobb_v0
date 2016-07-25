import { Meteor  } from  'meteor/meteor';
// import { Roles } from  'meteor/orionjs:core';

const kielId = Accounts.createUser({
    profile: {
      name: 'Kiel',
    },
    username: "khb",
    email: "khb@iam.com",
    password: "password",
  });

const kiel = Meteor.users.findOne(kielId);

// Roles.addUserToRoles( kiel , ["admin"] );

// export kiel;
