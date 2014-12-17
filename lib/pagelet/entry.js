'use strict';

var Ose = require('ose');
var M = Ose.class(module, C);

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption Entry pagelet socket
 *
 * @readme
 * Extension for entry pagelet classes.
 *
 * @class bb.lib.pagelet.entry
 * @type class
 */

// }}}1
// Public {{{1
function C(pagelet, entry, req) {
//  console.log('PAGELET ENTRY', pagelet.stateObj);

  this.pagelet = pagelet;
  pagelet.socket = this;

  if (! req) {
    req = {
      drev: 1,
      dtrack: true,
    };
  }

  Ose.link.prepare(this);

  if (entry) {
    entry.linkSlave(req, this);
  } else {
    Ose.spaces.link(
      {
        space: pagelet.stateObj.space,
        shard: pagelet.stateObj.shard,
        entry: pagelet.stateObj.entry,
      },
      req,
      this
    );
  }

  return;
};

exports.open = function(req) {  // {{{2
//  console.log('PAGELET ENTRY OPEN', this.pagelet.id, JSON.stringify(req));

  this.update(req);
};

exports.close = function(req) {  // {{{2
  this.pagelet.afterDisplay();

  delete this.pagelet.socket;
  delete this.pagelet;
};

exports.error = function(err) {  // {{{2
  switch (err.code) {
  case 'DISCONNECTED':
  case 'UNREACHABLE':
    // TODO Do this better.
//    setTimeout(this.pagelet.loadData.bind(this.pagelet), 100);

    break;
  default:
    M.log.error(err);

    break;
  }

  this.close();
};

exports.update = function(req) {  // {{{2
//  console.log('PAGELET ENTRY SOCKET UPDATE', this.pagelet.id, JSON.stringify(req));

  var p = this.pagelet;

  if (p.removed()) {
    Ose.link.error(this, Ose.error(this, 'REMOVED'));
    return;
  }

  if (! p.entry) {
    p.setEntry(this.link.entry);
    if (! this.link.entry.synced) {
      this.pagelet.markSynced(false);
    }
    return;
  }

  if (('drev' in req) && p.updateData) {
    p.updatingData = true;
    p.updateData(req.data);
    delete p.updatingData;
  }

  if (('srev' in req) && p.updateState) {
    p.updatingState = true;
    p.updateState(req.state);
    delete p.updatingState;
  }

  if ('synced' in req) {
    this.pagelet.markSynced(req.synced);

    if (p.updateSync) {
      p.updatingSync = true;
      p.updateSync(req.synced);
      delete p.updatingSync;
    }
  }

  p.afterDisplay();

  return;
};

// }}}1
