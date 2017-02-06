
import { Meteor } from  'meteor/meteor';

Router.configure({
    layoutTemplate: 'AppLayout',
    yieldRegions: {
        nav2: {to: 'nav'},
        footer: {to: 'footer'},
        listPage: {to: 'bottom'}
    }
});

Router.plugin('dataNotFound', {notFoundTemplate: 'page_404'});

Router.route('/', function() {
    this.layout('AppLayout');
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
    this.layout('AppLayout');
    this.render('nav2', {to: 'nav'});
    this.render('listPage', {to: 'bottom'});
    this.render('footer', {to: 'footer'});
});

Router.route('/gallery', function(){
    this.layout('AppLayout');
    this.render('nav2', {to: 'nav'});
    this.render('galleryPage', {to: 'left'});
    this.render('footer', {to: 'footer'});
});

Router.route('/:_id', function () {
  this.layout('AppLayout');
  let params = this.params;
  let item = Listings.findOne({_id: params._id});
});

Router.route('/categories/:_id', function () {
  this.layout('AppLayout');
  let item = Categories.findOne({_id: this.params._id});
  // this.render('ShowItem', {data: item});
});


Router.route('/add', function(){
    this.render('nav2', {to: 'nav'});
    this.render('addForm', {to: 'content'});
});

Router.route('/test', function(){
    this.layout('AppLayout');
    this.render('nav2', {to: 'nav'});
    this.render('test', {to: 'content'});
});

Router.route('/terms', function(){
    this.layout('AppLayout');
    this.render('nav2', {to: 'nav'});
    this.render('terms', {to: 'content'});

});

Router.route('/error', function() {
    this.layout('AppLayout');
    this.render('page_404', {to: 'content'});
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