
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
        data: "location", 
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

  // only allow insertion if you are logged in
  insert: function(userId, doc) { return !! userId;},
  update: function(userId, doc) { return ownsDocument(userId, doc); },
  remove: function(userId, doc) { return ownsDocument(userId, doc); },
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
  owner: {
    type: String,
    optional: true,
  },
  location: {
    type: String,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        let params = {};
        // console.log(this.docId);
        console.log(this);
        params.address1 = this.field("address1").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        let response = Meteor.call('geoCode', params);
        // console.log(response);
        if (response) {
          console.log("-= LOCATION: FOUND! =-");
          return response;
        } else {console.log("-= LOCATION: DNE =-");}
      }
    }
  },
  address1: {
    type: String,
    max: 50,
    optional: false
  },
  address2: {
    type: String,
    max: 50,
    optional: true
  },
  address3: {
    type: String,
    max: 50,
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
    regEx: SimpleSchema.RegEx.ZipCode,
    optional: false
  },
  country: {
    type: String,
    max: 3,
    optional: true
  },
  url: {
    type: String,
    unique: true,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url,
    optional: true
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
  image: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  phone: {
    type: String,
    max: 15,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date(now - 7 * 3600 * 1000)};
      } else {
        this.unset();
      }
    }
  },
  createdBy: orion.attribute('createdBy'),
  // createdBy:{
  //   type: String,
  //   optional: true,
  //   index: 1,
  //   regEx: SimpleSchema.RegEx.Id,
  //   autoValue: function(){
  //     if ( this.userId && this.isInsert ) {
  //       return this.userId;
  //     }
  //   }
  // }
}));


export default Listings;
