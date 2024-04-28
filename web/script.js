/*
-------------------------------------------
            Constants
-------------------------------------------
*/

const plugSelectOrder = [
    "plug-all",
    "plug-1",
    "plug-2",
    "plug-3",
    "plug-4",
    "plug-5"
    , "main-menu-btn"
]

const plugSubmenuOrder = [
    "plug-submenu-on",
    "plug-submenu-off",
    "plug-submenu-cancel"
]

const mainMenuOrder = [
    "plugs"
    , "keyboard"
    , "settings"
]

const settingsMenuOrder = [
    "single-input"
    , "touch-mouse"
    , "configure-speed"
    , "settings-back"
]

const speedMenuOrder = [
    "speed-500"
    , "speed-1000"
    , "speed-1500"
    , "speed-2000"
    , "speed-back"

]

const keyboardMenuOrder = [
    "keyboard-new-btn"
    , "keyboard-menu-btn"
]

let dynamicKeyboardOrder = [] // Used for single input mode

let menuIdMapping = {
    "plug-select": plugSelectOrder,
    "plug-submenu": plugSubmenuOrder
    , "main-menu": mainMenuOrder
    , "settings-menu": settingsMenuOrder
    , "keyboard-menu": keyboardMenuOrder
    , "dynamic-kb": dynamicKeyboardOrder
    , "configure-speed-menu": speedMenuOrder
}

let plugLabels = {
    "1": "Plug 1",
    "2": "PLug 2",
    "3": "Plug 3",
    "4": "Plug 4",
    "5": "Plug 5"
}

/*
_____________________________________________________________________________________________________
                                            MAIN MENU CONSTANTS
_____________________________________________________________________________________________________
*/
const menuContainer = document.getElementById('main-menu');
const menuItems = menuContainer.querySelectorAll('.button-text-speech,.button-TV-controls,.button-music,.button-outlet,.button-settings');
/*
_____________________________________________________________________________________________________
                                            T2S/KEYBOARD CONSTANTS
_____________________________________________________________________________________________________
*/
const t2sContainer = document.getElementById('text-2-speech');
const t2sItems = t2sContainer.querySelectorAll('.button-yes,.button-no,.button-starts-with,.button-ask-something,.button-large,.phrase-text,.button-TV-controls,.button-music,.button-outlet,.button-settings,.button-main-menu');

const keyboardContainer = document.getElementById('text-2-speech');
const keyboardItems = keyboardContainer.querySelectorAll('.prediction,.prediction-2,.prediction-3,.key-mini-space,.key-go-back,.key-q,.key-w,.key-e,.key-r,.key-t,.key-y,.key-u,.key-i,.key-o,.key-p,.key-auto,.key-a,.key-s,.key-d,.key-f,.key-g,.key-h,.key-j,.key-k,.key-l,.key-z,.key-x,.key-c,.key-v,.key-b,.key-n,.key-m,.key-backspace,.key-auto-2,.key-00,.key,.key-2,.key-3,.key-4,.key-5,.key-6,.key-7,.key-8,.key-9,.key-speak-it,.key-new-phrase');


/**
___________________________________________________________________________________________________
                                        TV CONTROL CONSTANTS
___________________________________________________________________________________________________
 */
const tvContainer = document.getElementById('tv-control-menu');
const tvItems = tvContainer.querySelectorAll('.button-main-menu,.button-settings,.button-outlet,.button-music,.button-text-speech,.button-mute-ON-OFF,.button-volume-DOWN,.button-volume-UP,.button-channel-DOWN,.button-channel-UP,.button-power-ON-OFF');
/*
/*
___________________________________________________________________________________________________
                                        MUSIC CONTROL CONSTANTS
___________________________________________________________________________________________________
*/
const musicContainer = document.getElementById('music-menu');
const musicItems = musicContainer.querySelectorAll('.button-main-menu,.button-settings,.button-outlet,.button-TV-controls,.button-text-speech,.button-skip-song,.button-PAUSE-PLAY,.button-previous-song,.button-classical,.button-christian');
/*
/*
____________________________________________________________________________________________________________________
                                        OUTLET CONTROL CONSTANTS
____________________________________________________________________________________________________________________
*/
const outletContainer = document.getElementById('outlet-menu');
const outletItems = outletContainer.querySelectorAll('.button-main-menu,.button-settings,.button-TV-controls,.button-music,.button-text-speech,.button-plug-ON-OFF-5,.button-plug-ON-OFF-4,.button-plug-ON-OFF-1,.button-plug-ON-OFF-2,.button-plug-ON-OFF-3,.button-all-plugs-ON');

/*
_____________________________________________________________________________________________________________________
                                        SETTINGS CONTROL CONSTANTS
_____________________________________________________________________________________________________________________
*/
const settingsContainer = document.getElementById('settings-page');
const settingsItems = settingsContainer.querySelectorAll('.switch-speed-sec,.switch-speed-sec-2,.switch-speed-sec-3,.switch-speed-sec-4,.switch-speed-sec-5,.switch-speed-sec-6,.switch-speed-sec-7,.switch-speed-sec-8,.button-go-back');
/*
____________________________________________________________________________________________________________________
            Global Vars
____________________________________________________________________________________________________________________
*/
let singleInputMode = true
var selectedIndex = -1
var selectedMenuOrder
var previousElement
var previousColor
var cycleTimeout
var cycleTime = 500  //2000

/*
--------------------------------------------------
                INITIALIZATION
--------------------------------------------------
*/
function init() {
    eel.loadConfig()
}

function resetMouse(event){
    if (event != undefined) event.stopPropagation()
    eel.resetMouse()
}


//default to main menu container and items
let currentContainer = menuContainer;
let currentItems = menuItems;

function openSubmenu(event, supermenuId, submenuId) {
    if (event != undefined) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId);
    let submenu = document.getElementById(submenuId);

    if (supermenu && submenu) {
        supermenu.style.display = 'none'; // Hide the supermenu
        submenu.style.display = 'block'; // Show the submenu

        if (submenuId === 'main-menu') {
            currentContainer = menuContainer;
            currentItems = menuItems;
        }
        if (submenuId === 'text-2-speech') {
            currentContainer = t2sContainer;
            currentItems = t2sItems;
        }
        if (submenuId === 'tv-control-menu') {
            currentContainer = tvContainer;
            currentItems = tvItems;
        }
        if (submenuId === 'music-menu') {
            currentContainer = musicContainer;
            currentItems = musicItems;
        }
        if(submenuId === 'outlet-menu'){
            currentContainer = outletContainer;
            currentItems = outletItems;
        }
        if(submenuId === 'settings-page'){
            currentContainer = settingsContainer;
            currentItems = settingsItems;
        }
    }
    const keyboardButton = document.querySelector('.phrase-text'); // If there's only one keyboard button
    if (keyboardButton) {
        keyboardButton.addEventListener('click', function () {
            currentContainer = keyboardContainer;
            currentItems = keyboardItems;
            item.style.boxShadow = '';
            
        });
    }
    const backButton = document.querySelector('.key-go-back');//for back button
    if (backButton) {
        backButton.addEventListener('click', function () {
            currentContainer = t2sContainer;
            currentItems = t2sItems;
            item.style.boxShadow = '';
        });
    }
}


/*
--------------------------------------------------
        Input Mode Functions
--------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', function () {
    let cycleTimeout;
    let currentIndex = 0;
    let cycling = false;
     
    const highlightItem = (index) => {
        // First, remove the yellow glow from all current items
        currentItems.forEach(item => {
            item.style.boxShadow = ''; // Remove any existing glow effect
        });
        // Then, apply a yellow glow to the current item
        const currentItem = currentItems[index];
        if (currentItem) {
            currentItem.style.boxShadow = '0 0 30px purple'; // Apply a yellow glow effect
        }
    };

    const cycleItems = () => {
        if (!cycling) return;
        highlightItem(currentIndex);
        currentIndex = (currentIndex + 1) % currentItems.length; // Use currentItems for length
        cycleTimeout = setTimeout(cycleItems, cycleTime);
    };

    // Use a more generic event listener that checks if the currentContainer contains the event target
    document.addEventListener('pointerdown', function (event) {
        if (currentContainer.contains(event.target)) {
            cycling = true;
            cycleItems();
        }
    });

    document.addEventListener('pointerup', function () {
        if (!cycling) return;
        clearTimeout(cycleTimeout);
        cycling = false;
        const selectedItemIndex = (currentIndex === 0 ? currentItems.length : currentIndex) - 1;
        currentItems[selectedItemIndex].click(); // Click the highlighted item using currentItems
        currentIndex = 0;
    });
});
/*
--------------------------------------------------
            RF CONTROLLER CODE
--------------------------------------------------
*/
let plugState = 0;

function toggleAll(){
    if(plugState === 0){
        plugState = 1;
        console.log("all on");
        eel.togglePlug("allon");
    }
    else{
        plugState = 0;
        console.log("all off");
        eel.togglePlug('alloff')
    }
}
function togglePlug1(){
    if(plugState === 0){
        plugState = 1;
        console.log("1 on");
        eel.togglePlug("1on");
    }
    else{
        plugState = 0;
        console.log("1 off");
        eel.togglePlug('1off')
    }
}
function togglePlug2(){
    if(plugState === 0){
        plugState = 1;
        console.log("2 on");
        eel.togglePlug("2on");
    }
    else{
        plugState = 0;
        console.log("2 off");
        eel.togglePlug('2off')
    }
}
function togglePlug3(){
    if(plugState === 0){
        plugState = 1;
        console.log("3 on");
        eel.togglePlug("3on");
    }
    else{
        plugState = 0;
        console.log("3 off");
        eel.togglePlug('3off')
    }
}
function togglePlug4(){
    if(plugState === 0){
        plugState = 1;
        console.log("on");
        eel.togglePlug("4on");
    }
    else{
        plugState = 0;
        console.log("off");
        eel.togglePlug('4off')
    }
}
function togglePlug5(){
    if(plugState === 0){
        plugState = 1;
        console.log("on");
        eel.togglePlug("5on");
    }
    else{
        plugState = 0;
        console.log("off");
        eel.togglePlug('5off')
    }
}
/*
--------------------------------------------------
            Keyboard Functions
--------------------------------------------------
*/


// janesKeyboardSelection is custom to a request by Jane and her caretakers. This goes through all
// keys one at a time to select the button needed.


// The following two functions (setKeyboardRowCycle and setKeyboardButtonCycle) allow the device
// to select first the keyboard row and second the keyboard button. It is a faster way of going
// through the keyboard.
const setKeyboardRowCycle = () => {
    if (singleInputMode) {
        let newArr = document.getElementsByClassName('keyboard-row')
        dynamicKeyboardOrder = []
        for (let ele of newArr) {
            dynamicKeyboardOrder.push(ele.id)
            ele.onclick = (e) => setKeyboardButtonCycle(ele)
        }
        menuIdMapping["dynamic-kb"] = dynamicKeyboardOrder
        resetCycle("dynamic-kb")
    }
}

const setKeyboardButtonCycle = (ele) => {
    dynamicKeyboardOrder = []
    for (let child of ele.children) {
        dynamicKeyboardOrder.push(child.id)
    }
    menuIdMapping["dynamic-kb"] = dynamicKeyboardOrder
    resetCycle("dynamic-kb")
}
/*
_________________________________________________________________________________________________
                                TEXT-2-SPEECH FUNCTIONS
_________________________________________________________________________________________________
*/
class TrieNode {
    constructor() {
      this.children = new Map();
      this.wordCount = 0;
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word, count) {
      let node = this.root;
      for (const char of word) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char);
      }
      node.isEndOfWord = true;
      node.wordCount = count;
    }
  
    search(prefix) {
      let node = this.root;
      for (const char of prefix) {
        if (!node.children.has(char)) {
          return [];
        }
        node = node.children.get(char);
      }
      return this.getPredictiveText(node, prefix);
    }
  
    getPredictiveText(node, prefix) {
      const suggestions = [];
      const queue = [[node, prefix]];
  
      while (queue.length > 0) {
        const [currentNode, currentPrefix] = queue.shift();
  
        if (currentNode.isEndOfWord) {
          suggestions.push({ word: currentPrefix, count: currentNode.wordCount });
        }
  
        for (const [char, child] of currentNode.children) {
          queue.push([child, currentPrefix + char]);
        }
      }
  
      return suggestions.sort((a, b) => b.count - a.count);
    }
  }
  

  async function addToPhrase(char) {
    var textBox = document.getElementById("phrase-text-box");

    if (char === ' ') {
        textBox.innerHTML += '&nbsp;'; // Add a non-breaking space for visual consistency
    } 
    else {
        // Append the character or replace the last word with the new one if longer input
        if (char.length > 1) {
            let words = textBox.innerText.split(/\s+/);
            words.pop(); // Remove the last word
            words.push(char); // Add the new word
            textBox.innerText = words.join(" ") + " "; // Reconstruct the text and add a space for further typing
        } else {
            textBox.innerText += char;
        }

        // Get last word from the textBox for prediction
        let words = textBox.innerText.trim().split(/\s+/);
        let lastWord = words.pop(); // The last word for prediction

        console.log("Current content:", textBox.innerText.toLowerCase());
        console.log("Last word for prediction:", lastWord.toLowerCase());

        try {
            const predictions = await predictiveText(lastWord.toLowerCase());
            console.log(predictions);

            const prediction1 = document.getElementById("prediction1");
            const prediction2 = document.getElementById("prediction2");
            const prediction3 = document.getElementById("prediction3");

            if (predictions.length >= 3) {
                prediction1.innerText = predictions[0].toUpperCase();
                prediction2.innerText = predictions[1].toUpperCase();
                prediction3.innerText = predictions[2].toUpperCase();
            }
            else if (predictions.length == 2) {
            prediction1.innerText = predictions[0].toUpperCase();
            prediction2.innerText = predictions[1].toUpperCase();
            prediction3.innerText = "";
            }
            else if (predictions.length == 2) {
            prediction1.innerText = predictions[0].toUpperCase();
            prediction2.innerText = "";
            prediction3.innerText = "";
            } 
            else {
            prediction1.innerText = "";
            prediction2.innerText = "";
            prediction3.innerText = "";
            }
        } catch (error) {
            console.error("Prediction error:", error);
        }
    }
}

eel.expose(addToPhrase);//expose to eel

function deleteChar() {
    var textBox = document.getElementById("phrase-text-box");
    var currentText = textBox.innerText;
    textBox.innerText = currentText.slice(0, -1); //removes last char
}
//eel.expose(deleteChar);
async function predictiveText(input) {
    try {
        // Fetch the words.txt file
        const response = await fetch('words.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch file contents');
        }
        const fileContents = await response.text();

        // Split file contents into lines
        const lines = fileContents.split('\n');

        // Build Trie structure from file contents
        const trie = new Trie();
        for (const line of lines) {
            const [word, count] = line.split(" ");
            trie.insert(word, parseInt(count));
        }

        // Perform search and return suggestions
        const suggestions = trie.search(input).slice(0, 3).map(({ word }) => word);
        return suggestions;
    } catch (error) {
        throw new Error('Failed to retrieve predictive text suggestions: ' + error.message);
    }
}

function newPhrase() {
    var textBox = document.getElementById("phrase-text-box");
    
    // STILL NEED TO IMPLEMENT BIASING INTO WORDS.TXT
    
    textBox.innerText = ''; //clears the string;

    // clear the prediction boxes 
    const prediction1 = document.getElementById("prediction1");
    const prediction2 = document.getElementById("prediction2");
    const prediction3 = document.getElementById("prediction3");
    
    prediction1.innerText = ""; 
    prediction2.innerText = ""; 
    prediction3.innerText = ""; 

}
//eel.expose(newPhrase);

function speakYes() {
    eel.speak_yes();  // Call the Python function
}
function speakNo() {
    eel.speak_no();
}
function speakItStarts() {
    eel.speak_it_starts();
}
function speakCanIAsk() {
    eel.speak_can_i_ask();
}
function speakPhrase() {
    var textBox = document.getElementById("phrase-text-box");
    var text = textBox.innerText; // Use .value for input box, .innerText or .textContent for div/span
    eel.speak_text_with_vlc(text); // Call the Python function

    textBox.innerText = '';
}
eel.expose(speakPhrase);
/*
--------------------------------------------------
TV Control Functions
--------------------------------------------------
*/
/*
--------------------------------------------------
*/
/* Does nothing but when removed, user TV Remote 
buttons click doesn't register to the Arduino */
function powerOn() { 
    //eel.powerOn() 
   }
/*
--------------------------------------------------
*/

// Function to send power on/off command
function powerOnOff() {
    console.log("power")
    eel.powerOnOff();
}
// Function to send mute command
function muteUnmute() {
    console.log("mute")
    eel.muteUnmute();
}

// Function to send volume up command
function volumeUp(){
    console.log("volume up")
    eel.volumeUp();
}

// Function to send volume down command
function volumeDown() {
    console.log("volume down")
    eel.volumeDown();
}

// Function to send channel up command
function channelUp() {
    console.log('channel up')
    eel.channelUp();
}

// Function to send channel down command
function channelDown() {
    console.log('channel down')
    eel.channelDown();
}
/*
_________________________________________________________________________________________________
                                MUSIC PLAYER CONTROL FUNCTIONS
__________________________________________________________________________________________________
*/
function setMusicDirectory(directory) {
    eel.set_music_directory(directory);
}
function playClassicalMusic() {
    setMusicDirectory('classical'); // Set music directory to classical
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Classical/Ave Maria (after J.S. Bach).mp3', 'Classical'); // Play the first song (replace with actual song name)
}

function playChristianMusic() {
    setMusicDirectory('christian'); // Set music directory to christian
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Christian/A Mighty Fortress Is Our God.mp3', 'Christian'); // Play the first song (replace with actual song name)
}

function playSong(filePath, genre) {
    eel.play_song(filePath, genre); // filePath is the path to the song file
}

function pauseSong() {
    eel.pause_song();
}

function stopSong() {
    eel.stop_song();
}

function nextSong() {
    eel.next_song(); // Function to play the next song
}

function previousSong() {
    eel.previous_song(); // Function to play the previous song
}
// Update the song information displayed in the div boxes
function updateSongInformation(songName, genre) {
    document.getElementById("song-playing").innerText = "Now Playing: " + songName;
    document.getElementById("genre").innerText = "Genre: " + genre;
}
eel.expose(updateSongInformation); // Expose the function to Eel

/*
______________________________________________________________________________________________________
                                        SETTINGS PAGE CODE
______________________________________________________________________________________________________
*/
function cycleTimeHalfSecond(){
    cycleTime = 500;
}
function cycleTimeOneSecond(){
    cycleTime = 1000;
}
function cycleTimeOneHalfSecond(){
    cycleTime = 1500;
}
function cycleTimeTwoSecond(){
    cycleTime = 2000;
}
function cycleTimeTwoHalfSecond(){
    cycleTime = 2500;
}
function cycleTimeThreeSecond(){
    cycleTime = 3000;
}
function cycleTimeThreeHalfSecond(){
    cycleTime = 3500;
}
function cycleTimeFourSecond(){
    cycleTime = 4000;
}

/*
--------------------------------------------------
                Config
--------------------------------------------------
*/

function storeConfig(setting, value) {
    eel.storeConfig(setting, value)
}

eel.expose(loadConfig)
function loadConfig(config) {

    cycleTime = config.cycleTime
    charLimit = config.charLimit
    plugLabels = config.plugLabels

    updateLabels()
}

function updateLabels() {
    for (var label in plugLabels) {
        document.getElementById("plug-" + label).innerHTML = plugLabels[label]
    }
    document.getElementById("speed-label").innerHTML = "Current Speed: " + timeToSeconds[cycleTime]
}