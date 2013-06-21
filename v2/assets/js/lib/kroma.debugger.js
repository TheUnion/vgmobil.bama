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

    OPTIONS = {},
    HTMLDebugger = HTMLDebugger || function (options) {
  
      var 
        dbgr = {};

      dbgr._FORMAT  = "json";
      dbgr._METHOD  = "post";
      dbgr._SERVER  = "http://kromaviews.no:8080/dev/games/kroma/srv/kroma.debug.logger.php";

      dbgr._img     = new Image();


      dbgr.error = function (line, obj) {
        _sendData({type: "error", message: "line", info: obj || false});
      };

      dbgr.log = function (line, obj) {
        _sendData({type: "log", message: line, info: obj || false});
      };

      dbgr.stacktrace = function(error) {
          return error.stack || "No stack trace available.";
      };



      dbgr._send = function(data, method) {
        var
          method = method || false;
        switch( strtolower(method)) {
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


      dbgr._onResponse = function (e) {
        if (this.readyState != 4) return;
          if (this.status != 200 && this.status != 304) {
              console.log('HTTP error: ' + req.status);
              return;
          }

          data.resp = JSON.parse(this.responseText);
          if(data.resp.status=='success'){
              console.log('Received response from logger service: ' + this.responseText);
          }else{
              console.log('Error-response received from logger service: ' + this.status);
          }
      };


      dbgr._sendJSON = function(data) {
        var
          xhr   = new XMLttpRequest(),
          json  = JSON.stringify(data);

        xhr.onload = this._onResponse;
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.setRequestHeader("Content-length", json.length);
        xhr.setRequestHeader("Connection", "close");

        xhr.open("POST", this._SERVER, true);
        xhr.send(json);
      };


      dbgr._sendREQUEST = function(data) {
        var
          msg = this._encodeAsGet(data);

        console.log("Sending GET request: " + this._SERVER + "?" + msg);

        //send request for GIF beacon
        this._img.src = this._SERVER + "?" + msg;
      };

      return dbgr;
    }(OPTIONS);

/**    END HTMLDebugger     */
