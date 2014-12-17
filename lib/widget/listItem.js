'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption List item widget
 *
 * @readme
 * Widget for displaying items in HTML lists.
 *
 * @class bb.lib.widget.listItem
 * @type class
 * @extends bb.lib.widget
 */

// Public
exports.html = function(prop) {
  var result = $('<li>');

  switch (typeof prop) {
    case 'string':
      result.append($('<p>').append(prop.value));
      break;
    case 'object':
      if (prop) {
        if (prop.caption) {
          result.append($('<p>').append(prop.caption));
        }

        if (prop.tap) {
          result.on('click', prop.tap);
        }
      }
      break;
  }

  return result;
};

