'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption List widget
 *
 * @readme
 * Widget for displaying simple HTML lists.
 *
 * @class bb.lib.widget.list
 * @type class
 * @extends bb.lib.widget
 */

// Public
exports.html = function() {
  return $('<div>', {'data-type': 'list'})
    .append($('<ul>'))
  ;
};
