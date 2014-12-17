'use strict';

var Ose = require('ose');
var M = Ose.module(module);

/** Doc {{{1
 * @class bb.lib
 */

// Public {{{1
exports.lastStateObj = null;  // {{{2
/**
 * Last displayed "page bit" key object.
 *
 * @property lastStateObj
 * @type Object
 */

exports.defaultContent = {pagelet: 'dashboard'};  // {{{2
/**
 * Pagelet displayed by default
 *
 * @property defaultContent
 * @type Object
 */

/**
 * Fired when UI is initialized
 *
 * @event initialized
 */

exports.config = function(name, data) {  // {{{2
/**
 * OSE plugin configuration method.
 *
 * @param name {Object} Configuration name
 * @param data {Object} Configuration data
 *
 * @method config
 */

  Ose.ui = require('./index');

  this.configData = data;

  $.cookie.json = true;

  Ose.peers.gw.once('connected', this.run.bind(this));
//  Ose.plugins.on('initialized', this.run.bind(this));
};

exports.run = function() {  // {{{2
/**
 * Internal OSE UI startup method
 * Emits the "initialized" event
 *
 * @method run
 */

  bindVisibility(this);

  $(window)
    .on('popstate', onPopstate.bind(this))
    .on('resize', onResize.bind(this))
    .on('unload', onUnload.bind(this))
    .on('keypress', onKeypress.bind(this))
  ;

  this.leftBox = new (M.class('./box/left'))();
  $('body').append(this.leftBox.html());

  this.contentBox = new (M.class('./box/content'))();
  $('body').append(this.contentBox.html());

  this.rightBox = new (M.class('./box/right'))();
  this.contentBox.$().append(this.rightBox.html());
  this.rightBox.hide();

  this.leftBox.registerEdgeEvents();
  this.leftBox.addLink('Dashboard', 'dashboard', onTapDashboard.bind(this));
//  this.leftBox.addLink('Expand hash', 'expandHash', expandHash.bind(this));
  this.leftBox.addLink('Show URI QR code', 'showQRCode', showQRCode.bind(this));
//  this.leftBox.addLink('Install hosted webapp', 'installHostedWebapp', installHostedWebapp.bind(this));

  if (this.isMobile()) this.checkOrientation();
  else this.leftBox.width = '40%';

  M.log.notice('UI initialized');

  var cookie = $.cookie('ose');
  if (cookie) {
    this.lastHistory = parseInt(cookie.lastHistory) || 0;
  } else {
    this.lastHistory = 0;
  }

  var match = window.location.hash.match(/^#h(\d+)/);
  var last = (match && parseInt(match[1])) || 0
  if (last > this.lastHistory) {
    this.lastHistory = last;
  }

  var stateObj =
    decodeHash(this, window.location.hash) ||
    cookie && cookie.stateObj ||
    {content: this.defaultContent};
  ;

  window.history.replaceState(stateObj, '');
  this.display(stateObj, 'init');

  $('#oseLoading').remove();
};

exports.newHistory = function() {  // {{{2
/**
 * Creates a new empty state item to the browser's history
 *
 * @method newHistory
 */

  window.history.pushState({}, '', '#h' + ++this.lastHistory);

//  console.log('NEW HISTORY', this.lastHistory);
};

exports.updateHistory = function() {  // {{{2
/**
 * Updates the last history item with the current state object
 *
 * @method updateHistory
 */

  window.history.replaceState(this.getStateObj(), '');

//  console.log('UPDATE HISTORY', JSON.stringify(window.history.state));
};

exports.display = function(stateObj, source) {  // {{{2
/**
 * Displays or updates ui based on the state object.
 *
 * @param stateObj {Object} State object
 * @param source {String 'user'|'history'} Source of the call
 *
 * @method display
 */

//  console.log('NEW StateObj', {lastSource: this.lastSource, source: source, expandHash: this.expandHash}, JSON.stringify(stateObj));

  if (! source) source = 'user';

  switch (this.lastSource) {
    case 'init':
    case 'user':
      if (source !== 'history') {
        this.updateHistory();
      }
      break;
  }

  if (
    (source === 'user') &&
    (! (this.leftBox.visible() || this.contentBox.search.visible()))
  ) {
    this.newHistory();
  }

  this.lastSource = source;

  this.leftBox.hide(true);
  this.contentBox.display(stateObj.content, source);
  this.rightBox.display(stateObj.right, source);

  if (this.dialog/* && stateObj.dialog*/) {
    this.dialog.$().remove();
    delete this.dialog;
  }

  switch (source) {
    case 'user':
      this.updateHistory();

      break;
    case 'history':
      if (this.expandHash) {
        window.history.replaceState(stateObj, '', '#' + encodeURIComponent(JSON.stringify(stateObj)));
        delete this.expandHash;
      }

      break;
  }

  return;
};

exports.bindContent = function(stateObj) {  // {{{2
/**
 * Creates new event handler that calls the "Ose.ui.display(stateObj)"
 *
 * @param stateObj {Object} State object to be displayed
 *
 * @returns {Function} Event handler calling "Ose.ui.display(stateObj)"
 *
 * @method bindContent
 */

  return function(ev) {
    Ose.ui.display({content: stateObj}, 'user');  // ev.ctrlkey

    return false;
  };
};

exports.scrollToTop = function(el) {  // {{{2
/**
 * Scroll element to the top of the screen.
 *
 * @param el {Object} jQuery element to be scrolled to the top
 *
 * @method scrollToTop
 */

  if (! (el instanceof jQuery)) el = $(el);

  $('section.content').animate({
    scrollTop: el.offset().top + $('section.content').scrollTop() - $('header.fixed').height()
  }, 100);
};

exports.handleHover = function(el) {  // {{{2
/**
 * Handle hovering
 *
 * @param el {Object} jQuery element
 *
 * @returns TODO
 *
 * @method handleHover
 */

  return M.log.missing('Hover');

  if (typeof el === 'string') el = $(el);

  el.hover(hover, unhover);

  function hover() {  // {{{3
    $(this).addClass('ui-btn-hover-c');
  };

  function unhover() {  // {{{3
    $(this).removeClass('ui-btn-hover-c');
  };

  // }}}3
};

exports.newDialog = function(type, prop) {  // {{{2
/**
 * Creates and displays a new dialog.
 *
 * @param type {String} Dialog type
 * @param prop {Object} Properties object
 *
 * @returns {Object} Dialog instance object
 *
 * @method newDialog
 */

  if (this.dialog) {
    M.log.unhandled('Dialog already exist');
    return;
  }

  if (type.indexOf('/') < 0) {
    type = './dialog/' + type;
  }

  this.dialog = new (M.class(type))();
  this.dialog.id = Ose._.uniqueId('dlg');

  var el = this.dialog.html(prop);
  el.prop('id', this.dialog.id);
  if (prop && this.dialog.update) {
    this.dialog.update(el, prop, 'new');
  }

  this.newHistory();
  this.updateHistory();

  return this.dialog;
};

exports.closeDialog = function(el) {  // {{{2
/**
 * Closes a dialog
 *
 * @prop el {Object} Dialog jQuery element
 *
 * @method closeDialog
 */

  el.remove();
  delete Ose.ui.dialog;
  history.back();
};

exports.getStateObj = function() {  // {{{2
/**
 * Gets state object
 *
 * @returns {Object} State object
 *
 * @method getStateObj
 */
//  console.log('GET STATE OBJ', this.rightBox.content);

  var result = {};

  if (this.contentBox.content) {
    result.content = this.contentBox.content.stateObj;
  }

  if (this.rightBox.content && this.rightBox.content.visible()) {
    result.right = this.rightBox.content.stateObj;
  }

  if (this.dialog) {
    result.dialog = true;
  }

  return result;
};

exports.isMobile = function()  {
/**
 * Tests whether the UI is displayed in a mobile browser
 *
 * @returns {Boolean}
 *
 * @method isMobile
 */

  var mobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (mobile.Android() || mobile.BlackBerry() || mobile.iOS() || mobile.Opera() || mobile.Windows());
    }
  };

  if (mobile.any()) return true;
  else return false;
};

exports.checkOrientation = function() {
/**
 * Checks browser orientation
 *
 * @method checkOrientation
 */

  var that = this;
  var mql = window.matchMedia('(orientation: portrait)');

  if (mql.matches) {
    this.portrait();
  } else {
    this.landscape();
    this.leftBox.width = window.screen.height * 0.8;
  }

  mql.addListener(function(m) {
    if (m.matches) {
      that.portrait();
    } else {
      that.landscape();
    }
  });
};

exports.portrait = function() {
/**
 * Switch to portrait mode
 *
 * @method portrait
 */

  this.leftBox.width = '80%';
  if (this.leftBox.visible()) this.leftBox.show();
};

exports.landscape = function() {
/**
 * Switch to landscape mode
 *
 * @method landscape
 */

  this.leftBox.width = window.screen.height * 0.8;
  if (this.leftBox.visible()) this.leftBox.show();
};

// }}}1
// Event Handlers {{{1
function onPopstate(ev) {  // {{{2
//  console.log('POP STATE', window.history.state);

  this.display(window.history.state, 'history');
};

function onUnload(ev) {  // {{{2
  this.updateHistory();
//  window.history.replaceState(this.getStateObj(), '');

  $.cookie(
    'ose',
    {
      stateObj: window.history.state,
      lastHistory: this.lastHistory
    },
    {
      expires: 1,
      path: '/'
    }
  );
}

function onResize(ev) {  // {{{2
  $('.handleResize').each(function() {
    $(this).triggerHandler('resize');
  });
};

function onKeypress(ev) {  // {{{2
  if (this.currentPage && this.currentPage.bit.mainKeypress) {
    if (this.currentPage.bit.mainKeypress(ev) === false) return false;
    if (ev.isPropagationStopped()) return;
  }

  switch (ev.keyCode || ev.which) {
    case 27: // Escape
      return false;
  }
};

function onTapDashboard(ev) {  // {{{2
  this.display({content: this.defaultContent});

  return false;
};

function expandHash() {  // {{{2
  this.expandHash = true;
  this.leftBox.hide(true);
};

function showQRCode() {  // {{{2
  this.leftBox.hide(true);

  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + '#' + encodeURIComponent(JSON.stringify(this.getStateObj()));

  var dialog = Ose.ui.newDialog('info', {
//    caption: 'URL QR Code',
    caption: url
  });

  var section = dialog.$(' section');

  section.on('click', dialog.close.bind(dialog));

  new QRCode(section[0], {
    text: url,
    width: '200',
    height: '200',
    colorDark : '#000000',
    colorLight : '#ffffff',
    correctLevel : QRCode.CorrectLevel.H
  });

  dialog.$(' img').css({
    'border-style': 'solid'
  });

  section.css({
    'text-align': 'center'
  });
};

function installHostedWebapp() {
  if (navigator.mozApps && navigator.mozApps.install) {
    console.log('Can install mozApp');
    var manifestUri = window.location.protocol + '//' + window.location.host + '/ose-bb/webapp/manifest.webapp';
    var req = navigator.mozApps.install(manifestUri);

    req.onsuccess = function(data) {
      console.log("Success, app installed!");
      navigator.mozApps.install.triggerChange('installed');
    };

    req.onerror = function(err) {
      M.log.unhandled("Webapp  install failed\n\n:" + req.error.name);
    };
  }

  this.leftBox.hide();
}

// }}}1
// Private {{{1
function bindVisibility(that) {
  // Set the name of the hidden property and the change event for visibility
  var hidden, visibilityChange;
  if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  if (typeof hidden === 'undefined') {
    M.log.unhandled('Visibility API is not supported');
    return false;
  }

  $(document).on(visibilityChange, function onChange() {
    if (that.visibilityTimeout) {
      clearTimeout(that.visibilityTimeout);
      delete that.visibilityTimeout;
    }

    if (document[hidden]) {
//      console.log('DOCUMENT HIDE');

      that.visibilityTimeout = setTimeout(function() {  // Wait 10 seconds before peer disconnect.
        delete that.visibilityTimeout;
        Ose.peers.disconnect();
      }, 10000);
    } else {
//      console.log('DOCUMENT SHOW');

      Ose.peers.connect();
    }
  });

  return true;
};

function decodeHash(that, hash) {  // {{{2
  // returns object containing key for content eventualy other pagelets or null.

//  console.log('DECODE HASH', hash);

  switch (typeof hash) {
    case 'undefined':
      return null;
    case 'object':
      return hash;
    case 'string':
      var match = hash.match(/^#h(\d+)/);

      if (match) {  // Hash is history item.
        return null;
      }

      if (hash.charAt(0) === '#') hash = hash.substr(1);

      if (! hash) {
        return null;
      }

      try {
        return JSON.parse(hash);
      } catch (error) {
        return JSON.parse(decodeURIComponent(hash));
      }
  }

  return null;
};

// }}}1
/* COMMENTS {{{1
function onDragend(data, ev) {  // {{{2
  $('body')
    .removeClass('unselectable')
    .off('panmove', data.dragHandle)
    .off('panend', data.dragendHandle)
  ;

  delete this.dragging;

  data.end && data.end(ev, data);

  return false;
};

exports.startDrag = function(data) {  // {{{2
  if (this.dragging) {
    return null;
  }

  if (typeof data === 'function') {
    data = {drag: data};
  }

  this.dragging = data;

  $('body')
    .addClass('unselectable')
    .on('panend', data.dragendHandle = onDragend.bind(this, data))
  ;

  if (data.drag) {
//    $('body').on('drag', data.dragHandle = Ose._.throttle(data.drag, 5));
//    $('body').on('drag', data.dragHandle = Ose._.throttle(data.drag, 25));
    $('body').on('panmove', data.dragHandle = data.drag);
  }

  return data;
};

// }}}1 */
