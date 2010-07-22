    var windim = new Array(2);
    var iocache = new Array();
    var opacityOut = 100;
    var opacityIn = 0;
    var step = 4;
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
            
 	function getobj(o){

	    if (document.getElementById)
	        return document.getElementById(o)
	    else if (document.all)
	        return document.all.o
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
	            setTimeout("effects.fadeOutLoop('" + id + "', " + opacityOut + ")", 2);
	        }else{
	            setTimeout("effects.setOpacity(document.getElementById('"+id+"'), 0)",2);
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
	            setTimeout("effects.fadeInLoop('" + id + "', " + opacityIn + ")", 2);
	     	}else{
	            setTimeout("effects.setOpacity(document.getElementById('"+id+"'), 100)",2);
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

    function preload() {
       var px = new Image();
       var nx = new Image();
       var ps = new Image();
       px.src = "prev.png";
       nx.src = "next.png";
       ps.src = "pause.png";
       for (var n=0; n < maxImages; n++){
            setTimeout('iocache['+n+']= new Image();iocache['+n+'].src = images["'+n+'"].src;',n*500);
        }
    }
    
    function center() {
        getobj('controls').style.left = (windim[0]-imageWidth)/2;
        getobj('d1').style.left = (windim[0]-imageWidth)/2;
        getobj('d2').style.left = (windim[0]-imageWidth)/2;
        getobj('start').style.left = (windim[0]-imageWidth)/2;
    }

    function runit() {
        window.onresize=function () {
            getwinsize();
            center();
        }
        //debug = jsconsole.init('jsconsole');
        //debug.width = 300;
        //debug.left = 0;
        //debug.open();
        preload();
        center();
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
        getobj('holder1').src = images[0].src;
	    setTimeout("getobj('startimage').style.display='none';ready4control=true;",ssDelay-1000);
        intervalTimer = setInterval("nextimage();",ssDelay);
        //debug.log('maxImages = '+maxImages+'\n');
    }
        
    function nextimage() {
        var imgA='image1';
        var imgB='image2';
        var nw,nh;
        
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
                
        /* debug.log('nextimage called:\n'+
                  '  Current: '+(images[current] != undefined ? images[current].name : 'undef')+' at: '+current+'\n'+
                  '  Next   : '+(images[next] != undefined ? images[next].name : 'undef')+' at: '+ next +'\n'+
                  '  Prev   : '+(images[prev] != undefined ? images[prev].name : 'undef')+' at: '+prev+'\n'+
                  '  src    : '+images[current].src+'\n'); */
        
        getobj('holder2').src = getobj(imgB).src;
        getobj(imgA).src = getobj('holder1').src;
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
            //debug.log('firstprev = true');
            next-=2;
            current-=2;
            prev-=2;
            firstprev = false;
        }
        
        if(next < 0 ) next = maxImages-1;
        if(prev < 0 ) prev = maxImages-1;
        if(current < 0) current = maxImages-1;
        
        /* debug.log('previmage called:\n'+
                  '  Current: '+(images[current] != undefined ? images[current].name : 'undef')+' at: '+current+'\n'+
                  '  Next   : '+(images[next] != undefined ? images[next].name : 'undef')+' at: '+ next +'\n'+
                  '  Prev   : '+(images[prev] != undefined ? images[prev].name : 'undef')+' at: '+prev+'\n'); */
        
        getobj('holder1').src = getobj(imgB).src;
        getobj(imgA).src = getobj('holder2').src;
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