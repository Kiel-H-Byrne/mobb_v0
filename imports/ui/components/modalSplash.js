import './modalSplash.html';

Template.splashModal.onRendered(function () {
  $(document).ready(function (){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('#modalSplash').modal();
  });

});