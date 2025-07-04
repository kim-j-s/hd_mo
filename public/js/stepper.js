const $stepper = {
	selectedIdx: 0,
	allStep: 0,
	fnCallback: '',
	data: {
		nowIdx: 0,
		nowStep: 0,
		totalStep: 0,
		finishedStep: 0,
	},
	setCallback: (fn) => {
		if (typeof fn === "function") {
			$stepper.fnCallback = fn;
		}
	},
	set: (key, value) => {
		if('totalStep' == key) {
			$stepper.allStep = value;
		}
		if('nowIdx' == key) {
			$stepper.selectedIdx = (value + 1);
			$stepper.data.nowStep = (value + 1);
			$('.bi_wrap').attr('data-now', value);
		}
		$stepper.data[key] = value;
	},
	get: (key) => {
		return $stepper.data?.[key];
	},
	stepperInit: function (callback, startIdx = 0) {
		$stepper.setCallback(callback);
		const _totalStep = $(".opts_area").length;
		$stepper.init(_totalStep, startIdx);
	},
	init: (totalStep = 0, nowIdx = 0) => {
		const _optsLen = $(".opts_area").length;
		const _totalStep = (totalStep > 0) ? totalStep : _optsLen;
		$stepper.set('totalStep', _totalStep);
		
		$stepper.openTab(nowIdx);

		$stepper.addMoveStepEvent();	// 버튼영역 이벤트
		$stepper.addSelectEvent();		// 선택영역 이벤트
		$stepper.addKeypadEvent();		// 키패드영역 이벤트
	},
	openTab: (nowIdx) => {
		// 현재 stepIdx
		$stepper.set('nowIdx', nowIdx);

		// progress영역
		$stepper.ctrlArrowButton(nowIdx);
		$stepper.ctrlProgress(nowIdx);

		// 1. 선택tab 영역(해당 탭 radio 체크 해제)
		const _stepRadio = $('.opts_area').eq(nowIdx).find('input[type="radio"]');
		_stepRadio.prop('checked', false); // 라디오 버튼 선택 해제

		// 2. birth_date_field 텍스트 초기화
		const _birthDateField = $(".opts_area").eq(nowIdx).find(".birth_date_field");
		_birthDateField.text("").removeClass("active"); // 텍스트와 active 클래스 제거

		// // 3. 키패드에서 입력된 값 초기화
		// $(".birth_date_field").text(""); // 텍스트 업데이트


		const _len = $('.bit_within').length;
		const _focusClass = (_len > 0) ? 'bit_within' : 'stepper';
		$('.' + _focusClass).focus();
		

	},
	ctrlProgress: (nowIdx) => {
		// label / dataSet 세팅 -> 현재 step 기준
		const _progressImg = $('.stepper_wrap').find('.stepper');
		_progressImg.attr('aria-label', `${$stepper.get('totalStep')}단계 중 ${nowIdx + 1}단계`);

		const _subTitleItems = $('.bit').find('[data-pickitem]');				// subtitle
		const _contentsTab = $('.bi_opts_wrap').find('[data-pickitem]');		// 선택 탭

		// 모든 항목에서 'active' 제거 후, 현재 선택된 항목만 'active' 추가
		_subTitleItems.addClass('active');
		_contentsTab.addClass('active');

		_subTitleItems.eq(nowIdx).removeClass('active');
		_contentsTab.eq(nowIdx).removeClass('active');

		// 진행 퍼센트 계산
		const progress = Math.floor(((nowIdx + 1) / $stepper.get('totalStep')) * 100);
		$('.pgs_per').css('width', `${progress}%`);

		// 시작 및 완료 상태 클래스 추가/제거
		$('.pgs_per').toggleClass('start', progress === 0);
		$('.pgs_per').toggleClass('end', progress === 100);
	},
	ctrlArrowButton: (nowIdx) => {
		// 버튼 활성화 상태
		if (nowIdx > 0) {
			$('.stm_btn').addClass('active').prop('disabled', false);
		} else {
			$('.stm_btn').prop('disabled', true);
		}

		// 이전/다음 버튼 활성화
		// 추가된 다음 버튼 활성/비활성 처리
		const $selectedButton = $('.bit_history_inner').find('.selected_case').eq(nowIdx);
		const buttonText = $selectedButton.text().trim();

		if (buttonText === '') {
			$('.stm_btn.stm_r').prop('disabled', true);
		} else {
			$('.stm_btn.stm_r').prop('disabled', false);
		}
	},
	// 이전단계
	stepBack: function () {
		const _nowIdx = $stepper.get('nowIdx');

		// 이전 스텝 계산 (최소값 0으로 제한)
		const _targetIdx = Math.max(_nowIdx - 1, 0);
		$stepper.openTab(_targetIdx);
	},
	// 다음단계
	stepNext: function () {
		const _nowIdx = $stepper.get('nowIdx');

		// 다음 스텝 계산 (최대값 totalStep으로 제한)
		const _targetIdx = Math.min(_nowIdx + 1, $stepper.get('totalStep') - 1);
		$stepper.openTab(_targetIdx);
	},
	// 이동
	addMoveStepEvent: function () {
		$('.selected_case').on('click', (e) => {
			const _target = $(e.target);
			const _targetIdx = _target.index();
			console.log('이동할 스텝 index:', _targetIdx);

			if (_targetIdx !== -1) {
				$stepper.openTab(_targetIdx);
			}
		});
	},
	// 선택영역 이벤트
	addSelectEvent: (itemName) => {	// 예시: itemName = 'step1'
		let _targetArea = $(`.opts_area[data-pickitem="${itemName}"]`);
		if(_targetArea.length == 0) {
			_targetArea = $(document);
		}
		
		$(_targetArea).find('.opts_area_item input[type="radio"]').on('change', (e) => {
			const _target = $(e.target);
			const _stepIdx = _target.closest('.opts_area').index();
			const _selectedText = _target.next('label').find('.label_cont').text().trim();

			$stepper.setButtonText(_stepIdx, _selectedText);
			
			if(typeof $stepper.fnCallback == 'function') {
				$stepper.fnCallback(_target);
			}
		});
	},
	// 버튼 텍스트 세팅
	setButtonText: (stepIdx, selectedText) => {
		// UI 업데이트
		const _btn = $('.selected_case').eq(stepIdx);
		const _btnText = _btn.text();
		_btn.text(selectedText);
		
		if (_btnText == '') {
			$('.stepper').attr('tabindex', '0');
		} else if (_btnText != selectedText) {
			// 현재 선택된 인덱스를 기준으로 다음 단계에 있는 selected_case 텍스트를 빈 값으로 초기화
			const _otherBtn = $('.bit_history_inner').children('.selected_case').slice(stepIdx + 1);
			_otherBtn.text('');
		}
	},
	setHistory: function(target) {
		const _target = target;
		const _stepIdx = _target.closest(".opts_area").index();

		let _selectedText = "";

		if(_target.attr("type") == "radio") {
			_selectedText = _target.next("label").find(".label_cont").text().trim();
		} else if(_target.attr("type") == "button") {
			_selectedText = _target.closest(".opts_area").find(".birth_date_field").text();
		}
		
		// UI 업데이트
		$stepper.setButtonText(_stepIdx, _selectedText);
	},
	addKeypadEvent: (itemName) => {	// 예시: itemName = 'step1'
		let _targetArea = $(`.opts_area[data-pickitem="${itemName}"]`);
		if(_targetArea.length == 0) {
			_targetArea = $(document);
		}
		
		$(_targetArea).find('.keypad_btn').on('click', function (e) {
			const _target = $(e.target);
			const _keypadText = _target.text().trim();
			const _input = _target.closest('.opts_area').find('.birth_date_field');
			$('.stepper').attr('tabindex', '0');

			let _inputText = _input.text() ?? '';

			if (_target.hasClass('keypad_btn_del')) {
				// 하나 지우기
				_inputText = _inputText.slice(0, -1);
			} else if (_target.hasClass('keypad_btn_delall')) {
				// 전체 초기화
				_inputText = '';
			} else {
				_inputText += _keypadText;
			}
			_input.text(_inputText);

			let getLng = _input.text().length;
			if (getLng > 0) {
				_input.addClass('active');
			} else {
				_input.removeClass('active');
			}

			if (typeof $stepper.fnCallback === 'function') {
				$stepper.fnCallback(_target);
			}
		});
	},
	// step 초기화
	resetStep: (stepNum) => {
		let _targetIdx = Math.max(stepNum-1, 0);
		_targetIdx = Math.min(_targetIdx, $stepper.get('totalStep') - 1);
		$stepper.setButtonText(_targetIdx, '');
		$stepper.openTab(_targetIdx);
	}
}
