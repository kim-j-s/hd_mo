(function(){
	$(function(){

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
	if( $('.bi_wrap').length ) {
		// console.log(num);
		const totalStepCount = $('.opts_area').length;
		allStep = totalStepCount;
		$('.stepper_wrap').find('.stepper').attr('aria-label', `${totalStepCount}단계 중 ${num + 1}단계`);
		$('.bi_wrap').attr('data-now', num);

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
	$('.opts_area_item input[type="radio"]').on('change', function() {
		const $this = $(this);
		const idx = $this.closest('.opts_area').index();
		const data = $this.closest('.opts_area').data('pickitem');
		const selectedText = $this.next('label').find('.label_cont').text().trim();

		console.log('selectedText', selectedText);

		// 선택 된 현재 index 값
		selectedIdx = idx + 1;
		// console.log('selectEvent : 선택 된 현재 index 값 : ', selectedIdx);

		// 선택된 값 콘솔 출력
		// console.log(`선택된 값: ${selectedText}, 선택된 data: ${data}`);

		// UI 업데이트
		$('.bit_history_inner').children('button').each(function() {
			if ($(this).hasClass(data)) {
				const thisData = $(this).text();
				const thisDataIndex = $(this).index();
				// console.log(thisData);
				// console.log(thisDataIndex);

				if(thisData == '') {
					$(this).text(selectedText);
					$('.stepper').attr('tabindex', '0');
				} else if (thisData != selectedText) {
					// console.log('초기화');
					// 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
					$('.bit_history_inner').children('.selected_case').slice(thisDataIndex + 1).text('');
				}
			}
		});


		if(selectedIdx === allStep) {
			return
		} else {

			// 선택된 구간의 값 초기화
      stepReset(selectedIdx);  // 선택된 스텝에 맞게 초기화 함수 호출

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

	$('.stepper_wrap').find('.stepper').attr('aria-label', `${allStep}단계 중 ${stepIdx + 1}단계`);
	// console.log(`선택된 항목: ${$element}, 스텝 인덱스: ${stepIdx}`);
	
	const $bitItems = $('.bit').find('[data-pickitem]');
	const $smpContentItems = $('.bi_opts_wrap').find('[data-pickitem]');

	// 모든 항목에서 'active' 제거 후, 현재 선택된 항목만 'active' 추가
	$bitItems.addClass('active');
	$smpContentItems.addClass('active');

	$bitItems.eq(stepIdx).removeClass('active');
	$smpContentItems.eq(stepIdx).removeClass('active');

	// $('.stepper').attr('tabindex', '0').focus();
	$('.stepper').focus();


}

// progress 상태 처리 및 aria label 처리
function stepIng(num, allStep) {
	// console.log('stepIng: ', num);
	// console.log('stepIng all: ', allStep);

	// if(num === allStep) {
	// 	return
	// }

	// 버튼 활성화 상태
	if (num > 0) {
    $('.stm_btn').addClass('active').prop('disabled', false);
  } else {
    $('.stm_btn').prop('disabled', true);
    // active는 지우지 않는다
  }
	// 버튼 활성화 상태

	// 이전/다음 버튼 활성화
	// 추가된 다음 버튼 활성/비활성 처리
  const $selectedButton = $('.bit_history_inner').find('.selected_case').eq(num);
  const buttonText = $selectedButton.text().trim();

  if (buttonText === '') {
    $('.stm_btn.stm_r').prop('disabled', true);
  } else {
    $('.stm_btn.stm_r').prop('disabled', false);
  }
  // 여기까지

	

	// 진행 퍼센트 계산
	const progress = Math.floor(((num + 1) / allStep) * 100);
	// console.log('progress: ', progress);
	$('.pgs_per').css('width', `${progress}%`);

	// 시작 및 완료 상태 클래스 추가/제거
	$('.pgs_per').toggleClass('start', progress === 0);
	$('.pgs_per').toggleClass('end', progress === 100);

	// console.log(`진행 상황: ${progress}%`);

	$('.bi_wrap').attr('data-now', num);
}



// 입력 값 저장 변수
let birthInput = "";
function keypadEnter() {
	let selectedIdx = null;

	$('.keypad_btn').on('click', function(){
		const $this = $(this);
		const value = $this.text().trim();
		const trgEle = $('.birth_date_field');

		// console.log('눌린 숫자 : ', value);

		const idx = $this.closest('.opts_area').index();
		selectedIdx = idx + 1;
		// console.log('선택 된 현재 index 값 : ', selectedIdx);


		if( $(this).hasClass('keypad_btn_del') ) {
			// 하나 지우기
			birthInput = birthInput.slice(0, -1);
			trgEle.text(birthInput);
			
		} else if ( $(this).hasClass('keypad_btn_delall') ) {
			// 전체 초기화
			birthInput = "";
			trgEle.text("").removeClass('active');
		} else {
			// if (birthInput.length < 8) {
			if (birthInput.length < 8) {
				birthInput += value;
				trgEle.text(birthInput);				
			}
		}

		// const getLng = trgEle.text().length;
		let getLng = trgEle.text().length;
		// console.log('글자수 : ', getLng);
		if(getLng > 0) {
			trgEle.addClass('active');
		} else {
			trgEle.removeClass('active');
		}

		// if(getLng === 8) {
		if(getLng === 8) {
			// console.log(getLng);

			// const selectedText = $this.next('label').find('.label_i').text();
			const selectedText = trgEle.text();
			// console.log('selectedText: ', selectedText);
			
			const data = $this.closest('.opts_area').data('pickitem');
			$('.bit_history_inner').children('button').each(function() {
				if ($(this).hasClass(data)) {
					$(this).text(selectedText);
				}
			});

			// 선택된 항목 활성화
			motionEvent($this, selectedIdx);

			// stepper 진행 업데이트
			stepIng(selectedIdx, allStep);

			$('.bi_wrap').attr('data-now', selectedIdx);
		}

		
		
	});
}

// 이전단계
function stepBack() {
	// console.log('back');
	// 현재 스텝 값 가져오기
	let dataNow = parseInt($('.bi_wrap').attr('data-now')) || 0;
  // console.log('back dataNow now: ', dataNow);

  // 이전 스텝 계산 (최소값 0으로 제한)
  const now = Math.max(dataNow - 1, 0);
  // console.log('back now: ', now);

	// 선택된 구간의 값 초기화
	stepReset(now);  // 선택된 스텝에 맞게 초기화 함수 호출

  // 선택된 항목 활성화
  motionEvent(null, now); // motionEvent 호출 시 null 전달

  // stepper 진행 업데이트
  stepIng(now, allStep);

  // 현재 스텝 표기
  $('.bi_wrap').attr('data-now', now);
}

// 이전단계
function stepNext() {
	// console.log('next');
	// 현재 스텝 값 가져오기
  let dataNow = parseInt($('.bi_wrap').attr('data-now')) || 0;
  // console.log('next dataNow now: ', dataNow);

  // 다음 스텝 계산 (최대값 allStep으로 제한)
  const now = Math.min(dataNow + 1, allStep - 1);
  // console.log('next now: ', now);

  // 선택된 항목 활성화
  motionEvent(null, now); // motionEvent 호출 시 null 전달

  // stepper 진행 업데이트
  stepIng(now, allStep);

  // 현재 스텝 표기
  $('.bi_wrap').attr('data-now', now);
}

// 이동
function moveStep() {
	$('.selected_case').on('click', function () {
		const $this = $(this);

		// 1. 버튼의 클래스 중 `selected_case`를 제외한 특정 클래스 가져오기
		let targetClass = $this.attr('class').split(' ').find(cls => cls !== 'selected_case');
		// console.log('클릭한 버튼의 추가 클래스:', targetClass);

		if (!targetClass) return;

		// 2. opts_area에서 해당 data-pickitem을 가진 요소 찾기
		let targetIdx = $('.opts_area').filter(function () {
			return $(this).data('pickitem') === targetClass;
		}).index();

		console.log('이동할 스텝 index:', targetIdx);

		if (targetIdx !== -1) {

			// 선택된 구간의 값 초기화
      stepReset(targetIdx);  // 선택된 스텝에 맞게 초기화 함수 호출
			
			// 3. 해당 index로 스텝 이동
			motionEvent(null, targetIdx);
			stepIng(targetIdx, allStep);
			$('.bi_wrap').attr('data-now', targetIdx);
		}
});
}



// 초기화
function stepReset(stepIdx) {
	// console.log('초기화');
  // 각 스텝의 초기화 작업을 여기서 수행

  // 1. 선택된 라디오 버튼 초기화
  const $stepRadio = $('.opts_area').eq(stepIdx).find('input[type="radio"]');
  $stepRadio.prop('checked', false);  // 라디오 버튼 선택 해제

  // 2. birth_date_field 텍스트 초기화
  const $birthDateField = $('.birth_date_field');
  $birthDateField.text('').removeClass('active');  // 텍스트와 active 클래스 제거

  // 3. 키패드에서 입력된 값 초기화
  birthInput = "";  // 저장된 입력값 초기화
  $('.birth_date_field').text(birthInput);  // 텍스트 업데이트
	

  // 4. 기타 필요한 초기화 작업 추가
  // 예시로, 특정 클래스에 있는 입력값들 초기화
  $('.some_other_input').val('');  // 다른 입력 필드 값 초기화
}
