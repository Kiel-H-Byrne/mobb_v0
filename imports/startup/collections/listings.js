
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
      },
      orion.attributeColumn('file', 'image', 'Image'),
      { 
        data: "categories", 
        title: "Categories" 
      },{ 
        data: "upVoteCount", 
        title: "Up Votes" 
      },{ 
        data: "dnVoteCount", 
        title: "Down Votes" 
      },
      orion.attributeColumn('createdBy', 'creator', 'Created By'),
      orion.attributeColumn('createdAt', 'submitted', 'Created @'), 
    ]
  }
});

Votes = new orion.collection('votes', {
  singularName: 'Vote', // The name of one of these items
  pluralName: 'Votes', // The name of more than one of these items
  link: { title: 'Votes' },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    columns: [
          orion.attributeColumn('createdBy', 'creator', 'Voted By'),
          orion.attributeColumn('createdAt', 'voted', 'Voted @'),
          {
            data: "comment",
            title: "Comment"
          }
        ]
      }
});

//=================== SCHEMAS =========================
// https://github.com/aldeed/meteor-simple-schema
// const catArray = ["Agriculture, Fishing, Forestry","Apparel & Accessories","Automotive Services","Business Services","Family & Community","Building & Construction","Education","Entertainment & Media","Finance & Legal","Food & Dining","Health & Medicine","Home & Garden","Industrial Supplies & Services","Information Technology","Personal Care & Beauty","Real Estate & Insurance","Retail","Online Only","Sole Proprietor","Female Owned","Owner Under 21","Operating Over 10","Operating over 20","Operating over 50","Travel & Transportation","Lodging","Sports & Recreation","Boutique","Haberdashery","Wholesale"];

const catObjs = [{"label":"Agriculture, Fishing, Forestry","value":"Agriculture, Fishing, Forestry"},{"label":"Apparel & Accessories","value":"Apparel & Accessories"},{"label":"Automotive Services","value":"Automotive Services"},{"label":"Business Services","value":"Business Services"},{"label":"Family & Community","value":"Family & Community"},{"label":"Building & Construction","value":"Building & Construction"},{"label":"Education","value":"Education"},{"label":"Entertainment & Media","value":"Entertainment & Media"},{"label":"Finance & Legal","value":"Finance & Legal"},{"label":"Food & Dining","value":"Food & Dining"},{"label":"Health & Medicine","value":"Health & Medicine"},{"label":"Home & Garden","value":"Home & Garden"},{"label":"Industrial Supplies & Services","value":"Industrial Supplies & Services"},{"label":"Information Technology","value":"Information Technology"},{"label":"Personal Care & Beauty","value":"Personal Care & Beauty"},{"label":"Real Estate & Insurance","value":"Real Estate & Insurance"},{"label":"Retail","value":"Retail"},{"label":"Online Only","value":"Online Only"},{"label":"Sole Proprietor","value":"Sole Proprietor"},{"label":"Female Owned","value":"Female Owned"},{"label":"Owner Under 21","value":"wner Under 21"},{"label":"Operating Over 10","value":"Operating Over 10"},{"label":"Operating over 20","value":"Operating over 20"},{"label":"Operating over 50","value":"Operating over 50"},{"label":"Travel & Transportation","value":"Travel & Transportation"},{"label":"Lodging","value":"Lodging"},{"label":"Sports & Recreation","value":"Sports & Recreation"},{"label":"Boutique","value":"Boutique"},{"label":"Haberdashery","value":"Haberdashery"},{"label":"Wholesale","value":"Wholesale"}];

const VoteSchema = new SimpleSchema({
  voter: orion.attribute('createdBy'),
  // date: orion.attribute('createdAt'),
  comment: {
    type: String,
    min: 5,
    max: 140,
    optional: true
  }
});

Votes.attachSchema(VoteSchema);

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
    // regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afFieldInput: {
        firstOption: "(Select a State)"
      }
    }
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
  phone: {
    type: String,
    max: 15,
    optional: true
  },
  url: {
    type: String,
    unique: true,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  owner: {
    type: String,
    optional: true
  },
  image: orion.attribute('file', {
    label: 'Image',
    optional: true
  }),
  location: {
    type: String,
    optional: true,
    autoValue: function() {
      if (Meteor.isServer && this.isInsert && !this.isSet) {
        let params = {};
        // console.log(this.docId);
        // console.log(this);
        params.street = this.field("street").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        let response = Meteor.call('geoCode', params);
        // console.log(response);
        if (response) {
          return response;
        } else {
          this.unset();
        }
      }
    }
  },
  // "location.lat": {
  //   type: Number,
  //   autoValue: function() {
  //     if (Meteor.isServer && this.isInsert) {
  //       let val = this.value;
  //       return Number(val);
  //     }
  //   }
  // },
  // "location.lng": {
  //   type: Number,
  //   autoValue: function() {
  //     if (Meteor.isServer && this.isInsert) {
  //       let val = this.value;
  //       return Number(val);
  //     }
  //   }
  // }, 
  categories: {
    type: [String],
    optional: true,
    // allowedValues: catArray,
    autoform: {
      type: "select-checkbox-inline",
      options: function () {
        return catObjs;
      }
    }
  },
  //subschema of up/downvotes and userId, timestamp, 
  upVotes: {
    type: [Object],
    optional: true
  },
  'upVotes.$': {
    type: VoteSchema
  },
  upVoteCount: {
    type: Number,
    optional: true,
    autoValue: function() {
      let count = 0;
      let exists = this.field("upVotes").value;
      if (exists) {count = exists.length;}
      return count;
    }
  },
  dnVotes: {
    type: [Object],
    optional: true
  },
  'dnVotes.$': {
    type: VoteSchema
  },
  dnVoteCount: {
    type: Number,
    optional: true,
    autoValue: function() {
      let count = 0;
      let exists = this.field("dnVotes").value;
      if (exists) {count = exists.length;}
      return count;
    }
  },  
  creator: orion.attribute('createdBy'),
  submitted: orion.attribute('createdAt'),
}));


//=================== COLLECTION SECURITY =========================

Listings.allow({

  // only allow insertion if you are logged in
  insert: function(userId, doc) { return !! userId;},
  update: function(userId, doc) { return true; },
  remove: function(userId, doc) { return false; },
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




export default Listings;
