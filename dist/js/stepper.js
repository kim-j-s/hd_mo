(function () {
	$(function () {
		stepperInit();
		selectEvent();
	});
})();
function stepperInit() {
	if ($(".smp").length) {
		console.log("stepperInit");
	}
}
function selectEvent() {
	let thisPosition = null;
	$('.opts_area_item input[type="radio"]').on("change", function () {
		const data = $(this).closest(".opts_area").data("pickitem");
		const selectedText = $(this).next("label").find(".label_i").text();
		thisPosition = $(this);
		console.log("선택된 값: ", selectedText);
		console.log("선택된 data: ", data);
		$(".ds2_inner")
			.children("button")
			.each(function () {
				if ($(this).hasClass(data)) {
					$(this).text(selectedText);
				}
			});
		motionEvent(thisPosition);
	});
}
function motionEvent(t) {
	console.log(t);
	const parentElement = t.closest(".opts_area_item");
	console.log("선택된 항목의 부모 요소:", parentElement);
	$("#a1").addClass("active");
	$("#a2").removeClass("active");
	$("#a3").addClass("active");
	$("#a4").removeClass("active");
}
