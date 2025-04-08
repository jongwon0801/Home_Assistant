const CURTAIN_ENTITY_ID = "cover.office_smart_curtain_curtain";
const HOME_ASSISTANT_URL = "http://192.168.0.174:8123";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTE0YjYzOTE5NTQ0MjA4YTBkMTNmN2U4NmEzNzg2OSIsImlhdCI6MTc0Mzc0OTc5NiwiZXhwIjoyMDU5MTA5Nzk2fQ.DJ2qYGtzHOxUg0KEI462HkFKkrazV-npGVM1By_y8Os";

// 전체 열기
async function openCurtain() {
  return await sendCurtainCommand("/api/services/cover/open_cover", {
    entity_id: CURTAIN_ENTITY_ID
  });
}

// 전체 닫기
async function closeCurtain() {
  return await sendCurtainCommand("/api/services/cover/close_cover", {
    entity_id: CURTAIN_ENTITY_ID
  });
}

// 특정 퍼센트로 설정
async function setCurtainPosition(position) {
  return await sendCurtainCommand("/api/services/cover/set_cover_position", {
    entity_id: CURTAIN_ENTITY_ID,
    position: position
  });
}

// 상태 조회
async function getCurtainStatus() {
  try {
    const response = await fetch(`${HOME_ASSISTANT_URL}/api/states/${CURTAIN_ENTITY_ID}`, {
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log("커튼 상태:", data);
      return data;
    } else {
      console.error("커튼 상태 조회 실패:", response.status);
      return null;
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
}

// 커튼 제어 API 호출 함수
async function sendCurtainCommand(endpoint, body) {
  try {
    const response = await fetch(`${HOME_ASSISTANT_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log("커튼 제어 응답:", result);
    return result;
  } catch (error) {
    console.error("커튼 제어 실패:", error);
    return { result: false, message: "오류 발생" };
  }
}

// debounce 유틸
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 슬라이더 조절 시 debounce로 요청
const debouncedSetCurtainPosition = debounce((value) => {
  setCurtainPosition(value);
}, 500); // 500ms 후 요청

$(document).ready(function () {
  $('#curtain-slider').on('input', function () {
    const value = parseInt($(this).val());
    $('#curtain-value').text(`${value}%`);
    debouncedSetCurtainPosition(value);
  });
});
