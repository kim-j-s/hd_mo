(function() {  
  const $DOM = $(document),
        $WIN = $(window),
        wHeight = $WIN.height();

  /* 전체메뉴 */
  $DOM.on('click', '.header .right [class^=allmenu]', function(){
    const $this = $(this),
          $nav = $this.closest('.header_inner').find('.nav_menu_wrap');

    // if($nav.css('visibility') == 'hidden'){
		if(!$nav.hasClass('active')){
			$('body').addClass('scroll_lock');
				$nav.addClass('active');

			setTimeout(function(){
				$nav.find('.nav_menu_inner').attr('tabindex', '0').focus();
				$('.right .allmenu').attr('aria-hidden', 'true');
				$nav.attr('aria-hidden', 'false');
				$('.header_inner').find('*').not('.nav_menu_wrap, .right, .right *').attr('aria-hidden', 'true');
				$('.wrap').children().not('.header').attr('aria-hidden', 'true');
			}, 400);
			// const at = document.activeElement;
			// const name = at.className;
			// $('.nav_menu_bottom').text(name);
    }else {
      $('.header .allmenu').focus();
			$nav.find('.nav_menu_inner').removeAttr('tabindex');
			$('.header_inner').find('*').not('.nav_menu_wrap, .right, .right *').attr('aria-hidden', 'false');
			$('.right .allmenu').attr('aria-hidden', 'false');
			$('.wrap').children().not('.header').attr('aria-hidden', 'false');
      $nav.removeClass('active').attr('aria-hidden', 'true');
			$('body').removeClass('scroll_lock');
			$('.wrap').removeAttr('aria-hidden');
    }
  });


  /* Accordion */   
  $DOM.on('click', '.acd_item .acd_head .acd_btn', function(){
		// console.log('아코디언');
    const $this = $(this),
					$head = $this.parent('.acd_head'),
          $inner = $head.next('.acd_cont').children('.inner'),
          $click_item = $head.parent('.acd_item');

    if($inner.css('display') == 'none'){
      $click_item.children('.acd_head').removeClass('active').children('.acd_btn').attr('aria-expanded', 'false');
      $click_item.children('.acd_cont').children('.inner').hide();
      $head.addClass('active');
			$this.attr('aria-expanded', 'true');
      $inner.slideDown();

			// if($this.closest('.acd_item').parent().hasClass('input_item_wrap')){
			// 	$this.closest('.acd_item').addClass('open')
			// }
    }else {
			$this.attr('aria-expanded', 'false');
      $head.removeClass('active');
      $inner.slideUp();

			// if($this.closest('.acd_item').parent().hasClass('input_item_wrap')){
			// 	$this.closest('.acd_item').removeClass('open')
			// }
    }
  });


  /* Tooltip */
  $DOM.on('click', '.tooltip_wrap button', function(){
    const $click = $(this).closest('.tooltip_wrap'),
					$t_head = $click.children('.tooltip_head'),
					$t_text = $click.find('.tooltip_panel').children('.inner'),
					$focus_btn = $click.find('.open');

			if($(this).hasClass('open')){
				$('.tooltip_wrap .tooltip_head').removeClass('active').find('.open').attr('aria-expanded', 'false');
				$t_head.addClass('active').find('.open').attr('aria-expanded', 'true');
				$('.tooltip_wrap .tooltip_panel .inner').hide();
				$t_text.css('display', 'block').focus();
			}else {
				$('.tooltip_wrap .tooltip_head').removeClass('active').find('.open').attr('aria-expanded', 'false');
				$('.tooltip_wrap .tooltip_panel .inner').hide();
				$focus_btn.focus();
			}
  });


  /* Input */
  $DOM.on('focus input', '.input_text .inp > input', function(){
    const $this = $(this),
          $wrap = $this.closest('.inp'),
          $del = $this.siblings('.del'),
		  isDisabled = $this.prop('disabled'),
		  isReadonly = $this.prop('readonly');
		let val = $this.val();
      
    if($del.length) {
      $del.attr('tabindex', '0');
    }

		if (!isDisabled && !isReadonly) {
			if(val){
				$del.show();
			}else {
				$wrap.removeClass('active');
				$del.hide();
			}
		}
		
    $('.input_text .inp').removeClass('active').children('.del').hide();
    $wrap.addClass('active');
    $del.show();

    // (this.value) ? $wrap.addClass('active'):$wrap.removeClass('active');

		//전화번호
		if($this.closest('.input_text').hasClass('phone')){
			if(val){
				const newVal = val.replace(/ - /g, '');
				$this.attr('maxlength', 8);
				$this.val(newVal).removeClass('isVal');
			}
		}
    
  }).on('blur', '.inp > input', function(){
    const $this = $(this),
		  		$del = $this.siblings('.del'),
          $wrap = $this.closest('.inp');
		let val = $this.val(),
				newVal = 0;

		setTimeout(() => {
			$del.hide();
			$wrap.removeClass('active');
		}, 100);

		// 전화번호
		if($this.closest('.input_text').hasClass('phone')){
			$this.attr('maxlength', 14);
			if(val){
				val = val.replace(/[^0-9]/g, '');
				newVal = ' - ' + val.replace(/(\d{4})(?=\d)/g, '$1 - ');
				$this.val(newVal).addClass('isVal');
			}else {
				$this.removeClass('isVal');
			}
		}

  }).on('click', '.inp > .del', function(e){
    const $this = $(this);
    e.preventDefault();
	
	setTimeout(() => {
		$this.hide();
		$this.siblings('input').val('').focus();
	}, 100);

		if($this.closest('.comp_wrap').hasClass('phone')){
			$this.siblings('input').removeClass('isVal');
		}
  });
	
	// comma
	$DOM.on('keyup', '.price .inp input, .comma .inp input', function()	{
		const $this = $(this),
					$val = $this.val();
		$this.val($val.replace(/[^0-9]/gi, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
	});

	// file
	$DOM.on('change', '.inp_file input[type=file]', function() {
		const fileName = $(this).val().split('\\').pop();
		$(this).closest('.inp_file').find('.file_name').text(fileName);
	});

	// 약관 동의
	const $chkAll = function(click){
    const $group = click.closest('.chk_group_wrap'),
          $total = $group.find('.chk_point:not(:disabled)').length,
          $chked = $group.find('.chk_point:not(:disabled):checked').length;

    if ($total === $chked) {
      $group.find('.chk_point_all').prop('checked', true);
    } else {
      $group.find('.chk_point_all').prop("checked", false);
    }
  }

  $DOM.on('change', '.chk_group_wrap .chk_point', function () {
    const $sub_status = $(this).is(":checked"),
          $sub_list = $(this).closest('.inp_checkbox').find('.chk_lby');

    if ($sub_status) {
      $sub_list.find('.chk_point_sub:not(:disabled)').prop('checked', true);
    }else {
      $sub_list.find('.chk_point_sub:not(:disabled)').prop('checked', false);
    }
    $chkAll($(this));

  }).on('change', '.chk_group_wrap .chk_point_sub', function () {
    const $group_sub = $(this).closest('.chk_list'),
          $sub_total = $group_sub.find('.chk_point_sub:not(:disabled)').length,
          $sub_chked = $group_sub.find('.chk_point_sub:not(:disabled):checked').length;

    if ($sub_chked === $sub_total) {
			$group_sub.closest('.inp_checkbox').find('.chk_point').prop('checked', true);
			
    }else {
			$group_sub.closest('.inp_checkbox').find('.chk_point').prop('checked', false);
    }
    $chkAll($(this));

  }).on('change', '.chk_group_wrap .chk_point_all', function () {
    const allChked = $(this).is(":checked");

    if (allChked) {
      $(this).closest('.chk_group_wrap').find('input[type=checkbox]:not(:disabled)').prop('checked', true);
    } else {
      $(this).closest('.chk_group_wrap').find('input[type=checkbox]:not(:disabled)').prop('checked', false);
    }
  })
	// 약관 동의
  	
	
	//toggle-swich
	$DOM.on('change', '.inp_checkbox input[role="switch"]', function(){
		$isChecked = $(this).is(":checked");
		$(this).attr('aria-checked', $isChecked ? 'true' : 'false');
	});
	
  /* Textarea */
	// byte check
  $DOM.on('blur keyup', '.byte_check > textarea', function(){
    const str = $(this).val(),
          str2 = '',
          maxByte = 500;

		let rlen = 0,
				one_char = '',
				strLng = str.length,
				rbyte = 0;

    for(let i=0; i<strLng; i++){
      one_char = str.charAt(i);
      if(escape(one_char).length > 4){
        rbyte += 2;
      }else {
        rbyte++;
      }

      if(rbyte <= maxByte){
        rlen = i+1;
      }
    }

    if(rbyte > maxByte){
      str2 = str.substr(0,rlen);
      $(this).val(str2);
    }else {
      $(this).next().find('em').html(rbyte);
    }
  });

	// length check
	$DOM.on('keyup', '.length_check > textarea', function (e){
    const str = $(this).val(),
					$count = $(this).next('.counter').find('em');

    if(str.length == 0 || str == ''){
      $count.text('0');
    }else{
			$count.text(str.length);
    }

    if (str.length > 500) {
    	$(this).val($(this).val().substring(0, 500));
		}
  });


	/* Tab */
	$DOM.on('click', '.tab_btn:not(.tab_btn_block)', function(){
		const idx = $(this).index();
		$(this).closest('[class^=tab_wrap_list]').children('.tab_btn').removeClass('active').attr('aria-selected', 'false');
		$(this).addClass('active').attr('aria-selected', 'true');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').removeClass('active');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').eq(idx).addClass('active');
	});


	// select_driver
	$DOM.on('change', '.select_driver_range input[type="radio"]', function(){
		const $relGroup = $('.driver_relationship_state').find('.relationship_box');
		const idx = $(this).closest('.inp_radio').index() + 1;
		let newClass = 'pick' + idx;

		$relGroup.removeAttr('class').addClass('relationship_box ' + newClass);
	})


	//radio_comb(2개의 라디오 버튼 중 택1 콤비네이션)
	$DOM.on('change', '.radio_comb input[type="radio"]', function(){
		const parentCont = $(this).closest('.radio_comb');

		if(parentCont.length > 0){
			parentCont.removeClass('origin').addClass('active');
		}
	});

	// $DOM.on('change', '.select_driver_range input[type="radio"]', function(){
	// 	const $relGroup = $('.ouput_driver_relationship').find('.rel_group')
	// 	let chkNum = $(this).attr('data-num');

	// 	if(chkNum){
	// 		chkNum = chkNum.split(',');
	// 	}else {
	// 		return;
	// 	}

	// 	console.log(chkNum);

	// 	$relGroup.children('div').each(function(){
	// 		const $this = $(this),
	// 					thisNum = $this.attr('data-num'),
	// 					numSrc = $this.find('img').attr('src'),
	// 					newFile = numSrc.substring(0, numSrc.lastIndexOf('.'));

	// 		// console.log('chkNum' + chkNum, 'num' + num);
	// 		// console.log(numSrc)

	// 		if (chkNum.includes(thisNum)) {
	// 			$this.addClass('active');
	// 			$this.find('img').attr('src', newFile + '_on.' + /[^.]+$/.exec(numSrc));
	// 	} else {
	// 			// chkNum에 해당하지 않는 div에 대해서는 '_on'을 삭제
	// 			if (numSrc.includes('_on')) {
	// 					const originalSrc = numSrc.replace('_on', '');
	// 					$this.find('img').attr('src', originalSrc);
	// 			}
	// 	}

	// 		// numCase.addClass('active');
	// 		// numCase.find('img').attr('src', newFile + '_on.' + /[^.]+$/.exec(numSrc));
	// 	});
	// })
})();


// prograss
function prograssBar(){
	const $card = $('.card_item');

	$card.each(function(){
		const $this = $(this),
					$bar = $this.find('.insurance_policyBox .progress_box .ing');

		if($this.find('.insurance_policyBox .progress_box').length > 0){
			const marginLeft = parseFloat($bar.css('margin-left'));
			const barBoxWidth = $bar.closest('.progress_box').width();
			const barWidth = $bar.width();
			const infoWidth = $bar.find('.start').width();
			const total = marginLeft + barWidth;

			// console.log(marginLeft, barWidth, total, '/'+ barBoxWidth);

			if(marginLeft <= 37){
				$bar.find('.start').addClass('left');
			}

			if(barBoxWidth <= total){
				$bar.find('.end').addClass('right');
			}
		}
	})
}


/* Tab Scroll */
// 탭 버튼 클릭 시 중앙에 위치하는 기능 - 접근성 관련 기능
function tabScroll(){
	let scrollPosition = 0;

	$('.tab_scroll_box').on('scroll', function() {
		scrollPosition = $(this).scrollLeft();
		// $('#scroll_position span').text(scrollPosition);
	});

	$('.tab_scroll_box .tab_btn').on('click', function(){
		const $this = $(this),
					$scrollBox = $this.closest('.tab_scroll_box')
					$scrollList = $scrollBox.children('.scroll');

		const btn_offset = $this.offset().left - 20,
					scrollBox_offset = $scrollBox.offset().left,
					scrollBox_w = $scrollList.width();
		let scrollMove = btn_offset + scrollPosition - ($scrollBox.width() / 2) + ($this.outerWidth() / 2);

		// console.log('move : ' + scrollMove);
		// console.log('버튼 위치 : ' + btn_offset, '스크롤 위치 : ' + scrollPosition);
		$scrollBox.animate({
			scrollLeft: scrollMove
		}, 200);
	})
}

// 최근설계내역
function currentPlan() {
	const $bottom = $('.bottom_fix_wrap'),
				$bottom_h = $bottom.outerHeight(),
				$plan_area = $('.fixed_link_wrap'),
				$link_btn = $plan_area.find('.link_btn_box').children('.btn_current'),
				$close_btn = $plan_area.find('.link_btn_box').children('.link_close');

	if($bottom.length) {
		$plan_area.css('bottom', $bottom_h + 12);
	}

	$(document).on('click', '.link_btn_box .link_close', function(){
		$(this).closest('.fixed_link_wrap').remove();
	});
}

function fixedMenuPlay() {
	const $state = $('.fixed_link_wrap').find('.current_state');

	setTimeout(function(){
		$state.addClass('effect');
	}, 500);
	
	$state.one('transitionend', function () {
		setTimeout(function(){
			$state.removeClass('effect').attr('aria-hidden', 'true');

			setTimeout(function(){
				$state.hide();
			}, 500);
		}, 3000);
	});
}

$(function(){
	// tab Scroll
	tabScroll();

	currentPlan();
	fixedMenuPlay();

	//input disabled&readonly
	$('.input_text input').each(function() {
		const $this = $(this),
			  $wrapBox = $this.closest('.comp_wrap'),
			  $wrapCard = $this.closest('.card'),
			  $inpBox = $this.closest('.input_text'),
			  $wrapCalendar = $this.closest('.calendar'),
			  isDisabled = $this.prop('disabled'),
			  isReadonly = $this.prop('readonly');
	
		if (isReadonly) {
			if($wrapCard.length) {
				$wrapBox.addClass('readonly');
			} else if($wrapCalendar.length) {
				$this.siblings('.calendar_call').prop('disabled', true);
			} 
			if(!$wrapBox.length) {
				$inpBox.addClass('readonly');
			}
		} 
		if (isDisabled) {
			if($wrapCard.length) {
			  	$wrapBox.addClass('disabled');
			} else if($wrapCalendar.length) {
				$this.siblings('.calendar_call').prop('disabled', true);
			}
			if(!$wrapBox.length) {
				$inpBox.addClass('disabled');
			}
		}
	});
	// 달력 호출
	$.datepicker.setDefaults({
		dateFormat: 'yy.mm.dd',
		prevText: '이전 달',
		nextText: '다음 달',
		showOn: "none",
		showOtherMonths: true,
		showMonthAfterYear: true,
		yearSuffix: "년",
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
		showAnim: "slideDown",
		duration: 300,
		beforeShow: function () { 
			$("body").append('<div class="modal_backdrop"></div>');
			setTimeout(function(){
				$("body").addClass('modal_open');
			},50);
		},
		onClose: function() { 
			setTimeout(function(){
				$('.modal_backdrop').remove();
			},200);
			$("body").removeClass('modal_open')
		}
	});

	// $(".inp_picker:not([readonly])").datepicker({
	// 	disabled: false  // 기본값 override
	// });

	// $(".calendar_call").on("click", function () {
	// 	$(this).siblings(".inp_picker").datepicker("show"); // 정확한 input만 targeting
	// });

	$(".inp_picker").datepicker();


	$(".calendar_call").on("click", function (e) {
		e.preventDefault(); // 기본 동작 방지
		const $input = $(this).siblings(".inp_picker");
		$input.attr("readonly", true); // readonly 속성 추가	
		$input.datepicker("show");
		setTimeout(function(){
			$input.attr("readonly", false); // readonly 속성 제거
		}, 500);
	});

	prograssBar();

	// 달력 호출



	// 보험 플랜 - 진입화면 라디오 선택 이벤트
	/*
	$('.guarantee_choice_wrap .guarantee_item .gi_radio input[type="radio"]').on('change', function() {
		const idx = $(this).closest('.guarantee_item').index();
		// console.log(idx)
		const $selectedItem = $(this).closest('.guarantee_item');
		$(this).closest('.guarantee_choice_wrap').addClass('active');
		$(this).closest('.guarantee_choice_wrap').find('.guarantee_item').removeClass('active');
		$(this).closest('.guarantee_item').addClass('active');

		// 모든 항목 초기화: 컨텐츠 닫고 타이틀 열기
		$('.guarantee_choice_wrap .guarantee_item').each(function() {
			$(this).find('.guarantee_item_cont').stop(true, true).slideUp(300);
			$(this).find('.guarantee_item_top').stop(true, true).slideDown(300);
		});

		// 선택된 항목만: 컨텐츠 열고 타이틀 닫기
		$selectedItem.find('.guarantee_item_cont').stop(true, true).slideDown(300);
		$selectedItem.find('.guarantee_item_top').stop(true, true).slideUp(300);

		// 고급 선택 시
		if( idx === 0 && $('.gtl_special').length ) {
			$('.gtl_special').addClass('active');
		} else {
			$('.gtl_special').removeClass('active');
		}

		// head 문구 변경
		$('.guarantee_top_item').eq(idx + 1).addClass('active').siblings('.guarantee_top_item').removeClass('active');

		// 비쥬얼 영역 변경			
		$('.guarantee_visuval').stop(true, true).slideUp(300);

		// 추가된 부분
		const selectedClass = $(this).closest('.guarantee_item').data('sendclass'); // 선택된 항목의 data-sendclass 값
		console.log('선택된 항목의 data-sendclass:', selectedClass);
	});
	*/
	// 보험 플랜 - 진입화면 라디오 선택 이벤트
	
	



	// 간편정보 노출 방식
	$('#container').on('scroll', function() {
		const $headHeight = $('#header').outerHeight();

		if ($('.simple_info_wrap').length) {
			const $target = $('.simple_info_wrap');
			const targetOffsetTop = $target.offset().top;
			const $targetChild = $('.simple_info_wrap').children('.simple_info_item');
			const scrollTop = $('#container').scrollTop();

			if($('.gd_middle_b').length){
				targetOffsetTop = targetOffsetTop - 50
			}

			console.log('target 위치 : ' + targetOffsetTop);
			console.log('컨텐츠 스크롤 위치 : ' + scrollTop);

			if (targetOffsetTop <= $headHeight + 30 && !$targetChild.hasClass('active')) {
				// console.log('펴기');
				$targetChild.addClass('active');
				$targetChild.stop().slideDown(300);
			} else if (targetOffsetTop > $headHeight + 30 && $targetChild.hasClass('active')) {
				// console.log('접기');
				$target.removeAttr('style').removeClass('active');
				$targetChild.removeClass('active');
				$targetChild.stop().slideUp(300);
			}
		}
	});
	// 간편정보 노출 방식

});


$(window).resize(function(){
	// prograssBar();
})


