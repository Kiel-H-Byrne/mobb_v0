import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './betaModal.html';


Template.betaModal.onRendered(function() {
  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });

});