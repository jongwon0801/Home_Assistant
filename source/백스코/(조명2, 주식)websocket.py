import tornado.websocket
import lib
import logger

import elcsoft.controller.ws.init
import elcsoft.controller.ws.network
import elcsoft.controller.ws.vod
import elcsoft.controller.ws.screen
import elcsoft.controller.ws.user
import elcsoft.controller.ws.smartdoor
import elcsoft.controller.ws.smartdoor_cmd
import elcsoft.controller.ws.smartdoor_notice
import elcsoft.controller.ws.smartdoor_schedule
import elcsoft.controller.ws.smartdoor_item
import elcsoft.controller.ws.smartdoor_message
import elcsoft.controller.ws.smartdoor_user
import elcsoft.controller.ws.weather
import elcsoft.controller.ws.busInfo
import elcsoft.controller.ws.qrimg
import elcsoft.controller.ws.communicate
import elcsoft.controller.ws.Eco

class WebsocketHandler(tornado.websocket.WebSocketHandler):
    wikismartdoor = None

    def initialize(self, **kwargs):
        lib.log(f"Websock - initialize")
        self.wikismartdoor = kwargs.get('wikismartdoor', None)
        lib.log(f"wikismartdoor {self.wikismartdoor.websocket}")
                
        #lib.log(f'------------------- {self.wikismartdoor} -------------------')
        self.reconnect_attempts = 0

        self.request_handlers = {
            "init": elcsoft.controller.ws.init.init,
            #통신용
            "sendKiosk": elcsoft.controller.ws.communicate.sendKiosk,
            "sendMqtt": elcsoft.controller.ws.communicate.sendMqtt,
            #컨텐츠 업데이트
            "weatherUpdate": elcsoft.controller.ws.weather.weatherUpdate,
            "noticeUpdate": elcsoft.controller.ws.smartdoor_notice.noticeUpdate,
            "scheduleUpdate": elcsoft.controller.ws.smartdoor_schedule.scheduleUpdate,
            "itemUpdate": elcsoft.controller.ws.smartdoor_item.itemUpdate,
            "getItems": elcsoft.controller.ws.smartdoor_item.getItems,
            "messageUpdate": elcsoft.controller.ws.smartdoor_message.messageUpdate,
            "getMessages": elcsoft.controller.ws.smartdoor_message.getMessages,
            "userUpdate": elcsoft.controller.ws.smartdoor_user.userUpdate,
            "busStopList": elcsoft.controller.ws.busInfo.busStopList,
            #회원
            "getUsers": elcsoft.controller.ws.user.getUsers,
            "getUser": elcsoft.controller.ws.user.getUser,
            "playSoundUserView": elcsoft.controller.ws.user.playSoundUserView,
            "stopSoundUserView": elcsoft.controller.ws.user.stopSoundUserView,
            #네트워크
            "getWifies": elcsoft.controller.ws.network.getWifies,
            "setupWifiProcess": elcsoft.controller.ws.network.setupWifiProcess,
            #녹화영상
            "vod_folders": elcsoft.controller.ws.vod.vod_folders,
            "vod_files": elcsoft.controller.ws.vod.vod_files,
            "saveVod": elcsoft.controller.ws.vod.saveVod,
            #스크린
            "screenOn": elcsoft.controller.ws.screen.screenOn,
            "screenOff": elcsoft.controller.ws.screen.screenOff,
            #스마트도어
            "saveSmartdoor": elcsoft.controller.ws.smartdoor.saveSmartdoor,
            "motionDetectProcess": elcsoft.controller.ws.smartdoor.motionDetectProcess,
            #문열기
            #"doorOpenByQrProcess": elcsoft.controller.ws.smartdoor_cmd.doorOpenByQrProcess,
            "doorOpenByKioskProcess": elcsoft.controller.ws.smartdoor_cmd.doorOpenByKioskProcess,
            "faceLoginProcess": elcsoft.controller.ws.smartdoor_cmd.faceLoginProcess,
            "faceLoginByDataProcess": elcsoft.controller.ws.smartdoor_cmd.faceLoginByDataProcess,
            #"faceDoorOpenProcess": elcsoft.controller.ws.smartdoor_cmd.faceDoorOpenProcess,
            #"faceDoorOpenByDataProcess": elcsoft.controller.ws.smartdoor_cmd.faceDoorOpenByDataProcess,
            "doorOpenByPicture": elcsoft.controller.ws.smartdoor_cmd.doorOpenByPicture,
            # 경제
            "ecoFeed": elcsoft.controller.ws.Eco.EcoFeed,
            #qr이미지
            "generateQRCode": elcsoft.controller.ws.qrimg.generateQRCode,
        }

    def open(self, *args, **kwargs):
        lib.log(f"-----------------------------> Websocket - open <-----------------------------")        
        lib.log(self.wikismartdoor.websocket)

    async def on_message(self, message):
        logger.Logger._LOGGER.info(f"Websocket - Receive message : {message[:500]}")
        
        if message != "":
            try:
                kwargs = lib.jsondecode(message)
                request = kwargs['request']

                if request == "init" :
                    self.wikismartdoor.websocket = self

                if request in self.request_handlers:
                    method = self.request_handlers[request]
                    try:
                        # 비동기 메서드를 안전하게 호출
                        method(self.wikismartdoor, **kwargs)
                    except Exception as e:
                        logger.Logger._LOGGER.exception(f"Error while processing request {request}: {e}")
                else:
                    if request != "log":
                        logger.Logger._LOGGER.info(f"존재하지 않는 요청 : {request}")
            except Exception as e:
                logger.Logger._LOGGER.exception(e)


    def on_close(self):
        lib.log(f"-----------------------------> Websocket - close <-----------------------------")
        lib.log(self.wikismartdoor.websocket)
        lib.log(f"-----------------------------> Websocket - close <-----------------------------")
        lib.log(self)
        lib.log(f"-----------------------------> Websocket - close <-----------------------------")
        if self.wikismartdoor.websocket == self :
            self.wikismartdoor.websocket = None
        lib.log(self.wikismartdoor.websocket)
        lib.log(f"-----------------------------> Websocket - close <-----------------------------")

    def message(self, msg):
        #print("Websocket send message : %s" % msg)
        if type(msg) is dict or type(msg) is list:
            msg = lib.jsonencode(msg)

        self.wikismartdoor.websocket.write_message(msg)

    def check_origin(self, origin):
        return True
    
    def is_connected(self):
        # 연결 상태 확인
        return self.ws_connection is not None and self.ws_connection.stream is not None
      
