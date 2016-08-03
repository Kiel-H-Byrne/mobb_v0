Meteor.methods({
	removeBiz(id) {
		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Remove');
		if(!id)
			throw new Meteor.Error('Invalid ID');
		
		// Flag entry for removal.
		
		// Listings.upsert({
		// 	_id: id,
		// 	createdBy: this.userId
		// })
	}
});
