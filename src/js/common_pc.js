(function() {
  $(function() {  // DOM이 준비되었을 때 실행
    const $DOM = $(document),
          $WIN = $(window),
          $WRAP = $('.wrap'),
          $FOOTER = $('.footer'),
          $FLOATING_ITEM = $('.pageTop');
    
    // DOM과 윈도우 크기를 기준으로 필요한 값들을 초기화
    let wHeight, sTop, wrapHeight, footerHeight;

    function updateDimensions() {
      wHeight = $WIN.height();
      sTop = $WIN.scrollTop();
      wrapHeight = $WRAP.outerHeight();
      footerHeight = $FOOTER.outerHeight();
      console.log('wrapHeight : ', wrapHeight);
    }

    function floatingItem() {
      console.log(wrapHeight, footerHeight, sTop, wHeight);
      if (wrapHeight - footerHeight < sTop + wHeight) {
        $FLOATING_ITEM.addClass('active');
      } else {
        $FLOATING_ITEM.removeClass('active');
      }
    }

    updateDimensions();  // 초기 크기 설정
    floatingItem();      // 초기 floating 상태 설정

    // 스크롤 이벤트 처리
    $WIN.on('scroll', function() {
      updateDimensions();
      floatingItem();
    });

    // 윈도우 로드 상태에서 실행
    $WIN.on('load', function() {
      updateDimensions();
      floatingItem();
    });
  });
})();
