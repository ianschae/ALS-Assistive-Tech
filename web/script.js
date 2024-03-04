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
    ,"main-menu-btn"
]

const plugSubmenuOrder = [
    "plug-submenu-on",
    "plug-submenu-off",
    "plug-submenu-cancel"
]


const settingsMenuOrder = [
    "single-input"
    ,"touch-mouse"
    ,"configure-speed"
    ,"settings-back"
]

const speedMenuOrder = [
    "speed-500"
    ,"speed-1000"
    ,"speed-1500"
    ,"speed-2000"
    ,"speed-back"

]

let menuIdMapping = {
    "plug-select" : plugSelectOrder,
    "plug-submenu": plugSubmenuOrder
    ,"main-menu": mainMenuOrder
    ,"settings-menu": settingsMenuOrder
    ,"keyboard-menu": keyboardMenuOrder
    ,"dynamic-kb": dynamicKeyboardOrder
    ,"configure-speed-menu": speedMenuOrder
}

let plugLabels = {
    "1" : "Plug 1",
    "2" : "PLug 2",
    "3" : "Plug 3",
    "4" : "Plug 4",
    "5" : "Plug 5"
}
/*
_____________________________________________________________________________________________________
                                            MAIN MENU CONSTANTS
_____________________________________________________________________________________________________
*/
const menuContainer = document.getElementById('main-menu');
const menuItems = menuContainer.querySelectorAll('.button-text-speech, .button-TV-controls, .button-music, .button-outlet, .button-settings');

/*
_____________________________________________________________________________________________________
                                            T2S/KEYBOARD CONSTANTS
_____________________________________________________________________________________________________
*/
const t2sContainer = document.getElementById('text-2-speech');
const t2sItems = t2sContainer.querySelectorAll('.button-yes, .button-no, .button-starts-with, .button-ask-something, .button-large, .keyboard, .button-TV-controls, .button-music, .button-outlet, .button-settings, .button-main-menu')
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
function resetMouse(event){
    if (event != undefined) event.stopPropagation()
    eel.resetMouse()
}
*/

let currentContainer;
let currentItems;

function openSubmenu(event, supermenuId, submenuId) {
    if (event != undefined) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId);
    let submenu = document.getElementById(submenuId);

    if (supermenu && submenu) {
        supermenu.style.display = 'none'; // Hide the supermenu
        submenu.style.display = 'block'; // Show the submenu

        if(submenuId === 'main-menu'){
            currentContainer = menuContainer;
            currentItems = menuItems;
        }
        if(submenuId === 'text-2-speech'){
            currentContainer = t2sContainer;
            currentItems = t2sItems;
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
        document.body.onpointerdown = e => {}
        selectedElement = document.getElementById(selectedMenuOrder[selectedIndex])
        // selectedElement.click(); // Changed to pointerdown for Jane
        selectedElement.onpointerdown()
        // document.body.onclick = e => accessibilityMouseClick() // Changed to onpointerdown event for jane
        document.body.onpointerdown = e => accessibilityMouseClick()
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let cycleTimeout;
    let currentIndex = 0;
    let cycling = false;

    // Assume these are defined globally and updated by other parts of your script, such as openSubmenu
    let currentContainer;
    let currentItems;

    const highlightItem = (index) => {
        // First, remove highlight from all items
        if (currentItems) {
            currentItems.forEach(item => {
                const overlapGroup = item.querySelector('.overlap-group');
                if (overlapGroup) {
                    overlapGroup.classList.remove('highlighted');
                }
            });
        }
        // Then, add highlight to the current item
        if (currentItems && currentItems[index]) {
            const currentOverlapGroup = currentItems[index].querySelector('.overlap-group');
            if (currentOverlapGroup) {
                currentOverlapGroup.classList.add('highlighted');
            }
        }
    };

    const cycleItems = () => {
        if (!cycling || !currentItems) return;
        highlightItem(currentIndex);
        currentIndex = (currentIndex + 1) % currentItems.length; // Adjust to current items length
        cycleTimeout = setTimeout(cycleItems, 1000);
    };

    // Replace menuContainer with dynamic container listener setup
    document.addEventListener('pointerdown', function(event) {
        if (currentContainer && currentContainer.contains(event.target)) {
            cycling = true;
            cycleItems();
        }
    });

    document.addEventListener('pointerup', function() {
        if (!cycling) return;
        clearTimeout(cycleTimeout);
        cycling = false;
        if (currentItems) {
            const selectedItemIndex = (currentIndex === 0 ? currentItems.length : currentIndex) - 1;
            currentItems[selectedItemIndex]?.click(); // Safely attempt to click the highlighted item
        }
    });
});


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
    playSong('/Users/ianschaefer/ALS-Assistive-Tech/Music/Classical/[SPOTIFY-DOWNLOADER.COM] Ave Maria (after J.S. Bach).mp3', 'classical'); // Play the first song (replace with actual song name)
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