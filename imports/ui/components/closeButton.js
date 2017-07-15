
import './closeButton.html';

Template.closeButton.events({
	'click, touchstart' : function(event,templateInstance){
	    //close modal
	    let modalName = templateInstance.firstNode.parentNode.id;
	    $('#'+ modalName ).modal('close');
	  }
});