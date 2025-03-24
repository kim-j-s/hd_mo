(function () {
	const $DOM = $(document),
		$WIN = $(window),
		wHeight = $WIN.height();

	/* 전체메뉴 */
	$DOM.on("click", ".header .right [class^=allmenu]", function () {
		const $this = $(this),
			$nav = $this.closest(".header_inner").find(".nav_menu_wrap");

		// if($nav.css('visibility') == 'hidden'){
		if (!$nav.hasClass("active")) {
			// $('.wrap').addClass('scroll_lock').attr('aria-hidden', true);
			$nav.addClass("active");

			setTimeout(function () {
				$nav.find(".nav_menu_inner").attr("tabindex", "0").focus();
				$nav.find(".nav_menu_inner").css("background", "skyblue");
				$(".right .allmenu").attr("aria-hidden", "true");
				$nav.attr("aria-hidden", "false");
				$(".header_inner").find("*").not(".nav_menu_wrap, .right, .right *").attr("aria-hidden", "true");
				$(".wrap").children().not(".header").attr("aria-hidden", "true");
			}, 400);
			// const at = document.activeElement;
			// const name = at.className;
			// $('.nav_menu_bottom').text(name);
		} else {
			$(".header .allmenu").focus();
			$nav.find(".nav_menu_inner").removeAttr("tabindex");
			$(".header_inner").find("*").not(".nav_menu_wrap, .right, .right *").attr("aria-hidden", "false");
			$(".right .allmenu").attr("aria-hidden", "false");
			$(".wrap").children().not(".header").attr("aria-hidden", "false");
			$nav.removeClass("active").attr("aria-hidden", "true");
			$(".wrap").removeClass("scroll_lock").removeAttr("aria-hidden");
		}
	});

	/* Accordian */
	$DOM.on("click", ".acd_item .acd_head .acd_btn", function () {
		const $this = $(this),
			$head = $this.parent(".acd_head"),
			$inner = $head.next(".acd_cont").children(".inner"),
			$click_item = $head.parent(".acd_item");

		if ($inner.css("display") == "none") {
			$click_item.children(".acd_head").removeClass("active").children(".acd_btn").attr("aria-expanded", "false");
			$click_item.children(".acd_cont").children(".inner").hide();
			$head.addClass("active");
			$this.attr("aria-expanded", "true");
			$inner.slideDown();
		} else {
			$this.attr("aria-expanded", "false");
			$head.removeClass("active");
			$inner.slideUp();
		}
	});

	/* Tooltip */
	$DOM.on("click", ".tooltip_wrap button", function () {
		const $click = $(this).closest(".tooltip_wrap"),
			$t_head = $click.children(".tooltip_head"),
			$t_text = $click.find(".tooltip_text").children(".inner"),
			$focus_btn = $click.find(".open");

		if ($(this).attr("class") == "open") {
			$(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false");
			$t_head.addClass("active").find(".open").attr("aria-expanded", "true");
			$(".tooltip_wrap .tooltip_text .inner").hide();
			$t_text.css("display", "block").focus();
		} else {
			$(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false");
			$(".tooltip_wrap .tooltip_text .inner").hide();
			$focus_btn.focus();
		}
	});

	/* Input */
	$DOM
		.on("focus input", ".input_text .inp > input", function () {
			const $this = $(this),
				$wrap = $this.closest(".inp"),
				val = $this.val(),
				$del = $this.siblings(".del");

			if ($del.length) {
				$del.attr("tabindex", "0");
			}

			$(".input_text .inp").removeClass("active").children(".del").hide();
			$wrap.addClass("active");
			$del.show();

			if (val) {
				$del.show();
			} else {
				$wrap.removeClass("active");
				$del.hide();
			}
			// (this.value) ? $wrap.addClass('active'):$wrap.removeClass('active');
		})
		.on("blur", ".inp > input", function () {
			const $this = $(this),
				$wrap = $this.closest(".inp");
			$wrap.removeClass("active");
		})
		.on("click", ".inp > .del", function (e) {
			const $this = $(this);
			e.preventDefault();
			$this.siblings("input").val("").focus();
			$this.parent(".inp").removeClass("active");
		});

	// comma
	$DOM.on("keyup", ".price .inp input", function () {
		const $this = $(this),
			$val = $this.val();
		$this.val($val.replace(/[^0-9]/gi, "").replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,"));
	});

	// file
	$DOM.on("change", ".inp_file input[type=file]", function () {
		const fileName = $(this).val().split("\\").pop();
		$(this).closest(".inp_file").find(".file_name").text(fileName);
	});

	/* Textarea */
	// byte check
	$DOM.on("blur keyup", ".byte_check > textarea", function () {
		const str = $(this).val(),
			str2 = "",
			maxByte = 500;

		let rlen = 0,
			one_char = "",
			strLng = str.length,
			rbyte = 0;

		for (let i = 0; i < strLng; i++) {
			one_char = str.charAt(i);
			if (escape(one_char).length > 4) {
				rbyte += 2;
			} else {
				rbyte++;
			}

			if (rbyte <= maxByte) {
				rlen = i + 1;
			}
		}

		if (rbyte > maxByte) {
			str2 = str.substr(0, rlen);
			$(this).val(str2);
		} else {
			$(this).next().find("em").html(rbyte);
		}
	});

	// length check
	$DOM.on("keyup", ".length_check > textarea", function (e) {
		const str = $(this).val(),
			$count = $(this).next(".counter").find("em");

		if (str.length == 0 || str == "") {
			$count.text("0");
		} else {
			$count.text(str.length);
		}

		if (str.length > 500) {
			$(this).val($(this).val().substring(0, 500));
		}
	});

	/* Tab */
	$DOM.on("click", ".tab_btn", function () {
		const idx = $(this).index();
		$(this).closest(".tab_wrap_list").children(".tab_btn").removeClass("active").attr("aria-selected", "false");
		$(this).addClass("active").attr("aria-selected", "true");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").removeClass("active");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").eq(idx).addClass("active");
	});
})();

/* Tab Scroll */
function tabScroll() {
	let scrollPosition = 0;

	$(".tab_scroll_box").on("scroll", function () {
		scrollPosition = $(this).scrollLeft();
		// $('#scroll_position span').text(scrollPosition);
	});

	$(".tab_scroll_box .tab_btn").on("click", function () {
		const $this = $(this),
			$scrollBox = $this.closest(".tab_scroll_box");
		$scrollList = $scrollBox.children(".tab_wrap_list");

		const btn_offset = $this.offset().left - 20,
			scrollBox_offset = $scrollBox.offset().left,
			scrollBox_w = $scrollList.width();
		let scrollMove = btn_offset + scrollPosition - $scrollBox.width() / 2 + $this.outerWidth() / 2;

		// console.log('move : ' + scrollMove);
		// console.log('버튼 위치 : ' + btn_offset, '스크롤 위치 : ' + scrollPosition);
		$scrollBox.animate(
			{
				scrollLeft: scrollMove,
			},
			200,
		);
	});
}

$(function () {
	// tab Scroll
	tabScroll();
});
