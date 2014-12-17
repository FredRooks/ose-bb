'use strict';

var Ose = require('ose');
var M = Ose.class(module, C, '../widget');

// Public {{{1
function C() {
  this.id = 'rightBox';
};

exports.html = function() {
  return $('<section>', {
    id: this.id,
    'class': 'content scrollable header'
  });
};

exports.show = function() {  // {{{2
  this.$().show();
  this.content && this.content.$('header').show();

  if (Ose.ui.contentBox.content) {
    Ose.ui.contentBox.content.$().hide();
    Ose.ui.contentBox.content.$('icons').hide();
    Ose.ui.contentBox.content.$('header').addClass('smallHeading');
  }

  if (this.content) {
    Ose.ui.contentBox.setActive(this.content);
  } else {
    Ose.ui.contentBox.setActive(Ose.ui.contentBox.content);
  }
};

exports.hide = function() {  // {{{2
  this.$().hide();
  this.content && this.content.$('header').hide();

  if (Ose.ui.contentBox.content) {
    Ose.ui.contentBox.content.$('header').removeClass('smallHeading');

    Ose.ui.contentBox.content.show();
  }

  Ose.ui.contentBox.setActive(Ose.ui.contentBox.content);
};

exports.display = function(stateObj, source) {  // {{{2
  var result = null;

  if (! stateObj) {
    if (this.content) {
      this.content.remove();
      delete this.content;
    }

    this.hide();

    return true;
  }

  if (this.content && this.content.verifyStateObj(stateObj, source)) {
    this.content.update && this.content.update(stateObj);
    this.show();
    return this.content;
  }

  result = this.newPagelet(stateObj);
  result.html().appendTo(this.$());

  var header = $('<h1>', {
    id: result.id + 'header',
    'class': 'subHeading',
  })
    .appendTo(Ose.ui.contentBox.$(' > header'))
  ;

  try {
    result.loadData();
  } catch (err) {
    M.log.caught(err);
    header.remove();
    result.remove();
    return false;
  }

  if (this.content) {
    this.content.remove();
  }
  this.content = result;

  result.show();
  this.show();

  return result;
};

// }}}1
