###VG Mobil / Bama

Parallax scrolling "journey" by swiping horizontally, presenting local Norwegian produce





####Uses

jQuery
- [jQuery.parallaxSwipe.js](http://torontographic.wordpress.com/2012/08/11/so-you-want-parallax-scrolling-in-ios-ipad-and-ipod/)



####Description
Create a parallax-scrolling setup that can be reused by editing "scenes" along the way.
Add logic for triggering events as each scene becomes visible. 
Trigger a preload-event on scenes that are about to become visible, if there's time for that.

There should be a single event handler controlling the event triggering, so all the tracking code can be added there.



####Snippets


CSS inheritance from class to id

    div.someBaseDiv,
    #someInhertedDiv
    {
        margin-top:3px;
        margin-left:auto;
        margin-right:auto;
        margin-bottom:0px;
    } 

This will tell your #someInhertedDiv to apply the same styles as div.someBaseDiv has. Then you extend this set of styles with more specific to your #someInhertedDiv:
    #someInhertedDiv
    {
        background-image:url("images/worldsource/customBackground.gif");
        background-repeat:no-repeat;
        width:950px;
        height:572px;
    } 

  ​

