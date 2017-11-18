import './closestCard.html';


Template.closestCard.helpers({
  label(label) {
    const string = label;
    return string;
  }
});

Template.closestCard.onRendered(function () {
  $(document).ready(function () {
    $('.share-drop').dropdown();
  });
});


Template.closestCard.events({
	'click #verify_button': function(event,templateInstance) {
		// console.log("Clicked Verify button!");
		//open modal verify form.
		$('#modalVerify').modal('open');
	},
  'click #edit_button': function(event,templateInstance) {
    //open modal verify form.
    $('#modalEdit').modal('open');
    $('.collapsible').collapsible();
  }
});