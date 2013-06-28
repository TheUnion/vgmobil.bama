var p62602script;
function p62602Event (id,p) {
        p62602script = document.createElement('script');
        p62602script.type = 'text/javascript';
        if (p==null)
  p62602script.src ='http://pliing.se/PliingAd/Event?id=' + id + '&userAdId=884071728&callback=p62602Callback';
        else
  p62602script.src ='http://pliing.se/PliingAd/Event?id=' + id + '&userAdId=884071728&callback=p62602Callback&p=' + p;
        document.getElementsByTagName('head')[0].appendChild(p62602script);
    }
function p62602Callback() {
    document.getElementsByTagName('head')[0].removeChild(p62602script);
}
function p62602OpenLink (id,p) {
if (p==null)
    window.open('http://pliing.se/PliingAd/ExtLink?id=' + id + '&userAdId=884071728', '_blank');
else
    window.open('http://pliing.se/PliingAd/ExtLink?id=' + id + '&userAdId=884071728&p='+p, '_blank');
}