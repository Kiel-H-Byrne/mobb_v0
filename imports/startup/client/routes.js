
import { Meteor } from  'meteor/meteor';


Router.route('/', {
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'map': {to: 'content'},
    'closestPage': {to: 'left'},
    'nav2': {to: 'nav'},
    'footer': {to: 'footer'}
  }
});

Router.route('/loading', {
  name: 'Loading',
  layoutTemplate: 'AppLayout',
    yieldRegions: {
      'loadingHourglass': {to: 'content'}
    }
});

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
    'nav2': {to: 'nav'},
    'footer': {to: 'footer'},
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

// Router.route('/404', {
//     name: '404page',
//     layoutTemplate: 'AppLayout',
//     yieldRegions: {
//       '404page': {to: 'content'},
//       'nav2': {to: 'nav'}
//     }
// });

Router.route('/listings/:name', {
  name: 'fullCard',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    // 'fullCard': {to: 'content'},
    'nav2': {to: 'nav'}
  },
  subscriptions: function() {
    this.subscribe('listings');
    this.subscribe('listings', this.params.name).wait();
  },
  data: function() {
    return Listings.findOne({name: this.params.name});
  },
  action: function() {
    if (this.ready()) {
      this.render();
    } else {
      this.render('loadingHourglass', {to: 'content'});
      // this.render('nav2': {to: 'nav'});
      this.render('', {to: 'left'});
    }
  },
  // notFoundTemplate: '404page'
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
  // notFoundTemplate: '404page'
});


Router.route('/add', {
  template: 'nav2',
  layoutTemplate: '',
  action: function() {
    if (this.ready()) {
      this.render();
      $('#modalAdd').modal('open');
    }
  }
});

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
  redirect: '/add'
});

// AccountsTemplates.configureRoute('ensureSignedIn', {
//     template: 'myLogin',
//     layoutTemplate: 'appLayout',
// });