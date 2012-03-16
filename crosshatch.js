/****************************************************************

crosshatch.js

@description: crosshatch manages crosshatch (#) urls for web apps
@author: Jimmy Byrum <me@jimmybyrum.com>
@version: 0.2

# URLs
You need to "route" #! urls before you can use them.

Crosshatch.route({
    url: "/search/{term}/{geo}/",
    pattern: /\/search(\/?)([\d\w\s+_\-%,"']*)(\/?)([\d\w\s+_\-%,"']*)/,
    controller: function(_self, _url) {
        // what to do...?
        // take actions related to a search results page
    }
});

****************************************************************/

var Crosshatch = function() {
    var version = 0.2,
    	urls = {},
        history = [],
        can_manage_history = ("pushState" in window.history),
        base_path = window.location.pathname,
        view = 0,
        online = false,
        beforeLoad = function() {},
        afterLoad = function() {},
        transition_delay = 0; // set this to 300 to deal with mobile device click delay
    
    // for updating the TITLE tag
    var setTitle = function(_title) {
        document.title = _title;
    };
    
    var _encode = function(_string) {
        _string = encodeURIComponent(_string);
        _string = _string.replace(/%20/g, "+");
        _string = _string.replace(/%2F/g, "/");
        return _string;
    };
    
    var _decode = function(_string) {
        _string = _string.replace(/\//g, "%2F");
        _string = _string.replace(/\+/g, "%20");
        _string = decodeURIComponent(_string);
        return _string;
    };
    
    // updates the location fragment after the crosshatch
    var setLocation = function(_location) {
    	if (!online) { return false; }
        // sometimes ! comes through as %21 - need to look into this
        _location = _location.replace("%21", "!");
        
        // ignore the #!
        if (_location.indexOf("#!") === 0) { _location = _location.substring(2); }
        //console.info("Crosshatch.setLocation()", _location);
        
        if (_location === "previous") {
            window.history.back();
        } else {
            if (_location==="") {
                _location = "#";
            } else if (_location!=="#") {
                _location = _location.replace(/#!\//, "/");
                _location = _encode(_location);
                _location = "#!"+_location;
            }
            document.location.href = _location;
        }
    };
    
    // sets up the urls array
    var router = function(_config) {
        //console.info("Crosshatch.router()", _config);
        urls[_config.url] = {
            pattern: _config.pattern,
            controller: _config.controller
        };
    };
    
    // figures out which #! view we're on and calls that view's controller
    var loader = function() {
    	if (!online) { return false; }
        setTimeout(function() {
            var _url = window.location.hash.replace(/#!\//, "/");
            //console.groupCollapsed("Crosshatch.loader("+_url+")");
            //console.debug("History:", history);
            //console.groupEnd();
            
            var _previous = history[history.length-1];
            //console.debug("previous: " + _previous);
            //console.debug("url:      " + _url);
            if (_previous!==undefined) { _previous = _decode(_previous); }
            //console.debug(_url===_previous);
            if (_url===_previous) { return false; }
            
            beforeLoad(_url, _previous);
            var i;
            for (i in urls) {
                //console.log("match", _url, urls[i].pattern);
                if (_url.match(urls[i].pattern)) {
                    urls[i].controller(urls[i], _url);
                    break;
                }
            }
            history.push(_url);
            afterLoad(_url, _previous);
        }, transition_delay);
    };
    
    var ready = function(_callback) {
    	online = true;
        loader();
        if (typeof _callback === "function") {
            _callback();
        }
    };
    
    // set up crosshatch navigation listener
    var navigation_interval,
        navigation_interval_timeout = 500;
    if ("onhashchange" in window && navigator.appVersion.indexOf("MSIE 7.")<0 && navigator.appVersion.indexOf("MSIE 6.")<0) {
        // newer browsers use onhashchange
        //console.info("onhashchange navigation");
        window.onhashchange = loader;
    } else {
        // older browsers use an interval
        //console.info("interval navigation");
        navigation_interval = setInterval(loader, navigation_interval_timeout);
    }
    
    // return content/functions that we want to be public
    return {
    	version: version,
        urls: urls,
        history: history,
        route: router,
        ready: ready,
        load: loader,
        encode: _encode,
        decode: _decode,
        historyLength: function() { return history.length; },
        clearHistory: function() { history = []; },
        beforeLoad: function(_beforeLoad) { beforeLoad = _beforeLoad; },
        afterLoad: function(_afterLoad) { afterLoad = _afterLoad; },
        setTransitionDelay: function(_delay) { transition_delay = _delay; },
        setTitle: setTitle,
        setLocation: setLocation
    }
}();
