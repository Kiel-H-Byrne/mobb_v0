
// ======================== YELP v3 API =============================
const Yelp = require('yelp-fusion');
const yelp_client_id = Meteor.settings.public.keys.yelp.app_id;
const yelp_client_secret = Meteor.settings.public.keys.yelp.app_secret;
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
        data: "location", 
        title: "Location" 
      },{ 
        data: "onlineonly", 
        title: "Online Only?" 
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
        data: "social",
        title: "Social Media"
      },{ 
        data: "owner", 
        title: "Owner" 
      },{ 
        data: "ownphone", 
        title: "Owner Phone" 
      },{
        data: "description",
        title: "Description"
      },{ 
        data: "google_id", 
        title: "Google ID" 
      },{ 
        data: "yelp_id", 
        title: "Yelp ID" 
      },{ 
        data: "cbenum", 
        title: "CBE#" 
      },{ 
        data: "certs", 
        title: "Certs" 
      },{ 
        data: "expdate", 
        title: "CBE Expiration" 
      },
      orion.attributeColumn('file', 'image', 'Image'),
      { 
        data: "categories", 
        title: "Categories" 
      },{ 
        data: "upVotes", 
        title: "Up Votes" 
      },{ 
        data: "upVoteCount", 
        title: "Down Votes" 
      },{ 
        data: "dnVotes", 
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

if ( Meteor.isServer ) {
  Listings._ensureIndex( { name: 1, onlineonly: 1, city: 1 } );
}

// Votes = new orion.collection('votes', {
//   singularName: 'Vote', // The name of one of these items
//   pluralName: 'Votes', // The name of more than one of these items
//   link: { title: 'Votes' },
//   /**
//    * Tabular settings for this collection
//    */
//   tabular: {
//     columns: [
//           // orion.attributeColumn('createdBy', 'creator', 'Voted By'),
//           // orion.attributeColumn('createdAt', 'voted', 'Voted @'),
//           {
//             data: "comment",
//             title: "Comment"
//           }
//         ]
//       }
// });

//=================== SCHEMAS =========================
// https://github.com/aldeed/meteor-simple-schema
// const catArray = ["Agriculture, Fishing, Forestry","Apparel & Accessories","Automotive Services","Business Services","Family & Community","Building & Construction","Education","Entertainment & Media","Finance & Legal","Food & Dining","Health & Medicine","Home & Garden","Industrial Supplies & Services","Information Technology","Personal Care & Beauty","Real Estate & Insurance","Retail","Online Only","Sole Proprietor","Female Owned","Owner Under 21","Operating Over 10","Operating over 20","Operating over 50","Travel & Transportation","Lodging","Sports & Recreation","Boutique","Haberdashery","Wholesale"];
const catArray = ["Food & Beverage", "Nightlife", "Beautification", "Retail", "Entertainment", "Business Services", "Online Retail"];

const VoteSchema = new SimpleSchema({
  // voter: orion.attribute('createdBy'),
  // date: orion.attribute('createdAt'),
  comment: {
    type: String,
    min: 5,
    max: 140,
    optional: true, 
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  }
});

// Votes.attachSchema(VoteSchema);

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
    optional: true,
    max: 80
  },
  address2: {
    type: String,
    max: 50,
    optional: true
  },  
  city: {
    type: String,
    optional: true,
    max: 50
  },
  state: {
    type: String,
    optional: true,
    // regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afFieldInput: {
        firstOption: "(Select a State)"
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
    defaultValue: 'USA'
  },
  phone: {
    type: String,
    label: 'Phone Number',
    max: 15,
    optional: true
  },
  url: {
    type: String,
    unique: true,
    label: 'Website',
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  social: {
    type: String,
    optional: true,
    unique: true,
    label: 'Social Media'
  },
  owner: {
    type: String,
    label: 'Owner Name',
    optional: true
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
    max: 1300,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  image: orion.attribute('file', {
    label: 'Upload an Image',
    optional: true
  }),
  onlineonly: {
    label: 'Online Only?',
    type: Boolean,
    optional: true,
    autoValue: function() {
      if ( !this.field("street").value && this.field("url") ) {
        return true;
      } else {
        return false;
      }
    }
  },
  google_id: {
    label: 'Google ID',
    type: String,
    optional: true
  },
  yelp_id: {
    label: 'Yelp ID',
    type: String,
    optional: true,
    autoValue: function() {
      //do a yelp phone search using phone number, return value of call.
//       if ( this.field("phone").isSet && this.isInsert && !this.isSet) {
        
//         let phone = this.field("phone").value;
//         /////////////////// YELP PACKAGE
//         Yelp.accessToken(yelp_client_id, yelp_client_secret).then(response => {
//           const token = response.jsonBody.access_token;
//           const client = Yelp.client(token);
//           //then do search 
//           client.phoneSearch({
//             phone: phone
//           }).then(response => {
//             let biz = response.jsonBody.businesses[0];
//             // console.log(biz);
//             if (biz.id) {
//               console.log('biz id: '+ biz.id);
//               //set the yelp-id value for this _id document
//               return biz.id;

//               // return 'yelp-idz';
//             } else {
//               //no yelp id for this business.
//               console.log("no yelp ID Available");
//               // this.unset();
//             }
//           });


//           // let userId = getId;

//           // getId.then(function(res) {
//           //   console.log(res);
//           //   return res;
//           // })
//           //response = Yelp.client;
//           // console.log(rez);
//           // return rez;

//         }).catch(e => {

//           console.log(e);
//         });
//         /////////////////// YELP API
//         // Meteor.call('getYelpID', phone, function(err,res) {
//         //   if (res) {
//         //     console.log(res);
//         //   } else {
//         //     console.log(err);
//         //   }
//         // });
// ///////////////////////////////////////////////////////////////////////////////
//         // console.log(resp);
//         // return resp;
//         // return 'yelp-id';

//         // console.log(response);
//         // return response;
//       } else {
//         console.log("No Yelp-Id Assigned");
//       }
    }
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
  ownphone: {
    type: Number,
    label: 'Owner Phone',
    optional: true
  },
  location: {
    type: String,
    optional: true,
    autoValue: function() {
      let street = this.field("street").value;
      // console.log(tester);
      if ( street && this.isInsert && !this.isSet) {
        let params = {};
        // console.log(this.docId);
        // console.log(this);
        // params.place_id = this.field("google_id").value;
        params.street = this.field("street").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        let response = Meteor.call('geoCode', params);

        if (response && response.results.length) {
          let loc = response.results[0].geometry.location;
          // console.log("GOOGLE TYPES:") ;
          // console.log(response.results[0].types);
          // this.field("google_id").value = place_id;
          //====== RETURN LAT/LONG OBJECT LITERAL ======
          // return loc;
          //====== RETURN STRINGIFIED LAT/LONG NUMBERS ======
          let arr =  _.values(loc);
          // console.log(arr.toLocaleString());
          return arr.toLocaleString();
        } else {
          console.log(response);
          //no street name, so must be online Only. 
          //set category to "Online"
          // console.log(typeof street);
          // console.log(this.docId);
          // this.unset();
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
    label: 'Categories',
    optional: true,
    // allowedValues: catArray,
    autoform: {
      type: "select-checkbox-inline",
      options: function() {
//need to subscrib somehwere else, performane suffers here        
        // Meteor.subscribe('categories_all', function() {
        //   let cursor = Categories.find({});
        //   let arr = cursor.fetch();
        //   console.log(arr);
        return _.map(catArray, function (v) {
          // console.log(v);
          let title = v;
          return {label: title, value: title};
        });
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
  insert: (userId, doc) => !! userId,
  update: (userId, doc) => !! userId,
  remove: (userId, doc) => false
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

// Listings.insert(
//   {
//     name: 'test biz',
//     phone: '14157492060'
//   }
// );

export default Listings;
