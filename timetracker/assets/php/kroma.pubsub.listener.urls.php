<?php

  $session = session_start();

  header("Content-Type: application/json; charset=utf-8");
  header('Cache-Control: no-cache'); 


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


  $REQ_FROM = isset($_REQUEST['from']) ? $_REQUEST['from']  : 0;
  $REQ_TO   = isset($_REQUEST['to'])   ? $_REQUEST['to']    : round(1000*microtime(true));
 
  // in millisecs
  $TODAY    = 1000 * (SECS_PER_DAY * ((int) (time() / SECS_PER_DAY)));
  $TOMORROW = $TODAY + (SECS_PER_DAY * 1000);


  $request  = null;

  if(DEBUG) {
    $reply = array( "debug" => array( "headers" => apache_request_headers(), "request" => array() ) );
    $reply['debug']['env'] = $_SERVER;
  }


  $now = $_SERVER['REQUEST_TIME_FLOAT'];



  function getUrls($from=0, $to=0) {

    global $db, $reply;

    $urls = "";

    $mysqli = new mysqli($db['host'],$db['user'],$db['password'],$db['db']);

    if($mysqli->connect_errno){
      $reply['OK'] = 0;
      $reply['message'] = $mysqli->connect_error;
      return false;
    }

    $where  = "session_id>$from";

    if($to) {
      $where .= " AND session_id<".(1000*$to);
    }


    $query = "
              SELECT count(*) as total,
              url  
              FROM 
                `logs.vgmobil` 
              WHERE 
                $where
              GROUP BY
                url
              ORDER BY total DESC;
    ";

    $debug[]   = 'Running query: '. $query;

    if( FALSE === ($result = $mysqli->query($query)) ){

      $reply['OK']      = 0;
      $reply['message'] = $mysqli->error; 

      $debug[] = 'ERROR! Something went wrong when selecting from MySQL db ' . $db['db'] . ", table " . $db['table'];
      $debug[] = 'MySQL error: ' . $mysqli->error; 

      return false;
    }

    $urls = [];


    while ($row = $result->fetch_assoc()) {
      $urls[] = $row;
    }

    $mysqli->close();

    $reply['urls'] = $urls;

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

  getUrls();
  print(json_encode($reply));

?>
