'use strict';

var Ose = require('ose');
var M = Ose.package(module).prepend('browser');
exports = M.init();

/** Docs {{{1
 * @caption Open Smart Environment HTML5 frontend
 *
 * @readme

 * OSE package providing an HTML5 user interface based on [Firefox OS
 * Building Blocks](http://buildingfirefoxos.com/) using
 * [jQuery](http://www.jquery.com).
 *
 * Each browser page (tab) displaying the OSE frontend is an [OSE
 * instance]. As part of the base [OSE plugin] configuration, a
 * [peer], representing the backend OSE instance, is created and
 * connected to.
 *
 * The connection is realized via a WebSocket in a standard OSE
 * [peer-to-peer] way. All information needed for displaying requested
 * content is exchanged through this WebSocket channel. After a
 * successful connection is established, content is displayed using
 * dynamic injection into the `<body>`.
 *
 * @todo
 * The frontend is made to be displayed as a webpage or Firefox OS
 * webapp (currently only hosted).
 *
 *
 * @description
 *
 * ## Initialization
 *
 * When the browser sends an HTML request to a backend (Node.js) OSE
 * instance, this instance responds by generating and providing
 * index.html. The `<head>` of the index.html contains `<script>` and
 * `<style>` tags. Most of these scripts are shared between Node.js
 * and the browser environments. The `<body>` contains a single
 * `<script>` that loads the application.
 *
 * @features
 * - HTML5 user interface optimized for phones and tablets
 * - Own widgets based on [Firefox OS Building
 *   Blocks](http://buildingfirefoxos.com/)
 * - Touchscreen gesture support using
 *   [Hammer.js](http://eightmedia.github.io/hammer.js)
 *
 * @aliases oseUi HTML5frontend
 * @module bb
 * @main bb
 */

/**
 * @caption OSE Building Blocks core
 *
 * @readme
 * Core singleton of bb plugin.
 *
 * This singleton is available through the `Ose.ui` property.
 *
 * @class bb.lib
 * @type singleton
 * @extends EventEmitter
 * @main bb.lib
 */
// Public {{{1
exports.browserConfig = true;

M.content();
