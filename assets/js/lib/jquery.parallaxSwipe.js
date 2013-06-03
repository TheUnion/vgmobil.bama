/*copyright 2012 robert w. stewart torontographic.com*/
;(function($) {

$.fn.parallaxSwipe = function(options) {
var defaults = {DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.5, BOUNCE_SPRING:0.08,
  HORIZ:true, SNAPDISTANCE:20, DISABLELINKS:false, LAYER:[]
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



/*** -- FIXES  -- ***/
//flags to indicate is the layers have reached the edges
var leftEdge= true;
var rightEdge = false;

var ARRIVING_AT_STATION = false;
var LEAVING_STATION     = false;
var SWIPE_ENABLED       = false;
var REQUESTED_POSITION  = false;




/******/


if (o.HORIZ==true) {
  var sliderW = parseInt(panel.css('width'),10) * panel.length;
  VIEWPORT=vw; edge='left'; panel.css('float','left'); plugin.css('width',sliderW); sliderLen = sliderW;
} else {
  var sliderH = parseInt(panel.css('height'),10) * panel.length;
  VIEWPORT=vh; edge='top'; panel.css('float','none'); plugin.css('height',sliderH); sliderLen = sliderH;
}
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

  if (_mouseDown) {
    _velocity *= o.MOUSEDOWN_DECAY;
  } else {
    _velocity *= o.DECAY;
  }


  if (!_mouseDown) {
   
    if(!!REQUESTED_POSITION) {
      // move 10% of the difference
      _velocity = 0.1 * (REQUESTED_POSITION - sliderLT);

      if((sliderLT - _velocity) < -REQUESTED_POSITION){
        sliderLT = Math.round(REQUESTED_POSITION);

        plugin.css(edge,sliderLT);
        if (o.LAYER.length>0) {
         
          $.each(o.LAYER, function(index, value) {
            $('#layer'+(index+1)).css(edge,sliderLT); //loop through parallax layers
          });
        }
        return;      
      }
    }


    if (sliderLT > ( 0 - _velocity ))  {
      sliderLT = 0;
      // _velocity = 0;
      console.log("moving to zero, sliderLT: " + sliderLT);

      plugin.css(edge,sliderLT); //swipe left
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
        delta = Math.ceil(_velocity + bouncing);
      if(delta === 1) {
        console.log("LEFT delta: " + delta + ". Is this our bug?  -   _velocity: " + _velocity + ", bouncing: " + bouncing);     
      }

      // console.log('Moving to ' + (sliderLT + Math.ceil(_velocity + bouncing)));
      var newSliderLT = sliderLT + Math.ceil(_velocity + bouncing);


      plugin.css(edge,newSliderLT); //swipe left
      if (o.LAYER.length>0) {
       
        $.each(o.LAYER, function(index, value) {
          $('#layer'+(index+1)).css(edge,newSliderLT/value); //layer
        });
      }
    } else {

      var 
        delta = Math.ceil(_velocity + bouncing);
      if(delta === 1) {
        debugdata += "<br />RIGHT delta: " + delta + ". Is this our bug? <br />_velocity: " + _velocity + "<br />bouncing: " + bouncing;
      }

      plugin.css(edge,sliderLT + delta); //swipe right
      if (o.LAYER.length>0) {
        $.each(o.LAYER, function(index, value) {
          $('#layer'+(index+1)).css(edge,(sliderLT + delta)/value); //layer
        });

      }
    }

  debugdata += "sliderLT is " + sliderLT + "<br />_velocity is " + _velocity + "<br />REQUESTED_POSITION is " + REQUESTED_POSITION + "<br />bounce is " + bouncing;
  $('#position_data').html(debugdata);
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
    if (hasTouch) { e.preventDefault(); e = event.touches[0]; } else { if (!e) e = window.event; }
    if (elm.setCapture) {
      //elm.setCapture(); //if dragged outside of div
    } else {
      window.addEventListener('mousemove', touchMove, false);
      window.addEventListener('mouseup', touchEnd, false);
    }
   
    if (o.HORIZ==true) {
      _mouseDownXY = _lastMouseDownXY = ie == true ? e.clientX : e.pageX;
      _mouseDownLT = document.getElementById(plugin.attr('id')).offsetLeft;
    } else {
      _mouseDownXY = _lastMouseDownXY = ie == true ? e.clientY : e.pageY;
      _mouseDownLT = document.getElementById(plugin.attr('id')).offsetTop;
    }
/******/
//set the flags for the edges you cannot start swipe left if you have reached the left edge same for right
     if(_mouseDownLT == 0){ 
      leftEdge = true; 
      console.log("leftEdge set");
    }else if ( _mouseDownLT <= -11420){
      rightEdge = true;
      console.log("rightEdge set");
      } else {
        leftEdge = false;
        rightEdge = false;
      }
/******/
    _mouseDown = true;
    if (startAnimFrame==false) { startAnimFrame=true; requestAnimFrame(frame); } //mouseSwipe
  
  }
 
};

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
}



var touchMove=function(e) { //mouse move
  
  if (_mouseDown) {
    if (hasTouch) { e.preventDefault(); e = event.touches[0]; } else { if (!e) e = window.event; }
    if (ie == true) {
      var MouseXY = edge == 'left' ? e.clientX : e.clientY;
    } else {
      var MouseXY = edge == 'left' ? e.pageX : e.pageY;
    }

/******/
// consoleVar is the css value for the left parameter
    var consoleVar = _mouseDownLT + (MouseXY - _mouseDownXY);

//If you are in the left edge and swipe left the layers won't move, or if you are swiping to the left from a different position than the edge it will also stop the movement of layers same for the right
    if (leftEdge && consoleVar>0 || (consoleVar>0)){
//      console.log("moving over the left edge");
      rightEdge = false;
    }else if (rightEdge && consoleVar <-11420 || ( consoleVar< -11420)) {
      //-1800 is the width of the layer number of stations * width of each station here 3x900
      // console.log("moving over the right edge");
      leftEdge = false;
      }
      else {
/******/
    var
      whereTo = (_mouseDownLT + (MouseXY - _mouseDownXY));

    sliderLT = sliderLT + ((whereTo-sliderLT)*0.9);

        
    plugin.css(edge, whereTo);
    if (o.LAYER.length>0) {
      $.each(o.LAYER, function(index, value) {
        $('#layer'+(index+1)).css(edge, whereTo/value); //layer
        
      });
    }

    _velocity += ((MouseXY - _lastMouseDownXY) * o.SPEED_SPRING);
    _lastMouseDownXY = MouseXY;


/******/

  }
/******/
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

  hasTouch = 'ontouchstart' in window;
  plugin.bind('mousedown touchstart', function(event){ touchStart(event); }); 
  plugin.bind('mousemove touchmove', function(event){ touchMove(event); }); 
  plugin.bind('mouseup touchend', function(event){ touchEnd(event); });
} //end options
})(jQuery)