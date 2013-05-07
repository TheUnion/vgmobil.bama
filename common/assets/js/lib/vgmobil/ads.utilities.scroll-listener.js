/**
 *
 * VgAds plugin: scroll-listener
 *
 * A plugin that binds to the scroll event, and allows several listeners to receive special events
 * triggered by visibility-changes due to scroll/resize
 *
 * Purpose: Create an efficient listener so each ad does not have to bind to the scroll event, doing God knows what. 
 * Especially important for the scroll events, since they occur very frequently.
 *
 * @defines extra scroll events for DOM elements: ONTOUCHBOTTOM, ONTOUCHLEFT, ONTOUCHRIGHT, ONTOUCHSTOP
 *
 * @requires jQuery or drop-in replacement (zepto, jqMobi, &c)
 * 
 * @author Johan Telstad, jt@kroma.no, 2013
 *
 */


var VgAds = VgAds || {};

if (!VgAds.plugins) {
  VgAds.plugins = null;
}

VgAds.plugins.scrollListener = {

  // config options

  __config: {
    backgroundWorker: {
      src: 'ads.utilities.background-worker.js'
    }
  },
 
  // set up default options
  __options: {

    // default MODE will be 'normal': use both timer and scroll event binding
    // valid MODEs are 'normal', 'timer' and 'event'
    MODE: 'normal',

  },

  that: this,
  self: this,
  subscribers: [],

  session: {
    eventCount        : 0,
    start             : null,
    backgroundWorker  : null 
  },


  // "PROTECTED" section

  __init: function() {
    self.session.start = new Date;
  },

  __mergeOptions: function(options) {
    // not fast, but doesn't have to be
    // @todo  Add param checking of options object
    for (var key in options) {
      self.__options[key] = options[key];
    }
  },


  /**
   * __onScroll, the function that runs on every scroll event
   *
   * This is where we optimize.
   * 
   */

  __onScroll: function(scroll) {

    /**
     *  TextRectangle clientRect
     *
     *  @attribute bottom   float   Y-coordinate, relative to the viewport origin, of the bottom of the rectangle box. Read only.
     *  @attribute height   float   Height of the rectangle box (This is identical to bottom minus top). Read only.
     *  @attribute left     float   X-coordinate, relative to the viewport origin, of the left of the rectangle box. Read only.
     *  @attribute right    float   X-coordinate, relative to the viewport origin, of the right of the rectangle box. Read only.
     *  @attribute top      float   Y-coordinate, relative to the viewport origin, of the top of the rectangle box. Read only.
     *  @attribute width    float   Width of the rectangle box (This is identical to right minus left). Read only. Requires Gecko 1.9.1
     * 
     */
    

    /*
    window.scrollbars   Returns the scrollbars object, whose visibility can be toggled in the window.
    window.scrollMaxX   The maximum offset that the window can be scrolled to horizontally.
                        (i.e., the document width minus the viewport width)
    window.scrollMaxY   The maximum offset that the window can be scrolled to vertically (i.e., the document height minus the viewport height).
    window.scrollX      Returns the number of pixels that the document has already been scrolled horizontally.
    window.scrollY

     */
    var clientRect = null;
    var subscriber = null;

    for ( var i = 0; i <= self.subcount; i++ ) {
      var clientRect = self.subscribers[i].element.getBoundingClientRect();

      console.log(self.subscribers[i].element.name + ': (' + clientRect.left + ', ' + clientRect.top + ', ' + clientRect.right + ', ' + clientRect.bottom + ')');
    }

    // <http://jsperf.com/array-indexof-vs-object-s-in-operator/6>
    // if (arr.indexOf('abcd') !== -1) {}    637,730    ±0.52%    99% slower
    // if(arr['that']){}                  48,403,249    ±0.72%    fastest

  },


  __startWorker = function() { 

    /* Start background Web Worker */
    self.session.backgroundWorker = new Worker(self.__config.backgroundWorker.src);
  },

  
  __addEvent = function( obj, type, fn ) {
 
     if (obj.attachEvent) {
      obj['e'+type+fn] = fn;
      obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
      obj.attachEvent( 'on'+type, obj[type+fn] );
    }
    else {
      obj.addEventListener( type, fn, false );
    }
  },


  // "PRIVATE" section

  /**
   *  addScrollEvent
   *  
   *  @description Register an event listener to receive our custom scroll events 
   *
   *  @author Johan Telstad <jt@kroma.no>
   * 
   */
  
  function __addScrollEvent( obj, fn ) {
    self.__addEvent( obj, 'scroll', fn );
  },

  _addSubscriber: function(subscription) {
    // @returns id, index of subscription in subscribers array
    console.log(that);
    console.log(subscription);
    self.subscribers.push(subscription);
    return self.subscribers.length-1;
  },

  _removeSubscriber: function(index) {
    self.subscribers. (subscription);

  },

  /*
    Calculate the overlap of two rectangles
   */

  _intersection: function(a, b) {
    // this is where we optimize

    // escape early
    if ( (a.right < b.left || a.left > b.right) || (a.bottom < b.top || a.top > b.bottom) ) {
      return 0;
    }

  /*
      width   = (a.right  > b.right)  ? b.right  - a.left; a.right  - b.left;
      height  = (a.bottom > b.bottom) ? b.bottom - a.top;  a.bottom - b.top;

      return (width * height);
  */
    return (((a.right  > b.right)  ? b.right  - a.left; a.right  - b.left) * ((a.bottom > b.bottom) ? b.bottom - a.top;  a.bottom - b.top));
  },



  // "PUBLIC" section

  on: function(event, callback, options) {
    var subscription = null;
    if ( event.name in self.events.types  && typeof callback === "function") {
      subscription = { "event": event, "callback": callback, "options": options};
    }
    else {
      self.__addEvent(event, )
    }
  },

  hasSubscribers: function() {
    return ( self.subscribers.length > 0 );
  },


  run: function(options) {
    self.__mergeOptions(options);
    self.__init();
    self.__startWorker();
  },

  stop: function() {

    // clean up after ourselves
    self.unbind("scroll");
    
    // surprisingly, this is by far the fastest way to clear an array
    // http://jsperf.com/array-destroy/11

    for(var i = 0; i < arr.length; i++) {
      arr.pop();
    }

    // this is 90% (!) slower than using pop(). Weird, but true.
    // self.subscribers.length = 0;
  }

}; 

/**
 * End scrollListener plugin
 * 
 */