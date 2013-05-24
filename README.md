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


####Documentation
Read the code and the comments.



####Snippets

CSS inheritance from class to id

    div.someBaseDiv,
    #someInheritedDiv
    {
        margin-top:3px;
        margin-left:auto;
        margin-right:auto;
        margin-bottom:0px;
    } 

This will tell your #someInheritedDiv to apply the same styles as div.someBaseDiv has. Then you extend this set of styles with more specific to your #someInheritedDiv:

    #someInheritedDiv
    {
        background-image:url("images/worldsource/customBackground.gif");
        background-repeat:no-repeat;
        width:950px;
        height:572px;
    } 

  ​

###Storyboard


####STORYBOARD

![Intro](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_intro.jpg)
![Station #1](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station1.jpg)
![Station #2](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station2.jpg)
![Station #3](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station3.jpg)
![Station #4](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station4.jpg)
![Station #5](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station5.jpg)
![Station #6](http://www.kromaviews.no/dev/games/bama/dev/assets/img/storyboard/bilreise_station6.jpg)
