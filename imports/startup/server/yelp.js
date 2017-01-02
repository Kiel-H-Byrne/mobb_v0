

const Yelp = require('yelp-fusion');
// const yelp_id = Meteor.settings.public.keys.yelp.app_id;
// const yelp_secret = Meteor.settings.public.keys.yelp.app_secret;
const yelp_id = 'qY7ReHuqqRcd46uO35EdDw';
const yelp_secret = 'sraEpUUq73L9aPc6S4OTzRZh8qETaaFJFDiU5hJJTqlwya8ppphEdIX5nS1TwNdL';

// const searchRequest = {
//   term:'african',
//   location: 'silver spring, md'
// };
 
// Yelp.accessToken(yelp_id, yelp_secret).then(response => {
//   let token = response.jsonBody.access_token;
//   const client = Yelp.client(token);

//   client.search(searchRequest).then(response => {
//       const firstResult = response.jsonBody.businesses[0];
//       const prettyJson = JSON.stringify(firstResult, null, 4);
//       console.log(firstResult.id);

//   }).catch(e => {
//     console.log(e);
//   });
// });