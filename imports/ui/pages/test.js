
import './test.html';
import './favoritesPage.js';
//place a search on specific name and location, on insert. 
// Template.test.onCreated( function () {  
//     this.subscribe('listings_locs');
// });
const VTM = require('vanilla-text-mask/dist/vanillaTextMask.js');


Template.test.onRendered(function () {
    $(document).ready(function () {
      Materialize.updateTextFields();
      //mask is array of strings and regex
      let telMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      let telInput = document.querySelector('#tmtest-tel');
      let telInputMask = VTM.maskInput({
        inputElement: telInput,
        mask: telMask
      });
    });
});


Template.test.helpers({
  randomDoc: function () {
    const doc =  Listings.findOne();
    return doc;
  },
  testArray: function () {
    let testArray = [];
    for (i=0; i<=30; i++) {
      testArray.push(i);
    }
    return testArray;
  },
  randoNumber: function() {
    const min = 10
    const max = 1000
    const number = Math.floor(Math.random() * (max - min + 1)) + min; 
    return number
  },
  favorites: function () {
    // get the array of ids
    let arr = Meteor.user().profile.favorites;
    // for some reason the favorites array has one entry: 'NeQChWMre5Yh4ooBq'
    // so it's nevery truly 'empty'; if greater than one, return list.
    if (arr.length > 1) {
      let cursor = Listings.find({
        _id : {$in : arr}
      }, {
        sort: {name: 1, location: -1 }
      });
      return cursor;
    } else {
      return false;
    }
  }
});
