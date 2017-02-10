var $G = {
	// Element Attribute Helper
	attrDefault: function ($el, data_var, default_val) {
		if (typeof $el.data(data_var) != 'undefined') {
			return $el.data(data_var);
		}
		return default_val;
	}
};
(function (root, $, $G) {
	$G.goBack = function (e) {
		var defaultLocation = "/";
		var oldHash = window.location.hash;
		history.back();
		var newHash = window.location.hash;
		if (
			newHash === oldHash &&
			(typeof(document.referrer) !== "string" || document.referrer === "")
		) {
			window.setTimeout(function () {
				window.location.href = defaultLocation;
			}, 1000);
		}
		if (e) {
			if (e.preventDefault)
				e.preventDefault();
			if (e.preventPropagation)
				e.preventPropagation();
		}
		return false; // stop event propagation and browser default event
	}
})(window, jQuery, $G);