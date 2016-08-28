
//=================== NEW COLLECTION =========================

Categories = new orion.collection('Categories', {
  singularName: 'category', // The name of one of these items
  pluralName: 'Categories', // The name of more than one of these items
  link: { title: 'Categories' },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "title", 
        title: "Title" 
      },{ 
        data: "count", 
        title: "Count"        
      },
    ]
  }
});

//=================== COLLECTION SECURITY =========================

Categories.deny({
  // only allow insertion if you are logged in
  insert: function(userId, doc) { return true; },
  update: function(userId, doc) { return true; },
  remove: function(userId, doc) { return ownsDocument(userId, doc); },
});

// Categories.allow({
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
// Categories.deny({
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

Categories.attachSchema(new SimpleSchema({

  // We use `label` to put a custom label for this form field
  // Otherwise it would default to `Title`
  // 'optional: false' means that this field is required
  // If it's blank, the form won't submit and you'll get a red error message
  // 'type' is where you can set the expected data type for the 'title' key's value
  title: {
    type: String,
    unique: true
  },
  count: {
    type: String,
    autoValue: function() {

      //find the amount of listings the associated category matches
      let count = Math.random() * (50 - 2) + 2;
      return count.toString();
    }
  }
}));

export default Categories;
