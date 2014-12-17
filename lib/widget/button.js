'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption Button widget
 *
 * @readme
 * Widget for displaying and controlling HTML buttons.
 *
 * @todo 
 * - Completely refactor toolbars and buttons.
 *
 * @class bb.lib.widget.button
 * @type class
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function() {  // {{{2
  return $('<button>');
};

exports.val = function(el) {  // {{{2
  return parseInt(el.prop('value'));
};

exports.update = function(el, prop, origin) {  // {{{2
  switch (typeof el) {
    case undefined:
    case 'number':
    case 'string':
      el = this.$();
      break;
  }

  if (! ((el instanceof jQuery) && (el.length === 1))) {
    M.log.unhandled('Button not found!');
    return;
  }

  switch (typeof prop) {
    case 'undefined':
      return;
    case 'object':
      if (prop === null) {
        prop = {value: null};
      }
      break;
    case 'function':
      prop = {tap: prop};
      break;
    default:
      prop = {value: prop};
  }

  if ('label' in prop) {
    el.text(prop.label);
  }

  if (prop.value !== undefined) {
    var val = NaN;

    if (typeof prop.value === 'string') {
      prop.value = prop.value.toLowerCase();
    }

    switch (prop.value) {
      case null:
      case false:
      case 'false':
      case 'off':
        val = 0;
        break;
      case true:
      case 'true':
      case 'on':
        val = 1;
        break;
      default:
        switch (typeof prop.value) {
          case 'string':
            val = parseInt(prop.value);
            break;
          case 'number':
            val = prop.value;
            break;
        }
    }

    if (isNaN(val)) {
      M.log.unhandled('Invalid prop.value, should be number.', prop);
    } else {
      el.prop('value', val);
    }
  }

  if ('tap' in prop) {
    el.off('click');

    if (prop.tap) {
      el.on('click', prop.tap);
    }
  }
};

// }}}1
