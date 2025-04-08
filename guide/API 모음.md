#### Home Assistant 등록 가능 기기 목록

| 기기 유형         | Entity Domain      | 제어 가능 API (REST)                                                                 | 설명                            |
|------------------|--------------------|--------------------------------------------------------------------------------------|---------------------------------|
| 조명 (Light)     | `light`            | `/api/services/light/turn_on`  <br> `/api/services/light/turn_off`                 | 밝기, 색상, 켜기/끄기           |
| 스위치 (Switch)  | `switch`           | `/api/services/switch/turn_on` <br> `/api/services/switch/turn_off`                | 전원 켜기/끄기                  |
| 커튼/블라인드    | `cover`            | `/api/services/cover/open_cover` <br> `/api/services/cover/close_cover` <br> `/api/services/cover/set_cover_position` | 열기/닫기, 위치 설정           |
| 센서 (Sensor)    | `sensor`           | `GET /api/states/<entity_id>` (조회 전용)                                           | 온도, 습도, 상태 정보 확인      |
| 온도조절기        | `climate`          | `/api/services/climate/set_temperature` <br> `/api/services/climate/set_hvac_mode`  | 온도 설정, 냉방/난방 모드 변경 |
| 잠금장치 (Lock)  | `lock`             | `/api/services/lock/lock` <br> `/api/services/lock/unlock`                          | 문 잠금/해제                    |
| 미디어 플레이어  | `media_player`     | `/api/services/media_player/turn_on` <br> `/api/services/media_player/play_media`   | 재생, 정지, 볼륨 제어          |
| 보안 시스템      | `alarm_control_panel` | `/api/services/alarm_control_panel/alarm_arm_away` <br> `/api/services/alarm_control_panel/alarm_disarm` | 보안 상태 설정             |
| 팬 (Fan)         | `fan`              | `/api/services/fan/turn_on` <br> `/api/services/fan/set_percentage`                 | 회전 속도 제어, on/off         |
| 진공청소기       | `vacuum`           | `/api/services/vacuum/start` <br> `/api/services/vacuum/return_to_base`             | 청소 시작, 도킹 명령           |
| 밸브 (Valve)     | `valve`            | `/api/services/valve/open_valve` <br> `/api/services/valve/close_valve`             | 수도, 가스 밸브 제어           |


#### 공통 REST API 목록

| 목적               | Endpoint                                      | 설명                                       |
|--------------------|-----------------------------------------------|--------------------------------------------|
| 모든 엔티티 목록 조회 | `GET /api/states`                             | 모든 엔티티 상태 및 속성 반환              |
| 특정 엔티티 조회     | `GET /api/states/<entity_id>`                 | 해당 엔티티의 현재 상태 조회               |
| 서비스 호출         | `POST /api/services/<domain>/<service>`       | 장치 제어 동작 실행                         |
| 자동화 실행         | `POST /api/services/automation/trigger`       | 지정된 자동화 트리거                         |
| 장치 목록 조회      | `WebSocket: config/device_registry/list`      | 디바이스 레지스트리에서 전체 장치 조회 (WebSocket 전용) |





