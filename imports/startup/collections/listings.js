//=================== NEW COLLECTION =========================

Listings = new orion.collection('listings', {
  singularName: 'listing', // The name of one of these items
  pluralName: 'listings', // The name of more than one of these items
  link: { title: 'Listings' },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "name", 
        title: "Name" 
      },{ 
        data: "owner", 
        title: "Owner" 
      },{ 
        data: "loc", 
        title: "Location" 
      },{ 
        data: "address1", 
        title: "Address" 
      },{ 
        data: "address2", 
        title: "Address2" 
      },{ 
        data: "address3", 
        title: "Address3" 
      },{ 
        data: "city", 
        title: "City" 
      },{ 
        data: "state", 
        title: "State" 
      },{ 
        data: "zip", 
        title: "Zip" 
      },{ 
        data: "country", 
        title: "Country" 
      },{ 
        data: "url", 
        title: "URL" 
      },{ 
        data: "img", 
        title: "Image" 
      },{ 
        data: "phone", 
        title: "Phone" 
      },{
        data: "createdBy", 
        title: "Created By" 
      },{ 
        data: "createdAt", 
        title: "Created @" 
      },
    ]
  }
});

//=================== COLLECTION SECURITY =========================

Listings.allow({
  // update: function(userId, post) { return ownsDocument(userId, post); },
  // remove: function(userId, post) { return ownsDocument(userId, post); },
});

//=================== SCHEMAS =========================
// https://github.com/aldeed/meteor-simple-schema

Listings.attachSchema(new SimpleSchema({

  // We use `label` to put a custom label for this form field
  // Otherwise it would default to `Title`
  // 'optional: false' means that this field is required
  // If it's blank, the form won't submit and you'll get a red error message
  // 'type' is where you can set the expected data type for the 'title' key's value
  name: {
    type: String,
    optional: false,
    unique: true,
  },
  address1: {
    type: String,
    max: 20,
    optional: false
  },
  address2: {
    type: String,
    max: 20,
    optional: true
  },
  address3: {
    type: String,
    max: 20,
    optional: true,
  },    
  city: {
    type: String,
    max: 50,
    optional: false
  },
  state: {
    type: String,
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/,
    optional: false
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/,
    optional: false
  },
  country: {
    type: String,
    max: 3
  },
  url: {
    type: String,
    unique: true,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url
    // custom: function () {
    //   if (Meteor.isClient && this.isSet) {
    //     Meteor.call("postWithSameLink", this.value, function (error, result) {
    //       if (!result) {
    //         Listings.simpleSchema().namedContext("postSubmitForm").addInvalidKeys([{name: "url", type: "notUnique"}]);
    //       }
    //     });
    //   }
    // }
  },
  phone: {
    type: String,
    max: 15
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  createdBy:{
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    index: 1,
    autoValue: function(){
      if ( this.userId && this.isInsert ) {
        return this.userId;
      }
    }
  }
}));


export default Listings;
