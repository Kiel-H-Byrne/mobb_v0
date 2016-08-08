// Request API access: http://www.yelp.com/developers/getting_started/api_access 
const Yelp = require('yelp');
let yelp = new Yelp({

  consumer_key: Meteor.settings.public.keys.yelp.key,
  consumer_secret: Meteor.settings.public.keys.yelp.secret,
  token: Meteor.settings.public.keys.yelp.token,
  token_secret: Meteor.settings.public.keys.yelp.t_secret,
});
 
// See http://www.yelp.com/developers/documentation/v2/search_api 
// yelp.search({ term: 'food', location: 'Montreal' })
// .then(function (data) {
//   console.log(data);
// })
// .catch(function (err) {
//   console.error(err);
// });

 
// A callback based API is also available: 
// yelp.search('yelp-san-francisco', function(err, data) {
//   if (err) return console.log(error);
//   console.log(data);
// });

// CONSUMER_KEY="" CONSUMER_SECRET="" TOKEN="" TOKEN_SECRET="" npm test
 
