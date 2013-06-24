  /**
   *  HTMLDebugger
   *
   *  To make it easier when debugging on devices, we need some error logging
   *
   *  Also, it's nice to be able to report errors back to the server, 
   *  to monitor any browser problems
   *
   *  @author Johan Telstad, jt@enfield.no
   * 
   */

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
        userAgent     : new UserAgent(),
        timestamp     : 0,
        description   : ""
    };



  var
    HTMLDebugger = HTMLDebugger || function (options) {
  
      var 
        dbgr = {},
        START_SESSION = new Date().getTime();

      dbgr._OPTIONS = {};

      /**  Private / protected section
       *
       */

      for (var idx in options) {
        dbgr._OPTIONS[idx] = options[idx];
      }

      dbgr._img = new Image();


      dbgr._sendJSON = function(data) {
        var
          xhr   = new XMLHttpRequest(),
          json  = JSON.stringify(data);

        xhr.onload = this._onResponse;
        xhr.open("POST", this._OPTIONS.SERVER, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.setRequestHeader("Content-length", json.length);
        xhr.setRequestHeader("Connection", "close");
        xhr.send(json);
      };

      dbgr._sessionTime = function () {
        return this.START_SESSION - new Date().getTime();
      };

      dbgr._sendREQUEST = function(data) {
        var
          msg = this._encodeAsGet(data);

        console.log("Sending GET request: " + this._OPTIONS.SERVER + "?" + msg);

        //send request for GIF beacon
        this._img.src = this._OPTIONS.SERVER + "?" + msg;
      };


      dbgr._send = function(data, method) {
        var
          // set given request method, or use default
          method = method || this._OPTIONS.METHOD;

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


    dbgr.DebugEvent = function (event, description) {
      var
        eventObject   = {
          event         : event || CLIENT.event,
          timestamp     : new Date().getTime(),
          description   : description || CLIENT.description
        };

      for (var i in CLIENT) {
        if(!!eventObject[i]) {
          // dont' overwrite our own values
          continue;
        }

        // copy properties from CLIENT object to our eventObject
        eventObject[i] = CLIENT[i];
      }
      return eventObject;
    };




      /**
       * _encodeAsGet
       *
       *  recursive function to encode an object into GET parameter format
       * 
       */

      dbgr._encodeAsGet = function (data, prefix) {
        var
          result = {},
          prefix = prefix || "";

        if(prefix !== "") {
          prefix += "_";
        }

        for (var i in data) {
          if ( typeof data[i] === "object" ){
            prefix += i;
            result = this._encodeAsGet(data[i], prefix + i);
          }
          else {
            result[prefix + i] = data[i];
          }
        }
        return result;
      };




      /**
       *  Internal callbacks and event handlers
       *
       */

      dbgr._onResponse = function (e) {
        if (this.readyState != 4) return;
          if (this.status != 200 && this.status != 304) {
              console.log('HTTP error: ' + this.status + " - " + this.statusText);
              return;
          }

        var 
          response = JSON.parse(this.responseText);

        if( response.OK == 1 ){
            console.log('Received response from logger service: ' + this.responseText);
        }else{
            console.log('Error-response received from logger service: ' + this.status + " - " + response.OK, response);
        }
      };


      dbgr._onError = function (error) {
        var
          msg = (typeof error.message === "string") ? error.message : false;

        if(!!msg) {
          //display file and line no. where error occurred
          msg += error.fileName || "";
          msg +=  " ";
          msg += error.lineNumber || "";
          msg +=  " - ";
        }

        if(DEBUG) {
          // show stack trace
          msg += HTMLDebugger.stacktrace(error);
        }

        this.error(msg, error);
        return;
      };



      /**  Public / published section
       *
       */

      dbgr.error = function (line, obj) {
        this._send({type: "error", message: line, info: obj || false});
      };

      dbgr.log = function (line, obj) {
        this._send({type: "log", message: line, info: obj || false});
      };

      dbgr.send = function (obj) {
        this._send({type: "object", data: obj || null});
      };

      dbgr.stacktrace = function(error) {
          return error.stack || "No stack trace available.";
      };

      window.onerror = this._onerror;

      console.log("Starting KROMA HTMLDebugger.");
      return dbgr;

    }(OPTIONS);

/**    END HTMLDebugger     */
