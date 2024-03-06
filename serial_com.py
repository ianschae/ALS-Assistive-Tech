import serial
import time
from enum import Enum

# Enum class for commands
class TVCommand(Enum):
  TURN_ON_OFF  = '1'
  MUTE_UNMUTE  = '2'
  VOLUME_UP    = '3' 
  VOLUME_DOWN  = '4'
  CHANNEL_UP   = '5'
  CHANNEL_DOWN = '6'

# Open serial port
try: 
  ser = serial.Serial('COM4', 115200, timeout=1)
  print("Connected to:", ser.name)

except serial.SerialException:
  print("Error opening port")
  exit()   

# Add a delay to allow Arduino to boot up  
time.sleep(2)

# Function to send commands
def send_command(command):

  # Flush buffers
  ser.flush()
  # Flush a second time to clear buffers
  ser.flush() 

  # Send actual command
  ser.write(command.encode())
  
  # Longer delay
  time.sleep(1)  

  # Read response
  response = ser.readline().decode().strip()

  print("Sent:", command)
  print("Response:", response)

# Function to send all commands  
def send_commands():
    send_command(TVCommand.TURN_ON_OFF.value)
    send_command(TVCommand.MUTE_UNMUTE.value)
    send_command(TVCommand.VOLUME_UP.value)
    send_command(TVCommand.VOLUME_DOWN.value)
    send_command(TVCommand.CHANNEL_UP.value)
    send_command(TVCommand.CHANNEL_DOWN.value)

# Close serial port, CAUSED ERROR
#ser.close()