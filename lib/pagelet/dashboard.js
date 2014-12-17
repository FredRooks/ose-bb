'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption Dashboard pagelet
 *
 * @readme
 * Pagelet for creating dashboard content.
 *
 * @class bb.lib.pagelet.dashboard
 * @type class
 * @extends bb.lib.pagelet
 */

// Public {{{1
exports.loadData = function(cb) {  // {{{2
/**
 * Has a new list widget created and appends it to the main pagelet
 * element. It also calls the "Ose.ui.dashboard()"
 * method. "Ose.ui.dashboard()" governs what is diaplayed on the
 * dashboard.
 *
 * @method loadData
 */

  if (cb) {
    this.doAfterDisplay = cb;
  }

  this.$('header').html('Dashboard');

  this.$()
    .empty()
    .append(this.newWidget('list', 'list'))
  ;

  if (Ose.ui.configData.dashboard) {
    this.addContents(Ose.ui.configData.dashboard);
  }

  if (Ose.ui.dashboard) {
    Ose.ui.dashboard(this, this.afterDisplay.bind(this));
  } else {
    this.afterDisplay();
  }
};

exports.addContent = function(caption, stateObj) {  // {{{2
/**
 * Adds an item to the dashboard.
 *
 * @param caption {String} Text to be displayed
 * @param stateObj {Object} State object that should be displayed when the user taps on this item.
 */

  return this.addItem(caption, Ose.ui.bindContent(stateObj));
};

exports.addContents = function(data) {  // {{{2
/**
 * Adds items to the dashboard.
 *
 * @param data {Array} Array of items
 */

  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    this.addContent(item.caption, item.data);
  }
};

exports.addItem = function(caption, onTap) {  // {{{2
/**
 * Adds an item to the dashboard.
 *
 * @param caption {String} Text to be displayed
 * @param onTap {Function} Function to be called when the user taps on this item.
 */

  return this.$('list > ul').append(
    this.newWidget('listItem', null, {
      tap: onTap,
      caption: caption
    })
  );
};

exports.addPagelet = function(params, cb) {  // {{{2
/**
 * Adds an item to the dashboardk.
 *
 * @param caption {String} Text to be displayed
 * @param cb {Function} Function to be called when the user taps on this item.
 */

  var result = this.newPagelet(params);

  $('<li>')
    .append(result.html())
    .appendTo(this.$('list > ul'))
  ;

  result.loadData();

  cb();  // TODO Send "cb" to loadData.
  return result;
};

exports.verifyStateObj = function(data) {  // {{{2
/**
 * Verifies that data correspond to the displayed pagelet.
 *
 * @param data {Object} State object to be compared
 *
 * @returns {Boolean} Whether data correspond to the displayed pagelet
 * @method verifyStateObj
 */

  return data.pagelet === 'dashboard';
};

// }}}1
