const $scrollOption = {
	initOptSelectUI: function() {
		$(".opt_select_wrap").each(function () {
			const $wrap = $(this);
			const $inner = $wrap.find(".opt_select_inner");
			const $checked = $inner.find("input[type=radio]:checked");

			// 1. opt_select_dmp 넓이 계산 및 적용
			const winWidth = $(window).width();
			const $item = $inner.find(".opt_select:not(.opt_select_dmp)").first();
			const itemWidth = $item.outerWidth();
			const itemGap = 16;
			const dmpWidth = winWidth / 2 - (itemWidth / 2 + itemGap);
			$inner.find(".opt_select_dmp").css("width", dmpWidth + "px");

			// 2. checked 요소 중앙 정렬
			if ($checked.length) {
				const $item = $checked.closest(".opt_select");
				const innerWidth = $inner.outerWidth();
				const itemOffset = $item.position().left;
				const itemWidth = $item.outerWidth();
				const scrollTo = $inner.scrollLeft() + itemOffset - innerWidth / 2 + itemWidth / 2;

				$inner.scrollLeft(scrollTo);
				$inner.addClass("active");
			}
		});
	},
	
	// 좌우 더미 엘리먼트 사이즈 조정
	setDmpWidth: function () {
		const winWidth = $(window).width();
		const $item = $(".opt_select_wrap .opt_select:not(.opt_select_dmp)").first();
		const itemWidth = $item.outerWidth(); // 98
		const itemGap = 16;
		const dmpWidth = winWidth / 2 - (itemWidth / 2 + itemGap);

		$(".opt_select_wrap .opt_select_dmp").css("width", dmpWidth + "px");
	},

	// 좌우 버튼 제어
	initOptSelectScrollButtons: function() {
		$(".opt_select_wrap").each(function () {
			const $wrap = $(this);
			const $inner = $wrap.find(".opt_select_inner");
			const $items = $inner.find(".opt_select:not(.opt_select_dmp)");
			const itemGap = 16;
			
			// 최초 버튼 상태
			$scrollOption.updateOptSelectButtonState($wrap);

			// 좌측 버튼
			$wrap.find(".swiper_button_left").on("click", function () {
				const $wrap = $(this).closest(".opt_select_wrap");
				const $inner = $wrap.find(".opt_select_inner");
				const $items = $inner.find(".opt_select:not(.opt_select_dmp)");
				const itemWidth = $items.first().outerWidth();
				const scrollAmount = itemWidth + itemGap;
				const $checked = $items.find("input:checked").closest(".opt_select");
				const $prev = $checked.prevAll(".opt_select:not(.opt_select_dmp)").first();
				
				if ($prev.length) {
					// 2025-06-20 중복체크 방지용 수정
					// $prev.find("input[type=radio]").prop("checked", true).trigger("change");
					const $radio = $prev.find("input[type=radio]");
					if (!$radio.is(":checked")) {
						$radio.prop("checked", true).trigger("change");
					}

					$scrollOption.updateLiveRegion($wrap);
				} else {
					// 그래도 이동은 살짝
					$inner.animate(
						{
							scrollLeft: $inner.scrollLeft() - scrollAmount,
						},
						300,
						function () {
							$scrollOption.updateOptSelectButtonState($wrap);
						},
					);
				}
			});

			// 우측 버튼
			$wrap.find(".swiper_button_right").on("click", function () {
				const $wrap = $(this).closest(".opt_select_wrap");
				const $inner = $wrap.find(".opt_select_inner");
				const $items = $inner.find(".opt_select:not(.opt_select_dmp)");
				const itemWidth = $items.first().outerWidth();
				const scrollAmount = itemWidth + itemGap;
				const $checked = $items.find("input:checked").closest(".opt_select");
				const $next = $checked.nextAll(".opt_select:not(.opt_select_dmp)").first();
				
				if ($next.length) {
					// 2025-06-20 중복체크 방지용 수정
					// $next.find("input[type=radio]").prop("checked", true).trigger("change");
					const $radio = $next.find("input[type=radio]");
					if (!$radio.is(":checked")) {
						$radio.prop("checked", true).trigger("change");
					}
					$scrollOption.updateLiveRegion($wrap);
				} else {
					// 그래도 이동은 살짝
					$inner.animate(
						{
							scrollLeft: $inner.scrollLeft() + scrollAmount,
						},
						300,
						function () {
							$scrollOption.updateOptSelectButtonState($wrap);
						},
					);
				}
			});

			// 수동 스크롤 시도 시도 체크
			$inner.on("scroll", function () {
				const $wrap = $(this).closest(".opt_select_wrap");
				$scrollOption.updateOptSelectButtonState($wrap);
			});
		});
	},

	// 스크롤 시 버튼 상태 업데이트
	updateOptSelectButtonState: function($wrap) {
		const $inner = $wrap.find(".opt_select_inner");
		const scrollLeft = $inner.scrollLeft();
		const scrollWidth = $inner[0].scrollWidth;
		const clientWidth = $inner.outerWidth();

		const $btnLeft = $wrap.find(".swiper_button_left");
		const $btnRight = $wrap.find(".swiper_button_right");

		// 왼쪽 끝일 때
		if (scrollLeft <= 0) {
			$btnLeft.attr("aria-disabled", true);
		} else {
			$btnLeft.attr("aria-disabled", false);
		}

		// 오른쪽 끝일 때
		if (scrollLeft + clientWidth >= scrollWidth - 1) {
			$btnRight.attr("aria-disabled", true);
		} else {
			$btnRight.attr("aria-disabled", false);
		}
	},

	// 선택 시 스크롤 위치 보정
	bindOptSelectClickScroll: function() {
		$(".opt_select_wrap").each(function () {
			const $wrap = $(this);
			const $inner = $wrap.find(".opt_select_inner");

			$inner.find("input[type=radio]").on("change", function () {
				const $wrap = $(this).closest(".opt_select_wrap");
				const $inner = $wrap.find(".opt_select_inner");
				const $item = $(this).closest(".opt_select");
				const innerWidth = $inner.outerWidth();
				const itemOffset = $item.position().left;
				const itemWidth = $item.outerWidth();
				const scrollTo = $inner.scrollLeft() + itemOffset - innerWidth / 2 + itemWidth / 2;

				$inner.animate({ scrollLeft: scrollTo }, 300, function () {
					$scrollOption.updateOptSelectButtonState($wrap); // ← 스크롤 후 버튼 상태 갱신
				});

				$inner.addClass("active"); // ← 필요 시 상태용 클래스 추가
			});
		});
	},

	// 터치 슬라이드
	bindOptSelectTouchScroll: function() {
		$(".opt_select_wrap").each(function () {
			const $wrap = $(this);
			const $inner = $wrap.find(".opt_select_inner");
			const $items = $inner.find(".opt_select:not(.opt_select_dmp)");

			let isTouching = false;
			let touchTimeout;

			// 터치 시작
			$inner.on("touchstart", function () {
				isTouching = true;
				clearTimeout(touchTimeout);
			});

			// 터치 끝
			$inner.on("touchend", function () {
				
				const $wrap = $(this).closest(".opt_select_wrap");
				
				isTouching = false;
				// 조금 기다렸다가 스크롤 정지 후 체크
				touchTimeout = setTimeout(function () {
					$scrollOption.snapToNearestItem($wrap);
				}, 800); // 시간은 디바이스 반응에 맞춰 조절
			});
		});
	},

	// 스크롤 시 가장 가까운 아이템으로 스냅
	snapToNearestItem: function($wrap) {
		const $inner = $wrap.find(".opt_select_inner");
		const $items = $inner.find(".opt_select:not(.opt_select_dmp)");
		const innerOffsetLeft = $inner.offset().left;
		const innerCenter = innerOffsetLeft + $inner.outerWidth() / 2; // ← 화면 상 실제 중앙 좌표

		let closest = null;
		let closestDiff = Infinity;

		$items.each(function () {
			const $item = $(this);
			const itemOffsetLeft = $item.offset().left + $item.outerWidth() / 2; // ← 항목 중심 좌표
			const diff = Math.abs(innerCenter - itemOffsetLeft);

			if (diff < closestDiff) {
				closestDiff = diff;
				closest = $item;
			}
		});

		if (closest) {
			// 2025-06-20 중복체크 방지용 수정
			// closest.find("input[type=radio]").prop("checked", true).trigger("change");
			const $radio = closest.find("input[type=radio]");
			if (!$radio.is(":checked")) {
				$radio.prop("checked", true).trigger("change");
			}
		}
	},

	// 라이브 리전 업데이트
	updateLiveRegion: function($wrap) {
		const $checked = $wrap.find("input[type=radio]:checked");
		const text = $checked.closest(".opt_select").find("label").text().trim();
		$wrap.find(".opt_select_wrap_live").text(text + " 선택됨");
	}
}

$(function () {
	// 초기 실행
	$scrollOption.setDmpWidth();
	$scrollOption.initOptSelectUI(); // 페이지 로드 시
	$scrollOption.initOptSelectScrollButtons();
	$scrollOption.bindOptSelectClickScroll();
	$scrollOption.bindOptSelectTouchScroll();

	$(window).on("resize", function () {
		$scrollOption.setDmpWidth();
		$scrollOption.initOptSelectUI(); // 필요 시 리사이즈 대응
	});
});
