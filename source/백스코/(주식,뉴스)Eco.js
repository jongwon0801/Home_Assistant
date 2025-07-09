// ecoFeed 응답 처리 함수
// /home/pi/www/js/Eco.js
function showEcoData(data) {
  const container = $('#eco-modal-body');
  if (!container.length) return;

  if (data.error) {
    container.html(`<p style="color:red;">❌ ${data.error}</p>`);
    return;
  }

  let html = `<h2>경제지표 (${data.updated || '정보 없음'})</h2><table>
    <thead><tr><th>지표</th><th>지수</th><th>변동</th><th>방향</th></tr></thead><tbody>`;

  const targets = ["KOSPI", "KOSDAQ", "국고채(3년)", "달러-원"];
  targets.forEach(function (key) {
    const item = data[key];
    if (!item) return;

    let arrow = "equal.png";
    if (item.direction.includes("상승")) arrow = "up.png";
    else if (item.direction.includes("하락")) arrow = "down.png";

    html += `<tr>
      <td>${key}</td>
      <td>${item.index}</td>
      <td>${item.change}</td>
      <td>${arrow}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.html(html);
}

// 웹소켓 메시지 이벤트 등록 (중복 방지용)
if (typeof ws !== 'undefined') {
  ws.addEventListener('message', function(event) {
    try {
      const msg = JSON.parse(event.data);

      if (msg.response === 'ecoFeed') {
        let data = msg.data;

        // data가 문자열이면 JSON으로 변환
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        showEcoData(data);
      }
    } catch (e) {
      console.error('ecoFeed 메시지 처리 중 오류:', e);
    }
  });
}
