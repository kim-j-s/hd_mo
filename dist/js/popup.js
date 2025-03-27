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

		console.log("현재팝업 open");
		$target.attr("opner", openerId);

		$target.addClass("active");

		//렌더링 후, focus 이동
		setTimeout(function () {
			const $pop_header = $target.find(".popup_inner").children(".popup_head"),
				$pop_cont = $target.find(".popup_inner").children(".popup_cont");

			if ($pop_header.length) {
				$pop_header.attr("tabindex", "0").focus();
			} else {
				$pop_cont.attr("tabindex", "0").focus();
			}
			// $target.find('.popup_inner').attr('tabindex', '0').focus();
			$(".popup_wrap.active").attr("aria-hidden", true);
			$(".wrap").attr("aria-hidden", true);
			$target.attr("aria-hidden", false);
			console.log("현재팝업 focus");
		}, 0);
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
		$target.attr("aria-hidden", true);
		console.log("현재팝업 close");
	}

	$opener.focus();
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

function focusTest() {
	// $(document).on('focus', '*', function() {
	// 	var element = this;

	// 	if (element.tagName === 'a' || element.tagName === 'button' || element.className === 'popup_head' || element.className === 'popup_cont' || element.className === 'popup_inner' || element.className === 'btn' ) {
	// 		console.log('포커스된 입력 값:', element);
	// 	}
	// });

	document.addEventListener("focusin", function () {
		const focusedElement = document.activeElement.className;
		const classNameDiv = document.querySelector(".header_title");
		// classNameDiv.textContent = focusedElement; // class명을 텍스트로 설정
	});
}
