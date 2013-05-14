
      $(function() { 

        //1. The parallax div moves with your mouse or touch swipe.
        //2. We're moving sideways so HORIZ: true.
        //3. LAYER: speed of layer 1 and layer2 (higher number=slower (using divide in code).
        //4. I did not LAYER layer3 so it remains static

        $("#parallax").parallaxSwipe( { HORIZ: true, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.1 ] });
        $("#parallax").css({cursor: 'move'})

        var layerWidth = $('#parallax').parallaxSwipe.getSize();



        $('#layer2').css('width',layerWidth); //add some more width for fast moving layers.
        $('#layer3').css('width',layerWidth); 
        $('#layer4').css('width',layerWidth); 
        $('#layer5').css('width',layerWidth); 
        $('#layer_player').css('width',layerWidth); 

      });
