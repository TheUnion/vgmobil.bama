
$(document).ready(function () {

  $(document).bind("dragstart", function() { return false; });

    var 

      // activate debugging
      DEBUG             = false,

      //dump stack trace on errors
      DEBUG_STACKTRACE  = true,

      // define analytics events
      // events are automatically sent to tracking server as they occur,
      // from function onEvent further down
      EVENT = {
          "start_interaction" : { id: 6260200, onEvent: function() { 
              if(typeof VGTouchTimeTracker !== "object") { 
                return false;
              }   
              VGTouchTimeTracker.run();
            }
          },
          "arrive_station3"   : { id: 6260201, onEvent: function(setPoster) { setPoster('assets/img/poster.jpg'); } },
          "arrive_station4"   : { id: 6260202, onEvent: false },
          "arrive_station6"   : { id: 6260203, onEvent: false },
          "arrive_station7"   : { id: 6260204, onEvent: function() { $('#parallax').parallaxSwipe.setEdge("right"); } },

          "leave_station3"    : { id: 6260205, onEvent: false },
          "leave_station4"    : { id: 6260206, onEvent: false },
          "leave_station6"    : { id: 6260207, onEvent: false },
          "leave_station7"    : { id: 6260208, onEvent: false },

          "click_lise"        : { id: 6260209, onEvent: false },
          "click_farmer"      : { id: 6260210, onEvent: false },
          "close_lise"        : { id: 6260213, onEvent: false },
          "close_farmer"      : { id: 6260214, onEvent: false },

          "click_link1"       : { id: 6260211, onEvent: false },
          "click_link2"       : { id: 6260212, onEvent: false },

          "video_play"        : { id: 6260215, onEvent: false },
          "video_pause"       : { id: 6260216, onEvent: false },
          "video_finish"      : { id: 6260220, onEvent: false }
      },


      SESSION           = {
        // some private variables
        HAS_CACHED_EVENTS : false,
  
        start             : new Date().getTime(),
        url               : window.location,
        INITIALIZED       : false
      },

      VIDEO_CONTROLLER  = null;
      

    $(function() {


      var stacktrace = function(error) {
        return error.stack || "No stack trace available.";
      };


      window.onerror = function(message, url, line_num) {
       
        // Standard error information
        var error = "Error : " + message + " @ " + url + ":" + line_num;
        error += "\nurl: " + document.URL;
        
        var user_agent = new UserAgent();
        error += "\nbrowser: " + user_agent.browser_name + " " + user_agent.browser_version + " | OS: " + user_agent.os + " | platform: " + user_agent.platform;

        debugLog(error, message);    
        return false;
      };


      var logException = function (error) {
        var
          msg = error.message || false;

        if(!!msg) {
          //display file and line no. where error ovvurred
          msg += error.fileName || " ";
          msg +=  " ";

          msg += error.lineNumber || " ";
          msg +=  " - ";
        }

        if(DEBUG) {
          // show stack trace
          msg += stacktrace(error);
        }

        console.log(msg);
        return;
        debugLog(msg);
      };


      var debugLog = function (line, obj) {

        // output to console
        !!obj ? console.log(line, obj) : console.log(line);

        // send to server is we have a Kroma Debugger object
        if(typeof HTMLDebugger.log === "function") {
          HTMLDebugger.log(line, obj);
        }
        else {
          console.log("Error in function debugLog(): Kroma Debugger is not initialized.");
        }
      };

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      var changeStartScreenAnimation = function (animation, delay, repeat, time) {
        var
          animation = animation || 'bounce',
          delay     = delay     || 5000,
          repeat    = repeat    || false,
          time      = time      || false;

        if(initialized()) {
          return;
        }
        setStartScreenAnimation(animation, repeat, time);

        if(repeat) {
          setTimeout(changeStartScreenAnimation, delay, animation, delay, repeat, time);
        }
      };


      var removeStartScreenAnimation = function (animation) {
        var
          animation = animation || false;

        if(animation) {
          car.classList.remove(animation);
        }
      };


      var setStartScreenAnimation = function (animation, repeat, time) {
        var
          animation = animation || 'bounce',
          repeat    = repeat    || false,
          time      = time      || false;

        car.classList.add(animation);
        if(time) {
          setTimeout(removeStartScreenAnimation, time, animation);
        }
      };


      var setInitialized = function() {
        SESSION.INITIALIZED = true;
      };

      var initialized = function() {
        return SESSION.INITIALIZED;
      };

      var isAndroid = function () {
        return navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
      };

      var openLink = function (link)  {
        if(isAndroid()) {
          // Android won't accept our fake-click hack
          // console.log("Opening link the android way: " + link.href);
          window.open(link.href);
        }
        else {
          // console.log("Opening link the fake-click way: " + link.href);
          fakeClick(null, link);        
        }
      };


      // this is where we catch all of our events, and where we send all trackable events to the analytics server
      var onEvent = function (eventObject) {
        var 
          e             = EVENT[eventObject.event] || false,
          registerEvent = (typeof p62602Event ==="function") ? p62602Event : false;


        eventObject.registered = false;
        updateLazyloaders(eventObject.event);

        // does our analytics reporting function exist ?
        if(!registerEvent) {
          SESSION.HAS_CACHED_EVENTS = true;
          eventObject.registered    = false;
          events.push(eventObject);
          console.log("Analytics script not loaded, buffering event: " + eventObject.event);
          return;
        }
        else {
          if(SESSION.HAS_CACHED_EVENTS) {
            for( var i = 0, count = events.length; i < count; i++ ) {
              console.log("registering delayed event: " + events[i].event + " (" + EVENT[events[i].event].id + ")");
              setTimeout(registerEvent, 200, EVENT[events[i].event].id);
              events[i].registered  = true;
            }
            SESSION.HAS_CACHED_EVENTS = false;
          };
        }


        if(DEBUG) {

          debugLog("[EVENT] " + eventObject.event);
          // WE ARE DISABLING THE TRACKING HERE, 
          // BECAUSE WE DON'T WANT THE DEV VERSION 
          // TO POLLUTE THE ANALYTICS OF THE LIVE VERSION
          // 
          // RE-ENABLE BEFORE PUBLISHING BY COMMENTING OUT
          // THE RETURN STATEMENT IN THE LINE BELOW
          return;
        }

        try {

          if(!EVENT[eventObject.event]) {
            console.log("Unknown event : " + eventObject.event);
            return;
          }

          // console.log("Registering event: " + eventObject.event + " => " + parseInt(e.id,10) + ", using function ",registerEvent);
          registerEvent(e.id);

          if( typeof e.onEvent === "function" ) {
            e.onEvent.call(null, setPoster);
          }

        }
        catch(e) {
          debugLog("Exception in function onEvent()", e);
        }

        eventObject.registered = true;
        events.push(eventObject);
      };


      var updateLazyloaders = function (eventName) {

        var 
          eventName = eventName || false,
          loadEvent = false;

        for(var i = 0, count = ONDEMAND_LOADERS.length; i < count; i++) {
          // by convention, the lazyloadee will be a class of the same name as the lazyloader's id
          // The class defines the background image(s) we wish to load into the "lazyload" divs
          // This way, we can load the image files on demand, and still have fluid animations

          // check if any of our on-demand loadees want to load on this event

          if (eventName === ONDEMAND_LOADERS[i].getAttribute("data-load-event")) {
            ONDEMAND_LOADERS[i].classList.add(ONDEMAND_LOADERS[i].id);
          }
        }
      };


      var startSession = function() {

        if(initialized()) {
          console.log("Already initialized, escaping");
          return;
        }

        // populate our lazyload arrays
        LAZY_LOADERS      = document.getElementsByClassName('lazyload');
        ONDEMAND_LOADERS  = document.getElementsByClassName('lazyload ondemand');

        // load extra backgrounds on first user interaction
        for(var i = 0, count = LAZY_LOADERS.length; i < count; i++) {
          // by convention, the lazyloadee will be a class of the same name as the lazyloader's id
          // The class defines the background image(s) we wish to load into the "lazyload" divs
          // This way, we can load the image files on demand, and still have fluid animations

          // skip those elements that should load on demand
          if (LAZY_LOADERS[i].classList.contains('ondemand')) {
            //skip those marked for manual load / automatic loading on event with data-load-event attribute
            continue;            
          }

          // add class with same name as the id, our convention for lazyloading
          // images to load are specified as background images in the class definition
          LAZY_LOADERS[i].classList.add(LAZY_LOADERS[i].id);
        }


        // initializeTimer();
        setInitialized(true);

        var
          userEvent = { event: 'start_interaction', message: 'First swipe detected.', target: null, time: (new Date()).getTime()};

        onEvent(userEvent);

      };


      var setPoster = function(img) {
        var
          videoElement = document.getElementById('video1');
        
        if (!videoElement) {
          return false;
        }
        if(!VIDEO_CONTROLLER) {
          if(false === (VIDEO_CONTROLLER = HTMLVideo(videoElement))){
            return false;
          }
        }
        
        VIDEO_CONTROLLER.setPoster(img);
        return true;
      };


      var clickVideo = function(id) {
        var
          videoElement = document.getElementById(id || 'video1');
        
        if (!videoElement) {
          return false;
        }
        if(!VIDEO_CONTROLLER) {
          if(false === (VIDEO_CONTROLLER = HTMLVideo(videoElement))){
            return false;
          }
        }
        
        VIDEO_CONTROLLER.togglePause();
        return true;
      };


      var stopVideo = function(id) {
        var
          videoElement = document.getElementById(id || 'video1');

        if (!videoElement) {
          return false;
        }
        if(!VIDEO_CONTROLLER) {
          if(false === (VIDEO_CONTROLLER = HTMLVideo(videoElement))){
            return false;
          }
        }
        
        VIDEO_CONTROLLER.stop();
        return true;
      };




/**
 *  HTMLVideo
 *  
 *  A dirt simple video controller for the HTML5 video element
 *
 * @param {string or videoElement} [img] The video element, or its id
 * @returns videoElement or null
 * 
 */

      var HTMLVideo = function(elem) {

        try {

          var 
            video           = typeof elem === "string" ? document.getElementById(elem) : elem,
            videoController = {},
            loadedMetaData  = false;

            video.addEventListener("loadedmetadata", function() {
                this.loadedMetaData = true;
              }, false);

            video.addEventListener("error", function(error) {
                logError(error);
              }, false);


            video.addEventListener("play", function(e) {
              onEvent({event: "video_play"});
              }, false);


            video.addEventListener("pause", function(e) {
              onEvent({event: "video_pause"});
              }, false);

            video.addEventListener("ended", function(e) {
              onEvent({event: "video_finish"});
              }, false);


          videoController.element = video;

          videoController.play = function(resume) {
              video.play();
          };

          videoController.pause = function() {
              video.pause();
          };

          videoController.stop = function() {
              if(video.playing) {
                video.pause();
              }
          };


          videoController.togglePause = function() {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          };


          videoController.skip = function(value) {
            video.currentTime += value;
          };


          videoController.reset = function () {
            if(loadedMetaData) {
              video.currentTime = 0;
            }
          };


          videoController.restart = function() {
            if(loadedMetaData ) {
              video.currentTime = 0;
              onEvent({event: 'video_restart'});
            }
          };

          videoController.toggleControls = function() {
            if (video.hasAttribute("controls")) {
              this.hideControls();
            } else {
              this.showControls();
            }
          }

          videoController.showControls = function(){
            video.setAttribute("controls", "controls");   
          };

          videoController.hideControls = function(){
            video.removeAttribute("controls")   
          };

          videoController.setPoster = function(img) {
            video.setAttribute("poster", img);   
          };

        }
        catch(e) {
          videoController = null;
          throw(e);
        }

        return videoController;
      };





      var hitTest = function (target, click) {
        var 
          clickpos  = Math.abs(click.offsetLeft + startpos) + click.clientX,
          targetpos = (target.offset.left + target.position.left),
          distance  = 0;

        distance = Math.abs(clickpos - targetpos);
        return (distance<TOLERANCE);
      };




/**
 * fakeClick : trigger a click event on a   <a href target>   -> a workaround for creating new windows from javascript 
 * without bothering the popup blocking thingsies
 *
 * This method was created by <http://stackoverflow.com/users/45433/crescent-fresh>
 * <http://stackoverflow.com/questions/1421584/how-can-i-simulate-a-click-to-an-anchor-tag/1421968#1421968>
 *
 * To call programmatically, probably just fakeClick(null, <a>)
 * 
 */   var fakeClick = function (event, anchorObj) {

        // console.log("Faking a click");
      
        if (anchorObj.click) {
          anchorObj.click()
        } else if(document.createEvent) {
          if(event.target !== anchorObj) {
            var evt = document.createEvent("MouseEvents"); 
            evt.initMouseEvent("click", true, true, window, 
                0, 0, 0, 0, 0, false, false, false, false, 0, null); 
            var allowDefault = anchorObj.dispatchEvent(evt);
            // you can check allowDefault for false to see if
            // any handler called evt.preventDefault().
            // Firefox will *not* redirect to anchorObj.href
            // for you. However every other browser will.
          }
        }
      };


/*-----------------------------------------------------------------------------------------------*/

      var getClickedElement = function (click) {

        var
          clickpos      = Math.abs(click.offsetLeft + startpos) + click.clientX;


        if(LISE_FLIPPED) {
          flipLise();
        }

        if(FARMER_FLIPPED) {
          flipFarmer();
        }


        // a dirty little gollum of a hack
        if( (clickpos>=(4606 + 280)) && (clickpos<=(4606 + 280 + 125)) ) {
          if((click.clientY>230) && (click.clientY<275)){
            // flipFarmer();
            return;
          }
        }
        // it'ss hideousss
        else if( (clickpos>=(6180 + 300)) && (clickpos<=(6180 + 300 + 125)) ) {
          if((click.clientY>230) && (click.clientY<275)){
            flipLise();
            return;
          }
        }
        // we could probably come up with something more general, but not in the time available
        else if( (clickpos>=7650 + 174 && (clickpos<=7650 + 170 + 232) )) {
          if((click.clientY>230) && (click.clientY<282)){
            // console.log("link1: ", link1)
            onEvent({event: "click_link1"});
            openLink(link1);
            return;
          }
          else if((click.clientY>(286) && (click.clientY<((332))))){
            // console.log("link2: ", link2)
            onEvent({event: "click_link2"});
            openLink(link2);
            return;
          }
        }
        // click on video
        else if( (clickpos>=(3072 + 65) && (clickpos<=(3072 + 65 + 416)) )) {
          if((click.clientY>(86) && (click.clientY<((86 + 236))))){ //allow 20px for controls, video is 216px tall
            // console.log('click on video: ' + link2.href);
            clickVideo();
            return;
          }
        }

        return false;
      };


      var onClicked = function(click) {
        var
          result = getClickedElement(click);
      };


      var enableSwipe = function () {
        $("#parallax").parallaxSwipe.SWIPE_ENABLED = true;          
      };





    //variables global to our scope

      var 
        timer             = null,
        loaded            = null,
        startdate         = false,
        starttime         = false,
        stations          = {},
        currentstation    = 'none',
        currentspeed      = 0.9,

        startpos          = 0,
        currentpos        = 0,
        sessionstart      = null,
        UPDATE_INTERVAL   = 100, //millisec
        STATION_MARGIN    = 400, // delta for when station becomes visible

        STATION_SPEED     = 0.75, // when approaching station
        ROAD_SPEED        = 0.9, // when leaving station
        DECAY             = 0.75, // when approaching station
        MOUSEDOWN_DECAY   = 0.75, // when approaching station
        ROAD_DECAY        = 0.9, // when leaving station
        ROAD_MOUSE_DECAY  = 0.9, // when leaving station

        LISE_FLIPPED      = false,
        FARMER_FLIPPED    = false,
        TOLERANCE         = 100,
        SWIPE_TOLERANCE   = 60,

        events            = [],
        LAZY_LOADERS      = null;
        ONDEMAND_LOADERS  = null; 
        VIDEO_CONTROLLER  = null;
        CLICK_ENABLED     = false;

        car               = document.getElementById('car'),

        debugpanel        = document.getElementById('debugoutput'),
        parallax          = document.getElementById('parallax'),
        scene             = document.getElementById('layer5'),

        debuginfo         = document.getElementById('debuginfo'),

        lise_recipe       = document.getElementById('lise_recipe'),
        lise_hello        = document.getElementById('lise_hello'),
        farmer_recipe     = document.getElementById('farmer_recipe'),
        farmer_hello      = document.getElementById('farmer_hello'),

        final_btn1        = document.getElementById('final_btn1'),
        final_btn2        = document.getElementById('final_btn2'),

        link1             = document.getElementById('link1');
        link2             = document.getElementById('link2');


        triggers      = {};
        clicktargets  = {};

        // our clicktargets
        var 
          list      = document.getElementsByClassName('clicktarget'),
          offset    = parallax.getBoundingClientRect().left;

        // When there's time, this can be expanded to a general solution
        // where we get the bounding client rect of the click target.
        // This is a way to have guaranteed clickable elements no matter  
        // what. Even if the click event is captured by enemy code, we can re-fire it
        // programmatically

        for(var i = 0, count = list.length; i < count; i++) {

          clicktargets[list[i].id] = {
            element : list[i],
            rect : list[i].getBoundingClientRect(),
            position : {
              left    : 0,
              top     : 0,
              right   : 0,
              bottom  : 0
              }
            };

          var
            target  = clicktargets[list[i].id];

          var
            pos     = target.position;

          pos.left   = Math.round(target.rect.left  - offset);
          pos.right  = Math.round(target.rect.right - offset);
          pos.top    = Math.round(target.rect.top);
          pos.bottom = Math.round(target.rect.bottom);
        }



      /**
       *  functions
       *
       */  

      var flipLise = function() {
        if(!LISE_FLIPPED) {
          onEvent({event: "click_lise"});
          $('#lise_tips').animate({ top : 500, opacity: 0}, 325, 'linear');
          $('#lise_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          onEvent({event: "close_lise"});
          $('#lise_tips').animate({ top : 40, opacity: 1}, 325, 'linear');
          $('#lise_recipe').animate({ top : -500, opacity: 0}, 325, 'linear');
        }
        LISE_FLIPPED = !LISE_FLIPPED;
      };


      var flipFarmer = function() {
        if(!FARMER_FLIPPED) {
          onEvent({event: "click_farmer"});
          $('#farmer_tips').animate({ top : 500, opacity: 0}, 325, 'linear');
          $('#farmer_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          onEvent({event: "click_farmer"});
          $('#farmer_tips').animate({ top : 40, opacity: 1}, 325, 'linear');
          $('#farmer_recipe').animate({ top : -500, opacity: 0}, 325, 'linear');
        }
        FARMER_FLIPPED = !FARMER_FLIPPED;
      };



      /**
       *  progresstimer()
       *
       *  This is where we detect which station we are currently at, &c
       * 
       */

      var progresstimer = function (e) {

        var
          i, x, y     = 0,
          time        = (new Date()).getTime(),
          position    = parallax.getBoundingClientRect();


          if(!starttime) {
            startdate = (new Date()).toString();
            starttime = (new Date()).getTime();
            starttimetext = (new Date()).getTime().toString();
          }

        if(!!position) {
          currentpos = startpos - position.left;
          if(currentpos > SWIPE_TOLERANCE) {
            if(!initialized()) {
              startSession();
              console.log("Interaction detected, preloading resources ..");
            }
          }
          // for..in normally not acceptable, but ok with this few elements
          var counter = 0, startAtIndex = 3;
          for (var key in stations) {
      
            // skip the first 2 stations, no stops there
            if(++counter < startAtIndex) {
              continue;
            }


            x = (startpos - (stations[key].getBoundingClientRect().left - STATION_MARGIN));
            if(x<0) {
              break;
            } else {
              if(!triggers[key]) {
                triggers[key] = true;
              }
              if(Math.abs(x) > (STATION_MARGIN + 250)) {
                if( (currentstation === key) ) {
                  $('#parallax').parallaxSwipe.setSpeed(ROAD_SPEED, ROAD_DECAY, ROAD_MOUSE_DECAY);
                  var
                    userEvent = { event: 'leave_' + key, message: 'leaving station ' + key, target: currentstation, time: time};
                  
                  onEvent(userEvent);
                  currentstation = 'none';
                }
              } else {
                if(currentstation !== key) {
                  onEvent({ event: 'arrive_' + key, message: 'arriving at station ' + key, target: currentstation, time: time});
                  currentstation = key;

                  var 
                    stationx = Math.round($("#" + currentstation).position().left);

                  // console.log('Requesting position of ' + currentstation + " at " + stationx + ", offset: " + $("#" + currentstation).offset().left + ", position: " + $("#" + currentstation).position().left + ", startpos: " + startpos);
                  $('#parallax').parallaxSwipe.requestPosition(-stationx);
                }
              }
            }
          }
        }
      };


      var initializeTimer = function () {
        var
          count = stations.length;

        startpos = parallax.getBoundingClientRect().left;

        if(!count) {
          $('.station').each(function (key, value){
            stations[value.id || key] = value;
          });
          count = stations.length;
        }
        timer = setInterval(progresstimer, UPDATE_INTERVAL);
        
        //start default animation loop for start screen
        changeStartScreenAnimation("bounce", 8000, true, 3000);
      };




/**
 *  Initialization 
 * 
 */

    // Hide the address bar in Mobile Safari
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 0);



    $("#parallax").parallaxSwipe( { DECAY: ROAD_DECAY, MOUSEDOWN_DECAY: ROAD_MOUSE_DECAY, SPEED_SPRING: ROAD_SPEED, BOUNCE_SPRING:0.5, 
          HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 12, 3.2, 1.6, 1, 1 ] });


    var layerWidth = $('#parallax').parallaxSwipe.getSize();

    // set width for all parallax stations
    $('.parallax_layer').css('width',layerWidth);


    $('#parallax').bind('click', function (e) { 
        var
          result = {
            offsetLeft : e.target['offsetLeft'],
            offsetTop  : e.target['offsetTop']
          };

        if(typeof result.offsetLeft ==="number") {
          result.clientX = e.clientX;
          result.clientY = e.clientY;
        }

        onClicked(result);
        return true; 
      });



      $('.recipe').bind('selectstart', function (e) { 
        return false; });

    initializeTimer();
    });
  });


/**
 *  DEBUG 
 *
 *  debug functions and helpers
 * 
 */


/**
 *  UserAgent()
 *  
 *  https://github.com/caseyohara/user-agent/
 */

  var UserAgent;

  UserAgent = (function() {
    var 
      Browsers, OS, Platform, Versions, browser_name, browser_version, os, platform;

    Versions = {
      Firefox   : /firefox\/([\d\w\.\-]+)/i,
      IE        : /msie\s([\d\.]+[\d])/i,
      Chrome    : /chrome\/([\d\w\.\-]+)/i,
      Safari    : /version\/([\d\w\.\-]+)/i,
      Ps3       : /([\d\w\.\-]+)\)\s*$/i,
      Psp       : /([\d\w\.\-]+)\)?\s*$/i
    };

    Browsers = {
      Konqueror : /konqueror/i,
      Chrome    : /chrome/i,
      Safari    : /safari/i,
      IE        : /msie/i,
      Opera     : /opera/i,
      PS3       : /playstation 3/i,
      PSP       : /playstation portable/i,
      Firefox   : /firefox/i
    };

    OS = {
      WindowsVista  : /windows nt 6\.0/i,
      Windows7      : /windows nt 6\.1/i,
      Windows8      : /windows nt 6\.2/i,
      Windows2003   : /windows nt 5\.2/i,
      WindowsXP     : /windows nt 5\.1/i,
      Windows2000   : /windows nt 5\.0/i,
      OSX           : /os x (\d+)[._](\d+)/i,
      Linux         : /linux/i,
      Wii           : /wii/i,
      PS3           : /playstation 3/i,
      PSP           : /playstation portable/i,
      Ipad          : /\(iPad.*os (\d+)[._](\d+)/i,
      Iphone        : /\(iPhone.*os (\d+)[._](\d+)/i
    };

    Platform = {
      Windows       : /windows/i,
      Mac           : /macintosh/i,
      Linux         : /linux/i,
      Wii           : /wii/i,
      Playstation   : /playstation/i,
      Ipad          : /ipad/i,
      Ipod          : /ipod/i,
      Iphone        : /iphone/i,
      Android       : /android/i,
      Blackberry    : /blackberry/i
    };

    function UserAgent(source) {
      if (source == null) {
        source = navigator.userAgent;
      }
      this.source = source.replace(/^\s*/, '').replace(/\s*$/, '');
      this.browser_name = browser_name(this.source);
      this.browser_version = browser_version(this.source);
      this.os = os(this.source);
      this.platform = platform(this.source);
    }

    browser_name = function(string) {
      switch (true) {
        case Browsers.Konqueror.test(string):
          return 'konqueror';
        case Browsers.Chrome.test(string):
          return 'chrome';
        case Browsers.Safari.test(string):
          return 'safari';
        case Browsers.IE.test(string):
          return 'ie';
        case Browsers.Opera.test(string):
          return 'opera';
        case Browsers.PS3.test(string):
          return 'ps3';
        case Browsers.PSP.test(string):
          return 'psp';
        case Browsers.Firefox.test(string):
          return 'firefox';
        default:
          return 'unknown';
      }
    };

    browser_version = function(string) {
      var regex;
      switch (browser_name(string)) {
        case 'chrome':
          if (Versions.Chrome.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'safari':
          if (Versions.Safari.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'firefox':
          if (Versions.Firefox.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'ie':
          if (Versions.IE.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'ps3':
          if (Versions.Ps3.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'psp':
          if (Versions.Psp.test(string)) {
            return RegExp.$1;
          }
          break;
        default:
          regex = /#{name}[\/ ]([\d\w\.\-]+)/i;
          if (regex.test(string)) {
            return RegExp.$1;
          }
      }
    };

    os = function(string) {
      switch (true) {
        case OS.WindowsVista.test(string):
          return 'Windows Vista';
        case OS.Windows7.test(string):
          return 'Windows 7';
        case OS.Windows2003.test(string):
          return 'Windows 2003';
        case OS.WindowsXP.test(string):
          return 'Windows XP';
        case OS.Windows2000.test(string):
          return 'Windows 2000';
        case OS.Linux.test(string):
          return 'Linux';
        case OS.Wii.test(string):
          return 'Wii';
        case OS.PS3.test(string):
          return 'Playstation';
        case OS.PSP.test(string):
          return 'Playstation';
        case OS.OSX.test(string):
          return string.match(OS.OSX)[0].replace('_', '.');
        case OS.Ipad.test(string):
          return string.match(OS.Ipad)[0].replace('_', '.');
        case OS.Iphone.test(string):
          return string.match(OS.Iphone)[0].replace('_', '.');
        default:
          return 'unknown';
      }
    };

    platform = function(string) {
      switch (true) {
        case Platform.Windows.test(string):
          return "Microsoft Windows";
        case Platform.Mac.test(string):
          return "Apple Mac";
        case Platform.Android.test(string):
          return "Android";
        case Platform.Blackberry.test(string):
          return "Blackberry";
        case Platform.Linux.test(string):
          return "Linux";
        case Platform.Wii.test(string):
          return "Wii";
        case Platform.Playstation.test(string):
          return "Playstation";
        case Platform.Ipad.test(string):
          return "iPad";
        case Platform.Ipod.test(string):
          return "iPod";
        case Platform.Iphone.test(string):
          return "iPhone";
        default:
          return 'unknown';
      }
    };
    return UserAgent;
  })();



    var onError = function (err) {
      console.log("error loading script " + (this.async ? "asynchronously, " : "synchronously, ") + (this.defer ? "deferred: " : "not deferred: ") + this.fileName);
    };

    var onSuccess = function () {
      console.log("loaded script " + (this.async ? "asynchronously, " : "synchronously, ") + (this.defer ? "deferred: " : "not deferred: ") + this.fileName);
    };

    var requireScript = function ( file, async, defer, success, failure ) {
      var
        cursor  = document.getElementsByTagName ("head")[0] || document.documentElement,
        path    = file,
        script  = document.createElement('script'),
        async   = async || false,
        defer   = defer || false;

      if(async) {
        // you don't set "async" to false, you either set it or no
        script.async = true;
      }

      if(defer) {
        // you don't set "defer" to false, you either set it or no
        script.defer = true;
      }

      script.src        = file;
      script.fileName   = file;
      script.self       = script;
      script.success    = success || false;
      script.failure    = failure || false;


      script.onload = function () {
        if(this.success) {
          this.success.apply(this);
        }
      };

      script.onerror = function (err) {
        if(this.failure) {
          this.failure.apply(this, err);
        }
      };

      return cursor.insertBefore(script, cursor.firstChild);
    };


  // load our time tracker
  requireScript ("assets/js/lib/kroma.timetracker.min.js", false, false, onSuccess, onError);

  // load html debugger, not async & not deferred

  // requireScript ("assets/js/lib/kroma.debugger.js", false, false, onSuccess, onError);


