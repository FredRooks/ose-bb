'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.pagelet
 */

/**
 * @caption List of entries pagelet
 *
 * @readme
 * Pagelet for displaying lists of entries
 *
 * @class bb.lib.pagelet.list
 * @type class
 * @extends bb.lib.pagelet
 */

// Public {{{1
exports.layout = 'list';

exports.loadData = function(cb) {  // {{{2
  var that = this;

  if (cb) {
    this.doAfterDisplay = cb;
  }

  if (this.stateObj.showAdd === false) {
    this.showAdd = false;
  }

  if (this.stateObj.shard) {
    Ose.spaces.findShard(this.stateObj, onShard);
  } else {
    this.scope = Ose.scope(this.stateObj.scope);

    if (this.stateObj.space) {
      Ose.spaces.get(this.stateObj.space, onSpace);
    } else {
      setup();
    }
  }

  function onShard(err, shard) {  // {{{3
    if (err) {
      M.log.error(err);

      that.afterDisplay();
    } else {
      that.shard = shard;
      that.scope = shard.scope;

      setup();
    }
  };

  function onSpace(err, space) {  // {{{3
    if (err) {
      M.log.error(err);

      that.afterDisplay();
    } else {
      that.space = space;

      setup();
    }
  };

  function setup() {  // {{{3
    that.kind = that.scope.kinds[that.stateObj.kind];
    if (that.kind) {
      var layout = that.kind.getLayout('list', that.stateObj.layout);
      if (layout) {
        for (var key in layout) {
          that[key] = layout[key];
        }
      }
    }

    that.$()
      .attr('data-type', 'list')
      .empty()
      .append($('<ul>'))
    ;

    that.printHeader();

    if (that.displayLayout) {
      that.displayLayout();
    }

    that.update(that.stateObj, true);
  };

  // }}}3
};

exports.verifyStateObj = function(data) {  // {{{2
  if (data.pagelet !== 'list') return false;

  if (data.layout && (this.stateObj.layout !== data.layout)) return false;

  if (data.space) {
    if (! this.space) return false;
    if (this.space.name !== data.space) return false;
  }

  if (data.shard) {
    if (! (this.shard && this.shard.isIdentified(data))) return false;
  }

  if (data.scope && ! (this.scope && this.scope.name === data.scope)) return false;

  if (data.kind && ! (this.kind && this.kind.name === data.kind)) return false;

  return true;
};

exports.update = function(stateObj, force, keep) {  // {{{2
/**
  * Call to update list
  *
  * @param stateObj {Object} New state object
  * @param force {Boolean} If true, perform update even though stateObj is unchanged.
  * @param keep {Boolean} Keep non-persistent list items.
  *
  * @method update
  */

  if (
    ! force &&
    Ose._.isEqual(stateObj.filter, this.stateObj.filter) &&
    Ose._.isEqual(stateObj.sortby, this.stateObj.sortby)
  ) {
    return;
  }

  if (stateObj.filter) {
    this.stateObj.filter = stateObj.filter;
  }

  if (stateObj.sortby) {
    this.stateObj.sortby = stateObj.sortby;
  }

  var params = {
    filter: this.stateObj.filter,
    sortby: this.stateObj.sortby || 'relevance',
    startstateObj: this.stateObj.startstateObj,
    endstateObj: this.stateObj.endstateObj,
    loadMore: stateObj.loadMore
  };

//  console.log('UPDATE', stateObj);

  if (! keep) {
    this.$(' > ul').children(':not(".persistent")').remove();
  }

  if (this.shard) {
    this.shard.getView(
      params,
      onData.bind(this)
    );
  } else if (this.space) {
    M.log.missing();
  } else {
    this.scope.getView(
      this.kind && this.kind.name,
      params,
      onData.bind(this)
    );
  }

  if (! force) {
    Ose.ui.updateHistory();
  }

  return;
};

exports.printListEntry = function(entry) {  // {{{2
/**
  * Prints entry list item
  *
  * @param entry {Object} Entry instance to be printed
  *
  * @method printListEntry
  */

  if (! this.kind) {
    var unit = entry.kind.getLayout('list', this.stateObj.layout);
    if (unit && unit.printListEntry) {
      unit.printListEntry.call(this, entry);
      return;
    }
  }

  var pagelet = this.newPagelet({
    pagelet: 'listItem',
  });

  pagelet.html()
    .on('click', onTap.bind(this))
    .appendTo(this.$(' > ul'))
  ;

  pagelet.loadData(null, entry);

  return;
};

exports.printHeader = function() {  // {{{2
/**
  * Prints list header
  *
  * @method printHeader
  */

  var that = this;
  var header = this.$('header');

  $('<span>').appendTo(header);

/*
  if (this.showAdd) {
    $('<a>', {
      href: '#',
      'data-role': 'button',
      'data-icon': 'add',
      'data-iconpos': 'left',
      'data-mini': true,
      'data-inline': true
    })
    .append('Add ' + this.kind.name)
    .appendTo(header.children('span:first'))
    .on('click', (this.onTapAdd ? this.onTapAdd.bind(this) : onTapAdd))
    ;
  } else {
    header.children('span:first').append(this.kind.name);
  }
*/

  if (this.kind) {
    header.children('span:first').append('"' + this.kind.name + '" list');
  }

  if (this.showLabels) {
    $('<a>', {
      href: '#',
      'data-role': 'button',
      'data-inline': true,
      'data-mini': true,
    })
    .append('Labels')
    .appendTo(header.children('span'))
    .on('click', onTapLabels)
    ;
  }

  function onTapAdd() {  // {{{3
    Ose.ui.newPage({
      pagelet: 'add',
      space: that.stateObj.space,
      scope: that.stateObj.scope,
      kind: that.stateObj.kind,
      data: that.generateAddData(),
      dialog: true
    });
  }

  function onTapLabels(ev) {  // {{{3
    M.log.missing();
    /*
    var popup = Ose.classes.object('ose-bb/lib/pagelet/popup', ev.currentTarget);

    var listBit = popup.displayBit({
      bit: 'list',
      space: that.stateObj.space,
      scope: that.stateObj.scope,  // TODO generalize
      kind: 'label'
    });

    listBit.tapItem = select;

    return false;

    function select(id) {
      switch (id) {
        case 'all':
          that.update({});
          break;

        case 'unsolved':
          that.update({unsolved: true});
          break;

        default:
          that.update({label: id});
      }

      popup.close();
    }
    */
  }

  // }}}3
};

exports.onSearch = function(value) {  // {{{2
  var filter = JSON.parse(JSON.stringify(this.stateObj.filter || {}));

  filter.search = value;

  this.update({filter: filter});
};

// }}}1
// Event Handlers {{{1
function onData(err, data) {  // {{{2
//  console.log('LIST ON DATA', err, data);

  if (err) {
    M.log.error(err);

    this.afterDisplay();

    return;
  }

  var that = this;

  if (this.displayData) this.displayData(data);

  if (this.shard) {
    onShard(this.shard, data);
  } else if (this.space) {
    onSpace(data, null, this.space);
  } else {
    for (var key in data.view) {
      Ose.spaces.get(key, onSpace.bind(null, data.view[key]));
//      onShard(Ose.shards[key], data.view[key]);
    }
  }

  this.afterDisplay();

  return;

  function onSpace(view, n, space) {
    for (var key in view) {
      onShard(space.shards[key], view[key]);
    }
  };

  function onShard(shard, view) {
    for (var i = 0; i < view.length; i++) {
      shard.get(view[i], onEntry);
    }
  };

  function onEntry(err, entry) {
//    console.log('PAGELET LIST ON ENTRY', arguments);

    if (err) {
      M.log.error(err);
    } else {
      that.printListEntry(entry);
    }
  }
};

function onTap(ev) {  // {{{2
//  console.log('LIST PAGELET ON TAP', ev, this.stateObj);

  var li = $(ev.currentTarget);
  var pagelet = li.prop('ose');

  if (this.tapItem) {
    this.tapItem(ev, pagelet);
  } else {
    pagelet && pagelet.tapItem && pagelet.tapItem(ev);
  }

  return false;
};

// }}}1
