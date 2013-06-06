
      $(function() { 

        //1. The parallax div moves with your mouse or touch swipe.
        //2. We're moving sideways so HORIZ: true.
        //3. LAYER: speed of layer 1 and layer2 (higher number=slower (using divide in code).
        //4. I did not LAYER layer3 so it remains static


// var defaults = {DECAY:0.95, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.08,
//   HORIZ:true, SNAPDISTANCE:20, DISABLELINKS:true, LAYER:[]
// };


    /**
     *  bama_ad : object holding all the information necessary for 
     *            loading resources, setting up and executing the ad
     *
     */

/*      
        Data types 



        LAYER : 
          Object {

            zindex  : 0,
            class   : '',

            // divisor, smaller numbers means faster movement. Sensible range: approx. 0.2 - 20
            speed   : 1.0,

            options : {
              DECAY:0.9, 
              MOUSEDOWN_DECAY:0.5, 
              SPEED_SPRING:0.7, 
              BOUNCE_SPRING:0.08, 
              HORIZ:true, 
              SNAPDISTANCE:20, 
              DISABLELINKS: false, 
              LAYER:[ 
                20, 20, 3.2, 1.6, 1, 0.9 
                ]
              },

            css     : {
              id      : '',
              classes : ['bama', ''],
              // add css properties, they will be slavishly added to the layer element
              method  : 'absolute',  // or relative
              top     : '0px',
              left    : '0px',
              width   : '580px',
              height  : '500px'
            }
          }

        resource : 
          {
            type      : 'js',
            role      : 'sprite',  // 'bg', 'img', 'style', 'code', 
            url       : '',
            preload   : false,
            priority  : null,
            addTo     : element,
            LAYER     : element,
            css       : {
              method  : 'absolute',  // or relative
              top     : '0px',
              left    : '0px',
              width   : '580px',
              height  : '500px'
            }
          }
*/

     

        var 
          bama_ad = {

            self      : null,
            resources : [],
            LAYERS    : [],


            __init : function(){
              self = this;
            },

/**
        function addResource
          - adds a resource to the ad's loader/preloader

        @param resource : 
          {
            type      : 'js',
            role      : 'sprite',  // 'bg', 'img', 'style', 'code', 
            url       : '',
            id        : '',
            class     : '';
            preload   : false,
            priority  : null,
            addTo     : element,
            LAYER     : element,
            css       : {
              method  : 'absolute',  // or: 'relative'
              top     : '0px',
              left    : '0px',
              width   : '580px',
              height  : '500px'
            },
            img : {
              top     : '0px',
              left    : '0px',
              width   : '580px',
              height  : '500px',

            }
          }
 */
            addResource: function (obj) {
              //return the index of our newly added resource            
              if (π.require())
                return resources[resources.push(obj)-1];
            },

            addLayer : function (obj) {
              //return the index of our newly added resource            
              return LAYER[LAYER.push(obj)-1];
            }
          }; // end of bama_ad object





        $("#parallax").parallaxSwipe( { DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:0.08, 
            HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: true, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });

//        $("#parallax").css({cursor: 'move'})

        var layerWidth = $('#parallax').parallaxSwipe.getSize();

        // set width for all parallax layers
        $('.parallax_layer').css('width',layerWidth);

      });