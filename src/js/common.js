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
    $(this).addClass('active');
  }
  // 팝업 닫기
  $.fn.openPop = function(){
    $(this).removeClass('active');
    $(this).closest('.popup_wrap').removeClass('active');
    $(this).focus();
  }

  $('.popup_open').on('click', function(){
    const $this = $(this).data('popup-id');
    $('#' + $this).openPop();
  });
  $('.popup_close').on('click', function(){
    $(this).closePop();
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
  })
})();

$(function(){
  console.log('jquery ready');
});
