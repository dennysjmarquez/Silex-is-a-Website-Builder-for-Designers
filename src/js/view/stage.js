//////////////////////////////////////////////////
// Silex, live web creation
// http://projects.silexlabs.org/?/silex/
//
// Copyright (c) 2012 Silex Labs
// http://www.silexlabs.org/
//
// Silex is available under the GPL license
// http://www.silexlabs.org/silex/silex-licensing/
//////////////////////////////////////////////////

/**
 * @fileoverview The stage is the area where the user drag/drops elements
 *   This class is in charge of listening to the DOM of the loaded publication
 *   and retrieve information about it
 *
 */


goog.require('silex.view.ViewBase');
goog.provide('silex.view.Stage');

goog.require('silex.utils.EditablePlugin');

goog.require('goog.events');
goog.require('goog.events.MouseWheelHandler');

/**
 * the Silex stage class
 * @constructor
 * load the template and render to the given html element
 * @param  {Element}  element  DOM element to wich I render the UI
 *  has been changed by the user
 */
silex.view.Stage = function(element, bodyElement, headElement) {
  // call super
  goog.base(this, element, bodyElement, headElement);

  // init the view
  this.initEvents()
}

// inherit from silex.view.ViewBase
goog.inherits(silex.view.Stage, silex.view.ViewBase);

/**
 * init stage events
 * handle mouse events for selection,
 * events of the jquery editable plugin,
 * double click to edit,
 * and disable horizontal scrolling for back page on Mac OS
 */
silex.view.Stage.prototype.initEvents = function () {

  // detect mouse down
  goog.events.listen(this.element, 'mousedown', function(e) {
    if (this.onStatus) this.onStatus('select', silex.utils.EditablePlugin.getFirstEditableParent(e.target));
    this.isDragging = true;
  }, false, this);
  // listen on body instead of element because user can release
  // on the tool boxes
  goog.events.listen(document.body, 'mouseup', function(e) {
    if (this.isDragging) {
      if (this.onStatus) this.onStatus('change', e.target);
      this.isDragging = false;
    }
  }, false, this);
  // dispatch event when an element has been moved
  goog.events.listen(this.element, 'dragstop', function(e) {
    if (this.onStatus) this.onStatus('change', e.target);
    this.isDragging = false;
  }, false, this);
  // dispatch event when an element has been moved or resized
  goog.events.listen(this.element, 'resize', function(e) {
    if (this.onStatus) this.onStatus('change', e.target);
    this.isDragging = false;
  }, false, this);
  // dispatch event when an element is dropped in a new container
  goog.events.listen(this.element, 'newContainer', function(e) {
    console.log('newContainer');
    if (this.onStatus) this.onStatus('newContainer');
  }, false, this);
  // detect double click
  goog.events.listen(this.element, goog.events.EventType.DBLCLICK, function(e) {
    if (this.onStatus) this.onStatus('edit');
  }, false, this);
  // Disable horizontal scrolling for Back page on Mac OS
  var mwh = new goog.events.MouseWheelHandler(this.element);
  goog.events.listen(mwh, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, function (e) {
    if (e.deltaX<0 && this.bodyElement.scrollLeft<=0){
      e.preventDefault();
    }
  }, false, this);
};


/**
 * @return {object} object of fonts which are used in the text fields (key is the font name)
 */
silex.view.Stage.prototype.getNeededFonts = function() {
  var innerHTML = this.bodyElement.innerHTML;
  var neededFonts = [];
  innerHTML.replace(/<font[^"]*face="?([^"]*)"/g, function(match, group1, group2) {
    neededFonts[group1] = true;
    return match;
  });
  return neededFonts;
};
