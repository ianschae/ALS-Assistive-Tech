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

const mainMenuOrder = [
    "plugs"
    ,"keyboard"
    ,"settings"
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

const keyboardMenuOrder = [
    "keyboard-new-btn"
    ,"keyboard-menu-btn"
]

let dynamicKeyboardOrder = [] // Used for single input mode

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

const changeMenu = (e, newMenuID) => {
    if (e != undefined) e.stopPropagation()
    let currentMenu = document.getElementById(e.currentTarget.id)
                              .parentElement
    let newMenu = document.getElementById(newMenuID)

    if (singleInputMode) resetCycle(newMenuID)

    currentMenu.style.visibility = 'hidden'
    newMenu.style.visibility = 'visible'
}


function closeSubmenu(event, supermenuId, submenuId) {
    if (event != undefined) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId)
    let submenu = document.getElementById(submenuId)
    
    if (singleInputMode) resetCycle(supermenuId)
    
    submenu.style.visibility = 'hidden'
    supermenu.style.visibility = 'visible'
}

function openSubmenu(event, supermenuId, submenuId) {
    if (event != undefined) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId);
    let submenu = document.getElementById(submenuId);

    if (supermenu && submenu) {
        supermenu.style.display = 'none'; // Hide the supermenu
        submenu.style.display = 'block'; // Show the submenu
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

function cycleSelection() {
    if (previousElement != null) previousElement.style.backgroundColor = previousColor;
    selectedIndex = (selectedIndex + 1) % selectedMenuOrder.length
    var hoveredElement = document.getElementById(selectedMenuOrder[selectedIndex])
    previousElement = hoveredElement
    previousColor = previousElement.style.backgroundColor;
    hoveredElement.style.backgroundColor = "orange";
    // Handle Hover Element Highlighting
    // console.log(selectedMenuOrder[selectedIndex])
    cycleTimeout = setTimeout(cycleSelection, cycleTime)
}

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
Keyboard Globals
--------------------------------------------------
*/

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
    textBox.innerText += char;
}
eel.expose(addToPhrase);

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
}
eel.expose(speakPhrase);

/*
--------------------------------------------------
TV Control Functions
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
function playSong(filePath) {
    eel.play_song(filePath); // filePath is the path to the song file
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