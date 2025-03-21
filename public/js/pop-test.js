
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
			$target.find('.popup_inner').attr('tabindex', '0').trigger('focus');
			$('.wrap').addClass('scroll_lock').attr('aria-hidden', true);
			$('.popup_wrap.active').attr('aria-hidden', true);
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

		console.log('closePop')
	
		const $lastPopup = $('.popup_wrap.active:last');
		if($lastPopup.length){
			// $lastPopup.attr('aria-hidden', false).find('.popup_inner').attr('tabindex', '0').focus();
			$lastPopup.attr('aria-hidden', false);
			setTimeout(function(){
				$lastPopup.find('.popup_inner').attr('tabindex', '0').trigger('focus').css('background', 'red');
			}, 100);
		}
	
		// $target.removeClass('active').attr('aria-hidden', true);
		$target.attr('aria-hidden', true);
		$target.find('.popup_inner').removeAttr('tabindex');
		$('body').removeAttr('style');
	
	
		// const popup_count = $('.popup_wrap[aria-hidden="false"]').length;
		const popup_count = $('.popup_wrap.active').length;
		if(popup_count <= 0){
			$('.wrap').removeClass('scroll_lock').attr('aria-hidden', false);
		}
	}
}
