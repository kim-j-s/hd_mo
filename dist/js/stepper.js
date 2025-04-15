(function () {
	$(function () {
		// 현재 스텝 상태
		let StepNum = 0;

		// 전체 스텝
		let allStep = stepperInit(StepNum);

		// 선택 이벤트
		selectEvent();

		// keypad 이벤트
		keypadEnter();

		// 선택 된 요소의 스텝으로 이동
		moveStep();

		// 이전스텝 이동
		// stepNext();

		// 다음스텝 이동
		// moveStep();
	});
})();

function stepperInit(num) {
	if ($(".smp").length) {
		// console.log(num);
		const totalStepCount = $(".opts_area").length;
		allStep = totalStepCount;
		$(".stepper_wrap")
			.find(".stepper")
			.attr("aria-label", `${totalStepCount}단계 중 ${num + 1}단계`);
		$(".smp").attr("data-now", num);

		// 선택된 항목 활성화
		motionEvent(null, num);

		// stepIng 호출
		stepIng(num, totalStepCount);

		// 전체 스텝 수 반환
		return totalStepCount;
	}
	return 0;
}

// 선택 이벤트
function selectEvent() {
	// console.log('selectEvent');
	let selectedIdx = null;
	$('.opts_area_item input[type="radio"]').on("change", function () {
		const $this = $(this);
		const idx = $this.closest(".opts_area").index();
		const data = $this.closest(".opts_area").data("pickitem");
		const selectedText = $this.next("label").find(".label_cont").text();

		// 선택 된 현재 index 값
		selectedIdx = idx + 1;
		// console.log('selectEvent : 선택 된 현재 index 값 : ', selectedIdx);

		// 선택된 값 콘솔 출력
		// console.log(`선택된 값: ${selectedText}, 선택된 data: ${data}`);

		// UI 업데이트
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
			// 선택된 항목 활성화
			motionEvent($this, selectedIdx);

			// stepper 진행 업데이트
			stepIng(selectedIdx, allStep);
		}
	});
}

// 선택된 항목 활성화
function motionEvent($element, stepIdx) {
	// console.log('motionEvent : stepIdx : ', stepIdx);

	$(".stepper_wrap")
		.find(".stepper")
		.attr("aria-label", `${allStep}단계 중 ${stepIdx + 1}단계`);
	// console.log(`선택된 항목: ${$element}, 스텝 인덱스: ${stepIdx}`);

	const $ds1Items = $(".ds1").find("[data-pickitem]");
	const $smpContentItems = $(".smp_content").find("[data-pickitem]");

	// 모든 항목에서 'active' 제거 후, 현재 선택된 항목만 'active' 추가
	$ds1Items.addClass("active");
	$smpContentItems.addClass("active");

	$ds1Items.eq(stepIdx).removeClass("active");
	$smpContentItems.eq(stepIdx).removeClass("active");
}

// progress 상태 처리 및 aria label 처리
function stepIng(num, allStep) {
	console.log("stepIng: ", num);
	// console.log('stepIng all: ', allStep);

	// if(num === allStep) {
	// 	return
	// }

	// 버튼 활성화 상태
	if (num > 0) {
		$(".stm_btn").addClass("active");
	} else {
		$(".stm_btn").removeClass("active");
	}

	// 진행 퍼센트 계산
	const progress = Math.floor(((num + 1) / allStep) * 100);
	// console.log('progress: ', progress);
	$(".pgs_per").css("width", `${progress}%`);

	// 시작 및 완료 상태 클래스 추가/제거
	$(".pgs_per").toggleClass("start", progress === 0);
	$(".pgs_per").toggleClass("end", progress === 100);

	// console.log(`진행 상황: ${progress}%`);

	$(".smp").attr("data-now", num);
}

function keypadEnter() {
	let selectedIdx = null;

	// 입력 값 저장 변수
	let birthInput = "";

	$(".keypad_btn").on("click", function () {
		const $this = $(this);
		const value = $this.text().trim();
		const trgEle = $(".birth_date_field");

		const idx = $this.closest(".opts_area").index();
		selectedIdx = idx + 1;
		// console.log('선택 된 현재 index 값 : ', selectedIdx);

		if ($(this).hasClass("keypad_btn_del")) {
			// 하나 지우기
			birthInput = birthInput.slice(0, -1);
			trgEle.text(birthInput);
		} else if ($(this).hasClass("keypad_btn_delall")) {
			// 전체 초기화
			birthInput = "";
			trgEle.text("").removeClass("active");
		} else {
			if (birthInput.length < 8) {
				birthInput += value;
				trgEle.text(birthInput);
			}
			// if (birthInput.length < 2) {
			// 	birthInput += value;
			// 	trgEle.text(birthInput);
			// }
		}

		const getLng = trgEle.text().length;
		// console.log('글자수 : ', getLng);
		if (getLng > 0) {
			trgEle.addClass("active");
		} else {
			trgEle.removeClass("active");
		}

		if (getLng === 8) {
			console.log(getLng);

			// const selectedText = $this.next('label').find('.label_i').text();
			const selectedText = trgEle.text();
			// console.log('selectedText: ', selectedText);

			const data = $this.closest(".opts_area").data("pickitem");
			$(".ds2_inner")
				.children("button")
				.each(function () {
					if ($(this).hasClass(data)) {
						$(this).text(selectedText);
					}
				});

			// 선택된 항목 활성화
			motionEvent($this, selectedIdx);

			// stepper 진행 업데이트
			stepIng(selectedIdx, allStep);

			$(".smp").attr("data-now", selectedIdx);
		}
	});
}

// 이전단계
function stepBack() {
	// console.log('back');
	// 현재 스텝 값 가져오기
	let dataNow = parseInt($(".smp").attr("data-now")) || 0;
	// console.log('back dataNow now: ', dataNow);

	// 이전 스텝 계산 (최소값 0으로 제한)
	const now = Math.max(dataNow - 1, 0);
	// console.log('back now: ', now);

	// 선택된 항목 활성화
	motionEvent(null, now); // motionEvent 호출 시 null 전달

	// stepper 진행 업데이트
	stepIng(now, allStep);

	// 현재 스텝 표기
	$(".smp").attr("data-now", now);
}

// 이전단계
function stepNext() {
	// console.log('next');
	// 현재 스텝 값 가져오기
	let dataNow = parseInt($(".smp").attr("data-now")) || 0;
	console.log("next dataNow now: ", dataNow);

	// 다음 스텝 계산 (최대값 allStep으로 제한)
	const now = Math.min(dataNow + 1, allStep - 1);
	console.log("next now: ", now);

	// 선택된 항목 활성화
	motionEvent(null, now); // motionEvent 호출 시 null 전달

	// stepper 진행 업데이트
	stepIng(now, allStep);

	// 현재 스텝 표기
	$(".smp").attr("data-now", now);
}

function moveStep() {
	$(".selected_case").on("click", function () {
		const $this = $(this);

		// 1. 버튼의 클래스 중 `selected_case`를 제외한 특정 클래스 가져오기
		let targetClass = $this
			.attr("class")
			.split(" ")
			.find(cls => cls !== "selected_case");
		console.log("클릭한 버튼의 추가 클래스:", targetClass);

		if (!targetClass) return;

		// 2. opts_area에서 해당 data-pickitem을 가진 요소 찾기
		let targetIdx = $(".opts_area")
			.filter(function () {
				return $(this).data("pickitem") === targetClass;
			})
			.index();

		console.log("이동할 스텝 index:", targetIdx);

		if (targetIdx !== -1) {
			// 3. 해당 index로 스텝 이동
			motionEvent(null, targetIdx);
			stepIng(targetIdx, allStep);
			$(".smp").attr("data-now", targetIdx);
		}
	});
}
