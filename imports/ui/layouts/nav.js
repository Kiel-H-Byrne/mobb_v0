import {Template} from 'meteor/templating';

import '../components/addForm.html'
import '../components/loginForm.html'
import './nav.html'


Template.nav.onRendered( function() {
	console.log("modal trigger ready");

  $(document).ready(function(){
 // $('#addModal').openModal();    

 // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });

})

// Template.nav.events({ 
//   'click #addModal_button' : function() {
//      $('#addModal').openModal();
//    }
// });