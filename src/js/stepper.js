(function(){
	$(function(){
		// 초기화
		stepperInit();
		// 선택 이벤트
		selectEvent();
	});

})();


function stepperInit() {
	if( $('.smp').length ) {
		console.log('stepperInit');
	}
}

function selectEvent() {
	let thisPosition = null;
	$('.opts_area_item input[type="radio"]').on('change', function() {
    // 선택된 radio의 라벨을 찾고 텍스트 값을 추출
		const data = $(this).closest('.opts_area').data('pickitem');
    const selectedText = $(this).next('label').find('.label_i').text();

		thisPosition = $(this);
    
    // 콘솔에 선택된 텍스트 출력
    console.log('선택된 값: ', selectedText);
    console.log('선택된 data: ', data);

		
		$('.ds2_inner').children('button').each(function(){
			if( $(this).hasClass(data) ) {
				$(this).text(selectedText);
			}
		});

		// 선택된 활성화
		motionEvent(thisPosition);

		// stepper 진행
		stepIng();
  });
}


function stepIng() {
	// 스테퍼 추가	
}


function motionEvent(t) {
	console.log(t);
	// 예: 라디오 버튼의 부모 요소를 찾고 스타일을 변경하는 등
  const parentElement = t.closest('.opts_area_item');
  console.log('선택된 항목의 부모 요소:', parentElement);

	$('#a1').addClass('active');
	$('#a2').removeClass('active');

	$('#a3').addClass('active');
	$('#a4').removeClass('active');


}



/*
- 총 smp_stepper length를 구한다.
- 항목 선택 시 다음 스텝으로 이동
- 선택한 항목의 내역을 한곳에 모아둔다.
- 


-- 공통조건 :
진입하지 않았던 스텝은 현 스텝에서 다음버튼이 노출되지 않는다.




-- 선택된 항목 버튼 노출 방식
- 최초 load시 


-- opts_area
각각의 스텝에서 opts_area에 data-step-type1을 추가한다. type1은 step의 종류를 나타낸다.

각각의 스텝에서 opts_area에 data-step-type2을 추가한다. type2는 버튼에 전달할 문구를 나타낸다.
data-step-type2="성별" -> 성별 선택
최초 진입 시 각 스텝에서 수집하여 ds2_inner 역순으로 추가한다.

각각의 스텝에서 opts_area에 data-step-type3을 추가한다. type3는 추적용 class를 사용한다.
car, persion, etc...



-- 진행 상황 
전체 스텝을에서 현재 스텝을 나눈다. 소수점 없음
추가조건으로 0일 경우 pgs_per는 start class를 부여하고 100일 경우 end를 부여한다.
그 외는 start, end class를 제거한다.
*/