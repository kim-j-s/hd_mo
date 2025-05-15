(function () {
	const $DOM = $(document),
		$WIN = $(window),
		wHeight = $WIN.height();

	/* 전체메뉴 열기 */
	$DOM.on("click", ".header .header_right .allmenu_open", function () {
		console.log("열기");
		const $this = $(this),
			$nav = $this.closest(".header_inner").find(".nav_menu_wrap");

		// if($nav.css('visibility') == 'hidden'){
		/* 전체팝업 열기 */
		if (!$nav.hasClass("active")) {
			$("body").addClass("scroll_lock");
			$nav.addClass("active");

			setTimeout(function () {
				$nav.find(".nav_menu_inner").attr("tabindex", "0").focus();
				$(".header_right .allmenu").attr("aria-hidden", "true");
				$nav.attr("aria-hidden", "false");
				$(".header_inner").find("*").not(".nav_menu_wrap, .header_right, .header_right *").attr("aria-hidden", "true");
				$(".wrap").children().not(".header").attr("aria-hidden", "true");
			}, 400);
			// const at = document.activeElement;
			// const name = at.className;
			// $('.nav_menu_bottom').text(name);
		}
	});
	/* 전체메뉴 열기 */

	/* 전체메뉴 닫기 */
	$DOM.on("click", ".header .header_right .allmenu_close", function () {
		console.log("닫기");
		const $this = $(this),
			$nav = $this.closest(".header_inner").find(".nav_menu_wrap");

		$(".header .allmenu_open").focus();
		$nav.find(".nav_menu_inner").removeAttr("tabindex");
		$(".header_inner").find("*").not(".nav_menu_wrap, .header_right, .header_right *").attr("aria-hidden", "false");
		$(".header_right .allmenu_open").attr("aria-hidden", "false");
		$(".wrap").children().not(".header").attr("aria-hidden", "false");
		$nav.removeClass("active").attr("aria-hidden", "true");
		$("body").removeClass("scroll_lock");
		$(".wrap").removeAttr("aria-hidden");
	});
	/* 전체메뉴 닫기 */

	/* Accordion */
	$DOM.on("click", ".acd_item .acd_head .acd_btn", function () {
		// console.log('아코디언');
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

			// if($this.closest('.acd_item').parent().hasClass('input_item_wrap')){
			// 	$this.closest('.acd_item').addClass('open')
			// }
		} else {
			$this.attr("aria-expanded", "false");
			$head.removeClass("active");
			$inner.slideUp();

			// if($this.closest('.acd_item').parent().hasClass('input_item_wrap')){
			// 	$this.closest('.acd_item').removeClass('open')
			// }
		}
	});

	/* tag_item click */
	$DOM.on("click", ".tag_item_wrap .tag_item", function () {
		const $this = $(this);
		const idx = $this.index();

		if ($(".tag_item_move").length) {
			const $target = $(".tag_item_move").find(".tag_move").eq(idx);
			const targetMargin = parseFloat($target.css("margin-top"));
			const simpleHeight = $(".simple_info_wrap").height();
			const targetOffset = $target.position().top;
			const fix_h = $(this).closest(".sticky_fix").height();
			console.log(targetOffset, targetMargin);

			$(".tag_item").removeClass("active");
			$this.addClass("active");
			$this.closest(".popup_cont").animate(
				{
					scrollTop: targetOffset + targetMargin + simpleHeight + fix_h,
				},
				500,
			);
		}
	});

	/* Tooltip */
	$DOM.on("click", ".tooltip_wrap button", function () {
		const $click = $(this).closest(".tooltip_wrap"),
			$t_head = $click.children(".tooltip_head"),
			$t_text = $click.find(".tooltip_panel").children(".inner"),
			$focus_btn = $click.find(".open");

		if ($(this).hasClass("open")) {
			$(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false");
			$t_head.addClass("active").find(".open").attr("aria-expanded", "true");
			$(".tooltip_wrap .tooltip_panel .inner").hide();
			$t_text.css("display", "block").focus();
		} else {
			$(".tooltip_wrap .tooltip_head").removeClass("active").find(".open").attr("aria-expanded", "false");
			$(".tooltip_wrap .tooltip_panel .inner").hide();
			$focus_btn.focus();
		}
	});

	/* Input */
	$DOM
		.on("focus input", ".input_text .inp > input", function () {
			const $this = $(this),
				$wrap = $this.closest(".inp"),
				$del = $this.siblings(".del"),
				isDisabled = $this.prop("disabled"),
				isReadonly = $this.prop("readonly");
			let val = $this.val();

			if ($del.length) {
				$del.attr("tabindex", "0");
			}

			if (!isDisabled && !isReadonly) {
				if (val) {
					// $del.show();
					$wrap.addClass("active");
				} else {
					// $del.hide();
					$wrap.removeClass("active");
				}
			}

			// $('.input_text .inp').removeClass('active').children('.del').hide();
			// $wrap.addClass('active');
			// $del.show();

			// (this.value) ? $wrap.addClass('active'):$wrap.removeClass('active');

			//전화번호
			if ($this.closest(".input_text").hasClass("phone")) {
				if (val) {
					const newVal = val.replace(/ - /g, "");
					$this.attr("maxlength", 8);
					$this.val(newVal).removeClass("isVal");
				}
			}
		})
		.on("blur", ".inp > input", function () {
			const $this = $(this),
				$del = $this.siblings(".del"),
				$wrap = $this.closest(".inp");
			let val = $this.val(),
				newVal = 0;

			setTimeout(() => {
				// $del.hide();
				// $wrap.removeClass('active');
				if (!$wrap.find(".del").is(":focus")) {
					$wrap.removeClass("active");
				}
			}, 100);
			$wrap.find(".del").on("blur", function () {
				$(this).closest(".inp").removeClass("active");
			});

			// 전화번호
			if ($this.closest(".input_text").hasClass("phone")) {
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
		.on("click", ".inp > .del:not(.del_not)", function (e) {
			const $this = $(this);
			e.preventDefault();

			setTimeout(() => {
				// $this.hide();
				$this.siblings("input").val("").focus();
			}, 100);

			if ($this.closest(".comp_wrap").hasClass("phone")) {
				$this.siblings("input").removeClass("isVal");
			}
		});

	// comma
	$DOM.on("keyup", ".price .inp input, .comma .inp input", function () {
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
				$sub_list = $(this).closest(".inp_checkbox").find(".chk_lby");

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
				$group_sub.closest(".inp_checkbox").find(".chk_point").prop("checked", true);
			} else {
				$group_sub.closest(".inp_checkbox").find(".chk_point").prop("checked", false);
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

	//toggle-swich
	$DOM.on("change", '.inp_checkbox input[role="switch"]', function () {
		$isChecked = $(this).is(":checked");
		$(this).attr("aria-checked", $isChecked ? "true" : "false");
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
	$DOM.on("click", ".tab_btn:not(.tab_btn_block)", function () {
		const idx = $(this).index();
		$(this).closest("[class^=tab_wrap_list]").children(".tab_btn").removeClass("active").attr("aria-selected", "false");
		$(this).addClass("active").attr("aria-selected", "true");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").removeClass("active");
		$(this).closest(".tab_wrap").children(".tab_wrap_content").eq(idx).addClass("active");
	});

	// select_driver
	$DOM.on("change", '.select_driver_range input[type="radio"]', function () {
		const $relGroup = $(".driver_relationship_state").find(".relationship_box");
		const idx = $(this).closest(".inp_radio").index() + 1;
		let newClass = "pick" + idx;

		$relGroup.removeAttr("class").addClass("relationship_box " + newClass);
	});

	//radio_comb(2개의 라디오 버튼 중 택1 콤비네이션)
	$DOM.on("change", '.radio_comb input[type="radio"]', function () {
		const parentCont = $(this).closest(".radio_comb");

		if (parentCont.length > 0) {
			parentCont.removeClass("origin").addClass("active");
		}
	});

	// 수령지 일괄 선택
	$DOM.on("change", ".sa_change", function () {
		var $wrap = $(this).closest(".sa_wrap");
		var selectedPos = $(this).data("getpos");

		$wrap.find(".scp_list li").each(function () {
			var $li = $(this);
			$li.find('input[type="radio"][data-getpos="' + selectedPos + '"]').prop("checked", true);
		});

		// 하위 변경 후, 상단 상태 체크
		updateTopRadio($wrap);
	});

	$DOM.on("change", '.scp_list input[type="radio"]', function () {
		var $wrap = $(this).closest(".sa_wrap");

		// 하위 선택 변경되면 상단 상태도 체크
		updateTopRadio($wrap);
	});

	function updateTopRadio($wrap) {
		var allPos = [];

		// 하위에서 체크된 getpos 수집
		$wrap.find(".scp_list li").each(function () {
			var $checked = $(this).find('input[type="radio"]:checked');
			allPos.push($checked.data("getpos"));
		});

		// 모두 같은 값인지 확인
		var isAllSame = allPos.every(function (pos) {
			return pos === allPos[0];
		});

		if (isAllSame && allPos[0]) {
			// 모두 같은 getpos면 상단 해당 버튼 체크
			$wrap.find('.sa_change[data-getpos="' + allPos[0] + '"]').prop("checked", true);
		} else {
			// 하나라도 다르면 상단 버튼 체크 해제
			$wrap.find(".sa_change").prop("checked", false);
		}
	}
	// 수령지 일괄 선택

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

// prograss
function prograssBar() {
	const $card = $(".card_item");

	$card.each(function () {
		const $this = $(this),
			$bar = $this.find(".insurance_policyBox .progress_box .ing");

		if ($this.find(".insurance_policyBox .progress_box").length > 0) {
			const marginLeft = parseFloat($bar.css("margin-left"));
			const barBoxWidth = $bar.closest(".progress_box").width();
			const barWidth = $bar.width();
			const infoWidth = $bar.find(".start").width();
			const total = marginLeft + barWidth;

			// console.log(marginLeft, barWidth, total, '/'+ barBoxWidth);

			if (marginLeft <= 37) {
				$bar.find(".start").addClass("left");
			}

			if (barBoxWidth <= total) {
				$bar.find(".end").addClass("right");
			}
		}
	});
}

/* Tab Scroll */
// 탭 버튼 클릭 시 중앙에 위치하는 기능 - 접근성 관련 기능
function tabScroll() {
	let scrollPosition = 0;

	$(".tab_scroll_box").on("scroll", function () {
		scrollPosition = $(this).scrollLeft();
		// $('#scroll_position span').text(scrollPosition);
	});

	$(".tab_scroll_box .tab_btn").on("click", function () {
		const $this = $(this),
			$scrollBox = $this.closest(".tab_scroll_box");
		$scrollList = $scrollBox.children(".scroll");

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

// 최근설계내역
function currentPlan() {
	const $bottom = $(".bottom_fix_wrap"),
		$bottom_h = $bottom.outerHeight(),
		$plan_area = $(".fixed_link_wrap"),
		$link_btn = $plan_area.find(".link_btn_box").children(".btn_current"),
		$close_btn = $plan_area.find(".link_btn_box").children(".link_close");

	if ($bottom.length) {
		$plan_area.css("bottom", $bottom_h + 12);
	}

	$(document).on("click", ".link_btn_box .link_close", function () {
		$(this).closest(".fixed_link_wrap").remove();
	});
}

function fixedMenuPlay() {
	const $state = $(".fixed_link_wrap").find(".current_state");

	setTimeout(function () {
		$state.addClass("effect");
	}, 500);

	$state.one("transitionend", function () {
		setTimeout(function () {
			$state.removeClass("effect").attr("aria-hidden", "true");

			setTimeout(function () {
				$state.hide();
			}, 500);
		}, 3000);
	});
}

$(function () {
	// tab Scroll
	tabScroll();

	currentPlan();
	fixedMenuPlay();

	//input disabled&readonly
	$(".input_text input").each(function () {
		const $this = $(this),
			$wrapBox = $this.closest(".comp_wrap"),
			$wrapCard = $this.closest(".card"),
			$inpBox = $this.closest(".input_text"),
			$wrapCalendar = $this.closest(".calendar"),
			isDisabled = $this.prop("disabled"),
			isReadonly = $this.prop("readonly");

		if (isReadonly) {
			if ($wrapCard.length) {
				$wrapBox.addClass("readonly");
			} else if ($wrapCalendar.length) {
				$this.siblings(".calendar_call").prop("disabled", true);
			}
			if (!$wrapBox.length) {
				$inpBox.addClass("readonly");
			}
		}
		if (isDisabled) {
			if ($wrapCard.length) {
				$wrapBox.addClass("disabled");
			} else if ($wrapCalendar.length) {
				$this.siblings(".calendar_call").prop("disabled", true);
			}
			if (!$wrapBox.length) {
				$inpBox.addClass("disabled");
			}
		}
	});
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

	prograssBar();

	// 달력 호출

	// 간편정보 노출 방식
	$("#container, .popup_cont, .container_form").on("scroll", function () {
		const $headHeight = $("#header").outerHeight();
		const $pop_headHeight = $(".popup_head").outerHeight();
		const scrollTop = $("#container").scrollTop();
		const pop_scrollTop = $(".popup_cont").scrollTop();

		// console.log('scroll!! : '+ scrollTop);

		if ($(".simple_info_wrap").length) {
			const $target = $(".simple_info_wrap");
			const targetOffsetTop = $target.offset().top;
			const $targetChild = $(".simple_info_wrap").children(".simple_info_item");
			let new_headHeight = 0;
			let simpleHeight = $(".simple_info_wrap").find(".simple_info_item").height();

			// console.log('기준 위치 : ', targetOffsetTop);

			if ($(".gd_middle_b").length) {
				targetOffsetTop = targetOffsetTop - 50;
			}

			if ($(".popup_head").length) {
				new_headHeight = $pop_headHeight;
			} else {
				new_headHeight = $headHeight;
			}

			// console.log('target 위치 : ' + targetOffsetTop);
			// console.log('컨텐츠 스크롤 위치 : ' + scrollTop);
			// console.log('팝업 컨텐츠 스크롤 위치 : ' + pop_scrollTop);

			if (targetOffsetTop <= new_headHeight + 30 && !$targetChild.hasClass("active")) {
				// console.log('펴기');
				$targetChild.addClass("active");
				$targetChild.stop().slideDown(300);

				if ($(".tag_item_wrap.sticky").length) {
					$(".tag_item_wrap.sticky")
						.css("top", simpleHeight - 30)
						.addClass("active");
				}
			} else if (targetOffsetTop > new_headHeight + 30 && $targetChild.hasClass("active")) {
				// console.log('접기');
				$target.removeAttr("style").removeClass("active");
				$targetChild.removeClass("active");
				$targetChild.stop().slideUp(300);

				if ($(".tag_item_wrap.sticky").length) {
					$(".tag_item_wrap.sticky").removeClass("active");
				}
			}
		}

		if ($(".tag_item_wrap.sticky").length) {
			$(".tag_item_move .tag_move").each(function (idx) {
				const $target = $(this);
				const targetTop = $target.position().top;
				const targetHeight = $target.height();
				const simpleHeight = $(".simple_info_wrap").height();

				if (pop_scrollTop >= targetTop + targetHeight + simpleHeight) {
					$(".tag_item").removeClass("active");
					$(".tag_item").eq(idx).addClass("active");
				}
			});
		}
	});
	// 간편정보 노출 방식

	// 라디오 약관 동의
	/*

	const $groupWrap = $('.ag_group_wrap');
	const $allCheck = $groupWrap.find('.agw_all');

	// 전체 하위 체크박스 제어
	$allCheck.on('change', function() {
		const isChecked = $(this).is(':checked');
		$groupWrap.find('.agr_dept1.ag').prop('checked', isChecked);
		$groupWrap.find('.agr_dept1.noag').prop('checked', !isChecked);
		$groupWrap.find('.ags_sub_all, .ags_sub_chk').prop('checked', isChecked).prop('disabled', !isChecked);
	});

	// 전체 하위 체크박스 제어
	$groupWrap.on('change', '.ags_sub_all', function() {
		const isChecked = $(this).is(':checked');
		const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');

		if (isChecked) {
			// console.log('체크됨');
			$agrdoGroupSub.find('.ags_sub_chk').prop('checked', isChecked);
			$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
		} else {
			$agrdoGroupSub.find('.ags_sub_chk').prop('checked', isChecked);
		}
	});

	// 하위 체크박스 상태 변경 시 전체 체크박스 상태 갱신
	$groupWrap.on('change', '.ags_sub_chk', function() {
		// console.log('서브 체크박스');
		const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');
		const allSubChk = $agrdoGroupSub.find('.ags_sub_chk');
		const isAllSubChecked = allSubChk.length === allSubChk.filter(':checked').length;

		// 모든 하위 체크박스가 체크되면 전체 체크박스를 체크, 아니면 해제
		$agrdoGroupSub.find('.ags_sub_all').prop('checked', isAllSubChecked);
		// console.log('isAllSubChecked : ', isAllSubChecked);

		if(isAllSubChecked == true) {
			$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
		}
	});

	// 민감정보 라디오 선택 시 하위 체크박스 제어
	$groupWrap.on('change', '.agr_dept1', function() {
		const $this = $(this);
		const $agrdoGroup = $this.closest('.agrdo_group');
		const $subGroup = $agrdoGroup.next('.agrdo_group_sub');

		if ($subGroup.length) {
			if ($this.hasClass('noag') && $this.is(':checked')) {
					$subGroup.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
			} else if ($this.hasClass('ag') && $this.is(':checked')) {
					$subGroup.find('input[type="checkbox"]').prop('disabled', false).prop('checked', true);
			}
		}

		updateAllCheckState();
	});

	// radio 상태를 기준으로 전체동의 체크박스 갱신
	function updateAllCheckState() {
		const totalAgr = $groupWrap.find('.agr_dept1.ag');
		const totalNoAgr = $groupWrap.find('.agr_dept1.noag');
		
		let isAllAgreed = true;
		totalAgr.each(function() {
			if (!$(this).is(':checked')) {
				isAllAgreed = false;
				return false;
			}
		});

		totalNoAgr.each(function() {
			if ($(this).is(':checked')) {
				isAllAgreed = false;
				return false;
			}
		});

		$groupWrap.find('.agw_all').prop('checked', isAllAgreed);
	}
	*/

	// 라디오 약관 동의

	// 라디오 약관 동의 - 250430
	// 약관 동의 - 그룹별로 독립 제어
	/*
	$('.ag_groups .ag_group_wrap').each(function () {
		const $groupWrap = $(this);
		const $allCheck = $groupWrap.find('.agw_all');

		// 전체 하위 라디오 제어
		$allCheck.on('change', function () {
			const isChecked = $(this).is(':checked');
			$groupWrap.find('.agr_dept1.ag').prop('checked', isChecked);
			$groupWrap.find('.agr_dept1.noag').prop('checked', !isChecked);
			$groupWrap.find('.ags_sub_all, .ags_sub_chk').prop('checked', isChecked).prop('disabled', !isChecked);
		});

		// 하위 전체 체크 제어
		$groupWrap.on('change', '.ags_sub_all', function () {
			const isChecked = $(this).is(':checked');
			const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');

			$agrdoGroupSub.find('.ags_sub_chk').prop('checked', isChecked);

			if (isChecked) {
				$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
			}
		});

		// 개별 체크 -> 전체 체크 상태 반영
		$groupWrap.on('change', '.ags_sub_chk', function () {
			const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');
			const allSubChk = $agrdoGroupSub.find('.ags_sub_chk');
			const isAllSubChecked = allSubChk.length === allSubChk.filter(':checked').length;

			$agrdoGroupSub.find('.ags_sub_all').prop('checked', isAllSubChecked);

			if (isAllSubChecked) {
				$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
			}
		});

		// 라디오 변경 -> 하위 체크박스 제어
		$groupWrap.on('change', '.agr_dept1', function () {
			const $this = $(this);
			const $agrdoGroup = $this.closest('.agrdo_group');
			const $subGroup = $agrdoGroup.next('.agrdo_group_sub');

			if ($subGroup.length) {
				if ($this.hasClass('noag') && $this.is(':checked')) {
					$subGroup.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
				} else if ($this.hasClass('ag') && $this.is(':checked')) {
					$subGroup.find('input[type="checkbox"]').prop('disabled', false).prop('checked', true);
				}
			}

			updateAllCheckState();
		});

		// 그룹 내 전체 동의 상태 갱신
		function updateAllCheckState() {
			const totalAgr = $groupWrap.find('.agr_dept1.ag');
			const totalNoAgr = $groupWrap.find('.agr_dept1.noag');

			let isAllAgreed = true;

			totalAgr.each(function () {
				if (!$(this).is(':checked')) {
					isAllAgreed = false;
					return false;
				}
			});

			totalNoAgr.each(function () {
				if ($(this).is(':checked')) {
					isAllAgreed = false;
					return false;
				}
			});

			$groupWrap.find('.agw_all').prop('checked', isAllAgreed);
		}
	});
	*/

	// 라디오 약관 동의
	$(".ag_groups").each(function () {
		const $groups = $(this);
		const $totalCheck = $groups.find(".ag_total");

		// 전체 그룹 체크 제어
		$totalCheck.on("change", function () {
			const isChecked = $(this).is(":checked");
			$groups.find(".agw_all").prop("checked", isChecked).trigger("change"); // 각 그룹에 위임
		});

		// 그룹 단위로 동작 유지
		$groups.find(".ag_group_wrap").each(function () {
			const $groupWrap = $(this);
			const $allCheck = $groupWrap.find(".agw_all");

			// 그룹 전체 라디오 제어
			$allCheck.on("change", function () {
				const isChecked = $(this).is(":checked");
				$groupWrap.find(".agr_dept1.ag").prop("checked", isChecked);
				$groupWrap.find(".agr_dept1.noag").prop("checked", !isChecked);
				$groupWrap.find(".ags_sub_all, .ags_sub_chk").prop("checked", isChecked).prop("disabled", !isChecked);
				$groupWrap.find(".agr_dept2").prop("checked", isChecked);

				updateTotalCheckState(); // 상위 전체동의 상태도 반영
			});

			// 하위 전체 체크 제어
			$groupWrap.on("change", ".ags_sub_all", function () {
				const isChecked = $(this).is(":checked");
				const $agrdoGroupSub = $(this).closest(".agrdo_group_sub");

				$agrdoGroupSub.find(".ags_sub_chk").prop("checked", isChecked);

				if (isChecked) {
					$agrdoGroupSub.prev(".agrdo_group").find(".agr_dept1.ag").prop("checked", true);
				}
			});

			// 개별 체크 -> 전체 체크 상태 반영
			$groupWrap.on("change", ".ags_sub_chk", function () {
				const $agrdoGroupSub = $(this).closest(".agrdo_group_sub");
				const allSubChk = $agrdoGroupSub.find(".ags_sub_chk");
				const isAllSubChecked = allSubChk.length === allSubChk.filter(":checked").length;

				$agrdoGroupSub.find(".ags_sub_all").prop("checked", isAllSubChecked);

				if (isAllSubChecked) {
					$agrdoGroupSub.prev(".agrdo_group").find(".agr_dept1.ag").prop("checked", true);
				}
			});

			// 라디오 변경 -> 하위 체크박스 제어
			$groupWrap.on("change", ".agr_dept1", function () {
				const $this = $(this);
				const $agrdoGroup = $this.closest(".agrdo_group");
				const $subGroup = $agrdoGroup.next(".agrdo_group_sub");

				if ($subGroup.length) {
					if ($this.hasClass("noag") && $this.is(":checked")) {
						$subGroup.find('input[type="checkbox"]').prop("checked", false).prop("disabled", true);
					} else if ($this.hasClass("ag") && $this.is(":checked")) {
						$subGroup.find('input[type="checkbox"]').prop("disabled", false).prop("checked", true);
					}
				}

				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신
			});

			// ag_group_cont 하위 체크박스 제어
			$groupWrap.on("change", ".agr_dept2", function () {
				const $this = $(this);
				// const $agrdoGroup = $this.closest('.agrdo_group');
				// const $subGroup = $agrdoGroup.next('.agrdo_group_sub');

				// if ($subGroup.length) {
				// 	if ($this.is(':checked')) {
				// 		$subGroup.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
				// 	} else if (!$this.is(':checked')) {
				// 		$subGroup.find('input[type="checkbox"]').prop('disabled', false).prop('checked', true);
				// 	}
				// }

				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신
			});

			$groupWrap.on("change", ".agr_r_group", function () {
				// console.log('1');
				const $this = $(this);
				if (!$this.is(":checked")) return;

				const index = $this.closest(".inp_radio").index();
				console.log(index);

				const $agGroupCont = $this.closest(".ag_group_cont");

				$agGroupCont.find(".agc_item").each(function () {
					$(this).find(".radio_group_wrap .inp_radio").eq(index).find(".agr_r_group").prop("checked", true);
				});

				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신
			});

			// 그룹 단위 전체 동의 상태 갱신
			function updateGroupCheckState() {
				const totalAgr = $groupWrap.find(".agr_dept1.ag");
				const totalNoAgr = $groupWrap.find(".agr_dept1.noag");
				const totalDpt2 = $groupWrap.find(".agr_dept2");

				let isAllAgreed = true;

				totalAgr.each(function () {
					if (!$(this).is(":checked")) {
						isAllAgreed = false;
						return false;
					}
				});

				totalNoAgr.each(function () {
					if ($(this).is(":checked")) {
						isAllAgreed = false;
						return false;
					}
				});

				totalDpt2.each(function () {
					if (!$(this).is(":checked")) {
						// console.log('단위체크중?');
						isAllAgreed = false;
						return false;
					}
				});

				$groupWrap.find(".agw_all").prop("checked", isAllAgreed);
			}
		});

		// 상위 전체 동의 체크 상태 갱신
		function updateTotalCheckState() {
			const allGroups = $groups.find(".ag_group_wrap");
			const agreedGroups = allGroups.filter(function () {
				const ag = $(this).find(".agr_dept1.ag");
				const noag = $(this).find(".agr_dept1.noag");
				const dpt2 = $(this).find(".agr_dept2");

				let isAgreed = true;

				ag.each(function () {
					if (!$(this).is(":checked")) {
						isAgreed = false;
						//console.log('ag : ' + isAgreed);
						return false;
					}
				});
				noag.each(function () {
					if ($(this).is(":checked")) {
						isAgreed = false;
						//console.log('noag : ' + isAgreed);
						return false;
					}
				});
				dpt2.each(function () {
					if (!$(this).is(":checked")) {
						isAgreed = false;
						//console.log('확인중? : ' + isAgreed);
						return false;
					}
				});
				return isAgreed;
			});

			const isAllAgreed = allGroups.length === agreedGroups.length;
			console.log("체크 : " + allGroups.length + " : ", +agreedGroups.length);
			$totalCheck.prop("checked", isAllAgreed);
			console.log("$totalCheck : " + $totalCheck);
		}
	});
	// 라디오 약관 동의

	/* 광고성 정보의 수신동의 - 개별 Case */
	$(".sep_chk_box").on("change", ".sep_sub_chk", function () {
		const $agrdoGroupSub = $(this).closest(".sep_chk_box");
		const allSubChk = $agrdoGroupSub.find(".sep_sub_chk");
		const isAllSubChecked = allSubChk.length === allSubChk.filter(":checked").length;

		$agrdoGroupSub.find(".sep_sub_all").prop("checked", isAllSubChecked);
	});

	$(".sep_chk_box").on("change", ".sep_sub_all", function () {
		const isChecked = $(this).is(":checked");
		const $agrdoGroupSub = $(this).closest(".sep_chk_box");

		$agrdoGroupSub.find(".sep_sub_chk").prop("checked", isChecked);
	});
	/* 광고성 정보의 수신동의 - 개별 Case */

	// 큰글씨 모드
	// 확대 버튼 클릭 이벤트
	$(".z_up").on("click", function () {
		const zContent = $(this).closest(".zoom_wrap").find(".zoom_content");
		// var currentFontSize = parseFloat($('.zoom_content').css('zoom'));
		var currentFontSize = parseFloat(zContent.css("zoom"));
		var newFontSize = currentFontSize + 0.1;
		zContent.css("zoom", newFontSize);
	});

	// 축소 버튼 클릭 이벤트
	$(".z_down").on("click", function () {
		const zContent = $(this).closest(".zoom_wrap").find(".zoom_content");
		var currentFontSize = parseFloat(zContent.css("zoom"));
		var newFontSize = currentFontSize - 0.1;
		if (newFontSize >= 1) {
			zContent.css("zoom", newFontSize);
		}
	});
	// 큰글씨 모드

	//알릴고지 숫자 표기
	$("ol.form_list > li").each(function (index) {
		const $labels = $(this).find("> .form_group_wrap > .form_line > .label_tit"); // 여러 개일 수 있음
		const num = (index + 1).toString().padStart(2, "0");
		$labels.each(function (i) {
			let numStr = num;
			if ($labels.length > 1 && i > 0) {
				numStr += `-${i}`;
			}
			$(this).prepend(`<span class="num">${numStr} </span>`);
		});
	});

	//이메일 자동완성
	function autoCompleteEmail() {
		let $inputContainer = $(".input_text");
		let $inputEmail = $("input.email_auto");
		let $autoCont = $(".mail_list_cont");
		let $mailList = $(".mail_list");

		const etcWord = "직접입력";
		const domainArr = ["naver.com", "hanmail.net", "daum.net", "kakao.com", "korea.kr", "korea.com", "dreamwiz.com", "yahoo.co.kr", "hi.co.kr"];

		$inputEmail.on("keyup", function () {
			removeAutoCont();
			const $selfThis = $(this);
			const value = $selfThis.val();
			const listhtml = "<div class='mail_list_cont' tabindex='0'><ul class='mail_list' tabindex='0'></ul></div>";
			$(this).closest(".inp").after(listhtml);
			$inputContainer = $(this).closest(".input_text");
			$autoCont = $inputContainer.find(".mail_list_cont");
			$mailList = $inputContainer.find(".mail_list");

			$mailList.on("focusout", function (e) {
				detectFocus(e);
			});

			if (value.includes("@") || value.length < 3) {
				removeAutoCont();
				return;
			}

			if (value.length >= 3) {
				showAutoCont(value, $selfThis);
			}
		});

		//메서드 영역
		function showAutoCont(value, _self) {
			domainArr.forEach(domain => {
				const $listItem = $(`<li><button type='button' class='text'>` + value + `<span class='mark'>@` + domain + `</span></button></li>`);
				$listItem.on("click", function () {
					const item = $(this).text();
					_self.val(item);
					removeAutoCont();
				});
				$mailList.append($listItem);
			});

			const $etcItem = $("<li><button type='button' class='text'>" + etcWord + "</button></li>");
			$mailList.append($etcItem);
			$etcItem.on("click", function () {
				removeAutoCont();
			});

			$autoCont.addClass("on");
		}

		function removeAutoCont() {
			if ($autoCont.length > 0) {
				$autoCont.remove();
			}
		}

		function detectFocus(e) {
			setTimeout(() => {
				const target = $(document.activeElement);
				if ($inputContainer.length && !$inputContainer.is(target) && $inputContainer.has(target).length == 0) {
					removeAutoCont();
				}
			}, 0);
		}

		//이벤트 리스너 영역
		$(document).on("click", function (e) {
			const target = $(e.target);
			const isEmailContainer = $inputEmail.is(target) || $inputEmail.has(target).length > 0 || $autoCont.is(target) || $autoCont.has(target).length > 0;
			if (!isEmailContainer) removeAutoCont();
		});

		$inputEmail.on("blur", function (e) {
			detectFocus(e);
		});
	}

	autoCompleteEmail();
});

$(window).resize(function () {
	// prograssBar();
});
