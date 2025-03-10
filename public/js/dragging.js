function draggable(click){
	const $bottomSheet = click;
	const $sheetContent = $bottomSheet.find('.popup_container');
	const $dragIcon = $bottomSheet.find('.draggable');
	let isDragging = false, startY, startHeight, delta = 0, newstartHeight;
	let moveValue = 0;
	
	const updateSheetValue = (data) => {
		$sheetContent.css('margin-top', `${data}px`);
	}

	const hideBottomSheet = (e) => {
		//팝업 초기화
		updateSheetValue(0);
		//드래그한 값 초기화
		delta = 0;
		$sheetContent.css('transition-duration', '');

		// 팝업의 id를 target으로 전달
		const targetId = $bottomSheet.attr('id'); 
		closePop(targetId);
	}

	const dragStart = (e) => {
		isDragging = true;
		// 드래그 시작 위치
		startY = e.pageY || e.originalEvent.touches?.[0].pageY;
		startHeight = parseInt($sheetContent.css('height'));
		newstartHeight = startHeight / window.innerHeight * 100;
		// console.log('시작위치 : '+ startY)
		
		$bottomSheet.addClass('dragging');
		$dragIcon.attr('aria-grabbed', 'true');

		// console.log('드래그 시작위치 : ', startY);
	}

	const dragging = (e) => {
		if (!isDragging) return;
		//드래그한 시작 위치와 현재위치 차이
		delta = startY - (e.pageY || e.touches?.[0].pageY);

		const newHeight = (startHeight + delta) / window.innerHeight * 100;
		const newDelta = Math.abs(newHeight);

		moveValue = Math.abs(delta);
		// 드래그한 값만큼 움직이기
		if(delta < 0) {
			updateSheetValue(moveValue);
		}

		$sheetContent.css('transition-duration', '0s');
	}
	
	const dragStop = () => {
		isDragging = false;
		$bottomSheet.removeClass('dragging');
		const contentH = $sheetContent.height(),
					winH = $(window).height(),
					sheetHeight = parseInt((contentH/winH) * 100);
		// console.log('dalta :'+ delta, 'moveValue : ' + moveValue);

		console.log('드래그한 값 : ', moveValue);
		console.log('---------------------------------');

		// 드래그한 값이 50 이상이면 팝업 닫기
		if(delta <= -50){
			hideBottomSheet();
			// 드래그한 값이 50 이하면 팝업 초기화
			console.log('드래그한 값이 50 이상이므로 닫기');
		}else{
			updateSheetValue(0);
		}
		$dragIcon.attr('aria-grabbed', 'false');
	}

	$dragIcon.on('mousedown', dragStart);
	$(document).on('mousemove', dragging);
	$(document).on('mouseup', dragStop);
	$dragIcon.on('touchstart', dragStart);
	// $(document).on('touchmove', dragging);
	document.addEventListener('touchmove', dragging);
	$(document).on('touchend', dragStop);
}