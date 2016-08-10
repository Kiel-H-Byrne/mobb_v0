
Meteor.startup(function () {
  smtp = {
    username: 'thehilmar@gmail.com',
    password: 'Vivitr0n',
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 465
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});