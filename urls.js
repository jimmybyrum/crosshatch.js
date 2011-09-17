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
        _term = _term.replace(/\+/g, "%20");
        _term = _term.replace(/\//g, "%2F");
        _term = decodeURI(_term);
        doSearch(_term);
    }
});

Crosshatch.route({
    url: "/settings/",
    pattern: /^\/settings\/$/,
    controller: function(_self, _url) {
        loadSettings("settings.html");
    }
});

Crosshatch.route({
    url: "/github/",
    pattern: /^\/github\/$/,
    controller: function(_self, _url) {
        document.body.className = "github"; 
    }
});

