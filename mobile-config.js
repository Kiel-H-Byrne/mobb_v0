// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.KIBUmap',
  name: 'KIBU: The Map',
  description: 'KIBU',
  author: 'Kiel H. Byrne',
  email: 'thehilmar@gmail.com',
  website: 'https://www.kibumap.com'
});
// Set up resources such as icons and launch screens.
// App.icons({
//   'iphone': 'img/icons/icon-60.png',
//   'iphone_2x': 'img/icons/icon-60@2x.png',
//   // ... more screen sizes and platforms ...
// });
// App.launchScreens({
//   'iphone': 'img/splash/Default~iphone.png',
//   'iphone_2x': 'img/splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });
// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');
// Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey'
// });
// Set up Access Rules
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');