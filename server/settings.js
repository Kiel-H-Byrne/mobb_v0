Meteor.startup(function () {

  BrowserPolicy.content.allowOriginForAll("localhost");

  if (process.env.METEOR_SETTINGS) {
    try {
      Meteor.settings = JSON.parse(process.env.METEOR_SETTINGS);
    } catch (e) {
      throw new Error("METEOR_SETTINGS are not valid JSON: " + process.env.METEOR_SETTINGS);
    }
  } else if (process.env.METEOR_SETTINGS_FILE) {
    try {
      Meteor.settings = JSON.parse(
        Npm.require('fs').readFileSync(process.env.METEOR_SETTINGS_FILE, 'utf8')
      );
    } catch (e) {
      throw new Error("METEOR_SETTINGS_FILE is not a valid JSON file: " + process.env.METEOR_SETTINGS_FILE);
    }
  }

});

