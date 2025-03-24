/* Popup 관련 */
// Popup 열기
function openPop($triggerEl, target) {
	const $target = $("#" + target);

	if ($target.length) {
		const getOpenerId = $($triggerEl).attr("triggerId");
		let openerId;

		if (!getOpenerId) {
			openerId = generateUUID();
			$($triggerEl).attr("triggerId", openerId);
		} else {
			openerId = getOpenerId;
		}

		$target.attr("opner", openerId);
		$("body").css("overscroll-behavior", "contain");
		$target.addClass("active");

		//렌더링 후, focus 이동
		setTimeout(function () {
			$target.find(".popup_inner").attr("tabindex", "0").focus();
			$(".wrap").addClass("scroll_lock").attr("aria-hidden", true);
			$(".popup_wrap.active").attr("aria-hidden", true);
			$target.attr("aria-hidden", false);
		}, 200);
	}

	// bottom 팝업 - drag
	if ($target.hasClass("bottom")) {
		draggable($target);
	}
}

// Popup 닫기
function closePop(target) {
	const $target = $("#" + target);
	const $opener = $('[triggerId="' + $target.attr("opner") + '"]');

	if ($target.hasClass("active")) {
		$target.removeClass("active").attr("opner", null);

		// console.log('closePop')

		const $lastPopup = $(".popup_wrap.active:last");
		if ($lastPopup.length) {
			$lastPopup.attr("aria-hidden", false);
			setTimeout(function () {
				$lastPopup.find(".popup_inner").attr("tabindex", "0").focus();
			}, 400);
		}

		// $target.removeClass('active').attr('aria-hidden', true);
		$target.attr("aria-hidden", true);
		$target.find(".popup_inner").removeAttr("tabindex");
		$("body").removeAttr("style");

		// const popup_count = $('.popup_wrap[aria-hidden="false"]').length;
		const popup_count = $(".popup_wrap.active").length;
		if (popup_count <= 0) {
			$(".wrap").removeClass("scroll_lock").attr("aria-hidden", false);
			setTimeout(() => {
				$opener.focus();
			}, 400);
		}
	}
}

// 팝업 영역 외 클릭 시 팝업 닫기
function dimClick() {
	$(document).on("click", ".popup_wrap", function (e) {
		const $target = $(e.target);
		const $close_popup = $('.popup_wrap.active[aria-hidden="false"] .popup_inner');

		if (!$target.closest($close_popup).length) {
			const $targetId = $target.closest(".popup_wrap").attr("id");
			closePop($targetId);
		}
	});
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

$(function () {
	dimClick();
});
