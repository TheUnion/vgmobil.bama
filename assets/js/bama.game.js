


    $(document).ready(function () {
    //  $(document).bind("dragstart", function() { console.log('dragstart'); return false; });

      $(function() { //chrome wants it wrapped in function
      //1. The parallax div moves with your mouse or touch swipe.
      //2. We're moving sideways so HORIZ: true.
      //3. LAYER: speed of layer 1 and layer2 (higher number=slower (using divide in code).
      //4. I did not LAYER layer3 so it remains static

        $("#parallax").parallaxSwipe( { HORIZ: true, DISABLELINKS: false, LAYER:[ 40, 15, 3.2, 1.6, 0.1, 0.1 ] });
        $("#parallax").css({cursor: 'move'})
        //layer2 and layer3 have no elements. We need to know the parallax's real hidden height.
        //depending on HORIZ: call function to get width or height
        var layerWidth = $('#parallax').parallaxSwipe.getSize();

        $('#layer2').css('width',layerWidth); //add some more width for fast moving layers.
        $('#layer3').css('width',layerWidth); 
        $('#layer4').css('width',layerWidth); 
        $('#layer5').css('width',layerWidth); 
        $('#player').css('width',layerWidth); 

        // $('.container').on('selectstart',function () {
        //   console.log('selectstart on ' + this.className + " : #" + this.id);
        //   return false;
        // }); 

        // $('.container').on('click',function () {
        //   console.log('click on ' + this.className + " : #" + this.id);
        //   return false;
        // }); 

        // $('#layer_player').on('selectstart',function () {
        //   return false;
        // }); 

        // $('#video1').on( "click", function (event) {
        //   // this.play();
        //   if (navigator.userAgent.indexOf('Opera') > -1) {
        //     if (this.paused) {
        //       this.play();
        //     }
        //   }
        // return true;
        // });

        // $('#video1_container').on( "selectstart", function (event) {
        //   return false;
        // });

      });
    });
