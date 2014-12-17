'use strict';

var Ose = require('ose');
var M = Ose.class(module, C, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.box
 */

/**
 * @caption Left box
 *
 * @readme
 * Class handling displaying of left side box.
 *
 * It is placed right in the `<body>` and contains the slidable left
 * sidebar.
 *
 * @class bb.lib.box.left
 * @extends bb.lib.widget
 * @uses bb.lib.box
 */

// Public {{{1
function C() {  // {{{2
/**
 * Box initialization
 *
 * @method init
 */

  this.id = 'leftBox';
  this.hidden = true;
};

exports.html = function() {  // {{{2
/**
 * Creates HTML representation of left box
 *
 * @return {Object} Section jQuery element
 */

  return $('<section>', {
    id: this.id,
    'data-type': 'sidebar'
  }).append(
    $('<nav>', {'class': 'navigation'}).append([
      $('<h2>').text('Navigation'),
      $('<ul>')
    ])
  );
};

exports.addLink = function(caption, name, onTap) {  // {{{2
/**
 * Appends menu item to left box
 *
 * @param caption {String} Text to display
 * @param name {Object} Name of menu item
 * @param onTap {Function} Handler for click event
 *
 * @method addLink
 */

  $('<li>', {'class': name}).append(
    $('<a>').append(caption)
  )
  .on('click', onTap)
  .appendTo(this.$('> nav > ul'))
  ;
};

exports.visible = function() {  // {{{2
/** TODO: Rename to isVisible
 * Tells whether the box is visible.
 *
 * @returns {Boolean} Visibility state
 *
 * @method visible
 */

  return ! this.hidden;
};

exports.show = function() {  // {{{2
/**
 * Shows box
 *
 * @method show
 */

  this.hidden = false;
  var that = this;
  var val = parseInt(this.width) * $('body').width() / 100;

  setTimeout(function() {
    $('#contentBox').css({left: val});
  }, 100);

  Ose.ui.newHistory();
  Ose.ui.updateHistory();
};

exports.hide = function(noBack) {  // {{{2
/**
 * Hides box
 *
 * @param noBack {Boolean} If true, do not revert history state.
 *
 * @method hide
 */

  setTimeout(function() {
    $('#contentBox').css({left: 0});
  }, 100);

  if (! (this.hidden || noBack)) {
    window.history.back();
  }

  this.hidden = true;
};

exports.toggle = function() {  // {{{2
/**
 * Show or hide the box
 *
 * @method toggle
 */

  if (parseInt($('#contentBox').css('left'))) {
    this.hide();
  } else {
    this.show();
  }
};

exports.bindToggle = function() {
/**
 * Binds "this" to the toggle method
 *
 * @return {Function} Bound version of the toggle method
 *
 * @method bindToggle
 */

  return this.toggle.bind(this);
};

exports.registerEdgeEvents = function() {  // {{{2
/**
 * Registers handlers for swipes and slides pertaining to the box.
 *
 * @deprecated
 *
 * @method registerEdgeEvents
 */

  return;
  var contentBox = $('#contentBox');
  var contentBoxHammerObj = new Hammer(contentBox[0]);
  var leftBox = this.$();

  contentBoxHammerObj
    .on('panstart', onPanstart.bind(this))
    .on('panend', onPanend.bind(this))
    .on('swipe', onSwipe.bind(this))
  ;

  function onPanstart(ev) {
    if (Ose.ui.dragging) return false;

    var leftBoxWidth = parseInt(this.width) * $('body').width() / 100;
    var contentBox = $('#contentBox');
    var speed = 10;

    contentBox.addClass('unselectable');
    leftBox.addClass('unselectable');

    contentBoxHammerObj.on('pan', Ose._.throttle(onPan.bind(this), 40));

    return false;

    function onPan(ev) {
      Ose._.throttle(function () {
        var x = ev.center.x;
        speed = parseInt(Math.abs(ev.velocityX) * 80);

        if (x < leftBoxWidth) {
          contentBox.css('left', x);
        } else {
          contentBox.css('left', leftBoxWidth);
        }
      }, speed)();

      return false;
    }
  }

  function onPanend(ev) {
    var contentBox = $('#contentBox');
    var leftBoxWidth = parseInt(this.width) * $('body').width() / 100;

    contentBox.removeClass('unselectable');
    leftBox.removeClass('unselectable');

    if (ev.center.x > leftBoxWidth / 2) {
      this.show('panend', contentBox.css('left'));
    } else {
      this.hide('panend', contentBox.css('left'));
    }
    return false;
  }

  function onSwipe(ev) {
    if (this.hidden && ev.direction === 4 && (ev.center.x - ev.distance) < 50) this.show();
    else if (! this.hidden && ev.direction === 2) this.hide();
    return false;
  }
};

// }}}1
