import { Template } from 'meteor/templating';
import Listings from '/imports/startup/collections/listings';

import './addForm.html';



// Template.addForm.onRendered(function() {
// //show the input form for optional fields, only if the associated checkbox is checked
// 	$('#supplied').click(function() {
// 	  $('.date')[this.checked ? "show" : "hide"]();
// 	});
// });

Template.addForm.onCreated(function() {
  this.subscribe('categories');
});

Template.addForm.onRendered(function() {
  $('.collapsible').collapsible();

  // let state = Session.get('clientState');
  // $("li:contains("+ state +")").addClass("active selected");

  
});

Template.addForm.helpers({
  getState : function() {
    let state = Session.get('clientState');
    return state;
  },
  formOptions: function() {
    return Categories.find().map(function(c) {
      return {label: c.name, value: c.name}
    })
    // let cursor = Categories.find({});
    // let arr = cursor.fetch();
    // // console.log(arr);
    // let opts = [];
    // _.map(arr, function (v) {
    //   // console.log(v);
    //   let name = v.name;
    //   // console.log(name);
    //   opts.push( {label: name, value: name} );
    // });
    // console.log(opts);
    // return [
    //   {
    //     optgroup: "Categories",
    //     options: [{label:"test2", value: "test1"}]
    //   }
    // ]
  }
});


AutoForm.addHooks('addListingForm', {
	  // Called when form does not have a `type` attribute or is 'normal'
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault(); //prevents page reload
        console.log('Just submitted form, from addform.js');
        //close modal on submit
        // $('#modalAdd').closeModal();
        Listings.insert(insertDoc);
		    this.done(); // must be called; submitted successfully, call onSuccess, 
		    return false; //prevents page reload
    },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
  	console.log("Thanks for Submitting!");
    //draw marker?
    //change content(inner html) of addForm template.
    $('#modalAdd').html(
      ' <div id="submitMsg" class="modal-content"> ' +
      ' <h3 class="centered"> Thank You! </h3> ' +
      ' </div> '
      );
    $('#modalAdd').delay(1100).closeModal();
  },
});