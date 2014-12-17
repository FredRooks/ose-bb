'use strict';

var Ose = require('ose');
var M = Ose.class(module, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.dialog
 */

/**
 * @caption Value selector dialog
 *
 * @readme
 * Diplays a dialog offering options to select from.
 *
 * @class bb.lib.dialog.valueSelector
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {
  var that = this;

  var ol = $('<ol>', {
    role: 'listbox',
  });

  Ose._.each(prop.options, function(val, key, list) {
    ol.append(addOption(key, val.text));
  });

  var result = $('<form>', {
     id: this.id,
     role: 'dialog',
     tabindex: 1,
     'data-type': 'value-selector'
  })
    .prop('ose', this)
    .on('keypress', onKeypress.bind(this))
    .appendTo('body')
    .append([
      $('<header>').append(
        $('<h1>').text(prop.caption)
      ),
      $('<div>').append(ol),
      $('<menu>').append(
        $('<button>')
          .text('Cancel')
          .css('width', '100%')
          .on('click', this.close.bind(this))
      )
    ])
  ;

  setTimeout(function() {result.focus();}, 0);

  return result;

  function addOption(key, text) {
    var option = $('<li>', {
      role: 'option'
    }).append(
      $('<label>', {role: 'presentation'}).append(
        $('<span>').text(text || key)
      )
    ).on('click', function(ev) {
      if (prop.cb(key)) {
        that.close();
      }

      return false;
    });

    return option;
  }
};

exports.close = function() {
  Ose.ui.closeDialog(this.$());

  return false;
};

// exports.val = function(el) {
// // TODO
// // To set active option:
// //  e.g. $('li#read').attr('aria-selected', true);
// };

// exports.update = function(el, prop, origin) {
// // TODO
// };


function onKeypress(ev) {
  switch (ev.keyCode || ev.which) {
    case 27: // Escape
      this.close();
      return false;
  }
}
