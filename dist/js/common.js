(function () {
	const $DOM = $(document),
		$WIN = $(window),
		wHeight = $WIN.height();

	/* 전체메뉴 */
	$DOM.on("click", ".header .right [class^=allmenu]", function () {
		const $this = $(this),
			$nav = $this.closest(".header_inner").find(".nav_menu_wrap");

		if ($nav.css("visibility") == "hidden") {
			$nav.addClass("active").attr("aria-hidden", "false");
		} else {
			$nav.removeClass("active").attr("aria-hidden", "true");
			$(".header .allmenu").focus();
		}
	});

	/* Accordian */
	$DOM.on("click", ".acd_item .acd_head .acd_btn", function () {
		const $this = $(this),
			$head = $this.parent(".acd_head"),
			$inner = $head.next(".acd_cont").children(".inner"),
			$click_item = $head.parent(".acd_item");

		if ($inner.css("display") == "none") {
			$this.attr("aria-expanded", "true");
			$click_item.children(".acd_head").removeClass("active");
			$click_item.children(".acd_cont").children(".inner").hide();
			$head.addClass("active");
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
			$t_text.css("display", "block");
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

/* Popup 관련 */
// Popup 열기
function openPop(target) {
	const $target = $("#" + target);

	if ($target.length) {
		$("#wrap").addClass("scroll_lock").attr("aria-hidden", "true");
		$target.addClass("active").attr("aria-hidden", "false");

		//렌더링 후, focus 이동
		setTimeout(function () {
			$target.find(".popup_inner").attr("tabindex", "0").focus();
		}, 100);
	}
}

// Popup 닫기
function closePop(target) {
	const $target = $("#" + target);

	$("#wrap").removeClass("scroll_lock").attr("aria-hidden", "false");
	$target.removeClass("active").attr("aria-hidden", "true");
	$target.find(".popup_inner").removeAttr("tabindex");
}

// Toast 팝업
function toastAction(click) {
	const $toast = $(".toast_wrap"),
		msg = $(click).data("msg");
	let isShow = $toast.hasClass("active");

	if (isShow) return;
	$toast.find(".toast_msg").text("");

	setTimeout(function () {
		toastMsg(msg);
		$toast.addClass("active");
	}, 300);

	setTimeout(function () {
		$toast.removeClass("active");
	}, 1500);
}

function toastMsg(msg) {
	// const text = $('<div class='toast_msg'></div>').text(msg);
	$(".toast_msg").text(msg).closest(".toast_wrap").addClass("active");
}

$(window).on("click", function (e) {
	var $target = $(e.target);
	// console.log($target);
	// 범용
	var $test_item = $(".test_item, .test_item2");
	if (!$target.closest($test_item).length) {
		$test_item.removeClass("active");
	}

	// 팝업 영역 외 클릭 시 팝업 닫기
	var $close_popup = $(".popup_inner");
	if (!$target.closest($close_popup).length) {
		// console.log('this : ', $target);
		$("#wrap").removeClass("scroll_lock").attr("aria-hidden", "false");
		$target.closest(".popup_wrap").removeClass("active").attr("aria-hidden", "true").find(".popup_inner").removeAttr("tabindex");
	}
});
