const $stepper = {

	selectedIdx: null,
	allStep: 0,
	fnCallback: null,

	// 개발용
	// stepperInit: function(callback) {
	// 개발용
	// 퍼블용
	stepperInit: function(callback, startIdx = 0) {
	// 퍼블용
		if(typeof callback === 'function') {
			$stepper.fnCallback = callback;
		}
		// 개발용
		// if( $('.bi_wrap').length ) {
		// 	const totalStepCount = $('.opts_area').length;
		// 	$stepper.allStep = totalStepCount;
		// 	$('.stepper_wrap').find('.stepper').attr('aria-label', `${totalStepCount}단계 중 ${1}단계`);
		// 	$('.bi_wrap').attr('data-now', 0);
	
		// 	// 선택된 항목 활성화
		// 	$stepper.motionEvent(null, 0);
	
		// 	// stepIng 호출
		// 	$stepper.stepIng(0, totalStepCount);

		// 	// 선택 이벤트
		// 	$stepper.selectEvent();

		// 	// keypad 이벤트
		// 	$stepper.keypadEnter();

		// 	// 선택 된 요소의 스텝으로 이동
		// 	$stepper.moveStep();

		// 	// 전체 스텝 수 반환
		// 	return totalStepCount;
		// }
		// return 0;
		// 개발용

		// 퍼블용
		if ($('.bi_wrap').length) {
			const totalStepCount = $('.opts_area').length;
			$stepper.allStep = totalStepCount;
	
			const validIdx = Math.max(0, Math.min(startIdx, totalStepCount - 1));
	
			$('.stepper_wrap').find('.stepper').attr('aria-label', `${totalStepCount}단계 중 ${validIdx + 1}단계`);
			$('.bi_wrap').attr('data-now', validIdx);
	
			$stepper.motionEvent(null, validIdx);
			$stepper.stepIng(validIdx, totalStepCount);
			$stepper.selectEvent();
			$stepper.keypadEnter();
			$stepper.moveStep();
	
			return totalStepCount;
		}
		return 0;
		// 퍼블용


	},

	// 선택 이벤트
	selectEvent: function() {
		
		$('.opts_area_item input[type="radio"]').on('change', function() {
			const $this = $(this);
			const idx = $this.closest('.opts_area').index();
			const data = $this.closest('.opts_area').data('pickitem');
			const selectedText = $this.next('label').find('.label_cont').text().trim();
	
			// 선택 된 현재 index 값
			$stepper.selectedIdx = idx + 1;

			// UI 업데이트
			$('.bit_history_inner').children('button').each(function() {
				if ($(this).hasClass(data)) {
					const thisData = $(this).text();
					const thisDataIndex = $(this).index();
	
					if(thisData == '') {
						$(this).text(selectedText);
						$('.stepper').attr('tabindex', '0');
					} else if (thisData != selectedText) {
						// console.log('초기화');
						$(this).text(selectedText);
						// 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
						$('.bit_history_inner').children('.selected_case').slice(thisDataIndex + 1).text('');
					}
				}
			});
		});
	},

	// 선택된 항목 활성화
	motionEvent: function($element, stepIdx) {

		$('.stepper_wrap').find('.stepper').attr('aria-label', `${$stepper.allStep}단계 중 ${stepIdx + 1}단계`);
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
	},
	
	// progress 상태 처리 및 aria label 처리
	stepIng: function(num, allStep) {
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
		$('.pgs_per').css('width', `${progress}%`);

		// 시작 및 완료 상태 클래스 추가/제거
		$('.pgs_per').toggleClass('start', progress === 0);
		$('.pgs_per').toggleClass('end', progress === 100);

		// console.log(`진행 상황: ${progress}%`);

		$('.bi_wrap').attr('data-now', num);
	},



	// 입력 값 저장 변수
	
	keypadEnter: function() {
		
		$('.keypad_btn').on('click', function(){
			const $this = $(this);
			const value = $this.text().trim();
			const trgEle = $this.closest('.opts_area').find('.birth_date_field');

			let birthInput = trgEle.text() ?? '';
			
			// console.log('눌린 숫자 : ', value);

			const idx = $this.closest('.opts_area').index();
			$stepper.selectedIdx = idx + 1;
			// console.log('선택 된 현재 index 값 : ', $stepper.selectedIdx);


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
					birthInput += value;
					trgEle.text(birthInput);
				// }
			}

			// const getLng = trgEle.text().length;
			let getLng = trgEle.text().length;
			// console.log('글자수 : ', getLng);
			if(getLng > 0) {
				trgEle.addClass('active');
			} else {
				trgEle.removeClass('active');
			}

			// // 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
			// $('.bit_history_inner').children('.selected_case').slice(idx + 1).text('');
			
			// if(getLng === 8) {
			// const trgEle = $this.closest('.opts_area').find('.birth_date_field');

			// const dataNow = '';
			// const _dataFiled = $('.opts_area').eq(0).find('.birth_date_field');
			// if(_dataFiled.length > 0){
			// 	const selectedText = _dataFiled.text();
			// 	const stepNum = $('.opts_area').eq(0).data('pickitem');
			// 	$('.bit_history_inner').children('button').each(function() {
			// 		if ($(this).hasClass(stepNum)) {
						
			// 			if(selectedText !== $(this).text()) {
			// 				// 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
			// 				$('.bit_history_inner').children('.selected_case').slice(idx + 1).text('');
			// 			}

			// 			$(this).text(selectedText);
			// 		}
			// 	});
			// }

			if(typeof $stepper.fnCallback === 'function') {
				$stepper.fnCallback();
			}
		});
	},


	// 이전단계
	stepBack: function() {
		// console.log('back');
		// 현재 스텝 값 가져오기
		let dataNow = parseInt($('.bi_wrap').attr('data-now')) || 0;
		// console.log('back dataNow now: ', dataNow);

		// 이전 스텝 계산 (최소값 0으로 제한)
		const now = Math.max(dataNow - 1, 0);

		// 선택된 구간의 값 초기화
		$stepper.stepReset(now);  // 선택된 스텝에 맞게 초기화 함수 호출

		// 선택된 항목 활성화
		$stepper.motionEvent(null, now); // motionEvent 호출 시 null 전달

		// stepper 진행 업데이트
		$stepper.stepIng(now, $stepper.allStep);

		// 현재 스텝 표기
		$('.bi_wrap').attr('data-now', now);
	},

	// 다음음단계
	stepNext: function() {
		// 현재 스텝 값 가져오기
		let dataNow = parseInt($('.bi_wrap').attr('data-now')) || 0;

		// 다음 스텝 계산 (최대값 allStep으로 제한)
		const now = Math.min(dataNow + 1, $stepper.allStep - 1);

		const _dataFiled = $('.opts_area').eq(dataNow).find('.birth_date_field');
		if(_dataFiled.length > 0){
			const selectedText = _dataFiled.text();
			const stepNum = $('.opts_area').eq(dataNow).data('pickitem');

			$('.bit_history_inner').children('button').each(function() {
				if ($(this).hasClass(stepNum)) {
					if(selectedText.length > 0 && selectedText !== $(this).text()) {
						// 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
						$('.bit_history_inner').children('.selected_case').slice($(this).index() + 1).text('');
						$(this).text(selectedText);
					}
				}
			});
		}


		// 선택된 구간의 값 초기화
		$stepper.stepReset(now);  // 선택된 스텝에 맞게 초기화 함수 호출

		// 선택된 항목 활성화
		$stepper.motionEvent(null, now); // motionEvent 호출 시 null 전달

		// stepper 진행 업데이트
		$stepper.stepIng(now, $stepper.allStep);

		// 현재 스텝 표기
		$('.bi_wrap').attr('data-now', now);
	},

	// 이동
	moveStep: function() {
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
				$stepper.stepReset(targetIdx);  // 선택된 스텝에 맞게 초기화 함수 호출
				
				// 3. 해당 index로 스텝 이동
				$stepper.motionEvent(null, targetIdx);
				$stepper.stepIng(targetIdx, $stepper.allStep);
				$('.bi_wrap').attr('data-now', targetIdx);
			}
		});
	},



	// 초기화
	stepReset: function(stepIdx) {
		// console.log('초기화');
		// 각 스텝의 초기화 작업을 여기서 수행

		// 1. 선택된 라디오 버튼 초기화
		const $stepRadio = $('.opts_area').eq(stepIdx).find('input[type="radio"]');
		$stepRadio.prop('checked', false);  // 라디오 버튼 선택 해제

		// 2. birth_date_field 텍스트 초기화
		const $birthDateField = $('.opts_area').eq(stepIdx).find('.birth_date_field');
		$birthDateField.text('').removeClass('active');  // 텍스트와 active 클래스 제거

		// 3. 키패드에서 입력된 값 초기화
		// birthInput = "";  // 저장된 입력값 초기화
		$('.birth_date_field').text('');  // 텍스트 업데이트
		

		// 4. 기타 필요한 초기화 작업 추가
		// 예시로, 특정 클래스에 있는 입력값들 초기화
		$('.some_other_input').val('');  // 다른 입력 필드 값 초기화
	}

}

