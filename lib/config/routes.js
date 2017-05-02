
Router.route('/', {
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'map': {to: 'content'},
    'leftSide': {to: 'left'},
    'nav2': {to: 'nav'},
  }
});

// Router.route('/loading', {
//   name: 'Loading',
//   layoutTemplate: 'AppLayout',
//     yieldRegions: {
//       'loadingHourglass': {to: 'content'}
//     }
// });

Router.route('/terms', {
    name: 'terms',
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'nav2': {to: 'nav'}
    }
});

// Router.route('/list', {
//     layoutTemplate: 'AppLayout',
//     yieldRegions: {
//       'listPage': {to: 'content'},
//       'nav2': {to: 'nav'},
//       'footer': {to: 'footer'}
//     }
// });


Router.route('/test', {
  name: 'test',
  yieldRegions: {
    // 'test': {to: 'content'},
    'nav2': {to: 'nav'}
  }
});

// Router.route('/map', function(){
//     this.render('nav2', {to: 'nav'});
//     this.render('map', {to: 'content'});
//     this.render('galleryPage', {to: 'left'});
//     this.render('listPage', {to: 'bottom'});
//     this.render('footer', {to: 'footer'});
// });

// Router.route('/split', function(){
//     this.layout('SplitLayout');
//     this.render('nav2', {to: 'nav'});
//     this.render('map', {to: 'left'});
//     this.render('galleryPage', {to: 'right'});
//     this.render('footer', {to: 'footer'});
// });

Router.route('/404', {
    name: '404page',
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      '404page': {to: 'content'},
      'nav2': {to: 'nav'}
    }
});

//https://www.yourdomain.com/image?user={{Meteor.userId()}}&img={{imgUrl}}

Router.route('/imgprox', {
  action: function() {
    const params = this.params;
    let imageURL = params.query.url; 
    const http = require('http');
    http.get(imageURL, function(response) {

        var imageSize = parseInt(response.header("Content-Length"));
        var imageBuffer = new Buffer(imageSize);
        var bytes = 0;

        response.setEncoding("binary");

        response.on("data", function(chunk) {
            imageBuffer.write(chunk, bytes, "binary");
            bytes += chunk.length;
        });

        response.on("end", function() {
            console.log("Download complete, sending image.");
            res.setHeader("Content-Type", "image/png");
            res.send(imageBuffer);
            return next();
        });
    });
    return
  }
}, {
  where: 'server'
});

Router.route('/image', {
  action: function() {
    // console.log(this.query.url, this.query.userId);
    const params = this.params;
    const url = require('url');
    console.log(url.parse(params.query.url));
  //   // # This proxy filters traffic on paths with ‘/image’ and takes 2 required params:
    // # img = an image url
    // # user= a Meteor user id
    WebApp.connectHandlers.use(function(req, res, next) {
      let img, queryData, request, u, url, userId, x;
      request = require('request');
      url = require('url');
      if (url.parse(req.url, true).pathname !== '/image') {
        return next();
      }
      queryData = url.parse(req.url, true).query;
      if (!((queryData.img != null) && (queryData.user != null))) {
        return next();
      }
      userId = queryData.user;
      img = queryData.img;
      u = Meteor.users.findOne({
        _id: userId
      });
      if (u == null) {
        return next();
      }
      x = request(img);
      return req.pipe(x).pipe(res);
    });
  },
}, {
  where: 'server'
});

Router.route("/proxy", {
  where: "server"
}).get(function() {
  let raw_url, self, the_url;
  const url = require("url");
  self = this;
  raw_url = url.parse(this.request._parsedUrl).search.substr(1).match(/url\=[^\&]+/)[0].split("=")[1];
  the_url = decodeURIComponent(raw_url);
  the_url = /^http\:\/\//.test(the_url) ? the_url : "http://" + the_url;
  console.log(the_url);
  // return Meteor.call("getURL", the_url, function(err, response) {
  //   try {
  //     self.response.write(response.content);
  //     return self.response.end();
  //   } catch (err) {
  //     console.log("Proxy failed when getting " + the_url + ": " + err);
  //     return console.log("Response data for " + the_url + ": " + response);
    // }
  // });
});



Router.route('/listings/:name', {
  name: 'fullPage',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'nav2': {to: 'nav'}
  },
  subscriptions: function() {
    this.subscribe('listings', this.params.name).wait();
  },
  data: function() {
    let doc = Listings.findOne({name: this.params.name});
    return doc;
  },
  action: function() {
    if (this.ready()) {
      $('#modalInfo').modal('close');
      this.render();
    } else {
    }
  },
  notFoundTemplate: '404page'
});

Router.route('/categories/:name', {
  name: 'showCategories',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'nav2': {to: 'nav'}
  },
  subscriptions: function() {
    this.subscribe('categories');
    this.subscribe('listings', {$in: [this.params.name]}).wait();
  },
  data: function() {
    let cursor = Listings.find({
      categories: {$in: [this.params.name]}
    },{
      sort: {location: -1, name: 1}
    });
    if (cursor.fetch().length !== 0) {
      return {list: cursor.fetch()};
    } else {
      return false;  
    }
  },
  action: function() {
    if (this.ready()) {
      this.render();
    } else {
      this.render('loadingHourglass');
      // this.render('nav2': {to: 'nav'});
      this.render('', {to: 'left'});
    }
  },
  notFoundTemplate: '404page'
});


// Router.route('/add', {
//   template: 'nav2',
//   layoutTemplate: '',
//   action: function() {
//     if (this.ready()) {
//       this.render();
//       $('#modalAdd').modal('open');
//     }
//   }
// });

Router.route('/kibu', {
    name: 'about',
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'nav2': {to: 'nav'}
    }
});

// ==================== "atNavButton" routes Button ====================

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  path: '/login',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'nav2': {to: 'nav'}
  },  
  redirect: '/'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'register',
  path: '/register',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'nav2': {to: 'nav'}
  }
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verify-email/:token',
  action: 'verifyEmail',
  redirect: '/'
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPassword',
  path: '/reset-password',
  redirect: '/'
});

AccountsTemplates.configureRoute('enrollAccount', {
  name: 'enrollAccount',
  path: '/enroll',
  redirect: '/'
});

// AccountsTemplates.configureRoute('ensureSignedIn', {
//     template: 'myLogin',
//     layoutTemplate: 'appLayout',
// });