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

    let arrowImg = "right.png";
    if (item.direction.includes("상승")) arrowImg = "up.png";
    else if (item.direction.includes("하락")) arrowImg = "down.png";

    html += `<tr>
      <td>${key}</td>
      <td>${item.index}</td>
      <td>${item.change}</td>
      <td><img src="/image/${arrowImg}" alt="${item.direction}" style="width:16px;height:16px;" /></td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.html(html);
}
