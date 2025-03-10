$(function () {
	const $showModalBtn = $(".popup_open");
	const $bottomSheet = $(".popup_wrap.bottom");
	const $sheetContent = $bottomSheet.find(".popup_container");
	const $dragIcon = $bottomSheet.find(".draggable");
	let isDragging = false,
		startY,
		startHeight,
		delta,
		newstartHeight;
	let moveValue = 0;

	const showBottomSheet = function () {
		$bottomSheet.addClass("active");
		$("body").css("overflowY", "hidden");
	};

	const updateSheetValue = data => {
		$sheetContent.css("margin-top", `${data}px`);
	};

	const hideBottomSheet = e => {
		$bottomSheet.removeClass("active");
		$("body").css("overflowY", "auto");
		updateSheetValue(0);
	};

	const dragStart = e => {
		isDragging = true;
		startY = e.pageY || e.originalEvent.touches?.[0].pageY;
		startHeight = parseInt($sheetContent.css("height"));
		newstartHeight = (startHeight / window.innerHeight) * 100;

		console.log("시작위치 : " + startY);

		$bottomSheet.addClass("dragging");
		$(".draggable").attr("aria-grabbed", "true");
	};

	const dragging = e => {
		if (!isDragging) return;
		delta = startY - (e.pageY || e.touches?.[0].pageY);
		const newHeight = ((startHeight + delta) / window.innerHeight) * 100;
		const newDelta = Math.abs(newHeight);

		moveValue = Math.abs(delta);
		if (delta < 0) {
			updateSheetValue(moveValue);
		}
	};

	const dragStop = () => {
		isDragging = false;
		$bottomSheet.removeClass("dragging");
		const contentH = $sheetContent.height(),
			winH = $(window).height(),
			sheetHeight = parseInt((contentH / winH) * 100);

		console.log("dalta :" + delta, "moveValue : " + moveValue);

		if (delta <= -50) {
			hideBottomSheet();
		} else if (delta > -50) {
			updateSheetValue(0);
		} else {
			updateSheetValue(moveValue);
		}
		$(".draggble").attr("aria-grabbed", "false");
	};

	$dragIcon.on("mousedown", dragStart);
	$(document).on("mousemove", dragging);
	$(document).on("mouseup", dragStop);
	$dragIcon.on("touchstart", dragStart);
	// $(document).on('touchmove', dragging);
	document.addEventListener("touchmove", dragging);
	$(document).on("touchend", dragStop);

	// $showModalBtn.on('click', showBottomSheet);
});
