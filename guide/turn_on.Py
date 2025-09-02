import requests


def turn_on_lamp():
    url = "http://192.168.1.4:8123/api/services/switch/turn_on"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTE0YjYzOTE5NTQ0MjA4YTBkMTNmN2U4NmEzNzg2OSIsImlhdCI6MTc0Mzc0OTc5NiwiZXhwIjoyMDU5MTA5Nzk2fQ.DJ2qYGtzHOxUg0KEI462HkFKkrazV-npGVM1By_y8Os"
    entity_id = "switch.smart_plug_socket_1"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    data = {"entity_id": entity_id}

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        print(result)
        return {
            "result": True,
            "message": "램프가 성공적으로 켜졌습니다.",
            "data": result,
        }
    except requests.RequestException as e:
        print("램프 켜기 오류:", e)
        return {
            "result": False,
            "message": "램프 켜기에 실패했습니다.",
            "error": str(e),
        }


# 사용 예:
if __name__ == "__main__":
    print(turn_on_lamp())
