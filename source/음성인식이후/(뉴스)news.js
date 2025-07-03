// 뉴스 응답 처리 함수
function renderNewsItems(items) {
    const $list = $('#news-list');
    $list.empty();

    if (!items || items.length === 0) {
        $list.append('<li>뉴스를 불러올 수 없습니다.</li>');
        return;
    }

    items.forEach(item => {
        $list.append(`<li><a href="${item.link}" target="_blank">${item.title}</a></li>`);
    });
}

// WebSocket 메시지 수신 이벤트 추가
ws.addEventListener("message", function (event) {
    try {
        const data = JSON.parse(event.data);
        if (data.response === "newsFeed") {
            renderNewsItems(data.items);
        }
    } catch (e) {
        console.error("뉴스 처리 중 오류:", e);
    }
});
