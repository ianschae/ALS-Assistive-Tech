import eel
import rfcontroller # This import should be commented out when testing on a PC
import json
import pyautogui
import threading
import vlc
import os


from gtts import gTTS
import tempfile
import sys 


############################################    GUI SETUP   #######################################################

controller = rfcontroller.RFController() # Comment this out when developing on desktop
screenWidth, screenHeight = pyautogui.size()
pyautogui.FAILSAFE = False

@eel.expose
def togglePlug(command):
    #print(command) # For testing on a PC, this line should be uncommented, and the following line should be commented out
    controller.sendcode(command) # This line should be commented out when testing on PC, the library is not available on PC

# Below, some lines are commented out because to autostart on the pi we had to include full file paths. When working on the
# software from a PC, uncomment the shortened paths and comment out the absolute paths that include the /home/pi/...
@eel.expose
def storeConfig(setting, value):
    config = {}
    #with open('config.json', 'r') as openfile:
    with open('/home/pi/Desktop/ALS-Assistive-Tech/ALS-Assistive-Tech/config.json', 'r') as openfile:
        config  = json.load(openfile)
    #with open('config.json', 'w') as writefile:
    with open('/home/pi/Desktop/ALS-Assistive-Tech/ALS-Assistive-Tech/config.json', 'w') as writefile:
        config[setting] = value
        json.dump(config, writefile)

@eel.expose
def loadConfig():
    #with open('config.json', 'r') as openfile:
    with open('/home/pi/Desktop/ALS-Assistive-Tech/ALS-Assistive-Tech/config.json', 'r') as openfile:
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
    tts.save("yes.mp3")  # Save the speech to an MP3 file
    os.system("aplay yes.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS, 'aplay' for linux)

@eel.expose
def speak_no():
    tts = gTTS(text="No", lang='en')
    tts.save("no.mp3")  # Save the speech to an MP3 file
    os.system("aplay no.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS, 'aplay' for linux)

@eel.expose
def speak_it_starts():
    tts = gTTS(text="It starts with", lang='en')
    tts.save("startswith.mp3")  # Save the speech to an MP3 file
    os.system("aplay startswith.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS, 'aplay' for linux)

@eel.expose
def speak_can_i_ask():
    tts = gTTS(text="I'd like to ask you something", lang='en')
    tts.save("caniask.mp3")  # Save the speech to an MP3 file
    os.system("aplay caniask.mp3")  # Play the MP3 file (use 'open' instead of 'start' on macOS, 'aplay' for linux)

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
        os.system(f"aplay {fp.name}.mp3") # For Windows use "start" instead of "open"
        # For Linux you might use os.system(f"aplay {fp.name}.mp3")


######################################  MUSIC PLAYER FUNCTIONS ###################################################

classical_music_dir = 'Music/Classical'
christian_music_dir = 'Music/Christian'
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
    #eel.init('web', allowed_extensions=[".js",".html"])
    eel.init('/home/pi/Desktop/ALS-Assistive-Tech/ALS-Assistive-Tech/web', allowed_extensions=[".js",".html",".css"])
    #resetMouse()
    eel.start('new_index.html', cmdline_args=['--start-fullscreen'])
    
