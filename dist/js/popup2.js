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
		//popup active
		this.isOpen = true;
		$("body").css("overscroll-behavior", "contain");
		$("body").addClass("scroll_lock");
		this.$target.addClass("active");

		// bottom 팝업일 경우 - drag
		if (this.$target.hasClass("bottom")) {
			draggable(this.$target);
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

		const focusTarget = this.$header || this.$content;
		this.focusMove(focusTarget);
	}

	//focus 이동
	focusMove(target) {
		if (!target) return;
		const $focusTarget = target;

		const activePopups = $(".popup_wrap2.active").not(this.$target);

		// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
		$focusTarget.css("display", "none");
		$focusTarget[0].offsetHeight; //강제 reflow
		$focusTarget.css("display", "block");

		setTimeout(() => {
			$focusTarget.focus();
			$focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

			setTimeout(() => {
				$focusTarget.attr("aria-live", null);
			}, 450);

			if (this.isOpen && activePopups.length > 0) {
				activePopups.attr("aria-hidden", "true");
				activePopups.find(".popup_inner").attr("aria-hidden", "true");
			} else if (!this.isOpen) {
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

		const $prevPopup = this.$triggerEl.closest(".popup_wrap2.active");
		if ($prevPopup) {
			const $prevHeader = $($prevPopup).find(".popup_head").length > 0 ? $($prevPopup).find(".popup_head") : null;
			const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

			$($prevPopup).attr("aria-hidden", "false");
			$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");
			const focusTarget = $prevHeader || $prevContent;
			this.focusMove(focusTarget);
		} else {
			$(".wrap").attr("aria-hidden", "false");
			$("body").css("overscroll-behavior", "auto");
			$("body").removeClass("scroll_lock");

			setTimeout(() => {
				this.$triggerEl.focus();
			}, 400);
		}
	}
}

function openPop2($triggerEl, target) {
	const myPopup = new HD_Popup($triggerEl, target);
	myPopup.init();
}
