  /**
   *  TimeTracker
   *
   *  Logs time spent in ad
   *
   *  @author Johan Telstad, jt@enfield.no
   * 
   */


  UserAgent = (function() {
    var 
      Browsers, OS, Platform, Versions, browser_name, browser_version, os, platform;

    Versions = {
      Firefox   : /firefox\/([\d\w\.\-]+)/i,
      IE        : /msie\s([\d\.]+[\d])/i,
      Chrome    : /chrome\/([\d\w\.\-]+)/i,
      Safari    : /version\/([\d\w\.\-]+)/i,
      Ps3       : /([\d\w\.\-]+)\)\s*$/i,
      Psp       : /([\d\w\.\-]+)\)?\s*$/i
    };

    Browsers = {
      Konqueror : /konqueror/i,
      Chrome    : /chrome/i,
      Safari    : /safari/i,
      IE        : /msie/i,
      Opera     : /opera/i,
      PS3       : /playstation 3/i,
      PSP       : /playstation portable/i,
      Firefox   : /firefox/i
    };

    OS = {
      WindowsVista  : /windows nt 6\.0/i,
      Windows7      : /windows nt 6\.1/i,
      Windows8      : /windows nt 6\.2/i,
      Windows2003   : /windows nt 5\.2/i,
      WindowsXP     : /windows nt 5\.1/i,
      Windows2000   : /windows nt 5\.0/i,
      OSX           : /os x (\d+)[._](\d+)/i,
      Linux         : /linux/i,
      Wii           : /wii/i,
      PS3           : /playstation 3/i,
      PSP           : /playstation portable/i,
      Ipad          : /\(iPad.*os (\d+)[._](\d+)/i,
      Iphone        : /\(iPhone.*os (\d+)[._](\d+)/i
    };

    Platform = {
      Windows       : /windows/i,
      Mac           : /macintosh/i,
      Linux         : /linux/i,
      Wii           : /wii/i,
      Playstation   : /playstation/i,
      Ipad          : /ipad/i,
      Ipod          : /ipod/i,
      Iphone        : /iphone/i,
      Android       : /android/i,
      Blackberry    : /blackberry/i
    };

    function UserAgent(source) {
      if (source == null) {
        source = navigator.userAgent;
      }
      this.source = source.replace(/^\s*/, '').replace(/\s*$/, '');
      this.browser_name = browser_name(this.source);
      this.browser_version = browser_version(this.source);
      this.os = os(this.source);
      this.platform = platform(this.source);
    }

    browser_name = function(string) {
      switch (true) {
        case Browsers.Konqueror.test(string):
          return 'konqueror';
        case Browsers.Chrome.test(string):
          return 'chrome';
        case Browsers.Safari.test(string):
          return 'safari';
        case Browsers.IE.test(string):
          return 'ie';
        case Browsers.Opera.test(string):
          return 'opera';
        case Browsers.PS3.test(string):
          return 'ps3';
        case Browsers.PSP.test(string):
          return 'psp';
        case Browsers.Firefox.test(string):
          return 'firefox';
        default:
          return 'unknown';
      }
    };

    browser_version = function(string) {
      var regex;
      switch (browser_name(string)) {
        case 'chrome':
          if (Versions.Chrome.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'safari':
          if (Versions.Safari.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'firefox':
          if (Versions.Firefox.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'ie':
          if (Versions.IE.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'ps3':
          if (Versions.Ps3.test(string)) {
            return RegExp.$1;
          }
          break;
        case 'psp':
          if (Versions.Psp.test(string)) {
            return RegExp.$1;
          }
          break;
        default:
          regex = /#{name}[\/ ]([\d\w\.\-]+)/i;
          if (regex.test(string)) {
            return RegExp.$1;
          }
      }
    };

    os = function(string) {
      switch (true) {
        case OS.WindowsVista.test(string):
          return 'Windows Vista';
        case OS.Windows7.test(string):
          return 'Windows 7';
        case OS.Windows2003.test(string):
          return 'Windows 2003';
        case OS.WindowsXP.test(string):
          return 'Windows XP';
        case OS.Windows2000.test(string):
          return 'Windows 2000';
        case OS.Linux.test(string):
          return 'Linux';
        case OS.Wii.test(string):
          return 'Wii';
        case OS.PS3.test(string):
          return 'Playstation';
        case OS.PSP.test(string):
          return 'Playstation';
        case OS.OSX.test(string):
          return string.match(OS.OSX)[0].replace('_', '.');
        case OS.Ipad.test(string):
          return string.match(OS.Ipad)[0].replace('_', '.');
        case OS.Iphone.test(string):
          return string.match(OS.Iphone)[0].replace('_', '.');
        default:
          return 'unknown';
      }
    };

    platform = function(string) {
      switch (true) {
        case Platform.Windows.test(string):
          return "Microsoft Windows";
        case Platform.Mac.test(string):
          return "Apple Mac";
        case Platform.Android.test(string):
          return "Android";
        case Platform.Blackberry.test(string):
          return "Blackberry";
        case Platform.Linux.test(string):
          return "Linux";
        case Platform.Wii.test(string):
          return "Wii";
        case Platform.Playstation.test(string):
          return "Playstation";
        case Platform.Ipad.test(string):
          return "iPad";
        case Platform.Ipod.test(string):
          return "iPod";
        case Platform.Iphone.test(string):
          return "iPhone";
        default:
          return 'unknown';
      }
    };
    return UserAgent;
  })();




  var 
    OPTIONS = {
  
        FORMAT : "json",  // "json", "gif"
        METHOD : "post",  // "post", "get"
        SERVER : "http://kromaviews.no:8080/dev/games/bama/srv/kroma.debug.logger.php"
    },

    CLIENT = {

        // initial and default values
        url           : window.location,
        event         : "unknown",
        userAgent     : UserAgent(),
        timestamp     : 0,
        description   : ""
    };


    TimeTracker = function (options) {

      var 
        tracker          = {
          __console     : document.getElementById('console') || false,

          _options      : {},

          SESSION       : {
            start       : new Date().getTime(),
            initialized : false,
            EVENTS      : [],
            IS_IDLE     : false,
            IS_VISIBLE  : false,
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
        TimeTracker.log( msg.origin + " posted message: " + msg.data );
      };

      tracker.__onIdleStart = function () {
        TimeTracker.SESSION.IS_IDLE = true;
      };

      tracker.__onIdleEnd = function () {
        TimeTracker.SESSION.IS_IDLE = false;
      };

      tracker.__onVisible = function () {
        TimeTracker.SESSION.IS_VISIBLE = true;
      };

      tracker.__onHidden = function () {
        TimeTracker.SESSION.IS_VISIBLE = false;
      };

      tracker.__onTimer = function () {
        TimeTracker.SESSION.TIME.total ++;
        
        if(TimeTracker.SESSION.IS_VISIBLE) {
          TimeTracker.SESSION.TIME.visible ++;
        }
        else {
          TimeTracker.SESSION.TIME.hidden ++;
        }

        if(TimeTracker.SESSION.IS_IDLE) {
          TimeTracker.SESSION.TIME.idle ++;
        }
        else {
          TimeTracker.SESSION.TIME.active ++;
        }
      };

      tracker.__init = function (options) {
        var
          self = this;

        // console.log("This : " + this, this);

        this.SESSION.info = {
          animationMethod : this.getAnimationMethod(),
          url             : window.location
        };

        // this._idleDetector = Idle({
        //     onHidden    : this.__onHidden,
        //     onVisible   : this.__onVisible,
        //     onAway      : this.__onIdleStart,
        //     onAwayBack  : this.__onIdleEnd,
        //     awayTimeout : 120 * 1000 // idle after 120 seconds of inactivity
        //   }).start();
        this.SESSION.initialized = true;

        document.addEventListener("message", this.__onWindowMessage, false);        

        this._timer = setInterval(this.__onTimer, 1000);

        for (var idx in options) {
          tracker._options[idx] = options[idx];
        }
        tracker._img = new Image();
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


      tracker.getAnimationMethod = function(){ 
        var
          result = ( 
            window.requestAnimationFrame    || window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.msRequestAnimationFrame  || function(callback) { window.setTimeout(callback, 1000 / 60); }
          );

        return result.name || result;
      };


      tracker._sessionTime = function () {
        return this.START_SESSION - new Date().getTime();
      };

      tracker._sendREQUEST = function(data) {
        var
          msg = this._encodeAsGet(data);

        console.log("Sending GET request: " + this._options.SERVER + "?" + msg);

        //send request for GIF beacon
        this._img.src = this._options.SERVER + "?" + msg;
      };


      tracker._send = function(data, method) {
        var
          // set given request method, or use default
          method = method || this._options.METHOD;

        if( typeof data !=="object" ) {
          console.log("Wrong parameter type '" + typeof(data) + "', expected an object.");
          return false;
        }

        if( data.length === 0 ) {
          console.log("NOT sending empty data object to logging server.");
          return false;
        }

        // this._logToConsole("tracker.log: ", JSON.stringify(data));

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

        var
          response = JSON.parse(this.responseText);

        if( response.OK == 1 ) {
            // console.log('Received response from logger service: ' + this.responseText);
        } else{
            console.log('Error-response received from logger service: ' + this.status + " - " + response.OK, response);
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
          msg += TimeTracker.stacktrace(error);
        }

        this.error(msg, error);
        return;
      };


      tracker._logToConsole = function (line, obj) {

        if(this.__console) {
          console.log("console.nodeName: " + this.__console.nodeName);
          console.log("console.nodeType: " + this.__console.nodeType);
          this.__console.value += line + ( (!!obj) ? JSON.stringify(obj) : "");
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

      tracker.send = function (obj) {
        this._send({event: "data", data: obj || null});
      };

      tracker.stacktrace = function(error) {
          return error.stack || "No stack trace available.";
      };


      tracker.run = function(interval) {
        var
          interval = interval || 15000;

        
      };

      window.onerror = this._onError;

      console.log("Starting KROMA TimeTracker.");

      // call init function
      tracker.__init(options);
      return tracker;

    }(OPTIONS);



  /**    END TimeTracker     */


  /**
   *  Histogram
   *
   *  Keep a data series which counts the incidence of individual numbers
   *  Not suited for large data sets, or sparse indices
   */


  var 
    Histogram = Histogram || function (OPTIONS) {
      var
        _series   = [],
        _options  = {},
        _sumtotal = 0;


      function addDataPoint(idx, count) {
        if (idx >= this._series.length) {
          this._series.length = (idx + 1);
        }
        this._sumtotal    += count;
        this._series[idx] += count;
      }

      function getData() {
        return this._series;
      }

      function toString() {
        return JSON.stringify(this._series);
      }

      function getDataPoint(idx) {
        if (idx >= this._series.length) {
          return false;
        }
        return this._series[idx];
      }

    }();


  var timeTracker = TimeTracker();
