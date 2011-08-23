Crosshatch.route({
	url: "/",
	pattern: /^(\/|)$/,
	controller: function(_self, _url) {
		console.groupCollapsed("/");
		console.log("_self: ", _self);
		console.log("_url: ", _url);
		console.groupEnd();
		document.getElementById("content").innerHTML = "Home";
	}
});

Crosshatch.route({
	url: "/page{number}",
	pattern: /^\/page([\d]+)$/,
	controller: function(_self, _url) {
		var _page = _url.replace(_self.pattern, "$1");
		console.groupCollapsed("/page{number}");
		console.log("_self: ", _self);
		console.log("_url: ", _url);
		console.log("_page: ", _page);
		console.groupEnd();
		document.getElementById("content").innerHTML = "Page " + _page;
	}
});

Crosshatch.route({
	url: "/page1/{subsection}",
	pattern: /^\/page1\/([\d\w_\-]+)$/,
	controller: function(_self, _url) {
		var _subsection = _url.replace(_self.pattern, "$1");
		console.groupCollapsed("/page1/{subsection}");
		console.log("_self: ", _self);
		console.log("_url: ", _url);
		console.log("_subsection: ", _subsection);
		console.groupEnd();
		document.getElementById("content").innerHTML = "Page 1" + _subsection;
	}
});
