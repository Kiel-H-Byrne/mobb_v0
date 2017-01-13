
import {Meteor} from  'meteor/meteor';


Router.plugin('dataNotFound', {notFoundTemplate: '404'});

Router.route('/', function(){
    this.layout('AppLayout');
    this.render('map', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/map', function(){
    this.layout('AppLayout');
    this.render('map', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/list', function(){
    this.layout('AppLayout');
    this.render('listPage', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/gallery', function(){
    this.layout('AppLayout');
    this.render('galleryPage', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/add', function(){
    this.layout('AppLayout');
    this.render('addForm', {to: 'content'});
});

Router.route('/test', function(){
    this.layout('AppLayout');
    this.render('test', {to: 'content'});
});

Router.route('/terms', function(){
    this.layout('AppLayout');
    this.render('terms', {to: 'content'});
    this.render('', {to: 'footer'});
});

Router.route('/error', function() {
    this.layout('AppLayout');
    this.render('404', {to: 'content'});
});

// ==================== "atNavButton" routes Button ====================

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  layoutTemplate: 'AppLayout',
  path: '/login',
  redirect: '/'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'register',
  layoutTemplate: 'AppLayout',
  path: '/register',
  redirect: '/'
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  layoutTemplate: 'AppLayout',
  path: '/verify-email/:token',
  action: 'verifyEmail',
  redirect: '/'
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPassword',
  layoutTemplate: 'AppLayout',
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