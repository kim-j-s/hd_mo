/**
 * @alias 캘린더js (2025-06-11)
 * @author N03288
 */
const $calendar = {
	data: {
		year: 2025,
		month: 5,
		minDate: '',
		maxDate: '',
		selectedDate: '',
	},
	callback: null,
	selectValid: null,
	setCallback: (fn) => {
		$calendar.callback = null;
		if(typeof fn == 'function') {
			$calendar.callback = fn;
		}
	},
	setSelectValid: (fn) => {
		$calendar.selectValid = null;
		if(typeof fn == 'function') {
			$calendar.selectValid = fn;
		}
	},
	set: (key, value) => {
		$calendar.data[key] = value;
	},
	get: key => {
		return $calendar.data?.[key];
	},
	prevMonth: () => {
		$calendar.state.month--;
	},
	nextMonth: () => {
		$calendar.state.month++;
	},
	/**
	 * $calendar.init
	 * 캘린터 호출 전 출력할 날짜의 범위 및 필요 데이터 세팅
	 * 
	 * @param {string} minDate ('yyyy-mm-dd') [필수] 선택가능한 최소 날짜
	 * @param {string} maxDate ('yyyy-mm-dd') [필수] 선택가능한 최대 날짜
	 * @param {string} selectedDate ('yyyy-mm-dd') [선택] 선택한 날짜
	 * @returns {void}
	 */
	init: (minDate, maxDate, selectedDate) => {
		/*
			다음과 같이 세팅 후 $calendar.open 호출
			1. year
			2. month
			3. minDate		// setDate 활용
			4. maxDate		// setDate 활용
	
			------ <예시> ------
			$calendar.set('year', _now.year);
			$calendar.set('month', _now.month);
			$calendar.set('minDate', $calendar.setDate('2025-02-05'));
			$calendar.set('maxDate', $calendar.setDate(_max, 'date'));
			-------------------
		*/
		const _now = $calendar.setDate();
		$calendar.set('minDate', $calendar.setDate(minDate));
		$calendar.set('maxDate', $calendar.setDate(maxDate));
		
		if(selectedDate?.length == 10) {
			$calendar.set('selectedDate', selectedDate);
			const _selectedDate = $calendar.setDate(selectedDate);
			$calendar.set('year', _selectedDate.year);
			$calendar.set('month', _selectedDate.month);
		} else {
			const _minDate = $calendar.get('minDate');
			const _maxDate = $calendar.get('maxDate');
			const chkMinDate = $calendar.chkMinDate(_now.year, _now.month, _minDate);
			const chkMaxDate = $calendar.chkMaxDate(_now.year, _now.month, _maxDate);
			
			if(!chkMinDate) {
				$calendar.set('year', _minDate.year);
				$calendar.set('month', _minDate.month);
			} else if(!chkMaxDate) {
				$calendar.set('year', _maxDate.year);
				$calendar.set('month', _maxDate.month);
			} else {
				$calendar.set('year', _now.year);
				$calendar.set('month', _now.month);
			}
		}
	},
	setDate: (newDate, type = 'yyyy-mm-dd') => {
		// newDate = 'yyyy-mm-dd';
		let _date;

		if (!newDate) {
			_date = new Date();
		} else if (type == 'yyyy-mm-dd') {
			_date = new Date(newDate);
		} else if (type == 'date') {
			_date = newDate;
		}

		const _year = _date.getFullYear();
		const _month = _date.getMonth() + 1;
		const _day = _date.getDate();

		const _result = {
			year: _year,
			month: _month,
			day: _day,
		};
		return _result;
	},
	open: (target, popId) => {
		// 표시날짜(year, month) 세팅 후
		$calendar.renderCalendar($calendar.get('year'), $calendar.get('month'));
		openHDPopup(target, popId);
	},
	close: (popId) => {
		$calendar.set('year', null);
		$calendar.set('month', null);
		$calendar.set('minDate', '');
		$calendar.set('maxDate', '');
		$calendar.set('selectedDate', '');
		$calendar.setCallback('');
		closeHDPopup(popId);
	},
	accept: () => {
		const _selectedDate = $calendar.get('selectedDate');
		if(typeof $calendar.callback == 'function') {
			$calendar.callback(_selectedDate);
		}
		return _selectedDate;
	},
	chkMinDate: (year, month, minDate) => {
		const _nowDate = String(year) + String(month).padStart(2,'0');
		const _minDate = String(minDate.year) + String(minDate.month).padStart(2,'0');
		return Number(_minDate) <= Number(_nowDate);
	},
	chkMaxDate: (year, month, maxDate) => {
		const _nowDate = String(year) + String(month).padStart(2,'0');
		const _maxDate = String(maxDate.year) + String(maxDate.month).padStart(2,'0');
		return Number(_maxDate) >= Number(_nowDate);
	},
	renderCalendar: (year, month, todayDate = new Date()) => {
		const minDate = $calendar.get('minDate');
		const maxDate = $calendar.get('maxDate');
		
		if(!minDate || !maxDate) {
			return;
		}

		// minDate
		const chkMinDate = $calendar.chkMinDate(year, month, minDate);

		if (!chkMinDate) {
			console.log('minDate보다 작을 수 없음');
			$calendar.nextMonth();
			return;
		}
		
		if (minDate.year == year && minDate.month == month) {
			$('.ccb_prev').prop('disabled', true);
		} else {
			$('.ccb_prev').prop('disabled', false);
		}

		// maxDate
		const chkMaxDate = $calendar.chkMaxDate(year, month, maxDate);

		if (!chkMaxDate) {
			console.log('maxDate보다 클 수 없음');
			$calendar.prevMonth();
			return;
		}

		if (maxDate.year == year && maxDate.month == month) {
			$('.ccb_next').prop('disabled', true);
		} else {
			$('.ccb_next').prop('disabled', false);
		}

		$('.calendar_year .text').text($calendar.get('year'));
		$('.calendar_month .text').text($calendar.get('month'));
		$('.calendar_tbl tbody').empty();

		const firstDay = new Date(year, month - 1, 1).getDay();
		const lastDate = new Date(year, month, 0).getDate();

		const todayYear = todayDate.getFullYear();
		const todayMonth = todayDate.getMonth() + 1; // 0-based → 1-based
		const todayDay = todayDate.getDate();

		const _selectedDate = $calendar.get('selectedDate');
		let _selectedDateObj = {};
		if(_selectedDate.length == 10) {
			_selectedDateObj = $calendar.setDate(_selectedDate);
		}

		let day = 1;
		let html = '';

		for (let i = 0; i < 6; i++) {
			let row = '<tr>';
			for (let j = 0; j < 7; j++) {
				if (i === 0 && j < firstDay) {
					row += `<td><button type="button" class="day_default" disabled><span class="text"></span></button></td>`;
				} else if (day > lastDate) {
					row += `<td><button type="button" class="day_default" disabled><span class="text"></span></button></td>`;
				} else {
					// 오늘 날짜 여부 확인
					const isToday = year === todayYear && month === todayMonth && day === todayDay;
					let className = isToday ? 'day_default day_today' : 'day_default';

					const isSelectedDate = year === _selectedDateObj.year && month === _selectedDateObj.month && day === _selectedDateObj.day;
					className += isSelectedDate ? ' day_active' : '';

					const validMinDate = minDate.year == year && minDate.month == month && minDate.day > day;
					const validMaxDate = maxDate.year == year && maxDate.month == month && maxDate.day < day;

					const isDisabled = validMinDate || validMaxDate;
					const _disabled = isDisabled ? 'disabled' : '';

					row += `<td><button type="button" class="${className}" ${_disabled}><span class="text">${day}</span></button></td>`;
					day++;
				}
			}
			row += '</tr>';
			html += row;

			if (day > lastDate) break;
		}

		$('.calendar_tbl tbody').append(html);
	},
};

$(document).ready(() => {
	$calendar.state = new Proxy($calendar.data, {
		set(target, property, value) {
			if (property == 'month') {
				let _value = value;
				if (value === 0) {
					$calendar.data.year -= 1;
					_value = 12;
				} else if (value === 13) {
					$calendar.data.year += 1;
					_value = 1;
				}
				target[property] = _value;
				$calendar.renderCalendar($calendar.data.year, _value);
			} else {
				target[property] = value;
			}
		},
	});

	// prev 버튼
	$(document).on('click', '.ccb_prev', function () {
		$calendar.prevMonth();
	});

	// next 버튼
	$(document).on('click', '.ccb_next', function () {
		$calendar.nextMonth();
	});

	// 날짜 선택 시
	$(document).on('click', '.day_default', function () {
		$(this).closest('.calendar_single').find('.day_active').removeClass('day_active');
		$(this).addClass('day_active');

		// 선택 날짜 세팅
		const _year = $calendar.get('year');
		const _month = $calendar.get('month');
		const _day = $(this).find('.text').text();
		const _selectedDate = `${_year}-${String(_month).padStart(2, '0')}-${String(_day).padStart(2, '0')}`;
		$calendar.set('selectedDate', _selectedDate);
		console.log(_selectedDate);

		if(typeof $calendar.selectValid == 'function') {
			$calendar.selectValid(_selectedDate);
		}
	});
});