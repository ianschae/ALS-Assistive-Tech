# from rpi_rf import RFDevice
# import time

# class RFController():
#     action =  {     # Plug controls codes in decimal
#           'allon':  1420119
#         , 'alloff': 1420116
#         , '1on':    1381719
#         , '1off':   1381716
#         , '2on':    1394007
#         , '2off':   1394004
#         , '3on':    1397079
#         , '3off':   1397076
#         , '4on':    4527447
#         , '4off':   4527444
#         , '5on':    4539735
#         , '5off':   4539732
#     }

#     rfdevice = RFDevice(17, tx_pulselength=320) # send pin/pulselength

#     def sendcode(self, code):# Initializes tx pin, sends code, clears pin
#         self.rfdevice.enable_tx()
#         self.rfdevice.tx_code(
#             self.action[code]
#         )
#         self.rfdevice.disable_tx()


# if __name__ == "__main__":
#     dev = RFController()
#     while True:
#         dev.sendcode('allon')
#         time.sleep(1)    
#         dev.sendcode('alloff')
#         time.sleep(1)    
#         dev.sendcode('1on')
#         time.sleep(1)    
#         dev.sendcode('1off')
#         time.sleep(1)    
#         dev.sendcode('2on')
#         time.sleep(1)    
#         dev.sendcode('2off')
#         time.sleep(1)    
#         dev.sendcode('3on')
#         time.sleep(1)    
#         dev.sendcode('3off')
#         time.sleep(1)    
#         dev.sendcode('4on')
#         time.sleep(1)    
#         dev.sendcode('4off')
#         time.sleep(1)    
#         dev.sendcode('5on')
#         time.sleep(1)    
#         dev.sendcode('5off')
#         time.sleep(1)    
