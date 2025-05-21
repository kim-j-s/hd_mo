function draggable(caller) {
	const _caller = caller;

	const $sheetContent = _caller.find(".popup_container");
	const $dragIcon = _caller.find(".draggable");
	let isDragging = false,
		startY,
		startHeight,
		delta = 0,
		newstartHeight;
	let moveValue = 0;

	function updateSheetValue(data) {
		$sheetContent.css("margin-top", `${data}px`);
	}

	function hideBottomSheet() {
		//팝업 초기화
		// updateSheetValue(0);
		$sheetContent.removeProp("style");
		//드래그한 값 초기화
		delta = 0;

		// 팝업의 id를 target으로 전달
		const targetId = _caller.attr("id");
		closeHDPopup(targetId);
	}

	function dragStart(e) {
		isDragging = true;
		// 드래그 시작 위치
		startY = e.pageY || e.originalEvent.touches?.[0].pageY;
		// console.log('시작위치 : '+ startY)

		_caller.addClass("dragging");
		$dragIcon.attr("aria-grabbed", "true");
	}

	function dragging(e) {
		if (!isDragging) return;
		//드래그한 시작 위치와 현재위치 차이
		delta = startY - (e.pageY || e.touches?.[0].pageY);
		moveValue = Math.abs(delta);

		// 드래그한 값만큼 움직이기
		if (delta < 0) {
			updateSheetValue(moveValue);
		}
		// console.log(moveValue);
	}

	function dragStop(e) {
		isDragging = false;
		_caller.removeClass("dragging");
		const contentH = $sheetContent.height(),
			winH = $(window).height(),
			sheetHeight = parseInt((contentH / winH) * 100);
		// console.log('dalta :'+ delta, 'moveValue : ' + moveValue);

		// 드래그한 값이 50 이상이면 팝업 닫기
		if (delta <= -50) {
			hideBottomSheet();
			// 드래그한 값이 50 이하면 팝업 초기화
		} else {
			updateSheetValue(0);
		}
		$dragIcon.attr("aria-grabbed", "false");
		// console.log(delta);
	}

	document.addEventListener("touchmove", dragging);
	$dragIcon.on({
		mousedown: dragStart,
		touchstart: dragStart,
	});
	$(document).on({
		mousemove: dragging,
		// 'touchmove' : dragging,
		mouseup: dragStop,
		touchend: dragStop,
	});
}
