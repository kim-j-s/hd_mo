/* Popup 관련 */

/**
 * openHDPopup
 * popup ui를 오픈하는 함수(접근성 대응)
 * 
 * @param {object} $triggerEl [필수]팝업을 호출한 DOM(팝업이 닫힌 뒤에 포커스할 엘리먼트)
 * @param {string} target [필수]Open할 popup id
 * @returns {void}
 */
function openHDPopup($triggerEl, target) {
	if(target==undefined || target==null){	
		console.log('오픈할 팝업 타겟이 없습니다.')
		return false;
	}

	// s: 퍼블테스트용 (개발단에서는 삭제해주세요.)
	if(window.popupGroup) {
		attachPopup(target);
	}
	// e: 퍼블테스트용 (개발단에서는 삭제해주세요.)

	let $target = $("#" + target);
	
	let $header = $target.find(".popup_head_title").length > 0 ? $target.find(".popup_head_title") : null;
	let $content = $target.find(".popup_cont").length > 0 ? $target.find(".popup_cont") : null;

	const getOpenerId = $($triggerEl).attr('triggerId');
	let openerId;

	if(!getOpenerId){
		openerId= generateUUID();
		$($triggerEl).attr('triggerId',openerId);
	}else {
		openerId=getOpenerId;
	}
	
	$target.attr('opner', openerId);

	if($(".wrap").attr("aria-hidden")==undefined || $(".wrap").attr("aria-hidden")=='false'){
		$(".wrap").attr("aria-hidden", "true");
		$(".wrap").attr("inert",'');
	}
	
	//popup active
	$("body").css("overscroll-behavior", "contain");
	$("body").addClass("scroll_lock");
	$target.addClass("active");

	// bottom 팝업일 경우 - drag
	if ($target.hasClass("bottom")) {
		draggable($target);
	}

	$target.attr("aria-hidden", "false");
	$target.find(".popup_inner").attr("tabindex", 0).attr("aria-hidden", "false");

	if ($header) $header.attr("tabindex", 0);
	if ($content) $content.attr("tabindex", 0);

	const focusTarget = $header || $content;

	const activePopups = $(".popup_wrap.active").not($target);
	if(focusTarget) {
		focusTarget.css("display", "none");
		focusTarget[0].offsetHeight; //강제 reflow
		focusTarget.css("display", "block");
	}

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
 * - popup ui를 제거하는 함수(접근성 대응)
 * @param {string} target [필수]close할 popup id
 * @param {object} [returnTarget] [선택]팝업이 닫힌 뒤에 포커스할 엘리먼트(하단에 다른 팝업이 존재할 경우 사용x)
 * @returns {void}
 */
function closeHDPopup(target, returnTarget=null) {

	let $target = $("#" + target);
	const $opener = $('[triggerId="'+$target.attr('opner')+'"]');
	const $triggerEl = returnTarget || $opener;
	$target.removeClass("active");

	//하단에 다른 팝업이 열려있는 경우, 가장 최근 팝업으로 focus강제 이동
	const $prevPopup = $(".popup_wrap.active:last");
	if ($prevPopup.length > 0) {
		const $prevHeader = $($prevPopup).find(".popup_head_title").length > 0 ? $($prevPopup).find(".popup_head_title") : null;
		const $prevContent = $($prevPopup).find(".popup_cont").length > 0 ? $($prevPopup).find(".popup_cont") : null;

		$($prevPopup).attr("aria-hidden", "false");
		$($prevPopup).find(".popup_inner").attr("aria-hidden", "false");

		const focusTarget = $prevHeader || $prevContent;
		focusTarget.attr("data-returnTarget",true);


		// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
		focusTarget.css("display", "none");
		focusTarget[0].offsetHeight; //강제 reflow
		focusTarget.css("display", "block");

		setTimeout(() => {
			focusTarget.focus();
			focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

			setTimeout(() => {
				focusTarget.attr("aria-live", null);
			}, 0);

				$target.attr("aria-hidden", "true");
				$target.find(".popup_inner").attr("aria-hidden", "true");
		}, 350);


		// s: 퍼블테스트용 (개발단에서는 삭제해주세요.)
		if(window.popupGroup) {
			setTimeout(()=>{ $target.remove()},1000);			
		}
		// e: 퍼블테스트용 (개발단에서는 삭제해주세요.)
		
		// s: 개발에서는 이 구문을 주석 해제 바랍니다.
		// setTimeout(()=>{ $target.remove()},1000);			
		// e: 개발에서는 이 구문을 주석 해제 바랍니다.
		

	} else {
		$(".wrap").attr("aria-hidden", "false");
		$(".wrap").removeAttr('inert');
		$("body").css("overscroll-behavior", "auto");
		$("body").removeClass("scroll_lock");

		setTimeout(() => {

			$triggerEl.attr('tabindex',0).focus();

			// s: 퍼블테스트용 (개발단에서는 삭제해주세요.)
			if(window.popupGroup) {
				setTimeout(()=>{ $target.remove()},400);			
			}
			// e: 퍼블테스트용 (개발단에서는 삭제해주세요.)


			// s: 개발에서는 이 구문을 주석 해제 바랍니다.
			// setTimeout(()=>{ $target.remove()},1000);			
			// e: 개발에서는 이 구문을 주석 해제 바랍니다.

		}, 350);
	}
}


//동적 append 함수(퍼블 테스트용)
function attachPopup (newPopup) {
	const popupArea = $('.popup_area');
	popupArea.append(window.popupGroup[newPopup]);
}


// UUID생성
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


/* Toast 팝업 */
let toastTimer = null;
function toastAction(click) {
	const $toast = $(".toast_wrap"),
		msg = $(click).data("msg");

	if (toastTimer != undefined) return;
	// console.log(toastTimer);

	$toast.find(".toast_msg").text("");
	toastMsg(msg);
	$toast.addClass("active");

	// clearTimeout(toastTimer);

	toastTimer = setTimeout(function () {
		$toast.removeClass("active");
		toastTimer = undefined;
	}, 1200);
}

function toastMsg(msg) {
	// const text = $('<div class='toast_msg'></div>').text(msg);
	$(".toast_msg").text(msg);
}