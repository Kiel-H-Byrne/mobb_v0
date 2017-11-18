
import './closestCard.html';
import 'animate.css/animate.min.css';



Template.closestCard.onRendered(function () {
  $(document).ready(function () {
    $('.share-drop').dropdown();
  });
});

Template.closestCard.helpers({
  label(label) {
    const string = label;
    return string;
  }
});

Template.closestCard.events({
	'click': function(event,templateInstance) {
		// console.log("Clicked Verify button!");
		//open modal verify form.
		$('#modalVerify').addClass('open');
	},
  'click #edit_button': function(event,templateInstance) {
    //open modal verify form.
    $('#modalEdit').modal('open');
    $('.collapsible').collapsible();
  }
});