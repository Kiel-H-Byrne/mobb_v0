import Listings from '/imports/startup/collections/listings';

Meteor.methods({
	removeBiz(id) {
		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Remove');
		if(!id)
			throw new Meteor.Error('Invalid ID');
		
		// Flag entry for removal.
		// by adding to "flagged" array on document. 
		//each array has date flagged, flaggedBy user, and reason for deletion.

		// Listings.findOne({
		// 	_id: id,
		// 	createdBy: this.userId
		// });
	}
});
