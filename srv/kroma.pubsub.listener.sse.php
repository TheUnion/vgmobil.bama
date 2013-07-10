<?php

  $session = session_start();

  header("Content-Type: text/event-stream; charset=utf-8");
  header('Cache-Control: no-cache'); 


  // Disable buffering
  @apache_setenv('no-gzip', 1);
  @ini_set('zlib.output_compression', 0);
  @ini_set('output_buffering', 'Off');
  @ini_set('implicit_flush', 1);

  // Flush buffers
  ob_implicit_flush(1);
  for ( $i = 0, $level = ob_get_level(); $i < $level; $i++ ) {
    ob_end_flush();
  }

  // start output
  ob_start();


  define('SECS_PER_DAY', 86400);



  // activate debugging
  define('DEBUG', true);




  if(DEBUG) {
    // dev
    error_reporting(-1);
  }
  else {
    // prod
    error_reporting(0);
  }



  $db       = array('host' => 'localhost', 'db' => 'timetracker', 'password' => '1234tsXX', 'user' => 'debugger', 'table' => 'logs.vgmobil');
  $reply    = array();
  $request  = array();
  $debug    = array();

  $EVENT    = array();
  $ID       = 0;


  define('JSON', 1);
  define('GET',  2);

  define('LOG_FILE',  "debug.log");
  define('LOG_PATH',  "/var/log/kroma/");

  define('REDIS_DEBUG_DB', 15);
  define('REDIS_DEBUG_CHANNEL', 'srv.debug');
  define('REDIS_SOCK', '/var/run/redis/redis.sock');


  $RESPONSE_FORMAT = null;
  $REQUEST_FORMAT  = isset($_REQUEST['format']) ? strtolower($_REQUEST['format']) : "json";

 
  $REQ_FROM = isset($_REQUEST['from']) ? $_REQUEST['from']  : 0;
  $REQ_TO   = isset($_REQUEST['to'])   ? $_REQUEST['to']    : round(1000*microtime(true));
 
  $REQ_URL  = isset($_REQUEST['url'])   ? $_REQUEST['url']    : $_SERVER['HTTP_REFERER'];


  // in millisecs
  $TODAY    = 1000 * (SECS_PER_DAY * ((int) (time() / SECS_PER_DAY)));
  $TOMORROW = $TODAY + (SECS_PER_DAY * 1000);


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


  /**
   *  Supporting functions 
   * 
   */


  function onMessage($redis, $chan=REDIS_DEBUG_CHANNEL, $msg, $event="data") {
    global
      $ID;

    // strip out newlines
    $message  = str_replace("\n", "", $msg);

    $line     = 0;

    $ID++;

    print("event: $event\n");
    print("id: $ID\n");

    print("data: $message\n");
    // extra lf to end event
    print("\n");

    ob_flush();
    flush();
  }


  function subscribeToChannel($channel) {
    global $debug;

    if( false === ($redis = connectToRedis())) {
      return false;
    }

    try{
      $redis->subscribe(array(REDIS_DEBUG_CHANNEL), 'onMessage');
    }
    catch (Exception $e) {
      $debug[] = get_class($e) . ": " . $e->getMessage();
    }

  }


  function sendResponse ($reply) {
    print(json_encode($reply));
  }



  function sendEvent ($event, $data) {
    global
      $ID;

    // strip out newlines
    $message  = str_replace("\n", "", $data);

    $line     = 0;

    $ID++;

    print("event: $event\n");
    print("id: $ID\n");

    print("data: $message\n");
    // extra lf to end event
    print("\n");

    ob_flush();
    flush();

  }


  function sendReport($from=0, $to=0, $url="") {
    global $db, $reply;

    $report = "";

    $mysqli = new mysqli($db['host'],$db['user'],$db['password'],$db['db']);

    if($mysqli->connect_errno){
      $reply['OK'] = 0;
      $reply['message'] = $mysqli->connect_error;
      return false;
    }

    $fields = 'session_id, event, total_time, active_time, idle_time, user_agent, ip';

    $where  = "session_id>$from";

    if($to) {
      $where .= " AND session_id<".(1000*$to);
    }

    $query = "
              SELECT 
                DATE(timestamp)     AS date,
                AVG( total_time )   AS avg_total, 
                COUNT( * )          AS sum, 
                AVG( idle_time )    AS avg_idle,
                AVG( active_time )  AS avg_active
              FROM 
                `logs.vgmobil` 
              WHERE 
                $where
              GROUP BY
                date,
                total_time;
    ";

    // $query    = "SELECT $fields FROM `" . $db['db'] . "`.`" . $db['table'] . "`
    //               WHERE $where;
    //               GROUP BY 
    //               ";

    $debug[]   = 'Running query: '. $query;

    if( FALSE === ($result = $mysqli->query($query)) ){

      $reply['OK']      = 0;
      $reply['message'] = $mysqli->error; 

      $debug[] = 'ERROR! Something went wrong when selecting from MySQL db ' . $db['db'] . ", table " . $db['table'];
      $debug[] = 'MySQL error: ' . $mysqli->error; 

      return false;
    }

    $report = [];


    while ($row = $result->fetch_assoc()) {
      $report[] = $row;
    }

    $mysqli->close();

    sendEvent("report", json_encode($report));

  }



  function sendReportSummary($from=0, $to=false, $url="") {
    global $db, $reply;


    if(!$to) {
      // current time in microsecs
      $to = round(1000*microtime(true));
    }

    $summary = "";

    $mysqli = new mysqli($db['host'],$db['user'],$db['password'],$db['db']);

    if($mysqli->connect_errno){
      $reply['OK'] = 0;
      $reply['message'] = $mysqli->connect_error;
      return false;
    }

    $fields = 'session_id, event, total_time, active_time, idle_time, user_agent, ip';

    $where  = "session_id>$from";

    if($to) {
      $where .= " AND session_id<".(1000*$to);
    }

    $query = "
              SELECT 
                DATE(timestamp)     AS date,
                AVG( total_time )   AS avg_total, 
                COUNT( * )          AS sum, 
                AVG( idle_time )    AS avg_idle,
                AVG( active_time )  AS avg_active
              FROM 
                `logs.vgmobil` 
              WHERE 
                $where
              GROUP BY
                date;
    ";

    // $query    = "SELECT $fields FROM `" . $db['db'] . "`.`" . $db['table'] . "`
    //               WHERE $where;
    //               GROUP BY 
    //               ";

    $debug[]   = 'Running query: '. $query;

    if( FALSE === ($result = $mysqli->query($query)) ){

      $reply['OK']      = 0;
      $reply['message'] = $mysqli->error; 

      $debug[] = 'ERROR! Something went wrong when selecting from MySQL db ' . $db['db'] . ", table " . $db['table'];
      $debug[] = 'MySQL error: ' . $mysqli->error; 

      return false;
    }

    $summary = [];


    while ($row = $result->fetch_assoc()) {
      $summary[] = $row;
    }

    $mysqli->close();

    sendEvent("summary", json_encode($summary));

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
      onMessage( null, REDIS_DEBUG_CHANNEL, get_class($e) . $e->getMessage() );
      return false;
    }
  }



  /**
   *  main()
   *
   */

  if(!isset($reply['OK'])) {
    $reply['OK'] = 1;
  }

  if(DEBUG) {
    $reply['debug']['log'] = $debug;
  }


  // summary of each day  
  sendReportSummary();

  // more detailed report for each day  
  sendReport();

  subscribeToChannel(REDIS_DEBUG_CHANNEL);

  while (true) {
    // wait for events
    usleep(10000);
    # code...
  }

?>
