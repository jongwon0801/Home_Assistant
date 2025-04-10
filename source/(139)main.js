//공지사항세팅
function setNotice(data) {
	notice_dataset = data;

	displayNotice();
}

function displayNotice() {
	console.log(notice_dataset);

	var tag = '<h1><img src="/image/notice.png" alt="공지사항"/> 공지사항</h1>';
	tag += '<ul>';
	
	if(notice_dataset.length) {
		notice_dataset.forEach(function(element) {
			tag += '<li>' + element.title + '</li>';
		});
	} else {
		tag += '<li>등록된 공지사항이 없습니다.</li>';
	}

	tag += '</ul>';

	$('#notice').html(tag);
}

//스케쥴세팅
function setSchedule(data) {
	console.log(data);
	schedule_dataset = [];
	data.lists.forEach(function(element) {
		var temp = element.dday.split(" ");
		var dday = str_replace("-", "", temp[0]);
		if(schedule_dataset[dday] == undefined) schedule_dataset[dday] = [];
		schedule_dataset[dday].push(element);
	});

	displaySchedule(data.year, data.month);
}

function displaySchedule(year, month) {
	console.log(schedule_dataset);

	var current = new Date();
	var startDay = new Date(year, month - 1, 1);
	var stopDay = new Date(year, month, 0);
	var startDate = new Date(year, month - 1, 1 - startDay.getDay());
	var stopDate = new Date(year, month, 6 - stopDay.getDay());

	var tag = '<h1>' + month + '월</h1>';
	tag += '<table>';
	tag += '<thead>';
	tag += '<tr>';
	tag += '<th>SUN</th>';
	tag += '<th>MON</th>';
	tag += '<th>TUE</th>';
	tag += '<th>WED</th>';
	tag += '<th>THU</th>';
	tag += '<th>FRI</th>';
	tag += '<th>SAT</th>';
	tag += '</tr>';
	tag += '</thead>';
	tag += '<tbody>';

	var days = startDay.getDay() + stopDay.getDate() + (6 - stopDay.getDay());
	var rows = days / 7;

	var k = 0;
	for(var i=0; i<rows; i++) {
		tag += '<tr>';
		for(var j=0; j<7; j++) {
			var dday = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + k);
			var dday_format = dday.getFullYear() + '' + (dday.getMonth() + 1 >= 10 ? (dday.getMonth() + 1) : '0' + (dday.getMonth() + 1)) + '' + (dday.getDate() >= 10 ? dday.getDate() : '0' + dday.getDate());
			var isMonth = dday.getMonth() + 1 == month;
			var isSunday = dday.getDay() == 0;
			var isToday = dday.getFullYear() + '' + dday.getMonth() + '' + dday.getDate() == current.getFullYear() + '' + current.getMonth() + '' + current.getDate();
			var isSchedule = schedule_dataset[dday_format] == undefined ? false : true;

			if(isSunday) tag += '<th onclick="getSmartdoorSchedule(' + dday.getFullYear() + ',' + (dday.getMonth() + 1) + ',' + dday.getDate() + ');"><span class="sunday' + (isMonth ? '' : ' out') + (isToday ? ' today' : '') + (isSchedule ? ' over' : '' ) + '">' + dday.getDate() + '</span></th>';
			else tag += '<th onclick="getSmartdoorSchedule(' + dday.getFullYear() + ',' + (dday.getMonth() + 1) + ',' + dday.getDate() + ');"><span class="weekday' + (isMonth ? '' : ' out') + (isToday ? ' today' : '') + (isSchedule ? ' over' : '' ) + '">' + dday.getDate() + '</span></th>';

			k++;
		}
		tag += '</tr>';
	}

	tag += '</tbody>';
	tag += '</table>';

	$('#schedule').html(tag);

	schedule_dataset.forEach(function(element) {
		console.log(element);
		if(element.dday != undefined) {
			var temp = element.dday.split(" ");
			if(temp.length) {
				var tmp = temp[0].split("-");
				console.log(tmp);

				getSmartdoorSchedule(tmp[0], tmp[1], tmp[2]);
			}
		}
	});
}

function getSmartdoorSchedule(year, month, day) {
	var dday = year + '' + (month >= 10 ? month : ('0' + month)) + '' + (day >= 10 ? day : ('0' + day));
	var date = new Date(year, month - 1, day);
	//console.log(dday);
	
	var tag = "";
	tag += '<div>';
	tag += '<h1>' + date.getDate() + '</h1>';
	tag += '<h2>';
	if(date.getDay() == 0) tag += 'SUN';
	else if(date.getDay() == 1) tag += 'MON';
	else if(date.getDay() == 2) tag += 'TUE';
	else if(date.getDay() == 3) tag += 'WED';
	else if(date.getDay() == 4) tag += 'THU';
	else if(date.getDay() == 5) tag += 'FRI';
	else if(date.getDay() == 6) tag += 'SAT';
	tag += '</h2>';
	tag += '</div>';
	tag += '<ul>';
	
	if(schedule_dataset[dday] != undefined) {
		console.log(schedule_dataset[dday]);
		if(schedule_dataset[dday].length) {
			schedule_dataset[dday].forEach(function(element) {
				var d = element.dday.split(" ");
				var t = d[1].split(":");
				tag += '<li><label>' + element.name + '</label><span>' + t[0] + ':' + t[1] + '</span></li>';
			});
		} else tag += '<li>등록된 일정이 없습니다.</li>';
	}
	tag += '</ul>';
	
	console.log(tag);
	
	$('#dailySchedule').html(tag);
}

//날씨세팅
function setWeather(data) {
	weather_dataset = data;
	displayWeather();
}

function displayWeather() {
	if (weather_dataset == undefined) return;
	if (weather_dataset.location == undefined) return;

	// 지역 + 아이콘
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)').html(
		weather_dataset.location + '<img src="/image/place.png" alt="">'
	);

	// 날씨 아이콘
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(1)').html(
		'<img src="/image/weather/' + weather_dataset.icon + '.png" alt="' + weather_dataset.sky + '">'
	);

	// 현재 온도
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)').html(
		weather_dataset.currentTemperature + '˚'
	);
	

	// 최고/최저 기온 계산
	const maxTemp = Math.round(weather_dataset.maxTemperature / 100);
	const minTemp = Math.round(weather_dataset.minTemperature / 10);
	
	// 날씨 상태 (흐림, 맑음 등) → tr 4번째, td 1번째 칸
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(1)').html(
	    weather_dataset.sky
	);
	
	// 최고 + 최저 기온 → tr 4번째, td 2번째 칸
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2)').html(
	    '최고 ' + maxTemp + '˚ / 최저 ' + minTemp + '˚'
	);

	
	// 미세먼지
	$('#weather > ul > li:nth-child(1) > span').html(weather_dataset.finedust);
	if (weather_dataset.finedust.indexOf("좋음") >= 0) {
		$('#weather > ul > li:nth-child(1) > span').addClass("green").removeClass("red");
	} else if (weather_dataset.finedust.indexOf("나쁨") >= 0) {
		$('#weather > ul > li:nth-child(1) > span').addClass("red").removeClass("green");
	} else {
		$('#weather > ul > li:nth-child(1) > span').removeClass("green red");
	}

	// 초미세먼지
	$('#weather > ul > li:nth-child(2) > span').html(weather_dataset.ultrafinedust);
	if (weather_dataset.ultrafinedust.indexOf("좋음") >= 0) {
		$('#weather > ul > li:nth-child(2) > span').addClass("green").removeClass("red");
	} else if (weather_dataset.ultrafinedust.indexOf("나쁨") >= 0) {
		$('#weather > ul > li:nth-child(2) > span').addClass("red").removeClass("green");
	} else {
		$('#weather > ul > li:nth-child(2) > span').removeClass("green red");
	}

	// 시간별 예보
	for (var i = 0; i < weather_dataset.lists.length; i++) {
		var hour = weather_dataset.lists[i].date.substring(8, 10);
		var hour_name = hour > 12 ? '오후 ' + (hour - 12) + '시' : '오전 ' + hour + '시';
		$('#weather > table:nth-child(3) > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(1)').html(hour_name);
		$('#weather > table:nth-child(3) > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(2)').html(
			'<img src="/image/weather/' + weather_dataset.lists[i].icon + '.png" alt="' + weather_dataset.lists[i].sky + '"/>'
		);
		$('#weather > table:nth-child(3) > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(3)').html(
			weather_dataset.lists[i].temperature + '˚'
		);
	}
}

function clock() {
	var date = new Date();

	// date Object를 받아오고 
	var month = date.getMonth();

	// 달을 받아옵니다 
	var clockDate = date.getDate();

	// 몇일인지 받아옵니다 
	var day = date.getDay();

	// 요일을 받아옵니다. 
	var week = ['일', '월', '화', '수', '목', '금', '토'];

	// 요일은 숫자형태로 리턴되기때문에 미리 배열을 만듭니다. 
	var hours = date.getHours();

	// 시간을 받아오고 
	var minutes = date.getMinutes();

	// 분도 받아옵니다.
	var seconds = date.getSeconds();

	if(minutes == 0) ws.send('{"request":"weatherUpdate"}');

	if(hours <= 12) {
		$("#header label").html('오전');
		var hour = hours == 0 ? 12 : hours;
	} else {
		$("#header label").html('오후');
		var hour = hours - 12;
	}

	var current = "";
	if(hour < 10) current += "0" + hour;
	else current += hour;

	current += ":";

	if(minutes < 10) current += "0" + minutes;
	else current += minutes;

	$("#header span").html(current);
}

async function toggleLights() {
	$('.jq-toast-single').hide();

	try {
    const status = await checkLampStatus();
    if (status === null) {
      console.error('램프 상태를 확인할 수 없습니다.');
      return;
		}
		
		isLights = status.isOn;

    let result;
    if (isLights) {
			result = await turnOffLamp();
			$.toast({
				text : "조명이 꺼졌습니다.", 
				showHideTransition : 'slide',
				bgColor : '#000000',
				textColor : '#ffffff',
				allowToastClose : false,
				hideAfter : 3000,
				stack : 5,
				textAlign : 'center',
				position : 'bottom-center'
			});
			isLights = 0;
    } else {
			result = await turnOnLamp();
			$.toast({
				text : "조명이 켜졌습니다.", 
				showHideTransition : 'slide',
				bgColor : '#FF000099',
				textColor : '#ffffff',
				allowToastClose : false,
				hideAfter : 3000,
				stack : 5,
				textAlign : 'center',
				position : 'bottom-center'
			});
			isLights = 1;
    }

    if (result.result) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error('램프 토글 오류:', error);
  }
}

function toggleElevator() {
	$('.jq-toast-single').hide();

	if(isElevator == 0) {
		$.toast({
			text : "엘레베이터 호출하였습니다.", 
			showHideTransition : 'slide',
			bgColor : '#FF000099',
			textColor : '#ffffff',
			allowToastClose : false,
			hideAfter : 3000,
			stack : 5,
			textAlign : 'center',
			position : 'bottom-center'
		});
		isElevator = 1;
	} else {
		$.toast({
			text : "엘레베이터 호출을 취소하였습니다.", 
			showHideTransition : 'slide',
			bgColor : '#000000',
			textColor : '#ffffff',
			allowToastClose : false,
			hideAfter : 3000,
			stack : 5,
			textAlign : 'center',
			position : 'bottom-center'
		});
		isElevator = 0;
	}
}


async function toggleCurtain() {
  $('.jq-toast-single').hide(); // 기존 토스트 숨김

  const statusData = await getCurtainStatus();
  if (!statusData) return;

  const state = statusData.state;

  if (state === "open") {
    await closeCurtain();
    $.toast({
      text: "커튼을 닫는 중입니다.",
      showHideTransition: 'slide',
      bgColor: '#4682B4',
      textColor: '#ffffff',
      allowToastClose: false,
      hideAfter: 3000,
      stack: 5,
      textAlign: 'center',
      position: 'bottom-center'
    });
  } else if (state === "closed") {
    await openCurtain();
    $.toast({
      text: "커튼을 여는 중입니다.",
      showHideTransition: 'slide',
      bgColor: '#3CB371',
      textColor: '#ffffff',
      allowToastClose: false,
      hideAfter: 3000,
      stack: 5,
      textAlign: 'center',
      position: 'bottom-center'
    });
  } else {
    console.warn("알 수 없는 커튼 상태:", state);
  }
}





function toggleMirror() {
	if(isMirror == 0) {
		$('#mirror').show();
		isMirror = 1;
	} else {
		$('#mirror').hide();
		isMirror = 0;
	}
}
