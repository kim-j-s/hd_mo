(function() {  
  console.log('common.js');

  const $DOM = $(document),
        $WIN = $(window),
        wHeight = $WIN.height();


  /* 전체메뉴 */
  $DOM.on('click', '.header .right [class^=allmenu]', function(){
    const $this = $(this),
          nav = $this.closest('.header_inner').find('.nav_menu_wrap');

    if(nav.css('visibility') == 'hidden'){
      nav.addClass('active').attr('aria-hidden', 'false');
    }else {
      nav.removeClass('active').attr('aria-hidden', 'true');
      $('.header .allmenu').focus();
    }
  });


  /* Popup 관련 */
  // 팝업 열기
  $.fn.openPop = function(){
		$('body').addClass('sr_none').attr('aria-hidden', 'true');
    $(this).addClass('active').attr('aria-hidden', 'false');
  }
  // 팝업 닫기
  $.fn.closePop = function(){
		$('body').removeClass('sr_none').attr('aria-hidden', 'hidden');
		$(this).closest('.popup_wrap').removeClass('active');
		$(this).closest('.popup_wrap').attr('aria-hidden', 'true');
    $(this).focus();
  }

  $DOM.on('click', '.popup_open', function(){
    const $target = $(this).data('popup-id');
    $('#' + $target).openPop();
  });
  $DOM.on('click', '.popup_close', function(){
    const $this = $(this);
    $this.closePop();
  });


  /* Accordian */
  $DOM.on('click', '.acd_item .acd_head', function(){
    const $this = $(this),
          $acd_inner = $this.next('.acd_cont').children('.inner'),
          $click_item = $this.parent('.acd_item');

    if($acd_inner.css('display') == 'none'){
      $click_item.children('.acd_head').removeClass('active');
      $this.addClass('active').attr('aria-expanded', 'true');
      $click_item.children('.acd_cont').children('.inner').hide();
      $acd_inner.slideDown();
    }else {
      $this.removeClass('active').attr('aria-expanded', 'false');
      $acd_inner.slideUp();
    }
  });


  /* Tooltip */
  $DOM.on('click', '.tooltip_wrap button', function(){
    const $click = $(this).closest('.tooltip_wrap'),
          $t_text = $click.find('.tooltip_text');
    
    if($t_text.css('display' == 'none')){
      $t_text.show();
    }else{
      $t_text.hide();
    }
  })


  /* Input */
  $DOM.on('focus input', '.input_text .inp > input', function(){
    const $this = $(this),
          $wrap = $this.closest('.inp'),
          $val = $this.val(),
          $del = $this.siblings('.del');
      
    if($del.length) {
      $del.attr('tabindex', '0');
    }

    $('.input_text .inp').removeClass('active').children('.del').hide();
    $wrap.addClass('active');
    $del.show();

    if($val){
      $del.show();
    }else {
      $wrap.removeClass('active');
      $del.hide();
    }
    // (this.value) ? $wrap.addClass('active'):$wrap.removeClass('active');
    
  }).on('blur', '.inp > input', function(){
    const $this = $(this),
          $wrap = $this.closest('.inp'),
          $val = $this.val(),
          $del = $this.siblings('.del');
    $wrap.removeClass('active');

  }).on('click', '.inp > .del', function(){
    const $this = $(this);
    $this.siblings('input').val('').focus();
    $this.parent('.inp').removeClass('active');
  });


  /* Textarea */
  $DOM.on('blur keyup', '.byte_check > textarea', function(){
    const str = $(this).val(),
          strLng = str.length,
          rbyte = 0,
          rlen = 0,
          one_char = '',
          str2 = '',
          maxByte = 500;

    for(const i=0; i<strLng; i++){
      one_char = str.charAt(i);
      if(escape(one_char).length > 4){
        rbtye += 2;
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


	// tab
	$DOM.on('click', '.tab_btn', function(){
		const idx = $(this).index();
		$(this).closest('.tab_wrap_list').children('.tab_btn').removeClass('active').attr('aria-selected', 'false');
		$(this).addClass('active').attr('aria-selected', 'true');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').removeClass('active');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').eq(idx).addClass('active');
	});




})();

$(function(){
  console.log('jquery ready');
});
