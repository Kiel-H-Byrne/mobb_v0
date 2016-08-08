import {Template} from 'meteor/templating';

import './login.html'

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        let userName = event.target.username.value;
        let password = event.target.password.value;
        console.log("Logged in with:", userName);

        Meteor.call(userName, password);
    }
});