# Open Smart Environment HTML5 frontend

OSE package providing an HTML5 user interface based on [Firefox OS
Building Blocks](http://buildingfirefoxos.com/) using
[jQuery](http://www.jquery.com).

Each browser page (tab) displaying the OSE frontend is an [OSE
instance](http://opensmartenvironment.github.io/doc/modules/ose.peer.html). As part of the base [OSE plugin](http://opensmartenvironment.github.io/doc/modules/ose.plugin.html) configuration, a
[peer](http://opensmartenvironment.github.io/doc/classes/ose.lib.peer.remote.html), representing the backend OSE instance, is created and
connected to.

The connection is realized via a WebSocket in a standard OSE
[peer-to-peer](http://opensmartenvironment.github.io/doc/modules/ose.peer.html) way. All information needed for displaying requested
content is exchanged through this WebSocket channel. After a
successful connection is established, content is displayed using
dynamic injection into the `<body>`.

## Features
- HTML5 user interface optimized for phones and tablets
- Own widgets based on [Firefox OS Building
  Blocks](http://buildingfirefoxos.com/)
- Touchscreen gesture support using
  [Hammer.js](http://eightmedia.github.io/hammer.js)

## Status
- Pre-alpha stage (insecure and buggy)
- Unstable API
- Gaps in the documentation
- No test suite

This is not yet a piece of download-and-use software. Its important
to understand the basic principles covered by this documentation.

Use of this software is currently recommended only for users that
wish participate in the development process (see Contributions).

TODO: Make "Contributions" a link

## Getting started
To get started with OSE, refer to the [ose-bundle](http://opensmartenvironment.github.io/doc/modules/bundle.html) package and
[Media player example application](http://opensmartenvironment.github.io/doc/modules/bundle.media.html). You can read the entire OSE
documentation [here]( http://opensmartenvironment.github.io/doc).

## Initialization

When the browser sends an HTML request to a backend (Node.js) OSE
instance, this instance responds by generating and providing
index.html. The `<head>` of the index.html contains `<script>` and
`<style>` tags. Most of these scripts are shared between Node.js
and the browser environments. The `<body>` contains a single
`<script>` that loads the application.

## Components
Open Smart Environment HTML5 frontend consists of the following components:
- Boxes
- Dialogs
- Pagelets
- Widgets
- State objects

### Boxes
Boxes are parts of the html body corresponding to basic layout
components of the web application. `<body>` contains two boxes:
* `left`: sidebar on the left
* `content`: main box of the application

The `content` box displays a "pagelet" specified by the state object.

Read more about [Boxes](http://opensmartenvironment.github.io/doc/modules/bb.box.html) ...


### Dialogs
Dialogs are fullscreen modal controls.

Read more about [Dialogs](http://opensmartenvironment.github.io/doc/modules/bb.dialog.html) ...


### Pagelets
A pagelet is a part of a page.

There are several types of pagelets (see `lib/pagelet`
directory).
The dashboard pagelet is a starting point for the user.
Two other basic pagelets are the entry pagelet (displays one
entry) and the list pagelet (displays a list of entries).

Each [entry kind](http://opensmartenvironment.github.io/doc/classes/ose.lib.kind.html) can define own UI layout and behaviour for any pagelet type displaying entry in an individual file.

Pagelets can create and contain various widgets (see `lib/widget`
directory) and other pagelets.

Read more about [Pagelets](http://opensmartenvironment.github.io/doc/modules/bb.pagelet.html) ...


### Widgets
A Widget is an easily reusable control visually represented by
HTML5 elements. Their behaviour is controlled by instances of
descendants of the [Widget class](http://opensmartenvironment.github.io/doc/classes/bb.lib.widget.html).

Read more about [Widgets](http://opensmartenvironment.github.io/doc/modules/bb.widget.html) ...


### State objects
The state object defines what is displayed by the application. It
can be saved in the browser's history. Boxes and pagelets receive
the state object in as a parameter of their `display()` methods.

Read more about [State objects](http://opensmartenvironment.github.io/doc/modules/bb.stateObj.html) ...


## Modules
Open Smart Environment HTML5 frontend consists of the following modules:
- OSE Building Blocks core
- Building Blocks content

### OSE Building Blocks core
Core singleton of bb plugin.

This singleton is available through the `Ose.ui` property.

Module [OSE Building Blocks core](http://opensmartenvironment.github.io/doc/classes/bb.lib.html) reference ... 

### Building Blocks content
This singleton defines which files to provide to browsers.

Module [Building Blocks content](http://opensmartenvironment.github.io/doc/classes/bb.content.html) reference ... 

## Contributions
To get started contributing or coding, it is good to read about the
two main npm packages [ose](http://opensmartenvironment.github.io/doc/modules/ose.html) and [ose-bb](http://opensmartenvironment.github.io/doc/modules/bb.html).

This software is in the pre-alpha stage. At the moment, it is
premature to file bugs. Input is, however, much welcome in the form
of ideas, comments and general suggestions.  Feel free to contact
us via
[github.com/opensmartenvironment](https://github.com/opensmartenvironment).

## Licence
This software is licensed under the terms of the [GNU GPL version
3](../LICENCE) or later
