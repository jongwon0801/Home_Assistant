# /home/pi/www/Eco/updateEcoData.py
# 크론탭으로 1시간마다 가상환경 켜고 실행

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json
import os
from datetime import datetime

def fetch_and_save_eco_data():
    chrome_driver_path = "/usr/bin/chromedriver"
    service = Service(executable_path=chrome_driver_path)

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=service, options=options)
    url = "https://moef.go.kr/st/ecnmyidx/TbEconomyIndicatorList.do?bbsId=MOSFBBS_000000000045&menuNo=6010200"
    driver.get(url)
    time.sleep(3)
    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, "lxml")
    container = soup.select_one("div.oh")

    data = {}
    if container:
        lines = container.get_text(separator="\n", strip=True).split("\n")
        targets = ["KOSPI", "KOSDAQ", "국고채", "달러"]
        i = 0
        while i < len(lines):
            line = lines[i]
            if "일일경제지표" in line:
                data["date"] = lines[i + 1]
                i += 3
            elif any(key in line for key in targets):
                name = line
                data[name] = {
                    "index": lines[i + 1] if i + 1 < len(lines) else "",
                    "change": lines[i + 2] if i + 2 < len(lines) else "",
                    "direction": lines[i + 3] if i + 3 < len(lines) else ""
                }
                i += 4
            else:
                i += 1
    else:
        data = {"error": "'div.oh' 요소를 찾을 수 없습니다."}

    data["updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    save_path = "/home/pi/www/Eco/eco_data.json"
    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    fetch_and_save_eco_data()
