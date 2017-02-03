
import {Meteor} from  'meteor/meteor';

Router.configure({
    layoutTemplate: 'AppLayout',
    notFoundTemplate: '404'
});

Router.plugin('dataNotFound', {
  notFoundTemplate: '404'
});

Router.route('/', {
    // template: 'map',
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'map': {to: 'content'},
      'galleryPage': {to: 'left'},
      'nav2': {to: 'nav'},
      'footer': {to: 'footer'}
    }
});

Router.route('/gallery', {
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'galleryPage': {to: 'content'},
      'nav2': {to: 'nav'},
      'footer': {to: 'footer'}
    }
});

Router.route('/test', {
    yieldRegions: {
      'test': {to: 'content'},
      'galleryPage': {to: 'left'},
      'listPage': {to: 'bottom'},
      'nav2': {to: 'nav'},
      'footer': {to: 'footer'}
    }
});

Router.route('/terms', {
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'terms': {to: 'content'},
      'nav2': {to: 'nav'},
      'footer': {to: 'footer'}
    }
});

Router.route('/list', {
    layoutTemplate: 'AppLayout',
    yieldRegions: {
      'listPage': {to: 'content'},
      'nav2': {to: 'nav'},
      'footer': {to: 'footer'}
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





Router.route('/listings/:_id', function () {
  let params = this.params;
  let item = Listings.findOne({_id: params._id});
});

Router.route('/categories/:_id', function () {
  let item = Categories.findOne({_id: this.params._id});
  // this.render('ShowItem', {data: item});
});


// Router.route('/add', function(){
//     this.render('nav2', {to: 'nav'});
//     this.render('addForm', {to: 'content'});
// });


// Router.route('/error', function() {
//     this.render('404', {to: 'content'});
// });

// ==================== "atNavButton" routes Button ====================

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  path: '/login',
  layoutTemplate: 'AppLayout',
  redirect: '/'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'register',
  path: '/register',
  layoutTemplate: 'AppLayout',
  yieldRegions: {
    'fullPageAtForm': {to: 'content'},
    'nav2': {to: 'nav'},
    'footer': {to: 'footer'},    
  },
  redirect: '/'
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