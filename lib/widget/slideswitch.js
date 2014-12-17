'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption Slideswitch widget
 *
 * @readme
 * Widget for displaying and controlling HTML slideswitches.
 *
 * @class bb.lib.widget.slideswitch
 * @type class
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {  // {{{2
  return $('<label>', {'class': 'pack-switch'})
//    .hammer()
    .on('click', onClick.bind(this))
//    .on('dragstart swipeleft swiperight', onGesture.bind(this))
    .append($('<input>', {type: 'checkbox'}))
    .append($('<span>'))
  ;
};

exports.val = function(el) {  // {{{2
  return (el || this.$()).find('input').prop('checked');
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
    throw new Error('Slideswitch not found!');
  }

  switch (typeof prop) {
    case 'object':
      break;
    case 'null':
    case 'undefined':
      prop = {};
      break;
    case 'function':
      prop = {change: prop};
      break;
    default:
      prop = {value: prop};
  }

  update(el, prop.value, undefined, origin || 'control');

  if (prop.change) {
    el.on('change', prop.change);
  }

  if ('value' in prop) {
    el.find('input').prop('checked', prop.value);
  }

  return el.find('input').prop('checked');
};

function onClick(ev) {  // {{{2
  ev.stopPropagation();
};

function update(el, value, origin) {  // {{{2
  switch (value) {
    case undefined:
      value = el.find('input').prop('checked');
      break;
    case true:
    case 'on':
      value = true;
      break;
    case false:
    case 'off':
      value = false;
      break;
  }

  value = el.find('input').prop('checked', value);
};

// }}}1
/* COMMENTS {{{1
function onGesture(ev) {  // {{{2
  var input = $(ev.currentTarget).find('input');
  var checked = input.prop('checked');

  if (ev.type === 'dragstart') {
    var direction = ev.gesture.direction;
    if ((direction !== 'left') && direction !== 'right') {
      return;
    } else {
      if (! checked && (direction === 'right')) {
        input.prop('checked', true);
      } else if (checked && (direction === 'left')) {
        input.prop('checked', false);
      }
    }
  } else if (ev.type === 'tap') {
    input.prop('checked', ! 'checked');
  }

  ev.gesture.preventDefault();
  ev.preventDefault();
  ev.stopPropagation();
  return false;
};

}}}1 */
