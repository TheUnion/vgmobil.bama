<?php


  /**
   *  debug.logger: a q&d error logger
   * 
   */
  

  error_reporting(E_ERROR | E_WARNING | E_PARSE & E_NOTICE);

  define('JSON', 1);
  define('GET',  2);

  define('LOG_FILE',  "debug.log");
  define('LOG_PATH',  "/var/log/kroma/");

  $RESPONSE_FORMAT = null;
  $REQUEST_FORMAT  = isset($_REQUEST['format']) ? strtolower($_REQUEST['format']) : "json";

  $reply = array( "debug" => array( "headers" => apache_request_headers(), "request" => array(), "response" => array() ) );


  if(!$REQUEST_FORMAT) {
    //detect format, if not explicitly set

    foreach ($headers as $header => $value) {
      echo "$header: $value <br />\n";
      if ( strpos(strtolower(trim($header)), "content-type") === 0) {
        if(strpos(strtolower($header), "json")) {
          $REQUEST_FORMAT = JSON;
        }
        elseif(strpos(strtolower($header), "gif")) {
          $REQUEST_FORMAT = GIF;
        }
      }
    }
  }


   //which return format is requested ?
  switch($REQUEST_FORMAT) {

    case JSON : 
        header("Content-Type: application/json; charset: UTF-8;");
        break;

    case GIF : 
        header('Content-Type: image/gif');
        break;

    default: 
        header("Content-Type: application/json; charset: UTF-8;");
        break;
  }



  /**
   *  Supporting functions 
   * 
   */

  function decodeJSON () {
    return json_decode( file_get_contents('php://input'), TRUE );
  }


  function decodeREQUEST () {
    return json_encode($_REQUEST, JSON_PRETTY_PRINT);
  }


  /**
   * decodeLogEntry()
   *
   * @param string format "json" or "gif"
   *
   * @return array containing request variables
   */

  function decodeLogEntry($format) {
    switch ($format) {
      case 'json':
        return decodeJSON();
        break;
      default:
        return decodeREQUEST();
        break;
    }
  }


  /**
   * insertLogEntry()
   *
   * @param string format "json" or "gif"
   *
   * @return boolean indicating success or failure
   */

  function insertLogEntry($entry) {
   //write to log in json format
    file_put_contents( LOG_PATH . LOG_FILE, json_encode( $entry, JSON_PRETTY_PRINT ), FILE_APPEND );
  }


  /**
   * publishLogEntry()
   *
   * @param string format "json" or "gif"
   *
   * @return boolean indicating success or failure
   */

  function publishLogEntry($entry) {
    // $REDIS = new Redis();
  }

  function sendResponse ($reply) {
    print(json_encode($reply, JSON_PRETTY_PRINT));
  }


  /**
   *  main()
   *
   */

  $logEntry = decodeLogEntry($REQUEST_FORMAT);

  insertLogEntry($logEntry);
  publishLogEntry($logEntry);

  sendResponse($reply);


?>