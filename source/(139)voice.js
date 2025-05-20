async function startVoiceProcess() {
    const modal = document.getElementById("modal");
    const status = document.getElementById("status");
    modal.style.display = "block";
    status.textContent = "녹음 중...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

        mediaRecorder.onstop = async () => {
            if (audioChunks.length === 0) {
                status.textContent = "녹음된 음성이 없습니다.";
                alert("음성이 녹음되지 않았습니다. 다시 시도해주세요.");
                modal.style.display = "none";
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            status.textContent = "음성 처리 중...";
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append("file", audioBlob, "voice.wav");
            formData.append("model", "whisper-1");

            try {
                console.log("OpenAI API 호출 시작");
                const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer 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", // 보안상의 이유로 실제 키는 숨김
                    },
                    body: formData,
                });

                console.log("OpenAI 응답 수신됨, 상태 코드:", response.status);
                const responseText = await response.text();
                console.log("응답 원문:", responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error("JSON 파싱 실패:", parseError);
                    status.textContent = "음성 인식 결과 처리 중 오류 발생.";
                    alert("응답 파싱 중 오류가 발생했습니다.");
                    modal.style.display = "none";
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                const text = data.text || "";
                console.log("변환된 텍스트:", text);
                status.textContent = `인식된 내용: ${text}`;

                if (["open", "open the door", "openthedoor", "please open", "open up", "open door"].some(trigger => text.includes(trigger))) {
                    status.textContent = "문을 여는 중...";
                    console.log("'문 열어' 명령 감지됨, 도어 API 호출 시작");

                    const doorResponse = await fetch("https://api.hizib.wikibox.kr/Smartdoor/doorOpenProcess", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiNTgiLCJleHAiOjE3NzE2NTQzOTQsInNtYXJ0ZG9vcl91c2VyX2lkIjoiMTA4Iiwic21hcnRkb29yX2lkIjoyMn0.NBYj1NUXe5p_EqciL5jHPlaR-E1IhFXb3w5GcOBfUKACIVLKOkfbYvZjKS56itRVbNDncj230unv2_--ArX1rA", // 보안 주의
                            "Content-Type": "application/json",
                            "accept": "application/json",
                        },
                        body: JSON.stringify({ door_id: "22" }),
                    });

                    console.log("도어 API 응답 상태 코드:", doorResponse.status);
                    const doorResult = await doorResponse.text();
                    console.log("도어 응답 내용:", doorResult);

                    setTimeout(() => {
                        alert("문이 열렸습니다.");
                        modal.style.display = "none";
                    }, 500);
                } else {
                    console.log("명령어가 감지되지 않음");
                    alert("'문 열어' 같은 명령이 감지되지 않았습니다.");
                    modal.style.display = "none";
                }

            } catch (apiError) {
                console.error("OpenAI 또는 도어 API 호출 중 오류:", apiError);
                alert("음성 인식 중 오류가 발생했습니다.");
                modal.style.display = "none";
            }

            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 3000);

    } catch (error) {
        console.error("마이크 접근 오류:", error);
        status.textContent = "마이크 사용 권한이 필요합니다.";
        alert("마이크 권한을 허용해야 합니다.");
        modal.style.display = "none";
    }
}

document.getElementById("mic-image").addEventListener("click", startVoiceProcess);
