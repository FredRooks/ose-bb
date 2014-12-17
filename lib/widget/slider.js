'use strict';

var Ose = require('ose');
var M = Ose.class(module, './index');

/** Docs {{{1
 * @submodule bb.widget
 */

/**
 * @caption Slider widget
 *
 * @readme
 * Widget for displaying and controlling HTML sliders.
 *
 * @class bb.lib.widget.slider
 * @type class
 * @extends bb.lib.widget
 */

// Public {{{1
exports.html = function(prop) {  // {{{2
  var button = $('<button>', {})
    .on('click', onButtonClick.bind(this))
    .append('handler')
  ;

  var hammer = new Hammer(button[0]);
  hammer.get('pan').set({direction: Hammer.DIRECTION_HORIZONTAL});
  button.on('panstart', onDragstart.bind(this));
  button.on('panend', onDragend.bind(this));
  button.on('panmove', Ose._.throttle(onDrag.bind(this), 50));

  /*
          swipe: false,
          dragLockToAxis: true,
          dragBlockVertical: true,
          dragup: false,
          dragdown: false
        })
//        .on('dragstart', onDragstart.bind(this))
        .on('panstart', onDragstart.bind(this))
*/

  var result = $('<div>', {
    role: 'slider',
    'class': 'handleResize'
  })
    .on('click', onClick.bind(this))
    .on('mouseup', onMouseup.bind(this))
    .on('resize', Ose._.throttle(onResize.bind(this), 200))
    .append($('<span>'))
    .append($('<div>')
      .append($('<progress>', {}))
      .append(button)
    )
  ;

  return result;
};

exports.val = function(el) {  // {{{2
  return this.value;
};

exports.update = function(el, prop, origin) {  // {{{2
  switch (typeof el) {
    case undefined:
    case 'number':
    case 'string':
      el = this.$();
      break;
  }

  if (! ((el instanceof jQuery) && (el.length === 1))) {
    throw new Error('Slider not found!');
  }

  var progress = el.find('progress');

  switch (typeof prop) {
    case 'object':
      break;
    case 'null':
    case 'undefined':
      prop = {};
      break;
    case 'function':
      prop = {change: prop};
      break;
    default:
      prop = {value: prop};
  }

  if (! ('value' in this)) {
    if (! ('min' in prop)) prop.min = 0;
    if (! ('max' in prop)) prop.max = 100;
    if (! ('value' in prop)) prop.value = prop.min;
  }

  if ('label' in prop) el.find('span').text(prop.label);

  if (('min' in prop) && (this.min !== prop.min)) {
    this.min = prop.min;
    el.attr('aria-valuemin', this.min);
    progress.attr('min', this.min);
  }

  if (('max' in prop) && (this.max !== prop.max)) {
    this.max = prop.max;
    el.attr('aria-valuemax', this.max);
    progress.attr('max', this.max);
  }

  if ('value' in prop) {
    if (this.dragging) delete prop.value;  // Disable remote value change when user is dragging.
  }

  if ('hide' in prop) {
    if (prop.hide) {
      el.hide();
    } else {
      el.show();
    }
  }

  if ('change' in prop) {
    el.off('change');

    if (prop.change) {
      el.on('change', prop.change);
    }
  }

  switch (typeof prop.state) {
    case 'undefined':
      break;
    case 'object':
      if (prop.state === null) {
        delete this.buttonClick;
      } else {
        M.log.unhandled('Button click handler', prop.state);
      }

      break;
    case 'function':
      this.buttonClick = prop.state;

      break;
    case 'boolean':
    case 'number':
    case 'string':
      if (prop.state) {  // TODO: Shouldn't be this condition reversed? Or better property name?
        el.removeClass('disabled')
      } else {
        el.addClass('disabled')
      }
      break;
    default:
      M.log.unhandled('Unexpected value of prop.state.', prop.state);
  };

  if ('duration' in prop) {
    var duration = prop.duration;

    switch (duration) {
      case 0:
      case '0':
      case false:
      case null:
      case undefined:
        duration = 0;
        break;
      case true:
        duration = this.max - this.min;
    }

    switch (typeof duration) {
      case 'number':
        break;
      case 'string':
        duration = parseFloat(duration);
        if (isNaN(duration)) {
          duration = 0;
          M.log.unhandled('Duration cannot be parsed to float.', prop.duration);
        }
        break;
      default:
        M.log.unhandled('Invalid duration.');
    }

    if (duration) {
      this.duration = {
        value: duration,
        at: new Date().getTime()
      };
    } else {
      delete this.duration;
    }
  }

  update(this, el, prop.value, undefined, origin || 'control');

  return this.value;
};

// }}}1
// Event Handlers  {{{1
function onResize(ev) {  // {{{2
  update(this, $(ev.currentTarget));
};

function onButtonClick(ev) {  // {{{2
  if (this.ignoreButtonClick) {
    delete this.ignoreButtonClick;
  } else {
    this.buttonClick && this.buttonClick(ev);
  }

  return false;
};

function onClick(ev) {  // {{{2
  update(this, null, null, ev.pageX - this.$(' progress').offset().left, 'click');

  return false;
};

function onDragstart(ev) {  // {{{2
  console.log('DRAGSTART', ev.gesture.direction, ev.gesture.offsetDirection);

  switch (ev.gesture.offsetDirection) {
    case Hammer.DIRECTION_RIGHT:
    case Hammer.DIRECTION_LEFT:

      delete this.duration;

      this.$(' button').stop();

      this.dragging = {
        offset: ev.gesture.pointers[0].pageX
          + parseInt(this.$(' div').css('padding-left'))
          - parseInt(this.$(' button').css('left'))
      };

      return false;
  }

  return;
};

function onDrag(ev) {  // {{{2
  if (! this.dragging) return;

  switch (ev.gesture.direction) {
    case Hammer.DIRECTION_RIGHT:
    case Hammer.DIRECTION_LEFT:
      update(this, null, null, ev.gesture.pointers[0].pageX - this.dragging.offset, 'drag');

      return false;
  }

  return;
};

function onDragend(ev) {  // {{{2
  if (this.dragging) {
    update(this, null, null, ev.gesture.pointers[0].pageX - this.dragging.offset, 'drag');

    delete this.dragging;
  }

  return false;
};

function onMouseup(ev) {  // {{{2
  if (this.dragging) {
    this.ignoreButtonClick = true;
  }
};

// }}}1
// Private {{{1
function update(that, el, value, pos, origin) {  // {{{2
//  console.log('SLIDER UPDATE', that.id, origin, {value: value, pos: pos, duration: that.duration});

  if (! (el && el.length)) {
    el = that.$();
  }

  var button = el.find('button');
  var padding = parseInt(el.find('div').css('padding-left'));
  var progress = el.find('progress');
  var progressWidth = progress.width();

  switch (value) {
    case undefined:
      if (that.duration && ('start' in that.duration)) {
        value = that.duration.start + (new Date().getTime() - that.duration.at) / 1000;
      } else {
        value = that.value;
      }
      break;
    case null:
    case false:
    case 'off':
      value = that.min;
      break;
    case true:
    case 'on':
      value = that.max;
      break;
    default:
      if (typeof value === 'string') value = parseInt(value);
  }

  if (pos === undefined) {
    if (value < that.min) value = that.min;
    if (value > that.max) value = that.max;

    pos = progressWidth * value / (that.max - that.min);
  } else {
    if (pos < 0) pos = 0;
    if (pos > progressWidth) pos = progressWidth;

    value = (that.max - that.min) * (pos / progressWidth);
  }

  if ((typeof value !== 'number') || isNaN(value)) {
    throw new Error('Can\'t set NaN values to el! ' + value);
  }

  that.value = value;

  button
    .stop()
    .css('left', pos + padding)
  ;

  el.attr('aria-valuenow', value);
  el.val(value);
  progress.val(value);

  switch (origin) {
    case 'click':
    case 'drag':
      delete that.duration;
      el.trigger('change');
      break;
    default:
      if (that.duration) {
        animate();
      }
  }

  function animate() {  // {{{3
    if (! ('start' in that.duration)) {
      that.duration.start = that.value;
    }

    var wait = button.width() * that.duration.value / progressWidth / 4;
    if (wait > 1000) {
      wait = 1000;
    }

    button
      .stop()
      .animate(
        {
          left: progressWidth + padding
        }, {
          easing: 'linear',
          duration: Math.round(that.duration.value * (that.max - value) / that.max),
          progress: Ose._.throttle(onProgress, wait, {leading: false})
        }
      )
    ;
  };

  function onProgress(anim) {  // {{{3
    if (! that.duration) {
      return;
    }

    that.value = (that.max - that.min) * (parseFloat(button.css('left')) - padding) / progressWidth;

    el.attr('aria-valuenow', that.value);
    el.val(that.value);
    progress.val(that.value);

    return;
  };

  // }}}3
};

// }}}1
