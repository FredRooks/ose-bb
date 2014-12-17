'use strict';

var Ose = require('ose');
var M = Ose.class(module);

/** Docs {{{1
 * @caption Widgets
 *
 * @readme
 * A Widget is an easily reusable control visually represented by
 * HTML5 elements. Their behaviour is controlled by instances of
 * descendants of the [Widget class].
 *
 * @module bb
 * @submodule bb.widget
 * @main bb.widget
 * @aliases widget
 */

/**
 * @caption Widget class
 *
 * @readme
 * Ancestor for individual widgets and pagelets.
 *
 * @class bb.lib.widget
 * @type class
 */

/**
 * Creates a jQuery object representing widget.
 *
 * @returns {Object} jQuery object representing widget
 * @method html
 * @abstract
 */

/**
 * ID of widget
 *
 * @property id
 * @type String
 */

// Public {{{1
exports.$ = function(selector) {  // {{{2
/**
 * Finds elements within current widget using a "selector".  It
 * concatenates "this.id" with the selector and uses jQuery "$()". If
 * the "selector" is empty, it returns the main jQuery element.
 *
 * @param selector {String}
 *
 * @returns {Object} jQuery element.
 *
 * @method $
 */

  return $('#' + this.id + (selector || ''));
};

exports.visible = function() {  // {{{2
/**
 * TODO Rename to isVisible?
 *
 * @method visible
 */

  return this.$().is(':visible');
};

exports.show = function() {  // {{{2
/**
 * Shows widget.
 *
 * @method show
 */

  this.$().show();
};

exports.hide = function() {  // {{{2
/**
 * Hides widget
 *
 * @method hide
 */

  this.$().hide();
};

exports.remove = function() {  // {{{2
/**
 * Removes widget and all its listeners
 *
 * @method remove
 */

  this.$().remove();
};

exports.removed = function() {  // {{{2
/**
 * Test whether element has been removed from the <body>
 *
 * TODO: rename to isRemoved
 *
 * @method removed
 */

  return this.$().length === 0;
};

exports.newPagelet = function(stateObj) {  // {{{2
/**
 * Creates new pagelet
 *
 * @param stateObj {Object} State object
 *
 * @returns {Object} Newly created pagelet element
 *
 * @method newPagelet
 */

  var c;
  if (stateObj.pagelet.charAt(0) === '.') {
    c = this.M.class(stateObj.pagelet);
  } else {
    if (stateObj.pagelet.indexOf('/') < 0) {
      c = M.class('../pagelet/' + stateObj.pagelet);
    } else {
      c = this.M.class(stateObj.pagelet);
    }
  }

  var result = new c();

  result.id = Ose._.uniqueId('id');
  result.stateObj = stateObj;

  return result;
};

exports.newWidget = function(type, id, prop) {  // {{{2
/**
 * Creates new widget
 *
 * @param type {String} Widget type
 * @param id {String} Widget ID
 * @param prop {Object} Properties
 *
 * @returns {Object} Newly created widget element
 *
 * @method newWidget
 */

  var c;
  if (type.charAt(0) === '.') {
    c = this.M.class(type);
  } else {
    if (type.indexOf('/') < 0) {
      c = M.class('./' + type);
    } else {
      c = this.M.class(type);
    }
  }

  var widget = new c();
  var el = widget.html(prop).prop('ose', widget);

  if (id) {
    widget.id = this.id + id;
    el.attr('id', widget.id);
  }

  if (prop && widget.update) {
    widget.update(el, prop, 'new');
  }

  return el;
};

exports.widget = function(id, prop, origin) {  // {{{2
/**
 * Updates a widget or returns widget value
 *
 * @param id {String} Widget ID
 * @param prop {Object} Properties
 * @param origin {String} Origin of the call
 *
 * @returns {*} Value
 *
 * @method widget
 */

  var el = this.$(id);

  if (el.length !== 1) {
    M.log.unhandled('Widget not found or duplicit.', el);
    return null;
  }

  var widget = el.prop('ose');

  if (prop === undefined) {  // Any other value can mean widget value change.
    return widget.val(el);
  }

  return widget.update && widget.update(el, prop, origin);
};

// }}}1
