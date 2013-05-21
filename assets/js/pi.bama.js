/***
   *
   * π
   *
   * @author @copyright Johan Telstad, jt@kroma.no, 2013
   *
   */


  var 
      π  = π  || {},
      pi = pi || π;


  /*  ----  Our top level namespaces  ----  */
    π.events      = π.events      || { _self: this, _loaded: false, _ns: 'events' };
    π.srv         = π.srv         || { _self: this, _loaded: false, _ns: 'srv' };
    π.app         = π.app         || { _self: this, _loaded: false, _ns: 'app' };
    π.session     = π.session     || { _self: this, _loaded: false, _ns: 'session' };
    π.system      = π.system      || { _self: this, _loaded: false, _ns: 'system' };
    π.debug       = π.debug       || { _self: this, _loaded: false, _ns: 'debug' };

    π.util        = π.util        || { _self: this, _loaded: false, _ns: 'util' };
    π.plugins     = π.plugins     || { _self: this, _loaded: false, _ns: 'plugins' };
    π.math        = π.math        || { _self: this, _loaded: false, _ns: 'math' };
    π.statistics  = π.statistics  || { _self: this, _loaded: false, _ns: 'statistics' };

    π.maverick    = π.maverick    || { _self: this, _loaded: false, _ns: 'maverick' };


    // relative paths to app resources
    π.ASSETS_ROOT = "assets/";
    π.APP_ROOT    = π.ASSETS_ROOT + "assets/js/";

    
    //will keep an updated list over which modules are loaded
    π.loaded = [];


    /*
      global support functions
    */

    pi.forEachObj = function(object, callback) {
          for (var index in object) {
              callback.call(pi, index, object[index]);
          }
      };

    // refreshes the global namespace
    π.updateNS = function(includeServer) {
      var 
        server_too = includeServer || false,
        recurse = function(idx, obj) {
          if(typeof obj==="object") {
            console.log('found: ', obj);
            pi.forEachObj(obj, recurse);
          }
        };

      pi.forEachObj(pi, recurse);
    };


    π.getName = function (func) {
      if(typeof func !== "function") {
        return false;
      }
      else {
        return func.name;
      }
    };


    π.debug = function( msg, obj, caller ) {

      var 
        object  = obj || '', 
        you     = thisPtr || '',
        message = you + ": " + msg,
        caller  = arguments.callee.caller || caller || '';

      if (arguments.callee.caller == null) {
        return ( self.name + "(): the function was called from the top of the namespace.");
      } 
      else {
        return (self.name + "(): called from " + arguments.callee.caller.name);
        }

      console.log(msg, obj, caller);
    };


    π.log = function(msg, obj, thisPtr) {

      var
        object  = obj || '', 
        you     = thisPtr || '';

      if( you !== '' ) {
        message = you + ": " + msg;
      }

      console.log(msg, obj);

    };


    pi.inject = function (src, elem) {
      var 
        element   = elem || document.body,
        fragment  = document.createDocumentFragment(),
        container = document.createElement("div");
       
      container.innerHTML = src;
      fragment.appendChild(container);
      element.appendChild(fragment);
    };


    π.loadResource = function(src, async, defer){

      if (π.loaded[resource]) {
        return true;
      }
  
      var 
        hasPath = ( script.indexOf("://") !== -1 ),
        cursor  = document.getElementsByTagName ("head")[0] || document.documentElement,
        path    = π.APP_ROOT;


      // pi.log('loading module (' + (!!async ? "async" : "sync") + '): pi.' + module);
      var
        script  = document.createElement('script');

      // default to true for async and defer
      script.async  = async || true;
      script.defer  = defer || true;
      script.src    = path + module + '.js';
      script.self   = script;
      script.module = module;


      script.onload = function (event) {
        pi.log('loaded:', this.module);
      };

      script.onerror = function (error) {
        pi.log('error loading module: ' + this.module, error, this);
      };

      var
        node = cursor.insertBefore(script, cursor.firstChild);
      
      if(!!node) {
        pi.loaded.push(module);
      }
      return !!node; 
    };


    π.require = function(script, async, defer){
    
      if (π.loaded[module]) {
        return true;
      }
  
      var 
        cursor  = document.getElementsByTagName ("head")[0] || document.documentElement,
        path    = '../../assets/js/pi.',
        script  = document.createElement('script'),
        mod     = module;


      // pi.log('loading module (' + (!!async ? "async" : "sync") + '): pi.' + module);

      script.async  = async || true;
      script.defer  = defer || true;
      script.src    = path + module + '.js';
      script.self   = script;
      script.module = module;


      script.onload = function (event) {
        pi.log('loaded:', this.module);
      };

      script.onerror = function (error) {
        pi.log('error loading module: ' + this.module, error);
      };

      var
        node = cursor.insertBefore(script, cursor.firstChild);
      
      if(!!node) {
        pi.loaded.push(module);
      }
      return !!node; 
    }; 
//-> end of pi.require()



/***   ------   INITIALIZATION    ------
   *
   *  Code we run after having created the π object.
   *
   */


  // this is a simple array holding the names of modules we have loaded
  π.loaded = [];

  // look for pcl components
  π.app.components = document.getElementsByClassName("pcl");

  if(π.app.components.length>0) {
    // we have components, so it's an app
    var suffix = (π.app.components.length == 1) ? "" : "s";
    pi.log("found " +  π.app.components.length + " pcl component" + suffix + " on page");
    // load modules for a web app with session support
    π.require("app");
    π.require("app.session");
    π.require("pcl");
  }


  window.addEventListener('load', function(e) {
      setTimeout(function() { window.scrollTo(0, 1); }, 1);
    }, false);



