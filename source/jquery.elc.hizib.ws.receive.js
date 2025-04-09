//새로고침
function refresh(data) {
	location.href = "/";
}

async function gomain(data) {
	if (data == undefined) settings = await setSettings();
	else settings = data;

	screenOned();

	pir_inside_pin = settings.pir_inside_pin;
	doorcloser = settings.doorcloser;
	bell = settings.bell;
	pir = settings.pir;
	doorlock = settings.doorlock;
	
	$('#qr').hide();
	var sUrl = '/html/main.html?ver=' + new Date().getTime();
	$.get(sUrl, {}, function(html) {
		$("#index").html($(html).html());
		$("#index").attr("id", "main");
		//테스트용
		//outCameraOn();
	});
}

//제품등록
function setupSmartdoor() {
	dialog("/smartdoor/join");
}

//와이파이설정
function setupWifi(data) {
	console.log("setupWifi");
	console.log(data);

	wifi_dataset = data;
	if($('#setup_wifi').length <= 0) dialog("/setup/wifi?ver=6");
	else initWifi();
}

function setupedWifiProcess(data) {
	clearInterval(wifiTimer);

	alert("Wifi 설정이 변경되었습니다.");
	$('#setup_wifi_passwd').hide();
	$('#setup_wifi').hide();
	sessionStorage.setItem("wifi", JSON.stringify(data));
	wifiTimer = setInterval(function() { getWifies(); }, 1000);
}

function setupWifiFailed(data) {
	$('#setup_wifi_passwd').hide();
}

//ble 정보 가져오기
function setupBle() {
	dialog("/setup/ble");
}

//인증완료
function bleAppJoined(data) {
	$('#loading').hide();
	alert("Solity 도어락과 연결되었습니다.");

	$('#setup_ble').remove();
	
	$('#loading').show();
	setTimeout(function() {
		$('#loading').hide();
		init();
	}, 2000);
}

//오너 등록
function setupOwner(data) {
	console.log("setupOwner");
	console.log(data);

	toggleQr();
}

//도어벨 문열기 성공
function doorOpenSuccess() {
	alert("문이 열렸습니다.");
	setTimeout(function () { doorlockStatusProcess(); }, 15000);
}

//도어벨 문열기 실패
function doorOpenFail() {
	alert("문열기를 하는데 실패하였습니다.");
}

//도어벨 눌렀을때 실행
function doorbellPushProcess() {
	//dialog('/view/camera?ver=5');
	//console.log('doorbellPushProcess : ', $('#camera').css('display'));
	if ($('#camera').css('display') != 'block') {
		console.log('camera가 실행되지 않아 실행합니다.');
		outCameraView();
	}

	outCameraOffRsv();			
}

function doorcloserOpened(data) {
	dialog('/user/welcome?ver=3');
}

//로그인 사운드 플레이
function loginPlaySound() {
	/*
	let constraints = { audio: true };
	if(insideSpeakerDeviceId) constraints.audio.deviceId = {exact: insideSpeakerDeviceId};
	console.log("loginPlaySound : " + constraints);

	navigator.mediaDevices.getUserMedia(constraints).then(() => {
		AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();

		var obj = document.getElementById("loginaudio");
		obj.muted = false;
	
		obj.play().then(function() {
			console.log("played...");
		});	
	}).catch(e => {
		alert('loginPlaySound : Audio permissions denied');
	});
	*/
}

//오픈 사운드 플레이
function openPlaySound() {
	/*
	let constraints = { audio: true };
	if(outsideSpeakerDeviceId) constraints.audio.deviceId = {exact: outsideSpeakerDeviceId};
	console.log("openPlaySound : " + constraints);

	navigator.mediaDevices.getUserMedia(constraints).then(() => {
		AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();
	}).catch(e => {
		//alert('loginPlaySound : Audio permissions denied');
	});

	var obj = document.getElementById("openaudio");
	obj.play();
	*/
}

//녹화영상 저장성공
function savedVod(data) {
	
}

//모든 창 제거
function removeAllOver() {
	$('.dialog').each(function() {
		$(this).remove();
	});

	$('.direct').each(function() {
		$(this).remove();
	});
}

//
function doorOpened(data) {
	//openPlaySound();
}

//폴더 표시
function displayFolders(data) {
	console.log(data);
	var tag = '';
	for(var i=0; i<data.length; i++) {
		path = data[i].replace("/home/pi/www/vod/", "");

		tag += '<li>';
		tag += '<a href="/vod/files?type=' + data[i] + '&ver=6" onclick="folder=\'' + data[i] + '\';$(\'#vod_folders\').ELCDialogHide();" target="dialog">';
		tag += '<img src="/image/folder.png" alt=""/>';
		tag += '<div>' + path.substr(0, 4) + '년 ' + path.substr(4, 2) + '월 ' + path.substr(6, 2) + '일</div>';
		tag += '</a>';
		tag += '</li>';
	}

	if(tag != "") $('#vod_folders .body > ul').html(tag);
}

//파일표시
function displayFiles(data) {
	console.log(data);
	var tag = '';
	for(var i=0; i<data.length; i++) {
		file = data[i].replace(folder + "/", "");
		
		tag += '<li>';
		tag += '<a href="/vod/player?file=' + data[i] + '&ver=1" onclick="vod_file_url=\'' + data[i].replace("/home/pi/www", "") + '\';vod_file_name=\'' + file + '\';$(\'#vod_files\').ELCDialogHide();" target="dialog">';
		tag += '<div>' + file + '</div>';
		tag += '</a>';
		tag += '</li>';
	}
	console.log(tag);

	if(data.length) $('#vod_files .body > ul').html(tag);
}

//사용자표시
function displayUsers(data) {
	$('#user_list .body > ul').html('');

	console.log(data);
	for(var i=0; i<data.lists.length; i++) {
		var tag = '<li onclick="user_id=' + data.lists[i].user_id + ';wslog(\'user_id:\' + user_id);dialog(\'/user/view?user_id=' + data.lists[i].user_id + '&ver=' + new Date().getTime() + '\');">';
		tag += '<div class="photo"><img src="https://api.hizib.wikibox.kr/' + data.lists[i].userObj.picture.url + '" alt="' + data.lists[i].userObj.name + '" onerror="this.src=\'/image/person/default.png\'"/></div>';
		tag += '<div>' + (data.lists[i].userObj.nickname != '' ? data.lists[i].userObj.nickname : data.lists[i].userObj.name) + '</div>';
		tag += '</li>';
		
		$('#user_list .body > ul').append(tag);
	}
}

//영상통화
async function videoCallJoined(data) {
	console.log(data);
	options.channel = data.channelName;
	options.uid = parseInt(data.uid);
	options.appid = data.appID;
	options.token = data.token;

	wslog("videoCallJoined 통화중인지 : " + isWebrtc() + " isVideoCalling : " + isVideoCalling);

	if (isVideoCalling) return;
	
	if(isWebrtc()) {
		sendMsgNotAvailableVideoCall(data.resTopic);
		//webrtcTimer = setTimeout(function() {location.href="/";}, 1000 * 60);
		return;				//통화중이면 작동 안하게
	}

	//외부 카메라 기능정지
	outCameraOff();
	await leave();
	isVideoCalling = true;

	wslog('videoCallJoined isVideoCalling : ' + isVideoCalling);
	webrtcStart(data);
}

function webrtcStart(data) {
	agoraInit(data).then(() => {
		agoraStart(data);
		sendMsgAvailableVideoCall(data.resTopic);
		wslog("webrtcStart : 시작 완료");
	});
}

//카메라켜기
async function outCameraOn(data) {
	console.log('call outCameraOn');
	if (settings.pir_outside == undefined) settings.pir_outside = {};
	if (settings.pir_outside.times == undefined) settings.pir_outside.times = 20;

	//설정된 시간이 지나면 자동으로 카메라 종료시키기
	clearTimeout(doorTimer);
	doorTimer = setTimeout(function () {
		outCameraOff();
	}, settings.pir_outside.times * 1000);
		
	//wslog("outCameraOn");
	console.log('outCameraOn [currentStatus : ' + currentStatus + ']');
	console.log('outCameraOn [record.isUse : ' + settings.record.isUse + ']');	
	console.log('outCameraOn [isUseQrDoorOpen : ' + settings.isUseQrDoorOpen + ']');	
	console.log('outCameraOn [faceDoorOpen.isUse : ' + settings.faceDoorOpen.isUse + ']');	
	console.log('outCameraOn [isShowOutsideCam : ' + settings.isShowOutsideCam + ']');
	console.log('outCameraOn [isShowOutsidePicture : ' + settings.isShowOutsidePicture + ']');
	console.log('outCameraOn [isVideoCalling : ' + isVideoCalling + ']');

	if(settings.isUseQrDoorOpen == undefined) settings.isUseQrDoorOpen = true;
	if(settings.faceDoorOpen == undefined) settings.faceDoorOpen = { times: 5, gap: 2, isUse: false};
	if(settings.faceDoorOpen.isUse == undefined) settings.faceDoorOpen.isUse = true;
	if(settings.record == undefined) settings.record = { path: "/home/pi/www/vod", isUse: true};
	if (settings.record.isUse == undefined) settings.record.isUse = true;
	

	//외부카메라상태가 작동중이고 영상통화중이면,,, 중단
	if(currentStatus != 0 && isVideoCalling && isWebrtc()) return;
	
	outCameraStart().then(() => {	//연결 시작
		console.log("scanner : " + scanner);
		console.log("recorder : " + recorder);
		console.log("record.isUse : " + settings.record.isUse);

		//if(scanner == undefined || scanner == null) qrScanStart();
		//else if(recorder == undefined || recorder == null) recordStart();
		if(!isQrFace) requestDoorOpenByPicture();
		else if(settings.record.isUse && (recorder == null || recorder == undefined)) recordStart();
	});
}

function outCameraOff(data) {
	clearTimeout(outCameraTimer);
	outCameraTimer = null;

	console.log(`call outCameraOff`);
	if ($('#camera').css('display') != 'none') {
		console.log(`현재 카메라창이 사용중이라 1초 후 다시 호출합니다.`);
		outCameraTimer = setTimeout(function () { outCameraOff(); }, 1000);
	} else {
		$('#picture').hide();
		if (recorder) recordStop();
		if (currentStatus == 0) return;
		outCameraStop();
		currentStatus = 0;	
	}
}

//녹화중지예약
function outCameraOffRsv() {
	console.log("종료 예약 설정");
	clearTimeout(recordTimer);
	recordTimer = null;
	//끄기 예약
	recordTimer = setTimeout(function () { outCameraClose(); }, 1000 * MAXRUNTIME);
	console.log(`종료 예약 완료 ${MAXRUNTIME}초 뒤 카메라꺼짐`);
}

//외부 카메라 켜기
function outCameraView() {
	outCameraStart();
	$('#camera').ELCDialogShow();
}

//외부 카메라 끄기
function outCameraClose() {
	$('#camera').css('display', 'none');
	$('#camera').hide();
	outCameraOff();

	//$('#camera').css('display','none');
	wslog("카메라 창 닫기");

	//screenOff();
}

//내부 카메라켜기
function inCameraOn(data) {
	//screenOned();
	//wslog("inCameraOn");
	//settings.isUseFaceLogin = false;
	wslog('inCameraOn user_id : ' + user_id + " isUseFaceLogin : " + settings.isUseFaceLogin + " loginCount : " + loginCount);

	if (user_id == 0 && settings.isUseFaceLogin) {
		//if(loginTimer != null) clearTimeout(loginTimer);
		//loginTimer = setTimeout(function() { resetUser(); }, 1000 * LOGIN_TIMES);
		faceLoginStart();
	}
}

//내부 카메라켜기
function inCameraOff(data) {
	wslog("inCameraOff");
	//$('#insideCamera').hide();
	faceLoginStop();

	if (loginTimer != null) clearTimeout(loginTimer);
	if (inCameraTimer != null) clearTimeout(inCameraTimer);
	//screenOff();
	//loginTimer = setTimeout(function () { resetUser(); }, 1000 * LOGIN_TIMES);
	//setTimeout(function () { loginCount = 0; }, 5 * 1000);
}

//외부 카메라 끄기
function inCameraClose() {
	outCameraOff();
	$('#insideCamera').hide();
	//screenOff();
}

//사용자 리셋
function resetUser() {
	console.log('resetUser user_id : ' + user_id);
	user_id = 0;
	$('#user_view').ELCDialogHide();
}

function doorOpend(data) {
	isDoorOpen = true;
}

function doorClosed(data) {
	isDoorOpen = false;
	//$('#user_welcome').remove();
}

//스크린이 켜졌음
function screenOned(data) {
	if (settings.screen == undefined) settings.screen = 30;
	if (screenTime == null) screenTime = new Date();
	console.log('screenOned : ' + date_format(screenTime) + '(' + settings.screen + ') 갭 : ' + Math.floor((new Date() - screenTime) / 1000));
	clearTimeout(screenTimer);
	screenTimer = null;
	screenTime = new Date();
	screenTimer = setTimeout(function () { screenOff(); }, settings.screen * 1000);
}

function screenOffed(data) {
	//$('#user_welcome').remove();
	resetUser();
}

function sleep(sec) {
	let start = Date.now(), now = start;
	while (now - start < sec * 1000) {
		now = Date.now();
	}
}

function faceLoginStart(data) {
	if (settings.isShowInsideCam == undefined) settings.isShowInsideCam = false;
	if (settings.isShowInsideCam) {
		if($('#insideCamera').css('display') != 'none') return;
		$('#insideCamera').ELCDialogShow();	
	}
	
	insideCameraStart().then(() => {	//연결 시작
		requestFaceImage();
	});
}

function faceLoginStop() {
	$('#insideCamera').css('display', 'none');
	insideCameraStop();
}

//로그인 결과
function faceLogined(data) {
	console.log(data);
	//user_id = data.user_id;
	//dialog('/user/view?user_id=' + data.user_id + '&ver=' + new Date().getTime());
	responseFaceImage(data);
}

function faceLoginFail(data) {
	console.log('-------------------------------- faceLoginFail --------------------------------');
	console.log(settings);
	if (settings.faceLogin == undefined) settings.faceLogin = {};
	if (settings.faceLogin.gap == undefined) settings.faceLogin.gap = 1;
	console.log(settings.faceLogin.gap + "초 뒤 재실행");
	console.log('-------------------------------- faceLoginFail --------------------------------');

	inCameraTimer = setTimeout(function () { requestFaceImage(); }, settings.faceLogin.gap * 1000);
}

function faceDoorOpened(data) {
	clearTimeout(outCameraTimer);
	outCameraTimer = null;
}

function qrDoorOpened(data) {
	clearTimeout(outCameraTimer);
	outCameraTimer = null;
}

function faceDoorOpenFail(data) {
	console.log('-------------------------------- faceDoorOpenFail --------------------------------');
	console.log(settings);
	if (settings.faceDoorOpen == undefined) settings.faceDoorOpen = {};
	if (settings.faceDoorOpen.gap == undefined) settings.faceDoorOpen.gap = 1;
	console.log(settings.faceDoorOpen.gap);
	console.log('-------------------------------- faceDoorOpenFail --------------------------------');

	outCameraTimer = setTimeout(function () { requestDoorOpenByPicture(); }, settings.faceDoorOpen.gap * 1000);
}

function setSchedule(data) {
	console.log('-------------------------------- setSchedule --------------------------------');
  console.log(data);
	displayNotices(data);
  console.log('-------------------------------- setSchedule --------------------------------');
}

function playSound(deviceId, soundFiles) {
	let currentIndex = 0;
	let audioContext;
	let mediaStream;

	wslog(deviceId);

	// 다음 MP3 파일을 재생하는 함수
	function playNext() {
		if (currentIndex < soundFiles.length) {
			const audio = new Audio(soundFiles[currentIndex]);

			audio.addEventListener('ended', () => {
				currentIndex++; // 다음 파일 인덱스로 이동
				playNext(); // 다음 파일 재생
			});

			audio.addEventListener('error', (e) => {
					console.error('오디오 파일 재생 중 오류 발생:', e);
			});

			console.log(`재생 중: ${soundFiles[currentIndex]}`);
			wslog(deviceId);
			// 장치가 지정된 경우
			if (deviceId) {
				audioContext = new (window.AudioContext || window.webkitAudioContext)();
				navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: deviceId } } })
					.then(stream => {
						mediaStream = stream; // 스트림 저장
						const source = audioContext.createMediaStreamSource(stream);
						source.connect(audioContext.destination);
						audio.play().catch(e => {
								console.error('오디오 재생 오류:', e);
						});
					})
					.catch(err => {
						console.error('장치 접근 오류:', err);
						alert('장치에 접근할 수 없습니다. 장치 권한을 확인하세요.');
					});
			} else {
				// 기본 장치로 재생
				audio.play().catch(e => {
					console.error('오디오 재생 오류:', e);
				});
			}
		} else {
			console.log('모든 오디오 파일 재생 완료.');
			if (mediaStream) {
				// 모든 오디오 파일이 재생된 후 스트림 정지
				mediaStream.getTracks().forEach(track => track.stop());
				mediaStream = null; // 스트림 초기화
			}
		}
	}

	// 첫 번째 파일 재생 시작
	playNext();
