/* Popup 관련 */

class HD_Popup {

	$triggerEl;
	$target;
	$openerId;
	$header; //타이틀
	$content; //본문
	$popup_dim
	isOpen;// trigger 할 상태
	$closeBtn;
	

	constructor($triggerEl,target){

		this.isOpen = false;		
		this.$target = $('#' + target);
		this.$openerId = null;
		this.$popup_dim = this.$target.find('.popup_dim');
		this.$triggerEl = $($triggerEl).closest('.popup_wrap2').length > 0 ? $($triggerEl).closest('.popup_wrap2') : $triggerEl;
		this.$closeBtn = this.$target.find('.popup_close');
	};



	init(){
		//popup active

		this.isOpen = true;
		$('body').css('overscroll-behavior','contain');
		this.$target.addClass('active');

		// bottom 팝업일 경우 - drag
		if(this.$target.hasClass('bottom')){
			draggable(this.$target);
		}

		//닫기버튼 이벤트리스너 추가
		this.$target.find('.popup_close').on('click',(e)=>{
			this.close(e);
		});

		//dim 클릭 시 팝업 닫기
		this.$popup_dim.on('click',(e)=>{this.close(e)});

		this.createOpenerId().then(()=>{
			// this.focusMove();
			this.focusMove(this.$target, $('.popup_wrap2.active'));
		});
	}

	
	createOpenerId(){
		if(!this.$target.length) {console.log('target이 없습니다.'); return;}

		const getOpenerId = $(this.$triggerEl).attr('triggerId');
		if(!getOpenerId){
			this.$openerId= generateUUID();
			$(this.$triggerEl).attr('triggerId',this.$openerId);
		}else {
			this.$openerId=getOpenerId;
		}
		
		this.$target.attr('opener', this.$openerId);
		

		return new Promise((resolve, reject)=>{
			setTimeout(()=>{resolve('success'); console.log('success')},500);
		});
	}


	// //렌더링 후, focus 이동
	// focusMove(){	
	// 	console.log('focusMove - start');
	// 	this.$header = this.$target.find('.popup_inner').children('.popup_head');
	// 	this.$content = this.$target.find('.popup_inner').children('.popup_cont');

	// 	console.log('$header',this.$header);
	// 	console.log('$content',this.$content);

	// 	if(this.$header.length){
	// 		this.$header.attr('tabindex', '0').focus();
	// 	}else {
	// 		this.$content.attr('tabindex', '0').focus();
	// 	}

	// 	$('body').addClass('scroll_lock');
	// 	$('.wrap').attr('aria-hidden', true);
	// 	$('.popup_wrap2.active').attr('aria-hidden', true);
	// 	this.$target.attr('aria-hidden', false);
	// 	console.log('focusMove - end');
	// }


	//렌더링 후, focus 이동
	focusMove($getFocusTarget, $lossFocusTarget){	

		console.log('focusMove - start');
		console.log('document.activeElement',document.activeElement);

		// const $header = $getFocusTarget.find('.popup_inner').children('.popup_head');		
		// const $content = $getFocusTarget.find('.popup_inner').children('.popup_cont');
		const $header = $getFocusTarget.find('.popup_head');		
		const $content = $getFocusTarget.find('.popup_cont');

		$lossFocusTarget.attr('aria-hidden', true);
		$getFocusTarget.attr('aria-hidden', false);
		if($lossFocusTarget.find('.popup_cont')) $lossFocusTarget.find('.popup_cont').removeAttr('tabindex');
		if($lossFocusTarget.find('.popup_head')) $lossFocusTarget.find('.popup_head').removeAttr('tabindex');

		if($header.length){
			$header.attr('tabindex', '0');
			setTimeout(()=>{
				this.$closeBtn.blur();
				$header.focus(); 
				console.log('$header2-document.activeElement',document.activeElement);
				$header.focus();
			},400);			
			
		}else {
			console.log('$content2',$content)
			setTimeout(()=>{
				this.$closeBtn.blur();
				$content.attr('tabindex', '0').focus();
				console.log('$header2-document.activeElement',document.activeElement);
			},400);	
		}		
		
		if(this.isOpen){
			$('body').addClass('scroll_lock');
			$('.wrap').attr('aria-hidden', true);
		}
	
		console.log('focusMove - end');
		console.log('document.activeElement',document.activeElement);
	}


	//close popup
	close (event){
		console.log('close실행')
		this.isOpen = false;

		this.$target.removeClass('active').attr('opener',null);		

		event.currentTarget.blur();
		event.target.blur();

		this.$triggerEl.focus();
		
		if($(this.$triggerEl[0]).hasClass('popup_wrap2')){
			this.focusMove(this.$triggerEl, this.$target);
			
		}else{
			$('.wrap').attr('aria-hidden', false);
			$('body').removeClass('scroll_lock')
			
			setTimeout(()=>{this.$triggerEl.focus();},400);
		}
		
		console.log('마지막-document.activeElement',document.activeElement);
		

		// if($lastPopup.length){			
		// 	const $lastPop_header = $lastPopup.find('.popup_head')[0];
		// 	const $lastPop_cont = $lastPopup.find('.popup_cont')[0];
		// 	$lastPopup.attr('aria-hidden', false);
		// 	this.$target.attr('aria-hidden', true);

		// 	setTimeout(()=>{
		// 		console.log('닫기이벤트 : focus move-start')
		// 		console.log('document.activeElement',document.activeElement);
		// 		if($lastPop_header){
		// 			// $lastPop_header.attr('tabindex', '0').focus();
		// 			$lastPop_header.setAttribute('tabindex', '0');
		// 			$lastPop_header.focus();
		// 		}else {
		// 			// $lastPop_cont.attr('tabindex', '0').focus();
		// 			$lastPop_cont.setAttribute('tabindex', '0');
		// 			$lastPop_cont.focus();
		// 		}
				
		// 		console.log('닫기이벤트 : focus move-end')
		// 	}, 400);
		// }
	};

};


function openPop2($triggerEl,target){

	const myPopup = new HD_Popup($triggerEl,target);
	myPopup.init();

}


// Popup 열기
// function openPop2($triggerEl,target){

// 	console.log('openPop2');


// 	const $target = $('#' + target);


// 	if($target.length){
// 		const getOpenerId = $($triggerEl).attr('triggerId');
// 		let openerId;

// 		if(!getOpenerId){
// 			openerId= generateUUID();
// 			$($triggerEl).attr('triggerId',openerId);
// 		}else {
// 			openerId=getOpenerId;
// 		}
		
// 		$target.attr('opener', openerId);
// 		$('body').css('overscroll-behavior','contain');
// 		$target.addClass('active');

// 		//렌더링 후, focus 이동
// 		setTimeout(function(){
// 			const $pop_header = $target.find('.popup_inner').children('.popup_head'),
// 				$pop_cont = $target.find('.popup_inner').children('.popup_cont');

// 			console.log('$pop_header',$pop_header);
// 			console.log('$pop_cont',$pop_cont);

// 			if($pop_header.length){
// 				$pop_header.attr('tabindex', '0').focus();
// 			}else {
// 				$pop_cont.attr('tabindex', '0').focus();
// 			}
// 			$('body').addClass('scroll_lock');
// 			$('.wrap').attr('aria-hidden', true);
// 			$('.popup_wrap2.active').attr('aria-hidden', true);
// 			$target.attr('aria-hidden', false);
// 		}, 400);
// 	}

// 	// bottom 팝업 - drag
// 	if($target.hasClass('bottom')){
// 		draggable($target);
// 	}
// }

// Popup 닫기
// function closePop2(target) {
// 	const $target = $('#' + target);
// 	const $opener = $('[triggerId="'+$target.attr('opener')+'"]');
// 	const $pop_header = $target.find('.popup_inner').children('.popup_head'),
// 				$pop_cont = $target.find('.popup_inner').children('.popup_cont');

// 	if($target.hasClass('active')){
// 		$target.removeClass('active').attr('opener',null);

// 		// console.log('closePop')
	
// 		const $lastPopup = $('.popup_wrap2.active:last');
// 		console.log('$lastPopup',$lastPopup);
// 		if($lastPopup.length){
// 			$lastPopup.attr('aria-hidden', false);
// 			setTimeout(function(){
// 				const $lastPop_header = $lastPopup.find('.popup_head'),
// 							$lastPop_cont = $lastPopup.find('.popup_cont');
// 				if($lastPop_header.length){
// 					$lastPop_header.attr('tabindex', '0').focus();
// 				}else {
// 					$lastPop_cont.attr('tabindex', '0').focus();
// 				}
// 			}, 400);
// 		}
	
// 		// $target.removeClass('active').attr('aria-hidden', true);
// 		$target.attr('aria-hidden', true);
		
// 		console.log('document.activeElement',document.activeElement);
// 		// $target.find('.popup_inner').removeAttr('tabindex');
// 		if($pop_header.length){
// 			$pop_header.removeAttr('tabindex');
// 		}else {
// 			$pop_cont.removeAttr('tabindex');
// 		}
// 		$('body').removeAttr('style');
	
	
// 		// const popup_count = $('.popup_wrap[aria-hidden="false"]').length;
// 		const popup_count = $('.popup_wrap2.active').length;
// 		console.log('active된 팝업', $('.popup_wrap2.active:last').attr('opener'))
// 		if(popup_count <= 0){
// 			console.log('여기')
// 			$('body').removeClass('scroll_lock')
// 			// .attr('aria-hidden', false);
// 			setTimeout(()=>{$opener.focus();},400);
// 		}
// 	}
// }

// 팝업 영역 외 클릭 시 팝업 닫기
// function dimClick2(){

// 	console.log('dim클릭')




	// $(document).on('click', '.popup_wrap2', function(e) {
	// 	e.stopPropagation();
	// 	const $target = $(e.target);
	// 	const $close_popup = $('.popup_wrap2.active[aria-hidden="false"] .popup_inner');
		
	// 	if (!$target.closest($close_popup).length) {
	// 		const $targetId = '#'+$target.closest('.popup_wrap2').attr('id');
	// 		console.log('$targetId',$targetId);

	// 		const $closeBtn = $($targetId).find('.popup_close')

	// 		console.log('$closeBtn',$closeBtn);
	// 		$closeBtn.trigger('click');



	// 		// closePop($targetId);
	// 	}
	// });
// }

// UUID생성
// function generateUUID() {
//     var d = new Date().getTime();
//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = (d + Math.random()*16)%16 | 0;
//         d = Math.floor(d/16);
//         return (c=='x' ? r : (r&0x3|0x8)).toString(16);
//     });
//     return uuid;
// };


// $(function(){
	// document.addEventListener('focusin', function() {
	// 	setTimeout(()=>{
	// 	// 현재 포커스된 요소를 가져오기
	// 	const focusedElement = document.activeElement;

	// 	// 포커스된 요소의 class명을 class 'a'를 가진 div에 텍스트로 표시
	// 	const classNameDiv = document.querySelector('.focus_name');
	// 	classNameDiv.textContent = focusedElement.className; // class명을 텍스트로 설정
	// 	},500)
		
	// });
// });