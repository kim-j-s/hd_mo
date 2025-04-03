(function () {
	$(function () {
		let StepNum = 0;
		stepperInit(StepNum);
		selectEvent();
		keypadEnter();
		moveStep();
	});
})();
function stepperInit(num) {
	if ($(".smp").length) {
		const totalStepCount = $(".opts_area").length;
		allStep = totalStepCount;
		$(".stepper_wrap")
			.find(".stepper")
			.attr("aria-label", `${totalStepCount}단계 중 ${num + 1}단계`);
		$(".smp").attr("data-now", num);
		motionEvent(null, num);
		stepIng(num, totalStepCount);
		return totalStepCount;
	}
	return 0;
}
function selectEvent() {
	let selectedIdx = null;
	$('.opts_area_item input[type="radio"]').on("change", function () {
		const $this = $(this);
		const idx = $this.closest(".opts_area").index();
		const data = $this.closest(".opts_area").data("pickitem");
		const selectedText = $this.next("label").find(".label_i").text();
		selectedIdx = idx + 1;
		$(".ds2_inner")
			.children("button")
			.each(function () {
				if ($(this).hasClass(data)) {
					$(this).text(selectedText);
				}
			});
		if (selectedIdx === allStep) {
			return;
		} else {
			motionEvent($this, selectedIdx);
			stepIng(selectedIdx, allStep);
		}
	});
}
function motionEvent($element, stepIdx) {
	$(".stepper_wrap")
		.find(".stepper")
		.attr("aria-label", `${allStep}단계 중 ${stepIdx + 1}단계`);
	const $ds1Items = $(".ds1").find("[data-pickitem]");
	const $smpContentItems = $(".smp_content").find("[data-pickitem]");
	$ds1Items.addClass("active");
	$smpContentItems.addClass("active");
	$ds1Items.eq(stepIdx).removeClass("active");
	$smpContentItems.eq(stepIdx).removeClass("active");
}
function stepIng(num, allStep2) {
	if (num > 0) {
		$(".stm_btn").addClass("active");
	} else {
		$(".stm_btn").removeClass("active");
	}
	const progress = Math.floor(((num + 1) / allStep2) * 100);
	$(".pgs_per").css("width", `${progress}%`);
	$(".pgs_per").toggleClass("start", progress === 0);
	$(".pgs_per").toggleClass("end", progress === 100);
	$(".smp").attr("data-now", num);
}
function keypadEnter() {
	let selectedIdx = null;
	let birthInput = "";
	$(".keypad_btn").on("click", function () {
		const $this = $(this);
		const value = $this.text().trim();
		const trgEle = $(".birth_date_field");
		const idx = $this.closest(".opts_area").index();
		selectedIdx = idx + 1;
		console.log("선택 된 현재 index 값 : ", selectedIdx);
		if ($(this).hasClass("keypad_btn_del")) {
			birthInput = birthInput.slice(0, -1);
			trgEle.text(birthInput);
		} else if ($(this).hasClass("keypad_btn_delall")) {
			birthInput = "";
			trgEle.text("").removeClass("active");
		} else {
			if (birthInput.length < 8) {
				birthInput += value;
				trgEle.text(birthInput);
			}
		}
		const getLng = trgEle.text().length;
		console.log("글자수 : ", getLng);
		if (getLng > 0) {
			trgEle.addClass("active");
		} else {
			trgEle.removeClass("active");
		}
		if (getLng === 8) {
			console.log(getLng);
			const selectedText = trgEle.text();
			const data = $this.closest(".opts_area").data("pickitem");
			$(".ds2_inner")
				.children("button")
				.each(function () {
					if ($(this).hasClass(data)) {
						$(this).text(selectedText);
					}
				});
			motionEvent($this, selectedIdx);
			stepIng(selectedIdx, allStep);
			$(".smp").attr("data-now", selectedIdx + 1);
		}
	});
}
function moveStep() {
	$(".selected_case").on("click", function () {
		const $this = $(this);
		let targetClass = $this
			.attr("class")
			.split(" ")
			.find(cls => cls !== "selected_case");
		console.log("클릭한 버튼의 추가 클래스:", targetClass);
		if (!targetClass) return;
		let targetIdx = $(".opts_area")
			.filter(function () {
				return $(this).data("pickitem") === targetClass;
			})
			.index();
		console.log("이동할 스텝 index:", targetIdx);
		if (targetIdx !== -1) {
			motionEvent(null, targetIdx);
			stepIng(targetIdx, allStep);
			$(".smp").attr("data-now", targetIdx);
		}
	});
}
