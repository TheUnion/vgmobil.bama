  /**
   *  VGTouchTimeTracker
   *
   *  Logs active/idle time in HTML creatives
   *
   *  @author Johan Telstad, jt@enfield.no
   * 
   */


  var 
    OPTIONS = {
  
        FORMAT          : "json",  // "json", "gif"
        METHOD          : "post",  // "post", "get"
        SERVER          : "http://kromaviews.no:8080/dev/games/bama/srv/kroma.timetracker.php",
        TIMER_INTERVAL  : 1000, // millisec
        REPORT_INTERVAL : 15,   // sec
        IDLE_TIMEOUT    : 60    // sec
    },

    CLIENT = {

        // initial and default values
        url           : window.location,
        event         : "unknown",
        timestamp     : 0,
        description   : ""
    };


    VGTouchTimeTracker = function (options) {

      var 
        tracker          = {
          __console     : document.getElementById('console') || false,

          _options      : {},
          _timer        : false,

          SESSION       : {
            start       : new Date().getTime(),
            initialized : false,
            EVENTS      : [],
            IS_IDLE     : false,
            IS_VISIBLE  : true,
            TIME      : {
              total   : 0,
              idle    : 0,
              active  : 0,
              visible : 0,
              hidden  : 0
            }
          }
        };


      /**  Private / protected section
       *
       */


      tracker.__onWindowMessage = function (msg) {
        VGTouchTimeTracker.log( msg.origin + " posted message: " + msg.data );
      };

      tracker.__onIdleStart = function () {
        VGTouchTimeTracker.SESSION.IS_IDLE = true;
      };

      tracker.__onIdleEnd = function () {
        VGTouchTimeTracker.SESSION.IS_IDLE = false;
      };

      tracker.__onVisible = function () {
        VGTouchTimeTracker.SESSION.IS_VISIBLE = true;
      };

      tracker.__onHidden = function () {
        VGTouchTimeTracker.SESSION.IS_VISIBLE = false;
      };

      tracker.__onTimer = function () {
        var
          self = VGTouchTimeTracker || false;

        if(!self) {
          console.log("No TimeTracker object!")
          return;
        }

        // send to server every [REPORT_INTERVAL] seconds, incl. at zero
        if( (self.SESSION.TIME.active % self._options.REPORT_INTERVAL) === 0) {
          console.log("Tracking active time: " + self.SESSION.TIME.active + "/" + self.SESSION.TIME.total + " sec");
          self.update();
        }
        // else {
        //   console.log("NOT updating server: " + (self.SESSION.TIME.total % self._options.REPORT_INTERVAL) );
        // }

        self.SESSION.TIME.total++;

        if(self.SESSION.IS_VISIBLE) {
          self.SESSION.TIME.visible++;
        }
        else {
          self.SESSION.TIME.hidden++;
        }

        if(self.SESSION.IS_IDLE) {
          self.SESSION.TIME.idle++;
        }
        else {
          self.SESSION.TIME.active++;
        }
      };


      tracker.__init = function (options) {
        var
          self = this,
          inputfunctions = "";


        if (this.SESSION.initialized === true) {
          console.log("Trying to __init() tracker object, but it is already initialized. This should never happen.");
          return false;
        }


        this.SESSION.info = {
          animationMethod : this.getAnimationMethod(),
          url             : window.location
        };


        document.addEventListener("message", this.__onWindowMessage, false);        

        // this will probably not work from within an iframe, though ..
        document.addEventListener("focus", this.__onVisible, false);
        document.addEventListener("blur",  this.__onHidden, false);


        inputfunctions = "mousedown keydown";
        if ('ontouchstart' in window) {
          inputfunctions += " " + touchstart;
        }

        window.addEventListener(inputfunctions, this.onActivity, false); 

        for (var idx in options) {
          this._options[idx] = options[idx];
        }

        this._img = new Image();
        this.SESSION.initialized = true;
        return true;
      };


      tracker._sendJSON = function(data) {
        var
          xhr   = new XMLHttpRequest(),
          json  = JSON.stringify(data);

        if(data.length === 0) {
          console.log("NOT sending empty data object to logging server.");
          return false;
        }

        xhr.onload = this._onResponse;
        xhr.open("POST", this._options.SERVER, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.setRequestHeader("Content-length", json.length);
        xhr.setRequestHeader("Connection", "close");
        xhr.send(json);
      };


      tracker._sessionTime = function () {
        return this.START_SESSION - new Date().getTime();
      };

      tracker._sendREQUEST = function(data) {
        var
          requestUri = this._encodeAsGet(data);

        console.log("Sending GET request: " + this._options.SERVER + "?" + requestUri);

        // request GIF beacon
        this._img.src = this._options.SERVER + "?" + requestUri;
      };


      tracker._send = function(data, method) {
        var
          // set given request method, or use default
          method = method || this._options.METHOD;

        if( typeof data !=="object" ) {
          console.log("Wrong parameter type '" + typeof(data) + "', expected 'object'.");
          return false;
        }

        if( data.length === 0 ) {
          console.log("NOT sending empty data object to logging server.");
          return false;
        }

        switch(method.toLowerCase()) {
          case "json" : 
            this._sendJSON(data);
            break;
          case "get" : 
            this._sendREQUEST(data);
            break;
          default : 
            this._sendJSON(data);
        }
      };


      /**
       *  Internal callbacks and event handlers
       *
       */

      tracker._onResponse = function (e) {

        if (this.readyState != 4) {
          return;
        }

        if (this.status != 200 && this.status != 304) {
            tracker.log('HTTP error: ' + this.status + " - " + this.statusText);
            return;
        }

        try {
          var
            response = JSON.parse(this.responseText);

          if( response.OK == 1 ) {
              // console.log('Received response from logger service: ' + this.responseText);
          } else{
              console.log('Error-response received from logger service: ' + this.status + "; OK: " + response.OK, response);
          }
        }
        catch (e) {
          console.log("Error: ", e);
        }
      };


      tracker._onError = function (error) {
        var
          msg = (typeof error.message === "string") ?  error.message : false;

        if(msg) {
          //display file and line no. where error occurred
          msg += "\n" + error.fileName || "";
          msg +=  ":";
          msg += error.lineNumber || "";
          msg +=  " - ";
        }

        if(DEBUG) {
          // show stack trace
          msg += VGTouchTimeTracker.stacktrace(error);
        }

        this.error(msg, error);
        return;
      };


      tracker._logToConsole = function (line, obj) {

        if(this.__console) {
          console.log("console.nodeName: " + this.__console.nodeName);
          console.log("console.nodeType: " + this.__console.nodeType);
          this.__console.value += line + ( (obj!=="undefined") ? JSON.stringify(obj) : "");
        }
        else {
          console.log("No __console element!");
        }

        if(!!window.console) {
          return;
        }

        (!!obj) ? console.log(line, obj) : console.log(line);
        return true;
      };


      /**  Public / published section
       *
       */


      tracker.getAnimationMethod = function(){ 
        var
          result = ( 
            window.requestAnimationFrame    || window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.msRequestAnimationFrame  || function(callback) { window.setTimeout(callback, 1000 / 60); }
          );

        return result.name || "window.setTimeout";
      };


      tracker.setVisible = function (visibility) {
        var
          visibility = visibility || true;

        if( this.IS_VISIBLE !== visibility ) {
          this.IS_VISIBLE = visibility;
        }

        if (!this.IS_VISIBLE) {
          VGTouchTimeTracker.SESSION.IS_IDLE = true;
        }
      };


      tracker.onActivity = function (e) {
        var
          self = VGTouchTimeTracker;
        var  
          previousEventTime = self.PREV_EVENT || new Date().getTime();

        self.PREV_EVENT = new Date().getTime();

        if ( (self.PREV_EVENT - previousEventTime) > (self.IDLE_TIMEOUT * 1000) ) {
          self.__onIdleEnd(e);
        }
      };


      tracker.setSessionVariable = function (name, value, section) {
        var
          section = ( (typeof section === "string") && (section.length > 0) ) ? section : false;

        if(!section) {
          this.SESSION[name] = value;
        } else {
          if(!this.SESSION[section]) {
            this.SESSION[section] = {};
          }
          this.SESSION[section][name] = value;
        }
        // console.log("Setting session var " + name + " to " + value +  (section ? " in section " + section + "." : ".") );
      };


      tracker.error = function (line, obj) {
        this._send({event: "error", message: line, data: obj || false});
      };

      tracker.log = function (line, obj) {
        this._send({event: "log", message: line, data: obj || false});
      };

      tracker.send = function (obj, evt) {
        var
          evt = evt || "data";

        this._send({event: evt, data: obj || null});
      };

      tracker.update = function () {
        // send as event type "time"
        this.send(this.SESSION, "time");
      };

      tracker.stacktrace = function(error) {
          return error.stack || "No stack trace available.";
      };


      tracker.run = function(interval) {
        var
          interval = interval || 1000;

        if(this._timer!==false) {
          console.log("clearing interval: " + this._timer);
          clearInterval(this._timer);
          this._timer = false;
        }
        this._timer = setInterval(this.__onTimer, interval);
      };

      window.onerror = this._onError;

      console.log("Starting VGTouchTimeTracker.");

      // call init function
      tracker.__init(options);
      return tracker;

    }(OPTIONS);



  /**    END VGTouchTimeTracker     */


