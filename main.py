import eel
#import rfcontroller # This import should be commented out when testing on a PC
import json
import pyautogui
import threading
import vlc
import os
import serial_com

from gtts import gTTS
import tempfile
import sys 

from serial_com import send_command, TVCommand  # Import the send_command function and TVCommand enum from serial_com.py
############################################    GUI SETUP   #######################################################

#controller = rfcontroller.RFController() # Comment this out when developing on desktop
screenWidth, screenHeight = pyautogui.size()
pyautogui.FAILSAFE = False

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

#@eel.expose
#def resetMouse():
    #pyautogui.moveTo(0, screenHeight)

######################################  TEXT-2-SPEECH ############################################################

# Python function that decides to append a character
@eel.expose
def appendCharacter(char):
    eel.addToPhrase(char)  # Call the exposed JavaScript function with the character

@eel.expose
def speak_yes():
    tts = gTTS(text="Yes", lang='en')
    tts.save("t2spresetsounds/yes.mp3")  # Save the speech to an MP3 file
    os.system("open t2spresetsounds/yes.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS)

@eel.expose
def speak_no():
    tts = gTTS(text="No", lang='en')
    tts.save("t2spresetsounds/no.mp3")  # Save the speech to an MP3 file
    os.system("open t2spresetsounds/no.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS)

@eel.expose
def speak_it_starts():
    tts = gTTS(text="It starts with", lang='en')
    tts.save("t2spresetsounds/startswith.mp3")  # Save the speech to an MP3 file
    os.system("open t2spresetsounds/startswith.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS)

@eel.expose
def speak_can_i_ask():
    tts = gTTS(text="I'd like to ask you something", lang='en')
    tts.save("t2spresetsounds/caniask.mp3")  # Save the speech to an MP3 file
    os.system("open t2spresetsounds/caniask.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS)

@eel.expose
def speak_text(text):
    if not text:  # Check if text is empty or None
        print("No text provided to speak.")
        return  # Exit the function
    tts = gTTS(text=text, lang='en')
    # Using tempfile to avoid saving MP3 files directly
    with tempfile.NamedTemporaryFile(delete=True) as fp:
        tts.save(fp.name + '.mp3')
        # Play the speech
        os.system(f"open {fp.name}.mp3") # For Windows use "start" instead of "open"
        # For Linux we use os.system(f"mpg321 {fp.name}.mp3")

###################################### TV CONTROL FUNCTIONS ########################################################
# Function to send power on command
@eel.expose 
def powerOnOff():
    serial_com.send_command(serial_com.TVCommand.TURN_ON_OFF.value)

# Function to send mute command
@eel.expose 
def muteUnmute():
    serial_com.send_command(serial_com.TVCommand.MUTE_UNMUTE.value)

# Function to send volume up command
@eel.expose 
def volumeUp():
    serial_com.send_command(serial_com.TVCommand.VOLUME_UP.value)

# Function to send volume down command
@eel.expose 
def volumeDown():
    serial_com.send_command(serial_com.TVCommand.VOLUME_DOWN.value)

# Function to send channel up command
@eel.expose 
def channelUp():
    serial_com.send_command(serial_com.TVCommand.CHANNEL_UP.value)

# Function to send channel down command
@eel.expose 
def channelDown():
    serial_com.send_command(serial_com.TVCommand.CHANNEL_DOWN.value)

# At the end of your main script or when the Eel server shuts down
def cleanup():
    serial_com.ser.close()
    print("Serial port closed")
######################################  MUSIC PLAYER FUNCTIONS ###################################################

classical_music_dir = '/Users/ianschaefer/ALS-Assistive-Tech/Music/Classical'
christian_music_dir = '/Users/ianschaefer/ALS-Assistive-Tech/Music/Christian'
current_song_index = 0
current_genre = ""  # Define the current genre variable
current_music_dir = ""
current_songs = []

# Initialize VLC
player = vlc.MediaPlayer()

@eel.expose
def on_song_end(event):
    next_song()  # Automatically play the next song

# to play next song when song ends
event_manager = player.event_manager()
event_manager.event_attach(vlc.EventType.MediaPlayerEndReached, on_song_end)

@eel.expose
def set_music_directory(directory):
    global current_music_dir, current_songs, current_genre
    if directory == 'classical':
        current_music_dir = classical_music_dir
        current_genre = "Classical"  # Update the current genre
    elif directory == 'christian':
        current_music_dir = christian_music_dir
        current_genre = "Christian"  # Update the current genre
    current_songs = os.listdir(current_music_dir)

@eel.expose
def play_song(file_name, genre):
    file_path = os.path.join(current_music_dir, file_name)
    media = vlc.Media(file_path)
    player.set_media(media)
    player.play()
    eel.updateSongInformation(os.path.basename(file_path), genre)  # Update song information

@eel.expose
def pause_song():
    player.pause()

@eel.expose
def stop_song():
    player.stop()

@eel.expose
def next_song():
    global current_song_index
    current_song_index = (current_song_index + 1) % len(current_songs)
    file_path = os.path.join(current_music_dir, current_songs[current_song_index])
    play_song(current_songs[current_song_index], current_genre)  # Pass current_genre to play_song()

@eel.expose
def previous_song():
    global current_song_index
    current_song_index = (current_song_index - 1) % len(current_songs)
    file_path = os.path.join(current_music_dir, current_songs[current_song_index])
    play_song(current_songs[current_song_index], current_genre)  # Pass current_genre to play_song()

######################################  TV CONTROL FUNCTIONS    #######################################

if __name__ == "__main__":
    try:
        eel.init('web', allowed_extensions=[".js",".html"])
        #eel.init('/home/pi/ALS-Assistive-Tech/web', allowed_extensions=[".js",".html"])
        #resetMouse()
        eel.start('index.html', cmdline_args=['--start-fullscreen'])
    finally:
        cleanup() 

# Call send_commands() after server starts
serial_com.send_commands()

# At the end of your main script or when the Eel server shuts down
def cleanup():
    serial_com.ser.close()
    print("Serial port closed")