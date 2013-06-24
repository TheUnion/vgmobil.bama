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

  define('REDIS_DEBUG_DB', 15);
  define('REDIS_SOCK', '/var/run/redis/redis.sock');


  $RESPONSE_FORMAT = null;
  $REQUEST_FORMAT  = isset($_REQUEST['format']) ? strtolower($_REQUEST['format']) : "json";

  $request  = null;
  $reply    = array( "debug" => array( "headers" => apache_request_headers(), "request" => array() ) );


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
    global $reply;

    $message = json_decode( file_get_contents('php://input'), TRUE );

    $reply['request'] = $message;
    return $message;
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
      default:
        return decodeREQUEST();
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
    if( false === ($redis = connectToRedis())) {
      return false;
    }
    $redis->publish($chan, $msg);

  }


  function sendResponse ($reply) {
    print(json_encode($reply, JSON_PRETTY_PRINT));
  }


  function publish($channel, $message=false) {

    if($this->redis){
      if(!$message) {
        // we were invoked with only one param, so assume it's a message for default channel
        $message = $channel;
        $channel = $this->channel;
      }
      $this->redis->publish($channel, $message);
    }
    else {
      $this->say("We have no redis object in function publish()\n");
    }
  }


  function connectToRedis( $timeout = 5, $db = REDIS_DEBUG_DB ){
    global $reply, $debug;
    $redis = new Redis();
    try{ 
//      if(false===($redis->connect('127.0.0.1', 6379, $timeout))){
      if(false===($redis->connect(REDIS_SOCK))){
        $debug[] = 'Unable to connect to Redis';
        return false;
      }
      $redis->select($db);
      return $redis;
    }
    catch(RedisException $e){
      $this->handleException($e);
      return false;
    }
  }



  /**
   *  main()
   *
   */

  $logEntry = decodeLogEntry($REQUEST_FORMAT);

  insertLogEntry($logEntry);
  publishLogEntry($logEntry);

  $reply['OK'] = 1;

  $reply['request'] = $request;

  sendResponse($reply);

?>