
import {Meteor} from  'meteor/meteor';

Router.configure({
    layoutTemplate: 'AppLayout',
    yieldTemplates: {
        nav2: {to: 'nav'},
        footer: {to: 'footer'},
        listPage: {to: 'content'}
    }
});

Router.plugin('dataNotFound', {notFoundTemplate: '404'});

Router.route('/', function(){
    this.render('nav2', {to: 'nav'});
    this.render('map', {to: 'content'});
    this.render('galleryPage', {to: 'left'});
    this.render('listPage', {to: 'bottom'});
    this.render('footer', {to: 'footer'});
});

Router.route('/map', function(){
    this.render('nav2', {to: 'nav'});
    this.render('map', {to: 'content'});
    this.render('galleryPage', {to: 'left'});
    this.render('listPage', {to: 'bottom'});
    this.render('footer', {to: 'footer'});
});

Router.route('/split', function(){
    this.layout('SplitLayout');
    this.render('nav2', {to: 'nav'});
    this.render('map', {to: 'left'});
    this.render('galleryPage', {to: 'right'});
    this.render('footer', {to: 'footer'});
});

Router.route('/list', function(){
    this.render('nav2', {to: 'nav'});
    this.render('listPage', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/gallery', function(){
    this.render('nav2', {to: 'nav'});
    this.render('galleryPage', {to: 'content'});
    this.render('footer', {to: 'footer'});
});

Router.route('/:_id', function () {
  let params = this.params;
  let item = Listings.findOne({_id: params._id});
});

Router.route('/categories/:_id', function () {
  let item = Categories.findOne({_id: this.params._id});
  // this.render('ShowItem', {data: item});
});


Router.route('/add', function(){
    this.render('nav2', {to: 'nav'});
    this.render('addForm', {to: 'content'});
});

Router.route('/test', function(){
    this.render('nav2', {to: 'nav'});
    this.render('test', {to: 'content'});
});

Router.route('/terms', function(){
    this.render('nav2', {to: 'nav'});
    this.render('terms', {to: 'content'});
    this.render('', {to: 'footer'});
});

Router.route('/error', function() {
    this.render('404', {to: 'content'});
});

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