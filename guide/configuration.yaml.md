#### 홈어시스턴트 원격 접속 cors 주소 추가
```less
ssh root@192.168.1.4
```

#### /root/config/configuration.yaml 
```less
# Loads default set of integrations. Do not remove.
default_config:

# Load frontend themes from the themes folder
frontend:
  themes: !include_dir_merge_named themes

http:
  cors_allowed_origins:
    - "http://192.168.0.3"
    - "http://127.0.0.1"
    - "http://localhost"
    - "http://192.168.0.42"  # 추가된 항목
    - "http://192.168.1.3"
automation: !include automations.yaml
script: !include scripts.yaml
scene: !include scenes.yaml
```
