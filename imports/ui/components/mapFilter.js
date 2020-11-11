import Categories from '/imports/startup/collections/categories';
import Listings from '/imports/startup/collections/listings';

import './mapFilter.html';

Template.mapFilter.onCreated(function () {
  this.subscribe('categories');
  this.subscribe('listings_locs');
});

Template.mapFilter.helpers({
  categories: function () {
    return Categories.find();
  },
  catCount: function(cat) {
    return Listings.find({categories: {$elemMatch: {$in: [ cat ]}}}).count();
  }
});

Template.mapFilter.events({
  "click .switch label, click .main-switch label": function (
    event,
    templateInstance
  ) {
    event.preventDefault();
  },
  "click .main-switch": function (event) {
    // STOP PROPAGATING SO DROPDOWN DOESNT CLOSE
    event.stopPropagation();
    const elArray = $("#filter_dropdown .switch input");
    // console.log(elArray);

    for (let i = 1, len = elArray.length; i < len; i++) {
      const el = elArray[i];
      if (el.checked) {
        el.checked = false;
        //hide all markers
      } else {
        el.checked = true;
        //show all markers
      }
    }
  },
  "click .cat_item .switch": function (event) {
    // event.preventDefault();
    event.stopPropagation();

    if (GoogleMaps.maps.map.instance.getZoom() >= 10) {
      if (event.currentTarget.title) {
        //make sure this runs only once!
        toggleGroup(event.currentTarget.title);
      }
      const el = $(event.currentTarget.firstElementChild.children[0]);

      if (el.prop("checked")) {
        el.prop("checked", false);
        el.css("background-color", "#e34");
      } else {
        el.prop("checked", true);
        el.css("background-color", "#3af");
      }
    } else {
      Materialize.toast("Zoom in just a bit more...", 1100, "myToast");
    }
  },
});