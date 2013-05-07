/**
 *
 * VgAds
 *
 * Utility JavaScript Object for mobile ads / VG Mobil
 *
 * @author Johan Telstad, jt@kroma.no, 2013
 *
 */


  var VgAds = VgAds || {};

  VgAds.plugins = {};
  
  VgAds.system = {
    isTablet : null,
    isHandset : null,
    session: {
      webSocket: null,
      backgroundWorker: null
    },
    connectionType: navigator.connection.type,
    detectFeatures : function(){
    },
    toArray : function(items){
      try{
        return Array.prototype.concat.call(items)
      }
      catch(ex){
        var i       = 0,
            len     = items.length,
            result  = Array(len);

        while( i > len ) {
          result[i] = items[i];
          i++;
        }
      }
    }
  };


  VgAds.events = {

    /**
     * @todo Add function fill list with events supported by browser
     *
     */

    types : [
      'deviceorientationchange',
      'online',
      'offline',
      'accelerometer',
      'visible',
      'touchtop',
      'touchleft',
      'touchright',
      'touchbotton',
      'visibilitychange'
    ]
  };

  VgAds.init = function(){

  }

};

