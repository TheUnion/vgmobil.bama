##TRACKING







###EVENTS 

* start_interaction 

* arrive_station3 
* arrive_station4 
* arrive_station6 
* arrive_station7 

* leave_station3 
* leave_station4 
* leave_station6 
* leave_station7 

* click_lise 
* click_farmer 
* click_link1 
* click_link2 

* close_lise 
* close_farmer 

* video_play 
* video_pause 

* event_idle 
* event_wake 



#### ikke implementert, men kommer:

* video_resume 
* video_finish 

* error_javascript 
* error_unknown 



```javascript
  var EVENTS = 
    {
      start_interaction   : "start_bilreise",
      arrive_station3     : "ankommet_bonde",
      arrive_station4     : "ankommet_lise",
      arrive_station6     : "ankommet_film",
      arrive_station7     : "ankommet_slutt",
      leave_station3      : "forlot_bonde",
      leave_station4      : "forlot_lise",
      leave_station6      : "forlot_film",
      leave_station7      : "forlot_slutt",
      click_lise          : "lise_klikk",
      click_farmer        : "bonde_klikk",
      click_link1         : "klikk_oppskrift",
      click_link2         : "klikk_bama",
      close_lise          : "lise_lukk",
      close_farmer        : "bonde_lukk",
      video_play          : "video_play",
      video_pause         : "video_pause",
      event_idle          : "inaktive_bruker",
      event_wake          : "reaktivert_bruker",
      video_resume        : "video_fortsett",
      video_finish        : "video_slutt",
      error_javascript    : "error_javascript",
      error_unknown       : "error_unknown"
    }
```

