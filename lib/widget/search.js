'use strict';

var Ose = require('ose');
var M = Ose.class(module, C, './index');

/** Docs {{{1
 * @module bb
 * @submodule bb.widget
 */

/**
 * @caption Search widget
 * 
 * @readme
 * Search input field widget.
 *
 * It has two states: One displays a search button, and the other
 * displays a search form.
 *
 * If available, it uses Google's speech API.
 *
 * @description
 * TODO: Move to the widget directory
 *
 * @class bb.lib.widget.search
 * @extends bb.lib.widget
 */

// }}}1
// Public {{{1
function C(box) {  // {{{2
/**
 * Widget initialization
 *
 * @method init
 */

  this.box = box; // TODO
  // this.focusOutAt = 0;
};

exports.button = function() {  // {{{2
/**
 * Creates search button
 *
 * @returns {Object} jQuery object representing button.
 *
 * @method button
 */

  return $('<button>', {'class': 'search'})
    .on('click', onClick.bind(this))
    .append($('<span>', {'class': 'icon action-icon search'}).text('search'))
  ;
};

exports.form = function() {  // {{{2
/**
 * Creates search form
 *
 * @returns {Object} jQuery object representing search form.
 *
 * @method form
 */

  var that = this;
  var searchbox = $('<form>', {role: 'search'})
    //.on('focusout', onFocusout.bind(this))
    .on('submit', onSubmit.bind(this))
    .append($('<span>', {'class': 'btn'})
      .html('Cancel')
      .on('click', onClickCancel.bind(this))
    )
    .append($('<p>')
      .append($('<input>', {
          type: 'text',
          placeholder: 'Search...'
        })
        .on('change', onChange.bind(this))
        .on('keyup', onKeyup.bind(this))
      )
    )
  ;

  if (window.webkitSpeechRecognition) {
    var recognition = new webkitSpeechRecognition();
    //recognition.lang = "en-GB";
    //recognition.lang = "en-US";
    recognition.lang = "cs-CZ";

    recognition.onresult = function(ev) {
      var input = searchbox.find('input');
      var result = event.results[0][0].transcript;

//      console.log('result: ', result);
//      $('header.fixed > h1').text(result);

      input.val(result);
      Ose._.defer(function() {
        input.trigger('change');
//        that.hide();
      });
    }

    $('<span>', {
      'class': 'btn icon media-icon media-artistfilter',
    })
      .on('click tap', function() {
        recognition.start();
      })
      .insertAfter(searchbox.find('span.btn'))
    ;
  }

  return searchbox;
};

exports.displayIcon = function(val) {  // {{{2
  var el = $('section#contentBox > header.fixed button.search');

  if (val) el.show();
  else el.hide();
};

exports.show = function() {  // {{{2
/**
 * Shows search form
 *
 * @method show
 */

  Ose.ui.newHistory();
  Ose.ui.updateHistory();

  var that = this;
  var header = this.box.$(' > header');
  var searchbox = this.box.$(' > form');

  header.hide();
  searchbox.find('input').val('');
  searchbox.show();

  setTimeout(function() {
    searchbox.find('input').focus();
  }, 0);
};

exports.hide = function(noBack) {  // {{{2
/**
 * Hides search form
 *
 * @param noBack {Boolean} If true, do not go back in history.
 *
 * @method hide
 */

  var form =  this.box.$(' > form[role="search"]');

  if (form.is(':visible')) {
    form.hide();
    this.box.$(' > header').show();

    if (! noBack) {
      window.history.back();
    }
  }
};

exports.visible = function() {  // {{{2
/**
 * TODO: Rename to isVisible
 * Check if the search widget is visible.
 *
 * @returns {Boolean}
 *
 * @method visible
 */

  return this.box.$(' > header > form').length > 0;
};

// }}}1
// Event Handlers {{{1
function onSubmit(ev) {  // {{{2
  return false;
};

function onChange(ev) {  // {{{2
  if (this.box.activePagelet && this.box.activePagelet.onSearch) {
    this.box.activePagelet.onSearch($(ev.currentTarget).val());
  }

//  this.hide();

  return false;
};

function onKeyup(ev) {  // {{{2
  switch (ev.keyCode || ev.which) {
    case 27: // Escape
      this.hide();
      return false;
  }
};

function onClick(ev) {
  this.show();
  return false;
}

function onClickCancel(ev) {
  this.hide();

  return false;
};

// }}}1
/* COMMENTED OUT {{{1
function onFocusout(ev) {  // {{{2
  var that = this;

  Ose._.defer(function() {
    if (that.focusOutHandle || $(document.activeElement).parents('header.fixed').length > 0) {
      return;
    }

    that.focusOutHandle = Ose._.defer(function() {
      that.focusOutHandle = 0;
      that.focusOutAt = new Date().getTime();
      that.hide();
    });
  });
};

}}}1 */
