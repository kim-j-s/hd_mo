$(function(){
	const $showModalBtn = $('.popup_open');
	const $bottomSheet = $('.popup_wrap.bottom');
	const $sheetContent = $bottomSheet.find('.popup_container');
	const $dragIcon = $bottomSheet.find('.draggable');
	let isDragging = false, startY, startHeight, delta, newstartHeight;
	const initialY = 0;
	let initOpacity = 0.6;

	const showBottomSheet = function() {
		$bottomSheet.addClass('active');
		$('body').css('overflowY', 'hidden');
		// updateSheetHeight(newstartHeight);
	}

	const updateSheetHeight = (data) => {
		$sheetContent.css('height', `${data}vh`);
	}

	const newOpacity = function(){
		const backgroundColor = $bottomSheet.css('background-color');
		if (backgroundColor.includes('rgba')) {
			var rgba = backgroundColor.match(/rgba?\((\d+), (\d+), (\d+), (\d(\.\d+)?)\)/);
			if (rgba) {
				opacity = rgba[4]; // 알파값(투명도) 추출
			}
		}
	} 

	const hideBottomSheet = (e) => {
		$bottomSheet.removeClass('active');
		$('body').css('overflowY', 'auto');
		setTimeout(function(){
			updateSheetHeight(newstartHeight);
		}, 300);
	}

	const dragStart = (e) => {
		isDragging = true;
		startY = e.pageY || e.originalEvent.touches?.[0].pageY;
		startHeight = parseInt($sheetContent.css('height'));
		newstartHeight = startHeight / window.innerHeight * 100;
		
		$bottomSheet.addClass('dragging');
		$('.draggable').attr('aria-grabbed', 'true');

		initOpacity = parseFloat($bottomSheet.css('opacity'));
	}

	const dragging = (e) => {
		if (!isDragging) return;
		delta = startY - (e.pageY || e.touches?.[0].pageY);
		const newHeight = (startHeight + delta) / window.innerHeight * 100;
		const newDelta = Math.abs(newHeight);
		const deltaY = e.pageY - initialY;

		console.log(initialY, initOpacity);

		

		if (delta <= 0 ){
			updateSheetHeight(newDelta);
		}
		// console.log('drag한 값 : ' + newDelta);

		var newVal = Math.max(0, initOpacity - deltaY / 500);
		$bottomSheet.css('background-color', newVal);
	}
	
	const dragStop = () => {
		isDragging = false;
		$bottomSheet.removeClass('dragging');
		const contentH = $sheetContent.height(),
					winH = $(window).height(),
					sheetHeight = parseInt((contentH/winH) * 100);

		if (delta <= -50){
			hideBottomSheet();
		}else {
			updateSheetHeight(newstartHeight);
		}
		$('.draggble').attr('aria-grabbed', 'false');
	}

	$dragIcon.on('mousedown', dragStart);
	$(document).on('mousemove', dragging);
	$(document).on('mouseup', dragStop);
	$dragIcon.on('touchstart', dragStart);
	// $(document).on('touchmove', dragging);
	document.addEventListener('touchmove', dragging);
	$(document).on('touchend', dragStop);

	// $showModalBtn.on('click', showBottomSheet);

});