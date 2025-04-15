/* Popup 관련 */

class HD_Popup {
	$triggerEl;
	$target;
	$header; //타이틀
	$content; //본문
	$popup_dim;
	$closeBtn;

	constructor($triggerEl, target) {
		this.$target = $("#" + target);
		this.$popup_dim = this.$target.find(".popup_dim");
		this.$triggerEl = $triggerEl;
		this.$closeBtn = this.$target.find(".popup_close");
		this.$header = this.$target.find(".popup_head_title").length > 0 ? this.$target.find(".popup_head_title") : null;
		this.$content = this.$target.find(".popup_cont").length > 0 ? this.$target.find(".popup_cont") : null;
	}

	//focus 이동
	focusMove(target) {
		if (!target) return;
		const $focusTarget = target;

		const activePopups = $(".popup_wrap.active").not(this.$target);

		// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
		$focusTarget.css("display", "none");
		$focusTarget[0].offsetHeight; //강제 reflow
		$focusTarget.css("display", "block");

		setTimeout(() => {
			$focusTarget.focus();
			$focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

			setTimeout(() => {
				$focusTarget.attr("aria-live", null);
			}, 500);

			if (this.isOpen && activePopups.length > 0) {
				activePopups.attr("aria-hidden", "true");
				activePopups.find(".popup_inner").attr("aria-hidden", "true");
			} else if (!this.isOpen && activePopups.length > 0) {
				this.$target.attr("aria-hidden", "true");
				this.$target.find(".popup_inner").attr("aria-hidden", "true");
			}
		}, 400);
	}

	//close popup
	close(event) {
		this.$target = $("#" + target);
		this.$popup_dim = this.$target.find(".popup_dim");
		this.$triggerEl = $triggerEl;
		this.$closeBtn = this.$target.find(".popup_close");
		this.$header = this.$target.find(".popup_head_title").length > 0 ? this.$target.find(".popup_head_title") : null;
		this.$content = this.$target.find(".popup_cont").length > 0 ? this.$target.find(".popup_cont") : null;
		this.$target.removeClass("active");

		if (event) {
			event.currentTarget.blur();
			event.target.blur();
		}

		const $prevPopup = this.$triggerEl.closest(".popup_wrap.active");
		if ($prevPopup) {
			const $prevHeader = $($prevPopup).find(".popup_head_title").length > 0 ? $($prevPopup).find(".popup_head_title") : null;
			const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

			$($prevPopup).attr("aria-hidden", "false");
			$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");

			const hasTitle = $prevHeader && $prevHeader.text().trim() !== "";
			const focusTarget = hasTitle ? $prevHeader : $prevContent;
			focusTarget.attr("data-returnTarget", true);

			const activePopups = $(".popup_wrap.active").not(this.$target);

			// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
			focusTarget.css("display", "none");
			focusTarget[0].offsetHeight; //강제 reflow
			focusTarget.css("display", "block");

			setTimeout(() => {
				focusTarget.focus();
				focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

				setTimeout(() => {
					focusTarget.attr("aria-live", null);
				}, 500);

				if (activePopups.length > 0) {
					this.$target.attr("aria-hidden", "true");
					this.$target.find(".popup_inner").attr("aria-hidden", "true");
				}
			}, 400);

			//팝업을 동적으로 생성하는 케이스에서만 사용
			if (window.popupGroup) {
				setTimeout(() => {
					this.$target.remove();
				}, 1000);
			}
		} else {
			$(".wrap").attr("aria-hidden", "false");
			$(".wrap").removeAttr("inert");
			$("body").css("overscroll-behavior", "auto");
			$("body").removeClass("scroll_lock");

			setTimeout(() => {
				this.$triggerEl.focus();

				//팝업을 동적으로 생성하는 케이스에서만 사용
				if (window.popupGroup) {
					setTimeout(() => {
						this.$target.remove();
					}, 0);
				}
			}, 400);
		}
	}
}

function openHDPopup($triggerEl, target) {
	if (!target.length) return;

	// s: 개발단에서는 지우고 사용하세요.
	attachPopup(target);
	// e: 개발단에서는 지우고 사용하세요.

	let $target = $("#" + target);
	let $popup_dim = $target.find(".popup_dim");
	let $header = $target.find(".popup_head_title").length > 0 ? $target.find(".popup_head_title") : null;
	let $content = $target.find(".popup_cont").length > 0 ? $target.find(".popup_cont") : null;

	const getOpenerId = $($triggerEl).attr("triggerId");
	let openerId;

	if (!getOpenerId) {
		openerId = generateUUID();
		$($triggerEl).attr("triggerId", openerId);
	} else {
		openerId = getOpenerId;
	}

	$target.attr("opner", openerId);

	if ($(".wrap").attr("aria-hidden") == undefined || $(".wrap").attr("aria-hidden") == "false") {
		$(".wrap").attr("aria-hidden", "true");
		$(".wrap").attr("inert", "");
	}

	//popup active
	$("body").css("overscroll-behavior", "contain");
	$("body").addClass("scroll_lock");
	$target.addClass("active");

	// bottom 팝업일 경우 - drag
	if ($target.hasClass("bottom")) {
		draggable($target);
	}

	//To-Do: 추후 핸들바에 close함수 붙이기
	//닫기버튼 이벤트리스너 추가
	// $target.find(".popup_close").on("click", () => {
	// 	closeHDPopup($triggerEl, target);
	// });

	// //dim 클릭 시 팝업 닫기
	// $popup_dim.on("click", () => {
	// 	closeHDPopup($triggerEl, target);
	// });

	$target.attr("aria-hidden", "false");
	$target.find(".popup_inner").attr("tabindex", 0).attr("aria-hidden", "false");

	if ($header) $header.attr("tabindex", 0);
	if ($content) $content.attr("tabindex", 0);

	const focusTarget = $header || $content;

	const activePopups = $(".popup_wrap.active").not($target);
	focusTarget.css("display", "none");
	focusTarget[0].offsetHeight; //강제 reflow
	focusTarget.css("display", "block");

	setTimeout(() => {
		focusTarget.focus();
		focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

		setTimeout(() => {
			focusTarget.attr("aria-live", null);
		}, 500);

		if (activePopups.length > 0) {
			activePopups.attr("aria-hidden", "true");
			activePopups.find(".popup_inner").attr("aria-hidden", "true");
		}
	}, 400);
}

//동적으로 popup을 append하는 경우에 사용
function openPop($triggerEl, target) {
	const myPopup = new HD_Popup($triggerEl, target);
	setTimeout(() => {
		myPopup.init();
	}, 0.5);
}

/**
 * closeHDPopup
 * - 동적으로 popup을 append하는 경우에 사용
 * @param {string} target (필수)close할 popup id
 * @param {object} returnTarget (선택)팝업이 닫힌 뒤에 포커스할 엘리먼트(하단에 다른 팝업이 존재할 경우 사용x)
 * @returns {void}
 */
function closeHDPopup(target, returnTarget = null) {
	let $target = $("#" + target);
	console.log("$target", $target);

	const $opener = $('[triggerId="' + $target.attr("opner") + '"]');

	const $triggerEl = returnTarget ? returnTarget : $opener;

	$target.removeClass("active");

	//하단에 다른 팝업이 열려있는 경우, 가장 최근 팝업으로 focus강제 이동
	const $prevPopup = $(".popup_wrap.active:last");
	if ($prevPopup.length > 0) {
		console.log("$prevPopup 있음", $prevPopup);
		const $prevHeader = $($prevPopup).find(".popup_head_title").length > 0 ? $($prevPopup).find(".popup_head_title") : null;
		const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

		$($prevPopup).attr("aria-hidden", "false");
		$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");

		const focusTarget = $prevHeader || $prevContent;
		focusTarget.attr("data-returnTarget", true);

		// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
		focusTarget.css("display", "none");
		focusTarget[0].offsetHeight; //강제 reflow
		focusTarget.css("display", "block");

		setTimeout(() => {
			focusTarget.focus();
			focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

			setTimeout(() => {
				focusTarget.attr("aria-live", null);
			}, 500);

			$target.attr("aria-hidden", "true");
			$target.find(".popup_inner").attr("aria-hidden", "true");
		}, 400);

		//팝업을 동적으로 생성하는 케이스에서만 사용
		if (window.popupGroup) {
			setTimeout(() => {
				$target.remove();
			}, 1000);
		}
	} else {
		console.log("$prevPopup없음!!");
		$(".wrap").attr("aria-hidden", "false");
		$(".wrap").removeAttr("inert");
		$("body").css("overscroll-behavior", "auto");
		$("body").removeClass("scroll_lock");

		setTimeout(() => {
			$triggerEl.focus();

			//팝업을 동적으로 생성하는 케이스에서만 사용
			if (window.popupGroup) {
				setTimeout(() => {
					$target.remove();
				}, 0);
			}
		}, 400);
	}
}

//동적 append 테스트용 함수
function attachPopup(newPopup) {
	const popupArea = $(".popup_area");
	popupArea.append(window.popupGroup[newPopup]);
}

// UUID생성
function generateUUID() {
	var d = new Date().getTime();
	var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}

/*****************/
/* 팝업을 호출하는 페이지에 붙이는 함수 */
/*****************/

{
	/* <script>
	window.onload = function(){	

	//Full 팝업
	window.popupGroup.pop_type01 = `<div class="popup_wrap full" id="pop_type01" role="dialog" aria-hidden="true">
				<div class="popup_container">
					<div class="popup_dim" aria-hidden="true"></div>
					<div class="popup_inner">
						<div class="popup_head"><div class="popup_head_title">팝업 타이틀</div></div>
						<div class="popup_cont">
							<div class="popup_content">
								<!-- s: popup_content_top -->
								<div class="popup_content_top">
									<h2 class="title_h2">타이틀영역</h2>
								</div>
								<!-- e: popup_content_top -->

								팝업내용입니다
								<br />
								내용
							</div>
						</div>
						<div class="popup_bottom">
							<!-- s: 꼭 알아두세요 -->
							<div class="bottom_fix_notice">
								<div class="acd_item">
									<div class="acd_head">
										<button type="button" class="acd_btn" aria-expanded="false"><span>꼭 알아두세요</span></button>
									</div>
									<div class="acd_cont">
										<div class="inner">
											<ul>
												<li>내용1</li>
												<li>내용2</li>
												<li>내용3</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<!-- e: 꼭 알아두세요 -->
							<div class="btn_area">
								<button type="button" class="hd_btn hd_btn_ty_3 hd_btn_s_2">
									<span class="text">취소</span>
								</button>
								<button type="button" class="hd_btn hd_btn_ty_1 hd_btn_s_2">
									<span class="text">확인</span>
								</button>
							</div>
						</div>
						<button type="button" class="popup_close"><span class="blind">팝업 닫기</span></button>
					</div>
				</div>
			</div>`;

	}
</script> */
}

/* Toast 팝업 */
let toastTimer = null;
function toastAction(click) {
	const $toast = $(".toast_wrap"),
		msg = $(click).data("msg");

	if (toastTimer != undefined) return;
	// console.log(toastTimer);

	$toast.find(".toast_msg").text("");
	toastMsg(msg);
	$toast.addClass("active");

	// clearTimeout(toastTimer);

	toastTimer = setTimeout(function () {
		$toast.removeClass("active");
		toastTimer = undefined;
	}, 1200);
}

function toastMsg(msg) {
	// const text = $('<div class='toast_msg'></div>').text(msg);
	$(".toast_msg").text(msg);
}
