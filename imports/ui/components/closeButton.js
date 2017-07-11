
import './closeButton.html';

Template.closeButton.events({
	'click, touchstart' : function(evt,tpl){
	    //close modal
	    let modalName = tpl.firstNode.parentNode.id;
	    $('#'+ modalName ).modal('close');
	  }
});