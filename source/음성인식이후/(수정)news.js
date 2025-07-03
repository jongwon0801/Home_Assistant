// 뉴스 응답 처리 함수
function renderNewsItems(items) {
    const $list = $('#news-list');
    $list.empty();

    if (!items || items.length === 0) {
        $list.append('<li>뉴스를 불러올 수 없습니다.</li>');
        return;
    }

    items.forEach(item => {
        // 클릭 시 새 탭이 아닌 현재 창에서 열도록 링크에 onclick 추가
        $list.append(`
            <li>
                <a href="${item.link}" onclick="window.location.href='${item.link}'; return false;">
                    ${item.title}
                </a>
            </li>
        `);
    });
}

// WebSocket 메시지 수신 이벤트 등록 (중복 방지 위해 addEventListener 사용)
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
