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
                const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer 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", // 키 교체 필요
                    },
                    body: formData,
                });

                const data = await response.json();
                const text = data.text || "";
                console.log("변환 결과:", text);
                status.textContent = `인식된 내용: ${text}`;

                if (["문 열", "열어", "열"].some(trigger => text.includes(trigger))) {
                    status.textContent = "문을 여는 중...";

                    await fetch("https://api.hizib.wikibox.kr/Smartdoor/doorOpenProcess", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiNTgiLCJleHAiOjE3NzE2NTQzOTQsInNtYXJ0ZG9vcl91c2VyX2lkIjoiMTA4Iiwic21hcnRkb29yX2lkIjoyMn0.NBYj1NUXe5p_EqciL5jHPlaR-E1IhFXb3w5GcOBfUKACIVLKOkfbYvZjKS56itRVbNDncj230unv2_--ArX1rA", // 키 교체 필요
                            "Content-Type": "application/json",
                            "accept": "application/json",
                        },
                        body: JSON.stringify({ door_id: "22" }),
                    });

                    setTimeout(() => {
                        alert("문이 열렸습니다.");
                        modal.style.display = "none";
                    }, 500);
                } else {
                    alert("'문 열어' 같은 명령이 감지되지 않았습니다.");
                    modal.style.display = "none";
                }

            } catch (apiError) {
                console.error("API 호출 오류:", apiError);
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
