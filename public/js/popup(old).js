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
		this.$header = this.$target.find(".popup_head_title").length > 0 ? this.$target.find(".popup_head_title") : null;
		this.$content = this.$target.find(".popup_cont").length > 0 ? this.$target.find(".popup_cont") : null;
	}

	init() {
		

		if($(".wrap").attr("aria-hidden")==undefined || $(".wrap").attr("aria-hidden")=='false'){
			$(".wrap").attr("aria-hidden", "true");
			$(".wrap").attr("inert",'');
		}

		console.log(this.$target.find(".popup_head_title"))

		
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

		const hasTitle = this.$header&&this.$header.text().trim() !=='';
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
			const $prevHeader = $($prevPopup).find(".popup_head_title").length > 0 ? $($prevPopup).find(".popup_head_title") : null;
			const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

			$($prevPopup).attr("aria-hidden", "false");
			$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");

			const hasTitle = $prevHeader&&$prevHeader.text().trim() !=='';
			const focusTarget = hasTitle ? $prevHeader : $prevContent;
			focusTarget.attr("data-returnTarget",true);
			this.focusMove(focusTarget);

			//팝업을 동적으로 생성하는 케이스에서만 사용
			if(window.popupGroup) {
				setTimeout(()=>{ this.$target.remove()},1000);
			}
		} else {
			$(".wrap").attr("aria-hidden", "false");
			$(".wrap").removeAttr('inert');
			$("body").css("overscroll-behavior", "auto");
			$("body").removeClass("scroll_lock");

			setTimeout(() => {
				this.$triggerEl.focus();

				//팝업을 동적으로 생성하는 케이스에서만 사용
				if(window.popupGroup) {
					setTimeout(()=>{ this.$target.remove()},0)	
				}		
			}, 400);
		}
	}
}

function openPop($triggerEl, target) {

	let delayTime = 0;

	//팝업을 동적으로 생성하는 케이스에서만 사용
	if(window.popupGroup) {
		//popup dom을 동적으로 body에 add
		attachPopup(target);
		delayTime = 0.5;
	}
	const myPopup = new HD_Popup($triggerEl, target);
	setTimeout(() => {myPopup.init();},delayTime);	
}



//동적 append 테스트용 함수
function attachPopup (newPopup) {
	const popupArea = $('.popup_area');
	popupArea.append(window.popupGroup[newPopup]);
}



/*****************/
/* 팝업을 호출하는 페이지에 붙이는 함수 */
/*****************/

{/* <script>
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
</script> */}




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