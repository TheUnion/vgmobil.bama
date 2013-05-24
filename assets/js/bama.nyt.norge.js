$(document).ready(function () {
  $(document).bind("dragstart", function() { return false; });
 
  $(function() { //chrome wants it wrapped in function

    // Hide the address bar in Mobile Safari
    setTimeout(function(){
      window.scrollTo(0, 1);
    }, 0);


/**
 *  Swap to hi-res images for Retina displays
 * 
 */
    if (window.devicePixelRatio == 2) {

          var images = $("img.hires");

          /* loop through the images and make them hi-res */
          for(var i = 0; i < images.length; i++) {

            /* create new image name */
            var imageType = images[i].src.substr(-4);
            var imageName = images[i].src.substr(0, images[i].src.length - 4);
            imageName += "@2x" + imageType;

            /* rename image */
            images[i].src = imageName; 
          }
     }



    $("#parallax").parallaxSwipe( { DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.1, 
          HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });


      var layerWidth = $('#parallax').parallaxSwipe.getSize();

      // set width for all parallax layers
      $('.parallax_layer').css('width',layerWidth);
      $('#parallax').on('click', function () {console.log("click!");});
      $('.container').on('click', function () {console.log("click: " + this);});

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
