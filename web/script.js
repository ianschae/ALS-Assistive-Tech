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
const tvRemoteSelectOrder = [
    "tv-power",
    "tv-mute",
    "tv-channel-up",
    "tv-channel-down",
    "tv-volume-up",
    "tv-volume-down",
    "main-menu-btn"
];
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
const t2sItems = t2sContainer.querySelectorAll('.button-yes,.button-no,.button-starts-with,.button-ask-something,.button-large,.keyboard,.button-TV-controls,.button-music,.button-outlet,.button-settings,.button-main-menu');

const keyboardContainer = document.getElementById('keyboard');
const keyboardItems = keyboardContainer.querySelectorAll('.key-q,.key-w,.key-e,.key-r,.key-t,.key-y,.key-u,.key-i,.key-o,.key-p,.key-auto,.key-a,.key-s,.key-d,.key-f,.key-g,.key-h,.key-j,.key-k,.key-l,.key-z,.key-x,.key-c,.key-v,.key-b,.key-n,.key-m,.key-backspace,.key-auto-2,.group-wrapper-2,.key,.key-2,.key-3,.key-4,.key-5,.key-6,.key-7,.key-8,.key-9,.key-speak-it,.key-space,.key-new-phrase,.key-go-back');

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
const musicItems = musicContainer.querySelectorAll('.button-christian,.button-classical,.button-previous-song,.button-PAUSE-PLAY,.button-skip-song,.button-main-menu,.button-settings,.button-outlet,.button-TV-controls,.button-text-speech');
/*
/*
____________________________________________________________________________________________________________________
                                        OUTLET CONTROL CONSTANTS
____________________________________________________________________________________________________________________
*/
const outletContainer = document.getElementById('outlet-menu');
const outletItems = outletContainer.querySelectorAll('.button-main-menu,.button-settings,.button-TV-controls,.button-music,.button-text-speech');
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
var cycleTime = 1000  //2000

/*
___________________________________________________________________________________________________________________
                INITIALIZATION
___________________________________________________________________________________________________________________
*/
function init() {
    // setTime();
    eel.loadConfig()
    for (button of document.getElementsByTagName('button')) {
        // button.addEventListener('click', resetMouse) // Changed to pointerdown event for change
        button.addEventListener('pointerdown', resetMouse)
    }
    if (singleInputMode) {
        // document.body.onclick = e => accessibilityMouseClick() // Chnged to pointerdown event for Jane
        document.body.onpointerdown = e => accessibilityMouseClick(e)
        selectedMenuOrder = mainMenuOrder;
        resetCycle('main-menu')
    }
}
/*
function resetMouse(event){
    if (event != undefined) event.stopPropagation()
    eel.resetMouse()
}
*/

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
        if (submenuId === 'outlet-menu') {
            currentContainer = outletContainer;
            currentItems = outletItems;
        }
    }
}


/*
--------------------------------------------------
        Single Input Mode Functions
--------------------------------------------------
*/

const toggleInputMode = (e, mode) => {
    if (mode == 'on') {
        singleInputMode = true
        // document.body.onclick = accessibilityMouseClick // Changed to on mouse down for Jane
        document.body.onpointerdown = accessibilityMouseClick
    } else {
        singleInputMode = false
        if (cycleTimeout != null) previousElement.style.backgroundColor = previousColor
        // document.body.onclick = null
        document.body.pointerdown = null
        clearTimeout(cycleTimeout)
    }
    changeMenu(e, 'main-menu')
}


const resetCycle = (menuId) => {
    selectedIndex = -1
    selectedMenuOrder = menuIdMapping[menuId]
    clearTimeout(cycleTimeout)
    cycleSelection()
}


function accessibilityMouseClick(e) {
    if (e != undefined) e.stopPropagation()
    if (singleInputMode) {  // Something keeps reseting body.click to accessibilityMouseClick, check to fix error
        // document.body.onclick = e => {} // Changed to onpointerdown event for Jane
        document.body.onpointerdown = e => { }
        selectedElement = document.getElementById(selectedMenuOrder[selectedIndex])
        // selectedElement.click(); // Changed to pointerdown for Jane
        selectedElement.onpointerdown()
        // document.body.onclick = e => accessibilityMouseClick() // Changed to onpointerdown event for jane
        document.body.onpointerdown = e => accessibilityMouseClick()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let cycleTimeout;
    let currentIndex = 0;
    let cycling = false;

    const keyboardButton = document.querySelector('.keyboard'); // If there's only one keyboard button
    if (keyboardButton) {
        keyboardButton.addEventListener('click', function () {
            currentContainer = keyboardContainer;
            currentItems = keyboardItems;
            highlightItem;
        });
    }
    const autoButtons = document.querySelectorAll('.auto, .auto-2, .auto-3');

    autoButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentContainer = t2sContainer; // Make sure t2sContainer is correctly defined elsewhere
            currentItems = t2sItems; // Ensure t2sItems is also defined and accessible here
            highlightItem;
        });
    });
    const highlightItem = (index) => {
        // First, remove the yellow glow from all current items
        currentItems.forEach(item => {
            item.style.boxShadow = ''; // Remove any existing glow effect
        });
        // Then, apply a yellow glow to the current item
        const currentItem = currentItems[index];
        if (currentItem) {
            currentItem.style.boxShadow = '0 0 20px yellow'; // Apply a yellow glow effect
        }
    };

    const cycleItems = () => {
        if (!cycling) return;
        highlightItem(currentIndex);
        currentIndex = (currentIndex + 1) % currentItems.length; // Use currentItems for length
        cycleTimeout = setTimeout(cycleItems, 1000);
    };

    //more generic event listener that checks if the currentContainer contains the event target
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
    });
});
/*
________________________________________________________________________________________
            RF CONTROLLER CODE
________________________________________________________________________________________
*/

function togglePlug(e, state) {
    let plugId = document.getElementById('plug-submenu').getAttribute('plug-label')
    eel.togglePlug(plugId + state)
    let statusEl = document.getElementById("status-" + plugId)
    if (state == 'on') {
        // Toggle Power Indicator On
    }
    else {
        // Toggle Power Indicator Off
    }
    closeSubmenu(e, 'plug-select', 'plug-submenu')
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
function addToPhrase(char) {
    var textBox = document.getElementById("phrase-text-box");
    if (char === ' ') {
        textBox.innerHTML += '&nbsp;'; // Add a non-breaking space for visible effect
    } else {
        textBox.innerText += char;
    }
}
eel.expose(addToPhrase);//expose to eel

function deleteChar() {
    var textBox = document.getElementById("phrase-text-box");
    var currentText = textBox.innerText;
    textBox.innerText = currentText.slice(0, -1); //removes last char
}
//eel.expose(deleteChar);

function newPhrase() {
    var textBox = document.getElementById("phrase-text-box");
    textBox.innerText = ''; //clears the string;
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
    eel.speak_text(text); // Call the Python function

    textBox.innerText = '';
}
eel.expose(speakPhrase);

/*
________________________________________________________________________________
                                    TV Control Functions
________________________________________________________________________________
*/
/*
--------------------------------------------------
*/
/* Does nothing but when removed, user TV Remote 
buttons click doesn't register to the Arduino */
function powerOn() { 
    //eel.powerOn() 
   }
const button = document.getElementById("init-remtoe-btn");
button.addEventListener("click", powerOn);
/*
--------------------------------------------------
*/

// Function to send power on/off command
function powerOnOff() {
    eel.powerOnOff();
}
// Attach powerOnOff function to button
const powerButton = document.getElementById("tv-power");
powerButton.addEventListener("click", powerOnOff);

// Function to send mute command
function muteUnmute() {
    eel.muteUnmute();
}
// Attach muteUnmute function to button
const muteButton = document.getElementById("tv-mute");
muteButton.addEventListener("click", muteUnmute);

// Function to send volume up command
function volumeUp() {
    eel.volumeUp();
}
// Attach volumeUp function to button
const volumeUpButton = document.getElementById("tv-volume-up");
volumeUpButton.addEventListener("click", volumeUp);

// Function to send volume down command
function volumeDown() {
    eel.volumeDown();
}
// Attach volumeDown function to button
const volumeDownButton = document.getElementById("tv-volume-down");
volumeDownButton.addEventListener("click", volumeDown);

// Function to send channel up command
function channelUp() {
    eel.channelUp();
}
// Attach channelUp function to button
const channelUpButton = document.getElementById("tv-channel-up");
channelUpButton.addEventListener("click", channelUp);

// Function to send channel down command
function channelDown() {
    eel.channelDown();
}
// Attach channelDown function to button
const channelDownButton = document.getElementById("tv-channel-down");
channelDownButton.addEventListener("click", channelDown);

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
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Classical/Ave Maria (after J.S. Bach).mp3', 'classical'); // Play the first song (replace with actual song name)
}

function playChristianMusic() {
    setMusicDirectory('christian'); // Set music directory to christian
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Christian/Amazing Grace.mp3', 'christian'); // Play the first song (replace with actual song name)
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
______________________________________________________________________________________
                                    Config
______________________________________________________________________________________
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

var timeToSeconds = {
    "500": "&frac12; Second",
    "1000": "1 Second",
    "1500": "1 &frac12; Seconds",
    "2000": "2 Seconds"
}

function updateLabels() {
    for (var label in plugLabels) {
        document.getElementById("plug-" + label).innerHTML = plugLabels[label]
    }
    document.getElementById("speed-label").innerHTML = "Current Speed: " + timeToSeconds[cycleTime]
}

function setCycleTime(event, time) {
    if (event != undefined) event.stopPropagation()
    storeConfig('cycleTime', time)
    cycleTime = time
    updateLabels()
}