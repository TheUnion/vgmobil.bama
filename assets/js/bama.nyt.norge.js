  $(document).ready(function () {

    $(document).bind("dragstart", function() { console.log('dragstart!'); return false; });
   
    $(function() {

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
        sessionstart      = null,
        UPDATE_INTERVAL   = 100, //millisec
        STATION_MARGIN    = 400, // delta for when station becomes visible
        STATION_SPEED     = 0.6, // when approaching station
        ROAD_SPEED        = 0.9, // when leaving station
        DECAY             = 0.75, // when approaching station
        MOUSEDOWN_DECAY   = 0.75, // when approaching station
        ROAD_DECAY        = 0.9, // when leaving station
        ROAD_MOUSE_DECAY  = 0.9, // when leaving station

        //store triggers as they occur
        triggers      = [],
        events        = [],

        debugpanel    = document.getElementById('debugoutput'),
        parallax      = document.getElementById('parallax'),
        debugtrigger  = document.getElementById('debug_trigger'),
        debuginfo     = document.getElementById('debug_info');
        lise_tips     = document.getElementById('lise_tips');
        // farmer_tips   = document.getElementById('farmer_tips');

        lise_tips.add 

      var onEvent = function (eventObject) {
        // eventObject : {
        //   event: eventObject.event,
        //   target: HTMLElement,
        //   x : eventObject.x,
        //   y : eventObject.y,
        //   time: eventObject.time,
        // }

      // # tracking code here

      }


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

          debuginfo.innerHTML = "Current station: " + currentstation + " <br />";
          debuginfo.innerHTML += "Distance travelled: " + (startpos - position.left) + " <br />";
          debuginfo.innerHTML += "Stations visited:<br />";

          // for..in normally not acceptable, but ok with this few elements
          var counter = 0, startAtIndex = 3;
          for (var key in stations) {
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
              if(Math.abs(x) > STATION_MARGIN) {
                if( (currentstation === key) ) {
                  ROAD_SPEED = $('#parallax').parallaxSwipe.setSpeed(ROAD_SPEED, ROAD_DECAY, ROAD_MOUSE_DECAY, x);
                  console.log("Leaving " + key);
                  events.push({ event: 'leave_station', message: 'leaving station ' + key, target: currentstation, time: time});
                  currentstation = 'none';
                }
              } else {
                if(currentstation !== key) {
                  console.log("Arriving at " + key);
                  events.push({ event: 'arrive_station', message: 'arriving at station ' + key, target: currentstation, time: time});
                  currentstation = key;
                  // don't slow down at these stations
                  if(counter === 5){
                    continue;
                  }
                  $('#parallax').parallaxSwipe.setSpeed(STATION_SPEED, DECAY, MOUSEDOWN_DECAY, x);
                  if ((counter === 3) || ((counter === 4))) { 
                    console.log('switching to dirt road...' + key);
                    document.getElementById('road').classList.add('dirt');
                  }
                  else {
                    console.log('switching back to asphalt at station ' + key);
                    document.getElementById('road').classList.remove('dirt');
                  }
                }
              }
            }
            debuginfo.innerHTML += key + ": " + x + "<br />";
          }

        debuginfo.innerHTML += "Time spent: " + Math.round(((time - starttime)/1000) / 60) + ":" + (((time - starttime)/1000) % 60) + " <br />";
        debuginfo.innerHTML += "Session started: " + startdate + " <br />";
        }
        else {
          console.log("(!)debugx: ", debugx);
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
            console.log("station: " + key, value);
            stations[value.id || key] = value;
          });
          count = stations.length;
        }
        else {
          // debugger;
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


    var layerWidth = $('#parallax').parallaxSwipe.getSize();

    // set width for all parallax stations
    $('.parallax_layer').css('width',layerWidth);

    $('.container').on('selectstart', function () { return false; });


    $("#flipbox").flip({
      direction:'lr',
      onBefore: function(){
          console.log('before starting the animation');
      },
      onAnimation: function(){
          console.log('in the middle of the animation');
      },
      onEnd: function(){
          console.log('when the animation has already ended');
      }
    });


    $('.button_flip').on('click', function (el) {
      console.log('flipping: ' + this.id + " (" + this.className + ")");
      switch(this.id) {
        case "flip" :
          $('#lise_large').toggleClass('flip');
          break; 
        case "flip2" :
          $('#farmer_large').toggleClass('flip');
          break; 
      }
    });

    initializetimer();

    });
  });
