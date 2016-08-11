
Meteor.startup(function () {
  smtp = {
    username: 'thehilmar@gmail.com',
    password: Meteor.settings.public.keys.GMail.password,
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 587
  };
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});