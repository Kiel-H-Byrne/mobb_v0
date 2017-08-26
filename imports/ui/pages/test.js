
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


// Template.test.helpers({
//   randomDoc: function () {
//     const doc =  Listings.findOne();
//     return doc;
//   }
// });
