"""
Main Module

This module contains functions for controlling a TV using serial communication.
"""

import serial
import time
from enum import Enum

class TVCommand(Enum):
    """Enum class for TV commands."""
    TURN_ON_OFF = '1'
    MUTE_UNMUTE = '2'
    VOLUME_UP = '3' 
    VOLUME_DOWN = '4'
    CHANNEL_UP = '5'
    CHANNEL_DOWN = '6'

try: 
    """Open serial port."""
    ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
    print("Connected to:", ser.name)
except serial.SerialException:
    print("Error opening port")
    exit()

# Add a delay to allow Arduino to boot up  
time.sleep(2)

def send_command(command):
    """Send a command to the serial port.

    Args:
        command (str): The command to send.

    Returns:
        str: The response received from the serial port.
    """
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

def send_commands():
    """Send all commands."""
    send_command(TVCommand.TURN_ON_OFF.value)
    send_command(TVCommand.MUTE_UNMUTE.value)
    send_command(TVCommand.VOLUME_UP.value)
    send_command(TVCommand.VOLUME_DOWN.value)
    send_command(TVCommand.CHANNEL_UP.value)
    send_command(TVCommand.CHANNEL_DOWN.value)
