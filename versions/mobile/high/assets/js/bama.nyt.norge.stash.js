  $(document).ready(function () {

//   $(document).bind("dragstart", function() { return false; });
   
    var 
      INITIALIZED = false,
      VIDEO_CONTROLLER = null;

    $(function() {

      // this is where we send all trackable events
      var onEvent = function (eventObject) {

        updateLazyloaders(eventObject.event);

        if(eventObject.event.indexOf("arrive_station") === 0) {
          console.log("enabling clicks on event " + eventObject.event);
          CLICK_ENABLED = true;
        }
        else if(eventObject.event.indexOf("leave_station") === 0) {
          console.log("disabling clicks on event " + eventObject.event);
          CLICK_ENABLED = false;
        }
        
        console.log("Tracking event: " + eventObject.event);
        // ##############TRACKING IMPL:
        if(eventObject.event.indexOf("start_interaction") === 0) {

          p62601Event(6260100); 
        }
        
        if(eventObject.event.indexOf("arrive_station3") === 0) {
          p62601Event(6260101); 
        }
        
        if(eventObject.event.indexOf("arrive_station4") === 0) {

          console.log('Trying to set poster');

          setPoster('assets/img/poster.jpg')
          p62601Event(6260102); 
        }
        
        if(eventObject.event.indexOf("arrive_station6") === 0) {
          p62601Event(6260103); 
        }
        
        if(eventObject.event.indexOf("arrive_station7") === 0) {
          console.log("arriving at #7, setting right edge.");
          $('#parallax').parallaxSwipe.setEdge("right");
          p62601Event(6260104); 
        }
        
        if(eventObject.event.indexOf("leave_station3") === 0) {
          p62601Event(6260105); 
        }
        
        if(eventObject.event.indexOf("leave_station4") === 0) {
          p62601Event(6260106); 
        }
        
        if(eventObject.event.indexOf("leave_station6") === 0) {
          stopVideo();
          p62601Event(6260107); 
        }
        
        if(eventObject.event.indexOf("leave_station7") === 0) {
          p62601Event(6260108); 
        }

        /* EDIT: jt@kroma.no --- moved video event trackers from videocontroller to onEvent() */ 

        if(eventObject.event.indexOf("video_play") === 0 || eventObject.event.indexOf("video_resume") === 0) {
          p62601Event(6260115); 
        }
        if(eventObject.event.indexOf("video_pause") === 0) {
          p62601Event(6260116); 
        }

        
        ///###########################
        // # tracking code here
          events.push(eventObject);
          // console.log(events);
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
            console.log("loading bg for " + ONDEMAND_LOADERS[i].id + " on event " + eventName);
            // ONDEMAND_LOADERS[i].classList.remove('lazystart');
            ONDEMAND_LOADERS[i].classList.add(ONDEMAND_LOADERS[i].id);
          }
        }
      };


      var startSession = function() {

        if(!!INITIALIZED){
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
          LAZY_LOADERS[i].classList.add(LAZY_LOADERS[i].id);
        }
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

      }


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
            videoController = {};

          videoController.element = video;

          videoController.onended = function(e) {
                onEvent({event: "video_finished"});
              }

          videoController.play = function(resume) {


              // #### Tracking ####
              // p62601Event(6260115); 
             // ##################
              video.play();
              onEvent({event: resume ? "video_resume" : "video_play"});
          };




          videoController.pause = function() {
              // #### Tracking ####
             // p62601Event(6260116); 
            // ##################
              video.pause();
              onEvent({event: 'video_pause'});
          };

          videoController.stop = function() {
              // #### Tracking ####
              // p62601Event(6260116); 
              // ##################
              video.pause();
              video.currentTime = 0;
              onEvent({event: 'video_stop'});
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

          videoController.restart = function() {
            video.currentTime = 0;
            onEvent({event: 'video_restart'});
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
            console.log('Applying poster image: ' + img);
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
          clickpos = Math.abs(click.offsetLeft + startpos) + click.clientX,
          targetpos = (target.offset.left + target.position.left),
          distance = 0;



        distance = Math.abs(clickpos - targetpos);
        return (distance<TOLERANCE);
      };




/**
 * fakeClick : trigger a click event on a   <a href target>   -> a workaround for creating new windows from javascript 
 * without bothering the popup blocker thingsies
 *
 * This method was created by <http://stackoverflow.com/users/45433/crescent-fresh>
 * <http://stackoverflow.com/questions/1421584/how-can-i-simulate-a-click-to-an-anchor-tag/1421968#1421968>
 *
 * To call programmatically, probably just fakeClick(null, <a>)
 * 
 */   var fakeClick = function (event, anchorObj) {
      
        console.log('fake-clicked: ' + anchorObj.href);

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

        // escape early
        if(!CLICK_ENABLED) {
          return;
        }

        var
          target        = null,
          sceneLeft     = scene.getBoundingClientRect().left,
          parallaxLeft  = parallax.getBoundingClientRect().left;

          clickpos      = Math.abs(click.offsetLeft + startpos) + click.clientX;


        if(LISE_FLIPPED) {
          flipLise();
//          return;
        }

        if(FARMER_FLIPPED) {
          flipFarmer();
 //         return;
        }


        // a dirty little gollum of a hack
        if( (clickpos>=4750) && (clickpos<=4920) ) {
          if((click.clientY>35) && (click.clientY<75)){
            flipFarmer();
            return;
          }
        }
        // it'ss hideousss
        else if( (clickpos>=6310) && (clickpos<=6524) ) {
          if((click.clientY>30) && (click.clientY<85)){
            flipLise();
            return;
          }
        }
        // we could probably come up with something more general, but not in the time available
        else if( (clickpos>=11050 && (clickpos<=11300) )) {
          if((click.clientY>50) && (click.clientY<90)){
            console.log('fake-click: ' + link1.href);
            fakeClick(null, link1);
            return;
          }
          else if((click.clientY>(100) && (click.clientY<((142))))){
            console.log('fake-click: ' + link2.href);
            fakeClick(null, link2);
            return;
          }
        }
        // click on video
        else if( (clickpos>=(9224 + 85) && (clickpos<=(9224 + 85 + 210)) )) {
          if((click.clientY>(40) && (click.clientY<((140))))){
            console.log('click on video: ' + link2.href);
            clickVideo();
            return;
          }
        }




        // for(var idx in clicktargets) {
        //   target = clicktargets[idx];
        //   if(hitTest(target, click)) {
        //     return true;
        //   }
        // }
      return false;
      };


      var onClicked = function(click) {
        var
          result = getClickedElement(click);

        if(!!INITIALIZED){
          return;
        }
      startSession();

      };


      var enableSwipe = function () {

        $("#parallax").parallaxSwipe.SWIPE_ENABLED = true;          

      }








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

        // STATION_SPEED     = 0.75, // when approaching station
        // ROAD_SPEED        = 0.9, // when leaving station
        // DECAY             = 0.75, // when approaching station
        // MOUSEDOWN_DECAY   = 0.75, // when approaching station
        // ROAD_DECAY        = 0.9, // when leaving station
        // ROAD_MOUSE_DECAY  = 0.9, // when leaving station

        LISE_FLIPPED      = false,
        FARMER_FLIPPED    = false,
        TOLERANCE         = 100,


        //store triggers as they occur
        triggers          = [],
        events            = [],
        LAZY_LOADERS      = null;
        ONDEMAND_LOADERS  = null; 
        VIDEO_CONTROLLER  = null;
        CLICK_ENABLED     = false;

        debugpanel        = document.getElementById('debugoutput'),
        parallax          = document.getElementById('parallax'),
        scene             = document.getElementById('layer5'),

        debugtrigger      = document.getElementById('debug_trigger'),
        debuginfo         = document.getElementById('debug_info'),

        lise_recipe       = document.getElementById('lise_recipe'),
        lise_hello        = document.getElementById('lise_hello'),
        farmer_recipe     = document.getElementById('farmer_recipe'),
        farmer_hello      = document.getElementById('farmer_hello'),

        final_btn1        = document.getElementById('final_btn1'),
        final_btn2        = document.getElementById('final_btn2'),

        link1             = document.getElementById('link1');
        link2             = document.getElementById('link2');


        clicktargets  = {};

        // our clicktargets
        var list = document.getElementsByClassName('clicktarget');

        // when there's time, this can be expanded to a general solution
        // where we get the bounding client rect of the click target.
        // this is a way to have guaranteed clickable elements no matter  
        // what. Even if the event is captured by enemy code, we can re-fire it
        // programmatically

        for(var i = 0, count = list.length; i < count; i++) {
          clicktargets[list[i].id] = {
            element : list[i],
            offset : $(list[i]).offset(),
            position : $(list[i]).position(),
            width : list[i].offsetWidth,
            height : list[i].offsetHeight
            }
          }





/**
 *  functions
 *
 */  

      var flipLise = function() {
        if(!LISE_FLIPPED) {
          $('#lise_tips').animate({ top : 300, opacity: 0}, 325, 'linear');
          $('#lise_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          $('#lise_tips').animate({ top : 0, opacity: 1}, 325, 'linear');
          $('#lise_recipe').animate({ top : -300, opacity: 0}, 325, 'linear');
        }
        LISE_FLIPPED = !LISE_FLIPPED;
      };


      var flipFarmer = function() {
        if(!FARMER_FLIPPED) {
          $('#farmer_tips').animate({ top : 300, opacity: 0}, 325, 'linear');
          $('#farmer_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          $('#farmer_tips').animate({ top : 0, opacity: 1}, 325, 'linear');
          $('#farmer_recipe').animate({ top : -300, opacity: 0}, 325, 'linear');
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
            //console.log("");
          }

        if(!!position) {
          currentpos = startpos - position.left;

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

                  // don't slow down at these stations
                  if(counter === 5){
                    continue;
                  }

                  var 
                    stationx = Math.round($("#" + currentstation).position().left);

                  console.log('Requesting position of ' + currentstation + " at " + stationx + ", offset: " + $("#" + currentstation).offset().left + ", position: " + $("#" + currentstation).position().left + ", startpos: " + startpos);
                  $('#parallax').parallaxSwipe.requestPosition(-stationx);
                }
              }
            }
          }
        }
      };



      var initializetimer = function () {
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
      };


      var debug = function (line, obj) {
        var
          caller = (!!arguments) ? arguments.callee.caller.name : false;

        // prepend calling function name, if we know it
        line = caller ? caller + "(): " + line : line;

        // output to console
        !!obj ? console.log(line, obj) : console.log(line);
      };






/**
 *  Initialization 
 * 
 */


    // Hide the address bar in Mobile Safari
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 0);



    /**
     *  Swap to hi-res images for Retina displays
     */
    
    // if (window.devicePixelRatio == 2) {
    //   var images = $("img.hires");

    //   /* loop through the images and make them hi-res */
    //   for(var i = 0; i < images.length; i++) {

    //     /* create new image name */
    //     var imageType = images[i].src.substr(-4);
    //     var imageName = images[i].src.substr(0, images[i].src.length - 4).replace('/img/', '/img/retina/');
    //     imageName += "@2x" + imageType;
    //     /* load retina image */
    //     images[i].src = imageName; 
    //   }
    // }


    $("#parallax").parallaxSwipe( { DECAY: ROAD_DECAY, MOUSEDOWN_DECAY: ROAD_MOUSE_DECAY, SPEED_SPRING: ROAD_SPEED, BOUNCE_SPRING:0.1, 
          HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });


    var layerWidth = $('#parallax').parallaxSwipe.getSize();

    // set width for all parallax stations
    $('.parallax_layer').css('width',layerWidth);


    $('#parallax').bind('touchstart', function (e) { 
         var
            result = {
              offsetLeft : e.target['offsetLeft'],
              offsetTop  : e.target['offsetTop']
            },
            dump = '',
            trueX = 0,
            trueY = 0;


          var x = e.originalEvent.touches[0].pageX;//relative position of html,body document
          var y = e.originalEvent.touches[0].pageY;//relative position of html,body document
          
          var x0 = x - window.scrollX;
          var y0 = y - window.scrollY;


            if(typeof result.offsetLeft !== "number") {
              console.log('no offset');
              dump = "offsetLeft: " + e.target.offsetLeft + "<br />";
            }
            else {
              result.x = x;
              result.y = y;
              result.clientX = x0;
              result.clientY = y0;
              console.log(result);
            }            


          // document.getElementById('touchoutput').innerHTML += 'touchstart_parallax:' + dump + "px <br />";
          
          onClicked(result);

          return true; });

    $('#parallax').bind('mousedown', function (e) { 
          var
            result = {
              offsetLeft : e.target['offsetLeft'],
              offsetTop  : e.target['offsetTop']
            },
            dump = '',
            trueX = 0, trueY = 0;


            if(typeof result.offsetLeft ==="number") {
              result.clientX = e.clientX;
              result.clientY = e.clientY;


              dump = "offsetLeft: " + e.target.offsetLeft + "\n";
              dump += "clientX: " + e.clientX + "\n";
              dump += "clientY: " + e.clientY + "\n";
              trueX = -result.offsetLeft + e.clientX + "\n";
              dump += "trueX: " + trueX + "\n";

            }            

          onClicked(result);
          return true; 
        });



    $('.recipe').bind('selectstart', function (e) { 
      return true; });

    initializetimer();

    });
  });
