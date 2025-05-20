async function startVoiceProcess() {
    const modal = document.getElementById("modal");
    const status = document.getElementById("status");
    modal.style.display = "block";
    status.textContent = "녹음 중...";
    console.log("[START] 음성 녹음 시작");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            console.log("[DATA] 오디오 청크 수신");
            audioChunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            console.log("[STOP] 음성 녹음 중지, 처리 시작");

            if (audioChunks.length === 0) {
                console.warn("[WARN] 녹음된 오디오 없음");
                status.textContent = "녹음된 음성이 없습니다.";
                modal.style.display = "none";
                alert("음성이 녹음되지 않았습니다. 다시 시도해주세요.");
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            status.textContent = "음성 처리 중...";
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append("file", audioBlob, "voice.wav");
            formData.append("model", "whisper-1");

            try {
                console.log("[API] OpenAI 음성 인식 요청 시작");
                const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer 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", // 실제 키는 생략
                    },
                    body: formData,
                });

                const responseText = await response.text();
                console.log("[API] 응답 수신 완료:", responseText);
                let data;

                try {
                    data = JSON.parse(responseText);
                    console.log("[PARSE] JSON 파싱 성공");
                } catch (parseError) {
                    console.error("[ERROR] JSON 파싱 실패:", parseError);
                    status.textContent = "음성 인식 결과 처리 중 오류 발생.";
                    modal.style.display = "none";
                    alert("응답 파싱 중 오류가 발생했습니다.");
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                const text = data.text || "";
                console.log("[TEXT] 변환된 텍스트:", text);
                status.textContent = `인식된 내용: ${text}`;

                const triggers = [
                    "open", "open the door", "openthedoor", "please open", "open up", "open door",
                    "문 열어", "문좀 열어", "문열어줘", "문좀열어줘", "문 열어 줘", "문열", "문열어"
                ];

                const matchedTrigger = triggers.find(trigger => text.includes(trigger));
                if (matchedTrigger) {
                    console.log(`[MATCH] 명령어 '${matchedTrigger}' 감지됨, 도어 열기 요청`);
                    status.textContent = "문을 여는 중...";

                    try {
                        const doorRes = await fetch("https://api.hizib.wikibox.kr/Smartdoor/doorOpenProcess", {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiNTgiLCJleHAiOjE3NzE2NTQzOTQsInNtYXJ0ZG9vcl91c2VyX2lkIjoiMTA4Iiwic21hcnRkb29yX2lkIjoyMn0.NBYj1NUXe5p_EqciL5jHPlaR-E1IhFXb3w5GcOBfUKACIVLKOkfbYvZjKS56itRVbNDncj230unv2_--ArX1rA", // 생략
                                "Content-Type": "application/json",
                                "accept": "application/json",
                            },
                            body: JSON.stringify({ door_id: "22" }),
                        });
                        const doorResText = await doorRes.text();
                        console.log("[DOOR API] 응답 수신:", doorResText);
                    } catch (doorError) {
                        console.warn("도어 API 호출 중 오류 발생 (무시):", doorError);
                    }

                    modal.style.display = "none";
                    setTimeout(() => {
                        alert("문이 열렸습니다.");
                    }, 100);
                } else {
                    console.warn("[NO MATCH] 명령어 감지되지 않음");
                    modal.style.display = "none";
                    alert("문 여는 명령이 감지되지 않았습니다.");
                }

            } catch (apiError) {
                console.error("[ERROR] OpenAI 또는 도어 API 호출 중 오류:", apiError);
                modal.style.display = "none";
                // alert("음성 인식 중 오류가 발생했습니다."); // 필요시 복구
            }

            stream.getTracks().forEach(track => track.stop());
            console.log("[CLEANUP] 스트림 종료");
        };

        mediaRecorder.start();
        console.log("[RECORDING] 녹음 시작됨 (3초)");
        setTimeout(() => {
            console.log("[RECORDING] 녹음 중지 트리거");
            mediaRecorder.stop();
        }, 3000);

    } catch (error) {
        console.error("[ERROR] 마이크 접근 오류:", error);
        status.textContent = "마이크 사용 권한이 필요합니다.";
        modal.style.display = "none";
        alert("마이크 권한을 허용해야 합니다.");
    }
}

