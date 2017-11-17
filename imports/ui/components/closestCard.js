import './closestCard.html';


Template.closestCard.onRendered(function () {

  $(document).ready(function () {
    $('.share-drop').dropdown();
    $('#modalInfo').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200 // Transition out duration
    });

    Meteor.autorun(function(c) {
      const closest = Session.get('closestListing');
      if (closest) {
        // Meteor.subscribe('listings_one', closest.id, function() {
          //Modal Popup
          console.log(closest);
          $('#modalInfo').modal('open');
      }
    })
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