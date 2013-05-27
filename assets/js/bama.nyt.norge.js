  $(document).ready(function () {

    $(document).bind("dragstart", function() { console.log('dragstart!'); return false; });
   
    $(function() {

    //variables global to our scope

      var 
        timer     = null,
        loaded    = null,
        starttime = null,
        layers    = [],
        oldconsole = window.console,
        console   = {
          log : function (line, obj) {
           // no message, escape
            if(!!!line) {
              return false;
            }

            // prepend time
            line = (new Date().getTime()) + ": " + line;

            if(!!debugoutput) {
              debugoutput.value += line;
              }
            else {

              // if obj given, log it to console
              (!!obj) ? oldconsole.log(line, obj) : oldconsole.log('fake.console: ' + line);
            }
          },
          debug : oldconsole.debug,
          info  : oldconsole.info,
          error : oldconsole.error
          },

        debugpanel  = document.getElementById('debugoutput'),
        debuginfo   = document.getElementById('debuginfo'),
        parallax    = document.getElementById('parallax');


        oldconsole.log('');




      var initializetimer = function (dbg) {

        var
          count = layers.length;

        if(!!dbg) {
          console.log('initializing timer...');
        }


        if(!count) {
          $('.parallax_layer').each(function (el){
            layers.push(el);
          });
          count = layers.length;
          console.log("layers.length = " + layers.length);
        }
        else {
          debugger;
        }
        timer = setInterval(ontimer, 100);
      };


      var debug = function (line, obj) {

        // no message, quick escape
        if(!!!line) { return false; }

        var
          caller = (!!arguments) ? arguments.callee.caller.toString() : false;

        // // prepend time
        // line = (new Date().getTime()) + ": " + line;

        // prepend calling function name
        line =  (caller) ? caller + "(): " + line : line;

        if(!!debugoutput) {
          // redirect to our debugconsole
          debugoutput.value += line;
          }
        else {
          // if obj given, log it to console
          (!!obj) ? console.log(line, obj) : console.log(line);
        }
      };


      var ontimer = function (e) {
        var
          i,x,y       = 0,
          time        = (new Date()).getTime(),
          trigger     = {},
          position    = parallax.getBoundingClientRect();

        if(!!position) {
          debug("x: " + position.left);
        }
      };




    // Hide the address bar in Mobile Safari
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 0);



    /**
     *  Swap to hi-res images for Retina displays
     */
    if (window.devicePixelRatio == 2) {
      var images = $("img.hires");

      /* loop through the images and make them hi-res */
      for(var i = 0; i < images.length; i++) {

        /* create new image name */
        var imageType = images[i].src.substr(-4);
        var imageName = images[i].src.substr(0, images[i].src.length - 4).replace('/img/', '/img/retina/');
        imageName += "@2x" + imageType;
        /* load retina image */
        images[i].src = imageName; 
      }
    }



    $("#parallax").parallaxSwipe( { DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.1, 
          HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });


    var layerWidth = $('#parallax').parallaxSwipe.getSize();

    // set width for all parallax layers
    $('.parallax_layer').css('width',layerWidth);
    $('.container').on('click', function () {
      if (!timer) {
        initializetimer();
        oldconsole.log('test!');
      }
    });

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

    });
  });
