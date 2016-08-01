//Routes
// import router from 'meteor/iron:router';
import {Meteor} from  'meteor/meteor';
//Import Layouts & Templates
import '../../ui/layouts/layout.js';
import '../../ui/components/map.js';


Router.route('/', function(){
    this.layout('AppLayout');
    this.render('map', {to: 'content'});
});

Router.route('/add/', function(){
    this.layout('AppLayout');
    this.render('addForm', {to: 'content'});
});

Router.route('/login/', function(){
    this.layout('AppLayout');
    this.render('loginForm', {to: 'content'});
});