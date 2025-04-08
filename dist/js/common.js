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
			$("body").addClass("scroll_lock");
			$nav.addClass("active");

			setTimeout(function () {
				$nav.find(".nav_menu_inner").attr("tabindex", "0").focus();
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
			$("body").removeClass("scroll_lock");
			$(".wrap").removeAttr("aria-hidden");
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
				$del = $this.siblings(".del");
			let val = $this.val();

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

			//전화번호
			if ($this.closest(".comp_wrap").hasClass("phone")) {
				if (val) {
					const newVal = val.replace(/ - /g, "");
					$this.attr("maxlength", 8);
					$this.val(newVal).removeClass("isVal");
				}
			}
		})
		.on("blur", ".inp > input", function () {
			const $this = $(this),
				$wrap = $this.closest(".inp");
			let val = $this.val(),
				newVal = 0;

			$wrap.removeClass("active");

			// 전화번호
			if ($this.closest(".comp_wrap").hasClass("phone")) {
				$this.attr("maxlength", 14);
				if (val) {
					val = val.replace(/[^0-9]/g, "");
					newVal = " - " + val.replace(/(\d{4})(?=\d)/g, "$1 - ");
					$this.val(newVal).addClass("isVal");
				} else {
					$this.removeClass("isVal");
				}
			}
		})
		.on("click", ".inp > .del", function (e) {
			const $this = $(this);
			e.preventDefault();
			$this.siblings("input").val("").focus();
			$this.parent(".inp").removeClass("active");

			if ($this.closest(".comp_wrap").hasClass("phone")) {
				$this.siblings("input").removeClass("isVal");
			}
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

	// 약관 동의
	const $chkAll = function (click) {
		const $group = click.closest(".chk_group_wrap"),
			$total = $group.find(".chk_point:not(:disabled)").length,
			$chked = $group.find(".chk_point:not(:disabled):checked").length;

		if ($total === $chked) {
			$group.find(".chk_point_all").prop("checked", true);
		} else {
			$group.find(".chk_point_all").prop("checked", false);
		}
	};

	$DOM
		.on("change", ".chk_group_wrap .chk_point", function () {
			const $sub_status = $(this).is(":checked"),
				$sub_list = $(this).closest(".checkbox").next(".chk_list");

			if ($sub_status) {
				$sub_list.find(".chk_point_sub:not(:disabled)").prop("checked", true);
			} else {
				$sub_list.find(".chk_point_sub:not(:disabled)").prop("checked", false);
			}
			$chkAll($(this));
		})
		.on("change", ".chk_group_wrap .chk_point_sub", function () {
			const $group_sub = $(this).closest(".chk_list"),
				$sub_total = $group_sub.find(".chk_point_sub:not(:disabled)").length,
				$sub_chked = $group_sub.find(".chk_point_sub:not(:disabled):checked").length;

			if ($sub_chked === $sub_total) {
				$group_sub.closest("li").find(".chk_point").prop("checked", true);
			} else {
				$group_sub.closest("li").find(".chk_point").prop("checked", false);
			}
			$chkAll($(this));
		})
		.on("change", ".chk_group_wrap .chk_point_all", function () {
			const allChked = $(this).is(":checked");

			if (allChked) {
				$(this).closest(".chk_group_wrap").find("input[type=checkbox]:not(:disabled)").prop("checked", true);
			} else {
				$(this).closest(".chk_group_wrap").find("input[type=checkbox]:not(:disabled)").prop("checked", false);
			}
		});
	// 약관 동의

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
		$(this).closest("[class^=tab_wrap_list]").children(".tab_btn").removeClass("active").attr("aria-selected", "false");
		$(this).addClass("active").attr("aria-selected", "true");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").removeClass("active");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").eq(idx).addClass("active");
	});

	// select_driver
	$DOM.on("change", '.select_driver_range input[type="radio"]', function () {
		const $relGroup = $(".ouput_driver_relationship").find(".relationship_box");
		const idx = $(this).closest(".inp_radio").index() + 1;
		let newClass = "pick" + idx;

		$relGroup.removeAttr("class").addClass("relationship_box " + newClass);
	});

	// $DOM.on('change', '.select_driver_range input[type="radio"]', function(){
	// 	const $relGroup = $('.ouput_driver_relationship').find('.rel_group')
	// 	let chkNum = $(this).attr('data-num');

	// 	if(chkNum){
	// 		chkNum = chkNum.split(',');
	// 	}else {
	// 		return;
	// 	}

	// 	console.log(chkNum);

	// 	$relGroup.children('div').each(function(){
	// 		const $this = $(this),
	// 					thisNum = $this.attr('data-num'),
	// 					numSrc = $this.find('img').attr('src'),
	// 					newFile = numSrc.substring(0, numSrc.lastIndexOf('.'));

	// 		// console.log('chkNum' + chkNum, 'num' + num);
	// 		// console.log(numSrc)

	// 		if (chkNum.includes(thisNum)) {
	// 			$this.addClass('active');
	// 			$this.find('img').attr('src', newFile + '_on.' + /[^.]+$/.exec(numSrc));
	// 	} else {
	// 			// chkNum에 해당하지 않는 div에 대해서는 '_on'을 삭제
	// 			if (numSrc.includes('_on')) {
	// 					const originalSrc = numSrc.replace('_on', '');
	// 					$this.find('img').attr('src', originalSrc);
	// 			}
	// 	}

	// 		// numCase.addClass('active');
	// 		// numCase.find('img').attr('src', newFile + '_on.' + /[^.]+$/.exec(numSrc));
	// 	});
	// })
})();

//
function phoneVal(target) {
	const $target = target;

	if ($target.closest(".comp_wrap").hasClass("phone")) {
		$target.siblings("input").removeClass("isVal");
	}
}

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

	// 달력 호출
	$.datepicker.setDefaults({
		dateFormat: "yy.mm.dd",
		prevText: "이전 달",
		nextText: "다음 달",
		showOn: "none",
		showOtherMonths: true,
		showMonthAfterYear: true,
		yearSuffix: "년",
		monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
		monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
		dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		showAnim: "slideDown",
		duration: 300,
		beforeShow: function () {
			$("body").append('<div class="modal_backdrop"></div>');
			setTimeout(function () {
				$("body").addClass("modal_open");
			}, 50);
		},
		onClose: function () {
			setTimeout(function () {
				$(".modal_backdrop").remove();
			}, 200);
			$("body").removeClass("modal_open");
		},
	});

	// $(".inp_picker:not([readonly])").datepicker({
	// 	disabled: false  // 기본값 override
	// });

	// $(".calendar_call").on("click", function () {
	// 	$(this).siblings(".inp_picker").datepicker("show"); // 정확한 input만 targeting
	// });

	$(".inp_picker").datepicker();

	$(".calendar_call").on("click", function (e) {
		e.preventDefault(); // 기본 동작 방지
		const $input = $(this).siblings(".inp_picker");
		$input.attr("readonly", true); // readonly 속성 추가
		$input.datepicker("show");
		setTimeout(function () {
			$input.attr("readonly", false); // readonly 속성 제거
		}, 500);
	});

	// 달력 호출
});
