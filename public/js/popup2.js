/* Popup 관련 */
// Popup 열기
function openPop2($triggerEl,target){

	console.log('openPop2');


	const $target = $('#' + target);


	if($target.length){
		const getOpenerId = $($triggerEl).attr('triggerId');
		let openerId;

		if(!getOpenerId){
			openerId= generateUUID();
			$($triggerEl).attr('triggerId',openerId);
		}else {
			openerId=getOpenerId;
		}
		
		$target.attr('opener', openerId);
		$('body').css('overscroll-behavior','contain');
		$target.addClass('active');

		//렌더링 후, focus 이동
		setTimeout(function(){
			const $pop_header = $target.find('.popup_inner').children('.popup_head'),
				$pop_cont = $target.find('.popup_inner').children('.popup_cont');

			console.log('$pop_header',$pop_header);
			console.log('$pop_cont',$pop_cont);

			if($pop_header.length){
				$pop_header.attr('tabindex', '0').focus();
			}else {
				$pop_cont.attr('tabindex', '0').focus();
			}
			$('body').addClass('scroll_lock');
			$('.wrap').attr('aria-hidden', true);
			$('.popup_wrap2.active').attr('aria-hidden', true);
			$target.attr('aria-hidden', false);
		}, 400);
	}

	// bottom 팝업 - drag
	if($target.hasClass('bottom')){
		draggable($target);
	}
}

// Popup 닫기
function closePop2(target) {
	const $target = $('#' + target);
	const $opener = $('[triggerId="'+$target.attr('opener')+'"]');
	const $pop_header = $target.find('.popup_inner').children('.popup_head'),
				$pop_cont = $target.find('.popup_inner').children('.popup_cont');

	if($target.hasClass('active')){
		$target.removeClass('active').attr('opener',null);

		// console.log('closePop')
	
		const $lastPopup = $('.popup_wrap2.active:last');
		console.log('$lastPopup',$lastPopup);
		if($lastPopup.length){
			$lastPopup.attr('aria-hidden', false);
			setTimeout(function(){
				const $lastPop_header = $lastPopup.find('.popup_head'),
							$lastPop_cont = $lastPopup.find('.popup_cont');
				if($lastPop_header.length){
					$lastPop_header.attr('tabindex', '0').focus();
				}else {
					$lastPop_cont.attr('tabindex', '0').focus();
				}
			}, 400);
		}
	
		// $target.removeClass('active').attr('aria-hidden', true);
		$target.attr('aria-hidden', true);
		
		console.log('document.activeElement',document.activeElement);
		// $target.find('.popup_inner').removeAttr('tabindex');
		if($pop_header.length){
			$pop_header.removeAttr('tabindex');
		}else {
			$pop_cont.removeAttr('tabindex');
		}
		$('body').removeAttr('style');
	
	
		// const popup_count = $('.popup_wrap[aria-hidden="false"]').length;
		const popup_count = $('.popup_wrap2.active').length;
		console.log('active된 팝업', $('.popup_wrap2.active:last').attr('opener'))
		if(popup_count <= 0){
			console.log('여기')
			$('body').removeClass('scroll_lock')
			// .attr('aria-hidden', false);
			setTimeout(()=>{$opener.focus();},400);
		}
	}
}

// 팝업 영역 외 클릭 시 팝업 닫기
function dimClick2(){
	$(document).on('click', '.popup_wrap2', function(e) {
		const $target = $(e.target);
		const $close_popup = $('.popup_wrap2.active[aria-hidden="false"] .popup_inner');
		
		if (!$target.closest($close_popup).length) {
			const $targetId = $target.closest('.popup_wrap2').attr('id');
			closePop($targetId);
		}
	});
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


$(function(){
	dimClick2();

	document.addEventListener('focusin', function() {
		setTimeout(()=>{
		// 현재 포커스된 요소를 가져오기
		const focusedElement = document.activeElement;

		// 포커스된 요소의 class명을 class 'a'를 가진 div에 텍스트로 표시
		const classNameDiv = document.querySelector('.focus_name');
		classNameDiv.textContent = focusedElement.className; // class명을 텍스트로 설정
		},500)
		
	});
});