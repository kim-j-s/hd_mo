(function () {
	const n = $(document);
	$(window).height(),
		n.on("click", ".header .right [class^=allmenu]", function () {
			const t = $(this),
				e = t.closest(".header_inner").find(".nav_menu_wrap");
			e.css("visibility") == "hidden" ? e.addClass("active").attr("aria-hidden", "false") : (e.removeClass("active").attr("aria-hidden", "true"), $(".header .allmenu").focus());
		}),
		n.on("click", ".acd_item .acd_head .acd_btn", function () {
			const t = $(this),
				e = t.parent(".acd_head"),
				a = e.next(".acd_cont").children(".inner"),
				i = e.parent(".acd_item");
			a.css("display") == "none" ? (t.attr("aria-expanded", "true"), i.children(".acd_head").removeClass("active"), i.children(".acd_cont").children(".inner").hide(), e.addClass("active"), a.slideDown()) : (t.attr("aria-expanded", "false"), e.removeClass("active"), a.slideUp());
		}),
		n.on("click", ".tooltip_wrap button", function () {
			const t = $(this).closest(".tooltip_wrap"),
				e = t.children(".tooltip_head"),
				a = t.find(".tooltip_text").children(".inner"),
				i = t.find(".open");
			$(this).attr("class") == "open" ? ($(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false"), e.addClass("active").find(".open").attr("aria-expanded", "true"), $(".tooltip_wrap .tooltip_text .inner").hide(), a.css("display", "block")) : ($(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false"), $(".tooltip_wrap .tooltip_text .inner").hide(), i.focus());
		}),
		n
			.on("focus input", ".input_text .inp > input", function () {
				const t = $(this),
					e = t.closest(".inp"),
					a = t.val(),
					i = t.siblings(".del");
				i.length && i.attr("tabindex", "0"), $(".input_text .inp").removeClass("active").children(".del").hide(), e.addClass("active"), i.show(), a ? i.show() : (e.removeClass("active"), i.hide());
			})
			.on("blur", ".inp > input", function () {
				const t = $(this),
					e = t.closest(".inp");
				t.val(), t.siblings(".del"), e.removeClass("active");
			})
			.on("click", ".inp > .del", function (t) {
				const e = $(this);
				t.preventDefault(), e.siblings("input").val("").focus(), e.parent(".inp").removeClass("active");
			}),
		n.on("keyup", ".price .inp input", function () {
			const t = $(this),
				e = t.val();
			t.val(e.replace(/[^0-9]/gi, "").replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));
		}),
		n.on("blur keyup", ".byte_check > textarea", function () {
			const t = $(this).val(),
				e = t.length,
				a = 0,
				i = 0,
				o = "",
				c = "",
				r = 500;
			for (const l = 0; l < e; l++) (o = t.charAt(l)), escape(o).length > 4 ? (rbtye += 2) : a++, a <= r && (i = l + 1);
			a > r ? ((c = t.substr(0, i)), $(this).val(c)) : $(this).next().find("em").html(a);
		}),
		n.on("click", ".tab_btn", function () {
			const t = $(this).index();
			$(this).closest(".tab_wrap_list").children(".tab_btn").removeClass("active").attr("aria-selected", "false"), $(this).addClass("active").attr("aria-selected", "true"), $(this).closest(".tab_wrap").children(".tab_wrap_content").removeClass("active"), $(this).closest(".tab_wrap").children(".tab_wrap_content").eq(t).addClass("active");
		});
})();
$(window).on("click", function (n) {
	var s = $(n.target),
		t = $(".test_item, .test_item2");
	s.closest(t).length || t.removeClass("active");
	var e = $(".popup_inner");
	s.closest(e).length || (console.log("this : ", s), $("#wrap").removeClass("scroll_lock").attr("aria-hidden", "false"), s.closest(".popup_wrap").removeClass("active").attr("aria-hidden", "true").find(".popup_inner").removeAttr("tabindex"));
});
