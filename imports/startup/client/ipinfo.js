import Info from '/imports/startup/collections/info';

Meteor.subscribe('info', function() {
	console.log('subscribing...');
	console.log(Info.find().fetch());
	this.stop();
})

$.getJSON("http://ipinfo.io", function(data){
	console.log("--setting initial ipInfo--");
	// console.log(data);
	Session.set('ipInfo', data);

	if (Meteor.user()) {
		Meteor.users.update({ 
			_id : Meteor.user()._id
			}, { 
			$set: { 
				profile : data 
			} });
		//get state abbreviation. set it to state
		Meteor.users.update({
			_id : Meteor.user()._id
		}, { 
			$set: {
				"profile.state" : abbr_State(data.region, 'abbrev')
		} });
	}

	// Info.insert( {'profile' : data} );

	Info.upsert({
		//selector
		'profile.hostname' : data.hostname
		},{
		//modifier
		$set: {
			'profile' : data
		}

	});
	
});

// analytics.track( 'ipInfo data', {
//   title: 'Pulled Geo Info',
//   data: Session.get('ipInfo)')
// });

			/*
			city: "Silver Spring"
			country: "US"
			hostname: "c-69-138-161-94.hsd1.md.comcast.net"
			ip: "69.138.161.94"
			loc: "39.0261,-77.0084"
			org: "AS7922 Comcast Cable Communications, Inc."
			postal: "20901"
			region: "Maryland"
			*/

// Template.ipInfo.helpers({
// 	location: function() {
// 		if ( Session.get('ipInfo') ) {
// 			var ipInfo = Session.get('ipInfo');
// 			return ipInfo;
// 		} else {
// 			//string is loading for semantic 'loader' class
// 			var string = "loading";
// 			return string;
// 		}
// 	}
// });

// Template.ipInfo.events({
// 	//when form is submitted, change the 'found' state to the one entered.
// 	//should accept zipcode and full address.
// 	'submit form': function (evt, tpl) {
// 		event.preventDefault();
// 		//if entered is a string, set value to state
// 		var entered = tpl.find('input#self-state').value;
// 		console.log(entered);
// 		if (entered.length === 5  && $.isNumeric(entered) ) {
// 			//user has entered their zipcode
	
// 			Session.set('newZip', entered);
// 			console.log(Session.get('newZip'));
// 			Info.insert({
// 				'newZip' : entered
// 			});
// 			Queries.insert({
// 				'query' : entered,
// 				'submitted' : new Date(),
// 				'userId' : Meteor.user()._id || null,
// 				'userZip' : Meteor.user().profile.postal
// 			});
// 			// console.log("they put "+entered);
// 			//convert zipcode to state.
// 			var res = Meteor.call('zipCode', entered, function(e,r) {
// 				if (e) {
// 					// console.log(e);
// 					throwError(e.message);
					
// 				} else {
// 					console.log(r);
// 					Session.set('newState', r.state);
// 					Session.set('newLoc', r.lat +',' +r.lng);

// 					Info.insert({'newState': r.state});
// 					Info.insert({'newLoc': r.lat+','+r.lng });
// 					return r;
// 				}
// 			});
// 		} else if (entered.length > 5) {
// 			//if they enter an address, store as search address, verify as user's address.
// 			Session.set('newAddress', entered);
// 			throwError("I can't search addresses right now...");
// 		} else {
// 			throwError("Did not enter a valid zipcode or address!");
// 		}
	    
//     analytics.track("Entered Zipcode", {
//       zip: entered
//     });

// 	}
// });