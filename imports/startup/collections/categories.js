import '/imports/startup/collections/listings.js';
//=================== NEW COLLECTION =========================

Categories = new orion.collection('categories', {
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
        data: "name", 
        title: "Name" 
      },{ 
        data: "count", 
        title: "Count"        
      },
    ]
  }
});

if ( Meteor.isServer ) {
  Categories._ensureIndex( { title: 1, count: 1 } );
}

//=================== COLLECTION SECURITY =========================
//TODO: Consider using Orion.js roles security

Categories.allow({
  // only allow insertion if you are logged in
  insert: (userId, doc) => !! userId,
  update: (userId, doc) => !! userId,
  remove: (userId, doc) => false,
});

//=================== SCHEMAS =========================
// https://github.com/aldeed/meteor-simple-schema

Categories.attachSchema(new SimpleSchema({

  // We use `label` to put a custom label for this form field
  // Otherwise it would default to `Title`
  // 'optional: false' means that this field is required
  // If it's blank, the form won't submit and you'll get a red error message
  // 'type' is where you can set the expected data type for the 'title' key's value
  name: {
    type: String,
    unique: true
  },
  count: {
    type: Number,
    autoValue: function() {
      // count equals the sum of all collections which contain a match in it's category array, a match to this record's sibling field; title
      //find the amount of listings the associated category matches
      // let count = Math.round(Math.random() * (50 - 2) + 2);
      // return count.toString();

      let cat = this.field("name").value;
      let cursor = Listings.find({categories: {$elemMatch: {$in: [ cat ]}}});
      let count = cursor.count();
      // cursor.observeChanges({
      //   added: function(id,doc) {
          
      //   },
      // });
      // console.log(count);
      return count;
    },
    optional: true
  }
}));

export default Categories;
