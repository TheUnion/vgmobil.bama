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


####Mirroring/publishing working folder to remote server (i.e. richmedia.vg.no) with RSync

* [using rsync with ssh keys via authorized_keys](http://ramblings.narrabilis.com/using-rsync-with-ssh) 
* [Rsync command restriction over SSH](http://en.positon.org/post/Rsync-command-restriction-over-SSH#pr) 
* [Better than Time Machine: backup your Mac with rsync](http://www.haykranen.nl/2008/05/05/rsync/) 


####Git tools
* [http://www.sourcetreeapp.com/](http://www.sourcetreeapp.com/)
* [Smart branching with SourceTree and Git-flow](http://blog.sourcetreeapp.com/2012/08/01/smart-branching-with-sourcetree-and-git-flow/)


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

INTRO
![Intro](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_intro.jpg)
STATION 1 
![Station #1](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station1.jpg)
STATION 2 
![Station #2](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station2.jpg)
STATION 3 
![Station #3](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station3.jpg)
STATION 4 
![Station #4](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station4.jpg)
STATION 5 
![Station #5](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station5.jpg)
STATION 6 
![Station #6](http://www.views.no/dev/games/bama/assets/img/storyboard/bilreise_station6.jpg)
