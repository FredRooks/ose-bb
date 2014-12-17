'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

var Detail = require('./detail');

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption Entry list item pagelet
 *
 * @readme
 * Pagelet for displaying a list item
 *
 * @class bb.lib.pagelet.listItem
 * @type class
 * @extends bb.lib.pagelet
 */

// Public {{{1
exports.layout = 'listItem';
exports.loadData = Detail.loadData;
exports.setEntry = Detail.setEntry;
exports.post = Detail.post;
exports.remove = Detail.remove;

exports.verifyStateObj = function(data) {  // {{{2
  if (data.pagelet !== 'listItem') return false;

  if (data.layout && (this.stateObj.layout !== data.layout)) return false;

  return this.entry.isIdentified(data);
};

exports.html = function(prop) {
  return $('<li>', {id: this.id})
    .prop('ose', this)
    .html('Loading ...')
  ;
};

exports.displayData = function() {  // {{{2
  this.$()
    .empty()
    .append($('<p>')
      .append(this.entry.getCaption())
    )
  ;
};

exports.tapItem = function(ev) {  // {{{2
/**
 * Called when user taps on a list item
 *
 * @prop ev {Object} Tap event object
 *
 * @method tapItem
 */

  Ose.ui.display({content: {
    pagelet: 'detail',
    space: this.entry.shard.space.name,
    shard: this.entry.shard.sid,
    entry: this.entry.id
  }});

  return false;
};

exports.markSynced = function(val) {  // {{{2
  if (val) {
    this.$().prop('aria-disabled', false);
  } else {
    this.$().prop('aria-disabled', true);
  }
};

// }}}1
// Event Handlers {{{1
// }}}1
