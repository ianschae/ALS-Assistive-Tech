/*
-------------------------------------------
            Constants
-------------------------------------------
*/
// Current focus area, represented by a string that matches one of the constants defined later
let currentFocusArea = 'mainMenuButtons'; // Default to starting with main menu buttons
let currentIndex = 0; // Index of the currently highlighted button/key
let cycling = false; // Indicates if cycling through elements is currently active


// Mapping submenu IDs to their corresponding button ID arrays
const submenuFocusMapping = {
    "text-2-speech": keyboardFullOrder, // Assuming keyboardFullOrder is the focus for the text-2-speech submenu
    "main-menu": mainMenuButtons, // The main menu buttons
    "tv-control-menu": tvControlButtons,
    "music-menu": musicControlButtons,
    "settings-page": settingsButtons,
    // Add other submenu mappings here
};

const mainMenuButtons = [
    "button-text-speech",
    "button-TV-controls",
    "button-music",
    "button-outlet",
    "button-settings"
];

const keyboardLayout = {
    "keyboard-first-row": [
        "key-q", "key-w", "key-e", "key-r", "key-t",
        "key-y", "key-u", "key-i", "key-o", "key-p",
        "auto-1" // Assuming this is the ID for the 'Auto' functionality in the first row
    ],
    "keyboard-second-row": [
        "key-a", "key-s", "key-d", "key-f", "key-g",
        "key-h", "key-j", "key-k", "key-l",
        // Assuming there's an auto functionality for the second row as well
    ],
    "keyboard-third-row": [
        "key-z", "key-x", "key-c", "key-v", "key-b",
        "key-n", "key-m", "key-backspace",
        "key-auto-2" // Assuming this is the ID for the 'Auto' functionality in the third row
    ],
    "keyboard-fourth-row": [
        "key-1", "key-2", "key-3", "key-4", "key-5",
        "key-6", "key-7", "key-8", "key-9", "key-0"
    ],
    "keyboard-fifth-row": [
        "key-speak-it", "key-space", "key-new-phrase", "key-go-back"
    ]
};

// Combining all keys for general cycling
const keyboardFullOrder = [
    ...keyboardLayout["keyboard-first-row"],
    ...keyboardLayout["keyboard-second-row"],
    ...keyboardLayout["keyboard-third-row"],
    ...keyboardLayout["keyboard-fourth-row"],
    ...keyboardLayout["keyboard-fifth-row"]
];

const textToSpeechMenuButtons = [
    "button-main-menu", // ID for Main Menu button
    "key-button-settings", // ID for Settings button
    "key-button-outlet", // ID for Outlet Controls button
    "key-button-music", // ID for Music button
    "key-button-tv-controls", // ID for TV Controls button
    "key-button-ask-something", // ID for 'I’d Like To Ask You Something' button
    "key-button-starts-with", // ID for 'It Starts With...' button
    "key-no", // ID for 'No' button
    "key-yes", // ID for 'Yes' button
    "key-quick-phrases" // ID for Quick Phrases button, if it's interactive
];

// Note: Ensure IDs like "button-main-menu", "key-button-settings", etc., 
// match the actual IDs in your HTML for the corresponding buttons.

/*
---------------------------------------
            Global Vars
---------------------------------------
*/
let singleInputMode = true
var selectedIndex = -1
var selectedMenuOrder
var previousElement
var previousColor
var cycleTimeout
var cycleTime =  1000  //2000

/*
--------------------------------------------------
                INITIALIZATION
--------------------------------------------------
*/
function init() {
    // setTime();
    eel.loadConfig()
    for(button of document.getElementsByTagName('button')){
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
__________________________________________________________________________________________________________________
                                        MENU CHANGE FUNCTIONS
__________________________________________________________________________________________________________________
*/
function openSubmenu(event, supermenuId, submenuId) {
    if (event) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId);
    let submenu = document.getElementById(submenuId);

    if (supermenu && submenu) {
        supermenu.style.display = 'none';
        submenu.style.display = 'block';
        changeMenu(submenuId); // Update the cycle to the new submenu
    }
}

function changeMenu(submenuId) {
    const newFocus = submenuFocusMapping[submenuId] || mainMenuButtons; // Fallback to mainMenuButtons
    switchFocus(newFocus);
}

// Updated switchFocus function to accept arrays directly
function switchFocus(newFocusArray) {
    currentFocus = newFocusArray;
    currentIndex = 0; // Reset index for new focus area
    cycling = false; // Ensure cycling is reset
    highlightCurrentButton(); // Update the highlight based on new focus
}


function accessibilityMouseClick(e) {
    if (e != undefined) e.stopPropagation()
    if (singleInputMode) {  // Something keeps reseting body.click to accessibilityMouseClick, check to fix error
        // document.body.onclick = e => {} // Changed to onpointerdown event for Jane
        document.body.onpointerdown = e => {}
        selectedElement = document.getElementById(selectedMenuOrder[selectedIndex])
        // selectedElement.click(); // Changed to pointerdown for Jane
        selectedElement.onpointerdown()
        // document.body.onclick = e => accessibilityMouseClick() // Changed to onpointerdown event for jane
        document.body.onpointerdown = e => accessibilityMouseClick()
    }
}
/*
___________________________________________________________________________________________
                                CYCLE SELECTION CODE
___________________________________________________________________________________________
*/
// Adapted highlightCurrentButton to use currentFocus array
function highlightCurrentButton() {
    // Clear existing highlights
    document.querySelectorAll('.highlighted').forEach(elem => {
        elem.classList.remove('highlighted');
    });
    
    // Check if there's an element to highlight
    if(currentIndex < currentFocus.length) {
        const currentElementId = currentFocus[currentIndex];
        const currentElement = document.getElementById(currentElementId);
        if (currentElement) {
            currentElement.classList.add('highlighted');
        }
    }
}

// Adapt cycleButtons to work with the currentFocus array
function cycleButtons() {
    if (!cycling) return; // Stop cycling if flag is false
    currentIndex = (currentIndex + 1) % currentFocus.length; // Use currentFocus length
    highlightCurrentButton();
    setTimeout(cycleButtons, 500); // Continue cycling every 500ms
}

// Initialize cycleButtons on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Potentially other initialization code
    
    // Example to start cycling - you might want to trigger this differently
    document.addEventListener('mousedown', () => {
        cycling = true;
        cycleButtons();
    });

    document.addEventListener('mouseup', () => {
        if (cycling) {
            cycling = false; // Stop cycling
            selectButton(); // Trigger the action for the selected button
        }
    });
});

// Select the current button based on currentIndex and currentFocus
function selectButton() {
    if(currentFocus && currentIndex < currentFocus.length) {
        const selectedElementId = currentFocus[currentIndex];
        const selectedElement = document.getElementById(selectedElementId);
        selectedElement.click();
    }
}
/*
--------------------------------------------------
            RF CONTROLLER CODE
--------------------------------------------------
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

function clearPhrase(){
    var textBox = document.getElementById("phrase-text-box");
    textBox.innerText = '';
}

function speakYes() {
    eel.speak_yes();  // Call the Python function
}
function speakNo(){
    eel.speak_no();
}
function speakItStarts(){
    eel.speak_it_starts();
}
function speakCanIAsk(){
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
_________________________________________________________________________________________________
                                MUSIC PLAYER CONTROL FUNCTIONS
__________________________________________________________________________________________________
*/
function setMusicDirectory(directory){
    eel.set_music_directory(directory);
}
function playClassicalMusic() {
    setMusicDirectory('classical'); // Set music directory to classical
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Classical/Ave Maria (after J.S. Bach).mp3', 'classical'); // Play the first song (replace with actual song name)
}

function playChristianMusic() {
    setMusicDirectory('christian'); // Set music directory to christian
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Sample Christian 2/[SPOTIFY-DOWNLOADER.COM] Amazing Grace.mp3', 'christian'); // Play the first song (replace with actual song name)
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

/*
--------------------------------------------------
                Config
--------------------------------------------------
*/

function storeConfig(setting, value){
    eel.storeConfig(setting, value)
}

eel.expose(loadConfig)
function loadConfig(config){

    cycleTime = config.cycleTime
    charLimit = config.charLimit
    plugLabels = config.plugLabels

    updateLabels()
}

var timeToSeconds = {
    "500" : "&frac12; Second",
    "1000": "1 Second",
    "1500": "1 &frac12; Seconds",
    "2000": "2 Seconds"
}

function updateLabels(){
    for (var label in plugLabels){
        document.getElementById("plug-" + label).innerHTML = plugLabels[label]
    }
    document.getElementById("speed-label").innerHTML = "Current Speed: " + timeToSeconds[cycleTime]
}

function setCycleTime(event, time){
    if (event != undefined) event.stopPropagation()
    storeConfig('cycleTime', time)
    cycleTime = time
    updateLabels()
}