<?php

  /**
   *  debug.logger: a q&d error logger
   * 
   */



  define('JSON', 1);
  define('GET',  2);



  $REDIS = new Redis();

  $RESPONSE_FORMAT = null;
  $REQUEST_FORMAT  = isset($_REQUEST['format']) ? strtolower($_REQUEST['format']) : "json";


  if(!$REQUEST_FORMAT) {
    //detect format, if not explicitly set
    $headers = apache_request_headers();

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



  if(!isset($_REQUEST['error'])) {
    die(json_encode(array('OK' => 0, 'Status' => $_REQUEST['error'])));
  }

  //write to log in json format
  file_put_contents($log, json_encode($_REQUEST, JSON_PRETTY_PRINT));


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
   *
   * @param string format "json" or "gif"
   *
   * @return array containing request variables
   * 
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
   * decodeLogEntry()
   *
   *
   * @param string format "json" or "gif"
   *
   * @return array containing request variables
   * 
   */

  function insertLogEntry($format) {
    
  }


  /**
   * decodeLogEntry()
   *
   *
   * @param string format "json" or "gif"
   *
   * @return array containing request variables
   * 
   */

  function publishLogEntry($format) {
    
  }


  $logEntry = decodeLogEntry($REQUEST_FORMAT);


?>