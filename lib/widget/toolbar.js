'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption Toolbar widget
 *
 * @readme
 * Widget for displaying and controlling button toolbars.
 *
 * @todo 
 * - Completely refactor toolbars and buttons.
 *
 * @class bb.lib.widget.toolbar
 * @type class
 * @extends bb.lib.widget
 */

exports.html = function() {
  //  return $('<div>', {'role': 'toolbar', class: 'ose'});
  return $('<span>', {'role': 'toolbar', class: 'ose'});
};

exports.button = function(icon, cb) {
  this.$().append(
    $('<span ' + 'data-icon="' + icon + '">').on('click', cb)
  );

  return this;
};

exports.update = function(el, prop) {
  for (var key in prop) {
    var val = prop[key];

    switch (val) {
      case false:
      case 'false':
        val = 0;
        break;
      case true:
      case 'true':
        val = 1;
        break;
    }

    switch (typeof val) {
      case 'string':
        val = parseInt(string);
    }

    if (isNaN(val)) val = 0;

      el.find('span[data-icon="' + key + '"]').val(val).attr('value', val);
  }
};
