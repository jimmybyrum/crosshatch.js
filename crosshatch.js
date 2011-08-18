/****************************************************************

crosshatch

@description: crosshatch manages crosshatch urls for web apps
@author: Jimmy Byrum <me@jimmybyrum.com>
@version: 0.1

# URLs
You need to register #! urls before you can use them.

#.route({
	url: "/discussions/",
	pattern: /\/discussions\/$/,
	controller: function(_self, _url) {
		// what to do...?
		// take actions related to the discussions page
	}
});

****************************************************************/

var crosshatch = function() {
	var urls = {},
		history = [];

	// for updating the TITLE tag
	var set_title = function(_title) {
		document.title = _title;
	};
	
	// updates the location fragment after the crosshatch
	var set_location = function(_location) {
		// sometimes ! comes through as %21 - need to look into this
		_location = _location.replace("%21", "!");
		
		// ignore the #!
		if(_location.indexOf("#!")===0) { _location = _location.substring(2); }
		console.info("set_location()", _location);
		
		if(_location==="previous") {
			var _previous;
			if(history.length>1) {
				history.pop();
				_previous = history[(history.length-1)];
			} else {
				_previous = "#";
			}
			
			if(_previous.indexOf("map")===-1) {
				console.info("previous:", _previous);
				set_location(_previous);
			}
		} else if(_location!=="refresh") {
			if(_location==="") {
				_location = "#";
			} else if(_location!=="#") {
				_location = _location.replace(/"/g, "%22");
				_location = _location.replace(/[ ]/g, "+");
				_location = _location.replace(/#!\//, "/");
				_location = "#!"+_location;
			}
			document.location.href=_location;
		}
	};
	
	// sets up the urls array
	var router = function(_config) {
		console.info("router()", _config);
		urls[_config.url] = {
			pattern: _config.pattern,
			controller: _config.controller
		};
	};
	
	// figures out which #! view we're on and calls that view's controller
	var loader = function() {
		var _url = window.location.hash.replace(/#!\//, "/");
		console.groupCollapsed("loader("+_url+")");
		console.debug("History:", history);
		console.groupEnd();
		
		var _previous = history[history.length-1];
		//console.debug(_previous, _url);
		if(_previous!==undefined) { _previous = _previous.replace(/(%22)/g, '"'); }
		if(_url===_previous) { return false; }
		
		var i;
		for(i in urls) {
			//console.log("match", _url, urls[i].pattern);
			if(_url.match(urls[i].pattern)) {
				urls[i].controller(urls[i], _url);
				break;
			}
		}
		history.push(_url);
	};
	
	// set up crosshatch navigation listener
	var navigation_interval;
	if ("onhashchange" in window) {
		// newer browsers use onhashchange
		console.info("onhashchange navigation");
		window.onhashchange = loader;
	} else {
		// older browsers use an interval
		console.info("interval navigation");
		navigation_interval = setInterval(loader, 500);
	}
	
	// return content/functions that we want to be public
	return {
		urls: urls,
		history: history,
		route: router,
		load: loader,
		loader: loader,
		set_title: set_title,
		set_location: set_location,
		navigation_interval: navigation_interval
	}
}();
