Meteor.methods({
	insertBiz(data) {
    check(this.userId, String);

		if(!this.userId)
			throw new Meteor.Error('Unauthorized for Insert');

		Listings.insert({
			name: data.name,
      loc: data.loc,
			address1: data.address1,
			address2: data.address2,
			address3: data.address3,
			city: data.city,
			state: data.state,
			zip: data.zip,
			country: data.country,
      url: data.url,
      image: data.img,
      phone: data.phone,
			owner: data.owner,
			createdBy: this.userId,
			createdAt: Date.now()
		})
	}
});
