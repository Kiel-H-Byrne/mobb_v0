
import './terms.html';

Template.terms.onRendered(function () {

  $(document).ready(function (){
    $('.collapsible').collapsible();
  });
});