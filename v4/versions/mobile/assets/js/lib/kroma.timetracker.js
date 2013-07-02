  /**
   *  KROMA TimeTracker
   *
   *  We wish to log time spent interacting with the ad
   *
   *  @author Johan Telstad, jt@enfield.no
   * 
   */

  var 

    OPTIONS = {
  
        FORMAT    : "json",  // "json", "gif"
        METHOD    : "post",  // "post", "get"
        INTERVAL  : 15000,
        SERVER    : "http://kromaviews.no:8080/dev/games/bama/srv/kroma.timetracker.php"
    },

    CLIENT = {

        // initial and default values
        url           : window.location,
        event         : "unknown",
        userAgent     : UserAgent(),
        device        : (function ( ) {
          var 
            ua = navigator.userAgent.toLowerCase();


          if( ua.indexOf("mobile") >= 0 ) {
            return "smartphone";
          }

          // Android
          if( ua.indexOf("android") >= 0 ) {
            if( ua.indexOf("mobile") >= 0 ) {
              return "smartphone";
            }
            else {
              return "tablet";
            }
          }

          // Android
          if( ua.indexOf("iphone") >= 0 ) {
            return "smartphone";
          }
          else if( ua.indexOf("ipad") >= 0 ) {
            return "tablet";
          }

        return "unknown";
        })()
    };



  var 

    TimeTracker = {

      START_TIME    : new Date().getTime(),
      ACTIVE_TIME   : 0,
      IDLE_TIME     : 0,
      TOTAL_TIME    : 0,
      COUNTER       : 0,

      INTERVAL      : 0,
      SERVER        : null,
      METHOD        : "post",
      FORMAT        : "json",


      __init : function (options) {
        this.INTERVAL = options.INTERVAL || 30000;


      },


      _send : function (evt, value) {
        var
          eventObject = {
            event : evt,
            value : value,
            url   : CLIENT['url'] || "no URL",
            browser_name : CLIENT.UserAgent.browser_name,
            browser_version : CLIENT.UserAgent.browser_version,
            os : CLIENT.UserAgent.os,
            platform : CLIENT.UserAgent.platform,
            device : CLIENT.DEVICE
          };

        this._sendJSON(eventObject);

      },


      _sendJSON = function(data) {
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
      },


      _ontimer : function (tracker) {
        
        if(tracker !== "object") {
          console.log("ERROR in TimeTracker._ontimer(): tracker is not an object!");
          return;
        }

        tracker.TOTAL_TIME = new Date().getTime() - tracker.START_TIME;

        var
          timeSpent = tracker.COUNTER * tracker.INTERVAL,
          eventName = 'time';

        tracker.COUNTER++;
        tracker._send(eventName, timeSpent);
      },


      run : function (options) {
        this.__init();
        setInterval(this._ontimer, options.INTERVAL, this);
      }

    };


  // start tracker
  TimeTracker.run(OPTIONS);



/**
 *  UserAgent()
 *  
 *  https://github.com/caseyohara/user-agent/
 */

  var UserAgent;

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




