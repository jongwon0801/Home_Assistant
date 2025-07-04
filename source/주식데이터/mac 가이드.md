#### 셀레니움 패키지 설치
```less
pip install selenium beautifulsoup4 lxml
```

#### chrome 드라이버 안되면 권한부여
```less
#  Mac이 더 이상 해당 파일을 검역(Quarantine) 대상으로 간주하지 않음 → 정상 실행 가능
sudo xattr -r -d com.apple.quarantine /Users/jongwon/Smartdoor/aws/chromedriver

chmod +x /Users/jongwon/Smartdoor/aws/chromedriver
```

#### 드라이버랑 브라우저 버젼 맞아야 함 (138)

```less
# 크롬드라이버 안내
https://developer.chrome.com/docs/chromedriver/downloads?hl=ko

# 크롬드라이버 다운
https://googlechromelabs.github.io/chrome-for-testing/

# 114 이전 드라이버 다운
https://chromedriver.storage.googleapis.com/index.html
```


#### 크롬 브라우저 버젼 확인, 업데이트

```less
chrome://settings/help

자동으로 업데이트 확인을 시작합니다.

업데이트가 있으면 자동으로 다운로드되고 설치됩니다.

완료되면 “재시작” 버튼이 표시됨 → 클릭하면 적용 완료
```









