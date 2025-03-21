

/* Popup 관련 */
// Popup 열기
function openPop2(target){
	console.log('openPop');
	const $target = $('#' + target);

	if($target.length){
		$('body').css('overscroll-behavior','contain');
		$target.addClass('active');

		//렌더링 후, focus 이동
		setTimeout(function(){
			// $target.find('.popup_inner').attr('tabindex', '0').trigger('focus');
			$target.find('.popup_inner').attr('tabindex', '0').focus();
			$('.wrap').addClass('scroll_lock').attr('aria-hidden', true);
			$('.popup_wrap2.active').attr('aria-hidden', true);
			$target.attr('aria-hidden', false);
		}, 200);
	}

	// bottom 팝업 - drag
	if($target.hasClass('bottom')){
		draggable($target);
	}
}

// Popup 닫기
function closePop2(target) {
	const $target = $('#' + target);

	if($target.hasClass('active')){
		$target.removeClass('active');

		console.log('closePop2')
	
		const $lastPopup = $('.popup_wrap2.active:last');
		if($lastPopup.length){
			// $lastPopup.attr('aria-hidden', false).find('.popup_inner').attr('tabindex', '0').focus();
			$lastPopup.attr('aria-hidden', false);
			setTimeout(function(){
				$lastPopup.find('.popup_inner .popup_head').attr('tabindex', '0').focus();
			}, 500);
		}
	
		// $target.removeClass('active').attr('aria-hidden', true);
		$target.attr('aria-hidden', true);
		$target.find('.popup_inner .popup_head').removeAttr('tabindex');
		$('body').removeAttr('style');
	
	
		// const popup_count = $('.popup_wrap[aria-hidden="false"]').length;
		const popup_count = $('.popup_wrap2.active').length;
		if(popup_count <= 0){
			$('.wrap').removeClass('scroll_lock').attr('aria-hidden', false);
		}
	}
}



// 팝업 영역 외 클릭 시 팝업 닫기
	$(document).on('click', '.popup_wrap2', function(e) {
		const $target = $(e.target);
		const $close_popup = $('.popup_wrap2.active[aria-hidden="false"] .popup_inner');
		
		if (!$target.closest($close_popup).length) {
			const $targetId = $target.closest('.popup_wrap2').attr('id');
			closePop2($targetId);
		}
	});