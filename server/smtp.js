
// ============================ GMAIL ===================================
// Meteor.startup(function () {
//   smtp = {
//     username: 'thehilmar@gmail.com',
//     password: Meteor.settings.public.keys.GMail.password,
//     server:   'smtp.gmail.com', 
//     port: 587
//   };
//   process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
// });

// ============================ MAILGUN ===================================

Meteor.startup(function () {
  smtp = {
    // username: 'postmaster@sandbox6ba51b6be4634d88b492b2418b1b7c4c.mailgun.org',
	username: "postmaster@TenKSolutions.com",
    password: Meteor.settings.public.keys.mailgun.password,
    server:   "smtp.mailgun.org",
    port: 587
  };
   process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

  // Return a 404 HTTP response if the route doesn't exist                                                                                                                
  WebApp.connectHandlers.use("/", function(req, res, next) {
    if( req.url == "/" || _.contains(_.keys(Router.routes), req.url.substr(1)) ){
      next(); // Route exists, let iron router render it                                                                                                              
    }
    else {
      res.writeHead(404)
      res.end("Not found.")
    }
  });   

});

