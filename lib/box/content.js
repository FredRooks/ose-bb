'use strict';

var Ose = require('ose');
var M = Ose.class(module, C, '../widget');

/** Docs {{{1
 * @module bb
 * @submodule bb.box
 */

/**
 * @caption Content box
 *
 * @readme
 * Class handling displaying of the main content box on the page.
 *
 * It is placed right in the `<body>` and displays the header and the
 * main content of the application. It also contains widget such as
 * the search box.
 *
 * @class bb.lib.box.content
 * @extends bb.lib.widget
 */

// Public {{{1
function C() {  // {{{2
/**
 * Box initialization
 *
 * @method init
 */

  this.id = 'contentBox';
};

exports.html = function() {  // {{{2
/**
 * Creates HTML representation of content box
 *
 * @return {Object} Section jQuery element
 */

  this.search = new (M.class('../widget/search'))(this);

  return $('<section>', {
    id: this.id,
    role: 'region',
    'data-position': 'current'
  })
    .append($('<header>', {'class': 'fixed'})
      .append($('<button>')
        .append($('<span>', {'class': 'icon icon-menu'}))
        .on('click', Ose.ui.leftBox.bindToggle())
      )
      .append($('<menu>', {type: 'toolbar'})
        .append(this.search.button())
      )
    )
    .append(this.search.form())
  ;
};

exports.display = function(stateObj, source) {  // {{{2
/**
 * Displays content based on stateObj
 *
 * @param stateObj {Object} Object defining what is to be displayed
 * @param source {String}  Where this method is called from
 *
 * @return {Object} Pagelet
 *
 * @method display
 */

  this.search.hide(true);

  if (! stateObj) {
    return null;
  }

  if (this.content && this.content.verifyStateObj(stateObj, source)) {
    this.content.update && this.content.update(stateObj);
    return this.content;
  }

  var result = this.pagelet(stateObj, source);

  if (this.content) {
    this.content.remove();
  }

  this.content = result;

  result.show();

  this.setActive(result);

  return result;
};

exports.pagelet = function(stateObj) {  // {{{2
/**
 * Creates pagelet based on stateObj
 *
 * @param stateObj {Object} Object defining what is to be displayed
 *
 * @return {Object} Pagelet
 *
 * @method pagelet
 */

  var result = this.newPagelet(stateObj);

  var el = result.html();
  el.addClass('content scrollable header');
  this.$().append(el);

  $('<h1>', {
    id: result.id + 'header',
    tabindex: 0
  })
    .appendTo(this.$(' > header'))
  ;

/*
  $('<span>', {
    id: result.id + 'icons',
    tabindex: 0
  })
    .appendTo(this.$(' > header > menu'))
  ;
*/

  result.loadData(done);

  return result;

  function done(err) {
//    console.log('CONTENT BOX PAGELET DONE', err);
    if (err) {
      M.log.error(err);
    }
  }
};

exports.setActive = function(pagelet) {  // {{{2
/**
 * Activates pagelet
 *
 * @param pagelet {Object} Pagelet instance
 *
 * @method setActive
 */
//  console.log('CONTENT SET ACTIVE', pagelet && pagelet.id, pagelet);

  this.activePagelet = pagelet;

  this.search.displayIcon(pagelet && pagelet.onSearch ? true : false);

};

// }}}1
// Private {{{1
// }}}1
