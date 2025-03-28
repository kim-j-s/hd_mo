/* Popup 관련 */

// Popup 열기

let pop_start = null;

function openPop(element, target) { // `element`를 첫 번째 매개변수로 변경
	const $target = $('#' + target);
	// console.log('열어요 target : ', target);

	// 팝업이 아닌 경우 출발자를 지정 - 고유
	if (!$(element).closest('.popup_wrap').length) {
			$(element).css('background', 'red'); // 클릭한 버튼의 배경색 변경
			pop_start = $(element);
			// console.log('pop_start : ', pop_start);
			// 접근성에 맞추어 body에 속성 추가
			$("body").css("overscroll-behavior", "contain").addClass("scroll_lock");
	} else {
		let pid = $(element).closest('.popup_wrap').attr('id');
		// 팝업에서 팝업이 활성화 된 경우 추척표시		
		$target.attr('data-popmark', pid);
	}

	// 팝업 활성화
	$target.addClass('active');
	$target.attr("aria-hidden", false);

	setTimeout(function(){
		if ( $target.find('.popup_head').length ) {
			$target.find('.popup_head').attr("tabindex", "0").css('outline', 'none').focus();
		} else {
			$target.find('.popup_cont').attr("tabindex", "0").css('outline', 'none').focus();
		}
		// aria-hidden
		if (!$(element).closest('.popup_wrap').length) {
			// 바닥에서 출발한 경우
			$(".wrap").attr("aria-hidden", true);
		} else {
			// 팝업에서 출발한 경우
			const beforeId = $target.attr('data-popmark');
			$('#' + beforeId).attr("aria-hidden", true);
			$('#' + beforeId).find(".popup_head").removeAttr("tabindex").removeAttr("style");
			$('#' + beforeId).find(".popup_cont").removeAttr("tabindex").removeAttr("style");
		}
	}, 1000);
}




// Popup 닫기
function closePop(close_target) {
	const $close_target = $('#' + close_target);

	// $close_target.removeClass('active');

	// 마지막 닫히는 팝업인지 확인하기 위한 절차
	if (!$close_target.attr('data-popmark')) {
		$("body").removeClass("scroll_lock").removeAttr("style");
		$(".wrap").attr("aria-hidden", false);
		// pop_start로 돌아간다.
		$(pop_start).focus();

		$close_target.removeAttr('data-popmark');
		$close_target.removeClass('active');
		$close_target.attr("aria-hidden", true);

	} else {
		// 남겨진 흔적 역추적
		const beforeId = $close_target.attr('data-popmark');

		const $beforeTarget = $('#' + beforeId);
		$beforeTarget.attr("aria-hidden", false);

		if ( $beforeTarget.find('.popup_head').length ) {
			$beforeTarget.find('.popup_head').attr("tabindex", "0").css('outline', 'none').focus();
		} else {
			$beforeTarget.find('.popup_cont').attr("tabindex", "0").css('outline', 'none').focus();
		}


		$close_target.removeAttr('data-popmark');
		$close_target.removeClass('active');
		$close_target.attr("aria-hidden", true);
	}
		
}





// 팝업 영역 외 클릭 시 팝업 닫기
function dimClick(){
	$(document).on('click', '.popup_wrap', function(e) {
		const $target = $(e.target);
		const $close_popup = $('.popup_wrap.active[aria-hidden="false"] .popup_inner');
		
		if (!$target.closest($close_popup).length) {
			const $targetId = $target.closest('.popup_wrap').attr('id');
			closePop($targetId);
		}
	});
}


/* Toast 팝업 */
let toastTimer = null;
function toastAction(click){
	const $toast = $('.toast_wrap'),
				msg = $(click).data('msg');

	if(toastTimer != undefined) return;
	// console.log(toastTimer);

	$toast.find('.toast_msg').text('');
	toastMsg(msg);
	$toast.addClass('active');

	// clearTimeout(toastTimer);

	toastTimer = setTimeout(function(){
		$toast.removeClass('active');
		toastTimer = undefined;
	}, 1200);
}

function toastMsg(msg){
	// const text = $('<div class='toast_msg'></div>').text(msg);
	$('.toast_msg').text(msg);
}


// UUID생성
/* 추후
function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};
*/