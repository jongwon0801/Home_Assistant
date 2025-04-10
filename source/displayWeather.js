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
	
	// 최고 기온 → tr 3번째, td 2번째 칸
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)').html(
		'최고 ' + Math.round(weather_dataset.maxTemperature / 100) + '˚'
	);
	
	// 날씨 상태 (흐림, 맑음 등) → tr 4번째, td 1번째 칸
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(1)').html(
		weather_dataset.sky
	);
	
	// 최저 기온 → tr 4번째, td 2번째 칸
	$('#weather > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2)').html(
		'최저 ' + Math.round(weather_dataset.minTemperature / 10) + '˚'
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
