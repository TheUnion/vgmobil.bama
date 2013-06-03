  $(document).ready(function () {

   // $(document).bind("dragstart", function() { return false; });
   
    $(function() {

      var 
        INITIALIZED = false,
        lazyload    = [];



/*
    background-repeat    : repeat-x,
    no-repeat; 
    background-origin    : content-box;
    background-position  : 0px 328px, 64px 302px;

 */


      // this is where we send all trackable events
      var onEvent = function (eventObject) {


      if(!INITIALIZED) {
        INITIALIZED = true;
        startSession();
      }

        // eventObject : {
        //   event: eventObject.event,
        //   target: HTMLElement,
        //   x : eventObject.x,
        //   y : eventObject.y,
        //   time: eventObject.time,
        // }

      // # tracking code here
        events.push(eventObject);
        // console.log(events);
      };


      var startSession = function() {

        var
          lazyloaders = document.getElementsByClassName('lazyload');

        console.log("Starting user session ...")
        console.log("Loading bg images ...");
        // load extra backgrounds on first user interaction
        for(var i = 0, count = lazyloaders.length; i < count; i++) {
          console.log("Adding class " + lazyloaders[i].id + " to #" + lazyloaders[i].id);
          lazyloaders[i].classList.add(lazyloaders[i].id);
        }
      };




      var hitTest = function (target, click) {
        var 
          clickpos = Math.abs(click.offsetLeft + startpos) + click.clientX,
          targetpos = (target.offset.left + target.position.left),
          distance = 0;



        distance = Math.abs(clickpos - targetpos);
        return (distance<TOLERANCE);
      };


      var getClickedElement = function (click) {
        var
          target = null,
          sceneLeft = scene.getBoundingClientRect().left,
          parallaxLeft = parallax.getBoundingClientRect().left;

          clickpos = Math.abs(click.offsetLeft + startpos) + click.clientX;
          // console.log('click: ' + click.x + ", "+ click.y);

        
        if(LISE_FLIPPED) {
          flipLise();
          return;
        }

        if(FARMER_FLIPPED) {
          flipFarmer();
          return;
        }



        if( (clickpos>=4812) && (clickpos<=5042) ) {
          if((click.clientY>232) && (click.clientY<282)){
            flipFarmer();
            return;
          }
        }
        else if( (clickpos>=6380) && (clickpos<=6600) ) {
          if((click.clientY>232) && (click.clientY<282)){
            flipLise();
            return;
          }
        }
        else if( (clickpos>=11111 && (clickpos<=11325) )) {
          if((click.clientY>132) && (click.clientY<382)){
            //window.location.href = 'http://bama.no';
            //goURL('http://bama.no');
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

        if(!result){
          

        }
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
        currentpos        = 0;
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
        TOLERANCE         = 100;


        //store triggers as they occur
        triggers      = [],
        events        = [],

        debugpanel    = document.getElementById('debugoutput'),
        parallax      = document.getElementById('parallax'),
        scene         = document.getElementById('layer5'),

        debugtrigger  = document.getElementById('debug_trigger'),
        debuginfo     = document.getElementById('debug_info'),

        lise_recipe   = document.getElementById('lise_recipe'),
        lise_hello    = document.getElementById('lise_hello'),
        farmer_recipe = document.getElementById('farmer_recipe'),
        farmer_hello  = document.getElementById('farmer_hello'),

        final_btn1    = document.getElementById('final_btn1'),
        final_btn2    = document.getElementById('final_btn2'),

        clicktargets  = {};


        // our clicktargets
        var list = document.getElementsByClassName('clicktarget');

        for(var i = 0, count = list.length; i < count; i++) {
          clicktargets[list[i].id] = {
            element : list[i],
            offset : $(list[i]).offset(),
            position : $(list[i]).position(),
            width : list[i].offsetWidth,
            height : list[i].offsetHeight
            }
          }


    // $('#layer5').bind("click tap touchstart", function() { console.log('layer5!'); return false; });

      var flipLise = function() {
        if(!LISE_FLIPPED) {
          console.log('lise flipper');
          $('#lise_tips').animate({ top : 500, opacity: 0}, 325, 'linear');
          $('#lise_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          $('#lise_tips').animate({ top : 40, opacity: 1}, 325, 'linear');
          $('#lise_recipe').animate({ top : -500, opacity: 0}, 325, 'linear');
        }
        LISE_FLIPPED = !LISE_FLIPPED;
      };


      var flipFarmer = function() {
        if(!FARMER_FLIPPED) {
          console.log('bonden flipper');
          $('#farmer_tips').animate({ top : 500, opacity: 0}, 325, 'linear');
          $('#farmer_recipe').animate({ top : 0, opacity: 1}, 325, 'linear');
        }
        else {
          console.log('bonden flipper tilbake');
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
            //console.log("");
          }

        if(!!position) {
          currentpos = startpos - position.left;
          if(position.left !== 0) {
            console.log("First movement!");
            INITIALIZED = true
            startSession();
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
                  console.log("Leaving " + key);
                  var
                    userEvent = { event: 'leave_station', message: 'leaving station ' + key, target: currentstation, time: time};
                  
                  onEvent(userEvent);
                  currentstation = 'none';
                }
              } else {
                if(currentstation !== key) {
                  console.log("Arriving at " + key);
                  onEvent({ event: 'arrive_station', message: 'arriving at station ' + key, target: currentstation, time: time});
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
        else {
          console.log("(WTF!) no position?   debugx: ", debugx);
          console.log("position is " + position + ", parallax is " + parallax);
        }
      };



      var initializetimer = function (dbg) {

        var
          count = stations.length;

        if(!!dbg) {
          console.log('initializing timer...');
        }

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

        // prepend calling function name
        line =  (caller) ? caller + "(): " + line : line;

        // output to console
        !!obj ? console.log(line, obj) : console.log(line);
      };


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


    var layerWidth = $('#parallax').parallaxSwipe.getSize() + 580;

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

          if(!INITIALIZED) {
            INITIALIZED = true;
            startSession();
          }

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

          // for(var index in e.target) {
          //   if ((typeof e.target[index] == "number") && ((index.indexOf('client')==0) || (index.indexOf('offset')==0) || (index.indexOf('scroll')==0) ) )  {
          //     dump += (index + ": " + e.target[index] + "\n");
          //   }
          // }
//           for(var index in e) {
// //            console.log(index);
//             dump += (index + ": " + e[index] + "\n");
//           }
          onClicked(result);
          // console.log('mousedown_result: ', result);
          return true; 

        });



    $('.recipe').bind('selectstart', function (e) { 
      alert('selectstart', e);
      return true; });

    $('.recipe').bind('click', function (e) { 
      alert('click', e);
      return true; });


    initializetimer();

    });
  });
