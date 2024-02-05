import eel
#import rfcontroller # This import should be commented out when testing on a PC
import json
import pyautogui
import threading
import vlc
import os

from gtts import gTTS
import sys 

#controller = rfcontroller.RFController() # Comment this out when developing on desktop
screenWidth, screenHeight = pyautogui.size()
pyautogui.FAILSAFE = False

# Assuming you have a directory with music files
music_dir = 'Music'
songs = os.listdir(music_dir)
current_song_index = 0

@eel.expose
def togglePlug(command):
    print(command) # For testing on a PC, this line should be uncommented, and the following line should be commented out
    #controller.sendcode(command) # This line should be commented out when testing on PC, the library is not available on PC

# Below, some lines are commented out because to autostart on the pi we had to include full file paths. When working on the
# software from a PC, uncomment the shortened paths and comment out the absolute paths that include the /home/pi/...
@eel.expose
def storeConfig(setting, value):
    config = {}
    with open('config.json', 'r') as openfile:
    #with open('/home/pi/ALS-Assistive-Tech/config.json', 'r') as openfile:
        config  = json.load(openfile)
    with open('config.json', 'w') as writefile:
    #with open('/home/pi/ALS-Assistive-Techp/config.json', 'w') as writefile:
        config[setting] = value
        json.dump(config, writefile)

@eel.expose
def loadConfig():
    with open('config.json', 'r') as openfile:
    #with open('/home/pi/ALS-Assistive-Tech/config.json', 'r') as openfile:
        config = json.load(openfile)
        eel.loadConfig(config)

@eel.expose
def resetMouse():
    pyautogui.moveTo(0, screenHeight)

# Initialize VLC
player = vlc.MediaPlayer()

@eel.expose
def play_song(file_path):
    media = vlc.Media(file_path)
    player.set_media(media)
    player.play()

@eel.expose
def pause_song():
    player.pause()

@eel.expose
def stop_song():
    player.stop()

@eel.expose
def next_song():
    global current_song_index
    current_song_index = (current_song_index + 1) % len(songs)
    play_song(os.path.join(music_dir, songs[current_song_index]))

@eel.expose
def previous_song():
    global current_song_index
    current_song_index = (current_song_index - 1) % len(songs)
    play_song(os.path.join(music_dir, songs[current_song_index]))

if __name__ == "__main__":
    eel.init('web', allowed_extensions=[".js",".html"])
    #eel.init('/home/pi/ALS-Assistive-Tech/web', allowed_extensions=[".js",".html"])
    resetMouse()
    eel.start('new_index.html', cmdline_args=['--start-fullscreen'])
    
