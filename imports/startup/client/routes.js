//Routes
// import router from 'meteor/iron:router';
import {Meteor} from  'meteor/meteor';
//Import Layouts & Templates
import '../../ui/layouts/layout.js';


Router.route('/', function(){
    this.layout('AppLayout');
    this.render('map', {to: 'content'});
});

Router.route('/add', function(){
    this.layout('AppLayout');
    this.render('addForm', {to: 'content'});
});

Router.route('/test', function(){
    this.layout('AppLayout');
    this.render('test', {to: 'content'});
});

// ==================== "atNavButton" routes Button ====================

AccountsTemplates.configureRoute('signIn', {
    name: 'login',
    path: '/login',
    redirect: '/#',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'register',
    path: '/register',
    redirect: '/',
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verify-email',
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
  redirect: '/admin'
});

AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'myLogin',
    layoutTemplate: 'myLayout',
});