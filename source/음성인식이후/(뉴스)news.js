// 뉴스 응답 처리
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.response === "newsFeed") {
        renderNewsItems(data.items);
    }
};

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
