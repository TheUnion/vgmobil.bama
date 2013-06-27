/*copyright 2012 robert w. stewart torontographic.com*/
;(function($) {

$.fn.parallaxSwipe = function(options) {
var defaults = {DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.5, BOUNCE_SPRING:0.08, SNAPDISTANCE:20, DISABLELINKS:true, LAYER:[]
};
var o = $.extend(defaults, options);
var plugin = this; //jQuery object or a collection of jQuery objects.
var elm = document.getElementById(plugin.attr('id')); //instance
var panel = plugin.children(".panel"); // panels inside slider.
var vw = parseInt(plugin.parents('div').css('width'),10);  //viewport width.
var vh = parseInt(plugin.parents('div').css('height'),10); //viewport height.
var _velocity = 0, _velocity2 = 0;
var bouncing = 0, _mouseDownLT, _mouseDownXY, _lastMouseDownXY, panelnum=1;
var edge, sliderLT, sliderLen, _mouseDown = false, ie = false, hasTouch = false, VIEWPORT, len;
var startAnimFrame=false;



/*** -- FIX  -- ***/
//flags to indicate fs the layers have reached the edges
var leftEdge= true;
var rightEdge = false;
/******/


  var sliderW = parseInt(panel.css('width'),10) * panel.length;
  VIEWPORT=vw; edge='left'; panel.css('float','left'); plugin.css('width',sliderW); sliderLen = sliderW;

plugin.css(edge,0);

this.parallaxSwipe.getSize = function(i){ if (sliderW>'') { return sliderW; } else { return sliderH; }};



/**
 *  This is the animation loop
 * 
 */

var mouseswipe=function(sliderLT) {
  var
    oldSliderLT = sliderLT,
    debugdata = '';


  // this is our animation loop, so escape early
  // if there's nothing to do

  if (_mouseDown) {
    _velocity *= o.MOUSEDOWN_DECAY;
  } else {
    _velocity *= o.DECAY;
  }


  if (!_mouseDown) {
   
    // have we requested a specific position? I.e. to stop at a station or at either end
    if(!!REQUESTED_POSITION) {
      
      // move 20% of the difference


      // console.log("_velocity: " + _velocity);
      _velocity = 0.2 * (REQUESTED_POSITION - sliderLT);

      // console.log("REQUESTED_POSITION: " + REQUESTED_POSITION);
      // console.log("sliderLT: " + sliderLT);
      // console.log("NEW _velocity: " + _velocity);
      // console.log("----------");


      if((sliderLT - _velocity) < -REQUESTED_POSITION){
        sliderLT = Math.round(REQUESTED_POSITION);

        plugin.css(edge,sliderLT);
        if (o.LAYER.length>0) {
         
          $.each(o.LAYER, function(index, value) {
            $('#layer'+(index+1)).css(edge,sliderLT/value); //loop through parallax layers
          });
        }
        return;      
      }
    }
    else {

    }

    //swipe left
    if (sliderLT > ( 0 - _velocity ))  {
      sliderLT = 0;
      plugin.css(edge,sliderLT); 
      if (o.LAYER.length>0) {
        $.each(o.LAYER, function(index, value) {
          $('#layer'+(index+1)).css(edge,sliderLT); //layer
        });
      }
      return;
    } 
    else if (sliderLT + sliderLen < VIEWPORT) {

      bouncing  = (VIEWPORT - sliderLen - sliderLT) * o.BOUNCE_SPRING;

    //  console.log("staying at " + sliderLT + ", we reached the end of the ")
    //   plugin.css(edge,sliderLT); //swipe left
    //   if (o.LAYER.length>0) {
       
    //     $.each(o.LAYER, function(index, value) {
    //       $('#layer'+(index+1)).css(edge,sliderLT); //layer
    //     });
    //   }
    //   return;
    } 
    else {   
      bouncing = 0; 
    }

    if (_lastMouseDownXY-_mouseDownXY < 0) {
     
      var 
        delta = Math.round(_velocity + bouncing);

      var newSliderLT = sliderLT + delta;

      plugin.css(edge,newSliderLT); //swipe left
      if (o.LAYER.length>0) {
       
        $.each(o.LAYER, function(index, value) {
          $('#layer'+(index+1)).css(edge,newSliderLT/value); //layer
        });
      }
    } else {

      var 
        delta = Math.round(_velocity + bouncing);

      plugin.css(edge,sliderLT + delta); //swipe right
      if (o.LAYER.length>0) {
        $.each(o.LAYER, function(index, value) {
          // this is where we had a bug that screwed up tha hard stop, the "/value" bit had gone missing
          $('#layer'+(index+1)).css(edge,(sliderLT + delta)/value); //layer
        });

      }
    }
  }
};
window.requestAnimFrame = function(){ 
  return ( window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || 
  function(callback){ window.setTimeout(callback, 1000 / 60); } );
}();

function frame() { mouseswipe(parseInt(plugin.css(edge),10)); if (startAnimFrame == true) { requestAnimFrame(frame); } };

var disablelinks=function() {
  $('a', plugin).each(function(){ 
  $(this).click(function(){ if(Math.abs(_lastMouseDownXY-_mouseDownXY) >= o.SNAPDISTANCE) {return false;} }); 
}); 
};

var touchStart=function(e) { //mouse down

/* ----  FIX  ----- */

  REQUESTED_POSITION = false;

  /* ----  FIX  ----- */

  if (!_mouseDown) {
    if (hasTouch) { 
     // e.preventDefault(); 
      e = event.touches[0]; 
    } else if (!e) {
        e = window.event; 
      }
    if (elm.setCapture) {
      //elm.setCapture(); //if dragged outside of div
    } else {
      window.addEventListener('mousemove', touchMove, false);
      window.addEventListener('mouseup', touchEnd, false);
    }
   
   
      _mouseDownXY = _lastMouseDownXY = ie == true ? e.clientX : e.pageX;
      _mouseDownLT = document.getElementById(plugin.attr('id')).offsetLeft;
    
/****/
//Adding variables to evaluate vertical swipe
/*****/
   
      _verticalXY = _lastVerticalDownXY = ie == true ? e.clientY : e.pageY;
      _verticalLT = document.getElementById(plugin.attr('id')).offsetTop;

   console.log("touchStart");
    console.log("_verticalXY "+_verticalXY+ " _verticalLT "+ _verticalLT);


/******/
//set the flags for the edges you cannot start swipe left if you have reached the left edge same for right
     if(_mouseDownLT == 0){ 
      leftEdge = true; 
      //console.log("leftEdge set");
    }else if ( _mouseDownLT <= -11420){
      rightEdge = true;
      //console.log("rightEdge set");
      } else {
        leftEdge = false;
        rightEdge = false;
      }
/******/
    _mouseDown = true;
    if (startAnimFrame==false) { startAnimFrame=true; requestAnimFrame(frame); } //mouseSwipe
  
  }
 
};


/*
  Custom adaptations to plugin

 */


this.parallaxSwipe.setSpeed = function(newspring, decay, mousedecay) { 
  var
    result = o;

  o.DECAY           = decay;
  o.MOUSEDOWN_DECAY = mousedecay;

  //_velocity       = newvelocity;
  return o;
};

/**
 * Request move to specific position in scene
 * 
 */


this.parallaxSwipe.requestPosition = function (position) {
  REQUESTED_POSITION = Math.round(position);
  console.log("REQUESTED_POSITION: " + REQUESTED_POSITION);
}


this.parallaxSwipe.setEdge = function (which) {

  console.log("setting edge: " + which);
  switch (which.toLowerCase()) {
    case "right"  : rightEdge = true; break;
    case "left"   : leftEdge  = true; break;
  }
}



var touchMove=function(e) { //mouse move

  var tevent = e;
 
  if (_mouseDown) {

    if (hasTouch) { 
     //e.preventDefault(); 
      tevent = event.touches[0]; 
    } else if (!tevent) {
        tevent = window.event; 
    }
    if (ie == true) {
      var MouseXY =  tevent.clientX ;
      var VerticalXY = tevent.clientY;
    } else {
      var MouseXY = tevent.pageX ;
      var VerticalXY = tevent.pageY;
    }

     var deltaX = MouseXY - _lastMouseDownXY;
     var deltaY = VerticalXY - _lastVerticalDownXY;

     if ( isHorizontalSwipe(deltaX,deltaY ) ) {
         e.preventDefault(); 
/******/
// consoleVar is the css value for the left parameter
    var consoleVar = _mouseDownLT + (MouseXY - _mouseDownXY);

//If you are in the left edge and swipe left the layers won't move, or if you are swiping to the left from a different position than the edge it will also stop the movement of layers same for the right
    if (leftEdge && consoleVar>0 || (consoleVar>0)){
      //console.log("moving over the left edge");
      rightEdge = false;
    }else if (rightEdge && consoleVar <-11420 || ( consoleVar< -11420)) {
      //-1800 is the width of the layer number of stations * width of each station here 3x900
     // console.log("moving over the right edge");
      leftEdge = false;
      }
      else {
/******/
    plugin.css(edge, _mouseDownLT + (MouseXY - _mouseDownXY));
    if (o.LAYER.length>0) {
      $.each(o.LAYER, function(index, value) {
        $('#layer'+(index+1)).css(edge, (_mouseDownLT + (MouseXY - _mouseDownXY))/value); //layer
        
      });
    }
    _velocity += ((MouseXY - _lastMouseDownXY) * o.SPEED_SPRING);
    _lastMouseDownXY = MouseXY;
/******/
  }
/******/
              
      }
      else{
        console.log('NOT Horizontal Swipe');
        
        //horizontalCount = false;
        e.stopPropagation();
        
      }

  }
};

var touchEnd=function(e) { //mouse up
  if (_mouseDown) {
      _mouseDown = false;
      disablelinks();
    if (elm.setCapture) { 
      elm.releaseCapture();
    } else { 
    window.removeEventListener('mousemove', touchMove, false);
    window.removeEventListener('mouseup', touchEnd, false);
    }
  }
};

var isHorizontalSwipe = function ( deltaMov, deltaMovY) { // evaluate swipe direction
                
        var horzSwipe;

        if (deltaMovY == 0) {
            horzSwipe=true;

        }else if ((deltaMov/deltaMovY) <= 0.37 && (deltaMov/deltaMovY) >= -0.37 ){
            
            horzSwipe= false;

          } else {
             horzSwipe= true;
          }
         
        return horzSwipe;
      }; 

  hasTouch = 'ontouchstart' in window;
  plugin.bind('mousedown touchstart', function(event){ touchStart(event); }); 
  plugin.bind('mousemove touchmove', function(event){ touchMove(event); }); 
  plugin.bind('mouseup touchend', function(event){ touchEnd(event); });
} //end options
})(jQuery)