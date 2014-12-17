'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

var Socket = M.class('./entry');

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption Detail pagelet
 *
 * @readme
 * Pagelet for displaying entry detail
 *
 * @class bb.lib.pagelet.detail
 * @type class
 * @extends bb.lib.pagelet
 */

// Public {{{1
exports.layout = 'detail';  // {{{2
/**
 * The layout that extends this pagelet
 *
 * @type String
 * @property layout
 */

exports.loadData = function(cb, entry) {  // {{{2
  if (cb) {
    this.doAfterDisplay = cb;
  }

  if (this.socket) {
    throw Ose.error(this, 'SOCKET_ALREADY_REGISTERED', Ose.identify(this.socket));
  }

  if (entry && entry.kind) {
    this.setEntry(entry);
    return;
  }

  new Socket(this, entry);
  return;
};

exports.post = function(name, data, socket) {  // {{{2
  if (this.entry) {
    this.entry.post(name, data, socket);
  } else {
    Ose.link.error(socket, Ose.error(this, 'NOT_INITIALIZED', 'Entry is not initialized!'));
  }
};

exports.setEntry = function(entry) {  // {{{2
  if (! entry.kind) {
    throw Ose.error(this, 'INVALID_ARGS', 'Entry is not yet initialized!', entry.identify());
    return;
  }

  this.entry = entry;

  var layout = entry.kind.getLayout(this.layout, this.stateObj.layout);

//  console.log('PAGELET ENTRY SET ENTRY', entry.id, layout);

  if (layout) {
    for (var key in layout) {
      this[key] = layout[key];
    }
  }

  this.displayData && this.displayData();
  this.displayLayout && this.displayLayout();

  if (this.updateStateKey && ! this.updateState) {
    this.updateState = updateState;
  }

  var req;
  if (this.updateData) {
    req = {
      drev: entry.drev,
      dtrack: true,
    };

    if (entry.data) {
      this.updatingData = true;
      this.updateData(entry.data);
      delete this.updatingData;
    }
  }

  if (this.updateState) {
    if (! req) req = {};
    req.srev = entry.srev;
    req.strack = true;

    if (entry.state) {
      this.updatingState = true;
      this.updateState(entry.state);
      delete this.updatingState;
    }
  }

  if (entry.synced && this.updateSync) {
    this.updatingSync = true;
    this.updateSync(entry.synced);
    delete this.updatingSync;
  }

  if (req) {
    if (this.socket) {
      this.socket.link.track(req);
    } else {
      new Socket(this, entry, req);
    }
  } else {
    this.afterDisplay();
    if (this.socket) {
      Ose.link.close(socket);
    }
  }
};

exports.verifyStateObj = function(data) {  // {{{2
  if (data.pagelet !== 'detail') return false;

  if (data.layout && (this.stateObj.layout !== data.layout)) return false;

  return this.entry.isIdentified(data);
};

exports.displayData = function() {  // {{{2
/**
 * Displays entry data based on "this.profile". This method gets
 * called once after entry data are loaded. It can be overridden in
 * the layout file for custom data display.
 *
 * @method displayData
 */

  var that = this;

  this.$()
    .empty()
    .attr('data-type', 'list')
    .append($('<ul>'))
  ;

  var caption = $('<span>', {'class': 'pageletCaption'}).appendTo(this.$('header'));

  if (this.entry.kind.data) {
    this.items = this.entry.kind.data.getFields(this.entry.data, this.profile, createViewer);

    for (var i = 0; i < this.items.length; i++) {
      this.displayItem(this.items[i]);
    }
  } else {
    this.items = [];
  }

  this.displayCaption(caption);

  function createViewer(field, data, profile) {  // {{{3
    if (profile.place) {
      if (! profile.order) profile.order = Infinity;
      if (profile.place === 'caption') {
        that.displayCaption = function() {};
        if (! profile.viewer) profile.viewer = 'common';
      }
    }

    var result = new (M.class('ose-bb/lib/field/' + (profile.viewer || 'full')))(that, field, data, profile);

    return result;
  };

  // }}}3
};

exports.updateData = function(data) {  // {{{2
/**
 * Updates the information displayed with updated entry data.
 *
 * @param data {Object} Updated entry data
 *
 * @method updateData
 */

  // TODO Behave differently while editing.
  // TODO Update should change only changed data = use data.

  if (this.entry.kind.data) this.entry.kind.data.iterFields(this.entry.data, this.profile, onField);

  function onField(field, data, profile) {  // {{{3
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];

      if ((item.field === field) && ! _.isEqual(item.data, data)) {
        item.data = data;
        item.update();
      }
    }
  }

  // }}}3
};

exports.findLiByField = function(fieldname) {  // {{{2
  return $('#' + this.findItemByField(fieldname).id);
};

exports.findItemByField = function(fieldname) {  // {{{2
  var field = this.entry.kind.getField(fieldname);

  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];

    if (field === item.field) return item;
  }

  return null;
};

exports.findItemById = function(id) {  // {{{2
  for (var i = 0; i < this.items.length; i++) if (id === this.items[i].id) return this.items[i];

  return null;
};

exports.displayItem = function(item) {  // {{{2
  var el;  // element for item

  if (item.profile.place) {
    if (item.profile.place === 'caption') el = this.$('header > .pageletCaption');
  } else {
    el = $('<li>').appendTo(this.$());
  }

  item.display(el);
  item.update();
};

exports.displayCaption = function(el) {  // {{{2
  el.html(this.entry.getCaption());
};

exports.remove = function() {  // {{{2
  M.super.prototype.remove.call(this);

  if (this.socket) {
    Ose.link.close(this.socket);
    delete this.socket;
  }

  this.afterDisplay();
};

exports.markSynced = function(val) {  // {{{2
  var header = $('section#contentBox > header.fixed');

  if (val) {
    header.css('background-color', '#f97c17');
  } else {
    header.css('background-color', 'gray')
  }
};

// }}}1
// Event Handlers {{{1
function updateState(data) {  // {{{2
/**
 * @param this {Object} Pagelet
 */

  for (var key in data) {
    var result = this.updateStateKey(key, data[key], data);

    if (result === false) {
      M.log.unhandled('Invalid state key!', {entry: this.entry.identify(), kind: this.entry.kind.name, key: key});
    }
  }
}

// }}}1
