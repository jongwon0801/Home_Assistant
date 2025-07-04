from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

# 크롬드라이버 경로 설정
chrome_driver_path = "/usr/bin/chromedriver"
service = Service(executable_path=chrome_driver_path)

# 셀레니움 옵션 설정
options = Options()
options.add_argument("--headless")  # 창 없이 실행
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

# 드라이버 실행
driver = webdriver.Chrome(service=service, options=options)

# 타겟 URL
url = "https://moef.go.kr/st/ecnmyidx/TbEconomyIndicatorList.do?bbsId=MOSFBBS_000000000045&menuNo=6010200"
driver.get(url)
time.sleep(3)  # JS 렌더링 대기

# 페이지 소스 추출 후 종료
html = driver.page_source
driver.quit()

# BeautifulSoup 파싱
soup = BeautifulSoup(html, "lxml")
container = soup.select_one("div.oh")

if not container:
    print("❌ 'div.oh' 요소를 찾을 수 없습니다.")
else:
    # 전체 텍스트 줄 단위로 나누기
    lines = container.get_text(separator="\n", strip=True).split("\n")
    targets = ["KOSPI", "KOSDAQ", "국고채", "달러"]

    print("✅ 일일경제지표")
    date_found = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if "일일경제지표" in line:
            print("📅", lines[i + 1])  # 날짜 줄 출력
            i += 3  # 설명 문구 넘기기
        elif any(key in line for key in targets):
            name = line
            index = lines[i + 1] if i + 1 < len(lines) else ""
            change = lines[i + 2] if i + 2 < len(lines) else ""
            direction = lines[i + 3] if i + 3 < len(lines) else ""
            print(f"{name}: {index} ({change}, {direction})")
            i += 4
        else:
            i += 1
