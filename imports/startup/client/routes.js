
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
    path: '/login',
    redirect: '/',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'register',
    path: '/register',
    redirect: '/add',
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