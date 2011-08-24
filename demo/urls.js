Crosshatch.route({
	url: "/",
	pattern: /^(\/|\/#|)$/,
	controller: function(_self, _url) {
		document.body.className = "home";
		Crosshatch.setTitle("Home");
	}
});

Crosshatch.route({
	url: "/search/",
	pattern: /^\/search\/$/,
	controller: function(_self, _url) {
		document.body.className = "search";
		clearSearch();
	}
});

Crosshatch.route({
	url: "/search/{term}/",
	pattern: /^\/search\/([\d\w\s+_\-%,"']*)\/$/,
	controller: function(_self, _url) {
		document.body.className = "search";
		// get the search term from the url
		var _term = _url.replace(_self.pattern, "$1");
		doSearch(_term);
	}
});

Crosshatch.route({
	url: "/settings.html",
	pattern: /^\/settings\.html$/,
	controller: function(_self, _url) {
		loadSettings(_url);
	}
});
