$(function () {
	$(document);
	const e = $(window),
		o = $(".wrap"),
		t = $(".footer"),
		i = $(".pageTop");
	let s, l, n, a;
	function c() {
		(s = e.height()), (l = e.scrollTop()), (n = o.outerHeight()), (a = t.outerHeight()), console.log("wrapHeight : ", n);
	}
	function r() {
		console.log(n, a, l, s), n - a < l + s ? i.addClass("active") : i.removeClass("active");
	}
	c(),
		r(),
		e.on("scroll", function () {
			c(), r();
		}),
		e.on("load", function () {
			c(), r();
		});
});
$(window).on("click", function (e) {
	var o = $(e.target),
		t = $(".test_item, .test_item2");
	o.closest(t).length || t.removeClass("active");
	var i = $(".popup_inner");
	o.closest(i).length || (console.log("this : ", o), $("#wrap").removeClass("scroll_lock"), o.closest(".popup_wrap").removeClass("active").find(".popup_inner").removeAttr("tabindex"));
});
