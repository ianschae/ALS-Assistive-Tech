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
    "t2s"
    ,"tv"
    ,"music"
    ,'outlet'
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

function setTime() {
    const currTime = new Date();
    let hr = currTime.getHours();
    let min = currTime.getMinutes();
    let amPm = "AM"
    if (min < 10) {
        min = "0" + min;
    }
    if (hr >= 12) {
        hr = hr % 12;
        amPm = "PM";
    }
    if (hr == 0) {
        hr = 12;
    }
    document.getElementById("time").innerHTML = "<h2>" + hr + ":" + min + " " + amPm + "</h2>";
    setTimeout(setTime, 1000);
}

function resetMouse(event){
    if (event != undefined) event.stopPropagation()
    eel.resetMouse()
}

/*
----------------------------------------------
Menu Control Functions
----------------------------------------------
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

function openSubmenu(event, supermenuId, submenuId) {
    if (event != undefined) event.stopPropagation();
    let supermenu = document.getElementById(supermenuId)
    let submenu = document.getElementById(submenuId)

    if (singleInputMode) resetCycle(submenuId)

    supermenu.style.visibility = 'hidden'
    submenu.style.visibility = 'visible'
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

    //if (singleInputMode) resetCycle(supermenuId)

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
    
    do {
        selectedIndex = (selectedIndex + 1) % selectedMenuOrder.length;
        var hoveredElement = document.getElementById(selectedMenuOrder[selectedIndex]);
    } while (hoveredElement && hoveredElement.offsetParent === null);

    if (hoveredElement) {
        previousElement = hoveredElement;
        previousColor = previousElement.style.backgroundColor;
        hoveredElement.style.backgroundColor = "orange";
    }

    cycleTimeout = setTimeout(cycleSelection, cycleTime);
}
document.addEventListener('click', function() {
    selectButton();
});

function selectButton() {
    clearInterval(cycleTimeout); // Stop cycling

    if (previousElement) {
        // Trigger the action for the selected button
        previousElement.click();
    }

    // Optional: Restart cycling
    // startButtonCycle();
}
window.onload = function() {
    selectedMenuOrder = mainMenuOrder; // or any default menu order
    cycleSelection();
};


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
function addToPhrase(char) {
    var textBox = document.getElementById("phrase-text-box");
    textBox.innerText += char;
}
let msgHistory = {
    "topRow": ""
    ,"middleRow": ""
    ,"editRow": ""
}

const msgElements = {
    "topRow": document.getElementById("text-string-top")
    ,"middleRow": document.getElementById("text-string-middle")
    ,"editRow": document.getElementById("text-string-bottom")
}
/*
let alphaKeyboardInnerHTML = `
<div id="keyboard-row-1" class="keyboard-row alpha-keyboard-row">
    <button id="done-key"       class="keyboard-button alpha-keyboard" onpointerdown="endNewMessage(event)">DONE</button>    
    <button id="space-key"      class="keyboard-button alpha-keyboard" value=" " onpointerdown="updateEditString(event, this.value)">SPACE</button>    
    <button id="delete-key"     class="keyboard-button alpha-keyboard" value="del" onpointerdown="updateEditString(event, this.value)">BKSP</button>
    <button id="num-alpha-key"  class="keyboard-button alpha-keyboard" value="num" onpointerdown="changeAlphanumericMode(event, this.value)">NUM</button>
</div>
<div id="keyboard-row-2" class="keyboard-row alpha-keyboard-row">
    <button id="A-key" class="keyboard-button alpha-key" value="A" onpointerdown="updateEditString(event, this.value)">A</button>
    <button id="B-key" class="keyboard-button alpha-key" value="B" onpointerdown="updateEditString(event, this.value)">B</button>
    <button id="C-key" class="keyboard-button alpha-key" value="C" onpointerdown="updateEditString(event, this.value)">C</button>
    <button id="D-key" class="keyboard-button alpha-key" value="D" onpointerdown="updateEditString(event, this.value)">D</button>
</div>
<div id="keyboard-row-3" class="keyboard-row alpha-keyboard-row">
    <button id="E-key" class="keyboard-button alpha-key" value="E" onpointerdown="updateEditString(event, this.value)">E</button>
    <button id="F-key" class="keyboard-button alpha-key" value="F" onpointerdown="updateEditString(event, this.value)">F</button>
    <button id="G-key" class="keyboard-button alpha-key" value="G" onpointerdown="updateEditString(event, this.value)">G</button>
    <button id="H-key" class="keyboard-button alpha-key" value="H" onpointerdown="updateEditString(event, this.value)">H</button>
</div>
<div id="keyboard-row-4" class="keyboard-row alpha-keyboard-row">
    <button id="I-key" class="keyboard-button alpha-key" value="I" onpointerdown="updateEditString(event, this.value)">I</button>
    <button id="J-key" class="keyboard-button alpha-key" value="J" onpointerdown="updateEditString(event, this.value)">J</button>
    <button id="K-key" class="keyboard-button alpha-key" value="K" onpointerdown="updateEditString(event, this.value)">K</button>
    <button id="L-key" class="keyboard-button alpha-key" value="L" onpointerdown="updateEditString(event, this.value)">L</button>
</div>
<div id="keyboard-row-5" class="keyboard-row alpha-keyboard-row">
    <button id="M-key" class="keyboard-button alpha-key" value="M" onpointerdown="updateEditString(event, this.value)">M</button>
    <button id="N-key" class="keyboard-button alpha-key" value="N" onpointerdown="updateEditString(event, this.value)">N</button>
    <button id="O-key" class="keyboard-button alpha-key" value="O" onpointerdown="updateEditString(event, this.value)">O</button>
    <button id="P-key" class="keyboard-button alpha-key" value="P" onpointerdown="updateEditString(event, this.value)">P</button>
</div>
<div id="keyboard-row-6" class="keyboard-row alpha-keyboard-row">
    <button id="Q-key" class="keyboard-button alpha-key" value="Q" onpointerdown="updateEditString(event, this.value)">Q</button>
    <button id="R-key" class="keyboard-button alpha-key" value="R" onpointerdown="updateEditString(event, this.value)">R</button>
    <button id="S-key" class="keyboard-button alpha-key" value="S" onpointerdown="updateEditString(event, this.value)">S</button>
    <button id="T-key" class="keyboard-button alpha-key" value="T" onpointerdown="updateEditString(event, this.value)">T</button>
</div>
<div id="keyboard-row-7" class="keyboard-row alpha-keyboard-row">
    <button id="U-key" class="keyboard-button alpha-key" value="U" onpointerdown="updateEditString(event, this.value)">U</button>
    <button id="V-key" class="keyboard-button alpha-key" value="V" onpointerdown="updateEditString(event, this.value)">V</button>
    <button id="W-key" class="keyboard-button alpha-key" value="W" onpointerdown="updateEditString(event, this.value)">W</button>
    <button id="X-key" class="keyboard-button alpha-key" value="X" onpointerdown="updateEditString(event, this.value)">X</button>
</div>
<div id="keyboard-row-8" class="keyboard-row alpha-keyboard-row">
    <button id="Y-key" class="keyboard-button alpha-key" value="Y" onpointerdown="updateEditString(event, this.value)">Y</button>
    <button id="Z-key" class="keyboard-button alpha-key" value="Z" onpointerdown="updateEditString(event, this.value)">Z</button>
    <button id="period-key"      class="keyboard-button" value="." onpointerdown="updateEditString(event, this.value)">.</button>
    <button id="question-mark-key"  class="keyboard-button" value="?" onpointerdown="updateEditString(event, this.value)">?</button>
</div>
`

let numericKeyboardInnerHTML = `
<div id="keyboard-row-1" class="keyboard-row num-keyboard-row">
    <button id="done-key"       class="keyboard-button alpha-keyboard" onpointerdown="endNewMessage(event)">DONE</button>    
    <button id="space-key"      class="keyboard-button alpha-keyboard" value=" " onpointerdown="updateEditString(event, this.value)">SPACE</button>    
    <button id="delete-key"     class="keyboard-button alpha-keyboard" value="del" onpointerdown="updateEditString(event, this.value)">BKSP</button>
    <button id="num-alpha-key"  class="keyboard-button alpha-keyboard" value="alpha" onpointerdown="changeAlphanumericMode(event, this.value)">ALPHA</button>
</div>
<div id="keyboard-row-2" class="keyboard-row num-keyboard-row">
    <button id="1-key" class="keyboard-button alpha-key" value="1" onpointerdown="updateEditString(event, this.value)">1</button>
    <button id="2-key" class="keyboard-button alpha-key" value="2" onpointerdown="updateEditString(event, this.value)">2</button>
    <button id="3-key" class="keyboard-button alpha-key" value="3" onpointerdown="updateEditString(event, this.value)">3</button>
    <button id="4-key" class="keyboard-button alpha-key" value="4" onpointerdown="updateEditString(event, this.value)">4</button>
</div>
<div id="keyboard-row-3" class="keyboard-row num-keyboard-row">
    <button id="5-key" class="keyboard-button alpha-key" value="5" onpointerdown="updateEditString(event, this.value)">5</button>
    <button id="6-key" class="keyboard-button alpha-key" value="6" onpointerdown="updateEditString(event, this.value)">6</button>
    <button id="7-key" class="keyboard-button alpha-key" value="7" onpointerdown="updateEditString(event, this.value)">7</button>
    <button id="8-key" class="keyboard-button alpha-key" value="8" onpointerdown="updateEditString(event, this.value)">8</button>
</div>
<div id="keyboard-row-4" class="keyboard-row num-keyboard-row">
    <button id="9-key" class="keyboard-button alpha-key" value="9" onpointerdown="updateEditString(event, this.value)">9</button>
    <button id="0-key" class="keyboard-button alpha-key" value="0" onpointerdown="updateEditString(event, this.value)">0</button>
    <button id=".-key" class="keyboard-button alpha-key" value="." onpointerdown="updateEditString(event, this.value)">.</button>
    <button id="$-key" class="keyboard-button alpha-key" value="$" onpointerdown="updateEditString(event, this.value)">$</button>
</div>
<div id="keyboard-row-5" class="keyboard-row num-keyboard-row">
<button id="comma-key" class="keyboard-button alpha-key" value="," onpointerdown="updateEditString(event, this.value)">,</button>
<button id="colon-key" class="keyboard-button alpha-key" value=":" onpointerdown="updateEditString(event, this.value)">:</button>
    <button id="AM-key" class="keyboard-button alpha-key" value="AM" onpointerdown="updateEditString(event, this.value)">AM</button>
    <button id="PM-key" class="keyboard-button alpha-key" value="PM" onpointerdown="updateEditString(event, this.value)">PM</button>
</div> 
`

let keyboardSuperMenuInnerHTML =`
<button id="keyboard-new-btn"  class="menu-button" onpointerdown="startNewMessage(event)">NEW</button>
<button id="keyboard-menu-btn" class="menu-button" onpointerdown="closeSubmenu(event, 'main-menu', 'keyboard-menu')">MENU</button>
`

let kbAttachPoint = document.getElementById('keyboard-attach-point')
let editString = ""
let charLimit = 30
const positionIndicator = "|"
*/
/*
--------------------------------------------------
Keyboard Functions
--------------------------------------------------
*/

const updateEditRowDisplay = () => {
    msgElements["editRow"].innerText  =  editString + positionIndicator
}

const startNewMessage = (e) => {
    resetMouse(e)
    // Update the message history and clear row that will be edited.
    msgElements["topRow"].innerText    = msgElements["middleRow"].innerText
    msgElements["middleRow"].innerText = msgElements["editRow"].innerText
    
    editString = "" // Clear the string that will be modified by keypresses
    updateEditRowDisplay()
 
    // Show keyboard
    kbAttachPoint.innerHTML = alphaKeyboardInnerHTML
    // setKeyboardRowCycle() // Used with grid select keyboard
    janesKeyboardSelection()
}


const endNewMessage = (e) => {
    if (e != undefined) e.stopPropagation()
    resetMouse(e)

    // Update the message strings in memory and call eel function to save messge history.
    msgHistory["topRow"]    = msgElements["topRow"].innerText
    msgHistory["middleRow"] = msgElements["middleRow"].innerText
    msgHistory["editRow"]   = editString

    // Remove the position indicator
    msgElements["editRow"].innerText  =  editString

    // Call eel update function when available

    kbAttachPoint.innerHTML = keyboardSuperMenuInnerHTML
    resetCycle("keyboard-menu")
}

const updateEditString = (e,char) => {
    if (e != undefined) e.stopPropagation()
    resetMouse(e)
    if (char != 'del') {
        editString += char
        if (editString.length >= charLimit){
            var splitter = editString.indexOf(' ') >=0 ? editString.lastIndexOf(' '): 44
            var spillover = editString.substring(splitter)
            editString = editString.substring(0, splitter)
            endNewMessage(e)
            startNewMessage()
            editString = spillover
        }
    } else {
        if (editString.length > 0) editString = editString.slice(0, -1)
    }
 
    updateEditRowDisplay()
    resetCycle('dynamic-kb')
    // setKeyboardRowCycle() // Used with grid select keyboard
}

const changeAlphanumericMode = (e, mode) => {
    if (e != undefined) e.stopPropagation()
    resetMouse(e)
    if (mode == 'num') {
        kbAttachPoint.innerHTML = numericKeyboardInnerHTML
    } else if (mode == 'alpha') {
        kbAttachPoint.innerHTML = alphaKeyboardInnerHTML
    }
    // setKeyboardRowCycle() // Use with grid select keyboard
    janesKeyboardSelection()
}

// janesKeyboardSelection is custom to a request by Jane and her caretakers. This goes through all
// keys one at a time to select the button needed.
const janesKeyboardSelection = () => {
    if (singleInputMode) {
        const newArr = document.getElementsByClassName('keyboard-button')
        dynamicKeyboardOrder = []
        for (let ele of newArr) {
            dynamicKeyboardOrder.push(ele.id)
        }
        menuIdMapping['dynamic-kb'] = dynamicKeyboardOrder
        resetCycle('dynamic-kb')
    }
}


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
MUSIC PLAYER CONTROL FUNCTIONS

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