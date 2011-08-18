crosshatch.route({
	url: "/",
	pattern: /^(\/|)$/,
	controller: function(_self, _url) {
		console.log(_self, _url);
		document.getElementById("content").innerHTML = "Home";
	}
});

crosshatch.route({
	url: "/page{number}",
	pattern: /^\/page([\d]+)$/,
	controller: function(_self, _url) {
		var _page = _url.replace(_self.pattern, "$1");
		document.getElementById("content").innerHTML = "Page " + _page;
		console.log(_self, _url, _page);
	}
});

crosshatch.route({
	url: "/page1/{subsection}",
	pattern: /^\/page1\/([\d\w_\-]+)$/,
	controller: function(_self, _url) {
		var _subsection = _url.replace(_self.pattern, "$1");
		console.log(_self, _url, _subsection);
		document.getElementById("content").innerHTML = "Page 1" + _subsection;
	}
});
