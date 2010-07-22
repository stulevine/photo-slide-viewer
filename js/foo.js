    var windim = new Array(2);
    var iocache = new Array();
    var opacityOut = 100;
    var opacityIn = 0;
    var step = 5;
    var sdly = 2;
    var ssDelay = 7000;
    var next = 1;
    var current = 0;
    var prev = -1;
    var toggle=false;
    var paused = true;
    var ready4control=false;
    var firstprev=true;
    var intervalTimer;
    var debug;

    function getBrowserStr() {
        return (navigator.userAgent.toLowerCase());
    }
    
 	function getobj(o){

	    if (document.getElementById)
	        return document.getElementById(o)
	    else if (document.all)
	        return document.all.o
	}

    var loadTimer = {
        t : {},
        count : 0,
        maxTime : 15,
        waiting : false,
        progress : 0,
        wait: function(i) {
            if(isImageLoaded(iocache[i]) || this.count >= this.maxTime) {
                this.stopTimer();
                var percent = Math.round((i / (maxImages-1)) * 100);                  
                if(percent > this.progress) { 
                    getobj('innerkarma').style.width=percent; // no need to be redundant
                    //if(!(percent % 10)) debug.log("wait(): Image Loaded! Time: "+this.count+'s, '+percent+'%');
                }
                this.progress = percent;
                if(this.progress == 100) effects.fadeout('progbar');
            } else {
                this.t=setTimeout("loadTimer.wait("+i+");",1000);
                this.count++;
                //debug.log("wait(): Waiting...");
             }
        },
        start : function(i) {
            if (!this.waiting)
            {
                waiting=true;                
                this.wait(i);
            }
        },
        stopTimer : function() {
            clearTimeout(this.t);
            this.waiting=false;
        }
    }
    
    function isImageLoaded(img) {
        if (!img.complete) {
            return false;
        }

        if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
            return false;
        }

        return true;
    }
        
	function truebody(){
	  return (!window.opera && document.compatMode && document.compatMode!="BackCompat")? document.documentElement : 	document.body
	}

    function getwinsize() {
        
        if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            windim[0] = window.innerWidth;
            windim[1] = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            windim[0] = document.documentElement.clientWidth;
            windim[1] = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            //IE 4 compatible
            windim[0] = document.body.clientWidth;
            windim[1] = document.body.clientHeight;
        }
    }

	var effects = {
	    fadeout : function (id) {
	        this.fadeOutLoop(id, opacityOut);
	    },
	    fadeOutLoop : function (id, opacityOut) {
	        var o = getobj(id);
	        if (opacityOut >= step) {
	            effects.setOpacity(o, opacityOut);
	            opacityOut -= step;
	            setTimeout("effects.fadeOutLoop('" + id + "', " + opacityOut + ")", sdly);
	        }else{
	            setTimeout("effects.setOpacity(document.getElementById('"+id+"'), 0)",sdly);
	     	}
	    },
	    fadein : function (id) {
	        this.fadeInLoop(id, opacityIn);
	    },
	    fadeInLoop : function (id, opacityIn) {
	        var o = getobj(id);
	        if (opacityIn < 100) {
	            effects.setOpacity(o, opacityIn);
	            opacityIn += step;
	            setTimeout("effects.fadeInLoop('" + id + "', " + opacityIn + ")", sdly);
	     	}else{
	            setTimeout("effects.setOpacity(document.getElementById('"+id+"'), 100)",sdly);
	     	}
	    },
	    setOpacity : function (o, opacity) {
	        o.style.filter = "alpha(style=0,opacity:" + opacity + ")"; // IE
	        o.style.KHTMLOpacity = opacity / 100; // Konqueror
	        o.style.MozOpacity = opacity / 100; // Mozilla (old)
	        o.style.opacity = opacity / 100; // Mozilla (new)
	    },
	    init : function() {
	    	opacityOut = 100;
	    	opacityIn  = 0;
	    }
	}

    function linker(n) {
        if (n > 0) images[n].prev = n-1;
        if (n != maxImages-1) {
            images[n].next = n+1;
        }
        else{
            images[n].next = 0;
            images[0].prev = n;
        }
        //debug.log("n: "+n+"\n images.next: "+images[n].next+"\n images.prev: "+images[n].prev+"\n");
    }

    function preload() {
        var px = new Image();
        var nx = new Image();
        var ps = new Image();
        px.src = "prev.png";
        nx.src = "next.png";
        ps.src = "pause.png";
        for (var n=0; n < maxImages; n++){
            iocache[n] = new Image();           
            setTimeout('iocache['+n+'].src = images["'+n+'"].src;loadTimer.start('+n+');',n*500);
            setTimeout('linker('+n+');',(n+1)*500);
       }
    }
    
    function center() {
        getobj('controls').style.left = Math.round((windim[0]-imageWidth)/2);
        getobj('d1').style.left = Math.round((windim[0]-imageWidth)/2);
        getobj('d2').style.left = Math.round((windim[0]-imageWidth)/2);
        getobj('start').style.left = Math.round((windim[0]-imageWidth)/2);
        getobj('imgtitle').style.top=Math.round((imageWidth-25)/2);
        getobj('imgtitle').style.width=Math.round((windim[0]-imageWidth-18)/2);
    }

    function runit() {
        window.onresize=function () {
            getwinsize();
            center();
        }
        browser = getBrowserStr();
        debug = jsconsole.init('jsconsole');
        debug.enabled=false;
        debug.width = 300;
        debug.left = 0;
        debug.open();
        preload();
        center();
        debug.log("bmatch: "+browser.match("chrome")+", "+browser);
        if (browser.match("chrome") && browser.match("macintosh")) {
            sdly=0;
            step=10;
        }
        else if(browser.match("msie")){
            sdly=1;
            step=10;
        }
        effects.setOpacity(getobj('prb'),50);
        effects.setOpacity(getobj('next'),50);
        effects.setOpacity(getobj('prev'),50);
        effects.setOpacity(getobj('image1'),0);
        effects.setOpacity(getobj('image2'),0);
        effects.setOpacity(getobj('startimage'),0);
        getobj('image1').style.display='';
        getobj('image2').style.display='';
        getobj('startimage').style.display='';
        effects.fadein('startimage');
        getobj('holder1').src = images[current].src;
        
	    setTimeout("getobj('startimage').style.display='none';ready4control=true;",ssDelay-1000);
        intervalTimer = setInterval("nextimage();",ssDelay);
        debug.log('runit(): maxImages = '+maxImages+'\n');
    }
        
    function nextimage() {
        var imgA='image1';
        var imgB='image2';

        if (toggle) {
            imgA='image2';
            imgB='image1';
        }

        if(!firstprev) {
            next+=2;
            current+=2;
            prev+=2;
            firstprev= true;
        }
        if(next >= maxImages) next = 0;
        if(prev >= maxImages) prev = 0;
        if(current >= maxImages) current = 0;
        
        /* debug.log('nextimage():\n'+
                  '  Current: '+(images[current] != undefined ? images[current].name : 'undef')+' at: '+current+'\n'+
                  '  Next   : '+(images[next] != undefined ? images[next].name : 'undef')+' at: '+ next +'\n'+
                  '  Prev   : '+(images[prev] != undefined ? images[prev].name : 'undef')+' at: '+prev+'\n'+
                  '  src    : '+images[current].src+'\n'); */
        
        getobj('holder2').src = getobj(imgB).src;
        getobj(imgA).src = getobj('holder1').src;
        getobj('imgtitle').innerHTML = images[current].name;
        getobj('holder1').src = images[next].src;
        if(getobj(imgB).src != 'http://www.stulevine.com/photography/blank.jpg') effects.fadeout(imgB);
        effects.fadein(imgA);

        toggle = !toggle;
        
        next++;
        current++;
        prev++;
    }
 
     function previmage() {
        var imgA='image1';
        var imgB='image2';

        if (toggle) {
            imgA='image2';
            imgB='image1';
        }

        if(firstprev) {
            //debug.log('previmage(): firstprev = true');
            next-=2;
            current-=2;
            prev-=2;
            firstprev = false;
        }
        
        if(next < 0 ) next = maxImages-1;
        if(prev < 0 ) prev = maxImages-1;
        if(current < 0) current = maxImages-1;
        
        /* debug.log('previmage(): previmage called:\n'+
                  '  Current: '+(images[current] != undefined ? images[current].name : 'undef')+' at: '+current+'\n'+
                  '  Next   : '+(images[next] != undefined ? images[next].name : 'undef')+' at: '+ next +'\n'+
                  '  Prev   : '+(images[prev] != undefined ? images[prev].name : 'undef')+' at: '+prev+'\n'); */
        
        getobj('holder1').src = getobj(imgB).src;
        getobj(imgA).src = getobj('holder2').src;
        getobj('imgtitle').innerHTML = images[current].name;
        getobj('holder2').src = images[prev].src;
        if(getobj(imgB).src != 'http://www.stulevine.com/photography/blank.jpg') effects.fadeout(imgB);
        effects.fadein(imgA);

        toggle = !toggle;   
        
        next--;
        current--;
        prev--;
    }

    function pause() {
        if(paused) {
            clearInterval(intervalTimer);
            paused = false;
            getobj('prb').src='resume.png';
            getobj('next').style.display='';
            getobj('prev').style.display='';
        }
        else {
            getobj('next').style.display='none';
            nextimage();
            intervalTimer = setInterval("nextimage();",ssDelay);
            paused = true;
            getobj('prb').src = 'pause.png';
            getobj('next').style.display='none';
            getobj('prev').style.display='none';
        }
    }
    
    function togglectrl(f) {
        if(f && ready4control) {
            getobj('controls').style.display='';
        }
        else {
            getobj('controls').style.display='none';
        }
    }    
