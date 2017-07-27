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
        data: "social.facebook",
        title: "Facebook"
      },{
        data: "social.instagram",
        title: "Instagram"
      },{
        data: "social.twitter",
        title: "Twitter"
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
      orion.attributeColumn('image', 'image', 'Image'),
      { 
        data: "categories", 
        title: "Categories" 
      },
      orion.attributeColumn('createdBy', 'creator', 'Created By'),
      orion.attributeColumn('createdAt', 'submitted', 'Created @'), 
    ]
  }
});

if ( Meteor.isServer ) {
  // ALLOW FOR SORTING (?) 
  Listings._ensureIndex( { name: 1, city: 1 } );

  // Meteor.subscribe('categories', function () {
  //   const catArray = Categories.find().fetch();
  //   console.log(catArray);
  // }); 
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
// const catArray = ["Food & Beverage", "Nightlife", "Beautification", "Retail", "Entertainment", "Business Services", "Online Retail"];


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
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afFieldInput: {
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
    type: String,
    label: 'Owner Name',
    optional: true
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
  ownphone: {
    type: Number,
    label: 'Owner Phone',
    optional: true
  },
  location: {
    type: String,
    optional: true,
    autoValue: function () {
      let street = this.field("street").value;
      // console.log(tester);
      if ( street && this.isInsert && !this.isSet) {
        const params = {};
        // console.log(this.docId);
        // console.log(this);
        // params.place_id = this.field("google_id").value;
        params.street = this.field("street").value;
        params.city = this.field("city").value;
        params.zip = this.field("zip").value;
        const response = Meteor.call('geoCode', params);

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
Listings.deny({
  update: function (userId, doc, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'creator');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return doc.locked;
  },
  // fetch: ['locked'] // no need to fetch 'owner'
});


export default Listings;
