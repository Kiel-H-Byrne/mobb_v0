
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
        data: "street", 
        title: "Street" 
      },{ 
        data: "address2", 
        title: "Address2" 
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
        data: "phone", 
        title: "Phone" 
      },{ 
        data: "url", 
        title: "URL" 
      },{ 
        data: "owner", 
        title: "Owner" 
      },{ 
        data: "location", 
        title: "Location" 
      },{ 
        data: "img", 
        title: "Image" 
      },{ 
        data: "categories", 
        title: "Categories" 
      },{
        data: "createdBy", 
        title: "Created By",
        orion.attributeColumn(createdBy, createdBy, 'Created By')
      },{ 
        data: "createdAt", 
        title: "Created @",
        orion.attributeColumn(createdAt, createdAt, 'Created @') 
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

// Listings.allow({
//   insert: function (userId, doc) {
//     // the user must be logged in, and the document must be owned by the user
//     return (userId && doc.owner === userId);
//   },
//   update: function (userId, doc, fields, modifier) {
//     // can only change your own documents
//     return doc.owner === userId;
//   },
//   remove: function (userId, doc) {
//     // can only remove your own documents
//     return doc.owner === userId;
//   },
//   // fetch: ['owner']
// });
// Listings.deny({
//   update: function (userId, doc, fields, modifier) {
//     // can't change owners
//     return _.contains(fields, 'owner');
//   },
//   remove: function (userId, doc) {
//     // can't remove locked documents
//     return doc.locked;
//   },
//   // fetch: ['locked'] // no need to fetch 'owner'
// });


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
    unique: true
  },
  owner: {
    type: String,
    optional: true
  },
  location: {
    type: String,
    optional: true,
    autoValue: function() {
      if (this.isInsert && !this.isSet) {
        let params = {};
        // console.log(this.docId);
        // console.log(this);
        params.street = this.field("street").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        let response = Meteor.call('geoCode', params);
        // console.log(response);
        if (response) {
          // console.log("-= LOCATION: FOUND! =-");
          return response;
        } else {
          return;
          // console.log("-= LOCATION: DNE =-");
        }
      }
    }
  },
  street: {
    type: String,
    max: 50
  },
  address2: {
    type: String,
    max: 50,
    optional: true
  },  
  city: {
    type: String,
    max: 50
  },
  state: {
    type: String,
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode
  },
  country: {
    type: String,
    min: 2,
    max: 3,
    optional: true,
    autoValue: function() {
      return "USA";
    }
  },
  url: {
    type: String,
    unique: true,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url,
    optional: true
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
  categories: {
    type: [String],
    optional: true,
    autoform: {
      disabled: true,
      label: false
    },
  },
  createdAt: orion.attribute('createdAt'),
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
