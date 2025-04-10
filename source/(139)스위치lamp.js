async function checkLampStatus() {
  const url = 'http://192.168.0.174:8123/api/states/switch.wifi_smart_switch_switch_1';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTE0YjYzOTE5NTQ0MjA4YTBkMTNmN2U4NmEzNzg2OSIsImlhdCI6MTc0Mzc0OTc5NiwiZXhwIjoyMDU5MTA5Nzk2fQ.DJ2qYGtzHOxUg0KEI462HkFKkrazV-npGVM1By_y8Os';

  console.log(url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    
    return {
      isOn: data.state === 'on',
      friendlyName: data.attributes.friendly_name,
      lastChanged: new Date(data.last_changed),
      entityId: data.entity_id
    };
  } catch (error) {
    console.error('Error checking lamp status:', error);
    return null;
  }
}

async function turnOnLamp() {
  const url = 'http://192.168.0.174:8123/api/services/switch/turn_on';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTE0YjYzOTE5NTQ0MjA4YTBkMTNmN2U4NmEzNzg2OSIsImlhdCI6MTc0Mzc0OTc5NiwiZXhwIjoyMDU5MTA5Nzk2fQ.DJ2qYGtzHOxUg0KEI462HkFKkrazV-npGVM1By_y8Os';
  const entityIds = [
    'switch.wifi_smart_switch_switch_1',
    'switch.wifi_smart_switch_switch_2'
  ];

  console.log(url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ entity_id: entityIds })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return {
      result: true,
      message: '스위치가 성공적으로 켜졌습니다.',
      data: data
    };
  } catch (error) {
    console.error('스위치 켜기 오류:', error);
    return {
      result: false,
      message: '스위치 켜기에 실패했습니다.',
      error: error.message
    };
  }
}

async function turnOffLamp() {
  const url = 'http://192.168.0.174:8123/api/services/switch/turn_off';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTE0YjYzOTE5NTQ0MjA4YTBkMTNmN2U4NmEzNzg2OSIsImlhdCI6MTc0Mzc0OTc5NiwiZXhwIjoyMDU5MTA5Nzk2fQ.DJ2qYGtzHOxUg0KEI462HkFKkrazV-npGVM1By_y8Os';
  const entityIds = [
    'switch.wifi_smart_switch_switch_1',
    'switch.wifi_smart_switch_switch_2'
  ];

  console.log(url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ entity_id: entityIds })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return {
      result: true,
      message: '스위치가 성공적으로 꺼졌습니다.',
      data: data
    };
  } catch (error) {
    console.error('스위치 끄기 오류:', error);
    return {
      result: false,
      message: '스위치 끄기에 실패했습니다.',
      error: error.message
    };
  }
}
