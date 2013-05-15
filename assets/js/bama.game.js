
      $(function() { 

        //1. The parallax div moves with your mouse or touch swipe.
        //2. We're moving sideways so HORIZ: true.
        //3. LAYER: speed of layer 1 and layer2 (higher number=slower (using divide in code).
        //4. I did not LAYER layer3 so it remains static


// var defaults = {DECAY:0.95, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.08,
//   HORIZ:true, SNAPDISTANCE:20, DISABLELINKS:true, LAYER:[]
// };


        $("#parallax").parallaxSwipe( { DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.08, 
            HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });
        $("#parallax").css({cursor: 'move'})

        var layerWidth = $('#parallax').parallaxSwipe.getSize();



        $('.parallax_layer').css('width',layerWidth);


        var 
            bama_timeout_func = function(i) {
                var
                    animations = [ "shake", "bounce", "flash", "swing", "tada", "wobble", "pulse", "flip", "flipInX", "bounceIn", "rotateIn"],
                    index = 0, current = 0, previous=0;

                if( i % 2 === 0 ){
                      current = i % animations.length;
                      previous = ( (i + animations.length) % (animations.length) );
                      $('#car').css.addClass( animations[i]);
                      $('#animationclass').innerHTML = animations[i];
                    }
                    else {
                      $('#car').css.removeClass( animations[previous]);
                    }
              setTimeout(bama_timeout_func, 3000, ++i)
            };

        setTimeout(bama_timeout_func, 1000, 0);

        // $('#layer_bg').css('width',layerWidth); //add some more width for fast moving layers.
        // $('#layer_middle2').css('width',layerWidth); //add some more width for fast moving layers.
        // $('#layer_middle1').css('width',layerWidth); //add some more width for fast moving layers.
        // $('#layer_front2').css('width',layerWidth); 
        // $('#layer_front1').css('width',layerWidth); 
        // $('#layer_top').css('width',layerWidth); 
        // $('#layer_player').css('width',layerWidth); 

      });
