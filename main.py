import eel
#import rfcontroller # This import should be commented out when testing on a PC
import json
import pyautogui
import threading
import vlc
import os
import serial_com
from serial_com import send_command, TVCommand

from gtts import gTTS
import tempfile
import sys 


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

@eel.expose
def resetMouse():
    pyautogui.moveTo(0, screenHeight)
###################################### TV REMOTE ################################################################
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
######################################  TEXT-2-SPEECH ############################################################

# Python function that decides to append a character
@eel.expose
def appendCharacter(char):
    eel.addToPhrase(char)  # Call the exposed JavaScript function with the character

@eel.expose
def speak_text_with_vlc(text):
    if not text:  # Check if the text is empty or None
        print("No text provided to speak.")
        return  # Exit the function
    tts = gTTS(text=text, lang='en')
    
    # Using tempfile to create a temporary MP3 file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmpfile:
        tts.save(tmpfile.name)  # Save the speech to the temporary MP3 file
        play_speech(tmpfile.name)  # Play the MP3 file using VLC

def play_speech(file_path):
    # Ensure the current music is paused or stopped if needed
    player.pause()  # or player.stop() based on your application's needs
    
    # Load and play the speech file
    media = vlc.Media(file_path)
    player.set_media(media)
    player.play()
    
    # Optional: Resume music playback after the speech is done
    # You might need additional logic to wait for the speech to finish

# Example usage of the function for the given commands
@eel.expose
def speak_yes():
    speak_text_with_vlc("Yes")

@eel.expose
def speak_no():
    speak_text_with_vlc("No")

@eel.expose
def speak_it_starts():
    speak_text_with_vlc("It starts with")

@eel.expose
def speak_can_i_ask():
    speak_text_with_vlc("I'd like to ask you something")

######################################  MUSIC PLAYER FUNCTIONS ###################################################

classical_music_dir = '/home/pi/Desktop/Ian-ALS-Assistive-Tech/ALS-Assistive-Tech/Music/Christian'
christian_music_dir = '/home/pi/Desktop/Ian-ALS-Assistive-Tech/ALS-Assistive-Tech/Music/Classical'
current_song_index = 0
current_genre = ""  # Define the current genre variable

# Initialize VLC
player = vlc.MediaPlayer()

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
    eel.init('web', allowed_extensions=[".js",".html"])
    #eel.init('/home/pi/ALS-Assistive-Tech/web', allowed_extensions=[".js",".html"])
    resetMouse()
    eel.start('index.html', cmdline_args=['--start-fullscreen'])
    
