var jsonobj = {
    ajaxRequest : function() {
        var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
        if (window.ActiveXObject){
            for (var i=0; i<activexmodes.length; i++) {
                try {
                    return new ActiveXObject(activexmodes[i])
                }
                catch(e) {
                    // if not IE then just supress any errors and ignore it
                }
            }
        }
        else if (window.XMLHttpRequest) 
            return new XMLHttpRequest()
        else
            return false;
    },
    getobj : function(d,s,u) {
        var req = new this.ajaxRequest();
        var jsonurl = '/photography/images.m?d='+d+'&u='+s+'&update='+u;
        req.open("GET", jsonurl, false);
        req.send("");
        return(eval('('+req.responseText+')'));
    }
}