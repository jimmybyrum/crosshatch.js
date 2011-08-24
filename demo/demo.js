// this is all code specific to my app
function addEvent(element, action, callback, bubble) {
    if (element.attachEvent) {
        element.attachEvent("on"+action, callback);
    } else if (element.addEventListener) {
        element.addEventListener(action, callback, bubble);
    }
}

function xhr(_type, _url, _params, _callback, _failure) {
	_type = _type || "GET";
	try {
		var _xhr = new XMLHttpRequest();
		_xhr.open(_type, _url, true);
		if (_type === "POST") {
			//Send the proper header information along with the request
			_xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			_xhr.setRequestHeader("Content-length", _params.length);
			_xhr.setRequestHeader("Connection", "close");
			_xhr.send(_params);
		} else {
			_xhr.send();
		}
		_xhr.onreadystatechange = function() {
			if (_xhr.readyState === 4) {
				var _json = "";
				if (_xhr.responseText && _xhr.responseText !== "") {
					_json = eval("(" + _xhr.responseText + ")");
				}
				_callback(_json);
			}
		}
	} catch (e) {
		console.debug("error: ", e);
		if (typeof(_failure) === "function") {
			_failure();
		}
	}
};

var _search = document.getElementById("search");
var _input = document.getElementById("q");
var _results = document.getElementById("results");
var _submit = document.getElementById("submit");

addEvent(_search, "submit", function(e) {
	e.preventDefault();
	_results.innerHTML = "search results for " + _input.value;
	Crosshatch.setLocation("/search/"+_input.value+"/");
}, false);
function doSearch(_term) {
	_input.value = _term;
	_submit.click();
}
function clearSearch() {
	_input.value = "";
	_input.focus();
	_results.innerHTML = "";
}

function loadSettings(_url) {
	// fetch a page via ajax
	xhr("GET", _url, {}, function(_response) {
		document.body.className = "settings";
		document.body.appendChild(_response);
	});
}
