'use strict';

var Ose = require('ose');
var M = Ose.class(module, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.dialog
 */

/**
 * @caption Confirmation dialog
 *
 * @readme
 * Diplays a confirmation dialog with message and two buttons.
 *
 * @class bb.lib.dialog.confirm
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {
  var result = $('<form>', {
     id: this.id,
     role: 'dialog',
     tabindex: 1,
     'data-type': 'confirm'
  })
    .prop('ose', this)
    .appendTo('body')
    .append([
      $('<section>').append([
        $('<h1>').text(prop && prop.caption || 'Confirmation'),
        $('<p>').text(prop && prop.text || 'Are you sure what you are doing?')
      ]),
      $('<menu>').append([
        $('<button>')
          .text(prop && prop.cancelText || 'Cancel')
          .on('click', onCancel)
        ,
        $('<button>', {'class': 'danger'})
          .text(prop && prop.confirmText || 'Confirm')
          .on('click', onConfirm)
      ])
    ])
  ;

  setTimeout(function() {result.focus();}, 0);

  return result;

  function onCancel(ev) {
    Ose.ui.closeDialog(result);

    prop.cb(false);

    return false;
  };

  function onConfirm(ev) {
    Ose.ui.closeDialog(result);

    prop.cb(true);

    return false;
  };
};

exports.close = function() {
  Ose.ui.closeDialog(this.$());

  return false;
};
