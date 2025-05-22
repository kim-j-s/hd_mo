/* Popup 관련 */

/**
 * openHDPopup
 * popup ui를 오픈하는 함수(접근성 대응)
 * 
 * @param {string|HTMLElement|jQuery} $triggerEl [필수]팝업을 호출한 DOM(팝업이 닫힌 뒤에 포커스할 엘리먼트)
 * @param {string} target [필수]Open할 popup id
 * @returns {void}
 */
function openHDPopup($triggerEl, target) {

	if (!$triggerEl) {
		console.error('$triggerEl 필수');
		return false;
	}

	if (!target) {
		console.error('오픈할 팝업 타겟이 없습니다.');
		return false;
	}

	let $trigger;

	//$trigger 타입 유효성 체크
	if (typeof $triggerEl === 'string' || $triggerEl instanceof HTMLElement) {
		$trigger = $($triggerEl);
		
	} else if ($triggerEl instanceof jQuery) {
		// jQuery 객체인 경우
		$trigger = $triggerEl;
	} else {
		console.error('$triggerEl 타입을 확인하세요.');
		return false;
	}


	// 퍼블테스트용 (개발단에서는 삭제해주세요.)
	if (window.popupGroup) {
		attachPopup(target);
	}


	const $target = $("#" + target);
	const $header = $target.find(".popup_head_title");
	const $content = $target.find(".popup_cont");


	// Opener ID 생성 및 설정
	const getOpenerId = $trigger.attr('triggerId');
	const openerId = getOpenerId || generateUUID();

	if (!getOpenerId) {
		$trigger.attr('triggerId', openerId);
	}

	$target.attr('opener', openerId);

	$(".wrap").attr({
			"aria-hidden": "true",
			"inert": ""
		});


	// popup active
	$("body").css("overscroll-behavior", "contain").addClass("scroll_lock");
	$target.addClass("active");

	// bottom 팝업일 경우 - drag
	if ($target.hasClass("bottom")) {
		draggable($target);
	}

	// 접근성 속성 설정
	$target.attr("aria-hidden", "false");
	$target.find(".popup_inner").attr({
		"tabindex": 0,
		"aria-hidden": "false"
	});


	const focusTarget = $header.length > 0 ? $header : ($content.length > 0 ? $content : null);
	const activePopups = $(".popup_wrap.active").not($target);

	callReflow(focusTarget);

	setTimeout(() => {
		focusTarget.focus();
		focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

		setTimeout(() => {
			focusTarget.attr("aria-live", null);
		}, 0);

		if (activePopups.length > 0) {	
			activePopups.attr("aria-hidden", "true");
			activePopups.find(".popup_inner").attr("aria-hidden", "true");
		}
	}, 350);

}

/**
 * closeHDPopup
 * popup ui를 제거하는 함수(접근성 대응)
 * @param {string} target [필수]close할 popup id
 * @param {string|HTMLElement|jQuery} [returnTarget] [선택]팝업이 닫힌 뒤에 포커스할 엘리먼트
 * @returns {void}
 */
function closeHDPopup(target, returnTarget = null) {
	if (!target) {
		console.error('close할 팝업 id를 지정해주세요');
		return false;
	}

	const $target = $("#" + target);

	const openerId = $target.attr('opener');
	$target.removeClass("active");

	// 하단에 다른 팝업이 열려있는 경우
	const $prevPopup = $(".popup_wrap.active:last");
	
	if ($prevPopup.length > 0) {
		handlePreviousPopupFocus($prevPopup, $target, returnTarget, openerId);
	} else {
		handleMainContentFocus($target, returnTarget, openerId);
	}

	return true;
}

/**
 * 이전 팝업으로 포커스 처리
 */
function handlePreviousPopupFocus($prevPopup, $target, returnTarget, openerId) {
	const $prevHeader = $prevPopup.find(".popup_head_title");
	const $prevContent = $prevPopup.find(".popup_cont");

	$prevPopup.attr("aria-hidden", "false");
	$prevPopup.find(".popup_inner").attr("aria-hidden", "false");

	let focusTarget;

	// returnTarget이 최우선
	if (returnTarget) {
		focusTarget = convertToJQuery(returnTarget);
	} else {
		// data-openerId를 가진 요소 검색
		const $openerElement = $('[data-triggerId="' + openerId + '"]');
		if ($openerElement.length > 0) {
			focusTarget = $openerElement;
		} else {
			// opener를 찾지 못한 경우, 이전 팝업의 헤더 또는 컨텐츠로 포커스 이동
			focusTarget = $prevHeader.length > 0 ? $prevHeader : $prevContent;
		}
	}

	if (focusTarget && focusTarget.length > 0) {
		focusTarget.attr("data-returnTarget", true);
		callReflow(focusTarget);

		setTimeout(() => {
			focusTarget.focus();
			setAriaLive(focusTarget);
			
			$target.attr("aria-hidden", "true");
			$target.find(".popup_inner").attr("aria-hidden", "true");
		}, 350);
	}

	if (window.popupGroup) {
		setTimeout(() => { $target.remove(); }, delay);
	}
	
	// 개발에서는 아래 구문을 주석 해제 바랍니다.
	// setTimeout(() => { $target.remove(); }, 1000);
}


// 바닥으로 포커스가 이동할 때
function handleMainContentFocus($target, returnTarget, openerId) {

	$(".wrap").attr("aria-hidden", "false").removeAttr('inert');
	$("body").css("overscroll-behavior", "auto").removeClass("scroll_lock");

	setTimeout(() => {
		let focusTarget;

		// returnTarget이 최우선
		if (returnTarget) {
			focusTarget = convertToJQuery(returnTarget);
		} else {
			// data-triggerId를 가진 요소 검색
			focusTarget = $('[data-triggerId="' + openerId + '"]');
		}

		if (focusTarget && focusTarget.length > 0) {
			focusTarget.attr('tabindex', 0).focus();
		}

		if (window.popupGroup) {
			setTimeout(() => { $target.remove(); }, delay);
		}
		
		// 개발에서는 아래 구문을 주석 해제 바랍니다.
		// setTimeout(() => { $target.remove(); }, 1000);


	}, 350);
}


//jQuery 객체로 변환
function convertToJQuery(element) {
	if (!element) return null;

	if (typeof element === 'string' || element instanceof HTMLElement) {
		return $(element);
	} else if (element instanceof jQuery) {
		return element;
	}
	
	console.log('제이쿼리 객체로 변환 실패');
	return null;
}


//접근성트리 업데이트
function callReflow($element) {
	console.log('element',$element);
	if ($element && $element.length > 0) {
		$element.css("display", "none");
		$element[0].offsetHeight; // 강제 reflow
		$element.css("display", "block");
	}
}



//포커스 이동을 스크린 리더에 알림
function setAriaLive($element) {
	if ($element && $element.length > 0) {
		$element.attr("aria-live", "assertive");
		setTimeout(() => {
			$element.attr("aria-live", null);
		}, 0);
	}
}


//동적 append 함수(퍼블 테스트용)
function attachPopup(newPopup) {
	const popupArea = $('.popup_area');
	if (window.popupGroup && window.popupGroup[newPopup]) {
		popupArea.append(window.popupGroup[newPopup]);
	}
}



//UUID 생성
function generateUUID() {	
	let d = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}