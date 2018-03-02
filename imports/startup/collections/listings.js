import './schemas.js';

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
        data: "address", 
        title: "Address" 
      },{ 
        data: "street", 
        title: "Street" 
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
        data: "verifierCount", 
        title: "Verifiers" 
      },{ 
        data: "claimsCount", 
        title: "Claims" 
      },{ 
        data: "owner.name", 
        title: "Owner" 
      },{ 
        data: "google_id", 
        title: "Google ID" 
      },{ 
        data: "yelp_id", 
        title: "Yelp ID" 
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


// Votes.attachSchema(VoteSchema);

Listings.attachSchema(Schema.Listings);


//=================== COLLECTION SECURITY =========================

Listings.allow({

  // only allow insertion if you are logged in
  insert: (userId, doc) => !! userId,
  //allow everyone to 'update' pr at least from server
  update: (userId, doc) => true,
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
  //Deny all client-side updates on Listings collection; should happen via meteor.call to server
  insert() { return true; },
  update() { return true; },
  remove(userId, doc) { return (!Roles.userHasRole(userId,'admin')); }
});

export default Listings;
