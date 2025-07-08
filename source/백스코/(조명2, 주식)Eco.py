# /home/pi/www/python/elcsoft/controller/ws/Eco.py

import json
import os

def EcoFeed(wikismartdoor, **kwargs):
    eco_path = '/home/pi/www/Eco/eco_data.json'
    try:
        with open(eco_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if wikismartdoor.websocket and wikismartdoor.websocket.is_connected():
            wikismartdoor.websocket.write_message({
                "response": "ecoFeed",
                "data": data
            })
    except Exception as e:
        if wikismartdoor.websocket and wikismartdoor.websocket.is_connected():
            wikismartdoor.websocket.write_message({
                "response": "ecoFeed",
                "error": str(e)
            })



