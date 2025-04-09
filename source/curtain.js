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
