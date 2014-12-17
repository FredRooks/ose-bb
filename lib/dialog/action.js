'use strict';

var Ose = require('ose');
var M = Ose.class(module, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.dialog
 */

/**
 * @caption Action dialog
 *
 * @readme
 * Diplays a dialog with an action menu
 *
 * @class bb.lib.dialog.action
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {
  console.log('DIALOG: ', prop);

  var menu = $('<menu>');

  var result = $('<form>', {
    id: this.id,
    role: 'dialog',
    tabindex: 1,
    'data-type': 'action'
  })
    .prop('ose', this)
    .on('keypress', onKeypress.bind(this))
    .appendTo('body')
    .append('<header>' + prop.caption + '</header>')
    .append(menu)
  ;

  prop.actions.forEach(function(val, index) {
    menu.append(addAction(index, val.text));
  });

  return result;

  function addAction(key, text) {
    var action = $('<button>', {
      role: 'option'
    }).text(text);
  }
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
