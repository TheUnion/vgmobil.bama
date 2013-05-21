
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

            resources : [],
            LAYERS    : [],


            __init : function(){
              var
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

            addLayer : function (obj) {
              //return the index of our newly added resource            
              return LAYER[LAYER.push(obj)-1];
            }
          }; // end of bama_ad object





        $("#parallax").parallaxSwipe( { DECAY:0.9, MOUSEDOWN_DECAY:0.5, SPEED_SPRING:0.7, BOUNCE_SPRING:1, 
            HORIZ:true, SNAPDISTANCE:20, DISABLELINKS: false, LAYER:[ 20, 20, 3.2, 1.6, 1, 0.9 ] });

//         $('#video1').click(function(event) {
//           console.log(event.type + ": " + event.target.id);
//           console.log(event.type + ": " + event.originalTarget.id);
//           event.preventDefault();
//         });




        var layerWidth = $('#parallax').parallaxSwipe.getSize();

        // set width for all parallax layers
        $('.parallax_layer').css('width',layerWidth);


        var getOffsetRect = function (el) {
            console.log("el: ", el);
            // (1)
            var box = el.getBoundingClientRect();
            
            var body = document.body;
            var docElem = document.documentElement;
            
            // (2)
            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;
            
            // (4)
            var top  = box.top +  scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;
            
            return { top: Math.round(top), left: Math.round(left) };
        };



        var doUpdate = function(timestamp) {
          var 
            para   = jQuery('#parallax');
            offset = jQuery('#parallax').offset(),
            prllx  = document.getElementById("parallax");

          var
            progress = Math.round(-(100*(offset.left/ layerWidth)));
            rect     = prllx.getBoundingClientRect();

          // console.log('layer: ', layer);  
          console.log('offset: ', offset);  
          console.log('rect: ', rect);  
          console.log('para: ', para);  
          console.log('prllx: ', prllx);  

          $('#progress').html("progress: " + progress + "%"); 
        };

    });
