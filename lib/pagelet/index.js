'use strict';

var Ose = require('ose');
var M = Ose.class(module, '../widget');

/** Docs {{{1
 * @caption Pagelets
 *
 * @readme
 * A pagelet is a part of a page.
 *
 * There are several types of pagelets (see `lib/pagelet`
 * directory).
 * The dashboard pagelet is a starting point for the user.
 * Two other basic pagelets are the entry pagelet (displays one
 * entry) and the list pagelet (displays a list of entries).
 *
 * Each [entry kind] can define own UI layout and behaviour for any pagelet type displaying entry in an individual file.
 *
 * Pagelets can create and contain various widgets (see `lib/widget`
 * directory) and other pagelets.
 *
 *
 * @module bb
 * @submodule bb.pagelet
 * @main bb.pagelet
 */

/**
 * @caption Pagelet class
 *
 * @readme
 * Not every pagelet is necessarily a descendant of this class. Some
 * are direct descendants of the widget class.
 *
 * @class bb.lib.pagelet
 * @type class
 * @extends bb.lib.widget
 */

/**
 * Fired when pagelet is shown.
 *
 * @event show
 */

/**
 * Fired when pagelet is hidden.
 *
 * @event hide
 */

/**
 * Fired when pagelet is removed..
 *
 * @event remove
 */

/**
 * Each Pagelet descendant should define a "html" method. This method
 * returns the main pagelet element. It should be called by the code
 * creating the pagelet, and this code should also append the element
 * to the right place in the <body>.
 *
 * @method html
 * @abstract
 */

/**
 * Each Pagelet descendant should define a "loadData" method. This
 * method should be called by the code creating the pagelet and should
 * ensure that data displayed by the pagelet are loaded.
 *
 * @method loadData
 * @abstract
 */

/**
 * Pagelets can define an "onSearch" method, which gets called when
 * the user performs a search.
 *
 * @param value {String} Search string
 *
 * @method onSearch
 * @abstract
 */

/**
 * Each Pagelet descendant should define a "verifyStateObj"
 * method. This method compares the supplied state object with the
 * currently displayed one.
 *
 * @param data {Object} State object to be compared
 *
 * @returns {Boolean} Whether data correspond to the displayed pagelet
 *
 * @method verifyStateObj
 * @abstract
 */

/**
 * Defines the layout which extends this pagelet. Layouts are defined
 * in modules located in the "bb" subdirectory of the entry kind
 * directory. .
 *
 * @property layout
 * @type String
 * @abstract
 */

// Public {{{1
exports.html = function() {  // {{{2
  return $('<div>', {id: this.id})
    .prop('ose', this)
    .html('Loading ...')
    //.append($('<progress>'))
  ;
};

exports.show = function() {  // {{{2
  this.$().show();
  this.$('header').show();
  this.$('icons').show();

//  console.log('PAGELET SHOW');

  this.$(' .handleResize').each(function() {
    $(this).triggerHandler('resize');
  });
};

exports.hide = function() {  // {{{2
  this.$().hide();
  this.$('header').hide();
  this.$('icons').hide();
};

exports.remove = function() {  // {{{2
  this.$().remove();
  this.$('header').remove();
  this.$('icons').remove();
};

exports.afterDisplay = function(err) {  // {{{2
/**
 * Is called after a pagelet is displayed.
 *
 * The function creating a pagelet receives a callback as one of its
 * parameters. This callback is assigned to
 * "this.doAfterDisplay". This method ensures that
 * "this.doAfterDisplay" is called only once.
 *
 * @returns {Boolean} Whether "this.doAfterDisplay" has run.
 *
 * @method afterDisplay
 */

//  console.log('PAGELET AFTER DISPLAY', typeof this.doAfterDisplay, arguments);

  if (this.doAfterDisplay) {
    this.doAfterDisplay(err);

    delete this.doAfterDisplay;

    return true;
  }

  if (err) {
    M.log.error(err);
  }

  return false;
};

// }}}1
