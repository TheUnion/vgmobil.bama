<?php

  $session = session_start();


  // activate debugging
  define('DEBUG', true);


  $db       = array('host' => 'localhost', 'db' => 'timetracker', 'password' => '1234tsXX', 'user' => 'debugger', 'table' => 'logs.vgmobil');
  $reply    = array();
  $request  = array();
  $debug    = array();

  $EVENT    = array();

  $mysqli = new mysqli($db['host'],$db['user'],$db['password'],$db['db']);


  error_reporting(E_ERROR | E_PARSE & E_NOTICE);

  define('JSON', 1);
  define('GET',  2);

  define('LOG_FILE',  "debug.log");
  define('LOG_PATH',  "/var/log/kroma/");

  define('REDIS_DEBUG_DB', 15);
  define('REDIS_DEBUG_CHANNEL', 'srv.debug');
  define('REDIS_SOCK', '/var/run/redis/redis.sock');


  $RESPONSE_FORMAT = null;
  $REQUEST_FORMAT  = isset($_REQUEST['format']) ? strtolower($_REQUEST['format']) : "json";

  $request  = null;

  if(DEBUG) {
    $reply = array( "debug" => array( "headers" => apache_request_headers(), "request" => array() ) );
    $reply['debug']['env'] = $_SERVER;
  }


  $now = $_SERVER['REQUEST_TIME_FLOAT'];

  if(!isset($_SESSION['id'])) {
    $_SESSION['id']     = intval( str_replace( ".", "", strval($now) ) );
  }


  if(isset($_SESSION['last_event'])) {
    $_SESSION['previous_event'] = $_SESSION['last_event'];
  }

  $_SESSION['last_event'] = $now;


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
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset: UTF-8;");
        break;

    case GIF : 
        header('Content-Type: image/gif');
        break;

    default: 
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset: UTF-8;");
  }



  /**
   *  Supporting functions 
   * 
   */

  function decodeJSON () {
    global $reply;

    $message = file_get_contents('php://input');

    if(DEBUG) {
      $reply['debug']['request'] = $message;
    }
    return json_decode($message, true);
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
   * updateLogEntry()
   *
   * @param string format "json" or "gif"
   *
   * @return boolean indicating success or failure
   */


  function updateLogEntry($entry) {
    global $db, $reply, $request, $debug;

    $mysqli = new mysqli($db['host'],$db['user'],$db['password'],$db['db']);

    if($mysqli->connect_errno){
      $reply['OK'] = 0;
      $reply['message'] = $mysqli->connect_error;
      return false;
    }

    $fields = 'session_id, event, total_time, active_time, idle_time, user_agent';

    // do not add quotes around the whole string, we do that in the query
    // this is simply an adaptation that lets us easily use implode() on arrays
    $values = "{$entry['data']['start']}','{$entry['event']}', '{$entry['data']['TIME']['total']}', '{$entry['data']['TIME']['active']}', '{$entry['data']['TIME']['idle']}', '" . $mysqli->real_escape_string($_SERVER['HTTP_USER_AGENT']);


    $query    = "INSERT INTO `" . $db['db'] . "`.`" . $db['table'] . "` ($fields) 
                  VALUES('$values')
                  ON DUPLICATE KEY UPDATE total_time=" . $entry['data']['TIME']['total'] . ", active_time=" . $entry['data']['TIME']['active'] . ", idle_time=" . $entry['data']['TIME']['idle'] . ";";

    $debug[]   = 'Running query: '. $query;

    if( FALSE === $mysqli->query($query) ){

      $reply['OK']      = 0;
      $reply['message'] = $mysqli->error; 

      $debug[] = 'ERROR! Something went wrong when inserting into MySQL db ' . $db['db'] . ", table " . $db['table'];
      $debug[] = 'MySQL error: ' . $mysqli->error; 

      return false;
    }
    else{
      return $mysqli->insert_id;
    }
    $mysqli->close();
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


  function publish($channel = REDIS_DEBUG_CHANNEL, $message = false) {
    global
      $reply;

    if( false !== ($redis = connectToRedis()) ){
      if(!$message) {
        // we were invoked with only one param, so assume it's a message for our default channel
        $message = $channel;
        $channel =  REDIS_DEBUG_CHANNEL;
      }
      $redis->publish($channel, $message);
    }
    else {
      $reply['OK'] = 0;
      $reply['message'] = "We were unable to connect to redis in function publish()\n";
    }
  }


  function connectToRedis( $timeout = 5, $db = REDIS_DEBUG_DB ){
    global $reply, $debug;
    $redis = new Redis();
    try{ 
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


  $db_result = updateLogEntry($logEntry);
  publishLogEntry($logEntry);

  if(!isset($reply['OK'])) {
    $reply['OK'] = 1;
  }

  if(DEBUG) {
    $reply['debug']['log']        = $debug;
    $reply['debug']['db_result']  = $db_result;
  }

  //  $reply['debug']['phpsession'] = $_SESSION;
  sendResponse($reply);

?>

