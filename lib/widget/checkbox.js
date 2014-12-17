'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption Checkbox widget
 *
 * @readme
 * Widget for displaying and controlling HTML checkboxes.
 *
 * @class bb.lib.widget.checkbox
 * @type class
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {  // {{{2
  var result = $('<label>', {'class': 'pack-checkbox'})
    .on('click', onClick)
    .append($('<input>', {type: 'checkbox'}))
    .append($('<span>'))
  ;

  return result;
};

exports.update = function(el, prop, origin) {
  switch (typeof el) {
    case undefined:
    case 'number':
    case 'string':
      el = this.$();
      break;
  }

  if (! ((el instanceof jQuery) && (el.length === 1))) {
    throw new Error('Checkbox not found!');
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
    el.children('input')
      .prop('checked', prop.value)
      .val(prop.value)
    ;
  }

  if ('disabled' in prop) {
    if (prop.disabled) {
      el.find('input').attr('disabled', 'disabled');
    } else {
      el.find('input').removeAttr('disabled');
    }
  }

  if ('danger' in prop) {
    if (prop.danger) {
      el.addClass('danger');
    } else {
      el.removeClass('danger');
    }
  }
};

exports.val = function(el) {  // {{{2
  return (el || this.$()).find('input').prop('checked');
};

// Event Handlers {{{1
function onClick(ev) {  // {{{2
  var input = $(ev.currentTarget).find('input');
  if (input.attr('disabled')) return false;

  if ($(ev.target).hasClass('danger')) { 
    setTimeout(function() {
      Ose.ui.newDialog('confirm', {
        confirmText: 'Toggle',
        cb: confirm
      });
    }, 0);
  } else {
    toggle();
  }

  return false;

  function confirm(confirmed) {  // {{{3
    if (confirmed) {
      toggle(true);
    } 
  };

  function toggle(confirmed) {  // {{{3
    input.prop('checked', ! input.prop('checked'));
    input.trigger('change', {confirmed: confirmed});
  };

  // }}}3
};

// Private {{{1
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
}

// }}}1
