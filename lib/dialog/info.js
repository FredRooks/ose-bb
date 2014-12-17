'use strict';

var Ose = require('ose');
var M = Ose.class(module, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.dialog
 */

/**
 * @caption Information dialog
 *
 * @readme
 * Diplays a dialog with a message
 *
 * @class bb.lib.dialog.info
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {
  var result = $('<form>', {
    id: this.id,
    role: 'dialog',
    tabindex: 1,
    'data-type': 'action' // Necessary for dialog css to work even though this is actually not a action dialog.
  })
    .prop('ose', this)
    .on('keypress', onKeypress.bind(this))
    .appendTo('body')
    .append($('<header>')
      .append($('<h1>').text(prop.caption))
    )
    .append($('<section>'))
    .append($('<menu>')
      .append($('<button>')
        .on('click', this.close.bind(this))
        .text('Close')
      )
    )
  ;

  setTimeout(function() {result.focus();}, 0);

  return result;
};

exports.close = function() {
  Ose.ui.closeDialog(this.$());

  return false;
};

function onKeypress(ev) {
  switch (ev.keyCode || ev.which) {
    case 27: // Escape
      this.close();
      return false;
  }
}
