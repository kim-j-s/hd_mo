(function () {
	$(function () {
		const $stepSelect = $("button");
		$stepSelect.on("click", function () {
			$("#a1").addClass("down");
			$("#a2").removeClass("down");
		});
	});
	stepperInit();
	console.log("xx");
	console.log("xx");
	console.log("xx");
})();
function stepperInit() {
	if ($(".smp").length) {
		console.log("stepperInit");
	}
}
