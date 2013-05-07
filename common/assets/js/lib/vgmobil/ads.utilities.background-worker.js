/**
 *
 * VgAds Background Worker
 *
 * A web worker used to offload as much processing as possible from the main thread
 *   
 * @author Johan Telstad, jt@kroma.no, 2013
 *
 */



var bisectionSearch = function (list, val) {

    var min = 0, 
        max = list.length-1,
        mid = (min + max) >> 1,
        dat = list[mid];

    for(;;) {
            // fall back to linear search, 11 seems to be a good threshold, but this depends on the uses comparator!! (here: ===)
      if ( min + 11 > max ) {
        for(var i=min ; i<=max; i++ ) {
          if( val === list[i] ) {
                  return i;
          }
        }

      return -1;
      }

      if ( val === dat ) {
        return mid;
      } 

      if( val > dat ) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }
  };

