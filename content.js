'use strict';

var Ose = require('ose');
var M = Ose.singleton(module, 'ose/lib/http/content');
exports = M.exports;

/** Docs {{{1
 * @module bb
 */

/**
 * @caption Building Blocks content
 *
 * @readme
 * This singleton defines which files to provide to browsers.
 *
 * @class bb.content
 * @type singleton
 * @extends ose.lib.http.content
 */

// Public  // {{{1
exports.addFiles = function() {  // {{{2
  this.addModule('lib/box/content');
  this.addModule('lib/box/left');
  this.addModule('lib/box/right');
  this.addModule('lib/browser');
  this.addModule('lib/dialog/action');
  this.addModule('lib/dialog/info');
  this.addModule('lib/dialog/confirm');
  this.addModule('lib/dialog/valueSelector');
  this.addModule('lib/index');
  this.addModule('lib/pagelet/dashboard');
  this.addModule('lib/pagelet/detail');
  this.addModule('lib/pagelet/entry');
  this.addModule('lib/pagelet/index');
  this.addModule('lib/pagelet/list');
  this.addModule('lib/pagelet/listItem');
  this.addModule('lib/pagelet/gesture');
  this.addModule('lib/widget/button');
  this.addModule('lib/widget/checkbox');
  this.addModule('lib/widget/index');
  this.addModule('lib/widget/list');
  this.addModule('lib/widget/listItem');
  this.addModule('lib/widget/search');
  this.addModule('lib/widget/slider');
  this.addModule('lib/widget/slideswitch');
  this.addModule('lib/widget/toolbar');

  // 3rdparty dependencies
  this.addHead('node_modules/jquery/dist/jquery.min.js', 2);

  // this.addModule('node_modules/unistroke/stroke.js', 'unistroke');
  this.addModule('node_modules/url/url.js', 'url');
  this.addModule('node_modules/punycode/punycode.js', 'punycode');

  var libs = [
    'hammerjs/hammer.min.js',
    'jquery-hammerjs/jquery.hammer.js',
    'moment/min/moment.min.js'
  ];

  for (var i = 0; i < libs.length; i++) {
    this.addJs('node_modules/' + libs[i]);
  }

  var cssFiles = [
    'style/action_menu',
    'style/buttons',
    'style/confirm',
    'style/edit_mode',
    'style/headers',
    'style/input_areas',
    'style/status',
    'style/switches',
    'style/drawer',
    'style/lists',
    'style/progress_activity',
    'style/scrolling',
    'style/seekbars',
    'style/tabs',
    'style/toolbars',
    'style/value_selector',
    'style/time_selector',
    'style/date_selector',
    'icons/styles/action_icons',
    'icons/styles/media_icons',
    'icons/styles/comms_icons',
    'icons/styles/settings_icons',
    'transitions',
    'util',
    'fonts',
    'cross_browser'
  ];

  for (var i = 0; i < cssFiles.length; i++) {
    this.addCss('depends/Building-Blocks/' + cssFiles[i]);
  }

  this.addCss('depends/gaia-icons-master/gaia-icons-embedded.css');

  this.addCss('css/style');
  this.addCss('css/widgets');

  this.addJs('depends/jquery-cookie/src/jquery.cookie.js');
  //this.addJs('depends/jquery.hammer/jquery.hammer.js');
  this.addJs('depends/jquery.transit/jquery.transit.min.js');
  this.addJs('depends/jquery-visibility/jquery-visibility.js');
  this.addJs('depends/ndollar/ndollar.js');
  this.addJs('depends/pdollar/pdollar.js');
  this.addJs('depends/qrcodejs/qrcode.min.js');
};

// }}}1
