import '/imports/startup/collections/listings.js';
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
//TODO: Consider using Orion.js roles security

Categories.deny({
  // only allow insertion if you are logged in
  insert: function(userId, doc) { return true; },
  update: function(userId, doc) { return true; },
  remove: function(userId, doc) {! return ownsDocument(userId, doc); },
});

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
    type: Number,
    autoValue: function() {
      // count equals the sum of all collections which contain a match in it's category array, a match to this record's sibling field; title
      //find the amount of listings the associated category matches
      // let count = Math.round(Math.random() * (50 - 2) + 2);
      // return count.toString();

      let cat = this.field("title").value;
      let count = Listings.find({categories: {$elemMatch: {$in: [ cat ]}}}).count();
      // console.log(count);
      return count;
    }
  }
}));

export default Categories;
