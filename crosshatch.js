/****************************************************************

crosshatch.js

@description: crosshatch manages crosshatch (#) urls for web apps
@author: Jimmy Byrum <me@jimmybyrum.com>
@version: 0.1

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
	var urls = {},
		history = [],
		beforeLoad = function() {},
		afterLoad = function() {};

	// check for the console
	var _console = function(_item, _alt) {
		if (console[_item] === undefined) {
			if (_alt !== undefined) {
				console[_item] = _alt;
			} else {
				console[_item] = function() {};
			}
		}
	};
	// define console for older browsers
	if (typeof console === "undefined") {
		console = {};
	}
	_console("log");
	_console("info");
	_console("debug");
	_console("error");
	_console("trace");
	_console("group");
	_console("groupCollapsed", console.group);
	_console("groupEnd");
	_console("dir");
	_console("dirxml");

	// for updating the TITLE tag
	var setTitle = function(_title) {
		document.title = _title;
	};
	
	// updates the location fragment after the crosshatch
	var setLocation = function(_location) {
		// sometimes ! comes through as %21 - need to look into this
		_location = _location.replace("%21", "!");
		
		// ignore the #!
		if (_location.indexOf("#!") === 0) { _location = _location.substring(2); }
		console.info("Crosshatch.setLocation()", _location);
		
		if (_location === "previous") {
			var _previous;
			if (history.length>1) {
				history.pop();
				_previous = history[(history.length-1)];
			} else {
				_previous = "#";
			}
			
			console.info("previous:", _previous);
			setLocation(_previous);
		} else if (_location!=="refresh") {
			if (_location==="") {
				_location = "#";
			} else if (_location!=="#") {
				_location = _location.replace(/"/g, "%22");
				_location = _location.replace(/[ ]/g, "+");
				_location = _location.replace(/#!\//, "/");
				_location = "#!"+_location;
			}
			document.location.href = _location;
		}
	};
	
	// sets up the urls array
	var router = function(_config) {
		console.info("Crosshatch.router()", _config);
		urls[_config.url] = {
			pattern: _config.pattern,
			controller: _config.controller
		};
	};
	
	// figures out which #! view we're on and calls that view's controller
	var loader = function() {
		beforeLoad();
		var _url = window.location.hash.replace(/#!\//, "/");
		console.groupCollapsed("Crosshatch.loader("+_url+")");
		console.debug("History:", history);
		console.groupEnd();
		
		var _previous = history[history.length-1];
		//console.debug(_previous, _url);
		if (_previous!==undefined) { _previous = _previous.replace(/(%22)/g, '"'); }
		if (_url===_previous) { return false; }
		
		var i;
		for (i in urls) {
			//console.log("match", _url, urls[i].pattern);
			if (_url.match(urls[i].pattern)) {
				urls[i].controller(urls[i], _url);
				break;
			}
		}
		history.push(_url);
		afterLoad();
	};
	
	var ready = function(_callback) {
		loader();
		if (typeof _callback === "function") {
			_callback();
		}
	};
	
	// set up crosshatch navigation listener
	var navigation_interval,
		navigation_interval_timeout = 500;
	if ("onhashchange" in window) {
		// newer browsers use onhashchange
		console.info("onhashchange navigation");
		window.onhashchange = loader;
	} else {
		// older browsers use an interval
		console.info("interval navigation");
		navigation_interval = setInterval(loader, navigation_interval_timeout);
	}
	
	// return content/functions that we want to be public
	return {
		urls: urls,
		history: history,
		route: router,
		ready: ready,
		load: loader,
		beforeLoad: beforeLoad,
		afterLoad: afterLoad,
		setTitle: setTitle,
		setLocation: setLocation,
		navigation_interval: navigation_interval,
		navigation_interval_timeout: navigation_interval_timeout
	}
}();