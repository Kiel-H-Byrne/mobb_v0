Schema = {};


//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================
//==============================================  DON'T TOUCH ME!!!!!!!!! ==============================================
//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================
Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schema.Profile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    // roles: {
    //     type: Object,
    //     optional: true,
    //     blackbox: true
    // },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});
//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================
//========================================================================================================================================



Schema.Profile = new SimpleSchema({
  firstName: {
      type: String,
      label: 'First Name',
      optional: true
  },
  lastName: {
      type: String,
      label: 'Last Name',
      optional: true
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  social: {
    type: Object,
    optional: true,
    label: 'Social Media'
  },
  'social.facebook': {
    type: String,
    optional: true,
    label: 'Facebook Handle'
  },
  'social.instagram': {
    type: String,
    optional: true,
    label: 'Instagram Handle'
  },
  'social.twitter': {
    type: String,
    optional: true,
    label: 'Twitter Handle'
  },
  listingIDs: {
    type: [String],
    optional: true
  }
});

Schema.Owner = new SimpleSchema({
  "owner.$.id": {
    type: String,
    optional: true,
    autoValue: function() {
      if (Meteor.userId()) {
        return Meteor.userId();
      }
    }
  },
  "owner.$.name": {
    type: String,
    label: "Owner's Name",
    optional: true
  },
  "owner.$.phone": {
    type: String,
    label: "Owner's Phone",
    optional: true
  },
  "owner.$.email": {
    type: String,
    label: "Owner's E-mail",
    optional: true
  }
});


Schema.Verifier = new SimpleSchema({
  "verifier.$.id": {
    type: String,
    optional: true,
    autoValue: function() {
      if (Meteor.userId()) {
        return Meteor.userId();
      }
    }
  },
  "verifier.$.name": {
    type: String,
    optional: true
  },
  "verifier.$.date": {
    type: Date,
    optional: true,
    autoValue: function() {
      return new Date();
    }
  }
});

Schema.Social = new SimpleSchema({
  facebook: {
    type: String,
    optional: true,
    label: 'Facebook Handle'
  },
    instagram: {
    type: String,
    optional: true,
    label: 'Instagram Handle'
  },
    twitter: {
    type: String,
    optional: true,
    label: 'Twitter Handle'
  }
});

Schema.Listings = new SimpleSchema({

  // We use `label` to put a custom label for this form field
  // Otherwise it would default to `Title`
  // 'optional: false' means that this field is required
  // If it's blank, the form won't submit and you'll get a red error message
  // 'type' is where you can set the expected data type for the 'title' key's value
  name: {
    type: String,
    unique: true
  },
  street: {
    type: String,
    max: 80
  },
  city: {
    type: String,
    optional: true,
    max: 50
  },
  state: {
    type: String,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afQuickField: {
        firstOption: "--"
      }
    }
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
    optional: true
  },
  country: {
    type: String,
    min: 2,
    max: 3,
    optional: true,
    defaultValue: 'US'
  },
  phone: {
    type: String,
    label: 'Phone Number',
    max: 13,
    optional: true,
    autoValue: function() {
      if (this.value) {
        let removedText = this.value.replace(/\D/, '');
        this.value = removedText;
       return removedText;
     }
    }
  },
  url: {
    type: String,
    unique: true,
    label: 'Website',
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    // autoValue: function () {
    //   //if string starts with "http//" or https://", Ok, else prepend with "http://"
    //   let url = this.value;
    //   if (url && (url.includes("http://") || url.includes("https://"))) {
    //     return url;
    //   } else {
    //     url = "http://" + url;
    //     return url;
    //   };
    // }
  },
  owner: {
    type: Schema.Owner,
    optional: true
  },
  claims: {
    type: [Schema.Owner],
    optional: true
  },
  "claims.$": {
    type: Schema.Owner,
    optional: true
  },
  claimCount: {
    type: Number,
    optional: true,
    autoValue: function() {
      if (this.field("claims").value) {
        return this.field("claims").value.length;
      }
    }
  },
  verifiers: {
    type: [Schema.Verifier],
    optional: true
  },
  verifierCount: {
    type: Number,
    optional: true,
    autoValue: function() {
      if (this.field("verifiers").value) {
        return this.field("verifiers").value.length;
      }
    }
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
    max: 2000,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 7
      }
    }
  },
  image: orion.attribute('file', {
    label: 'Upload an Image',
    optional: true
  }),
  google_id: {
    label: 'Google ID',
    type: String,
    optional: true,
    // autoValue: function () {
      
    // }
  },
  yelp_id: {
    label: 'Yelp ID',
    type: String,
    optional: true,
    // autoValue: function () {
      
    // }
  },
  cbenum: {
    type: String,
    label: 'CBE #',
    optional: true
  },
  certs: {
    type: String,
    label: 'CBE Certifications',
    optional: true
  },
  email: {
    type: String,
    label: 'E-Mail',
    optional: true
  },
  expdate: {
    type: String,
    label: 'Expiration Date',
    optional: true
  },
  location: {
    type: String,
    optional: true,
    autoValue: function () {
      let street = this.field("street").value;
      // console.log(tester);
      if ( street && (this.isInsert || this.isUpdate)) {
        const params = {};
        // console.log(this.docId);
        // console.log(this);
        // params.place_id = this.field("google_id").value;
        params.street = this.field("street").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        const response = Meteor.call('geoCode', params);

        if (response && response.results.length) {
          const loc = response.results[0].geometry.location;
          // console.log("GOOGLE TYPES:") ;
          // console.log(response.results[0].types);
          // this.field("google_id").value = place_id;
          //====== RETURN LAT/LONG OBJECT LITERAL ======
          // return loc;
          //====== RETURN STRINGIFIED LAT/LONG NUMBERS ======
          const arr =  _.values(loc);
          // console.log(arr.toLocaleString());
          return arr.toLocaleString();
        } else {
          // console.log(response);
          //no street name, so must be online Only. 
          //set category to "Online"
          // console.log(typeof street);
          // console.log(this.docId);
          this.unset();
        }
      }
    }
  },
  categories: {
    type: [String],
    label: 'Categories',
    optional: true,
    // custom: function () {
      // I WANT TO PUSH THE CATEGORY "ONLINE ONLY" TO THIS ARRAY
      //$set function on this key??
    // },
    // autoform: {
      // options: function () {
      //   return Categories.find().map(function(c) {
      //     return {label: c.name, value: c.name};
      //   });
      // },
    //   afFieldInput: {
    //     type: "select-checkbox",
    //     class: "category-option"
    //   }
    // }
  },
  social: {
    type: Schema.Social,
    optional: true,
    label: 'Social Media'
},
  creator: orion.attribute('createdBy'),
  submitted: orion.attribute('createdAt'),
});

