'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

var Detail = require('./detail');

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption Gesture pagelet
 *
 * @readme
 * Pagelet for displaying an entry with the gesture interface.
 *
 * This pagelet creates a canvas on which, for example, gesture traces
 * can be drawn. A transparent `<div>` placed over this canvas is a
 * Hammer.js element registering touch gestures.
 *
 * @class bb.lib.pagelet.gesture
 * @type class
 * @extends bb.lib.pagelet
 */

// Public {{{1
exports.layout = 'gesture';
exports.loadData = Detail.loadData;
exports.setEntry = Detail.setEntry;
exports.post = Detail.post;
exports.remove = Detail.remove;
exports.markSynced = Detail.markSynced;

exports.verifyStateObj = function(data) {  // {{{2
  if (data.pagelet !== 'touch') return false;

  return Entry.verifyStateObj.call(this, data);
};

exports.displayData = function() {  // {{{2
  var that = this;

  $('<span>', {'class': 'bitCaption'})
    .text(this.entry.getCaption() + ' Touch Control')
    .appendTo(this.$('header'))
  ;

  var div = $('<div>', {
    'class': 'touchKeyarea'
  });

  var canvas = $('<canvas>', {'class': 'touchCanvas'});
  this.canvas = canvas[0].getContext('2d');

  this.$()
    .empty()
    .addClass('handleResize')
    .on('resize', onResize.bind(this))
    .css({
      overflow: 'hidden'
    })
    .append(canvas)
    .append($('<menu>', {'class': 'buttonsRight'}))
    .append(div)
  ;

  setTimeout(onResize.bind(this), 100);
};

exports.clearCanvas = function() {
/**
 * Clears the canvas
 *
 * @method clearCanvas
 */

  var canvas = this.$(' > .touchCanvas');

  this.canvas.clearRect(0, 0, canvas.width(), canvas.height());
}

exports.log = function(message, data) {  // {{{2
/**
 * Debug aid method
 *
 * @param message {String}
 * @param data {Object}
 *
 * @method log
 */

  this.$().append('<br/>')
  this.$().append(message, JSON.stringify(data));
};

// }}}1
// Event Handlers {{{1
function onResize() {  // {{{2
  var canvas = this.$(' > .touchCanvas');

  // This looks strange but is actually necessary.
  canvas.prop('width', canvas.width());
  canvas.prop('height', canvas.height());

  this.clearCanvas();
};

// }}}1
