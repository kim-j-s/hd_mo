/* Popup 관련 */

class HD_Popup {
	$triggerEl;
	$target;
	$header; //타이틀
	$content; //본문
	$popup_dim;
	isOpen; // trigger 할 상태
	$closeBtn;
	count;

	constructor($triggerEl, target) {
		this.isOpen = false;
		this.$target = $("#" + target);
		this.$popup_dim = this.$target.find(".popup_dim");
		this.$triggerEl = $triggerEl;
		this.$closeBtn = this.$target.find(".popup_close");
		this.$header = this.$target.find(".popup_head").length > 0 ? this.$target.find(".popup_head") : null;
		this.$content = this.$target.find(".popup_cont").length > 0 ? this.$target.find(".popup_cont") : null;
	}

	init() {
		if ($(".wrap").attr("aria-hidden") == undefined || $(".wrap").attr("aria-hidden") == "false") {
			$(".wrap").attr("aria-hidden", "true");
			$(".wrap").attr("inert", "");
		}

		//popup active
		this.isOpen = true;
		$("body").css("overscroll-behavior", "contain");
		$("body").addClass("scroll_lock");
		this.$target.addClass("active");

		// bottom 팝업일 경우 - drag
		if (this.$target.hasClass("bottom")) {
			draggable(this);
		}

		//닫기버튼 이벤트리스너 추가
		this.$target.find(".popup_close").on("click", e => {
			this.close(e);
		});

		//dim 클릭 시 팝업 닫기
		this.$popup_dim.on("click", e => {
			this.close(e);
		});

		this.$target.attr("aria-hidden", "false");
		this.$target.find(".popup_inner").attr("tabindex", 0).attr("aria-hidden", "false");

		if (this.$header) this.$header.attr("tabindex", 0);
		if (this.$content) this.$content.attr("tabindex", 0);

		const hasTitle = this.$header && this.$header.text().trim() !== "";
		const focusTarget = hasTitle ? this.$header : this.$content;
		this.focusMove(focusTarget);
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
		this.isOpen = false;
		this.$target.removeClass("active");

		if (event) {
			event.currentTarget.blur();
			event.target.blur();
		}

		const $prevPopup = this.$triggerEl.closest(".popup_wrap.active");
		if ($prevPopup) {
			const $prevHeader = $($prevPopup).find(".popup_head").length > 0 ? $($prevPopup).find(".popup_head") : null;
			const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

			$($prevPopup).attr("aria-hidden", "false");
			$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");
<<<<<<< HEAD
			$($prevPopup).find(".popup_inner").removeAttr("inert");
=======
>>>>>>> 7cd71a126ff0335446f86183118081d8e5fe799c

			const hasTitle = $prevHeader && $prevHeader.text().trim() !== "";
			const focusTarget = hasTitle ? $prevHeader : $prevContent;
			focusTarget.attr("data-returnTarget", true);
			this.focusMove(focusTarget);

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

function openPop($triggerEl, target) {
	//팝업을 동적으로 생성하는 케이스에서만 사용
	if (window.popupGroup) {
		//popup dom을 동적으로 body에 add
		attachPopup(target);
	}
	const myPopup = new HD_Popup($triggerEl, target);
	myPopup.init();
}

//동적 append 테스트용 함수
function attachPopup(newPopup) {
	const popupArea = $(".popup_area");
	popupArea.append(window.popupGroup[newPopup]);
}

/*****************/
/* 팝업을 호출하는 페이지에 붙이는 함수 */
/*****************/

{
	/* <script>
	window.onload = function(){	
	//팝업 DOM을 string으로 저장
	window.popupGroup = {};

	window.addEventListener('unload', function() {
		window.popupGroup = null;
	  });

	//Full 팝업
	window.popupGroup.pop_type01 = `<div class="popup_wrap full" id="pop_type01" role="dialog" aria-hidden="true">
				<div class="popup_container">
					<div class="popup_dim" aria-hidden="true"></div>
					<div class="popup_inner">
						<div class="popup_head">팝업 타이틀</div>
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


	//Layer 팝업
	window.popupGroup.pop_type02 = `<div class="popup_wrap layer" id="pop_type02" role="dialog" aria-hidden="true">
				<div class="popup_container">
					<div class="popup_dim" aria-hidden="true"></div>
					<div class="popup_inner">
						<div class="popup_head">팝업 타이틀</div>
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


	//pop_type03
	window.popupGroup.pop_type03 = `<div class="popup_wrap bottom" id="pop_type03" role="dialog" aria-modal="true" aria-hidden="true">
				<div class="popup_container">
					<div class="popup_dim" aria-hidden="true"></div>
					<div class="popup_inner">
						<div class="draggable" aria-hidden="true">
							<div class="move"></div>
						</div>
						<div class="popup_head">팝업 타이틀</div>
						<div class="popup_cont">
							<div class="popup_content">
								<!-- s: popup_content_top -->
								<div class="popup_content_top">
									<h2 class="title_h2">타이틀영역</h2>
								</div>
								<!-- e: popup_content_top -->
								팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								내용 팝업내용입니다
								<br />
								팝업내용입니다
							</div>
						</div>
						<div class="popup_bottom">
							<div class="btn_area">
								<button type="button" class="hd_btn hd_btn_ty_2 hd_btn_s_2">
									<span class="text">확인</span>
								</button>
								<button type="button" class="hd_btn hd_btn_ty_1 hd_btn_s_2" onclick="openPop(this,'pop_type04');" title="Bottom 팝업열기">
									<span class="text">Bottom 팝업열기</span>
								</button>
							</div>
						</div>
						<button type="button" class="popup_close"><span class="blind">팝업 닫기</span></button>
					</div>
				</div>
			</div>`;
			

		//pop_type04
		window.popupGroup.pop_type04 = `<div class="popup_wrap bottom" id="pop_type04" role="dialog" aria-modal="true" aria-hidden="true">
			<div class="popup_container">
				<div class="popup_dim" aria-hidden="true"></div>
				<div class="popup_inner">
					<div class="draggable" aria-hidden="true">
						<div class="move"></div>
					</div>
					<div class="popup_head"></div>
					<div class="popup_cont">
						<div class="popup_content">
							<!-- s: popup_content_top -->
							<div class="popup_content_top">
								<h2 class="title_h2">타이틀영역</h2>
							</div>
							<!-- e: popup_content_top -->
							팝업내용입니다
							<br />
							내용 팝업내용입니다
							<br />
							팝업내용입니다
							<br />
							내용 팝업내용입니다
							<br />
							내용 팝업내용입니다
							<br />
							내용 팝업내용입니다
							<br />
						</div>
					</div>
					<div class="popup_bottom">
						<div class="btn_area">
							<button type="button" class="hd_btn hd_btn_ty_2 hd_btn_s_2">
								<span class="text">확인</span>
							</button>
							<button type="button" class="hd_btn hd_btn_ty_1 hd_btn_s_2" onclick="openPop(this,'pop_type05');" title="Bottom 팝업열기">
								<span class="text">Bottom 팝업열기</span>
							</button>
						</div>
					</div>
					<button type="button" class="popup_close"><span class="blind">팝업 닫기</span></button>
				</div>
			</div>
		</div>`;


		//pop_type05
		window.popupGroup.pop_type05 = `<div class="popup_wrap bottom" id="pop_type05" role="dialog" aria-modal="true" aria-hidden="true">
			<div class="popup_container">
				<div class="popup_dim" aria-hidden="true"></div>
				<div class="popup_inner">
					<div class="draggable" aria-hidden="true">
						<div class="move"></div>
					</div>
					<div class="popup_head">팝업 타이틀</div>
					<div class="popup_cont">
						<div class="popup_content">
							<div class="opt_select_list opt_case1">
								<div role="button" class="option active" title="선택됨"><span class="text">K7 Premier 2.5 GDI</span></div>
								<div role="button" class="option"><span class="text">K7 Premier 2.5 GDI</span></div>
								<div role="button" class="option"><span class="text">K7 Premier 2.5 GDI</span></div>
								<div role="button" class="option"><span class="text">K7 Premier 2.5 GDI</span></div>
								<div role="button" class="option"><span class="text">K7 Premier 2.5 GDI</span></div>
								<div role="button" class="option"><span class="text">K7 Premier 2.5 GDI</span></div>
							</div>
						</div>
					</div>
					<div class="popup_bottom">
						<div class="btn_area">
							<button type="button" class="hd_btn hd_btn_ty_1 hd_btn_s_2">
								<span class="text">확인</span>
							</button>
						</div>
					</div>
					<button type="button" class="popup_close"><span class="blind">팝업 닫기</span></button>
				</div>
			</div>
		</div>`;

	//pop_type06
	window.popupGroup.pop_type06 = `<div class="popup_wrap bottom" id="pop_type06" role="dialog" aria-modal="true" aria-hidden="true">
				<div class="popup_container">
					<div class="popup_dim" aria-hidden="true"></div>
					<div class="popup_inner">
						<div class="draggable" aria-hidden="true">
							<div class="move"></div>
						</div>
						<div class="popup_head">팝업 타이틀</div>
						<div class="popup_cont">
							<div class="popup_content">
								<div class="input_text">
									<div class="inp">
										<input type="text" placeholder="추가부속품 명을 입력해 보세요" title="추가부속품 명을 입력해 보세요" />
										<button type="button" class="del"><span class="blind">텍스트 삭제</span></button>
									</div>
								</div>
								<div class="opt_select_list opt_case2">
									<div role="button" class="option active" title="선택됨">
										<span class="text">
											<span class="point">4륜</span>
											구동
										</span>
									</div>
									<div role="button" class="option"><span class="text">ABS</span></div>
									<div role="button" class="option"><span class="text">Around View Monitor 패키지(단품)</span></div>
									<div role="button" class="option fixed"><span class="text">Around View Monitor 패키지(직접입력)</span></div>
									<div role="button" class="option"><span class="text">ECM 사이드/룸미러</span></div>
									<div role="button" class="option"><span class="text">Head Up Display</span></div>
								</div>
							</div>
						</div>
						<div class="popup_bottom">
							<div class="btn_area">
								<button type="button" class="hd_btn hd_btn_ty_1 hd_btn_s_2">
									<span class="text">확인</span>
								</button>
							</div>
						</div>
						<button type="button" class="popup_close"><span class="blind">팝업 닫기</span></button>
					</div>
				</div>
			</div>`;


	//pop_type07
	window.popupGroup.pop_type07 = `<div class="popup_wrap bottom" id="pop_type07" role="dialog" aria-modal="true" aria-hidden="true">
			<div class="popup_container">
				<div class="popup_dim" aria-hidden="true"></div>
				<div class="popup_inner">
					<div class="draggable" aria-hidden="true">
						<div class="move"></div>
					</div>
					<div class="popup_head">팝업 타이틀</div>
					<div class="popup_cont">
						<div class="popup_content">
							<div class="opt_select_list opt_case3">
								<div role="button" class="option active" title="선택됨"><span class="text">항목 1</span></div>
								<div role="button" class="option"><span class="text">항목 2</span></div>
								<div role="button" class="option"><span class="text">항목 3</span></div>
								<div role="button" class="option"><span class="text">항목 4</span></div>
								<div role="button" class="option"><span class="text">항목 5</span></div>
								<div role="button" class="option"><span class="text">항목 6</span></div>
							</div>
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
